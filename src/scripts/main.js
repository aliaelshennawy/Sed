import Swiper from './web_modules/swiper.js';
import { Navigation, Pagination } from './web_modules/swiper.js';
import ScrollReveal from './web_modules/scrollreveal.js';

class App {
	constructor() {
		this.activateSliders();
		this.scrollAnimation();
		this.activateMenu();
		this.languageSwitcher();
		this.showMap();
		this.toggleListView();
	}
	languageSwitcher() {
		const switchToAr = document.querySelector('.language-switch-ar');
		const switchToEn = document.querySelector('.language-switch-en');
		const element = document.querySelector('html');
		const allSliders = document.querySelector('.swiper-container');
		switchToAr.addEventListener('click', () => {
			document.body.className = 'ar';
			element.setAttribute('dir', 'rtl');
			element.setAttribute('lang', 'ar');
			switchToEn.classList.toggle('hidden');
			switchToAr.classList.add('hidden');
			allSliders.setAttribute('dir', 'rtl');
			this.destroySliders();
			this.activateSliders();
		});
		switchToEn.addEventListener('click', () => {
			document.body.className = 'en';
			element.setAttribute('dir', 'ltr');
			element.setAttribute('lang', 'en');
			switchToAr.classList.toggle('hidden');
			switchToEn.classList.add('hidden');
			allSliders.setAttribute('dir', 'ltr');
			this.destroySliders();
			this.activateSliders();
		});
	}
	destroySliders() {
		var mySwiper = document.querySelector('.swiper-container').swiper;
		mySwiper.destroy(true, true);
	}
	activateSliders() {
		Swiper.use([Navigation, Pagination]);
		if (document.querySelector('.home-slider__wrapper')) {
			new Swiper('.home-slider__wrapper', {
				slidesPerView: '1',
				touchRatio: 0.2,
				slideToClickedSlide: true,
				rtl: true,
				fadeEffect: {
					crossFade: true,
				},
				pagination: {
					el: '.swiper-pagination',
					type: 'fraction',
				},
			});
		}
		if (window.matchMedia('(max-width: 780px)').matches) {
			if (document.querySelector('.partners-wrapper')) {
				new Swiper('.partners-wrapper', {
					slidesPerView: 'auto',
					slideToClickedSlide: true,
					breakpoints: {
						// when window width is >= 320px
						780: {
							slidesPerView: 'auto',
						},
					},
				});
			}
		}
		if (document.querySelector('.shop-slider')) {
			new Swiper('.shop-slider', {
				slidesPerView: 'auto',
				slideToClickedSlide: true,
				pagination: {
					el: '.swiper-pagination',
					type: 'fraction',
				},
			});
		}
		if (document.querySelector('.ammenties-slider')) {
			new Swiper('.ammenties-slider', {
				slidesPerView: '1',
				pagination: {
					el: '.swiper-pagination',
					type: 'fraction',
				},
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
			});
		}
		if (
			window.matchMedia('(max-width: 767px)').matches &&
			document.querySelector('.grid-banner-wrapper-slider')
		) {
			new Swiper('.grid-banner-wrapper-slider', {
				slidesPerView: 'auto',
				loop: 'true',
				spaceBetween: 20,
				centeredSlides: true,
			});
		}
		if (document.querySelector('.unit-types-slider')) {
			new Swiper('.unit-types-slider', {
				centeredSlides: true,
				slideToClickedSlide: true,
				// spaceBetween: 120,
				slidesPerView: 'auto',
				roundLengths: true,
				loop: true,
			});
		}
		if (document.querySelector('.career-banner-slider')) {
			new Swiper('.career-banner-slider', {
				slidesPerView: '1',
				pagination: {
					el: '.swiper-pagination',
					type: 'fraction',
				},
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
			});
		}
		if (document.querySelector('.news-slider')) {
			new Swiper('.news-slider', {
				slidesPerView: 3,
				loop: false,
				centerInsufficientSlides: true,
				breakpoints: {
					320: {
						slidesPerView: 1,
						spaceBetween: 0,
					},
					768: {
						slidesPerView: 1,
						spaceBetween: 10,
					},
				},
			});
		}
		if (document.querySelector('.unit-slider-wrapper')) {
			new Swiper('.unit-slider-wrapper', {
				slidesPerView: 'auto',
				slideToClickedSlide: true,
				centeredSlides: true,
				slidesPerGroup: 1,
				spaceBetween: 20,
				loop: true,
			});
		}
		if (document.querySelector('.events-slider')) {
			new Swiper('.events-slider', {
				slidesPerView: 'auto',
				slideToClickedSlide: true,
				pagination: {
					el: '.swiper-pagination',
					type: 'fraction',
				},
			});
		}
		if (document.querySelector('.community-slider')) {
			new Swiper('.community-slider', {
				slidesPerView: 'auto',
				centeredSlides: true,
				spaceBetween: 20,
				slideToClickedSlide: true,
				loop: true,
				pagination: {
					el: '.swiper-pagination',
					type: 'fraction',
				},
				breakpoints: {
					// when window width is >= 320px
					760: {
						slidesPerView: '1',
					},
				},
			});
		}
	}
	toggleListView() {
		const toggleToGridView = document.querySelector('.grid-view');
		const toggleToListView = document.querySelector('.list-view');
		const gridView = document.querySelector('.unit-types-slider-grid');
		const listView = document.querySelector('.unit-types-slider');
		if (toggleToGridView) {
			toggleToGridView.addEventListener('click', () => {
				gridView.classList.remove('hidden');
				listView.classList.add('hidden');
				toggleToListView.classList.remove('active');
				toggleToGridView.classList.add('active');
			});
		}
		if (toggleToListView) {
			toggleToListView.addEventListener('click', () => {
				gridView.classList.add('hidden');
				listView.classList.remove('hidden');
				toggleToListView.classList.add('active');
				toggleToGridView.classList.remove('active');
			});
		}
	}
	activateMenu() {
		const menu = document.querySelector('.header-menu');
		const nav = document.querySelector('.header-nav');
		if (!menu) {
			return;
		}
		menu.addEventListener('click', () => {
			document.body.classList.toggle('menu-opened');
			nav.classList.toggle('hidden');
		});
	}
	showMap() {
		const map = document.querySelector('.show-map');
		const masterClick = document.querySelector('.map-details-click');
		const masterMap = document.querySelector('.map-details');
		const masterClose = document.querySelector('.close-map');
		if (map) {
			map.addEventListener('click', () => {
				masterClick.classList.toggle('hidden');
				masterMap.classList.toggle('hidden');
			});
		}
		if (masterClose) {
			masterClose.addEventListener('click', () => {
				masterClick.classList.remove('hidden');
				masterMap.classList.add('hidden');
			});
		}
	}
	scrollAnimation() {
		ScrollReveal().reveal('.animate', { delay: 200 });
	}
	isArabic(text) {
		const arabic = /[\u0600-\u06FF]/;
		return arabic.test(text);
	}
}

new App();
