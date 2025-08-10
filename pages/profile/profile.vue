<template>
  <div>
    <!-- 头部用户信息 -->
    <div class="profile-header">
        <div class="profile-top">
            <div class="profile-title">个人中心</div>
            <div class="header-actions">
                <i class="fas fa-cog"></i>
                <i class="fas fa-bell"></i>
            </div>
        </div>
        
        <div class="user-info">
            <div class="avatar-container">
                <div class="avatar">张</div>
                <div class="level-badge">7</div>
            </div>
            <div class="user-details">
                <div class="username">张明轩</div>
                <div class="user-title">前端开发学习路径 · 第3阶段</div>
                <button class="edit-btn">
                    <i class="fas fa-edit"></i> 编辑资料
                </button>
            </div>
        </div>
    </div>
    
    <!-- 用户数据卡片 -->
    <div class="profile-card">
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-value">1.5h</div>
                <div class="stat-label">今日学习</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">7天</div>
                <div class="stat-label">连续学习</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">350</div>
                <div class="stat-label">学习积分</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">12</div>
                <div class="stat-label">完成任务</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">5</div>
                <div class="stat-label">学习小组</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">28</div>
                <div class="stat-label">学术声望</div>
            </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="progress-header">
            <div class="progress-title">学习进度</div>
            <div class="stat-value">75%</div>
        </div>
        <div class="progress-subtitle">前端开发学习路径 · 第3阶段</div>
        <div class="progress-container">
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-info">
                <span>已学: 24小时</span>
                <span>剩余: 8小时</span>
            </div>
        </div>
    </div>
    
    <!-- 成就部分 -->
    <div class="section-header">
        <div class="section-title">我的成就</div>
        <a href="#" class="section-link">查看全部</a>
    </div>
    
    <div class="achievements-grid">
        <div class="achievement-item">
            <div class="achievement-icon">
                <i class="fas fa-medal"></i>
            </div>
            <div class="achievement-name">初学乍练</div>
        </div>
        <div class="achievement-item">
            <div class="achievement-icon">
                <i class="fas fa-rocket"></i>
            </div>
            <div class="achievement-name">七日坚持</div>
        </div>
        <div class="achievement-item">
            <div class="achievement-icon">
                <i class="fas fa-code"></i>
            </div>
            <div class="achievement-name">代码达人</div>
        </div>
        <div class="achievement-item">
            <div class="achievement-icon">
                <i class="fas fa-trophy"></i>
            </div>
            <div class="achievement-name">任务大师</div>
        </div>
        <div class="achievement-item achievement-locked">
            <div class="achievement-icon">
                <i class="fas fa-users"></i>
            </div>
            <div class="achievement-name">团队领袖</div>
        </div>
        <div class="achievement-item achievement-locked">
            <div class="achievement-icon">
                <i class="fas fa-graduation-cap"></i>
            </div>
            <div class="achievement-name">学有所成</div>
        </div>
        <div class="achievement-item">
            <div class="achievement-icon">
                <i class="fas fa-lightbulb"></i>
            </div>
            <div class="achievement-name">灵感闪现</div>
        </div>
        <div class="achievement-item achievement-locked">
            <div class="achievement-icon">
                <i class="fas fa-crown"></i>
            </div>
            <div class="achievement-name">学神降临</div>
        </div>
    </div>
    
    <!-- 任务列表 -->
    <div class="section-header">
        <div class="section-title">我的任务</div>
        <a href="#" class="section-link">查看全部</a>
    </div>
    
    <div class="tasks-container">
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
            <div class="task-progress">
                <div class="progress-circle">65%</div>
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
            <div class="task-progress">
                <div class="progress-circle" style="background: radial-gradient(var(--card-bg) 60%, transparent 61%), conic-gradient(var(--accent) 0%, var(--light-gray) 0);">0%</div>
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
            <div class="task-progress">
                <div class="progress-circle">15%</div>
            </div>
        </div>
        <div class="task-item">
            <div class="task-icon">
                <i class="fas fa-question-circle"></i>
            </div>
            <div class="task-details">
                <div class="task-title">解答社区问题：React性能优化</div>
                <div class="task-meta">
                    <div class="task-time">
                        <i class="far fa-clock"></i> 5天后
                    </div>
                    <div class="task-status">待接受</div>
                </div>
            </div>
            <div class="task-progress">
                <div class="progress-circle" style="background: radial-gradient(var(--card-bg) 60%, transparent 61%), conic-gradient(var(--warning) 0%, var(--light-gray) 0); color: var(--warning);">0%</div>
            </div>
        </div>
    </div>
    
    <!-- 功能列表 -->
    <div class="section-header">
        <div class="section-title">学习工具</div>
        <a href="#" class="section-link">更多</a>
    </div>
    
    <div class="features-container">
        <div class="feature-grid">
            <div class="feature-item">
                <div class="feature-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div class="feature-name">学力报告</div>
            </div>
            <div class="feature-item">
                <div class="feature-icon">
                    <i class="fas fa-bookmark"></i>
                </div>
                <div class="feature-name">我的收藏</div>
            </div>
            <div class="feature-item">
                <div class="feature-icon">
                    <i class="fas fa-history"></i>
                </div>
                <div class="feature-name">学习记录</div>
            </div>
            <div class="feature-item">
                <div class="feature-icon">
                    <i class="fas fa-certificate"></i>
                </div>
                <div class="feature-name">我的证书</div>
            </div>
            <div class="feature-item">
                <div class="feature-icon">
                    <i class="fas fa-coins"></i>
                </div>
                <div class="feature-name">积分兑换</div>
            </div>
            <div class="feature-item">
                <div class="feature-icon">
                    <i class="fas fa-user-friends"></i>
                </div>
                <div class="feature-name">我的小组</div>
            </div>
            <div class="feature-item">
                <div class="feature-icon">
                    <i class="fas fa-tasks"></i>
                </div>
                <div class="feature-name">任务所</div>
            </div>
            <div class="feature-item">
                <div class="feature-icon">
                    <i class="fas fa-cog"></i>
                </div>
                <div class="feature-name">设置</div>
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
            --section-bg: #f5f7fb;
        }
        
        body {
            background-color: #f0f2f5;
            color: var(--dark);
            padding-bottom: 80px;
        }
        
        /* 头部用户信息 */
        .profile-header {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            padding: 30px 20px 60px;
            position: relative;
        }
        
        .profile-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }
        
        .profile-title {
            font-size: 1.4rem;
            font-weight: 600;
        }
        
        .header-actions {
            display: flex;
            gap: 20px;
        }
        
        .header-actions i {
            font-size: 1.3rem;
        }
        
        .user-info {
            display: flex;
            align-items: center;
        }
        
        .avatar-container {
            position: relative;
            margin-right: 20px;
        }
        
        .avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(45deg, #a1c4fd, #c2e9fb);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 2.2rem;
            font-weight: bold;
            border: 3px solid white;
        }
        
        .level-badge {
            position: absolute;
            bottom: 0;
            right: 0;
            background: linear-gradient(45deg, #ff9a9e, #fad0c4);
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: bold;
            border: 2px solid white;
        }
        
        .user-details {
            flex: 1;
        }
        
        .username {
            font-size: 1.4rem;
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .user-title {
            font-size: 0.95rem;
            opacity: 0.9;
            margin-bottom: 10px;
        }
        
        .edit-btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: none;
            padding: 6px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .edit-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        /* 用户数据卡片 */
        .profile-card {
            background: var(--card-bg);
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            margin: -40px 20px 20px;
            padding: 25px;
            position: relative;
            z-index: 10;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 25px;
        }
        
        .stat-item {
            text-align: center;
            padding: 15px 0;
        }
        
        .stat-value {
            font-size: 1.6rem;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 0.9rem;
            color: var(--gray);
        }
        
        .divider {
            height: 1px;
            background: var(--light-gray);
            margin: 20px 0;
        }
        
        /* 进度卡片 */
        .progress-card {
            background: var(--card-bg);
            border-radius: 16px;
            padding: 20px;
            margin: 0 20px 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .progress-title {
            font-size: 1.1rem;
            font-weight: 600;
        }
        
        .progress-subtitle {
            font-size: 0.9rem;
            color: var(--gray);
            margin-bottom: 15px;
        }
        
        .progress-container {
            margin-bottom: 15px;
        }
        
        .progress-bar {
            height: 10px;
            background: var(--light-gray);
            border-radius: 5px;
            overflow: hidden;
            margin-bottom: 10px;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--accent), var(--success));
            border-radius: 5px;
            width: 75%;
        }
        
        .progress-info {
            display: flex;
            justify-content: space-between;
            font-size: 0.85rem;
            color: var(--gray);
        }
        
        /* 成就部分 */
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 30px 20px 15px;
        }
        
        .section-title {
            font-size: 1.25rem;
            font-weight: 600;
        }
        
        .section-link {
            font-size: 0.95rem;
            color: var(--primary);
            text-decoration: none;
        }
        
        .achievements-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin: 0 20px;
        }
        
        .achievement-item {
            background: var(--card-bg);
            border-radius: 16px;
            padding: 15px 10px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
            transition: all 0.3s;
        }
        
        .achievement-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
        }
        
        .achievement-icon {
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
        
        .achievement-name {
            font-size: 0.85rem;
            font-weight: 500;
        }
        
        .achievement-locked {
            opacity: 0.5;
        }
        
        .achievement-locked .achievement-icon {
            background: var(--light-gray);
            color: var(--gray);
        }
        
        /* 任务列表 */
        .tasks-container {
            background: var(--card-bg);
            border-radius: 20px;
            margin: 20px;
            padding: 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            overflow: hidden;
        }
        
        .task-item {
            display: flex;
            padding: 20px;
            border-bottom: 1px solid var(--light-gray);
        }
        
        .task-item:last-child {
            border-bottom: none;
        }
        
        .task-icon {
            width: 45px;
            height: 45px;
            background: var(--light);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            color: var(--primary);
            font-size: 1.2rem;
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
        
        .task-progress {
            width: 70px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: center;
        }
        
        .progress-circle {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: 
                radial-gradient(var(--card-bg) 60%, transparent 61%),
                conic-gradient(var(--accent) 75%, var(--light-gray) 0);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--accent);
        }
        
        /* 功能列表 */
        .features-container {
            margin: 20px;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
        }
        
        .feature-item {
            text-align: center;
        }
        
        .feature-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 10px;
            color: white;
            font-size: 1.6rem;
        }
        
        .feature-name {
            font-size: 0.9rem;
            font-weight: 500;
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
            box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.1);
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
            .achievements-grid {
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
            }
            
            .achievement-icon {
                width: 40px;
                height: 40px;
                font-size: 1.2rem;
            }
            
            .feature-grid {
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
            }
            
            .feature-icon {
                width: 50px;
                height: 50px;
                font-size: 1.4rem;
            }
        }
</style>