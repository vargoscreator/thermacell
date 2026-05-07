// let swiper = new Swiper(".swiper", {
//     loop: false,
//     spaceBetween: 20,
//     slidesPerView: 2,
//     allowTouchMove: false,
//     navigation: {
//         nextEl: ".button-next",
//         prevEl: ".button-prev",
//     },
//     pagination: {
//         el: ".swiper-pagination",
//         clickable: true,
//     },
//     breakpoints: {
//         775: {
//             spaceBetween: 30,
//             slidesPerView: 3,
//         },
//         931: {
//             spaceBetween: 30,
//             slidesPerView: 4,
//         },
//     },
// });

(function initStickyProdImage() {
    const img = document.querySelector('.prodinfo__item-image.scroll-active');
    if (!img) return;
    const block = img.closest('.prodinfo__block');
    if (!block) return;

    function update() {
        img.style.transform = '';
        const imgRect = img.getBoundingClientRect();
        const blockRect = block.getBoundingClientRect();
        const vh = window.innerHeight;
        const imgH = imgRect.height;

        if (imgH >= blockRect.height) {
            return;
        }

        const targetTop = (vh - imgH) / 2;
        const desired = targetTop - imgRect.top;
        const maxTranslate = blockRect.bottom - imgRect.top - imgH;
        const translateY = Math.max(0, Math.min(desired, maxTranslate));

        img.style.transform = `translateY(${translateY}px)`;
    }

    let ticking = false;
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                update();
                ticking = false;
            });
            ticking = true;
        }
    }

    img.style.willChange = 'transform';
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
})();

