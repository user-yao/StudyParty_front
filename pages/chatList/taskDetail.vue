<template>
  <view class="task-detail-container">
    <!-- 顶部导航 -->
    <header class="app-header">
      <div class="header-top">
        <div class="header-back" @click="goBack">
          <u-icon name="arrow-left" size="20" color="#fff"></u-icon>
        </div>
        <div class="header-title">任务详情</div>
        <div class="header-actions">
          <u-icon 
            v-if="!hasAnalyzed || showAIAnalysis" 
            name="chat" 
            size="20" 
            @click="handleAIAnalysis" 
            color="#fff"
            class="ai-icon"
          ></u-icon>
          <u-icon 
            v-else 
            name="chat-fill" 
            size="20" 
            @click="handleAIAnalysis" 
            color="#fff"
            class="ai-icon"
          ></u-icon>
          <u-icon name="plus" size="20" @click="goToAddAnswer" color="#fff"></u-icon>
        </div>
      </div>
    </header>
    
    <!-- 任务内容区域 -->
    <view class="content-container">
      <scroll-view 
        class="content-scroll" 
        scroll-y
        :scroll-top="scrollTop"
        @scroll="onScroll"
        show-scrollbar="false"
      >
        <!-- 任务详情 -->
        <view class="task-content section" v-if="task">
          <view class="task-header">
            <view class="task-user">
              <view class="user-avatar">
                <image 
                  v-if="task.head" 
                  :src="fullImageUrl(task.head)" 
                  @click="goToUserProfile(task.uploader)"
                  mode="aspectFill"
                ></image>
                <view v-else class="avatar-placeholder">
                  {{ task.name ? task.name.substring(0, 1) : 'U' }}
                </view>
              </view>
              <view class="user-info">
                <view class="user-name">
                  {{ task.name }}
                  <!-- 任务发布者身份标识 -->
                  <text 
                    v-if="userInfo && task.uploader === userInfo.id" 
                    class="user-identity identity-me"
                  >我</text>
                  <text 
                    v-else-if="task.status === 1" 
                    class="user-identity identity-student"
                  >学生</text>
                  <text 
                    v-else-if="task.status === 2" 
                    class="user-identity identity-teacher"
                  >老师</text>
                  <text 
                    v-else-if="task.status === 3" 
                    class="user-identity identity-enterprise"
                  >企业</text>
                </view>
                <view class="user-school">{{ task.school }}</view>
              </view>
            </view>
            <view class="task-time">
              {{ formatTime(task.createTime) }}
            </view>
          </view>
          
          <view class="task-title">{{ task.title }}</view>
          
          <!-- 任务状态 -->
          <view class="task-status">
            <u-tag 
              :type="task.isOver === 1 ? 'success' : 'warning'" 
              size="mini" 
              :plain="false"
            >
              {{ task.isOver === 1 ? '已结束' : '进行中' }}
            </u-tag>
          </view>
          
          <!-- Markdown内容 -->
          <view class="markdown-content">
            <u-markdown :content="task.context"></u-markdown>
          </view>
          
          <!-- AI解析按钮已移至顶部导航栏 -->
        </view>
        
        <!-- 回答区域 -->
        <view class="answers-section section">
          <view class="section-header">
            <view class="section-title">
              <u-icon name="chat" size="18" color="#333"></u-icon>
              <text>回答 ({{ answers.length }})</text>
            </view>
          </view>
          
          <!-- 加载状态 -->
          <view v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>正在加载回答...</p>
          </view>
          
          <!-- 回答列表 -->
          <view class="answers-list" v-else>
            <view 
              v-for="answer in answers" 
              :key="answer.id"
              class="answer-item"
            >
              <view class="answer-header">
                <view class="answer-author">
                  <view class="user-avatar">
                    <image 
                      v-if="answer.head" 
                      :src="fullImageUrl(answer.head)" 
                      mode="aspectFill"
                      @click="goToUserProfile(answer.answerer)"
                    ></image>
                    <view v-else class="avatar-placeholder">
                      {{ answer.name ? answer.name.substring(0, 1) : 'U' }}
                    </view>
                  </view>
                  <view class="user-info">
                    <view class="user-name">
                      {{ answer.name }}
                      <!-- 身份标识 -->
                      <text 
                        v-if="task && answer.userId === task.uploader" 
                        class="user-identity identity-owner"
                      >楼主</text>
                      <text 
                        v-else-if="userInfo && answer.answerer === userInfo.id" 
                        class="user-identity identity-me"
                      >我</text>
                      <text 
                        v-else-if="answer.status === 1" 
                        class="user-identity identity-student"
                      >学生</text>
                      <text 
                        v-else-if="answer.status === 2" 
                        class="user-identity identity-teacher"
                      >老师</text>
                      <text 
                        v-else-if="answer.status === 3" 
                        class="user-identity identity-enterprise"
                      >企业</text>
                    </view>
                    <view class="answer-time">{{ formatAnswerTime(answer.createTime) }}</view>
                  </view>
                </view>
                
                <!-- 选择最佳答案按钮（仅任务发布者可见） -->
                <view 
                  class="select-best-answer" 
                  v-if="task && task.uploader === userInfo.id && task.isOver !== 1 && !answer.isBestAnswer"
                  >
                  <u-button type="primary" size="mini" plain @click="selectBestAnswer(answer.id)">设为最佳</u-button>
                </view>
                
                <!-- 最佳答案标识（如果此回答是最佳答案） -->
                <view 
                  class="best-answer-badge" 
                  v-if="answer.isBestAnswer"
                >
                  <u-tag type="success" size="mini" plain>最佳答案</u-tag>
                </view>
              </view>
              <view class="answer-content">
                <!-- 使用u-markdown显示回答内容，只显示前3-5行 -->
                <view 
                  class="markdown-content" 
                  :class="{ 'collapsed': !answer.expanded }"
                >
                  <u-markdown :content="getDisplayedContent(answer)"></u-markdown>
                </view>
                <!-- 展开/收起按钮 -->
                <view class="expand-toggle" @click="toggleAnswer(answer.id)" v-if="shouldShowExpand(answer)">
                  <text>{{ answer.expanded ? '收起' : '展开' }}</text>
                  <u-icon 
                    :name="answer.expanded ? 'arrow-up' : 'arrow-down'" 
                    size="14" 
                    color="#4361ee"
                  ></u-icon>
                </view>
              </view>
            </view>
            
            <!-- 加载更多提示 -->
            <view class="load-more" @click="loadMoreAnswers" v-if="answers.length > 0 && !noMoreData">
              <text v-if="!loadingMore">点击加载更多</text>
              <text v-else>加载中...</text>
            </view>
            
            <!-- 无更多数据提示 -->
            <view class="no-more-data" v-if="noMoreData && answers.length > 0">
              <text>没有更多回答了</text>
            </view>
            
            <!-- 无回答提示 -->
            <view v-if="!loading && answers.length === 0" class="no-answers">
              <text>暂无回答</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- AI解析弹出层 -->
    <u-popup :show="showAIAnalysis" mode="center" border-radius="10" width="80%" height="500px" @close="showAIAnalysis = false">
      <view class="ai-analysis-popup">
        <view class="popup-header">
          <text class="popup-title">小星提示</text>
          <u-icon name="close" size="20" @click="showAIAnalysis = false"></u-icon>
        </view>
        <view class="popup-content">
          <view class="analysis-content" v-if="aiAnalysisData">
            <view class="analysis-item" v-show="currentAnalysisIndex === 0">
              <view class="analysis-title">解析要点一</view>
              <scroll-view class="analysis-scroll" scroll-y show-scrollbar="false">
                <text class="analysis-text">{{ aiAnalysisData.first }}</text>
              </scroll-view>
            </view>
            <view class="analysis-item" v-show="currentAnalysisIndex === 1">
              <view class="analysis-title">解析要点二</view>
              <scroll-view class="analysis-scroll" scroll-y show-scrollbar="false">
                <text class="analysis-text">{{ aiAnalysisData.second }}</text>
              </scroll-view>
            </view>
            <view class="analysis-item" v-show="currentAnalysisIndex === 2">
              <view class="analysis-title">解析要点三</view>
              <scroll-view class="analysis-scroll" scroll-y show-scrollbar="false">
                <text class="analysis-text">{{ aiAnalysisData.third }}</text>
              </scroll-view>
            </view>
          </view>
          <view class="loading-container" v-else-if="aiAnalyzing">
            <div class="loading-spinner"></div>
            <p>小星正在思考中...</p>
          </view>
          <view class="no-data" v-else>
            <text>暂无解析内容</text>
          </view>
        </view>
        <view class="popup-footer" v-if="aiAnalysisData">
          <u-button 
            type="primary" 
            size="normal" 
            shape="circle" 
            @click="prevAnalysis"
            :disabled="currentAnalysisIndex === 0"
            class="nav-button"
          >
            上一个提示
          </u-button>
          <u-button 
            type="primary" 
            size="normal" 
            shape="circle" 
            @click="nextAnalysis"
            :disabled="currentAnalysisIndex === 2"
            class="nav-button"
          >
            下一个提示
          </u-button>
        </view>
        <!-- 鼓励性提示 -->
        <view class="encouragement-tip" v-if="showAIAnalysis && aiAnalysisData">
          <text class="tip-text">AI只是学习的辅助工具，真正掌握知识还需要你的努力和思考。继续加油！</text>
        </view>
      </view>
    </u-popup>
    
    <!-- AI提示弹出层 -->
    <u-popup :show="showAIPrompt" mode="center" border-radius="10" width="80%" height="200px" @close="showAIPrompt = false">
      <view class="ai-prompt-popup">
        <view class="popup-header">
          <text class="popup-title">AI解析</text>
          <u-icon name="close" size="20" @click="showAIPrompt = false"></u-icon>
        </view>
        <view class="popup-content">
          <view class="prompt-message">
            <text>AI将为您解析当前任务内容，解析过程可能需要一些时间，是否继续？</text>
          </view>
          <view class="prompt-options">
            <u-button 
              type="primary" 
              size="normal" 
              shape="circle" 
              @click="handleAIPromptConfirm"
              :loading="aiAnalyzing"
            >
              确定解析
            </u-button>
            <u-button 
              type="default" 
              size="normal" 
              shape="circle" 
              @click="showAIPrompt = false"
            >
              取消
            </u-button>
          </view>
          <view class="background-loading-tip" v-if="aiAnalyzing">
            <text>解析将在后台进行，您可以继续浏览其他内容</text>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { imageUrl } from '../../config/config.js';

