<template>
  <div class="table-box" ref="CombinationProductTable">
    <div class="table-header">
      <el-button size="mini" type="primary" @click="batchCombinationExport" v-if="buttonAuthor.export">批量导出</el-button>
      <el-button size="mini" type="primary" @click="batchCombinationImport" v-if="buttonAuthor.import">批量导入</el-button>
      <el-button size="mini" type="primary" @click="batchCombination('add')" v-if="buttonAuthor.add">添加组合</el-button>
      <el-button size="mini" type="primary" @click="unGroup('batch')" v-if="buttonAuthor.brachRemove">批量解除组合</el-button>
      
    </div>
    <AllDownDialog ref="AllDownDialog"></AllDownDialog>
    <el-table
      :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
      :data="tableData"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
      element-loading-text="加载中"
      v-loading="tableLoading"
      style="overflow-y:auto;"
      border
    >
      <el-table-column type="selection" align="center" min-width="40"></el-table-column>
      <el-table-column type="index" align="center" label="#" min-width="60"></el-table-column>
      <el-table-column prop="groupSku" label="组合SKU" show-overflow-tooltip></el-table-column>
      <el-table-column prop="groupName" label="组合名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="groupProSkuList" label="组合产品SKU" show-overflow-tooltip>
        <template #default="scope">
          {{ computedGroupSku(scope.row.groupProSkuList) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateUser" label="操作人" show-overflow-tooltip>
        <template #default="scope">
          {{scope.row.updateUser?scope.row.updateUser:"-" }}
        </template>
      </el-table-column>
      <el-table-column prop="groupProSkuList" label="操作时间" show-overflow-tooltip>
        <template #default="scope">
          <div>创建时间：{{scope.row.createTime?scope.row.createTime:"-"}}</div>
          <div>更新时间：{{scope.row.updateTime?scope.row.updateTime:"-"}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="table-operation" width="250" label="操作">
        <template #default="scope">
          <el-button size="mini" icon="el-icon-edit" type="text" @click="batchCombination('edit', scope.row)" v-if="buttonAuthor.edit">编辑</el-button>
          <el-button size="mini" icon="el-icon-remove-outline" type="text" v-loading="loading " @click="unGroup('one', scope.row)" v-if="buttonAuthor.remove">解除组合</el-button>
          <el-button size="mini" icon="el-icon-notebook-2" type="text"  @click="handleLog(scope.row.id)" v-if="buttonAuthor.log">日志</el-button>
        </template>
      </el-table-column>
    </el-table>
    <CombinationEditPop ref="CombinationEditPop"></CombinationEditPop>

    <!-- 日志dialog -->
    <CombinationProductLog ref="CombinationProductLog"></CombinationProductLog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, computed, nextTick, inject } from "vue";
import authorButtons from "@/compositionApi/authorButtons";
import tablePage from "@/compositionApi/tablePage";
import CombinationEditPop from "./CombinationEditPop.vue";
import { download } from "@/utils/util.js";
import CombinationProductLog from './CombinationProductLog.vue'
export default {
  name: "CombinationProductTable",
  props: ["tableData", "searchMsg","tableLoading"],
  components: { CombinationEditPop,CombinationProductLog},
  setup(prop, ctx) {
    const { downloadTemplate } = tablePage();
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      // 组合产品列表
      combinationData: {
        groupName: "",
        groupProSkuList: [],
        isSoldSeparately: false
      },
      // 多选列表
      choiceList: [],
      // 是否新增
      isCombination: "add",
      loading:false
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const getTableData = inject("getTableData");
    const api = vue.$http;
    onMounted(() => {
      // if (buttonAuthor.dataDetails) {
        getTableData();
      // }
    });

    // 查看日志
    const handleLog = (id) => {
      vue.$refs.CombinationProductLog.checkLogDialog(id);
    };
    // 批量导出
    const batchCombinationExport = () => {
      let info = vue.searchMsg ? vue.searchMsg : {};
      let groupIds = [];
      for (let item of data.choiceList) {
        groupIds.push(item.id);
      }
      info.groupIds = groupIds;

      api.product.exportGroupProduct(info).then(res => {
        let tempName = "组合产品信息";
        let fileType = ".xlsx";
        const blob = new Blob([res], {
          type: "application/vnd.ms-excel;charset=UTF-8"
        });
        if ("msSaveOrOpenBlob" in navigator) {
          window.navigator.msSaveOrOpenBlob(blob, tempName + fileType);
          return;
        }
        const blobUrl = window.URL.createObjectURL(blob);
        download(blobUrl, tempName, fileType);
      });

      // downloadTemplate("exportGroupProduct", "组合产品信息", info);
    };
    // 批量导入
    const batchCombinationImport = () => {
      let info = {
        title: "组合产品模板",
        temp: "exportCombinationTemplate",
        import: "importCombination",
        servers: "product"
      };
      nextTick(() => {
        vue.$refs.AllDownDialog.checkDialog(true, info);
      });
    };
    // 解除组合
    const unGroup = (text, row) => {
      if (text == "batch") {
        if (data.choiceList.length < 1) return vue.$message.warning("请至少选择一条组合信息！");
      }
      vue
        .$confirm("是否解除该产品组合？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          data.loading = true;
          let id = [];
          if (row) {
            id = [row.id];
          } else {
            data.choiceList.forEach(item => {
              id.push(item.id);
            });
          }
          api.product
            .deleteGroupProduct(id)
            .then(res => {
              data.loading = false;
              vue.$message.success("产品组合解除成功！");
              getTableData();
            })
            .catch(error => {
              data.loading = false;
            });
        });
    };
    // 计算表格显示组合产品SKU
    const computedGroupSku = computed(() => {
      return function(groupList) {
        return groupList
          .map(item => {
            return item.groupProSku + "(" + item.amount + ")";
          })
          .join(",");
      };
    });

    // 打开批量组合dialog
    const batchCombination = (text, row) => {
      vue.$refs.CombinationEditPop.getMsg(text, row);
    };

    // 批量选择
    const handleSelectionChange = rows => {
      data.choiceList = rows;
    };
    const refData = toRefs(data);
    return {
      ...refData,
      handleLog,
      batchCombinationImport,
      batchCombination,
      unGroup,
      computedGroupSku,
      downloadTemplate,
      buttonAuthor,
      batchCombinationExport,
      handleSelectionChange
    };
  }
};
</script>

<style></style>
