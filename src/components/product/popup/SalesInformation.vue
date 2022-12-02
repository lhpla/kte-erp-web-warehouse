<!-- 销售信息 -->
<template>
  <div id="SalesInformation">
      <div v-loading="formLoading" style="min-height: 650px">
        <template v-if="proMarketInfoList.length > 0">
          <div v-for="(item, index) in proMarketInfoList" :key="index" class="form-border">
            <el-form
              :model="item"
              size="mini"
              :inline="true"
              :rules="rules"
              :ref="item.purchaseForm"
              label-width="140px"
              class="demo-ruleForm"
              v-show="!formLoading"
            >
              <el-button v-if="isEdit" class="del-productAttributes" icon="el-icon-delete" @click="delAttribut(index, item.id)" type="text"
                >删除</el-button
              >
              <el-form-item label="销售平台:" prop="platformId">
                <el-select
                  :disabled="!isEdit"
                  v-model="item.platformId"
                  @change="changePlatFrom(item.platformId, index)"
                  size="mini"
                  filterable
                  clearable
                  placeholder="Ebay"
                >
                  <el-option :label="item.name" :value="item.id" v-for="item in platformList" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="销售站点:" prop="siteId">
                <el-select :disabled="!isEdit" v-model="item.siteId" size="mini" filterable clearable placeholder="全站点">
                  <el-option :label="item.site" :value="item.id" v-for="item in item.siteList" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="销售负责人:" prop="salesManagerId">
                <el-select :disabled="!isEdit" v-model="item.salesManagerId" size="mini" filterable clearable placeholder="请选择">
                  <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item style="position: relative" label="海外参考链接:" prop="overseasReferenceLink">
                <el-input :disabled="!isEdit" clearable v-model.trim="item.overseasReferenceLink" placeholder="http://...."></el-input>
                <i
                  style="position: absolute; right: -15px; top: 9px"
                  v-if="item.overseasReferenceLink"
                  class="el-icon-document-copy"
                  @click="copyText(item.overseasReferenceLink)"
                ></i>
              </el-form-item>
              <el-form-item style="position: relative" label="海外销售链接:" prop="overseasSalesLink">
                <el-input :disabled="!isEdit" clearable v-model.trim="item.overseasSalesLink" placeholder="http://...."></el-input>
                <i
                  style="position: absolute; right: -15px; top: 9px"
                  v-if="item.overseasSalesLink"
                  class="el-icon-document-copy"
                  @click="copyText(item.overseasSalesLink)"
                ></i>
              </el-form-item>

              <span class="formDis">
                <el-form-item label="建议售价:" prop="offerPrice">
                  <el-input :disabled="!isEdit" clearable v-model.trim="item.offerPrice" class="size-width" placeholder="9.85"></el-input>
                </el-form-item>
                <el-form-item label="" prop="priceUnit" style="display: flex">
                  <el-select :disabled="!isEdit" v-model="item.priceUnit" size="mini" filterable clearable placeholder="USD(美元)">
                    <el-option
                      :label="item.rateType + '(' + item.rateName + ')'"
                      :value="item.id"
                      v-for="item in rateOptions"
                      :key="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </span>
              <el-form-item label="附属销售员:" prop="affiliateSalesManager" class="salesAffiliate">
                <el-select
                  :disabled="!isEdit"
                  v-model="item.affiliateSalesManager"
                  size="mini"
                  filterable
                  clearable
                  multiple
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </template>
        <el-empty v-else description="暂无数据"></el-empty>

        <div class="footer" v-if="isEdit">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="addFrom">新 增</el-button>
          <el-button
            type="primary"
            v-if="isAdd && proMarketInfoList.length > 0"
            size="mini"
            icon="el-icon-circle-check"
            :loading="submitActive"
            :disabled="submitActive"
            @click="saveSubmit"
          >
            保 存
          </el-button>
        </div>
      </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from "vue";
