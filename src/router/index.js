import { createRouter, createWebHistory } from 'vue-router'
import ChooseAudit from '../views/chooseAudit/ChooseAudit.vue'
import ChooseProducts from '../views/chooseProducts/ChooseProducts.vue'
import FirstEntry from '../views/firstEntry/FirstEntry.vue'
import AssistantAudit from '../views/assistantAudit/AssistantAudit.vue'
import SecondEntry from '../views/secondEntry/SecondEntry.vue'
import ProductAudit from '../views/productAudit/ProductAudit.vue'
import ProductEntry from '../views/productEntry/ProductEntry.vue'
import SecondaryDistribution from '../views/secondaryDistribution/SecondaryDistribution.vue'
import ProductLibrary from '../views/productLibrary/ProductLibrary.vue'
import CombinationProduct from '../views/combinationProduct/CombinationProduct.vue'
import Consolidation from '../views/consolidation/Consolidation.vue'
import ProductPrice from '../views/productPrice/ProductPrice.vue'
import SensitiveWordLibrary from '../views/sensitiveWordLibrary/SensitiveWordLibrary.vue'
import StateManagement from '../views/stateManagement/StateManagement.vue'
import PackingSpecification from '../views/packingSpecification/PackingSpecification.vue'
import ProductCategoryManage from '../views/productCategoryManage/ProductCategoryManage.vue'
import PlatformCategory from '../views/platformCategory/PlatformCategory.vue'
import CategoryComparison from '../views/categoryComparison/CategoryComparison.vue'
import PropertyManage from '../views/propertyManage/PropertyManage.vue'
import ProductException from '../views/productException/ProductException.vue'
const routes = [
  {
    path: '/',
    redirect: '/warehouse/develop/chooseProducts/list',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/Login.vue'),
  },
  {
    path: '/warehouse/develop/chooseAudit/list',
    name: 'chooseAudit',
    component: ChooseAudit,
    meta: {
      requiresAuth: true,
      parentTit: '审核管理',
      title: '选品审核',
      key: 'chooseAudit',
    },
  },
  {
    path: '/warehouse/develop/chooseProducts/list',
    name: 'chooseProducts',
    component: ChooseProducts,
    meta: {
      requiresAuth: true,
      parentTit: '开发管理',
      title: '选品列表',
      key: 'chooseProducts',
    },
  },
  {
    path: '/warehouse/develop/firstEntry/list',
    name: 'firstEntry',
    component: FirstEntry,
    meta: {
      requiresAuth: true,
      parentTit: '开发管理',
      title: '产品初录列表',
      key: 'firstEntry',
    },
  },
  {
    path: '/warehouse/develop/assistantAudit/list',
    name: 'assistantAudit',
    component: AssistantAudit,
    meta: {
      requiresAuth: true,
      parentTit: '审核管理',
      title: '助理审核',
      key: 'assistantAudit',
    },
  },
  {
    path: '/warehouse/develop/secondEntry/list',
    name: 'secondEntry',
    component: SecondEntry,
    meta: {
      requiresAuth: true,
      parentTit: '开发管理',
      title: '产品二录列表',
      key: 'secondEntry',
    },
  },
  {
    path: '/warehouse/develop/productAudit/list',
    name: 'productAudit',
    component: ProductAudit,
    meta: {
      requiresAuth: true,
      parentTit: '审核管理',
      title: '产品终审',
      key: 'productAudit',
    },
  },
  {
    path: '/warehouse/purchase/productEntry/list',
    name: 'productEntry',
    component: ProductEntry,
    meta: {
      requiresAuth: true,
      parentTit: '采购管理', // 采购录入
      title: '产品信息初录',
      key: 'productEntry',
    },
  },
  {
    path: '/warehouse/purchase/secondaryDistribution/list',
    name: 'secondaryDistribution',
    component: SecondaryDistribution,
    meta: {
      requiresAuth: true,
      parentTit: '采购管理',
      title: '产品二次分配',
      key: 'secondaryDistribution',
    },
  },
  {
    path: '/warehouse/product/productLibrary/list',
    name: 'productLibrary',
    component: ProductLibrary,
    meta: {
      requiresAuth: true,
      parentTit: '产品管理',
      title: '产品列表',
      key: 'productLibrary',
    },
  },
  {
    path: '/warehouse/product/combinationProduct/list',
    name: 'combinationProduct',
    component: CombinationProduct,
    meta: {
      requiresAuth: true,
      parentTit: '产品管理',
      title: '组合产品列表',
      key: 'combinationProduct',
    },
  },
  {
    path: '/warehouse/product/consolidation/list',
    name: 'consolidation',
    component: Consolidation,
    meta: {
      requiresAuth: true,
      parentTit: '产品管理',
      title: '产品合并列表',
      key: 'consolidation',
    },
  },
  {
    path: '/warehouse/product/productPrice/list',
    name: 'productPrice',
    component: ProductPrice,
    meta: {
      requiresAuth: true,
      parentTit: '产品管理',
      title: '产品限价管理',
      key: 'productPrice',
    },
  },
  {
    path: '/warehouse/product/sensitiveWordLibrary/list',
    name: 'sensitiveWordLibrary',
    component: SensitiveWordLibrary,
    meta: {
      requiresAuth: true,
      parentTit: '产品管理',
      title: '敏感词库管理',
      key: 'sensitiveWordLibrary',
    },
  },
  {
    path: '/warehouse/product/stateManagement/list',
    name: 'stateManagement',
    component: StateManagement,
    meta: {
      requiresAuth: true,
      parentTit: '产品管理',
      title: '开发状态管理',
      key: 'stateManagement',
    },
  },
  {
    path: '/warehouse/purchase/packingSpecification/list',
    name: 'packingSpecification',
    component: PackingSpecification,
    meta: {
      requiresAuth: true,
      parentTit: '采购管理', // 采购录入
      title: '包装说明',
      key: 'packingSpecification',
    },
  },
  {
    path: '/warehouse/system/productCategoryManage/list',
    name: 'productCategoryManage',
    component: ProductCategoryManage,
    meta: {
      requiresAuth: true,
      parentTit: '系统设置',
      title: '产品品类管理',
      key: 'productCategoryManage',
    },
  },
  {
    path: '/warehouse/productParameters/PlatformCategory/list',
    name: 'PlatformCategory',
    component: PlatformCategory,
    meta: {
      requiresAuth: true,
      parentTit: '商品参数管理',
      title: '平台类目管理',
      key: 'platformCategory',
    },
  },
  {
    path: '/warehouse/productParameters/categoryComparison/list',
    name: 'categoryComparison',
    component: CategoryComparison,
    meta: {
      requiresAuth: true,
      parentTit: '商品参数管理',
      title: '品类对照表',
      key: 'categoryComparison',
    },
  },
  {
    path: '/warehouse/productParameters/PropertyManage/list',
    name: 'PropertyManage',
    component: PropertyManage,
    meta: {
      requiresAuth: true,
      parentTit: '商品参数管理',
      title: 'SPU属性管理',
      key: 'propertyManage',
    },
  },
  {
    path: '/warehouse/product/productException/list',
    name: 'productException',
    component: ProductException,
    meta: {
      requiresAuth: true,
      parentTit: '产品管理',
      title: '产品异常列表',
      key: 'productException',
    },
  },
]

const router = createRouter({
  history: createWebHistory(window.__MICRO_APP_BASE_ROUTE__ || process.env.BASE_URL),
  routes,
})

export default router
