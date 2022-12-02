<!-- 采购信息 -->
<template>
  <div>
    <span>
      <el-form status-icon size="mini" label-width="150px" class="demo-ruleForm">
        <el-form-item label="商品属性:" prop="productAttributes">
          <div v-if="msgList && msgList.purchaseDetailVOS">{{ msgList.purchaseDetailVOS.length > 1 ? "组合商品" : "单个商品" }}
          </div>
          <div v-if="msgList && msgList.purchaseDetailVOS">
            <div v-if="msgList.purchaseDetailVOS.length > 1">
              <el-checkbox v-model="topForm.isCombinedInvoicing" disabled label="是否组合开票" size="small" />
              <el-checkbox v-model="topForm.isSoldSeparately" disabled label="允许单独售卖" size="small" />
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div v-for="(item, index) in msgList.purchaseDetailVOS" :key="index" class="form-border">
        <el-form :model="item" size="mini" :inline="true" class="demo-ruleForm">
          <div style="display:flex">
            <el-form-item label="产品名称:" prop="productName" style="width:22%" label-width="64px">
              <div>{{ item.productName ? item.productName : "-" }}</div>
            </el-form-item>
            <div v-if="msgList.purchaseDetailVOS.length > 1" style='width:30%'>
              <el-checkbox v-model="item.isMainProduct" disabled label="主产品" size="small" />
            </div>
            <el-form-item label-width="65px" label="配套数量:" prop="complementQuantity"
              v-if="msgList.purchaseDetailVOS.length > 1">
              {{ item.complementQuantity ? item.complementQuantity : "-" }}
            </el-form-item>
          </div>
          <div style="width: 100%; display: flex">
            <div style="width: 45.3%; display: flex">
              <el-form-item label="采购单价:" prop="purPrice">
                <div>{{ item.purPrice ? item.purPrice : 0 }}</div>
              </el-form-item>
              <el-form-item prop="shipping" label="运费" style="display: flex">
                <div>{{ item.shipping ? item.shipping : '-' }}</div>
              </el-form-item>
            </div>
            <!-- 新增开票类型 -->
            <div style="display: flex">
              <el-form-item label="开票类型:" prop="invoiceType" label-width="150px" style="display: flex">
                <span style="display: inline-block; width: 90px">{{
                    item.invoiceType ? tableTypeComputed(pro_supplier_invoice, item.invoiceType) : '-'
                }}</span>
              </el-form-item>
              <el-form-item prop="shipping" label="税点:" style="display: flex" label-width="150px">
                <div style="min-width: 40px">{{ item.taxPoint ? item.taxPoint : '-' }}</div>
              </el-form-item>
            </div>
          </div>
          <div style="width: 100%; display: flex">
            <el-form-item label="供应商链接:" style="width: 44.5%" prop="address">
              <span v-if="item.address">
                <el-link :underline="false" class="urlWidth" :href="item.address" target="_blank">{{
                    item.address ? item.address : '-'
                }}</el-link>
                <i v-if="item.address" class="el-icon-document-copy nameHover" @click="copyText(item.address)"></i>
              </span>
              <span v-else>-</span>
            </el-form-item>
            <el-form-item label=" 产品实拍图:">
              <span v-if="item.productUrl && item.productUrl.length">
                <span v-for="(ite, ind) in item.productUrl" :key="ind">
                  <el-popover placement="right" trigger="hover" width="250">
                    <template #reference>
                      <el-image style="width: 180px; height: 95px" fit="contain" :src="ite"></el-image>
                    </template>
                    <el-image :src="ite" style="width: 400px; height: 300px" fit="contain"></el-image>
                  </el-popover>
                </span>
              </span>
              <span v-else>-</span>
            </el-form-item>
          </div>

          <div style="width: 100%; display: flex">
            <el-form-item label="毛重(KG):" prop="weight" style="width: 44.65%">
              <div>{{ item.weight ? item.weight : 0 }}</div>
            </el-form-item>
            <el-form-item label="海外仓重量(KG):" prop="overseasWeight">
              <span>{{ item.overseasWeight ? item.overseasWeight : 0 }}</span>
              <span class="note">毛重X95%</span>
            </el-form-item>
          </div>

          <div style="width: 100%; display: flex">
            <div style="width: 45.7%">
              <el-form-item label="包装尺寸(CM):" style="width: 100%" prop="length">
                {{ item['length'] + '*' + item.width + '*' + item.height }}
              </el-form-item>
              <!-- <el-form-item prop="width">
              <div>{{ item.width ? item.width : 0 }}</div>
            </el-form-item>
            <el-form-item prop="height">
              <div>{{ item.height ? item.height : 0 }}</div>
            </el-form-item> -->
            </div>
            <div>
              <el-form-item label="海外仓包装尺寸(CM):" style="width: 100%" prop="overseasLength">
                {{ item.overseasLength + '*' + item.overseasWidth + ' *' + item.overseasHeight }}
                <span class="note">包装尺寸X95%</span>
              </el-form-item>
              <!-- <el-form-item>
              <div>{{ item.overseasWidth ? item.overseasWidth : 0 }}</div>
            </el-form-item>
            <el-form-item>
              <div>{{ item.overseasHeight ? item.overseasHeight : 0 }}</div>
            </el-form-item> -->
            </div>
          </div>
          <div style="width: 100%; display: flex">
            <!-- 新增产品重量（KG） -->
            <el-form-item label="产品重量(KG):" prop="proWeight" style="width: 45%">
              <div>{{ item.proWeight ? item.proWeight : 0 }}</div>
            </el-form-item>
            <div>
              <!-- 新增产品尺寸(CM) -->
              <el-form-item label="产品尺寸(CM):" style="width: 100%" prop="proLength">
                {{ item.proLength + '*' + item.proWidth + '*' + item.proHeight }}
              </el-form-item>
              <!-- <el-form-item prop="proWidth">
                <div>{{ item.proWidth ? item.proWidth : 0 }}</div>
              </el-form-item>
              <el-form-item prop="proHeight">
                <div>{{ item.proHeight ? item.proHeight : 0 }}</div>
              </el-form-item> -->
            </div>
          </div>
          <div style="width: 100%; display: flex">
            <el-form-item label="是否包含电池:" style="wdith: 45%" prop="cellInclude">
              <div>{{ item.cellInclude == 1 ? '是' : '否' }}</div>
            </el-form-item>
            <el-form-item v-if="item.cellInclude == 1" label="电池型号:" prop="cellModel">
              <div>{{ item.cellModel ? item.cellModel : '-' }}</div>
            </el-form-item>
          </div>

          <div style="width: 100%; display: flex">
            <el-form-item label="产品品牌:" style="width: 45%" prop="brand">
              <div>{{ item.brand ? item.brand : '-' }}</div>
            </el-form-item>
            <el-form-item label="产品侵权:" prop="tort">
              <div>{{ item.tort ? item.tort : '-' }}</div>
            </el-form-item>
          </div>

          <div style="width: 100%; display: flex">
            <!-- 新增包装说明、包装图、（二次包装、装箱规格、产品说明书、产品认证、注意事项） -->
            <el-form-item label="包装说明:" style="width: 45%" prop="packExplain">
              <span>{{ item.packExplain ? item.packExplain : '-' }}</span>
            </el-form-item>
            <el-form-item label="包装图:" prop="packagePhoto">
              <span v-if="item.packagePhoto && item.packagePhoto.length">
                <span v-for="(ite, ind) in item.packagePhoto" :key="ind">
                  <el-popover placement="right" trigger="hover" width="250">
                    <template #reference>
                      <el-image style="width: 180px; height: 95px" fit="contain" :src="ite"></el-image>
                    </template>
                    <el-image :src="ite" style="width: 400px; height: 300px" fit="contain"></el-image>
                  </el-popover>
                </span>
              </span>
              <span v-else>-</span>
            </el-form-item>
          </div>

          <div style="width: 100%; display: flex">
            <el-form-item label="二次包装:" style="width: 45%">
              <span>{{ item.secondPack ? tableTypeComputed(pro_purchase_second_package, item.secondPack) : '-' }}</span>
            </el-form-item>
            <el-form-item label="装箱规格:" prop="specification">
              <span>
                一箱
                <span>
                  {{ item.specification ? item.specification : 0 }}
                </span>

                件
              </span>
            </el-form-item>
          </div>

          <div style="width: 100%; display: flex">
            <el-form-item label="产品说明书:" prop="instructionBook" style="width: 45%">
              <div>{{ item.instructionBook ? item.instructionBook : '-' }}</div>
            </el-form-item>
            <el-form-item label="说明书:" prop="instructionBookFile">
              <div clss="fileListBox" v-if="item.instructionBookFile && item.instructionBookFile != ''">
                <div class="fileItem" v-for="(item, index) in item.instructionBookFile" :key="index">
                  <el-tooltip class="item" effect="dark" content="单击下载文件">
                    <a class="remove-a-Aag fileItem" :href="item.url">
                      <div class="name">{{ item.name }}</div>
                      <div><i class="el-icon-download"></i></div>
                    </a>
                  </el-tooltip>
                </div>
              </div>
              <span v-else>无</span>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="产品认证:" prop="certification">
              <span v-for="(items, index) of item.certification" :key="index">
                {{ tableTypeComputed(pro_purchase_certified, items) }}
                <span v-if="item.certification.length != index + 1">、</span>
              </span>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="注意事项:" prop="announcements">
              <span>{{ item.announcements ? item.announcements : '-' }}</span>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </span>
    <div style="margin-left: 80px" v-if="msgList.exceptionState && msgList.exceptionState != ''">
      <div class="exception-item">
        异常类型：
        <span v-show="msgList.exceptionState == 1">无供应商</span>
        <span v-show="msgList.exceptionState == 2">无量</span>
        <span v-show="msgList.exceptionState == 3">无利</span>
        <!-- <span v-show="msgList.exceptionState == 4">二次分配</span> -->
      </div>
      <div class="exceptionDescription exception-item">
        异常说明：{{
            msgList.exceptionExplain && msgList.exceptionExplain != '' ? msgList.exceptionExplain : '暂无异常说明'
        }}
      </div>
      <div style="display: flex; margin-top: 20px">
        <div style="margin-bottom: 20px; color: red">异常图片：</div>
        <span v-if="msgList.exceptionPic.length > 0">
          <el-image v-for="item in msgList.exceptionPic" :key="item" style="width: 100px; height: 100px" :src="item"
            fit="contain" :preview-src-list="[item]"></el-image>
        </span>
        <span v-else style="color: red">暂无异常图片</span>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onBeforeMount, onMounted, computed, getCurrentInstance, onUnmounted } from 'vue'
