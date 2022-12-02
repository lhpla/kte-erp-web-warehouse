<!-- 采购产品信息初录 -->
<template>
  <div id="ProductEntry">
    <SearchPanel ref="SearchPanel"></SearchPanel>
    <ProductEntryList ref="ProductEntryList" :tableData="tableData" :tableLoading="tableLoading"></ProductEntryList>
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
import SearchPanel from "../../components/purchase/secondary/SearchPanel.vue";
import ProductEntryList from "../../components/purchase/ProductEntryList.vue";
import { localGet, backTableTop } from "../../utils/util";
import authorButtons from "../../compositionApi/authorButtons";
export default {
  name: "productEntry",
  components: {
    SearchPanel,
    ProductEntryList,
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
      tableData: [],
      tableInfo: {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10, // 每页10条
      },
      searchMsg: {},
      tableLoading: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
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
        backTableTop("#ProductEntryList", data.scroll);
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
      data.scroll = document.querySelector(`#ProductEntryList .el-table .el-table__body-wrapper`).scrollTop;
    };
    const refData = toRefs(data);

    // 搜索框控制显示
    const searchPanel = () => {
      let msg = {
        type: 6,
        isAdd: false,
        isEdit: true,
      };
    };

    // 获取信息列表
    const getTableData = msg => {
      console.log("msg", msg);
      data.searchMsg = msg || data.searchMsg;
        data.tableLoading = true;
        let info = {};
        if (data.searchMsg) {
          info = data.searchMsg;
          info.isAdministrator = 0;
        } else {
          info.isAdministrator = 0;
        }
        if (!buttonAuthor.isAdministrator) {
          info.purchaseUserId = localGet("userInfo").user_id;
        }
        api.develop
          .getPurchaseList(info)
          .then(res => {
            if (res.code == 200) {
              data.myPages.pageSize = res.data.size;
              data.tableInfo.current = res.data.current;
              data.tableInfo.size = res.data.size;
              data.myPages.pageNum = res.data.current;
              data.myPages.pages = res.data.pages;
              data.myPages.total = res.data.total;

              res.data.records.map((item, index) => {
                //当前数据情况  判断当前数据是否可在采购初录进行操作
                // 1、采购初录进行申请分配 并且该数据未分配完成
                // 2、开发二录进行申请分配 并且该数据未分配完成
                // 3、当前数据为 录入完成
                // 4、当前数据为 作废
                if (
                  (item.isPurchaseSecondDistribution == 1 && item.isCompleteAssigned != 1) ||
                  (item.isDevelopSecondDistribution == 1 && item.isCompleteAssigned != 1)
                ) {
                  item.isOperation = false;
                } else {
                  item.isOperation = true;
                }
              });
              data.tableData = res.data.records;
              vue.$refs.ProductEntryList.getTableList(msg);
              if (msg && msg.scroll == 0) {
                data.scroll = 0;
              }
              nextTick(() => {
                backTableTop("#ProductEntryList", data.scroll);
              });
              data.tableLoading = false;
            } else {
              vue.$message({
                type: "warning",
                message: res.msg,
              });
              vue.$refs.ProductEntryList.getTableList();
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

    return {
      ...refData,
      handleSizeChange,
      handleCurrentChange,
      getTableData,
      searchPanel,
      buttonAuthor,
    };
  },
};
</script>
<style scoped lang="scss"></style>
