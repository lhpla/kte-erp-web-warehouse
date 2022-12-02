<!-- 产品限价新增、修改 -->
<template>
  <div>
    <el-dialog :title="title" width="40%" v-model="editVisible" @closed="closedLog" destroy-on-close>
      <el-form :model="formInline" ref="searchForm" :rules="rules" label-width="110px" size="mini">
        <el-form-item label="SKU：" prop="productSku">
          <el-input v-model="formInline.productSku" class="form-width" @blur="checkSku1(formInline.productSku)" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="产品名称：" prop="productName">
          <el-input v-model="formInline.productName" class="form-width" disabled clearable></el-input>
        </el-form-item>
        <el-form-item label="平台：" prop="marketPlatformId">
          <el-select v-model="formInline.marketPlatformId" class="form-width" filterable placeholder="请选择" clearable @change="getSiteByPlat">
            <el-option v-for="item in platformOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="站点：" prop="marketSiteId">
          <el-select v-model="formInline.marketSiteId" class="form-width" filterable placeholder="请选择" clearable @change="changeMarketSiteId">
            <el-option v-for="item in site" :key="item.id" :label="item.site" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="限价：" prop="retailPrice">
          <el-input v-model.trim="formInline.retailPrice" class="form-width" placeholder="请输入" clearable @blur="checkPrice(formInline.retailPrice, '1')"></el-input>
        </el-form-item>
        <el-form-item label="币种：" prop="currencyId">
          <el-select v-model="formInline.currencyId" class="form-width" filterable placeholder="请选择" clearable>
            <el-option v-for="item in rateOptions" :key="item.id" :label="item.rateType" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="利润率：" prop="profitMargin">
          <el-input
            ref="profitMargin"
            v-model.trim="formInline.profitMargin"
            class="form-width"
            placeholder="请输入"
            clearable
            @blur="checkPrice(formInline.profitMargin, '2')"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closedLog" size="mini" :loading="btnFlag" :disabled="btnFlag">取 消</el-button>
          <el-button type="primary" @click="submit" size="mini" :loading="btnFlag" :disabled="btnFlag">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from "vue";
