<template>
  <div class="app-container">
    <!-- <el-alert
      :title="selectRel"
      type=""
      :closable="false">
    </el-alert> -->
    <el-row type="flex" class="row-bg">
      <el-col :span="4">
        <div>请选择机器人</div>
        <el-menu ref="select" @select="changerobot" >
          <el-menu-item v-for="item in robotlist" :key="item.robotId" :index="item.robotId">
            <span slot="title">{{item.robotName}}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <div class="content">
          <iframe
            ref="iframe"
            id="robotiframes"
            name="robotiframes"
            src="../../../../robot/cn/demo.html"
            frameborder="0"
            scrolling="no"
            style="width: 1000px; height: 620px; z-index: -1"
          ></iframe>
        </div>
        <div class="operation">
          <el-row v-if="isRobotChosen">
            <label for="">自动模式:</label>
            <el-button plain @click="autoClick(automaticmode)">{{automaticmode}}</el-button>
            <!-- <el-button plain @click="Akeyinspection" v-if="automaticmode == '关'?true:false">一键巡检</el-button> -->
            <el-button plain @click="Amasterreset" v-if="automaticmode == '开'?true:false">一键复位</el-button>
            <!-- <el-button plain @click="Emergencystop" v-if="automaticmode == '开'?true:false">紧急停止</el-button> -->
          </el-row>
          <div class="controls" v-if="isautomaticmodel">
            <div class="robotcontrol">
              <p><i></i> 机器人控制</p>
              <el-row class="rowstyle">
                <el-col></el-col>
                <el-col><el-button plain @click="robottop">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button></el-col>
                <el-col></el-col>
              </el-row>
              <el-row class="rowstyle">
                <el-col><el-button plain @click="robotleft">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;左&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button></el-col>
                <el-col><el-button plain @click="robotstop">&nbsp;&nbsp;&nbsp;暂停&nbsp;&nbsp;&nbsp;</el-button></el-col>
                <el-col><el-button plain @click="robotright">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;右&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button></el-col>
              </el-row>
              <el-row class="rowstyle">
                <el-col></el-col>
                <el-col><el-button plain @click="robotbottom">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button></el-col>
                <el-col></el-col>
              </el-row>
              <!-- <el-row class="rowstyle">
                <el-col><el-button plain @click="Akeyinspection">一键巡检</el-button></el-col>
                <el-col v-if="false"><el-button plain @click="Amasterreset">一键复位</el-button></el-col>
                <el-col v-if="false"><el-button plain @click="Emergencystop">紧急停止</el-button></el-col>
              </el-row> -->
            </div>
            <div class="cameracontrol">
              <p><i></i> 云台控制</p>
              <el-row class="rowstyle">
                <!-- <el-col> <input type="button" class="camerabtn" onmousedown="cameraupleft('left')" onmouseup="mouseUpPTZControl" value="左上" /></el-col> -->
                <el-col><button style="color:#fff;background-color:#1890ff;border-color:#1890ff;padding:6px 13px;font-size:12px;border-radius:3px;border:none;cursor:pointer;" v-on:mousedown="cameraupleft" v-on:mouseup="mouseUpPTZControl">&nbsp;左上&nbsp;</button></el-col>
                <el-col><button style="color:#fff;background-color:#1890ff;border-color:#1890ff;padding:6px 13px;font-size:12px;border-radius:3px;border:none;cursor:pointer;" v-on:mousedown="cameratop" v-on:mouseup="mouseUpPTZControl">&nbsp;&nbsp;上&nbsp;&nbsp;</button></el-col>
                <el-col><button style="color:#fff;background-color:#1890ff;border-color:#1890ff;padding:6px 13px;font-size:12px;border-radius:3px;border:none;cursor:pointer;" v-on:mousedown="cameraupright" v-on:mouseup="mouseUpPTZControl">&nbsp;右上&nbsp;</button></el-col>
                <el-col><button style="color:#fff;background-color:#1890ff;border-color:#1890ff;padding:6px 13px;font-size:12px;border-radius:3px;border:none;cursor:pointer;" v-on:mousedown="PTZZoomIn" v-on:mouseup="PTZZoomStop">变倍+</button></el-col>
                <el-col><button style="color:#fff;background-color:#1890ff;border-color:#1890ff;padding:6px 13px;font-size:12px;border-radius:3px;border:none;cursor:pointer;" v-on:mousedown="PTZZoomout" v-on:mouseup="PTZZoomStop">变倍-</button></el-col>
              </el-row>
              <el-row class="rowstyle">
                <el-col><button style="color:#fff;background-color:#1890ff;border-color:#1890ff;padding:6px 13px;font-size:12px;border-radius:3px;border:none;cursor:pointer;" v-on:mousedown="cameraleft" v-on:mouseup="mouseUpPTZControl">&nbsp;&nbsp;左&nbsp;&nbsp;</button></el-col>
                <el-col><button style="color:#fff;background-color:#1890ff;border-color:#1890ff;padding:6px 13px;font-size:12px;border-radius:3px;border:none;cursor:pointer;" v-on:mousedown="cameraauto" v-on:mouseup="mouseUpPTZControl">&nbsp;自动&nbsp;</button></el-col>
                <el-col><button style="color:#fff;background-color:#1890ff;border-color:#1890ff;padding:6px 13px;font-size:12px;border-radius:3px;border:none;cursor:pointer;" v-on:mousedown="cameraright" v-on:mouseup="mouseUpPTZControl">&nbsp;&nbsp;右&nbsp;&nbsp;</button></el-col>
                <el-col><button style="color:#fff;background-color:#1890ff;border-color:#1890ff;padding:6px 13px;font-size:12px;border-radius:3px;border:none;cursor:pointer;" v-on:mousedown="PTZFocusIn" v-on:mouseup="PTZFoucusStop">变焦+</button></el-col>
                <el-col><button style="color:#fff;background-color:#1890ff;border-color:#1890ff;padding:6px 13px;font-size:12px;border-radius:3px;border:none;cursor:pointer;" v-on:mousedown="PTZFoucusOut" v-on:mouseup="PTZFoucusStop">变焦-</button></el-col>
              </el-row>
              <el-row class="rowstyle">
                <el-col><button style="color:#fff;background-color:#1890ff;border-color:#1890ff;padding:6px 13px;font-size:12px;border-radius:3px;border:none;cursor:pointer;" v-on:mousedown="cameralowerleft" v-on:mouseup="mouseUpPTZControl">&nbsp;左下&nbsp;</button></el-col>
                <el-col><button style="color:#fff;background-color:#1890ff;border-color:#1890ff;padding:6px 13px;font-size:12px;border-radius:3px;border:none;cursor:pointer;" v-on:mousedown="camerabottom" v-on:mouseup="mouseUpPTZControl">&nbsp;&nbsp;下&nbsp;&nbsp;</button></el-col>
                <el-col><button style="color:#fff;background-color:#1890ff;border-color:#1890ff;padding:6px 13px;font-size:12px;border-radius:3px;border:none;cursor:pointer;" v-on:mousedown="cameralowerright" v-on:mouseup="mouseUpPTZControl">&nbsp;右下&nbsp;</button></el-col>
                <el-col><button style="color:#fff;background-color:#1890ff;border-color:#1890ff;padding:6px 13px;font-size:12px;border-radius:3px;border:none;cursor:pointer;" v-on:mousedown="PTZIrisIn" v-on:mouseup="PTZIrisStop">光圈+</button></el-col>
                <el-col><button style="color:#fff;background-color:#1890ff;border-color:#1890ff;padding:6px 13px;font-size:12px;border-radius:3px;border:none;cursor:pointer;" v-on:mousedown="PTZIrisOut" v-on:mouseup="PTZIrisStop">光圈-</button></el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog class="dialog errInfo" title="选择任务" :visible.sync="patrolschemeVisible" width="50%" style="margin-top:70px;" :before-close="cancelinspection">
      
      <iframe cals="newiframe" src="" style="position: absolute; left: 0; top: 0; z-index:-1; width: 100%; height: 100%; background-color: transparent; opacity:0; " frameborder="0"></iframe>
        
      <div class="dialogmain">
        <el-col :span="3">
          <label>巡检任务:</label>
        </el-col>
        <el-col :span="21">
          <el-radio-group v-model="Inspectionplan" @change="planchnage">
            <el-row>
              <el-col :span="8" class="xjjh-col" v-for="item in Inspectionplanoptions" :key="item.itemId">
                <el-radio :label="item.itemId">{{item.itemName}}</el-radio>
              </el-col>
            </el-row>
          </el-radio-group>
        </el-col>
        <!-- <el-select v-model="Inspectionplan" @change="planchnage" placeholder="请选择巡检任务" style="height:70px;">
          <el-option
            v-for="item in Inspectionplanoptions"
            :key="item.itemId"
            :label="item.itemName"
            :value="item.itemId">
          </el-option>
        </el-select> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelinspection">取 消</el-button>
        <el-button type="primary" @click="openinspection">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template> 
