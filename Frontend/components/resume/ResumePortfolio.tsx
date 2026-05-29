import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Code,
  Briefcase,
  Globe,
  Plus,
  X,
  Sparkles,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../../store/index';
import CopyButton from '../shared/CopyButton';
import type { LanguageCode } from '../../i18n/languages';
import { cn } from '../../lib/cn';
import {
  SKILL_CATEGORIES as SHARED_CATEGORIES,
  categorizeSkill,
} from '../../../shared/config/skill-categories';

const SKILL_CATEGORIES = SHARED_CATEGORIES.map((c) => ({ key: c.key, label: c.label }));

type SkillEntry = { id: string; name: string; category: string };
type Props = { lang: LanguageCode };

export default function ResumePortfolio({ lang }: Props) {
  const profile = useResumeStore((s) => s.profile);
  const savedResumes = useResumeStore((s) => s.savedResumes);
  const activeResumeId = useResumeStore((s) => s.activeResumeId);
  const addResumeBullet = useResumeStore((s) => s.addResumeBullet);
  const removeResumeBullet = useResumeStore((s) => s.removeResumeBullet);
  const syncPortfolioSkills = useResumeStore((s) => s.syncPortfolioSkills);

  const activeResume = savedResumes.find((r) => r.id === activeResumeId) || null;

  const [newBullet, setNewBullet] = useState('');
  const [editableSkills, setEditableSkills] = useState<SkillEntry[]>(() =>
    (profile.skills ?? []).map((s) => ({ id: crypto.randomUUID(), name: s, category: categorizeSkill(s) }))
  );
  const [categoryOrder, setCategoryOrder] = useState<string[]>(
    SKILL_CATEGORIES.map((c) => c.key),
  );
  const [categoryLabels, setCategoryLabels] = useState<Record<string, string>>({});
  const [newCatName, setNewCatName] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [dragInsertPos, setDragInsertPos] = useState<{ key: string; position: 'before' | 'after' } | null>(null);
  const [editingCatKey, setEditingCatKey] = useState<string | null>(null);
  const [editingCatValue, setEditingCatValue] = useState('');

  const allCategories = categoryOrder.map((key) => {
    const builtin = SKILL_CATEGORIES.find((c) => c.key === key);
    return { key, label: categoryLabels[key] || builtin?.label || key };
  });

  // Keep in sync when profile skills change (user adds in ProfilePanel)
  useEffect(() => {
    setEditableSkills((prev) => {
      const existing = new Map(prev.map((s) => [s.name.toLowerCase(), s]));
      const updated: SkillEntry[] = [];
      for (const name of profile.skills ?? []) {
        const key = name.toLowerCase();
        if (existing.has(key)) {
          updated.push(existing.get(key)!);
          existing.delete(key);
        } else {
          updated.push({ id: crypto.randomUUID(), name, category: categorizeSkill(name) });
        }
      }
      // Keep any extra skills from AI or manual + adds
      for (const entry of existing.values()) {
        updated.push(entry);
      }
      return updated;
    });
  }, [profile.skills ?? []]);

  // When AI generates a new resume, ADD new skills from the job (keep user edits & categories)
  useEffect(() => {
    if (!activeResume) return;

    const cats = activeResume.categorizedSkills;
    // Build AI skill→category map for new skills
    const skillCats = new Map<string, string>();
    // Normalize AI category labels to existing keys (e.g. "Backend" → "backend")
    const labelToKey = new Map<string, string>();
    for (const key of categoryOrder) {
      const builtin = SKILL_CATEGORIES.find((c) => c.key === key);
      const label = categoryLabels[key] || builtin?.label || key;
      labelToKey.set(label.toLowerCase(), key);
    }
    if (cats?.length) {
      for (const c of cats) {
        for (const s of c.skills) {
          skillCats.set(s.toLowerCase(), c.category);
        }
      }
    }

    // Only add skills that don't already exist — never override user's categories or order
    setEditableSkills((prev) => {
      const existing = new Map(prev.map((s) => [s.name.toLowerCase(), s]));
      for (const name of activeResume.highlightedSkills) {
        const key = name.toLowerCase();
        if (!existing.has(key)) {
          const aiCat = skillCats.get(key);
          const normalizedCat = aiCat
            ? (labelToKey.get(aiCat.toLowerCase()) || aiCat)
            : categorizeSkill(name);
          existing.set(key, {
            id: crypto.randomUUID(),
            name,
            category: normalizedCat,
          });
        }
      }
      return [...existing.values()];
    });
  }, [activeResume?.id, categoryOrder, categoryLabels]);

  // Sync portfolio skill state to store for PDF generation
  useEffect(() => {
    const grouped = categoryOrder
      .map((catKey) => {
        const builtin = SKILL_CATEGORIES.find((c) => c.key === catKey);
        return {
          category: categoryLabels[catKey] || builtin?.label || catKey,
          skills: editableSkills
            .filter((s) => s.category === catKey)
            .map((s) => s.name),
        };
      })
      .filter((c) => c.skills.length > 0);
    syncPortfolioSkills(grouped, categoryOrder);
  }, [editableSkills, categoryOrder, syncPortfolioSkills]);

  const handleRemoveSkill = useCallback((id: string) => {
    setEditableSkills((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleMoveSkill = useCallback((id: string, category: string) => {
    setEditableSkills((prev) => prev.map((s) => (s.id === id ? { ...s, category } : s)));
  }, []);

  const handleReorderCategory = useCallback((fromKey: string, toKey: string, position: 'before' | 'after' = 'before') => {
    if (fromKey === toKey) return;
    setCategoryOrder((prev) => {
      const fromIdx = prev.indexOf(fromKey);
      const toIdx = prev.indexOf(toKey);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const next = [...prev];
      next.splice(fromIdx, 1);
      // After removal, toIdx may shift if fromKey was before toKey
      const adjustedToIdx = toIdx > fromIdx ? toIdx - 1 : toIdx;
      const insertAt = position === 'before' ? adjustedToIdx : adjustedToIdx + 1;
      next.splice(insertAt, 0, fromKey);
      return next;
    });
  }, []);

  const handleStartRename = useCallback((key: string, currentLabel: string) => {
    setEditingCatKey(key);
    setEditingCatValue(currentLabel);
  }, []);

  const handleFinishRename = useCallback(() => {
    const key = editingCatKey;
    const val = editingCatValue.trim();
    if (key && val) {
      setCategoryLabels((prev) => ({ ...prev, [key]: val }));
    }
    setEditingCatKey(null);
    setEditingCatValue('');
  }, [editingCatKey, editingCatValue]);

  const handleAddCategory = useCallback(() => {
    const name = newCatName.trim().toLowerCase().replace(/\s+/g, '-');
    if (!name || categoryOrder.includes(name)) return;
    const label = newCatName.trim();
    setCategoryOrder((prev) => [...prev, name]);
    setCategoryLabels((prev) => ({ ...prev, [name]: label }));
    setNewCatName('');
    setIsAddingCat(false);
  }, [newCatName, categoryOrder]);

  const hasAnySkills = editableSkills.length > 0;

  return (
    <AnimatePresence mode="wait">
      {activeResume ? (
        <motion.div
          key={activeResume.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="portfolio-card"
        >
          {/* Badge indicating active in extension */}
          <div className="badge-active absolute top-4 right-4 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            {lang === 'ru'
              ? 'АКТИВНО ДЛЯ РАСШИРЕНИЯ'
              : 'ACTIVE IN EXTENSION'}
          </div>

          {/* Header */}
          <div className="border-b border-default pb-4 mb-5">
            <span className="text-xs text-rose-400 font-mono font-bold uppercase tracking-widest block mb-0.5">
              ✦ Optimized AI Portfolio
            </span>
            <h1 className="text-2xl font-bold font-display text-white">
              {profile.name || 'Candidate Name'}
            </h1>
            <p className="text-emerald-dark font-medium text-sm flex items-center gap-1">
              {activeResume.jobTitle}{' '}
              <span className="text-muted">at</span>{' '}
              {activeResume.companyName}
            </p>

            <div className="flex flex-wrap gap-4 mt-3 text-xs text-secondary">
              {profile.email && <span>📧 {profile.email}</span>}
              {profile.phone && <span>📱 {profile.phone}</span>}
              {profile.educationEntries && profile.educationEntries.length > 0 ? (
                <span className="truncate" title={profile.educationEntries.map(e => [e.degree, e.field].filter(Boolean).join(', ') + ' @ ' + e.institution).join('; ')}>
                  🎓 {profile.educationEntries.map(e => e.institution).join(', ')}
                </span>
              ) : (
                <span className="truncate">
                  🎓 {profile.education || 'Education Institution'}
                </span>
              )}
            </div>
            {profile.socialLinks && profile.socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-2">
                {profile.socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 underline underline-offset-2 truncate max-w-[200px]"
                  >
                    {link.url}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Sections */}
          <div className="space-y-5 text-sm text-body">
            {/* 1. Summary */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="section-title">
                  <FileText size={12} />
                  {lang === 'ru' ? 'О Себе (Summary)' : 'About Me / Summary'}
                </h3>
                <CopyButton text={activeResume.summary} label="Copy" />
              </div>
              <p className="card-surface leading-relaxed text-body">
                {activeResume.summary}
              </p>
            </div>

            {/* 2. Highlighted Skills */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="section-title">
                  <Code size={12} />
                  {lang === 'ru'
                    ? 'Интегрируемые Навыки (Job Skills Matching)'
                    : 'Job Oriented Skillset'}
                </h3>
                {hasAnySkills && (
                  <CopyButton
                    text={editableSkills.map((s) => s.name).join(', ')}
                    label="Copy"
                  />
                )}
              </div>
              {hasAnySkills || isAddingCat ? (
                <div className="space-y-2.5">
                  {/* Add custom category (at top) */}
                  <div className="flex items-center gap-2 pb-1">
                    {isAddingCat ? (
                      <div className="flex gap-1.5 flex-1">
                        <input
                          type="text"
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddCategory();
                          }}
                          placeholder={lang === 'ru' ? 'Название категории' : 'Category name'}
                          className="input-compact text-[11px] flex-1"
                          autoFocus
                        />
                        <button onClick={handleAddCategory} className="btn-add-sm text-[10px] px-2">
                          OK
                        </button>
                        <button
                          onClick={() => { setIsAddingCat(false); setNewCatName(''); }}
                          className="text-muted hover:text-body text-[10px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsAddingCat(true)}
                        className="btn-add-sm flex items-center gap-1"
                      >
                        <Plus size={11} />
                        {lang === 'ru' ? 'Добавить категорию' : 'Add Category'}
                      </button>
                    )}
                  </div>

                  {allCategories.map((cat) => {
                    const items = editableSkills.filter((s) => s.category === cat.key);
                    if (items.length === 0) return null;
                    return (
                      <div
                        key={cat.key}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'move';
                          // Track insertion position for functional drop logic (no visual indicators)
                          if (e.dataTransfer.types.includes('application/x-cat-key')) {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const y = e.clientY - rect.top;
                            setDragInsertPos({ key: cat.key, position: y < rect.height / 2 ? 'before' : 'after' });
                          } else {
                            setDragInsertPos(null);
                          }
                        }}
                        onDragLeave={() => { setDragInsertPos(null); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          const pos = dragInsertPos?.key === cat.key ? dragInsertPos.position : 'before';
                          setDragInsertPos(null);
                          const skillId = e.dataTransfer.getData('application/x-skill-id');
                          const catKey = e.dataTransfer.getData('application/x-cat-key');
                          if (skillId) {
                            handleMoveSkill(skillId, cat.key);
                          } else if (catKey) {
                            handleReorderCategory(catKey, cat.key, pos);
                          }
                        }}
                        className={cn(
                          'rounded-lg p-2 -mx-2 transition-all duration-200',
                          dragInsertPos?.key === cat.key &&
                            (dragInsertPos.position === 'before' ? 'pt-8' : 'pb-8'),
                        )}
                      >
                        <div
                          draggable={true}
                          onDragStart={(e) => {
                            e.dataTransfer.setData('application/x-cat-key', cat.key);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          className="flex items-center gap-2 mb-1 cursor-grab active:cursor-grabbing select-none"
                        >
                          <span className="text-muted text-[11px] leading-none" title="Drag to reorder category">
                            ≡
                          </span>
                          {editingCatKey === cat.key ? (
                            <input
                              type="text"
                              value={editingCatValue}
                              onChange={(e) => setEditingCatValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleFinishRename();
                                if (e.key === 'Escape') setEditingCatKey(null);
                              }}
                              onBlur={handleFinishRename}
                              className="input-compact text-[10px] font-bold tracking-wider py-0.5 px-1 min-w-0"
                              autoFocus
                            />
                          ) : (
                            <span
                              onClick={() => handleStartRename(cat.key, cat.label)}
                              className="text-[10px] font-bold text-secondary tracking-wider cursor-pointer hover:text-cyan-300 transition-colors"
                              title="Click to rename"
                            >
                              {cat.label}
                            </span>
                          )}
                          <span className="text-[9px] text-muted font-mono">({items.length})</span>
                        </div>
                        <div className="skill-filter-container">
                          {items.map((skill) => (
                            <span
                              key={skill.id}
                              draggable={true}
                              onDragStart={(e) => {
                                e.dataTransfer.setData('application/x-skill-id', skill.id);
                                e.dataTransfer.effectAllowed = 'move';
                              }}
                              className="skill-chip group flex items-center gap-1.5 cursor-grab active:cursor-grabbing"
                            >
                              <span className="text-[11px]">{skill.name}</span>
                              <button
                                onClick={() => handleRemoveSkill(skill.id)}
                                className="opacity-0 group-hover:opacity-100 text-muted hover:text-red-400 transition-all flex-shrink-0 leading-none"
                              >
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {/* 3. Tailored Bullets */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="section-title">
                  <Briefcase size={12} />
                  {lang === 'ru'
                    ? 'Достижения и Опыт (Experience Bullets)'
                    : 'Experience Tailored Highlights'}
                </h3>
                <CopyButton
                  text={activeResume.tailoredBullets.join('\n')}
                  label="Copy"
                />
              </div>
              <ul className="card-surface list-disc list-inside space-y-2 text-body">
                {activeResume.tailoredBullets.map((bullet, idx) => (
                  <li
                    key={idx}
                    className="text-xs leading-relaxed pl-1 flex items-start gap-1.5 group"
                  >
                    <span className="flex-grow">{bullet}</span>
                    <button
                      onClick={() => removeResumeBullet(idx)}
                      className="btn-destructive opacity-0 group-hover:opacity-100 transition-all mt-0.5 flex-shrink-0"
                    >
                      <X size={11} />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newBullet}
                  onChange={(e) => setNewBullet(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newBullet.trim()) {
                      addResumeBullet(newBullet.trim());
                      setNewBullet('');
                    }
                  }}
                  placeholder={
                    lang === 'ru'
                      ? 'Добавить достижение...'
                      : 'Add an achievement...'
                  }
                  className="input-primary"
                />
                <button
                  onClick={() => {
                    if (newBullet.trim()) {
                      addResumeBullet(newBullet.trim());
                      setNewBullet('');
                    }
                  }}
                  className="btn-add-sm"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* 4. Experience Entries (Companies) */}
            {(
              profile.experienceEntries && profile.experienceEntries.length > 0
                ? profile.experienceEntries
                : activeResume.experience && activeResume.experience.length > 0
                  ? activeResume.experience
                  : []
            ).length > 0 && (
              <div>
                <h3 className="section-title mb-2">
                  <Briefcase size={12} />
                  {lang === 'ru'
                    ? 'Опыт Работы (Компании)'
                    : 'Work Experience'}
                </h3>
                <div className="space-y-3">
                  {(
                    profile.experienceEntries &&
                    profile.experienceEntries.length > 0
                      ? profile.experienceEntries
                      : activeResume.experience || []
                  ).map((exp, idx) => (
                    <div
                      key={idx}
                      className="card-surface"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <span className="text-sm font-bold text-body">
                            {exp.company || ''}
                          </span>
                          {exp.position && (
                            <span className="text-xs text-secondary ml-2">
                              — {exp.position}
                            </span>
                          )}
                          {exp.dates && (
                            <span className="text-[10px] text-muted font-mono ml-2">
                              {exp.dates}
                            </span>
                          )}
                          {exp.location && (
                            <span className="text-[10px] text-muted ml-2">
                              ({exp.location})
                            </span>
                          )}
                        </div>
                      </div>
                      {exp.bullets.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 mt-1">
                          {exp.bullets.map((b, bIdx) => (
                            <li
                              key={bIdx}
                              className="text-xs text-body leading-relaxed"
                            >
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Certificates */}
            {profile.certificateEntries && profile.certificateEntries.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <h3 className="section-title">
                    <Award size={12} />
                    {lang === 'ru' ? 'Сертификаты' : 'Certificates'}
                  </h3>
                </div>
                <div className="space-y-2">
                  {profile.certificateEntries.map((cert) => (
                    <div key={cert.id} className="card-surface">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-body">
                            {cert.name}
                          </span>
                          {cert.issuer && (
                            <span className="text-xs text-secondary ml-1">
                              — {cert.issuer}
                            </span>
                          )}
                          {cert.date && (
                            <span className="text-[10px] text-muted font-mono ml-2">
                              {cert.date}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Cover Letter */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="section-title">
                  <Globe size={12} />
                  {lang === 'ru'
                    ? 'Сопроводительное Письмо (Cover Letter)'
                    : 'Intro Message / Pitch'}
                </h3>
                <CopyButton text={activeResume.coverLetter} label="Copy" />
              </div>
              <p className="card-surface leading-relaxed text-body italic font-sans whitespace-pre-line text-xs">
                {activeResume.coverLetter}
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="card-empty min-h-[300px]">
          <Sparkles
            size={40}
            className="text-muted mb-3 animate-pulse"
          />
          <h3 className="font-semibold text-body mb-1">
            {lang === 'ru'
              ? 'ИИ резюме не сгенерировано'
              : 'Ready For Generation'}
          </h3>
          <p className="text-xs text-muted max-w-sm">
            {lang === 'ru'
              ? 'Заполните свой профиль, вставьте вакансию слева и сгенерируйте адаптированное резюме под конкретного работодателя!'
              : "Your tailored portfolio draft will appear here. Choose a job description and click 'Tailor'."}
          </p>
        </div>
      )}
    </AnimatePresence>
  );
}
