
document.addEventListener('DOMContentLoaded', function () {
    const reviewsSlider = new Swiper('.reviews-slider', {
        loop: true,
        speed: 700,
        spaceBetween: 24,

        slidesPerView: 1,

        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },

        pagination: {
            el: '.reviews-slider .swiper-pagination',
            clickable: true
        },

        navigation: {
            nextEl: '.reviews-slider .swiper-button-next',
            prevEl: '.reviews-slider .swiper-button-prev'
        },

        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 24
            },
            1100: {
                slidesPerView: 3,
                spaceBetween: 28
            }
        }
    });
});
