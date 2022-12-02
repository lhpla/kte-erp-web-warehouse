<!-- 采购产品信息初录列表 -->
<template>
  <div id="ProductEntryList">
    <div class="table-box">
      <div class="table-header">
        <el-button type="primary" size="mini" v-if="buttonAuthor.batchApplication" @click="secondaryDistribution"
          >批量申请分配</el-button
        >
        <el-button type="primary" size="mini" @click="batchOperation(18)" v-if="buttonAuthor.batchSubmit"
          >批量提交</el-button
        >
        <el-button type="primary" size="mini" @click="AbnormalAll" v-if="buttonAuthor.batchUnusualSubmit"
          >批量异常提交</el-button
        >
        <!-- <el-button type="primary"  size="mini" v-if="buttonAuthor.export">产品导出</el-button> -->
        <el-dropdown style="margin: 0 10px 0 10px" v-if="buttonAuthor.export">
          <el-button type="primary" size="mini">
            导出产品
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="downExportPro('0')" v-if="buttonAuthor.basicInformationExport"
                >导出基本产品信息</el-dropdown-item
              >
              <el-dropdown-item @click="downExportPro('1')" v-if="buttonAuthor.exportInfoImages"
                >导出包含图片的产品信息</el-dropdown-item
              >
              <el-dropdown-item v-else>暂无操作</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-button type="primary" size="mini" @click="uploadTrigger" v-if="buttonAuthor.import">产品导入</el-button>
        <!-- <el-button  type="primary" size="mini" @click="openLog" v-if="buttonAuthor.log">日志</el-button> -->
        <LogDialog ref="logDialog"></LogDialog>
        <input
          type="file"
          accept=".xlsx"
          ref="uploadExcelFrom"
          @change="uploadChange"
          clearable
          style="display: none"
        />
      </div>
    </div>

    <el-table
      :data="tableData"
      v-loading="tableLoading"
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
              :class="scope.row.isPurchaseTimeout == 1 ? 'color-red' : ''"
              @click="getDetails(scope.row.id)"
              class="nameHover mle1"
            >
              {{ scope.row.productCname ? scope.row.productCname : '-' }}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="产品分类">
        <template #default="scope">
          <span :class="scope.row.isPurchaseTimeout == 1 ? 'color-red' : ''" class="mle1">
            {{ scope.row.productClassification ? scope.row.productClassification : '-' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="SPU" prop="proSpu" align="center">
        <template #default="scope">
          <span :class="scope.row.isPurchaseTimeout == 1 ? 'color-red' : ''">{{
            scope.row.proSpu ? scope.row.proSpu : '-'
          }}</span>
        </template>
      </el-table-column>
      <!-- 留着别删了 -->
      <!-- <el-table-column label="提交时间" prop="submissionTime"   show-overflow-tooltip></el-table-column> -->
      <!-- <el-table-column label="提交时间" prop="auditTime" show-overflow-tooltip></el-table-column> -->
      <!-- <el-table-column label="询价时间" prop="auditTime" show-overflow-tooltip>
        <template #default="scope">
          <span :class="scope.row.isPurchaseTimeout == 1 ? 'color-red' : ''">
            <span>{{ scope.row.auditTime }}</span>
          </span>
        </template>
      </el-table-column> -->
      <el-table-column label="录入状态">
        <template #default="scope">
          <!-- <el-tooltip effect="dark" :disabled="scope.row.finalAuditOpinion == ''" :content="scope.row.finalAuditOpinion" placement="bottom"> -->
          <span :class="scope.row.isPurchaseTimeout == 1 ? 'color-red' : ''">
            <span @click="openCom(scope.row, '1')">
              {{ tableTypeComputed(pro_purchase_status, scope.row.proFirstPurchase) }}
            </span>
            <div
              v-if="scope.row.isExceptionSubmit && scope.row.isExceptionSubmit == 1"
              @click="openCom(scope.row, '2')"
            >
              {{ tableTypeComputed(pro_purchase_exception, scope.row.exceptionState) }}
            </div>
            <div
              @click="openCom(scope.row, '3')"
              v-if="
                scope.row.isCompleteAssigned &&
                scope.row.isCompleteAssigned != 1 &&
                scope.row.isPurchaseSecondDistribution &&
                scope.row.isPurchaseSecondDistribution == 1
              "
            >
              二次分配
            </div>
            <div
              @click="openCom(scope.row, '3')"
              v-if="scope.row.isCompleteAssigned && scope.row.isCompleteAssigned == 1"
            >
              <i :class="scope.row.isPurchaseTimeout == 1 ? 'color-red' : 'secondIconClass'" class="el-icon-orange"></i>
            </div>
          </span>
          <!-- </el-tooltip> -->
        </template>
      </el-table-column>
      <!-- <el-table-column label="提交人" prop="developmentHeadName" show-overflow-tooltip></el-table-column> -->
      <!-- <el-table-column label="提交人" prop="createUserName" show-overflow-tooltip></el-table-column> -->
      <!-- <el-table-column label="意见说明" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="(scope.row.finalAuditOpinion != '' && scope.row.proFirstPurchase == 15) || (scope.row.finalAuditOpinion != '' && scope.row.proFirstPurchase == 5)">
            {{ scope.row.finalAuditOpinion }}
          </span>
          <span v-else>-</span>
          <span></span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="录入时间" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="scope.row.returnTime" :class="scope.row.isPurchaseTimeout == 1 ? 'color-red' : ''">{{ scope.row.returnTime }}</span>
          <span v-else :class="scope.row.isPurchaseTimeout == 1 ? 'color-red' : ''">-</span>
        </template>
      </el-table-column> -->
      <el-table-column label="时间" min-width="100">
        <template #default="scope">
          <div :class="scope.row.isPurchaseTimeout == 1 ? 'color-red' : ''">
            首次进入采购时间:{{ scope.row.proFirstPurchaseTime ? scope.row.proFirstPurchaseTime : '-' }}
          </div>
          <div :class="scope.row.isPurchaseTimeout == 1 ? 'color-red' : ''">
            创建时间：{{ scope.row.auditTime ? scope.row.auditTime : '-' }}
          </div>
          <div :class="scope.row.isPurchaseTimeout == 1 ? 'color-red' : ''">
            提交时间：{{ scope.row.returnTime ? scope.row.returnTime : '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="负责人">
        <template #default="scope">
          <span :class="scope.row.isPurchaseTimeout == 1 ? 'color-red' : ''">
            <div v-if="scope.row.createUserName">
              录入：{{ scope.row.createUserName ? scope.row.createUserName : '-' }}
            </div>
            <div v-if="scope.row.developmentHeadName">
              开发：{{ scope.row.developmentHeadName ? scope.row.developmentHeadName : '-' }}
            </div>
            <div v-if="scope.row.purchaseUserName">
              采购：{{ scope.row.purchaseUserName ? scope.row.purchaseUserName : '-' }}
            </div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="审核信息">
        <template #default="scope">
          <span :class="scope.row.isPurchaseTimeout == 1 ? 'color-red' : ''">
            <div v-if="scope.row.finalReviewerName">
              审核人：{{ scope.row.finalReviewerName ? scope.row.finalReviewerName : '-' }}
            </div>
            <div v-else>审核人：-</div>
            <div>
              结果：
              <span v-if="scope.row.proFinalStatus == 5">作废</span>
              <span v-if="scope.row.proFinalStatus == 6">待审核</span>
              <span v-if="scope.row.proFinalStatus == 7">通过</span>
              <span v-if="scope.row.proFinalStatus == 8">驳回开发</span>
              <span v-if="scope.row.proFinalStatus == 9">驳回采购</span>
              <span v-if="scope.row.proFinalStatus == 0">未进入终审</span>
              <span v-else>-</span>
            </div>
            <div class="mle1">
              时间：
              <span v-if="scope.row.finalReviewerTime != ''">{{
                scope.row.finalReviewerTime ? scope.row.finalReviewerTime : '-'
              }}</span>
              <span v-else>-</span>
            </div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" align="center">
        <template #default="scope">
          <!-- 采购初录未进行二次分配 并不存在采购异常  或者 存在采购异常 并此数据未二次分配数据   这两个条件下才能进行操作-->
          <!-- v-if=" (scope.row.isExceptionSubmit == '0' && scope.row.isCompleteAssigned == 1) || scope.row.isCompleteAssigned == 1 || (scope.row.isExceptionSubmit == '0' &&
          scope.row.isCompleteAssigned == 0) " -->
          <span v-if="scope.row.isOperation">
            <!-- <span v-if="scope.row.exceptionState == ''"> -->
            <!--外加条件  当存前数据在二次分配列表中未进行分配的不能进行录入 只有已经在二次分配列表中已经分配过的数据才能进行录入 -->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-folder-checked"
              v-if="
                (scope.row.proFirstPurchase == 16 &&
                  buttonAuthor.entry &&
                  scope.row.isPurchaseSecondDistribution != 1 &&
                  scope.row.isDevelopSecondDistribution != 1) ||
                (buttonAuthor.entry &&
                  scope.row.proFirstPurchase == 15 &&
                  scope.row.isPurchaseSecondDistribution != 1 &&
                  scope.row.isDevelopSecondDistribution != 1) ||
                (scope.row.proFirstPurchase == 16 && buttonAuthor.entry && scope.row.isCompleteAssigned == 1) ||
                (scope.row.proFirstPurchase == 15 && buttonAuthor.entry && scope.row.isCompleteAssigned == 1)
              "
              @click="handleEdit(scope.$index, scope.row, 1)"
            >
              <!-- 存在未录入或重新录入 -->
              录入
            </el-button>
            <el-button
              size="mini"
              type="text"
              v-if="scope.row.proFirstPurchase == 17 && buttonAuthor.submit"
              icon="el-icon-document-checked"
              @click="batchOperation(18, scope.row)"
            >
              提交
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-if="scope.row.proFirstPurchase == 17 && buttonAuthor.edit"
              @click="handleEdit(scope.$index, scope.row, 2)"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              v-if="
                (scope.row.proFirstPurchase == 18 &&
                  buttonAuthor.update &&
                  scope.row.isAssistant == 0 &&
                  scope.row.proThreeStatus == 0) ||
                (scope.row.proFirstPurchase == 18 &&
                  buttonAuthor.update &&
                  scope.row.isAssistant == 0 &&
                  scope.row.proThreeStatus == 13) ||
                (scope.row.proFirstPurchase == 18 &&
                  buttonAuthor.update &&
                  scope.row.isAssistant == 1 &&
                  scope.row.proFinalStatus == 0) ||
                (scope.row.proFirstPurchase == 18 &&
                  buttonAuthor.update &&
                  scope.row.isAssistant == 1 &&
                  scope.row.proFinalStatus == 8) ||
                (scope.row.proFirstPurchase == 18 && buttonAuthor.update && scope.row.proFinalStatus == 7) ||
                (scope.row.proFirstPurchase == 18 && buttonAuthor.update && scope.row.proSecondStatus == 8)
              "
              icon="el-icon-refresh"
              @click="handleEdit(scope.$index, scope.row, 3)"
            >
              更新
            </el-button>
            <el-button
              size="mini"
              type="text"
              v-if="scope.row.proFirstPurchase == 5 && buttonAuthor.activation"
              icon="el-icon-thumb"
              @click="stateEdit(17, scope.row)"
            >
              申请激活
            </el-button>
          </span>
          <!-- <span v-else>-</span> -->
          <el-button
            icon="el-icon-notebook-2"
            size="mini"
            @click="openLog(scope.row.id)"
            type="text"
            v-if="buttonAuthor.log"
            >日志</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <PurchaseFirstPopupNew ref="PurchaseFirstPopupNew"></PurchaseFirstPopupNew>
    <CommentPopup :minTitle="minTitle" :firstTile="firstTile" :logTitle="logTitle" ref="CommentPopup"></CommentPopup>
    <Abnormal ref="Abnormal" :logTitle="logTitle"></Abnormal>
    <el-dialog
      title="提示"
      width="30%"
      v-model="promptVisible"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div class="info-box">
        <p class="info-top">{{ infoValue.resMessage }}</p>
        <p>详细描述</p>
        <ul style="margin-top: 10px">
          <li style="margin-bottom: 5px" v-for="(item, index) in infoValue.errorMessages" :key="index">
            {{ item }}
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  onBeforeMount,
  computed,
  onMounted,
  getCurrentInstance,
  inject,
  ref,
  nextTick,
  onUnmounted,
} from 'vue'
import { useStore } from 'vuex'
import PurchaseFirstPopupNew from './purchaseFirstPopupNew'
import tablePage from '../../compositionApi/tablePage'
import { ElMessage } from 'element-plus'
import authorButtons from '../../compositionApi/authorButtons'
import { localGet, localSet } from '../../utils/util'
import CommentPopup from '../../components/commentPopup/commentPopup.vue'
import Abnormal from './Entry/Abnormal.vue'

export default {
  name: 'ProductEntryList',
  components: {
    PurchaseFirstPopupNew,
    CommentPopup,
    Abnormal,
  },
  props: ['tableData', 'tableLoading'],
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons()
    const buttonAuthor = BUTTONS.value
    const data = reactive({
      promptVisible: false,
      infoValue: {},
      pro_purchase_status: [],
      selectList: [],
      searchMsg: '',
      timerOut: null,
      firstTile: '',
      minTitle: '',
      pro_purchase_exception: [],
      logTitle: '确认操作',
    })
    const store = useStore()
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

      data.pro_purchase_exception = localGet('dictCodeList').pro_purchase_exception
        ? localGet('dictCodeList').pro_purchase_exception
        : []
      data.pro_purchase_status = localGet('dictCodeList').pro_purchase_status
        ? localGet('dictCodeList').pro_purchase_status
        : []
    })

    const getTableList = (searchMsg) => {
      data.searchMsg = searchMsg
    }
    // 編輯
    const handleEdit = (index, row, type) => {
      api.develop.getFirstPurchaseDetail({ id: row.id }).then((res) => {
        store.commit('purchase/setSpriceDetailFlagetpr', false)
        let title = '录入信息'
        if (type == 1) {
          title = '录入信息'
        }
        if (type == 2) {
          title = '编辑信息'
        }
        if (type == 3) {
          title = '更新信息'
        }
        let info = {
          type: 6,
          row: res.data,
          title: title,
        }
        nextTick(() => {
          localSet(`goodsDetails${row.id}`, info)
          vue.$refs.PurchaseFirstPopupNew.getMsg(row.id)
          vue.$refs.PurchaseFirstPopupNew.getBasicInfo()
          vue.$refs.PurchaseFirstPopupNew.getPriceMsg()
          vue.$refs.PurchaseFirstPopupNew.handleClick()
        })
      })
    }

    //采购初录新增 批量申请分配
    const secondaryDistribution = () => {
      if (data.selectList.length > 0) {
        if (
          data.selectList.every((item) => {
            //采购初录 重新录入 待录入 草稿 状态才能进行申请分配
            return item.proFirstPurchase == 16 || item.proFirstPurchase == 17 || item.proFirstPurchase == 15
          })
        ) {
          if (
            data.selectList.every((i) => {
              //不能对以进行分配过的数据进行分配
              return i.isDevelopSecondDistribution != 1 && i.isPurchaseSecondDistribution != 1
            })
          ) {
            data.firstTile = '分配确认'
            data.minTitle = '确认所选产品信息进行二次分配申请？'
            data.logTitle = '确认操作'
            const msg = {
              path: 'develop',
              funName: 'purchaseSecondaryDistribution',
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
            // vue.$message.warning("不能分配已分配过的数据！");
            vue.$message.warning('该数据已在二次分配列表中存在，不可重复提交！')
          }
        } else {
          vue.$message.warning('只能分配重新录入、待录入、草稿状态的数据！')
        }
      } else {
        vue.$message.warning('请至少选择一条数据操作！')
      }
    }

    // 查看商品详情
    const getDetails = (id) => {
      api.develop.getFirstPurchaseDetail({ id: id }).then((res) => {
        // console.log("产品详情", res);
        if (res.code == 200) {
          store.commit('purchase/setSpriceDetailFlagetpr', true)
          nextTick(() => {
            let info = {
              type: 6,
              row: res.data,
              title: '产品详情',
              isDetail: false,
            }
            localSet(`goodsDetails${id}`, info)
            vue.$refs.PurchaseFirstPopupNew.getMsg(id)
            vue.$refs.PurchaseFirstPopupNew.getBasicInfo()
            vue.$refs.PurchaseFirstPopupNew.getPriceMsg()
          })
        } else {
          vue.$message({
            type: 'warning',
            message: res.msg,
          })
        }
      })
    }

    // 列表选择
    const handleSelectionChange = (val) => {
      data.selectList = val
    }

    // 批量操作
    const batchOperation = (status, row) => {
      if (data.selectList.length < 1 && !row) {
        ElMessage.warning({
          message: '至少选择一条信息!',
          type: 'warning',
        })
      } else {
        vue
          .$confirm('此操作将提交选品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(() => {
            let arr = row ? [row] : data.selectList
            let msg = {
              ids: [],
              status: '18',
            }
            console.log(
              arr.every((item) => {
                return item.proFirstPurchase == 17
              })
            )
            if (
              arr.every((item) => {
                return item.proFirstPurchase == 17
              })
            ) {
              arr.map((i) => {
                msg.ids.push(i.id)
              })
              api.develop.bulkFirstSubmission(msg).then((res) => {
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
                  getTableData()
                }
              })
            } else {
              vue.$message({
                type: 'warning',
                message: '只能提交草稿箱中的数据！',
              })
            }
          })
          .catch(() => {
            vue.$message({
              type: 'info',
              message: '已取消修改',
            })
          })
      }
    }

    // 提交  激活
    const stateEdit = (index, row) => {
      console.log(index, row)
      api.develop.activationMessage({ pid: row.id }).then((res) => {
        if (res.code == 200) {
          vue.$message({
            type: 'success',
            message: res.msg,
          })
          console.log(res)
          getTableData()
        } else {
          vue.$message({
            type: 'warning',
            message: res.msg,
          })
        }
      })
    }
    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (list, dizKey) {
        if (list.length > 1 && dizKey !== -1) {
          for (let item of list) {
            if (dizKey == item.dizKey) {
              return item.value
            }
          }
        }
      }
    })
    const uploadExcelFrom = ref(null)
    const getTableData = inject('getTableData')
    // 上传文件
    const uploadTrigger = () => {
      uploadExcelFrom.value.click()
    }
    // 上传文件
    const uploadChange = () => {
      let uploadExcelFile = uploadExcelFrom.value.files[0]
      let excelData = new FormData()
      excelData.append('file', uploadExcelFile)
      api.develop
        .purchaseFirstImport(excelData)
        .then((res) => {
          if (res.code == 200) {
            if (res.data.errorMessages.length > 0) {
              data.promptVisible = true
              data.infoValue = res.data
            } else {
              vue.$message.success('导入文件成功!')
            }
            // vue.$message.success("导入文件成功!");
            // vue.$message.success(res.msg);
            getTableData()
            vue.$refs.uploadExcelFrom.value = null
          } else {
            vue.$refs.uploadExcelFrom.value = null
            // vue.$message.error("导入文件失败!");
            vue.$message.error(res.msg)
          }
        })
        .catch((error) => {
          vue.$refs.uploadExcelFrom.value = null
          vue.$message.error('导入文件失败!')
        })
    }
    // 日志
    const openLog = (e) => {
      // let ids = [];
      // for (let item of data.selectList) {
      //   ids.push(item.id);
      // }
      let msg = {
        servers: 'develop',
        dataApi: 'getProductLog',
        idList: [e],
      }
      nextTick(() => {
        vue.$refs.logDialog.checkLogDialog(msg)
      })
    }

    // 批量导出
    const downExportPro = (e) => {
      let info = data.searchMsg ? data.searchMsg : {}
      let ids = []
      for (let item of data.selectList) {
        ids.push(item.id)
      }
      info.proIds = ids
      info.templateType = e
      downloadTemplate('purchaseFirstDown', '采购初录列表', info)
    }

    const refData = toRefs(data)

    // 未通过/作废情况下点击状态
    const openCom = (row, index) => {
      console.log(index)
      if (index == 1) {
        if (row.proFirstPurchase == 5) {
          data.logTitle = '意见详情'
          let imgArr = []
          let arr = row.invalidAuditOpinionPicture.split(',')
          if (row.invalidAuditOpinionPicture !== '') {
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
            CommentsText: row.invalidAuditOpinion,
            isDetail: true,
          }
          console.log(msg)
          vue.$refs.CommentPopup.getPicture(msg)
        }
        if (row.proFirstPurchase == 15) {
          let imgArr = []
          let arr = row.finalAuditOpinionPicture.split(',')
          if (row.finalAuditOpinionPicture !== '') {
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
            CommentsText: row.finalAuditOpinion,
            isDetail: true,
          }
          console.log(msg)
          vue.$refs.CommentPopup.getPicture(msg)
        }
      }
      if (index == 2) {
        if (row.exceptionState) {
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
          console.log(msg)
          vue.$refs.Abnormal.getMsg(msg)
        }
      }
      if (index == 3) {
        console.log(row)
        data.logTitle = '意见详情'
        if (row.isDevelopSecondDistribution == 1) {
          let imgArr = []
          let arr = row.developSecondDistributionPicture.split(',')
          if (row.developSecondDistributionPicture !== '') {
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
            CommentsText: row.developSecondDistributionOpinion,
            isDetail: true,
          }
          vue.$refs.CommentPopup.getPicture(msg)
        }
        if (row.isPurchaseSecondDistribution == 1) {
          let imgArr = []
          let arr = row.purchaseSecondDistributionPicture.split(',')
          if (row.purchaseSecondDistributionPicture !== '') {
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
            CommentsText: row.purchaseSecondDistributionOpinion,
            isDetail: true,
          }
          vue.$refs.CommentPopup.getPicture(msg)
        }
      }
    }

    // 批量提交异常
    const AbnormalAll = () => {
      if (data.selectList.length > 0) {
        let arr = []
        data.selectList.map((item) => {
          arr.push(item.id)
        })
        vue.$refs.Abnormal.getMsg({ proId: arr })
      } else {
        vue.$message({
          type: 'warning',
          message: '请至少选择一条数据操作！',
        })
      }
    }

    return {
      ...refData,
      openCom,
      stateEdit,
      handleEdit,
      getTableList,
      tableTypeComputed,
      handleSelectionChange,
      downExportPro,
      uploadChange,
      uploadTrigger,
      uploadExcelFrom,
      openLog,
      getTableData,
      batchOperation,
      buttonAuthor,
      getDetails,
      AbnormalAll,
      secondaryDistribution,
    }
  },
}
</script>
<style lang="scss" scoped>
.secondIconClass {
  font-size: 14px;
  color: #409eff;
}
.info-box {
  font-size: 16px;
  .info-top {
    color: red;
    margin-bottom: 30px;
  }
}
// .tip {
//   color: #f57500;
//   font-size: 14px;
// }
</style>
