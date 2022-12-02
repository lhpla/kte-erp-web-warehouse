<!-- 产品库搜索 -->
<template>
  <div id="SearchPanel">
    <el-form :model="searchParam" ref="searchForm" size="mini" class="demo-form-inline el-from" :inline="true">
      <div class="form-content" :class="{ collapseClass: searchShow }">
        <div style="display: flex; flex-wrap: wrap">
          <!-- 1 -->
          <el-form-item prop="productSku" class="SearchPanel-form-item">
            <div style="width: 240px; display: flex">
              <el-select
                v-model="searchParam.skuType"
                size="mini"
                filterable
                @change="skuChange"
                style="width: 100px !important; margin-right: 5px"
              >
                <el-option label="SKU模糊" value="1"></el-option>
                <el-option label="SKU精准" value="2"></el-option>
              </el-select>
              <el-input
                clearable
                style="flex: 1"
                v-if="searchParam.skuType == '1' || searchParam.skuType == ''"
                v-model="searchParam.likeSku"
                @dblclick="openInput(searchParam.likeSku, 'likeSku')"
                size="mini"
                placeholder="双击批量查询，模糊搜索"
                @keyup.enter="search"
                @clear="search"
              ></el-input>
              <el-input
                style="flex: 1"
                v-else
                v-model="searchParam.sku"
                @dblclick="openInput(searchParam.sku, 'sku')"
                clearable
                size="mini"
                placeholder="双击批量查询，精确搜索"
                @keyup.enter="search"
                @clear="search"
              ></el-input>
              <!-- <el-input
                style="flex: 1"
                v-if="searchParam.skuType == '1' || searchParam.skuType == ''"
                v-model="searchParam.likeSku"
                clearable
                size="mini"
                placeholder="模糊搜索，支持单个SKU搜索"
                @change="search"
              ></el-input>
              <el-input
                v-else
                style="flex: 1"
                v-model="searchParam.sku"
                clearable
                size="mini"
                placeholder="精确搜索，支持单个SKU搜索;可输入多个,每个以分号隔开"
                @change="search"
              ></el-input> -->
            </div>
          </el-form-item>

          <!-- <el-form-item prop="productName" class="SearchPanel-form-item">
            <el-input style="width: 125px" v-model="searchParam.productName" clearable placeholder="产品名称" @change="search"></el-input>
          </el-form-item> -->
          <el-form-item prop="nameType" class="SearchPanel-form-item">
            <div style="width: 240px; display: flex">
              <el-select
                v-model="searchParam.nameType"
                size="mini"
                filterable
                style="width: 130px !important; margin-right: 5px"
                @change="nameTypeChange"
              >
                <el-option label="产品中文名称" value="1"></el-option>
                <el-option label="产品英文名称" value="2"></el-option>
              </el-select>
              <el-input
                clearable
                style="flex: 1"
                v-if="searchParam.nameType == '1' || searchParam.nameType == ''"
                v-model="searchParam.productName"
                size="mini"
                placeholder="请输入"
                @keyup.enter="search"
                @clear="search"
              ></el-input>
              <el-input
                style="flex: 1"
                v-else
                v-model="searchParam.productEname"
                clearable
                size="mini"
                placeholder="请输入"
                @keyup.enter="search"
                @clear="search"
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item prop="exploitUserId" class="SearchPanel-form-item">
            <el-select v-model="searchParam.exploitUserId" filterable clearable placeholder="开发负责人" @change="search">
              <el-option :label="item.realName" :value="item.id" v-for="item in auditorList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="buyerId" class="SearchPanel-form-item">
            <el-select v-model="searchParam.buyerId" filterable clearable placeholder="采购负责人" @change="search">
              <el-option :label="item.name" :value="item.id" v-for="item in purchaseUserList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="spuKeyword" class="SearchPanel-form-item">
            <div style="width: 260px; display: flex">
              <el-select style="width: 130px; margin-right: 5px" v-model="searchParam.spuKeywordType" size="mini" filterable>
                <el-option label="SPU中文关键词模糊" value="1"></el-option>
                <el-option label="SPU中文关键词精准" value="0"></el-option>
                <el-option label="SPU英文关键词模糊" value="2"></el-option>
                <el-option label="SPU英文关键词精准" value="3"></el-option>
              </el-select>
              <el-input
                v-if="searchParam.spuKeywordType == '0' || searchParam.spuKeywordType == '1'"
                style="flex: 1"
                v-model="searchParam.spuKeyword"
                clearable
                size="mini"
                placeholder="双击批量查询，精确搜索"
                @keyup.enter="search"
                @clear="search"
                @dblclick="openInput(searchParam.spuKeyword, 'spuKeyword')"
              ></el-input>
              <el-input
                v-if="searchParam.spuKeywordType == '2' || searchParam.spuKeywordType == '3'"
                style="flex: 1"
                v-model="searchParam.spuEnglishKeyword"
                clearable
                size="mini"
                placeholder="双击批量查询，精确搜索"
                @keyup.enter="search"
                @clear="search"
                @dblclick="openInputEnglish(searchParam.spuEnglishKeyword, 'spuEnglishKeyword')"
              ></el-input>
            </div>
          </el-form-item>


          <!-- 2 -->
          <el-form-item prop="spu" class="SearchPanel-form-item">
            <div style="width: 240px; display: flex">
              <el-select style="width: 100px; margin-right: 5px" v-model="searchParam.spuType" size="mini" filterable @change="spuChange">
                <el-option label="SPU模糊" value="1"></el-option>
                <el-option label="SPU精准" value="2"></el-option>
              </el-select>
              <el-input
                v-if="searchParam.spuType == '1' || searchParam.spuType == ''"
                style="width: 135px"
                v-model="searchParam.likeSpu"
                clearable
                size="mini"
                placeholder="双击批量查询，模糊搜索"
                @keyup.enter="search"
                @clear="search"
                @dblclick="openInput(searchParam.likeSpu, 'likeSpu')"
              ></el-input>
              <el-input
                style="width: 135px"
                v-else
                v-model="searchParam.spu"
                clearable
                size="mini"
                placeholder="双击批量查询，精确搜索"
                @keyup.enter="search"
                @clear="search"
                @dblclick="openInput(searchParam.spu, 'spu')"
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item prop="productAttribute " class="SearchPanel-form-item">
              <el-input style="width: 125px" v-model="searchParam.spuDescription" filterable clearable placeholder="SPU描述" @change="search">
              </el-input>
          </el-form-item>

          <el-form-item prop="productClassificationId" class="SearchPanel-form-item">
            <el-cascader
              filterable
              clearable
              :options="cascaderOptions"
              @change="categoryChange"
              v-model="searchParam.productClassificationId"
              :props="cascaderRule"
              placeholder="产品分类"
              style="width: 125px !important"
            ></el-cascader>
          </el-form-item>

          <el-form-item prop="productAttribute " class="SearchPanel-form-item">
            <el-select v-model="searchParam.productAttribute" filterable clearable placeholder="商品属性" @change="search">
              <el-option label="单个商品" value="0"></el-option>
              <el-option label="组合商品" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="isSensitiveWord" class="SearchPanel-form-item">
            <el-select v-model="searchParam.isSensitiveWord" filterable clearable placeholder="是否涉及敏感词" @change="search">
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="declareStatus" class="SearchPanel-form-item">
            <el-select v-model="searchParam.declareStatus" filterable clearable placeholder="申报状态" @change="search">
              <el-option v-for="item in pro_declare_status" :key="item.dizKey" :label="item.value" :value="item.dizKey"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="isShowSupplier" prop="supplierId" class="SearchPanel-form-item">
            <SupplierPublic ref="searcSupplierPublic" @handChange="searcHandChange"></SupplierPublic>
          </el-form-item>

          <!-- 3 -->
          <el-form-item prop="overseasSynchState" class="SearchPanel-form-item">
            <div style="width: 240px; display: flex">
              <el-select
                style="width: 100px; margin-right: 5px"
                v-model="searchParam.overseasFacilitatorId"
                filterable
                clearable
                placeholder="海外仓服务商"
              >
                <el-option
                  :label="item.overseasFacilitatorCn"
                  :value="item.id"
                  v-for="item in overseasWarehouseServiceProvider"
                  :key="item.id"
                ></el-option>
              </el-select>
              <el-select
                style="flex: 1"
                v-model="searchParam.overseasSynchState"
                filterable
                clearable
                placeholder="海外仓状态"
                @change="search"
              >
                <el-option :label="item.value" :value="item.dizKey" v-for="item in overseas_synch_state" :key="item.dizKey"></el-option>
              </el-select>
            </div>
          </el-form-item>

          <el-form-item prop="salesPlatformId" class="SearchPanel-form-item">
            <el-select
              collapse-tags
              v-model="searchParam.salesPlatformId"
              multiple
              filterable
              clearable
              @change="search"
              placeholder="销售平台"
            >
              <el-option :label="item.name" :value="item.id" v-for="item in platformList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="aimWarehouse" class="SearchPanel-form-item">
            <el-select collapse-tags v-model="searchParam.aimWarehouseCodes" filterable clearable placeholder="海外仓" @change="search" multiple>
              <el-option :label="item.overseasWarehouseName+'('+item.overseasType+')'" :value="item.overseasWarehouseCode" v-for="item in overseasList" :key="item.overseasWarehouseCode"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="domesticWarehouseId" class="SearchPanel-form-item">
            <el-select collapse-tags v-model="searchParam.domesticWarehouseIds" filterable clearable placeholder="国内仓" @change="search" multiple>
              <el-option v-for="item in domesticWarehouseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="transportType" class="SearchPanel-form-item">
            <el-select collapse-tags v-model="searchParam.transportType" filterable clearable placeholder="运输方式" @change="search" multiple>
              <el-option v-for="item in logistics_transport_mode" :key="item.dizKey" :label="item.value" :value="item.dizKey"></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item prop="transportType" class="SearchPanel-form-item">
            <el-select collapse-tags v-model="searchParam.transportType" multiple clearable placeholder="运输方式" @change="search">
              <el-option v-for="item in logistics_transport_mode" :key="item.dizKey" :label="item.value" :value="item.dizKey"></el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item prop="inputUserId" class="SearchPanel-form-item">
            <el-select v-model="searchParam.inputUserId" filterable clearable placeholder="录入人" @change="search">
              <el-option :label="item.realName" :value="item.id" v-for="item in auditorList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="affiliateSalesManager" class="SearchPanel-form-item">
            <el-select
              collapse-tags
              v-model="searchParam.affiliateSalesManager"
              filterable
              multiple
              clearable
              placeholder="附属销售员"
              @change="search"
            >
              <el-option :label="item.name" :value="item.id" v-for="item in salesManagerList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>

          <!-- 4 -->
          <el-form-item prop="inventoryNumType" class="SearchPanel-form-item">
            <el-select v-model="searchParam.inventoryNumType" clearable placeholder="" @change="search">
              <el-option label="中转仓库存" :value="1"></el-option>
              <el-option label="海外仓库存" :value="2"></el-option>
            </el-select>
               从<el-input v-model="searchParam.inventoryNumStart"  @keyup.enter="search" @input="inputOriginPrice($event,'inventoryNumStart', /^([0-9]*)$/)" style="width:70px;" clearable></el-input>
               到<el-input v-model="searchParam.inventoryNumEnd"  @keyup.enter="search" @input="inputOriginPrice($event, 'inventoryNumEnd', /^([0-9]*)$/)" style="width:70px;" clearable></el-input>
          </el-form-item>

          <el-form-item prop="salesPlatformId" class="SearchPanel-form-item">
            <el-input
              style="width: 125px"
              v-model="searchParam.overseasCopyright"
              clearable
              placeholder="侵权说明"
              @change="search"
            ></el-input>
          </el-form-item>

          <el-form-item prop="proManual" class="SearchPanel-form-item">
            <el-select v-model="searchParam.proManual" clearable placeholder="产品说明书" @change="search">
              <el-option v-for="item in product_manual" :key="item.dizKey" :label="item.value" :value="item.dizKey"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="proStatus">
            <el-select collapse-tags class="statusClass" v-model="searchParam.proStatus" filterable clearable @change="search" placeholder="产品状态" multiple>
              <el-option v-for="item in pro_lib_status" :key="item.dizKey" :label="item.value" :value="item.dizKey" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="devStatus" class="SearchPanel-form-item">
            <el-select collapse-tags v-model="searchParam.devStatus" multiple filterable clearable @change="search" placeholder="开发状态">
              <el-option
                v-for="item in pro_dev_status"
                :key="item.devStatus"
                :label="item.devStatusName"
                :value="item.devStatus"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="salesManagerId" class="SearchPanel-form-item">
            <el-select v-model="searchParam.salesManagerId" filterable clearable placeholder="销售负责人" @change="search">
              <el-option :label="item.name" :value="item.id" v-for="item in salesManagerList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="isFitting" class="SearchPanel-form-item">
            <el-radio-group style="margin-top: -2px" v-model="searchParam.isFitting" @change="search">
              <el-radio-button label="2">全部</el-radio-button>
              <el-radio-button label="0">无配件</el-radio-button>
              <el-radio-button label="1">配件({{ fittingCount }})</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <!-- 5 -->
          <el-form-item style="margin-top: 1px" prop="createTime" class="SearchPanel-form-item">
            <el-date-picker
              v-model="searchParam.createTime"
              @change="dateBlur(searchParam.createTime)"
              type="datetimerange"
              range-separator="至"
              start-placeholder="提交时间开始日期"
              end-placeholder="提交时间结束日期"
              style="width: 315px"
            ></el-date-picker>
          </el-form-item>
