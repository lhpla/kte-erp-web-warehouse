import {
  get,
  post,
  DELETE,
  remove,
  put,
  downLoadFile,
  downLoadFilePost
} from './request'
const PORT1 = '/kte-product'

// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)

// 获取产品信息列表
function getProductList(params) {
  return post(PORT1 + '/proManager/getProInfo', params)
}

// 获取海外仓列表 /proManager/getOverSearCangInfo
function getOverSearCangInfo(params) {
  return get(PORT1 + '/proManager/getOverSearCangInfo', params)
}

// 组合产品列表
function getGroupProductList(params) {
  return get(PORT1 + '/groupProduct/list', params)
}

// 批量组合
function addGroupProduct(params) {
  return post(PORT1 + '/groupProduct/submit', params, true)
}

// 产品列表批量导出
function exportProduct(params) {
  return post(PORT1 + '/proManager/exportProduct', params, true)
}

// 产品列表模板导出
function exportProductTemplate() {
  return downLoadFile(PORT1 + '/proManager/exportTemplate')
}

// 产品列表批量导入
function importProduct(params) {
  return post(PORT1 + '/proManager/importProduct', params, false, true)
}

// 批量解除组合
function deleteGroupProduct(params) {
  return post(PORT1 + '/groupProduct/batchDelete', params, true)
}

// 根据sku查询产品
function searchGroupProduct(params) {
  return get(PORT1 + '/groupProduct/productList', params)
}

// 根据产品id删除产品
function deleteProduct(params) {
  return post(PORT1 + '/groupProduct/batchDeleteProduct', params, true)
}

//根据产品品类id删除
function categoryRemove(params) {
  return post(PORT1 + '/category/remove', params)
}

// 获取组合产品操作日志
function getGroupProductLog(params) {
  return get(PORT1 + '/groupProduct/groupProductLog', params)
}

// 获取产品库日志
function getProductLog(params) {
  return get(PORT1 + '/proManager/getProLog', params)
}

// 新增产品信息
function addProductInfo(params) {
  return post(PORT1 + '/proManager/insertProInfo', params, true)
}

// 支付名或信用代码去重
function getPayInforRemoval(params) {
  return get(PORT1 + '/supplier/payInforRemoval', params)
}

// 包装说明  新增 修改
function saveDict(params) {
  return post(PORT1 + '/purchase/saveDict', params, true)
}

// 删除包装信息
function removeDictById(param) {
  return get(PORT1 + '/purchase/removeDictById', param)
}

/// kte-product 批量修改产品信息
function batchEdit(param) {
  return post(PORT1 + '/proManager/batchEdit', param, true)
}

/// kte-product  根据产品id获取助理审核产品详情
function getDetails(param) {
  return get(PORT1 + '/assistantReview/getDetails', param)
}

/// kte-product  产品二录详情
function secondDetail(param) {
  return get(PORT1 + '/entering/secondDetail', param)
}

/// kte-product  根据产品id获取终审产品详情
function getDetailsProductReview(param) {
  return get(PORT1 + '/productReview/getDetails', param)
}

// /kte-product  根据组合id查询详情(组合产品列表)
function portfolioListDetail(param) {
  return get(PORT1 + '/groupProduct/detail', param)
}

//   根据产品品类管理获取详情/kte-product
function categoryDetail(param) {
  return get(PORT1 + '/category/detail', param)
}

// 获取质检默认信息 /kte-product
function selectAttachs(param) {
  return get(PORT1 + '/proManager/selectAttachs', param)
}

// 新增虚拟申报信息 /kte-product/virtualDeclare/insertVirtualDeclare
function insertVirtualDeclare(param) {
  return post(PORT1 + '/virtualDeclare/insertVirtualDeclare', param, true)
}

// /kte-product/virtualDeclare/getVirtualDeclare   获取虚拟申报信息
function getVirtualDeclare(param) {
  return get(PORT1 + '/virtualDeclare/getVirtualDeclare', param)
}

