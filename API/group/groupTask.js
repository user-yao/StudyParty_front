import {
	request
} from '../../request/request.js';
export const selectMyGroupTask = (data) => {
	return request({
		url: '/group/groupTask/selectMyGroupTask',
		method: 'POST',
		data: {
			groupId: data.groupId,
			currentPage: data.currentPage
		},
		header: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});
}
export const deleteGroupTask = (data) => {
	return request({
		url: '/group/groupTask/deleteGroupTask',
		method: 'POST',
		data: {
			groupTaskId: data.groupTaskId,
			currentPage: data.currentPage
		},
		header: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}

	});
}
export const uploadMarkdown = (data) => {
	return request({
		url: '/group/groupTask/uploadMarkdown',
		method: 'POST',
		data,
		header: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});
}