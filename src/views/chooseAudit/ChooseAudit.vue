<!-- 选品审核 -->
<template>
  <div>
    <SearchPanel ref="SearchPanel"></SearchPanel>
    <ChooseAuditLsit ref="ChooseAuditLsit" :tableLoading="tableLoading" :tableData="tableData"></ChooseAuditLsit>
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
import SearchPanel from "../../components/develop/serachCom/ChooseProductsSearch.vue";
import ChooseAuditLsit from "../../components/develop/auditManage/ChooseAuditLsit.vue";
import { backTableTop } from "../../utils/util";
import authorButtons from "../../compositionApi/authorButtons";
export default {
  name: "chooseAudit",
  components: {
    SearchPanel,
    ChooseAuditLsit
  },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      myPages: {
        pageSize: 10,
        pageNum: 1,
        pages: 1,
        total: 0
      },
      scroll: 0,
      tableInfo: {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10 // 每页10条
      },
      searchMsg: {},
      tableLoading: false,
      tableData: []
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      searchPanel();
      getTableData();
    });
    onActivated(() => {
      // getTableData();
      setTimeout(() => {
        backTableTop("#ChooseAuditLsit", data.scroll);
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
      data.scroll = document.querySelector(`#ChooseAuditLsit .el-table .el-table__body-wrapper`).scrollTop;
    };
    // 获得选品列表
    const getTableData = msg => {
      data.searchMsg = msg || data.searchMsg;
      // if (buttonAuthor.dataDetails) {
        data.tableLoading = true;
        let info = {};
        if (data.searchMsg) {
          info = data.searchMsg;
          info.isAdministrator = 1;
        } else {
          info.isAdministrator = 1;
        }
        api.develop
          .getPageList(info)
          .then(res => {
            if (res.code == 200) {
              data.tableData = res.data.records;
              data.tableInfo.current = res.data.current;
              data.tableInfo.size = res.data.size;
              data.myPages.pageSize = res.data.size;
              data.myPages.pageNum = res.data.current;
              data.myPages.pages = res.data.pages;
              data.myPages.total = res.data.total;
              vue.$refs.ChooseAuditLsit.getTableList(info);
              if (msg && msg.scroll == 0) {
                data.scroll = 0;
              }
              nextTick(() => {
                backTableTop("#ChooseAuditLsit", data.scroll);
              });
              data.tableLoading = false;
            } else {
              vue.$message({
                type: "warning",
                message: res.msg
              });
              vue.$refs.ChooseAuditLsit.getTableList();
              data.tableLoading = false;
            }
          })
          .catch(err => {
            data.tableLoading = false;
          });
      // }
    };
    // 搜索框控制显示
    const searchPanel = () => {
      let msg = {
        type: 5,
        isAdd: false,
        isEdit: false
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
    provide("getTableData", getTableData);
    const refData = toRefs(data);
    return {
      ...refData,
      handleSizeChange,
      handleCurrentChange,
      searchPanel,
      getTableData
    };
  }
};
</script>
<style lang="scss" scoped></style>
