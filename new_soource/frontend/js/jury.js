/* =========================================================================
   NagrikMitra AI — Jury Showcase Hub & Presentation Mode
   ========================================================================= */

const Jury = {
  qaList: [
    {
      q: "What core problem does NagrikMitra AI solve?",
      a: "Citizens often don't know which government scheme applies to them, whether they're eligible, what documents they need, or where to apply. Hundreds of portals exist (UMANG, MyScheme, NSP), but all require the citizen to already know the scheme's name. NagrikMitra AI turns a plain-language problem statement ('I need money for college') into a verified government service with eligibility, checklist, action plan, and direct link."
    },
    {
      q: "How does your RAG-grounded architecture prevent hallucinations?",
      a: "The assistant strictly recommends services from our verified SQLite database. It never generates scheme names, benefits, or official URLs out of thin air. Every response is verified against the database record, tagged with an official .gov.in source, given a confidence rating, and timestamped with a traceable Citizen Token No."
    },
    {
      q: "How does the intent classification and follow-up engine work?",
      a: "When a citizen types or speaks a problem, the intent detector maps the query across 15 life-situation domains (Education, Agriculture, Healthcare, Pensions, etc.). It then triggers a targeted follow-up questionnaire that asks only the minimum necessary questions (State, Income, Education level) to retrieve and rank exact matching schemes."
    },
    {
      q: "How does this integrate with official government platforms?",
      a: "NagrikMitra AI is designed as a conversational discovery layer ON TOP of existing platforms (UMANG, DigiLocker, CPGRAMS, MyScheme, NSP) — not a replacement. Once a citizen's eligibility is determined, they are routed directly to the verified official portal to complete their legal transaction."
    },
    {
      q: "How is citizen privacy protected?",
      a: "Data minimization is built into the core. Demographics are stored only in local session context or encrypted SQLite instances with no unnecessary third-party data tracking. Tokens are generated pseudo-anonymously."
    },
    {
      q: "What is your upgrade path to full enterprise production?",
      a: "Our modular Python FastAPI backend with SQLite directly ports to PostgreSQL and enterprise vector databases (e.g. Qdrant / pgvector) for hybrid semantic search. Official APIs (like UMANG / API Setu / CPGRAMS) can plug into our retrieval handler for real-time tracking."
    }
  ],

  renderView() {
    return `
      <section class="section">
        <div class="wrap" style="max-width: 960px;">
          <div class="section-head">
            <div>
              <span class="kicker">Hackathon Presentation & Jury Hub</span>
              <h2>NagrikMitra AI — Project Showcase</h2>
              <p>Everything you need for evaluating the product vision, RAG grounding, anti-hallucination trust model, and 1-click live demo.</p>
            </div>
          </div>

          <!-- 1-Click Live Simulation Card -->
          <div class="card" style="background: linear-gradient(135deg, rgba(15,118,110,0.08) 0%, rgba(217,119,6,0.08) 100%); border: 1.5px solid var(--teal); margin-bottom: 28px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
              <div>
                <span class="pill pill-teal" style="margin-bottom: 6px;">⚡ 1-Click Evaluator Demo</span>
                <h3 style="font-size: 19px; margin-bottom: 4px;">Run End-to-End Reference Scenario</h3>
                <p style="font-size: 13.5px; margin: 0; max-width: 55ch;">
                  Simulates a student from Maharashtra seeking education scholarships, automatically answering follow-ups and delivering a grounded action plan with token receipt.
                </p>
              </div>
              <button class="btn btn-saffron" onclick="Jury.startLiveSimulation()">
                ▶ Launch Live Simulation
              </button>
            </div>
          </div>

          <!-- Architecture & Trust Pillars -->
          <div class="grid grid-3" style="margin-bottom: 28px;">
            <div class="card">
              <h4 style="font-size: 15px; color: var(--teal); margin-bottom: 8px;">1. Plain-Language Input</h4>
              <p style="font-size: 13px; margin: 0;">Speech and text input in 8 Indian languages. No prior scheme name knowledge required.</p>
            </div>
            <div class="card">
              <h4 style="font-size: 15px; color: var(--saffron); margin-bottom: 8px;">2. Grounded RAG Matching</h4>
              <p style="font-size: 13px; margin: 0;">Retrieve first, generate second. Strictly sourced to verified official gazettes and .gov.in portals.</p>
            </div>
            <div class="card">
              <h4 style="font-size: 15px; color: var(--blue); margin-bottom: 8px;">3. Traceable Citizen Token</h4>
              <p style="font-size: 13px; margin: 0;">Printable advice receipt with verified checklist, timestamp, and grievance escalation path.</p>
            </div>
          </div>

          <!-- Presentation Q&A Accordion -->
          <div class="card">
            <h3 style="font-size: 17px; margin-bottom: 16px;">💬 Jury & Technical Evaluation Q&A</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${this.qaList.map((qa, i) => `
                <details style="background: var(--paper); border: 1px solid var(--line); border-radius: 10px; padding: 12px 16px; cursor: pointer;">
                  <summary style="font-weight: 600; font-size: 14.5px; color: var(--ink); outline: none;">
                    ${i + 1}. ${qa.q}
                  </summary>
                  <p style="font-size: 13.5px; margin: 10px 0 0 0; color: var(--muted); line-height: 1.6;">
                    ${qa.a}
                  </p>
                </details>
              `).join('')}
            </div>
          </div>
        </div>
      </section>
    `;
  },

  async startLiveSimulation() {
    App.navigate('assistant');
    Assistant.reset();
    App.showToast("Starting live jury simulation...");

    setTimeout(() => {
      Assistant.handleSend("I am a 22-year-old undergraduate student from Maharashtra and I need financial aid for my college tuition fees.");
    }, 400);

    setTimeout(() => {
      if (Assistant.chatState.questions.length > 0) {
        Assistant.answerQuestion('state', 'Maharashtra');
      }
    }, 1400);

    setTimeout(() => {
      if (Assistant.chatState.questions.length > 1) {
        Assistant.answerQuestion('level', 'Undergraduate (Degree / Diploma)');
      }
    }, 2400);

    setTimeout(() => {
      if (Assistant.chatState.questions.length > 2) {
        Assistant.answerQuestion('income', '₹1.5 Lakh – ₹2.5 Lakh');
      }
    }, 3400);
  }
};

window.Jury = Jury;
