<template>
  <view class="body">
    <!-- 顶部导航 -->
    <header>
      <div class="header-top">
        <div class="logo">
          <span>职引星聚</span>
        </div>
        <div class="header-actions">
        </div>
      </div>
      <div class="search-bar" @click="goToSearch">
        <u-icon name="search" size="16" color="#ccc"></u-icon>
        <input placeholder-style="color:#fff" type="text" placeholder="搜索课程、问题、技能..." readonly>
      </div>
    </header>

    <!-- 用户学习计划 -->
    <div class="user-overview">
      <div class="section-header">
        <div class="section-title">我的学习计划</div>
        <div class="section-action" @click="goToPage('/pages/userPlan/userPlan')">
          <u-icon name="setting" size="16" color="#999"></u-icon>
        </div>
      </div>
      
      <div class="plans-container">
        <!-- 如果有活动计划 -->
        <div v-if="activePlans && activePlans.length > 0">
          <div 
            v-for="plan in activePlans.slice(0, 3)" 
            :key="plan.id"
            class="plan-item"
          >
            <div class="plan-header">
              <div class="plan-status">
                <u-tag 
                  :text="getPlanStatusText(plan)" 
                  :type="getPlanStatusType(plan)" 
                  size="mini" 
                />
              </div>
              <div class="plan-time">
                {{ plan.startTime ? formatDate(plan.startTime) : '未设置开始时间' }}
              </div>
            </div>
            <div class="plan-content">
              {{ plan.planContext }}
            </div>
          </div>
          
          <!-- 如果还有更多计划 -->
          <div 
            v-if="activePlans.length > 3" 
            class="view-more-plans"
            @click="goToPage('/pages/userPlan/userPlan')"
          >
            查看更多计划
          </div>
        </div>
        
        <!-- 如果没有活动计划 -->
        <div v-else class="no-plans">
          <u-icon name="file-text" size="40" color="#ccc"></u-icon>
          <div class="no-plans-text">暂无学习计划</div>
          <div class="no-plans-subtext">点击设置按钮创建你的学习计划</div>
        </div>
      </div>
    </div>

    <!-- 励志卡片 -->
    <div class="motivational-card">
      <div class="card-header">
        <div class="clock-in-days">{{ userInfo.clockIn || 0 }}天</div>
        <div class="card-label">连续打卡</div>
      </div>
      <div class="motivational-content">
        <div class="quote">{{ getRandomQuote() }}</div>
      </div>
    </div>

    <!-- 核心功能入口 -->
    <div class="quick-actions">
      <div class="action-grid">
        <div class="action-item" @click="goToPage('/pages/completedTasks/completedTasks')">
          <div class="action-icon">
            <u-icon name="order" size="24" color="#ffffff"></u-icon>
          </div>
          <div class="action-name">我的任务</div>
        </div>
        <div class="action-item" @click="goToPage('/pages/chatList/taskList')">
          <div class="action-icon">
            <u-icon name="file-text" size="24" color="#ffffff"></u-icon>
          </div>
          <div class="action-name">任务所</div>
        </div>
        <div class="action-item" @click="goToPage('/pages/chatList/friendList')">
          <div class="action-icon">
            <u-icon name="man-add" size="24" color="#ffffff"></u-icon>
          </div>
          <div class="action-name">好友</div>
        </div>
        <div class="action-item" @click="goToPage('/pages/chatList/groupList')">
          <div class="action-icon">
            <u-icon name="home" size="24" color="#ffffff"></u-icon>
          </div>
          <div class="action-name">我的小组</div>
        </div>
        <div class="action-item" @click="goToPage('/pages/search/search')">
          <div class="action-icon">
            <u-icon name="search" size="24" color="#ffffff"></u-icon>
          </div>
          <div class="action-name">搜索</div>
        </div>
        <div class="action-item" @click="goToPage('/pages/AI/skillTree')">
          <div class="action-icon">
            <u-icon name="order" size="24" color="#ffffff"></u-icon>
          </div>
          <div class="action-name">技能树</div>
        </div>
        <div class="action-item" @click="goToPage('/pages/AI/lessonPlan')">
          <div class="action-icon">
            <u-icon name="edit-pen" size="24" color="#ffffff"></u-icon>
          </div>
          <div class="action-name">教案修改</div>
        </div>
        <div class="action-item" @click="goToPage('/pages/AI/starAI')">
          <div class="action-icon">
            <u-icon name="star" size="24" color="#ffffff"></u-icon>
          </div>
          <div class="action-name">小星AI</div>
        </div>
      </div>
    </div>
  </view>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { imageUrl } from "@/config/config.js";

