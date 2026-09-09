const COUNTRIES = [
  { code: "AF", name: "Afghanistan", dial: "+93" },
  { code: "AL", name: "Albania", dial: "+355" },
  { code: "DZ", name: "Algeria", dial: "+213" },
  { code: "AD", name: "Andorra", dial: "+376" },
  { code: "AO", name: "Angola", dial: "+244" },
  { code: "AR", name: "Argentina", dial: "+54" },
  { code: "AM", name: "Armenia", dial: "+374" },
  { code: "AU", name: "Australia", dial: "+61" },
  { code: "AT", name: "Austria", dial: "+43" },
  { code: "AZ", name: "Azerbaijan", dial: "+994" },
  { code: "BS", name: "Bahamas", dial: "+1-242" },
  { code: "BH", name: "Bahrain", dial: "+973" },
  { code: "BD", name: "Bangladesh", dial: "+880" },
  { code: "BB", name: "Barbados", dial: "+1-246" },
  { code: "BY", name: "Belarus", dial: "+375" },
  { code: "BE", name: "Belgium", dial: "+32" },
  { code: "BZ", name: "Belize", dial: "+501" },
  { code: "BJ", name: "Benin", dial: "+229" },
  { code: "BT", name: "Bhutan", dial: "+975" },
  { code: "BO", name: "Bolivia", dial: "+591" },
  { code: "BA", name: "Bosnia and Herzegovina", dial: "+387" },
  { code: "BW", name: "Botswana", dial: "+267" },
  { code: "BR", name: "Brazil", dial: "+55" },
  { code: "BN", name: "Brunei", dial: "+673" },
  { code: "BG", name: "Bulgaria", dial: "+359" },
  { code: "BF", name: "Burkina Faso", dial: "+226" },
  { code: "BI", name: "Burundi", dial: "+257" },
  { code: "KH", name: "Cambodia", dial: "+855" },
  { code: "CM", name: "Cameroon", dial: "+237" },
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "CV", name: "Cape Verde", dial: "+238" },
  { code: "CF", name: "Central African Republic", dial: "+236" },
  { code: "TD", name: "Chad", dial: "+235" },
  { code: "CL", name: "Chile", dial: "+56" },
  { code: "CN", name: "China", dial: "+86" },
  { code: "CO", name: "Colombia", dial: "+57" },
  { code: "KM", name: "Comoros", dial: "+269" },
  { code: "CR", name: "Costa Rica", dial: "+506" },
  { code: "HR", name: "Croatia", dial: "+385" },
  { code: "CU", name: "Cuba", dial: "+53" },
  { code: "CY", name: "Cyprus", dial: "+357" },
  { code: "CZ", name: "Czech Republic", dial: "+420" },
  { code: "DK", name: "Denmark", dial: "+45" },
  { code: "DJ", name: "Djibouti", dial: "+253" },
  { code: "DM", name: "Dominica", dial: "+1-767" },
  { code: "DO", name: "Dominican Republic", dial: "+1-809" },
  { code: "EC", name: "Ecuador", dial: "+593" },
  { code: "EG", name: "Egypt", dial: "+20" },
  { code: "SV", name: "El Salvador", dial: "+503" },
  { code: "GQ", name: "Equatorial Guinea", dial: "+240" },
  { code: "ER", name: "Eritrea", dial: "+291" },
  { code: "EE", name: "Estonia", dial: "+372" },
  { code: "SZ", name: "Eswatini", dial: "+268" },
  { code: "ET", name: "Ethiopia", dial: "+251" },
  { code: "FJ", name: "Fiji", dial: "+679" },
  { code: "FI", name: "Finland", dial: "+358" },
  { code: "FR", name: "France", dial: "+33" },
  { code: "GA", name: "Gabon", dial: "+241" },
  { code: "GM", name: "Gambia", dial: "+220" },
  { code: "GE", name: "Georgia", dial: "+995" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "GH", name: "Ghana", dial: "+233" },
  { code: "GR", name: "Greece", dial: "+30" },
  { code: "GD", name: "Grenada", dial: "+1-473" },
  { code: "GT", name: "Guatemala", dial: "+502" },
  { code: "GN", name: "Guinea", dial: "+224" },
  { code: "GY", name: "Guyana", dial: "+592" },
  { code: "HT", name: "Haiti", dial: "+509" },
  { code: "HN", name: "Honduras", dial: "+504" },
  { code: "HU", name: "Hungary", dial: "+36" },
  { code: "IS", name: "Iceland", dial: "+354" },
  { code: "IN", name: "India", dial: "+91" },
  { code: "ID", name: "Indonesia", dial: "+62" },
  { code: "IR", name: "Iran", dial: "+98" },
  { code: "IQ", name: "Iraq", dial: "+964" },
  { code: "IE", name: "Ireland", dial: "+353" },
  { code: "IL", name: "Israel", dial: "+972" },
  { code: "IT", name: "Italy", dial: "+39" },
  { code: "CI", name: "Ivory Coast", dial: "+225" },
  { code: "JM", name: "Jamaica", dial: "+1-876" },
  { code: "JP", name: "Japan", dial: "+81" },
  { code: "JO", name: "Jordan", dial: "+962" },
  { code: "KZ", name: "Kazakhstan", dial: "+7" },
  { code: "KE", name: "Kenya", dial: "+254" },
  { code: "KI", name: "Kiribati", dial: "+686" },
  { code: "KW", name: "Kuwait", dial: "+965" },
  { code: "KG", name: "Kyrgyzstan", dial: "+996" },
  { code: "LA", name: "Laos", dial: "+856" },
  { code: "LV", name: "Latvia", dial: "+371" },
  { code: "LB", name: "Lebanon", dial: "+961" },
  { code: "LS", name: "Lesotho", dial: "+266" },
  { code: "LR", name: "Liberia", dial: "+231" },
  { code: "LY", name: "Libya", dial: "+218" },
  { code: "LI", name: "Liechtenstein", dial: "+423" },
  { code: "LT", name: "Lithuania", dial: "+370" },
  { code: "LU", name: "Luxembourg", dial: "+352" },
  { code: "MG", name: "Madagascar", dial: "+261" },
  { code: "MW", name: "Malawi", dial: "+265" },
  { code: "MY", name: "Malaysia", dial: "+60" },
  { code: "MV", name: "Maldives", dial: "+960" },
  { code: "ML", name: "Mali", dial: "+223" },
  { code: "MT", name: "Malta", dial: "+356" },
  { code: "MH", name: "Marshall Islands", dial: "+692" },
  { code: "MR", name: "Mauritania", dial: "+222" },
  { code: "MU", name: "Mauritius", dial: "+230" },
  { code: "MX", name: "Mexico", dial: "+52" },
  { code: "FM", name: "Micronesia", dial: "+691" },
  { code: "MD", name: "Moldova", dial: "+373" },
  { code: "MC", name: "Monaco", dial: "+377" },
  { code: "MN", name: "Mongolia", dial: "+976" },
  { code: "ME", name: "Montenegro", dial: "+382" },
  { code: "MA", name: "Morocco", dial: "+212" },
  { code: "MZ", name: "Mozambique", dial: "+258" },
  { code: "MM", name: "Myanmar", dial: "+95" },
  { code: "NA", name: "Namibia", dial: "+264" },
  { code: "NR", name: "Nauru", dial: "+674" },
  { code: "NP", name: "Nepal", dial: "+977" },
  { code: "NL", name: "Netherlands", dial: "+31" },
  { code: "NZ", name: "New Zealand", dial: "+64" },
  { code: "NI", name: "Nicaragua", dial: "+505" },
  { code: "NE", name: "Niger", dial: "+227" },
  { code: "NG", name: "Nigeria", dial: "+234" },
  { code: "KP", name: "North Korea", dial: "+850" },
  { code: "MK", name: "North Macedonia", dial: "+389" },
  { code: "NO", name: "Norway", dial: "+47" },
  { code: "OM", name: "Oman", dial: "+968" },
  { code: "PK", name: "Pakistan", dial: "+92" },
  { code: "PW", name: "Palau", dial: "+680" },
  { code: "PA", name: "Panama", dial: "+507" },
  { code: "PG", name: "Papua New Guinea", dial: "+675" },
  { code: "PY", name: "Paraguay", dial: "+595" },
  { code: "PE", name: "Peru", dial: "+51" },
  { code: "PH", name: "Philippines", dial: "+63" },
  { code: "PL", name: "Poland", dial: "+48" },
  { code: "PT", name: "Portugal", dial: "+351" },
  { code: "QA", name: "Qatar", dial: "+974" },
  { code: "CG", name: "Republic of the Congo", dial: "+242" },
  { code: "RO", name: "Romania", dial: "+40" },
  { code: "RU", name: "Russia", dial: "+7" },
  { code: "RW", name: "Rwanda", dial: "+250" },
  { code: "KN", name: "Saint Kitts and Nevis", dial: "+1-869" },
  { code: "LC", name: "Saint Lucia", dial: "+1-758" },
  { code: "VC", name: "Saint Vincent and the Grenadines", dial: "+1-784" },
  { code: "WS", name: "Samoa", dial: "+685" },
  { code: "SM", name: "San Marino", dial: "+378" },
  { code: "SA", name: "Saudi Arabia", dial: "+966" },
  { code: "SN", name: "Senegal", dial: "+221" },
  { code: "RS", name: "Serbia", dial: "+381" },
  { code: "SC", name: "Seychelles", dial: "+248" },
  { code: "SL", name: "Sierra Leone", dial: "+232" },
  { code: "SG", name: "Singapore", dial: "+65" },
  { code: "SK", name: "Slovakia", dial: "+421" },
  { code: "SI", name: "Slovenia", dial: "+386" },
  { code: "SB", name: "Solomon Islands", dial: "+677" },
  { code: "SO", name: "Somalia", dial: "+252" },
  { code: "ZA", name: "South Africa", dial: "+27" },
  { code: "KR", name: "South Korea", dial: "+82" },
  { code: "SS", name: "South Sudan", dial: "+211" },
  { code: "ES", name: "Spain", dial: "+34" },
  { code: "LK", name: "Sri Lanka", dial: "+94" },
  { code: "SD", name: "Sudan", dial: "+249" },
  { code: "SR", name: "Suriname", dial: "+597" },
  { code: "SE", name: "Sweden", dial: "+46" },
  { code: "CH", name: "Switzerland", dial: "+41" },
  { code: "SY", name: "Syria", dial: "+963" },
  { code: "TW", name: "Taiwan", dial: "+886" },
  { code: "TJ", name: "Tajikistan", dial: "+992" },
  { code: "TZ", name: "Tanzania", dial: "+255" },
  { code: "TH", name: "Thailand", dial: "+66" },
  { code: "TL", name: "Timor-Leste", dial: "+670" },
  { code: "TG", name: "Togo", dial: "+228" },
  { code: "TO", name: "Tonga", dial: "+676" },
  { code: "TT", name: "Trinidad and Tobago", dial: "+1-868" },
  { code: "TN", name: "Tunisia", dial: "+216" },
  { code: "TR", name: "Turkey", dial: "+90" },
  { code: "TM", name: "Turkmenistan", dial: "+993" },
  { code: "TV", name: "Tuvalu", dial: "+688" },
  { code: "UG", name: "Uganda", dial: "+256" },
  { code: "UA", name: "Ukraine", dial: "+380" },
  { code: "AE", name: "United Arab Emirates", dial: "+971" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "UY", name: "Uruguay", dial: "+598" },
  { code: "UZ", name: "Uzbekistan", dial: "+998" },
  { code: "VU", name: "Vanuatu", dial: "+678" },
  { code: "VA", name: "Vatican City", dial: "+379" },
  { code: "VE", name: "Venezuela", dial: "+58" },
  { code: "VN", name: "Vietnam", dial: "+84" },
  { code: "YE", name: "Yemen", dial: "+967" },
  { code: "ZM", name: "Zambia", dial: "+260" },
  { code: "ZW", name: "Zimbabwe", dial: "+263" }
];


