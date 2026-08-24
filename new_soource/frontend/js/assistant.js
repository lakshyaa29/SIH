/* =========================================================================
   NagrikMitra AI — Interactive Assistant & Voice Processing
   ========================================================================= */

const Assistant = {
  chatState: {
    log: [],
    intent: null,
    intentLabel: null,
    confidence: 0,
    answers: {},
    questions: [],
    currentQuestion: null,
    questionIndex: 0,
    totalQuestions: 0,
    result: null,
    isProcessing: false,
    isListening: false
  },

  recognition: null,

  initVoice() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      
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
      this.recognition.lang = langMap[window.App.currentLang] || 'en-IN';

      this.recognition.onstart = () => {
        this.chatState.isListening = true;
        this.updateMicUI(true);
        App.showToast("Listening... Speak your problem clearly.");
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.updateMicUI(false);
        this.chatState.isListening = false;
        
        const input = document.getElementById('chatInput') || document.getElementById('heroInput');
        if (input) {
          input.value = transcript;
        }
        
        if (App.currentView === 'assistant') {
          this.handleSend(transcript);
        } else {
          App.startAssistantWith(transcript);
        }
      };

      this.recognition.onerror = (e) => {
        this.chatState.isListening = false;
        this.updateMicUI(false);
        console.warn("Speech recognition error:", e);
        App.showToast("Voice recognition couldn't detect speech. Please type your query.");
      };

      this.recognition.onend = () => {
        this.chatState.isListening = false;
        this.updateMicUI(false);
      };
    }
  },

  toggleVoice() {
    if (!this.recognition) {
      this.initVoice();
    }
    if (!this.recognition) {
      alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }
    if (this.chatState.isListening) {
      this.recognition.stop();
    } else {
      const langMap = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', bn: 'bn-IN', ta: 'ta-IN', te: 'te-IN', gu: 'gu-IN', kn: 'kn-IN' };
      this.recognition.lang = langMap[window.App.currentLang] || 'en-IN';
      try {
        this.recognition.start();
      } catch (err) {
        console.error(err);
      }
    }
  },

  updateMicUI(isRecording) {
    const micBtns = document.querySelectorAll('.mic-btn');
    micBtns.forEach(btn => {
      if (isRecording) {
        btn.classList.add('recording');
        btn.setAttribute('title', 'Listening... Click to stop');
      } else {
        btn.classList.remove('recording');
        btn.setAttribute('title', 'Click to speak');
      }
    });
  },

  speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[#*_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      const langMap = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', bn: 'bn-IN', ta: 'ta-IN', te: 'te-IN', gu: 'gu-IN', kn: 'kn-IN' };
      utterance.lang = langMap[window.App.currentLang] || 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
      App.showToast("Reading aloud...");
    }
  },

  async handleSend(textOverride) {
    const input = document.getElementById('chatInput');
    const text = (textOverride || (input ? input.value : '')).trim();
    if (!text) return;
    if (input) input.value = '';

    this.chatState.log.push({ type: 'user', text });
    this.renderChat();

    this.chatState.isProcessing = true;
    this.showTyping();

    try {
      const res = await API.sendChatMessage(
        text,
        this.chatState.intent,
        this.chatState.answers,
        this.chatState.questions
      );

      this.hideTyping();
      this.chatState.isProcessing = false;

      if (res.type === 'fallback') {
        this.chatState.log.push({ type: 'ai', text: res.message });
        if (res.suggestions) {
          this.chatState.log.push({
            type: 'suggestions',
            items: res.suggestions
          });
        }
      } else if (res.type === 'intent_detected') {
        this.chatState.intent = res.intent;
        this.chatState.intentLabel = res.intent_label;
        this.chatState.confidence = res.confidence;
        this.chatState.questions = res.questions;
        this.chatState.questionIndex = 0;
        this.chatState.totalQuestions = res.total_questions;

        this.chatState.log.push({
          type: 'system',
          text: `🎯 Intent Identified: ${res.intent_label} (${res.confidence}% confidence)`
        });
        this.chatState.log.push({ type: 'ai', text: res.initial_message });

        if (res.current_question) {
          this.askQuestion(res.current_question);
        }
      } else if (res.type === 'result') {
        this.chatState.result = res;
        this.chatState.log.push({
          type: 'ai',
          text: `✅ **Verified Match Found!** I have analyzed your profile against official guidelines for **${res.top_match.service.service_name}**.`
        });
        this.chatState.log.push({ type: 'result_card', data: res });
      }
    } catch (err) {
      this.hideTyping();
      this.chatState.isProcessing = false;
      this.chatState.log.push({
        type: 'ai',
        text: "I encountered an issue connecting to the verification engine. Please try again."
      });
    }

    this.renderChat();
    this.updateSidebar();
  },

  askQuestion(q) {
    this.chatState.currentQuestion = q;
    this.chatState.log.push({
      type: 'question',
      id: q.id,
      label: q.label,
      options: q.options
    });
  },

  async answerQuestion(questionId, value) {
    this.chatState.answers[questionId] = value;
    this.chatState.log.push({ type: 'user', text: value });
    this.chatState.questionIndex++;
    this.renderChat();

    this.showTyping();
    const remaining = this.chatState.questions.slice(this.chatState.questionIndex);

    if (remaining.length > 0) {
      setTimeout(() => {
        this.hideTyping();
        this.askQuestion(remaining[0]);
        this.renderChat();
        this.updateSidebar();
      }, 500);
    } else {
      // All answered, fetch grounded RAG match
      try {
        const res = await API.sendChatMessage(
          "CompleteProfileRetrieval",
          this.chatState.intent,
          this.chatState.answers,
          []
        );
        this.hideTyping();
        if (res.type === 'result') {
          this.chatState.result = res;
          this.chatState.log.push({
            type: 'ai',
            text: `✨ Analysis complete! Recommending **${res.top_match.service.service_name}** with a **${res.top_match.score}% match score**.`
          });
          this.chatState.log.push({ type: 'result_card', data: res });
        }
      } catch (err) {
        this.hideTyping();
        console.error(err);
      }
      this.renderChat();
      this.updateSidebar();
    }
  },

  showTyping() {
    const chatLog = document.getElementById('chatLog');
    if (!chatLog) return;
    const existing = document.getElementById('typingIndicator');
    if (!existing) {
      const bubble = document.createElement('div');
      bubble.id = 'typingIndicator';
      bubble.className = 'typing-bubble';
      bubble.innerHTML = '<span></span><span></span><span></span><span style="font-size:12px;color:var(--muted);margin-left:6px;">NagrikMitra AI is reasoning...</span>';
      chatLog.appendChild(bubble);
      this.scrollToBottom();
    }
  },

  hideTyping() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
  },

  scrollToBottom() {
    const el = document.getElementById('chatLog');
    if (el) el.scrollTop = el.scrollHeight;
  },

  reset() {
    this.chatState = {
      log: [],
      intent: null,
      intentLabel: null,
      confidence: 0,
      answers: {},
      questions: [],
      currentQuestion: null,
      questionIndex: 0,
      totalQuestions: 0,
      result: null,
      isProcessing: false,
      isListening: false
    };
    if (App.currentView === 'assistant') {
      App.render();
    }
  },

  renderChat() {
    const logEl = document.getElementById('chatLog');
    if (!logEl) return;

    if (this.chatState.log.length === 0) {
      logEl.innerHTML = `
        <div class="empty-state" style="padding: 40px 20px; text-align: center;">
          <div style="font-size: 40px; margin-bottom: 12px;">🏛️</div>
          <h3>How can NagrikMitra AI assist you today?</h3>
          <p style="max-width: 48ch; margin: 8px auto 20px;">
            Describe your problem in plain words, e.g. "I am a farmer looking for subsidy" or "I want to apply for student scholarship".
          </p>
          <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-sm btn-outline" onclick="Assistant.handleSend('I am a college student from Maharashtra seeking scholarship.')">🎓 Education Scholarship</button>
            <button class="btn btn-sm btn-outline" onclick="Assistant.handleSend('I am a farmer looking for income assistance.')">🌾 PM-KISAN Scheme</button>
            <button class="btn btn-sm btn-outline" onclick="Assistant.handleSend('I need cashless hospitalisation aid under Ayushman Bharat.')">🏥 Ayushman Bharat</button>
          </div>
        </div>
      `;
      return;
    }

    logEl.innerHTML = this.chatState.log.map(m => {
      if (m.type === 'user') {
        return `<div class="msg user">${m.text}</div>`;
      }
      if (m.type === 'system') {
        return `<div class="msg system">${m.text}</div>`;
      }
      if (m.type === 'ai') {
        return `
          <div class="msg ai">
            ${m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
            <div style="margin-top: 6px; text-align: right;">
              <button class="btn-ghost" style="padding: 2px 6px; font-size: 11px;" onclick="Assistant.speakText('${m.text.replace(/'/g, "\\'")}')">🔊 Read Aloud</button>
            </div>
          </div>
        `;
      }
      if (m.type === 'suggestions') {
        return `
          <div class="question-options-grid">
            ${m.items.map(item => `
              <button class="q-opt-btn" onclick="Assistant.handleSend('${item.replace(/'/g, "\\'")}')">💡 ${item}</button>
            `).join('')}
          </div>
        `;
      }
      if (m.type === 'question') {
        return `
          <div class="msg ai"><strong>${m.label}</strong></div>
          <div class="question-options-grid">
            ${m.options.map(opt => `
              <button class="q-opt-btn" onclick="Assistant.answerQuestion('${m.id}', '${opt.replace(/'/g, "\\'")}')">${opt}</button>
            `).join('')}
          </div>
        `;
      }
      if (m.type === 'result_card') {
        return this.renderResultCard(m.data);
      }
      return '';
    }).join('');

    this.scrollToBottom();
  },

  renderResultCard(res) {
    const top = res.top_match;
    const s = top.service;
    const token = res.token_id;

    return `
      <div class="card" style="margin: 12px 0; border: 1.5px solid var(--teal); box-shadow: var(--shadow-card);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--line); padding-bottom: 12px; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <span class="pill pill-muted mono">🎫 Token: <b>${token}</b></span>
          <span class="pill pill-teal">✓ Verified Government Source</span>
        </div>

        <div style="display: flex; gap: 18px; align-items: center; margin-bottom: 16px; flex-wrap: wrap;">
          <div class="match-ring" style="--pct: ${top.score}">
            <div class="inner">
              <b>${top.score}%</b>
              <span>MATCH</span>
            </div>
          </div>
          <div style="flex: 1; min-width: 240px;">
            <span class="kicker">${s.category}</span>
            <h2 style="font-size: 22px; margin-bottom: 4px;">${s.service_name}</h2>
            <p style="font-size: 13.5px; margin: 0;">${s.description}</p>
          </div>
        </div>

        <div class="why-grounded-box" style="margin-bottom: 18px;">
          <h4>🎯 Why this recommendation matches your profile:</h4>
          <ul class="checklist">
            ${top.grounded_reasons.map(r => `<li><span class="tick">✓</span> ${r}</li>`).join('')}
          </ul>
        </div>

        <div class="grid grid-2" style="margin-bottom: 18px;">
          <div>
            <h4 style="font-size: 14px; margin-bottom: 6px;">Eligibility Criteria</h4>
            <ul class="checklist">
              ${(s.eligibility || []).map(e => `<li><span class="tick">•</span> ${e}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h4 style="font-size: 14px; margin-bottom: 6px;">Required Documents</h4>
            <div class="doclist">
              ${(s.required_documents || []).map(d => `<span>📄 ${d}</span>`).join('')}
            </div>
          </div>
        </div>

        <div style="background: var(--paper); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; margin-bottom: 18px;">
          <h4 style="font-size: 14px; margin-bottom: 8px;">Action Plan: Step-by-Step Guidance</h4>
          <ol class="actionplan">
            ${top.action_plan.map(step => `
              <li>
                <span class="apnum">${step.step}</span>
                <div>
                  <h4 style="font-size: 14px;">${step.title}</h4>
                  <p style="font-size: 13px; margin: 0;">${step.details}</p>
                </div>
              </li>
            `).join('')}
          </ol>
        </div>

        <div style="display: flex; gap: 10px; justify-content: space-between; align-items: center; flex-wrap: wrap;">
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <a class="btn btn-primary" href="${s.official_url}" target="_blank" rel="noopener">
              Open Official Portal (${s.official_url.replace('https://', '')}) ↗
            </a>
            <button class="btn btn-outline" onclick="App.saveServiceDirect('${s.id}')">
              📌 Save to My Dashboard
            </button>
          </div>
          <button class="btn btn-outline" onclick="Assistant.printReceipt('${token}', '${s.service_name.replace(/'/g, "\\'")}', '${top.score}', '${s.official_url}')">
            🖨️ Print Token Receipt
          </button>
        </div>
      </div>
    `;
  },

  updateSidebar() {
    const intentEl = document.getElementById('sidebarIntent');
    const progressEl = document.getElementById('sidebarProgress');
    const qCountEl = document.getElementById('sidebarQCount');

    if (intentEl) {
      intentEl.innerHTML = this.chatState.intent ? `
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--teal);"></span>
          <strong>${this.chatState.intentLabel}</strong>
        </div>
        <div style="height: 6px; background: var(--paper); border-radius: 99px; overflow: hidden;">
          <div style="height: 100%; width: ${this.chatState.confidence}%; background: var(--teal);"></div>
        </div>
        <p style="font-size: 12px; margin-top: 4px; color: var(--muted);">Confidence: ${this.chatState.confidence}%</p>
      ` : `<p style="font-size: 13px; margin: 0;">Describe your situation to detect intent.</p>`;
    }

    if (qCountEl && progressEl) {
      const total = this.chatState.totalQuestions;
      const count = this.chatState.questionIndex;
      qCountEl.innerText = `${count} of ${total || '—'}`;
      const pct = total ? (count / total * 100) : 0;
      progressEl.style.width = `${pct}%`;
    }
  },

  printReceipt(token, serviceName, score, url) {
    const modalHtml = `
      <div class="modal-backdrop" id="receiptModal" onclick="if(event.target===this) this.remove()">
        <div class="modal-window" style="max-width: 500px; text-align: center;">
          <div class="flag-strip" style="margin-bottom: 12px;">
            <span style="background:#B5651D"></span><span style="background:#fff"></span><span style="background:#136C53"></span>
          </div>
          <h2 style="font-size: 20px; margin-bottom: 4px;">NagrikMitra AI — Citizen Advice Slip</h2>
          <p style="font-size: 12.5px; margin-bottom: 16px;">Government Services Verification & Recommendation System</p>
          
          <div style="background: var(--paper); border: 1.5px dashed var(--line); border-radius: 12px; padding: 20px; text-align: left; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 12px; color: var(--muted);">TOKEN NO:</span>
              <b class="mono" style="color: var(--ink); font-size: 15px;">${token}</b>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 12px; color: var(--muted);">DATE & TIME:</span>
              <span style="font-size: 12px;">${new Date().toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 12px; color: var(--muted);">MATCHED SCHEME:</span>
              <b style="font-size: 13px; text-align: right; max-width: 24ch;">${serviceName}</b>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 12px; color: var(--muted);">MATCH CONFIDENCE:</span>
              <span class="pill pill-teal" style="font-size: 11px;">${score}% High Match</span>
            </div>
            <div style="border-top: 1px solid var(--line); padding-top: 10px; margin-top: 10px;">
              <span style="font-size: 12px; color: var(--muted);">OFFICIAL APPLICATION PORTAL:</span><br/>
              <a href="${url}" target="_blank" style="font-size: 13px; font-weight: 600; color: var(--teal);">${url}</a>
            </div>
          </div>

          <div style="display: flex; gap: 10px; justify-content: center;">
            <button class="btn btn-primary" onclick="window.print()">🖨️ Print Document</button>
            <button class="btn btn-outline" onclick="document.getElementById('receiptModal').remove()">Close</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }
};

window.Assistant = Assistant;
