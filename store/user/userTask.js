import {selectMyUserTasks} from "@/API/user/userTask.js"
export default {
  namespaced: true,
  state: () => ({ 
    userTasks: [], // 个人任务列表
    groupTasks: [] // 小组任务列表
  }),
  mutations: {
    SET_USER_TASKS(state, tasks) {
      state.userTasks = tasks[0] || [];
    },
    SET_GROUP_TASKS(state, tasks) {
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
    selectMyUserTasks({ commit }, payload) {
      return selectMyUserTasks(payload).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_TASKS', res.data);
		    commit('SET_GROUP_TASKS', res.data);
		  }
		  return res;
	  }) 
    },
  }
};