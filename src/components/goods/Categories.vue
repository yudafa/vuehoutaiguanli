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
          <el-button type="primary" @click="addDialogButon">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table class="tree-table" :data="categoriesList" :columns="columns" :selection-type="false" :expand-type="false" show-index border>
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-error" style="color: red" v-if="scope.row.cat_deleted"></i>
          <i class="el-icon-success" style="color: lightgreen" v-else></i>
        </template>
        <template slot="paixu" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="danger" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="operation" slot-scope="scope">
          <div>
            <el-button size="mini" type="primary" @click="editDialogButon(scope.row.cat_id)">编辑</el-button>
            <el-button size="mini" type="danger" @click="delDialogButon(scope.row.cat_id)">删除</el-button>
          </div>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="categoriesInfo.pagenum"
        :page-sizes="[5, 10]"
        :page-size="categoriesInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialog" width="30%" @close="closeAddDialog">
      <span>
        <el-form :model="addDialogForm" :rules="addRules" ref="addRuleForm" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addDialogForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类" prop="fatherSort">
            <el-cascader v-model="selectedKeys" :options="fatherList" :props="choiceProps" @change="handleChange" clearable></el-cascader>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addSortButton">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editDialog" width="30%" @close="closeEditDialog">
      <span>
        <el-form :model="editDialogForm" :rules="editRules" ref="editRuleForm" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editDialogForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editSortButton">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import axios from 'axios'
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
        // 分类父 ID
        cat_pid: 0,
        //分类名称
        cat_name: '',
        //分类层级
        cat_level: 0,
      },
      addRules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      },
      // 级联选择器对应的键值对
      choiceProps: {
        value: 'cat_id',
        label: 'cat_name',
        expandTrigger: ' hover',
        checkStrictly: true, // 可以不全选
        // clearable: true, // 有×号 加上面，这个不是prop中的属性，我只是写在这里了
      },
      //父级分类列表
      fatherList: [],
      selectedKeys: [
        // 级联选择器选中后输入框中的东西
      ],
      // 编辑
      editDialog: false,
      editDialogForm: {
        cat_name: '',
      },
      editRules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.categories()
  },
  methods: {
    // categories() {
    //   let _ybh = this
    //   axios.get('http://www.tangxiaoyang.vip:8888/api/v2/categories').then(function (res) {
    //     console.log(res, 'axios')
    //     if (res.status !== 200) {
    //       return this.$message.error('获取商品分类失败!')
    //     }

    //     _ybh.categoriesList = res.data.data
    //   })
    // },

    async categories() {
      const { data: res } = await this.$http.get(`categories`, { params: this.categoriesInfo })
      // console.log(res, 'async')
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
    async optionsData() {
      const { data: res } = await this.$http.get(`categories`, {
        params: {
          // 传参的时候写params
          type: 2,
        },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取级联数据失败!')
      }
      // console.log(res, '级联数据')
      this.fatherList = res.data
    },
    addDialogButon() {
      this.optionsData()
      this.addDialog = true
    },
    // 级联输入框改变
    handleChange() {
      console.log(this.selectedKeys, '输入框数据')
      // 判断是否选择了父级分类
      if (this.selectedKeys.length > 0) {
        this.addDialogForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addDialogForm.cat_level = this.selectedKeys.length
      } else {
        this.addDialogForm.cat_pid = 0
        this.addDialogForm.cat_level = 0
      }
    },
    addSortButton() {
      this.$refs.addRuleForm.validate(async (valid) => {
        if (!valid) {
          return
        }

        const { data: res } = await this.$http.post(`categories`, this.addDialogForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类数据失败!')
        }
        this.addDialog = false
        this.categories()
        this.$message.success('添加数据成功,牛逼')
      })
    },
    closeAddDialog() {
      this.$refs.addRuleForm.resetFields()
      this.selectedKeys = []
      this.addDialogForm.cat_pid = 0
      this.addDialogForm.cat_level = 0
    },
    async editDialogButon(id) {
      this.editDialog = true
      // axios.get(`http://www.tangxiaoyang.vip:8888/api/v2/categories/${id}`).then(function (res) {
      //   console.log(res, 'edit')
      // })
      const { data: res } = await this.$http.get(`categories/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败!')
      }
      this.editDialogForm = res.data
    },
    editSortButton() {
      // let _this = this
      this.$refs.editRuleForm.validate(async (vaild) => {
        if (!vaild) {
          return
        }
        // axios.put(`http://www.tangxiaoyang.vip:8888/api/v2/categories/${this.editDialogForm.cat_id}`, this.editDialogForm).then(function (res) {
        //   console.log(res, 'edit')
        //   if (res.data.meta.status !== 200) {
        //     return this.$message.error('更改失败!')
        //   }
        // })

        const { data: res } = await this.$http.put(`categories/${this.editDialogForm.cat_id}`, this.editDialogForm)
        if (res.meta.status !== 200) {
          return this.$message.error('获取失败!')
        }
        this.$message.success('编辑成功!')
        this.editDialog = false
        this.categories()
      })
    },
    closeEditDialog() {
      this.$refs.editRuleForm.resetFields()
      this.editDialogForm = {}
    },
    delDialogButon(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${id}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败!')
          }
          this.$message.success('删除成功!')
          this.categories()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>

<style>
.tree-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