export default {
  name: 'TaskDetail',
  data() {
    return {
      taskId: 0,
      answers: [],
      scrollTop: 0,
      loading: true, // 添加加载状态
      currentPage: 1, // 当前页码
      noMoreData: false, // 是否没有更多数据
      loadingMore: false, // 是否正在加载更多
      // AI解析相关数据
      showAIAnalysis: false,
      showAIPrompt: false, // 是否显示AI提示弹窗
      aiAnalyzing: false,
      aiAnalysisData: null,
      currentAnalysisIndex: 0,
      hasAnalyzed: false // 是否已经解析过
    }
  },
  computed: {
    ...mapState('user', ['userInfo']),
    ...mapState('task', ['currentTask']), // 映射task模块的当前任务状态
    ...mapState('taskAnswer', ['taskAnswers']), // 映射taskAnswer模块的状态
    // 任务数据使用store中的数据
    task() {
      return this.currentTask;
    }
  },
  methods: {
    ...mapActions('task', ['getTaskById']), // 映射task模块的获取任务详情action
    ...mapActions('taskAnswer', ['TaskAnswerList', 'trueTaskAnswer']), // 映射taskAnswer模块的action
    ...mapActions('AI', ['getTaskAnalyst']), // 映射AI模块的action
    
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },
    
    // 跳转到添加回答页面
    goToAddAnswer() {
      uni.navigateTo({
        url: `/pages/chatList/addAnswer?taskId=${this.taskId}`
      });
    },

    // 完整图片URL
    fullImageUrl(path) {
      // 确保path是字符串类型
      if (!path || typeof path !== 'string') return '';
      // 如果已经是完整URL，直接返回
      if (path.startsWith('http')) {
        return path;
      }
      // 拼接基础URL
      return imageUrl + path;
    },

    // 格式化时间
    formatTime(timeStr) {
      const date = new Date(timeStr);
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (minutes < 1) {
        return '刚刚';
      } else if (minutes < 60) {
        return `${minutes}分钟前`;
      } else if (hours < 24) {
        return `${hours}小时前`;
      } else if (days < 30) {
        return `${days}天前`;
      } else {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      }
    },

    // 格式化回答时间
    formatAnswerTime(timeStr) {
      const date = new Date(timeStr);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    },

    // 获取显示的内容（根据展开状态）
    getDisplayedContent(answer) {
      // 检查answer是否存在
      if (!answer) {
        return '';
      }
      
      if (answer.expanded) {
        // 使用context字段而不是content字段
        return answer.context || '';
      }
      
      // 如果还没有计算过折叠内容，则计算
      if (!answer.collapsedContent) {
        // 使用context字段而不是content字段
        answer.collapsedContent = this.collapseContent(answer.context);
      }
      
      return answer.collapsedContent || '';
    },

    // 折叠内容，只保留前几行
    collapseContent(content) {
      // 检查content是否存在
      if (!content) {
        return '';
      }
      
      // 简单按行数截取，保留前5行
      const lines = content.split('\n');
      if (lines.length <= 5) {
        return content;
      }
      
      // 保留前5行并添加省略号
      return lines.slice(0, 5).join('\n') + '\n\n...';
    },

    // 判断是否需要显示展开按钮
    shouldShowExpand(answer) {
      // 检查answer和answer.context是否存在
      if (!answer || !answer.context) {
        return false;
      }
      
      const lines = answer.context.split('\n');
      return lines.length > 5;
    },

    // 切换回答展开/收起状态
    toggleAnswer(answerId) {
      const answer = this.answers.find(a => a.id === answerId);
      if (answer) {
        // 确保answer对象有expanded属性
        if (answer.expanded === undefined) {
          answer.expanded = false;
        }
        answer.expanded = !answer.expanded;
      }
    },

    // 滚动事件处理
    onScroll(e) {
      this.scrollTop = e.detail.scrollTop;
    },
    
    // 获取任务详情
    async fetchTaskDetail() {
      try {
        await this.getTaskById(this.taskId);
      } catch (error) {
        console.error('获取任务详情失败:', error);
        uni.showToast({
          title: '获取任务详情失败',
          icon: 'none'
        });
      }
    },
    
    // 获取任务回答
    async fetchTaskAnswers() {
      try {
        this.loading = true;
        this.noMoreData = false; // 重置没有更多数据标志
        const res = await this.TaskAnswerList({ taskId: this.taskId, currentPage: this.currentPage });
        
        // 调试输出返回的数据结构
        console.log('TaskAnswerList response:', res);
        console.log('res.data:', res.data);
        console.log('res.data type:', typeof res.data);
        console.log('Array.isArray(res.data):', Array.isArray(res.data));
        
        // 处理不同的数据结构
        let answersData = [];
        if (res && res.data) {
          // 如果res.data是一个包含records字段的对象（常见分页结构）
          if (res.data.records && Array.isArray(res.data.records)) {
            answersData = res.data.records;
          }
          // 如果res.data直接就是数组
          else if (Array.isArray(res.data)) {
            answersData = res.data;
          }
          // 其他情况
          else {
            console.warn('TaskAnswerList返回的数据格式不正确:', res.data);
            answersData = [];
          }
        }
        
        // 更新本地answers数据
        this.answers = answersData.map(answer => ({
          ...answer,
          // 确保使用正确的字段名
          content: answer.context,
          expanded: false,
          collapsedContent: "",
          // 根据任务的isTrueId字段判断是否为最佳答案
          isBestAnswer: (this.task && this.task.isTrueId === answer.id) || false
        }));
        
        // 检查是否还有更多数据
        if (answersData.length < 10) {
          this.noMoreData = true;
        }
      } catch (error) {
        console.error('获取任务回答失败:', error);
        uni.showToast({
          title: '获取任务回答失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    // 加载更多回答
    async loadMoreAnswers() {
      // 如果正在加载更多或没有更多数据，则不执行
      if (this.loadingMore || this.noMoreData) return;
      
      this.loadingMore = true;
      try {
        const nextPage = this.currentPage + 1;
        const res = await this.TaskAnswerList({ taskId: this.taskId, currentPage: nextPage });
        
        // 调试输出返回的数据结构
        console.log('TaskAnswerList load more response:', res);
        console.log('res.data:', res.data);
        console.log('res.data type:', typeof res.data);
        console.log('Array.isArray(res.data):', Array.isArray(res.data));
        
        // 处理不同的数据结构
        let answersData = [];
        if (res && res.data) {
          // 如果res.data是一个包含records字段的对象（常见分页结构）
          if (res.data.records && Array.isArray(res.data.records)) {
            answersData = res.data.records;
          }
          // 如果res.data直接就是数组
          else if (Array.isArray(res.data)) {
            answersData = res.data;
          }
          // 其他情况
          else {
            console.warn('TaskAnswerList返回的数据格式不正确:', res.data);
            answersData = [];
          }
        }
        
        // 检查返回的数据
        if (answersData.length > 0) {
          // 有数据，添加到现有回答列表中
          const newAnswers = answersData.map(answer => ({
            ...answer,
            // 确保使用正确的字段名
            content: answer.context,
            expanded: false,
            collapsedContent: "",
            // 根据任务的isTrueId字段判断是否为最佳答案
            isBestAnswer: (this.task && this.task.isTrueId === answer.id) || false
          }));
          this.answers = [...this.answers, ...newAnswers];
          
          // 更新当前页码
          this.currentPage = nextPage;
          
          // 检查是否还有更多数据
          if (answersData.length < 10) {
            this.noMoreData = true;
          }
        } else {
          // 没有更多数据
          this.noMoreData = true;
        }
      } catch (error) {
        console.error('加载更多回答失败:', error);
        uni.showToast({
          title: '加载更多回答失败',
          icon: 'none'
        });
      } finally {
        this.loadingMore = false;
      }
    },
    // 跳转到用户信息页面
    goToUserProfile(userId) {
      // 跳转到其他用户的个人信息页面，使用eventChannel传递数据
      uni.navigateTo({
        url: '/pages/userInfo/userInfo',
        success: (res) => {
          res.eventChannel.emit('chatData', { id: userId });
        }
      });
    },
    // 选择最佳答案
    async selectBestAnswer(answerId) {
      // 确认选择
      uni.showModal({
        title: '确认',
        content: '确定要将此回答设为最佳答案并结束任务吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              // 调用API选择最佳答案
              const result = await this.trueTaskAnswer({taskAnswerId:answerId});
              
              if (result && result.code === 200) {
                // 更新本地数据
                this.answers.forEach(answer => {
                  answer.isBestAnswer = (answer.id === answerId);
                });
                
                // 更新任务状态为已结束，并设置最佳答案ID
                if (this.task) {
                  this.task.isOver = 1;
                  this.task.isTrueId = answerId;
                }
                
                uni.showToast({
                  title: '已选择最佳答案',
                  icon: 'success'
                });
                
                // 重新加载任务详情以确保状态同步
                await this.fetchTaskDetail();
              } else {
                throw new Error(result.msg || '操作失败');
              }
            } catch (error) {
              console.error('选择最佳答案失败:', error);
              uni.showToast({
                title: '操作失败',
                icon: 'none'
              });
            }
          }
        }
      });
    },
    
    // 获取AI按钮文字
    getAIButtonText() {
      if (this.aiAnalyzing) {
        return '解析中...';
      } else if (this.hasAnalyzed) {
        return '查看提示';
      } else {
        return 'AI提示';
      }
    },
    
    // 处理AI分析（按钮点击事件）
    handleAIAnalysis() {
      if (this.hasAnalyzed && !this.aiAnalyzing) {
        // 如果已经解析过且不在解析中，直接显示弹窗
        this.showAIAnalysis = true;
      } else {
        // 显示AI提示弹窗
        this.showAIPrompt = true;
      }
    },
    
    // AI解析任务
    async analyzeTaskWithAI() {
      if (!this.task) return;
      
      this.aiAnalyzing = true;
      this.aiAnalysisData = null;
      this.currentAnalysisIndex = 0;
      
      try {
        // 调用AI解析接口
        const res = await this.getTaskAnalyst({ prompt: this.task.context });
        console.log('AI解析返回数据:', res);
        
        if (res && res.code === 200 && res.data) {
          this.aiAnalysisData = res.data;
          this.hasAnalyzed = true;
          this.showAIAnalysis = true;
          uni.showToast({
            title: '解析完成',
            icon: 'success'
          });
        } else {
          throw new Error(res.msg || '解析失败');
        }
      } catch (error) {
        console.error('AI解析失败:', error);
        uni.showToast({
          title: '解析失败: ' + (error.message || '未知错误'),
          icon: 'none'
        });
      } finally {
        this.aiAnalyzing = false;
      }
    },
    
    // 切换到下一条解析
    nextAnalysis() {
      if (this.currentAnalysisIndex < 2) {
        this.currentAnalysisIndex++;
      }
    },
    
    // 切换到上一条解析
    prevAnalysis() {
      if (this.currentAnalysisIndex > 0) {
        this.currentAnalysisIndex--;
      }
    },
    
    // 在提示弹窗中点击AI解析按钮
    handleAIPromptConfirm() {
      this.showAIPrompt = false;
      this.analyzeTaskWithAI();
    }
  },

  onLoad(options) {
    // 获取传递的任务ID
    if (options.id) {
      this.taskId = parseInt(options.id);
      
      // 获取任务详情和回答
      this.fetchTaskDetail();
      this.fetchTaskAnswers();
    } else {
      uni.showToast({
        title: '参数错误',
        icon: 'none'
      });
      uni.navigateBack();
    }
  }
}
</script>

