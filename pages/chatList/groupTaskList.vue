<template>
	<div>
		<div id="app">
			<!-- 顶部导航 -->
			<header class="app-header">
				<div class="header-top">
					<div class="logo">
						<i class="u-icon-arrow-left" @click="goBack"></i>
						<span>小组任务</span>
					</div>
					<div class="header-actions">
						<i class="u-icon-search" @click="toggleSearch"></i>
					</div>
				</div>
				
				<!-- 搜索框 -->
				<div class="search-container" v-show="showSearch">
					<input 
						class="search-input" 
						v-model="searchKeyword" 
						placeholder="搜索任务标题..." 
						@input="onSearchInput"
						ref="searchInput"
					/>
					<button class="search-btn" @click="clearSearch">
						<i class="u-icon-close"></i>
					</button>
				</div>
			</header>

			<!-- 内容区域 -->
			<div class="content">
				<!-- 筛选选项卡 -->
				<div class="filter-tabs">
					<div class="filter-tab" :class="{active: activeFilter === 'all'}" @click="setFilter('all')">
						全部任务
					</div>
					<div class="filter-tab" :class="{active: activeFilter === 'active'}" @click="setFilter('active')">
						进行中
					</div>
					<div class="filter-tab" :class="{active: activeFilter === 'completed'}" @click="setFilter('completed')">
						已完成
					</div>
				</div>

				<!-- 加载状态 -->
				<div v-if="loading" class="loading-container">
					<div class="loading-spinner"></div>
					<p>正在加载任务...</p>
				</div>

				<!-- 任务列表 -->
				<div v-else-if="filteredTasks.length > 0">
					<div class="task-card" v-for="task in filteredTasks" :key="task.id">
						<div class="task-header">
							<div class="task-title">{{ task.groupTask }}</div>
							<div class="task-status" :class="getStatusClass(task)">
								{{ getStatusText(task) }}
							</div>
						</div>
						<div class="task-meta">
							<div class="task-meta-item">
								<i class="u-icon-calendar"></i>
								<span>开始: {{ formatDate(task.groupTaskStartTime) }}</span>
							</div>
							<div class="task-meta-item">
								<i class="u-icon-clock"></i>
								<span>截止: {{ formatDate(task.groupTaskLastTime) }}</span>
							</div>
						</div>
						<div class="task-progress">
							<div class="progress-info">
								<span>完成进度</span>
								<span>{{ task.groupTaskFinish }} /
									{{ task.groupTaskFinish + task.groupTaskUnfinished }}</span>
							</div>
							<div class="progress-bar">
								<div class="progress-fill" :style="{width: calculateProgress(task) + '%'}"></div>
							</div>
						</div>
						<div class="task-footer">
							<div class="task-author">
								发布者: {{ task.groupTaskUploader }}
							</div>
							<div class="task-actions">
								<button class="task-action-btn btn-primary" @click="viewTaskDetails(task)">
									<i class="u-icon-eye"></i> 查看
								</button>
								<button class="task-action-btn btn-danger" v-if="canEditTask(task)" @click="deleteTask(task)">
									<i class="u-icon-delete"></i> 删除
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- 空状态 -->
				<div class="empty-state" v-else>
					<i class="u-icon-file"></i>
					<h3>暂无任务</h3>
					<p v-if="searchKeyword">没有找到匹配的任务</p>
					<p v-else>当前没有任务，请点击右下角按钮添加</p>
				</div>
			</div>

			<!-- 添加任务按钮 -->
			<div class="add-task-btn" v-if="canPublishTask" @click="addNewTask">
				<i class="u-icon-plus"></i>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex';

	export default {
		data() {
			return {
				searchKeyword: '',
				activeFilter: 'all', // 默认显示全部任务
				currentUserId: uni.getStorageSync('id') || 3, // 当前用户ID
				currentUserRole: 'leader', // 当前用户角色: leader, deputy, teacher, enterprise, member
				groupId: null, // 从参数传入的群组ID
				loading: false, // 加载状态
				searchTimer: null, // 搜索防抖定时器
				showSearch: false // 是否显示搜索框
			}
		},
		computed: {
			// 正确使用命名空间
			...mapState('groupTask', ['groupTasks']),

			// 判断用户是否有权限发布任务
			canPublishTask() {
				return ['leader', 'deputy', 'teacher', 'enterprise'].includes(this.currentUserRole);
			},

			// 过滤和排序后的任务列表
			filteredTasks() {
				// 确保groupTasks存在且为数组
				let filtered = this.groupTasks && Array.isArray(this.groupTasks) ? this.groupTasks : [];

				// 根据搜索关键词过滤
				if (this.searchKeyword) {
					const keyword = this.searchKeyword.toLowerCase();
					filtered = filtered.filter(task =>
						task.groupTask && task.groupTask.toLowerCase().includes(keyword)
					);
				}

				// 根据活动筛选器过滤
				if (this.activeFilter === 'active') {
					filtered = filtered.filter(task => this.getTaskStatus(task) === '进行中');
				} else if (this.activeFilter === 'completed') {
					filtered = filtered.filter(task => this.getTaskStatus(task) === '已结束');
				}

				// 排序：进行中的任务优先，然后按截止时间排序
				return filtered.sort((a, b) => {
					const statusA = this.getTaskStatus(a);
					const statusB = this.getTaskStatus(b);

					// 进行中的任务优先
					if (statusA === '进行中' && statusB !== '进行中') return -1;
					if (statusB === '进行中' && statusA !== '进行中') return 1;

					// 未开始的任务次之
					if (statusA === '未开始' && statusB === '已结束') return -1;
					if (statusB === '未开始' && statusA === '已结束') return 1;

					// 按截止时间排序
					const timeA = new Date(a.groupTaskLastTime);
					const timeB = new Date(b.groupTaskLastTime);
					
					// 确保日期有效
					if (isNaN(timeA.getTime())) return 1;
					if (isNaN(timeB.getTime())) return -1;
					
					return timeA - timeB;
				});
			}
		},
		methods: {
			// 正确使用命名空间
			...mapActions('groupTask', ['selectMyGroupTask']),
			
			// 返回上一页
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},

			// 切换搜索框显示
			toggleSearch() {
				this.showSearch = !this.showSearch;
				if (this.showSearch) {
					this.$nextTick(() => {
						this.$refs.searchInput && this.$refs.searchInput.focus();
					});
				} else {
					this.searchKeyword = '';
				}
			},

			// 清除搜索
			clearSearch() {
				this.searchKeyword = '';
				this.showSearch = false;
			},

			// 搜索输入处理（防抖）
			onSearchInput() {
				clearTimeout(this.searchTimer);
				this.searchTimer = setTimeout(() => {
					this.searchTasks();
				}, 300);
			},

			// 设置筛选器
			setFilter(filter) {
				this.activeFilter = filter;
			},

			// 查看任务详情
			viewTaskDetails(task) {
				console.log("查看任务详情:", task);
				// 跳转到任务详情页面
				uni.navigateTo({
					url: '/pages/chatList/groupTaskDetail',
					success: (res) => {
						res.eventChannel.emit("taskData", {
							taskId: task.id,
							groupId: this.groupId,
							taskDetail: task
						});
					}
				});
			},

			// 添加新任务
			addNewTask() {
				console.log("添加新任务");
				// 实际应用中可能跳转到添加任务页面
				uni.showToast({
					title: '功能开发中',
					icon: 'none'
				});
			},

			// 删除任务
			deleteTask(task) {
				uni.showModal({
					title: '确认删除',
					content: `确定要删除任务"${task.groupTask}"吗？此操作不可恢复！`,
					success: (res) => {
						if (res.confirm) {
							// 实际应用中应该调用API删除任务
							console.log("任务已删除:", task.groupTask);
							uni.showToast({
								title: '任务已删除',
								icon: 'success'
							});
						}
					}
				});
			},

			// 检查用户是否有权限编辑任务
			canEditTask(task) {
				// 发布者可以删除自己的任务
				if (task.groupTaskUploaderId === this.currentUserId) {
					return true;
				}

				// 组长、代理组长、老师和企业可以删除所有任务
				return ['leader', 'deputy', 'teacher', 'enterprise'].includes(this.currentUserRole);
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

			// 加载任务数据
			async loadTasks() {
				if (!this.groupId) {
					console.error('缺少群组ID');
					return;
				}

				try {
					this.loading = true;
					const res = await this.selectMyGroupTask({
						groupId: this.groupId,
						currentPage: 1
					});
					
					if (res.code !== 200) {
						throw new Error(res.msg || '获取任务列表失败');
					}
				} catch (error) {
					console.error('加载任务失败:', error);
					uni.showToast({
						title: '加载任务失败',
						icon: 'none',
						duration: 2000
					});
				} finally {
					this.loading = false;
				}
			}
		},

		// 页面加载时获取参数并加载数据
		onLoad(options) {
			// 监听从其他页面传来的参数
			const eventChannel = this.getOpenerEventChannel();
			if (eventChannel) {
				eventChannel.on('chatData', (data) => {
					if (data && data.groupId) {
						this.groupId = data.groupId;
						this.loadTasks();
					}
				});
			}
		},

		// 页面显示时重新加载数据
		onShow() {
			if (this.groupId) {
				this.loadTasks();
			}
		}
	}
