import {
  get,
  post,
  remove,
  put
} from "./request";
const PORT1 = "/kte-product";

// 粗展采购单计价信息
function getValuation(params) {
  return post(PORT1 + "/valuation/detail", params, true);
}

// 获取产品所有计价信息
function getValuationList(param) {
  return post(PORT1 + "/valuation/list", param, true);
}

// 新增计价信息
function addValuation(param) {
  return post(PORT1 + "/valuation/submit", param, true);
}

// 删除计价信息
function delValuation(param) {
  return post(PORT1 + "/valuation/deleteById", param);
}

// 查看利润明细
function getDetailMsg(param) {
  return get(PORT1 + "/valuation/getInfo", param);
}

// 编辑计价信息
function editUpdate(param) {
  return post(PORT1 + "/valuation/update", param, true);
}

// 补充计价信息
function updateFurther(param) {
  return post(PORT1 + "/valuation/further", param, true);
}

// 修改选取标识
function submitFlag(param) {
  return post(PORT1 + "/valuation/submitFlag", param, true);
}

// 获取产品所有通过计价信息
function getMaoliAuditList(param) {
  return get(PORT1 + "/valuation/getAll", param);
}

// 获取所有终审未通过的计价信息   采购补录
function getMaoliFinalList(param) {
  return get(PORT1 + "/valuation/getFinalList", param);
}

// 获取助理审核计价信息列表
function getAllValuationList(id) {
  return get(PORT1 + "/valuation/getAll", id);
}

// 根据参考价格和汇率id获取建议售价
function getTheSuggestedPrice(param) {
  return get(PORT1 + "/purchase/getTheSuggestedPrice", param);
}

// /kte-product  保存更新默认计价信息
function saveOrUpdateDefault(param) {
  return post(PORT1 + "/valuation/saveOrUpdateDefault", param, true);
}

// 修改计价信息数量
function updateNumberById(param) {
  return post(PORT1 + "/valuation/updateNumberById", param);
}

export default {
  getValuation,
  getValuationList,
  addValuation,
  delValuation,
  getDetailMsg,
  updateFurther,
  submitFlag,
  getMaoliAuditList,
  getMaoliFinalList,
  getAllValuationList,
  editUpdate,
  getTheSuggestedPrice,
  saveOrUpdateDefault,
  updateNumberById
};
