import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

export default function StepProgress() {
  const { currentStepIndex, t } = useApp();

  const steps = [
    { label: t.progressUnderstanding, step: 0 },
    { label: t.progressIdentifying, step: 1 },
    { label: t.progressCollecting, step: 2 },
    { label: t.progressSearching, step: 3 },
    { label: t.progressChecking, step: 4 },
    { label: t.progressPreparing, step: 5 }
  ];

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 mb-6 border border-slate-800">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
        <span>AI Navigator Execution Pipeline</span>
        <span className="text-blue-400">Stage {Math.min(currentStepIndex + 1, 6)} of 6</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {steps.map((item, idx) => {
          const isDone = currentStepIndex > item.step;
          const isCurrent = currentStepIndex === item.step;
          const isUpcoming = currentStepIndex < item.step;

          return (
            <div
              key={idx}
              className={`flex items-center space-x-3 p-3 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : isCurrent
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-md shadow-blue-950/40 animate-pulse-slow'
                  : 'bg-slate-900/50 border-slate-800 text-slate-500'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-600 flex-shrink-0" />
              )}
              <span className="text-xs font-semibold truncate">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
