<template>
  <li>
    <router-link :to="to" @click="onClick" class="sidebar-link">{{ label }}</router-link>
  </li>
</template>

<script>
export default {
  props: {
    to: { type: [String, Object], required: true },
    label: { type: String, required: true },
  },
  emits: ['select'],
  methods: {
    onClick() { this.$emit('select') }
  }
}
</script>

<style scoped>
.sidebar-link{display:block;padding:10px;border-radius:6px;color:inherit;text-decoration:none}
.sidebar-link.router-link-active{background:rgba(255,255,255,0.06)}
</style>
