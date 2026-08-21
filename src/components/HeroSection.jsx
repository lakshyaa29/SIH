import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_SCENARIOS } from '../data/demoScenarios';
import { isSpeechSupported, startSpeechRecognition, stopSpeechRecognition } from '../services/speechRecognition';
import { Search, Mic, MicOff, Sparkles, ArrowRight, ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';

export default function HeroSection() {
  const { t, startPipeline, language } = useApp();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    startPipeline(inputText);
  };

  const handleExampleClick = (queryText, scenario = null) => {
    setInputText(queryText);
    startPipeline(queryText, scenario);
  };

  const toggleMic = () => {
    if (isListening) {
      stopSpeechRecognition();
      setIsListening(false);
    } else {
      setIsListening(true);
      startSpeechRecognition({
        lang: language,
        onResult: (transcript) => {
          setInputText(transcript);
        },
        onError: (err) => {
          console.warn('Mic error:', err);
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        }
      });
    }
  };

  return (
    <section className="relative overflow-hidden py-12 lg:py-20 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950">
      
      {/* Subtle Background Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        
        {/* Trust Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>Grounded in Official Verified Indian Government Knowledge Base</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-tight mb-6">
          {t.heroHeading}
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          {t.heroSubheading}
        </p>

        {/* Search Input Box */}
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-8">
          <div className="relative glass-panel rounded-2xl p-2 border border-slate-700/80 shadow-2xl focus-within:border-blue-500/80 transition-all">
            <div className="flex items-center pl-3">
              <Search className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.inputPlaceholder}
                className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none py-2"
              />
              
              {/* Speech Recognition Button */}
              {isSpeechSupported() && (
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`p-2.5 rounded-xl transition-all mr-1.5 ${
                    isListening 
                      ? 'bg-red-500 text-white listening-pulse' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Voice Input (Speech-to-Text)"
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-lg shadow-blue-900/40 flex items-center space-x-1.5 transition-all flex-shrink-0"
              >
                <span>{t.askButton}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>

        {/* Example Queries */}
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            {t.tryAsking}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => handleExampleClick(DEMO_SCENARIOS[0].query, DEMO_SCENARIOS[0])}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium transition-all hover:border-blue-500/50 flex items-center space-x-1"
            >
              <span>🎓</span>
              <span>"I need a scholarship for engineering."</span>
            </button>

            <button
              onClick={() => handleExampleClick(DEMO_SCENARIOS[1].query, DEMO_SCENARIOS[1])}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium transition-all hover:border-blue-500/50 flex items-center space-x-1"
            >
              <span>💳</span>
              <span>"I lost my Aadhaar card."</span>
            </button>

            <button
              onClick={() => handleExampleClick(DEMO_SCENARIOS[2].query, DEMO_SCENARIOS[2])}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium transition-all hover:border-blue-500/50 flex items-center space-x-1"
            >
              <span>👵</span>
              <span>"My mother needs a pension."</span>
            </button>

            <button
              onClick={() => handleExampleClick(DEMO_SCENARIOS[3].query, DEMO_SCENARIOS[3])}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium transition-all hover:border-blue-500/50 flex items-center space-x-1"
            >
              <span>📜</span>
              <span>"I need to apply for a caste certificate."</span>
            </button>

            <button
              onClick={() => handleExampleClick("I need financial assistance for education.")}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium transition-all hover:border-blue-500/50 flex items-center space-x-1"
            >
              <span>💡</span>
              <span>"I need financial assistance for education."</span>
            </button>
          </div>
        </div>

        {/* Highlights Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mt-12 text-left">
          <div className="glass-card p-4 rounded-xl flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Source Grounded</h4>
              <p className="text-xs text-slate-400 mt-0.5">Strictly linked to verified government portals & schemes.</p>
            </div>
          </div>
          <div className="glass-card p-4 rounded-xl flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Multilingual AI</h4>
              <p className="text-xs text-slate-400 mt-0.5">Full support for English, Hindi, and Marathi languages.</p>
            </div>
          </div>
          <div className="glass-card p-4 rounded-xl flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Action-Oriented</h4>
              <p className="text-xs text-slate-400 mt-0.5">Step-by-step checklist, eligibility check & official links.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
