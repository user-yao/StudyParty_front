<template>
	<view class="container">
		<!-- 顶部导航 -->
		<header class="app-header">
			<div class="header-top">
				<div class="logo">
					<i class="u-icon-arrow-left" @click="goBack"></i>
					<span>任务详情</span>
				</div>
			</div>
		</header>

		<!-- 内容区域 -->
		<div class="content">
			<!-- 任务基本信息 -->
			<div class="task-card" v-if="taskDetail">
				<div class="task-header">
					<div class="task-title">{{ taskDetail.groupTask }}</div>
					<div class="task-status" :class="getStatusClass(taskDetail)">
						{{ getStatusText(taskDetail) }}
					</div>
				</div>
				<div class="task-meta">
					<div class="task-meta-item">
						<i class="u-icon-calendar"></i>
						<span>开始: {{ formatDate(taskDetail.groupTaskStartTime) }}</span>
					</div>
					<div class="task-meta-item">
						<i class="u-icon-clock"></i>
						<span>截止: {{ formatDate(taskDetail.groupTaskLastTime) }}</span>
					</div>
					<div class="task-meta-item">
						<i class="u-icon-user"></i>
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

			<!-- 任务描述 -->
			<div class="task-description" v-if="taskDetail && renderedTaskContext">
				<h3>任务描述</h3>
				<div class="description-content">
					<!-- 使用u-parse组件渲染Markdown内容 -->
					<u-parse 
						:content="renderedTaskContext" 
						:preview-img="true" 
						:show-img-menu="true"
						error-img="/static/groupInfo/dengdai.png"
						loading-img="/static/groupInfo/dengdai.png"
						@imgTap="onImageTap"
						@load="onParserLoad"
						v-if="parserLoaded"
					></u-parse>
					<!-- 加载占位符 -->
					<view v-else class="loading-placeholder">
						内容加载中...
					</view>
				</div>
			</div>

			<!-- 作业提交区域 -->
			<div class="submission-section" v-if="canSubmitTask && taskDetail">
				<h3>提交作业</h3>
				<div class="submission-form">
					<textarea 
						class="submission-text" 
						v-model="submissionContent" 
						placeholder="请输入你的作业内容..."
						:disabled="isSubmitted">
					</textarea>
					<div class="submission-actions">
						<button 
							class="submit-btn" 
							:class="{ 'btn-disabled': isSubmitted || submitting }"
							@click="submitTask"
							:disabled="isSubmitted || submitting">
							{{ isSubmitted ? '已提交' : (submitting ? '提交中...' : '提交作业') }}
						</button>
					</div>
				</div>
			</div>

			<!-- 权限提示 -->
			<div class="permission-prompt" v-if="!canSubmitTask && taskDetail">
				<i class="u-icon-lock" v-if="taskDetail"></i>
				<p v-if="taskDetail">当前无法提交作业</p>
				<small v-if="taskDetail">{{ permissionMessage }}</small>
			</div>
		</div>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex';
	
	// 引入u-parse组件
	import uParse from '@/uni_modules/uview-plus/components/u-parse/u-parse.vue';

	export default {
		// 注册u-parse组件
		components: {
			uParse
		},
		data() {
			return {
				taskId: null,
				taskDetail: null,
				submissionContent: '',
				currentUserId: uni.getStorageSync('id') || 3,
				currentUserRole: 'member', // member, leader, deputy, teacher, enterprise
				isSubmitted: false,
				loading: false,
				submitting: false,
				groupId: null,
				md: null, // markdown-it实例
				parserLoaded: false, // 解析器是否加载完成
				isProcessingHtml: false, // 防止HTML处理过程中的重复执行
				renderedContent: '' // 缓存渲染后的内容
			}
		},
		computed: {
			...mapState('user', ['userInfo']),
			
			// 渲染后的任务描述内容
			renderedTaskContext() {
				// 如果已经有缓存的内容，直接返回
				if (this.renderedContent) {
					return this.renderedContent;
				}
				
				if (!this.taskDetail || !this.taskDetail.groupTaskContext) {
					return '<p>暂无任务描述</p>';
				}
				
				// 防止重复处理
				if (this.isProcessingHtml) {
					return this.taskDetail.groupTaskContext;
				}
				
				// 如果已经有HTML标签，直接返回
				if (this.taskDetail.groupTaskContext.includes('<')) {
					const processedContent = this.processHtmlContent(this.taskDetail.groupTaskContext);
					this.renderedContent = processedContent;
					return processedContent;
				}
				
				// 对于纯文本内容，直接返回，避免复杂的处理
				this.renderedContent = this.taskDetail.groupTaskContext;
				return this.taskDetail.groupTaskContext;
			},

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
			}
		},
		methods: {
			...mapActions('groupTaskAnswer', ['submitTaskAnswer']),

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
			
			// 处理HTML内容，确保图片能够正确显示
			processHtmlContent(htmlContent) {
				try {
					// 使用正则表达式查找所有img标签
					const imgRegex = /<img[^>]*src=["']([^"']*)["'][^>]*>/g;
					
					// 替换img标签，添加样式确保图片能够正确显示
					return htmlContent.replace(imgRegex, (match, src) => {
						// 处理图片URL，确保协议正确
						let processedSrc = src;
						
						// 如果是相对路径，添加基础URL
						if (src && src.startsWith('/') && !src.startsWith('//')) {
							processedSrc = 'http://localhost:8080' + src;
						}
						// 如果没有协议，添加http协议
						else if (src && (src.startsWith('localhost') || src.startsWith('192.168') || src.startsWith('127.0.0.1'))) {
							// 只有在没有协议的情况下才添加http
							if (!src.startsWith('http://') && !src.startsWith('https://')) {
								processedSrc = 'http://' + src;
							}
						}
						
						// 确保图片标签包含必要的样式属性
						if (match && !match.includes('style=')) {
							return match.replace('<img', `<img style="max-width: 100%; height: auto; display: block; margin: 10px 0;" src="${processedSrc}"`);
						} else {
							// 替换src属性为处理后的URL
							return match.replace(/src=(["'])[^"']*["']/, `src=$1${processedSrc}$1`);
						}
					});
				} catch (error) {
					console.error('HTML内容处理失败:', error);
					return htmlContent;
				}
			},
			
			// 图片点击事件
			onImageTap(img) {
				console.log('图片被点击:', img);
				// 可以在这里添加图片预览逻辑
				if (img && img.src) {
					uni.previewImage({
						urls: [img.src],
						current: img.src
					});
				}
			},
			
			// 解析器加载完成事件
			onParserLoad() {
				console.log('u-parse解析器加载完成');
				this.parserLoaded = true;
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

			// 加载任务详情
			loadTaskDetail(taskData) {
				// 使用传递的任务详情数据
				this.taskDetail = taskData;
				// 清除缓存的内容
				this.renderedContent = '';
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
		},
		
		// 页面卸载时的处理
		onUnload() {
			console.log('任务详情页面卸载');
			// 清理可能存在的定时器
			if (this.backTimeout) {
				clearTimeout(this.backTimeout);
			}
		}
	}
</script>

<style scoped>
	.container {
		min-height: 100vh;
		background-color: #f5f7fb;
	}

	.app-header {
		background: linear-gradient(135deg, #4361ee, #3f37c9);
		color: white;
		padding: 15px 20px;
		padding-top: 30px;
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

	.content {
		padding: 20px;
	}

	.task-card {
		background: white;
		border-radius: 16px;
		padding: 15px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		margin-bottom: 20px;
	}

	.task-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 12px;
	}

	.task-title {
		font-weight: 600;
		font-size: 1.1rem;
		margin-right: 15px;
		flex: 1;
		line-height: 1.4;
		color: #212529;
	}

	.task-status {
		padding: 4px 8px;
		border-radius: 12px;
		font-size: 0.75rem;
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
		gap: 8px;
		margin-bottom: 15px;
		font-size: 0.85rem;
		color: #6c757d;
	}

	.task-meta-item {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.task-progress {
		margin-bottom: 15px;
	}

	.progress-info {
		display: flex;
		justify-content: space-between;
		margin-bottom: 5px;
		font-size: 0.85rem;
	}

	.progress-bar {
		height: 8px;
		background: #e9ecef;
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #4895ef, #4cc9f0);
		border-radius: 4px;
		transition: width 0.3s ease;
	}

	.task-description {
		background: white;
		border-radius: 16px;
		padding: 15px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		margin-bottom: 20px;
	}

	.task-description h3 {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 10px;
		color: #212529;
	}

	.description-content {
		font-size: 0.9rem;
		line-height: 1.5;
		color: #495057;
	}
	
	/* 添加u-parse组件的样式覆盖 */
	.description-content ::v-deep .\_img {
		max-width: 100% !important;
		height: auto !important;
		display: block;
		margin: 10px 0;
	}
	
	/* 加载占位符样式 */
	.loading-placeholder {
		text-align: center;
		padding: 20px;
		color: #6c757d;
	}

	.submission-section {
		background: white;
		border-radius: 16px;
		padding: 15px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		margin-bottom: 20px;
	}

	.submission-section h3 {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 10px;
		color: #212529;
	}

	.submission-text {
		width: 100%;
		min-height: 120px;
		padding: 10px;
		border: 1px solid #e9ecef;
		border-radius: 8px;
		font-size: 0.9rem;
		resize: vertical;
		margin-bottom: 15px;
	}

	.submission-text:disabled {
		background-color: #f8f9fa;
	}

	.submit-btn {
		background: #4361ee;
		color: white;
		border: none;
		border-radius: 8px;
		padding: 10px 20px;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.3s;
	}

	.submit-btn:hover:not(.btn-disabled) {
		background: #3f37c9;
	}

	.btn-disabled {
		background: #adb5bd;
		cursor: not-allowed;
	}

	.permission-prompt {
		background: white;
		border-radius: 16px;
		padding: 30px 20px;
		text-align: center;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}

	.permission-prompt i {
		font-size: 2rem;
		color: #6c757d;
		margin-bottom: 15px;
	}

	.permission-prompt p {
		font-size: 1rem;
		font-weight: 500;
		color: #212529;
		margin-bottom: 5px;
	}

	.permission-prompt small {
		font-size: 0.85rem;
		color: #6c757d;
	}

	.empty-state {
		text-align: center;
		padding: 30px 20px;
		color: #6c757d;
	}

	.empty-state i {
		font-size: 2rem;
		margin-bottom: 10px;
	}
</style>