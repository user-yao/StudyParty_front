<template>
	<view class="container">
		<!-- 顶部导航 -->
		<header class="app-header">
			<div class="header-top">
				<div class="logo">
					<u-icon name="arrow-left" size="24" color="#ffffff" @click="goBack"></u-icon>
					<span>作业详情</span>
				</div>
			</div>
		</header>

		<!-- 内容区域 -->
		<div class="content-container">
			<!-- 白色背景容器 -->
			<div class="white-background">
				<scroll-view class="content-scroll" scroll-y="true" enable-flex="true">
					<div class="content">
						<!-- 成员信息 -->
						<div class="member-info-section" v-if="currentAnswer">
							<div class="member-info">
								<u-avatar :src="imageUrl+currentAnswer.userAvatar || '/static/default-avatar.png'" size="50"></u-avatar>
								<div class="member-details">
									<div class="member-name">{{ currentAnswer.userName }}</div>
									<div class="member-role" :class="getRoleClass(currentAnswer)">
										{{ getRoleText(currentAnswer) }}
									</div>
									<div class="submit-time">{{ formatDateTime(currentAnswer.submitTime) }}</div>
								</div>
								<div class="answer-status" :class="getAnswerStatusClass(currentAnswer)">
									{{ getAnswerStatusText(currentAnswer) }}
								</div>
							</div>
							
							<!-- 得分信息 -->
							<div class="score-info" v-if="currentAnswer.score !== -1">
								<u-icon name="star" size="20" color="#FFD700"></u-icon>
								<span class="score-text">得分: {{ currentAnswer.score }}</span>
							</div>
						</div>

						<!-- 作业内容 -->
						<div class="answer-content-section">
							<h3 class="section-title">作业内容</h3>
							<hr class="section-divider" />
							<div class="answer-content">
								<u-markdown :content="currentAnswer.context" :previewImg="true" theme="light"
									:showLineNumber="false">
								</u-markdown>
							</div>
						</div>

						<!-- 打分区域 -->
						<div class="scoring-section" v-if="canScore">
							<h3 class="section-title">作业评分</h3>
							<hr class="section-divider" />
							<div class="scoring-form">
								<div class="score-input">
									<u-input v-model="score" type="number" placeholder="请输入分数(0-100)" 
										:disabled="submitting" />
								</div>
								<div class="score-actions">
									<u-button type="primary" :disabled="submitting" @click="submitScore">
										{{ submitting ? '提交中...' : (currentAnswer.score === -1 ? '提交分数' : '重新评分') }}
									</u-button>
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
			answerId: null,
			currentAnswer: null,
			score: '',
			submitting: false
		};
	},
	computed: {
		...mapState('user', ['userInfo']),
		// 判断是否可以评分（老师或企业用户）
		canScore() {
			if (!this.userInfo) return false;
			// status字段值含义：1表示学生，2表示老师，3表示企业
			return this.userInfo.status === 2 || this.userInfo.status === 3;
		},
        imageUrl() { 
            return imageUrl;
        }
	},
	methods: {
		...mapActions('groupTaskAnswer', ['scoreTaskAnswer']),
		
		// 返回上一页
		goBack() {
			uni.navigateBack();
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

		// 提交分数
		async submitScore() {
			if (!this.score || isNaN(this.score) || this.score < 0 || this.score > 100) {
				uni.showToast({
					title: '请输入有效的分数(0-100)',
					icon: 'none'
				});
				return;
			}

			uni.showModal({
				title: '确认提交',
				content: `确定要${this.currentAnswer.score === -1 ? '提交分数' : '重新评分'}为${this.score}分吗？`,
				success: async (res) => {
					if (res.confirm) {
						try {
							this.submitting = true;
							const res = await this.scoreTaskAnswer({
								groupTaskAnswerId: this.answerId,
								score: parseInt(this.score)
							});

							if (res.code === 200) {
								uni.showToast({
									title: '评分成功',
									icon: 'success'
								});

								// 更新当前答案的分数
								this.currentAnswer.score = parseInt(this.score);
							} else {
								throw new Error(res.msg || '评分失败');
							}
						} catch (error) {
							console.error('评分失败:', error);
							uni.showToast({
								title: error.message || '评分失败',
								icon: 'none'
							});
						} finally {
							this.submitting = false;
						}
					}
				}
			});
		}
	},

	// 页面加载时获取参数
	onLoad(options) {
		if (options.answer) {
			// 解析传递的answer对象
			this.currentAnswer = JSON.parse(decodeURIComponent(options.answer));
			this.answerId = this.currentAnswer.id;
		}
	}
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

.member-info-section {
	background-color: #f8f9fa;
	border-radius: 8px;
	padding: 15px;
	margin-bottom: 20px;
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
	font-size: 1.1rem;
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

.score-info {
	display: flex;
	align-items: center;
	gap: 5px;
	font-size: 1rem;
	color: #495057;
	margin-top: 10px;
	padding-top: 10px;
	border-top: 1px dashed #e9ecef;
}

.score-text {
	font-weight: 500;
}

.answer-content-section {
	margin-bottom: 20px;
}

.answer-content {
	background-color: #ffffff;
	border-radius: 8px;
	padding: 15px;
	border: 1px solid #e9ecef;
}

.scoring-section {
	margin-bottom: 20px;
}

.scoring-form {
	background-color: #ffffff;
	border-radius: 8px;
	padding: 15px;
	border: 1px solid #e9ecef;
}

.score-input {
	margin-bottom: 15px;
}

.score-actions {
	text-align: center;
}

::v-deep .u-button {
	width: 100%;
}
</style>