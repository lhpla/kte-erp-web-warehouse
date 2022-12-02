<!-- 选品列表 搜索栏 -->
<template>
  <div id="SearchPanelDev">
    <el-form
      :inline="true"
      size="mini"
      ref="formInlineRef"
      label-width="80px"
      :model="formInline"
      class="demo-form-inline el-from"
    >
      <span>
        <el-form-item label="操作人">
          <el-select
            v-model="formInline.auditor"
            filterable
            :disabled="!buttonAuthor.isAdministrator"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in perSonnelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选品分类">
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
        <el-form-item label="选品名称">
          <el-tooltip
            effect="dark"
            :disabled="formInline.productCname == ''"
            :content="formInline.productCname"
            placement="bottom"
          >
            <el-input
              v-model="formInline.productCname"
              placeholder="输入选品名称"
              clearable
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <!-- 选品列表 -->
        <el-form-item :label="labelName">
          <el-select
            v-model="formInline.status"
            filterable
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in stateOptions"
              :key="item.dizKey"
              :label="item.value"
              :value="item.dizKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-collapse-transition>
          <div v-show="searchShow">
            <div class="flex">
              <el-form-item label="平 台">
                <el-select
                  v-model="formInline.platformId"
                  filterable
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in platformOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="SPU">
                <el-input
                  v-model="formInline.spu"
                  placeholder="输入spu"
                  clearable
                  :fetch-suggestions="querySearchAsync"
                  @select="handleSelect"
                ></el-input>
              </el-form-item>

              <span class="createTime">
                <el-form-item label="时 间">
                  <div class="flex">
                    <el-select
                      v-model="formInline.timeType"
                      @change="timeTypeChange"
                      style="width: 100px; margin-right: 5px"
                      clearable
                      filterable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in timeTypeList"
                        :key="item.key"
                        :label="item.value"
                        :value="item.key"
                      ></el-option>
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
              </span>
            </div>

            <!-- 二录新增异常状态条件筛选 -->
            <el-form-item label="异常状态" v-if="moduleType == 1">
              <el-select
                v-model="formInline.abnormalState"
                filterable
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in pro_purchase_exception"
                  :key="item.dizKey"
                  :label="item.value"
                  :value="item.dizKey"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="二次分配" v-if="moduleType == 1">
              <el-select
                v-model="formInline.isDevelopSecondDistribution"
                filterable
                placeholder="请选择"
                clearable
              >
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>

            <!-- 终审、助理审核新增运输方式 -->
            <el-form-item
              label="运输方式"
              v-if="moduleType == 2 || moduleType == 3"
            >
              <el-select
                v-model="formInline.transportType"
                filterable
                multiple
                placeholder="请选择"
                clearable
                @change="transportTypeChange"
              >
                <el-option
                  v-for="item in logistics_transport_mode"
                  :key="item.dizKey"
                  :label="item.value"
                  :value="item.dizKey"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 终审新增开发负责人 -->
            <el-form-item label="开发负责人" v-if="moduleType == 2">
              <el-select
                v-model="formInline.developmentDirector"
                filterable
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in DevelopmentList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- 终审新增采购负责人 -->
            <el-form-item label="采购负责人" v-if="moduleType == 2">
              <el-select
                v-model="formInline.procurementLeader"
                filterable
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in ProcurementList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-collapse-transition>
      </span>
      <div class="footer-btn">
        <el-form-item>
          <el-button
            type="text"
            size="mini"
            class="open"
            @click="searchShow = !searchShow"
          >
            {{ searchShow ? "合并" : "展开" }}
            <i
              class="el-icon--right"
              :class="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            ></i>
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="onSubmit"
            >查询</el-button
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

