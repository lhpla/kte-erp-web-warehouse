<!--PropertyManageEdit  SPU属性管理弹窗-->
<template>
  <div id="PropertyManageEdit">
    <el-dialog :title="title" v-model="productVisible" :close-on-click-modal="false" width="650px" @close="closed" destroy-on-close>
      <el-form
        ref="productFormRef"
        size="mini"
        :model="productForm"
        :rules="rules"
        label-width="120px"
        class="dialog-form"
      >
        <el-form-item label="图片：" prop="imageUrl" class="picture">
          <!-- v-if="productForm.imageUrl == ''" -->
          <span class="commonNote">仅支持上传jpg/png格式文件，单个文件不能超过5M</span>
          <UploadImage ref="UploadImage" @clickFu="receive"></UploadImage>
          <el-input v-model="productForm.imageUrl" style="display: none"></el-input>
        </el-form-item>
        <el-form-item label="英文关键词 ：" prop="englishKeyword">
          <el-input
            v-model="productForm.englishKeyword"
            maxlength="500"
            show-word-limit
            placeholder="请输入英文关键词"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="中文关键词 ：" prop="chineseKeyword">
          <el-input
            v-model="productForm.chineseKeyword"
            placeholder="请输入中文关键词"
            clearable
            maxlength="500"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="系统品类 ：" prop="selectedCascader">
          <div style="display: flex">
            <div>
              <el-cascader
                style="width: 100%"
                filterable
                clearable
                :options="cascaderOptions"
                v-model="productForm.selectedCascader"
                :props="cascaderRule"
                @change="changeCascader"
              ></el-cascader>
            </div>
            <el-button type="text" @click="toggleLang" style="margin-left: 4px">{{ langText }}</el-button>
          </div>
        </el-form-item>
        <el-form-item label="SPU描述 ：" prop="spuDescribe">
          <el-input
            v-model="productForm.spuDescribe"
            placeholder="请输入SPU描述"
            clearable
            maxlength="500"
            show-word-limit
            type="textarea"
            :rows="5"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注 ：" prop="remark">
          <el-input
            v-model="productForm.remark"
            placeholder="请输入备注"
            clearable
            maxlength="500"
            show-word-limit
            type="textarea"
            :rows="3"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="mini" @click="closed">取 消</el-button>
          <!-- <el-button size="mini">暂存草稿</el-button> -->
          <el-button size="mini" :loading="submitActive" :disabled="submitActive" type="primary" @click="onSubmit"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onBeforeMount, onMounted, getCurrentInstance, inject, nextTick, computed } from 'vue'
