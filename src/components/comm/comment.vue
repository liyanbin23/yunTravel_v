<template>
  <div class="container">
    <comment
      v-if="$store.state.user"
      :avatar="$axios.baseURL + $store.state.user.usImage"
      placeholder="输入评论内容"
      :authorId="$store.state.user.userId"
      :aria-label="$store.state.user.nickName"
      :commentList="commentList"
      @doSend="doSend"
      @doChidSend="doChidSend"
    />
    <comment
      v-else
      placeholder="输入评论内容"
      :commentList="commentList"
      @doSend="doSend"
      @doChidSend="doChidSend"
    />

    <div>
      <el-dialog
        title="用户登录"
        :visible.sync="loginDialogVisable"
        width="25%"
        :center="true"
      >
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="1px"
          class="demo-ruleForm"
        >
          <el-form-item  prop="phoneNum">
            <el-input v-model="ruleForm.phoneNum" placeholder="手机号" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item  prop="password">
            <el-input
              type="password"
              placeholder="密码"
              v-model="ruleForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >登录</el-button
            >
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import comment from "bright-comment";
import { mapMutations } from "vuex";

export default {
  props: {
    strategyId: { type: Number, default: 0 },
  },
  components: {
    comment,
  },

  data() {
    return {
      loginDialogVisable: false,
      commentList: [],
      ruleForm: {
        phoneNum: "",
        password: "",
      },
      rules: {
        phoneNum: [{ required: true, message: "请输入号码", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.getCommentList();
  },
  methods: {
    ...mapMutations({
      setClient: "SET_CLIENT",
      setClientToken: "SET_CLIENT_TOKEN",
    }),

    doSend(content) {
      let currentUserId = "";
      if (this.$store.state.user) {
        currentUserId = this.$store.state.user.userId;
        this.$axios({
          url: "/comment/addStrategyComm",
          method: "put",
          data: {
            strategyId: this.strategyId,
            userId: currentUserId,
            content: content,
          },
        })
          .then((res) => {
            console.log(res);
            if (res.data.code === 0) {
              this.getCommentList();
            } else {
              this.$message({
                message: "还没有评论",
                type: "warning",
              });
            }
          })
          .catch((err) => {
            this.$message({
              message: "参数错误",
              type: "error",
            });
          });
      } else {
        this.loginDialogVisable = true;
      }
    },
    doChidSend(content, bid, pid) {
      let currentUserId = "";
      if (this.$store.state.user) {
        currentUserId = this.$store.state.user.userId;
        this.$axios({
          url: "/comment/addChildComm",
          method: "put",
          data: {
            parentId: pid,
            userId: currentUserId,
            content: content,
          },
        })
          .then((res) => {
            console.log(res);
            if (res.data.code === 0) {
              this.getCommentList();
            } else {
              this.$message({
                message: "获取评论失败",
                type: "error",
              });
            }
          })
          .catch((err) => {
            this.$message({
              message: "参数错误",
              type: "error",
            });
          });
      } else {
        this.loginDialogVisable = true;
      }
    },

    getCommentList() {
      console.log(this.content);
      this.$axios({
        url: "/resources/getCommentList",
        method: "get",
        params: {
          strategyId: this.strategyId,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            console.log(res.data.data);
            this.commentList = res.data.data;
          } else {
            this.$message({
              message: "获取评论失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: "参数错误",
            type: "error",
          });
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios({
            url: "/user/login",
            method: "post",
            data: {
              userPhone: this.ruleForm.phoneNum,
              password: this.ruleForm.password,
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
                this.loginDialogVisable = false;
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
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped lang='less'>
.container {
  margin: 0 auto;
  position: relative;
  padding: 0 auto;
}
</style>
