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
          <!-- 移除设置按钮 -->
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
        <div class="stat-item"  @click="toMyTasks">
          <div class="stat-value">{{ userInfo.finishTask || 0 }}</div>
          <div class="stat-label">完成任务</div>
        </div>
        <div class="stat-item" @click="toMyArticles">
          <div class="stat-value">{{ userInfo.articleNum || 0 }}</div>
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
        <div class="menu-item" @click="toMyFriends">
          <div class="menu-icon">
            <u-icon name="man-add" size="24" color="#4361ee"></u-icon>
          </div>
          <div class="menu-name">我的好友</div>
        </div>
        <div class="menu-item" @click="toMyCollectArticles">
          <div class="menu-icon">
            <u-icon name="bookmark" size="24" color="#4361ee"></u-icon>
          </div>
          <div class="menu-name">我的收藏</div>
        </div>
      </div>
    </div>

    <!-- 系统功能菜单 -->
    <div class="system-menu">
      <div class="menu-item" @click="toChangePassword">
        <div class="menu-content">
          <u-icon name="lock" size="18" color="#4361ee" class="menu-icon"></u-icon>
          <span class="menu-text">修改密码</span>
        </div>
        <u-icon name="arrow-right" size="14" color="#999"></u-icon>
      </div>
      
      <div class="menu-item" @click="toAbout">
        <div class="menu-content">
          <u-icon name="info-circle" size="18" color="#4361ee" class="menu-icon"></u-icon>
          <span class="menu-text">关于我们</span>
        </div>
        <u-icon name="arrow-right" size="14" color="#999"></u-icon>
      </div>
      
      <div class="menu-item" @click="logout">
        <div class="menu-content">
          <u-icon name="close" size="18" color="#f72585" class="menu-icon"></u-icon>
          <span class="menu-text logout-text">退出登录</span>
        </div>
        <u-icon name="arrow-right" size="14" color="#999"></u-icon>
      </div>
    </div>
  </view>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { imageUrl } from "@/config/config.js";
import { userInfo } from "../../API/user/user";

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
  onShow() {
    // 页面显示时获取最新用户信息
    this.fetchUserInfo();
  },
  methods: {
    ...mapActions('user', ['selectUser', 'fetchUserInfo']),
    
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
        url: '/pages/profile/editProfile'
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
      uni.navigateTo({
        url: '/pages/completedTasks/completedTasks'
      });
    },
    
    // 跳转到我的好友
    toMyFriends() {
      uni.navigateTo({
        url: '/pages/chatList/friendList'
      });
    },
    
    // 跳转到我的文章页面
    toMyArticles() {
      // 调用store中的userArticle模块的selectMyUserArticle方法
      this.$store.dispatch('user/selectMyUserArticle').then(res => {
        if (res.code === 200) {
          // 跳转到文章列表页面，传递文章数据
          uni.navigateTo({
            url: '/pages/forum/myArticles?articles=' + encodeURIComponent(JSON.stringify(res.data))
          });
        }
      });
    },
    
    // 跳转到我收藏的文章页面
    toMyCollectArticles() {
      // 调用store中的articleUser模块的myCollectArticle方法
      this.$store.dispatch('articleUser/myCollectArticle').then(res => {
        if (res.code === 200) {
          // 跳转到收藏文章列表页面，传递文章数据
          uni.navigateTo({
            url: '/pages/forum/myCollectArticles?articles=' + encodeURIComponent(JSON.stringify(res.data))
          });
        }
      });
    },
    
    // 跳转到修改密码页面
    toChangePassword() {
      uni.navigateTo({
        url: '/pages/profile/changePassword'
      });
    },
    
    // 跳转到关于我们页面
    toAbout() {
      uni.navigateTo({
        url: '/pages/profile/about'
      });
    },
    
    // 退出登录
    logout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            // 清除用户信息
            this.$store.dispatch('user/logout');
            // 跳转到登录页面
            uni.reLaunch({
              url: '/pages/login/login'
            });
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.body {
  background-color: #f5f7fb;
  color: #333;
  min-height: 100vh;
  padding-bottom: 20rpx;
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
}

/* 用户概览 */
.user-overview {
  background: var(--card-bg);
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
  background: linear-gradient(45deg, var(--accent), var(--success));
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
  color: var(--dark);
}

.user-school,
.user-major {
  font-size: 0.95rem;
  color: var(--gray);
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
  background: var(--light);
  border-radius: 12px;
  padding: 12px;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--gray);
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
  color: var(--dark);
}

.study-progress {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 连续打卡卡片 */
.clock-in-card {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
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
  font-size: 1.6rem;
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
  color: var(--gray);
}

/* 功能菜单 */
.function-menu {
  margin: 25px 20px;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.menu-item {
  background: var(--card-bg);
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
  background: var(--light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
}

.menu-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--dark);
}

/* 系统功能菜单 */
.system-menu {
  margin: 0 20px 25px;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.system-menu .menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  text-align: left;
  margin: 0;
}

.system-menu .menu-item:not(:last-child) {
  border-bottom: 1px solid var(--light-gray);
}

.system-menu .menu-item:hover {
  background: var(--light);
}

.menu-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-icon {
  width: auto;
  height: auto;
  background: transparent;
  border-radius: 0;
  margin: 0 auto;
}

.menu-text {
  font-size: 0.95rem;
  color: var(--dark);
}

.logout-text {
  color: var(--warning);
}

/* 响应式调整 */
@media (max-width: 480px) {
  .menu-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  
  .menu-icon {
    width: 50px;
    height: 50px;
  }
  
  .menu-name {
    font-size: 0.75rem;
  }
  
  .clock-in-days {
    font-size: 1.5rem;
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
    width: 60px;
    height: 60px;
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
  
  .system-menu .menu-item {
    padding: 12px 15px;
  }
  
  .menu-text {
    font-size: 0.9rem;
  }
  
  .user-stats {
    gap: 10px;
  }
  
  .stat-item {
    padding: 10px;
  }
  
  .stat-value {
    font-size: 1.2rem;
  }
  
  .stat-label {
    font-size: 0.8rem;
  }
}
</style>