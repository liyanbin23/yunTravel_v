<template>
  <div class="cont">
    <div class="center-cont">
      <el-main>
        <div class="headerVideo">
          <div class="bgCont">
            <img
              :src="
                $axios.baseURL +
                '/static/images/uploadImg/3ec62417-0ce2-43c3-bffc-b34cc4f14586.jpeg'
              "
              width="100%"
              height="120%"
            />
          </div>
          <div class="videoCont">
            <el-avatar
              v-if="users.usImage"
              :size="80"
              :src="$axios.baseURL + users.usImage"
            ></el-avatar>
            <p>{{ users.nickName }}</p>
          </div>
        </div>
        <el-row type="flex" :gutter="20">
          <el-col :span="4">
            <div class="uCard">
              <el-card :body-style="{ padding: '5px' }">
                <div class="user-info">
                  <p>
                    <i class="el-icon-medal" title="用户等级" />等级：{{
                      users.grade
                    }}级
                  </p>
                  <p>
                    <i class="el-icon-monitor" title="网龄" />网龄：{{ age }}天
                  </p>
                  <p>
                    <i class="el-icon-tickets" title="作品" />原创：{{
                      total
                    }}个
                  </p>
                  <p>
                    <i class="el-icon-star-off" title="收藏" />收藏：{{ 7 }}个
                  </p>
                  <p>
                    <i class="el-icon-magic-stick" title="粉丝数" />粉丝：{{
                      3
                    }}个
                  </p>
                  <el-button
                    type="primary"
                    icon="el-icon-setting"
                    round
                    @click="openDrawer"
                    >个人信息</el-button
                  >
                  <!-- <p>
                    <i class="el-icon-message" title="邮箱" />：{{
                      users.email
                    }}
                  </p> -->
                  <!-- <p>
                    <i class="el-icon-phone" title="电话号码" />：{{
                      users.userPhone
                    }}
                  </p> -->
                </div>
              </el-card>
            </div>
            <div class="cortCard">
              <el-card :body-style="{ padding: '5px' }">
                <el-menu class="el-menu-vertical-demo" @select="handleSelect">
                  <el-menu-item index="1">
                    <i class="el-icon-camera-solid"></i>
                    <span slot="title">印象馆</span>
                  </el-menu-item>
                  <el-menu-item index="2">
                    <i class="el-icon-s-order"></i>
                    <span slot="title">攻略墙</span>
                  </el-menu-item>
                  <el-menu-item index="3" v-show="isSalf">
                    <i class="el-icon-folder-opened"></i>
                    <span slot="title">收藏夹</span>
                  </el-menu-item>
                </el-menu>
              </el-card>
            </div>
            <div class="messageCard">
              <el-card :body-style="{ padding: '5px' }">
                <div class="user-info" v-if="isSalf">
                  <el-divider content-position="left"
                    ><i
                      class="el-icon-message-solid"
                      title="消息"
                    />消息</el-divider
                  >
                  <p v-for="(item, index) in messages" :key="index">
                    <i class="el-icon-chat-square" :title="item" />{{ item }}
                  </p>
                </div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="20">
            <el-row type="flex" :gutter="20">
              <div class="center-card">
                <el-card :body-style="{ padding: '0px' }">
                  <p>
                    看，静美的雨花石吐露着千年的玲珑心事，听，十月的秋雨任性地飞扬着小小的纯真梦想，吻着恬淡的花香，仿佛是朵朵花儿的守望，还有你嘴角上上扬的一抹芬芳，叠成一朵淡淡兰花的忧伤。
                  </p>
                </el-card>
              </div>
            </el-row>
            <el-row>
              <!-- 插空 -->
              <el-row v-if="tabIndex === 1">
                <div style="width:100%" v-if="users.safeDetail" v-html="users.safeDetail"></div>
              </el-row>
              <el-row v-if="tabIndex === 2">
                <div class="button" v-if="isSalf">
                  <el-button type="primary" @click="addNewSt"
                    >新增攻略</el-button
                  >
                  <el-button type="warning" @click="isEditing = !isEditing"
                    >管理</el-button
                  >
                </div>
                <el-divider></el-divider>
                <waterfall :col="3" :data="strategyList">
                  <template>
                    <div
                      class="content"
                      v-for="(item, index) in strategyList"
                      :key="index"
                    >
                      <el-button
                        v-show="isEditing"
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        @click="delStrategy(item)"
                      ></el-button>
                      <StrategyView
                        :userNick="item.users.nickName"
                        :userId="item.users.userId"
                        :userPhoto="item.users.usImage"
                        :id="item.strategy.strategyId"
                        :currentDate="item.strategy.createTime"
                        :city="item.city"
                        :travelType="item.travelType"
                        :isLike="item.like"
                        :isCollect="item.collect"
                        :likes="item.likeNum"
                        :title="item.strategy.titles"
                        :collector="item.collectNum"
                        :imgUrl="item.strategy.headImg"
                      />
                    </div>
                  </template>
                </waterfall>
              </el-row>
              <el-row v-if="tabIndex === 3">
                <waterfall :col="4" :data="strategyList">
                  <template>
                    <div
                      class="content"
                      v-for="(item, index) in strategyList"
                      :key="index"
                    >
                      <UserStrategyView
                        v-if="item.collect"
                        :userNick="item.users.nickName"
                        :userId="item.users.userId"
                        :userPhoto="item.users.usImage"
                        :id="item.strategy.strategyId"
                        :currentDate="item.strategy.createTime"
                        :city="item.city"
                        :travelType="item.travelType"
                        :isLike="item.like"
                        :isCollect="item.collect"
                        :likes="item.likeNum"
                        :title="item.strategy.titles"
                        :collector="item.collectNum"
                        :imgUrl="item.strategy.headImg"
                      />
                    </div>
                  </template>
                </waterfall>
              </el-row>
            </el-row>
          </el-col>
        </el-row>
        <el-drawer
          :visible.sync="drawer"
          direction="rtl"
          :with-header="false"
          size="20%"
        >
          <el-avatar
            v-if="users.usImage"
            :size="60"
            :src="$axios.baseURL + users.usImage"
          ></el-avatar>
          <el-button type="text" size="mini" @click="editImg">
            <i class="el-icon-edit">编辑头像</i></el-button
          >
          <el-divider></el-divider>
          <el-row>
            <el-col :span="18">
              <i class="el-icon-user">昵称：{{ users.nickName }}</i></el-col
            >
            <el-col :span="6">
              <el-popover placement="top" width="300" v-model="nickNameDialog">
                <el-input
                  placeholder="键入你的新昵称"
                  v-model="editUser.nickName"
                ></el-input>
                <div style="text-align: center; margin: 10px">
                  <el-button
                    size="mini"
                    type="text"
                    @click="nickNameDialog = false"
                    >取消</el-button
                  >
                  <el-button type="primary" size="mini" @click="submitNickName"
                    >确定</el-button
                  >
                </div>
                <el-button type="text" slot="reference"
                  ><i class="el-icon-edit"></i
                ></el-button>
              </el-popover>
              <!-- <el-button type="text" size="mini"
                ><i class="el-icon-edit"></i></el-button
            > -->
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-row>
            <el-col :span="18"
              ><i class="el-icon-message" title="邮箱" />邮箱：{{
                users.email
              }}</el-col
            >
            <el-col :span="6">
              <el-popover placement="top" width="300" v-model="emailDialog">
                <el-input
                  placeholder="键入你的新邮箱"
                  v-model="editUser.email"
                ></el-input>
                <div style="text-align: center; margin: 10px">
                  <el-button
                    size="mini"
                    type="text"
                    @click="emailDialog = false"
                    >取消</el-button
                  >
                  <el-button type="primary" size="mini" @click="submitEmail"
                    >确定</el-button
                  >
                </div>
                <el-button type="text" slot="reference"
                  ><i class="el-icon-edit"></i
                ></el-button>
              </el-popover>
            </el-col>
          </el-row>

          <el-divider></el-divider>
          <el-row>
            <el-col :span="18">
              <i class="el-icon-phone" title="电话号码"
                >号码：{{ users.userPhone }}</i
              ></el-col
            >
            <el-col :span="6">
              <el-button type="text" @click="openUserPhoneDialog"><i class="el-icon-edit"></i></el-button
            ></el-col>
          </el-row>
          <el-divider></el-divider>
          <el-row>
            <el-col :span="11">
              <el-button type="text">
                <i class="el-icon-key" @click="openPasDialog" title="密码修改">密码修改</i></el-button
              >
            </el-col>
            <el-col :span="2">
              <el-divider direction="vertical"></el-divider
            ></el-col>

            <el-col :span="11">
              <el-button type="text"
                ><i class="el-icon-postcard" @click="openUserDetailDilog" title="个人名片"
                  >简介管理</i
                ></el-button
              >
            </el-col>
          </el-row>
          <el-divider></el-divider>
        </el-drawer>
        <el-dialog
          title="头像"
          :center="true"
          :visible.sync="usImageDialog"
          width="20%"
        >
          <el-upload
            class="avatar-uploader"
            :action="$axios.baseURL + baseUpUrl"
            name="files"
            :show-file-list="false"
            :on-success="handleSuccess"
          >
            <i
              v-if="dialogImageUrl"
              class="el-icon-plus avatar-uploader-icon"
            ></i>
            <img
              v-else
              :src="$axios.baseURL + editUser.usImage"
              class="avatar"
            />
          </el-upload>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closUsimgDialog">取 消</el-button>
            <el-button type="primary" @click="submitUsImg">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="号码"
          :center="true"
          :visible.sync="usPhoneDialog"
          width="20%"
        >
          <el-input
            placeholder="用户手机"
            v-model="editUser.userPhone"
          ></el-input>
          <p></p>
          <el-input placeholder="验证码" v-model="mesgCode">
            <template slot="append">
              <el-button @click="getMsgCode">获取验证码</el-button>
            </template>
          </el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="usPhoneDialog=false">取 消</el-button>
            <el-button type="primary" @click="submitUsPhone">确 定</el-button>
          </span>
        </el-dialog>
      </el-main>
    </div>
  </div>