<script>
import { listConfig } from "@/api/system/config"; //从参数管理中获取全局属性
import { listRobot } from "@/api/device/robot";
import { listCamera } from "@/api/device/camera";
import { getautostatus,getlasttime,listpollingplan,getinspectionStart } from "@/api/videomonitoring/robot";


export default {
  data() {
    return {
      isrouter: false,
      camerauser:"",
      camerapassword:"",
      robotip: "", //请求http的ip
      robotcameraip: "", //机器人上摄像头的ip;
      cameraport:"",
      robotid: "", //机器人id
      robotlist: [],
      // robotId: "",
      robotdata: {},
      ruleForm: {},
      rules: {},
      automaticmode:"",
      // automaticmodeoptions:[
      //   {automaticmode:"0",automaticmodelabel:"关",disabled:false},
      //   {automaticmode:"1",automaticmodelabel:"开",disabled:false}
      // ],
      isautomaticmodel:true,
      timer:"",
      tipmsg:"",
      patrolschemeVisible: false,
      Inspectionplan:"",
      Inspectionplanoptions:[],
      itemId:"",
      itemName:"",
      recordId:"",

      isRobotChosen: false, // 根据是否选中机器人显示自动巡检按钮
    };
  },
  created: function () {
    this.automaticmode = "";
    this.isautomaticmodel = false;
    this.getrobotip();
    this.getrobotlist();
    window.sessionStorage.setItem("getrobotcameraip", null);
    window.sessionStorage.setItem("getrobotid", null);
  },
  mounted: function () {  
    // --------hk添加--------------
    console.log(this.$route.query.querycameraip);
    console.log(this.$route.query.querycameraip === undefined);
    this.robotcameraip = this.$route.query.querycameraip;
    if (this.$route.query.querycameraip === undefined) {
      this.isrouter = false;
    } else {
      this.isrouter = true;
      this.robotlist.map((q) => {
        console.log(q);
        if (q.cameraId == this.$route.query.querycameraid) {
          this.robotid = q.robotid;
          window.sessionStorage.setItem("getrobotid", this.robotid);
          window.sessionStorage.setItem("getrobotcameraip", this.robotcameraip);
          var _iframe = document.getElementById("robotiframes");
          _iframe.contentWindow.location.reload(true);
        }
      });
    }
  },
  destroyed() {
    window.sessionStorage.setItem("getrobotcameraip", null);
    window.sessionStorage.setItem("getrobotid", null);
    window.frames['robotiframes'].clickStopRealPlay();
    window.frames['robotiframes'].clickLogout();
    clearInterval(this.timer);
  },
  methods: {
    // // //动态获取告警图片IP地址
    getrobotip() {
      listConfig().then((response) => {
        // console.log(response.rows, "全局匹配的一些参数");
        // response.rows.map((v) => {
        //   // 机器人请求ip
        //   if (v.configKey == "location.robot.ip") {
        //     this.robotip = "http://" + v.configValue;
        //     console.log(this.robotip, "-----------机器人httpIP");
        //     window.sessionStorage.setItem("getrobotip", this.robotip);
        //   }
        // });
      });
    },
    getrobotlist() {
      listRobot().then((response) => {
        console.log(response.rows, "机器人列表");
        this.robotlist = response.rows;
      });
    },
    changerobot(val) {
      console.log(val); //获取机器人id;
      this.isRobotChosen = true;
      var _iframe = document.getElementById("robotiframes");
      _iframe.contentWindow.location.reload(true);
      this.robotid = val;
      window.sessionStorage.setItem("getrobotid", this.robotid);
      this.robotlist.map((y) => {
        if (this.robotid == y.robotId) {
          this.robotdata = y; //获取机器人绑定的摄像头名称和id
          // autoExec： "0":关  "1":开
          console.log(y,'-----y----');
          if(y.autoExec == "0"){
            this.automaticmode = "关"
            this.isautomaticmodel = true;
          }else if(y.autoExec == "1"){
            this.automaticmode = "开"
            this.isautomaticmodel = false;
          }
          var queryform = {
            cameraName: this.robotdata.cameraName,
          };
          listCamera(queryform).then((response) => {
            response.rows.map((v) => {
              if (v.cameraId === this.robotdata.cameraId) {
                console.log(v,'通过摄像头id拿ip'); //通过摄像头id拿ip;
                this.robotcameraip = v.ip;
                window.sessionStorage.setItem("getrobotcameraip",this.robotcameraip);
                this.cameraport = v.port;
                window.sessionStorage.setItem("cameraport", this.cameraport);
                this.camerauser = v.username;
                window.sessionStorage.setItem("camerauser", this.camerauser);
                this.camerapassword = v.password;
                window.sessionStorage.setItem( "camerapassword", this.camerapassword);
              }
            });
          });
        }
      });
    },
    // // 获取巡检任务最近的一次时间
    getplayLasttime(){
      getlasttime(this.robotid).then((response)=>{
        console.log(response);
      })
    },
    // 更改自动模式状态
    // changetip(val){
    //   console.log(val);
      // if(val == 1){ //开
      //   this.tipmsg = "";
      //   this.isautomaticmodel = false;
      // }else if(val == 0){ //关
      //   this.isautomaticmodel = true;
      //   console.log(this.robotid);
      //   getautostatus(this.robotid).then((res)=>{
      //     console.log(res,res.status);
      //     if(res.status == true){
      //       // this.tipmsg = "下一次自动巡检开始还有"+res.startTime+"，关闭自动模式不会执行自动巡检";
      //       this.$message({
      //         dangerouslyUseHTMLString: true,
      //         message: this.tipmsg,
      //         offset:700
      //       });
      //     }else if(res.status == "false"){
      //       this.tipmsg = "正在执行巡检任务，不能切换模式";
      //       this.automaticmode = "1";
      //       this.$message({
      //         dangerouslyUseHTMLString: true,
      //         message: this.tipmsg,
      //         offset:700
      //       });
      //     }
      //   })
      // }
    // },
    autoClick(val){
      console.log(val)
      if(val == "关"){
        this.automaticmode = "开";
        this.isautomaticmodel = false;
        this.timer = setInterval(this.getplayLasttime(), 1000*60);
      }else if(val == "开"){
        this.timer = setInterval(this.getplayLasttime(), 1000*60);
        getautostatus(this.robotid).then((res)=>{
          console.log(res,res.status == false);
          if(res.status == false){
            this.tipmsg = "正在执行巡检任务，不能切换模式";
            this.automaticmode = "开";
            this.isautomaticmodel = false;
            this.$message({
              dangerouslyUseHTMLString: true,
              message: this.tipmsg,
              offset:700
            });
          }else if(res.status == true){
            this.automaticmode = "关";
            this.isautomaticmodel = true;
            clearInterval(this.timer);
          }
        })
      }
    },
    // 获取巡检计划列表
    getpollinglist(){
      listpollingplan().then((res)=>{
        console.log(res.rows,'巡检计划');
        this.Inspectionplanoptions = res.rows;
      })
    },
    /** ------------------------------机器人操作----------------------------- */
    robottop(){
      console.log("机器人向上移动")
      window.frames['robotiframes'].mouseDownRBTControl(7);
    },
    robotleft(){
      console.log("机器人向左移动")
      window.frames['robotiframes'].mouseDownRBTControl(1);
    },
    robotstop(){
      console.log("机器人暂停移动")
      window.frames['robotiframes'].mouseDownRBTControl(99);
    },
    robotright(){
      console.log("机器人向右移动")
      window.frames['robotiframes'].mouseDownRBTControl(3);
    },
    robotbottom(){
      console.log("机器人向下移动")
      window.frames['robotiframes'].mouseDownRBTControl(9);
    },
    Akeyinspection(){
      console.log("机器人一键巡检");
      this.patrolschemeVisible = true;
      this.getpollinglist();
      // window.frames['robotiframes'].Akeyinspection('Start');
    },
    Amasterreset(){
      console.log("机器人一键复位")
      window.frames['robotiframes'].Amasterreset();
    },
    Emergencystop(){
      console.log("机器人紧急停止")
      window.frames['robotiframes'].Emergencystop();
    },

    /** ------------------摄像头操作-------------------- */
    cameraupleft(){
      console.log("摄像头左上移动")
      window.frames['robotiframes'].mouseDownPTZControl(5);
    },
    cameratop(){
      console.log("摄像头向上移动")
      window.frames['robotiframes'].mouseDownPTZControl(1);
    },
    cameraupright(){
      console.log("摄像头右上移动")
      window.frames['robotiframes'].mouseDownPTZControl(7);
    },
    cameraleft(){
      console.log("摄像头左移动")
      window.frames['robotiframes'].mouseDownPTZControl(3);
    },
    cameraauto(){
      console.log("摄像头自动移动")
      window.frames['robotiframes'].mouseDownPTZControl(9);
    },
    cameraright(){
      console.log("摄像头右移动")
      window.frames['robotiframes'].mouseDownPTZControl(4);
    },
    cameralowerleft(){
      console.log("摄像头左下移动")
      window.frames['robotiframes'].mouseDownPTZControl(6);
    },
    camerabottom(){
      console.log("摄像头下移动")
      window.frames['robotiframes'].mouseDownPTZControl(2);
    },
    cameralowerright(){
      console.log("摄像头右下移动")
      window.frames['robotiframes'].mouseDownPTZControl(8);
    },
    mouseUpPTZControl(){
      console.log("摄像头鼠标离开停止移动")
      window.frames['robotiframes'].mouseUpPTZControl();
    },
    PTZZoomIn(){
      console.log("摄像头变倍+")
      window.frames['robotiframes'].PTZZoomIn();
    },
    PTZZoomout(){
      console.log("摄像头变倍-")
      window.frames['robotiframes'].PTZZoomout();
    },
    PTZZoomStop(){
      console.log("摄像头停止变倍")
      window.frames['robotiframes'].PTZZoomStop();
    },
    PTZFocusIn(){
      console.log("摄像头变焦+")
      window.frames['robotiframes'].PTZFocusIn();
    },
    PTZFoucusOut(){
      console.log("摄像头变焦-")
      window.frames['robotiframes'].PTZFoucusOut();
    },
    PTZFoucusStop(){
      console.log("摄像头停止变焦")
      window.frames['robotiframes'].PTZFoucusStop();
    },
    PTZIrisIn(){
      console.log("摄像头光圈+")
      window.frames['robotiframes'].PTZIrisIn();
    },
    PTZIrisOut(){
      console.log("摄像头光圈-")
      window.frames['robotiframes'].PTZIrisOut();
    },
    PTZIrisStop(){
      console.log("摄像头停止光圈")
      window.frames['robotiframes'].PTZIrisStop();
    },

    planchnage(val){
      console.log(val);
      this.Inspectionplanoptions.map((v)=>{
        if(v.itemId == val){
          console.log(v);
          this.itemId = v.itemId;
          this.itemName = v.itemName;
        }
      })
    },
    cancelinspection(){
      this.patrolschemeVisible = false;
      this.Inspectionplan = undefined;
    },
    openinspection(){
      var query = {
        robotId:this.robotid,
        itemId:this.itemId
      }
      if(query.itemId == ""){
          this.$message({
            message: '请选择巡检任务',
            type: 'error'
          });
          return ;
      }
      getinspectionStart(query).then((response)=>{
        if(response.recordId == undefined){
          this.$message({
            message: '该任务下机器人的预置位坐标没有配置!',
            type: 'warning'
          });
          this.patrolschemeVisible = false;
        }else if(response.recordId != undefined){
          this.recordId = response.recordId;
          this.$router.push({path:'/videomonitoring/robot/inspection',
            query:{robotid:this.robotid,robotcameraip:this.robotcameraip,cameraport:this.cameraport,camerauser:this.camerauser,camerapassword:this.camerapassword,itemId:this.itemId,itemName:this.itemName,recordId:this.recordId}
          })
        }
      })
    },
  },
  watch: {
    // automaticmode:{
    //   handler(oldval,newval){
    //     console.log(oldval,'---0--',newval,'0-------------0')
    //     if(oldval == "1"){
    //     //   getautostatus(this.robotid).then((res)=>{
    //     //     console.log(res,res.status);
    //     //     if(res.status == "false"){
    //     //       this.tipmsg = "正在执行巡检任务，不能切换模式";
    //     //       this.automaticmode = "1";
    //     //       this.$message({
    //     //         dangerouslyUseHTMLString: true,
    //     //         message: this.tipmsg,
    //     //         offset:700
    //     //       });
    //     //     }
    //     //   })
    //     }
    //   },
    //   deep:true
    // }
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  min-height: calc(100vh - 300px);
}
/deep/.el-menu{
  border-right: none;
}
/deep/.el-scrollbar {
  height: 40px !important;
}
/deep/ .el-select-dropdown,
/deep/ .el-popper {
  height: 79px !important;
  overflow-y: scroll;
}

.el-radio--medium.is-bordered {
  margin-bottom: 10px;
}
.operation{
  margin-top: 10px;
  .tip{
    color: red;
    margin-left: 15px;
  }
  .controls{
    margin-top: 10px;
    display: flex;
    .robotcontrol{
      width: 280px;
      padding: 10px;
      background: #f8f8f8;
      
      p{
        border-bottom: 1px solid #ababab;
        line-height: 30px;
        margin-bottom: 15px;
        i{
          border-left: 5px solid #1b91fd;
          margin-right: 5px;
        }
      }

      .rowstyle{
        margin-top: 8px;
        text-align: center;
        display: flex;
        // /deep/.camerabtn{
        //   color: #fff !important;
        //   background-color: #1890ff !important;
        //   border-color: #1890ff !important;
        //   padding: 6px 13px !important;
        //   font-size: 12px;
        //   border-radius: 3px;
        //   border: none;
        //   cursor: pointer;
        // }
      }
    }
    .cameracontrol{
      margin-left: 20px;
      width: 380px;
      padding: 10px;
      background: #f8f8f8;
      
      p{
        border-bottom: 1px solid #ababab;
        line-height: 30px;
        margin-bottom: 15px;
        i{
          border-left: 5px solid #1b91fd;
          margin-right: 5px;
        }
      }

      .rowstyle{
        margin-top: 8px;
        text-align: center;
        display: flex;
      }
    }
    .errInfo {
      position: fixed;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999;
    }
    // .dialogmain{
    //   height: 300px;
    // }
  }
}
.xjjh-col {
  line-height: 30px;
}
/deep/ .el-dialog__body {
  height: 200px;
}
/deep/ .el-select-dropdown__list {
  height: 150px;
  overflow-y: scroll;
}
</style>