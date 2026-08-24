/* =========================================================================
   NagrikMitra AI / Sahayak AI — Fully Multilingual Eligibility Wizard
   ========================================================================= */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { evaluateBatchEligibility } from '../services/eligibilityEngine';
import { CheckCircle2, ExternalLink, Scale, RefreshCw } from 'lucide-react';

export default function EligibilityWizard() {
  const { t, startPipeline } = useApp();

  const [profile, setProfile] = useState({
    age: 24,
    gender: 'Male',
    state: 'Maharashtra',
    caste_category: 'General / OBC',
    education: 'Undergraduate',
    occupation: 'Student',
    income: '₹1.5 Lakh – ₹2.5 Lakh',
    land_holding: 'None',
    disability_status: 'No'
  });

  const [results, setResults] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const evalResults = evaluateBatchEligibility(profile);
      setResults(evalResults);
      setIsCalculating(false);
    }, 300);
  };

  useEffect(() => {
    calculate();
  }, []);

  const handleChange = (field, val) => {
    setProfile(prev => ({ ...prev, [field]: val }));
  };

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-2">
          <Scale className="w-3.5 h-3.5 text-amber-600" />
          <span>{t.eligibilityNav || 'Eligibility Assessment'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-[#0A192F]">
          {t.wizardTitle || 'Citizen Eligibility Assessment Wizard'}
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl font-medium">
          {t.wizardSub || 'Fill in your socioeconomic profile once to calculate qualification scores across all 47+ central and state government schemes simultaneously.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Profile Controls Form Panel */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-300 shadow-md sticky top-24">
          <h3 className="font-bold text-base text-[#0A192F] pb-3 mb-4 border-b border-slate-200 flex items-center justify-between">
            <span>👤 {t.profileHeader || 'Your Demographic Profile'}</span>
            <button 
              onClick={calculate}
              className="text-xs text-amber-700 hover:text-amber-900 font-semibold flex items-center space-x-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCalculating ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </h3>

          <div className="space-y-4 text-xs font-semibold text-slate-700">
            
            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1">Age (Years)</label>
                <input 
                  type="number" 
                  value={profile.age} 
                  min="1" 
                  max="100" 
                  onChange={(e) => handleChange('age', parseInt(e.target.value) || 1)}
                  className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-[#0B2545]"
                />
              </div>
              <div>
                <label className="block mb-1">Gender</label>
                <select 
                  value={profile.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-[#0B2545]"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Transgender</option>
                </select>
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block mb-1">State of Residence</label>
              <select 
                value={profile.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-[#0B2545]"
              >
                <option>Maharashtra</option>
                <option>Delhi</option>
                <option>Uttar Pradesh</option>
                <option>Karnataka</option>
                <option>Tamil Nadu</option>
                <option>West Bengal</option>
                <option>Gujarat</option>
                <option>All India / Other</option>
              </select>
            </div>

            {/* Occupation */}
            <div>
              <label className="block mb-1">Primary Occupation / Status</label>
              <select 
                value={profile.occupation}
                onChange={(e) => handleChange('occupation', e.target.value)}
                className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-[#0B2545]"
              >
                <option>Student</option>
                <option>Farmer (Agriculture)</option>
                <option>Street Vendor / Daily Wage</option>
                <option>Salaried Employee</option>
                <option>Business / MSME Owner</option>
                <option>Unemployed / Homemaker</option>
                <option>Senior Citizen (Retired)</option>
              </select>
            </div>

            {/* Income */}
            <div>
              <label className="block mb-1">Annual Family Income</label>
              <select 
                value={profile.income}
                onChange={(e) => handleChange('income', e.target.value)}
                className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-[#0B2545]"
              >
                <option>Below ₹1.5 Lakh (BPL/EWS)</option>
                <option>₹1.5 Lakh – ₹2.5 Lakh</option>
                <option>₹2.5 Lakh – ₹6 Lakh</option>
                <option>Above ₹6 Lakh</option>
              </select>
            </div>

            {/* Recalculate Button */}
            <button 
              onClick={calculate}
              className="w-full py-3 rounded-xl btn-tactile-primary text-white font-bold text-xs shadow-md mt-4 flex items-center justify-center space-x-2"
            >
              <span>⚡ {t.recalculateBtn || 'Update Qualification Scores'}</span>
            </button>

          </div>
        </div>

        {/* Results Scheme Cards Output Panel */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-700">
              Evaluated <span className="text-[#0A192F] font-extrabold">{results.length} Schemes</span>
            </span>
            <span className="text-xs font-extrabold text-[#138808]">
              {results.filter(r => r.isQualified).length} Qualified Schemes
            </span>
          </div>

          {isCalculating ? (
            <div className="glass-panel p-12 rounded-2xl text-center">
              <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs font-bold text-slate-600">Calculating eligibility scores...</p>
            </div>
          ) : (
            results.map((scheme) => (
              <div 
                key={scheme.id}
                className="glass-card p-5 rounded-2xl border border-slate-200 hover:border-amber-400 transition-all shadow-xs"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-[#0B2545] border border-blue-200 uppercase">
                      {scheme.category}
                    </span>
                    <h3 className="font-bold text-base text-[#0A192F] mt-1">
                      {scheme.service_name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {scheme.ministry}
                    </p>
                  </div>

                  {/* Match Percentage Badge */}
                  <div className="text-right flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold ${
                      scheme.matchPercentage >= 80 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {scheme.matchPercentage}% Qualification Match
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 font-medium mb-3">
                  {scheme.description}
                </p>

                {/* Qualification Reasons */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 mb-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Matching Criteria Summary:
                  </span>
                  <ul className="space-y-1">
                    {scheme.qualificationReasons.map((reason, i) => (
                      <li key={i} className="text-xs font-semibold text-emerald-800 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#138808] flex-shrink-0" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <button 
                    onClick={() => startPipeline(`Tell me details about ${scheme.service_name}`)}
                    className="text-xs font-bold text-[#0B2545] hover:text-blue-800 underline"
                  >
                    View Action Plan →
                  </button>

                  <a 
                    href={scheme.official_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200"
                  >
                    <span>{t.applyOfficialBtn || 'Apply on Official Portal'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

              </div>
            ))
          )}

        </div>

      </div>

    </section>
  );
}
