<template>
	<view>
		<div class="body">
			<!-- 顶部导航 -->
			<header class="app-header">
				<div class="header-top">
					<div class="logo">
						<u-icon name="arrow-left" @click="goBack" color="#ffffff" size="20"></u-icon>
						<span>小组成员</span>
					</div>
					<div class="header-actions">
						<u-icon name="plus" @click="showInviteOptions" color="#ffffff" size="18"></u-icon>
						<u-icon name="reload" @click="refreshMembers" color="#ffffff" size="18"></u-icon>
					</div>
				</div>
			</header>

			<!-- 内容区域 -->
			<div class="content">
				<!-- 错误提示 -->
				<div v-if="error" class="error-message">
					<div class="error-icon">
						<u-icon name="info-circle" color="#ff4d4f" size="24"></u-icon>
					</div>
					<div class="error-content">
						<div class="error-text">{{ error }}</div>
						<button class="retry-btn" @click="loadGroupMembers">重新加载</button>
					</div>
				</div>

				<!-- 加载状态 -->
				<div v-if="loading" class="loading-state">
					<div class="loading-spinner"></div>
					<div class="loading-text">正在加载成员信息...</div>
				</div>

				<!-- 成员列表 -->
				<div v-else class="members-content">
					<div v-if="groupMembers.length === 0" class="empty-state">
						<div class="empty-icon">
							<u-icon name="account-fill" color="#e9ecef" size="48"></u-icon>
						</div>
						<div class="empty-text">暂无成员数据</div>
						<div class="empty-desc">请稍后刷新试试</div>
					</div>
					<div v-else>
						<div class="members-list">
							<div class="member-item" v-for="(member, index) in groupMembers" :key="member.id || index">
								<div class="member-avatar" @click="goToUserInfo(member)">
									<span v-if="!member.head">{{ member.name ? member.name.charAt(0) : '?' }}</span>
									<img v-else :src="getMemberAvatar(member)" :alt="member.name" />
								</div>
								<div class="member-info" @click="goToUserInfo(member)">
									<div class="member-name">{{ member.name || '未知用户' }}
										<!-- 成员角色标识 -->
										<span v-if="getMemberRole(member) === '组长'" class="role-tag leader">组长</span>
										<span v-else-if="getMemberRole(member) === '代理组长'" class="role-tag deputy">代理</span>
										<span v-else-if="getMemberRole(member) === '老师'" class="role-tag teacher">老师</span>
										<span v-else-if="getMemberRole(member) === '企业'" class="role-tag enterprise">企业</span>
									</div>
									<div class="member-details">
										<div class="detail-item">
											<u-icon name="man" v-if="member.sex === '男'" color="#4361ee" size="12"></u-icon>
											<u-icon name="woman" v-else-if="member.sex === '女'" color="#f72585" size="12"></u-icon>
											<span>{{ member.sex || '未知' }}</span>
										</div>
										<div class="detail-item">
											<u-icon name="bookmark" color="#4895ef" size="12"></u-icon>
											<span>{{ member.grade || '未知年级' }}</span>
										</div>
									</div>
									<div class="member-school">{{ member.school || '未知学校' }}</div>
									<div class="member-major">{{ member.major || '未知专业' }}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<!-- 邀请选项弹窗 -->
		<u-action-sheet 
			:show="showInviteSheet" 
			:actions="inviteActions" 
			title="邀请成员" 
			@close="showInviteSheet = false"
			@select="handleInviteSelect">
		</u-action-sheet>
	</view>
</template>

<script>
import { imageUrl } from "@/config/config.js";
import { mapActions, mapGetters, mapState } from "vuex";
import { selectGroupById } from "@/API/group/group.js";

