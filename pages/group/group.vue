<template>
  <div>
    <!-- 顶部导航 -->
    <header>
    <div class="header-top">
            <div class="logo">
                <i class="fas fa-comments"></i>
                <span>消息中心</span>
            </div>
            <div class="header-actions">
                <i class="fas fa-user-plus"></i>
                <i class="fas fa-ellipsis-v"></i>
            </div>
        </div>
        <div class="tabs-container">
            <div class="tab active">全部</div>
            <div class="tab">未读</div>
            <div class="tab">群聊</div>
            <div class="tab">学习小组</div>
            <div class="tab">导师</div>
            <div class="tab">系统</div>
        </div>
    </header>
    <!-- 搜索区域 -->
    <div class="search-container">
        <div class="search-bar">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="搜索联系人、群组或消息">
        </div>
    </div>
    
    <!-- 聊天列表 -->
    <div class="chat-list">
        <!-- 学习小组 -->
        <div class="chat-section">
            <div class="section-header">学习小组</div>
            
            <div class="chat-item study-group">
                <div class="chat-avatar">
                    <i class="fas fa-code"></i>
                    <div class="avatar-indicator online"></div>
                </div>
                <div class="chat-info">
                    <div class="chat-header">
                        <div class="chat-name">前端开发精英组</div>
                        <div class="chat-time">10:24</div>
                    </div>
                    <div class="chat-preview">
                        <div class="chat-message">
                            <i class="fas fa-user status-icon"></i> 李明轩：电商项目首页设计已完成，请大家审核
                        </div>
                        <div class="unread-count">3</div>
                    </div>
                </div>
            </div>
            
            <div class="chat-item study-group">
                <div class="chat-avatar">
                    <i class="fas fa-server"></i>
                    <div class="avatar-indicator online"></div>
                </div>
                <div class="chat-info">
                    <div class="chat-header">
                        <div class="chat-name">后端架构研究组</div>
                        <div class="chat-time">昨天</div>
                    </div>
                    <div class="chat-preview">
                        <div class="chat-message">
                            <i class="fas fa-user status-icon"></i> 王老师：下次小组会议时间调整为周六下午
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="chat-item study-group unread">
                <div class="chat-avatar">
                    <i class="fas fa-database"></i>
                    <div class="avatar-indicator online"></div>
                </div>
                <div class="chat-info">
                    <div class="chat-header">
                        <div class="chat-name">数据库优化小组</div>
                        <div class="chat-time">昨天</div>
                    </div>
                    <div class="chat-preview">
                        <div class="chat-message">
                            <i class="fas fa-user status-icon"></i> 张同学：分享了一个关于索引优化的文档
                        </div>
                        <div class="unread-count">12</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 群聊 -->
        <div class="chat-section">
            <div class="section-header">群聊</div>
            
            <div class="chat-item group-chat unread">
                <div class="chat-avatar">
                    <i class="fas fa-users"></i>
                    <div class="avatar-indicator online"></div>
                </div>
                <div class="chat-info">
                    <div class="chat-header">
                        <div class="chat-name">React学习交流群</div>
                        <div class="chat-time">08:45</div>
                    </div>
                    <div class="chat-preview">
                        <div class="chat-message">
                            <i class="fas fa-user status-icon"></i> 陈同学：有人能帮忙看看这个Hooks问题吗？
                        </div>
                        <div class="unread-count">5</div>
                    </div>
                </div>
            </div>
            
            <div class="chat-item group-chat">
                <div class="chat-avatar">
                    <i class="fas fa-laptop-code"></i>
                    <div class="avatar-indicator online"></div>
                </div>
                <div class="chat-info">
                    <div class="chat-header">
                        <div class="chat-name">全栈开发交流群</div>
                        <div class="chat-time">昨天</div>
                    </div>
                    <div class="chat-preview">
                        <div class="chat-message">
                            <i class="fas fa-user status-icon"></i> 管理员：本周技术分享主题征集
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 导师 -->
        <div class="chat-section">
            <div class="section-header">导师</div>
            
            <div class="chat-item mentor-chat">
                <div class="chat-avatar">
                    李
                    <div class="avatar-indicator online"></div>
                </div>
                <div class="chat-info">
                    <div class="chat-header">
                        <div class="chat-name">李教授 (前端导师)</div>
                        <div class="chat-time">昨天</div>
                    </div>
                    <div class="chat-preview">
                        <div class="chat-message">
                            你的项目代码已审核，架构设计很合理
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="chat-item mentor-chat unread">
                <div class="chat-avatar">
                    王
                    <div class="avatar-indicator offline"></div>
                </div>
                <div class="chat-info">
                    <div class="chat-header">
                        <div class="chat-name">王老师 (全栈导师)</div>
                        <div class="chat-time">周三</div>
                    </div>
                    <div class="chat-preview">
                        <div class="chat-message">
                            关于你问的Node.js性能优化，我整理了一份文档
                        </div>
                        <div class="unread-count">1</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 个人聊天 -->
        <div class="chat-section">
            <div class="section-header">个人聊天</div>
            
            <div class="chat-item personal-chat unread">
                <div class="chat-avatar">
                    张
                    <div class="avatar-indicator online"></div>
                </div>
                <div class="chat-info">
                    <div class="chat-header">
                        <div class="chat-name">张同学</div>
                        <div class="chat-time">09:30</div>
                    </div>
                    <div class="chat-preview">
                        <div class="chat-message">
                            算法题解已发送，请查收
                        </div>
                        <div class="unread-count">2</div>
                    </div>
                </div>
            </div>
            
            <div class="chat-item personal-chat">
                <div class="chat-avatar">
                    王
                    <div class="avatar-indicator online"></div>
                </div>
                <div class="chat-info">
                    <div class="chat-header">
                        <div class="chat-name">王明轩</div>
                        <div class="chat-time">昨天</div>
                    </div>
                    <div class="chat-preview">
                        <div class="chat-message">
                            下周的自习室安排好了吗？
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="chat-item personal-chat">
                <div class="chat-avatar">
                    李
                    <div class="avatar-indicator offline"></div>
                </div>
                <div class="chat-info">
                    <div class="chat-header">
                        <div class="chat-name">李同学</div>
                        <div class="chat-time">昨天</div>
                    </div>
                    <div class="chat-preview">
                        <div class="chat-message">
                            项目文档已更新，请查看最新版本
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 系统通知 -->
        <div class="chat-section">
            <div class="section-header">系统通知</div>
            
            <div class="chat-item system-notify unread">
                <div class="chat-avatar">
                    <i class="fas fa-bell"></i>
                </div>
                <div class="chat-info">
                    <div class="chat-header">
                        <div class="chat-name">系统通知</div>
                        <div class="chat-time">今天</div>
                    </div>
                    <div class="chat-preview">
                        <div class="chat-message">
                            你参与的任务"React组件开发"已通过审核，积分+120
                        </div>
                        <div class="unread-count"></div>
                    </div>
                </div>
            </div>
            
            <div class="chat-item system-notify">
                <div class="chat-avatar">
                    <i class="fas fa-trophy"></i>
                </div>
                <div class="chat-info">
                    <div class="chat-header">
                        <div class="chat-name">成就通知</div>
                        <div class="chat-time">昨天</div>
                    </div>
                    <div class="chat-preview">
                        <div class="chat-message">
                            恭喜获得"七日坚持"成就，积分+50
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
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
        
        :root {
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
        }
        
        body {
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
        
        .chat-section {
            margin-bottom: 20px;
        }
        
        .section-header {
            padding: 10px 20px;
            font-size: 0.9rem;
            color: var(--gray);
            background: #f5f7fb;
            position: sticky;
            top: 0;
            z-index: 10;
        }
        
        .chat-item {
            display: flex;
            padding: 15px 20px;
            background: var(--card-bg);
            border-bottom: 1px solid var(--light-gray);
            transition: all 0.3s;
            position: relative;
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