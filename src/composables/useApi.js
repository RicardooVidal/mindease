import axios from 'axios'
import { ref } from 'vue'
import { startLoading } from './useLoading.js'
import { notify } from './useToastr.js'

// Single axios instance used across the app
export const api = axios.create()

// Track actual requests, including failures and cancellations.
api.interceptors.request.use((config) => {
  if (config.showLoading === false || config.headers.get('Precognition') === 'true') {
    return config
  }

  const adapter = axios.getAdapter(config.adapter)
  config.adapter = async (requestConfig) => {
    const finishLoading = startLoading()
    try {
      return await adapter(requestConfig)
    } finally {
      finishLoading()
    }
  }
  return config
})

// Notify once per operation; field validation stays inline.
api.interceptors.response.use(
  (response) => {
    const config = response.config
    if (config.showToast === false || config.headers.get('Precognition') === 'true') return response

    const path = new URL(config.url, 'http://localhost').pathname.replace(/\/$/, '')
    const method = config.method?.toLowerCase()
    const resource = {
      patient: 'Paciente',
      appointment: 'Consulta',
      contract: 'Contrato',
    }[path.split('/')[2]]
    let message
    if (path === '/api/medical-record/import') {
      message = 'Prontuário importado com sucesso!'
    } else if (resource && ['post', 'put', 'patch', 'delete'].includes(method)) {
      const action = method === 'delete'
        ? (resource === 'Consulta' ? 'excluída' : 'excluído')
        : (resource === 'Consulta' ? 'salva' : 'salvo')
      message = `${resource} ${action} com sucesso!`
    } else if (method === 'post' && path === '/api/login') {
      return response
    } else if (method === 'post' && path === '/logout') {
      message = 'Você saiu do sistema.'
    } else if (['post', 'put', 'patch', 'delete'].includes(method)) {
      message = 'Operação realizada com sucesso!'
    }
    if (message) notify(message, 'success')
    return response
  },
  (error) => {
    const config = error.config
    if (!config || axios.isCancel(error) || config.showToast === false || config.headers.get('Precognition') === 'true') {
      return Promise.reject(error)
    }
    const status = error.response?.status
    const path = new URL(config.url, 'http://localhost').pathname
    // An unauthenticated session check is expected on the login page.
    if (status === 401 && path === '/api/user') return Promise.reject(error)

    let message = 'Não foi possível concluir a operação. Tente novamente.'
    if (!error.response) message = 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'
    else if (path === '/api/login' && [401, 422].includes(status)) message = 'Não foi possível entrar. Confira seu email e senha.'
    else if (status === 422) message = 'Confira os campos informados e tente novamente.'
    else if (status === 401) message = 'Sua sessão expirou. Entre novamente.'
    else if (status === 403) message = 'Você não tem permissão para realizar esta operação.'
    else if (status === 404) message = 'O registro solicitado não foi encontrado.'
    else if (status === 429) message = 'Muitas tentativas. Aguarde um momento e tente novamente.'
    else if (config.method === 'get') message = 'Não foi possível carregar os dados. Tente novamente.'
    notify(message, 'error')
    return Promise.reject(error)
  }
)

// reactive user state: null = unknown, false = not authenticated, object = user
export const authUser = ref(null)
export const tenantUser = ref(null);

export function initApi() {
  const base = import.meta.env.VITE_API_BASE_URL
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
    }
    throw e
  }
}

export function hasTenant() {
  return authUser.value && tenantUser.value;
}
