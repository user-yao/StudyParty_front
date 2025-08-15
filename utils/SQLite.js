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
	insertOtherMessage(friend,content,statu,sender,type,isread){ //statu person:私聊   group：群聊
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
					INSERT INTO Messages (userid, friend, content, sender, type, statu, isread)
					VALUES ('${userid}', '${friend}', '${content}', '${sender}', '${type}', '${statu}', '${isread}');
				`,
				success:resolve,
				fail(e) {
					console.log(e)
					console.log("参数值:", { userid, friend, content, sender, type, statu, isread });
				}
			})
		})
	},
	selectMessage(friend,statu,offset,limit){ 
		console.log("查询消息记录");
		let userid = uni.getStorageSync('user').id;
		return new Promise((resolve,reject) =>{
			plus.sqlite.executeSql({
				name:dbName,
				sql:`
					SELECT *
					FROM Messages
					WHERE friend = ?
					  AND userid = ?
					  AND statu = ?
					ORDER BY timestamp DESC
					LIMIT ?
					OFFSET ?;
				`,
				args: [friend, userid, statu,limit, offset],
				success:resolve,
				fail:reject
			})
		})
	},
	updateMessageIsread(friend){
		console.log("已读消息")
		let userid = uni.getStorageSync('user').id;
		return new Promise((resolve,reject) =>{
			plus.sqlite.executeSql({
				name:dbName,
				sql:`UPDATE Messages
					SET isread = 1
					WHERE friend = ?
					AND userid = ?;
				  `,
				args:[friend,userid],
				success:resolve,
				fail:reject
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
					COUNT(*) AS message_count
				FROM Messages m1
				INNER JOIN (
					SELECT friend, MAX(timestamp) AS max_timestamp
					FROM Messages
					WHERE userid = '${userid}'
					GROUP BY friend
				) m2 ON m1.friend = m2.friend AND m1.timestamp = m2.max_timestamp
				WHERE m1.userid = '${userid}'
				GROUP BY m1.friend, m1.content, m1.timestamp, m1.sender, m1.statu, m1.type, m1.isread
				ORDER BY m1.timestamp DESC
				`,
				success:resolve,
				fail(e) {
					console.log(e)
				}
			})
		})
	}
}














// const SQLiteHelper = {
//   // 数据库配置
//   DB_NAME: 'app.db',       // 数据库名称
//   DB_PATH: '_doc/app.db',  // 存储路径（_doc 是 App 的私有目录）

//   // 创建表
//   createTable: function(tableName, columns) {
//     return new Promise((resolve, reject) => {
//       const db = plus.sqlite.openDatabase({
//         name: this.DB_NAME,
//         path: this.DB_PATH
//       });

//       const createSql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns.join(', ')})`;

//       db.transaction((tx) => {
//         tx.executeSql(
//           createSql,
//           [],
//           () => {
//             console.log(`表 ${tableName} 创建成功`);
//             resolve(true);
//           },
//           (err) => {
//             console.error(`创建表失败:`, err);
//             reject(err);
//           }
//         );
//       });
//     });
//   },

//   // 存储数据（插入或更新）
//   saveData: function(tableName, data) {
//     return new Promise((resolve, reject) => {
//       const db = plus.sqlite.openDatabase({
//         name: this.DB_NAME,
//         path: this.DB_PATH
//       });

//       const keys = Object.keys(data);
//       const values = keys.map(key => data[key]);
//       const placeholders = keys.map(() => '?').join(', ');

//       // 判断是否有 id 字段（用于 upsert）
//       const hasId = keys.includes('id');
//       let sql;

//       if (hasId) {
//         // 如果有 id，则执行 UPDATE 或 INSERT（upsert）
//         const setClause = keys.map(key => `${key} = ?`).join(', ');
//         sql = `
//           INSERT INTO ${tableName} (${keys.join(', ')})
//           VALUES (${placeholders})
//           ON CONFLICT(id) DO UPDATE SET ${setClause}
//         `;
//         const combinedValues = [...values, ...values]; // values for INSERT and UPDATE
//       } else {
//         // 普通插入
//         sql = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
//       }

//       db.transaction((tx) => {
//         tx.executeSql(
//           sql,
//           hasId ? combinedValues : values,
//           () => {
//             console.log(`数据插入/更新成功`);
//             resolve(true);
//           },
//           (err) => {
//             console.error(`数据存储失败:`, err);
//             reject(err);
//           }
//         );
//       });
//     });
//   },

//   // 读取数据（按时间倒序排列）
//   readData: function(tableName, limit = 10, offset = 0) {
//     return new Promise((resolve, reject) => {
//       const db = plus.sqlite.openDatabase({
//         name: this.DB_NAME,
//         path: this.DB_PATH
//       });

//       const sql = `
//         SELECT * FROM ${tableName}
//         ORDER BY timestamp DESC
//         LIMIT ${limit} OFFSET ${offset}
//       `;

//       db.transaction((tx) => {
//         tx.executeSql(
//           sql,
//           [],
//           (tx, res) => {
//             const result = [];
//             for (let i = 0; i < res.rows.length; i++) {
//               result.push(res.rows.item(i));
//             }
//             resolve(result);
//           },
//           (err) => {
//             console.error(`读取数据失败:`, err);
//             reject(err);
//           }
//         );
//       });
//     });
//   },

//   // 按字段匹配删除数据
//   deleteData: function(tableName, conditions) {
//     return new Promise((resolve, reject) => {
//       const db = plus.sqlite.openDatabase({
//         name: this.DB_NAME,
//         path: this.DB_PATH
//       });

//       const keys = Object.keys(conditions);
//       const values = keys.map(key => conditions[key]);
//       const whereClause = keys.map(key => `${key} = ?`).join(' AND ');

//       const sql = `DELETE FROM ${tableName} WHERE ${whereClause}`;

//       db.transaction((tx) => {
//         tx.executeSql(
//           sql,
//           values,
//           () => {
//             console.log(`数据删除成功`);
//             resolve(true);
//           },
//           (err) => {
//             console.error(`删除数据失败:`, err);
//             reject(err);
//           }
//         );
//       });
//     });
//   }
// };

// export default SQLiteHelper;