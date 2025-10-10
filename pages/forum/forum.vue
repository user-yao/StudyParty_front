<template>
  <view class="forum-container">
    <!-- 顶部导航 -->
    <header class="app-header">
      <div class="header-top">
        <div class="logo">
          <u-icon name="chat" size="24" color="#fff"></u-icon>
          <span>学习社区</span>
        </div>
        <div class="header-actions">
          <u-icon name="plus" size="20" color="#fff" @click="goToAddArticle"></u-icon>
          <u-icon name="search" size="20" color="#fff" @click="goToSearch"></u-icon>
        </div>
      </div>
      
      <div class="search-bar" @click="goToSearch">
        <u-icon name="search" size="16" color="#ccc"></u-icon>
        <input type="text" placeholder-style="color:#fff" placeholder="搜索任务、帖子...">
      </div>
    </header>
    
    <!-- 社区内容 -->
    <view class="community-container">
      <!-- 任务模块 -->
      <view class="section">
        <view class="section-header">
          <view class="section-title">
            <u-icon name="order" size="18" color="#333"></u-icon>
            <text>任务列表</text>
          </view>
          <view class="section-action" @click="viewAllTasks">
            <text>更多</text>
          </view>
        </view>
        
        <!-- 横向任务列表 -->
        <scroll-view scroll-x class="task-scroll">
          <view class="task-list-horizontal">
            <view 
              v-for="task in tasks" 
              :key="task.id"
              class="task-card-horizontal"
            >
              <view class="task-reward-badge" v-if="task.starPrestige > 0">+{{ task.starPrestige }}声望</view>
              <view class="task-title">{{ task.title }}</view>
              <view class="task-meta">
                <view class="meta-item">
                  <u-icon name="clock" size="12" color="#999"></u-icon>
                  <text :class="getStatusClass(task)">{{ task.isOver === 1 ? '已解决' : '未解决' }}</text>
                </view>
                <view class="meta-item">
                  <view class="task-user-avatar">
                    <image 
                    @click="goToUserProfile(task.uploader)"
                      v-if="task.head" 
                      :src="fullImageUrl(task.head)" 
                      mode="aspectFill"
                    ></image>
                    <view v-else class="avatar-placeholder">
                      {{ task.name ? task.name.substring(0, 1) : 'U' }}
                    </view>
                  </view>
                  <text>{{ task.name }}</text>
                  <u-tag 
                    :type="getPublisherTagType(task.status)" 
                    size="mini" 
                    :plain="true" 
                    :show="true"
                  >
                    {{ task.identity }}
                  </u-tag>
                </view>
              </view>
              <view class="task-tags">
                <view 
                  v-for="(tag, index) in task.tags" 
                  :key="index"
                  class="task-tag"
                >
                  {{ tag }}
                </view>
              </view>
              <view class="task-action">
                <button class="join-btn small" 
              @click="viewTaskDetail(task.id)"
                >查看详情</button>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
      
      <!-- 论坛推荐模块 -->
      <view class="section">
        <view class="section-header">
          <view class="section-title">
            <u-icon name="star" size="18" color="#333"></u-icon>
            <text>推荐内容</text>
          </view>
        </view>
        
        <view class="article-list">
          <view 
            v-for="article in recommendedArticles" 
            :key="article.id"
            class="article-card"
            @click="viewArticleDetail(article.id)"
          >
            <view class="article-header">
              <view class="article-user">
                <view class="user-avatar" @click.stop="goToUserProfile(article.uploader)">
                  <image 
                    
                    v-if="article.head" 
                    :src="article.head" 
                    mode="aspectFill"
                  ></image>
                  <view v-else class="avatar-placeholder">
                    {{ article.name ? article.name.substring(0, 1) : 'U' }}
                  </view>
                </view>
                <view class="user-info">
                  <view class="user-name">
                    {{ article.name }}
                    <text 
                      v-if="article.identity === '我'" 
                      class="identity-tag me-tag"
                    >
                      {{ article.identity }}
                    </text>
                    <text 
                      v-else
                      class="identity-tag" 
                      :class="article.isAuthority ? 'authority' : ''"
                    >
                      {{ article.identity }}
                    </text>
                  </view>
                  <view class="user-school">{{ article.school }}</view>
                  <view class="user-prestige" v-if="article.starPrestige > 0">
                    声望值: {{ article.starPrestige }}
                  </view>
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
          <view v-if="recommendedArticles.length === 0 && !loadingMore" class="no-data">
            <u-icon name="file-text" size="40" color="#ccc"></u-icon>
            <text>暂无推荐内容</text>
          </view>
        </view>
        
        <!-- 加载更多提示 -->
        <view class="load-more" @click="loadMore" v-if="recommendedArticles.length > 0">
          <text v-if="!loadingMore && !noMoreData">点击加载更多</text>
          <text v-else-if="loadingMore">加载中...</text>
          <text v-else>无更多推荐内容</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { imageUrl } from '../../config/config.js';

