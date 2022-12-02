<template>
  <div>
    <el-form :model="searchParam" ref="searchForm" label-width="120px" size="mini" class="el-from" :inline="true">
      <div>
        <el-form-item label="组合名称 :" prop="productName">
          <el-input clearable v-model="searchParam.groupName" placeholder="组合名称" @change="search"></el-input>
        </el-form-item>
        <el-form-item label="组合SKU :" prop="groupSku">
          <el-input clearable v-model="searchParam.groupSku" placeholder="组合SKU" @change="search"></el-input>
        </el-form-item>
        <el-form-item label="操作人 :" prop="updateUserId">
          <el-select v-model="searchParam.updateUserId" size="mini" clearable @change="search" placeholder="请选择">
            <el-option v-for="item in perSonnelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间 :" prop="time">
          <el-select v-model="searchParam.timeType" size="mini" style="width: 100px !important; margin-right: 5px">
            <el-option label="创建时间" value="1"></el-option>
            <el-option label="更新时间" value="2"></el-option>
          </el-select>
          <el-date-picker v-model="searchParam.times" @change="dateBlur(searchParam.times)" type="datetimerange"
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item class="search-operation">
          <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="primary" size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { reactive, toRefs, ref, getCurrentInstance, inject, onBeforeMount, onMounted } from "vue";
import authorButtons from "@/compositionApi/authorButtons";
import { parseTime, localGet } from "@/utils/util";
export default {
  name: "CombinationProductSearchPanel",
  props: ["searchMsg"],
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      searchParam: {
        timeType: "1",
        groupName: "",
        groupSku: "",
        updateUserId: "",
        times: "",
      },
      perSonnelList: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onMounted(() => {
      if (vue.$route.query.sku) {
        data.searchParam.groupSku = vue.$route.query.sku;
      }
      getProductOperator()
    })
    const getTableData = inject("getTableData");
    const search = () => {
      let msg = vue.searchMsg;
      msg.groupName = data.searchParam.groupName;
      msg.groupSku = data.searchParam.groupSku;
      msg.timeType = data.searchParam.timeType;
      msg.updateUserId = data.searchParam.updateUserId;
      msg.startTime = data.searchParam.startTime;
      msg.endTime = data.searchParam.endTime;
      getTableData(msg);
    };
    const dateBlur = (e) => {
      if (e) {
        data.searchParam.startTime = parseTime(e[0]);
        data.searchParam.endTime = parseTime(e[1]);
      } else {
        delete data.searchParam.startTime
        delete data.searchParam.endTime
        // data.searchParam.startTime = "";
        // data.searchParam.endTime = "";
      }
      search()
    }
    const reset = () => {
      data.searchParam = {
        timeType: "1",
        groupName: "",
        groupSku: "",
        updateUserId: "",
        times: "",
        size: 10,
        current: 1,
      };
      getTableData(data.searchParam);
    };

    const getProductOperator = () => {
      api.userOperation.getHeadOfPurchasing().then((res) => {
        data.perSonnelList = res.data;
      });
    }
    const refData = toRefs(data);
    return {
      ...refData,
      search,
      reset,
      buttonAuthor,
      dateBlur
    };
  }
};
</script>

<style lang="scss" scoped>
.el-from {

  .el-input,
  .el-cascader,
  .el-select {
    width: 193px;
  }
}
</style>
>
