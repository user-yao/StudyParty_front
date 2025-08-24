import { request } from '../../request/request.js';
export const deleteUser = (data) => {
    return request({
        url: '/group/groupUser/deleteUser',
        method: 'POST',
        data:{
            groupId:data.groupId,
            delUserId:data.delUserId
        }
    });
}
export const selectGroupUser = (data) => {
    return request({
        url: '/group/groupUser/selectGroupUser',
        method: 'POST',
        data:{
            groupId:data.groupId
        },
		header: {
		    'Content-Type': 'application/x-www-form-urlencoded'
		  }
    });
}

