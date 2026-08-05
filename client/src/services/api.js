const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      if (
        !window.location.pathname.startsWith("/login") &&
        !window.location.pathname.startsWith("/register")
      ) {
        window.location.href = "/login?expired=true";
      }
    }
    
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = response.status;
    try {
      const errorData = await response.json();
      error.message = errorData.message || error.message;
    } catch (_) {
      // ignore json parse error
    }
    throw error;
  }

  return response.status === 204 ? null : response.json()
}

export const authApi = {
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  profile: () => apiRequest('/auth/profile'),
}

export const inventoryApi = {
  list: (page = 1, limit = 10) => apiRequest(`/inventory?page=${page}&limit=${limit}`),
  create: (payload) => apiRequest('/inventory', { method: 'POST', body: JSON.stringify(payload) }),
  issue: (payload) => apiRequest('/inventory/issue', { method: 'POST', body: JSON.stringify(payload) }),
  updatePrice: (payload) => apiRequest('/inventory/price', { method: 'PUT', body: JSON.stringify(payload) }),
  getPrices: () => apiRequest('/inventory/prices'),
  getExpiryMonitoring: () => apiRequest('/inventory/expiry-monitoring'),
}

export const transactionApi = {
  list: () => apiRequest('/transactions'),
}

export const dashboardApi = {
  getStats: () => apiRequest('/dashboard'),
}

export default apiRequest

