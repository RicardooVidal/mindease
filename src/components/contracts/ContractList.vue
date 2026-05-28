<template>
    <SimpleTable
        height="calc(100vh - 280px)"
        :data="contracts"
        :columns="columns"
        :actions="actions"
        selectable
        @row-click="handleRowClick"
        @action-click="handleActionClick"
    />
</template>

<script>
import { ref, onMounted } from 'vue'
import { api } from "../../composables/useApi.js"
import SimpleTable from "../SimpleTable.vue"
import {bool, date, download, gender, maskCellphone, maskCPF} from "../../utils/masks.js";
import { useRouter } from 'vue-router'

export default {
  components: { SimpleTable },
  setup() {
    const contracts = ref([])
    const patients = ref([])
    const loading = ref(false)
    const router = useRouter()

    const actions = [
      { label: 'Deletar', type: 'delete', url: '/contracts/{uuid}' },
    ]

    const columns = [
      { key: 'description', label: 'Descrição'},
      { key: 'patient.name', label: 'Paciente'},
      { key: 'valid_until', label: 'Válido até', mask: date},
      { key: 'document_url', label: 'Download', mask: download},
      { key: 'created_at', label: 'Criado em' , mask: date},
    ]

    const handleRowClick = (row) => {
      // console.log('row clicked', row)
    }

    const handleActionClick = async ({ url, row }) => {
      if (confirm('Tem certeza que deseja deletar este contrato?')) {
        try {
          await api.delete(`/api/contract/${row.uuid}`)
          contracts.value = contracts.value.filter(p => p.uuid !== row.uuid)
        } catch (e) {
          console.error(e)
        }
      }
    }

    const load = async () => {
      loading.value = true
      try {
        const res = await api.get(`/api/contract`)
        contracts.value = res.data.data || []
      } catch (e) {
        console.error(e)
      } finally {
        loading.value = false
      }
    }

    onMounted(load)

    return { patients, contracts, loading, columns, actions, handleRowClick, handleActionClick }
  },
}
</script>
