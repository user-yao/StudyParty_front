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
        data:{ 
            title:data.title,
            summary:data.summary,
            markdown:data.markdown
        }
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
export const recommend = (data) => {
    return request({
        url: '/article/recommend',
        method: 'GET',
        data:{
            page:data.page
        }
    });
}
export const niceArticle = (data) => {
    return request({
        url: '/article/niceArticle',
        method: 'Post',
        data:{
            page:data.page
        }
    });
}
export const collectArticle = (data) => {
    return request({
        url: '/article/collectArticle',
        method: 'POST',
        data:{
            page:data.page
        }
    });
}




