<template>
    <div class="page-hero">
      <h1>Consultas</h1>
      <div class="page-actions">
        <router-link to="/appointments/new" class="btn">Nova consulta</router-link>
        <button @click="connectGoogle">Conectar Google Meet</button>
      </div>
    </div>

    <AppointmentList />
</template>

<script>
import { onUnmounted } from "vue";
import AppointmentList from "../../components/appointments/AppointmentList.vue";
import { api } from "../../composables/useApi.js";

export default { 
  components: {AppointmentList },
  setup() {
    const connectGoogle = async () => {
      const response = await api.get('/api/google/connect');

        window.open(
          response.data.url,
          'google-oauth',
          'width=500,height=650'
        );
    }

    return {
      connectGoogle
    }
  },
}
</script>
