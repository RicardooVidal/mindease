import axios from 'axios'
import { ref } from 'vue'

// Single axios instance used across the app
export const api = axios.create()

// reactive user state: null = unknown, false = not authenticated, object = user
export const authUser = ref(null)
export const tenantUser = ref(null);

export function initApi() {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://10.0.1.15:8882'
  api.defaults.baseURL = base
  // For Sanctum cookie-based auth
  api.defaults.withCredentials = true
  api.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
  // If a token was persisted from previous session, apply it so subsequent
  // requests include Authorization automatically.
  try {
    const token = localStorage.getItem('mindease:token')
    if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } catch (e) {
    // ignore if storage not available
  }
  // If a tenant was persisted, set it globally so auth checks include it
  try {
    const stored = localStorage.getItem('mindease:tenant')
    if (stored) api.defaults.headers.common['X-Tenant'] = stored
  } catch (e) {
    // ignore (localStorage may not be available in some environments)
  }

  // Response interceptor: on 401 clear token and authUser so app transitions to login
  api.interceptors.response.use(
    (resp) => resp,
    (err) => {
      if (err && err.response && err.response.status === 401) {
        try { localStorage.removeItem('mindease:token') } catch (e) {}
        delete api.defaults.headers.common['Authorization']
        authUser.value = false
      }
      return Promise.reject(err)
    }
  )
}

// simple health check helper
export const health = async () => {
  try {
    const res = await api.get('/')
    return res
  } catch (e) {
    throw e
  }
}

// Set a tenant header globally for multitenant requests
export function setTenant(tenant) {
  if (tenant) api.defaults.headers.common['X-Tenant'] = tenant
  else delete api.defaults.headers.common['X-Tenant']
}

// Perform login using Sanctum (assumes /sanctum/csrf-cookie and /login endpoints)
export async function login({ email, password }) {
  // ensure tenant header is set for the request
  const headers = {}

  // ensure csrf cookie
  await api.get('/sanctum/csrf-cookie', { headers })

  // perform login
  const res = await api.post('/api/login', { email, password }, { headers })

  // If backend returned a token (common keys), persist it and set header
  try {
    const data = res && res.data ? res.data : {}
    const token = data.token || data.access_token || data.api_token || (data.data && (data.data.token || data.data.access_token))
    if (token) {
      try {
        localStorage.setItem('mindease:token', token)
      } catch (e) {}
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  } catch (e) {
    // no-op
  }

  return res
}

export async function logout() {
  // Clear client token state immediately so further requests are unauthenticated
  try {
    localStorage.removeItem('mindease:token')
  } catch (e) {}
  delete api.defaults.headers.common['Authorization']

  // mark unauthenticated locally so route guards will send user to /login
  try {
    authUser.value = false
  } catch (e) {}

  return api.post('/logout')
}

// fetch current authenticated user. Adjust endpoint if your backend uses different path.
export async function currentUser() {
  // typical Laravel Sanctum uses /api/user
  try {
    return await api.get('/api/user')
  } catch (e) {
    // if 401, mark unauthenticated
    if (e && e.response && e.response.status === 401) {
      try {
        localStorage.removeItem('mindease:token')
      } catch (err) {}
      delete api.defaults.headers.common['Authorization']
      authUser.value = false
    }
    throw e
  }
}

export function hasTenant() {
  return authUser.value && tenantUser.value;
}