// 编辑虚拟申报信息 /kte-product
function updateVirtualDeclare(param) {
  return post(PORT1 + '/virtualDeclare/updateVirtualDeclare', param, true)
}

/// kte-product 获取合并信息列表
function getMergeInfo(param) {
  return get(PORT1 + '/proMergedController/getMergeInfo', param)
}

/// kte-product  合并SKUlk
function mergeSku(param) {
  return post(PORT1 + '/proMergedController/mergeSku', param, true)
}

/// kte-product  精准查询SKU信息
function getLikeSku(param) {
  return get(PORT1 + '/proMergedController/getLikeSku', param)
}
// 获取合并删除的日志信息  /kte-product
function getMergeLog(param) {
  return post(PORT1 + '/proMergedController/getMergeLog', param, true)
}

// 获取开发状态信息
function getProDevStatus() {
  return get(PORT1 + '/proManager/getProDevStatus')
}

// 新增开发状态信息
function insertProDevStatus(param) {
  return get(PORT1 + '/proManager/insertProDevStatus', param)
}

// 编辑开发状态
function updateProDevStatus(param) {
  return get(PORT1 + '/proManager/updateProDevStatus', param)
}

// 删除开发状态
function deleteProDevStatus(param) {
  return get(PORT1 + '/proManager/deleteProDevStatus', param)
}

// 组合产品列表导出模板
function exportCombinationTemplate() {
  return downLoadFile(PORT1 + '/groupProduct/exportTemplate')
}

// 组合产品列表导入选品
function importCombination(params) {
  return post(PORT1 + '/groupProduct/import', params, false, true)
}

// 导出组合产品信息
function exportGroupProduct(param) {
  return downLoadFilePost(PORT1 + '/groupProduct/export', param, true)
}

/// kte-product 批量删除产品信息
function deleteProductInfo(param) {
  return post(PORT1 + '/proManager/deleteProductInfo', param, true)
}

// 手动推送到谷仓易仓
function manualPush(param) {
  return post(PORT1 + '/proManager/manualPush', param, true)
}

// /kte-product/proManager/getType  获取属性匹配
function getType(param) {
  return get(PORT1 + '/proManager/getType', param)
}

// 获取谷仓的产品类别
function getGoodCangCategory() {
  return get(PORT1 + '/proManager/getGoodCangCategory')
}

//通过SKU获取库存信息
function getInventoryInfo(param) {
  return post(PORT1 + '/proManager/getInventoryInfo', param, true)
}

//获取导出的字段
function getField() {
  return get(PORT1 + '/proManager/getField')
}

//获取模板信息
function getTemplateInfo() {
  return get(PORT1 + '/proManagerTemplate/getTemplateInfo')
}

//保存模板信息
function saveTemplateInfo(param) {
  return post(PORT1 + '/proManagerTemplate/saveTemplateInfo', param, true)
}

//修改模板信息
function updateTemplateInfo(param) {
  return post(PORT1 + '/proManagerTemplate/updateTemplateInfo', param, true)
}

//删除模板信息
function deleteTemplateInfo(param) {
  console.log('deleteTemplateInfo ', param)
  return remove(PORT1 + '/proManagerTemplate/deleteTemplateInfo', param, true)
}

//获取模板信息详情
function getTemplateInfoDetail(param) {
  return get(PORT1 + '/proManagerTemplate/getTemplateInfoDetail', param)
}

//获取下载队列
function getDownloadQueue(param) {
  return get(PORT1 + '/download/getDownloadQueue', param)
}

//获取产品库新版日志
function getNewLibLog(param) {
  return post(PORT1 + '/proManager/getNewLibLog', param)
}

//删除销售信息
function deleteMarketInfo(param) {
  return get(PORT1 + '/proManager/deleteMarketInfo', param)
}

// //删除质检信息
// function deleteQualityTest(param) {
//   return get(PORT1 + '/proManager/deleteQualityTest', param)
// }

