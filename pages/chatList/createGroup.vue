<template>
	<view class="content" style="min-height: 100vh;">
		<!-- @touchstart="touchStart" @touchend="touchEnd" -->
		<image class="" style="display: flex;
			flex-direction: column;
			width: 80rpx;
			height: 80rpx;
			background-color: #FFF;
			/* 卡片背景色 */
			padding: 20rpx;
			border-radius: 8rpx;
			box-shadow: 0 4rpx 8rpx 0 rgba(0, 0, 0, 0.3);
			margin-bottom: 20rpx;
			flex-direction: row;
			position: fixed;
			top: 85vh;
			left: 85%;
			z-index: 9999999999 !important;" v-if="shareShow" @click="popClick" src="../../static/img/share.png">
		</image>
		<StatusBar class="sta"></StatusBar>
		<u-toast ref="uToast" />
		<view class="TopBar">
			<image src="../../static/img/xiangzuo.png" mode="" @click="GoBack"></image>
			<view class="User">
				<view class="Name">
					{{CurrentChatName}}
				</view>
				<view class="Depot">
					工号:{{CurrentChatId}}
				</view>
			</view>
			<image src="" mode=""></image>
		</view>
		<scroll-view class="MessageList" scroll-y="true">
			<view class="MessageList_Cont">
				<view class="Listitem"
					v-for="(item, index) in (this.$store.state.TheMessageList)['u' + this.$store.state.User.CurrentChatId]"
					v-if="item != ''">
					<view class="MessageListLeft" v-show="item.substring(0,1) === '#'">
						<image src="../../static/img/avatar/admin.png" v-show="togetsomeUser(CurrentChatId)=='admin'"
							style="width: 50rpx; height: 50rpx;" mode=""></image>
						<image src="../../static/img/avatar/super.png" v-show="togetsomeUser(CurrentChatId)=='super'"
							style="width: 50rpx; height: 50rpx;" mode=""></image>
						<image src="../../static/img/avatar/leader.png" v-show="togetsomeUser(CurrentChatId)=='leader'"
							style="width: 50rpx; height: 50rpx;" mode=""></image>
						<image src="../../static/img/avatar/common.png" v-show="togetsomeUser(CurrentChatId)=='common'"
							style="width: 50rpx; height: 50rpx;" mode=""></image>
						<view class="Pitem" v-show="item.substring(1,7) == '@photo'"
							@click="showPhoto(item.substring(15))">
							<span>
								<image :src="item.substring(7)" style="max-width: 60vw;border-radius: 10rpx;" mode="heightFix"></image>
							</span>
						</view>
						<view class="Sitem" style="" v-show="item.substring(1,7) == '@audio'"
							@click="listen(item.substring(15),index)">
							<div :class="{isL:isL == index,noL:isL != index}">
								<span></span>
								<span></span>
								<span></span>
								<span></span>
								<span></span>
								<span></span>
								<span></span>
								<span></span>
								<span></span>
							</div>
						</view>
						<view class="item" v-show="item.substring(1,7) == '@texts'">
							<span>{{item.substring(7)}}</span>
						</view>
						<view class="shareItem" v-show="item.substring(1,7) == '@share'" @click="shareClick(item)">
							<view style="width: 100%; display: flex; justify-content: center; align-items: center;">
								点击此处查看详情
							</view>
							<image :src='baseApi + item.substring(item.indexOf("?") + 1)' mode="aspectFill"
								style="width: 350rpx; height: 350rpx;">
							</image>
						</view>
						<view class="Sysitem" v-show="item.substring(1,7) == '@systo'" @click="shareClick(item)">
							<span>{{item.substring(7)}}</span>
						</view>
					</view>
					<view class="MessageListRight" v-show="item.substring(0,1) != '#'">
						<image src="../../static/img/avatar/admin.png" v-show="kind=='admin'"
							style="width: 50rpx; height: 50rpx;" mode=""></image>
						<image src="../../static/img/avatar/super.png" v-show="kind=='super'"
							style="width: 50rpx; height: 50rpx;" mode=""></image>
						<image src="../../static/img/avatar/leader.png" v-show="kind=='leader'"
							style="width: 50rpx; height: 50rpx;" mode=""></image>
						<image src="../../static/img/avatar/common.png" v-show="kind=='common'"
							style="width: 50rpx; height: 50rpx;" mode=""></image>
						<view class="Pitem" v-show="item.substring(0,6) == '@photo'"
							@click="showPhoto(item.substring(14))">
							<span>
								<image :src="item.substring(6)" style="max-width: 60vw;border-radius: 10rpx;" mode="heightFix"></image>
							</span>
						</view>
						<view class="Sitem" style="" v-show="item.substring(0,6) == '@audio'" @click="listen(item.substring(14),index)">
								<div :class="{isL:isL == index,noL:isL != index}">
								        <span></span>
								        <span></span>
								        <span></span>
								        <span></span>
								        <span></span>
								        <span></span>
								        <span></span>
								        <span></span>
								        <span></span>
								</div>
						</view>
						<view class="item" v-show="item.substring(0,6) == '@texts'">
							<span>{{item.substring(6)}}</span>
						</view>
						<view class="shareItem" v-show="item.substring(0,6) == '@share'" @click="shareClick(item)">
							<view style="width: 100%; display: flex; justify-content: center; align-items: center;">
								点击此处查看详情
							</view>
							<image :src='baseApi + item.substring(item.indexOf("?") + 1)' mode="aspectFill"
								style="width: 350rpx; height: 350rpx;">
							</image>
						</view>
						<view class="item" v-show="item.substring(0,6) == '@systo'" >
							<span>{{item.substring(6)}}</span>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<view class="Bottom">
			<view class="say" v-show="!isKey">
				<image src="../../static/img/yuyin2.png" style="width: 60rpx;height: 60rpx;" mode=""
					@click="isKey = !isKey"></image>
			</view>
			<view class="say" v-show="isKey">
				<image src="../../static/img/jianpan.png" style="width: 60rpx;height: 60rpx;" mode=""
					@click="isKey = !isKey"></image>
			</view>
			<view class="Input" @click="scrollToBottom" v-show="!isKey">
				<textarea :class="{input:true,have:InputValue != ''}" auto-height v-model="InputValue" auto-blur
					:focus="keyword" :autosize="{minRows:1,maxRows:8}" autosize :rows="1"> </textarea>
			</view>
			<view class="Input" v-show="isKey">
				<view :class="{talk:true,black:black}" @touchstart="startVoice" @touchend="endVoice">{{tishi}}</view>
			</view>
			<view class="photo" v-if="InputValue == ''" @click="AddIMG">
				<image src="../../static/img/tupian2.png" style="width: 60rpx;height: 60rpx;" mode=""></image>
				<!-- <image :src="initImagePath" mode=""></image> -->
			</view>
			<view class="button" v-else @touchend.prevent="send">发送</view>
		</view>
	</view>
