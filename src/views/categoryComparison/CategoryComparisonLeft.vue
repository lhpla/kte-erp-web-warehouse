<!--CategoryComparisonLeft  品类对照左树状搜索-->
<template>
  <div id="CategoryComparisonLeft">
    <div class="box">
      <div class="title">
        <el-select v-model="categoryName" class="select" size="small" @change="search" filterable clearable>
          <el-option label="全部品类" :value="0"></el-option>
          <el-option label="待对照品类" :value="1"></el-option>
          <el-option label="已对照品类" :value="2"></el-option>
        </el-select>
      </div>
      <div class="search">
        <el-form-item>
          <el-select v-model="responsibleId" class="select" size="small" filterable clearable placeholder="请选择开发负责人">
            <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
          </el-select>
          <template #append>
            <el-button icon="el-icon-search" />
          </template>
        </el-form-item>
        <el-input placeholder="输入关键字进行过滤" clearable size="small" v-model="filterText">
          <template #append>
            <el-button icon="el-icon-search" @click="filterInput(filterText)" />
          </template>
        </el-input>
      </div>
      <el-tree
        class="filter-tree showTree"
        :highlight-current="true"
        :filter-node-method="filterNode"
        :data="tableData"
        :props="defaultProps"
        v-loading="tableLoading"
        node-key="id"
        :default-expanded-keys="defaultExpandedKeys"
        ref="tree"
        @node-click="nodeClick"
        :current-node-key="currentNodeKey"
      >
        <template #default="{ node, data }">
          <el-tooltip effect="dark" :content="data.name" placement="right">
            <div class="flex1">{{ node.label }}&nbsp;{{ data.isDisable == 0 ? "" : "(禁用)" }}</div>
          </el-tooltip>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, watch, inject } from "vue";
export default {
  name: "CategoryComparisonLeft",
  props: ["tableData", "tableLoading", "defaultExpandedKeys", "currentNodeKey", "type", "isDisable"],
  emits: ["update:sysCategoryId", "update:currentNodeKey", "update:isClickLeftNode", "update:type", "update:isDisable"],
  setup(prop, ctx) {
    const data = reactive({
      filterText: "",
      responsibleId: "",
      userList: [],
      defaultProps: {
        children: "children",
        label: "englishName",
      },
      currentNodeKey: "",
      categoryName: 0,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const getTableData = inject("getTableData");
    onBeforeMount(() => {});
    onMounted(() => {
      // 开发负责人
      api.userOperation.getHeadOfDevelopment().then(res => {
        if (res.code == 200) {
          data.userList = res.data;
        } else {
          data.tableLoading = false;
          vue.$message({
            type: "warning",
            message: res.msg,
          });
        }
      });
    });
    watch(() => {
      data.filterText,
        val => {
          vue.$refs.tree.filter(val);
        },
        { deep: true };
    });
    const refData = toRefs(data);
    const checked = ref(false);

    // 过滤
    const filterNode = (value, data) => {
      if (!value) return true;
      return data.englishName.indexOf(value) !== -1;
    };

    //勾选筛选
    const checkList = () => {
      if (checked._value) {
        ctx.emit("update:type", 1);
        if (data.responsibleId) {
          getTableData({ type: 1, responsibleId: data.responsibleId });
        } else {
          getTableData();
        }
      } else {
        ctx.emit("update:type", 0);
        if (data.responsibleId) {
          getTableData({ type: 0, responsibleId: data.responsibleId });
        } else {
          getTableData();
        }
      }
    };

    //懒加载
    // const loadNode = (node, resolve) => {
    //   if (node.id === 0) {
    //     return;
    //   } else {
    //   }
    // };

    //触发过滤方法
    const filterInput = val => {
      // vue.$refs.tree.filter(val);
      let info = {
        mappingType: data.categoryName,
        name: data.filterText,
        responsibleId: data.responsibleId,
      };
      getTableData(info);
    };

    //负责人搜索
    const search = e => {
      console.log(e);
      data.filterText = "";
      data.responsibleId = "";
      getTableData({ mappingType: e });
    };

    // 点击树节点
    const nodeClick = treeNode => {
      console.log(treeNode.isDisable);
      ctx.emit("update:sysCategoryId", treeNode.id);
      ctx.emit("update:currentNodeKey", treeNode.id);
      ctx.emit("update:isDisable", treeNode.isDisable);
      ctx.emit("update:isClickLeftNode", true);
    };

    watch(
      () => prop.currentNodeKey,
      val => {
        if (val) {
          ctx.emit("update:sysCategoryId", val);
          ctx.emit("update:isClickLeftNode", false);
        }
      }
    );

    return {
      ...refData,
      filterNode,
      filterInput,
      search,
      nodeClick,
      checked,
      checkList,
    };
  },
};
</script>
<style scoped lang="scss">
#CategoryComparisonLeft {
  .box {
  }
  .box::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  .box::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(245, 247, 250);
    background: #535353;
  }
  .box::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(233, 233, 233);
    border-radius: 10px;
    background: #ededed;
  }
  .title {
    height: 56px;
    line-height: 30px;
    background-color: #fafafa;
    padding: 10px;
    padding-left: 15px;
    padding-bottom: 15px;
    padding-right:15px;
    font-size: 20px !important;
    font-weight: bold;
    color: #666666;
    border-bottom: 2px solid #e9e9e9;
  }
  .search {
    padding: 10px 15px 20px 15px;
  }
  .showTree {
    :deep(.el-tree-node__content) {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      height: auto;
      display: block;
    }
  }
  :deep(.el-tree-node) {
    .el-tree-node__content {
      display: flex;
    }
  }
  .flex1 {
    height: 100%;
    width: 90%;
    white-space: normal;
    word-wrap: break-word;
    align-items: start;
    margin: 6px 20px 6px 0;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .select {
    width: 100%;
  }
  .el-checkbox {
    vertical-align: middle;
  }
}
</style>