//编辑质检项目
function redactQualityTest(param) {
  return post(PORT1 + '/proManager/redactQualityTest', param, true)
}

// //新增质检项目
// function insertQualityTest(param) {
//   return post(PORT1 + "/proManager/insertQualityTest", param, true)
// }

//根据产品ID获取质检信息
function getQualityTestInfoListByProId(param) {
  return get(PORT1 + '/proManager/getQualityTestInfoListByProId', param)
}

//获取采购部人员
function getPurchaseUserList() {
  return get(PORT1 + '/proManager/getPurchaseUserList')
}

//获取产品库删除日志
function getDeleteProductInfo(param) {
  return get(PORT1 + '/proManager/getDeleteProductInfo', param)
}

/// kte-product产品库全字段更新
function updateProduct(param) {
  return post(PORT1 + '/proManager/updateProduct', param, false, true)
}

// Excel批量更新产品基础信息  /kte-product
function batchUpdateProBasicInfo(param) {
  return post(PORT1 + '/proManager/batchUpdateProBasicInfo', param, false, true)
}

// Excel批量更新采购信息  /kte-product
function proManagerBatchUpdatePurchase(param) {
  return post(PORT1 + '/proManager/batchUpdatePurchase', param, false, true)
}

// Excel申报信息批量更新  /kte-product
function batchUpdateDeclareInfo(param) {
  return post(PORT1 + '/proManager/batchUpdateDeclareInfo', param, false, true)
}

// Excel虚拟申报信息批量更新  /kte-product
function proManagerUpdateVirtualDeclare(param) {
  return post(PORT1 + '/proManager/updateVirtualDeclare', param, false, true)
}

// Excel批量更新销售信息  /kte-product
function batchUpdateProMarketInfo(param) {
  return post(PORT1 + '/proManager/batchUpdateProMarketInfo', param, false, true)
}

//Excel批量更新清关信息 /kte-product
function declareCustomsExcelImport(param) {
  return post(PORT1 + '/declareCustoms/excelImport', param, false, true)
}

//导出指定模板 /kte-product
function exportVarietyTemplate(param) {
  return downLoadFile(PORT1 + '/proManager/exportVarietyTemplate', param)
}

//获取产品库配件总数
function getFittingCount() {
  return get(PORT1 + '/proManager/getFittingCount')
}

//编辑申报信息====新接口
function updateDeclare(param) {
  return post(PORT1 + '/proManager/updateDeclare', param, true)
}

//获取推送易仓是否成功
function getSendYibinStauts(param) {
  return get(PORT1 + '/proManager/getSendYibinStauts', param)
}

//获取平台品类管理列表
function platformCategoryList(params) {
  return get(PORT1 + '/platformCategory/list', params)
}

//品类列表获取详情
function platformCategoryDetail(params) {
  return get(PORT1 + '/platformCategory/detail', params)
}

//平台品类修改
function pcUpdateInfo(param) {
  return post(PORT1 + '/platformCategory/updateInfo', param, true)
}
//平台品类删除
function pcRemove(param) {
  return post(PORT1 + '/platformCategory/remove', param, true)
}

//审核平台品类
function pcAuditInfo(param) {
  return post(PORT1 + '/platformCategory/auditInfo', param, true)
}

//新增平台品类
function pcSubmit(param) {
  return post(PORT1 + '/platformCategory/submit', param, true)
}

//获取所有平台
function getAllPlatform() {
  return get(PORT1 + '/platformCategory/getAllPlatform')
}

//根据平台获取平台下站点
function getSiteByPlatformId(param) {
  return get(PORT1 + '/platformCategory/getSiteByPlatformId', param)
}

//根据id获取平台品类日志
function getLogById(param) {
  return get(PORT1 + '/platformCategory/getLogById', param)
}

//批量导入平台类目模板
function pcBatchImportTemplate(param) {
  return downLoadFile(PORT1 + '/platformCategory/batchImportTemplate', param)
}

