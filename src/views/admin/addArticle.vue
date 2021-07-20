<template>
  <div class="editor">
    <div class="editCont">
      <el-form ref="videoForm" v-model="videoForm">
        <el-form-item label="视频上传" prop="Video">
          <!-- action必选参数, 上传的地址 -->
          <el-upload
            class="avatar-uploader el-upload--text"
            :action="uploadUrl"
            name='video'
            :show-file-list="false"
            :on-success="handleVideoSuccess"
            :before-upload="beforeUploadVideo"
            :on-progress="uploadVideoProcess"
          >
            <video
              v-if="videoForm.Video != '' && videoFlag == false"
              :src="videoForm.Video"
              class="avatar"
              controls="controls"
            >
              您的浏览器不支持视频播放
            </video>
            <i
              v-else-if="videoForm.Video == '' && videoFlag == false"
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
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //提交地址
      uploadUrl: this.$axios.baseURL + "/filesController/upVideo",
      //
      videoFlag: false,
      //进度条
      videoUploadPercent: 0,
      videoForm: {
        Video: "",
      },
    };
  },
  mounted() {},
  methods: {
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

    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent =parseInt(file.percentage.toFixed(0));
    },
    handleVideoSuccess(res, file) {
      //获取上视频地址
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      console.log(res)
      if (res.code == 0) {
        //this.videoForm.videoUploadId = res.data.uploadId;
        this.videoForm.Video = this.$axios.baseURL+res.data;
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
  },
};
</script>
<style scoped>
.editor {
  width: 100%;
  margin-top: 10px;
  position: relative;
}
.editCont {
  width: 50%;
  margin: 10px auto;
}
</style>