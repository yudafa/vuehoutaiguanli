<template>
  <div class="login-container">
    <div class="login-left">
      <img src="../assets/img/login_img.png" alt="" />
    </div>
    <div class="login-right">
      <div class="head">
        <img src="../assets/img/login_logo.png" alt="" />
      </div>
      <div class="title">电商后台管理系统</div>
      <el-form
        ref="from"
        label-width="80px"
        class="login-form"
        :model="formData"
        :rules="rules"
      >
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            prefix-icon="el-icon-search"
            v-model="formData.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            show-password
            placeholder="请输入密码"
            prefix-icon="el-icon-video-camera-solid"
            v-model="formData.password"
          ></el-input>
        </el-form-item>
        <el-button class="primary" type="primary" @click="go">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到10 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    go() {
      this.$refs.from.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post("login", this.formData);
        console.log(res);

        if (res.meta.status !== 200) {
          return this.$notify({
            title: "警告",
            message: "登录失败",
            type: "warning",
          });
        }
        this.$notify({
          title: "成功",
          message: "登录成功",
          type: "success",
        });
        sessionStorage.setItem("userName", JSON.stringify(res.data));
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  background-color: #93defe;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  // flex: 1;
  .login-left {
    margin-right: 100px;
  }
  .login-right {
    width: 400px;
    height: 350px;
    padding: 50px;
    box-sizing: border-box;
    border-radius: 6px;
    background-color: #fff;
    position: relative;
    .head {
      width: 120px;
      height: 120px;
      border: 5px solid #93defe;
      text-align: center;
      background-color: #fff;
      border-radius: 100px;
      position: absolute;
      top: -60px;
      left: 140px;
    }
    .title {
      position: absolute;
      top: 100px;
      left: 50%;
      transform: translate(-50%);
    }
    .login-form {
      position: absolute;
      bottom: 0px;
      left: 50%;
      padding: 20px;

      width: 80%;
      box-sizing: border-box;
      transform: translate(-50%);
      /deep/.el-form-item__content {
        margin-left: 0px !important;
      }
      .primary {
        width: 100%;
      }
    }
  }
}
</style>
