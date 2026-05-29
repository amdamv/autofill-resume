import { Sparkles } from 'lucide-react';
import type { LanguageCode } from '../../i18n/languages';
import { getTranslations } from '../../i18n/ui';
import { cn } from '../../lib/cn';

type Props = {
  lang: LanguageCode;
  isScanning: boolean;
  scanStatusStep: string | null;
  onScan: () => void;
};

export default function ScanCard({ lang, isScanning, scanStatusStep, onScan }: Props) {
  const ext = getTranslations(lang).extension;

  return (
    <div className="ext-card p-3 text-center space-y-2.5">
      <div>
        <span className="text-[10px] text-indigo-400 font-bold block tracking-widest uppercase">
          {ext.extSmartAgent}
        </span>
        <p className="text-[11px] text-secondary mt-1 max-w-xs mx-auto">
          {ext.extAgentDesc}
        </p>
      </div>

      <button
        onClick={onScan}
        disabled={isScanning}
        className={cn(
          'btn-gradient-indigo w-full',
          isScanning && 'opacity-75 cursor-not-allowed',
        )}
      >
        <Sparkles size={13} className="text-white glow-animation" />
        {isScanning ? ext.scanning : ext.scanDom}
      </button>

      {scanStatusStep && (
        <div className="text-[10px] text-emerald-400 font-mono flex items-center justify-center gap-1.5 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {scanStatusStep}
        </div>
      )}
    </div>
  );
}
