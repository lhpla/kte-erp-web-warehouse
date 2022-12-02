import {
  get,
  post,
  remove,
  put,
  downLoadFile,
  downLoadFilePost
} from "./request";
const PORT1 = "/kte-warehouse";
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)

//产品异常列表
function abnormalProductList(params) {
  return post(PORT1 + '/warehouseAbnormal/abnormalProductList', params, true)
}

//获取异常详情（新）
function getNewAbnormalDetail(param) {
  return post(PORT1 + '/warehouseAbnormal/abnormalDetail', param, true)
}

//异常处理
function abnormalDispose(param) {
  return post(PORT1 + '/warehouseAbnormal/abnormalDispose', param, true)
}

//异常处理
function checkSkue(param) {
  return post('/kte-purchase/replenishment/checkSku', param, true)
}


export default {
  abnormalProductList,
  getNewAbnormalDetail,
  abnormalDispose,
  checkSkue,
}

