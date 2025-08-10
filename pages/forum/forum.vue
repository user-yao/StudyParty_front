<template>
  <div>
     <!-- 头部导航 -->
    <header>
        <div class="header-top">
            <div class="logo">
                <i class="fas fa-users"></i>
                <span>社区中心</span>
            </div>
            <div class="header-actions">
                <i class="fas fa-bell"></i>
                <i class="fas fa-search"></i>
            </div>
        </div>
        <div class="tabs-container">
            <div class="tab active">全部</div>
            <div class="tab">推荐</div>
            <div class="tab">任务所</div>
            <div class="tab">学习小组</div>
            <div class="tab">问答</div>
            <div class="tab">知识分享</div>
            <div class="tab">热门</div>
            <div class="tab">关注</div>
        </div>
    </header>
    
    <!-- 社区内容 -->
    <div class="community-container">
        <!-- 任务所 -->
        <div class="section-title">
            <h2>悬赏任务</h2>
            <a href="#">查看全部 <i class="fas fa-chevron-right"></i></a>
        </div>
        
        <div class="task-card">
            <div class="task-header">
                <div class="task-title">React组件开发挑战</div>
                <div class="task-reward">+120积分</div>
            </div>
            <div class="task-meta">
                <div><i class="far fa-clock"></i> 剩余2天</div>
                <div><i class="fas fa-user-graduate"></i> 李老师发布</div>
            </div>
            <div class="task-tags">
                <div class="task-tag">前端开发</div>
                <div class="task-tag">React</div>
                <div class="task-tag">组件化</div>
            </div>
            <div class="task-footer">
                <div class="task-participants">
                    <div class="participant-avatar">张</div>
                    <div class="participant-avatar">王</div>
                    <div class="participant-avatar">李</div>
                    <div class="participant-count">12人参与</div>
                </div>
                <button class="task-btn">立即参与</button>
            </div>
        </div>
        
        <div class="task-card">
            <div class="task-header">
                <div class="task-title">数据结构算法题解</div>
                <div class="task-reward">+80积分</div>
            </div>
            <div class="task-meta">
                <div><i class="far fa-clock"></i> 剩余3天</div>
                <div><i class="fas fa-building"></i> 字节跳动发布</div>
            </div>
            <div class="task-tags">
                <div class="task-tag">算法</div>
                <div class="task-tag">数据结构</div>
                <div class="task-tag">面试题</div>
            </div>
            <div class="task-footer">
                <div class="task-participants">
                    <div class="participant-avatar">刘</div>
                    <div class="participant-avatar">陈</div>
                    <div class="participant-count">8人参与</div>
                </div>
                <button class="task-btn">立即参与</button>
            </div>
        </div>
        
        <!-- 热门帖子 -->
        <div class="section-title">
            <h2>热门讨论</h2>
            <a href="#">更多 <i class="fas fa-chevron-right"></i></a>
        </div>
        
        <div class="post-card">
            <div class="post-header">
                <div class="post-avatar">王</div>
                <div class="post-user">
                    <div class="post-user-name">王同学 · 前端开发</div>
                    <div class="post-meta">
                        <div class="post-time">2小时前</div>
                        <div class="post-type">知识分享</div>
                    </div>
                </div>
            </div>
            <div class="post-content">
                刚刚完成了React Hooks实战项目，分享我的学习笔记和代码仓库，包含10个常见场景的最佳实践，欢迎交流讨论！
            </div>
            <div class="post-image">React Hooks项目截图</div>
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
                <div class="post-action">
                    <i class="fas fa-coin"></i> 投币
                </div>
            </div>
        </div>
        
        <div class="post-card">
            <div class="post-header">
                <div class="post-avatar">李</div>
                <div class="post-user">
                    <div class="post-user-name">李老师 · 全栈工程师</div>
                    <div class="post-meta">
                        <div class="post-time">5小时前</div>
                        <div class="post-type">问题求助</div>
                    </div>
                </div>
            </div>
            <div class="post-content">
                在开发电商平台时遇到性能瓶颈，商品列表页在渲染1000+商品时出现明显卡顿，大家有什么优化建议吗？目前使用的是Vue3 + Composition API。
            </div>
            <div class="post-actions">
                <div class="post-action">
                    <i class="far fa-heart"></i> 28
                </div>
                <div class="post-action">
                    <i class="far fa-comment"></i> 16
                </div>
                <div class="post-action">
                    <i class="fas fa-share-alt"></i> 分享
                </div>
                <div class="post-action">
                    <i class="fas fa-coin"></i> 投币
                </div>
            </div>
        </div>
        
        <!-- 学习小组 -->
        <div class="section-title">
            <h2>推荐学习小组</h2>
            <a href="#">更多 <i class="fas fa-chevron-right"></i></a>
        </div>
        
        <div class="group-card">
            <div class="group-header">
                <div class="group-icon">
                    <i class="fas fa-code"></i>
                </div>
                <div class="group-info">
                    <div class="group-name">前端开发精英组</div>
                    <div class="group-members">
                        <i class="fas fa-users"></i> 24名成员 · 活跃度高
                    </div>
                </div>
            </div>
            <div class="group-tags">
                <div class="group-tag">React</div>
                <div class="group-tag">Vue</div>
                <div class="group-tag">TypeScript</div>
                <div class="group-tag">前端工程化</div>
            </div>
            <div class="group-progress">
                <div class="progress-label">
                    <span>小组活跃度</span>
                    <span>65%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
            </div>
            <button class="group-btn">加入小组</button>
        </div>
        
        <div class="group-card">
            <div class="group-header">
                <div class="group-icon">
                    <i class="fas fa-server"></i>
                </div>
                <div class="group-info">
                    <div class="group-name">后端架构研究组</div>
                    <div class="group-members">
                        <i class="fas fa-users"></i> 18名成员 · 企业导师指导
                    </div>
                </div>
            </div>
            <div class="group-tags">
                <div class="group-tag">Node.js</div>
                <div class="group-tag">微服务</div>
                <div class="group-tag">数据库</div>
                <div class="group-tag">高并发</div>
            </div>
            <div class="group-progress">
                <div class="progress-label">
                    <span>项目完成度</span>
                    <span>45%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 45%"></div>
                </div>
            </div>
            <button class="group-btn">加入小组</button>
        </div>
        
        <!-- 热门问题 -->
        <div class="section-title">
            <h2>热门问答</h2>
            <a href="#">更多 <i class="fas fa-chevron-right"></i></a>
        </div>
        
        <div class="question-card">
            <div class="question-header">
                <div class="question-avatar">张</div>
                <div>
                    <div class="post-user-name">张同学</div>
                    <div class="post-time">3小时前</div>
                </div>
            </div>
            <div class="question-title">
                TypeScript中interface和type的区别是什么？在实际项目中如何选择？
            </div>
            <div class="question-footer">
                <div class="question-stats">
                    <div class="question-stat">
                        <i class="far fa-eye"></i> 328
                    </div>
                    <div class="question-stat">
                        <i class="far fa-comment"></i> 12
                    </div>
                </div>
                <div class="question-stat">
                    <i class="fas fa-coins" style="color: gold;"></i> 悬赏50积分
                </div>
            </div>
        </div>
        
        <div class="question-card">
            <div class="question-header">
                <div class="question-avatar">刘</div>
                <div>
                    <div class="post-user-name">刘同学</div>
                    <div class="post-time">7小时前</div>
                </div>
            </div>
            <div class="question-title">
                如何设计一个高并发的秒杀系统？需要重点考虑哪些技术点？
            </div>
            <div class="question-footer">
                <div class="question-stats">
                    <div class="question-stat">
                        <i class="far fa-eye"></i> 456
                    </div>
                    <div class="question-stat">
                        <i class="far fa-comment"></i> 18
                    </div>
                </div>
                <div class="question-stat">
                    <i class="fas fa-coins" style="color: gold;"></i> 悬赏80积分
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
            --tag-bg: #eef7ff;
        }
        
        body {
            background-color: #f5f7fb;
            color: var(--dark);
            padding-bottom: 80px;
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
        
        .tabs-container {
            display: flex;
            overflow-x: auto;
            padding-bottom: 5px;
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
        
        .tabs-container::-webkit-scrollbar {
            display: none;  /* Chrome, Safari, Opera */
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
        
        /* 社区内容区域 */
        .community-container {
            padding: 15px;
        }
        
        .section-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 20px 0 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--light-gray);
        }
        
        .section-title h2 {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--dark);
        }
        
        .section-title a {
            font-size: 0.9rem;
            color: var(--primary);
            font-weight: 500;
            text-decoration: none;
        }
        
        /* 任务卡片 */
        .task-card {
            background: var(--card-bg);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 15px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            position: relative;
            overflow: hidden;
        }
        
        .task-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 5px;
            height: 100%;
            background: linear-gradient(to bottom, var(--accent), var(--success));
        }
        
        .task-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .task-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--dark);
        }
        
        .task-reward {
            background: linear-gradient(135deg, #ff9a9e, #fad0c4);
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .task-meta {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
            font-size: 0.85rem;
            color: var(--gray);
        }
        
        .task-tags {
            display: flex;
            gap: 8px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }
        
        .task-tag {
            background: var(--tag-bg);
            color: var(--primary);
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
        }
        
        .task-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .task-participants {
            display: flex;
            align-items: center;
        }
        
        .participant-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: linear-gradient(45deg, #a1c4fd, #c2e9fb);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 0.9rem;
            margin-right: -10px;
            border: 2px solid white;
        }
        
        .participant-avatar:nth-child(2) {
            background: linear-gradient(45deg, #ffecd2, #fcb69f);
        }
        
        .participant-avatar:nth-child(3) {
            background: linear-gradient(45deg, #84fab0, #8fd3f4);
        }
        
        .participant-count {
            margin-left: 15px;
            font-size: 0.85rem;
            color: var(--gray);
        }
        
        .task-btn {
            padding: 8px 20px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 20px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .task-btn:hover {
            background: var(--secondary);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(67, 97, 238, 0.3);
        }
        
        /* 帖子卡片 */
        .post-card {
            background: var(--card-bg);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 15px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .post-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .post-avatar {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: linear-gradient(45deg, #ff9a9e, #fad0c4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 1.2rem;
            margin-right: 15px;
        }
        
        .post-user {
            flex: 1;
        }
        
        .post-user-name {
            font-weight: 600;
            margin-bottom: 3px;
        }
        
        .post-meta {
            display: flex;
            align-items: center;
            font-size: 0.8rem;
            color: var(--gray);
        }
        
        .post-time {
            margin-right: 10px;
        }
        
        .post-type {
            background: var(--tag-bg);
            color: var(--primary);
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
        }
        
        .post-content {
            margin-bottom: 15px;
            line-height: 1.6;
        }
        
        .post-image {
            width: 100%;
            border-radius: 12px;
            margin-bottom: 15px;
            height: 180px;
            background: linear-gradient(135deg, #6a11cb, #2575fc);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 500;
        }
        
        .post-actions {
            display: flex;
            gap: 25px;
            font-size: 0.9rem;
            color: var(--gray);
            padding-top: 15px;
            border-top: 1px solid var(--light-gray);
        }
        
        .post-action {
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .post-action:hover {
            color: var(--primary);
        }
        
        /* 小组卡片 */
        .group-card {
            background: var(--card-bg);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 15px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            display: flex;
            flex-direction: column;
        }
        
        .group-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .group-icon {
            width: 60px;
            height: 60px;
            border-radius: 16px;
            background: linear-gradient(135deg, #6a11cb, #2575fc);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            margin-right: 15px;
        }
        
        .group-info {
            flex: 1;
        }
        
        .group-name {
            font-weight: 600;
            font-size: 1.1rem;
            margin-bottom: 5px;
        }
        
        .group-members {
            font-size: 0.85rem;
            color: var(--gray);
            display: flex;
            align-items: center;
        }
        
        .group-members i {
            margin-right: 5px;
        }
        
        .group-tags {
            display: flex;
            gap: 8px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }
        
        .group-tag {
            background: var(--tag-bg);
            color: var(--primary);
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
        }
        
        .group-progress {
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
            width: 65%;
            border-radius: 4px;
        }
        
        .group-btn {
            padding: 8px 20px;
            background: white;
            color: var(--primary);
            border: 1px solid var(--primary);
            border-radius: 20px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
            text-align: center;
            margin-top: 10px;
        }
        
        .group-btn:hover {
            background: var(--primary);
            color: white;
        }
        
        /* 热门问题 */
        .question-card {
            background: var(--card-bg);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 15px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .question-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .question-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(45deg, #a1c4fd, #c2e9fb);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 1rem;
            margin-right: 15px;
        }
        
        .question-title {
            font-weight: 600;
            font-size: 1.05rem;
            margin-bottom: 10px;
        }
        
        .question-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
        }
        
        .question-stats {
            display: flex;
            gap: 15px;
            font-size: 0.85rem;
            color: var(--gray);
        }
        
        .question-stat {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        /* 底部操作栏 */
        .bottom-actions {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            display: flex;
            justify-content: space-around;
            padding: 15px;
            box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.1);
            z-index: 100;
        }
        
        .action-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: var(--gray);
            text-decoration: none;
            font-size: 0.75rem;
        }
        
        .action-btn i {
            font-size: 1.3rem;
            margin-bottom: 5px;
        }
        
        .action-btn.active {
            color: var(--primary);
        }
        
        .publish-btn {
            background: linear-gradient(135deg, var(--primary), var(--accent));
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            margin-top: -30px;
            box-shadow: 0 4px 15px rgba(67, 97, 238, 0.4);
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .publish-btn:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 20px rgba(67, 97, 238, 0.5);
        }
        
        /* 响应式调整 */
        @media (max-width: 480px) {
            .tabs-container {
                gap: 5px;
            }
            
            .tab {
                padding: 6px 12px;
                font-size: 0.8rem;
            }
            
            .post-image {
                height: 150px;
            }
        }
</style>