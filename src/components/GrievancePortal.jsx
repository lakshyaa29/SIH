/* =========================================================================
   NagrikMitra AI / Sahayak AI — Multilingual Grievance Portal Component
   ========================================================================= */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { analyzeGrievance, generateGrievancePetition } from '../services/grievanceEngine';
import { ShieldAlert, CheckCircle2, Copy, ExternalLink, AlertTriangle, FileText } from 'lucide-react';

export default function GrievancePortal() {
  const { t } = useApp();
  const [description, setDescription] = useState('I applied for my National Scholarship on scholarships.gov.in 45 days ago. My college verified it, but state disbursal has been stuck with no status update.');
  const [department, setDepartment] = useState('Education / Scholarship Portal');
  const [daysPending, setDaysPending] = useState(45);
  const [refNumber, setRefNumber] = useState('MH2026-NSP-9921');
  const [citizenName, setCitizenName] = useState('Applicant Name');

  const [diagnostic, setDiagnostic] = useState(null);
  const [petitionText, setPetitionText] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleDiagnose = (e) => {
    e?.preventDefault();
    if (!description.trim()) {
      alert("Please describe your grievance issue.");
      return;
    }

    const res = analyzeGrievance({
      description,
      department,
      ref_number: refNumber,
      days_pending: daysPending
    });

    setDiagnostic(res);

    const draft = generateGrievancePetition({
      description,
      department,
      ref_number: refNumber,
      days_pending: daysPending,
      citizen_name: citizenName
    });

    setPetitionText(draft);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(petitionText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="text-center sm:text-left space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-800 text-xs font-bold">
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <span>{t.grievanceNav || 'Public Grievance Assistance'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-[#0A192F]">
          {t.grievanceTitle || 'Grievance Petition Auto-Drafter'}
        </h2>
        <p className="text-sm text-slate-600 font-medium">
          {t.grievanceSub || 'If your application or benefit has been delayed or unresolved, Sahayak AI helps structure a formal petition letter ready for submission on official grievance portals like pgportal.gov.in.'}
        </p>
      </div>

      {/* 1. Diagnostic Input Form */}
      <form onSubmit={handleDiagnose} className="glass-panel p-6 rounded-2xl border border-slate-300 shadow-md space-y-5">
        
        <h3 className="font-bold text-base text-[#0A192F] pb-2 border-b border-slate-200">
          1. Describe Your Delayed Issue
        </h3>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Describe the Issue (Application status, delay, or officer inaction)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-3 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium text-xs sm:text-sm focus:outline-none focus:border-[#0B2545]"
            placeholder="e.g. Applied 45 days ago, verified by college, but disbursement is pending with no status update..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Target Department / Scheme
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold text-xs focus:outline-none focus:border-[#0B2545]"
            >
              <option value="Education / Scholarship Portal">Education / Scholarship Portal</option>
              <option value="PM-KISAN / Agriculture">PM-KISAN / Agriculture</option>
              <option value="EPFO / Pension Disbursal">EPFO / Pension Claim</option>
              <option value="Food & Ration Supply">Food & Ration Supply</option>
              <option value="Aadhaar / UIDAI Services">Aadhaar / UIDAI Services</option>
              <option value="Healthcare / Ayushman Bharat">Healthcare / Ayushman Bharat</option>
              <option value="Housing / PMAY">Housing / PMAY</option>
              <option value="Other Central / State Ministry">Other Central / State Ministry</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Days Pending
            </label>
            <input
              type="number"
              value={daysPending}
              onChange={(e) => setDaysPending(parseInt(e.target.value) || 1)}
              min="1"
              max="1000"
              className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold text-xs focus:outline-none focus:border-[#0B2545]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Application Ref ID
            </label>
            <input
              type="text"
              value={refNumber}
              onChange={(e) => setRefNumber(e.target.value)}
              placeholder="e.g. MH2026-NSP-9921"
              className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold text-xs focus:outline-none focus:border-[#0B2545]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Applicant Name
          </label>
          <input
            type="text"
            value={citizenName}
            onChange={(e) => setCitizenName(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-bold text-xs focus:outline-none focus:border-[#0B2545]"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-xl btn-tactile-saffron text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{t.generatePetitionBtn || 'Generate CPGRAMS Petition Letter'}</span>
          </button>
        </div>

      </form>

      {/* 2. Diagnostic & Auto-Drafted Petition Results */}
      {diagnostic && (
        <div className="space-y-6">
          
          <div className={`p-5 rounded-2xl border ${
            diagnostic.is_delayed 
              ? 'bg-red-50 border-red-300 text-red-950' 
              : 'bg-emerald-50 border-emerald-300 text-emerald-950'
          }`}>
            <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                diagnostic.is_delayed ? 'bg-red-600 text-white' : 'bg-[#138808] text-white'
              }`}>
                {diagnostic.is_delayed ? 'Timeline Exceeded (>30 Days)' : 'Within Standard Processing Window'}
              </span>

              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-white border border-slate-300 text-slate-700">
                Department: {diagnostic.suggested_department}
              </span>
            </div>

            <h3 className="font-bold text-base mb-1">
              Grievance Summary
            </h3>

            <ul className="space-y-1 text-xs font-semibold mt-2">
              {diagnostic.statutory_grounds.map((ground, i) => (
                <li key={i} className="flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                  <span>{ground}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-300 shadow-md">
            
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#0B2545]" />
                <h3 className="font-bold text-base text-[#0A192F]">
                  Formatted Petition Letter
                </h3>
              </div>

              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-xl btn-tactile-gold text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-xs"
              >
                {isCopied ? <CheckCircle2 className="w-4 h-4 text-[#138808]" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'Copied to Clipboard!' : '1-Click Copy Petition'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
              {petitionText}
            </pre>

            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs text-slate-600 font-medium">
                Copy this text and paste directly into official portal text boxes.
              </span>

              <a
                href="https://pgportal.gov.in"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl btn-tactile-primary text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm"
              >
                <span>Go to pgportal.gov.in</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>
      )}

    </section>
  );
}
