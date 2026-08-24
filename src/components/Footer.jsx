/* =========================================================================
   NagrikMitra AI / Sahayak AI — Portal Footer Component
   ========================================================================= */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { t } = useApp();

  return (
    <footer className="w-full bg-[#0A192F] text-slate-300 text-xs border-t border-slate-800 no-print">
      
      {/* Tricolor Bottom Accent Line */}
      <div className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] h-1 w-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full gold-seal-3d flex items-center justify-center text-slate-900 font-bold text-sm shadow-xs">
              🏛️
            </div>
            <div>
              <span className="text-base font-extrabold text-white font-display block">
                Sahayak AI <span className="text-amber-400 font-normal text-xs">(नागरिकमित्र)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Citizen Assistance & Scheme Information Portal
              </span>
            </div>
          </div>

          {/* Quick Direct External Links */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <a href="https://www.india.gov.in" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-amber-300 flex items-center space-x-1 transition-colors">
              <span>India.gov.in</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
            <a href="https://myscheme.gov.in" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-amber-300 flex items-center space-x-1 transition-colors">
              <span>MyScheme.gov.in</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
            <a href="https://pgportal.gov.in" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-amber-300 flex items-center space-x-1 transition-colors">
              <span>CPGRAMS</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
            <a href="https://scholarships.gov.in" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-amber-300 flex items-center space-x-1 transition-colors">
              <span>National Scholarship Portal</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 space-y-2 sm:space-y-0">
          <p>
            Disclaimer: Sahayak AI provides informational guidance. Please verify details on official government portals before submitting personal credentials.
          </p>
          <p className="flex items-center font-semibold text-slate-300">
            Built with <Heart className="w-3 h-3 text-red-500 mx-1 fill-current" /> for Indian Citizens
          </p>
        </div>

      </div>
    </footer>
  );
}
