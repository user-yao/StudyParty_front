<template>
	<view>
		<div class="body">
			<!-- 顶部导航 -->
			<header class="app-header">
				<div class="header-top">
					<div class="logo">
						<u-icon name="arrow-left" size="24" color="#fff" @click="goBack"></u-icon>
						<span>创建小组</span>
					</div>
					<div class="header-actions">
						<u-button 
							type="primary" 
							size="small" 
							text="保存" 
							:loading="submitting"
							@click="submitCreateGroup"
							:disabled="!isFormValid">
						</u-button>
					</div>
				</div>
			</header>

			<!-- 表单内容 -->
			<div class="content">
				<div class="form-container">
					<!-- 小组头像 -->
					<div class="avatar-section">
						<div class="avatar-container" @click="chooseAvatar">
							<image 
								v-if="groupAvatar" 
								:src="groupAvatar" 
								class="group-avatar"
								mode="aspectFill">
							</image>
							<div v-else class="avatar-placeholder">
								<image 
									:src="imageUrl + 'static/head/group.png'" 
									class="default-avatar"
									mode="aspectFill">
								</image>
								<div class="avatar-overlay">
									<text class="avatar-tip">点击设置小组头像（可选）</text>
								</div>
							</div>
						</div>
						<text class="avatar-desc">可随时在小组管理界面更改头像</text>
					</div>

					<!-- 基本信息表单 -->
					<div class="form-section">
						<div class="section-title">基本信息</div>
						
						<!-- 小组名称 -->
						<div class="form-item">
							<div class="item-label">
								<text class="required">*</text>
								<text>小组名称</text>
							</div>
							<u-input 
								v-model="formData.groupName"
								placeholder="请输入小组名称（2-20字符，用户可通过名称搜索到您的小组）"
								maxlength="20"
								clearable
								border="none"
								:custom-style="inputStyle">
							</u-input>
							<div class="char-count">{{ formData.groupName.length }}/20</div>
						</div>

						<!-- 小组标语 -->
						<div class="form-item">
							<div class="item-label">
								<text>小组标语</text>
							</div>
							<u-textarea 
								v-model="formData.slogan"
								placeholder="请输入小组标语，介绍小组的目标和特色（用户搜索时会根据此内容进行匹配）"
								maxlength="100"
								height="80"
								count
								border="none"
								:custom-style="textareaStyle">
							</u-textarea>
						</div>

						<!-- 小组规则 -->
						<div class="form-item">
							<div class="item-label">
								<text>小组规则</text>
							</div>
							<u-textarea 
								v-model="formData.rule"
								placeholder="请输入小组规则，如学习要求、互动规范等"
								maxlength="500"
								height="120"
								count
								border="none"
								:custom-style="textareaStyle">
							</u-textarea>
						</div>
					</div>

					<!-- 权限设置 -->
					<div class="form-section">
						<div class="section-title">权限设置</div>
						
						<div class="form-item">
							<div class="item-label">
								<text>加入权限</text>
							</div>
							<div class="radio-group">
								<radio-group @change="onJoinPermissionChange">
									<label class="radio-item" :class="{ active: formData.canJoin === 1 }">
										<radio value="1" :checked="formData.canJoin === 1" color="#4361ee" />
										<div class="radio-content">
											<text class="radio-title">开放加入</text>
											<text class="radio-desc">任何人都可以申请加入</text>
										</div>
									</label>
									<label class="radio-item" :class="{ active: formData.canJoin === 0 }">
										<radio value="0" :checked="formData.canJoin === 0" color="#4361ee" />
										<div class="radio-content">
											<text class="radio-title">邀请加入</text>
											<text class="radio-desc">仅通过邀请才能加入</text>
										</div>
									</label>
								</radio-group>
							</div>
						</div>
					</div>

					<!-- 温馨提示 -->
					<div class="tips-section">
						<div class="tips-title">
							<u-icon name="info-circle" size="16" color="#4361ee"></u-icon>
							<text>温馨提示</text>
						</div>
						<div class="tips-content">
							<text>• 小组名称和标语创建后仍可修改</text>
							<text>• 用户搜索小组时将根据小组名称和标语进行匹配</text>
							<text>• 小组头像为可选设置，未设置时使用默认头像</text>
							<text>• 可随时调整加入权限设置</text>
							<text>• 创建成功后，您将成为小组组长</text>
						</div>
					</div>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
