<template>
  <div class="container">
    <!-- 背景图 -->
    <div class="banner-image" :style="`background:url(${banners.url}) center center no-repeat`"></div>
    <!-- tab栏 -->
    <el-row type="flex" justify="center" align="middle" class="main">
      <div class="form-wrapper">
        <!-- 表单头部tab -->
        <el-row type="flex" justify="center" class="tabs">
          <span
            :class="{active: currentTab === index}"
            v-for="(item, index) in [`登录`, `注册`]"
            :key="index"
            @click="handleChangeTab(index)"
          >{{item}}</span>
        </el-row>

        <!-- 登录功能组件 -->
        <LoginForm v-if="currentTab == 0" />

        <!-- 注册功能组件 -->
        <RegisterForm v-if="currentTab == 1" />
      </div>
    </el-row>
  </div>
</template>

<script>
import LoginForm from '@/components/user/loginForm.vue'
import RegisterForm from '@/components/user/RegisterForm.vue'
export default {
    components: {
        LoginForm,
        RegisterForm
    },
    mounted () {
    // console.log(this.$store.state);
    },
    data () {
        return {
            currentTab: 0,
            banners: {
                url: 'http://157.122.54.189:9095/assets/images/th03.jfif'
            }
        }
    },
    methods: {
        handleChangeTab (index) {
            this.currentTab = index
        },
        handleClick () {}
    }
}
</script>

<style lang="less" scoped>
.container {
  height: 700px;
  position: relative;

  .banner-image {
    width: 100%;
    height: 100%;
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

      .tabs {
        span {
          display: block;
          width: 50%;
          height: 50px;
          box-sizing: border-box;
          border-top: 2px #eee solid;
          background: #eee;
          line-height: 48px;
          text-align: center;
          cursor: pointer;
          color: #666;

          &.active {
            color: orange;
            border-top-color: orange;
            background: #fff;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
