<!-- 产品限价搜索 -->
<template>
  <div id="SearchPanel">
    <el-form :inline="true" size="mini" ref="formInlineRef" label-width="110px" :model="formInline" class="demo-form-inline el-from">
      <div class="form-content" :class="{ collapseClass: searchShow }">
        <el-form-item label="品名：" class="SearchPanel-form-item">
          <el-input v-model="formInline.productName" placeholder="输入关键词" clearable @change="search"></el-input>
        </el-form-item>
        <el-form-item label="SKU：" class="SearchPanel-form-item">
          <el-input v-model="formInline.productSku" placeholder="输入SKU" clearable @change="search"></el-input>
        </el-form-item>
        <el-form-item label="创建时间：" class="SearchPanel-form-item">
          <el-date-picker
            v-model="formInline.dateTime"
            @change="dateBlur(formInline.dateTime)"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="销售平台：" class="SearchPanel-form-item">
          <el-select style="width:217px" v-model="formInline.platformId" filterable placeholder="请选择" clearable @change="search">
            <el-option v-for="item in marketPlatformName" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <!-- 按钮部分 -->
      <div class="footer-button">
        <el-form-item>
          <el-button type="text" size="mini" class="open" @click="searchShow = !searchShow" v-if="showSearchBtn">
            {{ searchShow ? "合并" : "展开" }}
            <i class="el-icon--right" :class="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </el-button>
          <el-button size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button size="mini" type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
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
  name: "ProductPriceSearch",
  setup(prop, ctx) {
    const { showSearchBtn } = useShowSearchBtn();
    const data = reactive({
      formInline: {
        productName: "",
        productSku: "",
        createTime: "",
        endTime: "",
        dateTime: "",
        marketPlatformName: "",
        platformId: "",
      },
      developmentList: [],
      //展开按钮
      searchShow: false,
      // 所有字典
      sensitive_risk_level: [],
      sensitive_word_type: [],
      marketPlatformName: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      data.sensitive_risk_level = localGet("dictCodeList").sensitive_risk_level ? localGet("dictCodeList").sensitive_risk_level : [];
      data.sensitive_word_type = localGet("dictCodeList").sensitive_word_type ? localGet("dictCodeList").sensitive_word_type : [];
      // 获取平台
      api.systemNew.getPlatformAll().then(res => {
        if (res.code == 200) {
          data.marketPlatformName = res.data;
        }
      });
    });

    const getTableData = inject("getTableData");
    const refData = toRefs(data);
    // 点击搜索
    const search = () => {
      let info = {
        productName: data.formInline.productName ? data.formInline.productName.trim() : "",
        proSku: data.formInline.productSku ? data.formInline.productSku.trim() : "",
        startTime: data.formInline.createTime,
        endTime: data.formInline.endTime,
        platformId: data.formInline.platformId ? data.formInline.platformId : "",
        size: 10,
        current: 1,
      };
      if (info.time) {
        info.createTime = parseTime(info.time[0]);
        info.endTime = parseTime(info.time[1]);
      }
      info.scroll = 0;
      getTableData(info);
    };

    //重置
    const reset = ()=>{
      data.formInline = {}
      getTableData({size: 10,current: 1,})
    }

    // 日期修改
    const dateBlur = e => {
      console.log(e);
      if (e) {
        data.formInline.createTime = parseTime(e[0]);
        data.formInline.endTime = parseTime(e[1]);
      } else {
        data.formInline.createTime = "";
        data.formInline.endTime = "";
      }
     search()
    };
    return {
      ...refData,
      search,
      reset,
      getTableData,
      dateBlur,
      showSearchBtn,
    };
  },
};
</script>
<style scoped lang='scss'>
#SearchPanel {
  .Sales {
    display: flex;
  }

  // :deep(.el-input__inner) {
  //   width: 217px;
  // }
  :deep(.el-range-editor--mini.el-input__inner) {
    width: 320px !important;
  }

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
