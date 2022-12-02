<!-- 产品二次分配搜索 -->
<template>
  <div id="SearchPanel">
    <el-form
      :inline="true"
      size="mini"
      ref="searchRuleFormRef"
      label-width="100px"
      :model="searchRuleForm"
      class="demo-form-inline el-from"
    >
      <div class="form-content" :class="{ collapseClass: searchShow }">
        <el-form-item label="提交人:" class="SearchPanel-form-item">
          <el-select
            v-model="searchRuleForm.submitUserId"
            filterable
            placeholder="请选择"
            clearable
            @change="onSubmit"
          >
            <el-option
              v-for="item in perSonnelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品分类:" class="SearchPanel-form-item">
          <el-cascader
            :options="options"
            @change="categoryChange"
            :props="propsClass"
            v-model="searchRuleForm.proClassifyId"
            filterable
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="产品名称:" class="SearchPanel-form-item">
          <el-tooltip
            effect="dark"
            :disabled="searchRuleForm.proCname == ''"
            :content="searchRuleForm.proCname"
            placement="bottom"
          >
            <el-input
              v-model="searchRuleForm.proCname"
              placeholder="输入选品名称"
              clearable
              @change="onSubmit"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="分配状态:" class="SearchPanel-form-item">
          <el-select
            v-model="searchRuleForm.allocationState"
            filterable
            placeholder="请选择"
            clearable
            @change="onSubmit"
          >
            <el-option
              v-for="item in stateOptions"
              :key="item.dictKey"
              :label="item.dictValue"
              :value="item.dictKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提交时间:" class="SearchPanel-form-item">
          <el-date-picker
            v-model="searchRuleForm.time"
            type="datetimerange"
            :shortcuts="shortcuts"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="onSubmit"
          ></el-date-picker>
        </el-form-item>
      </div>
      <div class="footer-button">
        <el-form-item>
          <el-button
            type="text"
            size="mini"
            class="open"
            @click="searchShow = !searchShow"
            v-if="showSearchBtn"
          >
            {{ searchShow ? "合并" : "展开" }}
            <i
              class="el-icon--right"
              :class="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            ></i>
          </el-button>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
          <el-button type="primary" icon="el-icon-refresh" @click="reset"
            >重置</el-button
          >
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  ref,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
} from "vue";
import { localGet, parseTime } from "@/utils/util";
import { useShowSearchBtn } from "@/compositionApi/useShowSearchBtn";

export default {
  name: "",
  props: {},
  setup(prop, ctx) {
    const { showSearchBtn } = useShowSearchBtn();

    const data = reactive({
      searchShow: false,
      searchRuleForm: {
        allocationState: "", // 状态
        proCname: "", // 产品中文名
        time: "", // 时间
        proClassifyId: "", // 分类id
        submitUserId: "", // 提交人
        exceptionState: "",
      },
      // 提交人数据---->
      perSonnelList: [],
      // 状态数据----->
      stateOptions: [
        {
          dictValue: "已分配",
          dictKey: "2",
        },
        {
          dictValue: "待分配",
          dictKey: "1",
        },
      ],
      state: "分配状态",
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
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      api.system.getAllCategoryList().then((res) => {
        data.options = res.data;
      });
      api.develop.getPurchaseOperator().then((res) => {
        data.perSonnelList = res.data;
      });
    });
    const refData = toRefs(data);

    // 搜索  onSubmit
    const onSubmit = () => {
      let msg = {
        submitUserId: data.searchRuleForm.submitUserId,
        proClassifyId: data.searchRuleForm.proClassifyId
          ? data.searchRuleForm.proClassifyId.pop()
          : "",
        proCname: data.searchRuleForm.proCname
          ? data.searchRuleForm.proCname.trim()
          : "",
        allocationState: data.searchRuleForm.allocationState,
        startTime: data.searchRuleForm.time
          ? parseTime(data.searchRuleForm.time[0])
          : "",
        endTime: data.searchRuleForm.time
          ? parseTime(data.searchRuleForm.time[1])
          : "",
        current: 1, // 当前页为 1
        scroll: 0,
        size: 10, // 每页10条
      };
      vue.$parent.getDataList(msg);
    };

     //重置
     const reset = () => {
      data.searchRuleForm = {}
      vue.$parent.getDataList(data.searchRuleForm);
    }
    // 产品分类change事件
    const categoryChange = (e) => {
      if (e) {
        data.searchRuleForm.productClassificationId = e[e.length - 1];
      }
      onSubmit();
    };

    return {
      ...refData,
      onSubmit,
      reset,
      categoryChange,
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
