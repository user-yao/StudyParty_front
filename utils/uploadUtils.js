import { baseUrl, timeout } from '../config/config.js';
class UploadUtils {
  /**
   * 单文件上传
   * @param {Object} options
   * @param {String} options.url - 服务器接口地址
   * @param {String} options.filePath - 文件本地临时路径
   * @param {String} options.name - 后端接收的字段名
   * @param {Object} [options.formData] - 附加数据
   * @param {Object} [options.header] - 请求头（如 token）
   * @param {Function} [options.onProgress] - 上传进度回调
   * @returns {Promise}
   */
  static uploadFile({
    url,
    filePath,
    name = 'file',
    formData = {},
    header = {
      'Authorization': `${uni.getStorageSync('token')}`
    },
    onProgress
  }) {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(new Error('上传地址 (url) 不能为空'));
        return;
      }
      if (!filePath) {
        reject(new Error('文件路径 (filePath) 不能为空'));
        return;
      }
      url = baseUrl + url;
      const uploadTask = uni.uploadFile({
        url,
        filePath,
        name,
        formData,
        header,
        success: (res) => {
          console.log(res)
          // uni.uploadFile 成功时 res.statusCode 是 number
          if (res.statusCode == 200) {
            let data;
            try {
              // 尝试解析 JSON
              data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
            } catch (e) {
              data = res.data; // 解析失败则保留原始字符串
            }
            resolve({
              success: true,
              data,
              statusCode: res.statusCode
            });
          } else {
            reject({
              success: false,
              message: `HTTP ${res.statusCode}`,
              statusCode: res.statusCode,
              data: res.data
            });
          }
        },
        fail: (err) => {
          console.log(res)
          reject({
            success: false,
            message: err.errMsg || '上传失败',
            code: err.errCode || -1
          });
        }
      });

      // 监听上传进度
      if (onProgress && typeof onProgress === 'function') {
        uploadTask.onProgressUpdate((res) => {
          onProgress(res.progress, res.totalBytesSent, res.totalBytesExpectedToSend);
        });
      }
    });
  }

  static uploadFiles({
    url,
    filePaths,
    name = 'file',
    formData = {},
    header = {
      'Authorization': `${uni.getStorageSync('token')}`
    },
    onProgress
  }) {
    if (!Array.isArray(filePaths) || filePaths.length === 0) {
      return Promise.reject(new Error('filePaths 必须是非空数组'));
    }

    const promises = filePaths.map((filePath, index) => {
      return this.uploadFile({
        url,
        filePath,
        name,
        formData,
        header,
        onProgress: (progress) => {
          if (onProgress) {
            onProgress(index, progress);
          }
        }
      }).catch(err => ({
        success: false,
        index,
        ...err
      }));
    });

    return Promise.all(promises);
  }
  static uploadFilesArray({
    url,
    filePaths,
    name = 'file',
    formData = {},
    header = {
      'Authorization': `${uni.getStorageSync('token')}`
    },
    onProgress
  }) {
    if (!Array.isArray(filePaths) || filePaths.length === 0) {
      return Promise.reject(new Error('filePaths 必须是非空数组'));
    }

    const totalFiles = filePaths.length;
    let completedFiles = 0;

    // 创建 Promise 数组，每个 Promise 代表一个文件的上传
    const promises = filePaths.map((filePath, index) => {
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: baseUrl + url,
          filePath,
          name, // 所有文件使用相同的字段名，后端会自动合并为数组
          formData,
          header,
          success: (res) => {
            completedFiles++;
            if (onProgress) {
              onProgress(completedFiles, totalFiles, res); // 回调上传进度
            }
            resolve({
              success: true,
              data: res.data,
              statusCode: res.statusCode
            });
          },
          fail: (err) => {
            completedFiles++;
            if (onProgress) {
              onProgress(completedFiles, totalFiles, err); // 回调上传进度
            }
            reject({
              success: false,
              message: err.errMsg || '上传失败',
              code: err.errCode || -1
            });
          }
        });
      });
    });

    // 返回所有上传结果的 Promise
    return Promise.allSettled(promises).then(results => {
      return results.map(result => {
        if (result.value.statusCode === 200) {
			console.log(result)
          return result.value;
        } else {
          return {
            success: false,
            message: "提交失败",
            code: result.value.statusCode
          };
        }
      });
    });
  }
}


export default UploadUtils;