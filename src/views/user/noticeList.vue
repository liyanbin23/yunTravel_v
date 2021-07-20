<template>
  <div class="contner">
    <div class="notCont">
      <el-page-header @back="goBack" content="详情页面"> </el-page-header>
      <el-divider content-position="right">公告新闻</el-divider>
      <el-row>
        <el-col :span="17">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="最新公告" name="first">
              <div class="notCont-left">
                <ul class="noticLi">
                  <li v-for="(item, index) in notice" :key="index">
                    <router-link
                      :to="{
                        path: '/noticeView',
                        query: { noticeId: item.noticeId },
                      }"
                      ><font
                        style="
                          font-family: 华文仿宋;
                          text-align: left;
                          font-size: 18px;
                          color: rgb(156, 188, 247);
                        "
                        >{{ item.noticeTitle }}</font
                      >
                      <font
                        style="
                          font-family: 华文仿宋;
                          text-align: left;
                          font-size: 16px;
                          color: rgb(156, 188, 247);
                          float: right;
                          margin-right: 10px;
                        "
                        >{{ item.createTime | dateFmt("YYYY-MM-DD") }}</font
                      >
                      <div v-html="item.noticeCont" class="textCont"></div>
                    </router-link>
                    <el-divider></el-divider>
                  </li>
                </ul>
                <el-pagination
                  @size-change="noticeSizeChange"
                  @current-change="noticeCurrentChange"
                  :current-page="noticeCurrentPage"
                  :page-sizes="[5, 10, 15, 20]"
                  :page-size="noticePageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="noticeTotal"
                /></div
            ></el-tab-pane>
            <el-tab-pane label="最新新闻" name="second"
              ><div class="notCont-left">
                <ul class="noticLi">
                  <li v-for="(item, index) in news" :key="index">
                    <router-link
                    v-if="!item.newsPath"
                      :to="{
                        path: '/noticeView',
                        query: { newsId: item.newsId },
                      }"
                      ><font
                        style="
                          font-family: 华文仿宋;
                          text-align: left;
                          font-size: 18px;
                          color: rgb(156, 188, 247);
                        "
                        >{{ item.newsTitle }}</font
                      >
                      <font
                        style="
                          font-family: 华文仿宋;
                          text-align: left;
                          font-size: 16px;
                          color: rgb(156, 188, 247);
                          float: right;
                          margin-right: 10px;
                        "
                        >{{ item.createTime | dateFmt("YYYY-MM-DD") }}</font
                      >
                      <div v-html="item.newsCont" class="textCont"></div>
                    </router-link>
                     <a
                       v-else
                      :href="item.newsPath" target="_blank"
                      ><font
                        style="
                          font-family: 华文仿宋;
                          text-align: left;
                          font-size: 18px;
                          color: rgb(156, 188, 247);
                        "
                        >{{ item.newsTitle }}</font
                      >
                      <font
                        style="
                          font-family: 华文仿宋;
                          text-align: left;
                          font-size: 16px;
                          color: rgb(156, 188, 247);
                          float: right;
                          margin-right: 10px;
                        "
                        >{{ item.createTime | dateFmt("YYYY-MM-DD") }}</font
                      >
                      <div v-html="item.newsCont" class="textCont"></div>
                    </a>
                    <el-divider></el-divider>
                  </li>
                </ul>
                <el-pagination
                  @size-change="newsSizeChange"
                  @current-change="newsCurrentChange"
                  :current-page="newsCurrentPage"
                  :page-sizes="[5, 10, 15, 20]"
                  :page-size="newsPageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="newsTotal"
                /></div
            ></el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="7">
          <div style="background-color: green">gg</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //默认第一个
      activeName: "first",
      noticeTotal: 10,
      noticePageSize: 10,
      noticeCurrentPage: 1,
      newsTotal: 10,
      newsPageSize: 10,
      newsCurrentPage: 1,

      notice: [],
      news: [],
    };
  },
  mounted() {
    this.getAllNotice();
    this.getAllNews();
  },
  methods: {
    getAllNotice() {
      let that = this;
      this.$axios({
        url: "/resources/getAllNotice",
        method: "get",
        params: {
          pageSize: that.noticePageSize,
          currentPage: that.noticeCurrentPage,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            this.notice = res.data.data.list;

            this.noticeTotal = res.data.data.total;
          } else {
            this.$message({
              message: "资源获取失败!请检查",
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: "资源获取失败!请检查",
            type: "error",
          });
        });
    },
    getAllNews() {
      let that = this;
      this.$axios({
        url: "/resources/getAllNews",
        method: "get",
        params: {
          pageSize: that.newsPageSize,
          currentPage: that.newsCurrentPage,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            this.news = res.data.data.list;
            this.newsTotal = res.data.data.total;
          } else {
            this.$message({
              message: "资源获取失败!请检查",
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: "资源获取失败!请检查",
            type: "error",
          });
        });
    },

    goBack() {
      this.$router.go(-1);
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    noticeSizeChange(val) {
      console.log(val);
      this.noticePage.pageSize = val;
      this.getResource();
    },
    noticeCurrentChange(val) {
      console.log(val);
    },
    newsSizeChange(val) {
      console.log(val);
      this.pageSize = val;
      this.getResource();
    },
    newsCurrentChange(val) {
      console.log(val);
    },
  },
};
</script>
<style scoped>
.contner {
  width: 100%;
  margin-top: 10px;
  position: relative;
}
.notCont {
  width: 70%;
  text-align: center;
  padding: 10px auto;
  margin: 10px auto;
}
.notCont-left {
  border-right: 1px solid #e6e6e6;
}
.textCont {
  margin-right: 8px;
  width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 15px;
  font-family: 华文仿宋;
}
.detailLeftTitle {
  width: 100%;
  min-height: 130px;
  padding: 30px 0px;
  box-sizing: border-box;
  overflow: hidden;
}
.detailTitleTop {
  width: 100%;
  min-height: 25px;
  line-height: 30px;
  font-size: 22px;
  color: #545454;
  overflow: hidden;
  text-align: center;
}
.detailTitleContent {
  width: 100%;
  min-height: 20px;
  line-height: 20px;
  font-size: 16px;
  color: #989898;
  margin-top: 20px;
  overflow: hidden;
  text-align: center;
}
.noticLi {
  list-style: none;
}
ul {
  padding-inline-start: 10px;
}
li {
  padding-top: 15px;
  display: list-item;
  text-align: left;
  margin-left: 10px;
}
a {
  text-decoration: none;
}
.router-link-active {
  text-decoration: none;
}
</style>