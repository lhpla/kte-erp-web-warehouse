<!-- secondaryDistributionList 产品二次分配 -->
<template>
  <div id="secondaryDistributionList">
    <!-- 搜搜 -->
    <SecondarySearchPanel ref="SecondarySearchPanel"></SecondarySearchPanel>
    <!-- 按钮表格部分 -->
   <SecondaryDistributionTable ref="SecondaryDistributionTable" :loading="loading" :tableData="tableData"  :searchMsg="searchMsg"></SecondaryDistributionTable>
    <!-- 分页 -->
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
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, provide, nextTick, onActivated, onDeactivated, onBeforeUnmount } from "vue";
import SecondarySearchPanel from "@/components/purchase/secondary/SecondarySearchPanel.vue";
import SecondaryDistributionTable from "@/components/purchase/secondary/SecondaryDistributionTable.vue";
import authorButtons from "@/compositionApi/authorButtons";
import { backTableTop, localGet, localSet } from "@/utils/util";
export default {
  name: "secondaryDistribution",
  components: { SecondarySearchPanel, SecondaryDistributionTable },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      // 搜索数据
      searchMsg: {},
      scroll: 0,
      // 当前页详细数据
      myPages: {
        pageSize: 10,
        pageNum: 1,
        pages: 1,
        total: 0
      },
      tableInfo: {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10 // 每页10条
      },
      // 当前表格数据
      tableData: [],
      // 分配采购负责人
      distributionProcurement: "",
      // 采购负责人列表
      purchaseAuditor: [],
      loading: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      getDataList();
      window.addEventListener("scroll", handleScroll, true);
    });
    onActivated(() => {
      setTimeout(() => {
        backTableTop("#secondaryDistributionList", data.scroll);
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
      data.scroll = document.querySelector(`#secondaryDistributionList .el-table .el-table__body-wrapper`).scrollTop;
    };

    // 获取数据
    const getDataList = msg => {
        data.loading = true;
        data.searchMsg = msg || data.searchMsg;
        let info = {};
        if (data.searchMsg) {
          info = data.searchMsg;
        }
        api.develop
          .secondAllocationInfo(info)
          .then(res => {
            if (res.code == 200) {
              data.loading = false;
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
                backTableTop("#secondaryDistributionList", data.scroll);
              });
            } else {
              data.loading = false;
            }
          })
          .catch(() => {
            data.loading = false;
          });
    };
 provide("getDataList", getDataList);

    // handleSizeChange //每页条数改变
    const handleSizeChange = val => {
      data.tableInfo.size = val;
      let info = data.searchMsg;
      info.size = data.tableInfo.size;
      data.searchMsg = info;
      data.scroll = 0;
      getDataList(data.searchMsg);
    };

    // handleCurrentChange 当前分页改变
    const handleCurrentChange = val => {
      data.tableInfo.current = val;
      let info = data.searchMsg;
      info.current = data.tableInfo.current;
      data.searchMsg = info;
      data.scroll = 0;
      getDataList(data.searchMsg);
    };

    const refData = toRefs(data);
    return {
      ...refData,
      getDataList,
      buttonAuthor,
      handleCurrentChange,
      handleSizeChange,
    };
  }
};
</script>
<style scoped lang="scss">
#secondaryDistributionList {
  .buttons {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
  .min_title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .el_form {
    margin-top: 30px;
  }
}
</style>
