<template>
	<view>
		<div class="body">
			<!-- 顶部导航 -->
			<header class="app-header">
				<div class="header-top">
					<div class="logo">
						<u-icon name="arrow-left" size="50rpx" color="#fff" bold @click="uni.navigateBack(1)"></u-icon>
						<span>用户详情</span>
					</div>
					<div class="header-actions">
						<i class="fas fa-edit"></i>
						<i class="fas fa-ellipsis-v"></i>
					</div>
				</div>
			</header>

			<!-- 内容区域 -->
			<div class="content">
				<!-- 用户概要卡片 -->
				<div class="user-profile-card">
					<div class="user-avatar">
						<img :src="imageUrl + userInfo.head" :alt="userInfo.name" v-if="userInfo.head" @click="showPhoto(imageUrl+userInfo.head)">
					</div>
					<h2 class="user-name">
						<span class="alias-name" v-if="userInfo.remark">{{ userInfo.remark }}</span>
						<span v-else>{{ userInfo.name }}</span>
						<u-icon name="edit-pen-fill" size="50rpx" @click="showAliasModal = true"></u-icon>
					</h2>
					<p class="user-title">{{ userInfo.major }} · {{ userInfo.grade }}</p>

					<div class="user-badges">
						<div class="badge" :class="roleClass">
							<span>{{ roleText }}</span>
						</div>
					</div>

					<div class="stats-container">
						<div class="stat-item">
							<div class="stat-value">{{ userInfo.clockIn }}</div>
							<div class="stat-label">连续打卡</div>
						</div>
						<div class="stat-item">
							<div class="stat-value">{{ userInfo.finishTask }}</div>
							<div class="stat-label">完成任务</div>
						</div>
						<div class="stat-item">
							<div class="stat-value">{{ userInfo.starPrestige }}</div>
							<div class="stat-label">学术声望</div>
						</div>
					</div>
				</div>

				<!-- 基本信息卡片 -->
				<div class="info-card">
					<div class="card-header">
						<div class="card-title">
							<i class="fas fa-user"></i>
							<span>基本信息</span>
						</div>
					</div>
					<div class="info-grid">
						<div class="info-item">
							<image src="/static/userInfo/xingbie.png" class="info-icon" mode=""></image>
							<div class="info-content">
								<div class="info-label">性别</div>
								<div class="info-value">{{ userInfo.sex }}</div>
							</div>
						</div>
						<div class="info-item">
							<image src="/static/userInfo/qiye.png" class="info-icon" mode="" v-if="userInfo.status==3"></image>
							<image src="/static/userInfo/xuexiao_xuesheng.png" class="info-icon" mode="" v-if="userInfo.status==1||userInfo.status==2"></image>
							<div class="info-content">
								<div class="info-label">{{ userInfo.status==3?'企业':'学校' }}</div>
								<div class="info-value">{{ userInfo.school }}</div>
							</div>
						</div>
						<div class="info-item">
							<image src="/static/userInfo/bumen.png" class="info-icon" mode="" v-if="userInfo.status==3"></image>
							<image src="/static/userInfo/zhuanyemingcheng.png" class="info-icon" mode="" v-if="userInfo.status==1||userInfo.status==2"></image>
							<div class="info-content">
								<div class="info-label">{{userInfo.status==3?'部门':'专业'}}</div>
								<div class="info-value">{{ userInfo.major }}</div>
							</div>
						</div>
						<div class="info-item">
							<image src="/static/userInfo/nianji.png" class="info-icon" mode="" v-if="userInfo.status==3"></image>
							<image src="/static/userInfo/cardid.png" class="info-icon" mode="" v-if="userInfo.status==1||userInfo.status==2"></image>
							<div class="info-content">
								<div class="info-label">{{userInfo.status==3?'职位':'年级'}}</div>
								<div class="info-value">{{ userInfo.grade }}</div>
							</div>
						</div>
					</div>
				</div>

				<!-- 联系信息卡片 -->
				<div class="info-card">
					<div class="card-header">
						<div class="card-title">
							<i class="fas fa-address-card"></i>
							<span>联系信息</span>
						</div>
					</div>
					<div class="info-grid">
						<div class="info-item">
							<image src="/static/userInfo/dianhua.png" class="info-icon" mode=""></image>
							<div class="info-content">
								<div class="info-label">手机号码</div>
								<div class="info-value">{{ friendList.get(userInfo.id)?userInfo.phone:'成为好友后可见' }}</div>
							</div>
						</div>
						<div class="info-item">
							<image src="/static/userInfo/youxiang.png" class="info-icon" mode=""></image>
							<div class="info-content">
								<div class="info-label">电子邮箱</div>
								<div class="info-value">{{ userInfo.email ?userInfo.email:'暂时为空'}}</div>
							</div>
						</div>
					</div>
				</div>

				<!-- 账户信息卡片 -->
				<div class="info-card">
					<div class="card-header">
						<div class="card-title">
							<i class="fas fa-info-circle"></i>
							<span>账户信息</span>
						</div>
					</div>
					<div class="info-grid">
						<div class="info-item">
							<image src="/static/userInfo/userinfo.png" class="info-icon" mode=""></image>
							<div class="info-content">
								<div class="info-label">注册日期</div>
								<div class="info-value">{{ userInfo.createDate }}</div>
							</div>
						</div>
						<div class="info-item">
							<image src="/static/userInfo/qianshoushenpitongguo-xianxing.png" class="info-icon" mode=""></image>
							<div class="info-content">
								<div class="info-label">最后登录</div>
								<div class="info-value">{{ userInfo.lastLogin }}</div>
							</div>
						</div>
					</div>
				</div>

				<!-- 操作按钮 -->
					<div class="action-buttons">
						<button class="btn btn-primary" v-if="friendList.get(userInfo.id)"  @click="toChatPage(userInfo)">
							<u-icon name="chat-fill" color="#fff" size="50rpx" style="margin-right: 20rpx;"></u-icon> 发送消息
						</button>
						<button class="btn btn-error" v-if="friendList.get(userInfo.id)" @click="showDeleteModal = true">
							<u-icon name="person-delete-fill" color="#fff" size="50rpx" style="margin-right: 20rpx;"></u-icon> 删除好友
						</button>
						<button class="btn btn-primary"v-if="!friendList.get(userInfo.id)">
							<u-icon name="plus-people-fill" color="#fff" size="50rpx" style="margin-right: 20rpx;"></u-icon> 添加好友
						</button>
					</div>
				<!-- 备注编辑弹窗 -->
				<up-popup round="25" v-model:show="showAliasModal" mode="center">
				        <div style="padding: 50rpx;">
							<div class="modal-header">
							    <h3 class="modal-title">编辑用户备注</h3>
							</div>
							<div class="form-group">
							    <label class="form-label">备注名称</label>
							    <u-input type="text" class="form-input" v-model="remarkInput" placeholder="输入备注名称"></u-input>
							    <p style="font-size: 0.8rem; color: var(--gray); margin-top: 5px;">为空时将显示原名称</p>
							</div>
							<div class="modal-actions">
							    <u-button type="info" class="modal-btn modal-btn-cancel" @click="showAliasModal = false">取消</u-button>
							    <u-button type="primary" class="modal-btn modal-btn-save" @click="saveAlias">保存</u-button>
							</div>
						</div>
				</up-popup>
				<up-modal :show="showDeleteModal" showCancelButton confirmColor="#f72585" title="删除好友" content='是否要删除该好友' @confirm="deleteUser(userInfo.id)"></up-modal>
			</div>
		</div>
	</view>
