<!-- 采购二次分配弹框 -->
<template>
  <div id="SecondaryPop">
    <el-dialog :title="title" v-model="dialogVisible" width="1300px" :close-on-click-modal="false" @close="closeTab" destroy-on-close>
      <el-tabs tab-position="left" lazy v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="1">
          <BasicInfo
            :basicInfoObj="basicInfoObj"
            v-if="msgList.isPurchaseSecondDistribution == 1"
            ref="BasicInfo"
          ></BasicInfo>
          <DevBasicInfo ref="DevBasicInfo" v-if="msgList.isDevelopSecondDistribution == 1"></DevBasicInfo>
        </el-tab-pane>
        <el-tab-pane label="采购信息" name="2">
          <SecondaryPurchaseMsg ref="PurchaseMsg" :id="id"></SecondaryPurchaseMsg>
        </el-tab-pane>
        <el-tab-pane label="计价信息" name="3" v-if="msgList.isPurchaseSecondDistribution == 1">
          <PriceMsg :priceMsgObj="priceMsgObj" ref="PriceMsg" :id="id" v-if="id"></PriceMsg>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  watch,
  computed,
  getCurrentInstance,
  nextTick,
  provide,
  inject,
  ref,
} from 'vue'
import PriceMsg from './Entry/PriceMsg.vue'
import BasicInfo from './Entry/BasicInfo'
import DevBasicInfo from '../develop/Entry/BasicInfo.vue'
import { useStore } from 'vuex'
import SecondaryPurchaseMsg from './Entry/SecondaryPurchaseMsg.vue'
import { localGet, localRemove, localSet } from '@/utils/util'
export default {
  name: 'SecondaryPop',
  components: {
    PriceMsg,
    BasicInfo,
    SecondaryPurchaseMsg,
    DevBasicInfo,
  },
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      msgList: {},
      activeName: '1',
      title: '',
      butName: '提交',
      isDraft: false,
      isDetail: true,
      basicInfoObj: {},
      purchaseMsgObj: {},
      priceMsgObj: {},
      logTitle: '确认操作',
      id: '',
    })
    const store = useStore()
    const disabled = computed(() => store.state.purchase.priceDetailFlag)

    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http
    onBeforeMount(() => {})
    onMounted(() => {})

    // getBasicInfo  获取基础信息数据展示
    const getBasicInfo = (id) => {
      // basicinfo 基础信息部分数据处理
      let basicInfo = {
        msgList: localGet(`goodsDetails${id}`).row ? localGet(`goodsDetails${id}`).row : {},
        sourceOptions: [],
        operatingOptions: [],
      }
      basicInfo.sourceOptions = localGet('dictCodeList').pro_selection_source
        ? localGet('dictCodeList').pro_selection_source
        : []

      // 运营方式
      basicInfo.operatingOptions = localGet('dictCodeList').operate_type ? localGet('dictCodeList').operate_type : []
      data.basicInfoObj = basicInfo
    }

    // PriceMsg     计价信息部分数据处理
    const getPriceMsg = (id) => {
      let priceMsgObj = {
        msgList: localGet(`goodsDetails${id}`).row,
        transportOptions: localGet('dictCodeList').logistics_transport_mode
          ? localGet('dictCodeList').logistics_transport_mode
          : [],
        siteOptions: [],
      }
      //获取站点
      api.system.getAllSiteList().then((res) => {
        if (res.code == 200) {
          priceMsgObj.siteOptions = res.data
        }
      })
      data.priceMsgObj = priceMsgObj
    }

    // 获取最新数据
    const getNewData = () => {
      //获取开发流程字典
      api.develop.getDevProcessList().then((res) => {
        if (res.code == 200) {
          localSet('dictCodeList', res.data)
        }
      })
    }

    // 获取信息
    const getMsg = (id, row) => {
      data.id = id
      getNewData()
      let info = localGet(`goodsDetails${id}`)
      console.log(info.row.isPurchaseSecondDistribution, '采购二次分配')
      console.log(info.row.isDevelopSecondDistribution, '开发二次分配')
      data.dialogVisible = true
      data.activeName = '1'
      data.msgList = info.row
      data.isDetail = info.isDetail == false ? info.isDetail : true
      data.title = info.title ? info.title : '产品信息'
      data.isDraft = true
      if (data.msgList.proFirstPurchase == 18) {
        data.butName = '更新提交'
        data.isDraft = false
      } else {
        data.isDraft = true
        data.butName = '提交'
      }
      if (info.row.isDevelopSecondDistribution == 1) {
        let infoType = {
          type: '3',
        }
        info = Object.assign(infoType, localGet(`goodsDetails${id}`))
        localSet(`goodsDetails${id}`, info)
        nextTick(() => {
          vue.$refs.DevBasicInfo.getMsg(info, row)
        })
      }
    }

    const handleClick = (tab, event) => {
      console.log(vue.$refs.PurchaseMsg, data.activeName)
      if (data.activeName == 3) {
        nextTick(() => {
          vue.$refs.PriceMsg.getMsg()
          vue.$refs.PurchaseMsg.toFather()
          vue.$refs.PriceMsg.getValuation()
        })
      } else if (data.activeName == 2) {
        nextTick(() => {
          // 采购初录
          vue.$refs.PurchaseMsg.getMsg(!data.isDetail)
        })
      }
    }

    // 关闭弹窗
    const closeTab = () => {
      data.dialogVisible = false
      data.activeName = '1'
      localRemove(`goodsDetails${data.id}`)
      vue.$refs.PurchaseMsg.resetForm()
    }

    const netxTip = () => {
      data.activeName = '3'
      handleClick()
    }

    const getTableData = inject('getTableData')
    provide('closeTab', closeTab)
    provide('netxTip', netxTip)
    const refData = toRefs(data)
    return {
      ...refData,
      getMsg,
      closeTab,
      handleClick,
      getTableData,
      getBasicInfo,
      getPriceMsg,
      disabled,
      getNewData,
    }
  },
}
</script>
<style lang="scss" scoped>
#SecondaryPop {
}
</style>
