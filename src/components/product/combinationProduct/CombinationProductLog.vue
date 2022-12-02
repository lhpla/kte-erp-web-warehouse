<!-- 日志组件 -->
<template>
    <!-- 日志dialog -->
    <div v-dialogdrag>
      <el-dialog title="操作日志" width="80%" v-model="logVisible" :close-on-click-modal="false">
        <el-table
          :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
          :data="logTableData"
          tooltip-effect="dark"
          element-loading-text="加载中"
          v-loading="loading"
          border
        >
          <el-table-column label="#" type="index" align="center" width="100"></el-table-column>
          <el-table-column prop="context" label="内容"></el-table-column>
          <el-table-column prop="operator" label="操作人" width="110"></el-table-column>
          <el-table-column prop="updateTime" label="修改时间" width="180"></el-table-column>
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
  import { reactive, toRefs, onBeforeMount, onMounted, getCurrentInstance } from 'vue'
  export default {
    name: 'LogDialog',
    setup(prop, ctx) {
      const data = reactive({
        logVisible: false,
        funMsg: {},
        // log日志表格数据
        logTableData: [],
        // 操作日志
        logVisible: false,
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
      })
      const { ctx: vueDev, proxy: vue } = getCurrentInstance()
      const api = vue.$http
      onBeforeMount(() => {})
      onMounted(() => {})
      const refData = toRefs(data)
      // 日志每页条数发生改变
      const handleSizeChangeLog = (val) => {
        data.pageableLog.size = val
        handleLog()
      }
      // 日志当前页发生改变
      const handleCurrentChangeLog = (val) => {
        data.pageableLog.current = val
        handleLog()
      }
      // 打开loading
      const checkLogDialog = (id) => {
        data.pageableLog = { current: 1, size: 10}
        data.logVisible = true
        data.id=id
        handleLog()
      }
      // 查看日志
      const handleLog = () => {
        let logData = {
          id: data.id,
          current: data.pageableLog.current,
          size: data.pageableLog.size,
        }
        console.log(logData);
        api.product.groupProductLogById(logData).then((res) => {
          data.logTableData = res.data.records
          data.pageableLog = res.data
        })
      }
      return {
        ...refData,
        handleSizeChangeLog,
        handleCurrentChangeLog,
        checkLogDialog,
      }
    },
  }
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
  .el-dialog__body {
    overflow: hidden;
  }
  </style>
  