<!-- 助理审核列表 -->
<template>
  <div id="AssistantAuditList">
    <div class="table-box">
      <div class="table-header">
        <el-button type="primary" size="mini" @click="batchOperation(5)" v-if="buttonAuthor.batchAbandoned"
          >批量作废</el-button
        >
        <el-button type="primary" size="mini" @click="batchOperation(13)" v-if="buttonAuthor.batchRejectedDevelop"
          >批量驳回（开发）</el-button
        >
        <el-button type="primary" size="mini" @click="batchOperation(14)" v-if="buttonAuthor.batchRejectedPurchase"
          >批量驳回（采购）</el-button
        >
        <el-button type="primary" size="mini" @click="downExportPro" v-if="buttonAuthor.export">选品导出</el-button>
      </div>
    </div>
    <LogDialog ref="logDialog"></LogDialog>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      :header-cell-style="{
        background: '#fafafa',
        color: '#2d2f30',
        fontWeight: 'bold',
        fontSize: '12px',
      }"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      height="calc(100vh - 310px)"
      class="development-process-operation-bar"
    >
      <el-table-column type="selection" min-width="40" align="center"></el-table-column>
      <el-table-column label="产品图片">
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
              :class="scope.row.isProAssistantTimeout == 1 ? 'color-red' : ''"
            >
              {{ scope.row.productCname ? scope.row.productCname : '-' }}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="产品分类" min-width="100" show-overflow-tooltip>
        <template #default="scope">
          <el-tooltip
            v-if="scope.row.productClassification"
            effect="dark"
            :content="scope.row.productClassification"
            placement="bottom"
          >
            <span
              v-if="scope.row.productClassification"
              class="mle1"
              :class="scope.row.productClassification == 1 ? 'color-red' : ''"
            >
              {{ scope.row.productClassification ? scope.row.productClassification : '-' }}
            </span>
          </el-tooltip>
          <span v-else :class="scope.row.isProAssistantTimeout == 1 ? 'color-red' : ''">-</span>
        </template>
      </el-table-column>
      <el-table-column label="产品来源" prop="source">
        <template #default="scope">
          <span :class="scope.row.isProAssistantTimeout == 1 ? 'color-red' : ''">
            {{ scope.row.source ? scope.row.source : '-' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="SPU" prop="proSpu" align="center">
        <template #default="scope">
          <span :class="scope.row.isProAssistantTimeout == 1 ? 'color-red' : ''">
            {{ scope.row.proSpu ? scope.row.proSpu : '-' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="选品毛利率" min-width="130px">
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
      <el-table-column label="供应商" show-overflow-tooltip>
        <template #default="scope">
          <span class="mle1" :class="scope.row.isProAssistantTimeout == 1 ? 'color-red' : ''">{{
            scope.row.supplier ? scope.row.supplier : '-'
          }}</span>
        </template>
      </el-table-column>

      <el-table-column label="采购价(CNY)">
        <template #default="scope">
          <span v-if="scope.row.purchasePrice" :class="scope.row.isProAssistantTimeout == 1 ? 'color-red' : ''">{{
            Number(scope.row.purchasePrice).toFixed(2)
          }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人">
        <template #default="scope">
          <span :class="scope.row.isProAssistantTimeout == 1 ? 'color-red' : ''">
            <div>录入：{{ scope.row.createUserName ? scope.row.createUserName : '-' }}</div>
            <div>开发：{{ scope.row.developmentHeadName ? scope.row.developmentHeadName : '-' }}</div>
            <div>采购：{{ scope.row.purchaseUserName ? scope.row.purchaseUserName : '-' }}</div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="50">
        <template #default="scope">
          <span
            v-if="scope.row.proThreeStatus"
            @click="openCom(scope.row)"
            :class="scope.row.isProAssistantTimeout == 1 ? 'color-red' : ''"
          >
            {{ tableTypeComputed(scope.row.proThreeStatus) }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" min-width="110">
        <template #default="scope">
          <span class="mle1" :class="scope.row.isProAssistantTimeout == 1 ? 'color-red' : ''">
            创建时间：{{ scope.row.submitAssistantTime ? scope.row.submitAssistantTime : '-' }}
          </span>
          <span class="mle1" :class="scope.row.isProAssistantTimeout == 1 ? 'color-red' : ''">
            审核时间：{{ scope.row.submitFinalReviewerTime ? scope.row.submitFinalReviewerTime : '-' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="80" align="center">
        <template #default="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-check"
            v-if="scope.row.proThreeStatus == 11 && buttonAuthor.audit"
            @click="handleEdit(scope.$index, scope.row)"
          >
            审核
          </el-button>
          <el-button
            icon="el-icon-date"
            size="mini"
            @click="assistantOpenLog(scope.row.id)"
            type="text"
            v-if="buttonAuthor.log"
            >日志</el-button
          >
          <span v-else>-</span>
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
  nextTick,
  onUnmounted,
} from 'vue'
import AssistantAudPopup from './AssistantAudPopup.vue'
import tablePage from '@/compositionApi/tablePage'
import authorButtons from '@/compositionApi/authorButtons'
import { localGet, localSet } from '@/utils/util'
import CommentPopup from '@/components/commentPopup/commentPopup.vue'
export default {
  name: 'AssistantAuditList',
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
      pro_input3_status: [],
      loading: true,
      searchMsg: '',
      timerOut: null,
      firstTile: '选品作废',
      minTitle: '确认所选选品信息作废？',
      logTitle: '确认操作',
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http
    const { downloadTemplate, dataService } = tablePage()
    onBeforeMount(() => {})
    onUnmounted(() => {
      // 页面销毁  关闭预览图片的计时器
      clearTimeout(data.timerOut)
    })
    onMounted(() => {
      dataService.value = 'develop'
    })

    // 审核
    const handleEdit = (index, row) => {
      data.logTitle = '确认操作'
      api.product.getDetails({ pid: row.id }).then((res) => {
        if (res.code == 200) {
          const info = {
            type: 4,
            row: res.data,
            title: '产品审核',
          }
          localSet(`goodsDetails${row.id}`, info)
          vue.$refs.AssistantAudPopup.getMsg(row)
        }
      })
    }

    // 查看商品详情
    const getDetails = (row) => {
      api.product.getDetails({ pid: row.id }).then((res) => {
        if (res.code == 200) {
          const info = {
            type: 4,
            row: res.data,
            title: '产品详情',
            isDetail: false,
          }
          localSet(`goodsDetails${row.id}`, info)
          vue.$refs.AssistantAudPopup.getMsg(row)
        }
      })
    }

    // 日志  assistantOpenLog
    const assistantOpenLog = (e) => {
      let msg = {
        servers: 'develop',
        dataApi: 'getAssistantLog',
        idList: [e],
      }
      nextTick(() => {
        vue.$refs.logDialog.checkLogDialog(msg)
      })
    }

    // 获取列表数据
    const getTableList = (searchMsg) => {
      data.searchMsg = searchMsg
      data.pro_input3_status = localGet('dictCodeList').pro_input3_status
        ? localGet('dictCodeList').pro_input3_status
        : []
    }

    // 列表选择
    const handleSelectionChange = (val) => {
      data.selectList = val
    }

    // 未通过/作废情况下点击状态
    const openCom = (row) => {
      data.logTitle = '意见详情'
      if (row.proThreeStatus !== 11) {
        if (row.proThreeStatus == 13 || row.proThreeStatus == 14 || row.proThreeStatus == 12) {
          const imgArr = []
          const arr = row.finalAuditOpinionPicture.split(',')
          if (row.finalAuditOpinionPicture !== '') {
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
            CommentsText: row.finalAuditOpinion,
            isDetail: true,
          }
          console.log(msg)
          vue.$refs.CommentPopup.getPicture(msg)
        }
        if (row.proThreeStatus == 5) {
          const imgArr = []
          const arr = row.invalidAuditOpinionPicture.split(',')
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
            CommentsText: row.invalidAuditOpinion,
            isDetail: true,
          }
          vue.$refs.CommentPopup.getPicture(msg)
        }
      }
    }

    const getTableData = inject('getTableData')
    // 批量操作
    const batchOperation = (status) => {
      data.logTitle = '确认操作'
      if (data.selectList.length < 1) {
        vue.$message.warning({
          message: '至少选择一条信息!',
          type: 'warning',
        })
      } else {
        if (status == 5) {
          data.firstTile = '选品作废'
          data.minTitle = '确认所选选品信息作废？'
          const msg = {
            path: 'develop',
            funName: 'updateAssistantStatus',
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
        if (status == 13) {
          data.firstTile = '选品驳回开发'
          data.minTitle = '确认所选选品驳回开发？'
          const msg = {
            path: 'develop',
            funName: 'updateAssistantStatus',
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
        if (status == 14) {
          data.firstTile = '选品驳回采购'
          data.minTitle = '确认所选选品驳回采购？'
          const msg = {
            path: 'develop',
            funName: 'updateAssistantStatus',
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

    // 删除
    const handleDelete = (index, row) => {
      console.log(index, row)
    }

    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (dizKey) {
        if (data.pro_input3_status.length > 1 && dizKey !== -1) {
          for (const item of data.pro_input3_status) {
            if (dizKey == item.dizKey) {
              return item.value
            }
          }
        }
      }
    })

    // 批量导出
    const downExportPro = () => {
      const info = data.searchMsg ? data.searchMsg : {}
      const ids = []
      for (const item of data.selectList) {
        ids.push(item.id)
      }
      info.proIds = ids
      downloadTemplate('assistantDown', '助理审核列表', info)
    }

    const refData = toRefs(data)
    return {
      ...refData,
      handleEdit,
      getDetails,
      handleDelete,
      handleSelectionChange,
      getTableList,
      batchOperation,
      tableTypeComputed,
      downExportPro,
      getTableData,
      buttonAuthor,
      openCom,
      assistantOpenLog,
    }
  },
}
</script>
<style lang="scss" scoped></style>
