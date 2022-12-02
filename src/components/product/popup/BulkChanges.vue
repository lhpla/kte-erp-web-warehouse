<!--   批量修改dialog框-->
<template>
  <div>
    <el-dialog title="批量修改" width="60%" v-model="editVisible" :close-on-click-modal="false" @closed="closed" destroy-on-close>
      <div class="edit-box">
        <div class="edit-tag">
          <el-tag closable @close="deleteMultiple(item)" v-for="item in multipleList" :key="item.id">{{
            item.productSku
          }}</el-tag>
        </div>
        <div class="edit-user">
          <el-form :model="editParam" ref="searchForm" label-width="110px" :inline="true" :rules="rules" size="small">
            <div v-if="isBatchEdit == 'develop'">
              <!-- 开发 -->
              <el-form-item label="产品分类 :" prop="productName">
                <el-cascader
                  :options="cascaderOptions"
                  v-model="editParam.productClassificationId"
                  :props="cascaderRule"
                  clearable
                  filterable
                  @change="onChange"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="产品SPU:" prop="proSpu">
                <el-select v-model="editParam.proSpu" clearable filterable @change="onSPUChange">
                  <el-option
                    v-for="item in spuOptions"
                    :key="item.id"
                    :label="item.spuCode + '(' + item.spuName + ')'"
                    :value="item.spuCode"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="开发状态 :" prop="proStatus">
                <el-select v-model="editParam.proStatus" filterable clearable placeholder="请选择">
                  <el-option
                    v-for="item in libStatusList"
                    :key="item.devStatus"
                    :label="item.devStatusName"
                    :value="item.devStatus"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="开发负责人 :" prop="exploitUserId">
                <el-select v-model="editParam.exploitUserId" filterable clearable placeholder="请选择">
                  <el-option v-for="item in auditorList" :key="item.id" :label="item.realName" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="咨询负责人 :" prop="informationManId">
                <el-select v-model="editParam.informationManId" filterable clearable placeholder="请选择">
                  <el-option v-for="item in auditorList" :key="item.id" :label="item.realName" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <!-- 采购 -->
            <div v-if="isBatchEdit == 'purchase'">
              <el-form-item label="采购负责人 :" prop="purchaseUserId">
                <el-select v-model="editParam.purchaseUserId" filterable clearable placeholder="请选择">
                  <el-option v-for="item in purchaseUserList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <!--销售 -->
            <div v-if="isBatchEdit == 'sale'">
              <el-form-item label="销售平台 :" prop="salesPlatformId">
                <el-select
                  v-model="editParam.salesPlatformId"
                  @change="changePlatFrom"
                  filterable
                  clearable
                  placeholder="请选择"
                >
                  <el-option v-for="item in salesPlatformList" :key="item.name" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="销售站点 :" prop="salesSiteId">
                <el-select v-model="editParam.salesSiteId" filterable clearable placeholder="请选择">
                  <el-option v-for="item in salesSiteList" :key="item.site" :label="item.site" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <div>
                <el-form-item label="销售负责人 :" prop="salesManagerId">
                  <el-select v-model="editParam.salesManagerId" filterable clearable placeholder="请选择">
                    <el-option v-for="item in sameDepartmentList" :key="item.name" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closed">取 消</el-button>
          <el-button type="primary" @click="batchEditSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject, nextTick } from 'vue'
