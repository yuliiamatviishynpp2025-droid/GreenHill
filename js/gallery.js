
document.addEventListener('DOMContentLoaded', function () {

    // Тематичні фотоальбоми Green Hill
    const galleryAlbums = {
        terrace: {
            title: 'Тераса з краєвидом',
            photos: [
                'teras_kray1.jpg',
                'teras_kray2.jpg',
                'teras_kray3.jpg',
                'teras_kray4.jpg',
                'teras_kray5.jpg'
            ]
        },

        pool: {
            title: 'Відпочинок біля басейну',
            photos: [
                'bas_ter1.jpg',
                'bas_ter2.jpg',
                'bas_ter3.jpg',
                'bas_ter4.jpg',
                'bas_ter5.jpg',
                'bas_ter6.jpg'
            ]
        },

        interior: {
            title: 'Затишок у деталях',
            photos: [
                'interior1.jpg',
                'interior2.jpg',
                'interior3.jpg',
                'interior4.jpg',
                'interior5.jpg',
                'interior6.jpg',
                'interior7.jpg',
                'interior8.jpg',
                'interior9.jpg'
            ]
        },

        seasons: {
            title: 'Атмосфера кожного сезону',
            photos: [
                'season1.jpg',
                'season2.jpg',
                'season3.jpg',
                'season4.jpg',
                'season5.jpg'
            ]
        }
    };

    // Формування фотографій для Fancybox
    function createGallerySlides(album) {
        return album.photos.map((photo, index) => ({
            src: `images/${photo}`,
            type: 'image',
            caption: `${album.title} — фото ${index + 1}`
        }));
    }

    // Відкриття тематичних альбомів
    document.querySelectorAll('[data-gallery-album]').forEach(card => {

        function openAlbum() {
            const album = galleryAlbums[card.dataset.galleryAlbum];

            if (album && window.Fancybox) {
                Fancybox.show(createGallerySlides(album));
            }
        }

        card.addEventListener('click', openAlbum);

        card.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openAlbum();
            }
        });
    });

    // Відкриття всіх фотографій
    document.querySelector('[data-gallery-all]')?.addEventListener('click', event => {
        event.preventDefault();

        const allPhotos = Object.values(galleryAlbums)
            .flatMap(album => createGallerySlides(album));

        if (window.Fancybox) {
            Fancybox.show(allPhotos);
        }
    });

});
