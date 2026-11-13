
"use strict";

// Ціни калькулятора Green Hill
const PRICES = {
    weekday: 3800,
    weekend: 4000,
    extraGuest: 500,
    pet: 300,
    chan: 2000,
    sauna: 2000,
    baseGuests: 2,
    maxGuests: 4
};

// Отримуємо елементи сторінки
const form = document.getElementById("calculator-form");
const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");
const guestsInput = document.getElementById("guests");

const summary = document.querySelector(".calc-summary");
const summaryEmpty = document.querySelector(".calc-summary__empty");
const summaryList = document.querySelector(".calc-summary__list");
const message = document.querySelector(".calc-message");

// Перевіряємо наявність необхідних елементів
if (!form || !summary || !summaryList || !checkin || !checkout || !guestsInput) {
    console.error("Помилка: не знайдено необхідні елементи калькулятора.");
} else {

    // Отримуємо поля результату
    const resultFields = summaryList.querySelectorAll("dd");

    // Форматуємо суму у гривнях
    function formatPrice(value) {
        return `${value.toLocaleString("uk-UA")} грн`;
    }

    // Перевіряємо правильність дат
    // Отримуємо сьогоднішню дату у локальному форматі
function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}
    function getNights() {
        if (!checkin.value || !checkout.value) {
            return null;
        }

        const start = new Date(`${checkin.value}T00:00:00`);
        const end = new Date(`${checkout.value}T00:00:00`);

        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            return null;
        }

        const difference = end.getTime() - start.getTime();
        const nights = difference / (1000 * 60 * 60 * 24);

        return Number.isInteger(nights) && nights > 0 ? nights : null;
    }

    // Визначаємо кількість будніх і вихідних ночей
    function countDays() {
        const start = new Date(`${checkin.value}T00:00:00`);
        const nights = getNights();

        let weekdays = 0;
        let weekends = 0;

        for (let i = 0; i < nights; i++) {
            const current = new Date(start);
            current.setDate(start.getDate() + i);

            const day = current.getDay();

            if (day === 0 || day === 6) {
                weekends++;
            } else {
                weekdays++;
            }
        }

        return { weekdays, weekends };
    }

    // Перевіряємо кількість гостей
    function validateGuests() {
        const guests = Number(guestsInput.value);

        if (
            guestsInput.value.trim() === "" ||
            !Number.isInteger(guests) ||
            guests < 1 ||
            guests > PRICES.maxGuests
        ) {
            return null;
        }

        return guests;
    }

    // Показуємо повідомлення про помилку
    function showError(text) {
        message.textContent = text;
        message.style.color = "#b42318";
    }

    // Очищаємо результати
    function clearResults() {
        summaryEmpty.hidden = false;
        summaryList.hidden = true;

        resultFields.forEach(field => {
            field.textContent = "—";
        });
    }

    // Основний розрахунок
    function calculatePrice() {
        const cottage = form.querySelector('input[name="cottage"]:checked');
        const nights = getNights();
        const guests = validateGuests();

        if (!checkin.value || !checkout.value) {
            clearResults();
            showError("Оберіть дату заїзду та дату виїзду.");
            return;
        }
// Перевіряємо, чи дати не минули
const today = getTodayDate();

if (checkin.value < today || checkout.value < today) {
    clearResults();
    showError("Не можна обрати дату, яка вже минула.");
    return;
}
        if (!nights) {
            clearResults();
            showError("Дата виїзду повинна бути пізніше дати заїзду.");
            return;
        }

        if (!guests) {
            clearResults();
            showError("Вкажіть від 1 до 4 гостей цілим числом.");
            return;
        }

        if (!cottage) {
            clearResults();
            showError("Будь ласка, оберіть котедж.");
            return;
        }

        const days = countDays();

        // Розраховуємо вартість проживання
        const accommodation =
            days.weekdays * PRICES.weekday +
            days.weekends * PRICES.weekend;

        // Розраховуємо додаткових гостей
        const extraGuests = Math.max(0, guests - PRICES.baseGuests);
        const extraGuestsCost = extraGuests * PRICES.extraGuest * nights;

        // Розраховуємо додаткові послуги
        const selectedServices = form.querySelectorAll(
            'input[name="service"]:checked'
        );

        let servicesCost = 0;
        const serviceNames = [];

        selectedServices.forEach(service => {
            const price = PRICES[service.value];

            if (typeof price === "number" && Number.isFinite(price)) {
                servicesCost += price;
                serviceNames.push(service.dataset.label || service.value);
            }
        });

        // Загальна вартість
        const total = accommodation + extraGuestsCost + servicesCost;

        if (!Number.isSafeInteger(total) || total < 0) {
            clearResults();
            showError("Не вдалося виконати розрахунок.");
            return;
        }

        // Виводимо результати
        const values = [
            cottage.value,
            `${nights}`,
            `${guests}`,
            formatPrice(accommodation),
            formatPrice(extraGuestsCost),
            serviceNames.length
                ? `${serviceNames.join(", ")} — ${formatPrice(servicesCost)}`
                : "Не обрано",
            formatPrice(total)
        ];

        resultFields.forEach((field, index) => {
            field.textContent = values[index];
        });

        summaryEmpty.hidden = true;
        summaryList.hidden = false;

        message.textContent = "Розрахунок успішно виконано.";
        message.style.color = "#237447";
    }

    // Оновлюємо доступні дати
    function updateCheckoutDate() {
        if (!checkin.value) {
            checkout.min = getTodayDate();
            return;
        }
// Забороняємо вибирати минулі дати
checkin.min = getTodayDate();

        const nextDay = new Date(`${checkin.value}T00:00:00`);
        nextDay.setDate(nextDay.getDate() + 1);

        const minDate = [
            nextDay.getFullYear(),
            String(nextDay.getMonth() + 1).padStart(2, "0"),
            String(nextDay.getDate()).padStart(2, "0")
        ].join("-");

        checkout.min = minDate;

        if (checkout.value && checkout.value <= checkin.value) {
            checkout.value = "";
        }
    }

    // Обробники змін полів
    form.addEventListener("change", calculatePrice);
    form.addEventListener("input", calculatePrice);

    checkin.addEventListener("change", () => {
        updateCheckoutDate();
        calculatePrice();
    });

    // Початковий стан
    clearResults();
    updateCheckoutDate();
}
