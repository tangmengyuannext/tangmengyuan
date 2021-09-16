<template>
  <div class="license">
    <el-form ref="licenseForm" class="license-form">
      <h3 class="title">激  活</h3>
      <el-form-item prop="license" label="注册码">
        <el-input
          v-model="license"
          type="textarea"
          auto-complete="off"
          placeholder="注册码"
          
        ></el-input>
      </el-form-item>
      <el-form-item prop="code" label="激活码">
        <el-input
          v-model="code"
          type="textarea"
          auto-complete="off"
          placeholder="请输入激活码"
          @keyup.enter.native="handleLicence"
        ></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLicence"
        >
          <span v-if="!loading">激 活</span>
          <span v-else>激 活 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-license-footer">
      <span>Copyright © 2019-2020 ztxy.com All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { importLicense, hasLicense } from "@/utils/license";

export default {
  name: "License",
  data() {
    return {
      license: "",
      code: "",
      loading: false
    };
  },
  // watch: {
  //   $route: {
  //     handler: function(route) {
  //       console.log("watch: ", route);
  //       this.license = route.query && route.query.license;
  //     },
  //     immediate: true
  //   }
  // },
  created() {
    this.getCode();
  },
  methods: {
    getCode() {
      hasLicense().then(res => {
        if (res.license) {
          this.license = res.license;
        }
      });
    },
    handleLicence() {
      this.loading = true;
      importLicense({code: this.code}).then(response => {
        if (response.success) {
          this.msgSuccess(response.msg);
          this.$router.push({ path: "/login" });
        } else {
          this.msg(response.msg);
        }
      });
        
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.license {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/image/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.license-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.license-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.license-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-license-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>
