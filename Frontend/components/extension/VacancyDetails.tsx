import { Sparkles } from 'lucide-react';
import type { LanguageCode } from '../../i18n/languages';
import { getTranslations } from '../../i18n/ui';
import { MOCK_JOBS } from '../../data/mockJobs';

type Props = {
  lang: LanguageCode;
  selectedJobId: string;
};

export default function VacancyDetails({ lang, selectedJobId }: Props) {
  const ext = getTranslations(lang).extension;
  const activeJob = MOCK_JOBS.find((j) => j.id === selectedJobId) || MOCK_JOBS[0];

  return (
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
  );
}
