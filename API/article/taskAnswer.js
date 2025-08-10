import { request } from '../../request/request.js';
export const addTaskAnswer = (data) => {
    return request({
        url: '/article/addTaskAnswer',
        method: 'POST',
        data
    });
}
export const deleteTaskAnswer = (data) => {
    return request({
        url: '/article/deleteTaskAnswer',
        method: 'POST',
        data:{
            taskAnswerId:data.taskAnswerId
        }
    });
}
export const trueTaskAnswer = (data) => {
    return request({
        url: '/article/trueTaskAnswer',
        method: 'POST',
        data:{
            taskAnswerId:data.taskAnswerId
        }
    });
}
export const TaskAnswerList = (data) => {
    return request({
        url: '/article/TaskAnswerList',
        method: 'POST',
        data:{
            taskId:data.taskId,
            currentPage:data.currentPage
        }
    });
}
export const selectTaskAnswer = (data) => {
    return request({
        url: '/article/selectTaskAnswer',
        method: 'POST',
        data:{
            taskId:data.taskId
        }
    });
}