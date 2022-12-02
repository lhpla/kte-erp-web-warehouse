<!--PropertyManageLog  SPU属性管理弹窗-->
<template>
  <div id="PropertyManageLog">
    <el-dialog :title="title" v-model="productVisible" :close-on-click-modal="false" width="500px" @close="closed" destroy-on-close>
      <el-form ref="productFormRef" size="mini" :model="productForm" :rules="rules" label-width="120px" class="dialog-form">
        <el-form-item label="英文类目名 ：" prop="englishName">
          <el-input v-model="productForm.englishName" clearable onkeyup="value=value.replace(/[&\|\\\*^%$#@\-]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="中文类目名 ：" prop="name">
          <el-input v-model="productForm.name" clearable onkeyup="value=value.replace(/[&\|\\\*^%$#@\-]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="上级目录 ：">
          <el-cascader
            style="width: 100%"
            filterable
            clearable
            :options="cascaderOptions"
            v-model="selectedCascader"
            :props="cascaderRule"
            @change="changeCascader"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="mini" @click="closed">取 消</el-button>
          <el-button size="mini">暂存草稿</el-button>
          <el-button size="mini" :loading="submitActive" :disabled="submitActive" type="primary" @click="onSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from "vue";
export default {
  name: "PropertyManageLog",
  setup(prop, ctx) {
    const data = reactive({
      rules: {
        name: [{ required: true, message: "请输入品类中文名", trigger: "blur" }],
        englishName: [{ required: true, message: "请输入品类英文名", trigger: "blur" }],
      },
      productVisible: false,
      productForm: {},
      title: "",
      submitActive: false,
      cascaderRule: { checkStrictly: true, label: "name", value: "id" },
      cascaderOptions: [],
      selectedCascader: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const refData = toRefs(data);
    const productFormRef = ref(null);

    // 品类等级改变
    const changeCascader = res => {
      if (res) {
        let arr = JSON.stringify(res);
        arr = JSON.parse(arr);
        data.productForm.parentId = arr.pop();
      } else {
        data.productForm.parentId = 0;
      }
    };

    const getMsg = info => {
      data.productForm = {};
      data.productForm.id = info.row.id;
      data.productForm.acronym = "NONE";
      data.productVisible = true;
      data.title = info.type == "add" ? "新增品类" : "编辑品类";
      // if (info.type == "edit") {
      //   api.product
      //     .categoryDetail({ categoryId: info.row.id })
      //     .then(res => {
      //       if (res.code == 200) {
      //         data.productForm.id = res.data.id;
      //         data.productForm.name = res.data.name;
      //         data.productForm.englishName = res.data.englishName;
      //         data.productForm.acronym = res.data.acronym;
      //         data.productForm.isDisable = res.data.isDisable;
      //         data.selectedCascader = res.data.parentId;
      //         api.system
      //           .getProductList({ parentId: data.selectedCascader })
      //           .then(res => {
      //             if (res.code == 200) {
      //               data.cascaderOptions = res.data;
      //               console.log(data.cascaderOptions);
      //             } else {
      //               data.tableLoading = false;
      //               vue.$message({
      //                 type: "warning",
      //                 message: res.msg,
      //               });
      //             }
      //           })
      //           .catch(err => {
      //             vue.$message({
      //               type: "warning",
      //               message: "获取品类级别失败",
      //             });
      //           });
      //       }
      //     })
      //     .catch(err => {
      //       vue.$message({
      //         type: "warning",
      //         message: res.msg,
      //       });
      //     });
      // } else {
      //   api.system.getProductList({ parentId: info.id }).then(res => {
      //     if (res.code == 200) {
      //       data.cascaderOptions = res.data;
      //     } else {
      //       data.tableLoading = false;
      //       vue.$message({
      //         type: "warning",
      //         message: res.msg,
      //       });
      //     }
      //   });
      // }
    };

    // 关闭编辑或新增弹框
    const closed = () => {
      data.productForm = {};
      data.selectedCascader = "";
      data.productVisible = false;
      if (productFormRef.value) {
        productFormRef.value.clearValidate();
        productFormRef.value.resetFields();
      }
    };

    //提交
    const onSubmit = () => {
      // productFormRef.value.validate(valid => {
      //   if (valid) {
      //     data.submitActive = true;
      //     if (data.title == "新增") {
      //       let info = {
      //         acronym: data.productForm.acronym,
      //         englishName: data.productForm.englishName,
      //         isDisable: data.productForm.isDisable,
      //         name: data.productForm.name,
      //         parentId: data.productForm.parentId,
      //       };
      //       api.system
      //         .addProduct(info)
      //         .then(res => {
      //           if (res.code == 200) {
      //             vue.$message({
      //               type: "success",
      //               message: res.msg,
      //             });
      //             data.submitActive = false;
      //             getTableData();
      //             data.productVisible = false;
      //           } else {
      //             vue.$message({
      //               type: "warning",
      //               message: res.msg,
      //             });
      //             data.submitActive = false;
      //           }
      //         })
      //         .catch(e => {
      //           data.submitActive = false;
      //         });
      //     } else {
      //       let info = {
      //         acronym: data.productForm.acronym,
      //         englishName: data.productForm.englishName,
      //         isDisable: data.productForm.isDisable,
      //         name: data.productForm.name,
      //         id: data.productForm.id,
      //         parentId: data.productForm.parentId,
      //         // parentId: data.selectedCascader[data.selectedCascader.length - 1],
      //       };
      //       api.system
      //         .editProduct(info)
      //         .then(res => {
      //           if (res.code == 200) {
      //             vue.$message({
      //               type: "success",
      //               message: res.msg,
      //             });
      //             data.submitActive = false;
      //             getTableData();
      //             data.productVisible = false;
      //           } else {
      //             vue.$message({
      //               type: "warning",
      //               message: res.msg,
      //             });
      //             data.submitActive = false;
      //           }
      //         })
      //         .catch(e => {
      //           data.submitActive = false;
      //         });
      //       data.isDisabled = false;
      //     }
      //   }
      // });
    };
    return {
      ...refData,
      onSubmit,
      closed,
      getMsg,
      changeCascader,
      productFormRef,
    };
  },
};
</script>
<style scoped lang='scss'>
#PropertyManageLog {
}
</style>
