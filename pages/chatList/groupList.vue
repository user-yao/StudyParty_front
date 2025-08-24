<template>
	<view>
		<div class="body">
			<!-- 顶部导航 -->
			<header class="app-header">
				<div class="header-top">
					<div class="logo">
						<u-icon name="arrow-left" size="50rpx" color="#fff" bold @click="uni.navigateBack(1)"></u-icon>
						<span>小组列表</span>
					</div>
					<div class="header-actions">
						<u-icon name="search" size="28" color="#fff" @click="searchGroups" title="搜索小组"></u-icon>
						<u-icon name="bell" size="28" color="#fff" @click="manageApplications" title="申请管理"></u-icon>
						<u-icon name="plus" size="30" color="#fff" @click="createGroup" title="创建小组"></u-icon>
						<u-icon name="reload" size="28" color="#fff" @click="refreshData" title="刷新"></u-icon>
					</div>
				</div>
				<div class="search-bar">
					<u-icon name="search" size="18" color="rgba(255,255,255,0.8)"></u-icon>
					<input style="color: #fff;" type="text" v-model="searchQuery" placeholder="搜索小组...">
				</div>
			</header>

			<!-- 加载状态 -->
			<div v-if="loading" class="loading-container">
				<u-loading-icon mode="flower" size="40"></u-loading-icon>
				<text class="loading-text">正在获取小组列表...</text>
			</div>

			<!-- 小组列表 -->
			<div class="groups-container" v-else>
				<!-- 下拉刷新 -->
				<u-pull-refresh v-model="refreshing" @refresh="onRefresh">
					<scroll-view 
						scroll-y="true" 
						style="height: calc(100vh - 200px);" 
						@scrolltolower="onLoadMore"
						lower-threshold="50">
						<!-- 我管理的小组 -->
						<template v-if="filteredMyGroups.length > 0">
							<div class="section-header">
								<u-icon name="star-fill" size="18" color="#4361ee"></u-icon>
								我管理的小组 ({{ myGroups.length }})
							</div>
							<div class="group-section">
								<div class="group-item" v-for="group in filteredMyGroups" :key="'my-' + group.id">
									<image class="group-avatar" @click="toGroupInfo(group.id)" :src="getGroupAvatar(group)" mode="aspectFill"></image>
									<div class="group-info" @click="toGroupInfo(group.id)">
										<div class="group-name">{{ group.groupName || '未命名小组' }}
											<span class='group-level'>Lv.{{ group.groupLevel || 1 }}</span>
											<span class='leader-badge'>组长</span>
										</div>
										<div class="group-slogan">{{ group.slogan || '暂无标语' }}</div>
										<div class="group-stats">
											<span class="member-count">{{ group.peopleNum || 0 }}/{{ group.maxPeopleNum || 10 }}人</span>
											<span class="join-status" :class="group.canJoin == 1 ? 'can-join' : 'cannot-join'">
												{{ group.canJoin == 1 ? '可加入' : '不可加入' }}
											</span>
											<span class="create-time">{{ formatTime(group.createTime) }}</span>
										</div>
									</div>
									<div class="group-actions">
										<div class="action-icon" @click="toChatPage(group)" title="群聊">
											<u-icon name="chat" size="22" color="#4895ef"></u-icon>
										</div>
										<div class="action-icon" @click="manageGroup(group)" title="管理">
											<u-icon name="setting" size="22" color="#f72585"></u-icon>
										</div>
									</div>
								</div>
							</div>
						</template>

						<!-- 我加入的小组 -->
						<template v-if="filteredJoinedGroups.length > 0">
							<div class="section-header">
								<u-icon name="account-fill" size="18" color="#4cc9f0"></u-icon>
								我加入的小组 ({{ joinedGroups.length }})
							</div>
							<div class="group-section">
								<div class="group-item" v-for="group in filteredJoinedGroups" :key="'joined-' + group.id">
									<image class="group-avatar" @click="toGroupInfo(group.id)" :src="getGroupAvatar(group)" mode="aspectFill"></image>
									<div class="group-info" @click="toGroupInfo(group.id)">
										<div class="group-name">{{ group.groupName || '未命名小组' }}
											<span class='group-level'>Lv.{{ group.groupLevel || 1 }}</span>
											<span class='member-badge'>成员</span>
										</div>
										<div class="group-slogan">{{ group.slogan || '暂无标语' }}</div>
										<div class="group-stats">
											<span class="member-count">{{ group.peopleNum || 0 }}/{{ group.maxPeopleNum || 10 }}人</span>
											<span class="join-status" :class="group.canJoin == 1 ? 'can-join' : 'cannot-join'">
												{{ group.canJoin == 1 ? '可加入' : '不可加入' }}
											</span>
											<span class="create-time">{{ formatTime(group.createTime) }}</span>
										</div>
									</div>
									<div class="group-actions">
										<div class="action-icon" @click="toChatPage(group)" title="群聊">
											<u-icon name="chat" size="22" color="#4895ef"></u-icon>
										</div>
									</div>
								</div>
							</div>
						</template>

						<!-- 空状态 -->
						<div v-if="!loading && !filteredMyGroups.length && !filteredJoinedGroups.length" class="empty-state">
							<u-empty mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png">
								<view slot="text" style="margin-top: 20px;">
									<text class="empty-tips">{{ searchQuery ? '未找到相关小组' : '还没有加入任何小组' }}</text>
									<view style="margin-top: 10px;">
										<u-button 
											type="primary" 
											size="small" 
											text="创建小组" 
											@click="createGroup"
											v-if="!searchQuery">
										</u-button>
										<u-button 
											type="info" 
											size="small" 
											text="清空搜索" 
											@click="clearSearch"
											v-else>
										</u-button>
									</view>
								</view>
							</u-empty>
						</div>

						<!-- 加载更多提示 -->
						<div v-if="hasMore && (myGroups.length > 0 || joinedGroups.length > 0)" class="load-more">
							<u-loading-icon v-if="loadingMore" mode="spinner" size="24"></u-loading-icon>
							<text class="load-more-text">
								{{ loadingMore ? '正在加载...' : '上拉刷新' }}
							</text>
						</div>

						<div v-else-if="!hasMore && (myGroups.length > 0 || joinedGroups.length > 0)" class="no-more">
							<text>—— 没有更多小组了 ——</text>
						</div>
					</scroll-view>
				</u-pull-refresh>
			</div>
		</div>
	</view>
