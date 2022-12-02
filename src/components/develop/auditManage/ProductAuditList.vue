<!-- 产品终审列表 -->
<template>
  <div id="ProductAuditList">
    <div class="table-box">
      <div class="table-header">
        <el-button type="primary" size="mini" @click="batchOperation(5)" v-if="buttonAuthor.batchAbandoned"
          >批量作废</el-button
        >
        <el-button type="primary" size="mini" @click="batchOperation(8)" v-if="buttonAuthor.batchRejectedDevelop"
          >批量驳回（开发）</el-button
        >
        <el-button type="primary" size="mini" @click="batchOperation(9)" v-if="buttonAuthor.batchRejectedPurchase"
          >批量驳回（采购）</el-button
        >
        <el-dropdown v-if="buttonAuthor.export" style="margin: 0 10px 0 10px">
          <el-button type="primary" size="mini">
            终审导出
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="downExportPro" v-if="buttonAuthor.export">选品导出</el-dropdown-item>
              <el-dropdown-item @click="downExportPricing" v-if="buttonAuthor.productPricingExport"
                >产品计价信息导出</el-dropdown-item
              >
              <el-dropdown-item v-else>暂无操作</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <LogDialog ref="logDialog"></LogDialog>
    <el-table
      :data="tableData"
      v-loading="tableLoading"
      border
      :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      height="calc(100vh - 310px)"
      class="development-process-operation-bar"
    >
      <el-table-column type="selection" min-width="40" align="center"></el-table-column>
      <el-table-column label="产品图片" align="center">
        <template #default="scope">
          <el-popover placement="right" trigger="hover" width="250" v-if="scope.row.pricturePath">
            <template #reference>
              <img
                style="width: 70px; height: 70px; object-fit: contain"
                loading="lazy"
                :src="scope.row.pricturePath"
              />
            </template>
            <img
              :src="scope.row.pricturePath"
              loading="lazy"
              style="width: 400px; height: 300px; object-fit: contain"
            />
          </el-popover>
          <div v-else>暂无图片</div>
        </template>
      </el-table-column>
      <el-table-column label="产品中文名称">
        <template #default="scope">
          <el-tooltip effect="dark" :content="scope.row.productCname" placement="bottom">
            <span
              @click="getDetails(scope.row)"
              class="nameHover mle1"
              :class="scope.row.isProFianlTimeout == 1 ? 'color-red' : ''"
            >
              {{ scope.row.productCname ? scope.row.productCname : '-' }}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="产品分类" show-overflow-tooltip>
        <template #default="scope">
          <span class="mle1" :class="scope.row.isProFianlTimeout == 1 ? 'color-red' : ''">
            {{ scope.row.productClassification ? scope.row.productClassification : '-' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="选品来源" prop="source">
        <template #default="scope">
          <span :class="scope.row.isProFianlTimeout == 1 ? 'color-red' : ''">{{
            scope.row.source ? scope.row.source : '-'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SPU" prop="proSpu" align="center">
        <template #default="scope">
          <span :class="scope.row.isProFianlTimeout == 1 ? 'color-red' : ''">{{
            scope.row.proSpu ? scope.row.proSpu : '-'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SPU中文关键字" prop="spuChineseKeyword" align="center"> </el-table-column>
      <el-table-column label="选品毛利率" min-width="140px">
        <template #default="scope">
          <span v-if="scope.row.grossMargins.length > 0">
            <div
              v-for="(item, index) of scope.row.grossMargins"
              :key="index"
              :class="scope.row.isProAssistantTimeout == 1 ? 'color-red' : ''"
            >
              {{ item }}
            </div>
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" prop="supplier" show-overflow-tooltip>
        <template #default="scope">
          <span class="mle1" :class="scope.row.isProFianlTimeout == 1 ? 'color-red' : ''">{{
            scope.row.supplier ? scope.row.supplier : '-'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购价(CNY)" prop="purchasePrice">
        <template #default="scope">
          <span v-if="scope.row.purchasePrice" :class="scope.row.isProFianlTimeout == 1 ? 'color-red' : ''">{{
            Number(scope.row.purchasePrice).toFixed(2)
          }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" min-width="95px">
        <template #default="scope">
          <span :class="scope.row.isProFianlTimeout == 1 ? 'color-red' : ''">
            <div>录入：{{ scope.row.createUserName ? scope.row.createUserName : '-' }}</div>
            <div>开发负责人:{{ scope.row.developmentHeadName ? scope.row.developmentHeadName : '-' }}</div>
            <div>采购负责人:{{ scope.row.purchaseUserName ? scope.row.purchaseUserName : '-' }}</div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="产品状态">
        <template #default="scope">
          <span @click="openCom(scope.row)" :class="scope.row.isProFianlTimeout == 1 ? 'color-red' : ''">
            {{ tableTypeComputed(scope.row.proFinalStatus) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="时间" min-width="110px">
        <template #default="scope">
          <div :class="scope.row.isProFianlTimeout == 1 ? 'color-red' : ''">
            创建时间：{{ scope.row.submitFinalReviewerTime ? scope.row.submitFinalReviewerTime : '-' }}
          </div>
          <div :class="scope.row.isProFianlTimeout == 1 ? 'color-red' : ''">
            审核时间：{{ scope.row.finalReviewerTime ? scope.row.finalReviewerTime : '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" align="center">
        <template #default="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-check"
            v-if="scope.row.proFinalStatus == 6 && buttonAuthor.audit"
            @click="handleAudit(scope.$index, scope.row)"
          >
            审核
          </el-button>
          <el-button
            icon="el-icon-date"
            size="mini"
            @click="assistantOpenLog(scope.row.id)"
            v-if="buttonAuthor.log"
            type="text"
            >日志</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <AssistantAudPopup ref="AssistantAudPopup"></AssistantAudPopup>
    <CommentPopup :minTitle="minTitle" :firstTile="firstTile" :logTitle="logTitle" ref="CommentPopup"></CommentPopup>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  computed,
  getCurrentInstance,
  inject,
  onUnmounted,
  nextTick,
} from 'vue'
import AssistantAudPopup from './AssistantAudPopup.vue'
import tablePage from '../../../compositionApi/tablePage'
import { ElMessage } from 'element-plus'
import authorButtons from '../../../compositionApi/authorButtons'
import { localGet, localSet } from '../../../utils/util'
import CommentPopup from '../../../components/commentPopup/commentPopup.vue'

export default {
  name: 'ProductAuditList',
  components: {
    AssistantAudPopup,
    CommentPopup,
  },
  props: ['tableLoading', 'tableData'],
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons()
    const buttonAuthor = BUTTONS.value
    const data = reactive({
      selectList: [],
      pro_review_status: [],
      searchMsg: '',
      firstTile: '产品作废',
      minTitle: '确认所选产品信息作废？',
      logTitle: '确认操作',
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const { downloadTemplate, dataService } = tablePage()
    const api = vue.$http
    onBeforeMount(() => {})
    onUnmounted(() => {
      // 页面销毁  关闭预览图片的计时器
      clearTimeout(data.timerOut)
    })
    onMounted(() => {
      dataService.value = 'develop'
    })

    // 点击审核
    const handleAudit = (index, row, type) => {
      api.product.getDetailsProductReview({ pid: row.id }).then((res) => {
        if (res.code == 200) {
          const info = {
            type: 7,
            row: res.data,
            title: type == 1 ? '更新信息' : '产品信息',
          }
          localSet(`goodsDetails${row.id}`, info)
          vue.$refs.AssistantAudPopup.getMsg(row)
        }
      })
    }
    const getTableData = inject('getTableData')
    // 获取列表
    const getTableList = (searchMsg) => {
      data.searchMsg = searchMsg
      data.pro_review_status = localGet('dictCodeList').pro_review_status
        ? localGet('dictCodeList').pro_review_status
        : []
    }

    // 查看商品详情
    const getDetails = (row) => {
      api.product.getDetailsProductReview({ pid: row.id }).then((res) => {
        if (res.code == 200) {
          const info = {
            type: 7,
            row: res.data,
            title: '产品详情',
            isDetail: false,
          }
          localSet(`goodsDetails${row.id}`, info)
          vue.$refs.AssistantAudPopup.getMsg(row)
        }
      })
    }

    // 批量操作
    const batchOperation = (status) => {
      if (data.selectList.length < 1) {
        ElMessage.warning({
          message: '至少选择一条信息!',
          type: 'warning',
        })
      } else {
        if (status == 5) {
          data.firstTile = '产品作废'
          data.minTitle = '确认所选产品信息作废？'
          data.logTitle = '确认操作'
          const msg = {
            path: 'develop',
            funName: 'auditOpinion',
            param: {
              opinion: '',
              ids: [],
              opinionPicture: [],
              status: status,
            },
          }
          data.selectList.map((item) => {
            msg.param.ids.push(item.id)
          })
          vue.$refs.CommentPopup.openLog(msg)
        }
        if (status == 8) {
          data.logTitle = '确认操作'
          data.firstTile = '产品驳回开发'
          data.minTitle = '确认所选产品驳回开发？'
          const msg = {
            path: 'develop',
            funName: 'auditOpinion',
            param: {
              opinion: '',
              ids: [],
              opinionPicture: [],
              status: status,
            },
          }
          data.selectList.map((item) => {
            msg.param.ids.push(item.id)
          })
          vue.$refs.CommentPopup.openLog(msg)
        }
        if (status == 9) {
          data.logTitle = '确认操作'
          data.firstTile = '产品驳回采购'
          data.minTitle = '确认所选产品驳回采购？'
          const msg = {
            path: 'develop',
            funName: 'auditOpinion',
            param: {
              opinion: '',
              ids: [],
              opinionPicture: [],
              status: status,
            },
          }
          data.selectList.map((item) => {
            msg.param.ids.push(item.id)
          })
          vue.$refs.CommentPopup.openLog(msg)
        }
      }
    }

    // 列表选择
    const handleSelectionChange = (val) => {
      console.log(val)
      data.selectList = val
    }

    // 批量导出
    const downExportPro = () => {
      const info = data.searchMsg ? data.searchMsg : {}
      const ids = []
      for (const item of data.selectList) {
        ids.push(item.id)
      }
      info.proIds = ids
      downloadTemplate('exportEndAudit', '产品终审列表', info)
    }

    //导出计价信息
    const downExportPricing = () => {
      const info = data.searchMsg ? data.searchMsg : {}
      const ids = []
      for (const item of data.selectList) {
        ids.push(item.id)
      }
      info.proIds = ids
      downloadTemplate('exportValuation', '产品计价信息导出', info)
    }
    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (dizKey) {
        if (data.pro_review_status.length > 1 && dizKey !== -1) {
          for (const item of data.pro_review_status) {
            if (dizKey == item.dizKey) {
              return item.value
            }
          }
        }
      }
    })

    // 未通过/作废情况下点击状态
    const openCom = (row) => {
      console.log(row)
      data.logTitle = '意见详情'
      if (row.proFinalStatus != 6) {
        if (row.proFinalStatus == 5) {
          const imgArr = []
          const arr = row.invalidAuditOpinionPicture.split(',')
          if (row.invalidAuditOpinionPicture !== '') {
            arr.map((item) => {
              if (item && item != '') {
                const a = {
                  url: '',
                }
                a.url = item
                imgArr.push(a)
              }
            })
          }
          const msg = {
            list: imgArr,
            CommentsText: row.invalidAuditOpinion,
            isDetail: true,
          }
          console.log(msg)
          vue.$refs.CommentPopup.getPicture(msg)
        } else {
          const imgArr = []
          const arr = row.finalAuditOpinionPicture.split(',')
          arr.map((item) => {
            if (item && item != '') {
              const a = {
                url: '',
              }
              a.url = item
              imgArr.push(a)
            }
          })
          const msg = {
            list: imgArr,
            CommentsText: row.finalAuditOpinion,
            isDetail: true,
          }
          console.log(msg)
          vue.$refs.CommentPopup.getPicture(msg)
        }
      }
    }

    // 日志
    const assistantOpenLog = (e) => {
      const msg = {
        servers: 'develop',
        dataApi: 'getReviewLog',
        idList: [e],
      }
      nextTick(() => {
        vue.$refs.logDialog.checkLogDialog(msg)
      })
    }

    const refData = toRefs(data)
    return {
      ...refData,
      handleAudit,
      handleSelectionChange,
      getTableList,
      batchOperation,
      tableTypeComputed,
      downExportPro,
      downloadTemplate,
      getTableData,
      buttonAuthor,
      getDetails,
      openCom,
      assistantOpenLog,
      downExportPricing,
    }
  },
}
</script>
<style lang="scss" scoped></style>
