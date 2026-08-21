import React from 'react';
import { useApp } from '../context/AppContext';
import { Terminal, X, Code, CheckCircle, Database, Shield, Zap } from 'lucide-react';

export default function TechnicalViewModal() {
  const { isTechViewOpen, setIsTechViewOpen, intentData, userContext, ragResult, eligibilityResult, userQuery, language } = useApp();

  if (!isTechViewOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[90vh] glass-panel rounded-2xl border border-emerald-500/40 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Sahayak AI — Technical Pipeline & Diagnostic Dashboard
            </h3>
          </div>
          <button
            onClick={() => setIsTechViewOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diagnostic Pipeline Content */}
        <div className="p-6 overflow-y-auto space-y-6 font-mono text-xs">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Language</span>
              <span className="text-emerald-400 font-bold text-sm uppercase">{language}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Intent</span>
              <span className="text-blue-400 font-bold text-sm truncate block">{intentData?.intent || 'Pending'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">RAG Documents</span>
              <span className="text-amber-400 font-bold text-sm">{ragResult?.retrievedEvidence?.length || 0} retrieved</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Confidence</span>
              <span className="text-emerald-400 font-bold text-sm">{ragResult?.confidenceScore || 0}%</span>
            </div>
          </div>

          {/* User Query & Extracted Entities */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-slate-300 font-bold border-b border-slate-800 pb-2">
              <Code className="w-4 h-4 text-blue-400" />
              <span>1. Natural Language Query & Extracted Entities</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Raw Query</span>
              <span className="text-slate-200">{userQuery || "No active query"}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Structured Context JSON</span>
              <pre className="mt-1 p-2.5 rounded bg-slate-900 text-blue-300 border border-slate-800 overflow-x-auto text-[11px]">
                {JSON.stringify(userContext, null, 2)}
              </pre>
            </div>
          </div>

          {/* RAG Vector Retrieval Diagnostics */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-slate-300 font-bold border-b border-slate-800 pb-2">
              <Database className="w-4 h-4 text-amber-400" />
              <span>2. Knowledge Base Retrieval & RAG Evidence Scoring</span>
            </div>
            {ragResult?.matchedService ? (
              <div className="space-y-2">
                <p className="text-slate-300">
                  <span className="text-slate-500 font-bold">Matched Scheme ID: </span>
                  <span className="text-amber-400">{ragResult.matchedService.id}</span>
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-500 font-bold">Official URL: </span>
                  <span className="text-blue-400 underline">{ragResult.matchedService.official_url}</span>
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-500 font-bold">Trust Level: </span>
                  <span className="text-emerald-400 font-bold">{ragResult.trustLevel}</span>
                </p>
              </div>
            ) : (
              <p className="text-slate-500 italic">No RAG retrieval performed yet.</p>
            )}
          </div>

          {/* Eligibility Matrix Debug */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-slate-300 font-bold border-b border-slate-800 pb-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>3. Eligibility Rule Engine Execution Matrix</span>
            </div>
            {eligibilityResult ? (
              <div className="space-y-2">
                <p className="text-slate-300">
                  <span className="text-slate-500 font-bold">Evaluation Status: </span>
                  <span className="text-emerald-400 font-bold">{eligibilityResult.status}</span>
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-500 font-bold">Matched Rules: </span>
                  <span>{eligibilityResult.matchedCount} / {eligibilityResult.totalCriteria}</span>
                </p>
              </div>
            ) : (
              <p className="text-slate-500 italic">Eligibility engine pending.</p>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-slate-400 text-[11px]">
          <span>Grounded Source Verification Protocol v2.4</span>
          <button
            onClick={() => setIsTechViewOpen(false)}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
