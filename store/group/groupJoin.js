import { joinGroup, getGroupJoin, agreeJoin } from '../../API/group/groupJoin.js';

export default {
  state: {
    joinRequests: []
  },
  mutations: {
    SET_JOIN_REQUESTS(state, requests) {
      state.joinRequests = requests;
    },
    UPDATE_JOIN_STATUS(state, { groupJoinId, agree }) {
      const index = state.joinRequests.findIndex(req => req.id === groupJoinId);
      if (index !== -1) {
        state.joinRequests[index].status = agree ? '已通过' : '已拒绝';
      }
    }
  },
  actions: {
    async getGroupJoin({ commit }, data) {
      const res = await getGroupJoin(data);
      commit('SET_JOIN_REQUESTS', res.data);
      return res;
    },
    async joinGroup({ commit }, data) {
      const res = await joinGroup(data);
      return res;
    },
    async agreeJoin({ commit }, data) {
      const res = await agreeJoin(data);
      commit('UPDATE_JOIN_STATUS', data);
      return res;
    }
  }
}