<template>
  <div>
    <MarkdownViewer :markdown="content" />
  </div>
</template>

<script>
import MarkdownViewer from '@/components/MarkdownViewer.vue';

export default {
  components: { MarkdownViewer },
  data() {
    return {
      content: `
        # Vue2 Markdown 示例
        **加粗文字** 和 *斜体文字*

        \`\`\`javascript
        console.log('代码高亮');
        \`\`\`
      `
    }
  }
}
</script>