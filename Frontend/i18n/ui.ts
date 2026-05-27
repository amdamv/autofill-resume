import {
  DEFAULT_LANGUAGE,
  type LanguageCode,
} from './languages';

export const UI_TRANSLATIONS: Record<LanguageCode, {
  header: {
    subtitle: string;
    generationsLabel: string;
    generatedCount: (count: number) => string;
    aiStatusLabel: string;
    aiStatusReady: string;
  };
  nav: {
    workspace: string;
    workspaceShort: string;
    extension: string;
    extensionShort: string;
    templates: string;
  };
  model: {
    selected: string;
  };
  guide: {
    title: string;
    beforeDashboard: string;
    afterDashboard: string;
    afterExtension: string;
    restoreProfile: string;
  };
  templates: {
    title: string;
    description: string;
    apply: string;
  };
  footer: {
    description: string;
    ecosystem: string;
  };
  pdf: {
    intro: string;
    render: string;
    templates: string;
    filters: string;
    download: string;
    rendering: string;
    emptyTitle: string;
    emptyDescription: string;
  };
}> = {
  ru: {
    header: {
      subtitle: 'Умный AI-конструктор резюме и помощник автозаполнения',
      generationsLabel: 'Генераций',
      generatedCount: (count) => `${count} сгенерировано`,
      aiStatusLabel: 'Статус ИИ',
      aiStatusReady: 'Готов к автоподбору',
    },
    nav: {
      workspace: '1. Дашборд резюме и ИИ кастомизация',
      workspaceShort: 'Дашборд',
      extension: '2. Симулятор браузерного расширения',
      extensionShort: 'Симулятор расширения',
      templates: 'Шаблоны вакансий для теста',
    },
    model: {
      selected: 'Выбранная модель:',
    },
    guide: {
      title: 'Как получить максимальный результат?',
      beforeDashboard: 'Заполните ваши данные во вкладке',
      afterDashboard: '(или нажмите "Загрузить Демо"), скопируйте нужную вакансию, сгенерируйте адаптированную версию, затем переключитесь во вкладку',
      afterExtension: 'для автозаполнения форм на сайтах.',
      restoreProfile: 'Вернуть профиль из PDF',
    },
    templates: {
      title: 'Выберите подходящий шаблон вакансии для быстрой проверки ИИ',
      description: 'Кликните на кнопку "Адаптировать эту вакансию", чтобы мгновенно подгрузить её описание в генератор резюме и настроить под целевого работодателя.',
      apply: 'Адаптировать эту вакансию',
    },
    footer: {
      description: 'Для генерации резюме используется Claude API в связке с NestJS и Zustand.',
      ecosystem: 'Экосистема Resume Autofiller',
    },
    pdf: {
      intro: 'Нажми "Собрать PDF", чтобы скомпилировать и посмотреть PDF прямо в браузере.',
      render: 'Собрать PDF',
      templates: 'Шаблоны',
      filters: 'Фильтры',
      download: 'Скачать PDF',
      rendering: 'Собираем PDF...',
      emptyTitle: 'PDF ещё не собран',
      emptyDescription: 'Нажми "Собрать PDF", backend скомпилирует LaTeX и покажет результат здесь.',
    },
  },
  en: {
    header: {
      subtitle: 'Smart AI resume builder and autofill assistant',
      generationsLabel: 'Generations',
      generatedCount: (count) => `${count} generated`,
      aiStatusLabel: 'AI status',
      aiStatusReady: 'Ready to tailor',
    },
    nav: {
      workspace: '1. Resume dashboard and AI tailoring',
      workspaceShort: 'Dashboard',
      extension: '2. Browser extension simulator',
      extensionShort: 'Extension simulator',
      templates: 'Test job templates',
    },
    model: {
      selected: 'Selected model:',
    },
    guide: {
      title: 'How to get the best result?',
      beforeDashboard: 'Fill in your profile in the',
      afterDashboard: 'tab, choose a job description, generate a tailored resume, then switch to the',
      afterExtension: 'tab to autofill application forms on job sites.',
      restoreProfile: 'Restore profile from PDF',
    },
    templates: {
      title: 'Choose a job template to test AI tailoring quickly',
      description: 'Click "Tailor this job" to load the job description into the resume generator and tune it for the target employer.',
      apply: 'Tailor this job',
    },
    footer: {
      description: 'Resume generation uses the Claude API together with NestJS and Zustand.',
      ecosystem: 'Resume Autofiller ecosystem',
    },
    pdf: {
      intro: 'Click "Render PDF" to compile and preview the PDF directly in the browser.',
      render: 'Render PDF',
      templates: 'Templates',
      filters: 'Filters',
      download: 'Download PDF',
      rendering: 'Rendering PDF...',
      emptyTitle: 'No PDF rendered yet',
      emptyDescription: 'Click "Render PDF". The backend compiles LaTeX and shows the result here.',
    },
  },
};

export function getTranslations(language: LanguageCode) {
  return UI_TRANSLATIONS[language] ?? UI_TRANSLATIONS[DEFAULT_LANGUAGE];
}
