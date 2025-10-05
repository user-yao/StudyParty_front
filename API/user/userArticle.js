import { request } from '../../request/request.js';

export const selectMyUserArticle = (data) => {
  return request({
    url: '/user/userArticle/selectMyUserArticle',
    method: 'GET',
    data
  });
};