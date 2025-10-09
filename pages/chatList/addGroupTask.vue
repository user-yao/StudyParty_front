<template>
	<view class="add-task-page">
		<!-- 顶部导航 -->
		<view class="app-header">
			<view class="header-top">
				<view class="logo" @click="goBack">
					<u-icon name="arrow-left" color="white" size="20"></u-icon>
					<text>返回</text>
				</view>
				<view class="header-actions">
					<u-button type="primary" size="mini" @click="submitTask" :loading="submitLoading" :disabled="!isFormValid">
						发布
					</u-button>
				</view>
			</view>
		</view>
		
		<view class="content">
			<view class="form-container">
				<!-- 任务标题 -->
				<view class="form-section title-section">
					<text class="section-title">任务标题</text>
					<view class="form-item">
						<u--input 
							v-model="taskForm.content" 
							placeholder="请输入任务标题" 
							border="surround"
							class="title-input"
						/>
					</view>
				</view>
				
				<!-- 时间设置 -->
				<view class="form-section">
					<text class="section-title">时间设置</text>
					<view class="form-item">
						<text class="time-label">开始时间</text>
						<view class="input-with-icon">
							<u--input
								v-model="formattedStartTime"
								placeholder="请选择开始时间"
								disabled
								border="surround"
								class="time-input-wrapper"
							/>
							<u-icon 
								name="edit-pen" 
								color="#909399" 
								size="20" 
								class="edit-icon"
								@click="showStartTimePicker = true"
							></u-icon>
						</view>
					</view>
					
					<view class="form-item">
						<text class="time-label">截止时间</text>
						<view class="input-with-icon">
							<u--input
								v-model="formattedDeadline"
								placeholder="请选择截止时间"
								disabled
								border="surround"
								class="time-input-wrapper"
							/>
							<u-icon 
								name="edit-pen" 
								color="#909399" 
								size="20" 
								class="edit-icon"
								@click="showDeadlinePicker = true"
							></u-icon>
						</view>
					</view>
				</view>
				
				<!-- 任务描述 -->
				<view class="form-section">
					<text class="section-title">任务描述</text>
					<view class="form-item content-section">
						<view class="editor-container">
							<!-- 编辑器头部 -->
							<view class="submission-header">
								<view class="markdown-info">
									<u-icon name="file-text" size="16" color="#4361ee"></u-icon>
									<text class="markdown-text">支持Markdown语法</text>
								</view>
								<view class="markdown-links">
									<text class="toolbar-text" @click="goToMarkdownGuide">语法教程</text>
									<text class="toolbar-text" @click="previewMarkdown" style="margin-left: 10px;">预览</text>
								</view>
							</view>
							
							<!-- 文本框容器 -->
							<view class="textarea-container" :style="textareaContainerStyle">
								<scroll-view 
									class="textarea-container"
									scroll-y="true"
									:scroll-top="textareaScrollTop"
									@scroll="onTextareaScroll"
									:style="textareaContainerStyle"
									enable-flex="true">
									<textarea 
										ref="submissionTextarea"
										class="submission-text" 
										v-model="displayContent" 
										placeholder="请输入任务描述内容，支持Markdown语法..."
										:style="textareaStyle"
										@focus="onTextareaFocus"
										@blur="onTextareaBlur"
										:maxlength="5000">
									</textarea>
								</scroll-view>
								
								<!-- 图片功能栏 -->
								<view class="image-toolbar">
									<view class="toolbar-icon" @click="uploadImage">
										<u-icon name="photo" size="24" color="#4361ee"></u-icon>
									</view>
									<text class="toolbar-text" @click="uploadImage">添加图片</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				
			</view>
		</view>
		
		<!-- 时间选择器 -->
		<u-datetime-picker
			:show="showStartTimePicker"
			v-model="taskForm.startTime"
			mode="datetime"
			@confirm="confirmStartTime"
			@cancel="showStartTimePicker = false"
		/>
		
		<u-datetime-picker
			:show="showDeadlinePicker"
			v-model="taskForm.deadline"
			mode="datetime"
			@confirm="confirmDeadline"
			@cancel="showDeadlinePicker = false"
		/>
	</view>
</template>

