import { webSocketUrl } from '../config/config.js';
import db from '@/utils/SQLite.js'

class WebSocketService {
  constructor() {
    this.socketTask = null;
    this.heartbeatTimer = null;
    this.reconnectTimer = null;
    this.reconnectAttempts = 0;
    this.HEARTBEAT_INTERVAL = 10000; // 10秒心跳间隔
    this.MAX_RECONNECT_ATTEMPTS = 5; // 最大重连尝试次数
    this.RECONNECT_DELAY_BASE = 3000; // 基础重连延迟
    
    // 定义兼容性的 WebSocket 状态常量
    this.WS_STATES = {
      CONNECTING: 0,
      OPEN: 1,
      CLOSING: 2,
      CLOSED: 3
    };
  }

  // 初始化连接
  connect() {
    console.log("WebSocket准备连接...");
    // 清除现有连接
    if (this.socketTask) {
      this.close();
    }
    const token = uni.getStorageSync('token');
    if (!token) {
      console.error('无法连接WebSocket: token缺失');
      return;
    }
    const url = `${webSocketUrl}?Authorization=${token}`;
    console.log('连接URL:', url);
    
    try {
      // 使用uni-app的统一API创建连接
      this.socketTask = uni.connectSocket({
        url: url,
        complete: () => {}
      });
      
      // 监听事件
      this.socketTask.onOpen(this.handleOpen.bind(this));
      this.socketTask.onMessage(this.handleMessage.bind(this));
      this.socketTask.onClose(this.handleClose.bind(this));
      this.socketTask.onError(this.handleError.bind(this));
      
    } catch (e) {
      console.error('创建WebSocket连接失败:', e);
      this.reconnect();
    }
  }
  // 处理连接打开
  handleOpen(res) {
    console.log('WebSocket连接成功');
    this.reconnectAttempts = 0; // 重置重连计数器
    this.startHeartbeat();
    
    // 通知应用连接已建立
    uni.$emit('websocket-connected');
  }
  // 处理收到消息
  handleMessage(res) {
    try {
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      if (data.type === 'pong') {
        // console.log('收到心跳响应');
        return;
      }
	  if(data.type === 'text_private' || data.type === 'offline_text_private'){
		db.insertOtherMessage(data.senderId,data.content,'person',data.senderId,'text',0);
		uni.$emit('websocket-message', data);
		return
	  }
	  if(data.type === 'text_group' || data.type === 'offline_text_group'){
		db.insertOtherMessage(data.groupId, data.content,'group', data.senderId,'text',0);
		uni.$emit('websocket-message', data);
		return
	  }
	  if(data.type === 'text_public' || data.type === 'offline_text_public'){
	  		db.insertOtherMessage(data.groupId, data.content,'system', data.senderId,'text',0);
	  		uni.$emit('websocket-message', data);
	  		return
	  }
	  if(data.groupId != null){
		db.insertOtherMessage(data.groupId, data.content,'group', data.senderId,data.fileType,0);
		uni.$emit('websocket-message', data);
		return
	  }
	  if(data.receiverId != null){
		db.insertOtherMessage(data.senderId,data.content,'person',data.senderId,data.fileType,0);
		uni.$emit('websocket-message', data);
		return
	  }
      // 触发全局消息事件
      uni.$emit('websocket-message', data);
    } catch (e) {
      console.error('消息解析错误:', e, '原始数据:', res.data);
    }
  }
  
  // 处理连接关闭
  handleClose(res) {
    console.log(`WebSocket关闭，代码：${res.code}，原因：${res.reason || '未知原因'}`);
    this.stopHeartbeat();
    
    // 非主动关闭才重连
    if (res.code !== 1000) {
      this.reconnect();
    }
  }
  
  // 处理连接错误
  handleError(err) {
    console.error('WebSocket错误:', err.errMsg || err.message);
    this.stopHeartbeat();
    this.reconnect();
  }

  // 发送心跳
  startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.sendMessage({ content: 'ping' });
        // console.log('发送心跳消息');
      }
    }, this.HEARTBEAT_INTERVAL);
  }

  // 停止心跳
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // 检查连接状态 (使用兼容性方式)
  isConnected() {
    if (!this.socketTask) return false;
    
    // 使用兼容性的状态检查
    return this.socketTask.readyState === this.WS_STATES.OPEN;
  }

  // 智能重连机制
  reconnect() {
    // 清除现有定时器
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    
    // 检查最大重连次数
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      console.warn(`已达到最大重连次数(${this.MAX_RECONNECT_ATTEMPTS})，停止重连`);
      uni.$emit('websocket-disconnected');
      return;
    }
    
    // 指数退避策略
    const delay = this.RECONNECT_DELAY_BASE * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;
    
    console.log(`将在 ${delay}ms 后尝试重连 (#${this.reconnectAttempts})`);
    
    this.reconnectTimer = setTimeout(() => {
      console.log(`尝试重连 (#${this.reconnectAttempts})`);
      this.connect();
    }, delay);
  }

  // 发送消息
  sendMessage(message) {
    if (this.isConnected()) {
      try {
        const payload = JSON.stringify(message);//message.senderId 聊天对象id,message.content 内容,message.senderType 群聊还是私聊,
												//message.senderId发送方id,类型,1已读
        this.socketTask.send({
          data: payload,
          success: () => {
			// console.log('消息发送成功:', message.type || message);
          },
          fail: (err) => {
            console.error('消息发送失败:', err);
          }
        });
      } catch (e) {
        console.error('消息序列化错误:', e);
      }
    } else {
      console.warn('尝试发送消息但连接未就绪');
      // 可选：将消息加入队列，连接恢复后发送
    }
  }

  // 关闭连接
  close(code = 1000, reason = '正常关闭') {
    this.stopHeartbeat();
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.socketTask) {
      try {
        // 小程序和App平台需要调用close方法
        if (typeof this.socketTask.close === 'function') {
          this.socketTask.close({
            code: code,
            reason: reason
          });
        } else {
          // 浏览器环境
          this.socketTask.close(code, reason);
        }
      } catch (e) {
        console.error('关闭连接时出错:', e);
      } finally {
        this.socketTask = null;
      }
    }
    
    console.log('WebSocket连接已关闭');
  }
}

// 创建单例
const webSocketService = new WebSocketService();

// 自动重连监听
uni.$on('network-connected', () => {
  if (!webSocketService.isConnected()) {
    console.log('网络恢复，尝试重连WebSocket');
    webSocketService.connect();
  }
});

export default webSocketService;