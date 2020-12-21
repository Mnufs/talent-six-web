<template>
  <el-container>
    <div :class="[userInfo == null?'wrap-default':'wrap-detail']">
      <div class="default" v-if="userInfo == null">
        TALENT SIX
      </div>
      <div class="detail" v-else>
        <div class="top">
          <div class="name">
            {{userInfo.nickName}}
            <i v-if="userInfo.gender == '0'" class="iconfont icon-woman gender"></i>
            <i v-if="userInfo.gender == '1'" class="iconfont icon-man gender"></i>
          </div>
          <el-avatar shape="square" :size="90" :src="userInfo.avatar">
            <img src="../../assets/images/default-avatar.jpg" />
          </el-avatar>
        </div>
        <el-divider></el-divider>
        <div class="bottom">
          <template v-if="detailType == 'friend'">
            <el-button type="success" @click="toChat()">发消息</el-button>
          </template>
          <template v-if="detailType == 'newFriend' && friendRequestInfo != undefined">
            <el-button style="margin-right: 20px;" v-if="friendRequestInfo.status == '0' || friendRequestInfo.status == '2'" @click="passFriendValidation" type="success">通过验证</el-button>
            <el-button type="info" v-if="friendRequestInfo.status == '0'" @click="ignoreFriendRequest">忽略</el-button>
            <el-button type="success" v-if="friendRequestInfo.status == '1'" @click="toChat()">发消息</el-button>
          </template>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script>
  export default {
    name: 'friendDetail',
    props: ["detailType"],
    data() {
      return {
        userInfo: null,
        friendRequestInfo: null
      }
    },
    methods: {
      ...$mapActions(['chat_updateChatList','friend_subtractNewFriendUnreadCount']),
      getUserInfo(userId) {
        let params = {
          userId: userId
        }

        let url = $Constant.API_ENV + "/api/user/get";
        $Common.axios.request(url, "GET", params, res => {

          if (res.data.code === '0') {
            this.userInfo = res.data.data
          }
        }, false, false)
      },
      toChat() {
        this.$emit('toChat');

        let params = {
          "type": 'toChat',
          "sender": this.userInfo.id,
          "senderNickName": this.userInfo.nickName,
          "message": "",
          "time": 0
        }

        //查找最后一条聊天记录进行展示
        let friendMessages = window.sessionStorage.getItem("friend-" + this.userInfo.id);
        if (friendMessages) {
          let jsonMessage = JSON.parse(friendMessages);

          let obj = jsonMessage[jsonMessage.length - 1];
          params.message = obj.content;
          params.time = obj.time;
        }

        this.chat_updateChatList(params);

        $Common.setChatRecord(params.sender,params.message,);
      },
      passFriendValidation() {
        let params = {
          friendRequestId: this.friendRequestInfo.id
        }

        let url = $Constant.API_ENV + "/api/friend/passFriendValidation";
        $Common.axios.request(url, "POST", params, res => {

          if (res.data.code === '0') {
            this.friendRequestInfo.status = '1';
            this.friend_subtractNewFriendUnreadCount();
            this.$emit("listFriend");
          } else {
            this.$message.error(res.data.message);
          }
        }, false, false)
      },
      ignoreFriendRequest() {
        let params = {
          friendRequestId: this.friendRequestInfo.id
        }

        let url = $Constant.API_ENV + "/api/friend/ignoreFriendRequest";
        $Common.axios.request(url, "POST", params, res => {

          if (res.data.code === '0') {
            this.friendRequestInfo.status = '2';
            this.friend_subtractNewFriendUnreadCount();
          } else {
            this.$message.error(res.data.message);
          }
        }, false, false)
      }
    },
    mounted() {}
  }
</script>

<style scoped>
  .wrap-default {
    width: 100%;
    height: 100%;
    background-color: #f7f7f7;
    border-top: solid #DCDFE6;
    border-right: solid #DCDFE6;
    border-bottom: solid #DCDFE6;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .wrap-detail {
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-top: solid #DCDFE6;
    border-right: solid #DCDFE6;
    border-bottom: solid #DCDFE6;
    display: flex;
    justify-content: center;
  }

  .default {
    font-size: 30px;
    color: #d3d3d3;
  }

  .detail {
    width: 50%;
    margin-top: 80px;
  }

  .detail .top {
    height: 100px;
    display: flex;
  }

  .detail .top .name {
    font-size: 20px;
    font-weight: 400;
    float: left;
    width: 70%;
    height: 90px;
    display: flex;
    align-items: center;
  }

  .detail .top .gender {
    margin-left: 7px;
    margin-top: -1px;
    font-size: 18px;
  }

  .detail .top .icon-man {
    color: #11a9e0;
  }

  .detail .top .icon-woman {
    color: #e285b4;
  }

  .detail .bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 180px;
  }

  .el-avatar {
    float: right;
  }
</style>
