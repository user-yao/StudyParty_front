import { request } from '../../request/request.js';
export const selectMyGroupTask = (data) => {
    return request({
        url: '/groupTask/selectMyGroupTask',
        method: 'POST',
        data:{
            groupId:data.groupId,
            currentPage:data.currentPage
        }
    });
}
export const deleteGroupTask = (data) => {
    return request({
        url: '/groupTask/deleteGroupTask',
        method: 'POST',
        data:{
            groupTaskId:data.groupTaskId,
            currentPage:data.currentPage
        }
    });
}
export const uploadMarkdown = (data) => {
    return request({
        url: '/groupTask/uploadMarkdown',
        method: 'POST',
        data
    });
}


