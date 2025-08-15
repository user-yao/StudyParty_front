<script>
	import webSocketService from '@/utils/websocket.js'
	import store from '@/store'
	import db from '@/utils/SQLite.js'
	import {mapActions} from 'vuex'
export default {
	onLaunch: function() {
		console.log('App Launch')
		
		// 确保 plus 环境就绪后再初始化数据库
		this.testDatabase();
		const token = uni.getStorageSync('token');
		if (token) {
			webSocketService.connect();
		}
		if(uni.getStorageSync('password') != null){
			this.login({phone:uni.getStorageSync('user').phone,password:uni.getStorageSync("password")}).then(res =>{
				if(res.code == 200){
					uni.switchTab({ url: '/pages/index/index' });
				}else{
					uni.switchTab({ url: '/pages/login/login' });
				}
				
			})
		}
	},
	onShow: function() {
		console.log('App Show')
	},
	onHide: function() {
		console.log('App Hide')
		webSocketService.close();
	},
	methods: {
		 ...mapActions('user', ['login']),
		async testDatabase(){
			await db.createDatabases();
			let [result] = await db.selectDatabases('select * from android_metadata');
			console.log(result);
			const createTableSql = `
				CREATE TABLE IF NOT EXISTS Messages (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					userid TEXT,
					friend TEXT,
					content TEXT,
					sender TEXT,
					statu TEXT,
					isread TEXT,
					type TEXT,
					timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
				)
			`;
			let cTable1 = await db.createTable(createTableSql);
			let ans = await db.selectTable(`SELECT name FROM sqlite_master WHERE type='table';`)
			console.log(ans)
		},
	}
}
</script>

<style lang="scss">
	@import "@/uni_modules/uview-plus/index.scss";
</style>