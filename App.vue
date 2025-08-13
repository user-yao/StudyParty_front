<script>
	import webSocketService from '@/utils/websocket.js'
	import store from '@/store'
	import db from '@/utils/SQLite.js'

export default {
	onLaunch: function() {
		console.log('App Launch')
		
		// 确保 plus 环境就绪后再初始化数据库
		this.testDatabase();
		const token = uni.getStorageSync('token');
		if (token) {
			webSocketService.connect();
		}
		if(uni.getStorageSync('token') != null){
			uni.switchTab({ url: '/pages/index/index' });
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
		async testDatabase(){
			await db.createDatabases();
			let [result] = await db.selectDatabases('select * from android_metadata');
			console.log(result);
			const createTableSql = `
				CREATE TABLE IF NOT EXISTS offlineMessages (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					user TEXT NOT NULL,
					constant INTEGER NOT NULL,
					sender TEXT NOT NULL,
					timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
				)
			`;
			
			const createTableSqlTwo = `
				CREATE TABLE IF NOT EXISTS onlineMessages (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					user TEXT NOT NULL,
					content TEXT NOT NULL,
					sender TEXT NOT NULL,
					timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
				)
			`;
			let cTable1 = await db.createTable(createTableSql);
			console.log(cTable1)
			let cTable2 = await db.createTable(createTableSqlTwo);
			console.log(cTable2)
			let ans = await db.selectTable(`SELECT name FROM sqlite_master WHERE type='table';`)
			console.log(ans)
		},
	    initDatabase() {
			console.log("初始化数据库")
			
			// 确保 plus.sqlite 存在
			if (!window.plus || !window.plus.sqlite) {
				console.error('SQLite 模块未就绪');
				return;
			}
			try {
				// 打开数据库 - 简化路径
				const db = plus.sqlite.openDatabase({
					name: 'chat.db',
					path: '_doc/chat.db' // 使用相对路径即可
				});
				
				console.log("数据库连接成功");
				this.createTables(db);
			} catch(e) {
				console.error("数据库初始化失败:", e);
			}
	    },
		
		createTables(db) {
			console.log("创建数据库表")
			
			
			
			// 使用回调确保顺序执行
			db.transaction(tx => {
				tx.executeSql(createTableSql, [], 
					() => console.log('offlineMessages表创建成功'),
					err => console.error('创建offlineMessages表失败:', err)
				);
			}, 
			err => console.error('事务1失败:', err), 
			() => {
				db.transaction(tx => {
					tx.executeSql(createTableSqlTwo, [], 
						() => console.log('onlineMessages表创建成功'),
						err => console.error('创建onlineMessages表失败:', err)
					);
				}, err => console.error('事务2失败:', err));
			});
		}
	}
}
</script>

<style lang="scss">
	@import "@/uni_modules/uview-plus/index.scss";
</style>