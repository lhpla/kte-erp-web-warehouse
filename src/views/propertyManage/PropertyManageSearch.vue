<!-- PropertyManageSearch  SPU属性管理搜素-->
<template>
  <div id="SearchPanel">
    <el-form :inline="true" ref="form" size="mini" :model="searchForm" label-width="90px">
      <div>
        <div class="form-content" :class="{ collapseClass: searchShow }">
          <!-- <el-form-item label="品类搜索:" class="SearchPanel-form-item">
            <el-cascader
              :options="marketPlatformName"
              :props="propsClass"
              v-model="searchForm.sysCategoryId"
              filterable
              clearable
            ></el-cascader>
          </el-form-item>-->
          <el-form-item label="系统品类：" class="SearchPanel-form-item">
            <el-select
              @change="changeFirstCategory"
              @clear="clearFirst"
              style="width: 120px"
              v-model="firstCategory"
              clearable
              filterable
              placeholder="一级品类"
            >
              <el-option
                v-for="item in firstCategoryList"
                :key="item.id"
                :value="item.id"
                :label="lang === 'chinese' ? item.name : item.englishName"
              ></el-option>
            </el-select>
            <el-select
              @change="changeSecondCategory"
              @clear="clearSecond"
              :disabled="!firstCategory"
              filterable
              clearable
              style="width: 120px; margin: 0 6px"
              v-model="secondCategory"
              placeholder="二级品类"
            >
              <el-option
                v-for="item in secondtCategoryList"
                :key="item.id"
                :value="item.id"
                :label="lang === 'chinese' ? item.name : item.englishName"
              ></el-option>
            </el-select>
            <el-select
              clearable
              filterable
              :disabled="!firstCategory || !secondCategory"
              style="width: 120px"
              v-model="threeCategory"
              placeholder="三级品类"
              @change="search"
            >
              <el-option
                v-for="item in threeCategoryList"
                :key="item.id"
                :value="item.id"
                :label="lang === 'chinese' ? item.name : item.englishName"
              ></el-option>
            </el-select>
            <el-button type="text" style="margin-left: 10px" @click="toggle">{{ langText }}</el-button>
          </el-form-item>

          <el-form-item label="中文关键词：" class="SearchPanel-form-item">
            <div style="display: flex">
              <el-select style="margin-right: 8px" v-model="chineseType">
                <el-option :value="1" label="模糊搜索"></el-option>
                <el-option :value="2" label="精准搜索"></el-option>
              </el-select>
              <el-input style="width: 150px" v-model="chineseKeyWord" clearable placeholder="请输入中文关键字" @change="search"></el-input>
            </div>
          </el-form-item>

          <el-form-item label="英文关键词：" class="SearchPanel-form-item">
            <div style="display: flex">
              <el-select style="margin-right: 8px" v-model="englishType">
                <el-option :value="1" label="模糊搜索"></el-option>
                <el-option :value="2" label="精准搜索"></el-option>
              </el-select>
              <el-input style="width: 150px" v-model="englishKeyWord" clearable placeholder="请输入英文关键字" @change="search"></el-input>
            </div>
          </el-form-item>

          <el-form-item label="负责人：" class="SearchPanel-form-item">
            <div class="flex">
              <el-select
                v-model="searchForm.responsibilityType"
                clearable
                filterable
                placeholder="请选择"
                class="size-width"
                @change="responsibilityTypeChange"
              >
                <el-option label="开发" :value="1"></el-option>
                <el-option label="采购" :value="2"></el-option>
                <el-option label="补货" :value="3"></el-option>
              </el-select>
              <el-select
                v-model="searchForm.responsibilityId"
                clearable
                filterable
                placeholder="请选择"
                style="flex: 1"
                :disabled="!searchForm.responsibilityType"
                @change="responsibilityIdChange"
                v-if="searchForm.responsibilityType == 1 || searchForm.responsibilityType == 3"
              >
                <el-option label="无" value="无"></el-option>
                <el-option v-for="item in operatorList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
              </el-select>
              <el-select
                v-model="searchForm.responsibilityId"
                :disabled="!searchForm.responsibilityType"
                @change="responsibilityIdChange"
                clearable
                filterable
                placeholder="请选择"
                style="flex: 1"
                v-else
              >
                <el-option label="无" value="无"></el-option>
                <el-option v-for="item in purchaseUserList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
              </el-select>
            </div>
          </el-form-item>

          <el-form-item label="状态：" class="SearchPanel-form-item">
            <el-select v-model="searchForm.state" filterable placeholder="请选择" clearable @change="search">
              <el-option label="通过" :value="1"></el-option>
              <el-option label="不通过" :value="2"></el-option>
              <el-option label="待审核" :value="3"></el-option>
            </el-select>
          </el-form-item>

            <el-form-item label="是否启用：" class="SearchPanel-form-item">
            <el-select v-model="searchForm.isDisable" filterable placeholder="请选择" clearable @change="search">
              <el-option label="启用" :value="0"></el-option>
              <el-option label="未启用" :value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="操作人：" class="SearchPanel-form-item">
            <div class="flex">
              <el-select
                v-model="searchForm.operatorType"
                clearable
                @change="operatorTypeChange"
                filterable
                placeholder="请选择"
                class="size-width"
              >
                <el-option label="录入人" :value="1"></el-option>
                <el-option label="提交人" :value="2"></el-option>
                <el-option label="审核人" :value="3"></el-option>
              </el-select>
              <el-select
                v-model="searchForm.operatorId"
                :disabled="!searchForm.operatorType"
                @change="operatorIdChange"
                clearable
                filterable
                placeholder="请选择"
                style="flex: 1"
              >
                <el-option v-for="item in operatorList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
              </el-select>
            </div>
          </el-form-item>

          <el-form-item label="时间：" class="SearchPanel-form-item">
            <div class="flex">
              <el-select
                v-model="searchForm.timeType"
                clearable
                filterable
                placeholder="请选择"
                class="size-width"
                @change="timeTypeChange"
              >
                <el-option label="录入时间" :value="1"></el-option>
                <el-option label="更新时间" :value="2"></el-option>
                <el-option label="审核时间" :value="3"></el-option>
              </el-select>
              <el-date-picker
                v-model="searchForm.updateTime"
                :disabled="!searchForm.timeType"
                @change="dateBlur(searchForm.updateTime)"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="SPU描述：" class="SearchPanel-form-item">
            <el-input v-model="searchForm.spuDescribe" filterable placeholder="请选择" clearable @change="search"></el-input>
          </el-form-item>
