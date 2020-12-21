const obj = {
  state: {
    newFriendUnreadCount: 0,
    newFriendList: []
  },
  getters: {
    newFriendUnreadCount(state) {
      return state.newFriendUnreadCount;
    },
    newFriendList(state) {
      return state.newFriendList;
    }
  },
  mutations: {
    addNewFriendUnreadCount(state) {
      state.newFriendUnreadCount += 1;
    },
    subtractNewFriendUnreadCount(state) {
      
      if(state.newFriendUnreadCount != 0){
        state.newFriendUnreadCount -= 1;
      }
    },
    initNewFriendUnreadCount(state, params) {
      state.newFriendUnreadCount = params;
    },
    updateNewFriendList(state, params) {
      state.newFriendList.unshift(params);
    },
    initNewFriendList(state, params) {
      state.newFriendList = params;
    }
  },
  actions: {
    async friend_addNewFriendUnreadCount({
      commit
    }) {
      commit('addNewFriendUnreadCount')
    },
    async friend_subtractNewFriendUnreadCount({
      commit
    }) {
      commit('subtractNewFriendUnreadCount')
    },
    async friend_initNewFriendUnreadCount({
      commit
    }, params) {
      commit('initNewFriendUnreadCount', params)
    },
    async friend_updateNewFriendList({
      commit
    }, params) {
      commit('updateNewFriendList', params)
    },
    async friend_initNewFriendList({
      commit
    }, params) {
      commit('initNewFriendList', params)
    }
  }
}

export default obj
