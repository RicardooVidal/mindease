<template>
  <div>
    <div class="page-hero">
      <h1>Editar paciente</h1>
    </div>

    <PatientForm v-if="patient" url="/api/patient" @save="onSave" @cancel="cancel" method="put" :modelValue="patient" />
  </div>
</template>

<script>
import {useRoute, useRouter} from 'vue-router'
import PatientForm from '../../components/patients/PatientForm.vue'
import {api} from "../../composables/useApi.js";
import {onMounted, reactive, ref} from "vue";

export default {
  components: { PatientForm },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const patient = ref();
    const uuid = route.params.id;

    const onSave = () => {
      router.push('/patients')
    }

    const cancel = () => router.push('/patients')

    const load = async () => {
      try {
        const res = await api.get(`/api/patient/${uuid}`)
        patient.value = res.data.data || []
      } catch (e) {
        console.error(e)
      }
    }

    onMounted(load)

    return { onSave, cancel, patient, uuid }
  },
}
</script>
