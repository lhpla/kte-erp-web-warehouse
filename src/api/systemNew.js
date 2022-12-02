import {
  get,
  post,
  remove,
  put,
  downLoadFile,
  downLoadFilePost
} from "./request";

const PORT1 = "/kte-system";

//获取国家数列表
function getCountryList() {
  return get(PORT1 + "/country/list");
}

//获取所有平台 platform/all
function getPlatformAll() {
  return get(PORT1 + "/platform/all");
}

export default {
  getCountryList,
  getPlatformAll,
};