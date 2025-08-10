import { selectTaskAnswer, addTaskAnswer, 
         trueTaskAnswer,TaskAnswerList,
         deleteTaskAnswer } from '../../API/article/taskAnswer.js';

const state = {
  taskAnswers: []
};

const mutations = {
  SET_TASK_ANSWERS(state, answers) {
    state.taskAnswers = answers;
  },
  ADD_TASK_ANSWER(state, answer) {
    state.taskAnswers.push(answer);
  },
  UPDATE_TASK_ANSWER(state, updatedAnswer) {
    const index = state.taskAnswers.findIndex(ans => ans.id === updatedAnswer.id);
    if (index !== -1) {
      state.taskAnswers[index] = updatedAnswer;
    }
  },
  REMOVE_TASK_ANSWER(state, answerId) {
    state.taskAnswers = state.taskAnswers.filter(ans => ans.id !== answerId);
  }
};

const actions = {
  async selectTaskAnswer({ commit }, taskId) {
    try {
      const res = await selectTaskAnswer(taskId);
      commit('SET_TASK_ANSWERS', res.data);
      return res;
    } catch (error) {
      console.error('获取任务回答失败:', error);
      throw error;
    }
  },
  async addTaskAnswer({ commit }, { taskId, content }) {
    try {
      const res = await addTaskAnswer(taskId, content);
      commit('ADD_TASK_ANSWER', res.data);
      return res;
    } catch (error) {
      console.error('提交任务回答失败:', error);
      throw error;
    }
  },
  async trueTaskAnswer({ commit }, { answerId, status }) {
    try {
      const res = await trueTaskAnswer(answerId, status);
      commit('UPDATE_TASK_ANSWER', res.data);
      return res;
    } catch (error) {
      console.error('更新任务回答状态失败:', error);
      throw error;
    }
  },
  async deleteTaskAnswer({ commit }, answerId) {
    try {
      const res = await deleteTaskAnswer(answerId);
      commit('REMOVE_TASK_ANSWER', answerId);
      return res;
    } catch (error) {
      console.error('删除任务回答失败:', error);
      throw error;
    }
  },
  async TaskAnswerList({ commit }, data) {
    try {
      const res = await TaskAnswerList(data);
      commit('SET_TASK_ANSWERS', res.data);
      return res;
    } catch (error) {
      console.error('获取任务回答列表失败:', error);
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