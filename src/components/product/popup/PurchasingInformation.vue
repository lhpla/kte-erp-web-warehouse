<!-- 采购信息 -->
<template>
  <div id="PurchasingInformation">
    <div v-loading="formLoading" style="min-height: 650px">
      <el-form
        v-show="!formLoading"
        element-loading-background="rgba(255,255,255, 1)"
        ref="purchaseFrom"
        :rules="purchaseFromRules"
        :model="proPurchaseDto"
        size="mini"
        class="product-form"
        label-width="175px"
      >
        <div class="product-item">
          <el-form-item label="产品名称 ：" prop="declareCname">
            <el-input v-model="productCname" clearable disabled placeholder="请填写产品名称"></el-input>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="最小采购数量 ：" prop="minimumPurchase">
            <el-input
              :disabled="!isEdit"
              clearable
              v-model.trim="proPurchaseDto.minimumPurchase"
              placeholder="请填写最小采购数量"
            ></el-input>
            <el-tooltip v-model="tooltipFlag" placement="top" content="该产品的起订量" :manual="true" ref="tooltipRef">
              <i class="el-icon-question" @click="tooltipFlag = !tooltipFlag" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
          <div class="item-box">
            <el-form-item label="采购单价 ：" prop="purchasePrice" label-width="164px">
              <el-input
                :disabled="!isEdit"
                clearable
                v-model.trim="proPurchaseDto.purchasePrice"
                style="width: 120px"
                placeholder="采购单价"
              ></el-input>
            </el-form-item>
            <el-form-item label="运费 ：" prop="freight" label-width="80px">
              <el-input
                :disabled="!isEdit"
                clearable
                v-model.trim="proPurchaseDto.freight"
                style="width: 100px"
                placeholder="运费"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="product-item">
          <el-form-item label="开票类型 ：" prop="invoiceType">
            <el-select
              :disabled="!isEdit"
              v-model="proPurchaseDto.invoiceType"
              filterable
              clearable
              placeholder="请选择开票类型"
              ref="invoiceTypeRef"
              @change="changeInvoiceType"
            >
              <el-option
                :label="item.value"
                :value="item.dizKey"
                v-for="item in pro_supplier_invoice"
                :key="item.dizKey"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="税点 ：" prop="taxPoint" v-if="proPurchaseDto.invoiceType != 3">
            <el-input :disabled="!isEdit" clearable v-model="proPurchaseDto.taxPoint" placeholder="请填写税点">
              <template #suffix>
                <i>%</i>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <div class="product-item" style="width: 100%">
          <el-form-item label="供应商链接 ：" prop="supplierUrl" style="width: 41%">
            <el-input
              :disabled="!isEdit"
              clearable
              v-model.trim="proPurchaseDto.supplierUrl"
              placeholder="请填写"
              style="width: 70%"
            ></el-input>
            <i
              v-if="proPurchaseDto.supplierUrl"
              class="el-icon-document-copy"
              @click="copyText(proPurchaseDto.supplierUrl)"
            ></i>
            <el-button
              v-if="isEdit"
              type="text"
              icon="el-icon-bottom-right"
              size="mini"
              @click="getAttribute(proPurchaseDto.supplierUrl)"
              >获取数据</el-button
            >
          </el-form-item>

          <el-form-item label="属性匹配 ：" prop="attributeId">
            <el-select
              :disabled="!isEdit"
              v-model="proPurchaseDto.attributeId"
              filterable
              clearable
              placeholder="请选择属性"
              v-loading="attributeLoading"
              ref="attributeIdRef"
            >
              <el-option
                v-for="item in attributeMatchingList"
                :key="item.id"
                :label="item.attributeValue"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="product-item" style="width: 100%">
          <el-form-item label="上次采购价 ：" style="width: 41%">
            <div>
              {{
                proPurchaseDto.lastPurchasePrice && proPurchaseDto.lastPurchasePrice > 0
                  ? Number(proPurchaseDto.lastPurchasePrice).toFixed(2)
                  : 0
              }}
            </div>
          </el-form-item>
          <el-form-item label="上次采购运费 ：" style="width: 40%">
            <div>
              {{
                proPurchaseDto.lastFreight && proPurchaseDto.lastFreight > 0
                  ? Number(proPurchaseDto.lastFreight).toFixed(2)
                  : 0
              }}
            </div>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="毛重(KG) ：" prop="grossWeight">
            <el-input
              :disabled="!isEdit"
              clearable
              @blur="calculate(proPurchaseDto.grossWeight, 1)"
              v-model.trim="proPurchaseDto.grossWeight"
              placeholder="请填写毛重"
            ></el-input>
            <el-tooltip
              v-if="isTheWarehouseToConfirm"
              v-model="tooltipFlag5"
              placement="top"
              content="仓库已确认毛重"
              :manual="true"
              ref="tooltipRef"
              class="delivery-child"
            >
              <i class="el-icon-success" @click="tooltipFlag5 = !tooltipFlag5" style="color: green"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="海外仓重量(KG) ：" prop="overseaWeight">
            <el-input
              :disabled="!isEdit"
              clearable
              v-model.trim="proPurchaseDto.overseaWeight"
              placeholder="请填写海外仓重量"
            >
            </el-input>
            <span class="product-text">毛重X95%</span>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="包装尺寸(CM) ：" prop="domesticLength">
            <el-input
              @blur="calculate(proPurchaseDto.domesticLength, 2)"
              v-model="proPurchaseDto.domesticLength"
              placeholder="长"
              style="width: 80px; margin: 0 30px 0 0"
              clearable
              :disabled="!isEdit"
            ></el-input>
          </el-form-item>
          <el-form-item prop="domesticWidth" label-width="0">
            <el-input
              @blur="calculate(proPurchaseDto.domesticWidth, 3)"
              v-model="proPurchaseDto.domesticWidth"
              placeholder="宽"
              style="width: 80px; margin: 0 30px 0 0"
              clearable
              :disabled="!isEdit"
            ></el-input>
          </el-form-item>
          <el-form-item prop="domesticHeight" label-width="0">
            <el-input
              clearable
              @blur="calculate(proPurchaseDto.domesticHeight, 4)"
              v-model="proPurchaseDto.domesticHeight"
              placeholder="高"
              style="width: 80px"
              :disabled="!isEdit"
            >
            </el-input>
            <el-tooltip
              v-if="isTheWarehouseToConfirm"
              v-model="tooltipFlag6"
              placement="top"
              content="仓库已确认包装尺寸"
              :manual="true"
              ref="tooltipRef"
              class="delivery-child"
            >
              <i class="el-icon-success" @click="tooltipFlag6 = !tooltipFlag6" style="color: green"></i>
            </el-tooltip>
          </el-form-item>
          <div class="product-item">
            <el-form-item label="海外仓包装尺寸(CM) ：" prop="overseaLength">
              <el-input
                :disabled="!isEdit"
                clearable
                v-model.trim="proPurchaseDto.overseaLength"
                placeholder="长"
                style="width: 80px"
              ></el-input>
            </el-form-item>
            <el-form-item prop="overseaWidth" label-width="0">
              <el-input
                :disabled="!isEdit"
                clearable
                v-model.trim="proPurchaseDto.overseaWidth"
                placeholder="宽"
                style="width: 80px; margin: 0 30px"
              ></el-input>
            </el-form-item>
            <el-form-item prop="overseaHeight" label-width="0">
              <el-input
                :disabled="!isEdit"
                clearable
                v-model.trim="proPurchaseDto.overseaHeight"
                placeholder="高"
                style="width: 80px"
              ></el-input>
            </el-form-item>
            <span class="product-text">包装尺寸X95%</span>
          </div>
        </div>
        <div class="product-item">
          <el-form-item label="产品重量(KG) ：" prop="actualWeight">
            <el-input
              :disabled="!isEdit"
              v-model.trim="proPurchaseDto.actualWeight"
              clearable
              placeholder="请填写产品重量"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="产品尺寸(CM) ：" prop="actualLength">
            <el-input
              :disabled="!isEdit"
              v-model.trim="proPurchaseDto.actualLength"
              clearable
              placeholder="长"
              style="width: 80px; margin: 0 30px 0 0"
            ></el-input>
          </el-form-item>
          <el-form-item prop="actualWidth" label-width="0">
            <el-input
              :disabled="!isEdit"
              v-model.trim="proPurchaseDto.actualWidth"
              clearable
              placeholder="宽"
              style="width: 80px; margin: 0 30px 0 0"
            ></el-input>
          </el-form-item>
          <el-form-item prop="actualHeight" label-width="0">
            <el-input
              :disabled="!isEdit"
              v-model.trim="proPurchaseDto.actualHeight"
              clearable
              placeholder="高"
              style="width: 80px"
            ></el-input>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="产品侵权 ：" prop="proTort">
            <el-input
              :disabled="!isEdit"
              clearable
              v-model="proPurchaseDto.proTort"
              placeholder="请说明产品侵权相关信息"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="产品品牌 ：" prop="proBrand">
            <el-input
              :disabled="!isEdit"
              clearable
              v-model="proPurchaseDto.proBrand"
              placeholder="请说明产品品牌相关信息"
            >
            </el-input>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="是否包含电池 ：" prop="isCell" style="margin-right: 190px">
            <el-radio-group v-model="proPurchaseDto.isCell" :disabled="!isEdit">
              <el-radio label="1">是</el-radio>
              <el-radio label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="电池型号 ：" v-if="proPurchaseDto.isCell == 1" prop="cellVersion">
            <el-input :disabled="!isEdit" clearable v-model="proPurchaseDto.cellVersion" placeholder="请填写电池型号">
            </el-input>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="包装说明 ：" prop="packState">
            <el-select
              :disabled="!isEdit"
              v-model="proPurchaseDto.packState"
              :allow-create="true"
              filterable
              clearable
              placeholder="请选择包装说明"
              ref="packStateRef"
            >
              <el-option
                :label="item.value"
                :value="item.dizKey"
                v-for="item in pro_purchase_package"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="二次包装 ：" prop="secondaryPackaging">
            <el-select v-model="proPurchaseDto.secondaryPackaging" filterable clearable placeholder="请选择二次包装" ref="secondaryPackagingRef">
              <el-option :label="item.value" :value="item.dizKey" v-for="item in pro_purchase_second_package" :key="item.dizKey"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="二次包装 ：" prop="repeatPackaging">
            <el-radio-group :disabled="!isEdit" v-model="proPurchaseDto.repeatPackaging">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
            <el-tooltip
              v-model="tooltipFlag3"
              placement="top"
              content="是否需要仓库处理二次包装"
              :manual="true"
              ref="tooltipRef"
            >
              <i class="el-icon-question" @click="tooltipFlag3 = !tooltipFlag3" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="装箱规格 ：" prop="encasement">
            <span>
              一箱
              <el-input
                :disabled="!isEdit"
                clearable
                v-model.trim="proPurchaseDto.encasement"
                style="width: 230px; margin: 0 10px"
              ></el-input>
              件
            </span>
          </el-form-item>
          <el-form-item label="产品专利 ：" prop="patentPath">
            <NewUploadFile
              :isEdit="isEdit"
              @pushFile="pushFile($event, 'patentPath')"
              @removeFileBook="removeFileBook($event, 'patentPath')"
              ref="NewUploadFile1"
            ></NewUploadFile>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="交期 ：" prop="deliveryTime" label-width="169px" style="width: 40.2%" class="delivery">
            <el-input
              :disabled="!isEdit"
              clearable
              v-model.trim="proPurchaseDto.deliveryTime"
              style="width: 230px; margin: 0 10px"
            ></el-input>
            <el-tooltip
              v-model="tooltipFlag2"
              placement="top"
              content="供应商接单后多久能交货"
              :manual="true"
              ref="tooltipRef"
              class="delivery-child"
            >
              <i class="el-icon-question" @click="tooltipFlag2 = !tooltipFlag2" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="CE、欧代 ：" prop="proCePath">
            <NewUploadFile
              :isEdit="isEdit"
              @pushFile="pushFile($event, 'proCePath')"
              @removeFileBook="removeFileBook($event, 'proCePath')"
              ref="NewUploadFile3"
            ></NewUploadFile>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="产品认证 ：" prop="proAuthentication">
            <el-checkbox-group
              :disabled="!isEdit"
              v-model="proPurchaseDto.proAuthentication"
              @change="changeCertified(proPurchaseDto.proAuthentication)"
            >
              <el-checkbox
                v-for="(item, index) in pro_purchase_certified"
                :label="item.dizKey"
                :key="index"
                @click="checkBoxEd(item)"
              >
                {{ item.value }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="产品说明书:" prop="instructionBook">
            <el-select
              :disabled="!isEdit"
              v-model="proPurchaseDto.instructionBook"
              filterable
              :allow-create="true"
              clearable
              placeholder="请选择"
              @change="changeInstructionBook"
            >
              <el-option v-for="item in product_manual" :key="item.dizKey" :label="item.value" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="说明书 ：" prop="proDirectionPath" v-if="isInstructionBook">
            <NewUploadFile
              :isEdit="isEdit"
              @pushFile="pushFile($event, 'proDirectionPath')"
              @removeFileBook="removeFileBook($event, 'proDirectionPath')"
              isFormat
              ref="NewUploadFile2"
            >
            </NewUploadFile>
            <el-input style="display: none" v-model="proPurchaseDto.proDirectionPath"></el-input>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="采购负责人 ：" prop="purchaseUserId">
            <el-select
              :disabled="!isEdit"
              v-model="proPurchaseDto.purchaseUserId"
              filterable
              clearable
              placeholder="请选择采购负责人"
            >
              <el-option v-for="item in purchaseUserList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商：" prop="supplierId" label-width="169px">
            <div style="display: flex" v-if="isShowSupplier">
              <SupplierPublic :isEdit="isEdit" ref="SupplierPublic" @handChange="handChange"></SupplierPublic>
              <el-input v-model="proPurchaseDto.supplierId" style="display: none"></el-input>
              <el-button
                v-if="isEdit"
                type="text"
                class="supplier"
                @click="jump('/procurement', '/provider/providerManage/list')"
                >新建供应商</el-button
              >
              <span v-if="proPurchaseDto.isHaveAlternativeSupplier == 1">（有备选供应商）</span>
            </div>
            <span v-else>****</span>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="质保 ：" prop="warranty">
            <el-input :disabled="!isEdit" clearable v-model.trim="proPurchaseDto.warranty"></el-input>
            <el-tooltip
              v-model="tooltipFlag1"
              placement="top"
              content="供应商可提供的质保说明"
              :manual="true"
              ref="tooltipRef"
            >
              <i class="el-icon-question" @click="tooltipFlag1 = !tooltipFlag1" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="产品发票品名 ：" prop="productInvoiceName" label-width="156px">
            <el-input :disabled="!isEdit" clearable v-model="proPurchaseDto.productInvoiceName"></el-input>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="是否可以贴标 ：" prop="attachLabel" style="width: 40.5%">
            <el-radio-group :disabled="!isEdit" v-model="proPurchaseDto.attachLabel">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="其他证书 ：" prop="otherCertificates">
            <el-input :disabled="!isEdit" clearable v-model="proPurchaseDto.otherCertificates"></el-input>
            <el-tooltip
              v-model="tooltipFlag4"
              placement="top"
              content="供应商可提供的证书"
              :manual="true"
              ref="tooltipRef"
            >
              <i class="el-icon-question" @click="tooltipFlag4 = !tooltipFlag4" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
        </div>
        <div class="product-item" style="width: 100%">
          <el-form-item label="外包装图:" prop="packPicturePath" style="width: 41%" label-width="162px">
            <span v-if="isEdit" class="commonNote"
              >普通SKU至少包含一张包装内视图，一张包装外图，仅支持上传jpg/png格式文件，单个文件不能超过5M</span
            >
            <UploadImage
              :isEdit="isEdit"
              ref="packPicturePath"
              @removeImg="removeImgImagePath($event, 'packPicturePath')"
              @clickFu="receive($event, 'packPicturePath')"
            >
            </UploadImage>
          </el-form-item>
          <el-form-item label="内包装图:" prop="innerPackingDiagramPath">
            <span v-if="isEdit" class="commonNote"
              >普通SKU至少包含一张包装内视图，一张包装外图，仅支持上传jpg/png格式文件，单个文件不能超过5M</span
            >
            <UploadImage
              :isEdit="isEdit"
              ref="innerPackingDiagramPath"
              @removeImg="removeImgImagePath($event, 'innerPackingDiagramPath')"
              @clickFu="receive($event, 'innerPackingDiagramPath')"
            ></UploadImage>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="产品参数图:" prop="productParameterPicture" style="width: 41%" label-width="162px">
            <span v-if="isEdit" class="commonNote">仅支持上传jpg/png格式文件，单个文件不能超过5M</span>
            <UploadImage
              :isEdit="isEdit"
              ref="productParameterPicture"
              @removeImg="removeImgImagePath($event, 'productParameterPicture')"
              @clickFu="receive($event, 'productParameterPicture')"
            ></UploadImage>
          </el-form-item>
          <el-form-item label="产品实拍图 ：" prop="imagePath" label-width="162px">
            <span v-if="isEdit" class="commonNote">仅支持上传jpg/png格式文件，单个文件不能超过5M</span>
            <UploadImage
              :isEdit="isEdit"
              ref="UploadImage"
              @removeImg="removeImgImagePath($event, 'imagePath')"
              @clickFu="receive($event, 'imagePath')"
            ></UploadImage>
          </el-form-item>
        </div>
        <div style="width: 100%">
          <el-form-item label="注意事项 ：" prop="announcements">
            <el-input
              clearable
              type="textarea"
              v-model="proPurchaseDto.announcements"
              class="remark"
              maxlength="100"
              placeholder="可输入采购注意事项，文字产品参数等"
              show-word-limit
              rows="4"
              :disabled="!isEdit"
            ></el-input>
          </el-form-item>
        </div>
        <div class="product-item" style="width: 100%">
          <el-form-item label="是否需要质检 ：" style="width: 45%" prop="isQualityInspection">
            <el-radio-group :disabled="!isEdit" v-model="proPurchaseDto.isQualityInspection" @change="handleInspection">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="proMarketInfo" v-if="proPurchaseDto.isQualityInspection == 1">
          <div class="table-box">
            <div class="table-header">
              <el-button v-if="isEdit" type="primary" @click="addQualityInfo" size="mini">新增质检信息</el-button>
              <el-button v-if="isEdit" type="primary" @click="saveQualityInfo" size="mini">一键提交质检信息</el-button>
            </div>
          </div>
          <el-table
            :header-cell-style="rowClass"
            :data="proPurchaseDto.qualityTestInfoList"
            tooltip-effect="dark"
            element-loading-text="加载中"
            border
          >
            <el-table-column prop="testProgram" label="质检项目" show-overflow-tooltip>
              <template #default="scope">
                <el-input
                  :disabled="!isEdit"
                  v-model.trim="scope.row.testProgram"
                  size="mini"
                  @change="isQualityInspectionChangeFlag = true"
                  clearable
                  placeholder="请输入内容"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="testExplain" label="质检说明" show-overflow-tooltip>
              <template #default="scope">
                <el-input
                  :disabled="!isEdit"
                  v-model.trim="scope.row.testExplain"
                  size="mini"
                  @change="isQualityInspectionChangeFlag = true"
                  clearable
                  placeholder="请输入内容"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column class-name="table-operation" width="100" label="操作">
              <template #default="scope">
                <el-button
                  :disabled="!isEdit"
                  size="mini"
                  icon="el-icon-delete"
                  type="text"
                  @click="deleteQualityInfo(scope.row)"
                  >删除</el-button
                >
                <!-- <el-button size="mini" icon="el-icon-delete" type="text" v-if="isAdd" @click="saveQualityInfo(scope.row)">保存</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form-item v-if="isEdit">
          <div class="form-btn-footer" v-if="isAdd">
            <el-button
              icon="el-icon-circle-check"
              type="primary"
              @click="saveSubmit"
              :loading="submitActive"
              :disabled="submitActive"
              size="mini"
              >保 存</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, nextTick, inject, computed } from 'vue'
