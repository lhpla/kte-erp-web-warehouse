<!-- 敏感词库表格 -->
<template>
  <div id="SensitiveWordLibraryTable">
    <div class="table-box">
      <div class="table-header">
        <el-button type="primary" size="mini" v-if="buttonAuthor.add" @click="sensitive('add')">新 增</el-button>
        <el-button type="primary" size="mini" v-if="buttonAuthor.batchDelete" @click="brachDel">批量删除</el-button>
        <el-button type="primary" size="mini" v-if="buttonAuthor.deleteLog" @click="delLog">删除日志</el-button>
      </div>
    </div>
    <LogDialog ref="logDialog"></LogDialog>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      style="width: 100%"
      :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column prop="keyword" label="关键词">
        <template #default="scope">
          <div>
            {{ scope.row.keyword }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="类型">
        <template #default="scope">
          <span v-if="scope.row.sensitiveType">{{ tableTypeComputed(sensitive_word_type, scope.row.sensitiveType) }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="风险等级">
        <template #default="scope">
          <span v-if="scope.row.riskLevel">{{ tableTypeComputed(sensitive_risk_level, scope.row.riskLevel) }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="inputerName" label="录入人"></el-table-column>
      <el-table-column prop="inputTime" label="录入时间"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="text" size="mini" v-if="buttonAuthor.edit" @click="sensitive('edit', scope.row)" icon="el-icon-edit">编辑</el-button>
          <el-button type="text" size="mini" v-if="buttonAuthor.delete" @click="delById(scope.row.id)" icon="el-icon-delete">删除</el-button>
          <el-button type="text" size="mini" v-if="buttonAuthor.log" @click="journal(scope.row.id)" icon="el-icon-notebook-2">日志</el-button>
        </template>
      </el-table-column>
    </el-table>
    <SensitiveWordLibraryPop ref="SensitiveWordLibraryPop"></SensitiveWordLibraryPop>
    <SensitiveWordLibraryDeleteLog ref="SensitiveWordLibraryDeleteLog"></SensitiveWordLibraryDeleteLog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject, computed, nextTick } from "vue";
import authorButtons from "@/compositionApi/authorButtons";
import SensitiveWordLibraryPop from "./SensitiveWordLibraryPop.vue";
import SensitiveWordLibraryDeleteLog from "./SensitiveWordLibraryDeleteLog.vue";
import { localGet } from "@/utils/util";
export default {
  name: "SensitiveWordLibraryTable",
  props: ["tableData", "tableLoading"],
  components: {
    SensitiveWordLibraryPop,
    SensitiveWordLibraryDeleteLog,
  },
  setup(prop, ctx) {
    const data = reactive({
      selectList: [],
      // 所有字典
      dictCodeList: [],
      sensitive_risk_level: [],
      sensitive_word_type: [],
    });
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      data.dictCodeList = localGet("dictCodeList");
      data.sensitive_risk_level = data.dictCodeList.sensitive_risk_level ? data.dictCodeList.sensitive_risk_level : [];
      data.sensitive_word_type = data.dictCodeList.sensitive_word_type ? data.dictCodeList.sensitive_word_type : [];
    });
    // 列表选择
    const handleSelectionChange = val => {
      data.selectList = val;
    };
    // 弹窗
    const sensitive = (type, row) => {
      let msg = {
        type: type,
        row: row || "",
      };
      vue.$refs.SensitiveWordLibraryPop.getMsg(msg);
    };

    // 批量删除
    const brachDel = () => {
      if (data.selectList.length < 1) {
        ElMessage.warning({
          message: "至少选择一条信息!",
          type: "warning",
        });
      } else {
        vue
          .$confirm("此操作将删除此数据, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            let ids = [];
            for (let item of data.selectList) {
              ids.push(item.id);
            }
            api.sensitive.deleteSensitiveByIds(ids).then(res => {
              if (res.code == 200) {
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
            });
          })
          .catch(() => {
            vue.$message({
              type: "info",
              message: "已取消修改",
            });
          });
      }
    };

    // 单个删除
    const delById = id => {
      vue
        .$confirm("此操作将删除此数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          api.sensitive.deleteSensitiveById({ id: id }).then(res => {
            if (res.code == 200) {
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
          });
        })
        .catch(() => {
          vue.$message({
            type: "info",
            message: "已取消修改",
          });
        });
    };

    // 删除日志
    const delLog = () => {
      nextTick(() => {
        vue.$refs.SensitiveWordLibraryDeleteLog.checkLogDialog();
      });
    };

    // 单条日志
    const journal = id => {
      let msg = {
        servers: "sensitive",
        dataApi: "getSensitiveLog",
        idList: [id],
      };
      nextTick(() => {
        vue.$refs.logDialog.checkLogDialog(msg);
      });
    };

    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (list, dizKey) {
        if (list.length > 1 && dizKey !== -1) {
          for (let item of list) {
            if (dizKey == item.dizKey) {
              return item.value;
            }
          }
        }
      };
    });
    const refData = toRefs(data);
    const getTableData = inject("getTableData");
    return {
      ...refData,
      buttonAuthor,
      handleSelectionChange,
      sensitive,
      delById,
      getTableData,
      brachDel,
      tableTypeComputed,
      delLog,
      journal,
    };
  },
};
</script>
<style scoped lang="scss"></style>