import { localGet, documentCopy } from '@/utils/util'
export default {
  name: 'PurchaseMsg',
  setup(prop, ctx) {
    const data = reactive({
      msgList: {},
      pro_supplier_invoice: [], // 开票类型
      pro_purchase_second_package: [], // 二次包装类型
      pro_purchase_package: [], //包装说明
      pro_purchase_certified: [], // 产品认证
      timerOut: null,
      // 如果该产品为采购正常流程，并且是采购异常数据，那么将采购异常图片放在此处
      finalAuditOpinionPicture: [],
      type: "",
      product_manual: [], //产品说明书字典
      topForm: {},
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onUnmounted(() => {
      // 页面销毁  关闭预览图片的计时器
      clearTimeout(data.timerOut)
    })
    onMounted(() => { })

    //产品说明书文字回显
    const getBookText = (e) => {
      let text = ''
      data.product_manual.map((item) => {
        if (item.dizKey == e) {
          text = item.value
        }
      })
      return text
    }

    // 获取信息
    const getMsg = (row) => {
      data.finalAuditOpinionPicture = []
      data.pro_supplier_invoice = localGet('dictCodeList').pro_supplier_invoice
        ? localGet('dictCodeList').pro_supplier_invoice
        : []
      data.pro_purchase_second_package = localGet('dictCodeList').pro_purchase_second_package
        ? localGet('dictCodeList').pro_purchase_second_package
        : []
      data.pro_purchase_package = localGet('dictCodeList').pro_purchase_package
        ? localGet('dictCodeList').pro_purchase_package
        : []
      data.pro_purchase_certified = localGet('dictCodeList').pro_purchase_certified
        ? localGet('dictCodeList').pro_purchase_certified
        : []
      data.product_manual = localGet('dictCodeList').product_manual ? localGet('dictCodeList').product_manual : []
      data.msgList = localGet(`goodsDetails${row.id}`).row
      data.type = localGet(`goodsDetails${row.id}`).type
      data.topForm.isCombinedInvoicing = data.msgList.isCombinedInvoicing == 0 ? false : true
      data.topForm.isSoldSeparately = data.msgList.isSoldSeparately == 0 ? false : true
      if (data.msgList.exceptionState && data.msgList.exceptionState != '') {
        if (data.msgList.exceptionPic && data.msgList.exceptionPic != '') {
          data.msgList.exceptionPic = data.msgList.exceptionPic.split(',')
        }
      }
      if (data.msgList.purchaseDetailVOS && data.msgList.purchaseDetailVOS.length > 0) {
        data.msgList.purchaseDetailVOS.map((item, index) => {
          item.instructionBook = item.instructionBook != '无' ? item.instructionBook : item.instructionBook
          item.productUrl = item.productUrl ? item.productUrl.split(',') : []
          item.packagePhoto = item.packagePhoto ? item.packagePhoto.split(',') : []
          if (item.instructionBookFile && item.instructionBookFile != '') {
            item.instructionBookFile = item.instructionBookFile.split(',')
            if (item.instructionBookFile.length > 0) {
              let fileBookList = []
              item.instructionBookFile.map((i, k) => {
                let obj = {
                  name: '',
                  url: '',
                }
                obj.name = i.substr(i.lastIndexOf('=') + 1)
                obj.url = i.substr(0, i.indexOf('?'))
                fileBookList.push(obj)
              })
              item.instructionBookFile = fileBookList
            }
          }
          item.complementQuantity = item.complementQuantity ? item.complementQuantity : 1
        });
      }
      if (data.msgList.purchaseDetailVOS.length > 0) {
        for (let i = 0; i < data.msgList.purchaseDetailVOS.length; i++) {
          data.msgList.purchaseDetailVOS[i].certification = data.msgList.purchaseDetailVOS[i].certification
            ? data.msgList.purchaseDetailVOS[i].certification.split(',')
            : ['7']
        }
      }
      console.log(data.msgList.purchaseDetailVOS)
    }
    const refData = toRefs(data)
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

    // 复制链接
    const copyText = (text) => {
      documentCopy(text)
    }

    return {
      ...refData,
      getMsg,
      tableTypeComputed,
      copyText,
      // handleClickItem,
    }
  },
}
</script>
<style lang="scss" scoped>
.formDis {
  display: flex;

  .el-form-item {
    width: 12%;
  }

  .el-form-item:first-child {
    width: 25%;
  }

  .taxPoint {
    position: relative;
  }

  .taxPoint::after {
    position: absolute;
    right: -20px;
    content: '%';
    display: inline-block;
  }
}

.el-form-item {
  width: 48%;

  .fileListBox {
    width: 100%;

    .fileItem {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 2px 0;
      font-size: 12px;
      align-items: center;
    }

    .fileItem:hover {
      background-color: #f5f7fa;
      color: #409eff;
    }
  }
}

.note {
  margin-left: 10px;
  font-size: 10px;
  line-height: 25px;
  color: #afaaaa;
}

.form-border {
  border-top: 1px solid rgb(197, 196, 196);
  padding-top: 20px;
}
</style>
<style>
.fileListBox {
  width: 100%;
}

.fileItem:hover {
  background-color: #f5f7fa;
  color: #409eff;
}

.fileItem {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 2px 0;
  font-size: 12px;
  align-items: center;
}

.fileItem>.name {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 80%;
}

.exception-item {
  height: 40px;
  line-height: 40px;
  color: red;
}
</style>
