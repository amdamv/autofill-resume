import React, { useState } from 'react';
import { useResumeStore } from '../../store/index';
import type { ExperienceEntry } from '../../types/index';
import { Plus, X } from 'lucide-react';
import type { LanguageCode } from '../../i18n/languages';

type Props = {
  lang: LanguageCode;
};

export default function CompanyManager({ lang }: Props) {
  const profile = useResumeStore((s) => s.profile);
  const { addProfileExperience, removeProfileExperience, addProfileExpBullet, removeProfileExpBullet } = useResumeStore();

  const [newCompany, setNewCompany] = useState<ExperienceEntry>({
    company: '', position: '', dates: '', location: '', bullets: [],
  });
  const [newExpBullet, setNewExpBullet] = useState<Record<number, string>>({});
  const [showCompanyForm, setShowCompanyForm] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between border-t border-[#1e233d]/40 pt-2 mb-1">
        <label className="text-xs text-slate-400">
          {lang === 'ru' ? 'Места Работы (Компании)' : 'Work Experience (Companies)'}
        </label>
        <button
          onClick={() => setShowCompanyForm(!showCompanyForm)}
          className="text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-1 text-xs"
        >
          <Plus size={12} />
          <span className="text-[10px]">
            {lang === 'ru' ? 'Добавить' : 'Add'}
          </span>
        </button>
      </div>

      {/* Inline company form */}
      {showCompanyForm && (
        <div className="bg-[#090a0f]/80 border border-[#20253f] rounded-xl p-3 mb-2 space-y-2">
          <input
            type="text"
            value={newCompany.company}
            onChange={(e) => setNewCompany({ ...newCompany, company: e.target.value })}
            placeholder={lang === 'ru' ? 'Компания' : 'Company'}
            className="w-full px-2.5 py-1.5 text-xs bg-[#07080e] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={newCompany.position}
              onChange={(e) => setNewCompany({ ...newCompany, position: e.target.value })}
              placeholder={lang === 'ru' ? 'Должность' : 'Position'}
              className="col-span-2 px-2.5 py-1.5 text-xs bg-[#07080e] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              value={newCompany.dates}
              onChange={(e) => setNewCompany({ ...newCompany, dates: e.target.value })}
              placeholder={lang === 'ru' ? 'Период' : 'Period'}
              className="px-2.5 py-1.5 text-xs bg-[#07080e] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <input
            type="text"
            value={newCompany.location}
            onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
            placeholder={lang === 'ru' ? 'Локация' : 'Location'}
            className="w-full px-2.5 py-1.5 text-xs bg-[#07080e] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setShowCompanyForm(false);
                setNewCompany({ company: '', position: '', dates: '', location: '', bullets: [] });
              }}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              {lang === 'ru' ? 'Отмена' : 'Cancel'}
            </button>
            <button
              onClick={() => {
                if (newCompany.company.trim()) {
                  addProfileExperience({ ...newCompany, bullets: [] });
                  setNewCompany({ company: '', position: '', dates: '', location: '', bullets: [] });
                  setShowCompanyForm(false);
                }
              }}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-lg transition-colors"
            >
              {lang === 'ru' ? 'Сохранить' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* Company cards */}
      {(profile.experienceEntries || []).length > 0 && (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {profile.experienceEntries!.map((exp, expIdx) => (
            <div key={expIdx} className="bg-[#090a0f]/60 rounded-xl border border-[#20253f]/50 p-3">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[180px]">
                      {exp.company || 'Company'}
                    </span>
                    {exp.position && (
                      <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                        — {exp.position}
                      </span>
                    )}
                    {exp.dates && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        {exp.dates}
                      </span>
                    )}
                  </div>
                  {exp.location && (
                    <p className="text-[10px] text-slate-500">{exp.location}</p>
                  )}
                </div>
                <button
                  onClick={() => removeProfileExperience(expIdx)}
                  className="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <X size={11} />
                </button>
              </div>
              <ul className="list-disc list-inside space-y-0.5 mb-1">
                {exp.bullets.map((b, bIdx) => (
                  <li key={bIdx} className="text-[11px] text-slate-300 leading-relaxed flex items-start gap-1.5 group">
                    <span className="flex-grow">{b}</span>
                    <button
                      onClick={() => removeProfileExpBullet(expIdx, bIdx)}
                      className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all mt-0.5 flex-shrink-0"
                    >
                      <X size={10} />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newExpBullet[expIdx] || ''}
                  onChange={(e) => setNewExpBullet((prev) => ({ ...prev, [expIdx]: e.target.value }))}
                  onKeyDown={(e) => {
                    const val = newExpBullet[expIdx]?.trim();
                    if (e.key === 'Enter' && val) {
                      addProfileExpBullet(expIdx, val);
                      setNewExpBullet((prev) => ({ ...prev, [expIdx]: '' }));
                    }
                  }}
                  placeholder={lang === 'ru' ? 'Достижение...' : 'Add achievement...'}
                  className="flex-grow px-2 py-1 text-[10px] bg-[#07080e] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => {
                    const val = newExpBullet[expIdx]?.trim();
                    if (val) {
                      addProfileExpBullet(expIdx, val);
                      setNewExpBullet((prev) => ({ ...prev, [expIdx]: '' }));
                    }
                  }}
                  className="px-2 py-1 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-lg transition-colors"
                >
                  <Plus size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {(!profile.experienceEntries || profile.experienceEntries.length === 0) && (
        <p className="text-[11px] text-slate-600 italic">
          {lang === 'ru' ? 'Компании не добавлены' : 'No companies added yet'}
        </p>
      )}
    </div>
  );
}
