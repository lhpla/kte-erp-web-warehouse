<!-- 选品审核列表 -->
<template>
  <div id="ChooseAuditLsit">
    <div class="table-box">
      <div class="table-header">
        <el-button type="primary" size="mini" @click="batchThrough(3)" v-if="buttonAuthor.batchThrough">批量通过</el-button>
        <el-button type="primary" size="mini" @click="batchOperation(2)" v-if="buttonAuthor.batchRejected">批量驳回</el-button>
        <el-button type="primary" size="mini" @click="downExportPro" v-if="buttonAuthor.export">选品导出</el-button>
      </div>
    </div>
    <el-table
      height="calc(100vh - 310px)"
      :data="tableData"
      v-loading="tableLoading"
      :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
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
            <span @click="getDetails(scope.row.id)" class="nameHover mle1" :class="scope.row.isProFirstTimeout == 1 ? 'color-red' : ''">
              {{ scope.row.productCname ? scope.row.productCname : "-" }}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="产品分类" min-width="110" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="scope.row.productClassification" class="mle1" :class="scope.row.isProFirstTimeout == 1 ? 'color-red' : ''">
            {{ scope.row.productClassification ? scope.row.productClassification : "-" }}
          </span>
          <span v-else :class="scope.row.isProFirstTimeout == 1 ? 'color-red' : ''">-</span>
        </template>
      </el-table-column>
      <el-table-column label="选品来源" prop="source">
        <template #default="scope">
          <span :class="scope.row.isProFirstTimeout == 1 ? 'color-red' : ''">{{ scope.row.source ? scope.row.source : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SPU" prop="proSpu" align="center">
        <template #default="scope">
          <span :class="scope.row.isProFirstTimeout == 1 ? 'color-red' : ''">{{ scope.row.proSpu ? scope.row.proSpu : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="选品参考链接" min-width="110" show-overflow-tooltip>
        <template #default="scope">
          <el-link :underline="false" :href="scope.row.referenceLinking" class="mle1" target="_blank" :class="scope.row.isProFirstTimeout == 1 ? 'color-red' : ''">
            {{ scope.row.referenceLinking ? scope.row.referenceLinking : "-" }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="选品参考价格">
        <template #default="scope">
          <span v-if="scope.row.referencePrice" :class="scope.row.isProFirstTimeout == 1 ? 'color-red' : ''">
            {{ Number(scope.row.referencePrice).toFixed(2) }}{{ scope.row.priceUnit ? scope.row.priceUnit : "-" }}
          </span>
          <span v-else :class="scope.row.isProFirstTimeout == 1 ? 'color-red' : ''">-</span>
        </template>
      </el-table-column>
      <el-table-column label="提交人" prop="createUserName">
        <template #default="scope">
          <span :class="scope.row.isProFirstTimeout == 1 ? 'color-red' : ''">{{ scope.row.createUserName ? scope.row.createUserName : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" min-width="100">
        <template #default="scope">
          <div class="mle1" :class="scope.row.isProFirstTimeout == 1 ? 'color-red' : ''">创建时间：{{ scope.row.submissionTime ? scope.row.submissionTime : "-" }}</div>
          <div class="mle1" :class="scope.row.isProFirstTimeout == 1 ? 'color-red' : ''">审核时间：{{ scope.row.auditTime ? scope.row.auditTime : "-" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="选品状态">
        <template #default="scope">
          <span v-if="scope.row.status" @click="openCom(scope.row)" :class="scope.row.isProFirstTimeout == 1 ? 'color-red' : ''">
            {{ tableTypeComputed(pro_selection_review_status, scope.row.status) }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="60" align="center">
        <template #default="scope">
          <el-button size="mini" icon="el-icon-s-check" type="text" v-if="scope.row.status == 1 && buttonAuthor.audit" @click="handleAudit(scope.$index, scope.row)">
            审核
          </el-button>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <ProductDialog ref="ProductDialog"></ProductDialog>
    <ProductDetails ref="ProductDetails"></ProductDetails>
    <CommentPopup :minTitle="minTitle" :firstTile="firstTile" :logTitle="logTitle" ref="CommentPopup"></CommentPopup>
  </div>
</template>

<script>
import { reactive, toRefs, onBeforeMount, computed, onMounted, getCurrentInstance, inject, onUnmounted } from "vue";
import ProductDialog from "../ProductDialogCopy.vue";
import ProductDetails from "../ProductDetails.vue";
import tablePage from "../../../compositionApi/tablePage";
import authorButtons from "../../../compositionApi/authorButtons";
import { ElMessage } from "element-plus";
import { localGet, localSet } from "../../../utils/util";
import CommentPopup from "../../../components/commentPopup/commentPopup.vue";
export default {
  name: "ChooseAuditLsit",
  components: {
    ProductDialog,
    ProductDetails,
    CommentPopup,
  },
  props: ["tableLoading", "tableData"],
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      selectList: [],
      pro_selection_review_status: [],
      searchMsg: "",
      timerOut: null,
      minTitle: "确认所选产品信息通过？",
      firstTile: "审核通过",
      logTitle: "确认操作",
      commObj: {
        pictureList: [],
        CommentsText: "",
      },
    });
    const { downloadTemplate, dataService } = tablePage();
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onUnmounted(() => {
      // 页面销毁  关闭预览图片的计时器
      clearTimeout(data.timerOut);
    });
    onMounted(() => {
      dataService.value = "develop";
    });

    const getTableData = inject("getTableData");
    // 获取列表
    const getTableList = searchMsg => {
      data.searchMsg = searchMsg;
      data.pro_selection_review_status = localGet("dictCodeList").pro_selection_review_status ? localGet("dictCodeList").pro_selection_review_status : [];
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

    // 未通过/作废情况下点击状态
    const openCom = row => {
      console.log(row);
      data.logTitle = "意见详情";
      if (row.status != 1) {
        if (row.status != 5) {
          const imgArr = [];
          const arr = row.auditOpinionPicture.split(",");
          arr.map(item => {
            if (item && item != "") {
              const a = {
                url: "",
              };
              a.url = item;
              imgArr.push(a);
            }
          });
          const msg = {
            list: imgArr,
            CommentsText: row.auditOpinion,
            isDetail: true,
          };
          console.log(msg);
          vue.$refs.CommentPopup.getPicture(msg);
        } else {
          const imgArr = [];
          const arr = row.invalidAuditOpinionPicture.split(",");
          arr.map(item => {
            if (item && item != "") {
              const a = {
                url: "",
              };
              a.url = item;
              imgArr.push(a);
            }
          });
          const msg = {
            list: imgArr,
            CommentsText: row.invalidAuditOpinion,
            isDetail: true,
          };
          vue.$refs.CommentPopup.getPicture(msg);
        }
      }
    };

    // 列表选择
    const handleSelectionChange = val => {
      data.selectList = val;
    };

    const handleAudit = (index, row) => {
      const msg = {
        type: 3,
        row: row.id,
        disabled: true,
        title: "审核选品",
        btnName: "提交审核",
      };
      vue.$refs.ProductDialog.getMsg(msg);
    };

    // 批量操作
    const batchOperation = status => {
      if (data.selectList.length < 1) {
        ElMessage.warning({
          message: "至少选择一条信息!",
          type: "warning",
        });
      } else {
        data.minTitle = "确认所选产品信息驳回？";
        data.firstTile = "选品驳回";
        data.logTitle = "确认操作";

        if (
          data.selectList.every(item => {
            return item.status == 1;
          })
        ) {
          const msg = {
            path: "develop",
            funName: "updateAuditStatus",
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
          vue.$refs.CommentPopup.openLog(msg);
        } else {
          vue.$message({
            type: "warning",
            message: "只能驳回待审核数据！",
          });
        }
      }
    };

    // 批量通过
    const batchThrough = status => {
      if (data.selectList.length < 1) {
        ElMessage.warning({
          message: "至少选择一条信息!",
          type: "warning",
        });
      } else {
        data.logTitle = "确认操作";
        data.minTitle = "确认所选产品信息通过？";
        data.firstTile = "选品通过";
        const msg = {
          path: "develop",
          funName: "updateAuditStatus",
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
        vue.$refs.CommentPopup.openLog(msg);
      }
    };

    // 批量导出
    const downExportPro = () => {
      const info = data.searchMsg ? data.searchMsg : {};
      const ids = [];
      for (const item of data.selectList) {
        ids.push(item.id);
      }
      info.proIds = ids;
      downloadTemplate("exportAuditExcel", "选品审核列表", info);
    };

    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (list, dizKey) {
        if (list.length > 1 && dizKey !== -1) {
          for (const item of list) {
            if (dizKey == item.dizKey) {
              return item.value;
            }
          }
        }
      };
    });

    const refData = toRefs(data);
    return {
      ...refData,
      handleAudit,
      handleSelectionChange,
      getTableList,
      batchOperation,
      batchThrough,
      downExportPro,
      tableTypeComputed,
      downloadTemplate,
      buttonAuthor,
      getDetails,
      openCom,
    };
  },
};
</script>
<style lang="scss" scoped></style>
