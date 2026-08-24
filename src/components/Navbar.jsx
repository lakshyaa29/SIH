/* =========================================================================
   NagrikMitra AI / Sahayak AI — Citizen Portal Top Navigation Bar
   ========================================================================= */

import React from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_SCENARIOS } from '../data/demoScenarios';
import { 
  Terminal, Globe, Play, Building2, LayoutDashboard, Scale, ShieldAlert, Award, FileText 
} from 'lucide-react';

export default function Navbar() {
  const { 
    language, 
    setLanguage, 
    fontScale,
    setFontScale,
    t, 
    isTechViewOpen, 
    setIsTechViewOpen, 
    activeTab, 
    setActiveTab, 
    startPipeline,
    resetPipeline 
  } = useApp();

  const handleStartDemo = () => {
    resetPipeline();
    setActiveTab('home');
    const demo = DEMO_SCENARIOS[0];
    startPipeline(demo.query, demo);
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'mr', label: 'मराठी' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'ml', label: 'മലയാളം' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full no-print shadow-sm">
      
      {/* 1. Top Decorative Ribbon & Accessibility Toolbar */}
      <div className="bg-gradient-to-r from-[#FF9933] via-[#0B2545] to-[#138808] h-1 w-full"></div>
      
      <div className="bg-[#0A192F] text-slate-200 text-xs py-1 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center space-x-2 text-[11px] font-medium text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Citizen AI Guidance & Scheme Information Portal</span>
          </div>

          <div className="flex items-center space-x-3">
            
            {/* Accessibility Font Size Resizer */}
            <div className="flex items-center space-x-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Text:</span>
              <button 
                onClick={() => setFontScale('normal')}
                className={`px-1.5 py-0.5 text-[11px] font-bold rounded ${fontScale === 'normal' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
              >
                A
              </button>
              <button 
                onClick={() => setFontScale('large')}
                className={`px-1.5 py-0.5 text-[11px] font-bold rounded ${fontScale === 'large' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
              >
                A+
              </button>
              <button 
                onClick={() => setFontScale('xlarge')}
                className={`px-1.5 py-0.5 text-[11px] font-bold rounded ${fontScale === 'xlarge' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
              >
                A++
              </button>
            </div>

            {/* Language Selector Dropdown */}
            <div className="flex items-center space-x-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs font-semibold text-amber-200 focus:outline-none cursor-pointer"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

          </div>

        </div>
      </div>

      {/* 2. Main Portal Header */}
      <div className="bg-[#0B2545] text-white border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            
            {/* Brand Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group" 
              onClick={() => { resetPipeline(); setActiveTab('home'); }}
            >
              <div className="w-9 h-9 rounded-full gold-seal-3d flex items-center justify-center text-slate-900 shadow-sm transition-transform group-hover:scale-105">
                <span className="text-lg">🏛️</span>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white">
                    Sahayak AI <span className="text-amber-400 font-normal text-xs sm:text-sm">(नागरिकमित्र)</span>
                  </h1>
                </div>
                <p className="text-[11px] text-slate-300 font-medium hidden sm:block">
                  Your AI Guide to Government Schemes & Services
                </p>
              </div>
            </div>

            {/* Desktop Navigation Tabs (Spacious & Clean) */}
            <nav className="hidden lg:flex items-center space-x-1">
              
              <button
                onClick={() => { resetPipeline(); setActiveTab('home'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'home' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {t.homeNav || 'Home'}
              </button>

              <button
                onClick={() => setActiveTab('wizard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'wizard' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.eligibilityNav || 'Eligibility Wizard'}</span>
              </button>

              <button
                onClick={() => setActiveTab('grievance')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'grievance' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.grievanceNav || 'CPGRAMS Grievance'}</span>
              </button>

              <button
                onClick={() => setActiveTab('explore')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'explore' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.servicesNav || 'All Schemes'}</span>
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'dashboard' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.dashboardNav || 'My Dashboard'}</span>
              </button>

              <button
                onClick={() => setActiveTab('howItWorks')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'howItWorks' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.juryNav || 'About'}</span>
              </button>

              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'admin' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.adminNav || 'Admin'}</span>
              </button>

            </nav>

            {/* Action Buttons: Clean & Perfectly Positioned */}
            <div className="flex items-center space-x-2">
              
              {/* Technical View Toggle */}
              <button
                onClick={() => setIsTechViewOpen(!isTechViewOpen)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center space-x-1.5 transition-all ${
                  isTechViewOpen 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400' 
                    : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
                title="Toggle Technical Pipeline Dashboard"
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Pipeline Trace</span>
              </button>

              {/* Demo Button */}
              <button
                onClick={handleStartDemo}
                className="px-3.5 py-1.5 rounded-lg btn-tactile-saffron text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-transform active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t.demoMode || 'Demo Mode'}</span>
              </button>

            </div>

          </div>
        </div>
      </div>

    </header>
  );
}
