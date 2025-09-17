<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="nav-left" @click="goBack">
        <u-icon name="arrow-left" size="20" color="#333"></u-icon>
      </view>
      <view class="nav-title">修改个人信息</view>
      <view class="nav-right"></view>
    </view>
    
    <!-- 修改个人信息表单 -->
    <view class="form-container">
      <view class="avatar-section">
        <view class="avatar-label">头像</view>
        <view class="avatar-content">
          <image 
            :src="getUserAvatar()" 
            class="avatar-image" 
            mode="aspectFill" 
            @click="chooseAvatar"
          ></image>
          <u-icon 
            name="camera" 
            size="20" 
            color="#fff" 
            class="camera-icon"
            @click="chooseAvatar"
          ></u-icon>
        </view>
      </view>
      
      <view class="form-group">
        <view class="form-label">昵称</view>
        <u-input 
          v-model="form.name" 
          placeholder="请输入昵称" 
          border="surround"
          clearable
        />
      </view>
      
      <view class="form-group">
        <view class="form-label">性别</view>
        <view class="gender-selection">
          <view 
            class="gender-option" 
            :class="{ active: form.sex === '男' }"
            @click="form.sex = '男'"
          >
            <u-icon name="man" size="24" color="#4361ee"></u-icon>
            <text>男</text>
          </view>
          <view 
            class="gender-option" 
            :class="{ active: form.sex === '女' }"
            @click="form.sex = '女'"
          >
            <u-icon name="woman" size="24" color="#f72585"></u-icon>
            <text>女</text>
          </view>
        </view>
      </view>
      
      <view class="form-group">
        <view class="form-label">学校</view>
        <u-input 
          v-model="form.school" 
          placeholder="请输入学校名称" 
          border="surround"
          clearable
        />
      </view>
      
      <view class="form-group">
        <view class="form-label">专业</view>
        <u-input 
          v-model="form.major" 
          placeholder="请输入专业名称" 
          border="surround"
          clearable
        />
      </view>
      
      <view class="form-group">
        <view class="form-label">年级</view>
        <u-input 
          v-model="form.grade" 
          placeholder="请输入年级" 
          border="surround"
          clearable
        />
      </view>
      
      <view class="form-group">
        <view class="form-label">手机号码</view>
        <u-input 
          v-model="form.phone" 
          placeholder="请输入手机号码" 
          border="surround"
          clearable
        />
      </view>
      
      <view class="form-group">
        <view class="form-label">电子邮箱</view>
        <u-input 
          v-model="form.email" 
          placeholder="请输入电子邮箱" 
          border="surround"
          clearable
        />
      </view>
      
      <view class="form-actions">
        <u-button 
          type="primary" 
          @click="saveProfile"
          :custom-style="{ 
            backgroundColor: '#4361ee',
            color: '#fff',
            borderRadius: '20px',
            width: '90%',
            height: '45px',
            marginTop: '30px'
          }"
        >
          保存
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { updateUser, updateHead } from '@/API/user/user.js';
import { imageUrl } from '@/config/config.js';

export default {
  data() {
    return {
      form: {
        name: '',
        sex: '男',
        school: '',
        major: '',
        grade: '',
        phone: '',
        email: ''
      },
      imageUrl: imageUrl
    };
  },
  computed: {
    ...mapState('user', ['userInfo'])
  },
  onLoad() {
    // 初始化表单数据
    this.form = {
      name: this.userInfo.name || '',
      sex: this.userInfo.sex || '男',
      school: this.userInfo.school || '',
      major: this.userInfo.major || '',
      grade: this.userInfo.grade || '',
      phone: this.userInfo.phone || '',
      email: this.userInfo.email || ''
    };
  },
  methods: {
    ...mapActions('user', ['selectUser']),
    
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },
    
    // 获取用户头像
    getUserAvatar() {
      if (this.userInfo.head) {
        return this.imageUrl + this.userInfo.head;
      }
      // 默认头像
      return this.imageUrl + '/head/group.png';
    },
    
    // 选择头像
    chooseAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          this.uploadAvatar(tempFilePath);
        }
      });
    },
    
    // 上传头像
    async uploadAvatar(filePath) {
      uni.showLoading({ title: '上传中...' });
      
      try {
        // 这里应该调用实际的上传接口
        // 模拟上传成功
        setTimeout(() => {
          uni.hideLoading();
          this.$u.toast('头像上传成功');
        }, 1000);
      } catch (err) {
        uni.hideLoading();
        this.$u.toast('头像上传失败');
      }
    },
    
    // 保存个人信息
    saveProfile() {
      // 表单验证
      if (!this.form.name) {
        this.$u.toast('请输入昵称');
        return;
      }
      
      if (!this.form.school) {
        this.$u.toast('请输入学校名称');
        return;
      }
      
      if (!this.form.major) {
        this.$u.toast('请输入专业名称');
        return;
      }
      
      // 调用API更新用户信息
      const userData = {
        name: this.form.name,
        sex: this.form.sex,
        school: this.form.school,
        major: this.form.major,
        grade: this.form.grade,
        phone: this.form.phone,
        email: this.form.email
      };
      
      updateUser(userData).then(res => {
        if (res.code === 200) {
          this.$u.toast('信息保存成功');
          // 更新store中的用户信息
          this.selectUser({ id: this.userInfo.id });
        } else {
          this.$u.toast(res.msg || '信息保存失败');
        }
      }).catch(err => {
        console.error('保存信息失败:', err);
        this.$u.toast('信息保存失败');
      });
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

.avatar-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border-radius: 12px;
  padding: 15px 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.avatar-label {
  font-size: 15px;
  color: #333;
}

.avatar-content {
  position: relative;
}

.avatar-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(45deg, #4895ef, #4cc9f0);
}

.camera-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #4361ee;
  border-radius: 50%;
  padding: 5px;
}

.form-group {
  background: white;
  border-radius: 12px;
  padding: 15px 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-label {
  font-size: 15px;
  color: #333;
  margin-bottom: 10px;
}

.gender-selection {
  display: flex;
  gap: 20px;
}

.gender-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  border-radius: 12px;
  background: #f8f9fa;
  cursor: pointer;
}

.gender-option.active {
  background: #e0e7ff;
  border: 1px solid #4361ee;
}

.gender-option text {
  margin-top: 5px;
  font-size: 14px;
  color: #333;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>