//平台类目批量导入
function pcBatchImport(params) {
  return post(PORT1 + '/platformCategory/batchImport', params, false, true)
}

//批量更新平台类目模板
function pcBatchUpdateTemplate(param) {
  return downLoadFile(PORT1 + '/platformCategory/batchUpdateTemplate', param)
}

// 平台品类数据导出
function platformCategoryExport(params) {
  return downLoadFilePost(PORT1 + '/platformCategory/export', params, true)
}

//批量更新平台类目
function pcBatchUpdate(param) {
  return post(PORT1 + '/platformCategory/batchUpdate', param, false, true)
}

//Spu属性管理列表
function spuPropertyList(param) {
  return get(PORT1 + '/spuProperty/list', param)
}

//新增spu属性管理
function spSaveSpuProperty(param) {
  return post(PORT1 + '/spuProperty/saveSpuProperty', param, true)
}

//修改spu属性管理
function spEditSpuProperty(param) {
  return post(PORT1 + '/spuProperty/editSpuProperty', param, true)
}

//审核spu属性品类
function spAuditInfo(param) {
  return post(PORT1 + '/spuProperty/auditInfo', param, true)
}

//批量删除spu属性
function spBatchDeletion(param) {
  return post(PORT1 + '/spuProperty/batchDeletion', param, true)
}

//批量更新spu属性模板
function spuPropertyBatchUpdateTemplate(param) {
  return downLoadFile(PORT1 + '/spuProperty/batchUpdateTemplate', param)
}

//批量更新spu属性
function spuPropertyBatchUpdate(param) {
  return post(PORT1 + '/spuProperty/batchUpdate', param, false, true)
}

//批量导入spu属性
function spuPropertyBatchImport(param) {
  return post(PORT1 + '/spuProperty/batchImport', param, false, true)
}

//spu属性批量导入模板
function spuPropertyBatchImportTemplate(param) {
  return downLoadFile(PORT1 + '/spuProperty/batchImportTemplate', param)
}

//spu属性管理导出
function spuPropertyExport(params) {
  return downLoadFilePost(PORT1 + '/spuProperty/export', params, true)
}

//spu属性管理获取详情
function spuPropertyGetDetail(params) {
  return get(PORT1 + '/spuProperty/getDetail', params)
}

//spu分配负责人
function spuPropertySssignThePersonInCharge(param) {
  return post(PORT1 + '/spuProperty/assignThePersonInCharge', param, true)
}

//一键提交产品库申报信息中清关信息
function dealBatchBasicsDeclareCustoms(param) {
  return post(PORT1 + '/declareCustoms/dealBatchBasicsDeclareCustoms', param, true)
}

// 获取系统品类列表
function getCategoryList(param) {
  return get(PORT1 + '/category/list', param)
}
//系统品类导出
function categoryExport(params) {
  return downLoadFilePost(PORT1 + '/category/export', params, true)
}

//系统品类列表懒加载
function categoryLazyList(param) {
  return get(PORT1 + '/category/lazy-list', param)
}

//系统品类修改
function categoryUpdateInfo(param) {
  return post(PORT1 + '/category/updateInfo', param, true)
}

//系统品类新增
function categorySubmitInfo(param) {
  return post(PORT1 + '/category/submit', param, true)
}

//系统审核品类
function categoryAuditInfo(param) {
  return post(PORT1 + '/category/auditInfo', param, true)
}

//系统品类详情
function categoryDetailInfo(param) {
  return get(PORT1 + '/category/detail', param)
}

//系统品类日志
function categoryGetLogById(param) {
  return get(PORT1 + '/category/getLogById', param)
}

//批量更新系统品类模板
function categoryBatchUpdateTemplate(param) {
  return downLoadFile(PORT1 + '/category/batchUpdateTemplate', param)
}

//批量更新系统品类
function categoryBatchUpdate(param) {
  return post(PORT1 + '/category/batchUpdate', param, false, true)
}

