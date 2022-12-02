<!-- productExceptionDialog 产品异常列表处理弹窗 -->
<template>
  <div id="productExceptionDialog">
    <el-dialog
      v-model="dialogVisible"
      width="70%"
      :title="title"
      :close-on-click-modal="false"
      destroy-on-close
      :before-close="handleClose"
    >
      <el-form
        :model="ruleForm"
        size="mini"
        :inline="true"
        label-width="140px"
        ref="ruleFormRef"
      >
        <el-form-item label="PO单:" prop="PO" class="form-item">
          {{ tableForm[0].orderCode ? tableForm[0].orderCode : "-" }}
        </el-form-item>
        <el-form-item label="物流号:" prop="contacts" class="form-item">
          {{ tableForm[0].logisticsNum ? tableForm[0].logisticsNum : "-" }}
        </el-form-item>
        <el-form-item label="SKU:" prop="SKU" style="width: 320px">
          {{ tableForm[0].sku ? tableForm[0].sku : "-" }}
        </el-form-item>
        <el-form-item label="采购员:" prop="buyerName" class="form-item">
          {{ tableForm[0].buyerName ? tableForm[0].buyerName : "-" }}
        </el-form-item>
        <el-form-item label="处理方式:" prop="select" class="form-item">
          {{
            tableTypeComputed(abnormalProcessTypeList, tableForm[0].processType)
              ? tableTypeComputed(
                  abnormalProcessTypeList,
                  tableForm[0].processType
                )
              : "-"
          }}
        </el-form-item>
      </el-form>
      <div v-for="item in tableForm" :key="item.id">
        <el-table
          v-loading="contactsTableLoding"
          :data="[item]"
          border
          style="width: 100%; margin-bottom: 20px"
          :header-cell-style="{
            background: '#fafafa',
            color: '#2d2f30',
            fontWeight: 'bold',
            fontSize: '12px',
          }"
        >
          <el-table-column align="center" label="中转仓库">
            <template #default="scope">
              {{
                scope.row.transferWarehouse ? scope.row.transferWarehouse : "-"
              }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="仓区">
            <template #default="scope">
              {{
                scope.row.purposeWarehouse ? scope.row.purposeWarehouse : "-"
              }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="采购建议数量">
            <template #default="scope">
              {{
                scope.row.purchaseNum
                  ? scope.row.purchaseNum
                  : scope.row.purchaseNum == false
                  ? scope.row.purchaseNum == 0
                    ? 0
                    : "-"
                  : scope.row.currentReceiptNum
              }}
              <!-- {{ scope.row.purchaseNum ? scope.row.purchaseNum : "-" }} -->
            </template>
          </el-table-column>
          <el-table-column align="center" label="收货数量">
            <template #default="scope">
              {{
                scope.row.currentReceiptNum
                  ? scope.row.currentReceiptNum
                  : scope.row.currentReceiptNum == false
                  ? scope.row.currentReceiptNum == 0
                    ? 0
                    : "-"
                  : scope.row.currentReceiptNum
              }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="异常数量">
            <template #default="scope">
              {{
                scope.row.abnormalNum
                  ? scope.row.abnormalNum
                  : scope.row.abnormalNum == false
                  ? scope.row.abnormalNum == 0
                    ? 0
                    : "-"
                  : scope.row.currentReceiptNum
              }}

              <!-- {{ scope.row.purNum ? scope.row.purNum : "-" }} -->
            </template>
          </el-table-column>
          <el-table-column align="center" label="异常类型">
            <template #default="scope">
              <el-tag>
                {{
                  tableTypeComputed(abnormal_new_type, scope.row.abnormalType)
                }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="异常描述">
            <template #default="scope">
              {{ scope.row.abnormalContext ? scope.row.abnormalContext : "-" }}
            </template>
          </el-table-column>
          <el-table-column label="异常图片" min-width="140px">
            <template #default="scope">
              <div style="display: flex; align-items: end">
                <el-image
                  v-if="scope.row.abnormalImg.length > 0"
                  @click="viewAbnormalPicture(scope.row.abnormalImg[0])"
                  style="width: 70px; height: 70px; object-fit: contain"
                  :src="scope.row.abnormalImg[0]"
                />
                <div v-if="scope.row.abnormalImg.length == 0">-</div>
                <span v-if="scope.row.abnormalImg.length > 1">
                  <el-button
                    type="text"
                    size="mini"
                    @click="moreImg(scope.row.abnormalImg)"
                    >更 多</el-button
                  >
                </span>
              </div>
              <!-- 查看图片 -->
              <el-dialog
                title="全部图片"
                v-model="dialogVisibleMore"
                width="40%"
                :close-on-click-modal="false"
                @close="closedMore"
                destroy-on-close
              >
                <span
                  v-for="(url, ind) of scope.row.abnormalImg"
                  :key="ind"
                  style="margin-left: 5px"
                >
                  <span v-if="url">
                    <el-image
                      @click="viewAbnormalPicture(url)"
                      style="width: 100px; height: 90px; margin-bottom: 5px"
                      fit="contain"
                      :src="url"
                    ></el-image>
                  </span>
                </span>
              </el-dialog>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="item.abnormalInfoVo.length > 0">
          <div v-for="ite in item.abnormalInfoVo" :key="ite.id">
            <div class="table-title">产品操作异常</div>
            <el-form :model="ite" ref="tableFormRef">
              <el-table
                v-loading="contactsTableLoding"
                :data="[ite]"
                class="table"
                border
                style="width: 100%"
                :header-cell-style="{
                  background: '#fafafa',
                  color: '#2d2f30',
                  fontWeight: 'bold',
                  fontSize: '12px',
                }"
              >
                <el-table-column align="center" prop="sku" label="SKU">
                  <template #default="scope">
                    {{ scope.row.sku ? scope.row.sku : "-" }}
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="purIsChangeSku"
                  label="是否更换SKU"
                  width="60px"
                >
                  <template #default="scope">
                    {{ scope.row.purIsChangeSku ? "是" : "否" }}
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="新SKU"
                  v-if="typeDialog != 'see' && ite.purIsChangeSku"
                >
                  <template #default="{ row }">
                    <el-form-item prop="newSku" :rules="tableRules.newSku">
                      <el-input
                        v-model="row.newSku"
                        placeholder="请输入新SKU"
                        :disabled="
                          submitActive ||
                          row.processStatus != 'develop_to_be_confirmed' ||
                          typeDialog == 'see'
                        "
                        v-if="typeDialog == 'deal'"
                        size="mini"
                      />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="仓区">
                  <template #default="{ row }">
                    <el-form-item
                      v-if="typeDialog != 'see'"
                      prop="purposeWarehouseId"
                      :rules="tableRules.purposeWarehouseId"
                    >
                      <el-select
                        v-model="row.purposeWarehouseId"
                        size="mini"
                        filterable
                        clearable
                        placeholder="请选择"
                        :disabled="
                          submitActive ||
                          row.processStatus != 'develop_to_be_confirmed' ||
                          typeDialog == 'see'
                        "
                      >
                        <el-option
                          v-for="item in warehouseAreaList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <div v-else>
                      {{ row.purposeWarehouse ? row.purposeWarehouse : "-" }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="确认数量" width="70px">
                  <template #default="scope">
                    {{ scope.row.purNum ? scope.row.purNum : "-" }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="状态">
                  <template #default="scope">
                    {{
                      tableTypeComputed(
                        abnormal_process_status,
                        scope.row.processStatus
                      )
                    }}
                  </template>
                </el-table-column>

                <el-table-column align="center" label="操作" width="120px">
                  <template #default="scope">
                    <el-button
                      type="primary"
                      @click="submit(ite, item)"
                      v-if="!ite.purIsChangeSku && buttonAuthor.pushWarehouse"
                      :loading="submitActive"
                      :disabled="
                        submitActive ||
                        scope.row.processStatus != 'develop_to_be_confirmed' ||
                        typeDialog == 'see'
                      "
                      size="mini"
                    >
                      推仓库
                    </el-button>
                    <el-button
                      type="primary"
                      @click="submit(ite, item)"
                      v-if="ite.purIsChangeSku && buttonAuthor.pushPurchase"
                      :loading="submitActive"
                      :disabled="
                        submitActive ||
                        scope.row.processStatus != 'develop_to_be_confirmed' ||
                        typeDialog == 'see'
                      "
                      size="mini"
                    >
                      提交采购
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button
          @click="handleClose"
          :loading="submitActive"
          :disabled="submitActive"
          size="mini"
          >取 消</el-button
        >
      </template>
    </el-dialog>
    <!-- 异常图片预览 -->
    <el-dialog
      v-model="isAbnormalPictures"
      @close="closeAbnormalPicture"
      destroy-on-close
    >
      <div style="width: 100%; height: 100%">
        <el-image
          style="width: 100%; height: 100%"
          :src="abnormalPicture"
          fit="contain"
          alt=""
        ></el-image>
      </div>
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
  computed,
  nextTick,
  inject,
} from "vue";
import authorButtons from "@/compositionApi/authorButtons";
import { localGet } from "@/utils/util";
export default {
  name: "",
  setup(prop, ctx) {
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const data = reactive({
      isAbnormalPictures: false,
      abnormalPicture: "",
      dialogVisible: false,
      contactsTableLoding: false,
      title: "异常操作",
      submitActive: false,
      ruleForm: {
        warehouseArea: "",
        inputValue: "",
      },
      typeDialog: "see",
      tableForm: [],
      dialogVisibleMore: false,
      warehouseAreaList: [],
    });
    const tableRules = reactive({
      newSku: [
        { required: true, message: "请输入新sku", trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            if (value) {
              const info = {
                sku: value.trim(),
                supplierId: data.tableForm[0].abnormalInfoVo[0].purSupplierId,
              };
              api.warehouse
                .checkSkue(info)
                .then((res) => {
                  if (res.code == 200) {
                    callback();
                  } else if (res.code == 400) {
                    // vue.$message.warning(res.msg);
                    callback(new Error("数据库不存在当前SKU"));
                  }
                })
            } else {
              callback(new Error("不能为空"));
            }
          },
        },
      ],
      purposeWarehouseId: [
        { required: true, message: "请选择", trigger: "change" },
      ],
    });

    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;
    const abnormal_process_status = ref([]);
    const abnormalProcessTypeList = ref([]);
    const abnormal_new_type = ref([]);
    onBeforeMount(() => {});
    onMounted(() => {
      // 仓区
      api.system.getWareHouseList({ type: 0 }).then((res) => {
        if (res.code == 200) {
          data.warehouseAreaList = res.data;
        }
      });
      abnormal_new_type.value = localGet("purchaseDict").abnormal_new_type
        ? localGet("purchaseDict").abnormal_new_type
        : [];
      abnormal_process_status.value = localGet("purchaseDict")
        .abnormal_process_status
        ? localGet("purchaseDict").abnormal_process_status
        : [];
      abnormalProcessTypeList.value = localGet("purchaseDict")
        .abnormal_process_type
        ? localGet("purchaseDict").abnormal_process_type
        : [];
    });
    //打开更多弹窗
    const moreImg = (e) => {
      data.dialogVisibleMore = true;
    };
    const getTableData = inject("getTableData");
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
    //关闭弹窗
    const handleClose = () => {
      data.dialogVisible = false;
      nextTick(() => {
        if (vue.$refs["tableFormRef"][0]) {
          vue.$refs["tableFormRef"][0].clearValidate();
        }
      });
    };
    //关闭更多弹窗
    const closedMore = () => {
      data.dialogVisibleMore = false;
    };
    //点击推仓库
    const submit = (info, parentData) => {
      data.submitActive = true;
      vue.$refs["tableFormRef"][0].validate((valid) => {
        if (valid) {
          data.submitActive = true;
          let vo = JSON.parse(JSON.stringify(parentData));
          info.isPass = true;
          vo.abnormalInfoVo = [info];
          vo.abnormalImg = vo.abnormalImg.length
            ? vo.abnormalImg.join(",")
            : "";
          api.warehouse
            .abnormalDispose(vo)
            .then((res) => {
              if (res.code == 200) {
                vue.$message.success("操作成功!");
                getTableData();
                handleClose();
              } else {
                vue.$message.warning(res.msg);
              }
              data.submitActive = false;
            })
            .catch((err) => {
              data.submitActive = false;
            });
        } else {
          data.submitActive = false;
          return false;
        }
      });
    };
    //打开弹窗
    const openDialog = (abnormalIds, e) => {
      data.tableForm = {};
      data.dialogVisible = false;
      data.typeDialog = "see";
      api.warehouse
        .getNewAbnormalDetail({abnormalId:[abnormalIds]})
        .then((res) => {
          data.submitActive = true;
          if (res.code == 200) {
            if (res.data.length) {
              res.data.map((item) => {
                item.abnormalImg =
                  item.abnormalImg && item.abnormalImg.length
                    ? item.abnormalImg.split(",")
                    : [];
                if (item.abnormalInfoVo.length) {
                  item.abnormalInfoVo.map((ite) => {
                    ite.purposeWarehouseId =
                      ite.purposeWarehouseId == -1
                        ? ""
                        : ite.purposeWarehouseId;
                    ite.purTotalAmount =
                      ite.purTotalAmount == -1 ? "" : ite.purTotalAmount;
                    ite.purPrice = ite.purPrice == -1 ? "" : ite.purPrice;
                    ite.purNum = ite.purNum == -1 ? "" : ite.purNum;
                    ite.financeReceiveAmount =
                      ite.financeReceiveAmount == -1
                        ? ""
                        : ite.financeReceiveAmount;
                  });
                }
              });
            }
            data.tableForm = res.data;
            if (e == "deal") {
              data.typeDialog = e;
            } else {
              data.typeDialog = "see";
            }
            data.dialogVisible = true;
            nextTick(() => {
              if (
                data.tableForm[0].abnormalInfoVo.length &&
                data.tableForm[0].abnormalInfoVo[0].purIsChangeSku == false
              ) {
                tableRules.newSku = [
                  { required: false, message: "请输入新sku", trigger: "blur" },
                ];
              }
              nextTick(() => {
                if (vue.$refs["tableFormRef"][0]) {
                  vue.$refs["tableFormRef"][0].clearValidate();
                }
              });
            });
          }
          data.submitActive = false;
        })
        .catch((err) => {
          data.submitActive = false;
        });
    };

    //预览异常图片
    const viewAbnormalPicture = (e) => {
      data.isAbnormalPictures = true;
      data.abnormalPicture = e;
    };

    //关闭预览异常图片
    const closeAbnormalPicture = () => {
      data.isAbnormalPictures = false;
      data.abnormalPicture = "";
    };

    const refData = toRefs(data);
    return {
      ...refData,
      handleClose,
      submit,
      openDialog,
      tableTypeComputed,
      closedMore,
      abnormalProcessTypeList,
      abnormal_process_status,
      abnormal_new_type,
      moreImg,
      buttonAuthor,
      tableRules,
      viewAbnormalPicture,
      closeAbnormalPicture,
    };
  },
};
</script>
<style scoped lang="scss">
#productExceptionDialog {
  .form-item {
    width: 290px;
  }
  .table-title {
    margin-bottom: 20px;
    font-size: 16px;
  }
  // .table {
  //   ::v-deep .cell {
  //     height: 80px;
  //     line-height: 80px;
  //   }
  // }
}
</style>
