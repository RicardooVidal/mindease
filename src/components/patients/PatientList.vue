<template>
    <SimpleTable
        height="calc(100vh - 280px)"
        :data="patients"
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
import {bool, date, gender, maskCellphone, maskCPF} from "../../utils/masks.js";
import { useRouter } from 'vue-router'

export default {
  components: { SimpleTable },
  setup() {
    const patients = ref([])
    const loading = ref(false)
    const router = useRouter()

    const actions = [
      { label: 'Editar', type: 'edit', url: '/patients/{uuid}/edit' },
      { label: 'Deletar', type: 'delete', url: '/patients/{uuid}' },
    ]

    const columns = [
      { key: 'name', label: 'Nome'},
      { key: 'document', label: 'Documento', mask: maskCPF},
      { key: 'phone', label: 'Telefone/Celular', mask: maskCellphone},
      { key: 'email', label: 'Email'},
      { key: 'gender', label: 'Gênero' , mask: gender},
      { key: 'active', label: 'Ativo' , mask:  bool},
      { key: 'created_at', label: 'Criado em' , mask: date}
    ]

    const handleRowClick = (row) => {
      // console.log('row clicked', row)
    }

    const handleActionClick = async ({ url, row }) => {
      if (confirm('Tem certeza que deseja deletar este paciente?')) {
        try {
          await api.delete(`/api/patient/${row.uuid}`)
          patients.value = patients.value.filter(p => p.uuid !== row.uuid)
        } catch (e) {
          console.error(e)
        }
      }
    }

    const load = async () => {
      loading.value = true
      try {
        const res = await api.get(`/api/patient`)
        patients.value = res.data.data || []
      } catch (e) {
        console.error(e)
      } finally {
        loading.value = false
      }
    }

    onMounted(load)

    return { patients, loading, columns, actions, handleRowClick, handleActionClick }
  },
}
</script>
