<template>
  <el-container>
    <el-aside width="330px">
      <div class="logo">TALENT SIX</div>
      <el-divider class="logo-divider"></el-divider>
      <div class="list">
        <div class="wrap" v-for="item in chatList" :key="item.id" @click="toChat(item.id,item.name,item)">
          <div class="chatList">
            <div class="left">
              <el-badge :is-dot="item.isNewMsg" class="badge">
                <el-avatar shape="square" :size="50" :src="item.avatar">
                  <img src="../../assets/images/default-avatar.jpg" />
                </el-avatar>
              </el-badge>
            </div>
            <div class="right">
              <div class="top">
                <div class="name">{{item.name}}</div>
              </div>
              <div class="bottom">
                <div class="message">{{item.message}}</div>
                <div class="time">{{item.time}}</div>
              </div>
            </div>
          </div>
          <el-divider class="divider"></el-divider>
        </div>
      </div>
    </el-aside>
    <ChatWindow ref="chatWindow" :key="chatTimer" :friendName.sync="friendName" :friendId.sync="currentChatId"></ChatWindow>
  </el-container>
</template>

<script>
  export default {
    name: 'chatList',
    components: {
      ChatWindow: resolve => {
        require(['@/components/chat/chatWindow'], resolve)
      }
    },
    data() {
      return {}
    },
    computed: {
      ...$mapGetters(['chatList', 'friendName', 'currentChatId', 'chatTimer'])
    },
    methods: {
      ...$mapActions(['chat_updateChatList', 'chat_updateFriendName', 'chat_updateCurrentChatId',
        'chat_updateChatTimer', 'chat_initChatList'
      ]),
      toChat(friendId, friendName, obj) {
        obj.isNewMsg = false;

        if (friendId == this.currentChatId) {
          return;
        }

        this.chat_updateFriendName(friendName);
        this.chat_updateCurrentChatId(friendId);

        if (this.$refs.chatWindow) {
          this.$refs.chatWindow.content = "";
        }

        //重新加载组件
        this.$nextTick(() => {
          this.chat_updateChatTimer();
        })
      }
    },
    mounted() {

      //初始化聊天列表
      this.chat_initChatList();

      //默认选择第一个
      this.$nextTick(() => {
        if ($(".el-aside .list .wrap:first")) {
          $(".el-aside .list .wrap:first").click();
        }
      })
    }
  }
</script>

<style scoped>
  .el-container {
    height: 100%;
    width: 100%;
    background-color: #DCDFE6;
  }

  .el-aside {
    user-select: none;
    background-color: #FFFFFF;
    border-top: solid #DCDFE6;
    border-bottom: solid #DCDFE6;
    border-right: 2px solid #DCDFE6;
    box-shadow: 0 0 8px rgba(0, 0, 0, .1);
  }

  .el-aside .logo {
    text-align: center;
    margin-top: 30px;
    font-weight: 500;
    font-size: 22px;
  }

  .el-aside .logo-divider {
    margin: 24px 8px 0px 8px;
    height: 2px;
    width: auto;
  }

  .el-aside .divider {
    margin: 24px 10px 0px 10px;
    width: auto;
  }

  .el-aside .list {
    margin-top: 20px;
  }

  .el-aside .list .chatList {
    display: -webkit-box;
    padding: 0 10px;
    height: 70px;
    padding-top: 18px;
  }

  .el-aside .list .chatList .left {
    width: 22%;
    text-align: center;
    margin-top: 5px;
  }

  .el-aside .list .chatList .right {
    width: 78%;
    margin-left: 5px;
    margin-top: 5px;
  }

  .el-aside .list .chatList .right .top .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .el-aside .list .chatList .right .bottom {
    display: -webkit-box;
    margin-top: 10px;
  }

  .el-aside .list .chatList .right .bottom .message {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 70%;
    font-size: 13px;
    color: #a5a5a5;
  }

  .el-aside .list .chatList .right .bottom .time {
    width: 28%;
    font-size: 13px;
    color: #a5a5a5;
    margin-top: 2px;
    margin-left: 8px;
  }

  .el-aside .wrap:hover {
    background-color: #efefef;
    cursor: default;
  }
</style>
<style>
  .el-aside .chatList .left .el-badge__content {
    height: 8px !important;
    width: 8px !important;
    padding: 0 !important;
    right: 0 !important;
    border-radius: 50% !important;
    border: none !important;
    right: 4px !important;
  }
</style>
