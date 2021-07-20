<template>
  <div class="container">
    <div class="cont">
      <el-row>
        <el-col :span="4">
          <div class="uCard">
            <el-card :body-style="{ padding: '5px' }">
              <div class="user">
                <el-avatar
                  :size="60"
                  :src="$axios.baseURL+$store.state.user.usImage"
                ></el-avatar>
                <p>{{$store.state.user.nickName}}</p>
                <div class="user-info">
                  <p>用户等级：{{$store.state.user.grade}}</p>
                  <p>邮箱：{{$store.state.user.email}}</p>
                  <p>电话：{{$store.state.user.userPhone}}</p>
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="20">
          <el-form ref="articleForm" :model="articleFrom" label-width="80px">
            <el-form-item label="标题">
              <el-input v-model="articleFrom.titles"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="主要城市">
                  <el-autocomplete
                    class="inline-input"  
                    v-model="cityName"                
                    :fetch-suggestions="querySearch"
                    placeholder="请务必选择下列城市"
                    value-key="cityName"
                    :trigger-on-focus="true"
                    @select="handleSelect"
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item label="旅游期">
                  <el-select
                    v-model="articleFrom.travelDays"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in travelDayOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="人均消费">
                  <el-input v-model="articleFrom.expen"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="mapdialogVisable = true"
                    >打开地图规划路线图</el-button
                  >
                  <el-dialog
                    title="地图路线(单击开始绘画，单击拖拽可移动地图)"
                    :visible="mapdialogVisable"
                    width="80%"
                    center
                  >
                    <baidu-map
                      class="map"
                      :center="center"
                      :zoom="17"
                      :scroll-wheel-zoom="true"
                      :double-click-zoom="true"
                      :auto-resize="true"
                      @ready="ready"
                      @mousemove="syncPolyline"
                      @click="paintPolyline"
                      @rightclick="newPolyline"
                    >
                      <bm-polyline
                        :path="item"
                        v-for="(item, index) in polyline.paths"
                        :key="index"
                        stroke-color="blue"
                        :stroke-opacity="0.5"
                        :stroke-weight="2"
                        :editing="syncPolyline.editing"
                      ></bm-polyline>
                    </baidu-map>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="clearMapRouter">清 空</el-button>
                      <el-button
                        type="primary"
                        @click="mapdialogVisable = false"
                        >确 定</el-button
                      >
                    </span>
                  </el-dialog>
                </el-form-item>
              </el-col>
              <el-col :span="12"
                ><el-form-item label="封面" prop="">
                  <el-upload
                    :action="$axios.baseURL + baseUpUrl"
                    list-type="picture-card"
                    name="files"
                    :limit="1"
                    :on-success="handleSuccess"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="" />
                  </el-dialog>
                </el-form-item>
                <el-button type="primary" @click="submitData">保存</el-button>
              </el-col>
            </el-row>
            <el-row>
              <div id="editor" class="editor">
                <p></p>
              </div>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import E from "wangeditor";
