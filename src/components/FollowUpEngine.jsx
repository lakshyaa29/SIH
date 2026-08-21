import React from 'react';
import { useApp } from '../context/AppContext';
import { HelpCircle, ArrowRight, UserCheck } from 'lucide-react';

export default function FollowUpEngine() {
  const { followUpQuestions, currentQuestionIndex, answerFollowUp, userContext } = useApp();

  if (!followUpQuestions || followUpQuestions.length === 0) return null;

  const q = followUpQuestions[currentQuestionIndex];
  if (!q) return null;

  return (
    <div className="w-full glass-panel rounded-2xl p-6 mb-6 border border-blue-500/30 shadow-xl shadow-blue-950/20">
      
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Citizen Context Verification ({currentQuestionIndex + 1} of {followUpQuestions.length})
          </h3>
          <p className="text-sm font-semibold text-white mt-0.5">
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
            className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-blue-600/20 border border-slate-700 hover:border-blue-500 text-left text-sm font-medium text-slate-200 hover:text-white transition-all flex items-center justify-between group"
          >
            <span>{opt}</span>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
          </button>
        ))}
      </div>

      {/* Accumulated Context Pill Preview */}
      {Object.keys(userContext).length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center space-x-2 flex-wrap gap-y-2">
          <span className="text-xs text-slate-400 flex items-center mr-1">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400 mr-1" /> Collected Context:
          </span>
          {Object.entries(userContext).map(([k, v]) => v && (
            <span key={k} className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-blue-300">
              {k}: <span className="text-white">{String(v)}</span>
            </span>
          ))}
        </div>
      )}

    </div>
  );
}
