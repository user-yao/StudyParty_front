<template>
  <view class="container">
    <u-navbar title="注册" />
    <u-form ref="uForm" :model="form" :rules="rules">
      <u-form-item label="手机号" prop="phone">
        <u-input v-model="form.phone" placeholder="请输入手机号" type="number" />
      </u-form-item>
      <u-form-item label="密码" prop="password">
        <u-input v-model="form.password" placeholder="请输入密码" type="password" />
      </u-form-item>
      <u-form-item label="确认密码" prop="confirmPassword">
        <u-input v-model="form.confirmPassword" placeholder="请再次输入密码" type="password" />
      </u-form-item>
    </u-form>
    <u-button type="primary" @click="handleRegister" style="margin-top: 30rpx;">立即注册</u-button>
  </view>
</template>

<script>
  import { register } from '../../API/user/user.js';
  export default {
    data() {
      return {
        form: {
          phone: '',
          password: '',
          confirmPassword: ''
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
          }]
        }
      }
    },
    methods: {
      async handleRegister() {
        const valid = await this.$refs.uForm.validate();
        if (!valid) return;
        const res = await register(this.form);
        if (res.code === 200) {
          uni.showToast({ title: '注册成功', icon: 'success' });
          uni.navigateBack();
        } else {
          uni.showToast({ title: res.msg || '注册失败', icon: 'none' });
        }
      }
    }
  }
</script>

<style scoped>
  .container {
    padding: 40rpx;
  }
</style>