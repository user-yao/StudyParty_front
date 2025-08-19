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
    requestFriend({ commit }, payload) {
      return requestFriend(payload).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  })
    },
	accept({ commit }, payload) {
	  return accept(payload).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  })
	},
	deleteFriend({ commit }, payload) {
	  return deleteFriend(payload).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  })
	},
	friendList({ commit }, payload) {
	  return friendList(payload).then(res =>{
		  console.log(res)
		  if (res.code === 200) {
		    commit('SET_FRIEND_LIST', res.data);
			return res.data;
		  }
		  return res;
	  })
	},
	friendRequestList({ commit }, payload) {
	  return friendRequestList(payload).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  })
	}
  }
};