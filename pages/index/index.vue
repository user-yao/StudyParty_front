
<template>
  <div>
  <!-- 头部导航 -->
    <header>
        <div class="header-top">
            <div class="logo">
                <i class="fas fa-graduation-cap"></i>
                <span>智学未来</span>
            </div>
            <div class="header-actions">
                <i class="fas fa-bell"></i>
                <i class="fas fa-comment-alt"></i>
            </div>
        </div>
        <div class="search-bar">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="搜索课程、问题、技能...">
        </div>
    </header>
    
    <!-- 用户概览 -->
    <div class="user-overview">
        <div class="user-info">
            <image class="avatar" :src="imageUrl+userInfo.head"></image>
            <div class="user-details">
                <h2>{{userInfo.name.substring(0,1)}}同学</h2>
                <p>{{userInfo.school}}</p>
            </div>
        </div>
        <div class="user-stats">
            <div class="stat-item">
                <div class="stat-value">{{userInfo.finishTask}}</div>
                <div class="stat-label">完成任务</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">{{userInfo.clockIn}}天</div>
                <div class="stat-label">连续打卡</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">{{userInfo.starPrestige}}</div>
                <div class="stat-label">学术声望</div>
            </div>
        </div>
    </div>
    
    <!-- 核心功能入口 -->
    <div class="quick-actions">
        <div class="section-title">
            <h3>核心功能</h3>
            <a href="#">全部 <i class="fas fa-chevron-right"></i></a>
        </div>
        <div class="action-grid">
            <div class="action-item">
                <div class="action-icon">
                    <i class="fas fa-sitemap"></i>
                </div>
                <div class="action-name">AI技能树</div>
            </div>
            <div class="action-item">
                <div class="action-icon">
                    <i class="fas fa-route"></i>
                </div>
                <div class="action-name">学习路径</div>
            </div>
            <div class="action-item">
                <div class="action-icon">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="action-name">智能问答</div>
            </div>
            <div class="action-item">
                <div class="action-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div class="action-name">学力报告</div>
            </div>
            <div class="action-item">
                <div class="action-icon">
                    <i class="fas fa-tasks"></i>
                </div>
                <div class="action-name">任务所</div>
            </div>
            <div class="action-item">
                <div class="action-icon">
                    <i class="fas fa-user-friends"></i>
                </div>
                <div class="action-name">自习室</div>
            </div>
            <div class="action-item">
                <div class="action-icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="action-name">小组</div>
            </div>
            <div class="action-item">
                <div class="action-icon">
                    <i class="fas fa-comments"></i>
                </div>
                <div class="action-name">社区</div>
            </div>
        </div>
    </div>
    
    <!-- 待完成任务 -->
    <div class="pending-tasks">
        <div class="section-title">
            <h3>待完成任务</h3>
            <a href="#">查看全部 <i class="fas fa-chevron-right"></i></a>
        </div>
        <div class="task-list">
            <div class="task-item">
                <div class="task-icon">
                    <i class="fas fa-book"></i>
                </div>
                <div class="task-details">
                    <div class="task-title">完成Vue.js组件开发课程</div>
                    <div class="task-meta">
                        <div class="task-time">
                            <i class="far fa-clock"></i> 今天18:00
                        </div>
                        <div class="task-status">进行中</div>
                    </div>
                </div>
            </div>
            <div class="task-item">
                <div class="task-icon">
                    <i class="fas fa-code"></i>
                </div>
                <div class="task-details">
                    <div class="task-title">算法挑战：二叉树遍历</div>
                    <div class="task-meta">
                        <div class="task-time">
                            <i class="far fa-clock"></i> 明天10:00
                        </div>
                        <div class="task-status">未开始</div>
                    </div>
                </div>
            </div>
            <div class="task-item">
                <div class="task-icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="task-details">
                    <div class="task-title">小组项目：电商网站开发</div>
                    <div class="task-meta">
                        <div class="task-time">
                            <i class="far fa-clock"></i> 3天后
                        </div>
                        <div class="task-status">未开始</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 社区动态 -->
    <div class="community-feed">
        <div class="section-title">
            <h3>社区动态</h3>
            <a href="#">更多 <i class="fas fa-chevron-right"></i></a>
        </div>
        <div class="post-card">
            <div class="post-header">
                <div class="post-avatar">王</div>
                <div class="post-user">
                    <div class="post-user-name">王同学</div>
                    <div class="post-time">2小时前</div>
                </div>
            </div>
            <div class="post-content">
                刚刚完成了React Hooks实战项目，分享我的学习笔记和代码仓库，欢迎交流讨论！
            </div>
            <div class="post-actions">
                <div class="post-action">
                    <i class="far fa-heart"></i> 42
                </div>
                <div class="post-action">
                    <i class="far fa-comment"></i> 8
                </div>
                <div class="post-action">
                    <i class="fas fa-share-alt"></i> 分享
                </div>
            </div>
        </div>
        <div class="post-card">
            <div class="post-header">
                <div class="post-avatar">李</div>
                <div class="post-user">
                    <div class="post-user-name">李老师</div>
                    <div class="post-time">5小时前</div>
                </div>
            </div>
            <div class="post-content">
                最新前端面试指南已更新，包含2023年大厂高频面试题解析，助你备战金九银十！
            </div>
            <div class="post-actions">
                <div class="post-action">
                    <i class="far fa-heart"></i> 128
                </div>
                <div class="post-action">
                    <i class="far fa-comment"></i> 24
                </div>
                <div class="post-action">
                    <i class="fas fa-share-alt"></i> 分享
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from "vuex";
	import {imageUrl} from "@/config/config.js"
  export default {
    data() {
      return {
        announcements: [
          { title: '论坛新规则上线', time: '2024-06-15' },
          { title: '夏季活动预告', time: '2024-06-14' },
          { title: '积分兑换调整通知', time: '2024-06-13' }
        ],
        tasks: [
          { title: '技术文章征集', desc: '征集优质前端技术分享', reward: '500积分' },
          { title: '论坛美化建议', desc: '提供界面优化方案', reward: '300积分' },
          { title: '用户调研参与', desc: '填写问卷反馈需求', reward: '100积分' }
        ]
      }
    },
    computed: {
		imageUrl() {
		      return imageUrl
		},
        ...mapState({
            userInfo: state => state.user.userInfo
        })
    },
	onShow() {
		console.log(this.userInfo)
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
            --section-bg: #f5f7fb;
        }
        
        body {
            background-color: #f0f2f5;
            color: var(--dark);
            padding-bottom: 70px;
        }
        
        /* 头部导航 */
        header {
            position: sticky;
            top: 0;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            padding: 15px 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
            color: white;
            width: 100%;
            padding: 0 10px;
            outline: none;
            font-size: 0.95rem;
        }
        
        .search-bar input::placeholder {
            color: rgba(255, 255, 255, 0.7);
        }
        
        /* 用户概览 */
        .user-overview {
            background: white;
            border-radius: 16px;
            margin: 20px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .user-info {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(45deg, var(--accent), var(--success));
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.8rem;
            font-weight: bold;
            margin-right: 15px;
        }
        
        .user-details h2 {
            font-size: 1.3rem;
            margin-bottom: 5px;
        }
        
        .user-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            text-align: center;
        }
        
        .stat-item {
            background: var(--light);
            border-radius: 12px;
            padding: 12px;
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
        
        /* 核心功能入口 */
        .quick-actions {
            margin: 0 20px;
        }
        
        .section-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin: 25px 0 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .section-title a {
            font-size: 0.9rem;
            color: var(--primary);
            font-weight: 500;
            text-decoration: none;
        }
        
        .action-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
        }
        
        .action-item {
            background: white;
            border-radius: 12px;
            padding: 15px 10px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            transition: transform 0.2s;
        }
        
        .action-item:hover {
            transform: translateY(-3px);
        }
        
        .action-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 10px;
            color: white;
            font-size: 1.4rem;
        }
        
        .action-name {
            font-size: 0.85rem;
            font-weight: 500;
        }
        
        /* 推荐学习 */
        .recommended-learning {
            margin: 25px 20px;
        }
        
        .course-card {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .course-header {
            position: relative;
            height: 120px;
            background: linear-gradient(135deg, #6a11cb, #2575fc);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.1rem;
            font-weight: 600;
        }
        
        .course-content {
            padding: 15px;
        }
        
        .course-title {
            font-size: 1.1rem;
            margin-bottom: 10px;
            font-weight: 600;
        }
        
        .course-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            font-size: 0.9rem;
            color: var(--gray);
        }
        
        .progress-container {
            margin-bottom: 15px;
        }
        
        .progress-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 0.85rem;
            color: var(--gray);
        }
        
        .progress-bar {
            height: 8px;
            background: var(--light-gray);
            border-radius: 4px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--accent), var(--success));
            width: 45%;
            border-radius: 4px;
        }
        
        .action-btn {
            display: block;
            width: 100%;
            padding: 10px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .action-btn:hover {
            background: var(--secondary);
        }
        
        /* 待完成任务 */
        .pending-tasks {
            margin: 25px 20px;
        }
        
        .task-list {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .task-item {
            display: flex;
            padding: 15px;
            border-bottom: 1px solid var(--light-gray);
        }
        
        .task-item:last-child {
            border-bottom: none;
        }
        
        .task-icon {
            width: 40px;
            height: 40px;
            background: var(--light);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            color: var(--primary);
            font-size: 1.1rem;
        }
        
        .task-details {
            flex: 1;
        }
        
        .task-title {
            font-weight: 500;
            margin-bottom: 5px;
        }
        
        .task-meta {
            display: flex;
            font-size: 0.85rem;
            color: var(--gray);
        }
        
        .task-time {
            margin-right: 15px;
        }
        
        .task-status {
            color: var(--warning);
            font-weight: 500;
        }
        
        /* 社区动态 */
        .community-feed {
            margin: 25px 20px;
        }
        
        .post-card {
            background: white;
            border-radius: 16px;
            padding: 15px;
            margin-bottom: 15px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .post-header {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .post-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(45deg, #ff9a9e, #fad0c4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 1.2rem;
            margin-right: 12px;
        }
        
        .post-user {
            flex: 1;
        }
        
        .post-user-name {
            font-weight: 500;
            margin-bottom: 2px;
        }
        
        .post-time {
            font-size: 0.8rem;
            color: var(--gray);
        }
        
        .post-content {
            margin-bottom: 15px;
            line-height: 1.5;
        }
        
        .post-actions {
            display: flex;
            gap: 20px;
            font-size: 0.9rem;
            color: var(--gray);
        }
        
        .post-action {
            display: flex;
            align-items: center;
            gap: 5px;
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
            .action-grid {
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
            }
            
            .action-icon {
                width: 40px;
                height: 40px;
                font-size: 1.2rem;
            }
            
            .action-name {
                font-size: 0.75rem;
            }
        }
</style>