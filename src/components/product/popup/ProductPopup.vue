<!--修改产品弹窗 -->
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
          <span>{{
            isProduct == "add"
              ? "添加产品"
              : isProduct == "edit"
              ? "编辑产品"
              : "复制产品"
          }}</span>
          <!-- <div>
            <el-button
              type="primary"
              size="mini"
              @click="copyProduct(productData.isFitting == '1' ? 2 : 1)"
              plain
              v-if="isProduct == 'edit'"
              >复制</el-button
            >
            <el-button
              type="primary"
              size="mini"
              @click="copyProduct(2)"
              plain
              v-if="
                isProduct == 'edit' &&
                productData.sku &&
                productData.isFitting !== '1'
              "
            >
              新增配件
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="copyProduct(3)"
              plain
              v-if="
                isProduct == 'edit' &&
                productData.sku &&
                // productData.isSecondHand !== '10'
                productData.isFitting !== '1'
              "
            >
              新增二手
            </el-button>
          </div> -->
        </div>
      </template>

      <el-tabs
        tab-position="left"
        style="height: 720px"
        v-model="activeName"
        @tab-click="handleClick"
      >
        <!-- 基础信息 -->
        <el-tab-pane label="基础信息" name="1" class="tab-pane">
          <BasicInformation ref="BasicInformation"></BasicInformation>
        </el-tab-pane>
        <!-- 采购信息 -->
        <el-tab-pane
          label="采购信息"
          name="2"
          class="tab-pane"
          @scroll="scroll"
        >
          <PurchasingInformation
            ref="PurchasingInformation"
          ></PurchasingInformation>
        </el-tab-pane>
        <!-- 申报信息 -->
        <el-tab-pane label="申报信息" name="3" class="tab-pane">
          <ApplicationInformation
            ref="ApplicationInformation"
          ></ApplicationInformation>
        </el-tab-pane>
        <el-tab-pane label="销售信息" name="4" class="tab-pane">
          <SalesInformation ref="SalesInformation"></SalesInformation>
        </el-tab-pane>
        <el-tab-pane
          v-if="buttonAuthor.AlternativeSupplier"
          label="备选供应商"
          name="5"
          class="tab-pane"
        >
          <AlternativeSupplier ref="AlternativeSupplier"></AlternativeSupplier>
        </el-tab-pane>
        <el-tab-pane label="库存信息" name="6" class="tab-pane">
          <InventoryInformation
            ref="InventoryInformation"
          ></InventoryInformation>
        </el-tab-pane>
        <el-tab-pane label="日志" name="7" class="tab-pane">
          <ProdctLogDialog ref="ProdctLogDialog"></ProdctLogDialog>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog v-model="secondHandDialogVisible" title="提示" width="25%" destroy-on-close>
      <div style="margin-bottom: 30px; font-size: 14px">
        <i
          class="el-icon-warning"
          style="margin-right: 5px; font-size: 16px"
        ></i
        >确认新增二手？
      </div>
      <span style="margin-right: 5px; font-size: 14px">销售平台 :</span>
      <el-select
        v-model="platformId"
        class="m-2"
        placeholder="选择对应平台"
        size="small"
      >
        <el-option
          v-for="item in platformOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <AddProductPop ref="AddProductPop"></AddProductPop>
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
} from "vue";
import BasicInformation from "@/components/product/popup/BasicInformation.vue";
import PurchasingInformation from "@/components/product/popup/PurchasingInformation.vue";
import ApplicationInformation from "@/components/product/popup/ApplicationInformation.vue";
import SalesInformation from "@/components/product/popup/SalesInformation.vue";
import AlternativeSupplier from "@/components/product/popup/AlternativeSupplier.vue";
import ProdctLogDialog from "@/components/product/popup/ProdctLogDialog.vue";
import AddProductPop from "./AddProductPop.vue";
import authorButtons from "@/compositionApi/authorButtons";
import InventoryInformation from "./InventoryInformation.vue";
import {useRoute} from "vue-router";

