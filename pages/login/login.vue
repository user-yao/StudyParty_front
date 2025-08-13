<template>
	 <div class="body">
		 <div class="bg-shapes">
		        <div class="shape shape-1"></div>
		        <div class="shape shape-2"></div>
		        <div class="shape shape-3"></div>
		    </div>
		    
		    <div class="login-wrapper">
		        <div class="logo">
		            <div class="logo-icon">
		                <i class="fas fa-brain"></i>
		            </div>
		            <h1>智学未来</h1>
		            <p>开启你的个性化学习之旅</p>
		        </div>
		        
		        <div class="form-container">
		            <form>
		                <div class="input-group">
		                    <i class="fas fa-user"></i>
		 						<u-input
		 							id="username"
		 						  v-model="form.phone"
		 						  placeholder="请输入手机号"
		 						  type="number"
		 						  border="bottom"
		 						  class="input-field"
		 						></u-input>
		                </div>
		                
		                <div class="input-group">
		                    <i class="fas fa-lock"></i>
		 						<u-input
		 						  v-model="form.password"
		 						  placeholder="请输入密码"
		 						  type="password"
		 						  border="bottom"
		 						  class="input-field"
		 						></u-input>
		                </div>
		                
		                <div class="remember-forgot">
		                    <label class="remember">
		                        <input type="checkbox"> 记住我
		                    </label>
		                    <a href="#" class="forgot-password">忘记密码?</a>
		                </div>
		                
		                <button type="submit" class="btn-login" @click="handleLogin">登 录</button>
		                
		                <div class="divider">
		                    <span>或使用以下方式登录</span>
		                </div>
		                
		                <div class="social-login">
		                    <a href="#" class="social-btn wechat">
		                        <i class="fab fa-weixin"></i>
		                    </a>
		                    <a href="#" class="social-btn qq">
		                        <i class="fab fa-qq"></i>
		                    </a>
		                    <a href="#" class="social-btn">
		                        <i class="fab fa-weibo"></i>
		                    </a>
		                </div>
		                
		                <div class="register-link">
		                    还没有账号? <a href="#">立即注册</a>
		                </div>
		            </form>
		        </div>
		    </div>
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
    * {
               margin: 0;
               padding: 0;
               box-sizing: border-box;
               font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
			   max-height: 100vh;
           }
           
           .body {
               background: linear-gradient(-45deg, #f5f9ff, #f0f7ff, #f5f9ff, #e6f2ff);
               background-size: 400% 400%;
               animation: gradientBG 18s ease infinite;
               display: flex;
			   min-height: 100vh;
               justify-content: center;
               align-items: center;
               padding: 40rpx;
               color: #333;
               overflow: hidden;
           }
           
           .login-wrapper {
               width: 100%;
			   margin-top: 10vh;
               padding: 80rpx 60rpx;
               position: relative;
               z-index: 10;
           }
           
           /* 装饰性动态背景元素 */
           .bg-shapes {
               position: fixed;
               top: 0;
               left: 0;
               width: 100%;
               height: 100%;
               overflow: hidden;
               z-index: 1;
           }
           
           .shape {
               position: absolute;
               border-radius: 50%;
               opacity: 0.05;
               filter: blur(30px);
               animation: float 15s infinite linear;
           }
           
           .shape-1 {
               width: 300px;
               height: 300px;
               background: #4b8df8;
               top: 10%;
               left: 5%;
               animation-duration: 25s;
           }
           
           .shape-2 {
               width: 200px;
               height: 200px;
               background: #ff6b6b;
               top: 60%;
               right: 10%;
               animation-duration: 20s;
               animation-delay: -5s;
           }
           
           .shape-3 {
               width: 150px;
               height: 150px;
               background: #2aae67;
               bottom: 15%;
               left: 15%;
               animation-duration: 18s;
               animation-delay: -8s;
           }
           
           .logo {
               text-align: center;
               margin-bottom: 40px;
               position: relative;
               animation: fadeInUp 0.8s ease-out;
           }
           
           .logo-icon {
               font-size: 3.2rem;
               color: #4b8df8;
               margin-bottom: 15px;
               display: inline-block;
               text-shadow: 0 2px 10px rgba(75, 141, 248, 0.15);
           }
           
           .logo h1 {
               font-size: 1.9rem;
               font-weight: 700;
               color: #2c3e50;
               letter-spacing: -0.5px;
               background: linear-gradient(45deg, #4b6cb7, #4b8df8);
               -webkit-background-clip: text;
               -webkit-text-fill-color: transparent;
               margin-bottom: 8px;
           }
           
           .logo p {
               color: #7f8c8d;
               font-size: 0.95rem;
               font-weight: 300;
           }
           
           .form-container {
               animation: fadeIn 0.6s ease-out 0.2s both;
           }
           
           .input-group {
               margin-bottom: 22px;
               position: relative;
           }
           
           .input-group i {
               position: absolute;
               left: 15px;
               top: 50%;
               transform: translateY(-50%);
               color: #95a5a6;
               font-size: 1.1rem;
           }
           
           .input-field {
               width: 100%;
               padding: 16px 16px 16px 50px;
               border: none;
               background: rgba(255, 255, 255, 0.65);
               border-radius: 12px;
               font-size: 1rem;
               color: #2c3e50;
               transition: all 0.3s ease;
               border: 1px solid rgba(220, 230, 240, 0.7);
               box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
           }
           
           .input-field:focus {
               outline: none;
               border: 1px solid rgba(75, 141, 248, 0.4);
               background: rgba(255, 255, 255, 0.85);
               box-shadow: 0 4px 20px rgba(75, 141, 248, 0.12);
           }
           
           .input-field::placeholder {
               color: #b1bbc6;
               font-weight: 300;
           }
           
           .remember-forgot {
               display: flex;
               justify-content: space-between;
               align-items: center;
               margin-bottom: 25px;
               font-size: 0.9rem;
               animation: fadeIn 0.6s ease-out 0.3s both;
           }
           
           .remember {
               display: flex;
               align-items: center;
               color: #5a6b7c;
           }
           
           .remember input {
               margin-right: 8px;
               accent-color: #4b8df8;
           }
           
           .forgot-password {
               color: #4b8df8;
               text-decoration: none;
               transition: color 0.3s;
               font-weight: 500;
           }
           
           .forgot-password:hover {
               color: #3a6dc7;
               text-decoration: underline;
           }
           
           .btn-login {
               width: 100%;
               padding: 10rpx;
               border: none;
               background: linear-gradient(45deg, #4b8df8, #3a6dc7);
               color: white;
               border-radius: 12px;
               font-size: 1.1rem;
               font-weight: 600;
               cursor: pointer;
               transition: all 0.3s ease;
               margin-bottom: 25px;
               box-shadow: 0 4px 15px rgba(75, 141, 248, 0.25);
               animation: fadeIn 0.6s ease-out 0.4s both;
           }
           
           .btn-login:hover {
               background: linear-gradient(45deg, #3a6dc7, #4b8df8);
               box-shadow: 0 6px 20px rgba(75, 141, 248, 0.35);
               transform: translateY(-2px);
           }
           
           .btn-login:active {
               transform: translateY(0);
           }
           
           .divider {
               display: flex;
               align-items: center;
               margin: 25px 0;
               color: #95a5a6;
               font-size: 0.9rem;
               animation: fadeIn 0.6s ease-out 0.5s both;
           }
           
           .divider::before,
           .divider::after {
               content: '';
               flex: 1;
               height: 1px;
               background: linear-gradient(90deg, transparent, rgba(220, 230, 240, 0.7), transparent);
           }
           
           .divider span {
               padding: 0 15px;
               font-weight: 300;
           }
           
           .social-login {
               display: flex;
               justify-content: center;
               gap: 20px;
               margin-bottom: 30px;
               animation: fadeIn 0.6s ease-out 0.6s both;
           }
           
           .social-btn {
               width: 50px;
               height: 50px;
               border-radius: 50%;
               display: flex;
               justify-content: center;
               align-items: center;
               background: rgba(255, 255, 255, 0.65);
               color: #555;
               font-size: 1.3rem;
               box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
               transition: all 0.3s ease;
               text-decoration: none;
               border: 1px solid rgba(220, 230, 240, 0.5);
           }
           
           .social-btn:hover {
               transform: translateY(-3px);
               box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
               background: rgba(255, 255, 255, 0.85);
           }
           
           .social-btn.wechat {
               color: #2aae67;
           }
           
           .social-btn.qq {
               color: #12b7f5;
           }
           
           .register-link {
               text-align: center;
               color: #5a6b7c;
               font-size: 0.95rem;
               animation: fadeIn 0.6s ease-out 0.7s both;
           }
           
           .register-link a {
               color: #4b8df8;
               text-decoration: none;
               font-weight: 600;
               margin-left: 5px;
               transition: color 0.3s;
           }
           
           .register-link a:hover {
               color: #3a6dc7;
               text-decoration: underline;
           }
           
           /* 动画效果 */
           @keyframes gradientBG {
               0% {
                   background-position: 0% 50%;
               }
               50% {
                   background-position: 100% 50%;
               }
               100% {
                   background-position: 0% 50%;
               }
           }
           
           @keyframes float {
               0% {
                   transform: translate(0, 0) rotate(0deg);
               }
               50% {
                   transform: translate(20px, 15px) rotate(180deg);
               }
               100% {
                   transform: translate(0, 0) rotate(360deg);
               }
           }
           
           @keyframes fadeIn {
               from {
                   opacity: 0;
                   transform: translateY(10px);
               }
               to {
                   opacity: 1;
                   transform: translateY(0);
               }
           }
           
           @keyframes fadeInUp {
               from {
                   opacity: 0;
                   transform: translateY(20px);
               }
               to {
                   opacity: 1;
                   transform: translateY(0);
               }
           }
           
           /* 响应式调整 */
           @media (max-width: 480px) {
               .login-wrapper {
                   padding: 30px 20px;
               }
               
               .logo h1 {
                   font-size: 1.7rem;
               }
               
               .input-field {
                   padding: 14px 14px 14px 45px;
               }
               
               .shape {
                   filter: blur(20px);
               }
           }
</style>