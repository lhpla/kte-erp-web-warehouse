<!-- 选品列表（选品助理/主管） -->
<template>
  <div>
    <SearchPanel ref="SearchPanel"></SearchPanel>
    <ChooseProductsList
      ref="ChooseProductsList"
      :tableLoading="tableLoading"
      :tableData="tableData"
    ></ChooseProductsList>
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
import {
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
  provide,
  nextTick,
  onActivated,
  onDeactivated,
  onBeforeUnmount,
} from "vue";
import SearchPanel from "@/components/develop/serachCom/ChooseProductsSearch.vue";
import ChooseProductsList from "@/components/develop/chooseManage/ChooseProductsList.vue";
import { backTableTop, localGet, localSet, cloneParmas } from "@/utils/util";
import authorButtons from "@/compositionApi/authorButtons";
export default {
  name: "chooseProducts",
  components: {
    SearchPanel,
    ChooseProductsList,
  },

  setup(prop, ctx) {
    const test = [];
    const data = reactive({
      myPages: {
        pageSize: 10,
        pageNum: 1,
        pages: 1,
        total: 0,
      },
      scroll: 0,
      scroll0: 0,
      tableInfo: {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10, // 每页10条
      },
      tableData: [],
      userInfo: {},
      searchMsg: {},
      tableLoading: false,
    });
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
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
        backTableTop("#ChooseProductsList", data.scroll);
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
      data.scroll = document.querySelector(
        `#ChooseProductsList .el-table .el-table__body-wrapper`
      ).scrollTop;
    };

    // 获得选品列表
    const getTableData = (msg) => {
      data.searchMsg = msg || data.searchMsg;
      // if (buttonAuthor.dataDetails) {
        data.tableLoading = true;
        let info = {};
        if (data.searchMsg) {
          info = data.searchMsg;
          info.isAdministrator = 0;
        } else {
          info.isAdministrator = 0;
        }
        if (!buttonAuthor.isAdministrator) {
          info.createUser = localGet("userInfo").user_id;
        }
        api.develop
          .getSelectionList(info)
          .then((res) => {
            if (res.code == 200) {
              const { records, current, size, total, pages } = res.data;
              data.tableData = records;
              data.tableInfo.current = current;
              data.tableInfo.size = size;
              data.myPages.pageSize = size;
              data.myPages.pageNum = current;
              data.myPages.pages = pages;
              data.myPages.total = total;
              vue.$refs.ChooseProductsList.getTableList(info); 
              if (msg && msg.scroll == 0) {
                data.scroll = 0;
              }
              nextTick(() => {
                backTableTop("#ChooseProductsList", data.scroll);
                data.scroll = 0;
              });
              data.tableLoading = false;
            } else {
              vue.$message({
                type: "warning",
                message: res.msg,
              });
              vue.$refs.ChooseProductsList.getTableList();
              data.tableLoading = false;
            }
          })
          .catch((err) => {
            data.tableLoading = false;
          });
      // }
    };
    provide("getTableData", getTableData);
    // 搜索框控制显示
    const searchPanel = () => {
      data.userInfo = localGet("userInfo");
      let msg = {
        type: 1,
        isAdd: true,
        userInfo: data.userInfo,
        isEdit: true,
      };

      vue.$refs.SearchPanel.getType(msg);
    };

    const handleSizeChange = (val) => {
      data.tableInfo.size = val;
      let info = data.searchMsg;
      info.size = data.tableInfo.size;
      data.searchMsg = info;
      data.scroll = 0;
      getTableData(data.searchMsg);
    };
    const handleCurrentChange = (val) => {
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
      getTableData,
      searchPanel,
    };
  },
};
</script>
<style lang="scss" scoped></style>
