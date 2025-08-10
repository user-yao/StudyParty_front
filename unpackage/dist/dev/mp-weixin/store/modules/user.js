"use strict";
const common_vendor = require("../../common/vendor.js");
const user = {
  namespaced: true,
  state: () => ({
    userInfo: null,
    isLoggedIn: false
  }),
  mutations: {
    SET_USER_INFO(state, info) {
      state.userInfo = info;
      state.isLoggedIn = true;
    },
    CLEAR_USER_INFO(state) {
      state.userInfo = null;
      state.isLoggedIn = false;
    }
  },
  actions: {
    async login({ commit }, credentials) {
      common_vendor.index.__f__("log", "at store/modules/user.js:22", "模拟登录操作：", credentials);
    }
  }
};
exports.user = user;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/modules/user.js.map
