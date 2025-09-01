// 测试任务状态图标功能
const testTaskStatus = {
  // 测试用的任务数据
  testTasks: [
    {
      id: 1,
      groupTask: "未开始的任务",
      groupTaskStartTime: new Date(Date.now() + 86400000).toISOString(), // 明天
      groupTaskLastTime: new Date(Date.now() + 172800000).toISOString()  // 后天
    },
    {
      id: 2,
      groupTask: "进行中的任务",
      groupTaskStartTime: new Date(Date.now() - 86400000).toISOString(), // 昨天
      groupTaskLastTime: new Date(Date.now() + 86400000).toISOString()   // 明天
    },
    {
      id: 3,
      groupTask: "已结束的任务",
      groupTaskStartTime: new Date(Date.now() - 172800000).toISOString(), // 前天
      groupTaskLastTime: new Date(Date.now() - 86400000).toISOString()    // 昨天
    },
    {
      id: 4,
      groupTask: "没有开始时间的任务",
      groupTaskLastTime: new Date(Date.now() + 86400000).toISOString()    // 明天
    },
    {
      id: 5,
      groupTask: "没有时间信息的任务"
    }
  ],

  // 模拟 getTaskStatusIcon 方法
  getTaskStatusIcon(task) {
    if (!task) {
      return '/static/groupInfo/dengdai.png';
    }
    
    // 获取任务开始时间和结束时间（支持两种格式）
    const startTime = task.groupTaskStartTime || task.group_task_start_time;
    const endTime = task.groupTaskLastTime || task.group_task_last_time;
    const currentTime = new Date();
    
    // 如果没有开始时间，默认为等待状态
    if (!startTime) {
      return '/static/groupInfo/dengdai.png';
    }
    
    // 将时间字符串转换为 Date 对象
    const taskStartTime = new Date(startTime);
    const taskEndTime = endTime ? new Date(endTime) : null;
    
    // 判断任务状态
    if (currentTime < taskStartTime) {
      // 当前时间小于开始时间，任务未开始（等待状态）
      return '/static/groupInfo/dengdai.png';
    } else if (taskEndTime && currentTime > taskEndTime) {
      // 当前时间大于结束时间，任务已结束
      return '/static/groupInfo/jieshu.png';
    } else {
      // 开始时间 <= 当前时间 <= 结束时间，任务进行中
      return '/static/groupInfo/jinxingzhong.png';
    }
  },

  // 运行测试
  runTests() {
    console.log("开始测试任务状态图标功能...\n");
    
    this.testTasks.forEach((task, index) => {
      const statusIcon = this.getTaskStatusIcon(task);
      const statusText = this.getStatusText(task);
      console.log(`测试 ${index + 1}: ${task.groupTask}`);
      console.log(`  状态图标: ${statusIcon}`);
      console.log(`  状态文本: ${statusText}\n`);
    });
  },

  // 获取状态文本（用于测试验证）
  getStatusText(task) {
    if (!task) {
      return '未知状态';
    }
    
    const startTime = task.groupTaskStartTime || task.group_task_start_time;
    const endTime = task.groupTaskLastTime || task.group_task_last_time;
    const currentTime = new Date();
    
    if (!startTime) {
      return '等待中';
    }
    
    const taskStartTime = new Date(startTime);
    const taskEndTime = endTime ? new Date(endTime) : null;
    
    if (currentTime < taskStartTime) {
      return '未开始';
    } else if (taskEndTime && currentTime > taskEndTime) {
      return '已结束';
    } else {
      return '进行中';
    }
  }
};

// 运行测试
testTaskStatus.runTests();

export default testTaskStatus;