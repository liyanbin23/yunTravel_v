<template>
  <div class="cont">
    <el-main>
      <Banner></Banner>
      <el-row type="flex" :gutter="20">
        <el-col :span="20">
          <el-row type="flex" :gutter="20">
            <el-col :span="13">
              <el-menu
                default-active=""
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
              >
                <el-menu-item index="">全部</el-menu-item>
                <el-menu-item index="昆明">昆明</el-menu-item>
                <el-menu-item index="大理">大理</el-menu-item>
                <el-menu-item index="丽江">丽江</el-menu-item>
                <el-menu-item index="楚雄">楚雄</el-menu-item>
                <el-menu-item index="瑞丽">瑞丽</el-menu-item>
                <el-menu-item index="西双版纳">西双版纳</el-menu-item>
              </el-menu>
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
                <span class="centerTitleMiddle">旅游景区</span>
                <span class="centerTitleRight"></span>
              </div>
            </div></el-row>
            <el-row type="flex" :gutter="20">
            <el-container
              v-loading="loading"
              direction="vertical"
              element-loading-text="拼命加载中"
              element-loading-background="rgba(0,0,0,0.1)"
            >
              <waterfall :col="3" :data="data">
                <template>
                  <div
                    class="content"
                    v-for="(item, index) in data"
                    :key="index"
                  >
                    <SightsView
                      :id="item.sightsId"
                      :imgUrl="item.headerImg"
                      :detal="item.sightDetail"
                      :viewes="item.viewsNum"
                      :sightName="item.sightsName"
                      :date="item.createDate"
                      :grade="parseFloat(item.grade)"
                    />
                  </div>
                </template>
              </waterfall>
            </el-container>
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
import Banner from "@/components/comm/banner.vue";
import SightsView from "@/components/comm/sightsView.vue";
// import  vPage from "v-page";
export default {
  components: {
    Banner,
    SightsView,
    // vPage,
  },
  data() {
    return {
      //加载内容
      loading: false,
      currentTotal: 20,
      pageSize: 10,
      currentPage: 1,
      data: [],
      option: [{}],
      context: "",
    };
  },
  mounted() {
    if(this.$route.query.val){
      this.context=this.$route.query.val
    }
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
     this.context=key
    this.getResource()
    },
    search() {
      this.getResource()
    },
    handleSizeChange(val) {
       console.log(val);
      this.pageSize=val;
      this.getResource();
    },
    handleCurrentChange(val) {
      console.log(val);
    },
    getResource() {
      this.loading = true;
      this.$axios({
        url: "/resources/getSights",
        method: "get",
        params: {
          key:this.context,
          pageSize: this.pageSize,
          currentPage: this.currentPage,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            console.log(res.data.data);
            this.data = res.data.data.list;
            this.currentTotal=res.data.data.total;
            this.loading = false;
          } else {
            this.data = [];
            this.currentTotal=0;
            this.$message({
              message: "没有相关资源！",
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
