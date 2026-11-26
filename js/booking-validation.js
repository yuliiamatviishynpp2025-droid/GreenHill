
"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".booking-form");

    if (!form) {
        console.error("Форму бронювання не знайдено.");
        return;
    }

    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const emailInput = document.getElementById("email");
    const cottageInput = document.getElementById("cottage");
    const checkinInput = document.getElementById("checkin");
    const checkoutInput = document.getElementById("checkout");
    const guestsInput = document.getElementById("guests");
    const messageInput = document.getElementById("message");

    const fields = [
        nameInput,
        phoneInput,
        emailInput,
        cottageInput,
        checkinInput,
        checkoutInput,
        guestsInput,
        messageInput
    ];

    if (fields.some(field => !field)) {
        console.error("Не знайдено одне або декілька полів форми.");
        return;
    }

    function showError(input, text) {
        input.setCustomValidity(text);
    }

    function validateField(input) {
        input.setCustomValidity("");

        if (input.validity.valueMissing) {
            showError(input, "Заповніть це обов'язкове поле.");
            return false;
        }

        if (input === nameInput) {
            const name = input.value.trim();

            if (name.length < 2 || !/^[\p{L}\s'-]+$/u.test(name)) {
                showError(input, "Введіть коректне ім'я та прізвище.");
                return false;
            }
        }

        if (input === phoneInput) {
            const phone = input.value.replace(/[\s()-]/g, "");
            const normalizedPhone = phone.startsWith("+380")
                ? phone.slice(1)
                : phone.startsWith("0")
                    ? `38${phone}`
                    : phone;

            if (!/^380\d{9}$/.test(normalizedPhone)) {
                showError(input, "Введіть український номер телефону, наприклад 0971234567.");
                return false;
            }
        }

        if (input === emailInput && input.value.trim() !== "") {
            if (!input.validity.valid) {
                showError(input, "Введіть коректну електронну адресу.");
                return false;
            }
        }

        if (input === checkinInput || input === checkoutInput) {
            const selectedDate = new Date(`${input.value}T00:00:00`);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                showError(input, "Не можна обрати дату, яка вже минула.");
                return false;
            }
        }

       if (
    (input === checkoutInput || input === checkinInput) &&
    checkinInput.value &&
    checkoutInput.value
) {
    const checkInDate = new Date(checkinInput.value + "T00:00:00");
    const checkOutDate = new Date(checkoutInput.value + "T00:00:00");

    if (checkOutDate.getTime() <= checkInDate.getTime()) {
        showError(
            input,
            input === checkoutInput
                ? "Дата виїзду повинна бути пізніше дати заїзду."
                : "Дата заїзду повинна бути раніше дати виїзду."
        );
        return false;
    }
}

        if (input === guestsInput) {
            const guests = Number(input.value);

            if (!Number.isInteger(guests) || guests < 1 || guests > 4) {
                showError(input, "В одному котеджі може бути від 1 до 4 гостей.");
                return false;
            }
        }

        if (input === messageInput && input.value.trim().length > 1000) {
            showError(input, "Повідомлення не може перевищувати 1000 символів.");
            return false;
        }

        return true;
    }

    fields.forEach(input => {
        input.addEventListener("input", () => validateField(input));
        input.addEventListener("change", () => validateField(input));
    });

    checkinInput.addEventListener("change", () => {
        checkoutInput.min = checkinInput.value || "";
        validateField(checkoutInput);
    });

   
let isSubmitting = false;
const today = new Date();
    const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    checkinInput.min = todayString;
    checkoutInput.min = todayString;
form.addEventListener("submit", event => {
    event.preventDefault();

    if (isSubmitting) return;

    let isFormValid = true;

    fields.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        form.reportValidity();
        return;
    }

    isSubmitting = true;

    const submitButton = form.querySelector(".booking-form__submit");
    submitButton.disabled = true;
    submitButton.textContent = "Надсилання...";

    // Надсилаємо форму у прихований iframe
    form.submit();
});


// Отримання відповіді від Google Apps Script
window.addEventListener("message", event => {
    let response;

    try {
        response = typeof event.data === "string"
            ? JSON.parse(event.data)
            : event.data;
    } catch (error) {
        return;
    }

    if (!response || response.type !== "GREEN_HILL_BOOKING") {
        return;
    }

    const submitButton = form.querySelector(".booking-form__submit");

    isSubmitting = false;
    submitButton.disabled = false;
    submitButton.textContent = "Надіслати заявку";

    if (response.success) {
        const modal = document.getElementById("bookingSuccessModal");

        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        form.reset();

        // Відновлюємо мінімальні дати після очищення форми
        checkinInput.min = todayString;
        checkoutInput.min = todayString;
    } else {
        alert(response.message || "Не вдалося надіслати заявку.");
    }
});

// Закриття модального вікна
const bookingModal = document.getElementById("bookingSuccessModal");
const closeBookingModal = document.getElementById("closeBookingSuccessModal");

closeBookingModal.addEventListener("click", () => {
    bookingModal.hidden = true;
    bookingModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
});

    
});
