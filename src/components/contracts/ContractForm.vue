<template>
  <div class="card">
    <form @submit.prevent="submit">
      <BaseInput
        label="Descrição"
        v-model="form.description"
        placeholder="Descrição"
        required
        :error="form.errors.description"
        @blur="form.validate('description')"
      />
      <SelectSearch
          label="Paciente"
          :options="patientOptions"
          v-model="form.patient.uuid"
          placeholder="Pesquisar..."
          :error="form.errors.patient"
          required
      />
      <BaseInput
        label="Valido até"
        v-model="form.valid_until"
        type="date"
        required
        :error="form.errors.valid_until"
        @blur="form.validate('valid_until')"
      />
      <BaseInput
        label="Arquivo"
        v-model="form.file"
        type="file"
        required
        :error="form.errors.file"
        @blur="form.validate('file')"
      />
      <div id="btn-document">
        <a class="btn secondary" v-if="documentUrl">Baixar contrato</a>
      </div>

      <div class="form-actions">
        <button class="btn primary" type="submit" :disabled="form.processing">
          {{ form.processing ? 'Salvando...' : 'Salvar' }}
        </button>
        <button class="btn" type="button" @click="$emit('cancel')">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script>
import BaseInput from '../forms/BaseInput.vue'
import BaseSelect from '../forms/BaseSelect.vue'
import { useForm } from 'laravel-precognition-vue'
import { maskCPF, maskCellphone, unmask } from '../../utils/masks.js'
import {watch, computed, ref, onMounted} from 'vue'
import BaseCheckbox from "../forms/BaseCheckbox.vue";
import SelectSearch from "../SelectSearch.vue";
import {api} from "../../composables/useApi.js";

export default {
  components: {SelectSearch, BaseCheckbox, BaseInput, BaseSelect },
  props: {
    patients: { type: Array, default: () => [] },
    modelValue: { type: Object, default: null },
    url: { type: String, default: '/api/contract' },
    method: { type: String, default: 'post' },
  },
  emits: ['save', 'cancel'],
  setup(props, { emit }) {
    const documentUrl = ref(false);
    const form = useForm(props.method, props.url, {
      uuid: '',
      description: '',
      patient: { uuid: ''},
      valid_until: '',
      file: '',
    })

    const populateForm = (data) => {
      if (!data) return
      form.uuid = data.uuid || ''
      form.description = data.description || ''
      form.patient.uuid = data.patient.uuid || ''
      form.valid_until = data.valid_until || ''
      form.file = data.file || ''

      if (data.document_url) {
        documentUrl.value = data.document_url
      }
    }

    watch(() => props.modelValue, (val) => populateForm(val), { immediate: true })

    const submit = () => {
      form.submit({
        onSuccess: () => {
          emit('save', {
            description: form.description,
            patient: {
              uuid: form.patient.uuid
            },
            valid_until: form.valid_until,
            file: form.file,
          })
        },
        onError: (errors) => {
          console.error('Validation errors:', errors)
        }
      })
    }

    const patientOptions = computed(() =>
      (props.patients || []).map(p => ({ value: p.uuid, label: p.name }))
    )

    return {
      form,
      submit,
      patientOptions,
      documentUrl,
    }
  },
}
</script>

<style scoped>
  #btn-document {
    cursor: pointer;
    margin-top: 5px;
    margin-bottom: 10px;
  }
</style>