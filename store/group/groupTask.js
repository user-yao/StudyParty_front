import { selectMyGroupTask, uploadMarkdown, deleteGroupTask } from '../../API/group/groupTask.js';

export default {
  state: {
    groupTasks: []
  },
  mutations: {
    SET_GROUP_TASKS(state, tasks) {
      state.groupTasks = tasks;
    },
    UPDATE_TASK_STATUS(state, { taskId, status }) {
      const index = state.groupTasks.findIndex(task => task.id === taskId);
      if (index !== -1) {
        state.groupTasks[index].status = status;
      }
    }
  },
  actions: {
    async selectMyGroupTask({ commit }, data) {
      const res = await selectMyGroupTask(data);
      commit('SET_GROUP_TASKS', res.data);
      return res;
    },
    async uploadMarkdown({ commit }, data) {
      const res = await uploadMarkdown(data);
      return res;
    },
    async deleteGroupTask({ commit }, data) {
      const res = await deleteGroupTask(data);
      commit('UPDATE_TASK_STATUS', data);
      return res;
    }
  }
}