<template>
  <div>
    <div class="page-hero">
      <h1>Editar consulta</h1>
    </div>

    <ConsultationForm url="/api/consultation" @save="onSave" @cancel="cancel" method="put" :patients="patients" :modelValue="consultation"/>
  </div>
</template>

<script>
import {useRoute, useRouter} from 'vue-router'
import PatientForm from '../../components/patients/PatientForm.vue'
import {onMounted, ref} from "vue";
import {loadPatients} from "../../utils/select.js";
import {api} from "../../composables/useApi.js";
import ConsultationForm from "../../components/consultations/ConsultationForm.vue";

export default {
  components: {ConsultationForm, PatientForm },
  setup() {
    const router = useRouter();
    const route = useRoute()
    const consultation = ref();
    const patients = ref();
    const uuid = route.params.id;

    const onSave = () => {
      router.push('/consultations')
    }

    const cancel = () => router.push('/consultations')

    const load = async () => {
      try {
        const res = await api.get(`/api/consultation/${uuid}`)
        consultation.value = res.data.data || []
      } catch (e) {
        console.error(e)
      }
    }

    onMounted(async () => {
      loadPatients(api, patients)
      load()
    })

    return { onSave, cancel, patients, consultation }
  },
}
</script>
