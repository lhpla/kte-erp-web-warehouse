<!-- 二录弹窗 -->
<template>
  <div>
    <el-dialog :title="title" v-model="dialogVisible" :close-on-click-modal="false" width="1300px" @close="closed" destroy-on-close>
      <el-tabs tab-position="left" lazy v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="1">
          <BasicInfo ref="BasicInfo"></BasicInfo>
        </el-tab-pane>
        <el-tab-pane label="采购信息" name="2">
          <PurchaseMsg ref="PurchaseMsg"></PurchaseMsg>
        </el-tab-pane>
      </el-tabs>
      <template #footer v-if="isDetail">
        <el-button type="primary" size="mini" :disabled="btnFlag" :loading="btnFlag" @click="onSubmit(33)">{{
          butName
        }}</el-button>
        <el-button
          type="primary"
          size="mini"
          :disabled="btnFlag"
          :loading="btnFlag"
          v-if="isDraft"
          @click="onSubmit(32)"
          >暂存草稿</el-button
        >
        <el-button size="mini" v-if="isDraft" :disabled="btnFlag" :loading="btnFlag" @click="onSubmit(5)"
          >作废</el-button
        >
      </template>
    </el-dialog>
    <CommentPopup :minTitle="minTitle" :firstTile="firstTile" :logTitle="logTitle" ref="CommentPopup"></CommentPopup>
  </div>
</template>

<script>
import { reactive, toRefs, onBeforeMount, onMounted, getCurrentInstance, nextTick, provide, inject, ref } from 'vue'
import CommentPopup from '@/components/commentPopup/commentPopup.vue'
import BasicInfo from '../Entry/BasicInfo.vue'
import PurchaseMsg from '../Entry/PurchaseMsg.vue'
import { localSet, localGet } from '@/utils/util'
export default {
  name: 'ProductSecondPopup',
  components: {
    BasicInfo,
    PurchaseMsg,
    CommentPopup,
  },
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      msgList: {},
      activeName: '1',
      type: 1,
      title: '',
      isDraft: true,
      butName: '提交',
      btnFlag: false,
      isDetail: true,
      firstTile: '选品作废',
      minTitle: '确认所选选品信息作废？',
      logTitle: '确认操作',
      info: null,
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http
    onBeforeMount(() => {})
    onMounted(() => {})

    //关闭
    const closed = () => {
      data.dialogVisible = false
      data.activeName = '1'
      nextTick(() => {
        vue.$refs.BasicInfo.closedtooltipRef()
        if (vue.$refs.BasicInfo.productForm) {
          vue.$refs.BasicInfo.productForm.resetFields()
        }
      })
      localStorage.removeItem(`goodsDetails${data.info.id}`)
    }

    //  获取最新数据
    const getNewData = () => {
      //获取开发流程字典
      api.develop.getDevProcessList().then((res) => {
        if (res.code == 200) {
          localSet('dictCodeList', res.data)
        }
      })
      //选品平台
      api.systemNew.getPlatformAll().then((res) => {
        if (res.code == 200) {
          localSet('platformLiist', res.data)
        }
      })
    }

    // 取消
    const handleClose = (done) => {
      vue
        .$confirm('确认关闭？')
        .then((_) => {
          data.dialogVisible = false
          data.activeName = '1'
          vue.$refs.BasicInfo.resetForm()
        })
        .catch((_) => {})
    }

    // 获取信息
    const getMsg = (row) => {
      data.info = row
      getNewData()
      const info = localGet(`goodsDetails${row.id}`)
      data.isDetail = localGet(`goodsDetails${row.id}`).isDetail != false
      data.dialogVisible = true
      data.msgList = info.row
      data.type = info.type
      data.title = info.title ? info.title : '产品信息'
      if (data.msgList.proSecondStatus == 34 || data.msgList.proSecondStatus == 35) {
        data.butName = '更新提交'
        data.isDraft = false
      } else {
        data.isDraft = true
        data.butName = '提交'
      }
      nextTick(() => {
        vue.$refs.BasicInfo.getMsg(info, row)
      })
    }

    const handleClick = (tab, event) => {
      if (data.activeName == 2) {
        nextTick(() => {
          vue.$refs.PurchaseMsg.getMsg(data.info)
        })
      }
    }
    // 点击提交
    const onSubmit = (status) => {
      data.btnFlag = true
      if (status == 5) {
        const info = localGet(`goodsDetails${data.info.id}`)
        data.firstTile = '产品作废'
        data.minTitle = '确认所选产品信息进行作废？'
        data.logTitle = '确认操作'
        const msg = {
          path: 'develop',
          funName: 'updateSecondStatus',
          param: {
            opinion: '',
            ids: [info.row.id],
            opinionPicture: [],
            status: 5,
          },
        }
        vue.$refs.CommentPopup.openLog(msg)
        data.btnFlag = false
      } else {
        const draf = data.isDraft ? status : data.msgList.proSecondStatus
        nextTick(() => {
          if (status == 32) {
            vue.$refs.BasicInfo.onSubmitDraf(draf)
          } else {
            vue.$refs.BasicInfo.onSubmit(draf)
          }

          data.btnFlag = false
        })
      }
    }
    // 关闭弹窗
    const closeTab = () => {
      data.dialogVisible = false
      data.btnFlag = false
      getTableData()
      data.activeName = '1'
      vue.$refs.BasicInfo.resetForm()
    }
    const netxTip = () => {
      data.activeName = '2'
      handleClick()
    }

    const getTableData = inject('getTableData')
    provide('closeTab', closeTab)
    provide('netxTip', netxTip)
    const refData = toRefs(data)
    return {
      ...refData,
      handleClose,
      getMsg,
      closeTab,
      handleClick,
      getTableData,
      onSubmit,
      closed,
      getNewData,
    }
  },
}
</script>
<style lang="scss" scoped></style>
