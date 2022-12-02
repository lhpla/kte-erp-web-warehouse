const purchase = {
    namespaced: true,
    state: {
        priceDetailFlag: true,
        requestFlag: false
    },
    mutations: {
        // 修改采购初录 计价信息的详情状态
        setSpriceDetailFlagetpr: (state, data) => {
            state.priceDetailFlag = data;
        },
        // 是否发送 product模块中 根据运输方式及目的国修改计价信息  接口请求
        setRequestFlag: (state, data) => {
            state.requestFlag = data;
        }
    },
    actions: {},
    getters: {}
};

export default purchase;