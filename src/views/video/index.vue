<template>
  <div class="home_page">
    <el-header height="40px">
      <el-row :gutter="20">
        <el-col :span="6"><el-button type="primary" @click="dialogFormVisible = true">上传视频</el-button></el-col>
      </el-row>
    </el-header>
    <el-table
      height="600"
      v-if="tableData.length>0"
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        prop="videoName"
        label="视频名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="musicPath"
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="previewVideo(scope.row)">预览</el-button>
          <el-button size="mini" @click="deleteVideo(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 上传视频 -->
    <el-dialog title="上传视频" :visible.sync="dialogFormVisible">
      <el-form status-icon ref="ruleForm" label-width="100px">
        <el-form-item label="视频名称" required>
          <el-input type="text" v-model="videoName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上传视频" required>
          <div style="width: 178px;height: 178px;border: dashed 1px #333;" @click="chickVideoName()">
            <el-upload
              class="avatar-uploader"
              action="http://101.37.24.92/shen-hua/action/uploadVideo"
              :show-file-list="false"
              :data="{'videoName':videoName}"
              :headers="headers"
              :on-success="handleAvatarSuccess"
              :disabled="!videoName"
              :before-upload="beforeAvatarUpload">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 视频预览 -->
    <el-dialog :visible.sync="videoPreviewVisible" @close="closeVideoPreview" width="50%" title="视频预览">
      <video ref="videoPlayer" :src="currentVideoPath" :key="currentVideoPath" controls style="width: 100%; height: 100%;"></video>
    </el-dialog>
  </div>
</template>

<script>
import {getVideoList,deleteVideo} from '@/api/api';
import { getToken } from '@/utils/auth'
import { MessageBox, Message } from 'element-ui'
import MenuList from '../menuList/index.vue';
export default {
    data() {
      return {
        headers: {'Authorization':"Bearer "+ getToken()},
        tableData: [],
        dialogFormVisible: false,
        videoName: "",
        videoPreviewVisible: false,
        currentVideoPath: '',
      };
    },
    mounted(){
      this.getVideoListFun()
    },
    methods: {
      previewVideo(row) {
        if (row.videoUrl) {
          // 设置当前视频路径
          this.currentVideoPath = row.videoUrl;
          // 打开视频预览对话框
          this.videoPreviewVisible = true;
        } else {
          this.$message.error('当前行没有视频路径！');
        }
      },

      // 关闭视频预览对话框时停止播放
      closeVideoPreview() {
        // 获取视频元素
        const videoPlayer = this.$refs.videoPlayer;

        // 暂停视频播放
        videoPlayer.pause();
        // 设置视频路径为空
        // videoPlayer.src = '';
        this.currentVideoPath = "";

        // 关闭视频预览对话框
        this.videoPreviewVisible = false;
      },
      deleteVideo(row){
        var that = this;
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var params = {
            ids: row.id
          }
          deleteVideo(params).then(res=>{
            console.log(res)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            that.getVideoListFun()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        
      },
      chickVideoName(){
        if(!this.videoName){
          Message({
            message: "请先输入视频名",
            type:"error",
          })
          return
        }
      },
      handleAvatarSuccess(res, file) {
        Message({
          message: "上传成功",
          type:"success",
        })
        this.dialogFormVisible = false
        this.videoName = ""
        this.getVideoListFun()
      },
      beforeAvatarUpload(file) {
        console.log(file)
        console.log(file.type)
        const isMp3 = file.type === 'video/mp4';
        if (!isMp3) {
          this.$message.error('上传视频只能是 mp4 格式!');
        }
        return isMp3;
      },
      getVideoListFun(){
        var that = this;
        var params = {

        }
        getVideoList(params).then(res=>{
          that.tableData = res.data
        })
      },
      
    }
  }
</script>

<style lang="scss" scoped>
.passworddialog {
  width: 80%;
  margin: 0 auto;
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
.home_page {
  font-size: 16px;
  line-height: 30px;
  overflow: hidden;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  padding: 20px 20px 0;
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
</style>
