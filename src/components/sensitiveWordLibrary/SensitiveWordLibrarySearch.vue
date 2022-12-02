<!-- 敏感词搜索 -->
<template>
  <div id="SearchPanel">
    <el-form :inline="true" size="mini" ref="formInlineRef" label-width="100px" :model="formInline" class="demo-form-inline el-from">
      <div class="form-content" :class="{ collapseClass: searchShow }">
        <el-form-item label="关键词：" class="SearchPanel-form-item">
          <el-input v-model="formInline.keyword" placeholder="输入关键词" clearable @change="search"></el-input>
        </el-form-item>
        <el-form-item label="录入人：" class="SearchPanel-form-item">
          <el-select v-model="formInline.inputerId" filterable placeholder="请选择" clearable @change="search">
            <el-option v-for="item in developmentList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型：" class="SearchPanel-form-item">
          <el-select v-model="formInline.sensitiveType" filterable placeholder="请选择" clearable @change="search">
            <el-option v-for="item in sensitive_word_type" :key="item.dizKey" :label="item.value" :value="item.dizKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="风险等级：" class="SearchPanel-form-item">
          <el-select v-model="formInline.riskLevel" filterable placeholder="请选择" clearable @change="search">
            <el-option v-for="item in sensitive_risk_level" :key="item.dizKey" :label="item.value" :value="item.dizKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提交时间：" class="SearchPanel-form-item">
          <el-date-picker v-model="formInline.time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="search"></el-date-picker>
        </el-form-item>
      </div>
      <div class="footer-button">
        <el-form-item>
          <el-button type="text" size="mini" class="open" @click="searchShow = !searchShow" v-if="showSearchBtn">
            {{ searchShow ? "合并" : "展开" }}
            <i class="el-icon--right" :class="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </el-button>
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from "vue";
import { localGet, parseTime } from "@/utils/util";
import { useShowSearchBtn } from "@/compositionApi/useShowSearchBtn";

export default {
  name: "SensitiveWordLibrarySearch",
  setup(prop, ctx) {
    const { showSearchBtn } = useShowSearchBtn();
    const data = reactive({
      formInline: {},
      developmentList: [],
      // 所有字典
      dictCodeList: [],
      sensitive_risk_level: [],
      sensitive_word_type: [],
      searchShow: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      data.dictCodeList = localGet("dictCodeList");
      data.sensitive_risk_level = data.dictCodeList.sensitive_risk_level ? data.dictCodeList.sensitive_risk_level : [];
      data.sensitive_word_type = data.dictCodeList.sensitive_word_type ? data.dictCodeList.sensitive_word_type : [];

      // 获取开发负责人
      api.userOperation.getHeadOfDevelopment().then(res => {
        if (res.code == 200) {
          data.developmentList = res.data;
        }
      });
    });
    const getTableData = inject("getTableData");
    const refData = toRefs(data);
    // 点击搜索
    const search = () => {
      let info = {};
      data.formInline.keyword = data.formInline.keyword ? data.formInline.keyword.trim() : "";
      info = JSON.stringify(data.formInline);
      info = JSON.parse(info);
      info.size = 10;
      info.current = 1;
      if (info.time) {
        info.startTime = parseTime(info.time[0]);
        info.endTime = parseTime(info.time[1]);
      }
      getTableData(info);
    };

    //重置
    const reset = ()=>{
      data.formInline = {}
      getTableData({size:10,current:1})
    }
    return {
      ...refData,
      search,
      reset,
      getTableData,
      showSearchBtn,
    };
  },
};
</script>
<style scoped lang='scss'>
#SearchPanel {
  .form-content {
    height: 30px;
    overflow: hidden;
    transition: all 0.5s !important;
  }
  .collapseClass {
    height: auto;
    overflow: auto;
    transition: all 1s;
  }
  .footer-button {
    display: flex;
    justify-content: flex-end;
    width: 99%;
  }
}
</style>
