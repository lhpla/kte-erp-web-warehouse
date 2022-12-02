<!--PropertyManageTable  SPU属性管理表格-->
<template>
  <div id="PropertyManageTable">
    <vxe-toolbar ref="vxeTableDataHead" custom>
      <template #buttons>
        <div class="table-header">
          <div class="font">
            <div>不通过: {{ failCount }}</div>
            <div>通过：{{ passCount }}</div>
            <div>待审核：{{ waitingAuditCount }}</div>
          </div>
          <div>
            <el-button
              type="primary"
              v-if="buttonAuthor.totalForbit && personnel == 1"
              size="mini"
              @click="handleStateAll(1)"
              >批量禁用</el-button
            >
            <el-button
              type="primary"
              v-if="buttonAuthor.totalAction && personnel == 1"
              size="mini"
              @click="handleStateAll(0)"
              >批量启用</el-button
            >
            <el-button type="primary" v-if="buttonAuthor.totalDelete" @click="handleDelete" size="mini">批量删除</el-button>
            <el-button type="primary" size="mini" v-if="buttonAuthor.add" @click="handleProduct('add')">新增</el-button>
            <el-dropdown v-if="buttonAuthor.leadImport" style="margin:0 10px;">
              <el-button type="primary" size="mini">
                导入负责人
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="importCharge('1')" v-if="buttonAuthor.leadImport">开发负责人导入</el-dropdown-item>
                  <el-dropdown-item @click="importCharge('2')" v-if="buttonAuthor.leadImport">采购负责人导入</el-dropdown-item>
                  <el-dropdown-item @click="importCharge('3')" v-if="buttonAuthor.leadImport">补货负责人导入</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <!-- <el-button type="primary" v-if="buttonAuthor.leadImport" size="mini" @click="importCharge">导入负责人</el-button> -->
            <el-button type="primary" size="mini" v-if="buttonAuthor.distribution" @click="allocation"
              >分配负责人</el-button
            >
            <el-button type="primary" size="mini" v-if="buttonAuthor.totalAudit" @click="audit(choiceList, 3)"
              >批量审核</el-button
            >
            <el-button type="primary" size="mini" v-if="buttonAuthor.update" @click="upDate">更新</el-button>
            <el-button type="primary" size="mini" v-if="buttonAuthor.import" @click="bulkImport">导入</el-button>
            <el-button type="primary" size="mini" v-if="buttonAuthor.batchUpload" @click="batchExport">导出</el-button>
          </div>
        </div>
      </template>
    </vxe-toolbar>

    <!-- :row-config="{ keyField: 'id' }" -->

    <div class="table">
      <vxe-table
        ref="vxeTableData"
        :custom-config="{ storage: true }"
        :column-config="{ resizable: true }"
        :tooltip-config="{ showAll: true, contentMethod }"
        :tree-config="{ rowField: 'id', parentField: 'parentId' }"
        :checkbox-config="{ labelField: 'id', highlight: true }"
        :data="tableData"
        :height="tableHeight"
        @checkbox-all="selectChangeEventAll"
        @checkbox-change="selectChangeEvent"
        border
        :row-style="rowStyle"
        :cell-style="{ padding: '0px' }"
        v-loading="tableLoading"
        id="PropertyTable"
      >
        <vxe-column type="checkbox" align="left" width="50" tree-node>
          <template></template>
        </vxe-column>
        <vxe-column field="encode" prop="encode" min-width="120" title="编码" align="center" tree-node show-overflow>
          <template #default="scope">
            <span class="spanStyle" style="cursor: pointer" @click="goto(scope.row)">{{
              scope.row.encode ? scope.row.encode : '-'
            }}</span>
          </template>
        </vxe-column>
        <vxe-column field="imageUrl" prop="imageUrl" align="center" title="图片" width="90">
          <template #default="scope">
            <el-popover placement="right" trigger="hover" width="250" v-if="scope.row.imageUrl">
              <template #reference>
                <img
                  style="width: 60px; height: 60px; object-fit: contain; margin-top: 3px"
                  loading="lazy"
                  :src="scope.row.imageUrl"
                />
              </template>
              <img :src="scope.row.imageUrl" loading="lazy" style="width: 400px; height: 300px; object-fit: contain" />
            </el-popover>
            <div v-else>暂无图片</div>
          </template>
        </vxe-column>

        <vxe-column field="spuDescribe" prop="spuDescribe" title="SPU描述" min-width="120">
          <template #default="scope">
            <span class="spanStyle">{{ scope.row.spuDescribe ? scope.row.spuDescribe.replace(/\n/g, ' ') : '-' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="englishKeyword" prop="englishKeyword" align="center" width="120" title="英文关键词" show-overflow>
          <template #default="scope">
            <span class="spanStyle">{{ scope.row.englishKeyword ? scope.row.englishKeyword : '-' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="chineseKeyword" prop="chineseKeyword" align="center" width="120" title="中文关键词" show-overflow>
          <template #default="scope">
            <span class="spanStyle">{{ scope.row.chineseKeyword ? scope.row.chineseKeyword : '-' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="remark" prop="remark" align="center" width="120" title="备注">
          <template #default="scope">
            <span>{{ scope.row.remark ? scope.row.remark : '-' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="chineseName" prop="remark" align="center" width="120" title="中文系统品类">
          <template #default="scope">
            <span>{{ scope.row.sysCategoryName ? scope.row.sysCategoryName : '-' }}</span>
          </template>
        </vxe-column>
        <vxe-column field="englishName" prop="remark" align="center" width="120" title="英文系统品类">
          <template #default="scope">
            <span>{{ scope.row.sysCategoryEnglishName ? scope.row.sysCategoryEnglishName : '-' }}</span>
          </template>
        </vxe-column>
        <!-- <vxe-column field="sysCategoryName" prop="sysCategoryName" width="120" align="center" title="系统品类">
          <template #default="scope">
            <div class="spanStyle">
              <span>{{ scope.row.sysCategoryName ? scope.row.sysCategoryName : '-' }}</span>
            </div>
          </template>
        </vxe-column>-->
        <vxe-column field="isDisable" title="启用" align="center" width="80" sortable v-if="buttonAuthor.activation">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isDisable"
              :disabled="scope.row.state != 1 || personnel != 1"
              :active-value="0"
              :inactive-value="1"
              @click="handleState(scope.row)"
            ></el-switch>
          </template>
        </vxe-column>
        <vxe-column field="state" prop="state" title="状态" align="center" show-overflow width="80">
          <template #default="scope">
            <span>{{ tableTypeComputed(platform_category_state, scope.row.state) }}</span>
            <el-popover
              v-if="scope.row.state != 3 && scope.row.state != -1"
              ref="popover1"
              popper-class="PlatformCategoryTable"
              placement="right-start"
              :width="420"
              trigger="click"
              @show="showPopver(scope.row)"
            >
              <template #reference>
                <el-button class="tipInfo" @click="tooltipFlag = !tooltipFlag">
                  <i class="el-icon-question" style="color: #409eff; font-size: 17px"></i>
                </el-button>
              </template>
              <div v-loading="sendLoading" class="auditInstructions">
                {{ auditInstructions != '' ? auditInstructions : '暂无意见' }}
              </div>
            </el-popover>
          </template>
        </vxe-column>
        <vxe-column field="acronym" prop="acronym" title="负责人" min-width="120">
          <template #default="scope">
            <div class="spanStyle">
              <span>开发：{{ scope.row.devResponsibilityName ? scope.row.devResponsibilityName : '-' }}&emsp;</span>
              <br/>
              <span
                >采购：{{
                  scope.row.purchaseResponsibilityName ? scope.row.purchaseResponsibilityName : '-'
                }}&emsp;</span
              >
              <br/>
              <span
                >补货：{{
                  scope.row.replenishmentResponsibilityName ? scope.row.replenishmentResponsibilityName : '-'
                }}</span
              >
            </div>
          </template>
        </vxe-column>
        <vxe-column field="header" title="操作人" min-width="130">
          <template #default="scope">
            <div class="spanStyle">
              <span>录入人：{{ scope.row.createUserName ? scope.row.createUserName : '-' }}&emsp;</span>
              <br/>
              <span>提交人：{{ scope.row.updateUserName ? scope.row.updateUserName : '-' }}&emsp;</span>
              <br/>
              <span>审核人：{{ scope.row.auditUserName ? scope.row.auditUserName : '-' }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="auditTime" title="时间" width="160" show-overflow>
          <template #default="scope">
            <div class="spanStyle">
              <span>录入：{{ scope.row.createTime ? scope.row.createTime : '-' }}&emsp;</span>
              <br/>
              <span>更新：{{ scope.row.updateTime ? scope.row.updateTime : '-' }}&emsp;</span>
              <br/>
              <span>审核：{{ scope.row.auditTime ? scope.row.auditTime : '-' }}</span>
            </div>
          </template>
        </vxe-column>
        <vxe-column
          field="operation"
          align="center"
          width="210"
          class-name="table-operation"
          title="操作"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              v-if="scope.row.state == 3 && buttonAuthor.audit"
              size="mini"
              icon="el-icon-edit"
              type="text"
              @click="audit(scope.row, 3)"
              >审核</el-button
            >
            <el-button
              v-if="buttonAuthor.edit && scope.row.state != 3"
              size="mini"
              icon="el-icon-edit"
              type="text"
              @click="handleProduct('edit', scope.row)"
              >编辑</el-button
            >
            <el-button
              v-if="buttonAuthor.delete"
              size="mini"
              icon="el-icon-delete"
              type="text"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
            <el-button
              v-if="buttonAuthor.log"
              size="mini"
              icon="el-icon-tickets"
              type="text"
              @click="operationLog(scope.row.id)"
              >日志</el-button
            >
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <PropertyManageEdit ref="PropertyManageEdit"></PropertyManageEdit>
    <!-- 日志 -->
    <PropertyManageLog ref="PropertyManageLog"></PropertyManageLog>
    <!-- 分配负责人 -->
    <DistributionOfficer ref="DistributionOfficer"></DistributionOfficer>
    <!-- 审核 -->
    <CategoryReview ref="CategoryReview" :searchForm="searchForm"></CategoryReview>
    <!-- 导入 -->
    <AllDownDialog :title="AllDownDialogTitle" ref="AllDownDialog"></AllDownDialog>
    <!-- <ContractDownload ref="ContractDownload"></ContractDownload> -->

    <ChargeDownDialog :title="AllDownDialogTitle" ref="ChargeDownDialog"></ChargeDownDialog>
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
  provide,
} from 'vue'
import PropertyManageEdit from './PropertyManageEdit.vue'
import authorButtons from '@/compositionApi/authorButtons'
import DistributionOfficer from '@/components/product/PropertyManage/DistributionOfficer.vue'
import PropertyManageLog from '@/components/product/PropertyManage/PropertyManageLog.vue'
import CategoryReview from '@/components/product/systemCategory/CategoryReview.vue'
import { localGet, download } from '@/utils/util'
import { useTableHeight } from '@/compositionApi/useTableHeight.js'
import ChargeDownDialog from '@/components/allDownDialog/ChargeDownDialog.vue'

export default {
  name: 'PropertyManageTable',
  props: ['tableData', 'tableLoading', 'searchMsg', 'searchForm', 'passCount', 'failCount', 'waitingAuditCount'],
  components: {
    PropertyManageEdit,
    PropertyManageLog,
    DistributionOfficer,
    CategoryReview,
    ChargeDownDialog
},
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons()
    const buttonAuthor = BUTTONS.value
    const vxeTableData = ref(null)
    const vxeTableDataHead = ref(null)
    const { tableHeight } = useTableHeight(270)
    const data = reactive({
      platform_category_state: [], //状态
      choiceList: [],
      auditInstructions: '',
      sendLoading: false,
      AllDownDialogTitle: '导入',
      personnel: null,
      selectList:[],
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http
    onBeforeMount(() => {})
    onMounted(() => {
      getDictList()
    })
    const refData = toRefs(data)
    const getTableData = inject('getTableData')

    // // 批量选择
    // const handleSelectionChange = row => {
    //   data.choiceList = row.map(i => {
    //     return i.id;
    //   });
    // };

    //批量启用禁用
    const handleStateAll = (type) => {
      if (data.choiceList.length < 1) {
        vue.$message.warning('未选择数据')
      } else {
        if (type == 1) {
          let info = {
            ids: data.choiceList,
            isDisable: type,
          }
          vue
            .$confirm(`是否开启SPU禁用？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            })
            .then(() => {
              data.tableLoading = true
              api.product.updateIsDisable(info).then((res) => {
                if (res.code == 200) {
                  vue.$message.success(res.msg)
                  getTableData()
                } else {
                  vue.$message.warning(res.msg)
                }
              })
            })
            .catch(() => {
              productInfo.isDisable == 0 ? (productInfo.isDisable = 1) : (productInfo.isDisable = 0)
            })
        } else {
          let info = {
            ids: data.choiceList,
            isDisable: type,
          }
          vue
            .$confirm(`是否开启SPU启用？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            })
            .then(() => {
              data.tableLoading = true
              api.product.updateIsDisable(info).then((res) => {
                if (res.code == 200) {
                  vue.$message.success(res.msg)
                  getTableData()
                } else {
                  vue.$message.warning(res.msg)
                }
              })
            })
            .catch(() => {
              productInfo.isDisable == 0 ? (productInfo.isDisable = 1) : (productInfo.isDisable = 0)
            })
        }
      }
    }

    // 打开批量导入dialog
    const bulkImport = () => {
      let info = {
        title: 'spu属性管理导入模板',
        temp: 'spuPropertyBatchImportTemplate',
        import: 'spuPropertyBatchImport',
        servers: 'product',
      }
      data.AllDownDialogTitle = '导入'
      nextTick(() => {
        vue.$refs.AllDownDialog.checkDialog(true, info)
      })
    }

    // 打开批量更新
    const upDate = () => {
      let info = {
        title: 'spu属性管理更新模板',
        temp: 'spuPropertyBatchUpdateTemplate',
        import: 'spuPropertyBatchUpdate',
        servers: 'product',
      }
      data.AllDownDialogTitle = '更新'
      nextTick(() => {
        vue.$refs.AllDownDialog.checkDialog(true, info)
      })
    }

    //导出
    const batchExport = () => {
      if (data.choiceList.length) {
        let info = { ids: data.choiceList }
        api.product.spuPropertyExport(info).then((res) => {
          let tempName = 'spu属性管理'
          let fileType = '.xlsx'
          const blob = new Blob([res], {
            type: 'application/vnd.ms-excel;charset=UTF-8',
          })
          if ('msSaveOrOpenBlob' in navigator) {
            window.navigator.msSaveOrOpenBlob(blob, tempName + fileType)
            return
          }
          const blobUrl = window.URL.createObjectURL(blob)
          download(blobUrl, tempName, fileType)
        })
      } else {
        api.product.spuPropertyExport(vue.$props.searchMsg).then((res) => {
          let tempName = 'spu属性管理'
          let fileType = '.xlsx'
          const blob = new Blob([res], {
            type: 'application/vnd.ms-excel;charset=UTF-8',
          })
          if ('msSaveOrOpenBlob' in navigator) {
            window.navigator.msSaveOrOpenBlob(blob, tempName + fileType)
            return
          }
          const blobUrl = window.URL.createObjectURL(blob)
          download(blobUrl, tempName, fileType)
        })
      }
    }

    //监听弹窗页面滚动关闭打开的popover 组件
    const handleScroll = () => {
      if (vue.$refs.popover1) {
        nextTick(() => {
          vue.$refs.popover1.hide()
        })
      }
    }

    //点击提示框，显示审核意见
    const showPopver = (row) => {
      console.log(vue.$refs.popover1)
      // // 获取审核信息
      data.sendLoading = true
      console.log(row)

      api.product
        .spuPropertyGetDetail({ id: row.id })
        .then((res) => {
          if (res.code == 200) {
            data.auditInstructions = res.data.auditInstructions
            data.sendLoading = false
          } else {
            vue.$message.warning(res.msg)
            data.sendLoading = false
          }
        })
        .catch((err) => {
          data.sendLoading = false
        })
    }

    const selectChangeEventAll = ({ $table }) => {
      const records = $table.getCheckboxRecords()
      // console.info(`勾选${records.length}个树形节点`, records);
      data.selectList=records;
      data.choiceList = records.map((i) => {
        return i.id
      })
      console.log(data.choiceList)
    }

    const selectChangeEvent = ({ checked, $table, row }) => {
      const records = $table.getCheckboxRecords()
      // console.info("----", `勾选${records.length}个树形节点`, records);
      data.choiceList = records.map((i) => {
        return i.id
      })
      data.selectList=records;
      console.log(data.choiceList)
    }

    //获取字典
    const getDictList = () => {
      data.platform_category_state = localGet('dictCodeList').platform_category_state
        ? localGet('dictCodeList').platform_category_state
        : []
      console.log(data.platform_category_state)
      api.product
        .spuPropertyGetUserSpuAuth()
        .then((res) => {
          console.log(res)
          data.personnel = res.data
        })
        .catch((error) => {})
    }

    //审核单条
    const audit = (msg, type) => {
      let ids=''
      if (Array.isArray(msg)) {
        ids=msg
      }else{
        ids=msg.id
      }
      let info = {
        msg: ids,
        type: type,
      }
      if (ids.length > 0) {
        if (data.choiceList.length == 1) {
          if (Array.isArray(info.msg)) {
            api.product.spuPropertyGetDetail({ id: msg[0] }).then((res) => {
              if (res.code == 200) {
                info.data = res.data
                info.ids =data.selectList.map(i=>i.sysCategoryId)
                nextTick(() => {
                  vue.$refs.CategoryReview.getMsg(info)
                })
              }
            })
          } else {
            api.product.spuPropertyGetDetail({ id: info.msg }).then((res) => {
              if (res.code == 200) {
                info.data = res.data
                info.ids=[msg.sysCategoryId]
                nextTick(() => {
                  vue.$refs.CategoryReview.getMsg(info)
                })
              }
            })
          }
        } else {
          // api.product.spuPropertyGetDetail({ id: msg }).then(res => {
          //   if (res.code == 200) {
          //     info.data = res.data;
          if (Array.isArray(msg)) {
            info.ids =data.selectList.map(i=>i.sysCategoryId)
          }else{
            info.ids=[msg.sysCategoryId]
          }
          nextTick(() => {
            vue.$refs.CategoryReview.getMsg(info)
          })
          //   }
          // });
        }
      } else {
        vue.$message.warning('未选择数据，请勾选！')
      }
    }

    //tootip配置
    const contentMethod = ({ row, columnIndex, rowIndex, type, column }) => {
      if (type == 'header') {
        return ''
      }
      if (column.title == '操作') {
        return ''
      }
    }

    // 删除品类
    const handleDelete = (row) => {
      let info = {
        ids: [],
      }
      if (row.id) {
        info.ids = [row.id]
      } else {
        info.ids = data.choiceList
      }
      vue
        .$confirm(` `, {
          title: '提示',
          dangerouslyUseHTMLString: true,
          message:
            '<div style=margin-left:20px><b style=font-size:14px>SPU属性删除后无法恢复 请谨慎操作!</b></div><div style=margin-left:20px>删除条件：无关联数据！若有请解除关系后删除！</div>',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })

        .then(() => {
          api.product
            .spBatchDeletion(info)
            .then((res) => {
              if (res.code == 200) {
                console.log(res)
                vue.$message({
                  type: 'success',
                  message: res.msg,
                })
                if (row.id) {
                  removeRow(row)
                } else {
                  vue.$props.tableData.forEach((item) => {
                    data.choiceList.forEach((i) => {
                      if (item.id == i) {
                        removeRow(item)
                      }
                    })
                  })
                }
                // getTableData();
              } else {
                vue.$message({
                  type: 'warning',
                  message: res.msg,
                })
              }
            })
            .catch(() => {
              vue.$message({
                type: 'info',
                message: '已取消修改',
              })
            })
        })
    }

    //表格假删
    const removeRow = async (row) => {
      const $table = vxeTableData.value
      await $table.remove(row)
    }

    //日志
    const operationLog = (id) => {
      vue.$refs.PropertyManageLog.checkLogDialog(id)
    }

    //分配负责人
    const allocation = () => {
      if (data.selectList.length < 1) {
        vue.$message.warning('未选择数据，请勾选！')
      } else {
        vue.$refs.DistributionOfficer.getMsg(data.selectList)
      }
    }

    // 切换品类状态
    const handleState = (productInfo) => {
      if (productInfo.state != 1 || data.personnel != 1) {
        return
      } else {
        let info = {
          ids: [productInfo.id],
          isDisable: productInfo.isDisable,
        }
        vue
          .$confirm(`是否${productInfo.isDisable == 1 ? '禁用' : '启用'}此SPU？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(() => {
            data.tableLoading = true
            api.product.updateIsDisable(info).then((res) => {
              if (res.code == 200) {
                vue.$message.success(res.msg)
                getTableData()
              } else {
                vue.$message.warning(res.msg)
              }
            })
          })
          .catch(() => {
            productInfo.isDisable == 0 ? (productInfo.isDisable = 1) : (productInfo.isDisable = 0)
          })
      }
    }

    // 编辑
    const handleProduct = (type, row) => {
      let msg = {
        type: type,
        row: row || '',
      }
      vue.$refs.PropertyManageEdit.getMsg(msg)
    }

    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (list, dizKey) {
        if (list.length > 1 && dizKey !== -1) {
          for (const item of list) {
            if (dizKey == item.dizKey) {
              return item.value
            }
          }
        }
      }
    })

    //判断当前行的颜色
    const rowStyle = ({ row }) => {
      if (row.isCategoryUpdate == 1) {
        return {
          color: 'red',
          height: '20px',
        }
      }
    }

     //导入负责人
     const importCharge = (num) => {
      let tempTitle="";
      if (num==1) {
        tempTitle="开发负责人导入"
      }
      if (num==2) {
        tempTitle="采购负责人导入"
      }
      if (num==3) {
        tempTitle="补货负责人导入"
      }
      let info = {
        title: tempTitle+"模板",
        temp: "getPrincipalTemplate",
        import: "updatePrincipal",
        servers: "product",
        istype:"2",
        excelType:num
      };
      data.AllDownDialogTitle = tempTitle;
      nextTick(() => {
        vue.$refs.ChargeDownDialog.checkDialog(true, info);
      });
    }

    nextTick(() => {
      // 将表格和工具栏进行关联
      const $table = vxeTableData.value
      const $toolbar = vxeTableDataHead.value
      $table.connect($toolbar)
    })

    const goto = (row) => {
      const isPro =
        process.env.NODE_ENV === 'master' || process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'state'
      const url = isPro ? '/main/warehouse/product/productLibrary/list' : '/warehouse/product/productLibrary/list'
      window.open(`${url}?encode=${row.encode}`)
    }

    return {
      ...refData,
      goto,
      handleDelete,
      handleProduct,
      operationLog,
      // handleSelectionChange,
      handleState,
      buttonAuthor,
      allocation,
      audit,
      tableTypeComputed,
      getDictList,
      selectChangeEventAll,
      selectChangeEvent,
      showPopver,
      handleScroll,
      bulkImport,
      upDate,
      batchExport,
      vxeTableData,
      vxeTableDataHead,
      tableHeight,
      rowStyle,
      contentMethod,
      handleStateAll,
      importCharge
    }
  },
}
</script>
<style scoped lang="scss">
#PropertyManageTable {
  :deep(.has-gutter .el-table_1_column_4) {
    .cell {
      text-align: center;
    }
  }
  :deep(.has-gutter .el-table_1_column_9) {
    .cell {
      text-align: center;
    }
  }
  :deep(.has-gutter .el-table_1_column_10) {
    .cell {
      text-align: center;
    }
  }
  .tipInfo {
    border: 0;
    padding: 0;
    min-height: 14px;
    :hover {
      background: #f5f7fa !important;
    }
  }
  .table-header {
    background-color: #fff;
    align-items: center;
    justify-content: space-between;
    .font {
      font-size: 14px;
      color: #409eff;
      display: flex;
      font-weight: bold;
      div {
        margin-right: 10px;
      }
    }
  }

  :deep(.vxe-custom--option) {
    height: 30px;
    line-height: 20px;
  }
  :deep(.vxe-custom--wrapper) {
    margin: 0 10px 0 0 !important;
  }
  :deep(.vxe-header--row .vxe-header--column) {
    text-align: center;
  }
  :deep(.vxe-tree-cell) {
    padding-left: 8px !important;
  }
}
</style>
