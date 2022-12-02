<!--PlatformCategory  平台类目管理-->
<template>
  <div id="PlatformCategory">
    <PlatformCategorySearch ref="PlatformCategorySearch"></PlatformCategorySearch>
    <PlatformCategoryTable
      ref="PlatformCategoryTable"
      :searchMsg="searchMsg"
      :tableData="tableData"
      :tableLoading="tableLoading"
      :failCount="failCount"
      :passCount="passCount"
      :waitingAuditCount="waitingAuditCount"
    ></PlatformCategoryTable>
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
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, provide, nextTick } from 'vue'
import PlatformCategorySearch from './PlatformCategorySearch.vue'
import PlatformCategoryTable from './PlatformCategoryTable.vue'
import authorButtons from '@/compositionApi/authorButtons'
import { backTableTop } from '@/utils/util'

export default {
  name: 'platformCategory',
  components: { PlatformCategorySearch, PlatformCategoryTable },
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
      failCount: '',
      passCount: '',
      waitingAuditCount: '',
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http
    onBeforeMount(() => {})
    onMounted(() => {
      getTableData(data.searchMsg, true)
    })
    const refData = toRefs(data)

    //获取列表
    const getTableData = (msg, flag) => {
        data.tableLoading = true
        data.searchMsg = msg || data.searchMsg
        data.searchMsg.size = data.tableInfo.size
        let info = {}
        if (data.searchMsg) {
          info = data.searchMsg
        }
        vue.$refs.PlatformCategoryTable.choiceList = []
        vue.$refs.PlatformCategoryTable.auditList = []
        vue.$refs.PlatformCategoryTable.clear()
        // if (flag) {
        //   api.product
        //     .platformCategoryLazyList(info)
        //     .then(res => {
        //       if (res.code == 200) {
        //         data.tableData = res.data.data;
        //         data.count = res.data.count;
        //         data.tableInfo.current = res.data.current;
        //         data.tableInfo.size = res.data.size;
        //         data.myPages.pageSize = res.data.size;
        //         data.myPages.pageNum = res.data.current;
        //         data.myPages.pages = res.data.pages;
        //         data.myPages.total = res.data.total;
        //         nextTick(() => {
        //           backTableTop("#PlatformCategoryTable");
        //         });
        //         data.tableLoading = false;
        //       } else {
        //         data.tableLoading = false;
        //         vue.$message({
        //           type: "warning",
        //           message: res.msg,
        //         });
        //       }
        //     })
        //     .catch(err => {
        //       console.log(err);
        //       data.tableLoading = false;
        //       vue.$message.warning(err.msg);
        //     });
        // } else {
        api.product
          .platformCategoryList(info)
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

              nextTick(() => {
                backTableTop('#PlatformCategoryTable')
              })
              data.tableLoading = false
            } else {
              data.tableLoading = false
              vue.$message({
                type: 'warning',
                message: res.msg,
              })
            }
          })
          .catch((err) => {
            data.tableLoading = false
          })
      // }
    }
    provide('getTableData', getTableData)

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
#PlatformCategory {
}
</style>
