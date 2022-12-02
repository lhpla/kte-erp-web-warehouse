<!--品类对照表日志  CategoryTabLog-->
<template>
  <div id="CategoryTabLog">
    <el-dialog title="操作日志" width="85%" v-model="logVisible" :close-on-click-modal="false" @close="closed" destroy-on-close>
      <el-table :header-cell-style="rowClass" :data="logTableData" tooltip-effect="dark" element-loading-text="加载中" v-loading="loading" border>
        <el-table-column label="#" type="index" align="center" width="40"></el-table-column>
        <el-table-column prop="context" label="内容" align="center"></el-table-column>
        <el-table-column prop="createUserName" align="center" label="操作人名称" width="200"></el-table-column>
        <el-table-column prop="createTime" align="center" label=" 创建时间" width="200"></el-table-column>
      </el-table>
      <el-pagination
        class="log-pagination"
        background
        @size-change="handleSizeChangeLog"
        @current-change="handleCurrentChangeLog"
        :current-page="pageableLog.current"
        :page-sizes="[10, 25, 50, 100]"
        :page-size="pageableLog.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageableLog.total"
      ></el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from "vue";
export default {
  name: "CategoryTabLog",
  setup(prop, ctx) {
    const data = reactive({
      // log日志表格数据
      logTableData: [],
      //日志
      logVisible: false,
      // 加载loading
      loading: false,
      logTitle: "原片",
      resources: [],
      logType: 1,
      // 日志分页
      pageableLog: {
        current: 1,
        size: 10,
        total: 0,
      },
      id: "",
      type: "",
      rowClass: { background: "#fafafa", color: "#2d2f30", fontWeight: "bold", fontSize: "12px" },
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const refData = toRefs(data);

    // 打开loading
    const checkLogDialog = () => {
      data.logVisible = true;
      handleLog();
    };

    // 查看日志
    const handleLog = () => {
      data.logTableData = [];
      let logData = {
        current: data.pageableLog.current,
        size: data.pageableLog.size,
      };
      api.product.CategoryMappingLog(logData).then(res => {
        if (res.code == 200) {
          console.log(res.data);
          data.logTableData = res.data.records;
          data.pageableLog.size = res.data.size;
          data.pageableLog.current = res.data.current;
          data.pageableLog.total = res.data.total;
        } else {
          vue.$message({
            type: "warning",
            message: res.msg,
          });
        }
      });
    };
    // 日志每页条数发生改变
    const handleSizeChangeLog = val => {
      console.log(val);
      data.pageableLog.size = val;
      handleLog(data.id);
    };
    // 日志当前页发生改变
    const handleCurrentChangeLog = val => {
      data.pageableLog.current = val;
      handleLog(data.id);
    };

    // closed 关闭弹框回调
    const closed = () => {
      data.logVisible = false;
      data.logTableData = [];
    };
    return {
      ...refData,
      checkLogDialog,
      closed,
      handleSizeChangeLog,
      handleCurrentChangeLog,
    };
  },
};
</script>
<style scoped lang="scss">
#CategoryTabLog {
  .log-pagination {
    display: flex;
    justify-content: flex-end;
    position: static;
    bottom: 0;
    right: 0;
    background: #fff;
    border: none;
    border-radius: 50px;
    margin: -50px 0 10px 0;
  }
}
</style>
