"use strict";
const common_vendor = require("../../common/vendor.js");
const group = {
  namespaced: true,
  state: () => ({
    groupList: [],
    currentGroup: null
  }),
  mutations: {
    SET_GROUP_LIST(state, list) {
      state.groupList = list;
    },
    SET_CURRENT_GROUP(state, group2) {
      state.currentGroup = group2;
    }
  },
  actions: {
    async fetchGroups({ commit }) {
      common_vendor.index.__f__("log", "at store/modules/group.js:20", "模拟获取群组列表");
    }
  }
};
exports.group = group;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/modules/group.js.map
