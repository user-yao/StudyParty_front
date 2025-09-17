<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="nav-left" @click="goBack">
        <u-icon name="arrow-left" size="20" color="#333"></u-icon>
      </view>
      <view class="nav-title">设置</view>
      <view class="nav-right"></view>
    </view>
    
    <!-- 设置选项 -->
    <view class="settings-list">
      <!-- 账户安全 -->
      <view class="settings-section">
        <view class="section-title">账户安全</view>
        <view class="settings-item" @click="toChangePassword">
          <view class="item-left">
            <u-icon name="lock" size="18" color="#4361ee"></u-icon>
            <text class="item-text">修改密码</text>
          </view>
          <view class="item-right">
            <u-icon name="arrow-right" size="16" color="#999"></u-icon>
          </view>
        </view>
      </view>
      
      <!-- 个人信息 -->
      <view class="settings-section">
        <view class="section-title">个人信息</view>
        <view class="settings-item" @click="toEditProfile">
          <view class="item-left">
            <u-icon name="edit-pen" size="18" color="#4361ee"></u-icon>
            <text class="item-text">修改个人信息</text>
          </view>
          <view class="item-right">
            <u-icon name="arrow-right" size="16" color="#999"></u-icon>
          </view>
        </view>
      </view>
      
      <!-- 其他设置 -->
      <view class="settings-section">
        <view class="section-title">其他设置</view>
        <view class="settings-item" @click="toAbout">
          <view class="item-left">
            <u-icon name="info-circle" size="18" color="#4361ee"></u-icon>
            <text class="item-text">关于我们</text>
          </view>
          <view class="item-right">
            <u-icon name="arrow-right" size="16" color="#999"></u-icon>
          </view>
        </view>
      </view>
      
      <!-- 退出登录 -->
      <view class="logout-section">
        <u-button 
          type="error" 
          shape="circle" 
          @click="handleLogout"
          :custom-style="{ 
            backgroundColor: '#f8f9fa',
            color: '#ff4d4f',
            border: '1px solid #ff4d4f',
            width: '90%',
            height: '45px',
            marginTop: '30px'
          }"
        >
          退出登录
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
    };
  },
  methods: {
    ...mapActions('user', ['logout']),
    
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },
    
    // 处理退出登录
    handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            this.logout().then(() => {
              uni.reLaunch({
                url: '/pages/login/login'
              });
            });
          }
        }
      });
    },
    
    // 跳转到修改密码页面
    toChangePassword() {
      uni.navigateTo({
        url: '/pages/profile/changePassword'
      });
    },
    
    // 跳转到修改个人信息页面
    toEditProfile() {
      uni.navigateTo({
        url: '/pages/profile/editProfile'
      });
    },
    
    // 跳转到关于我们页面
    toAbout() {
      uni.navigateTo({
        url: '/pages/profile/about'
      });
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #f5f7fb;
  min-height: 100vh;
  padding-top: 5vh; /* 增加顶部间距 */
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.nav-left,
.nav-right {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.settings-list {
  padding: 20px;
}

.settings-section {
  background: white;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.section-title {
  padding: 15px 20px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
}

.item-left {
  display: flex;
  align-items: center;
}

.item-text {
  margin-left: 10px;
  font-size: 15px;
  color: #333;
}

.item-right {
  display: flex;
  align-items: center;
}

.logout-section {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>