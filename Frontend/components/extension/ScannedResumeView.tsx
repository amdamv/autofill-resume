import { Wand2 } from 'lucide-react';
import type { LanguageCode } from '../../i18n/languages';
import { getTranslations } from '../../i18n/ui';
import type { TailoredResume } from '../../types/resume';
import { cn } from '../../lib/cn';

type Props = {
  lang: LanguageCode;
  scannedResume: TailoredResume | null;
  isInjecting: boolean;
  injectStep: string | null;
  copiedField: string | null;
  onAutofill: () => void;
  onCopyText: (txt: string, id: string) => void;
};

export default function ScannedResumeView({
  lang,
  scannedResume,
  isInjecting,
  injectStep,
  copiedField,
  onAutofill,
  onCopyText,
}: Props) {
  const ext = getTranslations(lang).extension;

  if (!scannedResume) {
    return (
      <div className="bg-panel/50 border border-default rounded-xl p-4 text-center text-muted text-[11px] space-y-1">
        <Wand2 size={24} className="mx-auto text-muted animate-pulse" />
        <p className="font-semibold text-secondary">{ext.extNotReadyTitle}</p>
        <p className="text-[10px] text-muted leading-normal">
          {ext.extNotReadyDesc}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider">
            {ext.extResumeReady}
          </span>
          <span className="text-[9px] text-muted font-mono">1 клик</span>
        </div>

        <div>
          <span className="text-[9px] text-muted font-semibold block">
            {ext.extAbout}
          </span>
          <p className="text-[10px] text-body leading-normal line-clamp-2 bg-surface-deep p-1.5 rounded border border-default italic">
            {scannedResume.summary}
          </p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-[9px] text-muted font-semibold">
              {ext.extCoverLetter}
            </span>
            <button
              onClick={() => onCopyText(scannedResume.coverLetter, 'cov-ext')}
              className="text-[9px] text-emerald-300 hover:text-emerald-100 flex items-center gap-0.5 font-bold"
            >
              {copiedField === 'cov-ext' ? ext.extCopied : ext.extCopy}
            </button>
          </div>
          <p className="text-[10px] text-body leading-normal line-clamp-2 bg-surface-deep p-1.5 rounded border border-default italic">
            {scannedResume.coverLetter}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={onAutofill}
          disabled={isInjecting}
          className={cn(
            'btn-gradient-emerald',
            isInjecting && 'opacity-75 cursor-not-allowed',
          )}
        >
          <Wand2
            size={13}
            className="text-slate-950 glow-animation animate-bounce"
          />
          {isInjecting ? ext.extFilling : ext.extInject}
        </button>

        {injectStep && (
          <div className="bg-panel border border-emerald-500/20 p-2 rounded-lg text-center text-[10px] font-mono text-emerald-400 animate-pulse">
            {injectStep}
          </div>
        )}
      </div>
    </div>
  );
}
