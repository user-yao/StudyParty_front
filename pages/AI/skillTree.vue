<template>
  <view class="container">
    <!-- 顶部导航 -->
    <header>
      <div class="header-top">
        <div class="logo">
          <u-icon name="arrow-left" size="20" color="#ffffff" @click="goBack"></u-icon>
          <span>技能树</span>
        </div>
        <div class="header-actions">
        </div>
      </div>
    </header>
    
    <view class="content">
      <view class="occupation-input">
        <view class="input-section">
          <text class="label">目标职业</text>
          <view class="input-wrapper">
            <input 
              v-model="targetOccupation"
              placeholder="请输入您想从事的职业"
              class="native-input"
            />
            <u-button 
            style="width: 200rpx;"
              type="primary" 
              size="normal" 
              icon="search"
              @click="generateSkillTree"
              :loading="loading"
            >
              生成
            </u-button>
          </view>
        </view>
      </view>
      
      <view class="skill-tree-container" v-if="skillData.occupation">
        <view class="tree-header">
          <view class="occupation-info">
            <u-tag 
              text="目标职业" 
              type="primary" 
              size="mini" 
              plain
            ></u-tag>
            <text class="occupation-name">{{ skillData.occupation }}</text>
          </view>
          <text class="data-source" v-if="skillData.data_source">
            数据来源：{{ skillData.data_source }}
          </text>
        </view>
        
        <view class="skill-tree-list">
          <view 
            class="skill-level-item" 
            v-for="(level, index) in skillData.skill_tree" 
            :key="index"
          >
            <view class="level-header">
              <view class="level-badge">
                <text class="level-text">L{{ level.level }}</text>
              </view>
              <text class="level-topic">{{ level.topic }}</text>
            </view>
            
            <view class="sub-topics">
              <view 
                class="sub-topic-item" 
                v-for="(subTopic, subIndex) in level.sub_topics" 
                :key="subIndex"
              >
                <u-icon name="checkmark-circle" size="16" color="#4361ee"></u-icon>
                <text class="sub-topic-text">{{ subTopic }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <view class="empty-state" v-else>
        <u-empty 
          mode="data" 
          text="请输入目标职业并生成技能树" 
          icon="http://cdn.uviewui.com/uview/empty/data.png"
        >
        </u-empty>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      targetOccupation: '',
      loading: false,
      skillData: {
        occupation: '',
        skill_tree: [],
        data_source: ''
      }
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    generateSkillTree() {
      if (!this.targetOccupation.trim()) {
        uni.showToast({
          title: '请输入目标职业',
          icon: 'none'
        })
        return
      }
      
      this.loading = true
      
      // 模拟API请求
      setTimeout(() => {
        // 模拟数据
        const mockData = this.getMockData()
        this.skillData = mockData.data
        this.loading = false
        
        uni.showToast({
          title: '技能树生成成功',
          icon: 'success'
        })
      }, 1500)
    },
    getMockData() {
      // 根据输入的职业返回不同的模拟数据
      if (this.targetOccupation.includes('Java') || this.targetOccupation.includes('java') || this.targetOccupation.includes('开发')) {
        return {
          code: 200,
          msg: "操作成功",
          data: {
            occupation: this.targetOccupation,
            skill_tree: [
              {
                level: 1,
                topic: "Java基础",
                sub_topics: [
                  "JavaSE核心语法",
                  "面向对象编程（OOP）",
                  "异常处理机制",
                  "集合框架（List、Map、Set）",
                  "泛型与反射"
                ]
              },
              {
                level: 2,
                topic: "数据结构与算法",
                sub_topics: [
                  "数组与字符串操作",
                  "链表与双向链表",
                  "栈与队列",
                  "二叉树与二叉搜索树",
                  "排序与查找算法",
                  "动态规划基础"
                ]
              },
              {
                level: 3,
                topic: "Java进阶技术",
                sub_topics: [
                  "多线程与并发编程（Thread、Executor、AQS）",
                  "JVM原理与调优（内存模型、GC机制）",
                  "NIO与Netty基础",
                  "设计模式（单例、工厂、观察者等）"
                ]
              },
              {
                level: 4,
                topic: "主流框架与微服务",
                sub_topics: [
                  "Spring Framework（Core、MVC、AOP）",
                  "Spring Boot快速开发",
                  "Spring Cloud微服务架构（Eureka、Feign、Gateway、Config）",
                  "MyBatis / MyBatis-Plus ORM框架"
                ]
              },
              {
                level: 5,
                topic: "数据库与中间件",
                sub_topics: [
                  "MySQL高级特性（索引优化、事务隔离、分库分表）",
                  "Redis缓存应用与集群部署",
                  "Kafka消息队列使用",
                  "Elasticsearch全文检索"
                ]
              },
              {
                level: 6,
                topic: "DevOps与工程实践",
                sub_topics: [
                  "Maven/Gradle项目构建工具",
                  "Git版本控制与协作流程",
                  "Docker容器化部署",
                  "Jenkins持续集成/持续部署（CI/CD）",
                  "Kubernetes基础"
                ]
              }
            ],
            data_source: "智联招聘2024年Q3行业报告、Boss直聘2024年岗位要求分析、拉勾网2024年Java开发职位趋势"
          }
        }
      } else if (this.targetOccupation.includes('产品') || this.targetOccupation.includes('Product') || this.targetOccupation.includes('经理')) {
        return {
          code: 200,
          msg: "操作成功",
          data: {
            occupation: this.targetOccupation,
            skill_tree: [
              {
                level: 1,
                topic: "产品基础知识",
                sub_topics: [
                  "产品生命周期管理",
                  "用户体验设计基础",
                  "市场调研与用户分析",
                  "竞品分析方法",
                  "产品需求文档（PRD）撰写"
                ]
              },
              {
                level: 2,
                topic: "产品设计与原型",
                sub_topics: [
                  "Axure RP原型设计",
                  "流程图与思维导图制作",
                  "交互设计原则",
                  "视觉设计基础",
                  "可用性测试方法"
                ]
              },
              {
                level: 3,
                topic: "数据分析与决策",
                sub_topics: [
                  "Google Analytics使用",
                  "数据埋点与分析",
                  "A/B测试设计与分析",
                  "数据可视化工具",
                  "业务指标体系构建"
                ]
              },
              {
                level: 4,
                topic: "项目管理与协作",
                sub_topics: [
                  "敏捷开发流程",
                  "Scrum项目管理",
                  "Jira项目跟踪工具",
                  "跨部门沟通协调",
                  "资源规划与分配"
                ]
              },
              {
                level: 5,
                topic: "商业模式与战略",
                sub_topics: [
                  "商业模式画布",
                  "SWOT分析",
                  "产品定位策略",
                  "市场进入策略",
                  "盈利模式设计"
                ]
              }
            ],
            data_source: "人人都是产品经理2024年度报告、PMCAFF产品社区调研、腾讯CDC用户体验报告"
          }
        }
      } else if (this.targetOccupation.includes('设计') || this.targetOccupation.includes('UI') || this.targetOccupation.includes('UX')) {
        return {
          code: 200,
          msg: "操作成功",
          data: {
            occupation: this.targetOccupation,
            skill_tree: [
              {
                level: 1,
                topic: "设计基础",
                sub_topics: [
                  "设计原则与规范",
                  "色彩理论与搭配",
                  "排版与字体设计",
                  "构图与视觉层次",
                  "设计工具使用（Figma、Sketch等）"
                ]
              },
              {
                level: 2,
                topic: "交互设计",
                sub_topics: [
                  "用户体验研究方法",
                  "用户画像与场景分析",
                  "信息架构设计",
                  "交互原型制作",
                  "可用性测试"
                ]
              },
              {
                level: 3,
                topic: "视觉设计",
                sub_topics: [
                  "品牌视觉识别系统",
                  "移动端界面设计",
                  "Web端界面设计",
                  "动效设计基础",
                  "设计系统构建"
                ]
              },
              {
                level: 4,
                topic: "前端实现",
                sub_topics: [
                  "HTML/CSS基础",
                  "响应式设计",
                  "设计稿还原",
                  "前端协作流程",
                  "设计规范落地"
                ]
              },
              {
                level: 5,
                topic: "数据分析与优化",
                sub_topics: [
                  "用户行为分析",
                  "A/B测试设计",
                  "数据驱动设计",
                  "设计效果评估",
                  "持续优化策略"
                ]
              }
            ],
            data_source: "Dribbble设计趋势报告、Behance优秀作品分析、Google Design Guidelines"
          }
        }
      } else {
        // 默认数据 - 更通用的技能树
        return {
          code: 200,
          msg: "操作成功",
          data: {
            occupation: this.targetOccupation,
            skill_tree: [
              {
                level: 1,
                topic: "行业认知",
                sub_topics: [
                  "目标行业发展现状",
                  "核心技能要求分析",
                  "职业发展路径规划",
                  "薪资水平与前景",
                  "必备工具与资源"
                ]
              },
              {
                level: 2,
                topic: "基础技能",
                sub_topics: [
                  "专业知识体系构建",
                  "核心工具掌握",
                  "实践项目积累",
                  "学习资源整合",
                  "技能认证获取"
                ]
              },
              {
                level: 3,
                topic: "进阶能力",
                sub_topics: [
                  "问题解决能力",
                  "团队协作技巧",
                  "项目管理方法",
                  "沟通表达能力",
                  "创新思维培养"
                ]
              },
              {
                level: 4,
                topic: "专业深化",
                sub_topics: [
                  "行业前沿技术",
                  "专家级知识掌握",
                  "领导力培养",
                  "影响力构建",
                  "战略布局思维"
                ]
              }
            ],
            data_source: "综合行业报告与职位分析"
          }
        }
      }
    }
  }
}
</script>

