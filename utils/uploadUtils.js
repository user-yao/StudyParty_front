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

    // 串行上传文件，等上一个上传完后再上传下一个
    return new Promise((resolve, reject) => {
      const results = [];
      
      const uploadNext = (index) => {
        // 如果所有文件都已上传完成，resolve结果
        if (index >= filePaths.length) {
          resolve(results);
          return;
        }
        
        const filePath = filePaths[index];
        
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
            
            // 保存成功的上传结果
            results.push({
              success: true,
              data: res.data,
              statusCode: res.statusCode
            });
            
            // 继续上传下一个文件
            uploadNext(index + 1);
          },
          fail: (err) => {
            completedFiles++;
            if (onProgress) {
              onProgress(completedFiles, totalFiles, err); // 回调上传进度
            }
            
            // 保存失败的上传结果
            results.push({
              success: false,
              message: err.errMsg || '上传失败',
              code: err.errCode || -1
            });
            
            // 继续上传下一个文件（即使当前文件上传失败）
            uploadNext(index + 1);
          }
        });
      };
      
      // 开始上传第一个文件
      uploadNext(0);
    });
  }
}


export default UploadUtils;