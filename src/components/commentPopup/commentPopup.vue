<!-- 意见弹框封装 -->
<template>
  <div id="commentPopup">
    <el-dialog
      :title="logTitle"
      v-model="dialogVisible"
      width="30%"
      @close="closed"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div class="min_title" v-if="!isDetail">{{ firstTile }}</div>
      <span v-if="!isDetail">{{ minTitle }}</span>
      <span v-if="isDetail">意见</span>
      <el-form class="el_form" :disabled="isDetail">
        <el-form-item>
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入意见进行说明"
            v-model="CommentsText"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="picturesBox">
        <div v-if="!isDetail">
          <el-upload
            drag
            action="string"
            ref="uploadImgRef"
            list-type="picture-card"
            :fileList="fileList"
            :http-request="uploadImage"
            :multiple="true"
            :limit="imgLimit"
            show-file-list
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-exceed="handleExceed"
            :on-error="imgUploadError"
          >
            <i class="el-icon-plus"></i>
            <template #file="{ file }">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <i class="el-icon-download"></i>
                </span>
                <span
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </template>
          </el-upload>
          <span class="el_dialog_image">
            <el-dialog
              v-model="dialogVisibleImage"
              :close-on-click-modal="false"
              destroy-on-close
            >
              <div style="width: 100%; height: 100%">
                <el-image
                  style="width: 100%; height: 100%"
                  :src="dialogImageUrl"
                  fit="contain"
                  alt=""
                ></el-image>
              </div>
            </el-dialog>
          </span>
        </div>

        <div v-else>
          <span v-if="fileList.length > 0">
            <span v-for="(item, index) of fileList" :key="index" class="imgBox">
              <i
                class="el-icon-circle-close filebadge"
                type="primary"
                v-if="!isDetail"
                @click="removeImg(index)"
              ></i>
              <el-image
                style="width: 100px; height: 100px"
                :src="item.url"
                fit="contain"
                :preview-src-list="[item.url]"
              ></el-image>
            </span>
          </span>
          <span v-else>暂无图片</span>
        </div>
      </div>
      <template #footer v-if="!isDetail">
        <span class="dialog-footer">
          <el-button
            @click="dialogVisible = false"
            size="mini"
            :disabled="btnLoading"
            :loading="btnLoading"
            >取 消</el-button
          >
          <el-button
            type="primary"
            @click="subMit"
            :disabled="btnLoading"
            :loading="btnLoading"
            size="mini"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  ref,
  onBeforeMount,
  onMounted,
  inject,
  getCurrentInstance,
} from "vue";
export default {
  name: "",
  props: {
    firstTile: {
      type: String,
      default: "审核通过",
    },
    minTitle: {
      type: String,
      default: "确认所选产品信息通过？",
    },
    // 值为1：通过   值为2：作废   值为3：不通过  值为4：驳回采购  值为5：驳回开发
    openType: {
      type: String,
      default: "1",
    },
    logTitle: {
      type: String,
      default: "确认操作",
    },
  },
  setup(prop, ctx) {
    const data = reactive({
      // 确认操作falg
      dialogVisible: false,
      // 意见说明
      CommentsText: "",
      // 图片列表
      fileList: [],
      // 最多上传条数
      imgLimit: 3,
      // 是否是查看详情
      isDetail: false,
      // 获取接口参数对象
      paramObj: {},
      //按钮loding
      btnLoading: false,
      dialogVisibleImage: false,
      dialogImageUrl: "",
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});

    // 图片上传
    const beforeAvatarUpload = (file) => {
      const isImage =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      // const isImage = file.type === "image/jpg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isImage) {
        // vue.$message.error("上传图片只能是 jpg / jpeg / png / gif 格式!");
        vue.$message.error("上传图片只能是 jpg  / png 格式!");
        data.fileList = [];
      }
      if (!isLt2M) {
        vue.$message.error("上传头像图片大小不能超过 5MB!");
        data.fileList = [];
      }
      console.log(isImage, isLt2M);
      return isImage && isLt2M;
    };

    //图片下载
    const handleDownload = (e) => {
      const a = document.createElement("a");
      a.style.display = "none";
      a.download = "kte-oss";
      a.href = e.url;
      a.click();
      // 去除下载对url的影响
      window.URL.revokeObjectURL(e.url);
    };

    // 获取图片
    const getPicture = (msg) => {
      data.isDetail = false;
      data.dialogVisible = true;
      if (msg.isDetail) {
        data.isDetail = msg.isDetail;
        data.CommentsText =
          msg.CommentsText && msg.CommentsText != ""
            ? msg.CommentsText.trim()
            : "暂无";
      }
      if (msg.list && msg.list.length > 0) {
        data.fileList = msg.list[0].url != "" ? msg.list : [];
      }
    };

    const getTableData = inject("getTableData");
    const changeBtnFlag = inject("changeBtnFlag");
    const closeTab = inject("closeTab");

    // 打开弹框
    const openLog = (msg) => {
      data.dialogVisible = true;
      data.paramObj = msg;
      data.isDetail = false;
      data.btnLoading = false;
      data.CommentsText = msg.param.opinion;
    };

    // 确认弹框
    const subMit = () => {
      data.btnLoading = true;
      data.paramObj.param.opinion = data.CommentsText
        ? data.CommentsText.trim()
        : "";
      let arr = [];
      data.fileList.map((item) => {
        arr.push(item.url);
      });
      data.paramObj.param.opinionPicture = arr.join(",");
      //产品终审 助理审核 选品审核 通过时可以为空
      if (
        (data.paramObj.funName == "updateAssistantStatus" &&
          data.paramObj.isPass) ||
        (data.paramObj.funName == "auditOpinion" && data.paramObj.isPass) ||
        (data.paramObj.funName == "updateAuditStatus" &&
          data.paramObj.param.status == 3)
      ) {
        if (
          (data.paramObj.funName == "updateAssistantStatus" &&
            data.paramObj.isPass) ||
          (data.paramObj.funName == "auditOpinion" && data.paramObj.isPass)
        ) {
          changeBtnFlag(true);
        }
        api[data.paramObj.path]
          [data.paramObj.funName](data.paramObj.param)
          .then((res) => {
            if (res.code == 200) {
              vue.$message({
                type: "success",
                message: res.msg,
              });
              closed();
              getTableData();
              data.btnLoading = false;

              if (
                (data.paramObj.funName == "updateAssistantStatus" &&
                  data.paramObj.isPass) ||
                (data.paramObj.funName == "auditOpinion" &&
                  data.paramObj.isPass)
              ) {
                changeBtnFlag(false);
              }
              if (closeTab) {
                closeTab();
              }
            } else {
              vue.$message({
                type: "warning",
                message: res.msg,
              });
              if (
                (data.paramObj.funName == "updateAssistantStatus" &&
                  data.paramObj.isPass) ||
                (data.paramObj.funName == "auditOpinion" &&
                  data.paramObj.isPass)
              ) {
                changeBtnFlag(false);
              }

              closed();
              data.btnLoading = false;
            }
          })
          .catch((err) => {
            data.btnLoading = false;
            if (
              (data.paramObj.funName == "updateAssistantStatus" &&
                data.paramObj.isPass) ||
              (data.paramObj.funName == "auditOpinion" && data.paramObj.isPass)
            ) {
              changeBtnFlag(false);
            }
          });
      } else {
        if (data.paramObj.param.opinion != "") {
          api[data.paramObj.path]
            [data.paramObj.funName](data.paramObj.param)
            .then((res) => {
              if (res.code == 200) {
                vue.$message({
                  type: "success",
                  message: res.msg,
                });
                closed();
                getTableData();
                if (closeTab) {
                  closeTab();
                }
              } else {
                vue.$message({
                  type: "warning",
                  message: res.msg,
                });
                closed();
                data.btnLoading = false;
              }
            });
        } else {
          vue.$message.warning("意见不能为空！");
          data.btnLoading = false;
        }
      }
    };

    // uploadImage//上传图片
    const uploadImage = (param) => {
      let formImgData = new FormData();
      formImgData.append("file", param.file);
      formImgData.append("pathName", data.pathName);
      api.uploadImg.uploadImgAllFun(formImgData).then((res) => {
        if (res.code == 200) {
          param.onSuccess();
          let img = {
            url: "",
          };
          img.url = res.data.link;
          data.fileList.push(img);
          data.fileList.map((item, index) => {
            if (item.name && item.uid) {
              data.fileList.splice(index, 1);
            }
          });
          console.log(data.fileList);
        } else {
          param.onError();
        }
      });
    };

    // 上传成功
    const handleAvatarSuccess = (res, file) => {
      data.fileList.push(file)
      vue.$message.success("上传图片成功!");
    };

    // 上传错误提示
    const imgUploadError = (err, file, fileList) => {
      // 图片上传失败调用
      vue.$message.error("文件异常，请重新上传!");
    };

    // 文件数超出提示
    const handleExceed = (file, fileList) => {
      // 图片上传超过数量限制
      vue.$message.error("上传图片不能超过" + data.imgLimit + "张!");
    };

    // 图片预览
    const handlePictureCardPreview = (file) => {
      data.dialogImageUrl = file.url;
      data.dialogVisibleImage = true;
    };

    // 图片删除
    const handleRemove = (file, fileList) => {
      data.fileList.map((i, index) => {
        if (i.url == file.url) {
          data.fileList.splice(index, 1);
        }
      });
    };

    // 移除图片
    const removeImg = (index) => {
      data.fileList = data.fileList.splice(index, 1);
      data.isUpdate = true;
    };

    // 关闭弹框
    const closed = () => {
      data.fileList = [];
      data.CommentsText = "";
      data.dialogVisible = false;
      data.isDetail = true;
    };

    const refData = toRefs(data);
    return {
      ...refData,
      uploadImage,
      handleExceed,
      handleAvatarSuccess,
      imgUploadError,
      removeImg,
      beforeAvatarUpload,
      handlePictureCardPreview,
      getPicture,
      closed,
      subMit,
      openLog,
      handleRemove,
      handleDownload,
      getTableData,
      closeTab,
      changeBtnFlag
    };
  },
};
</script>
<style scoped lang="scss">
#commentPopup {
  height: auto;
  .min_title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .el_form {
    margin-top: 20px;
  }
  .picturesBox {
    height: 180px;
  }
}
:deep(.el-list-leave-active){
  width: 100%;
  height: 100%;
  transform: translate(0px,0px);
  top: 0;
  left: 0;
  transition:  all 0s;
}
:deep(.el-list-enter-active){
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translate(0px,0px);
  transition:  all 0s;
}
:deep(.el-list-enter-to){
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition:  all 0s;
  transform: translate(0px,0px);

}
</style>
