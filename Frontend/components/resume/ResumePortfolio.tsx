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

type Props = { lang: 'ru' | 'en' };

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
          className="bg-[#13172c]/90 border border-emerald-500/20 rounded-2xl p-6 relative shadow-2xl flex-grow overflow-y-auto"
        >
          {/* Badge indicating active in extension */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            {lang === 'ru'
              ? 'АКТИВНО ДЛЯ РАСШИРЕНИЯ'
              : 'ACTIVE IN EXTENSION'}
          </div>

          {/* Header */}
          <div className="border-b border-[#20253f] pb-4 mb-5">
            <span className="text-xs text-rose-400 font-mono font-bold uppercase tracking-widest block mb-0.5">
              ✦ Optimized AI Portfolio
            </span>
            <h1 className="text-2xl font-bold font-display text-white">
              {profile.name || 'Candidate Name'}
            </h1>
            <p className="text-[#10b981] font-medium text-sm flex items-center gap-1">
              {activeResume.jobTitle}{' '}
              <span className="text-slate-500">at</span>{' '}
              {activeResume.companyName}
            </p>

            <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-400">
              {profile.email && <span>📧 {profile.email}</span>}
              {profile.phone && <span>📱 {profile.phone}</span>}
              <span className="truncate">
                🎓 {profile.education || 'Education Institution'}
              </span>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-5 text-sm text-slate-300">
            {/* 1. Summary */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#10b981] flex items-center gap-1 font-display">
                  <FileText size={12} />
                  {lang === 'ru' ? 'О Себе (Summary)' : 'About Me / Summary'}
                </h3>
                <CopyButton text={activeResume.summary} label="Copy" />
              </div>
              <p className="bg-[#090a0f]/60 p-3 rounded-xl border border-[#20253f]/50 leading-relaxed text-slate-200">
                {activeResume.summary}
              </p>
            </div>

            {/* 2. Highlighted Skills */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#10b981] flex items-center gap-1 font-display">
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
              <div className="flex flex-wrap gap-1.5 bg-[#090a0f]/40 p-2.5 rounded-xl border border-[#20253f]/30">
                {activeResume.highlightedSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-md"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. Tailored Bullets */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#10b981] flex items-center gap-1 font-display">
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
              <ul className="bg-[#090a0f]/60 p-3 rounded-xl border border-[#20253f]/50 list-disc list-inside space-y-2 text-slate-200">
                {activeResume.tailoredBullets.map((bullet, idx) => (
                  <li
                    key={idx}
                    className="text-xs leading-relaxed pl-1 flex items-start gap-1.5 group"
                  >
                    <span className="flex-grow">{bullet}</span>
                    <button
                      onClick={() => removeResumeBullet(idx)}
                      className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all mt-0.5 flex-shrink-0"
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
                  className="flex-grow px-2.5 py-1.5 text-xs bg-[#090a0f] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => {
                    if (newBullet.trim()) {
                      addResumeBullet(newBullet.trim());
                      setNewBullet('');
                    }
                  }}
                  className="px-2.5 py-1.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-lg transition-colors"
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
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#10b981] flex items-center gap-1 font-display mb-2">
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
                      className="bg-[#090a0f]/60 p-3 rounded-xl border border-[#20253f]/50"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <span className="text-sm font-bold text-slate-200">
                            {exp.company || ''}
                          </span>
                          {exp.position && (
                            <span className="text-xs text-slate-400 ml-2">
                              — {exp.position}
                            </span>
                          )}
                          {exp.dates && (
                            <span className="text-[10px] text-slate-500 font-mono ml-2">
                              {exp.dates}
                            </span>
                          )}
                          {exp.location && (
                            <span className="text-[10px] text-slate-500 ml-2">
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
                              className="text-xs text-slate-300 leading-relaxed"
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
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#10b981] flex items-center gap-1 font-display">
                  <Globe size={12} />
                  {lang === 'ru'
                    ? 'Сопроводительное Письмо (Cover Letter)'
                    : 'Intro Message / Pitch'}
                </h3>
                <CopyButton text={activeResume.coverLetter} label="Copy" />
              </div>
              <p className="bg-[#090a0f]/60 p-3 rounded-xl border border-[#20253f]/50 leading-relaxed text-slate-200 italic font-sans whitespace-pre-line text-xs">
                {activeResume.coverLetter}
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="bg-[#121420]/50 border border-[#1e233d]/70 rounded-2xl p-8 flex flex-col items-center justify-center text-center text-slate-500 flex-grow min-h-[300px]">
          <Sparkles
            size={40}
            className="text-slate-600 mb-3 animate-pulse"
          />
          <h3 className="font-semibold text-slate-300 mb-1">
            {lang === 'ru'
              ? 'ИИ резюме не сгенерировано'
              : 'Ready For Generation'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm">
            {lang === 'ru'
              ? 'Заполните свой профиль, вставьте вакансию слева и сгенерируйте адаптированное резюме под конкретного работодателя!'
              : "Your tailored portfolio draft will appear here. Choose a job description and click 'Tailor'."}
          </p>
        </div>
      )}
    </AnimatePresence>
  );
}
