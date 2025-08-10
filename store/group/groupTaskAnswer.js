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
  }
};

const actions = {
  async getGroupTaskAnswers({ commit }, taskId) {
    try {
      const res = await getGroupTaskAnswers(taskId);
      commit('SET_TASK_ANSWERS', res.data);
      return res;
    } catch (error) {
      console.error('获取任务回答失败:', error);
      throw error;
    }
  },
  async submit({ commit }, { taskId, content }) {
    try {
      const res = await submit(taskId, content);
      return res;
    } catch (error) {
      console.error('提交任务回答失败:', error);
      throw error;
    }
  },
  async score({ commit }, { answerId, status }) {
    try {
      const res = await score(answerId, status);
      commit('UPDATE_ANSWER_STATUS', { answerId, status });
      return res;
    } catch (error) {
      console.error('更新任务回答状态失败:', error);
      throw error;
    }
  },
  async getMyGroupTaskAnswers({ commit }, { groupId, currentPage }) {
    try {
      const res = await getMyGroupTaskAnswers(groupId, currentPage);
      commit('SET_TASK_ANSWERS', res.data);
      return res;
    } catch (error) {
      console.error('获取任务回答失败:', error);
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