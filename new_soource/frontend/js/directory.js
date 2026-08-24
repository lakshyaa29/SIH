/* =========================================================================
   NagrikMitra AI — Government Services Catalog & Directory
   ========================================================================= */

const Directory = {
  searchQuery: '',
  selectedCategory: 'All',
  selectedState: 'All',
  selectedSort: 'default',
  servicesList: [],
  categoriesList: [],

  async renderView() {
    return `
      <section class="section">
        <div class="wrap">
          <div class="section-head">
            <div>
              <span class="kicker">Official Schemes Directory</span>
              <h2>All Government Services & Welfare Schemes</h2>
              <p>Explore verified Indian government welfare portals, benefits, statutory eligibility criteria, required documents, and official direct application links.</p>
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
              <span class="pill pill-teal" id="dir_total_badge">Loading Schemes...</span>
            </div>
          </div>

          <!-- Search & Filter Controls -->
          <div class="card" style="margin-bottom: 24px; padding: 20px 24px;">
            <div class="grid grid-3" style="gap: 16px; align-items: flex-end;">
              <div style="grid-column: 1 / 2;">
                <label for="dir_search">🔍 Search Scheme, Keyword, Ministry, or Benefit</label>
                <input type="search" id="dir_search" placeholder="e.g. scholarship, kisan, ayushman, pension, udyam, solar, loan..." value="${this.searchQuery}" oninput="Directory.onSearch(this.value)"/>
              </div>
              <div>
                <label for="dir_state">📍 Filter by State Coverage</label>
                <select id="dir_state" onchange="Directory.onStateChange(this.value)">
                  <option value="All" ${this.selectedState==='All'?'selected':''}>All States / Central Schemes</option>
                  <option value="Maharashtra" ${this.selectedState==='Maharashtra'?'selected':''}>Maharashtra</option>
                  <option value="Delhi" ${this.selectedState==='Delhi'?'selected':''}>Delhi (NCT)</option>
                  <option value="Uttar Pradesh" ${this.selectedState==='Uttar Pradesh'?'selected':''}>Uttar Pradesh</option>
                  <option value="Karnataka" ${this.selectedState==='Karnataka'?'selected':''}>Karnataka</option>
                  <option value="Tamil Nadu" ${this.selectedState==='Tamil Nadu'?'selected':''}>Tamil Nadu</option>
                  <option value="Gujarat" ${this.selectedState==='Gujarat'?'selected':''}>Gujarat</option>
                  <option value="West Bengal" ${this.selectedState==='West Bengal'?'selected':''}>West Bengal</option>
                  <option value="Rajasthan" ${this.selectedState==='Rajasthan'?'selected':''}>Rajasthan</option>
                  <option value="Bihar" ${this.selectedState==='Bihar'?'selected':''}>Bihar</option>
                  <option value="Madhya Pradesh" ${this.selectedState==='Madhya Pradesh'?'selected':''}>Madhya Pradesh</option>
                  <option value="Kerala" ${this.selectedState==='Kerala'?'selected':''}>Kerala</option>
                  <option value="Andhra Pradesh" ${this.selectedState==='Andhra Pradesh'?'selected':''}>Andhra Pradesh</option>
                  <option value="Telangana" ${this.selectedState==='Telangana'?'selected':''}>Telangana</option>
                  <option value="Punjab" ${this.selectedState==='Punjab'?'selected':''}>Punjab</option>
                  <option value="Haryana" ${this.selectedState==='Haryana'?'selected':''}>Haryana</option>
                  <option value="Odisha" ${this.selectedState==='Odisha'?'selected':''}>Odisha</option>
                  <option value="Assam" ${this.selectedState==='Assam'?'selected':''}>Assam</option>
                </select>
              </div>
              <div>
                <label for="dir_sort">⚡ Sort Schemes</label>
                <select id="dir_sort" onchange="Directory.onSortChange(this.value)">
                  <option value="default" ${this.selectedSort==='default'?'selected':''}>Default Ranking</option>
                  <option value="name_asc" ${this.selectedSort==='name_asc'?'selected':''}>Scheme Name (A to Z)</option>
                  <option value="name_desc" ${this.selectedSort==='name_desc'?'selected':''}>Scheme Name (Z to A)</option>
                  <option value="category" ${this.selectedSort==='category'?'selected':''}>By Category</option>
                </select>
              </div>
            </div>

            <!-- Dynamic Category Filter Pills -->
            <div id="dir_category_pills" style="display: flex; gap: 8px; overflow-x: auto; padding-top: 16px; margin-top: 16px; border-top: 1px solid var(--line); flex-wrap: wrap;">
              <button class="pill ${this.selectedCategory === 'All' ? 'pill-teal' : 'pill-muted'}" style="cursor: pointer; padding: 6px 14px; font-size: 12.5px;" onclick="Directory.onCategoryChange('All')">
                All Categories
              </button>
            </div>
          </div>

          <!-- Services Grid Container -->
          <div id="dir_services_grid" class="grid grid-3">
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
              <div class="typing-bubble"><span></span><span></span><span></span></div>
              <p style="margin-top: 8px; font-size: 13px; color: var(--muted);">Loading verified government schemes...</p>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  async loadServices() {
    const grid = document.getElementById('dir_services_grid');
    if (!grid) return;

    try {
      const [res, catsRes] = await Promise.all([
        API.getServices({
          q: this.searchQuery,
          category: this.selectedCategory !== 'All' ? this.selectedCategory : '',
          state: this.selectedState !== 'All' ? this.selectedState : ''
        }),
        API.getCategories()
      ]);

      this.servicesList = res.services || [];
      this.categoriesList = catsRes || [];

      // Sort
      if (this.selectedSort === 'name_asc') {
        this.servicesList.sort((a, b) => a.service_name.localeCompare(b.service_name));
      } else if (this.selectedSort === 'name_desc') {
        this.servicesList.sort((a, b) => b.service_name.localeCompare(a.service_name));
      } else if (this.selectedSort === 'category') {
        this.servicesList.sort((a, b) => a.category.localeCompare(b.category));
      }

      // Update badge
      const totalBadge = document.getElementById('dir_total_badge');
      if (totalBadge) {
        totalBadge.innerText = `Showing ${this.servicesList.length} Verified Services`;
      }

      // Render category pills
      this.renderCategoryPills();

      if (this.servicesList.length === 0) {
        grid.innerHTML = `
          <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 48px 20px;">
            <div style="font-size: 36px; margin-bottom: 12px;">🔍</div>
            <h3>No government schemes found</h3>
            <p style="font-size: 13.5px; color: var(--muted); margin: 6px 0 16px;">
              No services matched the keyword "<strong>${this.searchQuery}</strong>" in the selected category/state.
            </p>
            <button class="btn btn-primary btn-sm" onclick="Directory.resetFilters()">Reset All Filters</button>
          </div>
        `;
        return;
      }

      grid.innerHTML = this.servicesList.map(s => this.renderServiceCard(s)).join('');
    } catch (err) {
      console.error(err);
      grid.innerHTML = `<p style="grid-column: 1 / -1; color: var(--red);">Error loading schemes from database.</p>`;
    }
  },

  renderCategoryPills() {
    const container = document.getElementById('dir_category_pills');
    if (!container || !this.categoriesList.length) return;

    const totalCount = this.categoriesList.reduce((acc, c) => acc + c.count, 0);

    let html = `
      <button class="pill ${this.selectedCategory === 'All' ? 'pill-teal' : 'pill-muted'}" style="cursor: pointer; padding: 6px 14px; font-size: 12.5px;" onclick="Directory.onCategoryChange('All')">
        All Categories (${totalCount})
      </button>
    `;

    this.categoriesList.forEach(c => {
      const isSelected = this.selectedCategory === c.category;
      html += `
        <button class="pill ${isSelected ? 'pill-teal' : 'pill-muted'}" style="cursor: pointer; padding: 6px 14px; font-size: 12.5px;" onclick="Directory.onCategoryChange('${c.category}')">
          ${c.category} (${c.count})
        </button>
      `;
    });

    container.innerHTML = html;
  },

  renderServiceCard(s) {
    const docCount = (s.required_documents || []).length;
    const stepCount = (s.application_steps || []).length;

    return `
      <div class="card card-hover service-card" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 10px;">
            <span class="pill pill-muted" style="font-size: 11px;">${s.category}</span>
            <span class="pill pill-${s.confidence==='High'?'teal':s.confidence==='Medium'?'saffron':'red'}">${s.confidence} Confidence</span>
          </div>
          <h3 style="font-size: 17.5px; margin-bottom: 6px; color: var(--ink); line-height: 1.3;">${s.service_name}</h3>
          <p style="font-size: 13px; margin-bottom: 14px; line-height: 1.5; color: var(--muted);">${s.description.slice(0, 115)}${s.description.length > 115 ? '...' : ''}</p>
        </div>

        <div>
          <div style="display: flex; gap: 12px; font-size: 11.5px; color: var(--muted); margin-bottom: 12px; flex-wrap: wrap;">
            <span>📄 ${docCount} Documents</span>
            <span>📝 ${stepCount} Steps</span>
            <span>🏛️ ${s.ministry ? s.ministry.slice(0, 26) + '...' : s.source_name.slice(0, 26) + '...'}</span>
          </div>
          <div style="display: flex; gap: 8px; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 12px;">
            <button class="btn btn-sm btn-outline" onclick="App.openServiceModal('${s.id}')">
              View Guide
            </button>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-sm btn-ghost" style="padding: 4px 8px;" onclick="App.saveServiceDirect('${s.id}')" title="Save to tracker">
                📌
              </button>
              <a class="btn btn-sm btn-primary" href="${s.official_url}" target="_blank" rel="noopener" title="Open official government portal">
                Portal ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  onSearch(val) {
    this.searchQuery = val;
    this.loadServices();
  },

  onCategoryChange(cat) {
    this.selectedCategory = cat;
    this.loadServices();
  },

  onStateChange(st) {
    this.selectedState = st;
    this.loadServices();
  },

  onSortChange(sortVal) {
    this.selectedSort = sortVal;
    this.loadServices();
  },

  resetFilters() {
    this.searchQuery = '';
    this.selectedCategory = 'All';
    this.selectedState = 'All';
    this.selectedSort = 'default';
    const sInput = document.getElementById('dir_search');
    if (sInput) sInput.value = '';
    const stSelect = document.getElementById('dir_state');
    if (stSelect) stSelect.value = 'All';
    const sortSelect = document.getElementById('dir_sort');
    if (sortSelect) sortSelect.value = 'default';
    this.loadServices();
  }
};

window.Directory = Directory;
