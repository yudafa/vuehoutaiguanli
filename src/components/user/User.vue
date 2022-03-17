<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="userList">
            <el-button slot="append" icon="el-icon-search" @click="userList1"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 渲染内容 -->
      <el-table :data="usersList" border>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-row>
              <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(scope.row.id)"></el-button>
              <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-star-off" circle @click="distributionUser(scope.row)"></el-button>
              </el-tooltip>
              <el-button type="danger" icon="el-icon-delete" circle @click="deleteUser(scope.row.id)"></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户弹出框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%" @close="close">
      <el-form :rules="rules" :model="ruleForm" label-width="90px" ref="ruleForm">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户弹出框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="30%" @close="editClose">
      <el-form :rules="editRules" :model="editRuleForm" label-width="90px" ref="editRuleForm">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="editRuleForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editRuleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editRuleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配用户角色弹出框 -->
    <el-dialog title="分配用户角色" :visible.sync="distributionDialog" width="30%" @close="distributionClose">
      <div>
        <p>用户姓名:{{ changeForm.username }}</p>
        <p>用户角色:{{ changeForm.role_name }}</p>
        <p>
          更改用户角色为:
          <el-select v-model="userName" placeholder="请选择">
            <el-option v-for="item in allUsersList" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distributionDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { throttle } from '@/plugins/throttle'
import { getUsers } from '@/utils/orderApi'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      usersList: [],
      total: 0,
      ruleForm: {}, //提交表单的数据
      dialogVisible: false, // 对话框关闭
      editRuleForm: {},
      editDialogVisible: false, // 编辑对话框关闭
      distributionDialog: false, // 分配角色对话框关闭
      changeForm: {}, // 更改用户角色数据
      allUsersList: {}, // 更改用户角色中全部角色的下拉数据
      userName: null, // 选择的用户角色,默认进去是空的。所以是null
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        mobile: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
      },
      // 编辑的校验
      editRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        mobile: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.userList()
    // console.log(this, 'this')
  },
  methods: {
    userList1: throttle(function () {
      // 节流
      this.userList()
    }, 2000),

    // userList1() {
    //   throttle(this.userList(), 2000)
    // },
    async userList() {
      // const { data: res } = await this.$http.get('users', {
      //   params: this.queryInfo,
      // })
      const { data: res } = await getUsers(this.queryInfo)
      // console.log(res, "users");
      if (res.meta.status !== 200) {
        return this.message.error('获取用户列表失败!')
      }
      this.usersList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize
      this.userList()
    },
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum
      this.userList()
    },
    async changeState(user) {
      console.log(user)
      const { data: res } = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      if (res.meta.status !== 200) {
        this.user.mg_state = !user.mg_state
        return this.message.error('更新用户状态失败!')
      }
    },
    close() {
      // 添加用户内容关闭，全部清空
      this.$refs.ruleForm.resetFields()
    },
    editClose() {
      // 添加用户内容关闭，全部清空
      this.$refs.editRuleForm.resetFields()
    },
    distributionClose() {
      // 关闭之后全部清空，从新获取东西
      this.userName = null
      this.changeForm = {}
    },
    addDialogVisible() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('users', this.ruleForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败!')
        }
        this.dialogVisible = false
        this.userList()
        this.$message.success('添加用户成功!')
      })
    },
    // 编辑按钮打开弹窗
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return
      }
      this.editRuleForm = res.data
      this.editDialogVisible = true
    },
    async editUser() {
      this.$refs.editRuleForm.validate((valid) => {
        if (!valid) {
          return
        }
      })
      const { data: res } = await this.$http.put(`users/${this.editRuleForm.id}`, {
        email: this.editRuleForm.email,
        mobile: this.editRuleForm.mobile,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('用户编辑失败!')
      }
      this.editDialogVisible = false
      this.userList()
    },
    deleteUser(id) {
      this.$confirm('确定删除该文件吗?, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`users/${id}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败!')
          }
          this.userList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    async distributionUser(id) {
      this.changeForm = id
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('全部角色获取失败!')
      }
      this.allUsersList = res.data
      console.log(this.allUsersList)
      this.distributionDialog = true
    },
    async changeUser() {
      if (!this.userName) {
        return this.$message.error('请选择角色')
      }
      const { data: res } = await this.$http.put(`users/${this.changeForm.id}/role`, { rid: this.userName })
      if (res.meta.status !== 200) {
        return this.$message.error('更改失败!')
      }
      this.distributionDialog = false
      this.userList()
    },
  },
}
</script>

<style></style>
