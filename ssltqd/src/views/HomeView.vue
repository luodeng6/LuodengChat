<template>
  <div>
    <h1>{{currentUser}}对话{{oppositeUser}}！！</h1>

    <el-input type="textarea" v-model="AIMessage"></el-input>



    <p>当前用户为: {{ currentUser }}</p>
    <el-select v-model="currentUser" placeholder="选择您是哪位用户">
      <el-option label="用户A" value="userA"></el-option>
      <el-option label="用户B" value="userB"></el-option>
      <el-option label="用户C" value="userC"></el-option>
    </el-select>

    <p>对面用户: {{ oppositeUser }}</p>
    <el-select v-model="oppositeUser" placeholder="选择对方是哪位用户">
      <el-option label="用户A" value="userA"></el-option>
      <el-option label="用户B" value="userB"></el-option>
      <el-option label="用户C" value="userC"></el-option>
    </el-select>


    <p>消息列表:</p>
    <div class="chat-box">
      <div v-for="(msg, index) in messages" :key="index">
        [{{ msg.sender }}]: {{ msg.content }}
      </div>
    </div>
<!--    <el-alert
        v-show="ishow"
        :title="newMassageText"
        type="info"
        effect="dark">
    </el-alert>-->
    <el-input v-model="newMessage" @keyup.enter.native="sendMessage"></el-input>
    <el-button @click="sendMessage">发送</el-button>
    <el-button @click="open1">测试消息提示</el-button>
  </div>
</template>

<script>
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

import { ref, computed } from 'vue';
import { marked } from 'marked';

export default {
  name: 'HomeView',
  data() {
    return {
      ishow: false,
      newMassageText:null,
      currentUser: 'userA',
      AIMessage: '',
      messages: [],
      stompClient: null,
      oppositeUser:'',
      newMessage: '',
    };
  },
  computed: {
    formattedMessage: {
      get() {
        return this.AIMessage;
      },
      set(value) {
        this.AIMessage = value.replace(/\n/g, '</br>'); // 使用正则替换所有换行符
      }
    }
  },
  mounted() {
    // 连接websocket:为啥要链接websocket呢？因为后端已经将消息推送到了websocket上，所以我们只需要订阅websocket就可以收到消息
    if (this.stompClient && this.stompClient.ws.readyState === WebSocket.OPEN) {
      console.log("WebSocket已连接!!!!");
    } else {
      console.log("WebSocket未连接，正在连接....");
      this.connectWebSocket();
    }

  },
  methods: {
    open1() {
      this.$notify({
        title: '标题名称',
        message: h('i', { style: 'color: teal'}, '这是提示文案这是提示')
      });
    },
    // 连接websocket
    connectWebSocket() {
      const socket = new SockJS('http://localhost:84/chat');
      this.stompClient = Stomp.over(socket);

      // 连接服务器
      this.stompClient.connect({}, frame => {
        // 订阅消息
        this.stompClient.subscribe('/topic/messages', message => {
          console.log("接收到了消息！！！：");
          /*console.log(JSON.parse(message.body));*/

          let  responseData = JSON.parse(message.body);

          this.newMassageText=responseData.content;
          this.ishow=true;

          console.log("发送者:"+responseData.sender);
          console.log("接收者:"+responseData.receiver);
          console.log("内容:"+responseData.content);
          console.log("\n\n\n\n\\n\n\n\n");
        /*  {"sender":"userA","receiver":"userC","content":"？","timestamp":"2025-02-13T17:33:07.876+00:00"}*/
          if(responseData.receiver === this.currentUser) {

            if (responseData.sender === this.currentUser){
              console.log("22222222222222222222222222222222222222222");
            }
            //此行的作用是将服务器发来的消息解析成json格式
            this.messages.push(JSON.parse(message.body));

            this.$notify({
              title: responseData.sender+', 发来消息！',
              message: responseData.content,
              duration: 0 // 持续显示不会自动消失
            });

            this.$message({ message: responseData.sender+', 发来消息！:'+responseData.content, type:'success' });

          }else{
            // 自己发给自己的不显示！
            if (!responseData.sender === this.currentUser) {
              console.log("11111111111111111111111111111111111111111111");
              this.$notify({
                title: responseData.sender+', 发了一条消息！给'+responseData.receiver,
                message: "有人在聊天，但是不是你发，也不是你收！不给你看！",
                duration: 0 // 持续显示不会自动消失
              });
              this.messages.push(responseData);
              this.$message({ message: responseData.sender+', 发了一条消息！给'+responseData.receiver+',有人在聊天，但是不是你发，也不是你收！不给你看！', type: 'info' });
            }
          }

          this.AIMessage+=responseData.content;

          console.log("3333333333333333333333333333333333333333333333333");

        });
        console.log("打印数据：");
        console.log(this.messages);
      });
    },
    // 发送消息
    sendMessage() {
      // 发送消息前先判断消息内容是否为空
      if (this.newMessage.trim()) {
        // 构造消息对象
        const chatMessage = {
          sender: this.currentUser,
          receiver: this.oppositeUser,
          content: this.newMessage,
          timestamp: new Date()
        };

        this.stompClient.send("/app/chat", JSON.stringify(chatMessage));
        this.newMessage = '';
      }
    }
  }
};
</script>

