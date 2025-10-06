<template>
  <view class="search-result-container">
    <!-- 顶部导航 -->
    <header class="app-header">
      <div class="header-top">
        <div class="header-back" @click="goBack">
          <u-icon name="arrow-left" size="20" color="#fff"></u-icon>
        </div>
        <div class="search-input-container">
          <!-- 原生input元素 -->
          <input
            ref="searchInput"
            v-model="searchKeyword"
            placeholder="搜索文章..."
            @confirm="performSearch"
            class="custom-search-input"
          />
        </div>
        <div class="header-actions">
          <text class="search-btn" @click="performSearch">搜索</text>
        </div>
      </div>
    </header>
    
    <!-- 搜索结果区域 -->
    <view class="content-container">
      <!-- 文章搜索结果 -->
      <view class="section">
        <view class="section-header">
          <view class="section-title">
            <u-icon name="file-text" size="18" color="#333"></u-icon>
            <text>文章搜索结果</text>
          </view>
          <view class="section-action">
            <text>找到 {{ articleResults.length }} 条结果</text>
          </view>
        </view>
        
        <view class="article-list">
          <view 
            v-for="result in articleResults" 
            :key="result.id"
            class="article-card"
            @click="viewArticleDetail(result)"
          >
            <view class="article-header">
              <view class="article-user">
                <view class="user-avatar">
                  <image 
                    v-if="result.head" 
                    :src="result.head" 
                    mode="aspectFill"
                  ></image>
                  <view v-else class="avatar-placeholder">
                    {{ result.name ? result.name.substring(0, 1) : 'U' }}
                  </view>
                </view>
                <view class="user-info">
                  <view class="user-name">
                    {{ result.name }}
                    <text 
                      v-if="result.identity === '我'" 
                      class="identity-tag me-tag"
                    >
                      {{ result.identity }}
                    </text>
                    <text 
                      v-else
                      class="identity-tag" 
                      :class="result.isAuthority ? 'authority' : ''"
                    >
                      {{ result.identity || '用户' }}
                    </text>
                  </view>
                  <view class="user-school">{{ result.school }}</view>
                  <view class="user-prestige" v-if="result.starPrestige > 0">
                    声望值: {{ result.starPrestige }}
                  </view>
                </view>
              </view>
              <view class="article-time">
                {{ formatTime(result.createTime) }}
              </view>
            </view>
            
            <view class="article-content">
              <view class="article-title">{{ result.title }}</view>
              <view class="article-summary">{{ result.summary }}</view>
            </view>
            
            <view class="article-meta">
              <view class="meta-item">
                <u-icon name="eye" size="14" color="#999"></u-icon>
                <text>{{ result.viewCount || 0 }}</text>
              </view>
              <view class="meta-item">
                <u-icon name="chat" size="14" color="#999"></u-icon>
                <text>{{ result.commentCount || 0 }}</text>
              </view>
              <view class="meta-item" @click.stop="toggleLike(result)">
                <u-icon 
                  :name="result.isNice ? 'heart-fill' : 'heart'" 
                  :color="result.isNice ? '#f00' : '#999'"
                  size="14"
                ></u-icon>
                <text>{{ result.nice || 0 }}</text>
              </view>
              <view class="meta-item" @click.stop="toggleCollect(result)">
                <u-icon 
                  :name="result.isCollect ? 'bookmark-fill' : 'bookmark'" 
                  :color="result.isCollect ? '#4361ee' : '#999'"
                  size="14"
                ></u-icon>
                <text>{{ result.collect || 0 }}</text>
              </view>
            </view>
          </view>
          
          <!-- 无结果提示 -->
          <view v-if="articleResults.length === 0 && searchCompleted" class="no-results">
            <u-icon name="file-text" size="40" color="#ccc"></u-icon>
            <text>暂无搜索结果</text>
          </view>
        </view>
        
        <!-- 加载更多提示 -->
        <view class="load-more" @click="loadMore" v-if="articleResults.length > 0 && !noMoreData">
          <text v-if="!loadingMore">点击加载更多</text>
          <text v-else>加载中...</text>
        </view>
        
        <!-- 无更多数据提示 -->
        <view class="no-more-data" v-if="articleResults.length > 0 && noMoreData">
          <text>没有更多数据了</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex';
import { imageUrl } from '../../config/config.js';

