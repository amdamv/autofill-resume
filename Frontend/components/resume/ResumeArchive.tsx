import React from 'react';
import { Trash2 } from 'lucide-react';
import { useResumeStore } from '../../store/index';
import type { LanguageCode } from '../../i18n/languages';

type Props = { lang: LanguageCode };

export default function ResumeArchive({ lang }: Props) {
  const savedResumes = useResumeStore((s) => s.savedResumes);
  const activeResumeId = useResumeStore((s) => s.activeResumeId);
  const setActiveResumeId = useResumeStore((s) => s.setActiveResumeId);
  const deleteResume = useResumeStore((s) => s.deleteResume);

  return (
    <div className="bg-[#121420]/75 border border-[#1e233d] rounded-2xl p-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
        {lang === 'ru'
          ? 'Архив ИИ Генераций'
          : 'AI Tailored Generations History'}
      </h3>
      <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
        {savedResumes.length === 0 ? (
          <span className="text-xs text-slate-500 italic p-1">
            {lang === 'ru'
              ? 'Пока нет адаптированных резюме...'
              : 'No custom resumes generated yet...'}
          </span>
        ) : (
          savedResumes.map((resume) => (
            <button
              key={resume.id}
              onClick={() => setActiveResumeId(resume.id)}
              className={`flex-shrink-0 text-left px-3.5 py-2.5 rounded-xl border transition-all relative ${
                activeResumeId === resume.id
                  ? 'bg-slate-800/65 border-emerald-500 text-slate-100'
                  : 'bg-[#090a0f]/40 border-[#20253f] text-slate-400 hover:border-slate-700'
              }`}
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
                  className="text-slate-500 hover:text-red-400 p-0.5 rounded transition-colors"
                >
                  <Trash2 size={11} />
                </button>
              </div>
              <span className="absolute bottom-1 right-2 text-[8px] text-slate-600 font-mono">
                {resume.tailoredAt}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
