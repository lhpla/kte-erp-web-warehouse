<!-- productException 产品异常列表 -->
<template>
  <div id="productException">
    <productExceptionSearch />
    <productExceptionTable
      :tableData="tableData"
      :tableLoading="tableLoading"
      :searchMsg="searchMsg"
    />
    <Pagination
      :total="myPages.total"
      :limit="myPages.pageSize"
      :page="myPages.pageNum"
      @update:limit="myPages.pageSize = $event"
      @update:page="myPages.pageNum = $event"
      :hidden="myPages.total <= 0"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
      class="PurchaseDownListTable"
    ></Pagination>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  ref,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
  provide,
  nextTick,
  onActivated,
  onDeactivated,
  onBeforeUnmount,
} from "vue";
import productExceptionSearch from "@/components/product/productException/productExceptionSearch";
import productExceptionTable from "@/components/product/productException/productExceptionTable.vue";
import authorButtons from "@/compositionApi/authorButtons";
import { backTableTop } from "@/utils/util";
export default {
  name: "productException",
  components: {
    productExceptionSearch,
    productExceptionTable,
  },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      tableData: [],
      tableLoading: false,
      myPages: {
        pageSize: 10,
        pageNum: 1,
        pages: 1,
        total: 0,
      },
      tableInfo: {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10, // 每页10条
      },
      searchMsg: {
        current: 1, // 当前页为 1
        size: 10, // 每页10条
      },
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      getTableData();
    });
    const getTableData = (msg) => {
        data.searchMsg = msg || data.searchMsg;
        let info = {};
        if (data.searchMsg) {
          info = data.searchMsg;
          info.size = data.tableInfo.size;
          info.current = data.tableInfo.current;
        }
        data.tableLoading = true;
        data.tableData = [];
        api.warehouse.abnormalProductList(info).then((res) => {
          if (res.code == 200) {
            data.tableData = res.data.records;
            data.tableInfo.current = res.data.current;
            data.tableInfo.size = res.data.size;
            data.myPages.pageSize = res.data.size;
            data.myPages.pageNum = res.data.current;
            data.myPages.pages = res.data.pages;
            data.myPages.total = res.data.total;
          }
        });
        data.tableLoading = false;
    };
    provide("getTableData", getTableData);
    const handleSizeChange = (val) => {
      data.tableInfo.size = val;
      let info = data.searchMsg;
      info.size = data.tableInfo.size;
      data.searchMsg = info;
      getTableData(data.searchMsg);
    };
    const handleCurrentChange = (val) => {
      data.tableInfo.current = val;
      let info = data.searchMsg;
      info.current = data.tableInfo.current;
      data.searchMsg = info;
      getTableData(data.searchMsg);
    };
    const refData = toRefs(data);
    return {
      ...refData,
      handleSizeChange,
      handleCurrentChange,
      buttonAuthor,
    };
  },
};
</script>
<style scoped lang="scss"></style>
