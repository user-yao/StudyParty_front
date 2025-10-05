<template>
  <view class="body">
    <!-- 顶部导航 -->
    <header class="app-header">
      <div class="header-top">
        <div class="logo">
          <u-icon name="arrow-left" size="24" color="#ffffff" @click="goBack"></u-icon>
          <span>已完成任务</span>
        </div>
        <div class="header-actions">
          <u-icon name="search" size="24" color="#ffffff" @click="toggleSearch"></u-icon>
        </div>
      </div>
      
      <!-- 搜索框 -->
      <div class="search-container" v-show="showSearch">
        <input 
          class="search-input" 
          v-model="searchKeyword" 
          placeholder="搜索任务标题..." 
          @input="onSearchInput"
          ref="searchInput"
        />
        <button class="search-btn" @click="clearSearch">
          <u-icon name="close" size="20" color="#ffffff"></u-icon>
        </button>
      </div>
    </header>

    <!-- 内容区域 -->
    <div class="content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在加载任务...</p>
      </div>

      <!-- 任务列表 -->
      <div v-else>
        <!-- 个人任务 -->
        <div class="task-section" v-if="filteredUserTasks.length > 0">
          <div class="section-header">
            <h3 class="section-title">个人任务 ({{ filteredUserTasks.length }})</h3>
          </div>
          <div class="task-list">
            <div class="task-card" v-for="task in filteredUserTasks" :key="task.task.id">
              <div class="task-header">
                <div class="task-title">{{ task.task.title }}</div>
                <div class="task-status status-completed">
                  已完成
                </div>
              </div>
              <div class="task-meta">
                <div class="task-meta-item">
                  <u-icon name="calendar" size="16" color="#6c757d"></u-icon>
                  <span>完成时间: {{ formatDate(task.taskAnswer.createTime) }}</span>
                </div>
                <div class="task-meta-item" v-if="task.task.starCoin > 0 || task.task.starPrestige > 0">
                  <u-icon name="gift" size="16" color="#6c757d"></u-icon>
                  <span>
                    奖励: 
                    <span v-if="task.task.starCoin > 0">{{ task.task.starCoin }}金币</span>
                    <span v-if="task.task.starCoin > 0 && task.task.starPrestige > 0"> + </span>
                    <span v-if="task.task.starPrestige > 0">{{ task.task.starPrestige }}声望</span>
                  </span>
                </div>
              </div>
              <div class="task-footer">
                <div class="task-score" v-if="task.taskAnswer.score !== undefined && task.taskAnswer.score >= 0">
                  得分: <span class="score-value">{{ task.taskAnswer.score }}</span>
                </div>
                <div class="task-actions">
                  <u-button 
                    type="primary" 
                    size="small" 
                    shape="circle" 
                    :plain="false" 
                    :border="false" 
                    @click="viewUserTaskDetails(task)"
                  >
                    <u-icon name="eye" size="16" color="#ffffff"></u-icon> 查看详情
                  </u-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 小组任务 -->
        <div class="task-section" v-if="filteredGroupTasks.length > 0">
          <div class="section-header">
            <h3 class="section-title">小组任务 ({{ filteredGroupTasks.length }})</h3>
          </div>
          <div class="task-list">
            <div class="task-card" v-for="task in filteredGroupTasks" :key="task.groupTask.id">
              <div class="task-header">
                <div class="task-title">{{ task.groupTask.groupTask }}</div>
                <div class="task-status status-completed">
                  已完成
                </div>
              </div>
              <div class="task-meta">
                <div class="task-meta-item">
                  <u-icon name="calendar" size="16" color="#6c757d"></u-icon>
                  <span>完成时间: {{ formatDate(task.groupTaskAnswer.time) }}</span>
                </div>
                <div class="task-meta-item">
                  <u-icon name="account" size="16" color="#6c757d"></u-icon>
                  <span>小组: {{ getGroupName(task.groupTask.groupId) }}</span>
                </div>
              </div>
              <div class="task-footer">
                <div class="task-score" v-if="task.groupTaskAnswer.score !== undefined && task.groupTaskAnswer.score >= 0">
                  得分: <span class="score-value">{{ task.groupTaskAnswer.score }}</span>
                </div>
                <div class="task-actions">
                  <u-button 
                    type="primary" 
                    size="small" 
                    shape="circle" 
                    :plain="false" 
                    :border="false" 
                    @click="viewGroupTaskDetails(task)"
                  >
                    <u-icon name="eye" size="16" color="#ffffff"></u-icon> 查看详情
                  </u-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div class="empty-state" v-if="filteredUserTasks.length === 0 && filteredGroupTasks.length === 0">
          <u-icon name="file-text" size="48" color="#e9ecef"></u-icon>
          <h3>暂无已完成任务</h3>
          <p v-if="searchKeyword">没有找到匹配的任务</p>
          <p v-else>您还没有完成任何任务</p>
        </div>
      </div>
    </div>
  </view>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      searchKeyword: '',
      loading: false,
      searchTimer: null,
      showSearch: false,
      groupNames: {}, // 小组名称缓存
      processedUserTasks: [], // 处理后的个人任务数据
      processedGroupTasks: [] // 处理后的小组任务数据
    };
  },
  computed: {
    ...mapState('user', ['userInfo']),
    
    // 过滤后的个人任务列表
    filteredUserTasks() {
      let filtered = this.processedUserTasks || [];
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        filtered = filtered.filter(task =>
          (task.task && task.task.title && task.task.title.toLowerCase().includes(keyword))
        );
      }
      return filtered;
    },
    
    // 过滤后的小组任务列表
    filteredGroupTasks() {
      let filtered = this.processedGroupTasks || [];
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        filtered = filtered.filter(task =>
          (task.groupTask && task.groupTask.groupTask && task.groupTask.groupTask.toLowerCase().includes(keyword))
        );
      }
      return filtered;
    }
  },
  methods: {
    ...mapActions('userTask', ['selectMyUserTasks']),
    
    // 返回上一页
    goBack() {
      uni.navigateBack({
        delta: 1
      });
    },

    // 切换搜索框显示
    toggleSearch() {
      this.showSearch = !this.showSearch;
      if (this.showSearch) {
        this.$nextTick(() => {
          this.$refs.searchInput && this.$refs.searchInput.focus();
        });
      } else {
        this.searchKeyword = '';
      }
    },

    // 清除搜索
    clearSearch() {
      this.searchKeyword = '';
      this.showSearch = false;
    },

    // 搜索输入处理（防抖）
    onSearchInput() {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        // 搜索会在computed中自动处理
      }, 300);
    },

    // 查看个人任务详情
    viewUserTaskDetails(task) {
      // 跳转到个人任务详情页面
      if (!task || !task.task || !task.task.id) {
        this.$u.toast('任务信息不完整');
        return;
      }
      
      uni.navigateTo({
        url: '/pages/chatList/taskDetail',
        success: (res) => {
          res.eventChannel.emit("taskData", {
            taskId: task.task.id,
            taskDetail: task
          });
        },
        fail: (err) => {
          console.error('跳转失败:', err);
          this.$u.toast('跳转失败，请重试');
        }
      });
    },

    // 查看小组任务详情
    viewGroupTaskDetails(task) {
      // 跳转到小组任务详情页面
      if (!task || !task.groupTask || !task.groupTask.id) {
        this.$u.toast('任务信息不完整');
        return;
      }
      
      uni.navigateTo({
        url: '/pages/chatList/groupTaskDetail',
        success: (res) => {
          res.eventChannel.emit("taskData", {
            taskId: task.groupTask.id,
            groupId: task.groupTask.groupId,
            taskDetail: task.groupTask
          });
        },
        fail: (err) => {
          console.error('跳转失败:', err);
          this.$u.toast('跳转失败，请重试');
        }
      });
    },

    // 获取小组名称
    getGroupName(groupId) {
      // 这里应该从group store中获取小组名称
      // 目前使用缓存或默认值
      return this.groupNames[groupId] || `小组${groupId}`;
    },

    // 格式化日期显示
    formatDate(dateStr) {
      if (!dateStr) return '未知日期';
      const date = new Date(dateStr);
      
      // 检查日期是否有效
      if (isNaN(date.getTime())) return '无效日期';
      
      return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0') + ' ' +
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0');
    },

    // 处理个人任务数据
    processUserTasks(userTasksData) {
      // 根据新的数据格式，第一个数组是个人任务
      if (Array.isArray(userTasksData) && userTasksData.length > 0) {
        return userTasksData.map(item => {
          // item 是 { task: {...}, taskAnswer: {...} } 的结构
          return {
            task: item.task || {},
            taskAnswer: item.taskAnswer || {}
          };
        });
      }
      return [];
    },

    // 处理小组任务数据
    processGroupTasks(groupTasksData) {
      // 根据新的数据格式，第二个数组是小组任务
      if (Array.isArray(groupTasksData) && groupTasksData.length > 0) {
        return groupTasksData.map(item => {
          // item 是 { groupTask: {...}, groupTaskAnswer: {...} } 的结构
          return {
            groupTask: item.groupTask || {},
            groupTaskAnswer: item.groupTaskAnswer || {}
          };
        });
      }
      return [];
    },

    // 加载已完成任务数据
    async loadCompletedTasks() {
      try {
        this.loading = true;
        
        // 调用API获取已完成任务
        const res = await this.selectMyUserTasks();
        
        if (res && res.code === 200 && Array.isArray(res.data)) {
          // 处理个人任务数据（第一个数组）
          this.processedUserTasks = this.processUserTasks(res.data[0] || []);
          
          // 处理小组任务数据（第二个数组）
          this.processedGroupTasks = this.processGroupTasks(res.data[1] || []);
        } else {
          console.warn('使用模拟数据进行测试');
          // 模拟数据
          this.processedUserTasks = [
            {
              task: {
                id: 11,
                uploader: 3,
                title: "222",
                context: "2222\n![图片1](blob:http://localhost:5173/65cf418e-5e82-4654-b157-e5ebd4fc6427)\n",
                isOver: 1,
                isTrueId: 2,
                starCoin: 0,
                starPrestige: 1,
                createTime: "2025-10-04T15:12:28.000+00:00",
                status: 2
              },
              taskAnswer: {
                id: 2,
                taskId: 11,
                answerer: 3,
                context: "111111",
                nice: 0,
                isTrue: 1,
                createTime: "2025-10-04T15:29:53.000+00:00",
                score: 95,
                status: 2
              }
            }
          ];
          
          this.processedGroupTasks = [
            {
              groupTask: {
                id: 8,
                groupId: 3,
                groupTask: "学习security",
                groupTaskUploader: "3",
                groupTaskStartTime: "2025-08-25T11:33:43.000+00:00",
                groupTaskLastTime: "2025-10-25T11:33:43.000+00:00",
                groupTaskFinish: 1,
                groupTaskContext: "# 基于反向驱动式学习的产教融合平台架构设计文档（核心功能部分）\n\n## 一、功能概述 \n\n本平台以“**企业需求反向驱动教学供给**”为核心逻辑，构建“企业需求输入-课程动态适配-实践场景验证-效果反馈优化”的闭环产教融合体系。",
                groupTaskUnfinished: 2,
                createTime: "2025-08-24T15:25:57.000+00:00"
              },
              groupTaskAnswer: {
                id: 8,
                groupTaskId: 8,
                userId: 3,
                context: "# 作业标题",
                time: "2025-09-13T13:43:53.000+00:00",
                haveSource: 0,
                score: 100
              }
            }
          ];
        }
      } catch (error) {
        console.error('加载已完成任务失败:', error);
        uni.showToast({
          title: '加载任务失败',
          icon: 'none',
          duration: 2000
        });
      } finally {
        this.loading = false;
      }
    }
  },

  // 页面加载时获取数据
  onLoad() {
    this.loadCompletedTasks();
  }
};
</script>

