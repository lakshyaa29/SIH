import React from 'react';
import { useApp } from '../context/AppContext';
import { ExternalLink, Database, ShieldCheck, Calendar, FileText } from 'lucide-react';

export default function SourceExplorer({ ragResult }) {
  const { t } = useApp();

  if (!ragResult || !ragResult.retrievedEvidence) return null;

  const { retrievedEvidence, matchedService } = ragResult;

  return (
    <div className="w-full glass-card rounded-2xl p-5 border border-slate-800 mb-6">
      
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {t.sourcesUsed} (RAG Knowledge Explorer)
          </h3>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          Source Grounded ✓
        </span>
      </div>

      <div className="space-y-3">
        {retrievedEvidence.map((ev, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
            
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-200">{ev.sourceName}</span>
              </div>
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                {t.relevance}: {ev.relevanceScore}%
              </span>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80 font-mono mb-2">
              "{ev.snippet}"
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                Verified: {ev.lastVerified}
              </span>
              <a
                href={ev.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center space-x-1"
              >
                <span>Official Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
