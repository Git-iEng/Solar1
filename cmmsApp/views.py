from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse, FileResponse, Http404
from django.urls import reverse
from django.conf import settings
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.core.mail import get_connection, EmailMultiAlternatives
from django.contrib import messages
from django.utils import timezone
from django.views.decorators.http import require_POST
from django.core import signing
from django.contrib.staticfiles.storage import staticfiles_storage
from django.contrib.staticfiles import finders

from threading import Thread
from pathlib import Path

import mimetypes
import re
import secrets
import hashlib
import hmac
import time
import os

import phonenumbers
import pycountry
import requests

from .forms import ContactForm
from .utils_contact import (
    normalize_phone_and_country,
    country_name_from_alpha2,
)


# ============================================================
# VALIDATION
# ============================================================

NAME_RE = re.compile(
    r"^[A-Za-z\s'.-]{2,}$"
)

PHONE_RE = re.compile(
    r"^\+?\d[\d\s\-()]{6,}$"
)


# ============================================================
# EMAIL HELPERS
# ============================================================

def _send_email(
    subject: str,
    text_body: str,
    html_body: str | None,
    recipients: list[str] | None
):

    try:

        if not recipients:

            fallback = (
                getattr(
                    settings,
                    "EMAIL_HOST_USER",
                    None
                )
                or
                getattr(
                    settings,
                    "DEFAULT_FROM_EMAIL",
                    None
                )
            )

            recipients = (
                [fallback]
                if fallback
                else []
            )


        if not recipients:

            print(
                "EMAIL WARNING: no recipients configured"
            )

            return


        connection = get_connection(
            timeout=getattr(
                settings,
                "EMAIL_TIMEOUT",
                15
            )
        )


        message = EmailMultiAlternatives(

            subject=subject,

            body=text_body,

            from_email=(
                getattr(
                    settings,
                    "DEFAULT_FROM_EMAIL",
                    None
                )
                or
                getattr(
                    settings,
                    "EMAIL_HOST_USER",
                    None
                )
            ),

            to=recipients,

            connection=connection
        )


        if html_body:

            message.attach_alternative(
                html_body,
                "text/html"
            )


        message.send(
            fail_silently=False
        )


    except Exception as e:

        print(
            "EMAIL ERROR:",
            repr(e)
        )



def _send_demo_email_async(
    subject: str,
    text_body: str,
    html_body: str | None = None
):

    recipients = (
        getattr(
            settings,
            "DEMO_RECIPIENTS",
            None
        )
        or
        getattr(
            settings,
            "CONTACT_RECIPIENTS",
            None
        )
    )


    Thread(
        target=_send_email,
        args=(
            subject,
            text_body,
            html_body,
            recipients
        ),
        daemon=True
    ).start()



def _send_contact_email_async(
    subject: str,
    text_body: str,
    html_body: str | None = None
):

    recipients = getattr(
        settings,
        "CONTACT_RECIPIENTS",
        None
    )


    Thread(
        target=_send_email,
        args=(
            subject,
            text_body,
            html_body,
            recipients
        ),
        daemon=True
    ).start()


# ============================================================
# CONTACT EMAIL OTP
# ============================================================

# OTP expires after 3 minutes
CONTACT_OTP_EXPIRY_SECONDS = 3 * 60

# User must wait 60 seconds before requesting another OTP
CONTACT_OTP_RESEND_SECONDS = 60

# Maximum incorrect OTP attempts
CONTACT_OTP_MAX_ATTEMPTS = 5

# After successful OTP verification,
# allow 15 minutes to submit the contact form
CONTACT_VERIFICATION_TOKEN_MAX_AGE = 15 * 60

CONTACT_OTP_SESSION_KEY = (
    "contact_email_otp"
)

CONTACT_VERIFIED_SESSION_KEY = (
    "contact_email_verified"
)

CONTACT_VERIFICATION_SALT = (
    "contact-email-verification-v1"
)


# ============================================================
# NORMALISE EMAIL
# ============================================================

def _normalise_email(
    email: str
) -> str:

    return (
        email
        or ""
    ).strip().lower()


# ============================================================
# HASH OTP
# ============================================================