<script>
	import { mapActions } from 'vuex';
	import UploadUtils from '../../utils/uploadUtils.js'
	
	export default {
		data() {
			return {
				groupId: null,
				taskForm: {
					content: '', // 任务标题
					groupId: null, // 小组Id
					deadline: null, // 结束时间毫秒级时间戳
					startTime: null, // 开始时间毫秒级时间戳
					markdown: '', // 任务内容，Markdown格式
					
				},
				
				showStartTimePicker: false,
				showDeadlinePicker: false,
				showPreview: false,
				submitLoading: false,
				
				// Markdown编辑器相关数据
				displayContent: '', // 显示内容（包含图片占位符）
				submissionContent: '', // 提交内容（包含Markdown图片代码）
				textareaScrollTop: 0,
				isTextareaFocused: false,
				keyboardHeight: 0,

				uploading: false,
				imageMap: [], // 存储图片映射关系：{ placeholder: "[图片1]", markdown: "![图片1](url1)" }
				imageCounter: 0, // 图片编号计数器
			}
		},
		computed: {
			// 格式化开始时间显示
			formattedStartTime() {
				if (this.taskForm.startTime) {
					return this.formatDateTime(this.taskForm.startTime);
				}
				return '';
			},
			// 格式化截止时间显示
			formattedDeadline() {
				if (this.taskForm.deadline) {
					return this.formatDateTime(this.taskForm.deadline);
				}
				return '';
			},
			// 表单验证
			isFormValid() {
				return this.taskForm.content.trim().length > 0 && 
				       this.taskForm.startTime && 
				       this.taskForm.deadline &&
				       this.taskForm.startTime < this.taskForm.deadline;
			},
			

			
			// 文本框样式
			textareaStyle() {
				if (this.keyboardHeight > 0) {
					// 键盘弹起时，动态计算文本框高度
					// 确保文本框底部与图片功能栏顶部之间有足够空间
					const totalDeduction = this.keyboardHeight + 120; // 键盘高度 + 功能栏高度 + 间距
					return {
						height: `calc(300px - ${totalDeduction}px)`,
						marginBottom: '60px',
						whiteSpace: 'pre-wrap', // 支持换行符
						wordWrap: 'break-word', // 自动换行
						lineHeight: '1.5' // 行高
					};
				} else {
					// 键盘收起时，使用默认高度
					return {
						height: '300px',
						marginBottom: '12px',
						whiteSpace: 'pre-wrap', // 支持换行符
						wordWrap: 'break-word', // 自动换行
						lineHeight: '1.5' // 行高
					};
				}
			},
			
			// 文本框容器样式
			textareaContainerStyle() {
				if (this.keyboardHeight > 0) {
					// 键盘弹起时，容器高度需要为键盘和功能栏留出空间
					const totalDeduction = this.keyboardHeight + 200; // 键盘高度 + 功能栏高度 + 间距
					return {
						height: `calc(100vh - ${totalDeduction}px)`,
						flex: '1'
					};
				} else {
					// 键盘收起时，使用默认高度
					return {
						height: '300px',
						flex: '1'
					};
				}
			}
		},
		watch: {
			// 监听显示内容变化
			displayContent(newVal, oldVal) {
				try {
					// 如果文本框处于聚焦状态且键盘弹起，自动滚动到底部
					if (this.isTextareaFocused && this.keyboardHeight > 0) {
						// 延迟执行，确保DOM已更新
						this.$nextTick(() => {
							this.scrollToTextareaBottom();
						});
					}
					
					// 检查是否有图片被删除
					this.syncContentWithDisplay();
				} catch (error) {
					console.error('Error in displayContent watcher:', error);
				}
			}
		},
		onLoad(options) {
			// 获取从上一页传递的groupId
			const eventChannel = this.getOpenerEventChannel();
			eventChannel.on('groupData', (data) => {
				if (data && data.groupId) {
					this.groupId = data.groupId;
					this.taskForm.groupId = data.groupId;
				}
			});
			
			// 设置默认时间
			this.setDefaultTimes();
		},
		onShow() {
			console.log('添加任务页面显示');
			// 监听键盘事件
			try {
				// 先检查this.onKeyboardHeightChange是否存在且为函数
				if (this.onKeyboardHeightChange && typeof this.onKeyboardHeightChange === 'function') {
					uni.onKeyboardHeightChange(this.onKeyboardHeightChange);
				} else {
					console.warn('onKeyboardHeightChange is not a valid function, cannot register keyboard listener');
				}
			} catch (error) {
				console.error('Error registering keyboard height change listener in onShow:', error);
			}
		},
		onUnload() {
			console.log('添加任务页面卸载');
			// 取消监听键盘事件
			try {
				// 先检查this.onKeyboardHeightChange是否存在且为函数
				if (this.onKeyboardHeightChange && typeof this.onKeyboardHeightChange === 'function') {
					uni.offKeyboardHeightChange(this.onKeyboardHeightChange);
				} else {
					console.warn('onKeyboardHeightChange is not a valid function, cannot unregister keyboard listener');
				}
			} catch (error) {
				console.error('Error unregistering keyboard height change listener in onUnload:', error);
			}
		},
		methods: {
			...mapActions('groupTask', ['uploadMarkdown']),
			
			// 同步显示内容和实际提交内容
			syncContentWithDisplay() {
				try {
					// 基于displayContent和imageMap生成submissionContent
					let content = this.displayContent;
					
					// 检查是否有图片被删除
					const deletedImages = [];
					this.imageMap.forEach((image, index) => {
						if (!content.includes(image.placeholder)) {
							deletedImages.push(index);
						}
					});
					
					// 从imageMap中移除已删除的图片（从后往前删除，避免索引变化）
					for (let i = deletedImages.length - 1; i >= 0; i--) {
						this.imageMap.splice(deletedImages[i], 1);
					}
					
					// 将所有【图片】占位符替换为对应的Markdown代码
					this.imageMap.forEach(image => {
						const placeholderRegex = new RegExp(image.placeholder.replace(/[[\]]/g, '\\$&'), 'g');
						content = content.replace(placeholderRegex, image.markdown);
					});
					
					this.submissionContent = content;
					// 同时更新taskForm中的markdown内容
					this.taskForm.markdown = content;
				} catch (error) {
					console.error('Error in syncContentWithDisplay:', error);
				}
			},

			// 从提交内容生成显示内容
			generateDisplayContent() {
				try {
					// 如果是初始化，需要从submissionContent中提取已有的图片并建立映射
					if (this.imageMap.length === 0) {
						// 匹配Markdown图片语法: ![alt](url)
						const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
						let match;
						let index = 1;
						
						// 清空现有映射
						this.imageMap = [];
						
						// 查找所有图片并建立映射
						while ((match = imageRegex.exec(this.submissionContent)) !== null) {
							const altText = match[1];
							const imageUrl = match[2];
							const placeholder = `[图片${index}]`;
							const markdown = match[0]; // 完整的Markdown语法
							
							this.imageMap.push({
								placeholder: placeholder,
								markdown: markdown
							});
							
							// 更新图片计数器
							if (index > this.imageCounter) {
								this.imageCounter = index;
							}
							
							index++;
						}
					}
					
					// 将所有Markdown图片代码替换为【图片】占位符
					let content = this.submissionContent;
					this.imageMap.forEach(image => {
						const markdownRegex = new RegExp(image.markdown.replace(/[[\]()]/g, '\\$&'), 'g');
						content = content.replace(markdownRegex, image.placeholder);
					});
					
					this.displayContent = content;
				} catch (error) {
					console.error('Error in generateDisplayContent:', error);
				}
			},

			// 滚动事件处理
			onScroll(e) {
				// 可以在这里处理滚动事件
			},

			// 文本框滚动事件处理
			onTextareaScroll(e) {
				// 可以在这里处理文本框的滚动事件
			},

			// 文本框获得焦点事件
			onTextareaFocus(e) {
				try {
					this.isTextareaFocused = true;
					console.log('文本框获得焦点');
					
					// 延迟执行滚动到底部，确保DOM已更新
					this.$nextTick(() => {
						this.scrollToTextareaBottom();
					});
				} catch (error) {
					console.error('Error in onTextareaFocus:', error);
				}
			},

			// 文本框失去焦点事件
			onTextareaBlur(e) {
				try {
					this.isTextareaFocused = false;
					console.log('文本框失去焦点');
				} catch (error) {
					console.error('Error in onTextareaBlur:', error);
				}
			},

			// 滚动到文本框底部
			scrollToTextareaBottom() {
				try {
					if (!this.isTextareaFocused) return;
					
					// 使用更准确的方法计算滚动位置
					const textarea = this.$refs.submissionTextarea;
					if (textarea) {
						// 获取文本框的实际高度
						this.$nextTick(() => {
							const textareaElement = textarea.$el || textarea;
							if (textareaElement) {
								const scrollHeight = textareaElement.scrollHeight || 0;
								const clientHeight = textareaElement.clientHeight || 0;
								
								// 如果内容高度大于可视高度，则滚动到底部
								if (scrollHeight > clientHeight) {
									this.textareaScrollTop = scrollHeight - clientHeight;
								}
							}
						});
					}
					
					console.log('滚动到文本框底部');
				} catch (error) {
					console.error('Error in scrollToTextareaBottom:', error);
				}
			},
			
			// 键盘高度变化处理
			onKeyboardHeightChange(res) {
				try {
					this.keyboardHeight = res.height || 0;
					
					// 当键盘弹起时
					if (res.height > 0) {
						console.log('键盘弹起，高度:', res.height);
						
						// 如果文本框处于聚焦状态，滚动到最后一行
						if (this.isTextareaFocused) {
							// 延迟执行，确保布局已更新
							setTimeout(() => {
								this.scrollToTextareaBottom();
							}, 100);
						}
					} else {
						console.log('键盘收起');
					}
					
					// 强制重新计算布局
					this.$forceUpdate();
				} catch (error) {
					console.error('Error in onKeyboardHeightChange:', error);
				}
			},
			
			// 预览Markdown内容
			previewMarkdown() {
				// 预览时使用submissionContent（包含Markdown图片代码）
				if (!this.submissionContent.trim()) {
					uni.showToast({
						title: '请输入内容后再预览',
						icon: 'none'
					});
					return;
				}
				
				// 跳转到预览页面，传递内容
				uni.navigateTo({
					url: `/pages/chatList/markdownPreview?content=${encodeURIComponent(this.submissionContent)}`
				});
			},

			// 跳转到Markdown语法教程
			goToMarkdownGuide() {
				uni.navigateTo({
					url: '/pages/chatList/markdownGuide'
				});
			},

			// 图片上传功能
			uploadImage() {
				if (this.uploading) {
					return;
				}
				
				this.uploading = true;
				
				// 选择图片（uni.chooseImage不返回Promise，使用回调方式）
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (chooseRes) => {
						try {
							const tempFilePath = chooseRes.tempFilePaths[0];
							
							// 不再上传到服务器，而是本地保存
							// 生成占位符和Markdown代码
							// 修复图片编号问题：使用一个递增的计数器而不是imageMap.length
							this.imageCounter = this.imageCounter || 0;
							this.imageCounter++;
							const placeholder = `[图片${this.imageCounter}]`;
							// 本地临时保存图片路径
							const imageMarkdown = `![图片${this.imageCounter}](${tempFilePath})`;
							
							// 添加到图片映射中
							this.imageMap.push({
								placeholder: placeholder,
								markdown: imageMarkdown,
								localPath: tempFilePath // 保存本地路径
							});
							
							// 在光标位置插入占位符
							const textarea = this.$refs.submissionTextarea;
							let newDisplayContent = this.displayContent;
							
							if (textarea && textarea.$el) {
								// 获取光标位置
								const cursorPosition = textarea.$el.selectionStart || newDisplayContent.length;
								const beforeText = newDisplayContent.substring(0, cursorPosition);
								const afterText = newDisplayContent.substring(cursorPosition);
								newDisplayContent = beforeText + `\n${placeholder}\n` + afterText;
							} else {
								// 如果无法获取光标位置，则在末尾添加
								newDisplayContent += `\n${placeholder}\n`;
							}
							
							// 更新显示内容
							this.displayContent = newDisplayContent;
							
							// 同步内容
							this.syncContentWithDisplay();
							
							uni.showToast({
								title: '图片已添加',
								icon: 'success'
							});
						} catch (error) {
							uni.showToast({
								title: error.message || '添加失败',
								icon: 'none'
							});
						} finally {
							this.uploading = false;
						}
					},
					fail: (chooseErr) => {
						console.error('选择图片失败:', chooseErr);
						uni.showToast({
							title: '选择图片失败',
							icon: 'none'
						});
						this.uploading = false;
					}
				});
			},
			
			// 设置默认时间
			setDefaultTimes() {
				const now = new Date();
				// 开始时间默认为当前时间
				this.taskForm.startTime = now.getTime();
				// 截止时间默认为当前时间+7天
				const deadline = new Date(now);
				deadline.setDate(deadline.getDate() + 7);
				this.taskForm.deadline = deadline.getTime();
			},
			
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},
			
			// 确认开始时间
			confirmStartTime(e) {
				this.taskForm.startTime = e.value;
				this.showStartTimePicker = false;
			},
			
			// 确认截止时间
			confirmDeadline(e) {
				this.taskForm.deadline = e.value;
				this.showDeadlinePicker = false;
			},
			
			// 格式化日期时间显示
			formatDateTime(timestamp) {
				const date = new Date(timestamp);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				const hours = String(date.getHours()).padStart(2, '0');
				const minutes = String(date.getMinutes()).padStart(2, '0');
				return `${year}-${month}-${day} ${hours}:${minutes}`;
			},
			
			// 提交任务
			async submitTask() {
				// 表单验证
				if (!this.taskForm.content) {
					uni.showToast({
						title: '请输入任务标题',
						icon: 'none'
					});
					return;
				}
				
				if (!this.taskForm.startTime) {
					uni.showToast({
						title: '请选择开始时间',
						icon: 'none'
					});
					return;
				}
				
				if (!this.taskForm.deadline) {
					uni.showToast({
						title: '请选择截止时间',
						icon: 'none'
					});
					return;
				}
				
				if (this.taskForm.startTime >= this.taskForm.deadline) {
					uni.showToast({
						title: '开始时间必须早于截止时间',
						icon: 'none'
					});
					return;
				}
				
				// 显示加载状态
				this.submitLoading = true;
				
				try {
					// 检查是否有本地图片文件需要上传
					const imageFiles = this.imageMap.map(image => image.localPath).filter(path => path);
					
					uni.showLoading({
						title: '提交任务中...'
					});
					
					// 如果有图片需要上传，使用UploadUtils上传
					if (imageFiles.length > 0) {
						// 使用UploadUtils的uploadFilesArray方法上传文件
						const uploadResult = await UploadUtils.uploadFilesArray({
							url: '/group/groupTask/uploadMarkdown',
							filePaths: imageFiles,
							name: 'sources', // 图片文件使用字段名'sources'
							formData: {
								groupId: this.taskForm.groupId,
								content: this.taskForm.content,
								startTime: this.taskForm.startTime,
								deadline: this.taskForm.deadline,
								markdown: this.submissionContent
							},
							header: {
								'Authorization': `${uni.getStorageSync('token')}`
							},
							onProgress: (completed, total, res) => {
								// 可以在这里处理上传进度
								console.log(`上传进度: ${completed}/${total}`);
							}
						});
						// 检查上传结果
						// 修改状态码处理逻辑
						if (uploadResult && Array.isArray(uploadResult) && uploadResult.length > 0) {
							// 检查第一个结果的状态码
							const firstResult = uploadResult[0];
							console.log('上传结果:', firstResult);
							if (firstResult.data && firstResult.data.code === 200) {
								uni.showToast({
									title: '任务创建成功',
									icon: 'success'
								});
								
								// 返回上一页并刷新数据
								setTimeout(() => {
									const pages = getCurrentPages();
									if (pages.length >= 2) {
										const prevPage = pages[pages.length - 2];
										// 调用前一页的刷新方法（如果有的话）
										if (prevPage && typeof prevPage.$vm.loadTasks === 'function') {
											prevPage.$vm.loadTasks();
										}
										uni.navigateBack();
									} else {
										uni.switchTab({
											url: '/pages/index/index'
										});
									}
								}, 1500);
							} else {
								throw new Error(firstResult.data.msg || '任务创建失败');
							}
						} else {
							throw new Error('提交失败');
						}
					} else {
						// 没有图片需要上传，直接调用store中的uploadMarkdown方法
						const result = await this.uploadMarkdown(this.taskForm);
						
						// 修改状态码处理逻辑
						if (result && result.code === 200) {
							uni.showToast({
								title: '任务创建成功',
								icon: 'success'
							});
							
							// 返回上一页并刷新数据
							setTimeout(() => {
								const pages = getCurrentPages();
								if (pages.length >= 2) {
									const prevPage = pages[pages.length - 2];
									// 调用前一页的刷新方法（如果有的话）
									if (prevPage && typeof prevPage.$vm.loadTasks === 'function') {
										prevPage.$vm.loadTasks();
									}
									uni.navigateBack();
								} else {
									uni.switchTab({
										url: '/pages/index/index'
									});
								}
							}, 1500);
						} else {
							throw new Error(result.msg || '任务创建失败');
						}
					}
				} catch (error) {
					console.error('任务创建失败:', error);
					uni.showToast({
						title: error.message || '任务创建失败',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
					this.submitLoading = false;
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
.add-task-page {
	min-height: 100vh;
	background-color: #f5f7fb;
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
	justify-content: space-between;
	align-items: center;
}

.logo {
	display: flex;
	align-items: center;
	font-weight: 700;
	font-size: 1.4rem;
	color: white;
	cursor: pointer;
	padding: 5px 0; /* 增加点击区域 */
	
	span {
		margin-left: 8px;
	}
}

.header-actions {
	display: flex;
	gap: 15px;
}

.content {
	padding: 20px 15px;
}

.form-container {
	background: white;
	border-radius: 16px;
	padding: 20px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-section {
	margin-bottom: 25px;
	
	&:last-child {
		margin-bottom: 0;
	}
}

.title-section {
	margin-top: 10px;
	margin-bottom: 30px;
}

.section-title {
	font-size: 1.1rem;
	font-weight: 600;
	color: #212529;
	margin-bottom: 15px;
	padding-bottom: 8px;
	border-bottom: 2px solid #f8f9fa;
}

.form-item {
	margin-bottom: 20px;
	
	&:last-child {
		margin-bottom: 0;
	}
}

.title-input {
	::v-deep .u-input__input {
		font-size: 18px;
		font-weight: 600;
		color: #333 !important;
	}
	
	::v-deep .u-input__content {
		padding: 12px 15px;
	}
}

.time-item {
	margin-bottom: 15px;
	
	&:last-child {
		margin-bottom: 0;
	}
}

.time-label {
	display: block;
	margin-bottom: 8px;
	font-weight: 500;
	color: #495057;
}

.time-input-wrapper {
	width: 100%;
}

.input-with-icon {
	position: relative;
	display: flex;
	align-items: center;
	
	::v-deep .u-input {
		flex: 1;
	}
	
	.edit-icon {
		position: absolute;
		right: 10px;
		cursor: pointer;
		padding: 5px;
		border-radius: 4px;
		z-index: 10;
		
		&:hover {
			background-color: #f0f0f0;
		}
	}
}

/* Markdown编辑器样式 */
.editor-container {
	display: flex;
	flex-direction: column;
	min-height: 300px;
	height: 100%;
	flex: 1;
	position: relative;
}

/* 文本框容器样式 */
.textarea-container {
	flex: 1;
	min-height: 200px;
	border: 1px solid #e9ecef;
	border-radius: 8px;
	overflow: hidden;
	position: relative;
}



.submission-text {
	width: 100%;
	min-height: 100%; /* 确保文本框占满scroll-view */
	padding: 12px;
	font-size: 0.95rem;
	line-height: 1.5;
	background-color: #ffffff;
	transition: all 0.3s ease;
	border: none;
	outline: none;
	box-shadow: none;
	border-radius: 8px;
	box-sizing: border-box;
	resize: none;
	overflow-y: visible; /* 允许内容溢出，由scroll-view处理滚动 */
	white-space: pre-wrap; /* 支持换行符 */
	word-wrap: break-word; /* 自动换行 */
}

.submission-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
	padding: 8px 12px;
	background-color: #f8f9fa;
	border-radius: 8px;
	width: 100%;
	box-sizing: border-box;
	flex-shrink: 0;
}

.markdown-info {
	display: flex;
	align-items: center;
	gap: 5px;
}

.markdown-text {
	font-size: 0.85rem;
	color: #495057;
	font-weight: 500;
}

.submission-text {
	width: 100%;
	min-height: 100%; /* 确保文本框占满scroll-view */
	padding: 12px;
	font-size: 0.95rem;
	line-height: 1.5;
	background-color: #ffffff;
	transition: all 0.3s ease;
	border: none;
	outline: none;
	box-shadow: none;
	border-radius: 8px;
	box-sizing: border-box;
	resize: none;
	overflow-y: visible; /* 允许内容溢出，由scroll-view处理滚动 */
}

/* 图片功能栏样式 */
.image-toolbar {
	display: flex;
	align-items: center;
	padding: 10px 0;
	border-top: 1px solid #e9ecef;
	margin-top: 10px;
	background-color: #ffffff;
	z-index: 999;
	transition: bottom 0.3s ease;
	box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1); /* 添加阴影以更好地分隔 */
}
	
.toolbar-icon {
	margin-right: 8px;
	cursor: pointer;
	padding: 0 20px;
}

.toolbar-text {
	font-size: 0.9rem;
	color: #4361ee;
	cursor: pointer;
}
</style>