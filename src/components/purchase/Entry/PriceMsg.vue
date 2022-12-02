<!-- 产品初录计价信息 -->
<template>
  <div>
    <span>
      <el-form title="产品信息" label-width="120px" :inline="true">
        <div>
          <el-form-item label="选品名称：">{{
            priceMsgObj.msgList.productCname ? priceMsgObj.msgList.productCname : '-'
          }}</el-form-item>
        </div>
        <div style="width: 100%">
          <el-form-item label="竞品链接：" style="width: 100% !important">
            <el-link :underline="false" :href="priceMsgObj.msgList.referenceLinking" target="_blank">
              {{ priceMsgObj.msgList.referenceLinking ? priceMsgObj.msgList.referenceLinking : '-' }}
            </el-link>
            <i
              v-if="priceMsgObj.msgList.referenceLinking"
              style="line-height: 40px"
              class="el-icon-document-copy nameHover"
              @click="copyText(priceMsgObj.msgList.referenceLinking)"
            ></i>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="产品最低价："
            >{{ Number(priceMsgObj.msgList.referencePrice).toFixed(2)
            }}{{ priceMsgObj.msgList.priceUnit }}</el-form-item
          >
        </div>
        <div>
          <el-form-item label="产品建议价：">
            <span>{{ Number(priceMsgObj.msgList.suggestPrice).toFixed(2) }}{{ priceMsgObj.msgList.priceUnit }}</span>
          </el-form-item>
        </div>
        <el-form-item label="开发负责人：">
          <span>{{ priceMsgObj.msgList.createUserName ? priceMsgObj.msgList.createUserName : '-' }}</span>
        </el-form-item>
        <el-form-item label="采购负责人：">
          <span>{{ priceMsgObj.msgList.purchaseUserName ? priceMsgObj.msgList.purchaseUserName : '-' }}</span>
        </el-form-item>
        <el-form-item label="选品属性：">
          <!-- <span v-if="priceMsgObj.msgList.purchaseDetailVOS && priceMsgObj.msgList.purchaseDetailVOS.length > 1">组合商品</span>
          <span v-else>单个商品</span> -->
          <!--产品经理要求采购信息与计价信息同步 2021-08-19-->
          <span v-if="tableDataDetail && tableDataDetail.length > 1">组合商品</span>
          <span v-else>单个商品</span>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableDataDetail"
        :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
        border
        style="width: 100%"
        class="cen-tabel"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="productName" label="产品名称" show-overflow-tooltip></el-table-column>
        <el-table-column label="采购价格(CNY)" show-overflow-tooltip>
          <template #default="scope">{{ scope.row.purPrice ? Number(scope.row.purPrice).toFixed(2) : '-' }}</template>
        </el-table-column>
        <el-table-column label="体积(cm3)" show-overflow-tooltip>
          <template #default="scope">
            {{
              Number(scope.row['length']).toFixed(2) +
              '*' +
              Number(scope.row.height).toFixed(2) +
              '*' +
              Number(scope.row.width).toFixed(2)
            }}
          </template>
        </el-table-column>
        <el-table-column label="重量(KG)" show-overflow-tooltip>
          <template #default="scope">
            {{ scope.row.weight ? Number(scope.row.weight).toFixed(2) : '-' }}
          </template>
        </el-table-column>
      </el-table>
      <span v-for="(item, index) in tableData" :key="index">
        <el-table
          v-loading="loading"
          :data="[tableData[index]]"
          border
          :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
          style="width: 100%"
          class="table_margin"
        >
          <el-table-column label="运输方式" show-overflow-tooltip>
            <template #default="scope">
              <span>
                <span>{{
                  scope.row.transport ? tableTypeComputed(priceMsgObj.transportOptions, scope.row.transport) : '-'
                }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="目的国" show-overflow-tooltip>
            <template #default="scope">
              <span>
                {{ scope.row.siteName ? scope.row.siteName : '-' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="汇率" show-overflow-tooltip>
            <template #default="scope">
              <div v-if="scope.row.exchangeRate !== -1">
                {{ scope.row.exchangeRate ? Number(scope.row.exchangeRate).toFixed(2) : '-' }}
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="关税" show-overflow-tooltip v-if="item.transport != 4">
            <template #default="scope">
              <div v-if="scope.row.tariff !== -1">
                {{ scope.row.tariff ? Number(scope.row.tariff).toFixed(2) : '-' }}
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="头程费" show-overflow-tooltip v-if="item.transport != 4">
            <template #default="scope">
              <div v-if="scope.row.firstLegFee !== -1">
                {{ scope.row.firstLegFee ? Number(scope.row.firstLegFee).toFixed(2) : '-' }}
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column :label="item.transport != 4 ? '尾程费' : '直发运费'" show-overflow-tooltip>
            <template #default="scope">
              <div v-if="scope.row.tailLiftFee !== -1">
                {{ scope.row.tailLiftFee ? Number(scope.row.tailLiftFee).toFixed(2) : '-' }}
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="燃油费" show-overflow-tooltip v-if="item.transport != 4">
            <template #default="scope">
              <div v-if="scope.row.fuelCost !== -1">
                {{ scope.row.fuelCost ? Number(scope.row.fuelCost).toFixed(2) : '-' }}
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="平台费" show-overflow-tooltip>
            <template #default="scope">
              <div v-if="scope.row.platformFee !== -1">
                {{ scope.row.platformFee ? Number(scope.row.platformFee).toFixed(2) : '-' }}
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="增值税" show-overflow-tooltip>
            <template #default="scope">
              <div v-if="scope.row.vat !== -1">
                {{ scope.row.vat ? Number(scope.row.vat).toFixed(2) : '-' }}
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="建议售价" min-width="150px" show-overflow-tooltip>
            <template #default="scope">
              <div v-if="scope.row.suggestPrice !== -1">
                {{ (Number(scope.row.suggestPrice) * Number(scope.row.exchangeRate)).toFixed(2) }}CNY/
                {{ Number(scope.row.suggestPrice).toFixed(2) }}{{ scope.row.rateType }}
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="成本价" min-width="150px" show-overflow-tooltip>
            <template #default="scope">
              <div v-if="scope.row.costPrice !== -1">
                {{ Number(scope.row.costPrice).toFixed(2) }}CNY/
                {{ (Number(scope.row.costPrice) / Number(scope.row.exchangeRate)).toFixed(2) }}{{ scope.row.rateType }}
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="毛利润" show-overflow-tooltip>
            <template #default="scope">
              <div v-if="scope.row.profit !== -1">
                {{ Number(scope.row.profit).toFixed(2) }}
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column label="毛利率" show-overflow-tooltip>
            <template #default="scope">
              <div v-if="scope.row.profitRate !== -1" style="color: red">
                {{ Number(scope.row.profitRate).toFixed(2) }}%
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
        </el-table>
      </span>
      <span style="color: rgba(255, 0, 0, 0.8)">
        <span v-for="(item, index) in tableData" :key="item.transport">
          <span v-if="item.transportText && item.transportText != ''">
            {{ item.transportText }}
            <span v-if="index != tableData.length - 1">、</span>
          </span>
        </span>
      </span>
    </span>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  watch,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
  computed,
  nextTick,
  onUnmounted,
} from 'vue'
import { localGet, localSet, documentCopy } from '../../../utils/util'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

export default {
  name: '',
  props: {
    priceMsgObj: {
      type: Object,
    },
    id: String,
  },
  setup(prop, ctx) {
    const data = reactive({
      tableDataDetail: null,
      tableData: [],
      msgList: {},
      isExceptionState: false,
      isCompleteAssigned: false,
      loading: false,
    })
    const store = useStore()
    const disabled = computed(() => store.state.purchase.priceDetailFlag)
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http
    onBeforeMount(() => {})
    onMounted(() => {
      data.tableDataDetail = localGet(`goodsDetails${prop.id}`).row.purchaseDetailVOS
    })
    onUnmounted(() => {
      data.tableDataDetail = null
    })

    watch(
      () => prop.id,
      (val) => {
        data.tableDataDetail = localGet(`goodsDetails${val}`).row.purchaseDetailVOS
      }
    )

    // 计价计算
    const getValuation = (msg) => {
      /*
        2021.9.15 赵纪清
        1、没有异常提交的 并且没有进行二次分配的数据才能进行计价信息展示
        2、如果有异常 那么只有在进行二次分配后才能进行计价信息展示
        3、有异常提交 但是没有二次分配的不进行计价信息展示
      */
      /*
      2021.9.28   18:32:00 注释条件限制
    */
      // if (
      //   (!data.isExceptionState && !data.isCompleteAssigned) ||
      //   (data.isExceptionState && data.isCompleteAssigned) ||
      //   (data.isCompleteAssigned && !data.isExceptionState) ||
      // ) {
      data.loading = true
      data.tableData = []
      if (localGet(`goodsDetails${prop.id}`).type == 6) {
        data.tableDataDetail = localGet('costPriceMsg').tableDataDetail
      }
      if (msg) {
        data.dataUploadMsg = msg
      } else {
        data.dataUploadMsg = localGet('costPriceMsg').msg
      }
      api.valuation.getValuation(data.dataUploadMsg).then((res) => {
        res.data.map((item) => {
          if (item.errorMessage && item.errorMessage != '') {
            // ElMessage.error({
            //   message: item.errorMessage,
            //   type: "danger",
            // });
            console.log(item.errorMessage, item.transport)
            item.transportText =
              item.transport == 1
                ? '海运：' + item.errorMessage
                : item.transport == 2
                ? '铁运：' + item.errorMessage
                : item.transport == 3
                ? '空运：' + item.errorMessage
                : item.transport == 4
                ? '直发：' + item.errorMessage
                : item.transport == 5
                ? '快船：' + item.errorMessage
                : ''
            console.log(data.tableData)
          } else {
            res.data.map((item) => {
              item.transport = String(item.transport)
            })
            data.tableData = res.data
            console.log(data.tableData)
          }
        })
      })
      data.loading = false
      // }
    }

    const getMsg = (id) => {
      data.tableData = []
      data.loading = false
      data.msgList = localGet(`goodsDetails${prop.id}`).row
      data.isExceptionState = data.msgList.exceptionState && data.msgList.exceptionState != ''
      data.isCompleteAssigned = data.msgList.isCompleteAssigned == 1 ? true : false
    }

    // 修改运输方式
    const changeTransport = (e) => {
      data.dataUploadMsg.transport = Number(e)
      store.commit('purchase/setRequestFlag', true)
      localSet('transport', e)
      nextTick(() => {
        getValuation(data.dataUploadMsg)
      })
    }

    // 修改目的囯
    const changeSiteId = (e) => {
      data.dataUploadMsg.siteId = e
      store.commit('purchase/setRequestFlag', true)
      localSet('warehouseId', e)
      nextTick(() => {
        getValuation(data.dataUploadMsg)
      })
    }

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

    // 复制链接
    const copyText = (text) => {
      documentCopy(text)
    }

    const refData = toRefs(data)
    return {
      ...refData,
      getMsg,
      getValuation,
      tableTypeComputed,
      disabled,
      changeTransport,
      changeSiteId,
      copyText,
      // requestFlag
    }
  },
}
</script>
<style scoped lang="scss">
.el-form-item {
  width: 48%;
}
.but-right {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  width: 90%;
}
.urlWidth {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 400px;
  display: block;
}
</style>
