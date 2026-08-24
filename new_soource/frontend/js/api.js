/* =========================================================================
   NagrikMitra AI — REST API Client & Offline Fallback Layer
   ========================================================================= */

const API = {
  baseUrl: window.location.origin.includes('http') ? window.location.origin : 'http://127.0.0.1:8000',

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        ...options
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.warn(`[API] Remote call failed on ${endpoint}, checking fallback...`, err);
      return this.localFallback(endpoint, options);
    }
  },

  async getServices(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return await this.request(`/api/services${qs ? '?' + qs : ''}`);
  },

  async getService(id) {
    return await this.request(`/api/services/${id}`);
  },

  async createService(data) {
    return await this.request('/api/services', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateService(id, data) {
    return await this.request(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteService(id) {
    return await this.request(`/api/services/${id}`, {
      method: 'DELETE'
    });
  },

  async verifyService(id) {
    return await this.request(`/api/services/${id}/verify`, {
      method: 'POST'
    });
  },

  async sendChatMessage(message, intent, answers, pendingQuestions) {
    return await this.request('/api/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ message, intent, answers, pending_questions: pendingQuestions })
    });
  },

  async evaluateEligibility(profile) {
    return await this.request('/api/assistant/evaluate-eligibility', {
      method: 'POST',
      body: JSON.stringify(profile)
    });
  },

  async analyzeGrievance(data) {
    return await this.request('/api/grievance/analyze', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async draftGrievance(data) {
    return await this.request('/api/grievance/draft', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getDashboardStats() {
    return await this.request('/api/dashboard/stats');
  },

  async getSavedServices(userToken = 'default_citizen') {
    return await this.request(`/api/dashboard/saved?user_token=${userToken}`);
  },

  async saveService(serviceId, status = 'Saved', notes = '') {
    return await this.request('/api/dashboard/saved', {
      method: 'POST',
      body: JSON.stringify({ service_id: serviceId, status, notes })
    });
  },

  async updateSavedStatus(savedId, status, notes) {
    return await this.request(`/api/dashboard/saved/${savedId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes })
    });
  },

  async deleteSavedService(savedId) {
    return await this.request(`/api/dashboard/saved/${savedId}`, {
      method: 'DELETE'
    });
  },

  async getActivity(userToken = 'default_citizen') {
    return await this.request(`/api/dashboard/activity?user_token=${userToken}`);
  },

  async getPlatforms() {
    return await this.request('/api/platforms');
  },

  async getCategories() {
    return await this.request('/api/categories');
  },

  /* Local in-browser resilience layer if opened without server */
  localFallback(endpoint, options) {
    // Basic mock response handling for offline resilience
    if (endpoint.startsWith('/api/services')) {
      return { count: window.LOCAL_SERVICES ? window.LOCAL_SERVICES.length : 0, services: window.LOCAL_SERVICES || [] };
    }
    if (endpoint.startsWith('/api/dashboard/stats')) {
      return {
        total_services: 22,
        total_categories: 15,
        total_platforms: 6,
        total_saved: 1,
        total_grievances: 0,
        verification_rate: '100% Sourced'
      };
    }
    return { status: 'fallback_mode' };
  }
};

window.API = API;
