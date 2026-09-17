<template>
    <SimpleTable
        height="calc(100vh - 280px)"
        :data="consults"
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
import {bool, date, gender, maskCellphone, maskCPF, moneyReal, type} from "../../utils/masks.js";
import { useRouter } from 'vue-router'

export default {
  components: { SimpleTable },
  setup() {
    const consults = ref([])
    const loading = ref(false)
    const router = useRouter()

    const actions = [
      { label: 'Editar', type: 'edit', url: '/consultations/{uuid}/edit' },
      { label: 'Deletar', type: 'delete', url: '/consultations/{uuid}' },
    ]

    const columns = [
      { key: 'patient.name', label: 'Paciente'},
      { key: 'patient.type', label: 'Tipo de Consulta', mask: type},
      { key: 'patient.time', label: 'Tempo'},
      { key: 'date', label: 'Data e hora de atendimento', mask: date},
      { key: 'value', label: 'Valor' , mask: moneyReal},
      { key: 'created_at', label: 'Criado em' , mask: date}
    ]

    const handleRowClick = (row) => {
      // console.log('row clicked', row)
    }

    const handleActionClick = async ({ url, row }) => {
      if (confirm('Tem certeza que deseja deletar essa consulta?')) {
        try {
          await api.delete(`/api/consultation/${row.uuid}`)
          consults.value = consults.value.filter(p => p.uuid !== row.uuid)
        } catch (e) {
          console.error(e)
        }
      }
    }

    const load = async () => {
      loading.value = true
      try {
        const res = await api.get(`/api/consultation`)
        consults.value = res.data.data || []
      } catch (e) {
        console.error(e)
      } finally {
        loading.value = false
      }
    }

    onMounted(load)

    return { consults, loading, columns, actions, handleRowClick, handleActionClick }
  },
}
</script>
