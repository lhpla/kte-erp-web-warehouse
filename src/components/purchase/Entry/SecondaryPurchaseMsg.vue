<!-- 采购信息 -->
<template>
  <div>
    <span>
      <el-form
        :model="topForm"
        status-icon
        :rules="rules"
        ref="topFormRef"
        size="mini"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品属性:" prop="productAttributes">
          <div v-if="disabled">{{ topForm.productAttributes == 1 ? '单个商品' : '组合商品' }}</div>
          <span v-else>
            <el-radio v-model="topForm.productAttributes" label="1">单个商品</el-radio>
            <el-radio v-model="topForm.productAttributes" label="2">组合商品</el-radio>
          </span>
        </el-form-item>
      </el-form>
      <div v-for="(item, index) in ruleForm" :key="index" class="form-border">
        <!-- :ref="item.purchaseForm" -->
        <el-form
          :model="item"
          :disabled="disabled"
          size="mini"
          :inline="true"
          :rules="rules"
          :ref="item.purchaseForm"
          label-width="150px"
          class="demo-ruleForm"
        >
          <el-button
            v-if="!disabled && index !== 0"
            class="del-productAttributes"
            icon="el-icon-delete"
            @click="delAttribut(index, item.id)"
            type="text"
            >删除</el-button
          >
          <div>
            <el-form-item label="产品名称:" prop="productName">
              <div v-if="disabled">{{ item.productName ? item.productName : '-' }}</div>
              <el-input v-else v-model="item.productName" clearable></el-input>
            </el-form-item>
          </div>
          <div style="width: 100%; display: flex">
            <div style="width: 70%; display: flex">
              <el-form-item label="采购单价:" prop="purPrice" style="width: 70%">
                <div v-if="disabled">{{ item.purPrice ? item.purPrice : 0 }}</div>
                <el-input v-else v-model.trim="item.purPrice" class="size-width100" clearable></el-input>
              </el-form-item>
              <el-form-item prop="shipping" label="运费" style="display: flex" label-width="100px">
                <div v-if="disabled">{{ item.shipping ? item.shipping : 0 }}</div>
                <el-input
                  v-else
                  placeholder="运费"
                  class="size-width"
                  v-model.trim="item.shipping"
                  clearable
                ></el-input>
              </el-form-item>
            </div>
            <el-form-item label="开票类型:" prop="invoiceType" label-width="203px" style="display: flex">
              <span v-if="disabled">{{
                item.invoiceType ? tableTypeComputed(pro_supplier_invoice, item.invoiceType) : '-'
              }}</span>
              <el-select
                v-else
                filterable
                clearable
                v-model="item.invoiceType"
                placeholder="请选择开票类型"
                style="width: 140px"
              >
                <el-option
                  v-for="item in pro_supplier_invoice"
                  :key="item.dizKey"
                  :label="item.value"
                  :value="item.dizKey"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="taxPoint" label="税点" label-width="70px">
              <div v-if="disabled" style="min-width: 40px">{{ item.taxPoint ? item.taxPoint : 0 }}</div>
              <el-input
                v-else
                placeholder="税点"
                clearable
                class="size-width60 taxPoint"
                v-model.trim="item.taxPoint"
              ></el-input>
            </el-form-item>
          </div>
          <div style="width: 100%; display: flex">
            <el-form-item label="供应商链接:" style="width: 45%" prop="address">
              <span v-if="disabled">
                <el-link :underline="false" class="urlWidth" :href="item.address" target="_blank">{{
                  item.address ? item.address : '-'
                }}</el-link>
                <i v-if="item.address" class="el-icon-document-copy nameHover" @click="copyText(item.address)"></i>
              </span>
              <span v-else>
                <el-input v-model="item.address" clearable></el-input>
                <br />
                <span class="note">可输入供应商链接或采购产品链接</span>
              </span>
            </el-form-item>
            <el-form-item label=" 产品实拍图:" @click="changeImgIndex(index, 'productUrl')" prop="productUrl">
              <span v-if="disabled">
                <span v-if="item.productUrl.length > 0">
                  <span v-for="(url, ind) in item.productUrl" :key="ind">
                    <el-popover placement="right" trigger="hover" width="250">
                      <template #reference>
                        <el-image style="height: 95px" fit="contain" :src="url"></el-image>
                      </template>
                      <el-image :src="url" style="width: 400px; height: 300px" fit="contain"></el-image>
                    </el-popover>
                  </span>
                </span>
                <span v-else>-</span>
              </span>
              <span v-else>
                <span class="commonNote">仅支持上传jpg/png格式文件，单个文件不能超过5M</span>
                <UploadFilePurchase
                  :ref="'productUrl' + (index + 1)"
                  @clickFu="receive"
                  @removeImg="removeImg($event, 'productUrl')"
                ></UploadFilePurchase>
              </span>
            </el-form-item>
          </div>
          <div style="width: 100%; display: flex">
            <el-form-item label="毛重(KG):" prop="weight" style="width: 45%">
              <div v-if="disabled">{{ item.weight ? item.weight : 0 }}</div>
              <el-input v-else v-model.trim="item.weight" clearable @blur="calculate(item.weight, 1, index)"></el-input>
            </el-form-item>
            <el-form-item label="海外仓重量(KG):" prop="overseasWeight">
              <span v-if="disabled">{{ item.overseasWeight ? item.overseasWeight : 0 }}</span>
              <el-input v-else v-model.trim="item.overseasWeight" clearable :disabled="true"></el-input>
              <span class="note">毛重X95%</span>
            </el-form-item>
          </div>
          <div style="width: 100%; display: flex" class="form-items-width">
            <div style="width: 45%">
              <el-form-item label="包装尺寸(CM):" prop="length">
                <div v-if="disabled">{{ item['length'] + '*' + item.width + '*' + item.height }}</div>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="海外仓包装尺寸(CM):" prop="overseasLength" label-width="160px">
                <div v-if="disabled">
                  {{ item.overseasLength + '*' + item.overseasWidth + '*' + item.overseasHeight }}
                  <span class="note">包装尺寸X95%</span>
                </div>
              </el-form-item>
            </div>
          </div>
          <div style="width: 100%; display: flex">
            <div style="width: 45%">
              <el-form-item label="产品重量(KG):" prop="proWeight">
                <div v-if="disabled">{{ item.proWeight ? item.proWeight : 0 }}</div>
                <el-input clearable v-else v-model.trim="item.proWeight" placeholder="请输入重量"></el-input>
              </el-form-item>
            </div>
            <div class="form-items-width">
              <el-form-item label="产品尺寸(CM):" prop="proLength" label-width="160px">
                <div v-if="disabled">{{ item.proLength + '*' + item.proWidth + '*' + item.proHeight }}</div>
              </el-form-item>
            </div>
          </div>

          <div style="width: 100%; display: flex">
            <el-form-item label="是否包含电池:" prop="cellInclude" style="width: 45%">
              <div v-if="disabled">{{ item.cellInclude == 1 ? '是' : '否' }}</div>
              <span v-else>
                <el-radio v-model="item.cellInclude" label="1">是</el-radio>
                <el-radio v-model="item.cellInclude" label="2">否</el-radio>
              </span>
            </el-form-item>
            <el-form-item v-if="item.cellInclude == 1" label="电池型号:" prop="cellModel">
              <div v-if="disabled">{{ item.cellModel ? item.cellModel : '-' }}</div>
              <el-input v-else v-model="item.cellModel" clearable placeholder=""></el-input>
            </el-form-item>
          </div>
          <div style="width: 100%; display: flex">
            <el-form-item label="产品品牌:" prop="brand" style="width: 45%">
              <div v-if="disabled">{{ item.brand ? item.brand : '-' }}</div>
              <el-input clearable v-else v-model="item.brand" placeholder="无"></el-input>
            </el-form-item>
            <el-form-item label="产品侵权:" prop="tort">
              <div v-if="disabled">{{ item.tort ? item.tort : '-' }}</div>
              <el-input clearable v-else v-model="item.tort" placeholder="无"></el-input>
            </el-form-item>
          </div>
          <div style="width: 100%; display: flex">
            <el-form-item label="包装说明:" prop="packExplain" style="width: 45%">
              <span v-if="disabled">{{ item.packExplain ? item.packExplain : '-' }}</span>
              <el-select
                v-else
                filterable
                clearable
                v-model="item.packExplain"
                placeholder="请选择"
                collapse-tags
                :allow-create="true"
                :remote="true"
                reserve-keyword
              >
                <el-option
                  v-for="item in pro_purchase_package"
                  :key="item.dizKey"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="包装图:" @click="changeImgIndex(index, 'packagePhoto')" prop="packagePhoto">
              <span v-if="disabled">
                <span v-if="item.packagePhoto.length > 0">
                  <span v-for="(url, ind) in item.packagePhoto" :key="ind">
                    <el-popover placement="right" trigger="hover" width="250">
                      <template #reference>
                        <el-image style="height: 95px" fit="contain" :src="url"></el-image>
                      </template>
                      <el-image :src="url" style="width: 400px; height: 300px" fit="contain"></el-image>
                    </el-popover>
                  </span>
                </span>
                <span v-else>-</span>
              </span>
              <span v-else>
                <span class="commonNote">仅支持上传jpg/png格式文件，单个文件不能超过5M</span>
                <UploadFilePurchase
                  :ref="'packagePhoto' + (index + 1)"
                  @clickFu="receive"
                  @removeImg="removeImg($event, 'packagePhoto')"
                ></UploadFilePurchase>
              </span>
            </el-form-item>
          </div>
          <div style="width: 100%; display: flex">
            <el-form-item label="二次包装:">
              <span v-if="disabled">{{
                item.secondPack ? tableTypeComputed(pro_purchase_second_package, item.secondPack) : '-'
              }}</span>
              <el-select v-else v-model="item.secondPack" filterable clearable placeholder="请选择">
                <el-option
                  v-for="item in pro_purchase_second_package"
                  :key="item.dizKey"
                  :label="item.value"
                  :value="item.dizKey"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="装箱规格:" label-width="115px" prop="specification">
              <span>
                一箱
                <span v-if="disabled">
                  {{ item.specification ? item.specification : 0 }}
                </span>
                <el-input v-else v-model.trim="item.specification" class="size-width"></el-input>
                件
              </span>
            </el-form-item>
          </div>
          <div style="width: 100%; display: flex">
            <el-form-item label="产品说明书:" prop="instructionBook" style="width: 45%">
              <div v-if="disabled">{{ item.instructionBook ? item.instructionBook : '-' }}</div>
              <el-select
                v-else
                filterable
                clearable
                v-model="item.instructionBook"
                placeholder="请选择"
                collapse-tags
                :allow-create="true"
                :remote="true"
                reserve-keyword
              >
                <el-option
                  v-for="item in product_manual"
                  :key="item.dizKey"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="说明书:" prop="instructionBookFile">
              <NewUploadFile
                @pushFile="pushFile($event, index)"
                :circle="!disabled"
                @removeFileBook="removeFileBook($event, index)"
                :ref="'NewUploadFile' + index"
              ></NewUploadFile>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="产品认证:" prop="certification">
              <el-checkbox-group
                v-model="item.certification"
                @change="certificationChange(item.certification)"
                false-label
              >
                <el-checkbox
                  v-for="(ite, ind) of pro_purchase_certified"
                  :label="ite.dizKey"
                  :key="ind"
                  @click="checkBoxEd(ite, index)"
                  >{{ ite.value }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="注意事项:" prop="announcements">
              <span v-if="disabled">{{ item.announcements ? item.announcements : '-' }}</span>
              <el-input
                v-else
                type="textarea"
                placeholder="请输入内容"
                v-model="item.announcements"
                :rows="3"
                show-word-limit
                maxlength="100"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div v-if="topForm.productAttributes == 2 && !disabled" class="addnew" size="mini" @click="addFrom">
        <el-button type="primary">新增组合商品</el-button>
      </div>
    </span>
    <div v-if="msgList.exceptionState && msgList.exceptionState != ''" style="margin-left: 80px">
      <div class="exceptionState-item">
        异常类型：
        <span v-show="msgList.exceptionState == 1">无供应商</span>
        <span v-show="msgList.exceptionState == 2">无量</span>
        <span v-show="msgList.exceptionState == 3">无利</span>
        <span v-show="msgList.exceptionState == 4">二次分配</span>
      </div>
      <div class="exceptionDescription exceptionState-item">
        异常说明：{{
          msgList.exceptionExplain && msgList.exceptionExplain != '' ? msgList.exceptionExplain : '暂无异常说明'
        }}
      </div>
      <div style="display: flex; margin-top: 20px">
        <div style="margin-bottom: 20px; color: red">异常图片：</div>
        <span v-if="msgList.exceptionPic.length > 0">
          <el-image
            v-for="item in msgList.exceptionPic"
            :key="item"
            style="width: 100px; height: 100px"
            :src="item"
            fit="contain"
            :preview-src-list="[item]"
          ></el-image>
        </span>
        <span v-else style="color: red">暂无异常图片</span>
      </div>
    </div>
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
  ref,
  inject,
  nextTick,
  provide,
  native,
  onUnmounted,
} from 'vue'
import { ElMessage } from 'element-plus'
import { localGet, localSet, documentCopy } from '../../../utils/util'
import UploadFilePurchase from '../../uploadFile/UploadFilePurchase.vue'
import { useStore } from 'vuex'
import NewUploadFile from '../../uploadFile/NewUploadFile.vue'

