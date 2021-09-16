<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
// import { listConfig } from "@/api/system/config"; //全局获取告警图片IP地址和摄像头账户密码
export default  {
  name:  'App',
  provide(){
    return {
      reload: this.reload
    }
  },
  data(){
    return {
      isRouterAlive:true,
      // // 动态获取告警图片IP地址
      // alarmimgipurl:"",
      // // 动态获取摄像头账户密码
      // camerauser:"",
      // camerapassword:"",
      // // 动态获取NVR地址
      // nvrip:"",
    }
  },
  created(){
    // this.getcameraip();
  },
  methods:{
    reload(){
      this.isRouterAlive = false;
      this.$nextTick(function(){
        this.isRouterAlive = true;
      })
    },
     // // //动态获取告警图片IP地址
    // getcameraip(){
    //   listConfig().then(response => {
    //     console.log(response.rows,'全局匹配的一些参数');
    //     response.rows.map((v)=>{
    //       // 图片服务器地址
    //       if(v.configKey == "server.fdfs.ip"){
    //         this.alarmimgipurl = v.configValue;
    //         window.sessionStorage.setItem("alarmimgipurl",this.alarmimgipurl);
    //       }
    //       // 摄像头账号
    //       if(v.configKey == "config.camera.username"){
    //         this.camerauser = v.configValue;
    //         window.sessionStorage.setItem("camerauser",this.camerauser);
    //       }
    //       // 摄像头密码
    //        if(v.configKey == "config.camera.password"){
    //         this.camerapassword = v.configValue;
    //         window.sessionStorage.setItem("camerapassword",this.camerapassword);
    //       }
    //       // NVR服务器IP
    //       if(v.configKey == "server.nvr.ip"){
    //         this.nvrip = v.configValue;
    //         window.sessionStorage.setItem("nvrip",this.nvrip);
    //       }
    //     })
    //   });
    // },
  }
}
</script>
<style lang="scss">

//  .el-table--scrollable-y {
//   /deep/.el-table__body-wrapper::-webkit-scrollbar {
//     width: 4px;
//   }
//   /deep/.gutter {
//     width: 4px !important;
//   }
// }

// .el-table--scrollable-y {
//   /deep/.el-table__body-wrapper::-webkit-scrollbar-thumb {
//     background-color: #d8d8d8ff;
//     border-radius: 7px;
//     // box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
//   }
// }
// /*定义滚动条的轨道颜色、内阴影及圆角*/
// .el-table--scrollable-y {
//   /deep/.el-table__body-wrapper::-webkit-scrollbar-track {
//     // box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
//     background-color: #fff;
//     border-radius: 3px;
//   }
// }
</style>
