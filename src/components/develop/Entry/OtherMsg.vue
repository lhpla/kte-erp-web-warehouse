<!-- 其他信息 -->
<template>
  <div>
    <el-form
      :model="selectForm"
      class="demo-form-inline"
      label-width="200"
      :disabled="!isDetail"
      :rules="rules"
      ref="personnelRef"
      size="mini"
    >
      <el-form-item label="开发负责人:" prop="auditorId">
        <el-select v-model="selectForm.auditorId" filterable clearable placeholder="请选择">
          <el-option v-for="item in auditorList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="采购负责人:" prop="purchaseUserId">
        <el-select v-model="selectForm.purchaseUserId" filterable clearable placeholder="请选择">
          <el-option v-for="item in purchaseUserList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="咨询负责人:" prop="consultantsId">
        <el-select v-model="selectForm.consultantsId" filterable clearable placeholder="请选择">
          <el-option v-for="item in auditorList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
      @selection-change="handleSelectionChange"
      ref="tableList"
    >
      <el-table-column type="selection" v-if="isDetail && type != 7 && type != 4"></el-table-column>
      <el-table-column
        type="selection"
        v-if="(isDetail && type == 7) || (isDetail && type == 4)"
        :selectable="checkSelectable"
      ></el-table-column>
      <el-table-column prop="platform" label="平台" show-overflow-tooltip></el-table-column>
      <el-table-column prop="site" label="站点" show-overflow-tooltip></el-table-column>
      <el-table-column label="平台售价" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.platformSellingPrice ? Number(scope.row.platformSellingPrice).toFixed(2) : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="suggestPrice" label="建议售价" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.suggestPrice ? Number(scope.row.suggestPrice).toFixed(2) : '-' }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="rateType" label="站点汇率" show-overflow-tooltip></el-table-column> -->
      <el-table-column prop="parameter" label="参数" show-overflow-tooltip></el-table-column>
      <el-table-column label="选品链接" min-width="180">
        <template #default="scope">
          <el-link :underline="false" :href="scope.row.linking" target="_blank">{{
            scope.row.linking ? scope.row.linking : '-'
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="warehouse" label="目的仓" show-overflow-tooltip></el-table-column>
      <el-table-column prop="number" label="数量" show-overflow-tooltip>
        <template #default="scope">
          <el-input
            v-if="scope.row.isLicit == 1 && isDetail && type == 7"
            v-model="scope.row.number"
            onkeyup="value=value.replace(/^0(0+|\d+)|[^\d]+/g,'')"
            size="mini"
            clearable
          ></el-input>
          <span v-else>
            {{ scope.row.number ? scope.row.number : '-' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="costPrice" label="成本价" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.costPrice ? Number(scope.row.costPrice).toFixed(2) : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商" show-overflow-tooltip></el-table-column>
      <el-table-column prop="transportMode" label="运输方式" show-overflow-tooltip>
        <template #default="scope">
          <span>{{
            scope.row.transportMode ? tableTypeComputed(logistics_transport_mode, scope.row.transportMode) : '-'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="plugAndVoltage" label="插头电压" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ scope.row.plugAndVoltage }}</span>
        </template>
      </el-table-column>
      <el-table-column label="毛利润" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.grossProfit ? Number(scope.row.grossProfit).toFixed(2) : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="毛利率" show-overflow-tooltip>
        <template #default="scope">
          <span class="color-red">{{
            scope.row.grossMargin ? Number(scope.row.grossMargin).toFixed(2) + '%' : '-'
          }}</span>
        </template>
      </el-table-column>

      <!-- 助理审核  产品终审 点击产品名称时在详情中展示当前计价信息是否通过 -->
      <el-table-column
        label="审核结果"
        show-overflow-tooltip
        v-if="(!isDetail && type == 7) || (!isDetail && type == 4)"
      >
        <template #default="scope">
          <!-- 助理审核情况 -->
          <span v-if="type == 4">
            <span v-if="msgList.proThreeStatus != 11 && scope.row.flag == 1">通过</span>
            <span v-if="msgList.proThreeStatus != 11 && scope.row.flag == 0">未通过</span>
            <!-- <span v-if="msgList.proThreeStatus  == 11">-</span> -->
            <span v-if="msgList.proThreeStatus == 11">未审核</span>
          </span>
          <!-- 产品终审情况 -->
          <span v-if="type == 7">
            <span v-if="msgList.proFinalStatus != 6 && scope.row.finalStatus == 1">通过</span>
            <span v-if="msgList.proFinalStatus != 6 && scope.row.finalStatus == 0">未通过</span>
            <!-- <span v-if="msgList.proFinalStatus == 6">-</span> -->
            <span v-if="msgList.proFinalStatus == 6">未审核</span>
          </span>
        </template>
      </el-table-column>

      <!-- 助理审核 产品终审 点击 产品名称展示详情时展示 -->
      <el-table-column label="操作" show-overflow-tooltip v-if="(!isDetail && type == 7) || (!isDetail && type == 4)">
        <template #default="scope">
          <el-button size="mini" icon="el-icon-files" type="text" @click="handleDetail(scope.$index, scope.row)"
            >详情</el-button
          >
        </template>
      </el-table-column>

      <el-table-column label="操作" v-if="isDetail" min-width="150" align="center">
        <template #default="scope">
          <span v-if="type == 7 || type == 4">
            <span v-if="scope.row.isLicit == 1">
              <el-button size="mini" icon="el-icon-files" type="text" @click="handleDetail(scope.$index, scope.row)"
                >详情</el-button
              >
              <el-button
                v-if="type == 7 && scope.row.flag == 1"
                size="mini"
                icon="el-icon-edit"
                type="text"
                @click="numEdit(scope.row)"
                >保存</el-button
              >
            </span>
            <span v-else>-</span>
          </span>
          <span v-else>
            <el-button size="mini" icon="el-icon-files" type="text" @click="handleDetail(scope.$index, scope.row)"
              >详情</el-button
            >
            <!-- <el-button size="mini" icon="el-icon-s-check" type="text" @click="stateEdit(type == 7 ? 7 : 12, scope.row)">通过</el-button> -->
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog title="计算明细" v-model="dialogMsgVisible" :close-on-click-modal="false" destroy-on-close>
    <PublicTabel ref="PublicTabel"></PublicTabel>
  </el-dialog>
  <CommentPopup :minTitle="minTitle" :firstTile="firstTile" :logTitle="logTitle" ref="CommentPopup"></CommentPopup>
</template>

<script>
import { reactive, toRefs, onBeforeMount, computed, onMounted, getCurrentInstance, inject, nextTick, ref } from 'vue'
import PublicTabel from './PublicTabel.vue'
import { ElMessage } from 'element-plus'
import { localGet, localSet } from '../../../utils/util'
import CommentPopup from '../../../components/commentPopup/commentPopup.vue'
export default {
  name: 'OtherMsg',
  components: {
    PublicTabel,
    CommentPopup,
  },
  props: {
    proName: {
      type: String,
    },
  },
  setup(prop, ctx) {
    const data = reactive({
      tableData: [],
      logistics_transport_mode: [],
      msgList: {},
      type: 1,
      selectForm: {
        auditorId: '',
        purchaseUserId: '',
        consultantsId: '',
      },
      auditorList: [],
      purchaseUserList: [],
      // consultantsList: [],
      selectList: [],
      dialogMsgVisible: false,
      rules: {
        auditorId: [{ required: true, message: '请选择开发负责人', trigger: 'blur' }],
        purchaseUserId: [{ required: true, message: '请选择采购负责人', trigger: 'blur' }],
        // consultantsId: [{ required: true, message: "请选择咨询负责人", trigger: "blur" }],
      },
      isDraft: true,
      btnFlag: false,
      isDetail: true,
      firstTile: '产品通过',
      minTitle: '确认所选产品信息通过？',
      logTitle: '确认操作',
      info: null,
    })

    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http
    const personnelRef = ref(null)
    onBeforeMount(() => {})
    onMounted(() => {})
    // 获取信息
    const getMsg = (row) => {
      data.info = row
      getList()
      data.msgList = localGet(`goodsDetails${row.id}`).row
      data.selectForm.auditorId = data.msgList.developmentHeadId == -1 ? '' : data.msgList.developmentHeadId
      data.selectForm.purchaseUserId = data.msgList.purchaseUserId ? data.msgList.purchaseUserId : ''
      data.selectForm.consultantsId = data.msgList.consultantsId !== -1 ? data.msgList.consultantsId : ''
      data.isDetail = localGet(`goodsDetails${row.id}`).isDetail != false
      // 运输方式
      data.logistics_transport_mode = localGet('dictCodeList').logistics_transport_mode
        ? localGet('dictCodeList').logistics_transport_mode
        : []

      if (
        (data.type == 7 && data.msgList.proFinalStatus == 7) ||
        (data.type == 4 && data.msgList.proThreeStatus == 12)
      ) {
        data.isDraft = false
      } else {
        data.isDraft = true
      }

      data.type = localGet(`goodsDetails${row.id}`).type
      if (data.type == 7) {
        // 终审
        getlist()
      } else if (data.type == 4) {
        // 助理审核
        api.valuation.getAllValuationList({ proId: data.msgList.id }).then((res) => {
          if (res.code == 200) {
            data.tableData = res.data
          } else {
            vue.$message({
              type: 'warning',
              message: res.msg,
            })
          }
        })
      }
    }

    const getlist = () => {
      api.valuation.getMaoliAuditList({ proId: data.msgList.id }).then((res) => {
        if (res.code == 200) {
          data.tableData = res.data

          //设置默认勾选项
          let arr = []
          data.tableData.map((item) => {
            if (item.isLicit != 0 && item.flag == 1) {
              arr.push(item)
            }
          })
          nextTick(() => {
            if (arr.length == 1) {
              vue.$refs.tableList.toggleRowSelection(arr[0], true)
            }
          })
        } else {
          vue.$message({
            type: 'warning',
            message: res.msg,
          })
        }
      })
    }

    // 获取需要用的数据列表、
    const getList = () => {
      api.userOperation.getHeadOfDevelopment().then((res) => {
        if (res.code == 200) {
          data.auditorList = res.data
        }
      })
      api.userOperation.getHeadOfPurchasing().then((res) => {
        if (res.code == 200) {
          data.purchaseUserList = res.data
        }
      })
      // api.userOperation.getProductConsultation().then(res => {
      //   if (res.code == 200) {
      //     data.consultantsList = res.data;
      //   }
      // });
    }

    // 查看详情
    const handleDetail = (index, row) => {
      // console.log(row)
      data.dialogMsgVisible = true
      nextTick(() => {
        vue.$refs.PublicTabel.getMsg(row.id, data.info)
      })
    }

    const handleSelectionChange = (val) => {
      data.selectList = val
    }
    // 单个通过
    const stateEdit = (index, row) => {
      data.btnFlag = true
      if (data.isDraft) {
        personnelRef.value.validate((valid) => {
          if (valid) {
            if (localGet(`goodsDetails${data.info.id}`).type == 7) {
              data.logTitle = '确认操作'
              let id = localGet(`goodsDetails${data.info.id}`).row.id
              let msg = {
                path: 'develop',
                funName: 'updateAssistantStatus',
                param: {
                  opinion: '',
                  ids: [id],
                  opinionPicture: [],
                  status: 12,
                  auditorId: data.selectForm.auditorId,
                  consultantsId: data.selectForm.consultantsId,
                  purchaseUserId: data.selectForm.purchaseUserId,
                  valuationIds: [row.id],
                  proName: vue.$props.proName,
                },
                isPass: true,
              }
              msg.funName = localGet(`goodsDetails${data.info.id}`).type == 4 ? 'updateAssistantStatus' : 'auditOpinion'
              msg.param.status = localGet(`goodsDetails${data.info.id}`).type == 4 ? 12 : 7
              vue.$refs.CommentPopup.openLog(msg)
            } else {
              data.logTitle = '确认操作'
              let id = localGet(`goodsDetails${data.info.id}`).row.id
              let msg = {
                path: 'develop',
                funName: 'updateAssistantStatus',
                param: {
                  opinion: '',
                  ids: [id],
                  opinionPicture: [],
                  status: 12,
                  auditorId: data.selectForm.auditorId,
                  consultantsId: data.selectForm.consultantsId,
                  purchaseUserId: data.selectForm.purchaseUserId,
                  valuationIds: [row.id],
                },
                isPass: true,
              }
              msg.funName = localGet(`goodsDetails${data.info.id}`).type == 4 ? 'updateAssistantStatus' : 'auditOpinion'
              msg.param.status = localGet(`goodsDetails${data.info.id}`).type == 4 ? 12 : 7
              vue.$refs.CommentPopup.openLog(msg)
            }

            data.btnFlag = false
          } else {
            data.btnFlag = false
          }
        })
      }
    }

    // 编辑数量
    const numEdit = (row) => {
      api.valuation.updateNumberById({ num: Number(row.number), vid: row.id }).then((res) => {
        if (res.code == 200) {
          vue.$message({
            type: 'success',
            message: res.msg,
          })
          getlist()
        } else {
          vue.$message({
            type: 'warning',
            message: res.msg,
          })
        }
      })
    }
    // 批量通过
    const stateEditMore = (status, name) => {
      data.btnFlag = true
      if (data.isDraft) {
        personnelRef.value.validate((valid) => {
          if (valid) {
            if (data.selectList.length < 1) {
              ElMessage.warning({
                message: '至少选择一条信息!',
                type: 'warning',
              })
            } else {
              data.logTitle = '确认操作'
              let id = localGet(`goodsDetails${data.info.id}`).row.id
              if (name) {
                let msg = {
                  path: 'develop',
                  funName: 'updateAssistantStatus',
                  param: {
                    opinion: '',
                    ids: [id],
                    opinionPicture: [],
                    status: status,
                    auditorId: data.selectForm.auditorId,
                    consultantsId: data.selectForm.consultantsId,
                    purchaseUserId: data.selectForm.purchaseUserId,
                    valuationIds: [],
                    proName: name,
                  },
                  isPass: true,
                }
                msg.funName =
                  localGet(`goodsDetails${data.info.id}`).type == 4 ? 'updateAssistantStatus' : 'auditOpinion'
                data.selectList.map((item) => {
                  msg.param.valuationIds.push(item.id)
                })
                vue.$refs.CommentPopup.openLog(msg)
              } else {
                let msg = {
                  path: 'develop',
                  funName: 'updateAssistantStatus',
                  param: {
                    opinion: '',
                    ids: [id],
                    opinionPicture: [],
                    status: status,
                    auditorId: data.selectForm.auditorId,
                    consultantsId: data.selectForm.consultantsId,
                    purchaseUserId: data.selectForm.purchaseUserId,
                    valuationIds: [],
                  },
                  isPass: true,
                }
                msg.funName =
                  localGet(`goodsDetails${data.info.id}`).type == 4 ? 'updateAssistantStatus' : 'auditOpinion'
                data.selectList.map((item) => {
                  msg.param.valuationIds.push(item.id)
                })
                vue.$refs.CommentPopup.openLog(msg)
              }
            }
          }
        })
      }
      data.btnFlag = false
    }

    const updateAssistantStatus = inject('updateAssistantStatus')
    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (option, dizKey) {
        if (option.length > 1 && dizKey !== -1) {
          for (let item of option) {
            if (dizKey == item.dizKey) {
              return item.value
            }
          }
        }
      }
    })

    // 重置表单
    const resetForm = () => {
      if (personnelRef.value) {
        personnelRef.value.resetFields()
        personnelRef.value.clearValidate()
      }
    }

    // 禁止表格选中（终审情况下）  终审情况下 row.flag ==1  助理审核通过终审才能进行审核
    const checkSelectable = (row) => {
      if (data.type == 4) {
        return row.isLicit != 0
      } else {
        return row.isLicit != 0 && row.flag == 1
      }
    }
    const refData = toRefs(data)
    const closeTab = inject('closeTab')
    return {
      ...refData,
      handleSelectionChange,
      getMsg,
      stateEdit,
      stateEditMore,
      numEdit,
      updateAssistantStatus,
      closeTab,
      tableTypeComputed,
      handleDetail,
      personnelRef,
      resetForm,
      checkSelectable,
    }
  },
}
</script>
<style lang="scss" scoped>
.dis-item {
  display: flex;
  justify-content: flex-start;
  div {
    margin: 10px 20px;
  }
}
.but-right {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  width: 90%;
}
.cen-tabel {
  margin-top: 20px;
}
</style>
