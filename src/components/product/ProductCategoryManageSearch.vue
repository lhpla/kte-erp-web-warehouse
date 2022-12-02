<!--ProductCategoryManageSearch 产品品类管理搜索  -->
<template>
  <div id="SearchPanel">
    <el-form class="pageTitle" :inline="true" ref="form" @submit.prevent size="mini" label-width="120px">
      <div>
        <div class="form-content" :class="{ collapseClass: searchShow }">
          <el-form-item label="品类搜索：" class="SearchPanel-form-item">
            <div class="search">
              <el-select
                v-model="searchForm.searchType"
                @change="searchTypeChange"
                filterable
                placeholder="请选择"
                @clear="clear"
                class="size-width"
              >
                <el-option label="模糊搜索" :value="1"></el-option>
                <el-option label="(英)级联搜索" :value="2"></el-option>
                <el-option label="(中)级联搜索" :value="3"></el-option>
              </el-select>
              <el-cascader
                v-if="searchForm.searchType == 2"
                style="width: 100%"
                filterable
                clearable
                :options="cascaderOptions"
                v-model="selectedCascader"
                :props="cascaderRule"
                @change="changeCascader"
                placeholder="请选择英文品类"
                :disabled="!searchForm.searchType"
                :filter-method="filterMethod"
              ></el-cascader>
              <el-cascader
                v-if="searchForm.searchType == 3"
                style="width: 100%"
                filterable
                clearable
                :options="cascaderOptions"
                v-model="selectedCascader"
                :props="cascaderRule1"
                @change="changeCascader"
                placeholder="请选择中文品类"
                :disabled="!searchForm.searchType"
              ></el-cascader>
              <el-input
                v-if="searchForm.searchType == 1"
                placeholder="请输入品类"
                :disabled="!searchForm.searchType"
                v-model="searchForm.name"
                show-word-limit
                clearable
                @change="search"
              ></el-input>
            </div>
            <!-- <el-input size="mini" style="width: 100%" placeholder="请输入品类" clearable filterable v-model="searchForm.name"></el-input> -->
          </el-form-item>
          <el-form-item label="状态：" class="SearchPanel-form-item">
            <el-select v-model="searchForm.state" filterable placeholder="请选择" clearable @change="search">
              <el-option
                v-for="item in platform_category_state"
                :key="item.dizKey"
                :label="item.value"
                :value="item.dizKey"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用：" class="SearchPanel-form-item">
            <el-select v-model="searchForm.isDisable" filterable placeholder="请选择" clearable @change="search">
              <el-option label="启用" :value="0"></el-option>
              <el-option label="未启用" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开发负责人：" class="SearchPanel-form-item">
            <el-select
              v-model="searchForm.responsibleId"
              :loading="shopIdLoading"
              size="mini"
              class="margin-left"
              filterable
              clearable
              placeholder="请选择"
              @change="search"
            >
            <el-option label="无" value="无"></el-option>
              <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作人：" class="SearchPanel-form-item">
            <div class="flex">
              <el-select
                v-model="searchForm.operatorType"
                @change="operatorTypeChange"
                clearable
                filterable
                placeholder="请选择"
              >
                <el-option label="录入人" :value="1"></el-option>
                <el-option label="提交人" :value="2"></el-option>
                <el-option label="审核人" :value="3"></el-option>
              </el-select>
              <el-select
                v-model="searchForm.operatorId"
                @change="operatorIdChange"
                :loading="shopIdLoading"
                :disabled="!searchForm.operatorType"
                size="mini"
                class="margin-left"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
              </el-select>
            </div>
          </el-form-item>

          <el-form-item label="时间：" class="SearchPanel-form-item">
            <div class="flex">
              <el-select
                v-model="searchForm.timeType"
                @change="timeTypeChange"
                clearable
                filterable
                placeholder="请选择"
                class="size-width"
              >
                <el-option label="录入时间" :value="1"></el-option>
                <el-option label="更新时间" :value="2"></el-option>
                <el-option label="审核时间" :value="3"></el-option>
              </el-select>
              <el-date-picker
                v-model="searchForm.time"
                @change="dateBlur(searchForm.time)"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :disabled="!searchForm.timeType"
              ></el-date-picker>
            </div>
          </el-form-item>
        </div>
        <div class="footer-button">
          <el-form-item class="SearchPanel-form-item">
            <el-button type="text" size="mini" class="open" @click="searchShow = !searchShow" v-if="showSearchBtn">
              {{ searchShow ? '合并' : '展开' }}
              <i class="el-icon--right" :class="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </el-button>
            <!-- <el-button icon="el-icon-search" size="mini" type="primary" @click="search">搜索</el-button> -->
            <el-button type="primary" icon="el-icon-search" size="mini" @click="search"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" type="primary" @click="reset">重置</el-button>
          </el-form-item>
        </div>
      </div>
      <!-- <el-form-item class="search-operation">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from 'vue'