export default {
  name: 'ArticleSearchResult',
  data() {
    return {
      searchKeyword: '',
      searchCompleted: false,
      loadingMore: false,
      noMoreData: false,
      currentPage: 1,
      totalPages: 1,
      articleResults: []
    }
  },
  
  onLoad(options) {
    // 获取传递的搜索关键词
    if (options.keyword) {
      this.searchKeyword = decodeURIComponent(options.keyword);
      // 自动执行搜索
      this.performSearch();
    }
  },
  
  methods: {
    ...mapActions('article', ['searchArticle', 'niceArticle', 'collectArticle']),
    
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },
    
    // 执行搜索
    async performSearch() {
      if (!this.searchKeyword.trim()) {
        uni.showToast({
          title: '请输入搜索关键词',
          icon: 'none'
        });
        return;
      }
      
      this.searchCompleted = false;
      this.noMoreData = false;
      this.currentPage = 1;
      
      try {
        const res = await this.searchArticle({ 
          searchContext: this.searchKeyword,
          currentPage: this.currentPage
        });
        
        if (res.code === 200) {
          // 更新分页信息
          this.totalPages = res.data.pages || 1;
          
          // 处理搜索结果
          this.articleResults = res.data.records.map(item => ({
            ...item,
            type: 'article',
            head: item.head ? imageUrl + item.head : null,
            identity: this.getIdentityText(item.status),
            isAuthority: item.starPrestige > 100,
            isNice: item.isNice || false,
            isCollect: item.isCollect || false,
            viewCount: item.viewCount || 0,
            commentCount: item.commentCount || 0,
            nice: item.nice || 0,
            collect: item.collect || 0,
            starPrestige: item.starPrestige || 0
          }));
          
          // 检查是否还有更多数据
          if (this.currentPage >= this.totalPages) {
            this.noMoreData = true;
          }
        } else {
          throw new Error(res.msg || '搜索失败');
        }
      } catch (error) {
        console.error('搜索失败:', error);
        uni.showToast({
          title: error.message || '搜索失败',
          icon: 'none'
        });
        this.articleResults = [];
        this.noMoreData = true;
      } finally {
        this.searchCompleted = true;
      }
    },
    
    // 加载更多搜索结果
    async loadMore() {
      if (this.loadingMore || this.noMoreData) return;
      
      this.loadingMore = true;
      
      try {
        const nextPage = this.currentPage + 1;
        
        const res = await this.searchArticle({ 
          searchContext: this.searchKeyword,
          currentPage: nextPage
        });
        
        if (res && res.code === 200) {
          this.currentPage = nextPage;
          this.totalPages = res.data.pages || 1;
          
          if (res.data && Array.isArray(res.data.records) && res.data.records.length > 0) {
            const moreResults = res.data.records.map(item => ({
              ...item,
              type: 'article',
              head: item.head ? imageUrl + item.head : null,
              identity: this.getIdentityText(item.status),
              isAuthority: item.starPrestige > 100,
              isNice: item.isNice || false,
              isCollect: item.isCollect || false,
              viewCount: item.viewCount || 0,
              commentCount: item.commentCount || 0,
              nice: item.nice || 0,
              collect: item.collect || 0,
              starPrestige: item.starPrestige || 0
            }));
            
            this.articleResults = [...this.articleResults, ...moreResults];
            
            if (this.currentPage >= this.totalPages) {
              this.noMoreData = true;
            }
          } else {
            this.noMoreData = true;
          }
        } else {
          throw new Error(res.msg || '加载失败');
        }
      } catch (error) {
        console.error('加载更多搜索结果失败:', error);
        uni.showToast({
          title: '加载更多失败',
          icon: 'none'
        });
      } finally {
        this.loadingMore = false;
      }
    },
    
    // 查看文章详情
    viewArticleDetail(article) {
      uni.navigateTo({
        url: `/pages/forum/articleDetail?id=${article.id}`
      });
    },
    
    // 获取身份文本
    getIdentityText(status) {
      switch(status) {
        case 1: return '学生';
        case 2: return '老师';
        case 3: return '企业';
        default: return '用户';
      }
    },
    
    // 切换点赞状态
    async toggleLike(article) {
      try {
        const res = await this.niceArticle(article.id);
        if (res.code === 200) {
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
        const res = await this.collectArticle(article.id);
        if (res.code === 200) {
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
    }
  }
}
</script>

<style scoped>
.search-result-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
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
  gap: 10px;
}

.header-back {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
}

.search-input-container {
  flex: 1;
}

.custom-search-input {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 10px 15px 10px 20px;
  height: 36px;
  border: none;
  outline: none;
  color: white;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}

.custom-search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-btn {
  font-size: 0.9rem;
  color: #fff;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
}

/* 内容区域 */
.content-container {
  padding: 10px;
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

.section-action {
  display: flex;
  align-items: center;
  color: #999;
  font-size: 0.85rem;
  gap: 4px;
}

/* 文章列表 */
.article-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.article-card {
  background: #fafafa;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
  cursor: pointer;
}

.article-card:last-child {
  margin-bottom: 0;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.article-user {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 8px;
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
  display: flex;
  align-items: center;
}

.identity-tag {
  background: #e0e0e0;
  color: #666;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  margin-left: 8px;
  white-space: nowrap;
}

.identity-tag.authority {
  background: linear-gradient(135deg, #ffd700, #ffa500);
  color: #fff;
}

.me-tag {
  background-color: #f0f0f0;
  color: #666;
}

.user-school {
  font-size: 0.75rem;
  color: #999;
}

.user-prestige {
  font-size: 0.7rem;
  color: #ff9800;
  margin-top: 2px;
}

.article-time {
  font-size: 0.75rem;
  color: #999;
}

.article-content {
  margin-bottom: 12px;
}

.article-title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 6px;
  line-height: 1.4;
}

.article-summary {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.5;
}

.article-meta {
  display: flex;
  gap: 15px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: #999;
  cursor: pointer;
}

/* 无结果提示 */
.no-results {
  text-align: center;
  padding: 30px 0;
  color: #999;
}

.no-results i {
  font-size: 2rem;
  margin-bottom: 10px;
  display: block;
}

/* 加载更多 */
.load-more {
  text-align: center;
  padding: 15px;
  color: #4361ee;
  font-size: 0.9rem;
  cursor: pointer;
}

/* 无更多数据提示 */
.no-more-data {
  text-align: center;
  padding: 15px;
  color: #999;
  font-size: 0.9rem;
}
</style>