<style scoped>
.body {
  background-color: #f5f7fb;
  color: #333;
  min-height: 100vh;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

:global(:root) {
  --primary: #4361ee;
  --secondary: #3f37c9;
  --accent: #4895ef;
  --success: #4cc9f0;
  --warning: #f72585;
  --light: #f8f9fa;
  --dark: #212529;
  --gray: #6c757d;
  --light-gray: #e9ecef;
  --card-bg: #ffffff;
  --section-bg: #f5f7fb;
}

/* 顶部导航 */
.app-header {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  padding: 15px 20px;
  padding-top: 5vh;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.logo {
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 1.4rem;
}

.logo i {
  margin-right: 8px;
  font-size: 1.6rem;
  cursor: pointer;
}

.header-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.header-actions i {
  font-size: 1.3rem;
  cursor: pointer;
}

/* 搜索框样式 */
.search-container {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.search-input {
  flex: 1;
  height: 40px;
  padding: 0 15px;
  border: 1px solid var(--light-gray);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
}

.search-btn {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 15px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.search-btn:hover {
  background: var(--secondary);
}

/* 内容区域 */
.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  padding-bottom: 70px;
}

/* 任务分组区域 */
.task-section {
  margin-bottom: 30px;
}

.section-header {
  margin-bottom: 15px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--dark);
  padding-bottom: 8px;
  border-bottom: 2px solid var(--light-gray);
}

/* 加载状态 */
.loading-container {
  text-align: center;
  padding: 40px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--light-gray);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 任务卡片样式 */
.task-card {
  background: white;
  border-radius: 16px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 15px;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.task-title {
  font-weight: 600;
  font-size: 1.1rem;
  margin-right: 15px;
  flex: 1;
  line-height: 1.4;
  color: var(--dark);
}

.task-status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.status-completed {
  background: #d1ecf1;
  color: #0c5460;
}

.task-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
  font-size: 0.85rem;
  color: var(--gray);
}

.task-meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.task-description {
  font-size: 0.9rem;
  color: var(--gray);
  margin-bottom: 15px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.task-score {
  font-size: 0.9rem;
  font-weight: 500;
}

.score-value {
  color: #4361ee;
  font-weight: 700;
  font-size: 1.1rem;
}

.task-actions {
  display: flex;
  gap: 10px;
  flex: 1;
  justify-content: flex-end;
  min-width: 100px;
}

/* 覆盖 uView-plus 按钮默认样式 */
.task-actions .u-button {
  flex: 1;
  justify-content: center;
  font-size: 0.85rem;
  padding: 6px 12px;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  background-image: none !important;
  border-radius: 20px;
}

/* 特别处理按钮的hover状态 */
.task-actions .u-button::after {
  border: none !important;
}

/* 覆盖uView-plus按钮的所有可能边框样式 */
.task-actions .u-button.u-button--primary,
.task-actions .u-button.u-button--error {
  border: none !important;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--gray);
  min-height: 300px;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 15px;
  color: var(--light-gray);
}

/* 响应式调整 */
@media (max-width: 480px) {
  .content {
    padding: 15px;
  }

  .task-title {
    font-size: 1rem;
  }

  .task-meta {
    flex-direction: column;
    gap: 5px;
  }

  .task-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .task-actions {
    align-self: flex-end;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
  
  .task-description {
    font-size: 0.85rem;
  }
}
</style>