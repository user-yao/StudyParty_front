import { getArticleComment, addArticleComment, deleteArticleComment } from '../../API/article/articleComment.js';

const state = {
  comments: []
};

const mutations = {
  SET_COMMENTS(state, comments) {
    state.comments = comments;
  },
  ADD_COMMENT(state, comment) {
    state.comments.unshift(comment);
  },
  UPDATE_COMMENT(state, updatedComment) {
    const index = state.comments.findIndex(cmt => cmt.id === updatedComment.id);
    if (index !== -1) {
      state.comments[index] = updatedComment;
    }
  },
  REMOVE_COMMENT(state, commentId) {
    state.comments = state.comments.filter(cmt => cmt.id !== commentId);
  }
};

const actions = {
  async getArticleComment({ commit }, articleId) {
    try {
      const res = await getArticleComment(articleId);
      commit('SET_COMMENTS', res.data);
      return res;
    } catch (error) {
      console.error('获取文章评论失败:', error);
      throw error;
    }
  },
  async addArticleComment({ commit }, { articleId, content }) {
    try {
      const res = await addArticleComment(articleId, content);
      commit('ADD_COMMENT', res.data);
      return res;
    } catch (error) {
      console.error('提交评论失败:', error);
      throw error;
    }
  },
  async deleteArticleComment({ commit }, commentId) {
    try {
      const res = await deleteArticleComment(commentId);
      commit('REMOVE_COMMENT', commentId);
      return res;
    } catch (error) {
      console.error('删除评论失败:', error);
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