<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="powerList" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">标签一</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success"
              >标签二</el-tag
            >
            <el-tag v-else type="info">标签三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      powerList: [],
    };
  },
  methods: {
    async powerUser() {
      const { data: res } = await this.$http.get(`rights/list`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败!");
      }
      this.powerList = res.data;
      console.log(res);
    },
  },
  created() {
    this.powerUser();
  },
};
</script>

<style></style>