(function () {

  // ==========================================================
  // MAIN ELEMENTS
  // ==========================================================

  const modal =
    document.getElementById("demoModal");

  const form =
    document.getElementById("demoForm");

  if (!modal || !form) {
    return;
  }


  // Prevent script from binding twice

  if (form.dataset.demoFormBound === "1") {
    return;
  }

  form.dataset.demoFormBound = "1";


  const openers =
    document.querySelectorAll(
      ".js-open-demo, .book-demo-btn"
    );

  const closers =
    modal.querySelectorAll(
      "[data-close-demo]"
    );


  const submitBtn =
    document.getElementById("submitBtn");

  const countrySelect =
    document.getElementById("country");

  const phoneInput =
    document.getElementById("phone");


  // ==========================================================
  // EMAIL OTP ELEMENTS
  // ==========================================================

  const emailInput =
    document.getElementById("email");

  const otpInput =
    document.getElementById("demoOtp");

  const verifyEmailBtn =
    document.getElementById(
      "demoVerifyEmailBtn"
    );

  const otpSection =
    document.getElementById(
      "demoOtpSection"
    );

  const otpTimer =
    document.getElementById(
      "demoOtpTimer"
    );

  const verifyOtpBtn =
    document.getElementById(
      "demoVerifyOtpBtn"
    );

  const resendOtpBtn =
    document.getElementById(
      "demoResendOtpBtn"
    );

  const verifiedBadge =
    document.getElementById(
      "demoEmailVerified"
    );

  const otpMessage =
    document.getElementById(
      "demoOtpMessage"
    );

  const verificationToken =
    document.getElementById(
      "demoEmailVerificationToken"
    );


  // Verify all required OTP elements exist

  if (
    !emailInput ||
    !otpInput ||
    !verifyEmailBtn ||
    !otpSection ||
    !otpTimer ||
    !verifyOtpBtn ||
    !resendOtpBtn ||
    !verifiedBadge ||
    !verificationToken
  ) {

    console.error(
      "Request Demo OTP HTML elements are missing."
    );

    return;
  }


  // ==========================================================
  // API URLS
  // ==========================================================

  const SEND_OTP_URL =
    form.dataset.sendOtpUrl;

  const VERIFY_OTP_URL =
    form.dataset.verifyOtpUrl;


  // ==========================================================
  // OTP SETTINGS
  // ==========================================================

  const OTP_EXPIRY_SECONDS = 180;

  const OTP_RESEND_SECONDS = 60;


  let emailVerified = false;

  let emailUsedForOtp = "";

  let otpRemaining = 0;

  let resendRemaining = 0;

  let otpTimerInterval = null;

  let resendTimerInterval = null;

  let submitting = false;


  // ==========================================================
  // TOAST
  // ==========================================================

  function showToast(
    message,
    type = "error",
    timeoutMs = 4000
  ) {

    const root =
      document.getElementById(
        "cmmsToastRoot"
      );


    if (!root) {

      alert(message);

      return;
    }


    const toast =
      document.createElement("div");


    toast.className =
      "cmms-toast " +
      (
        type === "ok"
          ? "cmms-toast--ok"
          : "cmms-toast--error"
      );


    toast.innerHTML = `
      <span aria-hidden="true">
        ${type === "ok" ? "✔" : "⚠"}
      </span>

      <div>
        ${message}
      </div>

      <button
        class="cmms-toast__close"
        type="button"
        aria-label="Close"
      >
        ×
      </button>
    `;


    root.appendChild(toast);


    const remove =
      () => toast.remove();


    toast
      .querySelector(
        ".cmms-toast__close"
      )
      ?.addEventListener(
        "click",
        remove
      );


    setTimeout(
      remove,
      timeoutMs
    );
  }


  // ==========================================================
  // CSRF TOKEN
  // ==========================================================

  function getCsrfToken() {

    return (
      form.querySelector(
        'input[name="csrfmiddlewaretoken"]'
      )?.value || ""
    );
  }


  // ==========================================================
  // EMAIL VALIDATION
  // ==========================================================

  function isValidEmail(value) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
      .test(
        (value || "").trim()
      );
  }


  // ==========================================================
  // TIME FORMAT
  // ==========================================================

  function formatTime(seconds) {

    const mins =
      Math.floor(
        seconds / 60
      );

    const secs =
      seconds % 60;


    return (
      String(mins).padStart(2, "0")
      +
      ":"
      +
      String(secs).padStart(2, "0")
    );
  }


  // ==========================================================
  // STOP OTP TIMER
  // ==========================================================

  function stopOtpTimer() {

    if (otpTimerInterval) {

      clearInterval(
        otpTimerInterval
      );

      otpTimerInterval = null;
    }
  }


  // ==========================================================
  // STOP RESEND TIMER
  // ==========================================================

  function stopResendTimer() {

    if (resendTimerInterval) {

      clearInterval(
        resendTimerInterval
      );

      resendTimerInterval = null;
    }
  }


  // ==========================================================
  // EMAIL MODE
  //
  // Email field visible
  // OTP field hidden
  // ==========================================================

  function showEmailMode() {

    emailInput.style.display =
      "block";

    otpInput.style.display =
      "none";

    otpSection.style.display =
      "none";

    verifiedBadge.style.display =
      "none";
  }


  // ==========================================================
  // OTP MODE
  //
  // IMPORTANT:
  // Email field disappears.
  // OTP field appears in EXACT SAME position.
  // ==========================================================

  function showOtpMode() {

    emailInput.style.display =
      "none";

    otpInput.style.display =
      "block";

    otpSection.style.display =
      "flex";

    verifyEmailBtn.style.display =
      "none";

    verifiedBadge.style.display =
      "none";
  }


  // ==========================================================
  // VERIFIED MODE
  //
  // Email field comes back.
  // OTP field disappears.
  // ==========================================================

  function showVerifiedMode() {

    otpInput.style.display =
      "none";

    otpSection.style.display =
      "none";

    emailInput.style.display =
      "block";

    emailInput.readOnly =
      true;

    verifyEmailBtn.style.display =
      "none";

    verifiedBadge.style.display =
      "inline-flex";
  }


  // ==========================================================
  // OTP EXPIRY TIMER
  // ==========================================================

  function startOtpTimer(
    seconds = OTP_EXPIRY_SECONDS
  ) {

    stopOtpTimer();


    otpRemaining =
      Number(seconds)
      ||
      OTP_EXPIRY_SECONDS;


    otpTimer.textContent =
      formatTime(
        otpRemaining
      );


    verifyOtpBtn.disabled =
      false;


    otpTimerInterval =
      setInterval(
        () => {

          otpRemaining -= 1;


          otpTimer.textContent =
            formatTime(
              Math.max(
                otpRemaining,
                0
              )
            );


          if (
            otpRemaining <= 0
          ) {

            stopOtpTimer();


            verifyOtpBtn.disabled =
              true;


            if (otpMessage) {

              otpMessage.textContent =
                "OTP expired.";
            }


            if (
              resendRemaining <= 0
            ) {

              resendOtpBtn.style.display =
                "inline-block";

              resendOtpBtn.disabled =
                false;

              resendOtpBtn.textContent =
                "Resend";
            }


            showToast(
              "OTP expired. Please request a new OTP.",
              "error"
            );
          }

        },
        1000
      );
  }


  // ==========================================================
  // RESEND COOLDOWN TIMER
  // ==========================================================

  function startResendTimer(
    seconds = OTP_RESEND_SECONDS
  ) {

    stopResendTimer();


    resendRemaining =
      Number(seconds)
      ||
      OTP_RESEND_SECONDS;


    resendOtpBtn.style.display =
      "inline-block";

    resendOtpBtn.disabled =
      true;


    resendOtpBtn.textContent =
      `Resend (${resendRemaining}s)`;


    resendTimerInterval =
      setInterval(
        () => {

          resendRemaining -= 1;


          if (
            resendRemaining <= 0
          ) {

            stopResendTimer();


            resendOtpBtn.disabled =
              false;

            resendOtpBtn.textContent =
              "Resend";

            return;
          }


          resendOtpBtn.textContent =
            `Resend (${resendRemaining}s)`;

        },
        1000
      );
  }


  // ==========================================================
  // SHOW VERIFY EMAIL BUTTON
  // ==========================================================

  function updateVerifyEmailButton() {

    const email =
      emailInput.value.trim();


    if (
      !emailVerified &&
      !emailUsedForOtp &&
      isValidEmail(email) &&
      emailInput.style.display !== "none"
    ) {

      verifyEmailBtn.style.display =
        "inline-flex";

    } else {

      verifyEmailBtn.style.display =
        "none";
    }
  }


  // ==========================================================
  // RESET EMAIL VERIFICATION
  // ==========================================================

  function resetEmailVerification() {

    emailVerified = false;

    emailUsedForOtp = "";

    otpRemaining = 0;

    resendRemaining = 0;


    verificationToken.value =
      "";


    stopOtpTimer();

    stopResendTimer();


    emailInput.readOnly =
      false;


    emailInput.style.display =
      "block";


    otpInput.value =
      "";

    otpInput.style.display =
      "none";


    otpSection.style.display =
      "none";


    verifiedBadge.style.display =
      "none";


    verifyEmailBtn.disabled =
      false;

    verifyEmailBtn.textContent =
      "Verify email";


    verifyOtpBtn.disabled =
      false;

    verifyOtpBtn.textContent =
      "Verify OTP";


    resendOtpBtn.style.display =
      "none";

    resendOtpBtn.disabled =
      false;

    resendOtpBtn.textContent =
      "Resend";


    if (otpMessage) {

      otpMessage.textContent =
        "";
    }


    if (submitBtn) {

      submitBtn.disabled =
        true;
    }


    updateVerifyEmailButton();
  }


  // ==========================================================
  // SEND OTP
  // ==========================================================

  async function sendOtp() {

    const email =
      emailInput.value
        .trim()
        .toLowerCase();


    const isResend =
      Boolean(
        emailUsedForOtp
      );


    if (!email) {

      showToast(
        "Please enter your email address.",
        "error"
      );

      emailInput.focus();

      return;
    }


    if (
      !isValidEmail(email)
    ) {

      showToast(
        "Please enter a valid email address.",
        "error"
      );

      emailInput.focus();

      return;
    }


    if (!SEND_OTP_URL) {

      showToast(
        "OTP send URL is not configured.",
        "error"
      );

      return;
    }


    if (isResend) {

      resendOtpBtn.disabled =
        true;

      resendOtpBtn.textContent =
        "Sending...";

    } else {

      verifyEmailBtn.disabled =
        true;

      verifyEmailBtn.textContent =
        "Sending...";
    }


    const formData =
      new FormData();


    formData.append(
      "email",
      email
    );


    try {

      const response =
        await fetch(
          SEND_OTP_URL,
          {
            method: "POST",

            headers: {
              "X-CSRFToken":
                getCsrfToken(),

              "X-Requested-With":
                "XMLHttpRequest"
            },

            credentials:
              "same-origin",

            body:
              formData
          }
        );


      let result = {};


      try {

        result =
          await response.json();

      } catch {

        throw new Error(
          "Invalid response from server."
        );
      }


      // ======================================================
      // SERVER RESEND COOLDOWN
      // ======================================================

      if (
        response.status === 429
      ) {

        const retryAfter =
          Number(
            result.retry_after
          )
          ||
          OTP_RESEND_SECONDS;


        /*
         * A valid OTP may already exist in the current
         * Django session, so allow the user to enter it.
         */

        emailUsedForOtp =
          email;


        showOtpMode();


        startResendTimer(
          retryAfter
        );


        if (otpRemaining <= 0) {

          startOtpTimer(
            OTP_EXPIRY_SECONDS
          );
        }


        otpInput.focus();


        throw new Error(
          result.message
          ||
          `Please wait ${retryAfter} seconds before resending.`
        );
      }


      if (
        !response.ok ||
        !result.ok
      ) {

        throw new Error(
          result.message
          ||
          "Unable to send OTP."
        );
      }


      // ======================================================
      // OTP SENT SUCCESSFULLY
      // ======================================================

      emailUsedForOtp =
        email;


      otpInput.value =
        "";


      /*
       * THIS IS THE IMPORTANT PART:
       *
       * Hide email input.
       * Show OTP input.
       * Show OTP controls in same field.
       */

      showOtpMode();


      if (otpMessage) {

        otpMessage.textContent =
          "OTP sent successfully.";
      }


      startOtpTimer(
        result.expires_in
        ||
        OTP_EXPIRY_SECONDS
      );


      startResendTimer(
        result.resend_after
        ||
        OTP_RESEND_SECONDS
      );


      otpInput.focus();


      showToast(
        "OTP sent successfully to your email.",
        "ok"
      );

    } catch (error) {

      showToast(
        error.message
        ||
        "Unable to send OTP.",
        "error"
      );


      if (!emailUsedForOtp) {

        showEmailMode();

        updateVerifyEmailButton();
      }

    } finally {

      verifyEmailBtn.disabled =
        false;

      verifyEmailBtn.textContent =
        "Verify email";


      if (
        isResend &&
        resendRemaining <= 0
      ) {

        resendOtpBtn.disabled =
          false;

        resendOtpBtn.textContent =
          "Resend";
      }
    }
  }


  // ==========================================================
  // VERIFY OTP
  // ==========================================================

  async function verifyOtp() {

    const currentEmail =
      emailInput.value
        .trim()
        .toLowerCase();


    const otp =
      otpInput.value.trim();


    if (
      currentEmail !==
      emailUsedForOtp
    ) {

      resetEmailVerification();


      showToast(
        "Email address changed. Please request a new OTP.",
        "error"
      );

      return;
    }


    if (
      otpRemaining <= 0
    ) {

      showToast(
        "OTP expired. Please request a new OTP.",
        "error"
      );

      return;
    }


    if (
      !/^\d{6}$/.test(otp)
    ) {

      showToast(
        "Please enter the 6-digit OTP.",
        "error"
      );

      otpInput.focus();

      return;
    }


    if (!VERIFY_OTP_URL) {

      showToast(
        "OTP verification URL is not configured.",
        "error"
      );

      return;
    }


    verifyOtpBtn.disabled =
      true;

    verifyOtpBtn.textContent =
      "Verifying...";


    const formData =
      new FormData();


    formData.append(
      "email",
      currentEmail
    );


    formData.append(
      "otp",
      otp
    );


    try {

      const response =
        await fetch(
          VERIFY_OTP_URL,
          {
            method: "POST",

            headers: {
              "X-CSRFToken":
                getCsrfToken(),

              "X-Requested-With":
                "XMLHttpRequest"
            },

            credentials:
              "same-origin",

            body:
              formData
          }
        );


      let result = {};


      try {

        result =
          await response.json();

      } catch {

        throw new Error(
          "Invalid response from server."
        );
      }


      if (
        !response.ok ||
        !result.ok ||
        !result.verified ||
        !result.verification_token
      ) {

        throw new Error(
          result.message
          ||
          "OTP verification failed."
        );
      }


      // ======================================================
      // EMAIL VERIFIED
      // ======================================================

      emailVerified =
        true;


      verificationToken.value =
        result.verification_token;


      stopOtpTimer();

      stopResendTimer();


      /*
       * Hide OTP input.
       * Bring email input back.
       * Make email readonly.
       * Show ✓ Verified.
       */

      showVerifiedMode();


      if (submitBtn) {

        submitBtn.disabled =
          false;
      }


      showToast(
        "Email verified successfully.",
        "ok",
        5000
      );

    } catch (error) {

      showToast(
        error.message
        ||
        "OTP verification failed.",
        "error"
      );


      otpInput.focus();

      otpInput.select();

    } finally {

      if (
        !emailVerified &&
        otpRemaining > 0
      ) {

        verifyOtpBtn.disabled =
          false;
      }


      verifyOtpBtn.textContent =
        "Verify OTP";
    }
  }


  // ==========================================================
  // EMAIL EVENTS
  // ==========================================================

  emailInput.addEventListener(
    "input",
    () => {

      /*
       * If the user changes an already verified email,
       * remove verification.
       */

      if (
        emailVerified ||
        emailUsedForOtp
      ) {

        resetEmailVerification();
      }


      updateVerifyEmailButton();
    }
  );


  emailInput.addEventListener(
    "blur",
    updateVerifyEmailButton
  );


  // ==========================================================
  // VERIFY EMAIL CLICK
  // ==========================================================

  verifyEmailBtn.addEventListener(
    "click",
    sendOtp
  );


  // ==========================================================
  // VERIFY OTP CLICK
  // ==========================================================

  verifyOtpBtn.addEventListener(
    "click",
    verifyOtp
  );


  // ==========================================================
  // RESEND OTP CLICK
  // ==========================================================

  resendOtpBtn.addEventListener(
    "click",
    () => {

      if (
        !resendOtpBtn.disabled
      ) {

        sendOtp();
      }
    }
  );


  // ==========================================================
  // OTP INPUT - NUMBERS ONLY
  // ==========================================================

  otpInput.addEventListener(
    "input",
    function () {

      this.value =
        this.value
          .replace(
            /\D/g,
            ""
          )
          .slice(
            0,
            6
          );
    }
  );


  // ==========================================================
  // ENTER KEY VERIFIES OTP
  // ==========================================================

  otpInput.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Enter"
      ) {

        event.preventDefault();

        verifyOtp();
      }
    }
  );


  // ==========================================================
  // LOADING STATE
  // ==========================================================

  function setLoading(
    loading
  ) {

    if (!submitBtn) {
      return;
    }


    if (loading) {

      submitBtn.classList.add(
        "is-loading"
      );

      submitBtn.disabled =
        true;

    } else {

      submitBtn.classList.remove(
        "is-loading"
      );


      /*
       * Do not enable Submit unless
       * email verification succeeded.
       */

      submitBtn.disabled =
        !emailVerified;
    }
  }


  function resetSubmitState() {

    submitting = false;

    setLoading(false);
  }


  // ==========================================================
  // MODAL OPEN
  // ==========================================================

  function openModal(event) {

    event?.preventDefault();


    modal.classList.add(
      "is-open"
    );


    modal.setAttribute(
      "aria-hidden",
      "false"
    );


    resetSubmitState();

    updateVerifyEmailButton();
  }


  // ==========================================================
  // MODAL CLOSE
  // ==========================================================

  function closeModal(event) {

    event?.preventDefault();


    modal.classList.remove(
      "is-open"
    );


    modal.setAttribute(
      "aria-hidden",
      "true"
    );


    resetSubmitState();
  }


  openers.forEach(
    (element) => {

      element.addEventListener(
        "click",
        openModal
      );
    }
  );


  closers.forEach(
    (element) => {

      element.addEventListener(
        "click",
        closeModal
      );
    }
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        modal.classList.contains(
          "is-open"
        )
      ) {

        closeModal(event);
      }
    }
  );


  // ==========================================================
  // ERROR MESSAGE
  // ==========================================================

  function setError(
    name,
    message = ""
  ) {

    const element =
      form.querySelector(
        `[data-error-for="${name}"]`
      );


    if (element) {

      element.textContent =
        message;
    }
  }


  // ==========================================================
  // CLEAR ERRORS
  // ==========================================================

  function clearErrors() {

    form
      .querySelectorAll(
        ".error"
      )
      .forEach(
        (element) => {

          element.textContent =
            "";
        }
      );


    form
      .querySelectorAll(
        ".is-error"
      )
      .forEach(
        (element) => {

          element.classList.remove(
            "is-error"
          );
        }
      );


    form
      .querySelectorAll(
        "[aria-invalid='true']"
      )
      .forEach(
        (element) => {

          element.removeAttribute(
            "aria-invalid"
          );
        }
      );
  }


  // ==========================================================
  // COUNTRY HELPERS
  // ==========================================================

  const normalizeDial =
    (value) =>
      (value || "")
        .replace(
          /[^0-9+]/g,
          ""
        );


  let COUNTRY_OPTION_CACHE =
    [];


  function rebuildCountryCache() {

    COUNTRY_OPTION_CACHE =
      Array
        .from(
          countrySelect.options
        )
        .slice(1)
        .map(
          (option) => {

            const [
              code,
              dial
            ] =
              (
                option.value || ""
              ).split("|");


            return {
              value:
                option.value,

              code,

              dial,

              normalizedDial:
                normalizeDial(
                  dial || ""
                )
            };
          }
        );
  }


  // ==========================================================
  // FIND COUNTRY FROM PHONE NUMBER
  // ==========================================================

  function findOptionByPhone(
    value
  ) {

    const phone =
      normalizeDial(
        (value || "").trim()
      );


    if (
      !phone.startsWith("+")
    ) {

      return null;
    }


    let best =
      null;


    for (
      const option
      of
      COUNTRY_OPTION_CACHE
    ) {

      if (
        option.normalizedDial &&
        phone.startsWith(
          option.normalizedDial
        )
      ) {

        if (
          !best ||
          option.normalizedDial.length >
          best.normalizedDial.length
        ) {

          best =
            option;
        }
      }
    }


    return best;
  }


  // ==========================================================
  // SET PHONE DIAL CODE
  // ==========================================================

  function setPhoneDial(
    dial
  ) {

    if (!dial) {
      return;
    }


    const rest =
      (
        phoneInput.value || ""
      )
        .replace(
          /^\+\s*[\d\-\s()]+/,
          ""
        )
        .trim();


    phoneInput.value =
      `${dial}${rest ? " " + rest : ""}`;
  }


  // ==========================================================
  // BUILD COUNTRY DROPDOWN
  // ==========================================================

  if (
    countrySelect &&
    countrySelect.options.length === 0
  ) {

    const fragment =
      document.createDocumentFragment();


    const defaultOption =
      document.createElement(
        "option"
      );


    defaultOption.value =
      "";


    defaultOption.textContent =
      "-- Select Country --";


    fragment.appendChild(
      defaultOption
    );


    COUNTRIES.forEach(
      (country) => {

        const option =
          document.createElement(
            "option"
          );


        option.value =
          `${country.code}|${country.dial}`;


        option.textContent =
          `${country.name} (${country.dial})`;


        fragment.appendChild(
          option
        );
      }
    );


    countrySelect.appendChild(
      fragment
    );
  }


  if (countrySelect) {

    rebuildCountryCache();
  }


  // ==========================================================
  // PHONE -> COUNTRY
  // ==========================================================

  if (
    phoneInput &&
    countrySelect
  ) {

    phoneInput.addEventListener(
      "input",
      () => {

        const match =
          findOptionByPhone(
            phoneInput.value
          );


        if (match) {

          countrySelect.value =
            match.value;
        }
      }
    );


    // ========================================================
    // COUNTRY -> PHONE
    // ========================================================

    countrySelect.addEventListener(
      "change",
      () => {

        const [
          ,
          dial
        ] =
          (
            countrySelect.value
            ||
            ""
          ).split("|");


        if (!dial) {

          phoneInput.placeholder =
            "+61 4xx xxx xxx";

          return;
        }


        phoneInput.placeholder =
          `${dial} ...`;


        const current =
          normalizeDial(
            phoneInput.value
          );


        if (
          !current.startsWith(
            normalizeDial(
              dial
            )
          )
        ) {

          setPhoneDial(
            dial
          );
        }
      }
    );
  }


  // ==========================================================
  // VALIDATE FORM
  // ==========================================================

  function validateForm() {

    clearErrors();


    function fail(
      name,
      message
    ) {

      setError(
        name,
        message
      );


      showToast(
        message,
        "error"
      );


      let input =
        form.querySelector(
          `[name="${name}"]`
        );


      /*
       * If OTP mode is active and the email
       * verification fails, focus OTP field.
       */

      if (
        name === "email" &&
        !emailVerified &&
        otpInput.style.display !== "none"
      ) {

        input =
          otpInput;
      }


      if (input) {

        input.classList.add(
          "is-error"
        );


        input.setAttribute(
          "aria-invalid",
          "true"
        );


        input.scrollIntoView(
          {
            block: "center",
            behavior: "smooth"
          }
        );


        setTimeout(
          () => {

            input.focus(
              {
                preventScroll: true
              }
            );

          },
          250
        );
      }


      return false;
    }


    // ========================================================
    // FULL NAME
    // ========================================================

    const fullName =
      (
        form.full_name?.value
        ||
        ""
      ).trim();


    if (
      !/^[A-Za-z\s'.-]{2,}$/
        .test(
          fullName
        )
    ) {

      return fail(
        "full_name",
        "Please enter a valid full name (letters only)."
      );
    }


    // ========================================================
    // COMPANY
    // ========================================================

    const company =
      (
        form.company?.value
        ||
        ""
      ).trim();


    if (
      company.length < 2
    ) {

      return fail(
        "company",
        "Company is required."
      );
    }


    // ========================================================
    // EMAIL
    // ========================================================

    const email =
      (
        form.email?.value
        ||
        ""
      ).trim();


    if (
      !isValidEmail(
        email
      )
    ) {

      return fail(
        "email",
        "Enter a valid email address."
      );
    }


    // ========================================================
    // EMAIL OTP MUST BE VERIFIED
    // ========================================================

    if (
      !emailVerified ||
      !verificationToken.value
    ) {

      return fail(
        "email",
        "Please verify your email address before submitting."
      );
    }


    // ========================================================
    // PHONE
    // ========================================================

    const phone =
      (
        form.phone?.value
        ||
        ""
      ).trim();


    if (
      !/^\+?\d[\d\s\-()]{6,}$/
        .test(
          phone
        )
    ) {

      return fail(
        "phone",
        "Enter a valid phone number."
      );
    }


    // ========================================================
    // COUNTRY
    // ========================================================

    if (
      !form.country?.value
    ) {

      return fail(
        "country",
        "Please select a country."
      );
    }


    return true;
  }


  // ==========================================================
  // FORM SUBMISSION
  // ==========================================================

  form.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      if (submitting) {

        return;
      }


      if (
        !validateForm()
      ) {

        resetSubmitState();

        return;
      }


      submitting =
        true;


      setLoading(
        true
      );


      const safetyTimer =
        setTimeout(
          () => {

            if (submitting) {

              showToast(
                "Taking too long. Please try again.",
                "error"
              );


              resetSubmitState();
            }
          },
          15000
        );


      try {

        const response =
          await fetch(
            form.action,
            {
              method: "POST",

              body:
                new FormData(
                  form
                ),

              headers: {
                "X-Requested-With":
                  "XMLHttpRequest"
              },

              credentials:
                "same-origin",

              redirect:
                "follow"
            }
          );


        const contentType =
          (
            response.headers.get(
              "content-type"
            )
            ||
            ""
          ).toLowerCase();


        // ====================================================
        // JSON RESPONSE
        // ====================================================

        if (
          contentType.includes(
            "application/json"
          )
        ) {

          const data =
            await response
              .json()
              .catch(
                () => ({})
              );


          if (
            !response.ok ||
            !data.ok
          ) {

            const errors =
              data.errors
              ||
              {};


            Object
              .keys(
                errors
              )
              .forEach(
                (key) => {

                  setError(
                    key,
                    errors[key]
                  );
                }
              );


            const firstError =
              Object
                .values(
                  errors
                )[0];


            showToast(
              firstError
              ||
              data.message
              ||
              "Please fix the errors and try again.",
              "error"
            );


            return;
          }


          const redirectUrl =
            data.redirect
            ||
            form.querySelector(
              'input[name="next"]'
            )?.value
            ||
            "/thanks/";


          form.reset();

          clearErrors();

          resetEmailVerification();


          modal.classList.remove(
            "is-open"
          );


          modal.setAttribute(
            "aria-hidden",
            "true"
          );


          window.location.assign(
            redirectUrl
          );


          return;
        }


        // ====================================================
        // HTML / REDIRECT RESPONSE
        // ====================================================

        if (
          response.ok
        ) {

          form.reset();

          clearErrors();

          resetEmailVerification();


          modal.classList.remove(
            "is-open"
          );


          modal.setAttribute(
            "aria-hidden",
            "true"
          );


          window.location.assign(
            response.url
          );


          return;
        }


        showToast(
          "Server error. Please try again.",
          "error"
        );

      } catch (error) {

        console.error(
          "Request Demo submit error:",
          error
        );


        showToast(
          "Network error. Please try again.",
          "error"
        );

      } finally {

        clearTimeout(
          safetyTimer
        );


        resetSubmitState();
      }
    }
  );


  // ==========================================================
  // PAGE RESTORE / BACK BUTTON
  // ==========================================================

  window.addEventListener(
    "pageshow",
    () => {

      form.reset();

      clearErrors();

      resetEmailVerification();

      resetSubmitState();
    }
  );


  // ==========================================================
  // INITIAL STATE
  // ==========================================================

  emailInput.style.display =
    "block";


  emailInput.readOnly =
    false;


  otpInput.style.display =
    "none";


  otpSection.style.display =
    "none";


  verifiedBadge.style.display =
    "none";


  verifyEmailBtn.style.display =
    "none";


  resendOtpBtn.style.display =
    "none";


  verificationToken.value =
    "";


  if (submitBtn) {

    submitBtn.disabled =
      true;
  }


  updateVerifyEmailButton();

})();