import { mapActions } from "vuex";
import { imageUrl } from "../../config/config";
import UploadUtils from "../../utils/uploadUtils.js";
export default {
	data() {
		return {
			formData: {
				groupName: '',
				slogan: '',
				rule: '',
				canJoin: 1 // 默认开放加入
			},
			groupAvatar: '', // 小组头像
			submitting: false,
			
			// 输入框样式
			inputStyle: {
				backgroundColor: '#f8f9fa',
				borderRadius: '8px',
				padding: '12px 15px',
				fontSize: '16px'
			},
			textareaStyle: {
				backgroundColor: '#f8f9fa',
				borderRadius: '8px',
				padding: '12px 15px',
				fontSize: '16px'
			}
		}
	},
	computed: {
		// 表单验证
		isFormValid() {
			return this.formData.groupName.trim().length >= 2 && 
			       this.formData.groupName.trim().length <= 20;
		},
        imageUrl() {
			return imageUrl;
		}
	},
	methods: {
		...mapActions({
			createGroup: "group/createGroup"
		}),
		
		// 返回上一页
		goBack() {
			uni.navigateBack({ delta: 1 });
		},
		
		// 选择头像
		chooseAvatar() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					const tempFilePath = res.tempFilePaths[0];
					this.groupAvatar = tempFilePath;
				},
				fail: (error) => {
					this.$u.toast('选择图片失败');
				}
			});
		},
		
		// 加入权限变化
		onJoinPermissionChange(event) {
			this.formData.canJoin = parseInt(event.detail.value);
		},
		
		// 提交创建小组
		async submitCreateGroup() {
			// 表单验证
			if (!this.validateForm()) {
				return;
			}
			
			try {
				this.submitting = true;
				
				// 准备提交数据
				const submitData = {
					groupName: this.formData.groupName.trim(),
					slogan: this.formData.slogan.trim() || '一起学习，共同进步！',
					rule: this.formData.rule.trim() || '请遵守小组规则，积极参与学习讨论。',
					canJoin: this.formData.canJoin
				};
				
				let res;
				
				// 如果用户选择了自定义头像，使用上传接口
				if (this.groupAvatar) {
					console.log('上传自定义头像和数据');
					res = await UploadUtils.uploadFile({
						url: '/group/createGroup',
						filePath: this.groupAvatar,
						name: 'photo', // 后端接收图片的字段名
						formData: submitData, // 将小组数据作为附加数据
						header: {
							'Authorization': `${uni.getStorageSync('token')}`
						},
						onProgress: (progress) => {
							console.log('上传进度:', progress + '%');
						}
					});
					
					// 处理上传结果
					if (res.success && res.data) {
						const responseData = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
						res = responseData; // 统一返回格式
					} else {
						throw new Error('上传失败');
					}
				} else {
					// 没有自定义头像，使用原有的创建接口
					console.log('使用默认头像创建小组');
					res = await this.createGroup(submitData);
				}
				
				if (res.code === 200) {
					this.$u.toast('小组创建成功！');
					
					// 延迟跳转，让用户看到成功提示
					setTimeout(() => {
						// 返回小组列表页面并刷新
						uni.navigateBack({ 
							delta: 1,
							success: () => {
								// 通过事件通知小组列表页面刷新数据
								uni.$emit('groupCreated', res.data);
							}
						});
					}, 1500);
				} else {
					this.$u.toast(res.msg || '创建失败，请重试');
				}
			} catch (error) {
				console.error('创建小组失败:', error);
				if (error.message) {
					this.$u.toast(error.message);
				} else {
					this.$u.toast('网络错误，请重试');
				}
			} finally {
				this.submitting = false;
			}
		},
		
		// 表单验证
		validateForm() {
			if (!this.formData.groupName.trim()) {
				this.$u.toast('请输入小组名称');
				return false;
			}
			
			if (this.formData.groupName.trim().length < 2) {
				this.$u.toast('小组名称至少2个字符');
				return false;
			}
			
			if (this.formData.groupName.trim().length > 20) {
				this.$u.toast('小组名称不能超过20个字符');
				return false;
			}
			
			if (this.formData.slogan.length > 100) {
				this.$u.toast('小组标语不能超过100个字符');
				return false;
			}
			
			if (this.formData.rule.length > 500) {
				this.$u.toast('小组规则不能超过500个字符');
				return false;
			}
			
			return true;
		}
	}
}
</script>

