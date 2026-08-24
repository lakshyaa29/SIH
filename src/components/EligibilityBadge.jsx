/* =========================================================================
   NagrikMitra AI / Sahayak AI — Eligibility Matrix Badge Component
   ========================================================================= */

import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

export default function EligibilityBadge({ evaluation }) {
  const { t } = useApp();

  if (!evaluation) return null;

  const { status, results } = evaluation;

  let badgeStyle = "bg-emerald-50 border-emerald-300 text-emerald-950";
  let badgeIcon = <CheckCircle className="w-5 h-5 text-[#138808]" />;
  let badgeTitle = "Likely Eligible Based on Gazette Criteria";

  if (status === 'MORE_INFO_REQUIRED') {
    badgeStyle = "bg-amber-50 border-amber-300 text-amber-950";
    badgeIcon = <AlertTriangle className="w-5 h-5 text-amber-700" />;
    badgeTitle = "Additional Parameters Required";
  } else if (status === 'LIKELY_NOT_ELIGIBLE') {
    badgeStyle = "bg-red-50 border-red-300 text-red-950";
    badgeIcon = <XCircle className="w-5 h-5 text-red-600" />;
    badgeTitle = "Likely Ineligible";
  }

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-slate-300 shadow-md mb-6">
      
      {/* Top Banner Status */}
      <div className={`flex items-center space-x-3 p-4 rounded-xl border ${badgeStyle} mb-5 shadow-xs`}>
        {badgeIcon}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Eligibility Evaluation Matrix</h4>
          <p className="text-sm font-extrabold mt-0.5">{badgeTitle}</p>
        </div>
      </div>

      {/* Requirement Matrix Table */}
      {results && results.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-300 text-slate-600 uppercase font-black tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Statutory Requirement</th>
                <th className="py-2.5 px-3">User Profile Value</th>
                <th className="py-2.5 px-3 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {results.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block">{item.label || item.requirementText}</span>
                    <span className="text-xs text-slate-500 font-medium">{item.requirementText}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-800 font-semibold">
                    {item.userValueText}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-black bg-emerald-100 text-[#138808] border border-emerald-300">
                      PASSED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-[11px] text-slate-500 mt-4 font-semibold italic flex items-center">
        <Info className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-slate-500" />
        Note: Final statutory eligibility is determined by the nodal department during biometric e-KYC.
      </p>

    </div>
  );
}
