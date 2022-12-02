<!-- 采购初录弹窗 -->
<template>
  <div>
    <el-dialog
      :title="title"
      v-model="dialogVisible"
      width="1300px"
      :close-on-click-modal="false"
      @close="closeTab"
      destroy-on-close
    >
      <el-tabs tab-position="left" lazy v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="1">
          <BasicInfo :basicInfoObj="basicInfoObj" ref="BasicInfo"></BasicInfo>
        </el-tab-pane>
        <el-tab-pane label="采购信息" name="2">
          <PurchaseMsg ref="PurchaseMsg"></PurchaseMsg>
        </el-tab-pane>
        <el-tab-pane label="计价信息" name="3">
          <PriceMsg :priceMsgObj="priceMsgObj" ref="PriceMsg" :id="id" v-if="id"></PriceMsg>
        </el-tab-pane>
      </el-tabs>
      <template #footer v-if="isDetail">
        <el-button v-if="msgList.proFirstPurchase == 15" size="mini" icon="el-icon-edit" :disabled="btnFlag" :loading="btnFlag" type="primary" @click="onPriceImitate()">
          计价模拟
        </el-button>
        <el-button size="mini" icon="el-icon-warning-outline" :disabled="btnFlag" :loading="btnFlag"  type="primary" @click="abnormal">
          异常提交
        </el-button>
        <el-button
          size="mini"
          icon="el-icon-coin"
          type="primary"
          :disabled="btnFlag"
          :loading="btnFlag"
          @click="netxTipSend"
          v-if="
            (!disabled && !isExceptionState) ||
            (!disabled && isCompleteAssigned) ||
            (!disabled && msgList.proFirstPurchase != 5)
          "
        >
          毛利信息
        </el-button>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-folder-checked"
          :loading="btnFlag"
          :disabled="btnFlag"
          @click="onSubmit(18)"
          v-if="
            (!disabled && !isExceptionState) ||
            (!disabled && isCompleteAssigned) ||
            (!disabled && msgList.proFirstPurchase != 5)
          "
        >
          {{ butName }}
        </el-button>
        <el-button
          size="mini"
          type="primary"
          :loading="btnFlag"
          :disabled="btnFlag"
          icon="el-icon-edit-outline"
          v-if="
            (isDraft && !disabled && !isExceptionState) ||
            (isDraft && !disabled && isCompleteAssigned) ||
            (isDraft && !disabled && msgList.proFirstPurchase != 5)
          "
          @click="onSubmit(17)"
        >
          暂存草稿
        </el-button>
      </template>
      <Abnormal ref="Abnormal" :logTitle="logTitle"></Abnormal>
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
import BasicInfo from './Entry/BasicInfo.vue'
import { useStore } from 'vuex'
import PurchaseMsg from './Entry/PurchaseMsg.vue'
import { localGet, localRemove, localSet } from '@/utils/util'
import Abnormal from './Entry/Abnormal.vue'
export default {
  name: 'purchaseFirstPopupNew',
  components: {
    PriceMsg,
    BasicInfo,
    PurchaseMsg,
    Abnormal,
  },
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      msgList: {},
      activeName: '1',
      type: 1,
      title: '',
      butName: '提交',
      btnFlag: false,
      isDraft: false,
      isDetail: true,
      basicInfoObj: {},
      purchaseMsgObj: {},
      priceMsgObj: {},
      logTitle: '确认操作',
      isExceptionState: false,
      isCompleteAssigned: false,
      isAbnormal: false,
      id: '',
    })
    const store = useStore()
    const disabled = computed(() => store.state.purchase.priceDetailFlag)

    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http
    onBeforeMount(() => {})
    onMounted(() => {})
    // 取消
    const handleClose = (done) => {
      vue
        .$confirm('确认关闭？')
        .then((_) => {
          data.dialogVisible = false
          data.activeName = '1'
          vue.$refs.PurchaseMsg.resetForm()
          vue.$refs.BasicInfo.resetForm()
        })
        .catch((_) => {})
    }

    // getBasicInfo  获取基础信息数据展示
    const getBasicInfo = () => {
      // basicinfo 基础信息部分数据处理
      let basicInfo = {
        msgList: localGet(`goodsDetails${data.id}`).row ? localGet(`goodsDetails${data.id}`).row : {},
        sourceOptions: [],
        operatingOptions: [],
      }

      basicInfo.sourceOptions = localGet('dictCodeList').pro_selection_source
        ? localGet('dictCodeList').pro_selection_source
        : []
      basicInfo.operatingOptions = localGet('dictCodeList').operate_type ? localGet('dictCodeList').operate_type : []

      data.basicInfoObj = basicInfo;
      console.log(data.basicInfoObj,44444444);
    };

    // PurchaseMsg 采购信息部分数据处理
    const getPurchaseMsg = () => {}

    // PriceMsg     计价信息部分数据处理
    const getPriceMsg = () => {
      let priceMsgObj = {
        msgList: localGet(`goodsDetails${data.id}`).row,
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
    const getMsg = (id) => {
      data.id = id
      getNewData()
      /*
        1、没有二次分配的异常数据不能进行操作
        2、进行二次分配并且有异常的数据可以进行操作
      */
      // data.isAbnormal = isAbnormal

      let info = localGet(`goodsDetails${id}`)
      data.isExceptionState = info.row.exceptionState && info.row.exceptionState != ''
      //2021.09.15 赵纪清 将有异常 并且经过二次分配的数据放开上面所有操作
      //用于区分是否经过二次分配
      data.isCompleteAssigned = info.row.isCompleteAssigned == 1 ? true : false
      data.dialogVisible = true
      nextTick(() => {
        // 采购初录
        vue.$refs.PurchaseMsg.getMsg(!data.isDetail, data.id)
      })
      data.activeName = '1'
      data.msgList = info.row
      data.type = info.type
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
    }

    const handleClick = (tab, event) => {
      console.log(vue.$refs.PurchaseMsg, data.activeName)
      if (data.activeName == 3) {
        nextTick(() => {
          vue.$refs.PriceMsg.getMsg()
          vue.$refs.PurchaseMsg.toFather()
          vue.$refs.PriceMsg.getValuation()
          // vue.$refs.PublicTabel.getValuation();
        })
      }
    }
    // 关闭弹窗
    const closeTab = () => {
      data.dialogVisible = false
      getTableData()
      console.log('关闭弹窗')
      data.activeName = '1'
      localRemove(`goodsDetails${data.id}`)
      vue.$refs.PurchaseMsg.resetForm()
      // vue.$refs.BasicInfo.resetForm();
    }

    const netxTip = () => {
      data.activeName = '3'
      handleClick()
    }
    // 提交
    const onSubmit = (draft) => {
      data.btnFlag = true
      nextTick(() => {
        vue.$refs.PurchaseMsg.onSubmit(draft)
        data.btnFlag = false
      })
    }

    // 点击毛利
    const netxTipSend = () => {
      nextTick(() => {
        vue.$refs.PurchaseMsg.netxTipSend()
        data.btnFlag = false
      })
    }

    // 点击异常提交
    const abnormal = () => {
      let goodsState = localGet(`goodsDetails${data.id}`).row.proFirstPurchase
      if (goodsState == 16 || goodsState == 15 || goodsState == 17) {
        nextTick(() => {
          data.logTitle = '确认操作'
          vue.$refs.Abnormal.getMsg({ proId: [data.msgList.id] })
        })
      } else {
        vue.$message({
          type: 'warning',
          message: '不能对该状态数据进行该操作！',
        })
      }
    };

    //计价模拟
    const onPriceImitate = ()=>{
      const { href } = vue.$router.resolve({
            path: '/productEntry/priceImitate/list',
            query: {id:data.basicInfoObj.msgList.id},
        })
        window.open(href, '_blank')
    }
    const getTableData = inject("getTableData");
    provide("closeTab", closeTab);
    provide("netxTip", netxTip);
    const refData = toRefs(data);
    return {
      ...refData,
      handleClose,
      getMsg,
      closeTab,
      handleClick,
      getTableData,
      onSubmit,
      netxTipSend,
      getBasicInfo,
      getPurchaseMsg,
      getPriceMsg,
      disabled,
      abnormal,
      getNewData,
      onPriceImitate
    };
  },
}
</script>
<style lang="scss" scoped></style>
