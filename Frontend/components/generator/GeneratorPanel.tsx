import React from 'react';
import { useResumeStore } from '../../store/index';
import { Sparkles, AlertCircle } from 'lucide-react';

type Props = {
  lang: 'ru' | 'en';
  onSetLang?: (lang: 'ru' | 'en') => void;
};

export default function GeneratorPanel({ lang, onSetLang }: Props) {
  const {
    jobDescription,
    targetCompany,
    targetRole,
    setJobInputs,
    isGenerating,
    generatorError,
    generateTailoredResume,
  } = useResumeStore();

  return (
    <div className="bg-[#121420]/90 border border-[#1e233d] rounded-2xl p-5 shadow-xl">
      <h2 className="text-lg font-display font-semibold text-emerald-400 flex items-center gap-2 mb-3 border-b border-[#1e233d] pb-3">
        <Sparkles size={18} />
        {lang === 'ru'
          ? '2. Таргет Вакансии & Генерация'
          : '2. Tailor Generator Inputs'}
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">
              {lang === 'ru' ? 'Компания' : 'Target Company'}
            </label>
            <input
              type="text"
              value={targetCompany}
              onChange={(e) =>
                setJobInputs({ targetCompany: e.target.value })
              }
              placeholder="SberTech, Yandex, etc."
              className="w-full px-3 py-2 text-xs bg-[#090a0f] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">
              {lang === 'ru' ? 'Должность в вакансии' : 'Target Role Title'}
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setJobInputs({ targetRole: e.target.value })}
              placeholder="Senior React Developer"
              className="w-full px-3 py-2 text-xs bg-[#090a0f] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-slate-400">
              {lang === 'ru'
                ? 'Описание Вакансии (Job Description)'
                : 'Job Description (Copy Paste Here)'}
            </label>
            <div className="flex gap-1">
              <button
                onClick={() => onSetLang?.('ru')}
                className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                  lang === 'ru'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                RU
              </button>
              <button
                onClick={() => onSetLang?.('en')}
                className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                  lang === 'en'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                EN
              </button>
            </div>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) =>
              setJobInputs({ jobDescription: e.target.value })
            }
            placeholder={
              lang === 'ru'
                ? 'Вставьте текст описания вакансии или выберите из шаблонов справа...'
                : 'Paste the target job details...'
            }
            rows={5}
            className="w-full px-3 py-2 text-xs bg-[#090a0f] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>

        {generatorError && (
          <div className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
            <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
            <span>{generatorError}</span>
          </div>
        )}

        <button
          onClick={() => generateTailoredResume(lang)}
          disabled={isGenerating}
          className={`w-full py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2 ${
            isGenerating ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {lang === 'ru'
                ? 'Анализируем вакансию ИИ...'
                : 'AI Adapting Resume...'}
            </>
          ) : (
            <>
              <Sparkles size={16} className="text-white glow-animation" />
              {lang === 'ru'
                ? 'Адаптировать Резюме по ИИ'
                : 'Generate Tailored Resume'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
