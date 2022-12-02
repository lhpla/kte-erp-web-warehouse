<!-- 库存信息 -->
<template>
  <div v-loading="tableLoading" style="min-height: 650px">
    <div v-show="!tableLoading" id="InventoryInformation">
      <div class="table-box">
        <div class="table-header">
          <div>中转仓数量：{{ warehouseSum.transitWareHouse ? warehouseSum.transitWareHouse : 0 }}</div>
          <div>直发仓数量：{{ warehouseSum.directWareHouse ? warehouseSum.directWareHouse : 0 }}</div>
          <div>海外仓数量：{{ warehouseSum.overseaWareHouse ? warehouseSum.overseaWareHouse : 0 }}</div>
        </div>
      </div>

      <el-table
        v-show="!tableLoading"
        :data="tableData"
        border
        style="width: 100%"
        :header-cell-style="{ background: '#fafafa', color: '#2d2f30', fontWeight: 'bold', fontSize: '12px' }"
        :default-sort="{ prop: 'inventory', order: 'descending' }"
        @sort-change="sortChange"
        height="610px"
      >
        <el-table-column label="仓库名称" prop="warehouseName"></el-table-column>
        <el-table-column label="服务商" prop="serviceProvider"></el-table-column>
        <el-table-column label="库龄(天)" prop="storageAge"></el-table-column>
        <el-table-column label="仓库属性" prop="warehouseAttributesName"></el-table-column>
        <el-table-column label="在途" prop="transitNum"></el-table-column>
        <el-table-column label="库存" prop="inventory" sortable="custom"></el-table-column>
        <el-table-column label="待出库" prop="reserved"></el-table-column>
        <el-table-column label="待上架" prop="pending">
          <template #default="scope">
            <div v-if="scope.row.warehouseAttributesName == '中转仓' && scope.row.pending == 0">-</div>
            <div v-else>{{ scope.row.pending }}</div>
          </template>
        </el-table-column>
        <el-table-column label="冻结" prop="piFreeze">
          <template #default="scope">
            <div v-if="scope.row.warehouseAttributesName == '中转仓' && scope.row.piFreeze == 0">-</div>
            <div v-else>{{ scope.row.piFreeze }}</div>
          </template>
        </el-table-column>
        <el-table-column label="缺货" prop="piNoStock">
          <template #default="scope">
            <div v-if="scope.row.warehouseAttributesName == '中转仓' && scope.row.piNoStock == 0">-</div>
            <div v-else>{{ scope.row.piNoStock }}</div>
          </template>
        </el-table-column>
        <el-table-column label="已出库" prop="shipped">
          <template #default="scope">
            <div v-if="scope.row.warehouseAttributesName == '中转仓' && scope.row.shipped == 0">-</div>
            <div v-else>{{ scope.row.shipped }}</div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="log-pagination"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="myPages.current"
        :page-sizes="[10, 25, 50, 100]"
        :page-size="myPages.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="myPages.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance } from "vue";
export default {
  name: "InventoryInformation",
  setup(prop, ctx) {
    const data = reactive({
      tableData: [],
      tableLoading: false,
      warehouseSum: {},
      myPages: {
        pageSize: 10,
        pageNum: 1,
        pages: 1,
        total: 0,
      },
      tableInfo: {
        // 要传给后台的数据
        current: 1, // 当前页为 1
        size: 10, // 每页10条
      },
      searchMsg: {},
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const refData = toRefs(data);
    //获取库存信息
    const getMsg = (info) => {
      data.tableInfo.current = 1;
      data.tableInfo.size = 10;
      data.myPages.pageSize = 10;
      data.myPages.pageNum = 1;
      data.myPages.pages = 1;
      data.myPages.total = 0;
      data.tableData = [];
      data.warehouseSum = {};
      data.searchMsg = { proSku: info.sku, current: data.tableInfo.current, size: data.tableInfo.size, sort: false };
      getInventoryInfo(data.searchMsg);
    };

    const getInventoryInfo = (msg) => {
      data.tableLoading = true;
      api.product
        .getInventoryInfo(msg)
        .then((res) => {
          if (res.code == 200) {
            if (res.data && res.data.warehouseSum) {
              // || res.data.internalDtos || res.data.overseasWarehouseDtos
              // data.tableData = [...res.data.internalDtos, ...res.data.overseasWarehouseDtos];
              data.tableData = res.data.data.records;
              data.tableInfo.current = res.data.data.current;
              data.tableInfo.size = res.data.data.size;
              data.myPages.pageSize = res.data.data.size;
              data.myPages.pageNum = res.data.data.current;
              data.myPages.pages = res.data.data.pages;
              data.myPages.total = res.data.data.total;
              data.warehouseSum = res.data.warehouseSum;
            }
          }
          data.tableLoading = false;
        })
        .catch((err) => {
          data.tableLoading = false;
        });
    };

    const handleSizeChange = (val) => {
      data.searchMsg.size = val;
      getInventoryInfo(data.searchMsg);
    };
    const handleCurrentChange = (val) => {
      data.searchMsg.current = val;
      getInventoryInfo(data.searchMsg);
    };

    const sortChange = (val)=>{
      console.log(val);
      if(val.order==='descending'){
        data.searchMsg.sort = false
      }
      if(val.order==='ascending'){
        data.searchMsg.sort = true
      }
      getInventoryInfo(data.searchMsg);
    }
    return {
      ...refData,
      getMsg,
      handleCurrentChange,
      handleSizeChange,
      sortChange
    };
  },
};
</script>
<style scoped lang="scss">
#InventoryInformation {
  position: relative;
  height: 690px;
  .table-header {
    div {
      margin-right: 10px;
    }
  }
  .log-pagination {
    display: flex;
    justify-content: flex-end;
    position: absolute;
    bottom: -15px;
    right: -30px;
    background: #fff;
    border: none;
    border-radius: 50px;
  }
}
</style>
