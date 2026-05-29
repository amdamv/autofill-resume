import React, { useState } from 'react';
import { useResumeStore } from '../../store/index';
import {
  User,
  Briefcase,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import CompanyManager from './CompanyManager';
import EducationManager from './EducationManager';
import SocialLinksManager from './SocialLinksManager';
import CertificateManager from './CertificateManager';
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
    <div className="panel-container p-5">
      <div className="flex items-center justify-between mb-4 border-b border-panel pb-3">
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
            <label className="text-xs text-secondary block mb-1">
              {lang === 'ru' ? 'ФИО' : 'Full Name'}
            </label>
            <div className="relative">
              <User size={14} className="input-icon" />
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                placeholder="Akhmad Akhmedov"
                className="input-with-icon text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-secondary block mb-1">
              {lang === 'ru' ? 'Желаемая должность' : 'Desired Title'}
            </label>
            <div className="relative">
              <Briefcase size={14} className="input-icon" />
              <input
                type="text"
                value={profile.title}
                onChange={(e) => handleProfileChange('title', e.target.value)}
                placeholder="Full-Stack Web Developer"
                className="input-with-icon text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-secondary block mb-1">Email</label>
            <div className="relative">
              <Mail size={14} className="input-icon" />
              <input
                type="email"
                value={profile.email || ''}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                placeholder="amdamv@example.com"
                className="input-with-icon text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-secondary block mb-1">
              {lang === 'ru' ? 'Телефон' : 'Phone'}
            </label>
            <div className="relative">
              <Phone size={14} className="input-icon" />
              <input
                type="text"
                value={profile.phone || ''}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                placeholder="+1 (234)567-89-01"
                className="input-with-icon text-sm"
              />
            </div>
          </div>
        </div>

        <SocialLinksManager lang={lang} />

        <div>
          <label className="text-xs text-secondary block mb-1">
            {lang === 'ru' ? 'Локация' : 'Location'}
          </label>
          <div className="relative">
            <MapPin size={14} className="input-icon" />
            <input
              type="text"
              value={profile.location || ''}
              onChange={(e) => handleProfileChange('location', e.target.value)}
              placeholder="City, Country"
              className="input-with-icon text-xs"
            />
          </div>
        </div>

        {/* Skills Tag Input */}
        <div>
          <label className="text-xs text-secondary block mb-1">
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
              className="input-primary"
            />
            <button onClick={handleAddSkill} className="btn-add">
              +
            </button>
          </div>

          <div className="tag-container">
            {profile.skills.length === 0 ? (
              <span className="text-[11px] text-muted p-1">
                {lang === 'ru'
                  ? 'Навыки не указаны...'
                  : 'No skills added yet...'}
              </span>
            ) : (
              profile.skills.map((skill, index) => (
                <span key={index} className="tag-pill">
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-muted hover:text-red-400 font-bold ml-1"
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
          <label className="text-xs text-secondary block mb-1">
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
            className="textarea-primary font-sans"
          />
        </div>

        {/* Education */}
        <EducationManager lang={lang} />

        {/* Certificates */}
        <CertificateManager lang={lang} />

        {/* Experience Entries */}
        <CompanyManager lang={lang} />
      </div>
    </div>
  );
}
