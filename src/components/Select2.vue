<template>
  <div>
    <select :id="elId" style="width:100%">
      <option v-if="!multiple" value=""></option>
      <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'

let idCounter = 0

export default {
  props: {
    options: { type: Array, default: () => [] },
    modelValue: { type: [String, Array], default: '' },
    multiple: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
    allowClear: { type: Boolean, default: undefined },
    minimumResultsForSearch: { type: Number, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const elId = `select2-${++idCounter}`
    let $ = null
    let instance = null

    const init = async () => {
      const jq = (await import('jquery')).default
      window.$ = window.jQuery = jq
      // import select2 JS and CSS explicitly so plugin attaches to the same jQuery instance
      await import('select2/dist/js/select2.js')
      await import('select2/dist/css/select2.css')
      $ = jq
      instance = $(`#${elId}`)
      // protect: ensure select2 plugin attached
      if (instance && typeof instance.select2 === 'function') {
        instance.select2({
          placeholder: props.placeholder,
          multiple: props.multiple,
          allowClear: props.allowClear ?? !props.multiple,
          minimumResultsForSearch: props.minimumResultsForSearch ?? 0,
        })
      } else {
        // fallback: log and continue (component will still render native select)
        // eslint-disable-next-line no-console
        console.warn('select2 plugin not available; falling back to native select')
      }
      // set initial value
      if (props.modelValue) instance.val(props.modelValue).trigger('change')
      instance.on('change', () => {
        const val = instance.val()
        emit('update:modelValue', props.multiple ? val || [] : (val || ''))
      })
    }

    onMounted(init)

    watch(() => props.modelValue, (v) => {
      if ($ && instance) instance.val(v).trigger('change')
    })

    onUnmounted(() => {
      try {
        if (instance && typeof instance.select2 === 'function') instance.select2('destroy')
      } catch (e) {}
    })

    return { elId }
  },
}
</script>

<style scoped>
</style>
