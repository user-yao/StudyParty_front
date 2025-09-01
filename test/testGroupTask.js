// 测试groupTask store模块
import store from '../store/index.js'

// 模拟API返回的数据
const mockApiResponse = {
  code: 200,
  data: {
    records: [
      {
        id: 1,
        groupTask: "完成React项目开发",
        groupTaskUploader: "姚镇涛",
        groupTaskUploaderId: 3,
        groupTaskStartTime: "2025-08-25T11:33:43.000+00:00",
        groupTaskLastTime: "2025-09-25T11:33:43.000+00:00",
        groupTaskFinish: 5,
        groupTaskUnfinished: 3,
        createTime: "2025-08-25T11:33:43.000+00:00"
      },
      {
        id: 2,
        groupTask: "学习Vue3新特性",
        groupTaskUploader: "李明",
        groupTaskUploaderId: 5,
        groupTaskStartTime: "2025-08-20T11:33:43.000+00:00",
        groupTaskLastTime: "2025-09-10T11:33:43.000+00:00",
        groupTaskFinish: 3,
        groupTaskUnfinished: 5,
        createTime: "2025-08-20T11:33:43.000+00:00"
      }
    ]
  }
};

console.log("=== 测试groupTask模块 ===");

// 测试初始状态
console.log("初始groupTasks:", store.state.groupTask.groupTasks);

// 测试SET_GROUP_TASKS mutation
console.log("\n=== 测试SET_GROUP_TASKS mutation ===");
store.commit('groupTask/SET_GROUP_TASKS', mockApiResponse.data);
console.log("设置数据后groupTasks:", store.state.groupTask.groupTasks);

// 测试任务状态计算
console.log("\n=== 测试任务状态计算 ===");
const testTask = {
  groupTaskStartTime: "2025-08-25T11:33:43.000+00:00",
  groupTaskLastTime: "2025-09-25T11:33:43.000+00:00"
};

// 模拟当前时间在任务期间
const now = new Date();
const startTime = new Date(testTask.groupTaskStartTime);
const endTime = new Date(testTask.groupTaskLastTime);

console.log("当前时间:", now);
console.log("开始时间:", startTime);
console.log("结束时间:", endTime);

if (now < startTime) {
  console.log("任务状态: 未开始");
} else if (now > endTime) {
  console.log("任务状态: 已结束");
} else {
  console.log("任务状态: 进行中");
}

console.log("=== 测试完成 ===");