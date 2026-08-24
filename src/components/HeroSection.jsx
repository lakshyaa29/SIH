/* =========================================================================
   NagrikMitra AI / Sahayak AI — Fully Multilingual Hero Section Component
   ========================================================================= */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_SCENARIOS } from '../data/demoScenarios';
import { startVoiceRecognition } from '../services/speechService';
import { 
  Search, Mic, Sparkles, Building2, ArrowRight, FileText, Scale 
} from 'lucide-react';

export default function HeroSection() {
  const { t, startPipeline, setActiveTab, resetPipeline, language } = useApp();
  const [queryInput, setQueryInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!queryInput.trim()) return;
    startPipeline(queryInput);
  };

  const handleVoiceInput = () => {
    startVoiceRecognition(
      language,
      (transcript) => {
        setQueryInput(transcript);
        setIsListening(false);
        startPipeline(transcript);
      },
      (errorMsg) => {
        setIsListening(false);
        alert(`Voice Input: ${errorMsg}`);
      }
    );
    setIsListening(true);
  };

  const handleScenarioClick = (scenario) => {
    resetPipeline();
    setQueryInput(scenario.query);
    startPipeline(scenario.query, scenario);
  };

  return (
    <section className="relative py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      
      {/* 1. Header Hero Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        
        {/* Subtle Category Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{t.tagline || 'Your AI Guide to Government Services'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-[#0A192F] leading-tight tracking-tight">
          {t.heroTitle || 'Find the Right Government Scheme for You'}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
          {t.heroSub || 'Describe your situation in everyday words or speak in your language. Sahayak AI helps you find schemes, check requirements, and access official application links.'}
        </p>

      </div>

      {/* 2. Main Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto">
        <div className="glass-panel p-2.5 sm:p-3 rounded-2xl border border-slate-300 shadow-md flex flex-col sm:flex-row items-center gap-2">
          
          <div className="flex items-center space-x-2 px-3 py-2 w-full flex-1">
            <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder={t.placeholder || 'e.g. I am an engineering student looking for post-matric scholarship in Maharashtra'}
              className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end flex-shrink-0">
            
            {/* Voice STT Speech Mic Button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center transition-all ${
                isListening 
                  ? 'bg-red-500 text-white border-red-600 listening-pulse' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
              title={t.tryVoice || "Speak Query"}
            >
              <Mic className="w-4 h-4 text-amber-700" />
            </button>

            {/* Submit Action Button */}
            <button
              type="submit"
              className="px-6 py-3 rounded-xl btn-tactile-primary text-white font-bold text-xs shadow-md flex items-center space-x-2 whitespace-nowrap"
            >
              <span>{t.findService || 'Find Schemes'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>
      </form>

      {/* 3. Live Example Chips */}
      <div className="max-w-3xl mx-auto space-y-2">
        <span className="text-xs font-bold text-slate-500 block text-center uppercase tracking-wider">
          {t.popularKicker || 'Sample Inquiry Scenarios'}:
        </span>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {DEMO_SCENARIOS.slice(0, 4).map((demo) => (
            <button
              key={demo.id}
              onClick={() => handleScenarioClick(demo)}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-slate-300 hover:border-amber-400 text-xs font-semibold text-slate-700 hover:text-slate-900 shadow-xs transition-all text-left"
            >
              <span className="text-amber-600 mr-1.5 font-bold">💡</span>
              <span>{demo.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Quick Portal Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto pt-4">
        
        <div 
          onClick={() => setActiveTab('wizard')}
          className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-200 cursor-pointer space-y-2"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-[#0A192F]">{t.wizardCardTitle || 'Eligibility Wizard'}</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {t.wizardCardDesc || 'Check which central or state schemes match your age, course, and income profile.'}
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('grievance')}
          className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-200 cursor-pointer space-y-2"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-[#0A192F]">{t.grievanceCardTitle || 'Grievance Assistant'}</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {t.grievanceCardDesc || 'Draft structured petition letters for CPGRAMS if your application status is delayed.'}
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('explore')}
          className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-200 cursor-pointer space-y-2"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-[#0A192F]">{t.directoryCardTitle || 'Master Scheme Directory'}</h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {t.directoryCardDesc || 'Browse 47+ indexed schemes with requirements, documents lists, and official links.'}
          </p>
        </div>

      </div>

    </section>
  );
}