<style scoped>
.task-detail-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
  padding-bottom: 60px;
  color: #333;
  box-sizing: border-box;
  width: 100%;
  overflow-x: hidden;
}

/* 顶部导航 */
.app-header {
  background: linear-gradient(135deg, #4361ee, #3f37c9);
  color: white;
  padding: 10px 15px;
  padding-top: calc(var(--status-bar-height, 0px) + 10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.header-back {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 1.2rem;
  cursor: pointer;
}

.header-title {
  font-weight: 600;
  font-size: 1.2rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1px;
}

/* 内容滚动区域 */
.content-container {
  padding: 10px;
  padding-bottom: 20px;
  padding-top: calc(var(--status-bar-height, 0px) + 60px);
  min-height: calc(100vh - 120px);
  position: relative;
  box-sizing: border-box;
}

.content-scroll {
  height: 100%;
}

/* 隐藏滚动条 */
.content-scroll ::v-deep .uni-scroll-view::-webkit-scrollbar {
  display: none;
}

.section {
  background: white;
  border-radius: 8px;
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
}

.section-title i {
  margin-right: 8px;
}

/* 任务内容区域 */
.task-content {
  background-color: #fff;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.task-user {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  overflow: hidden;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar image {
  width: 100%;
  height: 100%;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-weight: bold;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 2px;
}

.user-school {
  font-size: 0.75rem;
  color: #999;
}

.task-time {
  font-size: 0.75rem;
  color: #999;
}

.task-title {
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 15px;
  line-height: 1.4;
}

/* 任务状态 */
.task-status {
  margin-bottom: 15px;
}

/* Markdown内容 */
.markdown-content {
  padding: 10px 0;
  margin-bottom: 15px;
}

.markdown-content.collapsed {
  max-height: 150px;
  overflow: hidden;
  position: relative;
}

.markdown-content.collapsed::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1));
}

