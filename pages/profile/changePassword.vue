<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="nav-left" @click="goBack">
        <u-icon name="arrow-left" size="20" color="#333"></u-icon>
      </view>
      <view class="nav-title">修改密码</view>
      <view class="nav-right"></view>
    </view>
    
    <!-- 修改密码表单 -->
    <view class="form-container">
      <view class="form-group">
        <view class="form-label">原密码</view>
        <u-input 
          v-model="oldPassword" 
          placeholder="请输入原密码" 
          type="password"
          border="surround"
          clearable
        />
      </view>
      <view class="form-group">
        <view class="form-label">新密码</view>
        <u-input 
          v-model="newPassword" 
          placeholder="请输入新密码" 
          type="password"
          border="surround"
          clearable
        />
        <view class="password-hint">密码长度至少6位</view>
      </view>
      <view class="form-group">
        <view class="form-label">确认新密码</view>
        <u-input 
          v-model="confirmPassword" 
          placeholder="请确认新密码" 
          type="password"
          border="surround"
          clearable
        />
      </view>
      
      <view class="form-actions">
        <u-button 
          type="primary" 
          @click="changePassword"
          :custom-style="{ 
            backgroundColor: '#4361ee',
            color: '#fff',
            borderRadius: '20px',
            width: '90%',
            height: '45px',
            marginTop: '30px'
          }"
        >
          确认修改
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  },
  computed: {
    ...mapState('user', ['userInfo'])
  },
  methods: {
    ...mapActions('user', ['changePassword']),
    
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },
    
    // 修改密码
    async changePassword() {
      // 表单验证
      if (!this.oldPassword) {
        this.$u.toast('请输入原密码');
        return;
      }
      
      if (!this.newPassword) {
        this.$u.toast('请输入新密码');
        return;
      }
      
      if (this.newPassword.length < 6) {
        this.$u.toast('新密码长度不能少于6位');
        return;
      }
      
      if (this.newPassword !== this.confirmPassword) {
        this.$u.toast('两次输入的密码不一致');
        return;
      }
      
      // 验证原密码是否正确
      if (this.oldPassword !== this.userInfo.password) {
        this.$u.toast('原密码输入错误');
        return;
      }
      
      try {
        uni.showLoading({ title: '修改中...' });
        
        // 调用store中的changePassword方法修改密码
        const res = await this.changePassword({
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
          confirmPassword: this.confirmPassword
        });
        
        if (res.code === 200) {
          this.$u.toast('密码修改成功');
          // 清空表单
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        } else {
          this.$u.toast(res.msg || '密码修改失败');
        }
      } catch (err) {
        console.error('修改密码失败:', err);
        this.$u.toast('密码修改失败');
      } finally {
        uni.hideLoading();
      }
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #f5f7fb;
  min-height: 100vh;
  padding-top: 5vh;
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

.form-container {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-size: 15px;
  color: #333;
  margin-bottom: 10px;
}

.password-hint {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.form-actions {
  display: flex;
  justify-content: center;
}
</style>