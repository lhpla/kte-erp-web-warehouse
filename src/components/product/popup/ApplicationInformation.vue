<!-- 申报信息 -->
<template>
  <div>
    <div v-loading="formLoading" style="min-height: 650px">
      <el-form
        v-show="!formLoading"
        ref="declareFrom"
        :rules="declareFromRules"
        :disabled="!isAdd"
        size="mini"
        :model="proDeclareInfo"
        class="product-form"
        label-width="160px"
      >
        <div class="product-item">
          <el-form-item label="中文申报名称 ：" prop="declareCname">
            <el-input :disabled="!isEdit" v-model="proDeclareInfo.declareCname" clearable placeholder="请填写中文申报名称"></el-input>
          </el-form-item>
          <el-form-item label="英文申报名称 ：" prop="declareEname">
            <el-input :disabled="!isEdit" v-model="proDeclareInfo.declareEname" clearable placeholder="请填写英文申报名称"></el-input>
          </el-form-item>
        </div>
        <div class="product-item">
          <div class="formDis">
            <el-form-item label="申报价值 ：" prop="decclareImportValue">
              <el-input :disabled="!isEdit" v-model.trim="proDeclareInfo.decclareImportValue" clearable class="size-width" placeholder="进口申报价值"></el-input>
              <el-input :disabled="!isEdit" v-model.trim="proDeclareInfo.exportDecclareValue" clearable class="size-width" placeholder="出口申报价值"></el-input>
            </el-form-item>
            <span>USD(美元)</span>
            <el-tooltip  class="box-item" effect="dark" placement="top">
                <i class="el-icon-question" style="margin-top: 9px; font-size: 13px"></i>
                <template #content>
                  <div style="width:100px">
                    {{proDeclareInfo.rateInfo}}
                  </div>
                </template>
            </el-tooltip>
          </div>
          <el-form-item label="产品单位 ：" prop="proUnit">
            <el-select :disabled="!isEdit" v-model="proDeclareInfo.proUnit" filterable clearable placeholder="请选择产品单位">
              <el-option :label="item.value" :value="item.dizKey" v-for="item in pro_unit_dict" :key="item.dizKey"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="用途 ：" prop="purpose">
            <el-input :disabled="!isEdit" v-model="proDeclareInfo.purpose" clearable placeholder="请填写用途"></el-input>
          </el-form-item>
          <el-form-item label="材质 ：" prop="texture">
            <el-input :disabled="!isEdit" v-model="proDeclareInfo.texture" clearable placeholder="请填写材质"></el-input>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="海关编码 ：" prop="customsCode">
            <el-input :disabled="!isEdit" tyep="number" v-model="proDeclareInfo.customsCode" clearable placeholder="请填写海关编码"></el-input>
          </el-form-item>
          <el-form-item label="品牌 ：" prop="brand">
            <el-input :disabled="!isEdit" v-model="proDeclareInfo.brand" clearable placeholder="请输入"></el-input>
          </el-form-item>
        </div>
        <div class="product-item">
          <el-form-item label="型号 ：" prop="model">
            <el-input :disabled="!isEdit" v-model="proDeclareInfo.model" clearable placeholder="请输入"></el-input>
          </el-form-item>
        </div>

        <div class="remark">
          <el-form-item label="申报说明 ：" prop="declareExplain">
            <el-input
              type="textarea"
              v-model="proDeclareInfo.declareExplain"
              placeholder="参数型号：XXX；用途：XXX；材质：XXX；品牌：XXX；"
              class="remark"
              maxlength="500"
              style="width: 300px"
              show-word-limit
              clearable
              :rows="3"
              :disabled="!isEdit"
            ></el-input>
          </el-form-item>
        </div>

        <div class="customs-clearance-information-form">
          <div class="table-box">
            <div class="table-header">
              <el-button v-if="isEdit" type="primary" @click="addCustomsClearance" size="mini" :loading="submitActive" >新增清关信息</el-button>
              <el-button v-if="isEdit" type="primary" @click="submitCustomsClearance" size="mini" :loading="submitActive">一键提交清关信息</el-button>
            </div>
          </div>
          <el-table :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }" :data="proDeclareInfo.declareCustoms" tooltip-effect="dark" element-loading-text="加载中" border>
            <el-table-column prop="customsClearanceCountryId" label="清关国家">
              <template #default="{ row, $index }">
                <el-select
                  v-model="row.customsClearanceCountryId"
                  filterable
                  clearable
                  placeholder="请选择"
                  @change="customsClearanceCountryIdChange($event, $index)"
                  v-if="row.isEdit"
                  size="mini"
                  :disabled="!isEdit"
                >
                  <el-option :label="item.cnName" :value="item.id" v-for="item in countryList" :key="item.id"></el-option>
                </el-select>
                <span v-else>{{ row.customsClearanceCountryId ? tableTypeComputed(row.customsClearanceCountryId, "countryList") : "-" }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="clearanceCustomsCode" label="海关编码（清关）">
              <template #default="{ row, $index }">
                <el-input
                  v-model="row.clearanceCustomsCode"
                  size="mini"
                  clearable
                  placeholder="请输入内容"
                  v-if="row.isEdit"
                  @blur="clearanceCustomsCodeBlur($event, $index)"
                  @change="isCustomsClearanceInformationChangeFlag = true"
                  :disabled="!isEdit"
                  maxlength="10"
                ></el-input>
                <span v-else>{{ row.clearanceCustomsCode ? row.clearanceCustomsCode : "-" }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="customsClearanceRate" label="清关税率（%）" width="150">
              <template #default="{ row, $index }">
                <el-input
                  v-model="row.customsClearanceRate"
                  size="mini"
                  clearable
                  @blur="customsClearanceRateBlur($event, $index)"
                  placeholder="请输入内容"
                  v-if="row.isEdit"
                  @change="isCustomsClearanceInformationChangeFlag = true"
                  :disabled="!isEdit"
                ></el-input>
                <span v-else>{{ row.customsClearanceRate ? row.customsClearanceRate : "-" }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createUserName" label="录入人" width="100">
              <template #default="scope">
                <span>{{ scope.row.createUserName ? scope.row.createUserName : "-" }}</span>
              </template>
            </el-table-column>
            <el-table-column class-name="table-operation" width="150" label="操作">
              <template #default="scope">
                <el-button :disabled="!isEdit" size="mini" icon="el-icon-delete" type="text" @click="deleteRow(scope.row)">删除</el-button>
                <el-button :disabled="!isEdit" size="mini" :icon="scope.row.isEdit ? 'el-icon-circle-check' : 'el-icon-edit'" type="text" @click="editRow(scope.row)">
                  {{ scope.row.isEdit ? "保存" : "编辑" }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <span class="notice">若申报信息未填入完成，则该产品提交成功后的申报状态为待完善。</span>

        <el-form-item v-if="isEdit">
          <div class="form-btn-footer" v-if="isAdd">
            <el-button icon="el-icon-circle-check" type="primary" @click="saveSubmit" :loading="submitActive" :disabled="submitActive" size="mini">保 存</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!-- 选择采购单弹窗 -->
      <el-dialog
      title="选择采购单"
      v-model="dialogVisible"
      width="1100px"
      :before-close="onPurchaseCancel"
      destroy-on-close
      >
         <vxe-table
          align="center"
          :data="purchaseData"
          @checkbox-all="selectAllChangeEvent"
          @checkbox-change="selectChangeEvent"
          height="500px"
          >
          <vxe-column type="checkbox" width="60"></vxe-column>
          <vxe-column title="PO单号" field="orderCode">
            <template #default="scope">
            <div v-if="scope.row.orderCode">
              {{scope.row.orderCode}}
            </div>
            <span v-else>-</span>
            </template>
          </vxe-column>
          <vxe-column title="采购单状态" field="orderStatus">
            <template #default="scope">
            <div v-if="scope.row.orderStatus">
              {{
                  purchaseComputed(purchase_order_status, scope.row.orderStatus)
              }}
            </div>
            <span v-else>-</span>
            </template>
          </vxe-column>
          <vxe-column title="SKU" field="sku">
            <template #default="scope">
            <div v-if="scope.row.sku">
              {{scope.row.sku}}
            </div>
            <span v-else>-</span>
            </template>
          </vxe-column>
          <vxe-column field="skuNumber">
            <template #header>
              <span>
                SKU数量(pcs)
              </span>
              <el-tooltip class="box-item" effect="dark" placement="top">
              <i class="el-icon-question" style="margin-left: 3px; font-size: 13px"></i>
              <template #content>
                <div>
                  对应PO单对应sku已入库但未发起发货计划的数量
                </div>
              </template>
              </el-tooltip>
            </template>
            <template #default="scope">
            <div v-if="scope.row.skuNumber">
              {{scope.row.skuNumber}}
            </div>
            <span v-else>-</span>
            </template>
          </vxe-column>
          <vxe-column title="付款状态" field="paymentStatus">
             <template #default="scope">
            <div v-if="scope.row.orderStatus">
              {{
                  purchaseComputed(payment_status, scope.row.paymentStatus)
              }}
            </div>
            <span v-else>-</span>
            </template>
          </vxe-column>
          <vxe-column title="创建时间" field="createTime">
            <template #default="scope">
            <div v-if="scope.row.createTime">
              {{scope.row.createTime}}
            </div>
            <span v-else>-</span>
            </template>
          </vxe-column>
          <vxe-column title="付款时间" field="payOverTime">
             <template #default="scope">
            <div v-if="scope.row.payOverTime">
              {{scope.row.payOverTime}}
            </div>
            <span v-else>-</span>
            </template>
          </vxe-column>
        </vxe-table>
        
        <template #footer>
        <div class="dialog-footer">
          <!-- <el-button size='mini' @click="onPurchaseCancel">取消</el-button> -->
          <span style="margin-right:390px;color:#409eff">注意：这里的数据来源于未生成发货计划的采购单，勾选保存成功后，其所选的采购单将更新申报信息。</span>
          <el-button size='mini' type="primary" @click="onPurchaseSubmit">确认</el-button>
        </div>
      </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject, computed, onDeactivated } from "vue";
import { localGet } from "@/utils/util";
export default {
  name: "ApplicationInformation",
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible:false,
      isEdit:true,
      addObj: {},
      //备份数据
      backUpData:{},
      proDeclareInfo: {
        declareCustoms: [],
      },
      formLoading: false, //表单loading
      // 申报信息校验规则
      declareFromRules: {
        decclareImportValue: [
          { required: false, message: "请填写申报价值", trigger: "blur" },
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: "正数,两位小数" },
        ],
        declareCname:[{ required: false, message: "请填写中文申报名称", trigger: "blur" }],
        declareEname:[{ required: false, message: "请填写英文申报名称", trigger: "blur" }],
        texture:[{ required: false, message: "请填写材质", trigger: "blur" }],
        customsCode:[
          { required: false, message: '请输入海关编码', trigger: 'blur' },
          { min:6,max:10,message:"输入格式错误",trigger:"blur"}
        ]
      },
      pro_unit_dict: [],
      submitActive: false,
      isAdd: false,
      proStatus: "",
      isCustomsClearanceInformationChangeFlag: false, //清关信息是否编辑 默认否
      countryList: [], //国家列表
      isFirstGetDetail: false,
      purchaseData:[],
      multipleList:[],
      purchaseDict:{},
      purchase_order_status:[],
      payment_status:[]
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      data.purchaseDict = localGet("purchaseDict")
        ? localGet("purchaseDict")
        : [];
      data.purchase_order_status = data.purchaseDict.purchase_order_status
        ? data.purchaseDict.purchase_order_status
        : [];
      data.payment_status = data.purchaseDict.payment_status
        ? data.purchaseDict.payment_status
        : [];
    });

    onDeactivated(() => {
      data.addObj = {
        customsClearanceCountry: "",
        customsClearanceCountryId: "",
        clearanceCustomsCode: "9405108010",
        customsClearanceRate: "",
        isEdit: true,
        id: "",
        indexId: randomId(),
        proSku: "",
        proId: "",
      };
    });
    //获取基础信息
    const getListMsg = () => {
      data.pro_unit_dict = localGet("dictCodeList") && localGet("dictCodeList").pro_unit_dict ? localGet("dictCodeList").pro_unit_dict : [];
    };
    // 新增
    const getMsg = proDeclareInfo => {
       api.systemNew.getCountryList().then(res => {
        if (res.code == 200) {
          data.countryList = res.data;
        }
      });
      getListMsg();
      data.isAdd = false;
      if (proDeclareInfo) {
        data.proDeclareInfo = proDeclareInfo;
        data.proDeclareInfo.exportDecclareValue =
          data.proDeclareInfo.exportDecclareValue && data.proDeclareInfo.exportDecclareValue !== -1 ? Number(data.proDeclareInfo.exportDecclareValue).toFixed(2) : "";
        data.proDeclareInfo.decclareImportValue =
          data.proDeclareInfo.decclareImportValue && data.proDeclareInfo.decclareImportValue !== -1 ? Number(data.proDeclareInfo.decclareImportValue).toFixed(2) : "";
      } else {
        data.proDeclareInfo = {
          decclareImportValue: "",
          exportDecclareValue: "",
        };
      }
    };

    // 修改
    const getApiMsg = msg => {
      data.isEdit = msg.isEdit;
      //改变校验规则
      //中文申报名称/英文申报名称/材质/申报价值
      // const rule = ['declareCname','declareEname','texture','decclareImportValue']
      // if(msg.devStatus == '10'){
      //   rule.forEach(item=>{
      //     data.declareFromRules[item][0].required = !data.declareFromRules[item][0].required
      //   })
      // }
      getListMsg();
      data.productData = msg;
      data.isAdd = true;
      getDeclareInfo(data.productData);
    };
    // 获取详情
    const getDeclareInfo = msg => {
      api.systemNew.getCountryList().then(res => {
        if (res.code == 200) {
          data.countryList = res.data;
        }
      });
      data.formLoading = true;
      data.proDeclareInfo = {
        decclareImportValue: "",
        exportDecclareValue: "",
      };
      api.productLibrary.getDeclareInfo(msg).then(res => {
        if (res.code == 200) {
          data.proDeclareInfo = res.data;
          data.proDeclareInfo.exportDecclareValue =
            data.proDeclareInfo.exportDecclareValue && data.proDeclareInfo.exportDecclareValue !== -1 ? Number(data.proDeclareInfo.exportDecclareValue).toFixed(2) : "";
          data.proDeclareInfo.decclareImportValue =
            data.proDeclareInfo.decclareImportValue && data.proDeclareInfo.decclareImportValue !== -1 ? Number(data.proDeclareInfo.decclareImportValue).toFixed(2) : "";
          data.formLoading = false;
          if (data.proDeclareInfo.declareCustoms && data.proDeclareInfo.declareCustoms.length > 0 && data.proDeclareInfo.isSubmit) {
            data.proDeclareInfo.declareCustoms.map(i => {
              i.id = "";
              i.indexId = randomId();
              if (i.customsClearanceCountryId) {
                i.customsClearanceCountryId = String(i.customsClearanceCountryId);
              }
            });
          } else if (data.proDeclareInfo.declareCustoms && data.proDeclareInfo.declareCustoms.length > 0 && !data.proDeclareInfo.isSubmit) {
            data.proDeclareInfo.declareCustoms.map(i => {
              if (i.customsClearanceCountryId) {
                i.customsClearanceCountryId = String(i.customsClearanceCountryId);
              }
            });
          }
          data.backUpData = JSON.parse(JSON.stringify(data.proDeclareInfo))
        } else {
          vue.$message.warning(res.msg);
          data.formLoading = false;
        }
      });
    };
    // 修改保存
    const saveSubmit = () => {
      data.proDeclareInfo.declareCname = data.proDeclareInfo.declareCname ? data.proDeclareInfo.declareCname.trim() : "";
      data.proDeclareInfo.declareEname = data.proDeclareInfo.declareEname ? data.proDeclareInfo.declareEname.trim() : "";
      data.proDeclareInfo.purpose = data.proDeclareInfo.purpose ? data.proDeclareInfo.purpose.trim() : "";
      data.proDeclareInfo.texture = data.proDeclareInfo.texture ? data.proDeclareInfo.texture.trim() : "";
      data.proDeclareInfo.customsCode = data.proDeclareInfo.customsCode ? data.proDeclareInfo.customsCode.trim() : "";
      data.proDeclareInfo.brand = data.proDeclareInfo.brand ? data.proDeclareInfo.brand.trim() : "";
      data.proDeclareInfo.model = data.proDeclareInfo.model ? data.proDeclareInfo.model.trim() : "";
      data.submitActive = true;
      let info = {
        declareCname: data.proDeclareInfo.declareCname,
        declareEname: data.proDeclareInfo.declareEname,
        decclareImportValue: data.proDeclareInfo.decclareImportValue,
        exportDecclareValue: data.proDeclareInfo.exportDecclareValue,
        texture: data.proDeclareInfo.texture,
        customsCode: data.proDeclareInfo.customsCode,
        brand: data.proDeclareInfo.brand,
        declareExplain: data.proDeclareInfo.declareExplain,
        id: data.proDeclareInfo.id,
        model: data.proDeclareInfo.model,
        proUnit: data.proDeclareInfo.proUnit,
        purpose: data.proDeclareInfo.purpose,
        proId: data.productData.proId,
        proSku: data.productData.sku ? data.productData.sku : "",
        DeclareCustoms: data.proDeclareInfo.DeclareCustoms,
      };
      const arr = [
        'declareCname',
        'declareEname',
        'decclareImportValue',
        'exportDecclareValue',
        'texture',
        'customsCode',
        'brand',
        'declareExplain',
        'proUnit',
        'purpose',
        'model'
        ]
      let flag = arr.some(item=>{
          return data.proDeclareInfo[item] !== data.backUpData[item]
        })
      if(!data.isCustomsClearanceInformationChangeFlag){
        api.product
          .updateDeclare(info)
          .then(res => {
            if (res.code == 200) {
              vue.$message({
                type: "success",
                message: res.msg,
              });
              getDeclareInfo(data.productData);
              data.submitActive = false;
              if(flag){
                data.purchaseData = res.data.vo
                data.proSku = res.data.proSku
                data.dialogVisible = true
              }
            } else {
              vue.$message({
                type: "warning",
                message: res.msg,
              });
              data.submitActive = false;
            }
          })
          .catch(err => {
            data.submitActive = false;
          });
        }else{
          vue.$message.warning("请先保存清关信息！");
          data.submitActive = false;
        }
    };
  
    const refData = toRefs(data);
    const proDeclareInfoF = inject("proDeclareInfo");
    // 申报信息
    const declareFrom = ref(null);
    //获取  proStatus
    const getProStatus = status => {
      data.proStatus = status;
    };

    const submit = () => {
      if (data.proStatus == 0) {
        vue.$emit("funPromise", true);
        if (data.proDeclareInfo.decclareImportValue) {
          data.proDeclareInfo.decclareImportValue = Number(data.proDeclareInfo.decclareImportValue);
        }
        if (data.proDeclareInfo.exportDecclareValue) {
          data.proDeclareInfo.exportDecclareValue = Number(data.proDeclareInfo.exportDecclareValue);
        }
        proDeclareInfoF.value = data.proDeclareInfo;
      } else if (data.proStatus == 1) {
        // declareFrom.value.validate(valid => {
        //   if (valid) {
        vue.$emit("funPromise", true);
        proDeclareInfoF.value = data.proDeclareInfo;
      } else {
        vue.$emit("funPromise", false);
        //   }
        // });
      }
    };

    const closed = () => {
      if (declareFrom.value) {
        declareFrom.value.clearValidate();
        declareFrom.value.resetFields();
      }
    };

    //新增清关信息
    const addCustomsClearance = () => {
      data.isCustomsClearanceInformationChangeFlag = true;
      data.addObj = {
        customsClearanceCountry: "",
        customsClearanceCountryId: "",
        clearanceCustomsCode: "9405108010",
        customsClearanceRate: "",
        isEdit: true,
        id: "",
        indexId: randomId(),
        proSku: "",
        proId: "",
      };
      data.proDeclareInfo.declareCustoms.push(JSON.parse(JSON.stringify(data.addObj)));
    };

    //一键提交清关信息
    const submitCustomsClearance = () => {
      data.submitActive = true;
      console.log(data.proDeclareInfo);
      if (data.proDeclareInfo.proId) {
        if (data.proDeclareInfo.declareCustoms.length > 0) {
          let verifyFlag = false;
          verifyFlag = data.proDeclareInfo.declareCustoms.every(item => {
            return (
              item.customsClearanceCountryId &&
              item.customsClearanceCountryId != "" &&
              item.clearanceCustomsCode &&
              item.clearanceCustomsCode != "" &&
              item.customsClearanceRate &&
              item.customsClearanceRate &&
              !item.isEdit
            );
          });
          if (verifyFlag) {
            data.proDeclareInfo.declareCustoms.map(item => {
              if (item.indexId) {
                delete item.indexId;
              }
              if (data.proDeclareInfo.proSku) {
                item.proSku = data.proDeclareInfo.proSku;
              }
              if (data.proDeclareInfo.proId) {
                item.proId = data.proDeclareInfo.proId;
              }
            });
            console.log(data.proDeclareInfo.declareCustoms);

            api.product
              .dealBatchBasicsDeclareCustoms(data.proDeclareInfo.declareCustoms)
              .then(res => {
                if (res.code == 200) {
                  vue.$message.success(res.msg);
                  data.submitActive = false;
                  data.isCustomsClearanceInformationChangeFlag = false;
                } else {
                  vue.$message.warning(res.msg);
                  data.submitActive = false;
                }
              })
              .catch(() => {
                data.submitActive = false;
              });
          } else {
            vue.$message.warning("请补充完善清关信息并保存后再进行提交！");
            data.submitActive = false;
          }
        } else {
          vue.$message.warning("不能提交空的清关信息！");
          data.submitActive = false;
        }
      } else {
        vue.$message.warning("请先暂存或提交当前数据，确保当前数据已生成产品ID后进行质检信息编辑！");
        data.submitActive = false;
      }
    };

    //编辑当前行清关信息
    const editRow = row => {
      console.log(row);
      if (row.customsClearanceCountryId && row.customsClearanceRate && row.clearanceCustomsCode) {
        row.isEdit = !row.isEdit;
        data.isCustomsClearanceInformationChangeFlag = true;
      } else {
        vue.$message.warning("请填将清关信息填写完整！");
      }
    };

    //删除当前行清关信息
    const deleteRow = row => {
      data.isCustomsClearanceInformationChangeFlag = true;
      if (row.indexId && row.indexId != "") {
        data.proDeclareInfo.declareCustoms = data.proDeclareInfo.declareCustoms.filter(item => {
          return row.indexId != item.indexId;
        });
      }
      if (!row.indexId && row.id) {
        data.proDeclareInfo.declareCustoms = data.proDeclareInfo.declareCustoms.filter(item => {
          return row.id != item.id;
        });
      }
    };

    // 随机产生不重复的id
    const randomId = () => {
      let supplierPayId = "";
      supplierPayId = Math.ceil(Math.random() * 10000);
      return supplierPayId;
    };

    // 计算表格显示
    const tableTypeComputed = computed(() => {
      return function (id, itemName) {
        let value = "";
        if (data[itemName] && data[itemName].length && id !== -1) {
          data[itemName].forEach(item => {
            if (item.id == id) {
              value = item.cnName;
            }
          });
        }
        console.log();
        return value;
      };
    });

     // 计算表格字典
    const purchaseComputed = computed(() => {
      return function (list, dizKey) {
        if (list.length > 1 && dizKey !== -1) {
          for (let item of list) {
            if (dizKey == item.dizKey) {
              return item.value;
            }
          }
        }
      };
    });

    //清关国家change
    const customsClearanceCountryIdChange = (e, i) => {
      data.proDeclareInfo.declareCustoms[i] = {
        customsClearanceCountry: "",
        customsClearanceCountryId: "",
        clearanceCustomsCode: "9405108010",
        customsClearanceRate: "",
        isEdit: true,
        id: "",
        indexId: randomId(),
        proSku: "",
        proId: "",
      };
      data.isCustomsClearanceInformationChangeFlag = true;
      data.proDeclareInfo.declareCustoms[i].customsClearanceCountryId = e;
      let customsClearanceCountryId = data.proDeclareInfo.declareCustoms.find(
        d => d.customsClearanceCountryId == data.proDeclareInfo.declareCustoms[i].customsClearanceCountryId
      ).customsClearanceCountry;
      if (customsClearanceCountryId) {
        vue.$message.warning("国家不能重复选择！请重新选择！");
        data.proDeclareInfo.declareCustoms[i] = {
          customsClearanceCountry: "",
          customsClearanceCountryId: "",
          clearanceCustomsCode: "9405108010",
          customsClearanceRate: "",
          isEdit: true,
          id: "",
          indexId: randomId(),
          proSku: "",
          proId: "",
        };
      } else {
        data.proDeclareInfo.declareCustoms[i].customsClearanceCountry = data.countryList.find(c => c.id == e).cnName;
      }
    };

    //税率blur
    const customsClearanceRateBlur = (e, i) => {
      let ret = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (!ret.test(e.target.value)) {
        vue.$message.warning("请输入数字,可保留两位小数");
        data.proDeclareInfo.declareCustoms.map((item, index) => {
          if (index == i) {
            item.customsClearanceRate = "";
          }
        });
      }
    };

    //海关编码blur
    const clearanceCustomsCodeBlur = (e, i) => {
      let ret = /^([0-9]*)$/;
      if (!ret.test(e.target.value)) {
        vue.$message.warning("请输入正整数！");
        data.proDeclareInfo.declareCustoms.map((item, index) => {
          if (index == i) {
            item.clearanceCustomsCode = "";
          }
        });
      }else{
        if (e.target.value.length<6) {
          vue.$message.warning("请输入格式错误！");
          data.proDeclareInfo.declareCustoms.map((item, index) => {
            if (index == i) {
              item.clearanceCustomsCode = "";
            }
          });
        }
      }
    };

    const selectAllChangeEvent = ({ $table })=>{
        data.multipleList = $table.getCheckboxRecords()
        console.log(data.multipleList);
    }
    const selectChangeEvent = ({ $table })=>{
        data.multipleList = $table.getCheckboxRecords()
        console.log(data.multipleList);
    }
    //提交采购单列表
    const onPurchaseSubmit = ()=>{
      const info = {
        vo:data.multipleList,
        proSku:data.proSku
      }
      api.product.synchronizationInfoToPurchase(info).then(res=>{
        if(res.code == 200){
          vue.$message.success(res.msg)
          data.dialogVisible = false
          data.multipleList = []
        }else{
          vue.$message.warning(res.msg)
        }
      })
    }
    //取消提交采购单列表
    const onPurchaseCancel = ()=>{
      data.multipleList = []
      data.dialogVisible = false
    }

    return {
      ...refData,
      submit,
      declareFrom,
      closed,
      getMsg,
      proDeclareInfoF,
      getApiMsg,
      saveSubmit,
      getProStatus,
      addCustomsClearance,
      submitCustomsClearance,
      customsClearanceCountryIdChange,
      editRow,
      deleteRow,
      randomId,
      tableTypeComputed,
      customsClearanceRateBlur,
      clearanceCustomsCodeBlur,
      selectAllChangeEvent,
      selectChangeEvent,
      onPurchaseSubmit,
      onPurchaseCancel,
      purchaseComputed
    };
  },
};
</script>
<style scoped lang="scss">
.product-form {
  display: flex;
  flex-direction: column;
  // .dialog-footer{
  //   width:100%;
  //   display:flex;
  //   justify-content:space-between
  // }
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
  .el-select {
    width: 300px;
  }

  .formDis {
    display: flex;
    width: 39.5%;
    .size-width {
      width: 105px;
    }
    .size-width:last-child {
      margin-left: 5px;
    }
    span {
      line-height: 28px;
      margin-bottom: 18px;
      margin-left: 10px;
      font-size: 12px;
      color: #aaa;
    }
  }
  .remark {
    width: 100%;
    :deep(.el-textarea) {
      width: 76% !important;
    }
  }
  .customs-clearance-information-form {
    .table-box {
      width: 100%;
    }
  }
  .notice {
    margin-top: 30px;
    font-size: 12px;
    color: #7c7c7c;
  }
}
</style>
