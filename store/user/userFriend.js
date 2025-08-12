import { request,accept,deleteFriend,friendList,friendRequestList } from '@/API/user/userFriend.js';
export default {
  namespaced: true,
  state: () => ({ 
	  friendList:{}
  }),
  mutations: {
    SET_USER_FRIENDS(state, info) {
		console.log(info)
    },
    SET_USER_INFO(state) {
      state.userInfo = null;
      state.isLoggedIn = false;
    }
  },
  actions: {
    request({ commit }, credentials) {
      return request(credentials).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  })
    }
	accept({ commit }, credentials) {
	  return accept(credentials).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  })
	}
	deleteFriend({ commit }, credentials) {
	  return deleteFriend(credentials).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  })
	}
	friendList({ commit }, credentials) {
	  return friendList(credentials).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_FRIENDS', res.data);
		  }
		  return res;
	  })
	}
	friendRequestList({ commit }, credentials) {
	  return friendRequestList(credentials).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  })
	}
  }
};