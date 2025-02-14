<template>
  <div class="markdown-content">
    <!-- 使用 v-html 渲染净化后的 HTML -->
    <div v-html="purifiedHtml"></div>
  </div>
</template>

<script>
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default {
  props: {
    markdown: {
      type: String,
      required: true
    }
  },
  computed: {
    // 计算属性：转换 Markdown 并净化
    purifiedHtml() {
      const rawHtml = marked(this.markdown, this.markedOptions);
      return DOMPurify.sanitize(rawHtml);
    }
  },
  data() {
    return {
      // Marked 配置选项
      markedOptions: {
        gfm: true,         // 启用 GitHub 风格
        breaks: true,      // 换行符转 <br>
        highlight: this.highlightCode // 代码高亮（可选）
      }
    }
  },
  methods: {
    // 代码高亮方法（需额外安装 highlight.js）
    highlightCode(code, lang) {
      const hljs = require('highlight.js');
      const validLang = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(validLang, code).value;
    }
  }
}
</script>

<style>
/* 添加基础 Markdown 样式 */
.markdown-content h1 { font-size: 2em; }
.markdown-content pre {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
}
/* 代码高亮样式（需单独引入） */
@import '~highlight.js/styles/github.css';
</style>