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
    if (window.location.hash && window.location.hash.length > 1) {
        var hash = window.location.hash;
        var $target = $(hash);
        if ($target.length) {
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
            }
            window.scrollTo(0, 0);
            $(window).on('load', function () {
                setTimeout(function () {
                    var top = $target.offset().top - 50;
                    $('html, body').animate({ scrollTop: top }, 400);
                }, 50);
            });
        }
    }

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

    $('.header__submenu-toggle').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).closest('.header__menu-item--has-submenu').toggleClass('open');
    });

    $('.header__menu ul li a').on('click', function (e) {
        if (window.innerWidth >= 900) return;
        var $menu = $('.header__menu');
        if (!$menu.hasClass('active')) return;

        var href = $(this).attr('href') || '';
        $menu.removeClass('active');
        $('.header__menu-item--has-submenu').removeClass('open');

        if (href.charAt(0) === '#' && href.length > 1) {
            e.preventDefault();
            var $target = $(href);
            if (!$target.length) return;
            setTimeout(function () {
                var top = $target.offset().top - 50;
                $('html, body').animate({ scrollTop: top }, 400);
            }, 250);
        }
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

    (function initBottomNav() {
        var $nav = $('.bottomnav');
        if (!$nav.length) return;

        $('body').addClass('bottomnav-active');

        var lastScrollY = window.scrollY;
        $nav.addClass('is-visible');

        function update() {
            var y = window.scrollY;
            var vh = window.innerHeight;
            var docH = document.documentElement.scrollHeight;
            var scrollingUp = y < lastScrollY - 1;
            var scrollingDown = y > lastScrollY + 1;
            var nearBottom = y + vh >= docH - 4;

            if (scrollingUp || nearBottom || y < 10) {
                $nav.addClass('is-visible');
            } else if (scrollingDown && !$nav.hasClass('is-menu-open')) {
                $nav.removeClass('is-visible');
            }

            if (y > docH * 0.5 - vh) {
                $nav.addClass('show-top');
            } else {
                $nav.removeClass('show-top');
            }

            lastScrollY = y;
        }

        var ticking = false;
        $(window).on('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    update();
                    ticking = false;
                });
                ticking = true;
            }
        });
        $(window).on('resize', update);
        update();

        $nav.on('click', '.bottomnav__menu-btn', function (e) {
            e.stopPropagation();
            $nav.toggleClass('is-menu-open');
        });

        $nav.on('click', '.bottomnav__top-btn', function () {
            $nav.removeClass('is-menu-open');
            $('html, body').animate({ scrollTop: 0 }, 500);
        });

        $nav.on('click', '.bottomnav__panel a', function (e) {
            var href = $(this).attr('href') || '';
            $nav.removeClass('is-menu-open');

            var hashIdx = href.indexOf('#');
            if (hashIdx === -1) return;
            var hash = href.substring(hashIdx);
            if (hash.length <= 1) return;

            var path = href.substring(0, hashIdx);
            var current = window.location.pathname.split('/').pop() || 'index.html';
            var isSamePage = path === '' || path === current || (path === 'index.html' && current === '');
            if (!isSamePage) return;

            var $target = $(hash);
            if (!$target.length) return;

            e.preventDefault();
            setTimeout(function () {
                var top = $target.offset().top - 50;
                $('html, body').animate({ scrollTop: top }, 400);
            }, 200);
        });

        $(document).on('click', function (e) {
            if (!$nav.hasClass('is-menu-open')) return;
            if ($(e.target).closest('.bottomnav').length) return;
            $nav.removeClass('is-menu-open');
        });
    })();

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
