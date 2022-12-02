<!-- 产品库列表 -->
<template>
  <div :class="isFixed ? '' : 'box-main'">
    <ProductManageSearch ref="ProductManageSearch"></ProductManageSearch>
    <ProductManageTable
      ref="ProductManageTable"
      :tableData="tableData"
      :searchMsg="searchMsg"
      :tableLoading="tableLoading"
      :isFixed="isFixed"
    ></ProductManageTable>
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

    <div
      v-if="showBack && !isFixed"
      class="backtop"
      style="background-color: #eee; text-align: center; line-height: 40px; color: #1989fa; border-radius: 100%"
      @click="backTop"
    >
      <i class="el-icon-arrow-up" style="font-size: 18px"></i>
    </div>
    <el-tooltip :content="isFixed ? '流体布局' : '固定布局'">
      <div class="affix" @click="isFixed = !isFixed">
        <img
          v-if="isFixed"
          src="@/assets/images/affix.png"
          alt=""
          style="width: 1.8em; height: 1.8em; cursor: pointer"
          srcset=""
        />
        <img
          v-else
          src="@/assets/images/nofix.png"
          alt=""
          style="width: 1.8em; height: 1.8em; cursor: pointer"
          srcset=""
        />
      </div>
    </el-tooltip>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  watch,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
  provide,
  nextTick,
  onActivated,
  onDeactivated,
  onBeforeUnmount,
} from 'vue'
import ProductManageSearch from '@/components/product/ProductManageSearch'
import ProductManageTable from '@/components/product/ProductManageTable'
import authorButtons from '@/compositionApi/authorButtons'
import { backTableTop } from '@/utils/util'
import {useRoute} from "vue-router";
export default {
  name: 'productLibrary',
  components: {
    ProductManageSearch,
    ProductManageTable,
  },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons()
    const buttonAuthor = BUTTONS.value
    const data = reactive({
      showBack: false,
      isFixed: true,
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
      searchMsg: {
        proStatus: ['1'],
      },
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http

    watch(
      () => data.isFixed,
      (val) => {
        if (!val) {
          nextTick(() => {
            const dom = document.getElementsByClassName('box-main')[0]
            dom.addEventListener('scroll', (e) => {
              if (e.target.scrollTop > 500) data.showBack = true
              else data.showBack = false
            })
          })
        }
      }
    )

    const backTop = () => {
      const dom = document.getElementsByClassName('box-main')[0]
      dom.scrollTo(0, 0)
    }

    onBeforeMount(() => {})
    onMounted(() => {
      const route = useRoute();
      console.log(route.query.sku)
        if(!route.query.sku){
          getDataList()
        }else {
          api.product
              .getProductList({likeSku:route.query.sku,skuType:'2'})
              .then((res) => {
                if (res.code == 200) {
                  console.log(9527)
                  data.tableData = res.data.records
                  data.tableInfo.current = res.data.current
                  data.tableInfo.size = res.data.size
                  data.myPages.pageSize = res.data.size
                  data.myPages.pageNum = res.data.current
                  data.myPages.pages = res.data.pages
                  data.myPages.total = res.data.total
                  nextTick(() => {
                    backTableTop('#ProductManageTable', data.scroll)
                  })
                  nextTick(()=>{
                    console.log(data.tableData[0])
                    vue.$refs.ProductManageTable.handelOpen('edit',data.tableData[0],'',false)
                  })
                  data.tableLoading = false
                } else {
                  vue.$message({
                    type: 'warning',
                    message: res.msg,
                  })
                  data.tableLoading = false
                }
              })
              .catch(() => {
                data.tableLoading = false
              })

        }
      window.addEventListener('scroll', handleScroll, true)
    })
    onActivated(() => {
      console.log(1111)
      // getDataList();
      setTimeout(() => {
        backTableTop('#ProductManageTable', data.scroll)
      }, 100)
      window.addEventListener('scroll', handleScroll, true)
    })
    onDeactivated(() => {
      window.removeEventListener('scroll', handleScroll, true)
      // vue.$refs.ProductManageSearch.reset()
    })
    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll, true)
    })
    const handleScroll = () => {
      data.scroll = document.querySelector(`#ProductManageTable`).scrollTop
    }
    const refData = toRefs(data)

    const getDataList = (msg) => {
      data.searchMsg = msg || data.searchMsg
      let info = {}
      if (data.searchMsg) {
        info = data.searchMsg
        info.size = data.tableInfo.size
        info.current = data.tableInfo.current
      }
      if (info.affiliateSalesManager && info.affiliateSalesManager.length > 0) {
        info.affiliateSalesManager = info.affiliateSalesManager.join(',')
      }
      data.tableLoading = true
      api.product
        .getProductList(info)
        .then((res) => {
          if (res.code == 200) {
            data.tableData = res.data.records
            data.tableInfo.current = res.data.current
            data.tableInfo.size = res.data.size
            data.myPages.pageSize = res.data.size
            data.myPages.pageNum = res.data.current
            data.myPages.pages = res.data.pages
            data.myPages.total = res.data.total
            if (msg && msg.scroll == 0) {
              data.scroll = 0
            }
            nextTick(() => {
              backTableTop('#ProductManageTable', data.scroll)
            })
            data.tableLoading = false
          } else {
            vue.$message({
              type: 'warning',
              message: res.msg,
            })
            data.tableLoading = false
          }
        })
        .catch(() => {
          data.tableLoading = false
        })
    }
    provide('getDataList', getDataList)
    provide('getTableData', getDataList)
    const handleSizeChange = (val) => {
      data.tableInfo.size = val
      let info = data.searchMsg
      info.size = data.tableInfo.size
      data.searchMsg = info
      data.scroll = 0
      getDataList(data.searchMsg)
    }
    const handleCurrentChange = (val) => {
      data.tableInfo.current = val
      let info = data.searchMsg
      info.current = data.tableInfo.current
      data.searchMsg = info
      data.scroll = 0
      getDataList(data.searchMsg)
    }


    return {
      ...refData,
      buttonAuthor,
      getDataList,
      handleSizeChange,
      handleCurrentChange,
      backTop,
    }
  },
}
</script>

<style scoped lang="scss">
.box-main {
  // padding-bottom: 55px;
  height: calc(100% - 55px);
  overflow-y: scroll;
  overflow-x: hidden;
}
.affix {
  position: fixed;
  right: 30px;
  top: 100px;
  z-index: 9999;
}
.backtop {
  position: fixed;
  bottom: 100px;
  right: 40px;
  z-index: 999;
  width: 40px;
  height: 40px;
  cursor: pointer;
}
</style>
