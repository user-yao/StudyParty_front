import { request } from '../../request/request.js';

export const submit = (data) => {
    return request({
        url: '/group/groupTaskAnswer/submit',
        method: 'POST',
        data: {
            groupTaskId: data.groupTaskId,
            markdown: data.markdown
        },
		header: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
    });
}

export const score = (data) => {
    return request({
        url: '/group/groupTaskAnswer/score',
        method: 'POST',
        data: {
            groupTaskAnswerId: data.groupTaskAnswerId,
            score: data.score
        }
    });
}

export const getGroupTaskAnswers = (data) => {
    return request({
        url: '/group/groupTaskAnswer/getGroupTaskAnswers',
        method: 'POST',
        data: {
            groupTaskId: data.groupTaskId
        }
    });
}

export const getMyGroupTaskAnswers = (data) => {
    return request({
        url: '/group/groupTaskAnswer/getMyGroupTaskAnswers',
        method: 'POST',
        data: {
            groupTaskId: data.groupTaskId
        },
		header: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
    });
}