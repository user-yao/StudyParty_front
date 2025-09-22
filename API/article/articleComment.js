import { request } from '../../request/request.js';
export const addArticleComment = (data) => {
    return request({
        url: '/article/articleComment/addArticleComment',
        method: 'POST',
        data
    });
}
export const deleteArticleComment = (data) => {
    return request({
        url: '/article/articleComment/deleteArticleComment',
        method: 'POST',
        data:{
            articleCommentId:data.articleCommentId
        }
    });
}
export const getArticleComment = (data) => {
    return request({
        url: '/article/articleComment/getArticleComment',
        method: 'POST',
        data:{
            articleId:data.articleId,
            currentPage:data.currentPage
        }
    });
}
export const niceArticleComment = (data) => {
    return request({
        url: '/article/articleComment/niceArticleComment',
        method: 'POST',
        data:{
            articleCommentId:data.articleCommentId
        }
    });
}


