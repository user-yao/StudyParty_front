import { string } from "../uni_modules/uview-plus/libs/function/test";

const dbName = 'studyParty';
const dbpath = '_doc/studyParty.db';
export default{
	createDatabases(){
		let isOpen = plus.sqlite.isOpenDatabase({
			name: dbName,
			path: dbpath
		});
		if(isOpen){
			return Promise.resolve();
		}
		return new Promise((resolve,reject) =>{
			plus.sqlite.openDatabase({
				name:dbName,
				path:dbpath,
				success:resolve,
				fail:reject
			})
		})
	},
	selectDatabases(sql){
		console.log("查询"+sql);
		return new Promise((resolve,reject) =>{
			plus.sqlite.selectSql({
				name:dbName,
				sql,
				success:resolve,
				fail:reject
			})
		})
	},
	createTable(sql){
		console.log("创建表");
		return new Promise((resolve,reject) =>{
			plus.sqlite.executeSql({
				name:dbName,
				sql,
				success:resolve,
				fail:reject
			})
		})
	},
	selectTable(sql){
		console.log("查询表");
		return new Promise((resolve,reject) =>{
			plus.sqlite.selectSql({
				name:dbName,
				sql,
				success:resolve,
				fail:reject
			})
		})
	},
	insertOtherMessage(friend,content,statu,sender,type,isread,timestamp ){ //statu person:私聊   group：群聊
		console.log("添加未读消息")
		let userid = uni.getStorageSync('user').id;
		userid = String(userid);
		friend = String(friend);
		content = String(content);
		statu = String(statu);
		sender = String(sender);
		type = String(type);
		isread = String(isread);
		return new Promise((resolve,reject) =>{
			plus.sqlite.executeSql({
				name:dbName,
				sql: `
					INSERT INTO Messages (userid, friend, content, sender, type, statu, isread,timestamp)
					VALUES ('${userid}', '${friend}', '${content}', '${sender}', '${type}', '${statu}', '${isread}',${timestamp});
				`,
				success:resolve,
				fail(e) {
					console.log(e)
					console.log("参数值:", { userid, friend, content, sender, type, statu, isread });
				}
			})
		})
	},
	selectMessage(friend,statu,limit,offset){ 
		console.log("查询消息记录");
		let userid = uni.getStorageSync('id');
		console.log("limit= "+limit+';offst= '+offset)
		return new Promise((resolve,reject) =>{
			plus.sqlite.selectSql({
				name:dbName,
				sql:`
					SELECT *
					FROM Messages
					WHERE friend = '${friend}'
					  AND userid = '${userid}'
					  AND statu = '${statu}'
					ORDER BY timestamp DESC
					LIMIT ${limit}
					OFFSET ${offset};
				`,
				success:resolve,
				fail(e) {
					console.log(e)
				}
			})
		})
	},
	updateMessageIsread(friend){
		console.log("已读消息")
		let userid = uni.getStorageSync('id');
		return new Promise((resolve,reject) =>{
			plus.sqlite.executeSql({
				name:dbName,
				sql:`UPDATE Messages
					SET isread = 1
					WHERE friend = '${friend}'
					AND userid = '${userid}';
				  `,
				success:resolve,
				fail(e) {
					console.log(e)
				}
			})
		})
	},
	insertMyMessage(friend,content,statu,type){
		console.log("添加我发送的消息")
		let userid = uni.getStorageSync('user').id;
		let sender = userid;
		return new Promise((resolve,reject) =>{
			plus.sqlite.executeSql({
				name:dbName,
				sql: `
					INSERT INTO Messages (userid, friend, content,sender, type,statu,isread)
					VALUES (?, ?, ?, ?, ?, ?);
				`,
				args: [userid, friend, content, sender, type, statu, 1], // 通过 args 传入参数
				success:resolve,
				fail:reject
			})
		})
	},
	selectChatList(){
		console.log("查询消息列表");
		let userid = uni.getStorageSync('user').id;
		return new Promise((resolve,reject) =>{
			plus.sqlite.selectSql({
				name:dbName,
				sql:`
					SELECT 
					    m1.friend,
					    m1.content,
					    m1.timestamp,
					    m1.sender,
					    m1.statu,
					    m1.type,
					    m1.isread,
					    COALESCE(unread_counts.unread_count, 0) AS message_count
					FROM Messages m1
					INNER JOIN (
					    SELECT 
					        friend, 
					        MAX(timestamp) AS max_timestamp
					    FROM Messages
					    WHERE userid = ${userid}
					    GROUP BY friend
					) latest ON m1.friend = latest.friend AND m1.timestamp = latest.max_timestamp
					LEFT JOIN (
					    SELECT 
					        friend, 
					        COUNT(*) AS unread_count
					    FROM Messages
					    WHERE userid = ${userid}
					      AND isread = '0'  
					    GROUP BY friend
					) unread_counts ON m1.friend = unread_counts.friend
					WHERE m1.userid = ${userid}
					ORDER BY m1.timestamp DESC;
				`,
				success:resolve,
				fail(e) {
					console.log(e)
				}
			})
		})
	},
	selectNewMessage(friend,statu){
		console.log("最新一条")
		let userid = uni.getStorageSync('id');
		return new Promise((resolve,reject) =>{
			plus.sqlite.selectSql({
				name:dbName,
				sql:`
					SELECT *
					FROM Messages
					WHERE userid = '${userid}'
					  AND friend = '${friend}'
					  AND statu = '${statu}'
					ORDER BY timestamp DESC
					LIMIT 1;
				`,
				success:resolve,
				fail(e) {
					console.log(e)
				}
			})
		})
	},
	clearMessage(friend,statu){
		console.log("删除聊天")
		let userid = uni.getStorageSync('id');
		return new Promise((resolve,reject) =>{
			plus.sqlite.executeSql({
				name:dbName,
				sql:`
					DELETE FROM Messages 
					WHERE friend = '${friend}' AND statu = '${statu}' AND userid = '${userid}';
				`,
				success:resolve,
				fail(e) {
					console.log(e)
				}
			})
		})
	},
	// 搜索聊天记录内容
	searchChatMessages(searchQuery) {
		console.log("搜索聊天记录内容:", searchQuery);
		let userid = uni.getStorageSync('id');
		return new Promise((resolve, reject) => {
			plus.sqlite.selectSql({
				name: dbName,
				sql: `
					SELECT DISTINCT friend, statu, COUNT(*) as matchCount
					FROM Messages
					WHERE userid = '${userid}'
					  AND content LIKE '%${searchQuery}%'
					GROUP BY friend, statu
					ORDER BY matchCount DESC;
				`,
				success: resolve,
				fail(e) {
					console.log("搜索聊天记录失败:", e);
					reject(e);
				}
			});
		});
	}
}





