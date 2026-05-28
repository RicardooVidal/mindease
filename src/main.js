import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { client, HttpResponseError, HttpCancelledError, HttpNetworkError } from 'laravel-precognition'
import App from './App.vue'
import './styles.css'

import PatientIndex from './pages/patients/index.vue'
import ContractIndex from './pages/contracts/index.vue'
import PatientNewPage from './pages/patients/PatientNewPage.vue'
import PatientDetailPage from './pages/patients/PatientDetailPage.vue'
import AlfacePage from './pages/AlfacePage.vue'
import TablesPage from './pages/TablesPage.vue'
import LoginPage from './pages/LoginPage.vue'
import { initApi, api } from './composables/useApi'
import { authUser, tenantUser, currentUser } from './composables/useApi'
import CompanyPage from "./pages/CompanyPage.vue";
import PatientEditPage from "./pages/patients/PatientEditPage.vue";
import ContractNewPage from "./pages/contracts/ContractNewPage.vue";
import ContractEditPageDeprecated from "./pages/contracts/ContractEditPage-DEPRECATED.vue";

const routes = [
  { path: '/', redirect: '/patients' },
  { path: '/login', component: LoginPage },
  { path: '/companies', component: CompanyPage },
  { path: '/contracts', component: ContractIndex },
  { path: '/contracts/new', component: ContractNewPage },
  { path: '/contracts/:id/edit', component: ContractEditPageDeprecated },
  { path: '/patients', component: PatientIndex },
  { path: '/patients/new', component: PatientNewPage },
  { path: '/patients/:id/edit', component: PatientEditPage },
  { path: '/patients/:id', component: PatientDetailPage, props: true },
  { path: '/alface', component: AlfacePage },
  { path: '/tables', component: TablesPage },
]

const router = createRouter({ history: createWebHistory(), routes })

// Global auth guard: ensures routes (except /login) require authentication
router.beforeEach(async (to, from, next) => {
  try {
    authUser.value = await currentUser();
    tenantUser.value =  localStorage.getItem('mindease:tenant')
  } catch (e) {
    authUser.value = false
    tenantUser.value = false;
    localStorage.removeItem('mindease:tenant')
  }

  if (to.path === '/login' || to.path === '/companies') {
    // if already authenticated, redirect away from login
    if ((authUser.value && authUser.value !== false) && (tenantUser.value && tenantUser.value !== false)) return next()
    // return next('/')
  }

  // For other routes, ensure user is authenticated
  if (authUser.value === null || authUser.value === false) {
    try {
      if (tenantUser.value === null || tenantUser === false) {
        return next({path: '/companies'})
      }
      return next()
    } catch (e) {
      return next({ path: '/login', query: { redirect: to.fullPath } })
    }
  }

  return next()
})

const app = createApp(App)
app.use(router)
initApi()
client.useHttpClient({
  getAxiosInstance: () => api,
  async request(config) {
    try {
      const response = await api.request({
        method: config.method,
        url: config.url,
        baseURL: config.baseURL,
        data: config.data,
        params: config.params,
        headers: config.headers,
        signal: config.signal,
        timeout: config.timeout ?? 30000,
        withCredentials: config.credentials === 'include',
      })
      return {
        status: response.status,
        data: response.data,
        headers: response.headers,
      }
    } catch (error) {
      if (error.__isCancel) {
        throw new HttpCancelledError()
      }
      if (error.response) {
        throw new HttpResponseError({
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        })
      }
      if (error.message === 'Network Error') {
        throw new HttpNetworkError()
      }
      throw error
    }
  },
}).withBaseURL(import.meta.env.VITE_API_BASE_URL || 'http://10.0.1.15:8882')
app.mount('#app')
