import { request } from '../../request/request.js';

export const getSkillTree = (data) => {
    console.log(data.prompt)
    return request({
        url: '/AI/getSkillTree',
        method: 'POST',
        data:JSON.stringify(data.prompt),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export const getTeachingPlan = (data) => {
    return request({
        url: '/AI/teachingPlan',
        method: 'POST',
        data:JSON.stringify(data.prompt),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}