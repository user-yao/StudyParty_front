<template>
	<view>
		<div class="body">
			<!-- 顶部导航 -->
			<header class="app-header">
				<div class="header-top">
					<div class="logo">
						<u-icon name="arrow-left" size="24" color="#fff" @click="goBack"></u-icon>
						<span>搜索小组</span>
					</div>
				</div>
				<!-- 搜索栏 -->
				<div class="search-container">
					<div class="search-bar">
						<u-icon name="search" size="18" color="rgba(255,255,255,0.8)"></u-icon>
						<input 
							style="color: #fff;" 
							type="text" 
							v-model="searchQuery" 
							placeholder="输入小组名称搜索..."
							@input="onSearchInput"
							@confirm="handleSearch">
						<u-icon v-if="searchQuery" name="close-circle-fill" size="18" color="rgba(255,255,255,0.6)" @click="clearSearch"></u-icon>
					</div>
					<div class="filter-options">
						<u-radio-group v-model="canJoinFilter" placement="row" @change="handleFilterChange">
							<u-radio label="全部" value=""></u-radio>
							<u-radio label="可加入" value="1"></u-radio>
							<u-radio label="不可加入" value="0"></u-radio>
						</u-radio-group>
					</div>
				</div>
			</header>

			<!-- 搜索结果 -->
			<div class="content">
				<!-- 加载状态 -->
				<div v-if="loading" class="loading-container">
					<u-loading-icon mode="flower" size="40"></u-loading-icon>
					<text class="loading-text">正在搜索小组...</text>
				</div>

				<!-- 搜索结果列表 -->
				<div v-else-if="searchResults.length > 0" class="groups-container">
					<u-pull-refresh v-model="refreshing" @refresh="onRefresh">
						<scroll-view 
							scroll-y="true" 
							style="height: calc(100vh - 250px);" 
							@scrolltolower="onLoadMore"
							lower-threshold="50">
							
							<div class="result-header">
								<text class="result-count">找到 {{ totalCount }} 个小组</text>
							</div>
							
							<div class="group-list">
								<div class="group-card" v-for="group in searchResults" :key="group.id">
									<div class="group-header" @click="viewGroupDetail(group)">
										<image class="group-avatar" :src="getGroupAvatar(group)" mode="aspectFill"></image>
										<div class="group-basic-info">
											<div class="group-name">{{ group.groupName || '未命名小组' }}
												<span class="group-level">Lv.{{ group.groupLevel || 1 }}</span>
											</div>
											<div class="group-slogan">{{ group.slogan || '暂无标语' }}</div>
											<div class="group-stats">
												<span class="member-count">{{ group.peopleNum || 0 }}/{{ group.maxPeopleNum || 10 }}人</span>
												<span class="join-status" :class="group.canJoin == 1 ? 'can-join' : 'cannot-join'">
													{{ group.canJoin == 1 ? '可加入' : '不可加入' }}
												</span>
											</div>
										</div>
									</div>
									
									<div class="group-actions">
										<u-button 
											v-if="group.canJoin == 1 && !isGroupMember(group.id)" 
											type="primary" 
											size="small" 
											text="申请加入" 
											@click="applyToJoin(group)">
										</u-button>
										<u-button 
											v-else-if="isGroupMember(group.id)" 
											type="success" 
											size="small" 
											text="已加入" 
											disabled>
										</u-button>
										<u-button 
											v-else 
											type="info" 
											size="small" 
											text="不可加入" 
											disabled>
										</u-button>
									</div>
								</div>
							</div>

							<!-- 加载更多 -->
							<div v-if="hasMore" class="load-more">
								<u-loading-icon v-if="loadingMore" mode="spinner" size="24"></u-loading-icon>
								<text class="load-more-text">
									{{ loadingMore ? '正在加载...' : '上拉加载更多' }}
								</text>
							</div>
							<div v-else-if="searchResults.length > 0" class="no-more">
								<text>—— 没有更多小组了 ——</text>
							</div>
						</scroll-view>
					</u-pull-refresh>
				</div>

				<!-- 空状态 -->
				<div v-else-if="hasSearched" class="empty-state">
					<u-empty mode="search" icon="http://cdn.uviewui.com/uview/empty/search.png">
						<view slot="text" style="margin-top: 20px;">
							<text class="empty-tips">{{ searchQuery ? '未找到相关小组' : '请输入关键词搜索小组' }}</text>
							<view style="margin-top: 10px;">
								<u-button 
									type="info" 
									size="small" 
									text="重新搜索" 
									@click="clearSearch">
								</u-button>
							</view>
						</view>
					</u-empty>
				</div>

				<!-- 初始状态 -->
				<div v-else class="welcome-state">
					<u-empty mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png">
						<view slot="text" style="margin-top: 20px;">
							<text class="welcome-tips">搜索并加入感兴趣的学习小组</text>
							<view style="margin-top: 10px; color: #999; font-size: 14px;">
								<text>• 输入小组名称或关键词进行搜索</text><br>
								<text>• 可以筛选可加入的小组</text><br>
								<text>• 点击申请加入心仪的小组</text>
							</view>
						</view>
					</u-empty>
				</div>
			</div>

			<!-- 申请加入弹窗 -->
			<u-popup v-model="showApplyModal" mode="center" border-radius="10">
				<div class="apply-modal">
					<div class="modal-header">
						<h3>申请加入小组</h3>
						<p>{{ currentGroup.groupName }}</p>
					</div>
					<div class="modal-body">
						<u-textarea 
							v-model="applyMessage" 
							placeholder="请输入申请理由（可选）" 
							maxlength="200"
							count
							height="120">
						</u-textarea>
					</div>
					<div class="modal-footer">
						<u-button type="info" text="取消" @click="showApplyModal = false"></u-button>
						<u-button type="primary" text="提交申请" @click="submitApplication" :loading="submitting"></u-button>
					</div>
				</div>
			</u-popup>
		</div>
	</view>
