import { request } from '../../request/request.js';

// 根据任务ID获取任务详情
export const getTaskById = (taskId) => {
    return request({
        url: '/article/task/getTaskById',
        method: 'GET',
        data: {
            taskId: taskId
        }
    });
}

export const addTask = (data) => {
    return request({
        url: '/article/task/createTask',
        method: 'POST',
        data:{
            title:data.title,
            markdown:data.markdown
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}

export const deleteTask = (data) => {
    return request({
        url: '/article/task/deleteTask',
        method: 'POST',
        data:{
            taskId:data.taskId
        }
    });
}

export const searchTask = (data) => {
    return request({
        url: '/article/task/searchTask',
        method: 'POST',
        data:{
            searchContent:data.searchContent,
            currentPage:data.currentPage
        }
    });
}

export const recommend = (data) => {
    return request({
        url: '/article/task/recommend',
        method: 'GET',
        data:{
            currentPage:data.currentPage
        }
    });
}