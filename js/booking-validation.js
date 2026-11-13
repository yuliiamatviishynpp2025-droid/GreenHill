
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

        if (input === checkoutInput && checkinInput.value) {
            if (checkoutInput.value <= checkinInput.value) {
                showError(input, "Дата виїзду повинна бути пізніше дати заїзду.");
                return false;
            }
        }

        if (input === checkinInput && checkoutInput.value) {
            if (checkoutInput.value <= checkinInput.value) {
                showError(input, "Дата заїзду повинна бути раніше дати виїзду.");
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

    form.addEventListener("submit", event => {
        let isFormValid = true;

        fields.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            event.preventDefault();
            form.reportValidity();
        }
    });

    const today = new Date();
    const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    checkinInput.min = todayString;
    checkoutInput.min = todayString;
});
