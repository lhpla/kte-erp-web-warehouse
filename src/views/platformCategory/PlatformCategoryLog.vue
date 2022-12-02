<!--PlatformCategoryLog  平台类目管理编辑弹窗-->
<template>
  <div id="PlatformCategoryLog">
    <el-dialog :title="title" v-model="productVisible" :close-on-click-modal="false" width="598px" @close="closed" destroy-on-close>
      <el-form ref="productFormRef" size="mini" :model="productForm" :rules="rules" label-width="120px" class="dialog-form">
        <div class="flex">
          <el-form-item label="平台站点：" prop="platformId">
            <el-select v-model="productForm.platformId" size="mini" @change="platChange" filterable clearable placeholder="请选择">
              <el-option v-for="item in platformOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="0" prop="siteId">
            <el-select
              :disabled="!productForm.platformId"
              v-model="productForm.siteId"
              :loading="shopIdLoading"
              size="mini"
              class="margin-left"
              filterable
              clearable
              placeholder="请选择"
              @change="superior"
            >
              <!-- siteChineseAndEnglishName -->
              <el-option v-for="item in siteList" :key="item.id" :label="item.siteChineseAndEnglishName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="平台类目名 ：" prop="englishCategory">
          <el-input v-model="productForm.englishCategory" placeholder="请输入" maxlength="500" show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item label="中文类目名 ：" prop="chineseCategory">
          <el-input v-model="productForm.chineseCategory" placeholder="请输入" maxlength="500" show-word-limit clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="上级类目 ：">
          <el-cascader
            style="width: 100%"
            filterable
            clearable
            :options="cascaderOptions"
            v-model="selectedCascader"
            :props="cascaderRule"
            @change="changeCascader"
          ></el-cascader>
        </el-form-item> -->
        <el-form-item label="佣金(%) ：" prop="commission">
          <el-input-number
            v-model.number="productForm.commission"
            size="mini"
            :controls="false"
            style="text-align: left; width: 400px"
            placeholder="输入的数字"
            :precision="2"
            :step="0.01"
            :min="0"
            :max="9999.99"
            @focus="tipFlag = true"
            @blur="tipFlag = false"
          ></el-input-number>
          <div v-if="tipFlag" class="tip">tip:费率限制为9999.99%以内</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="mini" @click="closed">取 消</el-button>
          <el-button size="mini" :loading="submitActive" :disabled="submitActive" type="primary" @click="onSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject, nextTick } from "vue";
import { localGet } from "@/utils/util";

