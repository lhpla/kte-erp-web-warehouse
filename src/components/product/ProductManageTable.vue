<!-- 产品库列表格 -->
<template>
  <div id="ProductManageTable">
    <vxe-toolbar ref="vxeTableDataHead">
      <template #buttons>
        <div class="table-header">
          <el-button size="mini" type="primary" @click="handelOpen('add')" v-if="buttonAuthor.add">添加产品</el-button>
          <el-button size="mini" type="primary" @click="batchAddProduct" v-if="buttonAuthor.batchAdd"
            >导入产品</el-button
          >
          <el-button
            size="mini"
            type="primary"
            style="margin: 0 10px 0 10px"
            @click="batchExportProduct"
            v-if="buttonAuthor.export"
            >导出产品</el-button
          >
          <el-dropdown v-if="buttonAuthor.batchUpdate">
            <el-button type="primary" size="mini">
              产品更新
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="fullField" v-if="buttonAuthor.fullField">全字段模板</el-dropdown-item>
                <el-dropdown-item @click="developmentTemplate" v-if="buttonAuthor.developmentTemplate"
                  >开发常用模板
                </el-dropdown-item>
                <el-dropdown-item @click="procurementTemplate" v-if="buttonAuthor.procurementTemplate"
                  >采购常用模板
                </el-dropdown-item>
                <el-dropdown-item @click="declarationTemplate" v-if="buttonAuthor.declarationTemplates"
                  >申报信息模板
                </el-dropdown-item>
                <el-dropdown-item @click="virtualDeclarationTemplate" v-if="buttonAuthor.virtualDeclarationTemplate">
                  虚拟申报信息模板</el-dropdown-item
                >
                <el-dropdown-item @click="salesTemplate" v-if="buttonAuthor.salesTemplate"
                  >销售信息模板</el-dropdown-item
                >
                <el-dropdown-item @click="customsClearanceInfoTem" v-if="buttonAuthor.customsClearanceInfoTem"
                  >清关信息模板
                </el-dropdown-item>
                <el-dropdown-item @click="gcInfoTem" v-if="buttonAuthor.gcInfoTem">谷仓产品信息模板</el-dropdown-item>
                <el-dropdown-item v-else>暂无操作</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown v-if="buttonAuthor.batchUpdate">
            <el-button type="primary" size="mini" class="ml">
              批量操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="openPushOverseas" v-if="buttonAuthor.pushOverseas"
                  >推送海外仓服务商</el-dropdown-item
                >

                <el-dropdown-item @click="batchCombination" v-if="buttonAuthor.batchGroup"
                  >批量组合产品</el-dropdown-item
                >
                <el-dropdown-item @click="batchEdit('develop')" v-if="buttonAuthor.develop"
                  >批量修改产品(开发)
                </el-dropdown-item>
                <el-dropdown-item @click="batchEdit('purchase')" v-if="buttonAuthor.purchase"
                  >批量修改产品(采购)
                </el-dropdown-item>
                <el-dropdown-item @click="batchEdit('sale')" v-if="buttonAuthor.sale"
                  >批量修改产品(销售)</el-dropdown-item
                >
                <el-dropdown-item v-else>暂无操作</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown v-if="buttonAuthor.batchUpdate">
            <el-button type="primary" size="mini" class="ml">
              删除操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="productDeletion" v-if="buttonAuthor.delete">产品删除</el-dropdown-item>
                <el-dropdown-item @click="deleteLog" v-if="buttonAuthor.deleteLog">删除日志</el-dropdown-item>
                <el-dropdown-item v-else>暂无操作</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button type="primary" size="mini" style="margin-left: 10px" @click="openSetField">字段设置</el-button>
          <!-- <el-button size="small" class="ml" type="primary" plain @click="openSetLog">字段配置</el-button> -->
        </div>
      </template>
    </vxe-toolbar>
    <div class="table">
      <vxe-table
        ref="vxeTableData"
        :header-cell-style="{ color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
        :data="tableData"
        tooltip-effect="dark"
        @checkbox-change="handleSelectionChange"
        @checkbox-all="selectAllChangeEvent"
        v-loading="tableLoading"
        border
        :height="isFixed ? tableHeight : ''"
        id="ServiceProviderManagementTableId"
        :custom-config="{ storage: true }"
        :sort-config="{
          defaultSort: [{ field: 'field19', order: 'desc' }],
          remote: true,
          multiple: true,
        }"
        @sort-change="changeSort"
        :row-config="{ isHover: true, height: 114 }"
      >
        <vxe-column field="field1" type="checkbox" align="center" width="50"></vxe-column>
        <vxe-column field="field2" prop="pricturePath" align="center" title="产品图片" min-width="90">
          <template #default="scope">
            <el-popover placement="right" trigger="hover" width="250" v-if="scope.row.pricturePath">
              <template #reference>
                <el-image
                  style="width: 70px; height: 70px"
                  fit="contain"
                  :src="scope.row.pricturePath"
                  :preview-src-list="[scope.row.pricturePath]"
                />
              </template>
              <img
                :src="scope.row.pricturePath"
                loading="lazy"
                style="width: 400px; height: 300px; object-fit: contain"
              />
            </el-popover>
            <div v-else>暂无图片</div>
          </template>
        </vxe-column>
        <vxe-column align="center" field="field3" title="产品中文名称" show-overflow-tooltip min-width="120">
          <template #default="scope">
            <el-tooltip effect="dark" :content="scope.row.productCname" placement="bottom">
              <span class="mle1">
                {{
                  scope.row.productCname
                    ? scope.row.productCname.length > 10
                      ? scope.row.productCname.substring(0, 10) + '...'
                      : scope.row.productCname
                    : '-'
                }}
                <el-popover :width="481" placement="bottom" trigger="click">
                  <template #reference>
                    <i class="el-icon-info" @click="getSendYibinStauts(scope.row.id)"></i>
                  </template>
                  <div v-if="sendResultList.length">
                    <el-table
                      :data="sendResultList"
                      v-loading="sendLoading"
                      :header-cell-style="{
                        background: '#fafafa',
                        color: '#2d2f30',
                        fontWeight: 'bold',
                        fontSize: '12px',
                      }"
                    >
                      <el-table-column align="center" width="130" property="sku" label="SKU"></el-table-column>
                      <el-table-column align="center" width="200" property="reason" label="原因"></el-table-column>
                      <el-table-column align="center" width="150" property="createTime" label="时间"></el-table-column>
                    </el-table>
                  </div>
                  <div v-else class="ac">暂无数据</div>
                </el-popover>
              </span>
            </el-tooltip>
          </template>
        </vxe-column>
        <vxe-column align="center" field="productEname" title="产品英文名称" show-overflow-tooltip min-width="120">
          <template #default="scope">
            <el-tooltip effect="dark" :content="scope.row.productEname" placement="top">
              <div>
                <div class="over" style="width: 110px">{{ scope.row.productEname ? scope.row.productEname : '-' }}</div>
              </div>
            </el-tooltip>
          </template>
        </vxe-column>
        <vxe-column align="center" field="field4" title="系统编码" prop="systemCode" min-width="100">
          <template #default="scope">
            <div class="spanStyle">
              <span>{{ scope.row.systemCode ? scope.row.systemCode : '-' }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column prop="productSku" field="sku" title="SKU" show-overflow-tooltip min-width="100">
          <template #default="scope">
            <span @click="handelOpen('edit', scope.row, '', false)" class="nameHover mle1">
              {{ scope.row.productSku ? scope.row.productSku : '暂无SKU' }}
            </span>
            <i v-if="scope.row.productSku" class="el-icon-document-copy" @click="copyText(scope.row.productSku)"></i>
          </template>
        </vxe-column>
        <vxe-column align="center" field="field5" title="SPU" prop="proSpu" min-width="70">
          <template #default="scope">
            <div class="spanStyle">
              <span>{{ scope.row.proSpu ? scope.row.proSpu : '-' }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column align="center" field="field6" title="SPU中文关键词" prop="spuChineseKeyword" min-width="105">
          <template #default="scope">
            <div class="spanStyle">
              <span>{{ scope.row.spuChineseKeyword ? scope.row.spuChineseKeyword : '-' }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column
          align="center"
          field="spuEnglishKeyword"
          title="SPU英文关键词"
          prop="spuEnglishKeyword"
          min-width="105"
        >
          <template #default="scope">
            <div class="spanStyle">
              <span>{{ scope.row.spuEnglishKeyword ? scope.row.spuEnglishKeyword : '-' }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column align="center" field="field8" title="SPU描述" prop="spuDescription" min-width="80">
          <template #default="scope">
            <span v-if="scope.row.spuDescription.length > 10">
              <el-tooltip effect="dark" :content="scope.row.spuDescription" placement="top">
                <div>{{ scope.row.spuDescription.substring(0, 10) }}...</div>
              </el-tooltip>
            </span>
            <span v-else>
              {{ scope.row.spuDescription }}
            </span>
          </template>
        </vxe-column>
        <vxe-column align="left" field="packageSize" title="包装尺寸" prop="overseasCopyright" min-width="100">
          <template #default="scope">
            <div class="spanStyle">
              <span v-if="scope.row.proVolume">
                包装尺寸：{{ `${scope.row.domesticLength}*${scope.row.domesticWidth}*${scope.row.domesticHeight}(cm)` }}
              </span>
              <span v-else>包装尺寸：{{ '-' }}</span>
              <br />
              <span>毛重：{{ scope.row.grossWeight ? scope.row.grossWeight + '(kg)' : '-' }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column align="center" field="overseasCopyright" title="侵权说明" prop="overseasCopyright" min-width="80">
          <template #default="scope">
            <div class="spanStyle">
              <span>{{ scope.row.overseasCopyright ? scope.row.overseasCopyright : '-' }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column align="center" field="field9" title="原SKU" prop="mainSku" min-width="70">
          <template #default="scope">
            <div class="spanStyle">
              <span>{{ scope.row.mainSku ? scope.row.mainSku : '-' }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column align="center" field="field10" title="总库存" width="110">
          <template #default="scope">
            <div class="mle1">
              <div>
                中转仓：
                <span v-if="scope.row.domesticInventory>1000">
                  <el-tooltip effect="dark" :content="scope.row.domesticInventory.toString()" placement="top">
                    <span style="cursor: pointer" @click="handelOpen('edit', scope.row, 'view', false)" class="color-red">
                      {{scope.row.domesticInventory.toString().substring(0,4) + '...'}}
                    </span>
                  </el-tooltip>
                </span>
                <span style="cursor: pointer" @click="handelOpen('edit', scope.row, 'view', false)" class="color-red" v-else>
                  {{scope.row.domesticInventory <1000? scope.row.domesticInventory : '0' }}
                </span>
                <!-- <span
                  style="cursor: pointer"
                  @click="handelOpen('edit', scope.row, 'view', false)"
                  class="color-red"
                  >{{ scope.row.domesticInventory ? scope.row.domesticInventory : '0' }}</span
                > -->
              </div>
              <div>海外仓：{{ scope.row.overseasInventory ? scope.row.overseasInventory : '0' }}</div>
            </div>
          </template>
        </vxe-column>
        <vxe-column
          align="center"
          field="field11"
          prop="overseasFacilitatorCn"
          title="已同步海外仓服务商"
          show-overflow-tooltip
          min-width="100"
        >
          <template #default="scope">
            <div v-show="!scope.row.overseasFacilitatorCn && scope.row.isSuccessFop == 0">-</div>
            <div v-show="scope.row.overseasFacilitatorCn">
              <span class="nameHover">{{
                scope.row.overseasFacilitatorCn ? scope.row.overseasFacilitatorCn : '-'
              }}</span>
              <span @click="handelAbnormal(scope.row)" class="color-red" v-if="scope.row.overseasSynchState == 3"
                >(异常)</span
              >
            </div>
            <div v-show="scope.row.isSuccessFop != 0">
              <span class="nameHover">{{
                (scope.row.isSuccessFop && scope.row.isSuccessFop == 1) ||
                (scope.row.isSuccessFop && scope.row.isSuccessFop == 2)
                  ? '递四方'
                  : '-'
              }}</span>
              <span @click="handelAbnormalpx(scope.row)" class="color-red" v-if="scope.row.isSuccessFop == 2"
                >(异常)</span
              >
            </div>
          </template>
        </vxe-column>
        <vxe-column
          align="center"
          field="field12"
          prop="proStatus"
          title="产品状态"
          show-overflow-tooltip
          min-width="130"
        >
          <template #default="scope">
            <div>产品状态：{{ tableTypeComputed(scope.row.proStatus, 'pro_lib_status') }}</div>
            <div>开发状态：{{ tableTypeComputedDev(scope.row.devStatus, 'pro_dev_status') }}</div>
            <div>申报状态：{{ tableTypeComputed(scope.row.declareStatus, 'pro_declare_status') }}</div>
          </template>
        </vxe-column>
        <vxe-column title="产品分类" field="field13" min-width="70">
          <template #default="scope">
            <el-tooltip effect="dark" :content="scope.row.productClassification" placement="bottom">
              <span class="mle1">{{ scope.row.productClassification ? scope.row.productClassification : '-' }}</span>
            </el-tooltip>
          </template>
        </vxe-column>
        <vxe-column title="供应商名称" field="field14" min-width="70">
          <template #default="scope">
            <el-tooltip effect="dark" :content="scope.row.supplierName" placement="bottom">
              <span class="mle1">{{ scope.row.supplierName ? scope.row.supplierName : '-' }}</span>
            </el-tooltip>
          </template>
        </vxe-column>
        <vxe-column title="采购价(不含税)" field="field15" prop="purchasePrice" show-overflow-tooltip min-width="80">
          <template #default="scope">
            <span>{{ scope.row.purchasePrice ? Number(scope.row.purchasePrice).toFixed(2) : '暂无' }}</span>
          </template>
        </vxe-column>
        <vxe-column title="供应链端负责人" field="field16" show-overflow-tooltip min-width="140">
          <template #default="scope">
            <!--  @click="aaaaa(scope.row)"  v-if="scope.row.exploitUserName" -->
            <div>开发：{{ scope.row.exploitUserName ? scope.row.exploitUserName : '-' }}</div>
            <div>采购：{{ scope.row.purchaseUserName ? scope.row.purchaseUserName : '-' }}</div>
            <div v-if="scope.row.salesManagerName">
              销售：{{
                tableSalename(scope.row.salesManagerName).length > 1
                  ? tableSalename(scope.row.salesManagerName)[0]
                  : scope.row.salesManagerName
              }}
              <el-popover
                v-if="tableSalename(scope.row.salesManagerName).length > 1"
                placement="top"
                :width="200"
                trigger="click"
              >
                <template #reference>
                  <span class="hover-title">更多</span>
                </template>
                <template #default>
                  <span>{{ scope.row.salesManagerName }}</span>
                </template>
              </el-popover>
            </div>
            <div v-if="scope.row.informationMan">咨询：{{ scope.row.informationMan }}</div>
            <div>补货： {{ scope.row.replenishmentClerkName ? scope.row.replenishmentClerkName : '-' }}</div>
          </template>
        </vxe-column>
        <vxe-column title="运营端负责人" field="field17" show-overflow-tooltip min-width="140">
          <template #default="scope">
            <div v-if="scope.row.operationMsg && scope.row.operationMsg.length">
              <el-tooltip effect="dark" placement="top">
                <div>
                  <div v-for="(item, index) of scope.row.operationMsg" :key="index">
                    <span v-if="index < 4">{{ item.length > 10 ? item.substring(0, 10) + '...' : item }}</span>
                  </div>
                  <div v-show="scope.row.operationMsg.length > 4">...</div>
                </div>
                <template #content>
                  <div style="max-width: 500px">
                    <div v-for="(item, ind) of scope.row.operationMsg" :key="item + ind">{{ item }}</div>
                  </div>
                </template>
              </el-tooltip>
            </div>
            <div v-else>-</div>
          </template>
        </vxe-column>
        <vxe-column prop="productAttribute" field="field18" title="是否组合商品" show-overflow-tooltip min-width="110">
          <template #default="scope">
            <span style="cursor: pointer" @click="goto(scope.row)">{{
              scope.row.productAttribute == 0 ? '单个商品' : '组合商品'
            }}</span>
          </template>
        </vxe-column>
        <vxe-column align="center" field="field19" title="生成资料时间" sortable min-width="110">
          <template #default="scope">
            <span class="mle1">{{ scope.row.createTime ? scope.row.createTime : '-' }}</span>
          </template>
        </vxe-column>
        <vxe-column align="center" field="field20" title="操作" width="170" fixed="right">
          <template #default="scope">
            <!-- <div style="display: flex; flex-direction: column; align-items: center; justify-content: center"> -->
            <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center">
              <el-button
                link
                type="text"
                size="mini"
                @click="copyProduct(scope.row.isFitting == '1' ? 2 : 1, scope.row)"
                v-if="buttonAuthor.copy"
                >复制
              </el-button>
              <el-button
                link
                type="text"
                size="mini"
                @click="copyProduct(2, scope.row)"
                v-if="buttonAuthor.fitting && scope.row.devStatus !== '13'"
                >新增配件</el-button
              >
              <el-button
                link
                type="text"
                size="mini"
                @click="copyProduct(3, scope.row)"
                v-if="buttonAuthor.secondHand && scope.row.devStatus !== '13'"
                >新增二手</el-button
              >
              <el-button
                type="text"
                link
                size="mini"
                v-if="buttonAuthor.editInfo"
                @click="handelOpen('edit', scope.row, '', true)"
                >编辑</el-button
              >
              <el-button type="text" link size="mini" v-if="buttonAuthor.saleInfoEdit" @click="openSaleInfo(scope.row)">
                销售信息
              </el-button>
              <el-button type="text" link size="mini" @click="openLog(scope.row)" v-if="buttonAuthor.log"
                >日志</el-button
              >
            </div>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <el-dialog
      v-model="secondHandDialogVisible"
      title="提示"
      width="28%"
      :close-on-click-modal="false"
      @closed="onCancel"
    >
      <div style="margin-bottom: 30px; font-size: 14px">
        <i class="el-icon-warning" style="margin-right: 5px; font-size: 16px"></i>确认新增二手？
      </div>
      <el-form size="small" :model="secondHandFormData" label-width="120px" :rules="rule">
        <el-form-item label="销售平台 :" prop="platformId">
          <el-select v-model="secondHandFormData.platformId" class="m-2" placeholder="选择对应平台" size="small">
            <el-option v-for="item in platformOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <!-- todo-->
        <el-form-item label="产品中文名称" prop="chineseName">
          <el-input v-model="secondHandFormData.chineseName" type="textarea" maxlength="200" show-word-limit :rows="2">
          </el-input>
        </el-form-item>
        <el-form-item label="产品英文名称" prop="englishName">
          <el-input v-model="secondHandFormData.englishName" type="textarea" maxlength="200" show-word-limit :rows="2">
          </el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="secondHandFormData.remark" type="textarea" maxlength="500" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="small">取消</el-button>
          <el-button type="primary" size="small" @click="onSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <CompositeProducts ref="CompositeProducts"></CompositeProducts>
    <BulkChanges ref="BulkChanges"></BulkChanges>
    <AllDownDialog ref="AllDownDialog"></AllDownDialog>
    <!-- 推送海外仓服务商弹框  -->
    <PushOverseas ref="pushOverseas"></PushOverseas>
    <!-- 新增 -->
    <AddProductPop ref="AddProductPop"></AddProductPop>
    <!-- 编辑 -->
    <ProductPopup ref="ProductPopup"></ProductPopup>
    <!-- 选择导出 -->
    <SelectExport ref="SelectExport"></SelectExport>
    <!-- 删除日志 -->
    <DeleteLog ref="DeleteLog"></DeleteLog>
    <ProductLog ref="ProductLog"></ProductLog>
    <!-- 批量更新 -->
    <input type="file" accept=".xlsx" ref="updateExcelFrom" @change="updateChange" style="display: none" />
    <!-- 字段配置 -->
    <ProductManageSet ref="ProductManageSet"></ProductManageSet>
    <!-- 销售信息 -->
    <SalesInformationDialog ref="SalesInformationDialog"></SalesInformationDialog>

    <el-dialog title="字段设置" v-model="fieldVisible" :close-on-click-modal="false">
      <el-form :model="fieldModel">
        <el-form-item label="" prop="checkAll" style="margin-bottom: 0px">
          <el-checkbox @change="changeAll" v-model="fieldModel.checkAll" label="全选" :indeterminate="indeterminate">
          </el-checkbox>
        </el-form-item>
        <el-form-item label="" prop="fields">
          <el-checkbox-group v-model="fieldModel.fields" style="display: flex; flex-wrap: wrap">
            <el-checkbox
              @change="changeItem"
              style="width: 20%"
              v-for="item in fieldList"
              :label="item.id"
              :key="item.id"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" size="small" @click="setField">保存</el-button>
        <el-button size="small" @click="reductionField">还原</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  ref,
  onBeforeMount,
  onMounted,
  computed,
  getCurrentInstance,
  inject,
  nextTick,
  watch,
} from 'vue'
import authorButtons from '@/compositionApi/authorButtons'
import CompositeProducts from '@/components/product/popup/CompositeProducts.vue'
import BulkChanges from '@/components/product/popup/BulkChanges.vue'
import PushOverseas from '@/components/product/popup/PushOverseas.vue'
import AddProductPop from '@/components/product/popup/AddProductPop.vue'
import ProductPopup from '@/components/product/popup/ProductPopup.vue'
import SelectExport from '@/components/product/popup/SelectExport.vue'
import DeleteLog from '@/components/product/popup/DeleteLog.vue'
import ProductManageSet from '@/components/product/popup/ProductManageSet.vue'
import ProductLog from '../../components/product/popup/ProductLog.vue'
import SalesInformationDialog from './popup/SalesInformationDialog.vue'
import { localGet, documentCopy, localSet } from '@/utils/util'
import tablePage from '@/compositionApi/tablePage'
import { useTableHeight } from '@/compositionApi/useTableHeight.js'
import { fieldList } from './fieldList'
import {useRoute} from "vue-router";

export default {
  name: 'ProductManageTable',
  props: ['tableData', 'tableLoading', 'searchMsg', 'isFixed'],
  components: {
    CompositeProducts,
    BulkChanges,
    PushOverseas,
    AddProductPop,
    ProductPopup,
    SelectExport,
    DeleteLog,
    ProductLog,
    ProductManageSet,
    SalesInformationDialog,
  },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons()
    const buttonAuthor = BUTTONS.value
    const { dataService, download } = tablePage()
    const vxeTableData = ref(null)
    const vxeTableDataHead = ref(null)
    const { tableHeight } = useTableHeight(275)
    const getDataList = inject('getDataList')
    const data = reactive({
      // 所有字典
      dictCodeList: [],
      pro_lib_status: [],
      pro_dev_status: [],
      pro_declare_status: [],
      multipleList: [],
      sendResultList: [],
      sendLoading: false,
      // exLoding: false,
      //当前编辑的产品Id
      proId: '',
      //新增二手弹窗显示控制
      secondHandDialogVisible: false,
      secondHandFormData: {
        //新增二手选中的平台
        platformId: '',
        //备注
        remark: '',
        chineseName: '',
        englishName: '',
      },
      //平台下拉框数据
      platformOptions: [],
      rule: {
        platformId: [{ required: true, message: '请选择平台', trigger: 'blur' }],
        chineseName: [{ required: true, message: '请输入产品中文名称', trigger: 'blur' }],
        englishName: [{ required: true, message: '请输入产品英文名称', trigger: 'blur' }],
      },
      fieldVisible: false,
      fieldModel: {
        checkAll: false,
        fields: [],
      },
      fieldId: '',
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http

    const getField = () => {
      api.product
        .getUserCustomField({
          type: 'productManage',
        })
        .then((res) => {
          const $table = vxeTableData.value
          if (res.data.id && res.data.id !== -1) {
            data.fieldId = res.data.id
          }
          if (res.data.field.length === 0) {
            data.fieldModel.fields = fieldList.map((item) => item.id)
            data.fieldModel.checkAll = true
          } else {
            data.fieldModel.fields = res.data.field
          }
          const checkedArr = []
          const noCheckedArr = []
          fieldList.map((item) => {
            if (data.fieldModel.fields.includes(item.id)) {
              checkedArr.push(item.id)
            } else {
              noCheckedArr.push(item.id)
            }
          })
          checkedArr.map((item) => {
            $table.showColumn($table.getColumnByField(item))
          })
          noCheckedArr.map((item) => {
            $table.hideColumn($table.getColumnByField(item))
          })
          $table.refreshColumn()
        })
    }

    const openSetField = () => {
      data.fieldVisible = true
      data.fieldModel.checkAll = data.fieldModel.fields.length === fieldList.length
      getField()
    }
    const setField = () => {
      const $table = vxeTableData.value
      if (data.fieldModel.fields.length === 0) {
        vue.$message.warning('请至少选择一个字段')
        return
      }
      if (!data.fieldId) {
        api.product
          .createUserCustomField({
            type: 'productManage',
            field: data.fieldModel.fields,
          })
          .then((res) => {
            if (res.code === 200) {
              vue.$message.success(res.msg)
            } else {
              vue.$message.warning(res.msg)
            }
          })
      } else {
        api.product
          .updateUserCustomField({
            type: 'productManage',
            field: data.fieldModel.fields,
            id: data.fieldId,
          })
          .then((res) => {
            if (res.code === 200) {
              vue.$message.success(res.msg)
            } else {
              vue.$message.warning(res.msg)
            }
          })
      }
      const checkedArr = []
      const noCheckedArr = []
      fieldList.map((item) => {
        if (data.fieldModel.fields.includes(item.id)) {
          checkedArr.push(item.id)
        } else {
          noCheckedArr.push(item.id)
        }
      })
      checkedArr.map((item) => {
        $table.showColumn($table.getColumnByField(item))
      })
      noCheckedArr.map((item) => {
        $table.hideColumn($table.getColumnByField(item))
      })
      $table.refreshColumn()
      data.fieldVisible = false
    }
    const reductionField = () => {
      const $table = vxeTableData.value
      data.fieldModel.fields = fieldList.map((item) => item.id)
      if (!data.fieldId) {
        api.product
          .createUserCustomField({
            type: 'productManage',
            field: data.fieldModel.fields,
          })
          .then((res) => {
            if (res.code === 200) {
              vue.$message.success(res.msg)
            } else {
              vue.$message.warning(res.msg)
            }
          })
      } else {
        api.product
          .updateUserCustomField({
            type: 'productManage',
            field: data.fieldModel.fields,
            id: data.fieldId,
          })
          .then((res) => {
            if (res.code === 200) {
              vue.$message.success(res.msg)
            } else {
              vue.$message.warning(res.msg)
            }
          })
      }
      data.fieldModel.fields.map((item) => {
        $table.showColumn($table.getColumnByField(item))
      })
      $table.refreshColumn()
      data.fieldVisible = false
    }

    const changeAll = () => {
      if (data.fieldModel.checkAll) {
        data.fieldModel.fields = fieldList.map((item) => item.id)
      } else {
        data.fieldModel.fields = []
      }
    }

    const changeItem = () => {
      data.fieldModel.checkAll = data.fieldModel.fields.length === fieldList.length
    }

    const indeterminate = computed(() => {
      return data.fieldModel.fields.length > 0 && data.fieldModel.fields.length < fieldList.length
    })

    // 跳转组合商品
    const goto = (row) => {
      if (row.productAttribute != 0) {
        const isPro =
          process.env.NODE_ENV === 'master' || process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'state'
        const url = isPro
          ? '/main/warehouse/product/combinationProduct/list'
          : '/warehouse/product/combinationProduct/list'
        window.open(`${url}?sku=${row.productSku}`)
      }
    }

    onBeforeMount(() => {})
    onMounted(() => {
      dataService.value = 'product'
      getMsg()
      nextTick(() => {
        // 将表格和工具栏进行关联
        const $table = vxeTableData.value
        const $toolbar = vxeTableDataHead.value
        $table.connect($toolbar)
      })
      getField()
      const route =useRoute()
      // if(route.query.sku){
      //   handelOpen('edit',vue.tableData[0],'',false)
      // }
    })

    const refData = toRefs(data)
    const table = ref(null)

    // 获取基本信息
    const getMsg = () => {
      api.product.getProDevStatus().then((res) => {
        if (res.code == 200) {
          data.pro_dev_status = res.data
        }
      })
      data.dictCodeList = localGet('dictCodeList')
      data.pro_lib_status = data.dictCodeList.pro_lib_status ? data.dictCodeList.pro_lib_status : []
      data.pro_declare_status = data.dictCodeList.pro_declare_status ? data.dictCodeList.pro_declare_status : []
    }

    //  查看同步异常
    const handelAbnormal = (row) => {
      vue.$alert(`<strong style="font-weight:bold">同步异常:</strong> <div>${row.overseasFailReason}}</div>`, '提示', {
        dangerouslyUseHTMLString: true,
        type: 'warning',
      })
    }

    //  查看同步异常
    const handelAbnormalpx = (row) => {
      vue.$alert(`<strong style="font-weight:bold">同步异常:</strong> <div>${row.fopFailReason}}</div>`, '提示', {
        dangerouslyUseHTMLString: true,
        type: 'warning',
      })
    }

    //删除日志
    const deleteLog = () => {
      vue.$refs.DeleteLog.checkLogDialog()
    }

    // 批量选择
    // const handleSelectionChange = (row) => {
    //   data.multipleList = row;
    // };

    // 批量选择
    // const handleSelectionChange = (row) => {
    //   data.multipleList = row;
    // };

    // 批量选择
    const handleSelectionChange = ({ $table }) => {
      data.multipleList = $table.getCheckboxRecords()
    }
    // 全选中的表格数据
    const selectAllChangeEvent = ({ $table }) => {
      data.multipleList = $table.getCheckboxRecords()
    }

    // 点击复制
    const copyText = (text) => {
      documentCopy(text)
    }

    // 批量组合
    const batchCombination = () => {
      data.combinationData = { groupName: '', groupProSkuList: [] }
      if (data.multipleList && data.multipleList.length < 2) {
        vue.$message.warning('请至少选择两条产品信息！')
        return
      }

      let combinationData = { groupName: '', groupProSkuList: [] }
      data.multipleList.forEach((item) => {
        combinationData.groupProSkuList.push({
          groupProSku: item.productSku,
          amount: 1,
        })
      })
      vue.$refs.CompositeProducts.getMsg(combinationData)
    }

    // 打开批量修改
    const batchEdit = (text) => {
      if (data.multipleList && data.multipleList.length < 1) {
        vue.$message.warning('请至少选择一条产品信息！')
        return
      }

      let editParam = { sku: [] }
      data.multipleList.forEach((item) => {
        editParam.sku.push(item.productSku)
      })
      let msg = {
        isBatchEdit: text,
        multipleList: data.multipleList,
        editParam: editParam,
      }
      vue.$refs.BulkChanges.getMsg(msg)
    }

    // 批量添加
    const batchAddProduct = () => {
      let info = {
        title: '产品列表模板',
        temp: 'exportProductTemplate',
        import: 'importProduct',
        servers: 'product',
        dataApi: 'getProductList',
        isUpdate: 0,
      }
      nextTick(() => {
        vue.$refs.AllDownDialog.checkDialog(true, info)
      })
    }

    // 批量导出产品基础信息
    const batchExportProduct = () => {
      let pids = []
      for (let item of data.multipleList) {
        pids.push(item.id)
      }
      vue.$refs.SelectExport.getMsg(pids, vue.searchMsg)
    }

    //fullField 全字段模板
    const fullField = () => {
      let info = {
        title: '产品列表全字段模板',
        temp: 'exportVarietyTemplate',
        import: 'updateProduct',
        servers: 'product',
        dataApi: 'getProductList',
        type: 1,
      }
      nextTick(() => {
        vue.$refs.AllDownDialog.checkDialog(true, info)
      })
    }

    //developmentTemplate 开发模板
    const developmentTemplate = () => {
      let info = {
        title: '产品列表开发常用模板',
        temp: 'exportVarietyTemplate',
        import: 'batchUpdateProBasicInfo',
        servers: 'product',
        dataApi: 'getProductList',
        type: 3,
      }
      nextTick(() => {
        vue.$refs.AllDownDialog.checkDialog(true, info)
      })
    }

    // procurementTemplate  采购模板
    const procurementTemplate = () => {
      let info = {
        title: '产品列表采购常用模板',
        temp: 'exportVarietyTemplate',
        import: 'proManagerBatchUpdatePurchase',
        servers: 'product',
        dataApi: 'getProductList',
        type: 2,
      }
      nextTick(() => {
        vue.$refs.AllDownDialog.checkDialog(true, info)
      })
    }

    //declarationTemplate  申报信息模板
    const declarationTemplate = () => {
      let info = {
        title: '产品列表申报信息模板',
        temp: 'exportVarietyTemplate',
        import: 'batchUpdateDeclareInfo',
        servers: 'product',
        dataApi: 'getProductList',
        type: 4,
      }
      nextTick(() => {
        vue.$refs.AllDownDialog.checkDialog(true, info)
      })
    }

    //virtualDeclarationTemplate   虚拟申报模板
    const virtualDeclarationTemplate = () => {
      let info = {
        title: '产品列表虚拟申报模板',
        temp: 'exportVarietyTemplate',
        import: 'proManagerUpdateVirtualDeclare',
        servers: 'product',
        dataApi: 'getProductList',
        type: 5,
      }
      nextTick(() => {
        vue.$refs.AllDownDialog.checkDialog(true, info)
      })
    }

    //salesTemplate  销售信息模板
    const salesTemplate = () => {
      let info = {
        title: '产品列表开发销售信息模板',
        temp: 'exportVarietyTemplate',
        import: 'batchUpdateProMarketInfo',
        servers: 'product',
        dataApi: 'getProductList',
        type: 6,
      }
      nextTick(() => {
        vue.$refs.AllDownDialog.checkDialog(true, info)
      })
    }

    //清关信息模板
    const customsClearanceInfoTem = () => {
      let info = {
        title: '产品列表清关信息模板',
        temp: 'exportVarietyTemplate',
        import: 'declareCustomsExcelImport',
        servers: 'product',
        dataApi: 'getProductList',
        type: 7,
      }
      nextTick(() => {
        vue.$refs.AllDownDialog.checkDialog(true, info)
      })
    }

    //谷仓产品信息模板
    const gcInfoTem = () => {
      let info = {
        title: '产品列表谷仓产品信息模板',
        temp: 'exportVarietyTemplate',
        import: 'batchUpdateGoodCangProductInfo',
        servers: 'product',
        dataApi: 'getProductList',
        type: 8,
      }
      nextTick(() => {
        vue.$refs.AllDownDialog.checkDialog(true, info)
      })
    }

    const updateExcelFrom = ref(null)
    // 批量更新事件
    const updateChange = () => {
      let updateExcelFile = updateExcelFrom.value.files[0]
      let excelData = new FormData()
      excelData.append('file', updateExcelFile)
      api.product.updateProduct(excelData).then((res) => {
        if (res.code == 200) {
          vue.$message.success(res.msg)
          getDataList()
        } else {
          vue.$message.warning(res.msg)
        }
      })
    }
    // 计算表格显示字典
    const tableTypeComputed = computed(() => {
      return function (dizKey, itemName) {
        let value = ''
        if (data[itemName] && data[itemName].length && dizKey !== -1) {
          data[itemName].forEach((item) => {
            if (item.dizKey == dizKey) {
              value = item.value
            }
          })
        }
        return value
      }
    })

    // 打开编辑添加dialog框
    const handelOpen = (text, row, view, isEdit) => {
      // if (!buttonAuthor.operation) {
      //   vue.$message.warning("暂无权限");
      // } else {
      let info = {
        row: row,
        text: text,
        view: view,
        isEdit: isEdit,
      }
      if (text == 'add') {
        localSet('isAdd', true)
        vue.$refs.AddProductPop.getMsg(info)
      } else if (text == 'edit') {
        localSet('isAdd', false)
        vue.$refs.ProductPopup.getMsg(info)
      }
      // }
    }

    // 推送海外仓服务商
    const openPushOverseas = () => {
      if (data.multipleList && data.multipleList.length < 1) {
        vue.$message.warning('请至少选择一条产品信息！')
        return
      }
      let productSkuList = []
      for (let item of data.multipleList) {
        if (item.productSku) {
          productSkuList.push(item.productSku)
        } else {
          vue.$message.warning('sku不能为空!')
          return
        }
      }
      let obj = {
        productSkuList: productSkuList,
        ids: data.multipleList.map((item) => item.id),
      }
      vue.$refs.pushOverseas.getMsg(obj)
    }

    // 计算表格显示字典  开发状态
    const tableTypeComputedDev = computed(() => {
      return function (dictKey, itemName) {
        let value = ''
        if (data[itemName] && data[itemName].length && dictKey !== -1) {
          data[itemName].forEach((item) => {
            if (item.devStatus == dictKey) {
              value = item.devStatusName
            }
          })
        }
        return value
      }
    })

    // 产品删除按钮
    const productDeletion = () => {
      if (data.multipleList.length > 0) {
        vue
          .$confirm('产品删除，请谨慎操作！ 删除条件：1产品不能有库存记录 2不能有采购记录 3不能有关联订单', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(() => {
            let idList = []
            data.multipleList.map((item) => {
              idList.push(item.id)
            })
            api.product.deleteProductInfo(idList).then((res) => {
              if (res.code == 200) {
                console.log(res)
                vue.$message({
                  type: 'success',
                  message: res.msg,
                })
                getDataList()
              } else {
                vue.$message({
                  type: 'warning',
                  message: res.msg,
                })
              }
            })
          })
      } else {
        vue.$message({
          type: 'warning',
          message: '请至少选择一条数据进行操作！',
        })
      }
    }
    //获取推送易仓是否成功
    const getSendYibinStauts = (id) => {
      data.sendLoading = true
      data.sendResultList = []
      api.product
        .getSendYibinStauts({ id: id })
        .then((res) => {
          if (res.code == 200) {
            data.sendResultList = res.data
            data.sendLoading = false
          } else {
            vue.$message.warning(res.msg)
            data.sendLoading = false
          }
        })
        .catch((err) => {
          data.sendLoading = false
        })
    }

    // 复制当前产品
    const copyProduct = (type, row) => {
      let obj = {
        proId: row.id,
        sku: row.productSku,
        isFitting: row.isFitting,
      }
      console.log('obj', obj)
      if (type == 1) {
        vue
          .$confirm('确认复制当前产品?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(() => {
            data.isProduct = 'copy'
            vue.$refs.AddProductPop.getCopyMsg(1, obj)
          })
          .catch(() => {})
      } else if (type == 2) {
        vue
          .$confirm('确认新增配件?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(() => {
            data.isProduct = 'copy'
            vue.$refs.AddProductPop.getCopyMsg(2, obj)
          })
          .catch(() => {})
      } else if (type == 3) {
        data.secondHandDialogVisible = true
        data.proId = row.id
        //获取对应平台列表
        api.system.getAllPlatform().then((res) => {
          if (res.code == 200) {
            data.platformOptions = res.data
          }
        })
        //获取备注信息 todo
        api.product.getRemarkByProId({ pid: data.proId }).then((res) => {
          if (res.code == 200) {
            console.log(res)
            data.secondHandFormData.remark = res.data.remark
            data.secondHandFormData.chineseName = res.data.chineseName
            data.secondHandFormData.englishName = res.data.englishName
          }
        })
      }
    }

    const onSubmit = () => {
      const ruleArr = [
        data.secondHandFormData.platformId == '',
        data.secondHandFormData.chineseName == '',
        data.secondHandFormData.englishName == '',
      ]
      if (ruleArr.some((item) => item)) {
        vue.$message({
          type: 'warning',
          message: '请选择对应平台',
        })
        return
      }
      // if (data.secondHandFormData.remark == '') {
      //   vue.$message({
      //     type: 'warning',
      //     message: '请填写备注信息',
      //   })
      //   return
      // }
      api.system
        .addSecondSku({
          proId: data.proId,
          platformId: data.secondHandFormData.platformId,
          remark: data.secondHandFormData.remark,
          chineseName: data.secondHandFormData.chineseName,
          englishName: data.secondHandFormData.englishName,
        })
        .then((res) => {
          if (res.code == 200) {
            vue.$message({
              type: 'success',
              message: res.msg,
            })
            data.platformId = ''
            data.secondHandDialogVisible = false
          } else {
            vue.$message({
              type: 'warning',
              message: res.msg,
            })
          }
        })
    }
    const onCancel = () => {
      data.secondHandFormData.platformId = ''
      data.secondHandFormData.remark = ''
      data.secondHandDialogVisible = false
    }

    //排序时间
    const changeSort = (val) => {
      if (val.order == 'asc') {
        if (val.property == 'field19') {
          vue.searchMsg.sortType = 1
        }
        getDataList(vue.searchMsg)
      }
      if (val.order == 'desc') {
        if (val.property == 'field19') {
          vue.searchMsg.sortType = 0
        }
        getDataList(vue.searchMsg)
      }
    }

    //计算字段长度
    const tableSalename = computed(() => {
      return function (str) {
        let arr = []
        arr = str.split(',')
        return arr
      }
    })
    //计算字段长度
    const tableoperationMsg = computed(() => {
      return function (str) {
        return str.join(' ')
      }
    })
    //打开字段配置弹出层
    const openSetLog = () => {
      vue.$refs.ProductManageSet.openDialog()
    }

    const openLog = (row) => {
      nextTick(() => {
        let info = {
          proId: row.id,
          sku: row.productSku,
          actionModule: '7',
        }
        vue.$refs.ProductLog.checkLogDialog(info)
      })
    }

    const openSaleInfo = (row) => {
      if (row) {
        let obj = {
          proId: row.id,
          sku: row.productSku,
          isFitting: row.isFitting,
          devStatus: row.devStatus,
        }
        nextTick(() => {
          vue.$refs.SalesInformationDialog.getApiMsg(obj)
        })
      }
    }
    return {
      ...refData,
      setField,
      reductionField,
      openSetField,
      changeAll,
      changeItem,
      indeterminate,
      tableHeight,
      changeSort,
      copyProduct,
      onSubmit,
      onCancel,
      dataService,
      download,
      vxeTableData,
      vxeTableDataHead,
      tableHeight,
      buttonAuthor,
      tableTypeComputed,
      getMsg,
      copyText,
      handleSelectionChange,
      batchCombination,
      batchEdit,
      batchAddProduct,
      batchExportProduct,
      updateChange,
      updateExcelFrom,
      handelOpen,
      openPushOverseas,
      tableTypeComputedDev,
      productDeletion,
      handelAbnormal,
      table,
      deleteLog,
      fullField,
      developmentTemplate,
      procurementTemplate,
      declarationTemplate,
      virtualDeclarationTemplate,
      salesTemplate,
      getSendYibinStauts,
      customsClearanceInfoTem,
      selectAllChangeEvent,
      vxeTableData,
      vxeTableDataHead,
      tableSalename,
      gcInfoTem,
      openSetLog,
      openLog,
      goto,
      openSaleInfo,
      tableoperationMsg,
      handelAbnormalpx,
      fieldList,
    }
  },
}
</script>

<style lang="scss">
#ProductManageTable {
  .vxe-custom--option {
    height: 23px;
  }

  .vxe-tools--operate {
    .vxe-custom--option-wrapper {
      .vxe-custom--header li,
      .vxe-custom--body li {
        span.vxe-checkbox--label {
          vertical-align: -webkit-baseline-middle;
        }
      }
    }
  }

  .el-icon-document-copy {
    margin-left: 5px;
    color: #409eff;
    cursor: pointer;
  }

  .el-icon-info {
    color: #409eff;
    cursor: pointer;
    font-size: 18px;
  }

  .ml {
    margin-left: 10px;
  }

  .over {
    width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .hover-title {
    color: #409eff;
    cursor: pointer;
  }

  .hover-title:hover {
    border-bottom: 1px solid #409eff;
  }
}
</style>
