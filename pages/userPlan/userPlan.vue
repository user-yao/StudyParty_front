<template>
  <view class="user-plan-container">
    <!-- 顶部导航 -->
    <header class="app-header">
      <div class="header-top">
        <div class="logo">
          <u-icon name="arrow-left" size="24" color="#ffffff" @click="goBack"></u-icon>
          <span>学习计划</span>
        </div>
        <div class="header-actions">
          <u-icon name="plus" size="24" color="#ffffff" @click="showAddPlanModal"></u-icon>
        </div>
      </div>
    </header>

    <!-- 页面内容 -->
    <view class="content">
      <!-- 加载状态 -->
      <view v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在加载计划...</p>
      </view>

      <!-- 计划列表 -->
      <view v-else>
        <!-- 未开始的计划 -->
        <view class="section" v-if="pendingPlans.length > 0">
          <view class="section-header">
            <view class="section-title">
              <u-icon name="clock" size="18" color="#333"></u-icon>
              <text>未开始 ({{ pendingPlans.length }})</text>
            </view>
          </view>
          <view class="plan-list">
            <view 
              v-for="plan in pendingPlans" 
              :key="plan.id"
              class="plan-card"
            >
              <view class="plan-content">
                <view class="plan-text">{{ plan.planContext }}</view>
                <view class="plan-time">
                  <u-icon name="calendar" size="14" color="#999"></u-icon>
                  <text>{{ plan.startTime ? formatDate(plan.startTime) : '未设置开始时间' }}</text>
                </view>
              </view>
              <view class="plan-actions">
                <u-button 
                  type="primary" 
                  size="mini" 
                  shape="circle" 
                  :plain="false" 
                  :border="false" 
                  @click="startPlan(plan)"
                >
                  开始
                </u-button>
                <u-button 
                  type="error" 
                  size="mini" 
                  shape="circle" 
                  :plain="true" 
                  :border="true" 
                  @click="deletePlan(plan)"
                >
                  删除
                </u-button>
              </view>
            </view>
          </view>
        </view>

        <!-- 进行中的计划 -->
        <view class="section" v-if="ongoingPlans.length > 0">
          <view class="section-header">
            <view class="section-title">
              <u-icon name="play-circle" size="18" color="#333"></u-icon>
              <text>进行中 ({{ ongoingPlans.length }})</text>
            </view>
          </view>
          <view class="plan-list">
            <view 
              v-for="plan in ongoingPlans" 
              :key="plan.id"
              class="plan-card"
            >
              <view class="plan-content">
                <view class="plan-text">{{ plan.planContext }}</view>
                <view class="plan-time">
                  <u-icon name="calendar" size="14" color="#999"></u-icon>
                  <text>开始于 {{ plan.startTime ? formatDate(plan.startTime) : '未知时间' }}</text>
                </view>
              </view>
              <view class="plan-actions">
                <u-button 
                  type="success" 
                  size="mini" 
                  shape="circle" 
                  :plain="false" 
                  :border="false" 
                  @click="completePlan(plan)"
                >
                  完成
                </u-button>
                <u-button 
                  type="error" 
                  size="mini" 
                  shape="circle" 
                  :plain="true" 
                  :border="true" 
                  @click="deletePlan(plan)"
                >
                  删除
                </u-button>
              </view>
            </view>
          </view>
        </view>

        <!-- 已完成的计划 -->
        <view class="section" v-if="completedPlans.length > 0">
          <view class="section-header">
            <view class="section-title">
              <u-icon name="checkmark-circle" size="18" color="#333"></u-icon>
              <text>已完成 ({{ completedPlans.length }})</text>
            </view>
          </view>
          <view class="plan-list">
            <view 
              v-for="plan in completedPlans" 
              :key="plan.id"
              class="plan-card completed"
            >
              <view class="plan-content">
                <view class="plan-text">{{ plan.planContext }}</view>
                <view class="plan-time">
                  <u-icon name="calendar" size="14" color="#999"></u-icon>
                  <text>
                    {{ plan.startTime ? formatDate(plan.startTime) : '未知开始时间' }} 
                    - 
                    {{ plan.endTime ? formatDate(plan.endTime) : '未知完成时间' }}
                  </text>
                </view>
                <view class="plan-duration" v-if="plan.startTime && plan.endTime">
                  <u-icon name="hourglass" size="14" color="#999"></u-icon>
                  <text>学习时长: {{ calculateDuration(plan.startTime, plan.endTime) }}</text>
                </view>
              </view>
              <view class="plan-actions">
                <u-button 
                  type="error" 
                  size="mini" 
                  shape="circle" 
                  :plain="true" 
                  :border="true" 
                  @click="deletePlan(plan)"
                >
                  删除
                </u-button>
              </view>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view class="empty-state" v-if="allPlans.length === 0">
          <u-icon name="file-text" size="48" color="#e9ecef"></u-icon>
          <h3>暂无学习计划</h3>
          <p>点击右上角"+"按钮添加你的第一个学习计划</p>
        </view>
      </view>
    </view>

    <!-- 添加计划弹窗 -->
    <u-popup :show="showAddModal" mode="bottom" border-radius="14" height="auto">
      <view class="modal-container">
        <view class="modal-header">
          <text class="modal-title">添加学习计划</text>
          <u-icon name="close" size="20" color="#999" @click="closeAddPlanModal"></u-icon>
        </view>
        <view class="modal-content">
          <u-form :model="newPlan" ref="planForm">
            <u-form-item label="计划内容" prop="planContext">
              <u-input 
                v-model="newPlan.planContext" 
                placeholder="请输入学习计划内容" 
                type="textarea"
                :border="true"
              />
            </u-form-item>
            <u-form-item label="开始时间" prop="startTime">
              <u-input 
                v-model="newPlan.displayStartTime" 
                placeholder="请选择开始时间" 
                type="select"
                @click="showStartDatePicker = true"
              />
            </u-form-item>
          </u-form>
        </view>
        <view class="modal-footer">
          <u-button 
            type="primary" 
            shape="circle" 
            :plain="false" 
            :border="false" 
            @click="addPlan"
          >
            确定
          </u-button>
        </view>
      </view>
    </u-popup>

    <!-- 日期选择器 -->
    <u-datetime-picker
      :show="showStartDatePicker"
      :value="newPlan.startTime"
      mode="datetime"
      @confirm="onStartDateConfirm"
      @cancel="showStartDatePicker = false"
    ></u-datetime-picker>
  </view>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'UserPlan',
  data() {
    const now = Date.now() + 60 * 60 * 1000; // 当前时间加1小时
    return {
      loading: false,
      showAddModal: false,
      showStartDatePicker: false,
      newPlan: {
        planContext: '',
        startTime: now, // 时间戳，用于网络传输
        displayStartTime: '' // 格式化后的日期，用于显示
      },
      userPlans: []
    }
  },
  computed: {
    // 获取计划数据的通用方法
    getPlansData() {
      if (!this.userPlans || this.userPlans.length === 0) return [];
      
      // 根据API返回的数据格式，userPlans是一个包含两个数组的数组
      // 第一个数组是未完成的计划，第二个数组是已完成的计划
      let plans = [];
      if (Array.isArray(this.userPlans) && this.userPlans.length >= 2) {
        // 合并两个数组中的所有计划
        const pendingPlans = Array.isArray(this.userPlans[0]) ? this.userPlans[0] : [];
        const completedPlans = Array.isArray(this.userPlans[1]) ? this.userPlans[1] : [];
        plans = [...pendingPlans, ...completedPlans];
      }
      
      return plans;
    },
    
    // 未开始的计划 (isStart=0 且 isEnd=0)
    pendingPlans() {
      const plans = this.getPlansData;
      return plans.filter(plan => plan.isStart === 0 && plan.isEnd === 0);
    },
    
    // 进行中的计划 (isStart=1 且 isEnd=0)
    ongoingPlans() {
      const plans = this.getPlansData;
      return plans.filter(plan => plan.isStart === 1 && plan.isEnd === 0);
    },
    
    // 已完成的计划 (isEnd=1)
    completedPlans() {
      const plans = this.getPlansData;
      return plans.filter(plan => plan.isEnd === 1);
    },
    
    // 所有计划
    allPlans() {
      return this.getPlansData;
    }
  },
  methods: {
    ...mapActions({
      getUserPlans: "userPlan/getUserPlans",
      addUserPlan: "userPlan/addUserPlan",
      deleteUserPlan: "userPlan/deleteUserPlan",
      startUserPlan: "userPlan/startUserPlan",
      endUserPlan: "userPlan/endUserPlan"
    }),
    
    // 返回上一页
    goBack() {
      uni.navigateBack({
        delta: 1
      });
    },
    
    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return '未设置';
      
      // 处理不同的日期格式
      let date;
      if (typeof dateString === 'number') {
        // 如果是时间戳
        date = new Date(dateString);
      } else if (typeof dateString === 'string') {
        // 如果是字符串格式
        date = new Date(dateString);
      } else {
        return '未知时间';
      }
      
      // 检查日期是否有效
      if (isNaN(date.getTime())) {
        return '无效时间';
      }
      
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    },
    
    // 计算学习时长
    calculateDuration(startTime, endTime) {
      if (!startTime || !endTime) return '未知';
      
      // 处理不同的时间格式
      let start, end;
      
      if (typeof startTime === 'number') {
        // 时间戳格式
        start = new Date(startTime);
      } else if (typeof startTime === 'string') {
        // 字符串格式
        start = new Date(startTime);
      } else {
        return '未知';
      }
      
      if (typeof endTime === 'number') {
        // 时间戳格式
        end = new Date(endTime);
      } else if (typeof endTime === 'string') {
        // 字符串格式
        end = new Date(endTime);
      } else {
        return '未知';
      }
      
      // 检查日期是否有效
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return '无效时间';
      }
      
      const diffMs = end - start; // 毫秒差
      
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (diffDays > 0) {
        return `${diffDays}天${diffHours}小时${diffMinutes}分钟`;
      } else if (diffHours > 0) {
        return `${diffHours}小时${diffMinutes}分钟`;
      } else {
        return `${diffMinutes}分钟`;
      }
    },
    
    // 显示添加计划弹窗
    showAddPlanModal() {
      console.log('点击添加计划按钮'); // 添加调试日志
      const oneHourLater = Date.now() + 60 * 60 * 1000; // 当前时间加1小时
      this.newPlan = {
        planContext: '',
        startTime: oneHourLater, // 时间戳，用于网络传输
        displayStartTime: this.formatDate(oneHourLater) // 格式化后的日期，用于显示
      };
      this.showAddModal = true;
      this.showStartDatePicker = false; // 确保时间选择器关闭
    },
    
    // 关闭添加计划弹窗
    closeAddPlanModal() {
      console.log('关闭添加计划弹窗'); // 添加调试日志
      this.showAddModal = false;
    },
    
    // 添加计划
    async addPlan() {
      console.log('添加计划按钮被点击'); // 添加调试日志
      if (!this.newPlan.planContext.trim()) {
        uni.showToast({
          title: '请输入计划内容',
          icon: 'none'
        });
        return;
      }
      
      try {
        // 准备发送给后端的数据
        const planData = {
          planContext: this.newPlan.planContext,
          startTime: this.newPlan.startTime // 使用时间戳
        };
        
        // 如果 startTime 是日期对象或时间戳，转换为后端需要的格式
        if (this.newPlan.startTime) {
          if (typeof this.newPlan.startTime === 'number') {
            // 时间戳直接使用
            planData.startTime = this.newPlan.startTime;
          } else if (this.newPlan.startTime instanceof Date) {
            // 日期对象转换为时间戳
            planData.startTime = this.newPlan.startTime.getTime();
          } else if (typeof this.newPlan.startTime === 'string') {
            // 字符串转换为时间戳
            planData.startTime = new Date(this.newPlan.startTime).getTime();
          }
        }
        
        const res = await this.addUserPlan(planData);
        
        if (res.code === 200) {
          uni.showToast({
            title: '添加成功',
            icon: 'success'
          });
          this.closeAddPlanModal();
          this.loadUserPlans();
        } else {
          throw new Error(res.msg || '添加失败');
        }
      } catch (error) {
        console.error('添加计划失败:', error);
        uni.showToast({
          title: error.message || '添加失败',
          icon: 'none'
        });
      }
    },
    
    // 开始计划
    startPlan(plan) {
      uni.showModal({
        title: '确认开始',
        content: `确定要开始执行计划"${plan.planContext}"吗？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              const res = await this.startUserPlan({
                planId: plan.id
              });
              
              if (res.code === 200) {
                uni.showToast({
                  title: '开始成功',
                  icon: 'success'
                });
                this.loadUserPlans();
              } else {
                throw new Error(res.msg || '操作失败');
              }
            } catch (error) {
              console.error('开始计划失败:', error);
              uni.showToast({
                title: error.message || '操作失败',
                icon: 'none'
              });
            }
          }
        }
      });
    },
    
    // 完成计划
    completePlan(plan) {
      uni.showModal({
        title: '确认完成',
        content: `确定要标记计划"${plan.planContext}"为已完成吗？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              const res = await this.endUserPlan({
                planId: plan.id
              });
              
              if (res.code === 200) {
                uni.showToast({
                  title: '完成成功',
                  icon: 'success'
                });
                this.loadUserPlans();
              } else {
                throw new Error(res.msg || '操作失败');
              }
            } catch (error) {
              console.error('完成计划失败:', error);
              uni.showToast({
                title: error.message || '操作失败',
                icon: 'none'
              });
            }
          }
        }
      });
    },
    
    // 删除计划
    deletePlan(plan) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个学习计划吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await this.deleteUserPlan({
                planId: plan.id
              });
              
              if (result.code === 200) {
                uni.showToast({
                  title: '删除成功',
                  icon: 'success'
                });
                this.loadUserPlans();
              } else {
                throw new Error(result.msg || '删除失败');
              }
            } catch (error) {
              console.error('删除计划失败:', error);
              uni.showToast({
                title: error.message || '删除失败',
                icon: 'none'
              });
            }
          }
        }
      });
    },
    
    // 选择开始时间确认
    onStartDateConfirm(e) {
      // u-datetime-picker 返回的是时间戳
      if (e.value) {
        // 更新时间戳
        this.newPlan.startTime = e.value;
        // 更新显示时间
        this.newPlan.displayStartTime = this.formatDate(e.value);
      }
      this.showStartDatePicker = false;
    },
    
    // 加载用户计划
    async loadUserPlans() {
      try {
        this.loading = true;
        const res = await this.getUserPlans();
        console.log('用户计划数据:', res); // 添加日志以便调试
        this.userPlans = res;
      } catch (error) {
        console.error('加载用户计划失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    }
  },
  onLoad() {
    this.loadUserPlans();
  },
  onShow() {
    this.loadUserPlans();
  }
}
</script>

<style scoped>
.user-plan-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
  color: #333;
}

