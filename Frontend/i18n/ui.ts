import { DEFAULT_LANGUAGE, type LanguageCode } from './languages';

export const UI_TRANSLATIONS: Record<
  LanguageCode,
  {
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
    extension: {
      currentVacancy: string;
      vacancyDetails: string;
      fullRequirements: string;
      jobFillHint: string;
      scanDom: string;
      scanning: string;
      formTitle: string;
      formHint: string;
      clear: string;
      labelName: string;
      labelEmail: string;
      labelPhone: string;
      labelSkills: string;
      labelGitHub: string;
      labelPortfolio: string;
      labelSalary: string;
      labelStartDate: string;
      labelAchievements: string;
      labelCoverLetter: string;
      placeholderName: string;
      placeholderEmail: string;
      placeholderPhone: string;
      placeholderSkills: string;
      placeholderGitHub: string;
      placeholderPortfolio: string;
      placeholderSalary: string;
      placeholderStartDate: string;
      placeholderAchievements: string;
      placeholderCoverLetter: string;
      extAutofill: string;
      extMyData: string;
      extSmartAgent: string;
      extAgentDesc: string;
      extResumeReady: string;
      extAbout: string;
      extCoverLetter: string;
      extCopy: string;
      extCopied: string;
      extFilling: string;
      extInject: string;
      extNotReadyTitle: string;
      extNotReadyDesc: string;
      extCurrentProfile: string;
      extName: string;
      extTitle: string;
      extContact: string;
      extDataTitle: string;
      extDataDesc: string;
      extAddField: string;
      extFieldKey: string;
      extFieldLabel: string;
      extFieldValue: string;
      extAddBtn: string;
      extSavedData: (count: number) => string;
      extDelete: string;
    };
  }
