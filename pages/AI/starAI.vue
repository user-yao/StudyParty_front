<template>
    <div class="body">
        <div class="app-container">
            <!-- 顶部导航 -->
            <div class="chat-header">
                <div class="header-left">
                    <u-icon name="arrow-left" size="50rpx" color="#fff" bold @click="goBack"></u-icon>
                    <div class="user-info">
                        <div class="user-details">
                            <div class="user-name">人工智能小星</div>
                            <div class="user-status">智能学习助手</div>
                        </div>
                    </div>
                </div>
                <div class="header-actions">
                    <u-icon name="more-dot-fill" color="#fff" size="50rpx"></u-icon>
                </div>
            </div>

            <!-- 聊天区域 -->
            <scroll-view style="margin: 0;padding: 0;width: 100%;height: 80vh; max-height: 100vh;" scroll-y
                class="chat-area" refresher-background='#f5f7fb' :refresher-triggered='isRefresher'
                @refresherrefresh='LoadMessage' :refresher-enabled='true' ref="chatArea"
                :scroll-into-view='scrollToView'>
                <div class="chat-date-divider">
                    <span>与人工智能小星的对话</span>
                </div>

                <!-- 消息列表 -->
                <div v-for="message in messages" :key="message.id" class="message"
                    :class="message.sender === 'user' ? 'sender' : 'receiver'">
					<image v-if="message.sender === 'user'" :src="imageUrl+uni.getStorageSync('user').head" class="avatar user-avatar" mode=""></image>
					<image v-else src="/static/chat/xing.png" class="avatar user-avatar" mode=""></image>
                    <div class="message-content">
                        <span class="sender-name">
                            {{ message.sender === 'user' ? '我' : '人工智能小星' }}
                        </span>
                        <div class="bubble">
                            <!-- 用户文本消息 -->
                            <template v-if="message.sender === 'user' && message.type === 'text'">
                                <div class="message-text">{{ message.content }}</div>
                            </template>

                            <!-- AI回复消息 (使用u-markdown展示) -->
                            <template v-if="message.sender === 'ai' && message.type === 'text'">
                                <u-markdown style="margin: 0;padding: 0;" :content="message.content" class="ai-markdown-content"></u-markdown>
                            </template>

                            <!-- AI正在输入的等待效果 -->
                            <template v-if="message.sender === 'ai' && message.type === 'typing'">
                                <div class="typing-indicator">
                                    <div class="typing-dot"></div>
                                    <div class="typing-dot"></div>
                                    <div class="typing-dot"></div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <view id="bottom-anchor"></view>
            </scroll-view>

            <!-- 输入区域 -->
            <view class="Bottom">
                <view class="Input" @click="scrollToBottom">
                    <textarea :class="{ input: true, have: InputValue != '' }" auto-height v-model="InputValue"
                        auto-blur cursor-spacing="20" :focus="keyword" :autosize="{ minRows: 1, maxRows: 8 }" :rows="1"
                        placeholder="向人工智能小星提问...">
        </textarea>
                </view>
                <view class="button" v-if="InputValue != '' && !isWaiting" @touchend.prevent="sendTextMessage">发送</view>
                <!-- 等待状态下的按钮 -->
                <view class="button waiting" v-if="isWaiting">
                    <u-icon name="pause-circle-fill" color="#fff" size="20"></u-icon>
                </view>
            </view>

            <!-- SSE客户端组件 -->
            <gao-ChatSSEClient ref="chatSSEClientRef" @onOpen="onSSEOpen" @onError="onSSEError"
                @onMessage="onSSEMessage" @onFinish="onSSEFinish" />
        </div>
    </div>
</template>

<script>
import { baseUrl,imageUrl } from '@/config/config.js';

