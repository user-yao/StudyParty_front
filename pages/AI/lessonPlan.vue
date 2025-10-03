<template>
  <view class="container">
    <!-- 顶部导航 -->
    <header>
      <div class="header-top">
        <div class="logo">
          <u-icon name="arrow-left" size="20" color="#ffffff" @click="goBack"></u-icon>
          <span>教案修改</span>
        </div>
        <div class="header-actions">
        </div>
      </div>
    </header>
    
    <view class="content">
      <view class="lesson-form">
        <view class="form-section">
          <view class="section-title">教案内容输入</view>
          <view class="form-item">
            <text class="label">请输入当前教案内容（最多5000字符）</text>
            <u--textarea
              v-model="currentLessonContent"
              placeholder="请在此输入您需要检查的教案内容，系统将分析并提供优化建议..."
              border="surround"
              autoHeight
              :maxlength="5000"
              :height="150"
            ></u--textarea>
            <view class="char-count">
              <text :class="{ 'char-limit-exceeded': currentLessonContent.length > 5000 }">
                {{ currentLessonContent.length }}/5000
              </text>
            </view>
          </view>
          
          <view class="form-actions">
            <u-button 
              type="primary" 
              size="normal"
              @click="generateSuggestions"
              :loading="loading"
              :disabled="currentLessonContent.length > 5000"
            >
              生成优化建议
            </u-button>
          </view>
        </view>
        
        <!-- 加载动画区域 -->
        <view v-if="loading" class="loading-overlay">
          <view class="loading-content">
            <view class="loading-spinner">
              <u-loading-icon mode="circle" size="28" color="#666666"></u-loading-icon>
            </view>
            <view class="loading-text">AI正在分析教案内容...</view>
            <view class="loading-dots">
              <text class="dot dot1">.</text>
              <text class="dot dot2">.</text>
              <text class="dot dot3">.</text>
            </view>
          </view>
        </view>
        
        <view class="suggestions-section" v-if="analysisResult.outdated_sections.length > 0 && !loading">
          <view class="section-title">优化建议</view>
          <view class="suggestions-list">
            <view 
              class="suggestion-item" 
              v-for="(item, index) in analysisResult.outdated_sections" 
              :key="index"
            >
              <view class="suggestion-header">
                <u-tag 
                  :text="getIssueTypeText(item.issue_type)" 
                  :type="getIssueTypeColor(item.issue_type)"
                  size="mini"
                ></u-tag>
                <text class="suggestion-index">建议 {{ index + 1 }}</text>
              </view>
              
              <view class="suggestion-content">
                <view class="content-section">
                  <text class="section-label">原文内容</text>
                  <view class="content-text original-content">
                    <text>{{ item.original_content }}</text>
                  </view>
                </view>
                
                <view class="content-section">
                  <text class="section-label">问题说明</text>
                  <view class="content-text reason-content">
                    <text>{{ item.revision_reason }}</text>
                  </view>
                </view>
                
                <view class="content-section">
                  <text class="section-label">优化建议</text>
                  <view class="content-text suggested-content">
                    <text>{{ item.suggested_revision }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        
        <view class="empty-state" v-else-if="analysisCompleted && !loading">
          <u-empty 
            mode="permission" 
            text="未发现需要优化的内容" 
            icon="http://cdn.uviewui.com/uview/empty/permission.png"
          >
            <u-button 
              slot="bottom" 
              type="primary" 
              icon="checkmark-circle"
              size="small"
            >
              教案内容良好
            </u-button>
          </u-empty>
        </view>
        
        <view class="empty-state" v-else-if="!loading">
          <u-empty 
            mode="data" 
            text="请输入教案内容并点击生成按钮" 
            icon="http://cdn.uviewui.com/uview/empty/data.png"
          >
          </u-empty>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      currentLessonContent: '',
      loading: false,
      analysisCompleted: false,
      analysisResult: {
        outdated_sections: []
      }
    }
  },
  methods: {
    ...mapActions('AI', ['toTeachingPlan']),
    goBack() {
      uni.navigateBack()
    },
    async generateSuggestions() {
      if (!this.currentLessonContent.trim()) {
        uni.showToast({
          title: '请输入教案内容',
          icon: 'none'
        })
        return
      }
      
      // 检查字符数是否超过限制
      if (this.currentLessonContent.length > 5000) {
        uni.showToast({
          title: '教案内容超过5000字符限制',
          icon: 'none'
        })
        return
      }
      
      this.loading = true
      this.analysisCompleted = false
      
      try {
        // 添加一个小延迟，确保用户能看到加载动画
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 调用 Vuex store 中的 toTeachingPlan 方法
        const response = await this.toTeachingPlan({
          prompt: this.currentLessonContent,
        });
        // 处理返回的数据
        if (response.code === 200) {
          this.analysisResult = response.data;
          this.analysisCompleted = true;
          
          uni.showToast({
            title: `发现${this.analysisResult.outdated_sections.length}个优化点`,
            icon: 'success'
          });
        } else {
          uni.showToast({
            title: response.msg || '请求失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('请求失败:', error);
        uni.showToast({
          title: '请求失败，请稍后再试',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    getIssueTypeText(type) {
      const typeMap = {
        '数据过时': '数据过时',
        '资源失效': '资源失效',
        '标准更新': '标准更新',
        '方法陈旧': '方法陈旧'
      }
      return typeMap[type] || type
    },
    getIssueTypeColor(type) {
      const colorMap = {
        '数据过时': 'error',
        '资源失效': 'warning',
        '标准更新': 'primary',
        '方法陈旧': 'info'
      }
      return colorMap[type] || 'default'
    }
  }
}
</script>

<style scoped>
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

.header-actions {
  display: flex;
  gap: 20px;
  align-items: center;
}

.header-actions i {
  font-size: 1.3rem;
  cursor: pointer;
}

.container {
  min-height: 100vh;
  background-color: #f5f7fb;
}

.content {
  padding: 15px;
  padding-top: 20px;
}

.page-title {
  margin-bottom: 20px;
}

.title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 6px;
}

.subtitle {
  font-size: 13px;
  color: #666;
}

.lesson-form {
  background: white;
  padding: 15px;
}

.form-section {
  margin-bottom: 20px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.form-item {
  margin-bottom: 15px;
}

.form-item:last-child {
  margin-bottom: 0;
}

.label {
  display: block;
  font-size: 13px;
  color: #333;
  margin-bottom: 6px;
  font-weight: 500;
}

.char-count {
  text-align: right;
  margin-top: 5px;
}

.char-count text {
  font-size: 12px;
  color: #999;
}

.char-limit-exceeded {
  color: #e53935 !important;
}

.form-actions {
  margin-top: 15px;
  text-align: center;
}

.suggestions-section {
  margin-top: 25px;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.suggestion-item {
  border-left: 3px solid #eee;
  padding-left: 10px;
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

.suggestion-index {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.suggestion-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px 0 15px 0;
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-label {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.content-text {
  font-size: 13px;
  line-height: 1.5;
  padding: 8px 0;
}

.original-content {
  color: #e53935;
}

.reason-content {
  color: #1e88e5;
}

.suggested-content {
  color: #43a047;
}

.empty-state {
  padding: 20px 0;
  text-align: center;
}

.empty-state :deep(.u-empty) {
  padding: 15px 0;
}

:deep(.u-button--primary) {
  background: linear-gradient(135deg, #4361ee, #3f37c9);
  border: none;
}

:deep(.u-button--primary--loading) {
  background: linear-gradient(135deg, #4361ee, #3f37c9);
}

:deep(.u-button--primary--disabled) {
  background: #cccccc;
}

/* 加载动画样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(245, 245, 245, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  padding: 30px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  margin-bottom: 20px;
}

.loading-text {
  font-size: 16px;
  color: #666666;
  margin-bottom: 10px;
}

.loading-dots {
  display: flex;
  justify-content: center;
  height: 24px;
  align-items: center;
}

.dot {
  font-size: 24px;
  animation: dotFade 1.5s infinite;
  opacity: 0;
  line-height: 1;
  color: #999999;
}

.dot1 {
  animation-delay: 0s;
}

.dot2 {
  animation-delay: 0.5s;
}

.dot3 {
  animation-delay: 1s;
}

@keyframes dotFade {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>