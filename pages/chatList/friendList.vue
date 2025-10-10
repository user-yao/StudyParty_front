<template>
	<view>
		<div class="body">
			<!-- 顶部导航 -->
			<header class="app-header">
				<div class="header-top">
					<div class="logo">
						<u-icon name="arrow-left" size="50rpx" color="#fff" bold @click="goBack"></u-icon>
						<span>{{ getHeaderTitle() }}</span>
					</div>
					<div class="header-actions" v-if="!selectMode">
						<u-icon name="plus" size="50rpx" color="#fff" bold @click="goToAddFriend"></u-icon>
						<i class="fas fa-ellipsis-v"></i>
					</div>
				</div>
				<div class="search-bar">
					<input style="color: #fff;" type="text" v-model="searchQuery" placeholder="搜索联系人...">
				</div>
				<!-- 身份筛选（仅在邀请老师或企业时显示） -->
				<div class="status-filter" v-if="selectMode && (inviteType === 'teacher' || inviteType === 'enterprise')">
					<u-tag 
						:text="inviteType === 'teacher' ? '仅显示老师' : '仅显示企业'" 
						type="primary" 
						size="mini" 
						plain>
					</u-tag>
				</div>
			</header>

			<!-- 联系人列表 -->
			<div class="contacts-container">
				<!-- 联系人分组 -->
				<template v-if="filteredGroups.length > 0">
					<div v-for="group in filteredGroups" :key="group.letter" :id="'group-'+group.letter">
						<div class="contact-group">
							<div class="group-header">
								{{ group.letter }}
							</div>
							<div class="contact-item" v-for="contact in group.contacts" :key="contact.id" >
								<image class="contact-avatar"  @click="handleContactClick(contact)" :src="imageUrl + contact.head" mode=""></image>
								<div class="contact-info" @click="handleContactClick(contact)">
									<div class="contact-name">{{ contact.remark == null?contact.name:contact.remark }}
										<span class='statuStudent' v-if="contact.status == 1">学生</span>
										<span class='statuTeacher' v-if="contact.status == 2">老师</span>
										<span class='statuEnterprise' v-if="contact.status == 3">企业</span>
									</div>
									<div class="contact-phone">{{ contact.phone }}</div>
								</div>
								<div class="contact-actions" v-if="!selectMode">
									<div class="action-icon" @click="toChatPage(contact)">
										<u-icon name="chat" size="25" color="#4895ef"></u-icon>
									</div>
								</div>
								<!-- 选择模式下的选中状态 -->
								<div class="contact-actions" v-if="selectMode">
									<div class="select-indicator" :class="{ selected: isSelected(contact.friendId) }">
										<u-icon :name="isSelected(contact.friendId) ? 'checkbox-mark' : 'minus'" size="20" :color="isSelected(contact.friendId) ? '#4361ee' : '#ccc'"></u-icon>
									</div>
								</div>
							</div>
						</div>
					</div>
				</template>

				<!-- 空状态 -->
				<div v-else class="empty-state">
					<i class="fas fa-user-slash"></i>
					<h3>未找到联系人</h3>
					<p>请尝试其他搜索关键词</p>
				</div>
			</div>
			
			<!-- 选择模式下的底部操作栏 -->
			<div v-if="selectMode" class="select-footer">
				<div class="selected-count">已选择 {{ selectedContacts.length }} 位{{ inviteType === 'teacher' ? '老师' : inviteType === 'enterprise' ? '企业' : '好友' }}</div>
				<u-button type="primary" :disabled="!canConfirmSelection" @click="confirmSelection">确定</u-button>
			</div>
		</div>
	</view>
</template>

<script>
	import { pinyin } from 'pinyin-pro';
	import {
		imageUrl
	} from "@/config/config.js";
	import {
		mapState,
		mapMutations,
		mapActions
	} from "vuex";
