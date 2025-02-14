<template>
  <div class="chat-container">
    <el-input
        v-model="question"
        placeholder="输入就业相关问题..."
        @keyup.enter="askQuestion"
    >
      <template #append>
        <el-button @click="askQuestion" :loading="loading">提问</el-button>
      </template>
    </el-input>

    <el-card class="response-box">
      <div class="response-content">
<!--        <p v-if="loading && !response">正在获取回答...</p>-->
        <pre>{{ response }}</pre>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      question: '',
      response: '',
      loading: false,
      eventSource: null
    };
  },
  methods: {
    askQuestion() {
      if (!this.question) return;

      this.loading = true;
      this.response = '';

      // 初始化EventSource连接
      this.eventSource = new EventSource(`/api/ask?question=${encodeURIComponent(this.question)}`);

      this.eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data.replace('Received: ', ''));
        const content = data.choices[0].delta.content;
        this.response += content;

        this.$nextTick(() => {
          const box = this.$el.querySelector('.response-content');
          box.scrollTop = box.scrollHeight;
        });
      };

      this.eventSource.onerror = () => {
        this.loading = false;
        this.eventSource.close();
      };
    }
  },
  beforeDestroy() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }
};
</script>

<style scoped>
.response-box {
  margin-top: 20px;
  height: 400px;
}
.response-content {
  height: 340px;
  overflow-y: auto;
  white-space: pre-wrap;
}
</style>