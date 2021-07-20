<template>
  <div id="content">
    <el-card :body-style="{ padding: '0px' }" v-if="thisIsCollect">
      <img :src="$axios.baseURL + imgUrl" class="image" />
      <el-divider content-position="left"
        ><el-avatar :src="$axios.baseURL + userPhoto"></el-avatar
        >{{ userNick }}</el-divider
      >

      <div style="padding: 14px">
        <router-link
          :to="{ path: '/strategyContent', query: { strategyId: id } }"
        >
          <span
            style="
              margin: 2px 2px auto auto;
              font-size: 14px;
              color: rgb(24, 207, 146);
            "
            >{{ title }}</span
          >
        </router-link>
        <div
          style="
            width: 80%;
            height: 30px;
            border-top: 1px solid #e6e6e6;
            margin-left: 10px;
            margin-top: 5px;
          "
        >
          <p style="font-size: 13px">
            <span>城市：{{ city }}</span
            ><span style="margin-left: 20px">类型：{{ travelType }}</span>
          </p>
        </div>

        <div class="bottom clearfix">
          <time class="time">{{ currentDate | dateFmt("YYYY-MM-DD") }}</time>
          <span
            v-if="!thisIsLike"
            class="icon iconfont icon-dianzan point"
            title="点赞"
            @click="addMyLike"
            ><span>{{ thisLikeNum }}</span></span
          >
          <span
            v-else
            class="icon iconfont icon-dianzan point"
            title="取消点赞"
            @click="addMyLike"
            style="color: orangered"
            ><span>{{ thisLikeNum }}</span></span
          >
          <span
            v-if="!thisIsCollect"
            class="icon iconfont icon-shoucang1 point"
            title="收藏"
            @click="addMyCollect"
            ><span>{{ thisCollectNum }}</span></span
          >

          <span
            v-else
            class="icon iconfont icon-shoucang1 point"
            title="取消收藏"
            @click="addMyCollect"
            style="color: orangered"
            ><span>{{ thisCollectNum }}</span></span
          >
          <!-- <el-button type="text" class="button">操作按钮</el-button> -->
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  props: {
    userNick: {
      type: String,
      default: "酸奶盖盖",
    },
    userId: {
      type: Number,
      default: 0,
    },
    userPhoto: {
      type: String,
      default: "/static/images/userPhoto/test.png",
    },
    // 图片路径
    imgUrl: {
      type: String,
      default: "",
    },
    id: {
      type: Number,
      default: 0,
    },
    //标题
    title: {
      type: String,
      default: "",
    },
    // 主要城市
    city: {
      type: String,
      default: "",
    },
    // 旅游类型
    travelType: {
      type: String,
      default: "",
    },
    //是否已点赞
    isLike: {
      type: Boolean,
      default: false,
    },
    //是否已点赞
    isCollect: {
      type: Boolean,
      default: false,
    },
    // 点赞量
    likes: {
      type: Number,
      default: 0,
    },
    // 收藏量
    collector: {
      type: Number,
      default: 0,
    },
    currentDate: {
      type: Number,
      default: 1620373408380,
    },
  },
  data() {
    return {
      //是否点赞和收藏
      thisIsLike: this.isLike,
      thisIsCollect: this.isCollect,
      //点赞量收餐量
      thisLikeNum: this.likes,
      thisCollectNum: this.collector,
    };
  },
  methods: {
    addMyLike() {
      let that = this;
      let method = "";
      if (that.thisIsLike == true) {
        method = "del";
      } else {
        method = "add";
      }
      //   this.thisIsLike=!this.thisIsLike;

      let currentUserId = "";
      if (this.$store.state.user) {
        currentUserId = this.$store.state.user.userId;
      } else {
        currentUserId = 0;
      }
      this.$axios({
        url: "/strategy/addLike",
        method: "put",
        params: {
          strategyId: this.id,
          uId: currentUserId,
          method: method,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            if (that.thisIsLike == true) {
              that.thisLikeNum -= 1;
            } else {
              that.thisLikeNum += 1;
            }
            this.thisIsLike = !this.thisIsLike;
          } else {
            this.$message({
              message: "发生错误!请检查",
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: "发生错误!请检查",
            type: "error",
          });
        });

      console.log(this.id);
    },
    addMyCollect() {
      let that = this;
      this.$confirm("确认取消收藏?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let that = this;
          let method = "";
          if (that.thisIsCollect == true) {
            method = "del";
          } else {
            method = "add";
          }
          //   this.thisIsLike=!this.thisIsLike;

          let currentUserId = "";
          if (this.$store.state.user) {
            currentUserId = this.$store.state.user.userId;
          } else {
            currentUserId = 0;
          }
          this.$axios({
            url: "/strategy/addCollect",
            method: "put",
            params: {
              strategyId: this.id,
              uId: currentUserId,
              method: method,
            },
          })
            .then((res) => {
              console.log(res);
              if (res.data.code === 0) {
                if (that.thisIsCollect == true) {
                  that.thisCollectNum -= 1;
                } else {
                  that.thisCollectNum += 1;
                }
                that.thisIsCollect = !that.thisIsCollect;
              } else {
                this.$message({
                  message: "发生错误!请检查",
                  type: "error",
                });
                this.loading = false;
              }
            })
            .catch((err) => {
              this.$message({
                message: "发生错误!请检查",
                type: "error",
              });
              this.loading = false;
            });
        })
        .catch(() => {});
    },
  },
};
</script>
<style>
/* #content {
    width: 80px;
    height: 140px;
    color: #42b983;
}
 #img {
    width: 80px;
    height: 50px;
  } */
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  float: right;
}
.bottom span {
  margin-left: 10px;
  font-size: 16px;
  padding: 0;
  float: right;
}
.bottom i {
  margin-left: 10px;
  font-size: 16px;
}
.point:hover {
  cursor: pointer;
}

/* .button {
    padding: 0;
    float: right;
  } */

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>
