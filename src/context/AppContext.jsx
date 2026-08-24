/* =========================================================================
   NagrikMitra AI / Sahayak AI — Global Application Context & State Orchestrator
   ========================================================================= */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { extractIntentAndEntities, getFollowUpQuestions } from '../services/aiEngine';
import { matchGovernmentService } from '../services/ragRetriever';
import { evaluateEligibility } from '../services/eligibilityEngine';
import { speakText, stopSpeech } from '../services/speechService';

const AppContext = createContext();

export function AppProvider({ children }) {
  // 8-Language state
  const [language, setLanguage] = useState(() => localStorage.getItem('sahayak_lang') || 'en');
  
  // Font accessibility scale ('normal', 'large', 'xlarge')
  const [fontScale, setFontScale] = useState(() => localStorage.getItem('sahayak_font_scale') || 'normal');

  // Search Query & Active Scenario
  const [userQuery, setUserQuery] = useState('');
  const [activeScenario, setActiveScenario] = useState(null);

  // Pipeline State ('IDLE', 'UNDERSTANDING', 'FOLLOWUP', 'PROCESSING', 'COMPLETED')
  const [pipelineState, setPipelineState] = useState('IDLE');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Pipeline Results
  const [intentData, setIntentData] = useState(null);
  const [userContext, setUserContext] = useState({});
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [ragResult, setRagResult] = useState(null);
  const [eligibilityResult, setEligibilityResult] = useState(null);

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState('home'); // home, wizard, grievance, explore, dashboard, howItWorks, admin
  const [isTechViewOpen, setIsTechViewOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  // Voice Speech Audio
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Citizen Dashboard & Document Locker (Persistent LocalStorage)
  const [savedSchemes, setSavedSchemes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sahayak_saved_schemes') || '[]');
    } catch {
      return [];
    }
  });

  const [documentLocker, setDocumentLocker] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sahayak_doc_locker') || JSON.stringify({
        doc_aadhaar: true,
        doc_bank: true,
        doc_income: false,
        doc_ration: true,
        doc_caste: false,
        doc_marksheet: false,
        doc_land: false
      }));
    } catch {
      return {};
    }
  });

  // Save state changes to localStorage
  useEffect(() => {
    localStorage.setItem('sahayak_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('sahayak_font_scale', fontScale);
  }, [fontScale]);

  useEffect(() => {
    localStorage.setItem('sahayak_saved_schemes', JSON.stringify(savedSchemes));
  }, [savedSchemes]);

  useEffect(() => {
    localStorage.setItem('sahayak_doc_locker', JSON.stringify(documentLocker));
  }, [documentLocker]);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Toggle saved scheme
  const toggleSaveScheme = (scheme) => {
    setSavedSchemes(prev => {
      const exists = prev.some(s => s.id === scheme.id);
      if (exists) {
        return prev.filter(s => s.id !== scheme.id);
      } else {
        return [...prev, { ...scheme, savedAt: new Date().toLocaleDateString('en-IN'), status: 'Saved' }];
      }
    });
  };

  // Toggle document locker checklist
  const toggleDocument = (docId) => {
    setDocumentLocker(prev => ({
      ...prev,
      [docId]: !prev[docId]
    }));
  };

  // Execute full pipeline logic
  const startPipeline = (query, scenario = null) => {
    stopSpeech();
    setIsSpeaking(false);
    setUserQuery(query);
    setActiveScenario(scenario);
    setPipelineState('UNDERSTANDING');
    setCurrentStepIndex(0);

    let extracted;
    let initialContext = {};

    if (scenario) {
      initialContext = { ...scenario.context };
      extracted = {
        language: scenario.language || 'en',
        intent: scenario.context.intent,
        category: scenario.context.category,
        entities: scenario.context
      };
    } else {
      extracted = extractIntentAndEntities(query);
      initialContext = { ...extracted.entities };
    }

    setIntentData(extracted);
    setUserContext(initialContext);

    // Step 1: Understanding -> Step 2: Service Identification
    setTimeout(() => {
      setCurrentStepIndex(1);

      const pendingQuestions = scenario && scenario.questions && scenario.questions.length > 0
        ? scenario.questions
        : getFollowUpQuestions(extracted, initialContext);

      if (pendingQuestions && pendingQuestions.length > 0) {
        setFollowUpQuestions(pendingQuestions);
        setCurrentQuestionIndex(0);
        setPipelineState('FOLLOWUP');
        setCurrentStepIndex(2); // Collecting info
      } else {
        finishPipeline(query, initialContext);
      }
    }, 500);
  };

  const answerFollowUp = (field, value) => {
    const updatedContext = {
      ...userContext,
      [field]: value
    };
    setUserContext(updatedContext);

    if (currentQuestionIndex + 1 < followUpQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishPipeline(userQuery, updatedContext);
    }
  };

  const finishPipeline = (query, context) => {
    setPipelineState('PROCESSING');
    setCurrentStepIndex(3); // Searching sources

    setTimeout(() => {
      setCurrentStepIndex(4); // Checking eligibility
      const rag = matchGovernmentService(query, context);
      setRagResult(rag);

      setTimeout(() => {
        setCurrentStepIndex(5); // Action plan ready
        const elig = evaluateEligibility(rag.matchedService, context);
        setEligibilityResult(elig);
        setPipelineState('COMPLETED');
      }, 500);
    }, 500);
  };

  const resetPipeline = () => {
    stopSpeech();
    setIsSpeaking(false);
    setPipelineState('IDLE');
    setUserQuery('');
    setActiveScenario(null);
    setIntentData(null);
    setUserContext({});
    setFollowUpQuestions([]);
    setCurrentQuestionIndex(0);
    setRagResult(null);
    setEligibilityResult(null);
    setCurrentStepIndex(0);
  };

  // TTS Read Aloud recommendation
  const readRecommendationAloud = (text) => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      const ok = speakText(text, language);
      if (ok) setIsSpeaking(true);
    }
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      fontScale,
      setFontScale,
      t,
      userQuery,
      setUserQuery,
      activeScenario,
      pipelineState,
      currentStepIndex,
      intentData,
      userContext,
      setUserContext,
      followUpQuestions,
      currentQuestionIndex,
      ragResult,
      eligibilityResult,
      isTechViewOpen,
      setIsTechViewOpen,
      isTokenModalOpen,
      setIsTokenModalOpen,
      activeTab,
      setActiveTab,
      savedSchemes,
      toggleSaveScheme,
      documentLocker,
      toggleDocument,
      isSpeaking,
      readRecommendationAloud,
      startPipeline,
      answerFollowUp,
      resetPipeline
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
