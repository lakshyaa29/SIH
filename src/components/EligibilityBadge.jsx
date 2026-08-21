import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

export default function EligibilityBadge({ evaluation }) {
  const { t } = useApp();

  if (!evaluation) return null;

  const { status, results } = evaluation;

  let badgeStyle = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
  let badgeIcon = <CheckCircle className="w-5 h-5 text-emerald-400" />;
  let badgeTitle = t.likelyEligible;

  if (status === 'MORE_INFO_REQUIRED') {
    badgeStyle = "bg-amber-500/10 border-amber-500/30 text-amber-400";
    badgeIcon = <AlertTriangle className="w-5 h-5 text-amber-400" />;
    badgeTitle = t.moreInfoRequired;
  } else if (status === 'LIKELY_NOT_ELIGIBLE') {
    badgeStyle = "bg-red-500/10 border-red-500/30 text-red-400";
    badgeIcon = <XCircle className="w-5 h-5 text-red-400" />;
    badgeTitle = t.likelyNotEligible;
  }

  return (
    <div className="w-full glass-card rounded-2xl p-5 border border-slate-800 mb-6">
      
      {/* Top Banner Status */}
      <div className={`flex items-center space-x-3 p-4 rounded-xl border ${badgeStyle} mb-5`}>
        {badgeIcon}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider">{t.eligibilityTitle}</h4>
          <p className="text-sm font-semibold mt-0.5">{badgeTitle}</p>
        </div>
      </div>

      {/* Requirement Matrix Table */}
      {results && results.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">{t.reqHeader}</th>
                <th className="py-2.5 px-3">{t.userHeader}</th>
                <th className="py-2.5 px-3 text-right">{t.resultHeader}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {results.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-200 block">{item.label}</span>
                    <span className="text-xs text-slate-400">{item.requirementText}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-medium">
                    {item.userValueText}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {item.matchStatus === 'MATCH' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {t.match}
                      </span>
                    )}
                    {item.matchStatus === 'MISMATCH' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                        {t.mismatch}
                      </span>
                    )}
                    {item.matchStatus === 'PENDING' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {t.pending}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-[11px] text-slate-400 mt-4 italic flex items-center">
        <Info className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-slate-400" />
        Note: Final eligibility is determined by the official department during document verification.
      </p>

    </div>
  );
}
