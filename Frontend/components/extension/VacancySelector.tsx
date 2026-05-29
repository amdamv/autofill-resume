import type { LanguageCode } from '../../i18n/languages';
import { getTranslations } from '../../i18n/ui';
import { MOCK_JOBS } from '../../data/mockJobs';

type Props = {
  lang: LanguageCode;
  selectedJobId: string;
  onChange: (id: string) => void;
};

export default function VacancySelector({ lang, selectedJobId, onChange }: Props) {
  const ext = getTranslations(lang).extension;

  return (
    <div className="bg-panel px-5 py-3 border-b border-default/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-secondary font-display">
          {ext.currentVacancy}
        </span>
        <select
          value={selectedJobId}
          onChange={(e) => onChange(e.target.value)}
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
  );
}
