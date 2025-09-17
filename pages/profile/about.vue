<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="nav-left" @click="goBack">
        <u-icon name="arrow-left" size="20" color="#333"></u-icon>
      </view>
      <view class="nav-title">关于我们</view>
      <view class="nav-right"></view>
    </view>
    
    <!-- 关于我们内容 -->
    <view class="about-content">
      <view class="app-logo">
        <u-icon name="star" size="60" color="#4361ee"></u-icon>
      </view>
      <view class="app-name">学习派</view>
      <view class="app-version">v1.0.0</view>
      <view class="app-description">
        学习派是一个专注于学习社交的应用，帮助用户更好地管理学习任务、加入学习小组、与好友交流学习心得。
      </view>
      
      <view class="features">
        <view class="feature-item">
          <u-icon name="order" size="24" color="#4361ee"></u-icon>
          <text class="feature-text">任务管理</text>
        </view>
        <view class="feature-item">
          <u-icon name="account" size="24" color="#4361ee"></u-icon>
          <text class="feature-text">小组协作</text>
        </view>
        <view class="feature-item">
          <u-icon name="chat" size="24" color="#4361ee"></u-icon>
          <text class="feature-text">即时通讯</text>
        </view>
        <view class="feature-item">
          <u-icon name="calendar" size="24" color="#4361ee"></u-icon>
          <text class="feature-text">学习打卡</text>
        </view>
      </view>
      
      <view class="contact-info">
        <view class="contact-item">
          <u-icon name="email" size="18" color="#666"></u-icon>
          <text class="contact-text">support@studyparty.com</text>
        </view>
        <view class="contact-item">
          <u-icon name="phone" size="18" color="#666"></u-icon>
          <text class="contact-text">400-123-4567</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack();
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

.about-content {
  padding: 30px 20px;
  text-align: center;
}

.app-logo {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.app-name {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.app-version {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.app-description {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 40px;
}

.features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.feature-text {
  margin-top: 10px;
  font-size: 14px;
  color: #333;
}

.contact-info {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.contact-item:last-child {
  margin-bottom: 0;
}

.contact-text {
  margin-left: 10px;
  font-size: 15px;
  color: #666;
}
</style>