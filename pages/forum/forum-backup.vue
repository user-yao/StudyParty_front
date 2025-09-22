      color: #909193;
}

.article-content {
  margin-bottom: 15px;
}

.article-title {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 8px;
  line-height: 1.4;
}

.article-summary {
  font-size: 0.9rem;
  color: #606266;
  line-height: 1.5;
}

.article-meta {
  display: flex;
  gap: 20px;
  padding-top: 12px;
  border-top: 1px solid #e4e7ed;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  color: #909193;
  cursor: pointer;
}

.meta-item:hover {
  color: #4361ee;
}

/* 任务卡片 */
.task-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s;
  border-left: 4px solid #4361ee;
}

.task-card:last-child {
  margin-bottom: 0;
}

.task-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.task-title {
  font-weight: 600;
  font-size: 1rem;
  color: #303133;
}

.task-reward {
  background: linear-gradient(135deg, #ff9a9e, #fad0c4);
  color: white;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.task-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 12px;
  font-size: 0.85rem;
  color: #909193;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-item i {
  margin-right: 5px;
  font-size: 0.8rem;
}

.task-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.task-tag {
  background: #eef7ff;
  color: #4361ee;
  padding: 4px 10px;
  border-radius: 15px;
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
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.8rem;
  margin-right: -8px;
  border: 2px solid white;
  z-index: 1;
}

.participant-avatar.avatar-1 {
  background: linear-gradient(45deg, #a1c4fd, #c2e9fb);
  z-index: 3;
}

.participant-avatar.avatar-2 {
  background: linear-gradient(45deg, #ffecd2, #fcb69f);
  z-index: 2;
}

.participant-avatar.avatar-3 {
  background: linear-gradient(45deg, #84fab0, #8fd3f4);
  z-index: 1;
}

.participant-count {
  margin-left: 10px;
  font-size: 0.85rem;
  color: #909193;
}

.join-btn {
  padding: 6px 15px;
  background: #4361ee;
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
}

.join-btn:hover {
  background: #3a56e4;
}

/* 帖子卡片 */
.post-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s;
  border-left: 4px solid #4895ef;
}

.post-card:last-child {
  margin-bottom: 0;
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  font-size: 1.1rem;
  margin-right: 12px;
}

.post-user {
  flex: 1;
}

.post-user-name {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 2px;
}

.post-user-title {
  font-size: 0.8rem;
  color: #909193;
}

.post-type {
  background: #eef7ff;
  color: #4361ee;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
}

.post-content {
  margin-bottom: 12px;
  line-height: 1.5;
  font-size: 0.9rem;
  color: #606266;
}

.post-time {
  font-size: 0.8rem;
  color: #909193;
  margin-bottom: 12px;
}

.post-actions {
  display: flex;
  gap: 20px;
  padding-top: 12px;
  border-top: 1px solid #e4e7ed;
}

.post-action {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  color: #909193;
  cursor: pointer;
}

.post-action:hover {
  color: #4361ee;
}

/* 小组卡片 */
.group-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s;
  border-left: 4px solid #4cc9f0;
}

.group-card:last-child {
  margin-bottom: 0;
}

.group-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.group-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.group-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.3rem;
  margin-right: 12px;
}

.group-info {
  flex: 1;
}

.group-name {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 5px;
}

.group-meta {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: #909193;
}

.group-meta i {
  margin-right: 5px;
  font-size: 0.8rem;
}

.group-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.group-tag {
  background: #eef7ff;
  color: #4361ee;
  padding: 4px 10px;
  border-radius: 15px;
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
  color: #909193;
}

.progress-bar {
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4895ef, #4cc9f0);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.group-action-btn {
  width: 100%;
  padding: 8px;
  background: #4361ee;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.group-action-btn.joined {
  background: #e9ecef;
  color: #606266;
  cursor: not-allowed;
}

/* 问题卡片 */
.question-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s;
  border-left: 4px solid #f72585;
}

.question-card:last-child {
  margin-bottom: 0;
}

.question-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.question-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.question-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(45deg, #a1c4fd, #c2e9fb);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  margin-right: 12px;
}

.question-user {
  flex: 1;
}

.question-user-name {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 2px;
}

.question-time {
  font-size: 0.8rem;
  color: #909193;
}

.question-title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 15px;
  line-height: 1.4;
}

.question-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.question-stats {
  display: flex;
  gap: 15px;
}

.question-stat {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  color: #909193;
}

.question-reward {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  color: #ffa500;
  font-weight: 500;
}

/* 发布按钮 */
.publish-btn {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4361ee, #4895ef);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 4px 15px rgba(67, 97, 238, 0.4);
  cursor: pointer;
  transition: all 0.3s;
  z-index: 99;
}

.publish-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 20px rgba(67, 97, 238, 0.5);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .header {
    padding: 12px 15px 8px;
  }
  
  .logo {
    font-size: 1.2rem;
  }
  
  .logo i {
    font-size: 1.4rem;
  }
  
  .community-container {
    padding: 10px;
  }
  
  .section {
    padding: 15px;
  }
  
  .publish-btn {
    width: 50px;
    height: 50px;
    bottom: 70px;
  }
}
</style>