<template>
	<view class="container">
		<!-- 顶部导航 -->
		<header class="app-header">
			<div class="header-top">
				<div class="logo">
					<u-icon name="arrow-left" size="24" color="#ffffff" @click="goBack"></u-icon>
					<span>成员作业</span>
				</div>
			</div>
		</header>

		<!-- 内容区域 -->
		<div class="content-container">
			<!-- 白色背景容器 -->
			<div class="white-background">
				<!-- 成员作业列表 -->
				<scroll-view class="content-scroll" scroll-y="true" enable-flex="true">
					<div class="content">
						<!-- 任务信息 -->
						<div class="task-info-section" v-if="taskDetail">
							<h3 class="section-title">{{ taskDetail.groupTask }}</h3>
							<div class="task-meta">
								<div class="task-meta-item">
									<u-icon name="calendar" size="16" color="#6c757d"></u-icon>
									<span>开始: {{ formatDate(taskDetail.groupTaskStartTime) }}</span>
								</div>
								<div class="task-meta-item">
									<u-icon name="clock" size="16" color="#6c757d"></u-icon>
									<span>截止: {{ formatDate(taskDetail.groupTaskLastTime) }}</span>
								</div>
							</div>
						</div>

						<!-- 成员作业列表 -->
						<div class="answers-list">
							<h3 class="section-title">成员提交列表</h3>
							<hr class="section-divider" />
							
							<!-- 加载状态 -->
							<div class="loading-state" v-if="loading">
								<u-loading-icon mode="circle"></u-loading-icon>
								<p>加载中...</p>
							</div>
							
							<!-- 空状态 -->
							<div class="empty-state" v-else-if="memberAnswers.length === 0">
								<u-icon name="file-text"  size="40" color="#adb5bd"></u-icon>
								<p>暂无成员提交作业</p>
							</div>
							
							<!-- 成员作业项 -->
							<div class="answer-item" v-else v-for="(answer, index) in memberAnswers" :key="index" @click="viewAnswerDetail(answer)">
								<div class="member-info">
									<u-avatar :src="imageUrl + answer.userAvatar || '/static/default-avatar.png'" size="40"></u-avatar>
									<div class="member-details">
										<div class="member-name">{{ answer.userName }}</div>
										<div class="member-role" :class="getRoleClass(answer)">
											{{ getRoleText(answer) }}
										</div>
										<div class="submit-time">{{ formatDateTime(answer.submitTime) }}</div>
									</div>
									<div class="answer-status" :class="getAnswerStatusClass(answer)">
										{{ getAnswerStatusText(answer) }}
									</div>
								</div>
								<!-- 不再显示作业内容预览 -->
								<div class="answer-score" v-if="answer.score !== -1">
									<u-icon name="star" size="16" color="#FFD700"></u-icon>
									<span>得分: {{ answer.score }}</span>
								</div>
							</div>
						</div>
					</div>
				</scroll-view>
			</div>
		</div>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { imageUrl } from '../../config/config';
export default {
	data() {
		return {
			taskId: null,
			groupId: null,
			localTaskDetail: null, // 添加本地任务详情变量
			memberAnswers: [],
			loading: false
		};
	},
	computed: {
		...mapState('user', ['userInfo']),
		...mapState('groupTask', ['currentTask']), // 映射groupTask模块的currentTask state
		...mapState('group', ['currentGroup']), // 映射group模块的currentGroup state
        imageUrl(){
            return imageUrl;
        },
		// 使用Vuex中的当前任务，如果没有则使用本地任务详情
		taskDetail() {
			return this.currentTask || this.localTaskDetail;
		}
	},
	methods: {
		...mapActions('groupTaskAnswer', ['getTaskAnswersByTaskId']),
		...mapActions('group', ['selectGroupById']), // 添加设置当前群组的action

		// 返回上一页
		goBack() {
			uni.navigateBack();
		},

		// 格式化日期显示
		formatDate(dateStr) {
			if (!dateStr) return '未知日期';
			const date = new Date(dateStr);
			if (isNaN(date.getTime())) return '无效日期';

			return date.getFullYear() + '-' +
				String(date.getMonth() + 1).padStart(2, '0') + '-' +
				String(date.getDate()).padStart(2, '0');
		},

		// 格式化日期时间显示
		formatDateTime(dateStr) {
			if (!dateStr) return '未知时间';
			const date = new Date(dateStr);
			if (isNaN(date.getTime())) return '无效时间';

			return date.getFullYear() + '-' +
				String(date.getMonth() + 1).padStart(2, '0') + '-' +
				String(date.getDate()).padStart(2, '0') + ' ' +
				String(date.getHours()).padStart(2, '0') + ':' +
				String(date.getMinutes()).padStart(2, '0');
		},

		// 获取用户角色文本
		getRoleText(answer) {
			// status字段值含义：1表示学生，2表示老师，3表示企业
			switch (answer.status) {
				case "1": return "学生";
				case "2": return "老师";
				case "3": return "企业";
				default: return "未知";
			}
		},

		// 获取用户角色类名
		getRoleClass(answer) {
			// status字段值含义：1表示学生，2表示老师，3表示企业
			switch (answer.status) {
				case "1": return "role-student";
				case "2": return "role-teacher";
				case "3": return "role-enterprise";
				default: return "role-unknown";
			}
		},

		// 获取答案状态文本
		getAnswerStatusText(answer) {
			// score为-1表示未批改，其他值表示已批改
			if (answer.score === -1) return '待批改';
			return '已批改';
		},

		// 获取答案状态类名
		getAnswerStatusClass(answer) {
			// score为-1表示未批改，其他值表示已批改
			if (answer.score === -1) return 'status-unchecked';
			return 'status-checked';
		},

		// 查看答案详情
		viewAnswerDetail(answer) {
			// 跳转到答案详情页面
			uni.navigateTo({
				url: `/pages/chatList/groupMemberAnswerDetail?answer=${encodeURIComponent(JSON.stringify(answer))}`
			});
		},

		// 加载成员答案列表
		async loadMemberAnswers() {
			if (!this.taskId) return;
			
			this.loading = true;
			try {
				const res = await this.getTaskAnswersByTaskId({ groupTaskId: this.taskId });
				if (res.code === 200) {
					// 根据返回的数据格式，需要映射字段名
					this.memberAnswers = (res.data || []).map(answer => {
						return {
							id: answer.id,
							groupTaskId: answer.groupTaskId,
							userId: answer.userId,
							context: answer.context,
							submitTime: answer.time, // 映射time字段为submitTime
							haveSource: answer.haveSource,
							score: answer.score, // score为-1表示未批改
							userName: answer.username, // 映射username字段为userName
							userAvatar: answer.head, // 映射head字段为userAvatar
							status: answer.status, // status是身份信息：1学生，2老师，3企业
							school: answer.school
						};
					});
				} else {
					throw new Error(res.msg || '加载失败');
				}
			} catch (error) {
				console.error('加载成员答案列表失败:', error);
				uni.showToast({
					title: error.message || '加载失败',
					icon: 'none'
				});
			} finally {
				this.loading = false;
			}
		}
	},
    onShow(){
		this.loadMemberAnswers();
    },
	// 页面加载时获取参数
	onLoad(options) {
		if (options.taskId) {
			this.taskId = options.taskId;
		}
		
		if (options.groupId) {
			this.groupId = options.groupId;
			
			// 设置当前群组
			this.selectGroupById({ groupId: this.groupId });
		}
		
		// 加载数据
		this.loadMemberAnswers();
	},
};
</script>

