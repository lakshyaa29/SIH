import React from 'react';
import { useApp } from '../context/AppContext';
import { HelpCircle, CheckCircle2, ShieldCheck, Database, FileText, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const { t } = useApp();

  const steps = [
    { title: t.howStep1, desc: t.howStep1Desc, icon: "💡" },
    { title: t.howStep2, desc: t.howStep2Desc, icon: "❓" },
    { title: t.howStep3, desc: t.howStep3Desc, icon: "🔍" },
    { title: t.howStep4, desc: t.howStep4Desc, icon: "⚖️" },
    { title: t.howStep5, desc: t.howStep5Desc, icon: "🛡️" },
    { title: t.howStep6, desc: t.howStep6Desc, icon: "📋" }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white">
          {t.howSahayakWorksTitle}
        </h2>
        <p className="text-base text-slate-300 mt-3 leading-relaxed">
          Sahayak AI bridges the gap between complex government portals and everyday citizens by offering an intelligent, source-grounded navigation experience.
        </p>
      </div>

      {/* Grid of 6 steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((item, idx) => (
          <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-blue-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-2xl flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Key Differentiators */}
      <div className="glass-panel p-8 rounded-2xl border border-blue-500/30 space-y-4">
        <h3 className="text-xl font-bold text-white mb-2">Why Sahayak AI is Different from Generic Chatbots</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="font-bold text-blue-400 text-sm mb-1">1. Zero Hallucination RAG</h4>
            <p>Every response is retrieved from verified government databases with explicit source citations.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="font-bold text-amber-400 text-sm mb-1">2. Transparent Eligibility</h4>
            <p>Runs citizen parameters against scheme criteria to provide a clear pass/fail matrix.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="font-bold text-emerald-400 text-sm mb-1">3. Official Source Links</h4>
            <p>Provides direct official portal URLs (`.gov.in`, `.nic.in`) so citizens apply on authorized sites.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
