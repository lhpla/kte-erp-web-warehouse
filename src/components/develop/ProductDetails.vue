<!-- 选品详情 -->
<template>
  <div>
    <el-dialog
      title="查看选品"
      v-model="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form size="mini" label-width="120px" class="demo-ruleForm">
        <div class="flex-box">
          <el-form-item label="选品名称:">
            <el-tooltip
              effect="dark"
              :disabled="msgList.productCname == ''"
              :content="msgList.productCname"
              placement="bottom"
            >
              <span>{{
                msgList.productCname ? msgList.productCname : "-"
              }}</span>
            </el-tooltip>
          </el-form-item>
        </div>

        <el-form-item label="选品图片:">
          <span v-if="msgList.pricturePath">
            <el-popover placement="right" trigger="hover" width="250">
              <template #reference>
                <el-image
                  style="width: 180px; height: 95px"
                  fit="contain"
                  :src="msgList.pricturePath"
                ></el-image>
              </template>
              <el-image
                :src="msgList.pricturePath"
                style="width: 400px; height: 300px"
                fit="contain"
              ></el-image>
            </el-popover>
          </span>
          <span v-else>-</span>
        </el-form-item>

        <el-form-item label="选品分类:">
          <el-tooltip
            effect="dark"
            :disabled="msgList.parameter == ''"
            :content="msgList.parameter"
            placement="bottom"
          >
            <span>{{
              msgList.productClassification
                ? msgList.productClassification
                : "-"
            }}</span>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="选品来源:">
          {{ msgList.source ? msgList.source : "-" }}
        </el-form-item>
        <el-form-item label="选品平台:">
          {{ msgList.platform ? msgList.platform : "-" }}
        </el-form-item>
        <el-form-item label="选品站点:">
          {{ msgList.site ? msgList.site : "-" }}
        </el-form-item>
        <el-form-item label="竞品链接:">
          <el-link
            :underline="false"
            :href="msgList.referenceLinking"
            target="_blank"
          >
            {{ msgList.referenceLinking ? msgList.referenceLinking : "-" }}
          </el-link>
          <i
            v-if="msgList.referenceLinking"
            class="el-icon-document-copy nameHover"
            @click="copyText(msgList.referenceLinking)"
          ></i>
        </el-form-item>
        <el-form-item
            label="竞品参数列表:"
            prop="parameterList"
            label-width="145px"
            style="width: 100%; display: flex"
          >
            <div>{{ msgList.parameterList ? msgList.parameterList : "-" }}</div>
        </el-form-item>
        <span style="display: flex">
          <el-form-item label="产品最低售价:">
            {{
              msgList.referencePrice !== -1
                ? Number(msgList.referencePrice).toFixed(2)
                : "-"
            }}
          </el-form-item>
          <el-form-item prop="currency">
            {{ msgList.priceUnit ? msgList.priceUnit : "-" }}
          </el-form-item>
        </span>

        <span style="display: flex">
          <el-form-item label="建议售价:">
            {{
              msgList.referencePrice !== -1
                ? (Number(msgList.referencePrice) * 0.95).toFixed(2)
                : "-"
            }}
          </el-form-item>
          <el-form-item prop="currency">
            {{ msgList.priceUnit ? msgList.priceUnit : "-" }}
          </el-form-item>
        </span>

        <el-form-item label="采购参考链接:">
          <el-link
            :underline="false"
            :href="msgList.supplierLinks"
            target="_blank"
          >
            {{ msgList.supplierLinks ? msgList.supplierLinks : "-" }}
          </el-link>
          <i
            v-if="msgList.supplierLinks"
            class="el-icon-document-copy nameHover"
            @click="copyText(msgList.referenceLinking)"
          ></i>
        </el-form-item>

        <el-form-item label="采购专员:">
          {{ msgList.purchaseUserName ? msgList.purchaseUserName : "-" }}
        </el-form-item>
        <el-form-item label="备注:">
          {{ msgList.remark ? msgList.remark : "-" }}
        </el-form-item>
      </el-form>
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
  onUnmounted,
} from "vue";
import { documentCopy, localSet } from "@/utils/util";
export default {
  name: "ProductDetails",
  setup(prop, ctx) {
    const data = reactive({
      msgList: {},
      dialogVisible: false,
      timerOut: null,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onUnmounted(() => {
      // 页面销毁  关闭预览图片的计时器
      clearTimeout(data.timerOut);
    });
    onMounted(() => {});
    const refData = toRefs(data);
    // 获取信息
    const getMsg = (info) => {
      data.msgList = info;
      data.dialogVisible = true;
    };

    //获取最新下拉数据
    const getNewData = () => {
      //选品来源-->开发流程所有字典
      api.develop.getDevProcessList().then((res) => {
        if (res.code == 200) {
          localSet("dictCodeList", res.data);
        }
      });
      //选品平台
      api.systemNew.getPlatformAll().then((res) => {
        if (res.code == 200) {
          localSet("platformLiist", res.data);
        }
      });
      //采购专员
      api.userOperation.getHeadOfPurchasing().then((res) => {
        if (res.code == 200) {
          data.buyerList = res.data;
        }
      });
    };

    // 取消
    const handleClose = (done) => {
      vue
        .$confirm("确认关闭？")
        .then((_) => {
          data.dialogVisible = false;
        })
        .catch((_) => {});
    };

    // 复制链接
    const copyText = (text) => {
      documentCopy(text);
    };

    return {
      ...refData,
      handleClose,
      getMsg,
      copyText,
    };
  },
};
</script>
<style lang="scss" scoped>
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
  width: 400px;
  display: block;
}

.flex-box {
  display: flex;
  width: 100%;
}
</style>
