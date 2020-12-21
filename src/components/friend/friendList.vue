<template>
  <el-container>
    <el-aside width="330px">
      <div class="logo">
        TALENT SIX
        <div class="add-friend">
          <el-button @click="openAddFriendDialog" size="mini" icon="el-icon-plus" circle></el-button>
        </div>
      </div>
      <el-divider class="logo-divider"></el-divider>
      <div class="item new-friend">
        <div class="item-button" @click="view('newFriend',$event.currentTarget)">
          <el-badge :value="newFriendUnreadCount" :hidden="newFriendUnreadCount == 0?true:false" :max="99">
            <i class="el-icon-arrow-right"></i>&nbsp;新的朋友
          </el-badge>
        </div>
        <div class="list" v-if="isShow.newFriend">
          <div class="wrap" v-for="item in newFriendList" :key="item.id" @click="detail(item.userId,$event.currentTarget,'newFriend',item)">
            <div class="newFriendList">
              <div class="left">
                <el-avatar shape="square" :size="38" :src="item.avatar">
                  <img src="../../assets/images/default-avatar.jpg" />
                </el-avatar>
              </div>
              <div class="right">
                <div class="top">
                  <div class="name">{{item.nickName}}</div>
                  <div class="status">{{item.status | status}}</div>
                </div>
                <div class="bottom">
                  {{item.message}}
                </div>
              </div>
            </div>
            <el-divider class="divider"></el-divider>
          </div>
        </div>
      </div>
      <div class="item friend">
        <div class="item-button" @click="view('friend',$event.currentTarget)">
          <i class="el-icon-arrow-right"></i>&nbsp;联系人
        </div>
        <div class="list" v-if="isShow.friend">
          <div class="wrap" v-for="item in friendList" :key="item.friendId" @click="detail(item.friendId,$event.currentTarget,'friend')">
            <div class="friendList">
              <div class="left">
                <el-avatar shape="square" :size="50" :src="item.avatar">
                  <img src="../../assets/images/default-avatar.jpg" />
                </el-avatar>
              </div>
              <div class="right">
                <div class="name">{{item.friendName}}</div>
              </div>
            </div>
            <el-divider class="divider"></el-divider>
          </div>
        </div>
      </div>
    </el-aside>
    <FriendDetail @listFriend="listFriend" @toChat="toChat" :detailType.sync="detailType" ref="friendDetail"></FriendDetail>

    <el-dialog :show-close="false" :close-on-click-modal="false" :visible.sync="addFriendDialogVisible" width="30%">
      <div slot="title" class="header-title">
        <div class="el-page-header__content" v-if="userInfo == null">查询用户</div>
        <el-page-header @back="goBack" content="添加好友" v-else>
        </el-page-header>
      </div>

      <div class="search" v-if="userInfo == null">
        <el-input placeholder="请输入您要搜索的用户账号" v-model="searchUserName" clearable @keyup.enter.native="searchUser">
          <el-button slot="append" @click="searchUser" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <div class="detail" v-else>
        <el-avatar shape="square" :size="70" :src="userInfo.avatar">
          <img src="../../assets/images/default-avatar.jpg" />
        </el-avatar>
        <div class="content">
          <span>向 {{userInfo.nickName}} 发送好友请求</span>
          <el-input type="text" v-model="requestFriendMessage"></el-input>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addFriendDialogVisible = false">取 消</el-button>
        <el-button v-if="userInfo != null" type="primary" @click="sendFriendRequest">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
  export default {
    name: 'friendList',
    components: {
      FriendDetail: resolve => {
        require(['@/components/friend/friendDetail'], resolve)
      }
    },
    filters: {
      status: function(value) {
        let result = "";

        switch (value) {
          case "0":
            result = "等待验证";
            break;
          case "1":
            result = "已添加";
            break;
          case "2":
            result = "已忽略";
            break;
          default:
            result = "";
            break;
        }
        return result;
      }
    },
    computed: {
      ...$mapGetters(['newFriendUnreadCount', 'newFriendList'])
    },
    data() {
      return {
        friendList: [],
        detailType: "",
        addFriendDialogVisible: false,
        searchUserName: "",
        userInfo: null,
        requestFriendMessage: "",
        isShow: {
          friend: false,
          newFriend: false
        }
      }
    },
    methods: {
      ...$mapActions(['friend_initNewFriendList']),
      listFriend() {
        this.friendList = [];

        let url = $Constant.API_ENV + "/api/friend/listFriend";
        $Common.axios.request(url, "POST", {}, res => {

          if (res.data.code === '0') {
            this.friendList = res.data.data
          }
        }, false, false)
      },
      listFriendRequestRecord() {

        let url = $Constant.API_ENV + "/api/friend/listFriendRequestRecord";
        $Common.axios.request(url, "POST", {}, res => {

          if (res.data.code === '0') {
            this.friend_initNewFriendList(res.data.data);
          }
        }, false, false)
      },
      view(type, obj) {
        switch (type) {
          case "friend":
            this.isShow.friend = this.isShow.friend ? false : true;

            if(this.isShow.friend){
              this.friendList();
            }

            break;
          case "newFriend":
            this.isShow.newFriend = this.isShow.newFriend ? false : true;

            if(this.isShow.newFriend){
              this.listFriendRequestRecord();
            }
            break;
        }

        if (obj) {
          if ($(obj).find("i").hasClass("el-icon-arrow-right")) {
            $(obj).find("i").attr("class", "el-icon-arrow-down")
          } else {
            $(obj).find("i").attr("class", "el-icon-arrow-right")
          }
        }
      },
      detail(userId, obj, detailType, item) {
        $(".el-aside .wrap").removeClass("active");
        $(obj).addClass("active");

        this.detailType = detailType;

        if (this.$refs.friendDetail) {
          this.$refs.friendDetail.getUserInfo(userId);
          if (item) {
            this.$refs.friendDetail.friendRequestInfo = item;
          }

        }
      },
      toChat() {
        this.$emit("change", "chat");
      },
      openAddFriendDialog() {

        //初始化数据
        this.userInfo = null;
        this.searchUserName = "";
        this.addFriendDialogVisible = true;
      },
      searchUser() {

        if (this.searchUserName == window.localStorage.getItem("userName")) {
          this.$message.info("不能添加自己为好友！");
          return;
        }

        let params = {
          userName: this.searchUserName
        }

        //查询用户信息
        let url = $Constant.API_ENV + "/api/user/get";
        $Common.axios.request(url, "GET", params, res => {

          if (res.data.code === '0') {

            if (res.data.data) {
              this.userInfo = res.data.data;
              this.requestFriendMessage = "你好，我是" + window.localStorage.getItem("nickName");
            } else {
              this.$message.info("没有查到此用户！");
            }
          }
        }, false, false)
      },
      goBack() {
        this.userInfo = null;
      },
      sendFriendRequest() {
        if (!this.userInfo) {
          this.$message.info("请先查询用户！");
        }

        let params = {
          targetId: this.userInfo.id,
          message: this.requestFriendMessage
        }

        let url = $Constant.API_ENV + "/api/friend/sendFriendRequest";
        $Common.axios.request(url, "POST", params, res => {

          if (res.data.code === '0') {
            this.$message.success(res.data.message);
            this.addFriendDialogVisible = false;
            this.userInfo = null;
            this.searchUserName = "";
          }
        }, false, false)

      }
    },
    mounted() {

      //默认展开好友列表
      this.isShow.friend = true;
      $(".friend > .item-button i").attr("class", "el-icon-arrow-down");

      this.listFriend();
      this.listFriendRequestRecord();
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

  .el-aside .list .friendList {
    display: -webkit-box;
    padding: 0 10px;
    height: 70px;
    padding-top: 18px;
  }

  .el-aside .list .friendList .left {
    width: 22%;
    text-align: center;
    margin-top: 5px;
  }

  .el-aside .list .friendList .right {
    width: 78%;
    margin-left: 5px;
    margin-top: 5px;
    display: flex;
    align-items: center;
  }

  .el-aside .list .friendList .right .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .el-aside .list .friendList .right .bottom {
    display: -webkit-box;
    margin-top: 10px;
  }

  .el-aside .wrap:hover {
    background-color: #efefef;
    cursor: default;
  }

  .active {
    background-color: #efefef;
    cursor: default;
  }

  .new-friend {
    margin-top: 20px;
  }

  .item-button {
    cursor: pointer;
    display: inline-block;
    padding-left: 15px;
    margin-top: 20px;
  }

  .item-button i {
    color: #b7b1b1;
  }

  .item .list .wrap {
    padding-left: 15px;
  }

  .new-friend .list .wrap .newFriendList {
    display: -webkit-box;
    padding-top: 18px;
  }

  .new-friend .list .wrap .left {
    width: 22%;
    text-align: center;
    margin-top: 5px;
  }

  .new-friend .list .wrap .right {
    width: 75%;
    margin-top: 5px;
  }

  .new-friend .list .wrap .right .name {
    display: inline-block;
    font-size: 14px;
    margin-top: -2px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 50%;
  }

  .new-friend .list .wrap .right .status {
    display: inline-block;
    color: #b0b0b1;
    float: right;
    font-size: 13px;
    margin-right: 10px;
    margin-top: -3px;
  }

  .new-friend .list .wrap .bottom {
    font-size: 13px;
    color: #b0b0b1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 90%;
  }

  .add-friend {
    display: inline-block;
    position: absolute;
    margin-left: 50px;
    margin-top: -4px;
  }

  .detail {
    display: flex
  }

  .detail .content {
    width: 70%;
    margin-left: 20px;
  }

  .detail .content span {
    margin-bottom: 10px;
    display: inline-block;
  }
</style>
