import { request } from '../../request/request.js';
export const myArticle = (data) => {
    return request({
        url: '/article/myArticle',
        method: 'POST',
        data,
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
export const articleById = (data) => {
    return request({
        url: '/article/articleById',
        method: 'POST',
        data: {
            articleId: data.articleId
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
export const searchArticle = (data) => {
    return request({
        url: '/article/searchArticle',
        method: 'POST',
        data: {
            searchContext: data.searchContext,
            currentPage: data.currentPage
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
export const createArticle = (data) => {
    return request({
        url: '/article/createArticle',
        method: 'POST',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
            title: data.title,
            summary: data.summary,
            markdown: data.markdown
        }
    });
}
export const deleteArticle = (data) => {
    return request({
        url: '/article/deleteArticle',
        method: 'POST',
        data: {
            articleId: data.articleId
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
export const recommend = (data) => {
    return request({
        url: '/article/recommend',
        method: 'GET',
        data: {
            page: data.page
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
export const niceArticle = (data) => {
    return request({
        url: '/article/niceArticle',
        method: 'POST',
        data: {
            articleId: data.articleId
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
export const collectArticle = (data) => {
    return request({
        url: '/article/collectArticle',
        method: 'POST',
        data: {
            articleId: data.articleId
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}

export const uploadImages = (data) => {
    return request({
        url: '/article/uploadImages',
        method: 'POST',
        data: data,
        header: {
            'Content-Type': 'multipart/form-data'
        }
    });
}