<!--          產品庫-->
          <el-form-item>
            <div style="width: 240px; display: flex">
              <el-select style="width: 170px; margin-right: 5px" v-model="searchParam.mainSpuType" size="mini" filterable @change="mainSpuChange">
                <el-option label="原SKU模糊" value="1"></el-option>
                <el-option label="原SKU精准" value="2"></el-option>
              </el-select>
              <el-input
                  style="width: 135px"
                  v-if="searchParam.mainSpuType == '1' || searchParam.mainSpuType == ''"
                  v-model="searchParam.mainLikeSku"
                  clearable
                  size="mini"
                  placeholder="双击批量查询，精确搜索"
                  @keyup.enter="search"
                  @clear="search"
                  @dblclick="openInput(searchParam.mainLikeSku, 'mainLikeSku')"
              ></el-input>
              <el-input
                  style="width: 135px"
                  v-else
                  v-model="searchParam.mainSku"
                  clearable
                  size="mini"
                  placeholder="双击批量查询，模糊搜索"
                  @keyup.enter="search"
                  @clear="search"
                  @dblclick="openInput(searchParam.mainSku, 'mainSku')"
              ></el-input>

            </div>
          </el-form-item>
        </div>
      </div>
      <div class="footer-button">
        <el-form-item>
          <el-button type="text" size="mini" class="open" @click="searchShow = !searchShow" v-if="showSearchBtn">
            {{ searchShow ? "合并" : "展开" }}
            <i class="el-icon--right" :class="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="primary" size="mini" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject, nextTick, watch } from "vue";
