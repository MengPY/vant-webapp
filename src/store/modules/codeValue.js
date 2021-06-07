// 值集
export default {
  state: {
    currentValueSetCode: [],
    valueSet: {},
  },
  getters: {
    currentValueSetCode (state) {
      return state.valueSet;
    }
  },
  mutations: {
    //当前页面值集
    setValueSetCode (state, data) {
      state.valueSet = data||{};
    },
  },
  actions: {
    setValueSetCode ({ commit }, payload) {
      commit("setValueSetCode", payload)
    }
  },
};
