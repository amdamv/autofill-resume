import { useResumeStore } from '../../store/index';
import { Sparkles, AlertCircle } from 'lucide-react';
import type { LanguageCode } from '../../i18n/languages';
import { cn } from '../../lib/cn';

type Props = {
  lang: LanguageCode;
};

export default function GeneratorPanel({ lang }: Props) {
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
    <div className="panel-container p-5">
      <h2 className="text-lg font-display font-semibold text-emerald-400 flex items-center gap-2 mb-3 border-b border-panel pb-3">
        <Sparkles size={18} />
        {lang === 'ru'
          ? '2. Таргет Вакансии & Генерация'
          : '2. Tailor Generator Inputs'}
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-secondary block mb-1">
              {lang === 'ru' ? 'Компания' : 'Target Company'}
            </label>
            <input
              type="text"
              value={targetCompany}
              onChange={(e) => setJobInputs({ targetCompany: e.target.value })}
              placeholder="SberTech, Yandex, etc."
              className="input-primary"
            />
          </div>
          <div>
            <label className="text-xs text-secondary block mb-1">
              {lang === 'ru' ? 'Должность в вакансии' : 'Target Role Title'}
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setJobInputs({ targetRole: e.target.value })}
              placeholder="Senior Backend Developer"
              className="input-primary"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-secondary">
              {lang === 'ru'
                ? 'Описание Вакансии (Job Description)'
                : 'Job Description (Copy Paste Here)'}
            </label>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobInputs({ jobDescription: e.target.value })}
            placeholder={
              lang === 'ru'
                ? 'Вставьте текст описания вакансии или выберите из шаблонов справа...'
                : 'Paste the target job details...'
            }
            rows={5}
            className="textarea-primary font-mono"
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
          className={cn(
            'btn-gradient',
            isGenerating && 'opacity-70 cursor-not-allowed',
          )}
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