def _hash_contact_otp(
    email: str,
    otp: str
) -> str:

    message = (
        f"{_normalise_email(email)}|{otp}"
    ).encode(
        "utf-8"
    )


    key = settings.SECRET_KEY.encode(
        "utf-8"
    )


    return hmac.new(
        key,
        message,
        hashlib.sha256
    ).hexdigest()


# ============================================================
# SEND OTP EMAIL
# ============================================================

def _send_contact_otp_email(
    email: str,
    otp: str
) -> None:

    subject = (
        "iEngineering Email Verification Code"
    )


    text_body = (

        "Hello,\n\n"

        "Please use the following OTP to verify "
        "your email address for your iEngineering "
        "website inquiry.\n\n"

        f"Verification code: {otp}\n\n"

        "This OTP will expire in 3 minutes.\n\n"

        "If you did not request this verification, "
        "please ignore this email.\n"

    )


    html_body = f"""

    <div
        style="
            font-family:Arial,sans-serif;
            max-width:560px;
            margin:auto;
            padding:20px;
        "
    >

        <h2
            style="
                margin-bottom:10px;
                color:#176f73;
            "
        >
            Verify your email address
        </h2>


        <p>
            Please use the following OTP to verify
            your email address for your iEngineering
            website inquiry.
        </p>


        <div
            style="
                font-size:30px;
                font-weight:700;
                letter-spacing:8px;
                padding:16px 20px;
                background:#f3f6f7;
                border-radius:10px;
                display:inline-block;
                margin:10px 0 18px;
            "
        >

            {otp}

        </div>


        <p>
            This OTP will expire in
            <strong>3 minutes</strong>.
        </p>


        <p
            style="
                color:#667085;
                font-size:13px;
            "
        >
            If you did not request this verification,
            please ignore this email.
        </p>

    </div>

    """


    connection = get_connection(

        timeout=getattr(
            settings,
            "EMAIL_TIMEOUT",
            15
        )

    )


    message = EmailMultiAlternatives(

        subject=subject,

        body=text_body,

        from_email=(
            getattr(
                settings,
                "DEFAULT_FROM_EMAIL",
                None
            )
            or
            getattr(
                settings,
                "EMAIL_HOST_USER",
                None
            )
        ),

        to=[email],

        connection=connection

    )


    message.attach_alternative(
        html_body,
        "text/html"
    )


    message.send(
        fail_silently=False
    )


# ============================================================
# SEND OTP EMAIL (ASYNC WRAPPER)
# ============================================================
#
# Runs _send_contact_otp_email() in a background thread so the
# HTTP request returns immediately instead of blocking on the
# SMTP handshake/send. This avoids Gunicorn/nginx timeouts when
# the mail server is slow to respond.
# ============================================================

def _send_contact_otp_email_async(
    email: str,
    otp: str
) -> None:

    Thread(
        target=_send_contact_otp_email,
        args=(
            email,
            otp
        ),
        daemon=True
    ).start()


# ============================================================
# SEND OTP API
# ============================================================

@require_POST
def send_email_otp(
    request
):


    email = _normalise_email(

        request.POST.get(
            "email"
        )

    )


    # --------------------------------------------------------
    # Validate email
    # --------------------------------------------------------

    try:

        validate_email(
            email
        )


    except ValidationError:

        return JsonResponse(
            {
                "ok": False,

                "message":
                    "Please enter a valid email address."
            },
            status=400
        )


    now = int(
        time.time()
    )


    current = request.session.get(
        CONTACT_OTP_SESSION_KEY
    )


    # --------------------------------------------------------
    # Resend cooldown
    # --------------------------------------------------------

    if (
        current
        and
        current.get("email") == email
    ):


        sent_at = int(
            current.get(
                "sent_at",
                0
            )
        )


        remaining = (
            CONTACT_OTP_RESEND_SECONDS
            -
            (
                now
                -
                sent_at
            )
        )


        if remaining > 0:

            return JsonResponse(
                {
                    "ok": False,

                    "message":
                        f"Please wait {remaining} seconds "
                        "before requesting another OTP.",

                    "retry_after":
                        remaining
                },
                status=429
            )


    # --------------------------------------------------------
    # Generate random 6-digit OTP
    # --------------------------------------------------------

    otp = (
        f"{secrets.randbelow(1_000_000):06d}"
    )


    # --------------------------------------------------------
    # Store hashed OTP in session
    # --------------------------------------------------------

    request.session[
        CONTACT_OTP_SESSION_KEY
    ] = {

        "email":
            email,

        "otp_hash":
            _hash_contact_otp(
                email,
                otp
            ),

        "expires_at":
            now
            +
            CONTACT_OTP_EXPIRY_SECONDS,

        "sent_at":
            now,

        "attempts":
            0

    }


    # Previous email verification becomes invalid

    request.session.pop(
        CONTACT_VERIFIED_SESSION_KEY,
        None
    )


    request.session.modified = True


    # --------------------------------------------------------
    # Send OTP email (async, so this request returns fast and
    # does not block on the SMTP handshake/send)
    # --------------------------------------------------------

    _send_contact_otp_email_async(
        email,
        otp
    )


    # --------------------------------------------------------
    # Success
    # --------------------------------------------------------

    return JsonResponse(
        {
            "ok": True,

            "message":
                "OTP sent successfully. "
                "Please check your email.",

            "expires_in":
                CONTACT_OTP_EXPIRY_SECONDS,

            "resend_after":
                CONTACT_OTP_RESEND_SECONDS
        }
    )


