import { searchTask, addTask, deleteTask } from '../../API/article/task.js';

const state = {
  tasks: []
};

const mutations = {
  SET_TASKS(state, tasks) {
    state.tasks = tasks;
  },
  ADD_TASK(state, task) {
    state.tasks.push(task);
  },
  UPDATE_TASK(state, updatedTask) {
    const index = state.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      state.tasks[index] = updatedTask;
    }
  },
  REMOVE_TASK(state, taskId) {
    state.tasks = state.tasks.filter(t => t.id !== taskId);
  }
};

const actions = {
  async searchTask({ commit }, articleId) {
    try {
      const res = await searchTask(articleId);
      commit('SET_TASKS', res.data);
      return res;
    } catch (error) {
      console.error('获取文章任务失败:', error);
      throw error;
    }
  },
  async addTask({ commit }, { articleId, taskInfo }) {
    try {
      const res = await addTask(articleId, taskInfo);
      commit('ADD_TASK', res.data);
      return res;
    } catch (error) {
      console.error('创建任务失败:', error);
      throw error;
    }
  },
  async deleteTask({ commit }, taskId) {
    try {
      const res = await deleteTask(taskId);
      commit('REMOVE_TASK', taskId);
      return res;
    } catch (error) {
      console.error('删除任务失败:', error);
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