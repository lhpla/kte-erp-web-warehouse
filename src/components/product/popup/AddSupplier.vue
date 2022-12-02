<!-- 新增备选供应商 -->
<template>
  <div id="AddSupplier">
    <el-dialog title="新增备选" width="80%" v-model="addVisible" :close-on-click-modal="false" @close="closed" destroy-on-close>
      <el-form :model="tableForm" ref="tableFormRef">
        <el-table :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }" :data="tableForm.tableData" tooltip-effect="dark" border max-height="500">
          <el-table-column label="备选属性">
            <template #default="{ row, $index }">
              <el-form-item label="" v-if="$index >= 0" :prop="`tableData.${$index}.supplierProperty`" :rules="tableRules.supplierProperty">
                <el-select v-model="row.supplierProperty" size="mini" filterable clearable placeholder="请选择">
                  <el-option v-for="item in attribute" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="siteId" label="备选供应商">
            <template #default="{ row, $index }">
              <span v-if="row.supplierProperty == 1">
                <el-form-item v-if="$index >= 0" :prop="`tableData.${$index}.supplierName`" :rules="tableRules.supplierName">
                  <el-input v-model="row.supplierName" clearable size="mini"></el-input>
                </el-form-item>
              </span>
              <span v-else @click="supplierBlur($index)">
                <el-form-item v-if="$index >= 0" :prop="`tableData.${$index}.intentionSupplierId`" :rules="tableRules.intentionSupplierId">
                  <SupplierPublic ref="SupplierPublic" @handChange="searcHandChange" class="SupplierPublic"></SupplierPublic>
                  <el-input v-model="row.intentionSupplierId" style="display: none"></el-input>
                </el-form-item>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="storeId" label="备选类型">
            <template #default="{ row, $index }">
              <el-form-item label="" v-if="$index >= 0" :prop="`tableData.${$index}.supplierType`" :rules="tableRules.supplierType">
                <el-select v-model="row.supplierType" size="mini" filterable clearable placeholder="请选择">
                  <el-option v-for="item in alternativeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="salesManagerId" label="备注">
            <template #default="{ row, $index }">
              <el-form-item label="" v-if="$index >= 0" :prop="`tableData.${$index}.remark`" :rules="tableRules.remark">
                <el-input type="textarea" v-model="row.remark" class="remark" maxlength="100" clearable show-word-limit></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="salesManagerId" label="采购价格(CNY)">
            <template #default="{ row, $index }">
              <el-form-item label="" v-if="$index >= 0" :prop="`tableData.${$index}.procurementPrice`" :rules="tableRules.procurementPrice">
                <el-input v-model.trim="row.procurementPrice" size="mini" clearable placeholder="采购单价"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column class-name="table-operation" width="100" label="操作">
            <template #default="{ $index }">
              <el-button size="mini" icon="el-icon-delete" type="text" @click="deleteProMarketInfo($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closed" size="mini">取 消</el-button>
          <el-button type="primary" @click="add" :loading="submitActive" :disabled="submitActive" size="mini" plain>新 增</el-button>
          <el-button type="primary" @click="AddSupplier" :loading="submitActive" :disabled="submitActive" size="mini">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from "vue";
import authorButtons from "@/compositionApi/authorButtons";
import { localGet } from "@/utils/util";

export default {
  name: "AddSupplier",
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      addVisible: false,
      submitActive: false,
      tableForm: {
        tableData: [
          {
            supplierPayId: Math.ceil(Math.random() * 10000),
            proId: "",
            intentionSupplierId: "",
            supplierProperty: "1",
            ind: 1,
          },
        ],
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
      proId: "",
      proSku: "",
      index: "",
      userId: "",
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const refData = toRefs(data);
    const getMsg = (id, proSku, userId) => {
      data.proId = id;
      data.userId = userId;
      data.proSku = proSku;
      data.addVisible = true;
      data.submitActive = false;
    };

    // 删除
    const deleteProMarketInfo = row => {
      data.tableForm.tableData.splice(row, 1);
    };
    // 新增
    const add = () => {
      vue.$refs.SupplierPublic.getSupplier();
      let obj = {
        proId: "",
        intentionSupplierId: "",
        supplierProperty: "1",
        ind: data.tableForm.tableData.length + 1,
      };
      data.tableForm.tableData.push(obj);
    };

    const tableFormRef = ref(null);

    // 保存
    const AddSupplier = () => {
      tableFormRef.value.validate(valid => {
        if (valid) {
          data.submitActive = true;
          for (let item of data.tableForm.tableData) {
            item.proId = data.proId;
            item.proSku = data.proSku;
          }
          api.productLibrary
            .insertAlternativeSupplier(data.tableForm.tableData)
            .then(res => {
              if (res.code == 200) {
                vue.$message({
                  type: "success",
                  message: res.msg,
                });
                closed();
                vue.$parent.$parent.getAlternativeSupplierData(buttonAuthor.AlternativeSupplierEnter ? data.userId : localGet("userInfo").user_id);
                data.submitActive = false;
              } else {
                vue.$message({
                  type: "warning",
                  message: res.msg,
                });
                data.submitActive = false;
              }
            })
            .catch(err => {
              data.submitActive = false;
            });
        }
      });
    };
    // 搜索供应商
    const searcHandChange = e => {
      if (e) {
        data.tableForm.tableData[data.index].intentionSupplierId = e;
      } else {
        data.tableForm.tableData[data.index].intentionSupplierId = "";
      }
    };
    // 获取index
    const supplierBlur = index => {
      data.index = index;
    };
    // 关闭弹窗
    const closed = () => {
      data.addVisible = false;
      data.submitActive = false;
      data.tableForm.tableData = [
        {
          supplierPayId: Math.ceil(Math.random() * 10000),
          proId: "",
          intentionSupplierId: "",
          supplierProperty: "1",
        },
      ];
      vue.$refs.tableFormRef.clearValidate();
    };
    return {
      ...refData,
      closed,
      deleteProMarketInfo,
      add,
      getMsg,
      AddSupplier,
      tableFormRef,
      searcHandChange,
      supplierBlur,
      buttonAuthor,
    };
  },
};
</script>
<style scoped lang="scss">
#AddSupplier {
  .SupplierPublic {
    width: 140px !important;
  }
}
</style>
