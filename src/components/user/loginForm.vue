<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户手机" v-model="form.userPhone"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input
        placeholder="密码"
        type="password"
        v-model="form.password"
        show-password
      ></el-input>
    </el-form-item>

    <p class="form-text">
      <router-link to="/userPassword">忘记密码</router-link>
    </p>

    <el-button class="submit" type="primary" @click="handleLoginSubmit"
      >登录</el-button
    >
  </el-form>
</template>

<script>
import { mapMutations } from "vuex";
import md5 from 'js-md5';
export default {
  data() {
    return {
      // 表单数据
      form: {
        userPhone: "17787888370", // 登录用户名/手机
        password: "", // 登录密码
      },
      // 表单规则
      rules: {
        userPhone: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 提交登录
    ...mapMutations({
      setClient: "SET_CLIENT",
      setClientToken: "SET_CLIENT_TOKEN",
    }),
    handleLoginSubmit() {
      this.$refs.form.validate((valid) => {
        console.log("sdasdasdas");        
        if (valid) {
          let pas=md5(this.form.password);
          this.$axios({
            url: "/user/login",
            method: "post",
            data: {
              userPhone: this.form.userPhone,
              password: pas,
            },
          })
            .then((res) => {
              // 调用mutations 里面的方法，并修改state里面的属性
              // store.commit('setUserInfo', res.data)
              // 这里因为要先修改state里面的状态，才把结果return回去
              // return res
              console.log(res)
              if (res.data.code === 0) {
                console.log(res.data.data)
                this.setClient(res.data.data);
                this.setClientToken(res.data.data.userPhone);
                this.$message({
                  message: "登录成功",
                  type: "success",
                });
                this.$router.push("/");
              }else{
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
          // 把axios 执行的结果返回
          //         this.$store.dispatch('login', this.form).then(res => {
          //             // console.log(res);
          //             this.$message.success(
          //                 '登录成功，欢迎回来' + res.data.user.nickname
          //             )
          //             this.$router.replace('/')
          //         })
          //     } else {
          //         console.log('error submit!!')
          //         return false
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
}

.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}

.submit {
  width: 100%;
  margin-top: 10px;
}
</style>
