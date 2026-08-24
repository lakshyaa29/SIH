/* =========================================================================
   NagrikMitra AI / Sahayak AI — Multilingual Citizen Dashboard
   ========================================================================= */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_GOVERNMENT_SERVICES } from '../data/governmentServices';
import { 
  FileText, Bookmark, FolderCheck, CheckSquare, Square, Clock, 
  ExternalLink, Trash2, Plus 
} from 'lucide-react';

export default function CitizenDashboard() {
  const { 
    t, 
    savedSchemes, 
    toggleSaveScheme, 
    documentLocker, 
    toggleDocument, 
    setActiveTab 
  } = useApp();

  const [documentItems] = useState([
    { id: 'doc_aadhaar', label: 'Aadhaar Card (Mobile Linked)', category: 'Identity' },
    { id: 'doc_bank', label: 'Bank Passbook (Aadhaar Seeded)', category: 'Financial' },
    { id: 'doc_income', label: 'Income Certificate (Revenue Authority)', category: 'Income' },
    { id: 'doc_ration', label: 'Ration Card / Family BPL ID', category: 'Food & Ration' },
    { id: 'doc_caste', label: 'Caste / Category Certificate', category: 'Social Category' },
    { id: 'doc_marksheet', label: 'Latest Mark Sheet / Student ID', category: 'Education' },
    { id: 'doc_land', label: 'Land Record (7/12, Khatoni / RoR)', category: 'Land Title' }
  ]);

  const readyCount = Object.values(documentLocker).filter(Boolean).length;
  const readinessPercent = Math.round((readyCount / documentItems.length) * 100);

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold mb-2">
          <FileText className="w-3.5 h-3.5 text-[#0B2545]" />
          <span>{t.dashboardNav || 'My Dashboard'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-[#0A192F]">
          {t.dashboardTitle || 'My Government Services Dashboard'}
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl font-medium">
          {t.dashboardSub || 'Track your saved schemes, monitor application milestones, and manage your essential citizen document locker.'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
            {t.servicesIndexed || 'Indexed Schemes'}
          </span>
          <div className="text-3xl font-extrabold text-[#0A192F]">{ALL_GOVERNMENT_SERVICES.length}</div>
          <span className="text-[11px] text-slate-500 font-medium">Central & State Portals</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
            {t.savedSchemesHeader || 'Saved Schemes'}
          </span>
          <div className="text-3xl font-extrabold text-[#0A192F]">{savedSchemes.length}</div>
          <span className="text-[11px] text-slate-500 font-medium">In your personal tracker</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
            Document Readiness
          </span>
          <div className="text-3xl font-extrabold text-[#138808]">{readinessPercent}%</div>
          <span className="text-[11px] text-slate-500 font-medium">{readyCount} of {documentItems.length} Checklist Ready</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-1">
            Verification
          </span>
          <div className="text-3xl font-extrabold text-[#0A192F]">100%</div>
          <span className="text-[11px] text-slate-500 font-medium">Official Sources</span>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Saved Schemes Tracker */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-200 shadow-md">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
            <h3 className="font-bold text-base text-[#0A192F] flex items-center space-x-2">
              <Bookmark className="w-4 h-4 text-amber-600" />
              <span>📌 {t.savedSchemesHeader || 'Saved & Researched Schemes'}</span>
            </h3>
            <button 
              onClick={() => setActiveTab('explore')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Explore More Schemes</span>
            </button>
          </div>

          {savedSchemes.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600 mb-2">No saved schemes in your portal tracker yet.</p>
              <button 
                onClick={() => setActiveTab('explore')}
                className="px-4 py-2 rounded-xl btn-tactile-primary text-white font-bold text-xs shadow-xs"
              >
                Browse All Schemes
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedSchemes.map((scheme) => (
                <div key={scheme.id} className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 transition-all flex items-start justify-between gap-3 shadow-xs">
                  <div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 uppercase">
                      {scheme.category}
                    </span>
                    <h4 className="font-bold text-sm text-[#0A192F] mt-1">
                      {scheme.service_name}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {scheme.ministry}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <button 
                      onClick={() => toggleSaveScheme(scheme)}
                      className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <a 
                      href={scheme.official_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 rounded border border-emerald-200 flex items-center space-x-1"
                    >
                      <span>Portal Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Document Readiness Locker */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 shadow-md">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="font-bold text-base text-[#0A192F] flex items-center space-x-2">
                <FolderCheck className="w-4 h-4 text-[#138808]" />
                <span>📂 {t.documentLockerHeader || 'Document Readiness Locker'}</span>
              </h3>
              <span className="text-xs font-extrabold text-[#138808] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {readyCount}/{documentItems.length} Ready
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium mb-4">
              Check off the key identity & revenue documents you have ready for application:
            </p>

            <div className="space-y-2">
              {documentItems.map((doc) => {
                const isReady = !!documentLocker[doc.id];
                return (
                  <div 
                    key={doc.id}
                    onClick={() => toggleDocument(doc.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isReady 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold' 
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      {isReady ? (
                        <CheckSquare className="w-4 h-4 text-[#138808] flex-shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                      <span className="text-xs font-semibold">{doc.label}</span>
                    </div>

                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      isReady ? 'bg-[#138808] text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isReady ? 'READY' : 'MISSING'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 shadow-md">
            <h3 className="font-bold text-base text-[#0A192F] pb-3 mb-4 border-b border-slate-200 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-700" />
              <span>🕒 Activity Log</span>
            </h3>

            <div className="space-y-3 text-xs font-medium text-slate-600">
              <div className="flex items-start space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></span>
                <div>
                  <span className="font-bold text-slate-900">Document Locker Updated</span>
                  <p className="text-[11px] text-slate-500">Verified Aadhaar and Bank Passbook readiness.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
