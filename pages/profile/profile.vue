<template>
  <view class="body">
    <!-- 顶部导航 -->
    <header>
      <div class="header-top">
        <div class="logo">
          <i class="fas fa-user"></i>
          <span>个人中心</span>
        </div>
        <div class="header-actions">
          <u-icon name="setting" size="20" color="#ffffff" @click="toSettings"></u-icon>
        </div>
      </div>
    </header>

    <!-- 用户信息概览 -->
    <div class="user-overview">
      <div class="user-header">
        <image class="avatar" :src="getUserAvatar()" mode="aspectFill"></image>
        <div class="user-basic-info">
          <div class="user-name-row">
            <h2 class="user-name">{{ userInfo.name || '未设置昵称' }}</h2>
          </div>
          <p class="user-school">{{ userInfo.school || '未设置学校' }}</p>
          <p class="user-major">{{ userInfo.major || '未设置专业' }}</p>
        </div>
        <div class="user-status-container">
          <div class="user-status-tag">
            <u-tag :text="getUserStatus()" :type="getUserStatusType()" size="mini" />
          </div>
        </div>
      </div>
      
      <div class="edit-profile-section">
        <u-button 
          type="primary" 
          size="small" 
          plain 
          @click="editProfile"
          :custom-style="{ 
            borderColor: '#4361ee', 
            color: '#4361ee', 
            backgroundColor: 'transparent',
            borderRadius: '20px',
            fontSize: '12px',
            height: '28px',
            padding: '0 15px'
          }"
        >
          <u-icon name="edit-pen" size="14" color="#4361ee" style="margin-right: 4px;"></u-icon>
          编辑资料
        </u-button>
      </div>
      
      <div class="user-stats">
        <div class="stat-item">
          <div class="stat-value">{{ userInfo.finishTask || 0 }}</div>
          <div class="stat-label">完成任务</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ articleCount || 0 }}</div>
          <div class="stat-label">发布帖子</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userInfo.starPrestige || 0 }}</div>
          <div class="stat-label">学术声望</div>
        </div>
      </div>
    </div>

    <!-- 学习统计 -->
    <div class="study-progress-section">
      <div class="section-title">
        <h3>学习统计</h3>
      </div>
      <div class="study-progress">
        <!-- 连续打卡卡片 -->
        <div class="clock-in-card">
          <div class="clock-in-days">{{ userInfo.clockIn || 0 }}天</div>
          <div class="motivational-quote">{{ getRandomQuote() }}</div>
          <div class="clock-in-label">连续打卡</div>
        </div>
        <div class="study-hours">
          <span>注册时间: {{ formatDate(userInfo.createDate) }}</span>
        </div>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="function-menu">
      <div class="menu-grid">
        <div class="menu-item" @click="toGroupList">
          <div class="menu-icon">
            <u-icon name="account" size="24" color="#4361ee"></u-icon>
          </div>
          <div class="menu-name">我的小组</div>
        </div>
        <div class="menu-item" @click="toMyTasks">
          <div class="menu-icon">
            <u-icon name="order" size="24" color="#4361ee"></u-icon>
          </div>
          <div class="menu-name">我的任务</div>
        </div>
        <div class="menu-item" @click="toMyFriends">
          <div class="menu-icon">
            <u-icon name="man-add" size="24" color="#4361ee"></u-icon>
          </div>
          <div class="menu-name">我的好友</div>
        </div>
        <div class="menu-item" @click="toAchievements">
          <div class="menu-icon">
            <u-icon name="star" size="24" color="#4361ee"></u-icon>
          </div>
          <div class="menu-name">我的成就</div>
        </div>
      </div>
    </div>

    <!-- 其他信息占位 -->
    <div class="placeholder-section">
      <div class="section-title">
        <h3>更多信息</h3>
      </div>
      <div class="placeholder-content">
        <u-empty 
          mode="list" 
          text="更多功能正在开发中" 
          icon="http://cdn.uviewui.com/uview/empty/data.png">
        </u-empty>
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
      imageUrl: imageUrl,
      articleCount: 0, // 发帖数量，等待后端更新数据
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
      ]
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  onLoad() {
    // 页面加载时可以从store获取最新用户信息
    console.log("个人中心页面加载");
    // TODO: 从后端获取用户的发帖数量
    // this.fetchArticleCount();
  },
  methods: {
    ...mapActions('user', ['selectUser']),
    
    // 获取用户头像
    getUserAvatar() {
      if (this.userInfo.head) {
        return this.imageUrl + this.userInfo.head;
      }
      // 默认头像
      return this.imageUrl + '/head/group.png';
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
    
    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return '未知';
      const date = new Date(dateString);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    },
    
    // 获取随机励志话语
    getRandomQuote() {
      const randomIndex = Math.floor(Math.random() * this.motivationalQuotes.length);
      return this.motivationalQuotes[randomIndex];
    },
    
    // 编辑资料
    editProfile() {
      uni.navigateTo({
        url: '/pages/userInfo/userInfo'
      });
    },
    
    // 跳转到设置页面
    toSettings() {
      uni.navigateTo({
        url: '/pages/profile/settings'
      });
    },
    
    // 跳转到小组列表
    toGroupList() {
      uni.navigateTo({
        url: '/pages/chatList/groupList'
      });
    },
    
    // 跳转到我的任务
    toMyTasks() {
      this.$u.toast('任务功能正在开发中');
    },
    
    // 跳转到我的好友
    toMyFriends() {
      uni.navigateTo({
        url: '/pages/chatList/friendList'
      });
    },
    
    // 跳转到成就页面
    toAchievements() {
      this.$u.toast('成就功能正在开发中');
    }
  }
};
</script>

