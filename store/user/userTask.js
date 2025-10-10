import {selectMyUserTasks} from "@/API/user/userTask.js"
export default {
  namespaced: true,
  state: () => ({ 
    userTasks: [], // 个人任务列表
    groupTasks: [] // 小组任务列表
  }),
  mutations: {
    SET_USER_TASKS(state, tasks) {
      // 根据API返回的数据结构，个人任务在数组的第一个元素中
      state.userTasks = tasks[0] || [];
    },
    SET_GROUP_TASKS(state, tasks) {
      // 根据API返回的数据结构，小组任务在数组的第二个元素中
      state.groupTasks = tasks[1] || [];
    },
    SET_USER_INFO(state, info) {
      // 安全地访问info.token，确保info存在
      if (info && info.token) {
        uni.setStorageSync('token', info.token);
      }
    },
    CLEAR_USER_INFO(state) {
      state.userInfo = null;
      state.isLoggedIn = false;
    }
  },
  actions: {
    async selectMyUserTasks({ commit }, payload) {
      try {
        const res = await selectMyUserTasks(payload);
        if (res.code === 200) {
          // 提取任务数据并保存到state中
          commit('SET_USER_TASKS', res.data);
          commit('SET_GROUP_TASKS', res.data);
        }
        return res;
      } catch (error) {
        console.error('获取用户任务失败:', error);
        throw error;
      }
    },
  }
};