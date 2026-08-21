import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GOVERNMENT_SERVICES, SERVICE_CATEGORIES } from '../data/governmentServices';
import { Building2, Search, ExternalLink, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

export default function ExploreServices() {
  const { startPipeline, setActiveTab } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');

  const filtered = GOVERNMENT_SERVICES.filter(service => {
    const matchesCategory = activeCategory === 'All Categories' || service.category === activeCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectService = (service) => {
    setActiveTab('home');
    startPipeline(`Tell me how to apply for ${service.name} in ${service.state}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 space-y-6">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
          Explore Government Services & Schemes
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Browse verified Indian government schemes across education, identity, welfare, certificates, and healthcare.
        </p>
      </div>

      {/* Category Pills & Search */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4">
        
        {/* Search Input */}
        <div className="flex items-center space-x-2 bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by scheme name, department, or keyword..."
            className="bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none w-full"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {SERVICE_CATEGORIES.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((service) => (
          <div key={service.id} className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {service.category}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {service.state}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                {service.name}
              </h3>
              
              <p className="text-xs text-blue-300 font-medium mb-3 flex items-center">
                <Building2 className="w-3.5 h-3.5 mr-1" />
                {service.department}
              </p>

              <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                {service.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <a
                href={service.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-white inline-flex items-center space-x-1"
              >
                <span>Official Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => handleSelectService(service)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-1.5 transition-all"
              >
                <span>Navigate Scheme</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
