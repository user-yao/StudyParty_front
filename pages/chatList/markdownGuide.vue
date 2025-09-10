<template>
	<view class="container">
		<!-- 顶部导航 -->
		<header class="app-header">
			<div class="header-top">
				<div class="logo">
					<u-icon name="arrow-left" size="24" color="#ffffff" @click="goBack"></u-icon>
					<span>Markdown语法教程</span>
				</div>
			</div>
		</header>

		<!-- 白色背景容器 -->
		<div class="white-background">
			<!-- 内容区域 -->
			<scroll-view 
				class="content-scroll" 
				scroll-y="true" 
				enable-flex="true">
				<div class="content">
					<div class="guide-container">
						<h2>Markdown 语法指南</h2>
						
						<h3>标题</h3>
						<pre class="code-block"># 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题</pre>
						<div class="preview">
							<u-markdown :content="titleExample"></u-markdown>
						</div>
						
						<h3>强调</h3>
						<pre class="code-block">*斜体* 或 _斜体_
**粗体** 或 __粗体__
***粗斜体*** 或 ___粗斜体___
~~删除线~~</pre>
						<div class="preview">
							<u-markdown :content="emphasisExample"></u-markdown>
						</div>
						
						<h3>列表</h3>
						<h4>无序列表</h4>
						<pre class="code-block">- 项目1
- 项目2
  - 子项目2.1
  - 子项目2.2</pre>
						<div class="preview">
							<u-markdown :content="unorderedListExample"></u-markdown>
						</div>
						
						<h4>有序列表</h4>
						<pre class="code-block">1. 第一项
2. 第二项
3. 第三项</pre>
						<div class="preview">
							<u-markdown :content="orderedListExample"></u-markdown>
						</div>
						
						<h3>链接和图片</h3>
						<pre class="code-block">[链接文本](URL)
![图片描述](图片URL)</pre>
						<div class="preview">
							<u-markdown :content="linkExample"></u-markdown>
						</div>
						
						<h3>代码</h3>
						<h4>行内代码</h4>
						<pre class="code-block">使用 `code` 来表示行内代码</pre>
						<div class="preview">
							<u-markdown :content="inlineCodeExample"></u-markdown>
						</div>
						
						<h4>代码块</h4>
						<pre class="code-block">```javascript
console.log('Hello, World!');
```</pre>
						<div class="preview">
							<u-markdown :content="codeBlockExample"></u-markdown>
						</div>
						
						<h3>引用</h3>
						<pre class="code-block">> 这是一个引用
> 
> 引用可以跨越多行</pre>
						<div class="preview">
							<u-markdown :content="blockquoteExample"></u-markdown>
						</div>
						
						<h3>分割线</h3>
						<pre class="code-block">---</pre>
						<div class="preview">
							<u-markdown :content="dividerExample"></u-markdown>
						</div>
					</div>
				</div>
			</scroll-view>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				titleExample: `# 一级标题
## 二级标题
### 三级标题`,
				
				emphasisExample: `*斜体* **粗体** ***粗斜体*** ~~删除线~~`,
				
				unorderedListExample: `- 项目1
- 项目2
  - 子项目2.1
  - 子项目2.2`,
				
				orderedListExample: `1. 第一项
2. 第二项
3. 第三项`,
				
				linkExample: `[studyParty学习平台](https://example.com)
![示例图片](https://example.com/image.png)`,
				
				inlineCodeExample: `使用 \`code\` 来表示行内代码`,
				
				codeBlockExample: `\`\`\`javascript
console.log('Hello, World!');
\`\`\``,
				
				blockquoteExample: `> 这是一个引用
> 
> 引用可以跨越多行`,
				
				dividerExample: `---`
			}
		},
		methods: {
			goBack() {
				uni.navigateBack();
			}
		}
	}
</script>

<style scoped>
	.container {
		min-height: 100vh;
		background-color: #f5f7fb;
	}

	.white-background {
		background-color: #ffffff;
		min-height: 100vh;
		padding-bottom: 20px;
	}

	.content-scroll {
		height: calc(100vh - 120px);
	}

	.content {
		padding: 20px;
	}

	.app-header {
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

	.logo u-icon {
		margin-right: 8px;
	}

	.guide-container {
		padding: 10px;
	}

	.guide-container h2 {
		text-align: center;
		margin-bottom: 30px;
		color: #333;
	}

	.guide-container h3 {
		margin-top: 25px;
		margin-bottom: 15px;
		color: #444;
		border-left: 4px solid #4361ee;
		padding-left: 10px;
	}

	.guide-container h4 {
		margin-top: 20px;
		margin-bottom: 10px;
		color: #555;
	}

	.code-block {
		background-color: #f8f9fa;
		border: 1px solid #e9ecef;
		border-radius: 4px;
		padding: 12px;
		font-family: 'Courier New', monospace;
		font-size: 14px;
		overflow-x: auto;
		margin: 10px 0;
	}

	.preview {
		background-color: #ffffff;
		border: 1px solid #e9ecef;
		border-radius: 4px;
		padding: 15px;
		margin: 10px 0 20px 0;
	}
</style>