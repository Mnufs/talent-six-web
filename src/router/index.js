import Vue from 'vue'
import Router from 'vue-router'
import {
  Message
} from 'element-ui'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [{
      path: '/',
      redirect: '/index'
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/components/login/login'], resolve)
    },
    {
      path: '/index',
      name: 'index',
      component: resolve => require(['@/components/index/index'], resolve),
      meta: {
        requireAuth: true
      }
    }
  ]
})


router.beforeEach((to, from, next) => {

  //不存在的路由直接跳转到登陆页面
  if (to.name == null || to.name == undefined) {
    next("/login");
    return;
  }

  //需要鉴权的页面校验token及跳转到页面时进行特殊校验以保证隐私
  if (to.meta.requireAuth) {
    //校验token信息，时间
    let token = window.localStorage.getItem('token');
    let userId = window.localStorage.getItem("userId");
    //说明超时或token、userId不存在
    if (token == null || userId == null) {
      //清空token信息
      $Common.clearLocalStorage();
      //跳转到登陆
      next("/login");
    } else {

      //校验是否登陆过
      let url = $Constant.API_ENV + '/api/user/isLogined';
      $Common.axios.request(url, 'post', null, res => {
        if (res.data.code != "0") {
          //清空token信息
          $Common.clearLocalStorage();
          //跳转到登陆
          next("/login");
        } else {
          next();
        }
      }, false, true, err => {
        Message.error(err.message);
        //跳转到登陆
        next("/login");
      });
    }
  } else {
    next();
  }
})

export default router;
