import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BaiduMap from 'vue-baidu-map'
import Element from 'element-ui'
import Axios from 'axios'
import waterfall from 'vue-waterfall2'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/icon/iconfont.css'
import VueQuillEditor from 'vue-quill-editor'
import moment from 'moment'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor /* { default global options } */)
Vue.use(BaiduMap, {
    // 个人密钥
    ak: 'oz8AZIPGBYIYoThZbUqHjV1pOFAOSITm'
})
Vue.config.productionTip = false
Vue.use(Element)
Vue.use(waterfall)
//axios
Axios.defaults.timeout = 5000;
Axios.baseURL='http://localhost:8088/yunTravel_liyb';
Axios.defaults.withCredentials = true;
Axios.defaults.baseURL =Axios.baseURL;
// Axios.interceptors.request.use(
// 	config => {
// 	    if (store.state.adminToken||store.state.clientToken) {
// 			let token=store.state.adminToken?store.state.adminToken:store.state.clientToken;
// 	        config.headers.Authorization = token;
// 	    }
// 	    return config;
// 	},
// 	err => {
// 	    return Promise.reject(err);
// 	}
// );
Vue.prototype.$axios = Axios

//全局过滤器
Vue.filter('dateFmt', (input, formatString = "YYYY-MM-DD") => {
    //es5函数参数设置默认值
    //const lastFormatString = formatString || ''

    
     // moment(input) 把时间字符串转成时间对象
     // format(formatString) 把时间对象，按照指定格式，格式化成符合条件的字符串
    return moment(input).format(formatString)
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
