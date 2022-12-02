<!-- 计价信息 -->
<template>
  <div>
    <el-form v-if="type !== 4 && type !== 8" title="产品信息" label-width="120px" labelPosition="left" :inline="true">
      <el-form-item label="选品名称：">{{ msgList.productCname }}</el-form-item>
      <el-form-item label="开发负责人：">
        <span v-if="msgList.createUserName">{{ msgList.createUserName }}</span>
        <span v-else>-</span>
      </el-form-item>
      <el-form-item label="竞品链接：">
        <el-link :underline="false" class="urlWidth" :href="msgList.referenceLinking" target="_blank">{{ msgList.referenceLinking }}</el-link>
      </el-form-item>
      <el-form-item label="采购负责人：">
        <span v-if="msgList && msgList.purchaseUserName">{{ msgList.purchaseUserName }}</span>
        <span v-else>-</span>
      </el-form-item>
      <el-form-item label="参考价格：">
        {{ msgList.referencePrice ? Number(msgList.referencePrice).toFixed(2) : "-" }}{{ msgList.priceUnit ? msgList.priceUnit : "-" }}
      </el-form-item>
      <el-form-item label="选品建议售价：">
        <span>{{ msgList.suggestPrice ? Number(msgList.suggestPrice).toFixed(2) : "-" }}{{ msgList.priceUnit ? msgList.priceUnit : "-" }}</span>
      </el-form-item>
      <el-form-item label="选品属性：">
        <span v-if="msgList.purchaseDetailVOS && msgList.purchaseDetailVOS.length > 1">组合商品</span>
        <span v-else>单个商品</span>
      </el-form-item>
    </el-form>

    <el-table
      v-if="type == 8 || type == 4"
      :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
      border
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" v-if="type !== 8" fixed="left"></el-table-column>
      <el-table-column prop="platform" label="平台" show-overflow-tooltip></el-table-column>
      <el-table-column prop="site" label="站点" show-overflow-tooltip></el-table-column>
      <el-table-column prop="platformSellingPrice" label="平台售价" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ scope.row.platformSellingPrice ? Number(scope.row.platformSellingPrice).toFixed(2) : "-" }}{{ scope.row.rateType ? scope.row.rateType : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="建议售价" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ scope.row.suggestPrice ? Number(scope.row.suggestPrice).toFixed(2) : "-" }}{{ scope.row.rateType ? scope.row.rateType : "" }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="parameter" label="参数" show-overflow-tooltip></el-table-column>
      <el-table-column label="选品链接" min-width="160px" show-overflow-tooltip>
        <template #default="scope">
          <el-link :underline="false" :href="scope.row.linking" target="_blank">{{ scope.row.linking ? scope.row.linking : "-" }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="warehouse" label="目的仓" show-overflow-tooltip></el-table-column>
      <el-table-column prop="number" label="数量" show-overflow-tooltip>
        <template #default="scope">
          <span>
            {{ scope.row.number ? Number(scope.row.number).toFixed(2) : "-" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="costPrice" label="成本价" min-width="150px" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="scope.row.costPrice && !scope.row.disable">
            {{ Number(scope.row.costPrice).toFixed(2) }} CNY/ {{ (Number(scope.row.costPrice) / Number(scope.row.rate)).toFixed(2) }}{{ scope.row.rateType }}
          </span>
          <span v-else>
            <el-input v-model.trim="upMsg.costPrice" clearable size="mini" placeholder="成本价"></el-input>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商" min-width="160px" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="!scope.row.disable">
            {{ scope.row.supplierName ? scope.row.supplierName : "-" }}
          </span>
          <el-select v-else v-model="upMsg.supplierId" filterable clearable size="mini" placeholder="请选择">
            <el-option v-for="item in supplierList" :key="item.id" :label="item.supplierName" :value="item.id"></el-option>
          </el-select>
        </template>
      </el-table-column>

      <el-table-column prop="transport" label="运输方式" min-width="160px" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="scope.row.transportMode && !scope.row.disable">
            <span>{{ scope.row.transportMode ? tableTypeComputed(logistics_transport_mode, scope.row.transportMode) : "-" }}</span>
          </span>
          <el-select v-else v-model="upMsg.transport" filterable clearable size="mini" placeholder="运输方式">
            <el-option v-for="item in logistics_transport_mode" :key="item.dizKey" :label="item.value" :value="item.dizKey"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="grossProfit" label="毛利润" min-width="100px" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ scope.row.grossProfit ? Number(scope.row.grossProfit).toFixed(2) : "-" }}{{ scope.row.rateType ? scope.row.rateType : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="grossMargin" label="毛利率" show-overflow-tooltip>
        <template #default="scope">
          <span class="color-red">{{ scope.row.grossMargin ? Number(scope.row.grossMargin).toFixed(2) + "%" : "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" min-width="150px" label="操作" align="center">
        <template #default="scope">
          <!-- <el-button v-if="type == 8 && !scope.row.disable" size="mini" icon="el-icon-delete" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="type == 8 && scope.row.disable" size="mini" icon="el-icon-circle-check" type="text" @click="handleSavet(scope.$index, scope.row)">
            保存
          </el-button> -->
          <el-button v-if="type == 8 || (type == 4 && !scope.row.disable)" size="mini" icon="el-icon-tickets" type="text" @click="handleDetail(scope.$index, scope.row)">
            明细
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="计算明细" v-model="dialogMsgVisible" :close-on-click-modal="false" destroy-on-close>
      <PublicTabel ref="PublicTabel"></PublicTabel>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, onBeforeMount, onMounted, computed, getCurrentInstance, inject, ref, nextTick } from "vue";
import PublicTabel from "./PublicTabel";
import { ElMessage } from "element-plus";
import { localGet, localSet } from "../../../utils/util";
export default {
  name: "PriceMsg",
  components: {
    PublicTabel,
  },
  setup(prop, ctx) {
    const data = reactive({
      tableData: [],
      selectList: [],
      logistics_transport_mode: [],
      supplierList: [],
      msgList: {},
      type: 1,
      dialogMsgVisible: false,
      loading: false,
      upMsg: {
        costPrice: 0,
        id: 0,
        supplierId: "",
        transport: "",
      },
      btnFlag: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});

    const getMsg = () => {
      data.msgList = localGet("goodsDetails").row;
      data.type = localGet("goodsDetails").type;
      if (data.type == 4 || data.type == 8) {
        // 运输方式
        data.logistics_transport_mode = localGet("dictCodeList").logistics_transport_mode ? localGet("dictCodeList").logistics_transport_mode : [];

        getValuationList();

        api.provider.getSupplierListAll().then(res => {
          if (res.code == 200) {
            data.supplierList = res.data;
          }
        });
      }
    };

    // 获取计价信息列表
    const getValuationList = () => {
      data.tableData = [];
      data.loading = true;
      if (data.type == 8) {
        api.valuation.getMaoliFinalList({ proId: data.msgList.id }).then(res => {
          if (res.code == 200) {
            data.tableData = res.data;
          } else {
            vue.$message({
              type: "warning",
              message: res.msg,
            });
          }
        });
        data.loading = false;
      } else {
        let msg = {
          infoList: [],
          proId: data.msgList.id,
        };
        if (data.msgList.purchaseDetailVOS.length > 0) {
          let arr = data.msgList.purchaseDetailVOS;
          for (let i = 0; i < arr.length; i++) {
            let info = {
              height: Number(arr[i].height),
              length: Number(arr[i].length),
              purchasePrice: Number(arr[i].purPrice),
              roughWeight: Number(arr[i].weight),
              wide: Number(arr[i].width),
            };
            msg.infoList[i] = info;
          }
          api.valuation
            .getValuationList(msg)
            .then(res => {
              console.log("计价列表", res);
              if (res.code == 200) {
                for (let item of res.data) {
                  item.disable = false;
                }
                data.tableData = res.data;
                data.loading = false;
              } else {
                vue.$message({
                  type: "warning",
                  message: res.msg,
                });
              }
            })
            .catch(() => {
              data.loading = false;
            });
        }
      }
    };

    // 单个修改状态
    const stateEdit = index => {
      data.btnFlag = true;
      if (data.selectList.length < 1) {
        ElMessage.warning({
          message: "至少选择一条信息!",
          type: "warning",
        });
        data.btnFlag = false;
      } else {
        let note = index == 5 ? "此操作将作废选品, 是否继续?" : "此操作将把该计价信息提交终审, 是否继续?";
        vue
          .$confirm(note, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            let valuationIds = [];
            for (let item of data.selectList) {
              valuationIds.push(item.id);
            }
            api.valuation.submitFlag(valuationIds).then(res => {
              console.log("修改选取标识", res);
              if (res.code == 200) {
                let msg = {
                  ids: Array(data.msgList.id),
                  status: index,
                  valuationIds: valuationIds,
                };
                api.develop.updateInputThird(msg).then(res => {
                  console.log(res);
                  if (res.code == 200) {
                    vue.$message({
                      type: "success",
                      message: res.msg,
                    });
                    // vue.$parent.getTableData();
                    closeTab();
                  } else {
                    vue.$message({
                      type: "warning",
                      message: res.msg,
                    });
                  }
                });
              } else {
                vue.$message({
                  type: "warning",
                  message: "请联系技术人员解决",
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

        data.btnFlag = false;
      }
    };

    // 查看详情
    const handleDetail = (index, row) => {
      data.dialogMsgVisible = true;
      nextTick(() => {
        vue.$refs.PublicTabel.getMsg(row.id);
      });
    };

    // 点击编辑
    const handleEdit = (index, row) => {
      row.disable = true;
      data.upMsg.costPrice = Number(row.costPrice).toFixed(2);
      row.grossMargin = "";
      row.grossProfit = "";
      data.upMsg.id = row.id;
      data.upMsg.supplierId = row.supplierId > 0 ? row.supplierId : "";
      data.upMsg.transport = String(row.transportMode);
    };

    // 点击保存
    const handleSavet = (index, row) => {
      api.valuation.updateFurther(data.upMsg).then(res => {
        console.log("补充计价信息", res);
        if (res.code == 200) {
          getValuationList();
          vue.$message({
            type: "success",
            message: res.msg,
          });
          row.disable = false;
        } else {
          vue.$message({
            type: "warning",
            message: res.msg,
          });
        }
      });
    };

    // 删除
    const delValuation = (index, row) => {
      api.valuation.delValuation({ id: row.id }).then(res => {
        console.log("删除", res);
        if (res.code == 200) {
          vue.$message({
            type: "success",
            message: res.msg,
          });
          getValuationList();
        } else {
          vue.$message({
            type: "warning",
            message: res.msg,
          });
        }
      });
    };

    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (option, dizKey) {
        if (option.length > 1 && dizKey !== -1) {
          for (let item of option) {
            if (dizKey == item.dizKey) {
              return item.value;
            }
          }
        }
      };
    });

    // 列表选择
    const handleSelectionChange = val => {
      data.selectList = val;
    };
    const closeTab = inject("closeTab");
    const refData = toRefs(data);
    return {
      ...refData,
      getMsg,
      stateEdit,
      handleDetail,
      handleSelectionChange,
      closeTab,
      delValuation,
      tableTypeComputed,
      handleEdit,
      handleSavet,
      PublicTabel,
    };
  },
};
</script>
<style lang="scss" scoped>
.el-form-item {
  width: 48%;
}
.but-right {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  width: 90%;
}
.urlWidth {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 400px;
  display: block;
}
</style>
