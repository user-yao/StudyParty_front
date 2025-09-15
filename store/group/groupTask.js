import { selectMyGroupTask, uploadMarkdown, deleteGroupTask, createGroupTask } from '../../API/group/groupTask.js';

export default {
  namespaced: true, // 添加命名空间配置
  state: {
    groupTasks: []
  },
  mutations: {
    SET_GROUP_TASKS(state, tasks) {
      // 处理返回的数据结构，如果tasks是对象且包含records属性，则使用records
      if (tasks && typeof tasks === 'object' && Array.isArray(tasks.records)) {
        state.groupTasks = tasks.records;
      } else if (Array.isArray(tasks)) {
        state.groupTasks = tasks;
      } else {
        state.groupTasks = [];
      }
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
      if (res.code === 200) {
        commit('SET_GROUP_TASKS', res.data);
      }
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