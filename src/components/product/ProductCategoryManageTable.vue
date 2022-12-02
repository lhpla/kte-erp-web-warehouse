<!--ProductCategoryManageTable  产品品类管理表格  -->
<template>
  <div id="ProductCategoryManageTable">
    <vxe-toolbar ref="productFormHead" custom>
      <template #buttons>
        <div class="table-header">
          <div class="font">
            <div style="font-weight: bold">
              类目数量：{{ count ? count : "-" }}
            </div>
            <div>不通过: {{ failCount }}</div>
            <div>通过：{{ passCount }}</div>
            <div>待审核：{{ waitingAuditCount }}</div>
          </div>
          <div>
            <el-button
              type="primary"
              v-if="buttonAuthor.batchDisable && personnel == 1"
              size="mini"
              @click="handleStateAll(1)"
              >批量禁用</el-button
            >
            <el-button
              type="primary"
              v-if="buttonAuthor.batchActiion && personnel == 1"
              size="mini"
              @click="handleStateAll(0)"
              >批量启用</el-button
            >
            <el-button
              type="primary"
              v-if="buttonAuthor.batchDelete"
              size="mini"
              @click="handleDelete"
              >批量删除</el-button
            >

            <el-button
              type="primary"
              v-if="buttonAuthor.add"
              size="mini"
              @click="handleProduct('add')"
              >新增品类</el-button
            >
            <el-button
              type="primary"
              v-if="buttonAuthor.batchAudit"
              size="mini"
              @click="allAudit(auditList, 1)"
              >批量审核</el-button
            >
            <el-dropdown v-if="buttonAuthor.leadImport" style="margin:0 10px;">
              <el-button type="primary" size="mini">
                导入负责人
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="importCharge('1')" v-if="buttonAuthor.leadImport">开发负责人导入</el-dropdown-item>
                  <el-dropdown-item @click="importCharge('2')" v-if="buttonAuthor.leadImport">采购负责人导入</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button
              type="primary"
              v-if="buttonAuthor.distribution"
              size="mini"
              @click="distribution"
              >分配负责人</el-button
            >
            <el-button
              type="primary"
              v-if="buttonAuthor.update"
              size="mini"
              @click="update"
              >更新</el-button
            >
            <el-button
              type="primary"
              v-if="buttonAuthor.import"
              size="mini"
              @click="ClassificationImport"
              >导入</el-button
            >
            <el-button
              type="primary"
              v-if="buttonAuthor.batchUpload"
              size="mini"
              @click="batchExport"
              >导出</el-button
            >
            <!-- <el-button type="primary" v-if="buttonAuthor.batchUpload" size="mini">自定义字段</el-button> -->
          </div>
        </div>
      </template>
    </vxe-toolbar>
    <vxe-table
      :column-config="{ resizable: true }"
      :row-config="{ keyField: 'id', isHover: true }"
      :tree-config="{
        lazy: true,
        rowField: 'id',
        parentField: 'parentId',
        hasChild: 'hasChildren',
        loadMethod: loadChildrenMethod,
        reserve: true,
      }"
      :tooltip-config="{ showAll: true, contentMethod }"
      :data="tableData"
      :custom-config="tableCustom"
      :checkbox-config="{
        transform: true,
        labelField: 'id',
        highlight: true,
        reserve: false,
      }"
      @checkbox-all="selectChangeEventAll"
      @checkbox-change="selectChangeEvent"
      border
      id="productFormTable"
      ref="productFormRef"
      v-loading="tableLoading"
      :row-style="{ height: '20px' }"
      :cell-style="{ padding: '0px' }"
    >
      <!-- <vxe-column type="seq" width="60"></vxe-column> -->
      <vxe-column type="checkbox" title="品类中文名称" min-width="315" tree-node>
        <template #default="scope">
          <el-tooltip :content="scope.row.parentCName" placement="top">
            <div>
              <div class="spanStyle" style="width: 180px">
                {{ scope.row.name ? scope.row.name : "-" }}
                <span class="tag">{{ scope.row.categoryLevel }}</span>
              </div>
            </div>
          </el-tooltip>
        </template>
      </vxe-column>
      <vxe-column
        field="englishName"
        title="品类英文名称"
        min-width="100"
        align="center"
        show-overflow
      >
        <template #default="scope">
          <el-tooltip :content="scope.row.parentEName" placement="top">
            <span class="spanStyle">{{
              scope.row.englishName ? scope.row.englishName : "-"
            }}</span>
          </el-tooltip>
        </template>
      </vxe-column>
      <vxe-column field="encode" title="编码" align="center" show-overflow>
        <template #default="scope">
          <span>{{ scope.row.encode ? scope.row.encode : "-" }}</span>
        </template>
      </vxe-column>
      <vxe-column field="acronym" title="缩写" align="center" show-overflow>
        <template #default="scope">
          <span class="spanStyle">{{
            scope.row.acronym ? scope.row.acronym : "-"
          }}</span>
        </template>
      </vxe-column>
      <vxe-column field="isDisable" title="启用" align="center" show-overflow sortable v-if="buttonAuthor.activation">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isDisable"
            :disabled="scope.row.state != 1 || personnel != 1"
            :active-value="0"
            :inactive-value="1"
            @click="handleState(scope.row)"
          ></el-switch>
        </template>
      </vxe-column>
      <vxe-column
        field="state"
        title="品类状态"
        align="center"
        width="80"
        show-overflow
      >
        <template #default="scope">
          <span>{{
            scope.row.state != -1
              ? tableTypeComputed(platform_category_state, scope.row.state)
              : "-"
          }}</span>
          <el-popover
            v-if="scope.row.state != 3 && scope.row.state != -1"
            ref="popover"
            popper-class="PlatformCategoryTable"
            placement="right-start"
            :width="420"
            trigger="click"
            @show="showPopver(scope.row)"
          >
            <template #reference>
              <el-button class="tipInfo" @click="tooltipFlag = !tooltipFlag"
                ><i
                  class="el-icon-question"
                  style="color: #409eff; font-size: 17px"
                ></i
              ></el-button>
            </template>
            <div v-loading="sendLoading" class="auditInstructions">
              {{ auditInstructions != "" ? auditInstructions : "暂无意见" }}
            </div>
          </el-popover>
        </template>
      </vxe-column>
      <vxe-column field="responsibleName" title="负责人" show-overflow>
        <template #default="scope">
          <span class="spanStyle"
            >开发：{{
              scope.row.responsibleName ? scope.row.responsibleName : "-"
            }}</span
          >
          <br>
          <span class="spanStyle"
            >采购：{{
              scope.row.purchaseResponsibleName ? scope.row.purchaseResponsibleName : "-"
            }}</span
          >
        </template>
      </vxe-column>
      <vxe-column
        field="auditUserName"
        min-width="120"
        show-overflow
        title="操作人"
      >
        <template #default="scope">
          <div class="spanStyle">
            <span
              >录入人：{{
                scope.row.createUserName ? scope.row.createUserName : "-"
              }}&emsp;</span
            >
            <span
              >提交人：{{
                scope.row.updateUserName ? scope.row.updateUserName : "-"
              }}&emsp;</span
            >
            <span
              >审核人：{{
                scope.row.auditUserName ? scope.row.auditUserName : "-"
              }}</span
            >
          </div>
        </template>
      </vxe-column>
      <vxe-column field="auditTime" title="时间" width="160" show-overflow>
        <template #default="scope">
          <div class="spanStyle">
            <span
              >录入：{{
                scope.row.createTime ? scope.row.createTime : "-"
              }}
              &emsp;</span
            >
            <span
              >更新：{{
                scope.row.updateTime ? scope.row.updateTime : "-"
              }}
              &emsp;</span
            >
            <span
              >审核：{{ scope.row.auditTime ? scope.row.auditTime : "-" }}</span
            >
          </div>
        </template>
      </vxe-column>
      <vxe-column
        field="operation"
        align="center"
        class-name="table-operation"
        width="220"
        title="操作"
      >
        <template #default="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="text"
            @click="audit(scope.row.id, 1)"
            v-if="buttonAuthor.audit && scope.row.state == 3"
            >审核</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="text"
            @click="handleProduct('edit', scope.row)"
            v-if="buttonAuthor.edit && scope.row.state != 3"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            status="primary"
            type="text"
            @click="handleDelete(scope.row)"
            v-if="buttonAuthor.delete"
            >删除</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-notebook-2"
            type="text"
            @click="operationLog(scope.row.id)"
            v-if="buttonAuthor.log"
            >日志</el-button
          >
        </template>
      </vxe-column>
    </vxe-table>
    <DetailDialog
      ref="DetailDialog"
      :id="productForm.id"
      :isProduct="isProduct"
      :searchMsg="searchMsg"
    ></DetailDialog>
    <!-- 分类导入 -->
    <AllDownDialog
      :title="AllDownDialogTitle"
      ref="AllDownDialog"
    ></AllDownDialog>
    <!-- 审核 -->
    <CategoryReview ref="CategoryReview" :searchMsg="searchMsg"></CategoryReview>
    <!-- 日志 -->
    <CategoryManageLog ref="CategoryManageLog"></CategoryManageLog>
    <!-- 分配负责人 -->
    <DistributionOfficer ref="DistributionOfficer"></DistributionOfficer>
    <ChargeDownDialog  :title="AllDownDialogTitle"
      ref="ChargeDownDialog"></ChargeDownDialog>
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
  nextTick,
  computed,
} from "vue";
import authorButtons from "@/compositionApi/authorButtons";
import DetailDialog from "../../components/system/productCategoryManage/DetailDialog.vue";
import CategoryReview from "@/components/product/systemCategory/CategoryReview.vue";
import CategoryManageLog from "@/components/product/systemCategory/CategoryManageLog.vue";
import DistributionOfficer from "@/components/product/systemCategory/DistributionOfficer.vue";
import { localGet, download } from "@/utils/util";
import ChargeDownDialog from "../allDownDialog/ChargeDownDialog.vue";

