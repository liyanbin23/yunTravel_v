<template>
  <div class="container">
    <!-- 视频 -->
    <div class="headerVideo">
      <div class="bgCont">
          <img src="@/assets/bg/03.jpeg" width="100%" height="100%">
      </div>
      <div class='videoCont'> <video
          :src="$axios.baseURL+'/static/video/yunTravel.mp4'"
          autoplay
          loop
          muted
          height="290px"
        ></video></div>

    </div>
  </div>
</template>

<script>
export default {
    data () {
        return {
            imgStyle: {
                backgroundImage: 'url(' + require('../../assets/bg/03.jpeg') + ')',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '25px auto',
                marginTop: '5px'
            }
        }
    },
    methods: {}
}
</script>

<style scoped lang='less'>
.container {
  width: 100%;
  margin: 0 auto;
  position: relative;
}

.bgCont {
  width: 100%;
  height: 300px;
  position: absolute;
  z-index: 0;
  background-size: cover;
  background-repeat: no-repeat;
  filter: blur(8px);
}
.headerVideo {
  width: 100%;
  height: 300px;
  position: relative;
  margin: 0px auto 10px auto;
}
.videoCont{
    margin-left: 40px;
    border: solid 2px #cceccd;
    background-color: #e9dfdf;
    z-index: 4;
    position: absolute;
    box-shadow:2px grey;
}
</style>
