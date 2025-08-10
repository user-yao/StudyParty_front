import { myArticle, articleById, searchArticle, createArticle, deleteArticle } from '../../API/article/article.js';
export default {
  namespaced: true,
  state: () => ({ 
    articleList: [], 
    currentArticle: null, 
    hotArticles: [] 
  }),
  mutations: {
    SET_ARTICLE_LIST(state, list) {
      state.articleList = list;
    },
    SET_CURRENT_ARTICLE(state, article) {
      state.currentArticle = article;
    },
    SET_HOT_ARTICLES(state, list) {
      state.hotArticles = list;
    }
  },
  actions: {
    async searchArticle({ commit }, params) {
      const res = await searchArticle(params); // 调用API/article/article.js的searchArticle接口
      if (res.code === 200) {
        commit('SET_ARTICLE_LIST', res.data.list);
      }
      return res;
    },
    async articleById({ commit }, params) {
      const res = await articleById(params); // 获取单篇文章详情
      if (res.code === 200) {
        commit('SET_CURRENT_ARTICLE', res.data);
      }
      return res;
    },
    async createArticle({ commit }, data) {
      const res = await createArticle(data); // 调用创建文章接口
      return res;
    },
    async deleteArticle({ commit }, params) {
      const res = await deleteArticle(params); // 调用删除文章接口
      return res;
    },
    async myArticle({ commit }, data) {
      const res = await myArticle(data); // 调用更新文章接口
      return res;
    },
  }
};