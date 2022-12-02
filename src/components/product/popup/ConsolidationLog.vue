<!-- 日志组件 -->
<template>
  <!-- 日志dialog -->
  <el-dialog
    title="操作日志"
    width="60%"
    v-model="logVisible"
    :close-on-click-modal="false"
    @close="closed"
    destroy-on-close
  >
    <el-table
      :header-cell-style="{
        background: '#fafafa',
        color: '#2d2f30',
        fontWeight: 'bold',
        fontSize: '12px',
      }"
      :data="logTableData"
      tooltip-effect="dark"
      element-loading-text="加载中"
      v-loading="loading"
      border
    >
      <el-table-column
        label="#"
        type="index"
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="mergeSku"
        label="合并sku"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="conflatedSku"
        label="被合并sku"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="createUserName"
        label="操作人"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="时间"
        show-overflow-tooltip
      ></el-table-column>
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
</template>

<script>
import {
  reactive,
  toRefs,
  ref,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
} from "vue";
export default {
  name: "ConsolidationLog",
  emits: ["getLog"],
  setup(prop, { emit }) {
    const data = reactive({
      funMsg: {},
      // log日志表格数据
      logTableData: [],
      // 操作日志
      logVisible: false,
      // logID
      logDataId: null,
      // 日志分页
      pageableLog: {
        current: null,
        size: null,
        total: null,
      },
      // 加载loading
      loading: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const refData = toRefs(data);
    // 日志每页条数发生改变
    const handleSizeChangeLog = (val) => {
      data.pageableLog.size = val;
      emit("getLog", data.pageableLog.current, data.pageableLog.size);
    };
    // 日志当前页发生改变
    const handleCurrentChangeLog = (val) => {
      data.pageableLog.current = val;
      emit("getLog", data.pageableLog.current, data.pageableLog.size);
    };
    // 打开loading
    const checkLogDialog = (funMsg) => {
      data.logVisible = true;
      data.funMsg = funMsg;
    };

    // 获取数据
    const getMsg = (msg) => {
      data.logVisible = true;
      data.logTableData = msg.records;
      data.pageableLog.current = msg.current;
      data.pageableLog.size = msg.size;
      data.pageableLog.total = msg.total;
    };

    // 关闭弹框
    const closed = () => {
      data.logVisible = false;
      data.logTableData = [];
      data.pageableLog.current = null;
      data.pageableLog.size = null;
      data.pageableLog.total = null;
    };

    return {
      ...refData,
      handleSizeChangeLog,
      handleCurrentChangeLog,
      checkLogDialog,
      getMsg,
      closed,
    };
  },
};
</script>
<style scoped lang="scss">
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
</style>
