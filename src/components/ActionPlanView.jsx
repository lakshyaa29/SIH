import React from 'react';
import { useApp } from '../context/AppContext';
import EligibilityBadge from './EligibilityBadge';
import SourceExplorer from './SourceExplorer';
import { ExternalLink, CheckCircle2, ShieldCheck, AlertTriangle, FileText, ArrowUpRight, Copy, Share2, Sparkles, Building2 } from 'lucide-react';

export default function ActionPlanView() {
  const { t, ragResult, eligibilityResult, userQuery, userContext, resetPipeline } = useApp();

  if (!ragResult || !ragResult.matchedService) return null;

  const { matchedService, confidenceScore, trustLevel, hallucinationWarning } = ragResult;

  const isDemoUrl = !matchedService.is_verified_official;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner Recommendation Header */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-blue-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.recommendedService}</span>
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {matchedService.category}
            </span>
          </div>

          {/* AI Confidence Pill */}
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Confidence:</span>
            <span className={`font-bold ${confidenceScore >= 85 ? 'text-emerald-400' : confidenceScore >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
              {confidenceScore}% ({trustLevel})
            </span>
          </div>
        </div>

        {/* Service Name & Department */}
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2 leading-snug">
          {matchedService.name}
        </h2>
        <p className="text-sm font-medium text-blue-300 mb-4 flex items-center">
          <Building2 className="w-4 h-4 mr-1.5 text-blue-400" />
          {matchedService.department} • ({matchedService.state})
        </p>

        <p className="text-slate-300 text-sm leading-relaxed mb-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          {matchedService.description}
        </p>

        {/* Why this is relevant */}
        <div className="space-y-2 mb-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.whyRelevant}</h4>
          <ul className="space-y-1.5 text-sm text-slate-200">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>Matches your input query: "{userQuery}"</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>Targeted for {userContext.state || matchedService.state} domicile & {matchedService.category} domain.</span>
            </li>
          </ul>
        </div>

        {/* Primary Action Button to Official Source */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800">
          <a
            href={matchedService.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-900/40 flex items-center space-x-2 transition-all active:scale-95"
          >
            <span>{t.openOfficialSource}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <button
            onClick={resetPipeline}
            className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors border border-slate-700"
          >
            Search Another Service
          </button>
        </div>

      </div>

      {/* Hallucination Protection Alert (if applicable) */}
      {hallucinationWarning && (
        <div className="glass-card rounded-2xl p-4 border border-amber-500/40 bg-amber-500/10 text-amber-300 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">{t.hallucinationWarning}</h4>
            <p className="text-xs mt-1 text-amber-200/90">{t.hallucinationActions}</p>
          </div>
        </div>
      )}

      {/* Eligibility Status Matrix */}
      <EligibilityBadge evaluation={eligibilityResult} />

      {/* Required Documents Checklist */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <span>{t.documentsRequired}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {matchedService.documents.map((doc, idx) => (
            <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="text-xs font-medium text-slate-200 leading-snug">{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-step Action Plan */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{t.stepsTitle}</span>
        </h3>

        <div className="space-y-3">
          {matchedService.steps.map((stepText, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/30 transition-all flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                0{idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium pt-1">
                {stepText}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* RAG Source Explorer */}
      <SourceExplorer ragResult={ragResult} />

      {/* AI Trust Breakdown */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 text-xs text-slate-400">
        <h4 className="font-bold text-white uppercase tracking-wider mb-3 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{t.confidenceTitle}</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="p-2 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-medium">✓ Official Source Found</div>
          <div className="p-2 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-medium">✓ Evidence Grounded</div>
          <div className="p-2 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-medium">✓ Eligibility Evaluated</div>
          <div className="p-2 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-medium">✓ Hallucination Checked</div>
        </div>
      </div>

      {/* Official Disclaimer */}
      <div className="text-center p-4 text-[11px] text-slate-500 space-y-1">
        <p>{t.disclaimer}</p>
        <p className="text-slate-600">{t.privacyNote}</p>
      </div>

    </div>
  );
}
