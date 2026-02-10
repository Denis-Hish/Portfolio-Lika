'use strict';

const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const langBtns = document.querySelectorAll('.lang-btn');

//* ----------------- Высота header ----------------- *//
function updateHeaderHeight() {
  const header = document.querySelector('.header');
  if (!header) return;

  const height = header.offsetHeight;
  document.documentElement.style.setProperty('--header-height', `${height}px`);
}

updateHeaderHeight();

// И при изменении размера окна
window.addEventListener('resize', updateHeaderHeight);

// если header может изменяться по другим причинам
// (шрифты загрузились, контент добавился и т.п.)
window.addEventListener('load', updateHeaderHeight);

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
  const header = document.querySelector('.header');
  const headerHeight = header ? header.offsetHeight : 0;

  const scrollPosition = window.scrollY + headerHeight;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      navLinks.forEach(link => link.classList.remove('active'));

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

//* ----------------- SWIPER SLIDER ----------------- *//
const progressCircle = document.querySelector('.autoplay-progress svg');
const progressContent = document.querySelector('.autoplay-progress span');

const swiper = new Swiper('.swiper', {
  // Parameters
  spaceBetween: 32,
  loop: true,
  // mousewheel: true,
  keyboard: {
    enabled: true,
  },
  autoplay: {
    delay: 10000,
    disableOnInteraction: false, // после взаимодействия автоплей продолжит работать
    pauseOnMouseEnter: true,
  },
  speed: 1200,

  // Pagination
  pagination: {
    el: '.swiper-pagination',
    dynamicBullets: true,
    clickable: true,
  },

  // Breakpoints
  breakpoints: {
    576: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    992: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    1200: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // Progress
  on: {
    autoplayTimeLeft(s, time, progress) {
      progressCircle.style.setProperty('--progress', 1 - progress);
      progressContent.textContent = `${Math.ceil(time / 1000)}s`;
    },
  },
});

//* ------------ IMask Маска номера телефона ------------ *//
// var phoneMask = IMask(document.getElementById('phone'), {
//   mask: [
//     {
//       mask: '+00 (000) 00 00 000',
//       startsWith: '38',
//       lazy: false,
//       country: 'Ukraine',
//     },
//     {
//       mask: '+00 000 000 000',
//       startsWith: '48',
//       lazy: false,
//       country: 'Poland',
//     },
//     {
//       mask: '000 000 000',
//       startsWith: '',
//       lazy: false,
//     },
//     {
//       mask: '+000000000000000',
//       startsWith: '+',
//       country: 'unknown',
//     },
//   ],
//   dispatch: (appended, dynamicMasked) => {
//     const number = (dynamicMasked.value + appended).replace(/\D/g, '');

//     return dynamicMasked.compiledMasks.find(
//       m => number.indexOf(m.startsWith) === 0,
//     );
//   },
// });

// const phoneMask = IMask(document.getElementById('phone'), {
//   mask: [
//     { mask: '000 000 000', startsWith: '', lazy: false }, // без +
//     { mask: '+00 000 000 000', startsWith: '+', lazy: false }, // с +
//   ],

//   dispatch: (appended, dynamicMasked) => {
//     const value = dynamicMasked.value + appended;
//     return value.startsWith('+')
//       ? dynamicMasked.compiledMasks[1] // с +
//       : dynamicMasked.compiledMasks[0]; // без +
//   },
// });

//* ----------------- Web3Form ----------------- *//
const form = document.getElementById('form');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const formData = new FormData(form);
  // formData.append('access_key', '697ed4fb-1bb4-4b4e-aac9-ad92288a3b5d');
  formData.append('access_key', 'YOUR_ACCESS_KEY_HERE');

  const originalText = submitBtn.textContent;

  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      alert('Success! Your message has been sent.');
      form.reset();
    } else {
      alert('Error: ' + data.message);
    }
  } catch (error) {
    alert('Something went wrong. Please try again.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});
