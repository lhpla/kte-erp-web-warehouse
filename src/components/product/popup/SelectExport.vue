<!-- 产品库选择 导出 -->
<template>
  <div id="SelectExport">
    <el-dialog
      title="选择导出"
      v-model="selectVisible"
      width="1250px"
      :close-on-click-modal="false"
      :before-close="handleClose"
      destroy-on-close
    >
      <template #title>
        <div class="dialog-title">
          <span>选择导出</span>
          <div>
            <el-button type="primary" @click="handleOpen" size="mini" plain>下载队列</el-button>
          </div>
        </div>
      </template>
      <el-form
        size="mini"
        :model="selectExportList"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        ref="selectExportRef"
      >
        <el-form-item label="文件名称:" prop="fileName">
          <el-input
            v-model.trim="selectExportList.fileName"
            clearable
            style="width: 200px"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="导出的数据:" prop="operationType">
          <el-select v-model="selectExportList.operationType" filterable clearable placeholder="请选择">
            <el-option label="全部记录" value="0"></el-option>
            <el-option label="选中记录" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板名称:" prop="templateId">
          <el-select
            v-model="selectExportList.templateId"
            @change="templateNameChange"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in templateInfoList"
              :key="item.id"
              :label="item.templateName"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button type="text" size="mini" @click="searchShow = !searchShow">
            <i class="el-icon--right" :class="searchShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            设置
          </el-button>
        </el-form-item>
      </el-form>
      <div v-if="searchShow" class="box">
        <el-form
          size="mini"
          :model="saveTemplate"
          :rules="saveRules"
          label-width="120px"
          class="demo-ruleForm"
          ref="saveTemRef"
        >
          <el-form-item label="模板名称:" prop="templateName">
            <el-input
              v-model.trim="saveTemplate.templateName"
              clearable
              style="width: 200px"
              placeholder="请输入"
            ></el-input>
            <el-button type="primary" size="mini" @click="saveTemplateInfo">保存</el-button>
            <el-button type="primary" size="mini" @click="resetTemplateInfo">重置</el-button>
            <el-button type="primary" size="mini" @click="deleteTemplateInfo">删除</el-button>
          </el-form-item>
          <el-form-item label="基础信息：">
            <el-checkbox :indeterminate="basicIsIndeterminate" v-model="basicCheckAll" @change="handleBasicAllChange"
              >全选</el-checkbox
            >
            <el-checkbox-group v-model="basicChecked" @change="handleCheckedBasicChange">
              <el-checkbox v-for="basic in basicField" :label="basic.filedName" :key="basic.filedName">{{
                basic.name
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="采购信息：">
            <el-checkbox
              :indeterminate="purchaseIsIndeterminate"
              v-model="purchaseCheckAll"
              @change="handlePurchaseAllChange"
              >全选</el-checkbox
            >
            <el-checkbox-group v-model="purchaseChecked" @change="handleCheckedPurchaseChange">
              <el-checkbox v-for="purchase in purchaseField" :label="purchase.filedName" :key="purchase.filedName">{{
                purchase.name
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="质检信息：">
            <el-checkbox
              :indeterminate="qualityIndeterminate"
              v-model="qualityCheckAll"
              @change="handleQualityAllChange"
              >全选</el-checkbox
            >
            <el-checkbox-group v-model="qualityChecked" @change="handleCheckedQualityChange">
              <el-checkbox v-for="purchase in qualityField" :label="purchase.filedName" :key="purchase.filedName">{{
                purchase.name
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="销售信息">
            <el-checkbox :indeterminate="salesIndeterminate" v-model="salesCheckAll" @change="handleSalesAllChange"
              >全选</el-checkbox
            >
            <el-checkbox-group v-model="salesChecked" @change="handleCheckedSalesChange">
              <el-checkbox v-for="sales in salesInformationField" :label="sales.filedName" :key="sales.filedName">{{
                sales.name
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="申报信息">
            <el-checkbox
              :indeterminate="declareIndeterminate"
              v-model="declareCheckAll"
              @change="handleDeclareAllChange"
              >全选</el-checkbox
            >
            <el-checkbox-group v-model="declareChecked" @change="handleCheckedDeclareChange">
              <el-checkbox v-for="declare in declareInfoField" :label="declare.filedName" :key="declare.filedName">{{
                declare.name
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="清关信息">
            <el-checkbox
              :indeterminate="customsClearanceInfoIndeterminate"
              v-model="customsClearanceInfoAll"
              @change="customsClearanceChange"
              >全选</el-checkbox
            >
            <el-checkbox-group v-model="customsClearanceInfoChecked" @change="customsClearanceDeclareChange">
              <el-checkbox v-for="declare in declareCustomsField" :label="declare.filedName" :key="declare.filedName">{{
                declare.name
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="虚拟申报信息">
            <el-checkbox
              :indeterminate="virtualDeclareIndeterminate"
              v-model="virtualDeclareCheckAll"
              @change="handleVirtualDeclareAllChange"
              >全选</el-checkbox
            >
            <el-checkbox-group v-model="virtualDeclareChecked" @change="handleCheckedVirtualDeclareChange">
              <el-checkbox
                v-for="virtualDeclare in virtualDeclareInformationField"
                :label="virtualDeclare.filedName"
                :key="virtualDeclare.filedName"
              >
                {{ virtualDeclare.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose" size="mini">取 消</el-button>
          <el-button type="primary" size="mini" @click="handleDown">导 出</el-button>
        </span>
      </template>
    </el-dialog>
    <DownloadListTableCopy ref="DownloadListTable"></DownloadListTableCopy>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from 'vue'
import DownloadListTableCopy from '@/components/download/DownloadListTableCopy.vue'
export default {
  name: 'SelectExport',
  components: {
    DownloadListTableCopy
  },
  setup(prop, ctx) {
    const data = reactive({
      selectVisible: false,
      selectExportList: {
        pids: [],
        fileName: '',
        operationType: '0',
        templateId: '',
      },
      searchShow: false,
      basicCheckAll: false, //基础信息
      basicChecked: [], //基础信息
      basicIsIndeterminate: true, //基础信息
      basicField: [], //基础信息
      purchaseField: [], //采购信息
      purchaseCheckAll: false, //采购信息
      purchaseChecked: [], //采购信息
      purchaseIsIndeterminate: true, //采购信息
      qualityField: [], //质检信息
      qualityCheckAll: false, //质检信息
      qualityChecked: [], //质检信息
      qualityIndeterminate: true, //质检信息
      templateInfoList: [], //模板信息
      salesInformationField: [], //销售信息
      salesChecked: [], //销售信息
      salesCheckAll: false, //销售信息
      salesIndeterminate: true, //销售信息
      declareInfoField: [], //申报信息
      declareChecked: [], //申报信息
      declareCheckAll: false, //申报信息
      declareIndeterminate: true, //申报信息
      declareCustomsField: [], //清关信息
      customsClearanceInfoChecked: [], //清关信息
      customsClearanceInfoAll: false, //清关信息
      customsClearanceInfoIndeterminate: true, //清关信息
      virtualDeclareInformationField: [], //虚拟申报信息
      virtualDeclareChecked: [], //虚拟申报信息
      virtualDeclareCheckAll: false, //虚拟申报信息
      virtualDeclareIndeterminate: true, //虚拟申报信息
      saveTemplate: {
        templateName: '', //文件名
        id: '',
      },
      rules: {
        fileName: [{ required: true, message: '请输入', trigger: 'blur' }],
        operationType: [{ required: true, message: '请选择', trigger: 'change' }],
        templateId: [{ required: true, message: '请选择', trigger: 'change' }],
      },
      saveRules: {
        templateName: [{ required: true, message: '请输入', trigger: 'blur' }],
      },
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http
    const selectExportRef = ref(null)
    onBeforeMount(() => {})
    onMounted(() => {})
    const refData = toRefs(data)
    //获取数据
    const getMsg = (pids, searchMsg) => {
      data.selectVisible = true
      data.selectExportList = JSON.stringify(searchMsg)
      data.selectExportList = JSON.parse(data.selectExportList)
      data.selectExportList.pids = []
      data.selectExportList.pids = pids
      data.selectExportList.operationType = '0'
      //获取字段信息
      api.product.getField().then((res) => {
        if (res.code == 200) {
          data.basicField = res.data.basicField
          data.purchaseField = res.data.purchaseField
          data.qualityField = res.data.qualityInfoExcel
          data.salesInformationField = res.data.salesInformationField
          data.declareInfoField = res.data.declareInfoExcel
          data.declareCustomsField = res.data.declareCustomsExcel
          data.virtualDeclareInformationField = res.data.virtualDeclareInfoExcel
        }
      })
      getTemplateInfo()
    }

    //获取模板信息
    const getTemplateInfo = (templateId) => {
      api.product.getTemplateInfo().then((res) => {
        if (res.code == 200) {
          data.templateInfoList = res.data
          if (templateId) {
            data.selectExportList.templateId = templateId
            templateNameChange(templateId)
          } else {
            data.selectExportList.templateId = data.templateInfoList[0].id
            templateNameChange(data.selectExportList.templateId)
          }
        }
      })
    }

    //基础信息
    const handleBasicAllChange = (val) => {
      if (val) {
        for (let item of data.basicField) {
          data.basicChecked.push(item.filedName)
        }
      } else {
        data.basicChecked = []
      }
    }
    //基础信息
    const handleCheckedBasicChange = (value) => {
      let checkedCount = value.length
      data.basicCheckAll = checkedCount === data.basicField.length
      data.basicIsIndeterminate = checkedCount > 0 && checkedCount < data.basicField.length
    }

    //采购信息
    const handlePurchaseAllChange = (val) => {
      if (val) {
        for (let item of data.purchaseField) {
          data.purchaseChecked.push(item.filedName)
        }
      } else {
        data.purchaseChecked = []
      }
    }
    //采购信息
    const handleCheckedPurchaseChange = (value) => {
      let checkedCount = value.length
      data.purchaseCheckAll = checkedCount === data.purchaseField.length
      data.purchaseIsIndeterminate = checkedCount > 0 && checkedCount < data.purchaseField.length
    }

    //质检信息
    const handleQualityAllChange = (val) => {
      if (val) {
        for (let item of data.qualityField) {
          data.qualityChecked.push(item.filedName)
        }
      } else {
        data.qualityChecked = []
      }
    }
    //质检信息
    const handleCheckedQualityChange = (value) => {
      let checkedCount = value.length
      data.qualityCheckAll = checkedCount === data.qualityField.length
      data.qualityIndeterminate = checkedCount > 0 && checkedCount < data.qualityField.length
    }
    //销售信息
    const handleSalesAllChange = (val) => {
      if (val) {
        for (let item of data.salesInformationField) {
          data.salesChecked.push(item.filedName)
        }
      } else {
        data.salesChecked = []
      }
    }
    //销售信息
    const handleCheckedSalesChange = (value) => {
      let checkedCount = value.length
      data.salesCheckAll = checkedCount === data.salesInformationField.length
      data.salesIndeterminate = checkedCount > 0 && checkedCount < data.salesInformationField.length
    }
    //申报信息
    const handleDeclareAllChange = (val) => {
      if (val) {
        for (let item of data.declareInfoField) {
          data.declareChecked.push(item.filedName)
        }
      } else {
        data.declareChecked = []
      }
    }

    //清关信息
    const customsClearanceChange = (val) => {
      if (val) {
        for (let item of data.declareCustomsField) {
          data.customsClearanceInfoChecked.push(item.filedName)
        }
      } else {
        data.customsClearanceInfoChecked = []
      }
    }
    //申报信息
    const handleCheckedDeclareChange = (value) => {
      let checkedCount = value.length
      data.declareCheckAll = checkedCount === data.declareInfoField.length
      data.declareIndeterminate = checkedCount > 0 && checkedCount < data.declareInfoField.length
    }

    //清关信息
    const customsClearanceDeclareChange = (value) => {
      let checkedCount = value.length
      data.customsClearanceInfoAll = checkedCount === data.declareCustomsField.length
      data.customsClearanceInfoIndeterminate = checkedCount > 0 && checkedCount < data.declareCustomsField.length
    }

    //虚拟申报信息
    const handleVirtualDeclareAllChange = (val) => {
      if (val) {
        for (let item of data.virtualDeclareInformationField) {
          data.virtualDeclareChecked.push(item.filedName)
        }
      } else {
        data.virtualDeclareChecked = []
      }
    }
    //虚拟申报信息
    const handleCheckedVirtualDeclareChange = (value) => {
      let checkedCount = value.length
      data.virtualDeclareCheckAll = checkedCount === data.virtualDeclareInformationField.length
      data.virtualDeclareIndeterminate = checkedCount > 0 && checkedCount < data.virtualDeclareInformationField.length
    }
    //关闭
    const handleClose = (done) => {
      data.selectVisible = false
    }

    const saveTemRef = ref(null)

    //数组去重
    const unique = (arr) => {
      let arr1 = []
      for (var i = 0, len = arr.length; i < len; i++) {
        if (arr1.indexOf(arr[i]) === -1) {
          arr1.push(arr[i])
        }
      }
      return arr1
    }

    //resetTemplateInfo 重置
    const resetTemplateInfo = () => {
      data.basicChecked = []
      data.purchaseChecked = []
      data.qualityChecked = []
      data.salesChecked = []
      data.declareChecked = []
      data.virtualDeclareChecked = []
      data.saveTemplate.templateName = ''
      data.saveTemplate.id = ''
    }

    //保存模板
    const saveTemplateInfo = () => {
      saveTemRef.value.validate((valid) => {
        //去掉重复字段
        data.basicChecked = unique(data.basicChecked)
        data.purchaseChecked = unique(data.purchaseChecked)
        data.qualityChecked = unique(data.qualityChecked)
        data.salesChecked = unique(data.salesChecked)
        data.declareChecked = unique(data.declareChecked)
        data.virtualDeclareChecked = unique(data.virtualDeclareChecked)
        if (valid) {
          let msg = {
            basicInfoField: String(data.basicChecked),
            createUserId: 0,
            purchaseInfoField: String(data.purchaseChecked),
            salesInfoField: String(data.salesChecked),
            qualityInfoField: String(data.qualityChecked),
            declareInfoField: String(data.declareChecked),
            declareCustomsField: String(data.customsClearanceInfoChecked),
            virtualDeclareInfoField: String(data.virtualDeclareChecked),
            templateName: data.saveTemplate.templateName,
          }
          if (data.saveTemplate.id) {
            msg.id = data.saveTemplate.id
            api.product.updateTemplateInfo(msg).then((res) => {
              if (res.code == 200) {
                vue.$message({
                  type: 'success',
                  message: res.msg,
                })
                getTemplateInfo(data.selectExportList.templateId)
              } else {
                vue.$message({
                  type: 'warning',
                  message: res.msg,
                })
              }
            })
          } else {
            api.product.saveTemplateInfo(msg).then((res) => {
              if (res.code == 200) {
                vue.$message({
                  type: 'success',
                  message: res.msg,
                })
                getTemplateInfo(res.data)
              } else {
                vue.$message({
                  type: 'warning',
                  message: res.msg,
                })
              }
            })
          }
        }
      })
    }

    //顶部模板切换
    const templateNameChange = (e) => {
      if (e) {
        //获取模板信息详情
        api.product.getTemplateInfoDetail({ id: e }).then((res) => {
          if (res.code == 200) {
            data.basicChecked = res.data.basicInfoField ? res.data.basicInfoField.split(',') : []
            data.purchaseChecked = res.data.purchaseInfoField ? res.data.purchaseInfoField.split(',') : []
            data.salesChecked = res.data.salesInfoField ? res.data.salesInfoField.split(',') : []
            data.qualityChecked = res.data.qualityInfoField ? res.data.qualityInfoField.split(',') : []
            data.declareChecked = res.data.declareInfoField ? res.data.declareInfoField.split(',') : []
            data.customsClearanceInfoChecked = res.data.declareCustomsField
              ? res.data.declareCustomsField.split(',')
              : []
            data.virtualDeclareChecked = res.data.virtualDeclareInfoField
              ? res.data.virtualDeclareInfoField.split(',')
              : []
            data.saveTemplate.templateName = res.data.templateName
            data.saveTemplate.id = res.data.id
          }
        })
      } else {
        data.basicChecked = []
        data.purchaseChecked = []
        data.salesChecked = []
        data.qualityChecked = []
        data.declareChecked = []
        data.virtualDeclareChecked = []
        data.saveTemplate.templateName = ''
        data.saveTemplate.id = ''
      }
    }

    //删除
    const deleteTemplateInfo = () => {
      vue
        .$confirm('此操作将删除此模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          api.product.deleteTemplateInfo({ id: data.saveTemplate.id }).then((res) => {
            if (res.code == 200) {
              vue.$message({
                type: 'success',
                message: res.msg,
              })
              getTemplateInfo()
              templateNameChange('')
              data.selectExportList.templateNameId = ''
            } else {
              vue.$message({
                type: 'warning',
                message: res.msg,
              })
            }
          })
        })
        .catch(() => {
          vue.$message({
            type: 'info',
            message: '已取消修改',
          })
        })
    }

    //导出
    const handleDown = () => {
      selectExportRef.value.validate((f) => {
        if (f) {
          if (data.selectExportList.affiliateSalesManager) {
            data.selectExportList.affiliateSalesManager =
              data.selectExportList.affiliateSalesManager.length > 0
                ? data.selectExportList.affiliateSalesManager.split(',')
                : []
          }
          api.product.exportProduct(data.selectExportList).then((res) => {
            if (res.code == 200) {
              vue.$message({
                type: 'success',
                message: res.msg,
              })
            } else {
              vue.$message({
                type: 'warning',
                message: res.msg,
              })
            }
          })
        }
      })
    }

    //打开消息队列
    const handleOpen = () => {
      vue.$refs.DownloadListTable.getMsg()
    }
    return {
      ...refData,
      getMsg,
      handleClose,
      handleBasicAllChange,
      handleCheckedBasicChange,
      handlePurchaseAllChange,
      handleCheckedPurchaseChange,
      resetTemplateInfo,
      saveTemplateInfo,
      saveTemRef,
      templateNameChange,
      deleteTemplateInfo,
      handleOpen,
      handleDown,
      handleSalesAllChange,
      handleCheckedSalesChange,
      handleCheckedQualityChange,
      handleQualityAllChange,
      selectExportRef,
      unique,
      handleDeclareAllChange,
      handleCheckedDeclareChange,
      handleVirtualDeclareAllChange,
      handleCheckedVirtualDeclareChange,
      customsClearanceChange,
      customsClearanceDeclareChange,
    }
  },
}
</script>
<style scoped lang="scss">
#SelectExport {
  .dialog-title {
    display: flex;
    justify-content: space-between;
    padding: 0 50px 0 0;
    align-items: center;
    span {
      font-size: 16px;
    }
  }

  .box {
    border: 1px solid #eee;
    padding: 15px 0;
    .el-button {
      margin-left: 10px;
    }
  }
}
</style>
