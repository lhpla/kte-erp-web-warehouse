<!--DistributionOfficer  系统品类管理分配负责人-->
<template>
  <div id="DistributionOfficer">
    <el-dialog :title="title" v-model="productVisible" :close-on-click-modal="false" width="500px" @close="closed" destroy-on-close>
      <el-form ref="productFormRef" size="mini" :model="Form" label-width="120px" class="dialog-form">
        <el-form-item label="开发负责人:" prop="exploitUserId" class="SearchPanel-form-item">
          <el-select v-model="Form.responsibleId" multiple filterable clearable placeholder="请选择">
            <el-option :label="item.name" :value="item.id" v-for="item in auditorList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购负责人:" prop="exploitUserId" class="SearchPanel-form-item">
          <el-select v-model="Form.purchaseResponsibleId" multiple filterable clearable placeholder="请选择">
            <el-option :label="item.name" :value="item.id" v-for="item in purchasingList" :key="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="mini" :loading="submitActive" :disabled="submitActive" type="primary" @click="onSubmit">确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from "vue";
export default {
  name: "DistributionOfficer",
  setup(prop, ctx) {
    const data = reactive({
      Form: {},
      title: "操作确认",
      // 开发负责人
      auditorList: [],
      //采购负责人
      purchasingList: [],
      productVisible: false,
      submitActive: false,
      shopIdLoading: false,
      ids: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const refData = toRefs(data);
    const productFormRef = ref(null);
    const getTableData = inject("getTableData");

    const getMsg = (msg, tableData) => {
      data.Form = {};
      data.ids = msg.map(item => item.id);
      console.log(msg);
      data.productVisible = true;
      api.product
        .getAssignStaff(data.ids)
        .then((res) => {
          if (res.code == 200) {
            data.auditorList = res.data.devResponsibility;
            data.purchasingList = res.data.purchaseResponsibility
                if (msg.length === 1) {
                  api.product.getPersonInChargeById({ id: data.ids[0] }).then(res => {
                    if (res.code == 200 && (res.data.responsibleId||res.data.purchaseResponsibleId)) {
                      data.Form.responsibleId = res.data.responsibleId ? res.data.responsibleId.split(",") : [];
                      data.Form.purchaseResponsibleId = res.data.purchaseResponsibleId ? res.data.purchaseResponsibleId.split(",") : [];
                      console.log(data.Form.responsibleId);
                      console.log(data.Form.purchaseResponsibleId);
                    }
                  })
                }
          } else {
            data.tableLoading = false;
            vue.$message({
              type: 'warning',
              message: res.msg,
            });
          }
        })
        .catch((err) => {
          vue.$message({
            type: 'warning',
            message: '获取品类级别失败',
          });
        });
      // // 开发负责人
      // api.userOperation.getHeadOfDevelopment().then(res => {
      //   if (res.code == 200) {
      //     data.auditorList = res.data;
      //     if (msg.length === 1) {
      //       api.product.getPersonInChargeById({ id: msg[0] }).then(res => {
      //         if (res.code == 200 && res.data.responsibleId) {
      //           data.Form.responsibleId = res.data.responsibleId ? res.data.responsibleId.split(",") : [];
      //         }
      //       });

      //     }
      //   } else {
      //     data.tableLoading = false;
      //     vue.$message({
      //       type: "warning",
      //       message: res.msg,
      //     });
      //   }
      // });
    };

    // 关闭编辑或新增弹框
    const closed = () => {
      data.Form = {};
      data.productVisible = false;
      if (productFormRef.value) {
        productFormRef.value.clearValidate();
        productFormRef.value.resetFields();
      }
    };

    const onSubmit = () => {
      let info = {
        ids: data.ids,
        responsibleId: data.Form.responsibleId,
        purchaseResponsibleId:data.Form.purchaseResponsibleId,
        type:"1"
      };
      api.product.categoryAssignThePersonInCharge(info).then(res => {
        if (res.code == 200) {
          data.productVisible = false;
          data.tableLoading = false;
          data.Form = {};
          data.ids = [];
          getTableData();
        } else {
          data.tableLoading = false;
          vue.$message({
            type: "warning",
            message: res.msg,
          });
        }
      });
    };

    return {
      ...refData,
      getMsg,
      closed,
      onSubmit,
      productFormRef,
    };
  },
};
</script>
<style scoped lang="scss">
.form-width {
  width: 100%;
}
</style>
