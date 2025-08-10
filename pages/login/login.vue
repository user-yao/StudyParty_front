<template>
		<div class="container">
		  <!-- 软件名称 -->
		  <u-text class="app-name">职引星聚</u-text>
		
		  <!-- 手机号输入 -->
		  <u-input
		    v-model="form.phone"
		    placeholder="请输入手机号"
		    type="number"
		    border="bottom"
		    class="input"
		  ></u-input>
		
		  <!-- 密码输入 -->
		  <u-input
		    v-model="form.password"
		    placeholder="请输入密码"
		    type="password"
		    border="bottom"
		    class="input"
		  ></u-input>
		
		  <!-- 登录按钮 -->
		  <u-button type="primary" class="login-btn" @click="handleLogin">登录</u-button>
		
		  <!-- 注册链接 -->
		  <u-link
		    class="register-link"
		    url="/pages/register/register"
		    type="default"
		    hover-class="none"
		  >
		    还没有账号？立即注册
		  </u-link>
		</div>
</template>

<script>
import {mapActions} from 'vuex'
import webSocketService from '@/utils/websocket.js';

  export default {
    data() {
      return {
        form: {
          phone: '',
          password: ''
        }
      }
    },
    methods: {
      ...mapActions('user', ['login']),
      handleLogin() {
        this.login(this.form).then(res =>{
          if (res.code === 200) {
            console.log(uni.getStorageSync('token'))
            uni.showToast({ title: '登录成功', icon: 'success' });
            // 连接WebSocket
            webSocketService.connect();
            uni.switchTab({ url: '/pages/index/index' }); // 跳转到首页
          } else {
            uni.showToast({ title: res.msg || '登录失败', icon: 'none' });
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    height: 100vh; /* 强制撑满整个视口高度 */
    width: 100%;   /* 强制撑满整个视口宽度 */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .app-name {
    font-size: 56rpx;
    font-weight: bold;
    color: #007aff;
    margin: 120rpx 0 100rpx;
  }

  .input {
    width: 100%;
    margin-bottom: 40rpx;
    font-size: 32rpx;
  }

  .login-btn {
    width: 100%;
    height: 88rpx;
    font-size: 34rpx;
    margin-top: 60rpx;
  }

  .register-link {
    margin-top: 40rpx;
    font-size: 30rpx;
    color: #666;
  }
</style>