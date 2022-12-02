<!-- 备选供应商详情 -->
<template>
  <div id="AlternativeSuppliersDetails">
    <el-dialog :title="text == 'detail' ? '详情' : '编辑'" width="80%" :close-on-click-modal="false" v-model="visible" @close="closed" destroy-on-close>
      <div v-if="text == 'detail'">
        <el-table :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }" :data="tableDataList" tooltip-effect="dark" border max-height="500">
          <el-table-column label="供应商">
            <template #default="scope">
              <span v-if="scope.row.supplierProperty == 1">{{ scope.row.supplierName }}</span>
              <span v-else>{{ scope.row.intentionSupplierName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="属性">
            <template #default="scope">
              {{ scope.row.supplierProperty == 1 ? "意向" : "备选" }}
            </template>
          </el-table-column>
          <el-table-column prop="supplierType" label="类型">
            <template #default="scope">
              {{ scope.row.supplierType == 1 ? "相同" : "相似" }}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
          <el-table-column prop="procurementPrice" label="采购价格(CNY)">
            <template #default="scope">
              {{ Number(scope.row.procurementPrice) > 0 ? Number(scope.row.procurementPrice).toFixed(2) : 0 }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <el-form :model="tableForm" ref="tableFormRef" v-if="tableForm.tableData.length > 0">
          <el-table :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }" :data="tableForm.tableData" tooltip-effect="dark" border max-height="500">
            <el-table-column label="备选属性">
              <template #default="{ row, $index }">
                <el-form-item v-if="$index >= 0" :prop="`tableData.${$index}.supplierProperty`" :rules="tableRules.supplierProperty">
                  <el-select v-model="row.supplierProperty" size="mini" filterable clearable placeholder="请选择">
                    <el-option v-for="item in attribute" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="备选供应商">
              <template #default="{ row, $index }">
                <span v-if="row.supplierProperty == 1">
                  <el-form-item v-if="$index >= 0" :prop="`tableData.${$index}.supplierName`" :rules="tableRules.supplierName">
                    <el-input v-model="row.supplierName" clearable size="mini"></el-input>
                  </el-form-item>
                </span>
                <span v-else>
                  <el-form-item v-if="$index >= 0" :prop="`tableData.${$index}.intentionSupplierId`" :rules="tableRules.intentionSupplierId">
                    <SupplierPublic ref="SupplierPublic" @handChange="searcHandChange" class="SupplierPublic"></SupplierPublic>
                    <el-input v-model="row.intentionSupplierId" style="display: none"></el-input>
                  </el-form-item>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="备选类型">
              <template #default="{ row, $index }">
                <el-form-item v-if="$index >= 0" :prop="`tableData.${$index}.supplierType`" :rules="tableRules.supplierType">
                  <el-select v-model="row.supplierType" size="mini" filterable clearable placeholder="请选择">
                    <el-option v-for="item in alternativeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="备注">
              <template #default="{ row, $index }">
                <el-form-item v-if="$index >= 0" :prop="`tableData.${$index}.remark`" :rules="tableRules.remark">
                  <el-input type="textarea" v-model="row.remark" clearable class="remark" maxlength="100" show-word-limit></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="采购价格(CNY)">
              <template #default="{ row, $index }">
                <el-form-item v-if="$index >= 0" :prop="`tableData.${$index}.procurementPrice`" :rules="tableRules.procurementPrice">
                  <el-input v-model.trim="row.procurementPrice" clearable size="mini" placeholder="采购单价"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column class-name="table-operation" width="100" label="操作">
              <template #default="scope">
                <el-button size="mini" icon="el-icon-circle-check" type="text" @click="AddSupplier(scope.row)">保存</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, nextTick } from "vue";
import authorButtons from "@/compositionApi/authorButtons";
import { localGet } from "@/utils/util";
export default {
  name: "AlternativeSuppliersDetails",
  setup(prop, ctx) {
    const data = reactive({
      visible: false,
      tableDataList: [],
      tableForm: {
        tableData: [],
      },
      tableRules: {
        procurementPrice: [{ pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: "输入异常，请重新输入" }],
        supplierProperty: [{ required: true, message: "请选择", trigger: "change" }],
        intentionSupplierId: [{ required: true, message: "请选择", trigger: "change" }],
        supplierType: [{ required: true, message: "请选择", trigger: "change" }],
        supplierName: [{ required: true, message: "请输入", trigger: "blur" }],
        remark: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      attribute: [
        {
          label: "意向",
          value: "1",
        },
        {
          label: "备选",
          value: "2",
        },
      ],
      alternativeList: [
        {
          label: "相同产品",
          value: "1",
        },
        {
          label: "相似产品",
          value: "2",
        },
      ],
      text: "",
      id: "",
      userId: "",
    });
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});

    const refData = toRefs(data);
    const getMsg = msg => {
      data.text = msg.text;
      data.id = msg.id;
      data.userId = msg.userId;
      data.visible = true;
      data.tableForm.tableData = [];
      data.tableDataList = [];
      getAlternativeSupplierInfo(data.text);
    };
    // 获取单个供应商详情
    const getAlternativeSupplierInfo = text => {
      vue.$refs.SupplierPublic.getSupplier();
      api.productLibrary.getAlternativeSupplierInfo({ id: data.id }).then(res => {
        if (res.code == 200) {
          if (text == "edit") {
            res.data.procurementPrice = res.data.procurementPrice > 0 ? Number(res.data.procurementPrice).toFixed(2) : 0;
            data.tableForm.tableData = [res.data];
            if (res.data.supplierProperty == "2") {
              nextTick(() => {
                vue.$refs.SupplierPublic.getName(res.data.intentionSupplierName ? res.data.intentionSupplierName : "");
              });
            }
          } else {
            data.tableDataList = [res.data];
          }
        }
      });
    };
    // 更新
    const AddSupplier = row => {
      console.log("row");
      api.productLibrary.updateAlternativeSupp(row).then(res => {
        if (res.code == 200) {
          vue.$message({
            type: "success",
            message: res.msg,
          });
          closed();
          vue.$parent.getAlternativeSupplierData(buttonAuthor.AlternativeSupplierEnter ? data.userId : localGet("userInfo").user_id);
        } else {
          vue.$message({
            type: "warning",
            message: res.msg,
          });
        }
      });
    };

    // 搜索供应商
    const searcHandChange = e => {
      if (e) {
        data.tableForm.tableData[0].intentionSupplierId = e;
      } else {
        data.tableForm.tableData[0].intentionSupplierId = "";
      }
    };
    // 关闭弹窗
    const closed = () => {
      data.visible = false;
      data.tableDataList = [];
      data.tableForm.tableData = [];
    };
    return {
      ...refData,
      closed,
      getMsg,
      getAlternativeSupplierInfo,
      AddSupplier,
      searcHandChange,
      buttonAuthor,
    };
  },
};
</script>
<style scoped lang='scss'></style>
