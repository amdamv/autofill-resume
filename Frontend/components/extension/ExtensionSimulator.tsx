import React, { useState } from 'react';
import { useResumeStore } from '../../store/index';
import { MOCK_JOBS } from '../../data/mockJobs';
import {
  Puzzle,
  Sparkles,
  Wand2,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

export default function ExtensionSimulator() {
  const {
    profile,
    customFields,
    addCustomField,
    removeCustomField,
    selectedJobId,
    setSelectedJobId,
    webFormFields,
    setWebFormField,
    clearWebForm,
    scannedResume,
    isScanning,
    scanStatusStep,
    isInjecting,
    injectStep,
    showFormHighlight,
    scanVacancyAndGenerate,
    autofillWebForm,
  } = useResumeStore();

  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeExtensionSection, setActiveExtensionSection] = useState<
    'fill' | 'my-data'
  >('fill');

  const activeJob =
    MOCK_JOBS.find((j) => j.id === selectedJobId) || MOCK_JOBS[0];

  const handleAddCustomField = () => {
    if (!newFieldKey.trim() || !newFieldValue.trim()) return;
    addCustomField(newFieldKey, newFieldLabel, newFieldValue);
    setNewFieldKey('');
    setNewFieldLabel('');
    setNewFieldValue('');
  };

  const copyText = (txt: string, id: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="h-full flex flex-col xl:flex-row gap-6 pb-12">
      {/* LEFT PORTION: THE SIMULATED HIRING WEB PORTAL (HH.RU MOCKUP) */}
      <div className="flex-grow xl:w-2/3 bg-header border border-default rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        {/* Browser Mockbar Header */}
        <div className="bg-panel px-4 py-3 border-b border-default/75 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 hover:scale-105 transition-all" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 hover:scale-105 transition-all" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 hover:scale-105 transition-all" />
          </div>

          <div className="flex-grow max-w-lg mx-4">
            <div className="bg-surface-deep border border-default rounded-lg py-1 px-4 text-[11px] text-body font-mono text-center truncate flex items-center justify-center gap-1.5 select-none">
              <span className="text-emerald-500 font-bold">https://</span>
              <span>workplace-portal.ru/vacancy/detail/{selectedJobId}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-muted font-semibold uppercase tracking-wider hidden sm:inline">
              Tab-Mode: HTML DOM
            </span>
          </div>
        </div>

        {/* Selected Vacancy Quick Chooser bar client side */}
        <div className="bg-panel px-5 py-3 border-b border-default/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-secondary font-display">
              Текущая открытая вакансия на странице:
            </span>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="bg-surface-deep border border-default rounded-md px-2.5 py-1 text-xs text-emerald-400 font-bold outline-none"
            >
              {MOCK_JOBS.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.company} — {j.role}
                </option>
              ))}
            </select>
          </div>

          <span className="text-[10px] text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 max-w-fit">
            Extension Reads DOM content dynamically!
          </span>
        </div>

        {/* Page Inner Container (Divided into Vacancy Details & Candidate Apply Form) */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-default flex-grow overflow-y-auto">
          {/* Visual Vacancy Description left sub column */}
          <div className="p-6 space-y-4" style={{ backgroundColor: 'rgba(9, 11, 20, 0.4)' }}>
            <div className="border-b border-default pb-3">
              <span className="text-[10px] font-bold text-indigo-400 font-mono tracking-wider uppercase">
                ✦ Детали вакансии на странице
              </span>
              <h2 className="text-xl font-bold font-display text-white mt-1">
                {activeJob.role}
              </h2>
              <p className="text-xs text-emerald-400 font-semibold font-mono mt-0.5">
                🏢 {activeJob.company} • {activeJob.location}
              </p>
              <p className="text-xs text-indigo-300 font-medium font-mono mt-1">
                💰 {activeJob.salary}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-secondary">
                Полные требования рекламодателя:
              </h3>
              <div className="bg-surface-deep p-4 rounded-xl border border-default text-xs text-body leading-relaxed max-h-[340px] overflow-y-auto whitespace-pre-line font-light">
                {activeJob.description}
              </div>
            </div>

            <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/15 flex gap-2.5 items-start">
              <Sparkles
                size={16}
                className="text-emerald-400 flex-shrink-0 mt-0.5 animate-pulse"
              />
              <p className="text-[11px] text-secondary leading-normal">
                Команда JobFill считывает данные из этого левого блока напрямую.
                Кликните на{' '}
                <strong className="text-emerald-300">
                  "Считать DOM & Адаптировать"
                </strong>{' '}
                в правой панели, чтобы сымитировать считывание HTML-контента!
              </p>
            </div>
          </div>

          {/* Interactive fields to receive autofilled values */}
          <div className="p-6 space-y-4" style={{ backgroundColor: 'rgba(9, 11, 20, 0.15)' }}>
            <div className="border-b border-default pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold font-display text-white flex items-center gap-1.5">
                  📥 Форма Отклика Работодателя
                </h2>
                <p className="text-[11px] text-secondary">
                  Поля получат инъекцию при клике по автозаполнению.
                </p>
              </div>
              <button
                onClick={clearWebForm}
                className="btn-clear-small"
              >
                Очистить
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Name field */}
              <div>
                <label className="text-secondary font-medium block mb-1">
                  ФИО Соискателя
                </label>
                <input
                  type="text"
                  value={webFormFields.fullName}
                  onChange={(e) => setWebFormField('fullName', e.target.value)}
                  placeholder="Akhmad Akhmedov"
                  className={`ext-input ${
                    showFormHighlight && webFormFields.fullName
                      ? 'ext-input--highlighted'
                      : 'focus:border-indigo-500'
                  }`}
                />
              </div>

              {/* Email Phone row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-secondary font-medium block mb-1">
                    Эл. почта
                  </label>
                  <input
                    type="email"
                    value={webFormFields.email}
                    onChange={(e) => setWebFormField('email', e.target.value)}
                    placeholder="email@example.com"
                    className={`ext-input ${
                      showFormHighlight && webFormFields.email
                        ? 'ext-input--highlighted'
                        : 'focus:border-indigo-500'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-secondary font-medium block mb-1">
                    Телефон
                  </label>
                  <input
                    type="text"
                    value={webFormFields.phone}
                    onChange={(e) => setWebFormField('phone', e.target.value)}
                    placeholder="+1 (234) 123-45-67"
                    className={`ext-input ${
                      showFormHighlight && webFormFields.phone
                        ? 'ext-input--highlighted'
                        : 'focus:border-indigo-500'
                    }`}
                  />
                </div>
              </div>

              {/* Skills matching */}
              <div>
                <label className="text-secondary font-medium block mb-1">
                  Релевантные навыки (ИИ Адаптация)
                </label>
                <input
                  type="text"
                  value={webFormFields.skills}
                  onChange={(e) => setWebFormField('skills', e.target.value)}
                  placeholder="TypeScript, React, Node.js..."
                  className={`ext-input ${
                    showFormHighlight && webFormFields.skills
                      ? 'ext-input--highlighted'
                      : 'focus:border-indigo-500'
                  }`}
                />
              </div>

              {/* Github and Portfolio Autofill values */}
              <div className="ext-card">
                <div>
                  <label className="text-secondary font-medium block mb-1 text-[11px]">
                    GitHub Ссылка
                  </label>
                  <input
                    type="text"
                    value={webFormFields.githubUrl}
                    onChange={(e) =>
                      setWebFormField('githubUrl', e.target.value)
                    }
                    placeholder="https://github.com/..."
                    className={`ext-input-compact ${
                      showFormHighlight && webFormFields.githubUrl
                        ? 'ext-input-compact--highlighted'
                        : ''
                    }`}
                  />
                </div>
                <div>
                  <label className="text-secondary font-medium block mb-1 text-[11px]">
                    Личный Сайт / Портфолио
                  </label>
                  <input
                    type="text"
                    value={webFormFields.portfolioUrl}
                    onChange={(e) =>
                      setWebFormField('portfolioUrl', e.target.value)
                    }
                    placeholder="https://..."
                    className={`ext-input-compact ${
                      showFormHighlight && webFormFields.portfolioUrl
                        ? 'ext-input-compact--highlighted'
                        : ''
                    }`}
                  />
                </div>
              </div>

              {/* Expected salary & customized notice response */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-secondary font-medium block mb-1">
                    Желаемый Доход
                  </label>
                  <input
                    type="text"
                    value={webFormFields.expectedSalary}
                    onChange={(e) =>
                      setWebFormField('expectedSalary', e.target.value)
                    }
                    placeholder="1000,000$"
                    className={`ext-input ${
                      showFormHighlight && webFormFields.expectedSalary
                        ? 'ext-input--highlighted'
                        : 'focus:border-indigo-500'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-secondary font-medium block mb-1">
                    Срок возможного начала работы
                  </label>
                  <input
                    type="text"
                    value={webFormFields.customNotice}
                    onChange={(e) =>
                      setWebFormField('customNotice', e.target.value)
                    }
                    placeholder="Через 2 недели"
                    className={`ext-input ${
                      showFormHighlight && webFormFields.customNotice
                        ? 'ext-input--highlighted'
                        : 'focus:border-indigo-500'
                    }`}
                  />
                </div>
              </div>

              {/* Achievements / Experiences */}
              <div>
                <label className="text-secondary font-medium block mb-1">
                  Адаптированные ключевые достижения (в рамках резюме)
                </label>
                <textarea
                  value={webFormFields.achievements}
                  onChange={(e) =>
                    setWebFormField('achievements', e.target.value)
                  }
                  placeholder="Специфика опыта под вакансию..."
                  rows={3}
                  className={`ext-input text-xs font-sans resize-none ${
                    showFormHighlight && webFormFields.achievements
                      ? 'ext-input--highlighted font-mono text-[11px]'
                      : 'focus:border-indigo-500'
                  }`}
                />
              </div>

              {/* Cover Letter message */}
              <div>
                <label className="text-secondary font-medium block mb-1 text-indigo-400">
                  Сопроводительное ИИ-Письмо (Intro Outreach Message)
                </label>
                <textarea
                  value={webFormFields.coverLetter}
                  onChange={(e) =>
                    setWebFormField('coverLetter', e.target.value)
                  }
                  placeholder="Персональное приветствие рекрутеру на базе описания вакансии..."
                  rows={3}
                  className={`ext-input resize-none ${
                    showFormHighlight && webFormFields.coverLetter
                      ? 'ext-input--highlighted'
                      : 'focus:border-indigo-500'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PORTION: JOBFILL BROWSER EXTENSION INTERACTIVE FLOATING POPUP */}
      <div className="xl:w-80 ext-window border-2 border-indigo-500/30 flex flex-col shrink-0">
        {/* Extension Banner top brand */}
        <div className="ext-bottombar px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <Puzzle
                size={16}
                className="text-indigo-400 glow-animation animate-pulse"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-white block leading-tight font-display">
                JobFill extension
              </span>
              <span className="text-[9px] text-emerald-400 font-bold font-mono">
                ✦ 1-CLICK DOM ENGINE
              </span>
            </div>
          </div>

          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono font-bold px-1.5 py-0.5 rounded">
            ACTIVE
          </span>
        </div>

        {/* Extension Interactive Navigation Tabs */}
        <div className="grid grid-cols-2 bg-panel border-b border-default text-center text-[11px]">
          <button
            onClick={() => setActiveExtensionSection('fill')}
            className={`ext-tab ${
              activeExtensionSection === 'fill'
                ? 'ext-tab--active'
                : 'ext-tab--inactive'
            }`}
          >
            🔌 Автозаполнение
          </button>
          <button
            onClick={() => setActiveExtensionSection('my-data')}
            className={`ext-tab ${
              activeExtensionSection === 'my-data'
                ? 'ext-tab--active'
                : 'ext-tab--inactive'
            }`}
          >
            📋 Пополнить данные ({customFields.length})
          </button>
        </div>

        {/* Extension Inner Panel scroll view */}
        <div className="p-4 flex-grow overflow-y-auto space-y-4">
          {/* SECTION A: THE CORE 1-CLICK SCAN & PASTE HUB */}
          {activeExtensionSection === 'fill' && (
            <div className="space-y-4">
              {/* Core trigger block */}
              <div className="ext-card p-3 text-center space-y-2.5">
                <div>
                  <span className="text-[10px] text-indigo-400 font-bold block tracking-widest uppercase">
                    JobFill Smart Agent
                  </span>
                  <p className="text-[11px] text-secondary mt-1 max-w-xs mx-auto">
                    Сканирует текст открытой вакансии слева, активирует Claude и
                    готовит CV за секунду.
                  </p>
                </div>

                <button
                  onClick={scanVacancyAndGenerate}
                  disabled={isScanning}
                  className={`btn-gradient-indigo w-full ${
                    isScanning ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  <Sparkles size={13} className="text-white glow-animation" />
                  {isScanning
                    ? 'Считывание DOM...'
                    : 'Считать DOM & Адаптировать'}
                </button>

                {scanStatusStep && (
                  <div className="text-[10px] text-emerald-400 font-mono flex items-center justify-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {scanStatusStep}
                  </div>
                )}
              </div>

              {/* Display Tailored outputs once ready */}
              {scannedResume ? (
                <div className="space-y-3">
                  {/* Outreach notification / Intro Message ready badge */}
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider">
                        ✔ РЕЗЮМЕ & MESSAGE ГОТОВЫ!
                      </span>
                      <span className="text-[9px] text-muted font-mono">
                        1 клик
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] text-muted font-semibold block">
                        О себе:
                      </span>
                      <p className="text-[10px] text-body leading-normal line-clamp-2 bg-surface-deep p-1.5 rounded border border-default italic">
                        {scannedResume.summary}
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[9px] text-muted font-semibold">
                          Сопроводительное сообщение:
                        </span>
                        <button
                          onClick={() =>
                            copyText(scannedResume.coverLetter, 'cov-ext')
                          }
                          className="text-[9px] text-emerald-300 hover:text-emerald-100 flex items-center gap-0.5 font-bold"
                        >
                          {copiedField === 'cov-ext'
                            ? 'Скопировано!'
                            : 'Копировать'}
                        </button>
                      </div>
                      <p className="text-[10px] text-body leading-normal line-clamp-2 bg-surface-deep p-1.5 rounded border border-default italic">
                        {scannedResume.coverLetter}
                      </p>
                    </div>
                  </div>

                  {/* ACTIVE ACTION: ACTUALLY AUTOFILL THE WEB FORM INPUT FIELDS */}
                  <div className="space-y-2">
                    <button
                      onClick={autofillWebForm}
                      disabled={isInjecting}
                      className={`btn-gradient-emerald ${
                        isInjecting ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      <Wand2
                        size={13}
                        className="text-slate-950 glow-animation animate-bounce"
                      />
                      {isInjecting
                        ? 'Вставляем ячейки...'
                        : 'Вставить во все поля формы (JobFill)'}
                    </button>

                    {injectStep && (
                      <div className="bg-panel border border-emerald-500/20 p-2 rounded-lg text-center text-[10px] font-mono text-emerald-400 animate-pulse">
                        {injectStep}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-panel/50 border border-default rounded-xl p-4 text-center text-muted text-[11px] space-y-1">
                  <Wand2
                    size={24}
                    className="mx-auto text-muted animate-pulse"
                  />
                  <p className="font-semibold text-secondary">
                    Резюме еще не адаптировано
                  </p>
                  <p className="text-[10px] text-muted leading-normal">
                    Нажмите{' '}
                    <strong className="text-indigo-400">
                      "Считать DOM & Адаптировать"
                    </strong>{' '}
                    выше. Расширение прочитает требования и подготовит файлы.
                  </p>
                </div>
              )}

              {/* Active Synced Candidate Details */}
              <div className="bg-panel/80 rounded-xl p-3 border border-default space-y-2">
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest block">
                  Текущий Профиль в приложении:
                </span>
                <div className="text-[11px] text-body space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted">ФИО:</span>
                    <span className="font-medium truncate max-w-[150px]">
                      {profile.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Должность:</span>
                    <span className="text-emerald-400 font-mono truncate max-w-[150px]">
                      {profile.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Контакты:</span>
                    <span className="text-indigo-300 font-mono truncate max-w-[150px]">
                      {profile.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION B: REPLENISH PERSONAL DATA (Пополнить свои данные) */}
          {activeExtensionSection === 'my-data' && (
            <div className="space-y-4">
              <div className="ext-info-card">
                <h4 className="text-[11px] font-bold text-emerald-400 mb-1 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Пополнить данные приложения
                </h4>
                <p className="text-[10px] text-secondary leading-relaxed font-light">
                  Здесь вы можете внести свои дополнительные персональные
                  данные, ссылки на социальные сети, зарплаты или контактные
                  данные, которые расширение мгновенно сможет вставлять в
                  свободные ячейки заявок!
                </p>
              </div>

              {/* Add Custom Fields Mini Form */}
              <div className="bg-panel p-3 rounded-xl border border-default space-y-2">
                <span className="text-[10px] font-bold text-indigo-300 uppercase block mb-1">
                  ⊕ Добавить новое поле данных:
                </span>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[10px] text-muted block mb-0.5">
                      Ключ поля (ID латиницей, например github, notice)
                    </label>
                    <input
                      type="text"
                      value={newFieldKey}
                      onChange={(e) => setNewFieldKey(e.target.value)}
                      placeholder="telegram"
                      className="ext-input-raw text-body"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-muted block mb-0.5">
                      Читабельное название поля
                    </label>
                    <input
                      type="text"
                      value={newFieldLabel}
                      onChange={(e) => setNewFieldLabel(e.target.value)}
                      placeholder="Личный Телеграм"
                      className="ext-input-raw text-body"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-muted block mb-0.5">
                      Значение поля
                    </label>
                    <input
                      type="text"
                      value={newFieldValue}
                      onChange={(e) => setNewFieldValue(e.target.value)}
                      placeholder="https://t.me/alex_webdev"
                      className="ext-input-raw text-emerald-300 font-mono"
                    />
                  </div>

                  <button
                    onClick={handleAddCustomField}
                    className="btn-indigo-solid"
                  >
                    Внести в приложение
                  </button>
                </div>
              </div>

              {/* Render dynamic Custom field list with deletes */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-secondary block uppercase tracking-wider">
                  Текущие сбереженные данные ({customFields.length}):
                </span>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {customFields.map((field) => (
                    <div
                      key={field.key}
                      className="ext-field-card"
                    >
                      <div className="truncate max-w-[190px]">
                        <span className="text-[10px] text-muted font-bold uppercase block leading-tight">
                          {field.label}
                        </span>
                        <span className="text-body font-mono text-[11px] truncate block mt-0.5 text-emerald-400">
                          {field.value}
                        </span>
                      </div>

                      <button
                        onClick={() => removeCustomField(field.key)}
                        className="btn-destructive p-1 rounded hover:bg-red-500/5 transition-colors"
                        title="Удалить это поле"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Extension Footer stats */}
        <div className="ext-bottombar px-4 py-2 text-[9px] text-muted flex justify-between select-none">
          <span>v1.2.4 WebExtensions</span>
          <span className="text-emerald-500 font-mono">● All Synced</span>
        </div>
      </div>
    </div>
  );
}
