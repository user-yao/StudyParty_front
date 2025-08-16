<template>
	  <div class="body">
		  <!-- 顶部导航 -->
		  <header>
			  <div class="header-top">
				  <div class="logo">
					  <i class="fas fa-comments"></i>
					  <span>消息中心</span>
				  </div>
				  <div class="header-actions">
					  <i class="fas fa-user-plus" @click="showAddContact = true"></i>
					  <i class="fas fa-ellipsis-v"></i>
				  </div>
			  </div>
			  <div class="tabs-container">
				  <div class="tab" :class="{ active: activeTab === 'messages' }" @click="setActiveTab('messages')">消息</div>
				  <div class="tab" :class="{ active: activeTab === 'addUser' }" @click="setActiveTab('addUser')">添加好友</div>
				  <div class="tab" :class="{ active: activeTab === 'addGroup' }" @click="setActiveTab('addGroup')">加入群组</div>
				  <div class="tab" :class="{ active: activeTab === 'createGroup' }" @click="setActiveTab('createGroup')">创建群组</div>
			  </div>
		  </header>
		  <!-- 搜索区域 -->
		  <div class="search-container">
			  <div class="search-bar">
				  <i class="fas fa-search"></i>
				  <input type="text" v-model="searchQuery" placeholder="搜索联系人、群组或消息">
			  </div>
		  </div>
		  
		  <!-- 聊天列表 -->
		  <div class="chat-list">
			  <template v-if="activeTab === 'messages'">
				  <div class="chat-system">
					  <div >
						  <image class="chat-avatar" src="@/static/chat/lianxiren.png"></image>
					  </div>
					  <div class="chat-header">
						  <div class="chat-name">好友列表</div>
					  </div>
				  </div>
			  </template>
			  <template v-if="activeTab === 'messages'">
				  <div class="chat-system">
					  <div >
						  <image class="chat-avatar" src="@/static/chat/qunzu.png"></image>
					  </div>
					  <div class="chat-header">
						  <div class="chat-name">群聊列表</div>
					  </div>
				  </div>
			  </template>
			  <!-- 消息视图 -->
			  <template v-if="activeTab === 'messages'">
				  <div v-if="filteredChats.length === 0" class="empty-state">
					  <i class="fas fa-comment-slash"></i>
					  <p>暂无聊天记录</p>
				  </div>
				  
				  <div v-for="chat in filteredChats" :key="chat.id" class="chat-item" :class="[chat.statu, { unread: chat.message_count > 0 }]" @click="toChatPage(chat)">
					  <div >
						  <image class="chat-avatar" :src="imageUrl + 'static/head/'+chat.friend+'/userHeadPhoto.png'"></image>
					  </div>
					  <div class="chat-info">
						  <div class="chat-header">
							  <div class="chat-name">{{ getFriend(chat.friend,chat.statu).name }}</div>
							  <div class="chat-time">{{ chat.timestamp }}</div>
						  </div>
						  <div class="chat-preview">
							  <div class="chat-message">
									{{ chat.content }}
							  </div>
							  <div class="unread-count" v-if="chat.message_count > 0">{{ chat.message_count }}</div>
						  </div>
					  </div>
				  </div>
			  </template>
			  
			  <!-- 联系人视图 -->
			  <template v-if="activeTab === 'contacts'">
				  <div v-if="filteredContacts.length === 0" class="empty-state">
					  <i class="fas fa-user-friends"></i>
					  <p>暂无联系人</p>
				  </div>
				  
				  <div v-for="contact in filteredContacts" :key="contact.id" class="chat-item personal-chat" :class="{ unread: contact.unreadCount > 0 }" @click="openChat(contact)">
					  <div class="chat-avatar">
						  {{ contact.name.substring(0, 1) }}
						  <div class="avatar-indicator" :class="{ online: contact.online, offline: !contact.online }"></div>
					  </div>
					  <div class="chat-info">
						  <div class="chat-header">
							  <div class="chat-name">{{ contact.name }}</div>
							  <div class="chat-time" v-if="contact.lastMessageTime">{{ contact.lastMessageTime }}</div>
						  </div>
						  <div class="chat-preview">
							  <div class="chat-message" v-if="contact.lastMessage">
								  {{ contact.lastMessage }}
							  </div>
							  <div class="unread-count" v-if="contact.unreadCount > 0">{{ contact.unreadCount }}</div>
						  </div>
					  </div>
				  </div>
			  </template>
			  
			  <!-- 群组视图 -->
			  <template v-if="activeTab === 'groups'">
				  <div v-if="filteredGroups.length === 0" class="empty-state">
					  <i class="fas fa-users"></i>
					  <p>暂无群组</p>
				  </div>
				  
				  <div v-for="group in filteredGroups" :key="group.id" class="chat-item" :class="[group.type, { unread: group.unreadCount > 0 }]" @click="openChat(group)">
					  <div class="chat-avatar">
						  <i :class="group.icon"></i>
						  <div class="avatar-indicator" :class="{ online: group.online, offline: !group.online }"></div>
					  </div>
					  <div class="chat-info">
						  <div class="chat-header">
							  <div class="chat-name">{{ group.name }}</div>
							  <div class="chat-time" v-if="group.lastMessageTime">{{ group.lastMessageTime }}</div>
						  </div>
						  <div class="chat-preview">
							  <div class="chat-message" v-if="group.lastMessage">
								  <template v-if="group.lastSender">
									  <i class="fas fa-user status-icon"></i> {{ group.lastSender }}：{{ group.lastMessage }}
								  </template>
								  <template v-else>
									  {{ group.lastMessage }}
								  </template>
							  </div>
							  <div class="unread-count" v-if="group.unreadCount > 0">{{ group.unreadCount }}</div>
						  </div>
					  </div>
				  </div>
			  </template>
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
	import{ref,onMounted} from 'vue';
	import {imageUrl} from "@/config/config.js"
 export default {
   data() {
     return {
		activeTab: 'messages',
		activeNav: 'messages',
		searchQuery: '',
		chatList:[]
	 }
   },
   computed: {
	   imageUrl() {
	         return imageUrl
	   },
	...mapState({
	    friendList: state => state.userFriend.friendList
	}),
	 filteredChats() {
		 if (!this.searchQuery) return this.chatList;
		 const query = this.searchQuery.toLowerCase();
		 return this.chatList.filter(chat => 
			 chat.name.toLowerCase().includes(query) || 
			 (chat.lastMessage && chat.lastMessage.toLowerCase().includes(query)))
	 },
	 filteredContacts() {
		 const contacts = this.chatList.filter(chat => 
			 ['person'].includes(chat.statu));
		 
		 if (!this.searchQuery) return contacts;
		 const query = this.searchQuery.toLowerCase();
		 return contacts.filter(contact => 
			 contact.name.toLowerCase().includes(query) || 
			 (contact.lastMessage && contact.lastMessage.toLowerCase().includes(query)))
	 },
	 filteredGroups() {
		 const groups = this.chatList.filter(chat => 
			 ['group',].includes(chat.statu));
		 
		 if (!this.searchQuery) return groups;
		 const query = this.searchQuery.toLowerCase();
		 return groups.filter(group => 
			 group.name.toLowerCase().includes(query) || 
			 (group.lastMessage && group.lastMessage.toLowerCase().includes(query)))
	 }
   },
   methods: {
	   ...mapActions({
			friendLists: "userFriend/friendList",
	   }),
	   toChatPage(chat){
		   console.log(chat)
		   let friend = this.friendList.get(Number(chat.friend));
		   console.log(friend)
		   uni.navigateTo({
		   	url:`/pages/chatList/chatPage`,
			success: (res) => {
			    res.eventChannel.emit("chatData", { chat, friend });
			  }
		   })
	   },
	   getFriend(friendId,status){
		   if(status == 'group'){
				return this.friendList.get(Number(friendId));
		   }
		   if(status == 'person'){
			   return this.friendList.get(Number(friendId));
		   }
	   },
	   getHead(friendId,status){
		   if(status == 'group'){
				return this.friendList.get(Number(friendId)).head;
		   }
		   if(status == 'person'){
			   console.log(this.friendList.get(Number(friendId)).head)
			   return this.friendList.get(Number(friendId)).head;
		   }
	   },
	   async getCharList(){
		return await db.selectChatList().then(res =>{
			console.log(res);
			return res;
		});
	   },
	 setActiveTab(tab) {
		 this.activeTab = tab;
	 },
	 openChat(chat) {
		 // 模拟打开聊天窗口
		 alert(`打开聊天: ${chat.name}`);
		 // 标记为已读
		 chat.unreadCount = 0;
		 
		 // 更新未读状态
		 this.chats = [...this.chats];
	 }
   },
   onShow() {
	   console.log("查询消息列表");
	   this.friendLists().then(()=>{
		   this.getCharList().then(res =>{
		   	console.log(res)
		   	this.chatList = res;
		   });
	   })
	}
 }
