
document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // Завантажуємо збережену тему
    const savedTheme = localStorage.getItem('greenHillTheme');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    // Оновлюємо іконку та підпис кнопки
    function updateThemeButton() {
        const isDark = document.body.classList.contains('dark-theme');

        themeIcon.className = isDark
            ? 'fa-solid fa-sun'
            : 'fa-solid fa-moon';

        themeToggle.setAttribute(
            'aria-label',
            isDark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'
        );
    }

    updateThemeButton();

    // Перемикання теми
    themeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-theme');

        const isDark = document.body.classList.contains('dark-theme');

        localStorage.setItem(
            'greenHillTheme',
            isDark ? 'dark' : 'light'
        );

        updateThemeButton();
    });
});
