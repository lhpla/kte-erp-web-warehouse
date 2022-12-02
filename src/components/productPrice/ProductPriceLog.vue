<!--ProductPriceLog  产品限价日志-->
<template>
  <div>
    <el-dialog title="操作日志" width="80%" v-model="logVisible" @close="closed" destroy-on-close>
      <el-table
        :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
        :data="logTableData"
        element-loading-text="加载中"
        v-loading="loading"
        border
      >
        <el-table-column prop="operator" align="center" label="操作人名称"></el-table-column>
        <el-table-column prop="ip" align="center" label=" 操作数据的IP地址"></el-table-column>
        <el-table-column prop="context" align="center" label=" 操作内容"></el-table-column>
        <el-table-column prop="title" align="center" label="操作标题"></el-table-column>
        <el-table-column prop="createTime" align="center" label="操作时间"></el-table-column>
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
  name: "",
  setup(prop, ctx) {
    const data = reactive({
      logVisible: false, //日志弹窗
      logTableData: [], // log日志表格数据
      loading: false,
      // 日志分页
      pageableLog: {
        current: 1,
        size: 10,
        total: 0,
      },
      id: "",
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const refData = toRefs(data);

    // 打开loading
    const checkLogDialog = id => {
      data.logVisible = true;
      data.id = id;
      handleLog(id);
    };

    // closed 关闭单条日志弹框
    const closed = () => {
      data.id = "";
      data.logVisible = false;
      data.logTableData = [];
    };

    // 日志每页条数发生改变
    const handleSizeChangeLog = val => {
      data.pageableLog.size = val;
      getLimitPriceLogList({ id: data.id, current: data.pageableLog.current, size: val });
    };
    // 日志当前页发生改变
    const handleCurrentChangeLog = val => {
      data.pageableLog.current = val;
      getLimitPriceLogList({ id: data.id, current: val, size: data.pageableLog.size });
    };

    // 查看日志
    const handleLog = id => {
      data.logTableData = [];
      getLimitPriceLogList({ id: data.id, current: data.pageableLog.current, size: data.pageableLog.size });
    };

    //获取日志
    const getLimitPriceLogList = msg => {
      api.sensitive.getLimitPriceLogList(msg).then(res => {
        if (res.code == 200) {
          data.logTableData = res.data.records;
          data.pageableLog.current = res.data.current;
          data.pageableLog.size = res.data.size;
          data.pageableLog.total = res.data.total;
        } else {
          vue.$message({
            type: "warning",
            message: res.msg,
          });
        }
      });
    };
    return {
      ...refData,
      checkLogDialog,
      handleLog,
      closed,
      handleCurrentChangeLog,
      handleSizeChangeLog,
      getLimitPriceLogList,
    };
  },
};
</script>
<style scoped lang='scss'>
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
