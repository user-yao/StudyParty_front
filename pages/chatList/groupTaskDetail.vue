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
					<u-icon name="info-circle" size="24" color="#ffffff" @click="showTaskInfo"></u-icon>
				</div>
			</div>
			
			<!-- 选项卡 -->
			<div class="tabs-container">
				<div 
					class="tab-item" 
					:class="{ active: activeTab === 'question' }" 
					@click="switchTab('question')">
					题目
				</div>
				<div 
					class="tab-item" 
					:class="{ active: activeTab === 'answer' }" 
					@click="switchTab('answer')">
					作答
				</div>
			</div>
		</header>

		<!-- 内容区域 -->
		<div class="content-container">
			<!-- 白色背景容器 -->
			<div class="white-background">
				<!-- 内容区域 -->
				<scroll-view 
					class="content-scroll" 
					scroll-y="true" 
					enable-flex="true"
					@scroll="onScroll"
					:scroll-top="scrollTop"
					@touchstart="onTouchStart"
					@touchmove="onTouchMove"
					@touchend="onTouchEnd">
					<div class="content">
						<!-- 题目内容 -->
						<div v-show="activeTab === 'question'" class="tab-content">
							<!-- 任务描述 -->
							<div class="task-description-section" v-if="taskDetail">
								<h3 class="section-title">任务描述</h3>
								<hr class="section-divider" />
								<div class="description-content">
									<u-markdown 
										:content="taskDetail.groupTaskContext" 
										:previewImg="true"
										theme="light"
										:showLineNumber="false">
									</u-markdown>
								</div>
							</div>
						</div>
						
						<!-- 作答内容 -->
						<div v-show="activeTab === 'answer'" class="tab-content">
							<!-- 作业提交区域 -->
							<div class="submission-section" v-if="taskDetail">
								<div class="section-header">
									<h3 class="section-title">提交作业</h3>
									<div class="submission-actions">
										<u-button 
											type="primary" 
											size="mini"
											:disabled="isSubmitted || submitting"
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
												<u-icon 
													name="question-circle" 
													size="16" 
													color="#6c757d" 
													@click="goToMarkdownGuide">
												</u-icon>
											</div>
											<u-button 
												type="info" 
												size="mini" 
												@click="previewMarkdown">
												预览
											</u-button>
										</div>
										<!-- 使用scroll-view包装文本框 -->
										<scroll-view 
											class="textarea-container"
											scroll-y="true"
											:scroll-top="textareaScrollTop"
											@scroll="onTextareaScroll"
											:style="textareaContainerStyle"
											enable-flex="true">
											<textarea 
												ref="submissionTextarea"
												class="submission-text" 
												v-model="submissionContent" 
												placeholder="请输入你的作业内容，支持Markdown语法..."
												:disabled="isSubmitted"
												:style="textareaStyle"
												@focus="onTextareaFocus"
												@blur="onTextareaBlur">
											</textarea>
										</scroll-view>
									</div>
									
									<!-- 图片功能栏容器 -->
									<div class="image-toolbar-container">
										<!-- 图片功能栏 -->
										<div 
											class="image-toolbar" 
											:class="{ 'keyboard-up': keyboardHeight > 0 }"
											:style="toolbarStyle"
											ref="imageToolbar">
											<u-icon 
												name="plus-circle" 
												size="24" 
												color="#4361ee" 
												@click="uploadImage"
												class="toolbar-icon">
											</u-icon>
											<span class="toolbar-text">添加图片</span>
										</div>
									</div>
								</div>
							</div>

							<!-- 权限提示 -->
							<div class="permission-prompt" v-if="!canSubmitTask && taskDetail">
								<u-icon name="lock" size="40" color="#6c757d" v-if="taskDetail"></u-icon>
								<p v-if="taskDetail">当前无法提交作业</p>
								<small v-if="taskDetail">{{ permissionMessage }}</small>
							</div>
						</div>
					</div>
				</scroll-view>
			</div>
		</div>
		
		<!-- 任务详情模态框 -->
		<u-popup :show="showTaskInfoModal" mode="center" border-radius="10" width="80%" height="auto" @close="closeTaskInfoModal">
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
								{{ (taskDetail.groupTaskFinish || 0) + (taskDetail.groupTaskUnfinished || 0) }}</span>
						</div>
						<div class="progress-bar">
							<div class="progress-fill" :style="{width: calculateProgress(taskDetail) + '%'}"></div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<u-button type="primary" size="medium"  @click="closeTaskInfoModal">确定</u-button>
				</div>
			</div>
		</u-popup>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex';
	import { ref } from 'vue'
	export default {
		data() {
			return {
				taskId: null,
				taskDetail: null,
				submissionContent: `# 作业标题`,
				currentUserId: uni.getStorageSync('id') || 3,
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
				
				// 键盘相关
				keyboardHeight: 0,
				toolbarBottom: 0,
				
				// 文本框滚动相关
				textareaScrollTop: 0,
				isTextareaFocused: false,
				previousTextareaHeight: 0,
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

				// 作业已结束则不能提交
				if (this.getTaskStatus(this.taskDetail) === '已结束') return false;

				return true;
			},

			// 权限提示信息
			permissionMessage() {
				if (!this.taskDetail) return '正在加载任务信息...';
				
				if (this.getTaskStatus(this.taskDetail) === '已结束') {
					return '作业已结束，无法提交';
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
			// 监听文本内容变化
			submissionContent(newVal, oldVal) {
				// 如果文本框处于聚焦状态且键盘弹起，自动滚动到底部
				if (this.isTextareaFocused && this.keyboardHeight > 0) {
					// 延迟执行，确保DOM已更新
					this.$nextTick(() => {
						this.scrollToTextareaBottom();
					});
				}
			}
		},
		methods: {
			...mapActions('groupTaskAnswer', ['submitTaskAnswer']),

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
				this.isTextareaFocused = true;
				console.log('文本框获得焦点');
				
				// 延迟执行滚动到底部，确保DOM已更新
				this.$nextTick(() => {
					this.scrollToTextareaBottom();
				});
			},

			// 文本框失去焦点事件
			onTextareaBlur(e) {
				this.isTextareaFocused = false;
				console.log('文本框失去焦点');
			},

			// 滚动到文本框底部
			scrollToTextareaBottom() {
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
				const total = finish + unfinished;

				if (total === 0) return 0;
				return (finish / total) * 100;
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

				try {
					this.submitting = true;
					const res = await this.submitTaskAnswer({
						taskId: this.taskId,
						answer: this.submissionContent
					});

					if (res.code === 200) {
						uni.showToast({
							title: '作业提交成功',
							icon: 'success'
						});
						this.isSubmitted = true;
						// 清空输入框
						this.submissionContent = '';
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
					this.submitting = false;
				}
			},

			// 预览Markdown内容
			previewMarkdown() {
				if (!this.submissionContent.trim()) {
					uni.showToast({
						title: '请输入内容后再预览',
						icon: 'none'
					});
					return;
				}
				
				// 跳转到预览页面，传递markdown内容
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
			async uploadImage() {
				if (this.uploading) {
					return;
				}
				
				try {
					this.uploading = true;
					
					// 选择图片
					const [chooseErr, chooseRes] = await uni.chooseImage({
						count: 1,
						sizeType: ['compressed'],
						sourceType: ['album', 'camera']
					});
					
					if (chooseErr) {
						throw new Error('选择图片失败');
					}
					
					const tempFilePath = chooseRes.tempFilePaths[0];
					
					// 这里可以添加实际的图片上传逻辑
					// 模拟上传过程
					await new Promise(resolve => setTimeout(resolve, 1000));
					
					// 上传成功后，将图片链接插入到文本框中
					const imageMarkdown = `\n![图片描述](${tempFilePath})\n`;
					this.submissionContent += imageMarkdown;
					
					uni.showToast({
						title: '图片已添加',
						icon: 'success'
					});
				} catch (error) {
					uni.showToast({
						title: error.message || '上传失败',
						icon: 'none'
					});
				} finally {
					this.uploading = false;
				}
			},

			// 加载任务详情
			loadTaskDetail(taskData) {
				// 使用传递的任务详情数据
				this.taskDetail = taskData;
				//this.taskDetail.groupTaskContext是md内容，需要转换成html
			}
		},

		// 页面加载时获取参数
		onLoad(options) {
			// 监听从其他页面传来的参数
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
					}
				});
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
		},
		
		// 页面显示时的处理
		onShow() {
			console.log('任务详情页面显示');
			// 监听键盘事件
			uni.onKeyboardHeightChange(this.onKeyboardHeightChange);
		},
		
		// 页面卸载时的处理
		onUnload() {
			console.log('任务详情页面卸载');
			// 清理可能存在的定时器
			if (this.backTimeout) {
				clearTimeout(this.backTimeout);
			}
			
			// 取消监听键盘事件
			uni.offKeyboardHeightChange(this.onKeyboardHeightChange);
		},
		
		// 键盘高度变化处理
		onKeyboardHeightChange(res) {
			this.keyboardHeight = res.height;
			
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

	.header-actions u-icon {
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
		min-height: 0; /* 关键：允许flex子项正确收缩 */
	}

	.white-background {
		background-color: #ffffff;
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		min-height: 0; /* 关键：允许flex子项正确收缩 */
	}

	.content-scroll {
		flex: 1;
		overflow-y: auto;
		min-height: calc(100vh - 300rpx); /* 关键：允许flex子项正确收缩 */
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
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
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
		min-height: 100%; /* 确保文本框占满scroll-view */
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
		overflow-y: visible; /* 允许内容溢出，由scroll-view处理滚动 */
	}

	/* 图片功能栏样式 */
	.image-toolbar-container {
		position: relative;
		width: 100%;
		flex-shrink: 0; /* 防止在flex布局中收缩 */
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
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1); /* 添加阴影以更好地分隔 */
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
		min-height: calc(100vh - 300px); /* 占满剩余空间 */
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
</style>