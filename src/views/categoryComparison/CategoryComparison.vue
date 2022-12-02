<!--CategoryComparison  品类对照表-->
<template>
  <div id="CategoryComparison">
    <CategoryComparisonLeft
      :tableLoading="tableLoading"
      :tableData="tableData"
      :defaultExpandedKeys="defaultExpandedKeys"
      ref="CategoryComparisonLeft"
      v-model:sysCategoryId="sysCategoryId"
      v-model:isClickLeftNode="isClickLeftNode"
      v-model:currentNodeKey="currentNodeKey"
      v-model:type="type"
      v-model:isDisable="isDisable"
    ></CategoryComparisonLeft>
    <CategoryComparisonRight
      :sysCategoryId="sysCategoryId"
      :count="count"
      v-model:isDisable="isDisable"
      v-model:isClickLeftNode="isClickLeftNode"
      ref="CategoryComparisonRight"
    ></CategoryComparisonRight>
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
} from "vue";
import CategoryComparisonLeft from "./CategoryComparisonLeft.vue";
import CategoryComparisonRight from "./CategoryComparisonRight.vue";
import authorButtons from "@/compositionApi/authorButtons";

export default {
  name: "categoryComparison",
  components: { CategoryComparisonLeft, CategoryComparisonRight },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
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
      defaultExpandedKeys: [],
      currentNodeKey: "",
      type: "0",
      // 点击左侧数据
      isClickLeftNode: false,
      isDisable: 1,
      count: "",
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    // 品类id
    const sysCategoryId = ref("");

    onBeforeMount(() => {
      getTableData();
    });
    onMounted(() => {});
    const refData = toRefs(data);

    const getTableData = (msg) => {
      data.searchMsg = msg || data.searchMsg;
      let info = {};
      if (data.searchMsg) {
        info = data.searchMsg;
        // info.size = data.tableInfo.size;
        info.type = data.type;
      }
      data.tableData = [];
      data.tableLoading = true;
      if (data.type == 0) {
        api.product
          .categorySysCategoryList(info)
          .then((res) => {
            if (res.code == 200) {
              // data.tableData = res.data.records;
              console.log(res);
              data.tableData = res.data.data;
              data.count = res.data.count;
              data.currentNodeKey = res.data.data[0].id;
              if (res.data.length > 0) {
                data.defaultExpandedKeys = [res.data.data[0].id];
              }
              // data.tableInfo.current = res.data.current;
              // data.tableInfo.size = res.data.size;
              // data.myPages.pageSize = res.data.size;
              // data.myPages.pageNum = res.data.current;
              // data.myPages.pages = res.data.pages;
              // data.myPages.total = res.data.total;
              nextTick(() => {
                backTableTop("#CategoryComparison");
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
          });
      } else {
        api.product
          .categorySysCategoryList(info)
          .then((res) => {
            if (res.code == 200) {
              // data.tableData = res.data.records;
              console.log(res);
              data.tableData = res.data.data;
              data.count = res.data.count;
              data.currentNodeKey = res.data.data[0].id;
              if (res.data.length > 0) {
                data.defaultExpandedKeys = [res.data.data[0].id];
              }
              // data.tableInfo.current = res.data.current;
              // data.tableInfo.size = res.data.size;
              // data.myPages.pageSize = res.data.size;
              // data.myPages.pageNum = res.data.current;
              // data.myPages.pages = res.data.pages;
              // data.myPages.total = res.data.total;
              nextTick(() => {
                backTableTop("#CategoryComparison");
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
          });
      }
    };
    provide("getTableData", getTableData);

    return {
      ...refData,
      getTableData,
      sysCategoryId,
      buttonAuthor,
    };
  },
};
</script>
<style scoped lang="scss">
#CategoryComparison {
  display: flex;
  #CategoryComparisonLeft {
    min-width: 350px;
    margin: 20px;
    margin-right: 10px;
    height: calc(100vh - 160px);
    overflow-y: scroll;
    border: 2px solid #e9e9e9;
    flex: 0.2;
  }
  #CategoryComparisonRight {
    flex: 0.75;
    margin: 20px;
    margin-left: 0;
    line-height: 1.5em;
  }
}
</style>
