// 值集
export default {
    state: {
        drawerWidth: 1000,
    },
    getters: {
        drawerWidth: (state) => {
            return state.drawerWidth
        },
    },
    mutations: {
        // 设置抽屉宽度
        setDrawerWidth(state, value) {
            state.drawerWidth = value
        },
    },
    actions: {
        setDrawerWidth({ commit }, value) {
            commit("setDrawerWidth", value)
        },
    },
}
