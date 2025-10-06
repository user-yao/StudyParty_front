import { searchTask, addTask, deleteTask, recommend, getTaskById } from '../../API/article/task.js';

const state = {
  tasks: [],
  currentTask: null,
  recommendTasks: [] // 添加推荐任务状态
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
  },
  SET_CURRENT_TASK(state, task) {
    state.currentTask = task;
  },
  SET_RECOMMEND_TASKS(state, data) {
    // 根据API返回格式处理数据
    if (data && data.records) {
      // 如果是第一页，替换数据；否则追加数据
      if (data.current === 1) {
        state.recommendTasks = data.records;
      } else {
        state.recommendTasks.push(...data.records);
      }
    } else if (Array.isArray(data)) {
      state.recommendTasks = data;
    }
  },
  CLEAR_RECOMMEND_TASKS(state) {
    state.recommendTasks = [];
  }
};

const actions = {
  async searchTask({ commit }, content) {
    try {
      const res = await searchTask(content);
      commit('SET_TASKS', res.data);
      return res;
    } catch (error) {
      console.error('获取文章任务失败:', error);
      throw error;
    }
  },
  async addTask({ commit }, taskInfo) {
    try {
      const res = await addTask(taskInfo);
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
  },
  async recommend({ commit }, params) {
    try {
      const res = await recommend(params);
      if (res && res.code === 200) {
        commit('SET_RECOMMEND_TASKS', res.data);
      }
      return res;
    } catch (error) {
      throw error;
    }
  },
  // 根据任务ID获取任务详情
  async getTaskById({ commit }, taskId) {
    try {
      const res = await getTaskById(taskId);
      if (res && res.code === 200) {
        commit('SET_CURRENT_TASK', res.data);
        return res;
      } else {
        throw new Error(res.msg || '获取任务详情失败');
      }
    } catch (error) {
      console.error('获取任务详情失败:', error);
      throw error;
    }
  },
  // 清除推荐任务
  clearRecommendTasks({ commit }) {
    commit('CLEAR_RECOMMEND_TASKS');
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};