<!-- 批量组合dialog框 -->
<template>
  <div>
    <el-dialog
      :title="isCombination == 'add' ? '添加组合' : '编辑组合'"
      width="40%"
      v-model="combinationVisible"
      :close-on-click-modal="false"
      @close="closed"
      destroy-on-close
    >
      <div class="combination-name" v-if="isCombination!=='add'">
        <span style="white-space: nowrap">组合Sku ：</span>
        <div style="width: 100%">
          {{combinationData.groupSku}}
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
            v-model="combinationData.isGroupTicket"
            class="margin-left"
            >是否组合开票</el-checkbox
          >
          <el-checkbox
            v-model="combinationData.isSoldSeparately"
            class="margin-left"
            >允许单独售卖</el-checkbox
          >
        </div>
      </div>
      <el-table
        :header-cell-style="{
          background: '#fafafa',
          color: '#2d2f30',
          fontWeight: 'bold',
          fontSize: '12px',
        }"
        :data="combinationData.groupProSkuList"
        tooltip-effect="dark"
        element-loading-text="加载中"
        v-loading="loading"
        border
        style="margin: 0 0 20px 0"
      >
        <el-table-column
          prop="groupProSku"
          align="center"
          label="SKU"
          show-overflow-tooltip
        >
          <template #default="scope">
            <!-- 远程搜索SKU -->
            <el-autocomplete
              v-model="scope.row.groupProSku"
              :trigger-on-focus="false"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入产品SKU"
              :debounce="0"
              size="mini"
              style="width: 100%"
              @select="handleSelect($event, scope.row)"
            ></el-autocomplete>
          </template>
        </el-table-column>
        <el-table-column
          prop="groupProName"
          align="center"
          label="产品名"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-input
              clearable
              v-model="scope.row.groupProName"
              disabled
              size="mini"
              placeholder="产品名"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          align="center"
          label="数量"
          show-overflow-tooltip
        >
          <template #default="scope">
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
                ></el-input>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column align="center" width="80" label="申报(主)SKU">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isMainSku"
              :active-value="1"
              :inactive-value="0"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          class-name="table-operation"
          width="100"
          label="操作"
        >
          <template #default="scope">
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="text"
              @click="deleteProductSku(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="add-group">
        <el-button
          v-if="isCombination == 'add'"
          type="text"
          icon="el-icon-circle-plus-outline"
          @click="addProductSku('add')"
          >新增产品</el-button
        >
        <el-button
          v-if="isCombination == 'edit'"
          type="text"
          icon="el-icon-circle-plus-outline"
          @click="addProductSku('edit')"
          >新增产品</el-button
        >
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="mini" @click="closed">取 消</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="batchCombinationSubmit"
            :disabled="submitActive"
            :loading="submitActive"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
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
} from "vue";
export default {
  name: "CombinationEditPop",
  setup(prop, ctx) {
    const data = reactive({
      // 是否新增
      isCombination: "add",
      // 组合产品列表
      combinationData: {
        groupSku: "",
        groupName: "",
        groupProSkuList: [],
        isSoldSeparately: false,
        isGroupTicket: false,
        // 提交按钮状态
        submitActive: false,
      },
      // 提交按钮状态
      submitActive: false,
      // 批量组合dialog状态
      combinationVisible: false,
      loading: false,
      // 删除的列表id
      deleteId: [],
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const refData = toRefs(data);
    //打开弹窗
    const getMsg = (text, row) => {
      data.isCombination = text;
      data.combinationVisible = true;
      if (text == "edit") {
        api.product
          .portfolioListDetail({
            ids: row.id,
            id: row.groupSku ? row.groupSku.trim() : "",
          })
          .then((res) => {
            data.combinationData = {
              groupName: res.data.groupName ? res.data.groupName.trim() : "",
              groupSku: res.data.groupSku ? res.data.groupSku.trim() : "",
              id: res.data.id,
              groupProSkuList: [],
              isSoldSeparately: res.data.isSoldSeparately == 1 ? true : false,
              isGroupTicket: res.data.isGroupTicket,
            };
            row.groupProSkuList.forEach((item, index) => {
              data.combinationData.groupProSkuList.push({
                id: item.id,
                groupProSku: item.groupProSku,
                groupProName: item.groupProName,
                amount: item.amount,
                isGroupSKU: true,
                isMainSku: item.isMainSku,
                index,
              });
            });
          });
      } else {
        data.combinationData = {
          isGroupTicket: true,
          groupName: "",
          groupSku: "",
          groupProSkuList: [
            {
              groupProName: "",
              amount: 1,
              index: 0,
            },
          ],
        };
      }
    };
    const getTableData = inject("getTableData");
    // 添加组合
    const addProductSku = (type) => {
      if (type == "add") {
        data.combinationData.groupProSkuList.push({
          //2022.10.21，gqs取消随机数id
          // id: randomNumId(),
          groupProSku: "",
          amount: 1,
          index: data.combinationData.groupProSkuList.length,
        });
      } else {
        let obj = {
          amount: 1,
          groupProName: "",
          groupProSku: "",
          // id: randomNumId(),
          isGroupSKU: true,
          index: data.combinationData.groupProSkuList.length,
        };
        data.combinationData.groupProSkuList.push(obj);
      }
    };

    // 提交编辑
    const batchCombinationSubmit = () => {
      const arr = [];
      data.combinationData.groupProSkuList.map((item) => {
        arr.push(vue.$refs[`amount${item.index}`].validate());
      });
      Promise.all(arr)
        .then(() => {
          if (data.combinationData.groupName == "") {
            vue.$message.error("请填写组合名称！");
            return;
          }

          if (data.combinationData.groupProSkuList.length < 2) {
            vue.$message.error("请至少新增两条产品信息！");
            return;
          }
          let flag = false;
          data.combinationData.groupProSkuList.forEach((item) => {
            if (
              item.groupProSku == "" ||
              item.groupProSku == undefined ||
              item.groupProSku == null
            ) {
              flag = true;
            }
          });
          if (flag == true) {
            vue.$message.error("请填写产品SKU信息！");
            return;
          }
          if (data.isCombination == "add") {
            data.combinationData.groupProSkuList.forEach((item) => {
              delete item.id;
              item.amount = Number(item.amount);
            });
            delete data.combinationData.groupSku
          } else {
            data.combinationData.groupProSkuList.forEach((item) => {
              item.amount = Number(item.amount);
            });
          }
          data.submitActive = true;
          let test = /^\+?[1-9]\d*$/;
          if (
            data.combinationData.groupProSkuList.every((item) => {
              return test.test(item.amount);
            })
          ) {
            if (
              data.combinationData.groupProSkuList.every((item) => {
                return item.isMainSku == 0;
              })
            ) {
              vue.$message.warning("必须选择一条sku为主sku!");
              data.submitActive = false;
            } else {
              let num = 0;
              data.combinationData.groupProSkuList.map((item) => {
                if (item.isMainSku == 1) {
                  num++;
                }
              });
              if (num == 1) {
                let msg = JSON.stringify(data.combinationData);
                msg = JSON.parse(msg);
                msg.isSoldSeparately = !msg.isSoldSeparately ? 0 : 1;
                api.product
                  .addGroupProduct(msg)
                  .then((res) => {
                    data.submitActive = false;
                    vue.$message.success(
                      data.isCombination == "add"
                        ? "新增组合成功！"
                        : "编辑组合成功！"
                    );
                    closed();
                    getTableData();
                  })
                  .catch((error) => {
                    data.submitActive = false;
                  });
              } else {
                vue.$message.warning("主sku只能选择一条!");
                data.submitActive = false;
              }
            }
          } else {
            vue.$message.warning("请输入大于0的正整数！");
            data.submitActive = false;
          }
          flag = false;
        })
        .catch(() => {});
    };

    // 删除批量组合
    const deleteProductSku = (row) => {
      if (data.isCombination == "edit") {
        if (data.combinationData.groupProSkuList.length <= 2) {
          vue.$message.warning("一个组合请至少保留两条产品信息！");
          return;
        }
      }
      data.deleteId.push(row.id);
      data.combinationData.groupProSkuList =
        data.combinationData.groupProSkuList.filter((item) => {
          return item.id != row.id;
        });
    };

    // 远程搜索
    const querySearchAsync = (queryString, cb) => {
      let dataSku = [];
      api.product.searchGroupProduct({ sku: queryString }).then((res) => {
        res.data.forEach((item) => {
          dataSku.push({
            id: item.id,
            value: item.productSku,
            groupProName: item.productCname,
            isGroupSKU: true,
          });
        });
        dataSku.length ? cb(dataSku) : cb([{ value: "暂无匹配数据" }]);
      });
    };

    // 赋值
    const handleSelect = (item, row) => {
      row.groupProName = item.groupProName;
      row.groupProSku == "暂无匹配数据"
        ? (row.groupProSku = "")
        : (row.groupProSku = item.value);
      // row.id = randomNumId();
    };

    // 随机产生不重复的数字id 16位
    const randomNumId = () => {
      let supplierPayId = "";
      supplierPayId = Math.ceil(Math.random() * 10000000000000000);
      return supplierPayId;
    };

    //关闭弹框 combinationVisible  closed
    const closed = () => {
      data.combinationVisible = false;
      data.combinationData.isSoldSeparately = false;
      data.combinationData.isGroupTicket = true;
      data.combinationData.groupName = "";
      data.combinationData.groupProSkuList = [];
    };

    return {
      ...refData,
      getMsg,
      addProductSku,
      batchCombinationSubmit,
      deleteProductSku,
      querySearchAsync,
      handleSelect,
      closed,
      getTableData,
    };
  },
};
</script>
<style scoped lang="scss">
.el-from {
  .el-input,
  .el-cascader,
  .el-select {
    width: 193px;
  }
}

.combination-name {
  display: flex;
  align-items: center;
  margin: 0 0 30px 0;
  span {
    width: 100px;
  }
  .combination-label {
    width: 80px;
  }
}

.add-group {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
