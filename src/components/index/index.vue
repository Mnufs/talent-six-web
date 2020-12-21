<template>
  <el-container>
    <el-aside width="100px" class="navigation-bar">
      <div class="avatar">
        <el-avatar shape="square" :size="40" :src="avatar">
          <img src="../../assets/images/default-avatar.jpg" />
        </el-avatar>
      </div>
      <div class="menu">
        <div class="item">
          <i @click="change('chat')" :class="[{'active':type=='chat'},'el-icon-chat-line-round']"></i>
        </div>
        <div class="item">
          <el-badge :value="newFriendUnreadCount" :hidden="newFriendUnreadCount == 0?true:false" :max="99">
            <i @click="change('friend')" :class="[{'active':type=='friend'},'el-icon-s-custom']"></i>
          </el-badge>
        </div>
      </div>

      <el-popover trigger="click" placement="right">
        <div>
          <span class="setting-item" @click="setting(null)">设置</span>
        </div>
        <div>
          <span class="setting-item" @click="setting('signOut')">退出</span>
        </div>
        <i slot="reference" class="setting el-icon-s-tools"></i>
      </el-popover>
    </el-aside>
    <ChatList v-show="type == 'chat'"></ChatList>
    <FriendList @change="change" v-show="type == 'friend'"></FriendList>
  </el-container>
</template>

<script>
  import WebSocket from '@/assets/js/WebSocket.js';

  export default {
    name: 'index',
    components: {
      ChatList: resolve => {
        require(['@/components/chat/chatList'], resolve)
      },
      FriendList: resolve => {
        require(['@/components/friend/friendList'], resolve)
      }
    },
    data() {
      return {
        type: "",
        avatar: window.localStorage.getItem("avatar")
      }
    },
    computed: {
      ...$mapGetters(['currentChatId', 'newFriendUnreadCount', 'newFriendList'])
    },
    methods: {
      ...$mapActions(['chat_updateChatList', 'chat_updateMessageList', 'friend_addNewFriendUnreadCount',
        'friend_subtractNewFriendUnreadCount',
        'friend_initNewFriendUnreadCount', 'friend_updateNewFriendList'
      ]),
      setting(type) {
        if (!type) {
          this.$message.info("敬请期待!");
          return;
        }
        switch (type) {
          case 'signOut':
            this.$confirm('是否确定退出？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              //清除登陆信息
              $Common.clearLocalStorage();
              //跳转到登录页
              this.$router.push({
                name: 'login'
              });
            }).catch(() => {});
            break;
        }

      },
      change(type) {
        if (!type) {
          this.$message.info("敬请期待！")
          return;
        }

        this.type = type;
      },
      getUnreadFriendRequestCount() {

        let url = $Constant.API_ENV + "/api/friend/getUnreadFriendRequestCount";
        $Common.axios.request(url, "GET", {}, res => {

          if (res.data.code === '0') {
            this.friend_initNewFriendUnreadCount(res.data.data);
          }
        }, false, false)
      }
    },
    mounted() {

      //获取未读的好友申请数量
      this.getUnreadFriendRequestCount();

      //默认打开聊天列表
      this.change('chat');

      //订阅地址
      let subscribeUrl = '/user/' + window.localStorage.getItem("userId") + '/single';

      //初始化，监听消息
      let this_ = this;
      WebSocket.init(
        subscribeUrl,
        data => {
          let res = JSON.parse(data.body);
          let dataType = res.dataType;

          switch (dataType) {
            //聊天内容
            case "chat":

              let sender = res.sender;
              let content = res.content;
              let time = res.time;
              let senderNickName = res.senderNickName;

              this.chat_updateChatList({
                "sender": sender,
                "senderNickName": senderNickName,
                "message": content,
                "time": time
              });

              //判断是否在跟当前好友聊天
              //如果是，直接在聊天窗口展示
              if (this_.currentChatId == sender) {

                this_.chat_updateMessageList({
                  type: 'other',
                  content: content,
                  time: time
                });
              }

              //存储聊天记录
              $Common.setChatRecord(sender, content, 'other', time);
              break;
              //好友请求
            case "friendRequest":

              //更新新朋友列表
              this_.friend_updateNewFriendList({
                id:res.id,
                userId:res.userId,
                nickName:res.nickName,
                status:res.status,
                message:res.message,
                avatar:res.avatar
              });

              //更新未读数量
              this_.friend_addNewFriendUnreadCount();
              break;
          }
        },
        error => {
          console.error(error);
        });
    }
  }
</script>

<style scoped>
  .el-container {
    height: 100%;
    width: 100%;
    background-color: #DCDFE6;
  }

  .navigation-bar {
    background-color: #4a4949;
  }

  .navigation-bar .avatar {
    text-align: center;
    margin-top: 30px;
  }

  .navigation-bar .menu {
    height: 50%;
    width: 100%;
    margin-top: 70px;
    text-align: center;
  }

  .navigation-bar .menu .item {
    display: block;
    margin-top: 50px;
  }

  .navigation-bar .menu .item i {
    font-size: 25px;
    color: #bbbbbb;
    cursor: pointer;
  }

  .navigation-bar .menu .item .active {
    color: #22bd22;
  }

  .navigation-bar .setting {
    position: fixed;
    bottom: 25px;
    font-size: 25px;
    color: #bbbbbb;
    left: 37px;
    cursor: pointer;
  }

  .setting-item {
    height: 50px;
    width: 80px;
    display: block;
    text-align: center;
    display: table-cell;
    vertical-align: middle;
    cursor: pointer;
    border-radius: 5%;
  }

  .setting-item:hover {
    background-color: #DCDFE6;
  }
</style>
<style>
  .el-popover {
    border: none !important;
    padding: 0 !important;
    min-width: auto !important;
  }

  .el-popover .popper__arrow {
    display: none !important
  }
</style>
