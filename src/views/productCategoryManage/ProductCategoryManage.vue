<!-- 产品品类管理 -->
<template>
  <div class="main-box" id="mainBox">
    <div class="table-box">
      <!-- 搜素 -->
      <ProductCategoryManageSearch
      ></ProductCategoryManageSearch>
      <!-- 表格部分 -->
      <ProductCategoryManageTable
        ref="ProductCategoryManageTable"
        v-model:searchMsg="searchMsg"
        :tableData="tableData"
        :count="count"
        :failCount="failCount"
        :passCount="passCount"
        :waitingAuditCount="waitingAuditCount"
        :tableLoading="tableLoading"
      ></ProductCategoryManageTable>
    </div>
    <!-- <span style="display: none" @removeRowChild="removeRowChild"></span> -->
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
import tablePage from "@/compositionApi/tablePage";
import authorButtons from "@/compositionApi/authorButtons";
import { localRemove, backTableTop } from "@/utils/util";
import ProductCategoryManageSearch from "@/components/product/ProductCategoryManageSearch.vue";
import ProductCategoryManageTable from "@/components/product/ProductCategoryManageTable.vue";
export default {
  name: "productCategoryManage",
  components: { ProductCategoryManageSearch, ProductCategoryManageTable },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const {
      dataService,
      dataApi,
      tableData,
      loading,
      searchShow,
      pageable,
      searchParam,
      rowClass,
      search,
      reset,
      handleSizeChange,
      handleCurrentChange,
      getTableList,
    } = tablePage();
    const productFormRef = ref(null);
    const data = reactive({
      // 分页信息
      myPages: {
        pageSize: 10,
        pageNum: 1,
        pages: 1,
        total: 0,
      },
      // 当前分页数据
      tableInfo: {
        current: 1, // 当前页为 1
        size: 10, // 每页10条
      },
      searchMsg: {},
      tableLoading: false,
      //表格数据
      tableData: [],
      productForm: {},
      flag: true,
      count: "",
      failCount: "",
      passCount: "",
      waitingAuditCount: "",
      scroll: "",
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const cateTable = ref(null);
    onBeforeMount(() => {});
    onMounted(() => {
      getTableData(data.searchMsg, true);
      window.addEventListener("scroll", handleScroll, true);
    });
    onActivated(() => {
      // getTableData();
      setTimeout(() => {
        backTableTop("#ProductCategoryManageTable", data.scroll);
      }, 100);
      window.addEventListener("scroll", handleScroll, true);
    });
    onDeactivated(() => {
      window.removeEventListener("scroll", handleScroll, true);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("scroll", handleScroll, true);
    });
    const handleScroll = () => {
      // data.scroll = document.querySelector(`#OrderListTable .el-table .el-table__body-wrapper`).scrollTop;
      data.scroll = document.querySelector(`#mainBox`).scrollTop;
      console.log(data.scroll);
    };

    const getTableData = (msg, type) => {
        data.searchMsg = msg || data.searchMsg;
        let info = {};
        if (data.searchMsg) {
          info = data.searchMsg;
        }
        data.tableData = [];
        vue.$refs.ProductCategoryManageTable.choiceList = [];
        vue.$refs.ProductCategoryManageTable.auditList = [];
        vue.$refs.ProductCategoryManageTable.distributionList = [];
        vue.$refs.ProductCategoryManageTable.selectList = [];
        vue.$refs.ProductCategoryManageTable.clear();

        data.tableLoading = true;
        console.log(data.searchMsg,"searchMsg");
        //懒加载接口
        if (type) {
          api.product
            .categoryLazyList(info)
            .then((res) => {
              if (res.code == 200) {
                // data.tableData = res.data.records;
                data.tableData = res.data.data;
                data.count = res.data.count;
                data.failCount =
                  !res.data.failCount || res.data.failCount == -1
                    ? "-"
                    : res.data.failCount;
                data.passCount =
                  !res.data.passCount || res.data.passCount == -1
                    ? "-"
                    : res.data.passCount;
                data.waitingAuditCount =
                  !res.data.waitingAuditCount ||
                  res.data.waitingAuditCount == -1
                    ? "-"
                    : res.data.waitingAuditCount;
                // data.tableInfo.current = res.data.current;
                // data.tableInfo.size = res.data.size;
                // data.myPages.pageSize = res.data.size;
                // data.myPages.pageNum = res.data.current;
                // data.myPages.pages = res.data.pages;
                // data.myPages.total = res.data.total;

                nextTick(() => {
                  backTableTop("#ProductCategoryManageTable");
                });
                data.tableLoading = false;
              } else {
                data.tableLoading = false;
                vue.$message({
                  type: "warning",
                  message: res.msg,
                });
              }
            })
            .catch((err) => {
              data.tableLoading = false;
              vue.$message.warning(err.msg);
            });
        } else {
          //有搜索条件时搜索接口
          api.product
            .getCategoryList(info)
            .then((res) => {
              if (res.code == 200) {
                // data.tableData = res.data.records;
                data.tableData = res.data.data;
                data.count = res.data.count;
                data.failCount =
                  !res.data.failCount || res.data.failCount == -1
                    ? "-"
                    : res.data.failCount;
                data.passCount =
                  !res.data.passCount || res.data.passCount == -1
                    ? "-"
                    : res.data.passCount;
                data.waitingAuditCount =
                  !res.data.waitingAuditCount ||
                  res.data.waitingAuditCount == -1
                    ? "-"
                    : res.data.waitingAuditCount;

                // data.tableInfo.current = res.data.current;
                // data.tableInfo.size = res.data.size;
                // data.myPages.pageSize = res.data.size;
                // data.myPages.pageNum = res.data.current;
                // data.myPages.pages = res.data.pages;
                // data.myPages.total = res.data.total;
                nextTick(() => {
                  backTableTop("#ProductCategoryManageTable");
                });
                data.tableLoading = false;
              } else {
                data.tableLoading = false;
                vue.$message({
                  type: "warning",
                  message: res.msg,
                });
              }
            })
            .catch((err) => {
              data.tableLoading = false;
              vue.$message.warning(err.msg);
            });
        }
    };

    // const removeRowChild = row => {
    //   if (row.categoryLevel == 2) {
    //     data.tableData.map((item, index) => {
    //       if (item.id == row.parentId) {
    //         // item.
    //       }
    //     });
    //   }
    // };

    provide("getTableData", getTableData);

    const refData = toRefs(data);
    return {
      ...refData,
      buttonAuthor,
      // removeRowChild,
    };
  },
};
</script>
<style scoped lang="scss">
.pageTitle {
  width: 95%;
  margin-left: 10px;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  .search {
    width: 400px;
    display: flex;
    span {
      display: inline-block;
      height: 30px;
      font-size: 12px;
      color: #606266;
      line-height: 30px;
    }
  }
  .table-add {
    display: flex;
    justify-content: flex-end;
    padding: 0 30px 20px 0px;
  }
}
</style>
