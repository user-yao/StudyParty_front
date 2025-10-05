<template>
  <view class="my-articles-container">
    <!-- 顶部导航 -->
    <header class="app-header">
      <div class="header-top">
        <div class="header-back" @click="goBack">
          <u-icon name="arrow-left" size="20" color="#fff"></u-icon>
        </div>
        <div class="header-title">我的文章</div>
        <div class="header-actions">
          <!-- 占位元素，保持居中 -->
        </div>
      </div>
    </header>
    
    <!-- 文章列表 -->
    <view class="articles-list">
      <view 
        v-for="article in articles" 
        :key="article.id"
        class="article-card"
        @click="viewArticleDetail(article.id)"
      >
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
              <view class="user-name">
                {{ article.name }}
              </view>
              <view class="user-school">{{ article.school }}</view>
            </view>
          </view>
          <view class="article-time">
            {{ formatTime(article.createTime) }}
          </view>
        </view>
        
        <view class="article-content">
          <view class="article-title">{{ article.title }}</view>
          <view class="article-summary">{{ article.summary }}</view>
        </view>
        
        <view class="article-meta">
          <view class="meta-item">
            <u-icon name="eye" size="14" color="#999"></u-icon>
            <text>{{ article.viewCount }}</text>
          </view>
          <view class="meta-item">
            <u-icon name="chat" size="14" color="#999"></u-icon>
            <text>{{ article.commentCount }}</text>
          </view>
          <view class="meta-item" @click.stop="toggleLike(article)">
            <u-icon 
              :name="article.isNice ? 'heart-fill' : 'heart'" 
              :color="article.isNice ? '#f00' : '#999'"
              size="14"
            ></u-icon>
            <text>{{ article.nice }}</text>
          </view>
          <view class="meta-item" @click.stop="toggleCollect(article)">
            <u-icon 
              :name="article.isCollect ? 'bookmark-fill' : 'bookmark'" 
              :color="article.isCollect ? '#4361ee' : '#999'"
              size="14"
            ></u-icon>
            <text>{{ article.collect }}</text>
          </view>
        </view>
      </view>
      
      <!-- 无数据提示 -->
      <view v-if="articles.length === 0" class="no-data">
        <u-icon name="file-text" size="40" color="#ccc"></u-icon>
        <text>暂无文章</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex';
import { imageUrl } from '../../config/config.js';

export default {
  name: 'MyArticles',
  data() {
    return {
      articles: []
    }
  },
  onLoad(options) {
    // 从参数中获取文章数据
    if (options.articles) {
      try {
        this.articles = JSON.parse(decodeURIComponent(options.articles));
      } catch (e) {
        console.error('解析文章数据失败:', e);
        this.articles = [];
      }
    }
  },
  methods: {
    ...mapActions('article', ['niceArticle', 'collectArticle']),
    
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
    
    viewArticleDetail(articleId) {
      uni.navigateTo({
        url: `/pages/forum/articleDetail?id=${articleId}`
      });
    },
    
    // 切换点赞状态
    async toggleLike(article) {
      try {
        const res = await this.niceArticle({ articleId: article.id });
        if (res.code === 200) {
          // 更新文章的点赞状态和数量
          if (res.data === "取消点赞") {
            article.isNice = false;
            article.nice -= 1;
          } else if (res.data === "点赞成功") {
            article.isNice = true;
            article.nice += 1;
          }
        }
      } catch (error) {
        console.error('点赞操作失败:', error);
        uni.$u.toast('操作失败');
      }
    },
    
    // 切换收藏状态
    async toggleCollect(article) {
      try {
        const res = await this.collectArticle({ articleId: article.id });
        if (res.code === 200) {
          // 更新文章的收藏状态和数量
          if (res.data === "取消收藏") {
            article.isCollect = false;
            article.collect -= 1;
          } else if (res.data === "收藏成功") {
            article.isCollect = true;
            article.collect += 1;
          }
        }
      } catch (error) {
        console.error('收藏操作失败:', error);
        uni.$u.toast('操作失败');
      }
    }
  }
}
</script>

<style scoped>
.my-articles-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
  padding-bottom: 20px;
  color: #333;
}

/* 顶部导航 */
.app-header {
  background: linear-gradient(135deg, #4361ee, #3f37c9);
  color: white;
  padding: 10px 15px;
  padding-top: calc(var(--status-bar-height, 0px) + 10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.header-back {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {
  font-weight: 600;
  font-size: 1.2rem;
  flex: 1;
  text-align: center;
}

.header-actions {
  width: 30px;
}

/* 文章列表 */
.articles-list {
  padding: 10px;
}

.article-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.article-user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(45deg, #4361ee, #4cc9f0);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1rem;
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
  background: linear-gradient(45deg, #4361ee, #4cc9f0);
  color: white;
  font-weight: bold;
  font-size: 1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.user-school {
  font-size: 0.8rem;
  color: #666;
}

.article-time {
  font-size: 0.8rem;
  color: #999;
  white-space: nowrap;
}

.article-content {
  margin-bottom: 15px;
}

.article-title {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 8px;
  line-height: 1.4;
}

.article-summary {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #eee;
  padding-top: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: #999;
}

/* 身份标识 */
.identity-tag {
  background: #e0e0e0;
  color: #666;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  white-space: nowrap;
}

.me-tag {
  background-color: #f0f0f0;
  color: #666;
}

/* 无数据提示 */
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
  color: #999;
  gap: 15px;
}

.no-data text {
  font-size: 1rem;
}
</style>