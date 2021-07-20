<template>
  <div class="contner">
    <div class="notCont">
      <el-page-header @back="goBack" content="详情页面"> </el-page-header>
      <el-divider content-position="left">文章详情</el-divider>
      <el-container
        v-loading="loading"
        direction="vertical"
        element-loading-text="拼命加载中"
        element-loading-background="rgba(0,0,0,0.1)"
      >
        <el-row>
          <el-col :span="24">
            <div class="notCont-left">
              <div class="detailLeftTitle">
                <h3 class="detailTitleTop">
                  {{ strategy.titles }}
                </h3>
                <p class="detailTitleContent">
                  <span>城市：{{ strategyData.city }} </span>
                  <span>类型：{{ strategyData.travelType }}　</span>
                  <span>人均消费：{{ strategy.expen }}　</span>
                  <span>旅行天数：{{ strategy.travelDays }}　</span>
                </p>
              </div>
              <el-divider content-position="right"
                ><span
                  >发布时间：{{ strategy.createTime | dateFmt("YYYY-MM-DD") }}
                </span></el-divider
              >
              <div class="map">
                <baidu-map
                  v-if="haveMap && paths != []"
                  class="bmap"
                  :center="center"
                  :zoom="zoom"
                  :scroll-wheel-zoom="true"
                  :double-click-zoom="true"
                  :auto-resize="true"
                  @ready="ready"
                >
                  <bm-polyline
                    v-for="(item, index) in paths"
                    :path="item"
                    :key="index"
                  ></bm-polyline
                ></baidu-map>
                <img v-else :src="$axios.baseURL + strategy.headerImg" />
              </div>
              <div v-html="strategy.articleCont" class="textCont"></div>
              <el-divider></el-divider>

              <el-button type="primary" icon="el-icon-edit" @click="handleEdit"
                >审核通过</el-button
              >
              <el-button type="warning" icon="el-icon-edit" @click="openDialog"
                >驳回</el-button
              >
              <!-- <comment v-if="strategy.strategyId" :strategyId="strategy.strategyId"></comment> -->
            </div>
          </el-col>
          <!-- 广告栏 -->
        </el-row>
      </el-container>
    </div>
  </div>
</template>
<script>
import comment from "../../components/comm/comment.vue";
export default {
  components: { comment },
  data() {
    return {
      loading: false,
      strategyData: {},
      //攻略，避免元素找不到错误
      strategy: {},
      //用户，避免用户找不到错误
      users: {},
      haveMap: true,
      age: 0,
      //地图路径
      paths: [],
      //地图中心
      center: {
        lng: 102.849095,
        lat: 24.875331,
      },
      //地图层级
      zoom: 14,
    };
  },
  mounted() {
    if (this.$route.query.strategyId) {
      if (this.$route.query.tab === "base") {
        let url = "/admin/getBaseStrategyById";
        this.getStrategy(this.$route.query.strategyId, url);
      } else if (this.$route.query.tab === "audit") {
        let url = "/admin/getAuditStrategyById";
        this.getStrategy(this.$route.query.strategyId, url);
      } else if (this.$route.query.tab === "unaudit") {
        let url = "/admin/getUnAuditStrategyById";
        this.getStrategy(this.$route.query.strategyId, url);
      } else {
        this.$message({
          message: "参数错误!请检查",
          type: "error",
        });
      }

      //   this.getStrategy(this.$route.query.strategyId);
    } else {
      this.$message({
        message: "参数错误!请检查",
        type: "error",
      });
      // this.getStrategy(1);
    }
  },
  methods: {
    noticDtail(item) {
      console.log(item.noticeId);
    },
    goBack() {
      //console.log(Date.parse(new Date()));
      this.$router.go(-1);
    },
    getDaysAndHours(blockingTime) {
      let dateNow = new Date(); // 获取当前时间
      let timeDiff = dateNow.getTime() - blockingTime; // 时间差的毫秒数
      // timeDiff = 时间戳差值
      let days = Math.floor(timeDiff / (24 * 3600 * 1000)); // 计算出天数
      return days;
    },
    getStrategy(id, url) {
      this.loading = true;
      let that = this;
      this.$axios({
        url: url,
        method: "get",
        params: {
          strategyId: id,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            console.log(res.data.data);
            that.strategyData = res.data.data;
            that.strategy = res.data.data.strategy;

            if (
              res.data.data.strategy.router != null ||
              res.data.data.strategy.router != "[]"
            ) {
              that.paths = JSON.parse(res.data.data.strategy.router);
              that.center = this.paths[0][0];
              console.log("thatcenter" + that.center);
              that.zoom = 13;
            } else {
              that.haveMap = false;
            }
            that.loading = false;
          } else {
            this.$message({
              message: "资源获取失败!请检查",
              type: "error",
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
    ready({ BMap, map }) {
      //   let p=this.paths[0]
      //   if (
      //          p != null ||
      //           p != "[]"
      //         ){
      //            this.center = this.p[0];
      //         }
      //   //this.center = this.paths[0][0];
    },
    handleEdit() {
      let currentUserId = "";
      if (this.$store.state.admin) {
        currentUserId = this.$store.state.admin.adminId;
      } else {
        currentUserId = 1;
      }
      // this.$axios({
      //   url: "/admin/strategyAudit",
      //   method: "put",
      //   data: {
      //     strategy: this.strategy,
      //     adminId: currentUserId,
      //   },
      // })
      //   .then((res) => {
      //     console.log(res);
      //     if (res.data.code === 0) {
      //       this.$message({
      //         message: "审核成功",
      //         type: "success",
      //       });
      //       this.$router.go(-1);
      //     } else {
      //       this.$message({
      //         message: res.data.message,
      //         type: "error",
      //       });
      //     }
      //   })
      //   .catch((err) => {
      //     this.$message({
      //       message: "审核失败",
      //       type: "error",
      //     });
      //   });
      this.goBack();
    },
  },
};
</script>
<style scoped>
.contner {
  width: 100%;
  margin-top: 10px;
  position: relative;
}
.map {
  height: 25vw;
  width: 100%;
  margin: 10px auto 5px auto;
  float: left;
}
.bmap {
  width: 95%;
  height: 100%;
}
.uCard {
  width: 85%;
  margin-left: 1vw;
}
.user {
  width: 100%;
  height: 20vw;
}
.user .user-info {
  width: 100%;
  height: auto;
}
.user .user-info p {
  margin-left: 30px;
  text-align: left;
}
.title {
  width: 16vw;
  float: right;
  margin-top: 30px;
  margin-right: 30px;
}
.notCont {
  width: 80%;
  text-align: center;
  padding: 10px auto;
  margin: 10px auto;
}
.notCont-left {
  border-right: 1px solid #e6e6e6;
}
.textCont {
  margin-right: 8px;
}
.detailLeftTitle {
  width: 100%;
  min-height: 130px;
  padding: 30px 0px;
  box-sizing: border-box;
  overflow: hidden;
}
.detailTitleTop {
  width: 100%;
  min-height: 25px;
  line-height: 30px;
  font-size: 20px;
  color: rgb(24, 207, 146);
  overflow: hidden;
  text-align: center;
}
.detailTitleContent {
  width: 100%;
  min-height: 20px;
  line-height: 20px;
  font-size: 16px;
  color: #989898;
  margin-top: 10px;
  overflow: hidden;
  text-align: center;
}
.detailTitleContent span {
  float: initial;
  margin-left: 15px;
}
</style>

        
    </div>
</template>