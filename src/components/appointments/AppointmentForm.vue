<template>
  <div class="card">
    <form @submit.prevent="submit">
      <SelectSearch
          label="Paciente"
          :options="patientOptions"
          v-model="form.patient.uuid"
          placeholder="Pesquisar..."
          :error="form.errors.patient"
          required
      />

      <BaseInput
          label="Data"
          v-model="form.date"
          type="datetime-local"
          required
          :error="form.errors.date"
          @blur="form.validate('date')"
      />
      <BaseInput
        label="Valor"
        v-model="form.value"
        placeholder="Valor"
        required
        :error="form.errors.value"
        :mask="maskMoney"
        @blur="form.validate('value')"
      />
      <BaseSelect
        label="Presença"
        v-model="form.presence"
        :options="presenceOptions"
        :error="form.errors.presence"
        @blur="form.validate('presence')"
        required
      />

      <label class="form-row">
        <span class="label-text">Observações</span>
        <textarea
          v-model="form.notes"
          class="base-input"
          rows="3"
        ></textarea>
        <small v-if="form.errors.notes" class="error">{{ form.errors.notes }}</small>
      </label>

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
import {maskMoney, unmask, unmaskMoney} from '../../utils/masks.js'
import {computed, watch} from 'vue'
import BaseCheckbox from "../forms/BaseCheckbox.vue";
import SelectSearch from "../SelectSearch.vue";

export default {
  components: {SelectSearch, BaseCheckbox, BaseInput, BaseSelect },
  props: {
    patients: { type: Array, default: () => [] },
    modelValue: { type: Object, default: null },
    url: { type: String, default: '/api/appointment' },
    method: { type: String, default: 'post' },
  },
  emits: ['save', 'cancel'],
  setup(props, { emit }) {
    const form = useForm(props.method, props.url, {
      uuid: '',
      patient: {uuid: ''},
      date: '',
      value: 0,
      presence: '',
      notes: '',
    })

    const populateForm = (data) => {
      if (!data) return
      const date = data.date ? new Date(data.date) : null
      const pad = (value) => String(value).padStart(2, '0')

      form.uuid = data.uuid || ''
      form.patient.uuid = data.patient.uuid || ''
      form.date = date && !Number.isNaN(date.getTime())
        ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
        : ''
      form.value = data.value || 0
      form.presence = data.presence || ''
      form.notes = data.notes || ''
    }

    watch(() => props.modelValue, (val) => populateForm(val), { immediate: true })

    const submit = () => {
      const originalValue = form.value

      form.value = unmaskMoney(form.value)
      // form.phone = unmask(form.phone)

      form.submit({
        onSuccess: () => {
          emit('save', {
            uuid: form.uuid,
            patient: {
              uuid: form.patient.uuid
            },
            date: form.date,
            value: form.value,
            presence: form.presence,
            notes: form.notes,
          })
        },
        onError: (errors) => {
          form.value = originalValue
          // form.phone = originalPhone
          console.error('Validation errors:', errors)
        }
      }).catch((err) => {
        form.value = originalValue
      })
    }

    const presenceOptions = [
      { value: '', label: 'Selecione' },
      { value: 'pending', label: 'Pendente' },
      { value: 'present', label: 'Presente' },
      { value: 'absent', label: 'Ausente' },
    ]

    const patientOptions = computed(() =>
        (props.patients || []).map(p => ({ value: p.uuid, label: p.name }))
    )

    return {
      form,
      submit,
      patientOptions,
      presenceOptions,
      maskMoney,
    }
  },
}
</script>
