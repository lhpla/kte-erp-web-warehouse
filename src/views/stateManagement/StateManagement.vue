<!-- 开发状态管理 -->
<template>
  <div>
    <div class="top-button">
      <el-button type="primary" size="mini" icon="el-icon-plus" v-if="buttonAuthor.add" @click="saveDict(1)">新增</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      border
      :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
      style="width: 90%"
      class="table_margin"
    >
      <el-table-column label="开发状态" show-overflow-tooltip>
        <template #default="scope">
          <el-form-item v-if="scope.row.lock">
            <el-input size="mini" style="width: 80%" clearable @blur="saveDict(scope.row)" v-model="scope.row.devStatusName"></el-input>
          </el-form-item>
          <span v-else>{{ scope.row.devStatusName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" v-if="buttonAuthor.edit" @click="scope.row.lock = true">编辑</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" v-if="buttonAuthor.delete" @click="removeDictById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from "vue";
import authorButtons from "../../compositionApi/authorButtons";
export default {
  name: "stateManagement",
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      tableData: [],
      loading: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      getPack();
    });
    const refData = toRefs(data);
    // 获取信息
    const getPack = () => {
        data.loading = true;
        api.product
          .getProDevStatus()
          .then(res => {
            if (res.code == 200) {
              data.loading = false;
              data.tableData = res.data;
            } else {
              data.loading = false;
              vue.$message.warning(res.msg);
            }
          })
          .catch(() => {
            data.loading = false;
          });
    };
    // 新增字典
    const saveDict = row => {
      if (row !== 1) {
        api.product.updateProDevStatus({ devStatusName: row.devStatusName ? row.devStatusName.trim() : "", id: row.id }).then(res => {
          if (res.code == 200) {
            vue.$message({
              type: "success",
              message: res.msg,
            });
            getPack();
            row.lock = false;
          } else {
            vue.$message({
              type: "warning",
              message: res.msg,
            });
          }
        });
      } else {
        vue
          .$prompt("请输入开发状态", "操作确认", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputValue: "",
            inputType: "textarea",
          })
          .then(({ value }) => {
            api.product.insertProDevStatus({ devStatusName: value ? value.trim() : "" }).then(res => {
              if (res.code == 200) {
                vue.$message({
                  type: "success",
                  message: res.msg,
                });
                getPack();
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
              message: "取消输入",
            });
          });
      }
    };

    // 删除字典
    const removeDictById = id => {
      vue
        .$confirm("此操作将删除此信息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          api.product.deleteProDevStatus({ id: id }).then(res => {
            if (res.code == 200) {
              vue.$message({
                type: "success",
                message: res.msg,
              });
              getPack();
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
    return {
      ...refData,
      saveDict,
      removeDictById,
      buttonAuthor,
    };
  },
};
</script>
<style scoped lang="scss">
.top-button {
  display: flex;
  justify-content: flex-end;
  margin-right: 30px;
}
.table_margin {
  margin: auto;
  margin-top: 10px;
}
</style>
