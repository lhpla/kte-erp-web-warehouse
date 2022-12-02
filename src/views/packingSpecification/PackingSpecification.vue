<!-- 包装说明 -->
<template>
  <div>
    <div class="packing-btn">
      <el-button type="primary" icon="el-icon-plus" size="mini" v-if="buttonAuthor.add" @click="saveDict(1)">新增</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="packageTypeList"
      border
      :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
      style="width: 90%"
      class="table_margin"
    >
      <el-table-column label="包装说明" show-overflow-tooltip>
        <template #default="scope">
          <el-form-item v-if="scope.row.lock">
            <el-input size="mini" clearable style="width: 80%" @blur="saveDict(scope.row)" v-model="scope.row.dictValue"></el-input>
          </el-form-item>
          <span v-else>{{ scope.row.dictValue }}</span>
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
import { localGet, localSet } from "@/utils/util";
import authorButtons from "@/compositionApi/authorButtons";

export default {
  name: "packingSpecification",
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      packageTypeList: [],
      loading: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {
      getPack();
    });

    // 获取信息
    const getPack = () => {
        data.loading = true;
        api.system
          .getDict({ code: "pro_purchase_package" })
          .then(res => {
            if (res.code == 200) {
              data.loading = false;
              data.packageTypeList = res.data;
            } else {
              data.loading = false;
              vue.$message.warning(res.msg);
            }
          })
          .catch(() => {
            data.loading = false;
          });
    };

    //重新获取开发流程所有字典
    const updateDict = () => {
      api.develop.getDevProcessList().then(res => {
        if (res.code == 200) {
          localSet("dictCodeList", res.data);
        }
      });
    };

    const refData = toRefs(data);
    // 新增字典
    const saveDict = row => {
      if (row !== 1) {
        api.product.saveDict({ parentId: row.parentId, dictValue: row.dictValue ? row.dictValue.trim() : "", id: row.id }).then(res => {
          if (res.code == 200) {
            vue.$message({
              type: "success",
              message: res.msg,
            });
            updateDict();
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
          .$prompt("请输入包装说明", "操作确认", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputValue: "",
            inputType: "textarea",
          })
          .then(({ value }) => {
            api.product.saveDict({ parentId: "1395945237206573057", dictValue: value ? value.trim() : "" }).then(res => {
              if (res.code == 200) {
                vue.$message({
                  type: "success",
                  message: res.msg,
                });
                updateDict();
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
          api.product.removeDictById({ id: id }).then(res => {
            if (res.code == 200) {
              vue.$message({
                type: "success",
                message: res.msg,
              });
              updateDict();
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
      updateDict,
    };
  },
};
</script>
<style scoped lang="scss">
.table_margin {
  margin: auto;
}

.packing-btn {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 10px 20px 20px 0;
}
</style>
