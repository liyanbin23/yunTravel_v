<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">彩云旅游后台管理系统</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="login"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="username">
            <template #prepend>
              <el-button icon="el-icon-user"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="password"
            v-model="param.password"
            @keyup.enter="submitForm()"
          >
            <template #prepend>
              <el-button icon="el-icon-lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
        <p class="login-tips">Tips : 忘记密码联系管理员</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import md5 from 'js-md5';
export default {
  data() {
    return {
      param: {
        username: "17787888370",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  created() {
    this.$store.commit("clearTags");
  },
  methods: {
    // 提交登录
    ...mapMutations({
      setClient: "SET_ADMIN",
      setClientToken: "SET_ADMIN_TOKEN",
    }),
    submitForm() {
      this.$refs.login.validate((valid) => {
        if (valid) {
          let pas = md5(this.param.password);
          this.$axios({
            url: "/admins/login",
            method: "post",
            data: {
              phone: this.param.username,
              password: pas,
            },
          })
            .then((res) => {
              // 调用mutations 里面的方法，并修改state里面的属性
              // store.commit('setUserInfo', res.data)
              // 这里因为要先修改state里面的状态，才把结果return回去
              // return res
              console.log(res);
              if (res.data.code === 0) {
                console.log(res.data.data);
                this.setClient(res.data.data);
                this.setClientToken(res.data.data.userPhone);
                this.$message({
                  message: "登录成功",
                  type: "success",
                });
                this.$router.push("/admin/");
              } else {
                this.$message({
                  message: "登录失败，检查用户名或密码",
                  type: "error",
                });
              }
            })
            .catch((err) => {
              this.$message({
                message: "登录失败",
                type: "error",
              });
            });
        } else {
          this.$message.error("请输入账号和密码");
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;

  /* background-image: url(@/assets/images/login-bg.jpg); */
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: rgb(23, 119, 148);
  border-bottom: 1px solid rgb(26, 111, 126);
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(91, 140, 163, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: rgb(32, 153, 184);
}
</style>