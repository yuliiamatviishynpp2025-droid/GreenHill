// ===== Регулярні вирази для перевірки форми Green Hill =====

// Перевірка імені
const nameRegex = /^(?=.*[А-ЯІЇЄҐа-яіїєґA-Za-z])[А-ЯІЇЄҐа-яіїєґA-Za-z'’ -]{2,}$/;

// Перевірка електронної пошти
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Перевірка українського номера телефону
const phoneRegex = /^\+380\d{9}$/;

// Перевірка повідомлення
const messageRegex = /^.{10,}$/s;


// ===== Отримання елементів форми =====

const feedbackForm = document.getElementById("feedbackForm");

const nameInput = document.getElementById("feedback-name");
const emailInput = document.getElementById("feedback-email");
const phoneInput = document.getElementById("feedback-phone");
const messageInput = document.getElementById("feedback-message");
const consentInput = document.getElementById("feedback-consent");

// ===== Функція відображення помилки =====

function showError(input, errorId, message) {
    const errorElement = document.getElementById(errorId);

    input.classList.add("is-invalid");
    input.classList.remove("is-valid");

    input.setAttribute("aria-invalid", "true");

    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
}

// ===== Функція очищення помилки =====

function clearError(input, errorId) {
    const errorElement = document.getElementById(errorId);

    input.classList.remove("is-invalid");
    input.classList.add("is-valid");

    input.setAttribute("aria-invalid", "false");

    errorElement.textContent = "";
    errorElement.classList.add("hidden");
}

// ===== Перевірка імені =====

function validateName() {
    const value = nameInput.value.trim();

    if (!nameRegex.test(value)) {
        showError(nameInput, "nameError",
            "Введіть коректне ім'я (мінімум 2 символи).");
        return false;
    }

    clearError(nameInput, "nameError");
    return true;
}

// ===== Перевірка електронної пошти =====

function validateEmail() {
    const value = emailInput.value.trim();

    if (!emailRegex.test(value)) {
        showError(emailInput, "emailError",
            "Введіть правильну електронну пошту.");
        return false;
    }

    clearError(emailInput, "emailError");
    return true;
}

// ===== Перевірка телефону =====


function validatePhone() {
    const value = phoneInput.value.trim();

    if (!phoneRegex.test(value)) {
        showError(
            phoneInput,
            "phoneError",
            "Введіть номер у форматі +380XXXXXXXXX."
        );
        return false;
    }

    clearError(phoneInput, "phoneError");
    return true;
}


// ===== Перевірка повідомлення =====

function validateMessage() {
    const value = messageInput.value.trim();

    if (!messageRegex.test(value)) {
        showError(messageInput, "messageError",
            "Повідомлення повинно містити мінімум 10 символів.");
        return false;
    }

    clearError(messageInput, "messageError");
    return true;
}

// ===== Перевірка згоди =====

function validateConsent() {
    if (!consentInput.checked) {
        showError(consentInput, "consentError",
            "Підтвердьте згоду з політикою конфіденційності.");
        return false;
    }

    clearError(consentInput, "consentError");
    return true;
}


// ===== Динамічна перевірка полів =====

// Перевірка імені під час введення
nameInput.addEventListener("input", validateName);

// Перевірка email під час введення
emailInput.addEventListener("input", validateEmail);

// Перевірка телефону під час введення
phoneInput.addEventListener("input", validatePhone);

// Перевірка повідомлення під час введення
messageInput.addEventListener("input", validateMessage);

// Перевірка згоди при зміні чекбокса
consentInput.addEventListener("change", validateConsent);

// ===== Перевірка всієї форми =====

feedbackForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isMessageValid = validateMessage();
    const isConsentValid = validateConsent();

    const isFormValid =
        isNameValid &&
        isEmailValid &&
        isPhoneValid &&
        isMessageValid &&
        isConsentValid;

    if (isFormValid) {
    openSuccessModal();
}
});


// ===== Керування модальним вікном =====

const successModal = document.getElementById("successModal");
const closeSuccessModal = document.getElementById("closeSuccessModal");

const submitButton = feedbackForm.querySelector('button[type="submit"]');

// Відкриття модального вікна
function openSuccessModal() {
    successModal.hidden = false;
    successModal.setAttribute("aria-hidden", "false");

    closeSuccessModal.focus();
}

// Закриття модального вікна
function hideSuccessModal() {
    successModal.hidden = true;
    successModal.setAttribute("aria-hidden", "true");

    // Очищення форми
    feedbackForm.reset();

    // Очищення станів полів
    const inputs = feedbackForm.querySelectorAll("input, textarea");

    inputs.forEach(input => {
        input.classList.remove("is-valid", "is-invalid");
        input.removeAttribute("aria-invalid");
    });

    // Очищення повідомлень про помилки
    feedbackForm.querySelectorAll(".feedback-form__error").forEach(error => {
        error.textContent = "";
        error.classList.add("hidden");
    });

    submitButton.focus();
}

// Закриття кнопкою
closeSuccessModal.addEventListener("click", hideSuccessModal);

// Закриття клавішею Escape
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !successModal.hidden) {
        hideSuccessModal();
    }
});
