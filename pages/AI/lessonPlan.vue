<template>
  <view class="container">
    <!-- 顶部导航 -->
    <header>
      <div class="header-top">
        <div class="logo">
          <u-icon name="arrow-left" size="20" color="#ffffff" @click="goBack"></u-icon>
          <span>教案修改</span>
        </div>
        <div class="header-actions">
        </div>
      </div>
    </header>
    
    <view class="content">
      <view class="lesson-form">
        <view class="form-section">
          <view class="section-title">教案内容输入</view>
          <view class="form-item">
            <text class="label">请输入当前教案内容</text>
            <u--textarea
              v-model="currentLessonContent"
              placeholder="请在此输入您需要检查的教案内容，系统将分析并提供优化建议..."
              border="surround"
              autoHeight
              :height="150"
            ></u--textarea>
          </view>
          
          <view class="form-actions">
            <u-button 
              type="primary" 
              size="normal"
              @click="generateSuggestions"
              :loading="loading"
            >
              生成优化建议
            </u-button>
          </view>
        </view>
        
        <view class="suggestions-section" v-if="analysisResult.outdated_sections.length > 0">
          <view class="section-title">优化建议</view>
          <view class="suggestions-list">
            <view 
              class="suggestion-item" 
              v-for="(item, index) in analysisResult.outdated_sections" 
              :key="index"
            >
              <view class="suggestion-header">
                <u-tag 
                  :text="getIssueTypeText(item.issue_type)" 
                  :type="getIssueTypeColor(item.issue_type)"
                  size="mini"
                ></u-tag>
                <text class="suggestion-index">建议 {{ index + 1 }}</text>
              </view>
              
              <view class="suggestion-content">
                <view class="content-section">
                  <text class="section-label">原文内容</text>
                  <view class="content-text original-content">
                    <text>{{ item.original_content }}</text>
                  </view>
                </view>
                
                <view class="content-section">
                  <text class="section-label">问题说明</text>
                  <view class="content-text reason-content">
                    <text>{{ item.revision_reason }}</text>
                  </view>
                </view>
                
                <view class="content-section">
                  <text class="section-label">优化建议</text>
                  <view class="content-text suggested-content">
                    <text>{{ item.suggested_revision }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        
        <view class="empty-state" v-else-if="analysisCompleted">
          <u-empty 
            mode="permission" 
            text="未发现需要优化的内容" 
            icon="http://cdn.uviewui.com/uview/empty/permission.png"
          >
            <u-button 
              slot="bottom" 
              type="primary" 
              icon="checkmark-circle"
              size="small"
            >
              教案内容良好
            </u-button>
          </u-empty>
        </view>
        
        <view class="empty-state" v-else>
          <u-empty 
            mode="data" 
            text="请输入教案内容并点击生成按钮" 
            icon="http://cdn.uviewui.com/uview/empty/data.png"
          >
          </u-empty>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentLessonContent: '',
      loading: false,
      analysisCompleted: false,
      analysisResult: {
        outdated_sections: []
      }
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    generateSuggestions() {
      if (!this.currentLessonContent.trim()) {
        uni.showToast({
          title: '请输入教案内容',
          icon: 'none'
        })
        return
      }
      
      this.loading = true
      this.analysisCompleted = false
      
      // 模拟API请求
      setTimeout(() => {
        // 模拟数据
        const mockData = this.getMockData()
        this.analysisResult = mockData.data
        this.analysisCompleted = true
        this.loading = false
        
        uni.showToast({
          title: `发现${this.analysisResult.outdated_sections.length}个优化点`,
          icon: 'success'
        })
      }, 2000)
    },
    getMockData() {
      // 返回示例数据
      return {
        code: 200,
        msg: "操作成功",
        data: {
          outdated_sections: [
            {
              original_content: "展示生活中的 Java 应用场景：打开手机中的微信、支付宝 APP，电脑上的 Eclipse 开发工具、企业级网站（如京东、淘宝的后端服务）",
              issue_type: "数据过时",
              suggested_revision: "替换为：展示企业级 Java 应用场景，如 Spring Boot 开发的电商平台后端（如京东商品服务模块）、银行核心系统、Android 应用（说明 Java 仍是 Android 开发基础语言），并补充说明微信/支付宝等 App 的部分后端服务使用 Java",
              revision_reason: "微信/支付宝的客户端已主要采用 React Native 或 Flutter 开发，前端非 Java 技术栈；需准确区分后端服务与客户端技术，避免误导学生。当前企业级 Java 应用更典型的是微服务架构（如 Spring Cloud）和 Android 原生开发基础。"
            },
            {
              original_content: "JDK 安装包（适配 Windows 系统，如 JDK 17）... 演示 JDK 安装步骤：打开浏览器，进入 Oracle 官网... 找到 JDK 17 的 Windows 版本安装包",
              issue_type: "资源失效",
              suggested_revision: "将 Oracle 官网替换为推荐 Adoptium (Eclipse Temurin) 或 Amazon Corretto 的 LTS 版本下载源，并明确说明：'因 Oracle JDK 商业使用限制，教学推荐使用开源免费的 Adoptium JDK 17（https://adoptium.net/）'",
              revision_reason: "Oracle 自 JDK 17 起对商业用途收费，且官网下载需登录账号；开源社区主流教学已转向 Adoptium 等免费发行版，避免学生后续开发产生许可问题。"
            },
            {
              original_content: "注意不要勾选 '安装 JRE'（JDK 17 已集成 JRE）",
              issue_type: "标准更新",
              suggested_revision: "删除此说明，改为：'JDK 9 起已移除独立 JRE 概念，JDK 自带运行环境，安装时无需额外操作'",
              revision_reason: "JDK 9 开始模块化后已无独立 JRE 组件，'集成 JRE' 表述错误。当前 JDK 版本（8+）均无单独 JRE 安装选项，该提示易引发概念混淆。"
            },
            {
              original_content: "用记事本编写第一个程序... 新建一个文本文档，重命名为 'HelloJava.java'（注意后缀名改为.java，需关闭 '隐藏已知文件类型的扩展名'）",
              issue_type: "方法陈旧",
              suggested_revision: "将记事本替换为 VS Code 作为主要入门工具：'使用 VS Code 安装 Java Extension Pack，新建 HelloJava.java 文件（无需手动修改扩展名），通过内置终端编译运行'",
              revision_reason: "记事本无语法高亮/错误检查，易因隐藏扩展名导致 .java.txt 错误；VS Code 轻量级且提供智能提示，符合现代开发习惯，降低初学者挫败感。"
            },
            {
              original_content: "用 Eclipse 编写程序（简要演示）：打开 Eclipse，新建 Java 项目... 勾选 'public static void main (String [] args)'",
              issue_type: "资源失效",
              suggested_revision: "将 Eclipse 替换为 IntelliJ IDEA Community Edition 演示，并更新步骤：'安装 IntelliJ → Create New Project → 选择 'Java' → 勾选 'Create project from template' → 选 'Command Line App''",
              revision_reason: "Eclipse 界面复杂且启动慢，新手易困惑；IntelliJ Community 版对教育更友好（内置教学工具），且 2023 年调查显示其使用率超 Eclipse 3 倍（JetBrains 开发者生态报告）。"
            },
            {
              original_content: "环境变量配置：... 变量值输入 JDK 安装路径（如 D:\\Java\\jdk-17）... 避免中文路径和空格",
              issue_type: "标准更新",
              suggested_revision: "更新路径示例为：'C:\\Program Files\\Java\\jdk-17.0.10'，并删除 '避免中文路径' 提示，补充说明：'JDK 9+ 已支持中文路径，但建议使用无空格路径避免旧工具兼容问题'",
              revision_reason: "JDK 9 起已修复中文路径问题，且 Windows 默认安装路径含空格（Program Files）；保留旧提示传递过时知识，实际开发中需处理空格路径（如用引号包裹）。"
            },
            {
              original_content: "拓展作业：查阅资料，了解 Java 的历史版本（如 JDK 8、JDK 11、JDK 17 的区别）",
              issue_type: "标准更新",
              suggested_revision: "修改为：'对比 JDK 8、11、17 的 LTS 特性差异，重点说明：1) 模块化 (JDK 9) 2) 局部变量类型推断 (var, JDK 10) 3) 新垃圾回收器 (ZGC, JDK 15) 4) 密封类 (JDK 17)'",
              revision_reason: "学生易陷入版本号罗列而忽略技术演进逻辑；需聚焦 LTS 版本关键特性（如模块化、var 关键字），关联企业实际升级动因（如 JDK 8→17 的 GC 性能提升）。"
            }
          ]
        }
      }
    },
    getIssueTypeText(type) {
      const typeMap = {
        '数据过时': '数据过时',
        '资源失效': '资源失效',
        '标准更新': '标准更新',
        '方法陈旧': '方法陈旧'
      }
      return typeMap[type] || type
    },
    getIssueTypeColor(type) {
      const colorMap = {
        '数据过时': 'error',
        '资源失效': 'warning',
        '标准更新': 'primary',
        '方法陈旧': 'info'
      }
      return colorMap[type] || 'default'
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

.page-title {
  margin-bottom: 20px;
}

.title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 6px;
}

.subtitle {
  font-size: 13px;
  color: #666;
}

.lesson-form {
  background: white;
  padding: 15px;
}

.form-section {
  margin-bottom: 20px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.form-item {
  margin-bottom: 15px;
}

.form-item:last-child {
  margin-bottom: 0;
}

.label {
  display: block;
  font-size: 13px;
  color: #333;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-actions {
  margin-top: 15px;
  text-align: center;
}

.suggestions-section {
  margin-top: 25px;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.suggestion-item {
  border-left: 3px solid #eee;
  padding-left: 10px;
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

.suggestion-index {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.suggestion-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 10px 0 15px 0;
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-label {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.content-text {
  font-size: 13px;
  line-height: 1.5;
  padding: 8px 0;
}

.original-content {
  color: #e53935;
}

.reason-content {
  color: #1e88e5;
}

.suggested-content {
  color: #43a047;
}

.empty-state {
  padding: 20px 0;
  text-align: center;
}

.empty-state :deep(.u-empty) {
  padding: 15px 0;
}

:deep(.u-button--primary) {
  background: linear-gradient(135deg, #4361ee, #3f37c9);
  border: none;
}

:deep(.u-button--primary--loading) {
  background: linear-gradient(135deg, #4361ee, #3f37c9);
}
</style>