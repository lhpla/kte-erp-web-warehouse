<!-- 选品列表 -->
<template>
  <div id="ChooseProductsList">
    <div class="table-box">
      <div class="table-header">
        <el-button type="primary" size="mini" @click="addNewProduct" v-if="buttonAuthor.add">新增</el-button>
        <el-button type="primary" size="mini" @click="batchOperation(1)" v-if="buttonAuthor.batchSubmit"
          >批量提交</el-button
        >
        <el-button type="primary" size="mini" @click="batchOperation(5)" v-if="buttonAuthor.batchAbandoned"
          >批量作废</el-button
        >
        <el-button type="primary" size="mini" @click="downExportPro" v-if="buttonAuthor.export">选品导出</el-button>
        <el-button type="primary" size="mini" @click="checkDialog(true)" v-if="buttonAuthor.import">选品导入</el-button>
        <LogDialog ref="logDialog"></LogDialog>
        <AllDownDialog ref="AllDownDialog"></AllDownDialog>
      </div>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      style="width: 100%"
      :header-cell-style="{
        background: '#fafafa',
        color: '#2d2f30',
        fontWeight: 'bold',
        fontSize: '12px',
      }"
      @selection-change="handleSelectionChange"
      height="calc(100vh - 310px)"
      class="development-process-operation-bar"
    >
      <el-table-column type="selection" min-width="40" align="center"></el-table-column>
      <el-table-column label="选品图片" align="center">
        <template #default="scope">
          <span v-if="scope.row.pricturePath">
            <el-popover placement="right" trigger="hover" width="250">
              <template #reference>
                <el-image style="width: 70px; height: 70px" fit="contain" :src="scope.row.pricturePath"></el-image>
              </template>
              <el-image :src="scope.row.pricturePath" style="width: 400px; height: 300px" fit="contain"></el-image>
            </el-popover>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="选品中文名称">
        <template #default="scope">
          <el-tooltip effect="dark" :content="scope.row.productCname" placement="bottom">
            <span @click="getDetails(scope.row.id)" class="nameHover mle1">
              {{ scope.row.productCname ? scope.row.productCname : '-' }}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="选品分类" min-width="110" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="scope.row.productClassification" class="mle1">{{
            scope.row.productClassification ? scope.row.productClassification : '-'
          }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="选品来源" prop="source"></el-table-column>
      <el-table-column label="SPU" align="center" prop="proSpu">
        <template #default="scope">
          <span>{{ scope.row.proSpu ? scope.row.proSpu : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="选品参考链接" min-width="110" show-overflow-tooltip>
        <template #default="scope">
          <el-link :underline="false" :href="scope.row.referenceLinking" class="mle1" target="_blank">
            {{ scope.row.referenceLinking ? scope.row.referenceLinking : '-' }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="选品参考价格">
        <template #default="scope">
          <span v-if="scope.row.referencePrice"
            >{{ Number(scope.row.referencePrice).toFixed(2) == -1 ? '' : Number(scope.row.referencePrice).toFixed(2)
            }}{{ scope.row.priceUnit ? scope.row.priceUnit : '-' }}</span
          >
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="选品状态">
        <template #default="scope">
          <span v-if="scope.row.status" @click="openCom(scope.row)">
            {{ tableTypeComputed(pro_selection_status, scope.row.status) }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人">
        <template #default="scope">
          <span v-if="scope.row.auditor && scope.row.status !== 1">{{ scope.row.auditor }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" min-width="100">
        <template #default="scope">
          <el-tooltip effect="dark" placement="top">
            <template #default>
              <div class="mle1">
                <div>创建时间：{{ scope.row.createTime ? scope.row.createTime : '-' }}</div>
                <div>审核时间：{{ scope.row.auditTime && scope.row.status !== 1 ? scope.row.auditTime : '-' }}</div>
              </div>
            </template>
            <template #content>
              <span class="mle1">创建时间：{{ scope.row.createTime ? scope.row.createTime : '-' }}</span>
              <span class="mle1"
                >审核时间：{{ scope.row.auditTime && scope.row.status !== 1 ? scope.row.auditTime : '-' }}</span
              >
            </template>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="140" align="center">
        <template #default="scope">
          <span>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-if="(scope.row.status == 2 || scope.row.status == 4) && buttonAuthor.edit"
              @click="handleEdit(scope.$index, scope.row, 2)"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-document-delete"
              v-if="buttonAuthor.abandoned && scope.row.status != 5"
              @click="stateEdit(5, scope.row)"
            >
              作废
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-document-checked"
              v-if="scope.row.status == 4 && buttonAuthor.submit"
              @click="stateEdit(1, scope.row)"
            >
              提交
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-refresh"
              v-if="scope.row.status == 3 && buttonAuthor.update && scope.row.proSecondStatus == 0"
              @click="handleEdit(scope.$index, scope.row, 1)"
            >
              更新
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-thumb"
              v-if="scope.row.status == 5 && buttonAuthor.activation && scope.row.isAssistant == 0"
              @click="stateEdit(4, scope.row)"
            >
              激活
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-thumb"
              v-if="scope.row.status !== 5 && buttonAuthor.copy"
              @click="copyProduct(scope.row)"
              >复制</el-button
            >
            <el-button
              icon="el-icon-notebook-2"
              type="text"
              size="mini"
              @click="openLog(scope.row.id)"
              v-if="buttonAuthor.log"
              >日志</el-button
            >
          </span>
        </template>
      </el-table-column>
    </el-table>
    <ProductDialog ref="ProductDialog"></ProductDialog>
    <ProductDetails ref="ProductDetails"></ProductDetails>
    <CommentPopup :minTitle="minTitle" :firstTile="firstTile" :logTitle="logTitle" ref="CommentPopup"></CommentPopup>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  onBeforeMount,
  onMounted,
  getCurrentInstance,
  computed,
  ref,
  inject,
  nextTick,
  onUnmounted,
} from 'vue'
import ProductDialog from '../ProductDialog.vue'
import ProductDetails from '../ProductDetails.vue'
import { ElMessage } from 'element-plus'
import tablePage from '@/compositionApi/tablePage'
import authorButtons from '@/compositionApi/authorButtons'
import { localGet } from '@/utils/util'
import CommentPopup from '@/components/commentPopup/commentPopup.vue'
export default {
  name: 'ChooseProductsList',
  components: { ProductDialog, ProductDetails, CommentPopup },
  props: ['tableLoading', 'tableData'],
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons()
    const buttonAuthor = BUTTONS.value
    const data = reactive({
      selectList: [],
      searchMsg: '',
      pro_selection_status: [],
      sourceOptions: [],
      timerOut: null,
      firstTile: '选品作废',
      minTitle: '确认所选选品信息作废？',
      logTitle: '确认操作',
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const { downloadTemplate, dataService } = tablePage()
    const api = vue.$http
    onBeforeMount(() => {})
    onUnmounted(() => {})
    onMounted(() => {
      dataService.value = 'develop'
    })

    //复制选品
    const copyProduct = (row) => {
      api.develop.copyProduct({ pid: row.id }).then((res) => {
        if (res.code == 200) {
          vue.$message({
            type: 'success',
            message: res.msg,
          })
          getTableData()
        } else {
          vue.$message({
            type: 'warning',
            message: res.msg,
          })
        }
      })
    }
    //查看商品详情
    const getDetails = (id) => {
      api.develop.getProductDetail({ id: id }).then((res) => {
        if (res.code == 200) {
          vue.$refs.ProductDetails.getMsg(res.data)
        } else {
          vue.$message({
            type: 'warning',
            message: res.msg,
          })
        }
      })
    }

    //新增
    const addNewProduct = () => {
      let info = {
        title: data.type == 1 ? '新增选品' : '新增产品',
        type: 1,
        btnName: '提交',
      }
      vue.$refs.ProductDialog.getMsg(info)
    }

    //未通过/作废情况下点击状态
    const openCom = (row) => {
      console.log(row)
      // row.status != 4 &&
      if (row.status != 1) {
        data.logTitle = '意见详情'
        if (row.status != 5) {
          let imgArr = []
          let arr = row.auditOpinionPicture.split(',')
          if (row.auditOpinionPicture !== '') {
            arr.map((item) => {
              if (item && item != '') {
                let a = {
                  url: '',
                }
                a.url = item
                imgArr.push(a)
              }
            })
          }

          let msg = {
            list: imgArr,
            CommentsText: row.auditOpinion,
            isDetail: true,
          }
          vue.$refs.CommentPopup.getPicture(msg)
        } else {
          let imgArr = []
          let arr = row.invalidAuditOpinionPicture.split(',')
          arr.map((item) => {
            if (item && item != '') {
              let a = {
                url: '',
              }
              a.url = item
              imgArr.push(a)
            }
          })
          let msg = {
            list: imgArr,
            CommentsText: row.invalidAuditOpinion,
            isDetail: true,
          }
          vue.$refs.CommentPopup.getPicture(msg)
        }
      }
    }

    //点击编辑
    const handleEdit = (index, row, type) => {
      let info = {
        row: row.id,
        title: type == 1 ? '更新选品' : '编辑选品',
        type: 1,
        btnName: type == 1 ? '更新提交 ' : '提交',
      }
      vue.$refs.ProductDialog.getMsg(info)
    }
    //获取列表
    const getTableList = (searchMsg) => {
      data.searchMsg = searchMsg
      data.pro_selection_status = localGet('dictCodeList').pro_selection_status
        ? localGet('dictCodeList').pro_selection_status
        : []
    }

    //列表选择
    const handleSelectionChange = (val) => {
      data.selectList = val
    }

    const getTableData = inject('getTableData')
    //单个修改状态
    const stateEdit = (index, row) => {
      let msg = {
        ids: Array(row.id),
        status: index,
      }
      console.log(row)
      if (index == 5) {
        //作废选品
        data.logTitle = '确认操作'
        let msg = {
          path: 'develop',
          funName: 'cancellationProInfo',
          param: {
            opinion: '',
            ids: [row.id],
            opinionPicture: [],
            status: 5,
          },
        }
        vue.$refs.CommentPopup.openLog(msg)
      } else {
        vue
          .$confirm('此操作将修改该选品状态, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(() => {
            let msg = {
              ids: Array(row.id),
              status: index,
            }
            //非激活按钮执行之前改变状态的接口
            if (index !== 4) {
              api.develop.cancellationProInfo(msg).then((res) => {
                if (res.code == 200) {
                  vue.$message({
                    type: 'success',
                    message: '修改成功!',
                  })
                  getTableData()
                } else {
                  vue.$message({
                    type: 'warning',
                    message: res.msg,
                  })
                }
              })
            } else {
              api.develop.activationPurchase({ pid: row.id }).then((res) => {
                if (res.code == 200) {
                  vue.$message({
                    type: 'success',
                    message: res.msg,
                  })
                  getTableData()
                } else {
                  vue.$message({
                    type: 'warning',
                    message: res.msg,
                  })
                }
              })
            }
          })
          .catch(() => {
            vue.$message({
              type: 'info',
              message: '已取消修改',
            })
          })
      }
    }

    //批量操作
    const batchOperation = (status) => {
      if (data.selectList.length < 1) {
        ElMessage.warning({
          message: '至少选择一条信息!',
          type: 'warning',
        })
      } else {
        if (status == 1) {
          let note = '此操作将提交选品, 是否继续?'
          vue
            .$confirm(note, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            })
            .then(() => {
              let ids = []
              for (let item of data.selectList) {
                ids.push(item.id)
              }
              let msg = {
                ids: ids,
                status: status,
              }
              api.develop.cancellationProInfo(msg).then((res) => {
                if (res.code == 200) {
                  vue.$message({
                    type: 'success',
                    message: res.msg,
                  })
                  getTableData()
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
        } else {
          data.logTitle = '确认操作'
          let msg = {
            path: 'develop',
            funName: 'cancellationProInfo',
            param: {
              opinion: '',
              ids: [],
              opinionPicture: [],
              status: status,
            },
          }
          data.selectList.map((item) => {
            msg.param.ids.push(item.id)
          })
          vue.$refs.CommentPopup.openLog(msg)
        }
      }
    }

    //日志
    const openLog = (e) => {
      let msg = {
        servers: 'develop',
        dataApi: 'getProductLog',
        idList: [e],
      }
      nextTick(() => {
        vue.$refs.logDialog.checkLogDialog(msg)
      })
    }

    //点击导入
    const checkDialog = () => {
      let info = {
        title: '选品列表模板',
        temp: 'exportChooseTemplate',
        import: 'importChoosePro',
        servers: 'develop',
      }
      nextTick(() => {
        vue.$refs.AllDownDialog.checkDialog(true, info)
      })
    }

    //批量导出
    const downExportPro = () => {
      let info = data.searchMsg ? data.searchMsg : {}
      let ids = []
      for (let item of data.selectList) {
        ids.push(item.id)
      }
      info.proIds = ids
      downloadTemplate('downExportPro', '选品列表', info)
    }

    // 计算表格字典
    const tableTypeComputed = computed(() => {
      return function (list, dizKey) {
        if (list.length > 1 && dizKey !== -1) {
          for (let item of list) {
            if (dizKey == item.dizKey) {
              return item.value
            }
          }
        }
      }
    })

    const refData = toRefs(data)
    return {
      ...refData,
      handleEdit,
      stateEdit,
      handleSelectionChange,
      getTableList,
      batchOperation,
      openLog,
      downExportPro,
      downloadTemplate,
      checkDialog,
      getTableData,
      tableTypeComputed,
      buttonAuthor,
      getDetails,
      addNewProduct,
      copyProduct,
      openCom,
    }
  },
}
</script>
<style lang="scss" scoped></style>
