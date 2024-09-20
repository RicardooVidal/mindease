<script setup>
import { RouterLink, RouterView } from 'vue-router'
import ContentView from './components/ContentView.vue';
import MenuAside from './components/MenuAside/MenuAside.vue';
import Header from './components/Header/Header.vue';
</script>

<template>
    <header>
        <Header />
    </header>
    <div class="content">
      <MenuAside />
      <ContentView />
    </div>
</template>

<style scoped>

</style>
