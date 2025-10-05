<template>
  <view class="body">
    <div class="bg-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
    
    <view class="register-wrapper">
      <view class="logo">
        <div class="logo-icon">
          <i class="fas fa-brain"></i>
        </div>
        <h1>智学未来</h1>
        <p>开启你的个性化学习之旅</p>
      </view>
      
      <u-form ref="uForm" :model="form" :rules="rules" class="form-container">
        <u-form-item label="手机号" prop="phone">
          <u-input v-model="form.phone" placeholder="请输入手机号" type="number" border="bottom" class="input-field" />
        </u-form-item>
        
        <u-form-item label="密码" prop="password">
          <u-input v-model="form.password" placeholder="请输入密码" type="password" border="bottom" class="input-field" />
        </u-form-item>
        
        <u-form-item label="确认密码" prop="confirmPassword">
          <u-input v-model="form.confirmPassword" placeholder="请再次输入密码" type="password" border="bottom" class="input-field" />
        </u-form-item>
        
        <u-form-item label="姓名" prop="name">
          <u-input v-model="form.name" placeholder="请输入姓名" border="bottom" class="input-field" />
        </u-form-item>
        
        <u-form-item label="邮箱" prop="email">
          <u-input v-model="form.email" placeholder="请输入邮箱" border="bottom" class="input-field" />
        </u-form-item>
        
        <u-form-item label="性别" prop="sex">
          <u-radio-group v-model="form.sex" placement="row">
            <u-radio label="男" name="男"></u-radio>
            <u-radio label="女" name="女"></u-radio>
          </u-radio-group>
        </u-form-item>
        
        <u-form-item label="身份" prop="status">
          <u-radio-group v-model="form.status" placement="row">
            <u-radio label="学生" name="1"></u-radio>
            <u-radio label="老师" name="2"></u-radio>
            <u-radio label="企业" name="3"></u-radio>
          </u-radio-group>
        </u-form-item>
        
        <u-form-item :label="form.status === '3' ? '公司' : '学校'" prop="school">
          <u-input v-model="form.school" :placeholder="'请输入' + (form.status === '3' ? '公司名称' : '学校名称')" border="bottom" class="input-field" />
        </u-form-item>
        
        <u-form-item :label="form.status === '3' ? '部门' : '专业'" prop="major">
          <u-input v-model="form.major" :placeholder="'请输入' + (form.status === '3' ? '部门名称' : '专业名称')" border="bottom" class="input-field" />
        </u-form-item>
        
        <u-form-item :label="form.status === '3' ? '职位' : '年级'" prop="grade">
          <u-input v-model="form.grade" :placeholder="'请输入' + (form.status === '3' ? '职位' : '年级')" border="bottom" class="input-field" />
        </u-form-item>
        
        <u-button type="primary" @click="handleRegister" class="btn-register">立即注册</u-button>
        
        <div class="login-link">
          已有账号? <a href="#" @click.prevent="goToLogin">立即登录</a>
        </div>
      </u-form>
    </view>
  </view>
</template>

<script>
  import { mapActions } from 'vuex';
  
  export default {
    data() {
      return {
        form: {
          phone: '',
          password: '',
          confirmPassword: '',
          name: '',
          email: '',
          sex: '男',
          status: '1', // 默认为学生
          school: '',
          major: '',
          grade: ''
        },
        rules: {
          phone: [{
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }, {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }, {
            min: 6,
            max: 20,
            message: '密码长度6-20位',
            trigger: 'blur'
          }],
          confirmPassword: [{
            required: true,
            message: '请确认密码',
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              if (value !== this.form.password) {
                callback(new Error('两次输入的密码不一致'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }],
          name: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          email: [{
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          }, {
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: '邮箱格式不正确',
            trigger: 'blur'
          }],
          school: [{
            required: true,
            message: () => this.form.status === '3' ? '请输入公司名称' : '请输入学校名称',
            trigger: 'blur'
          }],
          major: [{
            required: true,
            message: () => this.form.status === '3' ? '请输入部门名称' : '请输入专业名称',
            trigger: 'blur'
          }],
          grade: [{
            required: true,
            message: () => this.form.status === '3' ? '请输入职位' : '请输入年级',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      ...mapActions('user', ['register']),
      
      async handleRegister() {
        const valid = await this.$refs.uForm.validate();
        if (!valid) return;
        
        // 调用store中的注册方法
        const res = await this.register(this.form);
        if (res.code === 200) {
          uni.showToast({ title: '注册成功', icon: 'success' });
          // 注册成功后跳转到登录页面
          uni.navigateTo({ url: '/pages/login/login' });
        } else {
          uni.showToast({ title: res.msg || '注册失败', icon: 'none' });
        }
      },
      
      goToLogin() {
        uni.navigateTo({ url: '/pages/login/login' });
      }
    },
    
    // 在组件创建时确保form.status有默认值
    created() {
      if (!this.form.status) {
        this.form.status = '1';
      }
    }
  }
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.body {
  background: linear-gradient(-45deg, #f5f9ff, #f0f7ff, #f5f9ff, #e6f2ff);
  background-size: 400% 400%;
  animation: gradientBG 18s ease infinite;
  min-height: 100vh;
  padding: 40rpx;
  color: #333;
  overflow: hidden;
  position: relative;
}

.register-wrapper {
  width: 100%;
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

.input-field {
  width: 100%;
  padding: 16px 16px 16px 16px;
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

.btn-register {
  width: 100%;
  padding: 16px;
  border: none;
  background: linear-gradient(45deg, #4b8df8, #3a6dc7);
  color: white;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  margin-bottom: 25px;
  box-shadow: 0 4px 15px rgba(75, 141, 248, 0.25);
  animation: fadeIn 0.6s ease-out 0.4s both;
}

.btn-register:hover {
  background: linear-gradient(45deg, #3a6dc7, #4b8df8);
  box-shadow: 0 6px 20px rgba(75, 141, 248, 0.35);
  transform: translateY(-2px);
}

.btn-register:active {
  transform: translateY(0);
}

.login-link {
  text-align: center;
  color: #5a6b7c;
  font-size: 0.95rem;
  animation: fadeIn 0.6s ease-out 0.7s both;
}

.login-link a {
  color: #4b8df8;
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
  transition: color 0.3s;
}

.login-link a:hover {
  color: #3a6dc7;
  text-decoration: underline;
}

.u-radio-group {
  width: 100%;
  display: flex;
  justify-content: space-around;
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
  .register-wrapper {
    padding: 30px 20px;
  }

  .logo h1 {
    font-size: 1.7rem;
  }

  .input-field {
    padding: 14px;
  }

  .shape {
    filter: blur(20px);
  }
  
  .btn-register {
    padding: 14px;
  }
}
</style>