<!-- 产品二录（专员/主管） -->
<template>
  <div>
    <SearchPanel ref="SearchPanel" moduleType="1"></SearchPanel>
    <SecondEntryList ref="SecondEntryList" :tableData="tableData" :tableLoading="tableLoading"></SecondEntryList>
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
import SearchPanel from "../../components/develop/serachCom/SecondEntrySearch.vue";
import SecondEntryList from "../../components/develop/developManage/SecondEntryList.vue";
import { localGet, localSet, backTableTop } from "../../utils/util";
import authorButtons from "../../compositionApi/authorButtons";
export default {
  name: "secondEntry",
  components: {
    SearchPanel,
    SecondEntryList,
  },
  setup(prop, ctx) {
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
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    onBeforeMount(() => {});
    onMounted(() => {
      searchPanel();
      getTableData();
      window.addEventListener("scroll", handleScroll, true);
    });
    onActivated(() => {
      // getTableData();
      setTimeout(() => {
        backTableTop("#SecondEntryList", data.scroll);
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
      data.scroll = document.querySelector(`#SecondEntryList .el-table .el-table__body-wrapper`).scrollTop;
    };

    // 搜索框控制显示
    const searchPanel = () => {
      let msg = {
        type: 3,
        isAdd: false,
        isEdit: false,
      };
      vue.$refs.SearchPanel.getType(msg);
    };

    // 获得选品列表
    const getTableData = msg => {
      data.searchMsg = msg || data.searchMsg;
        data.tableLoading = true;
        let info = {};
        if (data.searchMsg) {
          info = data.searchMsg;
          info.isAdministrator = 0;
        } else {
          info = { isAdministrator: 0 };
        }
        if (!buttonAuthor.isAdministrator) {
          info.createUser = localGet("userInfo").user_id;
        }
        api.develop
          .getSecondList(info)
          .then(res => {
            if (res.code == 200) {
              data.tableData = res.data.records;
              data.tableInfo.current = res.data.current;
              data.tableInfo.size = res.data.size;
              data.myPages.pageSize = res.data.size;
              data.myPages.pageNum = res.data.current;
              data.myPages.pages = res.data.pages;
              data.myPages.total = res.data.total;
              vue.$refs.SecondEntryList.getTableList(msg);
              if (msg && msg.scroll == 0) {
                data.scroll = 0;
              }
              nextTick(() => {
                backTableTop("#SecondEntryList", data.scroll);
                data.scroll = 0;
              });
              data.tableLoading = false;
            } else {
              vue.$message({
                type: "warning",
                message: res.msg,
              });
              vue.$refs.SecondEntryList.getTableList();
              data.tableLoading = false;
            }
          })
          .catch(err => {
            data.tableLoading = false;
          });
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
