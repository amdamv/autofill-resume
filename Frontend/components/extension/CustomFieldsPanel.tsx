import { useState } from 'react';
import { CheckCircle2, Trash2 } from 'lucide-react';
import { useResumeStore } from '../../store/index';
import type { LanguageCode } from '../../i18n/languages';
import { getTranslations } from '../../i18n/ui';

type Props = { lang: LanguageCode };

export default function CustomFieldsPanel({ lang }: Props) {
  const { customFields, addCustomField, removeCustomField } = useResumeStore();
  const ext = getTranslations(lang).extension;

  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

  const handleAdd = () => {
    if (!newFieldKey.trim() || !newFieldValue.trim()) return;
    addCustomField(newFieldKey, newFieldLabel, newFieldValue);
    setNewFieldKey('');
    setNewFieldLabel('');
    setNewFieldValue('');
  };

  return (
    <div className="space-y-4">
      <div className="ext-info-card">
        <h4 className="text-[11px] font-bold text-emerald-400 mb-1 flex items-center gap-1">
          <CheckCircle2 size={12} />
          {ext.extDataTitle}
        </h4>
        <p className="text-[10px] text-secondary leading-relaxed font-light">
          {ext.extDataDesc}
        </p>
      </div>

      <div className="bg-panel p-3 rounded-xl border border-default space-y-2">
        <span className="text-[10px] font-bold text-indigo-300 uppercase block mb-1">
          {ext.extAddField}
        </span>

        <div className="space-y-2 text-xs">
          <div>
            <label className="text-[10px] text-muted block mb-0.5">
              {ext.extFieldKey}
            </label>
            <input
              type="text"
              value={newFieldKey}
              onChange={(e) => setNewFieldKey(e.target.value)}
              placeholder="telegram"
              className="ext-input-raw text-body"
            />
          </div>

          <div>
            <label className="text-[10px] text-muted block mb-0.5">
              {ext.extFieldLabel}
            </label>
            <input
              type="text"
              value={newFieldLabel}
              onChange={(e) => setNewFieldLabel(e.target.value)}
              placeholder="Личный Телеграм"
              className="ext-input-raw text-body"
            />
          </div>

          <div>
            <label className="text-[10px] text-muted block mb-0.5">
              {ext.extFieldValue}
            </label>
            <input
              type="text"
              value={newFieldValue}
              onChange={(e) => setNewFieldValue(e.target.value)}
              placeholder="https://t.me/amdamv"
              className="ext-input-raw text-emerald-300 font-mono"
            />
          </div>

          <button onClick={handleAdd} className="btn-indigo-solid">
            {ext.extAddBtn}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-[10px] font-bold text-secondary block uppercase tracking-wider">
          {ext.extSavedData(customFields.length)}
        </span>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {customFields.map((field) => (
            <div key={field.key} className="ext-field-card">
              <div className="truncate max-w-[190px]">
                <span className="text-[10px] text-muted font-bold uppercase block leading-tight">
                  {field.label}
                </span>
                <span className="text-body font-mono text-[11px] truncate block mt-0.5 text-emerald-400">
                  {field.value}
                </span>
              </div>

              <button
                onClick={() => removeCustomField(field.key)}
                className="btn-destructive p-1 rounded hover:bg-red-500/5 transition-colors"
                title={ext.extDelete}
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