# ============================================================
# VERIFY OTP API
# ============================================================

@require_POST
def verify_email_otp(
    request
):


    email = _normalise_email(

        request.POST.get(
            "email"
        )

    )


    otp = (
        request.POST.get(
            "otp"
        )
        or
        ""
    ).strip()


    # --------------------------------------------------------
    # Validate email
    # --------------------------------------------------------

    try:

        validate_email(
            email
        )


    except ValidationError:

        return JsonResponse(
            {
                "ok": False,

                "message":
                    "Please enter a valid email address."
            },
            status=400
        )


    # --------------------------------------------------------
    # Validate OTP format
    # --------------------------------------------------------

    if not re.fullmatch(
        r"\d{6}",
        otp
    ):

        return JsonResponse(
            {
                "ok": False,

                "message":
                    "Please enter the 6-digit OTP."
            },
            status=400
        )


    current = request.session.get(
        CONTACT_OTP_SESSION_KEY
    )


    # --------------------------------------------------------
    # No active OTP
    # --------------------------------------------------------

    if not current:

        return JsonResponse(
            {
                "ok": False,

                "message":
                    "No active OTP was found. "
                    "Please request a new OTP."
            },
            status=400
        )


    # --------------------------------------------------------
    # Check email belongs to OTP
    # --------------------------------------------------------

    if (
        current.get(
            "email"
        )
        !=
        email
    ):

        return JsonResponse(
            {
                "ok": False,

                "message":
                    "This OTP was requested for "
                    "a different email address."
            },
            status=400
        )


    now = int(
        time.time()
    )


    # --------------------------------------------------------
    # Check 3-minute expiry
    # --------------------------------------------------------

    if (
        now
        >
        int(
            current.get(
                "expires_at",
                0
            )
        )
    ):


        request.session.pop(
            CONTACT_OTP_SESSION_KEY,
            None
        )


        request.session.modified = True


        return JsonResponse(
            {
                "ok": False,

                "message":
                    "OTP expired. "
                    "Please request a new OTP."
            },
            status=400
        )


    # --------------------------------------------------------
    # Attempts
    # --------------------------------------------------------

    attempts = int(
        current.get(
            "attempts",
            0
        )
    )


    if (
        attempts
        >=
        CONTACT_OTP_MAX_ATTEMPTS
    ):


        request.session.pop(
            CONTACT_OTP_SESSION_KEY,
            None
        )


        request.session.modified = True


        return JsonResponse(
            {
                "ok": False,

                "message":
                    "Too many incorrect OTP attempts. "
                    "Please request a new OTP."
            },
            status=429
        )


    # --------------------------------------------------------
    # Compare OTP securely
    # --------------------------------------------------------

    entered_hash = (
        _hash_contact_otp(
            email,
            otp
        )
    )


    expected_hash = (
        current.get(
            "otp_hash",
            ""
        )
    )


    if not hmac.compare_digest(
        entered_hash,
        expected_hash
    ):


        attempts += 1


        current[
            "attempts"
        ] = attempts


        request.session[
            CONTACT_OTP_SESSION_KEY
        ] = current


        request.session.modified = True


        remaining_attempts = (
            CONTACT_OTP_MAX_ATTEMPTS
            -
            attempts
        )


        if (
            remaining_attempts
            <=
            0
        ):


            request.session.pop(
                CONTACT_OTP_SESSION_KEY,
                None
            )


            request.session.modified = True


            return JsonResponse(
                {
                    "ok": False,

                    "message":
                        "Too many incorrect OTP attempts. "
                        "Please request a new OTP."
                },
                status=429
            )


        return JsonResponse(
            {
                "ok": False,

                "message":
                    f"Incorrect OTP. "
                    f"{remaining_attempts} attempt(s) remaining."
            },
            status=400
        )


    # ========================================================
    # OTP CORRECT
    # ========================================================

    nonce = (
        secrets.token_urlsafe(
            24
        )
    )


    request.session[
        CONTACT_VERIFIED_SESSION_KEY
    ] = {

        "email":
            email,

        "nonce":
            nonce,

        "verified_at":
            now

    }


    # OTP can only be used once

    request.session.pop(
        CONTACT_OTP_SESSION_KEY,
        None
    )


    request.session.modified = True


    # --------------------------------------------------------
    # Create signed verification token
    # --------------------------------------------------------

    verification_token = signing.dumps(
        {
            "email":
                email,

            "nonce":
                nonce
        },
        salt=
            CONTACT_VERIFICATION_SALT,
        compress=True
    )


    return JsonResponse(
        {
            "ok": True,

            "verified": True,

            "message":
                "Email verified successfully.",

            "verification_token":
                verification_token
        }
    )


