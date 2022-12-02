<!-- 意见弹框封装 -->
<template>
  <div id="Abnormal">
    <!-- 确认操作 -->
    <el-dialog :title="logTitle" v-model="dialogVisible" :close-on-click-modal="false" width="30%" @close="closed" destroy-on-close>
      <div class="min_title">异常</div>
      <span v-show="!isDetail">点击后，直接进入下一环节</span>
      <el-form class="el_form" :disabled="isDetail">
        <el-form-item>
          <el-radio v-model="paramObj.exceptionState" label="1">寻源无果/无供应商</el-radio>
          <el-radio v-model="paramObj.exceptionState" label="2">起批量不足/无量</el-radio>
          <el-radio v-model="paramObj.exceptionState" label="3">采购价过高/无利</el-radio>
        </el-form-item>
        <el-form-item>
          <el-input type="textarea" clearable :rows="3" placeholder="请输入意见进行说明" v-model="paramObj.exceptionExplain"></el-input>
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
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            :on-exceed="handleExceed"
            :on-error="imgUploadError"
          >
            <i class="el-icon-plus"></i>
            <template #file="{ file }">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span class="el-upload-list__item-delete" @click="handleDownload(file)">
                  <i class="el-icon-download"></i>
                </span>
                <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </template>
          </el-upload>
          <span class="el_dialog_image">
            <el-dialog v-model="dialogVisibleImage" :close-on-click-modal="false" destroy-on-close>
              <div style="width: 100%; height: 100%">
                <el-image style="width: 100%; height: 100%" :src="dialogImageUrl" fit="contain" alt=""></el-image>
              </div>
            </el-dialog>
          </span>
        </div>

        <div v-else>
          <span v-for="(item, index) of fileList" :key="index" class="imgBox">
            <i class="el-icon-circle-close filebadge" type="primary" v-if="!isDetail" @click="removeImg"></i>
            <el-image style="width: 100px; height: 100px" :src="item.url" fit="contain" @click.stop="handleClickItem" :preview-src-list="[item.url]"></el-image>
          </span>
        </div>
      </div>
      <template #footer v-if="!isDetail">
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="subMit" v-loading="btnLoading" :disabled="btnLoading" size="mini">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, inject, getCurrentInstance } from "vue";
export default {
  name: "Abnormal",
  props: {
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
      paramObj: {
        proId: [],
        exceptionExplain: "",
        exceptionPic: "",
        exceptionState: "",
      },
      dialogVisibleImage: false,
      dialogImageUrl: "",
      btnLoading: false,
    });
    const { ctx: vueDev, proxy: vue } = getCurrentInstance();
    const api = vue.$http;
    onBeforeMount(() => {});
    onMounted(() => {});
    const getDataList = inject("getDataList");
    const closeTab = inject("closeTab");

    // 图片上传
    const beforeAvatarUpload = file => {
      const isImage = file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png" || file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isImage) {
        vue.$message.error("上传图片只能是 jpg  / png 格式!");
      }
      if (!isLt2M) {
        vue.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return isImage && isLt2M;
    };

    //图片下载
    const handleDownload = e => {
      const a = document.createElement("a");
      a.style.display = "none";
      a.download = "kte-oss";
      a.href = e.url;
      a.click();
      // 去除下载对url的影响
      window.URL.revokeObjectURL(e.url);
    };

    // 获取图片
    const getPicture = msg => {
      data.dialogVisible = true;
      data.isDetail = false;
      if (msg.isDetail) {
        data.isDetail = msg.isDetail;
        data.CommentsText = msg.CommentsText;
      }
      if (msg.list && msg.list.length > 0) {
        data.fileList = msg.list;
      }
    };

    // 确认弹框
    const subMit = () => {
      let arr = [];
      data.fileList.map(item => {
        arr.push(item.url);
      });
      data.paramObj.exceptionPic = arr.join(",");
      data.paramObj.exceptionExplain = data.paramObj.exceptionExplain ? data.paramObj.exceptionExplain.trim() : "";
      data.btnLoading = true;
      api.develop
        .exceptionSubmit(data.paramObj)
        .then(res => {
          if (res.code == 200) {
            vue.$message({
              type: "success",
              message: res.msg,
            });
            closed();
            getDataList();
            data.btnLoading = false;
            if (closeTab) {
              closeTab();
            }
          } else {
            data.btnLoading = false;
            vue.$message({
              type: "warning",
              message: res.msg,
            });
            closed();
          }
        })
        .catch(() => {
          data.btnLoading = false;
        });
    };

    // uploadImage//上传图片
    const uploadImage = param => {
      let formImgData = new FormData();
      formImgData.append("file", param.file);
      formImgData.append("pathName", data.pathName);
      api.uploadImg.uploadImgAllFun(formImgData).then(res => {
        if (res.code == 200) {
          let img = {
            url: "",
          };
          img.url = res.data.link;
          data.fileList.push(img);
          param.onSuccess();
        } else {
          param.onError();
        }
      });
    };

    // 上传成功
    const handleAvatarSuccess = (res, file) => {
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
      console.log(file, fileList);
    };

    // 预览图片点击遮罩层关闭预览
    const handleClickItem = () => {
      // 获取遮罩层dom
      data.timerOut = setTimeout(function () {
        let domImageMask = document.querySelector(".el-image-viewer__wrapper");
        console.log(domImageMask);
        if (!domImageMask) {
          return;
        }
        domImageMask.addEventListener("click", e => {
          if (e.target.parentNode.className == "el-image-viewer__actions__inner") {
            return; // 如果点击底部菜单，不关闭
          }
          // 点击遮罩层时调用关闭按钮的 click 事件
          document.querySelector(".el-image-viewer__close").click();
        });
      }, 300);
    };

    // 图片预览
    const handlePictureCardPreview = file => {
      data.dialogImageUrl = file.url;
      data.dialogVisibleImage = true;
    };

    // 移除图片
    const removeImg = index => {
      data.fileList = data.fileList.splice(index, 1);
      data.isUpdate = true;
    };

    // 关闭弹框
    const closed = () => {
      data.fileList = [];
      data.CommentsText = "";
      data.paramObj = {};
      data.dialogVisible = false;
      data.isDetail = true;
    };

    const getMsg = msg => {
      data.dialogVisible = true;
      data.isDetail = false;
      console.log(msg);
      if (msg.proId && msg.proId.length > 0) {
        data.paramObj.proId = msg.proId;
      } else {
        data.isDetail = msg.isDetail;
        data.paramObj.exceptionExplain = msg.CommentsText;
        data.paramObj.exceptionState = msg.exceptionState;
        if (msg.list && msg.list.length > 0) {
          data.fileList = msg.list;
        }
      }
    };

    const handleRemove = (file, fileList) => {
      console.log(file, fileList);
      data.fileList.map((i, index) => {
        if (i.url == file.url) {
          data.fileList.splice(index, 1);
        }
      });
    };

    const refData = toRefs(data);
    return {
      ...refData,
      uploadImage,
      handleExceed,
      handleAvatarSuccess,
      imgUploadError,
      handleClickItem,
      removeImg,
      beforeAvatarUpload,
      handlePictureCardPreview,
      getPicture,
      closed,
      subMit,
      getMsg,
      handleRemove,
      handleDownload,
    };
  },
};
</script>
<style scoped lang="scss">
#Abnormal {
  .min_title {
    font-size: 16px;
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
</style>
