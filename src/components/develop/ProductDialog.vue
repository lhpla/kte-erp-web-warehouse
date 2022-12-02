<!-- 选品增加  修改 -->
<template>
  <div id="develop-product-dialog">
    <el-dialog
      :title="title"
      v-model="dialogVisible"
      width="800px"
      @close="handleClose"
      v-if="dialogVisible"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        :model="ruleForm"
        :disabled="disabled"
        :rules="rules"
        ref="productForm"
        size="mini"
        label-width="100px"
        class="demo-ruleForm"
      >
        <div style="width: 100%; display: flex">
          <el-form-item label="选品名称:" prop="productName" style="width: 43%">
            <el-tooltip
              effect="dark"
              :disabled="ruleForm.productName == ''"
              :content="ruleForm.productName"
              placement="bottom"
            >
              <el-input
                v-model="ruleForm.productName"
                clearable
                placeholder="请输入选品中文名称"
              ></el-input>
            </el-tooltip>
          </el-form-item>
        </div>
        <el-form-item label="选品图片:" prop="pricturePath">
          <span v-if="ruleForm.pricturePath == ''" class="commonNote"
            >仅支持上传jpg/png格式文件，单个文件不能超过5M</span
          >
          <UploadImage ref="UploadImage" @clickFu="receive"></UploadImage>
          <el-input
            v-model="ruleForm.pricturePath"
            style="display: none"
          ></el-input>
        </el-form-item>

        <el-form-item label="选品分类:" prop="classify" style="width: 43%">
          <el-cascader
            :options="options"
            :props="propsClass"
            v-model="ruleForm.classify"
            filterable
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="选品来源:" prop="source">
          <el-select
            v-model="ruleForm.source"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in pro_selection_source"
              :key="item.dizKey"
              :label="item.value"
              :value="item.dizKey"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选品平台:" prop="platform">
          <el-select
            v-model="ruleForm.platform"
            filterable
            clearable
            placeholder="请选择"
            @change="getSiteByPlat"
          >
            <el-option
              v-for="item in platformOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选品站点:" prop="station">
          <el-select
            v-model="ruleForm.station"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in siteOptions"
              :key="item.id"
              :label="item.site"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="竞品链接:"
          prop="productLink"
          style="display: flex"
        >
          <span v-if="disabled">
            <el-link
              :underline="false"
              class="urlWidth"
              :href="ruleForm.productLink"
              target="_blank"
            >
              <span style="white-space:normal">
                {{ ruleForm.productLink ? ruleForm.productLink : "-" }}
              </span>
            </el-link>
            <i
              v-if="ruleForm.productLink && disabled"
              class="el-icon-document-copy nameHover"
              @click="copyText(ruleForm.productLink)"
            ></i>
          </span>
          <div v-else style="position: relative; display: inline-block">
            <el-input
              v-model.trim="ruleForm.productLink"
              class="urlWidth"
              clearable
              placeholder="竞品链接"
            ></el-input>
            <el-tooltip
              v-model="tooltipFlag"
              placement="top"
              content="同一市场平台内同类产品的最低销售价格的产品链接"
              class="question-middle"
              :manual="true"
              ref="tooltipRef"
            >
              <i
                class="el-icon-question"
                @click="tooltipFlag = !tooltipFlag"
                style="color: red"
              ></i>
            </el-tooltip>
          </div>
        </el-form-item>
        <div style="width: 75%">
          <el-form-item label="竞品参数列表:" class="cancelflex" prop="parameterList" style="position: relative">
              <el-input
                v-model="ruleForm.parameterList"
                type="textarea"
                :rows="3"
                clearable
                placeholder="请输入备注"
              ></el-input>
              <el-tooltip
                v-model="tooltipFlag10"
                placement="top"
                content="描述产品的参数"
                ref="tooltipRef"
                style="position: absolute; top: 28px; right: -14px"
              >
                <i
                  class="el-icon-question"
                  @click="tooltipFlag10 = !tooltipFlag10"
                  style="color: red"
                ></i>
              </el-tooltip>
          </el-form-item>
        </div>
        <span style="display: flex">
          <el-form-item label="产品最低售价:" prop="price">
            <el-input
              v-model.trim="ruleForm.price"
              clearable
              placeholder="请输入选品产品最低售价"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="currency"
            class="marginLeft error-message"
            style="position: relative"
          >
            <el-select
              v-model="ruleForm.currency"
              filterable
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in rateOptions"
                :key="item.id"
                :label="item.rateType + '(' + item.rateName + ')'"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-tooltip
              v-model="tooltipFlag1"
              placement="top"
              content="同一市场平台内同类产品的最低销售价格"
              :manual="true"
              ref="tooltipRef"
              style="position: absolute; top: 8px; right: -13px"
              v-if="title != '审核选品'"
            >
              <i
                class="el-icon-question"
                @click="tooltipFlag1 = !tooltipFlag1"
                style="color: red"
              ></i>
            </el-tooltip>
          </el-form-item>
        </span>
        <el-form-item
          label="采购参考链接:"
          prop="supplier"
          style="display: flex"
          class="error-message"
        >
          <span v-if="disabled">
            <el-link
              :underline="false"
              class="urlWidth"
              :href="ruleForm.supplier"
              target="_blank"
              >
              <span style="white-space:normal">
              {{ ruleForm.supplier ? ruleForm.supplier : "-" }}
              </span>
              </el-link
            >
            <i
              v-if="ruleForm.supplier"
              class="el-icon-document-copy nameHover"
              @click="copyText(ruleForm.supplier)"
            ></i>
          </span>
          <el-input
            v-else
            v-model.trim="ruleForm.supplier"
            class="urlWidth"
            clearable
            placeholder="请输入采购参考链接"
          ></el-input>
        </el-form-item>
        <el-form-item label="采购专员:" prop="buyer">
          <el-select
            v-model="ruleForm.buyer"
            filterable
            clearable
            placeholder="请选择"
            :disabled="purchaseDis"
          >
            <el-option
              v-for="item in buyerList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 新增备注 remarks-->
        <el-form-item label="备注:">
          <el-input
            v-model="ruleForm.remarks"
            clearable
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>

      <div v-if="type == 3">
        <el-form
          :model="auditForm"
          ref="auditFormRef"
          :rules="rules"
          size="mini"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="审核意见:" prop="opinion">
            <el-radio-group v-model="auditForm.opinion">
              <el-radio :label="2">不通过</el-radio>
              <el-radio :label="3">通过</el-radio>
              <el-radio :label="5">作废</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="意见反馈:" prop="desc">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              maxlength="100"
              show-word-limit
              v-model="auditForm.desc"
            ></el-input>
          </el-form-item>
          <el-form-item prop="fileList">
            <div class="picturesBox">
              <div>
                <el-upload
                  drag
                  action="string"
                  ref="uploadImgRef"
                  list-type="picture-card"
                  :fileList="auditForm.fileList"
                  :http-request="uploadImage"
                  :multiple="true"
                  :limit="imgLimits"
                  show-file-list
                  :before-upload="beforeAvatarUpload"
                  :on-success="handleAvatarSuccess"
                  :on-exceed="handleExceed"
                  :on-error="imgUploadError"
                >
                  <i class="el-icon-plus"></i>
                  <template #file="{ file }">
                    <img
                      class="el-upload-list__item-thumbnail"
                      :src="file.url"
                      alt
                    />
                    <span class="el-upload-list__item-actions">
                      <span
                        class="el-upload-list__item-preview"
                        @click="handlePictureCardPreview(file)"
                      >
                        <i class="el-icon-zoom-in"></i>
                      </span>
                      <span
                        class="el-upload-list__item-delete"
                        @click="handleDownload(file)"
                      >
                        <i class="el-icon-download"></i>
                      </span>
                      <span
                        class="el-upload-list__item-delete"
                        @click="handleRemove(file)"
                      >
                        <i class="el-icon-delete"></i>
                      </span>
                    </span>
                  </template>
                </el-upload>
                <span class="el_dialog_image">
                  <el-dialog
                    v-model="dialogVisibleImage"
                    :close-on-click-modal="false"
                    destroy-on-close
                  >
                    <div style="width: 100%; height: 100%">
                      <el-image
                        style="width: 100%; height: 100%"
                        :src="dialogImageUrl"
                        fit="contain"
                        alt
                      ></el-image>
                    </div>
                  </el-dialog>
                </span>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="mini" @click="handleClose">取 消</el-button>
          <el-button
            size="mini"
            v-if="type !== 3 && isDraft && butName != '更新提交'"
            :disabled="btnFlag"
            :loading="btnFlag"
            @click="saveDraft"
            >暂存草稿</el-button
          >
          <el-button
            type="primary"
            size="mini"
            :disabled="btnFlag"
            :loading="btnFlag"
            @click="allSubmit"
            >{{ butName }}</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
  ref,
  inject,
  nextTick,
} from "vue";
import {
  parseTime,
  localGet,
  getFathersById,
  documentCopy,
  localSet,
} from "../../utils/util";
import { ElMessage } from "element-plus";
export default {
  name: "ProductDialog",
  setup(prop, ctx) {
    const data = reactive({
      ruleForm: {
        productName: "",
        productModel: "",
        pricturePath: "",
        fileList: [],
        classify: [],
        source: "",
        platform: "",
        station: "",
        productLink: "",
        price: "",
        currency: "",
        supplier: "",
        buyer: "",
        remarks: "",
        id: "",
        parameterList:"",
        productClassificationId: "",
      },
      purchaseDis: false,
      firstPrice: "",
      firstPlatform: "",
      firstStation: "",
      firstCurrency: "",
      imgLimits: 3,
      imgLimit: 1,
      auditForm: {
        opinion: "",
        desc: "",
        fileList: [],
      },
      rules: {
        productName: [
          { required: true, message: "请输入选品名称", trigger: "blur" },
          { max: 200, message: "长度不超过200字符", trigger: "change" },
        ],
        productModel: [
          { message: "请输入选品规格、型号", trigger: "blur" },
          { max: 50, message: "长度不超过50字符", trigger: "change" },
        ],
        pricturePath: [
          { required: true, message: "请选择图片", trigger: "change" },
        ],
        classify: [
          { required: true, message: "请选择分类", trigger: "change" },
        ],
        source: [{ required: true, message: "请选择来源", trigger: "change" }],
        platform: [
          { required: true, message: "请选择平台", trigger: "change" },
        ],
        station: [{ required: true, message: "请选择站点", trigger: "change" }],
        productLink: [
          { required: true, message: "请输入竞品链接", trigger: "blur" },
          { max: 500, message: "输入长度已超出最大范围500字符" },
        ],
        parameterList: [{ required: true, message: "请输入", trigger: "blur" }],
        supplier: [
          { required: false, trigger: "blur" },
          { max: 500, message: "输入长度已超出最大范围500字符" },
        ],
        price: [
          { required: true, message: "请输入产品最低售价", trigger: "blur" },
          {
            pattern:
              /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            message: "请输入数字,可保留两位小数",
          },
        ],
        currency: [
          { required: true, message: "请选择单位", trigger: "change" },
        ],
        buyer: [{ required: true, message: "请选择采购员", trigger: "change" }],
        opinion: [
          { required: true, message: "请选择审核意见", trigger: "change" },
        ],
        desc: [{ required: true, message: "请填写意见说明", trigger: "blur" }],
      },
      title: "新增选品",
      dialogVisible: false,
      type: 1,
      options: [],
      propsClass: {
        expandTrigger: "hover",
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      pro_selection_source: [],
      platformOptions: [],
      siteOptions: [],
      rateOptions: [],
      userInfo: "",
      isEdit: false,
      disabled: false,
      buyerList: [],
      butName: "",
      isDraft: true,
      msgList: "",
      btnFlag: false,
      tooltipFlag: false,
      tooltipFlag1: false,
      dialogVisibleImage: false,
      dialogImageUrl: "",
      tooltipFlag10: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const productForm = ref(null);
    const auditFormRef = ref(null);
    onBeforeMount(() => {});
    onMounted(() => {});
    const refData = toRefs(data);
    const UploadImage = ref(null);
    const getTableData = inject("getTableData");
    // 获取 分类  来源  平台  站点
    const getCategoryList = () => {
      // 来源
      data.pro_selection_source =
        localGet("dictCodeList") &&
        localGet("dictCodeList").pro_selection_source
          ? localGet("dictCodeList").pro_selection_source
          : [];

      data.ruleForm.classify = getFathersById(
        data.ruleForm.classify,
        data.options
      );
      // 平台
      //选品平台
      api.systemNew.getPlatformAll().then((res) => {
        if (res.code == 200) {
          data.platformOptions = res.data;
        }
      });

      // 站点
      data.siteOptions = [];
      api.system.getAllSiteList().then((res) => {
        if (res.code == 200) {
          data.siteOptions = res.data;
        }
      });
    };

    // 上传成功
    const handleAvatarSuccess = (res, file) => {
      vue.$message.success("上传图片成功!");
    };

    //获取最新下拉数据
    const getNewData = () => {
      //产品分类
      data.options = [];
      api.product.getCategoryByPersonInCharge().then((res) => {
        if (res.code == 200) {
          data.options = res.data;
        }
      });

      // 汇率
      data.rateOptions = [];
      api.system.getExchangeList().then((res) => {
        if (res.code == 200) {
          data.rateOptions = res.data;
        }
      });
      //选品来源-->开发流程所有字典
      api.develop.getDevProcessList().then((res) => {
        if (res.code == 200) {
          localSet("dictCodeList", res.data);
        }
      });
      //采购专员
      api.userOperation.getHeadOfPurchasing().then((res) => {
        if (res.code == 200) {
          data.buyerList = res.data;
        }
      });
    };

    // 上传错误提示
    const imgUploadError = (err, file, fileList) => {
      // 图片上传失败调用
      vue.$message.error("文件异常，请重新上传!");
    };

    // 文件数超出提示
    const handleExceed = (file, fileList) => {
      // 图片上传超过数量限制
      vue.$message.error("上传图片不能超过" + data.imgLimits + "张!");
      console.log(file, fileList);
    };

    // 图片上传
    const beforeAvatarUpload = (file) => {
      const isImage =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      // const isImage = file.type === "image/jpg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isImage) {
        // vue.$message.error("上传图片只能是 jpg / jpeg / png / gif 格式!");
        vue.$message.error("上传图片只能是 jpg  / png 格式!");
      }
      if (!isLt2M) {
        vue.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return isImage && isLt2M;
    };

    // 图片预览
    const handlePictureCardPreview = (file) => {
      data.dialogImageUrl = file.url;
      data.dialogVisibleImage = true;
    };

    //图片下载
    const handleDownload = (e) => {
      const a = document.createElement("a");
      a.style.display = "none";
      a.download = "kte-oss";
      a.href = e.url;
      a.click();
      // 去除下载对url的影响
      window.URL.revokeObjectURL(e.url);
    };

    // uploadImage//上传图片
    const uploadImage = (param) => {
      let formImgData = new FormData();
      formImgData.append("file", param.file);
      formImgData.append("pathName", data.pathName);
      api.uploadImg.uploadImgAllFun(formImgData).then((res) => {
        if (res.code == 200) {
          let img = {
            url: "",
          };
          img.url = res.data.link;
          data.auditForm.fileList.push(img);
          param.onSuccess();
        } else {
          param.onError();
        }
      });
    };

    // 获取信息
    const getMsg = (info) => {
      getNewData();
      data.butName = info.btnName;
      if (info.row) {
        api.develop.getProductDetail({ id: info.row }).then((res) => {
          if (res.code == 200) {
            let msg = {
              platformId: String(res.data.platformId),
              isEnglish: false,
              includeFullSite: false,
              isLimit: false,
            };
            api.system.getSiteByPlat(msg).then((param) => {
              if (param.code == 200) {
                data.siteOptions = param.data;
              } else {
                vue.$message({
                  type: "warning",
                  message: param.msg,
                });
              }
            });
            data.msgList = res.data;
            if (data.msgList) {
              // 新增变量用于更新判断
              data.firstPrice = Number(data.msgList.referencePrice).toFixed(2);
              data.firstPlatform = data.msgList.platformId;
              data.firstStation = data.msgList.siteId;
              data.firstCurrency = String(data.msgList.priceUnitId);
              data.isEdit = true;
              data.ruleForm.productName = data.msgList.productCname;
              data.ruleForm.buyer =
                data.msgList.purchaseUserId == -1
                  ? ""
                  : data.msgList.purchaseUserId;
              data.ruleForm.remarks = data.msgList.remark;
              data.ruleForm.productModel = data.msgList.parameter;
              data.ruleForm.source = data.msgList.sourceId == -1? '' : String(data.msgList.sourceId);
              data.ruleForm.platform =
                data.msgList.platformId == -1 ? "" : data.msgList.platformId;
              data.ruleForm.station =
                data.msgList.siteId == -1 ? "" : data.msgList.siteId;
              data.ruleForm.productLink = data.msgList.referenceLinking;
              data.ruleForm.price =
                data.msgList.referencePrice == -1
                  ? ""
                  : Number(data.msgList.referencePrice).toFixed(2);
              data.ruleForm.supplier = data.msgList.supplierLinks;
              data.ruleForm.id = data.msgList.id;
              data.ruleForm.currency =
                data.msgList.priceUnitId == -1
                  ? ""
                  : String(data.msgList.priceUnitId);
              data.ruleForm.classify = data.msgList.productClassificationId;
              data.ruleForm.fileList.push(data.msgList.pricturePath);
              data.ruleForm.pricturePath = data.msgList.pricturePath;
              data.auditForm.opinion = 3;
              if (data.msgList.status == 2) {
                data.auditForm.opinion = 2;
              } else if (data.msgList.status == 5) {
                data.auditForm.opinion = 5;
              }
            }
            data.ruleForm.parameterList=data.msgList.parameterList;
            let file = {
              imgLimit: 1,
              isUpdate: !(data.msgList && data.msgList.pricturePath),
              fileList: [],
              type: data.type,
              pathName:
                data.type == 1
                  ? "warehouse/develop/choose/chooseList/img"
                  : "warehouse/develop/developChild/firstRecord/img",
            };
            if (data.type == 3) {
              file.isUpdate = false;
            }
            if (data.msgList) {
              file.fileList = {
                url: data.msgList.pricturePath,
              };
            }
            nextTick(() => {
              UploadImage.value.getImgMsg(file, file.fileList);
            });
            if (
              (data.msgList && data.msgList.status == 3) ||
              (data.msgList && data.msgList.proFirstStatus == 52)
            ) {
              // data.butName = "更新提交";
              data.isDraft = false;
              console.log(data.isDraft);
            } else {
              data.isDraft = true;
            }
          } else {
            vue.$message({
              type: "warning",
              message: res.msg,
            });
          }
        });
      }
      data.dialogVisible = true;

      data.ruleForm.fileList = [];
      getCategoryList();

      data.type = info.type;
      data.title = info.title;

      // 如果产品初录或者选品列表点击更新按钮打开弹框就禁掉采购负责人
      data.purchaseDis = !!(
        info.title == "更新信息" || info.title == "更新选品"
      );
      data.disabled = info.disabled ? info.disabled : false;
      data.userInfo = localGet("userInfo");
      data.isEdit = false;
    };

    // 全部提交方法
    const allSubmit = () => {
      productForm.value.validate((valid) => {
        if (valid) {
          data.btnFlag = true;
          let msg = {
            parameter: data.ruleForm.productModel,
            platformId: data.ruleForm.platform,
            productClassificationId: data.ruleForm.classify,
            productCname: data.ruleForm.productName
              ? data.ruleForm.productName.trim()
              : "",
            referenceLinking: data.ruleForm.productLink,
            referencePrice: data.ruleForm.price,
            siteId: data.ruleForm.station,
            sourceId: data.ruleForm.source,
            supplierLinks: data.ruleForm.supplier,
            priceUnitId: data.ruleForm.currency,
            purchaseUserId: data.ruleForm.buyer,
            pricturePath: data.ruleForm.pricturePath,
            remark: data.ruleForm.remarks ? data.ruleForm.remarks.trim() : "",
            parameterList:data.ruleForm.parameterList,
          };
          if (Array.isArray(data.ruleForm.classify)) {
            msg.productClassificationId = data.ruleForm.classify.pop();
          }
          if (data.isEdit) {
            msg.id = data.msgList.id;
          } else if (data.type !== 2) {
            msg.createUser = data.userInfo.user_id;
            msg.createUserName = data.userInfo.user_name;
            msg.updateUser = data.userInfo.user_id;
            msg.updateUserName = data.userInfo.user_name;
          }
          if (data.type == 1) {
            msg.isEdit = true;
            onSubmit(msg);
          } else if (data.type == 2) {
            submit(msg);
          } else if (data.type == 3) {
            if (
              data.auditForm.opinion != 3 &&
              data.auditForm.desc &&
              data.auditForm.desc != ""
            ) {
              let arr = [];
              data.auditForm.fileList.map((item) => {
                arr.push(item.url);
              });
              let info = {
                opinion: data.auditForm.desc ? data.auditForm.desc.trim() : "",
                ids: [data.msgList.id],
                status: data.auditForm.opinion,
                opinionPicture: arr.join(","),
              };
              auditSubmit(info);
            } else if (data.auditForm.opinion == 3) {
              let arr = [];
              data.auditForm.fileList.map((item) => {
                arr.push(item.url);
              });
              let info = {
                opinion: data.auditForm.desc ? data.auditForm.desc.trim() : "",
                ids: [data.msgList.id],
                status: data.auditForm.opinion,
                opinionPicture: arr.join(","),
              };
              auditSubmit(info);
            } else {
              data.btnFlag = false;
              vue.$message.warning("请填写审核意见");
            }
          }
        }
      });
    };

    // 初录新增  修改
    const submit = (msg) => {
      msg.status = 51;
      if (!data.isEdit) {
        api.develop
          .editEntry(msg)
          .then((res) => {
            if (res.code == 200) {
              ElMessage.success({
                message: res.msg,
                type: "success",
              });
              data.dialogVisible = false;
              getTableData();
              resetForm();
              data.btnFlag = false;
            } else {
              ElMessage.warning({
                message: res.msg,
                type: "warning",
              });
              data.btnFlag = false;
            }
          })
          .catch((e) => {
            data.btnFlag = false;
          });
      } else {
        msg.proId = data.msgList.id;
        api.develop
          .editEntry(msg)
          .then((res) => {
            if (res.code == 200) {
              ElMessage.success({
                message: res.msg,
                type: "success",
              });
              data.dialogVisible = false;
              getTableData();
              resetForm();
              data.btnFlag = false;
            } else {
              ElMessage.warning({
                message: res.msg,
                type: "warning",
              });
              data.btnFlag = false;
            }
          })
          .catch((e) => {
            data.btnFlag = false;
          });
        if (!data.isDraft) {

          if (data.firstPrice == msg.referencePrice) {
            let newInfo = {
              referencePrice: data.ruleForm.price,
              productId: data.msgList.id,
              rateId: data.ruleForm.currency,
              siteId: data.ruleForm.station,
              linking: data.ruleForm.productLink,
            };
            api.develop
              .updateByProductFirst(newInfo)
              .then((res) => {
                console.log("新增更新接口", res);
                data.btnFlag = false;
              })
              .catch((e) => {
                data.btnFlag = false;
              });
          } else {
            let newInfo = {
              referencePrice: data.ruleForm.price,
              productId: data.msgList.id,
              rateId: data.ruleForm.currency,
              siteId: data.ruleForm.station,
              linking: data.ruleForm.productLink,
            };
            api.develop
              .updateByProductFirst(newInfo)
              .then((res) => {
                console.log("新增更新接口", res);
                data.btnFlag = false;
              })
              .catch((e) => {
                data.btnFlag = false;
              });
          }
        }
      }
    };

    // 根据平台展示站点
    const getSiteByPlat = () => {
      data.ruleForm.station = "";
      if (data.ruleForm.platform) {
        let msg = {
          platformId: String(data.ruleForm.platform),
          isEnglish: false,
          includeFullSite: false,
          isLimit: false,
        };
        api.system.getSiteByPlat(msg).then((res) => {
          if (res.code == 200) {
            data.siteOptions = res.data;
          } else {
            vue.$message({
              type: "warning",
              message: res.msg,
            });
          }
        }).catch((e)=>{
          console.log(e)
             //noop
        });
      } else {
        ElMessage.warning({
          message: "请先选择平台",
          type: "warning",
        });
      }
    };

    // 产品提交审核
    const onSubmit = (msg) => {
      data.btnFlag = true;
      if (!data.isEdit) {
        msg.status = 1;
        api.develop
          .createNewProduct(msg)
          .then((res) => {
            if (res.code == 200) {
              ElMessage.success({
                message: res.msg,
                type: "success",
              });
              data.dialogVisible = false;
              getTableData();
              resetForm();
              data.btnFlag = false;
            } else {
              ElMessage.warning({
                message: res.msg,
                type: "warning",
              });
              data.btnFlag = false;
            }
          })
          .catch((e) => {
            data.btnFlag = false;
          });
      } else {
        msg.status = data.msgList.status == 3 ? 3 : 1;
        // 修改 四条信息另外加调个新接口
        let newInfo = {
          referencePrice: data.ruleForm.price,
          productId: data.msgList.id,
          rateId: data.ruleForm.currency,
          siteId: data.ruleForm.station,
          linking: data.ruleForm.productLink,
        };
        api.develop.updateByProductFirst(newInfo).then((res) => {
          console.log("新增更新接口", res);
        }).catch((e)=>{
          // noop
        });
        api.develop
          .updateProInfo(msg)
          .then((res) => {
            if (res.code == 200) {
              ElMessage.success({
                message: res.msg,
                type: "success",
              });
              data.btnFlag = false;
              data.dialogVisible = false;
              getTableData();
              resetForm();
            } else {
              ElMessage.warning({
                message: res.msg,
                type: "warning",
              });
              data.btnFlag = false;
            }
          })
          .catch((e) => {
            data.btnFlag = false;
          });
      }
    };
    // 暂存草案
    const saveDraft = () => {
      data.btnFlag = true;
      if (data.ruleForm.productName != "") {
        if (data.type == 1) {
          let msg = {
            createUser: data.userInfo.user_id,
            createUserName: data.userInfo.user_name,
            updateUser: data.userInfo.user_id,
            updateUserName: data.userInfo.user_name,
            parameter: data.ruleForm.productModel,
            platformId: data.ruleForm.platform,
            productClassificationId: data.ruleForm.classify,
            productCname: data.ruleForm.productName
              ? data.ruleForm.productName.trim()
              : "",
            referenceLinking: data.ruleForm.productLink,
            referencePrice: data.ruleForm.price,
            siteId: data.ruleForm.station,
            status: 4,
            sourceId: data.ruleForm.source,
            supplierLinks: data.ruleForm.supplier,
            priceUnitId: data.ruleForm.currency,
            pricturePath: data.ruleForm.pricturePath,
            purchaseUserId: data.ruleForm.buyer,
            remark: data.ruleForm.remarks ? data.ruleForm.remarks.trim() : "",
            parameterList:data.ruleForm.parameterList,
          };
          if (Array.isArray(data.ruleForm.classify)) {
            msg.productClassificationId = data.ruleForm.classify.pop();
          }
          if (data.isEdit) {
            msg.id = data.ruleForm.id;
          }
          if (data.isEdit == true) {
            // 选品修改
            api.develop
              .updateProInfo(msg)
              .then((res) => {
                if (res.code == 200) {
                  ElMessage.success({
                    message: res.msg,
                    type: "success",
                  });
                  data.dialogVisible = false;
                  data.btnFlag = false;

                  getTableData();
                  resetForm();
                } else {
                  ElMessage.warning({
                    message: res.msg,
                    type: "warning",
                  });
                  data.btnFlag = false;
                }
              })
              .catch((e) => {
                data.btnFlag = false;
              });
          } else {
            // 选品新增
            api.develop
              .createNewProduct(msg)
              .then((res) => {
                if (res.code == 200) {
                  ElMessage.success({
                    message: res.msg,
                    type: "success",
                  });
                  data.btnFlag = false;

                  data.dialogVisible = false;
                  getTableData();
                  resetForm();
                } else {
                  ElMessage.warning({
                    message: res.msg,
                    type: "warning",
                  });
                  data.btnFlag = false;
                }
              })
              .catch((e) => {
                data.btnFlag = false;
              });
          }
        } else {
          let msg = {
            parameter: data.ruleForm.productModel,
            platformId: data.ruleForm.platform,
            productClassificationId: data.ruleForm.classify,
            productCname: data.ruleForm.productName
              ? data.ruleForm.productName.trim()
              : "",
            referenceLinking: data.ruleForm.productLink,
            referencePrice: data.ruleForm.price,
            siteId: data.ruleForm.station,
            status: 53,
            sourceId: data.ruleForm.source,
            supplierLinks: data.ruleForm.supplier,
            priceUnitId: data.ruleForm.currency,
            purchaseUserId: data.ruleForm.buyer,
            pricturePath: data.ruleForm.pricturePath,
            remark: data.ruleForm.remarks ? data.ruleForm.remarks.trim() : "",
            parameterList:data.ruleForm.parameterList,
          };
          if (data.isEdit) {
            msg.proId = data.ruleForm.id;
          }
          if (Array.isArray(data.ruleForm.classify)) {
            msg.productClassificationId = data.ruleForm.classify.pop();
          }
          // 初录新增  修改
          api.develop
            .editEntry(msg)
            .then((res) => {
              if (res.code == 200) {
                ElMessage.success({
                  message: res.msg,
                  type: "success",
                });
                data.dialogVisible = false;
                data.btnFlag = false;
                getTableData();
                resetForm();
              } else {
                ElMessage.warning({
                  message: res.msg,
                  type: "warning",
                });
                data.btnFlag = false;
              }
            })
            .catch((e) => {
              data.btnFlag = false;
            });
        }
      } else {
        vue.$message({
          type: "warning",
          message: "暂存草稿时，产品名称为必填！",
        });
        data.btnFlag = false;
      }
    };
    // 审核提交
    const auditSubmit = (msg) => {
      api.develop
        .updateAuditStatus(msg)
        .then((res) => {
          if (res.code == 200) {
            ElMessage.success({
              message: res.msg,
              type: "success",
            });
            data.dialogVisible = false;
            data.auditForm = {
              opinion: "",
              desc: "",
              fileList: [],
            };
            getTableData();
            resetForm();
            data.btnFlag = false;
          } else {
            ElMessage.warning({
              message: res.msg,
              type: "warning",
            });
            data.auditForm = {
              opinion: "",
              desc: "",
              fileList: [],
            };
            data.btnFlag = false;
          }
        })
        .catch((e) => {
          data.btnFlag = false;
        });
    };

    // 重置
    const resetForm = () => {
      if (productForm.value) {
        productForm.value.resetFields();
        productForm.value.clearValidate();
      }
      if (auditFormRef.value) {
        auditFormRef.value.resetFields();
        auditFormRef.value.clearValidate();
      }
      // 清除圖片
      nextTick(() => {
        if (UploadImage.value) {
          vue.$refs.UploadImage.removeBefore();
        }
      });
    };

    // 取消
    const handleClose = (done) => {
      data.dialogVisible = false;
      data.btnFlag = false;
      data.ruleForm.remarks = "";
      resetForm();
      closedtooltipRef();
    };
    // 获取图片url
    const receive = (e) => {
      console.log("获取图片路径", e);
      data.ruleForm.pricturePath = e.link ? e.link : "";
    };

    // 复制链接
    const copyText = (text) => {
      documentCopy(text);
    };

    // 图片删除
    const handleRemove = (file) => {
      data.auditForm.fileList.map((item, index) => {
        if (item.url == file.url) {
          data.auditForm.fileList.splice(index, 1);
        }
      });
    };

    //关闭标注提示tag
    const closedtooltipRef = () => {
      if (vue.$refs.tooltipRef) {
        nextTick(() => {
          data.tooltipFlag = false;
          data.tooltipFlag1 = false;
        });
      }
    };

    return {
      ...refData,
      handleClose,
      getMsg,
      productForm,
      submit,
      saveDraft,
      resetForm,
      getCategoryList,
      onSubmit,
      auditSubmit,
      auditFormRef,
      receive,
      UploadImage,
      getTableData,
      allSubmit,
      getSiteByPlat,
      uploadImage,
      handlePictureCardPreview,
      beforeAvatarUpload,
      handleAvatarSuccess,
      handleExceed,
      imgUploadError,
      copyText,
      handleRemove,
      getNewData,
      handleDownload,
    };
  },
};
</script>
<style>
.question-middle {
  position: absolute;
  right: -3px;
  top: 9px;
}
</style>
<style lang="scss" scoped>
#develop-product-dialog {
  .error-message {
    ::v-deep .el-form-item__error {
      transform: translateX(-100px);
      width: 200px;
    }
  }
}
.cancelflex{
    :deep(.el-form-item__content){
      flex-wrap: nowrap;
    }
  }
.el-input {
  width: 230px;
  margin-right: 10px;
}

.marginLeft {
  .el-select {
    margin-left: -100px;
  }
}

.urlWidth {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  // width: 400px;
  // display: block;
  // margin-left: -100px !important;
}

:deep(.el-list-leave-active){
  width: 100%;
  height: 100%;
  transform: translate(0px,0px);
  top: 0;
  left: 0;
  transition:  all 0s;
}
:deep(.el-list-enter-active){
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translate(0px,0px);
  transition:  all 0s;
}
:deep(.el-list-enter-to){
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition:  all 0s;
  transform: translate(0px,0px);

}
</style>
