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
			<div class="tabs-container">
				<div class="tab" :class="{ active: activeTab === 'messages' }" @click="setActiveTab('messages')">消息
				</div>
				<div class="tab" :class="{ active: activeTab === 'addUser' }" @click="setActiveTab('addUser')">添加好友
				</div>
				<div class="tab" :class="{ active: activeTab === 'addGroup' }" @click="setActiveTab('addGroup')">加入群组
				</div>
				<div class="tab" :class="{ active: activeTab === 'createGroup' }" @click="setActiveTab('createGroup')">
					创建群组</div>
			</div>
		</header>
		<!-- 搜索区域 -->
		<div class="search-container">
			<div class="search-bar">
				<i class="fas fa-search"></i>
				<input type="text" v-model="searchQuery" placeholder="搜索联系人、群组或消息">
			</div>
		</div>

		<!-- 聊天列表 -->
		<div class="chat-list">
			<template v-if="activeTab === 'messages'">
				<div class="chat-system">
					<div>
						<image class="chat-avatar" src="@/static/chat/lianxiren.png"></image>
					</div>
					<div class="chat-header">
						<div class="chat-name">好友列表</div>
					</div>
				</div>
			</template>
			<template v-if="activeTab === 'messages'">
				<div class="chat-system">
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
					:class="[chat.statu, { unread: chat.message_count > 0 }]" @click="toChatPage(chat)"
					@touchstart="handleTouchStart(chat, $event)" @touchend="handleTouchEnd"
					@touchcancel="handleTouchEnd">
					<div>
						<image class="chat-avatar" :src="imageUrl + 'static/head/'+chat.friend+'/userHeadPhoto.png'">
						</image>
					</div>
					<div class="chat-info">
						<div class="chat-header">
							<div class="chat-name">{{ getFriend(chat.friend,chat.statu).name }}</div>
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
				chatList: []
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
				});
			})
		},
		onUnload() {
			uni.$off('websocket-message');
		},
		computed: {
			imageUrl() {
				return imageUrl
			},
			...mapState({
				friendList: state => state.userFriend.friendList
			}),
			filteredChats() {
				const query = this.searchQuery?.trim().toLowerCase();
				console.log(!query)
				// 如果搜索关键词为空，返回全部
				if (!query) {
					console.log(query)
					return this.chatList;
				}
				return this.chatList.filter(chat => {
					const name = this.friendList.get(Number(chat.friend)).name ? String(this.friendList.get(Number(
						chat.friend)).name).toLowerCase() : '';
					const lastMessage = chat.content ? String(chat.content).toLowerCase() : '';
					return name.includes(query) || lastMessage.includes(query);
				});
			}
		},
		methods: {
			...mapActions({
				friendLists: "userFriend/friendList",
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
							db.clearMessage(chat.friend, chat.statu, chat.userid); // 假设需要 userid
							this.getCharList().then(res => {
								console.log(res);
								this.chatList = res;
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},

			toChatPage(chat) {
				console.log(chat)
				let friend = this.friendList.get(Number(chat.friend));
				console.log(friend)
				uni.navigateTo({
					url: `/pages/chatList/chatPage`,
					success: (res) => {
						res.eventChannel.emit("chatData", {
							chat,
							friend
						});
					}
				})
			},
			getFriend(friendId, status) {
				if (status == 'group') {
					return this.friendList.get(Number(friendId));
				}
				if (status == 'person') {
					return this.friendList.get(Number(friendId));
				}
			},
			getHead(friendId, status) {
				if (status == 'group') {
					return this.friendList.get(Number(friendId)).head;
				}
				if (status == 'person') {
					console.log(this.friendList.get(Number(friendId)).head)
					return this.friendList.get(Number(friendId)).head;
				}
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
			this.friendLists().then(() => {
				this.getCharList().then(res => {
					console.log(res)
					this.chatList = res;
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
		.chat-avatar {
			width: 48px;
			height: 48px;
			font-size: 1.2rem;
		}

		.chat-name {
			font-size: 1rem;
		}
	}
</style>