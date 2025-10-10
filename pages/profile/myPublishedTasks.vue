<template>
  <view class="my-published-tasks-container">
    <!-- 顶部导航 -->
    <header class="app-header">
      <div class="header-top">
        <div class="header-back" @click="goBack">
          <u-icon name="arrow-left" size="20" color="#fff"></u-icon>
        </div>
        <div class="header-title">我发布的任务</div>
        <div class="header-actions">
          <!-- 可以添加其他操作按钮 -->
        </div>
      </div>
    </header>
    
    <!-- 内容区域 -->
    <view class="content-container">
      <!-- 加载状态 -->
      <view v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在加载任务...</p>
      </view>
      
      <!-- 任务列表 -->
      <view v-else>
        <!-- 个人任务 -->
        <view class="task-section" v-if="userTasks.length > 0">
          <view class="section-header">
            <view class="section-title">
              <u-icon name="order" size="18" color="#333"></u-icon>
              <text>个人任务 ({{ userTasks.length }})</text>
            </view>
          </view>
          <view class="task-list">
            <view 
              class="task-card" 
              v-for="taskItem in userTasks" 
              :key="taskItem.task.id"
              @click="viewTaskDetail(taskItem.task.id)"
            >
              <view class="task-header">
                <view class="task-title">{{ taskItem.task.title }}</view>
                <view class="task-status" :class="getStatusClass(taskItem.task)">
                  {{ taskItem.task.isOver === 1 ? '已结束' : '进行中' }}
                </view>
              </view>
              <view class="task-meta">
                <view class="task-meta-item">
                  <u-icon name="calendar" size="16" color="#6c757d"></u-icon>
                  <span>发布时间: {{ formatTime(taskItem.task.createTime) }}</span>
                </view>
                <view class="task-meta-item" v-if="taskItem.task.starCoin > 0 || taskItem.task.starPrestige > 0">
                  <u-icon name="gift" size="16" color="#6c757d"></u-icon>
                  <span>
                    奖励: 
                    <span v-if="taskItem.task.starCoin > 0">{{ taskItem.task.starCoin }}金币</span>
                    <span v-if="taskItem.task.starCoin > 0 && taskItem.task.starPrestige > 0"> + </span>
                    <span v-if="taskItem.task.starPrestige > 0">{{ taskItem.task.starPrestige }}声望</span>
                  </span>
                </view>
              </view>
              <view class="task-footer">
                <view class="task-stats">
                  <text>回答: {{ taskItem.answers ? taskItem.answers.length : 0 }}</text>
                </view>
                <view class="task-actions">
                  <u-button 
                    type="primary" 
                    size="small" 
                    shape="circle" 
                    :plain="false" 
                    :border="false"  @click="viewTaskDetail(taskItem.task.id)"
                  >
                    <u-icon name="eye" size="16" color="#ffffff"></u-icon> 查看详情
                  </u-button>
                </view>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 空状态 -->
        <view class="empty-state" v-if="userTasks.length === 0 && !loading">
          <u-icon name="file-text" size="48" color="#e9ecef"></u-icon>
          <h3>暂无发布的任务</h3>
          <p>您还没有发布任何任务</p>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: 'MyPublishedTasks',
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ...mapState('userTask', ['userTasks'])
  },
  methods: {
    ...mapActions('userTask', ['selectMyUserTasks']),
    
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },
    
    // 获取任务状态类名
    getStatusClass(task) {
      return task.isOver === 1 ? 'status-completed' : 'status-pending';
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
    
    // 查看任务详情
    viewTaskDetail(taskId) {
      uni.navigateTo({
        url: `/pages/chatList/taskDetail?id=${taskId}`
      });
    },
    
    // 获取用户发布的任务
    async fetchUserTasks() {
      this.loading = true;
      try {
        const res = await this.selectMyUserTasks();
        if (res.code !== 200) {
          throw new Error(res.msg || '获取任务失败');
        }
      } catch (error) {
        console.error('获取用户任务失败:', error);
        uni.showToast({
          title: '获取任务失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    }
  },
  
  async onLoad() {
    await this.fetchUserTasks();
  },
  
  // 页面显示时刷新数据
  onShow() {
    this.fetchUserTasks();
  }
};
</script>

<style scoped>
.my-published-tasks-container {
  min-height: 100vh;
  background-color: #f5f5f5;
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
  z-index: 1000;
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
  align-items: center;
  gap: 15px;
}

/* 内容区域 */
.content-container {
  padding: 10px;
  padding-top: calc(var(--status-bar-height, 0px) + 60px);
  min-height: calc(100vh - 60px);
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f0f0f0;
  border-top: 3px solid #4361ee;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 任务区域 */
.task-section {
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

/* 任务卡片 */
.task-card {
  background: #fafafa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
  transition: all 0.2s ease;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.task-card:last-child {
  margin-bottom: 0;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.task-title {
  font-weight: 600;
  font-size: 1rem;
  color: #333;
  flex: 1;
  margin-right: 10px;
  line-height: 1.4;
}

.task-status {
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.status-completed {
  background-color: #e8f7ef;
  color: #28a745;
}

.status-pending {
  background-color: #fff3e0;
  color: #ff9800;
}

.task-meta {
  margin-bottom: 12px;
}

.task-meta-item {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 5px;
}

.task-meta-item:last-child {
  margin-bottom: 0;
}

.task-meta-item i {
  margin-right: 5px;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.task-stats {
  font-size: 0.85rem;
  color: #6c757d;
}

.task-actions {
  display: flex;
  gap: 10px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 50px 20px;
  color: #999;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 10px;
  display: block;
}

.empty-state h3 {
  font-size: 1.1rem;
  margin-bottom: 5px;
  color: #666;
}

.empty-state p {
  font-size: 0.9rem;
}
</style>