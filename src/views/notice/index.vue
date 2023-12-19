<template>
  <div class="home_page">
    <el-form class="home_page_ul" ref="form" :model="form" label-width="120px">
      <el-form-item label="弹幕开关">
        <el-switch
          v-model="value"
          active-color="#13ce66"
          inactive-color="#f0f0f0">
        </el-switch>
      </el-form-item>

      <el-form-item label="公告栏开关">
        <el-switch
          v-model="value"
          active-color="#13ce66"
          inactive-color="#f0f0f0">
        </el-switch>
      </el-form-item>
      
      <el-form-item label="编辑公告">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="textarea">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
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
