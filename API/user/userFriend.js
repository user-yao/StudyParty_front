import { request } from '../../request/request.js';
export const request = (data) => {
  return request({
    url: '/user/friend/request',
    method: 'POST',
    data
  });
};
export const accept = (data) => {
  return request({
    url: '/user/friend/accept',
    method: 'POST',
    data
  });
};
export const deleteFriend = (data) => {
  return request({
    url: '/user/friend/delete',
    method: 'POST',
    data:{
		friendId:data.friendId
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