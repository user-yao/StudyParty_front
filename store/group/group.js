import { searchGroup, 
          getMyGroup, 
          createGroup, 
          updateHead, 
          updateGroup, 
          deleteGroup, 
          transferGroup, 
          changeDeputy, 
          changeCanJoin, 
          contributionGroup, 
          invitePredecessor, 
          clearPredecessor } from '../../API/group/group.js';
export default {
  namespaced: true,
  state: () => ({
    groupList: [], 
    currentGroup: null 
  }),
  mutations: {
    SET_GROUP_LIST(state, list) {
      state.groupList = list;
    },
    SET_CURRENT_GROUP(state, group) {
      state.currentGroup = group;
    }
  },
  actions: {
    async getMyGroup({ commit }, params) {
      const res = await getMyGroup(params); // 调用API/group/group.js的getMyGroup接口
      if (res.code === 200) {
        commit('SET_GROUP_LIST', res.data);
      }
      return res;
    },
    async createGroup({ commit }, data) {
      const res = await createGroup(data); // 调用创建群组接口
      return res;
    },
    async updateGroup({ commit }, data) {
      const res = await updateGroup(data); // 调用更新群组接口
      return res;
    },
    async deleteGroup({ commit }, data) {
      const res = await deleteGroup(data); // 调用删除群组接口
      return res;
    },
    async transferGroup({ commit }, data) {
      const res = await transferGroup(data); // 调用转让群组接口
      return res;
    },
    async changeDeputy({ commit }, data) {
      const res = await changeDeputy(data); // 调用变更副主接口
      return res;
    },
    async changeCanJoin({ commit }, data) {
      const res = await changeCanJoin(data); // 调用变更加入权限接口
      return res;
    },
    async contributionGroup({ commit }, data) {
      const res = await contributionGroup(data); // 调用贡献值接口
      return res;
    },
    async invitePredecessor({ commit }, data) {
      const res = await invitePredecessor(data); // 调用邀请前驱接口
      return res;
    },
    async clearPredecessor({ commit }, data) {
      const res = await clearPredecessor(data); // 调用清除前驱接口
      return res;
    },
    async searchGroup({ commit }, data) {
      const res = await searchGroup(data); // 调用搜索群组接口
      return res;
    },
    async updateHead({ commit }, data) {
      const res = await updateHead(data); // 调用更新群组头像接口
      return res;
    }
  }
};