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
						<u-input 
							v-model="searchQuery"
							placeholder="输入小组名称搜索..."
							placeholder-style="color: rgba(255,255,255,0.8)"
							border="none"
							color="#fff"
							clearable
							@input="onSearchInput"
							@confirm="handleSearch"
							style="background: transparent; flex: 1;">
						</u-input>
					</div>
					<div class="filter-options">
						<radio-group @change="onFilterChange" class="filter-radio-group">
							<label class="radio-item" :class="{ active: canJoinFilter === 0 }">
								<radio value="0" :checked="canJoinFilter === 0" color="#4361ee" />
								<text class="radio-text">全部</text>
							</label>
							<label class="radio-item" :class="{ active: canJoinFilter === 1 }">
								<radio value="1" :checked="canJoinFilter === 1" color="#4361ee" />
								<text class="radio-text">可加入</text>
							</label>
						</radio-group>
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
					<div class="result-header">
						<text class="result-count">找到 {{ totalCount }} 个小组</text>
					</div>
					<scroll-view 
						scroll-y="true" 
						class="scroll-container" 
						@scrolltolower="onLoadMore"
						lower-threshold="100"
						style="height: calc(100vh - 200px);">
						
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
			<u-popup :show="showApplyModal" mode="center" border-radius="10" z-index="10080" @close="showApplyModal = false">
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
			canJoinFilter: 1, // 筛选条件：0-全部, 1-可加入，默认为可加入
			filterOptions: [
				{ value: 0, label: '全部' },
				{ value: 1, label: '可加入' }
			],
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
			loadFailCount: 0, // 加载失败计数
			
			// 申请相关
			showApplyModal: false,
			currentGroup: {},
			applyMessage: '',
			submitting: false,
			
			// 我的小组ID列表（已废弃，改用groupMap）
			myGroupIds: []
		}
	},
	computed: {
		imageUrl() {
			return imageUrl;
		},
		...mapState({
			groupMap: state => state.group.groupMap,
			myGroupIds: state => state.group.myGroupIds,
			joinedGroupIds: state => state.group.joinedGroupIds
		})
	},
	onShow() {
		this.loadMyGroups();
	},
	onReady() {
		// 页面渲染完成时确保默认值正确
		this.$nextTick(() => {
			this.canJoinFilter = 1;
		});
	},
	mounted() {
		// 确保默认值正确设置
		this.canJoinFilter = 1;
	},
	watch: {
		// 监听搜索输入变化
		searchQuery(newVal, oldVal) {
			if (this.searchTimeout) {
				clearTimeout(this.searchTimeout);
			}
			this.searchTimeout = setTimeout(() => {
				if (newVal && newVal.trim()) {
					// 有搜索内容时执行搜索
					this.autoSearch();
				} else if (oldVal && oldVal.trim() && (!newVal || !newVal.trim())) {
					// 从有内容变为空时清空结果
					this.clearSearch();
				}
			}, 500);
		},
		// 监听筛选条件变化
		canJoinFilter(newVal, oldVal) {
			// 防止初始化时的重复触发
			if (oldVal === undefined) {
				return;
			}
			
			// 只有在已搜索状态且有搜索内容时才重新搜索
			if (this.hasSearched && this.searchQuery && this.searchQuery.trim()) {
				// 清理之前的定时器
				if (this.searchTimeout) {
					clearTimeout(this.searchTimeout);
				}
				// 添加防抖机制
				this.searchTimeout = setTimeout(() => {
					this.autoSearch();
				}, 300); // 筛选条件变化的防抖时间设置为300ms
			}
		}
	},
	methods: {
		...mapActions({
			searchGroup: "group/searchGroup",
			getMyGroup: "group/getMyGroup",
			joinGroup: "groupJoin/joinGroup"
		}),
		
		// 筛选条件改变处理（原生单选组件事件）
		onFilterChange(event) {
			const value = parseInt(event.detail.value);
			console.log('筛选条件变化:', value);
			this.canJoinFilter = value;
			// 搜索逻辑由watch监听器处理，避免重复调用
		},
		
		// 加载我的小组列表
		async loadMyGroups() {
			try {
				// 调用store中的getMyGroup方法，它会自动更新groupMap、myGroupIds和joinedGroupIds
				const res = await this.getMyGroup({});
				if (res.code !== 200) {
					console.error('加载我的小组失败:', res.msg);
				}
			} catch (error) {
				console.error('加载我的小组失败:', error);
			}
		},
		
		// 检查是否已是小组成员
		isGroupMember(groupId) {
			// 优先使用groupMap检查是否已在本地缓存中
			if (this.groupMap && this.groupMap.has && this.groupMap.has(groupId)) {
				// 如果在groupMap中找到了，说明已加入或管理该组
				return true;
			}
			
			// 备用检查：使用ID列表进行检查
			return this.myGroupIds.includes(groupId) || this.joinedGroupIds.includes(groupId);
		},
		
		// 搜索输入处理（主要逻辑在watch中处理）
		onSearchInput() {
			// 这里可以保留为空，或者放一些即时的UI反馈
		},
		
		// 执行搜索
		async handleSearch() {
			if (!this.searchQuery.trim()) {
				this.$u.toast('请输入搜索关键词');
				return;
			}
			
			this.currentPage = 1;
			this.searchResults = [];
			this.hasMore = true;
			this.hasSearched = true;
			this.loadFailCount = 0; // 重置失败计数
			await this.performSearch();
		},
		
		// 自动搜索（不显示错误提示）
		async autoSearch() {
			if (!this.searchQuery.trim()) {
				return;
			}
			
			this.currentPage = 1;
			this.searchResults = [];
			this.hasMore = true;
			this.hasSearched = true;
			this.loadFailCount = 0; // 重置失败计数
			await this.performSearch();
		},
		
		// 执行搜索请求
		async performSearch() {
			try {
				this.loading = this.currentPage === 1;
				this.loadingMore = this.currentPage > 1;
				
				// 构建搜索参数，符合API要求的格式
				const searchParams = {
					searchContext: this.searchQuery.trim(),
					currentPage: this.currentPage
				};
				searchParams.canJoin = this.canJoinFilter;
				const res = await this.searchGroup(searchParams);
				
				if (res.code === 200 && res.data) {
					// 处理分页数据结构
					const newResults = res.data.records || [];
					// 使用API返回的总数量，如果没有则使用当前页结果数量
					this.totalCount = res.data.total;
					
					if (this.currentPage === 1) {
						this.searchResults = newResults;
					} else {
						this.searchResults.push(...newResults);
					}
					
					
					
					// 判断是否还有更多数据
					// 根据API返回的分页信息判断是否有更多数据
					const currentPage = res.data.current || this.currentPage;
					const totalPages = res.data.pages || 1;
					this.hasMore = currentPage < totalPages && newResults.length > 0;
				} else {
					this.$u.toast(res.msg || '搜索失败');
				}
			} catch (error) {
				this.$u.toast('搜索失败，请重试');
			} finally {
				this.loading = false;
				this.loadingMore = false;
				this.refreshing = false;
			}
		},
		

		// 下拉刷新
		async onRefresh() {
			if (this.searchQuery.trim()) {
				this.currentPage = 1;
				this.searchResults = [];
				this.hasMore = true;
				this.loadFailCount = 0; // 重置失败计数
				await this.performSearch();
			}
		},
		
		// 上拉加载更多
		async onLoadMore() {
			// 防止重复触发和无效触发
			if (this.loadingMore || !this.hasMore || this.loading || !this.searchQuery.trim()) {
				return;
			}
			
			// 检查是否有搜索结果
			if (this.searchResults.length === 0) {
				return;
			}
			
			try {
				this.loadingMore = true;
				this.currentPage++;
				
				// 构建搜索参数
				const searchParams = {
					searchContext: this.searchQuery.trim(),
					currentPage: this.currentPage,
					canJoin: this.canJoinFilter
				};
				
				const res = await this.searchGroup(searchParams);
				
				if (res.code === 200 && res.data) {
					const newResults = res.data.records || [];
					
					// 检查是否有新数据
					if (newResults.length === 0) {
						this.hasMore = false;
						this.$u.toast('已加载全部搜索结果');
					} else {
						// 合并新数据（去重）
						const existingIds = new Set(this.searchResults.map(item => item.id));
						const uniqueNewResults = newResults.filter(item => !existingIds.has(item.id));
						
						if (uniqueNewResults.length > 0) {
							this.searchResults.push(...uniqueNewResults);
							
							// 显示加载成功提示
							this.$u.toast(`成功加载${uniqueNewResults.length}个`);
						} else {
							// 如果没有新增数据（全是重复的），也认为没有更多了
							this.hasMore = false;
							this.$u.toast('没有更多新结果了');
						}
						
						// 更新分页状态
						const currentPage = res.data.current || this.currentPage;
						const totalPages = res.data.pages || 1;
						this.hasMore = currentPage < totalPages;
						
						// 更新总数
						this.totalCount = res.data.total || this.totalCount;
					}
				} else {
					// API返回错误
					this.currentPage--; // 回退页码
					this.$u.toast(res.msg || '加载失败');
				}
			} catch (error) {
				this.currentPage--; // 回退页码
				
				// 网络错误时不立即设置hasMore=false，给用户重试机会
				this.$u.toast('网络错误，请重试');
				
				// 如果连续失败多次，才设置hasMore=false
				if (!this.loadFailCount) this.loadFailCount = 0;
				this.loadFailCount++;
				if (this.loadFailCount >= 3) {
					this.hasMore = false;
					this.$u.toast('加载失败次数过多，请稍后重试');
				}
			} finally {
				this.loadingMore = false;
			}
		},
		
		// 清空搜索
		clearSearch() {
			this.searchQuery = '';
			this.searchResults = [];
			this.hasSearched = false;
			this.currentPage = 1;
			this.hasMore = true;
			this.totalCount = 0;
			this.loadFailCount = 0; // 重置失败计数
			// 重置筛选条件为默认值
			this.canJoinFilter = 1;
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
				
				// 根据API接口要求，只需要传递groupId和context参数
				const res = await this.joinGroup({
					groupId: this.currentGroup.id,
					context: this.applyMessage || '申请加入小组'
				});
				
				// 根据返回的code状态显示相应提示
				if (res.code === 200) {
					this.$u.toast('申请成功');
					this.showApplyModal = false;
					// 刷新我的小组列表
					await this.loadMyGroups();
					// 重新搜索以更新状态显示
					if (this.hasSearched && this.searchQuery.trim()) {
						this.autoSearch();
					}
				} else {
					// 显示服务器返回的具体错误信息
					this.$u.toast(res.msg || '申请失败');
				}
			} catch (error) {
				this.$u.toast('网络错误，请重试');
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
	/* 根节点样式重置 */
	page {
		height: 100%;
		overflow: hidden;
	}
	
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
	}

	.body {
		background-color: #f5f7fb;
		color: #212529;
		min-height: 100vh;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	/* 顶部导航 */
	.app-header {
		background: linear-gradient(135deg, #4361ee, #3f37c9);
		color: white;
		padding: 15px 20px;
		padding-top: calc(var(--status-bar-height, 0px) + 15px);
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		position: sticky;
		top: 0;
		z-index: 100;
		flex-shrink: 0;
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

	.filter-options {
		display: flex;
		justify-content: center;
	}

	/* 原生单选组件样式 */
	.filter-radio-group {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 20px;
	}

	.radio-item {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px;
		border-radius: 20px;
		transition: all 0.3s ease;
		cursor: pointer;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.radio-item.active {
		background: rgba(255, 255, 255, 0.2);
		border-color: rgba(255, 255, 255, 0.6);
		transform: scale(1.05);
	}

	.radio-item:hover {
		background: rgba(255, 255, 255, 0.15);
		transform: scale(1.02);
	}

	.radio-text {
		color: #fff;
		font-size: 0.9rem;
		font-weight: 500;
		user-select: none;
	}

	.radio-item.active .radio-text {
		font-weight: 600;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	/* 覆盖原生单选按钮的默认样式 */
	.radio-item radio {
		transform: scale(1.1);
	}

	/* 适配小程序环境 */
	/* #ifdef MP */
	.radio-item {
		padding: 8px 15px;
	}
	/* #endif */

	/* 内容区域 */
	.content {
		flex: 1;
		overflow: hidden;
		min-height: 0; /* 重要：确保 flex 子项可以缩小 */
	}

	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60px 20px;
		color: #6c757d;
		height: 100%;
	}

	.loading-text {
		margin-top: 15px;
		font-size: 0.9rem;
		color: #6c757d;
	}

	.groups-container {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.result-header {
		padding: 15px 20px 10px;
		border-bottom: 1px solid #e9ecef;
		background: white;
		flex-shrink: 0;
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

	/* 内容滚动区域 */
	.scroll-container {
		flex: 1;
		min-height: 300px;
		max-height: calc(100vh - 200px);
		overflow-y: auto;
	}

	/* 空状态 */
	.empty-state, .welcome-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60px 20px;
		height: 100%;
		min-height: 50vh;
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
		position: relative;
		z-index: 10081;
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