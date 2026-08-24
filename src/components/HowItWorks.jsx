/* =========================================================================
   NagrikMitra AI / Sahayak AI — Jury & Evaluator Presentation Hub
   ========================================================================= */

import React from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_SCENARIOS } from '../data/demoScenarios';
import { Award, Play, ShieldCheck } from 'lucide-react';

export default function HowItWorks() {
  const { t, startPipeline, setActiveTab, resetPipeline } = useApp();

  const handleRunScenario = (scenario) => {
    resetPipeline();
    setActiveTab('home');
    startPipeline(scenario.query, scenario);
  };

  const steps = [
    { title: "1. Natural Language Inquiry", desc: "Citizen speaks or types their situation in everyday language across 8 Indian languages.", icon: "🎙️" },
    { title: "2. Intent & Profile Extraction", desc: "AI extracts demographic entities (age, occupation, income, state) without forcing complex jargon.", icon: "🧠" },
    { title: "3. Grounded RAG Retrieval", desc: "Retrieved strictly from 47+ verified central & state scheme gazettes with explicit source citations.", icon: "🔍" },
    { title: "4. Multi-Factor Eligibility", desc: "Calculates qualification criteria and match percentage across schemes simultaneously.", icon: "⚖️" },
    { title: "5. Citizen Advice Slip", desc: "Generates an advice slip with reference ID (e.g. SAH-2026-X9K2L) and printable receipt.", icon: "📜" },
    { title: "6. Direct Official Action", desc: "Direct guidance and links strictly to official .gov.in and nic.in portals.", icon: "🏛️" }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3">
          <Award className="w-4 h-4 text-amber-700" />
          <span>Project Overview & Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-[#0A192F]">
          System Design & Trust Model
        </h2>
        <p className="text-base text-slate-700 mt-2 font-medium leading-relaxed">
          Sahayak AI (नागरिकमित्र AI) turns natural language citizen inquiries into grounded government welfare schemes, eligibility checklists, and direct official portal routes.
        </p>
      </div>

      {/* 1-Click Live Test Scenarios for Evaluators */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-amber-200 shadow-md bg-white">
        <h3 className="text-lg font-extrabold text-[#0A192F] mb-1 flex items-center space-x-2">
          <Play className="w-5 h-5 text-amber-600 fill-current" />
          <span>1-Click Test Simulation Scenarios</span>
        </h3>
        <p className="text-xs text-slate-600 font-medium mb-6">
          Click any scenario below to trigger the complete end-to-end 6-stage AI pipeline, intent extraction, RAG evidence grounding, and printable receipt generation:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEMO_SCENARIOS.map((demo) => (
            <div 
              key={demo.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-blue-100 text-[#0B2545] border border-blue-200 uppercase">
                  {demo.context.category}
                </span>
                <h4 className="font-extrabold text-base text-[#0A192F] mt-1.5">
                  {demo.title}
                </h4>
                <p className="text-xs text-slate-700 font-medium italic mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  "{demo.query}"
                </p>
              </div>

              <button
                onClick={() => handleRunScenario(demo)}
                className="mt-4 w-full py-2.5 rounded-xl btn-tactile-saffron text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Live Simulation Scenario →</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of 6 System Workflow Steps */}
      <div>
        <h3 className="text-xl font-extrabold text-[#0A192F] mb-4">System Workflow Architecture</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((item, idx) => (
            <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-xl flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <h4 className="text-sm font-extrabold text-[#0A192F] mb-1">{item.title}</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architectural Trust Breakdown */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-300 shadow-md">
        <h3 className="text-lg font-extrabold text-[#0A192F] mb-4 flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-[#138808]" />
          <span>Core Differentiators</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700 font-medium">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <h4 className="font-extrabold text-blue-900 text-sm mb-1">1. Grounded RAG Pipeline</h4>
            <p>Responses are retrieved directly from indexed government scheme databases with source citations.</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <h4 className="font-extrabold text-amber-900 text-sm mb-1">2. Transparent Eligibility</h4>
            <p>Runs citizen parameters against scheme criteria to provide a clear pass/fail matrix.</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <h4 className="font-extrabold text-emerald-900 text-sm mb-1">3. Official Direct Links</h4>
            <p>Provides direct official portal URLs (`.gov.in`, `.nic.in`) so citizens apply on authorized sites.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
