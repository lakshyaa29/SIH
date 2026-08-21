import React from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_SCENARIOS } from '../data/demoScenarios';
import { Sparkles, Terminal, Globe, Play, Building2, HelpCircle, Layers, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { 
    language, 
    setLanguage, 
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
    const scholarshipDemo = DEMO_SCENARIOS[0];
    startPipeline(scholarshipDemo.query, scholarshipDemo);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Subtitle */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { resetPipeline(); setActiveTab('home'); }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-blue-600 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg shadow-blue-900/30">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <span className="text-xl">🇮🇳</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-extrabold text-xl tracking-tight text-white">{t.brandName}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">SIH 2026</span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">{t.brandSubtitle}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => { resetPipeline(); setActiveTab('home'); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'home' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${activeTab === 'explore' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
            >
              <Building2 className="w-4 h-4" />
              <span>{t.navServices}</span>
            </button>
            <button
              onClick={() => setActiveTab('howItWorks')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${activeTab === 'howItWorks' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>{t.navHowItWorks}</span>
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${activeTab === 'architecture' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
            >
              <Layers className="w-4 h-4" />
              <span>Architecture</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${activeTab === 'admin' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Controls: Language Selector, Tech View, SIH Demo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Language Switcher */}
            <div className="relative flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-semibold rounded ${language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 text-xs font-semibold rounded ${language === 'hi' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage('mr')}
                className={`px-2 py-1 text-xs font-semibold rounded ${language === 'mr' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                मराठी
              </button>
            </div>

            {/* Technical View Toggle */}
            <button
              onClick={() => setIsTechViewOpen(!isTechViewOpen)}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium border flex items-center space-x-1.5 transition-colors ${
                isTechViewOpen 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
              }`}
              title="Toggle Judge Technical Pipeline Dashboard"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">{t.navTechView}</span>
            </button>

            {/* SIH Demo Mode Prominent Button */}
            <button
              onClick={handleStartDemo}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-amber-950/40 flex items-center space-x-1.5 transition-transform active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{t.navDemo}</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
