<!--PropertyManage SPU属性管理 -->
<template>
  <div id="PropertyManage">
    <PropertyManageSearch
      ref="PropertyManageSearch"
      v-model:searchForm="searchForm"
    ></PropertyManageSearch>
    <PropertyManageTable
      ref="PropertyManageTable"
      :searchMsg="searchMsg"
      :searchForm="searchForm"
      :tableData="tableData"
      :tableLoading="tableLoading"
      :failCount="failCount"
      :passCount="passCount"
      :waitingAuditCount="waitingAuditCount"
    ></PropertyManageTable>
    <Pagination
      :total="myPages.total"
      :limit="myPages.pageSize"
      :page="myPages.pageNum"
      @update:limit="myPages.pageSize = $event"
      @update:page="myPages.pageNu = $event"
      :hidden="myPages.total <= 0"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    ></Pagination>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, provide } from 'vue'
import PropertyManageTable from './PropertyManageTable.vue'
import PropertyManageSearch from './PropertyManageSearch.vue'
import authorButtons from '@/compositionApi/authorButtons'

export default {
  name: 'propertyManage',
  components: { PropertyManageSearch, PropertyManageTable },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons()
    const buttonAuthor = BUTTONS.value
    const data = reactive({
      tableData: [],
      myPages: {
        pageSize: 10,
        pageNum: 1,
        pages: 1,
        total: 0,
      },
      scroll: 0,
      tableLoading: false,
      tableInfo: {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10, // 每页10条
      },
      searchMsg: {},
      searchForm: {},
      failCount: '',
      passCount: '',
      waitingAuditCount: '',
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http
    onBeforeMount(() => {
      getTableData()
    })
    onMounted(() => {})
    const refData = toRefs(data)

    //获取列表
    const getTableData = (msg) => {
        data.tableLoading = true
        data.searchMsg = msg ? msg : data.searchMsg
        data.searchMsg.size = data.tableInfo.size
        let info = {}
        if (data.searchMsg) {
          info = data.searchMsg
        }
        api.product
          .spuPropertyList(info)
          .then((res) => {
            if (res.code == 200) {
              data.tableData = res.data.list ? res.data.list.records : []
              data.failCount = !res.data.failCount || res.data.failCount == -1 ? '-' : res.data.failCount
              data.passCount = !res.data.passCount || res.data.passCount == -1 ? '-' : res.data.passCount
              data.waitingAuditCount =
                !res.data.waitingAuditCount || res.data.waitingAuditCount == -1 ? '-' : res.data.waitingAuditCount
              data.tableInfo.current = res.data.list.current
              data.tableInfo.size = res.data.list.size
              data.myPages.pageSize = res.data.list.size
              data.myPages.pageNum = res.data.list.current
              data.myPages.pages = res.data.list.pages
              data.myPages.total = res.data.list.total
              data.tableLoading = false
              vue.$refs.PropertyManageTable.choiceList = []
              vue.$refs.PropertyManageTable.selectList = []
            } else {
              data.tableLoading = false
              vue.$message.warning(res.msg)
            }
          })
          .catch((err) => {
            data.tableLoading = false
          })
    }

    const handleSizeChange = (val) => {
      data.tableInfo.size = val
      let info = data.searchMsg
      info.size = data.tableInfo.size
      data.searchMsg = info
      data.scroll = 0
      getTableData(data.searchMsg)
    }
    const handleCurrentChange = (val) => {
      data.tableInfo.current = val
      let info = data.searchMsg
      info.current = data.tableInfo.current
      data.searchMsg = info
      data.scroll = 0
      getTableData(data.searchMsg)
    }

    provide('getTableData', getTableData)

    return {
      ...refData,
      getTableData,
      buttonAuthor,
      handleSizeChange,
      handleCurrentChange,
    }
  },
}
</script>
<style scoped lang="scss">
#PropertyManage {
}
</style>
