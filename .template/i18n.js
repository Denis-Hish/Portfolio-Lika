// Простая библиотека i18n для мультиязычности
class I18n {
  constructor() {
    this.translations = {};
    this.currentLang = 'uk';
    this.fallbackLang = 'en';
  }

  // Загрузка переводов из JSON
  async loadTranslations(url) {
    try {
      const response = await fetch(url);
      this.translations = await response.json();
      return true;
    } catch (error) {
      console.error('Error loading translations:', error);
      return false;
    }
  }

  // Установка текущего языка
  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('preferredLanguage', lang);
      document.documentElement.lang = lang;
      return true;
    }
    return false;
  }

  // Получение текущего языка
  getLanguage() {
    return this.currentLang;
  }

  // Определение языка браузера
  detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.toLowerCase().split('-')[0];

    // Логика определения языка по условию:
    // Если RU или UK -> UK
    // Если PL -> PL
    // Иначе -> EN
    if (langCode === 'ru' || langCode === 'uk') {
      return 'uk';
    } else if (langCode === 'pl') {
      return 'pl';
    } else {
      return 'en';
    }
  }

  // Инициализация языка
  initLanguage() {
    // Проверяем сохраненный язык в localStorage
    const savedLang = localStorage.getItem('preferredLanguage');

    if (savedLang && this.translations[savedLang]) {
      this.setLanguage(savedLang);
    } else {
      // Определяем язык браузера
      const detectedLang = this.detectBrowserLanguage();
      this.setLanguage(detectedLang);
    }
  }

  // Получение перевода по ключу (поддержка вложенных объектов)
  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLang];

    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        // Fallback на английский если перевод не найден
        value = this.translations[this.fallbackLang];
        for (const fk of keys) {
          if (value && value[fk] !== undefined) {
            value = value[fk];
          } else {
            return key; // Возвращаем ключ если перевод не найден
          }
        }
        break;
      }
    }

    return value;
  }

  // Обновление всех переводов на странице
  updatePageTranslations() {
    // Обновляем все элементы с атрибутом data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);

      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    });

    // Обновляем элементы с HTML-контентом
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      const translation = this.t(key);
      element.innerHTML = translation;
    });
  }
}

// Создаем глобальный экземпляр i18n
const i18n = new I18n();
