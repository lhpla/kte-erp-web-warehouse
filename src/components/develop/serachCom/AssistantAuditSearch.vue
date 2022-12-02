<!-- 助理审核  搜索 -->
<template>
  <div id="SearchPanel">
    <el-form :inline="true" size="mini" ref="formInlineRef" label-width="80px" :model="formInline" class="demo-form-inline el-from">
      <div class="form-content" :class="{ collapseClass: searchShow }">
        <el-form-item label="操作人" class="SearchPanel-form-item">
          <el-select v-model="formInline.auditor" filterable :disabled="!buttonAuthor.isAdministrator" placeholder="请选择" clearable @change="onSubmit">
            <el-option v-for="item in perSonnelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选品分类" class="SearchPanel-form-item">
          <el-cascader
            style="width: 180px"
            :options="options"
            @change="categoryChange"
            :props="propsClass"
            v-model="formInline.productClassificationId"
            filterable
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="选品名称" class="SearchPanel-form-item">
          <el-tooltip effect="dark" :disabled="formInline.productCname" :content="formInline.productCname" placement="bottom">
            <el-input v-model="formInline.productCname" placeholder="输入选品名称" clearable @change="onSubmit"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="审核状态" class="SearchPanel-form-item">
          <el-select v-model="formInline.status" filterable placeholder="请选择" clearable @change="onSubmit">
            <el-option v-for="item in stateOptions" :key="item.dizKey" :label="item.value" :value="item.dizKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="平 台" class="SearchPanel-form-item">
          <el-select v-model="formInline.platformId" filterable clearable placeholder="请选择" @change="onSubmit">
            <el-option v-for="item in platformOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU" class="SearchPanel-form-item">
          <el-input v-model="formInline.spu" placeholder="输入spu" clearable @change="onSubmit"></el-input>
        </el-form-item>

        <el-form-item label="时 间" class="SearchPanel-form-item">
          <div class="flex">
            <el-select v-model="formInline.timeType" style="width: 100px; margin-right: 5px" clearable filterable placeholder="请选择">
              <el-option v-for="item in timeTypeList" :key="item.key" :label="item.value" :value="item.key"></el-option>
            </el-select>
            <el-date-picker
              v-model="formInline.time"
              @change="dateBlur(formInline.time)"
              type="datetimerange"
              :shortcuts="shortcuts"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="运输方式" class="SearchPanel-form-item">
          <el-select v-model="formInline.transportType" filterable multiple placeholder="请选择" clearable @change="onSubmit">
            <el-option v-for="item in logistics_transport_mode" :key="item.dizKey" :label="item.value" :value="item.dizKey"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="footer-button">
        <el-form-item>
          <el-button type="text" size="mini" class="open" @click="searchShow = !searchShow" v-if="showSearchBtn">
            {{ searchShow ? "合并" : "展开" }}
            <i class="el-icon--right" :class="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </el-button>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { reactive, toRefs, onBeforeMount, onMounted, getCurrentInstance, ref, inject } from "vue";
