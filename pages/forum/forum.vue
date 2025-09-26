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
          <u-icon name="bell" size="20" color="#fff" @click="goToNotifications"></u-icon>
          <u-icon name="search" size="20" color="#fff" @click="goToSearch"></u-icon>
        </div>
      </div>
      
      <div class="search-bar">
        <u-icon name="search" size="16" color="#ccc"></u-icon>
        <input type="text" placeholder="搜索任务、帖子..." @focus="goToSearch">
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
              v-for="task in tasks.slice(0, 5)" 
              :key="task.id"
              class="task-card-horizontal"
              @click="viewTaskDetail(task.id)"
            >
              <view class="task-reward-badge">+{{ task.reward }}积分</view>
              <view class="task-title">{{ task.title }}</view>
              <view class="task-meta">
                <view class="meta-item">
                  <u-icon name="clock" size="12" color="#999"></u-icon>
                  <text>剩余{{ task.timeLeft }}</text>
                </view>
                <view class="meta-item">
                  <u-icon :name="task.publisherType === 'teacher' ? 'man' : 'home'" size="12" color="#999"></u-icon>
                  <text>{{ task.publisher }}</text>
                </view>
              </view>
              <view class="task-tags">
                <view 
                  v-for="(tag, index) in task.tags.slice(0, 2)" 
                  :key="index"
                  class="task-tag"
                >
                  {{ tag }}
                </view>
              </view>
              <view class="task-action">
                <button class="join-btn">立即参与</button>
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
                <view class="user-avatar">
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
        </view>
        
        <!-- 加载更多提示 -->
        <view class="load-more" @click="loadMore">
          <text v-if="!loadingMore">点击加载更多</text>
          <text v-else>加载中...</text>
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
      // 全部使用假数据
      tasks: [
        {
          id: 1,
          title: 'React组件开发挑战',
          reward: 120,
          timeLeft: '2天',
          publisher: '李老师',
          publisherType: 'teacher',
          tags: ['前端开发', 'React', '组件化'],
          participants: [
            { name: '张同学' },
            { name: '王同学' },
            { name: '李同学' },
            { name: '赵同学' },
            { name: '孙同学' }
          ]
        },
        {
          id: 2,
          title: '数据结构算法题解',
          reward: 80,
          timeLeft: '3天',
          publisher: '字节跳动',
          publisherType: 'company',
          tags: ['算法', '数据结构', '面试题'],
          participants: [
            { name: '刘同学' },
            { name: '陈同学' },
            { name: '杨同学' },
            { name: '黄同学' }
          ]
        },
        // 新增假数据
        {
          id: 3,
          title: 'Vue 3项目实战',
          reward: 150,
          timeLeft: '5天',
          publisher: '王教授',
          publisherType: 'teacher',
          tags: ['Vue', '前端框架', '项目实战'],
          participants: [
            { name: '陈同学' },
            { name: '林同学' },
            { name: '郑同学' }
          ]
        },
        {
          id: 4,
          title: '机器学习入门',
          reward: 200,
          timeLeft: '7天',
          publisher: '阿里云',
          publisherType: 'company',
          tags: ['机器学习', 'Python', 'AI'],
          participants: [
            { name: '周同学' },
            { name: '吴同学' },
            { name: '徐同学' },
            { name: '孙同学' },
            { name: '马同学' }
          ]
        },
        {
          id: 5,
          title: '移动端UI设计',
          reward: 90,
          timeLeft: '4天',
          publisher: '设计学院',
          publisherType: 'school',
          tags: ['UI设计', '移动端', '用户体验'],
          participants: [
            { name: '何同学' },
            { name: '邓同学' },
            { name: '冯同学' },
            { name: '韩同学' }
          ]
        }
      ]
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
    ...mapActions('article', ['recommend', 'niceArticle', 'collectArticle']),
    // 获取身份文本
    getIdentityText(status) {
      switch(status) {
        case 1: return '学生';
        case 2: return '老师';
        case 3: return '企业';
        default: return '用户';
      }
    },
    // 获取推荐文章
    async getRecommendArticles() {
      try {
        await this.recommend({ page: 1 });
      } catch (error) {
        console.error('获取推荐文章失败:', error);
        uni.showToast({
          title: '获取推荐文章失败',
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
      uni.showToast({
        title: '搜索功能',
        icon: 'none'
      });
    },
    viewAllTasks() {
      // 跳转到任务列表页面
      uni.navigateTo({
        url: '/pages/chatList/groupTaskList'
      });
    },
    viewTaskDetail(taskId) {
      uni.showToast({
        title: `查看任务 ${taskId}`,
        icon: 'none'
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
    // 加载更多推荐内容
    async loadMore() {
      if (this.loadingMore) return;
      
      this.loadingMore = true;
      
      try {
        // 调用API获取更多数据，修复分页计算
        const nextPage = Math.floor(this.recommendArticles.length / 10) + 1;
        await this.recommend({ page: nextPage });
        this.loadingMore = false;
      } catch (error) {
        console.error('加载更多推荐文章失败:', error);
        uni.showToast({
          title: '加载更多失败',
          icon: 'none'
        });
        this.loadingMore = false;
      }
    }
  },
  async mounted() {
    // 页面加载时获取推荐文章
    await this.getRecommendArticles();
  }
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
  background: linear-gradient(135deg, #ff9a9e, #fad0c4);
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

/* 加载更多 */
.load-more {
  text-align: center;
  padding: 15px;
  color: #4361ee;
  font-size: 0.9rem;
  cursor: pointer;
}
</style>