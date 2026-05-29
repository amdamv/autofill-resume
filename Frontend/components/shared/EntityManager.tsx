import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { LanguageCode } from '../../i18n/languages';

type FieldDef = {
  key: string;
  placeholder: [string, string];
};

type Props<T extends { id: string }> = {
  lang: LanguageCode;
  title: [string, string];
  emptyText: [string, string];
  entities: T[];
  fieldRows: FieldDef[][];
  onAdd: (data: Record<string, string>) => void;
  onRemove: (index: number) => void;
  renderCard: (entity: T) => React.ReactNode;
  maxHeight?: number;
};

export default function EntityManager<T extends { id: string }>({
  lang,
  title,
  emptyText,
  entities,
  fieldRows,
  onAdd,
  onRemove,
  renderCard,
  maxHeight = 160,
}: Props<T>) {
  const allKeys = fieldRows.flat().map((f) => f.key);
  const initialForm = Object.fromEntries(allKeys.map((k) => [k, ''])) as Record<string, string>;

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Record<string, string>>(initialForm);

  const setField = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setForm(initialForm);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!form[allKeys[0]]?.trim()) return;
    onAdd(Object.fromEntries(allKeys.map((k) => [k, form[k].trim()])));
    resetForm();
  };

  const t = (pair: [string, string]) => pair[lang === 'ru' ? 0 : 1];

  return (
    <div>
      <div className="flex items-center justify-between border-t border-panel/40 pt-2 mb-1">
        <label className="text-xs text-secondary">{t(title)}</label>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-muted hover:text-emerald-400 transition-colors flex items-center gap-1 text-xs"
        >
          <Plus size={12} />
          <span className="text-[10px]">{lang === 'ru' ? 'Добавить' : 'Add'}</span>
        </button>
      </div>

      {showForm && (
        <div className="company-form">
          {fieldRows.map((row, ri) =>
            row.length === 1 ? (
              <input
                key={row[0].key}
                type="text"
                value={form[row[0].key]}
                onChange={(e) => setField(row[0].key, e.target.value)}
                placeholder={t(row[0].placeholder)}
                className="input-compact"
              />
            ) : (
              <div key={ri} className="grid grid-cols-2 gap-2">
                {row.map((field) => (
                  <input
                    key={field.key}
                    type="text"
                    value={form[field.key]}
                    onChange={(e) => setField(field.key, e.target.value)}
                    placeholder={t(field.placeholder)}
                    className="input-compact"
                  />
                ))}
              </div>
            ),
          )}
          <div className="flex gap-2 justify-end">
            <button
              onClick={resetForm}
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

      {entities.length > 0 && (
        <div className="space-y-1.5 pr-1" style={{ maxHeight: `${maxHeight}px`, overflowY: 'auto' }}>
          {entities.map((entity, idx) => (
            <div key={entity.id} className="company-card">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-grow min-w-0">{renderCard(entity)}</div>
                <button
                  onClick={() => onRemove(idx)}
                  className="btn-destructive flex-shrink-0"
                >
                  <X size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {entities.length === 0 && (
        <p className="text-[11px] text-muted italic">{t(emptyText)}</p>
      )}
    </div>
  );
}
