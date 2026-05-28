import React, { useState } from 'react';
import { useResumeStore } from './store/index';
import { MOCK_JOBS } from './data/mockJobs';
import ResumeWorkspace from './components/ResumeWorkspace';
import ExtensionSimulator from './components/extension/ExtensionSimulator';
import JobTemplates from './components/templates/JobTemplates';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { Layers, Puzzle, Bookmark, BookOpen, Zap } from 'lucide-react';
import {
  DEFAULT_LANGUAGE,
  type LanguageCode,
} from './i18n/languages';
import { getTranslations } from './i18n/ui';

export default function App() {
  const savedResumes = useResumeStore((state) => state.savedResumes);
  const activeResumeId = useResumeStore((state) => state.activeResumeId);
  const setJobInputs = useResumeStore((state) => state.setJobInputs);

  // Active Main tab: 'workspace' | 'extension' | 'templates'
  const [activeTab, setActiveTab] = useState<
    'workspace' | 'extension' | 'templates'
  >('workspace');
  const [lang, setLang] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const t = getTranslations(lang);

  const selectJobTemplate = (job: (typeof MOCK_JOBS)[0]) => {
    setJobInputs({
      jobDescription: job.description,
      targetCompany: job.company,
      targetRole: job.role,
    });
    setActiveTab('workspace');

    // Smooth scroll down to workspace section
    const element = document.getElementById('resume-workspace');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeResume =
    savedResumes.find((r) => r.id === activeResumeId) || null;

  return (
    <div className="app-root min-h-screen text-primary font-sans flex flex-col selection:bg-emerald-500 selection:text-slate-900">

      <Header
        savedResumesCount={savedResumes.length}
        lang={lang}
        onSetLang={setLang}
      />

      {/* MAIN NAVIGATION BAR */}
      <div className="bg-header border-b border-header sticky top-0 z-20">
        <div className="max-w-container flex items-center justify-between">
          <nav className="flex space-x-1 py-2">
            <button
              onClick={() => setActiveTab('workspace')}
              className={`nav-tab ${
                activeTab === 'workspace' ? 'nav-tab--active' : 'nav-tab--inactive'
              }`}
            >
              <Layers
                size={14}
                className={activeTab === 'workspace' ? 'text-emerald-400' : ''}
              />
              {t.nav.workspace}
            </button>

            <button
              onClick={() => setActiveTab('extension')}
              className={`nav-tab ${
                activeTab === 'extension' ? 'nav-tab--active' : 'nav-tab--inactive'
              }`}
            >
              <Puzzle
                size={14}
                className={activeTab === 'extension' ? 'text-emerald-400' : ''}
              />
              {t.nav.extension}
              {activeResume && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`nav-tab ${
                activeTab === 'templates' ? 'nav-tab--active' : 'nav-tab--inactive'
              }`}
            >
              <Bookmark
                size={14}
                className={activeTab === 'templates' ? 'text-emerald-400' : ''}
              />
              {t.nav.templates}
            </button>
          </nav>

          <div className="hidden lg:flex items-center gap-2 text-[11px] text-secondary bg-badge/60 border border-badge px-3 py-1.5 rounded-full">
            <Zap size={12} className="text-amber-400 glow-animation" />
            <span>
              {t.model.selected}{' '}
              <strong className="text-emerald-300 font-mono">
                claude-sonnet
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* CORE FRAME CONTENT */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col overflow-hidden">
        {/* Quick Informative Flow Header - guides user step by step */}
        <div className="bg-guide-card/50 border border-indigo-500/10 p-4 rounded-xl mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <BookOpen size={18} className="text-emerald-400 mt-0.5" />
            <div className="text-xs">
              <strong className="text-white block mb-0.5">
                🚀 {t.guide.title}
              </strong>
              <p className="text-secondary leading-relaxed">
                {t.guide.beforeDashboard}{' '}
                <strong className="text-indigo-300">
                  {t.nav.workspaceShort}
                </strong>{' '}
                {t.guide.afterDashboard}{' '}
                <strong className="text-emerald-300">
                  {t.nav.extensionShort}
                </strong>{' '}
                {t.guide.afterExtension}
              </p>
            </div>
          </div>
        </div>

        {/* CONTROLLER SECTION BASED ON TABS */}
        <div className="flex-grow min-h-0">
          {activeTab === 'workspace' && <ResumeWorkspace lang={lang} />}

          {activeTab === 'extension' && <ExtensionSimulator />}

          {activeTab === 'templates' && (
            <JobTemplates onSelectJob={selectJobTemplate} lang={lang} />
          )}
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
