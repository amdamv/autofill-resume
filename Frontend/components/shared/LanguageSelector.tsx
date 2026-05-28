import React from 'react';
import { Languages } from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  type LanguageCode,
} from '../../i18n/languages';

type Props = {
  value: LanguageCode;
  onChange: (language: LanguageCode) => void;
};

export default function LanguageSelector({ value, onChange }: Props) {
  return (
    <label className="flex items-center gap-2 text-[11px] text-secondary bg-badge/60 border border-badge px-3 py-1.5 rounded-lg">
      <Languages size={13} className="text-emerald-400" />
      <span className="sr-only">Language</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as LanguageCode)}
        className="bg-transparent text-body font-mono font-bold focus:outline-none"
        aria-label="Language"
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <option key={language.code} value={language.code} className="bg-header text-primary">
            {language.shortLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
