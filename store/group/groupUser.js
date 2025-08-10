import { deleteUser, selectGroupUser } from '../../API/group/groupUser.js';

export default {
  state: {
    groupUsers: []
  },
  mutations: {
    SET_GROUP_USERS(state, users) {
      state.groupUsers = users;
    },
    REMOVE_GROUP_USER(state, userId) {
      state.groupUsers = state.groupUsers.filter(user => user.id !== userId);
    }
  },
  actions: {
    async fetchGroupUsers({ commit }, data) {
      const res = await selectGroupUser(data);
      commit('SET_GROUP_USERS', res.data);
      return res;
    },
    async removeGroupUser({ commit }, data) {
      const res = await deleteUser(data);
      commit('REMOVE_GROUP_USER', data.delUserId);
      return res;
    }
  }
}