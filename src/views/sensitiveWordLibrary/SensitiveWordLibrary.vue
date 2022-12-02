<!-- 敏感词库 -->
<template>
  <div>
    <SensitiveWordLibrarySearch ref="SensitiveWordLibrarySearch"></SensitiveWordLibrarySearch>
    <SensitiveWordLibraryTable :tableData="tableData" :tableLoading="tableLoading"></SensitiveWordLibraryTable>
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
import { reactive, toRefs, onBeforeMount, onMounted, getCurrentInstance, provide, nextTick } from "vue";
import SensitiveWordLibrarySearch from "../../components/sensitiveWordLibrary/SensitiveWordLibrarySearch.vue";
import SensitiveWordLibraryTable from "../../components/sensitiveWordLibrary/SensitiveWordLibraryTable.vue";
import authorButtons from "@/compositionApi/authorButtons";
import { backTableTop } from "../../utils/util";
export default {
  name: "sensitiveWordLibrary",
  components: {
    SensitiveWordLibrarySearch,
    SensitiveWordLibraryTable,
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
    });
    const refData = toRefs(data);
    const getTableData = msg => {
        data.searchMsg = msg || data.searchMsg;
        let info = {};
        if (data.searchMsg) {
          info = data.searchMsg;
        }
        data.tableData = [];
        data.tableLoading = true;
        api.sensitive
          .getSensitive(info)
          .then(res => {
            if (res.code == 200) {
              data.tableData = res.data.records;
              for (let item of data.tableData) {
                if (item.keyword.indexOf("&amp;") > -1) {
                  item.keyword = item.keyword.replace("&amp;", "&");
                }
              }
              data.tableInfo.current = res.data.current;
              data.tableInfo.size = res.data.size;
              data.myPages.pageSize = res.data.size;
              data.myPages.pageNum = res.data.current;
              data.myPages.pages = res.data.pages;
              data.myPages.total = res.data.total;
              nextTick(() => {
                backTableTop("#SensitiveWordLibraryTable");
              });
              data.tableLoading = false;
            }
          })
          .catch(() => {
            data.tableLoading = false;
          });
    };

    provide("getTableData", getTableData);
    const handleSizeChange = val => {
      data.tableInfo.size = val;
      let info = data.searchMsg;
      info.size = data.tableInfo.size;
      data.searchMsg = info;
      getTableData(data.searchMsg);
    };
    const handleCurrentChange = val => {
      data.tableInfo.current = val;
      let info = data.searchMsg;
      info.current = data.tableInfo.current;
      data.searchMsg = info;
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