//批量导入系统品类
function categoryBatchImport(param) {
  return post(PORT1 + '/category/batchImport', param, false, true)
}

//批量导入系统品类模板
function categoryBatchImportTemplate(param) {
  return downLoadFile(PORT1 + '/category/batchImportTemplate', param)
}

//系统品类指派负责人
function categoryAssignThePersonInCharge(param) {
  return post(PORT1 + '/category/assignThePersonInCharge', param, true)
}

//品类对照表修改
function CategoryMappingUpdate(param) {
  return post(PORT1 + '/category-mapping/update', param, true)
}

//品类对照表新增
function categoryMappingSave(param) {
  return post(PORT1 + '/category-mapping/save', param, true)
}

//品类对照表根据Id删除
function CategoryMappingDelete(id) {
  return get(PORT1 + '/category-mapping/delete?id=' + id, {})
}

//品类对照表日志
function CategoryMappingLog(param) {
  return get(PORT1 + '/category-mapping/log', param)
}

//导出品类对照表
function exportCategoryMapping(id) {
  return downLoadFilePost(PORT1 + '/category-mapping/exportCategoryMapping?sysCategoryId=' + id, {}, true)
}

//导入品类对照表
function importCategoryMapping(param) {
  return post(PORT1 + '/category-mapping/importCategoryMapping', param, false, true)
}
// 获取导入模板
function getExportTemplate() {
  return downLoadFile(PORT1 + '/category-mapping/exportTemplate')
}

// 根据系统品类Id查询全部品类映射
function categoryMappingList(param) {
  return get(PORT1 + '/category-mapping/list', param)
}
// 获取平台中英文类目
function getPlatformCategoryByPlatformIdAndSiteId(param) {
  return post(PORT1 + '/platformCategory/getPlatformCategoryByPlatformIdAndSiteId', param, true)
}
// 添加品类对照
function saveMapping(param) {
  return post(PORT1 + '/category-mapping/save', param, true)
}

//获取spu属性管理日志
function spuPropertyGetLog(param) {
  return get(PORT1 + '/spuProperty/getLog', param)
}

//spu属性管理启用禁用
function updateIsDisable(param) {
  return post(PORT1 + '/spuProperty/updateIsDisable', param, true)
}

//获取系统品类单个品类负责人
function getPersonInChargeById(param) {
  return get(PORT1 + '/category/getPersonInChargeById', param)
}

//获取spu属性管理单个品类负责人
function getSpuPropertyPersonInChargeById(param) {
  return get(PORT1 + '/spuProperty/getPersonInChargeById', param)
}

//根据id启用停用系统品类
function categoryDisableById(param) {
  return post(PORT1 + '/category/disableById', param, true)
}

//品类对照表左边列表
function categoryGetAllCategoryList(param) {
  return get(PORT1 + '/category/getAllCategoryList', param)
}

//品类对照表左(新)
function categorySysCategoryList(param) {
  return get(PORT1 + '/category/sysCategoryList', param)
}

//获取品类总数
function categoryGetCategoryCount(param) {
  return get(PORT1 + '/category/getCategoryCount', param)
}

//平台品类列表懒加载
function platformCategoryLazyList(param) {
  return get(PORT1 + '/platformCategory/lazy-list', param)
}

//获取当前用户系统品类权限
function categoryGetUserCategoryAuth(param) {
  return get(PORT1 + '/category/getUserCategoryAuth', param)
}

//获取当前用户spu品类权限
function spuPropertyGetUserSpuAuth(param) {
  return get(PORT1 + '/spuProperty/getUserSpuAuth', param)
}

// 提供模糊搜索系统品类列表
function categorySysFuzzyList(param) {
  return get(PORT1 + '/category/sysFuzzyList', param)
}

//获取异常供应商退货地址
function selectSupplierById(param) {
  return get(PORT1 + '/supplier/selectSupplierById', param)
}

