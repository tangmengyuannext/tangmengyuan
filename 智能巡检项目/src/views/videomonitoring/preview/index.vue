<template>
  <div class="app-container">
    <el-row :gutter="10" class="videoContent">
      <!-- <el-col :span="4" class="treenav">
        <el-input class="searchinput" placeholder="输入关键字进行过滤" v-model="filtermenutree"></el-input>
        <el-tree class="el-treenav" ref="filtermenutree" :data="quyulist" :props="defaultProps"  @node-click="handleNodeClick"
          default-expand-all :expand-on-click-node="false" :filter-node-method="filtermenuNode"></el-tree>
      </el-col> -->
      <el-col>
        <el-tabs v-model="activeName" @tab-click="handlePreClick">
          <el-tab-pane v-if="boosterBiaoshi" label="升压站" :name="boosterTabName">
            <el-col :span="24" v-if="isshow" class="videoIframe">
              <iframe
                ref="iframe"
                id="videoiframes"
                src="../../../../preview/cn/demo.html"
                frameborder="0"
                scrolling="no"
                style="width:1450px; height:1000px; z-index:-1;"
              ></iframe>
            </el-col>
          </el-tab-pane>
          <el-tab-pane v-if="fanBiaoshi" label="风电机组" :name="fanTabName">
            <el-col :span="24" v-if="isshow" class="videoIframe">
              <iframe
                ref="iframe"
                id="videoiframes1"
                src="../../../../preview/cn/fanDemo.html"
                frameborder="0"
                scrolling="no"
                style="width:1450px; height:1000px; z-index:-1;"
              ></iframe>
            </el-col>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <!-- <el-col :span="24" v-if="isshow" class="videoIframe">
        <iframe
          ref="iframe"
          id="videoiframes"
          src="../../../../preview/cn/demo.html"
          frameborder="0"
          scrolling="no"
          style="width:1450px; height:1000px; z-index:-1;"
        ></iframe>
      </el-col> -->
    </el-row>
  </div>
</template>


<script>
import { getToken } from '@/utils/auth';
import { listConfig } from "@/api/system/config"; //全局获取告警图片IP地址和摄像头账户密码
import { listArea } from "@/api/device/area";
import { listCamera } from "@/api/device/camera";

