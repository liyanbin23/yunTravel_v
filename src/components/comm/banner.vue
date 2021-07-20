<template>
  <div class="container">
    <div class="bgCont">
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="(item, index) in banners" :key="index">
          <img :src="$axios.baseURL + item.imgUrl" width="100%" height="100%"/>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 幻灯片 -->
    <div class="contents">
      <el-carousel :interval="5000" arrow="always" type="card">
        <el-carousel-item v-for="(item, index) in banners" :key="index">
          <!-- <img :src="item.url" /> -->
          <img :src="$axios.baseURL + item.imgUrl" />
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 轮播图数据
      banners: [],
    };
  },
  mounted() {
    this.getResource();
  },
  methods: {
    //请求静态资源
    getResource() {
      this.loading = true;
      this.$axios({
        url: "/resources/getSightBanner",
        method: "get",
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            console.log(res.data.data);
            this.banners = res.data.data;
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

<style scoped lang='less'>
.container {
  width: 100%;
  margin: 0 auto;
  position: relative;
}
.bgCont {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 0;
  background-size: cover;
  background-repeat: no-repeat;
  filter: blur(8px);
}
.contents {
  position: absolute;
  min-width: 1000px;
  margin: 0 auto;
  z-index: 1;
  position: relative;
  /deep/ .el-carousel__container {
    height: 300px;

    img {
      display: block;
      width: 100%;
    }
  }
}
</style>
