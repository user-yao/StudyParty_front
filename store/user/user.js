import { login, register, updatePassword, updateUser, updateHead } from '../../API/user/user.js';
export default {
  namespaced: true,
  state: () => ({ 
    userInfo:{
		id:0,
		name : '',
		password : '',
		head : '',
		sex : '',
		major : '',
		grade : '',
		status : 0,
		starCoin : 0,
		groupCoin : 0,
		starPrestige : 0,
		phone : '',
		school : '',
		clockIn : 0,
		email : '',
		lastLogin : '',
		createDate : '',
		finishTask:0,
		token : ''
	}
  }),
  mutations: {
    SET_USER_INFO(state, info) {
      state.userInfo.id = info.user.id;
      state.userInfo.name = info.user.name;
      state.userInfo.password = info.user.password;
      state.userInfo.head = info.user.head;
      state.userInfo.sex = info.user.sex;
      state.userInfo.major = info.user.major;
      state.userInfo.grade = info.user.grade;
      state.userInfo.status = info.user.status;
      state.userInfo.starCoin = info.user.starCoin;
      state.userInfo.groupCoin = info.user.groupCoin;
      state.userInfo.starPrestige = info.user.starPrestige;
      state.userInfo.phone = info.user.phone;
      state.userInfo.school = info.user.school;
      state.userInfo.clockIn = info.user.clockIn;
      state.userInfo.email = info.user.email;
      state.userInfo.lastLogin = info.user.lastLogin;
      state.userInfo.createDate = info.user.createDate;
	  state.userInfo.finishTask = info.user.finishTask;
      state.userInfo.token = info.token;
	  uni.setStorageSync('id',info.user.id);
      uni.setStorageSync('token', info.token);
    },
    CLEAR_USER_INFO(state) {
      state.userInfo = null;
      state.isLoggedIn = false;
    }
  },
  actions: {
    login({ commit }, credentials) {
      return login(credentials).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  }) // 调用API/user/user.js的login接口
    }
  }
};