<!-- 产品二录列表 -->
<template>
  <div id="SecondEntryList">
    <div class="table-box">
      <div class="table-header">
        <el-button type="primary" size="mini" v-if="buttonAuthor.reject" @click="secondReject('1')">批量驳回</el-button>
        <el-button type="primary" size="mini" v-if="buttonAuthor.batchApplication" @click="secondaryDistribution"
          >批量申请分配</el-button
        >
        <el-button type="primary" size="mini" @click="batchOperation(33)" v-if="buttonAuthor.batchSubmit"
          >批量提交</el-button
        >
        <el-button type="primary" size="mini" @click="batchOperation(5)" v-if="buttonAuthor.batchAbandoned"
          >批量作废</el-button
        >
        <el-button type="primary" size="mini" @click="downExportPro" v-if="buttonAuthor.export">产品导出</el-button>
        <!-- <el-button  size="mini" @click="downExportPro" v-if="buttonAuthor.export">产品导入</el-button> -->
        <!-- <el-button  size="mini" @click="openLog" v-if="buttonAuthor.log">日志</el-button> -->
        <LogDialog ref="logDialog"></LogDialog>
      </div>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
      border
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
              :class="scope.row.isProSecendTimeout == 1 ? 'color-red' : ''"
            >
              {{ scope.row.productCname ? scope.row.productCname : '-' }}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="产品分类" prop="productClassification" show-overflow-tooltip>
        <template #default="scope">
          <span class="mle1" :class="scope.row.isProSecendTimeout == 1 ? 'color-red' : ''">
            {{ scope.row.productClassification ? scope.row.productClassification : '-' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="SPU" prop="proSpu" align="center">
        <template #default="scope">
          <span :class="scope.row.isProSecendTimeout == 1 ? 'color-red' : ''">{{
            scope.row.proSpu ? scope.row.proSpu : '-'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="scope.row.supplier" :class="scope.row.isProSecendTimeout == 1 ? 'color-red' : ''">{{
            scope.row.supplier ? scope.row.supplier : '-'
          }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="商品属性">
        <template #default="scope">
          <span
            v-if="scope.row.purchaseDetailVOS.length > 1"
            :class="scope.row.isProSecendTimeout == 1 ? 'color-red' : ''"
            >组合商品</span
          >
          <span v-else :class="scope.row.isProSecendTimeout == 1 ? 'color-red' : ''">单个商品</span>
        </template>
      </el-table-column>
      <el-table-column label="采购价(CNY)">
        <template #default="scope">
          <span v-if="scope.row.purchasePrice" :class="scope.row.isProSecendTimeout == 1 ? 'color-red' : ''">
            {{ Number(scope.row.purchasePrice).toFixed(2) }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" min-width="95">
        <template #default="scope">
          <span :class="scope.row.isProSecendTimeout == 1 ? 'color-red' : ''">
            <div>录入：{{ scope.row.createUserName ? scope.row.createUserName : '-' }}</div>
            <div>开发：{{ scope.row.developmentHeadName ? scope.row.developmentHeadName : '-' }}</div>
            <div>采购：{{ scope.row.purchaseUserName ? scope.row.purchaseUserName : '-' }}</div>
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="提交时间" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="scope.row.returnTime" class="mle1" :class="scope.row.isProSecendTimeout == 1 ? 'color-red' : ''">{{ scope.row.returnTime }}</span>
          <span v-else :class="scope.row.isProSecendTimeout == 1 ? 'color-red' : ''">-</span>
        </template>
      </el-table-column> -->
      <el-table-column label="状态">
        <template #default="scope">
          <!-- <span>{{ tableTypeComputed(scope.row.proSecondStatus) }}</span> -->
          <!-- 状态为重新录入或者为作废时展示 相关信息 -->
          <!-- <el-tooltip
            v-if="scope.row.proSecondStatus == 5 || scope.row.proSecondStatus == 36"
            class="item"
            effect="dark"
            :content="scope.row.finalAuditOpinion"
            placement="bottom"
          >
            <span>{{ tableTypeComputed(scope.row.proSecondStatus) }}</span>finalAuditOpinion
          </el-tooltip> -->
          <span @click="openCom(scope.row, '1')" :class="scope.row.isProSecendTimeout == 1 ? 'color-red' : ''">
            {{ tableTypeComputed(scope.row.proSecondStatus) }}
          </span>
          <div v-if="scope.row.isCompleteAssigned == 1" @click="openSecondOpintionCom(scope.row)">
            <!-- 二次分配 -->
            <i class="el-icon-orange" :class="scope.row.isProSecendTimeout == 1 ? 'color-red' : 'secondIconClass'"></i>
          </div>
          <div
            @click="openCom(scope.row, '3')"
            :class="scope.row.isProSecendTimeout == 1 ? 'color-red' : ''"
            v-if="
              scope.row.isCompleteAssigned &&
              scope.row.isCompleteAssigned != 1 &&
              scope.row.isDevelopSecondDistribution &&
              scope.row.isDevelopSecondDistribution == 1
            "
          >
            二次分配
          </div>
          <!-- && scope.row.isDevelopSecondDistribution == 0 -->
          <div
            v-if="scope.row.isExceptionSubmit == '1'"
            :class="scope.row.isProSecendTimeout == 1 ? 'color-red' : ''"
            @click="openCom(scope.row, '2')"
          >
            <span v-if="scope.row.exceptionState == 1">无供应商</span>
            <span v-if="scope.row.exceptionState == 2">无量</span>
            <span v-if="scope.row.exceptionState == 3">无利</span>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="录入时间" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="scope.row.submitAssistantTime" class="mle1" :class="scope.row.isProSecendTimeout == 1 ? 'color-red' : ''">{{ scope.row.submitAssistantTime }}</span>
          <span v-else :class="scope.row.isProSecendTimeout == 1 ? 'color-red' : ''">-</span>
        </template>
      </el-table-column> -->
      <el-table-column label="时间" min-width="100">
        <template #default="scope">
          <div :class="scope.row.isProSecendTimeout == 1 ? 'color-red' : ''">
            创建时间：{{ scope.row.returnTime ? scope.row.returnTime : '-' }}
          </div>
          <div :class="scope.row.isProSecendTimeout == 1 ? 'color-red' : ''">
            提交时间：{{ scope.row.submitAssistantTime ? scope.row.submitAssistantTime : '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120" align="center">
        <template #default="scope">
          <span>
            <!-- v-if="
              (scope.row.proSecondStatus != 33 &&
                scope.row.proSecondStatus != 5 &&
                scope.row.exceptionState != 4 &&
                scope.row.proSecondStatus != 8 &&
                scope.row.isDevelopSecondDistribution != 1) ||
              scope.row.isCompleteAssigned == 1
            " -->
            <el-button
              size="mini"
              type="text"
              v-if="
                (scope.row.proSecondStatus == 31 || scope.row.proSecondStatus == 36) &&
                buttonAuthor.entry &&
                !(
                  scope.row.isCompleteAssigned &&
                  scope.row.isCompleteAssigned != 1 &&
                  scope.row.isDevelopSecondDistribution &&
                  scope.row.isDevelopSecondDistribution == 1
                )
              "
              @click="handleEdit(scope.$index, scope.row, 3)"
              icon="el-icon-folder-checked"
            >
              录入
            </el-button>
            <el-button
              size="mini"
              type="text"
              v-if="
                scope.row.proSecondStatus == 32 &&
                buttonAuthor.edit &&
                !(
                  scope.row.isCompleteAssigned &&
                  scope.row.isCompleteAssigned != 1 &&
                  scope.row.isDevelopSecondDistribution &&
                  scope.row.isDevelopSecondDistribution == 1
                )
              "
              @click="handleEdit(scope.$index, scope.row, 2)"
              icon="el-icon-edit"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              v-if="
                (scope.row.proSecondStatus == 31 ||
                  scope.row.proSecondStatus == 32 ||
                  scope.row.proSecondStatus == 36) &&
                buttonAuthor.submit &&
                !(
                  scope.row.isCompleteAssigned &&
                  scope.row.isCompleteAssigned != 1 &&
                  scope.row.isDevelopSecondDistribution &&
                  scope.row.isDevelopSecondDistribution == 1
                )
              "
              icon="el-icon-document-checked"
              @click="batchOperation(33, scope.row)"
            >
              提交
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-document-delete"
              v-if="
                buttonAuthor.abandoned &&
                scope.row.proSecondStatus != 35 &&
                scope.row.proSecondStatus != 5 &&
                !(
                  scope.row.isCompleteAssigned &&
                  scope.row.isCompleteAssigned != 1 &&
                  scope.row.isDevelopSecondDistribution &&
                  scope.row.isDevelopSecondDistribution == 1
                )
              "
              @click="stateEdit(5, scope.row)"
            >
              <!-- scope.row.proSecondStatus == 32 || scope.row.proSecondStatus == 31 || scope.row.proSecondStatus == 36) && buttonAuthor.abandoned -->
              作废
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-document-delete"
              v-if="
                (scope.row.proSecondStatus == 32 ||
                  scope.row.proSecondStatus == 31 ||
                  scope.row.proSecondStatus == 36) &&
                buttonAuthor.singleReject &&
                !(
                  scope.row.isCompleteAssigned &&
                  scope.row.isCompleteAssigned != 1 &&
                  scope.row.isDevelopSecondDistribution &&
                  scope.row.isDevelopSecondDistribution == 1
                )
              "
              @click="secondReject('2', scope.row)"
            >
              驳回
            </el-button>
            <el-button
              icon="el-icon-notebook-2"
              size="mini"
              @click="openLog(scope.row.id)"
              type="text"
              v-if="buttonAuthor.log"
              >日志</el-button
            >
          </span>
        </template>
      </el-table-column>
    </el-table>
    <ProductSecondPopup ref="ProductSecondPopup"></ProductSecondPopup>
    <CommentPopup :minTitle="minTitle" :firstTile="firstTile" :logTitle="logTitle" ref="CommentPopup"></CommentPopup>
    <!-- 此组件在采购初录，在此处进行映入 -->
    <Abnormal ref="Abnormal" :logTitle="logTitle"></Abnormal>
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
  provide,
  inject,
  nextTick,
  ref,
  onUnmounted,
} from 'vue'
import ProductSecondPopup from './ProductSecondPopup.vue'
import { ElMessage } from 'element-plus'
import tablePage from '@/compositionApi/tablePage'
import authorButtons from '@/compositionApi/authorButtons'
import { localGet, localSet } from '@/utils/util'
import CommentPopup from '@/components/commentPopup/commentPopup.vue'
import Abnormal from '@/components/purchase/Entry/Abnormal.vue'
export default {
  name: 'SecondEntryList',
  components: {
    ProductSecondPopup,
    CommentPopup,
    Abnormal,
  },
  props: ['tableLoading', 'tableData'],
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons()
    const buttonAuthor = BUTTONS.value
    const data = reactive({
      selectList: [],
      pro_second_status: [],
      timerOut: null,
      searchMsg: '',
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

    const getTableList = (searchMsg) => {
      data.searchMsg = searchMsg
      data.pro_second_status = localGet('dictCodeList').pro_second_status
        ? localGet('dictCodeList').pro_second_status
        : []
    }

    // 批量驳回/单个驳回
    const secondReject = (type, row) => {
      if (type == 1) {
        data.firstTile = '产品驳回'
        data.minTitle = '确认所选产品驳回？'
        data.logTitle = '确认操作'
        if (data.selectList.length != 0) {
          if (
            data.selectList.every((item) => {
              return item.proSecondStatus != 35
            })
          ) {
            const msg = {
              path: 'develop',
              funName: 'secondReject',
              param: {
                opinion: '',
                ids: [],
                opinionPicture: [],
              },
            }
            data.selectList.map((item) => {
              msg.param.ids.push(item.id)
            })
            vue.$refs.CommentPopup.openLog(msg)
          } else {
            vue.$message({
              type: 'warning',
              message: '不能驳回终审已通过的产品！',
            })
          }
        } else {
          vue.$message({
            type: 'warning',
            message: '请至少选择一条数据！',
          })
        }
      } else {
        data.firstTile = '产品驳回'
        data.minTitle = '当前所选产品驳回？'
        data.logTitle = '确认操作'
        if (row.proSecondStatus != 35) {
          const msg = {
            path: 'develop',
            funName: 'secondReject',
            param: {
              opinion: '',
              ids: [],
              opinionPicture: [],
            },
          }
          msg.param.ids.push(row.id)
          vue.$refs.CommentPopup.openLog(msg)
        } else {
          vue.$message({
            type: 'warning',
            message: '不能驳回终审已通过的产品！',
          })
        }
      }
    }

    // 批量申请分配
    const secondaryDistribution = () => {
      if (data.selectList.length != 0) {
        if (
          data.selectList.every((item) => {
            return (
              item.proSecondStatus != 34 &&
              item.proSecondStatus != 33 &&
              item.proSecondStatus != 35 &&
              item.proSecondStatus != 5 &&
              item.proSecondStatus != 8 &&
              item.secondaryDistribution != 1 &&
              item.isPurchaseSecondDistribution != 1 &&
              item.isDevelopSecondDistribution != 1
            )
          })
        ) {
          data.firstTile = '分配确认'
          data.minTitle = '确认所选产品信息进行二次分配申请？'
          data.logTitle = '确认操作'

          const msg = {
            path: 'develop',
            funName: 'secondaryDistribution',
            param: {
              opinion: '',
              ids: [],
              opinionPicture: [],
            },
          }
          data.selectList.map((item) => {
            msg.param.ids.push(item.id)
          })
          vue.$refs.CommentPopup.openLog(msg)
        } else {
          vue.$message({
            type: 'warning',
            message: '不能分配审核通过、审核中、作废状态、或者分配过的数据！',
          })
        }
      } else {
        vue.$message({
          type: 'warning',
          message: '请至少选择一条数据！',
        })
      }
    }

    const getTableData = inject('getTableData')
    // 編輯
    const handleEdit = (index, row, type) => {
      api.product.secondDetail({ id: row.id }).then((res) => {
        if (res.code == 200) {
          let title = '录入信息'
          if (type == 1) {
            title = '更新信息'
          } else if (type == 2) {
            title = '编辑信息'
          }
          const info = {
            type: 3,
            row: res.data,
            title: title,
          }
          localSet(`goodsDetails${row.id}`, info)
          vue.$refs.ProductSecondPopup.getMsg(row)
        }
      })
    }

    // 查看商品详情
    const getDetails = (row) => {
      api.product.secondDetail({ id: row.id }).then((res) => {
        if (res.code == 200) {
          const info = {
            type: 3,
            row: res.data,
            title: '产品详情',
            isDetail: false,
          }
          localSet(`goodsDetails${row.id}`, info)
          vue.$refs.ProductSecondPopup.getMsg(row)
        }
      })
    }

    // 单个修改状态
    const stateEdit = (index, row) => {
      if (index == 5) {
        data.firstTile = '产品作废'
        data.minTitle = '确认所选产品信息进行作废？'
        data.logTitle = '确认操作'
        const msg = {
          path: 'develop',
          funName: 'updateSecondStatus',
          param: {
            opinion: '',
            ids: [row.id],
            opinionPicture: [],
            status: 5,
          },
        }
        vue.$refs.CommentPopup.openLog(msg)
      } else {
        vue
          .$prompt('此操作将作废产品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: '',
            inputType: 'textarea',
          })
          .then(({ value }) => {
            const msg = {
              ids: Array(row.id),
              status: index,
              opinion: value,
            }
            api.develop.updateSecondStatus(msg).then((res) => {
              if (res.code == 200) {
                vue.$message({
                  type: 'success',
                  message: res.msg,
                })
                getTableData()
              } else {
                vue.$message({
                  type: 'warning',
                  message: res.msg,
                })
              }
            })
          })
          .catch(() => {
            vue.$message({
              type: 'info',
              message: '已取消修改',
            })
          })
      }
    }

    // 日志
    const openLog = (e) => {
      const msg = {
        servers: 'develop',
        dataApi: 'getProductLog',
        idList: [e],
      }
      nextTick(() => {
        vue.$refs.logDialog.checkLogDialog(msg)
      })
    }

    // 批量操作
    const batchOperation = (status, row) => {
      if (row) {
        data.selectList = [row]
      }
      if (data.selectList.length < 1) {
        ElMessage.warning({
          message: '至少选择一条信息!',
          type: 'warning',
        })
      } else {
        if (status == 5) {
          data.firstTile = '产品作废'
          data.minTitle = '确认所选产品信息进行作废？'
          data.logTitle = '确认操作'
          const msg = {
            path: 'develop',
            funName: 'updateSecondStatus',
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
        } else {
          vue
            .$confirm('此操作将提交选品, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            })
            .then(() => {
              const ids = []
              for (const item of data.selectList) {
                ids.push(item.id)
              }
              const msg = {
                ids: ids,
                status: status,
              }
              api.develop.updateSecondStatus(msg).then((res) => {
                if (res.code == 200) {
                  vue.$message({
                    type: 'success',
                    message: res.msg,
                  })
                  getTableData()
                } else {
                  vue.$message({
                    type: 'warning',
                    message: res.msg,
                  })
                }
              })
            })
            .catch(() => {
              vue.$message({
                type: 'info',
                message: '已取消修改',
              })
            })
        }
      }
    }

    // 列表选择
    const handleSelectionChange = (val) => {
      data.selectList = val
    }
    // 删除
    const handleDelete = (index, row) => {
      console.log(index, row)
    }
    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (dizKey) {
        if (data.pro_second_status.length > 1 && dizKey !== -1) {
          for (const item of data.pro_second_status) {
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
      downloadTemplate('secondDown', '产品二录列表', info)
    }

    //开发二录 二次分配意见点击 openSecondOpintionCom
    const openSecondOpintionCom = (row) => {
      const imgArr = []
      if (row.isDevelopSecondDistribution == 1) {
        const arr = row.developSecondDistributionPicture.split(',')
        if (row.developSecondDistributionPicture !== '') {
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
          CommentsText: row.developSecondDistributionOpinion,
          isDetail: true,
        }
        vue.$refs.CommentPopup.getPicture(msg)
      }
      if (row.isPurchaseSecondDistribution == 1) {
        const arr = row.purchaseSecondDistributionPicture.split(',')
        if (row.purchaseSecondDistributionPicture !== '') {
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
          CommentsText: row.purchaseSecondDistributionOpinion,
          isDetail: true,
        }
        vue.$refs.CommentPopup.getPicture(msg)
      }
    }

    // 未通过/作废情况下点击状态
    const openCom = (row, index) => {
      if (index == 1) {
        if (
          row.proSecondStatus !== 31 &&
          row.proSecondStatus !== 32 &&
          row.proSecondStatus !== 33 &&
          row.exceptionState == ''
        ) {
          data.logTitle = '意见详情'
          if (row.proSecondStatus == 5) {
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
        } else if (row.exceptionState && row.proSecondStatus !== 31 && row.proSecondStatus !== 33) {
          data.logTitle = '意见详情'
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
      }
      if (index == 2) {
        //采购异常信息展示
        data.logTitle = '意见详情'
        let imgArr = []
        let arr = row.exceptionPic.split(',')
        if (row.exceptionPic !== '') {
          arr.map((item) => {
            if (item && item != '') {
              let a = {
                url: '',
              }
              a.url = item
              imgArr.push(a)
            }
          })
        }
        let msg = {
          list: imgArr,
          CommentsText: row.exceptionExplain,
          isDetail: true,
          exceptionState: row.exceptionState,
        }
        vue.$refs.Abnormal.getMsg(msg)
      }
      if (index == 3) {
        data.logTitle = '意见详情'
        const imgArr = []
        const arr = row.developSecondDistributionPicture.split(',')
        if (row.developSecondDistributionPicture !== '') {
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
          CommentsText: row.developSecondDistributionOpinion,
          isDetail: true,
        }
        console.log(msg)
        vue.$refs.CommentPopup.getPicture(msg)
      }
    }

    const refData = toRefs(data)
    return {
      ...refData,
      handleEdit,
      handleDelete,
      handleSelectionChange,
      getTableList,
      stateEdit,
      batchOperation,
      tableTypeComputed,
      downExportPro,
      openLog,
      getTableData,
      downloadTemplate,
      buttonAuthor,
      getDetails,
      openCom,
      secondReject,
      secondaryDistribution,
      openSecondOpintionCom,
    }
  },
}
</script>
<style lang="scss" scoped>
.secondIconClass {
  font-size: 12px;
  color: #409eff;
}
</style>
