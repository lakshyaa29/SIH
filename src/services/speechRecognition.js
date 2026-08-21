// Web Speech API wrapper for real voice input in Sahayak AI

export function isSpeechSupported() {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

let recognitionInstance = null;

export function startSpeechRecognition({ onResult, onError, onEnd, lang = 'en-IN' }) {
  if (!isSpeechSupported()) {
    if (onError) onError('Speech recognition is not supported in this browser.');
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognitionInstance = new SpeechRecognition();

  recognitionInstance.continuous = false;
  recognitionInstance.interimResults = true;

  // Language mapping
  if (lang === 'hi') {
    recognitionInstance.lang = 'hi-IN';
  } else if (lang === 'mr') {
    recognitionInstance.lang = 'mr-IN';
  } else {
    recognitionInstance.lang = 'en-IN';
  }

  recognitionInstance.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    if (onResult) onResult(transcript);
  };

  recognitionInstance.onerror = (event) => {
    console.warn('Speech recognition error:', event.error);
    if (onError) onError(event.error);
  };

  recognitionInstance.onend = () => {
    if (onEnd) onEnd();
  };

  try {
    recognitionInstance.start();
  } catch (err) {
    console.error('Failed to start speech recognition:', err);
  }

  return recognitionInstance;
}

export function stopSpeechRecognition() {
  if (recognitionInstance) {
    try {
      recognitionInstance.stop();
    } catch (e) {}
    recognitionInstance = null;
  }
}
