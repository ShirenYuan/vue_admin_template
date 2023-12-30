<template>
  <div class="home_page">
    <el-form class="home_page_ul" ref="form" label-width="120px">
      <el-form-item label="公告栏开关">
        <div @click="changeValue('7')">
          <el-switch
            :value="noticeValue"
            active-color="#13ce66"
            inactive-color="#f0f0f0">
          </el-switch>
        </div>
      </el-form-item>
      <el-form-item label="编辑公告">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="textareaStr">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addNoticeFun()">提交</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addNotice,getMenu,toggleMenu } from '@/api/api'
import { MessageBox, Message } from 'element-ui'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'logoPath',
      'notice',
    ])
  },
  data(){
    return {
      danmuValue: false,
      noticeValue: false,
      textareaStr: "",
      danmuValue: false,
      noticeValue: false,
    }
  },
  mounted(){
    this.textareaStr = this.notice
    this.getMenuFun()
    console.log(this.notice)
    console.log(this.logoPath)
  },
  methods:{
    getMenuFun(){
      var that = this;
      var params = {

      }
      getMenu(params).then(res=>{
        console.log(res.data)
        for(let i=0;i<res.data.length;i++){
          if(res.data[i].id=="4"){
            // 留言弹幕
            that.danmuValue = res.data[i].isDisplay
          }
          if(res.data[i].id=="7"){
            // 公告栏
            that.noticeValue = res.data[i].isDisplay
          }
        }
      })
    },
    changeValue(id){
      var that = this;
      var toggle = null
      if(id=="7"){
        that.noticeValue = !that.noticeValue
        toggle = that.noticeValue
      }
      var params = {
        id,
        toggle
      }
      toggleMenu(params).then(res=>{
        console.log(res)
        Message(res.message)
      }).catch(err=>{
        Message(err.message)

      })
    },
    resetForm(){
      this.textareaStr = ""
    },
    
    addNoticeFun(){
      var that = this
      var params = {
        notice: that.textareaStr
      }
      addNotice(params).then(res=>{
        console.log(res)
        Message(res.message)
      }).catch(err=>{
        Message(err.message)

      })
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
