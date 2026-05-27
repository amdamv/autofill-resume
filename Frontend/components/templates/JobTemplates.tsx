import React from 'react';
import { MOCK_JOBS } from '../../data/mockJobs';
import { ExternalLink } from 'lucide-react';
import type { LanguageCode } from '../../i18n/languages';
import { getTranslations } from '../../i18n/ui';

type Props = {
  onSelectJob: (job: typeof MOCK_JOBS[0]) => void;
  lang: LanguageCode;
};

export default function JobTemplates({ onSelectJob, lang }: Props) {
  const t = getTranslations(lang);

  return (
    <div className="space-y-6">
      <div className="border-b border-[#21274c] pb-2">
        <h2 className="text-lg font-semibold font-display text-white">
          📂 {t.templates.title}
        </h2>
        <p className="text-xs text-slate-400">
          {t.templates.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_JOBS.map((job) => (
          <div
            key={job.id}
            className="bg-[#111425] border border-[#21274c] rounded-2xl p-5 hover:border-emerald-500/30 transition-all flex flex-col"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] bg-emerald-500/10 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded-full">
                {job.company}
              </span>
              <span className="text-xs text-slate-400 font-bold font-mono">
                {job.salary}
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-1 font-display">
              {job.role}
            </h3>
            <p className="text-xs text-indigo-400 mb-4 font-mono">
              📍 {job.location}
            </p>

            <div className="bg-[#080911] p-3 rounded-xl border border-[#1b1f3c] text-[11px] text-slate-400 flex-grow max-h-48 overflow-y-auto font-sans mb-5 whitespace-pre-wrap leading-relaxed">
              {job.description}
            </div>

            <button
              onClick={() => onSelectJob(job)}
              className="w-full py-2 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 hover:from-emerald-500/20 hover:to-indigo-500/20 border border-emerald-500/20 text-emerald-400 hover:text-emerald-300 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1"
            >
              <span>{t.templates.apply}</span>
              <ExternalLink size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
