/* =========================================================================
   NagrikMitra AI — Admin Control Center & Verification Audit
   ========================================================================= */

const Admin = {
  services: [],
  logs: [],
  editingId: null,

  async renderView() {
    return `
      <section class="section">
        <div class="wrap">
          <div class="section-head">
            <div>
              <span class="kicker">Administration & Compliance</span>
              <h2>Government Services Data Management</h2>
              <p>Maintain verified scheme metadata, official portal URLs, eligibility criteria, and run official verification audits.</p>
            </div>
            <button class="btn btn-primary" onclick="Admin.openModal()">+ Add New Scheme</button>
          </div>

          <div class="card" style="margin-bottom: 28px;">
            <h3 style="font-size: 16px; margin-bottom: 14px;">All Registered Government Services</h3>
            <div id="admin_services_table">
              <div style="text-align: center; padding: 30px;"><div class="typing-bubble"><span></span><span></span><span></span></div></div>
            </div>
          </div>

          <div class="card">
            <h3 style="font-size: 16px; margin-bottom: 14px;">📋 Official Verification Audit Logs</h3>
            <div id="admin_logs_table">
              <div style="text-align: center; padding: 20px;"><div class="typing-bubble"><span></span><span></span><span></span></div></div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  async loadAdminData() {
    try {
      const res = await API.getServices();
      this.services = res.services || [];
      this.renderTable();

      const logsRes = await API.request('/api/admin/logs');
      this.logs = logsRes || [];
      this.renderLogs();
    } catch (err) {
      console.error(err);
    }
  },

  renderTable() {
    const el = document.getElementById('admin_services_table');
    if (!el) return;

    el.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Service Name</th>
            <th>Category</th>
            <th>Confidence</th>
            <th>Last Verified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${this.services.map(s => `
            <tr>
              <td>
                <strong>${s.service_name}</strong><br/>
                <a href="${s.official_url}" target="_blank" style="font-size: 11px; color: var(--muted);">${s.official_url}</a>
              </td>
              <td><span class="pill pill-muted" style="font-size: 11px;">${s.category}</span></td>
              <td><span class="pill pill-${s.confidence==='High'?'teal':s.confidence==='Medium'?'saffron':'red'}">${s.confidence}</span></td>
              <td style="font-size: 12.5px;">${s.last_verified}</td>
              <td style="white-space: nowrap;">
                <button class="btn btn-sm btn-outline" onclick="Admin.verify('${s.id}')">✓ Mark Verified</button>
                <button class="btn btn-sm btn-outline" onclick="Admin.openModal('${s.id}')">Edit</button>
                <button class="btn btn-sm btn-ghost" style="color: var(--red);" onclick="Admin.delete('${s.id}')">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  },

  renderLogs() {
    const el = document.getElementById('admin_logs_table');
    if (!el) return;

    if (this.logs.length === 0) {
      el.innerHTML = `<p style="font-size: 13px; color: var(--muted);">No audit logs recorded yet.</p>`;
      return;
    }

    el.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Audited By</th>
            <th>Date</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${this.logs.map(l => `
            <tr>
              <td><strong>${l.service_name || l.service_id}</strong></td>
              <td>${l.verified_by}</td>
              <td>${l.verification_date}</td>
              <td style="font-size: 12.5px; color: var(--muted);">${l.notes || 'Routine audit'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  },

  async verify(id) {
    try {
      await API.verifyService(id);
      this.loadAdminData();
      App.showToast("✓ Scheme successfully marked as verified with timestamp.");
    } catch (err) {
      console.error(err);
    }
  },

  async delete(id) {
    if (!confirm("Are you sure you want to delete this government service record?")) return;
    try {
      await API.deleteService(id);
      this.loadAdminData();
      App.showToast("Service deleted from database.");
    } catch (err) {
      console.error(err);
    }
  },

  openModal(id) {
    this.editingId = id || null;
    const existing = id ? this.services.find(s => s.id === id) : null;
    const s = existing || {
      service_name: '',
      category: 'Education',
      ministry: '',
      description: '',
      official_url: '',
      source_name: '',
      confidence: 'High'
    };

    const modalHtml = `
      <div class="modal-backdrop" id="adminModal" onclick="if(event.target===this) this.remove()">
        <div class="modal-window">
          <h3 style="font-size: 18px; margin-bottom: 16px;">
            ${existing ? 'Edit Government Scheme' : 'Register New Government Scheme'}
          </h3>

          <div class="grid grid-2" style="gap: 12px;">
            <div class="field-row">
              <label>Service Name *</label>
              <input type="text" id="af_name" value="${s.service_name}" placeholder="e.g. National Scholarship Portal"/>
            </div>
            <div class="field-row">
              <label>Category *</label>
              <input type="text" id="af_cat" value="${s.category}" placeholder="e.g. Education"/>
            </div>
          </div>

          <div class="field-row">
            <label>Nodal Ministry / Department</label>
            <input type="text" id="af_min" value="${s.ministry || ''}" placeholder="e.g. Ministry of Education"/>
          </div>

          <div class="field-row">
            <label>Description *</label>
            <textarea id="af_desc" class="field" rows="3" placeholder="Clear summary of what the service offers...">${s.description}</textarea>
          </div>

          <div class="grid grid-2" style="gap: 12px;">
            <div class="field-row">
              <label>Official Portal URL *</label>
              <input type="text" id="af_url" value="${s.official_url}" placeholder="https://scholarships.gov.in"/>
            </div>
            <div class="field-row">
              <label>Official Source Name</label>
              <input type="text" id="af_src" value="${s.source_name}" placeholder="Ministry of Education"/>
            </div>
          </div>

          <div class="field-row" style="max-width: 200px;">
            <label>Confidence Rating</label>
            <select id="af_conf">
              <option ${s.confidence==='High'?'selected':''}>High</option>
              <option ${s.confidence==='Medium'?'selected':''}>Medium</option>
              <option ${s.confidence==='Low'?'selected':''}>Low</option>
            </select>
          </div>

          <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
            <button class="btn btn-outline" onclick="document.getElementById('adminModal').remove()">Cancel</button>
            <button class="btn btn-primary" onclick="Admin.save()">Save Scheme</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  async save() {
    const data = {
      service_name: document.getElementById('af_name').value.trim(),
      category: document.getElementById('af_cat').value.trim(),
      ministry: document.getElementById('af_min').value.trim(),
      description: document.getElementById('af_desc').value.trim(),
      official_url: document.getElementById('af_url').value.trim(),
      source_name: document.getElementById('af_src').value.trim(),
      confidence: document.getElementById('af_conf').value,
      states: ["All"],
      eligibility: ["Standard statutory eligibility as notified by ministry."],
      required_documents: ["Aadhaar card", "Bank passbook"],
      application_steps: ["Apply on official portal", "Verification by nodal officer"]
    };

    if (!data.service_name || !data.official_url) {
      alert("Service Name and Official URL are required.");
      return;
    }

    try {
      if (this.editingId) {
        await API.updateService(this.editingId, data);
        App.showToast("Scheme updated successfully.");
      } else {
        await API.createService(data);
        App.showToast("New scheme registered successfully.");
      }
      const modal = document.getElementById('adminModal');
      if (modal) modal.remove();
      this.loadAdminData();
    } catch (err) {
      console.error(err);
      alert("Failed to save service.");
    }
  }
};

window.Admin = Admin;
