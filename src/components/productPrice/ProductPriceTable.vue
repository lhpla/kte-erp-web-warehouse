<!-- 产品限价表格 -->
<template>
  <div id="ProductPriceTable">
    <div class="table-box">
      <div class="table-header">
        <el-button type="primary" size="mini" @click="sensitive('add')" v-if="buttonAuthor.add">新 增</el-button>
        <el-button type="primary" size="mini" @click="brachDel" v-if="buttonAuthor.batchDelete">批量删除</el-button>
      </div>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      height="calc(100vh - 320px)"
      style="width: 100%"
      :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column prop="productSku" label="SKU" width="180">
        <template #default="scope">
          <span>{{ scope.row.productSku ? scope.row.productSku : "-" }}</span>
          <i v-if="scope.row.productSku" class="el-icon-document-copy" @click="copyText(scope.row.productSku)"></i>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="品名"></el-table-column>
      <el-table-column label="销售平台">
        <template #default="scope">
          <span>{{ scope.row.marketPlatformName ? scope.row.marketPlatformName : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="销售站点">
        <template #default="scope">
          <span>{{ scope.row.marketSiteName ? scope.row.marketSiteName : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="retailPrice" label="限价">
        <template #default="scope">
          <span v-if="scope.row.retailPrice">{{ Number(scope.row.retailPrice).toFixed(2) }}{{ scope.row.priceUnit }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="currencyName" label="币种"></el-table-column>
      <el-table-column label="利润率(%)">
        <template #default="scope">
          <span v-if="scope.row.profitMargin != 0.0 || scope.row.profitMargin != -0.0">{{
            Number(scope.row.profitMargin).toFixed(2)
          }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column prop="inputTime" label="时间" width="210">
        <template #default="scope">
          <div>创建:{{ scope.row.createTime ? scope.row.createTime : "-" }}</div>
          <div>编辑:{{ scope.row.updateTime ? scope.row.updateTime : "-" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="text" size="mini" @click="sensitive('edit', scope.row)" icon="el-icon-edit" v-if="buttonAuthor.edit"
            >编辑</el-button
          >
          <el-button type="text" size="mini" @click="delById(scope.row.id)" icon="el-icon-delete" v-if="buttonAuthor.delete"
            >删除</el-button
          >
          <el-button type="text" size="mini" @click="openLog(scope.row.id)" icon="el-icon-notebook-2" v-if="buttonAuthor.log"
            >日志</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <ProductPricePop ref="ProductPricePop"></ProductPricePop>
    <!-- 日志 -->
    <ProductPriceLog ref="ProductPriceLog"></ProductPriceLog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject, computed, nextTick } from "vue";
import ProductPriceLog from "./ProductPriceLog.vue";
import authorButtons from "@/compositionApi/authorButtons";
import ProductPricePop from "./ProductPricePop.vue";
import { localGet, documentCopy } from "@/utils/util";
export default {
  name: "ProductPriceTable",
  props: ["tableData", "tableLoading"],
  components: { ProductPricePop, ProductPriceLog },
  setup(prop, ctx) {
    const data = reactive({
      selectList: [],
      // 所有字典
      sensitive_risk_level: [],
      sensitive_word_type: [],
    });
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      data.sensitive_risk_level = localGet("dictCodeList").sensitive_risk_level ? localGet("dictCodeList").sensitive_risk_level : [];
      data.sensitive_word_type = localGet("dictCodeList").sensitive_word_type ? localGet("dictCodeList").sensitive_word_type : [];
    });
    // 列表选择
    const handleSelectionChange = (val) => {
      data.selectList = val;
    };
    // 弹窗
    const sensitive = (type, row) => {
      let msg = {
        type: type,
        row: row || "",
      };
      vue.$refs.ProductPricePop.getMsg(msg);
    };
    // 批量删除
    const brachDel = () => {
      if (!data.selectList.length) {
        vue.$message({
          message: "至少选择一条信息!",
          type: "warning",
        });
      } else {
        vue
          .$confirm("此操作将删除此数据, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            let ids = [];
            for (let item of data.selectList) {
              ids.push(item.id);
            }
            api.sensitive.Delete(ids).then((res) => {
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
    };

    // 单个删除
    const delById = (id) => {
      vue
        .$confirm("此操作将删除此数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          api.sensitive.Delete([id]).then((res) => {
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

    // 日志
    const openLog = (id) => {
      nextTick(() => {
        vue.$refs.ProductPriceLog.checkLogDialog(id);
      });
    };
    // 点击复制
    const copyText = (text) => {
      documentCopy(text);
    };

    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (list, dizKey) {
        if (list.length > 1 && dizKey !== -1) {
          for (let item of list) {
            if (dizKey == item.dizKey) {
              return item.value;
            }
          }
        }
      };
    });
    const refData = toRefs(data);
    const getTableData = inject("getTableData");
    return {
      ...refData,
      buttonAuthor,
      handleSelectionChange,
      sensitive,
      delById,
      getTableData,
      brachDel,
      tableTypeComputed,
      openLog,
      copyText,
    };
  },
};
</script>
<style scoped lang="scss">
:deep(.cell) {
  text-align: center !important;
}
.el-icon-document-copy,
.el-icon-download,
.el-icon-circle-plus-outline {
  color: #409eff;
  margin-left: 5px;
}
</style>
