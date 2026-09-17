<template>
  <div class="dt-wrapper">
    <table ref="tableRef" class="display"></table>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import 'datatables.net-dt/css/jquery.dataTables.css'

export default {
  props: {
    data: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [] },
    actions: { type: Array, default: () => [] },
    perPage: { type: Number, default: 10 },
    selectable: { type: Boolean, default: false },
    height: { type: String, default: '400px' },
  },
  emits: ['row-click', 'action-click'],
  setup(props, { emit }) {
    const router = useRouter()
    const tableRef = ref(null)
    const tableHeight = ref(props.height)
    let dt = null
    let $ = null

    const initTable = async () => {
      const jq = (await import('jquery')).default
      window.$ = window.jQuery = jq
      $ = jq

      const DataTableLib = (await import('datatables.net-dt')).default

      if (dt) {
        dt.destroy()
        dt = null
      }

      const columns = props.columns.map(col => ({
        title: col.label,
        data: col.key,
        defaultContent: '',
        render: (value) => {
          if (value == null) return ''
          return typeof col.mask === 'function' ? col.mask(String(value)) : value
        },
      }))

      if (props.actions.length > 0) {
        columns.push({
          title: 'Ações',
          data: null,
          orderable: false,
          render: function(data, type, row) {
            return props.actions.map(action => {
              const url = action.url.replace('{uuid}', row.uuid)
              return `<a href="#" class="action-link action-${action.type}" data-url="${url}" data-type="${action.type}">${action.label || action.type}</a>`
            }).join(' ')
          }
        })
      }

      const options = {
        columns,
        data: props.data,
        responsive: false,
        scrollX: true,
        scrollY: props.height,
        scrollCollapse: true,
        paging: true,
        pageLength: props.perPage,
        lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, 'Todos']],
        language: {
          search: 'Buscar:',
          lengthMenu: 'Mostrar _MENU_ registros',
          info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
          paginate: { next: 'Próxima', previous: 'Anterior' },
          emptyTable: 'Nenhum dado disponível'
        },
        dom: 'lfrtip',
      }

      dt = new DataTableLib(tableRef.value, options)

      dt.on('click', 'tbody tr', function() {
        const rowData = dt.row(this).data()
        if (rowData && props.selectable) {
          emit('row-click', rowData)
        }
      })

      $(tableRef.value).off('click', '.action-link').on('click', '.action-link', function(e) {
        e.preventDefault()
        const $this = $(this)
        const url = $this.data('url')
        const type = $this.data('type')
        if (type === 'delete') {
          emit('action-click', { url, row: dt.row($this.closest('tr')).data() })
        } else if (url) {
          router.push(url)
        }
      })
    }

    onMounted(() => {
      nextTick(() => {
        initTable()
      })
    })

    onUnmounted(() => {
      if (dt) {
        dt.destroy()
        dt = null
      }
    })

    watch(() => props.height, (val) => { tableHeight.value = val })

    watch(() => props.data, () => {
      nextTick(() => {
        initTable()
      })
    }, { deep: true })

    return { tableRef }
  }
}
</script>

<style scoped>
.dt-wrapper {
  width: 100%;
  overflow: hidden;
}

:deep(.dataTables_scrollHead) {
  overflow: auto;
}
:deep(.dataTables_scrollBody) {
  overflow: auto;
  max-height: v-bind(tableHeight);
}
:deep(table.dataTable) {
  width: 100% !important;
  min-width: 600px;
}
</style>
