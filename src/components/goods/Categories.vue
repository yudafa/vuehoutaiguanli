<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialog = true  ">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table :data="categoriesList" :columns="columns" :selection-type="false" :expand-type="false" show-index border>
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-error" style="color: red" v-if="scope.row.cat_deleted"></i>
          <i class="el-icon-success" style="color: lightgreen" v-else></i>
        </template>
        <template slot="paixu" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="operation">
          <div>
            <el-button size="mini" type="primary">编辑</el-button>
            <el-button size="mini" type="danger">删除</el-button>
          </div>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="categoriesInfo.pagenum" :page-sizes="[5, 10]" :page-size="categoriesInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialog" width="30%">
      <span>
        <el-form :model="addDialogForm" :rules="addRules" ref="addRuleForm" label-width="100px">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="addDialogForm.name"></el-input>
          </el-form-item>
          <!-- <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addDialog.roleDesc"></el-input>
          </el-form-item> -->
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 初始化获取商品分类
      categoriesList: [],
      categoriesInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 7,
      },
      total: 0, //总记录数
      //tree-table列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk',
        },
        {
          label: '排序',
          type: 'template',
          template: 'paixu',
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation',
        },
      ],
      addDialog: false,
      addDialogForm: {
        //添加表单
        name: '',
      },
      addRules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.categories()
  },
  methods: {
    async categories() {
      const { data: res } = await this.$http.get(`categories`, { params: this.categoriesInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败!')
      }
      this.total = res.data.total
      this.categoriesList = res.data.result
    },
    handleSizeChange(pagesize) {
      this.categoriesInfo.pagesize = pagesize
      this.categories()
    },
    handleCurrentChange(pagenum) {
      this.categoriesInfo.pagenum = pagenum
      this.categories()
    },
  },
}
</script>

<style></style>
