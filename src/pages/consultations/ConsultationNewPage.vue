<template>
  <div>
    <div class="page-hero">
      <h1>Nova consulta</h1>
    </div>

    <ConsultationForm url="/api/consultation" @save="onSave" @cancel="cancel" :patients="patients" />
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import PatientForm from '../../components/patients/PatientForm.vue'
import {onMounted, ref} from "vue";
import {loadPatients} from "../../utils/select.js";
import {api} from "../../composables/useApi.js";
import ConsultationForm from "../../components/consultations/ConsultationForm.vue";

export default {
  components: {ConsultationForm, PatientForm },
  setup() {
    const router = useRouter();
    const patients = ref();

    const onSave = () => {
      router.push('/consultations')
    }

    const cancel = () => router.push('/consultations')

    onMounted(() => loadPatients(api, patients))

    return { onSave, cancel, patients }
  },
}
</script>
