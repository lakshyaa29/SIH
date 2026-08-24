/* =========================================================================
   NagrikMitra AI / Sahayak AI — Main React SPA Root Application
   ========================================================================= */

import React from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StepProgress from './components/StepProgress';
import FollowUpEngine from './components/FollowUpEngine';
import ActionPlanView from './components/ActionPlanView';
import EligibilityWizard from './components/EligibilityWizard';
import GrievancePortal from './components/GrievancePortal';
import CitizenDashboard from './components/CitizenDashboard';
import ExploreServices from './components/ExploreServices';
import HowItWorks from './components/HowItWorks';
import AdminDashboard from './components/AdminDashboard';
import TechnicalViewModal from './components/TechnicalViewModal';
import Footer from './components/Footer';

export default function App() {
  const { activeTab, pipelineState, fontScale } = useApp();

  const fontClass = fontScale === 'large' ? 'font-scale-large' : fontScale === 'xlarge' ? 'font-scale-xlarge' : 'font-scale-normal';

  return (
    <div className={`min-h-screen flex flex-col bg-[#FDFBF7] text-slate-900 font-sans selection:bg-[#0B2545] selection:text-white ${fontClass}`}>
      
      {/* Official Government Top Navigation Bar */}
      <Navbar />

      {/* Main View Area */}
      <main className="flex-1">
        
        {/* Home Tab */}
        {activeTab === 'home' && (
          <>
            {pipelineState === 'IDLE' ? (
              <HeroSection />
            ) : (
              <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6">
                
                {/* 6-Stage Progress Bar */}
                <StepProgress />

                {/* Follow-up Question Engine (if parameters missing) */}
                {pipelineState === 'FOLLOWUP' && <FollowUpEngine />}

                {/* Grounded Action Plan Result & Token Slip Receipt */}
                {pipelineState === 'COMPLETED' && <ActionPlanView />}

              </div>
            )}
          </>
        )}

        {/* Eligibility Wizard Tab */}
        {activeTab === 'wizard' && <EligibilityWizard />}

        {/* CPGRAMS Public Grievance Tab */}
        {activeTab === 'grievance' && <GrievancePortal />}

        {/* Explore All Schemes Tab */}
        {activeTab === 'explore' && <ExploreServices />}

        {/* Citizen Workspace & Document Locker Dashboard */}
        {activeTab === 'dashboard' && <CitizenDashboard />}

        {/* Jury & Presentation Hub Tab */}
        {activeTab === 'howItWorks' && <HowItWorks />}

        {/* Admin Audit Control Center */}
        {activeTab === 'admin' && <AdminDashboard />}

      </main>

      {/* Judge Technical Pipeline Modal */}
      <TechnicalViewModal />

      {/* Official Government Footer */}
      <Footer />

    </div>
  );
}
