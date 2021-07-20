<template>
  <div class="container">
    <div class="cont">
      <el-form ref="articleForm" :model="articleFrom" label-width="80px">
        <el-form-item label="景点名称">
          <div style="width: 80%; float: left">
            <el-input v-model="articleFrom.sightsName"></el-input>
          </div>
          <div style="width: 20%; float: left">
            <el-button type="primary" @click="submitData">保存</el-button>
          </div>
        </el-form-item>
        <el-form-item label="简介">
          <el-input
            type="textarea"
            v-model="articleFrom.sightDetail"
          ></el-input>
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
            <el-form-item label="封面" prop="">
              <el-upload
                :action="$axios.baseURL + baseUpUrl"
                list-type="picture-card"
                name="files"
                :limit="1"
                :on-success="handleSuccess"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :file-list="fileList"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="" />
              </el-dialog>
            </el-form-item>
          </el-col>
          <el-col :span="12"
            ><el-form-item label="视频上传" prop="Video">
              <!-- action必选参数, 上传的地址 -->
              <el-upload
                class="avatar-uploader el-upload--text"
                :action="uploadUrl"
                name="video"
                :show-file-list="false"
                :on-success="handleVideoSuccess"
                :before-upload="beforeUploadVideo"
                :on-progress="uploadVideoProcess"
              >
                <video
                  v-if="articleFrom.aboutVideo != '' && videoFlag == false"
                  :src="$axios.baseURL + articleFrom.aboutVideo"
                  height="100%"
                  class="avatar"
                  controls="controls"
                >
                  您的浏览器不支持视频播放
                </video>
                <i
                  v-else-if="articleFrom.aboutVideo == '' && videoFlag == false"
                  class="el-icon-plus avatar-uploader-icon"
                ></i>
                <el-progress
                  v-if="videoFlag == true"
                  type="circle"
                  :percentage="videoUploadPercent"
                  style="margin-top: 30px"
                ></el-progress>
              </el-upload>
              <P class="text">请保证视频格式正确</P>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <div id="editor" class="editor">
            <p></p>
          </div>
        </el-row>
      </el-form>
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
        sightsId: "",
        sightsName: "",
        sightDetail: "",
        author: "",
        city: "",
        headerImg: "",
        aboutVideo: "",
        article: "",
      },
      //提交地址
      uploadUrl: this.$axios.baseURL + "/filesController/upVideo",
      //
      videoFlag: false,
      //进度条
      videoUploadPercent: 0,
      baseUpUrl: "/filesController/upFiles",
      dialogImageUrl: "",
      dialogVisible: false,
      restaurants: [],
      editorData: "",
      editorOption: {},
      mapdialogVisable: false,
      //凑合用
      cityName: "",
      isSalf: true,
      fileList:[],
    };
  },
  mounted() {
    this.createEditor();
    this.getCityList();
    // this.loadUser();
    if (this.$route.query.sightsId) {
      this.articleFrom.sightsId = this.$route.query.sightsId;
      this.getsights(this.$route.query.sightsId);
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
      this.articleFrom.headerImg = res.data[0];
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
    beforeUploadVideo(file) {
      if (
        [
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/wmv",
          "video/rmvb",
        ].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }
    },
    getsights(id) {      
      this.$axios({
        url: "/admin/getSightById",
        method: "get",
        params: {
          sightsId: id,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            console.log(res.data.data);
            this.articleFrom = res.data.data;
            let list={
                name:res.data.data.headerImg,
                url:this.$axios.baseURL+res.data.data.headerImg,
            }
            this.fileList.push(list);
            this.editor.txt.append(res.data.data.article);
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

    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = parseInt(file.percentage.toFixed(0));
    },
    handleVideoSuccess(res, file) {
      //获取上视频地址
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      console.log(res);
      if (res.code == 0) {
        //this.videoForm.videoUploadId = res.data.uploadId;
        this.articleFrom.aboutVideo = res.data;
      } else {
        this.$message.error("视频上传失败，请重新上传！");
      }
    },
    noticDtail(item) {
      console.log(item.noticeId);
    },
    goBack() {
      this.$router.go(-1);
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
      this.articleFrom.citys = item.cityId;
      console.log(item);
    },

    submitData() {
      this.articleFrom.article = this.editor.txt.html();
      this.$axios({
        url: "/admin/updateSights",
        method: "put",
        data: this.articleFrom,
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
      if (!this.$route.query.adminId && this.$store.state.admin) {
        this.articleFrom.author = this.$store.state.admin.adminId;
      } else if (
        this.$route.query.adminId &&
        this.$store.state.admin.adminId === this.$route.query.uId
      ) {
        this.articleFrom.author = this.$route.query.adminId;
      } else if (
        this.$route.query.adminId &&
        this.$store.state.admin.adminId != this.$route.query.adminId
      ) {
        this.isSalf = false;
        this.articleFrom.author = this.$route.query.adminId;
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