export default {
  name: 'PurchaseMsg',
  props: ['purchaseMsg', 'id'],
  components: {
    UploadFilePurchase,
    NewUploadFile,
  },
  setup(prop, ctx) {
    const data = reactive({
      topForm: {
        productAttributes: '1',
      },
      product_manual: [], //产品说明书字典
      ruleForm: [
        {
          purchaseForm: 'purchaseForm1',
          productName: '',
          purPrice: 0,
          shipping: 0,
          address: '',
          weight: '',
          overseasWeight: '',
          length: '',
          width: '',
          height: '',
          overseasLength: '',
          overseasWidth: '',
          overseasHeight: '',
          invoiceType: '2',
          taxPoint: '',
          internalRepoId: '',
          announcements: '',
          packExplain: '',
          packagePhoto: '',
          secondPack: '',
          specification: 1,
          tort: '无',
          brand: '无',
          patent: '无',
          certification: ['7'],
          instructionBook: '无',
          instructionBookFile: '',
          ce: '无',
          quality: 0,
          productUrl: '',
          purchaseAttaches: [],
          proWidth: '',
          proLength: '',
          proWeight: '',
          proHeight: '',
          id: '',
          cellInclude: '2',
          cellModel: '',
        },
      ],
      checkEdFalg: true, //当前产品认证有没有 选中无选项
      rules: {
        productAttributes: [{ required: true, message: '请选择商品属性', trigger: 'blur' }],
        productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { max: 200, message: '产品名称长度不超过200位字符', trigger: 'change' },
        ],
        purPrice: [
          { required: true, message: '请输入采购单价', trigger: 'blur' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '输入异常，请重新输入',
          },
        ],
        weight: [
          { required: true, message: '请输入毛重', trigger: 'blur' },
          { max: 8, message: '长度不超过8字符', trigger: 'change' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '输入异常，请重新输入',
          },
        ],
        length: [
          { required: true, message: '请输入长', trigger: 'blur' },
          { max: 8, message: '长度不超过8字符', trigger: 'change' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '输入异常，请重新输入',
          },
        ],
        width: [
          { required: true, message: '请输入宽', trigger: 'blur' },
          { max: 8, message: '长度不超过8字符', trigger: 'change' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '输入异常，请重新输入',
          },
        ],
        height: [
          { required: true, message: '请输入高', trigger: 'blur' },
          { max: 8, message: '长度不超过8字符', trigger: 'change' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '输入异常，请重新输入',
          },
        ],
        // 新增产品重量、长度、宽、高、开票类型  验证规则
        proWeight: [
          { message: '请输入产品重量', trigger: 'blur' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '输入异常，请重新输入',
          },
        ],
        proLength: [
          { message: '请输入长', trigger: 'blur' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '输入异常，请重新输入',
          },
        ],
        proWidth: [
          { message: '请输入宽', trigger: 'blur' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '输入异常，请重新输入',
          },
        ],
        proHeight: [
          { message: '请输入高', trigger: 'blur' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '输入异常，请重新输入',
          },
        ],
        invoiceType: [{ required: true, message: '请选择开票类型', trigger: 'blur' }],
        taxPoint: [
          { message: '输入异常，请重新输入', trigger: 'blur' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '输入异常，请重新输入',
          },
        ],

        purMinNum: [
          {
            validator: (rule, value, callback) => {
              let ret = /^([0-9]*)$/
              if (!ret.test(value)) {
                callback(new Error('输入异常，请重新输入'))
              } else {
                callback()
              }
            },
            trigger: 'change',
          },
        ],
        instructionBook: [{ required: true, message: '请输入产品说明书', trigger: 'blur' }],
        packExplain: [{ required: true, message: '请选择包装说明', trigger: 'blur' }],
        tort: [{ required: true, message: '请说明产品侵权相关信息', trigger: 'blur' }],
        brand: [{ required: true, message: '请说明产品品牌相关信息', trigger: 'blur' }],
        cellInclude: [{ required: true, message: '是否包含电池', trigger: 'blur' }],
        cellModel: [{ required: true, message: '请输入电池型号', trigger: 'blur' }],
        secondPack: [{ required: true, message: '请选择二次包装说明', trigger: 'blur' }],
        certification: [{ required: true, message: '请选择产品认证', trigger: 'blur' }],
        announcements: [{ max: 100, message: '注意事项长度不超过100位字符' }],
        specification: [
          { required: true, message: '请选择装箱规格', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              let ret = /^([0-9]*)$/
              if (!ret.test(value)) {
                callback(new Error('输入整数'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
      },
      product_manual: [], // 包装说明书字典
      msgList: {},
      disabled: false,
      purchaseDetaiList: [],
      tableObj: {
        exp: '',
        item: '',
      },
      pro_supplier_invoice: [], // 开票类型
      pro_purchase_package: [], // 包装类型
      pro_purchase_second_package: [], // 二次包装类型
      pro_purchase_certified: [], // 产品认证
      sourceOptions: [], // 国内仓
      imgIndex: 0,
      imgName: '',
      sendMsg: '',
      newArr: [],
      timerOut: null,
      // 异常状态中异常图片
      finalAuditOpinionPicture: [],
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http
    const store = useStore()
    const disabled = computed(() => store.state.purchase.priceDetailFlag)
    const requestFlag = computed(() => store.state.purchase.requestFlag)

    const topFormRef = ref(null)
    onBeforeMount(() => {})
    onUnmounted(() => {
      // 页面销毁  关闭预览图片的计时器
      clearTimeout(data.timerOut)
    })
    onMounted(() => {})

    //产品说明书字典文字转换
    const getBookText = (e) => {
      let text = ''
      data.product_manual.map((item) => {
        if (item.dizKey == e) {
          text = item.value
        }
      })
      return text
    }

    // pushFile 获取文件上传成功的文件路径
    const pushFile = (e, index) => {
      console.log(e)
      let arr = []
      if (e && e.length > 0) {
        e.map((item, index) => {
          item.link = item.url + '?name=' + item.name
          arr.push(item.link)
        })
        data.ruleForm.map((ite, ind) => {
          if (index == ind) {
            ite.instructionBookFile = arr
          }
        })
      }
    }

    // removeFileBook 删除文件（说明书）
    const removeFileBook = (e, index) => {
      let arr = []
      if (e && e.length > 0) {
        e.map((k, o) => {
          k.link = k.url + '?name=' + k.name
          arr.push(k.link)
        })
      }
      data.ruleForm.map((i, k) => {
        if (k == index) {
          i.instructionBookFile = arr.length > 0 ? arr.join(',') : ''
        }
      })
    }

    // 传父
    const toFather = (type) => {
      let num = 0
      for (let item of data.ruleForm) {
        num += Number(item.purPrice) + Number(item.shipping)
      }
      let msg = {
        infoList: [{}],
        rateId: data.msgList.priceRateId, // res.data[0].priceRateId
        siteId: data.msgList.siteId, // res.data[0].siteId
        transport: 1,
        price: Number(data.msgList.referencePrice),
        suggestPrice: Number(data.msgList.suggestPrice),
        costPrice: num,
        proId: data.msgList.id,
        proParameter: data.msgList.parameter ? data.msgList.parameter : '无',
      }
      let arr = data.ruleForm
      let tableDataDetail = []
      for (let i = 0; i < arr.length; i++) {
        let info = {
          height: Number(arr[i].height),
          length: Number(arr[i].length),
          purchasePrice: Number(arr[i].purPrice),
          roughWeight: Number(arr[i].weight),
          wide: Number(arr[i].width),
          freight: Number(arr[i].shipping),
        }

        let obj = {
          productName: arr[i].productName ? arr[i].productName.trim() : '',
          purPrice: Number(arr[i].purPrice),
          priceUnit: data.msgList.priceUnit,
          length: Number(arr[i].length),
          height: Number(arr[i].height),
          width: Number(arr[i].width),
          weight: Number(arr[i].weight),
        }
        msg.infoList[i] = info
        tableDataDetail[i] = obj
      }
      let upImg = {
        msg: msg,
        tableDataDetail: tableDataDetail,
      }
      localSet('costPriceMsg', upImg)
    }

    // 获取信息
    const getMsg = (disabled) => {
      data.pro_supplier_invoice = localGet('dictCodeList').pro_supplier_invoice
        ? localGet('dictCodeList').pro_supplier_invoice
        : []
      data.pro_purchase_package = localGet('dictCodeList').pro_purchase_package
        ? localGet('dictCodeList').pro_purchase_package
        : []
      data.product_manual = localGet('dictCodeList').product_manual ? localGet('dictCodeList').product_manual : []
      data.pro_purchase_second_package = localGet('dictCodeList').pro_purchase_second_package
        ? localGet('dictCodeList').pro_purchase_second_package
        : []
      data.pro_purchase_certified = localGet('dictCodeList').pro_purchase_certified
        ? localGet('dictCodeList').pro_purchase_certified
        : []
      data.msgList = localGet(`goodsDetails${prop.id}`).row
      data.msgList.exceptionPic =
        data.msgList.exceptionPic && data.msgList.exceptionPic != '' ? data.msgList.exceptionPic.split(',') : []
      if (data.msgList) {
        data.topForm.productAttributes = data.msgList.purchaseDetailVOS.length > 1 ? '2' : '1'
        if (data.msgList.purchaseDetailVOS.length > 0) {
          let purchaseDetailVOS = data.msgList.purchaseDetailVOS
          let detail = []
          for (let i = 0; i < purchaseDetailVOS.length; i++) {
            purchaseDetailVOS[i].instructionBook =
              purchaseDetailVOS[i].instructionBook != '无'
                ? purchaseDetailVOS[i].instructionBook
                : purchaseDetailVOS[i].instructionBook
            let infoMsg = {
              purchaseForm: 'purchaseForm1',
              productName: '',
              purPrice: '',
              shipping: 0,
              address: '',
              weight: '',
              overseasWeight: '',
              length: '',
              width: '',
              height: '',
              overseasLength: '',
              overseasWidth: '',
              overseasHeight: '',
              invoiceType: '2',
              taxPoint: '',
              internalRepoId: '',
              announcements: '',
              packExplain: '',
              packagePhoto: '',
              productUrl: '',
              specification: 1,
              tort: '无',
              brand: '无',
              patent: '无',
              certification: ['7'],
              instructionBook: '无',
              instructionBookFile: '无',
              ce: '无',
              quality: 0,
              proWidth: '',
              proLength: '',
              proWeight: '',
              proHeight: '',
              id: '',
              cellInclude: '2',
              cellModel: '',
            }
            infoMsg.purchaseForm = 'purchaseForm' + (i + 1)
            infoMsg.productName = purchaseDetailVOS[i].productName
            infoMsg.shipping =
              Number(purchaseDetailVOS[i].shipping).toFixed(2) > 0
                ? Number(purchaseDetailVOS[i].shipping).toFixed(2)
                : 0
            infoMsg.purPrice = Number(purchaseDetailVOS[i].purPrice).toFixed(2)
            infoMsg.address = purchaseDetailVOS[i].address
            infoMsg.tort = purchaseDetailVOS[i].tort
            infoMsg.weight = Number(purchaseDetailVOS[i].weight).toFixed(2)
            infoMsg.overseasWeight =
              purchaseDetailVOS[i].overseasWeight == -1 ? '0' : Number(purchaseDetailVOS[i].overseasWeight).toFixed(2)
            infoMsg.length = Number(purchaseDetailVOS[i].length).toFixed(2)
            infoMsg.width = Number(purchaseDetailVOS[i].width).toFixed(2)
            infoMsg.height = Number(purchaseDetailVOS[i].height).toFixed(2)
            infoMsg.overseasLength =
              purchaseDetailVOS[i].overseasLength == -1 ? '0' : Number(purchaseDetailVOS[i].overseasLength).toFixed(2)
            infoMsg.overseasWidth =
              purchaseDetailVOS[i].overseasWidth == -1 ? '0' : Number(purchaseDetailVOS[i].overseasWidth).toFixed(2)
            infoMsg.overseasHeight =
              purchaseDetailVOS[i].overseasHeight == -1 ? '0' : Number(purchaseDetailVOS[i].overseasHeight).toFixed(2)
            infoMsg.instructionBook = purchaseDetailVOS[i].instructionBook ? purchaseDetailVOS[i].instructionBook : '无'
            infoMsg.instructionBookFile = purchaseDetailVOS[i].instructionBookFile
              ? purchaseDetailVOS[i].instructionBookFile.split(',')
              : []
            infoMsg.brand = purchaseDetailVOS[i].brand ? purchaseDetailVOS[i].brand : '无'
            infoMsg.cellInclude = purchaseDetailVOS[i].cellInclude ? String(purchaseDetailVOS[i].cellInclude) : '2'
            infoMsg.cellModel = purchaseDetailVOS[i].cellModel ? purchaseDetailVOS[i].cellModel : ''
            infoMsg.id = purchaseDetailVOS[i].id
            // 新增产品重量、长度、宽度、高度、开票类型、税点
            infoMsg.proWidth =
              Number(purchaseDetailVOS[i].proWidth) < 0 ? '' : Number(purchaseDetailVOS[i].proWidth).toFixed(2)
            infoMsg.proLength =
              Number(purchaseDetailVOS[i].proLength) < 0 ? '' : Number(purchaseDetailVOS[i].proLength).toFixed(2)
            infoMsg.proWeight =
              Number(purchaseDetailVOS[i].proWeight) < 0 ? '' : Number(purchaseDetailVOS[i].proWeight).toFixed(2)
            infoMsg.proHeight =
              Number(purchaseDetailVOS[i].proHeight) < 0 ? '' : Number(purchaseDetailVOS[i].proHeight).toFixed(2)
            infoMsg.invoiceType = purchaseDetailVOS[i].invoiceType < 0 ? '2' : purchaseDetailVOS[i].invoiceType
            infoMsg.taxPoint =
              Number(purchaseDetailVOS[i].taxPoint) < 0 ? 0 : Number(purchaseDetailVOS[i].taxPoint).toFixed(2)
            infoMsg.packExplain = String(purchaseDetailVOS[i].packExplain)
            infoMsg.packagePhoto = purchaseDetailVOS[i].packagePhoto ? purchaseDetailVOS[i].packagePhoto.split(',') : [] //
            infoMsg.productUrl = purchaseDetailVOS[i].productUrl ? purchaseDetailVOS[i].productUrl.split(',') : []
            infoMsg.secondPack = purchaseDetailVOS[i].secondPack
            infoMsg.specification = purchaseDetailVOS[i].specification
            infoMsg.announcements = purchaseDetailVOS[i].announcements
            infoMsg.certification = purchaseDetailVOS[i].certification
              ? purchaseDetailVOS[i].certification.split(',')
              : ['7']
            detail.push(infoMsg)
          }
          data.ruleForm = detail
          for (let ind = 0; ind < data.ruleForm.length; ind++) {
            let fileBookList = []
            if (data.ruleForm[ind].instructionBookFile && data.ruleForm[ind].instructionBookFile.length > 0) {
              data.ruleForm[ind].instructionBookFile.map((ite, iteInd) => {
                let obj = {
                  name: '',
                  url: '',
                }
                obj.name = ite.substr(ite.lastIndexOf('=') + 1)
                obj.url = ite.substr(0, ite.indexOf('?'))
                fileBookList.push(obj)
              })
              nextTick(() => {
                vue.$refs['NewUploadFile' + ind][0].getFileList(fileBookList)
              })
            } else {
              nextTick(() => {
                vue.$refs['NewUploadFile' + ind][0].getFileList([])
              })
            }

            let item = data.ruleForm[ind]
            nextTick(() => {
              let file = {
                fileList: [],
                pathName: 'warehouse/purchase/purchaseChild/firstRecord/productUrl/img',
              }
              if (item.productUrl.length > 0) {
                for (let pUrl of item.productUrl) {
                  let obj = {
                    url: pUrl,
                  }
                  file.fileList.push(obj)
                }
              }

              let file2 = {
                fileList: [],
                pathName: 'warehouse/purchase/purchaseChild/firstRecord/packagePhoto/img',
              }
              if (item.packagePhoto.length > 0) {
                for (let pUrl of item.packagePhoto) {
                  let obj = {
                    url: pUrl,
                  }
                  file2.fileList.push(obj)
                }
              }
              nextTick(() => {
                if (vue.$refs['productUrl' + (ind + 1)]) {
                  vue.$refs['productUrl' + (ind + 1)][0].getImgMsg(file)
                }
                if (vue.$refs['packagePhoto' + (ind + 1)]) {
                  vue.$refs['packagePhoto' + (ind + 1)][0].getImgMsg(file2)
                }
              })
            })
          }
        } else {
          data.ruleForm = [
            {
              purchaseForm: 'purchaseForm1',
              productName: '',
              purPrice: '',
              shipping: 0,
              address: '',
              weight: '',
              overseasWeight: '',
              length: '',
              width: '',
              height: '',
              overseasLength: '',
              overseasWidth: '',
              overseasHeight: '',
              invoiceType: '2',
              taxPoint: '',
              internalRepoId: '',
              announcements: '',
              packExplain: '',
              packagePhoto: [],
              specification: 1,
              tort: '无',
              brand: '无',
              patent: '无',
              certification: ['7'],
              instructionBook: '无',
              instructionBookFile: '',
              ce: '无',
              quality: 0,
              productUrl: [],
              proWidth: '',
              proLength: '',
              proWeight: '',
              proHeight: '',
              id: '',
              cellInclude: '2',
              cellModel: '',
            },
          ]
          let file = {
            fileList: [],
            pathName: 'warehouse/purchase/purchaseChild/firstRecord/productUrl/img',
          }
          data.ruleForm.map((ite, ind) => {
            if (vue.$refs['productUrl' + (ind + 1)]) {
              nextTick(() => {
                vue.$refs['productUrl' + (ind + 1)].getImgMsg(file)
              })
            }
          })

          let file2 = {
            fileList: [],
            pathName: 'warehouse/purchase/purchaseChild/firstRecord/packagePhoto/img',
          }
          data.ruleForm.map((ite, ind) => {
            if (vue.$refs['packagePhoto' + (ind + 1)]) {
              nextTick(() => {
                vue.$refs['packagePhoto' + (ind + 1)].getImgMsg(file2)
              })
            }
          })

          data.ruleForm.map((item) => {
            item.productName = data.msgList.productCname
          })
        }
      }
    }
    // 移除图片
    const removeImg = (fileList, name) => {
      let arr = []
      if (fileList.length) {
        fileList.map((item) => {
          arr.push(item.url)
        })
      }
      data.ruleForm[data.imgIndex][name] = arr
    }

    // 上传文件
    const uploadTrigger = (name, index) => {
      let info = {
        type: name,
        index: index,
        pathName: 'warehouse/purchase/purchaseChild/firstRecord/file',
      }
      vue.$refs.UploadFile.uploadTrigger(info)
    }

    // 新增组合商品
    const addFrom = () => {
      let msg = {
        purchaseForm: 'purchaseForm1',
        productName: '',
        purPrice: '',
        shipping: 0,
        address: '',
        weight: '',
        overseasWeight: '',
        length: '',
        width: '',
        height: '',
        overseasLength: '',
        overseasWidth: '',
        overseasHeight: '',
        invoiceType: '2',
        taxPoint: '',
        internalRepoId: '',
        announcements: '',
        packExplain: '',
        packagePhoto: [],
        specification: 1,
        tort: '无',
        brand: '无',
        patent: '无',
        certification: ['7'],
        instructionBook: '无',
        instructionBookFile: '',
        ce: '无',
        quality: 0,
        productUrl: [],
        proWidth: '',
        proLength: '',
        proWeight: '',
        proHeight: '',
        id: '',
        cellInclude: '2',
        cellModel: '',
      }
      msg.purchaseForm = 'purchaseForm' + (data.ruleForm.length + 1)
      data.ruleForm.push(msg)
      nextTick(() => {
        let file = {
          fileList: [],
          pathName: 'warehouse/purchase/purchaseChild/firstRecord/packagePhoto/img',
        }
        nextTick(() => {
          if (vue.$refs['packagePhoto' + data.ruleForm.length]) {
            vue.$refs['packagePhoto' + data.ruleForm.length].getImgMsg(file)
          }
          if (vue.$refs['productUrl' + data.ruleForm.length]) {
            vue.$refs['productUrl' + data.ruleForm.length].getImgMsg(file)
          }
        })
      })
    }

    // 验证全部表单
    const checkForm = (arrName) => {
      return new Promise((resolve, reject) => {
        vue.$refs[arrName].validate((valid) => {
          console.log(valid)
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })
    }

    // 提交
    const onSubmit = (draft) => {
      if (
        (data.topForm.productAttributes == 1 && data.ruleForm.length > 1) ||
        (data.topForm.productAttributes == 2 && data.ruleForm.length == 1)
      ) {
        vue.$message.warning('商品属性异常，请确认后重新提交！')
      } else {
        if (draft == 17) {
          if (
            data.ruleForm.every((item) => {
              return item.productName != ''
            })
          ) {
            getFirstPurces(draft)
          } else {
            vue.$message({
              type: 'warning',
              message: '暂存草稿时，产品名称为必填！',
            })
          }
        } else {
          let list = []
          data.ruleForm.map((item, index) => {
            list.push(checkForm(item.purchaseForm))
          })
          Promise.all(list)
            .then((res) => {
              getFirstPurces(draft)
            })
            .catch((err) => {
              ElMessage.warning({
                message: '请填写正确数据信息',
                type: 'warning',
              })
              data.btnFlag = false
            })
        }
      }
    }

    // saveOrUpdateDefault  保存更新默认计价信息
    const setNew = (draft) => {
      api.valuation.saveOrUpdateDefault(draft).then((res) => {
        if (res.code == 200) {
        }
      })
    }

    // 初录提交方法  //暂存草稿不进行必填验证 除产品名称除外
    const getFirstPurces = (draft) => {
      let num = 0
      for (let item of data.ruleForm) {
        num += Number(item.purPrice) + Number(item.shipping)
      }
      let msg = {
        infoList: [{}],
        rateId: data.msgList.priceRateId, // res.data[0].priceRateId
        siteId: data.msgList.siteId, // res.data[0].siteId
        transport: 1,
        price: Number(data.msgList.referencePrice),
        suggestPrice: Number(data.msgList.suggestPrice),
        costPrice: num,
        proId: data.msgList.id,
        proParameter: data.msgList.parameter ? data.msgList.parameter : '无',
      }
      let arr = data.ruleForm

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

      if (draft != 17) {
        api.valuation.getValuation(msg).then((res) => {
          let text = ''
          res.data.map((ie) => {
            // 提交时计价信息存在错误信息
            if (ie.errorMessage && ie.errorMessage != '') {
              ie.transportText =
                ie.transport == 1
                  ? '海运：' + ie.errorMessage + '<br/>'
                  : ie.transport == 2
                  ? '铁运：' + ie.errorMessage + '<br/>'
                  : ie.transport == 3
                  ? '空运：' + ie.errorMessage + '<br/>'
                  : ie.transport == 4
                  ? '直发：' + ie.errorMessage + '<br/>'
                  : ''
              text += ie.transportText
            }
          })
          // 如果所有计价信息都存在错误信息 则不能提交
          if (
            res.data.every((iq) => {
              return iq.errorMessage != ''
            }) &&
            text != ''
          ) {
            vue.$alert(text, '提示', {
              dangerouslyUseHTMLString: true,
              type: 'warning',
            })
          } else {
            let detail = []
            for (let i = 0; i < data.ruleForm.length; i++) {
              let msg = {
                productAttributes: Number(data.topForm.productAttributes),
                productName: data.ruleForm[i].productName ? data.ruleForm[i].productName.trim() : '',
                purPrice: Number(data.ruleForm[i].purPrice),
                shipping: Number(data.ruleForm[i].shipping),
                // purMinNum: Number(data.ruleForm[i].purMinNum),
                weight: Number(data.ruleForm[i].weight),
                length: Number(data.ruleForm[i].length),
                width: Number(data.ruleForm[i].width),
                height: Number(data.ruleForm[i].height),
                overseasWeight: data.ruleForm[i].overseasWeight,
                overseasLength: data.ruleForm[i].overseasLength,
                overseasWidth: data.ruleForm[i].overseasWidth,
                overseasHeight: data.ruleForm[i].overseasHeight,
                id: data.ruleForm[i].id,
                proId: data.msgList.id,
                address: data.ruleForm[i].address ? data.ruleForm[i].address.trim() : '',
                productUrl: data.ruleForm[i].productUrl ? String(data.ruleForm[i].productUrl) : '',
                instructionBook: data.ruleForm[i].instructionBook,
                instructionBookFile: String(data.ruleForm[i].instructionBookFile),
                brand: data.ruleForm[i].brand ? data.ruleForm[i].brand.trim() : '',
                tort: data.ruleForm[i].tort ? data.ruleForm[i].tort.trim() : '',
                cellInclude: data.ruleForm[i].cellInclude,
                cellModel: data.ruleForm[i].cellModel ? data.ruleForm[i].cellModel.trim() : '',
                // 新增产品重量、长度、宽度、高度、开票类型、税点
                proWidth: Number(data.ruleForm[i].proWidth), // 宽
                proLength: Number(data.ruleForm[i].proLength), // 长
                proWeight: Number(data.ruleForm[i].proWeight), // 重
                proHeight: Number(data.ruleForm[i].proHeight), // 高
                invoiceType: data.ruleForm[i].invoiceType, // 开票类型
                taxPoint: Number(data.ruleForm[i].taxPoint), // 税点
                packExplain: data.ruleForm[i].packExplain, // 包装说明
                packagePhoto: data.ruleForm[i].packagePhoto ? String(data.ruleForm[i].packagePhoto) : '', // 包装图
                secondPack: data.ruleForm[i].secondPack, // 二次包装
                specification: data.ruleForm[i].specification, // 装箱规格
                announcements: data.ruleForm[i].announcements ? data.ruleForm[i].announcements.trim() : '', // 注意事项
                certification: String(data.ruleForm[i].certification), // 产品认证
              }
              detail[i] = msg
            }
            let info = {
              detail: detail,
              draft: data.msgList.proFirstPurchase == 18 ? 18 : draft,
            }
            /// 当采购单价  运费  最小采购数量   毛重  包装尺寸   未进行变动（修改）时调用原来api
            api.develop.createSecond(info).then((res) => {
              if (res.code == 200) {
                resetForm()
                ElMessage.success({
                  message: res.msg,
                  type: 'success',
                })
                closeTab()
                emptyForm()
              } else {
                ElMessage.warning({
                  message: res.msg,
                  type: 'warning',
                })
              }
            })
            setNew(msg)
          }
        })
      } else {
        let detail = []
        for (let i = 0; i < data.ruleForm.length; i++) {
          let msg = {
            productAttributes: Number(data.topForm.productAttributes),
            productName: data.ruleForm[i].productName ? data.ruleForm[i].productName.trim() : '',
            purPrice: Number(data.ruleForm[i].purPrice),
            shipping: Number(data.ruleForm[i].shipping),
            weight: Number(data.ruleForm[i].weight),
            length: Number(data.ruleForm[i].length),
            width: Number(data.ruleForm[i].width),
            height: Number(data.ruleForm[i].height),
            overseasWeight: data.ruleForm[i].overseasWeight,
            overseasLength: data.ruleForm[i].overseasLength,
            overseasWidth: data.ruleForm[i].overseasWidth,
            overseasHeight: data.ruleForm[i].overseasHeight,
            id: data.ruleForm[i].id,
            proId: data.msgList.id,
            address: data.ruleForm[i].address ? data.ruleForm[i].address.trim() : '',
            productUrl: data.ruleForm[i].productUrl ? String(data.ruleForm[i].productUrl) : '',
            instructionBook: data.ruleForm[i].instructionBook,
            instructionBookFile: data.ruleForm[i].instructionBookFile
              ? data.ruleForm[i].instructionBookFile.join(',')
              : '',
            brand: data.ruleForm[i].brand ? data.ruleForm[i].brand.trim() : '',
            tort: data.ruleForm[i].tort ? data.ruleForm[i].tort.trim() : '',
            cellInclude: data.ruleForm[i].cellInclude,
            cellModel: data.ruleForm[i].cellModel ? data.ruleForm[i].cellModel.trim() : '',
            // 新增产品重量、长度、宽度、高度、开票类型、税点
            proWidth: Number(data.ruleForm[i].proWidth), // 宽
            proLength: Number(data.ruleForm[i].proLength), // 长
            proWeight: Number(data.ruleForm[i].proWeight), // 重
            proHeight: Number(data.ruleForm[i].proHeight), // 高
            invoiceType: data.ruleForm[i].invoiceType, // 开票类型
            taxPoint: Number(data.ruleForm[i].taxPoint), // 税点
            packExplain: data.ruleForm[i].packExplain, // 包装说明
            packagePhoto: data.ruleForm[i].packagePhoto ? String(data.ruleForm[i].packagePhoto) : '', // 包装图
            secondPack: data.ruleForm[i].secondPack, // 二次包装
            specification: data.ruleForm[i].specification, // 装箱规格
            announcements: data.ruleForm[i].announcements ? data.ruleForm[i].announcements.trim() : '', // 注意事项
            certification: String(data.ruleForm[i].certification), // 产品认证
          }
          detail[i] = msg
        }
        let info = {
          detail: detail,
          draft: data.msgList.proFirstPurchase == 18 ? 18 : draft,
        }
        /// 当采购单价  运费  最小采购数量   毛重  包装尺寸   未进行变动（修改）时调用原来api
        api.develop.createSecond(info).then((res) => {
          if (res.code == 200) {
            resetForm()
            ElMessage.success({
              message: res.msg,
              type: 'success',
            })
            closeTab()
            emptyForm()
          } else {
            ElMessage.warning({
              message: res.msg,
              type: 'warning',
            })
          }
        })
      }

      data.btnFlag = false
    }

    // 置空表单
    const emptyForm = () => {
      data.ruleForm = [
        {
          purchaseForm: 'purchaseForm1',
          productName: '',
          purPrice: '',
          shipping: 0,
          address: '',
          weight: '',
          overseasWeight: '',
          length: '',
          width: '',
          height: '',
          overseasLength: '',
          overseasWidth: '',
          overseasHeight: '',
          invoiceType: '2',
          taxPoint: '',
          internalRepoId: '',
          announcements: '',
          packExplain: '',
          packagePhoto: [],
          specification: 1,
          tort: '无',
          brand: '无',
          patent: '无',
          certification: ['7'],
          instructionBook: '无',
          instructionBookFile: '',
          ce: '无',
          quality: 0,
          productUrl: [],
          proWidth: '',
          proLength: '',
          proWeight: '',
          proHeight: '',
          id: '',
          cellInclude: '2',
          cellModel: '',
        },
      ]
    }

    // 点击下一步
    const netxTipSend = () => {
      let list = []
      data.ruleForm.map((item, index) => {
        list.push(checkForm(item.purchaseForm))
      })
      Promise.all(list)
        .then((res) => {
          let num = 0
          for (let item of data.ruleForm) {
            num += Number(item.purPrice) + Number(item.shipping)
          }
          let msg = {
            infoList: [{}],
            rateId: data.msgList.priceRateId, // res.data[0].priceRateId
            siteId: data.msgList.siteId, // res.data[0].siteId
            transport: 1,
            price: Number(data.msgList.referencePrice),
            suggestPrice: Number(data.msgList.suggestPrice),
            costPrice: num,
            proId: data.msgList.id,
            proParameter: data.msgList.parameter ? data.msgList.parameter : '无',
          }
          let arr = data.ruleForm
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

          api.valuation.getValuation(msg).then((res) => {
            let text = ''
            res.data.map((item) => {
              // 当前数据存在错误信息提示
              if (item.errorMessage && item.errorMessage != '') {
                item.transportText =
                  item.transport == 1
                    ? '海运：' + item.errorMessage + '<br/>'
                    : item.transport == 2
                    ? '铁运：' + item.errorMessage + '<br/>'
                    : item.transport == 3
                    ? '空运：' + item.errorMessage + '<br/>'
                    : item.transport == 4
                    ? '直发：' + item.errorMessage + '<br/>'
                    : ''
                text += item.transportText
              } else {
                // 否则正常走获取计价信息 去到计价信息查看
                netxTip()
              }
            })
            // 如果全部数据都存在错误信息提示
            if (
              res.data.every((k) => {
                return k.errorMessage != ''
              }) &&
              text != ''
            ) {
              vue.$alert(text, '提示', {
                dangerouslyUseHTMLString: true,
                type: 'warning',
              })
            } else {
              // 否则正常走获取计价信息 去到计价信息查看
              netxTip()
            }
          })
        })
        .catch((err) => {
          ElMessage.warning({
            message: '请填写正确数据信息',
            type: 'warning',
          })
        })
    }

    // 自动计算
    const calculate = (num, type, index) => {
      if (type == 1) {
        data.ruleForm[index].overseasWeight = Number(num * 0.95).toFixed(2)
      } else if (type == 2) {
        data.ruleForm[index].overseasLength = Number(num * 0.95).toFixed(2)
      } else if (type == 3) {
        data.ruleForm[index].overseasWidth = Number(num * 0.95).toFixed(2)
      } else if (type == 4) {
        data.ruleForm[index].overseasHeight = Number(num * 0.95).toFixed(2)
      }
    }
    // 新增质检
    const addObj = (arr) => {
      if (data.tableObj.exp !== '' && data.tableObj.item !== '') {
        let obj = {
          exp: data.tableObj.exp,
          item: data.tableObj.item,
        }
        arr.push(obj)
        data.tableObj.exp = ''
        data.tableObj.item = ''
      } else {
        vue.$message({
          type: 'info',
          message: '请填质检写信息',
        })
      }
    }

    // 删除质检项
    const deleteRow = (index, rows) => {
      rows.splice(index, 1)
    }

    // 重置form+清除规则
    const resetForm = () => {
      if (topFormRef.value) {
        topFormRef.value.resetFields()
        topFormRef.value.clearValidate()
      }
    }
    // 获取图片需要放置的位置
    const changeImgIndex = (index, name) => {
      data.imgIndex = index
      data.imgName = name
    }
    // 获取图片url
    const receive = (e) => {
      console.log(data.ruleForm[data.imgIndex][data.imgName])
      nextTick(() => {
        data.ruleForm[data.imgIndex][data.imgName].push(e)
      })
    }
    // 获取文件url
    const fileUpload = (e) => {
      data.ruleForm[e.index][e.name] = e.data.link
    }
    // 删除文件
    const removeInstructionBookFile = (name, index) => {
      data.ruleForm[index][name] = ''
    }
    // 删除单个组合商品
    const delAttribut = (index, id) => {
      if (data.ruleForm.length > 1) {
        api.develop.deleteProInfo({ id: id }).then((res) => {
          if (res.code == 200) {
            data.ruleForm.splice(index, 1)
            ElMessage.success({
              message: res.msg,
              type: 'success',
            })
          } else {
            ElMessage.warning({
              message: res.msg,
              type: 'warning',
            })
          }
        })
      } else {
        ElMessage.error({
          message: '必须填写一条信息',
          type: 'warning',
        })
        data.topForm.productAttributes = '1'
      }
    }
    const refData = toRefs(data)
    const closeTab = inject('closeTab')
    const netxTip = inject('netxTip')

    // 跳转供应商
    const jump = (path) => {
      vue.$router.push(path)
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

    //点击产品认证中的每一项 配合产品认证change事件
    const checkBoxEd = (ite, index) => {
      if (ite.value == '无' && !data.checkEdFalg) {
        data.ruleForm[index].certification = ['7']
      }
    }

    //产品认证 change 事件
    const certificationChange = (k) => {
      if (k.length > 1) {
        data.checkEdFalg = k.some((item) => {
          return item == 7
        })
        if (data.checkEdFalg) {
          k.splice(k.indexOf('7'), 1)
        }
      }
    }

    // 复制链接
    const copyText = (text) => {
      documentCopy(text)
    }

    return {
      ...refData,
      getMsg,
      certificationChange,
      checkBoxEd,
      onSubmit,
      checkForm,
      calculate,
      closeTab,
      receive,
      copyText,
      addFrom,
      addObj,
      deleteRow,
      resetForm,
      topFormRef,
      changeImgIndex,
      netxTipSend,
      delAttribut,
      toFather,
      jump,
      uploadTrigger,
      fileUpload,
      removeImg,
      tableTypeComputed,
      disabled,
      requestFlag,
      removeInstructionBookFile,
      pushFile,
      removeFileBook,
      getBookText,
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

  .size-width {
    width: 120px;
  }
  .size-width60 {
    width: 80px;
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

.el-input {
  width: 180px;
}

.el-form-item {
  width: 48%;
}

.form-items-width .el-form-item {
  width: 100% !important;
}

.el-textarea {
  width: 290px;
}

.size-width {
  width: 80px;
  margin-right: 3px;
}

.size-width100 {
  width: 100px;
  margin-right: 3px;
}

.note {
  margin-left: 10px;
  font-size: 10px;
  line-height: 25px;
  color: #afaaaa;
}
.instructionBookFile {
  display: flex;
  .noteForm {
    margin-left: 10px;
    font-size: 12px;
    color: #7c7c7c;
    line-height: 25px;
    width: 350px;
    display: block;
  }

  .el-icon-circle-close {
    color: #409eff;
  }
}

.but-right {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  width: 90%;
}
.el-checkbox-group {
  width: 300px;
}

.addnew {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.form-border {
  border-top: 1px solid rgb(197, 196, 196);
  padding-top: 20px;
}
.el-tabel-bottom {
  margin-bottom: 10px;
}

.tabel-btn {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
}
.noteMsg {
  font-size: 12px;
  color: rgb(129, 126, 126);
  margin-right: 10px;
}
.demo-ruleForm {
  position: relative;
  .del-productAttributes {
    position: absolute;
    right: 30px;
    top: -10px;
  }
  .el-select {
    .el-input__icon {
      i {
        display: none;
      }
    }
  }
}
.filebadge {
  position: relative;
  right: -90px;
  color: #409eff;
  font-size: 18px;
  top: -80px;
  z-index: 10;
}

.imgBox {
  margin-right: 10px;
}

.mailiBtn {
  margin-right: 10px;
}

.supplier {
  color: #409eff;
  font-size: 12px;
  margin-left: 10px;
}
.exceptionDescription {
  margin: 10px 0;
}
.exceptionState-item {
  height: 40px;
  line-height: 40px;
  color: red;
}
</style>
