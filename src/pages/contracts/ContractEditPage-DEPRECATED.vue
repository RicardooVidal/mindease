<template>
  <div>
    <div class="page-hero">
      <h1>Editar contrato</h1>
    </div>

    <ContractForm v-if="contract" url="/api/contract" @save="onSave" @cancel="cancel" method="put" :modelValue="contract" :patients="patients" />
  </div>
</template>

<script>
import {useRoute, useRouter} from 'vue-router'
import ContractForm from "../../components/contracts/ContractForm.vue";
import {api} from "../../composables/useApi.js";
import {onMounted, ref} from "vue";
import {loadPatients} from "../../utils/select.js";

export default {
  components: { ContractForm },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const contract = ref();
    const patients = ref();
    const uuid = route.params.id;

    const onSave = () => {
      router.push('/contracts')
    }

    const cancel = () => router.push('/contracts')

    const load = async () => {
      try {
        const res = await api.get(`/api/contract/${uuid}`)
        contract.value = res.data.data || []
        await loadPatients(api, patients);
      } catch (e) {
        console.error(e)
      }
    }

    onMounted(load)

    return { onSave, cancel, uuid, contract, patients }
  },
}
</script>