export default {
  name: "PlatformCategoryLog",
  setup(prop, ctx) {
    const data = reactive({
      rules: {
        // chineseCategory: [{ required: true, message: "请输入品类中文名", trigger: "blur" }],
        // commission: [{ required: true, message: "请输入佣金", trigger: "blur" }],
        englishCategory: [{ required: true, message: "请输入平台类目", trigger: "blur" }],
        platformId: [{ required: true, message: "请选择平台", trigger: "change" }],
        siteId: [{ required: true, message: "请选择站点", trigger: "change" }],
      },
      productForm: {
        commission: 0,
        platformId: "",
        siteId: "",
      },
      cascaderRule: { checkStrictly: true, label: "englishCategory", value: "id" },
      submitActive: false,
      selectedCascader: [],
      productVisible: false,
      cascaderOptions: [],
      title: "",
      label: "",
      shopIdLoading: false, //loading
      platformOptions: [],
      siteList: [], //站点列表
      tipFlag: false, //佣金提示
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      getInfo();
    });
    const refData = toRefs(data);
    const productFormRef = ref(null);
    const getTableData = inject("getTableData");

    const getInfo = () => {
      data.platform_category_state = localGet("dictCodeList").platform_category_state ? localGet("dictCodeList").platform_category_state : [];
      api.product
        .getAllPlatform()
        .then(res => {
          if (res.code == 200) {
            data.platformOptions = res.data;
          } else {
            data.platformOptions = [];
          }
          data.shopIdLoading = false;
        })
        .catch(e => {
          data.shopIdLoading = false;
          data.platformOptions = [];
        });
    };

    //根据平台搜索站点
    const platChange = e => {
      if (e) {
        data.productForm.siteId = "";
        data.shopIdLoading = true;
        api.product
          .getSiteByPlatformId({ platformId: e })
          .then(res => {
            if (res.code == 200) {
              console.log(res.data);
              data.siteList = res.data;
            } else {
              data.productForm.siteId = "";
            }
            data.shopIdLoading = false;
          })
          .catch(e => {
            data.shopIdLoading = false;
            data.productForm.siteId = "";
          });
      } else {
        data.productForm.siteId = "";
      }
    };

    //选择站点获取品类
    const superior = e => {
      let info = {
        platformId: data.productForm.platformId,
        siteId: e,
      };
      api.product
        .platformCategoryList(info)
        .then(res => {
          if (res.code == 200) {
            data.cascaderOptions = res.data.data;
            console.log(data.cascaderOptions);
          } else {
            data.tableLoading = false;
            vue.$message({
              type: "warning",
              message: res.msg,
            });
          }
        })
        .catch(err => {
          vue.$message({
            type: "warning",
            message: "获取品类级别失败",
          });
        });
    };

    // 品类等级改变
    const changeCascader = res => {
      if (data.productForm.platformId) {
        if (res) {
          let arr = JSON.stringify(res);
          arr = JSON.parse(arr);
          data.productForm.parentId = arr.pop();
        } else {
          data.productForm.parentId = 0;
        }
      } else {
        vue.$message.warning("选择平台站点后才能选择上级目录");
      }
    };

    const getMsg = info => {
      data.productForm = {};
      if (info.row.id) {
        data.productForm.id = info.row.id;
      }
      data.productVisible = true;
      data.title = info.type == "add" ? "新增品类" : "编辑品类";

      data.label = info.type == "add" ? "新增" : "编辑";
      if (info.type == "edit") {
        getInfo();
        api.product
          .platformCategoryDetail({ platformCategoryId: info.row.id })
          .then(res => {
            if (res.code == 200) {
              data.productForm = res.data;
              data.productForm.commission = Number(res.data.commission);
              // data.productForm.id = res.data.id;
              // data.productForm.name = res.data.name;
              // data.productForm.englishName = res.data.englishName;
              // data.productForm.acronym = res.data.acronym;
              // data.productForm.isDisable = res.data.isDisable;
              data.selectedCascader = res.data.parentId;
              api.product
                .getSiteByPlatformId({ platformId: data.productForm.platformId })
                .then(res => {
                  if (res.code == 200) {
                    console.log(res.data);
                    data.siteList = res.data;
                  } else {
                    data.siteList = [];
                  }
                  data.shopIdLoading = false;
                })
                .catch(e => {
                  data.shopIdLoading = false;
                  data.siteList = [];
                });
              data.productForm.siteId = res.data.siteId;
              api.product
                .platformCategoryList({
                  platformId: data.productForm.platformId,
                  siteId: data.productForm.siteId,
                })
                .then(res => {
                  if (res.code == 200) {
                    data.cascaderOptions = res.data.data;
                    console.log(data.cascaderOptions);
                  } else {
                    data.tableLoading = false;
                    vue.$message({
                      type: "warning",
                      message: res.msg,
                    });
                  }
                })
                .catch(err => {
                  vue.$message({
                    type: "warning",
                    message: "获取品类级别失败",
                  });
                });
              nextTick(() => {
                productFormRef.value.clearValidate();
              });
            }
          })
          .catch(err => {
            vue.$message({
              type: "warning",
              message: res.msg,
            });
          });
      } else {
        // api.product
        //   .platformCategoryList()
        //   .then(res => {
        //     if (res.code == 200) {
        //       data.cascaderOptions = res.data;
        //     } else {
        //       data.tableLoading = false;
        //       vue.$message({
        //         type: "warning",
        //         message: res.msg,
        //       });
        //     }
        //   })
        //   .catch(err => {
        //     vue.$message({
        //       type: "warning",
        //       message: "获取品类级别失败",
        //     });
        //   });
        nextTick(() => {
          productFormRef.value.clearValidate();
        });
      }
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
      data.productForm.englishCategory = data.productForm.englishCategory ? data.productForm.englishCategory.trim() : "";
      data.productForm.chineseCategory = data.productForm.chineseCategory ? data.productForm.chineseCategory.trim() : "暂无数据";
      data.siteList.forEach(item => {
        if (data.productForm.siteId == item.id) {
          data.productForm.siteName = item.siteChineseAndEnglishName;
        }
      });
      productFormRef.value.validate(valid => {
        if (valid) {
          data.submitActive = true;
          if (data.title == "新增品类") {
            // data.productForm.parentId = data.selectedCascader[data.selectedCascader.length - 1];
            api.product
              .pcSubmit(data.productForm)
              .then(res => {
                if (res.code == 200) {
                  vue.$message({
                    type: "success",
                    message: res.msg,
                  });
                  data.submitActive = false;
                  getTableData();
                  data.productVisible = false;
                } else {
                  vue.$message({
                    type: "warning",
                    message: res.msg,
                  });
                  data.submitActive = false;
                }
              })
              .catch(e => {
                data.submitActive = false;
              });
          } else {
            // data.productForm.parentId = data.selectedCascader[data.selectedCascader.length - 1];
            api.product
              .pcUpdateInfo(data.productForm)
              .then(res => {
                if (res.code == 200) {
                  vue.$message({
                    type: "success",
                    message: res.msg,
                  });
                  data.submitActive = false;
                  getTableData();
                  data.productVisible = false;
                } else {
                  vue.$message({
                    type: "warning",
                    message: res.msg,
                  });
                  data.submitActive = false;
                }
              })
              .catch(e => {
                data.submitActive = false;
              });
            data.isDisabled = false;
          }
        }
      });
    };
    return {
      ...refData,
      getMsg,
      closed,
      changeCascader,
      onSubmit,
      productFormRef,
      platChange,
      getInfo,
      superior,
    };
  },
};
</script>
<style scoped lang="scss">
#PlatformCategoryLog {
  .tip {
    color: red;
    line-height: 1.5em;
  }
  :deep(.el-form-item) {
    height: 46px;
  }
  :deep(.el-input__inner) {
    text-align: left;
  }
}
</style>
