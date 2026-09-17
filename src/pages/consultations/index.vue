<template>
    <div class="page-hero">
      <h1>Consultas</h1>
      <div class="page-actions">
        <router-link to="/consultations/new" class="btn">Nova consulta</router-link>
      </div>
    </div>

    <ConsultationList />
</template>

<script>
import ConsultationList from "../../components/consultations/ConsultationList.vue";

export default { components: {ConsultationList } }
</script>
