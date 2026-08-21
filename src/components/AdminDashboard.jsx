import React, { useState } from 'react';
import { GOVERNMENT_SERVICES } from '../data/governmentServices';
import { LayoutDashboard, Database, ShieldCheck, Globe, Building, ExternalLink, CheckCircle2, Search } from 'lucide-react';

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(GOVERNMENT_SERVICES.map(s => s.category))];

  const filteredServices = GOVERNMENT_SERVICES.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="w-5 h-5 text-blue-400" />
            <h2 className="text-2xl font-display font-bold text-white">Government Knowledge Base Admin</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status of indexed government services, RAG embeddings & verified sources.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>RAG Retriever Active</span>
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Total Indexed Resources</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-white">128</span>
            <span className="text-[10px] text-emerald-400 font-semibold">+12 this week</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Verified Sources</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-emerald-400">96</span>
            <span className="text-[10px] text-slate-500">75% verified</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Categories Covered</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-blue-400">7</span>
            <span className="text-[10px] text-slate-500">Domains</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Supported Languages</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-amber-400">3</span>
            <span className="text-[10px] text-slate-500">EN, HI, MR</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search service or department..."
            className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Base Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-3 px-4">Scheme / Service Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Department & State</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Official Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredServices.map((serv) => (
                <tr key={serv.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <span className="font-bold text-white block">{serv.name}</span>
                    <span className="text-[11px] text-slate-400 line-clamp-1">{serv.description}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                      {serv.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div>{serv.department}</div>
                    <div className="text-[10px] text-slate-500">{serv.state}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      Verified ({serv.last_verified})
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={serv.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 inline-flex items-center space-x-1 font-semibold"
                    >
                      <span>Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