</script>

<style>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
	}

	:root {
		--primary: #4361ee;
		--secondary: #3f37c9;
		--accent: #4895ef;
		--success: #4cc9f0;
		--warning: #f72585;
		--light: #f8f9fa;
		--dark: #212529;
		--gray: #6c757d;
		--light-gray: #e9ecef;
		--card-bg: #ffffff;
		--section-bg: #f5f7fb;
	}

	body {
		background-color: #f5f7fb;
		color: var(--dark);
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		max-width: 500px;
		margin: 0 auto;
		position: relative;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
	}

	/* 顶部导航 */
	.app-header {
		background: linear-gradient(135deg, var(--primary), var(--secondary));
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

	.header-actions {
		display: flex;
		gap: 15px;
	}

	.header-actions i {
		font-size: 1.3rem;
		cursor: pointer;
	}

	/* 搜索框样式 */
	.search-container {
		display: flex;
		gap: 10px;
		margin-top: 10px;
	}

	.search-input {
		flex: 1;
		height: 40px;
		padding: 0 15px;
		border: 1px solid var(--light-gray);
		border-radius: 8px;
		font-size: 1rem;
		transition: all 0.3s;
	}

	.search-input:focus {
		border-color: var(--primary);
		outline: none;
		box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
	}

	.search-btn {
		background: var(--primary);
		color: white;
		border: none;
		border-radius: 8px;
		padding: 0 15px;
		cursor: pointer;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.3s;
	}

	.search-btn:hover {
		background: var(--secondary);
	}

	/* 内容区域 */
	.content {
		flex: 1;
		padding: 20px;
		overflow-y: auto;
		padding-bottom: 70px;
	}

	/* 筛选选项卡 */
	.filter-tabs {
		display: flex;
		background: white;
		border-radius: 12px;
		overflow: hidden;
		margin-bottom: 20px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.filter-tab {
		flex: 1;
		text-align: center;
		padding: 12px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s;
		font-size: 0.9rem;
	}

	.filter-tab.active {
		background: var(--primary);
		color: white;
	}

	.filter-tab:not(.active):hover {
		background: var(--light);
	}

	/* 加载状态 */
	.loading-container {
		text-align: center;
		padding: 40px 20px;
	}

	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 4px solid var(--light-gray);
		border-top: 4px solid var(--primary);
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

	/* 任务卡片样式 */
	.task-card {
		background: white;
		border-radius: 16px;
		padding: 15px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		margin-bottom: 15px;
		position: relative;
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.task-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
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
		color: var(--dark);
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
		color: var(--gray);
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
		background: var(--light-gray);
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--accent), var(--success));
		border-radius: 4px;
		transition: width 0.3s ease;
	}

	.task-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 10px;
	}

	.task-author {
		font-size: 0.85rem;
		color: var(--gray);
		flex: 1;
		min-width: 120px;
	}

	.task-actions {
		display: flex;
		gap: 10px;
	}

	.task-action-btn {
		padding: 6px 12px;
		border-radius: 8px;
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		border: none;
		display: flex;
		align-items: center;
		gap: 5px;
		transition: all 0.2s;
	}

	.btn-primary {
		background: var(--primary);
		color: white;
	}

	.btn-primary:hover {
		background: var(--secondary);
	}

	.btn-danger {
		background: #f8d7da;
		color: #721c24;
	}

	.btn-danger:hover {
		background: #f5c6cb;
	}

	/* 空状态 */
	.empty-state {
		text-align: center;
		padding: 40px 20px;
		color: var(--gray);
	}

	.empty-state i {
		font-size: 3rem;
		margin-bottom: 15px;
		color: var(--light-gray);
	}

	/* 添加任务按钮 */
	.add-task-btn {
		position: fixed;
		bottom: 80px;
		right: 20px;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: var(--primary);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
		cursor: pointer;
		z-index: 90;
		transition: all 0.3s;
	}

	.add-task-btn:hover {
		background: var(--secondary);
		transform: scale(1.05);
	}

	/* 底部导航 */
	.bottom-nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: white;
		display: flex;
		justify-content: space-around;
		padding: 12px 0;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
		z-index: 100;
		max-width: 500px;
		margin: 0 auto;
	}

	.nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: var(--gray);
		text-decoration: none;
		font-size: 0.75rem;
	}

	.nav-item.active {
		color: var(--primary);
	}

	.nav-item i {
		font-size: 1.3rem;
		margin-bottom: 3px;
	}

	/* 响应式调整 */
	@media (max-width: 480px) {
		.content {
			padding: 15px;
		}

		.task-title {
			font-size: 1rem;
		}

		.add-task-btn {
			bottom: 70px;
			right: 15px;
			width: 50px;
			height: 50px;
			font-size: 1.3rem;
		}

		.task-meta {
			flex-direction: column;
			gap: 5px;
		}

		.task-footer {
			flex-direction: column;
			align-items: flex-start;
		}

		.task-actions {
			align-self: flex-end;
		}
	}
</style>




