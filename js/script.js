'use strict';

const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const langBtns = document.querySelectorAll('.lang-btn');

// Переключение меню на мобильных устройствах
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navMenu.classList.toggle('open'); // Добавляем класс к меню
});

// Закрытие меню при клике на пункт навигации
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
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
