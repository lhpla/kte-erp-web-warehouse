<!-- ProductManageSet 字段配置 -->
<template>
  <div id="productManageSet">
    <el-dialog v-model="productManageSetVisible" width="1350px" :close-on-click-modal="false" :before-close="handleClose" destroy-on-close>
      <template #title>
        <div class="dialog-title">
          <span>字段配置</span>
        </div>
      </template>
      <!-- 基础信息 -->
      <div class="mb20">
        <div class="title">
          <span style="display: flex"
            ><span style="display: block; width: 2px; height: 14px; margin-right: 5px; background-color: #409eff"></span>基础信息</span
          >
          <el-checkbox
            :indeterminate="basicIndeterminate"
            v-model="basicCheckAll"
            @change="handleCheckAllChange($event, 'checkedBasic', 'basicList', 'basicIndeterminate')"
            >全选</el-checkbox
          >
        </div>
        <el-checkbox-group
          v-model="checkedBasic"
          @change="handleCheckedChange($event, 'basicCheckAll', 'basicList', 'basicIndeterminate')"
        >
          <el-checkbox v-for="item in basicList" :key="item" :label="item">{{ item }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <!-- 采购信息 -->
      <div class="mb20">
        <div class="title">
          <span style="display: flex"
            ><span style="display: block; width: 2px; height: 14px; margin-right: 5px; background-color: #409eff"></span>采购信息</span
          >
          <el-checkbox :indeterminate="purchaseIndeterminate">全选</el-checkbox>
        </div>
        <el-checkbox-group v-model="checkedCities">
          <el-checkbox label="1">1</el-checkbox>
          <el-checkbox label="1">1</el-checkbox>
        </el-checkbox-group>
      </div>
      <!-- 质检信息 -->
      <div class="mb20">
        <div class="title">
          <span style="display: flex"
            ><span style="display: block; width: 2px; height: 14px; margin-right: 5px; background-color: #409eff"></span>质检信息</span
          >
          <el-checkbox :indeterminate="qualityIndeterminate">全选</el-checkbox>
        </div>
        <el-checkbox-group v-model="checkedCities">
          <el-checkbox label="1">1</el-checkbox>
          <el-checkbox label="1">1</el-checkbox>
        </el-checkbox-group>
      </div>
      <!-- 虚拟申报信息 -->
      <div class="mb20">
        <div class="title">
          <span style="display: flex"
            ><span style="display: block; width: 2px; height: 14px; margin-right: 5px; background-color: #409eff"></span>虚拟申报信息</span
          >
          <el-checkbox :indeterminate="fictitiousIndeterminate">全选</el-checkbox>
        </div>
        <el-checkbox-group v-model="checkedCities">
          <el-checkbox label="1">1</el-checkbox>
          <el-checkbox label="1">1</el-checkbox>
        </el-checkbox-group>
      </div>
      <!-- 海关申报信息 -->
      <div class="mb20">
        <div class="title">
          <span style="display: flex"
            ><span style="display: block; width: 2px; height: 14px; margin-right: 5px; background-color: #409eff"></span>海关申报信息</span
          >
          <el-checkbox :indeterminate="hsIndeterminate">全选</el-checkbox>
        </div>
        <el-checkbox-group v-model="checkedCities">
          <el-checkbox label="1">1</el-checkbox>
          <el-checkbox label="1">1</el-checkbox>
        </el-checkbox-group>
      </div>
      <!-- 清关信息 -->
      <div class="mb20">
        <div class="title">
          <span style="display: flex"
            ><span style="display: block; width: 2px; height: 14px; margin-right: 5px; background-color: #409eff"></span>清关信息</span
          >
          <el-checkbox :indeterminate="customsIndeterminate">全选</el-checkbox>
        </div>
        <el-checkbox-group v-model="checkedCities">
          <el-checkbox label="1">1</el-checkbox>
          <el-checkbox label="1">1</el-checkbox>
        </el-checkbox-group>
      </div>
      <!-- 销售信息 -->
      <div class="mb20">
        <div class="title">
          <span style="display: flex"
            ><span style="display: block; width: 2px; height: 14px; margin-right: 5px; background-color: #409eff"></span>销售信息</span
          >
          <el-checkbox :indeterminate="saleIndeterminate">全选</el-checkbox>
        </div>
        <el-checkbox-group v-model="checkedCities">
          <el-checkbox label="1">1</el-checkbox>
          <el-checkbox label="1">1</el-checkbox>
        </el-checkbox-group>
      </div>
      <template #footer>
        <div style="display: flex; justify-content: space-between">
          <el-button size="mini" type="primary" plain round>恢复默认</el-button>
          <span class="dialog-footer">
            <el-button type="primary" size="mini">保存</el-button>
            <el-button @click="handleClose" size="mini">取 消</el-button>
          </span>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from "vue";
export default {
  name: "ProductManageSet",
  setup(prop, ctx) {
    const data = reactive({
      productManageSetVisible: false,
      basicIndeterminate: false,
      purchaseIndeterminate: false,
      qualityIndeterminate: false,
      fictitiousIndeterminate: false,
      hsIndeterminate: false,
      customsIndeterminate: false,
      saleIndeterminate: false,
      basicCheckAll: false,

      basicList: ["a", "b", "c", "d"],
      checkedBasic: [],

      checkedCities: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const openDialog = () => {
      data.productManageSetVisible = true;
    };

    const handleClose = () => {
      data.productManageSetVisible = false;
    };
    //全选状态改变时
    const handleCheckAllChange = (val, checked, list, indeterminate) => {
      data[checked] = val ? data[list] : [];
      data[indeterminate] = true;
    };
    //复选框改变时
    const handleCheckedChange = (value, checkAll, list, indeterminate) => {
      let checkedCount = value.length;
      data[checkAll] = checkedCount === data[list].length;
      data[indeterminate] = checkedCount > 0 && checkedCount < data[list].length;
    };
    const refData = toRefs(data);
    return {
      ...refData,
      openDialog,
      handleClose,
      handleCheckAllChange,
      handleCheckedChange,
    };
  },
};
</script>
<style lang="scss">
#productManageSet {
  .dialog-title {
    display: flex;
    justify-content: space-between;
    padding: 0 50px 0 0;
    align-items: center;
    span {
      font-size: 18px;
    }
  }
  .el-dialog__body{
    padding:40px
  }
  .mb20 {
    margin-bottom: 20px;
    .title {
      display: flex;
      justify-content: space-between;
      // font-size: 16px;
      margin-bottom: 20px;
    }
  }
}
</style>