/* 顶部导航 */
.app-header {
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

.logo i {
  margin-right: 8px;
  font-size: 1.6rem;
  cursor: pointer;
}

.header-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.header-actions i {
  font-size: 1.3rem;
  cursor: pointer;
}

/* 内容区域 */
.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  padding-bottom: 70px;
}

/* 加载状态 */
.loading-container {
  text-align: center;
  padding: 40px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e9ecef;
  border-top: 4px solid #4361ee;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* 章节 */
.section {
  background: white;
  border-radius: 16px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 1rem;
  color: #333;
  gap: 6px;
}

/* 计划列表 */
.plan-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plan-card {
  background: #fafafa;
  border-radius: 12px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-left: 4px solid #4361ee;
}

.plan-card.completed {
  border-left-color: #4cc9f0;
  opacity: 0.8;
}

.plan-content {
  flex: 1;
}

.plan-text {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 8px;
  color: #333;
}

.plan-time {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  color: #999;
}

.plan-duration {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  color: #666;
  margin-top: 5px;
}

.plan-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.plan-actions .u-button {
  font-size: 0.8rem;
  padding: 4px 12px;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  background-image: none !important;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #999;
  min-height: 300px;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #e9ecef;
}

/* 弹窗 */
.modal-container {
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.modal-content {
  margin-bottom: 20px;
}

.modal-footer {
  display: flex;
  justify-content: center;
}

.modal-footer .u-button {
  width: 100%;
  font-size: 1rem;
  padding: 8px 0;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  background-image: none !important;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .content {
    padding: 15px;
  }
  
  .plan-text {
    font-size: 0.95rem;
  }
  
  .section-title {
    font-size: 0.95rem;
  }
}
</style>