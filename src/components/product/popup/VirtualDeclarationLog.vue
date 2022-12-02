<!-- 虚拟申报二级弹框 -->
<template>
  <div id="virtualDeclarationLog">
    <el-dialog title="虚拟申报信息" width="60%" v-model="virtualDeclarationFlag" :close-on-click-modal="false"
      @close="closed" destroy-on-close>
      <el-form size="mini" :model="ruleForm" :rules="rules" :inline="true" label-width="120px" class="demo-ruleForm"
        ref="virtualForm">
        <div class="form_box">
          <div class="form_item_div">
            <el-form-item label="中文名称:" class="form_item" prop="cnName">
              <el-input :disabled="!isEdit" v-model="ruleForm.cnName" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="英文名称:" class="form_item" prop="enName">
              <el-input :disabled="!isEdit" v-model="ruleForm.enName" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="进口申报价值:" class="form_item" prop="pullDeclaredValue">
              <el-input :disabled="!isEdit" v-model="ruleForm.pullDeclaredValue" clearable placeholder="进口申报价值"></el-input>
            </el-form-item>
            <el-form-item label="出口申报价值:" class="form_item" prop="unDeclaredValue">
              <el-input :disabled="!isEdit" v-model="ruleForm.unDeclaredValue" clearable placeholder="出口申报价值"></el-input>
            </el-form-item>
            <el-form-item label="材质:" class="form_item" prop="textureMaterial">
              <el-input :disabled="!isEdit" v-model="ruleForm.textureMaterial" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="产品单位:" class="form_item" prop="companyText">
              <el-select :disabled="!isEdit" v-model="ruleForm.companyText" filterable placeholder="请选择" clearable>
                <el-option v-for="item in pro_unit_dict" :key="item.dizKey" :label="item.value" :value="item.dizKey"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申报说明:" class="form_item2" prop="declarationDescription">
              <el-input :disabled="!isEdit" type="textarea" :rows="3" clearable placeholder="请输入内容" v-model="ruleForm.declarationDescription"></el-input>
            </el-form-item>
          </div>
          <div class="form_item_div">
            <el-form-item label="产品图片:" class="form_item" prop="productPicture">
              <span v-if="ruleForm.pricturePath == ''" class="commonNote">仅支持上传jpg/png格式文件，单个文件不能超过5M</span>
              <UploadImage :isEdit="isEdit" ref="UploadImage" @click="removeImg" @clickFu="receive"></UploadImage>
            </el-form-item>
            <el-form-item label="参考链接:" class="form_item" prop="referenceLink">
              <el-input :disabled="!isEdit" v-model="ruleForm.referenceLink" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="用途:" class="form_item" prop="purpose">
              <el-input :disabled="!isEdit" v-model="ruleForm.purpose" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="海关编码:" class="form_item" prop="customsCode">
              <el-input :disabled="!isEdit" v-model="ruleForm.customsCode" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="型号:" prop="model" class="form_item">
              <el-input :disabled="!isEdit" v-model="ruleForm.model" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="品牌:" prop="brand" class="form_item">
              <el-input :disabled="!isEdit" v-model="ruleForm.brand" clearable placeholder="请输入"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <template #footer v-if="isEdit">
        <span class="dialog-footer">
          <el-button size="mini" @click="handleClose">取 消</el-button>
          <el-button size="mini" type="primary" @click="onSubmit">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, nextTick, inject } from "vue";
