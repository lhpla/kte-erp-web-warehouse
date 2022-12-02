<!--CategoryReview  系统品类，spu属性管理,平台类目审核弹窗-->
<template>
  <div id="CategoryReview">
    <el-dialog title="审核" v-model="dialogVisible" width="700px" :close-on-click-modal="false" @close="closed" destroy-on-close>
      <el-form size="mini" label-width="120px" class="demo-ruleForm">
        <!-- 系统品类 -->
        <el-form-item v-if="type == 1 && ruleForm.state == 1" label="开发负责人:" prop="exploitUserId">
          <el-select v-model="ruleForm.responsibleId" multiple filterable clearable placeholder="请选择">
            <el-option :label="item.name" :value="item.id" v-for="item in userList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- spu属性管理 -->
        <el-form-item v-if="type == 3 && ruleForm.state == 1" label="开发负责人:" prop="exploitUserId">
          <el-select v-model="ruleForm.devResponsibility" multiple filterable clearable placeholder="请选择">
            <el-option :label="item.name" :value="item.id" v-for="item in userList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="type == 3 && ruleForm.state == 1" label="采购负责人：" prop="purchaseResponsibility">
          <el-select v-model="ruleForm.purchaseResponsibility" class="form-width" multiple filterable clearable
            placeholder="请选择">
            <el-option v-for="item in headOfPurchasingList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="type == 3 && ruleForm.state == 1" label="补货：" prop="replenishmentResponsibility">
          <el-select v-model="ruleForm.replenishmentResponsibility" class="form-width" multiple filterable clearable
            placeholder="请选择">
            <el-option v-for="item in replenishmentList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="审核意见:" class="form_item">
          <el-radio-group v-model="ruleForm.state" @change="changeState">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="ruleForm.ids.length && ruleForm.ids.length == 1" label="变更信息:" class="form_item">
          <div v-if="label1 != '暂无修改信息'" style="width: 550px">
            {{ label1 + ':' }} 更改前：{{
            ChangeInfo.oldName
            ? ChangeInfo.oldName
            : ChangeInfo.oldChineseCategory
            ? ChangeInfo.oldChineseCategory
            : ChangeInfo.oldSpuDescribe
            ? ChangeInfo.oldSpuDescribe
            : '-'
            }}, 更改后：{{
            ChangeInfo.name
            ? ChangeInfo.name
            : ChangeInfo.chineseCategory
            ? ChangeInfo.chineseCategory
            : ChangeInfo.spuDescribe
            ? ChangeInfo.spuDescribe
            : '-'
            }}；
          </div>
          <div v-if="label2 != '暂无修改信息'" style="width: 550px">
            {{ label2 + ':' }} 更改前：{{
            ChangeInfo.oldEnglishName
            ? ChangeInfo.oldEnglishName
            : ChangeInfo.oldEnglishCategory
            ? ChangeInfo.oldEnglishCategory
            : ChangeInfo.oldEnglishKeyword
            ? ChangeInfo.oldEnglishKeyword
            : '-'
            }}, 更改后：{{
            ChangeInfo.englishName
            ? ChangeInfo.englishName
            : ChangeInfo.englishCategory
            ? ChangeInfo.englishCategory
            : ChangeInfo.englishKeyword
            ? ChangeInfo.englishKeyword
            : '-'
            }}；
          </div>
          <div v-else-if="label1 == '暂无修改信息' && label2 == '暂无修改信息'">暂无修改信息</div>
        </el-form-item>

        <!-- v-if="ruleForm.state == 2" -->
        <el-form-item label="意见说明:" class="form_item">
          <el-input class="textarea" clearable type="textarea" :rows="5" maxlength="500" show-word-limit
            v-model="ruleForm.auditInstructions" placeholder="意见说明"></el-input>
        </el-form-item>
        <div v-if="type == 1 || type == 2" class="tip">
          品类审核 请谨慎操作
          <br />
          审核通过的品类，可在其他模块正常使用
        </div>
        <div v-if="type == 3" class="tip">
          SPU审核 请谨慎操作
          <br />
          审核通过的SPU，可在其他模块正常使用
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="mini" type="primary" @click="onSubmit" :disabled="btnFlag" :loading="btnFlag">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject, nextTick, watch } from 'vue'
export default {
  name: 'CategoryReview',
  props: ['searchMsg'],
  setup(prop, ctx) {
    const data = reactive({
      dialogVisible: false,
      btnFlag: false,
      ruleForm: {
        state: 1,
        ids: [],
      },
      auditorList: [],
      userList: [],
      headOfPurchasingList: [],
      type: '',
      ChangeInfo: {},
      label1: '',
      label2: '',
      replenishmentList: [],
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http
    onBeforeMount(() => { })
    onMounted(() => { })
    const refData = toRefs(data)
    const getTableData = inject('getTableData')

    // 获取数据
    const getMsg = (info) => {
      console.log(info)
      if (Array.isArray(info.msg)) {
        data.ruleForm.ids = info.msg
      } else {
        data.ruleForm.ids = [info.msg]
      }
      data.type = info.type
      data.dialogVisible = true
      if (info.data) {
        data.ChangeInfo = info.data
      }
      data.label1 = data.ChangeInfo.oldName
        ? '品类中文名称'
        : data.ChangeInfo.oldChineseCategory
          ? '平台中文类目'
          : data.ChangeInfo.spuDescribe
            ? 'SPU描述'
            : '暂无修改信息'
      data.label2 = data.ChangeInfo.oldName
        ? '品类英文名称'
        : data.ChangeInfo.oldChineseCategory
          ? '平台类目'
          : data.ChangeInfo.oldEnglishKeyword
            ? '英文关键词'
            : '暂无修改信息'

      if (data.type == 1) {
        // 开发负责人
        api.product.getAssignStaff(data.ruleForm.ids).then((res) => {
          if (res.code == 200) {
            data.userList = res.data.devResponsibility
              api.product.getVerifyPrincipal(data.ruleForm.ids).then((res) => {
                if (res.code == 200 && res.data) {
                  data.ruleForm.responsibleId =JSON.stringify(res.data)!=='{}' ? res.data.split(',') : []
                  console.log(data.ruleForm.responsibleId);
                }
              })
          } else {
            data.tableLoading = false
            vue.$message({
              type: 'warning',
              message: res.msg,
            })
          }
        })
      } else if (data.type == 3) {
        api.product.getPersonInCharge(info.ids).then((res) => {
          if (res.code == 200) {
            data.auditorList = res.data
            data.userList = res.data
            api.userOperation.getHeadOfDevelopment().then(res => {
              if (res.code == 200) {
                data.replenishmentList = res.data;
                api.userOperation.getHeadOfPurchasing().then((res1) => {
                  if (res1.code == 200) {
                    data.headOfPurchasingList = res1.data
                    api.product.getSpuVerifyPrincipal(data.ruleForm.ids).then((res2) => {
                      if (res2.code == 200) {
                        data.ruleForm.devResponsibility =JSON.stringify(res2.data)!=='{}'? res2.data.split(',') : []
                        if (data.ruleForm.ids.length === 1) {
                          api.product.getSpuPropertyPersonInChargeById({ id: data.ruleForm.ids[0] }).then((res2) => {
                            if (res2.code == 200) {
                              data.ruleForm.purchaseResponsibility = res2.data.purchaseResponsibility
                                ? res2.data.purchaseResponsibility.split(',')
                                : []
                              data.ruleForm.replenishmentResponsibility = res2.data.replenishmentResponsibility
                                ? res2.data.replenishmentResponsibility.split(',')
                                : []
                            }
                          })
                        }
                      }
                    })
                  } else {
                    data.tableLoading = false
                    vue.$message({
                      type: 'warning',
                      message: res.msg,
                    })
                  }
                })
              }
            })
          } else {
            data.tableLoading = false
            vue.$message({
              type: 'warning',
              message: res.msg,
            })
          }
        })
      }
    }

    // closed 关闭弹框回调
    const closed = () => {
      data.btnFlag = false
      data.dialogVisible = false
      data.ruleForm = {
        state: 1,
        ids: [],
      }
    }

    const onSubmit = () => {
      data.ruleForm.auditInstructions = data.ruleForm.auditInstructions ? data.ruleForm.auditInstructions.trim() : ''
      if (data.ruleForm.ids.length == 0) {
        vue.$message.warning('批量审核只针对待审核状态数据!')
      } else {
        if (data.ruleForm.state) {
          data.ruleForm.type = "2"
          if (data.type == '2') {
            api.product
              .pcAuditInfo(data.ruleForm)
              .then((res) => {
                if (res.code == 200) {
                  vue.$message({
                    type: 'success',
                    message: res.msg,
                  })
                  data.submitActive = false
                  closed()
                  getTableData(prop.searchMsg)
                } else {
                  vue.$message({
                    type: 'warning',
                    message: res.msg,
                  })
                  data.submitActive = false
                }
              })
              .catch((e) => {
                data.submitActive = false
              })
          } else if (data.type == '3') {
            api.product
              .spAuditInfo(data.ruleForm)
              .then((res) => {
                if (res.code == 200) {
                  vue.$message({
                    type: 'success',
                    message: res.msg,
                  })
                  data.submitActive = false
                  closed()
                  getTableData(prop.searchMsg)
                } else {
                  vue.$message({
                    type: 'warning',
                    message: res.msg,
                  })
                  data.submitActive = false
                }
              })
              .catch((e) => {
                data.submitActive = false
              })
          } else if (data.type == '1') {
            api.product
              .categoryAuditInfo(data.ruleForm)
              .then((res) => {
                if (res.code == 200) {
                  vue.$message({
                    type: 'success',
                    message: res.msg,
                  })
                  data.submitActive = false
                  closed()
                  getTableData(prop.searchMsg)
                } else {
                  vue.$message({
                    type: 'warning',
                    message: res.msg,
                  })
                  data.submitActive = false
                }
              })
              .catch((e) => {
                data.submitActive = false
              })
          }
        } else {
          vue.$message.warning('请选择审核意见')
        }
      }
    }
    // 改变意见时清空负责人数据
    const changeState = () => {
      if (data.ruleForm.state == 2 && data.type == '1') {
        data.ruleForm.responsibleId = []
      } else if (data.ruleForm.state == 2 && data.type == '3') {
        data.ruleForm.devResponsibility = []
        data.ruleForm.purchaseResponsibility = []
        data.ruleForm.replenishmentResponsibility = []
      }
      console.log(data.ruleForm)
    }
    return {
      ...refData,
      closed,
      getMsg,
      onSubmit,
      changeState,
    }
  },
}
</script>
<style scoped lang="scss">
#CategoryReview {
  .textarea {
    width: 85%;
  }

  .tip {
    line-height: 1.5em;
    color: red;
    text-align: center;
  }

  :deep(.el-input__inner) {
    width: 465px;
  }
}
</style>
