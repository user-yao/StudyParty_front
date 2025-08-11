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