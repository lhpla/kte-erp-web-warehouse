<!-- 敏感词新增、修改 -->
<template>
  <div id="SensitiveWordLibraryPop">
    <el-dialog :title="title" width="60%" v-model="editVisible" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="formInline" ref="searchForm" label-width="110px" size="mini">
        <el-form-item label="关键词：" prop="keyword">
          <el-input v-model="formInline.keyword" placeholder="请输入" clearable></el-input>
        </el-form-item>

        <el-form-item label="类型：" prop="sensitiveType">
          <el-select v-model="formInline.sensitiveType" filterable placeholder="请选择" clearable>
            <el-option v-for="item in sensitive_word_type" :key="item.dizKey" :label="item.value" :value="item.dizKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="风险等级：" prop="riskLevel">
          <el-select v-model="formInline.riskLevel" filterable placeholder="请选择" clearable>
            <el-option v-for="item in sensitive_risk_level" :key="item.dizKey" :label="item.value" :value="item.dizKey"></el-option>
          </el-select>
        </el-form-item>
        <div>
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="formInline.remark" style="width: 90% !important" :rows="3" type="textarea" placeholder="请输入" clearable></el-input>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false" size="mini" :loading="btnFlag" :disabled="btnFlag">取 消</el-button>
          <el-button type="primary" @click="click" size="mini" :loading="btnFlag" :disabled="btnFlag">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from "vue";
import { localGet, throttle, localSet } from "@/utils/util";
export default {
  name: "SensitiveWordLibraryPop",
  setup(prop, ctx) {
    const data = reactive({
      editVisible: false,
      isDisabled: false,
      formInline: {
        keyword: "",
        remark: "",
        sensitiveType: "",
        riskLevel: "",
        id: "",
      },
      btnFlag: false,
      title: "新增",
      // 所有字典
      dictCodeList: [],
      sensitive_risk_level: [],
      sensitive_word_type: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const searchForm = ref(null);
    onBeforeMount(() => {});
    onMounted(() => {});
    // 获取最新数据
    const getNewData = () => {
      //获取开发流程所有字典
      api.develop.getDevProcessList().then(res => {
        if (res.code == 200) {
          localSet("dictCodeList", res.data);
        }
      });
    };

    const getMsg = msg => {
      getNewData();
      data.editVisible = true;
      data.title = msg.type == "add" ? "新增" : "修改";
      data.dictCodeList = localGet("dictCodeList");
      data.sensitive_risk_level = data.dictCodeList.sensitive_risk_level ? data.dictCodeList.sensitive_risk_level : [];
      data.sensitive_word_type = data.dictCodeList.sensitive_word_type ? data.dictCodeList.sensitive_word_type : [];

      if (msg.row) {
        data.formInline.keyword = msg.row.keyword;
        data.formInline.remark = msg.row.remark;
        data.formInline.sensitiveType = msg.row.sensitiveType;
        data.formInline.riskLevel = msg.row.riskLevel;
        data.formInline.id = msg.row.id;
      } else {
        data.formInline = { keyword: "", remark: "", sensitiveType: "", riskLevel: "", id: "" };
      }
    };
    const getTableData = inject("getTableData");
    const submit = () => {
      console.log(data.isDisabled);
      data.btnFlag = true;
      if (data.title == "新增") {
        api.sensitive
          .insertSensitive(data.formInline)
          .then(res => {
            if (res.code == 200) {
              vue.$message({
                type: "success",
                message: res.msg,
              });
              getTableData();
              data.btnFlag = false;
              data.editVisible = false;
            } else {
              vue.$message({
                type: "warning",
                message: res.msg,
              });
              data.btnFlag = false;
            }
          })
          .catch(e => {
            data.btnFlag = false;
          });
      } else {
        api.sensitive
          .updateSensitive(data.formInline)
          .then(res => {
            if (res.code == 200) {
              vue.$message({
                type: "success",
                message: res.msg,
              });
              data.btnFlag = false;
              getTableData();
              data.editVisible = false;
            } else {
              vue.$message({
                type: "warning",
                message: res.msg,
              });
              data.btnFlag = false;
            }
          })
          .catch(e => {
            data.btnFlag = false;
          });
        data.isDisabled = false;
      }
    };
    const click = throttle(submit, 1000);
    const refData = toRefs(data);
    return {
      ...refData,
      getMsg,
      submit,
      click,
      searchForm,
      getNewData,
      getTableData,
    };
  },
};
</script>
<style scoped lang="scss">
#SensitiveWordLibraryPop {
  .el-input,
  .el-textarea {
    width: 300px;
  }
}
</style>
