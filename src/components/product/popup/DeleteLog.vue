<!-- 日志组件 -->
<template>
  <!-- 删除日志dialog -->
  <div id="DeleteLog">
    <el-dialog title="操作日志" width="80%" v-model="logVisible" :close-on-click-modal="false" destroy-on-close>
      <el-table :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }" :data="logTableData" tooltip-effect="dark" element-loading-text="加载中" v-loading="loading" border>
        <el-table-column prop="proSku" label="SKU" width="180"></el-table-column>
        <el-table-column prop="operationalContext" label="内容"></el-table-column>
        <el-table-column prop="createUserName" label="操作人" width="110"></el-table-column>
        <el-table-column prop="createTime" label="修改时间" width="180"></el-table-column>
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
  name: "DeleteLog",
  setup(prop, ctx) {
    const data = reactive({
      logVisible: false,
      // log日志表格数据
      logTableData: [],
      // logID
      logDataId: null,
      // 日志分页
      pageableLog: {
        current: 1,
        size: 10,
        total: 0,
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
    const handleSizeChangeLog = val => {
      data.pageableLog.size = val;
      handleLog();
    };
    // 日志当前页发生改变
    const handleCurrentChangeLog = val => {
      data.pageableLog.current = val;
      handleLog();
    };
    // 打开loading
    const checkLogDialog = () => {
      data.pageableLog = { current: 1, size: 10, total: 0 };
      data.logVisible = true;
      data.loading = true;
      handleLog();
    };
    // 查看日志
    const handleLog = () => {
      let logData = {
        current: data.pageableLog.current,
        size: data.pageableLog.size,
      };

      api.product.getDeleteProductInfo(logData).then(res => {
        if (res.code == 200) {
          data.logTableData = res.data.records;
          data.pageableLog.size = res.data.size;
          data.pageableLog.current = res.data.current;
          data.pageableLog.total = res.data.total;
        }
      });
      data.loading = false;
    };
    return {
      ...refData,
      handleSizeChangeLog,
      handleCurrentChangeLog,
      checkLogDialog,
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
