import { request } from '../../request/request.js';
export const joinGroup = (data) => {
  return request({
    url: '/group/groupJoin/joinGroup',
    method: 'POST',
    data:{
        groupId:data.groupId,
        context:data.context
    },
    header: {
	    'Content-Type': 'application/x-www-form-urlencoded'
	  }
  });
}
export const getGroupJoin = (data) => {
  return request({
    url: '/group/groupJoin/getGroupJoin',
    method: 'GET',
    data
  });
}
export const agreeJoin = (data) => {
  return request({
    url: '/group/groupJoin/agreeJoin',
    method: 'POST',
    data:{
        groupJoinId:data.groupJoinId,
        agree:data.agree
    }
  });
}