<!--          <el-form-item label="SPU编码:" class="SearchPanel-form-item">-->
<!--            <el-input v-model="searchForm.encode" filterable placeholder="请选择" clearable @change="search"></el-input>-->
<!--          </el-form-item>-->
          <el-form-item label="SPU编码: "  class="SearchPanel-form-item">
            <el-input v-model="searchForm.encode" placeholder="输入SPU，多个以逗号隔开" @clear="search"  maxlength="100"  @keyup.enter="search"
                      clearable      @dblclick="openInput(searchForm.encode)"
            >
            </el-input>
          </el-form-item>
        </div>

        <!-- 按钮部分 -->
        <div class="footer-button">
          <el-form-item class="SearchPanel-form-item">
            <el-button type="text" size="mini" class="open" @click="searchShow = !searchShow" v-if="showSearchBtn">
              {{ searchShow ? "合并" : "展开" }}
              <i class="el-icon--right" :class="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </el-button>
            <el-button icon="el-icon-search" size="mini" type="primary" @click="search">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" type="primary" @click="reset">重置</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject ,watch,nextTick} from "vue";
import { parseTime } from "@/utils/util";
import authorButtons from "@/compositionApi/authorButtons";
import { useShowSearchBtn } from "@/compositionApi/useShowSearchBtn";

