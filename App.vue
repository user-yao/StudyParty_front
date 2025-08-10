<script>
	import webSocketService from '@/utils/websocket.js'
	import store from '@/store'

export default {
	onLaunch: function() {
		console.log('App Launch')
		// 应用启动时检查是否已登录，已登录则连接WebSocket
		const token = uni.getStorageSync('token');
		if (token) {
			webSocketService.connect();
		}
	},
	onShow: function() {
		console.log('App Show')
	},
	onHide: function() {
		console.log('App Hide')
		// 应用隐藏时关闭WebSocket
		webSocketService.close();
	}
}
</script>


<style lang="scss">
	/*每个页面公共css */
	  @import "@/uni_modules/uview-plus/index.scss";
</style>
