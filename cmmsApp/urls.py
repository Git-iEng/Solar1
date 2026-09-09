# iEngApp/urls.py

from django.urls import path
from django.views.static import serve
from django.conf import settings

from . import views


app_name = "cmmsApp"


urlpatterns = [

    # =========================================================
    # MAIN PAGES
    # =========================================================

    path(
        "",
        views.home,
        name="home"
    ),

    path(
        "about/",
        views.about,
        name="about"
    ),

    # Contact page
    path(
        "contact/",
        views.contact_section,
        name="contact"
    ),


    # =========================================================
    # CONTACT FORM SUBMISSION
    # =========================================================

    # Your contact_section.html currently uses:
    #
    # {% url 'cmmsApp:contact_section' %}
    #
    # Therefore this URL name must exist.

    path(
        "contact/submit/",
        views.contact_section,
        name="contact_section"
    ),


    # =========================================================
    # EMAIL OTP VERIFICATION
    # =========================================================

    # Called when user clicks "Verify email"
    path(
        "api/contact/send-email-otp/",
        views.send_email_otp,
        name="send_email_otp"
    ),

    # Called when user enters OTP and clicks "Verify OTP"
    path(
        "api/contact/verify-email-otp/",
        views.verify_email_otp,
        name="verify_email_otp"
    ),


    # =========================================================
    # CONTACT HELPERS
    # =========================================================

    path(
        "contact/phone-info/",
        views.phone_info,
        name="phone_info"
    ),

    path(
        "contact/country-list/",
        views.country_list,
        name="country_list"
    ),


    # Existing consulting/contact block
    path(
        "contact/block-submit/",
        views.contact_block_submit,
        name="contact_submit"
    ),


    # =========================================================
    # THANK YOU PAGE
    # =========================================================

    path(
        "contact/thanks/",
        views.contact_thanks,
        name="contact_thanks"
    ),


    # =========================================================
    # REQUEST DEMO
    # =========================================================

    path(
        "request-demo/",
        views.request_demo_view,
        name="request_demo"
    ),


    # =========================================================
    # DOWNLOADS
    # =========================================================

    path(
        "request-download/",
        views.request_download,
        name="request_download"
    ),

    path(
        "download/",
        views.download_file,
        name="download_file"
    ),


    # =========================================================
    # SITEMAP
    # =========================================================

    path(
        "sitemap.xml",
        views.sitemap,
        name="sitemap"
    ),

]