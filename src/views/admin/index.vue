<template>
<!-- 此模版已挂载到app无用 -->
    <div class="about">
        <v-header />
        <v-sidebar />
        <div class="content-box" :class="{ 'content-collapse': $store.state.collapse}">           
            <div class="content">
               <v-tags></v-tags>
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
</template>
<script>
import vHeader from "@/components/admin/Header";
import vSidebar from "@/components/admin/Sidebar";
import vTags from "@/components/admin/Tags.vue";
export default {
    components: {
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
};
</script>
<style scoped>
@import "../../assets/css/main.css";
@import "../../assets/css/color-dark.css";
</style>
