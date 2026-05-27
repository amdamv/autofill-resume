import React, { useState } from 'react';
import { useResumeStore } from './store/index';
import { MOCK_JOBS } from './data/mockJobs';
import ResumeWorkspace from './components/ResumeWorkspace';
import ExtensionSimulator from './components/extension/ExtensionSimulator';
import JobTemplates from './components/templates/JobTemplates';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { Layers, Puzzle, Bookmark, BookOpen, RefreshCw, Zap } from 'lucide-react';

export default function App() {
  const savedResumes = useResumeStore((state) => state.savedResumes);
  const activeResumeId = useResumeStore((state) => state.activeResumeId);
  const setProfile = useResumeStore((state) => state.setProfile);
  const setJobInputs = useResumeStore((state) => state.setJobInputs);

  // Active Main tab: 'workspace' | 'extension' | 'templates'
  const [activeTab, setActiveTab] = useState<"workspace" | "extension" | "templates">("workspace");

  const selectJobTemplate = (job: typeof MOCK_JOBS[0]) => {
    setJobInputs({
      jobDescription: job.description,
      targetCompany: job.company,
      targetRole: job.role
    });
    setActiveTab("workspace");

    // Smooth scroll down to workspace section
    const element = document.getElementById("resume-workspace");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const activeResume = savedResumes.find((r) => r.id === activeResumeId) || null;

  return (
    <div className="min-h-screen bg-[#07080e] text-slate-100 font-sans flex flex-col selection:bg-emerald-500 selection:text-slate-900">

      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <Header savedResumesCount={savedResumes.length} />

      {/* MAIN NAVIGATION BAR */}
      <div className="bg-[#0b0c13] border-b border-[#181c33] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <nav className="flex space-x-1 py-2">

            <button
              onClick={() => setActiveTab("workspace")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                activeTab === "workspace"
                  ? "bg-[#181d36]/90 text-white border-b-2 border-emerald-400"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#111425]/50"
              }`}
            >
              <Layers size={14} className={activeTab === 'workspace' ? 'text-emerald-400' : ''} />
              1. Дашборд резюме и ИИ кастомизация
            </button>

            <button
              onClick={() => setActiveTab("extension")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                activeTab === "extension"
                  ? "bg-[#181d36]/90 text-white border-b-2 border-emerald-400"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#111425]/50"
              }`}
            >
              <Puzzle size={14} className={activeTab === 'extension' ? 'text-emerald-400' : ''} />
              2. Симулятор Браузерного Расширения
              {activeResume && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("templates")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                activeTab === "templates"
                  ? "bg-[#181d36]/90 text-white border-b-2 border-emerald-400"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#111425]/50"
              }`}
            >
              <Bookmark size={14} className={activeTab === 'templates' ? 'text-emerald-400' : ''} />
              Шаблоны Вакансий для теста
            </button>

          </nav>

          <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400 bg-[#12162a]/60 border border-[#212749] px-3 py-1.5 rounded-full">
            <Zap size={12} className="text-amber-400 glow-animation" />
            <span>Выбранная модель: <strong className="text-emerald-300 font-mono">claude-sonnet</strong></span>
          </div>
        </div>
      </div>

      {/* CORE FRAME CONTENT */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col overflow-hidden">

        {/* Quick Informative Flow Header - guides user step by step */}
        <div className="bg-[#121526]/50 border border-indigo-500/10 p-4 rounded-xl mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <BookOpen size={18} className="text-emerald-400 mt-0.5" />
            <div className="text-xs">
              <strong className="text-white block mb-0.5">🚀 Как получить максимальный результат?</strong>
              <p className="text-slate-400 leading-relaxed">
                Заполните ваши данные во вкладке <strong className="text-indigo-300">Дашборд</strong> (или нажмите "Загрузить Демо"), скопируйте нужную вакансию, сгенерируйте адаптированную версию, затем переключитесь во вкладку <strong className="text-emerald-300">Симулятор Расширения</strong> для волшебной авто-заполняемости форм на сайтах!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setProfile({
                  name: "Akhmad Akhmedov",
                  title: "Middle Node.js Backend Developer",
                  email: "",
                  phone: "",
                  linkedin: "",
                  github: "",
                  location: "",
                  skills: ["TypeScript", "JavaScript", "Node.js", "NestJS", "Express", "SQL", "PostgreSQL", "MongoDB", "Redis", "TypeORM", "Kafka", "NATS", "RabbitMQ", "WebSocket", "JWT", "Docker", "Kubernetes", "CI/CD", "AWS", "MinIO", "Git", "GitHub", "Jest", "Swagger", "Postman", "Grafana", "Agile"],
                  experience: "Backend Developer with 4+ years of experience building scalable systems using Node.js, NestJS, PostgreSQL and Kafka. Delivered high-load microservices for scalable, business-critical systems including real-time and data-intensive applications. Skilled in system design, caching, authentication, queues, and DevOps. Strong in clean code, team collaboration, and Agile.",
                  education: "National University of Radio Electronics, Bachelor of Science in Computer Science, Sep. 2018 - Nov. 2022, Kharkiv, Ukraine"
                });
                setJobInputs({
                  targetCompany: "Default LaTeX Resume",
                  targetRole: "Middle Node.js Backend Developer",
                  jobDescription: MOCK_JOBS[0].description
                });
              }}
              className="px-3 py-1.5 text-[11px] font-semibold text-slate-300 bg-[#1f2649] hover:bg-[#28315d] rounded-lg transition-all flex items-center gap-1"
            >
              <RefreshCw size={11} />
              Вернуть профиль из PDF
            </button>
          </div>
        </div>

        {/* CONTROLLER SECTION BASED ON TABS */}
        <div className="flex-grow min-h-0">

          {activeTab === "workspace" && (
            <ResumeWorkspace />
          )}

          {activeTab === "extension" && (
            <ExtensionSimulator />
          )}

          {activeTab === "templates" && (
            <JobTemplates onSelectJob={selectJobTemplate} lang="ru" />
          )}

        </div>

      </main>

      <Footer />

    </div>
  );
}
