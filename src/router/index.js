import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store';

import Error from '@/views/404.vue'
import Login from '@/views/user/login.vue'
import Home from '@/views/user/index.vue'
import Sights from '@/views/user/sights.vue'
import Article from '@/views/user/article.vue'
import Strategy from '@/views/user/strategy.vue'
import Map from '@/views/user/map.vue'
import NoticeView from '@/views/user/noticeView.vue'
import SightsContent from '@/views/user/sightsContent.vue'
import StrategyContent from '@/views/user/strategyContent.vue'
import UserCenter from '@/views/user/userCenter.vue'
import NoticeList from '@/views/user/noticeList.vue'
import UserDetail from '@/views/user/userDetail.vue'
import UserPassword from '@/views/user/userPassword.vue'

import AdminIndex from '@/views/admin/Home.vue'
import AddNewArticle from '@/views/admin/addNewArticle.vue'
import EditArticle from '@/views/admin/editArticle.vue'
import SightsManage from '@/views/admin/sightsManage.vue'
import AdminLogin from '@/views/admin/login.vue'
import StrategyBase from '@/views/admin/strategyBase.vue'
import StrategyAudit from '@/views/admin/strategyAudit.vue'
import StrategyUnaudit from '@/views/admin/strategyUnaudit.vue'
import StrategyAuditView from '@/views/admin/strategyAuditView.vue'
import BannersManage from '@/views/admin/bannersManage.vue'
import StrategyComment from '@/views/admin/strategyComment.vue'
import CommentChild from '@/views/admin/commentChild.vue'
import AdminManage from '@/views/admin/adminManage.vue'
import UsersManage from '@/views/admin/usersManage.vue'
import NoticeManage from '@/views/admin/noticeManage.vue'
import NewsManage from '@/views/admin/newsManage.vue'
import NoticeEditor from '@/views/admin/noticeEditor.vue'
Vue.use(VueRouter)

const routes = [
    {
        path: '/home',
        name: 'Home',
        rediter:'/'
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/404page',
        name: 'Error',
        component: Error
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/sights',
        name: 'Sights',
        component: Sights
    },
    {
        path: '/article',
        name: 'Article',
        component: Article
    },
    {
        path: '/strategy',
        name: 'Strategy',
        component: Strategy
    }, {
        path: '/map',
        name: 'Map',
        component: Map
    }, 
    {
        path: '/noticeView',
        name: 'NoticeView',
        component: NoticeView
    },
    {
        path: '/sightsContent',
        name: 'SightsContent',
        component: SightsContent
    },
    {
        path: '/strategyContent',
        name: 'StrategyContent',
        component: StrategyContent
    },  
    {
        path: '/noticeList',
        name: 'NoticeList',
        component: NoticeList
    },  
    {
        path: '/userCenter',
        name: 'UserCenter',
        component: UserCenter,
        meta:{
            role:'user',
            title:'user'
        }        

    },
    {
        path: '/userDetail',
        name: 'UserDetail',
        component: UserDetail,
        meta:{
            role:'user',
            title:'user'
        }        

    },
    {
        path: '/userPassword',
        name: 'UserPassword',
        component: UserPassword,
        meta:{           
            title:'user'
        }        

    },
   
    
    // {
    //   path: '/about',
    //   name: 'About',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // }

    //admin
    
    {
        path: '/admin/',
        name: 'AdminIndex',
        component: AdminIndex,
        meta:{
            role:'admin',
            title:'首页'
        }        

    },
    {
        path: '/adminLogin',
        name: 'AdminLogin',
        component: AdminLogin,
        meta:{
            role:'adminLogin',
            title:'管理员登录'
        }        

    },
    {
        path: '/admin/addNewArticle',
        name: 'AddNewArticle',
        component: AddNewArticle,
        meta:{
            role:'admin',
            title:'新建文章'
        }        

    },
    {
        path: '/admin/editArticle',
        name: 'EditArticle',
        component: EditArticle,
        meta:{
            role:'admin',
            title:'修改文章'
        }        

    },
    {
        path: '/admin/sightsManage',
        name: 'SightsManage',
        component: SightsManage,
        meta:{
            role:'admin',
            title:'景点管理'
        }        

    },
    {
        path: '/admin/strategyBase',
        name: 'StrategyBase',
        component: StrategyBase,
        meta:{
            role:'admin',
            title:'攻略待审核'
        }        

    },    
    {
        path: '/admin/strategyAudit',
        name: 'StrategyAudit',
        component: StrategyAudit,
        meta:{
            role:'admin',
            title:'攻略审核'
        }        

    },
    {
        path: '/admin/strategyUnaudit',
        name: 'StrategyUnaudit',
        component: StrategyUnaudit,
        meta:{
            role:'admin',
            title:'攻略未审核'
        }        

    },
    {
        path: '/admin/strategyAuditView',
        name: 'StrategyAuditView',
        component: StrategyAuditView,
        meta:{
            role:'admin',
            title:'攻略查看'
        }        

    },
    {
        path: '/admin/bannersManage',
        name: 'BannersManage',
        component: BannersManage,
        meta:{
            role:'admin',
            title:'轮播管理'
        }        

    },{
        path: '/admin/strategyComment',
        name: 'StrategyComment',
        component: StrategyComment,
        meta:{
            role:'admin',
            title:'评论管理'
        }        

    },
    {
        path: '/admin/commentChild',
        name: 'CommentChild',
        component: CommentChild,
        meta:{
            role:'admin',
            title:'子评论管理'
        }        

    },{
        path: '/admin/adminManage',
        name: 'AdminManage',
        component: AdminManage,
        meta:{
            role:'admin',
            title:'管理员管理'
        }        

    },
    {
        path: '/admin/usersManage',
        name: 'UsersManage',
        component: UsersManage,
        meta:{
            role:'admin',
            title:'用户管理'
        }        

    },
    {
        path: '/admin/noticeManage',
        name: 'NoticeManage',
        component: NoticeManage,
        meta:{
            role:'admin',
            title:'公告管理'
        }        

    },
    {
        path: '/admin/newsManage',
        name: 'NewsManage',
        component: NewsManage,
        meta:{
            role:'admin',
            title:'新闻管理'
        }        

    },
    {
        path: '/admin/noticeEditor',
        name: 'NoticeEditor',
        component: NoticeEditor,
        meta:{
            role:'admin',
            title:'新闻管理'
        }        

    },


]

const router = new VueRouter({
    mode: 'history',
    routes
})

//登录拦截
router.beforeEach((to,from,next) => {
    if(to.meta.role==="admin"){
        if(store.state.admin){
            next()
          }else{
            next({
              path: '/adminLogin',
              query:{redirect: to.fullPath}
            })
          } 
    }else if(to.meta.role==="user"){
        if(store.state.user){
            next()
          }else{
            next({
              path: '/login',
              query:{redirect: to.fullPath}
            })
          } 
    }else{
        next();
    }  
   
  
});

export default router
