/* =========================================================================
   NagrikMitra AI — Main Application Orchestrator & State Manager
   ========================================================================= */

const App = {
  currentView: 'home',
  currentLang: localStorage.getItem('nagrikmitra_lang') || 'en',
  theme: localStorage.getItem('nagrikmitra_theme') || 'light',
  servicesCache: [],

  init() {
    document.documentElement.setAttribute('data-theme', this.theme);
    this.render();
    Assistant.initVoice();
    this.preloadServices();
  },

  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem('nagrikmitra_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.render();
  },

  setLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('nagrikmitra_lang', lang);
    this.render();
    this.showToast(`Language switched to ${lang.toUpperCase()}`);
  },

  navigate(view) {
    this.currentView = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();

    // Trigger specific view loaders
    if (view === 'services') {
      Directory.loadServices();
    } else if (view === 'dashboard') {
      Dashboard.loadDashboardData();
    } else if (view === 'admin') {
      Admin.loadAdminData();
    } else if (view === 'eligibility') {
      EligibilityWizard.calculate();
    }
  },

  async preloadServices() {
    try {
      const res = await API.getServices();
      this.servicesCache = res.services || [];
      window.LOCAL_SERVICES = this.servicesCache;
      if (this.currentView === 'home') {
        const statEl = document.getElementById('heroStatServices');
        if (statEl) statEl.innerText = `${this.servicesCache.length}+`;
      }
    } catch (err) {
      console.warn("Could not preload services:", err);
    }
  },

  render() {
    const root = document.getElementById('app');
    if (!root) return;

    root.innerHTML = `
      ${this.renderTopbar()}
      ${this.renderNavbar()}
      <main id="mainContent">
        ${this.renderCurrentView()}
      </main>
      ${this.renderFooter()}
      <div id="toastContainer" class="toast-container"></div>
    `;

    // Re-bind chat log if in assistant view
    if (this.currentView === 'assistant') {
      Assistant.renderChat();
      Assistant.updateSidebar();
    }
  },

  renderTopbar() {
    return `
      <div class="topbar">
        <div style="display: flex; align-items: center;">
          <span class="flag-strip">
            <span style="background:#B5651D"></span>
            <span style="background:#fff"></span>
            <span style="background:#136C53"></span>
          </span>
          <span>Government of India — National Citizen AI Discovery Portal</span>
        </div>
        <div class="topbar-right">
          <span class="status-indicator">Backend Active</span>
          <select class="lang-select" onchange="App.setLanguage(this.value)">
            <option value="en" ${this.currentLang==='en'?'selected':''}>English</option>
            <option value="hi" ${this.currentLang==='hi'?'selected':''}>हिन्दी (Hindi)</option>
            <option value="mr" ${this.currentLang==='mr'?'selected':''}>मराठी (Marathi)</option>
            <option value="bn" ${this.currentLang==='bn'?'selected':''}>বাংলা (Bengali)</option>
            <option value="ta" ${this.currentLang==='ta'?'selected':''}>தமிழ் (Tamil)</option>
            <option value="te" ${this.currentLang==='te'?'selected':''}>తెలుగు (Telugu)</option>
            <option value="gu" ${this.currentLang==='gu'?'selected':''}>ગુજરાતી (Gujarati)</option>
            <option value="kn" ${this.currentLang==='kn'?'selected':''}>ಕನ್ನಡ (Kannada)</option>
          </select>
          <button class="theme-toggle" onclick="App.setTheme(App.theme === 'light' ? 'dark' : 'light')" title="Toggle Dark/Light Mode">
            ${this.theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </div>
    `;
  },

  renderNavbar() {
    const t = I18N[this.currentLang] || I18N.en;
    const links = [
      ['home', t.homeNav || 'Home'],
      ['assistant', t.assistantNav || 'AI Assistant'],
      ['eligibility', t.eligibilityNav || 'Eligibility Wizard'],
      ['services', t.servicesNav || 'All Services'],
      ['dashboard', t.dashboardNav || 'My Dashboard'],
      ['grievance', t.grievanceNav || 'CPGRAMS Grievance'],
      ['platforms', t.platformsNav || 'Official Platforms'],
      ['jury', t.juryNav || 'Jury / About']
    ];

    return `
      <nav class="mainnav">
        <div class="nav-inner">
          <button class="brand" onclick="App.navigate('home')">
            <span class="brand-mark">NM</span>
            <span class="brand-text">
              <span class="name">NagrikMitra AI</span><br/>
              <span class="tag">${t.tagline}</span>
            </span>
          </button>
          <div class="navlinks">
            ${links.map(([v, l]) => `
              <button class="${this.currentView === v ? 'active' : ''}" onclick="App.navigate('${v}')">${l}</button>
            `).join('')}
            <button class="${this.currentView === 'admin' ? 'active' : ''}" onclick="App.navigate('admin')">${t.adminNav || 'Admin'}</button>
          </div>
        </div>
      </nav>
    `;
  },

  renderCurrentView() {
    switch (this.currentView) {
      case 'home': return this.renderHomeView();
      case 'assistant': return this.renderAssistantView();
      case 'eligibility': return EligibilityWizard.renderView();
      case 'services': return Directory.renderView();
      case 'dashboard': return Dashboard.renderView();
      case 'grievance': return Grievance.renderView();
      case 'platforms': return this.renderPlatformsView();
      case 'admin': return Admin.renderView();
      case 'jury': return Jury.renderView();
      default: return this.renderHomeView();
    }
  },

  renderHomeView() {
    const t = I18N[this.currentLang] || I18N.en;
    return `
      <section class="hero">
        <div class="wrap hero-inner">
          <span class="eyebrow">✦ AI-Powered Discovery · Grounded Government Knowledge Base</span>
          <h1>${t.heroTitle}</h1>
          <p class="sub">${t.heroSub}</p>

          <!-- Conversational Prompt Box with Voice -->
          <div class="ask-box-wrapper">
            <textarea id="heroInput" placeholder="${t.placeholder}" onkeydown="if(event.key==='Enter' && !event.shiftKey){ event.preventDefault(); App.startAssistantWith(this.value); }"></textarea>
            <div class="ask-box-actions">
              <button class="mic-btn" onclick="Assistant.toggleVoice()" title="Click to speak your problem">
                🎤
              </button>
              <button class="btn btn-saffron" onclick="App.startAssistantWith(document.getElementById('heroInput').value)">
                ${t.findService} →
              </button>
            </div>
          </div>

          <!-- Demo Query Chips -->
          <div class="demo-chips">
            <span style="font-size: 12px; color: #94a3b8; font-weight: 600;">⚡ Quick Scenarios:</span>
            <button class="demo-chip" onclick="App.startAssistantWith('I am a college student from Maharashtra seeking scholarship.')">
              🎓 Student Scholarship
            </button>
            <button class="demo-chip" onclick="App.startAssistantWith('I am a small farmer needing income assistance and crop loss protection.')">
              🌾 Farmer Assistance (PM-KISAN)
            </button>
            <button class="demo-chip" onclick="App.startAssistantWith('I need ₹5 Lakh cashless health cover under Ayushman Bharat.')">
              🏥 Hospital Health Insurance
            </button>
            <button class="demo-chip" onclick="App.startAssistantWith('I am a retired person wanting old age pension.')">
              👵 Senior Citizen Pension
            </button>
            <button class="demo-chip" onclick="App.startAssistantWith('I am an urban street vendor looking for a working capital loan.')">
              🏪 Street Vendor Micro Loan
            </button>
          </div>

          <!-- Traceable Token Motif -->
          <div style="margin-top: 24px; display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.06); border: 1px dashed rgba(255,255,255,0.25); border-radius: 10px; padding: 8px 14px; font-size: 12.5px; color: #e2e8f0;">
            🎫 ${t.tokenMotif}
          </div>

          <!-- Hero Stats -->
          <div class="hero-stats">
            <div class="stat"><b id="heroStatServices">${this.servicesCache.length ? this.servicesCache.length + '+' : '30+'}</b><span>${t.servicesIndexed}</span></div>
            <div class="stat"><b>15</b><span>${t.categoriesCount}</span></div>
            <div class="stat"><b>100%</b><span>${t.verifiedPortals}</span></div>
          </div>
        </div>
      </section>

      <!-- Popular Schemes Section -->
      <section class="section">
        <div class="wrap">
          <div class="section-head">
            <div>
              <span class="kicker">${t.popularKicker}</span>
              <h2>${t.popularTitle}</h2>
            </div>
            <button class="btn btn-outline" onclick="App.navigate('services')">${t.browseAll} (${this.servicesCache.length || 'All'}) →</button>
          </div>
          <div class="grid grid-4">
            ${(this.servicesCache.slice(0, 8)).map(s => `
              <div class="card card-hover" onclick="App.openServiceModal('${s.id}')" style="cursor: pointer;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                  <span class="pill pill-muted" style="font-size: 11px;">${s.category}</span>
                  <span class="pill pill-${s.confidence==='High'?'teal':s.confidence==='Medium'?'saffron':'red'}">${s.confidence}</span>
                </div>
                <h3 style="font-size: 16px; margin-bottom: 6px;">${s.service_name}</h3>
                <p style="font-size: 12.5px; margin: 0; color: var(--muted);">${s.description.slice(0, 85)}...</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="section tight" style="background: var(--paper-2); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);">
        <div class="wrap">
          <div class="section-head">
            <div>
              <span class="kicker">${t.howItWorksKicker}</span>
              <h2>${t.howItWorksTitle}</h2>
            </div>
          </div>
          <div class="grid grid-4" style="gap: 24px;">
            <div>
              <span class="mono" style="font-size: 14px; font-weight: 700; color: var(--saffron);">01</span>
              <h4 style="font-size: 16px; margin: 6px 0;">${t.step1Title}</h4>
              <p style="font-size: 13px;">${t.step1Desc}</p>
            </div>
            <div>
              <span class="mono" style="font-size: 14px; font-weight: 700; color: var(--saffron);">02</span>
              <h4 style="font-size: 16px; margin: 6px 0;">${t.step2Title}</h4>
              <p style="font-size: 13px;">${t.step2Desc}</p>
            </div>
            <div>
              <span class="mono" style="font-size: 14px; font-weight: 700; color: var(--saffron);">03</span>
              <h4 style="font-size: 16px; margin: 6px 0;">${t.step3Title}</h4>
              <p style="font-size: 13px;">${t.step3Desc}</p>
            </div>
            <div>
              <span class="mono" style="font-size: 14px; font-weight: 700; color: var(--saffron);">04</span>
              <h4 style="font-size: 16px; margin: 6px 0;">${t.step4Title}</h4>
              <p style="font-size: 13px;">${t.step4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Official Platforms Banner -->
      <section class="section" style="background: #090f1a; color: #fff;">
        <div class="wrap">
          <div class="section-head">
            <div>
              <span class="kicker" style="color: #fde68a;">Official Ecosystem</span>
              <h2 style="color: #fff;">Integrated Government Portals</h2>
            </div>
            <button class="btn btn-outline" style="background: transparent; color: #fff; border-color: rgba(255,255,255,0.3);" onclick="App.navigate('platforms')">
              View All 6 Portals →
            </button>
          </div>
          <div class="grid grid-3">
            <div class="card" style="background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.12);">
              <h3 style="color: #fff; font-size: 17px;">UMANG</h3>
              <p style="font-size: 13px; color: #cbd5e1;">All-in-one app for 1,500+ central & state citizen services.</p>
              <a class="btn btn-sm btn-primary" href="https://web.umang.gov.in" target="_blank" rel="noopener">Open UMANG ↗</a>
            </div>
            <div class="card" style="background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.12);">
              <h3 style="color: #fff; font-size: 17px;">DigiLocker</h3>
              <p style="font-size: 13px; color: #cbd5e1;">Legally valid digital wallet with 5.6B+ verified documents.</p>
              <a class="btn btn-sm btn-primary" href="https://www.digilocker.gov.in" target="_blank" rel="noopener">Open DigiLocker ↗</a>
            </div>
            <div class="card" style="background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.12);">
              <h3 style="color: #fff; font-size: 17px;">CPGRAMS</h3>
              <p style="font-size: 13px; color: #cbd5e1;">Official 24x7 public grievance lodging and escalation portal.</p>
              <a class="btn btn-sm btn-primary" href="https://pgportal.gov.in" target="_blank" rel="noopener">Open CPGRAMS ↗</a>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  renderAssistantView() {
    return `
      <section class="section">
        <div class="wrap">
          <div class="section-head">
            <div>
              <span class="kicker">Conversational Gov-AI</span>
              <h2>NagrikMitra AI Citizen Assistant</h2>
              <p>Type or speak your need in your mother tongue — NagrikMitra AI will pinpoint the right scheme and lay out your step-by-step verified action plan.</p>
            </div>
            <button class="btn btn-outline btn-sm" onclick="Assistant.reset()">↺ Start New Conversation</button>
          </div>

          <div class="assistant-shell">
            <!-- Chat Panel -->
            <div class="chat-panel">
              <div class="chat-header">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="status-indicator">AI Assistant Active</span>
                </div>
                <button class="btn-ghost" style="font-size: 12px;" onclick="Assistant.reset()">Clear Chat</button>
              </div>

              <div class="chat-log" id="chatLog"></div>

              <form class="chat-input-row" onsubmit="event.preventDefault(); Assistant.handleSend();">
                <input id="chatInput" type="text" placeholder="Describe your situation or answer the question above..." aria-label="Chat input"/>
                <button type="button" class="mic-btn" onclick="Assistant.toggleVoice()" title="Click to speak">
                  🎤
                </button>
                <button type="submit" class="btn btn-primary">Send →</button>
              </form>
            </div>

            <!-- Sidebar Progress -->
            <div class="side-panel">
              <div class="card" style="margin-bottom: 16px;">
                <h3 style="font-size: 15px; margin-bottom: 8px;">Identified Intent</h3>
                <div id="sidebarIntent">
                  <p style="font-size: 13px; margin: 0;">Describe your situation to detect intent.</p>
                </div>
              </div>

              <div class="card" style="margin-bottom: 16px;">
                <h3 style="font-size: 15px; margin-bottom: 6px;">Questions Progress</h3>
                <p id="sidebarQCount" style="font-size: 13px; margin-bottom: 6px;">0 of —</p>
                <div style="height: 6px; background: var(--paper); border-radius: 99px; overflow: hidden;">
                  <div id="sidebarProgress" style="height: 100%; width: 0%; background: var(--teal); transition: width 0.3s ease;"></div>
                </div>
              </div>

              <div class="card">
                <h3 style="font-size: 15px; margin-bottom: 8px;">⚡ Quick Test Prompts</h3>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  <button class="btn btn-sm btn-outline" style="text-align: left; justify-content: flex-start;" onclick="Assistant.handleSend('I am an engineering student needing financial scholarship.')">
                    ▶ Student Scholarship
                  </button>
                  <button class="btn btn-sm btn-outline" style="text-align: left; justify-content: flex-start;" onclick="Assistant.handleSend('I am a farmer looking for income assistance.')">
                    ▶ PM-KISAN Scheme
                  </button>
                  <button class="btn btn-sm btn-outline" style="text-align: left; justify-content: flex-start;" onclick="Assistant.handleSend('I need to lodge a complaint for a delayed government service.')">
                    ▶ Delayed Grievance
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  renderPlatformsView() {
    return `
      <section class="section">
        <div class="wrap">
          <div class="section-head">
            <div>
              <span class="kicker">Official Ecosystem</span>
              <h2>Trusted Government Single-Window Platforms</h2>
              <p>Direct links to statutory government portals authorized by the Government of India.</p>
            </div>
          </div>

          <div class="grid grid-3">
            <div class="card card-hover">
              <span class="kicker">Ministry of Electronics & IT</span>
              <h3 style="font-size: 18px; margin: 4px 0;">UMANG</h3>
              <p style="font-size: 13px; margin-bottom: 16px;">Unified Mobile App providing 1,500+ central and state services including PF passbook, bills, and certificate downloads.</p>
              <a class="btn btn-primary btn-sm" href="https://web.umang.gov.in" target="_blank" rel="noopener">Open UMANG ↗</a>
            </div>
            <div class="card card-hover">
              <span class="kicker">Ministry of Electronics & IT</span>
              <h3 style="font-size: 18px; margin: 4px 0;">DigiLocker</h3>
              <p style="font-size: 13px; margin-bottom: 16px;">National digital document wallet holding legally valid digital driving licences, marksheets, and identity proofs under IT Act.</p>
              <a class="btn btn-primary btn-sm" href="https://www.digilocker.gov.in" target="_blank" rel="noopener">Open DigiLocker ↗</a>
            </div>
            <div class="card card-hover">
              <span class="kicker">NeGD / Digital India</span>
              <h3 style="font-size: 18px; margin: 4px 0;">MyScheme</h3>
              <p style="font-size: 13px; margin-bottom: 16px;">National scheme discovery platform indexing 1,000+ government welfare programmes across all state and central ministries.</p>
              <a class="btn btn-primary btn-sm" href="https://www.myscheme.gov.in" target="_blank" rel="noopener">Open MyScheme ↗</a>
            </div>
            <div class="card card-hover">
              <span class="kicker">NIC</span>
              <h3 style="font-size: 18px; margin: 4px 0;">India.gov.in</h3>
              <p style="font-size: 13px; margin-bottom: 16px;">The umbrella National Portal of India indexing every official government website, gazette, and administrative department.</p>
              <a class="btn btn-primary btn-sm" href="https://www.india.gov.in" target="_blank" rel="noopener">Open India.gov.in ↗</a>
            </div>
            <div class="card card-hover">
              <span class="kicker">DARPG</span>
              <h3 style="font-size: 18px; margin: 4px 0;">CPGRAMS</h3>
              <p style="font-size: 13px; margin-bottom: 16px;">Centralised Public Grievance Redress and Monitoring System for mandatory 30-day resolution of citizen complaints.</p>
              <a class="btn btn-primary btn-sm" href="https://pgportal.gov.in" target="_blank" rel="noopener">Open CPGRAMS ↗</a>
            </div>
            <div class="card card-hover">
              <span class="kicker">Ministry of Education</span>
              <h3 style="font-size: 18px; margin: 4px 0;">National Scholarship Portal</h3>
              <p style="font-size: 13px; margin-bottom: 16px;">Common electronic scholarship portal for Central, UGC, AICTE, and State Government schemes with direct DBT disbursement.</p>
              <a class="btn btn-primary btn-sm" href="https://scholarships.gov.in" target="_blank" rel="noopener">Open NSP ↗</a>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  renderFooter() {
    return `
      <footer>
        <div class="wrap">
          <div class="foot-grid">
            <div>
              <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                <span class="brand-mark" style="width:34px;height:34px;font-size:15px;">NM</span>
                <strong style="color:#fff; font-size:16px;">NagrikMitra AI</strong>
              </div>
              <p style="font-size:13px; line-height:1.6;">
                An AI-guided citizen services assistant turning natural language into verified government welfare access, eligibility checks, and official portal guidance.
              </p>
            </div>
            <div>
              <h4>Core Services</h4>
              <p><a href="#" onclick="App.navigate('assistant'); return false;">AI Conversational Bot</a></p>
              <p><a href="#" onclick="App.navigate('eligibility'); return false;">Eligibility Wizard</a></p>
              <p><a href="#" onclick="App.navigate('services'); return false;">All Schemes Directory</a></p>
            </div>
            <div>
              <h4>Citizen Tools</h4>
              <p><a href="#" onclick="App.navigate('dashboard'); return false;">My Dashboard & Locker</a></p>
              <p><a href="#" onclick="App.navigate('grievance'); return false;">CPGRAMS Grievance</a></p>
              <p><a href="#" onclick="App.navigate('platforms'); return false;">Official Gov Portals</a></p>
            </div>
            <div>
              <h4>Evaluation & Admin</h4>
              <p><a href="#" onclick="App.navigate('jury'); return false;">Jury Showcase & Demo</a></p>
              <p><a href="#" onclick="App.navigate('admin'); return false;">Admin Data Console</a></p>
            </div>
          </div>

          <div class="disclaimer-box">
            <strong>Official Notice & Disclaimer:</strong> NagrikMitra AI is an AI-powered discovery assistant designed to empower Indian citizens. While all information is grounded in official government gazettes, citizens must verify guidelines and submit formal applications directly on the authorized .gov.in / nic.in portals linked throughout this portal.
          </div>
        </div>
      </footer>
    `;
  },

  startAssistantWith(text) {
    this.navigate('assistant');
    if (text && text.trim()) {
      setTimeout(() => {
        Assistant.handleSend(text.trim());
      }, 100);
    }
  },

  async openServiceModal(id) {
    let s = this.servicesCache.find(x => x.id === id);
    if (!s) {
      try {
        s = await API.getService(id);
      } catch (e) {
        console.error(e);
        return;
      }
    }
    if (!s) return;

    const modalHtml = `
      <div class="modal-backdrop" id="svcModal" onclick="if(event.target===this) this.remove()">
        <div class="modal-window">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
            <div>
              <span class="pill pill-muted" style="margin-bottom: 6px;">${s.category}</span>
              <h2 style="font-size: 22px; margin-bottom: 4px;">${s.service_name}</h2>
              <p style="font-size: 12.5px; color: var(--muted); margin: 0;">🏛️ ${s.ministry || s.source_name}</p>
            </div>
            <button class="btn btn-ghost" onclick="document.getElementById('svcModal').remove()">✕</button>
          </div>

          <p style="font-size: 14px; margin-bottom: 20px;">${s.description}</p>

          <div class="grid grid-2" style="margin-bottom: 20px;">
            <div style="background: var(--paper); padding: 14px; border-radius: 12px;">
              <h4 style="font-size: 14px; margin-bottom: 8px;">Eligibility Criteria</h4>
              <ul class="checklist">
                ${(s.eligibility || []).map(e => `<li><span class="tick">✓</span> ${e}</li>`).join('')}
              </ul>
            </div>
            <div style="background: var(--paper); padding: 14px; border-radius: 12px;">
              <h4 style="font-size: 14px; margin-bottom: 8px;">Required Documents</h4>
              <div class="doclist">
                ${(s.required_documents || []).map(d => `<span>📄 ${d}</span>`).join('')}
              </div>
            </div>
          </div>

          <div style="background: var(--teal-bg); border: 1px solid var(--teal-border); border-radius: 12px; padding: 14px 18px; margin-bottom: 20px;">
            <h4 style="color: var(--teal); font-size: 14px; margin-bottom: 8px;">Application Steps</h4>
            <ol style="margin: 0 0 0 16px; padding: 0; font-size: 13px; color: var(--ink);">
              ${(s.application_steps || []).map(step => `<li style="margin-bottom: 4px;">${step}</li>`).join('')}
            </ol>
          </div>

          <div style="display: flex; gap: 10px; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 16px; flex-wrap: wrap;">
            <span style="font-size: 12px; color: var(--muted);">Last verified: ${s.last_verified}</span>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-outline" onclick="App.saveServiceDirect('${s.id}')">📌 Save to Tracker</button>
              <a class="btn btn-primary" href="${s.official_url}" target="_blank" rel="noopener">Open Official Website ↗</a>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  async saveServiceDirect(serviceId) {
    try {
      await API.saveService(serviceId);
      this.showToast("✓ Scheme saved to your Citizen Dashboard!");
    } catch (err) {
      console.error(err);
    }
  },

  showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
};

window.App = App;

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