import { localGet, throttle, localSet } from "@/utils/util";
export default {
  name: "SensitiveWordLibraryPop",

  setup(prop, ctx) {
    const data = reactive({
      editVisible: false,
      // istrue: false, //利润要求
      formInline: {
        marketPlatformId: "",
        proSku: "",
        productName: "",
        startTime: "",
        endTime: "",
        marketSiteName: "",
        retailPrice: "",
        currencyName: "",
        profitMargin: "",
        marketSiteId: "",
        marketPlatformName: "",
        productSku: "",
        currencyId: "",
        id: "",
      },
      btnFlag: false,
      title: "新增",
      // 所有字典
      dictCodeList: [],
      sensitive_risk_level: [],
      sensitive_word_type: [],
      marketPlatformName: [],
      siteOptions: [],
      rateOptions: [],
      platformOptions: [],
      site: [],

      rules: {
        productSku: [{ required: true, message: "请输入sku", trigger: "blur" }],
        currencyId: [{ required: true, message: "请输入币种", trigger: "blur" }],
        retailPrice: [{ required: true, message: "请输入限价", trigger: "blur" }],
        productModel: [
          { message: "请输入选品规格、型号", trigger: "blur" },
          { max: 50, message: "长度不超过50字符", trigger: "change" },
        ],
        pricturePath: [{ required: true, message: "请选择图片", trigger: "blur" }],
        marketPlatformId: [{ required: true, message: "请选择平台", trigger: "blur" }],
        marketSiteId: [{ required: true, message: "请选择站点", trigger: "blur" }],
      },
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const searchForm = ref(null);
    onBeforeMount(() => {});
    onMounted(() => {});

    const closedLog = () => {
      data.editVisible = false;
      searchForm.value.resetFields();
      searchForm.value.clearValidate();
    };
    const getTableData = inject("getTableData");
    //sku获取产品名称
    const checkSku1 = e => {
      if (e) {
        api.sensitive.checkSku({ sku: e }).then(res => {
          if (res.code == 200) {
            data.formInline.productName = res.data;
            vue.$message({
              type: "success",
              message: "获取产品名称成功！",
            });
          } else {
            vue.$message({
              type: "warning",
              message: "获取产品名称失败！",
            });
            data.formInline.productName = "";
          }
        });
      }
    };

    //保留两位小数
    const checkPrice = (e, type) => {
      if (e && type == "1") {
        data.formInline.retailPrice = Number(e).toFixed(2);
      } else if (e && type == "2") {
        // if (Number(e).toFixed(2) > 100) {
        // vue.$message({
        //   type: "warning",
        //   message: "利润率不能大于100",
        // });
        // data.formInline.profitMargin = "";
        // data.istrue = false;
        // } else {
        data.formInline.profitMargin = Number(e).toFixed(2);
        //   data.istrue = true;
      }
      // }
    };

    //获取最新数据
    const getNewData = () => {
      //获取平台
      api.systemNew.getPlatformAll().then(res => {
        if (res.code == 200) {
          data.platformOptions = res.data;
        }
      });
    };

    const getMsg = msg => {
      getNewData();
      data.formInline = {};
      data.editVisible = true;
      data.title = msg.type == "add" ? "新增" : "修改";
      data.formInline = {};
      data.formInline.id = msg.row.id;
      if (msg.type == "edit") {
        api.sensitive.getDetail({ id: msg.row.id }).then(res => {
          if (res.code == 200) {
            if (res.data.profitMargin == "-0.001") {
              data.formInline = res.data;
              data.formInline.profitMargin = "";
              data.formInline.retailPrice = Number(res.data.retailPrice).toFixed(2);
            } else {
              data.formInline = res.data;
              data.formInline.retailPrice = Number(res.data.retailPrice).toFixed(2);
            }
            let id = { platformId: String(res.data.marketPlatformId), isEnglish: true, includeFullSite: true, isLimit: true };
            api.system.getSiteByPlat(id).then(param => {
              if (param.code == 200) {
                data.site = param.data;
              } else {
                vue.$message({
                  type: "warning",
                  message: param.msg,
                });
              }
            });
          } else {
            vue.$message({
              type: "warning",
              message: res.msg,
            });
          }
        });
      }
      //获取站点
      data.site = [];
      api.system.getAllSiteList().then(res => {
        if (res.code == 200) {
          data.site = res.data;
        }
      });
      // 汇率
      data.rateOptions = [];
      api.system.getExchangeList().then(res => {
        if (res.code == 200) {
          data.rateOptions = res.data;
        }
      });
    };

    //站点change
    const changeMarketSiteId = () => {
      if (!data.formInline.marketPlatformId) {
        vue.$message({
          message: "请先选择平台",
          type: "warning",
        });
        data.formInline.marketSiteId = "";
      }
    };

    // 根据平台展示站点
    const getSiteByPlat = e => {
      data.formInline.marketSiteId = "";
      if (data.formInline.marketPlatformId) {
        let msg = { platformId: String(data.formInline.marketPlatformId), isEnglish: true, includeFullSite: true, isLimit: true };
        api.system.getSiteByPlat(msg).then(res => {
          if (res.code == 200) {
            data.site = res.data;
          } else {
            vue.$message({
              type: "warning",
              message: res.msg,
            });
          }
        });
      }
    };

    const submit = () => {
      searchForm.value.validate(valid => {
        if (valid) {
          data.formInline.productSku = data.formInline.productSku ? data.formInline.productSku.trim() : "";
          data.formInline.productName = data.formInline.productName ? data.formInline.productName.trim() : "";
          data.formInline.retailPrice = data.formInline.retailPrice;
          if (data.formInline.profitMargin) {
            data.formInline.profitMargin = data.formInline.profitMargin;
          }
          data.btnFlag = true;
          if (data.formInline.productName) {
            // if (data.istrue) {
            if (data.title == "新增") {
              api.sensitive
                .submit(data.formInline)
                .then(res => {
                  if (res.code == 200) {
                    vue.$message({
                      type: "success",
                      message: res.msg,
                    });

                    getTableData();
                    closedLog();
                    data.istrue = false;
                    data.btnFlag = false;
                  } else {
                    vue.$message({
                      type: "warning",
                      message: res.msg,
                    });
                    data.btnFlag = false;
                  }
                })
                .catch(e => {
                  data.btnFlag = false;
                });
            } else {
              api.sensitive
                .update(data.formInline)
                .then(res => {
                  if (res.code == 200) {
                    vue.$message({
                      type: "success",
                      message: res.msg,
                    });
                    data.btnFlag = false;
                    getTableData();
                    closedLog();
                    data.istrue = false;
                  } else {
                    vue.$message({
                      type: "warning",
                      message: res.msg,
                    });
                    data.btnFlag = false;
                  }
                })
                .catch(e => {
                  data.btnFlag = false;
                });
            }
          } else {
            data.btnFlag = false;
          }
        }
      });
    };

    const refData = toRefs(data);

    return {
      ...refData,
      getMsg,
      submit,
      searchForm,
      getTableData,
      checkSku1,
      getSiteByPlat,
      changeMarketSiteId,
      checkPrice,
      closedLog,
      getNewData,
    };
  },
};
</script>
<style scoped lang="scss">
.form-width {
  width: 300px;
}
</style>
