
// ===== Налаштування =====

const FEEDBACK_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxR-sjZoCWLTcz_dLVfTzEJULXWH6RPKJwYSSjHvp2hj_X76lG3oZGMOU8uTOqzqjcYnA/exec";

// ===== Регулярні вирази =====

const nameRegex =
    /^(?=.*[А-ЯІЇЄҐа-яіїєґA-Za-z])[А-ЯІЇЄҐа-яіїєґA-Za-z'’ -]{2,}$/;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const phoneRegex = /^\+380\d{9}$/;

const messageRegex = /^.{10,}$/s;

// ===== Отримання елементів =====

const feedbackForm = document.getElementById("feedbackForm");

const nameInput = document.getElementById("feedback-name");
const emailInput = document.getElementById("feedback-email");
const phoneInput = document.getElementById("feedback-phone");
const messageInput = document.getElementById("feedback-message");
const consentInput = document.getElementById("feedback-consent");

const successModal = document.getElementById("successModal");
const closeSuccessModal = document.getElementById("closeSuccessModal");

const submitButton =
    feedbackForm.querySelector('button[type="submit"]');

// ===== Створення прихованого iframe =====

const feedbackIframe = document.createElement("iframe");

feedbackIframe.name = "greenHillFeedbackFrame";
feedbackIframe.style.display = "none";
feedbackIframe.title = "Обробка повідомлення";

document.body.appendChild(feedbackIframe);

// Налаштування форми для надсилання через iframe
feedbackForm.action = FEEDBACK_SCRIPT_URL;
feedbackForm.method = "POST";
feedbackForm.target = feedbackIframe.name;

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
        showError(
            nameInput,
            "nameError",
            "Введіть коректне ім'я (мінімум 2 символи)."
        );
        return false;
    }

    clearError(nameInput, "nameError");
    return true;
}

// ===== Перевірка електронної пошти =====

function validateEmail() {
    const value = emailInput.value.trim();

    if (!emailRegex.test(value)) {
        showError(
            emailInput,
            "emailError",
            "Введіть правильну електронну пошту."
        );
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
        showError(
            messageInput,
            "messageError",
            "Повідомлення повинно містити мінімум 10 символів."
        );
        return false;
    }

    clearError(messageInput, "messageError");
    return true;
}

// ===== Перевірка згоди =====

function validateConsent() {
    if (!consentInput.checked) {
        showError(
            consentInput,
            "consentError",
            "Підтвердьте згоду з політикою конфіденційності."
        );
        return false;
    }

    clearError(consentInput, "consentError");
    return true;
}

// ===== Динамічна перевірка полів =====

nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
phoneInput.addEventListener("input", validatePhone);
messageInput.addEventListener("input", validateMessage);
consentInput.addEventListener("change", validateConsent);

// ===== Обробка надсилання форми =====

let isSubmitting = false;

feedbackForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (isSubmitting) return;

    const isFormValid =
        validateName() &&
        validateEmail() &&
        validatePhone() &&
        validateMessage() &&
        validateConsent();

    if (!isFormValid) return;

    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = "Надсилання...";

    // Надсилаємо форму через прихований iframe
    feedbackForm.submit();
});

// ===== Отримання відповіді від Google Apps Script =====

window.addEventListener("message", function (event) {
    // Перевіряємо, що повідомлення надійшло саме від нашого iframe
    

    let response;

    try {
        response = typeof event.data === "string"
            ? JSON.parse(event.data)
            : event.data;
    } catch (error) {
        return;
    }

    if (
        !response ||
        response.type !== "GREEN_HILL_FEEDBACK"
    ) {
        return;
    }

    isSubmitting = false;
    submitButton.disabled = false;
    submitButton.textContent = "Надіслати повідомлення";

    if (response.success) {
        openSuccessModal();
    } else {
        alert(
            response.message ||
            "Не вдалося надіслати повідомлення. Спробуйте ще раз."
        );
    }
});

// ===== Керування модальним вікном =====

function openSuccessModal() {
    successModal.hidden = false;
    successModal.setAttribute("aria-hidden", "false");

    closeSuccessModal.focus();
}

function hideSuccessModal() {
    successModal.hidden = true;
    successModal.setAttribute("aria-hidden", "true");

    feedbackForm.reset();

    const inputs = feedbackForm.querySelectorAll("input, textarea");

    inputs.forEach(input => {
        input.classList.remove("is-valid", "is-invalid");
        input.removeAttribute("aria-invalid");
    });

    feedbackForm.querySelectorAll(".feedback-form__error")
        .forEach(error => {
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
