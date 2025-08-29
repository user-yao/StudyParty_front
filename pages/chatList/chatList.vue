<template>
	<div class="body">
		<!-- 顶部导航 -->
		<header>
			<div class="header-top">
				<div class="logo">
					<i class="fas fa-comments"></i>
					<span>消息中心</span>
				</div>
				<div class="header-actions">
					<i class="fas fa-user-plus" @click="showAddContact = true"></i>
					<i class="fas fa-ellipsis-v"></i>
				</div>
			</div>
		</header>
		<!-- 搜索区域 -->
		<div class="search-container">
			<div class="search-bar">
				<u-input 
					v-model="searchQuery"
					placeholder="搜索联系人、群组或消息内容"
					clearable
					:loading="searchLoading"
					border="none"
					style="flex: 1; background: transparent;"
					@input="onSearchInput">
					<template #prefix>
						<i class="fas fa-search"></i>
					</template>
				</u-input>
			</div>
		</div>

		<!-- 聊天列表 -->
		<div class="chat-list">
			<template v-if="activeTab === 'messages'">
				<div class="chat-system" @click="uni.navigateTo({
					url:'/pages/chatList/addFriend'
				})">
					<div>
						<image class="chat-avatar" style="padding: 5px;" src="@/static/chat/xinpengyou.png"></image>
					</div>
					<div class="chat-header">
						<div class="chat-name">新朋友</div>
					</div>
				</div>
			</template>
			<template v-if="activeTab === 'messages'">
				<div class="chat-system" @click="uni.navigateTo({
					url:'/pages/chatList/friendList'
				})">
					<div>
						<image class="chat-avatar" src="@/static/chat/lianxiren.png"></image>
					</div>
					<div class="chat-header">
						<div class="chat-name">好友列表</div>
					</div>
				</div>
			</template>
			<template v-if="activeTab === 'messages'">
				<div class="chat-system" @click="uni.navigateTo({
					url:'/pages/chatList/groupList'
				})">
					<div>
						<image class="chat-avatar" src="@/static/chat/qunzu.png"></image>
					</div>
					<div class="chat-header">
						<div class="chat-name">群聊列表</div>
					</div>
				</div>
			</template>
			<!-- 消息视图 -->
			<template v-if="activeTab === 'messages'">
				<div v-if="filteredChats.length === 0" class="empty-state">
					<i class="fas fa-comment-slash"></i>
					<p>暂无聊天记录</p>
				</div>
				<div v-for="chat in filteredChats" :key="chat.id" class="chat-item"
					:class="[chat.statu, { 
						unread: chat.message_count > 0,
						unavailable: isUnavailable(chat.friend, chat.statu)
					}]" @click="toChatPage(chat)"
					@touchstart="handleTouchStart(chat, $event)" @touchend="handleTouchEnd"
					@touchcancel="handleTouchEnd">
					<div>
						<image class="chat-avatar" :src="getHead(chat.friend, chat.statu)">
						</image>
					</div>
					<div class="chat-info">
						<div class="chat-header">
							<div class="chat-name-container">
								<span class="chat-name">{{ getFriendName(chat.friend,chat.statu)}}</span>
								<span v-if="chat.statu === 'group'" class="group-badge">群聊</span>
							</div>
							<div class="chat-time">{{formatTime(chat.timestamp) }}</div>
						</div>
						<div class="chat-preview">
							<div class="chat-message" v-if="chat.type == 'text'">
								{{ chat.content }}
							</div>
							<div class="chat-message" v-if="chat.type == 'mp3'">
								[语音]
							</div>
							<div class="chat-message" v-if="chat.type == 'png'">
								[图片]
							</div>
							<div class="unread-count" v-if="chat.message_count > 0">{{ chat.message_count }}</div>
						</div>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
	import db from '@/utils/SQLite.js';
	import {
		mapState,
		mapMutations,
		mapActions
	} from "vuex";
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		imageUrl
	} from "@/config/config.js"
	export default {
		data() {
			return {
				activeTab: 'messages',
				activeNav: 'messages',
				searchQuery: '',
				chatList: [],
				// 搜索相关状态
				searchLoading: false,
				searchTimeout: null,
				matchedChatIds: new Set(), // 匹配的聊天ID集合
				// 长按删除相关
				currentChat: null,
				longPressTimer: null
			}
		},
		onLoad() {
			const that = this;
			uni.$on('websocket-message', function(data) {
				console.log('监听到事件来自 websocket-message ，携带参数 msg 为：');
				console.log(data)
				that.getCharList().then(res => {
					console.log(res)
					that.chatList = res;
					that.clearNode(res);
				});
			})
		},
		onUnload() {
			uni.$off('websocket-message');
			// 清理搜索定时器
			if (this.searchTimeout) {
				clearTimeout(this.searchTimeout);
			}
		},
		computed: {
			imageUrl() {
				return imageUrl
			},
			...mapState({
				friendList: state => state.userFriend.friendList,
				groupMap: state => state.group.groupMap
			}),
			filteredChats() {
				const query = this.searchQuery?.trim().toLowerCase();
				// 如果搜索关键词为空，返回全部
				if (!query) {
					return this.chatList;
				}
				
				// 基础搜索：联系人名称和最后一条消息
				let baseFilteredChats = this.chatList.filter(chat => {
					const friendData = this.getFriend(chat.friend, chat.statu);
					const name = friendData && friendData.name ? String(friendData.name).toLowerCase() : '';
					const groupName = friendData && friendData.groupName ? String(friendData.groupName).toLowerCase() : '';
					const lastMessage = chat.content ? String(chat.content).toLowerCase() : '';
					return name.includes(query) || groupName.includes(query) || lastMessage.includes(query);
				});
				
				// 合并搜索结果：基础搜索 + 聊天记录内容搜索
				const allMatchedChats = [...baseFilteredChats];
				
				// 添加通过聊天记录内容搜索到的结果
				this.matchedChatIds.forEach(chatKey => {
					const [friend, statu] = chatKey.split('_');
					const existingChat = this.chatList.find(chat => 
						chat.friend === friend && chat.statu === statu
					);
					if (existingChat && !allMatchedChats.find(chat => 
						chat.friend === existingChat.friend && chat.statu === existingChat.statu
					)) {
						allMatchedChats.push(existingChat);
					}
				});
				
				return allMatchedChats;
			}
		},
		methods: {
			clearNode(res) {
				const hasMessage = res.some(item => item.message_count !== 0);
				  console.log(hasMessage)
				  if (hasMessage) {
				    uni.showTabBarRedDot({
				      index: 2,
				      success: () => {
				        console.log('小红点显示成功');
				      },
				      fail: (err) => {
				        console.error('小红点显示失败', err);
				      }
				    });
				  } else {
				    uni.hideTabBarRedDot({
				      index: 2,
				      success: () => {
				        console.log('小红点隐藏成功');
				      },
				      fail: (err) => {
				        console.error('小红点隐藏失败', err);
				      }
				    });
				  }
			},
			...mapActions({
				friendLists: "userFriend/friendList",
				getMyGroup: "group/getMyGroup"
			}),
			handleTouchStart(chat, event) {
				event.preventDefault();
				this.currentChat = chat;
				this.longPressTimer = setTimeout(() => {
					this.showDeleteModal(chat);
				}, 1000); // 2000ms = 2秒
			},
			handleTouchEnd() {
				if (this.longPressTimer) {
					clearTimeout(this.longPressTimer);
					this.longPressTimer = null;
				}
				this.currentChat = null;
			},
			showDeleteModal(chat) {
				uni.showModal({
					title: "删除该聊天",
					content: "删除后，聊天记录也将被删除",
					success: (res) => {
						if (res.confirm) {
							// 执行删除操作
							db.clearMessage(chat.friend, chat.statu); 
							this.getCharList().then(res => {
								console.log(res);
								this.chatList = res;
								this.clearNode(res);
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},

			toChatPage(chat) {
				console.log(chat)
				let friend, chatData;
				
				if (chat.statu === 'group') {
					// 群组聊天参数格式
					const groupData = this.getFriend(chat.friend, chat.statu);
					
					// 检查是否为不在群聊状态
					if (!this.groupMap.get(Number(chat.friend))) {
						uni.showModal({
							title: '无法进入群聊',
							content: '您已不在该群聊中，无法进入聊天。是否删除该聊天记录？',
							confirmText: '删除',
							cancelText: '取消',
							success: (res) => {
								if (res.confirm) {
									// 删除聊天记录
									db.clearMessage(chat.friend, chat.statu);
									this.getCharList().then(res => {
										this.chatList = res;
										this.clearNode(res);
									});
								}
							}
						});
						return;
					}
					
					friend = {
						friendId: chat.friend, // 群组ID作为friendId
						...groupData // 展开群组的所有数据
					};
					chatData = {
						statu: 'group'
					};
				} else {
					// 个人聊天参数格式
					friend = this.getFriend(chat.friend, chat.statu);
					
					// 检查是否为非好友状态
					if (!this.friendList.get(Number(chat.friend))) {
						uni.showModal({
							title: '无法进入聊天',
							content: '该用户已不是您的好友，无法进入聊天。是否删除该聊天记录？',
							confirmText: '删除',
							cancelText: '取消',
							success: (res) => {
								if (res.confirm) {
									// 删除聊天记录
									db.clearMessage(chat.friend, chat.statu);
									this.getCharList().then(res => {
										this.chatList = res;
										this.clearNode(res);
									});
								}
							}
						});
						return;
					}
					
					friend.friendId = chat.friend; // 确保friendId字段存在
					chatData = {
						statu: 'person'
					};
				}
				
				console.log('friend:', friend)
				console.log('chatData:', chatData)
				
				uni.navigateTo({
					url: `/pages/chatList/chatPage`,
					success: (res) => {
						res.eventChannel.emit("chatData", {
							chat: chatData,
							friend
						});
					}
				})
			},
			getFriendName(friendId, status) {
				if (status == 'group') {
					const groupInfo = this.groupMap.get(Number(friendId));
					return groupInfo ? groupInfo.groupName : '不在群聊';
				}
				if (status == 'person') {
					const friendInfo = this.friendList.get(Number(friendId));
					return friendInfo ? friendInfo.name : '非好友';
				}
				return '未知用户';
			},
			getFriend(friendId, status) {
				if (status == 'group') {
					const groupInfo = this.groupMap.get(Number(friendId));
					return groupInfo || {
						groupId: friendId,
						groupName: '不在群聊',
						slogan: '该群组信息不可用'
					};
				}
				if (status == 'person') {
					const friendInfo = this.friendList.get(Number(friendId));
					return friendInfo || {
						userid: friendId,
						name: '非好友',
						username: '该用户信息不可用'
					};
				}
				return {
					id: friendId,
					name: '未知用户'
				};
			},
			getHead(friendId, status) {
				if (status == 'group') {
					const groupInfo = this.groupMap.get(Number(friendId));
					if (!groupInfo) {
						// 群组信息不存在时返回默认群组头像
						return this.imageUrl + 'static/head/group.png';
					}
					return this.imageUrl + 'static/head/' + friendId + '/groupHeadPhoto.png';
				}
				if (status == 'person') {
					const friendInfo = this.friendList.get(Number(friendId));
					if (!friendInfo) {
						// 好友信息不存在时返回默认用户头像
						return this.imageUrl + 'static/head/user.png';
					}
					return this.imageUrl + 'static/head/' + friendId + '/userHeadPhoto.png';
				}
				// 未知类型返回通用默认头像
				return this.imageUrl + 'static/head/default.png';
			},
			isUnavailable(friendId, status) {
				// 检查群组或好友是否不可用
				if (status === 'group') {
					return !this.groupMap.get(Number(friendId));
				}
				if (status === 'person') {
					return !this.friendList.get(Number(friendId));
				}
				return false;
			},
			async getCharList() {
				return await db.selectChatList().then(res => {
					console.log(res);
					return res;
				});
			},
			setActiveTab(tab) {
				this.activeTab = tab;
			},
			openChat(chat) {
				// 模拟打开聊天窗口
				alert(`打开聊天: ${chat.name}`);
				// 标记为已读
				chat.unreadCount = 0;

				// 更新未读状态
				this.chats = [...this.chats];
			},
			// 搜索相关方法
			onSearchInput() {
				// 清除之前的定时器
				if (this.searchTimeout) {
					clearTimeout(this.searchTimeout);
				}
				
				// 设置防抖
				this.searchTimeout = setTimeout(() => {
					if (this.searchQuery.trim()) {
						this.performChatMessagesSearch();
					} else {
						// 清空搜索时重置状态
						this.matchedChatIds.clear();
						this.chatTypeFilter = 'all';
					}
				}, 500);
			},
			
			// 执行聊天记录内容搜索
			async performChatMessagesSearch() {
				try {
					this.searchLoading = true;
					const result = await db.searchChatMessages(this.searchQuery.trim());
					
					// 更新匹配的聊天ID集合
					this.matchedChatIds.clear();
					if (result && result.length > 0) {
						result.forEach(item => {
							this.matchedChatIds.add(`${item.friend}_${item.statu}`);
						});
					}
				} catch (error) {
					console.error('搜索聊天记录失败:', error);
				} finally {
					this.searchLoading = false;
				}
			},

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
			}
		},
		onShow() {
			console.log("查询消息列表");
			// 同时加载好友列表和群组列表
			Promise.all([
				this.friendLists(),
				this.getMyGroup()
			]).then(() => {
				this.getCharList().then(res => {
					console.log(res)
					this.chatList = res;
					this.clearNode(res);
				});
			}).catch(error => {
				console.error('加载数据失败:', error);
				// 即使加载失败也要获取聊天列表
				this.getCharList().then(res => {
					console.log(res)
					this.chatList = res;
					this.clearNode(res);
				});
			})
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
		--unread-bg: #f0f7ff;
		--tab-height: 50px;
	}

	.body {
		background-color: #f5f7fb;
		color: var(--dark);
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	/* 顶部导航 */
	header {
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
		cursor: pointer;
	}

	.tabs-container {
		display: flex;
		overflow-x: auto;
		padding-bottom: 5px;
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.tabs-container::-webkit-scrollbar {
		display: none;
	}

	.tab {
		padding: 8px 15px;
		margin-right: 8px;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.15);
		font-size: 0.9rem;
		white-space: nowrap;
		transition: all 0.3s;
		cursor: pointer;
	}

	.tab.active {
		background: white;
		color: var(--primary);
		font-weight: 500;
	}

	/* 搜索区域 */
	.search-container {
		padding: 15px;
		background: white;
		border-bottom: 1px solid var(--light-gray);
	}

	.search-bar {
		background: var(--light);
		border-radius: 20px;
		padding: 12px 20px;
		display: flex;
		align-items: center;
	}

	.search-bar i {
		color: var(--gray);
		margin-right: 10px;
	}

	.search-bar input {
		background: transparent;
		border: none;
		width: 100%;
		font-size: 1rem;
		outline: none;
	}

	.search-bar input::placeholder {
		color: var(--gray);
	}

	/* 群聊标记样式 */
	.chat-name-container {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.group-badge {
		background: rgba(220, 53, 69, 0.15);
		color: #dc3545;
		font-size: 0.7rem;
		padding: 2px 6px;
		border-radius: 8px;
		font-weight: 500;
		white-space: nowrap;
		border: 1px solid rgba(220, 53, 69, 0.3);
	}

	/* 聊天列表 */
	.chat-list {
		flex: 1;
		overflow-y: auto;
		padding: 10px 0;
	}

	.chat-system {
		display: flex;
		padding: 10rpx 20px;
		background: var(--card-bg);
		border-bottom: 1px solid var(--light-gray);
		transition: all 0.3s;
		position: relative;
		cursor: pointer;
	}

	.chat-item {
		display: flex;
		padding: 15px 20px;
		background: var(--card-bg);
		border-bottom: 1px solid var(--light-gray);
		transition: all 0.3s;
		position: relative;
		cursor: pointer;
	}

	.chat-item.unread {
		background: var(--unread-bg);
	}

	.chat-item.unavailable {
		background: #f8f9fa;
		opacity: 0.7;
	}

	.chat-item.unavailable .chat-name {
		color: var(--gray);
		font-style: italic;
	}

	.chat-item.unavailable .chat-message {
		color: #adb5bd;
	}

	.chat-item:hover {
		background: #f8faff;
	}

	.chat-avatar {
		width: 55px;
		height: 55px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: bold;
		font-size: 1.4rem;
		margin-right: 15px;
		position: relative;
	}

	.avatar-indicator {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 2px solid white;
	}

	.online {
		background: #4ade80;
	}

	.offline {
		background: var(--light-gray);
	}

	.chat-info {
		flex: 1;
		min-width: 0;
	}

	.chat-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 5px;
	}

	.chat-name {
		font-weight: 600;
		font-size: 1.05rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.chat-time {
		font-size: 0.8rem;
		color: var(--gray);
	}

	.chat-preview {
		display: flex;
		align-items: center;
	}

	.chat-message {
		font-size: 0.9rem;
		color: var(--gray);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1;
	}

	.unread-count {
		background: var(--warning);
		color: white;
		font-size: 0.75rem;
		min-width: 22px;
		height: 22px;
		border-radius: 11px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 10px;
	}

	.chat-status {
		display: flex;
		align-items: center;
		margin-top: 5px;
		font-size: 0.8rem;
		color: var(--gray);
	}

	.status-icon {
		margin-right: 5px;
	}

	/* 底部导航 */
	.bottom-nav {
		background: white;
		display: flex;
		justify-content: space-around;
		padding: 12px 0;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
		position: sticky;
		bottom: 0;
		z-index: 100;
	}

	.nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: var(--gray);
		text-decoration: none;
		font-size: 0.75rem;
		cursor: pointer;
	}

	.nav-item.active {
		color: var(--primary);
	}

	.nav-item i {
		font-size: 1.3rem;
		margin-bottom: 3px;
	}

	/* 颜色变化 */
	.personal-chat .chat-avatar {
		background: linear-gradient(135deg, #6a11cb, #2575fc);
	}

	.group-chat .chat-avatar {
		background: linear-gradient(135deg, #ff9a9e, #fad0c4);
	}

	.study-group .chat-avatar {
		background: linear-gradient(135deg, #43e97b, #38f9d7);
	}

	.system-notify .chat-avatar {
		background: linear-gradient(135deg, #fa709a, #fee140);
	}

	.mentor-chat .chat-avatar {
		background: linear-gradient(135deg, #4facfe, #00f2fe);
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
		color: #dcdcdc;
	}

	/* 响应式调整 */
	@media (max-width: 480px) {

		.chat-name {
			font-size: 1rem;
		}
	}
</style>