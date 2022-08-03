document.addEventListener('DOMContentLoaded', () => {	
	//плавное скрытие/показ горизонтального меню при скролле
	let heightHeaderTop = document.querySelector('.header__top').offsetHeight;
	let header = document.querySelector('.header');
	header.style.top = -heightHeaderTop+'px';
	let lastScrollTop = 0;
	window.addEventListener('scroll', function() {
		if (getComputedStyle(document.querySelector('.header__menu-button')).display == 'none') {
			let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			if (scrollTop > 200 + heightHeaderTop && scrollTop > lastScrollTop) {
				header.classList.add('header_hidden');
			} 
			else {
				header.classList.remove('header_hidden');
			}
			lastScrollTop = scrollTop;
		}
	});	

	//показ мобильного меню
	let wrapper = document.querySelector('.wrapper');
	let nav = document.querySelector('.header__nav-mobile');
	document.querySelector('.header__menu-button').addEventListener('click', () => {
		wrapper.classList.add('active');
		nav.classList.add('active');
		//для мобильного меню добавить открытие подменю по клику
		document.querySelectorAll('.menu__item_has-child .menu__link').forEach(elem => {
			elem.addEventListener('click', (event) => {
				event.preventDefault();
				elem.parentNode.querySelector('.submenu').classList.toggle('active');
			})
		});
	});

	//закрытие меню
	document.querySelectorAll('.close-menu').forEach(elem => {
		elem.addEventListener('click', ()=> {
			wrapper.classList.remove('active');
			nav.classList.remove('active');
		})
	});
	
});