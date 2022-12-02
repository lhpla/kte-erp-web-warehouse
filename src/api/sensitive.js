import {
  get,
  post,
  remove,
  put
} from "./request";
const PORT1 = "/kte-product";

// 敏感词库  sensitive

// 粗展采购单计价信息
function getSensitive(params) {
  return get(PORT1 + "/sensitivDocument/getSensitive", params);
}

// 新增敏感词汇
function insertSensitive(param) {
  return post(PORT1 + "/sensitivDocument/insertSensitive", param, true);
}

// 编辑敏感词汇
function updateSensitive(param) {
  return post(PORT1 + "/sensitivDocument/updateSensitive", param, true);
}

// 批量删除敏感词汇
function deleteSensitiveByIds(param) {
  return post(PORT1 + "/sensitivDocument/deleteSensitiveByIds", param, true);
}

// 根据id删除敏感词汇
function deleteSensitiveById(param) {
  return get(PORT1 + "/sensitivDocument/deleteSensitiveById", param);
}

// 获取敏感词汇库日志分页
function getSensitiveLog(param) {
  return post(PORT1 + "/sensitivDocument/getSensitiveLog", param, true);
}

//批量查看删除敏感词日志
function deleteSensitiveLog(param) {
  return get(PORT1 + "/sensitivDocument/getSensitiveDeleteLog", param);
}

//限价分页列表
function getPageList(param) {
  return get(PORT1 + "/limitPrice/pageList", param);
}

//修改限价信息
function update(param) {
  return post(PORT1 + "/limitPrice/update", param, true);
}

//验证sku
function checkSku(param) {
  return get(PORT1 + "/limitPrice/getProductNameBySku", param);
}
//新增限价信息
function submit(param) {
  return post(PORT1 + "/limitPrice/submit", param, true);
}

//根据id查询限价详情
function getDetail(param) {
  return get(PORT1 + "/limitPrice/getDetail", param);
}

//删除限价信息
function Delete(param) {
  return post(PORT1 + "/limitPrice/delete", param, true);
}

//根据限价信息id获取日志记录
function getLimitPriceLogList(param) {
  return get(PORT1 + "/limitPrice/getLimitPriceLogList", param);
}


export default {
  getSensitive,
  insertSensitive,
  updateSensitive,
  deleteSensitiveByIds,
  deleteSensitiveById,
  getSensitiveLog,
  getPageList,
  checkSku,
  getDetail,
  submit,
  update,
  Delete,
  getLimitPriceLogList,
  deleteSensitiveLog
};
