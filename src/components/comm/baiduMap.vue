<template>
  <div>
    <baidu-map
      class="map"
      :center="center"
      :zoom="8"
      :scroll-wheel-zoom="true"
      :double-click-zoom="true"
      :auto-resize="true"
      @ready="ready"
      @mousemove="syncPolyline"
      @click="paintPolyline"
      @rightclick="newPolyline"
    >
      <!-- <bm-control>
        <button @click="toggle('polyline')">
          {{ polyline.editing ? "停止绘制" : "开始绘制" }}
        </button>
      </bm-control>
      <bm-polyline
        :path="item"
        v-for="(item, index) in polyline.paths"
        :key="index"
      ></bm-polyline
      > -->
      <bm-view class="map"></bm-view>
      <bm-control :offset="{ width: '10px', height: '10px' }">
        <bm-auto-complete v-model="keyword" :sugStyle="{ zIndex: 1 }">
          <!-- <search-field placeholder="请输入地名关键字"></search-field> -->
          <el-input placeholder="请输入地名关键字" v-model="keyword"></el-input>
          <!-- 这里指代一个自定义搜索框组件 -->
        </bm-auto-complete>
      </bm-control>
      <bm-local-search
        :keyword="keyword"
        :auto-viewport="true"
      ></bm-local-search>
      <bm-boundary
        name="云南省"
        :strokeWeight="2"
        fillColor
        :fillOpacity="0"
        strokeColor="blue"
      ></bm-boundary>
      <bm-scale :offset="{right:'20px'}" anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
      <bm-geolocation
        anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
        :showAddressBar="true"
        :autoLocation="true"
        @locationSuccess="locationSuccess"
        @locationError="locationError"
      ></bm-geolocation>
      <bm-map-type
        :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
        anchor="BMAP_ANCHOR_TOP_RIGHT"
      ></bm-map-type>
    </baidu-map>
  </div>
</template>
<script>
export default {
  data() {
    return {
      polyline: {
        editing: false,
        paths: [],
      },
      keyword:'',
      center: {
       lng: 102.849095,
        lat: 24.875331,
      },
    };
  },
  methods: {
    locationSuccess(point, AddressComponent, marker) {
      console.log(point);
      console.log(AddressComponent);
      console.log(marker);
    },
    locationError(StatusCode) {
      console.log(StatusCode);
    },
    ready({ BMap, map }) {
      // const _this = this; // 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
      // var geolocation = new BMap.Geolocation();
      // geolocation.getCurrentPosition(
      //   function (r) {
      //     console.log(r);
      //     _this.center = { lng: r.longitude, lat: r.latitude }; // 设置center属性值
      //     _this.autoLocationPoint = { lng: r.longitude, lat: r.latitude }; // 自定义覆盖物
      //     _this.initLocation = true;
      //     console.log("center:", _this.center); // 如果这里直接使用this是不行的
      //   },
      //   { enableHighAccuracy: true }
      // );
    },
    toggle(name) {
      this[name].editing = !this[name].editing;
    },
    syncPolyline(e) {
      if (!this.polyline.editing) {
        return;
      }
      const { paths } = this.polyline;
      if (!paths.length) {
        return;
      }
      const path = paths[paths.length - 1];
      if (!path.length) {
        return;
      }
      if (path.length === 1) {
        path.push(e.point);
      }
      this.$set(path, path.length - 1, e.point);
    },
    newPolyline(e) {
      if (!this.polyline.editing) {
        return;
      }
      const { paths } = this.polyline;
      if (!paths.length) {
        paths.push([]);
      }
      const path = paths[paths.length - 1];
      path.pop();
      if (path.length) {
        paths.push([]);
      }
    },
    paintPolyline(e) {
      if (!this.polyline.editing) {
        return;
      }
      const { paths } = this.polyline;
      !paths.length && paths.push([]);
      paths[paths.length - 1].push(e.point);
    },
    getEditorData() {
      console.log(this.polyline.paths);
      console.log(JSON.stringify(this.polyline.paths));
    },
  },
};
</script>
<style>
/* The container of BaiduMap must be set width & height. */
.map {
  width: 100%;
  height: 600px;
}
</style>
