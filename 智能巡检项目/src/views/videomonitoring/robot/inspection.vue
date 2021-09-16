<template>
  <div class="app-container">
    <el-header>
      <h1>一键巡检</h1>
    </el-header>
    <h3 class="contenttitle">任务名称：{{planname}}</h3>
    <el-row class="controls" v-if="false">
      <el-button plain @click="Akeyinspection">开始巡检</el-button>
      <el-button plain @click="Suspendedinspection">暂停巡检</el-button>
      <el-button plain @click="Continuetoinspection">继续巡检</el-button>
      <el-button plain @click="Emergencystop">紧急停止</el-button>
      <el-button plain @click="Amasterreset">一键复位</el-button>
      <el-button plain @click="exportresult">导出结果</el-button>
    </el-row>
    <el-row class="main">
      <el-col :span="14">
         <iframe
            ref="iframe"
            id="akeypollingiframe"
            name="akeypollingiframe"
            src="../../../../robot/cn/akeypolling.html"
            frameborder="0"
            scrolling="no"
            style="width: 800px; height: 600px; z-index: -1"
          ></iframe>
      </el-col>
      <el-col :span="10">
        <div class="details">
          <p>巡检一开始，已完成{{total}}项，共{{finished}}项 <el-button plain @click="exportresult">导出结果</el-button> </p>
          <ul v-for="(item,index) in tableData" :key="index">
            <li>{{item.siteName}},已完成{{item.finished}}/{{item.total}}项。<span class="btn" @click="seeresult(item)">查看结果</span> <span class="timebtn">{{item.time}}</span> </li>
          </ul>
          <!-- <ul>
            <li>巡检一开始，已完成X项，共Y项</li>
            <li>预置位1开始巡检，已完成5/5项，<span @click="seeresult">查看结果。</span><span>12:30:07</span></li>
            <li>预置位2开始巡检，已完成5/5项，<span>查看结果。</span><span>12:30:07</span></li>
          </ul> -->
          <!-- <el-table :data="tableData" :show-header="showHeader">
            <el-table-column  prop="name" label="姓名">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="seeresult(scope.row)"  type="text">查看结果</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="时间">
            </el-table-column>
          </el-table> -->
        </div>
      </el-col>
    </el-row>

    <el-dialog title="预置位巡检结果" :visible.sync="resultVisible" width="30%">
      <div>
        <iframe cals="newiframe" src="" style="position: absolute; left: 0; top: 0; z-index:-1; width: 100%; height: 100%; background-color: transparent; opacity:0; " frameborder="0"></iframe>
        <el-table style="width: 100%" :data="resultData">
          <el-table-column prop="date" label="日期">
          </el-table-column>
          <el-table-column prop="meterName" label="表计名称">
          </el-table-column>
          <el-table-column prop="address" label="地址">
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="resultVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

  </div>
</template> 
<script>
import { listConfig } from "@/api/system/config"; //从参数管理中获取全局属性
import { getinspectionInfo } from "@/api/videomonitoring/robot";

