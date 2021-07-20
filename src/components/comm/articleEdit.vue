<template>
  <div class="container">
    <div class="button">
    <el-button
      type="success"
      icon="el-icon-check"
      circle
      @click="getEditorData"
      size="mini"
    ></el-button>
    </div>
    <!-- <quill-editor
      ref="myTextEditor"
      v-model="content"
      :options="editorOption"
      style="height: 2000px; width: 80%; margin: 20px auto 100px auto;"
    ></quill-editor> -->
    <div id="editor" class="editor">
      <p v-html="edit"></p>
    </div>
  </div>
</template>

<script>
import E from "wangeditor";
export default {
  data() {
    return {
      editor: null,
      title: "",
      editorData: "",
      editorOption: {},
    };
  },
  mounted() {
    const baseUrl = this.$axios.baseURL;
    const editor = new E("#editor");
    // 或者;
    // const editor = new E(document.getElementById("div1"));
    editor.config.onchange = (newHtml) => {
      this.editorData = newHtml;
    };
    editor.config.placeholder = '编辑完成请先保存'
    editor.config.uploadFileName = "files"; //设置文件上传的参数名称
    editor.config.uploadImgServer = baseUrl + "/filesController/upFiles"; // 上传图片到服务器
    editor.config.uploadVideoServer =  baseUrl + "/filesController/upVideo";// 上传视频到服务器
    editor.config.uploadVideoName = 'video';
    editor.config.height = 1500;
    editor.config.uploadImgMaxLength = 10; //最大上传数量
    editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp','jfif']
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
        if(result.code===0){
for (var j = 0; j < result.data.length; j++) {
          insertImg(baseUrl + result.data[j]);
        }
        }else{
         this.$message({
        message: "上传失败!请检查",
        type: "error",
      });
        }
        
      },
    };
    editor.config.uploadVideoHooks = {
    // 上传视频之前
    before: function(xhr) {
        console.log(xhr)

        // 可阻止视频上传
        // return {
        //     prevent: true,
        //     msg: '需要提示给用户的错误信息'
        // }
    },
    // 视频上传并返回了结果，视频插入已成功
    success: function(xhr) {
        console.log('success', xhr)
    },
    // 视频上传并返回了结果，但视频插入时出错了
    fail: function(xhr, editor, resData) {
        console.log('fail', resData)
    },
    // 上传视频出错，一般为 http 请求的错误
    error: function(xhr, editor, resData) {
        console.log('error', xhr, resData)
    },
    // 上传视频超时
    timeout: function(xhr) {
        console.log('timeout')
    },
    // 视频上传并返回了结果，想要自己把视频插入到编辑器中
    // 例如服务器端返回的不是 { errno: 0, data: { url : '.....'} } 这种格式，可使用 customInsert
    customInsert: function(insertVideoFn, result) {
        // result 即服务端返回的接口
        console.log('customInsert', result)

        // insertVideoFn 可把视频插入到编辑器，传入视频 src ，执行函数即可
        insertVideoFn(baseUrl+result.data)
    }
}
    //自己定义上传的方法
    // editor.config.customUploadImg = function (resultFiles, insertImgFn) {
    //     // resultFiles 是 input 中选中的文件列表
    //     // insertImgFn 是获取图片 url 后，插入到编辑器的方法

    //     //创建 FormData 对象来处理数据：键值对的形式，键可以重复
    //     var formData = new FormData();
    //     for (var i = 0; i < resultFiles.length; i++) {
    //         //将表单中的数据取出来，添加到file中
    //         formData.append("file", resultFiles[i]);
    //     }
    //     //使用AJAX上传图片
    //     that.$axios({
    //         url:"/filesController/upFiles",
    //         type: "POST",
    //         data: formData,
    //         async: false,//不发送异步请求
    //         cache: false,//浏览器将不缓存此页面
    //         //不设置Content-Type时，浏览器的值: application/x-www-form-urlencoded; charset=UTF-8
    //         //设置contentType: false时，浏览器的值：application/json
    //         contentType: false,
    //         processData: false,//我们需要发送DOM信息
    //         success: function (res) {
    //             //处理成功后
    //             if (res.errno == 0) {
    //                 for (var j = 0; j < res.data.length; j++) {
    //                     // 上传图片，返回结果，将图片插入到编辑器中
    //                     insertImgFn(res.data[j]);
    //                 }
    //             } else {
    //                 alert(res.msg);
    //                 return;
    //             }
    //         }
    //     });
    // }
    editor.create();
    this.editor = editor;
  },
  methods: {
    onEditorChange({ editor, html, text }) {
      this.content = html;
    },
    createEditor() {
      let that = this;
    },
    getEditorData() {
      // 通过代码获取编辑器内容
      let data = this.editor.txt.html();
      console.log(data)
    },
    beforeDestroy() {
      // 调用销毁 API 对当前编辑器实例进行销毁
      this.editor.destroy();
      this.editor = null;
    },
    exportArtic() {
      console.log(this.content);
      this.$axios({
        url: "/article/saveArticle",
        method: "post",
        data: {
          content: this.content,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.code === 0) {
            console.log(res.data.data);
            this.setClient(res.data.data);
            this.setClientToken(res.data.data.userPhone);
            this.$message({
              message: "登录成功",
              type: "success",
            });
            this.$router.push("/");
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
  },
};
</script>

<style scoped lang='less'>
.container {
  margin: 0 auto;
  position: relative;
  padding: 0 auto;
}

.button{
  width: 100%;
  margin-right: 40px;
  text-align: right;
}

.editor{
  width: 90%;
  margin:10px auto auto auto;
}
</style>
