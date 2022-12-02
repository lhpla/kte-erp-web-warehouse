<!-- DetailDialog 产品品类管理新增、编辑 -->
<template>
  <div id="DetailDialog" class="cascader-panel-radio">
    <el-dialog
      :title="title"
      v-model="productVisible"
      :close-on-click-modal="false"
      width="600px"
      @close="closed"
      destroy-on-close
    >
      <el-form
        ref="productFormRef"
        size="mini"
        :model="productForm"
        :rules="rules"
        label-width="120px"
        class="dialog-form"
      >
        <el-form-item :label="`${title}中文名 ：`" prop="name">
          <el-input
            v-model="productForm.name"
            maxlength="500"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="`${title}英文名 ：`" prop="englishName">
          <el-input
            v-model="productForm.englishName"
            maxlength="500"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="品类缩写 ：" prop="acronym">
          <el-input
            :disabled="title=='编辑' && productForm.categoryLevel==1"
            v-model="productForm.acronym"
            maxlength="2"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="上级类目 ：">
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
        <!-- <el-form-item label="品类状态 ：">
          <el-switch v-model="productForm.isDisable" :active-value="0" :inactive-value="1"></el-switch>
        </el-form-item> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="mini" @click="closed">取 消</el-button>
          <el-button
            size="mini"
            :loading="submitActive"
            :disabled="submitActive"
            type="primary"
            @click="onSubmit"
            >确 定</el-button
          >
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
  inject,
} from 'vue';
import tablePage from '@/compositionApi/tablePage';

