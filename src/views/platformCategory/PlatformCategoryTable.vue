<!--PlatformCategoryTable  平台类目管理表格-->
<template>
  <div id="PlatformCategoryTable">
    <vxe-toolbar ref="productFormHead" custom>
      <template #buttons>
        <div class="table-box">
          <div class="table-header">
            <div class="font">
            <div>不通过: {{ failCount }}</div>
            <div>通过：{{ passCount }}</div>
            <div>待审核：{{ waitingAuditCount }}</div>
            </div>
            <div>
              <el-button
                type="primary"
                size="mini"
                v-if="buttonAuthor.add"
                @click="handleProduct('add')"
                >新增</el-button
              >
              <el-button
                type="primary"
                size="mini"
                v-if="buttonAuthor.totalDelete"
                @click="handleDelete"
                >批量删除</el-button
              >
              <el-button
                type="primary"
                size="mini"
                v-if="buttonAuthor.totalAudit"
                @click="allAudit(auditList, 2)"
                >批量审核</el-button
              >
              <el-button
                type="primary"
                size="mini"
                v-if="buttonAuthor.update"
                @click="update"
                >更新</el-button
              >
              <el-button
                type="primary"
                size="mini"
                v-if="buttonAuthor.import"
                @click="bulkImport"
                >导入</el-button
              >
              <el-button
                type="primary"
                size="mini"
                v-if="buttonAuthor.batchUpload"
                @click="batchExport"
                >导出</el-button
              >
            </div>
          </div>
        </div>
      </template>
    </vxe-toolbar>
    <div class="table">
      <!-- :tree-config="{ lazy: true, rowField: 'id', parentField: 'parentId', hasChild: 'hasChildren', loadMethod: loadChildrenMethod }" -->
      <vxe-table
        :column-config="{ resizable: true }"
        :row-config="{ keyField: 'id' }"
        :tooltip-config="{ showAll: true, contentMethod }"
        :data="tableData"
        :height="tableHeight"
        :checkbox-config="{
          labelField: 'id',
          highlight: true,
          reserve: false,
          transform: true,
        }"
        @checkbox-all="selectChangeEventAll"
        @checkbox-change="selectChangeEvent"
        ref="productFormRef"
        border
        v-loading="tableLoading"
        :row-style="{ height: '20px' }"
        :cell-style="{ padding: '0px' }"
      >
        <vxe-column type="checkbox" align="center" width="80">
          <template></template>
        </vxe-column>
        <vxe-column
          field="name"
          prop="englishCategory"
          width="220"
          title="平台类目"
          align="center"
        >
          <template #default="scope">
            <div>
              <!-- style="width: 190px" -->
              <div class="spanStyle">
                {{
                  scope.row.englishCategory ? scope.row.englishCategory : "-"
                }}
                <!-- <span class="tag">{{ scope.row.categoryLevel }}</span> -->
              </div>
            </div>
          </template>
        </vxe-column>
        <vxe-column
          field="chineseCategory"
          prop="chineseCategory"
          align="center"
          title="平台中文类目"
        >
          <template #default="scope">
            <div class="spanStyle">
              <span>{{
                scope.row.chineseCategory ? scope.row.chineseCategory : "-"
              }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column
          field="platformName"
          prop="platformName"
          title="所属平台"
          align="center"
          show-overflow
        >
          <template #default="scope">
            <span>{{
              scope.row.platformName ? scope.row.platformName : "-"
            }}</span>
          </template>
        </vxe-column>
        <vxe-column
          field="siteName"
          prop="siteName"
          title="所属站点"
          align="center"
          show-overflow
        >
          <template #default="scope">
            <span>{{ scope.row.siteName ? scope.row.siteName : "-" }}</span>
          </template>
        </vxe-column>
        <vxe-column
          field="commission"
          prop="commission"
          title="佣金(%)"
          align="center"
          show-overflow
        >
          <template #default="scope">
            <span>{{
              scope.row.commission && scope.row.commission != -1
                ? scope.row.commission
                : "0.00"
            }}</span>
          </template>
        </vxe-column>
        <vxe-column
          field="state"
          prop="state"
          title="类目状态"
          width="80"
          align="center"
          show-overflow
        >
          <template #default="scope">
            <span>{{
              tableTypeComputed(platform_category_state, scope.row.state)
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
        <vxe-column
          field="auditUserName"
          title="操作人"
          width="120"
          show-overflow
        >
          <template #default="scope">
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
          </template>
        </vxe-column>
        <vxe-column field="auditTime" title="时间" width="170" show-overflow>
          <template #default="scope">
            <span
              >录入：{{
                scope.row.createTime ? scope.row.createTime : "-"
              }}&emsp;</span
            >
            <span
              >更新：{{
                scope.row.updateTime ? scope.row.updateTime : "-"
              }}&emsp;</span
            >
            <span
              >审核：{{ scope.row.auditTime ? scope.row.auditTime : "-" }}</span
            >
          </template>
        </vxe-column>
        <vxe-column
          field="operation"
          align="center"
          width="220"
          class-name="table-operation"
          title="操作"
        >
          <template #default="scope">
            <el-button
              v-if="scope.row.state == 3 && buttonAuthor.audit"
              size="mini"
              icon="el-icon-edit"
              type="text"
              @click="audit(scope.row.id, 2)"
              >审核</el-button
            >
            <el-button
              v-if="buttonAuthor.edit && scope.row.state != 3"
              size="mini"
              icon="el-icon-edit"
              type="text"
              @click="handleProduct('edit', scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="buttonAuthor.delete"
              size="mini"
              icon="el-icon-delete"
              type="text"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
            <el-button
              size="mini"
              icon="el-icon-tickets"
              type="text"
              v-if="buttonAuthor.log"
              @click="operationLog(scope.row.id)"
              >日志</el-button
            >
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <PlatformCategoryLog ref="PlatformCategoryLog"></PlatformCategoryLog>
    <!-- 日志 -->
    <PlatformCateLog ref="PlatformCateLog"></PlatformCateLog>
    <!-- 审核 -->
    <CategoryReview ref="CategoryReview"></CategoryReview>
    <!-- 导入 -->
    <AllDownDialog
      :title="AllDownDialogTitle"
      ref="AllDownDialog"
    ></AllDownDialog>
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
  onBeforeUnmount,
  computed,
  inject,
} from "vue";
import PlatformCategoryLog from "./PlatformCategoryLog.vue";
import CategoryReview from "@/components/product/systemCategory/CategoryReview.vue";
import PlatformCateLog from "@/components/product/PlatformCategory/PlatformCateLog.vue";
import { localGet, download } from "@/utils/util";
import authorButtons from "@/compositionApi/authorButtons";
import { useTableHeight } from "@/compositionApi/useTableHeight.js";

export default {
  name: "PlatformCategoryTable",
  props: [
    "tableData",
    "tableLoading",
    "searchMsg",
    "passCount",
    "failCount",
    "waitingAuditCount",
  ],
  components: { PlatformCategoryLog, PlatformCateLog, CategoryReview },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const productFormRef = ref(null);
    const productFormHead = ref(null);
    const { tableHeight } = useTableHeight(270);
    const data = reactive({
      sendLoading: false,
      popoverFlag: false, //提示弹窗
      platform_category_state: [], //状态
      choiceList: [],
      auditList: [],
      auditInstructions: "",
      popper: {},
      AllDownDialogTitle: "导入",
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      window.addEventListener("scroll", handleScroll, true);
      getDictList();
    });
    onBeforeUnmount(() => {
      window.removeEventListener("scroll", handleScroll, true);
    });
    const getTableData = inject("getTableData");

    const getDictList = () => {
      data.platform_category_state = localGet("dictCodeList")
        .platform_category_state
        ? localGet("dictCodeList").platform_category_state
        : [];
      console.log(data.platform_category_state);
    };

    //审核单条
    const audit = (msg, type) => {
      let info = {
        msg: msg,
        type: type,
      };
      api.product
        .platformCategoryDetail({ platformCategoryId: msg })
        .then((res) => {
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
      if (data.choiceList.length < 1) {
        vue.$message.warning("未选择数据，请勾选！");
      } else if (data.auditList.length == 1) {
        let info = {
          msg: id,
          type: type,
        };
        api.product
          .platformCategoryDetail({ platformCategoryId: id[0] })
          .then((res) => {
            if (res.code == 200) {
              info.data = res.data;
              nextTick(() => {
                vue.$refs.CategoryReview.getMsg(info);
              });
            }
          });
      } else {
        let info = {
          msg: id,
          type: type,
        };
        vue.$refs.CategoryReview.getMsg(info);
      }
    };

    const refData = toRefs(data);

    // 批量选择
    // const handleSelectionChange = row => {
    //   // console.log(vue.$refs.productFormRef);
    //   data.choiceList = row.map(i => {
    //     return i.id;
    //   });
    //   console.log(data.choiceList);
    // };

    const selectChangeEventAll = ({ $table }) => {
      const records = $table.getCheckboxRecords();
      // console.info(`勾选${records.length}个树形节点`, records);
      data.choiceList = records.map((i) => {
        return i.id;
      });
      data.auditList = records.map((i) => {
        return i.id;
      });
      console.log(data.choiceList);
    };

    const clear = () => {
      vue.$refs.productFormRef.clearCheckboxRow();
    };

    const selectChangeEvent = ({ checked, $table, row }) => {
      const records = $table.getCheckboxRecords();
      //导出，分配负责人数组
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
      console.log(data.auditList);
    };

    //监听弹窗页面滚动关闭打开的popover 组件
    const handleScroll = () => {
      if (vue.$refs.popover) {
        // console.log(11);
        nextTick(() => {
          vue.$refs.popover.hide();
          // console.log(vue.$refs.popover);
        });
      }
    };

    // 打开批量导入dialog
    const bulkImport = () => {
      let info = {
        title: "平台类目模板",
        temp: "pcBatchImportTemplate",
        import: "pcBatchImport",
        servers: "product",
      };
      data.AllDownDialogTitle = "导入";
      nextTick(() => {
        vue.$refs.AllDownDialog.checkDialog(true, info);
      });
    };

    const batchExport = () => {
      if (data.choiceList.length) {
        let info = { selectedData: data.choiceList };
        api.product.platformCategoryExport(info).then((res) => {
          let tempName = "平台类目";
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
        api.product.platformCategoryExport(vue.$props.searchMsg).then((res) => {
          let tempName = "平台类目";
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

    // 打开批量更新
    const update = () => {
      let info = {
        title: "平台类目更新模板",
        temp: "pcBatchUpdateTemplate",
        import: "pcBatchUpdate",
        servers: "product",
      };
      data.AllDownDialogTitle = "更新";
      nextTick(() => {
        vue.$refs.AllDownDialog.checkDialog(true, info);
      });
    };

    //点击提示框，显示审核意见
    const showPopver = (row) => {
      console.log(vue.$refs.popover);
      // // 获取审核信息
      data.sendLoading = true;
      console.log(row);

      api.product
        .platformCategoryDetail({ platformCategoryId: row.id })
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

    // 删除品类
    const handleDelete = (row) => {
      let ids = [];
      if (row.id) {
        ids = [row.id];
      } else if (data.choiceList.length > 0) {
        ids = data.choiceList;
      }
      vue
        .$confirm(` `, {
          title: "提示",
          dangerouslyUseHTMLString: true,
          message:
            "<div style=margin-left:20px><b style=font-size:14px>类目删除后无法恢复,请谨慎操作!</b></div><div style=margin-left:20px>删除条件：无关联数据！若有请解除关系后删除！</div>",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          api.product.pcRemove(ids).then((res) => {
            if (res.code == 200) {
              console.log(res);
              vue.$message({
                type: "success",
                message: res.msg,
              });
              if (row.id) {
                removeRow(row);
              } else {
                vue.$props.tableData.forEach((item) => {
                  data.choiceList.forEach((i) => {
                    if (item.id == i) {
                      removeRow(item);
                    }
                  });
                });
              }
              // getTableData();
            } else {
              vue.$message({
                type: "warning",
                message: res.msg,
              });
            }
          });
        })
        .catch(() => {
          vue.$message({
            type: "info",
            message: "已取消修改",
          });
        });
    };

    //表格假删
    const removeRow = async (row) => {
      const $table = productFormRef.value;
      await $table.remove(row);
    };

    //日志
    const operationLog = (id) => {
      vue.$refs.PlatformCateLog.checkLogDialog(id);
    };

    // 编辑
    const handleProduct = (type, row) => {
      let msg = {
        type: type,
        row: row || "",
      };
      vue.$refs.PlatformCategoryLog.getMsg(msg);
    };

    //列表懒加载
    const loadChildrenMethod = ({ row }) => {
      let info = JSON.parse(JSON.stringify(prop.searchMsg));
      info.parentId = row.id;
      return new Promise((resolve) => {
        api.product
          .platformCategoryLazyList(info)
          .then((res) => {
            resolve(res.data.data);
          })
          .catch((error) => {});
      });
    };

    //tootip配置
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
    };

    nextTick(() => {
      // 将表格和工具栏进行关联
      const $table = productFormRef.value;
      const $toolbar = productFormHead.value;
      $table.connect($toolbar);
    });

    return {
      ...refData,
      handleDelete,
      handleProduct,
      // handleSelectionChange,
      operationLog,
      showPopver,
      handleScroll,
      audit,
      getDictList,
      tableTypeComputed,
      bulkImport,
      selectChangeEventAll,
      selectChangeEvent,
      batchExport,
      allAudit,
      update,
      buttonAuthor,
      productFormRef,
      productFormHead,
      contentMethod,
      loadChildrenMethod,
      clear,
      tableHeight,
    };
  },
};
</script>
<style scoped lang="scss">
#PlatformCategoryTable {
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
    align-items: center;
    justify-content: space-between;
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
  // :deep(.col_19) {
  //   text-align: left !important;
  // }
  :deep(.vxe-tree-cell) {
    padding-left: 7px;
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
    width: 14px;
    line-height: 14px;
    border: 1px solid;
    display: inline-block;
    text-align: center;
    border-radius: 50%;
    background-color: #ecf5ff;
    color: #409eff;
    position: absolute;
    right: 4px;
    top: 15px;
  }
}
</style>
<style lang="scss"></style>
