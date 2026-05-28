import { Sparkles } from 'lucide-react';
import { useResumeStore } from '../../store/index';
import { MOCK_JOBS } from '../../data/mockJobs';
import type { LanguageCode } from '../../i18n/languages';
import { getTranslations } from '../../i18n/ui';
import AutofillForm from './AutofillForm';

type Props = { lang: LanguageCode };

export default function VacancyPanel({ lang }: Props) {
  const { selectedJobId, setSelectedJobId } = useResumeStore();
  const ext = getTranslations(lang).extension;
  const activeJob =
    MOCK_JOBS.find((j) => j.id === selectedJobId) || MOCK_JOBS[0];

  return (
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

      {/* Selected Vacancy Quick Chooser */}
      <div className="bg-panel px-5 py-3 border-b border-default/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-secondary font-display">
            {ext.currentVacancy}
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

      {/* Page Inner Container: Vacancy Details + Candidate Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-default flex-grow overflow-y-auto">
        {/* Vacancy Description */}
        <div
          className="p-6 space-y-4"
          style={{ backgroundColor: 'rgba(9, 11, 20, 0.4)' }}
        >
          <div className="border-b border-default pb-3">
            <span className="text-[10px] font-bold text-indigo-400 font-mono tracking-wider uppercase">
              {ext.vacancyDetails}
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
              {ext.fullRequirements}
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
              {ext.jobFillHint}
            </p>
          </div>
        </div>

        {/* Candidate Autofill Form */}
        <AutofillForm lang={lang} />
      </div>
    </div>
  );
}
