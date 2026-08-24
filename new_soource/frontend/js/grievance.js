/* =========================================================================
   NagrikMitra AI — CPGRAMS Public Grievance & Escalation Assistant
   ========================================================================= */

const Grievance = {
  diagnostic: null,
  draftResult: null,

  renderView() {
    return `
      <section class="section">
        <div class="wrap" style="max-width: 900px;">
          <div class="section-head">
            <div>
              <span class="kicker">CPGRAMS Redressal Engine</span>
              <h2>Public Grievance Escalation & Petition Drafter</h2>
              <p>Has your government application or statutory benefit been delayed or wrongfully rejected? NagrikMitra AI diagnoses Citizen Charter breaches and drafts a formal grievance petition for pgportal.gov.in.</p>
            </div>
          </div>

          <!-- Diagnostic Input Card -->
          <div class="card" style="margin-bottom: 24px;">
            <h3 style="font-size: 16px; margin-bottom: 16px;">1. Diagnose Your Issue</h3>
            
            <div class="field-row">
              <label for="gr_desc">Describe what occurred (e.g. application submitted, rejection reason, or officer inaction)</label>
              <textarea id="gr_desc" class="field" rows="3" placeholder="e.g. I applied for my National Scholarship on scholarships.gov.in 45 days ago. My college verified it, but state disbursal has been stuck with no status update."></textarea>
            </div>

            <div class="grid grid-3" style="gap: 12px;">
              <div class="field-row">
                <label for="gr_dept">Department / Scheme</label>
                <select id="gr_dept">
                  <option value="Education / Scholarship">Education / Scholarship Portal</option>
                  <option value="PM-KISAN / Agriculture">PM-KISAN / Agriculture</option>
                  <option value="EPFO / Pension Disbursal">EPFO / Pension Claim</option>
                  <option value="Food & Ration Supply">Food & Ration Supply</option>
                  <option value="Aadhaar / UIDAI Services">Aadhaar / UIDAI Services</option>
                  <option value="Healthcare / Ayushman Bharat">Healthcare / Ayushman Bharat</option>
                  <option value="Housing / PMAY">Housing / PMAY</option>
                  <option value="Other Central / State Ministry">Other Central / State Ministry</option>
                </select>
              </div>
              <div class="field-row">
                <label for="gr_days">Days Pending</label>
                <input type="number" id="gr_days" value="35" min="1" max="1000"/>
              </div>
              <div class="field-row">
                <label for="gr_ref">Application / Ack. Ref ID</label>
                <input type="text" id="gr_ref" placeholder="e.g. MH2026-NSP-9921"/>
              </div>
            </div>

            <button class="btn btn-primary" style="margin-top: 8px;" onclick="Grievance.analyze()">
              🔍 Diagnose & Evaluate Delay
            </button>
          </div>

          <!-- Diagnostic Results Container -->
          <div id="gr_results_container"></div>
        </div>
      </section>
    `;
  },

  async analyze() {
    const desc = document.getElementById('gr_desc').value.trim();
    const dept = document.getElementById('gr_dept').value;
    const days = parseInt(document.getElementById('gr_days').value) || 30;
    const ref = document.getElementById('gr_ref').value.trim();

    if (!desc) {
      alert("Please describe your issue before diagnosing.");
      return;
    }

    const container = document.getElementById('gr_results_container');
    container.innerHTML = `<div class="card" style="text-align: center; padding: 30px;"><div class="typing-bubble"><span></span><span></span><span></span></div></div>`;

    try {
      const res = await API.analyzeGrievance({
        description: desc,
        department: dept,
        ref_number: ref,
        days_pending: days
      });

      this.diagnostic = res;

      container.innerHTML = `
        <div class="card" style="margin-bottom: 24px; border: 1.5px solid ${res.is_delayed ? 'var(--red)' : 'var(--teal)'};">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
            <span class="pill pill-${res.is_delayed ? 'red' : 'teal'}">
              ${res.is_delayed ? '⚠️ Citizen Charter Timeline Exceeded (>30 Days)' : '✓ Within Standard Processing Window'}
            </span>
            <span class="pill pill-muted">Department: ${res.suggested_department}</span>
          </div>

          <h3 style="font-size: 18px; margin-bottom: 10px;">Recommended Action Plan</h3>
          <ul class="checklist" style="margin-bottom: 20px;">
            ${res.action_points.map(ap => `<li><span class="tick">👉</span> ${ap.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}
          </ul>

          <div style="border-top: 1px solid var(--line); padding-top: 16px;">
            <h4 style="font-size: 15px; margin-bottom: 12px;">2. Generate Structured CPGRAMS Petition Letter</h4>
            <div class="grid grid-2" style="gap: 12px; margin-bottom: 14px;">
              <div>
                <label>Your Name</label>
                <input type="text" id="draft_name" placeholder="e.g. Ramesh Kumar" value="Ramesh Kumar"/>
              </div>
              <div>
                <label>Your Contact Phone / Email</label>
                <input type="text" id="draft_phone" placeholder="e.g. 9876543210" value="9876543210"/>
              </div>
            </div>

            <button class="btn btn-saffron" onclick="Grievance.generateDraft('${desc.replace(/'/g, "\\'")}', '${ref.replace(/'/g, "\\'")}', ${days})">
              📝 Generate Official Petition Draft
            </button>
          </div>
        </div>

        <div id="gr_draft_container"></div>
      `;
    } catch (err) {
      console.error(err);
      container.innerHTML = `<p style="color: var(--red);">Analysis failed. Please check your connection.</p>`;
    }
  },

  async generateDraft(issueSummary, refNumber, daysPending) {
    const name = document.getElementById('draft_name').value.trim() || "Concerned Citizen";
    const phone = document.getElementById('draft_phone').value.trim();
    const dept = this.diagnostic ? this.diagnostic.suggested_department : "Concerned Department";

    const draftContainer = document.getElementById('gr_draft_container');
    draftContainer.innerHTML = `<div class="card" style="text-align: center; padding: 24px;"><div class="typing-bubble"><span></span><span></span><span></span></div></div>`;

    try {
      const res = await API.draftGrievance({
        citizen_name: name,
        contact_number: phone,
        department: dept,
        scheme_name: "Government Service Delivery",
        ref_number: refNumber || "N/A",
        days_pending: daysPending,
        issue_summary: issueSummary
      });

      this.draftResult = res;

      draftContainer.innerHTML = `
        <div class="card" style="border: 1.5px solid var(--saffron); box-shadow: var(--shadow-card);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
            <span class="pill pill-saffron mono">Case Reference: ${res.case_token}</span>
            <button class="btn btn-sm btn-primary" onclick="Grievance.copyDraft()">
              📋 Copy Petition Text
            </button>
          </div>

          <textarea id="officialDraftText" style="width: 100%; height: 320px; font-family: var(--font-mono); font-size: 13px; padding: 14px; background: var(--paper); border: 1px solid var(--line); border-radius: 10px; line-height: 1.5; color: var(--ink);" readonly>${res.formatted_draft}</textarea>

          <div style="margin-top: 16px; background: var(--teal-bg); border: 1px solid var(--teal-border); border-radius: 12px; padding: 14px 18px;">
            <h4 style="color: var(--teal); font-size: 14px; margin-bottom: 6px;">Next Step: Submit on Official Portal</h4>
            <ol style="margin: 0 0 0 16px; padding: 0; font-size: 13px; color: var(--ink);">
              ${res.instructions.map(ins => `<li style="margin-bottom: 4px;">${ins}</li>`).join('')}
            </ol>
            <div style="margin-top: 12px;">
              <a class="btn btn-primary btn-sm" href="https://pgportal.gov.in" target="_blank" rel="noopener">
                Open CPGRAMS Portal (pgportal.gov.in) ↗
              </a>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      console.error(err);
      draftContainer.innerHTML = `<p style="color: var(--red);">Failed to generate draft.</p>`;
    }
  },

  copyDraft() {
    const textarea = document.getElementById('officialDraftText');
    if (textarea) {
      textarea.select();
      navigator.clipboard.writeText(textarea.value);
      App.showToast("✓ Grievance petition copied to clipboard!");
    }
  }
};

window.Grievance = Grievance;
