<template>
  <div class="container">
    <div class="cont">
    <el-page-header @back="goBack" content="个人中心"> </el-page-header>
      <el-divider content-position="left">个人简介</el-divider>
      <el-form ref="articleForm" :model="articleFrom" label-width="80px">                
        <el-row>
          <div id="editor" class="editor">
            <p></p>
          </div>
        </el-row>
        <el-form-item >          
             <el-button @click="submitDetail" type="primary">提交</el-button>      
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import E from "wangeditor";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      editor: null,
      articleFrom: {
        title:'',
        path:'',
        conetnt:'',
      },
      users:{},
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
    };
  },
  mounted() {
     if (this.$store.state.user) {
         this.users=this.$store.state.user;
     }else{
         this.router.push('/login');
     }
     this.createEditor();
  },
  methods: {
      ...mapMutations({
      setClient: "SET_CLIENT",
      setClientToken: "SET_CLIENT_TOKEN",
    }),
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
      editor.config.height = 800;
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


    submitDetail() {
        let cruser = this.users;       
        cruser.safeDetail =this.editor.txt.html();       
      this.$axios({
        url: "/user/updateUser",
        method: "put",
        data:cruser,
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
           // that.users.usImage=that.editUser.usImage;
            this.setClient(res.data.data);
            this.setClientToken(res.data.data.userPhone);
            this.goBack();            
          } else {
            this.$message({
              message: "资源获取失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: "资源获取失败",
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
        this.articleFrom.author= this.$route.query.adminId;
      } else {
        this.$message({
          message: "参数错误!请检查",
          type: "error",
        });
      }
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
