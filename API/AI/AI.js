import { request } from '../../request/request.js';
export const addTask = (data) => {
    return request({
        url: '/AI/getSkillTree',
        method: 'POST',
        data:{
            prompt:data.prompt
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
export const deleteTask = (data) => {
    return request({
        url: '/AI/teachingPlan',
        method: 'POST',
        data:{
            prompt:data.prompt
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}



