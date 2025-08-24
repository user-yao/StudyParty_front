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
						<i class="u-icon-search" @click="focusSearch"></i>
					</div>
				</div>
			</header>

			<!-- 内容区域 -->
			<div class="content">
				<!-- 搜索框 -->
				<div class="search-container">
					<input class="search-input" v-model="searchKeyword" placeholder="搜索任务标题..." />
					<button class="search-btn" @click="searchTasks">
						<i class="u-icon-search"></i>
					</button>
				</div>

				<!-- 筛选选项卡 -->
				<div class="filter-tabs">
					<div class="filter-tab" :class="{active: activeFilter === 'all'}" @click="activeFilter = 'all'">
						全部任务
					</div>
					<div class="filter-tab" :class="{active: activeFilter === 'active'}"
						@click="activeFilter = 'active'">
						进行中
					</div>
					<div class="filter-tab" :class="{active: activeFilter === 'completed'}"
						@click="activeFilter = 'completed'">
						已完成
					</div>
				</div>

				<!-- 任务列表 -->
				<div v-if="filteredTasks.length > 0">
					<div class="task-card" v-for="task in filteredTasks" :key="task.id">
						<div class="task-header">
							<div class="task-title">{{ task.group_task }}</div>
							<div class="task-status" :class="getStatusClass(task)">
								{{ getStatusText(task) }}
							</div>
						</div>
						<div class="task-meta">
							<div class="task-meta-item">
								<i class="u-icon-calendar"></i>
								<span>开始: {{ formatDate(task.group_task_start_time) }}</span>
							</div>
							<div class="task-meta-item">
								<i class="u-icon-clock"></i>
								<span>截止: {{ formatDate(task.group_task_last_time) }}</span>
							</div>
						</div>
						<div class="task-progress">
							<div class="progress-info">
								<span>完成进度</span>
								<span>{{ task.group_task_finish }} /
									{{ task.group_task_finish + task.group_task_unfinished }}</span>
							</div>
							<div class="progress-bar">
								<div class="progress-fill" :style="{width: calculateProgress(task) + '%'}"></div>
							</div>
						</div>
						<div class="task-footer">
							<div class="task-author">
								发布者: {{ task.group_task_uploader }}
							</div>
							<div class="task-actions">
								<button class="task-action-btn btn-primary" @click="viewTaskDetails(task)">
									<i class="u-icon-eye"></i> 查看
								</button>
								<button class="task-action-btn btn-danger" v-if="canEditTask(task)"
									@click="deleteTask(task)">
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
	export default {
		data() {
			return {
				searchKeyword: '',
				activeFilter: 'active', // 默认显示进行中的任务
				currentUserId: 3, // 当前用户ID
				currentUserRole: 'leader', // 当前用户角色: leader, deputy, teacher, enterprise, member
				// 模拟任务数据
				tasks: [{
						id: 1,
						group_id: 1,
						group_task: "完成React项目开发",
						group_task_uploader: "姚镇涛",
						group_task_uploader_id: 3,
						group_task_start_time: "2023-07-10",
						group_task_last_time: "2023-07-25",
						group_task_finish: 5,
						group_task_context: "使用React完成一个电商网站的前端开发，包括商品列表、购物车、订单管理等功能",
						group_task_unfinished: 3,
						create_time: "2023-07-10",
						is_start: 1,
						is_end: 0
					},
					{
						id: 2,
						group_id: 1,
						group_task: "学习Vue3新特性",
						group_task_uploader: "李明",
						group_task_uploader_id: 5,
						group_task_start_time: "2023-07-15",
						group_task_last_time: "2023-07-30",
						group_task_finish: 3,
						group_task_context: "学习Vue3的组合式API和其他新特性，并完成一个小demo",
						group_task_unfinished: 5,
						create_time: "2023-07-15",
						is_start: 1,
						is_end: 0
					},
					{
						id: 3,
						group_id: 1,
						group_task: "JavaScript算法练习",
						group_task_uploader: "张华",
						group_task_uploader_id: 7,
						group_task_start_time: "2023-07-20",
						group_task_last_time: "2023-08-05",
						group_task_finish: 2,
						group_task_context: "完成LeetCode上的JavaScript算法题目，至少完成10道中等难度的题目",
						group_task_unfinished: 6,
						create_time: "2023-07-20",
						is_start: 0,
						is_end: 0
					},
					{
						id: 4,
						group_id: 1,
						group_task: "小组项目文档编写",
						group_task_uploader: "姚镇涛",
						group_task_uploader_id: 3,
						group_task_start_time: "2023-07-05",
						group_task_last_time: "2023-07-15",
						group_task_finish: 8,
						group_task_context: "编写小组项目的详细文档，包括需求分析、设计文档和用户手册",
						group_task_unfinished: 0,
						create_time: "2023-07-05",
						is_start: 1,
						is_end: 1
					},
					{
						id: 5,
						group_id: 1,
						group_task: "UI设计学习",
						group_task_uploader: "王老师",
						group_task_uploader_id: 101,
						group_task_start_time: "2023-07-25",
						group_task_last_time: "2023-08-10",
						group_task_finish: 1,
						group_task_context: "学习基本的UI设计原则和工具使用，完成一个界面设计作业",
						group_task_unfinished: 7,
						create_time: "2023-07-25",
						is_start: 1,
						is_end: 0
					}
				]
			}
		},
		computed: {
			// 判断用户是否有权限发布任务
			canPublishTask() {
				return ['leader', 'deputy', 'teacher', 'enterprise'].includes(this.currentUserRole);
			},

			// 过滤和排序后的任务列表
			filteredTasks() {
				let filtered = this.tasks;

				// 根据搜索关键词过滤
				if (this.searchKeyword) {
					const keyword = this.searchKeyword.toLowerCase();
					filtered = filtered.filter(task =>
						task.group_task.toLowerCase().includes(keyword)
					);
				}

				// 根据活动筛选器过滤
				if (this.activeFilter === 'active') {
					filtered = filtered.filter(task => task.is_start === 1 && task.is_end === 0);
				} else if (this.activeFilter === 'completed') {
					filtered = filtered.filter(task => task.is_end === 1);
				}

				// 排序：未完成的任务优先，然后按创建时间倒序
				return filtered.sort((a, b) => {
					// 优先显示未完成的任务
					if (a.is_end !== b.is_end) {
						return a.is_end - b.is_end;
					}

					// 然后按创建时间倒序
					return new Date(b.create_time) - new Date(a.create_time);
				});
			}
		},
		methods: {
			// 返回上一页
			goBack() {
				console.log("返回上一页");
				// 实际应用中可能是路由返回或页面跳转
			},

			// 聚焦搜索框
			focusSearch() {
				document.querySelector('.search-input').focus();
			},

			// 搜索任务
			searchTasks() {
				// 搜索逻辑已经在计算属性filteredTasks中实现
				console.log("搜索任务:", this.searchKeyword);
			},

			// 查看任务详情
			viewTaskDetails(task) {
				console.log("查看任务详情:", task);
				// 实际应用中可能跳转到任务详情页面，显示完整的Markdown内容
			},

			// 添加新任务
			addNewTask() {
				console.log("添加新任务");
				// 实际应用中可能跳转到添加任务页面
			},

			// 删除任务
			deleteTask(task) {
				if (confirm(`确定要删除任务"${task.group_task}"吗？此操作不可恢复！`)) {
					const index = this.tasks.findIndex(t => t.id === task.id);
					if (index !== -1) {
						this.tasks.splice(index, 1);
						console.log("任务已删除:", task.group_task);
					}
				}
			},

			// 检查用户是否有权限编辑任务
			canEditTask(task) {
				// 发布者可以删除自己的任务
				if (task.group_task_uploader_id === this.currentUserId) {
					return true;
				}

				// 组长、代理组长、老师和企业可以删除所有任务
				return ['leader', 'deputy', 'teacher', 'enterprise'].includes(this.currentUserRole);
			},

			// 获取任务状态文本
			getStatusText(task) {
				if (task.is_end === 1) {
					return "已结束";
				} else if (task.is_start === 1) {
					return "进行中";
				} else {
					return "未开始";
				}
			},

			// 获取任务状态类名
			getStatusClass(task) {
				if (task.is_end === 1) {
					return "status-completed";
				} else if (task.is_start === 1) {
					return "status-in-progress";
				} else {
					return "status-not-started";
				}
			},

			// 计算任务进度百分比
			calculateProgress(task) {
				const total = task.group_task_finish + task.group_task_unfinished;
				if (total === 0) return 0;
				return (task.group_task_finish / total) * 100;
			},

			// 格式化日期显示
			formatDate(dateStr) {
				if (!dateStr) return '未知日期';
				return dateStr.toString().split(' ')[0];
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
	}

	.header-actions {
		display: flex;
		gap: 15px;
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

	/* 搜索框样式 */
	.search-container {
		display: flex;
		gap: 10px;
		margin-bottom: 20px;
	}

	.search-input {
		flex: 1;
		height: 40px;
		padding: 0 15px;
		border: 1px solid var(--light-gray);
		border-radius: 8px;
		font-size: 1rem;
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
		padding: 10px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s;
		font-size: 0.9rem;
	}

	.filter-tab.active {
		background: var(--primary);
		color: white;
	}

	/* 任务卡片样式 */
	.task-card {
		background: white;
		border-radius: 16px;
		padding: 15px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		margin-bottom: 15px;
		position: relative;
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
		justify-content: space-between;
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
	}

	.task-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.task-author {
		font-size: 0.85rem;
		color: var(--gray);
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
	}

	.btn-primary {
		background: var(--primary);
		color: white;
	}

	.btn-danger {
		background: #f8d7da;
		color: #721c24;
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
	}
</style>