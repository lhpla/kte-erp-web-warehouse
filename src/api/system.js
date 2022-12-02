import { get, post, remove, put, downLoadFile, downLoadFilePost } from './request'
const PORT2 = '/kte-system'
const PORT3 = '/kte-product'
const PORT4 = '/kte-user'
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)
// ！各文件接口方法名不能冲突，尽量语义化(同时加上模块关键字)

// 获取展示按钮数据
function getBtnFromMenu() {
  return get(PORT2 + '/menu/web-buttons')
}

// 获取单个字典
function getDict(params) {
  return get(PORT2 + '/dict/dictionary', params)
}

// 获取所有字典
function getDictList(params) {
  return get(PORT2 + '/dict/list', params)
}

// 获取全部站点
function getAllSiteList(param) {
  return get(PORT2 + '/site/getAllSiteList', param)
}

// 根据平台展示站点
function getSiteByPlat(param) {
  return get(PORT2 + '/site/platformList', param)
}

// 获取汇率列表
function getExchangeList() {
  return get(PORT2 + '/rate/selectAll')
}

// 仓库列表
function getWareHouseList(param) {
  return get(PORT2 + '/wareHouse/list', param)
}

// 获取产品品类列表
function getProductList(param) {
  return get(PORT3 + '/category/list', param)
}

//获取所有品类
function getAllCategoryList(param) {
  return get(PORT3 + '/category/getAllCategoryList', param)
}

// 新增产品品类
function addProduct(param) {
  return post(PORT3 + '/category/submit', param, true)
}

// 修改产品品类
function editProduct(param) {
  return post(PORT3 + '/category/update', param, true)
}

//获取市场部员工接口 （产品库销售负责人与销售附属人）
function getMarketingDepartmentList(param) {
  return get(PORT4 + '/getSalesManager', param)
}
//获取对应平台
function getAllPlatform(param) {
  return get(PORT2 + '/platform/all', param)
}
//新增二手
function addSecondSku(param) {
  return post(PORT3 + '/proManager/addSecondSku', param,true)
}

// 根据path获取顶级菜单ID  /kte-system

function getMenuByPath(param) {
  return get(PORT2 + '/menu/getMenu-byPath', param)
}

export default {
  getAllPlatform,
  addSecondSku,
  getDict,
  getDictList,
  getAllSiteList,
  getExchangeList,
  getProductList,
  editProduct,
  addProduct,
  getWareHouseList,
  getSiteByPlat,
  getBtnFromMenu,
  getMarketingDepartmentList,
  getAllCategoryList,
  getMenuByPath,
}