<style scoped>
.container {
	min-height: 100vh;
	background-color: #f5f7fb;
	display: flex;
	flex-direction: column;
	position: relative;
}

.app-header {
	background: linear-gradient(135deg, #4361ee, #3f37c9);
	color: white;
	padding: 15px 20px;
	padding-top: 5vh;
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
	margin-bottom: 15px;
}

.logo {
	display: flex;
	align-items: center;
	font-weight: 700;
	font-size: 1.4rem;
}

.logo u-icon {
	margin-right: 8px;
}

.content-container {
	flex: 1;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	min-height: 0;
}

.white-background {
	background-color: #ffffff;
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	min-height: 0;
}

.content-scroll {
	flex: 1;
	overflow-y: auto;
	min-height: calc(100vh - 300rpx);
}

.content {
	padding: 20px;
	min-height: 100%;
	position: relative;
}

.section-title {
	font-size: 1.1rem;
	font-weight: 600;
	color: #212529;
	flex: 1;
	margin-right: 20px;
	line-height: 1.5;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.section-divider {
	border: none;
	height: 1px;
	background-color: #e9ecef;
	margin: 0 0 15px 0;
	width: 100%;
}

.task-info-section {
	background-color: #f8f9fa;
	border-radius: 8px;
	padding: 15px;
	margin-bottom: 20px;
}

.task-meta {
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin-top: 10px;
	font-size: 0.9rem;
	color: #6c757d;
}

.task-meta-item {
	display: flex;
	align-items: center;
	gap: 8px;
}

.answers-list {
	margin-top: 20px;
}

.loading-state {
	text-align: center;
	padding: 40px 20px;
	color: #6c757d;
}

.loading-state u-loading-icon {
	margin-bottom: 15px;
}

.empty-state {
	text-align: center;
	padding: 40px 20px;
	color: #6c757d;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.empty-state u-icon {
	font-size: 2.5rem;
	margin-bottom: 15px;
	color: #adb5bd;
}

.answer-item {
	background-color: #ffffff;
	border: 1px solid #e9ecef;
	border-radius: 8px;
	padding: 15px;
	margin-bottom: 15px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.member-info {
	display: flex;
	align-items: center;
	margin-bottom: 10px;
}

.member-details {
	flex: 1;
	margin-left: 10px;
}

.member-name {
	font-weight: 500;
	color: #212529;
	margin-bottom: 2px;
}

.member-role {
	font-size: 0.75rem;
	padding: 2px 6px;
	border-radius: 4px;
	display: inline-block;
	margin-right: 8px;
}

.role-student {
	background-color: #e7f3ff;
	color: #1c7ed6;
}

.role-teacher {
	background-color: #fff0f6;
	color: #d6336c;
}

.role-enterprise {
	background-color: #f7fff0;
	color: #5c940d;
}

.role-unknown {
	background-color: #f8f9fa;
	color: #6c757d;
}

.submit-time {
	font-size: 0.8rem;
	color: #6c757d;
}

.answer-status {
	padding: 4px 10px;
	border-radius: 12px;
	font-size: 0.8rem;
	font-weight: 500;
	white-space: nowrap;
}

.status-checked {
	background: #d4edda;
	color: #155724;
}

.status-unchecked {
	background: #fff3cd;
	color: #856404;
}

.answer-score {
	display: flex;
	align-items: center;
	gap: 5px;
	font-size: 0.9rem;
	color: #495057;
	margin-top: 5px;
	padding-top: 5px;
	border-top: 1px dashed #e9ecef;
}
</style>