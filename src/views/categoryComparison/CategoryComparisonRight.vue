<!--CategoryComparisonRight  品类对照右表格编辑-->
<template>
  <div id="CategoryComparisonRight" class="categoryComparison">
    <div class="header">
      <div class="table-box">
        <div class="table-header">
          <div class="font">系统品类数量：{{ count ? count : "-" }}</div>
          <div>
            <el-button size="mini" type="primary" v-if="buttonAuthor.log" @click="dateLog">日志</el-button>
            <el-button size="mini" type="primary" v-if="buttonAuthor.update" @click="update">更新</el-button>
            <el-button size="mini" type="primary" v-if="buttonAuthor.import" @click="importTable">导入</el-button>
            <el-button size="mini" type="primary" v-if="buttonAuthor.batchUpload" @click="exportTable">导出</el-button>
          </div>
        </div>
      </div>
      <el-form :model="tableDataFrom" :inline-message="true" ref="tableDietRef" class="tableForm">
        <el-table v-loading="loading" :data="tableDataFrom.tableData" border size="mini" class="table_margin">
          <el-table-column prop="platformName" label="平台" align="center" min-width="100px">
            <template #default="{ row, $index }">
              <template v-if="row.id">
                <el-form-item v-if="row.lock && $index >= 0" :prop="`tableData.${$index}.platformName`">
                  <el-select v-model="row.platformId" size="mini" @change="platChange" :disabled="isDisable == 1" filterable clearable placeholder="请选择平台">
                    <el-option v-for="item in allPlatform" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <span v-else>{{ row.platformName }}</span>
              </template>
              <!-- siteChineseAndEnglishName -->
              <el-select v-else v-model="platformName" size="mini" @change="platChange" :disabled="isDisable == 1" filterable clearable placeholder="请选择平台">
                <el-option v-for="item in allPlatform" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column prop="siteName" label="站点" align="center" min-width="100px">
            <template #default="{ row, $index }">
              <template v-if="row.id">
                <el-form-item v-if="row.lock && $index >= 0" :prop="`tableData.${$index}.siteName`">
                  <el-select
                    v-model="row.siteId"
                    :loading="shopIdLoading"
                    size="mini"
                    :disabled="isDisable == 1"
                    class="margin-left"
                    filterable
                    clearable
                    placeholder="请选择站点"
                  >
                    <el-option v-for="item in siteList" :key="item.id" :label="item.siteChineseAndEnglishName" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <span v-else>{{ row.siteName }}</span>
              </template>
              <el-select
                :disabled="platformName === '' || isDisable == 1"
                v-else
                v-model="siteName"
                :loading="shopIdLoading"
                size="mini"
                class="margin-left"
                filterable
                clearable
                placeholder="请选择站点"
              >
                <el-option v-for="item in siteList" :key="item.id" :label="item.siteChineseAndEnglishName" :value="item.id"></el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column prop="englishPlatformCategoryName" align="center" label="平台类目" min-width="100px">
            <template #default="{ row, $index }">
              <template v-if="row.id">
                <template v-if="row.lock && $index >= 0">
                  <el-autocomplete
                    size="mini"
                    v-model="row.englishPlatformCategoryName"
                    :fetch-suggestions="fetchEditPlatformCategoryName"
                    placeholder="请输入英文类目"
                    clearable
                    filterable
                    :disabled="isDisable == 1"
                    @select="handleSelectEnglish"
                    popper-class="autocompleteClass"
                  >
                    <template #default="{ item }">
                      <div style="display: flex; justify-content: space-between">
                        <div>{{ item.englishPlatformCategoryName }}</div>
                        <div style="color: #bdbdbd; font-size: 12px; margin-left: 20px">{{ item.chineseSysCategoryName ? item.chineseSysCategoryName : "未选择" }}</div>
                      </div>
                    </template>
                  </el-autocomplete>
                </template>
                <span v-else>{{ row.englishPlatformCategoryName }}</span>
              </template>
              <el-autocomplete
                v-else
                size="mini"
                :disabled="platformName === '' || siteName === '' || isDisable == 1"
                v-model="englishPlatformCategoryName"
                :fetch-suggestions="fetchPlatformCategoryName"
                placeholder="请输入英文类目"
                @select="handleSelectEnglish"
                clearable
                popper-class="autocompleteClass"
              >
                <template #default="{ item }">
                  <div style="display: flex; justify-content: space-between">
                    <div>{{ item.englishPlatformCategoryName }}</div>
                    <div style="color: #bdbdbd; font-size: 12px; margin-left: 20px">{{ item.chineseSysCategoryName ? item.chineseSysCategoryName : "未选择" }}</div>
                  </div>
                </template>
              </el-autocomplete>
            </template>
          </el-table-column>

          <el-table-column prop="chinesePlatformCategoryName" align="center" label="平台中文类目" min-width="100px">
            <template #default="{ row, $index }">
              <template v-if="row.id">
                <template v-if="row.lock && $index >= 0">
                  <el-autocomplete
                    size="mini"
                    v-model="row.chinesePlatformCategoryName"
                    :fetch-suggestions="fetchEditPlatformCategoryName"
                    placeholder="请输入中文类目"
                    clearable
                    @select="handleSelectChinese"
                    popper-class="autocompleteClass"
                    :disabled="isDisable == 1"
                  >
                    <template #default="{ item }">
                      <div style="display: flex; justify-content: space-between">
                        <div>{{ item.chinesePlatformCategoryName }}</div>
                        <div style="color: #bdbdbd; font-size: 12px; margin-left: 20px">{{ item.chineseSysCategoryName ? item.chineseSysCategoryName : "未选择" }}</div>
                      </div>
                    </template>
                  </el-autocomplete>
                </template>
                <span v-else>{{ row.chinesePlatformCategoryName }}</span>
              </template>
              <el-autocomplete
                v-else
                size="mini"
                :disabled="platformName === '' || siteName === '' || isDisable == 1"
                v-model="chinesePlatformCategoryName"
                :fetch-suggestions="fetchPlatformCategoryName"
                placeholder="请输入中文类目"
                @select="handleSelectChinese"
                clearable
                popper-class="autocompleteClass"
              >
                <template #default="{ item }">
                  <div style="display: flex; justify-content: space-between">
                    <div>{{ item.chinesePlatformCategoryName }}</div>
                    <div style="color: #bdbdbd; font-size: 12px; margin-left: 20px">{{ item.chineseSysCategoryName ? item.chineseSysCategoryName : "未选择" }}</div>
                  </div>
                </template>
              </el-autocomplete>
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" align="center">
            <template #default="{ row }">
              <template v-if="row.id">
                <el-button size="mini" type="text" :disabled="isDisable == 1" icon="el-icon-edit" v-show="!row.lock && buttonAuthor.edit" @click="eidtTable(row)">
                  更换
                </el-button>
                <el-button size="mini" type="text" :disabled="isDisable == 1" icon="el-icon-close" v-if="buttonAuthor.delete" v-show="!row.lock" @click="remove(row)">
                  解除
                </el-button>
                <el-button size="mini" type="text" :disabled="isDisable == 1" icon="el-icon-finished" v-if="buttonAuthor.add" v-show="row.lock" @click="saveTable(row)">
                  确认
                </el-button>
              </template>
              <el-button size="mini" type="text" :disabled="isDisable == 1" icon="el-icon-edit" v-else @click="sureAdd">确认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <!-- 日志 -->
    <CategoryTabLog ref="CategoryTabLog"></CategoryTabLog>
    <!-- 导入导出 -->
    <AllDownDialog :title="AllDownDialogTitle" ref="AllDownDialog"></AllDownDialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, nextTick, watch, provide } from "vue";
