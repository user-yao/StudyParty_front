<template>
	<div class="body">
		<div class="app-container">
			<!-- 顶部导航 -->
			<div class="chat-header">
				<div class="header-left">
					<u-icon name="arrow-left" size="50rpx" color="#fff" bold @click="goBack"></u-icon>
					<div class="user-info">
						<div class="user-details">
							<div class="user-name">{{ friend.name }}</div>
							<div class="user-status">{{ friend.school}}</div>
						</div>
					</div>
				</div>
				<div class="header-actions">
					<i class="fas fa-search"></i>
					<i class="fas fa-user" @click="showUserDetail = true"></i>
				</div>
			</div>

			<!-- 聊天区域 -->
			<scroll-view style="margin: 0;padding: 0;width: 100%;height: 80vh; max-height: 100vh;" scroll-y
				class="chat-area" refresher-background='#f5f7fb' :refresher-triggered='isRefresher'
				@refresherrefresh='LoadMessage' :scroll-with-animation='true' :refresher-enabled='true' ref="chatArea"
				:scroll-into-view='scrollToView'>
				<div class="chat-date-divider">
					<span>{{messages[0].timestamp}}</span>
				</div>

				<!-- 消息列表 -->
				<div v-for="message in messages" class="message"
					:class="message.sender == uni.getStorageSync('id') ? 'sender' : 'receiver'">
					<image :src=" imageUrl + uni.getStorageSync('user').head"
						v-if="message.sender == uni.getStorageSync('id')" class="avatar" mode=""></image>
					<image :src=" imageUrl + friend.head" v-if="message.sender != uni.getStorageSync('id')"
						class="avatar" mode=""></image>
					<div class="message-content">
						<span class="sender-name">
							{{message.sender == uni.getStorageSync('id')?uni.getStorageSync('user').name:friend.name}}
						</span>
						<div class="bubble">
							<!-- 文本消息 -->
							<template v-if="message.type === 'text'">
								<div class="message-text">{{ message.content }}</div>
							</template>

							<!-- 图片消息 -->
							<template v-if="message.type === 'image'">
								<div class="image-message">
									<div class="image-preview">
										<i class="fas fa-image"></i>
									</div>
									<div class="image-info">图片.jpg</div>
								</div>
							</template>

							<!-- 语音消息 -->
							<template v-if="message.type === 'voice'">
								<div class="voice-message">
									<div class="voice-play-btn">
										<i class="fas fa-play"></i>
									</div>
									<div class="voice-wave">
										<div class="wave-bar" :style="{ height: getRandomHeight() + 'px' }"></div>
										<div class="wave-bar" :style="{ height: getRandomHeight() + 'px' }"></div>
										<div class="wave-bar" :style="{ height: getRandomHeight() + 'px' }"></div>
										<div class="wave-bar" :style="{ height: getRandomHeight() + 'px' }"></div>
										<div class="wave-bar" :style="{ height: getRandomHeight() + 'px' }"></div>
										<div class="wave-bar" :style="{ height: getRandomHeight() + 'px' }"></div>
									</div>
									<div class="voice-duration">{{ message.duration }}"</div>
								</div>
							</template>

							<!-- 视频消息 -->
							<template v-if="message.type === 'video'">
								<div class="video-message">
									<div class="video-preview">
										<i class="fas fa-play-circle video-play-icon"></i>
									</div>
									<div class="video-info">
										<div class="file-name">项目演示.mp4</div>
										<div class="file-size">24.5 MB</div>
									</div>
								</div>
							</template>

							<!-- 文件消息 -->
							<template v-if="message.type === 'file'">
								<div class="file-message">
									<div class="file-icon">
										<i :class="getFileIcon(message.content)"></i>
									</div>
									<div class="file-details">
										<div class="file-name">{{ message.content }}</div>
										<div class="file-size">{{ message.size }}</div>
									</div>
								</div>
							</template>
						</div>
					</div>
				</div>
				<view id="bottom-anchor"></view>
			</scroll-view>

			<!-- 输入区域 -->
			<view class="Bottom">
				<view class="say" v-show="!isKey">
					<u-icon name="mic" size="60rpx" @click="isKey = !isKey"></u-icon>
				</view>
				<view class="say" v-show="isKey">
					<image src="@/static/tool/jianpan.png" style="width: 60rpx;height: 60rpx;" mode=""
						@click="isKey = !isKey"></image>
				</view>
				<view class="Input" @click="scrollToBottom" v-show="!isKey">
					<textarea :class="{input:true,have:InputValue != ''}" auto-height v-model="InputValue" auto-blur
						cursor-spacing="20" :focus="keyword" :autosize="{minRows:1,maxRows:8}" autosize
						:rows="1"> </textarea>
				</view>
				<view class="Input" v-show="isKey">
					<view :class="{talk:true,black:black}" @touchstart="startVoice" @touchend="endVoice">{{hint}}</view>
				</view>
				<view class="photo" v-if="InputValue == ''" @click="AddIMG">
					<u-icon name="plus-circle-fill" size="60rpx" @click="showAction = true"></u-icon>
				</view>
				<view class="button" v-else @touchend.prevent="sendTextMessage">发送</view>
				<view>
					<up-action-sheet :actions="list" @close="showAction = false" @select="selectClick"
						:closeOnClickOverlay="true" :closeOnClickAction="true" :title="title"
						:show="showAction"></up-action-sheet>
				</view>
			</view>
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
	} from "@/config/config.js";
	import ws from "@/utils/websocket.js";
	const recorderManager = uni.getRecorderManager();
	const innerAudioContext2 = uni.createInnerAudioContext();
	export default {
		data() {
			return {
				InputValue: '',
				isKey: false,
				black: false,
				keyword: false,
				isRefresher: false,
				hint: "按住说话",
				showAction: false,
				scrollToView: '',
				offset: 0, //聊天记录刷新
				list: [{
					name: "相机",
					value: 1
				}, {
					name: "相册",
					value: 2
				}, {
					name: "选择文件",
					value: 3
				}],
				title: '请选择功能',
				keyboardHeight: 0, // 新增：键盘高度
				headerHeight: 0, // 新增：导航栏高度
				friend: {},
				chat: {},
				showUserDetail: false,
				voicePath: '',
				messages: []
			}
		},
		onLoad(options) {
			const that = this;
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on("chatData", (data) => {
				this.chat = data.chat;
				this.friend = data.friend;
				console.log(this.friend);
				this.selectMessage();
				this.MessageIsread();
			});
			let path = '';
			recorderManager.onStop(function(res) {
				// console.log('recorder stop' + JSON.stringify(res));
				// console.log(res.tempFilePath)
				that.voicePath = res.tempFilePath;
				this.black = false;
				innerAudioContext2.src = that.voicePath;
			});
			innerAudioContext2.onCanplay(() => {
				// 音频已准备就绪，现在可以获取持续时间
				const duration = innerAudioContext2.duration;
				// console.log(duration);
				if (duration > 1) {
					console.log(this.voicePath);
				} else {
					uni.showToast({
						title: "说话时间太短",
						icon: 'none'
					})
				}
			});
			uni.$on('websocket-message', function(data) {
				if (that.chat.statu == 'person') {
					if (data.senderId == that.friend.friendId || data.receiverId == that.friend.friendId) {
						that.selectNewMessage();
					}
				}
				if (that.chat.statu == 'group') {
					if (data.groupId == that.friend.friendId || data.receiverId == that.friend.friendId) {
						that.selectNewMessage();
					}
				}
			})
		},
		computed: {
			imageUrl() {
				return imageUrl
			},
		},
		methods: {
			listen(item, index) {
				// console.log('开始播放');
				this.isL = index;
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.src = item;
				innerAudioContext.onPlay(() => {
					// console.log('开始播放');
				});
				innerAudioContext.onEnded(() => {
					this.isL = -1;
				})
			},
			showPhoto(item) {
				// console.log(item.substring(7))
				var photo = [];
				photo.push(item);
				// console.log(photo);
				uni.previewImage({
					current: 0,
					urls: photo,
					success() {
						// console.log("chenggong");
					}
				});
			},
			startVoice() {
				this.black = true;
				// 开始录音
				// console.log('开始录音');
				this.hint = '松开发送'
				this.touchStartTimestamp = Date.now();
				this.touchTimeout = setTimeout(() => {
					// 如果触摸持续时间大于等于1秒，开始录音
					recorderManager.start();
				}, 500);
			},
			endVoice() {
				this.black = false;
				// 停止录音
				// console.log('录音结束');

				if (this.touchTimeout) {
					clearTimeout(this.touchTimeout);
				}
				this.hint = '按住说话'
				recorderManager.stop();

			},
			AddIMG() {
				const that = this;
				uni.chooseImage({ //图片上传
					sourceType: ['album', 'camera'], //从相册选择
					count: 1, //上传图片的数量，默认是9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: function(res) {
						const tempFilePaths = res.tempFilePaths; //临时文件路径
						console.log(tempFilePaths);
						//this.photo = this.photo.concat(res.tempFilePaths)
						//this.photo = res.tempFilePaths
						that.photo = that.photo.concat(res.tempFilePaths);
						console.log(that.photo);
						for (var i = 0; i < tempFilePaths.length; i++) {
							pathToBase64(tempFilePaths[i])
								.then(base64 => {
									console.log(base64);
									console.log(base64.indexOf(","))
									var p = base64.substring(base64.indexOf(",") + 1);
									that.sendp("@photo" + p);
								})
								.catch(error => {
									console.error(error)
								});
						}
					},
				});
			},
			sendp(base64) {
				this.keyword = true;

				//消息内容 + "[" + 发送消息的人 + ";" + 接收消息的人","+0		0是单发1是群发
				var id = uni.getStorageSync('id');
				var cotnt = base64 + "[" + id + ";" + this.CurrentChatId + ',' + 0;
				console.log(id + "===" + this.CurrentChatId);
				this.clickRequest(cotnt).then(res => {
					this.InputValue = ""
					this.scrollToBottom()
				})

			},
			async MessageIsread() {
				await db.updateMessageIsread(this.friend.friendId);
			},
			sendTextMessage() {
				let message = {};
				if (this.chat.statu == 'person') {
					message = {
						type: "text",
						content: this.InputValue,
						receiverId: this.friend.friendId
					};
				} else if (this.chat.statu == 'group') {
					message = {
						type: "text",
						content: this.InputValue,
						groupId: this.friend.friendId
					};
				}
				ws.sendMessage(message);
				this.InputValue = '';
			},
			async selectNewMessage() {
				let [message] = await db.selectNewMessage(this.friend.friendId, this.chat.statu);
				this.messages.push(message);
				this.MessageIsread();
			},
			async selectMessage() {
				let message = await db.selectMessage(this.friend.friendId, this.chat.statu, 10, this.offset);
				message = message.reverse();
				this.messages = [...message, ...this.messages];
				this.offset += message.length;
				this.scrollToBottom();
			},
			async LoadMessage() {
				if (this.isRefresher) return;
				this.isRefresher = true;
				let message = await db.selectMessage(this.friend.friendId, this.chat.statu, 10, this.offset);
				message = message.reverse();
				this.messages = [...message, ...this.messages];
				this.offset += message.length;
				this.isRefresher = false;
			},
			selectClick(ref) {
				console.log(ref)
			},
			handleKeyboardShow(e) {
				this.keyboardHeight = e.height;
				this.$nextTick(() => {
					this.scrollToBottom(); // 键盘弹出时滚动到底部
				});
			},
			// 新增：键盘隐藏事件处理
			handleKeyboardHide() {
				this.keyboardHeight = 0;
			},
			goBack() {
				uni.navigateBack(1)
			},
			getFileIcon(filename) {
				const ext = filename.split('.').pop().toLowerCase();
				if (ext === 'doc' || ext === 'docx') return 'fas fa-file-word';
				if (ext === 'xls' || ext === 'xlsx') return 'fas fa-file-excel';
				if (ext === 'ppt' || ext === 'pptx') return 'fas fa-file-powerpoint';
				if (ext === 'pdf') return 'fas fa-file-pdf';
				return 'fas fa-file';
			},
			getRandomHeight() {
				return Math.floor(Math.random() * 20) + 5;
			},
			scrollToBottom() {
				this.scrollToView = ''; // 先清空，强制下一次变化
				this.$nextTick(() => {
					this.scrollToView = 'bottom-anchor';
				});
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
		--unread-bg: #f0f7ff;
		--tab-height: 50px;
		--chat-bg: #f5f7fb;
		--sender-bubble: #e1f0ff;
		--receiver-bubble: #ffffff;
	}

	.app-container {
		width: 100%;
		max-width: 450px;
		height: 100vh;
		background: white;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	/* 顶部导航 */
	.chat-header {
		background: linear-gradient(135deg, var(--primary), var(--secondary));
		color: white;
		padding: 15px 20px;
		padding-top: 5vh;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.header-left {
		display: flex;
		align-items: center;
	}

	.back-btn {
		font-size: 1.5rem;
		margin-right: 15px;
		cursor: pointer;
	}

	.user-info {
		display: flex;
		align-items: center;
	}

	.user-avatar {
		width: 45px;
		height: 45px;
		border-radius: 50%;
		background: linear-gradient(135deg, #6a11cb, #2575fc);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: bold;
		font-size: 1.4rem;
		margin-right: 12px;
	}

	.user-details {
		display: flex;
		flex-direction: column;
	}

	.user-name {
		font-weight: 600;
		font-size: 1.1rem;
	}

	.user-status {
		font-size: 0.8rem;
		opacity: 0.9;
		margin-top: 3px;
	}

	.header-actions {
		display: flex;
		gap: 20px;
	}

	.header-actions i {
		font-size: 1.3rem;
		cursor: pointer;
		transition: transform 0.2s;
	}

	.header-actions i:hover {
		transform: scale(1.1);
	}

	/* 聊天区域 */
	.chat-area {
		flex: 1;
		overflow-y: auto;
		padding: 15px;
		background-color: var(--chat-bg);
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.chat-date-divider {
		text-align: center;
		margin: 15px 0;
		position: relative;
	}

	.chat-date-divider span {
		background: rgba(255, 255, 255, 0.8);
		padding: 5px 15px;
		border-radius: 20px;
		font-size: 0.8rem;
		color: var(--gray);
		position: relative;
		z-index: 2;
	}

	.chat-date-divider:before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 1px;
		background: var(--light-gray);
		z-index: 1;
	}

	.message {
		display: flex;
		margin: 20rpx auto;
		margin-bottom: 20rpx;
		padding-bottom: 40rpx;
		max-width: 85%;
	}

	.message.sender {
		align-self: flex-end;
		flex-direction: row-reverse;
	}

	.message.receiver {
		align-self: flex-start;
	}

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: linear-gradient(135deg, #6a11cb, #2575fc);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: bold;
		font-size: 1.2rem;
		flex-shrink: 0;
	}

	.message-content {
		margin: 0 12px;
		max-width: 80%;
		display: flex;
		flex-direction: column;
	}

	.message.sender .message-content {
		align-items: flex-end;
	}

	.message.receiver .message-content {
		align-items: flex-start;
	}

	.sender-name {
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--gray);
		margin-bottom: 5px;
		display: block;
	}

	.bubble {
		padding: 12px 16px;
		border-radius: 18px;
		position: relative;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		max-width: 100%;
	}

	.message.receiver .bubble {
		background: var(--receiver-bubble);
		border-top-left-radius: 5px;
	}

	.message.sender .bubble {
		background: linear-gradient(135deg, var(--primary), var(--secondary));
		color: white;
		border-top-right-radius: 5px;
	}

	.message-text {
		font-size: 0.95rem;
		line-height: 1.5;
		word-break: break-word;
	}

	.message-time {
		font-size: 0.7rem;
		margin-top: 5px;
		opacity: 0.8;
		text-align: right;
	}

	/* 特殊消息样式 */
	.image-message {
		width: 220px;
		border-radius: 12px;
		overflow: hidden;
		position: relative;
		cursor: pointer;
	}

	.image-preview {
		width: 100%;
		height: 150px;
		background: linear-gradient(45deg, #ff9a9e, #fad0c4);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 2.5rem;
	}

	.image-info {
		padding: 10px;
		background: rgba(0, 0, 0, 0.5);
		color: white;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		font-size: 0.8rem;
	}

	.voice-message {
		display: flex;
		align-items: center;
		padding: 12px 16px;
		border-radius: 25px;
		background: rgba(255, 255, 255, 0.9);
		width: 200px;
		cursor: pointer;
	}

	.voice-play-btn {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: var(--primary);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 12px;
		flex-shrink: 0;
	}

	.voice-wave {
		display: flex;
		align-items: center;
		gap: 3px;
		height: 30px;
		flex: 1;
	}

	.wave-bar {
		width: 3px;
		background: var(--primary);
		border-radius: 2px;
		transition: height 0.3s ease;
	}

	.voice-duration {
		font-size: 0.8rem;
		color: var(--dark);
		margin-left: 10px;
	}

	.video-message {
		width: 240px;
		border-radius: 12px;
		overflow: hidden;
		position: relative;
		cursor: pointer;
	}

	.video-preview {
		width: 95%;
		height: 140px;
		background: linear-gradient(45deg, #4facfe, #00f2fe);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 3rem;
		position: relative;
	}

	.video-play-icon {
		position: absolute;
		z-index: 2;
	}

	.video-info {
		padding: 10px;
		background: white;
	}

	.file-message {
		display: flex;
		align-items: center;
		padding: 15px;
		background: white;
		border-radius: 12px;
		width: 200px;
		box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
		cursor: pointer;
	}

	.file-icon {
		width: 40px;
		height: 40px;
		border-radius: 10px;
		background: linear-gradient(135deg, var(--primary), var(--accent));
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 1.2rem;
		margin-right: 15px;
		flex-shrink: 0;
	}

	.file-details {
		flex: 1;
		min-width: 0;
	}

	.file-name {
		font-weight: 600;
		font-size: 0.9rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-bottom: 3px;
	}

	.file-size {
		font-size: 0.75rem;
		color: var(--gray);
	}

	/* 输入区域 */
	.input-area {
		background: white;
		padding: 15px;
		display: flex;
		align-items: center;
		border-top: 1px solid var(--light-gray);
		position: sticky;
		bottom: 0;
		z-index: 100;
	}

	.input-left {
		display: flex;
		align-items: center;
		margin-right: 15px;
	}

	.input-left i {
		font-size: 1.4rem;
		color: var(--gray);
		margin: 0 8px;
		cursor: pointer;
		transition: color 0.2s;
	}

	.input-left i:hover {
		color: var(--primary);
	}

	.message-input {
		flex: 1;
		background: var(--light);
		border-radius: 25px;
		padding: 12px 18px;
		border: none;
		font-size: 1rem;
		outline: none;
		max-height: 120px;
		overflow-y: auto;
	}

	.send-btn {
		width: 45px;
		height: 45px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--primary), var(--secondary));
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 12px;
		font-size: 1.2rem;
		cursor: pointer;
		transition: transform 0.2s;
	}

	.send-btn:hover {
		transform: scale(1.05);
	}

	/* 用户详情模态框 */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 2000;
	}

	.user-detail-modal {
		background: white;
		width: 90%;
		max-width: 400px;
		border-radius: 20px;
		overflow: hidden;
		animation: modalIn 0.3s ease-out;
	}

	@keyframes modalIn {
		from {
			opacity: 0;
			transform: translateY(-30px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.modal-header {
		background: linear-gradient(135deg, var(--primary), var(--secondary));
		padding: 30px 20px 20px;
		text-align: center;
		position: relative;
	}

	.modal-avatar {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: linear-gradient(135deg, #6a11cb, #2575fc);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: bold;
		font-size: 2rem;
		margin: 0 auto 15px;
	}

	.modal-name {
		font-size: 1.6rem;
		font-weight: 600;
		color: white;
		margin-bottom: 5px;
	}

	.modal-school {
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.9);
	}

	.modal-close {
		position: absolute;
		top: 15px;
		right: 15px;
		color: white;
		font-size: 1.5rem;
		cursor: pointer;
	}

	.modal-body {
		padding: 25px;
	}

	.info-item {
		display: flex;
		margin-bottom: 20px;
	}

	.info-icon {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--light);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--primary);
		font-size: 1.2rem;
		margin-right: 15px;
		flex-shrink: 0;
	}

	.info-content {
		flex: 1;
	}

	.info-title {
		font-weight: 600;
		font-size: 0.95rem;
		margin-bottom: 3px;
	}

	.info-value {
		font-size: 0.9rem;
		color: var(--gray);
	}

	.modal-actions {
		display: flex;
		padding: 0 20px 20px;
		gap: 15px;
	}

	.action-btn {
		flex: 1;
		padding: 14px;
		border: none;
		border-radius: 12px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s;
	}

	.action-btn.primary {
		background: linear-gradient(135deg, var(--primary), var(--secondary));
		color: white;
	}

	.action-btn.outline {
		background: transparent;
		border: 2px solid var(--light-gray);
		color: var(--dark);
	}

	/* 响应式调整 */
	@media (max-width: 480px) {
		.app-container {
			height: 100vh;
		}

		.message {
			max-width: 90%;
		}

		.image-message {
			width: 200px;
		}
	}

	.Bottom {
		display: flex;
		position: sticky;
		width: 100%;
		/* height: var(--height); */
		bottom: 0;
		background-color: #fff;
		flex-direction: row;
		justify-content: start;
		align-items: flex-end;
		border-top: 1rpx solid #e5e4e8;
		padding: 30rpx 30rpx;
		box-sizing: border-box;
		z-index: 9999;
	}

	/* 	image {
		width: 50rpx;
		height: 50rpx;
	} */


	.input {
		width: 550rpx;
		/* height: v-bind(); */
		display: flex;
		padding: 20rpx;
		background-color: #F2F1F6;
		border-radius: 15rpx;
		box-sizing: border-box;
		margin: 0 20rpx;
		transition: 300ms;
	}

	.talk {
		width: 550rpx;
		/* height: v-bind(); */
		display: flex;
		padding: 20rpx;
		justify-content: center;
		background-color: #F2F1F6;
		border-radius: 15rpx;
		box-sizing: border-box;
		margin: 0 20rpx;
		transition: 100ms;
	}

	/* 		// .talk:active{
		// 	background-color: #828184;
		// 	color: #fff;
		// } */
	.talk.black {
		width: 550rpx;
		/* height: v-bind(); */
		display: flex;
		padding: 20rpx;
		justify-content: center;
		border-radius: 15rpx;
		box-sizing: border-box;
		margin: 0 20rpx;
		transition: 100ms;
		background-color: #828184;
		color: #fff;
	}

	.input.have {
		width: 500rpx;
		height: 90rpx;
		padding: 20rpx;
		display: flex;
		background-color: #F2F1F6;
		border-radius: 15rpx;
		box-sizing: border-box;
		margin: 0 20rpx;
		transition: 300ms;
	}

	.button {
		width: 100rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 30rpx;
		background-color: #2979ff;
		color: #fff;
		border-radius: 15rpx;
		transition: 300ms;
	}
</style>