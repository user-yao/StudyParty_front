<template>
	<view>
		<div class="body">
			<!-- 顶部导航 -->
			<header class="app-header">
				<div class="header-top">
					<div class="logo">
						<u-icon name="arrow-left" size="24" color="#fff" @click="goBack"></u-icon>
						<span>申请管理</span>
					</div>
				</div>
				
				<!-- 标签页 -->
				<div class="tabs-container">
					<div 
						class="tab-item" 
						:class="{ active: activeTab === 'received' }" 
						@click="switchTab('received')">
						<text>收到的申请</text>
						<view v-if="receivedCount > 0" class="badge">{{ receivedCount }}</view>
					</div>
					<div 
						class="tab-item" 
						:class="{ active: activeTab === 'sent' }" 
						@click="switchTab('sent')">
						<text>我的申请</text>
					</div>
				</div>
			</header>

			<!-- 内容区域 -->
			<div class="content">
				<!-- 收到的申请 -->
				<div v-if="activeTab === 'received'" class="tab-content">
					<!-- 加载状态 -->
					<div v-if="loading" class="loading-container">
						<u-loading-icon mode="flower" size="40"></u-loading-icon>
						<text class="loading-text">正在加载申请列表...</text>
					</div>

					<!-- 申请列表 -->
					<div v-else-if="receivedApplications.length > 0" class="applications-container">
						<u-pull-refresh v-model="refreshing" @refresh="onRefresh">
							<scroll-view 
								scroll-y="true" 
								style="height: calc(100vh - 200px);" 
								@scrolltolower="onLoadMore"
								lower-threshold="50">
								
								<div class="application-list">
									<div class="application-card" v-for="app in receivedApplications" :key="app.id">
										<div class="application-header">
											<!-- 根据isInvited字段决定显示申请人头像还是小组头像 -->
											<image 
												v-if="app.isInvited === 0" 
												class="user-avatar" 
												:src="getUserAvatar(app.userId)" 
												mode="aspectFill"
												@click="goToUserDetail(app.userId)">
											</image>
											<image 
												v-else 
												class="group-avatar" 
												:src="getGroupAvatar(app.groupId)" 
												mode="aspectFill"
												@click="goToGroupDetail(app.groupId)">
											</image>
											
											<div class="application-info">
												<!-- 根据isInvited字段决定显示申请人姓名还是小组名称 -->
												<div v-if="app.isInvited === 0" class="user-name">{{ app.username }}</div>
												<div v-else class="group-name">{{ app.groupName }}</div>
												
												<!-- 根据isInvited字段决定显示小组名称还是申请人姓名 -->
												<div v-if="app.isInvited === 0" class="group-name">申请加入：{{ app.groupName }}</div>
												<div v-else class="user-name">邀请人：{{ app.leaderName}}</div>
												
												<div class="apply-time">{{ formatTime(app.joinTime) }}</div>
											</div>
											<div class="application-status" :class="getStatusClass(app.status)">
												{{ getStatusText(app.status) }}
											</div>
										</div>
										
										<div v-if="app.context" class="application-message">
											<text class="message-label">申请理由：</text>
											<text class="message-content">{{ app.context }}</text>
										</div>
										
										<div v-if="app.status === 'pending'" class="application-actions">
											<u-button 
												type="error" 
												size="small" 
												text="拒绝" 
												@click="handleApplication(app, false)"
												:loading="app.processing">
											</u-button>
											<u-button 
												type="primary" 
												size="small" 
												text="同意" 
												@click="handleApplication(app, true)"
												:loading="app.processing">
											</u-button>
										</div>
									</div>
								</div>

								<!-- 加载更多 -->
								<div v-if="hasMoreReceived" class="load-more">
									<u-loading-icon v-if="loadingMore" mode="spinner" size="24"></u-loading-icon>
									<text class="load-more-text">
										{{ loadingMore ? '正在加载...' : '上拉加载更多' }}
									</text>
								</div>
								<div v-else-if="receivedApplications.length > 0" class="no-more">
									<text>—— 没有更多申请了 ——</text>
								</div>
							</scroll-view>
						</u-pull-refresh>
					</div>

					<!-- 空状态 -->
					<div v-else class="empty-state">
						<u-empty mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png">
							<view slot="text" style="margin-top: 20px;">
								<text class="empty-tips">暂无收到的申请</text>
								<view style="margin-top: 10px; color: #999; font-size: 14px;">
									<text>当有人申请加入您管理的小组时，申请将显示在这里</text>
								</view>
							</view>
						</u-empty>
					</div>
				</div>

				<!-- 我的申请 -->
				<div v-if="activeTab === 'sent'" class="tab-content">
					<!-- 加载状态 -->
					<div v-if="loading" class="loading-container">
						<u-loading-icon mode="flower" size="40"></u-loading-icon>
						<text class="loading-text">正在加载我的申请...</text>
					</div>

					<!-- 申请列表 -->
					<div v-else-if="sentApplications.length > 0" class="applications-container">
						<u-pull-refresh v-model="refreshing" @refresh="onRefresh">
							<scroll-view 
								scroll-y="true" 
								style="height: calc(100vh - 200px);" 
								@scrolltolower="onLoadMore"
								lower-threshold="50">
								
								<div class="application-list">
									<div class="application-card" v-for="app in sentApplications" :key="app.id">
										<div class="application-header">
											<!-- 根据isInvited字段决定显示小组头像还是用户头像 -->
											<image 
												v-if="app.isInvited === 0" 
												class="group-avatar" 
												:src="getGroupAvatar(app.groupId)" 
												mode="aspectFill"
												@click="goToGroupDetail(app.groupId)">
											</image>
											<image 
												v-else 
												class="user-avatar" 
												:src="getUserAvatar(app.userId)" 
												mode="aspectFill"
												@click="goToUserDetail(app.userId)">
											</image>
											
											<div class="application-info">
												<!-- 根据isInvited字段决定显示小组名称还是用户姓名 -->
												<div v-if="app.isInvited === 0" class="group-name">{{ app.groupName }}</div>
												<div v-else class="user-name">{{ app.username }}</div>
												
												<!-- 根据isInvited字段决定显示小组信息还是申请人信息 -->
												<div v-if="app.isInvited === 0" class="group-stats">
													<span class="member-count">申请状态</span>
												</div>
												<div v-else class="user-info">我邀请 {{ app.username }} 加入我的小组</div>
												
												<!-- 显示小组名称 -->
												<div v-if="app.isInvited === 1" class="group-name">小组：{{ app.groupName }}</div>
												
												<div class="apply-time">{{ formatTime(app.joinTime) }}</div>
											</div>
											<div class="application-status" :class="getStatusClass(app.status)">
												{{ getStatusText(app.status) }}
											</div>
										</div>
										
										<div v-if="app.context" class="application-message">
											<text class="message-label">申请理由：</text>
											<text class="message-content">{{ app.context }}</text>
										</div>
										
										<div class="application-actions">
											<u-button 
												type="info" 
												size="small" 
												text="查看小组" 
												@click="viewGroup(app.groupId)">
											</u-button>
											<u-button 
												v-if="app.status === 'pending'" 
												type="error" 
												size="small" 
												text="取消申请" 
												:loading="app.processing"
												@click="cancelApplication(app)">
											</u-button>
										</div>
									</div>
								</div>

								<!-- 加载更多 -->
								<div v-if="hasMoreSent" class="load-more">
									<u-loading-icon v-if="loadingMore" mode="spinner" size="24"></u-loading-icon>
									<text class="load-more-text">
										{{ loadingMore ? '正在加载...' : '上拉加载更多' }}
									</text>
								</div>
								<div v-else-if="sentApplications.length > 0" class="no-more">
									<text>—— 没有更多申请了 ——</text>
								</div>
							</scroll-view>
						</u-pull-refresh>
					</div>

					<!-- 空状态 -->
					<div v-else class="empty-state">
						<u-empty mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png">
							<view slot="text" style="margin-top: 20px;">
								<text class="empty-tips">暂无申请记录</text>
								<view style="margin-top: 10px;">
									<u-button 
										type="primary" 
										size="small" 
										text="搜索小组" 
										@click="goToSearch">
									</u-button>
								</view>
							</view>
						</u-empty>
					</div>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