/* AI解析按钮区域 */
.ai-analysis-section {
  text-align: center;
  padding: 10px 0;
  border-top: 1px solid #eee;
  margin-top: 10px;
}

/* 回答区域 */
.answers-section {
  background-color: #fff;
}

/* 回答列表 */
.answers-list {
  padding-top: 10px;
}

.answer-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.answer-item:last-child {
  border-bottom: none;
}

.answer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.answer-header .answer-author {
  flex: 1;
}

.answer-header .select-best-answer,
.answer-header .best-answer-badge {
  flex-shrink: 0;
  margin-left: 10px;
}

.answer-author {
  display: flex;
  align-items: center;
}

.answer-author .user-avatar {
  width: 32px;
  height: 32px;
  margin-right: 8px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 2px;
}

.answer-time {
  font-size: 0.75rem;
  color: #999;
}

.answer-content {
  font-size: 0.85rem;
  color: #333;
  line-height: 1.5;
  margin-bottom: 10px;
  word-wrap: break-word;
}

/* 展开/收起按钮 */
.expand-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #4361ee;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 8px 0;
}

/* 选择最佳答案按钮 */
.select-best-answer {
  display: flex;
  align-items: center;
  height: 100%;
}

/* 最佳答案标识 */
.best-answer-badge {
  display: flex;
  align-items: center;
  height: 100%;
}

