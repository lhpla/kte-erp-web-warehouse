<!-- 采购初录基础信息展示 -->
<template>
  <div>
    <div class="sixForm">
      <el-form size="mini" :inline="true" label-width="130px" class="demo-ruleForm">
        <!-- <el-form-item label="供应商:"> -->
        <!-- <div>{{ basicInfoObj.msgList.supplier }}</div> -->
        <!-- </el-form-item> -->
        <div style="display: flex; width: 100%">
          <el-form-item label="选品名称:">
            <div class="dis-item">
              <div>{{ basicInfoObj.msgList.productCname ? basicInfoObj.msgList.productCname : "-" }}</div>
              <!-- 暂时注释规格型号字段 -->
              <!-- <div>{{ basicInfoObj.msgList.parameter ? basicInfoObj.msgList.parameter : "-" }}</div> -->
            </div>
          </el-form-item>
        </div>
        <el-form-item label="选品图片:">
          <span v-if="basicInfoObj.msgList.pricturePath">
            <el-popover placement="right" trigger="hover" width="250">
              <template #reference>
                <el-image style="width: 180px; height: 95px" fit="contain" :src="basicInfoObj.msgList.pricturePath"></el-image>
              </template>
              <el-image :src="basicInfoObj.msgList.pricturePath" style="width: 400px; height: 300px" fit="contain"></el-image>
            </el-popover>
          </span>
          <span v-else>-</span>
        </el-form-item>
        <!-- <div>
          <el-form-item label="选品英文名称:">
            <div>{{ basicInfoObj.msgList.productEname }}</div>
          </el-form-item>
        </div> -->
        <div>
          <el-form-item label="选品分类:">
            <span v-if="basicInfoObj.msgList.productClassification">
              {{ basicInfoObj.msgList.productClassification ? basicInfoObj.msgList.productClassification : "-" }}
            </span>
          </el-form-item>
        </div>
        <!-- <div>
          <el-form-item label="运营方式:">
            <div>{{ tableTypeComputed(basicInfoObj.operatingOptions, basicInfoObj.msgList.operateType) }}</div>
          </el-form-item>
        </div> -->
        <div>
          <el-form-item label="选品来源:">
            <div>{{ basicInfoObj.msgList.sourceId ? tableTypeComputed(basicInfoObj.sourceOptions, basicInfoObj.msgList.sourceId) : "-" }}</div>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="选品平台:">
            <div v-if="basicInfoObj.msgList.platform">{{ basicInfoObj.msgList.platform ? basicInfoObj.msgList.platform : "-" }}</div>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="选品站点:">
            <div v-if="basicInfoObj.msgList.site">{{ basicInfoObj.msgList.site ? basicInfoObj.msgList.site : "-" }}</div>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="采购参考链接:" style="width: 100%">
            <div style="display: flex">
              <el-link :underline="false" class="urlWidth" :href="basicInfoObj.msgList.supplierLinks" target="_blank" style="white-space: nowrap">
              <span style="white-space:normal">
                {{ basicInfoObj.msgList.supplierLinks ? basicInfoObj.msgList.supplierLinks : "-" }}
              </span>
              </el-link>
              <i v-if="basicInfoObj.msgList.supplierLinks" class="el-icon-document-copy nameHover" @click="copyText(basicInfoObj.msgList.supplierLinks)"></i>
            </div>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="竞品链接:" style="width: 100%">
            <div style="display: flex">
              <el-link :underline="false" class="urlWidth" :href="basicInfoObj.msgList.referenceLinking" target="_blank" style="white-space: nowrap">
              <span style="white-space:normal">
                {{ basicInfoObj.msgList.referenceLinking ? basicInfoObj.msgList.referenceLinking : "-" }}
              </span>
              </el-link>
              <i v-if="basicInfoObj.msgList.referenceLinking" class="el-icon-document-copy nameHover" @click="copyText(basicInfoObj.msgList.referenceLinking)"></i>
            </div>
          </el-form-item>
        </div>
        <div>
          <el-form-item
            label="竞品参数列表:"
            prop="parameterList"
            label-width="145px"
            style="width: 100%; display: flex"
          >
            <div style="width: 1000px">{{basicInfoObj.msgList.parameterList ?basicInfoObj.msgList.parameterList : "-" }}</div>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="产品最低售价:">
            <div class="dis-item">
              <div>{{ Number(basicInfoObj.msgList.referencePrice).toFixed(2) }}</div>
              <div>{{ basicInfoObj.msgList.priceUnit ? basicInfoObj.msgList.priceUnit : "-" }}</div>
            </div>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="产品建议售价:">
            <div class="dis-item">
              <div>{{ basicInfoObj.msgList.suggestPrice ? Number(basicInfoObj.msgList.suggestPrice).toFixed(2) : "-" }}</div>
              <div>{{ basicInfoObj.msgList.priceUnit ? basicInfoObj.msgList.priceUnit : "-" }}</div>
            </div>
          </el-form-item>
        </div>
        <!-- <div>
          <el-form-item label="海外版权:">
            <div>{{ basicInfoObj.msgList.overseasCopyright ? basicInfoObj.msgList.overseasCopyright : "-" }}</div>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="是否涉及敏感词:">
            <div>{{ basicInfoObj.msgList.isSensitiveWords == 0 ? "否" : "是" }}</div>
          </el-form-item>
        </div> -->
        <div>
          <el-form-item label="备注:" label-width="120px" style="width: 100%; display: flex">
            <div style="width: 1000px">{{ basicInfoObj.msgList.remark ? basicInfoObj.msgList.remark : "-" }}</div>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, computed, onUnmounted, nextTick } from "vue";
import { documentCopy } from "../../../utils/util";
export default {
  name: "BasicInfo",
  props: {
    // 父组件传值过来 不在本组件中进行获取数据
    basicInfoObj: {
      type: Object,
    },
  },
  setup(prop, ctx) {
    const data = reactive({
      msgList: {},
      operatingOptions: [],
      sourceOptions: [],
      timerOut: null,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    onBeforeMount(() => {});
    onUnmounted(() => {});
    onMounted(() => {});

    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (option, dizKey) {
        if (option.length > 1 && dizKey !== -1) {
          for (let item of option) {
            if (dizKey == item.dizKey) {
              return item.value;
            }
          }
        }
      };
    });



    // 复制链接
    const copyText = text => {
      documentCopy(text);
    };

    const refData = toRefs(data);
    return {
      ...refData,
      tableTypeComputed,
      copyText,
    };
  },
};
</script>
<style scoped lang="scss">
.sixForm {
  .dis-item {
    display: flex;
    div {
      margin-left: 15px;
    }
  }
  .el-form-item {
    width: 45%;
  }
}
</style>