import authorButtons from '@/compositionApi/authorButtons'
import { localGet, parseTime } from '@/utils/util'
import { useShowSearchBtn } from '@/compositionApi/useShowSearchBtn'

export default {
  name: 'ProductCategoryManageSearch',
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons()
    const buttonAuthor = BUTTONS.value
    const { showSearchBtn } = useShowSearchBtn()
    const data = reactive({
      //搜索数据
      searchForm: {
        searchType: 1,
      },
      platform_category_state: [],
      searchShow: false,
      cascaderRule: { checkStrictly: true, label: 'englishName', value: 'id' },
      cascaderRule1: { checkStrictly: true, label: 'name', value: 'id' },
      userList: [],
      shopIdLoading: false,
      cascaderOptions: [],
      selectedCascader: [],
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http
    onBeforeMount(() => {})
    onMounted(() => {
      getMsg()
    })
    const refData = toRefs(data)
    const getTableData = inject('getTableData')

    // 级联搜索
    const filterMethod = (node, val) => {
      return node.data.englishName.toLowerCase().includes(val.toLowerCase())
    }

    const getMsg = () => {
      data.platform_category_state = localGet('dictCodeList').platform_category_state
        ? localGet('dictCodeList').platform_category_state
        : []
      // 开发负责人
      api.userOperation.getHeadOfDevelopment().then((res) => {
        if (res.code == 200) {
          data.userList = res.data
        } else {
          data.tableLoading = false
          vue.$message({
            type: 'warning',
            message: res.msg,
          })
        }
      })

      //获取系统品类列表
      api.product.categorySysFuzzyList().then((res) => {
        if (res.code == 200) {
          data.cascaderOptions = res.data
          data.selectedCascader = res.data.parentId
        }
      })
    }

    // 品类等级改变
    const changeCascader = (res) => {
      if (res) {
        let arr = JSON.stringify(res)
        arr = JSON.parse(arr)
        data.searchForm.id = arr.pop()
      } else {
        data.searchForm.id = ''
      }
      search()
    }

    //操作人 change
    const operatorTypeChange = (e) => {
      data.searchForm.operatorId = ''
    }

    //操作人id  change
    const operatorIdChange = (e) => {
      if (!data.searchForm.operatorType) {
        vue.$message.warning('请先选择操作人类型！')
        data.searchForm.operatorId = ''
      }
      search()
    }

    //时间类型change
    const timeTypeChange = (e) => {
      data.searchForm.time = ''
      data.searchForm.endTime = ''
      data.searchForm.startTime = ''
    }

    //搜索类型change
    const searchTypeChange = (e) => {
      data.selectedCascader = []
      data.searchForm.name = ''
      data.searchForm.id = ''
    }

    // 日期修改
    const dateBlur = (e) => {
      if (data.searchForm.timeType) {
        if (e) {
          console.log(e)
          data.searchForm.startTime = parseTime(e[0])
          data.searchForm.endTime = parseTime(e[1])
        } else {
          data.searchForm.endTime = null
          data.searchForm.startTime = null
        }
      } else {
        data.searchForm.time = ''
        data.searchForm.endTime = ''
        data.searchForm.startTime = ''
        vue.$message.warning('请先选择时间类型！')
      }
      search()
    }

    // 搜索
    const search = () => {
      if (!data.searchForm.endTime && !data.searchForm.startTime && data.searchForm.timeType) {
        vue.$message.warning('请选择时间段后进搜索！')
        data.searchForm.time = ''
      } else if (data.searchForm.operatorType && !data.searchForm.operatorId) {
        vue.$message.warning('请选择操作人后进搜索！')
      } else {
        if (
          !data.searchForm.id &&
          !data.searchForm.name &&
          !data.searchForm.state &&
          !data.searchForm.responsibleId &&
          !data.searchForm.operatorType &&
          !data.searchForm.timeType &&
          !data.searchForm.isDisable
        ) {
          if(data.searchForm.isDisable == 0){
          getTableData(data.searchForm, false)
          return
          }
          getTableData(data.searchForm, true)
        } else {
          getTableData(data.searchForm, false)
        }
      }
    }

    //重置
    const reset = () => {
      data.searchForm = {
        searchType: 1,
      }
      getTableData(data.searchForm, true)
    }

    const clear = () => {
      data.searchForm = {
        searchType: 1,
      }
    }
    return {
      ...refData,
      buttonAuthor,
      search,
      dateBlur,
      reset,
      operatorTypeChange,
      operatorIdChange,
      timeTypeChange,
      showSearchBtn,
      changeCascader,
      searchTypeChange,
      filterMethod,
      clear,
    }
  },
}
</script>
<style scoped lang="scss">
#SearchPanel {
  .topBtn {
    width: 95%;
    display: flex;
    justify-content: flex-end;
  }
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
  .searchBox {
    display: flex;
    justify-content: space-between;
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
  .search {
    display: flex;
  }
}
</style>
