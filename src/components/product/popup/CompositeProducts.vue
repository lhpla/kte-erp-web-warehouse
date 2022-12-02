<!-- 组合产品弹窗 -->
<template>
  <div>
    <!-- 批量组合dialog框 -->
    <el-dialog title="批量组合" width="1000px" v-model="combinationVisible" :close-on-click-modal="false" destroy-on-close>
      <!-- <div class="combination-name">
        <span>组合名称 ：</span>
        <el-input type="text" size="mini" clearable v-model="combinationData.groupName" placeholder="请填写组合名称(必填)"></el-input>
        <el-checkbox v-model="combinationData.isSoldSeparately" class="margin-left">允许单独售卖</el-checkbox>
      </div> -->
       <div class="combination-name">
        <span style="white-space: nowrap">组合Sku ：</span>
        <div style="width: 100%">
          <el-input
            clearable
            type="text"
            size="mini"
            v-model="combinationData.groupSku"
            placeholder="请填写组合Sku(必填)"
          ></el-input>
        </div>
      </div>
      <div class="combination-name">
        <span style="white-space: nowrap">组合名称 ：</span>
        <div style="display: flex; width: 100%">
          <el-input
            clearable
            type="text"
            size="mini"
            v-model="combinationData.groupName"
            placeholder="请填写组合名称(必填)"
          ></el-input>
          <el-checkbox
            v-model="combinationData.isSoldSeparately"
            class="margin-left"
            >允许单独售卖</el-checkbox
          >
        </div>
      </div>
      <el-table :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }" :data="combinationData.groupProSkuList" tooltip-effect="dark" border style="margin: 0 0 20px 0">
        <el-table-column prop="groupProSku" label="SKU" show-overflow-tooltip>
          <template #default="scope">
            <el-input v-model.trim="scope.row.groupProSku" clearable size="mini" disabled placeholder="请输入内容"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="数量" show-overflow-tooltip>
          <template #default="scope">
            <!-- <el-input v-model="scope.row.amount" clearable size="mini" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入内容"></el-input> -->
             <el-form :model="scope.row" :ref="`amount${scope.row.index}`">
              <el-form-item
                prop="amount"
                :rules="[
                  {
                    pattern: /^([1-9]\d{0,3})$/,
                    message: '请输入1-9999的正整数',
                    trigger: 'change',
                  },
                ]"
              >
                <el-input
                 style="margin-top:26px !important"
                  clearable
                  v-model.number="scope.row.amount"
                  size="mini"
                  placeholder="请输入内容"
                  maxlength="5"
                  oninput="value=value.replace(/[^\d]/g,'')"
                ></el-input>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="isMainSku" width="80" label="申报(主)SKU">
          <template #default="scope">
            <el-switch v-model="scope.row.isMainSku" :active-value="1" :inactive-value="0" />
          </template>
        </el-table-column>
        <el-table-column class-name="table-operation" width="100" label="操作">
          <template #default="scope">
            <el-button size="mini" icon="el-icon-delete" type="text" @click="deleteProductSku(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="combinationVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="batchCombinationSubmit" size="mini">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject } from "vue";
export default {
  name: "CompositeProducts",
  setup(prop, ctx) {
    const data = reactive({
      combinationVisible: false,
      combinationData: {
        isSoldSeparately: false,
      },
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    // 获取组合产品信息
    const getMsg = combinationData => {
      data.combinationVisible = true;
      data.combinationData = combinationData;
      data.combinationData.isSoldSeparately = false;
    };

    // 删除批量组合
    const deleteProductSku = row => {
      if (data.combinationData.groupProSkuList && data.combinationData.groupProSkuList.length <= 2) {
        vue.$message.warning("请至少保留两条产品信息！");
        return;
      }
      data.combinationData.groupProSkuList = data.combinationData.groupProSkuList.filter(item => {
        return item.groupProSku != row.groupProSku;
      });
    };
    const getTableData = inject("getTableData");
    // 批量组合提交
    const batchCombinationSubmit = () => {
       if (data.combinationData.groupSku == "") {
            vue.$message.error("请填写组合Sku！");
            return;
          }
      if (data.combinationData.groupName == "") {
        vue.$message.error("请填写组合名称！");
        return;
      }
      if (data.combinationData.groupName) {
        data.combinationData.groupName = data.combinationData.groupName.trim();
      }

      if (
        data.combinationData.groupProSkuList.every(item => {
          return item.isMainSku == 0;
        })
      ) {
        vue.$message.warning("必须选择一条sku为主sku!");
        data.submitActive = false;
      } else {
        let num = 0;
        data.combinationData.groupProSkuList.map(item => {
          if (item.isMainSku == 1) {
            num++;
          }
        });
        if (num == 1) {
          let msg = JSON.stringify(data.combinationData);
          msg = JSON.parse(msg);
          msg.isSoldSeparately = !msg.isSoldSeparately ? 0 : 1;

          api.product.addGroupProduct(msg).then(res => {
            vue.$message.success("新增组合成功！");
            data.combinationVisible = false;
            getTableData();
          });
        } else {
          vue.$message.warning("主sku只能选择一条!");
          data.submitActive = false;
        }
      }
    };
    const refData = toRefs(data);
    return {
      ...refData,
      getMsg,
      deleteProductSku,
      batchCombinationSubmit,
    };
  },
};
</script>
<style scoped lang='scss'>
.combination-name {
  display: flex;
  align-items: center;
  margin: 0 0 30px 0;
  span {
    width: 100px;
  }
}
</style>
