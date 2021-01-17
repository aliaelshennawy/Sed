import Swiper from './web_modules/swiper.js';
import { Navigation, Pagination } from './web_modules/swiper.js';
import ScrollReveal from './web_modules/scrollreveal.js';
import $ from './web_modules/jquery.js';

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
	}
	bindEvents() {
		$(document).on('click', '.tabs a', this.handleTabTriggerClick.bind(this));
		$('ul.tabs').on('keydown', 'a', this.handleKeyboardPress.bind(this));
		$(window).on('hashchange', this.handleHashChange.bind(this));
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
		if (document.querySelector('.main-slider-wrapper')) {
			new Swiper('.main-slider-wrapper', {
				slidesPerView: '1',
				slideToClickedSlide: true,
				fadeEffect: {
					crossFade: true,
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
