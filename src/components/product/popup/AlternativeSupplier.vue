<!-- 备选供应商 -->
<template>
  <div>
    <div v-loading="formLoading" style="min-height: 650px">
      <el-form v-show="showFlag" :inline="true" label-width="80px">
        <el-form-item label="录入人:">
          <el-select v-model="userId" size="mini" :disabled="!buttonAuthor.AlternativeSupplierEnter" clearable placeholder="请选择">
            <el-option v-for="item in userList" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" icon="el-icon-search" type="primary" v-if="buttonAuthor.AlternativeSupplierSearch" @click="search">搜 索</el-button>
          <el-button size="mini" icon="el-icon-plus" type="primary" v-if="buttonAuthor.AlternativeSupplierAdd && isEdit" @click="addAlternative">新增备选</el-button>
        </el-form-item>
        <AddSupplier ref="AddSupplier"></AddSupplier>
      </el-form>
      <AlternativeSuppliersDetails ref="AlternativeSuppliersDetails"></AlternativeSuppliersDetails>
      <el-table :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }" :data="tableData" tooltip-effect="dark" border max-height="500" v-show="showFlag">
        <el-table-column label="供应商">
          <template #default="scope">
            <span class="nameHover mle1" @click="editAlternative(scope.row, 'detail')">
              <span v-if="scope.row.supplierProperty == 1">{{ scope.row.supplierName }}</span>
              <span v-else>{{ scope.row.intentionSupplierName }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="属性">
          <template #default="scope">
            {{ scope.row.supplierProperty == 1 ? "意向" : "备选" }}
          </template>
        </el-table-column>
        <el-table-column prop="supplierType" label="类型">
          <template #default="scope">
            {{ scope.row.supplierType == 1 ? "相同" : "相似" }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column prop="procurementPrice" label="采购价格(CNY)">
          <template #default="scope">
            {{ Number(scope.row.procurementPrice) > 0 ? Number(scope.row.procurementPrice).toFixed(2) : 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="createUserName" label="录入人"></el-table-column>
        <el-table-column prop="createTime" label="录入时间">
          <template #default="scope">
            <span class="mle1">
              {{ scope.row.createTime }}
            </span>
          </template>
        </el-table-column>
        <el-table-column class-name="table-operation" width="100" label="操作" v-if="buttonAuthor.AlternativeSupplierOperation">
          <template #default="scope">
            <el-button :disabled="!isEdit" size="mini" icon="el-icon-edit" type="text" @click="editAlternative(scope.row, 'edit')" v-if="buttonAuthor.AlternativeSupplierEdit">
              编辑
            </el-button>
            <el-button :disabled="!isEdit" size="mini" icon="el-icon-delete" type="text" @click="deleteProAlternative(scope.row)" v-if="buttonAuthor.AlternativeSupplierDel">解除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, provide } from "vue";
import AddSupplier from "./AddSupplier.vue";
import AlternativeSuppliersDetails from "./AlternativeSuppliersDetails.vue";
import authorButtons from "@/compositionApi/authorButtons";
import { localGet } from "@/utils/util";
export default {
  name: "AlternativeSupplier",
  components: {
    AddSupplier,
    AlternativeSuppliersDetails,
  },
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const data = reactive({
      isEdit:false,
      // 用户列表
      userList: [],
      userId: "",
      tableData: [],
      proId: "",
      proSku: "",
      formLoading: false, //表单loading
      showFlag: false, //表单数据获取完成过后再显示表单
      isFirstGetDetail: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const refData = toRefs(data);
    // 供应商初始
    const getMsg = productData => {
      data.isEdit = productData.isEdit;
      data.formLoading = true;
      data.showFlag = false;
      data.tableData = [];
      data.proId = productData.proId;
      data.proSku = productData.sku;
      //获取采购部人员
      api.product.getPurchaseUserList().then(res => {
        data.userList = res.data;
      });
      data.userId = !buttonAuthor.AlternativeSupplierEnter ? localGet("userInfo").real_name : "";
      
      (buttonAuthor.AlternativeSupplierEnter ? data.userId : localGet("userInfo").user_id);
      data.formLoading = false;
      data.showFlag = true;
    };
  
    // 获取供应商列表
    const getAlternativeSupplierData = createUserId => {
      api.productLibrary.getAlternativeSupplier({ proId: data.proId, createUserId: createUserId }).then(res => {
        if (res.code == 200) {
          data.tableData = res.data;
        }
      });
    };
  provide("getAlternativeSupplierData", getAlternativeSupplierData);
    // 搜索供应商
    const search = () => {
      getAlternativeSupplierData(buttonAuthor.AlternativeSupplierEnter ? data.userId : localGet("userInfo").user_id);
    };
    // 新增
    const addAlternative = () => {
      vue.$refs.AddSupplier.getMsg(data.proId, data.proSku, data.userId);
    };

    // 编辑
    const editAlternative = (row, text) => {
      let msg = {
        id: row.id,
        text: text,
        userId: data.userId,
      };
      vue.$refs.AlternativeSuppliersDetails.getMsg(msg);
    };
    // 解除
    const deleteProAlternative = row => {
      vue
        .$confirm("确认进行解除此产品供应商关系？", "解除确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          api.productLibrary.deleteAlternativeSupplier({ id: row.id }).then(res => {
            if (res.code == 200) {
              getAlternativeSupplierData(buttonAuthor.AlternativeSupplierEnter ? data.userId : localGet("userInfo").user_id);
              vue.$message({
                type: "success",
                message: res.msg,
              });
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
      getMsg,
      addAlternative,
      editAlternative,
      deleteProAlternative,
      getAlternativeSupplierData,
      search,
      buttonAuthor,
    };
  },
};
</script>
<style scoped lang='scss'></style>
