<!--PlatformCategorySearch  平台类目管理搜素-->
<template>
  <div id="SearchPanel">
    <el-form
      :inline="true"
      ref="form"
      size="mini"
      :model="searchForm"
      label-width="110px"
      class="demo-form-inline el-from"
    >
      <div>
        <div class="form-content" :class="{ collapseClass: searchShow }">
          <el-form-item label="类目搜索：" class="SearchPanel-form-item">
            <el-input
              class="textarea"
              clearable
              v-model="searchForm.chineseCategory"
              clear
              placeholder="请输入"
              @change="search"
            ></el-input>
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
                :loading="shopIdLoading"
                size="mini"
                :disabled="!searchForm.operatorType"
                @change="operatorIdChange"
                class="margin-left"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="类目状态：" class="SearchPanel-form-item">
            <el-select v-model="searchForm.state" filterable placeholder="请选择" clearable  @change="search">
              <el-option
                v-for="item in platform_category_state"
                :key="item.dizKey"
                :label="item.value"
                :value="item.dizKey"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="平台站点：" class="SearchPanel-form-item">
            <el-select
              v-model="searchForm.platformId"
              size="mini"
              @change="platChange"
              filterable
              clearable
              placeholder="请选择"
            >
              <el-option v-for="item in platformOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select
              v-model="searchForm.siteId"
              :loading="shopIdLoading"
              size="mini"
              class="margin-left"
              filterable
              clearable
              placeholder="请选择"
               @change="search"
            >
              <el-option
                v-for="item in siteList"
                :key="item.id"
                :label="item.siteChineseAndEnglishName"
                :value="item.id"
              ></el-option>
            </el-select>
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
                :disabled="!searchForm.timeType"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </div>
          </el-form-item>
        </div>
        <!-- 按钮部分 -->
        <div class="footer-button">
          <el-form-item class="SearchPanel-form-item">
            <el-button type="text" size="mini" class="open" @click="searchShow = !searchShow" v-if="showSearchBtn">
              {{ searchShow ? '合并' : '展开' }}
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
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from 'vue'
import { localGet, parseTime } from '@/utils/util'
import authorButtons from '@/compositionApi/authorButtons'
import { useShowSearchBtn } from '@/compositionApi/useShowSearchBtn'

export default {
  name: 'PlatformCategorySearch',
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons()
    const buttonAuthor = BUTTONS.value
    const { showSearchBtn } = useShowSearchBtn()
    const data = reactive({
      //搜索数据
      searchForm: {},
      marketPlatformName: [],
      searchShow: false,
      shopIdLoading: false, //loading
      platform_category_state: [],
      siteList: [], //站点列表
      platformOptions: [],
      userList: [],
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http
    onBeforeMount(() => {})
    onMounted(() => {
      getMsg()
    })
    const refData = toRefs(data)
    const getTableData = inject('getTableData')

    const getMsg = () => {
      data.platform_category_state = localGet('dictCodeList').platform_category_state
        ? localGet('dictCodeList').platform_category_state
        : []
      api.product
        .getAllPlatform()
        .then((res) => {
          if (res.code == 200) {
            data.platformOptions = res.data
          } else {
            data.platformOptions = []
          }
          data.shopIdLoading = false
        })
        .catch((e) => {
          data.shopIdLoading = false
          data.platformOptions = []
        })

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
    }

    // 日期修改
    const dateBlur = (e) => {
      if (data.searchForm.timeType) {
        if (e) {
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

    //根据平台搜索店铺
    const platChange = (e) => {
      if (e) {
        data.shopIdLoading = true
        api.product
          .getSiteByPlatformId({ platformId: e })
          .then((res) => {
            if (res.code == 200) {
              data.siteList = res.data
            } else {
              data.siteList = []
            }
            data.shopIdLoading = false
          })
          .catch((e) => {
            data.shopIdLoading = false
            data.siteList = []
          })
      } else {
        data.siteList = []
        data.searchForm.siteId = ''
      }
    }

    //搜素
    const search = () => {
      if (!data.searchForm.endTime && !data.searchForm.startTime && data.searchForm.timeType) {
        vue.$message.warning('请选择时间段后进搜索！')
        data.searchForm.time = ''
      } else if (data.searchForm.operatorType && !data.searchForm.operatorId) {
        vue.$message.warning('请选择操作人后进搜索！')
      } else {
        console.log(data.searchForm)
        if (
          !data.searchForm.name &&
          !data.searchForm.state &&
          !data.searchForm.responsibleId &&
          !data.searchForm.operatorType &&
          !data.searchForm.timeType
        ) {
          getTableData(data.searchForm, true)
        } else {
          getTableData(data.searchForm, false)
        }
      }
    }

    //重置
    const reset = () => {
      data.searchForm = {}
      getTableData(data.searchForm, true)
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
    return {
      ...refData,
      search,
      platChange,
      getMsg,
      dateBlur,
      reset,
      operatorTypeChange,
      operatorIdChange,
      timeTypeChange,
      buttonAuthor,
      showSearchBtn,
    }
  },
}
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
