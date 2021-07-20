import * as types from './mutation-types';
import {setLocalItem ,setSessionItem} from '@/util/util';

const mutations = {
	//管理员
  	[types.SET_ADMIN_TOKEN]:(state, adminToken) => {
  		state.adminToken = adminToken;
  		setSessionItem('adminToken',adminToken);
  	},
	[types.ADMIN_LOGOUT]: (state) => {
	    state.adminToken = null;
	    state.admin = null;
	    sessionStorage.removeItem('adminName');
		sessionStorage.removeItem('adminToken');
	},
	[types.SET_ADMIN]:(state, admin) => {
  		state.admin = admin;
  		// setLocalItem('admin',admin);
		setSessionItem('admin',JSON.stringify(admin));// session只保留到浏览器关闭
  	},
	
	//用户
	[types.SET_CLIENT_TOKEN]:(state, clientToken) => {
  		state.clientToken = clientToken;
  		setSessionItem('clientToken',clientToken);
  	},
  	[types.SET_CLIENT]:(state, user) => {
  		state.user = user;
  		// setLocalItem('user',user);
		setSessionItem('user',JSON.stringify(user));// session只保留到浏览器关闭
  	},
	[types.CLIENT_LOGOUT]: (state) => {
	    state.clientToken = null;
	    state.user = null;
	    sessionStorage.removeItem('user');
		sessionStorage.removeItem('clientToken');
	},


	delTagsItem(state, data) {
		state
			.tagsList
			.splice(data.index, 1);
	},
	setTagsItem(state, data) {
		state
			.tagsList
			.push(data)
	},
	clearTags(state) {
		state.tagsList = []
	},
	closeTagsOther(state, data) {
		state.tagsList = data;
	},
	
	closeCurrentTag(state, data) {
		for (let i = 0, len = state.tagsList.length; i < len; i++) {
			const item = state.tagsList[i];
			if (item.path === data.$route.fullPath) {
				if (i < len - 1) {
					data
						.$router
						.push(state.tagsList[i + 1].path);
				} else if (i > 0) {
					data
						.$router
						.push(state.tagsList[i - 1].path);
				} else {
					data
						.$router
						.push("/");
				}
				state
					.tagsList
					.splice(i, 1);
				break;
			}
		}
	},
	// 侧边栏折叠
	hadndleCollapse(state, data) {
		state.collapse = data;
	}

}

export default mutations;