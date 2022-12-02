import {
  get,
  post,
  remove,
  put,
  downLoadFileZip
} from "./request";
const PORT1 = "/kte-resource";

// 上传文件（视频/图片/音频等）
function uploadImgAllFun(param) {
  return post(PORT1 + "/oss/endpoint/put-file", param, false, true);
}

export default {
  uploadImgAllFun,
};
