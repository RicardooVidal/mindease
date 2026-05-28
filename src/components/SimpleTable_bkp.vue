<template>
  <div>
    <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
      <input v-model="search" placeholder="Buscar..." class="base-input" />
      <label style="margin-left:auto">Mostrar
        <select v-model.number="pageSize" class="base-input" style="width:80px;margin-left:8px">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="25">25</option>
        </select>
      </label>
    </div>

    <table class="simple-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" @click="sortBy(col.key)" style="cursor:pointer">
            {{ col.label }} <span v-if="sort.key===col.key">{{ sort.dir==='asc' ? '▲' : '▼' }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in paged"
          :key="row[idKey]"
          :class="['table-row']"
          @click="emitRowClick(row)"
        >
          <td v-for="col in columns" :key="col.key">{{ row[col.key] }}</td>
        </tr>
      </tbody>
    </table>

    <div class="pager">
      <button @click="prev" :disabled="page===1">Anterior</button>
      <span>Page {{ page }} / {{ pages }}</span>
      <button @click="next" :disabled="page===pages">Próxima</button>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  props: {
    data: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [] },
    perPage: { type: Number, default: 10 },
    idKey: { type: String, default: 'id' },
    selectable: { type: Boolean, default: false },
    // optional function(row) => string | object with classes
    rowClass: { type: Function, default: null },
  },
  emits: ['row-click'],
  setup(props, { emit }) {
    const page = ref(1)
    const sort = ref({ key: null, dir: 'asc' })
    const search = ref('')
    const pageSize = ref(props.perPage)

    const filteredData = computed(()=>{
      if (!search.value) return props.data
      const q = search.value.toLowerCase()
      return props.data.filter(r => Object.values(r).join(' ').toLowerCase().includes(q))
    })

    const sorted = computed(() => {
      if (!sort.value.key) return filteredData.value
      const arr = [...filteredData.value].sort((a,b)=>{
        if (a[sort.value.key] < b[sort.value.key]) return sort.value.dir==='asc' ? -1 : 1
        if (a[sort.value.key] > b[sort.value.key]) return sort.value.dir==='asc' ? 1 : -1
        return 0
      })
      return arr
    })

    const pages = computed(()=> Math.max(1, Math.ceil(sorted.value.length / pageSize.value)))

    const paged = computed(()=> sorted.value.slice((page.value-1)*pageSize.value, page.value*pageSize.value))

    const sortBy = (key) => {
      if (sort.value.key === key) sort.value.dir = sort.value.dir==='asc' ? 'desc' : 'asc'
      else { sort.value.key = key; sort.value.dir='asc' }
    }

    const prev = () => { if (page.value>1) page.value-- }
    const next = () => { if (page.value<pages.value) page.value++ }

    const emitRowClick = (row) => { if (props.selectable) emit('row-click', row) }

    return { page, pages, paged, sort, sortBy, prev, next, search, pageSize, emitRowClick }
  }
}
</script>

<style scoped>
.simple-table{width:100%;border-collapse:collapse}
.simple-table th,.simple-table td{padding:8px;border:1px solid #e5e7eb}
.pager{display:flex;gap:8px;align-items:center;margin-top:8px}
.simple-table tbody tr.table-row:hover{background:#f3f4f6;cursor:pointer}

</style>
