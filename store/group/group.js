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
          clearPredecessor, 
          selectGroupById } from '../../API/group/group.js';
export default {
  namespaced: true,
  state: () => ({
    groupMap: new Map(), // 使用Map存储群组，key为group.id，value为group对象
    currentGroup: null,
    myGroupIds: [], // 我管理的群组ID列表
    joinedGroupIds: [] // 我加入的群组ID列表
  }),
  getters: {
    // 获取所有群组列表
    groupList: (state) => {
      return Array.from(state.groupMap.values());
    },
    // 根据ID获取群组信息
    getGroupById: (state) => (id) => {
      return state.groupMap.get(id);
    },
    // 获取我管理的群组列表
    myGroups: (state) => {
      return state.myGroupIds.map(id => state.groupMap.get(id)).filter(Boolean);
    },
    // 获取我加入的群组列表
    joinedGroups: (state) => {
      return state.joinedGroupIds.map(id => state.groupMap.get(id)).filter(Boolean);
    }
  },
  mutations: {
    // 设置群组列表（兼容原有接口）
    SET_GROUP_LIST(state, list) {
      if (Array.isArray(list)) {
        // 清空现有数据
        state.groupMap.clear();
        state.myGroupIds = [];
        state.joinedGroupIds = [];
        
        // 添加新数据到Map中
        list.forEach(group => {
          if (group && group.id) {
            state.groupMap.set(group.id, group);
          }
        });
      }
    },
    // 设置我管理的和加入的群组（用于getMyGroup接口返回的二维数组）
    SET_MY_AND_JOINED_GROUPS(state, { myGroups = [], joinedGroups = [] }) {
      // 清空现有数据
      state.groupMap.clear();
      state.myGroupIds = [];
      state.joinedGroupIds = [];
      
      // 添加我管理的群组
      myGroups.forEach(group => {
        if (group && group.id) {
          state.groupMap.set(group.id, group);
          state.myGroupIds.push(group.id);
        }
      });
      
      // 添加我加入的群组
      joinedGroups.forEach(group => {
        if (group && group.id) {
          state.groupMap.set(group.id, group);
          state.joinedGroupIds.push(group.id);
        }
      });
    },
    // 添加单个群组
    ADD_GROUP(state, group) {
      if (group && group.id) {
        state.groupMap.set(group.id, group);
      }
    },
    // 更新单个群组
    UPDATE_GROUP(state, group) {
      if (group && group.id && state.groupMap.has(group.id)) {
        // 合并更新群组信息
        const existingGroup = state.groupMap.get(group.id);
        const updatedGroup = { ...existingGroup, ...group };
        state.groupMap.set(group.id, updatedGroup);
        
        // 如果是当前群组，也要更新
        if (state.currentGroup && state.currentGroup.id === group.id) {
          state.currentGroup = updatedGroup;
        }
      }
    },
    // 删除群组
    REMOVE_GROUP(state, groupId) {
      if (state.groupMap.has(groupId)) {
        state.groupMap.delete(groupId);
        
        // 从ID列表中移除
        state.myGroupIds = state.myGroupIds.filter(id => id !== groupId);
        state.joinedGroupIds = state.joinedGroupIds.filter(id => id !== groupId);
        
        // 如果是当前群组，清空当前群组
        if (state.currentGroup && state.currentGroup.id === groupId) {
          state.currentGroup = null;
        }
      }
    },
    // 设置当前群组
    SET_CURRENT_GROUP(state, group) {
      state.currentGroup = group;
      // 如果群组不在Map中，添加到Map
      if (group && group.id && !state.groupMap.has(group.id)) {
        state.groupMap.set(group.id, group);
      }
    },
    // 清空所有群组数据
    CLEAR_GROUPS(state) {
      state.groupMap.clear();
      state.myGroupIds = [];
      state.joinedGroupIds = [];
      state.currentGroup = null;
    }
  },
  actions: {
    async getMyGroup({ commit }, params) {
      const res = await getMyGroup(params); // 调用API/group/group.js的getMyGroup接口
      if (res.code === 200 && res.data) {
        // API返回的是二维数组：[[我管理的群组], [我加入的群组]]
        const myGroups = res.data[0] || [];
        const joinedGroups = res.data[1] || [];
        
        // 使用新的mutation存储数据
        commit('SET_MY_AND_JOINED_GROUPS', { myGroups, joinedGroups });
      }
      return res;
    },
    async createGroup({ commit }, data) {
      const res = await createGroup(data); // 调用创建群组接口
      if (res.code === 200 && res.data) {
        // 创建成功后，添加到Map中
        commit('ADD_GROUP', res.data);
      }
      return res;
    },
    async updateGroup({ commit }, data) {
      const res = await updateGroup(data); // 调用更新群组接口
      if (res.code === 200 && data.groupId) {
        // 更新成功后，更新Map中的数据
        commit('UPDATE_GROUP', { id: data.groupId, ...data });
      }
      return res;
    },
    async deleteGroup({ commit }, data) {
      const res = await deleteGroup(data); // 调用删除群组接口
      if (res.code === 200 && data.groupId) {
        // 删除成功后，从Map中移除
        commit('REMOVE_GROUP', data.groupId);
      }
      return res;
    },
    async transferGroup({ commit }, data) {
      const res = await transferGroup(data); // 调用转让群组接口
      if (res.code === 200 && data.groupId) {
        // 转让成功后，更新群组信息
        commit('UPDATE_GROUP', { id: data.groupId, leader: data.newLeader });
      }
      return res;
    },
    async changeDeputy({ commit }, data) {
      const res = await changeDeputy(data); // 调用变更副主接口
      if (res.code === 200 && data.groupId) {
        // 更新副主信息
        commit('UPDATE_GROUP', { id: data.groupId, deputy: data.deputy });
      }
      return res;
    },
    async changeCanJoin({ commit }, data) {
      const res = await changeCanJoin(data); // 调用变更加入权限接口
      if (res.code === 200 && data.groupId) {
        // 更新加入权限
        commit('UPDATE_GROUP', { id: data.groupId, canJoin: data.canJoin });
      }
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
      if (res.code === 200 && data.groupId) {
        // 更新头像成功后，更新Map中的数据
        commit('UPDATE_GROUP', { id: data.groupId, head: data.head });
      }
      return res;
    },
    // 根据ID获取群组详细信息
    async selectGroupById({ commit }, data) {
      const res = await selectGroupById(data); // 调用根据ID获取群组接口
      if (res.code === 200 && res.data) {
        // 获取成功后，添加或更新到Map中
        commit('ADD_GROUP', res.data);
        // 设置为当前群组
        commit('SET_CURRENT_GROUP', res.data);
      }
      return res;
    },
    // 新增的辅助方法
    // 根据ID获取群组信息
    getGroupById({ getters }, groupId) {
      return getters.getGroupById(groupId);
    },
    // 清空所有群组数据
    clearAllGroups({ commit }) {
      commit('CLEAR_GROUPS');
    }
  }
};