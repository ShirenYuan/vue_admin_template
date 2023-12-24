<template>
  <div class="home_page">
    <el-header height="40px">
      <el-row :gutter="20">
        <el-col :span="6"><el-button type="primary" @click="dialogFormVisible = true">修改资源密码</el-button></el-col>
      </el-row>
    </el-header>
    <el-table
      height="85vh"
      v-if="tableData.length>0"
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        prop="menuName"
        label="资源名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="infoPath"
        label="详情图"
        width="200px"
        >
        <template slot-scope="scope">
          <div style="display: flex; align-items: center;"> 
            <el-image
              style="width: 100px; height: 100px"
              :src="tableData[scope.$index].infoZipPath"
              :preview-src-list="[tableData[scope.$index].infoPath]"
              ></el-image>
              <div style="margin-left: 10px;">
                <el-button size="mini" @click="pauseMusic(scope.$index)">
                  <el-upload
                    class="avatar-uploader"
                    action="http://101.37.24.92/shen-hua/action/uploadInfo"
                    :headers="headers"
                    :data="{'id':tableData[scope.$index].id}"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccessImg"
                    :before-upload="beforeAvatarUploadImg">
                    替换
                  </el-upload>
                </el-button>
              </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="anglePath"
        label="方位图">
        <template slot-scope="scope">
          <el-image
          style="width: 100px; height: 100px"
          :src="tableData[scope.$index].angleZipPath"
          :preview-src-list="[tableData[scope.$index].anglePath]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="musicPath"
        label="背景音乐">
        <template slot-scope="scope">
          <el-button
            v-if="tableData[scope.$index].musicPath && !tableData[scope.$index].isPlaying"
            size="mini"
            @click="playMusic(scope.$index, scope.row)">试听
          </el-button>
          <el-button
            v-else-if="tableData[scope.$index].musicPath && tableData[scope.$index].isPlaying"
            size="mini"
            @click="pauseMusic(scope.$index)">暂停
          </el-button>
          <el-button size="mini" v-if="!tableData[scope.$index].musicPath">
            <el-upload
              class="avatar-uploader"
              action="http://101.37.24.92/shen-hua/action/uploadMusic"
              :data="{'id':tableData[scope.$index].id}"
              :headers="headers"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              上传
            </el-upload>
          </el-button>
          <el-button
            v-else
            size="mini"
            type="warning"
            @click="deleteMusicFun(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="是否加密">
        <template slot-scope="scope">
          <div @click="changeValue(scope.$index,scope.row)">
            <el-switch
              :value="tableData[scope.$index].encrypt"
              active-color="#13ce66"
              inactive-color="#f0f0f0">
            </el-switch>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改资源密码 -->
    <el-dialog title="修改资源密码" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="passworddialog">
        <el-form-item label="旧密码" prop="pass" required>
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass" required>
          <el-input type="password" v-model="ruleForm.newPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass" required>
          <el-input type="password" v-model="ruleForm.checkPass"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="clearFrom()">清空</el-button> -->
        <el-button type="primary" @click="updateFilePasswordFun()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getMenu,updateEncrypt,updateFilePassword,deleteMusic} from '@/api/api';