export default {
  inject:['reload'], 
  data() {
    return {
      activeName: 'first',
      boosterTabName:'first',
      fanTabName:'second',
      fanBiaoshi:false,
      boosterBiaoshi:false,
      // 动态获取告警图片IP地址
      // alarmimgipurl:"",
      // 动态获取摄像头账户密码
      camerauser:"",
      camerapassword:"",
      // 动态获取NVR地址
      nvrip:"",

      isshow:true,
      shexiangtoulist:[],
      quyulist:[],
      defaultProps: {
        children: "children",
        label: "areaName",
        pid: "parentId",
        id: "areaId",
      },

      
    }; 
  },
  created: function () {
    this.getcameraip();
    this.isshow = true;
    console.log(process.env.VUE_APP_BASE_API,'process.env.VUE_APP_BASE_API-----------process.env.VUE_APP_BASE_API');
    var proptoken = getToken(), prophttp = process.env.VUE_APP_BASE_API;
    window.sessionStorage.setItem('proptokens',proptoken);
    window.sessionStorage.setItem('prophttp',prophttp);
    // document.getElementById("videoiframes").contentWindow.location.reload(true);
  },
  beforeMount: function () {
  },
  mounted: function () {
    this.getPreList();
    this.getBoosterList();
    //// this.getshexiangtoulist();
    // this.iframe = this.$refs['iframe'].contentWindow;
    // window.addEventListener('message',this.sendMessage);
    // // this.sendMessage();
    // this.isshow = window.sessionStorage.getItem("isshow");
    // // console.log(111,'----------------------',this.isshow);
    // if(this.isshow == null || this.isshow == "true"){
    //   location.reload();
    //   this.isshow = false;
    //   window.sessionStorage.setItem("isshow",this.isshow);
    //   this.isshow = window.sessionStorage.getItem("isshow");
    //   // console.log(this.isshow, '向iframe嵌套的页面，写的事件----this.show');
    // }
  },
  beforeDestroy:function(){
    // // console.log(this.isshow,'销毁之前-----------------------');
    // this.isshow = true;
    // window.sessionStorage.setItem("isshow",this.isshow);
    // this.isshow = window.sessionStorage.getItem("isshow");
    // // console.log(this.isshow,'---------------------------销毁');
  },
  methods: {
    /** 查询智能感知终端升压站列表 */
    getBoosterList() {
      this.loading = true;
      const systemTypeParams = {};
      systemTypeParams.systemType = "booster";
      listCamera(systemTypeParams).then(response => {
        // this.cameraList = response.rows;
        // this.total = response.total;
        this.loading = false;
        if(!response.rows.length){
          this.boosterBiaoshi = false;
          this.fanTabName = 'first';
          console.log(this.boosterBiaoshi,this.fanTabName,"~~~~~~~~if~~booster~~不显示升压站~~~~~",response.rows)
        }else{
          this.boosterBiaoshi = true;
          // this.boosterTabName = 'second'
          console.log(this.boosterBiaoshi,"~~~~~~~~else~~booster~显示升压站~youzhi~~~~~",response.rows)
        }
      });
    }, 
    /** 查询智能感知终端风机列表 */
    getPreList() {
      this.loading = true;
      const systemTypeParams = {};
      systemTypeParams.systemType = "fan";
      listCamera(systemTypeParams).then(response => {
        // this.cameraList = response.rows;
        // this.total = response.total;
        this.loading = false;
        if(!response.rows.length){
          this.fanBiaoshi = false;
          console.log(this.fanBiaoshi,"~~~~~~~~if~~~~不显示风点击~~~~~",response.rows)
        }else{
          this.fanBiaoshi = true;
          console.log(this.fanBiaoshi,"~~~~~~~~else~~youzhi~显示风点击~~~~~~",response.rows)
        }
      });
    },
    // tab标签点击事件
    handlePreClick(tab, event) {
      console.log("---",tab.index);
      let htmlForBack = document.getElementById("videoiframes").contentWindow;
      // htmlForBack.dianji(tab.index);
    }, 
    // // //动态获取告警图片IP地址
    getcameraip(){
      listConfig().then(response => {
        console.log(response.rows,'全局匹配的一些参数');
        response.rows.map((v)=>{
          // // 图片服务器地址
          // if(v.configKey == "server.fdfs.ip"){
          //   this.alarmimgipurl = v.configValue;
          //   window.sessionStorage.setItem("alarmimgipurl",this.alarmimgipurl);
          // }
          // 摄像头账号
          if(v.configKey == "config.camera.username"){
            this.camerauser = v.configValue;
            window.sessionStorage.setItem("camerauser",this.camerauser);
          }
          // 摄像头密码
           if(v.configKey == "config.camera.password"){
            this.camerapassword = v.configValue;
            window.sessionStorage.setItem("camerapassword",this.camerapassword);
          }
          // NVR服务器IP
          if(v.configKey == "server.nvr.ip"){
            this.nvrip = v.configValue;
            window.sessionStorage.setItem("nvrip",this.nvrip);
          }
        })
      });
    },

    // 查询的摄像头下拉
    // getshexiangtoulist() {
    //   listCamera().then(response => {
    //     console.log(response,"摄像头下拉列表");
    //     this.shexiangtoulist = response.rows;
    //     setTimeout(()=>{
    //       listArea().then(response => {
    //         // console.log(response.data,'区域下拉列表');
    //           response.data.map((v)=>{
    //             // console.log(v)
    //             this.shexiangtoulist.map((y)=>{
    //               // console.log(y)
    //               if(v.areaId == y.area.areaId){
    //                 y.areaId = y.cameraId;
    //                 y.areaName = y.cameraName;
    //                 v.children.push(y);
    //               }
    //             })
    //           }) 
    //           this.quyulist = [];
    //           const data = { areaId: 0, areaName: "根目录", children: [] };
    //           data.children = this.handleTree( response.data, "areaId", "parentId");
    //           this.quyulist.push(data);
    //           console.log(this.quyulist,'获取到带有摄像头的区域列表');
    //       });
    //     },500);
    //   });
    // },
    // 区域下拉列表
    // getquyulist() {
    //   // setTimeout(()=>{
    //   //   listArea().then(response => {
    //   //     // console.log(response.data,'区域下拉列表');
    //   //       response.data.map((v)=>{
    //   //         // console.log(v)
    //   //         this.shexiangtoulist.map((y)=>{
    //   //           // console.log(y)
    //   //           if(v.areaId == y.area.areaId){
    //   //               y.areaId = y.cameraId;
    //   //               y.areaName = y.cameraName;
    //   //               v.children.push(y);
    //   //           }
    //   //         })
    //   //       }) 
    //   //       this.quyulist = [];
    //   //       const data = { areaId: 0, areaName: "根目录", children: [] };
    //   //       data.children = this.handleTree( response.data, "areaId", "parentId");
    //   //       this.quyulist.push(data);
    //   //       console.log(this.quyulist,'获取到带有摄像头的区域列表');
    //   //   });
    //   // },80);
    // },

    // sendMessage(){
    //     console.log('向iframe嵌套的页面要传的参数');
    //     this.iframe.postMessage({
    //       data:this.quyulist,
    //       cameralist:this.shexiangtoulist
    //     },'*');
    // },
  },
  watch: {
    
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  min-height: calc(100vh - 300px);
}
.videoContent {
  width: 100%;
  height: 1000px !important;

  // .treenav{
  //   width: 250px;
  //   height: 600px;
  // }
  
  // .searchinput{
  //   width: 250px;
  // }

  // .el-treenav{
  //   width: 250px;
  //   overflow: auto;
  // }
  
}
@media (max-width:1600px){
  // .treenav{
  //   width: 200px;
  //   height: 600px;
  // }
  
  // .searchinput{
  //   width: 200px;
  // }

  // .el-treenav{
  //   width: 200px;
  //   overflow: auto;
  // }
  // /deep/.el-tree-node>.el-tree-node__children {
  //   overflow: inherit;
  //   background-color: transparent;
  // }
}


</style>