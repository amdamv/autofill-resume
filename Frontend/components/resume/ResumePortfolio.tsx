import React, { useState } from 'react';
import {
  FileText,
  Code,
  Briefcase,
  Globe,
  Plus,
  X,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../../store/index';
import CopyButton from '../shared/CopyButton';
import type { LanguageCode } from '../../i18n/languages';

type Props = { lang: LanguageCode };

export default function ResumePortfolio({ lang }: Props) {
  const profile = useResumeStore((s) => s.profile);
  const savedResumes = useResumeStore((s) => s.savedResumes);
  const activeResumeId = useResumeStore((s) => s.activeResumeId);
  const addResumeBullet = useResumeStore((s) => s.addResumeBullet);
  const removeResumeBullet = useResumeStore((s) => s.removeResumeBullet);

  const [newBullet, setNewBullet] = useState('');

  const activeResume = savedResumes.find((r) => r.id === activeResumeId) || null;

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
                <CopyButton
                  text={activeResume.highlightedSkills.join(', ')}
                  label="Copy"
                />
              </div>
              <div className="skill-filter-container">
                {activeResume.highlightedSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="skill-chip"
                  >
                    {s}
                  </span>
                ))}
              </div>
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

            {/* 5. Cover Letter */}
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
