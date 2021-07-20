<template>
  <el-header class="header">
    <el-row type="flex" justify="space-between" class="main">
      <!-- logo -->
      <div class="logo">
        <router-link to="/">
          <img src="@/assets/images/logo.png" alt />
        </router-link>
      </div>

      <!-- 菜单栏 -->
      <el-row type="flex" class="navs">
        <router-link to="/" >首页</router-link>
        <router-link to="/sights">彩云之南</router-link>
        <router-link to="/strategy">彩云攻略</router-link>        
        <!-- <router-link to="/mood">云南印象</router-link> -->
        <router-link to="/map">地图</router-link>
        <!-- <router-link to="/article">新建文章</router-link> -->
      </el-row>

      <!-- 登录/用户信息 -->
      <el-row type="flex" align="middle">
        <!-- 如果用户存在则展示用户信息，用户数据来自store -->
        <el-dropdown v-if="$store.state.user">
          <el-row type="flex" align="middle" class="el-dropdown-link">
            <router-link to="/userCenter">
              <img :src="$axios.baseURL+$store.state.user.usImage" />
              {{$store.state.user.nickName}}
            </router-link>
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </el-row>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link to="/userCenter">个人中心</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="handleLogout">退出</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <!-- 不存在用户信息展示登录注册链接 -->
        <router-link to="/login" class="account-link" v-else>登录 / 注册</router-link>
      </el-row>
    </el-row>
  </el-header>
</template>
<script>
import { mapMutations } from "vuex";
export default {
   data () {
        return {
            
        }
    },   
    methods: {
    // 用户退出
    ...mapMutations({
      clientLogout: "CLIENT_LOGOUT",
    }),
        handleLogout () {
            //this.$router.replace('/login')
            // 将用户数据情况
             console.log(this.$route)
             console.log(this.$route.role)
           this.clientLogout()
           if(this.$route.meta.role==='user'){
             this.$router.push({path:'/login'})
           }else{
              this.$router.push({path:'/'})
           }
          // console.log(this.$store.state.user)
        }
    }
}
</script>
<style scoped lang="less">
.header {
  height: 60px;
  line-height: 60px;
  background: #fff;
  border-bottom: 1px #ddd solid;
  box-shadow: 0 3px 0 #f5f5f5;
  box-sizing: border-box;

  .main {
    width: 1000px;
    margin: 0 auto;
  }

  .logo {
    width: auto;
    height: 50px;
    padding-top: 8px;

    img {
      display: block;
      height: 100%;
      width: auto;
    }
  }

  .navs {
    margin: 0 20px;
    flex: 1;

    a {
      display: block;
      padding: 0 20px;
      height: 60px;
      box-sizing: border-box;

      &:hover,
      &:focus,
      &:active {
        border-bottom: 3px #f8c644 solid;
        color: #f7c551;
      }
    }

    /deep/ .router-link-exact-active {
      background: #f8c644;
      color: #333 !important;
    }
  }

  .message {
    height: 36px;
    line-height: 1;
    cursor: pointer;
    .el-icon-bell {
      margin-right: 2px;
      font-size: 18px;
    }
  }

  .el-dropdown-link {
    margin-left: 20px;

    &:hover {
      img {
        border-color: #409eff;
      }
    }

    a {
      display: block;
    }

    img {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      border: 2px #fff solid;
      border-radius: 50px;
    }
  }

  .account-link {
    font-size: 14px;
    margin-left: 10px;
    color: #666;

    &:hover {
      color: #f1a865;
      text-decoration: underline;
    }
  }
}
</style>
