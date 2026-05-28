import { useState } from 'react';
import { useResumeStore } from '../../store/index';
import { Plus, X } from 'lucide-react';
import type { LanguageCode } from '../../i18n/languages';

type Props = { lang: LanguageCode };

export default function EducationManager({ lang }: Props) {
  const educationEntries = useResumeStore((s) => s.profile.educationEntries);
  const { addEducationEntry, removeEducationEntry } = useResumeStore();

  const [showForm, setShowForm] = useState(false);
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [field, setField] = useState('');
  const [dates, setDates] = useState('');
  const [location, setLocation] = useState('');

  const handleSave = () => {
    if (!institution.trim()) return;
    addEducationEntry({
      id: crypto.randomUUID(),
      institution: institution.trim(),
      degree: degree.trim(),
      field: field.trim(),
      dates: dates.trim(),
      location: location.trim(),
    });
    setInstitution('');
    setDegree('');
    setField('');
    setDates('');
    setLocation('');
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between border-t border-panel/40 pt-2 mb-1">
        <label className="text-xs text-secondary">
          {lang === 'ru' ? 'Образование' : 'Education'}
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
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            placeholder={lang === 'ru' ? 'Учебное заведение' : 'Institution'}
            className="input-compact"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              placeholder={lang === 'ru' ? 'Степень' : 'Degree'}
              className="input-compact"
            />
            <input
              type="text"
              value={field}
              onChange={(e) => setField(e.target.value)}
              placeholder={lang === 'ru' ? 'Специальность' : 'Field of study'}
              className="input-compact"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
              placeholder={lang === 'ru' ? 'Период' : 'Period'}
              className="input-compact"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={lang === 'ru' ? 'Локация' : 'Location'}
              className="input-compact"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setShowForm(false);
                setInstitution('');
                setDegree('');
                setField('');
                setDates('');
                setLocation('');
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

      {(educationEntries || []).length > 0 && (
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {(educationEntries || []).map((entry) => (
            <div key={entry.id} className="company-card">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-grow min-w-0">
                  <span className="text-xs font-bold text-body truncate block max-w-[200px]">
                    {entry.institution}
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-0.5">
                    {entry.degree && (
                      <span className="text-[10px] text-secondary">
                        {entry.degree}
                        {entry.field ? `, ${entry.field}` : ''}
                      </span>
                    )}
                    {entry.dates && (
                      <span className="text-[10px] text-muted font-mono">
                        {entry.dates}
                      </span>
                    )}
                  </div>
                  {entry.location && (
                    <span className="text-[10px] text-muted block">
                      {entry.location}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    const idx = educationEntries?.findIndex((e) => e.id === entry.id);
                    if (idx !== undefined && idx !== -1) removeEducationEntry(idx);
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
      {(!educationEntries || educationEntries.length === 0) && (
        <p className="text-[11px] text-muted italic">
          {lang === 'ru' ? 'Образование не добавлено' : 'No education added yet'}
        </p>
      )}
    </div>
  );
}