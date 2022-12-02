<!-- 信息录入 公共表格 -->
<template>
  <div>
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
        <template #default="scope">{{ Number(scope.row.purPrice).toFixed(2) }}</template>
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
          {{ Number(scope.row.weight).toFixed(2) }}
        </template>
      </el-table-column>
    </el-table>
    <span v-for="(item, index) in tableData" :key="index">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
        style="width: 100%"
        class="table_margin"
      >
        <el-table-column label="运输方式" show-overflow-tooltip>
          <template #default="scope">
            <span v-if="disabled || !isDetail">
              <span>{{
                scope.row.transport ? tableTypeComputed(logistics_transport_mode, scope.row.transport) : '-'
              }}</span>
            </span>
            <span v-else>
              <el-select
                v-model="scope.row.transport"
                filterable
                clearable
                size="mini"
                @change="changeTransport"
                placeholder="平台"
              >
                <el-option
                  v-for="item in logistics_transport_mode"
                  :key="item.dizKey"
                  :label="item.value"
                  :value="item.dizKey"
                ></el-option>
              </el-select>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="目的国" show-overflow-tooltip>
          <template #default="scope">
            <span v-if="disabled || !isDetail">
              {{ scope.row.siteName ? scope.row.siteName : '-' }}
            </span>
            <div v-else>
              <el-select
                v-model="scope.row.siteId"
                filterable
                clearable
                size="mini"
                @change="changeSiteId"
                placeholder="目的国"
              >
                <el-option v-for="item in siteOptions" :key="item.id" :label="item.site" :value="item.id"></el-option>
              </el-select>
            </div>
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
              {{ scope.row.profit ? Number(scope.row.profit).toFixed(2) : '-' }}
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="毛利率" show-overflow-tooltip>
          <template #default="scope">
            <div v-if="scope.row.profitRate !== -1" class="color-red">
              {{ scope.row.profitRate ? Number(scope.row.profitRate).toFixed(2) + '%' : '-' }}
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
      </el-table>
    </span>
  </div>
</template>

<script>
import { reactive, toRefs, onBeforeMount, onMounted, getCurrentInstance, nextTick, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { localGet, localSet } from '@/utils/util'
export default {
  name: 'PublicTabel',
  setup(prop, ctx) {
    const data = reactive({
      tableDataDetail: [],
      logistics_transport_mode: [],
      siteOptions: [],
      tableData: [],
      msgList: {},
      loading: true,
      disabled: false,
      costPrice: 0,
      dataUploadMsg: '',
      isDetail: true,
      row: '',
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http
    onBeforeMount(() => {})
    onMounted(() => {
      data.logistics_transport_mode = localGet('dictCodeList').logistics_transport_mode
      // 站点
      data.siteOptions = []
      api.system.getAllSiteList().then((res) => {
        if (res.code == 200) {
          data.siteOptions = res.data
        }
      })
    })
    const refData = toRefs(data)

    const getMsg = (id, row) => {
      data.row = row
      data.msgList = localGet(`goodsDetails${row.id}`).row
      data.tableDataDetail = data.msgList.purchaseDetailVOS
      data.tableData = []
      data.disabled = true
      data.loading = false
      // 三录
      let msg = {
        proId: String(data.msgList.id),
        valuationId: String(id),
      }

      // 获取利润明细
      api.valuation.getDetailMsg(msg).then((res) => {
        if (res.code == 200) {
          data.tableData = [res.data]
        }
      })
    }

    // 获取运费价格总数
    const getCostPrice = (num) => {
      console.log('获取运费价格总数', num)
      data.costPrice = num
    }

    // 根据id获取信息
    const getMsgById = () => {
      data.tableData = []
      data.msgList = localGet(`goodsDetails${data.row.id}`).row
      data.tableDataDetail = localGet(`goodsDetails${data.row.id}`).tableDataDetail

      let msg = {
        id: data.msgList.id,
      }
      api.develop.getDetailById(msg).then((res) => {
        data.msgList = res.data[0]
        if (res.data && res.data[0]) {
          let msg = {
            infoList: [],
            rateId: res.data[0].priceRateId,
            siteId: res.data[0].siteId,
            transport: 1,
            price: Number(data.msgList.referencePrice),
            suggestPrice: Number(data.msgList.suggestPrice),
            costPrice: data.costPrice,
            proId: data.msgList.id,
            proParameter: data.msgList.parameter ? data.msgList.parameter : '无',
          }
          let arr = data.msgList.purchaseDetailVOS
          for (let i = 0; i < arr.length; i++) {
            let info = {
              height: Number(arr[i].height),
              length: Number(arr[i].length),
              purchasePrice: Number(arr[i].purPrice),
              roughWeight: Number(arr[i].weight),
              wide: Number(arr[i].width),
              freight: Number(arr[i].shipping),
            }
            msg.infoList[i] = info
          }
          nextTick(() => {
            getValuation(msg)
          })
        }
        data.tableDataDetail = res.data[0].purchaseDetailVOS
        data.loading = false
      })
    }
    // 修改运输方式
    const changeTransport = (e) => {
      data.dataUploadMsg.transport = Number(e)
      nextTick(() => {
        getValuation(data.dataUploadMsg)
      })
    }

    // 修改目的囯
    const changeSiteId = (e) => {
      data.dataUploadMsg.siteId = e
      nextTick(() => {
        getValuation(data.dataUploadMsg)
      })
    }
    // 计价计算
    const getValuation = (msg) => {
      data.loading = true
      data.tableData = []
      data.msgList = localGet(`goodsDetails${data.row.id}`).row
      data.isDetail = localGet(`goodsDetails${data.row.id}`).isDetail != false
      if (localGet(`goodsDetails${data.row.id}`).type == 6) {
        data.tableDataDetail = localGet('costPriceMsg').tableDataDetail
      }
      if (msg) {
        data.dataUploadMsg = msg
      } else {
        data.dataUploadMsg = localGet('costPriceMsg').msg
      }
      api.valuation.getValuation(data.dataUploadMsg).then((res) => {
        if (res.data.errorMessage !== '') {
          ElMessage.error({
            message: res.data.errorMessage,
            type: 'danger',
          })
        } else {
          console.log(res, data.dataUploadMsg)

          res.data.transport = String(res.data.transport)
          data.tableData = [res.data]
        }
      })
      data.loading = false
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

    return {
      ...refData,
      getMsg,
      getValuation,
      getMsgById,
      changeTransport,
      tableTypeComputed,
      getCostPrice,
      changeSiteId,
    }
  },
}
</script>
<style lang="scss" scoped>
.table_margin {
  margin: 20px 0;
}
</style>
