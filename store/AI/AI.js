import { getSkillTree, getTeachingPlan,getTaskAnalyst,getArticleAnalyst } from '../../API/AI/AI.js';

const state = {
};

const mutations = {

};

const actions = {
  async toGetSkillTree({ commit }, data) {
    try {
      const res = await getSkillTree(data);
      return res;
    } catch (error) {
      throw error;
    }
  },
  async toTeachingPlan({ commit }, prompt) {
    try {
      const res = await getTeachingPlan(prompt);
      return res;
    } catch (error) {
      throw error;
    }
  },
  async getTaskAnalyst({ commit }, prompt) {
    try {
      const res = await getTaskAnalyst(prompt);
      return res;
    } catch (error) {
      throw error;
    }
  },
  async getArticleAnalyst({ commit }, prompt) {
    try {
      const res = await getArticleAnalyst(prompt);
      return res;
    } catch (error) {
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