<template>
  <div class="home_page">
    <el-form class="home_page_ul" ref="form" label-width="120px">
      <el-form-item label="公司名:">
        <div class="home_page_ul_li_right">{{ name }}</div>
      </el-form-item>
      <el-form-item label="公司logo:">
        <el-image
          style="width: 100px; height: 100px"
          :src="logoPath"></el-image>
      </el-form-item>
      <el-form-item label="主页背景音乐:">
        <div class="home_page_ul_li_right">{{ info.fileName }}</div>
        <template v-if="info.homeMusic">
          <el-button v-if="!isPlayFlag" size="mini" @click="playMusic">试听</el-button>
          <el-button v-else size="mini" @click="pauseMusic">暂停</el-button>
          <el-button size="mini" type="warning" @click="deleteMusic()">删除</el-button>
        </template>
        <el-button v-else size="mini">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8090/shen-hua/action/uploadHomeMusic"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccessMusic"
            :before-upload="beforeAvatarUploadMusic">
            上传
          </el-upload>
        </el-button>
      </el-form-item>
      <el-form-item label="上传公司logo:">
        <div style="width: 178px;height: 178px;border-radius: 6px;border: 1px dashed #d9d9d9;">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8090/shen-hua/action/upload"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import { MessageBox, Message } from 'element-ui'
import { getInfo } from "@/api/user"
import { deleteHomeMusic, uploadHomeMusic } from "@/api/api"

export default {
  name: 'Dashboard',
  data() {
    return {
      fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      imageUrl: '',
      headers: {'Authorization':"Bearer "+ getToken()},
      info: {
        homeMusic: "",
        fileName: "",
      },
      isPlayFlag: false,
      audio: new Audio(),
    }
  },
  computed: {
    ...mapGetters([
      'logoPath',
      "name"
    ])
  },
  mounted(){
    this.getInfoFun()
  },
  methods: {
    playMusic() {
      // Set the source of the audio element to the music URL
      this.audio.src = this.info.homeMusic;
      // Play the audio
      this.audio.play();
      this.isPlayFlag = true; // Set the play flag to true
    },

    pauseMusic() {
      // Pause the audio
      this.audio.pause();
      this.isPlayFlag = false; // Set the play flag to false
    },
    deleteMusic() {
      // Implement your delete music logic here
      // Stop the audio when deleting
      this.audio.pause();
      this.isPlayFlag = false; // Set the play flag to false

      this.$confirm('此操作将永久删除该音乐文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteHomeMusic().then(res=>{
          console.log(res)
          if(res.code=="200"){
            Message({
              type: "success",
              message: "删除成功"
            })
            this.getInfoFun()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    handleAvatarSuccessMusic(res, file) {
      Message({
        message: "上传成功",
        type:"success",
      })
      this.getInfoFun()
    },
    beforeAvatarUploadMusic(file) {
      console.log(file)
      console.log(file.type)
      const isMp3 = file.type === 'audio/mpeg';
      // const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isMp3) {
        this.$message.error('上传音乐只能是 mp3 格式!');
      }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!');
      // }
      return isMp3;
    },
    getInfoFun(){
      var that = this;
      var params = {

      }
      getInfo(params).then(res=>{
        console.log(res)
        if(res.code=="200"){
          const urlParts = res.data.homeMusic.split("/");
          const fileName = urlParts[urlParts.length - 1];
          that.info = res.data
          that.info.fileName = fileName
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      Message({
        message: '上传成功',
        type: 'success'
      })
      location.reload()
    },
    beforeAvatarUpload(file) {
      console.log(file)
      const isJPG = file.type === 'image/jpeg'||'image/jpg'||'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG或者png 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
  
}
</script>

<style lang="scss" scoped>
.home_page {
  font-size: 16px;
  line-height: 30px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  .home_page_ul {
    width: 50%;
    .home_page_ul_li {
      display: flex;
      align-items: center;

      .home_page_ul_li_left {
        width: 15%;
      }
      .home_page_ul_li_right {

      }
    }
  }
  
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
