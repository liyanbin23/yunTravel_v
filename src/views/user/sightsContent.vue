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
          <el-col :span="18">
            <div class="notCont-left">
              <div class="detailLeftTitle">
                <div class="video">
                  <video
                    v-if="sights.aboutVideo"
                    :src="$axios.baseURL + sights.aboutVideo"
                    height="100%"
                    width="auto"
                    autoplay
                    loop
                    muted
                  />
                  <img
                    v-else
                    :src="$axios.baseURL + sights.headerImg"
                    height="100%"
                    width="auto"
                  />
                </div>
                <div class="title">
                  <h3 class="detailTitleTop">
                    {{ sights.sightsName }}
                  </h3>

                  <p class="detailTitleContent">
                    <span
                      >综合评分：<el-rate
                        v-model="sights.grade"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}"
                      >
                      </el-rate
                      >　</span
                    >
                  </p>
                  <p>
                    <span>城市：{{ sights.city }}　</span>
                  </p>
                </div>
              </div>
              <el-divider content-position="right"
                ><span
                  >发布时间：{{ sights.createDate | dateFmt("YYYY-MM-DD") }}
                </span></el-divider
              >
              <div v-html="sights.article" class="textCont"></div>
            </div>
          </el-col>
          <!-- 广告栏 -->
          <el-col :span="6">
            <div style="width: 90%">
              <el-card :body-style="{ padding: '5px' }">
                <el-divider content-position="left"
                  ><span>推荐 </span></el-divider
                >
                <div class="user">
                  <div class="user-info">
                    <p>
                      <router-link
                        :to="{ path: '/sightsContent', query: { sightsId: 1 } }"
                        >大理大昭寺</router-link
                      >
                    </p>
                    <p>
                      <router-link
                        :to="{ path: '/sightsContent', query: { sightsId: 1 } }"
                        >大理洱海</router-link
                      >
                    </p>
                    <p>
                      <router-link
                        :to="{ path: '/sightsContent', query: { sightsId: 1 } }"
                        >丽江古城</router-link
                      >
                    </p>
                  </div>
                </div>
              </el-card>

              <el-card :body-style="{ padding: '5px' }">
                <el-divider content-position="left"
                  ><span>评分 </span></el-divider
                >
                <div class="user">
                  <el-form ref="grade" v-model="grade" label-position="top">
                    <el-form-item prop="q_one" label="你觉得这个景点优美吗？">
                      <el-rate
                        v-model="grade.q_one"
                        :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                      >
                      </el-rate>
                    </el-form-item>
                    <el-form-item prop="q_two" label="你对这个景点的关注度怎样？">
                      <el-rate
                        v-model="grade.q_two"
                        :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                      >
                      </el-rate>
                    </el-form-item>
                    <el-form-item prop="q_three" label="该文章是否对你有帮助？">
                      <el-rate
                        v-model="grade.q_three"
                        :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                      >
                      </el-rate>
                    </el-form-item>
                    <el-form-item prop="q_four" label="你是否想去这个景点旅游？">
                      <el-rate
                        v-model="grade.q_four"
                        :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                      >
                      </el-rate>
                    </el-form-item>
                    <el-form-item prop="q_five" label="你认为这个景点是否值得推荐？">
                      <el-rate
                        v-model="grade.q_five"
                        :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                      >
                      </el-rate>
                    </el-form-item>
                     <el-button type="primary" @click="submitGrsde">提交</el-button>
                  </el-form>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </el-container>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      sights: {},
      grade: {
        q_one: 0,
        q_two: 0,
        q_three: 0,
        q_four: 0,
        q_five: 0,
      },
    };
  },
  mounted() {
    if (this.$route.query.sightsId) {
      this.getSights(this.$route.query.sightsId);
    } else {
      this.$message({
        message: "参数错误!请检查",
        type: "error",
      });
    }
  },
  methods: {
    noticDtail(item) {
      console.log(item.noticeId);
    },
    goBack() {
      this.$router.go(-1);
    },
    submitGrsde(){},
      getSights(id) {
      this.loading = true;
      this.$axios({
        url: "/resources/getSightById",
        method: "get",
        params: {
          sightsId: id,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            console.log(res.data.data);
            this.sights = res.data.data;
            this.currentTotal = res.data.data.total;
            this.loading = false;
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
  },
};
</script>
<style scoped>
.contner {
  width: 100%;
  margin-top: 10px;
  position: relative;
}
.video {
  height: 20vw;
  width: auto;
  margin: 10px auto 5px auto;
  float: left;
}
.title {
  width: 16vw;
  float: right;
  margin-top: 30px;
  margin-right: 30px;
}
.user {
  width: 90%;
  height: auto;
  margin: auto 1vw;
}
.user .user-info {
  width: 100%;
  height: auto;
}
.user .user-info p {
  margin-left: 30px;
  text-align: left;
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
</style>