function getCatagoryByParentId(param) {
  return get(PORT1 + '/category/getCategoryListByParentId', param)
}
//判断是否展示供应商
function isShowSupplier(param) {
  return post(PORT1 + '/proManager/isShowSupplier', param)
}
//根据开发负责人获取咨询负责人
function getInformationMan(param) {
  return get(PORT1 + '/proManager/getInformationMan', param)
}
//导入谷仓产品信息模板
function batchUpdateGoodCangProductInfo(param) {
  return post(PORT1 + '/proManager/batchUpdateGoodCangProductInfo', param, false, true)
}
//获取备注信息
function getRemarkByProId(param) {
  return get(PORT1 + '/proManager/getRemarkByProId', param)
}
//获取海外仓下拉数据
function getOverseasWarehouseCodeList(param) {
  return get('/kte-warehouse/GoodCangWarehouse/getOverseasWarehouseCodeList', param)
}

//提交采购单
function synchronizationInfoToPurchase(param) {
  return post(PORT1 + '/proManager/synchronizationInfoToPurchase', param, true)
}

// 查询当前用户产品列表字段
function getUserCustomField(params) {
  return get(PORT1 + '/userCustomField/getUserCustomField', params)
}

// 创建当前用户产品列表字段
function createUserCustomField(params) {
  return post(PORT1 + '/userCustomField/createUserCustomField', params, true)
}

// 更新当前用户产品列表字段
function updateUserCustomField(params) {
  return post(PORT1 + '/userCustomField/updateUserCustomField', params, true)
}
//根据负责人获取对应品类
function getCategoryByPersonInCharge() {
  return get(PORT1 + '/category/getCategoryByPersonInCharge')
}
//获取可分配人员
function getAssignStaff(param) {
  return post(PORT1 + '/category/getAssignStaff', param, true)
}
//获取spu负责人
function getPersonInCharge(params) {
  return post(PORT1 + '/spuProperty/getPersonInCharge', params, true)
}
//海外递四方推送
function manualControlPush4px(param) {
  return post(PORT1 + '/pushTo4px/manualControlPush4px', param, true)
}
//导入分配负责人
function importManager(params) {
  return post(PORT1 + '/category/importManager', params, false, true)
}
//批量导入负责人模板
function importManagerTemplate(param) {
  return downLoadFile(PORT1 + '/category/importManagerTemplate', param)
}
//更新负责人
function updatePrincipal(param) {
  return post(PORT1 + '/spuProperty/updatePrincipal', param, false, true)
}
//更新负责人模板
function getPrincipalTemplate(params) {
  return downLoadFile(PORT1 + '/spuProperty/getPrincipalTemplate', params)
}
//产品列表下载队列下载
function NewdownloadFile(params) {
  return downLoadFile(PORT1 + '/download/downloadFile', params)
}

//删除下载队列
function deleteQueueById(params) {
  return get(PORT1 + '/download/deleteQueueById', params)
}

//系统品类管理审核表回显
function getVerifyPrincipal(params) {
  return post(PORT1 + '/category/getVerifyPrincipal' , params ,true)
}

//spu属性管理审核表回显
function getSpuVerifyPrincipal(params) {
  return post(PORT1 + '/spuProperty/getVerifyPrincipal' , params ,true)
}

