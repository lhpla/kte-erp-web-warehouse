<!--基础信息 -->
<template>
  <div>
    <div v-loading="formLoading" style="min-height: 650px">
      <el-form v-show="!formLoading" element-loading-background="rgba(255,255,255, 1)" ref="productFrom"
        :rules="productFromRules" :model="proBasicInfoDto" size="mini" class="product-form" label-width="160px">
        <div class="product-item">
          <el-form-item label="产品SKU:" prop="productSku">
            <div class="el-productSku">
              {{
                  proBasicInfoDto.productSku
                    ? proBasicInfoDto.productSku
                    : "暂无SKU"
              }}
              <span v-if="proBasicInfoDto.isFitting == 1">(配件)</span>
              <span v-if="proBasicInfoDto.devStatus == 10">(二手)</span>
            </div>
          </el-form-item>
          <el-form-item label="产品SPU:" prop="proSpu">
            <!-- <el-input
              v-model="proBasicInfoDto.proSpu"
              clearable
              placeholder="数字加字母加“-”组合"
              style="width:200px"
            ></el-input>-->
            <el-select v-model="proBasicInfoDto.proSpu" clearable filterable @change="onSPUChange" :disabled="!isEdit">
              <el-option v-for="item in spuOptions" :key="item.id" :label="item.label" :value="item.spuCode">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="主(原)SKU:" v-if="proBasicInfoDto.mainSku">
            <span style="display: inline-block; width: 300px">{{
                proBasicInfoDto.mainSku
            }}</span>
          </el-form-item>

          <el-form-item label="产品分类:" prop="productClassificationId">
            <el-cascader style="width: 300px" :options="cascaderOptions"
              v-model="proBasicInfoDto.productClassificationId" clearable :props="cascaderRule" filterable
              @change="onChange" :disabled="!isEdit"></el-cascader>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="产品中文名称:" prop="productCname">
            <el-input v-model="proBasicInfoDto.productCname" filterable clearable placeholder="请填写产品中文名称"
              :disabled="!isEdit"></el-input>
          </el-form-item>
          <el-form-item label="产品英文名称:" prop="productEname">
            <el-input v-model.trim="proBasicInfoDto.productEname" filterable clearable placeholder="请填写产品英文名称"
              :disabled="!isEdit"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label=" " prop="supplierName" label-width="50px">
            <!-- <el-checkbox v-model="proBasicInfoDto.isPin">插头电压</el-checkbox>
            <el-checkbox v-model="proBasicInfoDto.voltage">电压(不带插头)</el-checkbox>-->
            <el-checkbox v-model="proBasicInfoDto.isCharged" :disabled="!isEdit">是否带电池</el-checkbox>
            <el-checkbox v-model="proBasicInfoDto.isMagnetic" :disabled="!isEdit">是否带磁</el-checkbox>
            <el-checkbox v-model="proBasicInfoDto.isPhotograph" :disabled="!isEdit">是否需要拍照</el-checkbox>
            <el-checkbox v-model="proBasicInfoDto.isCe" :disabled="!isEdit">是否需要CE、欧代</el-checkbox>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="插头电压:" prop="plugAndVoltage" class="plugAndVoltage">
            <el-select v-model="proBasicInfoDto.plugAndVoltage" filterable clearable placeholder="插头电压"
              @change="onPlugChange" :disabled="!isEdit">
              <el-option v-for="item in plugVoltageOptions" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品参数:" prop="productParameter">
            <el-input v-model="proBasicInfoDto.productParameter" clearable placeholder="请填写产品参数" :disabled="!isEdit">
            </el-input>
          </el-form-item>
        </div>
        <div class="product-item" style="margin-bottom: 50px">
          <el-form-item label="产品图片:" style="height: 100px; width: 460px" prop="pricturePath">
            <span v-if="
              proBasicInfoDto.pricturePath &&
              proBasicInfoDto.pricturePath !== ''
            " class="imgBox">
              <i v-if="isEdit" class="el-icon-circle-close filebadge" type="primary"
                @click="removeImg(proBasicInfoDto, 'pricturePath')"></i>
              <el-popover placement="right" trigger="hover" width="250">
                <template #reference>
                  <el-image style="width: 100px; height: 100px" fit="contain" :src="proBasicInfoDto.pricturePath">
                  </el-image>
                </template>
                <el-image :src="proBasicInfoDto.pricturePath" style="width: 400px; height: 300px" fit="contain">
                </el-image>
              </el-popover>
            </span>
            <span v-else>
              <span v-if="isEdit" class="commonNote">仅支持上传jpg/png格式文件，单个文件不能超过5M</span>
              <UploadImage :isEdit="isEdit" ref="UploadImage" @clickFu="receive"></UploadImage>
            </span>
          </el-form-item>
          <el-form-item label="竞品链接:" prop="competitorLinking" class="link">
            <el-input v-model.trim="proBasicInfoDto.competitorLinking" clearable placeholder="请输入" :disabled="!isEdit">
            </el-input>
            <el-tooltip v-model="tooltipFlag1" placement="top" content="可认为是某个平台销量最好的链接" :manual="true"
              ref="tooltipRef">
              <i class="el-icon-question" @click="tooltipFlag1 = !tooltipFlag1" style="color: red"></i>
            </el-tooltip>
            <i v-if="proBasicInfoDto.competitorLinking" class="el-icon-document-copy"
              @click="copyText(proBasicInfoDto.competitorLinking)"></i>
          </el-form-item>
        </div>
        <div class="product-item">
          <!-- <el-form-item label="海外版权:" prop="overseasCopyright">
            <el-input v-model="proBasicInfoDto.overseasCopyright" clearable placeholder="请输入是否侵权"></el-input>
          </el-form-item>-->
          <el-form-item label="产品关键词:" prop="proKeywords">
            <el-input v-model="proBasicInfoDto.proKeywords" clearable placeholder="请输入" :disabled="!isEdit"></el-input>
            <el-tooltip v-model="tooltipFlag" placement="top" content="英文关键词" :manual="true" ref="tooltipRef">
              <i class="el-icon-question" @click="tooltipFlag = !tooltipFlag" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="运营方式:" prop="operationManner" label-width="148px">
            <el-select v-model="proBasicInfoDto.operationManner" filterable clearable placeholder="请选择运营方式"
              :disabled="!isEdit">
              <el-option :label="item.value" :value="item.dizKey" v-for="item in operate_type" :key="item.dizKey">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item style="position:relative" label="参考链接:" prop="supplierLink">
            <el-input v-model="proBasicInfoDto.supplierLink" clearable placeholder="请输入链接" :disabled="!isEdit">
            </el-input>
            <i style="position:absolute;right:-15px;top:9px" v-if="proBasicInfoDto.supplierLink"
              class="el-icon-document-copy" @click="copyText(proBasicInfoDto.supplierLink)"></i>
          </el-form-item>
          <el-form-item label="运输方式:" prop="transportWay">
            <el-select v-model="proBasicInfoDto.transportWay" filterable clearable multiple placeholder="请选择"
              :disabled="!isEdit">
              <el-option v-for="item in logistics_transport_mode" :key="item.dizKey" :label="item.value"
                :value="item.dizKey"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="开发负责人:" prop="exploitUserId">
            <el-select v-model="proBasicInfoDto.exploitUserId" filterable clearable placeholder="请选择开发负责人"
              @change="onExploitUserIdChange" :disabled="!isEdit">
              <el-option :label="item.realName" :value="item.id" v-for="item in auditorList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开发状态:" prop="devStatus">
            <el-select v-model="proBasicInfoDto.devStatus" filterable clearable placeholder="请选择开发状态"
              :disabled="!isEdit">
              <el-option v-for="item in pro_dev_status" :key="item.devStatus" :label="item.devStatusName"
                :value="item.devStatus"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="电压:" prop="proVoltage">
            <el-input v-model="proBasicInfoDto.proVoltage" clearable placeholder="请输入电压" :disabled="!isEdit"></el-input>
          </el-form-item>
          <el-form-item label="插头规格:" prop="plugSpecification">
            <el-input v-model="proBasicInfoDto.plugSpecification" clearable placeholder="请输入插头规格" :disabled="!isEdit">
            </el-input>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="咨询负责人:" prop="informationManId">
            <el-select v-model="proBasicInfoDto.informationManId" filterable clearable placeholder="请选择咨询负责人"
              :disabled="!isEdit">
              <el-option :label="item.realName" :value="item.id" v-for="item in auditorList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="额定（海关）税率:" prop="customsTariff">
            <el-input v-model="proBasicInfoDto.customsTariff" clearable placeholder="请输入税率" :disabled="!isEdit">
            </el-input>%
          </el-form-item>
        </div>

        <div class="product-item">
          <el-form-item label="是否季节性产品:" style="width: 39.5%">
            <el-radio-group v-model="proBasicInfoDto.isSeasonal" @change="isSeasonalChange" :disabled="!isEdit">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
            <el-tooltip v-model="tooltipFlag2" placement="top" content="确定产品是否有某个季节销量特别高" :manual="true"
              ref="tooltipRef" style="margintop: 24px">
              <i class="el-icon-question" @click="tooltipFlag2 = !tooltipFlag2" style="color: red"></i>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="季节性属性:" prop="seasonalAttribute" v-if="proBasicInfoDto.isSeasonal != 0">
            <el-checkbox-group v-model="proBasicInfoDto.seasonalAttribute" :disabled="!isEdit">
              <el-checkbox label="1">春</el-checkbox>
              <el-checkbox label="2">夏</el-checkbox>
              <el-checkbox label="3">秋</el-checkbox>
              <el-checkbox label="4">冬</el-checkbox>
            </el-checkbox-group>
            <el-tooltip v-model="tooltipFlag5" style="position: absolute; top: 8px; right: -20px" placement="top"
              content="针对于地理位置处于北半球的季节" :manual="true" ref="tooltipRef">
              <i class="el-icon-question" @click="tooltipFlag5 = !tooltipFlag5" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="是否销售芝加哥:">
            <el-radio-group v-model="proBasicInfoDto.isSellChicago" :disabled="!isEdit">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="是否需要虚拟申报:">
            <div class="el-productSku">
              <el-radio-group v-model="proBasicInfoDto.isVirtualDeclaration" :disabled="!isEdit">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
              <el-button style="margin-left: 20px" v-if="proBasicInfoDto.isVirtualDeclaration == 1"
                @click="openVirtualDeclaration">虚拟申报信息</el-button>
            </div>
          </el-form-item>
        </div>

        <div>
          <el-form-item label="竞品刊登类目:" prop="listedCategory">
            <el-input class="remark" v-model="proBasicInfoDto.listedCategory" clearable type="textarea" size="mini"
              :rows="3" placeholder="请输入竞品刊登类目" :disabled="!isEdit"></el-input>
            <el-tooltip v-model="tooltipFlag3" placement="top" content="竞品链接的在BS中刊登的类目（全部基于美国Amazon分类）" :manual="true"
              ref="tooltipRef" class="dont-submit">
              <i class="el-icon-question" @click="tooltipFlag3 = !tooltipFlag3" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
        </div>

        <div>
          <!-- infringementThat -->
          <el-form-item label="侵权说明:" prop="overseasCopyright">
            <el-input class="remark" v-model="proBasicInfoDto.overseasCopyright" clearable type="textarea" size="mini"
              :rows="3" placeholder="请输入侵权说明" :disabled="!isEdit"></el-input>
            <el-tooltip v-model="tooltipFlag4" placement="top" content="海外销售市场侵权说明" :manual="true" ref="tooltipRef"
              class="dont-submit">
              <i class="el-icon-question" @click="tooltipFlag4 = !tooltipFlag4" style="color: red"></i>
            </el-tooltip>
          </el-form-item>
        </div>

        <div>
          <el-form-item label="备注:" prop="proRemark">
            <el-input class="remark" v-model="proBasicInfoDto.proRemark" clearable type="textarea" size="mini" :rows="3"
              placeholder="请输入备注" :disabled="!isEdit"></el-input>
          </el-form-item>
        </div>

        <div>
          <el-form-item label="开发状态变更说明:" prop="descriptionDevStatusChange">
            <el-input class="remark" v-model="proBasicInfoDto.descriptionDevStatusChange" clearable type="textarea"
              size="mini" :rows="3" placeholder="请输入开发状态变更说明" :disabled="!isEdit"></el-input>
          </el-form-item>
        </div>
        <!-- 1 -->
        <!-- 虚拟申报弹框 -->
        <VirtualDeclarationLog ref="VirtualDeclarationLog" :productData="productData"></VirtualDeclarationLog>
        <el-form-item v-if="isEdit">
          <div class="form-btn-footer" v-if="isAdd">
            <el-button icon="el-icon-circle-check" type="primary" @click="saveSubmit" :loading="submitActive"
              :disabled="submitActive" size="mini">保 存</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  ref,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
  nextTick,
  inject,
} from "vue";
import VirtualDeclarationLog from "@/components/product/popup/VirtualDeclarationLog.vue";
import { localGet, documentCopy } from "@/utils/util";
export default {
  name: "BasicInformation",
  components: {
    VirtualDeclarationLog,
  },
  setup(prop, ctx) {
    const data = reactive({
      isEdit: true,
      formLoading: false, //表单loading
      tooltipFlag: false,
      tooltipFlag1: false,
      tooltipFlag2: false,
      tooltipFlag3: false,
      tooltipFlag4: false,
      tooltipFlag5: false,
      spuOptions: [],
      proBasicInfoDto: {
        seasonalAttribute: [],
        plugAndVoltage: "",
      },
      //插头电压下拉框
      plugVoltageOptions: [],
      // 产品基础信息校验规则
      productFromRules: {
        plugAndVoltage: [
          { required: true, message: "请选择插头电压", trigger: "change" },
        ],
        seasonalAttribute: [
          { required: true, message: "请选择季节性属性", trigger: "change" },
        ],
        // productSku: [{ required: true, message: "请填写产品SKU", trigger: "blur" }],
        productCname: [
          { required: true, message: "请填写产品中文名称", trigger: "blur" },
        ],
        proSpu: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            pattern: /^[A-Z\d\-]+$/,
            message: "大写字母加数字或'-'",
            trigger: "blur",
          },
        ],
        productEname: [
          { required: true, message: "请填写产品英文名称", trigger: "blur" },
        ],
        pricturePath: [
          { required: true, message: "请上传图片", trigger: "change" },
        ],
        productClassificationId: [
          { required: true, message: "请选择产品分类", trigger: "change" },
        ],
        supplierLink: [
          { required: false, message: "请填写供应商链接", trigger: "blur" },
          {
            pattern: /(http|https):\/\/([\w.]+\/?)\S*/gi,
            message: "输入链接格式不正确，请输入正确链接！",
          },
          { max: 500, message: "输入长度已超出最大范围500字符" },
        ],
        suggestedPrice: [
          { required: true, message: "请填写建议售价", trigger: "blur" },
          {
            pattern:
              /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: "正数,两位小数",
          },
        ],
        exploitUserId: [
          { required: true, message: "请选择开发负责人", trigger: "change" },
        ],
        competitorLinking: [
          { required: true, message: "请输入竞品链接", trigger: "blur" },
          {
            pattern: /(http|https):\/\/([\w.]+\/?)\S*/gi,
            message: "输入链接格式不正确，请输入正确链接！",
          },
          { max: 500, message: "输入长度已超出最大范围500字符" },
        ],
        productParameter: [
          { required: true, message: "请输入产品参数", trigger: "blur" },
        ],
        proKeywords: [
          { required: true, message: "请输入产品关键词", trigger: "blur" },
        ],
        listedCategory: [
          { required: true, message: "请输入竞品刊登类目", trigger: "blur" },
        ],
        descriptionDevStatusChange: [
          { max: 500, message: "输入长度已超出最大范围500字符" },
        ],
        devStatus: [{ required: false, message: "请选择开发状态", trigger: "blur" }]
      },
      cascaderOptions: [],
      // 产品分类匹配规则
      cascaderRule: {
        label: "name",
        value: "id",
        expandTrigger: "hover",
        checkStrictly: true,
      },
      logistics_transport_mode: [],
      pro_dev_status: [],
      operate_type: [],
      auditorList: [], //开发负责人和咨询负责人使用相同数据源
      productData: {},
      isAdd: false,
      submitActive: false,
      flag: false, //控制产品spu
      proStatus: "",
      isFirstGetDetail: false,
    });

    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const virtualDeclVo = inject("virtualDeclVo");
    onBeforeMount(() => { });
    onMounted(() => {
      //获取插头电压
      api.develop.getAllPlugVoltage().then((res) => {
        if (res.code == 200) {
          data.plugVoltageOptions = res.data;
        }
      });

      window.addEventListener("scroll", handleScroll, true);
      // if (data.proBasicInfoDto.plugAndVoltage == "") {
      //   data.proBasicInfoDto.plugAndVoltage = "无插头无电压";
      // }
    });

    const onPlugChange = (e) => {
      // console.log(e);
      // console.log(data.proBasicInfoDto.plugAndVoltage);
    };
    // 获取基础信息
    const getBasinfoMsg = () => {
      // 获取信息
      data.cascaderOptions = [];
      api.system.getAllCategoryList({ isDisable: 0 }).then((res) => {
        if (res.code == 200) {
          data.cascaderOptions = res.data;
        }
      });
      data.auditorList = [];
      api.userOperation.getHeadOfDevelopment().then((res) => {
        if (res.code == 200) {
          data.auditorList = res.data;
        }
      });

      // 开发状态
      data.pro_dev_status = [];
      api.product.getProDevStatus().then((res) => {
        if (res.code == 200) {
          data.pro_dev_status = res.data;
        }
      });
      data.logistics_transport_mode =
        localGet("dictCodeList") &&
          localGet("dictCodeList").logistics_transport_mode
          ? localGet("dictCodeList").logistics_transport_mode
          : [];
      data.operate_type =
        localGet("dictCodeList") && localGet("dictCodeList").operate_type
          ? localGet("dictCodeList").operate_type
          : [];
    };

    // 新增
    const getMsg = (proBasicInfoDto, flag) => {
      getBasinfoMsg();
      // data.flag = flag !== "" ? flag : false;
      data.isAdd = false;
      let file = {
        imgLimit: 1,
        isUpdate: true,
        fileList: {
          url:
            proBasicInfoDto && proBasicInfoDto.pricturePath
              ? proBasicInfoDto.pricturePath
              : "",
        },
        pathName: "warehouse/product/productLibrary/img",
      };
      nextTick(() => {
        if (UploadImage.value) {
          UploadImage.value.getImgMsg(file);
        }
      });
      if (proBasicInfoDto) {
        data.proBasicInfoDto = proBasicInfoDto;
        // data.proBasicInfoDto.mainSku = 'xxxxxx'
        data.proBasicInfoDto.informationManId =
          data.proBasicInfoDto.informationManId > 0
            ? data.proBasicInfoDto.informationManId
            : "";
        data.proBasicInfoDto.customsTariff =
          data.proBasicInfoDto.customsTariff > 0
            ? data.proBasicInfoDto.customsTariff
            : "13";
        data.proBasicInfoDto.isCe = data.proBasicInfoDto.isCe == 1;
        // data.proBasicInfoDto.isPin = data.proBasicInfoDto.isPin == 1;
        // data.proBasicInfoDto.voltage = data.proBasicInfoDto.voltage == 1;
        data.proBasicInfoDto.isCharged = data.proBasicInfoDto.isCharged == 1;
        data.proBasicInfoDto.isMagnetic = data.proBasicInfoDto.isMagnetic == 1;
        data.proBasicInfoDto.isPhotograph =
          data.proBasicInfoDto.isPhotograph == 1;
        data.proBasicInfoDto.operationManner = data.proBasicInfoDto
          .operationManner
          ? data.proBasicInfoDto.operationManner
          : "1";
        data.proBasicInfoDto.transportWay = data.proBasicInfoDto.transportWay
          ? data.proBasicInfoDto.transportWay.split(",")
          : [];
        data.proBasicInfoDto.seasonalAttribute = data.proBasicInfoDto
          .seasonalAttribute
          ? data.proBasicInfoDto.seasonalAttribute.split(",")
          : [];
        data.proBasicInfoDto.productParameter = data.proBasicInfoDto
          .productParameter
          ? data.proBasicInfoDto.productParameter
          : "无";
        data.proBasicInfoDto.exploitUserId =
          data.proBasicInfoDto.exploitUserId == -1
            ? ""
            : data.proBasicInfoDto.exploitUserId;
        console.log(data.proBasicInfoDto, "9827");
      } else {
        let file = {
          imgLimit: 1,
          isUpdate: true,
          fileList: { url: "" },
          pathName: "warehouse/product/productLibrary/img",
        };
        nextTick(() => {
          if (UploadImage.value) {
            UploadImage.value.getImgMsg(file);
          }
        });
        // 新增时--》 默认选项设置
        data.proBasicInfoDto = {
          isPhotograph: true,
          customsTariff: "13",
          isVirtualDeclaration: 0,
          operationManner: "1",
          productParameter: "无",
          isSeasonal: 0,
          isSellChicago: 0,
          seasonalAttribute: [],
          plugAndVoltage: "无插头无电压",
        };
      }
      getSpuByCategory();
    };

    // 修改
    const getApiMsg = (msg) => {
      data.isEdit = msg.isEdit;
      //改变校验规则
      //产品中文名称/产品英文名称/开发负责人/开发状态
      // const rule = ['productCname','productEname','exploitUserId','devStatus']
      // if(msg.devStatus == '10')
      // rule.forEach(item=>{
      //   data.productFromRules[item][0].required = !data.productFromRules[item][0].required
      // })

      getBasinfoMsg();
      data.productData = msg;
      // data.flag = true;
      data.isAdd = true;
      getProBasicInfo(data.productData);
    };
    // 获取详情
    const getProBasicInfo = (msg) => {
      data.proBasicInfoDto = { seasonalAttribute: [] };
      data.formLoading = true;
      api.productLibrary.getProBasicInfo(msg).then((res) => {
        if (res.code == 200) {
          data.proBasicInfoDto = res.data;
          //获取mainSku
          // data.proBasicInfoDto.mainSku = 'xxxxxx'
          data.proBasicInfoDto.informationManId =
            data.proBasicInfoDto.informationManId > 0
              ? data.proBasicInfoDto.informationManId
              : "";
          data.proBasicInfoDto.customsTariff =
            data.proBasicInfoDto.customsTariff > 0
              ? data.proBasicInfoDto.customsTariff
              : "13";
          data.proBasicInfoDto.isCe = data.proBasicInfoDto.isCe == 1;
          // data.proBasicInfoDto.isPin = data.proBasicInfoDto.isPin == 1;
          // data.proBasicInfoDto.voltage = data.proBasicInfoDto.voltage == 1;
          data.proBasicInfoDto.isCharged = data.proBasicInfoDto.isCharged == 1;
          data.proBasicInfoDto.isMagnetic =
            data.proBasicInfoDto.isMagnetic == 1;
          data.proBasicInfoDto.isPhotograph =
            data.proBasicInfoDto.isPhotograph == 1;
          data.proBasicInfoDto.operationManner = data.proBasicInfoDto
            .operationManner
            ? data.proBasicInfoDto.operationManner
            : "1";
          data.proBasicInfoDto.productClassificationId =
            data.proBasicInfoDto.productClassificationId &&
              data.proBasicInfoDto.productClassificationId != -1
              ? data.proBasicInfoDto.productClassificationId
              : "";
          data.proBasicInfoDto.transportWay = data.proBasicInfoDto.transportWay
            ? data.proBasicInfoDto.transportWay.split(",")
            : [];
          data.proBasicInfoDto.seasonalAttribute = data.proBasicInfoDto
            .seasonalAttribute
            ? data.proBasicInfoDto.seasonalAttribute.split(",")
            : [];
          data.proBasicInfoDto.productParameter = data.proBasicInfoDto
            .productParameter
            ? data.proBasicInfoDto.productParameter
            : "无";
          data.proBasicInfoDto.exploitUserId =
            data.proBasicInfoDto.exploitUserId == -1
              ? ""
              : data.proBasicInfoDto.exploitUserId;
          data.formLoading = false;
          getSpuByCategory();
        } else {
          vue.$message.warning(res.msg);
          data.formLoading = false;
        }
      });
      let file = {
        imgLimit: 1,
        isUpdate: true,
        fileList: {
          url:
            data.proBasicInfoDto && data.proBasicInfoDto.pricturePath
              ? data.proBasicInfoDto.pricturePath
              : "",
        },
        pathName: "warehouse/product/productLibrary/img",
      };
      nextTick(() => {
        if (UploadImage.value) {
          UploadImage.value.getImgMsg(file);
        }
      });
    };

    // 修改保存
    const saveSubmit = () => {
      data.proBasicInfoDto.proSpu = data.proBasicInfoDto.proSpu
        ? data.proBasicInfoDto.proSpu.trim()
        : "";
      data.proBasicInfoDto.productCname = data.proBasicInfoDto.productCname
        ? data.proBasicInfoDto.productCname.trim()
        : "";
      data.proBasicInfoDto.productEname = data.proBasicInfoDto.productEname
        ? data.proBasicInfoDto.productEname.trim()
        : "";
      data.proBasicInfoDto.productParameter = data.proBasicInfoDto
        .productParameter
        ? data.proBasicInfoDto.productParameter.trim()
        : "";
      data.proBasicInfoDto.overseasCopyright = data.proBasicInfoDto
        .overseasCopyright
        ? data.proBasicInfoDto.overseasCopyright.trim()
        : "";
      data.proBasicInfoDto.proVoltage = data.proBasicInfoDto.proVoltage
        ? data.proBasicInfoDto.proVoltage.trim()
        : "";
      data.proBasicInfoDto.plugSpecification = data.proBasicInfoDto
        .plugSpecification
        ? data.proBasicInfoDto.plugSpecification.trim()
        : "";
      data.proBasicInfoDto.proRemark = data.proBasicInfoDto.proRemark
        ? data.proBasicInfoDto.proRemark.trim()
        : "";
      data.proBasicInfoDto.descriptionDevStatusChange = data.proBasicInfoDto
        .descriptionDevStatusChange
        ? data.proBasicInfoDto.descriptionDevStatusChange.trim()
        : "";
      data.proBasicInfoDto.proKeywords = data.proBasicInfoDto.proKeywords
        ? data.proBasicInfoDto.proKeywords.trim()
        : "";
      data.proBasicInfoDto.listedCategory = data.proBasicInfoDto.listedCategory
        ? data.proBasicInfoDto.listedCategory.trim()
        : "";
      productFrom.value.validate((valid) => {
        if (valid) {
          data.proBasicInfoDto.seasonalAttribute =
            data.proBasicInfoDto.seasonalAttribute.length > 0
              ? data.proBasicInfoDto.seasonalAttribute.join(",")
              : "";

          data.submitActive = true;
          let info = JSON.stringify(data.proBasicInfoDto);
          info = JSON.parse(info);
          if (Array.isArray(info.productClassificationId)) {
            info.productClassificationId = info.productClassificationId.pop();
          }
          info.isCe = info.isCe ? 1 : 0;
          // info.isPin = info.isPin ? 1 : 0;
          // info.voltage = info.voltage ? 1 : 0;
          info.isCharged = info.isCharged ? 1 : 0;
          info.isMagnetic = info.isMagnetic ? 1 : 0;
          info.isPhotograph = info.isPhotograph ? 1 : 0;
          info.proId = data.productData.proId;
          info.proSku = data.productData.sku;
          info.pricturePath = String(data.proBasicInfoDto.pricturePath);
          info.transportWay =
            info.transportWay.length > 0 ? String(info.transportWay) : "";
          api.productLibrary
            .updateProBasicInfo(info)
            .then((res) => {
              if (res.code == 200) {
                vue.$message({
                  type: "success",
                  message: res.msg,
                });
                getProBasicInfo(data.productData);
                data.submitActive = false;
              } else {
                vue.$message({
                  type: "warning",
                  message: res.msg,
                });
                data.submitActive = false;
              }
            })
            .catch((err) => {
              data.submitActive = false;
            });
        }
      });
    };

    const UploadImage = ref(null);
    // 获取图片url
    const receive = (e) => {
      vue.$refs.productFrom.clearValidate();
      data.proBasicInfoDto.pricturePath = e.link ? e.link : "";
    };

    // 移除图片
    const removeImg = (obj, name) => {
      obj[name] = "";
    };
    // openVirtualDeclaration  打开虚拟申报弹框log
    const openVirtualDeclaration = () => {
      data.productData.isEdit = data.isEdit
      vue.$refs.VirtualDeclarationLog.getMsg(data.productData);
      console.log(data.productData, 'ddddddddd');
    };
    const proBasicInfoDtoF = inject("proBasicInfoDto");
    const getTableData = inject("getTableData");

    //获取  proStatus
    const getProStatus = (status) => {
      data.proStatus = status;
    };

    // 基础信息
    const productFrom = ref(null);
    const submit = () => {
      if (data.proStatus == 0) {
        if (
          typeof data.proBasicInfoDto.productCname !== "undefined" &&
          data.proBasicInfoDto.productCname
        ) {
          vue.$emit("funPromise", true);
          if (Array.isArray(data.proBasicInfoDto.productClassificationId)) {
            data.proBasicInfoDto.productClassificationId =
              data.proBasicInfoDto.productClassificationId.pop();
          }
          data.proBasicInfoDto.isCe = data.proBasicInfoDto.isCe ? 1 : 0;
          // data.proBasicInfoDto.isPin = data.proBasicInfoDto.isPin ? 1 : 0;
          // data.proBasicInfoDto.voltage = data.proBasicInfoDto.voltage ? 1 : 0;
          data.proBasicInfoDto.isCharged = data.proBasicInfoDto.isCharged
            ? 1
            : 0;
          data.proBasicInfoDto.isMagnetic = data.proBasicInfoDto.isMagnetic
            ? 1
            : 0;
          data.proBasicInfoDto.isPhotograph = data.proBasicInfoDto.isPhotograph
            ? 1
            : 0;
          data.proBasicInfoDto.isFitting =
            data.proBasicInfoDto.isFitting == 1 ? 1 : 0;
          //控制是否显示二手
          //  data.proBasicInfoDto.second = true;
          data.proBasicInfoDto.pricturePath = data.proBasicInfoDto.pricturePath
            ? String(data.proBasicInfoDto.pricturePath)
            : "";
          data.proBasicInfoDto.transportWay = data.proBasicInfoDto.transportWay
            ? String(data.proBasicInfoDto.transportWay)
            : "";
          data.proBasicInfoDto.seasonalAttribute =
            data.proBasicInfoDto.seasonalAttribute.length > 0
              ? data.proBasicInfoDto.seasonalAttribute.join(",")
              : "";

          proBasicInfoDtoF.value = data.proBasicInfoDto;
        } else {
          vue.$emit("funPromise", false);
          vue.$message.warning("请完善产品名称！");
        }
      } else {
        productFrom.value.validate((valid) => {
          if (valid) {
            vue.$emit("funPromise", true);
            let info = JSON.stringify(data.proBasicInfoDto);
            info = JSON.parse(info);
            if (Array.isArray(info.productClassificationId)) {
              info.productClassificationId = info.productClassificationId.pop();
            }
            info.isCe = info.isCe ? 1 : 0;
            // info.isPin = info.isPin ? 1 : 0;
            // info.voltage = info.voltage ? 1 : 0;
            info.isCharged = info.isCharged ? 1 : 0;
            info.isMagnetic = info.isMagnetic ? 1 : 0;
            info.isPhotograph = info.isPhotograph ? 1 : 0;
            info.isFitting = info.isFitting == 1 ? 1 : 0;
            info.transportWay = info.transportWay
              ? String(info.transportWay)
              : "";
            proBasicInfoDtoF.value = info;
          } else {
            vue.$emit("funPromise", false);
          }
        });
      }
    };

    const closed = () => {
      handleScroll();
      if (productFrom.value) {
        productFrom.value.clearValidate();
        productFrom.value.resetFields();
      }
    };

    //监听弹窗页面滚动关闭打开的tooltip 组件
    const handleScroll = () => {
      if (vue.$refs.tooltipRef) {
        nextTick(() => {
          data.tooltipFlag = false;
          data.tooltipFlag1 = false;
          data.tooltipFlag2 = false;
          data.tooltipFlag3 = false;
          data.tooltipFlag4 = false;
          data.tooltipFlag5 = false;
        });
      }
    };

    //是否季节性产品change事件
    const isSeasonalChange = (e) => {
      if (e == 0) {
        data.proBasicInfoDto.seasonalAttribute = "";
      } else {
        data.proBasicInfoDto.seasonalAttribute = [];
      }
    };

    const onChange = () => {
      data.proBasicInfoDto.proSpu = "";
      data.spuOptions = [];
      getSpuByCategory();
    };

    const onSPUChange = () => {
      // data.ruleForm.classify = null;
      getCategoryBySpu();
    };

    // 通过选品分类获取SPU
    const getSpuByCategory = () => {
      let id = "";
      console.log(
        "data.proBasicInfoDto.productClassificationId",
        data.proBasicInfoDto
      );
      if (typeof data.proBasicInfoDto.productClassificationId == "string") {
        id = data.proBasicInfoDto.productClassificationId;
      } else if (
        typeof data.proBasicInfoDto.productClassificationId == "object" &&
        data.proBasicInfoDto.productClassificationId !== null
      ) {
        let i = data.proBasicInfoDto.productClassificationId.length - 1;
        id = data.proBasicInfoDto.productClassificationId[i];
      }
      api.develop
        .getSpuByCategory({
          sysCategoryId: id,
          type:"1"
        })
        .then((res) => {
          if (res.code == 200) {
            data.spuOptions = res.data;
            data.spuOptions.map((item) => {
              item.label = item.spuCode + "(" + item.spuName + ")";
            });
          }
        });
    };

    //通过SPU获取选品分类
    const getCategoryBySpu = () => {
      if (data.proBasicInfoDto.proSpu == "") {
        return;
      }
      api.develop
        .getCategoryBySpu({ spuEncode: data.proBasicInfoDto.proSpu })
        .then((res) => {
          if (res.code == 200) {
            console.log("选品分类", res);
            nextTick(() => {
              data.proBasicInfoDto.productClassificationId =
                res.data.split(",");
            });
          }
        });
    };

    //根据开发负责人获取咨询负责人
    const onExploitUserIdChange = () => {
      api.product
        .getInformationMan({
          userId: data.proBasicInfoDto.exploitUserId,
        })
        .then((res) => {
          if (res.code == 200) {
            data.proBasicInfoDto.informationManId = res.data;

          }
        });
    };

    // 点击复制
    const copyText = (text) => {
      documentCopy(text);
    };
    const refData = toRefs(data);
    return {
      ...refData,
      openVirtualDeclaration,
      submit,
      productFrom,
      closed,
      getMsg,
      receive,
      UploadImage,
      removeImg,
      proBasicInfoDtoF,
      getApiMsg,
      saveSubmit,
      virtualDeclVo,
      getTableData,
      getProStatus,
      handleScroll,
      isSeasonalChange,
      onChange,
      getSpuByCategory,
      getCategoryBySpu,
      onSPUChange,
      onPlugChange,
      onExploitUserIdChange,
      copyText
    };
  },
};
</script>
<style scoped lang="scss">
// 1
.product-form {
  display: flex;
  flex-direction: column;

  :deep(.is-disabled) input,
  :deep(.is-disabled) textarea{
    color:#909399
  }
  
  .product-item {
    display: flex;

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
  .el-select,
  .el-productSku {
    width: 300px;
  }

  .el-textarea {
    width: 300px;
  }

  .remark {
    width: 75%;
  }

  .link {
    height: 40px !important;
  }
}

.dont-submit {
  margin-bottom: 24px;
}
</style>
