<template>
  <div>
    <div class="page-hero">
      <h1>Tables & Select2 - Exemplo</h1>
    </div>

    <div class="card">
      <label class="label-text">Select2 (pesquisável)</label>
    <SelectSearch :options="options" v-model="selSingle" placeholder="Pesquisar..." />

      <label class="label-text" style="margin-top:12px">Select (multi)</label>
      <SelectSearch :options="options" v-model="selMulti" multiple />

      <hr />

      <SimpleTable :data="rows" :columns="columns" :perPage="5" selectable @row-click="handleRowClick" />
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'
import SelectSearch from '../components/SelectSearch.vue'
import SimpleTable from '../components/SimpleTable.vue'

export default {
  components: { SelectSearch, SimpleTable },
  setup() {
    const options = ref([
      { value: '1', label: 'Opção 1' },
      { value: '2', label: 'Opção 2' },
      { value: '3', label: 'Opção 3' },
    ])

    const selSingle = ref('')
    const selMulti = ref([])

    const rows = ref([
      { id: 1, name: 'Fulano', email: 'f@e.com', phone: '111' },
      { id: 2, name: 'Beltrano', email: 'b@e.com', phone: '222' },
    ])

    // no jQuery: use vue-native components

    const columns = [ { key: 'name', label: 'Nome'}, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Telefone' } ]

    const handleRowClick = (row) => {
      // example handler — replace with real action
      // eslint-disable-next-line no-console
      console.log('row clicked', row)
    }

    return { options, rows, selSingle, selMulti, columns, handleRowClick }
  },
}
</script>
