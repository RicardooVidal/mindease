<template>
  <div class="card">
    <form @submit.prevent="submit">
      <BaseInput
        label="Nome"
        v-model="form.name"
        placeholder="Nome"
        required
        :error="form.errors.name"
        @blur="form.validate('name')"
      />
      <BaseInput
          label="CPF"
          v-model="form.document"
          placeholder="CPF"
          required
          :error="form.errors.document"
          :mask="maskCPF"
          @blur="form.validate('document')",
      />
      <BaseInput
        label="Email"
        v-model="form.email"
        type="email"
        placeholder="email@exemplo.com"
        required
        :error="form.errors.email"
        @blur="form.validate('email')"
      />
      <BaseInput
        label="Telefone"
        v-model="form.phone"
        placeholder="(XX) XXXXX-XXXX"
        required
        :error="form.errors.phone"
        :mask="maskCellphone"
        @blur="form.validate('phone')"
      />

      <BaseCheckbox
          v-model="form.active"
          label="Ativo"
          :error="form.errors.active"
      />

      <BaseSelect
        label="Sexo"
        v-model="form.gender"
        :options="genderOptions"
        :error="form.errors.gender"
        @blur="form.validate('gender')"
        required
      />

      <BaseSelect
          label="Tipo de consulta"
          v-model="form.type"
          :options="typeOptions"
          :error="form.errors.type"
          @blur="form.validate('type')"
          required
      />

      <BaseSelect
          label="Tempo de consulta"
          v-model="form.time"
          :options="timeOptions"
          :error="form.errors.time"
          @blur="form.validate('time')"
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
import { maskCPF, maskCellphone, unmask } from '../../utils/masks.js'
import { watch } from 'vue'
import BaseCheckbox from "../forms/BaseCheckbox.vue";
import {loadTimes, loadTypes} from "../../utils/select.js";

export default {
  components: {BaseCheckbox, BaseInput, BaseSelect },
  props: {
    modelValue: { type: Object, default: null },
    url: { type: String, default: '/api/patient' },
    method: { type: String, default: 'post' },
  },
  emits: ['save', 'cancel'],
  setup(props, { emit }) {
    const form = useForm(props.method, props.url, {
      uuid: '',
      name: '',
      document: '',
      phone: '',
      gender: '',
      email: '',
      active: true,
      notes: '',
      type: '',
      time: '',
    })

    const typeOptions = loadTypes();
    const timeOptions = loadTimes();

    const populateForm = (data) => {
      if (!data) return
      form.uuid = data.uuid || ''
      form.name = data.name || ''
      form.last_name = data.last_name || ''
      form.email = data.email || ''
      form.active = data.active || false
      form.document = maskCPF(data.document || '')
      form.phone = maskCellphone(data.phone || '')
      form.gender = data.gender || ''
      form.notes = data.notes || ''
      form.type = data.type || ''
      form.time = data.time || ''
    }

    watch(() => props.modelValue, (val) => populateForm(val), { immediate: true })

    const submit = () => {
      const originalDocument = form.document
      const originalPhone = form.phone

      form.document = unmask(form.document)
      form.phone = unmask(form.phone)

      form.submit({
        onSuccess: () => {
          emit('save', {
            name: form.name,
            document: form.document,
            phone: form.phone,
            gender: form.gender,
            email: form.email,
            active: form.active,
            notes: form.notes,
            type: form.type,
            time: form.time,
          })
        },
        onError: (errors) => {
          form.document = originalDocument
          form.phone = originalPhone
          console.error('Validation errors:', errors)
        }
      }).catch((err) => {
        form.document = originalDocument
        form.phone = originalPhone
      })
    }

    const genderOptions = [
      { value: '', label: 'Selecione' },
      { value: 'female', label: 'Feminino' },
      { value: 'male', label: 'Masculino' },
    ]

    return {
      form,
      genderOptions,
      submit,
      maskCPF,
      maskCellphone,
      typeOptions,
      timeOptions
    }
  },
}
</script>