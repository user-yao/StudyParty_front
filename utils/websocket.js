import {webSocketUrl} from '../config/config.js'

class WebSocketService {
  constructor() {
    this.ws = null;
    this.heartbeatTimer = null;
    this.reconnectTimer = null;
    this.HEARTBEAT_INTERVAL = 10000; // 10秒心跳间隔
    this.RECONNECT_DELAY = 5000; // 重连延迟
  }

  // 初始化连接
  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;
    const token = uni.getStorageSync('token');
    this.ws = new WebSocket(`${webSocketUrl}?Authorization=${token}`);
    
    this.ws.onopen = () => {
      console.log('WebSocket连接成功');
      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'pong') {
        console.log('收到心跳响应');
      }
      // 其他消息处理...
    };

    this.ws.onclose = (event) => {
      console.log(`WebSocket关闭，代码：${event.code}，原因：${event.reason}`);
      this.stopHeartbeat();
      this.reconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket错误:', error);
      this.stopHeartbeat();
      this.reconnect();
    };
  }

  // 发送心跳
  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({"content": "ping"}));
        console.log('发送心跳消息');
      }
    }, this.HEARTBEAT_INTERVAL);
  }

  // 停止心跳
  stopHeartbeat() {
    clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = null;
  }

  // 重连机制
  reconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.connect();
      this.reconnectTimer = null;
    }, this.RECONNECT_DELAY);
  }

  // 发送消息
  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  // 关闭连接
  close() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default new WebSocketService();