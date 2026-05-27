import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Download,
  Eye,
  FileCode2,
  Loader2,
  SlidersHorizontal,
} from 'lucide-react';
import { CandidateProfile, TailoredResume } from '../../types/index';
import type { LanguageCode } from '../../i18n/languages';
import { getTranslations } from '../../i18n/ui';
import {
  RESUME_FILTERS,
  RESUME_TEMPLATES,
  ResumeFilterId,
  ResumeTemplateId,
} from './PdfOptions';

type Props = {
  profile: CandidateProfile;
  activeResume: TailoredResume | null;
  lang: LanguageCode;
};

export default function ResumePdfWorkshop({
  profile,
  activeResume,
  lang,
}: Props) {
  const t = getTranslations(lang);
  const [templateId, setTemplateId] =
    useState<ResumeTemplateId>('akhmad-classic');
  const [filterId, setFilterId] = useState<ResumeFilterId>('source');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const renderRequestId = useRef(0);
  const pdfUrlRef = useRef<string | null>(null);
  const revokeTimeoutRef = useRef<number | null>(null);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (revokeTimeoutRef.current) {
        clearTimeout(revokeTimeoutRef.current);
      }

      if (pdfUrlRef.current) {
        URL.revokeObjectURL(pdfUrlRef.current);
      }
    };
  }, []);

  // Clear PDF when activeResume becomes null (resume deleted)
  useEffect(() => {
    if (!activeResume) {
      if (revokeTimeoutRef.current) {
        clearTimeout(revokeTimeoutRef.current);
      }

      if (pdfUrlRef.current) {
        URL.revokeObjectURL(pdfUrlRef.current);
      }

      pdfUrlRef.current = null;
      setPdfUrl(null);
    }
  }, [activeResume]);

  const renderPayload = useMemo(
    () => ({
      profile,
      resume: {
        ...activeResume,
        experience:
          profile.experienceEntries && profile.experienceEntries.length > 0
            ? profile.experienceEntries
            : activeResume?.experience,
      },
      templateId,
      filterId,
    }),
    [profile, activeResume, templateId, filterId],
  );

  const renderPdf = useCallback(async () => {
    if (!activeResume) return;
    const requestId = ++renderRequestId.current;
    setIsRendering(true);
    setRenderError(null);

    try {
      const response = await fetch('/api/generate-resume/render-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(renderPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to render PDF');
      }

      const blob = await response.blob();
      if (requestId !== renderRequestId.current) return;

      const nextUrl = URL.createObjectURL(
        new Blob([blob], {
          type: 'application/pdf',
        }),
      );
      // Keep old URL alive for 2s so iframe can transition without white flash
      const oldUrl = pdfUrlRef.current;

      pdfUrlRef.current = nextUrl;
      setPdfUrl(nextUrl);

      if (oldUrl) {
        if (revokeTimeoutRef.current) {
          clearTimeout(revokeTimeoutRef.current);
        }

        revokeTimeoutRef.current = window.setTimeout(() => {
          URL.revokeObjectURL(oldUrl);
        }, 2000);
      }
    } catch (error: unknown) {
      if (requestId === renderRequestId.current) {
        setRenderError(
          error instanceof Error ? error.message : 'PDF render failed',
        );
      }
    } finally {
      if (requestId === renderRequestId.current) {
        setIsRendering(false);
      }
    }
  }, [activeResume, renderPayload]);

  return (
    <div className="bg-[#101322]/90 border border-cyan-500/20 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1f2947] pb-3">
        <div>
          <h2 className="text-lg font-display font-semibold text-cyan-300 flex items-center gap-2">
            <FileCode2 size={18} />
            LaTeX Workshop
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t.pdf.intro}
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
          {t.pdf.render}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-300 mb-2">
            <FileCode2 size={13} />
            {t.pdf.templates}
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
                  {template.description[lang]}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-300 mb-2">
            <SlidersHorizontal size={13} />
            {t.pdf.filters}
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
                  {filter.description[lang]}
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
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Download size={12} />
                {t.pdf.download}
              </a>
            </div>
            <iframe
              key={pdfUrl}
              title="Resume PDF Preview"
              src={
                pdfUrl
                  ? `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`
                  : ''
              }
              sandbox="allow-same-origin allow-scripts"
              className="w-full h-[560px] bg-white rounded-xl border-0"
            />
          </div>
        ) : (
          <div className="min-h-[360px] flex flex-col items-center justify-center text-center p-8">
            <FileCode2 size={42} className="text-cyan-500/40 mb-3" />
            <h3 className="text-sm font-bold text-slate-200 mb-1">
              {isRendering
                ? t.pdf.rendering
                : t.pdf.emptyTitle}
            </h3>
            <p className="text-xs text-slate-500 max-w-md">
              {t.pdf.emptyDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
