<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="只能选第三级" type="warning" :closable="false"> </el-alert>
      <span>请选择商品分类:</span>
      <el-cascader v-model="selectedKeys" :options="fatherList" :props="choiceProps" @change="handleChange" clearable></el-cascader>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="dynamic" @click="addDialog = true">添加参数</el-button>
          <el-table :data="dynamicData" border stripe>
            <el-table-column label="明细" type="expand">
              <template slot-scope="scope">
                <el-tag :key="i" v-for="(item, i) in scope.row.attr_vals" closable @close="handleClose(scope.row, i)">
                  {{ item }}
                </el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"> </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="editDialogButon(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="delDialogButon(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="dynamic" @click="addDialog = true">静态参数</el-button>
          <el-table :data="dynamicData" border stripe>
            <el-table-column label="明细" type="expand">
              <template slot-scope="scope">
                <el-tag :key="i" v-for="(item, i) in scope.row.attr_vals" closable @close="handleClose(scope.row, i)">
                  {{ item }}
                </el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"> </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="editDialogButon(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="delDialogButon(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加' + name" :visible.sync="addDialog" width="30%" @close="addClose">
      <span>
        <el-form :model="addDialogForm" :rules="addRules" ref="addRuleForm" label-width="100px">
          <el-form-item :label="name + ':'" prop="cat_name">
            <!-- 这个prop是要往后面传的，所以要写后端定义的名字 -->
            <el-input v-model="addDialogForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addButton">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数对话框 -->
    <el-dialog :title="'编辑' + name" :visible.sync="editDialog" width="30%" @close="editClose">
      <span>
        <el-form :model="editDialogForm" :rules="editRules" ref="editRuleForm" label-width="100px">
          <el-form-item :label="name + ':'" prop="attr_name">
            <!-- 这个prop是要往后面传的，所以要写后端定义的名字 -->
            <el-input v-model="editDialogForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editButton">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedKeys: [], // 级联选择器选中后输入框中的东西
      fatherList: [], //父级分类列表
      choiceProps: {
        value: 'cat_id',
        label: 'cat_name',
        expandTrigger: ' hover',
        // checkStrictly: true, // 可以不全选
      }, // 级联选择器对应的键值对
      activeName: 'many', // tab中当前激活的标签页

      dynamicData: [],
      // 新增弹框
      addDialog: false,
      addRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      },
      addDialogForm: {},
      // 编辑弹框
      editDialog: false,
      editDialogForm: {},
      editRules: {
        attr_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      },
      // 明细
    }
  },
  methods: {
    async getList() {
      const { data: res } = await this.$http.get(`categories`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败!')
      }
      this.fatherList = res.data
      // console.log(res)
    },
    handleChange() {
      // 级联选择器获取操作
      this.getParamsData()
    },
    async getParamsData() {
      // 获取数据
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.dynamicData = [] // 当清空级联操作时候，清空底下表格
        return // 如果不return 则继续往下走
      }
      const { data: res } = await this.$http.get(`categories/${this.lastId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败!')
      }
      res.data.forEach((element) => {
        // 在明细中格式化数据
        element.attr_vals = element.attr_vals ? element.attr_vals.split(' ,') : []
        element.inputVisible = false // 输入框显示隐藏
        element.inputValue = ''
      })
      this.dynamicData = res.data

      console.log(res.data, '静态动态')
      console.log(this.dynamicData, '静态动态2')
      // this.dynamic = false
    },
    handleClick() {
      // 标签页切换从新获取数据
      this.getParamsData()
    },
    // 增
    addButton() {
      this.$refs.addRuleForm.validate(async (validate) => {
        if (!validate) {
          return
        }
        const { data: res } = await this.$http.post(`categories/${this.lastId}/attributes`, {
          attr_name: this.addDialogForm.cat_name,
          attr_sel: this.activeName,
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败!')
        }
        this.getParamsData()
        this.addDialog = false
        // console.log(res, '增')
      })
    },
    addClose() {
      this.$refs.addRuleForm.resetFields()
    },
    // 编辑
    async editDialogButon(id) {
      this.editDialog = true
      const { data: res } = await this.$http.get(`categories/${id.cat_id}/attributes/${id.attr_id}`, {
        params: {
          attr_sel: this.name,
        },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败!')
      }
      // console.log(res, '查')
      this.editDialogForm = res.data // 赋值把全部都拿过来，让他们自己对去
    },
    editButton() {
      this.$refs.editRuleForm.validate(async (validate) => {
        if (!validate) {
          return
        }
        const { data: res } = await this.$http.put(`categories/${this.editDialogForm.cat_id}/attributes/${this.editDialogForm.attr_id}`, {
          attr_name: this.editDialogForm.attr_name,
          attr_sel: this.activeName,
          attr_vals: this.editDialogForm.attr_vals,
        })
        if (res.meta.status !== 200) {
          return this.$message.error('添加失败!')
        }
        this.getParamsData()
        this.editDialog = false
        // console.log(res, '增')
      })
    },
    editClose() {
      this.$refs.editRuleForm.resetFields()
    },
    // 删除
    delDialogButon(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${id.cat_id}/attributes/${id.attr_id}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败!')
          }
          this.$message.success('删除成功!')
          this.getParamsData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 明细
    handleClose(row, i) {
      row.attr_vals.splice(i, 1)
      this.params(row)
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(() => {
        // 光标焦点，和上面的true有前后级关系
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim()) {
        row.attr_vals.push(row.inputValue.trim())
      }
      row.inputVisible = false
      row.inputValue = ''
    },
    async params(row) {
      console.log(row, '123')
      const { data: res } = await this.$http.put(`categories/${this.lastId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(','),
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败!')
      }
      this.getParamsData()
    },
  },
  computed: {
    lastId() {
      // 分类 ID
      return this.selectedKeys.length === 3 ? this.selectedKeys[2] : null
    },
    dynamic() {
      return this.selectedKeys.length === 3 ? false : true
    },
    name() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    },
  },
  created() {
    this.getList()
  },
}
</script>

<style lang="less" scope>
.el-cascader {
  margin-top: 15px;
}
.el-tag {
  margin: 10px;
}
.el-input {
  width: 120px;
}
</style>
