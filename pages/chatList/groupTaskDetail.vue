<template>
	<view class="container">
		<!-- 顶部导航 -->
		<header class="app-header">
			<div class="header-top">
				<div class="logo">
					<u-icon name="arrow-left" size="24" color="#ffffff" @click="goBack"></u-icon>
					<span>任务详情</span>
				</div>
				<div class="header-actions">
					<u-icon v-if="!hasAnalyzed || showAIAnalysis" name="chat" size="24" @click="handleAIAnalysis"
						color="#fff" class="ai-icon"></u-icon>
					<u-icon v-else name="chat-fill" size="24" @click="handleAIAnalysis" color="#fff"
						class="ai-icon"></u-icon>
					<u-icon name="info-circle" size="24" color="#ffffff" @click="showTaskInfo"></u-icon>
				</div>
			</div>

			<!-- 选项卡 -->
			<div class="tabs-container">
				<div class="tab-item" :class="{ active: activeTab === 'question' }" @click="switchTab('question')">
					题目
				</div>
				<div class="tab-item" :class="{ active: activeTab === 'answer' }" @click="switchTab('answer')">
					作答
				</div>
			</div>
		</header>

		<!-- 内容区域 -->
		<div class="content-container">
			<!-- 白色背景容器 -->
			<div class="white-background">
				<!-- 内容区域 -->
				<scroll-view class="content-scroll" scroll-y="true" enable-flex="true" @scroll="onScroll"
					:scroll-top="scrollTop" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
					<div class="content">
						<!-- 题目内容 -->
						<div v-show="activeTab === 'question'" class="tab-content">
							<!-- 任务描述 -->
							<div class="task-description-section" v-if="taskDetail">
								<!-- 查看答案按钮 (仅任务发布者、老师、企业用户可见) -->
								<div class="view-answers-section" v-if="isTaskOwnerOrTeacherOrEnterprise">
									<u-button type="primary" size="medium" @click="viewMemberAnswers">
										查看成员作答情况
									</u-button>
								</div>
								<h3 class="section-title">任务描述</h3>
								<hr class="section-divider" />
								<div class="description-content">
									<u-markdown :content="taskDetail.groupTaskContext" :previewImg="true" theme="light"
										:showLineNumber="false">
									</u-markdown>
								</div>
							</div>
						</div>

						<!-- 作答内容 -->
						<div v-show="activeTab === 'answer'" class="tab-content">
							<!-- 已提交内容显示 -->
							<div class="submitted-content" v-if="hasSubmitted && taskAnswer">
								<div class="section-header">
									<h3 class="section-title">已提交的作业</h3>
									<div class="submission-actions"
										v-if="getTaskStatus(taskDetail) === '进行中' || getTaskStatus(taskDetail) === '已结束'">
										<u-button type="primary" size="mini" @click="editSubmission" text="重新提交">
										</u-button>
									</div>
								</div>
								<hr class="section-divider" />

								<!-- 分数显示 -->
								<div class="score-section"
									v-if="taskAnswer.score !== null && taskAnswer.score !== undefined && taskAnswer.score !== -1">
									<div class="score-display">
										<span class="score-label">得分：</span>
										<span class="score-value">{{ taskAnswer.score }}分</span>
									</div>
								</div>

								<div class="submitted-content-display">
									<u-markdown :content="taskAnswer.context" :previewImg="true" theme="light"
										:showLineNumber="false">
									</u-markdown>
								</div>

								<!-- 权限提示信息（仅在无法再次提交时显示） -->
								<div class="permission-note" v-if="!canSubmitTask">
									<u-icon name="info-circle" size="20" color="#6c757d"></u-icon>
									<small>{{ permissionMessage }}</small>
								</div>
							</div>

							<!-- 作业提交区域 -->
							<div class="submission-section" v-else-if="taskDetail && canSubmitTask">
								<div class="section-header">
									<h3 class="section-title">提交作业</h3>
									<div class="submission-actions">
										<u-button type="primary" size="mini" :disabled="isSubmitted || submitting"
											@click="submitTask"
											:text="isSubmitted ? '已提交' : (submitting ? '提交中...' : '提交')">
										</u-button>
									</div>
								</div>
								<hr class="section-divider" />
								<div class="submission-form">
									<div class="editor-container">
										<div class="submission-header">
											<div class="markdown-info">
												<span class="markdown-text">支持markdown格式</span>
												<u-icon name="question-circle" size="16" color="#6c757d"
													@click="goToMarkdownGuide">
												</u-icon>
											</div>
											<u-button type="info" size="mini" @click="previewMarkdown">
												预览
											</u-button>
										</div>
										<!-- 使用scroll-view包装文本框 -->
										<scroll-view class="textarea-container" scroll-y="true"
											:scroll-top="textareaScrollTop" @scroll="onTextareaScroll"
											:style="textareaContainerStyle" enable-flex="true">
											<textarea ref="submissionTextarea" class="submission-text"
												v-model="displayContent" placeholder="请输入你的作业内容，支持Markdown语法..."
												:disabled="isSubmitted" :style="textareaStyle" @focus="onTextareaFocus"
												@blur="onTextareaBlur">
											</textarea>
										</scroll-view>
									</div>

									<!-- 图片功能栏容器 -->
									<div class="image-toolbar-container">
										<!-- 图片功能栏 -->
										<div class="image-toolbar" :class="{ 'keyboard-up': keyboardHeight > 0 }"
											:style="toolbarStyle" ref="imageToolbar">
											<u-icon name="plus-circle" size="24" color="#4361ee" @click="uploadImage"
												class="toolbar-icon">
											</u-icon>
											<span class="toolbar-text">添加图片</span>
										</div>
									</div>
								</div>
							</div>

							<!-- 权限提示 -->
							<div class="permission-prompt" v-else-if="!canSubmitTask && taskDetail && !hasSubmitted">
								<u-icon name="lock" size="40" color="#6c757d" v-if="taskDetail"></u-icon>
								<p v-if="taskDetail">当前无法提交作业</p>
								<small v-if="taskDetail">{{ permissionMessage }}</small>
							</div>

							<!-- 未提交状态提示 -->
							<div class="empty-state" v-if="!hasSubmitted && !taskDetail">
								<u-icon name="file-text" size="40" color="#adb5bd"></u-icon>
								<p>暂无任务详情</p>
							</div>
						</div>
					</div>
				</scroll-view>
			</div>
		</div>

		<!-- 任务详情模态框 -->
		<u-popup :show="showTaskInfoModal" mode="center" border-radius="10" width="80%" height="auto"
			@close="closeTaskInfoModal">
			<div class="modal-content">
				<div class="modal-header">
					<h3>任务详情</h3>
					<u-icon name="close" size="20" color="#6c757d" @click="closeTaskInfoModal"></u-icon>
				</div>
				<div class="modal-body" v-if="taskDetail">
					<!-- 任务基本信息 -->
					<div class="task-header">
						<div class="task-title">{{ taskDetail.groupTask }}</div>
						<div class="task-status" :class="getStatusClass(taskDetail)">
							{{ getStatusText(taskDetail) }}
						</div>
					</div>
					<div class="task-meta">
						<div class="task-meta-item">
							<u-icon name="calendar" size="16" color="#6c757d"></u-icon>
							<span>开始: {{ formatDate(taskDetail.groupTaskStartTime) }}</span>
						</div>
						<div class="task-meta-item">
							<u-icon name="clock" size="16" color="#6c757d"></u-icon>
							<span>截止: {{ formatDate(taskDetail.groupTaskLastTime) }}</span>
						</div>
						<div class="task-meta-item">
							<u-icon name="account" size="16" color="#6c757d"></u-icon>
							<span>发布者: {{ taskDetail.groupTaskUploader }}</span>
						</div>
					</div>
					<div class="task-progress">
						<div class="progress-info">
							<span>完成进度</span>
							<span>{{ taskDetail.groupTaskFinish || 0 }} /
								{{ taskDetail.groupTaskUnfinished || 0 }}</span>
						</div>
						<div class="progress-bar">
							<div class="progress-fill" :style="{ width: calculateProgress(taskDetail) + '%' }"></div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<u-button type="primary" size="medium" @click="closeTaskInfoModal">确定</u-button>
				</div>
			</div>
		</u-popup>

		<!-- AI解析弹出层 -->
		<u-popup :show="showAIAnalysis" mode="center" border-radius="10" width="80%" height="500px"
			@close="showAIAnalysis = false">
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
					<u-button type="primary" size="normal" shape="circle" @click="prevAnalysis"
						:disabled="currentAnalysisIndex === 0" class="nav-button">
						上一个提示
					</u-button>
					<u-button type="primary" size="normal" shape="circle" @click="nextAnalysis"
						:disabled="currentAnalysisIndex === 2" class="nav-button">
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
		<u-popup :show="showAIPrompt" mode="center" border-radius="10" width="80%" height="200px"
			@close="showAIPrompt = false">
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
						<u-button type="primary" size="normal" shape="circle" @click="handleAIPromptConfirm"
							:loading="aiAnalyzing">
							确定解析
						</u-button>
						<u-button type="default" size="normal" shape="circle" @click="showAIPrompt = false">
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
import {
	mapState,
	mapActions
} from 'vuex';
import { ref } from 'vue'
import UploadUtils from '../../utils/uploadUtils.js'
import { baseUrl } from '../../config/config.js'
export default {
	data() {
		return {
			taskId: null,
			taskDetail: null,
			submissionContent: `# 作业标题`,
			displayContent: `# 作业标题`,
			currentUserId: uni.getStorageSync('id'),
			currentUserRole: 'member', // member, leader, deputy, teacher, enterprise
			isSubmitted: false,
			loading: false,
			submitting: false,
			groupId: null,
			activeTab: 'question', // 默认显示题目
			showTaskInfoModal: false, // 任务详情模态框显示状态
			scrollTop: 0, // 滚动位置
			scrollPositions: {}, // 各个tab的滚动位置记录

			// 手势识别相关数据
			touchStartX: 0,
			touchStartY: 0,
			minSwipeDistance: 50, // 最小滑动距离
			maxSwipeDeviation: 30, // 最大垂直偏差

			// 图片上传相关
			uploading: false,
			// 存储图片映射关系：{ placeholder: "[图片1]", markdown: "![图片1](url1)" }
			imageMap: [],
			// 图片编号计数器，用于生成唯一的图片编号
			imageCounter: 0,

			// 键盘相关
			keyboardHeight: 0,
			toolbarBottom: 0,

			// 文本框滚动相关
			textareaScrollTop: 0,
			isTextareaFocused: false,
			previousTextareaHeight: 0,

			// 任务答案相关
			taskAnswer: null, // 存储已提交的任务答案
			hasSubmitted: false, // 是否已提交过任务

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
		// 判断是否可以提交作业
		canSubmitTask() {
			// 需要有任务详情
			if (!this.taskDetail) return false;

			// 作业已提交则不能再提交
			if (this.isSubmitted) return false;

			// 作业未开始或已结束则不能提交
			const taskStatus = this.getTaskStatus(this.taskDetail);
			if (taskStatus === '未开始' || taskStatus === '已结束') return false;

			return true;
		},

		// 判断是否为任务发布者、老师或企业用户
		isTaskOwnerOrTeacherOrEnterprise() {
			var userStatus = uni.getStorageSync('user').status;
			// 需要有任务详情和用户信息
			if (!this.taskDetail || !userStatus) return false;

			// 检查是否为任务发布者（通过ID比较）
			if (this.taskDetail.groupTaskUploaderId === this.currentUserId) return true;

			// 检查用户身份是否为老师或企业
			if (userStatus == '2' || userStatus == '3') return true;

			return false;
		},

		// 权限提示信息
		permissionMessage() {
			if (!this.taskDetail) return '正在加载任务信息...';

			// 优先检查作业状态
			const taskStatus = this.getTaskStatus(this.taskDetail);
			if (taskStatus === '已结束') {
				return `作业已结束，截止时间：${this.formatDateTime(this.taskDetail.groupTaskLastTime)}`;
			}

			if (taskStatus === '未开始') {
				return `作业未开始，开始时间：${this.formatDateTime(this.taskDetail.groupTaskStartTime)}`;
			}

			if (this.isSubmitted) {
				return '作业已提交';
			}

			return '您没有提交作业的权限';
		},

		// 图片工具栏样式
		toolbarStyle() {
			return {
				bottom: this.toolbarBottom + 'px'
			};
		},

		// 文本框样式
		textareaStyle() {
			if (this.keyboardHeight > 0) {
				// 键盘弹起时，动态计算文本框高度
				// 确保文本框底部与图片功能栏顶部之间有足够空间
				const totalDeduction = this.keyboardHeight + 120; // 键盘高度 + 功能栏高度 + 间距
				return {
					height: `calc(300px - ${totalDeduction}px)`,
					marginBottom: '60px'
				};
			} else {
				// 键盘收起时，使用默认高度
				return {
					height: '300px',
					marginBottom: '12px'
				};
			}
		},

		// 文本框容器样式
		textareaContainerStyle() {
			if (this.keyboardHeight > 0) {
				// 键盘弹起时，容器高度需要为键盘和功能栏留出空间
				const totalDeduction = this.keyboardHeight + 200; // 键盘高度 + 功能栏高度 + 间距
				return {
					height: `calc(100vh - ${totalDeduction}px)`,
					flex: '1'
				};
			} else {
				// 键盘收起时，使用默认高度
				return {
					height: '300px',
					flex: '1'
				};
			}
		}
	},
	watch: {
		// 监听显示内容变化
		displayContent(newVal, oldVal) {
			try {
				// 如果文本框处于聚焦状态且键盘弹起，自动滚动到底部
				if (this.isTextareaFocused && this.keyboardHeight > 0) {
					// 延迟执行，确保DOM已更新
					this.$nextTick(() => {
						this.scrollToTextareaBottom();
					});
				}

				// 检查是否有图片被删除
				this.syncContentWithDisplay();
			} catch (error) {
				console.error('Error in displayContent watcher:', error);
			}
		}
	},
	methods: {
		...mapActions('groupTaskAnswer', ['submitTaskAnswer', 'getMyTaskAnswers']),
		...mapActions('AI', ['getTaskAnalyst']), // 映射AI模块的action

		// 同步显示内容和实际提交内容
		syncContentWithDisplay() {
			try {
				// 基于displayContent和imageMap生成submissionContent
				let content = this.displayContent;

				// 检查是否有图片被删除
				const deletedImages = [];
				this.imageMap.forEach((image, index) => {
					if (!content.includes(image.placeholder)) {
						deletedImages.push(index);
					}
				});

				// 从imageMap中移除已删除的图片（从后往前删除，避免索引变化）
				for (let i = deletedImages.length - 1; i >= 0; i--) {
					this.imageMap.splice(deletedImages[i], 1);
				}

				// 将所有【图片】占位符替换为对应的Markdown代码
				this.imageMap.forEach(image => {
					const placeholderRegex = new RegExp(image.placeholder.replace(/[[\]]/g, '\\$&'), 'g');
					content = content.replace(placeholderRegex, image.markdown);
				});

				this.submissionContent = content;
			} catch (error) {
				console.error('Error in syncContentWithDisplay:', error);
			}
		},

		// 从提交内容生成显示内容
		generateDisplayContent() {
			try {
				// 如果是初始化，需要从submissionContent中提取已有的图片并建立映射
				if (this.imageMap.length === 0) {
					// 匹配Markdown图片语法: ![alt](url)
					const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
					let match;
					let index = 1;

					// 清空现有映射
					this.imageMap = [];

					// 查找所有图片并建立映射
					while ((match = imageRegex.exec(this.submissionContent)) !== null) {
						const altText = match[1];
						const imageUrl = match[2];
						const placeholder = `[图片${index}]`;
						const markdown = match[0]; // 完整的Markdown语法

						this.imageMap.push({
							placeholder: placeholder,
							markdown: markdown
						});

						// 更新图片计数器
						if (index > this.imageCounter) {
							this.imageCounter = index;
						}

						index++;
					}
				}

				// 将所有Markdown图片代码替换为【图片】占位符
				let content = this.submissionContent;
				this.imageMap.forEach(image => {
					const markdownRegex = new RegExp(image.markdown.replace(/[[\]()]/g, '\\$&'), 'g');
					content = content.replace(markdownRegex, image.placeholder);
				});

				this.displayContent = content;
			} catch (error) {
				console.error('Error in generateDisplayContent:', error);
			}
		},

		// 滚动事件处理
		onScroll(e) {
			// 记录当前tab的滚动位置
			this.scrollPositions[this.activeTab] = e.detail.scrollTop;
		},

		// 文本框滚动事件处理
		onTextareaScroll(e) {
			// 可以在这里处理文本框的滚动事件
		},

		// 文本框获得焦点事件
		onTextareaFocus(e) {
			try {
				this.isTextareaFocused = true;
				console.log('文本框获得焦点');

				// 延迟执行滚动到底部，确保DOM已更新
				this.$nextTick(() => {
					this.scrollToTextareaBottom();
				});
			} catch (error) {
				console.error('Error in onTextareaFocus:', error);
			}
		},

		// 文本框失去焦点事件
		onTextareaBlur(e) {
			try {
				this.isTextareaFocused = false;
				console.log('文本框失去焦点');
			} catch (error) {
				console.error('Error in onTextareaBlur:', error);
			}
		},

		// 滚动到文本框底部
		scrollToTextareaBottom() {
			try {
				if (!this.isTextareaFocused) return;

				// 使用更准确的方法计算滚动位置
				const textarea = this.$refs.submissionTextarea;
				if (textarea) {
					// 获取文本框的实际高度
					this.$nextTick(() => {
						const textareaElement = textarea.$el || textarea;
						if (textareaElement) {
							const scrollHeight = textareaElement.scrollHeight || 0;
							const clientHeight = textareaElement.clientHeight || 0;

							// 如果内容高度大于可视高度，则滚动到底部
							if (scrollHeight > clientHeight) {
								this.textareaScrollTop = scrollHeight - clientHeight;
							}
						}
					});
				}

				console.log('滚动到文本框底部');
			} catch (error) {
				console.error('Error in scrollToTextareaBottom:', error);
			}
		},

		// 切换tab
		switchTab(tab) {
			// 保存当前tab的滚动位置
			if (this.$refs.scrollView) {
				// 这里可以添加额外的滚动位置保存逻辑
			}

			this.activeTab = tab;

			// 恢复目标tab的滚动位置
			this.$nextTick(() => {
				this.scrollTop = this.scrollPositions[tab] || 0;
			});
		},

		// 触摸开始事件
		onTouchStart(e) {
			const touch = e.touches[0];
			this.touchStartX = touch.clientX;
			this.touchStartY = touch.clientY;
		},

		// 触摸移动事件
		onTouchMove(e) {
			// 阻止默认滚动行为，以便识别手势
			// 注意：这里要谨慎使用，避免影响正常滚动
			// 只在水平滑动明显时才阻止默认行为
		},

		// 触摸结束事件
		onTouchEnd(e) {
			const touch = e.changedTouches[0];
			const deltaX = touch.clientX - this.touchStartX;
			const deltaY = Math.abs(touch.clientY - this.touchStartY);

			// 判断是否为有效的水平滑动
			if (Math.abs(deltaX) > this.minSwipeDistance && deltaY < this.maxSwipeDeviation) {
				// 左滑：从题目切换到作答
				if (deltaX < 0 && this.activeTab === 'question') {
					this.switchTab('answer');
				}
				// 右滑：从作答切换到题目
				else if (deltaX > 0 && this.activeTab === 'answer') {
					this.switchTab('question');
				}
			}
		},

		// 返回上一页
		goBack() {
			console.log('尝试返回上一页');
			// 首先尝试使用uni.navigateBack
			const pages = getCurrentPages();
			console.log('当前页面栈长度:', pages.length);

			// 添加超时处理，防止页面卡死
			const backTimeout = setTimeout(() => {
				console.warn('页面返回超时，强制跳转到任务列表');
				uni.redirectTo({
					url: '/pages/chatList/groupTaskList',
					fail: () => {
						uni.switchTab({
							url: '/pages/chatList/groupTaskList'
						});
					}
				});
			}, 3000); // 3秒超时

			if (pages.length > 1) {
				uni.navigateBack({
					delta: 1,
					success: () => {
						clearTimeout(backTimeout);
					},
					fail: (err) => {
						clearTimeout(backTimeout);
						console.error('navigateBack失败:', err);
						// 如果navigateBack失败，尝试使用redirectTo返回首页
						uni.redirectTo({
							url: '/pages/chatList/groupTaskList',
							fail: (err2) => {
								console.error('redirectTo失败:', err2);
								// 最后的备选方案
								uni.switchTab({
									url: '/pages/chatList/groupTaskList',
									fail: (err3) => {
										console.error('switchTab失败:', err3);
										uni.reLaunch({
											url: '/pages/chatList/groupTaskList'
										});
									}
								});
							}
						});
					}
				});
			} else {
				// 如果页面栈只有一页，跳转到任务列表页面
				clearTimeout(backTimeout);
				uni.redirectTo({
					url: '/pages/chatList/groupTaskList',
					fail: () => {
						uni.switchTab({
							url: '/pages/chatList/groupTaskList'
						});
					}
				});
			}
		},

		// 显示任务详情模态框
		showTaskInfo() {
			this.showTaskInfoModal = true;
		},

		// 关闭任务详情模态框
		closeTaskInfoModal() {
			this.showTaskInfoModal = false;
		},

		// 查看成员作答情况
		viewMemberAnswers() {
			uni.navigateTo({
				url: `/pages/chatList/groupMemberAnswers?taskId=${this.taskId}&groupId=${this.groupId}`
			});
		},

		// 获取任务状态文本
		getStatusText(task) {
			return this.getTaskStatus(task);
		},

		// 获取任务状态
		getTaskStatus(task) {
			// 添加容错处理
			if (!task || !task.groupTaskStartTime || !task.groupTaskLastTime) {
				return "未知";
			}

			const now = new Date();
			const startTime = new Date(task.groupTaskStartTime);
			const endTime = new Date(task.groupTaskLastTime);

			// 检查日期是否有效
			if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
				return "未知";
			}

			if (now < startTime) {
				return "未开始";
			} else if (now > endTime) {
				return "已结束";
			} else {
				return "进行中";
			}
		},

		// 获取任务状态类名
		getStatusClass(task) {
			const status = this.getTaskStatus(task);
			if (status === "已结束") {
				return "status-completed";
			} else if (status === "进行中") {
				return "status-in-progress";
			} else if (status === "未开始") {
				return "status-not-started";
			} else {
				return "status-expired"; // 未知状态
			}
		},

		// 计算任务进度百分比
		calculateProgress(task) {
			// 添加容错处理
			if (!task) return 0;

			const finish = task.groupTaskFinish || 0;
			const unfinished = task.groupTaskUnfinished || 0;

			if (unfinished === 0) return 0;
			return (finish / unfinished) * 100;
		},

		// 格式化日期显示
		formatDate(dateStr) {
			if (!dateStr) return '未知日期';
			// 处理ISO格式的日期字符串
			const date = new Date(dateStr);

			// 检查日期是否有效
			if (isNaN(date.getTime())) return '无效日期';

			return date.getFullYear() + '-' +
				String(date.getMonth() + 1).padStart(2, '0') + '-' +
				String(date.getDate()).padStart(2, '0');
		},

		// 格式化日期时间显示
		formatDateTime(dateStr) {
			if (!dateStr) return '未知时间';
			// 处理ISO格式的日期字符串
			const date = new Date(dateStr);

			// 检查日期是否有效
			if (isNaN(date.getTime())) return '无效时间';

			return date.getFullYear() + '-' +
				String(date.getMonth() + 1).padStart(2, '0') + '-' +
				String(date.getDate()).padStart(2, '0') + ' ' +
				String(date.getHours()).padStart(2, '0') + ':' +
				String(date.getMinutes()).padStart(2, '0');
		},

		// 提交作业
		async submitTask() {
			if (!this.submissionContent.trim()) {
				uni.showToast({
					title: '请输入作业内容',
					icon: 'none'
				});
				return;
			}

			// 显示确认对话框
			uni.showModal({
				title: '确认提交',
				content: '确定要提交作业吗？提交后将无法修改。',
				success: async (modalRes) => {
					if (modalRes.confirm) {
						// 用户点击确定
						try {
							this.submitting = true;

							uni.showLoading({
								title: '提交作业中...'
							});

							// 先提交作业内容获取作业答案ID
							const res = await this.submitTaskAnswer({
								groupTaskId: this.taskId,
								markdown: this.submissionContent
							});

							if (res.code === 200) {
								// 获取作业答案ID
								const answerId = res.data;

								// 检查是否有本地图片文件需要上传
								const imageFiles = this.imageMap.map(image => image.localPath).filter(path => path);

								// 如果有图片需要上传，直接使用uni.uploadFile上传
								if (imageFiles.length > 0 && answerId) {
									// 逐个上传图片
									for (let i = 0; i < imageFiles.length; i++) {
										await new Promise((resolve, reject) => {
											uni.uploadFile({
												url: baseUrl + '/group/groupTaskAnswer/submitFile',
												filePath: imageFiles[i],
												name: 'source',
												formData: {
													answerId: answerId.toString()
												},
												header: {
													'Authorization': `${uni.getStorageSync('token')}`
												},
												success: (uploadRes) => {
													resolve(uploadRes);
												},
												fail: (err) => {
													reject(err);
												}
											});
										});
									}
								}

								uni.showToast({
									title: '作业提交成功',
									icon: 'success'
								});
								this.isSubmitted = true;
								// 清空输入框
								this.submissionContent = '';
								this.displayContent = '';
								this.imageMap = [];
								this.imageCounter = 0;

								// 更新提交状态
								this.hasSubmitted = true;

								// 重新获取并更新显示提交的答案
								await this.loadMyTaskAnswer();
							} else {
								throw new Error(res.msg || '提交失败');
							}
						} catch (error) {
							console.error('提交作业失败:', error);
							uni.showToast({
								title: error.message || '提交失败',
								icon: 'none'
							});
						} finally {
							uni.hideLoading();
							this.submitting = false;
						}
					} else if (modalRes.cancel) {
						// 用户点击取消，不执行任何操作
						console.log('用户取消提交作业');
					}
				}
			});
		},

		// 预览Markdown内容
		previewMarkdown() {
			// 预览时使用submissionContent（包含Markdown图片代码）
			if (!this.submissionContent.trim()) {
				uni.showToast({
					title: '请输入内容后再预览',
					icon: 'none'
				});
				return;
			}

			// 跳转到预览页面，传递内容
			uni.navigateTo({
				url: `/pages/chatList/markdownPreview?content=${encodeURIComponent(this.submissionContent)}`
			});
		},

		// 跳转到Markdown语法教程
		goToMarkdownGuide() {
			uni.navigateTo({
				url: '/pages/chatList/markdownGuide'
			});
		},

		// 图片上传功能
		uploadImage() {
			if (this.uploading) {
				return;
			}

			this.uploading = true;

			// 选择图片（uni.chooseImage不返回Promise，使用回调方式）
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (chooseRes) => {
					try {
						const tempFilePath = chooseRes.tempFilePaths[0];

						// 不再上传到服务器，而是本地保存
						// 生成占位符和Markdown代码
						// 修复图片编号问题：使用一个递增的计数器而不是imageMap.length
						this.imageCounter = this.imageCounter || 0;
						this.imageCounter++;
						const placeholder = `[图片${this.imageCounter}]`;
						// 本地临时保存图片路径
						const imageMarkdown = `![图片${this.imageCounter}](${tempFilePath})`;

						// 添加到图片映射中
						this.imageMap.push({
							placeholder: placeholder,
							markdown: imageMarkdown,
							localPath: tempFilePath // 保存本地路径
						});

						// 在光标位置插入占位符
						const textarea = this.$refs.submissionTextarea;
						let newDisplayContent = this.displayContent;

						if (textarea && textarea.$el) {
							// 获取光标位置
							const cursorPosition = textarea.$el.selectionStart || newDisplayContent.length;
							const beforeText = newDisplayContent.substring(0, cursorPosition);
							const afterText = newDisplayContent.substring(cursorPosition);
							newDisplayContent = beforeText + `\n${placeholder}\n` + afterText;
						} else {
							// 如果无法获取光标位置，则在末尾添加
							newDisplayContent += `\n${placeholder}\n`;
						}

						// 更新显示内容
						this.displayContent = newDisplayContent;

						// 同步内容
						this.syncContentWithDisplay();

						uni.showToast({
							title: '图片已添加',
							icon: 'success'
						});
					} catch (error) {
						uni.showToast({
							title: error.message || '添加失败',
							icon: 'none'
						});
					} finally {
						this.uploading = false;
					}
				},
				fail: (chooseErr) => {
					console.error('选择图片失败:', chooseErr);
					uni.showToast({
						title: '选择图片失败',
						icon: 'none'
					});
					this.uploading = false;
				}
			});
		},

		// 加载任务详情
		loadTaskDetail(taskData) {
			// 使用传递的任务详情数据
			this.taskDetail = taskData;
			//this.taskDetail.groupTaskContext是md内容，需要转换成html
		},

		// 获取我的任务答案
		async loadMyTaskAnswer() {
			if (!this.taskId) return;

			try {
				const res = await this.getMyTaskAnswers({ groupTaskId: this.taskId });
				if (res.code === 200) {
					// 如果data为null，说明没有提交过
					if (res.data === null) {
						this.hasSubmitted = false;
						this.taskAnswer = null;
					} else {
						// 已提交过任务
						this.hasSubmitted = true;
						this.taskAnswer = res.data;

						// 设置已提交状态
						this.isSubmitted = true;

						// 将已提交的内容设置到编辑器中
						this.submissionContent = res.data.context || '';
						this.generateDisplayContent();
					}
				} else {
					console.error('获取任务答案失败:', res.msg);
				}
			} catch (error) {
				console.error('获取任务答案失败:', error);
			}
		},

		// 重新提交
		editSubmission() {
			// 将已提交状态设为false，显示编辑器
			this.hasSubmitted = false;
			this.isSubmitted = false;

			// 确保内容正确显示在编辑器中
			this.$nextTick(() => {
				this.generateDisplayContent();
			});
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
			if (!this.taskDetail) return;

			this.aiAnalyzing = true;
			this.aiAnalysisData = null;
			this.currentAnalysisIndex = 0;

			try {
				// 调用AI解析接口
				const res = await this.getTaskAnalyst({ prompt: this.taskDetail.groupTaskContext });
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
	// 页面加载时获取参数
	onLoad(options) {
		// 监听从其他页面传来的参数
		try {
			const eventChannel = this.getOpenerEventChannel();
			if (eventChannel) {
				eventChannel.on('taskData', (data) => {
					if (data && data.taskId) {
						this.taskId = data.taskId;
						this.groupId = data.groupId;

						// 如果传递了任务详情，直接使用
						if (data.taskDetail) {
							this.loadTaskDetail(data.taskDetail);
						}

						// 加载我的任务答案
						this.loadMyTaskAnswer();
					}
				});
			}
		} catch (error) {
			console.error('Error in onLoad - eventChannel:', error);
		}

		// 获取当前用户角色
		const userInfo = uni.getStorageSync('userInfo');
		if (userInfo && userInfo.status) {
			// 1: 学生, 2: 教师, 3: 企业
			if (userInfo.status === 2) {
				this.currentUserRole = 'teacher';
			} else if (userInfo.status === 3) {
				this.currentUserRole = 'enterprise';
			}
		} else {
			// 默认为学生
			this.currentUserRole = 'member';
		}

		// 初始化时根据submissionContent生成displayContent
		this.$nextTick(() => {
			this.generateDisplayContent();
		});
	},

	// 页面显示时的处理
	onShow() {
		console.log('任务详情页面显示');
		// 监听键盘事件
		// 确保传递给uni.onKeyboardHeightChange的是一个函数
		try {
			// 先检查this.onKeyboardHeightChange是否存在且为函数
			if (this.onKeyboardHeightChange && typeof this.onKeyboardHeightChange === 'function') {
				uni.onKeyboardHeightChange(this.onKeyboardHeightChange);
			} else {
				console.warn('onKeyboardHeightChange is not a valid function, cannot register keyboard listener');
			}
		} catch (error) {
			console.error('Error registering keyboard height change listener in onShow:', error);
		}
	},

	// 页面卸载时的处理
	onUnload() {
		console.log('任务详情页面卸载');
		// 清理可能存在的定时器
		if (this.backTimeout) {
			clearTimeout(this.backTimeout);
		}

		// 取消监听键盘事件
		// 确保传递给uni.offKeyboardHeightChange的是一个函数
		try {
			// 先检查this.onKeyboardHeightChange是否存在且为函数
			if (this.onKeyboardHeightChange && typeof this.onKeyboardHeightChange === 'function') {
				uni.offKeyboardHeightChange(this.onKeyboardHeightChange);
			} else {
				console.warn('onKeyboardHeightChange is not a valid function, cannot unregister keyboard listener');
			}
		} catch (error) {
			console.error('Error unregistering keyboard height change listener in onUnload:', error);
		}
	},

	// 键盘高度变化处理
	onKeyboardHeightChange(res) {
		try {
			this.keyboardHeight = res.height || 0;

			// 当键盘弹起时，调整图片工具栏的位置
			if (res.height > 0) {
				// 键盘弹起，将工具栏定位在键盘上方
				this.toolbarBottom = res.height;
				console.log('键盘弹起，高度:', res.height);

				// 如果文本框处于聚焦状态，滚动到最后一行
				if (this.isTextareaFocused) {
					// 延迟执行，确保布局已更新
					setTimeout(() => {
						this.scrollToTextareaBottom();
					}, 100);
				}
			} else {
				// 键盘收起，将工具栏定位在页面底部
				this.toolbarBottom = 0;
				console.log('键盘收起');
			}

			// 强制重新计算布局
			this.$forceUpdate();
		} catch (error) {
			console.error('Error in onKeyboardHeightChange:', error);
		}
	},
}
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #f5f7fb;
	display: flex;
	flex-direction: column;
	position: relative;
}

