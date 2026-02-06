'use strict';

const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const langBtns = document.querySelectorAll('.lang-btn');
const heightHeader = document.querySelector('header').offsetHeight;

//* ------- Переключение меню на мобильных устройствах ------- *//
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navMenu.classList.toggle('open'); // Добавляем класс к меню
  document.body.classList.toggle('menu-open');
});

// Закрытие меню при клике на пункт навигации
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
  });
});

// Переключение языков
langBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.getAttribute('data-lang');
    if (lang && typeof window.changeLanguage === 'function') {
      window.changeLanguage(lang);
      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  });
});

//* ---------- Активная ссылка при скролле ---------- *//
const sections = document.querySelectorAll('section[id]');

function setActiveNavLink() {
  const scrollPosition = window.scrollY + heightHeader; // Сдвиг на высоту header

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    // Проверяем, находится ли секция в видимой области
    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      // Убираем active со всех ссылок
      navLinks.forEach(link => link.classList.remove('active'));

      // Добавляем active к текущей ссылке
      const activeLink = document.querySelector(
        `.nav-link[href="#${sectionId}"]`,
      );
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  });
}

// Отслеживаем скролл
window.addEventListener('scroll', setActiveNavLink);

// Вызываем один раз при загрузке страницы
window.addEventListener('load', setActiveNavLink);

//* ---------- Scroll to top button ---------- *//
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollToTopBtn.classList.add('visible');
  } else {
    scrollToTopBtn.classList.remove('visible');
  }
});

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

//* ----------------- Accordion ----------------- *//
document.addEventListener('DOMContentLoaded', () => {
  class Accordion {
    constructor(el) {
      this.el = el;

      // ⚠️ dataset всегда строка
      this.multiple = el.dataset.multiple === 'true';

      this.links = this.el.querySelectorAll('.link');

      this.links.forEach(link => {
        link.addEventListener('click', e => this.dropdown(e, link));
      });
    }

    dropdown(event, link) {
      const item = link.parentElement;
      const submenu = link.nextElementSibling;

      // Переключаем текущий пункт
      item.classList.toggle('open');

      if (item.classList.contains('open')) {
        submenu.style.maxHeight = submenu.scrollHeight + 'px';
      } else {
        submenu.style.maxHeight = null;
      }

      // Если multiple = false, закрываем остальные
      if (!this.multiple) {
        this.el.querySelectorAll('.item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('open');
            const otherSubmenu = otherItem.querySelector('.submenu');
            otherSubmenu.style.maxHeight = null;
          }
        });
      }
    }
  }

  // Инициализация (аналог new Accordion($('#accordion'), false))
  new Accordion(document.getElementById('accordion'), false);
});
