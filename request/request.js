import {
	baseUrl,
	timeout
} from '../config/config.js';

/**
 * 通用网络请求方法
 * @param {Object} options - 请求配置
 * @param {string} options.url - 接口路径（不包含根地址）
 * @param {string} [options.method='GET'] - 请求方法
 * @param {Object} [options.data={}] - 请求数据
 * @param {Object} [options.header={ 'Content-Type': 'application/json' }] - 请求头
 * @returns {Promise<Object>} 响应数据
 */

export const request = (options) => {
	return new Promise((resolve, reject) => {
		console.log('准备发送请求，参数:', {
			url: baseUrl + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: (() => {
				const excludePaths = ['/user/login', '/user/register'];
				const defaultHeader = options.header || {};

				// 如果不在排除列表中，添加 Authorization 头，并默认使用 application/json
				if (!excludePaths.includes(options.url)) {
					const token = uni.getStorageSync('token');
					if (!token) {
						reject(new Error('未登录，请先登录'));
						return;
					}
					// 如果用户显式指定了 Content-Type，直接保留
					if (defaultHeader['Content-Type']) {
						return {
							...defaultHeader,
							'Authorization': `${token}`
						};
					}
					return {
						...defaultHeader,
						'Authorization': `${token}`,
						'Content-Type': 'application/json'
					};
				}
				// 登录/注册接口，默认使用 application/json（可自定义）
				return {
					...defaultHeader,
					'Content-Type': 'application/json'
				};
			})(),
			timeout: timeout
		});
		
		uni.request({
			url: baseUrl + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: (() => {
				const excludePaths = ['/user/login', '/user/register'];
				const defaultHeader = options.header || {};

				// 如果不在排除列表中，添加 Authorization 头，并默认使用 application/json
				if (!excludePaths.includes(options.url)) {
					const token = uni.getStorageSync('token');
					if (!token) {
						reject(new Error('未登录，请先登录'));
						return;
					}
					// 如果用户显式指定了 Content-Type，直接保留
					if (defaultHeader['Content-Type']) {
						return {
							...defaultHeader,
							'Authorization': `${token}`
						};
					}
					return {
						...defaultHeader,
						'Authorization': `${token}`,
						'Content-Type': 'application/json'
					};
				}
				// 登录/注册接口，默认使用 application/json（可自定义）
				return {
					...defaultHeader,
					'Content-Type': 'application/json'
				};
			})(),
			timeout: timeout,
			success: (res) => {
				console.log('请求成功，响应数据:', res);
				if (res.statusCode >= 200 && res.statusCode < 300) {
					resolve(res.data);
				} else if (res.statusCode == 401) {
					uni.showToast({
						title: '身份失效，请重新登录',
						icon: 'error'
					});
					uni.reLaunch({
						url: "/pages/login/login",
					})
				} else {
					reject(new Error(`请求失败，状态码：${res.statusCode}`));
				}
			},
			fail: (err) => {
				console.log('请求失败，错误信息:', err);
				reject(err);
			}
		});
	});
};