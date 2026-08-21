import React from 'react';
import { Layers, ArrowDown, User, Globe, Target, Cpu, Database, CheckCircle2, ShieldCheck, FileCheck, ExternalLink, Sparkles } from 'lucide-react';

export default function ArchitectureDiagram() {
  const nodes = [
    { title: "1. CITIZEN INPUT", desc: "Natural Language Problem Query (Voice/Text in EN, HI, MR)", icon: <User className="w-5 h-5 text-amber-400" />, color: "border-amber-500/40 bg-amber-500/10 text-amber-300" },
    { title: "2. MULTILINGUAL NLP", desc: "Language Detection & Token Normalization", icon: <Globe className="w-5 h-5 text-blue-400" />, color: "border-blue-500/40 bg-blue-500/10 text-blue-300" },
    { title: "3. INTENT & ENTITY EXTRACTION", desc: "Identifies Intent, Category, State, Course, Income, Age", icon: <Target className="w-5 h-5 text-indigo-400" />, color: "border-indigo-500/40 bg-indigo-500/10 text-indigo-300" },
    { title: "4. FOLLOW-UP QUESTION ENGINE", desc: "Fills missing critical context fields interactively", icon: <Cpu className="w-5 h-5 text-cyan-400" />, color: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300" },
    { title: "5. RAG RETRIEVER & KNOWLEDGE BASE", desc: "Semantic retrieval from verified Indian Govt Dataset", icon: <Database className="w-5 h-5 text-emerald-400" />, color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" },
    { title: "6. ELIGIBILITY RULE ENGINE", desc: "Matches Citizen Context against Scheme Criteria Matrix", icon: <CheckCircle2 className="w-5 h-5 text-amber-400" />, color: "border-amber-500/40 bg-amber-500/10 text-amber-300" },
    { title: "7. EVIDENCE & TRUST VERIFICATION", desc: "Grounded claim checking & Hallucination Guardrails", icon: <ShieldCheck className="w-5 h-5 text-blue-400" />, color: "border-blue-500/40 bg-blue-500/10 text-blue-300" },
    { title: "8. PERSONALIZED ACTION PLAN", desc: "Custom checklist, document requirements & official URLs", icon: <FileCheck className="w-5 h-5 text-emerald-400" />, color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-3">
          <Layers className="w-4 h-4" />
          <span>System Architecture & Pipeline Flow</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white">
          Sahayak AI End-to-End Architecture
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto mt-2">
          A multi-agent, source-grounded RAG framework built to navigate Indian government services transparently.
        </p>
      </div>

      {/* Vertical Pipeline Flowchart */}
      <div className="max-w-2xl mx-auto space-y-3 relative">
        <div className="absolute top-6 bottom-6 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-amber-500 via-blue-500 to-emerald-500 pointer-events-none z-0" />

        {nodes.map((node, idx) => (
          <div key={idx} className="relative z-10">
            <div className={`p-4 sm:p-5 rounded-2xl glass-panel border ${node.color} shadow-xl flex items-center space-x-4`}>
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                {node.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{node.title}</h3>
                <p className="text-xs text-slate-300 mt-0.5 font-medium">{node.desc}</p>
              </div>
            </div>

            {idx < nodes.length - 1 && (
              <div className="flex justify-center my-1">
                <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-12 text-center text-xs text-slate-500 max-w-md mx-auto">
        <p>Designed for Smart India Hackathon (SIH) 2026</p>
        <p className="mt-0.5 text-slate-600">Zero-hallucination source-grounded AI framework</p>
      </div>

    </div>
  );
}
