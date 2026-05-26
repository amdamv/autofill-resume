import React, { useState } from "react";
import { useResumeStore } from "./store/useResumeStore";
import { MOCK_JOBS } from "./data/mockJobs";
import ResumeWorkspace from "./components/ResumeWorkspace";
import ExtensionSimulator from "./components/ExtensionSimulator";
import {
  Sparkles, Layers, Puzzle, Bookmark, Zap, BookOpen, ExternalLink, RefreshCw
} from "lucide-react";

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

      {/* HEADER SECTION */}
      <header className="relative border-b border-[#1b1f38] bg-[#0c0d15]/80 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Sparkles className="text-white animate-pulse" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
                Curriculum AI Tailor
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/20">
                  NestJS + Zustand
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                ИИ-Инструмент оптимизации резюме + Симулятор расширения автозаполнения
              </p>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex items-center gap-6 text-xs text-slate-400 border-l border-[#1e2344] pl-6 h-10 hidden md:flex">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Генераций</span>
              <span className="text-white font-mono font-bold">{savedResumes.length} сгенерировано</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Статус ИИ</span>
              <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Готов к автоподбору
              </span>
            </div>
          </div>

        </div>
      </header>

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
                  email: "madakhmedov@gmail.com",
                  phone: "+380669433984",
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
            <div className="space-y-6">
              <div className="border-b border-[#21274c] pb-2">
                <h2 className="text-lg font-semibold font-display text-white">
                  📂 Выберите подходящий шаблон вакансии для быстрой проверки ИИ
                </h2>
                <p className="text-xs text-slate-400">
                  Кликните на кнопку "Адаптировать эту вакансию", чтобы мгновенно подгрузить её описание в генератор резюме и настроить под целевого работодателя.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_JOBS.map((job) => (
                  <div 
                    key={job.id} 
                    className="bg-[#111425] border border-[#21274c] rounded-2xl p-5 hover:border-emerald-500/30 transition-all flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded-full">
                        {job.company}
                      </span>
                      <span className="text-xs text-slate-400 font-bold font-mono">
                        {job.salary}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1 font-display">
                      {job.role}
                    </h3>
                    <p className="text-xs text-indigo-400 mb-4 font-mono">
                      📍 {job.location}
                    </p>

                    <div className="bg-[#080911] p-3 rounded-xl border border-[#1b1f3c] text-[11px] text-slate-400 flex-grow max-h-48 overflow-y-auto font-sans mb-5 whitespace-pre-wrap leading-relaxed">
                      {job.description}
                    </div>

                    <button
                      onClick={() => selectJobTemplate(job)}
                      className="w-full py-2 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 hover:from-emerald-500/20 hover:to-indigo-500/20 border border-emerald-500/20 text-emerald-400 hover:text-emerald-300 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1"
                    >
                      <span>Адаптировать эту вакансию</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#0b0c13] border-t border-[#181c33] py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>
            Для генерации идеальных резюме используется Claude API в связке с NestJS и Zustand.
          </p>
          <div className="flex gap-4">
            <span className="text-emerald-500/80 font-mono">✦ Экосистема Resume Autofiller</span>
            <span>2026 Developer Edition</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
