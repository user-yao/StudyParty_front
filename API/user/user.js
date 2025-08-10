import { request } from '../../request/request.js';

/**
 * 用户登录请求
 * @param {Object} data - 登录数据
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise<Object>} 登录响应
 */
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

/**
 * 用户注册请求
 * @param {Object} data - 注册数据
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} data.email - 邮箱
 * @returns {Promise<Object>} 注册响应
 */
export const register = (data) => {
  return request({
    url: '/user/register',
    method: 'POST',
    data:{
      name:data.name,
      password:data.password,
      sex:data.sex,
      major:data.major,
      grade:data.grade,
      status:data.status,
      phone:data.phone,
      school:data.school,
      email:data.email
    }
  });
};
export const updatePassword = (data) => {
  return request({
    url: '/user/updatePassword',
    method: 'POST',
    data:{
      id:localStorage.getItem('id'),
      password:data.password
    }
  });
}
export const updateUser = (data) => {
  return request({
    url: '/user/updateUser',
    method: 'POST',
    data:{
      id:localStorage.getItem('id'),
      name:data.name,
      sex:data.sex,
      major:data.major,
      grade:data.grade,
      phone:data.phone,
      school:data.school,
      email:data.email
    }
  });
}
export const updateHead = (data) => {
  return request({
    url: '/user/updateHead',
    method: 'POST',
    data
  });
}