export default {
  data() {
    return {
      searchQuery: '',
      activeLetter: '',
      alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split(''),
	  friendList:[],
      contacts: [], // 将用于存储处理后的联系人数据
	  // 选择模式相关数据
	  selectMode: false,
	  groupId: null,
	  selectedContacts: [],
	  // 邀请类型和身份筛选
	  inviteType: 'friend', // friend, teacher, enterprise
	  statusFilter: null // 用于筛选老师(2)或企业(3)
    }
  },
  onLoad(options) {
	  // 检查是否为选择模式
	  if (options.selectMode === 'true') {
		  this.selectMode = true;
		  this.groupId = options.groupId || null;
		  this.inviteType = options.inviteType || 'friend';
		  this.statusFilter = options.status ? parseInt(options.status) : null;
	  }
  },
  onShow() {
  	this.friendLists().then(res=>{
  		this.friendList = res;
  		console.log(this.friendList)
  		console.log(res);
  		  // 将 friendList 转换为 contacts 并排序
  		  this.contacts = this.friendList
  		    .map(friend => ({
  		      ...friend,
  		      // 如果需要 phone 字段用于搜索，可添加默认值或从其他字段获取
  		      // phone: friend.phone || ''
  		    }))
  		    .sort((a, b) => { 
  		      const nameA = (a.remark || a.name).localeCompare((b.remark || b.name), 'zh');
  		      return nameA;
  		    });
  	})
  },
  computed: {
	  imageUrl() {
	  	return imageUrl
	  },
	  // 检查是否可以确认选择（邀请老师或企业时只能选择一人）
	  canConfirmSelection() {
		  if (this.inviteType === 'teacher' || this.inviteType === 'enterprise') {
			  return this.selectedContacts.length === 1;
		  }
		  return this.selectedContacts.length > 0;
	  },
    // 按字母分组联系人
    groupedContacts() {
      const groups = {};
      // 根据身份筛选过滤联系人
      const filteredContacts = this.statusFilter ? 
        this.contacts.filter(contact => {
          console.log('Contact object:', contact);
          console.log(`Checking contact: ${contact.name || contact.remark}, status: ${contact.status} (type: ${typeof contact.status}), expected status: ${this.statusFilter} (type: ${typeof this.statusFilter})`);
          // 使用宽松比较并确保两个值都是数字类型
          const contactStatus = Number(contact.status);
          const expectedStatus = Number(this.statusFilter);
          const match = contactStatus === expectedStatus;
          console.log(`After conversion - contactStatus: ${contactStatus}, expectedStatus: ${expectedStatus}, Match result: ${match}`);
          return match;
        }) : 
        this.contacts;
      filteredContacts.forEach(contact => {
        // 获取用于排序的名称：优先使用 remark，否则使用 name
        const displayName = contact.remark || contact.name;
        // 获取首字母（假设为中文，获取拼音首字母）
        const firstLetter = this.getPinyinInitial(displayName).toUpperCase();

        if (!groups[firstLetter]) {
          groups[firstLetter] = [];
        }

        groups[firstLetter].push(contact);
      });

      // 转换为数组并按字母排序
      return Object.keys(groups)
        .sort()
        .map(letter => ({
          letter,
          contacts: groups[letter].sort((a, b) => {
            const nameA = (a.remark || a.name).localeCompare((b.remark || b.name), 'zh');
            return nameA;
          })
        }));
    },

    // 过滤后的分组
    filteredGroups() {
      if (!this.searchQuery) {
        return this.groupedContacts;
      }

      const query = this.searchQuery.toLowerCase();
      const filtered = [];

      this.groupedContacts.forEach(group => {
        const filteredContacts = group.contacts.filter(contact => {
          const displayName = (contact.remark || contact.name).toLowerCase();
          const phoneMatch = contact.phone && contact.phone.includes(query); // 如果有 phone 字段
          return displayName.includes(query) || phoneMatch;
        });

        if (filteredContacts.length > 0) {
          filtered.push({
            letter: group.letter,
            contacts: filteredContacts
          });
        }
      });

      return filtered;
    }
  },
  methods: {
	  // 获取页面标题
	  getHeaderTitle() {
		  if (!this.selectMode) return '联系人';
		  
		  switch (this.inviteType) {
			  case 'teacher':
				  return '邀请老师';
			  case 'enterprise':
				  return '邀请企业';
			  default:
				  return '选择好友';
		  }
	  },
	  goBack() {
		  // 如果是选择模式，返回时传递选中的联系人信息
		  if (this.selectMode) {
			  uni.navigateBack({ delta: 1 });
		  } else {
			  uni.navigateBack({ delta: 1 });
		  }
	  },
	  // 跳转到添加好友页面
	  goToAddFriend() {
		  uni.navigateTo({
			  url: '/pages/chatList/addFriend'
		  });
	  },
	  toChatPage(contact) {
		  // 在选择模式下不执行聊天操作
		  if (this.selectMode) return;
		  
	  	let friend = contact;
		let chat = {statu:'person'};
		let navigateBack = 2;
	  	uni.navigateTo({
	  		url: `/pages/chatList/chatPage`,
	  		success: (res) => {
	  			res.eventChannel.emit("chatData", {
	  				chat,
	  				friend,
					navigateBack
	  			});
	  		}
	  	})
	  },
	  ...mapActions({
	  	friendLists: "userFriend/friendList",
	  }),
	  toUserInfoPage(id) {
		  // 在选择模式下不跳转到用户详情页
		  if (this.selectMode) return;
		  
	  	uni.navigateTo({
	  		url: `/pages/userInfo/userInfo`,
	  		success: (res) => {
	  			res.eventChannel.emit("chatData", {
	  				id
	  			});
	  		}
	  	})
	  },
	  color(status){
		  switch (status) {
		  	case 1:
		  		return 'color:#4361ee;';
		  	case 2:
		  		return 'color:#f72585;';
		  	case 3:
		  		return 'color:#4cc9f0;';
		  	default:
		  		return '';
		  }
	  },
	  // 处理联系人点击事件
	  handleContactClick(contact) {
		  if (this.selectMode) {
			  // 选择模式下切换选中状态
			  this.toggleSelection(contact);
		  } else {
			  // 普通模式下跳转到用户详情页
			  this.toUserInfoPage(contact.friendId);
		  }
	  },
	  // 切换联系人选择状态
	  toggleSelection(contact) {
		  // 检查身份是否符合邀请要求
		  if (this.statusFilter && Number(contact.status) !== Number(this.statusFilter)) {
			  uni.showToast({
				  title: `请选择${this.statusFilter === 2 ? '老师' : '企业'}身份的用户`,
				  icon: 'none'
			  });
			  return;
		  }
		  
		  const index = this.selectedContacts.findIndex(item => item.friendId === contact.friendId);
		  if (index > -1) {
			  // 如果已选中，则取消选中
			  this.selectedContacts.splice(index, 1);
		  } else {
			  // 如果未选中，检查是否超过选择限制
			  if (this.inviteType === 'teacher' || this.inviteType === 'enterprise') {
				  // 邀请老师或企业时只能选择一人
				  if (this.selectedContacts.length >= 1) {
					  uni.showToast({
						  title: '只能邀请一位' + (this.inviteType === 'teacher' ? '老师' : '企业'),
						  icon: 'none'
					  });
					  return;
				  }
			  }
			  // 添加到选中列表
			  this.selectedContacts.push(contact);
		  }
	  },
	  // 检查联系人是否已选中
	  isSelected(friendId) {
		  return this.selectedContacts.some(item => item.friendId === friendId);
	  },
	  // 确认选择
	  async confirmSelection() {
		  if (this.selectedContacts.length === 0) {
			  uni.showToast({
				  title: '请选择好友',
				  icon: 'none'
			  });
			  return;
		  }
		  
		  // 检查老师/企业邀请的限制
		  if ((this.inviteType === 'teacher' || this.inviteType === 'enterprise') && this.selectedContacts.length > 1) {
			  uni.showToast({
				  title: '只能邀请一位' + (this.inviteType === 'teacher' ? '老师' : '企业'),
				  icon: 'none'
			  });
			  return;
		  }
		  
		  // 发送邀请
		  if (this.groupId) {
			  // 这里需要调用群组邀请接口
			  // 由于我们无法直接访问群组成员页面的实例，需要通过事件或其他方式通知
			  const pages = getCurrentPages();
			  const prevPage = pages[pages.length - 2]; // 上一个页面
			  
			  if (prevPage && typeof prevPage.$vm.sendInvitation === 'function') {
				  // 显示加载提示
				  uni.showLoading({
					  title: '正在发送邀请...'
				  });
				  
				  try {
					  // 逐个发送邀请并统计结果
					  let successCount = 0;
					  let alreadyInGroupCount = 0;
					  let failCount = 0;
					  
					  for (const contact of this.selectedContacts) {
						  const result = await prevPage.$vm.sendInvitation(contact.friendId);
						  if (result.success) {
							  successCount++;
						  } else if (result.reason === 'already_in_group') {
							  alreadyInGroupCount++;
						  } else {
							  failCount++;
						  }
					  }
					  
					  uni.hideLoading();
					  
					  // 根据邀请类型设置提示文本
					  const inviteTypeName = this.inviteType === 'teacher' ? '老师' : 
											this.inviteType === 'enterprise' ? '企业' : '好友';
					  
					  // 根据结果给出不同的提示
					  if (successCount > 0 && alreadyInGroupCount === 0 && failCount === 0) {
						  // 全部成功
						  uni.showToast({
							  title: `成功邀请${successCount}位${inviteTypeName}`,
							  icon: 'success'
						  });
					  } else if (successCount > 0 && (alreadyInGroupCount > 0 || failCount > 0)) {
						  // 部分成功
						  let message = `成功邀请${successCount}位${inviteTypeName}`;
						  if (alreadyInGroupCount > 0) {
							  message += `，${alreadyInGroupCount}位已在群组中`;
						  }
						  if (failCount > 0) {
							  message += `，${failCount}位邀请失败`;
						  }
						  uni.showToast({
							  title: message,
							  icon: 'none'
						  });
					  } else if (successCount === 0 && alreadyInGroupCount > 0 && failCount === 0) {
						  // 全部已在群组中
						  uni.showToast({
							  title: `选择的${inviteTypeName}均已在群组中`,
							  icon: 'none'
						  });
					  } else {
						  // 全部失败或其他情况
						  uni.showToast({
							  title: '邀请发送失败',
							  icon: 'none'
						  });
					  }
					  
					  // 返回上一页
					  setTimeout(() => {
						  uni.navigateBack({ delta: 1 });
					  }, 1500);
				  } catch (error) {
					  uni.hideLoading();
					  uni.showToast({
						  title: '邀请发送失败',
						  icon: 'none'
					  });
				  }
			  } else {
				  uni.showToast({
					  title: '无法发送邀请',
					  icon: 'none'
				  });
			  }
		  }
	  },
    // 获取中文拼音首字母（简化版）
    getPinyinInitial(name) {
      // 使用 pinyin-pro 获取首字母
       const result = pinyin(name, {
         pattern: 'first', // 只提取首字母
         toneType: 'none', // 不带音调
         mode: 'surname'   // 启用姓氏模式
       });
       // 返回首字母大写
       const firstLetter = result[0]?.charAt(0).toUpperCase() || '#';
         return firstLetter;
    },

    // 滚动到指定字母分组
    scrollToLetter(letter) {
      this.activeLetter = letter;

      const groupId = 'group-' + letter;
      const element = document.getElementById(groupId);

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // 1.5秒后清除高亮
        setTimeout(() => {
          if (this.activeLetter === letter) {
            this.activeLetter = '';
          }
        }, 1500);
      }
    }
  },
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
		height: 100vh;
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

	.search-bar {
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50px;
		padding: 8px 15px;
		display: flex;
		align-items: center;
	}

	.search-bar input {
		background: transparent;
		border: none;
		color: #fff;
		width: 100%;
		padding: 0 10px;
		outline: none;
		font-size: 0.95rem;
	}

	/* 身份筛选标签 */
	.status-filter {
		margin-top: 10px;
		display: flex;
		justify-content: center;
	}

	/* 联系人列表容器 */
	.contacts-container {
		flex: 1;
		overflow-y: auto;
		position: relative;
		padding-bottom: 20px;
	}

	/* 字母索引 */
	.index-bar {
		position: fixed;
		right: 5px;
		top: 50%;
		transform: translateY(-50%);
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 5px 0;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.7);
		backdrop-filter: blur(2px);
	}

	.index-letter {
		padding: 2px 8px;
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		color: var(--primary);
		transition: all 0.2s;
	}

	.index-letter:hover,
	.index-letter.active {
		background: var(--primary);
		color: white;
		border-radius: 50%;
	}

	/* 联系人分组 */
	.contact-group {
		margin-bottom: 15px;
		background: white;
		border-radius: 16px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		overflow: hidden;
		margin: 10px 15px 20px;
	}

	.group-header {
		padding: 8px 15px;
		background: var(--light);
		font-weight: 600;
		color: var(--primary);
		font-size: 1.1rem;
	}

	/* 联系人卡片 */
	.contact-item {
		display: flex;
		align-items: center;
		padding: 15px;
		border-bottom: 1px solid var(--light-gray);
		transition: all 0.2s;
	}

	.contact-item:last-child {
		border-bottom: none;
	}

	.contact-item:hover {
		background-color: #f8f9ff;
	}
	.statuStudent{
		color: #4361ee;
		font-weight: 600;
		border-radius: 20rpx;
		font-size: 0.75rem;
	}
	.statuTeacher{
		color: #f72585;
		font-weight: 600;
		border-radius: 20rpx;
		font-size: 0.75rem;
	}
	.statuEnterprise{
		color: #4cc9f0;
		font-weight: 600;
		border-radius: 20rpx;
		font-size: 0.75rem;
	}
	.contact-avatar {
		width: 45px;
		height: 45px;
		border-radius: 50%;
		background: linear-gradient(45deg, var(--accent), var(--success));
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: bold;
		font-size: 1.2rem;
		margin-right: 15px;
	}

	.contact-info {
		flex: 1;
	}

	.contact-name {
		font-weight: 600;
		margin-bottom: 3px;
		font-size: 1.05rem;
	}

	.contact-phone {
		font-size: 0.85rem;
		color: var(--gray);
	}

	.contact-actions {
		display: flex;
		gap: 15px;
	}

	.action-icon {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--light);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--primary);
		cursor: pointer;
		transition: all 0.2s;
	}

	.action-icon:active {
		background: var(--primary);
		color: white;
		transform: scale(1.1);
	}
	
	/* 选择指示器 */
	.select-indicator {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--light);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s;
	}
	
	.select-indicator.selected {
		background: #e0e7ff;
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
		color: var(--light-gray);
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
	
	/* 选择模式底部操作栏 */
	.select-footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: white;
		padding: 15px 20px;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
		z-index: 100;
		max-width: 500px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.selected-count {
		font-size: 0.9rem;
		color: var(--gray);
	}

	/* 响应式调整 */
	@media (max-width: 480px) {
		.contact-actions {
			gap: 8px;
		}

		.action-icon {
			width: 32px;
			height: 32px;
			font-size: 0.9rem;
		}

		.contact-item {
			padding: 12px 15px;
		}
	}
</style>