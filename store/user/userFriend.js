import { requestFriend, accept, deleteFriend, friendList, friendRequestList, remark, myFriendRequestList } from '@/API/user/userFriend.js';
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

    }
  },
  actions: {
    requestFriend({ commit }, payload) {
      return requestFriend(payload).then(res =>{
		  if (res.code === 200) {
				return res;
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
		console.log("friendRequestList")
	  return friendRequestList(payload).then(res =>{
		  console.log(res)
		  if (res.code === 200) {
		    return res.data;
		  }
		  return res;
	  })
	},
	myFriendRequestList({ commit }, payload) {
	  return myFriendRequestList(payload).then(res =>{
		  if (res.code === 200) {
			  return res.data;
		  }
		  return res;
	  })
	},
	saveRemark({ commit }, payload) {
	  return remark(payload).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  })
	}
  }
};