<template>
  <view class="search-container">
    <!-- 顶部导航 -->
    <header class="app-header">
      <div class="header-top">
        <div class="header-back" @click="goBack">
          <u-icon name="arrow-left" size="20" color="#fff"></u-icon>
        </div>
        <div class="search-input-container">
          <u--input
            ref="searchInput"
            v-model="searchKeyword"
            placeholder="搜索任务、帖子、用户..."
            border="none"
            shape="circle"
            clearable
            @confirm="performSearch"
            @clear="clearSearch"
            class="search-input"
          ></u--input>
        </div>
        <div class="header-actions">
          <text class="search-btn" @click="performSearch">搜索</text>
        </div>
      </div>
    </header>
    
    <!-- 搜索内容区域 -->
    <view class="content-container" v-if="!searching">
      <!-- 热门搜索 -->
      <view class="section" v-if="recentSearches.length === 0">
        <view class="section-header">
          <view class="section-title">
            <u-icon name="fire" size="18" color="#ff6b6b"></u-icon>
            <text>热门搜索</text>
          </view>
        </view>
        <view class="hot-search-tags">
          <view 
            v-for="(tag, index) in hotSearchTags" 
            :key="index"
            class="hot-tag"
            @click="searchByTag(tag)"
          >
            {{ tag }}
          </view>
        </view>
      </view>
      
      <!-- 最近搜索 -->
      <view class="section" v-else>
        <view class="section-header">
          <view class="section-title">
            <u-icon name="clock" size="18" color="#333"></u-icon>
            <text>最近搜索</text>
          </view>
          <view class="section-action" @click="clearAllRecentSearches">
            <u-icon name="trash" size="16" color="#999"></u-icon>
            <text>清空</text>
          </view>
        </view>
        <view class="recent-search-tags">
          <view 
            v-for="(search, index) in recentSearches" 
            :key="index"
            class="recent-tag"
            @click="searchByTag(search)"
          >
            <u-icon name="clock" size="14" color="#999"></u-icon>
            <text>{{ search }}</text>
          </view>
        </view>
      </view>
      
      <!-- 搜索历史 -->
      <view class="section">
        <view class="section-header">
          <view class="section-title">
            <u-icon name="search" size="18" color="#333"></u-icon>
            <text>搜索历史</text>
          </view>
        </view>
        <view class="search-history">
          <view 
            v-for="(item, index) in searchHistory" 
            :key="index"
            class="history-item"
            @click="searchByTag(item.keyword)"
          >
            <u-icon name="search" size="16" color="#999"></u-icon>
            <text class="history-text">{{ item.keyword }}</text>
            <text class="history-time">{{ formatTime(item.time) }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 搜索结果区域 -->
    <view class="content-container" v-else>
      <!-- 搜索结果 -->
      <view class="section">
        <view class="section-header">
          <view class="section-title">
            <u-icon name="file-text" size="18" color="#333"></u-icon>
            <text>搜索结果</text>
          </view>
          <view class="section-action">
            <text>找到 {{ searchResults.length }} 条结果</text>
          </view>
        </view>
        
        <view class="article-list">
          <view 
            v-for="result in searchResults" 
            :key="result.id"
            class="article-card"
            @click="viewResultDetail(result)"
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
          <view v-if="searchResults.length === 0 && searchCompleted" class="no-results">
            <u-icon name="file-text" size="40" color="#ccc"></u-icon>
            <text>暂无搜索结果</text>
          </view>
        </view>
        
        <!-- 加载更多提示 -->
        <view class="load-more" @click="loadMore" v-if="searchResults.length > 0 && !noMoreData">
          <text v-if="!loadingMore">点击加载更多</text>
          <text v-else>加载中...</text>
        </view>
        
        <!-- 无更多数据提示 -->
        <view class="no-more-data" v-if="searchResults.length > 0 && noMoreData">
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
  name: 'Search',
  data() {
    return {
      searchKeyword: '',
      searching: false,
      searchCompleted: false,
      loadingMore: false, // 添加加载更多状态
      noMoreData: false, // 添加无更多数据标志
      currentPage: 1, // 当前页码
      totalPages: 1, // 总页数
      recentSearches: [],
      searchResults: [],
      hotSearchTags: [
        'React开发',
        'Vue项目',
        '算法题解',
        'UI设计',
        '机器学习',
        '前端面试',
        '后端架构',
        '移动开发'
      ],
      searchHistory: []
    }
  },
  onLoad() {
    // 页面加载时获取最近搜索记录
    this.loadRecentSearches();
    this.loadSearchHistory();
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
      
      this.searching = true;
      this.searchCompleted = false;
      this.noMoreData = false; // 重置无更多数据标志
      this.currentPage = 1; // 重置页码
      
      try {
        // 调用store中的searchArticle方法进行搜索
        // 根据API要求，参数应该是 { searchContext: keyword, currentPage: 1 }
        const res = await this.searchArticle({ 
          searchContext: this.searchKeyword,
          currentPage: this.currentPage
        });
        
        if (res.code === 200) {
          // 添加到最近搜索
          this.addRecentSearch(this.searchKeyword);
          
          // 处理搜索结果
          // 根据返回格式: { data: { records: [...], total, size, current, pages } }
          if (res.data && Array.isArray(res.data.records)) {
            // 更新分页信息
            this.totalPages = res.data.pages || 1;
            
            // 处理搜索结果，添加头像路径拼接和其他字段
            this.searchResults = res.data.records.map(item => ({
              ...item,
              type: 'article', // 默认为文章类型
              // 拼接完整的头像URL
              head: item.head ? imageUrl + item.head : null,
              // 添加缺失的字段以匹配论坛推荐内容的显示
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
            this.searchResults = [];
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
        this.searchResults = [];
        this.noMoreData = true;
      } finally {
        this.searchCompleted = true;
      }
    },
    
    // 根据标签搜索
    searchByTag(tag) {
      this.searchKeyword = tag;
      this.performSearch();
    },
    
    // 清空搜索
    clearSearch() {
      this.searchKeyword = '';
      this.searching = false;
      this.searchResults = [];
      this.searchCompleted = false;
    },
    
    // 加载最近搜索
    loadRecentSearches() {
      try {
        const searches = uni.getStorageSync('recentSearches') || [];
        this.recentSearches = searches.slice(0, 10); // 只显示最近10条
      } catch (error) {
        console.error('加载最近搜索失败:', error);
      }
    },
    
    // 添加最近搜索
    addRecentSearch(keyword) {
      // 添加到最近搜索
      if (!this.recentSearches.includes(keyword)) {
        this.recentSearches.unshift(keyword);
        if (this.recentSearches.length > 10) {
          this.recentSearches = this.recentSearches.slice(0, 10);
        }
        uni.setStorageSync('recentSearches', this.recentSearches);
      }
      
      // 添加到搜索历史
      const historyItem = {
        keyword: keyword,
        time: new Date().getTime()
      };
      this.searchHistory.unshift(historyItem);
      if (this.searchHistory.length > 20) {
        this.searchHistory = this.searchHistory.slice(0, 20);
      }
      uni.setStorageSync('searchHistory', this.searchHistory);
    },
    
    // 清空所有最近搜索
    clearAllRecentSearches() {
      uni.showModal({
        title: '确认清空',
        content: '确定要清空所有搜索记录吗？',
        success: (res) => {
          if (res.confirm) {
            this.recentSearches = [];
            this.searchHistory = [];
            uni.removeStorageSync('recentSearches');
            uni.removeStorageSync('searchHistory');
            uni.showToast({
              title: '已清空搜索记录',
              icon: 'success'
            });
          }
        }
      });
    },
    
    // 加载搜索历史
    loadSearchHistory() {
      try {
        const history = uni.getStorageSync('searchHistory') || [];
        this.searchHistory = history.slice(0, 20); // 只显示最近20条
      } catch (error) {
        console.error('加载搜索历史失败:', error);
      }
    },
    
    // 查看结果详情
    viewResultDetail(result) {
      switch (result.type) {
        case 'article':
          uni.navigateTo({
            url: `/pages/forum/articleDetail?id=${result.id}`
          });
          break;
        case 'task':
          uni.navigateTo({
            url: `/pages/chatList/groupTaskDetail?taskId=${result.id}`
          });
          break;
        default:
          uni.navigateTo({
            url: `/pages/forum/articleDetail?id=${result.id}`
          });
      }
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
    
    // 获取结果类型文本
    getResultType(type) {
      switch (type) {
        case 'article': return '文章';
        case 'task': return '任务';
        case 'user': return '用户';
        default: return '其他';
      }
    },
    
    // 切换点赞状态
    async toggleLike(article) {
      try {
        const res = await this.niceArticle(article.id);
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
        const res = await this.collectArticle(article.id);
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
    },
    
    // 加载更多搜索结果
    async loadMore() {
      // 如果正在加载或没有更多数据，则不执行
      if (this.loadingMore || this.noMoreData) return;
      
      this.loadingMore = true;
      
      try {
        // 计算下一页页码
        const nextPage = this.currentPage + 1;
        
        // 调用API获取更多数据
        const res = await this.searchArticle({ 
          searchContext: this.searchKeyword,
          currentPage: nextPage
        });
        
        // 检查返回的数据
        if (res && res.code === 200) {
          // 更新分页信息
          this.currentPage = nextPage;
          this.totalPages = res.data.pages || 1;
          
          // 检查是否有更多数据
          if (res.data && Array.isArray(res.data.records) && res.data.records.length > 0) {
            // 处理更多搜索结果，添加头像路径拼接和其他字段
            const moreResults = res.data.records.map(item => ({
              ...item,
              type: 'article', // 默认为文章类型
              // 拼接完整的头像URL
              head: item.head ? imageUrl + item.head : null,
              // 添加缺失的字段以匹配论坛推荐内容的显示
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
            
            // 添加到现有结果中
            this.searchResults = [...this.searchResults, ...moreResults];
            
            // 检查是否还有更多数据
            if (this.currentPage >= this.totalPages) {
              this.noMoreData = true;
            }
          } else {
            // 没有更多数据
            this.noMoreData = true;
          }
        } else {
          // API调用失败
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
.search-container {
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
  padding: 8px; /* 增加点击区域 */
}

.search-input-container {
  flex: 1;
}

.search-input {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 10px 15px; /* 增加内边距 */
  height: 36px; /* 设置固定高度 */
}

.search-btn {
  font-size: 0.9rem;
  color: #fff;
  padding: 8px 12px; /* 增加内边距 */
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

.section-title i {
  margin-right: 8px;
}

.section-action {
  display: flex;
  align-items: center;
  color: #999;
  font-size: 0.85rem;
  cursor: pointer;
  gap: 4px;
}

/* 热门搜索标签 */
.hot-search-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hot-tag {
  background: #f0f0f0;
  color: #333;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
}

/* 最近搜索标签 */
.recent-search-tags {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recent-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: #f8f9fa;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
}

/* 搜索历史 */
.search-history {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.history-item:last-child {
  border-bottom: none;
}

.history-text {
  flex: 1;
  font-size: 0.95rem;
  color: #333;
}

.history-time {
  font-size: 0.8rem;
  color: #999;
}

/* 搜索结果 */
.search-results {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.result-item {
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
  cursor: pointer;
}

/* 搜索结果 */
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
