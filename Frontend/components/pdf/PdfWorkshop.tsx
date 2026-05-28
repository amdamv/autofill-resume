import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
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

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

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
  const [pdfScale, setPdfScale] = useState(0.9);
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
    <div className="pdf-container">
      <div className="pdf-header">
        <div>
          <h2 className="text-lg font-display font-semibold text-cyan-300 flex items-center gap-2">
            <FileCode2 size={18} />
            LaTeX Workshop
          </h2>
          <p className="text-xs text-secondary mt-1">{t.pdf.intro}</p>
        </div>

        <button
          onClick={renderPdf}
          disabled={!activeResume || isRendering}
          className={`btn-pdf-render ${
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
                className={`btn-template ${
                  templateId === template.id
                    ? 'btn-template--active'
                    : 'btn-template--inactive'
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
                className={`btn-template ${
                  filterId === filter.id
                    ? 'btn-filter--active'
                    : 'btn-template--inactive'
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

      <div className="pdf-preview">
        {pdfUrl ? (
          <div className="h-full flex flex-col">
            <div className="pdf-toolbar">
              <span className="text-[11px] text-secondary font-mono">
                akhmad-resume.pdf
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setPdfScale((prev) => Math.max(0.5, prev - 0.1))
                  }
                  className="btn-pdf-download px-2"
                >
                  −
                </button>

                <span className="text-[11px] text-cyan-300 font-mono min-w-[42px] text-center">
                  {Math.round(pdfScale * 100)}%
                </span>

                <button
                  onClick={() =>
                    setPdfScale((prev) => Math.min(2, prev + 0.1))
                  }
                  className="btn-pdf-download px-2"
                >
                  +
                </button>

                <a
                  href={pdfUrl}
                  download="akhmad-resume.pdf"
                  className="btn-pdf-download"
                >
                  <Download size={12} />
                  {t.pdf.download}
                </a>
              </div>
            </div>
            <div className="w-full h-[560px] overflow-auto bg-[#525659] rounded-xl flex justify-center p-4">
              <Document
                file={pdfUrl}
                loading={
                  <div className="flex items-center justify-center h-full text-black">
                    Loading PDF...
                  </div>
                }
                error={
                  <div className="flex flex-col items-center justify-center h-full text-sm text-slate-700 gap-2">
                    <span>Failed to load PDF preview.</span>
                    <a
                      href={pdfUrl || ''}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-500 underline"
                    >
                      Open PDF
                    </a>
                  </div>
                }
              >
                <Page
                  pageNumber={1}
                  scale={pdfScale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            </div>
          </div>
        ) : (
          <div className="min-h-[360px] flex flex-col items-center justify-center text-center p-8">
            <FileCode2 size={42} className="text-cyan-500/40 mb-3" />
            <h3 className="text-sm font-bold text-body mb-1">
              {isRendering ? t.pdf.rendering : t.pdf.emptyTitle}
            </h3>
            <p className="text-xs text-muted max-w-md">
              {t.pdf.emptyDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
