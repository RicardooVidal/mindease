<template>
  <div>
    <div class="page-hero">
      <h1>Novo contrato</h1>
    </div>

    <ContractForm url="/api/contract" @save="onSave" @cancel="cancel" :patients="patients" />
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { loadPatients } from "../../utils/select.js";
import ContractForm from "../../components/contracts/ContractForm.vue";
import {api} from "../../composables/useApi.js";
import {onMounted, ref} from "vue";

export default {
  components: { ContractForm },
  setup() {
    const router = useRouter()
    const patients = ref();

    const onSave = () => {
      router.push('/contracts')
    }

    const cancel = () => router.push('/contracts')

    onMounted(() => loadPatients(api, patients))

    return { onSave, cancel, patients }
  },
}
</script>
