<template>
  <div class="cont">
    <el-main>
      <Video></Video>
      <el-row type="flex" :gutter="20">
        <el-col :span="20">
          <el-row type="flex" :gutter="20">
            <el-col :span="9">
              <el-menu
                default-active="0"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
              >
                <el-menu-item index="0">全部</el-menu-item>
                <el-menu-item index="1">经济型</el-menu-item>
                <el-menu-item index="2">舒适型</el-menu-item>
                <el-menu-item index="3">轻奢型</el-menu-item>
                <el-menu-item index="4">豪华型</el-menu-item>
              </el-menu>
            </el-col>
            <el-col :span="5">
              <el-select v-model="travelDayVal" placeholder="选择旅行时长" style="margin: 15px 20px auto auto" @change="selectDay">
                <el-option-group
                  v-for="group in travelDayOptions"
                  :key="group.label"
                  :label="group.label"
                >
                  <el-option
                    v-for="item in group.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-option-group>
              </el-select>
            </el-col>
            <el-col :span="10">
              <el-input
                v-model="context"
                placeholder="搜索城市"
                prefix-icon="el-icon-search"
                clearable
                @keyup.enter.native="search()"
                style="margin: 15px 20px auto auto"
              />
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="20">
            <div class="centerTitle">
              <div class="centerTitleBox" style="margin-left: -88px">
                <span class="centerTitleLeft"></span>
                <span class="centerTitleMiddle">彩云攻略</span>
                <span class="centerTitleRight"></span>
              </div></div
          ></el-row>
          <el-row>
            <waterfall :col="3" :data="strategyList">
              <template>
                <div
                  class="content"
                  v-for="(item, index) in strategyList"
                  :key="index"
                >
                  <StrategyView
                    :userNick="item.users.nickName"
                    :userId="item.users.userId"
                    :userPhoto="item.users.usImage"
                    :id="item.strategy.strategyId"
                    :currentDate="item.strategy.createTime"
                    :city="item.city"
                    :travelType="item.travelType"
                    :isLike="item.like"
                    :isCollect="item.collect"
                    :likes="item.likeNum"
                    :title="item.strategy.titles"
                    :collector="item.collectNum"
                    :imgUrl="item.strategy.headImg"
                  />
                </div>
              </template>
            </waterfall>
          </el-row>
          <div>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="currentTotal"
            />
          </div>
        </el-col>
        <el-col :span="4" style="background: #67c23a"> </el-col>
      </el-row>
    </el-main>
  </div>
</template>
<script>
import Video from "@/components/comm/video.vue";
import StrategyView from "@/components/comm/strategyView.vue";
export default {
  components: {
    Video,
    StrategyView,
  },
  data() {
    return {
      searchParm: {
        city: "",
        travelType: 0,
        travelDay: 0,
      },
      currentTotal: 20,
      pageSize: 10,
      currentPage: 1,
      strategyList: [],
      option: [{}],
      context: "",
      travelDayVal:'',

      travelDayOptions: [
        {
          label: "火热选项",
          options: [
            {
              value: 3,
              label: "3天",
            },
            {
              value: 5,
              label: "5天",
            },
            {
              value: 7,
              label: "一周",
            },
            {
              value: 15,
              label: "半个月",
            },
          ],
        },
        {
          label: "所有选项",
          options: [
            {
              value: 0,
              label: "全部",
            },
            {
              value: 1,
              label: "1天",
            },
            {
              value: 2,
              label: "2天",
            },
            {
              value: 3,
              label: "3天",
            },
            {
              value: 4,
              label: "4天",
            },
            {
              value: 5,
              label: "5天",
            },
            {
              value: 7,
              label: "一周",
            },
            {
              value: 15,
              label: "半个月",
            },
            {
              value: 30,
              label: "一个月",
            },
            {
              value: 60,
              label: "两个月",
            },
            {
              value: 90,
              label: "三个月",
            },
            {
              value: 180,
              label: "半年",
            },
            {
              value: 365,
              label: "一年",
            },
          ],
        },
      ],
    };
  },
  mounted() {
    this.getResource();
  },
  computed: {
    itemWidth() {
      return 138 * 0.5 * (document.documentElement.clientWidth / 375);
      // #rem布局 计算宽度
    },
    gutterWidth() {
      return 9 * 0.5 * (document.documentElement.clientWidth / 375);
      // #rem布局 计算x轴方向margin(y轴方向的margin自定义在css中即可)
    },
  },
  // 下边的内容没有用到，需要的小伙伴可以看文档了解，如果需求后续回更新
  methods: {
    handleSelect(key, keyPath) {
     this.searchParm.travelType=key;
     this.getResource();
    },
    selectDay(val){
     this.searchParm.travelDay=val;
     this.getResource();
    },

    search() {
      this.searchParm.city = this.context;
      this.getResource();
    },
    changValue(index) {
      this.searchParm.travelType = index;
      this.getResource();
    },
    handleSizeChange(val) {
      console.log(val);
      this.pageSize = val;
      this.getResource();
    },
    handleCurrentChange(val) {
      console.log(val);
    },
    getResource() {
      this.loading = true;
      let that = this;
      let currentUserId = "";
      if (this.$store.state.user) {
        currentUserId = this.$store.state.user.userId;
      } else {
        currentUserId = 0;
      }
      this.$axios({
        url: "/resources/getStrategyList",
        method: "get",
        params: {
          pageSize: this.pageSize,
          currentPage: this.currentPage,
          city: that.searchParm.city,
          travelType: that.searchParm.travelType,
          travelDay: that.searchParm.travelDay,
          uId: currentUserId,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            console.log(res.data.data);
            this.strategyList = res.data.data.list;
            this.currentTotal = res.data.data.total;
            this.loading = false;
          } else {
            this.strategyList = [];
            this.currentTotal = 0;
            this.$message({
              message: "没有相关内容！",
              type: "warning",
            });
            this.loading = false;
          }
        })
        .catch((err) => {
          this.$message({
            message: "资源获取失败!请检查",
            type: "error",
          });
          this.loading = false;
        });
    },
  },
};
</script>
<style>
.cont {
  width: 100%;
  height: auto;
  background: #fff;
}
.content {
  margin-left: 1vw;
  margin-top: 2vh;
}
.centerTitle {
  width: 100%;
  height: 51px;
  margin: 30px auto;
  overflow: hidden;
  text-align: center;
  position: relative;
}
.centerTitleBox {
  width: auto;
  height: 51px;
  margin: 0 auto;
  position: absolute;
  top: 0;
  left: 50%;
}
.centerTitleLeft {
  width: 43px;
  height: 51px;
  display: block;
  float: left;
  background: url(http://www.shilin.com.cn/public/protal/images/title-left.png)
    no-repeat center;
  background-size: contain;
}
.centerTitleMiddle {
  width: auto;
  line-height: 51px;
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  color: #19b1b6;
  font-family: "宋体";
  height: 51px;
  display: block;
  float: left;
  background: url(http://www.shilin.com.cn/public/protal/images/title-middle.png)
    no-repeat;
  background-size: cover;
  box-sizing: border-box;
}
.centerTitleRight {
  width: 43px;
  height: 51px;
  display: block;
  float: left;
  background: url(http://www.shilin.com.cn/public/protal/images/title-right.png)
    no-repeat center;
  background-size: contain;
}
</style>