.app-header {
	background: linear-gradient(135deg, #4361ee, #3f37c9);
	color: white;
	padding: 15px 20px;
	padding-top: 5vh;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	position: sticky;
	top: 0;
	z-index: 100;
	flex-shrink: 0;
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

.logo u-icon {
	margin-right: 8px;
}

.header-actions {
	display: flex;
	cursor: pointer;
}

/* 选项卡样式 - 与groupApplications.vue保持一致 */
.tabs-container {
	display: flex;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 25px;
	padding: 4px;
}

.tab-item {
	flex: 1;
	text-align: center;
	padding: 8px 12px;
	border-radius: 20px;
	position: relative;
	cursor: pointer;
	transition: all 0.3s ease;
}

.tab-item.active {
	background: rgba(255, 255, 255, 0.3);
	font-weight: 600;
}

.content-container {
	flex: 1;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	min-height: 0;
	/* 关键：允许flex子项正确收缩 */
}

.white-background {
	background-color: #ffffff;
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	min-height: 0;
	/* 关键：允许flex子项正确收缩 */
}

.content-scroll {
	flex: 1;
	overflow-y: auto;
	min-height: calc(100vh - 300rpx);
	/* 关键：允许flex子项正确收缩 */
}

.content {
	padding: 20px;
	min-height: 100%;
	position: relative;
}

.tab-content {
	animation: fadeIn 0.3s ease-in-out;
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

.section-title {
	font-size: 1.1rem;
	font-weight: 600;
	color: #212529;
	flex: 1;
	margin-right: 20px;
	line-height: 1.5;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
}

.submission-actions {
	display: flex;
	gap: 10px;
}

/* 调整uview按钮样式 */
::v-deep .u-button--mini {
	height: 30px !important;
	line-height: 30px !important;
	padding: 0 10px !important;
	font-size: 13px !important;
	width: auto;
	min-width: 50px;
}

.section-divider {
	border: none;
	height: 1px;
	background-color: #e9ecef;
	margin: 0 0 15px 0;
	width: 100%;
}

.editor-container {
	display: flex;
	flex-direction: column;
	min-height: 300px;
	height: 100%;
	flex: 1;
	position: relative;
}

/* 文本框容器样式 */
.textarea-container {
	flex: 1;
	min-height: 200px;
	border: 1px solid #e9ecef;
	border-radius: 8px;
	overflow: hidden;
	position: relative;
}

.submission-form {
	display: flex;
	flex-direction: column;
	flex: 1;
	min-height: 0;
	position: relative;
}

.submission-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
	padding: 8px 12px;
	background-color: #f8f9fa;
	border-radius: 8px;
	width: 100%;
	box-sizing: border-box;
	flex-shrink: 0;
}

.markdown-info {
	display: flex;
	align-items: center;
	gap: 5px;
}

.markdown-text {
	font-size: 0.85rem;
	color: #495057;
	font-weight: 500;
}

.submission-text {
	width: 100%;
	min-height: 100%;
	/* 确保文本框占满scroll-view */
	padding: 12px;
	font-size: 0.95rem;
	line-height: 1.5;
	background-color: #ffffff;
	transition: all 0.3s ease;
	border: none;
	outline: none;
	box-shadow: none;
	border-radius: 8px;
	box-sizing: border-box;
	resize: none;
	overflow-y: visible;
	/* 允许内容溢出，由scroll-view处理滚动 */
}

/* 图片功能栏样式 */
.image-toolbar-container {
	position: relative;
	width: 100%;
	flex-shrink: 0;
	/* 防止在flex布局中收缩 */
}

.image-toolbar {
	display: flex;
	align-items: center;
	padding: 10px 0;
	border-top: 1px solid #e9ecef;
	margin-top: 10px;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #ffffff;
	z-index: 999;
	transition: bottom 0.3s ease;
	box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
	/* 添加阴影以更好地分隔 */
}

.image-toolbar.keyboard-up {
	/* 当键盘弹起时的样式调整 */
}

.toolbar-icon {
	margin-right: 8px;
	cursor: pointer;
	padding: 0 20px;
}

.toolbar-text {
	font-size: 0.9rem;
	color: #4361ee;
	cursor: pointer;
}

.permission-prompt {
	background: white;
	border-radius: 16px;
	padding: 40px 20px;
	text-align: center;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	min-height: calc(100vh - 300px);
	/* 占满剩余空间 */
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.permission-prompt u-icon {
	font-size: 2.5rem;
	margin-bottom: 15px;
	color: #6c757d;
}

.permission-prompt p {
	font-size: 1.1rem;
	font-weight: 500;
	color: #212529;
	margin-bottom: 8px;
}

.permission-prompt small {
	font-size: 0.9rem;
	color: #6c757d;
}

.empty-state {
	text-align: center;
	padding: 40px 20px;
	color: #6c757d;
}

.empty-state u-icon {
	font-size: 2.5rem;
	margin-bottom: 15px;
	color: #adb5bd;
}

/* 权限提示信息样式 */
.permission-note {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-top: 15px;
	padding: 10px 15px;
	background-color: #e9f4ff;
	border-radius: 8px;
	border-left: 4px solid #4361ee;
}

.permission-note small {
	color: #4361ee;
	font-size: 0.9rem;
}

/* 已提交内容显示样式 */
.submitted-content {
	background-color: #ffffff;
	border-radius: 0;
	padding: 0;
	box-shadow: none;
	margin-bottom: 0;
}

.submitted-content-display {
	border: none;
	border-radius: 0;
	padding: 0;
	background-color: #ffffff;
	min-height: 200px;
}

/* 查看答案按钮区域 */
.view-answers-section {
	margin-top: 20px;
	text-align: center;
	padding: 20px 0;
	border-top: 1px solid #e9ecef;
}

::v-deep .view-answers-section .u-button {
	width: 80%;
	height: 40px;
	font-size: 16px;
}

/* 模态框样式 */
.modal-content {
	width: calc(100vw - 40px);
	background: white;
	border-radius: 10px;
	overflow: hidden;
	max-height: 80vh;
	overflow-y: auto;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px;
	border-bottom: 1px solid #e9ecef;
	position: sticky;
	top: 0;
	background: white;
	z-index: 10;
}

.modal-header h3 {
	margin: 0;
	font-size: 1.2rem;
	font-weight: 600;
}

.modal-header u-icon {
	cursor: pointer;
}

.modal-body {
	padding: 20px;
}

.task-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 15px;
}

.task-title {
	font-weight: 600;
	font-size: 1.3rem;
	margin-right: 15px;
	flex: 1;
	line-height: 1.4;
	color: #212529;
}

.task-status {
	padding: 6px 12px;
	border-radius: 16px;
	font-size: 0.85rem;
	font-weight: 500;
	white-space: nowrap;
}

.status-not-started {
	background: #ffe9c9;
	color: #e67700;
}

.status-in-progress {
	background: #d4edda;
	color: #155724;
}

.status-completed {
	background: #d1ecf1;
	color: #0c5460;
}

.status-expired {
	background: #f8d7da;
	color: #721c24;
}

.task-meta {
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin-bottom: 20px;
	font-size: 0.9rem;
	color: #6c757d;
}

.task-meta-item {
	display: flex;
	align-items: center;
	gap: 8px;
}

.task-progress {
	margin-bottom: 20px;
}

.progress-info {
	display: flex;
	justify-content: space-between;
	margin-bottom: 8px;
	font-size: 0.9rem;
}

.progress-bar {
	height: 10px;
	background: #e9ecef;
	border-radius: 5px;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background: linear-gradient(90deg, #4895ef, #4cc9f0);
	border-radius: 5px;
	transition: width 0.3s ease;
}

.info-item {
	display: flex;
	justify-content: space-between;
	margin-bottom: 15px;
	padding-bottom: 15px;
	border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
	margin-bottom: 0;
	border-bottom: none;
}

.info-item label {
	font-weight: 500;
	color: #495057;
}

.info-item span {
	color: #212529;
}

.modal-footer {
	padding: 0 20px 20px;
	text-align: center;
	position: sticky;
	bottom: 0;
	background: white;
	z-index: 10;
}

.modal-footer u-button {
	width: 100px;
	height: 36px;
}

/* 分数显示样式 */
.score-section {
	margin-bottom: 15px;
	padding: 10px 15px;
	background-color: #e8f4ff;
	border-radius: 8px;
	border-left: 4px solid #4361ee;
}

.score-display {
	display: flex;
	align-items: center;
	gap: 8px;
}

.score-label {
	font-size: 0.9rem;
	color: #4361ee;
	font-weight: 500;
}

.score-value {
	font-size: 1.1rem;
	font-weight: 600;
	color: #4361ee;
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

::-webkit-scrollbar {
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
	width: 90vw;
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
	to {
		transform: rotate(360deg);
	}
}
</style>