<template>
  <div class="app-container">
    <el-row type="flex" class="row-bg">
      <el-col style="width: 200px">
        <div>请选择摄像头</div>
        <el-menu>
          <el-menu-item v-for="item in dhList" :key="item.id" :index="item.ip.toString()" @click="changerobot(item)">
            <span slot="title">{{item.cameraName}}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :flex="1" class="robotiframe" style="z-index: -1">
        <iframe id="dhiframes" ref="iframe" src="../../../../preview/dahua/demo.html" frameborder="0" scrolling="no" style="width: 1300px; height: 1100px; z-index: -1"/>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { listDHCamera } from "@/api/device/dahuaCamera" // 获取大华摄像头列表

export default {
  data() {
    return {
      margintop: '0px',
      // 大华摄像头
      dhList: []
    }
  },
  watch: {},
  created: function() {
    this.getDHList()
    window.sessionStorage.setItem('userName', '') // 用户名
    window.sessionStorage.setItem('userPwd', '') // 密码
    window.sessionStorage.setItem('sxtIp', '') // ip
    window.sessionStorage.setItem('sxtPort', 37777) // 端口号
  },
  mounted: function() {},
  destroyed() {
    window.sessionStorage.setItem('userName', null)
    window.sessionStorage.setItem('userPwd', null)
    window.sessionStorage.setItem('sxtIp', null)
    window.sessionStorage.setItem('sxtPort', null)
  },
  methods: {
    // 获取大华摄像头列表
    getDHList() {
      const self = this
      listDHCamera(this.queryParams).then((response) => {
        self.dhList = response.rows
      })
    },
    // 切换摄像头
    changerobot(val) {
      setTimeout(() => {
        this.margintop = '0px'
        // this.$refs.select.blur();
      }, 300)
      window.sessionStorage.setItem('sxtIp', val.ip)
      window.sessionStorage.setItem('userName', val.username) // 用户名
      window.sessionStorage.setItem('userPwd', val.password) // 密码
      window.sessionStorage.setItem('sxtPort', val.port)
      var _iframe = document.getElementById('dhiframes') // 获取iframe节点
      _iframe.contentWindow.location.reload(true) // 重新加载iframe
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  min-height: calc(100vh - 300px);
}
/deep/.el-scrollbar {
  height: 40px !important;
}
/deep/ .el-select-dropdown__wrap {
  height: 55px !important;
}
/deep/ .el-scrollbar__wrap {
  height: 55px !important;
}
</style>
