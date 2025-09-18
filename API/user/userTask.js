import { request } from '../../request/request.js';

export const selectMyUserTasks = (data) => {
  return request({
    url: '/user/userTask/selectMyUserTasks',
    method: 'POST',
    data
  });
};