import { getToken } from '@/utils/auth'
import { MessageBox, Message } from 'element-ui'
export default {
    data() {
      var passValidator = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          // 使用正则表达式验证是否为数字
          const pattern = /^\d+$/;
          if (!pattern.test(value)) {
            callback(new Error('密码只能是数字'));
          } else {
            if (this.ruleForm.checkPass !== '') {
              this.$refs.ruleForm.validateField('checkPass');
            }
            callback();
          }
        }
      };
      var newPassValidator = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('新密码不能为空'));
        } else if (value.length < 6) {
          return callback(new Error('新密码不能少于6位'));
        } else {
          // 使用正则表达式验证是否为数字
          const pattern = /^\d+$/;
          if (!pattern.test(value)) {
            return callback(new Error('新密码只能是数字'));
          } else {
            callback();
          }
        }
      };
      
      var CheckNewPassvalidatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.newPass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        headers: {'Authorization':"Bearer "+ getToken()},
        tableData: [],
        ruleForm: {
          pass: '',
          newPass: '',
          checkPass: '',
        },
        rules: {
          pass: [
            { validator: passValidator, trigger: 'blur' }
          ],
          newPass: [
            { validator: newPassValidator, trigger: 'blur' }
          ],
          checkPass: [
            { validator: CheckNewPassvalidatePass, trigger: 'blur' }
          ]
        },
        dialogFormVisible: false,
        // 记录当前正在播放的音频索引
        currentPlayingIndex: null,
      };
    },
    mounted(){
      this.getMenuFun()
    },
    methods: {
      deleteMusicFun(index,row){
        var that = this;
        console.log(row)
        this.$confirm('此操作将永久删除该音乐文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var params = {
            id: row.id,
          }
          deleteMusic(params).then(res=>{
            console.log(res)
            if(res.code=="200"){
              Message({
                type: "success",
                message: "删除成功",
              })
              that.getMenuFun()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      clearFrom(){
        var that = this
        that.ruleForm.pass = "" 
        that.ruleForm.newPass = "" 
        that.ruleForm.checkPass = "" 
      },
      updateFilePasswordFun(){
        var that = this;
        var params={
          newPassword: that.ruleForm.newPass,
          oldPassword: that.ruleForm.pass
        }
        console.log(params)
        // return
        updateFilePassword(params).then(res=>{
          console.log(res)
          if(res.code == "200"){
            Message({
              message: "修改成功",
              type:"success",
            })
            that.dialogFormVisible = false
          }else{
            Message({
              message: res.message,
              type: error
            })
          }
        })
      },
      changeValue(index,row){
        var that = this;
        that.tableData[index].encrypt = !that.tableData[index].encrypt
        var encrypt = that.tableData[index].encrypt
        var id = that.tableData[index].id
        var params = {
          encrypt,
          id
        }
        updateEncrypt(params).then(res=>{
          console.log(res)
          Message({
            message: "操作",
            type:"success",
          })
        })
      },
      playMusic(index, row) {
        if (row.musicPath) {
          const audio = new Audio(row.musicPath);

          audio.addEventListener('ended', () => {
            audio.remove();
            this.$set(this.tableData, index, { ...row, isPlaying: false, audioInstance: null });
            this.currentPlayingIndex = null;
          });

          // 如果有其他音频正在播放，暂停它
          if (this.currentPlayingIndex !== null) {
            this.pauseMusic(this.currentPlayingIndex);
          }

          audio.play();

          this.$set(this.tableData, index, { ...row, isPlaying: true, audioInstance: audio });
          this.currentPlayingIndex = index;
        } else {
          this.$message.error('当前行没有音乐路径！');
        }
      },

      pauseMusic(index) {
        const audioInstance = this.tableData[index].audioInstance;

        if (audioInstance) {
          audioInstance.pause();
          this.$set(this.tableData, index, { ...this.tableData[index], isPlaying: false });
        }
      },
      handleAvatarSuccess(res, file) {
        Message({
          message: "上传成功",
          type:"success",
        })
        this.getMenuFun()
      },
      beforeAvatarUpload(file) {
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
      handleAvatarSuccessImg(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        Message({
          message: '上传成功',
          type: 'success'
        })
        this.getMenuFun()
      },
      beforeAvatarUploadImg(file) {
        console.log(file)
        const isJPG = file.type === 'image/jpeg'||'image/jpg'||'image/png';
        // const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG或者png 格式!');
        }
        // if (!isLt2M) {
        //   this.$message.error('上传头像图片大小不能超过 2MB!');
        // }
        return isJPG;
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      getMenuFun(){
        var that = this;
        var params = {

        }
        getMenu(params).then(res=>{
          console.log(res.data[0].childMenu)
          that.tableData = [...res.data[0].childMenu,...res.data[1].childMenu]
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