//组合产品日志
function groupProductLogById(params){
  return get(PORT1 + '/groupProduct/groupProductLogById',params)
}
export default {
  getUserCustomField,
  createUserCustomField,
  updateUserCustomField,
  synchronizationInfoToPurchase,
  getOverseasWarehouseCodeList,
  getRemarkByProId,
  batchUpdateGoodCangProductInfo,
  isShowSupplier,
  getInformationMan,
  getCatagoryByParentId,
  categoryMappingList,
  getPlatformCategoryByPlatformIdAndSiteId,
  getExportTemplate,
  saveMapping,
  mergeSku,
  getMergeLog,
  getLikeSku,
  getMergeInfo,
  updateVirtualDeclare,
  getVirtualDeclare,
  getProDevStatus,
  insertProDevStatus,
  updateProDevStatus,
  deleteProDevStatus,
  removeDictById,
  saveDict,
  getProductList,
  getGroupProductList,
  addGroupProduct,
  exportProduct,
  exportProductTemplate,
  importProduct,
  deleteGroupProduct,
  searchGroupProduct,
  getGroupProductLog,
  deleteProduct,
  getProductLog,
  addProductInfo,
  getPayInforRemoval,
  batchEdit,
  updateProduct,
  getDetails,
  secondDetail,
  getDetailsProductReview,
  portfolioListDetail,
  categoryDetail,
  selectAttachs,
  exportCombinationTemplate,
  importCombination,
  getOverSearCangInfo,
  insertVirtualDeclare,
  exportGroupProduct,
  deleteProductInfo,
  manualPush,
  getType,
  getGoodCangCategory,
  getInventoryInfo,
  getField,
  getTemplateInfo,
  saveTemplateInfo,
  updateTemplateInfo,
  deleteTemplateInfo,
  getTemplateInfoDetail,
  getDownloadQueue,
  getNewLibLog,
  deleteMarketInfo,
  // deleteQualityTest,
  redactQualityTest,
  // insertQualityTest,
  getQualityTestInfoListByProId,
  getPurchaseUserList,
  categoryRemove,
  getDeleteProductInfo,
  batchUpdateProBasicInfo,
  proManagerBatchUpdatePurchase,
  batchUpdateDeclareInfo,
  proManagerUpdateVirtualDeclare,
  batchUpdateProMarketInfo,
  exportVarietyTemplate,
  getFittingCount,
  updateDeclare,
  getSendYibinStauts,
  platformCategoryList,
  platformCategoryDetail,
  pcUpdateInfo,
  pcRemove,
  pcAuditInfo,
  pcSubmit,
  getAllPlatform,
  getSiteByPlatformId,
  getLogById,
  spuPropertyList,
  spSaveSpuProperty,
  spEditSpuProperty,
  spAuditInfo,
  pcBatchImportTemplate,
  pcBatchImport,
  pcBatchUpdateTemplate,
  dealBatchBasicsDeclareCustoms,
  declareCustomsExcelImport,
  pcBatchUpdate,
  platformCategoryExport,
  getCategoryList,
  categoryLazyList,
  categoryUpdateInfo,
  categoryDetailInfo,
  categorySubmitInfo,
  categoryAuditInfo,
  categoryGetLogById,
  categoryBatchUpdate,
  categoryBatchUpdateTemplate,
  categoryBatchImport,
  categoryBatchImportTemplate,
  categoryAssignThePersonInCharge,
  spuPropertyBatchUpdateTemplate,
  spuPropertyBatchUpdate,
  spuPropertyBatchImport,
  spuPropertyBatchImportTemplate,
  spuPropertyExport,
  categoryExport,
  CategoryMappingUpdate,
  categoryMappingSave,
  CategoryMappingDelete,
  CategoryMappingLog,
  exportCategoryMapping,
  importCategoryMapping,
  spuPropertyGetDetail,
  spBatchDeletion,
  spuPropertySssignThePersonInCharge,
  spuPropertyGetLog,
  updateIsDisable,
  getPersonInChargeById,
  getSpuPropertyPersonInChargeById,
  categoryDisableById,
  categoryGetAllCategoryList,
  categorySysCategoryList,
  categoryGetCategoryCount,
  platformCategoryLazyList,
  categoryGetUserCategoryAuth,
  spuPropertyGetUserSpuAuth,
  categorySysFuzzyList,
  selectSupplierById,
  getCategoryByPersonInCharge,
  getAssignStaff,
  getPersonInCharge,
  manualControlPush4px,
  importManager,
  importManagerTemplate,
  updatePrincipal,
  getPrincipalTemplate,
  NewdownloadFile,
  deleteQueueById,
  getVerifyPrincipal,
  getSpuVerifyPrincipal,
  groupProductLogById
}