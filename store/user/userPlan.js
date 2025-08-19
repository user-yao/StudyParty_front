import {addUserPlan,deleteUserPlan,startUserPlan,endUserPlan,getUserPlans} from "@/API/user/userPlan.js"
export default {
  namespaced: true,
  state: () => ({ 
    
  }),
  mutations: {
    SET_USER_INFO(state, info) {
    },
    CLEAR_USER_INFO(state) {
      state.userInfo = null;
      state.isLoggedIn = false;
    }
  },
  actions: {
    addUserPlan({ commit }, payload) {
      return addUserPlan(payload).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  }) 
    },
	deleteUserPlan({ commit }, payload) {
	  return deleteUserPlan(payload).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  }) 
	},
	startUserPlan({ commit }, payload) {
	  return startUserPlan(payload).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  }) 
	},
	endUserPlan({ commit }, payload) {
	  return endUserPlan(payload).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  }) 
	},
	getUserPlans({ commit }, payload) {
	  return getUserPlans(payload).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res.data;
	  }) 
	}
  }
};