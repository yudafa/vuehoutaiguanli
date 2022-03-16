<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- v-model="queryInfo.query" -->
          <el-input placeholder="请输入内容" class="input-with-select" clearable> </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialog">添加商品</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      goodsList: [],
    }
  },
  created() {
    // this.getGoodsList()
  },
  methods: {
    getGoodsList() {
      let _ybh = this
      axios.get('http://www.tangxiaoyang.vip:8888/api/v2/goods').then(function (res) {
        if (res.status !== 200) {
          return this.$message.error('获取商品分类失败!')
        }

        _ybh.goodsList = res.data.data
      })
      console.log(_ybh.goodsList)
    },
    addDialog() {
      this.$router.push('/goods/add')
    },
  },
}
</script>

<style lang="less" scope>
.input-with-select {
  width: 100% !important;
}
</style>
