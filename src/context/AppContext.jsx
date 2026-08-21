import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../data/translations';
import { extractIntentAndEntities, getFollowUpQuestions } from '../services/aiEngine';
import { matchGovernmentService } from '../services/ragRetriever';
import { evaluateEligibility } from '../services/eligibilityEngine';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [userQuery, setUserQuery] = useState('');
  const [activeScenario, setActiveScenario] = useState(null);
  
  // Pipeline state
  const [pipelineState, setPipelineState] = useState('IDLE'); // IDLE, UNDERSTANDING, FOLLOWUP, PROCESSING, COMPLETED
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0 to 5 for progress bar
  
  // Pipeline Data
  const [intentData, setIntentData] = useState(null);
  const [userContext, setUserContext] = useState({});
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [ragResult, setRagResult] = useState(null);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  
  // UI Toggles
  const [isTechViewOpen, setIsTechViewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // home, explore, howItWorks, architecture, admin

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Execute full pipeline logic
  const startPipeline = (query, scenario = null) => {
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
      setCurrentStepIndex(1); // Service Identified

      // Step 3: Check missing follow-up questions
      const pendingQuestions = scenario && scenario.questions ? scenario.questions : getFollowUpQuestions(extracted, initialContext);

      if (pendingQuestions && pendingQuestions.length > 0) {
        setFollowUpQuestions(pendingQuestions);
        setCurrentQuestionIndex(0);
        setPipelineState('FOLLOWUP');
        setCurrentStepIndex(2); // Collecting required info
      } else {
        // Proceed directly to RAG & Eligibility
        finishPipeline(query, initialContext);
      }
    }, 600);
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
      // All follow-up questions answered!
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
      }, 700);
    }, 700);
  };

  const resetPipeline = () => {
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

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
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
      activeTab,
      setActiveTab,
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
