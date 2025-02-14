<template>
  <div class="chat-container">
    <el-card class="chat-box">
      <div class="message-list">
        <div v-for="(msg, index) in messages" :key="index" class="message">
          <div class="user">{{ msg.user }}</div>
          <div class="assistant">{{ msg.assistant }}</div>
        </div>
      </div>

      <el-input
          v-model="inputMsg"
          placeholder="输入消息..."
          @keyup.enter.native="sendMessage">
        <template #append>
          <el-button @click="sendMessage" :loading="loading">发送</el-button>
        </template>
      </el-input>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputMsg: "",
      messages: [],
      loading: false,
      controller: null // 用于中断请求
    };
  },
  methods: {
    async sendMessage() {
      if (!this.inputMsg.trim() || this.loading) return;

      this.loading = true;
      this.messages.push({
        user: this.inputMsg,
        assistant: ""
      });
      const currentIndex = this.messages.length - 1;
      this.inputMsg = "";

      try {
        const response = await fetch('http://localhost:84/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: this.messages[currentIndex].user })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value);
          // 处理SSE格式数据
          const parts = buffer.split('\n\n');
          buffer = parts.pop();

          for (const part of parts) {
            if (part.startsWith('data: ')) {
              const content = part.replace('data: ', '').trim();
              this.messages[currentIndex].assistant += content;
              // 滚动到底部
              this.$nextTick(() => {
                const container = this.$el.querySelector('.message-list');
                container.scrollTop = container.scrollHeight;
              });
            }
          }
        }
      } catch (error) {
        console.error('请求失败:', error);
        this.messages[currentIndex].assistant += "\n（请求中断）";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style>
.chat-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.message-list {
  height: 500px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.message {
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
}

.user {
  color: #409EFF;
  margin-bottom: 5px;
}

.assistant {
  color: #67C23A;
  white-space: pre-wrap;
}
</style>