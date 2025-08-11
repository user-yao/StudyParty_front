import { request } from '../../request/request.js';

export const selectMyUserTasks = (data) => {
  return request({
    url: '/UserTask/selectMyUserTasks',
    method: 'POST',
    data
  });
};