import { myArticle, articleById, searchArticle, createArticle, deleteArticle,recommend,niceArticle,collectArticle,uploadImages } from '../../API/article/article.js';
export default {
  namespaced: true,
  state: () => ({ 
    articleList: [], 
    currentArticle: null, 
    hotArticles: [],
    recommendArticles: [],
    niceArticles: [],
    collectedArticles: []
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
    },
    SET_RECOMMEND_ARTICLES(state, data) {
      // 根据API返回格式处理数据
      if (data && data.records) {
        // 如果是第一页，替换数据；否则追加数据
        if (data.current === 1) {
          state.recommendArticles = data.records;
        } else {
          state.recommendArticles.push(...data.records);
        }
      } else if (Array.isArray(data)) {
        state.recommendArticles = data;
      }
    },
    CLEAR_RECOMMEND_ARTICLES(state) {
      state.recommendArticles = [];
    },
    SET_NICE_ARTICLES(state, list) {
      state.niceArticles = list;
    },
    SET_COLLECTED_ARTICLES(state, list) {
      state.collectedArticles = list;
    },
    // 更新文章的点赞状态
    UPDATE_ARTICLE_LIKE(state, { articleId, isNice }) {
      // 更新推荐文章中的点赞状态
      const recommendArticle = state.recommendArticles.find(article => article.id === articleId);
      if (recommendArticle) {
        recommendArticle.isNice = isNice;
        // 根据操作类型增减点赞数
        recommendArticle.nice += isNice ? 1 : -1;
      }
    },
    // 更新文章的收藏状态
    UPDATE_ARTICLE_FAVORITE(state, { articleId, isCollect }) {
      // 更新推荐文章中的收藏状态
      const recommendArticle = state.recommendArticles.find(article => article.id === articleId);
      if (recommendArticle) {
        recommendArticle.isCollect = isCollect;
        // 根据操作类型增减收藏数
        recommendArticle.collect += isCollect ? 1 : -1;
      }
    }
  },
  actions: {
    async searchArticle({ commit }, params) {
      const res = await searchArticle(params); // 调用API/article/article.js的searchArticle接口
      if (res.code === 200) {
        // 根据API返回格式处理数据
        // API返回格式: { data: { records: [...] } }
        if (res.data && Array.isArray(res.data.records)) {
          commit('SET_ARTICLE_LIST', res.data.records);
        } else {
          commit('SET_ARTICLE_LIST', []);
        }
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
    async recommend({ commit }, params) {
      const res = await recommend(params); // 调用推荐文章接口
      if (res.code === 200) {
        commit('SET_RECOMMEND_ARTICLES', res.data);
      }
      return res;
    },
    async niceArticle({ commit }, articleId) {
      const res = await niceArticle({ articleId }); // 调用点赞文章接口
      if (res.code === 200) {
        // 根据返回的数据判断是点赞还是取消点赞
        const isNice = res.data === "取消点赞" ? false : true;
        commit('UPDATE_ARTICLE_LIKE', { articleId, isNice });
      }
      return res;
    },
    // 收藏文章
    async collectArticle({ commit }, articleId) {
      const res = await collectArticle({ articleId }); // 调用收藏文章接口
      if (res.code === 200) {
        // 根据返回的数据判断是收藏还是取消收藏
        const isCollect = res.data === "取消收藏" ? false : true;
        commit('UPDATE_ARTICLE_FAVORITE', { articleId, isCollect });
      }
      return res;
    },
    
    // 上传图片
    async uploadImages({ commit }, data) {
      const res = await uploadImages(data); // 调用上传图片接口
      return res;
    },
    
    // 清除推荐文章
    clearRecommendArticles({ commit }) {
      commit('CLEAR_RECOMMEND_ARTICLES');
    }
  }
};