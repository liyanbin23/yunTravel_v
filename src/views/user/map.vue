<template>
  <div class="container">
    <!-- 幻灯片 -->
    <baidu-map></baidu-map>
  </div>
</template>

<script>
import BaiduMap from '../../components/comm/baiduMap.vue'
export default {
    components: {
        BaiduMap
    },
    data () {
        return {}
    },
    methods: {}
}
</script>

<style scoped lang='less'>
.container {
  min-width: 1000px;
  margin: 0 auto;
  position: relative;
}
</style>
