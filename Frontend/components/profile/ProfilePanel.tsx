import React, { useState } from 'react';
import { useResumeStore } from '../../store/index';
import {
  User,
  Briefcase,
  Mail,
  Phone,
  Github,
  Linkedin,
  MapPin,
  GraduationCap,
} from 'lucide-react';
import CompanyManager from './CompanyManager';
import type { LanguageCode } from '../../i18n/languages';

type Props = {
  lang: LanguageCode;
};

export default function ProfilePanel({ lang }: Props) {
  const { profile, setProfile, addSkill, removeSkill, loadDemoProfile } =
    useResumeStore();
  const [newSkill, setNewSkill] = useState('');

  const handleProfileChange = (field: keyof typeof profile, value: any) => {
    setProfile({ [field]: value });
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  return (
    <div className="bg-[#121420]/90 border border-[#1e233d] rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-[#1e233d] pb-3">
        <h2 className="text-lg font-display font-semibold text-emerald-400 flex items-center gap-2">
          <User size={18} />
          {lang === 'ru' ? '1. Персональный Профиль' : '1. Candidate Profile'}
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
                onChange={(e) => handleProfileChange('name', e.target.value)}
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
                onChange={(e) => handleProfileChange('title', e.target.value)}
                placeholder="Full-Stack Web Developer"
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#090a0f] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Email</label>
            <div className="relative">
              <Mail
                size={14}
                className="absolute left-3 top-3 text-slate-500"
              />
              <input
                type="email"
                value={profile.email || ''}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                placeholder="test@example.com"
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
                onChange={(e) => handleProfileChange('phone', e.target.value)}
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
            <label className="text-xs text-slate-400 block mb-1">GitHub</label>
            <div className="relative">
              <Github
                size={14}
                className="absolute left-3 top-3 text-slate-500"
              />
              <input
                type="text"
                value={profile.github || ''}
                onChange={(e) => handleProfileChange('github', e.target.value)}
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
            {lang === 'ru' ? 'Навыки и Технологии' : 'Skills & Competencies'}
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
            onChange={(e) => handleProfileChange('experience', e.target.value)}
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
              onChange={(e) => handleProfileChange('education', e.target.value)}
              placeholder="МГТУ им. Баумана, 2024"
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#090a0f] border border-[#20253f] rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Experience Entries */}
        <CompanyManager lang={lang} />
      </div>
    </div>
  );
}
