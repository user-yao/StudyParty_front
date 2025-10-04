<template>
	<div>
		<div id="app">
			<!-- 顶部导航 -->
			<header class="app-header">
				<div class="header-top">
					<div class="logo">
						<u-icon name="arrow-left" size="24" color="#ffffff" @click="goBack"></u-icon>
						<span>推荐任务</span>
					</div>
					<div class="header-actions">
						<u-icon name="plus" size="24" color="#ffffff" @click="goToAddTask"></u-icon>
						<u-icon name="search" size="24" color="#ffffff" @click="toggleSearch"></u-icon>
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

				<!-- 任务列表 -->
				<div v-else>
					<div class="task-list">
						<div class="task-card" v-for="task in filteredTasks" :key="task.id">
							<div class="task-header">
								<div class="task-reward-badge" v-if="task.starPrestige > 0">+{{ task.starPrestige }}声望</div>
								<div class="task-title">{{ task.title }}</div>
							</div>
							<div class="task-meta">
								<div class="task-meta-item">
									<u-icon name="clock" size="16" color="#6c757d"></u-icon>
									<span :class="getStatusClass(task)">{{ getStatusText(task) }}</span>
								</div>
								<div class="task-meta-item">
									<div class="task-user-avatar">
										<image 
											v-if="task.head" 
											:src="fullImageUrl(task.head)" 
											mode="aspectFill"
										></image>
										<div v-else class="avatar-placeholder">
											{{ task.name ? task.name.substring(0, 1) : 'U' }}
										</div>
									</div>
									<span>{{ task.name }}</span>
									<u-tag :type="getPublisherTagType(task.status)" size="mini" :plain="true" :show="true">
										{{ getIdentityText(task.status) }}
									</u-tag>
								</div>
							</div>
							<div class="task-tags" v-if="task.school">
								<span class="task-tag">{{ task.school }}</span>
							</div>
							<div class="task-footer">
								<div class="task-actions">
									<u-button type="primary" size="small" shape="circle" :plain="false" :border="false" @click="viewTaskDetails(task)">
										<u-icon name="eye" size="16" color="#ffffff"></u-icon> 查看详情
									</u-button>
								</div>
							</div>
						</div>
					</div>
					
					<!-- 空状态 -->
					<div class="empty-state" v-if="filteredTasks.length === 0">
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
	import { imageUrl } from '../../config/config.js';
	export default {
		data() {
			return {
				searchKeyword: '',
				tasks: [], // 存储从API获取的任务数据
				loading: false, // 加载状态
				searchTimer: null, // 搜索防抖定时器
				showSearch: false // 是否显示搜索框
			}
		},
		computed: {
			// 正确使用命名空间
			...mapState('user', ['userInfo']),
			
			// 获取当前用户ID
			currentUserId() {
				return this.userInfo && this.userInfo.id ? this.userInfo.id : null;
			},
			
			// 根据搜索关键词过滤任务
			filteredTasks() {
				if (!this.searchKeyword) {
					return this.tasks;
				}
				
				const keyword = this.searchKeyword.toLowerCase();
				return this.tasks.filter(task =>
					task.title && task.title.toLowerCase().includes(keyword)
				);
			}
		},
		methods: {
			// 正确使用命名空间
			...mapActions('task', ['recommend']), // 使用task模块的recommend方法
			
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
			
			// 返回上一页
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			
			// 跳转到添加任务页面
			goToAddTask() {
				uni.navigateTo({
					url: '/pages/chatList/addTask'
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
					url: `/pages/chatList/taskDetail?id=${task.id}`
				});
			},

			// 获取状态文本
			getStatusText(task) {
				return task.isOver === 1 ? '已解决' : '未解决';
			},
			
			// 获取状态类名
			getStatusClass(task) {
				return task.isOver === 1 ? 'status-completed' : 'status-pending';
			},
			
			// 获取身份标识图标
			getIdentityIcon(status) {
				switch(status) {
					case 1: return 'account'; // 学生
					case 2: return 'teacher'; // 老师
					case 3: return 'building'; // 企业
					default: return 'account';
				}
			},

			// 获取发布者标签类型
			getPublisherTagType(status) {
				switch(status) {
					case 1: return 'info'; // 学生 - 灰色
					case 2: return 'primary'; // 老师 - 蓝色
					case 3: return 'success'; // 企业 - 绿色
					default: return 'info';
				}
			},

			// 获取身份文本
			getIdentityText(status) {
				switch(status) {
					case 1: return '学生';
					case 2: return '老师';
					case 3: return '企业';
					default: return '用户';
				}
			},

			// 获取发布者图标
			getPublisherIcon(status) {
				switch(status) {
					case 2: return 'man'; // 老师
					case 3: return 'home'; // 企业
					case 1: return 'man'; // 学生
					default: return 'man';
				}
			},

			// 加载任务数据
			async loadTasks() {
				try {
					this.loading = true;
					const res = await this.recommend({
						currentPage: 1
					});
					
					if (res.code === 200 && res.data && Array.isArray(res.data.records)) {
						this.tasks = res.data.records;
					} else {
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
		// 页面显示时加载数据
		onShow() {
			this.loadTasks();
		},
		mounted() {
			this.loadTasks();
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

	/* 任务列表 */
	.task-list {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	/* 任务卡片样式 */
	.task-card {
		background: white;
		border-radius: 16px;
		padding: 15px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		position: relative;
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.task-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
	}

	.task-header {
		margin-bottom: 12px;
	}

	.task-reward-badge {
		background: #4361ee;
		color: white;
		padding: 4px 10px;
		border-radius: 15px;
		font-size: 0.8rem;
		font-weight: 500;
		display: inline-block;
		margin-bottom: 10px;
	}

	.task-title {
		font-weight: 600;
		font-size: 1.1rem;
		line-height: 1.4;
		color: var(--dark);
		margin-bottom: 10px;
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

	.task-user-avatar {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		margin-right: 8px;
		overflow: hidden;
		background: #eee;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.task-user-avatar image {
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
		font-size: 12px;
	}

	.task-tags {
		margin-bottom: 15px;
	}

	.task-tag {
		background: #eef7ff;
		color: #4361ee;
		padding: 4px 10px;
		border-radius: 12px;
		font-size: 0.8rem;
		display: inline-block;
	}
	
	/* 任务状态样式 */
	.status-completed {
		color: #28a745;
		font-weight: 600;
	}
	
	.status-pending {
		color: #dc3545;
		font-weight: 600;
	}
	
	.task-footer {
		display: flex;
		justify-content: flex-end;
	}

	.task-actions {
		display: flex;
		gap: 10px;
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
		border-radius: 20px;
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
		
		.section-title {
			font-size: 1.1rem;
		}
	}
</style>