import { localGet, judgeIsUrl, localSet, documentCopy } from '@/utils/util'
import tablePage from '@/compositionApi/tablePage'
import NewUploadFile from '@/components/uploadFile/NewUploadFile.vue'
import changeRoute from '../../../compositionApi/changeRoute'

export default {
  name: 'PurchasingInformation',
  components: { NewUploadFile },
  props: {
    isAddProduct: {
      type: String,
      required: false,
    },
  },
  setup(prop, ctx) {
    const { rowClass } = tablePage()
    const data = reactive({
      isEdit: true,
      //是否有查看权限
      isShowSupplier: true,
      isTheWarehouseToConfirm: false, //是否提示已确认仓库
      checkEdFlag: true, //当前产品认证有没有 选中无选项
      proPurchaseDto: {
        proAuthentication: ['7'],
        qualityTestInfoList: [],
        isQualityInspection: '0',
        attributeId: '',
        imagePath: '',
        packPicturePath: '',
        innerPackingDiagramPath: '',
        productParameterPicture: '',
        deliveryTime: 0,
        otherCertificates: '',
        repeatPackaging: 0, //新二次包装 默认否
        productInvoiceName: '', //产品发票品名
        warranty: '', //质保
        attachLabel: false, // 是否可以贴标 默认否
      },
      product_manual: [], // 包装说明书字典
      attributeLoading: false, //供应商链接获取属性loading
      // 产品认证字典
      pro_purchase_certified: [],
      pro_supplier_invoice: [],
      pro_purchase_package: [],
      pro_purchase_second_package: [],
      purchaseUserList: [],
      // 采购信息校验方式
      purchaseFromRules: {
        taxPoint: [
          { required: true, message: '请输入税点', trigger: 'blur' },
          { message: '输入异常，请重新输入', trigger: 'blur' },
          /** 0~10000 之间的两位小数**/
          { pattern: /(^[0-9]\d{0,3}$)|(^0\.\d{2}$)|(^[1-9]\d{0,3}\.\d{1,2}$)/, message: '输入异常，请重新输入' },
        ],
        // productParameterPicture: [{ required: true, message: "请上传产品参数图", trigger: "change" }],
        supplierUrl: [
          { required: false, message: '请选择供应商', trigger: 'blur' },
          { pattern: /(http|https):\/\/([\w.]+\/?)\S*/gi, message: '请检查连接格式是否正确！' },
          { max: 500, message: '输入长度已超出最大范围500字符' },
        ],
        proDirectionPath: [{ required: true, message: '请上传说明书', trigger: 'change' }],
        otherCertificates: [{ required: true, message: '请输入其他证书', trigger: 'blur' }],
        attachLabel: [{ required: true, message: '请选择是否可以贴标签', trigger: 'change' }],
        supplierId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
        purchaseUserId: [{ required: true, message: '请选择采购负责人', trigger: 'change' }],
        freight: [
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '正数,两位小数',
          },
        ],
        purchasePrice: [
          { required: true, message: '请填写采购单价', trigger: 'blur' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '正数,两位小数',
          },
        ],
        deliveryTime: [
          { required: true, message: '请填写交期', trigger: 'blur' },
          { pattern: /^(0|\+?[1-9][0-9]{0,3})$/, message: '请输入0-9999之间的正整数' },
        ],
        invoiceType: [{ required: true, message: '请选择开票类型', trigger: 'change' }],
        domesticWarehouseId: [{ required: true, message: '请选择国内仓', trigger: 'change' }],
        packState: [{ required: true, message: '请选择包装说明', trigger: 'change' }],
        instructionBook: [{ required: true, message: '请选择', trigger: 'change' }],
        proAuthentication: [{ required: true, message: '请选择产品认证', trigger: 'change' }],
        proTort: [{ required: true, message: '请说明产品侵权相关信息', trigger: 'blur' }],
        proBrand: [{ required: true, message: '请说明产品品牌相关信息', trigger: 'blur' }],
        isCell: [{ required: true, message: '请选择是否包含电池', trigger: 'change' }],
        cellVersion: [{ required: true, message: '请填写电池型号', trigger: 'blur' }],
        isQualityInspection: [{ required: true, message: '是否需要质检', trigger: 'change' }],
        grossWeight: [
          { required: true, message: '请填写毛重', trigger: 'blur' },
          // { max: 8, message: "长度不超过8字符", trigger: "change" },
          {
            pattern: /(^[1-9]([0-9]{0,7})?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '8位正数,2位小数',
          },
          ,
        ],
        domesticLength: [
          { required: true, message: '请填写长', trigger: 'blur' },
          { max: 8, message: '长度不超过8字符', trigger: 'change' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '正数,两位小数',
          },
        ],
        domesticWidth: [
          { required: true, message: '请填写宽', trigger: 'blur' },
          { max: 8, message: '长度不超过8字符', trigger: 'change' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '正数,两位小数',
          },
        ],
        domesticHeight: [
          { required: true, message: '请填写高', trigger: 'blur' },
          { max: 8, message: '长度不超过8字符', trigger: 'change' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '正数,两位小数',
          },
        ],
        minimumPurchase: [
          { required: true, message: '请填写最小采购数量', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              // let ret = /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/;
              let ret = /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/
              if (!ret.test(value)) {
                callback(new Error('输入异常，请重新输入'))
              } else {
                callback()
              }
            },
            trigger: 'change',
          },
        ],
        supplierId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
        actualWeight: [
          { required: true, message: '请填写产品重量', trigger: 'blur' },
          { max: 8, message: '长度不超过8字符', trigger: 'change' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '正数,两位小数',
          },
        ],
        actualLength: [
          { required: true, message: '请填写长', trigger: 'blur' },
          { max: 8, message: '长度不超过8字符', trigger: 'change' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '正数,两位小数',
          },
        ],
        actualWidth: [
          { required: true, message: '请填写宽', trigger: 'blur' },
          { max: 8, message: '长度不超过8字符', trigger: 'change' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '正数,两位小数',
          },
        ],
        actualHeight: [
          { required: true, message: '请填写高', trigger: 'blur' },
          { max: 8, message: '长度不超过8字符', trigger: 'change' },
          {
            pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: '正数,两位小数',
          },
        ],
        encasement: [
          { required: true, message: '请选择装箱规格', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              let ret = /^([1-9]\d{0,3})$/
              if (!ret.test(value)) {
                callback(new Error('请输入1-9999的正整数'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
        overseaWeight: [
          { required: false, message: '请填写海外仓重量', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              let ret = /^[0-9]+.?[0-9]*$/
              if (value && !ret.test(value)) {
                callback(new Error('请输入数字'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
        overseaLength: [
          { required: false, message: '请填写海外仓包装长', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              let ret = /^[0-9]+.?[0-9]*$/
              if (value && !ret.test(value)) {
                callback(new Error('请输入数字'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
        overseaWidth: [
          { required: false, message: '请填写海外仓包装宽', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              let ret = /^[0-9]+.?[0-9]*$/
              if (value && !ret.test(value)) {
                callback(new Error('请输入数字'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
        overseaHeight: [
          { required: false, message: '请填写海外仓包装高', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              let ret = /^[0-9]+.?[0-9]*$/
              if (value && !ret.test(value)) {
                callback(new Error('请输入数字'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
      },
      submitActive: false,
      tooltipFlag: false,
      tooltipFlag1: false,
      tooltipFlag2: false,
      tooltipFlag3: false,
      tooltipFlag4: false,
      tooltipFlag5: false,
      tooltipFlag6: false,
      productCname: '',
      productData: {},
      isAdd: false,
      // 点击链接获取的属性列表
      attributeMatchingList: [],
      formLoading: false, //表单loading
      proStatus: '',
      isInstructionBook: true, //产品说明书是否为无说明书
      isQualityInspectionChangeFlag: false, //质检信息是否进行编辑  默认否
      isFirstGetDetail: false,
      firstAddPurchaseCunt: {
        overseaWeightCunt: 1,
        overseaLengthCunt: 1,
        overseaWidthCunt: 1,
        overseaHeightCunt: 1,
      },
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const { getModuleID } = changeRoute()

    const api = vue.$http
    onBeforeMount(() => {})
    onMounted(() => {
      // api.product.isShowSupplier().then((res) => {
      //   if (res.code == 200) {
      //     data.isShowSupplier = res.data;
      //   }
      // });
      window.addEventListener('scroll', handleScroll, true)
    })
    const UploadImage = ref(null)
    const packPicturePath = ref(null)
    const innerPackingDiagramPath = ref(null)
    const productParameterPicture = ref(null)

    //监听弹窗页面滚动关闭打开的tooltip 组件
    const handleScroll = () => {
      if (vue.$refs.tooltipRef) {
        nextTick(() => {
          data.tooltipFlag = false
          data.tooltipFlag1 = false
          data.tooltipFlag2 = false
          data.tooltipFlag3 = false
          data.tooltipFlag4 = false
        })
      }
    }
    console.log(data.isAdd, +new Date())
    const isRight = computed(() => {
      return localGet('isAdd') ? '42px' : '37px'
    })
    //拼接oss资源公共路径
    const ossBaseURL = 'http://kte-development.oss-cn-chengdu.aliyuncs.com/'

    // 获取信息
    const getPurchasingInfo = () => {
      data.product_manual =
        localGet('dictCodeList') && localGet('dictCodeList').product_manual
          ? localGet('dictCodeList').product_manual
          : []
      data.pro_purchase_certified =
        localGet('dictCodeList') && localGet('dictCodeList').pro_purchase_certified
          ? localGet('dictCodeList').pro_purchase_certified
          : []
      data.pro_supplier_invoice =
        localGet('dictCodeList') && localGet('dictCodeList').pro_supplier_invoice
          ? localGet('dictCodeList').pro_supplier_invoice
          : []
      data.pro_purchase_package =
        localGet('dictCodeList') && localGet('dictCodeList').pro_purchase_package
          ? localGet('dictCodeList').pro_purchase_package
          : []
      data.pro_purchase_second_package =
        localGet('dictCodeList') && localGet('dictCodeList').pro_purchase_second_package
          ? localGet('dictCodeList').pro_purchase_second_package
          : []
      data.purchaseUserList = []
      api.userOperation.getHeadOfPurchasing().then((res) => {
        if (res.code == 200) {
          data.purchaseUserList = res.data
        }
      })
    }
    // 供应商分发事件
    const handChange = (e) => {
      data.proPurchaseDto.supplierId = e
    }
    // 跳转供应商
    const jump = (url, path) => {
      let query = {
        isDev: 1,
        fid: '',
      }
      getModuleID(url, path, query, '_blank')
    }
    // 新增
    const getMsg = (proPurchaseDto, productCname) => {
      data.isAdd = false
      getPurchasingInfo()
      data.productCname = productCname || ''
      if (proPurchaseDto) {
        data.proPurchaseDto = proPurchaseDto
        //产品说明书为无说明书  就不需要上传说明书
        if (data.proPurchaseDto.instructionBook && data.proPurchaseDto.instructionBook == '无说明书') {
          data.isInstructionBook = false
          data.proPurchaseDto.proDirectionPath = ''
        } else {
          data.isInstructionBook = true
        }
        data.proPurchaseDto.purchasePrice =
          Number(data.proPurchaseDto.purchasePrice) !== -1 ? Number(data.proPurchaseDto.purchasePrice).toFixed(2) : 0
        data.proPurchaseDto.freight =
          Number(data.proPurchaseDto.freight) !== -1 ? Number(data.proPurchaseDto.freight).toFixed(2) : 0
        data.proPurchaseDto.invoiceType = data.proPurchaseDto.invoiceType
          ? String(data.proPurchaseDto.invoiceType)
          : '1'
        data.proPurchaseDto.isCell = data.proPurchaseDto.isCell == 1 ? String(data.proPurchaseDto.isCell) : '2'
        data.proPurchaseDto.deliveryTime = data.proPurchaseDto.deliveryTime ? data.proPurchaseDto.deliveryTime : 0
        data.proPurchaseDto.repeatPackaging =
          data.proPurchaseDto.repeatPackaging == 1 ? data.proPurchaseDto.repeatPackaging : 0
        data.proPurchaseDto.otherCertificates = data.proPurchaseDto.otherCertificates
        data.proPurchaseDto.productInvoiceName = data.proPurchaseDto.productInvoiceName
        data.proPurchaseDto.warranty = data.proPurchaseDto.warranty
        data.proPurchaseDto.attachLabel = data.proPurchaseDto.attachLabel == 1 ? data.proPurchaseDto.attachLabel : 0
        data.proPurchaseDto.actualWeight < 0 ? 0 : data.proPurchaseDto.actualWeight
        data.proPurchaseDto.actualLength < 0 ? 0 : data.proPurchaseDto.actualLength
        data.proPurchaseDto.actualWidth < 0 ? 0 : data.proPurchaseDto.actualWidth
        data.proPurchaseDto.actualHeight < 0 ? 0 : data.proPurchaseDto.actualHeight
        data.proPurchaseDto.isQualityInspection =
          data.proPurchaseDto.isQualityInspection == 1 ? data.proPurchaseDto.isQualityInspection : 0
        data.proPurchaseDto.proTort = data.proPurchaseDto.proTort ? data.proPurchaseDto.proTort : '无'
        data.proPurchaseDto.proBrand = data.proPurchaseDto.proBrand ? data.proPurchaseDto.proBrand : '无'
        data.proPurchaseDto.otherCertificates = data.proPurchaseDto.otherCertificates
          ? data.proPurchaseDto.otherCertificates
          : '无'
        if (data.proPurchaseDto.isQualityInspection == 1) {
          getQualityTestInfoListByProId(data.productData.proId)
        }
        data.proPurchaseDto.patentPath = proPurchaseDto.patentPath
        data.proPurchaseDto.proDirectionPath = proPurchaseDto.proDirectionPath
        data.proPurchaseDto.proCePath = proPurchaseDto.proCePath
        if (data.proPurchaseDto.proAuthentication && data.proPurchaseDto.proAuthentication !== undefined) {
          data.proPurchaseDto.proAuthentication = data.proPurchaseDto.proAuthentication.split(',')
        } else {
          data.proPurchaseDto.proAuthentication = ['7']
        }

        nextTick(() => {
          vue.$refs.SupplierPublic.getName(data.proPurchaseDto.supplierName ? data.proPurchaseDto.supplierName : '')
          vue.$refs.SupplierPublic.getSupplier()
        })

        if (data.proPurchaseDto.imagePath !== '') {
          data.proPurchaseDto.imagePath = data.proPurchaseDto.imagePath ? data.proPurchaseDto.imagePath.split(',') : []
        }
        if (data.proPurchaseDto.packPicturePath !== '') {
          data.proPurchaseDto.packPicturePath = data.proPurchaseDto.packPicturePath
            ? data.proPurchaseDto.packPicturePath.split(',')
            : []
        }

        if (data.proPurchaseDto.innerPackingDiagramPath !== '') {
          data.proPurchaseDto.innerPackingDiagramPath = data.proPurchaseDto.innerPackingDiagramPath
            ? data.proPurchaseDto.innerPackingDiagramPath.split(',')
            : []
        }

        if (data.proPurchaseDto.productParameterPicture !== '') {
          data.proPurchaseDto.productParameterPicture = data.proPurchaseDto.productParameterPicture
            ? data.proPurchaseDto.productParameterPicture.split(',')
            : []
        }

        // 说明书  产品专利  CE欧代 文件数据回显处理
        let patentPathArr = []
        let proDirectionPathArr = []
        let proCePathArr = []
        if (data.proPurchaseDto.patentPath) {
          data.proPurchaseDto.patentPath.split(',').map((item, index) => {
            let obj = {
              name: '',
              url: '',
            }
            obj.name = item.substr(item.lastIndexOf('=') + 1)
            obj.url = item.substr(0, item.indexOf('?'))
            patentPathArr.push(obj)
          })
        }
        if (data.proPurchaseDto.proDirectionPath) {
          data.proPurchaseDto.proDirectionPath.split(',').map((item, index) => {
            let obj = {
              name: '',
              url: '',
            }
            obj.name = item.substr(item.lastIndexOf('=') + 1)
            obj.url = item.substr(0, item.indexOf('?'))
            proDirectionPathArr.push(obj)
          })
        }
        if (data.proPurchaseDto.proCePath) {
          data.proPurchaseDto.proCePath.split(',').map((item, index) => {
            let obj = {
              name: '',
              url: '',
            }
            obj.name = item.substr(item.lastIndexOf('=') + 1)
            obj.url = item.substr(0, item.indexOf('?'))
            proCePathArr.push(obj)
          })
        }
        nextTick(() => {
          vue.$refs.NewUploadFile1 && vue.$refs.NewUploadFile1.getFileList(patentPathArr)
          vue.$refs.NewUploadFile2 && vue.$refs.NewUploadFile2.getFileList(proDirectionPathArr)
          vue.$refs.NewUploadFile3 && vue.$refs.NewUploadFile3.getFileList(proCePathArr)
        })

        // 产品实拍图  产品外包装图 产品内包装图 产品参数图 图片数据处理
        let file = {
          imgLimit: 3,
          isUpdate: true,
          fileList: [],
          pathName: 'warehouse/product/productLibrary/img',
        }
        let file1 = {
          imgLimit: 3,
          isUpdate: true,
          fileList: [],
          pathName: 'warehouse/product/productLibrary/img',
        }

        let file2 = {
          imgLimit: 3,
          isUpdate: true,
          fileList: [],
          pathName: 'warehouse/product/productLibrary/img',
        }
        let file3 = {
          imgLimit: 3,
          isUpdate: true,
          fileList: [],
          pathName: 'warehouse/product/productLibrary/img',
        }

        if (data.proPurchaseDto.imagePath && data.proPurchaseDto.imagePath.length > 0) {
          file.fileList = []
          for (let pUrl of data.proPurchaseDto.imagePath) {
            let obj = {
              url: pUrl,
            }
            file.fileList.push(obj)
          }
        }
        if (data.proPurchaseDto.packPicturePath && data.proPurchaseDto.packPicturePath.length > 0) {
          file1.fileList = []
          for (let pUrl of data.proPurchaseDto.packPicturePath) {
            let obj = {
              url: pUrl,
            }
            file1.fileList.push(obj)
          }
        }

        if (data.proPurchaseDto.productParameterPicture && data.proPurchaseDto.productParameterPicture.length > 0) {
          file2.fileList = []
          for (let pUrl of data.proPurchaseDto.productParameterPicture) {
            let obj = {
              url: ossBaseURL + pUrl,
            }
            file2.fileList.push(obj)
          }
        }
        if (data.proPurchaseDto.innerPackingDiagramPath && data.proPurchaseDto.innerPackingDiagramPath.length > 0) {
          file3.fileList = []
          for (let pUrl of data.proPurchaseDto.innerPackingDiagramPath) {
            let obj = {
              url: ossBaseURL + pUrl,
            }
            file3.fileList.push(obj)
          }
        }
        nextTick(() => {
          vue.$refs.SupplierPublic.getName(data.proPurchaseDto.supplierName ? data.proPurchaseDto.supplierName : '')
          if (UploadImage.value) {
            UploadImage.value.getImgMsg(file)
          }
          if (packPicturePath.value) {
            packPicturePath.value.getImgMsg(file1)
          }

          if (productParameterPicture.value) {
            productParameterPicture.value.getImgMsg(file2)
          }

          if (innerPackingDiagramPath.value) {
            innerPackingDiagramPath.value.getImgMsg(file3)
          }
        })
      } else {
        let file = {
          imgLimit: 3,
          isUpdate: true,
          fileList: [],
          pathName: 'warehouse/product/productLibrary/img',
        }
        let file1 = {
          imgLimit: 3,
          isUpdate: true,
          fileList: [],
          pathName: 'warehouse/product/productLibrary/img',
        }

        let file2 = {
          imgLimit: 3,
          isUpdate: true,
          fileList: [],
          pathName: 'warehouse/product/productLibrary/img',
        }
        let file3 = {
          imgLimit: 3,
          isUpdate: true,
          fileList: [],
          pathName: 'warehouse/product/productLibrary/img',
        }
        nextTick(() => {
          if (UploadImage.value) {
            UploadImage.value.getImgMsg(file)
          }
          if (packPicturePath.value) {
            packPicturePath.value.getImgMsg(file1)
          }
          if (productParameterPicture.value) {
            productParameterPicture.value.getImgMsg(file2)
          }
          if (innerPackingDiagramPath.value) {
            innerPackingDiagramPath.value.getImgMsg(file3)
          }
        })
        data.proPurchaseDto = {
          proAuthentication: ['7'],
          qualityTestInfoList: [],
          isQualityInspection: 0,
          invoiceType: '1',
          isCell: '2',
          imagePath: [],
          deliveryTime: 0,
          otherCertificates: '',
          repeatPackaging: 0,
          otherCertificates: '',
          productInvoiceName: '',
          warranty: '',
          attachLabel: 0,
          packPicturePath: [],
          innerPackingDiagramPath: [],
          productParameterPicture: [],
          proTort: '无', //产品侵权
          proBrand: '无', //产品品牌
          instructionBook: '无说明书', //产品说明书
          otherCertificates: '无', //其他证书
        }
        data.isInstructionBook = false
        data.proPurchaseDto.proDirectionPath = ''
        nextTick(() => {
          vue.$refs.SupplierPublic && vue.$refs.SupplierPublic.getSupplier()
        })
      }
    }

    //产品认证 change事件 changeCertified
    const changeCertified = (e) => {
      if (e.length > 1) {
        data.checkEdFlag = e.some((item) => {
          return item == 7
        })
        if (data.checkEdFlag) {
          e.splice(e.indexOf('7'), 1)
        }
      }
    }

    //弹框滚动关闭展开的下拉选择框
    const attributeBlur = () => {
      vue.$refs.attributeIdRef.blur()
      vue.$refs.invoiceTypeRef.blur()
      vue.$refs.packStateRef.blur()
      // vue.$refs.secondaryPackagingRef.blur();
    }

    //产品认证 点击每一项
    const checkBoxEd = (item) => {
      if (item.value == '无') {
        data.proPurchaseDto.proAuthentication = ['7']
      }
    }

    // 获取采购信息
    const getProPurchase = (msg) => {
      data.formLoading = true
      data.proPurchaseDto = {
        proAuthentication: ['7'],
        qualityTestInfoList: [],
        isQualityInspection: 0,
        isCell: '1',
      }
      api.productLibrary.getProPurchase(msg).then((res) => {
        if (res.code == 200) {
          // 用于获取当前产品参考链接的属性列表
          // && res.data.specId && res.data.specId != ""
          if (res.data.offerId && res.data.offerId != -1 && res.data.supplierUrl && res.data.supplierUrl != '') {
            getAttribute(res.data.supplierUrl)
          }
          //产品说明书为无说明书  就不需要上传说明书
          if (res.data.instructionBook && res.data.instructionBook == '无说明书') {
            data.isInstructionBook = false
            data.proPurchaseDto.proDirectionPath = ''
          } else {
            data.isInstructionBook = true
          }
          res.data.offerId = res.data.offerId != -1 ? res.data.offerId : ''
          data.proPurchaseDto = res.data
          data.proPurchaseDto.attributeId = res.data.attributeId ? res.data.attributeId : ''
          data.proPurchaseDto.deliveryTime = res.data.deliveryTime ? res.data.deliveryTime : 0
          data.proPurchaseDto.repeatPackaging =
            data.proPurchaseDto.repeatPackaging == 1 ? data.proPurchaseDto.repeatPackaging : 0
          data.proPurchaseDto.otherCertificates = res.data.otherCertificates
          data.proPurchaseDto.productInvoiceName = res.data.productInvoiceName
          data.proPurchaseDto.warranty = res.data.warranty
          data.proPurchaseDto.attachLabel = data.proPurchaseDto.attachLabel == 1 ? data.proPurchaseDto.attachLabel : 0
          data.productCname = data.proPurchaseDto.productCname
          data.proPurchaseDto.supplierId = data.proPurchaseDto.supplierId != -1 ? data.proPurchaseDto.supplierId : ''
          data.proPurchaseDto.purchaseUserId =
            data.proPurchaseDto.purchaseUserId != -1 ? data.proPurchaseDto.purchaseUserId : ''
          data.proPurchaseDto.purchasePrice = data.proPurchaseDto.purchasePrice
            ? Number(data.proPurchaseDto.purchasePrice).toFixed(2)
            : 0
          data.proPurchaseDto.freight = data.proPurchaseDto.freight ? Number(data.proPurchaseDto.freight).toFixed(2) : 0
          data.proPurchaseDto.invoiceType = data.proPurchaseDto.invoiceType
            ? String(data.proPurchaseDto.invoiceType)
            : '1'
          data.proPurchaseDto.isCell = data.proPurchaseDto.isCell == 1 ? String(data.proPurchaseDto.isCell) : '2'
          data.proPurchaseDto.actualWeight < 0 ? 0 : data.proPurchaseDto.actualWeight
          data.proPurchaseDto.actualLength < 0 ? 0 : data.proPurchaseDto.actualLength
          data.proPurchaseDto.actualWidth < 0 ? 0 : data.proPurchaseDto.actualWidth
          data.proPurchaseDto.actualHeight < 0 ? 0 : data.proPurchaseDto.actualHeight
          data.proPurchaseDto.isQualityInspection =
            data.proPurchaseDto.isQualityInspection == 1 ? data.proPurchaseDto.isQualityInspection : 0
          data.proPurchaseDto.encasement = data.proPurchaseDto.encasement == -1 ? '' : data.proPurchaseDto.encasement
          data.proPurchaseDto.proTort = data.proPurchaseDto.proTort ? res.data.proTort : '无'
          data.proPurchaseDto.proBrand = data.proPurchaseDto.proBrand ? res.data.proBrand : '无'
          data.proPurchaseDto.otherCertificates = data.proPurchaseDto.otherCertificates
            ? res.data.otherCertificates
            : '无'
          data.isShowSupplier = res.data.hideSupplier == 0 ? true : false
          data.isTheWarehouseToConfirm = res.data.isTheWarehouseToConfirm
          if (data.proPurchaseDto.isQualityInspection == 1) {
            getQualityTestInfoListByProId(data.productData.proId)
            console.log(data.productData.proId)
          }
          if (data.proPurchaseDto.proAuthentication && data.proPurchaseDto.proAuthentication !== undefined) {
            data.proPurchaseDto.proAuthentication = data.proPurchaseDto.proAuthentication.split(',')
          } else {
            data.proPurchaseDto.proAuthentication = ['7']
          }
          if (data.proPurchaseDto.imagePath !== '') {
            data.proPurchaseDto.imagePath = data.proPurchaseDto.imagePath
              ? data.proPurchaseDto.imagePath.split(',')
              : []
          }
          if (data.proPurchaseDto.packPicturePath !== '') {
            data.proPurchaseDto.packPicturePath = data.proPurchaseDto.packPicturePath
              ? data.proPurchaseDto.packPicturePath.split(',')
              : []
          }
          if (data.proPurchaseDto.productParameterPicture !== '') {
            data.proPurchaseDto.productParameterPicture = data.proPurchaseDto.productParameterPicture
              ? data.proPurchaseDto.productParameterPicture.split(',')
              : []
          }

          if (data.proPurchaseDto.innerPackingDiagramPath !== '') {
            data.proPurchaseDto.innerPackingDiagramPath = data.proPurchaseDto.innerPackingDiagramPath
              ? data.proPurchaseDto.innerPackingDiagramPath.split(',')
              : []
          }
          nextTick(() => {
            vue.$refs.SupplierPublic.getName(data.proPurchaseDto.supplierName ? data.proPurchaseDto.supplierName : '')
          })

          data.formLoading = false
          // 说明书  产品专利  CE欧代 文件数据回显处理
          let patentPathArr = []
          let proDirectionPathArr = []
          let proCePathArr = []
          if (data.proPurchaseDto.patentPath) {
            data.proPurchaseDto.patentPath.split(',').map((item, index) => {
              let obj = {
                name: '',
                url: '',
              }
              obj.name = item.substr(item.lastIndexOf('=') + 1)
              obj.url = item.substr(0, item.indexOf('?'))
              patentPathArr.push(obj)
            })
          }
          if (data.proPurchaseDto.proDirectionPath) {
            data.proPurchaseDto.proDirectionPath.split(',').map((item, index) => {
              let obj = {
                name: '',
                url: '',
              }
              obj.name = item.substr(item.lastIndexOf('=') + 1)
              obj.url = item.substr(0, item.indexOf('?'))
              proDirectionPathArr.push(obj)
            })
          }
          if (data.proPurchaseDto.proCePath) {
            data.proPurchaseDto.proCePath.split(',').map((item, index) => {
              let obj = {
                name: '',
                url: '',
              }
              obj.name = item.substr(item.lastIndexOf('=') + 1)
              obj.url = item.substr(0, item.indexOf('?'))
              proCePathArr.push(obj)
            })
          }
          nextTick(() => {
            vue.$refs.NewUploadFile1.getFileList(patentPathArr)
            if (data.isInstructionBook) {
              vue.$refs.NewUploadFile2.getFileList(proDirectionPathArr)
            }
            vue.$refs.NewUploadFile3.getFileList(proCePathArr)
          })

          // 产品实拍图  产品包装图 图片数据处理
          let file = {
            imgLimit: 3,
            isUpdate: true,
            fileList: [],
            pathName: 'warehouse/product/productLibrary/img',
          }
          let file1 = {
            imgLimit: 3,
            isUpdate: true,
            fileList: [],
            pathName: 'warehouse/product/productLibrary/img',
          }
          let file2 = {
            imgLimit: 3,
            isUpdate: true,
            fileList: [],
            pathName: 'warehouse/product/productLibrary/img',
          }
          let file3 = {
            imgLimit: 3,
            isUpdate: true,
            fileList: [],
            pathName: 'warehouse/product/productLibrary/img',
          }

          if (data.proPurchaseDto.imagePath && data.proPurchaseDto.imagePath.length > 0) {
            file.fileList = []
            for (let pUrl of data.proPurchaseDto.imagePath) {
              let obj = {
                url: pUrl,
              }
              file.fileList.push(obj)
            }
          }
          if (data.proPurchaseDto.packPicturePath && data.proPurchaseDto.packPicturePath.length > 0) {
            file1.fileList = []
            for (let pUrl of data.proPurchaseDto.packPicturePath) {
              let obj = {
                url: pUrl,
              }
              file1.fileList.push(obj)
            }
          }
          if (data.proPurchaseDto.productParameterPicture && data.proPurchaseDto.productParameterPicture.length > 0) {
            file2.fileList = []
            for (let pUrl of data.proPurchaseDto.productParameterPicture) {
              let obj = {
                url: ossBaseURL + pUrl,
              }
              file2.fileList.push(obj)
            }
          }
          if (data.proPurchaseDto.innerPackingDiagramPath && data.proPurchaseDto.innerPackingDiagramPath.length > 0) {
            file3.fileList = []
            for (let pUrl of data.proPurchaseDto.innerPackingDiagramPath) {
              let obj = {
                url: ossBaseURL + pUrl,
              }
              file3.fileList.push(obj)
            }
          }

          nextTick(() => {
            vue.$refs.SupplierPublic.getName(data.proPurchaseDto.supplierName ? data.proPurchaseDto.supplierName : '')
            if (UploadImage.value) {
              UploadImage.value.getImgMsg(file)
            }
            if (packPicturePath.value) {
              packPicturePath.value.getImgMsg(file1)
            }
            if (productParameterPicture.value) {
              productParameterPicture.value.getImgMsg(file2)
            }
            if (innerPackingDiagramPath.value) {
              innerPackingDiagramPath.value.getImgMsg(file3)
            }
          })
        } else {
          vue.$message.warning(res.msg)
          data.formLoading = false
        }
      })

      nextTick(() => {
        vue.$refs.SupplierPublic && vue.$refs.SupplierPublic.getSupplier()
      })
    }

    // 修改
    const getApiMsg = (msg) => {
      console.log(msg, 'msg')
      getPurchasingInfo()
      console.log()
      data.isEdit = msg.isEdit
      data.isShowSupplier = msg.hideSupplier == 0 ? true : false
      //改变校验规则
      //供应商链接/毛重/海外仓重量/海外仓包装尺寸
      // const rule = ['supplierUrl','grossWeight','overseaWeight','overseaLength','overseaWidth','overseaHeight']
      // if(msg.devStatus == '10'){
      // rule.forEach(item=>{
      //   data.purchaseFromRules[item][0].required = !data.purchaseFromRules[item][0].required
      // })
      // }

      data.productData = msg
      data.isAdd = true
      getProPurchase(data.productData)
    }

    // 修改保存
    const saveSubmit = () => {
      data.proPurchaseDto.proTort = data.proPurchaseDto.proTort ? data.proPurchaseDto.proTort.trim() : ''
      data.proPurchaseDto.proBrand = data.proPurchaseDto.proBrand ? data.proPurchaseDto.proBrand.trim() : ''
      data.proPurchaseDto.cellVersion = data.proPurchaseDto.cellVersion ? data.proPurchaseDto.cellVersion.trim() : ''
      data.proPurchaseDto.productInvoiceName = data.proPurchaseDto.productInvoiceName
        ? data.proPurchaseDto.productInvoiceName.trim()
        : ''
      data.proPurchaseDto.otherCertificates = data.proPurchaseDto.otherCertificates
        ? data.proPurchaseDto.otherCertificates.trim()
        : ''
      data.proPurchaseDto.overseaWeight = data.proPurchaseDto.overseaWeight ? data.proPurchaseDto.overseaWeight : 0
      data.proPurchaseDto.overseaLength = data.proPurchaseDto.overseaLength ? data.proPurchaseDto.overseaLength : 0
      data.proPurchaseDto.overseaWidth = data.proPurchaseDto.overseaWidth ? data.proPurchaseDto.overseaWidth : 0
      data.proPurchaseDto.overseaHeight = data.proPurchaseDto.overseaHeight ? data.proPurchaseDto.overseaHeight : 0
      purchaseFrom.value.validate((valid) => {
        if (valid) {
          if (data.proPurchaseDto.supplierName) {
            delete data.proPurchaseDto.supplierName
          }

          data.submitActive = true
          if (data.proPurchaseDto.qualityTestInfoList) {
            data.proPurchaseDto.qualityTestInfoList.map((item) => {
              item.proId = data.productData.proId
            })
          }
          if (data.proPurchaseDto.instructionBook && data.proPurchaseDto.instructionBook == '无说明书') {
            data.proPurchaseDto.proDirectionPath = ''
          }
          data.proPurchaseDto.purchasePrice = Number(data.proPurchaseDto.purchasePrice)
          let info = JSON.stringify(data.proPurchaseDto)
          info = JSON.parse(info)
          if (Array.isArray(info.proAuthentication)) {
            info.proAuthentication = String(info.proAuthentication)
          }
          info.imagePath = String(info.imagePath)
          info.packPicturePath = String(info.packPicturePath)
          info.productParameterPicture = String(info.productParameterPicture)
          info.innerPackingDiagramPath = String(info.innerPackingDiagramPath)
          info.proId = data.productData.proId
          info.proSku = data.productData.sku
          data.attributeMatchingList.map((item) => {
            if (item.id == data.proPurchaseDto.attributeId) {
              if (item.attributeId) {
                info.attributeId = item.attributeId
              } else {
                info.attributeId = item.id
              }
              info.specId = item.specId
              info.offerId = item.offerId
              info.urlPath = item.urlPath
              info.supplierLoginId = item.supplierLoginId
              info.subject = item.subject
              info.oceanAttributesName = item.attributeValue
            }
          })

          //不需要质检
          if (data.proPurchaseDto.isQualityInspection != 1) {
            api.productLibrary
              .updateProPurchaseInfo(info)
              .then((res) => {
                if (res.code == 200) {
                  vue.$message({
                    type: 'success',
                    message: res.msg,
                  })
                  getProPurchase(data.productData)
                  data.submitActive = false
                } else {
                  vue.$message({
                    type: 'warning',
                    message: res.msg,
                  })
                  data.submitActive = false
                }
              })
              .catch((err) => {
                data.submitActive = false
              })
          } else if (
            data.proPurchaseDto.qualityTestInfoList.length > 0 &&
            data.proPurchaseDto.isQualityInspection == 1
          ) {
            if (!data.isQualityInspectionChangeFlag) {
              api.productLibrary
                .updateProPurchaseInfo(info)
                .then((res) => {
                  if (res.code == 200) {
                    vue.$message({
                      type: 'success',
                      message: res.msg,
                    })
                    getProPurchase(data.productData)
                    data.submitActive = false
                  } else {
                    vue.$message({
                      type: 'warning',
                      message: res.msg,
                    })
                    data.submitActive = false
                  }
                })
                .catch((err) => {
                  data.submitActive = false
                })
            } else {
              vue.$message.warning('请先保存质检信息！')
              data.submitActive = false
            }
          } else {
            vue.$message.warning('请保证质检信息不为空！')
            data.submitActive = false
          }
        }
      })
    }

    // 获取文件url
    const fileUpload = (e) => {
      data.proPurchaseDto[e.name] = e.data.link
    }

    const refData = toRefs(data)
    const proPurchaseDtoF = inject('proPurchaseDto')

    //获取  proStatus
    const getProStatus = (status) => {
      data.proStatus = status
    }

    // 新增提交
    const submit = () => {
      if (data.proStatus == 0) {
        vue.$emit('funPromise', true)
        if (Array.isArray(data.proPurchaseDto.proAuthentication)) {
          data.proPurchaseDto.proAuthentication = String(data.proPurchaseDto.proAuthentication)
          data.proPurchaseDto.imagePath = data.proPurchaseDto.imagePath ? String(data.proPurchaseDto.imagePath) : ''
          data.proPurchaseDto.packPicturePath = data.proPurchaseDto.packPicturePath
            ? String(data.proPurchaseDto.packPicturePath)
            : ''
          data.proPurchaseDto.productParameterPicture = data.proPurchaseDto.productParameterPicture
            ? String(data.proPurchaseDto.productParameterPicture)
            : ''
          data.proPurchaseDto.innerPackingDiagramPath = data.proPurchaseDto.innerPackingDiagramPath
            ? String(data.proPurchaseDto.innerPackingDiagramPath)
            : ''
        }
        if (data.proPurchaseDto.instructionBook && data.proPurchaseDto.instructionBook == '无说明书') {
          data.proPurchaseDto.proDirectionPath = ''
        }
        proPurchaseDtoF.value = data.proPurchaseDto
        data.proPurchaseDto.purchasePrice = data.proPurchaseDto.purchasePrice
          ? Number(data.proPurchaseDto.purchasePrice)
          : data.proPurchaseDto.purchasePrice == 0
          ? 0
          : ''
      } else {
        purchaseFrom.value.validate((valid) => {
          if (valid) {
            vue.$emit('funPromise', true)
            if (Array.isArray(data.proPurchaseDto.proAuthentication)) {
              data.proPurchaseDto.proAuthentication = String(data.proPurchaseDto.proAuthentication)
              data.proPurchaseDto.imagePath = data.proPurchaseDto.imagePath ? String(data.proPurchaseDto.imagePath) : ''
              data.proPurchaseDto.packPicturePath = data.proPurchaseDto.packPicturePath
                ? String(data.proPurchaseDto.packPicturePath)
                : ''
              data.proPurchaseDto.productParameterPicture = data.proPurchaseDto.productParameterPicture
                ? String(data.proPurchaseDto.productParameterPicture)
                : ''
              data.proPurchaseDto.innerPackingDiagramPath = data.proPurchaseDto.innerPackingDiagramPath
                ? String(data.proPurchaseDto.innerPackingDiagramPath)
                : ''
            }
            if (data.proPurchaseDto.instructionBook && data.proPurchaseDto.instructionBook == '无说明书') {
              data.proPurchaseDto.proDirectionPath = ''
            }
            data.proPurchaseDto.purchasePrice = Number(data.proPurchaseDto.purchasePrice)
            proPurchaseDtoF.value = data.proPurchaseDto
          } else {
            vue.$emit('funPromise', false)
          }
        })
      }
    }
    // 采购信息
    const purchaseFrom = ref(null)
    const closed = () => {
      handleScroll()
      if (purchaseFrom.value) {
        purchaseFrom.value.clearValidate()
        purchaseFrom.value.resetFields()
      }
      data.firstAddPurchaseCunt = {
        overseaWeightCunt: 1,
        overseaLengthCunt: 1,
        overseaWidthCunt: 1,
        overseaHeightCunt: 1,
      }
    }

    // 切换质检
    const handleInspection = (row) => {
      data.isQualityInspectionChangeFlag = true
      // 新增默认质检表接口2021.07.28
      if (row == 1 && data.productData.proId && data.productData.proId != '' && data.proPurchaseDto.isFistChange) {
        api.product.getQualityTestInfoListByProId({ proId: data.productData.proId }).then((res) => {
          if (res.data.length > 0) {
            data.proPurchaseDto.qualityTestInfoList = res.data
          }
        })
      } else if (row == 1 && !data.proPurchaseDto.isFistChange) {
        api.product.selectAttachs().then((res) => {
          if (res.code == 200) {
            if (res.data.length > 0) {
              res.data.map((item) => {
                item.id = ''
                item.indexId = randomId()
              })
            }
            data.proPurchaseDto.qualityTestInfoList = res.data
          }
        })
      }
    }

    // 自动计算
    const calculate = (num, type) => {
      console.log(123456)
      num = Number(num)
      if (vue.$props.isAddProduct && vue.$props.isAddProduct == 'add' && !isNaN(num)) {
        if (type == 1 && data.firstAddPurchaseCunt.overseaWeightCunt == 1) {
          data.proPurchaseDto.overseaWeight = Number(num * 0.95).toFixed(2)
          data.firstAddPurchaseCunt.overseaWeightCunt++
        } else if (type == 2 && data.firstAddPurchaseCunt.overseaLengthCunt == 1) {
          data.proPurchaseDto.overseaLength = Number(num * 0.95).toFixed(2)
          data.firstAddPurchaseCunt.overseaLengthCunt++
        } else if (type == 3 && data.firstAddPurchaseCunt.overseaWidthCunt == 1) {
          data.proPurchaseDto.overseaWidth = Number(num * 0.95).toFixed(2)
          data.firstAddPurchaseCunt.overseaWidthCunt++
        } else if (type == 4 && data.firstAddPurchaseCunt.overseaHeightCunt == 1) {
          data.proPurchaseDto.overseaHeight = Number(num * 0.95).toFixed(2)
          data.firstAddPurchaseCunt.overseaHeightCunt++
        }
      }
    }

    // 随机产生不重复的id
    const randomId = () => {
      let supplierPayId = ''
      supplierPayId = Math.ceil(Math.random() * 10000)
      return supplierPayId
    }

    // 新增质检信息
    const addQualityInfo = () => {
      data.isQualityInspectionChangeFlag = true
      data.proPurchaseDto.qualityTestInfoList.push({
        indexId: randomId(),
        testProgram: '',
        testExplain: '',
        id: '',
        proSku: data.productData.sku,
        proId: data.productData.proId,
      })
    }

    //根据产品ID获取质检信息
    const getQualityTestInfoListByProId = (proId) => {
      if (data.isAdd) {
        api.product.getQualityTestInfoListByProId({ proId: proId }).then((res) => {
          data.proPurchaseDto.qualityTestInfoList = res.data
        })
      }
    }

    // 删除质检信息
    const deleteQualityInfo = (row) => {
      console.log(row, data.proPurchaseDto.qualityTestInfoList)
      data.isQualityInspectionChangeFlag = true
      //前端进行假删除
      if (row.indexId && row.indexId != '') {
        data.proPurchaseDto.qualityTestInfoList = data.proPurchaseDto.qualityTestInfoList.filter((item) => {
          return row.indexId != item.indexId
        })
      }
      if (!row.indexId && row.id) {
        data.proPurchaseDto.qualityTestInfoList = data.proPurchaseDto.qualityTestInfoList.filter((item) => {
          return row.id != item.id
        })
      }
    }

    //保存质检信息
    const saveQualityInfo = () => {
      if (data.productData.proId) {
        if (data.proPurchaseDto.qualityTestInfoList.length > 0) {
          let verifyFlag = false
          verifyFlag = data.proPurchaseDto.qualityTestInfoList.every((item) => {
            return item.testExplain && item.testExplain != '' && item.testProgram && item.testProgram != ''
          })
          if (verifyFlag) {
            data.proPurchaseDto.qualityTestInfoList.map((item) => {
              if (item.indexId) {
                delete item.indexId
              }
              if (data.productData.sku) {
                item.proSku = data.productData.sku
              }
              if (data.productData.proId) {
                item.proId = data.productData.proId
              }
            })
            let msg = {
              proId: data.productData.proId,
              qualityTestInfoList: data.proPurchaseDto.qualityTestInfoList,
            }
            api.product.redactQualityTest(msg).then((res) => {
              if (res.code == 200) {
                vue.$message.success(res.msg)
                data.isQualityInspectionChangeFlag = false
                getQualityTestInfoListByProId(data.productData.proId)
              } else {
                vue.$message.warning(res.msg)
              }
            })
          } else {
            vue.$message.warning('请补充完善质检信息后再进行提交！')
          }
        } else {
          vue.$message.warning('不能提交空的质检信息！')
        }
      } else {
        vue.$message.warning('请先暂存或提交当前数据，确保当前数据已生成产品ID后进行质检信息编辑！')
      }
    }

    // 获取图片url
    const receive = (e, type) => {
      console.log(e, type)
      console.log(data.proPurchaseDto)
      if (e.link) {
        let arr = [e.link]
        if (type == 'imagePath') {
          data.proPurchaseDto.imagePath = [...data.proPurchaseDto.imagePath].concat(arr)
        }
        if (type == 'packPicturePath') {
          data.proPurchaseDto.packPicturePath = [...data.proPurchaseDto.packPicturePath].concat(arr)
        }
        if (type == 'productParameterPicture') {
          data.proPurchaseDto.productParameterPicture = [...data.proPurchaseDto.productParameterPicture].concat(arr)
        }
        if (type == 'innerPackingDiagramPath') {
          data.proPurchaseDto.innerPackingDiagramPath = [...data.proPurchaseDto.innerPackingDiagramPath].concat(arr)
        }
      }
    }

    // 产品实拍图的删除
    const removeImgImagePath = (e, type) => {
      if (type == 'imagePath') {
        data.proPurchaseDto.imagePath.map((item, index) => {
          if (item == e) {
            data.proPurchaseDto.imagePath.splice(index, 1)
          }
        })
      }
      if (type == 'packPicturePath') {
        data.proPurchaseDto.packPicturePath.map((item, index) => {
          if (item == e) {
            data.proPurchaseDto.packPicturePath.splice(index, 1)
          }
        })
      }
      if (type == 'productParameterPicture') {
        data.proPurchaseDto.productParameterPicture.map((item, index) => {
          if (item.indexOf('http://kte-development.oss-cn-chengdu.aliyuncs.com/') !== -1) {
            if (item == e) {
              data.proPurchaseDto.productParameterPicture.splice(index, 1)
            }
          } else {
            if (ossBaseURL + item == e) {
              data.proPurchaseDto.productParameterPicture.splice(index, 1)
            }
          }
        })
      }
      if (type == 'innerPackingDiagramPath') {
        data.proPurchaseDto.innerPackingDiagramPath.map((item, index) => {
          if (item.indexOf('http://kte-development.oss-cn-chengdu.aliyuncs.com/') !== -1) {
            if (item == e) {
              data.proPurchaseDto.innerPackingDiagramPath.splice(index, 1)
            }
          } else {
            if (ossBaseURL + item == e) {
              data.proPurchaseDto.innerPackingDiagramPath.splice(index, 1)
            }
          }
        })
      }
    }

    // 根据链接查询属性列表
    const getAttribute = (link) => {
      if (link && link != '') {
        if (judgeIsUrl(link)) {
          data.attributeLoading = true
          api.product
            .getType({ link: link })
            .then((res) => {
              if (res.code == 200) {
                data.attributeLoading = false
                if (res.data.length > 0) {
                  data.attributeMatchingList = res.data
                } else {
                  vue.$message.warning('当前链接暂无1688属性！')
                }
              } else {
                data.attributeLoading = false
                vue.$message({
                  type: 'warning',
                  message: res.msg,
                })
              }
            })
            .catch((e) => {
              data.attributeLoading = false
            })
        } else {
          vue.$message.warning('当前链接不合法，请填写正确链接！')
        }
      } else {
        vue.$message({
          type: 'warning',
          message: '请保证参考链接不为空！',
        })
      }
    }

    // 文件上传  patentPath proDirectionPath  proCePath
    const pushFile = (e, type) => {
      console.log(e, type)
      if (e && e.length > 0) {
        // data.proPurchaseDto
        let arr = []
        e.map((item, index) => {
          item.link = item.url + '?name=' + item.name
          arr.push(item.link)
        })
        // 产品专利
        if (type == 'patentPath') {
          data.proPurchaseDto.patentPath = arr.join(',')
        }
        // 说明书
        if (type == 'proDirectionPath') {
          data.proPurchaseDto.proDirectionPath = arr.join(',')
        }
        // CE、欧代
        if (type == 'proCePath') {
          data.proPurchaseDto.proCePath = arr.join(',')
        }
      } else {
        if (type == 'patentPath') {
          data.proPurchaseDto.patentPath = ''
        }
        // 说明书
        if (type == 'proDirectionPath') {
          data.proPurchaseDto.proDirectionPath = ''
        }
        // CE、欧代
        if (type == 'proCePath') {
          data.proPurchaseDto.proCePath = ''
        }
      }
    }

    // 文件删除  patentPath proDirectionPath  proCePath
    const removeFileBook = (e, type) => {
      console.log(e, type)
      if (e && e.length > 0) {
        let arr = []
        e.map((item, index) => {
          item.link = item.url + '?name=' + item.name
          arr.push(item.link)
        })
        // 产品专利
        if (type == 'patentPath') {
          data.proPurchaseDto.patentPath = arr.join(',')
        }
        // 说明书
        if (type == 'proDirectionPath') {
          data.proPurchaseDto.proDirectionPath = arr.join(',')
        }
        // CE、欧代
        if (type == 'proCePath') {
          data.proPurchaseDto.proCePath = arr.join(',')
        }
      } else {
        if (type == 'patentPath') {
          data.proPurchaseDto.patentPath = ''
        }
        // 说明书
        if (type == 'proDirectionPath') {
          data.proPurchaseDto.proDirectionPath = ''
        }
        // CE、欧代
        if (type == 'proCePath') {
          data.proPurchaseDto.proCePath = ''
        }
      }
    }

    //产品说明书change事件
    const changeInstructionBook = (e) => {
      if (e && e != '') {
        data.isInstructionBook = e == '无说明书' ? false : true
      }
    }

    //开票类型字段change
    const changeInvoiceType = (e) => {
      if (e == 3) {
        data.proPurchaseDto.taxPoint = ''
        data.purchaseFromRules.taxPoint[0] = { required: false, message: '请输入税点', trigger: 'blur' }
      } else {
        data.purchaseFromRules.taxPoint[0] = { required: true, message: '请输入税点', trigger: 'blur' }
      }
    }

    // 点击复制
    const copyText = (text) => {
      documentCopy(text)
    }

    return {
      ...refData,
      getMsg,
      closed,
      purchaseFrom,
      submit,
      calculate,
      handleInspection,
      addQualityInfo,
      deleteQualityInfo,
      saveQualityInfo,
      UploadImage,
      receive,
      fileUpload,
      proPurchaseDtoF,
      getApiMsg,
      saveSubmit,
      rowClass,
      handChange,
      jump,
      removeImgImagePath,
      getAttribute,
      packPicturePath,
      productParameterPicture,
      innerPackingDiagramPath,
      pushFile,
      removeFileBook,
      checkBoxEd,
      changeCertified,
      getModuleID,
      getProStatus,
      attributeBlur,
      handleScroll,
      changeInstructionBook,
      changeInvoiceType,
      isRight,
      copyText,
    }
  },
}
</script>
<style scoped lang="scss">
.product-form {
  display: flex;
  flex-direction: column;

  :deep(.is-disabled) input,
  :deep(.is-disabled) textarea{
    color:#909399
  }
  
  .product-item {
    display: flex;

    .filebadge {
      position: relative;
      right: -100px;
      color: #409eff;
      font-size: 18px;
      top: -80px;
      z-index: 10;
    }

    .item-box {
      display: flex;
    }

    .product-text {
      font-size: 12px;
      color: rgb(150, 150, 150);
      margin: 0 0 0 10px;
    }
  }

  .el-input,
  .el-cascader,
  .el-select {
    width: 300px;
  }
}

.supplier {
  margin-left: 20px;
}

.table-box {
  width: 100%;
}

.proMarketInfo {
  padding: 0 0 0 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .el-table {
    margin: 0 0 30px 0;
  }
}

.delivery {
  position: relative;

  .delivery-child {
    position: absolute;
    top: 10px;
    right: v-bind(isRight);
  }
}
</style>