<style scoped>
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
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		display: flex;
		align-items: center;
		font-weight: 700;
		font-size: 1.4rem;
		gap: 10px;
	}

	.header-actions {
		display: flex;
		align-items: center;
	}

	/* 内容区域 */
	.content {
		flex: 1;
		overflow-y: auto;
		padding: 20px;
	}

	.form-container {
		max-width: 500px;
		margin: 0 auto;
	}

	/* 头像区域 */
	.avatar-section {
		background: white;
		border-radius: 16px;
		padding: 30px 20px;
		margin-bottom: 20px;
		text-align: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.avatar-container {
		width: 120px;
		height: 120px;
		margin: 0 auto 15px;
		border-radius: 50%;
		overflow: hidden;
		cursor: pointer;
		transition: transform 0.2s;
	}

	.avatar-container:hover {
		transform: scale(1.05);
	}

	.group-avatar {
		width: 100%;
		height: 100%;
	}

	.default-avatar {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.avatar-placeholder {
		width: 100%;
		height: 100%;
		position: relative;
		border-radius: 50%;
		overflow: hidden;
	}

	.avatar-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		opacity: 1;
		transition: background-color 0.3s ease;
	}

	.avatar-container:hover .avatar-overlay {
		background: rgba(0, 0, 0, 0.6);
	}

	.avatar-tip {
		font-size: 0.7rem;
		color: #fff;
		text-align: center;
		padding: 0 10px;
		font-weight: 500;
		line-height: 1.3;
	}

	.avatar-desc {
		color: #6c757d;
		font-size: 0.9rem;
	}

	/* 表单区域 */
	.form-section {
		background: white;
		border-radius: 16px;
		padding: 20px;
		margin-bottom: 20px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.section-title {
		font-size: 1.2rem;
		font-weight: 600;
		color: #212529;
		margin-bottom: 20px;
		padding-bottom: 10px;
		border-bottom: 2px solid #f8f9fa;
	}

	.form-item {
		margin-bottom: 20px;
	}

	.form-item:last-child {
		margin-bottom: 0;
	}

	.item-label {
		margin-bottom: 8px;
		font-weight: 500;
		color: #495057;
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.required {
		color: #dc3545;
		font-weight: 600;
	}

	.char-count {
		margin-top: 5px;
		font-size: 0.8rem;
		color: #6c757d;
		text-align: right;
	}

	/* 单选按钮组 */
	.radio-group {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.radio-item {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 15px;
		background: #f8f9fa;
		border-radius: 12px;
		border: 2px solid transparent;
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.radio-item.active {
		background: rgba(67, 97, 238, 0.1);
		border-color: #4361ee;
		transform: scale(1.02);
	}

	.radio-item:hover {
		background: #e9ecef;
	}

	.radio-item.active:hover {
		background: rgba(67, 97, 238, 0.15);
	}

	.radio-content {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.radio-title {
		font-weight: 600;
		color: #212529;
		font-size: 1rem;
	}

	.radio-desc {
		color: #6c757d;
		font-size: 0.9rem;
		line-height: 1.4;
	}

	/* 提示区域 */
	.tips-section {
		background: rgba(67, 97, 238, 0.05);
		border: 1px solid rgba(67, 97, 238, 0.2);
		border-radius: 12px;
		padding: 15px;
	}

	.tips-title {
		display: flex;
		align-items: center;
		gap: 8px;
		font-weight: 600;
		color: #4361ee;
		margin-bottom: 10px;
	}

	.tips-content {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.tips-content text {
		color: #495057;
		font-size: 0.9rem;
		line-height: 1.5;
	}
</style>