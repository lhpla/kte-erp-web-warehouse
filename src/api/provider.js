import {
  get,
  post,
  remove,
  put,
  downLoadFile,
  downLoadFilePost
} from "./request";
const PORT1 = "/kte-product";

// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)

// 供应商列表
function getSupplierListAll() {
  return get(PORT1 + "/supplier/getAllSupplier");
}

//批量更新模板
function batchUpdateTemplate(param) {
  return downLoadFile(PORT1 + "/supplier/batchUpdateTemplate", param);
}
//批量更新导入模板
function importUpdateTemplate(param) {
  return post(PORT1 + "/supplier/importUpdateTemplate", param, false, true);
}

export default {
  getSupplierListAll,
  batchUpdateTemplate,
  importUpdateTemplate,
};
