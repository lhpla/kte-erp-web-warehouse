<!-- 合并sku -->
<template>
  <div id="MergeSku">
    <el-dialog title="合并SKU" width="65%" v-model="mergeSkuFlag" :close-on-click-modal="false" @close="closed" destroy-on-close> 
      <div style="width: 100%; text-align: right; margin-top: 10px">
        <div class="add" @click="addNum">新增</div>
      </div>
      <el-form size="mini" :model="ruleForm" :inline="true" label-width="120px" class="demo-ruleForm" ref="virtualForm">
        <div class="box_title">
          <div class="sku">SKU</div>
          <div class="name">产品名</div>
          <div class="role">角色</div>
          <div class="operation">操作</div>
        </div>
        <div class="scendSku" v-for="(item, index) in ruleForm" :key="index">
          <div class="skuData">
            <el-form-item class="form_item1" prop="sku">
              <el-input placeholder="请输入SKU" clearable v-model.trim="item.sku" @keyup.enter="searchSku(item.sku, index)"></el-input>
            </el-form-item>
          </div>
          <div class="nameData">
            <el-form-item class="form_item2" style="width: 100%" prop="name">
              <el-input clearable style="width: 100% !important" placeholder="请输入产品名称" v-model.trim="item.productCname"></el-input>
            </el-form-item>
          </div>
          <div class="roleData" v-if="index == 0">合并SKU</div>
          <div class="roleData" v-else>被合并SKU</div>
          <div class="operationData" v-if="index <= 1">编辑</div>
          <div class="operationData" v-else @click="DeleteNum(index)">删除</div>
        </div>

        <div class="remark">
          <el-form-item label="合并备注:" prop="remarks" label-width="70" style="width: 100%">
            <el-input type="textarea" :rows="3" style="width: 100%" clearable placeholder="请输入产品名称" v-model.trim="remarks"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <span class="tost">输入sku后单击enter建进行搜索，点击合并后，被合并SKU将从产品库列表移除，请谨慎操作！</span>
          <el-button size="mini" type="primary" @click="onSubmit" :disabled="btnFlag" :loading="btnFlag">合并</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from "vue";
export default {
  name: "mergeSku",
  props: {
    mergeSkuFlag: {
      type: Boolean,
    },
  },
  setup(prop, ctx) {
    const data = reactive({
      ruleForm: [
        {
          sku: "",
          productCname: "",
          isMainSku: 1,
        },
        {
          sku: "",
          productCname: "",
          isMainSku: 0,
        },
      ],
      btnFlag: false,
      remarks: "",
      mergedSkuConditionList: [],
      scendNum: 2,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});

    const closed = () => {
      vue.$parent.mergeSkuFlag = false;
      data.ruleForm = [
        {
          sku: "",
          productCname: "",
          isMainSku: 1,
        },
        {
          sku: "",
          productCname: "",
          isMainSku: 0,
        },
      ];
      data.remarks = "";
      data.btnFlag = false;
    };

    const addNum = () => {
      let obj = {
        sku: "",
        productCname: "",
        isMainSku: 0,
      };
      data.ruleForm.push(obj);
    };

    const DeleteNum = index => {
      data.ruleForm.splice(index, 1);
      // console.log(data.ruleForm, index);
    };

    const searchSku = (e, i) => {
      if (e && e != "") {
        api.product.getLikeSku({ sku: e }).then(res => {
          if (res.code == 200) {
            data.ruleForm.map((item, index) => {
              if (res.data.productSku == item.sku) {
                item.productCname = res.data.productCname;
              }
            });
          }
        });
      } else {
        vue.$message({
          type: "warning",
          message: "请先输入sku再进行搜索！",
        });
      }
    };

    const onSubmit = () => {
      data.btnFlag = true;
      let proMergeVo = {
        mergedRemarks: data.remarks,
        mergedSkuConditionList: data.ruleForm,
      };
      if (
        data.ruleForm.every(item => {
          return item.sku != "";
        })
      ) {
        if (
          data.ruleForm.every(i => {
            return i.name != "";
          })
        ) {
          api.product
            .mergeSku(proMergeVo)
            .then(res => {
              if (res.code == 200) {
                vue.$message({
                  type: "success",
                  message: res.msg,
                });
                data.btnFlag = false;
                closed();
                vue.$parent.getPageData();
              } else {
                vue.$message({
                  type: "error",
                  message: res.msg,
                });
                data.btnFlag = false;
              }
            })
            .catch(err => {
              data.btnFlag = false;
            });
        } else {
          vue.$message({
            type: "warning",
            message: "请填写所有产品名称",
          });
          data.btnFlag = false;
        }
      } else {
        data.btnFlag = false;
        vue.$message({
          type: "warning",
          message: "请填写所有sku",
        });
      }
    };
    const refData = toRefs(data);
    return {
      ...refData,
      closed,
      addNum,
      DeleteNum,
      onSubmit,
      searchSku,
    };
  },
};
</script>
<style scoped lang="scss">
#MergeSku {
  .box_title {
    width: 100%;
    height: 40px;
    background: #f5f5f5;
    display: flex;
    .operation {
      width: 10%;
      line-height: 40px;
      text-indent: 16px;
    }
    .role {
      width: 10%;
      text-indent: 16px;
      line-height: 40px;
    }
    .name {
      width: 60%;
      text-indent: 16px;
      line-height: 40px;
    }
    .sku {
      width: 20%;
      text-indent: 16px;
      line-height: 40px;
    }
  }
  .scendSku {
    width: 100%;
    display: flex;
    height: 40px;
    margin-top: 10px;
    .skuData {
      width: 20%;
    }
    .nameData {
      width: 60%;
    }
    .roleData {
      text-indent: 16px;
      width: 10%;
      line-height: 40px;
    }
    .operationData {
      text-indent: 16px;
      line-height: 40px;
      width: 10%;
      color: #409eff;
      cursor: pointer;
    }
  }
  .tost {
    font-size: 12px;
    color: gray;
  }
  .add {
    text-indent: 6px;
    width: 100%;
    margin-bottom: 20px;
    color: #409eff;
    cursor: pointer;
  }
  :deep(.el-form-item__content) {
    width: 85%;
  }
  :deep(.el-dialog__body) {
    padding-top: 10px;
  }
  .remark {
    margin: 20px 0;
  }
}
</style>