export default {
  name: 'PropertyManageEdit',
  setup(prop, ctx) {
    const data = reactive({
      rules: {
        chineseKeyword: [{ required: true, message: '请输入中文关键词', trigger: 'blur' }],
        englishKeyword: [{ required: true, message: '请输入英文关键词', trigger: 'blur' }],
        selectedCascader: [{ required: true, message: '请选择系统品类', trigger: 'change' }],
      },
      productVisible: false,
      productForm: {
        selectedCascader: [],
      },
      title: '',
      submitActive: false,
      cascaderOptions: [],
      langText: '中',
      // 当前语言
      lang: 'english',
    })
    const { ctx: vueDev, proxy: vue } = getCurrentInstance()
    const api = vue.$http
    onBeforeMount(() => {})
    onMounted(() => {})
    const refData = toRefs(data)
    const productFormRef = ref(null)
    const getTableData = inject('getTableData')
    const UploadImage = ref(null)

    // 切换语言
    const toggleLang = () => {
      data.lang = data.lang === 'chinese' ? 'english' : 'chinese'
      data.langText = data.langText === '英' ? '中' : '英'
    }
    const cascaderRule = computed(() => {
      if (data.lang === 'english') {
        return { checkStrictly: true, label: 'englishName', value: 'id' }
      } else {
        return { checkStrictly: true, label: 'name', value: 'id' }
      }
    })

    // 品类等级改变
    const changeCascader = (res) => {
      if (res) {
        let arr = JSON.stringify(res)
        arr = JSON.parse(arr)
        data.productForm.sysCategoryId = arr.pop()
      } else {
        data.productForm.sysCategoryId = 0
      }
    }

    const getMsg = (info) => {
      data.productForm = {}
      data.productForm.id = info.row.id
      data.productForm.acronym = 'NONE'
      data.productVisible = true
      data.title = info.type == 'add' ? '新增SPU属性' : '编辑SPU属性'
      if (info.type == 'edit') {
        api.product
          .spuPropertyGetDetail({ id: info.row.id })
          .then((res) => {
            if (res.code == 200) {
              data.productForm.id = res.data.id
              data.productForm = res.data
              data.productForm.selectedCascader = res.data.sysCategoryId
              let file = {
                imgLimit: 1,
                isUpdate: !(data.productForm && data.productForm.imageUrl),
                fileList: [],
                pathName: 'warehouse/develop/choose/chooseList/img',
              }
              if (data.productForm && data.productForm.imageUrl) {
                file.fileList = {
                  url: data.productForm.imageUrl,
                }
              }
              nextTick(() => {
                UploadImage.value.getImgMsg(file, file.fileList)
              })
              api.product
                .getCategoryByPersonInCharge()
                .then((res1) => {
                  if (res1.code == 200) {
                    data.cascaderOptions = res1.data
                    console.log('cascaderOptions', data.cascaderOptions)
                  } else {
                    data.tableLoading = false
                    vue.$message({
                      type: 'warning',
                      message: res1.msg,
                    })
                  }
                })
                .catch((err) => {
                  vue.$message({
                    type: 'warning',
                    message: '获取品类级别失败',
                  })
                })
              // api.system
              //   .getAllCategoryList()
              //   .then((res1) => {
              //     if (res1.code == 200) {
              //       data.cascaderOptions = res1.data
              //       console.log('cascaderOptions', data.cascaderOptions)
              //     } else {
              //       data.tableLoading = false
              //       vue.$message({
              //         type: 'warning',
              //         message: res1.msg,
              //       })
              //     }
              //   })
              //   .catch((err) => {
              //     vue.$message({
              //       type: 'warning',
              //       message: '获取品类级别失败',
              //     })
              //   })
            }
          })
          .catch((err) => {
            // vue.$message({
            //   type: "warning",
            //   message: res.msg,
            // });
          })
      } else {
        data.productForm.spuDescribe = '场景:\n用途:\n主参数:\n计量单位:'
        api.product.getCategoryByPersonInCharge().then((res) => {
          if (res.code == 200) {
            data.cascaderOptions = res.data
          } else {
            data.tableLoading = false
            vue.$message({
              type: 'warning',
              message: res.msg,
            })
          }
        })
        // api.system.getAllCategoryList().then((res) => {
        //   if (res.code == 200) {
        //     data.cascaderOptions = res.data
        //   } else {
        //     data.tableLoading = false
        //     vue.$message({
        //       type: 'warning',
        //       message: res.msg,
        //     })
        //   }
        // })
      }
    }

    // 关闭编辑或新增弹框
    const closed = () => {
      data.productForm = {}
      data.productForm.selectedCascader = ''
      data.productVisible = false
      if (productFormRef.value) {
        productFormRef.value.clearValidate()
        productFormRef.value.resetFields()
      }
      if (UploadImage.value) {
        vue.$refs.UploadImage.removeBefore()
      }
    }

    // 获取图片url
    const receive = (e) => {
      console.log('获取图片路径', e)
      data.productForm.imageUrl = e.link ? e.link : ''
    }

    //提交
    const onSubmit = () => {
      data.productForm.englishKeyword = data.productForm.englishKeyword ? data.productForm.englishKeyword.trim() : ''
      data.productForm.chineseKeyword = data.productForm.chineseKeyword ? data.productForm.chineseKeyword.trim() : ''
      data.productForm.spuDescribe = data.productForm.spuDescribe ? data.productForm.spuDescribe.trim() : ''
      data.productForm.remark = data.productForm.remark ? data.productForm.remark.trim() : ''

      productFormRef.value.validate((valid) => {
        if (valid) {
          data.submitActive = true
          if (data.title == '新增SPU属性') {
            api.product
              .spSaveSpuProperty(data.productForm)
              .then((res) => {
                if (res.code == 200) {
                  vue.$message({
                    type: 'success',
                    message: res.msg,
                  })
                  data.submitActive = false
                  getTableData()
                  data.productVisible = false
                } else {
                  vue.$message({
                    type: 'warning',
                    message: res.msg,
                  })
                  data.submitActive = false
                }
              })
              .catch((e) => {
                data.submitActive = false
              })
          } else {
            api.product
              .spEditSpuProperty(data.productForm)
              .then((res) => {
                if (res.code == 200) {
                  vue.$message({
                    type: 'success',
                    message: res.msg,
                  })
                  data.submitActive = false
                  getTableData()
                  data.productVisible = false
                } else {
                  vue.$message({
                    type: 'warning',
                    message: res.msg,
                  })
                  data.submitActive = false
                }
              })
              .catch((e) => {
                data.submitActive = false
              })
            data.isDisabled = false
          }
        }
      })
    }
    return {
      ...refData,
      onSubmit,
      closed,
      getMsg,
      changeCascader,
      productFormRef,
      receive,
      UploadImage,
      toggleLang,
      cascaderRule,
    }
  },
}
</script>
<style scoped lang="scss">
#PropertyManageEdit {
}
</style>
