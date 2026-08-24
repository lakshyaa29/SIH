/* =========================================================================
   NagrikMitra AI / Sahayak AI — Follow-Up Question Context Engine Component
   ========================================================================= */

import React from 'react';
import { useApp } from '../context/AppContext';
import { HelpCircle, ArrowRight, UserCheck } from 'lucide-react';

export default function FollowUpEngine() {
  const { followUpQuestions, currentQuestionIndex, answerFollowUp, userContext } = useApp();

  if (!followUpQuestions || followUpQuestions.length === 0) return null;

  const q = followUpQuestions[currentQuestionIndex];
  if (!q) return null;

  return (
    <div className="w-full glass-panel rounded-2xl p-6 mb-6 border border-slate-300 shadow-lg">
      
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Citizen Profile Verification ({currentQuestionIndex + 1} of {followUpQuestions.length})
          </h3>
          <p className="text-base font-extrabold text-[#0A192F] mt-0.5">
            {q.question}
          </p>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => answerFollowUp(q.field, opt)}
            className="p-4 rounded-xl bg-white hover:bg-amber-50 border border-slate-300 hover:border-amber-400 text-left text-xs sm:text-sm font-bold text-slate-800 transition-all flex items-center justify-between group shadow-sm"
          >
            <span>{opt}</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 transition-transform group-hover:translate-x-1" />
          </button>
        ))}
      </div>

      {/* Accumulated Context Pill Preview */}
      {Object.keys(userContext).length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-200 flex items-center space-x-2 flex-wrap gap-y-2">
          <span className="text-xs font-bold text-slate-600 flex items-center mr-1">
            <UserCheck className="w-3.5 h-3.5 text-[#138808] mr-1" /> Verified Parameters:
          </span>
          {Object.entries(userContext).map(([k, v]) => v && (
            <span key={k} className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-800 shadow-xs">
              {k}: <span className="text-[#0B2545]">{String(v)}</span>
            </span>
          ))}
        </div>
      )}

    </div>
  );
}