// Google Maps: вызывается callback'ом из загрузчика API.
window.initContactsMap = function () {
    var mapEl = document.getElementById('contacts-map');
    if (!mapEl || typeof google === 'undefined' || !google.maps) return;

    var markerSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">' +
            '<path d="M38.5 17.6532C38.5 33.3357 22 41.25 22 41.25C22 41.25 5.5 33.3357 5.5 17.6532C5.5 9.4224 13.5883 2.75 22 2.75C30.4117 2.75 38.5 9.4224 38.5 17.6532Z" fill="#00785F" stroke="white"/>' +
            '<path d="M31.338 20.1791L24.7996 17.9805L14 28.7295H22.9758L31.338 20.1791Z" fill="#FF612F"/>' +
            '<path d="M31.338 19.5504L24.4112 16.5979L23.0942 17.3385C22.5549 17.6415 21.934 17.7574 21.3248 17.6688C20.7156 17.5802 20.1509 17.2917 19.7157 16.8469L14 11H22.9758L31.338 19.5504Z" fill="#FF612F"/>' +
        '</svg>';

    var markerIcon = {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(markerSvg),
        scaledSize: new google.maps.Size(44, 44),
        anchor: new google.maps.Point(22, 41)
    };

    // Точки для отображения. Замените на данные из вашего API.
    var locations = [
        { city: 'Київ',   address: 'просп. Степана Бандери, 20', coords: { lat: 50.4501, lng: 30.5234 } },
        { city: 'Львів',  address: 'просп. Степана Бандери, 20', coords: { lat: 49.8397, lng: 24.0297 } },
        { city: 'Дніпро', address: 'вул. Набережна Перемоги, 36', coords: { lat: 48.4647, lng: 35.0462 } },
        { city: 'Харків', address: 'просп. Героїв Харкова, 27',   coords: { lat: 49.9935, lng: 36.2304 } }
    ];

    var grayscaleStyle = [
        { elementType: 'geometry', stylers: [{ color: '#212121' }] },
        { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
        { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#5a5a5a' }] },
        { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#cfcfcf' }] },
        { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
        { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
        { featureType: 'administrative.neighborhood', stylers: [{ visibility: 'off' }] },
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#383838' }] },
        { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#4a4a4a' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f0f0f' }] },
        { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d3d3d' }] }
    ];

    var map = new google.maps.Map(mapEl, {
        center: { lat: 49.0, lng: 32.0 },
        zoom: 6,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'cooperative',
        clickableIcons: false,
        styles: grayscaleStyle
    });

    var infoWindow = new google.maps.InfoWindow({
        pixelOffset: new google.maps.Size(0, -8)
    });

    locations.forEach(function (loc) {
        var marker = new google.maps.Marker({
            map: map,
            position: loc.coords,
            title: loc.city,
            icon: markerIcon
        });

        marker.addListener('click', function () {
            infoWindow.setContent(
                '<div class="map-popup">' +
                    '<div class="map-popup__city">' + loc.city + '</div>' +
                    '<div class="map-popup__address">' + loc.address + '</div>' +
                '</div>'
            );
            infoWindow.open({ anchor: marker, map: map });
        });
    });

    window.contactsMap = map;
};

jQuery(function ($) {
    $('.header__burger').on('click', function (e) {
        e.stopPropagation();
        $('.header__menu').addClass('active');
    });

    $('.header__menu-close').on('click', function (e) {
        e.stopPropagation();
        $('.header__menu').removeClass('active');
    });

    $(document).on('click', function (e) {
        var $menu = $('.header__menu');
        if (!$menu.hasClass('active')) return;
        if ($(e.target).closest('.header__menu ul').length) return;
        $menu.removeClass('active');
    });

    var prodSwipers = [];

    function applyVariantColors($block, $item) {
        var bgColor = $block.attr('data-bg-color');
        if (bgColor) $item.closest('.prodinfo').css('background-color', bgColor);

        var howitworksColor = $block.attr('data-howitworks-color');
        if (howitworksColor) {
            $('.howitworks__item-image').css('background-color', howitworksColor);
        }
    }

    function setActiveBlock($item, idx) {
        var $blocks = $item.find('.prodinfo__item-select > .prodinfo__item-select--block');
        var $block = $blocks.eq(idx);
        if (!$block.length || $block.hasClass('active')) return;
        $blocks.removeClass('active');
        $block.addClass('active');
        applyVariantColors($block, $item);
    }

    function getSwiperFor(itemEl) {
        for (var i = 0; i < prodSwipers.length; i++) {
            if (prodSwipers[i].item === itemEl) return prodSwipers[i].swiper;
        }
        return null;
    }

    if (typeof Swiper !== 'undefined') {
        $('.prodinfo__item').each(function () {
            var $item = $(this);
            var $imageEl = $item.find('.prodinfo__item-image');
            if (!$imageEl.length || !$imageEl.find('.swiper-wrapper').length) return;

            $imageEl.addClass('swiper');

            var swiper = new Swiper($imageEl[0], {
                slidesPerView: 1.1,
                spaceBetween: 40,
                speed: 400,
                allowTouchMove: true
            });

            swiper.on('slideChange', function () {
                setActiveBlock($item, swiper.activeIndex);
            });

            prodSwipers.push({ item: $item[0], swiper: swiper });
        });
    }

    $('.prodinfo').on('click', '.prodinfo__item-select--block', function () {
        var $block = $(this);
        var $select = $block.closest('.prodinfo__item-select');
        var $item = $block.closest('.prodinfo__item');

        if ($block.hasClass('active')) return;

        $select.find('.prodinfo__item-select--block').removeClass('active');
        $block.addClass('active');

        applyVariantColors($block, $item);

        var idx = $block.index();

        var $aboutImgs = $item.find('.prodinfo__item-about--image img');
        if ($aboutImgs.length) {
            $aboutImgs.removeClass('active').eq(idx).addClass('active');
        }

        var swiper = getSwiperFor($item[0]);
        if (swiper) {
            swiper.slideTo(idx);
        } else {
            var newSrc = $block.find('.prodinfo__item-select--image img').attr('src');
            var $bigImg = $item.find('.prodinfo__item-image img');
            if (newSrc && $bigImg.length) {
                $bigImg.attr('src', newSrc);
            }
        }
    });

    var $items = $('.faq__block .faq__item');

    $items.each(function () {
        var $descr = $(this).find('.faq__item-descr');
        if ($(this).hasClass('active')) {
            $descr.show();
        } else {
            $descr.hide();
        }
    });

    $('.faq__block').on('click', '.faq__item-title', function () {
        var $item = $(this).closest('.faq__item');
        var $descr = $item.find('.faq__item-descr');

        if ($item.hasClass('active')) {
            $item.removeClass('active');
            $descr.stop(true, false).slideUp(350);
        } else {
            $('.faq__block .faq__item.active').each(function () {
                $(this).removeClass('active')
                    .find('.faq__item-descr').stop(true, false).slideUp(350);
            });
            $item.addClass('active');
            $descr.stop(true, false).slideDown(350);
        }
    });
});