<script>
import {
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
  ref,
  inject,
  useContext,
  nextTick,
} from "vue";
import ProductDialog from "./ProductDialog";
import { parseTime, localGet } from "@/utils/util";
import authorButtons from "@/compositionApi/authorButtons";
export default {
  name: "SearchPanel",
  components: { ProductDialog },
  props: {
    moduleType: {
      type: String,
    },
  },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      searchShow: false,
      timeTypeList: [
        { key: "1", value: "创建时间" },
        { key: "2", value: "审核时间" },
      ],
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
      },
      options: [],
      logistics_transport_mode: [], //运输方式
      platformOptions: [],
      propsClass: {
        expandTrigger: "hover",
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      stateOptions: [
        {
          value: "1",
          label: "审核中",
        },
        {
          value: "2",
          label: "未通过",
        },
        {
          value: "3",
          label: "通过",
        },
        {
          value: "4",
          label: "草稿",
        },
        {
          value: "5",
          label: "作废",
        },
      ],

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
      type: 1,
      isAdd: false,
      isEdit: false,
      userInfo: "",
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
      labelName: "选品状态",
      perSonnelList: [],
      pro_purchase_exception: [],
      DevelopmentList: [],
      ProcurementList: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const formInlineRef = ref(null);
    onBeforeMount(() => {});
    onMounted(() => {
      data.localUser = localGet("userInfo");
      data.pro_purchase_exception = localGet("dictCodeList")
        .pro_purchase_exception
        ? localGet("dictCodeList").pro_purchase_exception
        : [];
      // 运输方式
      data.logistics_transport_mode = localGet("dictCodeList")
        .logistics_transport_mode
        ? localGet("dictCodeList").logistics_transport_mode
        : [];
      // 平台
      data.platformOptions = localGet("platformLiist");
      // 获取采购负责人list
      api.userOperation.getHeadOfPurchasing().then((res) => {
        if (res.code == 200) {
          data.ProcurementList = res.data;
        }
      });
      // 获取开发负责人
      api.userOperation.getHeadOfDevelopment().then((res) => {
        if (res.code == 200) {
          data.DevelopmentList = res.data;
        }
      });
    });
    const refData = toRefs(data);
    const getTableData = inject("getTableData");

    const querySearchAsync = (queryString, cb) => {
      var restaurants = vue.restaurants;
      var results = queryString
        ? restaurants.filter(vue.createStateFilter(queryString))
        : restaurants;

      clearTimeout(vue.timeout);
      vue.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    };

    const createFilter = (queryString) => {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    };

    const handleSelect = (item) => {
      console.log(item);
    };
    // 获取显示权限
    const getType = (info) => {
      data.type = info.type;
      getProductOperator();
      getCategoryList();
      data.isAdd = info.isAdd;
      data.isEdit = info.isEdit; // 操作人是否禁选
      data.formInline.auditor = !buttonAuthor.isAdministrator
        ? data.localUser.real_name
        : "";
      if (info.isAdd) {
        data.isAdd = info.isAdd;
      } else {
        data.isAdd = false;
      }
      let msg = {
        code: data.dict[info.type - 1].name,
      };
      let code = data.dict[info.type - 1].name;
      data.labelName = data.dict[info.type - 1].value;
      data.stateOptions = localGet("dictCodeList")[code]
        ? localGet("dictCodeList")[code]
        : [];
    };
    //运输方式change事件 transportTypeChange
    const transportTypeChange = (e) => {
      data.formInline.transportType = e;
    };
    // 分类切换
    const categoryChange = (e) => {
      data.formInline.productClassificationId = e ? e[e.length - 1] : "";
    };

    // 日期修改
    const dateBlur = (e) => {
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
    };

    // 时间类型切换
    const timeTypeChange = (e) => {
      data.formInline.time = null;
    };
    // 搜索
    const onSubmit = () => {
      let msg = {
        productCname: data.formInline.productCname
          ? data.formInline.productCname.trim()
          : "",
        startTime: data.formInline.startTime ? data.formInline.startTime : "",
        endTime: data.formInline.endTime ? data.formInline.endTime : "",
        productClassificationId: data.formInline.productClassificationId,
        status: data.formInline.status ? Number(data.formInline.status) : 0,
        developmentHeadId: data.formInline.developmentDirector,
        purchaseUserId: data.formInline.procurementLeader,
        exceptionState: data.formInline.abnormalState,
        isDevelopSecondDistribution:
          data.formInline.isDevelopSecondDistribution,
        platformId: data.formInline.platformId,
        spu: data.formInline.spu ? data.formInline.spu.trim() : "",
        transportType: data.formInline.transportType.join(","),
        timeType: data.formInline.timeType ? data.formInline.timeType : "",
        size: 10,
        scroll: 0,
        current: 1,
      };

      if (buttonAuthor.isAdministrator) {
        msg.createUser = data.formInline.auditor;
      }
      console.log(msg);
      getTableData(msg);
    };

    // 获取操作人列表
    const getProductOperator = () => {
      data.perSonnelList = [];
      if (data.type == 6) {
        api.develop.getPurchaseOperator().then((res) => {
          data.perSonnelList = res.data;
        });
      } else {
        api.develop.getProductOperator().then((res) => {
          data.perSonnelList = res.data;
        });
      }
    };

    const getCategoryList = () => {
      data.options = [];
      let msg = {
        isDisable: 0,
      };
      // 分类
      api.develop.getCategoryList(msg).then((res) => {
        if (res.code == 200) {
          data.options = res.data.data;
        }
      });
    };
    // 重置
    const reset = () => {
      formInlineRef.value.resetFields();
      data.formInline = {};
      getTableData();
    };

    return {
      ...refData,
      onSubmit,
      getType,
      getCategoryList,
      reset,
      formInlineRef,
      getProductOperator,
      buttonAuthor,
      categoryChange,
      transportTypeChange,
      dateBlur,
      timeTypeChange,
      querySearchAsync,
      handleSelect,
      createFilter,
    };
  },
};
</script>
<style lang="scss" scoped>
#SearchPanelDev {
  .el-from {
    .el-form-item {
      margin-right: 0 !important;
      width: 25%;

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
.el-form-item__label {
  font-size: 12px !important;
}
.el-form-item__content {
  font-size: 12px !important;
}
</style>
