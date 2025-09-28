import { request } from '../../request/request.js';

export const addArticleComment = (data) => {
    return request({
        url: '/article/articleComment/addArticleComment',
        method: 'POST',
        data:{
            articleId: data.articleId,
            content: data.content
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}

export const deleteArticleComment = (data) => {
    return request({
        url: '/article/articleComment/deleteArticleComment',
        method: 'POST',
        data:{
            articleCommentId:data.articleCommentId
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
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
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}

export const niceArticleComment = (data) => {
    console.log(data)
    return request({
        url: '/article/articleComment/niceArticleComment',
        method: 'POST',
        data:{
            articleCommentId:data.articleCommentId
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}