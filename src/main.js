import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Pagination from './components/pagination/Pagination'
import AllDownDialog from './components/allDownDialog/AllDownDialog'
import UploadImage from './components/uploadFile/UploadImage.vue'
import UploadFile from './components/uploadFile/UploadFile.vue'
import LogDialog from './components/logDialog/LogDialog.vue'
import PublishLogDialog from './components/logDialog/publishLogDialog.vue'
import PurchaseLogDialog from './components/logDialog/PurchaseLogDialog.vue'
import SupplierPublic from './components/supplier/SupplierPublic.vue'
import DownloadListTable from './components/download/DownloadListTable.vue'
import dialogDrag from '@/utils/drag.js'
console.log('process.env.VUE_APP_MOCK', process.env.VUE_APP_MOCK)
if (process.env.NODE_ENV === 'local' && process.env.VUE_APP_MOCK === 'true') require('./mock')
// import printFn from "./views/printCode/printLableFn.js";
// import VXETable from 'vxe-table'
// import 'vxe-table/lib/style.css'

// 导入重置样式表
import '@/assets/css/reset.css'
// 导入font-awesome图标
import 'font-awesome/css/font-awesome.css'
// 导入 mockjs
// import "@/mock/mock.js";
// 导入请求接口
import api from '@/api/index.js'
// 语言国际化
// import VueI18n from "@/language/index.js";
// 导入element
import ElementPlus from 'element-plus'
// 导入element样式
import 'element-plus/lib/theme-chalk/index.css'
// 导入element自定义样式
import '@/assets/css/element.css'
// 导入公用css样式表
import '@/assets/css/common.css'
// element中文版
import locale from 'element-plus/lib/locale/lang/zh-cn'

const app = createApp(App)

// app.config.globalProperties.$printFn = printFn;
// 分页组件
app.component('Pagination', Pagination)
// 批量添加
app.component('AllDownDialog', AllDownDialog)
// 日志
app.component('LogDialog', LogDialog)
// 刊登日志
app.component('PublishLogDialog', PublishLogDialog)
// 图片上传
app.component('UploadImage', UploadImage)
// 文件上传
app.component('UploadFile', UploadFile)
// 采购日志
app.component('PurchaseLogDialog', PurchaseLogDialog)
// 供应商
app.component('SupplierPublic', SupplierPublic)
//下载队列
app.component('DownloadListTable', DownloadListTable)

app.config.productionTip = false
// 全局请求方式
app.config.globalProperties.$http = api
//解决scroll滑动报错
// import "default-passive-events";
//表格插件
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

function useTable(app) {
  app.use(VXETable)

  // 给 vue 实例挂载内部对象，例如：
  // app.config.globalProperties.$XModal = VXETable.modal
  // app.config.globalProperties.$XPrint = VXETable.print
  // app.config.globalProperties.$XSaveFile = VXETable.saveFile
  // app.config.globalProperties.$XReadFile = VXETable.readFile
}

app
  .use(store)
  .use(router)
  .use(dialogDrag)
  .use(VXETable)
  .use(ElementPlus, {
    locale,
  })
  .mount('#app')