<style scoped>
/* 顶部导航 */
header {
  background: linear-gradient(135deg, #4361ee, #3f37c9);
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

.header-actions {
  display: flex;
  gap: 20px;
  align-items: center;
}

.header-actions i {
  font-size: 1.3rem;
  cursor: pointer;
}

.container {
  min-height: 100vh;
  background-color: #f5f7fb;
}

.content {
  padding: 15px;
  padding-top: 20px;
}

.occupation-input {
  background: white;
  padding: 15px;
  margin-bottom: 15px;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.label {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.native-input {
  width: 80%;
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid #dcdfe6;
  font-size: 14px;
  outline: none;
  border-radius: 4px;
}

.native-input:focus {
  border-color: #4361ee;
}

.input-wrapper :deep(.u-button) {
  padding: 0 12px;
  height: 36px;
  border-radius: 4px;
}

.skill-tree-container {
  background: white;
  padding: 15px;
}

.tree-header {
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
}

.occupation-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.occupation-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.data-source {
  font-size: 12px;
  color: #999;
}

.skill-tree-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skill-level-item {
  display: flex;
  flex-direction: column;
}

.level-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.level-badge {
  background: linear-gradient(135deg, #4361ee, #3f37c9);
  border-radius: 20px;
  padding: 4px 12px;
}

.level-text {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.level-topic {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.sub-topics {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 30px;
}

.sub-topic-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.sub-topic-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.empty-state {
  background: white;
  padding: 30px 15px;
  text-align: center;
}

.empty-state :deep(.u-empty) {
  padding: 15px 0;
}
</style>