</template>
<script>
import StrategyView from "@/components/comm/strategyView.vue";
import UserStrategyView from "@/components/user/userStrategyView.vue";
import { mapMutations } from "vuex";
import md5 from 'js-md5';
export default {
  components: {
    StrategyView,
    UserStrategyView,
  },
  data() {
    return {     
      users: {},
      age: 0,
      tabIndex: 1,
      isSalf: true,
      messages: [1, 2, 1, 3, 1, 4],
      strategyList: [],
      option: [{}],
      context: "",
      isEditing: false,
      drawer: false,
      total: 0,
      //编辑用户
      usImageDialog: false,
      //图片上传路径
      baseUpUrl: "/filesController/upFiles",
      imgDialogVisible: false,
      dialogImageUrl: true,
      nickNameDialog: false,
      emailDilog: false,
      emailDialog: false,
      usPhoneDialog:false,
      userDetailDilog:false,
      editUser: {
        usImage: "",
        nickName: "",
        email: "",
        userPhone: "",
      },
      mesgCode:'',
      reCode:'',
    };
  },
  mounted() {
    if (!this.$route.query.uId && this.$store.state.user) {
      this.getUsers(this.$store.state.user.userId);
      this.getStrategyResource(this.$store.state.user.userId);
    } else if (
      this.$route.query.uId &&
      this.$store.state.user.userId === this.$route.query.uId
    ) {
      this.getUsers(this.$route.query.uId);
      this.getStrategyResource(this.$route.query.uId);
    } else if (
      this.$route.query.uId &&
      this.$store.state.user.userId != this.$route.query.uId
    ) {
      this.isSalf = false;
      this.getUsers(this.$route.query.uId);
      this.getStrategyResource(this.$route.query.uId);
    } else {
      this.$message({
        message: "参数错误!请检查",
        type: "error",
      });
    }
    // this.getResource();
  },
  computed: {
    itemWidth() {
      return 138 * 0.5 * (document.documentElement.clientWidth / 375);
      // #rem布局 计算宽度
    },
    gutterWidth() {
      return 9 * 0.5 * (document.documentElement.clientWidth / 375);
      // #rem布局 计算x轴方向margin(y轴方向的margin自定义在css中即可)
    },
  },
  // 下边的内容没有用到，需要的小伙伴可以看文档了解，如果需求后续回更新
  methods: {
    ...mapMutations({
      setClient: "SET_CLIENT",
      setClientToken: "SET_CLIENT_TOKEN",
    }),
    getDaysAndHours(blockingTime) {
      let dateNow = new Date(); // 获取当前时间
      let timeDiff = dateNow.getTime() - blockingTime; // 时间差的毫秒数
      // timeDiff = 时间戳差值
      let days = Math.floor(timeDiff / (24 * 3600 * 1000)); // 计算出天数
      return days;
    },    
    handleSelect(index) {
      console.log(index);
      this.tabIndex = parseInt(index);
      console.log(this.tabIndex);
      //   this.$router.push({
      //     //核心语句
      //     path: index, //跳转的路径
      //     query: {
      //       //路由传参时push和query搭配使用 ，作用时传递参数
      //       uId: this.users.userId,
      //       isSalf: this.isSalf,
      //     },
      //   });
    },
    getUsers(id) {
      this.loading = true;
      let that = this;
      this.$axios({
        url: "/user/qryById",
        method: "get",
        params: {
          uId: id,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            console.log(res.data.data);
            that.users = res.data.data;
            that.age = that.getDaysAndHours(res.data.data.registDate);
            that.loading = false;
          } else {
            this.$message({
              message: "资源获取失败!请检查",
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
    },
    getStrategyResource(id) {
      this.loading = true;
      this.$axios({
        url: "/resources/getStrategyListByUserId",
        method: "get",
        params: {
          uId: id,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            console.log(res.data.data);
            this.strategyList = res.data.data;
            this.total = res.data.data.length;
            this.loading = false;
          } else {
            this.$message({
              message: "您还没有发布资源",
              type: "wraning",
            });
            this.loading = false;
          }
        })
        .catch((err) => {
          this.$message({
            message: "资源获取失败!请检查",
            type: "error",
          });
          this.loading = false;
        });
    },
    addNewSt() {
      this.$router.push({
        path: "/article",
        query: { userId: this.users.userId },
      });
    },
    delStrategy(item) {
      console.log(item);
    },
    editStrategy() {},
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    openDrawer() {
      this.drawer = true;
    },
    getMsgCode(){
      this.mesgCode='';
      this.loading = true;
      let that = this;
      let cruser = this.users;
      cruser.email = this.editUser.email;
      this.$axios({
        url: "/user/getMsgCode",
        method: "get",
        params:{
          phone:that.editUser.userPhone,
        }
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            that.reCode=res.data.data;
            this.$message({
              message: "验证码发送成功",
              type: "success",
            });
          } else {
            this.$message({
              message: "验证码获取失败",
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
    },
    handleSuccess(res, file) {
      this.dialogImageUrl = false;
      this.editUser.usImage = res.data[0];
    },
    //图片放大
    handlePictureCardPreview(file) {
      this.imgDialogVisible = true;
    },
    //图片移除
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    //头像编辑
    editImg() {
      this.usImageDialog = true;
    },
    closUsimgDialog() {
      this.usImageDialog = false;
      this.editUser.usImage = "";
    },
    submitUsImg() {
      this.loading = true;
      let that = this;
      let cruser = this.users;
      cruser.usImage = this.editUser.usImage;
      this.$axios({
        url: "/user/updateUser",
        method: "put",
        data: cruser,
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            // that.users.usImage=that.editUser.usImage;
            this.setClient(res.data.data);
            this.setClientToken(res.data.data.userPhone);
            that.usImageDialog = false;
            that.loading = false;
          } else {
            this.$message({
              message: "资源获取失败!请检查",
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
    },
    //编辑昵称
    submitNickName() {
      this.loading = true;
      let that = this;
      let cruser = this.users;
      cruser.nickName = this.editUser.nickName;
      this.$axios({
        url: "/user/updateUser",
        method: "put",
        data: cruser,
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            // that.users.usImage=that.editUser.usImage;
            this.setClient(res.data.data);
            this.setClientToken(res.data.data.userPhone);
            that.nickNameDialog = false;
            that.loading = false;
          } else {
            this.$message({
              message: "资源获取失败!请检查",
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
    },
    //编辑邮箱
    submitEmail() {
      this.loading = true;
      let that = this;
      let cruser = this.users;
      cruser.email = this.editUser.email;
      this.$axios({
        url: "/user/updateUser",
        method: "put",
        data: cruser,
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            // that.users.usImage=that.editUser.usImage;
            this.setClient(res.data.data);
            this.setClientToken(res.data.data.userPhone);
            that.emailDialog = false;
            that.loading = false;
          } else {
            this.$message({
              message: "资源获取失败!请检查",
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
    },
    //编辑号码
    openUserPhoneDialog(){
      this.usPhoneDialog=true;
    },
    submitUsPhone(){
      this.loading = true;
      console.log(this.reCode);
      console.log(md5(this.mesgCode));
      if(md5(this.mesgCode).toLowerCase()===this.reCode.toLowerCase()){
       let that = this;
      let cruser = this.users;
      cruser.userPhone = this.editUser.userPhone;
      this.$axios({
        url: "/user/updateUserWithMsg",
        method: "put",
        data:{
         users:that.users,
         code:that.mesgCode,
       },
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            // that.users.usImage=that.editUser.usImage;
            this.setClient(res.data.data);
            this.setClientToken(res.data.data.userPhone);
            that.emailDialog = false;
            that.loading = false;
          } else {
            this.$message({
              message: "资源获取失败!请检查",
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

    //编辑个人简介
    openUserDetailDilog(){
      this.$router.push({path:'/userDetail'})
    },
    submitUsDetail(){
      console.log(this.editor.text.html())
    },
    //编辑密码
    openPasDialog(){
      this.$router.push({path:'/userPassword'});
    },


  },
};
</script>
<style lang="scss" scoped>
.cont {
  width: 100%;
  height: auto;
  background: #fff;
}
.center-cont {
  width: 100%;
  height: auto;
  margin: 0px auto;
  background: #fff;
}
.content {
  margin-left: 1vw;
  margin-top: 2vh;
}
.uCard {
  width: 90%;
  margin-left: 1vw;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 250px;
  height: auto;
  display: block;
}
.button {
  width: 100%;
  height: 2vw;
}
.cortCard {
  width: 90%;
  margin-left: 1vw;
  margin-top: 1vw;
}
.messageCard {
  width: 90%;
  margin-left: 1vw;
  margin-top: 1vw;
}
.user-info {
  width: 100%;
  height: auto;
}
.user-info p {
  margin-left: 30px;
  text-align: left;
}
.centerTitle {
  width: 100%;
  height: 51px;
  margin: 30px auto;
  overflow: hidden;
  text-align: center;
  position: relative;
}
.centerTitleBox {
  width: auto;
  height: 51px;
  margin: 0 auto;
  position: absolute;
  top: 0;
  left: 50%;
}
.center-card {
  width: 98%;
  height: 80px;
}
.center-card p {
  text-align: left;
  margin-left: 3vw;
  margin-right: 3vw;
}
.bgCont {
  width: 100%;
  height: 300px;
  position: absolute;
  z-index: 0;
  background-size: cover;
  background-repeat: no-repeat;
  filter: blur(6px);
}
.headerVideo {
  width: 100%;
  height: 300px;
  position: relative;
  margin: 0px auto 10px auto;
}
.videoCont {
  margin-left: 200px;
  margin-top: 150px;
  z-index: 4;
  position: absolute;
}
.centerTitleLeft {
  width: 43px;
  height: 51px;
  display: block;
  float: left;
  background: url(http://www.shilin.com.cn/public/protal/images/title-left.png)
    no-repeat center;
  background-size: contain;
}
.centerTitleMiddle {
  width: auto;
  line-height: 51px;
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  color: #19b1b6;
  font-family: "宋体";
  height: 51px;
  display: block;
  float: left;
  background: url(http://www.shilin.com.cn/public/protal/images/title-middle.png)
    no-repeat;
  background-size: cover;
  box-sizing: border-box;
}
.centerTitleRight {
  width: 43px;
  height: 51px;
  display: block;
  float: left;
  background: url(http://www.shilin.com.cn/public/protal/images/title-right.png)
    no-repeat center;
  background-size: contain;
}
</style>
