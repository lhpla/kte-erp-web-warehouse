<!-- 组合产品列表 -->
<template>
  <div class="main-box" id="CombinationProduct">
    <CombinationProductSearchPanel
      ref="CombinationProductSearchPanel"
      :searchMsg="searchMsg"
    ></CombinationProductSearchPanel>
    <CombinationProductTable
      :tableData="tableData"
      :tableLoading="tableLoading"
      :searchMsg="searchMsg"
    ></CombinationProductTable>

    <Pagination
      :total="myPages.total"
      :limit="myPages.pageSize"
      :page="myPages.pageNum"
      @update:limit="myPages.pageSize = $event"
      @update:page="myPages.pageNum = $event"
      :hidden="myPages.total <= 0"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    ></Pagination>
    <!-- 弹出层 -->
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, nextTick, provide, computed } from 'vue'
import authorButtons from '@/compositionApi/authorButtons'
import { backTableTop, localGet } from '@/utils/util'
import CombinationProductSearchPanel from '@/components/product/combinationProduct/CombinationProductSearchPanel.vue'
import CombinationProductTable from '@/components/product/combinationProduct/CombinationProductTable.vue'
export default {
  name: 'combinationProduct',
  components: {
    CombinationProductSearchPanel,
    CombinationProductTable,
  },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons()
    const buttonAuthor = BUTTONS.value
    const data = reactive({
      // 批量组合dialog状态
      combinationVisible: false,

      // 多选列表
      choiceList: [],

      // 删除的列表id
      deleteId: [],
      //
      tableData: [],
      searchMsg: {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10, // 每页10条
      },
      tableLoading: false,
      myPages: {
        pageSize: 10,
        pageNum: 1,
        pages: 1,
        total: 0,
      },
      scroll: 0,
      tableInfo: {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10, // 每页10条
      },
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http
    onBeforeMount(() => {})
    onMounted(() => {
      // dataService.value = "product";
      // dataApi.value = "getGroupProductList";
      getTableData()
    })
    const getTableData = (msg) => {
      data.searchMsg = msg || data.searchMsg
      let info = {}
      if (data.searchMsg) {
        info = data.searchMsg
      }
      data.tableLoading = true
      api.product
        .getGroupProductList(info)
        .then((res) => {
          if (res.code == 200) {
            data.tableData = res.data.records
            data.tableInfo.current = res.data.current
            data.tableInfo.size = res.data.size
            data.myPages.pageSize = res.data.size
            data.myPages.pageNum = res.data.current
            data.myPages.pages = res.data.pages
            data.myPages.total = res.data.total
            data.tableLoading = false
            if (msg && msg.scroll == 0) {
              data.scroll = 0
            }
            nextTick(() => {
              backTableTop('#CombinationProductTable', data.scroll)
            })
          }
        })
        .catch((e) => {
          data.tableLoading = false
        })
    }

    // handleSizeChange //每页条数改变
    const handleSizeChange = (val) => {
      data.tableInfo.size = val
      // count.value = Math.ceil(data.myPages.total / val) > 7 ? 7 : Math.ceil(data.myPages.total / val)
      let info = data.searchMsg
      info.size = data.tableInfo.size
      data.searchMsg = info
      data.scroll = 0
      getTableData(data.searchMsg)
    }

    // handleCurrentChange 当前分页改变
    const handleCurrentChange = (val) => {
      data.tableInfo.current = val
      let info = data.searchMsg
      info.current = data.tableInfo.current
      data.searchMsg = info
      data.scroll = 0
      getTableData(data.searchMsg)
    }

    provide('getTableData', getTableData)
    const refData = toRefs(data)
    return {
      ...refData,
      buttonAuthor,
      getTableData,
      handleCurrentChange,
      handleSizeChange,
    }
  },
}
</script>
<style scoped lang="scss">
/* input 和 cascader宽度 */
</style>
