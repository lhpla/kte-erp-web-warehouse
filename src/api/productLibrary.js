import {
  get,
  post,
  remove,
  put,
  downLoadFile
} from "./request";
const PORT1 = "/kte-product";

// 产品库   productLibrary

// 新增备选供应商
function insertAlternativeSupplier(param) {
  return post(PORT1 + "/alternative/insertAlternativeSupplier", param, true);
}

// 获取备选供应商相关信息
function getAlternativeSupplier(param) {
  return get(PORT1 + "/alternative/getAlternativeSupplier", param);
}

// 删除备选供应商
function deleteAlternativeSupplier(param) {
  return post(PORT1 + "/alternative/deleteAlternativeSupplier", param);
}

// 更新备选供应商信息
function updateAlternativeSupp(param) {
  return post(PORT1 + "/alternative/updateAlternativeSupp", param, true);
}

// 获取当个供应商信息
function getAlternativeSupplierInfo(param) {
  return get(PORT1 + "/alternative/getAlternativeSupplierInfo", param);
}

// 根据产品ID，sku获取产品基本信息
function getProBasicInfo(param) {
  return get(PORT1 + "/proManager/getProBasicInfo", param);
}

// 编辑产品基础信息
function updateProBasicInfo(param) {
  return post(PORT1 + "/proManager/updateProBasicInfo", param, true);
}

// 根据产品ID，sku获取采购信息
function getProPurchase(param) {
  return get(PORT1 + "/proManager/getProPurchase", param);
}

// 编辑单个产品库采购信息
function updateProPurchaseInfo(param) {
  return post(PORT1 + "/proManager/updateProPurchaseInfo", param, true);
}

// 根据SKU,产品ID获取销售信息
function getMarketInfo(param) {
  return get(PORT1 + "/proManager/getMarketInfo", param);
}

// 编辑销售信息
function updateMarketInfo(param) {
  return post(PORT1 + "/proManager/updateMarketInfo", param, true);
}

// 通过SKU,产品ID获取申报信息
function getDeclareInfo(param) {
  return get(PORT1 + "/proManager/getDeclareInfo", param);
}

// 复制产品信息
function copyProductInfo(param) {
  return get(PORT1 + "/proManager/copyProductInfo", param);
}

export default {
  insertAlternativeSupplier,
  getAlternativeSupplier,
  deleteAlternativeSupplier,
  updateAlternativeSupp,
  getAlternativeSupplierInfo,
  getProBasicInfo,
  updateProBasicInfo,
  getProPurchase,
  updateProPurchaseInfo,
  getMarketInfo,
  updateMarketInfo,
  getDeclareInfo,
  copyProductInfo
};
