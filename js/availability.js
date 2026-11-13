"use strict";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzZKri0g_icvolndCAhwjaLSlUwo9kc7ngWobznDErS0HQL9Vf7ur5WLjA5Tem16GPW/exec";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".availability__form");

    if (!form) return;

    const checkin = document.getElementById("checkin");
    const checkout = document.getElementById("checkout");
    const cottage = document.getElementById("availability-cottage");
    const guests = document.getElementById("guests");
    const today = new Date();
const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

checkin.min = todayString;

checkin.addEventListener("change", () => {
    if (checkin.value) {
        const nextDay = new Date(checkin.value + "T00:00:00");
        nextDay.setDate(nextDay.getDate() + 1);

        const minCheckout = [
            nextDay.getFullYear(),
            String(nextDay.getMonth() + 1).padStart(2, "0"),
            String(nextDay.getDate()).padStart(2, "0")
        ].join("-");

        checkout.min = minCheckout;

        if (checkout.value && checkout.value < minCheckout) {
            checkout.value = "";
        }
    }
});

    const result = document.createElement("p");
    result.className = "availability__result";
    result.setAttribute("aria-live", "polite");
    form.appendChild(result);

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const today = new Date();
        const todayString = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");

        if (!cottage.value || !checkin.value || !checkout.value) {
            result.textContent = "Заповніть усі поля.";
            return;
        }

        if (checkin.value < todayString) {
            result.textContent = "Дата заїзду не може бути в минулому.";
            return;
        }

        if (checkout.value <= checkin.value) {
            result.textContent = "Дата виїзду має бути пізніше дати заїзду.";
            return;
        }

        if (
            !guests.value ||
            Number(guests.value) < 1 ||
            Number(guests.value) > 4
        ) {
            result.textContent = "Кількість гостей має бути від 1 до 4.";
            return;
        }

        result.textContent = "Перевіряємо доступність...";

        const params = new URLSearchParams({
            cottage: cottage.value,
            checkIn: checkin.value,
            checkOut: checkout.value,
            callback: "greenHillAvailabilityCallback"
        });

        const script = document.createElement("script");
        script.src = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;

        let finished = false;

        function cleanup() {
            if (finished) return;
            finished = true;
            script.remove();
            delete window.greenHillAvailabilityCallback;
            clearTimeout(timeout);
        }

        const timeout = setTimeout(() => {
            cleanup();
            result.textContent =
                "Не вдалося отримати відповідь. Спробуйте ще раз.";
        }, 15000);

        window.greenHillAvailabilityCallback = (data) => {
            cleanup();

            if (!data.success) {
                result.textContent = data.message;
                return;
            }

            result.textContent = data.message;
        };

        script.onerror = () => {
            cleanup();
            result.textContent =
                "Помилка з'єднання. Спробуйте пізніше.";
        };

        document.body.appendChild(script);
    });
});