<template>
  <div class="contner">
    <div class="notCont">
      <el-page-header @back="goBack" content="详情页面"> </el-page-header>
       <el-divider content-position="left">公告新闻</el-divider>
      <el-row>
        <el-col :span="17">
          <div class="notCont-left">
            <div class="detailLeftTitle">
              <h3 class="detailTitleTop">{{detail.title}}</h3>
              <p class="detailTitleContent">
                <!-- <span>作者：　</span>
                <span>来源：石林彝族自治县人民政府　</span> -->
                <span>{{ detail.creatDate | dateFmt("YYYY-MM-DD")}}</span>
              </p>
            </div>
            <div v-html="detail.content" class="textCont"></div>
          </div>
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
      noticeId: 0,
      newsId:0,
      detail: {
        id:0,
        title: "五一期间，系统全面支持，祝大家五一假期快乐",
        creatDate: new Date(),
        content:
          '<p data-v-6d85db2d=""></p><p style="text-align:left;">尊敬的游客朋友：</p><p style="text-align:left;">根据各级疫情防控部门和文旅部门的指导意见及相关指示精神，全面落实“两手抓”“两条线”作战思想，未来以来石林喀斯特地质科研博物馆和未来以来珍宝三宫（原未来以来·珍宝主题公园）在做好相关疫情防控措施和应急预案的情况下，经相关部门批准，将有序恢复开放，现公告如下：</p><p style="text-align:left;">一、 恢复开放时间</p><p style="text-align:left;">2020年3月26日恢复开放，每日开放时间为8:00-18:00。</p><p style="text-align:left;">二、 恢复开放区域</p><p style="text-align:left;">未来以来石林喀斯特地质科研博物馆和未来以来珍宝三宫（原未来以来·珍宝主题公园)，珍宝三宫包括中华祖母绿宫、中华发光石宫、中华碧玺宫。</p><p style="text-align:left;">三、 景区特别优惠政策</p><p style="text-align:left;">1．为向广大医务工作者致敬，景区自恢复开放之日起至2020年至12月31日对全国医务工作者（医师证、护士证等有效证件）免票参观。</p><p style="text-align:left;">2．持石林风景区门票参观未来以来石林喀斯特地质科研博物馆。</p><p style="text-align:left;">3. 2020年3月26日至2020年12月31日，未来以来珍宝三宫门票实行半价优惠（原全票价：98元/人，现活动价：49元/人），且推出特惠套票：三人套票98元/套（三免一）、五人套票148元/套（五免二）；符合免票条件的给予免票。</p><p style="text-align:left;">四、 景区游览须知</p><p style="text-align:left;">1．游客在购票前，可关注“云南未来以来文化传播有限公司”官方微信公众号和未来以来景区官网，了解景区开放政策。</p><p style="text-align:left;">2．游客采取实名制购票入园参观。为减少风险，景区提倡网上购票和自助购票，线上购票平台：“未来以来 珍宝主题公园”微信公众号。</p><p style="text-align:left;">3．所有游客进入景区必检，实行“一人一进一扫一测一消毒”制度，要求进出扫描“云南抗疫情”二维码并出示扫描结果，对所有到景区游览人员进行“云南健康申报”健康码检查和体温监测，如实填报姓名、身份证号、联系方式等本人信息，健康码为绿码和体温正常的准予到景区游览；对未佩戴口罩和不配合景区工作的游客景区将严禁入园；对体温检测异常、咳嗽等可疑症状人员，景区将采取相应的隔离措施。</p>',
      },
    };
  },
  mounted() {    
    if(this.$route.query.noticeId&&this.$route.query.noticeId!=null&&this.$route.query.noticeId!=''){
      this.noticeId=this.$route.query.noticeId;
      this.getNoticeById();
    }else if(this.$route.query.newsId&&this.$route.query.newsId!=null&&this.$route.query.newsId!=''){
       this.newsId=this.$route.query.newsId;
       this.getNewsById();
    }else{
      // this.$message({
      //       message: "资源获取失败!请检查",
      //       type: "error",
      //     });
    }


    console.log(this.$route)
    console.log(this.$route.params)
  },
  methods: {
    getNoticeById() {
      let that=this;
      this.$axios({
        url: "/resources/getNoticeById",
        method: "get",
        params:{
          noticeId:that.noticeId,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            this.detail.id=res.data.data.noticeId;
            this.detail.title=res.data.data.noticeTitle;
            this.detail.creatDate=res.data.data.createTime;
            this.detail.content=res.data.data.noticeCont;
          } else {
            this.$message({
              message: "资源获取失败!请检查",
              type: "error",
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
     getNewsById() {
       let that=this;
      this.$axios({
        url: "/resources/getNewsById",
        method: "get",
        params:{
          newsId:that.newsId,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
           this.detail.id=res.data.data.newsId;
            this.detail.title=res.data.data.newsTitle;
            this.detail.creatDate=res.data.data.createTime;
            this.detail.content=res.data.data.newsCont;
          } else {
            this.$message({
              message: "资源获取失败!请检查",
              type: "error",
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
    goBack() {
      this.$router.go(-1);
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
</style>