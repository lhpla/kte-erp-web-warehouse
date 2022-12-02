<!-- 下载列表  弹窗 -->
<template>
    <div id="DownloadListTable">
      <el-dialog
        title="下载队列"
        v-model="downVisible"
        width="1250px"
        :close-on-click-modal="false"
        :before-close="handleClose"
      >
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          border
          style="width: 100%"
          :header-cell-style="{
            background: '#fafafa',
            color: '#2d2f30',
            fontWeight: 'bold',
            fontSize: '12px',
          }"
        >
          <el-table-column label="文件名称" prop="fileName"></el-table-column>
          <el-table-column label="文件来源" prop="fileSource">
            <template #default="scope">
              <span>{{ scope.row.fileSource == 1 ? "产品库" : "订单列表" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建人" prop="createUser"></el-table-column>
          <el-table-column label="状态" prop="state">
            <template #default="scope">
              <div>
                {{
                  scope.row.state == 0
                    ? "正在处理"
                    : scope.row.state == 1
                    ? "已完成"
                    : "失败"
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作时间">
            <template #default="scope">
              <div>
                <div>
                  创建时间：{{
                    scope.row.createTime ? scope.row.createTime : "-"
                  }}
                </div>
                <div>
                  完成时间：{{
                    scope.row.completionTime ? scope.row.completionTime : "-"
                  }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="cardBank">
            <template #default="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-download"
                v-if="scope.row.state == 1"
                @click="handelDownFile(scope.row.fileLink,scope.row.fileName,scope.row)"
                >下载</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                v-if="scope.row.state == 1"
                @click="handDelete(scope.row.id)"
                >删除</el-button
              >
              <span v-if="scope.row.state != 1">-</span>
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :total="myPages.total"
          :limit="myPages.pageSize"
          :page="myPages.pageNum"
          @update:limit="myPages.pageSize = $event"
          @update:page="myPages.pageNu = $event"
          :hidden="myPages.total <= 0"
          @handleCurrentChange="handleCurrentChange"
          @handleSizeChange="handleSizeChange"
          class="DownloadListTable"
        ></Pagination>
      </el-dialog>
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
  } from "vue";
  import { download } from '@/utils/util'
import { objectEach } from "xe-utils";
  export default {
    name: "DownloadListTable",
    setup(prop, ctx) {
      const data = reactive({
        tableData: [],
        tableLoading: false,
        downVisible: false,
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
        searchMsg: {
          type:1
        },
      });
      const { ctx: vueDev, proxy: vue } = getCurrentInstance();
      const api = vue.$http;
      onBeforeMount(() => {});
      onMounted(() => {});
      const refData = toRefs(data);
      //触发弹窗
      const getMsg = () => {
        data.downVisible = true;
        data.tableLoading = true;
        data.tableData = [];
        getDownloadQueue();
      };
      // 获取下载队列
      const getDownloadQueue = (msg) => {
        data.searchMsg = msg || data.searchMsg;
        api.product.getDownloadQueue(data.searchMsg).then((res) => {
          if (res.code == 200) {
            data.tableData = res.data.records;
            // data.tableData=data.tableData.map(item=>{
            //   return {...item,btnLoding:false}
            // })
            data.tableInfo.current = res.data.current;
            data.tableInfo.size = res.data.size;
            data.myPages.pageSize = res.data.size;
            data.myPages.pageNum = res.data.current;
            data.myPages.pages = res.data.pages;
            data.myPages.total = res.data.total;
          }
        });
        data.tableLoading = false;
      };
  
      const handleSizeChange = (val) => {
        data.searchMsg.size = val;
        getDownloadQueue(data.searchMsg);
      };
      const handleCurrentChange = (val) => {
        data.searchMsg.current = val;
        getDownloadQueue(data.searchMsg);
      };
  
      //关闭弹窗
      const handleClose = (done) => {
        data.downVisible = false;
      };
  
      //点击下载
      const handelDownFile = (link,Filename,row) => {
        // let tempName = Filename
        // let fileType = '.xlsx'
        // row.btnLoding=true
        // api.product.NewdownloadFile({fileLink:link}).then((res)=>{
        //     if (res) {
        //       const blob = new Blob([res], {
        //           type: 'application/vnd.ms-excel;charset=UTF-8',
        //       })
        //       if ('msSaveOrOpenBlob' in navigator) {
        //           window.navigator.msSaveOrOpenBlob(blob, tempName + fileType)
        //           return
        //       }
        //       const blobUrl = window.URL.createObjectURL(blob)
        //       download(blobUrl, tempName, fileType)
        //       row.btnLoding=false
        //     }
        // })
        window.open(link)
      };
      const handDelete = (id) => {
        api.product.deleteQueueById({id:id}).then((res)=>{
            if (res.code == 200) {
                vue.$message.success(res.msg)
                getDownloadQueue(data.searchMsg);
            }else{
                vue.$message.error(res.msg)
            }
        })
      }
      return {
        ...refData,
        getDownloadQueue,
        getMsg,
        handleClose,
        handleSizeChange,
        handleCurrentChange,
        handelDownFile,
        handDelete
      };
    },
  };
  </script>
  <style scoped lang='scss'></style>
  