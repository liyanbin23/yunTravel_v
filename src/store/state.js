import {getLocalItem,getSessionItem} from '@/util/util';
const state = {
  //后台管理
  adminToken:getSessionItem('adminToken')?getSessionItem('adminToken'):null,
  admin:getSessionItem('admin')?JSON.parse(getSessionItem('admin')):null,

  //游客前台
  user:getSessionItem('user')?JSON.parse(getSessionItem('user')):null,
  clientToken:getSessionItem('clientToken')?getSessionItem('clientToken'):null,

  //游标
  tagsList: [],
  collapse: false
}

export default state;