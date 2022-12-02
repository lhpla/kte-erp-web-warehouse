<!-- 采购初录搜索 -->
<template>
  <div id="SearchPanel">
    <el-form :inline="true" size="mini" ref="searchRuleFormRef" label-width="100px" :model="searchRuleForm" class="demo-form-inline el-from">
      <div class="form-content" :class="{ collapseClass: searchShow }">
        <el-form-item label="提交人:" class="SearchPanel-form-item">
          <el-select v-model="searchRuleForm.purchaseUserId" :disabled="!buttonAuthor.isAdministrator" filterable placeholder="请选择" clearable @change="onSubmit">
            <el-option v-for="item in perSonnelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品分类:" class="SearchPanel-form-item">
          <el-cascader
            :options="options"
            @change="categoryChange"
            :props="propsClass"
            v-model="searchRuleForm.productClassificationId"
            filterable
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="产品名称:" class="SearchPanel-form-item">
          <el-input v-model="searchRuleForm.productCname" placeholder="输入选品名称" clearable @change="onSubmit"></el-input>
        </el-form-item>
        <el-form-item :label="state" class="SearchPanel-form-item">
          <el-select v-model="searchRuleForm.status" filterable placeholder="请选择" clearable @change="onSubmit">
            <el-option v-for="item in stateOptions" :key="item.dizKey" :label="item.value" :value="item.dizKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="异常状态:" class="SearchPanel-form-item">
          <el-select v-model="searchRuleForm.exceptionState" filterable placeholder="请选择" clearable @change="onSubmit">
            <el-option v-for="item in exceptionList" :key="item.dizKey" :label="item.value" :value="item.dizKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否二次分配:" class="SearchPanel-form-item">
          <el-select v-model="searchRuleForm.isPurchaseSecondDistribution" filterable placeholder="请选择" clearable @change="onSubmit">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU:" class="SearchPanel-form-item">
          <el-input v-model="searchRuleForm.spu" placeholder="输入spu" clearable @change="onSubmit"></el-input>
        </el-form-item>
        <el-form-item label="时 间:" class="SearchPanel-form-item">
          <div class="flex">
            <el-select v-model="searchRuleForm.timeType" @change="timeTypeChange" style="width: 100px; margin-right: 5px" clearable filterable placeholder="请选择">
              <el-option v-for="item in timeTypeList" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
            <el-date-picker
              v-model="searchRuleForm.time"
              type="datetimerange"
              :shortcuts="shortcuts"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="onSubmit"
            ></el-date-picker>
          </div>
        </el-form-item>
      </div>
      <div class="footer-button">
        <el-form-item>
          <el-button type="text" @click="changeSearchShow" :icon="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" v-if="showSearchBtn">
            {{ searchShow ? "收起" : "展开" }}
          </el-button>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from "vue";
import { localGet, parseTime } from "../../../utils/util";
import authorButtons from "@/compositionApi/authorButtons";
import { useShowSearchBtn } from "@/compositionApi/useShowSearchBtn";

export default {
  name: "",
  setup(prop, ctx) {
    const { showSearchBtn } = useShowSearchBtn();
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      searchShow: false,
      searchRuleForm: {
        status: "", // 状态
        productCname: "", // 产品中文名
        time: "", // 时间
        productClassificationId: "", // 分类id
        purchaseUserId: "", // 提交人
        exceptionState: "",
        isPurchaseSecondDistribution: "", //是否二次分配
        spu: "", //spu
        timeType: "",
      },
      timeTypeList: [
        { key: "1", value: "创建时间" },
        { key: "2", value: "提交时间" },
        { key: "3", value: "审核时间" },
        { key: "4", value: "首次进入采购时间" },
      ],
      // 提交人数据---->
      perSonnelList: [],
      // 状态数据----->
      stateOptions: [],
      // 异常状态
      exceptionList: [],
      state: "录入状态:",
      // 时间基础数据
      shortcuts: [
        {
          text: "最近一周",
          value: (() => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            return [start, end];
          })(),
        },
        {
          text: "最近一个月",
          value: (() => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            return [start, end];
          })(),
        },
        {
          text: "最近三个月",
          value: (() => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            return [start, end];
          })(),
        },
      ],
      // 产品分类数据
      options: [],
      // 产品分类配置
      propsClass: {
        expandTrigger: "hover",
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      //用户信息
      localUser: {},
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      data.localUser = localGet("userInfo");
      api.system.getAllCategoryList().then(res => {
        data.options = res.data;
      });
      api.develop.getPurchaseOperator().then(res => {
        data.perSonnelList = res.data;
      });

      data.exceptionList = localGet("dictCodeList").pro_purchase_exception;
      data.stateOptions = localGet("dictCodeList").pro_purchase_status;
      data.searchRuleForm.purchaseUserId = !buttonAuthor.isAdministrator ? data.localUser.real_name : "";
    });

    // 时间类型切换
    const timeTypeChange = e => {
      data.searchRuleForm.time = null;
    };

    //changeSearchShow 展开 收起搜索
    const changeSearchShow = () => {
      data.searchShow = !data.searchShow;
    };

    // 搜索  onSubmit
    const onSubmit = () => {
      let msg = {
        exceptionState: data.searchRuleForm.exceptionState,
        productClassificationId: data.searchRuleForm.productClassificationId,
        productCname: data.searchRuleForm.productCname ? data.searchRuleForm.productCname.trim() : "",
        purchaseUserId: data.searchRuleForm.purchaseUserId,
        endTime: data.searchRuleForm.time ? parseTime(data.searchRuleForm.time[1]) : "",
        startTime: data.searchRuleForm.time ? parseTime(data.searchRuleForm.time[0]) : "",
        status: data.searchRuleForm.status,
        isPurchaseSecondDistribution: data.searchRuleForm.isPurchaseSecondDistribution,
        spu: data.searchRuleForm.spu ? data.searchRuleForm.spu.trim() : "",
        timeType: data.searchRuleForm.timeType,
        size: 10,
        scroll: 0,
        current: 1,
      };
      vue.$parent.getTableData(msg);
    };

     //重置
     const reset = () => {
      data.searchRuleForm = {}
      vue.$parent.getTableData(data.searchRuleForm);
    }

    // 产品分类change事件
    const categoryChange = e => {
      if (e) {
        data.searchRuleForm.productClassificationId = e ? e[e.length - 1] : "";
      }
      onSubmit()
    };
    const refData = toRefs(data);

    return {
      ...refData,
      onSubmit,
      reset,
      categoryChange,
      buttonAuthor,
      changeSearchShow,
      timeTypeChange,
      showSearchBtn,
    };
  },
};
</script>
<style scoped lang="scss">
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
