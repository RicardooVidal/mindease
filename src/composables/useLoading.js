import { computed, ref } from 'vue'

const pendingRequests = ref(0)

export const isLoading = computed(() => pendingRequests.value > 0)

export function startLoading() {
  pendingRequests.value += 1
  let finished = false

  return () => {
    if (finished) return
    finished = true
    pendingRequests.value -= 1
  }
}
