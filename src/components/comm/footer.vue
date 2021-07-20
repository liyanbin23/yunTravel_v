<template>
  <div class="footer-wrapper">
    <div class="footer">
      <el-row class="info-list">
        <el-col :span="6" :offset="1">
          <h5>彩云之南旅游网</h5>
          <p>千万旅行者共同打造的"云南旅行神器"</p>
          <p>
            <span>60,0</span> 多个旅游目的地
          </p>
          <p>
            <span>600,0</span> 个细分目的地新玩法
          </p>
          <p>
            <span>7,600,000</span> 次攻略下载
          </p>
         
        </el-col>
        <el-col :span="5">
          <h5>关于我们</h5>
          <p>隐私政策 商标声明</p>
          <p>服务协议 游记协议</p>
          <p>商城平台服务协议</p>
          <p>网络信息侵权通知指引</p>         
        </el-col>
        <el-col :span="5">
          <h5>旅行服务</h5>
          <p>旅游攻略 最全分享</p>
          <p>旅游特价 最新资讯</p>
          <p>旅游论坛 实时了解</p>
          <p>旅游指南 清晰不迷茫</p>        
        </el-col>
        <el-col :span="6" class="scan">
          <p>
            <img :src="$axios.baseURL+'/static/images/uploadImg/9cc23e5e-5576-4f9f-887f-7e300b7ab772.png'" alt />
          </p>关注我们
        </el-col>
      </el-row>

      <div
        class="licence"
      > Copyright © 2021 七彩旅游云南旅游网（yunTravel_v） All Rights Reserved 非商用</div>
    </div>
  </div>
</template>

<style scoped lang="less">
.footer-wrapper {
  background: #333;
  color: #ccc;
  min-width: 1000px;
}

.footer {
  padding-top: 30px;
  margin: 10px auto 0px auto;
  width: 1000px;
}

.info-list {
  h5 {
    font-weight: normal;
    font-size: 16px;
    margin-bottom: 10px;
  }

  p {
    font-size: 12px;
    line-height: 1.8;
    span {
      color: orange;
    }
  }
}

.scan {
  text-align: center;

  img {
    width: 140px;
    height: 140px;
  }

  font-size: 12px;
}

.licence {
  border-top: 1px #666 solid;
  margin-top: 20px;
  padding: 50px 0;
  text-align: center;
  font-size: 12px;
}
</style>
