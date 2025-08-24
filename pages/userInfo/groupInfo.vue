<template>
	<view>
		<div class="body">
			<!-- 顶部导航 -->
			<header class="app-header">
				<div class="header-top">
					<div class="logo">
						<i class="u-icon-arrow-left" @click="goBack"></i>
						<span>小组详情</span>
					</div>
					<div class="header-actions">
						<i class="u-icon-chat" @click="goToChat"></i>
						<i class="u-icon-more"></i>
					</div>
				</div>
			</header>

			<!-- 内容区域 -->
			<div class="content">
				<!-- 小组基本信息卡片 -->
				<div class="group-profile-card">
					<div class="group-avatar">
						<span v-if="!groupDetail.head">{{ groupDetail.groupName ? groupDetail.groupName.charAt(0) : '?' }}</span>
						<img v-else :src="getGroupAvatar()" :alt="groupDetail.groupName">
					</div>
					<h2 class="group-name">{{ groupDetail.groupName }}</h2>
					<div class="group-level">Lv.{{ groupDetail.groupLevel }}</div>
					<div class="group-slogan">{{ groupDetail.slogan || '暂无小组口号' }}</div>

					<div class="progress-bar">
						<div class="progress-fill"
							:style="{width: `${(groupDetail.experience / groupDetail.needExperience) * 100}%`}"></div>
					</div>

					<div class="group-stats">
						<div class="stat-item">
							<div class="stat-value">{{ groupDetail.experience }}</div>
							<div class="stat-label">经验值</div>
						</div>
						<div class="stat-item">
							<div class="stat-value">{{ groupDetail.peopleNum }}/{{ groupDetail.maxPeopleNum }}</div>
							<div class="stat-label">成员</div>
						</div>
						<div class="stat-item">
							<div class="stat-value">{{ memberContribution }}</div>
							<div class="stat-label">我的贡献</div>
						</div>
					</div>
				</div>

				<!-- 小组信息卡片 -->
				<div class="info-card">
					<div class="card-header">
						<div class="card-title">
							<i class="u-icon-info-circle"></i>
							<span>小组信息</span>
						</div>
					</div>
					<div class="info-content">
						<div class="info-item">
							<div class="info-label">组长:</div>
							<div class="info-value">{{ getLeaderName() }}</div>
						</div>
						<div class="info-item">
							<div class="info-label">代理组长:</div>
							<div class="info-value">{{ getDeputyName() }}</div>
						</div>
						<div class="info-item">
							<div class="info-label">负责老师:</div>
							<div class="info-value">{{ groupDetail.teacher || '暂无' }}</div>
						</div>
						<div class="info-item">
							<div class="info-label">负责企业:</div>
							<div class="info-value">{{ groupDetail.enterprise || '暂无' }}</div>
						</div>
						<div class="info-item">
							<div class="info-label">创建时间:</div>
							<div class="info-value">{{ formatDate(groupDetail.createTime) }}</div>
						</div>
						<div class="info-item">
							<div class="info-label">小组规则:</div>
							<div class="info-value">{{ groupDetail.rule || '暂无小组规则' }}</div>
						</div>
					</div>
				</div>

				<!-- 小组成员卡片 -->
				<div class="info-card">
					<div class="card-header">
						<div class="card-title">
							<i class="u-icon-users"></i>
							<span>小组成员 ({{ groupDetail.peopleNum }})</span>
						</div>
						<div class="view-more">
							<a href="#" class="view-more-btn" @click="viewAllMembers">
								查看全部 <i class="u-icon-arrow-right"></i>
							</a>
						</div>
					</div>
					<div class="members-grid">
						<div v-if="displayedMembers.length === 0" class="empty-state members-empty">
							<div class="empty-icon">
								<i class="u-icon-users"></i>
							</div>
							<div class="empty-text">暂无成员数据</div>
						</div>
						<div v-else class="member-item" v-for="(member, index) in displayedMembers" :key="member.id || index">
							<div class="member-avatar" @click="goToUserInfo(member)">
								<span v-if="!member.head">{{ member.name ? member.name.charAt(0) : '?' }}</span>
								<img v-else :src="imageUrl + member.head" :alt="member.name" />
							</div>
							<div class="member-name">{{ member.name || '未知用户' }}</div>
							<div class="member-role">{{ getMemberRole(member) }}</div>
						</div>
					</div>
				</div>

				<!-- 小组任务卡片 -->
				<div class="info-card">
					<div class="card-header">
						<div class="card-title">
							<i class="u-icon-task"></i>
							<span>小组任务</span>
						</div>
						<div class="view-more">
							<a href="#" class="view-more-btn" @click="viewAllTasks">
								查看全部 <i class="u-icon-arrow-right"></i>
							</a>
						</div>
					</div>
					<div class="task-list">
						<div v-if="displayedTasks.length === 0" class="empty-state">
							<div class="empty-icon">
								<i class="u-icon-file-text"></i>
							</div>
							<div class="empty-text">暂无任务数据</div>
						</div>
						<div v-else class="task-item" v-for="(task, index) in displayedTasks" :key="task.id || index"
							@click="viewTaskDetails(task)">
							<div class="task-icon">
								<image :src="getTaskStatusIcon(task)" alt="任务状态" class="task-status-icon"></image>
							</div>
							<div class="task-info">
								<div class="task-title">{{ task.groupTask || task.group_task || task.title || '未命名任务' }}</div>
								<div class="task-progress">
									完成:
									{{ task.groupTaskFinish || task.group_task_finish || 0 }}/{{ (task.groupTaskFinish || task.group_task_finish || 0) + (task.groupTaskUnfinished || task.group_task_unfinished || 0) }}
								</div>
							</div>
							<div class="task-actions">
								<i class="u-icon-arrow-right"></i>
							</div>
						</div>
					</div>
				</div>

				<!-- 选项列表 -->
				<div class="options-list">
					<!-- 组长专属选项 -->
					<div class="option-item" v-if="isLeader" @click="editGroupInfo">
						<div class="option-icon">
							<i class="u-icon-edit"></i>
						</div>
						<div class="option-content">
							<div class="option-title">编辑小组信息</div>
							<div class="option-desc">修改小组口号和规则</div>
						</div>
						<div class="option-arrow">
							<i class="u-icon-arrow-right"></i>
						</div>
					</div>

					<div class="option-item" v-if="isLeader" @click="changeDeputy">
						<div class="option-icon">
							<i class="u-icon-user-switch"></i>
						</div>
						<div class="option-content">
							<div class="option-title">更换代理组长</div>
							<div class="option-desc">每周一轮换制度</div>
						</div>
						<div class="option-arrow">
							<i class="u-icon-arrow-right"></i>
						</div>
					</div>

					<div class="option-item" v-if="isLeader && (!groupDetail.teacher || !groupDetail.enterprise)"
						@click="inviteTeacherOrEnterprise">
						<div class="option-icon">
							<i class="u-icon-user-add"></i>
						</div>
						<div class="option-content">
							<div class="option-title">邀请老师/企业</div>
							<div class="option-desc">从好友列表邀请</div>
						</div>
						<div class="option-arrow">
							<i class="u-icon-arrow-right"></i>
						</div>
					</div>

					<div class="option-item" v-if="isLeader" @click="transferGroup">
						<div class="option-icon">
							<i class="u-icon-swap"></i>
						</div>
						<div class="option-content">
							<div class="option-title">转让小组</div>
							<div class="option-desc">将组长身份转让给其他成员</div>
						</div>
						<div class="option-arrow">
							<i class="u-icon-arrow-right"></i>
						</div>
					</div>

					<div class="option-item" v-if="!isLeader" @click="leaveGroup">
						<div class="option-icon">
							<i class="u-icon-exit"></i>
						</div>
						<div class="option-content">
							<div class="option-title">退出小组</div>
							<div class="option-desc">离开当前小组</div>
						</div>
						<div class="option-arrow">
							<i class="u-icon-arrow-right"></i>
						</div>
					</div>

					<div class="option-item" @click="viewAllTasks">
						<div class="option-icon">
							<i class="u-icon-task"></i>
						</div>
						<div class="option-content">
							<div class="option-title">查看所有任务</div>
							<div class="option-desc">浏览小组全部任务</div>
						</div>
						<div class="option-arrow">
							<i class="u-icon-arrow-right"></i>
						</div>
					</div>

					<div class="option-item" @click="viewAllMembers">
						<div class="option-icon">
							<i class="u-icon-users"></i>
						</div>
						<div class="option-content">
							<div class="option-title">查看所有成员</div>
							<div class="option-desc">浏览小组全部成员</div>
						</div>
						<div class="option-arrow">
							<i class="u-icon-arrow-right"></i>
						</div>
					</div>
				</div>

				<!-- 操作按钮区域 -->
				<div class="action-buttons">
					<button class="btn btn-primary" @click="goToChat">
						<i class="u-icon-chat"></i> 小组聊天
					</button>

					<button class="btn btn-warning" v-if="isLeader" @click="dissolveGroup">
						<i class="u-icon-delete"></i> 解散小组
					</button>
				</div>
			</div>

			<!-- 编辑小组信息模态框 -->
			<div class="modal-mask" v-if="showEditModal">
				<div class="modal-container">
					<div class="modal-header">
						<div class="modal-title">编辑小组信息</div>
						<div class="modal-close" @click="showEditModal = false">×</div>
					</div>
					<div class="modal-body">
						<div class="form-group">
							<label class="form-label">小组口号</label>
							<textarea class="form-textarea" v-model="editSlogan" placeholder="请输入小组口号..."></textarea>
						</div>
						<div class="form-group">
							<label class="form-label">小组规则</label>
							<textarea class="form-textarea" v-model="editRule" placeholder="请输入小组规则..."></textarea>
						</div>
					</div>
					<div class="modal-footer">
						<button class="modal-btn modal-btn-cancel" @click="showEditModal = false">取消</button>
						<button class="modal-btn modal-btn-submit" @click="saveGroupInfo">保存</button>
					</div>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
