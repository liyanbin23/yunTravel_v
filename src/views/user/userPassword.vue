<template>
  <div class="container">
    <div class="cont">
      <el-page-header @back="goBack" content="个人中心"> </el-page-header>
      <el-divider content-position="left">修改密码</el-divider>
      <p> 请使用手机接收短信以更改密码</p>
      <!-- tab栏 -->
      <el-row type="flex" justify="center" align="middle" class="main">
        <div class="form-wrapper">
          <el-input placeholder="用户手机" v-model="userPhone"></el-input>
          <p></p>
          <el-input placeholder="验证码" v-model="mesgCode">
            <template slot="append">
              <el-button @click="getMsgCode">获取验证码</el-button>
            </template>
          </el-input>
          <p></p>
          <el-button @click="openPasDialog" type="primary">下一步</el-button>

          <el-dialog
            title="密码修改"
            :center="true"
            :visible.sync="pasDialog"
            width="20%"
          >
            <el-form :model="form" ref="form" :rules="rules" class="form">
              <el-form-item class="form-item" prop="password">
                <el-input
                  placeholder="密码"
                  type="password"
                  v-model="form.password"
                ></el-input>
              </el-form-item>

              <el-form-item class="form-item" prop="comfirmpassword">
                <el-input
                  placeholder="确认密码"
                  type="password"
                  v-model="form.comfirmpassword"
                ></el-input>
              </el-form-item>

              <el-button class="submit" type="primary" @click="handleRegSubmit"
                >提交</el-button
              >
            </el-form>
          </el-dialog>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import md5 from 'js-md5';
export default {
  data() {
    var validapassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      users: {},
      pasDialog: false,
      form: {
        password: "",
        comfirmpassword: "",
      },
      userPhone: "",
      mesgCode: "",
      reCode: "",
      rules: {
        password: [
          {
            //   required 必填的意思
            required: true,
            message: "密码不能为空",
            // trigger 校验的方式，blur 为失去焦点的时候验证
            trigger: "blur",
          },
        ],
        comfirmpassword: [
          {
            // 自定义校验
            validator: validapassword,
            // trigger 校验的方式，blur 为失去焦点的时候验证
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    if (this.$store.state.user) {
      this.users = this.$store.state.user;
    } else {
      this.router.push("/login");
    }
  },
  methods: {
    ...mapMutations({
      setClient: "SET_CLIENT",
      setClientToken: "SET_CLIENT_TOKEN",
    }),
    goBack() {
      this.$router.go(-1);
    },
    openPasDialog() {
      if (md5(this.mesgCode).toLowerCase() === this.reCode.toLowerCase()) {
        this.pasDialog = true;
      } else {
        this.$message({
          message: "验证码不正确",
          type: "error",
        });
      }
    },
    getMsgCode() {
      this.mesgCode = "";
      this.loading = true;
      let that = this;
      let cruser = this.users;
      this.$axios({
        url: "/user/getMsgCode",
        method: "get",
        params: {
          phone: that.userPhone,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            that.reCode = res.data.data;
            this.$message({
              message: "验证码发送成功",
              type: "success",
            });
          } else {
            this.$message({
              message: "验证码获取失败",
              type: "error",
            });       
          }
        })
        .catch((err) => {
          this.$message({
            message: "资源获取失败!请检查",
            type: "error",
          });          
        });
    },
    handleRegSubmit() {
      if(md5(this.mesgCode).toLowerCase()===this.reCode.toLowerCase()){
       let that = this;
      let pas= md5(this.form.password);
      this.$axios({
        url: "/user/updateUserPass",
        method: "put",
        params:{
         phone:that.userPhone,
         pass:pas,
       },
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            // that.users.usImage=that.editUser.usImage;
            this.setClient(res.data.data);
            this.setClientToken(res.data.data.userPhone);
           this.$message({
              message: "密码重置成功",
              type: "success",
            });
            this.goBack();
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
            that.loading = false;
          }
        })
        .catch((err) => {
          this.$message({
            message: "资源获取失败!请检查",
            type: "error",
          });
          that.loading = false;
        });
      }else{
        this.$message({
              message: "验证码错误！",
              type: "error",
            });
      }
    },
  },
};
</script>

<style scoped lang='less'>
.container {
  margin: 10vh auto;
  position: relative;
  padding: 0 auto;
  height: 400px;
}

.main {
  position: absolute;
  width: 1000px;
  height: 100%;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  .form-wrapper {
    width: 400px;
    margin: 0 auto;
    background: #fff;
    box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
}
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
}
.submit {
  width: 100%;
  margin-top: 10px;
}
.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}
.cont {
  margin: 10px auto;
  width: 80%;
  height: auto;
}
</style>
