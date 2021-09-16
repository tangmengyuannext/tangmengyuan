<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-input type="text" v-model="queryParams.sendContent" placeholder="请输入" size="small"></el-input>
      <el-button icon="el-icon-refresh" size="mini" @click="handleSendButton">发送</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  // name: "Line",
  data() {
    return {
      username: "",
      queryParams: {
        sendContent: undefined
      },
    };
  },
  created() {
    this.username = Math.random() + "";
    this.initWebSocket();
  },
  mounted() {
    window.addEventListener("message", function (e) {
      console.log(e.data.data, "-------data");
    });
  },
  methods: {
    initWebSocket () {
      const wsuri = 'ws://localhost:8088/websocket/' + this.username;
      this.webSocketObject = new WebSocket(wsuri);
      this.webSocketObject.onopen = this.webSocketOnOpen
      this.webSocketObject.onmessage = this.webSocketOnMessage
      this.webSocketObject.onerror = this.webSocketOnError
      this.webSocketObject.onclose = this.webSocketOnClose
    },
    webSocketOnOpen(e){
      console.log('与服务端连接打开->',e)
    },
    webSocketOnMessage(e){
      console.log('来自服务端的消息->',e)
      // let tempData = JSON.parse(e.data)
      // if (tempData.messageType == "HeartBeat") { // 判断心跳
      //   const message = {
      //     messageType: 'HeartBeat',
      //     messageContent: ''
      //   }
      //   this.webSocketObject.send(JSON.stringify(message))
      //   console.log('======心跳======')
      //   return
      // }
    },
    webSocketOnError(e){
      console.log('与服务端连接异常->',e)
    },
    webSocketOnClose(e){
      console.log('与服务端连接关闭->',e)
    },
    handleSendButton() {
      // const username = this.username
      // const message = this.queryParams.sendContent
      // this.webSocketObject.send(JSON.stringify({
      //   id: 1,
      //   message,
      //   username,
      //   time: new Date().getTime()
      // }))
      // this.queryParams.sendContent = ''
      const message = {
          messageType: 'HeartBeat',
          messageContent: ''
        }
        this.webSocketObject.send(JSON.stringify(message))
    },
  },
  watch: {},
};
</script>
