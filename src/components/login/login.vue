<template>
  <div class="container">
    <div class="wrap">
      <div class="left">
        <transition name="fade" mode="out-in">
          <div class="bg"></div>
        </transition>
      </div>
      <div class="right">
        <span class="title">TALENT SIX</span>
        <transition-group name="fade" model="out-in">
          <LoginForm ref="loginForm" key="login" :isLogin.sync="isLogin" v-if="isLogin"></LoginForm>
          <RegisterForm ref="registerForm" key="register" :isLogin.sync="isLogin" v-else></RegisterForm>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    components: {
      LoginForm: resolve => {
        require(['@/components/login/loginForm'], resolve)
      },
      RegisterForm: resolve => {
        require(['@/components/login/registerForm'], resolve)
      }
    },
    data() {
      return {
        isLogin: true
      }
    },
    methods: {},
    mounted() {
      //回车键执行登陆、注册方法
      $(document).unbind();
      $(document).bind('keyup', e => {
        if (e.keyCode == 13) {
          if (this.isLogin) {
            this.$refs.loginForm.submit();
          } else {
            this.$refs.registerForm.submit();
          }
        }
      });
    }
  }
</script>

<style scoped>
  .container {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e6e6e6;
  }

  .wrap {
    width: 1017px;
    height: 620px;
    align-self: center;
    display: -webkit-box;
    box-shadow: 0 0 8px rgba(0, 0, 0, .1);
    border-radius: 15px;
  }

  .left {
    width: 56%;
    height: 100%;
  }

  .left .bg {
    width: 100%;
    height: 100%;
    background-image: url(../../assets/images/sf.png);
    background-size: contain;
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
  }

  .right {
    width: 44%;
    height: 100%;
    background-color: white;
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
  }

  .right .title {
    display: block;
    width: 100%;
    height: 60px;
    text-align: center;
    margin-top: 80px;
    font-size: 30px;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
    transform: translateX(60px)
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.6s ease
  }
</style>