export default {
  data() {
    return {
      motivationalQuotes: [
        "每一次坚持，都是成功的积累。",
        "学习如逆水行舟，不进则退。",
        "今天的努力，是明天的收获。",
        "知识是通往自由的金钥匙。",
        "持之以恒，方能成就非凡。",
        "学而时习之，不亦说乎？",
        "书山有路勤为径，学海无涯苦作舟。",
        "不积跬步，无以至千里。",
        "学习是成长的阶梯。",
        "勤奋是成功之母。",
        "学如逆水行舟，不进则退。",
        "知识改变命运，学习成就未来。",
        "每天进步一点点，就是成功的开始。",
        "学习是点亮人生的明灯。",
        "坚持就是胜利，努力必有回报。"
      ],
      userPlans: [] // 添加用户计划数据
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    // 获取用户学习计划
    activePlans() {
      // 筛选出未开始和进行中的计划（isEnd为0的计划）
      if (!this.userPlans || this.userPlans.length === 0) return [];
      
      // userPlans是一个包含两个数组的数组，第一个数组是有效的计划
      const plans = Array.isArray(this.userPlans[0]) ? this.userPlans[0] : [];
      
      return plans.filter(plan => plan.isEnd === 0);
    }
  },
  methods: {
    ...mapActions({
      getUserPlans: "userPlan/getUserPlans"
    }),
    
    // 格式化时间戳
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    },
    
    // 格式化日期（只显示年月日）
    formatDate(dateString) {
      if (!dateString) return '未设置';
      const date = new Date(dateString);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    },
    
    // 获取用户头像
    getUserAvatar() {
      if (this.userInfo.head) {
        return imageUrl + this.userInfo.head;
      }
      // 默认头像
      return "/static/default-avatar.png";
    },
    
    // 获取用户状态
    getUserStatus() {
      const statusMap = {
        1: '学生',
        2: '老师',
        3: '企业'
      };
      return statusMap[this.userInfo.status] || '未知';
    },
    
    // 获取用户状态标签类型
    getUserStatusType() {
      const typeMap = {
        1: 'success',  // 学生 - 绿色
        2: 'primary',  // 老师 - 蓝色
        3: 'warning'   // 企业 - 橙色
      };
      return typeMap[this.userInfo.status] || 'info';
    },
    
    // 获取随机励志话语
    getRandomQuote() {
      const randomIndex = Math.floor(Math.random() * this.motivationalQuotes.length);
      return this.motivationalQuotes[randomIndex];
    },
    
    // 跳转到指定页面
    goToPage(url) {
      uni.navigateTo({
        url: url
      });
    },
    
    // 跳转到搜索页面
    goToSearch() {
      uni.navigateTo({
        url: '/pages/search/search'
      });
    },
    
    // 跳转到聊天页面
    goToChat() {
      uni.navigateTo({
        url: '/pages/chatList/chatList'
      });
    },
    
    // 获取计划状态文本
    getPlanStatusText(plan) {
      if (plan.isEnd === 1) {
        return '已完成';
      } else if (plan.isStart === 1) {
        return '进行中';
      } else {
        return '未开始';
      }
    },
    
    // 获取计划状态类型
    getPlanStatusType(plan) {
      if (plan.isEnd === 1) {
        return 'success';  // 已完成 - 绿色
      } else if (plan.isStart === 1) {
        return 'primary';  // 进行中 - 蓝色
      } else {
        return 'warning';  // 未开始 - 橙色
      }
    }
  },
  onLoad() {
    // 页面加载时获取用户计划
    this.getUserPlans().then(res => {
      console.log("用户计划加载成功", res);
      this.userPlans = res;
    }).catch(err => {
      console.error("获取用户计划失败", err);
    });
  },
  onShow() {
    // 页面显示时重新获取用户信息和用户计划
    this.$store.dispatch('user/selectUser', { id: uni.getStorageSync('id') });
    
    // 重新获取用户计划
    this.getUserPlans().then(res => {
      console.log("用户计划加载成功", res);
      this.userPlans = res;
    }).catch(err => {
      console.error("获取用户计划失败", err);
    });
  }
};
</script>