export default {
  name: 'Forum',
  data() {
    return {
      loadingMore: false,
      noMoreData: false, // 添加无更多数据标志
      // 移除假数据，使用从API获取的数据
      tasks: []
    }
  },
  computed: {
    ...mapState('article', ['recommendArticles']),
    // 处理推荐文章数据，添加完整的头像URL和身份标识
    recommendedArticles() {
      return this.recommendArticles.map(article => {
        // 判断是否为当前用户发布的文章
        const isCurrentUser = article.uploader === uni.getStorageSync('user').id;
        
        return {
          ...article,
          // 拼接完整的头像URL
          head: article.head ? imageUrl + article.head : null,
          // 根据是否为当前用户确定身份标识
          identity: isCurrentUser ? '我' : this.getIdentityText(article.status),
          // 是否为权威用户（声望值大于100）
          isAuthority: article.starPrestige > 100
        };
      });
    }
  },
  methods: {
    ...mapActions('article', ['recommend', 'niceArticle', 'collectArticle', 'clearRecommendArticles']),
    ...mapActions('task', { recommendTask: 'recommend', clearRecommendTasks: 'clearRecommendTasks' }), // 正确映射task模块的recommend方法
    
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
    
    // 获取身份标识图标
    getIdentityIcon(status) {
      switch(status) {
        case 1: return 'account'; // 学生
        case 2: return 'teacher'; // 老师
        case 3: return 'building'; // 企业
        default: return 'account';
      }
    },
    
    // 获取发布者标签类型
    getPublisherTagType(status) {
      switch(status) {
        case 1: return 'info'; // 学生 - 灰色
        case 2: return 'primary'; // 老师 - 蓝色
        case 3: return 'success'; // 企业 - 绿色
        default: return 'info';
      }
    },
    
    // 获取状态类名
    getStatusClass(task) {
      return task.isOver === 1 ? 'status-completed' : 'status-pending';
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
    // 获取发布者类型文本
    getPublisherType(status) {
      switch(status) {
        case 1: return 'student';
        case 2: return 'teacher';
        case 3: return 'company';
        default: return 'user';
      }
    },
    // 获取发布者图标
    getPublisherIcon(status) {
      switch(status) {
        case 2: return 'man'; // 老师
        case 3: return 'home'; // 企业
        case 1: return 'man'; // 学生
        default: return 'man';
      }
    },
    // 获取推荐文章
    async getRecommendArticles() {
      try {
        await this.recommend({ page: 1 });
        this.noMoreData = false; // 重置无更多数据标志
      } catch (error) {
        console.error('获取推荐文章失败:', error);
        uni.showToast({
          title: '获取推荐文章失败',
          icon: 'none'
        });
      }
    },
    // 获取推荐任务
    async getRecommendTasks() {
      try {
        const res = await this.recommendTask({ currentPage: 1 });
        if (res && res.code === 200 && res.data && Array.isArray(res.data.records)) {
          this.tasks = res.data.records.map(task => {
            // 判断是否为当前用户发布的任务
            const isCurrentUser = task.uploader === uni.getStorageSync('user').id;
            
            return {
              ...task,
              head: task.head ? imageUrl + task.head : null,
              // 根据是否为当前用户确定身份标识
              identity: isCurrentUser ? '我' : this.getIdentityText(task.status),
              isAuthority: task.starPrestige > 100,
              // 使用学校作为标签
              tags: task.school ? [task.school] : []
            };
          });
        }
      } catch (error) {
        console.error('获取推荐任务失败:', error);
        uni.showToast({
          title: '获取推荐任务失败',
          icon: 'none'
        });
      }
    },
    goToNotifications() {
      uni.showToast({
        title: '查看通知',
        icon: 'none'
      });
    },
    goToSearch() {
      uni.navigateTo({
        url: '/pages/search/search'
      });
    },
    viewAllTasks() {
      // 跳转到任务列表页面
      uni.navigateTo({
        url: '/pages/chatList/taskList'
      });
    },
    // 查看任务详情
    viewTaskDetail(taskId) {
      // 跳转到任务详情页面
      uni.navigateTo({
        url: `/pages/chatList/taskDetail?id=${taskId}`
      });
    },
    viewArticleDetail(articleId) {
      uni.navigateTo({
        url: `/pages/forum/articleDetail?id=${articleId}`
      });
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
    // 切换点赞状态
    async toggleLike(article) {
      try {
        const res = await this.niceArticle(article.id);
        if (res.code === 200) {
          console.log(res)
          
          // 通过Vuex更新文章的点赞状态和数量
          const isNice = res.data === "取消点赞" ? false : true;
          this.$store.commit('article/UPDATE_ARTICLE_LIKE', { 
            articleId: article.id, 
            isNice: isNice 
          });
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
          
          // 通过Vuex更新文章的收藏状态和数量
          const isCollect = res.data === "取消收藏" ? false : true;
          this.$store.commit('article/UPDATE_ARTICLE_FAVORITE', { 
            articleId: article.id, 
            isCollect: isCollect 
          });
        }
      } catch (error) {
        console.error('收藏操作失败:', error);
        uni.$u.toast('操作失败');
      }
    },
    // 加载更多推荐内容
    async loadMore() {
      // 如果正在加载或没有更多数据，则不执行
      if (this.loadingMore || this.noMoreData) return;
      
      this.loadingMore = true;
      
      try {
        // 计算下一页页码
        const currentPage = Math.ceil(this.recommendArticles.length / 10) || 1;
        const nextPage = currentPage + 1;
        
        // 调用API获取更多数据
        const res = await this.recommend({ page: nextPage });
        
        // 检查返回的数据
        if (res && res.code === 200) {
          // 检查是否有更多数据
          if (res.data && Array.isArray(res.data.records) && res.data.records.length > 0) {
            // 有数据，正常处理
            console.log('加载了更多数据:', res.data.records.length, '条');
          } else {
            // 没有更多数据
            this.noMoreData = true;
            uni.showToast({
              title: '无更多推荐内容',
              icon: 'none'
            });
          }
        } else {
          // API调用失败
          throw new Error(res.msg || '加载失败');
        }
      } catch (error) {
        console.error('加载更多推荐文章失败:', error);
        uni.showToast({
          title: '加载更多失败',
          icon: 'none'
        });
      } finally {
        this.loadingMore = false;
      }
    },
    
    // 跳转到写文章页面
    goToAddArticle() {
      uni.navigateTo({
        url: '/pages/forum/addArticle'
      });
    },
    
    // 跳转到用户信息页面
    goToUserProfile(userId) {
      
        // 跳转到其他用户的个人信息页面，使用eventChannel传递数据
        uni.navigateTo({
          url: '/pages/userInfo/userInfo',
          success: (res) => {
            res.eventChannel.emit('chatData', { id: userId });
          }
        });
    },
    
    // 处理任务状态更新事件
    handleTaskStatusUpdated(data) {
      // 更新本地任务数据
      this.tasks = this.tasks.map(task => {
        if (task.id === data.taskId) {
          return {
            ...task,
            isOver: data.isOver,
            trueId: data.trueAnswerId
          };
        }
        return task;
      });
    },
    
    // 处理文章点赞状态变化
    handleArticleLikeChanged(data) {
      // 更新推荐文章中的点赞状态
      this.$store.commit('article/UPDATE_ARTICLE_LIKE', {
        articleId: data.articleId,
        isNice: data.isNice
      });
    },
    
    // 处理文章收藏状态变化
    handleArticleCollectChanged(data) {
      // 更新推荐文章中的收藏状态
      this.$store.commit('article/UPDATE_ARTICLE_FAVORITE', {
        articleId: data.articleId,
        isCollect: data.isCollect
      });
    },
    
    // 获取推荐任务
    async getRecommendTasks() {
      try {
        const res = await this.recommendTask({ currentPage: 1 });
        if (res && res.code === 200 && res.data && Array.isArray(res.data.records)) {
          this.tasks = res.data.records.map(task => {
            // 判断是否为当前用户发布的任务
            const isCurrentUser = task.uploader === uni.getStorageSync('user').id;
            
            return {
              ...task,
              head: task.head ? imageUrl + task.head : null,
              // 根据是否为当前用户确定身份标识
              identity: isCurrentUser ? '我' : this.getIdentityText(task.status),
              isAuthority: task.starPrestige > 100,
              // 使用学校作为标签
              tags: task.school ? [task.school] : []
            };
          });
        }
      } catch (error) {
        console.error('获取推荐任务失败:', error);
        uni.showToast({
          title: '获取推荐任务失败',
          icon: 'none'
        });
      }
    },
  },
  async mounted() {
    // 页面加载时获取推荐文章和推荐任务
    await this.getRecommendArticles();
    await this.getRecommendTasks(); // 调用获取推荐任务的方法
    
    // 监听任务状态更新事件
    uni.$on('taskStatusUpdated', this.handleTaskStatusUpdated);
    
    // 监听文章点赞状态变化
    uni.$on('articleLikeChanged', this.handleArticleLikeChanged);
    
    // 监听文章收藏状态变化
    uni.$on('articleCollectChanged', this.handleArticleCollectChanged);
  },
  // 页面显示时检查数据，确保退出登录后重新登录不会重复添加数据
  onShow() {
    // 每次页面显示时都重新获取任务数据，确保状态是最新的
    this.getRecommendTasks();
    
    // 如果推荐文章为空，重新获取数据
    if (this.recommendArticles.length === 0) {
      this.getRecommendArticles();
    }
  },
  // 页面销毁前移除事件监听
  beforeDestroy() {
    uni.$off('taskStatusUpdated', this.handleTaskStatusUpdated);
    uni.$off('articleLikeChanged', this.handleArticleLikeChanged);
    uni.$off('articleCollectChanged', this.handleArticleCollectChanged);
  },
}
</script>

<style scoped>
.forum-container {
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

.logo {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 1.2rem;
}

.logo i {
  margin-right: 8px;
  font-size: 1.4rem;
}

.header-actions {
  display: flex;
  gap: 15px;
}

.header-actions i {
  font-size: 1.1rem;
  cursor: pointer;
}

.search-bar {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-bar input {
  background: transparent;
  border: none;
  color: #fff;
  width: 100%;
  padding: 0 8px;
  outline: none;
  font-size: 0.9rem;
}

.search-bar input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

/* 社区内容区域 */
.community-container {
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
  color: #4361ee;
  font-size: 0.85rem;
  cursor: pointer;
}

/* 横向任务列表 */
.task-scroll {
  width: 100%;
  white-space: nowrap;
}

.task-list-horizontal {
  display: inline-block;
  padding: 5px 0;
}

.task-card-horizontal {
  display: inline-block;
  width: 200px;
  background: #fafafa;
  border-radius: 8px;
  padding: 15px;
  margin-right: 12px;
  cursor: pointer;
  vertical-align: top;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
}

.task-card-horizontal:last-child {
  margin-right: 0;
}

.task-reward-badge {
  background: #4361ee;
  color: white;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 10px;
}

.task-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.4;
  min-height: 40px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-meta {
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: #999;
  margin-bottom: 5px;
}

.meta-item:last-child {
  margin-bottom: 0;
}

.meta-item i {
  margin-right: 4px;
  font-size: 0.75rem;
}

.task-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.task-tag {
  background: #eef7ff;
  color: #4361ee;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
}

.task-action {
  text-align: center;
}

.join-btn {
  background: #4361ee;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 6px 15px;
  font-size: 0.85rem;
  cursor: pointer;
  width: 100%;
}

.join-btn.small {
  padding: 4px 10px;
  font-size: 0.8rem;
}

/* 推荐文章卡片 */
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
  width: 40px;
  height: 40px;
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

/* 任务状态样式 */
.status-completed {
  color: #28a745;
  font-weight: 600;
}

.status-pending {
  color: #dc3545;
  font-weight: 600;
}

/* 加载更多 */
.load-more {
  text-align: center;
  padding: 15px;
  color: #4361ee;
  font-size: 0.9rem;
  cursor: pointer;
}

/* 无数据提示 */
.no-data {
  text-align: center;
  padding: 30px 0;
  color: #999;
}

.no-data i {
  font-size: 2rem;
  margin-bottom: 10px;
  display: block;
}

.task-user-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 5px;
  overflow: hidden;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.task-user-avatar image {
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
  font-size: 12px;
}
</style>