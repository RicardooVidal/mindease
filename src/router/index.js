import Dashboard from '@/views/Dashboard/Dashboard.vue'
import NewPatient from '@/views/Patients/NewPatient.vue'
import Patients from '@/views/Patients/Patients.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/patient/:id',
      name: 'patient',
      component: Patients
    },
    {
      path: '/patient/new',
      name: 'new-patient',
      component: NewPatient
    },
    {
      path: '/patient/list',
      name: 'list-patient',
      component: Dashboard
    },
    {
      path: '/wait-list',
      name: 'wait-list',
      component: Dashboard
    },
    {
      path: '/prices',
      name: 'prices',
      component: Dashboard
    },
    {
      path: '/prices',
      name: 'prices',
      component: Dashboard
    }
  ]
})

export default router
