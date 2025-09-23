<template>
  <view class="article-detail-container">
    <!-- 顶部导航 -->
    <header class="app-header">
      <div class="header-top">
        <div class="header-back" @click="goBack">
          <u-icon name="arrow-left" size="20" color="#fff"></u-icon>
        </div>
        <div class="header-title">文章详情</div>
        <div class="header-actions">
          <!-- 占位元素，保持居中 -->
        </div>
      </div>
    </header>
    
    <!-- 文章内容区域 -->
    <view class="content-container">
      <scroll-view class="content-scroll" scroll-y>
        <!-- 文章详情 -->
        <view class="article-content section">
          <view class="article-header">
            <view class="article-user">
              <view class="user-avatar">
                <image 
                  v-if="article.head" 
                  :src="fullImageUrl(article.head)" 
                  mode="aspectFill"
                ></image>
                <view v-else class="avatar-placeholder">
                  {{ article.name ? article.name.substring(0, 1) : 'U' }}
                </view>
              </view>
              <view class="user-info">
                <view class="user-name">{{ article.name }}</view>
                <view class="user-school">{{ article.school }}</view>
              </view>
            </view>
            <view class="article-time">
              {{ formatTime(article.createTime) }}
            </view>
          </view>
          
          <view class="article-title">{{ article.title }}</view>
          
          <!-- Markdown内容 -->
          <view class="markdown-content">
            <u-markdown :content="article.content"></u-markdown>
          </view>
          
          <!-- 点赞收藏等操作 -->
          <view class="article-actions">
            <view class="article-meta">
              <view class="meta-item">
                <u-icon name="eye" size="14" color="#999"></u-icon>
                <text>{{ article.viewCount }}</text>
              </view>
              <view class="meta-item" @click="focusCommentInput">
                <u-icon name="chat" size="14" color="#999"></u-icon>
                <text>{{ article.commentCount }}</text>
              </view>
              <view class="meta-item" @click="toggleLike">
                <u-icon 
                  :name="article.isNice ? 'heart-fill' : 'heart'" 
                  :color="article.isNice ? '#f00' : '#999'"
                  size="14"
                ></u-icon>
                <text>{{ article.nice }}</text>
              </view>
              <view class="meta-item" @click="toggleCollect">
                <u-icon 
                  :name="article.isCollect ? 'bookmark-fill' : 'bookmark'" 
                  :color="article.isCollect ? '#4361ee' : '#999'"
                  size="14"
                ></u-icon>
                <text>{{ article.collect }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 评论区域 -->
        <view class="comments-section section">
          <view class="section-header">
            <view class="section-title">
              <u-icon name="chat" size="18" color="#333"></u-icon>
              <text>评论 ({{ article.commentCount }})</text>
            </view>
          </view>
          
          <!-- 评论列表 -->
          <view class="comments-list">
            <view 
              v-for="comment in comments" 
              :key="comment.id"
              class="comment-item"
            >
              <view class="comment-header">
                <view class="comment-author">
                  <view class="user-avatar">
                    <image 
                      v-if="comment.head" 
                      :src="fullImageUrl(comment.head)" 
                      mode="aspectFill"
                    ></image>
                    <view v-else class="avatar-placeholder">
                      {{ comment.name ? comment.name.substring(0, 1) : 'U' }}
                    </view>
                  </view>
                  <view class="user-info">
                    <view class="user-name">{{ comment.name }}</view>
                    <view class="comment-time">{{ formatCommentTime(comment.createTime) }}</view>
                  </view>
                </view>
                <view class="comment-like" @click="toggleCommentLike(comment)">
                  <u-icon 
                    :name="comment.isNice ? 'thumb-up-fill' : 'thumb-up'" 
                    :color="comment.isNice ? '#4361ee' : '#999'"
                    size="16"
                  ></u-icon>
                  <text :class="{ liked: comment.isNice }">{{ comment.nice }}</text>
                </view>
              </view>
              <view class="comment-content">
                {{ comment.content }}
              </view>
              <!-- 评论图片 -->
              <view v-if="comment.sources && comment.sources.length > 0" class="comment-images">
                <view 
                  v-for="(img, index) in comment.sources" 
                  :key="index"
                  class="comment-image"
                  @click="previewImage(img.url)"
                >
                  <image :src="fullImageUrl(img.url)" mode="aspectFill"></image>
                </view>
              </view>
            </view>
            
            <!-- 无评论提示 -->
            <view v-if="comments.length === 0" class="no-comments">
              <text>暂无评论，快来抢沙发吧！</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- 评论输入框 - 固定在底部 -->
    <view class="comment-input-fixed" :style="{ bottom: commentInputBottom }">
      <!-- 预览图片区域 -->
      <view v-if="selectedImages.length > 0" class="image-preview-area">
        <view 
          v-for="(img, index) in selectedImages" 
          :key="index"
          class="preview-image-container"
        >
          <image :src="img" mode="aspectFill" class="preview-image"></image>
          <view class="remove-image" @click="removeImage(index)">
            <u-icon name="close" size="12" color="#fff"></u-icon>
          </view>
        </view>
      </view>
      
      <view class="comment-input-area">
        <u-input 
          ref="commentInput"
          v-model="commentContent" 
          placeholder="请输入评论内容" 
          type="textarea"
          :auto-height="true"
          class="comment-input"
          :focus="isInputFocused"
          :adjust-position="false"
        ></u-input>
        <view class="comment-actions">
          <view class="image-upload-btn" @click="selectImages">
            <u-icon name="photo" size="20" color="#999"></u-icon>
          </view>
          <u-button 
            type="primary" 
            size="mini" 
            @click="submitComment"
            :disabled="!commentContent.trim() && selectedImages.length === 0"
            class="submit-btn"
          >
            发送
          </u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { imageUrl } from '../../config/config.js';
import { baseUrl } from '../../config/config.js';

export default {
  name: 'ArticleDetail',
  data() {
    return {
      articleId: 0,
      commentContent: '',
      comments: [],
      isInputFocused: false,
      keyboardHeight: 0, // 新增键盘高度变量
      selectedImages: [] // 新增图片选择数组
    }
  },
  computed: {
    ...mapState('article', ['currentArticle']),
    article() {
      return this.currentArticle || {};
    },
    // 计算评论输入框的底部位置
    commentInputBottom() {
      return this.keyboardHeight > 0 ? this.keyboardHeight + 'px' : '0px';
    }
  },
  methods: {
    ...mapActions('article', ['articleById', 'niceArticle', 'collectArticle']),
    ...mapActions('articleComment', ['getArticleComment', 'addArticleComment']),
    
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },
    
    // 完整图片URL
    fullImageUrl(path) {
      // 确保path是字符串类型
      if (!path || typeof path !== 'string') return '';
      // 如果已经是完整URL，直接返回
      if (path.startsWith('http')) {
        return path;
      }
      // 拼接基础URL
      return imageUrl + path;
    },
    
    // 格式化时间
    formatTime(timeStr) {
      const date = new Date(timeStr);
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (minutes < 1) {
        return '刚刚';
      } else if (minutes < 60) {
        return `${minutes}分钟前`;
      } else if (hours < 24) {
        return `${hours}小时前`;
      } else if (days < 30) {
        return `${days}天前`;
      } else {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      }
    },
    
    // 格式化评论时间
    formatCommentTime(timeStr) {
      const date = new Date(timeStr);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    },
    
    // 获取文章详情
    async getArticleDetail() {
      try {
        // 显示加载提示
        uni.showLoading({
          title: '加载中...'
        });
        
        // 获取文章详情
        await this.articleById({ articleId: this.articleId });
        
        // 获取评论列表
        await this.loadComments();
      } catch (error) {
        console.error('获取文章详情失败:', error);
        uni.showToast({
          title: '获取文章详情失败',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
      }
    },
    
    // 加载评论
    async loadComments() {
      try {
        const res = await this.getArticleComment({ 
          articleId: this.articleId,
          currentPage: 1
        });
        if (res.code === 200) {
          // 处理评论数据
          if (res.data && res.data.records) {
            this.comments = res.data.records;
          } else {
            this.comments = [];
          }
        }
      } catch (error) {
        console.error('获取评论失败:', error);
        uni.showToast({
          title: '获取评论失败',
          icon: 'none'
        });
      }
    },
    
    // 切换点赞状态
    async toggleLike() {
      try {
        const res = await this.niceArticle(this.articleId);
        if (res.code === 200) {
          
          // 更新文章的点赞状态和数量
          if (res.data === "取消点赞") {
            this.currentArticle.isNice = false;
            this.currentArticle.nice -= 1;
          } else if (res.data === "点赞成功") {
            this.currentArticle.isNice = true;
            this.currentArticle.nice += 1;
          }
        }
      } catch (error) {
        console.error('点赞操作失败:', error);
        uni.$u.toast('操作失败');
      }
    },
    
    // 切换收藏状态
    async toggleCollect() {
      try {
        const res = await this.collectArticle(this.articleId);
        if (res.code === 200) {
          
          // 更新文章的收藏状态和数量
          if (res.data === "取消收藏") {
            this.currentArticle.isCollect = false;
            this.currentArticle.collect -= 1;
          } else if (res.data === "收藏成功") {
            this.currentArticle.isCollect = true;
            this.currentArticle.collect += 1;
          }
        }
      } catch (error) {
        console.error('收藏操作失败:', error);
        uni.$u.toast('操作失败');
      }
    },
    
    // 选择图片
    selectImages() {
      uni.chooseImage({
        count: 9, // 最多可以选择9张图片
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机
        success: (res) => {
          // 将选择的图片路径添加到selectedImages数组中
          this.selectedImages = [...this.selectedImages, ...res.tempFilePaths];
          // 限制最多9张图片
          if (this.selectedImages.length > 9) {
            this.selectedImages = this.selectedImages.slice(0, 9);
          }
        },
        fail: (err) => {
          console.error('选择图片失败:', err);
          uni.$u.toast('选择图片失败');
        }
      });
    },
    
    // 移除选中的图片
    removeImage(index) {
      this.selectedImages.splice(index, 1);
    },
    
    // 提交评论（使用uni.uploadFile的files参数）
    async submitComment() {
      if (!this.commentContent.trim() && this.selectedImages.length === 0) {
        uni.$u.toast('请输入评论内容或选择图片');
        return;
      }
      
      try {
        // 如果有图片，使用uni.uploadFile的files参数上传
        if (this.selectedImages.length > 0) {
          uni.showLoading({
            title: '提交评论中...'
          });
          
          // 构造formData
          const formData = {
            articleId: this.articleId.toString(), // 确保articleId是字符串
            content: this.commentContent || '' // 确保content是字符串
          };
          var files = [];
          console.log(this.selectedImages);
          for (let i = 0; i < this.selectedImages.length; i++) {
            files.push({
              name: 'sources',
              uri: this.selectedImages[i]
            });
          }
          console.log(files);

          // 使用uni.uploadFile的files参数一次性上传所有图片
          const result = await new Promise((resolve, reject) => {
            uni.uploadFile({
              url: baseUrl + '/article/articleComment/addArticleComment',
              files: files,
              formData: formData,
              header: {
                'Authorization': `${uni.getStorageSync('token')}`
              },
              success: (res) => {
                console.log(res);
                if (res.statusCode === 200) {
                  let data;
                  try {
                    data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
                  } catch (e) {
                    data = res.data;
                  }
                  resolve({
                    success: true,
                    data: data,
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
                console.log(err);
                reject({
                  success: false,
                  message: err.errMsg || '上传失败',
                  code: err.errCode || -1
                });
              }
            });
          });
          console.log(result);
          // 检查上传结果
          if (result.success && result.statusCode === 200) {
            uni.showToast({
              title: '评论成功',
              icon: 'success'
            });
            this.commentContent = '';
            this.selectedImages = []; // 清空选中的图片
            
            // 重新加载评论
            await this.loadComments();
            // 更新文章评论数
            this.currentArticle.commentCount += 1;
          } else {
            throw new Error(result.message || '上传失败');
          }
        } else {
          // 如果没有图片，使用原来的评论方法
          const res = await this.addArticleComment({
            articleId: this.articleId,
            content: this.commentContent
          });
          
          if (res.code === 200) {
            uni.$u.toast('评论成功');
            this.commentContent = '';
            this.selectedImages = []; // 清空选中的图片
            
            // 重新加载评论
            await this.loadComments();
            // 更新文章评论数
            this.currentArticle.commentCount += 1;
          } else {
            throw new Error(res.msg || '提交失败');
          }
        }
      } catch (error) {
        console.error('提交评论失败:', error);
        uni.showToast({
          title: error.message || '提交评论失败',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
      }
    },
    
    // 切换评论点赞状态
    async toggleCommentLike(comment) {
      try {
        // 这里需要调用评论点赞接口，暂时用模拟方式
        uni.$u.toast('评论点赞功能待实现');
        // 实际项目中应该调用相应的API接口
      } catch (error) {
        console.error('评论点赞操作失败:', error);
        uni.$u.toast('操作失败');
      }
    },
    
    // 预览图片
    previewImage(imgPath) {
      uni.previewImage({
        urls: [this.fullImageUrl(imgPath)]
      });
    },
    
    // 聚焦评论输入框
    focusCommentInput() {
      this.isInputFocused = true;
      this.$nextTick(() => {
        this.$refs.commentInput.focus();
      });
    },
    
    // 监听键盘高度变化
    onKeyboardHeightChange(res) {
      this.keyboardHeight = res.height;
    }
  },
  
  async onLoad(options) {
    // 获取传递的文章ID
    if (options.id) {
      this.articleId = parseInt(options.id);
      // 获取文章详情
      await this.getArticleDetail();
    } else {
      uni.showToast({
        title: '参数错误',
        icon: 'none'
      });
      uni.navigateBack();
    }
  },
  
  // 页面显示时监听键盘高度变化
  onShow() {
    // 监听键盘高度变化
    uni.onKeyboardHeightChange(this.onKeyboardHeightChange);
  },
  
  // 页面隐藏时取消监听
  onHide() {
    uni.offKeyboardHeightChange(this.onKeyboardHeightChange);
  },
  
  // 页面卸载时取消监听
  onUnload() {
    uni.offKeyboardHeightChange(this.onKeyboardHeightChange);
  }
}
</script>

<style scoped>
.article-detail-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
  padding-bottom: 70px; /* 为底部评论框留出空间 */
  color: #333;
}

/* 顶部导航 */
.app-header {
  background: linear-gradient(135deg, #4361ee, #3f37c9);
  color: white;
  padding: 10px 15px;
  padding-top: calc(var(--status-bar-height, 0px) + 10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed; /* 固定顶部标题 */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* 提高z-index确保在最上层 */
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.header-back {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 1.2rem;
  cursor: pointer;
}

.header-title {
  font-weight: 600;
  font-size: 1.2rem;
}

.header-actions {
  display: flex;
  gap: 15px;
  width: 20px; /* 与返回按钮宽度一致，保持标题居中 */
}

/* 内容滚动区域 */
.content-container {
  padding: 10px;
  padding-bottom: 20px;
  padding-top: calc(var(--status-bar-height, 0px) + 60px); /* 为固定头部留出空间 */
  height: calc(100vh - 120px); /* 调整高度以适应顶部和底部 */
  position: relative;
}

.content-scroll {
  height: 100%;
}

.section {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 1rem;
  color: #333;
}

.section-title i {
  margin-right: 8px;
}

/* 文章内容区域 */
.article-content {
  background-color: #fff;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.article-user {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  overflow: hidden;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar image {
  width: 100%;
  height: 100%;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-weight: bold;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 2px;
}

.user-school {
  font-size: 0.75rem;
  color: #999;
}

.article-time {
  font-size: 0.75rem;
  color: #999;
}

.article-title {
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 15px;
  line-height: 1.4;
}

/* Markdown内容 */
.markdown-content {
  padding: 10px 0;
  margin-bottom: 15px;
}

/* 点赞收藏等操作 */
.article-actions {
  border-top: 1px solid #eee;
  padding-top: 15px;
  margin-top: 15px;
}

.article-meta {
  display: flex;
  gap: 20px;
  padding: 10px 0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: #999;
  cursor: pointer;
}

/* 评论区域 */
.comments-section {
  background-color: #fff;
}

/* 图片预览区域 */
.image-preview-area {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.preview-image-container {
  position: relative;
  width: 80px;
  height: 80px;
}

.preview-image {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background-color: #ff4d4f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* 评论输入框 */
.comment-input-area {
  display: flex;
  gap: 10px;
  padding: 10px;
  align-items: flex-end; /* 修改为flex-end以确保底部对齐 */
}

.comment-input {
  flex: 1;
  background-color: #f5f5f5;
  border-radius: 20px; /* 调整为圆角 */
  padding: 8px 15px; /* 调整padding */
  min-height: 40px; /* 设置最小高度 */
  font-size: 14px; /* 设置字体大小 */
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.image-upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f5f5f5;
  cursor: pointer;
}

.submit-btn {
  flex-shrink: 0;
  height: 40px; /* 调整按钮高度 */
  width: 60px; /* 设置按钮宽度 */
  font-size: 14px; /* 调整字体大小 */
  border-radius: 20px; /* 调整为圆角 */
}

/* 评论列表 */
.comments-list {
  padding-top: 10px;
}

.comment-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.comment-author {
  display: flex;
  align-items: center;
}

.comment-author .user-avatar {
  width: 32px;
  height: 32px;
  margin-right: 8px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 2px;
}

.comment-time {
  font-size: 0.75rem;
  color: #999;
}

.comment-like {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: #999;
  cursor: pointer;
}

.comment-like .liked {
  color: #4361ee;
}

.comment-content {
  font-size: 0.85rem;
  color: #333;
  line-height: 1.5;
  margin-bottom: 10px;
}

/* 评论图片 */
.comment-images {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.comment-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
}

.comment-image image {
  width: 100%;
  height: 100%;
}

/* 无评论提示 */
.no-comments {
  text-align: center;
  padding: 30px 0;
  color: #999;
  font-size: 0.9rem;
}

/* 评论输入框 - 固定在底部 */
.comment-input-fixed {
  position: fixed;
  left: 0;
  right: 0;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 999; /* 确保输入框在内容之上 */
  transition: bottom 0.3s ease; /* 添加过渡动画 */
}
</style>