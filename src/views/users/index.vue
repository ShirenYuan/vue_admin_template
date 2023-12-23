<template>
  <div class="home_page">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="home_page_ul">
      <el-form-item label="用户名" prop="name">
        <div>admin</div>
      </el-form-item>
      <el-form-item label="旧密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPass">
        <el-input type="password" v-model="ruleForm.newPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateUserPasswordFun()">提交</el-button>
        <el-button @click="resetForm()">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {updateUserPassword} from "@/api/user"
import { MessageBox, Message } from 'element-ui'
export default {
    data() {
      var passValidator = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var newPassValidator = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('新密码不能为空'));
        }else if(value.length<6){
          return callback(new Error('新密码不能少于6位'));
        }else {
          callback();
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
        }
      };
    },
    methods: {
      updateUserPasswordFun(){
        var that = this;
        var params = {
          newPassword: that.ruleForm.newPass,
          oldPassword: that.ruleForm.pass,
        }
        updateUserPassword(params).then(res=>{
          console.log(res)
          Message({
            message: res.message,
            type: 'success'
          })
        }).catch(err=>{
          Message({
            message: err.message,
            type: err
          })
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.ruleForm.pass = ""
        this.ruleForm.newPass = ""
        this.ruleForm.checkPass = ""
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
</style>