export default { 
  data() {
    return {
      itemId:"",
      planname:"", 
      timer:null,
      recordId:"",
      robothttpip: "", //请求http的ip
      robotId: "", //机器人id
      robotcameraip: "", //机器人上摄像头的ip;
      cameraport:"",
      camerauser:"",
      camerapassword:"",
      resultVisible:false,
      queryform:{},
      total:0,
      finished:0,
      tableData: [
        {id:"1",name :"小小",time:"2:10"},
        {id:"2",name :"晓晓",time:"2:11"},
      ],
      // showHeader:false,
      tableHead:[
        {
          column_name: "column_name",column_comment:"姓名"
        },
        {
          column_name: "column_age",column_comment:"年龄"
        },
        {
          column_name: "column_sex",column_comment:"性别"
        }
      ],
      resultData:[
        {
          column_age: '18',
          column_name: '关晓彤',
          column_sex: '女'
        }
      ],
    };
  },
  created: function () {
    this.getrobotip();
    this.recordId = undefined;
    this.itemId = undefined;
  },
  mounted: function () {
    console.log(this.$route.query);
    this.itemId = this.$route.query.itemId;
    this.planname = this.$route.query.itemName;
    this.recordId = this.$route.query.recordId;
    this.robotId = this.$route.query.robotid;
    window.sessionStorage.setItem("robotId",this.robotId);
    this.robotcameraip = this.$route.query.robotcameraip;
    window.sessionStorage.setItem("robotcameraip",this.robotcameraip);
    this.cameraport = this.$route.query.cameraport;
    window.sessionStorage.setItem("cameraport",this.cameraport);
    this.camerauser = this.$route.query.camerauser;
    window.sessionStorage.setItem("camerauser",this.camerauser);
    this.camerapassword = this.$route.query.camerapassword;
    window.sessionStorage.setItem("camerapassword",this.camerapassword);
    if(this.recordId != undefined && this.itemId != undefined){
      var query = {
        recordId:this.recordId,
        itemId:this.itemId
      }
      this.timer = setInterval(() => {
        getinspectionInfo(query).then((response)=>{
          console.log(response)
          this.total = response.total;
          this.finished = response.finished;
          this.tableData = response.datas
        })
      }, 1000*60);
    }
  },
  destroyed: function () {
    window.frames['akeypollingiframe'].clickStopRealPlay();
    window.frames['akeypollingiframe'].clickLogout();
    clearInterval(this.timer);
  },
  methods: {
    // // //动态获取告警图片IP地址
    getrobotip() {
      listConfig().then((response) => {
        // console.log(response.rows, "全局匹配的一些参数");
        response.rows.map((v) => {
          // 机器人请求ip
          if (v.configKey == "location.robot.ip") {
            this.robothttpip = "http://" + v.configValue;
            window.sessionStorage.setItem("getrobothttpip", this.robothttpip);
          }
        });
      });
    },
    
    // /** ------------------------------机器人操作----------------------------- */
    Akeyinspection(){
      // console.log("机器人开始巡检");
      // this.queryform = {
      //   robotId:this.robotId,
      //   itemId:this.itemId
      // }
      // console.log(this.queryform);
      // getinspectionStart(this.queryform).then((response)=>{
      //   console.log(response.recordId)
      //   this.recordId = response.recordId;
      //   this.timer = setInterval(() => {
      //     this.getinspectionlist();
      //   }, 1000*60);
      // })
      // window.frames['akeypollingiframe'].Akeyinspection('Start');
    },
    Suspendedinspection(){
      console.log('机器人暂停巡检');
      // window.frames['akeypollingiframe'].Akeyinspection('Pause');
    },
    Continuetoinspection(){
      console.log('机器人继续巡检');
      // window.frames['akeypollingiframe'].Continuetoinspection('Resume');
    },
    Amasterreset(){
      console.log("机器人一键复位");
      // window.frames['akeypollingiframe'].Amasterreset();
    },
    Emergencystop(){
      console.log("机器人紧急停止")
      // window.frames['akeypollingiframe'].Emergencystop();
    },
    exportresult(){
      console.log('导出结果');
    },
    getinspectionlist(){
      this.queryform = {
        recordId:this.recordId,
        itemId:this.itemId
      }
      getinspectionInfo(this.queryform).then((res)=>{
        console.log(res,'获取巡检结果');
      })
    },
    seeresult(item){
      console.log(item);
      var query = {
        recordId:this.recordId,
        siteId:item.siteId
      }
      getmeterInfo(query).then((res)=>{
        console.log(res);
      })
      this.resultVisible = true;
    },
  },
  watch: {
    
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-table .el-table__header-wrapper th{
  font-size: 15px !important;
}
/deep/.el-table{
  background-color: #f8f8f8 !important;
}
/deep/.el-table tr{
  background-color: #f8f8f8 !important;
}
/deep/.el-table--group::after, .el-table--border::after, .el-table::before{
  background-color: #f8f8f8 !important;
}
/deep/ .el-table td{
  border-bottom:none !important;
}
/deep/ .el-table__body-wrapper{
  border-bottom: none !important;
}
.app-container {
  min-height: calc(100vh - 300px);
  .contenttitle{
    line-height: 40px;
  }

  .controls{
    margin-bottom: 10px;
  }

  .main{
    .plugin{
      width: 800px;
      height: 600px;
    }

    .details{
      background-color: #f8f8f8;
      padding: 10px;
      ul{
        list-style: none;
        padding-left: 10px;
        li{
          line-height: 35px;
          .btn{
            margin-left: 10px;
          }
          .timebtn{
            margin-left: 10px;
          }
        }
      }
    }

  }
}
/deep/.el-button--text{
  border-color: transparent !important;
  color: #409eff !important;
  background: transparent !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
/deep/.el-menu{
  border-right: none;
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