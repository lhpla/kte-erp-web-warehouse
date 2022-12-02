<!--产品初录列表 -->
<template>
  <div id="FirstEntryList">
    <div class="table-box">
      <div class="table-header">
        <el-button type="primary" size="mini" @click="addNewProduct" v-if="buttonAuthor.add">新增</el-button>
        <el-button type="primary" size="mini" @click="batchOperation(51)" v-if="buttonAuthor.batchSubmit">批量提交</el-button>
        <el-button type="primary" size="mini" @click="batchOperation(5)" v-if="buttonAuthor.batchAbandoned">批量作废</el-button>
        <el-button type="primary" size="mini" @click="downExportPro" v-if="buttonAuthor.export">产品导出</el-button>
        <el-button type="primary" size="mini" @click="checkDialog(true)" v-if="buttonAuthor.import">产品导入</el-button>
        <LogDialog ref="logDialog"></LogDialog>
        <AllDownDialog ref="AllDownDialog"></AllDownDialog>
      </div>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      height="calc(100vh - 310px)"
      class="development-process-operation-bar"
    >
      <el-table-column type="selection" min-width="40" align="center"></el-table-column>
      <el-table-column label="产品图片" align="center">
        <template #default="scope">
          <el-popover placement="right" trigger="hover" width="250" v-if="scope.row.pricturePath">
            <template #reference>
              <img style="width: 70px; height: 70px; object-fit: contain" loading="lazy" :src="scope.row.pricturePath" />
            </template>
            <img :src="scope.row.pricturePath" loading="lazy" style="width: 400px; height: 300px; object-fit: contain" />
          </el-popover>
          <div v-else>暂无图片</div>
        </template>
      </el-table-column>
      <el-table-column label="产品中文名称">
        <template #default="scope">
          <el-tooltip effect="dark" :content="scope.row.productCname" placement="bottom">
            <span @click="getDetails(scope.row.id)" class="nameHover mle1">
              {{ scope.row.productCname ? scope.row.productCname : "-" }}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="产品分类" min-width="110" show-overflow-tooltip>
        <template #default="scope">
          <span class="mle1">{{ scope.row.productClassification ? scope.row.productClassification : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品来源" prop="source"></el-table-column>
      <el-table-column label="SPU" prop="proSpu" align="center">
        <template #default="scope">
          <span>{{ scope.row.proSpu ? scope.row.proSpu : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template #default="scope">
          <span v-if="scope.row.proFirstStatus" @click="openCom(scope.row)">{{ tableTypeComputed(scope.row.proFirstStatus) }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="询价人">
        <template #default="scope">
          <span v-if="scope.row.purchaseUserName">{{ scope.row.purchaseUserName }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
       <el-table-column label="提交人" prop="createUserName"></el-table-column>
      <el-table-column label="时间" min-width="100">
        <template #default="scope">
          <div class="mle1">创建时间：{{ scope.row.proFirstCreateTime ? scope.row.proFirstCreateTime : "-" }}</div>
          <div class="mle1">提交时间：{{ scope.row.auditTime ? scope.row.auditTime : "-" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120" align="center">
        <template #default="scope">
          <span>
            <el-button
              size="mini"
              type="text"
              v-if="scope.row.proFirstStatus == 53 && buttonAuthor.edit"
              icon="el-icon-folder-checked"
              @click="handleEdit(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              v-if="buttonAuthor.abandoned && scope.row.proFirstStatus != 5 && scope.row.isAssistant == 1"
              icon="el-icon-document-delete"
              @click="stateEdit(5, scope.row)"
            >
              作废
            </el-button>
            <el-button
              size="mini"
              type="text"
              v-if="scope.row.proFirstStatus == 53 && buttonAuthor.submit"
              icon="el-icon-document-checked"
              @click="stateEdit(51, scope.row)"
            >
              提交
            </el-button>
            <el-button
              size="mini"
              type="text"
              v-if="buttonAuthor.activation && scope.row.proFirstStatus == 5 && scope.row.isAssistant == 1"
              icon="el-icon-thumb"
              @click="stateEdit(53, scope.row)"
            >
              激活
            </el-button>
            <el-button
              size="mini"
              type="text"
              v-if="scope.row.proFirstStatus == 51 && buttonAuthor.update && scope.row.isAssistant == 1 && scope.row.proSecondStatus == 0"
              icon="el-icon-refresh"
              @click="handleEdit(scope.$index, scope.row, 1)"
            >
              更新
            </el-button>
            <el-button size="mini" type="text" icon="el-icon-thumb" v-if="scope.row.proFirstStatus !== 5 && buttonAuthor.copy" @click="copyProduct(scope.row)">
              复制
            </el-button>

            <el-button icon="el-icon-notebook-2" size="mini" @click="openLog(scope.row.id)" type="text" v-if="buttonAuthor.log">日志</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <ProductDialog ref="ProductDialog"></ProductDialog>
    <ProductDetails ref="ProductDetails"></ProductDetails>
    <CommentPopup :minTitle="minTitle" :firstTile="firstTile" :logTitle="logTitle" ref="CommentPopup"></CommentPopup>
  </div>
</template>

<script>
import { reactive, toRefs, onBeforeMount, onMounted, computed, getCurrentInstance, nextTick, inject } from "vue";
import ProductDialog from "../ProductDialog.vue";
import ProductDetails from "../ProductDetails.vue";
import tablePage from "../../../compositionApi/tablePage";
import { ElMessage } from "element-plus";
import authorButtons from "../../../compositionApi/authorButtons";
import { localGet } from "../../../utils/util";
import CommentPopup from "../../../components/commentPopup/commentPopup.vue";
export default {
  name: "FirstEntryList",
  components: { ProductDialog, ProductDetails, CommentPopup },
  props: ["tableLoading", "tableData"],
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      selectList: [],
      pro_first_status: [],
      searchMsg: {
        auditor: "",
        productCname: "",
        classify: [],
        keywords: "",
        status: "",
        time: "",
        productClassificationId: "",
        timerOut: null,
      },
      firstTile: "选品作废",
      minTitle: "确认所选选品信息作废？",
      logTitle: "确认操作",
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      dataService.value = "develop";
    });

    // 根据平台id 获取站点字典表  保证弹框拿到对应平台站点  再进行获取数据操作
    const platformList = info => {
      api.system.getSiteByPlat({ platformId: info.platformId, isEnglish: false, includeFullSite: false, isLimit: false }).then(res => {
        if (res.code == 200) {
          vue.$refs.ProductDialog.getMsg(info);
        }
      });
    };
    // 复制选品
    const copyProduct = row => {
      console.log(row);
      let msg = "";
      if (row.isAssistant == 1) {
        msg = "此操作将该产品复制到开发初录？";
      } else {
        msg = "此操作将该产品复制到选品列表？";
      }
      vue
        .$confirm(msg, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          api.develop.copyProduct({ pid: row.id }).then(res => {
            if (res.code == 200) {
              vue.$message({
                type: "success",
                message: res.msg,
              });
              getTableData();
            } else {
              vue.$message({
                type: "warning",
                message: res.msg,
              });
            }
          });
        })
        .catch(() => {
          vue.$message({
            type: "info",
            message: "已取消修改",
          });
        });
    };

    // 新增
    const addNewProduct = () => {
      const info = {
        title: data.type == 1 ? "新增选品" : "新增产品",
        type: 2,
        btnName: "提交询价",
      };
      vue.$refs.ProductDialog.getMsg(info);
    };
    // 查看商品详情
    const getDetails = id => {
      api.develop.getProductDetail({ id: id }).then(res => {
        if (res.code == 200) {
          vue.$refs.ProductDetails.getMsg(res.data);
        } else {
          vue.$message({
            type: "warning",
            message: res.msg,
          });
        }
      });
    };
    const { downloadTemplate, dataService } = tablePage();

    const handleEdit = (index, row, type) => {
      const info = {
        title: type == 1 ? "更新信息" : "录入信息",
        type: 2,
        row: row.id,
        platformId: row.platformId,
        btnName: type == 1 ? "更新提交" : "提交询价",
      };
      platformList(info);
      vue.$refs.ProductDialog.getMsg(info);
    };

    const getTableList = searchMsg => {
      data.searchMsg = searchMsg;

      data.pro_first_status = localGet("dictCodeList").pro_first_status ? localGet("dictCodeList").pro_first_status : [];
    };

    // 未通过/作废情况下点击状态
    const openCom = row => {
      console.log(row);
      if (row.proFirstStatus == 5) {
        data.logTitle = "意见详情";
        const imgArr = [];
        const arr = row.invalidAuditOpinionPicture.split(",");
        if (row.invalidAuditOpinionPicture !== "") {
          arr.map(item => {
            if (item && item != "") {
              const a = {
                url: "",
              };
              a.url = item;
              imgArr.push(a);
            }
          });
        }
        const msg = {
          list: imgArr,
          CommentsText: row.invalidAuditOpinion,
          isDetail: true,
        };
        console.log(msg);
        vue.$refs.CommentPopup.getPicture(msg);
      }
    };

    const getTableData = inject("getTableData");
    // 批量操作
    const batchOperation = status => {
      if (data.selectList.length < 1) {
        ElMessage.warning({
          message: "至少选择一条信息!",
          type: "warning",
        });
      } else {
        if (status == 5) {
          const msg = {
            path: "develop",
            funName: "updateStatus",
            param: {
              opinion: "",
              ids: [],
              opinionPicture: [],
              status: status,
            },
          };
          data.selectList.map(item => {
            msg.param.ids.push(item.id);
          });
          data.logTitle = "确认操作";
          data.firstTile = "选品作废";
          data.minTitle = "确认所选选品信息作废？";
          vue.$refs.CommentPopup.openLog(msg);
        } else {
          const note = "此操作将提交选品, 是否继续?";
          vue
            .$confirm(note, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
            .then(() => {
              const ids = [];
              for (const item of data.selectList) {
                ids.push(item.id);
              }
              const msg = {
                ids: ids,
                status: status,
              };
              api.develop.updateStatus(msg).then(res => {
                if (res.code == 200) {
                  vue.$message({
                    type: "success",
                    message: res.msg,
                  });
                  getTableData();
                } else {
                  vue.$message({
                    type: "warning",
                    message: res.msg,
                  });
                }
              });
            })
            .catch(() => {
              vue.$message({
                type: "info",
                message: "已取消修改",
              });
            });
        }
      }
    };
    // 列表选择
    const handleSelectionChange = val => {
      data.selectList = val;
    };

    // 单个修改状态
    const stateEdit = (index, row) => {
      if (index == 5) {
        data.logTitle = "确认操作";
        data.firstTile = "选品作废";
        data.minTitle = "确认所选选品信息作废？";
        // 作废选品
        const msg = {
          path: "develop",
          funName: "updateStatus",
          param: {
            opinion: "",
            ids: [row.id],
            opinionPicture: [],
            status: 5,
          },
        };
        vue.$refs.CommentPopup.openLog(msg);
      } else {
        let note = "";
        if (index == 51) {
          note = "此操作将提交选品, 是否继续?";
        } else if (index == 53) {
          note = "此操作将激活选品, 是否继续?";
        }
        vue
          .$confirm(note, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            const msg = {
              ids: Array(row.id),
              status: index,
            };
            console.log(msg);
            if (index !== 53) {
              api.develop.updateStatus(msg).then(res => {
                if (res.code == 200) {
                  vue.$message({
                    type: "success",
                    message: "修改成功!",
                  });
                  getTableData();
                } else {
                  vue.$message({
                    type: "warning",
                    message: res.msg,
                  });
                }
              });
            } else {
              api.develop.activationFirst({ pid: row.id }).then(res => {
                if (res.code == 200) {
                  vue.$message({
                    type: "success",
                    message: res.msg,
                  });
                  getTableData();
                } else {
                  vue.$message({
                    type: "warning",
                    message: res.msg,
                  });
                }
              });
            }
          })
          .catch(() => {
            vue.$message({
              type: "info",
              message: "已取消修改",
            });
          });
      }
    };

    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (dizKey) {
        if (data.pro_first_status.length > 1 && dizKey !== -1) {
          for (const item of data.pro_first_status) {
            if (dizKey == item.dizKey) {
              return item.value;
            }
          }
        }
      };
    });

    // 日志
    const openLog = e => {
      const msg = {
        servers: "develop",
        dataApi: "getProductLog",
        idList: [e],
      };
      nextTick(() => {
        vue.$refs.logDialog.checkLogDialog(msg);
      });
    };

    // 点击导入
    const checkDialog = () => {
      const info = {
        title: "产品初录列表模板",
        temp: "firstTemp",
        import: "firstImport",
        servers: "develop",
      };
      nextTick(() => {
        vue.$refs.AllDownDialog.checkDialog(true, info);
      });
    };

    // 批量导出
    const downExportPro = () => {
      const info = data.searchMsg ? data.searchMsg : {};
      const ids = [];
      for (let item of data.selectList) {
        ids.push(item.id);
      }
      info.proIds = ids;
      downloadTemplate("firstDown", "产品初录列表", info);
    };

    const refData = toRefs(data);
    return {
      ...refData,
      handleEdit,
      handleSelectionChange,
      batchOperation,
      getTableList,
      openLog,
      stateEdit,
      tableTypeComputed,
      downExportPro,
      downloadTemplate,
      checkDialog,
      getTableData,
      buttonAuthor,
      getDetails,
      addNewProduct,
      platformList,
      copyProduct,
      openCom,
    };
  },
};
</script>
<style lang="scss" scoped></style>
