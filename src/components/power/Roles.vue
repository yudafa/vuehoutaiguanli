<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="dialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe>
        <el-table-column label="明细" type="expand">
          <template slot-scope="scope">
            <!-- 一级角色 -->
            <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="{ bdbottom: true, bdtop: i1 == 0, vcenter: true }">
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级角色 -->
              <el-col :span="19">
                <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="{ bdtop: i2 !== 0, vcenter: true }">
                  <el-col :span="6">
                    <el-tag closable type="info" @close="removeRightById(scope.row, item2.id)">
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级角色 -->
                  <el-col :span="18">
                    <el-row v-for="item3 in item2.children" :key="item3.id">
                      <el-tag closable type="warning" @close="removeRightById(scope.row, item3.id)">
                        {{ item3.authName }}
                      </el-tag>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-row>
              <el-button type="primary" icon="el-icon-edit" circle @click="editUser(scope.row.id)">编辑</el-button>
              <el-button type="success" icon="el-icon-delete" circle @click="deleteUser(scope.row.id)">删除</el-button>
              <el-button type="info" icon="el-icon-setting" circle @click="showEditDialog(scope.row)">分配权限</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="dialogVisible" width="30%" @close="addUserClose">
      <span>
        <el-form :model="addUserform" :rules="addRules" ref="addRuleForm" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addUserform.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addUserform.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subAddUserform">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialog" width="30%" @close="editUserClose">
      <span>
        <el-form :model="editUserform" :rules="editRules" ref="editRuleForm" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editUserform.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editUserform.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="subEditUserform">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="powerDialog" width="30%" @close="powerClose">
      <span>
        <el-tree ref="eltree" :data="powerProps" :props="treePowerNode" node-key="id" show-checkbox default-expand-all :default-checked-keys="defaultNode"> </el-tree>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="powerDialog = false">取 消</el-button>
        <el-button type="primary" @click="powerSub">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      editDialog: false,
      powerDialog: false,
      powerProps: [], // 分配权限所拿到的所有数据
      // 树形组件的节点
      treePowerNode: {
        label: 'authName',
        children: 'children',
      },
      userList: [],

      editUserform: {
        roleDesc: '',
        roleName: '',
      },
      addUserform: {
        roleDesc: '',
        roleName: '',
      },
      addRules: {
        roleName: [
          { required: true, message: '请输入名字', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入描述', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
      },
      editRules: {
        roleName: [
          { required: true, message: '请输入名字', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入描述', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
      },
      // 默认选中的树形节点
      defaultNode: [],
      // 用户点击更改的id
      powerId: '',
    }
  },
  methods: {
    async getUser() {
      const { data: res } = await this.$http.get(`roles`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败!')
      }
      this.userList = res.data
      // console.log(res, "获取用户列表");
    },
    subAddUserform() {
      this.$refs.addRuleForm.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post(`roles`, this.addUserform)
        // console.log(this.addUserform, "roles");
        // console.log(res, "res");
        if (res.meta.status !== 201) {
          return this.$message.error('获取失败!')
        }
        this.dialogVisible = false
        this.getUser()
        this.$message.success('添加成功人员,牛逼')
      })
    },
    addUserClose() {
      this.$refs.addRuleForm.resetFields()
    },
    // 编辑
    async editUser(id) {
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败!')
      }
      this.editUserform = res.data
      this.editDialog = true
      // console.log(res, "编辑");
    },
    subEditUserform() {
      // 提交编辑好的表单

      this.$refs.editRuleForm.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(`roles/${this.editUserform.roleId}`, {
          roleDesc: this.editUserform.roleDesc,
          roleName: this.editUserform.roleName,
        })
        // console.log(res, "更改表单");
        if (res.meta.status !== 200) {
          return this.$message.error('更改表单失败!')
        }
        this.editDialog = false
        this.getUser()
        this.$message.success('编辑人员成功,牛逼')
      })
    },
    editUserClose() {
      // 编辑对话框关闭
      this.$refs.editRuleForm.resetFields()
    },
    // 删除
    deleteUser(id) {
      this.$confirm('删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${id}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败!')
          }
          this.$message.success('删除人员成功,牛逼')
          this.getUser()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    removeRightById(roleId, rightId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${roleId.id}/rights/${rightId}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除子权限失败!')
          }

          roleId.children = res.data
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    async showEditDialog(repeatId) {
      const { data: res } = await this.$http.get(`rights/tree`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限分配列表失败!')
      }
      this.powerProps = res.data
      // console.log(this.powerProps, 'this.powerProps')
      this.powerDialog = true
      // 递归中需要的数据(获取三级权限id)
      this.powerId = repeatId.id // 存储当前要分配角色的id
      this.repeat(repeatId)
      console.log(this.defaultNode)
    },
    powerClose() {
      this.defaultNode = [] //关闭后清空
    },
    repeat(repeatId) {
      // 判断是否为三级节点，如果不是最子级，就放到数组中
      if (!repeatId.children) {
        return this.defaultNode.push(repeatId.id)
      }
      repeatId.children.forEach((item) => {
        this.repeat(item)
      })
    },
    async powerSub() {
      const keys = this.$refs.eltree.getCheckedKeys().concat(this.$refs.eltree.getHalfCheckedKeys())
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.powerId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('更改权利失败!')
      }
      this.powerDialog = false
      this.getUser()
      this.$message.success('获取权限分配列表成功,牛逼!')
    },
  },
  created() {
    this.getUser()
  },
}
</script>

<style>
.el-tag {
  margin: 6px;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.bdtop {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
