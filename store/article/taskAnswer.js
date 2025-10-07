import { selectTaskAnswer, addTaskAnswer, 
         trueTaskAnswer,TaskAnswerList,
         deleteTaskAnswer } from '../../API/article/taskAnswer.js';

const state = {
  taskAnswers: []
};

const mutations = {
  SET_TASK_ANSWERS(state, data) {
    console.log('SET_TASK_ANSWERS data:', data);
    console.log('SET_TASK_ANSWERS data type:', typeof data);
    console.log('Array.isArray(data):', Array.isArray(data));
    
    // 处理不同的数据结构
    let answersData = [];
    if (data) {
      // 如果data是一个包含records字段的对象（常见分页结构）
      if (data.records && Array.isArray(data.records)) {
        answersData = data.records;
      }
      // 如果data直接就是数组
      else if (Array.isArray(data)) {
        answersData = data;
      }
      // 其他情况
      else {
        console.warn('SET_TASK_ANSWERS received unexpected data format:', data);
        answersData = [];
      }
    }
    
    state.taskAnswers = answersData;
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
  async addTaskAnswer({ commit }, taskAnswer) {
    try {
      const res = await addTaskAnswer(taskAnswer);
      commit('ADD_TASK_ANSWER', res.data);
      return res;
    } catch (error) {
      console.error('提交任务回答失败:', error);
      throw error;
    }
  },
  async trueTaskAnswer({ commit }, data) {
    try {
      const res = await trueTaskAnswer(data);
      // 修复：检查res.data是否存在以及是否有id属性
      if (res.data && res.data.id) {
        commit('UPDATE_TASK_ANSWER', res.data);
      }
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
      console.log('TaskAnswerList API response:', res);
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