import { backTableTop, localGet, localSet, parseTime } from "../../../utils/util";
import authorButtons from "../../../compositionApi/authorButtons";
import { useShowSearchBtn } from "@/compositionApi/useShowSearchBtn";
export default {
  name: "AssistantAuditSearch",
  setup(prop, ctx) {
    const { showSearchBtn } = useShowSearchBtn();
    const data = reactive({
      searchShow: false,
      platformOptions: [],
      options: [],
      formInline: {
        auditor: "",
        productCname: "",
        classify: [],
        keywords: "",
        status: "",
        time: "",
        productClassificationId: "",
        abnormalState: "",
        developmentDirector: "",
        procurementLeader: "",
        isDevelopSecondDistribution: "",
        platformId: "",
        transportType: [],
        spu: "",
        timeType: "",
      },
      timeTypeList: [
        { key: "1", value: "创建时间" },
        { key: "2", value: "审核时间" },
      ],
      perSonnelList: [],
      type: 1,
      isAdd: false,
      isEdit: false,
      propsClass: {
        expandTrigger: "hover",
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      stateOptions: [],
      logistics_transport_mode: [], //运输方式
      userInfo: "",
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
      localUser: "",
      dict: [
        {
          value: "选品状态",
          name: "pro_selection_status", // 选品列表
        },
        {
          value: "提交状态",
          name: "pro_first_status", // 产品品初录
        },
        {
          value: "产品状态",
          name: "pro_second_status", // 产品二录
        },

        {
          value: "审核状态",
          name: "pro_input3_status", // 产品三录
        },
        {
          value: "选品状态",
          name: "pro_selection_review_status", // 初审
        },
        {
          value: "录入状态",
          name: "pro_purchase_status", // 采购初录
        },
        {
          value: "产品状态",
          name: "pro_review_status", // 终审
        },
        {
          value: "录入状态",
          name: "pro_purchase_second_status", // 采购二录
        },
      ],
    });
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const getTableData = inject("getTableData");
    const formInlineRef = ref(null);
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      data.localUser = localGet("userInfo");
      // 平台
      data.platformOptions = localGet("platformLiist");
      // 运输方式
      data.logistics_transport_mode = localGet("dictCodeList").logistics_transport_mode ? localGet("dictCodeList").logistics_transport_mode : [];
    });

    //搜索
    const onSubmit = () => {
      let msg = {
        productCname: data.formInline.productCname ? data.formInline.productCname.trim() : "",
        startTime: data.formInline.startTime ? data.formInline.startTime : "",
        endTime: data.formInline.endTime ? data.formInline.endTime : "",
        productClassificationId: data.formInline.productClassificationId,
        status: data.formInline.status ? Number(data.formInline.status) : 0,
        developmentHeadId: data.formInline.developmentDirector,
        purchaseUserId: data.formInline.procurementLeader,
        exceptionState: data.formInline.abnormalState,
        isDevelopSecondDistribution: data.formInline.isDevelopSecondDistribution,
        platformId: data.formInline.platformId,
        spu: data.formInline.spu ? data.formInline.spu.trim() : "",
        transportType: data.formInline.transportType.length > 0 ? data.formInline.transportType.join(",") : "",
        timeType: data.formInline.timeType ? data.formInline.timeType : "",
        size: 10,
        scroll: 0,
        current: 1,
      };
      if (buttonAuthor.isAdministrator) {
        msg.createUser = data.formInline.auditor;
      }
      getTableData(msg);
    };

    // 获取操作人列表
    const getProductOperator = () => {
      data.perSonnelList = [];
      if (data.type == 6) {
        api.develop.getPurchaseOperator().then(res => {
          data.perSonnelList = res.data;
        });
      } else {
        api.develop.getProductOperator().then(res => {
          data.perSonnelList = res.data;
        });
      }
    };

    //重置
    const reset = () => {
      formInlineRef.value.resetFields();
      formInlineRef.value.clearValidate();
      data.formInline.auditor = "";
      data.formInline.productCname = "";
      data.formInline.classify = [];
      data.formInline.keywords = "";
      data.formInline.status = "";
      data.formInline.time = "";
      data.formInline.productClassificationId = "";
      data.formInline.abnormalState = "";
      data.formInline.developmentDirector = "";
      data.formInline.procurementLeader = "";
      data.formInline.isDevelopSecondDistribution = "";
      data.formInline.platformId = "";
      data.formInline.transportType = [];
      data.formInline.spu = "";
      data.formInline.startTime = "";
      data.formInline.endTime = "";
      data.formInline.timeType = "";
      onSubmit();
    };

    // 日期修改
    const dateBlur = e => {
      if (data.formInline.timeType) {
        if (e) {
          data.formInline.startTime = parseTime(e[0]);
          data.formInline.endTime = parseTime(e[1]);
        } else {
          data.formInline.time = "";
          data.formInline.startTime = "";
          data.formInline.endTime = "";
        }
      } else {
        data.formInline.time = "";
        vue.$message.warning("请选择时间类型");
      }
      onSubmit()
    };

    // 分类切换
    const categoryChange = e => {
      data.formInline.productClassificationId = e ? e[e.length - 1] : "";
      onSubmit()
    };

    //获取分类
    const getCategoryList = () => {
      data.options = [];
      // 分类
      api.system.getAllCategoryList({ isDisable: 0 }).then(res => {
        if (res.code == 200) {
          data.options = res.data;
        }
      });
    };

    // 获取显示权限
    const getType = info => {
      data.type = info.type;
      getProductOperator();
      getCategoryList();
      data.isAdd = info.isAdd;
      data.isEdit = info.isEdit; // 操作人是否禁选
      data.formInline.auditor = !buttonAuthor.isAdministrator ? data.localUser.real_name : "";
      if (info.isAdd) {
        data.isAdd = info.isAdd;
      } else {
        data.isAdd = false;
      }
      let msg = {
        code: data.dict[info.type - 1].name,
      };
      let code = data.dict[info.type - 1].name;
      data.stateOptions = localGet("dictCodeList")[code] ? localGet("dictCodeList")[code] : [];
    };

    const refData = toRefs(data);
    return {
      ...refData,
      buttonAuthor,
      onSubmit,
      reset,
      getTableData,
      formInlineRef,
      dateBlur,
      getProductOperator,
      categoryChange,
      getCategoryList,
      getType,
      showSearchBtn,
    };
  },
};
</script>
<style lang="scss" scoped>
#SearchPanel {
  .el-from {
    .el-form-item {
      margin-right: 0 !important;

      .el-input {
        width: 180px;
      }

      .el-select {
        width: 180px;
      }
    }
    .createTime {
      width: 50%;
      .el-form-item {
        width: 100%;
      }
    }

    .footer-btn {
      display: flex;
      justify-content: flex-end;
      .el-form-item {
        width: 20%;
      }
    }
  }
}
</style>
<style>
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
.el-form-item__label {
  font-size: 12px !important;
}
.el-form-item__content {
  font-size: 12px !important;
}
</style>