<style scoped>
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

.body {
  background-color: #f5f7fb;
  color: #333;
  min-height: 100vh;
  padding-bottom: 20px;
}

/* 顶部导航 */
header {
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
}

.header-actions {
  display: flex;
  gap: 20px;
  align-items: center;
}

.header-actions i {
  font-size: 1.3rem;
  cursor: pointer;
}

.search-bar {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  padding: 8px 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.search-bar input {
  background: transparent;
  border: none;
  color: white;
  width: 100%;
  padding: 0 10px;
  outline: none;
  font-size: 0.95rem;
}

.search-bar input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

/* 用户概览 */
.user-overview {
  background: white;
  border-radius: 16px;
  margin: 20px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 用户学习计划 */
.user-overview {
  background: white;
  border-radius: 16px;
  margin: 20px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.section-action {
  cursor: pointer;
}

.plans-container {
  min-height: 120px;
}

.plan-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
}

.plan-item:last-child {
  margin-bottom: 0;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.plan-time {
  font-size: 0.85rem;
  color: #6c757d;
}

.plan-content {
  font-size: 0.95rem;
  color: #333;
  line-height: 1.5;
}

.view-more-plans {
  text-align: center;
  padding: 15px 0;
  color: var(--primary);
  font-size: 0.9rem;
  cursor: pointer;
}

.no-plans {
  text-align: center;
  padding: 30px 0;
  color: #999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.no-plans i {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #ccc;
  align-self: center;
}

.no-plans-text {
  font-size: 1rem;
  margin: 10px 0 5px;
}

.no-plans-subtext {
  font-size: 0.85rem;
}

/* 励志卡片 */
.motivational-card {
  background: linear-gradient(135deg, #4361ee, #3f37c9);
  border-radius: 16px;
  margin: 0 20px 25px;
  padding: 20px;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(67, 97, 238, 0.3);
  min-height: 140px;
  display: flex;
  flex-direction: column;
}

.motivational-card::before {
  content: "";
  position: absolute;
  top: -50px;
  right: -50px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.motivational-card::after {
  content: "";
  position: absolute;
  bottom: -30px;
  right: -30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
  z-index: 2;
}

.clock-in-days {
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.card-label {
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.motivational-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  padding: 10px 0;
}

.quote {
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
}

/* 核心功能入口 */
.quick-actions {
  margin: 0 20px 25px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 25px 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title a {
  font-size: 0.9rem;
  color: var(--primary);
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.action-item {
  background: white;
  border-radius: 12px;
  padding: 15px 10px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100px;
}

.action-item:hover {
  transform: translateY(-3px);
}

.action-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.action-name {
  font-size: 0.8rem;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* 待完成任务 */
.pending-tasks {
  margin: 0 20px;
}

.task-list {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.task-item {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid var(--light-gray);
  align-items: center;
}

.task-item:last-child {
  border-bottom: none;
}

.task-icon {
  width: 40px;
  height: 40px;
  background: var(--light);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: var(--primary);
  flex-shrink: 0;
}

.task-details {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-weight: 500;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-meta {
  display: flex;
  font-size: 0.85rem;
  color: var(--gray);
  align-items: center;
}

.task-time {
  margin-right: 15px;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.task-status {
  color: var(--warning);
  font-weight: 500;
  white-space: nowrap;
}

.no-task {
  padding: 30px 20px;
  text-align: center;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .action-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
  
  .action-icon {
    width: 40px;
    height: 40px;
  }
  
  .action-name {
    font-size: 0.75rem;
  }
  
  .quote {
    font-size: 1rem;
  }
  
  .clock-in-days {
    font-size: 1.8rem;
  }
  
  .user-name {
    font-size: 1.2rem;
  }
}
</style>