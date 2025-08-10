import { request } from '../../request/request.js';
export const joinGroup = (data) => {
  return request({
    url: '/groupJoin/joinGroup',
    method: 'POST',
    data:{
        userId:data.userId,
        groupId:data.groupId,
        context:data.context
    }
  });
}
export const getGroupJoin = (data) => {
  return request({
    url: '/groupJoin/getGroupJoin',
    method: 'GET',
    data
  });
}
export const agreeJoin = (data) => {
  return request({
    url: '/groupJoin/agreeJoin',
    method: 'POST',
    data:{
        groupJoinId:data.groupJoinId,
        agree:data.agree
    }
  });
}

