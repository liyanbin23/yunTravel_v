<template>
  <div id="app">
    <div v-if="$route.meta.role==='admin'">  
    <div class="about">
        <v-header />
        <v-sidebar />
        <div class="content-box" :class="{ 'content-collapse':collapse}">  
          <v-tags></v-tags>         
            <div class="content">               
                <router-view v-slot="{ Component }">
                    <transition name="move" mode="out-in">
                        <keep-alive :include="tagsList">
                            <component :is="Component" />
                        </keep-alive>
                    </transition>
                </router-view>
                <!-- <el-backtop target=".content"></el-backtop> -->
            </div>
        </div>
    </div>
    </div>
    <div class="adminLogin" v-else-if="$route.meta.role==='adminLogin'">
       <router-view/>
    </div>
    <div id="nav" v-else>
      <Header></Header>
      <!-- <router-link to="/login">Home</router-link> |
      <router-link to="/404page">error</router-link> -->
      <router-view/>
      <Footer></Footer>
    </div>

  </div>
</template>
<script>
import Header from '@/components/comm/header.vue'
import Footer from '@/components/comm/footer.vue'
import vHeader from "@/components/admin/Header";
import vSidebar from "@/components/admin/Sidebar";
import vTags from "@/components/admin/Tags.vue";
export default {
    components: {
        Header,
        Footer,
        vHeader,
        vSidebar,
        vTags
    },
    computed: {
        tagsList() {
            return this.$store.state.tagsList.map(item => item.name);
        },
        collapse() {
            return this.$store.state.collapse;
        }
    }
}
</script>
<style>
body{
  margin: 3px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 0px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.adminLogin{
  width: 100vw;
  height: 100vh;
}

</style>
