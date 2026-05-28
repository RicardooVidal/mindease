<template>
    <div class="page-hero">
      <h1>Contratos</h1>
      <div class="page-actions">
        <router-link to="/contracts/new" class="btn">Novo contrato</router-link>
      </div>
    </div>

    <ContractList />
</template>

<script>
import ContractList from '../../components/contracts/ContractList.vue'

export default { components: { ContractList } }
</script>
