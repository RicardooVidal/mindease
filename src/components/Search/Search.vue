<script setup>
    const props = defineProps({
        placeholder: String,
        id: String,
        action: null|Function,
        autocomplete: String
    });
</script>

<template>
    <input v-if="action" type="text" :placeholder="placeholder" :id="id" @click="action" :autocomplete="autocomplete">
    <input v-else type="text" :placeholder="placeholder" :id="id" :autocomplete="autocomplete">
</template>