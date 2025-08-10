import { request } from '../../request/request.js';
export const addTask = (data) => {
    return request({
        url: '/task/addTask',
        method: 'POST',
        data
    });
}
export const deleteTask = (data) => {
    return request({
        url: '/task/deleteTask',
        method: 'POST',
        data:{
            taskId:data.taskId
        }
    });
}
export const searchTask = (data) => {
    return request({
        url: '/task/searchTask',
        method: 'POST',
        data:{
            searchContent:data.searchContent,
            currentPage:data.currentPage
        }
    });
}


