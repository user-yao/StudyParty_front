<template>
    <view class="add-task-page">
        <!-- 顶部导航 -->
        <view class="app-header">
            <view class="header-top">
                <view class="logo" @click="goBack">
                    <u-icon name="arrow-left" color="white" size="20"></u-icon>
                    <text>返回</text>
                </view>
                <view class="header-actions">
                    <u-button type="primary" size="mini" @click="submitTask" :loading="submitLoading"
                        :disabled="!isFormValid">
                        发布
                    </u-button>
                </view>
            </view>
        </view>

        <view class="content">
            <view class="form-container">
                <!-- 任务标题 -->
                <view class="form-section title-section">
                    <text class="section-title">任务标题</text>
                    <view class="form-item">
                        <u--input v-model="taskForm.title" placeholder="请输入任务标题" border="surround"
                            class="title-input" />
                    </view>
                </view>

                <!-- 任务内容 -->
                <view class="form-section">
                    <text class="section-title">任务内容</text>
                    <view class="form-item content-section">
                        <view class="editor-container">
                            <!-- 编辑器头部 -->
                            <view class="submission-header">
                                <view class="markdown-info">
                                    <u-icon name="file-text" size="16" color="#4361ee"></u-icon>
                                    <text class="markdown-text">支持Markdown语法</text>
                                </view>
                                <view class="markdown-links">
                                    <text class="toolbar-text" @click="goToMarkdownGuide">语法教程</text>
                                    <text class="toolbar-text" @click="previewMarkdown"
                                        style="margin-left: 15px;">预览</text>
                                </view>
                            </view>

                            <!-- 文本框容器 -->
                            <view class="textarea-container" :style="textareaContainerStyle">
                                <scroll-view class="textarea-container" scroll-y="true" :scroll-top="textareaScrollTop"
                                    @scroll="onTextareaScroll" :style="textareaContainerStyle" enable-flex="true">
                                    <textarea ref="submissionTextarea" class="submission-text" v-model="displayContent"
                                        placeholder="请输入任务内容，支持Markdown语法..." :style="textareaStyle"
                                        @focus="onTextareaFocus" @blur="onTextareaBlur" :maxlength="5000">
									</textarea>
                                </scroll-view>

                                <!-- 图片功能栏 -->
                                <view class="image-toolbar">
                                    <view class="toolbar-icon" @click="uploadImage">
                                        <u-icon name="photo" size="24" color="#4361ee"></u-icon>
                                    </view>
                                    <text class="toolbar-text" @click="uploadImage">添加图片</text>
                                </view>
                                
                                <!-- 字数统计 -->
                                <view class="word-count">
                                    <text class="count-text">{{ currentWordCount }}/5000</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

            </view>
        </view>
    </view>
</template>