export default {
  name: "PropertyManageSearch ",
  setup(prop, ctx) {
    const { showSearchBtn } = useShowSearchBtn();
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      // 一级品类
      firstCategory: "",
      // 一级品类列表
      firstCategoryList: [],
      // 二级品类
      secondCategory: "",
      // 二级品类列表
      secondtCategoryList: [],
      // 三级品类
      threeCategory: "",
      // 三级品类列表
      threeCategoryList: [],
      langText: "英",
      // 当前语言
      lang: "chinese",
      //搜索数据
      searchForm: {
        startTime: "",
        endTime: "",
        spuDescribe: "",
        encode: "",
      },
      // 中文关键字搜索类型
      chineseType: 1,
      // 中文关键字
      chineseKeyWord: "",
      // 英文关键字搜索类型
      englishType: 1,
      // 英文关键字
      englishKeyWord: "",
      //品类列表
      marketPlatformName: [],
      //开发部人员数据
      operatorList: [],
      //负责人列表
      principalList: [],
      //采购部人员数据
      purchaseUserList: [],
      showMessage:false,
      searchShow: false,
      propsClass: {
        expandTrigger: "hover",
        value: "id",
        label: "name",
        checkStrictly: true,
      },
    });
    let temp = ref('');
    const openInput = (info) => {
      temp.value = info;
      console.log(info)

      data.showMessage = true;
      vue
          .$prompt("可输入多个，以英文分号、逗号、空格或者回车隔开", "批量查询", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputValue: info,
            inputType: "textarea",
            inputValidator: (value) => {
              if (value && value?.length > 500) {
                return "输入字符不能大于500 ";
              }
            },
          })
          .then(({ value }) => {
            console.log(temp.value)
            data.searchForm.encode = temp.value
                .trim()
                .replaceAll("\n", ";")
                .replaceAll(" ", ";")
                .replaceAll(",", ";")
                .replaceAll("，", ";")
                .replaceAll("；", ";");
            data.searchForm.encode =data.searchForm.encode
                .split(";")
                .filter((item) => item !== "")
                .join(";");
            data.showMessage = false;
            temp.value = "";
            search()

          })
          .catch(() => {
            temp.value = "";
            data.showMessage = false;
          });
    };

    const handleInputREnter = (e) => {
      const index = e.srcElement.selectionStart;
      return index;
    };
    watch(
        () => data.showMessage,
        (val) => {
          if (val) {
            nextTick(() => {
              let textarea = document.getElementsByTagName("textarea")[0];
              textarea.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                  const index = handleInputREnter(e);
                  textarea.value = textarea.value.substring(0, index) + "\n" + textarea.value.substring(index);
                }
                temp.value = textarea.value;
              });
              textarea.addEventListener('input',()=>{
                temp.value = textarea.value;
              })
            });
          }
        }
    );
    // 品类搜索切换语言
    const toggle = () => {
      data.lang = data.lang === "chinese" ? "english" : "chinese";
      data.langText = data.langText === "英" ? "中" : "英";
    };
    // 一级品类选中
    const changeFirstCategory = (val) => {
      getCategoryByParentId(val, "secondtCategoryList");
    };
    // 二级品类选中
    const changeSecondCategory = (val) => {
      getCategoryByParentId(val, "threeCategoryList");
    };
    // 清除一级品类
    const clearFirst = () => {
      data.secondCategory = "";
      data.threeCategory = "";
    };
    // 清除二级品类
    const clearSecond = () => {
      data.threeCategory = "";
    };

    const getCategoryByParentId = (id, attr) => {
      api.product
        .getCatagoryByParentId({
          parentId: id,
        })
        .then((res) => {
          data[attr] = res.data;
          console.log(res.data);
        });
    };

    const getTableData = inject("getTableData");
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      getNewData();
      getCategoryByParentId(0, "firstCategoryList");
    });
    const refData = toRefs(data);
    //搜索
    const search = () => {
      let e = JSON.stringify(data.searchForm);
      e = JSON.parse(e);
      let sysCategoryId = "";
      // if (data.threeCategory) sysCategoryId = data.threeCategory
      if (data.firstCategory && !data.secondCategory && !data.threeCategory) {
        sysCategoryId = data.firstCategory;
      }
      if (data.firstCategory && data.secondCategory && !data.threeCategory) {
        sysCategoryId = data.secondCategory;
      }
      if (data.threeCategory) {
        sysCategoryId = data.threeCategory;
      }
      if(data.searchForm.encode){
        data.searchForm.encode=data.searchForm.encode.trim()
                .replaceAll("\n", ";")
                .replaceAll(" ", ";")
                .replaceAll(",", ";")
                .replaceAll("，", ";")
                .replaceAll("；", ";")
                .split(";")
                .filter((item) => item !== "")
                .join(";");
      }
      let msg = {
        // sysCategoryId: e.sysCategoryId != '' && Array.isArray(e.sysCategoryId) ? e.sysCategoryId.pop() : '',
        sysCategoryId,
        startTime: e.startTime,
        endTime: e.endTime,
        timeType: e.timeType,
        spuDescribe: e.spuDescribe,
        state: e.state,
        operatorId: e.operatorId,
        operatorType: e.operatorType,
        responsibilityType: e.responsibilityType,
        responsibilityId: e.responsibilityId,
        chineseKeyword: data.chineseKeyWord,
        englishKeyword: data.englishKeyWord,
        searchChineseType: data.chineseType,
        searchEnglishType: data.englishType,
        encode:data.searchForm.encode,
        isDisable: e.isDisable,
      };
      ctx.emit("update:searchForm", msg);
      if (!data.searchForm.endTime && !data.searchForm.startTime && data.searchForm.timeType) {
        vue.$message.warning("请选择时间段后进搜索！");
        data.searchForm.time = "";
      } else if (data.searchForm.operatorType && !data.searchForm.operatorId) {
        vue.$message.warning("请选择操作人后进搜索！");
      } else if (data.searchForm.responsibilityType && !data.searchForm.responsibilityId) {
        vue.$message.warning("请选择负责人后进搜索！");
      } else {
        getTableData(msg);
      }
    };

    // 日期修改
    const dateBlur = (e) => {
      if (data.searchForm.timeType) {
        if (e) {
          data.searchForm.startTime = parseTime(e[0]);
          data.searchForm.endTime = parseTime(e[1]);
          console.log(data.searchForm);
        } else {
          data.searchForm.startTime = "";
          data.searchForm.endTime = "";
        }
      } else {
        data.searchForm.updateTime = "";
        data.searchForm.startTime = "";
        data.searchForm.endTime = "";
        vue.$message.warning("请先选择时间类型！");
      }
      search();
    };

    //获取新数据源
    const getNewData = () => {
      //获取品类数据
      api.system.getAllCategoryList({ isDisable: 0 }).then((res) => {
        if (res.code == 200) {
          data.marketPlatformName = res.data;
        }
      });
      //获取开发负责人数据
      api.userOperation.getHeadOfDevelopment().then((res) => {
        if (res.code == 200) {
          data.operatorList = res.data;
        }
      });
      //获取采购部人员
      api.product.getPurchaseUserList().then((res) => {
        data.purchaseUserList = res.data;
      });
    };

    //负责人change事件
    const responsibilityTypeChange = (e) => {
      data.searchForm.responsibilityId = "";
    };

    //时间change
    const timeTypeChange = (e) => {
      data.searchForm.updateTime = "";
      data.searchForm.endTime = "";
      data.searchForm.startTime = "";
    };

    //操作人 change
    const operatorTypeChange = (e) => {
      data.searchForm.operatorId = "";
    };

    //操作人id  change
    const operatorIdChange = (e) => {
      if (!data.searchForm.operatorType) {
        vue.$message.warning("请先选择操作人类型！");
        data.searchForm.operatorId = "";
      }
      search();
    };
    //操作人id  change
    const responsibilityIdChange = (e) => {
      if (!data.searchForm.responsibilityType) {
        vue.$message.warning("请先选择负责人类型！");
        data.searchForm.responsibilityId = "";
      }
      search();
    };

    //重置
    const reset = () => {
      data.searchForm = {
        startTime: "",
        endTime: "",
        encode: "",
      };
      data.chineseKeyWord = "";
      data.englishKeyWord = "";
      data.chineseType = 1;
      data.englishType = 1;
      data.firstCategory = "";
      data.secondCategory = "";
      data.threeCategory = "";

      let e = JSON.stringify(data.searchForm);
      e = JSON.parse(e);
      let msg = {
        sysCategoryId: e.sysCategoryId != "" && Array.isArray(e.sysCategoryId) ? e.sysCategoryId.pop() : "",
        startTime: e.startTime,
        endTime: e.endTime,
        timeType: e.timeType,
        encode: e.encode,
        state: e.state,
        operatorId: e.operatorId,
        operatorType: e.operatorType,
        responsibilityType: e.responsibilityType,
        responsibilityId: e.responsibilityId,
      };
      getTableData(msg);
    };
   const changeProStatus = (status)=>{

   }
    return {
      ...refData,
      changeProStatus,
      search,
      getTableData,
      getNewData,
      dateBlur,
      responsibilityTypeChange,
      timeTypeChange,
      reset,
      operatorTypeChange,
      operatorIdChange,
      responsibilityIdChange,
      showSearchBtn,
      buttonAuthor,
      toggle,
      changeFirstCategory,
      changeSecondCategory,
      clearFirst,
      clearSecond,
      openInput
    };
  },
};
</script>
<style scoped lang="scss">
#SearchPanel {
  .size-width {
    width: 35%;
    margin-right: 10px;
  }
  .form-content {
    height: 30px;
    overflow: hidden;
    transition: all 0.5s !important;
    flex: 0.95;
  }
  .collapseClass {
    height: auto;
    overflow: auto;
    transition: all 1s;
  }
  .footer-button {
    display: flex;
    justify-content: flex-end;
    min-width: 250px;
    flex: 0.05;
  }
  .searchBox {
    display: flex;
    justify-content: space-between;
  }
}
</style>