export default {
  name: 'BulkChanges',
  setup(prop, ctx) {
    const searchForm = ref(null)
    const data = reactive({
      editVisible: false,
      // 产品分类列表
      cascaderOptions: [],
      // 产品分类匹配规则
      cascaderRule: { label: 'name', value: 'id', expandTrigger: 'hover' },
      auditorList: [],
      purchaseUserList: [],
      sameDepartmentList: [],
      salesPlatformList: [],
      salesSiteList: [],
      multipleList: [],
      editParam: {},
      spuOptions: [],
      isBatchEdit: '',
      libStatusList: [], // 开发状态
      rules: {
        salesPlatformId: [{ required: true, trigger: 'change', message: '请选择' }],
        salesSiteId: [{ required: true, trigger: 'change', message: '请选择' }],
        salesManagerId: [{ required: true, trigger: 'change', message: '请选择' }],
      },
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http
    onBeforeMount(() => {})
    onMounted(() => {})
    const onChange = () => {
      data.editParam.proSpu = ''
      data.spuOptions = []
      getSpuByCategory()
    }

    const onSPUChange = () => {
      // data.ruleForm.classify = null;
      getCategoryBySpu()
    }
    // 获取信息
    const getMsg = (msg) => {
      data.editParam = msg.editParam
      data.multipleList = msg.multipleList
      data.isBatchEdit = msg.isBatchEdit
      data.editVisible = true
      api.system.getAllCategoryList({ isDisable: 0 }).then((res) => {
        data.cascaderOptions = res.data
      })
      // 用户列表
      api.system.getMarketingDepartmentList().then((res) => {
        if (res.code == 200) {
          data.sameDepartmentList = res.data
        }
      })
      // 销售平台列表
      api.systemNew.getPlatformAll().then((res) => {
        if (res.code == 200) {
          data.salesPlatformList = res.data
        }
      })
      // 开发状态
      api.product.getProDevStatus().then((res) => {
        if (res.code == 200) {
          data.libStatusList = res.data
        } else {
          vue.$message({
            type: 'warning',
            message: '产品状态列表获取失败',
          })
        }
      })

      // 开发负责人
      api.userOperation.getHeadOfDevelopment().then((res) => {
        if (res.code == 200) {
          data.auditorList = res.data
        }
      })
      // 采购负责人
      api.userOperation.getHeadOfPurchasing().then((res) => {
        if (res.code == 200) {
          data.purchaseUserList = res.data
        }
      })
      getSpuByCategory()
    }

    // 根据平台id获取对应站点列表
    const getStateList = (id) => {
      api.system
        .getSiteByPlat({
          platformId: id,
          isEnglish: false,
          includeFullSite: true,
          isLimit: false,
        })
        .then((res) => {
          if (res.code == 200) {
            data.salesSiteList = res.data
          }
        })
    }

    //平台改变时
    const changePlatFrom = () => {
      data.salesSiteList = []
      data.editParam.salesSiteId = ''
      if (data.editParam.salesPlatformId) {
        getStateList(data.editParam.salesPlatformId)
      }
    }

    // 删除批量修改标签
    const deleteMultiple = (row) => {
      data.multipleList = data.multipleList.filter((item) => {
        return row.id !== item.id
      })
      data.editParam.sku=data.editParam.sku.filter((item)=>{
        return row.productSku !== item
      })
    }
    const getTableData = inject('getTableData')
    // 批量修改提交
    const batchEditSubmit = () => {
      console.log(data.isBatchEdit)
      let isValid = false
      let flag = null
      let proBasicsInfo = {}
      let proPurchaseInfo = {}
      let proMarketInfo = {}
      if (data.editParam.proSpu == '' && data.editParam.productClassificationId) {
        vue.$message.warning('请完善SPU')
        return
      }
      // if (data.editParam.proSpu&&data.editParam.productClassificationId=="") {
      //   vue.$message.warning("3333")
      //   return
      // }
      if (data.isBatchEdit === 'develop') {
        isValid = true
        flag = 1
        proBasicsInfo.proSpu = data.editParam.proSpu ? data.editParam.proSpu : ''
        proBasicsInfo.productClassificationId = data.editParam.productClassificationId
          ? data.editParam.productClassificationId.pop()
          : ''
        // proBasicsInfo.devStatus = data.multipleList[0].devStatus;
        proBasicsInfo.devStatus = data.editParam.proStatus
        proBasicsInfo.exploitUserId = data.editParam.exploitUserId
        proBasicsInfo.informationManId = data.editParam.informationManId // 暂时因为咨询负责人列表为空不传 并且不能传 ''
      } else if (data.isBatchEdit === 'sale') {
        flag = 4
        console.log(data.editParam)
        if (!data.editParam.salesPlatformId) {
          vue.$message({
            type: 'warning',
            message: '未选择平台信息，修改失败',
          })
          return
        }
        if (!data.editParam.salesSiteId) {
          vue.$message({
            type: 'warning',
            message: '未选择站点信息，修改失败',
          })
          return
        }

        searchForm.value.validate((valid) => {
          if (valid) {
            isValid = true
            let salesPlatformName = ''
            let salesSiteName = ''
            let salesManagerName = ''
            data.salesPlatformList.forEach((item) => {
              if (item.id == data.editParam.salesPlatformId) {
                salesPlatformName = item.name
              }
            })
            data.salesSiteList.forEach((item) => {
              if (item.id == data.editParam.salesSiteId) {
                salesSiteName = item.site
              }
            })
            data.sameDepartmentList.forEach((item) => {
              if (item.id == data.editParam.salesManagerId) {
                salesManagerName = item.name
              }
            })
            proMarketInfo.platform = salesPlatformName
            proMarketInfo.platformId = data.editParam.salesPlatformId
            proMarketInfo.site = salesSiteName
            proMarketInfo.siteId = data.editParam.salesSiteId
            proMarketInfo.salesManagerName = salesManagerName
            proMarketInfo.salesManagerId = data.editParam.salesManagerId
          } else {
            vue.$message({
              type: 'warning',
              message: '请选择',
            })
          }
        })
      } else {
        isValid = true
        flag = 2
        proPurchaseInfo.buyerId = data.editParam.purchaseUserId
      }
      let msg = {
        skuList: data.editParam.sku,
        flag: flag,
        proBasicsInfo: proBasicsInfo,
        proPurchaseInfo: proPurchaseInfo,
        proMarketInfo: proMarketInfo,
      }
      isValid &&
        api.product.batchEdit(msg).then((res) => {
          if (res.code === 200) {
            closed()
            getTableData()
            vue.$message({
              type: 'success',
              message: res.msg ? res.msg : '修改成功!',
            })
          } else {
            vue.$message({
              type: 'warning',
              message: res.msg ? res.msg : '修改失败!',
            })
          }
        })
    }
    // 通过选品分类获取SPU
    const getSpuByCategory = () => {
      let id = ''
      console.log('data.editParam.productClassificationId', data.editParam)
      if (typeof data.editParam.productClassificationId == 'string') {
        id = data.editParam.productClassificationId
      } else if (
        typeof data.editParam.productClassificationId == 'object' &&
        data.editParam.productClassificationId !== null
      ) {
        let i = data.editParam.productClassificationId.length - 1
        id = data.editParam.productClassificationId[i]
      }
      api.develop
        .getSpuByCategory({
          sysCategoryId: id,
          type:"1",
        })
        .then((res) => {
          if (res.code == 200) {
            data.spuOptions = res.data
          }
        })
    }

    //通过SPU获取选品分类
    const getCategoryBySpu = () => {
      console.log(data.editParam.proSpu)
      if (data.editParam.proSpu == '') {
        return
      }
      api.develop.getCategoryBySpu({ spuEncode: data.editParam.proSpu }).then((res) => {
        if (res.code == 200) {
          console.log('选品分类', res)
          nextTick(() => {
            data.editParam.productClassificationId = res.data.split(',')
          })
        }
      })
    }
    // 关闭弹框
    const closed = () => {
      data.editVisible = false
      if (searchForm.value) {
        searchForm.value.clearValidate()
        searchForm.value.resetFields()
      }
    }
    const refData = toRefs(data)
    return {
      ...refData,
      getMsg,
      deleteMultiple,
      batchEditSubmit,
      getStateList,
      changePlatFrom,
      searchForm,
      closed,
      getSpuByCategory,
      getCategoryBySpu,
      onSPUChange,
      onChange,
    }
  },
}
</script>
<style scoped lang="scss">
.edit-box {
  display: flex;
  flex-direction: column;

  .edit-tag {
    margin: 0 0 20px 0;

    .el-tag {
      margin: 0 20px 10px 0;
    }
  }

  .edit-user {
    display: flex;

    .el-input,
    .el-select {
      width: 193px;
    }
  }
}
</style>