# ============================================================
# CHECK VERIFIED EMAIL
# ============================================================

def _is_contact_email_verified(
    request,
    email: str,
    token: str
) -> bool:


    if (
        not email
        or
        not token
    ):

        return False


    # --------------------------------------------------------
    # Decode signed token
    # --------------------------------------------------------

    try:

        payload = signing.loads(

            token,

            salt=
                CONTACT_VERIFICATION_SALT,

            max_age=
                CONTACT_VERIFICATION_TOKEN_MAX_AGE

        )


    except (
        signing.SignatureExpired,
        signing.BadSignature
    ):

        return False


    session_verification = (
        request.session.get(
            CONTACT_VERIFIED_SESSION_KEY
        )
    )


    if not session_verification:

        return False


    email = _normalise_email(
        email
    )


    payload_email = _normalise_email(
        payload.get(
            "email"
        )
    )


    session_email = _normalise_email(
        session_verification.get(
            "email"
        )
    )


    nonce = (
        payload.get(
            "nonce"
        )
        or
        ""
    )


    session_nonce = (
        session_verification.get(
            "nonce"
        )
        or
        ""
    )


    return (

        hmac.compare_digest(
            email,
            payload_email
        )

        and

        hmac.compare_digest(
            email,
            session_email
        )

        and

        hmac.compare_digest(
            nonce,
            session_nonce
        )

    )


# ============================================================
# REMOVE VERIFICATION AFTER SUCCESSFUL SUBMIT
# ============================================================

def _consume_contact_email_verification(
    request
):

    request.session.pop(
        CONTACT_VERIFIED_SESSION_KEY,
        None
    )


    request.session.modified = True


# ============================================================
# HOME
# ============================================================

def home(
    request
):

    return render(
        request,
        "index.html",
        {
            "RECAPTCHA_SITE_KEY":
                settings.RECAPTCHA_SITE_KEY
        }
    )



# ============================================================
# REQUEST DEMO FORM SUBMISSION
# ============================================================

