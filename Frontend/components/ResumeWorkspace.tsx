import React from 'react';
import { useResumeStore } from '../store/index';
import ProfilePanel from './profile/ProfilePanel';
import GeneratorPanel from './generator/GeneratorPanel';
import ResumePanel from './resume/ResumePanel';
import PdfWorkshop from './pdf/PdfWorkshop';

export default function ResumeWorkspace() {
  const profile = useResumeStore((s) => s.profile);
  const savedResumes = useResumeStore((s) => s.savedResumes);
  const activeResumeId = useResumeStore((s) => s.activeResumeId);

  const activeResume = savedResumes.find((r) => r.id === activeResumeId) || null;
  const [lang, setLang] = React.useState<'ru' | 'en'>('ru');

  return (
    <div
      id="resume-workspace"
      className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto pr-2 pb-10"
    >
      {/* LEFT COLUMN: Profile + Generator */}
      <div className="lg:col-span-12 xl:col-span-5 space-y-6">
        <ProfilePanel lang={lang} />
        <GeneratorPanel lang={lang} onSetLang={setLang} />
      </div>

      {/* RIGHT COLUMN: Archive + Portfolio + PDF */}
      <div className="lg:col-span-12 xl:col-span-7 flex flex-col space-y-4">
        <ResumePanel lang={lang} />
        <PdfWorkshop
          profile={profile}
          activeResume={activeResume}
          lang={lang}
        />
      </div>
    </div>
  );
}