export default {
    data() {
        return {
            InputValue: '',
            isRefresher: false,
            scrollToView: '',
            keyword: false,
            isWaiting: false, // AI等待状态
            messages: [
                {
                    id: 1,
                    sender: 'ai',
                    type: 'text',
                    content: `有什么想跟我分享的吗？`,
                    timestamp: new Date().getTime()
                }
            ],
            currentAiMessageId: null, // 当前AI消息的ID，用于流式更新
            fullContent: '', // 用于存储完整的内容
            isInCodeBlock: false // 用于跟踪是否在代码块内
        }
    },
    onLoad() {
        // 页面加载时的初始化操作
        // 使用条件判断来避免API不存在的问题
        if (uni.onKeyboardHeightChange) {
            uni.onKeyboardHeightChange(this.handleKeyboardShow);
        }
    },
    onUnload() {
        // 页面卸载时取消监听键盘事件
        if (uni.offKeyboardHeightChange) {
            uni.offKeyboardHeightChange(this.handleKeyboardShow);
        }

        // 停止SSE连接
        if (this.$refs.chatSSEClientRef) {
            this.$refs.chatSSEClientRef.stopChat();
        }
    },
	computed:{
		imageUrl(){
			return imageUrl;
		}
	},
    methods: {
        async sendTextMessage() {
            console.log('发送消息，当前输入:', this.InputValue, '等待状态:', this.isWaiting);
            if (!this.InputValue.trim() || this.isWaiting) return;

            // 添加用户消息
            const userMessage = {
                id: Date.now(),
                sender: 'user',
                type: 'text',
                content: this.InputValue,
                timestamp: new Date().getTime()
            };
            this.messages.push(userMessage);
            console.log('添加用户消息:', userMessage);

            // 保存用户输入并清空输入框
            const userInput = this.InputValue;
            this.InputValue = '';

            // 显示AI正在输入的等待效果
            this.isWaiting = true;
            const typingMessage = {
                id: Date.now() + 1,
                sender: 'ai',
                type: 'typing',
                content: '',
                timestamp: new Date().getTime()
            };
            this.messages.push(typingMessage);
            console.log('添加等待消息:', typingMessage);
            this.scrollToBottom();

            try {
                // 调用AI服务，支持流式输出
                console.log('开始调用AI服务流');
                await this.callAIServiceStream(userInput);
                console.log('AI服务调用完成');
            } catch (error) {
                console.error('调用AI服务时出错:', error);
                // 移除等待消息
                this.messages = this.messages.filter(msg => msg.id !== typingMessage.id);

                // 显示错误消息
                const errorMessage = {
                    id: Date.now() + 2,
                    sender: 'ai',
                    type: 'text',
                    content: '抱歉，我在处理您的请求时遇到了问题，请稍后重试。',
                    timestamp: new Date().getTime()
                };
                this.messages.push(errorMessage);
                this.isWaiting = false;
                this.scrollToBottom();
            }
        },
        callAIServiceStream(prompt) {
            return new Promise((resolve, reject) => {
                console.log('开始调用AI服务，prompt:', prompt);
                // 创建AI回复消息
                const aiMessage = {
                    id: Date.now() + 2,
                    sender: 'ai',
                    type: 'typing',
                    content: '',
                    timestamp: new Date().getTime()
                };
                this.currentAiMessageId = aiMessage.id;
                this.fullContent = ''; // 重置完整内容
                this.isInCodeBlock = false; // 重置代码块状态
                console.log('创建AI消息:', aiMessage);

                // 移除等待消息并添加AI消息
                const typingMessageId = this.messages.find(msg => msg.type === 'typing')?.id;
                if (typingMessageId) {
                    this.messages = this.messages.filter(msg => msg.id !== typingMessageId);
                    console.log('移除等待消息，ID:', typingMessageId);
                }
                this.messages.push(aiMessage);
                console.log('添加AI消息到列表');
                this.scrollToBottom();

                // 使用 gao-ChatSSEClient 组件建立 SSE 连接
                const token = uni.getStorageSync('token');
                console.log('获取token:', token);

                // 检查token是否存在
                if (!token) {
                    console.error('未找到token，请先登录');
                    this.isWaiting = false;
                    reject(new Error('未找到token，请先登录'));
                    return;
                }

                // 准备请求参数
                const requestData = {
                    url: baseUrl + '/AI/AI',
                    method: 'POST',
                    headers: {
                        'Authorization': token
                    },
                    body: prompt
                };

                // 设置当前的 resolve 和 reject 函数，以便在 SSE 事件处理函数中调用
                this.currentResolve = resolve;
                this.currentReject = reject;

                // 启动 SSE 连接
                this.$refs.chatSSEClientRef.startChat(requestData);
            });
        },
        // SSE事件处理函数
        onSSEOpen(response) {
            console.log("SSE连接已打开：", response);
            // 检查响应状态
            if (response && response.status >= 400) {
                console.error("服务器返回错误状态：", response.status, response.statusText);
                // 更新AI消息内容为错误信息
                if (this.currentAiMessageId) {
                    this.updateAiMessageContent(this.currentAiMessageId, '抱歉，服务器遇到了一些问题，请稍后重试。');
                }
                this.isWaiting = false;
                if (this.currentReject) {
                    this.currentReject(new Error(`服务器错误: ${response.status} ${response.statusText}`));
                }
            }
        },
        onSSEError(err) {
            console.error("SSE连接错误：", err);
            this.isWaiting = false;
            // 更新AI消息内容为错误信息
            if (this.currentAiMessageId) {
                // 检查错误信息，提供更友好的错误提示
                let errorMessage = '抱歉，我在处理您的请求时遇到了问题，请稍后重试。';
                if (err && typeof err === 'string') {
                    if (err.includes('500')) {
                        errorMessage = '服务器遇到了一些问题，请稍后重试。';
                    } else if (err.includes('401')) {
                        errorMessage = '身份验证失败，请重新登录。';
                    } else if (err.includes('timeout')) {
                        errorMessage = '请求超时，请检查网络连接后重试。';
                    }
                } else if (err && typeof err === 'object') {
                    if (err.status === 500) {
                        errorMessage = '服务器遇到了一些问题，请稍后重试。';
                    } else if (err.status === 401) {
                        errorMessage = '身份验证失败，请重新登录。';
                    }
                }
                this.updateAiMessageContent(this.currentAiMessageId, errorMessage);
            }
            if (this.currentReject) {
                this.currentReject(new Error('SSE连接错误: ' + JSON.stringify(err)));
            }
        },
        onSSEMessage(msg) {
            console.log("收到SSE消息：", msg);
            try {
                // 处理SSE消息
                if (msg.data) {
                    // 解析SSE格式数据
                    const data = msg.data;
                    const jsonData = data; // 去掉'data:'前缀
                    if (jsonData) {
                        // 累积内容（保留原始内容，包括空行）
                        const parsedData = JSON.parse(jsonData);
                        // 检查是否有output.text字段
                        console.log('检查是否有output.text字段:', parsedData.output == null);
                        console.log('检查是否有output字段:', parsedData.output.text == null);
                        console.log('解析SSE数据:', parsedData.output.text);
                        this.fullContent += parsedData.output.text;
                    }
                } else {
                    // 空的 data: 表示换行，直接添加换行符
                    this.fullContent += '\n';
                    console.log('添加换行符，当前内容:', this.fullContent);
                }

                if (this.currentAiMessageId) {
                    // 直接更新AI消息内容，让u-markdown组件处理Markdown格式和换行
                    this.updateAiMessageContent(this.currentAiMessageId, this.fullContent);
                }
            } catch (error) {
                console.error('处理SSE消息时出错:', error);
                if (this.currentAiMessageId) {
                    this.updateAiMessageContent(this.currentAiMessageId, '抱歉，我在处理您的请求时遇到了问题，请稍后重试。');
                }
            }
        },

        onSSEFinish() {
            console.log("SSE连接已完成");
            this.isWaiting = false;
            if (this.currentResolve) {
                this.currentResolve();
            }
        },
        updateAiMessageContent(messageId, content) {
            console.log('更新AI消息内容，ID:', messageId, '内容:', content);
            const messageIndex = this.messages.findIndex(msg => msg.id === messageId);
            if (messageIndex !== -1) {
                this.messages[messageIndex].type = 'text';
                this.messages[messageIndex].content = content;
                this.$nextTick(() => {
                    this.scrollToBottom();
                });
            } else {
                console.log('未找到消息ID:', messageId);
            }
        },
        LoadMessage() {
            // 模拟加载更多消息
            if (this.isRefresher) return;
            this.isRefresher = true;

            // 模拟网络延迟
            setTimeout(() => {
                this.isRefresher = false;
            }, 1000);
        },
        goBack() {
            // 停止SSE连接
            if (this.$refs.chatSSEClientRef) {
                this.$refs.chatSSEClientRef.stopChat();
            }
            uni.navigateBack(1)
        },
        scrollToBottom() {
            this.scrollToView = ''; // 先清空，强制下一次变化
            this.$nextTick(() => {
                this.scrollToView = 'bottom-anchor';
            });
        },
        handleKeyboardShow(res) {
            // 键盘弹起时自动滚动到底部
            if (res.height > 0) {
                // 延迟执行以确保键盘完全弹起
                setTimeout(() => {
                    this.scrollToBottom();
                }, 200);
            }
        }
    }
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

:global(:root) {
    --primary: #4361ee;
    --secondary: #3f37c9;
    --accent: #4895ef;
    --success: #4cc9f0;
    --warning: #f72585;
    --light: #f8f9fa;
    --dark: #212529;
    --gray: #6c757d;
    --light-gray: #e9ecef;
    --card-bg: #ffffff;
    --unread-bg: #f0f7ff;
    --tab-height: 50px;
    --chat-bg: #f5f7fb;
    --sender-bubble: #e1f0ff;
    --receiver-bubble: #ffffff;
}

.app-container {
    width: 100%;
    max-width: 450px;
    height: 100vh;
    background: white;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* 顶部导航 */
.chat-header {
    background: #4361ee;
    /* 纯色背景，符合用户偏好 */
    color: white;
    padding: 15px 20px;
    padding-top: 5vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-left {
    display: flex;
    align-items: center;
}

.back-btn {
    font-size: 1.5rem;
    margin-right: 15px;
    cursor: pointer;
}

.user-info {
    display: flex;
    align-items: center;
}

.user-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: #4361ee;
    /* 纯色背景 */
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 1.4rem;
    margin-right: 12px;
}

.user-details {
    display: flex;
    flex-direction: column;
}

.user-name {
    font-weight: 600;
    font-size: 1.1rem;
}

.user-status {
    font-size: 0.8rem;
    opacity: 0.9;
    margin-top: 3px;
}

.header-actions {
    display: flex;
    gap: 20px;
}

.header-actions i {
    font-size: 1.3rem;
    cursor: pointer;
    transition: transform 0.2s;
}

.header-actions i:hover {
    transform: scale(1.1);
}

/* 聊天区域 */
.chat-area {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
    background-color: var(--chat-bg);
    display: flex;
    flex-direction: column;
    position: relative;
}

.chat-date-divider {
    text-align: center;
    margin: 15px 0;
    position: relative;
}

.chat-date-divider span {
    background: rgba(255, 255, 255, 0.8);
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 0.8rem;
    color: var(--gray);
    position: relative;
    z-index: 2;
}

.chat-date-divider:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--light-gray);
    z-index: 1;
}

