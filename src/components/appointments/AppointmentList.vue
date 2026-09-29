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
import {bool, date, gender, maskCellphone, maskCPF, moneyReal, type, presence} from "../../utils/masks.js";
import { useRouter } from 'vue-router'

export default {
  components: { SimpleTable },
  setup() {
    const consults = ref([])
    const router = useRouter()

    const actions = [
      { label: 'Meet' , type: 'meet', redirectLink: 'google_meet_url' },
      { label: 'Editar', type: 'edit', url: '/appointments/{uuid}/edit' },
      { label: 'Deletar', type: 'delete', url: '/appointments/{uuid}' },
    ]

    const columns = [
      { key: 'patient.name', label: 'Paciente'},
      { key: 'patient.type', label: 'Tipo de Consulta', mask: type},
      { key: 'patient.time', label: 'Tempo'},
      { key: 'presence', label: 'Presença', mask: presence},
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
          await api.delete(`/api/appointment/${row.uuid}`)
          consults.value = consults.value.filter(p => p.uuid !== row.uuid)
        } catch (e) {
          console.error(e)
        }
      }
    }

    const load = async () => {
      try {
        const res = await api.get(`/api/appointment`)
        consults.value = res.data.data || []
      } catch (e) {
        console.error(e)
      }
    }

    onMounted(load)

    return { consults, columns, actions, handleRowClick, handleActionClick }
  },
}
</script>