</template>

<script>
	import db from '@/utils/SQLite.js';
	import user from "../../store/user/user";
import {
		imageUrl,sourceUrl
	} from "@/config/config.js";
	import {
		mapState,
		mapMutations,
		mapActions
	} from "vuex";
	export default {
		data() {
			return {
				showAliasModal: false,
				showDeleteModal:false,
				isLoading: true,
				remarkInput:'',
				userInfo: {}
			}
		},
		onLoad(options) {
			const eventChannel = this.getOpenerEventChannel();
			  eventChannel.on("chatData", async (data) => {
			    try {
			      this.isLoading = true;
			      const res = await this.selectUser({ id: `${data.id}` });
			      this.userInfo = res;
			    } catch (error) {
			      uni.showToast({ title: "数据加载失败", icon: "none" });
			    } finally {
			      this.isLoading = false;
			    }
			  });
		},
		computed: {
			...mapState({
				friendList: state => state.userFriend.friendList
			}),
			imageUrl() {
				return imageUrl
			},
			sourceUrl(){
				return sourceUrl
			},
		  roleMapping() {
		    return {
		      1: { text: "学生", icon: "fa-user-graduate", class: "student", color: "#1890ff" },
		      2: { text: "教师", icon: "fa-chalkboard-teacher", class: "teacher", color: "#faad14" },
		      3: { text: "企业", icon: "fa-building", class: "enterprise", color: "#52c41a" },
		    };
		  },
		  roleText() {
		    return this.roleMapping[this.userInfo.status]?.text || "未知";
		  },
		  roleClass() {
		    return this.roleMapping[this.userInfo.status]?.class || "";
		  }
		},
		methods: {
			deleteUser(friendId){
				this.deleteFriend({friendId:friendId}).then(()=>{
					db.clearMessage(friendId, 'person'); 
					this.showDeleteModal = false
					uni.navigateBack(1)
				})
			},
			saveAlias() {
			    // 保存备注信息
				let that = this;
			    this.saveRemark({friendId:this.userInfo.id,remark:this.remarkInput.trim()}).then(()=>{
					that.selectUser({ id: `${this.userInfo.id}` }).then(res =>{
						console.log(res)
						that.userInfo = res;
					})
				})
			    // 关闭弹窗
			    this.showAliasModal = false;
			},
			toChatPage(userInfo) {
				let friend = userInfo;
				friend.friendId = userInfo.id;
				let chat = {statu:'person'};
				uni.navigateTo({
					url: `/pages/chatList/chatPage`,
					success: (res) => {
						res.eventChannel.emit("chatData", {
							chat,
							friend
						});
					},
					fail(res) {
						console.log(res)
					}
				})
			},
			...mapActions({
				selectUser: "user/selectUser",
				saveRemark:"userFriend/saveRemark",
				deleteFriend:'userFriend/deleteFriend'
			}),
			
			showPhoto(item) {
				// console.log(item.substring(7))
				var photo = [];
				photo.push(sourceUrl + item);
				// console.log(photo);
				uni.previewImage({
					current: 0,
					urls:  photo,
					success() {
						// console.log("chenggong");
					}
				});
			},
			goBack() {
				// 返回上一页的逻辑
				uni.navigateBack(1);
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

	.header-actions {
		display: flex;
		gap: 20px;
	}

	.header-actions i {
		font-size: 1.3rem;
	}

	/* 内容区域 */
	.content {
		flex: 1;
		padding: 20px;
		overflow-y: auto;
		padding-bottom: 70px;
	}

	/* 用户概要卡片 */
	.user-profile-card {
		background: white;
		border-radius: 16px;
		padding: 20px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		margin-bottom: 20px;
		text-align: center;
	}

	.user-avatar {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		margin: 0 auto 15px;
		border: 4px solid var(--light);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		background: linear-gradient(45deg, var(--accent), var(--success));
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 2.5rem;
		font-weight: bold;
		overflow: hidden;
	}

	.user-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.user-name {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 5px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}

	.user-title {
		color: var(--gray);
		margin-bottom: 15px;
		font-size: 0.95rem;
	}

	.user-badges {
		display: flex;
		justify-content: center;
		gap: 10px;
		margin-bottom: 20px;
	}

	.badge {
		background: var(--light);
		padding: 5px 12px;
		border-radius: 20px;
		font-size: 0.85rem;
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.badge.student {
		background: rgba(67, 97, 238, 0.1);
		color: var(--primary);
	}

	.badge.teacher {
		background: rgba(247, 37, 133, 0.1);
		color: var(--warning);
	}

	.badge.enterprise {
		background: rgba(76, 201, 240, 0.1);
		color: var(--success);
	}

	.stats-container {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 15px;
		margin-top: 20px;
	}

	.stat-item {
		text-align: center;
		padding: 12px;
		background: var(--section-bg);
		border-radius: 12px;
	}

	.stat-value {
		font-size: 1.4rem;
		font-weight: 700;
		color: var(--primary);
		margin-bottom: 5px;
	}

	.stat-label {
		font-size: 0.85rem;
		color: var(--gray);
	}

	/* 信息卡片 */
	.info-card {
		background: white;
		border-radius: 16px;
		padding: 20px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		margin-bottom: 20px;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;
		padding-bottom: 10px;
		border-bottom: 1px solid var(--light-gray);
	}

	.card-title {
		font-size: 1.1rem;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.info-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 15px;
	}

	.info-item {
		display: flex;
		align-items: center;
	}

	.info-icon {
		width: 36px;
		height: 36px;
		padding: 5px;
		border-radius: 10px;
		background: var(--light);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 12px;
		color: var(--primary);
	}

	.info-content {
		flex: 1;
	}

	.info-label {
		font-size: 0.85rem;
		color: var(--gray);
		margin-bottom: 3px;
	}

	.info-value {
		font-weight: 500;
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

	/* 按钮 */
	.action-buttons {
		display: flex;
		justify-content: space-around;
		margin-top: 10px;
	}

	.btn {
		padding: 0 30rpx;
		border-radius: 12px;
		font-weight: 500;
		text-align: center;
		cursor: pointer;
		transition: all 0.2s;
		border: none;
		font-size: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-primary {
		background: var(--primary);
		color: white;
	}
	.btn-error{
		background: var(--warning);
		border: 1px solid var(--warning);
		color: white;
	}
	.btn-outline {
		background: transparent;
		border: 1px solid var(--primary);
		color: var(--primary);
	}

	.btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}
	/* 弹窗样式 */
	.modal-overlay {
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
	    padding: 20px;
	}
	
	.modal-content {
	    background: white;
	    border-radius: 16px;
	    padding: 25px;
	    width: 100%;
	    max-width: 400px;
	    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
	}
	
	.modal-header {
	    display: flex;
	    justify-content: space-between;
	    align-items: center;
	    margin-bottom: 20px;
	}
	
	.modal-title {
	    font-size: 1.3rem;
	    font-weight: 600;
	    color: var(--dark);
	}
	
	.modal-close {
	    background: none;
	    border: none;
	    font-size: 1.5rem;
	    cursor: pointer;
	    color: var(--gray);
	}
	
	.form-group {
	    margin-bottom: 20px;
	}
	
	.form-label {
	    display: block;
	    margin-bottom: 8px;
	    font-weight: 500;
	    color: var(--dark);
	}
	
	.form-input {
	    width: 80%;
	    padding: 12px 15px;
	    border: 1px solid var(--light-gray);
	    border-radius: 10px;
	    font-size: 1rem;
	    transition: border-color 0.2s;
	}
	
	.form-input:focus {
	    outline: none;
	    border-color: var(--primary);
	}
	
	.modal-actions {
	    display: flex;
	    gap: 15px;
	}
	
	.modal-btn {
	    padding: 0 30rpx;
	    border-radius: 12px;
	    font-weight: 500;
	    text-align: center;
	    cursor: pointer;
	    transition: all 0.2s;
	    border: none;
	    font-size: 1rem;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	}
	
	.modal-btn-cancel {
	    background: var(--light);
	    color: var(--dark);
	}
	
	.modal-btn-save {
	    background: var(--primary);
	    color: white;
	}
	
	/* 响应式调整 */
	@media (max-width: 480px) {
	    .user-avatar {
	        width: 80px;
	        height: 80px;
	        font-size: 2rem;
	    }
	    
	    .user-name {
	        font-size: 1.3rem;
	    }
	    
	    .stats-container {
	        grid-template-columns: repeat(3, 1fr);
	        gap: 10px;
	    }
	    
	    .stat-value {
	        font-size: 1.2rem;
	    }
	    
	    .modal-content {
	        padding: 20px;
	    }
	}
</style>