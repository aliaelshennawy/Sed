import Swiper, { Autoplay } from './web_modules/swiper.js';
import { Navigation, Pagination, Thumbs } from './web_modules/swiper.js';
import ScrollReveal from './web_modules/scrollreveal.js';
import $ from './web_modules/jquery.js';
import SimpleLightbox from './web_modules/simplelightbox.js';
Swiper.use([Autoplay]);
Swiper.use([Navigation, Pagination]);

class App {
	constructor() {
		window.jQuery = $;
		this.initializeTabs();
		this.bindEvents();
		this.activateSliders();
		this.scrollAnimation();
		this.activateMenu();
		this.languageSwitcher();
		this.showMap();
		this.toggleListView();
		this.galleryItemClick();
		this.modalOpen();
	}
	bindEvents() {
		$(document).on('click', '.tabs a', this.handleTabTriggerClick.bind(this));
		$('ul.tabs').on('keydown', 'a', this.handleKeyboardPress.bind(this));
		$(window).on('hashchange', this.handleHashChange.bind(this));
	}
	galleryItemClick() {
		if (document.querySelector('.gallery-item')) {
			new SimpleLightbox('.gallery-item a', {
				close: true,
			});
		}
	}
	modalOpen() {
		const modalContent = document.querySelector('.modal-content');
		const body = document.querySelector('body');
		const modal_list = document.querySelectorAll('.modal-trigger');
		var all_modals = [...modal_list];
		if (document.querySelector('.modal-trigger') && all_modals) {
			// converts NodeList to Array
			all_modals.forEach((modal) => {
				modal.addEventListener('click', (event) => {
					const modalRefrence = event.currentTarget.id;
					console.log('ID', document.querySelectorAll(`#${modalRefrence}`)[1]);
					document.querySelectorAll(`#${modalRefrence}`)[1].classList.toggle('current-modal');
					body.classList.add('open');
					document.querySelectorAll(`#${modalRefrence}`)[1].addEventListener('click', () => {
						document.querySelectorAll(`#${modalRefrence}`)[1].classList.remove('current-modal');
						body.classList.remove('open');
					});
				});
			});
		}
		const close = document.querySelector('.close');
		if (close) {
			close.addEventListener('click', () => {
				body.classList.remove('open');
				modalContent.classList.remove('open');
			});
		}
	}
	initializeTabs() {
		const $tabs = $('.tabs__container');
		const { hash } = window.location;
		$tabs.each((idx, tab) => {
			this.generateIds($(tab));
			this.generateAriaLabels($(tab));
			const $list = $(tab).find('.tabs__container-links > ul');
			if (
				hash &&
				$(hash).length === 1 &&
				$(`a[href="${hash}"]`).closest('ul').is('[role="tablist"]')
			) {
				const index = $(tab).find(`a[href="${hash}"]`).parent().index();
				this.activateTab($(tab), index);
				this.scrollToTabs($(tab));
			} else if ($list.find('.active-tab').length === 1) {
				const index = $list.find('.active-tab').index();
				this.activateTab($(tab), index);
			} else {
				this.activateTab($(tab), 0);
			}
		});
	}
	activateTab($tabContainer, index) {
		// Activate the tab handler
		const $tabs = $tabContainer.find(' > .tabs__container-links > ul.tabs');
		const $content = $tabContainer.find(' > .tabs__container-content');
		$tabs.find('li').removeClass('active-tab');
		$tabs.find(`li:eq(${index})`).addClass('active-tab');

		// Update ARIA and tabindex
		$tabs.find('a').attr({
			'aria-selected': false,
			tabindex: -1,
		});
		$tabs.find(`li:eq(${index}) a`).attr({
			'aria-selected': true,
			tabindex: 0,
		});
		// Activate the content
		$content.find(' > .tab-content').prop('hidden', true);
		$content.find(` > .tab-content:eq(${index})`).prop('hidden', false);
	}
	generateIds($tabContainer) {
		const $tabs = $tabContainer.find(' > .tabs__container-links > ul.tabs');
		const $content = $tabContainer.find(' > .tabs__container-content');
		const id = $tabContainer.attr('id');
		$tabs.find('a').each((idx, link) => {
			const text = $(link).text();
			let alias = text.replace(/\W+(?!$)/g, '-').toLowerCase();
			alias = alias.replace(/\W$/, '').toLowerCase();
			const attribute = `${id}-${alias}`;
			$(link).attr('href', `#${attribute}`);
			$content.find(`.tab-content:eq(${idx})`).attr('id', attribute);
		});
	}
	generateAriaLabels($tabContainer) {
		const id = $tabContainer.attr('id');
		const $content = $tabContainer.find(' > .tabs__container-content');
		$content.find(' > .tab-content').each((idx, tab) => {
			if ($(tab).find(':header:first-child').length > 0) {
				const attribute = `${id}-title-${idx}`;
				$(tab).find(':header:first-child').attr('id', attribute);
				$(tab).attr('aria-labelledby', attribute);
			}
		});
	}
	handleTabTriggerClick(ev) {
		ev.preventDefault();
		const $clickedLink = $(ev.target);
		const $tabContainer = $clickedLink.closest('.tabs__container');
		const index = $clickedLink.closest('li').index();
		this.activateTab($tabContainer, index);

		// update the URL, doesn't trigger hashchanged event
		// further reference https://stackoverflow.com/a/4585031/497828
		window.history.pushState(null, null, $clickedLink.attr('href'));
	}
	handleHashChange() {
		const { hash } = window.location;
		if (
			hash &&
			$(hash).length === 1 &&
			$(`a[href="${hash}"]`).closest('ul').is('[role="tablist"]')
		) {
			const $tab = $(`a[href="${hash}"]`).closest('.tabs__container');
			const index = $tab.find(`a[href="${hash}"]`).parent().index();
			this.activateTab($tab, index);
			this.scrollToTabs($tab, 500);
		}
	}
	handleKeyboardPress(ev) {
		const $tab = $(ev.target);
		const $tabs = $tab.closest('ul.tabs');
		switch (ev.which) {
			// prev and home
			case 37:
			case 38:
				if ($tab.parent().prev().length !== 0) {
					$tab.parent().prev().find('a').click().focus();
				} else {
					$tabs.find('li:last > a').click().focus();
				}
				break;
			// next and end
			case 39:
			case 40:
				if ($tab.parent().next().length !== 0) {
					$tab.parent().next().find('a').click().focus();
				} else {
					$tabs.find('li:first a').click().focus();
				}
				break;
			default:
			// do nothing
		}
	}
	scrollToTabs($tab, speed) {
		const easingSpeed = speed || 1000;
		$('html, body').animate(
			{
				scrollTop: $tab.offset().top,
			},
			easingSpeed
		);
	}
	languageSwitcher() {
		const switchToAr = document.querySelector('.language-switch-ar');
		const switchToEn = document.querySelector('.language-switch-en');
		const element = document.querySelector('html');
		const allSliders = document.querySelector('.swiper-container');
		if (switchToAr) {
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
		}
		if (switchToEn) {
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
	}
	destroySliders() {
		var mySwiper = document.querySelector('.swiper-container').swiper;
		mySwiper.destroy(true, true);
	}
	activateSliders() {
		Swiper.use([Navigation, Pagination, Thumbs]);
		if (document.querySelector('.main-slider-wrapper')) {
			new Swiper('.main-slider-wrapper', {
				slidesPerView: '2',
				slideToClickedSlide: true,
				on: {
					reachEnd: function () {
						this.snapGrid = [...this.slidesGrid];
					},
				},
				fadeEffect: {
					crossFade: true,
				},
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
				breakpoints: {
					320: {
						slidesPerView: 1,
						centerMode: true,
					},
					768: {
						slidesPerView: 1,
						centerMode: true,
					},
					780: {
						slidesPerView: 3,
					},
				},
			});
		}
		if (document.querySelector('.home-banner-wrapper')) {
			new Swiper('.home-banner-wrapper', {
				slidesPerView: '1',
				loop: true,
				loopAdditionalSlides: 2,
				slideToClickedSlide: true,
				fadeEffect: {
					crossFade: true,
				},
			});
		}
		// if (document.querySelector('.gallery-thumbs')) {
		// 	var galleryThumbs = new Swiper('.gallery-thumbs', {
		// 		spaceBetween: 10,
		// 		slideThumbActiveClass: 'active-thumb',
		// 		slidesPerView: 1,
		// 		watchSlidesVisibility: true,
		// 		activeClass: 'is-active',
		// 		watchSlidesProgress: true,
		// 		slideToClickedSlide: true,
		// 	});
		// }
		if (document.querySelector('.home-project-slider')) {
			new Swiper('.home-project-slider', {
				slidesPerView: '1',
				slideToClickedSlide: true,
				loop: true,
				// autoplay: {
				// 	delay: 5000,
				// },
				fadeEffect: {
					crossFade: true,
				},
				pagination: {
					el: '.swiper-pagination',
					clickable: true,
					renderBullet: function (index, className) {
						return '<span class="' + className + '"> 0' + (index + 1) + '</span>';
					},
				},
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
			});
		}
		if (document.querySelector('.about-slider')) {
			var items = document.querySelectorAll('.timeline-item');
			new Swiper('.about-slider', {
				slidesPerView: '1',
				slideToClickedSlide: true,
				direction: 'vertical',
				fadeEffect: {
					crossFade: true,
				},
				pagination: {
					el: '.swiper-pagination-costum',
					clickable: true,
					bulletClass: 'bullet',
					bulletActiveClass: 'active',
					renderBullet: function (index, className) {
						return (
							'<span class="' + className + '">' + items[index].childNodes[0].nodeValue + '</span>'
						);
					},
				},
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
			});
		}
		if (
			window.matchMedia('(max-width: 767px)').matches &&
			document.querySelector('.main-slider-wrapper')
		) {
			new Swiper('.main-slider-wrapper', {
				slidesPerView: 'auto',
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
		const icon = document.querySelector('.header-menu.mobile .open');
		const closeMenu = document.querySelector('.header-menu.mobile .close-menu');
		const menu = document.querySelector('.header-menu.mobile');
		const nav = document.querySelector('.header-nav.mobile');
		const body = document.querySelector('body');
		if (!menu) {
			return;
		}
		icon.addEventListener('click', () => {
			body.classList.add('menu-opened');
			menu.classList.add('mobile');
			// nav.classList.toggle('open');
		});
		closeMenu.addEventListener('click', () => {
			console.log('CLOSE, clicked');
			body.classList.remove('menu-opened');
			menu.classList.remove('mobile');
			// nav.classList.toggle('open');
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
		ScrollReveal().reveal('.animate', { delay: 300 });
		ScrollReveal().reveal('.animate li:nth-child(1)', { delay: 100 });
		ScrollReveal().reveal('.animate li:nth-child(2)', { delay: 200 });
		ScrollReveal().reveal('.animate li:nth-child(3)', { delay: 300 });
	}
	isArabic(text) {
		const arabic = /[\u0600-\u06FF]/;
		return arabic.test(text);
	}
}

new App();
