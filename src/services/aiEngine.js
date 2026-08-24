// AI Engine: Intent Classification, Entity Extraction, Multilingual Detection & Follow-up Generator

import { ALL_GOVERNMENT_SERVICES as GOVERNMENT_SERVICES } from '../data/governmentServices';
import { matchGovernmentService } from './ragRetriever';

/**
 * Detect Language from query string (en, hi, mr)
 */
export function detectLanguage(text) {
  if (!text) return 'en';
  
  if (/[\u0A00-\u0A7F]/.test(text)) return 'pa'; // Gurmukhi / Punjabi
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu'; // Gujarati
  if (/[\u0980-\u09FF]/.test(text)) return 'bn'; // Bengali
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta'; // Tamil
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te'; // Telugu
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn'; // Kannada
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml'; // Malayalam

  // Devanagari script range: \u0900-\u097F
  if (/[\u0900-\u097F]/.test(text)) {
    if (text.includes('आहे') || text.includes('मला') || text.includes('हवी') || text.includes('करू') || text.includes('दाखला')) {
      return 'mr'; // Marathi
    }
    return 'hi'; // Hindi
  }

  return 'en';
}

/**
 * Perform Intent Detection & Entity Extraction
 */
export function extractIntentAndEntities(userQuery) {
  const queryLower = userQuery.toLowerCase();
  const lang = detectLanguage(userQuery);

  let intent = "general_inquiry";
  let category = "General";
  let state = null;
  let user_type = null;
  let course = null;
  let year = null;
  let income = null;
  let age = null;
  let action = null;

  // State detection
  if (queryLower.includes('maharashtra') || queryLower.includes('महाराष्ट्र') || queryLower.includes('मराठी')) {
    state = "Maharashtra";
  } else if (queryLower.includes('delhi') || queryLower.includes('दिल्ली')) {
    state = "Delhi";
  } else if (queryLower.includes('up') || queryLower.includes('uttar pradesh') || queryLower.includes('उत्तर प्रदेश')) {
    state = "Uttar Pradesh";
  }

  // Intent & Category matching
  if (queryLower.includes('scholarship') || queryLower.includes('छात्रवृत्ति') || queryLower.includes('शिष्यवृत्ती') || queryLower.includes('fee') || queryLower.includes('financial assist')) {
    intent = "scholarship";
    category = "Education";
    user_type = "Student";
  } else if (queryLower.includes('aadhaar') || queryLower.includes('adhar') || queryLower.includes('आधार') || queryLower.includes('lost aadhaar')) {
    intent = "aadhaar_replacement";
    category = "Identity";
    action = "reissue_download";
  } else if (queryLower.includes('pension') || queryLower.includes('पेंशन') || queryLower.includes('निवृत्तिवेतन') || queryLower.includes('old age') || queryLower.includes('senior')) {
    intent = "pension";
    category = "Social Welfare";
    user_type = "Senior Citizen";
  } else if (queryLower.includes('caste') || queryLower.includes(' जाति') || queryLower.includes('जातीचा') || queryLower.includes(' प्रमाणप') || queryLower.includes('certificate')) {
    intent = "caste_certificate";
    category = "Certificates";
  } else if (queryLower.includes('income certificate') || queryLower.includes('आय प्रमाण') || queryLower.includes('उत्पन्नाचा दाखला')) {
    intent = "income_certificate";
    category = "Certificates";
  } else if (queryLower.includes('ayushman') || queryLower.includes('health') || queryLower.includes('hospital') || queryLower.includes('इलाज') || queryLower.includes('आरोग्य')) {
    intent = "healthcare_scheme";
    category = "Healthcare";
  } else if (queryLower.includes('job') || queryLower.includes('employment') || queryLower.includes('रोजगार') || queryLower.includes('नौकरी')) {
    intent = "employment_services";
    category = "Employment";
  }

  // Course extraction
  if (queryLower.includes('engineering') || queryLower.includes('b.tech') || queryLower.includes('btech') || queryLower.includes('इंजिनिअरिंग')) {
    course = "Engineering";
  } else if (queryLower.includes('medical') || queryLower.includes('mbbs')) {
    course = "Medical";
  } else if (queryLower.includes('polytechnic') || queryLower.includes('diploma')) {
    course = "Polytechnic / Diploma";
  }

  // Year extraction
  if (queryLower.includes('first year') || queryLower.includes('1st year') || queryLower.includes('प्रथम वर्ष') || queryLower.includes('पहिल्या')) {
    year = "1st Year";
  } else if (queryLower.includes('second year') || queryLower.includes('2nd year')) {
    year = "2nd Year";
  }

  // Age extraction
  const ageMatch = userQuery.match(/(\d{2})\s*(years|yr|साल|वर्ष)/i);
  if (ageMatch) {
    age = parseInt(ageMatch[1], 10);
  }

  return {
    language: lang,
    intent,
    category,
    entities: {
      state,
      user_type,
      course,
      year,
      income,
      age,
      action
    }
  };
}

/**
 * Determine Missing Critical Context and Generate Follow-up Questions
 */
export function getFollowUpQuestions(intentData, currentContext) {
  const questions = [];

  if (intentData.intent === 'scholarship') {
    if (!currentContext.state) {
      questions.push({
        id: 'state',
        question: 'Which state are you currently studying or residing in?',
        options: ['Maharashtra', 'Delhi', 'Uttar Pradesh', 'Other State'],
        field: 'state'
      });
    }
    if (!currentContext.course) {
      questions.push({
        id: 'course',
        question: 'What course or field of study are you pursuing?',
        options: ['Engineering', 'Medical', 'Polytechnic / Diploma', 'General Degree (BA/BSc/BCom)'],
        field: 'course'
      });
    }
    if (!currentContext.income) {
      questions.push({
        id: 'income',
        question: 'What is your family\'s approximate annual income?',
        options: ['Under ₹2.5 Lakhs', 'Under ₹8 Lakhs', 'Above ₹8 Lakhs'],
        field: 'income'
      });
    }
  } else if (intentData.intent === 'pension') {
    if (!currentContext.age) {
      questions.push({
        id: 'age',
        question: 'What is the applicant\'s age?',
        options: ['60 years or above', 'Under 60 years'],
        field: 'age'
      });
    }
    if (!currentContext.category) {
      questions.push({
        id: 'category',
        question: 'Does your family have a BPL (Below Poverty Line) card or certificate?',
        options: ['Yes, BPL Card Holder', 'No / General Category'],
        field: 'category'
      });
    }
  } else if (intentData.intent === 'caste_certificate') {
    if (!currentContext.state) {
      questions.push({
        id: 'state',
        question: 'In which state do you need the Caste Certificate?',
        options: ['Maharashtra', 'Delhi', 'Other State'],
        field: 'state'
      });
    }
    if (!currentContext.category) {
      questions.push({
        id: 'category',
        question: 'Which reserved category do you belong to?',
        options: ['OBC', 'SC', 'ST', 'VJNT / SBC'],
        field: 'category'
      });
    }
  }

  return questions;
}
