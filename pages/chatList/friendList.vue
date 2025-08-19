<template>
	<view>
		<div class="body">
			<!-- 顶部导航 -->
			<header class="app-header">
				<div class="header-top">
					<div class="logo">
						<i class="fas fa-address-book"></i>
						<span>联系人</span>
					</div>
					<div class="header-actions">
						<i class="fas fa-plus"></i>
						<i class="fas fa-ellipsis-v"></i>
					</div>
				</div>
				<div class="search-bar">
					<input style="color: #fff;" type="text" v-model="searchQuery" placeholder="搜索联系人...">
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
							<div class="contact-item" v-for="contact in group.contacts" :key="contact.id" @click="toUserInfoPage(contact.friendId)">
								<image class="contact-avatar" :src="imageUrl + contact.head" mode=""></image>
								<div class="contact-info">
									<div class="contact-name">{{ contact.remark == null?contact.name:contact.remark }}
										<span class='statuStudent' v-if="contact.status == 1">学生</span>
										<span class='statuTeacher' v-if="contact.status == 2">老师</span>
										<span class='statuEnterprise' v-if="contact.status == 3">企业</span>
									</div>
									<div class="contact-phone">{{ contact.phone }}</div>
								</div>
								<div class="contact-actions">
									<div class="action-icon">
										
										<u-icon name="chat" size="25" color="#4895ef" ></u-icon>
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
      contacts: [] // 将用于存储处理后的联系人数据
    }
  },
  onLoad() {
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
		
		  // 监听滚动事件以更新当前活动字母
		  this.$nextTick(() => {
		    const container = document.querySelector('.contacts-container');
		    if (container) {
		      const groups = document.querySelectorAll('.contact-group');
		
		      container.addEventListener('scroll', () => {
		        const scrollPosition = container.scrollTop + 100; // 偏移量调整
		
		        let currentGroup = '';
		        groups.forEach(group => {
		          const groupElement = group.parentElement;
		          if (groupElement && groupElement.offsetTop <= scrollPosition) {
		            const id = groupElement.id;
		            if (id && id.startsWith('group-')) {
		              currentGroup = id.split('-')[1];
		            }
		          }
		        });
		
		        this.activeLetter = currentGroup;
		      });
		    }
		  });
	})
  },
  computed: {
	  imageUrl() {
	  	return imageUrl
	  },
    // 按字母分组联系人
    groupedContacts() {
      const groups = {};

      this.contacts.forEach(contact => {
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
	  ...mapActions({
	  	friendLists: "userFriend/friendList",
	  }),
	  toUserInfoPage(id) {
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

	.action-icon:hover {
		background: var(--primary);
		color: white;
		transform: scale(1.1);
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