import { localGet, parseTime } from "@/utils/util";
import authorButtons from "@/compositionApi/authorButtons";
import { useShowSearchBtn } from "@/compositionApi/useShowSearchBtn";
import { useRoute } from "vue-router";
export default {
  name: "ProductManageSearch",
  setup(prop, ctx) {
    const { showSearchBtn } = useShowSearchBtn();
    const route = useRoute();

    const data = reactive({
      searchParam: {
        transportType: [],
        status: "0",
        isFitting: "2",
        skuType: "1",
        spuType: "1",
        mainSku: "",
        mainLikeSku: "",
        mainSpuType: "1",
        spuKeywordType: "1",
        nameType: "1",
        inventoryNumType:1,
        inputUserId: "",
        exploitUserId: "",
        buyerId: "",
        declareStatus: "",
        salesManagerId: "",
        domesticWarehouseIds: [],
        aimWarehouseCodes:[],
        overseasCopyright: "",
        aimWarehouse: "",
        overseasSynchState: "",
        productClassificationId: "",
        // transportType: "",
        overseasFacilitatorId: "",
        proManual: "",
        createTime: "",
        productName: "",
        // affiliateSalesManager: "",
        proStatus: [],
        devStatus: [],
        affiliateSalesManager: [],
        likeSpu: route.query.encode ? route.query.encode : "",
        inventoryNumStart:'',
        inventoryNumEnd:'',
      },
      // 销售平台列表
      platformList: [],
      searchShow: false,
      cascaderOptions: [],
      // 产品分类匹配规则
      cascaderRule: {
        label: "name",
        value: "id",
        expandTrigger: "hover",
        checkStrictly: true,
      },
      // 开发负责人
      auditorList: [],
      // 采购负责人
      purchaseUserList: [],
      // 产品状态字典
      pro_lib_status: [],
      // 所有字典
      dictCodeList: [],
      // 开发状态字典
      pro_dev_status: [],
      // 申报状态字典
      pro_declare_status: [],
      // 国内仓列表
      domesticWarehouseList: [],
      // 仓库列表
      wareHouseList: [],
      // 海外仓状态列表
      overseas_synch_state: [],
      // 海外仓服务商列表
      overseasWarehouseServiceProvider: [],
      logistics_transport_mode: [],
      //产品说明书字典
      product_manual: [],
      //配件数量
      fittingCount: 0,
      //销售负责人、销售附属员列表list
      salesManagerList: [],
      isShowSupplier: false,
      showMessage: false,
      overseasList:[]
    });
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const searchForm = ref(null);
    onBeforeMount(() => {});
    onMounted(() => {
      api.product.isShowSupplier().then((res) => {
        if (res.code == 200) {
          data.isShowSupplier = res.data;
        }
      });
      getMsg();
      //获取产品库配件总数
      getFittingCount();
      // changeProStatus();
      const route = useRoute()
      if(!route.query.sku){
        search();
      }
    });

    const getMsg = () => {
      // 获取虚拟申报列表
      api.product.getOverSearCangInfo().then((res) => {
        if (res.code == 200) {
          data.overseasWarehouseServiceProvider = res.data;
        }
      });
      // 产品分类列表
      api.system.getAllCategoryList({ isDisable: 0 }).then((res) => {
        data.cascaderOptions = res.data;
      });
      // 开发负责人
      api.userOperation.getHeadOfDevelopment().then((res) => {
        if (res.code == 200) {
          data.auditorList = res.data;
        }
      });
      // 采购负责人
      api.userOperation.getHeadOfPurchasing().then((res) => {
        if (res.code == 200) {
          data.purchaseUserList = res.data;
        }
      });
      // 国内仓列表
      api.system.getWareHouseList({ type: 1 }).then((res) => {
        data.domesticWarehouseList = res.data;
      });

      // 目的仓列表
      // api.system.getWareHouseList().then((res) => {
      //   data.wareHouseList = res.data;
      // });
      // 开发状态
      api.product.getProDevStatus().then((res) => {
        if (res.code == 200) {
          data.pro_dev_status = res.data;
        }
      });
      //获取销售负责人列表、销售附属员列表
      api.system.getMarketingDepartmentList().then((res) => {
        if (res.code == 200) {
          console.log(res);
          data.salesManagerList = res.data;
        }
      });
      // 销售平台列表
      api.systemNew.getPlatformAll().then((res) => {
        if (res.code == 200) {
          data.platformList = res.data;
        }
      });
      //获取海外仓列表
      api.product.getOverseasWarehouseCodeList().then(res=>{
        if (res.code == 200) {
          data.overseasList = res.data;
        }
      })
      data.product_manual =
        localGet("dictCodeList") && localGet("dictCodeList").product_manual ? localGet("dictCodeList").product_manual : [];

      data.dictCodeList = localGet("dictCodeList");
      data.pro_lib_status = data.dictCodeList?.pro_lib_status ? data.dictCodeList?.pro_lib_status : [];
      let index = data.pro_lib_status.findIndex(item=>item.dizKey === '4')
      index != -1 && data.pro_lib_status.splice(index,1)
      data.pro_declare_status = data.dictCodeList?.pro_declare_status ? data.dictCodeList?.pro_declare_status : [];
      data.overseas_synch_state = data.dictCodeList?.overseas_synch_state ? data.dictCodeList?.overseas_synch_state : [];
      data.logistics_transport_mode = data.dictCodeList?.logistics_transport_mode ? data.dictCodeList?.logistics_transport_mode : [];
    };
    const getDataList = inject("getDataList");
    //获取产品库配件总数
    const getFittingCount = () => {
      api.product
        .getFittingCount()
        .then((res) => {
          if (res.code == 200) {
            data.fittingCount = res.data;
          }
        })
        .catch((err) => {
          data.fittingCount = 0;
        });
    };

    // 重置查询
    const reset = () => {
      vue.$router.push(vue.$route.path.split("?")[0]);
      vue.$refs.searchForm.resetFields();
      vue.$refs.searcSupplierPublic.reastValue();
      data.searchParam.likeSpu = "";
      data.searchParam.likeSku = "";
      data.searchParam.sku = "";
      data.searchParam.spu = "";
      data.searchParam.spuKeyword = "";
      data.searchParam.spuEnglishKeyword = "";
      data.searchParam.mainSpuType = "1";
      data.searchParam.mainSku = "";
      data.searchParam.mainLikeSku = "";
      // data.searchParam.skuType = "1";
      // data.searchParam.spuType = "1";
      // data.searchParam.spuKeywordType = "1";
      data.searchParam.createTime = "";
      data.searchParam.endTime = "";
      data.searchParam.startTime = "";
      data.searchParam.isFitting = "2";
      data.searchParam.inventoryNumType = 1;
      data.searchParam.proManual = "";
      data.searchParam.proStatus = []; // todo 产品库状态
      data.searchParam.salesManagerId = "";
      data.searchParam.productAttribute = "";
      data.searchParam.supplierId = "";
      data.searchParam.productSku = "";
      data.searchParam.productAttribute = "";
      data.searchParam.isSensitiveWord = "";
      data.searchParam.inputUserId = "";
      data.searchParam.exploitUserId = "";
      data.searchParam.buyerId = "";
      data.searchParam.declareStatus = "";
      data.searchParam.domesticWarehouseIds = [];
      data.searchParam.aimWarehouseCodes = [];
      data.searchParam.overseasSynchState = "";
      data.searchParam.productClassificationId = "";
      data.searchParam.overseasFacilitatorId = "";
      data.searchParam.productName = "";
      data.searchParam.productEname = "";
      data.searchParam.salesPlatformId = [];
      data.searchParam.overseasCopyright = "";
      data.searchParam.affiliateSalesManager = [];
      data.searchParam.transportType = "";
      data.searchParam.spuDescription = "";
      data.searchParam.inventoryNumStart = "";
      data.searchParam.inventoryNumEnd = "";
      getDataList(data.searchParam);
    };

    // 供应商change事件
    const searcHandChange = (e) => {
      data.searchParam.supplierId = e;
      search();
    };

    // 分类切换
    const categoryChange = (e) => {
      data.searchParam.productClassificationId = e ? e[e.length - 1] : "";
      search();
    };

    // 日期修改
    const dateBlur = (e) => {
      if (e) {
        data.searchParam.startTime = parseTime(e[0]);
        data.searchParam.endTime = parseTime(e[1]);
      } else {
        data.searchParam.startTime = "";
        data.searchParam.endTime = "";
      }
      search();
    };

    // 搜索
    const search = () => {
      if (data.searchParam.productName) {
        data.searchParam.productName = data.searchParam.productName.trim();
      }
      if (data.searchParam.spuDescription) {
        data.searchParam.spuDescription = data.searchParam.spuDescription.trim()
      }
      if (data.searchParam.overseasCopyright) {
        data.searchParam.overseasCopyright = data.searchParam.overseasCopyright.trim();
      }
      if (data.searchParam.productSku) {
        data.searchParam.productSku = data.searchParam.productSku.trim();
      }
      if (data.searchParam.spu) {
        data.searchParam.spu = data.searchParam.spu.trim().replaceAll("\n", ";")
            .replaceAll(" ", ";")
            .replaceAll(",", ";")
            .replaceAll("，", ";")
            .replaceAll("；", ";").split(";")
            .filter((item) => item !== "")
            .join(";");
      }
      if (data.searchParam.likeSpu) {
        data.searchParam.likeSpu = data.searchParam.likeSpu.trim().replaceAll("\n", ";")
            .replaceAll(" ", ";")
            .replaceAll(",", ";")
            .replaceAll("，", ";")
            .replaceAll("；", ";").split(";")
            .filter((item) => item !== "")
            .join(";");
      }

      if (data.searchParam.sku) {
        data.searchParam.sku = data.searchParam.sku.trim().replaceAll("\n", ";")
            .replaceAll(" ", ";")
            .replaceAll(",", ";")
            .replaceAll("，", ";")
            .replaceAll("；", ";").split(";")
            .filter((item) => item !== "")
            .join(";");
      }
      if (data.searchParam.likeSku) {
        data.searchParam.likeSku = data.searchParam.likeSku.trim().replaceAll("\n", ";")
            .replaceAll(" ", ";")
            .replaceAll(",", ";")
            .replaceAll("，", ";")
            .replaceAll("；", ";").split(";")
            .filter((item) => item !== "")
            .join(";");
      }
      if (data.searchParam.spuEnglishKeyword) {
        data.searchParam.spuEnglishKeyword = data.searchParam.spuEnglishKeyword.trim().replace(/；/gi, ";");
      }
      if (data.searchParam.spuKeyword) {
        data.searchParam.spuKeyword = data.searchParam.spuKeyword.trim().replace(/；/gi, ";").replace(/\s+/g, ";");
      }
      let msg = JSON.stringify(data.searchParam);
      msg = JSON.parse(msg);
      msg.transportType = String(msg.transportType).replaceAll(',',';');
      msg.scroll = 0;
      getDataList(msg);
      //获取产品库配件总数
      getFittingCount();
    };

    //skuChange
    const skuChange = (val) => {
      console.log(val);
      if (val == 2) {
        data.searchParam.sku = data.searchParam.likeSku ? data.searchParam.likeSku : data.searchParam.sku;
        data.searchParam.likeSku = "";
      } else if (val == 1) {
        data.searchParam.likeSku = data.searchParam.sku ? data.searchParam.sku : data.searchParam.likeSku;
        data.searchParam.sku = "";
      } else {
        data.searchParam.likeSku = "";
        data.searchParam.sku = "";
      }
    };

    //spuChange
    const spuChange = (val) => {
      if (val == 2) {
        data.searchParam.spu = data.searchParam.likeSpu ? data.searchParam.likeSpu : data.searchParam.spu;
        data.searchParam.likeSpu = "";
      } else if (val == 1) {
        data.searchParam.likeSpu = data.searchParam.spu ? data.searchParam.spu : data.searchParam.likeSpu;
        data.searchParam.spu = "";
      } else {
        data.searchParam.likeSpu = "";
        data.searchParam.spu = "";
      }
    };
    const mainSpuChange = (val) => {
      if (val == 1) {
        data.searchParam.mainLikeSku = data.searchParam.mainLikeSku || data.searchParam.mainSku;
        data.searchParam.mainSku = "";
      } else if (val == 2) {
        data.searchParam.mainSku = data.searchParam.mainSku || data.searchParam.mainLikeSku;
        data.searchParam.mainLikeSku = "";
      } else {
        data.searchParam.mainLikeSku = "";
        data.searchParam.mainSku = "";
      }
    };
    const spuKeywordTypeChange = () => {
      data.searchParam.spuKeyword = "";
    };

    //清楚默认下拉框
    const clearInput = (info) => {
      data.searchParam[info]="";
    }

    watch(
      () => route.query,
      (val) => {
        if (val.encode) {
          search();
          //获取产品库配件总数
          getFittingCount();
        }
      },
      { immediate: true, deep: true }
    );

    //批量搜索
    const openInput = (info, name) => {
      data.showMessage = true;
      vue
        .$prompt("可输入多个，以英文分号、逗号、空格或者回车隔开", "批量查询", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputValue: info,
          inputType: "textarea",
          inputValidator: (value) => {
            if (value && value.length > 2000) {
              return "输入字符不能大于2000 ";
            }
          },
        })
        .then(({ value }) => {
          temp.value=value
          data.searchParam[name] = temp.value
            .trim()
            .replaceAll("\n", ";")
            .replaceAll(" ", ";")
            .replaceAll(",", ";")
            .replaceAll("，", ";")
            .replaceAll("；", ";");
          data.searchParam[name] = data.searchParam[name]
            .split(";")
            .filter((item) => item !== "")
            .join(";");
          data.showMessage = false;
          temp.value = "";
        })
        .catch(() => {
          temp.value = "";
          data.showMessage = false;
        });
    };
    //批量搜索
    const openInputEnglish = (info, name) => {
      data.showMessage = true;
      vue
        .$prompt("可输入多个，以英文分号、逗号或者回车隔开", "批量查询", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputValue: info,
          inputType: "textarea",
          inputValidator: (value) => {
            if (value && value.length > 2000) {
              return "输入字符不能大于2000 ";
            }
          },
        })
        .then(({ value }) => {
          data.searchParam[name] = temp.value
            .trim()
            .replaceAll("\n", ";")
            .replaceAll(",", ";")
            .replaceAll("，", ";")
            .replaceAll("；", ";");
          data.searchParam[name] = data.searchParam[name]
            .split(";")
            .filter((item) => item !== "")
            .join(";");
          data.showMessage = false;
          temp.value = "";
        })
        .catch(() => {
          temp.value = "";
          data.showMessage = false;
        });
    };
    const temp = ref("");
    const changeProStatus = ()=>{
      // todo
      if(data.searchParam.proStatus.includes('0')&&data.searchParam.proStatus.includes('1')
        &&data.searchParam.proStatus.includes('2')&&data.searchParam.proStatus.includes('3')){
         data.searchParam.proStatus = ['4']
      }
    if(data.searchParam.proStatus.includes('4')){
      data.searchParam.proStatus = ['4']
      data.pro_lib_status.filter(item => item.dizKey != '4').forEach(item => {
          item.disabled = true;
          return item
        })
    }else {
     data.pro_lib_status.filter(item => item.dizKey != '4').forEach(item => {
        item.disabled = false;
        return item
      })
    }
    }
    // watch(
    //   ()=>data.searchParam.proStatus,
    //   (val)=>{
    //     if (val=="") {
    //       data.pro_lib_status.filter(item => item.dizKey != '4').forEach(item => {
    //         item.disabled = false;
    //         return item
    //       })
    //     }
    //   }
    // )
    watch(
      () => data.showMessage,
      (val) => {
        if (val) {
          nextTick(() => {
            let textarea = document.getElementsByTagName("textarea")[0];
            textarea.addEventListener("keydown", (e) => {
              if (e.key === "Enter") {
                const index = handleInputREnter(e);
                textarea.value = textarea.value.substring(0, index) + "\n" + textarea.value.substring(index);
              }
              temp.value = textarea.value;
            });
            textarea.addEventListener('input',()=>{
              temp.value = textarea.value;
            })
          });
        }
      }
    );
    const handleInputREnter = (e) => {
      const index = e.srcElement.selectionStart;
      return index;
    };

    const nameTypeChange = (e)=>{
        if(e=='1'){
        data.searchParam.productEname = ''
      }
        if(e=='2'){
        data.searchParam.productName = ''
      }
    }
    const inputOriginPrice = (e, index, rest) => {
      data.searchParam[index] = e.match(rest) ? e.match(rest)[0] : "";
    };
    const refData = toRefs(data);
    return {
      ...refData,
      changeProStatus,
      buttonAuthor,
      getMsg,
      reset,
      searchForm,
      search,
      searcHandChange,
      categoryChange,
      dateBlur,
      skuChange,
      spuChange,
      clearInput,
      showSearchBtn,
      openInput,
      openInputEnglish,
      handleInputREnter,
      nameTypeChange,
      inputOriginPrice,
      mainSpuChange
    };
  },
};
</script>
<style lang="scss">
#SearchPanel {
  input::-webkit-input-placeholder {
    color: #666666;
  }
  .el-select__tags-text {
    width: auto !important;
    max-width: 150px !important;
  }
  .el-from {
    padding: 0 40px;
    // .el-input {
    //   width: 125px;
    // }
    .el-select {
      width: 125px;
    }
    .el-cascader {
      width: 125px;
    }
    .searchSkuSpu {
      display: flex;
    }
    .statusClass{
      .select-trigger{
        .el-select__tags{
          .el-select__input.is-mini{
            width: 10px;
          }
        }
      }
    }

    ::v-deep .widthText-input {
      width: 620px;
      margin-left: 5px;
    }
  }
}
</style>
<style>
.form-content {
  position: relative;
  height: 30px;
  overflow: hidden;
  transition: all 0.5s !important;
}

.collapseClass {
  height: auto;
  overflow: auto;
  transition: all 1s;
}

.footer-button {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  height: 30px;
}

.circle-closebox {
  display: inline-block;
  position: relative;
}

.iconbox {
  position: absolute;
  top: 2px;
  right: 7px;
  font-size: 16px;
}
</style>