> = {
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
      afterDashboard:
        '(или нажмите "Загрузить Демо"), скопируйте нужную вакансию, сгенерируйте адаптированную версию, затем переключитесь во вкладку',
      afterExtension: 'для автозаполнения форм на сайтах.',
    },
    templates: {
      title: 'Выберите подходящий шаблон вакансии для быстрой проверки ИИ',
      description:
        'Кликните на кнопку "Адаптировать эту вакансию", чтобы мгновенно подгрузить её описание в генератор резюме и настроить под целевого работодателя.',
      apply: 'Адаптировать эту вакансию',
    },
    footer: {
      description:
        'Для генерации резюме используется Claude API в связке с NestJS и Zustand.',
      ecosystem: 'Экосистема Resume Autofiller',
    },
    pdf: {
      intro:
        'Нажми "Собрать PDF", чтобы скомпилировать и посмотреть PDF прямо в браузере.',
      render: 'Собрать PDF',
      templates: 'Шаблоны',
      filters: 'Фильтры',
      download: 'Скачать PDF',
      rendering: 'Собираем PDF...',
      emptyTitle: 'PDF ещё не собран',
      emptyDescription:
        'Нажми "Собрать PDF", backend скомпилирует LaTeX и покажет результат здесь.',
    },
    extension: {
      currentVacancy: 'Текущая открытая вакансия на странице:',
      vacancyDetails: '✦ Детали вакансии на странице',
      fullRequirements: 'Полные требования рекрутера:',
      jobFillHint:
        'Команда JobFill считывает данные из этого левого блока напрямую. Кликните на "Считать DOM & Адаптировать" в правой панели, чтобы сымитировать считывание HTML-контента!',
      scanDom: 'Считать DOM и Адаптировать',
      scanning: 'Считывание DOM...',
      formTitle: 'Форма Отклика Работодателя',
      formHint: 'Поля получат инъекцию при клике по автозаполнению.',
      clear: 'Очистить',
      labelName: 'ФИО Соискателя',
      labelEmail: 'Эл. почта',
      labelPhone: 'Телефон',
      labelSkills: 'Релевантные навыки (ИИ Адаптация)',
      labelGitHub: 'GitHub Ссылка',
      labelPortfolio: 'Личный Сайт / Портфолио',
      labelSalary: 'Желаемый Доход',
      labelStartDate: 'Срок возможного начала работы',
      labelAchievements: 'Адаптированные ключевые достижения (в рамках резюме)',
      labelCoverLetter: 'Сопроводительное ИИ-Письмо (Intro Outreach Message)',
      placeholderName: 'Akhmad Akhmedov',
      placeholderEmail: 'email@example.com',
      placeholderPhone: '+1 (234) 123-45-67',
      placeholderSkills: 'TypeScript, React, Node.js...',
      placeholderGitHub: 'https://github.com/...',
      placeholderPortfolio: 'https://...',
      placeholderSalary: '1000,000$',
      placeholderStartDate: 'Через 2 недели',
      placeholderAchievements: 'Специфика опыта под вакансию...',
      placeholderCoverLetter:
        'Персональное приветствие рекрутеру на базе описания вакансии...',
      extAutofill: 'Автозаполнение',
      extMyData: 'Пополнить данные',
      extSmartAgent: 'JobFill Smart Agent',
      extAgentDesc:
        'Сканирует текст открытой вакансии слева, активирует Claude и готовит CV за секунду.',
      extResumeReady: '✔ РЕЗЮМЕ И MESSAGE ГОТОВЫ!',
      extAbout: 'О себе:',
      extCoverLetter: 'Сопроводительное сообщение:',
      extCopy: 'Копировать',
      extCopied: 'Скопировано!',
      extFilling: 'Вставляем ячейки...',
      extInject: 'Вставить во все поля формы (JobFill)',
      extNotReadyTitle: 'Резюме еще не адаптировано',
      extNotReadyDesc:
        'Нажмите "Считать DOM & Адаптировать" выше. Расширение прочитает требования и подготовит файлы.',
      extCurrentProfile: 'Текущий Профиль в приложении:',
      extName: 'ФИО:',
      extTitle: 'Должность:',
      extContact: 'Контакты:',
      extDataTitle: 'Пополнить данные приложения',
      extDataDesc:
        'Здесь вы можете внести свои дополнительные персональные данные, ссылки на социальные сети, зарплаты или контактные данные, которые расширение мгновенно сможет вставлять в свободные ячейки заявок!',
      extAddField: '⊕ Добавить новое поле данных:',
      extFieldKey: 'Ключ поля (ID латиницей, например github, notice)',
      extFieldLabel: 'Читабельное название поля',
      extFieldValue: 'Значение поля',
      extAddBtn: 'Внести в приложение',
      extSavedData: (count) => `Текущие сбереженные данные (${count}):`,
      extDelete: 'Удалить это поле',
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
      afterDashboard:
        'tab, choose a job description, generate a tailored resume, then switch to the',
      afterExtension: 'tab to autofill application forms on job sites.',
    },
    templates: {
      title: 'Choose a job template to test AI tailoring quickly',
      description:
        'Click "Tailor this job" to load the job description into the resume generator and tune it for the target employer.',
      apply: 'Tailor this job',
    },
    footer: {
      description:
        'Resume generation uses the Claude API together with NestJS and Zustand.',
      ecosystem: 'Resume Autofiller ecosystem',
    },
    pdf: {
      intro:
        'Click "Render PDF" to compile and preview the PDF directly in the browser.',
      render: 'Render PDF',
      templates: 'Templates',
      filters: 'Filters',
      download: 'Download PDF',
      rendering: 'Rendering PDF...',
      emptyTitle: 'No PDF rendered yet',
      emptyDescription:
        'Click "Render PDF". The backend compiles LaTeX and shows the result here.',
    },
    extension: {
      currentVacancy: 'Current vacancy on page:',
      vacancyDetails: '✦ Vacancy Details',
      fullRequirements: 'Full employer requirements:',
      jobFillHint:
        'JobFill reads data from this left block directly. Click "Scan DOM & Adapt" in the right panel to simulate HTML content scanning!',
      scanDom: 'Scan DOM & Adapt',
      scanning: 'Reading DOM...',
      formTitle: 'Employer Response Form',
      formHint: 'Fields will be filled when autofill is clicked.',
      clear: 'Clear',
      labelName: 'Full Name',
      labelEmail: 'Email',
      labelPhone: 'Phone',
      labelSkills: 'Relevant Skills (AI Adapted)',
      labelGitHub: 'GitHub Link',
      labelPortfolio: 'Personal Site / Portfolio',
      labelSalary: 'Desired Salary',
      labelStartDate: 'Earliest Start Date',
      labelAchievements: 'Tailored Key Achievements',
      labelCoverLetter: 'AI Cover Letter (Intro Outreach Message)',
      placeholderName: 'Akhmad Akhmedov',
      placeholderEmail: 'email@example.com',
      placeholderPhone: '+1 (234) 123-45-67',
      placeholderSkills: 'TypeScript, React, Node.js...',
      placeholderGitHub: 'https://github.com/...',
      placeholderPortfolio: 'https://...',
      placeholderSalary: '100,000$',
      placeholderStartDate: 'In 2 weeks',
      placeholderAchievements: 'Tailored experience for this role...',
      placeholderCoverLetter:
        'Personalized recruiter intro message based on the job description...',
      extAutofill: 'Autofill',
      extMyData: 'My Data',
      extSmartAgent: 'JobFill Smart Agent',
      extAgentDesc:
        'Scans the vacancy text, activates Claude, and prepares your CV in seconds.',
      extResumeReady: '✔ RESUME AND MESSAGE READY!',
      extAbout: 'About me:',
      extCoverLetter: 'Cover letter:',
      extCopy: 'Copy',
      extCopied: 'Copied!',
      extFilling: 'Filling fields...',
      extInject: 'Autofill all form fields (JobFill)',
      extNotReadyTitle: 'Resume not yet tailored',
      extNotReadyDesc:
        'Click "Scan DOM & Adapt" above. The extension will read the requirements and prepare your files.',
      extCurrentProfile: 'Current Profile in App:',
      extName: 'Name:',
      extTitle: 'Title:',
      extContact: 'Contact:',
      extDataTitle: 'Add custom data',
      extDataDesc:
        'Here you can enter additional personal data, links to social networks, salary expectations, or contact details. The extension will instantly use them to fill in form fields!',
      extAddField: '⊕ Add a new data field:',
      extFieldKey: 'Field key (Latin ID, e.g., github, notice)',
      extFieldLabel: 'Display field name',
      extFieldValue: 'Field value',
      extAddBtn: 'Add to app',
      extSavedData: (count) => `Saved custom data (${count}):`,
      extDelete: 'Delete this field',
    },
  },
};

export function getTranslations(language: LanguageCode) {
  return UI_TRANSLATIONS[language] ?? UI_TRANSLATIONS[DEFAULT_LANGUAGE];
}