.message {
    display: flex;
    margin: 20rpx auto;
    margin-bottom: 20rpx;
    padding-bottom: 40rpx;
    max-width: 85%;
}

.message.sender {
    align-self: flex-end;
    flex-direction: row-reverse;
}

.message.receiver {
    align-self: flex-start;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
    flex-shrink: 0;
}

.user-avatar {
    background: #4361ee;
    /* 用户头像使用纯色背景 */
}

.ai-avatar {
    background: #3f37c9;
    /* AI头像使用纯色背景 */
}

.message-content {
    margin: 0 12px;
    max-width: 80%;
    display: flex;
    flex-direction: column;
}

.message.sender .message-content {
    align-items: flex-end;
}

.message.receiver .message-content {
    align-items: flex-start;
}

.sender-name {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--gray);
    margin-bottom: 5px;
    display: block;
}

.bubble {
    padding: 12px 16px;
    border-radius: 18px;
    position: relative;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    /* 简化阴影效果 */
    max-width: 100%;
    min-height: 20px; /* 确保气泡有最小高度 */
}

.message.sender .bubble {
    background: #4361ee;
    /* 用户消息气泡使用纯色背景 */
    color: white;
    border-top-right-radius: 5px;
}

.message.receiver .bubble {
    background: var(--receiver-bubble);
    border-top-left-radius: 5px;
}

