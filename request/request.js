import { baseUrl, timeout } from '../config/config.js';

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
    uni.request({
      url: baseUrl + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: (() => {
        const excludePaths = ['/user/login', '/user/register'];
        if (!excludePaths.includes(options.url)) {
		  const token = uni.getStorageSync('token');
		    if (!token) {
		      reject(new Error('未登录，请先登录'));
		      return;
		    }
          return { ...options.header, 'Authorization': `${token}`, 'Content-Type': 'application/json' };
        }
        return options.header || { 'Content-Type': 'application/json' };
      })(),
      timeout: timeout,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject(new Error(`请求失败，状态码：${res.statusCode}`));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};