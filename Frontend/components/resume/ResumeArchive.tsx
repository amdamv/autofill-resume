import React from 'react';
import { Trash2 } from 'lucide-react';
import { useResumeStore } from '../../store/index';
import type { LanguageCode } from '../../i18n/languages';
import { cn } from '../../lib/cn';

type Props = { lang: LanguageCode };

export default function ResumeArchive({ lang }: Props) {
  const savedResumes = useResumeStore((s) => s.savedResumes);
  const activeResumeId = useResumeStore((s) => s.activeResumeId);
  const setActiveResumeId = useResumeStore((s) => s.setActiveResumeId);
  const deleteResume = useResumeStore((s) => s.deleteResume);

  return (
    <div className="panel-container/75 p-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-secondary mb-2.5">
        {lang === 'ru'
          ? 'Архив ИИ Генераций'
          : 'AI Tailored Generations History'}
      </h3>
      <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
        {savedResumes.length === 0 ? (
          <span className="text-xs text-muted italic p-1">
            {lang === 'ru'
              ? 'Пока нет адаптированных резюме...'
              : 'No custom resumes generated yet...'}
          </span>
        ) : (
          savedResumes.map((resume) => (
            <button
              key={resume.id}
              onClick={() => setActiveResumeId(resume.id)}
              className={cn(
                'flex-shrink-0 text-left px-3.5 py-2.5 rounded-xl border transition-all relative',
                activeResumeId === resume.id
                  ? 'bg-slate-800/65 border-emerald-500 text-primary'
                  : 'bg-surface/40 border-default text-secondary hover:border-slate-700',
              )}
            >
              <div className="flex items-center justify-between gap-6">
                <div>
                  <h4 className="text-xs font-bold leading-tight truncate max-w-[130px]">
                    {resume.jobTitle}
                  </h4>
                  <p className="text-[10px] text-emerald-400 font-display truncate max-w-[130px]">
                    @{resume.companyName}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteResume(resume.id);
                  }}
                  className="btn-destructive p-0.5 rounded"
                >
                  <Trash2 size={11} />
                </button>
              </div>
              <span className="absolute bottom-1 right-2 text-[8px] text-muted font-mono">
                {resume.tailoredAt}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
