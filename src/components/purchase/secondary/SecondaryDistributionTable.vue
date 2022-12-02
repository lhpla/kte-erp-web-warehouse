<!-- SecondaryDistributionTable 二次分配表格 -->
<template>
  <div>
    <div class="table-box">
      <div class="table-header">
        <el-button type="primary" size="mini" @click="BatchAllocation" v-if="buttonAuthor.batchDistribute"
          >批量分配</el-button
        >
        <el-button type="primary" size="mini" @click="journal" v-if="buttonAuthor.log">日志</el-button>
      </div>
    </div>
    <LogDialog ref="logDialog"></LogDialog>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      height="calc(100vh - 310px)"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column label="产品图片" align="center">
        <template #default="scope">
          <el-popover placement="right" trigger="hover" width="250" v-if="scope.row.proPicture">
            <template #reference>
              <img style="width: 70px; height: 70px; object-fit: contain" loading="lazy" :src="scope.row.proPicture" />
            </template>
            <img :src="scope.row.proPicture" loading="lazy" style="width: 400px; height: 300px; object-fit: contain" />
          </el-popover>
          <div v-else>暂无图片</div>
        </template>
      </el-table-column>
      <el-table-column label="产品中文名称" align="center">
        <template #default="scope">
          <span
            :class="scope.row.isTimeout == 1 ? 'color-red' : ''"
            class="mle1 nameHover"
            @click="getDetails(scope.row)"
          >
            {{ scope.row.proCname ? scope.row.proCname : '-' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="产品分类" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span :class="scope.row.isTimeout == 1 ? 'color-red' : ''" class="mle1">{{ scope.row.proClassifyName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" align="center">
        <template #default="scope">
          <span :class="scope.row.isTimeout == 1 ? 'color-red' : ''">{{ scope.row.submissionTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" align="center">
        <template #default="scope">
          <div v-if="scope.row.enterUserName != ''" :class="scope.row.isTimeout == 1 ? 'color-red' : ''">
            录入：{{ scope.row.enterUserName }}
          </div>
          <div v-if="scope.row.submissionExploitUserName != ''" :class="scope.row.isTimeout == 1 ? 'color-red' : ''">
            开发：{{ scope.row.submissionExploitUserName }}
          </div>
          <div v-if="scope.row.submissionPurchaseUserName != ''" :class="scope.row.isTimeout == 1 ? 'color-red' : ''">
            采购：{{ scope.row.submissionPurchaseUserName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="提交人" align="center">
        <template #default="scope">
          <span v-if="scope.row.createUserName" :class="scope.row.isTimeout == 1 ? 'color-red' : ''">{{
            scope.row.createUserName
          }}</span>
          <span v-else :class="scope.row.isTimeout == 1 ? 'color-red' : ''">-</span>
        </template>
      </el-table-column>
      <el-table-column label="备注说明" align="center">
        <template #default="scope">
          <span :class="scope.row.isTimeout == 1 ? 'color-red' : ''" @click="openCom(scope.row)">{{
            scope.row.remark
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分配状态" align="center">
        <template #default="scope">
          <span :class="scope.row.isTimeout == 1 ? 'color-red' : ''">{{
            scope.row.allocationState == 1 ? '待分配' : '已分配'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分配人" align="center">
        <template #default="scope">
          <span :class="scope.row.isTimeout == 1 ? 'color-red' : ''">
            {{
              scope.row.allocationUserName && scope.row.allocationUserName != '' ? scope.row.allocationUserName : '-'
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="变更人" align="center">
        <template #default="scope">
          <span v-if="scope.row.submissionPurchaseUserName" :class="scope.row.isTimeout == 1 ? 'color-red' : ''">{{
            scope.row.submissionPurchaseUserName
          }}</span>
          <span v-else :class="scope.row.isTimeout == 1 ? 'color-red' : ''">-</span>
        </template>
      </el-table-column>
      <el-table-column label="分配时间" align="center">
        <template #default="scope">
          <span :class="scope.row.isTimeout == 1 ? 'color-red' : ''">
            {{ scope.row.allocationTime && scope.row.allocationTime != '' ? scope.row.allocationTime : '-' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-refresh"
            v-if="scope.row.allocationState == 1 && buttonAuthor.distribution"
            @click="distribution(scope.row)"
          >
            分配
          </el-button>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <SecondaryDistributionPop ref="SecondaryDistributionPop" :selectList="selectList"></SecondaryDistributionPop>
    <CommentPopup :minTitle="minTitle" :firstTile="firstTile" :logTitle="logTitle" ref="CommentPopup"></CommentPopup>
    <SecondaryPop ref="SecondaryPop"></SecondaryPop>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject, nextTick } from 'vue'
import authorButtons from '../../../compositionApi/authorButtons'
import CommentPopup from '../../../components/commentPopup/commentPopup.vue'
import SecondaryPop from '../../../components/purchase/SecondaryPop.vue'
import SecondaryDistributionPop from '../../../components/purchase/secondary/SecondaryDistributionPop.vue'
import { useStore } from 'vuex'
import { localSet } from '../../../utils/util'
export default {
  name: 'SecondaryDistributionTable',
  components: { CommentPopup, SecondaryPop, SecondaryDistributionPop },
  props: ['loading', 'tableData', 'searchMsg'],
  setup(prop, ctx) {
    const { BUTTONS } = authorButtons()
    const buttonAuthor = BUTTONS.value
    const data = reactive({
      // 当前表格选中数据
      selectList: [],
      // 确认操作falg
      dialogVisible: false,
      firstTile: '',
      minTitle: '',
      logTitle: '意见详情',
    })
    const store = useStore()
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http
    onBeforeMount(() => {})
    onMounted(() => {})
    const getDataList = inject('getDataList')
    // 分配/批量分配
    const BatchAllocation = (e) => {
      if (data.selectList.length == 0) {
        vue.$message({
          type: 'warning',
          message: '请选择要分配的数据！',
        })
      } else {
        if (
          data.selectList.every((item) => {
            return item.allocationState == 1
          })
        ) {
          vue.$refs.SecondaryDistributionPop.getMsg(data.selectList)
        } else {
          vue.$message({
            type: 'warning',
            message: '请保证所选择的数据状态为未分配！',
          })
        }
      }
    }
    // 点击获取当前列表日志
    const journal = () => {
      const msg = {
        servers: 'develop',
        dataApi: 'getSecondAllocationInfoLog',
      }
      vue.$refs.logDialog.checkLogDialog(msg)
    }
    // 当前表格选中
    const handleSelectionChange = (e) => {
      data.selectList = e
    }
    // 获取数据详情
    const getDetails = (row) => {
      api.develop.getSecondDetDetail({ id: row.id }).then((res) => {
        if (res.code == 200) {
          store.commit('purchase/setSpriceDetailFlagetpr', true)
          nextTick(() => {
            let info = {
              row: res.data,
              title: '产品详情',
              isDetail: false,
            }
            localSet(`goodsDetails${row.id}`, info)
            vue.$refs.SecondaryPop.getMsg(row.id, row)
            vue.$refs.SecondaryPop.getBasicInfo(row.id)
            vue.$refs.SecondaryPop.getPriceMsg(row.id)
          })
        } else {
          vue.$message({
            type: 'warning',
            message: res.msg,
          })
        }
      })
    }
    // 点击意见展示意见详情
    const openCom = (row) => {
      let imgArr = []
      let arr = row.exceptionPic.split(',')
      if (row.exceptionPic !== '') {
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
        CommentsText: row.remark,
        isDetail: true,
      }
      vue.$refs.CommentPopup.getPicture(msg)
    }

    // 单行点击分配
    const distribution = (e) => {
      data.selectList = []
      data.selectList.push(e)
      vue.$refs.SecondaryDistributionPop.getMsg(data.selectList)
    }
    const refData = toRefs(data)
    return {
      ...refData,
      buttonAuthor,
      BatchAllocation,
      journal,
      handleSelectionChange,
      getDetails,
      openCom,
      distribution,
    }
  },
}
</script>
<style scoped lang="scss"></style>
