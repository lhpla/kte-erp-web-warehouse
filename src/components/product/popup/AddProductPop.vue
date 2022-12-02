<!--新增产品弹窗 -->
<template>
  <div>
    <!-- 新增或编辑产品 -->
    <el-dialog
      v-model="productVisible"
      width="1350px"
      :close-on-click-modal="false"
      :before-close="handleClose"
      destroy-on-close
    >
      <template #title>
        <div class="dialog-title">
          <span>{{ isProduct == "add" ? "添加产品" : isProduct == "isFitting" ? "新增配件" : isProduct == "isSecondHand" ? "新增二手" : "复制产品" }}</span>
        </div>
      </template>

      <!-- 日志dialog -->
      <LogDialog ref="LogDialog"></LogDialog>
      <el-tabs tab-position="left" style="height: 720px" v-model="activeName">
        <!-- 基础信息 -->
        <el-tab-pane label="基础信息" name="1" class="tab-pane">
          <BasicInformation ref="BasicInformation" @funPromise="funPromise"></BasicInformation>
        </el-tab-pane>
        <!-- 采购信息 -->
        <el-tab-pane label="采购信息" name="2" class="tab-pane" @scroll="scroll">
          <PurchasingInformation ref="PurchasingInformation" @funPromise="funPromise" :isAddProduct="isProduct"></PurchasingInformation>
        </el-tab-pane>
        <!-- 申报信息 -->
        <el-tab-pane label="申报信息" name="3" class="tab-pane">
          <ApplicationInformation ref="ApplicationInformation" @funPromise="funPromise"></ApplicationInformation>
        </el-tab-pane>
        <el-tab-pane label="销售信息" name="4" class="tab-pane">
          <SalesInformation ref="SalesInformation" @funPromise="funPromise"></SalesInformation>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="handleClose"
            :disabled="submitActive"
            :loading="submitActive"
            size="mini"
          >取 消</el-button>
          <el-button
            type="primary"
            v-if="isProduct !== 'isFitting'"
            @click="addProduct('draft')"
            :disabled="submitActive"
            :loading="submitActive"
            size="mini"
            plain
          >暂存草稿</el-button>
          <el-button
            type="primary"
            @click="addProduct('add')"
            :disabled="submitActive"
            :loading="submitActive"
            size="mini"
          >一键提交</el-button>
        </span>
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
  getCurrentInstance,
  nextTick,
  provide,
  inject,
} from "vue";
import BasicInformation from "@/components/product/popup/BasicInformation.vue";
import PurchasingInformation from "@/components/product/popup/PurchasingInformation.vue";
import ApplicationInformation from "@/components/product/popup/ApplicationInformation.vue";
import SalesInformation from "@/components/product/popup/SalesInformation.vue";
export default {
  name: "AddProductPop",
  components: {
    BasicInformation,
    PurchasingInformation,
    ApplicationInformation,
    SalesInformation,
  },
  setup(prop, ctx) {
    const data = reactive({
      productVisible: false,
      activeName: "1",
      // 新增或删除
      isProduct: "add",
      productFromData: {},
      submitActive: false,
      proBasicInfoDto: {},
      proPurchaseDto: {},
      proDeclareInfo: {},
      productData: {},
      virtualDeclVo: {},
      proMarketInfoList: {},
      proStatus: "1", // 0--草稿  1--新增
      promiseList: [],
      productCname: "",
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const refData = toRefs(data);
    provide("proBasicInfoDto", data.proBasicInfoDto);
    provide("proPurchaseDto", data.proPurchaseDto);
    provide("proDeclareInfo", data.proDeclareInfo);
    provide("virtualDeclVo", data.virtualDeclVo);
    provide("proMarketInfoList", data.proMarketInfoList);
    // 新增
    const getMsg = (info) => {
      data.productVisible = true;
      data.activeName = "1";
      data.isProduct = info.text;
      nextTick(() => {
        vue.$refs.BasicInformation.getMsg();
        vue.$refs.PurchasingInformation.getMsg();
        vue.$refs.ApplicationInformation.getMsg();
        vue.$refs.SalesInformation.getMsg();
      });
    };

    //监听滚动
    const scroll = (e) => {
      nextTick(() => {
        vue.$refs.PurchasingInformation.attributeBlur();
      });
    };

    // 复制    1--复制产品   2--新增配件  3--新增二手
    const getCopyMsg = (type, info) => {
      console.log(info, "------");
      if (type == 1) {
        data.isProduct = "copy";
        data.productVisible = true;
        data.activeName = "1";
        api.productLibrary
          .copyProductInfo({
            proId: info.proId,
            isFitting: 0,
            isSecondHand: false,
          })
          .then((res) => {
            console.log(res, "9527111");
            sessionStorage.setItem("pst", res.data.proBasicInfoDto.pasteSku);
            if (res.code == 200) {
              data.productFromData = res.data;
              console.log(res.data,"res");
              data.productCname = res.data.proBasicInfoDto.productCname;
              data.productFromData.proBasicInfoDto.productAttribute = 0;
              if (res.data.proBasicInfoDto.productClassificationId == -1) {
                data.productFromData.proBasicInfoDto.productClassificationId =
                  "";
              }
              data.virtualDeclVo.value = res.data.virtualDeclVo;
              vue.$refs.BasicInformation.getMsg(
                data.productFromData.proBasicInfoDto,
                true
              );
              vue.$refs.PurchasingInformation.getMsg(
                data.productFromData.proPurchaseDto,
                data.productCname
              );
              console.log(data.productFromData.declareVo,"declareVo");
              vue.$refs.ApplicationInformation.getMsg(
                data.productFromData.declareVo
              );
              vue.$refs.SalesInformation.getMsg(
                data.productFromData.proMarketInfoList
              );
            }
          })
          .catch((err) => {
            data.productVisible = false;
            vue.$message.warning("请求超时，请联系技术人员");
          });
      } else if (type == 2) {
        data.isProduct = "isFitting";
        data.productVisible = true;
        data.activeName = "1";
        api.productLibrary
          //需要修改
          .copyProductInfo({
            proId: info.proId,
            isFitting: 1,
            isSecondHand: false,
          })
          .then((res) => {
            if (res.code == 200) {
              sessionStorage.setItem("pst", res.data.proBasicInfoDto.pasteSku);
              data.productFromData = res.data;
              data.productCname = res.data.proBasicInfoDto.productCname;
              data.productFromData.proBasicInfoDto.productAttribute = 0;
              data.virtualDeclVo.value = res.data.virtualDeclVo;
              vue.$refs.BasicInformation.getMsg(
                data.productFromData.proBasicInfoDto,
                true
              );
              vue.$refs.PurchasingInformation.getMsg(
                data.productFromData.proPurchaseDto,
                data.productCname
              );
              vue.$refs.ApplicationInformation.getMsg(
                data.productFromData.declareVo
              );
              vue.$refs.SalesInformation.getMsg(
                data.productFromData.proMarketInfoList
              );
            }
          })
          .catch((err) => {
            data.productVisible = false;
            vue.$message.warning("请求超时，请联系技术人员");
          });
      } else if (type == 3) {
        data.isProduct = "isSecondHand";
        data.productVisible = true;
        data.activeName = "1";
        api.productLibrary
          .copyProductInfo({
            proId: info.proId,
            isFitting: 0,
            isSecondHand: true,
          })
          .then((res) => {
            if (res.code == 200) {
              sessionStorage.setItem("pst", res.data.proBasicInfoDto.pasteSku);
              data.productFromData = res.data;
              data.productCname = res.data.proBasicInfoDto.productCname;
              data.productFromData.proBasicInfoDto.productAttribute = 0;
              data.virtualDeclVo.value = res.data.virtualDeclVo;
              vue.$refs.BasicInformation.getMsg(
                data.productFromData.proBasicInfoDto,
                true
              );
              vue.$refs.PurchasingInformation.getMsg(
                data.productFromData.proPurchaseDto,
                data.productCname
              );
              vue.$refs.ApplicationInformation.getMsg(
                data.productFromData.proDeclareInfo
              );
              vue.$refs.SalesInformation.getMsg(
                data.productFromData.proMarketInfoList
              );
            }
          })
          .catch((err) => {
            data.productVisible = false;
            vue.$message.warning("请求超时，请联系技术人员");
          });
      }
    };

    // 接收子组件的结果
    const funPromise = (value) => {
      data.promiseList.push(value);
    };
    // 新增或编辑
    const addProduct = (proStatus) => {
      data.submitActive = true;
      // 暂存草稿
      if (proStatus == "draft") {
        data.proStatus = "0";
        data.productFromData.proStatus = "0";
      } else {
        data.proStatus = "1";
        data.productFromData.proStatus = "1";
      }
      vue.$refs.BasicInformation.getProStatus(data.proStatus);
      vue.$refs.PurchasingInformation.getProStatus(data.proStatus);
      vue.$refs.ApplicationInformation.getProStatus(data.proStatus);
      data.promiseList = [];
      vue.$refs.BasicInformation.submit();
      vue.$refs.PurchasingInformation.submit();
      vue.$refs.ApplicationInformation.submit();
      vue.$refs.SalesInformation.submit();
      setTimeout(() => {
        if (
          data.promiseList.every((item) => {
            return item == true;
          })
        ) {
          nextTick(() => {
            data.productFromData.proBasicInfoDto = data.proBasicInfoDto.value;
            //排除复制产品 不对季节性属性进行编辑的情况下
            if (
              Array.isArray(
                data.productFromData.proBasicInfoDto.seasonalAttribute
              )
            ) {
              data.productFromData.proBasicInfoDto.seasonalAttribute =
                data.productFromData.proBasicInfoDto.seasonalAttribute.length >
                0
                  ? data.productFromData.proBasicInfoDto.seasonalAttribute.join(
                      ","
                    )
                  : "";
            }
            data.productFromData.proPurchaseDto = data.proPurchaseDto.value;
            data.productFromData.proDeclareInfo = data.proDeclareInfo.value;
            data.productFromData.virtualDeclVo = data.virtualDeclVo.value
              ? data.virtualDeclVo.value
              : {};
            data.productFromData.proMarketInfoList = data.proMarketInfoList
              .value
              ? data.proMarketInfoList.value
              : [];
            // console.log(data.productFromData.proMarketInfoList);
            // 预防老数据问题进行处理
            if (data.productFromData.proMarketInfoList.length > 0) {
              data.productFromData.proMarketInfoList.map((ite) => {
                if (Array.isArray(ite.affiliateSalesManager)) {
                  ite.affiliateSalesManager =
                    ite.affiliateSalesManager.join(",");
                }
              });
            }
            // console.log(data.productFromData.proMarketInfoList);

            if (
              data.isProduct == "add" ||
              data.isProduct == "copy" ||
              data.isProduct == "isFitting" ||
              data.isProduct == "isSecondHand"
            ) {
              if (data.isProduct == "add") {
                data.productFromData.isCopy = false;
                data.productFromData.isSecondHand = false;
              }
              if (data.isProduct == "copy" || data.isProduct == "isFitting") {
                data.productFromData.isCopy = true;
                data.productFromData.isSecondHand = false;
              }
              if (data.isProduct == "isSecondHand") {
                data.productFromData.isCopy = true;
                data.productFromData.isSecondHand = true;
              }
              data.productFromData.isDevelop = false;
              const value = sessionStorage.getItem("pst") || null;
              data.productFromData.proBasicInfoDto.pasteSku = value;
              if (
                data.productFromData.proBasicInfoDto.productClassificationId ==
                "-1"
              ) {
                data.submitActive = false;
                return vue.$message.error("请检查产品分类是否选择!");
              }
              api.product
                .addProductInfo(data.productFromData)
                .then((res) => {
                  data.submitActive = false;
                  vue.$message.success(
                    `${
                      data.isProduct == "add"
                        ? "新增"
                        : data.isProduct == "isFitting"
                        ? "新增配件"
                        : data.isProduct == "isSecondHand"
                        ? "新增二手"
                        : "复制"
                    }产品成功！`
                  );
                  sessionStorage.setItem("pst", null);
                  getTableData();
                  data.productVisible = false;
                  vue.$refs.BasicInformation.closed();
                  vue.$refs.PurchasingInformation.closed();
                  vue.$refs.ApplicationInformation.closed();
                  vue.$refs.SalesInformation.closed();
                  data.promiseList = [];
                })
                .catch((error) => {
                  data.submitActive = false;
                  data.promiseList = [];
                });
            }
          });
        } else {
          data.submitActive = false;
          vue.$message.warning("请完善信息！");
          data.promiseList = [];
        }
      }, 1000);
    };
    const getTableData = inject("getTableData");

    const handleClose = (done) => {
      data.productVisible = false;
      vue.$refs.BasicInformation.closed();
      vue.$refs.PurchasingInformation.closed();
      vue.$refs.ApplicationInformation.closed();
      vue.$refs.SalesInformation.closed();
    };
    return {
      ...refData,
      getMsg,
      addProduct,
      getTableData,
      handleClose,
      getCopyMsg,
      funPromise,
      scroll,
    };
  },
};
</script>
<style scoped lang="scss">
.dialog-title {
  display: flex;
  justify-content: space-between;
  padding: 0 50px 0 0;
  align-items: center;
  span {
    font-size: 18px;
  }
}

.tab-pane {
  height: 720px;
  overflow: scroll;
  /* 兼容火狐滚动条隐藏 */
  scrollbar-width: none;
  padding: 0 20px 0 0;
}
</style>