def request_demo_view(request):
    if request.method != "POST":
        return redirect("/")

    # CAPTCHA check
    if not verify_recaptcha(request):
        messages.error(request, "Please complete the CAPTCHA.")
        return redirect(request.META.get("HTTP_REFERER", "/"))

    # Detect AJAX/fetch requests
    wants_json = request.headers.get("x-requested-with") == "XMLHttpRequest"

    full_name = request.POST.get("full_name", "").strip()
    company = request.POST.get("company", "").strip()
    email = request.POST.get("email", "").strip()
    phone = request.POST.get("phone", "").strip()
    country = request.POST.get("country", "").strip()
    address = request.POST.get("address", "").strip()
    message = request.POST.get("message", "").strip()

    errors = {}

    if not NAME_RE.match(full_name):
        errors["full_name"] = "Please enter a valid full name (letters only)."

    if not company:
        errors["company"] = "Company is required."

    try:
        validate_email(email)
    except ValidationError:
        errors["email"] = "Enter a valid email."

    if not PHONE_RE.match(phone):
        errors["phone"] = "Enter a valid phone number."

    if not country:
        errors["country"] = "Select a country."

    if errors:
        if wants_json:
            return JsonResponse({"ok": False, "errors": errors}, status=400)

        for msg in errors.values():
            messages.error(request, msg)

        return redirect(request.META.get("HTTP_REFERER", "/"))

    country_code, dial = (country.split("|", 1) + [""])[:2]

    ts = timezone.now().strftime("%Y-%m-%d %H:%M:%S %Z")
    subject = "New Solar System inquiry"

    text_body = (
        "A new Solar System inquiry request was submitted.\n\n"
        f"Submitted: {ts}\n"
        f"IP: {request.META.get('REMOTE_ADDR', '')}\n\n"
        f"Full name: {full_name}\n"
        f"Company: {company}\n"
        f"Email: {email}\n"
        f"Phone: {phone}\n"
        f"Country: {country_code} {dial}\n"
        f"Address: {address}\n\n"
        "Message:\n"
        f"{message or '(none)'}\n"
        f"From: {request.META.get('HTTP_REFERER', '')}\n"
        f"IP:   {request.META.get('REMOTE_ADDR', '')}\n"
    )

    html_body = f"""
        <h2 style="margin:0 0 8px">New Solar System Inquiry Request</h2>
        <p style="margin:0 0 12px;color:#334">
            Submitted {ts} from {request.META.get('REMOTE_ADDR', '')}
        </p>
        <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;background:#f9fbfc">
            <tr><td><b>Full name</b></td><td>{full_name}</td></tr>
            <tr><td><b>Company</b></td><td>{company}</td></tr>
            <tr><td><b>Email</b></td><td>{email}</td></tr>
            <tr><td><b>Phone</b></td><td>{phone}</td></tr>
            <tr><td><b>Country</b></td><td>{country_code} {dial}</td></tr>
            <tr><td><b>Address</b></td><td>{address}</td></tr>
        </table>
        <p style="margin:12px 0 4px"><b>Message</b></p>
        <pre style="white-space:pre-wrap;font-family:system-ui,Segoe UI,Arial,sans-serif">{message or '(none)'}</pre>
    """

    _send_demo_email_async(subject, text_body, html_body)

    thanks_url = reverse("cmmsApp:contact_thanks")

    if wants_json:
        return JsonResponse({"ok": True, "redirect": thanks_url})

    return redirect(thanks_url)

# ============================================================
# REQUEST DEMO
# ============================================================

def request_demo(
    request
):

    return render(
        request,
        "request_demo_modal.html"
    )


# ============================================================
# CONTACT PAGE
# ============================================================

def contact(
    request
):

    # Use exactly the same contact page/function
    return contact_section(
        request
    )


# ============================================================
# ABOUT
# ============================================================

def about(
    request
):

    return render(
        request,
        "about.html"
    )


# ============================================================
# CONTACT FORM SUBMISSION
# ============================================================