</template>

<script>
import {
	imageUrl
} from "@/config/config.js";
import {
	mapState,
	mapMutations,
	mapActions
} from "vuex";

export default {
	data() {
		return {
			searchQuery: '',
			myGroups: [], // 我管理的小组
			joinedGroups: [], // 我加入的小组
			loading: false,
			refreshing: false,
			error: null,
			// 分页加载相关
			currentPage: 1,
			pageSize: 10,
			hasMore: true,
			loadingMore: false
		}
	},
	onShow() {
		this.loadGroupData();
	},
	computed: {
		imageUrl() {
			return imageUrl
		},
		// 过滤我管理的小组
		filteredMyGroups() {
			if (!this.searchQuery) {
				return this.myGroups;
			}
			const query = this.searchQuery.toLowerCase();
			return this.myGroups.filter(group => {
				const groupName = (group.groupName || '').toLowerCase();
				const slogan = (group.slogan || '').toLowerCase();
				return groupName.includes(query) || slogan.includes(query);
			});
		},
		// 过滤我加入的小组
		filteredJoinedGroups() {
			if (!this.searchQuery) {
				return this.joinedGroups;
			}
			const query = this.searchQuery.toLowerCase();
			return this.joinedGroups.filter(group => {
				const groupName = (group.groupName || '').toLowerCase();
				const slogan = (group.slogan || '').toLowerCase();
				return groupName.includes(query) || slogan.includes(query);
			});
		}
	},
	methods: {
		...mapActions({
			getMyGroup: "group/getMyGroup",
		}),
		// 加载小组数据
		async loadGroupData() {
			try {
				this.loading = true;
				this.error = null;
				const res = await this.getMyGroup({});
				if (res.code === 200 && res.data) {
					// 根据API返回的数据结构，第一个数组是我管理的小组，第二个数组是我加入的小组
					this.myGroups = res.data[0] || [];
					this.joinedGroups = res.data[1] || [];
					console.log('我管理的小组:', this.myGroups);
					console.log('我加入的小组:', this.joinedGroups);
					
					// 显示成功提示
					if (this.myGroups.length === 0 && this.joinedGroups.length === 0) {
						uni.showToast({
							title: '您还没有加入任何小组',
							icon: 'none',
							duration: 2000
						});
					}
				} else {
					this.error = res.msg || '获取小组列表失败';
					uni.showToast({
						title: this.error,
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('获取小组列表失败:', error);
				this.error = error.message || '网络错误';
				uni.showToast({
					title: this.error,
					icon: 'none'
				});
			} finally {
				this.loading = false;
			}
		},
		// 下拉刷新
		async onRefresh() {
			this.refreshing = true;
			try {
				// 重置分页数据
				this.resetPagination();
				// 清空现有数据
				this.myGroups = [];
				this.joinedGroups = [];
				// 重新加载数据
				await this.loadGroupData();
				uni.showToast({
					title: '刷新成功',
					icon: 'success',
					duration: 1500
				});
			} catch (error) {
				console.error('刷新失败:', error);
			} finally {
				this.refreshing = false;
			}
		},
		// 手动刷新
		refreshData() {
			this.resetPagination();
			this.myGroups = [];
			this.joinedGroups = [];
			this.loadGroupData();
		},
		// 上拉加载更多
		async onLoadMore() {
			if (this.loadingMore || !this.hasMore || this.loading) {
				return;
			}
			
			try {
				this.loadingMore = true;
				this.currentPage++;
				
				// 模拟加载更多数据（实际中要根据API支持情况修改）
				const res = await this.getMyGroup({
					currentPage: this.currentPage,
					pageSize: this.pageSize
				});
				
				if (res.code === 200 && res.data) {
					const newMyGroups = res.data[0] || [];
					const newJoinedGroups = res.data[1] || [];
					
					// 如果没有更多数据，设置 hasMore 为 false
					if (newMyGroups.length === 0 && newJoinedGroups.length === 0) {
						this.hasMore = false;
						uni.showToast({
							title: '没有更多数据了',
							icon: 'none',
							duration: 1500
						});
					} else {
						// 合并数据（去重）
						this.mergeGroups(newMyGroups, newJoinedGroups);
					}
				} else {
					// API返回错误，也认为没有更多数据
					this.hasMore = false;
				}
			} catch (error) {
				console.error('加载更多失败:', error);
				this.hasMore = false;
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				});
			} finally {
				this.loadingMore = false;
			}
		},
		// 合并新数据（去重）
		mergeGroups(newMyGroups, newJoinedGroups) {
			// 合并我管理的小组
			newMyGroups.forEach(newGroup => {
				const exists = this.myGroups.find(group => group.id === newGroup.id);
				if (!exists) {
					this.myGroups.push(newGroup);
				}
			});
			
			// 合并我加入的小组
			newJoinedGroups.forEach(newGroup => {
				const exists = this.joinedGroups.find(group => group.id === newGroup.id);
				if (!exists) {
					this.joinedGroups.push(newGroup);
				}
			});
		},
		// 重置分页数据
		resetPagination() {
			this.currentPage = 1;
			this.hasMore = true;
			this.loadingMore = false;
		},
		// 获取小组头像
		getGroupAvatar(group) {
			if (group && group.head) {
				// 如果是完整URL，直接返回
				if (group.head.startsWith('http')) {
					return group.head;
				}
				// 否则拼接baseUrl
				return this.imageUrl + group.head;
			}
			// 默认头像：使用小组名称的首字母
			return this.generateDefaultAvatar(group?.groupName || '小组');
		},
		// 生成默认头像
		generateDefaultAvatar(name) {
			const firstChar = name ? name.charAt(0) : '群';
			// 这里可以使用一个默认的头像生成服务
			return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstChar)}&background=4361ee&color=fff&size=128`;
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
					return '今天';
				} else if (days < 7) {
					return `${days}天前`;
				} else {
					return timeStr.slice(0, 10); // 返回 YYYY-MM-DD 格式
				}
			} catch (error) {
				return timeStr;
			}
		},
		// 跳转到聊天页面
		toChatPage(group) {
			// chat 参数：只包含 statu 字段，值为 'group'
			const chat = {
				statu: 'group'
			};
			
			// friend 参数：传递 group 的完整数据
			const friend = {
				friendId: group.id, // 群组ID作为friendId
				...group // 展开群组的所有数据
			};
			
			uni.navigateTo({
				url: `/pages/chatList/chatPage`,
				success: (res) => {
					res.eventChannel.emit("chatData", {
						chat,
						friend
					});
				},
				fail: (err) => {
					console.error('跳转聊天页面失败:', err);
					uni.showToast({
						title: '跳转失败',
						icon: 'none'
					});
				}
			})
		},
		// 跳转到小组信息页面
		toGroupInfo(groupId) {
			uni.navigateTo({
				url: `/pages/userInfo/groupInfo`,
				success: (res) => {
					res.eventChannel.emit("chatData", {
						groupId
					});
				}
			})
		},
		// 管理小组 - 跳转到小组信息页面
		manageGroup(group) {
			this.toGroupInfo(group.id);
		},
		// 搜索小组
		searchGroups() {
			uni.navigateTo({
				url: '/pages/chatList/searchGroup'
			});
		},
		// 管理申请
		manageApplications() {
			uni.navigateTo({
				url: '/pages/chatList/groupApplications'
			});
		},
		// 创建小组
		createGroup() {
			uni.showToast({
				title: '创建小组功能开发中',
				icon: 'none'
			});
			// TODO: 跳转到创建小组页面
			// uni.navigateTo({
			//   url: '/pages/group/createGroup'
			// });
		},
		// 清空搜索
		clearSearch() {
			this.searchQuery = '';
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

	:global(:root) {
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

	.body {
		background-color: #f5f7fb;
		color: var(--dark);
		height: 100vh;
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
	}

	.header-actions {
		display: flex;
		gap: 20px;
	}

	.header-actions i {
		font-size: 1.3rem;
	}

	.search-bar {
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50px;
		padding: 8px 15px;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.search-bar input {
		background: transparent;
		border: none;
		color: #fff;
		width: 100%;
		padding: 0 10px;
		outline: none;
		font-size: 0.95rem;
	}

	/* 加载状态 */
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60px 20px;
		color: var(--gray);
	}

	.loading-text {
		margin-top: 15px;
		font-size: 0.9rem;
		color: var(--gray);
	}

	/* 小组列表容器 */
	.groups-container {
		flex: 1;
		overflow-y: auto;
		position: relative;
		padding-bottom: 20px;
	}

	/* 分组标题 */
	.section-header {
		padding: 15px 20px 8px;
		background: var(--light);
		font-weight: 600;
		color: var(--primary);
		font-size: 1.1rem;
		margin: 10px 15px 0;
		border-radius: 16px 16px 0 0;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	/* 小组分组容器 */
	.group-section {
		background: white;
		margin: 0 15px 20px;
		border-radius: 0 0 16px 16px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		overflow: hidden;
	}

	.group-item {
		display: flex;
		align-items: center;
		padding: 15px;
		border-bottom: 1px solid var(--light-gray);
		transition: all 0.2s;
		background: white;
	}

	.group-item:last-child {
		border-bottom: none;
	}

	.group-item:hover {
		background-color: #f8f9ff;
	}

	.group-avatar {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: linear-gradient(45deg, var(--accent), var(--success));
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: bold;
		font-size: 1.2rem;
		margin-right: 15px;
		border: 2px solid var(--light-gray);
	}

	.group-info {
		flex: 1;
	}

	.group-name {
		font-weight: 600;
		margin-bottom: 3px;
		font-size: 1.05rem;
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.group-level {
		color: var(--warning);
		font-weight: 600;
		font-size: 0.75rem;
		background: linear-gradient(45deg, #ffd60a, #f72585);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.leader-badge {
		background: linear-gradient(45deg, #4361ee, #3f37c9);
		color: white;
		padding: 2px 6px;
		border-radius: 8px;
		font-size: 0.65rem;
		font-weight: 500;
	}

	.member-badge {
		background: linear-gradient(45deg, #4cc9f0, #4895ef);
		color: white;
		padding: 2px 6px;
		border-radius: 8px;
		font-size: 0.65rem;
		font-weight: 500;
	}

	.group-slogan {
		font-size: 0.85rem;
		color: var(--gray);
		margin-bottom: 5px;
		line-height: 1.2;
	}

	.group-stats {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 0.8rem;
		flex-wrap: wrap;
	}

	.member-count {
		color: var(--primary);
		font-weight: 500;
	}

	.create-time {
		color: var(--gray);
		font-size: 0.75rem;
	}

	.join-status {
		padding: 2px 8px;
		border-radius: 12px;
		font-size: 0.7rem;
		font-weight: 500;
	}

	.can-join {
		background: rgba(76, 201, 240, 0.1);
		color: var(--success);
	}

	.cannot-join {
		background: rgba(247, 37, 133, 0.1);
		color: var(--warning);
	}

	.group-actions {
		display: flex;
		gap: 15px;
	}

	.action-icon {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--light);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--primary);
		cursor: pointer;
		transition: all 0.2s;
	}

	.action-icon:active {
		background: var(--primary);
		color: white;
		transform: scale(1.1);
	}

	/* 空状态 */
	.empty-state {
		text-align: center;
		padding: 40px 20px;
		color: var(--gray);
	}

	.empty-tips {
		color: var(--gray);
		font-size: 0.9rem;
	}

	/* 加载更多样式 */
	.load-more {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		color: var(--gray);
		gap: 8px;
	}

	.load-more-text {
		font-size: 0.85rem;
		color: var(--gray);
	}

	.no-more {
		text-align: center;
		padding: 20px;
		color: var(--light-gray);
		font-size: 0.8rem;
	}

	/* 响应式调整 */
	@media (max-width: 480px) {
		.group-actions {
			gap: 8px;
		}

		.action-icon {
			width: 32px;
			height: 32px;
			font-size: 0.9rem;
		}

		.group-item {
			padding: 12px 15px;
		}
	}
</style>