</script>

<style scoped>
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
          }
          
          .body {
              background-color: #f5f7fb;
              color: var(--dark);
              height: 100vh;
              display: flex;
              flex-direction: column;
          }
          
          /* 顶部导航 */
          header {
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
              cursor: pointer;
          }
          
          .tabs-container {
              display: flex;
              overflow-x: auto;
              padding-bottom: 5px;
              -ms-overflow-style: none;
              scrollbar-width: none;
          }
          
          .tabs-container::-webkit-scrollbar {
              display: none;
          }
          
          .tab {
              padding: 8px 15px;
              margin-right: 8px;
              border-radius: 20px;
              background: rgba(255, 255, 255, 0.15);
              font-size: 0.9rem;
              white-space: nowrap;
              transition: all 0.3s;
              cursor: pointer;
          }
          
          .tab.active {
              background: white;
              color: var(--primary);
              font-weight: 500;
          }
          
          /* 搜索区域 */
          .search-container {
              padding: 15px;
              background: white;
              border-bottom: 1px solid var(--light-gray);
          }
          
          .search-bar {
              background: var(--light);
              border-radius: 20px;
              padding: 12px 20px;
              display: flex;
              align-items: center;
          }
          
          .search-bar i {
              color: var(--gray);
              margin-right: 10px;
          }
          
          .search-bar input {
              background: transparent;
              border: none;
              width: 100%;
              font-size: 1rem;
              outline: none;
          }
          
          .search-bar input::placeholder {
              color: var(--gray);
          }
          
          /* 聊天列表 */
          .chat-list {
              flex: 1;
              overflow-y: auto;
              padding: 10px 0;
          }
          
		  .chat-system {
		      display: flex;
		      padding: 10rpx 20px;
		      background: var(--card-bg);
		      border-bottom: 1px solid var(--light-gray);
		      transition: all 0.3s;
		      position: relative;
		      cursor: pointer;
		  }
          .chat-item {
              display: flex;
              padding: 15px 20px;
              background: var(--card-bg);
              border-bottom: 1px solid var(--light-gray);
              transition: all 0.3s;
              position: relative;
              cursor: pointer;
          }
          
          .chat-item.unread {
              background: var(--unread-bg);
          }
          
          .chat-item:hover {
              background: #f8faff;
          }
          
          .chat-avatar {
              width: 55px;
              height: 55px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 1.4rem;
              margin-right: 15px;
              position: relative;
          }
          
          .avatar-indicator {
              position: absolute;
              bottom: 0;
              right: 0;
              width: 14px;
              height: 14px;
              border-radius: 50%;
              border: 2px solid white;
          }
          
          .online {
              background: #4ade80;
          }
          
          .offline {
              background: var(--light-gray);
          }
          
          .chat-info {
              flex: 1;
              min-width: 0;
          }
          
          .chat-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 5px;
          }
          
          .chat-name {
              font-weight: 600;
              font-size: 1.05rem;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
          }
          
          .chat-time {
              font-size: 0.8rem;
              color: var(--gray);
          }
          
          .chat-preview {
              display: flex;
              align-items: center;
          }
          
          .chat-message {
              font-size: 0.9rem;
              color: var(--gray);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              flex: 1;
          }
          
          .unread-count {
              background: var(--warning);
              color: white;
              font-size: 0.75rem;
              min-width: 22px;
              height: 22px;
              border-radius: 11px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-left: 10px;
          }
          
          .chat-status {
              display: flex;
              align-items: center;
              margin-top: 5px;
              font-size: 0.8rem;
              color: var(--gray);
          }
          
          .status-icon {
              margin-right: 5px;
          }
          
          /* 底部导航 */
          .bottom-nav {
              background: white;
              display: flex;
              justify-content: space-around;
              padding: 12px 0;
              box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
              position: sticky;
              bottom: 0;
              z-index: 100;
          }
          
          .nav-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              color: var(--gray);
              text-decoration: none;
              font-size: 0.75rem;
              cursor: pointer;
          }
          
          .nav-item.active {
              color: var(--primary);
          }
          
          .nav-item i {
              font-size: 1.3rem;
              margin-bottom: 3px;
          }
          
          /* 颜色变化 */
          .personal-chat .chat-avatar {
              background: linear-gradient(135deg, #6a11cb, #2575fc);
          }
          
          .group-chat .chat-avatar {
              background: linear-gradient(135deg, #ff9a9e, #fad0c4);
          }
          
          .study-group .chat-avatar {
              background: linear-gradient(135deg, #43e97b, #38f9d7);
          }
          
          .system-notify .chat-avatar {
              background: linear-gradient(135deg, #fa709a, #fee140);
          }
          
          .mentor-chat .chat-avatar {
              background: linear-gradient(135deg, #4facfe, #00f2fe);
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
              color: #dcdcdc;
          }
          
          /* 响应式调整 */
          @media (max-width: 480px) {
              .chat-avatar {
                  width: 48px;
                  height: 48px;
                  font-size: 1.2rem;
              }
              .chat-name {
                  font-size: 1rem;
              }
          }
</style>