def contact_section(
    request
):


    form = ContactForm(
        request.POST
        or
        None
    )


    # --------------------------------------------------------
    # Invalid form
    # --------------------------------------------------------

    if (
        request.method == "POST"
        and
        not form.is_valid()
    ):

        messages.error(
            request,
            "Please correct the highlighted fields and resubmit."
        )


    # --------------------------------------------------------
    # Valid form
    # --------------------------------------------------------

    if (
        request.method == "POST"
        and
        form.is_valid()
    ):


        cd = (
            form.cleaned_data
        )


        email = _normalise_email(
            cd.get(
                "email",
                ""
            )
        )


        verification_token = (
            request.POST.get(
                "email_verification_token"
            )
            or
            ""
        ).strip()


        # ====================================================
        # IMPORTANT:
        # Server-side email verification check
        # ====================================================

        if not _is_contact_email_verified(
            request,
            email,
            verification_token
        ):


            messages.error(
                request,
                "Please verify your email address before submitting the form."
            )


            return render(
                request,
                "contact_section.html",
                {
                    "form":
                        form,

                    "sent":
                        False,

                    "RECAPTCHA_SITE_KEY":
                        settings.RECAPTCHA_SITE_KEY
                }
            )


        # ----------------------------------------------------
        # Normalize phone and country
        # ----------------------------------------------------

        (
            e164_phone,
            resolved_alpha2,
            resolved_country_name

        ) = normalize_phone_and_country(

            cd.get(
                "phone",
                ""
            ),

            cd.get(
                "country",
                ""
            )

        )


        # ----------------------------------------------------
        # Build contact email
        # ----------------------------------------------------

        subject = (
            "New website contact submission "
            "for Solar System"
        )


        country_name = (

            resolved_country_name

            or

            country_name_from_alpha2(
                resolved_alpha2
            )

            or

            cd.get(
                "country",
                ""
            )

        )


        full_name = (
            f"{cd.get('first_name', '')} "
            f"{cd.get('last_name', '')}"
        ).strip()


        text_body = "\n".join(
            [
                "New contact submission for Solar System",

                "",

                f"Name: {full_name}",

                f"Company: {cd.get('company', '')}",

                f"Email: {email}",

                "Email verified: Yes",

                f"Country: {country_name}",

                f"Phone: {e164_phone or cd.get('phone', '')}",

                "",

                "Message:",

                cd.get(
                    "message",
                    ""
                )
                or
                "(none)"
            ]
        )


        # ----------------------------------------------------
        # Send contact email
        # ----------------------------------------------------

        _send_contact_email_async(
            subject,
            text_body,
            None
        )


        # ----------------------------------------------------
        # Verification token is one-use
        # ----------------------------------------------------

        _consume_contact_email_verification(
            request
        )


        # ----------------------------------------------------
        # Redirect after successful submission
        # ----------------------------------------------------

        return redirect(
            reverse(
                "cmmsApp:contact_thanks"
            )
        )


    # --------------------------------------------------------
    # GET request / invalid POST
    # --------------------------------------------------------

    return render(
        request,
        "contact_section.html",
        {
            "form":
                form,

            "sent":
                request.GET.get(
                    "sent"
                ),

            "RECAPTCHA_SITE_KEY":
                settings.RECAPTCHA_SITE_KEY
        }
    )


# ============================================================
# PHONE COUNTRY HELPER
# ============================================================

def _dial_code_from_alpha2(
    alpha2: str
) -> str:


    if not alpha2:

        return ""


    try:

        country_code = (
            phonenumbers
            .country_code_for_region(
                alpha2.upper()
            )
        )


        return (
            f"+{country_code}"
            if country_code
            else ""
        )


    except Exception:

        return ""


# ============================================================
# PHONE INFO
# ============================================================

def phone_info(
    request
):


    phone = (
        request.GET.get(
            "phone"
        )
        or
        ""
    ).strip()


    country = (
        request.GET.get(
            "country"
        )
        or
        ""
    ).strip()


    (
        e164,
        resolved_alpha2,
        resolved_country_name

    ) = normalize_phone_and_country(

        phone,
        country

    )


    dial = (
        _dial_code_from_alpha2(
            resolved_alpha2
        )
    )


    example = ""


    if (
        dial
        and
        phone
        and
        not phone.startswith("+")
    ):

        example = (
            f"{dial} 4xxxxxxxx"
        )


    elif (
        dial
        and
        not phone
    ):

        example = (
            f"{dial} 4xxxxxxxx"
        )


    return JsonResponse(
        {
            "e164":
                e164,

            "country":
                resolved_country_name,

            "alpha2":
                resolved_alpha2,

            "dial_code":
                dial,

            "example":
                example
        }
    )
