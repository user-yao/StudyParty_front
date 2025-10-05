import {myCollectArticle} from "@/API/article/articleUser.js"
export default {
  namespaced: true,
  state: () => ({ 

  }),
  mutations: {

  },
  actions: {
    myCollectArticle({ commit }, payload) {
      return myCollectArticle(payload).then(res =>{
          if (res.code === 200) {

          }
          return res;
      }) 
    },
  }
};