export default {
  name: "ProductCategoryManageTable",
  props: [
    "tableData",
    "tableLoading",
    "searchMsg",
    "count",
    "passCount",
    "failCount",
    "waitingAuditCount",
  ],
  components: {
    DetailDialog,
    CategoryReview,
    CategoryManageLog,
    DistributionOfficer,
    ChargeDownDialog
},
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const productFormRef = ref(null);
    const productFormHead = ref(null);
    const data = reactive({
      AllDownDialogTitle: "导入",
      productForm: {},
      selectedCascader: "",
      isProduct: "",
      tableLoading: false,
      sendLoading: false,
      choiceList: [],
      auditList: [],
      distributionList: [],
      idList: [],
      auditInstructions: "",
      selectList:[],
      platform_category_state: [], //状态
      rules: {
        name: [
          { required: true, message: "请输入品类中文名", trigger: "blur" },
        ],
        acronym: [
          { required: true, message: "请输入品类缩写", trigger: "blur" },
        ],
      },
      tableCustom: {
        storage: true,
        checkMethod({ column }) {
          if (column.property === "role") {
            return false;
          }
          return true;
        },
      },
      personnel: null,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      data.choiceList = [];
      getDictList();
    });
    const refData = toRefs(data);
    const getTableData = inject("getTableData");

    const getDictList = () => {
      data.platform_category_state = localGet("dictCodeList")
        .platform_category_state
        ? localGet("dictCodeList").platform_category_state
        : [];
      console.log(data.platform_category_state);
      api.product
        .categoryGetUserCategoryAuth()
        .then((res) => {
          console.log(res);
          data.personnel = res.data;
        })
        .catch((error) => {});
    };

    // 编辑
    const handleProduct = (type, row) => {
      // // 清空表单和校验信息
      // if (productFormRef.value) {
      //   productFormRef.value.clearValidate();
      //   productFormRef.value.resetFields();
      // }
      let msg = {
        type: type,
        row: row || "",
      };
      vue.$refs.DetailDialog.getMsg(msg);
    };

    const resizableChangeEvent = () => {
      const $table = xTable.value;
      const columns = $table.getColumns();
      const customData = columns.map((column) => {
        return {
          width: column.renderWidth,
        };
      });
      console.log(customData);
    };

    //列表懒加载
    const loadChildrenMethod = ({ row }) => {
      let info={};
      if (prop.searchMsg!=undefined) {
        info = JSON.parse(JSON.stringify(prop.searchMsg));
      }
      info.parentId = row.id;
      info.id = "";
      return new Promise((resolve) => {
        api.product
          .categoryLazyList(info)
          .then((res) => {
            console.log(res.data);
            resolve(res.data.data);
          })
          .catch((error) => {});
      });
    };

    // 打开批量更新
    const update = () => {
      let info = {
        title: "系统品类更新模板",
        temp: "categoryBatchUpdateTemplate",
        import: "categoryBatchUpdate",
        servers: "product",
      };
      data.AllDownDialogTitle = "更新";
      nextTick(() => {
        vue.$refs.AllDownDialog.checkDialog(true, info);
      });
    };

    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (list, dizKey) {
        if (list.length > 1 && dizKey !== -1) {
          for (const item of list) {
            if (dizKey == item.dizKey) {
              return item.value;
            }
          }
        }
      };
    });

    // 清除选择项
    const clear = () => {
      vue.$refs.productFormRef.clearCheckboxRow();
    };

    //点击提示框，显示审核意见
    const showPopver = (row) => {
      console.log(vue.$refs.popover);
      // // 获取审核信息
      data.sendLoading = true;
      console.log(row);

      api.product
        .categoryDetailInfo({ categoryId: row.id })
        .then((res) => {
          if (res.code == 200) {
            data.auditInstructions = res.data.auditInstructions;
            data.sendLoading = false;
          } else {
            vue.$message.warning(res.msg);
            data.sendLoading = false;
          }
        })
        .catch((err) => {
          data.sendLoading = false;
        });
    };

    //审核单条
    const audit = (id, type) => {
      let info = {
        msg: id,
        type: type,
      };
      api.product.categoryDetail({ categoryId: id }).then((res) => {
        if (res.code == 200) {
          info.data = res.data;
          nextTick(() => {
            vue.$refs.CategoryReview.getMsg(info);
          });
        }
      });
    };

    // 批量审核
    const allAudit = (id, type) => {
      console.log(id,"id");
      if (data.choiceList.length < 1) {
        vue.$message.warning("未选择数据，请勾选！");
      } else if (data.auditList.length ) {
        if (data.auditList.length==1) {
          let info = {
            msg: id,
            type: type,
          };
          api.product.categoryDetail({ categoryId: id[0] }).then((res) => {
            if (res.code == 200) {
              info.data = res.data;
              nextTick(() => {
                vue.$refs.CategoryReview.getMsg(info);
              });
            }
          });
        }else{
          let info = {
            msg: id,
            type: type,
          };
          vue.$refs.CategoryReview.getMsg(info);
        }
      } else {
        vue.$message.warning("选择数据不能审核!");
      }
    };

    //日志
    const operationLog = (id) => {
      vue.$refs.CategoryManageLog.checkLogDialog(id);
    };

    // 切换品类状态
    const handleState = (productInfo) => {
      if (productInfo.state != 1 || data.personnel != 1) {
        return;
      } else {
        let info = {
          ids: [productInfo.id],
          isDisable: productInfo.isDisable,
        };

        vue
          .$confirm(
            `是否${productInfo.isDisable == 1 ? "禁用" : "启用"}此品类？`,
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
          .then(() => {
            data.tableLoading = true;
            api.product
              .categoryDisableById(info)
              .then((res) => {
                console.log(res);
                data.tableLoading = false;
                vue.$message.success("品类状态更新成功！");
                getTableData(data.parentId, false);
              })
              .catch((error) => {
                data.tableLoading = false;
                getTableData(data.parentId, false);
              });
          })
          .catch(() => {
            productInfo.isDisable == 0
              ? (productInfo.isDisable = 1)
              : (productInfo.isDisable = 0);
          });
      }
    };

    //批量启用禁用
    const handleStateAll = (type) => {
      if (data.choiceList.length < 1) {
        vue.$message.warning("未选择数据");
      } else {
        if (type == 1) {
          let info = {
            ids: data.choiceList,
            isDisable: type,
          };
          vue
            .$confirm(`是否开启品类禁用？`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
            .then(() => {
              data.tableLoading = true;
              api.product
                .categoryDisableById(info)
                .then((res) => {
                  if (res.code == 200) {
                    vue.$message.success(res.msg);
                    getTableData(data.parentId, true);
                  } else {
                    vue.$message.warning(res.msg);
                    data.tableLoading = false;
                  }
                })
                .catch((error) => {
                  data.tableLoading = false;
                });
            })
            .catch(() => {
              productInfo.isDisable == 0
                ? (productInfo.isDisable = 1)
                : (productInfo.isDisable = 0);
            });
        } else {
          let info = {
            ids: data.choiceList,
            isDisable: type,
          };
          vue
            .$confirm(`是否开启品类启用？`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
            .then(() => {
              data.tableLoading = true;
              api.product
                .categoryDisableById(info)
                .then((res) => {
                  if (res.code == 200) {
                    data.tableLoading = false;
                    vue.$message.success(res.msg);
                    getTableData(data.parentId, true);
                  } else {
                    vue.$message.warning(res.msg);
                    data.tableLoading = false;
                  }
                })
                .catch((error) => {
                  data.tableLoading = false;
                  getTableData(data.parentId, true);
                });
            })
            .catch(() => {
              productInfo.isDisable == 0
                ? (productInfo.isDisable = 1)
                : (productInfo.isDisable = 0);
            });
        }
      }
    };

    const contentMethod = ({ row, columnIndex, rowIndex, type, column }) => {
      if (type == "header") {
        return "";
      }
      if (column.title == "操作") {
        return "";
      }
      if (columnIndex == 0) {
        return "";
      }
      if (columnIndex == 1) {
        return "";
      }
    };

    const batchExport = () => {
      if (data.choiceList.length) {
        let info = { selectedData: data.choiceList };
        api.product.categoryExport(info).then((res) => {
          let tempName = "系统品类";
          let fileType = ".xlsx";
          const blob = new Blob([res], {
            type: "application/vnd.ms-excel;charset=UTF-8",
          });
          if ("msSaveOrOpenBlob" in navigator) {
            window.navigator.msSaveOrOpenBlob(blob, tempName + fileType);
            return;
          }
          const blobUrl = window.URL.createObjectURL(blob);
          download(blobUrl, tempName, fileType);
        });
      } else {
        api.product.categoryExport(vue.$props.searchMsg).then((res) => {
          let tempName = "系统品类";
          let fileType = ".xlsx";
          const blob = new Blob([res], {
            type: "application/vnd.ms-excel;charset=UTF-8",
          });
          if ("msSaveOrOpenBlob" in navigator) {
            window.navigator.msSaveOrOpenBlob(blob, tempName + fileType);
            return;
          }
          const blobUrl = window.URL.createObjectURL(blob);
          download(blobUrl, tempName, fileType);
        });
      }
    };

    //分类导入
    const ClassificationImport = () => {
      let info = {
        title: "系统品类导入模板",
        temp: "categoryBatchImportTemplate",
        import: "categoryBatchImport",
        servers: "product",
      };
      data.AllDownDialogTitle = "导入";
      nextTick(() => {
        vue.$refs.AllDownDialog.checkDialog(true, info);
      });
    };

    //导入负责人
    const importCharge = (num) => {
      let tempTitle="";
      if (num==1) {
        tempTitle="开发负责人导入"
      }
      if (num==2) {
        tempTitle="采购负责人导入"
      }
      let info = {
        title: tempTitle+"模板",
        temp: "importManagerTemplate",
        import: "importManager",
        servers: "product",
        istype:"2",
        excelType:num
      };
      data.AllDownDialogTitle = tempTitle;
      nextTick(() => {
        vue.$refs.ChargeDownDialog.checkDialog(true, info);
      });
    } 

    const all = (selection) => {
      console.log(selection);
      nextTick(() => {
        selection.forEach((item) => {
          vue.$refs.productFormRef.toggleRowSelection(item, true);
          if (item.children && item.children.length > 0) {
            item.children.forEach((item1) => {
              vue.$refs.productFormRef.toggleRowSelection(item1, true);
            });
            if (item1.children && item1.children.length > 0) {
              item22.children.forEach((item1) => {
                vue.$refs.productFormRef.toggleRowSelection(item2, true);
              });
            }
          }
        });
      });
      // console.log(vue.$refs.productFormRef);
    };

    //分配负责人
    const distribution = () => {
      if (data.selectList.length < 1) {
        vue.$message.warning("未选择数据，请勾选！");
      } else {
        vue.$refs.DistributionOfficer.getMsg(data.selectList, prop.tableData);
      }
    };

    // 删除品类
    const handleDelete = (row) => {
      let ids = {
        // ids: row.id || ,
      };
      if (row.id) {
        ids.ids = row.id;
      } else if (data.choiceList.length > 0) {
        ids.ids = data.choiceList.join(",");
      }
      vue
        .$confirm(` `, {
          title: "提示",
          dangerouslyUseHTMLString: true,
          message:
            "<div style=margin-left:20px><b style=font-size:14px>品类删除后无法恢复 请谨慎操作!</b></div><div style=margin-left:20px>删除条件：无关联数据！若有请解除关系后删除！</div>",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          if (!ids.ids) {
            vue.$message.warning("未选择数据");
          } else {
            api.product.categoryRemove(ids).then((res) => {
              console.log(res);
              if (res.code == 200) {
                vue.$message({
                  type: "success",
                  message: res.msg,
                });
                getTableData();
                // removeRow(row);
              } else {
                vue.$message({
                  type: "warning",
                  message: res.msg,
                });
              }
            });
          }
        });
    };

    //表格假删
    const removeRow = async (row) => {
      const $table = productFormRef.value;
      if (row.categoryLevel == 1) {
        await $table.remove(row);
      } else if (row.categoryLevel == 2 || row.categoryLevel == 3) {
        const trs = Array.from(
          document.getElementsByClassName("vxe-body--row")
        );
        const item = trs.find((item) => item.getAttribute("rowid") === row.id);
        item.style.display = "none";
      }
    };

    // //表格假删
    // const removeRow = row => {
    //   const trs = Array.from(document.getElementsByClassName("vxe-body--row"));
    //   const item = trs.find(item => item.getAttribute("rowid") === row.id);
    //   item.style.display = "none";
    // };

    const selectChangeEventAll = ({ checked, $table }) => {
      const records = $table.getCheckboxRecords();
      data.selectList=records;
      data.choiceList = records.map((i) => {
        return i.id;
      });

      data.auditList = records.map((i) => {
        return i.id;
      });

      // console.info(`勾选${records.length}个树形节点`, records);
      // data.choiceList = records.map(i => {
      //   return i.id;
      // });
      // if (checked) {
      //   records.map(i => {
      //     if (i.categoryLevel == 1) {
      //       data.choiceList.push(i.id);
      //     }
      //     return i.id;
      //   });
      // } else {
      //   data.choiceList = [];
      // }
    };

    const selectChangeEvent = ({ checked, $table, row }) => {
      const records = $table.getCheckboxRecords();
      data.selectList=records;
      //导出，分配负责人,改状态数组
      data.choiceList = records.map((i) => {
        return i.id;
      });

      //审核数组
      records.map((i) => {
        if (i.state == 3) {
          data.auditList.push(i.id);
        }
        data.auditList = Array.from(new Set(data.auditList));
      });
      if (!checked) {
        data.auditList = data.auditList.filter((item) => {
          return item != row.id;
        });
      }
      // console.log(data.auditList);
    };

    nextTick(() => {
      // 将表格和工具栏进行关联
      const $table = productFormRef.value;
      const $toolbar = productFormHead.value;
      $table.connect($toolbar);
    });

    return {
      ...refData,
      buttonAuthor,
      handleProduct,
      handleDelete,
      handleState,
      ClassificationImport,
      audit,
      operationLog,
      allAudit,
      all,
      selectChangeEventAll,
      selectChangeEvent,
      loadChildrenMethod,
      showPopver,
      tableTypeComputed,
      getDictList,
      update,
      distribution,
      batchExport,
      getTableData,
      productFormRef,
      productFormHead,
      resizableChangeEvent,
      contentMethod,
      removeRow,
      handleStateAll,
      clear,
      importCharge,
    };
  },
};
</script>
<style scoped lang="scss">
#ProductCategoryManageTable {
  // :deep(.vxe-table--body) {
  //   .col_10,
  //   .col_8,
  //   .col_9 {
  //     text-align: left;
  //   }
  // }
  .tipInfo {
    border: 0;
    padding: 0;
    min-height: 14px;
    :hover {
      background: #f5f7fa !important;
    }
  }
  .table-header {
    background-color: #fff;
    justify-content: space-between;
    align-items: center;
  }

  :deep(.vxe-custom--option) {
    height: 30px;
    line-height: 20px;
  }
  :deep(.vxe-custom--wrapper) {
    margin: 0 10px 0 0 !important;
  }
  :deep(.vxe-header--row .vxe-header--column) {
    text-align: center;
  }
  :deep(.col_4) {
    text-align: left !important;
  }
  :deep(.vxe-cell--checkbox) {
    display: flex;
  }
  .font {
    font-size: 14px;
    color: #409eff;
    display: flex;
    font-weight: bold;
    div {
      margin-right: 10px;
    }
  }
  .tag {
    width: 16px;
    line-height: 14px;
    border: 1px solid;
    display: inline-block;
    text-align: center;
    border-radius: 50%;
    background-color: #ecf5ff;
    color: #409eff;
    position: absolute;
    right: 0px;
    top: 0;
  }
}
</style>
