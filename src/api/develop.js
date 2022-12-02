import {
  get,
  post,
  remove,
  put,
  downLoadFile,
  downLoadFilePost
} from "./request";
const PORT1 = "/kte-product";
const PORT2 = "/kte-system";

// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)

// ------选品
// 获取选品列表
function getSelectionList(params) {
  return get(PORT1 + "/product/getProductList", params);
}

// 获取选品列表审核
function getPageList(params) {
  return get(PORT1 + "/product/pageProductList", params);
}

// 查看单个选品详情
function getProductDetail(params) {
  return get(PORT1 + "/product/detail", params);
}

// 获取选品列表操作人
function getProductOperator() {
  return get(PORT1 + "/product/getOperator");
}

// 新增单个选品
function createNewProduct(params) {
  return post(PORT1 + "/product/insertProInfo", params, true);
}

// 编辑单个选品
function updateProInfo(params) {
  return post(PORT1 + "/product/updateProInfo", params);
}

// 作废单个或多个选品
function cancellationProInfo(params) {
  return post(PORT1 + "/product/cancellationProInfo", params, true);
}

// 选品导出模板
function exportChooseTemplate() {
  return downLoadFile(PORT1 + "/product/exportTemplate");
}

// 选品导入选品
function importChoosePro(params) {
  return post(PORT1 + "/product/importPro", params, false, true);
}

// 选品列表数据导出
function downExportPro(params) {
  return downLoadFilePost(PORT1 + "/product/exportPro", params, true);
}

// 选品审核列表数据导出
function exportAuditExcel(params) {
  return downLoadFilePost(PORT1 + "/product/exportAuditExcel", params, true);
}

// 获取日志信息
function getProductLog(params) {
  return post(PORT1 + "/product/getProductLog", params, true);
}

// ----产品初录
// 初录列表
function getFirstList(params) {
  return get(PORT1 + "/entering/firstList", params);
}

// 开发初录更新新增接口
function updateByProductFirst(params) {
  return post(PORT1 + "/valuation/updateByProductFirst", params, true);
}

// 初录导出
function firstDown(params) {
  return downLoadFilePost(PORT1 + "/entering/export-pro", params, true);
}

// 初录导出模板
function firstTemp() {
  return downLoadFile(PORT1 + "/entering/export-template");
}

// 采购异常提交
function exceptionSubmit(param) {
  return post(PORT1 + "/purchase/exceptionSubmit", param, true);
}

// 初录导入产品品
function firstImport(params) {
  return post(PORT1 + "/entering/import-pro", params, false, true);
}

// 二录导出
function secondDown(params) {
  return downLoadFilePost(PORT1 + "/entering/secondExportExcel", params);
}

// 二 三 录列表
function getSecondList(params) {
  return get(PORT1 + "/entering/secondList", params);
}

// 初录二录通用新增或修改
function editEntry(params) {
  return post(PORT1 + "/entering/submit", params, true);
}

// 二录新增或修改
function secondSubmit(params) {
  return post(PORT1 + "/entering/secondSubmit", params, true);
}

// 初录修改状态
function updateStatus(params) {
  return post(PORT1 + "/entering/upFirstStatus", params, true);
}

// 二录修改状态
function updateSecondStatus(params) {
  return post(PORT1 + "/entering/upSecondStatus", params, true);
}

// 助理审核
// 获取产品基础信息
function getAssistantList(params) {
  return get(PORT1 + "/assistantReview/pageList", params);
}

// 助理审核  批量修改状态
function updateAssistantStatus(param) {
  return post(PORT1 + "/assistantReview/cancellationProInfo", param, true);
}

// 三录  批量修改状态
function updateInputThird(params) {
  return post(PORT1 + "/productInput3/cancellationProInfo", params, true);
}

// 三录导出
function assistantDown(params) {
  return downLoadFilePost(PORT1 + "/assistantReview/exportPro", params, true);
}

// -----采购
// 获取采购列表
function getPurchaseList(params) {
  return get(PORT1 + "/purchase/find", params);
}

// 获取采购专员操作人  /purchase/getOperator
function getPurchaseOperator() {
  return get(PORT1 + "/purchase/getOperator");
}

// 采购初录获取详细信息
function getFirstPurchaseDetail(params) {
  return get(PORT1 + "/purchase/detail", params);
}

// 采购初录导出
function purchaseFirstDown(params) {
  return downLoadFilePost(PORT1 + "/purchase/export", params, true);
}

// 采购初录导入
function purchaseFirstImport(params) {
  return post(PORT1 + "/purchase/import", params, false, true);
}

// 新增采购信息
function createSecond(params) {
  return post(PORT1 + "/purchase/input", params, true);
}

// 采购初录  批量提交
function bulkFirstSubmission(params) {
  return post(PORT1 + "/purchase/bulkSubmission", params, true);
}

// 采购删除组合商品--单个
function deleteProInfo(id) {
  return get(PORT1 + "/purchase/deleteProInfo", id);
}

// 采购根据ID查询信息
function getDetailById(params) {
  return get(PORT1 + "/purchase/getDetailById", params);
}

// 终审
// 获取终审列表
function getAuditList(params) {
  return get(PORT1 + "/productReview/pageList", params);
}

// 终审导出
function exportEndAudit(params) {
  return downLoadFilePost(PORT1 + "/productReview/exportPro", params, true);
}

//产品计价信息 /kte-product
function exportValuation(params) {
  return downLoadFilePost(PORT1 + '/productReview/exportValuation', params, true)
}