import tablePage from "@/compositionApi/tablePage";
import { localGet, documentCopy } from "../../../utils/util";
export default {
  name: "SalesInformation",
  setup(prop, ctx) {
    const data = reactive({
      isEdit:true,
      disabled: false,
      rules: {
        platformId: [{ required: true, message: "请选择", trigger: "change" }],
        siteId: [{ required: true, message: "请选择", trigger: "change" }],
        //取消建议售价必填验证
        // offerPrice: [
        //   { required: true, message: "请输入", trigger: "blur" },
        //   { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: "输入异常，请重新输入" },
        // ],
        // priceUnit: [{ required: true, message: "请选择", trigger: "change" }],
        // salesManagerId: [{ required: true, message: "请选择", trigger: "change" }],
        overseasReferenceLink: [
          { required: false, message: "请输入", trigger: "change" },
          { max: 500, message: "输入长度已超出最大范围500字符" }
        ],
        overseasSalesLink: [
          { required: false, message: "请输入", trigger: "change" },
          { max: 500, message: "输入长度已超出最大范围500字符" }
        ]
        // affiliateSalesManager: [{ required: false, message: "", trigger: "change" }],
      },
      // 产品销售信息
      proMarketInfoList: [],
      // 销售平台列表
      platformList: [],
      // 汇率列表
      rateOptions: [],
      // 用户列表
      userList: [],
      productData: {},
      isAdd: false,
      submitActive: false,
      formLoading: false, //表单loading
      isFirstGetDetail: false
    });
    const { rowClass } = tablePage();
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    // 获取基础信息
    const getSaleMsg = () => {
      // 销售平台列表
      data.platformList = [];
      api.systemNew.getPlatformAll().then(res => {
        if (res.code == 200) {
          data.platformList = res.data;
        }
      });
      // 汇率
      data.rateOptions = [];
      api.system.getExchangeList().then(res => {
        if (res.code == 200) {
          data.rateOptions = res.data;
        }
      });
      // 用户列表
      data.userList = [];
      // api.userOperation.getAllUser().then(res => {
      //   if (res.code == 200) {
      //     data.userList = res.data;
      //   }
      // });
      api.system.getMarketingDepartmentList().then(res => {
        if (res.code == 200) {
          data.userList = res.data;
        }
      });
    };

    // 新增
    const getMsg = proMarketInfoList => {
      getSaleMsg();
      data.isAdd = false;
      if (proMarketInfoList && proMarketInfoList.length > 0) {
        data.proMarketInfoList = proMarketInfoList;
        for (let i = 0; i < data.proMarketInfoList.length; i++) {
          data.proMarketInfoList[i].purchaseForm = "purchaseForm" + (i + 1);
          data.proMarketInfoList[i].offerPrice = data.proMarketInfoList[i].offerPrice > 0 ? Number(data.proMarketInfoList[i].offerPrice).toFixed(2) : 0;
          data.proMarketInfoList[i].salesManagerId = data.proMarketInfoList[i].salesManagerId > 0 ? data.proMarketInfoList[i].salesManagerId : "1474632793794334722";
          data.proMarketInfoList[i].platformId = data.proMarketInfoList[i].platformId > 0 ? data.proMarketInfoList[i].platformId : "";
          data.proMarketInfoList[i].siteId = data.proMarketInfoList[i].siteId > 0 ? data.proMarketInfoList[i].siteId : "";
          data.proMarketInfoList[i].priceUnit = data.proMarketInfoList[i].priceUnit > 0 ? data.proMarketInfoList[i].priceUnit : "";
          data.proMarketInfoList[i].affiliateSalesManager =
            data.proMarketInfoList[i].affiliateSalesManager.length > 0 ? data.proMarketInfoList[i].affiliateSalesManager.split(",") : [];
          // data.proMarketInfoList[i].siteList = getStateList(data.proMarketInfoList[i].platformId);
          if (data.proMarketInfoList[i].platformId) {
            api.system.getSiteByPlat({ platformId: data.proMarketInfoList[i].platformId, isEnglish: false, includeFullSite: true, isLimit: false }).then(param => {
              data.proMarketInfoList[i].siteList = param.data;
            });
          }
        }
      } else {
        data.proMarketInfoList = [
          {
            platformId: "",
          purchaseForm: "purchaseForm1",
          id: null,
          affiliateSalesManager: [],
          salesManagerId: "1474632793794334722",
          siteId: "",
          overseasReferenceLink: "",
          overseasSalesLink: "",
          offerPrice: "",
          priceUnit: ""
          }
        ];
      }
    };

    // 根据平台id获取对应站点列表
    const getStateList = id => {
      api.system.getSiteByPlat({ platformId: id, isEnglish: false, includeFullSite: true, isLimit: false }).then(res => {
        if (res.code == 200) {
          data.proMarketInfoList.map(item => {
            console.log(id == item.platformId);
            if (id == item.platformId) {
              item.siteList = res.data;
            }
          });
        }
      });
    };

    // 当前操作数据平台change
    const changePlatFrom = (id, index) => {
      if (id) {
        getStateList(id);
        data.proMarketInfoList.map((item, ind) => {
          if (id == item.platformId && ind == index) {
            item.siteId = "";
          }
        });
      }
    };

    // 修改
    const getApiMsg = msg => {
      data.isEdit = msg.isEdit;
      getSaleMsg();
      data.productData = msg;
      data.isAdd = true;
      getMarketInfo(data.productData);
    };

    // 获取销售详情
    const getMarketInfo = msg => {
      data.formLoading = true;

      data.proMarketInfoList = [];
      api.productLibrary.getMarketInfo(msg).then(res => {
        if (res.code == 200) {
          if (res.data.length > 0) {
            data.proMarketInfoList = res.data;
            for (let i = 0; i < data.proMarketInfoList.length; i++) {
              data.proMarketInfoList[i].purchaseForm = "purchaseForm" + (i + 1);
              data.proMarketInfoList[i].offerPrice = data.proMarketInfoList[i].offerPrice > 0 ? Number(data.proMarketInfoList[i].offerPrice).toFixed(2) : 0;
              data.proMarketInfoList[i].salesManagerId = data.proMarketInfoList[i].salesManagerId > 0 ? data.proMarketInfoList[i].salesManagerId : "1474632793794334722";
              data.proMarketInfoList[i].platformId = data.proMarketInfoList[i].platformId > 0 ? data.proMarketInfoList[i].platformId : "";
              data.proMarketInfoList[i].siteId = data.proMarketInfoList[i].siteId > 0 ? data.proMarketInfoList[i].siteId : "";
              data.proMarketInfoList[i].priceUnit = data.proMarketInfoList[i].priceUnit > 0 ? data.proMarketInfoList[i].priceUnit : "";
              data.proMarketInfoList[i].affiliateSalesManager =
                data.proMarketInfoList[i].affiliateSalesManager.length > 0 ? data.proMarketInfoList[i].affiliateSalesManager.split(",") : [];
              // data.proMarketInfoList[i].siteList = getStateList(data.proMarketInfoList[i].platformId);
              if (data.proMarketInfoList[i].platformId) {
                api.system.getSiteByPlat({ platformId: data.proMarketInfoList[i].platformId, isEnglish: false, includeFullSite: true, isLimit: false }).then(param => {
                  data.proMarketInfoList[i].siteList = param.data;
                });
              }
            }
            console.log(data.proMarketInfoList);
          } else {
            data.proMarketInfoList = [];
          }
          data.formLoading = false;
        } else {
          vue.$message.warning(res.msg);
          data.formLoading = false;
        }
      });
    };

    // 删除销售负责人
    const deleteProMarketInfo = row => {
      data.proMarketInfoList = data.proMarketInfoList.filter(item => {
        return item.id !== row.id;
      });
    };

    // 新增销售负责人
    const addProMarketInfo = () => {
      data.proMarketInfoList.push({
        id: randomId()
      });
    };

    // 随机产生不重复的id
    const randomId = () => {
      let supplierPayId = "";
      supplierPayId = Math.ceil(Math.random() * 10000);
      return supplierPayId;
    };

    // 新增组合商品
    const addFrom = () => {
      let msg = {
        purchaseForm: "purchaseForm" + (data.proMarketInfoList.length + 1),
        id: null,
        salesManagerId: "1474632793794334722"
      };
      data.proMarketInfoList.push(msg);
    };

    // 删除
    const delAttribut = (index, id) => {
      // if (data.proMarketInfoList.length > 1) {
        if (id) {
          api.product.deleteMarketInfo({ id: id }).then(res => {
            if (res.code == 200) {
              vue.$message.success({
                message: res.msg,
                type: "success"
              });
              data.proMarketInfoList.splice(index, 1);
            } else {
              vue.$message.warning({
                message: res.msg,
                type: "warning"
              });
            }
          });
        } else {
          data.proMarketInfoList.splice(index, 1);
        }
      // } else {
      //   vue.$message.error({
      //     message: "必须填写一条信息",
      //     type: "error"
      //   });
      // }
    };

    // 验证全部表单
    const checkForm = arrName => {
      return new Promise((resolve, reject) => {
        vue.$refs[arrName][0].validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
    };
    const proMarketInfoListF = inject("proMarketInfoList");
    // 保存
    const submit = () => {
      // vue.$emit("funPromise", true);
      let proMarketInfoList = JSON.stringify(data.proMarketInfoList);
      proMarketInfoList = JSON.parse(proMarketInfoList);
      let flag = proMarketInfoList.every(ite => {
        return (
          ite.platformId == "" &&
          ite.siteId == "" &&
          ite.overseasReferenceLink == "" &&
          ite.overseasSalesLink == "" &&
          ite.offerPrice == "" &&
          ite.priceUnit == "" &&
          ite.affiliateSalesManager.length==0
        );
      });
      if (flag) {
        vue.$emit("funPromise", true);
        proMarketInfoListF.value = proMarketInfoList;
      } else {
        let list = [];
        proMarketInfoList.map((item, index) => {
          list.push(checkForm(item.purchaseForm));
        });
        Promise.all(list)
          .then(res => {
            vue.$emit("funPromise", true);
            proMarketInfoListF.value = proMarketInfoList;
          })
          .catch(err => {
            console.log(err);
            console.log('sale');
            vue.$emit("funPromise", false);
          });
      }
    };

    // 修改保存
    const saveSubmit = () => {
      let list = [];
      data.proMarketInfoList.map((item, index) => {
        list.push(checkForm(item.purchaseForm));
      });
      Promise.all(list)
        .then(res => {
          data.submitActive = true;
          let info = JSON.stringify(data.proMarketInfoList);
          info = JSON.parse(info);
          info.forEach(item => {
            item.proId = data.productData.proId;
            item.proSku = data.productData.sku;
            item.affiliateSalesManager = item.affiliateSalesManager.length > 0 ? item.affiliateSalesManager.join(",") : "";
            delete item.siteList;
          });
          api.productLibrary
            .updateMarketInfo(info)
            .then(res => {
              if (res.code == 200) {
                vue.$message({
                  type: "success",
                  message: res.msg
                });
                getMarketInfo(data.productData);
                data.submitActive = false;
              } else {
                vue.$message({
                  type: "warning",
                  message: res.msg
                });
                data.submitActive = false;
              }
            })
            .catch(err => {
              data.submitActive = false;
            });
        })
        .catch(err => {
          vue.$message.warning({
            message: "请填写正确数据信息",
            type: "warning"
          });
        });
    };

    const closed = () => {
      data.proMarketInfoList = [
        {
          platformId: "",
          purchaseForm: "purchaseForm1",
          siteList: [],
          id: null,
          affiliateSalesManager: [],
          siteId: "",
          salesManagerId: "",
          overseasReferenceLink: "",
          overseasSalesLink: "",
          offerPrice: "",
          priceUnit: ""
        }
      ];
    };
    // 点击复制
    const copyText = (text) => {
      documentCopy(text);
    };

    const refData = toRefs(data);
    return {
      ...refData,
      getMsg,
      deleteProMarketInfo,
      rowClass,
      addProMarketInfo,
      delAttribut,
      addFrom,
      proMarketInfoListF,
      submit,
      closed,
      getApiMsg,
      saveSubmit,
      changePlatFrom,
      getStateList,
      copyText
    };
  }
};
</script>
<style scoped lang="scss">
#SalesInformation {
  .demo-ruleForm {
    border-bottom: 1px solid #eee;
    position: relative;
    margin-bottom: 40px;
    :deep(.is-disabled) input,
    :deep(.is-disabled) textarea{
      color:#909399
    }
    .del-productAttributes {
      position: absolute;
      right: 30px;
      // top: -40px;
    }
    .el-input,
    .el-select {
      width: 200px;
    }

    ::v-deep .salesAffiliate {
      width: 100%;
      // .el-select {
      //   width: 100%;
      // }
      .el-form-item__content {
        width: 77% !important;
      }
    }

    .formDis {
      display: flex;
      .el-form-item:first-child {
        width: 25%;
      }

      .size-width {
        width: 120px;
      }
      .el-select {
        width: 120px;
      }
    }
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 50px;
  }
}
</style>
