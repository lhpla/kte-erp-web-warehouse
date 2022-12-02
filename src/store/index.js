import {
  createStore
} from 'vuex'
import purchase from "./modules/purchase";

export default createStore({
  state: {
    priceDetailFlag: true,
    requestFlag: false,
    isSave: false,
  },
  mutations: {
    // 修改采购初录 计价信息的详情状态
    setSpriceDetailFlagetpr: (state, data) => {
      state.priceDetailFlag = data
    },
    // 是否发送 product模块中 根据运输方式及目的国修改计价信息  接口请求
    setRequestFlag: (state, data) => {
      state.requestFlag = data
    },
    // 采购详情是否保存
    setIsSave(state, data) {
      state.isSave = data
    },
  },
  actions: {},
  modules: {
    purchase,
  },
})