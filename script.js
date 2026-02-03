// ==========================================
// Инициализация i18n и языковой функциональности
// ==========================================

// Загрузка переводов и инициализация языка
async function initializeI18n() {
  await i18n.loadTranslations('translations.json');
  i18n.initLanguage();
  i18n.updatePageTranslations();
  updateLanguageButtons();
}

// Обновление активного состояния кнопок языка
function updateLanguageButtons() {
  const currentLang = i18n.getLanguage();
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.getAttribute('data-lang') === currentLang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Обработчики переключения языка
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.getAttribute('data-lang');
    i18n.setLanguage(lang);
    i18n.updatePageTranslations();
    updateLanguageButtons();
  });
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  initializeI18n();
});

// ==========================================
// Навигация - мобильное меню
// ==========================================

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Открытие/закрытие мобильного меню
navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// Закрытие меню при клике на ссылку
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });
});

// ==========================================
// Плавная прокрутка к секциям
// ==========================================

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  });
});

// ==========================================
// Аккордион для секции "Образование"
// ==========================================

const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const accordionItem = header.parentElement;
    const isActive = accordionItem.classList.contains('active');

    // Закрываем все аккордеоны
    document.querySelectorAll('.accordion-item').forEach(item => {
      item.classList.remove('active');
    });

    // Открываем текущий, если он был закрыт
    if (!isActive) {
      accordionItem.classList.add('active');
    }
  });
});

// Открыть первый аккордеон по умолчанию
if (accordionHeaders.length > 0) {
  accordionHeaders[0].parentElement.classList.add('active');
}

// ==========================================
// Слайдер для секции "Услуги"
// ==========================================

const sliderTrack = document.getElementById('sliderTrack');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');

let currentSlide = 0;
const slideWidth = 340; // 320px ширина карточки + 20px gap

// Функция для обновления позиции слайдера
function updateSliderPosition() {
  const maxSlide =
    sliderTrack.children.length -
    Math.floor(sliderTrack.parentElement.offsetWidth / slideWidth);

  // Ограничение слайдов
  if (currentSlide < 0) {
    currentSlide = 0;
  } else if (currentSlide > maxSlide) {
    currentSlide = maxSlide;
  }

  sliderTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;

  // Управление видимостью кнопок
  sliderPrev.style.opacity = currentSlide === 0 ? '0.3' : '1';
  sliderPrev.style.cursor = currentSlide === 0 ? 'not-allowed' : 'pointer';

  sliderNext.style.opacity = currentSlide >= maxSlide ? '0.3' : '1';
  sliderNext.style.cursor =
    currentSlide >= maxSlide ? 'not-allowed' : 'pointer';
}

// Обработчики кнопок слайдера
sliderPrev.addEventListener('click', () => {
  if (currentSlide > 0) {
    currentSlide--;
    updateSliderPosition();
  }
});

sliderNext.addEventListener('click', () => {
  const maxSlide =
    sliderTrack.children.length -
    Math.floor(sliderTrack.parentElement.offsetWidth / slideWidth);
  if (currentSlide < maxSlide) {
    currentSlide++;
    updateSliderPosition();
  }
});

// Обновление при изменении размера окна
window.addEventListener('resize', () => {
  updateSliderPosition();
});

// Инициализация слайдера
updateSliderPosition();

// Поддержка свайпа на мобильных устройствах
let touchStartX = 0;
let touchEndX = 0;

sliderTrack.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

sliderTrack.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  if (touchEndX < touchStartX - 50) {
    // Свайп влево - следующий слайд
    sliderNext.click();
  }
  if (touchEndX > touchStartX + 50) {
    // Свайп вправо - предыдущий слайд
    sliderPrev.click();
  }
}

// ==========================================
// Форма контактов
// ==========================================

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', e => {
  e.preventDefault();

  // Получаем данные формы
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    message: document.getElementById('message').value,
  };

  // Валидация
  if (!formData.name || !formData.email || !formData.message) {
    showFormMessage(i18n.t('contacts.form.errorRequired'), 'error');
    return;
  }

  // Валидация email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    showFormMessage(i18n.t('contacts.form.errorEmail'), 'error');
    return;
  }

  // Симуляция отправки формы (здесь нужно добавить реальную отправку на сервер)
  // В реальном проекте здесь был бы fetch запрос к API

  // Показываем сообщение об успехе
  showFormMessage(i18n.t('contacts.form.successMessage'), 'success');

  // Очищаем форму
  contactForm.reset();

  // Для демонстрации - логируем данные
  console.log('Данные формы:', formData);
});

function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = 'block';

  // Автоматически скрываем сообщение через 5 секунд
  setTimeout(() => {
    formMessage.style.display = 'none';
  }, 5000);
}

// ==========================================
// Анимация при прокрутке (появление элементов)
// ==========================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px',
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Элементы для анимации
const animatedElements = document.querySelectorAll(
  '.service-card, .accordion-item, .contact-item',
);

animatedElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ==========================================
// Активная ссылка в навигации при прокрутке
// ==========================================

window.addEventListener('scroll', () => {
  let current = '';
  const sections = document.querySelectorAll('section[id]');

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.pageYOffset >= sectionTop - 150) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ==========================================
// Предотвращение отправки формы по Enter (кроме textarea)
// ==========================================

const formInputs = contactForm.querySelectorAll('input');
formInputs.forEach(input => {
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  });
});

// ==========================================
// Кнопка "Вверх"
// ==========================================

const scrollToTopBtn = document.getElementById('scrollToTop');

// Показываем/скрываем кнопку при прокрутке
window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.add('visible');
  } else {
    scrollToTopBtn.classList.remove('visible');
  }
});

// Прокрутка вверх при клике
scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});
