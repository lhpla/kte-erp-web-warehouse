<!-- productException 产品异常列表搜索 -->
<template>
  <div>
    <el-form :inline="true" @submit.prevent size="mini" label-width="120px">
      <el-form-item label="供应商:" class="SearchPanel-form-item">
        <SupplierPublic ref="searchSupplierPublic" @handChange="searcHandChange"></SupplierPublic>
      </el-form-item>
      <el-form-item label="采购员:" class="SearchPanel-form-item">
        <el-select
          filterable
          clearable
          v-model="searchForm.buyerId"
          placeholder="请选择"
          @change="search"
        >
          <el-option
            v-for="item in purchaseUserList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="PO号：">
        <el-input
          size="mini"
          style="width: 100%"
          clearable
          filterable
          v-model="searchForm.orderCode"
          @change="search"
        ></el-input>
      </el-form-item>
      <el-form-item label="异常状态：">
        <el-checkbox-group
          v-model="searchForm.abnormalStatus"
          @change="
            changeClick(
              searchForm.abnormalStatus,
              'abnormalStatus',
              statusList.length
            )
          "
        >
          <el-checkbox-button label="0">全部</el-checkbox-button>
          <el-checkbox-button
            v-for="item of statusList"
            :label="item.dizKey"
            :key="item.dizKey"
            >{{ item.value }}</el-checkbox-button
          >
        </el-checkbox-group>
      </el-form-item>
      <div class="footer-btn">
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="search"
            >搜索</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-refresh"
            @click="reset"
            >重置</el-button
          >
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, inject } from "vue";
import authorButtons from "@/compositionApi/authorButtons";
import { localGet } from "@/utils/util";
const searchForm = ref({
  purSupplierId: "",
  buyerId: "",
  orderCode: "",
  abnormalStatus: ["0"],
});
const { ctx: vueDev, proxy: vue } = getCurrentInstance();
const api = vue.$http;
const getTableData = inject("getTableData");
const { BUTTONS } = authorButtons();
const buttonAuthor = BUTTONS.value;
// 审核状态
const statusList = ref([]);
// 搜索
const search = () => {
  let msg = {
    buyerId: searchForm.value.buyerId,
    orderCode: searchForm.value.orderCode
      ? searchForm.value.orderCode.trim()
      : "",
    purSupplierId: searchForm.value.purSupplierId,
    abnormalStatus:
      searchForm.value.abnormalStatus[0] == "0"
        ? null
        : searchForm.value.abnormalStatus,
  };
  if (msg.abnormalStatus && msg.abnormalStatus[0] != "0") {
    msg.abnormalStatus.push("develop_to_be_confirmed");
  }
  msg = JSON.parse(JSON.stringify(msg));
  getTableData(msg);
};

//重置
const reset = ()=>{
  searchForm.value = {abnormalStatus: ["0"]}
  vue.$refs.searchSupplierPublic.reastValue();
  getTableData({current:1,size:10})
}
// 搜索供应商
const searcHandChange = (e) => {
  searchForm.value.purSupplierId = e;
  search();
};
const purchaseUserList = ref([]);
// 多选改变
const changeClick = (arr, name, length) => {
  let clearArr = arr.indexOf("develop_to_be_confirmed");
  if (clearArr !== -1) {
    searchForm.value[name].splice(clearArr, 1);
  }
  if (arr.length > 0) {
    if (arr.length == length && arr[0] !== "0") {
      searchForm.value[name] = ["0"];
    } else if (arr[0] == "0") {
      let findResult = arr.indexOf("0");
      if (findResult !== -1) {
        searchForm.value[name].splice(findResult, 1);
      }
    } else {
      let findResult = arr.indexOf("0");
      if (findResult !== -1) {
        searchForm.value[name] = ["0"];
      }
    }
  } else {
    searchForm.value[name] = ["0"];
  }
  search();
};
const init = () => {
  // 采购员
  api.userOperation.getHeadOfPurchasing().then((res) => {
    if (res.code == 200) {
      purchaseUserList.value = res.data;
    }
  });
  statusList.value = localGet("purchaseDict").abnormal_status
    ? localGet("purchaseDict").abnormal_status
    : [];
};
init();
</script>

<style scoped lang="scss"></style>