export default {
  name: 'DetailDialog',
  props: {
    isProduct: {
      type: String,
    },
    // productVisible: {
    //   type: Boolean,
    //   default: false,
    // },
    // cascaderOptions: {
    //   type: Array,
    // },
    searchMsg:{
      type:Object
    }
  },
  setup(prop, ctx) {
    const { getTableList, dataService, dataApi } = tablePage();

    const data = reactive({
      rules: {
        name: [
          { required: true, message: '请输入品类中文名', trigger: 'blur' },
        ],
        englishName: [
          { required: true, message: '请输入品类英文名', trigger: 'blur' },
        ],
        acronym: [
          { required: true, message: '请输入品类缩写', trigger: 'blur' },
          { pattern: /^[A-Z][A-Z]$/,message: '请输入大写字母，两位', trigger: 'blur'},
        ],
      },
      productForm: {},
      cascaderRule: { checkStrictly: true, label: 'englishName', value: 'id' },
      submitActive: false,
      selectedCascader: '',
      productVisible: false,
      cascaderOptions: [],
      title: '',
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const refData = toRefs(data);
    const getTableData = inject('getTableData');
    const productFormRef = ref(null);

    // 品类等级改变
    const changeCascader = (res) => {
      if (res) {
        let arr = JSON.stringify(res);
        arr = JSON.parse(arr);
        data.productForm.parentId = arr.pop();
        data.rules.acronym = [
          { required: false, message: '请输入品类缩写', trigger: 'blur' },
        ];
      } else {
        data.productForm.parentId = 0;
        data.rules.acronym = [
          { required: true, message: '请输入品类缩写', trigger: 'blur' },
           { pattern: /^[A-Z][A-Z]$/,message: '请输入大写字母，两位', trigger: 'blur'},
        ];
      }
    };

    // 关闭编辑或新增弹框
    const closed = () => {
      data.productForm = {};
      data.selectedCascader = '';
      data.productVisible = false;
      if (productFormRef.value) {
        productFormRef.value.clearValidate();
        productFormRef.value.resetFields();
      }
      data.rules.acronym = [
        { required: false, message: '请输入品类缩写', trigger: 'blur' },
        { pattern: /^[A-Z][A-Z]$/,message: '请输入大写字母，两位', trigger: 'blur'},
      ];
    };

    const getMsg = (info) => {
      data.productForm = {};
      data.productForm.id = info.row.id;
      data.productForm.englishName = '';
      data.productForm.acronym = '';
      data.productVisible = true;
      data.title = info.type == 'add' ? '新增' : '编辑';
      if (info.type == 'edit') {
        api.product
          .categoryDetail({ categoryId: info.row.id })
          .then((res) => {
            if (res.code == 200) {
              data.productForm.categoryLevel = res.data.categoryLevel;
              data.productForm.parentId = res.data.parentId;
              data.productForm.id = res.data.id;
              data.productForm.name = res.data.name;
              data.productForm.englishName = res.data.englishName;
              data.productForm.acronym = res.data.acronym;
              data.productForm.isDisable = res.data.isDisable;
              data.selectedCascader = res.data.parentId;
              if (data.productForm.parentId == 0) {
                data.rules.acronym = [
                  {
                    required: true,
                    message: '请输入品类缩写',
                    trigger: 'blur',
                  },
                ];
              }else{
                 data.rules.acronym = [{message: '请输入品类缩写',trigger: 'blur',}];
              }
              api.product
                .getCategoryByPersonInCharge()
                .then((res) => {
                  if (res.code == 200) {
                    data.cascaderOptions = res.data;
                    console.log(data.cascaderOptions);
                  } else {
                    data.tableLoading = false;
                    vue.$message({
                      type: 'warning',
                      message: res.msg,
                    });
                  }
                })
                .catch((err) => {
                  vue.$message({
                    type: 'warning',
                    message: '获取品类级别失败',
                  });
                });
            }
          })
          .catch((err) => {
            vue.$message({
              type: 'warning',
              message: res.msg,
            });
          });
      } else {
        //除了品类编辑 其他全部改为 获取全部品类接口
        // api.system.getProductList({ parentId: info.id }).then(res => {
        // if (res.code == 200) {
        //   data.cascaderOptions = res.data.data;
        // } else {
        data.tableLoading = false;
        data.rules.acronym = [
          { required: true, message: '请输入品类缩写', trigger: 'blur' },
          { pattern: /^[A-Z][A-Z]$/,message: '请输入大写字母，两位', trigger: 'blur'},
        ];
        api.product
          .getCategoryByPersonInCharge()
          .then((res) => {
            if (res.code == 200) {
              data.cascaderOptions = res.data;
            } else {
              data.tableLoading = false;
              vue.$message({
                type: 'warning',
                message: res.msg,
              });
            }
          })
          .catch((err) => {
            vue.$message({
              type: 'warning',
              message: '获取品类级别失败',
            });
          });
        // }
        // });
      }
    };

    //提交
    const onSubmit = () => {
      data.productForm.name = data.productForm.name
        ? data.productForm.name.trim()
        : '';
      data.productForm.englishName = data.productForm.englishName
        ? data.productForm.englishName.trim()
        : '';
      data.productForm.acronym = data.productForm.acronym
        ? data.productForm.acronym.trim()
        : '';
      productFormRef.value.validate((valid) => {
        if (valid) {
          data.submitActive = true;
          if (data.title == '新增') {
            let info = {
              acronym: data.productForm.acronym,
              englishName: data.productForm.englishName,
              isDisable: data.productForm.isDisable,
              name: data.productForm.name,
              parentId: data.productForm.parentId,
            };
            api.product
              .categorySubmitInfo(info)
              .then((res) => {
                if (res.code == 200) {
                  vue.$message({
                    type: 'success',
                    message: res.msg,
                  });
                  data.submitActive = false;
                  getTableData(prop.searchMsg);
                  data.productVisible = false;
                } else {
                  vue.$message({
                    type: 'warning',
                    message: res.msg,
                  });
                  data.submitActive = false;
                }
              })
              .catch((e) => {
                data.submitActive = false;
              });
          } else {
            console.log(data.productForm);
            let info = {
              acronym: data.productForm.acronym,
              englishName: data.productForm.englishName,
              isDisable: data.productForm.isDisable,
              name: data.productForm.name,
              id: data.productForm.id,
              parentId: data.productForm.parentId,
              // parentId: data.selectedCascader[data.selectedCascader.length - 1],
            };
            api.product
              .categoryUpdateInfo(info)
              .then((res) => {
                if (res.code == 200) {
                  vue.$message({
                    type: 'success',
                    message: res.msg,
                  });
                  data.submitActive = false;
                  getTableData(prop.searchMsg);
                  data.productVisible = false;
                } else {
                  vue.$message({
                    type: 'warning',
                    message: res.msg,
                  });
                  data.submitActive = false;
                }
              })
              .catch((e) => {
                data.submitActive = false;
              });
            data.isDisabled = false;
          }
        }
      });
    };

    return {
      ...refData,
      changeCascader,
      closed,
      getTableList,
      productFormRef,
      dataService,
      dataApi,
      getMsg,
      onSubmit,
    };
  },
};
</script>
<style scoped lang="scss"></style>
