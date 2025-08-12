import { request } from '../../request/request.js';

export const login = (data) => {
  return request({
    url: '/user/login',
    method: 'GET',
    data:{
      phone:data.phone,
      password:data.password
    }
  });
};