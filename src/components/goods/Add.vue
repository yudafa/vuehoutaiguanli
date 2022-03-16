<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="warning" :closable="false"> </el-alert>
      <el-steps :active="activeIndex - 0" finish-status="success" align-center :space="200">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form>
        <el-tabs v-model="activeIndex" tab-position="left" style="height: 200px">
          <el-tab-pane label="基本信息" name="0">基本信息</el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action指定图片上传的后台地址，不走axios -->
            <!-- on-preview预览图片时的回调 -->
            <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headersObj">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件,且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 0,
      uploadURL: 'http://www.tangxiaoyang.vip:8888/api/v2/upload',
      headersObj: {
        Authorization: JSON.parse(sessionStorage.getItem('userName')).token,
      },
    }
  },
  
  methods: {
    handlePreview() {},
    handleRemove() {},
  },
}
</script>

<style></style>
