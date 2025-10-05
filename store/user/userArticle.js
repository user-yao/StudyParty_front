import {selectMyUserArticle as apiSelectMyUserArticle} from "@/API/user/userArticle.js"
export default {
  namespaced: true,
  state: () => ({ 

  }),
  mutations: {

  },
  actions: {
    selectMyUserArticle({ commit }, payload) {
      return apiSelectMyUserArticle(payload).then(res =>{
		  if (res.code === 200) {

		  }
		  return res;
	  }) 
    },
  }
};