import { requestFriend, accept, deleteFriend, friendList, friendRequestList } from '@/API/user/userFriend.js';
export default {
  namespaced: true,
  state: () => ({ 
	  friendList: new Map()
  }),
  mutations: {
    SET_FRIEND_LIST(state, info) {
		info.filter(res =>{
			state.friendList.set(res.friendId,res);
			console.log(res);
		})
    },
    SET_USER_INFO(state) {
      state.userInfo = null;
      state.isLoggedIn = false;
    }
  },
  actions: {
    requestFriend({ commit }, credentials) {
      return requestFriend(credentials).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  })
    },
	accept({ commit }, credentials) {
	  return accept(credentials).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  })
	},
	deleteFriend({ commit }, credentials) {
	  return deleteFriend(credentials).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  })
	},
	friendList({ commit }, credentials) {
	  return friendList(credentials).then(res =>{
		  console.log(res)
		  if (res.code === 200) {
		    commit('SET_FRIEND_LIST', res.data);
		  }
		  return res;
	  })
	},
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