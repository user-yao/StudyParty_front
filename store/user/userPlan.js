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
    addUserPlan({ commit }, credentials) {
      return addUserPlan(credentials).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  }) 
    },
	deleteUserPlan({ commit }, credentials) {
	  return deleteUserPlan(credentials).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  }) 
	},
	startUserPlan({ commit }, credentials) {
	  return startUserPlan(credentials).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  }) 
	},
	endUserPlan({ commit }, credentials) {
	  return endUserPlan(credentials).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  }) 
	},
	getUserPlans({ commit }, credentials) {
	  return getUserPlans(credentials).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res.data;
	  }) 
	}
  }
};