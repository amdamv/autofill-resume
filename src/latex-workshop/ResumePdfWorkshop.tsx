import React, { useCallback, useEffect, useState } from 'react';
import {
  Download,
  Eye,
  FileCode2,
  Loader2,
  SlidersHorizontal,
} from 'lucide-react';
import { CandidateProfile, TailoredResume } from '../types';
import {
  RESUME_FILTERS,
  RESUME_TEMPLATES,
  ResumeFilterId,
  ResumeTemplateId,
} from './options';

type Props = {
  profile: CandidateProfile;
  activeResume: TailoredResume | null;
  lang: 'ru' | 'en';
};

export default function ResumePdfWorkshop({
  profile,
  activeResume,
  lang,
}: Props) {
  const [templateId, setTemplateId] =
    useState<ResumeTemplateId>('akhmad-classic');
  const [filterId, setFilterId] = useState<ResumeFilterId>('source');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const renderPdf = useCallback(async () => {
    if (!activeResume) return;
    setIsRendering(true);
    setRenderError(null);

    try {
      const response = await fetch('/api/generate-resume/render-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          resume: activeResume,
          templateId,
          filterId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to render PDF');
      }

      const blob = await response.blob();
      const nextUrl = URL.createObjectURL(blob);
      setPdfUrl((currentUrl) => {
        if (currentUrl) URL.revokeObjectURL(currentUrl);
        return nextUrl;
      });
      downloadBlob(blob, 'akhmad-akhmedov-resume.pdf');
    } catch (error: any) {
      setRenderError(error?.message || 'PDF render failed');
    } finally {
      setIsRendering(false);
    }
  }, [activeResume, profile, templateId, filterId]);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#101322]/90 border border-cyan-500/20 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1f2947] pb-3">
        <div>
          <h2 className="text-lg font-display font-semibold text-cyan-300 flex items-center gap-2">
            <FileCode2 size={18} />
            LaTeX Workshop
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'ru'
              ? 'Выбери шаблон/фильтр, собери PDF из LaTeX и скачай готовое резюме.'
              : 'Choose a template/filter, compile LaTeX, preview and download the final resume.'}
          </p>
        </div>

        <button
          onClick={renderPdf}
          disabled={!activeResume || isRendering}
          className={`px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 transition-all flex items-center justify-center gap-2 ${
            !activeResume || isRendering ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {isRendering ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Eye size={14} />
          )}
          {lang === 'ru' ? 'Собрать PDF' : 'Render PDF'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-300 mb-2">
            <FileCode2 size={13} />
            Templates
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2">
            {RESUME_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => setTemplateId(template.id)}
                className={`text-left p-3 rounded-xl border transition-all ${
                  templateId === template.id
                    ? 'bg-cyan-500/10 border-cyan-400/50 text-white'
                    : 'bg-[#080a12]/60 border-[#202744] text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold">{template.name}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/80 text-emerald-300">
                    {template.badge}
                  </span>
                </div>
                <p className="text-[10px] leading-relaxed mt-1">
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-300 mb-2">
            <SlidersHorizontal size={13} />
            Filters
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {RESUME_FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterId(filter.id)}
                className={`text-left p-3 rounded-xl border transition-all ${
                  filterId === filter.id
                    ? 'bg-emerald-500/10 border-emerald-400/50 text-white'
                    : 'bg-[#080a12]/60 border-[#202744] text-slate-400 hover:border-slate-600'
                }`}
              >
                <span className="text-xs font-bold">{filter.name}</span>
                <p className="text-[10px] leading-relaxed mt-1">
                  {filter.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {renderError && (
        <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          {renderError}
        </div>
      )}

      <div className="bg-[#07080e] border border-[#202744] rounded-2xl overflow-hidden min-h-[360px]">
        {pdfUrl ? (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#202744] bg-[#0d1020]">
              <span className="text-[11px] text-slate-400 font-mono">
                akhmad-akhmedov-resume.pdf
              </span>
              <a
                href={pdfUrl}
                download="akhmad-akhmedov-resume.pdf"
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-bold flex items-center gap-1.5"
              >
                <Download size={12} />
                {lang === 'ru' ? 'Скачать PDF' : 'Download PDF'}
              </a>
            </div>
            <iframe
              title="Resume PDF preview"
              src={pdfUrl}
              className="w-full h-[560px] bg-white"
            />
          </div>
        ) : (
          <div className="min-h-[360px] flex flex-col items-center justify-center text-center p-8">
            <FileCode2 size={42} className="text-cyan-500/40 mb-3" />
            <h3 className="text-sm font-bold text-slate-200 mb-1">
              {lang === 'ru' ? 'PDF пока не собран' : 'PDF is not rendered yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md">
              {lang === 'ru'
                ? 'Нажми “Собрать PDF”, backend скомпилирует LaTeX через pdflatex и покажет результат здесь.'
                : 'Click Render PDF. The backend compiles LaTeX with pdflatex and shows the result here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
