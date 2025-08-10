import { request } from '../../request/request.js';
export const addArticleComment = (data) => {
    return request({
        url: '/article/addArticleComment',
        method: 'POST',
        data
    });
}
export const deleteArticleComment = (data) => {
    return request({
        url: '/article/deleteArticleComment',
        method: 'POST',
        data:{
            articleCommentId:data.articleCommentId
        }
    });
}
export const getArticleComment = (data) => {
    return request({
        url: '/article/getArticleComment',
        method: 'POST',
        data:{
            articleId:data.articleId,
            currentPage:data.currentPage
        }
    });
}


