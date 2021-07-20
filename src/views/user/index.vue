<template>
  <div class="container">
    <el-container
      v-loading="loading"
      direction="vertical"
      element-loading-text="拼命加载中"
      element-loading-background="rgba(0,0,0,0.1)"
    >
      <!-- 幻灯片 -->
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="(item, index) in banners" :key="index">
          <div
            class="banner-image"
            :style="`
                background:url(${
                  $axios.baseURL + item.imgUrl
                }) center center no-repeat;
                background-size:contain contain;
                `"
          ></div>
        </el-carousel-item>
      </el-carousel>
      <!-- 搜索框 -->
      <div class="banner-content">
        <div class="search-bar">
          <!-- tab栏 -->
          <el-row type="flex" class="search-tab">
            <span
              v-for="(item, index) in options"
              :key="index"
              :class="{ active: index === currentOption }"
              @click="handleOption(index)"
            >
              <i>{{ item.name }}</i>
            </span>
          </el-row>

          <!-- 输入框 -->
          <el-row type="flex" align="middle" class="search-input">
            <input
              :placeholder="options[currentOption].placeholder"
              v-model="searchValue"
              @keyup.enter="handleSearch"
            />
            <i class="el-icon-search" @click="handleSearch"></i>
          </el-row>
        </div>
      </div>
    </el-container>
    <index-content></index-content>
  </div>
</template>

<script>
import IndexContent from '@/components/comm/indexContent.vue'
export default {
   components: {
        IndexContent
    },
  data() {
    return {
      // 轮播图数据
      banners: [],
      options: [
        // 搜索框tab选项
        {
          name: "景点",
          placeholder: "请输入关键字进行搜索",
          pageUrl: "/sights",
        },
        {
          name: "攻略",
          placeholder: "请输入关键字进行搜索",
          pageUrl: "/strategy",
        }
      ],
      loading: false, //内容加载中
      searchValue: "", // 搜索框的值
      currentOption: 0, // 当前选中的选项
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
        url: "/resources/getHomeBanners",
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
    // tab栏切换
    handleOption(index) {
      this.currentOption = index;
    },
    // 搜索处理
    handleSearch() {
      const item = this.options[this.currentOption];
      // 跳转时候给对应的页面url加上搜索内容参数
      this.$router.push({path:item.pageUrl,query:{val:this.searchValue}});
    },
  },
};
</script>

<style scoped lang='less'>
.container {
  min-width: 1000px;
  margin: 5px auto;
  position: relative;

  /deep/ .el-carousel__container {
    height: 740px;
  }

  .banner-image {
    width: 100%;
    height: 100%;
  }
  // 搜索框
  .banner-content {
    z-index: 9;
    width: 1000px;
    position: absolute;
    left: 50%;
    top: 300px;
    margin-left: -500px;
    border-top: 1px transparent solid;

    .search-bar {
      width: 552px;
      margin: 0 auto;
    }    

    .search-tab {
      .active {
        i {
          color: #333;
        }
        &::after {
          background: #eee;
        }
      }

      span {
        width: 82px;
        height: 36px;
        display: block;
        position: relative;
        margin-right: 8px;
        cursor: pointer;

        i {
          position: absolute;
          z-index: 2;
          display: block;
          width: 100%;
          height: 100%;
          line-height: 30px;
          text-align: center;
          color: #fff;
        }

        &:after {
          position: absolute;
          left: 0;
          top: 0;
          display: block;
          content: "";
          width: 100%;
          height: 100%;
          border: 1px rgba(255, 255, 255, 0.2) solid;
          border-bottom: none;
          transform: scale(1.1, 1.3) perspective(0.7em) rotateX(2.2deg);
          transform-origin: bottom left;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 1px 2px 0 0;
          box-sizing: border-box;
        }
      }
    }

    .search-input {
      width: 550px;
      height: 46px;
      background: #fff;
      border-radius: 0 4px 4px 4px;
      border: 1px rgba(255, 255, 255, 0.2) solid;
      border-top: none;
      box-sizing: unset;

      input {
        flex: 1;
        height: 20px;
        padding: 13px 15px;
        outline: none;
        border: 0;
        font-size: 16px;
      }

      .el-icon-search {
        cursor: pointer;
        font-size: 22px;
        padding: 0 10px;
        font-weight: bold;
      }
    }
  }
}
</style>