export default {
  name: "ProductPopup",
  components: {
    BasicInformation,
    PurchasingInformation,
    ApplicationInformation,
    SalesInformation,
    AlternativeSupplier,
    AddProductPop,
    InventoryInformation,
    ProdctLogDialog,
  },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const route = useRoute();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      // isEdit:false,
      platformId: "",
      platformOptions: [],
      secondHandDialogVisible: false,
      productVisible: false,
      activeName: "1",
      // 新增或删除
      isProduct: "add",
      // proStatus: "3", //编辑
      productFromData: {},
      submitActive: false,
      proBasicInfoDto: {},
      proPurchaseDto: {},
      proDeclareInfo: {},
      productData: {},
      virtualDeclVo: {},
      proMarketInfoList: {},
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
    const getMsg = (info) => {
      //获取对应平台列表
      api.system.getAllPlatform().then((res) => {
        if (res.code == 200) {
          data.platformOptions = res.data;
        }
      });
      data.productVisible = true;
      data.isProduct = info.text;
      // data.isEdit = info.isEdit;
      data.activeName = "1";
      if (info.row) {
        let obj = {
          proId: info.row.id,
          sku: info.row.productSku,
          isFitting: info.row.isFitting,
          // isSecondHand:info.row.devStatus,
          // mainSku:info.row.mainSku
          isEdit: info.isEdit,
          devStatus:info.row.devStatus,
        };
        data.productData = obj;

        if (info.view) {
          data.activeName = "6";
          nextTick(() => {
            vue.$refs.InventoryInformation.getMsg(data.productData);
            vue.$refs.BasicInformation.isFirstGetDetail = false;
          });
        } else {
          nextTick(() => {
            vue.$refs.BasicInformation.getApiMsg(data.productData);
            vue.$refs.BasicInformation.isFirstGetDetail = true;
          });
        }
      }
    };

    //监听滚动
    const scroll = (e) => {
      nextTick(() => {
        vue.$refs.PurchasingInformation.attributeBlur();
      });
    };

    // 切换tab
    const handleClick = (tab, event) => {
      //切换tab时 关闭离开组件的 tooltip 组件的显示
      if (data.activeName != "1") {
        vue.$refs.BasicInformation.handleScroll();
      }
      if (data.activeName != "2") {
        vue.$refs.PurchasingInformation.handleScroll();
      }

      if (data.activeName == "1") {
        nextTick(() => {
          if (!vue.$refs.BasicInformation.isFirstGetDetail) {
            vue.$refs.BasicInformation.isFirstGetDetail = true;
            vue.$refs.BasicInformation.getApiMsg(data.productData);
          }
        });
      } else if (data.activeName == "2") {
        nextTick(() => {
          if (!vue.$refs.PurchasingInformation.isFirstGetDetail) {
            vue.$refs.PurchasingInformation.getApiMsg(data.productData);
            vue.$refs.PurchasingInformation.isFirstGetDetail = true;
          }
        });
      } else if (data.activeName == "3") {
        nextTick(() => {
          if (!vue.$refs.ApplicationInformation.isFirstGetDetail) {
            vue.$refs.ApplicationInformation.getApiMsg(data.productData);
            vue.$refs.ApplicationInformation.isFirstGetDetail = true;
          }
        });
      } else if (data.activeName == "4") {
        nextTick(() => {
          if (!vue.$refs.SalesInformation.isFirstGetDetail) {
            vue.$refs.SalesInformation.getApiMsg(data.productData);
            vue.$refs.SalesInformation.isFirstGetDetail = true;
          }
        });
      } else if (data.activeName == "5") {
        nextTick(() => {
          if (!vue.$refs.AlternativeSupplier.isFirstGetDetail) {
            vue.$refs.AlternativeSupplier.getMsg(data.productData);
            vue.$refs.AlternativeSupplier.isFirstGetDetail = true;
          }
        });
      } else if (data.activeName == "6") {
        nextTick(() => {
          if (!vue.$refs.InventoryInformation.isFirstGetDetail) {
            vue.$refs.InventoryInformation.getMsg(data.productData);
            vue.$refs.InventoryInformation.isFirstGetDetail = true;
          }
        });
      } else if (data.activeName == "7") {
        nextTick(() => {
          let info = {
            proId: data.productData.proId,
            sku: data.productData.sku,
            actionModule: data.activeName,
          };
          vue.$refs.ProdctLogDialog.checkLogDialog(info);
        });
      }
    };

    // const getTableData = inject("getTableData");
    // 复制当前产品
    const copyProduct = (type) => {
      if (type == 1) {
        vue
          .$confirm("确认复制当前产品?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            data.isProduct = "copy";
            vue.$refs.AddProductPop.getCopyMsg(1, data.productData);
            data.productVisible = false;
          })
          .catch(() => {});
      } else if (type == 2) {
        vue
          .$confirm("确认新增配件?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            data.isProduct = "copy";
            vue.$refs.AddProductPop.getCopyMsg(2, data.productData);
            data.productVisible = false;
          })
          .catch(() => {});
      } else if (type == 3) {
        data.secondHandDialogVisible = true;
      }
    };

    // 查看日志
    // const handleLog = () => {
    //   let info = {
    //     proId: data.productData.proId,
    //     sku: data.productData.sku,
    //     actionModule: data.activeName,
    //   };
    //   vue.$refs.ProdctLogDialog.checkLogDialog(info);
    // };

    const handleClose = (done) => {
      if(route?.query?.sku){
        window.close()
      }
      nextTick(() => {
        vue.$refs.BasicInformation.closed();
        vue.$refs.PurchasingInformation.closed();
        vue.$refs.ApplicationInformation.closed();
        vue.$refs.BasicInformation.isFirstGetDetail = false;
        vue.$refs.PurchasingInformation.isFirstGetDetail = false;
        vue.$refs.ApplicationInformation.isFirstGetDetail = false;
        vue.$refs.SalesInformation.isFirstGetDetail = false;
        vue.$refs.AlternativeSupplier.isFirstGetDetail = false;
        vue.$refs.InventoryInformation.isFirstGetDetail = false;
      });
      data.productVisible = false;
    };

    const onSubmit = () => {
      if (data.platformId == "") {
        vue.$message({
          type: "warning",
          message: "请选择对应平台",
        });
        return;
      }
      api.system
        .addSecondSku({
          proId: data.productData.proId,
          platformId: data.platformId,
        })
        .then((res) => {
          if (res.code == 200) {
            vue.$message({
              type: "success",
              message: res.msg,
            });
            data.platformId = "";
            data.secondHandDialogVisible = false;
          } else {
            vue.$message({
              type: "warning",
              message: res.msg,
            });
          }
        });
    };
    const onCancel = () => {
      data.platformId = "";
      data.secondHandDialogVisible = false;
    };
    return {
      ...refData,
      getMsg,
      onSubmit,
      onCancel,
      copyProduct,
      handleClose,
      handleClick,
      buttonAuthor,
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
    font-size: 16px;
  }
}

.tab-pane {
  height: 720px;
  overflow: scroll;
  /* 兼容火狐滚动条隐藏 */
  scrollbar-width: none;
  padding: 0 20px 0 0;
  overflow-x: hidden;
}
</style>
