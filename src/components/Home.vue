<template>
  <div class="home-container">
    <el-container>
      <el-header>
        <div class="head-left">
          <img src="../assets/img/shop.png" alt="" />
          <span>CSDN电商学习</span>
        </div>
        <div class="head-right">
          欢迎您:{{ userInfo.username }}
          <el-button type="danger" @click="out">退出</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside :width="showOrnoshow ? '64px' : '200px'">
          <div class="showLeft" @click="showOrnoshow = !showOrnoshow">|||</div>
          <el-menu
            :collapse="showOrnoshow"
            :collapse-transition="false"
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            unique-opened
            router
          >
            <el-submenu
              :index="item.id + ''"
              v-for="item in menuList"
              :key="item.id"
            >
              <template slot="title">
                <i :class="font[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  :index="'/' + childrenName.path"
                  v-for="childrenName in item.children"
                  :key="childrenName.id"
                >
                  {{ childrenName.authName }}
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: null,
      menuList: [],
      font: {
        202: "iconfont icon-shouye",
        125: "iconfont icon-shangpin",
        103: "iconfont icon-danju",
        101: "iconfont icon-tijikongjian",
        102: "iconfont icon-morentouxiang",
      },
      showOrnoshow: false,
    };
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userName"));
    this.getItemgroup();
  },
  methods: {
    out() {
      this.$confirm("是否退出?, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          sessionStorage.clear();
          this.$router.push("/login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出",
          });
        });
    },
    async getItemgroup() {
      const { data: res } = await this.$http.get("menus");
      // console.log(res, "获取左侧列表");
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.menuList = res.data;
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  .el-container {
    height: 100%;
  }
  .el-header {
    height: 50px;
    background: url("../assets/img/header_bg.gif") repeat-x center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
  }
  .head-left {
    display: flex;
    align-items: center;
    img {
      width: 45px;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
  .el-menu {
    border-right: 0;
  }
}
.showLeft {
  height: 20px;
  background-color: #60779d;
  margin: 0;
  padding: 0;
  line-height: 10px;
  color: white;
  text-align: center;
  letter-spacing: 0.2rem;
  cursor: pointer;
}
</style>