export default {
  data() {
    return {
      editor: null,
      articleFrom: {
        strategyId: "",
        userId: "",
        titles: "",
        headImg: "",
        citys: "",
        router: "",
        expen: "",
        travelDays: "",
        articleCont: "",
      },
      baseUpUrl: "/filesController/upFiles",
      dialogImageUrl: "",
      dialogVisible: false,
      restaurants: [],
      editorData: "",
      editorOption: {},
      mapdialogVisable: false,
      //凑合用
      cityName:'',

      polyline: {
        editing: true,
        paths: [],
      },
      center: {
        lng: 102.849095,
        lat: 24.875331,
      },
      isSalf: true,
      travelDayOptions: [
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
    };
  },
  mounted() {
    this.createEditor();
    this.getCityList();
    this.loadUser();
    if (this.$route.query.strategyId) {
      this.articleFrom.strategyId = this.$route.query.strategyId;
    }
  },
  methods: {
    onEditorChange({ editor, html, text }) {
      this.content = html;
    },
    //编辑器创建方法
    createEditor() {
      const baseUrl = this.$axios.baseURL;
      const editor = new E("#editor");
      // 或者;
      // const editor = new E(document.getElementById("div1"));
      editor.config.onchange = (newHtml) => {
        this.editorData = newHtml;
      };
      editor.config.zIndex = 0;
      editor.config.placeholder = "编辑完成请先保存";
      editor.config.uploadFileName = "files"; //设置文件上传的参数名称
      editor.config.uploadImgServer = baseUrl + "/filesController/upFiles"; // 上传图片到服务器
      editor.config.uploadVideoServer = baseUrl + "/filesController/upVideo"; // 上传视频到服务器
      editor.config.uploadVideoName = "video";
      editor.config.height = 1500;
      editor.config.uploadImgMaxLength = 10; //最大上传数量
      editor.config.uploadImgAccept = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "bmp",
        "webp",
        "jfif",
      ];
      editor.config.uploadImgMaxSize = 3 * 1024 * 1024; // 将图片大小限制为 3M
      //自定义上传图片事件
      editor.config.uploadImgHooks = {
        before: function (xhr, editor, files) {},
        success: function (xhr, editor, result) {
          console.log("上传成功");
        },
        fail: function (xhr, editor, result) {
          console.log("上传失败,原因是" + result);
        },
        error: function (xhr, editor) {
          console.log("上传出错");
        },
        timeout: function (xhr, editor) {
          console.log("上传超时");
        },
        customInsert: function (insertImg, result, editor) {
          // insertImg 是插入图片的函数，editor 是编辑器对象，
          // result 是服务器端返回的结果必须是一个JSON格式字符串,多个图片地址组成的数组
          console.log(result);
          if (result.code === 0) {
            for (var j = 0; j < result.data.length; j++) {
              insertImg(baseUrl + result.data[j]);
            }
          } else {
            this.$message({
              message: "上传失败!请检查",
              type: "error",
            });
          }
        },
      };
      editor.config.uploadVideoHooks = {
        // 上传视频之前
        before: function (xhr) {
          console.log(xhr);

          // 可阻止视频上传
          // return {
          //     prevent: true,
          //     msg: '需要提示给用户的错误信息'
          // }
        },
        // 视频上传并返回了结果，视频插入已成功
        success: function (xhr) {
          console.log("success", xhr);
        },
        // 视频上传并返回了结果，但视频插入时出错了
        fail: function (xhr, editor, resData) {
          console.log("fail", resData);
        },
        // 上传视频出错，一般为 http 请求的错误
        error: function (xhr, editor, resData) {
          console.log("error", xhr, resData);
        },
        // 上传视频超时
        timeout: function (xhr) {
          console.log("timeout");
        },
        // 视频上传并返回了结果，想要自己把视频插入到编辑器中
        // 例如服务器端返回的不是 { errno: 0, data: { url : '.....'} } 这种格式，可使用 customInsert
        customInsert: function (insertVideoFn, result) {
          // result 即服务端返回的接口
          console.log("customInsert", result);

          // insertVideoFn 可把视频插入到编辑器，传入视频 src ，执行函数即可
          insertVideoFn(baseUrl + result.data);
        },
      };
      editor.create();
      this.editor = editor;
    },
    getEditorData() {
      // 通过代码获取编辑器内容
      let data = this.editor.txt.html();
      console.log(data);
    },
    beforeDestroy() {
      // 调用销毁 API 对当前编辑器实例进行销毁
      this.editor.destroy();
      this.editor = null;
    },
    //图片移除
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    //图片放大
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //通过成功回调方法获取图片路径
    handleSuccess(res, file) {
      this.articleFrom.headImg = res.data[0];
    },
    //城市控件搜索
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.cityName
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    //获得map路径
    getMapRouter() {},
    handleSelect(item) {
      this.articleFrom.citys=item.cityId
      console.log(item);
    },
    clearMapRouter() {
      this.polyline.paths = [];
    },

    ready({ BMap, map }) {
      const _this = this; // 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function (r) {
          console.log(r);
          _this.center = { lng: r.longitude, lat: r.latitude }; // 设置center属性值
          _this.autoLocationPoint = { lng: r.longitude, lat: r.latitude }; // 自定义覆盖物
          _this.initLocation = true;
          console.log("center:", _this.center); // 如果这里直接使用this是不行的
        },
        { enableHighAccuracy: true }
      );
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

    submitData() {
      //获得地图的路径数组转为Sting
      this.articleFrom.router=JSON.stringify(this.polyline.paths);
      //获得文本编辑器内容（）
      this.articleFrom.articleCont=this.editor.txt.html();
     this.$axios({
        url: "/strategy/addStrategy",
        method: "put",
        data: this.articleFrom
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {            
            this.$message({
              message: "提交成功，等待管理员审核",
              type: "success",
            });
            this.$router.go(-1);
          } else {
            this.$message({
              message: "登录失败，检查用户名或密码",
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: "登录失败",
            type: "error",
          });
        });
    },

    loadUser() {
      if (!this.$route.query.uId && this.$store.state.user) {
        this.articleFrom.userId = this.$store.state.user.userId;
      } else if (
        this.$route.query.uId &&
        this.$store.state.user.userId === this.$route.query.uId
      ) {
        this.articleFrom.userId = this.$route.query.uId;
      } else if (
        this.$route.query.uId &&
        this.$store.state.user.userId != this.$route.query.uId
      ) {
        this.isSalf = false;
         this.$store.state.user.userId != this.$route.query.uId
      } else {
        this.$message({
          message: "参数错误!请检查",
          type: "error",
        });
      }
    },

    exportArtic() {
      console.log(this.content);
      
    },
    getCityList() {
      this.$axios({
        url: "/resources/getCitiesList",
        method: "get",
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            console.log(res.data.data);
            this.restaurants = res.data.data;
          } else {
            this.$message({
              message: "城市资源获取失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: "城市资源获取失败",
            type: "error",
          });
        });
    },
  },
};
</script>

<style scoped lang='less'>
.container {
  margin: 10vh auto;
  position: relative;
  padding: 0 auto;
}

.button {
  width: 100%;
  margin-right: 40px;
  text-align: right;
}
.map {
  width: 100%;
  height: 500px;
}
.uCard {
  margin-top: 10vh;
  width: 85%;
  margin-left: 1vw;
}
.editor {
  width: 100%;
  margin: 50px auto auto auto;
}
.cont {
  margin: 10px auto;
  width: 80%;
  height: auto;
}
</style>