def contact_block_submit(request):
    """
    Handles the separate "Get Free Consulting" form.

    Email OTP verification is intentionally handled by contact_section(),
    because contact_section.html is the form that contains the OTP UI.
    """

    if request.method != "POST":
        return redirect(request.META.get("HTTP_REFERER", "/"))

    # CAPTCHA check
    if not verify_recaptcha(request):
        messages.error(request, "Please complete the CAPTCHA.")
        return redirect(request.META.get("HTTP_REFERER", "/"))

    name = (request.POST.get("name") or "").strip()
    email = (request.POST.get("email") or "").strip()
    phone = (request.POST.get("phone") or "").strip()
    country = (request.POST.get("country") or "").strip()
    service = (request.POST.get("service") or "").strip()
    message = (request.POST.get("message") or "").strip()

    errors = []

    if not re.match(r"^[A-Za-z\s'.-]{2,}$", name):
        errors.append("Please enter a valid name.")

    try:
        validate_email(email)
    except ValidationError:
        errors.append("Enter a valid email address.")

    if not re.match(r"^\+?\d[\d\s\-()]{6,}$", phone):
        errors.append("Enter a valid phone number.")

    if not country and not phone.startswith("+"):
        errors.append("Please enter your country.")

    if errors:
        for error in errors:
            messages.error(request, error)

        return redirect(request.META.get("HTTP_REFERER", "/"))

    e164_phone, alpha2, country_name = normalize_phone_and_country(
        phone,
        country,
    )

    dial_code = _dial_code_from_alpha2(alpha2)

    subject = f"[Website] Consulting request: {name} – {service or 'General'}"

    text_body = "\n".join([
        "A new consulting request was submitted for Solar:",
        f"Name: {name}",
        f"Email: {email}",
        f"Phone: {e164_phone or phone} ({dial_code})",
        f"Country: {country_name or country}",
        f"Service: {service}",
        "",
        "Message:",
        message or "(none)",
        "",
        f"From: {request.META.get('HTTP_REFERER', '')}",
        f"IP:   {request.META.get('REMOTE_ADDR', '')}",
    ])

    _send_contact_email_async(subject, text_body, None)

    return redirect(reverse("cmmsApp:contact_thanks"))

# ============================================================
# COUNTRY LIST
# ============================================================

def country_list(
    request
):


    data = []


    for country in pycountry.countries:


        try:

            country_code = (
                phonenumbers
                .country_code_for_region(
                    country.alpha_2
                )
            )


        except Exception:

            country_code = None


        if country_code:

            data.append(
                {
                    "alpha2":
                        country.alpha_2,

                    "name":
                        country.name,

                    "dial":
                        f"+{country_code}"
                }
            )


    data.sort(
        key=lambda item:
            item["name"]
    )


    return JsonResponse(
        data,
        safe=False
    )


# ============================================================
# CONTACT THANK YOU
# ============================================================

def contact_thanks(
    request
):

    return render(
        request,
        "contact_thanks.html",
        {}
    )


# ============================================================
# SITEMAP
# ============================================================

def sitemap(
    request
):

    with staticfiles_storage.open(
        "sitemap.xml"
    ) as sitemap_file:

        return HttpResponse(
            sitemap_file,
            content_type="application/xml"
        )


# ============================================================
# DOWNLOAD CONFIGURATION
# ============================================================

DOWNLOAD_DIR = (
    Path(
        __file__
    ).resolve().parent
    /
    "downloads"
)


_DASHES_RE = re.compile(
    r"[\u2010-\u2015\u2212]+"
)


_SPACES_RE = re.compile(
    r"\s+"
)


def _norm_key(
    value: str
) -> str:


    value = (
        value
        or
        ""
    ).strip().lower()


    value = _DASHES_RE.sub(
        "-",
        value
    )


    value = _SPACES_RE.sub(
        " ",
        value
    )


    return value


DOC_REGISTRY = {

    _norm_key(
        "Australia User Manual Revision"
    ):
        DOWNLOAD_DIR
        /
        "australia-user-manual-revision.pdf",


    _norm_key(
        "Energy Storage Converter 100kW—OS Edition Specification Sheet – 20250826"
    ):
        DOWNLOAD_DIR
        /
        "energy-storage-converter-100kw-os-edition-specification-sheet-20250826.pdf",


    _norm_key(
        "Warranty"
    ):
        DOWNLOAD_DIR
        /
        "warranty.pdf"

}


# ============================================================
# DOWNLOAD TOKEN
# ============================================================