/* AI正在输入的等待效果 */
.typing-indicator {
    display: flex;
    align-items: center;
    padding: 5px 0;
    min-height: 20px; /* 确保有最小高度 */
}

.typing-dot {
    width: 8px;
    height: 8px;
    background-color: #1278cc; /* 改为白色，在蓝色背景下更明显 */
    border-radius: 50%;
    margin: 0 3px;
    animation: typing 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) {
    animation-delay: 0s;
}

.typing-dot:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing {

    0%,
    60%,
    100% {
        transform: translateY(0);
    }

    30% {
        transform: translateY(-5px);
    }
}

/* AI Markdown内容样式 */
.ai-markdown-content {
    white-space: pre-wrap; /* 保留空白符序列，但是正常地进行换行 */
    word-break: break-word; /* 在长单词或URL地址内部进行换行 */
}

.ai-markdown-content code {
    font-family: 'Courier New', monospace; /* 代码使用等宽字体 */
    background-color: #f5f5f5; /* 代码块背景色 */
    padding: 2px 4px; /* 代码内边距 */
    border-radius: 4px; /* 代码块圆角 */
}

.ai-markdown-content pre {
    background-color: #f5f5f5; /* 代码块背景色 */
    padding: 10px; /* 代码块内边距 */
    border-radius: 4px; /* 代码块圆角 */
    overflow-x: auto; /* 横向滚动 */
}

