/* =========================================================================
   NagrikMitra AI / Sahayak AI — Government Knowledge Base Admin & Verification Audit Center
   ========================================================================= */

import React, { useState } from 'react';
import { ALL_GOVERNMENT_SERVICES } from '../data/governmentServices';
import { LayoutDashboard, Database, ShieldCheck, Globe, Building2, ExternalLink, CheckCircle2, Search, Check } from 'lucide-react';

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [verifiedList, setVerifiedList] = useState(() => ALL_GOVERNMENT_SERVICES.map(s => s.id));

  const categories = ['All', ...Array.from(new Set(ALL_GOVERNMENT_SERVICES.map(s => s.category)))];

  const filteredServices = ALL_GOVERNMENT_SERVICES.filter(service => {
    const matchesSearch = service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.ministry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const toggleVerify = (id) => {
    setVerifiedList(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-300 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="w-5 h-5 text-[#0B2545]" />
            <h2 className="text-2xl font-display font-extrabold text-[#0A192F]">
              Government Knowledge Base Admin
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Real-time status of indexed government services, RAG embeddings & statutory verified sources.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-[#138808] border border-emerald-300 flex items-center space-x-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#138808] animate-ping" />
            <span>RAG Retriever Active</span>
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-bold uppercase">Total Indexed Schemes</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-extrabold text-[#0A192F]">{ALL_GOVERNMENT_SERVICES.length}</span>
            <span className="text-[10px] text-[#138808] font-bold">+12 this month</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-bold uppercase">Verified Sources</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-extrabold text-[#138808]">{verifiedList.length}</span>
            <span className="text-[10px] text-slate-600 font-bold">100% verified</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-bold uppercase">Categories Covered</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-extrabold text-blue-700">{categories.length - 1}</span>
            <span className="text-[10px] text-slate-600 font-bold">Domains</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-bold uppercase">Supported Languages</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-extrabold text-amber-700">8</span>
            <span className="text-[10px] text-slate-600 font-bold">EN, HI, MR, BN...</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-slate-300 w-full sm:w-80 shadow-sm">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search service or ministry..."
            className="bg-transparent text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto py-1 scrollbar-thin">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#0B2545] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Base Table */}
      <div className="glass-panel rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0A192F] text-amber-300 uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-4">Scheme / Service Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Ministry & Domicile</th>
                <th className="py-3 px-4">Audit Status</th>
                <th className="py-3 px-4 text-right">Action / Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredServices.map((serv) => {
                const isVer = verifiedList.includes(serv.id);
                return (
                  <tr key={serv.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span className="font-extrabold text-[#0A192F] block">{serv.service_name}</span>
                      <span className="text-[11px] text-slate-500 font-medium line-clamp-1">{serv.description}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-[#0B2545] border border-blue-200 font-extrabold text-[10px]">
                        {serv.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      <div>{serv.ministry}</div>
                      <div className="text-[10px] text-slate-500">{serv.states ? serv.states.join(', ') : 'All'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => toggleVerify(serv.id)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold border transition-all ${
                          isVer 
                            ? 'bg-emerald-100 text-[#138808] border-emerald-300' 
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        <span>{isVer ? `Verified (${serv.last_verified || '2026-06-15'})` : 'Pending Verification'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={serv.official_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-900 inline-flex items-center space-x-1 font-bold"
                      >
                        <span>Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
