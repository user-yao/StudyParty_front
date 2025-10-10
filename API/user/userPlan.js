import { request } from '../../request/request.js';

export const addUserPlan = (data) => {
  return request({
    url: '/user/userPlan/addUserPlan',
    method: 'POST',
    data:{
      planContext:data.planContext,
      startTime:data.startTime
    },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
  });
};
export const deleteUserPlan = (data) => {
  return request({
    url: '/user/userPlan/deleteUserPlan',
    method: 'POST',
    data:{
      planId:data.planId
    },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
  });
};
export const startUserPlan = (data) => {
  return request({
    url: '/user/userPlan/startUserPlan',
    method: 'POST',
    data:{
      planId:data.planId
    },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
  });
};
export const endUserPlan = (data) => {
  return request({
    url: '/user/userPlan/endUserPlan',
    method: 'POST',
    data:{
      planId:data.planId
    },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
  });
};
export const getUserPlans = (data) => {
  return request({
    url: '/user/userPlan/getUserPlans',
    method: 'POST',
    data,
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
  });
};
