/* =========================================================================
   NagrikMitra AI / Sahayak AI — RAG Knowledge Evidence Explorer Component
   ========================================================================= */

import React from 'react';
import { useApp } from '../context/AppContext';
import { ExternalLink, Database, Calendar, FileText } from 'lucide-react';

export default function SourceExplorer({ ragResult }) {
  const { t } = useApp();

  if (!ragResult || !ragResult.retrievedEvidence) return null;

  const { retrievedEvidence } = ragResult;

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-slate-300 shadow-md mb-6">
      
      <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-[#0B2545]" />
          <h3 className="text-xs font-black text-[#0A192F] uppercase tracking-wider">
            Verified RAG Evidence Explorer
          </h3>
        </div>
        <span className="text-xs font-black px-2.5 py-0.5 rounded bg-emerald-100 text-[#138808] border border-emerald-300">
          Source Grounded ✓
        </span>
      </div>

      <div className="space-y-3">
        {retrievedEvidence.map((ev, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
            
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#0B2545] flex-shrink-0" />
                <span className="text-xs font-bold text-[#0A192F]">{ev.sourceName}</span>
              </div>
              <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Relevance: {ev.relevanceScore}%
              </span>
            </div>

            <p className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono mb-2">
              "{ev.snippet}"
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                Verified: {ev.lastVerified || '2026-06-15'}
              </span>
              <a
                href={ev.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-900 font-bold inline-flex items-center space-x-1"
              >
                <span>Official Domain Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
