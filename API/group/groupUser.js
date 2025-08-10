import { request } from '../../request/request.js';
export const deleteUser = (data) => {
    return request({
        url: '/groupUser/deleteUser',
        method: 'POST',
        data:{
            groupId:data.groupId,
            delUserId:data.delUserId
        }
    });
}
export const selectGroupUser = (data) => {
    return request({
        url: '/groupUser/selectGroupUser',
        method: 'POST',
        data:{
            groupId:data.groupId
        }
    });
}

