<!--DistributionOfficer  SPU品类管理分配负责人-->
<template>
  <div id="DistributionOfficer">
    <el-dialog :title="title" v-model="productVisible" :close-on-click-modal="false" width="500px" @close="closed" destroy-on-close>
      <el-form ref="productFormRef" size="mini" :model="Form" label-width="120px" class="dialog-form">
        <el-form-item label="开发负责人：" prop="devResponsibility">
          <el-select v-model="Form.devResponsibility" class="form-width" multiple filterable clearable placeholder="请选择">
            <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购负责人：" prop="purchaseResponsibility">
          <el-select v-model="Form.purchaseResponsibility" class="form-width" multiple filterable clearable placeholder="请选择">
            <el-option v-for="item in headOfPurchasingList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="补货：" prop="replenishmentResponsibility">
          <el-select v-model="Form.replenishmentResponsibility" class="form-width" multiple filterable clearable placeholder="请选择">
            <el-option v-for="item in replenishmentList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="mini" :loading="submitActive" :disabled="submitActive" type="primary" @click="onSubmit">确 定</el-button>
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
      productVisible: false,
      submitActive: false,
      userList: [],
      ids: [],
      headOfPurchasingList: [],
      replenishmentList:[],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const refData = toRefs(data);
    const productFormRef = ref(null);
    const getTableData = inject("getTableData");

    const getMsg = msg => {
      data.Form = {};
      data.ids = msg.map(item => item.id);
      let infomsg=msg.map(item => item.sysCategoryId);
      data.productVisible = true;
      // 开发负责人
      api.product.getPersonInCharge(infomsg).then(res => {
        if (res.code == 200) {
          data.userList = res.data;
          api.userOperation.getHeadOfDevelopment().then(res => {
            if (res.code == 200) {
              data.replenishmentList = res.data;
              api.userOperation.getHeadOfPurchasing().then(res1 => {
                if (res1.code == 200) {
                  data.headOfPurchasingList = res1.data;
                  if (msg.length === 1) {
                    api.product.getSpuPropertyPersonInChargeById({ id: data.ids[0] }).then(res2 => {
                      if (res2.code == 200) {
                        data.Form.devResponsibility = res2.data.devResponsibility ? res2.data.devResponsibility.split(",") : [];
                        data.Form.purchaseResponsibility = res2.data.purchaseResponsibility ? res2.data.purchaseResponsibility.split(",") : [];
                        data.Form.replenishmentResponsibility = res2.data.replenishmentResponsibility ? res2.data.replenishmentResponsibility.split(",") : [];
                      }
                    });
                  }
                } else {
                  data.tableLoading = false;
                  vue.$message({
                    type: "warning",
                    message: res.msg,
                  });
                }
              });
            }
          })
        } else {
          data.tableLoading = false;
          vue.$message({
            type: "warning",
            message: res.msg,
          });
        }
      });
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
        devResponsibility: data.Form.devResponsibility,
        purchaseResponsibility: data.Form.purchaseResponsibility,
        replenishmentResponsibility: data.Form.replenishmentResponsibility,
        type:"1",
      };
      api.product.spuPropertySssignThePersonInCharge(info).then(res => {
        if (res.code == 200) {
          data.productVisible = false;
          data.tableLoading = false;
          data.Form = {};
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
      getTableData,
    };
  },
};
</script>
<style scoped lang="scss">
.form-width {
  width: 100%;
}
</style>
