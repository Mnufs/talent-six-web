<template>
  <el-form class="form" :model="user" :inline-message="true" status-icon :rules="rules" ref="userForm" label-width="120px">
    <el-form-item prop="userName" label="用户名">
      <el-input v-model="user.userName" placeholder="请输入用户名" style="width: 80%;" autocomplete="off" clearable></el-input>
    </el-form-item>
    <el-form-item prop="nickName" label="昵称">
      <el-input v-model="user.nickName" placeholder="请输入昵称" style="width: 80%;" autocomplete="off" clearable></el-input>
    </el-form-item>
    <el-form-item prop="password" label="密码">
      <el-input v-model="user.password" placeholder="请输入密码" style="width: 80%;" autocomplete="off" show-password
        clearable></el-input>
    </el-form-item>
    <el-form-item prop="passwordConfirm" label="确认密码">
      <el-input v-model="user.passwordConfirm" placeholder="请再次输入密码" style="width: 80%;" autocomplete="off"
        show-password clearable></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit" round style="width: 70%;">注册</el-button>
      <div class="register-btn">
        <a @click="login">有帐号？那还注册个锤子！点我！</a>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'registerForm',
    props: {
      isLogin: Boolean,
    },
    data() {
      var validateUserName = async (rule, value, callback) => {
        let reg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/;

        if (!value) {
          callback(new Error('用户名不能为空！'));
          return;
        }
        if (!reg.test(value)) {
          callback(new Error('必须是以字母开头的6-20个字母、数字、下划线和减号，且不支持中文！'));
          return;
        }
        //校验用户名是否重复
        let result = await this.isExistByUserName();
        if (result) {
          callback(new Error(result));
          return;
        }

        callback();
      };

      var validateNickName = (rule, value, callback) => {
        let reg = /^[\w\u4e00-\u9fa5]{1,10}$/;

        if (!value) {
          callback(new Error('昵称不能为空！'));
        } else if (!reg.test(value)) {
          callback(new Error('1-10个字符，只能包含数字英文中文下划线,不能包含空格和特殊符号！'));
        } else {
          callback();
        }

      };
      var validatePass = (rule, value, callback) => {
        let reg = /^(\w){8,15}$/;

        if (!value) {
          callback(new Error('密码不能为空！'));
        } else if (!reg.test(value)) {
          callback(new Error('密码长度最少8位，最多15位！'));
        } else {
          callback();
        }
      };
      var validatePassConfirm = (rule, value, callback) => {
        if (!this.user.password || this.user.password != value) {
          callback(new Error('两次密码输入不一致！'));
        } else {
          callback();
        }
      };
      return {
        user: {
          userName: "",
          nickName: "",
          password: "",
          passwordConfirm: ""
        },
        rules: {
          userName: [{
            required: true,
            validator: validateUserName,
            trigger: 'blur'
          }],
          nickName: [{
            required: true,
            validator: validateNickName,
            trigger: 'blur'
          }],
          password: [{
            required: true,
            validator: validatePass,
            trigger: 'blur'
          }],
          passwordConfirm: [{
            required: true,
            validator: validatePassConfirm,
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      submit() {
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            let url = $Constant.API_ENV + "/api/user/register";
            $Common.axios.request(url, "POST", this.user, res => {
              if (res.data.code === '0') {
                $Common.setLocalStorage(res);

                $(document).unbind();
                this.$router.push({
                  name: 'index'
                });
              } else {
                this.$message.error(res.data.message);
              }
            }, true, true)
          }
        });
      },
      async isExistByUserName() {
        let url = $Constant.API_ENV + "/api/user/isExistByUserName";
        let message = null;
        await $Common.axios.asyncRequest(url, "POST", this.user).then(res => {
          if (res.data.code === '1') {
            message = res.data.message;
          }
        })
        return message;
      },
      login() {
        this.$emit('update:isLogin', true)
      }
    }
  }
</script>

<style scoped>
  .form {
    width: 450px;
    position: absolute;
    margin-top: -10px;
  }

  .el-form-item {
    margin-top: 30px;
  }

  .register-btn {
    width: 70%;
    margin-top: 10px;
    text-align: center;
  }

  .register-btn a {
    color: #1283ba;
    font-size: 10px;
  }

  .register-btn a:hover {
    color: #00b2f3;
  }
</style>

<style>
  .el-form-item__error--inline {
    max-width: 240px !important;
    display: block !important;
    line-height: 20px !important;
    margin-bottom: -20px !important;
  }
</style>
