<template>
    <div class="page-hero">
      <h1>Pacientes</h1>
      <div class="page-actions">
        <router-link to="/patients/new" class="btn">Novo paciente</router-link>
      </div>
    </div>

    <PatientList />
</template>

<script>
import PatientList from '../../components/patients/PatientList.vue'

export default { components: { PatientList } }
</script>
