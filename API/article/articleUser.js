import { request } from '../../request/request.js';

export const myCollectArticle = (data) => {
    return request({
        url: '/article/articleUser/myCollectArticle',
        method: 'POST',
        data,
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}