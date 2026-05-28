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
      <div className="border-b border-job pb-2">
        <h2 className="text-lg font-semibold font-display text-white">
          📂 {t.templates.title}
        </h2>
        <p className="text-xs text-secondary">
          {t.templates.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_JOBS.map((job) => (
          <div
            key={job.id}
            className="card-job hover:border-emerald-500/30 transition-all flex flex-col"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="company-tag">
                {job.company}
              </span>
              <span className="text-xs text-secondary font-bold font-mono">
                {job.salary}
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-1 font-display">
              {job.role}
            </h3>
            <p className="text-xs text-indigo-400 mb-4 font-mono">
              📍 {job.location}
            </p>

            <div className="job-description font-sans">
              {job.description}
            </div>

            <button
              onClick={() => onSelectJob(job)}
              className="btn-apply"
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
