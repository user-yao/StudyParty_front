import {selectMyUserTasks} from "@/API/user/userTask.js"
export default {
  namespaced: true,
  state: () => ({ 
    
  }),
  mutations: {
    SET_USER_INFO(state, info) {
      uni.setStorageSync('token', info.token);
    },
    CLEAR_USER_INFO(state) {
      state.userInfo = null;
      state.isLoggedIn = false;
    }
  },
  actions: {
    selectMyUserTasks({ commit }, credentials) {
      return selectMyUserTasks(credentials).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  }) 
    },
  }
};