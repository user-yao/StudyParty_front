<template>
	<view class="container">
		<!-- 顶部导航 -->
		<header class="app-header">
			<div class="header-top">
				<div class="logo">
					<u-icon name="arrow-left" size="24" color="#ffffff" @click="goBack"></u-icon>
					<span>预览</span>
				</div>
			</div>
		</header>

		<!-- 内容区域 -->
		<scroll-view 
			class="content-scroll" 
			scroll-y="true" 
			enable-flex="true">
			<div class="content">
				<u-markdown 
					:content="markdownContent" 
					:previewImg="true"
					theme="light"
					:showLineNumber="false">
				</u-markdown>
			</div>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				markdownContent: ''
			}
		},
		onLoad(options) {
			// 接收传递的markdown内容
			if (options.content) {
				this.markdownContent = decodeURIComponent(options.content);
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

	.content-scroll {
		height: calc(100vh - 120px);
	}

	.content {
		padding: 15px 20px; /* 添加左右内边距，使内容与手机边框保持距离 */
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
</style>