<script>
import { mapActions } from 'vuex';
import UploadUtils from '../../utils/uploadUtils.js'
import { baseUrl } from '../../config/config.js';
export default {
    data() {
        return {
            taskForm: {
                title: '', // 任务标题
                markdown: '', // 任务内容，Markdown格式
            },

            showPreview: false,
            submitLoading: false,

            // Markdown编辑器相关数据
            displayContent: '', // 显示内容（包含图片占位符）
            submissionContent: '', // 提交内容（包含Markdown图片代码）
            textareaScrollTop: 0,
            isTextareaFocused: false,
            keyboardHeight: 0,

            uploading: false,
            imageMap: [], // 存储图片映射关系：{ placeholder: "[图片1]", markdown: "![图片1](url1)" }
            imageCounter: 0, // 图片编号计数器
        }
    },
    computed: {
        // 表单验证
        isFormValid() {
            return this.taskForm.title.trim().length > 0 &&
                this.submissionContent.trim().length > 0;
        },

        // 文本框样式
        textareaStyle() {
            if (this.keyboardHeight > 0) {
                // 键盘弹起时，动态计算文本框高度
                // 确保文本框底部与图片功能栏顶部之间有足够空间
                const totalDeduction = this.keyboardHeight + 120; // 键盘高度 + 功能栏高度 + 间距
                return {
                    height: `calc(300px - ${totalDeduction}px)`,
                    marginBottom: '60px',
                    whiteSpace: 'pre-wrap', // 支持换行符
                    wordWrap: 'break-word', // 自动换行
                    lineHeight: '1.5' // 行高
                };
            } else {
                // 键盘收起时，使用默认高度
                return {
                    height: '300px',
                    marginBottom: '12px',
                    whiteSpace: 'pre-wrap', // 支持换行符
                    wordWrap: 'break-word', // 自动换行
                    lineHeight: '1.5' // 行高
                };
            }
        },

        // 文本框容器样式
        textareaContainerStyle() {
            if (this.keyboardHeight > 0) {
                // 键盘弹起时，容器高度需要为键盘和功能栏留出空间
                const totalDeduction = this.keyboardHeight + 200; // 键盘高度 + 功能栏高度 + 间距
                return {
                    height: `calc(100vh - ${totalDeduction}px)`,
                    flex: '1'
                };
            } else {
                // 键盘收起时，使用默认高度
                return {
                    height: '300px',
                    flex: '1'
                };
            }
        },
        
        // 当前字数统计
        currentWordCount() {
            return this.displayContent.length;
        }

    },
    watch: {
        // 监听显示内容变化
        displayContent(newVal, oldVal) {
            try {
                // 如果文本框处于聚焦状态且键盘弹起，自动滚动到底部
                if (this.isTextareaFocused && this.keyboardHeight > 0) {
                    // 延迟执行，确保DOM已更新
                    this.$nextTick(() => {
                        this.scrollToTextareaBottom();
                    });
                }

                // 检查是否有图片被删除
                this.syncContentWithDisplay();
            } catch (error) {
                console.error('Error in displayContent watcher:', error);
            }
        }
    },
    onShow() {
        console.log('添加任务页面显示');
        // 监听键盘事件
        try {
            uni.onKeyboardHeightChange(this.onKeyboardHeightChange);
        } catch (error) {
            console.error('Error registering keyboard height change listener in onShow:', error);
        }
    },
    onHide() {
        console.log('添加任务页面隐藏');
        // 取消监听键盘事件
        try {
            uni.offKeyboardHeightChange(this.onKeyboardHeightChange);
        } catch (error) {
            console.error('Error unregistering keyboard height change listener in onHide:', error);
        }
    },
    onUnload() {
        console.log('添加任务页面卸载');
        // 取消监听键盘事件
        try {
            uni.offKeyboardHeightChange(this.onKeyboardHeightChange);
        } catch (error) {
            console.error('Error unregistering keyboard height change listener in onUnload:', error);
        }
    },
    methods: {
        ...mapActions('task', ['addTask']),

        // 同步显示内容和实际提交内容
        syncContentWithDisplay() {
            try {
                // 基于displayContent和imageMap生成submissionContent
                let content = this.displayContent;

                // 检查是否有图片被删除
                const deletedImages = [];
                this.imageMap.forEach((image, index) => {
                    if (!content.includes(image.placeholder)) {
                        deletedImages.push(index);
                    }
                });

                // 从imageMap中移除已删除的图片（从后往前删除，避免索引变化）
                for (let i = deletedImages.length - 1; i >= 0; i--) {
                    this.imageMap.splice(deletedImages[i], 1);
                }

                // 将所有【图片】占位符替换为对应的Markdown代码
                this.imageMap.forEach(image => {
                    const placeholderRegex = new RegExp(image.placeholder.replace(/[[\]]/g, '\\$&'), 'g');
                    content = content.replace(placeholderRegex, image.markdown);
                });

                this.submissionContent = content;
                // 同时更新taskForm中的markdown内容
                this.taskForm.markdown = content;
            } catch (error) {
                console.error('Error in syncContentWithDisplay:', error);
            }
        },

        // 从提交内容生成显示内容
        generateDisplayContent() {
            try {
                // 如果是初始化，需要从submissionContent中提取已有的图片并建立映射
                if (this.imageMap.length === 0) {
                    // 匹配Markdown图片语法: ![alt](url)
                    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
                    let match;
                    let index = 1;

                    // 清空现有映射
                    this.imageMap = [];

                    // 查找所有图片并建立映射
                    while ((match = imageRegex.exec(this.submissionContent)) !== null) {
                        const altText = match[1];
                        const imageUrl = match[2];
                        const placeholder = `[图片${index}]`;
                        const markdown = match[0]; // 完整的Markdown语法

                        this.imageMap.push({
                            placeholder: placeholder,
                            markdown: markdown
                        });

                        // 更新图片计数器
                        if (index > this.imageCounter) {
                            this.imageCounter = index;
                        }

                        index++;
                    }
                }

                // 将所有Markdown图片代码替换为【图片】占位符
                let content = this.submissionContent;
                this.imageMap.forEach(image => {
                    const markdownRegex = new RegExp(image.markdown.replace(/[[\]()]/g, '\\$&'), 'g');
                    content = content.replace(markdownRegex, image.placeholder);
                });

                this.displayContent = content;
            } catch (error) {
                console.error('Error in generateDisplayContent:', error);
            }
        },

        // 滚动事件处理
        onScroll(e) {
            // 可以在这里处理滚动事件
        },

        // 文本框滚动事件处理
        onTextareaScroll(e) {
            // 可以在这里处理文本框的滚动事件
        },

        // 文本框获得焦点事件
        onTextareaFocus(e) {
            try {
                this.isTextareaFocused = true;
                console.log('文本框获得焦点');

                // 延迟执行滚动到底部，确保DOM已更新
                this.$nextTick(() => {
                    this.scrollToTextareaBottom();
                });
            } catch (error) {
                console.error('Error in onTextareaFocus:', error);
            }
        },

        // 文本框失去焦点事件
        onTextareaBlur(e) {
            try {
                this.isTextareaFocused = false;
                console.log('文本框失去焦点');
            } catch (error) {
                console.error('Error in onTextareaBlur:', error);
            }
        },

        // 滚动到文本框底部
        scrollToTextareaBottom() {
            try {
                if (!this.isTextareaFocused) return;

                // 使用更准确的方法计算滚动位置
                const textarea = this.$refs.submissionTextarea;
                if (textarea) {
                    // 获取文本框的实际高度
                    this.$nextTick(() => {
                        const textareaElement = textarea.$el || textarea;
                        if (textareaElement) {
                            const scrollHeight = textareaElement.scrollHeight || 0;
                            const clientHeight = textareaElement.clientHeight || 0;

                            // 如果内容高度大于可视高度，则滚动到底部
                            if (scrollHeight > clientHeight) {
                                this.textareaScrollTop = scrollHeight - clientHeight;
                            }
                        }
                    });
                }

                console.log('滚动到文本框底部');
            } catch (error) {
                console.error('Error in scrollToTextareaBottom:', error);
            }
        },

        // 键盘高度变化处理
        onKeyboardHeightChange(res) {
            try {
                this.keyboardHeight = res.height || 0;

                // 当键盘弹起时
                if (res.height > 0) {
                    console.log('键盘弹起，高度:', res.height);

                    // 如果文本框处于聚焦状态，滚动到最后一行
                    if (this.isTextareaFocused) {
                        // 延迟执行，确保布局已更新
                        setTimeout(() => {
                            this.scrollToTextareaBottom();
                        }, 100);
                    }
                } else {
                    console.log('键盘收起');
                }

                // 强制重新计算布局
                this.$forceUpdate();
            } catch (error) {
                console.error('Error in onKeyboardHeightChange:', error);
            }
        },

        // 预览Markdown内容
        previewMarkdown() {
            // 预览时使用submissionContent（包含Markdown图片代码）
            if (!this.submissionContent.trim()) {
                uni.showToast({
                    title: '请输入内容后再预览',
                    icon: 'none'
                });
                return;
            }

            // 跳转到预览页面，传递内容
            uni.navigateTo({
                url: `/pages/chatList/markdownPreview?content=${encodeURIComponent(this.submissionContent)}`
            });
        },

        // 跳转到Markdown语法教程
        goToMarkdownGuide() {
            uni.navigateTo({
                url: '/pages/chatList/markdownGuide'
            });
        },

        // 图片上传功能
        uploadImage() {
            if (this.uploading) {
                return;
            }

            this.uploading = true;

            // 选择图片（uni.chooseImage不返回Promise，使用回调方式）
            uni.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                sourceType: ['album', 'camera'],
                success: (chooseRes) => {
                    try {
                        const tempFilePath = chooseRes.tempFilePaths[0];

                        // 不再上传到服务器，而是本地保存
                        // 生成占位符和Markdown代码
                        // 修复图片编号问题：使用一个递增的计数器而不是imageMap.length
                        this.imageCounter = this.imageCounter || 0;
                        this.imageCounter++;
                        const placeholder = `[图片${this.imageCounter}]`;
                        // 本地临时保存图片路径
                        const imageMarkdown = `![图片${this.imageCounter}](${tempFilePath})`;

                        // 添加到图片映射中
                        this.imageMap.push({
                            placeholder: placeholder,
                            markdown: imageMarkdown,
                            localPath: tempFilePath // 保存本地路径
                        });

                        // 在光标位置插入占位符
                        const textarea = this.$refs.submissionTextarea;
                        let newDisplayContent = this.displayContent;

                        if (textarea && textarea.$el) {
                            // 获取光标位置
                            const cursorPosition = textarea.$el.selectionStart || newDisplayContent.length;
                            const beforeText = newDisplayContent.substring(0, cursorPosition);
                            const afterText = newDisplayContent.substring(cursorPosition);
                            newDisplayContent = beforeText + `\n${placeholder}\n` + afterText;
                        } else {
                            // 如果无法获取光标位置，则在末尾添加
                            newDisplayContent += `\n${placeholder}\n`;
                        }

                        // 更新显示内容
                        this.displayContent = newDisplayContent;

                        // 同步内容
                        this.syncContentWithDisplay();

                        uni.showToast({
                            title: '图片已添加',
                            icon: 'success'
                        });
                    } catch (error) {
                        uni.showToast({
                            title: error.message || '添加失败',
                            icon: 'none'
                        });
                    } finally {
                        this.uploading = false;
                    }
                },
                fail: (chooseErr) => {
                    console.error('选择图片失败:', chooseErr);
                    uni.showToast({
                        title: '选择图片失败',
                        icon: 'none'
                    });
                    this.uploading = false;
                }
            });
        },

        // 返回上一页
        goBack() {
            uni.navigateBack();
        },

        // 提交任务
        async submitTask() {
            // 表单验证
            if (!this.taskForm.title) {
                uni.showToast({
                    title: '请输入任务标题',
                    icon: 'none'
                });
                return;
            }

            if (!this.submissionContent.trim()) {
                uni.showToast({
                    title: '请输入任务内容',
                    icon: 'none'
                });
                return;
            }

            // 检查字数限制
            if (this.submissionContent.length > 5000) {
                uni.showToast({
                    title: '任务内容不能超过5000字',
                    icon: 'none'
                });
                return;
            }

            // 显示加载状态
            this.submitLoading = true;

            try {
                uni.showLoading({
                    title: '提交任务中...'
                });

                // 先提交任务内容获取任务ID
                const taskData = {
                    title: this.taskForm.title,
                    markdown: this.submissionContent
                };
                console.log('提交任务数据:++++++++++++++++++', taskData);
                const result = await this.addTask(taskData);

                if (result && result.code === 200) {
                    // 获取任务ID
                    const taskId = result.data;
                    
                    // 检查是否有本地图片文件需要上传
                    const imageFiles = this.imageMap.map(image => image.localPath).filter(path => path);
                    
                    // 如果有图片需要上传，直接使用UploadUtils上传
                    if (imageFiles.length > 0 && taskId) {
                        // 逐个上传图片
                        for (let i = 0; i < imageFiles.length; i++) {
                            await UploadUtils.uploadFile({
                                url: '/article/task/createTaskImage',
                                filePath: imageFiles[i],
                                name: 'file',
                                formData: {
                                    taskId: taskId.toString()
                                }
                            });
                        }
                    }
                    
                    uni.showToast({
                        title: '任务发布成功',
                        icon: 'success'
                    });

                    // 返回上一页并刷新数据
                    setTimeout(() => {
                        const pages = getCurrentPages();
                        if (pages.length >= 2) {
                            const prevPage = pages[pages.length - 2];
                            // 调用前一页的刷新方法（如果有的话）
                            if (prevPage && typeof prevPage.$vm.loadTasks === 'function') {
                                prevPage.$vm.loadTasks();
                            }
                            uni.navigateBack();
                        } else {
                            uni.switchTab({
                                url: '/pages/index/index'
                            });
                        }
                    }, 1500);
                } else {
                    throw new Error(result.msg || '任务发布失败');
                }
            } catch (error) {
                console.error('任务发布失败:', error);
                uni.showToast({
                    title: error.message || '任务发布失败',
                    icon: 'none'
                });
            } finally {
                uni.hideLoading();
                this.submitLoading = false;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.add-task-page {
    min-height: 100vh;
    background-color: #f5f7fb;
}

/* 顶部导航 */
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
}

.logo {
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 1.4rem;
    color: white;
    cursor: pointer;
    padding: 5px 0;
    /* 增加点击区域 */

    span {
        margin-left: 8px;
    }
}

.header-actions {
    display: flex;
    gap: 15px;
}

.content {
    padding: 20px 15px;
}

.form-container {
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-section {
    margin-bottom: 25px;

    &:last-child {
        margin-bottom: 0;
    }
}

.title-section {
    margin-top: 10px;
    margin-bottom: 30px;
}

.section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #212529;
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-bottom: 2px solid #f8f9fa;
}

.form-item {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.title-input {
    ::v-deep .u-input__input {
        font-size: 18px;
        font-weight: 600;
        color: #333 !important;
    }

    ::v-deep .u-input__content {
        padding: 12px 15px;
    }
}

/* Markdown编辑器样式 */
.editor-container {
    display: flex;
    flex-direction: column;
    min-height: 300px;
    height: 100%;
    flex: 1;
    position: relative;
}

/* 文本框容器样式 */
.textarea-container {
    flex: 1;
    min-height: 200px;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
}

.submission-text {
    width: 100%;
    min-height: 100%;
    /* 确保文本框占满scroll-view */
    padding: 12px;
    font-size: 0.95rem;
    line-height: 1.5;
    background-color: #ffffff;
    transition: all 0.3s ease;
    border: none;
    outline: none;
    box-shadow: none;
    border-radius: 8px;
    box-sizing: border-box;
    resize: none;
    overflow-y: visible;
    /* 允许内容溢出，由scroll-view处理滚动 */
    white-space: pre-wrap;
    /* 支持换行符 */
    word-wrap: break-word;
    /* 自动换行 */
}

.submission-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 8px 12px;
    background-color: #f8f9fa;
    border-radius: 8px;
    width: 100%;
    box-sizing: border-box;
    flex-shrink: 0;
}

.markdown-info {
    display: flex;
    align-items: center;
    gap: 5px;
}

.markdown-text {
    font-size: 0.85rem;
    color: #495057;
    font-weight: 500;
}

.submission-text {
    width: 100%;
    min-height: 100%;
    /* 确保文本框占满scroll-view */
    padding: 12px;
    font-size: 0.95rem;
    line-height: 1.5;
    background-color: #ffffff;
    transition: all 0.3s ease;
    border: none;
    outline: none;
    box-shadow: none;
    border-radius: 8px;
    box-sizing: border-box;
    resize: none;
    overflow-y: visible;
    /* 允许内容溢出，由scroll-view处理滚动 */
}

.toolbar-text {
    font-size: 0.9rem;
    color: #4361ee;
    cursor: pointer;
}

/* 图片功能栏样式 */
.image-toolbar {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-top: 1px solid #e9ecef;
    margin-top: 10px;
    background-color: #ffffff;

    .toolbar-icon {
        margin-right: 8px;
        cursor: pointer;
        padding: 5px;
        border-radius: 4px;

        &:hover {
            background-color: #f0f0f0;
        }
    }

    .toolbar-text {
        font-size: 0.9rem;
        color: #4361ee;
        cursor: pointer;
        padding: 5px;
        border-radius: 4px;

        &:hover {
            background-color: #f0f0f0;
        }
    }
}

/* 字数统计样式 */
.word-count {
    text-align: right;
    padding: 5px 10px;
    background-color: #f8f9fa;
    border-top: 1px solid #e9ecef;
}

.count-text {
    font-size: 0.8rem;
    color: #6c757d;
}
</style>