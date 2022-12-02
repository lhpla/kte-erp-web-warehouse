<!-- 助理审核   终审弹窗 -->
<template>
  <div>
    <el-dialog
      :title="title"
      v-model="dialogVisible"
      width="1300px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-tabs
        tab-position="left"
        lazy
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane label="基础信息" name="1">
          <BasicInfo ref="BasicInfo"></BasicInfo>
        </el-tab-pane>
        <el-tab-pane label="采购信息" name="2">
          <PurchaseMsg ref="PurchaseMsg"></PurchaseMsg>
        </el-tab-pane>
        <el-tab-pane label="审核意见" name="3">
          <OtherMsg ref="OtherMsg" :proName="proName"></OtherMsg>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer" v-if="isDetail">
          <el-button
            type="primary"
            size="mini"
            :disabled="btnFlag"
            :loading="btnFlag"
            @click="stateEditMore(type == 4 ? 12 : 7)"
            >批量通过</el-button
          >
          <el-button size="mini" :disabled="btnFlag" :loading="btnFlag" @click="batchOperation(5)">作废</el-button>
          <el-button size="mini" :disabled="btnFlag" :loading="btnFlag" @click="batchOperation(type == 4 ? 13 : 8)"
            >驳回(开发)</el-button
          >
          <el-button size="mini" :disabled="btnFlag" :loading="btnFlag" @click="batchOperation(type == 4 ? 14 : 9)"
            >驳回(询价)</el-button
          >
        </span>
      </template>
    </el-dialog>
    <CommentPopup :minTitle="minTitle" :firstTile="firstTile" ref="CommentPopup"></CommentPopup>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  watch,
  getCurrentInstance,
  nextTick,
  provide,
  inject,
  ref,
} from 'vue'
import OtherMsg from '../Entry/OtherMsg.vue'
import BasicInfo from '../Entry/BasicInfo.vue'
import PurchaseMsg from '../Entry/PurchaseMsg.vue'
import { localGet } from '@/utils/util'
import CommentPopup from '@/components/commentPopup/commentPopup.vue'
export default {
  name: 'AssistantAudPopup',
  components: {
    OtherMsg,
    BasicInfo,
    PurchaseMsg,
    CommentPopup,
  },
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      rowInfo: '',
      activeName: '1',
      type: 1,
      title: '',
      btnFlag: false,
      isDetail: true,
      firstTile: '选品作废',
      minTitle: '确认所选选品信息作废？',
      // 终审基础信息产品中文名称
      proName: '',
      row: null,
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http
    const PurchaseMsg = ref(null)
    onBeforeMount(() => {})
    onMounted(() => {})

    const onClose = () => {
      localStorage.removeItem(`goodsDetails${data.row.id}`)
    }

    watch(
      () => data.dialogVisible,
      () => {
        if (!data.dialogVisible) {
          data.activeName = '1'
        }
      },
      {
        deep: true,
      }
    )

    //意见弹框控制当前btnFlag
    const changeBtnFlag = (e) => {
      data.btnFlag = e
    }

    provide('changeBtnFlag', changeBtnFlag)
    const getTableList = inject('getTableList')
    // 取消
    const handleClose = (done) => {
      vue
        .$confirm('确认关闭？')
        .then((_) => {
          data.dialogVisible = false
        })
        .catch((_) => {})
    }

    // 获取信息
    const getMsg = (row) => {
      data.row = row
      const info = localGet(`goodsDetails${row.id}`)
      console.log('info', info)
      data.dialogVisible = true
      data.rowInfo = info.row
      data.type = info.type
      data.title = info.title ? info.title : '产品信息'
      data.isDetail = localGet(`goodsDetails${row.id}`).isDetail != false

      nextTick(() => {
        vue.$refs.BasicInfo.getMsg(false, row)
        vue.$refs.OtherMsg.getMsg(row)
      })
    }
    const handleClick = (tab, event) => {
      if (data.activeName == 2) {
        nextTick(() => {
          vue.$refs.PurchaseMsg.getMsg(data.row)
        })
      }
      data.proName = vue.$refs.BasicInfo.msgList.productCname
      console.log(data.proName)
    }

    // 单个操作
    const batchOperation = (status) => {
      data.logTitle = '确认操作'
      data.btnFlag = true
      if (status == 5) {
        data.firstTile = '选品作废'
        data.minTitle = '确认所选选品信息作废？'
        const id = localGet(`goodsDetails${data.row.id}`).row.id
        const msg = {
          path: 'develop',
          funName: 'updateAssistantStatus',
          param: {
            opinion: '',
            ids: [id],
            opinionPicture: [],
            status: status,
          },
        }
        msg.funName = data.type == 4 ? 'updateAssistantStatus' : 'auditOpinion'
        vue.$refs.CommentPopup.openLog(msg)
      }
      if (status == 13 || status == 8) {
        data.firstTile = '驳回开发'
        data.minTitle = '确认所选产品驳回开发？'
        const id = localGet(`goodsDetails${data.row.id}`).row.id
        const msg = {
          path: 'develop',
          funName: 'updateAssistantStatus',
          param: {
            opinion: '',
            ids: [id],
            opinionPicture: [],
            status: status,
          },
        }
        msg.funName = data.type == 4 ? 'updateAssistantStatus' : 'auditOpinion'
        vue.$refs.CommentPopup.openLog(msg)
      }
      if (status == 14 || status == 9) {
        data.firstTile = '驳回采购'
        data.minTitle = '确认所选产品驳回采购？'
        const id = localGet(`goodsDetails${data.row.id}`).row.id
        const msg = {
          path: 'develop',
          funName: 'updateAssistantStatus',
          param: {
            opinion: '',
            ids: [id],
            opinionPicture: [],
            status: status,
          },
        }
        msg.funName = data.type == 4 ? 'updateAssistantStatus' : 'auditOpinion'
        vue.$refs.CommentPopup.openLog(msg)
      }

      data.btnFlag = false
    }

    const updateAssistantStatus = (msg) => {
      data.btnFlag = true
      if (data.type == 4) {
        // 助理修改状态
        if (msg.status == 12) {
          api.valuation
            .submitFlag(msg.valuationIds)
            .then((res) => {
              if (res.code == 200) {
                api.develop
                  .updateAssistantStatus(msg)
                  .then((res) => {
                    if (res.code == 200) {
                      vue.$message({
                        type: 'success',
                        message: res.msg ? res.msg : '修改成功!',
                      })
                      closeTab()
                      data.btnFlag = false
                    } else {
                      data.btnFlag = false
                      vue.$message({
                        type: 'warning',
                        message: res.msg,
                      })
                    }
                  })
                  .catch((err) => {
                    data.btnFlag = false
                  })
              } else {
                data.btnFlag = false
                vue.$message({
                  type: 'warning',
                  message: res.msg,
                })
              }
            })
            .catch((err) => {
              data.btnFlag = false
            })
        } else {
          api.develop
            .updateAssistantStatus(msg)
            .then((res) => {
              if (res.code == 200) {
                vue.$message({
                  type: 'success',
                  message: res.msg ? res.msg : '修改成功!',
                })
                data.btnFlag = false

                closeTab()
              } else {
                data.btnFlag = false
                vue.$message({
                  type: 'warning',
                  message: res.msg,
                })
              }
            })
            .catch((err) => {
              data.btnFlag = false
            })
        }
      } else if (data.type == 7) {
        api.develop
          .auditOpinion(msg)
          .then((res) => {
            if (res.code == 200) {
              vue.$message({
                type: 'success',
                message: res.msg ? res.msg : '修改成功!',
              })
              closeTab()
              data.btnFlag = false
            } else {
              vue.$message({
                type: 'warning',
                message: res.msg,
              })
              data.btnFlag = false
            }
          })
          .catch((err) => {
            data.btnFlag = false
          })
      }
    }
    provide('updateAssistantStatus', updateAssistantStatus)

    // 批量通过
    const stateEditMore = (status) => {
      console.log(status)
      if (status == 7) {
        if (vue.$refs.BasicInfo.msgList.productCname != '') {
          vue.$refs.OtherMsg.stateEditMore(status, vue.$refs.BasicInfo.msgList.productCname)
        } else {
          vue.$message({
            type: 'warning',
            message: '请输入产品名称！',
          })
          data.activeName = '1'
        }
      } else {
        vue.$refs.OtherMsg.stateEditMore(status)
      }
    }
    // 关闭弹窗
    const closeTab = () => {
      data.dialogVisible = false
      data.btnFlag = false
      getTableList()
      vue.$refs.BasicInfo.resetForm()
    }
    const netxTip = () => {
      data.activeName = '2'
      handleClick()
    }

    provide('closeTab', closeTab)
    provide('netxTip', netxTip)
    const refData = toRefs(data)
    return {
      ...refData,
      handleClose,
      getMsg,
      closeTab,
      handleClick,
      getTableList,
      batchOperation,
      stateEditMore,
      changeBtnFlag,
      onClose,
    }
  },
}
</script>
<style lang="scss" scoped></style>
