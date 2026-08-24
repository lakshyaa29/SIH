/* =========================================================================
   NagrikMitra AI — Citizen Dashboard & Document Readiness Locker
   ========================================================================= */

const Dashboard = {
  savedList: [],
  activityList: [],
  stats: null,

  async renderView() {
    return `
      <section class="section">
        <div class="wrap">
          <div class="section-head">
            <div>
              <span class="kicker">Personalized Citizen Portal</span>
              <h2>My Government Services Dashboard</h2>
              <p>Track your saved schemes, monitor application milestones, and manage your essential citizen document locker.</p>
            </div>
          </div>

          <!-- Stats Counters -->
          <div class="grid grid-4" style="margin-bottom: 28px;">
            <div class="card">
              <span class="kicker" style="color: var(--teal);">Indexed Schemes</span>
              <h2 id="dash_stat_services" style="font-size: 28px; margin: 4px 0;">22</h2>
              <span style="font-size: 12px; color: var(--muted);">Central & State Portals</span>
            </div>
            <div class="card">
              <span class="kicker" style="color: var(--saffron);">Saved Schemes</span>
              <h2 id="dash_stat_saved" style="font-size: 28px; margin: 4px 0;">0</h2>
              <span style="font-size: 12px; color: var(--muted);">In your personal tracker</span>
            </div>
            <div class="card">
              <span class="kicker" style="color: var(--blue);">Official Portals</span>
              <h2 style="font-size: 28px; margin: 4px 0;">6</h2>
              <span style="font-size: 12px; color: var(--muted);">Direct integration links</span>
            </div>
            <div class="card">
              <span class="kicker" style="color: var(--teal);">Verification Rate</span>
              <h2 style="font-size: 28px; margin: 4px 0;">100%</h2>
              <span style="font-size: 12px; color: var(--muted);">Govt Domain Sourced</span>
            </div>
          </div>

          <div class="assistant-shell" style="grid-template-columns: 1fr 380px;">
            <!-- Saved Services Table -->
            <div class="card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
                <h3 style="font-size: 17px;">📌 Saved & Researched Services</h3>
                <button class="btn btn-sm btn-outline" onclick="App.navigate('services')">+ Explore More Schemes</button>
              </div>

              <div id="dash_saved_table_container">
                <div style="text-align: center; padding: 30px;">
                  <div class="typing-bubble"><span></span><span></span><span></span></div>
                </div>
              </div>
            </div>

            <!-- Document Locker & Activity Timeline -->
            <div>
              <!-- Document Readiness Locker -->
              <div class="card" style="margin-bottom: 24px;">
                <h3 style="font-size: 16px; margin-bottom: 6px;">📂 Document Readiness Locker</h3>
                <p style="font-size: 12.5px; margin-bottom: 14px;">Check off the key identity & revenue documents you have ready for application:</p>

                <div id="doc_locker_container" style="display: flex; flex-direction: column; gap: 8px;">
                  ${this.renderDocumentLocker()}
                </div>
              </div>

              <!-- Activity Timeline -->
              <div class="card">
                <h3 style="font-size: 16px; margin-bottom: 12px;">🕒 Recent Activity Log</h3>
                <div id="dash_activity_container">
                  <div style="text-align: center; padding: 20px;">
                    <div class="typing-bubble"><span></span><span></span><span></span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  renderDocumentLocker() {
    const docs = [
      { id: 'doc_aadhaar', label: 'Aadhaar Card (Mobile Linked)', ready: true },
      { id: 'doc_bank', label: 'Bank Passbook (Aadhaar Seeded)', ready: true },
      { id: 'doc_income', label: 'Income Certificate (Revenue Authority)', ready: false },
      { id: 'doc_ration', label: 'Ration Card / Family ID', ready: true },
      { id: 'doc_caste', label: 'Caste / Category Certificate', ready: false },
      { id: 'doc_marksheet', label: 'Latest Mark Sheet / Student ID', ready: false },
      { id: 'doc_land', label: 'Land Record (7/12, Khatoni / RoR)', ready: false }
    ];

    const savedState = JSON.parse(localStorage.getItem('nagrikmitra_doc_locker') || '{}');

    return docs.map(d => {
      const isChecked = savedState[d.id] !== undefined ? savedState[d.id] : d.ready;
      return `
        <label style="display: flex; align-items: center; gap: 10px; font-size: 13px; cursor: pointer; padding: 6px 8px; border-radius: 6px; background: var(--paper); margin: 0;">
          <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="Dashboard.toggleDoc('${d.id}', this.checked)"/>
          <span style="${isChecked ? 'color: var(--ink); font-weight: 500;' : 'color: var(--muted);'}">${d.label}</span>
        </label>
      `;
    }).join('');
  },

  toggleDoc(id, val) {
    const savedState = JSON.parse(localStorage.getItem('nagrikmitra_doc_locker') || '{}');
    savedState[id] = val;
    localStorage.setItem('nagrikmitra_doc_locker', JSON.stringify(savedState));
    App.showToast("Document locker updated.");
  },

  async loadDashboardData() {
    try {
      const [saved, activity, stats] = await Promise.all([
        API.getSavedServices(),
        API.getActivity(),
        API.getDashboardStats()
      ]);

      this.savedList = saved || [];
      this.activityList = activity || [];
      this.stats = stats;

      // Update counters
      const statSavedEl = document.getElementById('dash_stat_saved');
      if (statSavedEl) statSavedEl.innerText = this.savedList.length;

      this.renderSavedTable();
      this.renderActivityLog();
    } catch (err) {
      console.error(err);
    }
  },

  renderSavedTable() {
    const container = document.getElementById('dash_saved_table_container');
    if (!container) return;

    if (this.savedList.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 36px; margin-bottom: 8px;">📌</div>
          <h4>No saved schemes yet</h4>
          <p style="font-size: 13px; max-width: 40ch; margin: 6px auto 16px;">
            Save schemes from the AI Assistant or Services Directory to track their status and prepare your documents.
          </p>
          <button class="btn btn-sm btn-primary" onclick="App.navigate('services')">Browse Schemes</button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Scheme</th>
            <th>Stage / Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${this.savedList.map(s => `
            <tr>
              <td>
                <strong>${s.service_name}</strong><br/>
                <span style="font-size: 11.5px; color: var(--muted);">${s.category}</span>
              </td>
              <td>
                <select style="font-size: 12.5px; padding: 4px 8px; border-radius: 6px;" onchange="Dashboard.updateStatus(${s.saved_id}, this.value)">
                  <option ${s.application_status==='Saved'?'selected':''}>Saved (Researching)</option>
                  <option ${s.application_status==='Documents Ready'?'selected':''}>Documents Ready</option>
                  <option ${s.application_status==='Applied'?'selected':''}>Applied Online</option>
                  <option ${s.application_status==='Approved'?'selected':''}>Approved / DBT Active</option>
                  <option ${s.application_status==='Grievance Raised'?'selected':''}>Grievance Raised</option>
                </select>
              </td>
              <td style="white-space: nowrap;">
                <button class="btn btn-sm btn-outline" onclick="App.openServiceModal('${s.id}')">View</button>
                <a class="btn btn-sm btn-primary" href="${s.official_url}" target="_blank" rel="noopener">Portal ↗</a>
                <button class="btn btn-sm btn-ghost" style="color: var(--red);" onclick="Dashboard.deleteSaved(${s.saved_id})">✕</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  },

  renderActivityLog() {
    const container = document.getElementById('dash_activity_container');
    if (!container) return;

    if (this.activityList.length === 0) {
      container.innerHTML = `<p style="font-size: 12.5px; color: var(--muted); text-align: center; padding: 16px 0;">No recorded activity yet.</p>`;
      return;
    }

    container.innerHTML = `
      <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
        ${this.activityList.map(a => `
          <li style="border-left: 2px solid var(--teal); padding-left: 10px; font-size: 12.5px;">
            <strong style="color: var(--ink);">${a.title}</strong>
            <p style="margin: 2px 0; font-size: 11.5px; color: var(--muted);">${a.details || a.action_type}</p>
            <span style="font-size: 10.5px; color: var(--muted-light);">${a.created_at}</span>
          </li>
        `).join('')}
      </ul>
    `;
  },

  async updateStatus(savedId, newStatus) {
    try {
      await API.updateSavedStatus(savedId, newStatus, "");
      App.showToast(`Application status updated to "${newStatus}"`);
    } catch (err) {
      console.error(err);
    }
  },

  async deleteSaved(savedId) {
    try {
      await API.deleteSavedService(savedId);
      this.loadDashboardData();
      App.showToast("Service removed from tracker.");
    } catch (err) {
      console.error(err);
    }
  }
};

window.Dashboard = Dashboard;
