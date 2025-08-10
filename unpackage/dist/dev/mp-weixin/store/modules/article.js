"use strict";
const common_vendor = require("../../common/vendor.js");
const article = {
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
    SET_CURRENT_ARTICLE(state, article2) {
      state.currentArticle = article2;
    },
    SET_HOT_ARTICLES(state, list) {
      state.hotArticles = list;
    }
  },
  actions: {
    async fetchArticles({ commit }, category) {
      common_vendor.index.__f__("log", "at store/modules/article.js:24", "模拟获取文章列表，分类：", category);
    },
    async getHotArticles({ commit }) {
      common_vendor.index.__f__("log", "at store/modules/article.js:30", "模拟获取热门文章");
    }
  }
};
exports.article = article;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/modules/article.js.map
