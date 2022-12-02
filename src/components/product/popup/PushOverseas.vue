<!-- 推送海外仓服务商 -->
<template>
  <div id="pushOverseas">
    <el-dialog title="产品同步到海外仓" width="40%" v-model="pushOverseasFlag" :close-on-click-modal="false" @close="closed" destroy-on-close>
      <div class="flex">
        <div class="tag_box">
          <span v-for="(item, index) of ruleForm.productSkuList" :key="item" class="elTag">
            <el-tag size="mini" v-show="index <= 3" @close="handleClose(item)" closable>{{ item }}</el-tag>
            <el-collapse-transition>
              <span v-show="textShow">
                <el-tag size="mini" v-show="index > 3" @close="handleClose(item)" closable>{{ item }}</el-tag>
              </span>
            </el-collapse-transition>
          </span>
        </div>
        <el-button type="text" size="mini" class="openText" v-if="ruleForm.productSkuList.length > 4"
          @click="textShow = !textShow">
          {{ textShow ? "合并" : "展开" }}
          <i class="el-icon--right" :class="textShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </el-button>
      </div>

      <el-form size="mini" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" ref="virtualForm">
        <div class="form_box">
          <div class="form_item_div">
            <el-form-item label="海外仓服务商:" prop="overseasFacilitatorId">
              <el-select v-model="ruleForm.overseasFacilitatorId" filterable placeholder="请选择" clearable>
                <el-option v-for="item in pushOverseasList" :key="item.id" :label="item.overseasFacilitatorCn"
                  :value="item.id"></el-option>
              </el-select>
              <el-button size="mini" type="text" style="margin-left: 10px" @click="onAdd">新 增</el-button>
            </el-form-item>
            <el-form-item label="品类:" prop="categoryId" v-if="ruleForm.overseasFacilitatorId != '1419533222221325571'">
              <el-select v-model="ruleForm.categoryId" filterable placeholder="请选择" clearable>
                <el-option v-for="item in categoryList" :key="item.categoryId" :label="item.categoryName"
                  :value="item.categoryId"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="仓库:" prop="warehouse">
              <el-select v-model="ruleForm.warehouse" filterable placeholder="请选择" clearable>
                <el-option v-for="item in warehouseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="是否提交审核:" prop="examine">
              <el-radio-group v-model="ruleForm.examine">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="mini" type="primary" @click="onSubmit" :loading="btnFlag" :disabled="btnFlag">推送</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from "vue";
export default {
  name: "PushOverseas",

  setup(prop, ctx) {
    const data = reactive({
      pushOverseasFlag: false,
      // 按钮loading
      btnFlag: false,
      //
      textShow: false,
      // 海外仓服务商列表
      pushOverseasList: [],
      // 品类列表
      categoryList: [],
      // 仓库
      warehouseList: [],
      // 表单值
      ruleForm: {
        productSkuList: [],
        overseasFacilitatorId: "",
        categoryId: "",
        // warehouse: "",
        examine: 1,
      },
      rules: {
        examine: [{ required: true, trigger: "change", message: "请选择" }],
        overseasFacilitatorId: [{ required: true, trigger: "change", message: "请选择" }],
        categoryId: [{ required: true, trigger: "change", message: "请选择" }],
        // warehouse: [{ required: true, trigger: "change", message: "请选择" }],
      },
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => { });
    onMounted(() => { });
    const refData = toRefs(data);
    const virtualForm = ref(null);

    // 获取信息
    const getMsg = obj => {
      data.pushOverseasFlag = true;
      data.ruleForm.productSkuList = obj.productSkuList;
      data.ruleForm.ids=obj.ids;
      api.product.getOverSearCangInfo().then(res => {
        if (res.code == 200) {
          data.pushOverseasList = res.data;
        }
      });

      // 仓库
      api.system.getWareHouseList().then(res => {
        if (res.code == 200) {
          data.warehouseList = res.data;
        }
      });

      // 获取谷仓的产品类别
      api.product.getGoodCangCategory().then(res => {
        if (res.code == 200) {
          data.categoryList = res.data;
        }
      });
    };

    // 关闭弹框
    const closed = () => {
      data.pushOverseasFlag = false;
      if (virtualForm.value) {
        virtualForm.value.clearValidate();
        virtualForm.value.resetFields();
      }
    };

    // 删除sku
    const handleClose = tag => {
      if (data.ruleForm.productSkuList.length > 1) {
        data.ruleForm.productSkuList.splice(data.ruleForm.productSkuList.indexOf(tag), 1);
      } else {
        vue.$message({
          type: "warning",
          message: "至少保留一条信息",
        });
      }
    };

    // 新增海外服务商
    const onAdd = () => {
      vue.$message({
        type: "warning",
        message: "功能暂未开放,敬请期待！",
      });
    };

    // 提交 onSubmit
    const onSubmit = () => {
      virtualForm.value.validate(valid => {
        if (valid) {
          data.btnFlag = true;
          if (data.ruleForm.overseasFacilitatorId == '1419533222221325571') {
            api.product.manualControlPush4px(data.ruleForm).then(res => {
              if (res.code == 200) {
                vue.$message({
                  type: "success",
                  message: res.msg,
                });
                closed();
                data.btnFlag = false;
              } else {
                vue.$message({
                  type: "warning",
                  message: res.msg,
                });
                data.btnFlag = false;
              }
            }).catch(err => {
              data.btnFlag = false;
            });
          } else {
            api.product.manualPush(data.ruleForm).then(res => {
              if (res.code == 200) {
                vue.$message({
                  type: "success",
                  message: res.msg,
                });
                closed();
                data.btnFlag = false;
              } else {
                vue.$message({
                  type: "warning",
                  message: res.msg,
                });
                data.btnFlag = false;
              }
            })
              .catch(err => {
                data.btnFlag = false;
              });
          }
        }

      });
    };

    return {
      ...refData,
      closed,
      onSubmit,
      virtualForm,
      getMsg,
      onAdd,
      handleClose,
    };
  },
};
</script>
<style scoped lang="scss">
#pushOverseas {
  .tag_box {
    width: 90%;
    display: flex;
    flex-wrap: wrap;
    transition: 0.3s all linear;

    .elTag {
      margin-bottom: 10px;
      display: inline-block;
      margin-right: 20px;
    }
  }
}
</style>
