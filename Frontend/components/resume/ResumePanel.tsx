import React from 'react';
import ResumeArchive from './ResumeArchive';
import ResumePortfolio from './ResumePortfolio';

type Props = { lang: 'ru' | 'en' };

export default function ResumePanel({ lang }: Props) {
  return (
    <div className="flex flex-col space-y-4">
      <ResumeArchive lang={lang} />
      <ResumePortfolio lang={lang} />
    </div>
  );
}