def _sign_download_payload(
    path: str,
    download_name: str,
    ttl_seconds: int = 900
) -> str:


    payload = {

        "p":
            str(path),

        "n":
            download_name,

        "ts":
            timezone.now().timestamp()

    }


    token = signing.dumps(
        payload,
        salt="dl1"
    )


    return (
        reverse(
            "cmmsApp:download_file"
        )
        +
        f"?token={token}"
    )


# ============================================================
# REQUEST DOWNLOAD
# ============================================================

@require_POST
def request_download(
    request
):


    name = (
        request.POST.get(
            "name"
        )
        or
        ""
    ).strip()


    email = (
        request.POST.get(
            "email"
        )
        or
        ""
    ).strip()


    doc_raw = (
        request.POST.get(
            "docName"
        )
        or
        ""
    ).strip()


    doc_key = (
        _norm_key(
            doc_raw
        )
    )


    errors = []


    if (
        not name
        or
        not NAME_RE.match(
            name
        )
    ):

        errors.append(
            "Please enter a valid full name."
        )


    try:

        validate_email(
            email
        )


    except ValidationError:

        errors.append(
            "Enter a valid email address."
        )


    if (
        doc_key
        not in
        DOC_REGISTRY
    ):

        errors.append(
            f"Unknown document: {doc_raw}"
        )


    if errors:

        return JsonResponse(
            {
                "ok":
                    False,

                "error":
                    " ".join(
                        errors
                    )
            },
            status=400
        )


    file_path = Path(
        DOC_REGISTRY[
            doc_key
        ]
    )


    try:

        file_path.resolve().relative_to(
            DOWNLOAD_DIR.resolve()
        )


    except Exception:

        return JsonResponse(
            {
                "ok":
                    False,

                "error":
                    "Invalid file location."
            },
            status=400
        )


    if not file_path.exists():

        return JsonResponse(
            {
                "ok":
                    False,

                "error":
                    f"File not found on server: {file_path.name}"
            },
            status=404
        )


    subject = (
        f"Download request: {doc_raw}"
    )


    text_body = (
        f"Name: {name}\n"
        f"Email: {email}\n"
        f"Requested: {doc_raw}\n"
    )


    _send_contact_email_async(
        subject,
        text_body,
        None
    )


    download_url = (
        _sign_download_payload(
            str(
                file_path
            ),
            file_path.name
        )
    )


    return JsonResponse(
        {
            "ok":
                True,

            "email":
                email,

            "doc":
                doc_raw,

            "download_url":
                download_url
        }
    )


# ============================================================
# DOWNLOAD FILE
# ============================================================

def download_file(
    request
):


    token = request.GET.get(
        "token",
        ""
    )


    if not token:

        raise Http404()


    try:

        payload = signing.loads(
            token,
            salt="dl1",
            max_age=900
        )


    except signing.SignatureExpired:

        raise Http404(
            "Link expired"
        )


    except signing.BadSignature:

        raise Http404(
            "Invalid link"
        )


    path = Path(
        payload.get(
            "p",
            ""
        )
    )


    name = (
        payload.get(
            "n"
        )
        or
        path.name
    )


    try:

        path.resolve().relative_to(
            DOWNLOAD_DIR.resolve()
        )


    except Exception:

        raise Http404(
            "Invalid file location"
        )


    if not path.exists():

        raise Http404(
            "File missing"
        )


    content_type, _ = (
        mimetypes.guess_type(
            name
        )
    )


    response = FileResponse(

        open(
            path,
            "rb"
        ),

        content_type=(
            content_type
            or
            "application/octet-stream"
        )

    )


    response[
        "Content-Disposition"
    ] = (
        f'attachment; filename="{name}"'
    )


    return response


# ============================================================
# VERIFY RECAPTCHA
# ============================================================

def verify_recaptcha(
    request
):


    captcha_response = (
        request.POST.get(
            "g-recaptcha-response"
        )
        or
        ""
    ).strip()


    if not captcha_response:

        return False


    data = {

        "secret":
            settings.RECAPTCHA_SECRET_KEY,

        "response":
            captcha_response

    }


    try:

        response = requests.post(

            "https://www.google.com/recaptcha/api/siteverify",

            data=data,

            timeout=10

        )


        result = (
            response.json()
        )


        return result.get(
            "success",
            False
        )


    except requests.RequestException as e:

        print(
            "reCAPTCHA request error:",
            str(e)
        )


        return False