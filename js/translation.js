// Загружаем переводы из внешнего файла
fetch('./language/lang.json')
  .then(response => response.json())
  .then(resources => {
    // Инициализируем i18next с загруженными переводами
    i18next
      .use(i18nextBrowserLanguageDetector)
      .init({
        // debug: true, // включи для отладки

        fallbackLng: 'uk', // если ничего не подошло → украинский
        supportedLngs: ['uk', 'pl'], // только эти языки

        resources, // переводы из lang.json

        interpolation: {
          escapeValue: false, // не нужно экранирование для vanilla JS
        },

        detection: {
          // порядок проверки языка
          order: ['localStorage', 'navigator', 'htmlTag'],
          lookupLocalStorage: 'i18nextLng', // ключ в localStorage
          caches: ['localStorage'], // сохраняем выбор пользователя
        },
      })
      .then(() => {
        updateContent(); // обновляем текст после инициализации
        updateLanguageButtons(); // устанавливаем активную кнопку языка
      });
  })
  .catch(error => {
    console.error('Ошибка загрузки переводов:', error);
  });

// Функция обновления всех текстов на странице
function updateContent() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translated = i18next.t(key);

    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = translated;
    } else {
      el.textContent = translated;
    }
  });

  // Меняем lang у html (важно для доступности и SEO)
  document.documentElement.lang = i18next.language.startsWith('pl')
    ? 'pl'
    : 'uk';
}

// Функция обновления активной кнопки языка
function updateLanguageButtons() {
  const currentLang = i18next.language.startsWith('pl') ? 'pl' : 'uk';
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const btnLang = btn.getAttribute('data-lang');
    if (btnLang === currentLang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Глобальная функция смены языка (вызывается по клику)
window.changeLanguage = function (lng) {
  i18next.changeLanguage(lng, () => {
    updateContent();
    updateLanguageButtons();
  });
};
