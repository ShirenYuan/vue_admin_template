<template>
  <div class="home_page">
    <el-form class="home_page_ul" label-width="120px">
      <el-form-item label="弹幕开关">
        <div @click="changeValue('4')">
          <el-switch
            :value="danmuValue"
            active-color="#13ce66"
            inactive-color="#f0f0f0">
          </el-switch>
        </div>
      </el-form-item>
      <el-form-item label="公告栏开关">
        <div @click="changeValue('5')">
          <el-switch
            :value="noticeValue"
            active-color="#13ce66"
            inactive-color="#f0f0f0">
          </el-switch>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {toggleMenu,getMenu} from "@/api/api"
export default {
    data() {
      return {
        danmuValue: false,
        noticeValue: false,
        
      };
    },
    mounted(){
      this.getMenuFun()
    },
    methods: {
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
            if(res.data[i].id=="5"){
              // 公告栏
              that.noticeValue = res.data[i].isDisplay
            }
          }
        })
      },
      changeValue(id){
        var that = this;
        var toggle = null
        if(id=="4"){
          that.danmuValue = !that.danmuValue
          toggle = that.danmuValue
        }
        if(id=="5"){
          that.noticeValue = !that.noticeValue
          toggle = that.noticeValue
        }
        var params = {
          id,
          toggle
        }
        toggleMenu(params).then(res=>{
          console.log(res)
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
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  padding: 20px 20px 0;
  
}
</style>
