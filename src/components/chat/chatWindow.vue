<template>
  <el-container>
    <el-header>
      <div class="wrap">
        <div class="name">
          {{friendName}}
        </div>
      </div>
    </el-header>
    <el-main>
      <div ref="chatContent" class="chat-content">
        <template v-for="(message,index) in messageList">
          <div class="other" v-if="message.type == 'other'" :key="index">
            <el-avatar class="avatar" shape="square" :size="35">
              <img src="../../assets/images/default-avatar.jpg" />
            </el-avatar>
            <div class="message">
              <div class="bubble left bubble-other">
                <div class="bubble-content">
                  <pre>{{message.content}}</pre>
                </div>
              </div>
            </div>
          </div>
          <div class="oneself" v-if="message.type == 'oneself'" :key="index">
            <el-avatar class="avatar" shape="square" :size="35">
              <img src="../../assets/images/default-avatar.jpg" />
            </el-avatar>
            <div class="message">
              <div class="bubble right bubble-oneself">
                <div class="bubble-content">
                  <pre>{{message.content}}</pre>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="input-box">
        <el-input @keyup.enter.native="send()" id="content" type="textarea" v-model="content">
        </el-input>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import WebSocket from '@/assets/js/WebSocket.js';

  export default {
    name: 'chatWindow',
    props: ["friendName", "friendId"],
    data() {
      return {
        content: ""
      }
    },
    watch: {
      //监听消息，滚动条下拉到最底
      messageList: {
        handler(newValue, oldValue) {
          this.$nextTick(() => {
            this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight;
          })
        },
        deep: true
      }
    },
    computed: {
      ...$mapGetters(['messageList'])
    },
    methods: {
      ...$mapActions(['chat_updateChatList', 'chat_updateMessageList']),
      send() {
        let content = this.content;

        let params = {
          sender: window.localStorage.getItem("userId"),
          receiver: this.friendId,
          content: content,
          senderNickName: window.localStorage.getItem("nickName")
        }

        //暂不支持自己给自己发送
        //仅展示
        if (params.sender != params.receiver) {
          let url = $Constant.API_ENV + "/api/chat/single";
          $Common.axios.request(url, "POST", params, res => {

            if (res.data.code === '0') {

              //更新对话内容
              this.chat_updateMessageList({
                type: 'oneself',
                content: content,
                time: res.data.data
              });

              //更新聊天列表
              this.chat_updateChatList({
                sender: this.friendId,
                senderNickName: this.friendName,
                message: content,
                time: res.data.data
              });

              //存储聊天记录
              $Common.setChatRecord(this.friendId, content, 'oneself', res.data.data);

              this.content = "";
            }
          }, false, false)
        } else {

          //更新对话内容
          this.chat_updateMessageList({
            type: 'oneself',
            content: content,
            time: new Date().getTime()
          });

          this.content = "";

          //存储聊天记录
          $Common.setChatRecord(this.friendId, content, 'oneself', 0);
        }
      }
    },
    mounted() {

      //加载聊天记录
      this.$nextTick(() => {
        this.chat_updateMessageList(null);

        let friendMessages = window.localStorage.getItem("friend-" + this.friendId);
        if (friendMessages) {
          let jsonMessage = JSON.parse(friendMessages);
          $.each(jsonMessage, (i, item) => {
            this.chat_updateMessageList(item);
          })
        }
      })
    }
  }
</script>

<style scoped>
  .el-header {
    width: 100%;
    height: 86px !important;
    border-top: solid #DCDFE6;
    border-right: solid #DCDFE6;
    border-bottom: 2px solid #DCDFE6;
    background-color: #f7f7f7;
  }

  .el-header .wrap .name {
    margin-top: 25px;
    margin-left: 20px;
    font-size: 20px;
  }

  .el-main {
    background-color: #FFFFFF;
    border-right: solid #DCDFE6;
    border-bottom: solid #DCDFE6;
    width: 100%;
    height: 100%;
    padding: inherit;
    background-color: #f7f7f7;
  }

  .el-main .chat-content {
    height: 75%;
    overflow: auto;
    overflow-x: hidden;
  }

  .el-main .chat-content .other {
    padding: 25px 0px 0px 25px;
    margin-bottom: 25px;
    float: left;
    width: 100%;
  }

  .el-main .chat-content .other .avatar {
    float: left;
  }

  .el-main .chat-content .oneself {
    width: 100%;
    padding: 25px 25px 0px 0px;
    margin-bottom: 25px;
    float: right;
    text-align: right;
    clear: right;
  }

  .el-main .chat-content .oneself .avatar {
    float: right;
  }

  .el-main .chat-content .other .message,
  .el-main .chat-content .oneself .message {
    overflow: hidden;
  }

  .bubble-other {
    background-color: #fff;
  }

  .bubble-oneself {
    background-color: #33FF00;
  }

  .bubble {
    max-width: 380px;
    min-height: 1em;
    display: inline-block;
    vertical-align: top;
    position: relative;
    text-align: left;
    font-size: 14px;
    border-radius: 3px;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    margin: 0 15px;
  }

  .bubble::after,
  .bubble::before {
    position: absolute;
    top: 12px;
    border: 6px solid transparent;
    content: " ";
  }

  .bubble.left:after,
  .bubble.left:before {
    right: 100%;
  }

  .bubble.left:after {
    border-right-color: #fff;
    border-right-width: 5px;
  }

  .bubble.right:after,
  .bubble.right:before {
    left: 100%;
  }

  .bubble.right:after {
    border-left-color: #33FF00;
    border-left-width: 5px;
  }

  .bubble-content {
    min-height: 25px;
    padding: 9px 13px;
  }

  .bubble-content pre {
    white-space: pre-wrap !important;
    word-break: break-word !important;
  }

  .el-main .input-box {
    height: 25%;
    border-top: 1px solid #DCDFE6;
    background-color: #f7f7f7;
    z-index: 9999;
  }
</style>

<style>
  .el-main .input-box .el-textarea {
    height: 100% !important;
  }

  .el-main .input-box .el-textarea .el-textarea__inner {
    height: 100% !important;
    min-height: auto !important;
    resize: none !important;
    border-radius: initial !important;
    border-left: none !important;
    border-right: none !important;
    border-bottom: none !important;
    padding: 15px !important;
    background-color: #f7f7f7 !important;
  }

  .el-main .input-box .el-textarea .el-textarea__inner:focus {
    border-color: #DCDFE6 !important;
  }

  .el-main .input-box .el-textarea .el-textarea__inner:hover {
    border-color: #DCDFE6 !important;
  }
</style>
