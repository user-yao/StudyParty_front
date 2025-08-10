import { request } from '../../request/request.js';
export const myArticle = (data) => {
    return request({
        url: '/article/myArticle',
        method: 'POST',
        data
    });
}
export const articleById = (data) => {
    return request({
        url: '/article/articleById',
        method: 'POST',
        data:{
            articleId:data.articleId
        }
    });
}
export const searchArticle = (data) => {
    return request({
        url: '/article/searchArticle',
        method: 'POST',
        data:{
            searchContext:data.searchContext,
            currentPage:data.currentPage
        }
    });
}
export const createArticle = (data) => {
    return request({
        url: '/article/createArticle',
        method: 'POST',
        data
    });
}
export const deleteArticle = (data) => {
    return request({
        url: '/article/deleteArticle',
        method: 'POST',
        data:{
            articleId:data.articleId
        }
    });
}