// 选品批量修改
function updateAuditStatus(params) {
  return post(PORT1 + "/product/auditOpinion", params, true);
}

// 产品终审的作废及驳回
function auditOpinion(params) {
  return post(PORT1 + "/productReview/auditOpinion", params, true);
}

// 获取品类列表
function getCategoryList(params) {
  return get(PORT1 + "/category/list", params);
}

// 二录文件上传
function secondUploadFile(params) {
  return post(PORT1 + "/purchase/fileUpload", params, false, true);
}

// 新增根据站点ID获取仓库ID
function getDefaultWarehouse(params) {
  return get(PORT1 + "/valuation/getDefaultWarehouse", params);
}

// 采购发送激活产品消息   /kte-product
function activationMessage(params) {
  return post(PORT1 + "/purchase/activationMessage", params);
}

// 激活开发初录作废数据   /kte-product
function activationFirst(params) {
  return post(PORT1 + "/entering/activation", params);
}

// 激活选品信息 /kte-product
function activationPurchase(params) {
  return post(PORT1 + "/product/activation", params);
}

// 产品复制
function copyProduct(param) {
  return get(PORT1 + "/product/copy", param);
}

// 开发二录 计价受否有效 激活与作废）/kte-product
function updateLicit(param) {
  return post(PORT1 + "/valuation/updateLicit", param);
}

// 二次分配列表  /kte-product
function secondAllocationInfo(param) {
  return get(PORT1 + "/secondAllocationInfo/list", param);
}

// 批量分配  /kte-product
function batchAllocation(param) {
  return post(PORT1 + "/secondAllocationInfo/batchAllocation", param, true);
}

// /kte-product   二录驳回
function secondReject(param) {
  return post(PORT1 + "/entering/secondReject", param, true);
}

// /kte-product  开发二录 批量申请分配
function secondaryDistribution(param) {
  return post(PORT1 + "/entering/secondaryDistribution", param, true);
}

///kte-product采购初录  批量申请二次分配 
function purchaseSecondaryDistribution(param) {
  return post(PORT1 + '/entering/purchaseSecondaryDistribution', param, true)
}

// 获取助理审核的日志  /kte-product
function getAssistantLog(param) {
  return post(PORT1 + "/assistantReview/getAssistantLog", param, true);
}

// 获取终审审核日志   /kte-product
function getReviewLog(param) {
  return post(PORT1 + "/productReview/getReviewLog", param, true);
}

// 获取二次分配日志 /kte-product
function getSecondAllocationInfoLog(param) {
  return get(PORT1 + "/secondAllocationInfo/getSecondAllocationInfoLog", param);
}

// 获取二次分配详情 /kte-product
function getSecondDetDetail(param) {
  return get(PORT1 + "/secondAllocationInfo/getDetail", param);
}

//获取开发流程所有字典
function getDevProcessList() {
  return get("/kte-product/product/getDevProcessList");
}

//开发二录重新计算计价  /kte-product
function recalculateValuationByProId(param) {
  return post(PORT1 + '/valuation/recalculateValuationByProId', param, true)
}

//获取计价信息目的仓（海外仓和直发仓） 
function getDirectAndOverseasWarehouse() {
  return get(PORT2 + '/wareHouse/getDirectAndOverseasWarehouse')
}

//根据系统分类查询spu
function getSpuByCategory(param) {
  return get(PORT1 + '/spuProperty/getSpuByCategory', param)
}
//根据Spu查询系统品类
function getCategoryBySpu(param) {
  return get(PORT1 + '/spuProperty/getCategoryBySpu', param)
}
//通过站点获取计价插头电压数据
function getPlugAndVoltageBySiteName(param) {
  return get(PORT1 + '/valuation/getPlugAndVoltageBySiteName', param)
}
//获取插头电压数据下拉
function getAllPlugVoltage(param) {
  return get(PORT1 + '/proManager/getAllPlugVoltage', param)
}


export default {
  getAllPlugVoltage,
  getPlugAndVoltageBySiteName,
  getCategoryBySpu,
  getSpuByCategory,
  getReviewLog,
  getAssistantLog,
  secondReject,
  secondaryDistribution,
  secondAllocationInfo,
  batchAllocation,
  updateLicit,
  copyProduct,
  exportEndAudit,
  getProductOperator,
  getSelectionList,
  getPageList,
  createNewProduct,
  getCategoryList,
  updateProInfo,
  cancellationProInfo,
  getProductLog,
  getPurchaseList,
  getFirstList,
  getSecondList,
  getAssistantList,
  editEntry,
  secondSubmit,
  updateStatus,
  createSecond,
  downExportPro,
  firstDown,
  auditOpinion,
  updateSecondStatus,
  getAuditList,
  updateAuditStatus,
  updateInputThird,
  importChoosePro,
  exportChooseTemplate,
  firstTemp,
  firstImport,
  secondDown,
  assistantDown,
  purchaseFirstDown,
  purchaseFirstImport,
  getDetailById,
  getFirstPurchaseDetail,
  deleteProInfo,
  secondUploadFile,
  bulkFirstSubmission,
  getProductDetail,
  updateAssistantStatus,
  getPurchaseOperator,
  updateByProductFirst,
  getDefaultWarehouse,
  activationMessage,
  activationFirst,
  activationPurchase,
  exceptionSubmit,
  getSecondAllocationInfoLog,
  getSecondDetDetail,
  purchaseSecondaryDistribution,
  getDevProcessList,
  exportAuditExcel,
  recalculateValuationByProId,
  exportValuation,
  getDirectAndOverseasWarehouse
};
