import React from 'react';
import type { LanguageCode } from '../../i18n/languages';
import { getTranslations } from '../../i18n/ui';

type Props = {
  lang: LanguageCode;
};

export default function Footer({ lang }: Props) {
  const t = getTranslations(lang);

  return (
    <footer className="bg-[#0b0c13] border-t border-[#181c33] py-4 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>
          {t.footer.description}
        </p>
        <div className="flex gap-4">
          <span className="text-emerald-500/80 font-mono">✦ {t.footer.ecosystem}</span>
          <span>2026 Developer Edition</span>
        </div>
      </div>
    </footer>
  );
}