<style scoped>
.body {
  background-color: #f5f7fb;
  color: #333;
  min-height: 100vh;
}

/* 顶部导航 */
header {
  background: linear-gradient(135deg, #4361ee, #3f37c9);
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
}

.header-actions i {
  font-size: 1.3rem;
  cursor: pointer;
}

/* 用户概览 */
.user-overview {
  background: white;
  border-radius: 16px;
  margin: 20px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;
}

.user-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(45deg, #4895ef, #4cc9f0);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.8rem;
  font-weight: bold;
  margin-right: 15px;
  flex-shrink: 0;
}

.user-basic-info {
  flex: 1;
  min-width: 0;
}

.user-name-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.user-name {
  font-size: 1.4rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.user-school,
.user-major {
  font-size: 0.95rem;
  color: #6c757d;
  margin: 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-status-container {
  position: absolute;
  top: 20px;
  right: 70px; /* 避开编辑按钮的位置 */
}

.edit-profile-section {
  position: absolute;
  top: 20px;
  right: 20px;
}

.user-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  text-align: center;
  margin-top: 10px;
}

.stat-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 12px;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #4361ee;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.85rem;
  color: #6c757d;
}

/* 学习统计 */
.study-progress-section {
  margin: 0 20px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 25px 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.study-progress {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 连续打卡卡片 */
.clock-in-card {
  background: linear-gradient(135deg, #4361ee, #3f37c9);
  border-radius: 16px;
  padding: 25px 20px;
  color: white;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(67, 97, 238, 0.3);
}

.clock-in-card::before {
  content: "";
  position: absolute;
  top: -50px;
  right: -50px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.clock-in-card::after {
  content: "";
  position: absolute;
  bottom: -30px;
  right: -30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
}

.clock-in-days {
  font-size: 2.5rem;
  font-weight: 700;
  position: absolute;
  top: 15px;
  left: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.motivational-quote {
  font-size: 1.1rem;
  text-align: center;
  margin: 20px 0;
  font-weight: 500;
  line-height: 1.5;
  padding: 0 30px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clock-in-label {
  position: absolute;
  bottom: 15px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.study-hours {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  font-size: 0.85rem;
  color: #6c757d;
}

/* 功能菜单 */
.function-menu {
  margin: 25px 20px;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.menu-item {
  background: white;
  border-radius: 12px;
  padding: 15px 10px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  cursor: pointer;
}

.menu-item:hover {
  transform: translateY(-3px);
}

.menu-icon {
  width: 50px;
  height: 50px;
  background: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
}

.menu-name {
  font-size: 0.85rem;
  font-weight: 500;
}

/* 占位区域 */
.placeholder-section {
  margin: 25px 20px;
}

.placeholder-content {
  background: white;
  border-radius: 16px;
  padding: 30px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .menu-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
  
  .menu-icon {
    width: 40px;
    height: 40px;
  }
  
  .menu-name {
    font-size: 0.75rem;
  }
  
  .clock-in-days {
    font-size: 2rem;
  }
  
  .motivational-quote {
    font-size: 1rem;
    padding: 0 15px;
  }
  
  .user-header {
    flex-direction: row;
    align-items: flex-start;
  }
  
  .avatar {
    margin-right: 15px;
  }
  
  .user-basic-info {
    flex: 1;
  }
  
  .user-status-container {
    position: absolute;
    top: 20px;
    right: 70px;
  }
  
  .edit-profile-section {
    position: static;
    margin-top: 15px;
    display: flex;
    justify-content: center;
  }
}
</style>