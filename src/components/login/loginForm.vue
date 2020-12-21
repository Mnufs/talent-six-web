<template>
  <el-form class="form" :model="user" status-icon :rules="rules" ref="userForm" label-width="120px">
    <el-form-item prop="userName" label="用户名">
      <el-input v-model="user.userName" placeholder="请输入用户名" style="width: 80%;" autocomplete="off" clearable></el-input>
    </el-form-item>
    <el-form-item prop="password" label="密码">
      <el-input v-model="user.password" placeholder="请输入密码" style="width: 80%;" autocomplete="off" show-password clearable></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit()" round style="width: 70%;">登录</el-button>
      <div class="register-btn">
        <a @click="register">没有帐号？那还墨迹什么呢？点我！</a>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'loginForm',
    props: {
      isLogin: Boolean,
    },
    data() {
      var validateName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('用户名不能为空！'));
        }
        callback();
      };
      var validatePass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('密码不能为空！'));
        }
        callback();
      };
      return {
        user: {
          userName: "",
          password: ""
        },
        rules: {
          userName: [{
            validator: validateName
          }],
          password: [{
            validator: validatePass
          }]
        }
      }
    },
    methods: {
      submit() {
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            let url = $Constant.API_ENV + "/api/user/login";
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
      register() {
        this.$refs['userForm'].resetFields();
        this.$emit('update:isLogin', false)
      }
    }
  }
</script>

<style scoped>
  .form {
    position: absolute;
    width: 450px;
    margin-top: 50px;
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
