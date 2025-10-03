<template>
  <view class="container">
    <!-- 顶部导航 -->
    <header>
      <div class="header-top">
        <div class="logo">
          <u-icon name="arrow-left" size="20" color="#ffffff" @click="goBack"></u-icon>
          <span>技能树</span>
        </div>
        <div class="header-actions">
        </div>
      </div>
    </header>
    
    <view class="content">
      <view class="occupation-input">
        <view class="input-section">
          <text class="label">目标职业</text>
          <view class="input-wrapper">
            <input 
              v-model="targetOccupation"
              placeholder="请输入您想从事的职业"
              class="native-input"
            />
            <u-button 
            style="width: 200rpx;"
              type="primary" 
              size="normal" 
              icon="search"
              @click="generateSkillTree"
              :loading="loading"
            >
              生成
            </u-button>
          </view>
        </view>
      </view>
      
      <view class="skill-tree-container" v-if="skillData.occupation">
        <view class="tree-header">
          <view class="occupation-info">
            <u-tag 
              text="目标职业" 
              type="primary" 
              size="mini" 
              plain
            ></u-tag>
            <text class="occupation-name">{{ skillData.occupation }}</text>
          </view>
          <text class="data-source" v-if="skillData.data_source">
            数据来源：{{ skillData.data_source }}
          </text>
        </view>
        
        <view class="skill-tree-list">
          <view 
            class="skill-level-item" 
            v-for="(level, index) in skillData.skill_tree" 
            :key="index"
          >
            <view class="level-header">
              <view class="level-badge">
                <text class="level-text">L{{ level.level }}</text>
              </view>
              <text class="level-topic">{{ level.topic }}</text>
            </view>
            
            <view class="sub-topics">
              <view 
                class="sub-topic-item" 
                v-for="(subTopic, subIndex) in level.sub_topics" 
                :key="subIndex"
              >
                <u-icon name="checkmark-circle" size="16" color="#4361ee"></u-icon>
                <text class="sub-topic-text">{{ subTopic }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <view class="empty-state" v-else>
        <u-empty 
          mode="data" 
          text="请输入目标职业并生成技能树" 
          icon="http://cdn.uviewui.com/uview/empty/data.png"
        >
        </u-empty>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      targetOccupation: '',
      loading: false,
      skillData: {
        occupation: '',
        skill_tree: [],
        data_source: ''
      }
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    async generateSkillTree() {
      if (!this.targetOccupation.trim()) {
        uni.showToast({
          title: '请输入目标职业',
          icon: 'none'
        })
        return
      }
      
      this.loading = true
      
      try {
        // 调用真实的AI接口
        const res = await this.$store.dispatch('AI/toGetSkillTree', {
          prompt: this.targetOccupation
        })
        
        if (res && res.code === 200) {
          this.skillData = res.data
          uni.showToast({
            title: '技能树生成成功',
            icon: 'success'
          })
        } else {
          uni.showToast({
            title: res.msg || '生成失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('生成技能树失败:', error)
        uni.showToast({
          title: '生成失败，请稍后重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
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

.occupation-input {
  background: white;
  padding: 15px;
  margin-bottom: 15px;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.label {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.native-input {
  width: 80%;
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid #dcdfe6;
  font-size: 14px;
  outline: none;
  border-radius: 4px;
}

.native-input:focus {
  border-color: #4361ee;
}

.input-wrapper :deep(.u-button) {
  padding: 0 12px;
  height: 36px;
  border-radius: 4px;
}

.skill-tree-container {
  background: white;
  padding: 15px;
}

.tree-header {
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
}

.occupation-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.occupation-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.data-source {
  font-size: 12px;
  color: #999;
}

.skill-tree-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skill-level-item {
  display: flex;
  flex-direction: column;
}

.level-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.level-badge {
  background: linear-gradient(135deg, #4361ee, #3f37c9);
  border-radius: 20px;
  padding: 4px 12px;
}

.level-text {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.level-topic {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.sub-topics {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 30px;
}

.sub-topic-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.sub-topic-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.empty-state {
  background: white;
  padding: 30px 15px;
  text-align: center;
}

.empty-state :deep(.u-empty) {
  padding: 15px 0;
}
</style>