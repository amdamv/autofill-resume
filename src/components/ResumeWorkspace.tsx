import React, { useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import {
  User,
  Briefcase,
  Mail,
  Phone,
  Code,
  Sparkles,
  GraduationCap,
  Copy,
  Check,
  Trash2,
  AlertCircle,
  FileText,
  Globe,
  Github,
  Linkedin,
  MapPin,
  Plus,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ResumePdfWorkshop from '../latex-workshop/ResumePdfWorkshop';
import { ExperienceEntry } from '../types';

export default function ResumeWorkspace() {
  // Zustand store state and actions
  const {
    profile,
    setProfile,
    savedResumes,
    activeResumeId,
    setActiveResumeId,
    deleteResume,
    jobDescription,
    targetCompany,
    targetRole,
    setJobInputs,
    isGenerating,
    generatorError,
    generateTailoredResume,
    addSkill,
    removeSkill,
    loadDemoProfile,
    addResumeBullet,
    removeResumeBullet,
    addProfileExperience,
    removeProfileExperience,
    updateProfileExperience,
    addProfileExpBullet,
    removeProfileExpBullet,
  } = useResumeStore();

  const [newSkill, setNewSkill] = useState('');
  const [newBullet, setNewBullet] = useState('');
  const [newCompany, setNewCompany] = useState<ExperienceEntry>({
    company: '', position: '', dates: '', location: '', bullets: [],
  });
  const [newExpBullet, setNewExpBullet] = useState<Record<number, string>>({});
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [lang, setLang] = useState<'ru' | 'en'>('ru');

  const handleProfileChange = (field: keyof typeof profile, value: any) => {
    setProfile({ [field]: value });
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const activeResume =
    savedResumes.find((r) => r.id === activeResumeId) || null;

  return (
    <div
      id="resume-workspace"
      className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto pr-2 pb-10"
    >
      {/* LEFT: CANDIDATE PROFILE COLUMN (5 cols) */}
      <div className="lg:col-span-12 xl:col-span-5 space-y-6">
        <div className="bg-[#121420]/90 border border-[#1e233d] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-[#1e233d] pb-3">
            <h2 className="text-lg font-display font-semibold text-emerald-400 flex items-center gap-2">
              <User size={18} />
              {lang === 'ru'
                ? '1. Персональный Профиль'
                : '1. Candidate Profile'}
            </h2>
            <button
              onClick={loadDemoProfile}
              className="px-3 py-1 text-xs text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-all font-medium active:scale-95"
            >
              {lang === 'ru' ? 'Загрузить Демо-Данные' : 'Load Demo Profile'}
            </button>
          </div>

          <div className="space-y-4">
            {/* General Info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {lang === 'ru' ? 'ФИО' : 'Full Name'}
                </label>
                <div className="relative">
                  <User
                    size={14}
                    className="absolute left-3 top-3 text-slate-500"
                  />
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      handleProfileChange('name', e.target.value)
                    }
                    placeholder="Akhmad Akhmedov"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-[#090a0f] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {lang === 'ru' ? 'Желаемая должность' : 'Desired Title'}
                </label>
                <div className="relative">
                  <Briefcase
                    size={14}
                    className="absolute left-3 top-3 text-slate-500"
                  />
                  <input
                    type="text"
                    value={profile.title}
                    onChange={(e) =>
                      handleProfileChange('title', e.target.value)
                    }
                    placeholder="Full-Stack Web Developer"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-[#090a0f] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute left-3 top-3 text-slate-500"
                  />
                  <input
                    type="email"
                    value={profile.email || ''}
                    onChange={(e) =>
                      handleProfileChange('email', e.target.value)
                    }
                    placeholder="alex.ivanov@example.com"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-[#090a0f] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {lang === 'ru' ? 'Телефон' : 'Phone'}
                </label>
                <div className="relative">
                  <Phone
                    size={14}
                    className="absolute left-3 top-3 text-slate-500"
                  />
                  <input
                    type="text"
                    value={profile.phone || ''}
                    onChange={(e) =>
                      handleProfileChange('phone', e.target.value)
                    }
                    placeholder="+1 (234)567-89-01"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-[#090a0f] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  LinkedIn
                </label>
                <div className="relative">
                  <Linkedin
                    size={14}
                    className="absolute left-3 top-3 text-slate-500"
                  />
                  <input
                    type="text"
                    value={profile.linkedin || ''}
                    onChange={(e) =>
                      handleProfileChange('linkedin', e.target.value)
                    }
                    placeholder="https://linkedin.com/in/example"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#090a0f] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  GitHub
                </label>
                <div className="relative">
                  <Github
                    size={14}
                    className="absolute left-3 top-3 text-slate-500"
                  />
                  <input
                    type="text"
                    value={profile.github || ''}
                    onChange={(e) =>
                      handleProfileChange('github', e.target.value)
                    }
                    placeholder="https://github.com/example"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#090a0f] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {lang === 'ru' ? 'Локация' : 'Location'}
                </label>
                <div className="relative">
                  <MapPin
                    size={14}
                    className="absolute left-3 top-3 text-slate-500"
                  />
                  <input
                    type="text"
                    value={profile.location || ''}
                    onChange={(e) =>
                      handleProfileChange('location', e.target.value)
                    }
                    placeholder="City, Country"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#090a0f] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Skills Tag Input */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                {lang === 'ru'
                  ? 'Навыки и Технологии'
                  : 'Skills & Competencies'}
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  placeholder={
                    lang === 'ru'
                      ? 'Добавить навык (React)'
                      : 'Add skill (e.g. React)'
                  }
                  className="flex-grow px-3 py-2 text-xs bg-[#090a0f] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleAddSkill}
                  className="px-3 py-2 text-xs font-semibold text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-lg transition-colors"
                >
                  +
                </button>
              </div>

              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 bg-[#090a0f]/50 border border-[#20253f]/30 rounded-lg">
                {profile.skills.length === 0 ? (
                  <span className="text-[11px] text-slate-600 p-1">
                    {lang === 'ru'
                      ? 'Навыки не указаны...'
                      : 'No skills added yet...'}
                  </span>
                ) : (
                  profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-[11px] flex items-center gap-1 px-2 py-0.5 bg-[#171b30] border border-[#282f56] text-emerald-300 rounded-full"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="text-slate-500 hover:text-red-400 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Work experience summaries */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                {lang === 'ru'
                  ? 'Опыт Работы (базовый)'
                  : 'Experience Profile (Raw)'}
              </label>
              <textarea
                value={profile.experience}
                onChange={(e) =>
                  handleProfileChange('experience', e.target.value)
                }
                placeholder={
                  lang === 'ru'
                    ? 'Расскажите кратко где и кем работали, чтобы AI мог адаптировать эти данные под вакансию'
                    : 'Summarize past roles so AI can map them cleanly'
                }
                rows={4}
                className="w-full px-3 py-2 text-xs bg-[#090a0f] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none font-sans"
              />
            </div>

            {/* Education Info */}
            <div>
              <label className="text-xs text-slate-400 block border-t border-[#1e233d]/40 pt-2 mb-1">
                {lang === 'ru' ? 'Образование' : 'Education Detail'}
              </label>
              <div className="relative">
                <GraduationCap
                  size={14}
                  className="absolute left-3 top-3 text-slate-500"
                />
                <input
                  type="text"
                  value={profile.education}
                  onChange={(e) =>
                    handleProfileChange('education', e.target.value)
                  }
                  placeholder="МГТУ им. Баумана, 2024"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#090a0f] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Experience Entries */}
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
          </div>
        </div>

        {/* INPUT: JOB ADAPTATION SECTION */}
        <div className="bg-[#121420]/90 border border-[#1e233d] rounded-2xl p-5 shadow-xl">
          <h2 className="text-lg font-display font-semibold text-emerald-400 flex items-center gap-2 mb-3 border-b border-[#1e233d] pb-3">
            <Sparkles size={18} />
            {lang === 'ru'
              ? '2. Таргет Вакансии & Генерация'
              : '2. Tailor Generator Inputs'}
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {lang === 'ru' ? 'Компания' : 'Target Company'}
                </label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) =>
                    setJobInputs({ targetCompany: e.target.value })
                  }
                  placeholder="SberTech, Yandex, etc."
                  className="w-full px-3 py-2 text-xs bg-[#090a0f] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {lang === 'ru' ? 'Должность в вакансии' : 'Target Role Title'}
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setJobInputs({ targetRole: e.target.value })}
                  placeholder="Senior React Developer"
                  className="w-full px-3 py-2 text-xs bg-[#090a0f] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-slate-400">
                  {lang === 'ru'
                    ? 'Описание Вакансии (Job Description)'
                    : 'Job Description (Copy Paste Here)'}
                </label>
                <div className="flex justify-between gap-1">
                  <button
                    onClick={() => setLang('ru')}
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${lang === 'ru' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    RU
                  </button>
                  <button
                    onClick={() => setLang('en')}
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${lang === 'en' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    EN
                  </button>
                </div>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) =>
                  setJobInputs({ jobDescription: e.target.value })
                }
                placeholder={
                  lang === 'ru'
                    ? 'Вставьте текст описания вакансии или выберите из шаблонов справа...'
                    : 'Paste the target job details...'
                }
                rows={5}
                className="w-full px-3 py-2 text-xs bg-[#090a0f] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {generatorError && (
              <div className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                <span>{generatorError}</span>
              </div>
            )}

            <button
              onClick={() => generateTailoredResume(lang)}
              disabled={isGenerating}
              className={`w-full py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2 ${
                isGenerating ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {lang === 'ru'
                    ? 'Анализируем вакансию ИИ...'
                    : 'AI Adapting Resume...'}
                </>
              ) : (
                <>
                  <Sparkles size={16} className="text-white glow-animation" />
                  {lang === 'ru'
                    ? 'Адаптировать Резюме по ИИ'
                    : 'Generate Tailored Resume'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: GENERATED TAILORED RESUME PREVIEW & LIST (7 cols) */}
      <div className="lg:col-span-12 xl:col-span-7 flex flex-col space-y-4">
        {/* Saved CVs Timeline Selector */}
        <div className="bg-[#121420]/75 border border-[#1e233d] rounded-2xl p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            {lang === 'ru'
              ? 'Архив ИИ Генераций'
              : 'AI Tailored Generations History'}
          </h3>
          <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
            {savedResumes.length === 0 ? (
              <span className="text-xs text-slate-500 italic p-1">
                {lang === 'ru'
                  ? 'Пока нет адаптированных резюме. Заполните данные и нажмите кнопку генерации!'
                  : "No custom resumes generated yet. Fill the left panel and click 'Tailor'."}
              </span>
            ) : (
              savedResumes.map((resume) => (
                <button
                  key={resume.id}
                  onClick={() => setActiveResumeId(resume.id)}
                  className={`flex-shrink-0 text-left px-3.5 py-2.5 rounded-xl border transition-all relative ${
                    activeResumeId === resume.id
                      ? 'bg-slate-800/65 border-emerald-500 text-slate-100'
                      : 'bg-[#090a0f]/40 border-[#20253f] text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <h4 className="text-xs font-bold leading-tight truncate max-w-[130px]">
                        {resume.jobTitle}
                      </h4>
                      <p className="text-[10px] text-emerald-400 font-display truncate max-w-[130px]">
                        @{resume.companyName}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteResume(resume.id);
                      }}
                      className="text-slate-500 hover:text-red-400 p-0.5 rounded transition-colors"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                  <span className="absolute bottom-1 right-2 text-[8px] text-slate-600 font-mono">
                    {resume.tailoredAt}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Selected Resume Full Showcase */}
        <AnimatePresence mode="wait">
          {activeResume ? (
            <motion.div
              key={activeResume.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#13172c]/90 border border-emerald-500/20 rounded-2xl p-6 relative shadow-2xl flex-grow overflow-y-auto"
            >
              {/* Badge indicating this is fully optimized for the autofill pasting */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                {lang === 'ru'
                  ? 'АКТИВНО ДЛЯ РАСШИРЕНИЯ'
                  : 'ACTIVE IN EXTENSION'}
              </div>

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

                <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-400 ">
                  {profile.email && <span>📧 {profile.email}</span>}
                  {profile.phone && <span>📱 {profile.phone}</span>}
                  <span className="truncate">
                    🎓 {profile.education || 'Education Institution'}
                  </span>
                </div>
              </div>

              <div className="space-y-5 text-sm text-slate-300">
                {/* 1. Summary */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#10b981] flex items-center gap-1 font-display">
                      <FileText size={12} />
                      {lang === 'ru'
                        ? 'О Себе (Summary)'
                        : 'About Me / Summary'}
                    </h3>
                    <button
                      onClick={() =>
                        copyToClipboard(activeResume.summary, 'summary')
                      }
                      className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 text-xs"
                    >
                      {copiedField === 'summary' ? (
                        <Check size={12} className="text-emerald-400" />
                      ) : (
                        <Copy size={12} />
                      )}
                      <span className="text-[10px]">
                        {copiedField === 'summary' ? 'Copied' : 'Copy'}
                      </span>
                    </button>
                  </div>
                  <p className="bg-[#090a0f]/60 p-3 rounded-xl border border-[#20253f]/50 leading-relaxed text-slate-200">
                    {activeResume.summary}
                  </p>
                </div>

                {/* 2. Highlighted skills */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#10b981] flex items-center gap-1 font-display">
                      <Code size={12} />
                      {lang === 'ru'
                        ? 'Интегрируемые Навыки (Job Skills Matching)'
                        : 'Job Oriented Skillset'}
                    </h3>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          activeResume.highlightedSkills.join(', '),
                          'skills',
                        )
                      }
                      className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 text-xs"
                    >
                      {copiedField === 'skills' ? (
                        <Check size={12} className="text-emerald-400" />
                      ) : (
                        <Copy size={12} />
                      )}
                      <span className="text-[10px]">
                        {copiedField === 'skills' ? 'Copied' : 'Copy'}
                      </span>
                    </button>
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

                {/* 3. Tailored bullets */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#10b981] flex items-center gap-1 font-display">
                      <Briefcase size={12} />
                      {lang === 'ru'
                        ? 'Достижения и Опыт (Experience Bullets)'
                        : 'Experience Tailored Highlights'}
                    </h3>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          activeResume.tailoredBullets.join('\n'),
                          'experience',
                        )
                      }
                      className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 text-xs"
                    >
                      {copiedField === 'experience' ? (
                        <Check size={12} className="text-emerald-400" />
                      ) : (
                        <Copy size={12} />
                      )}
                      <span className="text-[10px]">
                        {copiedField === 'experience' ? 'Copied' : 'Copy'}
                      </span>
                    </button>
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

                {/* 3.5. Experience Entries (Companies) */}
                {(profile.experienceEntries && profile.experienceEntries.length > 0
                  ? profile.experienceEntries
                  : activeResume.experience && activeResume.experience.length > 0
                    ? activeResume.experience
                    : []
                ).length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#10b981] flex items-center gap-1 font-display mb-2">
                      <Briefcase size={12} />
                      {lang === 'ru' ? 'Опыт Работы (Компании)' : 'Work Experience'}
                    </h3>
                    <div className="space-y-3">
                      {(profile.experienceEntries && profile.experienceEntries.length > 0
                        ? profile.experienceEntries
                        : activeResume.experience || []
                      ).map((exp, idx) => (
                        <div key={idx} className="bg-[#090a0f]/60 p-3 rounded-xl border border-[#20253f]/50">
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
                                <li key={bIdx} className="text-xs text-slate-300 leading-relaxed">
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

                {/* 4. Cover Letter */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#10b981] flex items-center gap-1 font-display">
                      <Globe size={12} />
                      {lang === 'ru'
                        ? 'Сопроводительное Письмо (Cover Letter)'
                        : 'Intro Message / Pitch'}
                    </h3>
                    <button
                      onClick={() =>
                        copyToClipboard(activeResume.coverLetter, 'cover')
                      }
                      className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 text-xs"
                    >
                      {copiedField === 'cover' ? (
                        <Check size={12} className="text-emerald-400" />
                      ) : (
                        <Copy size={12} />
                      )}
                      <span className="text-[10px]">
                        {copiedField === 'cover' ? 'Copied' : 'Copy'}
                      </span>
                    </button>
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

        <ResumePdfWorkshop
          profile={profile}
          activeResume={activeResume}
          lang={lang}
        />
      </div>
    </div>
  );
}
