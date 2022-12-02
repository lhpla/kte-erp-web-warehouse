<!--产品终审-->
<template>
  <div>
    <SearchPanel ref="SearchPanel" moduleType="2"></SearchPanel>
    <ProductAuditList ref="ProductAuditList" :tableLoading="tableLoading" :tableData="tableData"></ProductAuditList>
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
import SearchPanel from "../../components/develop/serachCom/ProductAuditSearch.vue";
import ProductAuditList from "../../components/develop/auditManage/ProductAuditList.vue";
import { backTableTop } from "../../utils/util";
import authorButtons from "../../compositionApi/authorButtons";

export default {
  name: "productAudit",
  components: {
    SearchPanel,
    ProductAuditList,
  },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
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
      tableData: [],
      searchMsg: {},
      tableLoading: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      searchPanel();
      getTableData();
      window.addEventListener("scroll", handleScroll, true);
    });
    onActivated(() => {
      // getTableData();
      setTimeout(() => {
        backTableTop("#ProductAuditList", data.scroll);
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
      data.scroll = document.querySelector(`#ProductAuditList .el-table .el-table__body-wrapper`).scrollTop;
    };

    // 获得终审列表
    const getTableData = msg => {
      data.searchMsg = msg || data.searchMsg;
        data.tableLoading = true;
        let info = {};
        if (data.searchMsg) {
          info = data.searchMsg;
        }
        api.develop
          .getAuditList(info)
          .then(res => {
            if (res.code == 200) {
              data.tableData = res.data.records;
              data.tableInfo.current = res.data.current;
              data.tableInfo.size = res.data.size;
              data.myPages.pageSize = res.data.size;
              data.myPages.pageNum = res.data.current;
              data.myPages.pages = res.data.pages;
              data.myPages.total = res.data.total;
              vue.$refs.ProductAuditList.getTableList(info);
              if (msg && msg.scroll == 0) {
                data.scroll = 0;
              }
              nextTick(() => {
                backTableTop("#ProductAuditList", data.scroll);
                data.scroll = 0;
              });
              data.tableLoading = false;
            } else {
              vue.$message({
                type: "warning",
                message: res.msg,
              });
              vue.$refs.ProductAuditList.getTableList();
              data.tableLoading = false;
            }
          })
          .catch(err => {
            data.tableLoading = false;
          });
    };
    provide("getTableData", getTableData);

    // 搜索框控制显示
    const searchPanel = () => {
      let msg = {
        type: 7,
        isAdd: false,
        isEdit: false,
      };
      vue.$refs.SearchPanel.getType(msg);
    };
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
    const refData = toRefs(data);
    return {
      ...refData,
      handleSizeChange,
      handleCurrentChange,
      searchPanel,
      getTableData,
    };
  },
};
</script>
<style lang="scss" scoped></style>
