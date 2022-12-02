<!-- 确认操作 -->
<template>
  <div>
    <el-dialog title="确认操作" v-model="dialogVisible" width="30%" :close-on-click-modal="false" destroy-on-close>
      <div class="min_title">选择分配</div>
      <span>确认所选产品更换采购负责人？</span>
      <el-form class="el_form">
        <el-form-item label="采购负责人">
          <el-select size="mini" v-model="distributionProcurement" filterable placeholder="请选择" clearable>
            <el-option v-for="item in purchaseAuditor" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="subMit" v-loading="btnLoading" size="mini">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from "vue";
import authorButtons from "../../../compositionApi/authorButtons";
export default {
  name: "SecondaryDistributionPop",
  setup(prop, ctx) {
    console.log(prop);
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      // 按钮loding
      btnLoading: false,
      // 分配采购负责人
      distributionProcurement: "",
      // 采购负责人列表
      purchaseAuditor: [],
      dialogVisible: false,
      selectList: []
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      api.userOperation.getHeadOfPurchasing().then(res => {
        if (res.code == 200) {
          data.purchaseAuditor = res.data;
        }
      });
    });
    const refData = toRefs(data);
    //打開彈窗
    const getMsg = list => {
      data.dialogVisible = true;
      data.selectList = list;
    };
    // 确认操作弹框确认
    const subMit = () => {
      if (data.distributionProcurement) {
        data.btnLoading = true;
        let vo = {
          ids: [],
          submissionPurchaseUserId: data.distributionProcurement
        };
        vue.selectList.map(item => {
          vo.ids.push(item.id);
        });
        console.log(vo);
        api.develop
          .batchAllocation(vo)
          .then(res => {
            if (res.code == 200) {
              console.log(res);
              vue.$message({
                type: "success",
                message: res.msg
              });
              getDataList();
              data.btnLoading = false;
              data.dialogVisible = false;
              data.distributionProcurement = "";
              data.selectList = [];
            } else {
              data.btnLoading = false;
              data.distributionProcurement = "";
              data.selectList = [];
              vue.$message({
                type: "warning",
                message: res.msg
              });
            }
          })
          .catch(err => {
            data.btnLoading = false;
            data.distributionProcurement = "";
            data.selectList = [];
          });
      } else {
        vue.$message({
          type: "warning",
          message: "请选择采购负责人!"
        });
      }
    };
    const getDataList = inject("getDataList");
    return {
      ...refData,
      buttonAuthor,
      subMit,
      getMsg
    };
  }
};
</script>
<style scoped lang="scss">
#secondaryDistributionList {
  .buttons {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
  .min_title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .el_form {
    margin-top: 30px;
  }
}
</style>
