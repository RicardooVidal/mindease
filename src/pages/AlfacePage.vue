<template>
  <div>
    <div class="page-hero">
      <h1>Alface - Exemplos de Forms</h1>
    </div>

    <div class="grid-examples">
      <section>
        <h2>PatientForm (create)</h2>
        <PatientForm @save="onSave" @cancel="onCancel" />
      </section>

      <section>
        <h2>PatientForm (edit) — exemplo com dados</h2>
        <PatientForm :modelValue="examplePatient" @save="onSave" @cancel="onCancel" />
      </section>

      <section>
        <h2>Inputs e Selects</h2>
        <div class="card">
          <BaseInput label="Exemplo" v-model="ex" hint="Dica" />
          <BaseSelect label="Opções" v-model="sel" :options="[{value:'1',label:'Um'},{value:'2',label:'Dois'}]" />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import PatientForm from '../components/patients/PatientForm.vue'
import BaseInput from '../components/forms/BaseInput.vue'
import BaseSelect from '../components/forms/BaseSelect.vue'

export default {
  components: { PatientForm, BaseInput, BaseSelect },
  setup() {
    const examplePatient = ref({ name: 'Exemplo Alface', email: 'alface@example.com', phone: '0000' })
    const ex = ref('')
    const sel = ref('')
    const onSave = (p) => alert('save: ' + JSON.stringify(p))
    const onCancel = () => alert('cancel')
    return { examplePatient, ex, sel, onSave, onCancel }
  },
}
</script>
