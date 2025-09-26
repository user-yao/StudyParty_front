import { getArticleComment, addArticleComment, deleteArticleComment, niceArticleComment } from '../../API/article/articleComment.js';

const state = {
  comments: []
};

const mutations = {
  SET_COMMENTS(state, comments) {
    // 确保 comments 是数组
    state.comments = Array.isArray(comments) ? comments : [];
  },
  ADD_COMMENT(state, comment) {
    // 确保 comments 是数组后再操作
    if (Array.isArray(state.comments)) {
      state.comments.unshift(comment);
    } else {
      state.comments = [comment];
    }
  },
  UPDATE_COMMENT(state, updatedComment) {
    // 确保 comments 是数组后再操作
    if (Array.isArray(state.comments)) {
      const index = state.comments.findIndex(cmt => cmt.id === updatedComment.id);
      if (index !== -1) {
        state.comments[index] = updatedComment;
      }
    }
  },
  REMOVE_COMMENT(state, commentId) {
    // 确保 comments 是数组后再操作
    if (Array.isArray(state.comments)) {
      state.comments = state.comments.filter(cmt => cmt.id !== commentId);
    } else {
      state.comments = [];
    }
  },
  SET_COMMENT_LIKE(state, { commentId, isLike }) {
    // 确保 comments 是数组后再操作
    if (Array.isArray(state.comments)) {
      const index = state.comments.findIndex(cmt => cmt.id === commentId);
      if (index !== -1) {
        if (isLike) {
          state.comments[index].likeCount++;
          state.comments[index].isLiked = true;
        } else {
          state.comments[index].likeCount--;
          state.comments[index].isLiked = false;
        }
      }
    }
  }
};

const actions = {
  async getArticleComment({ commit }, { articleId, currentPage = 1 }) {
    try {
      const res = await getArticleComment({ articleId, currentPage });
      // 处理返回的数据，确保是数组格式
      if (res && res.code === 200) {
        // 根据实际返回的数据结构调整
        const comments = res.data && res.data.records ? res.data.records : [];
        commit('SET_COMMENTS', comments);
      }
      return res;
    } catch (error) {
      console.error('获取文章评论失败:', error);
      throw error;
    }
  },
  async addArticleComment({ commit }, { articleId, content }) {
    try {
      const res = await addArticleComment({ articleId, content });
      // 确保返回的数据格式正确
      if (res && res.code === 200 && res.data) {
        commit('ADD_COMMENT', res.data);
      }
      return res;
    } catch (error) {
      console.error('提交评论失败:', error);
      throw error;
    }
  },
  async deleteArticleComment({ commit }, commentId) {
    try {
      const res = await deleteArticleComment({ commentId });
      commit('REMOVE_COMMENT', commentId);
      return res;
    } catch (error) {
      console.error('删除评论失败:', error);
      throw error;
    }
  },
  async niceArticleComment({ commit }, commentId) {
    try {
      const res = await niceArticleComment({ commentId });
      // 可以根据需要更新状态，例如标记评论为精华等
      return res;
    } catch (error) {
      console.error('设置精华评论失败:', error);
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