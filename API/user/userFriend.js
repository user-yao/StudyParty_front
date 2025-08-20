import { request } from '../../request/request.js';
export const requestFriend = (data) => {
  return request({
    url: '/user/friend/request',
    method: 'POST',
    data:{
		friendId:data.friendId,
		context:data.context
	}
  });
};
export const accept = (data) => {
  return request({
    url: '/user/friend/accept',
    method: 'POST',
    data:{
		
	}
  });
};
export const deleteFriend = (data) => {
  return request({
    url: '/user/friend/delete',
    method: 'POST',
    data:{
		friendId:data.friendId
	},
	header: {
	    'Content-Type': 'application/x-www-form-urlencoded'
	  }
  });
};
export const friendList = (data) => {
  return request({
    url: '/user/friend/friendList',
    method: 'POST',
    data
  });
};
export const friendRequestList = (data) => {
  return request({
    url: '/user/friend/friendRequestList',
    method: 'POST',
    data
  });
};
export const myFriendRequestList = (data) => {
  return request({
    url: '/user/friend/myFriendRequestList',
    method: 'POST',
    data
  });
};
export const remark = (data) => {
  return request({
    url: '/user/friend/remark',
    method: 'POST',
    data:{
		friendId:data.friendId,
		remark:data.remark
	},
	header: {
	    'Content-Type': 'application/x-www-form-urlencoded'
	  }
  });
};