/* 无回答提示 */
.no-answers {
  text-align: center;
  padding: 30px 0;
  color: #999;
  font-size: 0.9rem;
}

/* 加载更多 */
.load-more {
  text-align: center;
  padding: 15px;
  color: #4361ee;
  font-size: 0.9rem;
  cursor: pointer;
}

/* 无更多数据提示 */
.no-more-data {
  text-align: center;
  padding: 15px;
  color: #999;
  font-size: 0.9rem;
}

/* 身份标识 */
.user-identity {
  display: inline-block;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 3px;
  margin-left: 5px;
  vertical-align: middle;
}

.identity-owner {
  background-color: #4361ee;
  color: white;
}

.identity-me {
  background-color: #f0f0f0;
  color: #666;
}

.identity-student {
  background-color: #4cc9f0;
  color: white;
}

.identity-teacher {
  background-color: #f72585;
  color: white;
}

.identity-enterprise {
  background-color: #7209b7;
  color: white;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f0f0f0;
  border-top: 3px solid #4361ee;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* AI解析弹出层 */
.ai-analysis-popup {
  height: 90%;
  width: 90vw;
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.popup-title {
  font-weight: 600;
  font-size: 1.1rem;
}

.popup-content {
  flex: 1;
  padding: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.analysis-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.analysis-title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 10px;
  text-align: center;
}

.analysis-scroll {
  flex: 1;
  max-height: 300px;
  min-height: 300px;
}

.analysis-text {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #333;
}

.no-data {
  text-align: center;
  padding: 30px 0;
  color: #999;
}

.popup-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-top: 1px solid #eee;
}

.page-indicator {
  font-size: 0.9rem;
  color: #666;
}

.nav-button {
  min-width: 50px;
  margin: 10rpx;
  padding: 0 15px;
}

::-webkit-scrollbar{
  display: none;
}

/* AI图标样式 */
.ai-icon {
  margin-right: 15px;
}

/* AI加载动画 */
.ai-loading ::v-deep .u-button__text::after {
  content: '';
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: ai-loading-spinner 1s linear infinite;
  margin-left: 8px;
  vertical-align: middle;
}

/* 鼓励性提示 */
.encouragement-tip {
  padding: 10px 15px;
  background-color: #f0f8ff;
  border-top: 1px solid #eee;
  text-align: center;
}

.tip-text {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

/* AI提示弹窗 */
.ai-prompt-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.prompt-message {
  padding: 20px;
  text-align: center;
  font-size: 14px;
  color: #333;
}

.prompt-options {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 0 20px 20px;
}

.background-loading-tip {
  padding: 10px;
  text-align: center;
  font-size: 12px;
  color: #666;
}

@keyframes ai-loading-spinner {
  to { transform: rotate(360deg); }
}
</style>