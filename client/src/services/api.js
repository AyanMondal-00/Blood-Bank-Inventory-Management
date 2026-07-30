const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`)
    error.status = response.status
    throw error
  }

  return response.status === 204 ? null : response.json()
}

export const inventoryApi = {
  list: (page = 1, limit = 10) => apiRequest(`/inventory?page=${page}&limit=${limit}`),
  create: (payload) => apiRequest('/inventory', { method: 'POST', body: JSON.stringify(payload) }),
  issue: (payload) => apiRequest('/inventory/issue', { method: 'POST', body: JSON.stringify(payload) }),
}

export const transactionApi = {
  list: () => apiRequest('/transactions'),
}

export const dashboardApi = {
  getStats: () => apiRequest('/dashboard'),
}

export default apiRequest