</template>

<script>
	import config from '../../util/config';
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex';
	import {
		pathToBase64,
		base64ToPath
	} from '../../js_sdk/mmmm-image-tools/index.js'
	import StatusBar from '../../components/StatusBar.vue';
	const recorderManager = uni.getRecorderManager();
	const innerAudioContext2 = uni.createInnerAudioContext();
	export default {
		data() {
			return {
				InputValue: '',
				ChatList: [],
				MessageList: [],
				keyword: false,
				kind: '',
				photo: [],
				height: 0,
				voicePath: '',
				isL: -1,
				isKey: false,
				tishi: "按住说话",
				isRecording: false, // 记录录音状态
				touchStartTimestamp: 0, // 记录触摸开始时间
				touchTimeout: null,
				black: false,
				item: null, //从共享仓库传过来的设备信息,其他页面进入chat没有
				shareShow: false
			}
		},
		components: {
			StatusBar
		},
		onLoad() {
			let info = uni.getStorageSync("shareInfo")
			if (info) {
				this.shareShow = true
				this.item = info;
			} else {
				this.shareShow = false
			}
			this.baseApi = config.baseApi + '/api';
			// console.log(this.item)
			if (uni.getStorageSync('kind') == 'leader') {
				this.kind = 'leader'
			} else if (uni.getStorageSync('kind') == 'admin') {
				this.kind = 'admin'
			} else if (uni.getStorageSync('kind') == 'super') {
				this.kind = 'super'
			} else if (uni.getStorageSync('kind') == 'common') {
				this.kind = 'common'
			}
			let that = this;
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
					pathToBase64(this.voicePath)
						.then(base64 => {
							// console.log(base64);
							// console.log(base64.indexOf(","))
							var p = base64.substring(base64.indexOf(",") + 1);
							// console.log(base64.substring(5, 10));
							that.sendp("@audio" + p);
						})
						.catch(error => {
							console.error(error)
						});
				} else {
					uni.showToast({
						title: "说话时间太短",
						icon: 'none'
					})
				}
			});
		},
		onShow() {
			this.scrollToBottom();
		},
		onUnload() {
			var CurrentId = uni.getStorageSync("id");
			let map2 = uni.getStorageSync('HasMessage' + CurrentId);
			map2["u" + this.CurrentChatId] = 0;
			uni.setStorageSync('HasMessage' + CurrentId, map2);
			console.log("消除红点");
		},
		computed: {
			...mapState({
				CurrentChatId: state => state.User.CurrentChatId,
				UserList: state => state.User.UserList,
				CurrentChatName: state => state.User.CurrentChatName,
				TheMessageList: state => state.TheMessageList,
				ApproveList: state => state.Approve.ApproveList
			}),
			setStyles() {
				return {
					'--height': this.$refs.Input.offsetHeight
				}
			}
		},
		watch: {
			TheMessageList() {
				this.$nextTick(function() {
					setTimeout(() => {
						uni.pageScrollTo({
							scrollTop: 99999,
							duration: 100
						})
					}, 200) // 要加点延迟, 不然有可能不生效
				});
			}
		},
		methods: {
			showText(item) {
				console.log(item);
			},
			// if(item.substring(1,7) == "@share"|| item.substring(0,6) == "@share"){
			// 	uni.navigateTo({
			// 		url: "/pages/GongxiangCangku/chakanxiangqing?item=" + JSON.stringify(res[0]),
			// 	})
			// }else if(item.substring(1,7) == "@systo"|| item.substring(0,6) == "@systo"){
			// 	uni.navigateTo({
			// 		url: "/pages/Application/chakanxiangqing?item=" + JSON.stringify(res[0]),
			// 	})
			// }
			shareClick(item) {
				console.log(item.substring());
				let a = 0;
				if (item.substring(0, 1) == "#") {
					a = 1;
				}
				console.log(item.substring(a + 6, item.indexOf("?")));
				console.log(item.substring(item.indexOf("(")+1, item.indexOf(")")));
				if(item.substring(1,7) == "@share"|| item.substring(0,6) == "@share"){
					this.searchPub({
						id: item.substring(a + 6, item.indexOf("?"))
					}).then(res => {
						uni.setStorageSync("shareInfo", null)
						// console.log(this.$store.state.Depot.SearchPubList[0])
						uni.navigateTo({
							url: "/pages/GongxiangCangku/chakanxiangqing?item=" + JSON.stringify(res[0]),
						})
					})
				}else if(item.substring(1,7) == "@systo"|| item.substring(0,6) == "@systo"){
					let a = {};
					for(var i = 0; i<this.ApproveList.length;i++){
						if(this.ApproveList[i].id == item.substring(item.indexOf("(")+1, item.indexOf(")")) && this.ApproveList[i].status == 'await'){
							a = this.ApproveList[i];
						}
					}
					if(a == {}){
						this.$refs.uToast.show({
							message: "未查询到该设备",
							type: 'error',
							duration: 1000
						})
						return false;
					}
					this.searchPub({
						id: item.substring(item.indexOf("(")+1, item.indexOf(")"))
					}).then(res => {
						uni.setStorageSync("shareInfo", null)
						// console.log(this.$store.state.Depot.SearchPubList[0])
						console.log(res.length)
						if(res.length == 0){
							this.searchPri({
								id: item.substring(item.indexOf("(")+1, item.indexOf(")"))
							}).then(r => {
								uni.setStorageSync("shareInfo", null)
								// console.log(this.$store.state.Depot.SearchPubList[0])
								uni.navigateTo({
									url: "/pages/Application/chakanxiangqing?item=" + JSON.stringify(r[0])+'&apply='+JSON.stringify(a),
								})
							})
						}else{
							uni.navigateTo({
								url: "/pages/Application/chakanxiangqing?item=" + JSON.stringify(res[0])+'&apply='+JSON.stringify(a),
							})
						}
					})
				}
				
			},
			popClick() {
				// console.log("Share")
				var id = uni.getStorageSync('id');
				var cotnt = "@share" + this.item.id + "?" + this.item.photos[0] + "[" + id + ";" + this.CurrentChatId +
					',' + 0;
				console.log(cotnt)
				this.clickRequest(cotnt).then(res => {
					this.scrollToBottom()
				}).then(res => {
					uni.setStorageSync("shareInfo", null);
					this.shareShow = false
				})
			},
			touchStart(e) {
				// console.log("触摸开始")  
				this.touchStartX = e.touches[0].clientX;
				this.touchStartY = e.touches[0].clientY;
			},
			touchEnd(e) {
				// console.log("触摸结束")  
				let deltaX = e.changedTouches[0].clientX - this.touchStartX;
				let deltaY = e.changedTouches[0].clientY - this.touchStartY;
				// console.log(deltaX, deltaY, Math.abs(deltaX), Math.abs(deltaY));
				if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
					if (deltaX >= 0) {
						// console.log("右滑")
						if (this.action > 0) {
							this.action -= 1
						} else {
							this.action = 2
						}
					} else {
						// console.log("左滑")
						if (this.action < 2) {
							this.action += 1
						} else {
							this.action = 0
						}
					}
					this.change2()
				} else if (Math.abs(deltaY) > 50 && Math.abs(deltaX) < Math.abs(deltaY)) {
					if (deltaY < 0) {
						// console.log("上拉")
					} else {
						// console.log("下拉")
					}
				} else {
					// console.log("可能是点击！")
				}
			},
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
			startVoice() {
				this.black = true;
				// 开始录音
				// console.log('开始录音');
				this.tishi = '松开发送'
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
				this.tishi = '按住说话'
				recorderManager.stop();
				
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
			togetsomeUser(id) {
				let arr = this.UserList.filter((i) => {
					return id == i.id;
				});
				if (arr.length != 0) {
					// console.log(arr[0].kind);
					return arr[0].kind;
				}
			},
			scrollToBottom() {
				this.$nextTick(function() {
					setTimeout(() => {
						uni.pageScrollTo({
							scrollTop: 99999,
							duration: 100
						})
					}, 200) // 要加点延迟, 不然有可能不生效
				});
			},
			...mapActions({
				connectSocketInit: 'connectSocketInit',
				closeSocket: 'closeSocket',
				clickRequest: 'clickRequest',
				searchPub: 'Depot/searchPub',
				searchPri:"Depot/searchPri"
			}),
			GoBack() {
				uni.navigateBack()
			},
			sendp(base64) {
				this.keyword = true;

				//消息内容 + "[" + 发送消息的人 + ";" + 接收消息的人","+0		0是单发1是群发
				var id = uni.getStorageSync('id');
				var cotnt = base64 + "[" + id + ";" + this.CurrentChatId + ',' + 0;
				console.log(id+"==="+this.CurrentChatId);
				this.clickRequest(cotnt).then(res => {
					this.InputValue = ""
					this.scrollToBottom()
				})

			},

			send() {
				console.log("发送");
				this.keyword = true;
				if (this.InputValue.trim() == '') {
					this.$refs.uToast.show({
						message: "文本内容不可为空",
						type: 'error',
						duration: 1000
					})
				} else {
					//消息内容 + "[" + 发送消息的人 + ";" + 接收消息的人","+0		0是单发1是群发
					var id = uni.getStorageSync('id');
					var cotnt = "@texts" + this.InputValue + "[" + id + ";" + this.CurrentChatId + ',' + 0;
					this.clickRequest(cotnt).then(res => {
						this.InputValue = ""
						this.scrollToBottom()
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	
	.noL {
		width: 100%;
		height: 100%;
		display: flex;
	}
	
	.noL span {
		width: 6px;
		border-radius: 18px;
		margin-right: 6px;
		background: #4c4c4c;
		height: 50%;
		margin-top: 10%;
	}
	
	.isL {
		width: 100%;
		height: 100%;
		display: flex;
	}
	
	.isL span {
		width: 6px;
		border-radius: 18px;
		margin-right: 6px;
	}
	
	.isL span:nth-child(1) {
		/* 时间递增，参差不齐的效果 */
		animation: bar1 2s 0.2s infinite linear;
	}
	
	.isL span:nth-child(2) {
		animation: bar2 2s 0.4s infinite linear;
	}
	
	.isL span:nth-child(3) {
		animation: bar3 2s 0.6s infinite linear;
	}
	
	.isL span:nth-child(4) {
		animation: bar4 2s 0.8s infinite linear;
	}
	
	.isL span:nth-child(5) {
		animation: bar5 2s 1.0s infinite linear;
	}
	
	.isL span:nth-child(6) {
		animation: bar6 2s 1.2s infinite linear;
	}
	
	.isL span:nth-child(7) {
		animation: bar7 2s 1.4s infinite linear;
	}
	
	.isL span:nth-child(8) {
		animation: bar8 2s 1.6s infinite linear;
	}
	
	.isL span:nth-child(9) {
		animation: bar9 2s 1.8s infinite linear;
	}
	
	@keyframes bar1 {
		0% {
			background: #4c4c4c;
			margin-top: 25%;
			height: 10%;
		}
	
		50% {
			background: #4c4c4c;
			height: 100%;
			margin-top: 0%;
		}
	
		100% {
			background: #4c4c4c;
			height: 10%;
			margin-top: 25%;
		}
	}
	
	@keyframes bar2 {
		0% {
			background: #4c4c4c;
			margin-top: 25%;
			height: 10%;
		}
	
		50% {
			background: #4c4c4c;
			height: 100%;
			margin-top: 0%;
		}
	
		100% {
			background: #4c4c4c;
			height: 10%;
			margin-top: 25%;
		}
	}
	
	@keyframes bar3 {
		0% {
			background: #4c4c4c;
			margin-top: 25%;
			height: 10%;
		}
	
		50% {
			background: #4c4c4c;
			height: 100%;
			margin-top: 0%;
		}
	
		100% {
			background: #4c4c4c;
			height: 10%;
			margin-top: 25%;
		}
	}
	
	@keyframes bar4 {
		0% {
			background: #4c4c4c;
			margin-top: 25%;
			height: 10%;
		}
	
		50% {
			background: #4c4c4c;
			height: 100%;
			margin-top: 0%;
		}
	
		100% {
			background: #4c4c4c;
			height: 10%;
			margin-top: 25%;
		}
	}
	
	@keyframes bar5 {
		0% {
			background: #4c4c4c;
			margin-top: 25%;
			height: 10%;
		}
	
		50% {
			background: #4c4c4c;
			height: 100%;
			margin-top: 0%;
		}
	
		100% {
			background: #4c4c4c;
			height: 10%;
			margin-top: 25%;
		}
	}
	
	@keyframes bar6 {
		0% {
			background: #4c4c4c;
			margin-top: 25%;
			height: 10%;
		}
	
		50% {
			background: #4c4c4c;
			height: 100%;
			margin-top: 0%;
		}
	
		100% {
			background: #4c4c4c;
			height: 10%;
			margin-top: 25%;
		}
	}
	
	@keyframes bar7 {
		0% {
			background: #4c4c4c;
			margin-top: 25%;
			height: 10%;
		}
	
		50% {
			background: #4c4c4c;
			height: 100%;
			margin-top: 0%;
		}
	
		100% {
			background: #4c4c4c;
			height: 10%;
			margin-top: 25%;
		}
	}
	
	@keyframes bar8 {
		0% {
			background: #4c4c4c;
			margin-top: 25%;
			height: 10%;
		}
	
		50% {
			background: #4c4c4c;
			height: 100%;
			margin-top: 0%;
		}
	
		100% {
			background: #4c4c4c;
			height: 10%;
			margin-top: 25%;
		}
	}
	
	@keyframes bar9 {
		0% {
			background: #4c4c4c;
			margin-top: 25%;
			height: 10%;
		}
	
		50% {
			background: #4c4c4c;
			height: 100%;
			margin-top: 0%;
		}
	
		100% {
			background: #4c4c4c;
			height: 10%;
			margin-top: 25%;
		}
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		// justify-content: center;
		width: 100%;
		// padding: 20rpx;
		box-sizing: border-box;

		.pop {
			display: flex;
			flex-direction: column;
			width: 300rpx;
			height: 250rpx;
			background-color: #FFF;
			/* 卡片背景色 */
			padding: 20rpx;
			border-radius: 8rpx;
			box-shadow: 0 4rpx 8rpx 0 rgba(0, 0, 0, 0.3);
			margin-bottom: 20rpx;
			flex-direction: row;
			position: fixed;
			top: 70vh;
			left: 50%;
		}

		.sta {
			display: flex;
			position: fixed;
			top: 0;
		}

		.MessageList {
			display: flex;
			width: 90%;
			margin-top: 140rpx;
			margin-bottom: 13vh;
			flex-direction: column;
			padding: 20rpx 0  40rpx 0;

			.MessageList_Cont {
				.Listitem {
					display: flex;
					width: 100%;
					margin-top: 10rpx;

					.MessageListLeft {
						display: flex;
						width: 100%;
						// background-color: #6adfff;
						align-items: flex-start;

						.item {
							display: flex;
							margin: 20rpx 0 0 30rpx;
							border-radius: 10rpx;
							min-width: 50rpx;
							max-width: 80%;
							padding: 15rpx 15rpx;
							justify-content: center;
							align-items: center;
							background-color: #F2F1F6;
						}
						.Pitem{
							display: flex;
							margin: 20rpx 0 0 30rpx;
							border-radius: 10rpx;
							min-width: 50rpx;
							max-width: 80%;
							padding: 15rpx 15rpx;
							justify-content: center;
							align-items: center;
						}
						.Sitem {
							display: flex;
							background-color: #F2F1F6;
							border-radius: 10rpx;
							margin: 20rpx 0 0 30rpx;
							width: 200rpx;
							height: 50rpx;
							padding: 15rpx 15rpx;
							justify-content: center;
							align-items: center;
						}

						.shareItem {
							display: flex;
							flex-direction: column;
							background-color: #F2F1F6;
							border-radius: 10rpx;
							margin: 20rpx  0 0 30rpx;
							font-size: 40rpx;
							color: #2979ff;
							width: 400rpx;
							height: 450rpx;
							padding: 15rpx 15rpx;
							justify-content: space-around;
							align-items: center;
						}
						.Sysitem{
							width: 90%;
							height: 100rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							background-color: #F2F1F6;
							font-size: 35rpx;
							text-align: center;
							margin: 20rpx auto;
							
						}
					}

					.MessageListRight {
						display: flex;
						flex-direction: row-reverse;
						width: 100%;
						align-items: flex-start;

						// background-color: #6adfff;

						.item {
							display: flex;
							background-color: #C9E7FF;
							border-radius: 10rpx;
							margin: 20rpx 30rpx 0 0;
							min-width: 50rpx;
							max-width: 80%;
							padding: 15rpx 15rpx;
							justify-content: center;
							align-items: center;
						}
						.Pitem{
							display: flex;
							border-radius: 10rpx;
							margin: 20rpx 30rpx 0 0;
							min-width: 50rpx;
							max-width: 80%;
							padding: 15rpx 15rpx;
							justify-content: center;
							align-items: center;
						}
						.Sitem {
							display: flex;
							background-color: #C9E7FF;
							border-radius: 10rpx;
							margin: 20rpx 30rpx 0 0;
							width: 200rpx;
							height: 50rpx;
							padding: 15rpx 15rpx;
							justify-content: center;
							align-items: center;
							
							
						}

						.shareItem {
							display: flex;
							flex-direction: column;
							background-color: #C9E7FF;
							border-radius: 10rpx;
							margin: 20rpx 30rpx 0 0;
							font-size: 40rpx;
							color: #2979ff;
							width: 400rpx;
							height: 450rpx;
							padding: 15rpx 15rpx;
							justify-content: space-around;
							align-items: center;
						}
					}
				}
			}
		}

		.TopBar {
			display: flex;
			width: 100%;
			height: 80rpx;
			background-color: #FFF;
			position: fixed;
			top: var(--status-bar-height);
			border-bottom: 1rpx solid #e5e4e8;
			align-items: center;
			justify-content: space-around;
			padding: 0 30rpx;
			box-sizing: border-box;
			z-index: 99;

			image {
				width: 50rpx;
				height: 50rpx;
			}

			.User {
				width: 500rpx;
				// background-color: #2979ff;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				height: 80rpx;

				.Depot {
					font-size: 20rpx;
					font-weight: 100;
					color: #a4a4a6;
				}
			}
		}

		.Bottom {
			display: flex;
			position: fixed;
			width: 100%;
			height: var(--height);
			bottom: 0;
			background-color: #fff;
			flex-direction: row;
			justify-content: start;
			align-items: flex-end;
			border-top: 1rpx solid #e5e4e8;
			padding: 30rpx 30rpx;
			box-sizing: border-box;
			z-index: 9999;

			image {
				width: 50rpx;
				height: 50rpx;
			}


			.input {
				width: 550rpx;
				height: v-bind();
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
				height: v-bind();
				display: flex;
				padding: 20rpx;
				justify-content: center;
				background-color: #F2F1F6;
				border-radius: 15rpx;
				box-sizing: border-box;
				margin: 0 20rpx;
				transition: 300ms;
			}

			// .talk:active{
			// 	background-color: #828184;
			// 	color: #fff;
			// }
			.talk.black {
				width: 550rpx;
				height: v-bind();
				display: flex;
				padding: 20rpx;
				justify-content: center;
				border-radius: 15rpx;
				box-sizing: border-box;
				margin: 0 20rpx;
				transition: 300ms;
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
		}
	}

	
</style>