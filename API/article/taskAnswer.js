import { request } from '../../request/request.js';
export const addTaskAnswer = (data) => {
    return request({
        url: '/article/taskAnswer/createTaskAnswer',
        method: 'POST',
        data:{
            taskId:data.taskId,
            markdown:data.markdown
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
export const deleteTaskAnswer = (data) => {
    return request({
        url: '/article/taskAnswer/deleteTaskAnswer',
        method: 'POST',
        data:{
            taskAnswerId:data.taskAnswerId
        }
    });
}
export const trueTaskAnswer = (data) => {
    return request({
        url: '/article/taskAnswer/trueTaskAnswer',
        method: 'POST',
        data:{
            taskAnswerId:data.taskAnswerId
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
export const TaskAnswerList = (data) => {
    return request({
        url: '/article/taskAnswer/TaskAnswerList',
        method: 'POST',
        data:{
            taskId:data.taskId,
            currentPage:data.currentPage
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
export const selectTaskAnswer = (data) => {
    return request({
        url: '/article/taskAnswer/selectTaskAnswer',
        method: 'POST',
        data:{
            taskId:data.taskId
        }
    });
}