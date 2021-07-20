<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in $store.state.admin.roleNum===0?superadmin:admin">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template #title>
                            <i :class="item.icon"></i>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template #title>{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem, i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
export default {
    data() {
        return {
            admin: [
                {
                    icon: "el-icon-s-home",
                    index: "/admin/",
                    title: "系统首页"
                },
                {
                    icon: "el-icon-picture",
                    index: "1",
                    title: "景点管理",
                     subs: [
                        {
                            index: "sightsManage",
                            title: "管理"
                        },
                        {
                            index: "addNewArticle",
                            title: "新建"
                        }
                    ]
                },
                {
                    icon: "el-icon-s-release",
                    index: "2",
                    title: "攻略管理",                     
                    subs: [
                        {
                            index: "strategyBase",
                            title: "待审核"
                        },
                        {
                            index: "strategyAudit",
                            title: "已审核"
                        },
                        {
                            index: "strategyUnaudit",
                            title: "已驳回"
                        }
                    ]
                },
                {
                    icon: "el-icon-c-scale-to-original",
                    index: "bannersManage",
                    title: "图片轮播"
                },
                {
                    icon: "el-icon-chat-dot-square",
                    index: "4",
                    title: "评论管理",                     
                    subs: [
                        {
                            index: "strategyComment",
                            title: "攻略评论"
                        },
                        {
                            index: "commentChild",
                            title: "回复评论"
                        }
                    ]
                },
                {
                    icon: "el-icon-s-custom",
                    index: "adminManage",
                    title: "管理员管理"
                },

                {
                    icon: "el-icon-set-up",
                    index: "usersManage",
                    title: "会员管理"
                },
                {
                    icon: "el-icon-news",
                    index: "7",
                    title: "公告新闻",
                    subs: [
                        {
                            index: "noticeManage",
                            title: "公告管理"
                        },
                        {
                            index: "newsManage",
                            title: "新闻管理"
                        }
                    ]
                },
                // {
                //     icon: "el-icon-lx-redpacket_fill",
                //     index: "/donate",
                //     title: "支持作者"
                // }
            ],

            //超管菜单
             superadmin: [
                {
                    icon: "el-icon-s-home",
                    index: "/admin/",
                    title: "系统首页"
                },
                {
                    icon: "el-icon-c-scale-to-original",
                    index: "bannersManage",
                    title: "图片轮播"
                },
                {
                    icon: "el-icon-s-custom",
                    index: "adminManage",
                    title: "管理员管理"
                },               
                {
                    icon: "el-icon-news",
                    index: "7",
                    title: "公告新闻",
                    subs: [
                        {
                            index: "noticeManage",
                            title: "公告管理"
                        },
                        {
                            index: "newsManage",
                            title: "新闻管理"
                        }
                    ]
                }
                // {
                //     icon: "el-icon-pie-chart",
                //     index: "charts",
                //     title: "schart图表"
                // }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace("/", "");
        },
        collapse(){
            return this.$store.state.collapse
        }
    }
};
</script>

<style scoped>
@import "../../assets/css/main.css";
@import "../../assets/css/color-dark.css";
.sidebar {
    display: block;
    position: absolute;
    left: 3px;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
