<!-- 产品限价 -->
<template>
  <div id="ProductPrice">
    <ProductPriceSearch ref="ProductPriceSearch"></ProductPriceSearch>
    <ProductPriceTable :tableData="tableData" :tableLoading="tableLoading" ref="ProductPriceTable"></ProductPriceTable>
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
import { reactive, toRefs, onBeforeMount, onMounted, getCurrentInstance, provide, nextTick, onActivated, onDeactivated, onBeforeUnmount } from "vue";
import ProductPriceTable from "../../components/productPrice/ProductPriceTable.vue";
import ProductPriceSearch from "@/components/productPrice/ProductPriceSearch.vue";
import authorButtons from "@/compositionApi/authorButtons";
import { backTableTop } from "../../utils/util";

export default {
  name: "productPrice",
  components: {
    ProductPriceTable,
    ProductPriceSearch,
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
      scroll: 0,
      tableInfo: {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10, // 每页10条
      },
      searchMsg: {},
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      getTableData();
      window.addEventListener("scroll", handleScroll, true);
    });
    onActivated(() => {
      setTimeout(() => {
        backTableTop("#ProductPriceTable", data.scroll);
      }, 100);
      window.addEventListener("scroll", handleScroll, true);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("scroll", handleScroll, true);
    });
    onDeactivated(() => {
      window.removeEventListener("scroll", handleScroll, true);
    });
    const handleScroll = () => {
      data.scroll = document.querySelector(`#ProductPriceTable .el-table .el-table__body-wrapper`).scrollTop;
    };
    const refData = toRefs(data);
    const getTableData = msg => {
      data.searchMsg = msg || data.searchMsg;
      let info = {};
      if (data.searchMsg) {
        info = data.searchMsg;
        info.size = data.tableInfo.size;
        info.current = data.tableInfo.current;
      }
      data.tableData = [];
      data.tableLoading = true;
        api.sensitive.getPageList(info).then(res => {
          if (res.code == 200) {
            data.tableData = res.data.records;
            data.tableInfo.current = res.data.current;
            data.tableInfo.size = res.data.size;
            data.myPages.pageSize = res.data.size;
            data.myPages.pageNum = res.data.current;
            data.myPages.pages = res.data.pages;
            data.myPages.total = res.data.total;
            nextTick(() => {
              console.log("tt2", data.scroll);
              backTableTop("#ProductPriceTable", data.scroll);
            });
          } else {
            vue.$message({
              type: "warning",
              message: res.msg,
            });
          }
        });
      data.tableLoading = false;
    };

    provide("getTableData", getTableData);
    const handleSizeChange = val => {
      data.tableInfo.size = val;
      let info = data.searchMsg;
      info.size = data.tableInfo.size;
      data.searchMsg = info;
      data.scroll = 0;
      getTableData(data.searchMsg);
    };
    const handleCurrentChange = val => {
      data.tableInfo.current = val;
      let info = data.searchMsg;
      info.current = data.tableInfo.current;
      data.searchMsg = info;
      data.scroll = 0;
      getTableData(data.searchMsg);
    };
    return {
      ...refData,
      getTableData,
      handleSizeChange,
      handleCurrentChange,
      buttonAuthor,
    };
  },
};
</script>
<style scoped lang='scss'></style>
