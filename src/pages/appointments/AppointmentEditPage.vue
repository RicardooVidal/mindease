<template>
  <div>
    <div class="page-hero">
      <h1>Editar consulta</h1>
    </div>

    <AppointmentForm url="/api/appointment" @save="onSave" @cancel="cancel" method="put" :patients="patients" :modelValue="appointment"/>
  </div>
</template>

<script>
import {useRoute, useRouter} from 'vue-router'
import PatientForm from '../../components/patients/PatientForm.vue'
import {onMounted, ref} from "vue";
import {loadPatients} from "../../utils/select.js";
import {api} from "../../composables/useApi.js";
import AppointmentForm from "../../components/appointments/AppointmentForm.vue";

export default {
  components: {AppointmentForm, PatientForm },
  setup() {
    const router = useRouter();
    const route = useRoute()
    const appointment = ref();
    const patients = ref();
    const uuid = route.params.id;

    const onSave = () => {
      router.push('/appointments')
    }

    const cancel = () => router.push('/appointments')

    const load = async () => {
      try {
        const res = await api.get(`/api/appointment/${uuid}`)
        appointment.value = res.data.data || []
      } catch (e) {
        console.error(e)
      }
    }

    onMounted(async () => {
      loadPatients(api, patients)
      load()
    })

    return { onSave, cancel, patients, appointment }
  },
}
</script>
