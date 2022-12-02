import {
  get,
  post,
  remove,
  put,
  downLoadFile,
  downLoadFilePost
} from "./request";
const PORT1 = "/kte-user";
const PORT2 = "/kte-system";
// ！  关于用户的操作  userOperation

// 获取开发负责人
function getHeadOfDevelopment() {
  return get(PORT1 + "/getHeadOfDevelopment");
}

// 获取采购负责人
function getHeadOfPurchasing() {
  return get(PORT1 + "/getHeadOfPurchasing");
}

// 获取产品咨询人
function getProductConsultation() {
  return get(PORT1 + "/getProductConsultation");
}

// 新增用户
function createUser(params) {
  return post(PORT1 + "/submit", params, true);
}

// 修改用户
function updateUser(params) {
  return post(PORT1 + "/update", params, true);
}

//获取所有用户
function getAllUser() {
  return get(PORT1 + "/getAllUser")
}

export default {
  getHeadOfDevelopment,
  getHeadOfPurchasing,
  getProductConsultation,
  createUser,
  updateUser,
  getAllUser,
};