export default {
	data() {
		return {
			groupId: null,
			loading: false,
			error: null,
			// 用于强制刷新头像的时间戳
			avatarTimestamp: Date.now(),
			// 小组详情信息
			groupDetail: null,
			// 邀请选项弹窗
			showInviteSheet: false,
			inviteActions: [
				{
					name: '邀请好友',
					subname: '从好友列表中选择成员邀请',
					color: '#4361ee'
				},
				{
					name: '邀请老师',
					subname: '邀请老师身份的用户加入小组',
					color: '#f72585'
				},
				{
					name: '邀请企业',
					subname: '邀请企业身份的用户加入小组',
					color: '#4cc9f0'
				}
			],
			// 选择模式：'invite'（邀请）或'deputy'（选择代理组长）或'transfer'（转让组长）
			selectMode: 'invite',
			// 选择代理组长时的来源页面
			fromPage: ''
		}
	},
	onShow() {
		// 监听从其他页面传来的参数
		const eventChannel = this.getOpenerEventChannel();
		if (eventChannel) {
			eventChannel.on('chatData', (data) => {
				if (data && data.groupId) {
					this.groupId = data.groupId;
					// 处理选择模式参数
					if (data.selectMode) {
						this.selectMode = data.selectMode;
					}
					if (data.fromPage) {
						this.fromPage = data.fromPage;
					}
					this.loadGroupMembers();
					// 加载小组详情信息
					this.loadGroupDetail();
				}
			});
		}
		
		// 处理页面参数
		const pages = getCurrentPages();
		const currentPage = pages[pages.length - 1];
		const options = currentPage.options || {};
		
		if (options.selectMode) {
			this.selectMode = options.selectMode;
		}
		
		if (options.fromPage) {
			this.fromPage = options.fromPage;
		}
	},
	computed: {
		imageUrl() {
			return imageUrl;
		},
		// 从 Vuex store 中获取小组成员数据
		groupMembers() {
			const users = this.$store.state.groupUser.groupUsers;
			return Array.isArray(users) ? users : [];
		}
	},
	methods: {
		...mapActions('groupUser', ['fetchGroupUsers']),
		...mapActions('group', ['inviteUserToGroup']), // 添加邀请用户到群组的action
		
		// 加载小组成员数据
		async loadGroupMembers() {
			if (!this.groupId) {
				this.error = '缺少群组ID';
				return;
			}
			
			try {
				this.loading = true;
				this.error = null;
				
				const res = await this.fetchGroupUsers({ groupId: this.groupId });
				if (res && res.code !== 200) {
					this.error = res.msg || '加载成员数据失败';
				}
			} catch (error) {
				this.error = '网络错误，请稍后重试';
				console.error('加载小组成员失败:', error);
			} finally {
				this.loading = false;
			}
		},
		
		// 加载小组详情信息
		async loadGroupDetail() {
			if (!this.groupId) return;
			
			try {
				const res = await selectGroupById({ groupId: this.groupId });
				if (res && res.code === 200) {
					this.groupDetail = res.data;
				}
			} catch (error) {
				console.error('加载小组详情失败:', error);
			}
		},
		
		// 获取成员角色
		getMemberRole(member) {
			if (!member || !this.groupDetail) return '成员';
			
			// 根据成员ID判断角色
			if (member.id === this.groupDetail.leader) return '组长';
			if (member.id === this.groupDetail.deputy) return '代理组长';
			if (member.id === this.groupDetail.teacher) return '老师';
			if (member.id === this.groupDetail.enterprise) return '企业';
			
			return '成员';
		},
		
		// 刷新成员列表
		refreshMembers() {
			// 更新时间戳以强制刷新头像
			this.avatarTimestamp = Date.now();
			this.loadGroupMembers();
		},
		
		// 返回上一页
		goBack() {
			uni.navigateBack({ delta: 1 });
		},
		
		// 获取成员头像
		getMemberAvatar(member) {
			if (member && member.head) {
				// 添加时间戳参数来避免缓存问题
				const timestamp = this.avatarTimestamp || Date.now();
				return this.imageUrl + member.head + '?t=' + timestamp;
			}
			return '';
		},
		
		// 跳转到用户信息页面或选择成员（根据模式）
		goToUserInfo(member) {
			// 如果是选择代理组长模式
			if (this.selectMode === 'deputy') {
				this.selectDeputy(member);
				return;
			}
			
			// 如果是转让组长模式
			if (this.selectMode === 'transfer') {
				this.selectNewLeader(member);
				return;
			}
			
			// 如果是邀请模式，跳转到用户信息页面
			if (!member || !member.id) {
				uni.showToast({ title: '用户信息不存在', icon: 'none' });
				return;
			}
			
			uni.navigateTo({
				url: '/pages/userInfo/userInfo',
				success: (res) => {
					res.eventChannel.emit('chatData', {
						id: member.id
					});
				},
				fail: (err) => {
					console.error('跳转失败:', err);
					uni.showToast({ title: '跳转失败', icon: 'none' });
				}
			});
		},
		
		// 选择代理组长
		async selectDeputy(member) {
			// 检查成员是否为学生（不是老师或企业）
			const role = this.getMemberRole(member);
			if (role === '老师' || role === '企业') {
				uni.showToast({
					title: '只能选择学生作为代理组长',
					icon: 'none'
				});
				return;
			}
			
			// 检查成员是否已经是代理组长
			if (member.id === this.groupDetail.deputy) {
				uni.showToast({
					title: '该成员已是代理组长',
					icon: 'none'
				});
				return;
			}
			
			// 检查成员是否是组长
			if (member.id === this.groupDetail.leader) {
				uni.showToast({
					title: '组长不能被设置为代理组长',
					icon: 'none'
				});
				return;
			}
			
			// 确认设置代理组长
			uni.showModal({
				title: '确认设置',
				content: `确定要设置 ${member.name} 为代理组长吗？`,
				success: async (res) => {
					if (res.confirm) {
						// 调用groupInfo页面的setNewDeputy方法
						const pages = getCurrentPages();
						const groupInfoPage = pages.find(page => page.route === 'pages/userInfo/groupInfo');
						
						if (groupInfoPage) {
							// 如果找到了groupInfo页面，直接调用其方法
							if (typeof groupInfoPage.$vm.setNewDeputy === 'function') {
								await groupInfoPage.$vm.setNewDeputy(member.id);
								uni.navigateBack({ delta: 1 });
							} else {
								uni.showToast({
									title: '设置失败，请重试',
									icon: 'none'
								});
							}
						} else {
							// 如果没有找到groupInfo页面，通过事件通道传递数据
							uni.navigateBack({
								delta: 1,
								success: () => {
									// 延迟执行以确保页面已返回
									setTimeout(() => {
										const prevPages = getCurrentPages();
										const prevPage = prevPages[prevPages.length - 1];
										if (prevPage && prevPage.route === 'pages/userInfo/groupInfo') {
											if (typeof prevPage.$vm.setNewDeputy === 'function') {
												prevPage.$vm.setNewDeputy(member.id);
											}
										}
									}, 100);
								}
							});
						}
					}
				}
			});
		},
		
		// 选择新组长
		async selectNewLeader(member) {
			// 检查成员是否为学生（不是老师或企业）
			const role = this.getMemberRole(member);
			if (role === '老师' || role === '企业') {
				uni.showToast({
					title: '只能选择学生作为组长',
					icon: 'none'
				});
				return;
			}
			
			// 检查成员是否已经是组长
			if (member.id === this.groupDetail.leader) {
				uni.showToast({
					title: '该成员已是组长',
					icon: 'none'
				});
				return;
			}
			
			// 确认转让组长
			uni.showModal({
				title: '确认转让',
				content: `确定要将组长职位转让给 ${member.name} 吗？转让后您将不再是组长`,
				success: async (res) => {
					if (res.confirm) {
						// 调用groupInfo页面的setNewLeader方法
						const pages = getCurrentPages();
						const groupInfoPage = pages.find(page => page.route === 'pages/userInfo/groupInfo');
						
						if (groupInfoPage) {
							// 如果找到了groupInfo页面，直接调用其方法
							if (typeof groupInfoPage.$vm.setNewLeader === 'function') {
								await groupInfoPage.$vm.setNewLeader(member.id);
								uni.navigateBack({ delta: 1 });
							} else {
								uni.showToast({
									title: '转让失败，请重试',
									icon: 'none'
								});
							}
						} else {
							// 如果没有找到groupInfo页面，通过事件通道传递数据
							uni.navigateBack({
								delta: 1,
								success: () => {
									// 延迟执行以确保页面已返回
									setTimeout(() => {
										const prevPages = getCurrentPages();
										const prevPage = prevPages[prevPages.length - 1];
										if (prevPage && prevPage.route === 'pages/userInfo/groupInfo') {
											if (typeof prevPage.$vm.setNewLeader === 'function') {
												prevPage.$vm.setNewLeader(member.id);
											}
										}
									}, 100);
								}
							});
						}
					}
				}
			});
		},
		
		// 显示邀请选项
		showInviteOptions() {
			// 只有在邀请模式下才显示邀请选项
			if (this.selectMode === 'invite') {
				this.showInviteSheet = true;
			} else if (this.selectMode === 'deputy') {
				uni.showToast({
					title: '当前为选择代理组长模式',
					icon: 'none'
				});
			} else if (this.selectMode === 'transfer') {
				uni.showToast({
					title: '当前为转让组长模式',
					icon: 'none'
				});
			}
		},
		
		// 处理邀请选择
		handleInviteSelect({ name }) {
			this.showInviteSheet = false;
			
			switch (name) {
				case '邀请好友':
					this.inviteFriend();
					break;
				case '邀请老师':
					this.inviteTeacherOrEnterprise(2); // 2表示老师
					break;
				case '邀请企业':
					this.inviteTeacherOrEnterprise(3); // 3表示企业
					break;
			}
		},
		
		// 邀请好友加入群组
		async inviteFriend() {
			// 只能从好友列表选择好友进行邀请
			// 跳转到好友列表页面，传递选择模式和群组ID参数
			uni.navigateTo({
				url: '/pages/chatList/friendList?selectMode=true&groupId=' + this.groupId + '&inviteType=friend'
			});
		},
		
		// 邀请老师或企业
		async inviteTeacherOrEnterprise(status) {
			// 跳转到好友列表页面，传递选择模式、群组ID和身份筛选参数
			const inviteType = status === 2 ? 'teacher' : 'enterprise';
			uni.navigateTo({
				url: `/pages/chatList/friendList?selectMode=true&groupId=${this.groupId}&inviteType=${inviteType}&status=${status}`
			});
		},
		
		// 发送邀请（供好友列表页面调用）
		async sendInvitation(userId) {
			if (!this.groupId || !userId) {
				uni.showToast({
					title: '缺少必要参数',
					icon: 'none'
				});
				return;
			}
			
			uni.showLoading({
				title: '正在邀请...'
			});
			
			try {
				const res = await this.inviteUserToGroup({
					groupId: this.groupId,
					invitedUserId: userId
				});
				
				uni.hideLoading();
				
				if (res && res.code === 200) {
					uni.showToast({
						title: '邀请已发送',
						icon: 'success'
					});
					return { success: true };
				} else if (res && res.code === 500 && res.msg === '该用户已在群组中') {
					// 用户已在群组中的特殊处理
					uni.showToast({
						title: '该用户已在群组中',
						icon: 'none'
					});
					return { success: false, reason: 'already_in_group' };
				} else {
					uni.showToast({
						title: res.msg || '邀请失败',
						icon: 'none'
					});
					return { success: false, reason: 'other' };
				}
			} catch (error) {
				uni.hideLoading();
				console.error('邀请失败:', error);
				uni.showToast({
					title: '邀请失败，请重试',
					icon: 'none'
				});
				return { success: false, reason: 'error' };
			}
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
		/* 角色标签颜色 */
		--leader-color: #ff6b6b;
		--deputy-color: #4ecdc4;
		--teacher-color: #45b7d1;
		--enterprise-color: #96ceb4;
	}

	.body {
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
		-webkit-overflow-scrolling: touch;
	}

	/* 加载状态样式 */
	.loading-state {
		text-align: center;
		padding: 40px 20px;
		color: var(--gray);
	}

	.loading-spinner {
		width: 32px;
		height: 32px;
		margin: 0 auto 15px;
		border: 3px solid var(--light-gray);
		border-top: 3px solid var(--primary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	.loading-text {
		font-size: 0.9rem;
		color: var(--gray);
	}

	/* 错误提示样式 */
	.error-message {
		background: #fff2f0;
		border: 1px solid #ffccc7;
		border-radius: 12px;
		padding: 16px;
		margin-bottom: 20px;
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.error-icon {
		color: #ff4d4f;
		font-size: 1.2rem;
	}

	.error-content {
		flex: 1;
	}

	.error-text {
		color: #ff4d4f;
		font-size: 0.9rem;
		margin-bottom: 8px;
	}

	.retry-btn {
		background: #ff4d4f;
		color: white;
		border: none;
		padding: 6px 12px;
		border-radius: 6px;
		font-size: 0.85rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.retry-btn:hover {
		background: #d9363e;
		transform: translateY(-1px);
	}

	/* 空状态样式 */
	.empty-state {
		text-align: center;
		padding: 40px 20px;
		color: var(--gray);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.empty-state .empty-icon {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 15px;
		width: 100%;
	}

	.empty-state .empty-text {
		font-size: 1rem;
		font-weight: 500;
		margin-bottom: 8px;
		color: var(--dark);
	}

	.empty-state .empty-desc {
		font-size: 0.85rem;
		color: var(--gray);
		line-height: 1.4;
	}

	/* 成员列表样式 */
	.members-list {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.member-item {
		background: white;
		border-radius: 16px;
		padding: 15px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		display: flex;
		align-items: center;
		gap: 15px;
		transition: all 0.2s ease;
	}

	.member-item:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.member-avatar {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: linear-gradient(45deg, var(--accent), var(--success));
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: bold;
		font-size: 1.5rem;
		overflow: hidden;
		flex-shrink: 0;
		cursor: pointer;
		transition: transform 0.2s;
	}

	.member-avatar:hover {
		transform: scale(1.05);
	}

	.member-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.member-info {
		flex: 1;
		min-width: 0;
		cursor: pointer;
	}

	.member-name {
		font-size: 1.1rem;
		font-weight: 600;
		margin-bottom: 5px;
		color: var(--dark);
		display: flex;
		align-items: center;
		gap: 8px;
	}

	/* 角色标签样式 */
	.role-tag {
		display: inline-block;
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 0.7rem;
		font-weight: bold;
		color: white;
	}

	.role-tag.leader {
		background-color: var(--leader-color);
	}

	.role-tag.deputy {
		background-color: var(--deputy-color);
	}

	.role-tag.teacher {
		background-color: var(--teacher-color);
	}

	.role-tag.enterprise {
		background-color: var(--enterprise-color);
	}

	.member-details {
		display: flex;
		gap: 10px;
		margin-bottom: 5px;
	}

	.detail-item {
		display: flex;
		align-items: center;
		gap: 3px;
		font-size: 0.8rem;
		color: var(--gray);
	}

	.member-school {
		font-size: 0.85rem;
		color: var(--primary);
		margin-bottom: 3px;
	}

	.member-major {
		font-size: 0.8rem;
		color: var(--gray);
	}

	.member-stats {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}

	.stat-item {
		text-align: center;
	}

	.stat-value {
		font-size: 1rem;
		font-weight: 700;
		color: var(--primary);
	}

	.stat-label {
		font-size: 0.7rem;
		color: var(--gray);
	}

	/* 动画 */
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	/* 响应式调整 */
	@media (max-width: 480px) {
		.content {
			padding: 15px;
		}

		.member-item {
			padding: 12px;
			gap: 12px;
		}

		.member-avatar {
			width: 50px;
			height: 50px;
			font-size: 1.2rem;
		}

		.member-name {
			font-size: 1rem;
		}
	}
</style>