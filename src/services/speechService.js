/* =========================================================================
   NagrikMitra AI / Sahayak AI — Voice Recognition (STT) & Speech Synthesis (TTS)
   ========================================================================= */

// Text to Speech
export function speakText(text, lang = 'en-IN') {
  if (!('speechSynthesis' in window)) {
    console.warn("Speech Synthesis not supported in this browser.");
    return false;
  }

  window.speechSynthesis.cancel(); // Stop any active speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  // Language mapping for Web Speech API
  const langMap = {
    en: 'en-IN',
    hi: 'hi-IN',
    mr: 'mr-IN',
    bn: 'bn-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    gu: 'gu-IN',
    kn: 'kn-IN'
  };

  utterance.lang = langMap[lang] || 'en-IN';
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Voice Recognition (Speech to Text)
export function startVoiceRecognition(onResult, onError, lang = 'en-IN') {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    onError("Voice recognition is not supported in your browser. Please type your query.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  const langMap = {
    en: 'en-IN',
    hi: 'hi-IN',
    mr: 'mr-IN',
    bn: 'bn-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    gu: 'gu-IN',
    kn: 'kn-IN'
  };

  recognition.lang = langMap[lang] || 'en-IN';

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    onError(`Voice input error: ${event.error}. Please try typing.`);
  };

  try {
    recognition.start();
    return recognition;
  } catch (err) {
    console.error("Failed to start recognition:", err);
    onError("Microphone access failed. Please ensure permissions are granted.");
    return null;
  }
}
