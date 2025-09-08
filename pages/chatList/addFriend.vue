<template>
	<view>
		<up-toast ref="uToastRef"></up-toast>
		<div class="body">
			<!-- 顶部导航 -->
			<div class="app-header">
				<div class="header-top">
					<div class="logo">
						<u-icon name="arrow-left" size="50rpx" color="#fff" bold @click="uni.navigateBack(1)"></u-icon>
						<span>好友请求</span>
					</div>
				</div>
				
				<!-- 选项卡 -->
				<div class="filter-tabs">
					<div class="filter-tab" :class="{active: activeTab === 'requests'}" @click="activeTab = 'requests'">
						好友请求
					</div>
					<div class="filter-tab" :class="{active: activeTab === 'search'}" @click="activeTab = 'search'">
						添加好友
					</div>
				</div>
			</div>

			<!-- 内容区域 -->
			<div class="content">
				<!-- 搜索框 -->
				<div class="search-container" v-if="activeTab === 'search'">
					<up-input
						style="width: 70rpx;"
						class="search-input"
					    placeholder="输入用户名或完整的手机号搜索"
					    border="surround"
						clearable
					    v-model="searchKeyword"
					  ></up-input>
					<u-button style="width: 90rpx;" type="primary" class="search-btn" @click="searchUsers">
						<u-icon name="search" size="40rpx" bold color="#fff"></u-icon>
					</u-button>
				</div>

				<!-- 好友请求列表 -->
				<div v-if="activeTab === 'requests'">
					<div class="request-card" v-for="request in friendRequests" :key="request.id">
						<div class="request-header"> 
							<image class="request-avatar" :src="imageUrl + request.head" mode="" @click="toUserInfoPage(request.userId)"></image>
							<div class="request-user-info">
								<div class="request-user-name">{{ request.name || '未知用户' }}</div>
								<div class="request-time">{{ formatTime(request.createTime) }}</div>
							</div>
						</div>
						<div class="request-content">
							{{ request.context || '我想添加您为好友' }}
						</div>
						<div class="request-actions" v-if="request.isConsent === 0">
							<div class="action-btn reject-btn" @click="toAccept(request.userId, 2)">
								拒绝
							</div>
							<div class="action-btn accept-btn" @click="toAccept(request.userId, 1)">
								同意
							</div>
						</div>
						<div v-else>
							<div class="request-content" :style="{color: request.isConsent === 1 ? 'green' : 'red'}">
								{{ request.isConsent === 1 ? '已同意' : '已拒绝' }}
							</div>
						</div>
					</div>

					<div class="empty-state" v-if="friendRequests.length === 0">
						<i class="u-icon-file"></i>
						<h3>暂无好友请求</h3>
					</div>
				</div>

				<!-- 搜索结果 -->
				<div v-if="activeTab === 'search'">
					<div class="user-card" v-for="user in searchResults" :key="user.id">
						<image class="user-avatar"  @click="toUserInfoPage(user.id)" :src="imageUrl + user.head" mode=""></image>
						<div class="user-info">
							<div class="user-name">{{ user.name }}</div>
							<div class="user-school">{{ user.school }}</div>
						</div>
						<button class="add-btn" @click="showAddFriendModal(user)" v-if="!user.friend">
							添加
						</button>
						<div style="color: green;border: 2rpx; border-color: green; border-radius: 20rpx;padding: 5rpx;" v-else>好友</div>
					</div>

					<div class="empty-state" v-if="searchResults.length === 0 && searchKeyword">
						<h3>未找到相关用户</h3>
						<p>请尝试其他搜索关键词</p>
					</div>
					<!-- 我的好友请求列表 -->
					<div v-if="activeTab === 'search'">
						<div class="request-card" v-for="request in myFriendRequests" :key="request.id">
							<div class="request-header"> 
								<image class="request-avatar" :src="imageUrl + request.head" mode="" @click="toUserInfoPage(request.friendId)"></image>
								<div class="request-user-info">
									<div class="request-user-name">{{ request.name || '未知用户' }}</div>
									<div class="request-time">{{ formatTime(request.createTime) }}</div>
								</div>
							</div>
							<div class="request-content">
								{{ request.context || '我想添加您为好友' }}
							</div>
							<div>
								<div class="request-content" v-if="request.isConsent!=0" :style="{color: request.isConsent == 1&&request.isConsent != 0 ? 'green' : 'red'}">
									{{ request.isConsent == 1 ? '已同意' : '已拒绝' }}
								</div>
								<div class="request-content" v-if="request.isConsent ==0">
									已发送
								</div>
							</div>
						</div>
					
						<div class="empty-state" v-if="friendRequests.length === 0">
							<i class="u-icon-file"></i>
							<h3>暂无您申请的好友请求</h3>
						</div>
					</div>
				</div>
			</div>

			<!-- 添加好友模态框 -->
			<div class="modal-mask" v-if="showModal">
				<div class="modal-container">
					<div class="modal-header">
						<div class="modal-title">添加好友</div>
						<div class="modal-close" @click="showModal = false">×</div>
					</div>
					<div class="modal-body">
						<div class="form-group">
							<label class="form-label">验证信息</label>
							<textarea class="form-textarea" v-model="applyContent" placeholder="请填写验证信息..."></textarea>
						</div>
					</div>
					<div class="modal-footer">
						<button class="modal-btn modal-btn-cancel" @click="showModal = false">取消</button>
						<button class="modal-btn modal-btn-submit" @click="sendFriendRequest">发送</button>
					</div>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from "vuex";
	import { ref, computed } from 'vue'; 
	import {
		imageUrl
	} from "@/config/config.js"
	export default {
		data() {
			return {
				activeTab: 'requests', // 当前激活的选项卡
				searchKeyword: '', // 搜索关键词
				showModal: false, // 是否显示模态框
				applyContent: '', // 好友申请内容
				selectedUser: null, // 选中的用户
				myFriendRequests: [],
				// 模拟好友请求数据
				friendRequests: [],
				// 模拟用户数据
				allUsers: [{
						id: 101,
						name: "张明",
						school: "清华大学",
						phone: "13800138000"
					},
					{
						id: 102,
						name: "李华",
						school: "北京大学",
						phone: "13900139000"
					},
					{
						id: 103,
						name: "王芳",
						school: "复旦大学",
						phone: "13700137000"
					},
					{
						id: 104,
						name: "赵强",
						school: "上海交通大学",
						phone: "13600136000"
					},
					{
						id: 105,
						name: "陈晓",
						school: "浙江大学",
						phone: "13500135000"
					}
				],
				searchResults: [] // 搜索结果
			}
		},
		onLoad() {
			let that = this;
			// 调用 myFriendRequestList 并处理结果
			this.myFriendRequestList()
				.then(res => {
					console.log('myFriendRequestList 成功:', res); // 调试输出
					this.myFriendRequests = res;
				})
				.catch(err => {
					console.error('myFriendRequestList 失败:', err); // 错误捕获
					uni.showToast({
						title: '加载我的好友请求失败',
						icon: 'none'
					});
				});
			// 调用 toRequestFriend 并处理结果
			this.friendRequestList()
				.then(res => {
					console.log('friendRequestList 成功:', res); // 调试输出
					this.friendRequests = res;
				})
				.catch(err => {
					console.error('friendRequestList 失败:', err); // 错误捕获
					uni.showToast({
						title: '加载好友请求失败',
						icon: 'none'
					});
				});
		},
		watch:{
			searchKeyword(newVal){
				// 监听搜索关键词变化
				if(!newVal){
					this.searchResults = [];
					return;
				}
				this.selectUser({name:newVal}).then(res =>{
					console.log(res)
					this.searchResults = res;
				});
			},
		},
		methods: {
			search(){
				// 监听搜索关键词变化
				if(!this.searchKeyword){
					this.searchResults = [];
					return;
				}
				this.selectUser({name:this.searchKeyword}).then(res =>{
					console.log(res)
					this.searchResults = res;
				});
			},
			toAccept(friendId,isConsent){
				this.accept({
					applicant:friendId,
					isConsent:isConsent,
				}).then(()=>{
					this.friendRequestList()
						.then(res => {
							console.log('friendRequestList 成功:', res); // 调试输出
							this.friendRequests = res;
						})
						.catch(err => {
							console.error('friendRequestList 失败:', err); // 错误捕获
							uni.showToast({
								title: '加载好友请求失败',
								icon: 'none'
							});
						});
				})
			},
			...mapActions({
				friendRequestList: "userFriend/friendRequestList",
				myFriendRequestList: "userFriend/myFriendRequestList",
				accept: "userFriend/accept",
				selectUser:'user/selectUser',
				requestFriend:'userFriend/requestFriend'
			}),
			formatTime(timestamp) {
				// 将输入转换为 Date 对象
				const date = new Date(timestamp);
				const now = new Date();

				// 获取今天的年月日
				const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
				// 昨天
				const yesterday = new Date(today);
				yesterday.setDate(yesterday.getDate() - 1);
				// 前天
				const beforeYesterday = new Date(today);
				beforeYesterday.setDate(beforeYesterday.getDate() - 2);

				// 输入时间的年月日
				const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

				// 判断时间间隔
				if (inputDate.getTime() === today.getTime()) {
					// 今天：返回 15:35
					const hours = String(date.getHours()).padStart(2, '0');
					const minutes = String(date.getMinutes()).padStart(2, '0');
					return `${hours}:${minutes}`;
				} else if (inputDate.getTime() === yesterday.getTime()) {
					// 昨天
					return '昨天';
				} else if (inputDate.getTime() === beforeYesterday.getTime()) {
					// 前天
					return '前天';
				} else {
					// 更早的时间
					const year = date.getFullYear();
					const month = date.getMonth() + 1; // getMonth() 返回 0-11
					const day = date.getDate();

					if (year === now.getFullYear()) {
						// 同一年，返回 6-12
						return `${month}-${day}`;
					} else {
						// 不同年，返回 2010-4-20
						return `${year}-${month}-${day}`;
					}
				}
			},
			toUserInfoPage(id) {
				uni.navigateTo({
					url: `/pages/userInfo/userInfo`,
					success: (res) => {
						res.eventChannel.emit("chatData", {
							id
						});
					}
				})
			},
			// 搜索用户
			searchUsers() {
				if(this.searchKeyword == ''){
					uni.showToast({
						title:'请输入内容'
					})
					return null;
				}
				this.selectUser({phone:this.searchKeyword}).then(res =>{
					console.log(res)
					this.allUsers = res;
				})
			},

			// 显示添加好友模态框
			showAddFriendModal(user) {
				this.selectedUser = user;
				this.applyContent = `你好，我是${this.getCurrentUser().name}，想添加你为好友`;
				this.showModal = true;
			},

			// 发送好友请求
			sendFriendRequest() {
				this.requestFriend({
					friendId:this.selectedUser.id,
					context:this.applyContent
				}).then(res=>{
					if(res.code == 200){
						this.$refs.uToastRef.show({
							message: '发送成功',
							type: 'success',
						})
					}else{
						this.$refs.uToastRef.show({
							message: res.msg,
							type: 'error',
						})
					}
					// 调用 myFriendRequestList 并处理结果
					this.myFriendRequestList()
						.then(res => {
							console.log('myFriendRequestList 成功:', res); // 调试输出
							this.myFriendRequests = res;
						})
						.catch(err => {
							console.error('myFriendRequestList 失败:', err); // 错误捕获
							uni.showToast({
								title: '加载我的好友请求失败',
								icon: 'none'
							});
						});
				})
				
				this.showModal = false;
				this.applyContent = '';
			},

			// 处理好友请求（同意或拒绝）
			handleRequest(requestId, consent) {
				// 在实际应用中，这里应该发送API请求
				const request = this.friendRequests.find(r => r.id === requestId);
				if (request) {
					request.isConsent = consent;
					this.$toast(consent === 1 ? '已同意好友请求' : '已拒绝好友请求');
				}
			},

			// 获取当前用户信息（模拟）
			getCurrentUser() {
				return uni.getStorageSync('user');
			}
		},
		computed: {
			imageUrl() {
				return imageUrl
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

	/* 内容区域 */
	.content {
		flex: 1;
		padding: 20px;
		overflow-y: auto;
		padding-bottom: 70px;
	}

	/* 选项卡样式 */
	.filter-tabs {
		display: flex;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 25px;
		padding: 4px;
		margin-bottom: 20px;
		margin-top: 10px;
	}

	.filter-tab {
		flex: 1;
		text-align: center;
		padding: 8px 12px;
		border-radius: 20px;
		position: relative;
		cursor: pointer;
		transition: all 0.3s ease;
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.8);
	}

	.filter-tab.active {
		background: rgba(255, 255, 255, 0.3);
		font-weight: 600;
		color: white;
	}

	/* 搜索框样式 */
	.search-container {
		display: flex;
		gap: 10px;
		margin-bottom: 20px;
	}

	.search-input {
		width: 60vw;
	}

	.search-btn {
		background: var(--primary);
		width: 40rpx;
		color: white;
		border: none;
		border-radius: 8px;
		padding: 0 15px;
		cursor: pointer;
		font-weight: 500;
	}

	/* 好友请求卡片 */
	.request-card {
		background: white;
		border-radius: 16px;
		padding: 15px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		margin-bottom: 15px;
	}

	.request-header {
		display: flex;
		align-items: center;
		margin-bottom: 12px;
	}

	.request-avatar {
		width: 45px;
		height: 45px;
		border-radius: 50%;
		background: linear-gradient(45deg, var(--accent), var(--success));
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: bold;
		font-size: 1.2rem;
		margin-right: 12px;
	}

	.request-user-info {
		flex: 1;
	}

	.request-user-name {
		font-weight: 600;
		margin-bottom: 3px;
	}

	.request-time {
		font-size: 0.8rem;
		color: var(--gray);
	}

	.request-content {
		background: var(--light);
		padding: 12px;
		border-radius: 10px;
		margin-bottom: 15px;
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.request-actions {
		display: flex;
		gap: 10px;
	}

	.action-btn {
		flex: 1;
		padding: 8px;
		border-radius: 8px;
		text-align: center;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.accept-btn {
		background: var(--primary);
		color: white;
	}

	.accept-btn:hover {
		background: var(--secondary);
	}

	.reject-btn {
		background: var(--light);
		color: var(--gray);
	}

	.reject-btn:hover {
		background: var(--light-gray);
	}

	/* 添加好友模态框 */
	.modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal-container {
		background: white;
		border-radius: 16px;
		width: 85%;
		max-width: 400px;
		padding: 20px;
		box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;
		padding-bottom: 10px;
		border-bottom: 1px solid var(--light-gray);
	}

	.modal-title {
		font-size: 1.2rem;
		font-weight: 600;
	}

	.modal-close {
		font-size: 1.5rem;
		cursor: pointer;
		color: var(--gray);
	}

	.modal-body {
		margin-bottom: 20px;
	}

	.form-group {
		margin-bottom: 15px;
	}

	.form-label {
		display: block;
		margin-bottom: 5px;
		font-weight: 500;
	}

	.form-input,
	.form-textarea {
		width: 100%;
		padding: 10px;
		border: 1px solid var(--light-gray);
		border-radius: 8px;
		font-size: 1rem;
	}

	.form-textarea {
		min-height: 100px;
		resize: vertical;
	}

	.modal-footer {
		display: flex;
		gap: 10px;
	}

	.modal-btn {
		flex: 1;
		padding: 10px;
		border-radius: 8px;
		text-align: center;
		font-weight: 500;
		cursor: pointer;
		border: none;
	}

	.modal-btn-cancel {
		background: var(--light);
		color: var(--gray);
	}

	.modal-btn-submit {
		background: var(--primary);
		color: white;
	}

	/* 搜索结果卡片 */
	.user-card {
		background: white;
		border-radius: 16px;
		padding: 15px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		margin-bottom: 15px;
		display: flex;
		align-items: center;
	}

	.user-avatar {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: linear-gradient(45deg, var(--accent), var(--success));
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: bold;
		font-size: 1.3rem;
		margin-right: 15px;
	}

	.user-info {
		flex: 1;
	}

	.user-name {
		font-weight: 600;
		margin-bottom: 5px;
	}

	.user-school {
		font-size: 0.9rem;
		color: var(--gray);
	}

	.add-btn {
		background: var(--primary);
		color: white;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 500;
		font-size: 30rpx;
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

	/* 响应式调整 */
	@media (max-width: 480px) {
		.content {
			padding: 15px;
		}

		.request-avatar,
		.user-avatar {
			width: 40px;
			height: 40px;
			font-size: 1rem;
		}
	}
</style>