import CategoryTabLog from "./CategoryTabLog.vue";
import { download } from "@/utils/util";
import authorButtons from "@/compositionApi/authorButtons";

export default {
  name: "CategoryComparisonRight",
  components: { CategoryTabLog },
  props: ["sysCategoryId", "isClickLeftNode", "isDisable", "count"],
  setup(props, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      loading: false,
      AllDownDialogTitle: "导入",
      tableDataFrom: {
        tableData: [],
      },
      tabsList: [
        {
          title: "AMZ",
          name: "1",
          content: "Tab 1 content",
        },
        {
          title: "Ebay",
          name: "2",
          content: "Tab 2 content",
        },
      ],

      siteList: [], //站点列表
      platformOptions: [],
      shopIdLoading: false,
      // 选择平台
      platformName: "",
      // 选择站点
      siteName: "",
      // 英文类目
      englishPlatformCategoryName: "",
      // 中文类目
      chinesePlatformCategoryName: "",
      // 平台类目id
      platformId: "",
      // 类目列表
      categoryList: [],
      // 当前编辑行数据
      currentEdit: null,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;

    const allPlatform = ref([]);
    const allSite = ref([]);

    onBeforeMount(() => {});
    onMounted(() => {
      getInfo();
      getAllPlatform();
    });
    const refData = toRefs(data);

    //表格编辑
    const eidtTable = row => {
      data.currentEdit = row;
      data.tableDataFrom.tableData.map((item, index) => {
        if (row.id == item.id) {
          item.lock = true;
        }
      });
      api.product.getSiteByPlatformId({ platformId: row.platformId }).then(res => {
        if (res.code == 200) {
          data.siteList = res.data;
        }
      });
    };

    const getInfo = () => {
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
        data.shopIdLoading = true;
        data.siteName = "";
        api.product
          .getSiteByPlatformId({ platformId: e })
          .then(res => {
            if (res.code == 200) {
              data.siteList = res.data;
              console.log(data.tableDataFrom.tableData);
            } else {
              data.siteName = "";
            }
            data.shopIdLoading = false;
          })
          .catch(e => {
            data.shopIdLoading = false;
            data.siteName = "";
          });
      } else {
        data.siteName = "";
      }
    };

    // 解除
    const remove = row => {
      vue
        .$confirm(` `, {
          title: "提示",
          dangerouslyUseHTMLString: true,
          message: "<div style=margin-left:20px><b style=font-size:14px>关系解除后无法恢复</b></div><div style=margin-left:20px>请谨慎操作!</div>",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          api.product
            .CategoryMappingDelete(row.id)
            .then(res => {
              if (res.code == 200) {
                console.log(res);
                vue.$message({
                  type: "success",
                  message: res.msg,
                });
                getTableData();
              } else {
                vue.$message({
                  type: "warning",
                  message: res.msg,
                });
              }
            })
            .catch(() => {
              vue.$message({
                type: "info",
                message: "已取消修改",
              });
            });
        });
    };

    //保存表格
    const saveTable = row => {
      data.tableDataFrom.tableData.map((item, index) => {
        item.lock = false;
      });
      api.product.CategoryMappingUpdate(data.currentEdit).then(res => {
        if (res.code === 200) {
          vue.$message({
            type: "success",
            message: res.msg,
          });
          getTableData();
          ctx.emit("update:isClickLeftNode", false);
        } else {
          vue.$message({
            type: "error",
            message: res.msg,
          });
        }
        data.currentEdit = null;
      });
    };

    // 批量更新
    const update = () => {
      vue.$message({
        type: "warning",
        message: "功能正在开发中,敬请期待",
      });
      // let info = {
      //   title: "更新模板",
      //   temp: "batchUpdateTemplate",
      //   import: "importUpdateTemplate",
      //   servers: "provider",
      // };
      // data.AllDownDialogTitle = "更新";
      // nextTick(() => {
      //   vue.$refs.AllDownDialog.checkDialog(true, info);
      // });
    };
    // 导入
    const importTable = () => {
      let info = {
        title: "品类映射导入模板",
        temp: "getExportTemplate",
        import: "importCategoryMapping",
        servers: "product",
        id: props.sysCategoryId,
      };
      data.AllDownDialogTitle = "导入";
      nextTick(() => {
        vue.$refs.AllDownDialog.checkDialog(true, info);
      });
    };
    // 导出
    const exportTable = () => {
      api.product.exportCategoryMapping(props.sysCategoryId).then(res => {
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel;charset=UTF-8",
        });
        if ("msSaveOrOpenBlob" in navigator) {
          window.navigator.msSaveOrOpenBlob(blob, tempName + fileType);
          return;
        }
        const blobUrl = window.URL.createObjectURL(blob);
        download(blobUrl, "品类对照表", "");
      });
    };

    //日志
    const dateLog = () => {
      vue.$refs.CategoryTabLog.checkLogDialog();
    };

    // 获取品类数据
    const getTableData = () => {
      api.product
        .categoryMappingList({
          sysCategoryId: props.sysCategoryId,
        })
        .then(res => {
          data.tableDataFrom.tableData = res.data;
          data.tableDataFrom.tableData.push({
            createUser: "",
            createUserName: "",
            createTime: "",
            updateUser: "",
            updateUserName: "",
            updateTime: "",
            platformCategoryId: "",
            sysCategoryId: "",
            chinesePlatformCategoryName: "",
            englishPlatformCategoryName: "",
            chineseSysCategoryName: "",
            englishSysCategoryName: "",
            platformId: "",
            platformName: "",
            siteId: "",
            siteName: "",
            tenantId: "",
            responsibleId: "",
            responsibleName: "",
          });
        });
    };
    provide("getTableData", getTableData);

    // 所有平台
    const getAllPlatform = () => {
      api.product.getAllPlatform().then(res => {
        allPlatform.value = res.data;
      });
    };

    // 选择平台英文类目
    const handleSelectEnglish = val => {
      if (!data.currentEdit) {
        data.platformId = val.id;
        data.chinesePlatformCategoryName = val.chinesePlatformCategoryName;
        data.englishPlatformCategoryName = val.englishPlatformCategoryName;
      } else {
        data.currentEdit.platformCategoryId = val.id;
        data.currentEdit.chinesePlatformCategoryName = val.chinesePlatformCategoryName;
        data.currentEdit.englishPlatformCategoryName = val.englishPlatformCategoryName;
      }
    };
    // 选择平台中文类目
    const handleSelectChinese = val => {
      if (!data.currentEdit) {
        data.platformId = val.id;
        data.englishPlatformCategoryName = val.englishPlatformCategoryName;
        data.chinesePlatformCategoryName = val.chinesePlatformCategoryName;
      } else {
        data.currentEdit.platformCategoryId = val.id;
        data.currentEdit.englishPlatformCategoryName = val.englishPlatformCategoryName;
        data.currentEdit.chinesePlatformCategoryName = val.chinesePlatformCategoryName;
      }
    };
    // 获取类目
    const fetchEditPlatformCategoryName = (val, cb) => {
      if (val) {
        api.product
          .getPlatformCategoryByPlatformIdAndSiteId({
            platformId: data.currentEdit.platformId,
            siteId: data.currentEdit.siteId,
            chineseCategoryName: data.currentEdit.chinesePlatformCategoryName,
            englishCategoryName: data.currentEdit.englishPlatformCategoryName,
          })
          .then(res => {
            if (res.code === 200) {
              cb(res.data);
            }
          });
      } else {
        cb(data.categoryList);
      }
    };

    const fetchPlatformCategoryName = (val, cb) => {
      if (val) {
        api.product
          .getPlatformCategoryByPlatformIdAndSiteId({
            platformId: data.platformName,
            siteId: data.siteName,
            chineseCategoryName: data.chinesePlatformCategoryName,
            englishCategoryName: data.englishPlatformCategoryName,
          })
          .then(res => {
            cb(res.data);
          });
      } else {
        cb(data.categoryList);
      }
    };

    // 确认添加
    const sureAdd = () => {
      if (data.platformName === "") {
        vue.$message({
          type: "error",
          message: "平台名称不能为空",
        });
      } else if (data.siteName === "") {
        vue.$message({
          type: "error",
          message: "站点名称不能为空",
        });
      } else if (data.englishPlatformCategoryName === "") {
        vue.$message({
          type: "error",
          message: "平台英文类目不能为空",
        });
      } else if (data.chinesePlatformCategoryName === "") {
        vue.$message({
          type: "error",
          message: "平台中文类目不能为空",
        });
      } else {
        api.product
          .saveMapping({
            sysCategoryId: props.sysCategoryId,
            platformId: data.platformName,
            siteId: data.siteName,
            platformCategoryId: data.platformId,
            chinesePlatformCategoryName: data.chinesePlatformCategoryName,
            englishPlatformCategoryName: data.englishPlatformCategoryName,
          })
          .then(res => {
            if (res.code === 200) {
              vue.$message({
                type: "success",
                message: res.msg,
              });
              data.platformName = "";
              data.siteName = "";
              data.platformId = "";
              data.englishPlatformCategoryName = "";
              data.chinesePlatformCategoryName = "";
              ctx.emit("update:isClickLeftNode", false);
              getTableData();
            } else {
              vue.$message({
                type: "error",
                message: res.msg,
              });
            }
          });
      }
    };

    watch(
      () => props.sysCategoryId,
      val => {
        if (val) {
          getTableData();
        }
      }
    );

    watch(
      () => [data.platformName, data.siteName],
      val => {
        if (val[0] && val[1]) {
          api.product
            .getPlatformCategoryByPlatformIdAndSiteId({
              platformId: val[0],
              siteId: val[1],
              chineseCategoryName: "",
              englishCategoryName: "",
            })
            .then(res => {
              data.categoryList = res.data;
            });
        }
      }
    );
    watch(
      () => data.currentEdit,
      val => {
        if (val) {
          api.product
            .getPlatformCategoryByPlatformIdAndSiteId({
              platformId: val.platformId,
              siteId: val.siteId,
              chineseCategoryName: "",
              englishCategoryName: "",
            })
            .then(res => {
              data.categoryList = res.data;
            });
        }
      },
      { deep: true }
    );

    watch(
      () => props.isDisable,
      val => {
        console.log("val----------", val);
        if (val) {
          nextTick(() => {});
        }
      },
      { deep: true }
    );
    watch(
      () => props.isClickLeftNode,
      val => {
        console.log("val----------", val);
        if (val) {
          nextTick(() => {
            data.chinesePlatformCategoryName = "";
            data.englishPlatformCategoryName = "";
            data.platformName = "";
            data.siteName = "";
            data.currentEdit = null;
          });
        }
      },
      { deep: true }
    );

    return {
      ...refData,
      eidtTable,
      saveTable,
      update,
      importTable,
      exportTable,
      platChange,
      remove,
      dateLog,
      getAllPlatform,
      allPlatform,
      handleSelectEnglish,
      handleSelectChinese,
      fetchPlatformCategoryName,
      sureAdd,
      fetchEditPlatformCategoryName,
      buttonAuthor,
      getTableData,
    };
  },
};
</script>
<style scoped lang="scss">
#CategoryComparisonRight {
  .table-header {
    background-color: #fff !important;
  }
  .tableForm {
    padding-left: 10px;
  }
  .tabs-widthClass {
    border: none;
  }
  .boxs {
    width: 12%;
    height: 34px;
    box-sizing: border-box;
    min-width: 200px;
    margin-bottom: 33px;
    padding-bottom: 3px;
    padding-top: 2px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e9e9e9;
  }
  :deep(.el-form-item) {
    margin-bottom: 0px;
  }

  .el-table_1_column_3 {
    border-bottom: 1px solid #f5f7fa;
  }
}
.name {
  width: 90px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
:deep(.el-autocomplete-suggestion__wrap) {
  min-width: 226px;
}
.table-header {
  background-color: #fff;
  justify-content: space-between;
  align-items: center;
}
.font {
  font-size: 14px;
  color: #409eff;
  font-weight: bold;
}
</style>