import { localGet } from "@/utils/util";
export default {
  name: "VirtualDeclarationLog",
  props: {
    productData: {
      type: Object,
      required: true,
    },
  },
  setup(prop, ctx) {
    const data = reactive({
      isEdit: true,
      virtualDeclarationFlag: false,
      // 表单数据
      ruleForm: {
        // 中文名称
        cnName: "",
        // 英文名称
        enName: "",
        // 申报进口申报价值
        pullDeclaredValue: "",
        // 申报进出口申报价值
        unDeclaredValue: "",
        // 材质
        textureMaterial: "",
        // 产品单位
        companyText: "",
        // 申报说明
        declarationDescription: "",
        // 产品图片
        productPicture: "",
        // 参考链接
        referenceLink: "",
        // 用途
        purpose: "",
        // 编码
        customsCode: "",
        // 型号
        model: "无",
        //品牌
        brand: "无",
      },
      // 是否为新增信息
      isNewFlag: true,
      // 所有字典
      dictCodeList: [],
      // 单位列表
      pro_unit_dict: [],
      // 是否是编辑时的新增情况
      isEditNewFlag: false,
      // 验证规则
      rules: {
        cnName: [
          { required: true, message: "请输入中文名称", trigger: "blur" },
          { max: 200, message: "长度不超过200字符", trigger: "change" },
        ],
        enName: [
          { required: true, message: "请输入英文名称", trigger: "blur" },
          { max: 200, message: "长度不超过200字符", trigger: "change" },
        ],
        pullDeclaredValue: [{ pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: "请输入数字,可保留两位小数" }],
        unDeclaredValue: [{ pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: "请输入数字,可保留两位小数" }],
        declarationDescription: [{ max: 200, message: "长度不超过200字符", trigger: "change" }],
        textureMaterial: [{ required: true, message: "请填写材质", trigger: "blur" }],
        companyText: [{ required: true, message: "请选择产品单位", trigger: "blur" }],
        referenceLink: [{ required: true, message: "请填写参考链接", trigger: "blur" }],
        purpose: [{ required: true, message: "请填写用途", trigger: "blur" }],
        customsCode: [
          { required: true, message: "请填写海关编码", trigger: "blur" },
          { min: 3, max: 10, message: '输入格式错误', trigger: 'blur' }
        ],
      },
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const virtualForm = ref(null);
    const UploadImage = ref(null);
    onBeforeMount(() => { });
    onMounted(() => {});
    const refData = toRefs(data);

    // 关闭弹框
    const closed = () => {
      data.virtualDeclarationFlag = false;
      data.isEditNewFlag = false;
      data.isNewFlag = true;
      vue.$parent.productData = {};
      virtualForm.value.resetFields();
      virtualForm.value.clearValidate();
      data.isEdit = true
      nextTick(() => {
        UploadImage.value.removeBefore();
      });
    };
    const virtualDeclVoF = inject("virtualDeclVo");
    // 获取数据 回显数据
    const getMsg = msg => {
      data.isEdit = msg.isEdit;
      data.virtualDeclarationFlag = true;
      data.isEditNewFlag = false;
      data.dictCodeList = localGet("dictCodeList");
      data.pro_unit_dict = data.dictCodeList.pro_unit_dict ? data.dictCodeList.pro_unit_dict : [];
      if (msg.proId) {
        data.isNewFlag = false;
        api.product.getVirtualDeclare({ proId: msg.proId }).then(res => {
          if (res.code == 200 && res.data.productCn) {
            data.ruleForm.cnName = res.data.productCn;
            data.ruleForm.enName = res.data.productEn;
            data.ruleForm.pullDeclaredValue = res.data.importDeclareValue > 0 ? (res.data.importDeclareValue * 1).toFixed(2) : 0;
            data.ruleForm.unDeclaredValue = res.data.exportDeclareValue > 0 ? (res.data.exportDeclareValue * 1).toFixed(2) : 0;
            data.ruleForm.textureMaterial = res.data.texture;
            data.ruleForm.companyText = res.data.proUnit;
            data.ruleForm.declarationDescription = res.data.declareExplain;
            data.ruleForm.productPicture = res.data.proPicturePath;
            data.ruleForm.referenceLink = res.data.referenceLinking;
            data.ruleForm.purpose = res.data.purpose;
            data.ruleForm.customsCode = res.data.customsCode;
            data.ruleForm.model = res.data.model;
            data.ruleForm.brand = res.data.brand;
            data.isEditNewFlag = false;
            nextTick(() => {
              let file = {
                imgLimit: 1,
                isUpdate: true,
                fileList: [],
                type: data.type,
                pathName: "warehouse/product/VirtualDeclarationLog/img",
              };
              if (data.ruleForm.productPicture) {
                file.fileList.push({ url: data.ruleForm.productPicture });
              }

              UploadImage.value.getImgMsg(file);
            });
          } else {
            data.isEditNewFlag = true;
          }
        });
      } else {
        data.isNewFlag = true;
        /*
        复制走到这里
        如果复制时 虚拟申报有信息
        console.log(virtualDeclVoF.value);*/
        console.log(JSON.stringify(virtualDeclVoF.value) !== "{}", virtualDeclVoF.value);
        if (JSON.stringify(virtualDeclVoF.value) !== "{}") {
          data.ruleForm.cnName = virtualDeclVoF.value.productCn;
          data.ruleForm.enName = virtualDeclVoF.value.productEn;
          data.ruleForm.pullDeclaredValue = virtualDeclVoF.value.importDeclareValue > 0 ? (virtualDeclVoF.value.importDeclareValue * 1).toFixed(2) : 0;
          data.ruleForm.unDeclaredValue = virtualDeclVoF.value.exportDeclareValu ? (virtualDeclVoF.value.exportDeclareValue * 1).toFixed(2) : 0;
          data.ruleForm.textureMaterial = virtualDeclVoF.value.texture;
          data.ruleForm.companyText = virtualDeclVoF.value.proUnit;
          data.ruleForm.declarationDescription = virtualDeclVoF.value.declareExplain;
          data.ruleForm.productPicture = virtualDeclVoF.value.proPicturePath;
          data.ruleForm.referenceLink = virtualDeclVoF.value.referenceLinking;
          data.ruleForm.purpose = virtualDeclVoF.value.purpose;
          data.ruleForm.customsCode = virtualDeclVoF.value.customsCode;
          data.ruleForm.model = virtualDeclVoF.value.model;
          data.ruleForm.brand = virtualDeclVoF.value.brand;
          nextTick(() => {
            let file = {
              imgLimit: 1,
              isUpdate: true,
              fileList: [],
              type: data.type,
              pathName: "warehouse/product/VirtualDeclarationLog/img",
            };
            file.fileList.push({ url: data.ruleForm.productPicture });
            UploadImage.value.getImgMsg(file);
          });
        }
      }
    };
    // 移除图片
    const removeImg = () => {
      data.ruleForm.productPicture = "";
    };
    // 取消
    const handleClose = () => {
      closed();
      data.virtualDeclarationFlag = false;
    };

    // 提交保存
    const onSubmit = () => {
      console.log(vue.$props.productData);
      virtualForm.value.validate(valid => {
        if (valid) {
          let virtualDeclVo = {
            customsCode: data.ruleForm.customsCode ? data.ruleForm.customsCode.trim() : "",
            declareExplain: data.ruleForm.declarationDescription ? data.ruleForm.declarationDescription.trim() : "",
            declareValueUnit: "USD",
            exportDeclareValue: data.ruleForm.unDeclaredValue,
            importDeclareValue: data.ruleForm.pullDeclaredValue ? data.ruleForm.pullDeclaredValue.trim() : "",
            proId: vue.$props.productData.proId ? vue.$props.productData.proId : "",
            proPicturePath: data.ruleForm.productPicture,
            proSku: vue.$props.productData.sku ? vue.$props.productData.sku : "",
            proUnit: data.ruleForm.companyText,
            productCn: data.ruleForm.cnName ? data.ruleForm.cnName.trim() : "",
            productEn: data.ruleForm.enName ? data.ruleForm.enName.trim() : "",
            purpose: data.ruleForm.purpose ? data.ruleForm.purpose.trim() : "",
            referenceLinking: data.ruleForm.referenceLink ? data.ruleForm.referenceLink.trim() : "",
            texture: data.ruleForm.textureMaterial ? data.ruleForm.textureMaterial.trim() : "",
            model: data.ruleForm.model ? data.ruleForm.model.trim() : "",
            brand: data.ruleForm.brand ? data.ruleForm.brand.trim() : "",
          };
          if (data.isNewFlag) {
            virtualDeclVoF.value = virtualDeclVo;
            data.virtualDeclarationFlag = false;
          } else {
            if (!data.isEditNewFlag) {
              // 编辑情况
              api.product.updateVirtualDeclare(virtualDeclVo).then(res => {
                if (res.code == 200) {
                  vue.$message({
                    type: "success",
                    message: res.msg,
                  });
                  data.virtualDeclarationFlag = false;
                } else {
                  vue.$message({
                    type: "warning",
                    message: res.msg,
                  });
                }
              });
            } else {
              // 当前数据无暂无虚拟海外商数据需要 新增时新增
              api.product.insertVirtualDeclare(virtualDeclVo).then(res => {
                if (res.code == 200) {
                  vue.$message({
                    type: "success",
                    message: res.msg,
                  });
                  data.virtualDeclarationFlag = false;
                } else {
                  vue.$message({
                    type: "warning",
                    message: res.msg,
                  });
                }
              });
            }
          }
        } else {
          vue.$message({
            type: "warning",
            message: "请填写相关信息！",
          });
        }
      });
    };

    // receive
    const receive = e => {
      data.ruleForm.productPicture = e && e.link ? e.link : "";
    };

    return {
      ...refData,
      closed,
      handleClose,
      onSubmit,
      receive,
      virtualForm,
      getMsg,
      UploadImage,
      virtualDeclVoF,
      removeImg,
    };
  },
};
</script>
<style scoped lang="scss">
#virtualDeclarationLog {
  .form_box {
    width: 100%;
    display: flex;

    .form_item_div {
      width: 50%;
      height: 100%;

      .form_item {
        display: flex;
        width: 100%;
      }

      .form_item2 {
        display: flex;
        width: 100%;

        div {
          width: 90%;
        }
      }
    }
  }
}
</style>
