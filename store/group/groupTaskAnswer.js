import { score, submit, getMyGroupTaskAnswers,
  getGroupTaskAnswers } from '../../API/group/groupTaskAnswer.js';

const state = {
  taskAnswers: []
};

const mutations = {
  SET_TASK_ANSWERS(state, answers) {
    state.taskAnswers = answers;
  },
  UPDATE_ANSWER_STATUS(state, { answerId, status }) {
    const index = state.taskAnswers.findIndex(ans => ans.id === answerId);
    if (index !== -1) {
      state.taskAnswers[index].status = status;
    }
  },
  ADD_TASK_ANSWER(state, answer) {
    state.taskAnswers.push(answer);
  }
};

const actions = {
  async getTaskAnswers({ commit }, data) {
    try {
      const res = await getGroupTaskAnswers(data);
      if (res.code === 200) {
        commit('SET_TASK_ANSWERS', res.data);
      }
      return res;
    } catch (error) {
      console.error('获取任务回答失败:', error);
      throw error;
    }
  },
  async submitTaskAnswer({ commit }, data) {
    try {
      const res = await submit(data);
      if (res.code === 200) {
        // 如果需要，可以将新提交的答案添加到列表中
        // commit('ADD_TASK_ANSWER', res.data);
      }
      return res;
    } catch (error) {
      console.error('提交任务回答失败:', error);
      throw error;
    }
  },
  async scoreTaskAnswer({ commit }, data) {
    try {
      const res = await score(data);
      if (res.code === 200) {
        commit('UPDATE_ANSWER_STATUS', { answerId: data.groupTaskAnswerId, status: data.score });
      }
      return res;
    } catch (error) {
      console.error('评分任务回答失败:', error);
      throw error;
    }
  },
  async getMyTaskAnswers({ commit }, data) {
    try {
      const res = await getMyGroupTaskAnswers(data);
      if (res.code === 200) {
        commit('SET_TASK_ANSWERS', res.data);
      }
      return res;
    } catch (error) {
      console.error('获取我的任务回答失败:', error);
      throw error;
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};