</template>

<script>
import { imageUrl } from "@/config/config.js";
import { mapState, mapActions } from "vuex";

export default {
	data() {
		return {
			searchQuery: '',
			canJoinFilter: '', // 筛选条件：''全部, '1'可加入, '0'不可加入
			searchResults: [],
			loading: false,
			refreshing: false,
			loadingMore: false,
			hasMore: true,
			hasSearched: false,
			currentPage: 1,
			pageSize: 10,
			totalCount: 0,
			searchTimeout: null,
			
			// 申请相关
			showApplyModal: false,
			currentGroup: {},
			applyMessage: '',
			submitting: false,
			
			// 我的小组ID列表
			myGroupIds: []
		}
	},
	computed: {
		imageUrl() {
			return imageUrl;
		},
		...mapState({
			groupMap: state => state.group.groupMap
		})
	},
	onShow() {
		this.loadMyGroups();
	},
	methods: {
		...mapActions({
			searchGroup: "group/searchGroup",
			getMyGroup: "group/getMyGroup",
			joinGroup: "groupJoin/joinGroup"
		}),
		
		// 加载我的小组列表
		async loadMyGroups() {
			try {
				const res = await this.getMyGroup({});
				if (res.code === 200 && res.data) {
					// 收集我的小组ID
					this.myGroupIds = [];
					if (res.data[0]) {
						this.myGroupIds.push(...res.data[0].map(group => group.id));
					}
					if (res.data[1]) {
						this.myGroupIds.push(...res.data[1].map(group => group.id));
					}
				}
			} catch (error) {
				console.error('加载我的小组失败:', error);
			}
		},
		
		// 检查是否已是小组成员
		isGroupMember(groupId) {
			return this.myGroupIds.includes(groupId);
		},
		
		// 搜索输入处理
		onSearchInput() {
			// 防抖处理
			if (this.searchTimeout) {
				clearTimeout(this.searchTimeout);
			}
			this.searchTimeout = setTimeout(() => {
				if (this.searchQuery.trim()) {
					this.handleSearch();
				}
			}, 500);
		},
		
		// 执行搜索
		async handleSearch() {
			if (!this.searchQuery.trim()) {
				uni.showToast({
					title: '请输入搜索关键词',
					icon: 'none'
				});
				return;
			}
			
			this.currentPage = 1;
			this.searchResults = [];
			this.hasMore = true;
			this.hasSearched = true;
			await this.performSearch();
		},
		
		// 执行搜索请求
		async performSearch() {
			try {
				this.loading = this.currentPage === 1;
				this.loadingMore = this.currentPage > 1;
				
				const res = await this.searchGroup({
					searchContext: this.searchQuery.trim(),
					currentPage: this.currentPage,
					canJoin: this.canJoinFilter
				});
				
				if (res.code === 200 && res.data) {
					const newResults = res.data.records || res.data;
					this.totalCount = res.data.total || newResults.length;
					
					if (this.currentPage === 1) {
						this.searchResults = newResults;
					} else {
						this.searchResults.push(...newResults);
					}
					
					// 判断是否还有更多数据
					this.hasMore = newResults.length === this.pageSize;
				} else {
					uni.showToast({
						title: res.msg || '搜索失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('搜索小组失败:', error);
				uni.showToast({
					title: '搜索失败，请重试',
					icon: 'none'
				});
			} finally {
				this.loading = false;
				this.loadingMore = false;
				this.refreshing = false;
			}
		},
		
		// 筛选条件改变
		handleFilterChange() {
			if (this.hasSearched && this.searchQuery.trim()) {
				this.handleSearch();
			}
		},
		
		// 下拉刷新
		async onRefresh() {
			if (this.searchQuery.trim()) {
				this.currentPage = 1;
				this.searchResults = [];
				this.hasMore = true;
				await this.performSearch();
			}
		},
		
		// 上拉加载更多
		async onLoadMore() {
			if (this.hasMore && !this.loadingMore && this.searchQuery.trim()) {
				this.currentPage++;
				await this.performSearch();
			}
		},
		
		// 清空搜索
		clearSearch() {
			this.searchQuery = '';
			this.searchResults = [];
			this.hasSearched = false;
			this.currentPage = 1;
			this.hasMore = true;
		},
		
		// 获取小组头像
		getGroupAvatar(group) {
			if (group.head) {
				// 如果head字段以http开头，直接使用
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
			return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstChar)}&background=4361ee&color=fff&size=128`;
		},
		
		// 查看小组详情
		viewGroupDetail(group) {
			uni.navigateTo({
				url: `/pages/userInfo/groupInfo`,
				success: (res) => {
					res.eventChannel.emit("chatData", {
						groupId: group.id
					});
				}
			});
		},
		
		// 申请加入小组
		applyToJoin(group) {
			this.currentGroup = group;
			this.applyMessage = '';
			this.showApplyModal = true;
		},
		
		// 提交申请
		async submitApplication() {
			try {
				this.submitting = true;
				const userId = uni.getStorageSync('id');
				
				const res = await this.joinGroup({
					userId: userId,
					groupId: this.currentGroup.id,
					context: this.applyMessage || '申请加入小组'
				});
				
				if (res.code === 200) {
					uni.showToast({
						title: '申请已提交',
						icon: 'success'
					});
					this.showApplyModal = false;
					// 刷新我的小组列表
					this.loadMyGroups();
				} else {
					uni.showToast({
						title: res.msg || '申请失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('提交申请失败:', error);
				uni.showToast({
					title: '申请失败，请重试',
					icon: 'none'
				});
			} finally {
				this.submitting = false;
			}
		},
		
		// 返回上一页
		goBack() {
			uni.navigateBack({ delta: 1 });
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

	.search-container {
		margin-bottom: 10px;
	}

	.search-bar {
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50px;
		padding: 8px 15px;
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 10px;
	}

	.search-bar input {
		background: transparent;
		border: none;
		color: #fff;
		flex: 1;
		padding: 0 10px;
		outline: none;
		font-size: 0.95rem;
	}

	.filter-options {
		display: flex;
		justify-content: center;
	}

	/* 内容区域 */
	.content {
		flex: 1;
		overflow: hidden;
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

	.groups-container {
		height: 100%;
		overflow: hidden;
	}

	.result-header {
		padding: 15px 20px 10px;
		border-bottom: 1px solid #e9ecef;
		background: white;
	}

	.result-count {
		color: #6c757d;
		font-size: 0.9rem;
	}

	.group-list {
		padding: 10px;
	}

	.group-card {
		background: white;
		border-radius: 12px;
		margin-bottom: 12px;
		padding: 15px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		border: 1px solid #e9ecef;
	}

	.group-header {
		display: flex;
		align-items: flex-start;
		margin-bottom: 12px;
	}

	.group-avatar {
		width: 60px;
		height: 60px;
		border-radius: 12px;
		margin-right: 12px;
		background: #f8f9fa;
	}

	.group-basic-info {
		flex: 1;
	}

	.group-name {
		font-size: 1.1rem;
		font-weight: 600;
		color: #212529;
		margin-bottom: 5px;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.group-level {
		background: linear-gradient(135deg, #4361ee, #3f37c9);
		color: white;
		padding: 2px 8px;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.group-slogan {
		color: #6c757d;
		font-size: 0.9rem;
		margin-bottom: 8px;
		line-height: 1.4;
	}

	.group-stats {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 0.8rem;
	}

	.member-count {
		color: #4361ee;
		font-weight: 500;
	}

	.join-status {
		padding: 2px 8px;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.can-join {
		background: #d1ecf1;
		color: #0c5460;
	}

	.cannot-join {
		background: #f8d7da;
		color: #721c24;
	}

	.group-actions {
		display: flex;
		justify-content: flex-end;
	}

	/* 空状态 */
	.empty-state, .welcome-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60px 20px;
		height: calc(100vh - 250px);
	}

	.empty-tips, .welcome-tips {
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

	/* 申请弹窗 */
	.apply-modal {
		width: 320px;
		background: white;
		border-radius: 12px;
		padding: 20px;
	}

	.modal-header {
		text-align: center;
		margin-bottom: 20px;
	}

	.modal-header h3 {
		font-size: 1.2rem;
		font-weight: 600;
		color: #212529;
		margin-bottom: 5px;
	}

	.modal-header p {
		color: #6c757d;
		font-size: 0.9rem;
	}

	.modal-body {
		margin-bottom: 20px;
	}

	.modal-footer {
		display: flex;
		gap: 12px;
	}

	.modal-footer .u-button {
		flex: 1;
	}
</style>