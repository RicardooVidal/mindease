<template>
  <div>
    <div class="page-hero">
      <h1>Novo paciente</h1>
    </div>

    <PatientForm url="/api/patient" @save="onSave" @cancel="cancel" />
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import PatientForm from '../../components/patients/PatientForm.vue'

export default {
  components: { PatientForm },
  setup() {
    const router = useRouter()

    const onSave = () => {
      router.push('/patients')
    }

    const cancel = () => router.push('/patients')

    return { onSave, cancel }
  },
}
</script>
