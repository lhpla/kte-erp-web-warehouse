<!--助理审核列表 -->
<template>
  <div>
    <SearchPanel ref="SearchPanel" moduleType="3"></SearchPanel>
    <AssistantAuditList ref="AssistantAuditList" :tableLoading="tableLoading" :tableData="tableData"></AssistantAuditList>
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
import { reactive, toRefs, onBeforeMount, onMounted, getCurrentInstance, provide, ref, nextTick, onActivated, onDeactivated, onBeforeUnmount } from "vue";
import SearchPanel from "@/components/develop/serachCom/AssistantAuditSearch.vue";
import AssistantAuditList from "@/components/develop/auditManage/AssistantAuditList.vue";
import {  backTableTop } from "@/utils/util";
import authorButtons from "@/compositionApi/authorButtons";
export default {
  name: "assistantAudit",
  components: {
    SearchPanel,
    AssistantAuditList,
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
      searchMsg: {},
      tableLoading: false,
      tableData: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      getTableData();
      searchPanel();
      window.addEventListener("scroll", handleScroll, true);
    });
    onActivated(() => {
      // getTableData();
      setTimeout(() => {
        backTableTop("#AssistantAuditList", data.scroll);
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
      data.scroll = document.querySelector(`#AssistantAuditList .el-table .el-table__body-wrapper`).scrollTop;
    };
    const refData = toRefs(data);
    // 搜索框控制显示
    const searchPanel = () => {
      let msg = {
        type: 4,
        isAdd: false,
        isEdit: false,
      };
      vue.$refs.SearchPanel.getType(msg);
    };
    // 获得选品列表
    const getTableData = msg => {
      data.searchMsg = msg || data.searchMsg;
      // if (buttonAuthor.dataDetails) {
        data.tableLoading = true;
        let info = {};
        if (data.searchMsg) {
          info = data.searchMsg;
        }
        api.develop
          .getAssistantList(info)
          .then(res => {
            if (res.code == 200) {
              data.tableData = res.data.records;
              data.tableInfo.current = res.data.current;
              data.tableInfo.size = res.data.size;
              data.myPages.pageSize = res.data.size;
              data.myPages.pageNum = res.data.current;
              data.myPages.pages = res.data.pages;
              data.myPages.total = res.data.total;
              if (msg && msg.scroll == 0) {
                data.scroll = 0;
              }
              nextTick(() => {
                vue.$refs.AssistantAuditList.getTableList(msg);
                backTableTop("#AssistantAuditList", data.scroll);
                data.scroll = 0;
              });
              data.tableLoading = false;
            } else {
              vue.$message({
                type: "warning",
                message: res.msg,
              });
              nextTick(() => {
                vue.$refs.AssistantAuditList.getTableList();
              });
              data.tableLoading = false;
            }
          })
          .catch(err => {
            data.tableLoading = false;
          });
      // }
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
      handleSizeChange,
      handleCurrentChange,
      searchPanel,
      getTableData,
    };
  },
};
</script>
<style lang="scss" scoped></style>