import { imageUrl } from "@/config/config.js";
import { mapActions } from "vuex";

export default {
	data() {
		return {
			activeTab: 'received', // 'received' | 'sent'
			
			// 收到的申请
			receivedApplications: [],
			receivedCount: 0,
			hasMoreReceived: true,
			receivedPage: 1,
			
			// 我的申请
			sentApplications: [],
			hasMoreSent: true,
			sentPage: 1,
			
			// 状态
			loading: false,
			refreshing: false,
			loadingMore: false,
			pageSize: 10
		}
	},
	computed: {
		imageUrl() {
			return imageUrl;
		}
	},
	onShow() {
		this.loadApplications();
	},
	methods: {
		...mapActions({
			getGroupJoin: "groupJoin/getGroupJoin",
			agreeJoin: "groupJoin/agreeJoin",
			cancelJoin: "groupJoin/cancelJoin"
		}),
		
		// 切换标签页
		switchTab(tab) {
			this.activeTab = tab;
			this.loadApplications();
		},
		
		// 加载申请列表
		async loadApplications() {
			try {
				this.loading = true;
				
				// 调用getGroupJoin接口，返回的data是[收到的申请数组, 我的申请数组]
				const res = await this.getGroupJoin();
				
				if (res.code === 200 && res.data && Array.isArray(res.data)) {
					const [receivedApps, sentApps] = res.data;
					
					// 处理收到的申请（别人想加入我的小组）
					this.receivedApplications = (receivedApps || []).map(app => ({
						...app,
						processing: false, // 用于按钮loading状态
						status: this.getApplicationStatus(app.isPass) // 转换状态
					}));
					
					// 处理我的申请（我想加入别人的小组）
					this.sentApplications = (sentApps || []).map(app => ({
						...app,
						processing: false, // 用于按钮loading状态
						status: this.getApplicationStatus(app.isPass) // 转换状态
					}));
					
					// 统计待处理的申请数量
					this.receivedCount = this.receivedApplications.filter(app => app.status === 'pending').length;
					
					console.log('收到的申请:', this.receivedApplications);
					console.log('我的申请:', this.sentApplications);
				} else {
					// 数据格式异常时的处理
					this.receivedApplications = [];
					this.sentApplications = [];
					this.receivedCount = 0;
				}
			} catch (error) {
				console.error('加载申请列表失败:', error);
				uni.showToast({
					title: '加载失败，请重试',
					icon: 'none'
				});
			} finally {
				this.loading = false;
				this.refreshing = false;
			}
		},
			
		// 转换申请状态
		getApplicationStatus(isPass) {
			switch (isPass) {
				case 0:
					return 'pending'; // 待处理
				case 1:
					return 'approved'; // 已同意
				case 2:
					return 'rejected'; // 已拒绝
				default:
					return 'pending';
			}
		},
			
		// 获取用户名称
		getUserName(userId) {
			// 这里可以根据需要从全局状态或缓存中获取用户信息
			// 暂时返回默认值
			return `用户${userId}`;
		},
			
		// 获取小组名称
		getGroupName(groupId) {
			// 这里可以根据需要从全局状态或缓存中获取小组信息
			// 暂时返回默认值
			return `小组${groupId}`;
		},
		
		// 处理申请（同意/拒绝）
		async handleApplication(application, agree) {
			try {
				// 设置处理状态
				application.processing = true;
				
				const res = await this.agreeJoin({
					groupJoinId: application.id,
					agree: agree
				});
				
				if (res.code === 200) {
					// 更新本地状态
					application.isPass = agree ? 1 : 2; // 更新isPass字段
					application.status = agree ? 'approved' : 'rejected';
					application.processing = false;
					
					// 更新待处理数量
					this.receivedCount = this.receivedApplications.filter(app => app.status === 'pending').length;
					
					uni.showToast({
						title: agree ? '已同意申请' : '已拒绝申请',
						icon: 'success'
					});
				} else {
					application.processing = false;
					uni.showToast({
						title: res.msg || '操作失败',
						icon: 'none'
					});
				}
			} catch (error) {
				application.processing = false;
				console.error('处理申请失败:', error);
				uni.showToast({
					title: '操作失败，请重试',
					icon: 'none'
				});
			}
		},
		
		// 取消申请
		async cancelApplication(application) {
			uni.showModal({
				title: '确认取消',
				content: '确定要取消这个申请吗？',
				confirmText: '取消申请',
				cancelText: '保留',
				confirmColor: '#f56c6c',
				success: async (res) => {
					if (res.confirm) {
						try {
							// 设置加载状态
							application.processing = true;
							
							// 调用取消申请的API
							const cancelRes = await this.cancelJoin({
								groupJoinId: application.id
							});
							
							if (cancelRes.code === 200) {
								// 从列表中移除
								const index = this.sentApplications.findIndex(app => app.id === application.id);
								if (index !== -1) {
									this.sentApplications.splice(index, 1);
								}
								
								uni.showToast({
									title: '已取消申请',
									icon: 'success'
								});
							} else {
								application.processing = false;
								uni.showToast({
									title: cancelRes.msg || '取消失败',
									icon: 'none'
								});
							}
						} catch (error) {
							application.processing = false;
							console.error('取消申请失败:', error);
							uni.showToast({
								title: '取消失败，请重试',
								icon: 'none'
							});
						}
					}
				}
			});
		},
		
		// 查看小组
		viewGroup(groupId) {
			if (!groupId) {
				uni.showToast({
					title: '小组信息不存在',
					icon: 'none'
				});
				return;
			}
			
			uni.navigateTo({
				url: `/pages/userInfo/groupInfo`,
				success: (res) => {
					res.eventChannel.emit("chatData", {
						groupId: groupId
					});
				}
			});
		},
		
		// 下拉刷新
		async onRefresh() {
			await this.loadApplications();
		},
		
		// 上拉加载更多
		async onLoadMore() {
			const hasMore = this.activeTab === 'received' ? this.hasMoreReceived : this.hasMoreSent;
			
			if (hasMore && !this.loadingMore) {
				try {
					this.loadingMore = true;
					
					if (this.activeTab === 'received') {
						this.receivedPage++;
					} else {
						this.sentPage++;
					}
					
					const res = await this.getGroupJoin({
						type: this.activeTab,
						page: this.activeTab === 'received' ? this.receivedPage : this.sentPage,
						pageSize: this.pageSize
					});
					
					if (res.code === 200 && res.data) {
						const applications = Array.isArray(res.data) ? res.data : res.data.records || [];
						
						if (this.activeTab === 'received') {
							this.receivedApplications.push(...applications.map(app => ({
								...app,
								processing: false
							})));
							this.hasMoreReceived = applications.length === this.pageSize;
						} else {
							this.sentApplications.push(...applications);
							this.hasMoreSent = applications.length === this.pageSize;
						}
					}
				} catch (error) {
					console.error('加载更多失败:', error);
				} finally {
					this.loadingMore = false;
				}
			}
		},
		
		// 获取用户头像
		getUserAvatar(userId) {
			if (!userId) {
				return this.generateDefaultAvatar('用户');
			}
			// 可以根据需要从全局状态或缓存中获取用户头像
			// 暂时返回默认头像
			return this.imageUrl + `static/head/${userId}/userHeadPhoto.png`;
		},
		
		// 获取小组头像
		getGroupAvatar(groupId) {
			if (!groupId) {
				return this.generateDefaultAvatar('小组');
			}
			// 可以根据需要从全局状态或缓存中获取小组头像
			// 暂时返回默认头像
			return this.imageUrl + `static/head/${groupId}/groupHeadPhoto.png`;
		},
		
		// 生成默认头像
		generateDefaultAvatar(name) {
			const firstChar = name ? name.charAt(0) : '?';
			return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstChar)}&background=4361ee&color=fff&size=128`;
		},
		
		// 获取状态样式类
		getStatusClass(status) {
			switch (status) {
				case 'pending':
					return 'status-pending';
				case 'approved':
					return 'status-approved';
				case 'rejected':
					return 'status-rejected';
				default:
					return 'status-pending';
			}
		},
		
		// 获取状态文本
		getStatusText(status) {
			switch (status) {
				case 'pending':
					return '待处理';
				case 'approved':
					return '已同意';
				case 'rejected':
					return '已拒绝';
				default:
					return '未知';
			}
		},
		
		// 格式化时间
		formatTime(timeStr) {
			if (!timeStr) return '';
			try {
				const date = new Date(timeStr);
				const now = new Date();
				const diff = now - date;
				const days = Math.floor(diff / (1000 * 60 * 60 * 24));
				
				if (days === 0) {
					const hours = Math.floor(diff / (1000 * 60 * 60));
					if (hours === 0) {
						const minutes = Math.floor(diff / (1000 * 60));
						return minutes <= 0 ? '刚刚' : `${minutes}分钟前`;
					}
					return `${hours}小时前`;
				} else if (days < 7) {
					return `${days}天前`;
				} else {
					return timeStr.slice(0, 10);
				}
			} catch (error) {
				return timeStr;
			}
		},
		
		// 跳转到搜索页面
		goToSearch() {
			uni.navigateTo({
				url: '/pages/chatList/searchGroup'
			});
		},
		
		// 返回上一页
		goBack() {
			uni.navigateBack({ delta: 1 });
		},
		
		// 跳转到用户详情页面
		goToUserDetail(userId) {
			if (!userId) {
				uni.showToast({
					title: '用户信息不存在',
					icon: 'none'
				});
				return;
			}
			
			uni.navigateTo({
				url: '/pages/userInfo/userInfo',
				success: (res) => {
					res.eventChannel.emit("chatData", {
						id: userId
					});
				}
			});
		},
		
		// 跳转到小组详情页面
		goToGroupDetail(groupId) {
			if (!groupId) {
				uni.showToast({
					title: '小组信息不存在',
					icon: 'none'
				});
				return;
			}
			
			uni.navigateTo({
				url: '/pages/userInfo/groupInfo',
				success: (res) => {
					res.eventChannel.emit("chatData", {
						groupId: groupId
					});
				}
			});
		}
	}
}
</script>

<style scoped>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
	}

	.body {
		background-color: #f5f7fb;
		color: #212529;
		height: 100vh;
		display: flex;
		flex-direction: column;
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
		align-items: center;
		margin-bottom: 15px;
	}

	.logo {
		display: flex;
		align-items: center;
		font-weight: 700;
		font-size: 1.4rem;
		gap: 10px;
	}

	/* 标签页 */
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

	.badge {
		position: absolute;
		top: -5px;
		right: 8px;
		background: #f72585;
		color: white;
		border-radius: 10px;
		padding: 2px 6px;
		font-size: 0.7rem;
		min-width: 18px;
		height: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* 内容区域 */
	.content {
		flex: 1;
		overflow: hidden;
	}

	.tab-content {
		height: 100%;
	}

	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60px 20px;
		color: #6c757d;
	}

	.loading-text {
		margin-top: 15px;
		font-size: 0.9rem;
		color: #6c757d;
	}

	.applications-container {
		height: 100%;
		overflow: hidden;
	}

	.application-list {
		padding: 10px;
	}

	.application-card {
		background: white;
		border-radius: 12px;
		margin-bottom: 12px;
		padding: 15px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		border: 1px solid #e9ecef;
	}

	.application-header {
		display: flex;
		align-items: flex-start;
		margin-bottom: 10px;
	}

	.user-avatar, .group-avatar {
		width: 50px;
		height: 50px;
		border-radius: 25px;
		margin-right: 12px;
		background: #f8f9fa;
	}

	.application-info {
		flex: 1;
	}

	.user-name {
		font-size: 1rem;
		font-weight: 600;
		color: #212529;
		margin-bottom: 3px;
	}

	.group-name {
		font-size: 0.95rem;
		font-weight: 600;
		color: #212529;
		margin-bottom: 3px;
	}

	.group-stats {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 3px;
	}

	.member-count {
		color: #4361ee;
		font-size: 0.8rem;
		font-weight: 500;
	}

	.group-level {
		background: linear-gradient(135deg, #4361ee, #3f37c9);
		color: white;
		padding: 1px 6px;
		border-radius: 10px;
		font-size: 0.7rem;
		font-weight: 500;
	}

	.apply-time {
		color: #6c757d;
		font-size: 0.8rem;
	}

	.application-status {
		padding: 4px 10px;
		border-radius: 12px;
		font-size: 0.8rem;
		font-weight: 500;
		white-space: nowrap;
	}

	.status-pending {
		background: #fff3cd;
		color: #856404;
	}

	.status-approved {
		background: #d1ecf1;
		color: #0c5460;
	}

	.status-rejected {
		background: #f8d7da;
		color: #721c24;
	}

	.application-message {
		background: #f8f9fa;
		border-radius: 8px;
		padding: 10px;
		margin-bottom: 12px;
		font-size: 0.9rem;
		line-height: 1.4;
	}

	.message-label {
		color: #6c757d;
		font-weight: 500;
	}

	.message-content {
		color: #212529;
	}

	.application-actions {
		display: flex;
		gap: 10px;
		justify-content: flex-end;
	}

	/* 空状态 */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60px 20px;
		height: calc(100vh - 200px);
	}

	.empty-tips {
		color: #6c757d;
		font-size: 1rem;
		text-align: center;
	}

	/* 加载更多 */
	.load-more, .no-more {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		color: #6c757d;
		font-size: 0.9rem;
	}

	.load-more-text {
		margin-left: 8px;
	}
</style>