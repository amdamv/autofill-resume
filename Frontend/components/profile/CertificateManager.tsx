import { useState } from 'react';
import { useResumeStore } from '../../store/index';
import { Plus, X } from 'lucide-react';
import type { LanguageCode } from '../../i18n/languages';

type Props = { lang: LanguageCode };

export default function CertificateManager({ lang }: Props) {
  const certificateEntries = useResumeStore((s) => s.profile.certificateEntries);
  const { addCertificateEntry, removeCertificateEntry } = useResumeStore();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    addCertificateEntry({
      id: crypto.randomUUID(),
      name: name.trim(),
      issuer: issuer.trim(),
      date: date.trim(),
    });
    setName('');
    setIssuer('');
    setDate('');
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between border-t border-panel/40 pt-2 mb-1">
        <label className="text-xs text-secondary">
          {lang === 'ru' ? 'Сертификаты' : 'Certificates'}
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
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={lang === 'ru' ? 'Название сертификата' : 'Certificate name'}
            className="input-compact"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder={lang === 'ru' ? 'Кем выдан' : 'Issuer'}
              className="input-compact"
            />
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder={lang === 'ru' ? 'Дата' : 'Date'}
              className="input-compact"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setShowForm(false);
                setName('');
                setIssuer('');
                setDate('');
              }}
              className="px-3 py-1.5 text-xs text-secondary hover:text-body transition-colors"
            >
              {lang === 'ru' ? 'Отмена' : 'Cancel'}
            </button>
            <button onClick={handleSave} className="btn-add">
              {lang === 'ru' ? 'Сохранить' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {(certificateEntries || []).length > 0 && (
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {(certificateEntries || []).map((entry) => (
            <div key={entry.id} className="company-card">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-grow min-w-0">
                  <span className="text-xs font-bold text-body truncate block max-w-[200px]">
                    {entry.name}
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-0.5">
                    {entry.issuer && (
                      <span className="text-[10px] text-secondary">
                        {entry.issuer}
                      </span>
                    )}
                    {entry.date && (
                      <span className="text-[10px] text-muted font-mono">
                        {entry.date}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    const idx = certificateEntries?.findIndex((e) => e.id === entry.id);
                    if (idx !== undefined && idx !== -1) removeCertificateEntry(idx);
                  }}
                  className="btn-destructive flex-shrink-0"
                >
                  <X size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {(!certificateEntries || certificateEntries.length === 0) && (
        <p className="text-[11px] text-muted italic">
          {lang === 'ru' ? 'Сертификаты не добавлены' : 'No certificates added yet'}
        </p>
      )}
    </div>
  );
}