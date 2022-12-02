<!-- 产品合并列表 -->
<template>
  <div id="consolidation">
    <!-- 搜素部分 -->
    <div class="flex search_box">
      <span class="sku_input">
        <span class="label">SKU：</span>
        <el-input
          v-model="sku"
          size="mini"
          placeholder="输入SKU"
          clearable
          @change="getSearch"
        ></el-input>
      </span>
      <div>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-search"
          @click="getSearch"
          >查询</el-button
        >
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-refresh"
          @click="reset"
          >重置</el-button
        >
      </div>
    </div>
    <!-- 按钮表格部分 -->
    <div>
      <div class="table-box">
        <div class="table-header">
          <el-button
            type="primary"
            size="mini"
            @click="POstMerge"
            v-if="buttonAuthor.mergeSku"
            >合并SKU</el-button
          >
          <el-button
            type="primary"
            size="mini"
            @click="journal"
            v-if="buttonAuthor.log"
            >日志</el-button
          >
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        :header-cell-style="{
          background: '#fafafa',
          color: '#2d2f30',
          fontWeight: 'bold',
          fontSize: '12px',
        }"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        height="calc(100vh - 260px)"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          label="合并SKU"
          align="center"
          show-overflow-tooltip
          :prop="sku"
        >
          <template #default="scope">
            <span>{{ scope.row.mergeSku ? scope.row.mergeSku : "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="被合并SKU" align="center" show-overflow-tooltip>
          <template #default="scope">
            <span>{{
              scope.row.conflatedSku ? scope.row.conflatedSku : "-"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合并备注" align="center" show-overflow-tooltip>
          <template #default="scope">
            <span>{{
              scope.row.mergeRemark ? scope.row.mergeRemark : "-"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" align="center" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ scope.row.updateTime ? scope.row.updateTime : "-" }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <MergeSku :mergeSkuFlag="mergeSkuFlag"></MergeSku>
    <!-- 日志 -->
    <ConsolidationLog ref="ConsolidationLog" @getLog="getLog"></ConsolidationLog>
    <!-- 分页 -->
    <Pagination
      :total="myPages.total"
      :limit="myPages.pageSize"
      :page="myPages.pageNum"
      @update:limit="myPages.pageSize = $event"
      @update:page="myPages.pageNu = $event"
      :hidden="myPages.total <= 0"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    ></Pagination>
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
  nextTick,
} from "vue";
import authorButtons from "../../compositionApi/authorButtons";
import MergeSku from "@/components/product/popup/MergeSku.vue";
import ConsolidationLog from "@/components/product/popup/ConsolidationLog.vue";
import { backTableTop } from "../../utils/util";
export default {
  name: "consolidation",
  components: { MergeSku, ConsolidationLog },
  setup(prop, ctx) {
    const data = reactive({
      // 搜索条件
      sku: "",
      // 当前选中表格单元
      selectList: [],
      // 当前页面数据
      myPages: {
        pageSize: 10,
        pageNum: 1,
        pages: 1,
        total: 0,
      },
      tableInfo: {
        current: 1, // 当前页为 1
        size: 10, // 每页10条
      },
      // 当前列表数据
      tableData: [],
      // 合并弹框falg
      mergeSkuFlag: false,
      searchMsg: {},
      loading: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    const { BUTTONS } = authorButtons();
    const buttonAuthor = BUTTONS.value;

    onBeforeMount(() => {});
    onMounted(() => {
      getPageData();
    });

    // 获取页面数据
    const getPageData = (msg) => {
        data.loading = true;
        api.product
          .getMergeInfo(msg)
          .then((res) => {
            if (res.code == 200) {
              data.loading = false;
              data.tableData = res.data.records;
              data.tableInfo.current = res.data.current;
              data.tableInfo.size = res.data.size;
              data.myPages.pageSize = res.data.size;
              data.myPages.pageNum = res.data.current;
              data.myPages.pages = res.data.pages;
              data.myPages.total = res.data.total;
              nextTick(() => {
                backTableTop("#consolidation");
              });
            } else {
              data.loading = false;
            }
          })
          .catch(() => {
            data.loading = false;
          });
    };

    // 搜索
    const getSearch = () => {
      getPageData({ sku: data.sku ? data.sku.trim() : "" });
    };

     //重置
     const reset = () => {
      data.sku = ""
      getPageData({sku:""})
    }

    // POstMerge 合并sku
    const POstMerge = () => {
      data.mergeSkuFlag = true;
    };

    // journal 日志
    const journal = () => {
      if (data.selectList.length > 0) {
        // let proMergedLogVo = {
        //   mergeIdList: [],
        //   productIdList: [],
        //   type: "1",
        //   current: 1,
        //   size: 10,
        // };
        // data.selectList.map((item) => {
        //   proMergedLogVo.mergeIdList.push(item.id);
        // });
        // api.product.getMergeLog(proMergedLogVo).then((res) => {
        //   if (res.code == 200) {
        //     vue.$refs.ConsolidationLog.getMsg(res.data);
        //   }
        // });
        getLog(1, 10);
      } else {
        vue.$message({
          type: "warning",
          message: "请选择要查看的相关数据！",
        });
      }
    };
    //获取日志
    const getLog = (current, size) => {
      let proMergedLogVo = {
        mergeIdList: [],
        productIdList: [],
        type: "1",
        current: current,
        size: size,
      };
      data.selectList.map((item) => {
        proMergedLogVo.mergeIdList.push(item.id);
      });
      api.product.getMergeLog(proMergedLogVo).then((res) => {
        if (res.code == 200) {
          vue.$refs.ConsolidationLog.getMsg(res.data);
        }
      });
    };

    // handleSelectionChange  表格头选中变化事件
    const handleSelectionChange = (e) => {
      data.selectList = e;
    };

    // handleSizeChange //每页条数改变
    const handleSizeChange = (val) => {
      data.tableInfo.size = val;
      let info = data.searchMsg;
      info.size = data.tableInfo.size;
      data.searchMsg = info;
      data.scroll = 0;
      getPageData(data.searchMsg);
    };

    // handleCurrentChange 当前分页改变
    const handleCurrentChange = (val) => {
      data.tableInfo.current = val;
      let info = data.searchMsg;
      info.current = data.tableInfo.current;
      data.searchMsg = info;
      data.scroll = 0;
      getPageData(data.searchMsg);
    };

    const refData = toRefs(data);
    return {
      ...refData,
      buttonAuthor,
      getSearch,
      reset,
      POstMerge,
      journal,
      handleSelectionChange,
      handleCurrentChange,
      handleSizeChange,
      getPageData,
      getLog,
    };
  },
};
</script>
<style scoped lang="scss">
#consolidation {
  .search_box {
    width: 95%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    .sku_input {
      color: gray;
      width: 200px;
      display: flex;
      line-height: 40px;
      margin-bottom: 12px;
      .label {
        line-height: 29px;
      }
    }
  }
  .buttons {
    width: 95%;
    margin: 20px auto;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
