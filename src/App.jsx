import React from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StepProgress from './components/StepProgress';
import FollowUpEngine from './components/FollowUpEngine';
import ActionPlanView from './components/ActionPlanView';
import TechnicalViewModal from './components/TechnicalViewModal';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import AdminDashboard from './components/AdminDashboard';
import ExploreServices from './components/ExploreServices';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';

export default function App() {
  const { activeTab, pipelineState } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            {pipelineState === 'IDLE' ? (
              <HeroSection />
            ) : (
              <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6">
                
                {/* 6-Stage Progress Indicator */}
                <StepProgress />

                {/* Follow-up Question Engine (if context missing) */}
                {pipelineState === 'FOLLOWUP' && <FollowUpEngine />}

                {/* Personalized Action Plan Result */}
                {pipelineState === 'COMPLETED' && <ActionPlanView />}

              </div>
            )}
          </>
        )}

        {activeTab === 'explore' && <ExploreServices />}
        {activeTab === 'howItWorks' && <HowItWorks />}
        {activeTab === 'architecture' && <ArchitectureDiagram />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Judge Technical Pipeline Modal */}
      <TechnicalViewModal />

      {/* Footer */}
      <Footer />

    </div>
  );
}
