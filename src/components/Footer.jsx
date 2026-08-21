import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  const { t } = useApp();

  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-base font-extrabold text-white font-display">SAHAYAK AI</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              SIH 2026 PROTOTYPE
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">SIH Demo Guidelines</span>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 space-y-2 sm:space-y-0">
          <p>{t.disclaimer}</p>
          <p className="flex items-center">
            Built with <Heart className="w-3 h-3 text-red-500 mx-1 fill-current" /> for Indian Citizens
          </p>
        </div>

      </div>
    </footer>
  );
}
