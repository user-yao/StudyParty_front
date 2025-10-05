<template>
	<div>
		<div id="app">
			<!-- 顶部导航 -->
			<header class="app-header">
				<div class="header-top">
					<div class="logo">
						<u-icon name="arrow-left" size="24" color="#ffffff" @click="goBack"></u-icon>
						<span>小组任务</span>
					</div>
					<div class="header-actions">
						<u-icon name="search" size="24" color="#ffffff" @click="toggleSearch"></u-icon>
						<!-- 新增任务按钮 -->
						<u-icon 
							v-if="canPublishTask" 
							name="plus" 
							size="24" 
							color="#ffffff" 
							@click="addNewTask"
							class="add-task-icon"
						></u-icon>
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
						<u-icon name="close" size="20" color="#ffffff"></u-icon>
					</button>
				</div>
			</header>

			<!-- 内容区域 -->
			<div class="content">
				<!-- 加载状态 -->
				<div v-if="loading" class="loading-container">
					<div class="loading-spinner"></div>
					<p>正在加载任务...</p>
				</div>

				<!-- 任务列表分组显示 -->
				<div v-else>
					<!-- 进行中任务 -->
					<div class="task-section" v-if="groupedTasks.active.length > 0">
						<div class="section-header">
							<h3 class="section-title">进行中 ({{ groupedTasks.active.length }})</h3>
						</div>
						<div class="task-list">
							<div class="task-card" v-for="task in groupedTasks.active" :key="task.id">
								<div class="task-header">
									<div class="task-title">{{ task.groupTask }}</div>
									<div class="task-status" :class="getStatusClass(task)">
										{{ getStatusText(task) }}
									</div>
								</div>
								<div class="task-meta">
									<div class="task-meta-item">
										<u-icon name="calendar" size="16" color="#6c757d"></u-icon>
										<span>开始: {{ formatDate(task.groupTaskStartTime) }}</span>
									</div>
									<div class="task-meta-item">
										<u-icon name="clock" size="16" color="#6c757d"></u-icon>
										<span>截止: {{ formatDate(task.groupTaskLastTime) }}</span>
									</div>
								</div>
								<div class="task-progress">
									<div class="progress-info">
										<span>完成进度</span>
										<span>{{ task.groupTaskFinish }} /
											{{task.groupTaskUnfinished }}</span>
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
										<u-button type="primary" size="small" shape="circle" :plain="false" :border="false" @click="viewTaskDetails(task)">
											<u-icon name="eye" size="16" color="#ffffff"></u-icon> 查看
										</u-button>
										<u-button type="error" size="small" shape="circle" :plain="false" :border="false" v-if="canEditTask(task)" @click="deleteTask(task)">
											<u-icon name="close-circle" size="16" color="#ffffff"></u-icon> 删除
										</u-button>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<!-- 未开始任务 -->
					<div class="task-section" v-if="groupedTasks.pending.length > 0">
						<div class="section-header">
							<h3 class="section-title">未开始 ({{ groupedTasks.pending.length }})</h3>
						</div>
						<div class="task-list">
							<div class="task-card" v-for="task in groupedTasks.pending" :key="task.id">
								<div class="task-header">
									<div class="task-title">{{ task.groupTask }}</div>
									<div class="task-status" :class="getStatusClass(task)">
										{{ getStatusText(task) }}
									</div>
								</div>
								<div class="task-meta">
									<div class="task-meta-item">
										<u-icon name="calendar" size="16" color="#6c757d"></u-icon>
										<span>开始: {{ formatDate(task.groupTaskStartTime) }}</span>
									</div>
									<div class="task-meta-item">
										<u-icon name="clock" size="16" color="#6c757d"></u-icon>
										<span>截止: {{ formatDate(task.groupTaskLastTime) }}</span>
									</div>
								</div>
								<div class="task-progress">
									<div class="progress-info">
										<span>完成进度</span>
										<span>{{ task.groupTaskFinish }} /
											{{task.groupTaskUnfinished }}</span>
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
										<u-button type="primary" size="small" shape="circle" :plain="false" :border="false" @click="viewTaskDetails(task)">
											<u-icon name="eye" size="16" color="#ffffff"></u-icon> 查看
										</u-button>
										<u-button type="error" size="small" shape="circle" :plain="false" :border="false" v-if="canEditTask(task)" @click="deleteTask(task)">
											<u-icon name="close-circle" size="16" color="#ffffff"></u-icon> 删除
										</u-button>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<!-- 已结束任务 -->
					<div class="task-section" v-if="groupedTasks.completed.length > 0">
						<div class="section-header">
							<h3 class="section-title">已结束 ({{ groupedTasks.completed.length }})</h3>
						</div>
						<div class="task-list">
							<div class="task-card" v-for="task in groupedTasks.completed" :key="task.id">
								<div class="task-header">
									<div class="task-title">{{ task.groupTask }}</div>
									<div class="task-status" :class="getStatusClass(task)">
										{{ getStatusText(task) }}
									</div>
								</div>
								<div class="task-meta">
									<div class="task-meta-item">
										<u-icon name="calendar" size="16" color="#6c757d"></u-icon>
										<span>开始: {{ formatDate(task.groupTaskStartTime) }}</span>
									</div>
									<div class="task-meta-item">
										<u-icon name="clock" size="16" color="#6c757d"></u-icon>
										<span>截止: {{ formatDate(task.groupTaskLastTime) }}</span>
									</div>
								</div>
								<div class="task-progress">
									<div class="progress-info">
										<span>完成进度</span>
										<span>{{ task.groupTaskFinish }} /
											{{ task.groupTaskUnfinished }}</span>
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
										<u-button type="primary" size="small" shape="circle" :plain="false" :border="false" @click="viewTaskDetails(task)">
											<u-icon name="eye" size="16" color="#ffffff"></u-icon> 查看
										</u-button>
										<u-button type="error" size="small" shape="circle" :plain="false" :border="false" v-if="canEditTask(task)" @click="deleteTask(task)">
											<u-icon name="close-circle" size="16" color="#ffffff"></u-icon> 删除
										</u-button>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<!-- 空状态 -->
					<div class="empty-state" v-if="groupedTasks.active.length === 0 && groupedTasks.pending.length === 0 && groupedTasks.completed.length === 0">
						<u-icon name="file-text" size="48" color="#e9ecef"></u-icon>
						<h3>暂无任务</h3>
						<p v-if="searchKeyword">没有找到匹配的任务</p>
						<p v-else>当前没有任务</p>
					</div>
				</div>
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
				groupId: null, // 从参数传入的群组ID
				loading: false, // 加载状态
				searchTimer: null, // 搜索防抖定时器
				showSearch: false // 是否显示搜索框
			}
		},
		computed: {
			// 正确使用命名空间
			...mapState('groupTask', ['groupTasks']),
			...mapState('user', ['userInfo']),
			...mapState('groupUser', ['groupUsers']),
			...mapState('group', ['groupMap']),

			// 获取当前用户ID
			currentUserId() {
				return this.userInfo && this.userInfo.id ? this.userInfo.id : null;
			},

			// 判断用户是否有权限发布任务
			canPublishTask() {
				// 如果还没有群组ID，先返回false
				if (!this.groupId) {
					return false;
				}
				
				// 如果还没有群组用户信息，先返回false
				if (!this.groupUsers || !Array.isArray(this.groupUsers) || !this.currentUserId) {
					return false;
				}
				
				// 在群组用户中查找当前用户
				const currentUser = this.groupUsers.find(user => user.id === this.currentUserId);
				
				// 如果没找到当前用户信息，默认没有权限
				if (!currentUser) {
					return false;
				}
				
				// 获取当前用户在群组中的角色
				if(currentUser.status != 1){
					return true;
				}
				
				// 确保groupMap存在且能获取到群组信息
				const group = this.groupMap && this.groupMap.get ? this.groupMap.get(this.groupId) : null;
				if(group && (group.leader == currentUser.id || group.deputy == currentUser.id)){
					return true;
				}
				return false;
			},

			// 按状态分组的任务列表
			groupedTasks() {
				// 确保groupTasks存在且为数组
				const tasks = this.groupTasks && Array.isArray(this.groupTasks) ? this.groupTasks : [];
				
				// 根据搜索关键词过滤
				let filtered = tasks;
				if (this.searchKeyword) {
					const keyword = this.searchKeyword.toLowerCase();
					filtered = filtered.filter(task =>
						task.groupTask && task.groupTask.toLowerCase().includes(keyword)
					);
				}
				
				// 按状态分组
				const active = [];   // 进行中
				const pending = [];  // 未开始
				const completed = []; // 已结束
				
				filtered.forEach(task => {
					const status = this.getTaskStatus(task);
					switch (status) {
						case '进行中':
							active.push(task);
							break;
						case '未开始':
							pending.push(task);
							break;
						case '已结束':
							completed.push(task);
							break;
						default:
							// 默认放入进行中
							active.push(task);
					}
				});
				
				// 按截止时间排序
				const sortByEndTime = (a, b) => {
					const timeA = new Date(a.groupTaskLastTime);
					const timeB = new Date(b.groupTaskLastTime);
					
					// 确保日期有效
					if (isNaN(timeA.getTime())) return 1;
					if (isNaN(timeB.getTime())) return -1;
					
					return timeA - timeB;
				};
				
				active.sort(sortByEndTime);
				pending.sort(sortByEndTime);
				completed.sort(sortByEndTime);
				
				return {
					active,
					pending,
					completed
				};
			}
		},
		methods: {
			// 正确使用命名空间
			...mapActions('groupTask', ['selectMyGroupTask']),
			...mapActions('groupUser', ['fetchGroupUsers']), // 添加获取群组用户信息的action
			
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
					// 搜索会在computed中自动处理
				}, 300);
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
				// 跳转到添加任务页面
				uni.navigateTo({
					url: '/pages/chatList/addGroupTask',
					success: (res) => {
						res.eventChannel.emit("groupData", {
							groupId: this.groupId
						});
					}
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
				if (!this.groupUsers || !Array.isArray(this.groupUsers) || !this.currentUserId) {
					return false;
				}
				
				// 在群组用户中查找当前用户
				const currentUser = this.groupUsers.find(user => user.id === this.currentUserId);
				
				// 如果没找到当前用户信息，默认没有权限
				if (!currentUser) {
					return false;
				}
				
				// 获取当前用户在群组中的角色
				const userRole = currentUser.role || 'member';
				return ['leader', 'deputy', 'teacher', 'enterprise'].includes(userRole);
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
					
					// 同时获取群组用户信息
					await this.fetchGroupUsers({ groupId: this.groupId });
					
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
		// 页面显示时重新加载数据
		onShow() {
			// 如果groupId不存在，尝试重新获取参数
			if (!this.groupId) {
				const eventChannel = this.getOpenerEventChannel();
				if (eventChannel) {
					eventChannel.once('chatData', (data) => {
						if (data && data.groupId) {
							this.groupId = data.groupId;
							this.loadTasks();
						}
					});
				}
			} else {
				// 如果已经有groupId，直接加载任务
				this.loadTasks();
			}
		},
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

	/* 新增任务图标样式 */
	.add-task-icon {
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		padding: 5px;
		transition: background 0.3s;
	}

	.add-task-icon:hover {
		background: rgba(255, 255, 255, 0.3);
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

	/* 任务分组区域 */
	.task-section {
		margin-bottom: 30px;
	}

	.section-header {
		margin-bottom: 15px;
	}

	.section-title {
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--dark);
		padding-bottom: 8px;
		border-bottom: 2px solid var(--light-gray);
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
		flex: 1;
		justify-content: space-between;
		min-width: 120px;
	}

	/* 覆盖 uView-plus 按钮默认样式 */
	.task-actions .u-button {
		flex: 1;
		justify-content: center;
		font-size: 0.85rem;
		padding: 6px 12px;
		border: none !important;
		outline: none !important;
		box-shadow: none !important;
		background-image: none !important;
		border-radius: 20px; /* 保持圆角 */
	}
	
	/* 特别处理按钮的hover状态 */
	.task-actions .u-button::after {
		border: none !important;
	}
	
	/* 覆盖uView-plus按钮的所有可能边框样式 */
	.task-actions .u-button.u-button--primary,
	.task-actions .u-button.u-button--error {
		border: none !important;
	}
	
	/* 响应式按钮调整 */
	@media (max-width: 480px) {
		.task-actions {
			min-width: 100px;
		}
		
		.task-actions .u-button {
			font-size: 0.8rem;
			padding: 5px 10px;
		}
	}
	
	/* 空状态 */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40px 20px;
		color: var(--gray);
		min-height: 300px;
	}

	.empty-state i {
		font-size: 3rem;
		margin-bottom: 15px;
		color: var(--light-gray);
	}

	/* 响应式调整 */
	@media (max-width: 480px) {
		.content {
			padding: 15px;
		}

		.task-title {
			font-size: 1rem;
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
		
		.section-title {
			font-size: 1.1rem;
		}
	}
</style>
