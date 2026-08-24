/* =========================================================================
   NagrikMitra AI / Sahayak AI — 6-Stage AI Execution Pipeline Progress Bar
   ========================================================================= */

import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

export default function StepProgress() {
  const { currentStepIndex, t } = useApp();

  const steps = [
    { label: t.progressUnderstanding || "Understanding Situation", step: 0 },
    { label: t.progressIdentifying || "Identifying Target Services", step: 1 },
    { label: t.progressCollecting || "Checking Required Criteria", step: 2 },
    { label: t.progressSearching || "Searching Verified Database", step: 3 },
    { label: t.progressChecking || "Evaluating Eligibility Rules", step: 4 },
    { label: t.progressPreparing || "Generating Action Plan Receipt", step: 5 }
  ];

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 mb-6 border border-slate-300 shadow-md">
      <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4 flex items-center justify-between">
        <span>AI Navigator Grounded Pipeline Execution</span>
        <span className="text-[#0B2545] font-extrabold">Stage {Math.min(currentStepIndex + 1, 6)} of 6</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {steps.map((item, idx) => {
          const isDone = currentStepIndex > item.step;
          const isCurrent = currentStepIndex === item.step;

          return (
            <div
              key={idx}
              className={`flex items-center space-x-3 p-3 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                  : isCurrent
                  ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold animate-pulse'
                  : 'bg-white border-slate-200 text-slate-400 font-medium'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-[#138808] flex-shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-amber-700 animate-spin flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
              )}
              <span className="text-xs truncate">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
