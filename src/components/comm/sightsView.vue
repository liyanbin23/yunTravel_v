<template>
  <div id="content">
    <el-card :body-style="{ padding: '0px' }">
      <img :src="$axios.baseURL + imgUrl" class="image" />
      <div style="padding: 14px">
        <div class="sight-middle">
          <div class="sight-middle-left">
            <router-link
              :to="{ path: '/sightsContent', query: { sightsId: id } }"
            >
              <span
                style="
                  margin: 2px 2px auto auto;
                  font-size: 17px;
                  color: rgb(24, 207, 146);
                "
                >{{ sightName }}</span
              >
            </router-link>
          </div>
          <div class="sight-middle-right">
            <el-rate
              v-model="grade"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            >
            </el-rate>
          </div>
        </div>
        <el-collapse v-model="activeNames" accordion>
          <el-collapse-item title="" name="1">
            <div>
              <span style="text-alrgin: left">{{ detal }}</span>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div class="bottom clearfix">
          <time class="time">{{ date | dateFmt("YYYY-MM-DD") }}</time>
          <i class="el-icon-view">{{ viewes }}</i>

          <!-- <el-button type="text" class="button">操作按钮</el-button> -->
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  props: {
    // 图片路径
    imgUrl: {
      type: String,
      default: "",
    },
    id: {
      type: Number,
      default: 0,
    },
    // 简介
    detal: {
      type: String,
      default: "",
    },
    // 浏览量
    viewes: {
      type: Number,
      default: 0,
    },
    // 景点名称
    sightName: {
      type: String,
      default: "",
    },
    // 收藏量
    grade: {
      type: Number,
      default: 0,
    },
    // 收藏量
    date: {
      type: Number,
      default: new Date(),
    },
  },
  data() {
    return {
      currentDate: new Date(),
      activeNames: ["1"],
    };
  },
  methods: {
    addMyLike() {
      console.log(this.id);
    },
  },
};
</script>
<style>
/* #content {
    width: 80px;
    height: 140px;
    color: #42b983;
} */
/* #img {
    width: 80px;
    height: 50px;
  } */
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  float: right;
}
.bottom span {
  margin-left: 10px;
  font-size: 16px;
  padding: 0;
  float: right;
}
.sight-middle {
  height: auto;
}
.sight-middle-left {
  width: 50%;
  float: left;
}
.sight-middle-right {
  width: 50%;
  float: right;
}
.bottom i {
  margin-left: 10px;
  font-size: 16px;
}

/* .button {
    padding: 0;
    float: right;
  } */

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>
