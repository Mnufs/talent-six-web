const obj = {
  state: {
    chatList: [],
    friendName: "",
    currentChatId: "",
    chatTimer: null,
    messageList: []
  },
  getters: {
    chatList(state) {
      return state.chatList;
    },
    friendName(state) {
      return state.friendName;
    },
    currentChatId(state) {
      return state.currentChatId;
    },
    chatTimer(state) {
      return state.chatTimer;
    },
    messageList(state) {
      return state.messageList;
    }
  },
  mutations: {
    updateFriendName(state, newValue) {
      state.friendName = newValue;
    },
    updateCurrentChatId(state, newValue) {
      state.currentChatId = newValue;
    },
    updateChatList(state, params) {

      let time = $Common.isEmpty(params.time) ? "" : new Date(params.time).format("hh:mm");

      if (state.chatList) {

        a: for (var i = 0; i < state.chatList.length; i++) {

          //找到旧聊天列表删除
          if (state.chatList[i].id == params.sender) {

            //如果是第一个则直接替换内容和时间即可
            if (i == 0) {
              state.chatList[i].message = params.message;
              state.chatList[i].time = time;
              return;
            } else {
              //删除
              state.chatList.splice(i, 1);
            }
            return a;
          }
        }

        //从好友列表跳转到消息列表，打开聊天窗口，定位聊天人
        if (params.type == 'toChat') {
          state.friendName = params.senderNickName;
          state.currentChatId = params.sender;
          state.chatTimer = new Date().getTime();
        }

        //置顶
        state.chatList.unshift({
          id: params.sender,
          name: params.senderNickName,
          message: params.message,
          time: time,
          isNewMsg: state.currentChatId == params.sender ? false : true //新消息
        });
      }
    },
    updateChatTimer(state) {
      state.chatTimer = new Date().getTime();
    },
    setChatListToLocalStorage(state) {
      window.localStorage.setItem("chatList", JSON.stringify(state.chatList));
    },
    initChatList(state) {
      let chatListStr = window.localStorage.getItem("chatList");

      if (chatListStr) {
        let chatList = JSON.parse(chatListStr);
        state.chatList = chatList;
      }
    },
    updateMessageList(state, params) {
      if (params && params.length != 0) {
        state.messageList.push(params);
      } else {
        state.messageList = [];
      }
    }
  },
  actions: {
    async chat_updateFriendName({
      commit
    }, newValue) {
      commit('updateFriendName', newValue)
    },
    async chat_updateCurrentChatId({
      commit
    }, newValue) {
      commit('updateCurrentChatId', newValue)
    },
    async chat_updateChatList({
      commit
    }, params) {
      commit('updateChatList', params)

      //保存聊天列表到localStorage
      commit('setChatListToLocalStorage');
    },
    async chat_updateChatTimer({
      commit
    }) {
      commit('updateChatTimer')
    },
    async chat_initChatList({
      commit
    }) {
      commit('initChatList')
    },
    async chat_updateMessageList({
      commit
    }, params) {
      commit('updateMessageList', params)
    }
  }
}

export default obj
