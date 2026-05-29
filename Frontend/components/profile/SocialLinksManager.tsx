import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useResumeStore } from '../../store/index';
import type { LanguageCode } from '../../i18n/languages';
import { normalizeUrl } from '../../../shared/utils/url';
import PlatformGrid, { PlatformIcon } from '../extension/PlatformGrid';

const SOCIAL_PLATFORMS = [
  { id: 'linkedin', icon: 'Linkedin', label: 'LinkedIn' },
  { id: 'github', icon: 'Github', label: 'GitHub' },
  { id: 'twitter', icon: 'Twitter', label: 'X / Twitter' },
  { id: 'youtube', icon: 'Youtube', label: 'YouTube' },
  { id: 'telegram', icon: 'MessageCircle', label: 'Telegram' },
  { id: 'instagram', icon: 'Camera', label: 'Instagram' },
  { id: 'stackoverflow', icon: 'Code2', label: 'Stack Overflow' },
  { id: 'website', icon: 'Globe', label: 'Website' },
  { id: 'other', icon: 'Globe', label: 'Other' },
] as const;

type Props = { lang: LanguageCode };

export default function SocialLinksManager({ lang }: Props) {
  const socialLinks = useResumeStore((s) => s.profile.socialLinks);
  const { addSocialLink, removeSocialLink } = useResumeStore();

  const [showForm, setShowForm] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('linkedin');
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');

  const handleSave = () => {
    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) return;
    addSocialLink({
      id: crypto.randomUUID(),
      platform: selectedPlatform,
      label: label.trim() || selectedPlatform,
      url: normalizedUrl,
    });
    setUrl('');
    setLabel('');
    setSelectedPlatform('linkedin');
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs text-secondary">
          {lang === 'ru' ? 'Социальные сети' : 'Social Links'}
        </label>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-muted hover:text-emerald-400 transition-colors flex items-center gap-1 text-xs"
        >
          <Plus size={12} />
          <span className="text-[10px]">
            {lang === 'ru' ? 'Добавить' : 'Add'}
          </span>
        </button>
      </div>

      {showForm && (
        <div className="company-form">
          <PlatformGrid
            selectedPlatform={selectedPlatform}
            onSelect={setSelectedPlatform}
          />
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={lang === 'ru' ? 'Название (необязательно)' : 'Label (optional)'}
            className="input-compact mb-2"
          />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={
              selectedPlatform === 'other'
                ? (lang === 'ru' ? 'URL ссылки' : 'Enter URL')
                : `https://${selectedPlatform}.com/...`
            }
            className="input-compact"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setShowForm(false);
                setUrl('');
              }}
              className="px-3 py-1.5 text-xs text-secondary hover:text-body transition-colors"
            >
              {lang === 'ru' ? 'Отмена' : 'Cancel'}
            </button>
            <button onClick={handleSave} className="btn-add">
              {lang === 'ru' ? 'Добавить' : 'Add'}
            </button>
          </div>
        </div>
      )}

      {(socialLinks || []).length > 0 && (
        <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
          {(socialLinks || []).map((link) => {
            const platform = SOCIAL_PLATFORMS.find((p) => p.id === link.platform);
            return (
              <div key={link.id} className="company-card !py-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-indigo-400 flex-shrink-0">
                      <PlatformIcon iconId={platform?.icon || 'Globe'} />
                    </span>
                    <span className="text-[11px] text-body font-medium truncate" title={link.url}>
                      {link.label}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const idx = socialLinks?.findIndex((l) => l.id === link.id);
                      if (idx !== undefined && idx !== -1) removeSocialLink(idx);
                    }}
                    className="btn-destructive flex-shrink-0"
                  >
                    <X size={10} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {(!socialLinks || socialLinks.length === 0) && (
        <p className="text-[11px] text-muted italic">
          {lang === 'ru' ? 'Ссылки не добавлены' : 'No social links added yet'}
        </p>
      )}
    </div>
  );
}