import {
	imageUrl
} from "@/config/config.js";
import {
	mapState,
	mapMutations,
	mapActions,
	mapGetters
} from "vuex";
import { selectMyGroupTask } from "@/API/group/groupTask.js";
import { selectGroupUser } from "@/API/group/groupUser.js";

export default {
	data() {
		return {
			groupId: null, // 从参数传入的群组ID
			loading: false, // 加载状态
			error: null, // 错误信息
			memberContribution: 0, // 当前用户的贡献值
			// 小组成员数据（伴随后续集成）
			groupMembers: [],
			// 小组任务数据（伴随后续集成）
			groupTasks: [],
			// 模态框状态
			showEditModal: false,
			editSlogan: "",
			editRule: "",
			// 当前用户ID（后续从用户store获取）
			currentUserId: uni.getStorageSync('id') || 3
		}
	},
	onShow() {
		// 监听从其他页面传来的参数
		const eventChannel = this.getOpenerEventChannel();
		if (eventChannel) {
			eventChannel.on('chatData', (data) => {
				if (data && data.groupId) {
					this.groupId = data.groupId;
					this.loadGroupData();
				}
			});
		}
	},
	computed: {
		...mapGetters('group', ['getGroupById', 'groupList']),
		...mapState('group', ['currentGroup']),
		
		// 获取当前群组详情
		groupDetail() {
			let group = null;
			
			// 优先从 store 中获取
			if (this.groupId) {
				group = this.getGroupById(this.groupId);
			}
			// 如果 store 中没有，尝试从 currentGroup 获取
			if (!group && this.currentGroup) {
				group = this.currentGroup;
			}
			
			if (group) {
				const formattedGroup = this.formatGroupData(group);
				
				// 如果 API 没有返回组长名称，从成员列表中查找
				if (!formattedGroup.leaderName && formattedGroup.leader && this.groupMembers.length > 0) {
					const leader = this.groupMembers.find(member => member.id === formattedGroup.leader);
					if (leader) {
						formattedGroup.leaderName = leader.name;
					}
				}
				
				// 如果 API 没有返回代理组长名称，从成员列表中查找
				if (!formattedGroup.deputyName && formattedGroup.deputy && this.groupMembers.length > 0) {
					const deputy = this.groupMembers.find(member => member.id === formattedGroup.deputy);
					if (deputy) {
						formattedGroup.deputyName = deputy.name;
					}
				}
				
				return formattedGroup;
			}
			
			// 默认空对象
			return {
				id: null,
				groupName: '加载中...',
				groupLevel: 1,
				experience: 0,
				needExperience: 100,
				peopleNum: 0,
				maxPeopleNum: 10,
				slogan: '',
				rule: '',
				head: '',
				createTime: '',
				canJoin: 1,
				teacher: null,
				enterprise: null,
				leader: null,
				leaderName: '',
				deputy: null,
				deputyName: '',
				deputyTime: ''
			};
		},
		
		// 图片基础URL
		imageUrl() {
			return imageUrl;
		},
		
		// 判断当前用户是否是组长
		isLeader() {
			return this.groupDetail.leader === this.currentUserId;
		},
		
		// 显示前6个成员
		displayedMembers() {
			return this.groupMembers.slice(0, 6);
		},
		
		// 显示前3个任务（按照规范只显示任务题目）
		displayedTasks() {
			const tasks = this.groupTasks.slice(0, 3);
			console.log('当前显示任务:', tasks.length, '/', this.groupTasks.length);
			return tasks;
		}
	},
	methods: {
		...mapActions('group', ['selectGroupById']),
		// 直接引用 selectMyGroupTask
		// ...mapActions('groupTask', ['selectMyGroupTask']),
		
		// 加载群组数据
		async loadGroupData() {
			if (!this.groupId) {
				uni.showToast({ title: '缺少群组ID', icon: 'none' });
				return;
			}
			
			try {
				this.loading = true;
				this.error = null;
				
				// 加载群组详情
				const groupRes = await this.selectGroupById({ groupId: this.groupId });
				if (groupRes.code === 200) {
					console.log('群组详情加载成功:', groupRes.data);
				} else {
					this.error = '群组详情加载失败';
				}
				
				// 加载群组任务
				try {
					const taskRes = await selectMyGroupTask({ groupId: this.groupId, currentPage: 1 });
					if (taskRes.code === 200) {
						this.groupTasks = taskRes.data.records || [];
						console.log('群组任务加载成功:', this.groupTasks.length, '个任务');
					}
				} catch (e) {
					console.error('任务加载失败:', e);
				}
				
				// 加载群组成员
				try {
					const memberRes = await selectGroupUser({ groupId: this.groupId });
					if (memberRes.code === 200) {
						this.groupMembers = memberRes.data || [];
						console.log('群组成员加载成功:', this.groupMembers.length, '个成员');
					}
				} catch (e) {
					console.error('成员加载失败:', e);
				}
				
			} catch (error) {
				console.error('加载群组数据失败:', error);
				this.error = '网络错误，请稍后重试';
			} finally {
				this.loading = false;
			}
		},
		
		// 格式化群组数据
		formatGroupData(rawData) {
			if (!rawData) return null;
			return {
				id: rawData.id,
				groupName: rawData.groupName || '未命名小组',
				groupLevel: rawData.groupLevel || 1,
				experience: rawData.experience || 0,
				needExperience: rawData.needExperience || 100,
				peopleNum: rawData.peopleNum || 0,
				maxPeopleNum: rawData.maxPeopleNum || 10,
				slogan: rawData.slogan || '',
				rule: rawData.rule || '',
				head: rawData.head || '',
				createTime: rawData.createTime || '',
				canJoin: rawData.canJoin || 1,
				teacher: rawData.teacher || null,
				enterprise: rawData.enterprise || null,
				leader: rawData.leader || null,
				leaderName: rawData.leaderName || '',
				deputy: rawData.deputy || null,
				deputyName: rawData.deputyName || '',
				deputyTime: rawData.deputyTime || ''
			};
		},
		
		// 返回上一页
		goBack() {
			uni.navigateBack({ delta: 1 });
		},
		
		// 获取成员角色文本
		getMemberRole(member) {
			if (!member) return '成员';
			
			// 根据成员ID判断角色
			if (member.id === this.groupDetail.leader) return '组长';
			if (member.id === this.groupDetail.deputy) return '代理组长';
			
			// 如果有role字段，使用role字段
			if (member.role) {
				if (member.role === 'leader') return '组长';
				if (member.role === 'deputy') return '代理组长';
			}
			
			return '成员';
		},
		
		// 查看所有成员
		viewAllMembers() {
			console.log("查看所有成员");
			uni.showToast({ title: '功能开发中', icon: 'none' });
		},
		
		// 查看所有任务
		viewAllTasks() {
			uni.navigateTo({
				url: '/pages/chatList/groupTaskList',
				success: (res) => {
					res.eventChannel.emit("chatData", { groupId: this.groupId });
				}
			});
		},
		
		// 查看任务详情
		viewTaskDetails(task) {
			console.log("查看任务详情:", task);
			uni.showToast({ title: '功能开发中', icon: 'none' });
		},
		
		// 进入聊天页面
		goToChat() {
			if (!this.groupDetail.id) {
				uni.showToast({ title: '群组信息加载中', icon: 'none' });
				return;
			}
			
			// chat 参数：只包含 statu 字段，值为 'group'
			const chat = {
				statu: 'group'
			};
			
			// friend 参数：传递 group 的数据
			const friend = {
				friendId: this.groupDetail.id, // 群组ID作为friendId
				...this.groupDetail // 展开群组的所有数据
			};
			
			uni.navigateTo({
				url: '/pages/chatList/chatPage',
				success: (res) => {
					res.eventChannel.emit("chatData", {
						chat,
						friend
					});
				},
				fail: (err) => {
					console.error('跳转聊天页面失败:', err);
					uni.showToast({ title: '跳转失败', icon: 'none' });
				}
			});
		},
		
		// 编辑小组信息
		editGroupInfo() {
			this.editSlogan = this.groupDetail.slogan;
			this.editRule = this.groupDetail.rule;
			this.showEditModal = true;
		},
		
		// 保存小组信息
		saveGroupInfo() {
			this.showEditModal = false;
			uni.showToast({ title: '功能开发中', icon: 'none' });
		},
		
		// 其他方法（简化处理）
		changeDeputy() { uni.showToast({ title: '功能开发中', icon: 'none' }); },
		inviteTeacherOrEnterprise() { uni.showToast({ title: '功能开发中', icon: 'none' }); },
		transferGroup() { uni.showToast({ title: '功能开发中', icon: 'none' }); },
		dissolveGroup() {
			uni.showModal({
				title: '确认解散',
				content: '确定要解散小组吗？',
				success: (res) => {
					if (res.confirm) uni.showToast({ title: '功能开发中', icon: 'none' });
				}
			});
		},
		leaveGroup() {
			uni.showModal({
				title: '确认退出',
				content: '确定要退出小组吗？',
				success: (res) => {
					if (res.confirm) uni.showToast({ title: '功能开发中', icon: 'none' });
				}
			});
		},
		
		// 格式化日期显示
		formatDate(dateStr) {
			if (!dateStr) return '未知日期';
			return dateStr.toString().split(' ')[0];
		},
		
		// 获取群组头像
		getGroupAvatar() {
			if (this.groupDetail.head) {
				return this.imageUrl + this.groupDetail.head;
			}
			return '';
		},
		
		// 获取任务状态图标
		getTaskStatusIcon(task) {
			console.log(task);
			if (!task) return '/static/groupInfo/dengdai.png';
			
			// 获取任务开始时间和结束时间
			const startTime = task.groupTaskStartTime || task.group_task_start_time;
			const endTime = task.groupTaskLastTime || task.group_task_last_time;
			const currentTime = new Date();
			
			// 如果没有时间信息，默认为等待状态
			if (!startTime) {
				return '/static/groupInfo/dengdai.png';
			}
			
			// 将时间字符串转换为 Date 对象
			const taskStartTime = new Date(startTime);
			const taskEndTime = endTime ? new Date(endTime) : null;
			console.log(currentTime<taskEndTime);
			console.log(currentTime);
			// 判断任务状态
			if (currentTime < taskStartTime) {
				// 当前时间小于开始时间，任务未开始（等待）
				return '/static/groupInfo/dengdai.png';
			} else if (taskEndTime && currentTime > taskEndTime) {
				// 当前时间大于结束时间，任务已结束
				return '/static/groupInfo/jieshu.png';
			} else {
				// 当前时间在开始时间之后，任务进行中
				// 如果没有结束时间或在结束时间之前，都认为是进行中
				return '/static/groupInfo/jinxingzhong.png';
			}
		},
		
		// 跳转到用户信息页面
		goToUserInfo(member) {
			if (!member || !member.id) {
				uni.showToast({ title: '用户信息不存在', icon: 'none' });
				return;
			}
			
			uni.navigateTo({
				url: '/pages/userInfo/userInfo',
				success: (res) => {
					res.eventChannel.emit('chatData', {
						id: member.id
					});
				},
				fail: (err) => {
					console.error('跳转失败:', err);
					uni.showToast({ title: '跳转失败', icon: 'none' });
				}
			});
		},
		
		// 获取组长姓名
		getLeaderName() {
			// 先检查 groupDetail 中是否有 leaderName
			if (this.groupDetail.leaderName) {
				return this.groupDetail.leaderName;
			}
			
			// 如果没有，通过 leader ID 从成员列表中查找
			if (this.groupDetail.leader && this.groupMembers.length > 0) {
				const leader = this.groupMembers.find(member => member.id === this.groupDetail.leader);
				if (leader && leader.name) {
					return leader.name;
				}
			}
			
			return '未知';
		},
		
		// 获取代理组长姓名
		getDeputyName() {
			// 先检查 groupDetail 中是否有 deputyName
			if (this.groupDetail.deputyName) {
				return this.groupDetail.deputyName;
			}
			
			// 如果没有，通过 deputy ID 从成员列表中查找
			if (this.groupDetail.deputy && this.groupMembers.length > 0) {
				const deputy = this.groupMembers.find(member => member.id === this.groupDetail.deputy);
				if (deputy && deputy.name) {
					return deputy.name;
				}
			}
			
			return '暂无';
		}
	},
	
	mounted() {
		this.editSlogan = this.groupDetail.slogan || '';
		this.editRule = this.groupDetail.rule || '';
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
		gap: 15px;
	}

	.header-actions i {
		font-size: 1.3rem;
		cursor: pointer;
	}

	/* 内容区域 */
	.content {
		flex: 1;
		padding: 20px;
		overflow-y: auto;
		padding-bottom: 70px;
	}

	/* 小组基本信息卡片 */
	.group-profile-card {
		background: white;
		border-radius: 16px;
		padding: 20px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		margin-bottom: 20px;
		text-align: center;
	}

	.group-avatar {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		margin: 0 auto 15px;
		border: 4px solid var(--light);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		background: linear-gradient(45deg, var(--accent), var(--success));
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 2rem;
		font-weight: bold;
		overflow: hidden;
	}

	.group-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.group-name {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 5px;
	}

	.group-level {
		display: inline-block;
		background: var(--light);
		padding: 4px 12px;
		border-radius: 20px;
		font-size: 0.9rem;
		margin-bottom: 15px;
		color: var(--primary);
		font-weight: 500;
	}

	.group-slogan {
		font-style: italic;
		color: var(--primary);
		margin-bottom: 15px;
		padding: 10px;
		background: rgba(67, 97, 238, 0.05);
		border-radius: 8px;
	}

	.group-stats {
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
		font-size: 1.2rem;
		font-weight: 700;
		color: var(--primary);
		margin-bottom: 5px;
	}

	.stat-label {
		font-size: 0.85rem;
		color: var(--gray);
	}

	.progress-bar {
		height: 8px;
		background: var(--light-gray);
		border-radius: 4px;
		overflow: hidden;
		margin: 15px 0;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--accent), var(--success));
		border-radius: 4px;
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

	.card-actions {
		display: flex;
		gap: 10px;
	}

	.action-icon {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--light);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--primary);
		cursor: pointer;
	}

	.info-content {
		margin-bottom: 15px;
	}

	.info-item {
		display: flex;
		margin-bottom: 12px;
	}

	.info-label {
		min-width: 80px;
		font-size: 0.9rem;
		color: var(--gray);
	}

	.info-value {
		flex: 1;
		font-weight: 500;
	}

	/* 成员列表 */
	.members-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 15px;
	}

	.member-item {
		text-align: center;
	}

	.member-avatar {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: linear-gradient(45deg, var(--accent), var(--success));
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: bold;
		margin: 0 auto 8px;
		font-size: 1.2rem;
		overflow: hidden;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
	}
	
	.member-avatar:hover {
		transform: scale(1.05);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}
	
	.member-avatar:active {
		transform: scale(0.95);
	}
	
	.member-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.member-name {
		font-size: 0.9rem;
		font-weight: 500;
		margin-bottom: 3px;
	}

	.member-role {
		font-size: 0.75rem;
		color: var(--gray);
	}

	.view-more {
		text-align: center;
		margin-top: 15px;
	}

	.view-more-btn {
		color: var(--primary);
		font-size: 0.9rem;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 5px;
	}

	/* 任务列表 */
	.task-list {
		display: grid;
		grid-template-columns: 1fr;
		gap: 15px;
	}
	
	/* 空状态样式 */
	.empty-state {
		text-align: center;
		padding: 40px 20px;
		color: var(--gray);
	}
	
	.empty-state .empty-icon {
		font-size: 3rem;
		margin-bottom: 15px;
		opacity: 0.5;
	}
	
	.empty-state .empty-text {
		font-size: 0.9rem;
		line-height: 1.5;
	}
	
	.members-empty {
		grid-column: 1 / -1;
		padding: 30px 20px;
	}

	.task-item {
		background: var(--light);
		border-radius: 12px;
		padding: 15px;
		display: flex;
		align-items: center;
	}

	.task-icon {
		width: 40px;
		height: 40px;
		border-radius: 10px;
		background: var(--primary);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		margin-right: 12px;
		font-size: 1.1rem;
		overflow: hidden;
	}
	
	.task-status-icon {
		width: 24px;
		height: 24px;
		object-fit: contain;
	}

	.task-info {
		flex: 1;
	}

	.task-title {
		font-weight: 600;
		margin-bottom: 5px;
	}

	.task-progress {
		font-size: 0.85rem;
		color: var(--gray);
	}

	.task-actions {
		display: flex;
		gap: 10px;
	}

	/* 选项列表样式 */
	.options-list {
		background: white;
		border-radius: 16px;
		overflow: hidden;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		margin-bottom: 20px;
	}

	.option-item {
		display: flex;
		align-items: center;
		padding: 16px 20px;
		border-bottom: 1px solid var(--light-gray);
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.option-item:last-child {
		border-bottom: none;
	}

	.option-item:hover {
		background-color: #f8f9ff;
	}

	.option-icon {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: var(--light);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--primary);
		margin-right: 15px;
		font-size: 1.1rem;
	}

	.option-content {
		flex: 1;
	}

	.option-title {
		font-weight: 500;
		margin-bottom: 3px;
	}

	.option-desc {
		font-size: 0.85rem;
		color: var(--gray);
	}

	.option-arrow {
		color: var(--gray);
	}

	/* 操作按钮区域 */
	.action-buttons {
		display: grid;
		grid-template-columns: 1fr;
		gap: 15px;
		margin-top: 20px;
	}

	.btn {
		padding: 12px;
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
		gap: 8px;
	}

	.btn-primary {
		background: var(--primary);
		color: white;
	}

	.btn-warning {
		background: var(--warning);
		color: white;
	}

	.btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	/* 模态框样式 */
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

	/* 响应式调整 */
	@media (max-width: 480px) {
		.content {
			padding: 15px;
		}

		.group-avatar {
			width: 70px;
			height: 70px;
			font-size: 1.8rem;
		}

		.group-stats {
			grid-template-columns: repeat(3, 1fr);
			gap: 10px;
		}

		.members-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 10px;
		}

		.member-avatar {
			width: 45px;
			height: 45px;
			font-size: 1rem;
		}

		.option-item {
			padding: 14px 16px;
		}

		.option-icon {
			width: 32px;
			height: 32px;
			font-size: 1rem;
			margin-right: 12px;
		}
	}
</style>