/**
 * SentinelPay Frontend API Service
 * Handles all HTTP communication with the Express backend.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (error) {
    console.warn(`[API] Error on ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Health Check
  checkHealth: () => request('/health'),

  // Transactions
  getTransactions: async (status = 'ALL', search = '') => {
    const params = new URLSearchParams();
    if (status && status !== 'ALL') params.append('status', status);
    if (search) params.append('search', search);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/transactions${queryString}`);
  },

  getTransactionById: (id) => request(`/transactions/${id}`),

  evaluateTransaction: (payload) =>
    request('/transactions', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  reviewTransaction: (id, status, notes, reviewerName = 'Niteesh Balajee') =>
    request(`/transactions/${id}/review`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes, reviewerName }),
    }),

  deleteTransaction: (id) =>
    request(`/transactions/${id}`, {
      method: 'DELETE',
    }),

  getStatsSummary: () => request('/transactions/stats/summary'),

  // Authentication
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password, role = 'analyst') =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),
};

export default api;