.ai-markdown-content pre code {
    background-color: transparent; /* 代码块内代码背景透明 */
    padding: 0; /* 代码块内代码无内边距 */
}

/* 输入区域 */
.Bottom {
    display: flex;
    position: sticky;
    width: 100%;
    bottom: 0;
    background-color: #fff;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
    border-top: 1rpx solid #e5e4e8;
    padding: 30rpx 30rpx;
    box-sizing: border-box;
    z-index: 9999;
}

.input {
    width: 550rpx;
    display: flex;
    padding: 20rpx;
    background-color: #F2F1F6;
    border-radius: 15rpx;
    box-sizing: border-box;
    margin: 0 20rpx;
    transition: 100ms;
}

.input.have {
    width: 450rpx;
    padding: 20rpx;
    display: flex;
    background-color: #F2F1F6;
    border-radius: 15rpx;
    box-sizing: border-box;
    margin: 0 20rpx;
    transition: 100ms;
}

.button {
    width: 100rpx;
    height: 70rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    background-color: #4361ee;
    /* 使用纯色背景 */
    color: #fff;
    border-radius: 15rpx;
    transition: 100ms;
}

.button.waiting {
    background-color: #4361ee;
}

/* 响应式调整 */
@media (max-width: 480px) {
    .app-container {
        height: 100vh;
    }

    .message {
        max-width: 90%;
    }
}
</style>
