/* =========================================================================
   NagrikMitra AI / Sahayak AI — Multilingual Master Schemes Directory
   ========================================================================= */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_GOVERNMENT_SERVICES } from '../data/governmentServices';
import { Building2, Search, ExternalLink, ArrowRight, CheckCircle2, Bookmark, BookmarkCheck, X } from 'lucide-react';

export default function ExploreServices() {
  const { t, startPipeline, setActiveTab, savedSchemes, toggleSaveScheme } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedScheme, setSelectedScheme] = useState(null);

  const categories = ['All', ...Array.from(new Set(ALL_GOVERNMENT_SERVICES.map(s => s.category)))];

  const filtered = ALL_GOVERNMENT_SERVICES.filter(service => {
    const matchesCat = activeCategory === 'All' || service.category === activeCategory;
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      service.service_name.toLowerCase().includes(term) ||
      service.description.toLowerCase().includes(term) ||
      service.ministry.toLowerCase().includes(term) ||
      (service.keywords || []).some(k => k.toLowerCase().includes(term));
    return matchesCat && matchesSearch;
  });

  const handleNavigateScheme = (service) => {
    setSelectedScheme(null);
    setActiveTab('home');
    startPipeline(`How do I apply for ${service.service_name}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-6">
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0A192F]">
          {t.exploreTitle || 'Master Government Schemes Directory'}
        </h2>
        <p className="text-sm text-slate-600 mt-2 font-medium">
          {t.exploreSub || 'Search over 47+ central and state government schemes verified directly against official gazettes & statutory portals.'}
        </p>
      </div>

      {/* Category Pills & Search Controls */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-300 shadow-md space-y-4">
        
        {/* Search Input */}
        <div className="flex items-center space-x-2 bg-white px-4 py-3 rounded-xl border border-slate-300 shadow-xs focus-within:border-[#0B2545]">
          <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder || 'Search 47+ schemes by keyword, ministry, scholarship, loan, pension...'}
            className="bg-transparent text-sm text-slate-900 font-semibold placeholder-slate-400 focus:outline-none w-full"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-[#0B2545] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Count Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-600 font-bold px-1">
        <span>Showing {filtered.length} of {ALL_GOVERNMENT_SERVICES.length} Schemes</span>
        <span className="text-[#138808]">Direct Official URLs</span>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((service) => {
          const isSaved = savedSchemes.some(s => s.id === service.id);
          return (
            <div key={service.id} className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-blue-100 text-[#0B2545] border border-blue-200 uppercase">
                    {service.category}
                  </span>
                  <button 
                    onClick={() => toggleSaveScheme(service)}
                    className="text-amber-600 hover:text-amber-700 p-1"
                    title={isSaved ? "Saved" : "Save Scheme"}
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4 fill-amber-500" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                <h3 className="text-base font-extrabold text-[#0A192F] mb-1 leading-snug">
                  {service.service_name}
                </h3>
                
                <p className="text-xs text-slate-500 font-semibold mb-3 flex items-center">
                  <Building2 className="w-3.5 h-3.5 mr-1 text-[#0B2545]" />
                  {service.ministry}
                </p>

                <p className="text-xs text-slate-700 font-medium leading-relaxed mb-4 line-clamp-3">
                  {service.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedScheme(service)}
                  className="text-xs font-bold text-[#0B2545] hover:underline"
                >
                  Details →
                </button>

                <button
                  onClick={() => handleNavigateScheme(service)}
                  className="px-3 py-1.5 rounded-xl btn-tactile-primary text-white font-bold text-xs flex items-center space-x-1 shadow-xs"
                >
                  <span>Action Plan</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Scheme Details Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-slate-300 shadow-2xl max-h-[90vh] overflow-y-auto relative">
            
            <button 
              onClick={() => setSelectedScheme(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 uppercase">
              {selectedScheme.category}
            </span>

            <h2 className="text-2xl font-extrabold text-[#0A192F] mt-2 mb-1">
              {selectedScheme.service_name}
            </h2>
            <p className="text-xs text-slate-600 font-semibold mb-4">
              {selectedScheme.ministry}
            </p>

            <p className="text-xs text-slate-800 leading-relaxed font-medium mb-5 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {selectedScheme.description}
            </p>

            {/* Required Documents */}
            <div className="mb-5">
              <h4 className="text-xs font-extrabold text-[#0A192F] uppercase tracking-wider mb-2">
                {t.requiredDocsHeader || 'Required Documents'}:
              </h4>
              <ul className="space-y-1">
                {(selectedScheme.required_documents || []).map((doc, idx) => (
                  <li key={idx} className="text-xs font-semibold text-slate-700 flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#138808]" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Application Steps */}
            <div className="mb-6">
              <h4 className="text-xs font-extrabold text-[#0A192F] uppercase tracking-wider mb-2">
                {t.applicationStepsHeader || 'Application Steps'}:
              </h4>
              <div className="space-y-2">
                {(selectedScheme.application_steps || []).map((step, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex items-start space-x-2">
                    <span className="font-extrabold text-[#0B2545]">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <a
                href={selectedScheme.official_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl btn-tactile-gold text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-xs"
              >
                <span>{t.applyOfficialBtn || 'Apply on Official Portal'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => handleNavigateScheme(selectedScheme)}
                className="px-4 py-2 rounded-xl btn-tactile-primary text-white font-bold text-xs"
              >
                Launch Guided Plan
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
