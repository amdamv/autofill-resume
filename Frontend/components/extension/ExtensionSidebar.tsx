import { useState } from 'react';
import { Puzzle, Sparkles, Wand2 } from 'lucide-react';
import { useResumeStore } from '../../store/index';
import type { LanguageCode } from '../../i18n/languages';
import { getTranslations } from '../../i18n/ui';
import CustomFieldsPanel from './CustomFieldsPanel';

type Props = { lang: LanguageCode };

export default function ExtensionSidebar({ lang }: Props) {
  const {
    profile,
    scannedResume,
    isScanning,
    scanStatusStep,
    isInjecting,
    injectStep,
    scanVacancyAndGenerate,
    autofillWebForm,
  } = useResumeStore();
  const ext = getTranslations(lang).extension;

  const [activeSection, setActiveSection] = useState<'fill' | 'my-data'>('fill');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyText = (txt: string, id: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="xl:w-80 ext-window border-2 border-indigo-500/30 flex flex-col shrink-0">
      {/* Extension Header */}
      <div className="ext-bottombar px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
            <Puzzle
              size={16}
              className="text-indigo-400 glow-animation animate-pulse"
            />
          </div>
          <div>
            <span className="text-xs font-bold text-white block leading-tight font-display">
              JobFill extension
            </span>
            <span className="text-[9px] text-emerald-400 font-bold font-mono">
              ✦ 1-CLICK DOM ENGINE
            </span>
          </div>
        </div>

        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono font-bold px-1.5 py-0.5 rounded">
          ACTIVE
        </span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 bg-panel border-b border-default text-center text-[11px]">
        <button
          onClick={() => setActiveSection('fill')}
          className={`ext-tab ${
            activeSection === 'fill'
              ? 'ext-tab--active'
              : 'ext-tab--inactive'
          }`}
        >
          🔌 {ext.extAutofill}
        </button>
        <button
          onClick={() => setActiveSection('my-data')}
          className={`ext-tab ${
            activeSection === 'my-data'
              ? 'ext-tab--active'
              : 'ext-tab--inactive'
          }`}
        >
          📋 {ext.extMyData} ({useResumeStore.getState().customFields.length})
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex-grow overflow-y-auto space-y-4">
        {activeSection === 'fill' ? (
          <div className="space-y-4">
            {/* Scan trigger */}
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
                onClick={() => scanVacancyAndGenerate(lang)}
                disabled={isScanning}
                className={`btn-gradient-indigo w-full ${
                  isScanning ? 'opacity-75 cursor-not-allowed' : ''
                }`}
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

            {/* Tailored resume output */}
            {scannedResume ? (
              <div className="space-y-3">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider">
                      {ext.extResumeReady}
                    </span>
                    <span className="text-[9px] text-muted font-mono">
                      1 клик
                    </span>
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
                        onClick={() =>
                          copyText(scannedResume.coverLetter, 'cov-ext')
                        }
                        className="text-[9px] text-emerald-300 hover:text-emerald-100 flex items-center gap-0.5 font-bold"
                      >
                        {copiedField === 'cov-ext'
                          ? ext.extCopied
                          : ext.extCopy}
                      </button>
                    </div>
                    <p className="text-[10px] text-body leading-normal line-clamp-2 bg-surface-deep p-1.5 rounded border border-default italic">
                      {scannedResume.coverLetter}
                    </p>
                  </div>
                </div>

                {/* Autofill button */}
                <div className="space-y-2">
                  <button
                    onClick={autofillWebForm}
                    disabled={isInjecting}
                    className={`btn-gradient-emerald ${
                      isInjecting ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
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
            ) : (
              <div className="bg-panel/50 border border-default rounded-xl p-4 text-center text-muted text-[11px] space-y-1">
                <Wand2 size={24} className="mx-auto text-muted animate-pulse" />
                <p className="font-semibold text-secondary">
                  {ext.extNotReadyTitle}
                </p>
                <p className="text-[10px] text-muted leading-normal">
                  {ext.extNotReadyDesc}
                </p>
              </div>
            )}

            {/* Current profile */}
            <div className="bg-panel/80 rounded-xl p-3 border border-default space-y-2">
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest block">
                {ext.extCurrentProfile}
              </span>
              <div className="text-[11px] text-body space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted">{ext.extName}</span>
                  <span className="font-medium truncate max-w-[150px]">
                    {profile.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{ext.extTitle}</span>
                  <span className="text-emerald-400 font-mono truncate max-w-[150px]">
                    {profile.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{ext.extContact}</span>
                  <span className="text-indigo-300 font-mono truncate max-w-[150px]">
                    {profile.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <CustomFieldsPanel lang={lang} />
        )}
      </div>

      {/* Footer */}
      <div className="ext-bottombar px-4 py-2 text-[9px] text-muted flex justify-between select-none">
        <span>v1.2.4 WebExtensions</span>
        <span className="text-emerald-500 font-mono">● All Synced</span>
      </div>
    </div>
  );
}
