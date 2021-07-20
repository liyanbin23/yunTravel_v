<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="userPhone">
      <el-input placeholder="用户名手机" v-model="form.userPhone"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="mesgCode">
      <el-input placeholder="验证码" v-model="form.mesgCode">
        <template slot="append">
          <el-button @click="getMsgCode">获取验证码</el-button>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="nickName">
      <el-input placeholder="你的名字" v-model="form.nickName"></el-input>
    </el-form-item>

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
      >注册</el-button
    >
  </el-form>
</template>

<script>
import md5 from 'js-md5';
import { mapMutations } from "vuex";
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
      reCode: "",
      form: {
        //   手机号码
        userPhone: "",
        //   昵称
        nickName: "",
        //   手机验证码
        mesgCode: "",
        //   密码
        password: "",
        // 确认密码
        comfirmpassword: "",
      },
      //   校验规则
      rules: {
        userPhone: [
          {
            //   required 必填的意思
            required: true,
            message: "手机号码不能为空",
            // trigger 校验的方式，blur 为失去焦点的时候验证
            trigger: "blur",
          },
        ],
        nickName: [
          {
            //   required 必填的意思
            min: 2,
            max: 6,
            required: true,
            message: "昵称不能为空",
            // trigger 校验的方式，blur 为失去焦点的时候验证
            trigger: "blur",
          },
        ],
        mesgCode: [
            {
                //   required 必填的意思
                required: true,
                message: '验证码不能为空',
                // trigger 校验的方式，blur 为失去焦点的时候验证
                trigger: 'blur'
            }
        ],
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
  methods: {
     ...mapMutations({
      setClient: "SET_CLIENT",
      setClientToken: "SET_CLIENT_TOKEN",
    }),
    //   发送验证码
    handleSendCaptcha() {
      // 手机号码为空的时候，return
      if (this.form.userPhoone === "") return;
      this.$store
        .dispatch("user/captchas", this.form.userPhoone)
        .then((res) => {
          this.$message.success("发送成功，验证码为：" + res.data.code);
        });
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
          phone: that.form.userPhone,
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
    //   提交注册,实现注册完之后自动登录
    handleRegSubmit() {
      if(md5(this.form.mesgCode).toLowerCase()===this.reCode.toLowerCase()){
        let pas=md5(this.form.password);
      this.$refs.form.validate((valid) => {
        console.log("sdasdasdas");
        if (valid) {
          this.$axios({
            url: "/user/register",
            method: "post",
            data: {
              userPhone: this.form.userPhone,
              nickName:this.form.nickName,
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
                this.$message({
                  message: res.data.message,
                  type: "success",
                });
                this.setClient(res.data.data);
                this.setClientToken(res.data.data.userPhone);
                this.$router.push('/')
              } else {
                this.$message({
                  message: res.data.message,
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
        }
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
