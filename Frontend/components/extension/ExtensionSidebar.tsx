import { useState } from 'react';
import { useResumeStore } from '../../store/index';
import type { LanguageCode } from '../../i18n/languages';
import { cn } from '../../lib/cn';
import { getTranslations } from '../../i18n/ui';
import CustomFieldsPanel from './CustomFieldsPanel';
import ExtensionHeader from './ExtensionHeader';
import ScanCard from './ScanCard';
import ScannedResumeView from './ScannedResumeView';
import ProfileCard from './ProfileCard';
import ExtensionFooter from './ExtensionFooter';

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

  const customFieldsCount = useResumeStore((s) => s.customFields.length);
  const [activeSection, setActiveSection] = useState<'fill' | 'my-data'>('fill');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyText = (txt: string, id: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="xl:w-80 ext-window border-2 border-indigo-500/30 flex flex-col shrink-0">
      <ExtensionHeader />

      <div className="grid grid-cols-2 bg-panel border-b border-default text-center text-[11px]">
        <button
          onClick={() => setActiveSection('fill')}
          className={cn(
            'ext-tab',
            activeSection === 'fill' ? 'ext-tab--active' : 'ext-tab--inactive',
          )}
        >
          🔌 {ext.extAutofill}
        </button>
        <button
          onClick={() => setActiveSection('my-data')}
          className={cn(
            'ext-tab',
            activeSection === 'my-data' ? 'ext-tab--active' : 'ext-tab--inactive',
          )}
        >
          📋 {ext.extMyData} ({customFieldsCount})
        </button>
      </div>

      <div className="p-4 flex-grow overflow-y-auto space-y-4">
        {activeSection === 'fill' ? (
          <div className="space-y-4">
            <ScanCard
              lang={lang}
              isScanning={isScanning}
              scanStatusStep={scanStatusStep}
              onScan={() => scanVacancyAndGenerate(lang)}
            />

            <ScannedResumeView
              lang={lang}
              scannedResume={scannedResume}
              isInjecting={isInjecting}
              injectStep={injectStep}
              copiedField={copiedField}
              onAutofill={autofillWebForm}
              onCopyText={copyText}
            />

            <ProfileCard lang={lang} profile={profile} />
          </div>
        ) : (
          <CustomFieldsPanel lang={lang} />
        )}
      </div>

      <ExtensionFooter />
    </div>
  );
}
