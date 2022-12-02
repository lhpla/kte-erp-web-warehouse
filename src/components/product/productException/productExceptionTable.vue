<!-- productExceptionTable 产品异常列表表格 -->
<template>
  <div>
    <vxe-table
      :loading="tableLoading"
      :data="tableData"
      border
      :header-row-style="{
        background: '#fafafa',
        color: '#2d2f30',
        fontWeight: 'bold',
        fontSize: '12px',
      }"
      style="width: 100%"
      :height="tableHeight"
      :column-config="{ resizable: true }"
      :expand-config="{ showIcon: false }"
      :row-config="{ isHover: true }"
      :tooltip-config="{ showAll: true }"
    >
      <vxe-column title="NO." align="center" type="seq" width="55"></vxe-column>
      <vxe-column title="订单信息" align="center" width="200">
        <template #default="scope">
          <div style="text-align: left">PO号：{{ scope.row.orderCode ? scope.row.orderCode : "-" }}</div>
          <div
            style="text-align: left"
          >物流号：{{ scope.row.logisticsNum ? scope.row.logisticsNum : "-" }}</div>
        </template>
      </vxe-column>
      <vxe-column title="SKU" align="center">
        <template #default="scope">
          <span>{{ scope.row.sku ? scope.row.sku : "-" }}</span>
        </template>
      </vxe-column>
      <vxe-column title="中转仓" align="center">
        <template #default="scope">
          <span>
            {{
            scope.row.transferWarehouse ? scope.row.transferWarehouse : "-"
            }}
          </span>
        </template>
      </vxe-column>
      <vxe-column title="仓区" align="center">
        <template #default="scope">
          <span>
            {{
            scope.row.purposeWarehouse ? scope.row.purposeWarehouse : "-"
            }}
          </span>
        </template>
      </vxe-column>
      <vxe-column title="运输方式" align="center" width="90">
        <template #default="scope">
          <span>
            {{
            scope.row.transportMode ? scope.row.transportMode : "-"
            }}
          </span>
        </template>
      </vxe-column>
      <vxe-column title="时间" align="center">
        <template #default="scope">
          <span>创建：{{ scope.row.createTime ? scope.row.createTime : "-" }}</span>
        </template>
      </vxe-column>
      <vxe-column title="是否更换sku" align="center" width="90">
        <template #default="scope">
          <span>{{ scope.row.purIsChangeSku ? "是" : "否" }}</span>
        </template>
      </vxe-column>
      <vxe-column title="审核状态" align="center" width="100">
        <template #default="scope">
          <span v-if="scope.row.abnormalStatus">
            {{
            tableTypeComputed(statusList, scope.row.abnormalStatus)
            }}
          </span>
          <span v-else>-</span>
        </template>
      </vxe-column>
      <vxe-column title="异常类型" align="center" width="100">
        <template #default="scope">
          <span v-if="scope.row.abnormalType">
            {{
            tableTypeComputed(abnormal_new_type, scope.row.abnormalType)
            }}
          </span>
          <span v-else>-</span>
        </template>
      </vxe-column>
      <vxe-column title="操作" width="150" align="center">
        <!--        'bad_goods','error_goods'-->
        <template #default="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-folder-checked"
            v-if="
              buttonAuthor.view &&
              (scope.row.abnormalStatus == 'the_end' ||
                scope.row.processType != 'warehousing_sku')
            "
            @click="openDialog(scope.row.id)"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document-delete"
            @click="openDialog(scope.row.id, 'deal')"
            v-if="
              buttonAuthor.edit &&
              scope.row.abnormalStatus == 'not_end' &&
              scope.row.processType == 'warehousing_sku'
            "
          >处理</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-notebook-2"
            @click="journal(scope.row.id)"
          >日志</el-button>
        </template>
      </vxe-column>
    </vxe-table>
    <productExceptionDialog ref="productExceptionDialogRef" />
    <AbnormalLog ref="AbnormalLogRef"></AbnormalLog>
  </div>
</template>

<script setup>
import {
  defineProps,
  ref,
  getCurrentInstance,
  inject,
  watch,
  computed,
} from "vue";
import { localGet } from "@/utils/util";
import { useTableHeight } from "@/compositionApi/useTableHeight.js";
import AbnormalLog from "../../../components/logDialog/AbnormalLog.vue";
import productExceptionDialog from "./productExceptionDialog.vue";
import authorButtons from "@/compositionApi/authorButtons";

const { tableHeight } = useTableHeight(260);
const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const productExceptionDialogRef = ref();
const AbnormalLogRef = ref();
const prop = defineProps({
  tableData: { type: Array, required: true },
  tableLoading: { type: Boolean, required: true },
});
watch(
  prop.tableData,
  (newVal, Val) => {
    // tableDataValue.value = newVal;
  },
  { immediate: true }
);

const { BUTTONS } = authorButtons();
const buttonAuthor = BUTTONS.value;
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
const getTableData = inject("getTableData");
const statusList = ref([]);
const abnormal_new_type = ref([]);
const openDialog = (id, e) => {
  if (productExceptionDialogRef.value) {
    productExceptionDialogRef.value.openDialog(id, e);
  }
};
// 单条日志
const journal = (e) => {
  const msg = {
    servers: "abnormal",
    dataApi: "warehouseAbnormalLog",
    abnormalIds: [e],
  };
  vue.$nextTick(() => {
    if (buttonAuthor.log) {
      AbnormalLogRef.value.checkLogDialog(msg);
    } else {
      vue.$warning.success("暂无当前日志权限!");
    }
  });
};
const init = () => {
  statusList.value = localGet("purchaseDict").abnormal_status
    ? localGet("purchaseDict").abnormal_status
    : [];
  abnormal_new_type.value = localGet("purchaseDict").abnormal_new_type
    ? localGet("purchaseDict").abnormal_new_type
    : [];
};
init();
</script>

<style scoped lang="scss"></style>
