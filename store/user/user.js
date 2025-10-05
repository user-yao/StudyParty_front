import { login, register, updatePassword, updateUser, updateHead, selectUser} from '../../API/user/user.js';
import store from '../index.js'; // 引入store实例

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
	  uni.setStorageSync('user',info.user);
	  console.log(uni.getStorageSync('user'));
      uni.setStorageSync('token', info.token);
    },
    CLEAR_USER_INFO(state) {
      state.userInfo = {
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
      };
      // 清除本地存储
      uni.removeStorageSync('id');
      uni.removeStorageSync('user');
      uni.removeStorageSync('token');
    },
    // 更新用户信息
    UPDATE_USER_INFO(state, userInfo) {
      // 更新state中的用户信息
      Object.assign(state.userInfo, userInfo);
      // 同步更新本地存储
      uni.setStorageSync('user', state.userInfo);
    }
  },
  actions: {
    login({ commit }, credentials) {
      return login(credentials).then(res =>{
		  if (res.code === 200) {
		    commit('SET_USER_INFO', res.data);
		  }
		  return res;
	  }) 
    },
    register({ commit }, userData) {
      return register(userData).then(res => {
        return res;
      });
    },
    selectUser({ commit }, payload) {
      console.log(payload)
	  return selectUser(payload).then(res =>{
		  console.log(res)
		  if (res.code === 200) {
		    return res.data;
		  }
		  return res;
	  }) 
	},
    // 退出登录
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('CLEAR_USER_INFO');
        // 清除其他模块的数据
        store.commit('article/CLEAR_RECOMMEND_ARTICLES');
        store.commit('task/CLEAR_RECOMMEND_TASKS');
        // 可以继续添加其他需要清除的模块数据
        resolve();
      });
    },
    // 更新用户信息
    async updateUser({ commit }, userInfo) {
      try {
        const res = await updateUser(userInfo);
        if (res.code === 200) {
          // 更新store中的用户信息
          commit('UPDATE_USER_INFO', userInfo);
          // 如果头像有更新，也更新userInfo中的head字段
          if (userInfo.head) {
            commit('SET_USER_INFO', {
              user: { ...this.state.userInfo, head: userInfo.head },
              token: this.state.userInfo.token
            });
          }
        }
        return res;
      } catch (error) {
        console.error('更新用户信息失败:', error);
        throw error;
      }
    },
    // 更新用户头像
    async updateHead({ commit }, headData) {
      try {
        const res = await updateHead(headData);
        if (res.code === 200) {
          // 更新store中的用户头像信息
          commit('UPDATE_USER_INFO', { head: headData.head });
          // 同时更新userInfo中的head字段
          commit('SET_USER_INFO', {
            user: { ...this.state.userInfo, head: headData.head },
            token: this.state.userInfo.token
          });
        }
        return res;
      } catch (error) {
        console.error('更新用户头像失败:', error);
        throw error;
      }
    },
    // 修改密码
    async changePassword({ commit, state }, passwordData) {
      try {
        // 准备密码更新数据，包含用户ID和新密码
        const data = {
          id: state.userInfo.id,
          password: passwordData.newPassword
        };
        
        const res = await updatePassword(data);
        if (res.code === 200) {
          // 更新store中的用户密码
          commit('UPDATE_USER_INFO', { password: passwordData.newPassword });
          // 同时更新userInfo中的密码字段
          commit('SET_USER_INFO', {
            user: { ...this.state.userInfo, password: passwordData.newPassword },
            token: this.state.userInfo.token
          });
        }
        return res;
      } catch (error) {
        console.error('修改密码失败:', error);
        throw error;
      }
    },
    // 获取并更新用户信息
    async fetchUserInfo({ commit, state }) {
      try {
        // 调用selectUser API获取用户信息
        const res = await selectUser({ id: state.userInfo.id });
        if (res.code === 200) {
          // 更新store中的用户信息，不包含token
          const userInfo = res.data;
          commit('UPDATE_USER_INFO', userInfo);
          // 同时更新userInfo中的用户信息（不包含token）
          commit('SET_USER_INFO', {
            user: userInfo,
            token: state.userInfo.token // 保持原有的token
          });
        }
        return res;
      } catch (error) {
        console.error('获取用户信息失败:', error);
        throw error;
      }
    },
    // 获取用户文章
    async selectMyUserArticle({ commit, state }) {
      try {
        // 导入API方法
        const { selectMyUserArticle } = await import('../../API/user/userArticle.js');
        // 调用API获取用户文章
        const res = await selectMyUserArticle({ userId: state.userInfo.id });
        return res;
      } catch (error) {
        console.error('获取用户文章失败:', error);
        throw error;
      }
    }
  }
};