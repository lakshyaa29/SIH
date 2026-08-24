/* =========================================================================
   NagrikMitra AI / Sahayak AI — Citizen Advice Slip & Action Plan View
   ========================================================================= */

import React from 'react';
import { useApp } from '../context/AppContext';
import EligibilityBadge from './EligibilityBadge';
import SourceExplorer from './SourceExplorer';
import { 
  ExternalLink, CheckCircle2, FileText, ArrowUpRight, Volume2, 
  Bookmark, Check, ArrowLeft, Printer, Building2 
} from 'lucide-react';

export default function ActionPlanView() {
  const { 
    t, 
    ragResult, 
    eligibilityResult, 
    userQuery, 
    resetPipeline, 
    savedSchemes, 
    toggleSaveScheme, 
    readRecommendationAloud, 
    isSpeaking 
  } = useApp();

  if (!ragResult || !ragResult.matchedService) return null;

  const { matchedService, confidenceScore, tokenId, timestamp } = ragResult;
  const isSaved = savedSchemes.some(s => s.id === matchedService.id);

  const handlePrint = () => {
    window.print();
  };

  const handleSpeech = () => {
    const textToSpeak = `Recommended Scheme: ${matchedService.service_name}. Offered by ${matchedService.ministry}. ${matchedService.description}. You can apply directly on ${matchedService.official_url}.`;
    readRecommendationAloud(textToSpeak);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 printable-receipt">
      
      {/* 1. Paper Advice Slip Receipt */}
      <div className="paper-receipt p-6 sm:p-8 rounded-2xl border border-slate-300 shadow-md relative">
        
        {/* Subtle Stamp Watermark */}
        <div className="stamp-watermark no-print">
          Sahayak AI<br/>Advice Slip
        </div>

        {/* Header Row */}
        <div className="flex items-start justify-between border-b border-slate-300 pb-4 mb-4 flex-wrap gap-3">
          <div>
            <span className="text-xs font-bold tracking-wider text-slate-600 uppercase block mb-1">
              CITIZEN ASSISTANCE ADVICE SLIP
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#0A192F]">
              {matchedService.service_name}
            </h2>
            <p className="text-xs font-bold text-slate-700 flex items-center mt-1">
              <Building2 className="w-3.5 h-3.5 mr-1 text-[#0B2545]" />
              {matchedService.ministry} • ({matchedService.states ? matchedService.states.join(', ') : 'All India'})
            </p>
          </div>

          {/* Reference ID Box */}
          <div className="bg-[#0A192F] text-amber-300 p-3 rounded-xl border border-slate-700 text-right flex-shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              ADVICE REF NO.
            </span>
            <div className="font-mono text-sm sm:text-base font-extrabold text-amber-300">
              {tokenId || 'SAH-2026-X9K2L'}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Issued: {timestamp || new Date().toLocaleDateString('en-IN')}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5">
          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
            {matchedService.description}
          </p>
        </div>

        {/* Query Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-xs">
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200">
            <span className="font-bold text-amber-900 block mb-0.5">Your Inquiry:</span>
            <span className="text-slate-800 font-medium">"{userQuery || 'Scholarship guidance'}"</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200">
            <span className="font-bold text-blue-900 block mb-0.5">Matched Domain:</span>
            <span className="text-blue-950 font-bold">{matchedService.category} ({confidenceScore || 95}% Relevance)</span>
          </div>
        </div>

        {/* Action Buttons Toolbar (Neatly Positioned & Unclustered) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 no-print">
          
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Primary Action Button */}
            <a
              href={matchedService.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl btn-tactile-primary text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm"
            >
              <span>Apply on Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Read Aloud Button */}
            <button
              onClick={handleSpeech}
              className={`px-3 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 border transition-all ${
                isSpeaking 
                  ? 'bg-amber-500 text-slate-950 border-amber-600 animate-pulse' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
            </button>

            {/* Bookmark Save Button */}
            <button
              onClick={() => toggleSaveScheme(matchedService)}
              className={`px-3 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 border transition-all ${
                isSaved 
                  ? 'bg-emerald-600 text-white border-emerald-700' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5 text-amber-600" />}
              <span>{isSaved ? 'Saved' : 'Save Scheme'}</span>
            </button>

          </div>

          <div className="flex items-center space-x-2">
            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-3 py-2.5 rounded-xl btn-tactile-gold text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>

            {/* New Search */}
            <button
              onClick={resetPipeline}
              className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center space-x-1 border border-slate-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>New Search</span>
            </button>
          </div>

        </div>

      </div>

      {/* 2. Eligibility Matrix */}
      <EligibilityBadge evaluation={eligibilityResult} />

      {/* 3. Required Documents */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-300 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-[#0A192F] uppercase tracking-wider flex items-center space-x-2">
          <FileText className="w-4 h-4 text-blue-700" />
          <span>Required Documents Checklist</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(matchedService.required_documents || matchedService.documents || []).map((doc, idx) => (
            <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0B2545] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="text-xs font-bold text-slate-800 leading-snug">{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Application Steps */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-300 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-[#0A192F] uppercase tracking-wider flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-[#138808]" />
          <span>Application Steps</span>
        </h3>

        <div className="space-y-3">
          {(matchedService.application_steps || matchedService.steps || []).map((stepText, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start space-x-3 shadow-xs">
              <div className="w-6 h-6 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold">
                {stepText}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Source Explorer */}
      <SourceExplorer ragResult={ragResult} />

      {/* Humble Disclaimer */}
      <div className="text-center p-4 text-[11px] text-slate-500 space-y-1">
        <p>This advice slip provides information extracted from official public portal databases.</p>
        <p className="text-slate-400">Please review requirements on official government domains before submitting applications.</p>
      </div>

    </div>
  );
}
