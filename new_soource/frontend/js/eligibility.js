/* =========================================================================
   NagrikMitra AI — Multi-Factor Eligibility Calculator & Wizard
   ========================================================================= */

const EligibilityWizard = {
  profile: {
    age: 24,
    gender: "Male",
    state: "Maharashtra",
    caste_category: "General / OBC",
    education: "Undergraduate",
    occupation: "Student",
    income: "₹1.5 Lakh – ₹2.5 Lakh",
    land_holding: "None",
    disability_status: "No"
  },

  renderView() {
    return `
      <section class="section">
        <div class="wrap">
          <div class="section-head">
            <div>
              <span class="kicker">Smart Qualification Engine</span>
              <h2>Citizen Eligibility Assessment Wizard</h2>
              <p style="margin-top: 4px;">Fill in your demographic & socioeconomic profile once to calculate qualification scores across all 25+ government schemes simultaneously.</p>
            </div>
          </div>

          <div class="assistant-shell" style="grid-template-columns: 360px 1fr;">
            <!-- Profile Form Panel -->
            <div class="card" style="position: sticky; top: 80px;">
              <h3 style="font-size: 16px; margin-bottom: 16px; border-bottom: 1px solid var(--line); padding-bottom: 10px;">
                👤 Your Demographic Profile
              </h3>

              <div class="field-row">
                <label>Age</label>
                <input type="number" id="ew_age" value="${this.profile.age}" min="1" max="100" onchange="EligibilityWizard.updateField('age', parseInt(this.value))"/>
              </div>

              <div class="grid grid-2" style="gap: 10px;">
                <div class="field-row">
                  <label>Gender</label>
                  <select id="ew_gender" onchange="EligibilityWizard.updateField('gender', this.value)">
                    <option ${this.profile.gender==='Male'?'selected':''}>Male</option>
                    <option ${this.profile.gender==='Female'?'selected':''}>Female</option>
                    <option ${this.profile.gender==='Transgender'?'selected':''}>Transgender</option>
                  </select>
                </div>
                <div class="field-row">
                  <label>State of Residence</label>
                  <select id="ew_state" onchange="EligibilityWizard.updateField('state', this.value)">
                    <option ${this.profile.state==='Maharashtra'?'selected':''}>Maharashtra</option>
                    <option ${this.profile.state==='Delhi'?'selected':''}>Delhi</option>
                    <option ${this.profile.state==='Uttar Pradesh'?'selected':''}>Uttar Pradesh</option>
                    <option ${this.profile.state==='Karnataka'?'selected':''}>Karnataka</option>
                    <option ${this.profile.state==='Tamil Nadu'?'selected':''}>Tamil Nadu</option>
                    <option ${this.profile.state==='West Bengal'?'selected':''}>West Bengal</option>
                    <option ${this.profile.state==='Gujarat'?'selected':''}>Gujarat</option>
                    <option ${this.profile.state==='All India / Other'?'selected':''}>All India / Other</option>
                  </select>
                </div>
              </div>

              <div class="field-row">
                <label>Primary Occupation / Status</label>
                <select id="ew_occ" onchange="EligibilityWizard.updateField('occupation', this.value)">
                  <option ${this.profile.occupation==='Student'?'selected':''}>Student</option>
                  <option ${this.profile.occupation==='Farmer'?'selected':''}>Farmer (Agriculture)</option>
                  <option ${this.profile.occupation==='Street Vendor / Daily Wage'?'selected':''}>Street Vendor / Daily Wage</option>
                  <option ${this.profile.occupation==='Salaried Employee'?'selected':''}>Salaried Employee</option>
                  <option ${this.profile.occupation==='Business / MSME Owner'?'selected':''}>Business / MSME Owner</option>
                  <option ${this.profile.occupation==='Unemployed / Homemaker'?'selected':''}>Unemployed / Homemaker</option>
                  <option ${this.profile.occupation==='Senior Citizen'?'selected':''}>Senior Citizen (Retired)</option>
                </select>
              </div>

              <div class="field-row">
                <label>Annual Family Income</label>
                <select id="ew_income" onchange="EligibilityWizard.updateField('income', this.value)">
                  <option ${this.profile.income==='Below ₹1.5 Lakh'?'selected':''}>Below ₹1.5 Lakh (BPL/EWS)</option>
                  <option ${this.profile.income==='₹1.5 Lakh – ₹2.5 Lakh'?'selected':''}>₹1.5 Lakh – ₹2.5 Lakh</option>
                  <option ${this.profile.income==='₹2.5 Lakh – ₹6 Lakh'?'selected':''}>₹2.5 Lakh – ₹6 Lakh</option>
                  <option ${this.profile.income==='Above ₹6 Lakh'?'selected':''}>Above ₹6 Lakh</option>
                </select>
              </div>

              <div class="field-row">
                <label>Landholding Status</label>
                <select id="ew_land" onchange="EligibilityWizard.updateField('land_holding', this.value)">
                  <option ${this.profile.land_holding==='None'?'selected':''}>None (Non-Agricultural / Landless)</option>
                  <option ${this.profile.land_holding==='Own Cultivable Land'?'selected':''}>Own Cultivable Land</option>
                  <option ${this.profile.land_holding==='Tenant Farmer'?'selected':''}>Tenant Farmer</option>
                </select>
              </div>

              <button class="btn btn-primary btn-block" style="margin-top: 10px;" onclick="EligibilityWizard.calculate()">
                ⚡ Recalculate Matched Schemes
              </button>
            </div>

            <!-- Results Output Panel -->
            <div>
              <div id="ew_results_container">
                <div style="text-align: center; padding: 40px;">
                  <div class="typing-bubble"><span></span><span></span><span></span></div>
                  <p style="margin-top: 10px;">Evaluating eligibility rules against official gazettes...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  updateField(field, val) {
    this.profile[field] = val;
    this.calculate();
  },

  async calculate() {
    const container = document.getElementById('ew_results_container');
    if (!container) return;

    try {
      const res = await API.evaluateEligibility(this.profile);
      const items = res.recommendations || [];

      container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background: var(--paper); border: 1px solid var(--line); border-radius: 12px; padding: 12px 18px;">
          <div>
            <strong>Evaluated 22 Official Schemes</strong> — <span style="color: var(--teal); font-weight: 600;">${res.qualifying_count} High-Qualification Matches</span>
          </div>
          <span class="pill pill-teal">Algorithm Grounded</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${items.map(item => this.renderEligibilityCard(item)).join('')}
        </div>
      `;
    } catch (err) {
      console.error(err);
      container.innerHTML = `<p style="color: var(--red);">Unable to calculate eligibility right now.</p>`;
    }
  },

  renderEligibilityCard(item) {
    const s = item.service;
    const score = item.match_percentage;
    const reasons = item.qualification_reasons;

    return `
      <div class="card card-hover" style="border-left: 4px solid ${score >= 75 ? 'var(--teal)' : score >= 50 ? 'var(--saffron)' : 'var(--muted)'};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 240px;">
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px;">
              <span class="pill pill-muted" style="font-size: 11px;">${s.category}</span>
              <span class="pill pill-${score >= 75 ? 'teal' : score >= 50 ? 'saffron' : 'muted'}">${score}% Qualification</span>
            </div>
            <h3 style="font-size: 18px; margin-bottom: 4px;">${s.service_name}</h3>
            <p style="font-size: 13px; margin-bottom: 12px;">${s.description}</p>
            
            <div style="background: var(--paper); border-radius: 8px; padding: 10px 14px; font-size: 13px;">
              <strong style="color: var(--ink);">Why you qualify:</strong>
              <ul style="margin: 4px 0 0 16px; padding: 0;">
                ${reasons.map(r => `<li>${r}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; min-width: 140px;">
            <a class="btn btn-sm btn-primary" href="${s.official_url}" target="_blank" rel="noopener">
              Official Portal ↗
            </a>
            <button class="btn btn-sm btn-outline" onclick="App.openServiceModal('${s.id}')">
              View All Details
            </button>
            <button class="btn btn-sm btn-ghost" onclick="App.saveServiceDirect('${s.id}')">
              📌 Save Scheme
            </button>
          </div>
        </div>
      </div>
    `;
  }
};

window.EligibilityWizard = EligibilityWizard;
