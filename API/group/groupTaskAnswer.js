import { request } from '../../request/request.js';
export const submit = (data) => {
    return request({
        url: '/groupTaskAnswer/submit',
        method: 'POST',
        data:{
            taskId:data.taskId,
            answer:data.answer
        }
    });
}
export const score = (data) => {
    return request({
        url: '/groupTaskAnswer/score',
        method: 'POST',
        data:{
            groupTaskAnswerId:data.groupTaskAnswerId,
            score:data.score
        }
    });
}
export const getGroupTaskAnswers = (data) => {
    return request({
        url: '/groupTaskAnswer/getGroupTaskAnswers',
        method: 'POST',
        data:{
            groupTaskId:data.groupTaskId
        }
    });
}
export const getMyGroupTaskAnswers = (data) => {
    return request({
        url: '/groupTaskAnswer/getMyGroupTaskAnswers',
        method: 'POST',
        data:{
            groupTaskAnswerId:data.groupTaskAnswerId
        }
    });
}


