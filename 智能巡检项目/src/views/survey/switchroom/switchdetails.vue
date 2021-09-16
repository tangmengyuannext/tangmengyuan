<template>
  <div class="app-container">
    <div class="switchroom">
      <div class="header">
        <h2 class="title">配电室详情<span class="biaoshi">名称：{{this.switchpageTitle}}</span></h2>
        <div class="right-alarm" @click="alarmTableVisible = true">
          <el-badge :value="total" :max="999" class="item">
            <img :src="alarmSrc" style="width: 30px; height: 30px;"/>
          </el-badge>
        </div>
      </div>
      <div style="clear:both;height:0px;"></div>
      <div class="switchroomchart" v-if="this.$route.path.split('/')[this.$route.path.split('/').length - 1]==905?false:true">
        <el-row>
          <el-col :span="6">
            <h3 class="linetitle">温度曲线</h3>
          </el-col>
          <el-col :span="18">
            <el-form :inline="true" :model="cameraParam" class="demo-form-inline">
              <el-form-item label="设备列表" style="margin-bottom: 0px;">
                <div class="dev-select">
                  <el-select multiple collapse-tags v-model="cameraParam.cameraIds" filterable placeholder="设备列表"  @change="changeCamera">
                    <el-option
                      v-for="dict in cameraList"
                      :key="dict.devAreaTempId"
                      :label="dict.areaTempName"
                      :value="dict.devAreaTempId"
                    ></el-option>
                  </el-select>
                </div>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <div class="linecont">
          <line-chart :chart-data="booster24templist"></line-chart>
        </div>
      </div>
        <overview :data="overviewData"/>
     <!-- <div class="pictureshow">
         <h3 class="picturetitle">配电室示意图</h3>
        <div class="imgcol">
          <div class="imgdiv">
            <el-carousel class="lunbodiv" height="345px" indicator-position="none" :loop="false" :autoplay="false">
              <el-carousel-item v-for="item in imglist" :key="item.id">
                <div class="card_pre">
                  <img :src="item.imgSrc" class="w100p bd_blue bgimg">
                  <div class="pos_ab top_0 left_0 h100p w100p bd_ccc">
                    <span class="mg_20" v-for="(imgspan) in item.ilist" :key="imgspan.ip" @click="showModal(imgspan)">
                      <img :src="imgspan.tubiao" :style="imgspan.stylename">
                    </span>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
      </div> -->
    </div>


      <el-dialog title="告警情况" :visible.sync="alarmTableVisible" width="900px" append-to-body>
        <div class="tablecol chart-wrapper">
          <el-form :inline="true" ref="queryParams" :model="queryParams" class="demo-form-inline" v-if="true">
            <el-form-item>
              <span>告警类别:</span>
              <el-select v-model="queryParams.defectId" @change="changeType" clearable filterable placeholder="请选择告警类别" >
                <el-option
                  v-for="dict in quexianoptions"
                  :key="dict.defectId"
                  :label="dict.defectName"
                  :value="dict.defectId"
                  @keyup.enter.native="handleQuery"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" v-hasPermi="['alarm:real:query']" @click="handleQuery">搜索</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="tableData" ref="baojingtable" max-height="350" :border="false">
            <el-table-column label="设备名称" align="center" prop="equipmentName">
            </el-table-column>
            <el-table-column label="预置位名称" align="center" prop="siteName">
            </el-table-column>
            <el-table-column label="告警级别" align="center" prop="alarmLevel" :formatter="alarmlevelFormat">
            </el-table-column>
            <el-table-column label="告警类别" align="center" prop="defectName">
            </el-table-column>
            <el-table-column label="告警时间" align="center" prop="eventTime">
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleDetails(scope.row)"
                  v-hasPermi="['alarm:real:details']"
                >详情</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleSure(scope.row)"
                  v-hasPermi="['alarm:real:confirm']"
                  :disabled="scope.row.confirmStatus == '已确认' ? true : false"
                  v-show="scope.row.confirmStatus == '已确认' ? false : true"
                >{{ scope.row.confirmStatus == "已确认" ? "已确认" : "确认" }}</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click="showClear(scope.row)"
                  v-hasPermi="['alarm:real:clear']"
                  :disabled="scope.row.confirmStatus == '已确认' ? false : true"
                  v-show="scope.row.confirmStatus == '已确认' ? true : false"
                >清除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="gettableList"
          /> -->
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelClick">关 闭</el-button>
        </span>
      </el-dialog>

    <!-- 告警详情组件 -->
    <detail
      :is-open.sync="open"
      dialog-width="500px"
      :dialog-title="title" :id="alarmDetailId"
      @update:open="(val) => (open = val)"
    >
      <template v-slot:functionButton>
        <el-button
          type="primary"
          @click="handleSure(row)"
          :disabled="row.confirmStatus == '已确认' ? true : false"
          >{{ row.confirmStatus == "已确认" ? "已确认" : "确认" }}
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </detail>

    <!--清除 对话框-->
    <el-dialog title="清除告警" :visible.sync="dialogClearVisible" width="500px" append-to-body>
      <el-form ref="formClear" :rules="rules" :model="formClear">
        <el-form-item label="处理人" prop="disposeBy">
          <el-input v-model="formClear.disposeBy" placeholder="处理人"/>
        </el-form-item>
        <el-form-item label="处理方式" prop="disposeNote">
          <el-input type="textarea" v-model="formClear.disposeNote" placeholder="处理方式"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-hasPermi="['alarm:real:clear']" @click="submitClear">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="videotitle" :visible.sync="videodiv" width="1000px" append-to-body @close="handleclose">
      <div class="videoIframe" v-if="isshowvideo">
        <iframe id="videoiframes" name="videoiframediv" src="../../../../peidianshivideo/cn/demo.html" frameborder="0" scrolling="no" style="width:930px; height:620px;z-index:-1;"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listDefect} from "@/api/device/defect";
import { listRealtime,getRepeatTimes,dispose } from "@/api/alarm/realtime";
import { getDealwith, getConfirms } from "@/api/survey/fan/fandetails";
import { listConfig } from "@/api/system/config"; //全局获取告警图片IP地址和摄像头账户密码
import { listArea } from "@/api/device/area";
import { getToken } from "@/utils/auth";
import LineChart from "../boosterstation/boosterLinechart";
// import LineChart from "../../dashboard/LineChart";
import PieChart from "../../dashboard/PieChart";
import { getCameraList,getDeviceTemp,saveSelectionDefault,getSelectionDefault } from "@/api/survey/switchroom";
import { listCamera } from "@/api/device/camera";
import Detail from "../../details/Detail.vue";
import AlarmSrc from '../../../assets/image/alarm@2x.png';

import Overview from "@/views/dashboard/Overview.vue";

export default {
  components: {
    PieChart,
    LineChart,
    Detail,
    AlarmSrc,
    Overview
  },
  data() {
    return {
      overviewData: {
        areaId: '',
        height:0,
        activeClass:'',
        titleClass:'',
        isClick:false,
      },
      switchareadatalist:[],
      areafanId:"",
      // 遮罩层
      loading: true,
      tableTitle:"",
      // 标识
      switchpageTitle:"",
      switchpageTitle:"",
      wendutitle:"",
      switchpie:"",
      alarmSrc: AlarmSrc,
      // 查询参数
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
        orderByColumn: "confirmStatus asc, eventTime desc",
        isAsc: "",
        defectId: undefined,
        areaId: undefined
      },
      cameraParam: {
        cameraIds: [],
        // interval:60,
      },
      // formInline:{
      //   maxTemp:undefined,
      //   realTemp:undefined,
      //   interval:60,
      // },
      // 告警类别 下拉列表
      quexianoptions: [],
      // 设备 下拉列表
      cameraList: [],
      //  // 总条数
      total: 0,
      tableData: [],
      // 选中数组
      multipleSelection:[],
      // 选中id数组
      ids: [],
      tablecheckedList:[],
       // 弹出层标题
      title: "",
      alarmDetailId:null,
      // 是否显示弹出层
      open: false,
      dialogClearVisible: false,
       // 表单参数
      form: {},
      formClear: {},
      row: {
        confirmStatus: undefined,
      },
      clearId: undefined,
      formDisabled:true,
      isconfirmBy:true,
      // 动态获取告警图片IP地址
      alarmimgipurl:"",
      camerauser:"",
      camerapassword:"",
      nvrip:"",
      bifocalhttpads:"",
      // 图片前的IP地址
      imageheader:"",
      // imageheader:"http://192.168.1.50:8080/", //服务器图片地址
      // imageheader:process.env.VUE_APP_BASE_API,
      srcList:[],
      alarmTableVisible:false,
      intervalList:[{"key":"three","label":"3分钟","value":3},{"key":"fifteen","label":"15分钟","value":15},{"key":"thirty","label":"30分钟","value":30}],
      // 表单校验
      rules: {
        disposeBy: [
          { required: true, message: '请输入处理人', trigger: 'blur' }
        ],
        disposeNote: [
          { required: true, message: '请输入处理方式', trigger: 'blur' }
        ]
      },
      imglist:[],
      ipgather:[],
      // //视频弹框
      videotitle:"",
      videodiv:false,
      isshowvideo:false,
      cameradatalist:[], //摄像头列表
      // 历史报警重复次数
      repeatTimes: undefined,
      // 历史报警重复列表
      repeatList: undefined,
      alarmlevellist:[],
      switchpiechart:{
        expectedData: [],
        xAxisDate: [],
      },
      booster24templist:{
        expectedData: [],
        xAxisDate: [],
        legendData:[]
      },
    }
  },
  created() {
    this.getcameradataList();
    this.areafanId = this.$route.path.split('/')[this.$route.path.split('/').length - 1];
    this.overviewData={
      areaId: this.areafanId,
      height: 345,
      activeClass:'pictureshow',
      titleClass:'picturetitle',
      isClick:false,
    }
    this.wendutitle = "温度实时监测";
    this.tableTitle = "告警情况";
    this.getcameraip();
    this.getalarmtypelist();
    this.gettableList();
    this.getcameralists();
    window.sessionStorage.setItem("brearer",getToken());
    window.sessionStorage.setItem("httpurl",process.env.VUE_APP_BASE_API);
    this.getDicts("alarm_level").then(response => {
      this.alarmlevellist = response.data;
    });
    // 获取pie数据
    // this.getswichdefect();
  },
  mounted(){
    setTimeout(()=>{
      this.getarealist();
    },500)
    this.tableTitle = "告警情况";
    this.switchpie = "30日告警分布";
    this.imageheader = window.sessionStorage.getItem("alarmimgipurl");
  },
  destroyed:function() {
    // window.frames['videoiframediv'].userfunc();
    // window.frames['videoiframediv'].clickLogout();
  },
  methods: {
    drawLine(tempData){
      let series=[];
      let startDate = undefined;
      let endDate=undefined;
      let legendData = [];
      let xAxisDate = [];
      let cameraIds = [];
      for (let cameraId in tempData) {
          cameraIds.push(cameraId);
      }
      cameraIds.sort();
      for (let i=0; i<cameraIds.length;i++) {
          let data = [];
          let cameraId =cameraIds[i];
          for (let j = 0; j < tempData[cameraId].length; j++) {
              let d = tempData[cameraId][j];
              let s = { 'name': d.areaName, value: [d.time.toString().slice(11, 13), d.temp] };
              if(s.value[0].slice(0,1) =="0"){
                  s.value[0] =s.value[0].slice(1);
              }
              data.push(s);

              if (!startDate) {
                  startDate=d.time;
              }else if(startDate>d.time){
                  startDate=d.time;
              }
              if(!endDate){
                  endDate=d.time;
              }else if(endDate<d.time){
                  endDate=d.time;
              }
          }

        let ser={
          name: tempData[cameraId][0].areaName,
          type: 'line',
          data: data};
        series.push(ser);
        legendData.push(tempData[cameraId][0].areaName);
      }
      if(startDate && endDate) {
          let timeStartStr = startDate.toString().slice(11, 13);
          if (timeStartStr.slice(0, 1) == "0") {
              timeStartStr = timeStartStr.slice(1);
          }
          let timeEndStr = endDate.toString().slice(11, 13);
          if (timeEndStr.slice(0, 1) == "0") {
              timeEndStr = timeEndStr.slice(1);
          }

          let counter = timeStartStr;
          xAxisDate.push(counter);
          while (counter != timeEndStr) {
              counter++;
              if (counter == 24) {
                  counter = 0;
              }
              xAxisDate.push(counter);
          }
      }

      this.booster24templist.legendData = legendData;
      this.booster24templist.xAxisDate = xAxisDate;
      this.booster24templist.expectedData = series;
    },
    // 告警级别字典翻译
    alarmlevelFormat(row, column) {
      return row !== null ? this.selectDictLabel(this.alarmlevellist, row.alarmLevel) : null;
    },
    // 设备下拉列表
      getcameralists() {
          getCameraList(this.areafanId).then(response => {
              this.cameraList = response.data;
              //从后台查询上次设备列表选项
              getSelectionDefault(this.areafanId).then(selectionResp => {
                  let data = undefined;
                  // debugger;
                  if(selectionResp.hasOwnProperty("data") && selectionResp.data.hasOwnProperty("defaultValue")) {
                      data = selectionResp.data.defaultValue;
                  }
                  let selectedCameras = [];
                  if (data) {
                      let dataArray = data.split(",");
                      for (let i = 0; i < dataArray.length; i++) {
                          selectedCameras.push(parseInt(dataArray[i]));
                      }
                  }

                  if (selectedCameras.length === 0) {
                      for (let i = 0; i < this.cameraList.length; i++) {
                          if (i >= 5) {
                              break;
                          }
                          selectedCameras.push(this.cameraList[i].devAreaTempId);
                      }
                  }
                  this.changeCamera(selectedCameras);
              });
          });
      },
    changeCamera(val){
      this.cameraParam.cameraIds=val;
      this.getCameraTempList(this.cameraParam);
      saveSelectionDefault({"defaultValue": val.join(","),"areaId":this.areafanId});
    },
    getCameraTempList(param){  //获取表格
      this.loading = true;
      if(this.areafanId != 905){
        getDeviceTemp(param).then(response => {
          console.log(response.data,'获取实时测温');
            this.drawLine(response.data);
            this.loading = false;
        });
      }
    },
    getcameradataList(){
      listCamera().then(response => {
        // console.log(response,"摄像头数据");
        this.cameradatalist = response.rows;
      });
    },
    getarealist(){
      listArea().then(response => {
        var datalist = [];
        response.data.map((v)=>{
          if(v.areaType == "3"){
              datalist.push(v);
          }
        })
        this.switchareadatalist = datalist;
        console.log(this.switchareadatalist,'----获取区域下的配电室列表');

        var query = this.areafanId;
        console.log(query);
        this.switchareadatalist.map((v)=>{
          if(query == v.areaId){
            this.switchpageTitle = v.areaName;
          }
        })
    //     if(query == 903){ //"1# 35kV高压开关室"
    //       this.imglist = [
    //          {
    //           imgSrc:require('../../../assets/image/peidianshi04.jpg'),
    //           id:'222',
    //           ilist:[
    //             // {id:"1",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.31",stylename:{left:"1.5%",top:"6%"}},
    //             // // {id:"2",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.43",stylename:{left:"278%",top:"30%"}},
    //             // // {id:"3",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.44",stylename:{left:"320%",top:"30%"}},
    //             // {id:"4",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.32",stylename:{left:"32%",top:"6%"}},
    //             // {id:"5",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.33",stylename:{left:"56.5%",top:"6%"}},
    //             // // {id:"6",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"robotyuntai",ip:"22.18.3.134",stylename:{left:"960%",top:"30%"}},
    //             // // {id:"7",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.135",stylename:{left:"1140%",top:"30%"}},
    //             // {id:"6",tubiao:require("../../../assets/image/轨道机器人.png"),ikey:"robotyuntai",ip:"22.18.3.134",stylename:{left:"10%",top:"52%"}},
    //             // {id:"8",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.30",stylename:{left:"1.5%",top:"60%"}},
    //             // // {id:"9",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.133",stylename:{left:"450%",top:"165%"}},
    //             // // {id:"10",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.138",stylename:{left:"515%",top:"155%"}},
    //             // // {id:"11",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.137",stylename:{left:"600%",top:"155%"}},
    //             // // {id:"12",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.136",stylename:{left:"880%",top:"155%"}},
    //             // {id:"13",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.34",stylename:{left:"95%",top:"61%"}},
    //             // // {id:"14",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.36",stylename:{left:"220%",top:"240%"}},
    //             // // {id:"15",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.37",stylename:{left:"385%",top:"240%"}},
    //             // {id:"16",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.132",stylename:{left:"32%",top:"88%"}},
    //             // // {id:"17",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.38",stylename:{left:"710%",top:"240%"}},
    //             // {id:"18",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.35",stylename:{left:"58%",top:"88%"}},
    //             // // {id:"19",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.39",stylename:{left:"980%",top:"240%"}},
    //             // // {id:"20",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.42",stylename:{left:"1080%",top:"240%"}},

    //             // hk
    //             {id:"1",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.30",stylename:{left:"1.5%",top:"60%"}},
    //             {id:"2",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.31",stylename:{left:"1.5%",top:"6%"}},
    //             {id:"3",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.32",stylename:{left:"32%",top:"6%"}},
    //             {id:"4",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.33",stylename:{left:"56.5%",top:"6%"}},
    //             {id:"5",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.34",stylename:{left:"95%",top:"61%"}},
    //             {id:"6",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.35",stylename:{left:"58%",top:"88%"}},
    //             {id:"7",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.132",stylename:{left:"32%",top:"88%"}},
    //             {id:"8",tubiao:require("../../../assets/image/轨道机器人.png"),ikey:"robotyuntai",ip:"22.18.3.134",stylename:{left:"10%",top:"52%"}},
    //           ]
    //         },
    //       ]
    //       this.ipgathe = [];
    //       var cameraipgather = {};
    //       this.imglist[0].ilist.map((v)=>{
    //         this.cameradatalist.map((y)=>{
    //           if(y.ip == v.ip){
    //             v.cameraName = y.cameraName;
    //             v.cameraId = y.cameraId; //摄像头id
    //             v.hasNvr = y.hasNvr; //nvr 回放
    //             v.hasInfrared = y.hasInfrared //红热线
    //             v.hasTbk = y.hasTbk //对讲
    //             v.hasPtz = y.hasPtz //云台
    //           }
    //         })
    //         // console.log(v)
    //         cameraipgather={
    //           id:v.id,
    //           ip:v.ip,
    //           ikey:v.ikey,
    //           cameraId:v.cameraId,
    //           cameraName:v.cameraName,
    //           hasNvr:v.hasNvr,
    //           hasTbk:v.hasTbk,
    //           hasInfrared:v.hasInfrared,
    //           hasPtz:v.hasPtz
    //         }
    //         // cameraipgather.push(v.ip)
    //         this.ipgather.push(cameraipgather);
    //       })
    //       window.sessionStorage.setItem("ipgathers",JSON.stringify(this.ipgather));
    //       console.log(JSON.parse(window.sessionStorage.getItem("ipgathers")),'---ip集合');
    //     }else if(query == 904){ //"2# 35kV高压开关室"
    //       this.imglist = [
    //        {
    //           imgSrc:require('../../../assets/image/peidianshi05.jpg'),
    //           id:'222',
    //           ilist:[
    //             {id:"1",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.26",stylename:{left:"97.5%",top:"88%"}},
    //             {id:"2",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.27",stylename:{left:"97.5%",top:"6%"}},
    //             {id:"3",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.28",stylename:{left:"1.5%",top:"6%"}},
    //             {id:"4",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.29",stylename:{left:"1.5%",top:"88%"}},
    //             {id:"5",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.21",stylename:{left:"62%",top:"6%"}},
    //             {id:"6",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.22",stylename:{left:"50%",top:"6%"}},
    //             {id:"7",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.23",stylename:{left:"39%",top:"6%"}},
    //             {id:"8",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.24",stylename:{left:"28%",top:"6%"}},
    //             {id:"9",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.25",stylename:{left:"16%",top:"6%"}},
    //           ]
    //         },
    //       ]
    //       this.ipgather = [];
    //       var cameraipgather = {};
    //       this.imglist[0].ilist.map((v)=>{
    //         this.cameradatalist.map((y)=>{
    //           if(y.ip == v.ip){
    //             v.cameraName = y.cameraName;
    //             v.cameraId = y.cameraId; //摄像头id
    //             v.hasNvr = y.hasNvr; //nvr 回放
    //             v.hasInfrared = y.hasInfrared //红热线
    //             v.hasTbk = y.hasTbk //对讲
    //             v.hasPtz = y.hasPtz //云台
    //           }
    //         })
    //         // console.log(v)
    //         cameraipgather={
    //           id:v.id,
    //           ip:v.ip,
    //           ikey:v.ikey,
    //           cameraId:v.cameraId,
    //           cameraName:v.cameraName,
    //           hasNvr:v.hasNvr,
    //           hasTbk:v.hasTbk,
    //           hasInfrared:v.hasInfrared,
    //           hasPtz:v.hasPtz
    //         }
    //         // cameraipgather.push(v.ip)
    //         this.ipgather.push(cameraipgather);
    //       })
    //       // alert(904)
    //       console.log("~~~~~~~~~~904~~~~~~",this.ipgather)
    //       window.sessionStorage.setItem("ipgathers",JSON.stringify(this.ipgather));
    //       console.log(JSON.parse(window.sessionStorage.getItem("ipgathers")),'---ip集合');
    //     }else if(query == 901){ //"220kV GIS室"
    //       this.imglist = [
    //        {
    //           imgSrc:require('../../../assets/image/peidianshi06.jpg'),
    //           id:'222',
    //           ilist:[
    //             {id:"1",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.45",stylename:{left:"1.5%",top:"88%"}},
    //             {id:"2",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.46",stylename:{left:"1.5%",top:"5%"}},
    //             {id:"3",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.47",stylename:{left:"97.5%",top:"5%"}},
    //             {id:"4",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.48",stylename:{left:"97%",top:"79%"}},
    //             {id:"5",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.49",stylename:{left:"35%",top:"88%"}},
    //             {id:"6",tubiao:require("../../../assets/image/旋转式-球机.png"),ikey:"yuntai",ip:"22.18.3.50",stylename:{left:"97%",top:"88%"}},
    //             {id:"7",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.61",stylename:{left:"63%",top:"88%"}},
    //             {id:"8",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.60",stylename:{left:"54%",top:"88%"}},
    //             {id:"9",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.53",stylename:{left:"20%",top:"88%"}},
    //             {id:"10",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.59",stylename:{left:"12.5%",top:"88%"}},
    //             {id:"11",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.58",stylename:{left:"1.5%",top:"45%"}},
    //             {id:"12",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.57",stylename:{left:"9%",top:"5%"}},
    //             {id:"13",tubiao:require("../../../assets/image/固定式-枪机-下.png"),ikey:"stationary",ip:"22.18.3.52",stylename:{left:"24.4%",top:"5%"}},
    //             {id:"14",tubiao:require("../../../assets/image/旋转式-球机.png"),ikey:"yuntai",ip:"22.18.3.51",stylename:{left:"36%",top:"5%"}},
    //             {id:"15",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.56",stylename:{left:"62%",top:"5%"}},
    //             {id:"16",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.55",stylename:{left:"73%",top:"5%"}},
    //             {id:"17",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.54",stylename:{left:"86%",top:"5%"}},
    //           ]
    //         },
    //       ]
    //       this.ipgathe = [];
    //       var cameraipgather = {};
    //       this.imglist[0].ilist.map((v)=>{
    //         this.cameradatalist.map((y)=>{
    //           if(y.ip == v.ip){
    //             v.cameraName = y.cameraName;
    //             v.cameraId = y.cameraId; //摄像头id
    //             v.hasNvr = y.hasNvr; //nvr 回放
    //             v.hasInfrared = y.hasInfrared //红热线
    //             v.hasTbk = y.hasTbk //对讲
    //             v.hasPtz = y.hasPtz //云台
    //           }
    //         })
    //         // console.log(v)
    //         cameraipgather={
    //           id:v.id,
    //           ip:v.ip,
    //           ikey:v.ikey,
    //           cameraId:v.cameraId,
    //           cameraName:v.cameraName,
    //           hasNvr:v.hasNvr,
    //           hasTbk:v.hasTbk,
    //           hasInfrared:v.hasInfrared,
    //           hasPtz:v.hasPtz
    //         }
    //         // cameraipgather.push(v.ip)
    //         this.ipgather.push(cameraipgather);
    //       })

    //       window.sessionStorage.setItem("ipgathers",JSON.stringify(this.ipgather));
    //       console.log(JSON.parse(window.sessionStorage.getItem("ipgathers")),'---ip集合');
    //     }else if(query == 906){ //"10kV SVG室"
    //       this.imglist = [
    //        {
    //           imgSrc:require('../../../assets/image/peidianshi07.jpg'),
    //           id:'222',
    //           ilist:[
    //             {id:"1",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.65",stylename:{left:"1.5%",top:"88%"}},
    //             {id:"2",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.66",stylename:{left:"1.5%",top:"6%"}},
    //             {id:"3",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.67",stylename:{left:"97.5%",top:"6%"}},
    //             {id:"4",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.68",stylename:{left:"97.5%",top:"88%"}},
    //           ]
    //         },
    //       ]
    //       this.ipgathe = [];
    //       var cameraipgather = {};
    //       this.imglist[0].ilist.map((v)=>{
    //         this.cameradatalist.map((y)=>{
    //           if(y.ip == v.ip){
    //             v.cameraName = y.cameraName;
    //             v.cameraId = y.cameraId; //摄像头id
    //             v.hasNvr = y.hasNvr; //nvr 回放
    //             v.hasInfrared = y.hasInfrared //红热线
    //             v.hasTbk = y.hasTbk //对讲
    //             v.hasPtz = y.hasPtz //云台
    //           }
    //         })
    //         // console.log(v)
    //         cameraipgather={
    //           id:v.id,
    //           ip:v.ip,
    //           ikey:v.ikey,
    //           cameraId:v.cameraId,
    //           cameraName:v.cameraName,
    //           hasNvr:v.hasNvr,
    //           hasTbk:v.hasTbk,
    //           hasInfrared:v.hasInfrared,
    //           hasPtz:v.hasPtz
    //         }
    //         // cameraipgather.push(v.ip)
    //         this.ipgather.push(cameraipgather);
    //       })
    //       window.sessionStorage.setItem("ipgathers",JSON.stringify(this.ipgather));
    //       console.log(JSON.parse(window.sessionStorage.getItem("ipgathers")),'---ip集合');
    //     }else if(query == 907){ //"35kV SVG室"
    //       this.imglist = [
    //        {
    //           imgSrc:require('../../../assets/image/peidianshi08.jpg'),
    //           id:'222',
    //           ilist:[
    //             {id:"1",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.70",stylename:{left:"1.5%",top:"6%"}},
    //             {id:"2",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.71",stylename:{left:"1.5%",top:"88%"}},
    //             {id:"3",tubiao:require("../../../assets/image/旋转式-球机.png"),ikey:"yuntai",ip:"22.18.3.72",stylename:{left:"1.5%",top:"35%"}},
    //           ]
    //         },
    //       ]
    //       this.ipgathe = [];
    //       var cameraipgather = {};
    //       this.imglist[0].ilist.map((v)=>{
    //         this.cameradatalist.map((y)=>{
    //           if(y.ip == v.ip){
    //             v.cameraName = y.cameraName;
    //             v.cameraId = y.cameraId; //摄像头id
    //             v.hasNvr = y.hasNvr; //nvr 回放
    //             v.hasInfrared = y.hasInfrared //红热线
    //             v.hasTbk = y.hasTbk //对讲
    //             v.hasPtz = y.hasPtz //云台
    //           }
    //         })
    //         // console.log(v)
    //         cameraipgather={
    //           id:v.id,
    //           ip:v.ip,
    //           ikey:v.ikey,
    //           cameraId:v.cameraId,
    //           cameraName:v.cameraName,
    //           hasNvr:v.hasNvr,
    //           hasTbk:v.hasTbk,
    //           hasInfrared:v.hasInfrared,
    //           hasPtz:v.hasPtz
    //         }
    //         // cameraipgather.push(v.ip)
    //         this.ipgather.push(cameraipgather);
    //       })
    //       window.sessionStorage.setItem("ipgathers",JSON.stringify(this.ipgather));
    //       console.log(JSON.parse(window.sessionStorage.getItem("ipgathers")),'---ip集合');
    //     }else if(query == 905){ //继电保护室
    //       this.imglist = [
    //        {
    //           imgSrc:require('../../../assets/image/继电保护室.jpg'),
    //           id:'222',
    //           ilist:[
    //             {id:"1",tubiao:require("../../../assets/image/轨道机器人.png"),ikey:"robotyuntai",ip:"22.18.3.131",stylename:{left:"10%",top:"6%"}},
    //           ]
    //         },
    //       ]
    //       this.ipgathe = [];
    //       var cameraipgather = {};
    //       this.imglist[0].ilist.map((v)=>{
    //         this.cameradatalist.map((y)=>{
    //           if(y.ip == v.ip){
    //             v.cameraName = y.cameraName;
    //             v.cameraId = y.cameraId; //摄像头id
    //             v.hasNvr = y.hasNvr; //nvr 回放
    //             v.hasInfrared = y.hasInfrared //红热线
    //             v.hasTbk = y.hasTbk //对讲
    //             v.hasPtz = y.hasPtz //云台
    //           }
    //         })
    //         // console.log(v)
    //         cameraipgather={
    //           id:v.id,
    //           ip:v.ip,
    //           ikey:v.ikey,
    //           cameraId:v.cameraId,
    //           cameraName:v.cameraName,
    //           hasNvr:v.hasNvr,
    //           hasTbk:v.hasTbk,
    //           hasInfrared:v.hasInfrared,
    //           hasPtz:v.hasPtz
    //         }
    //         // cameraipgather.push(v.ip)
    //         this.ipgather.push(cameraipgather);
    //       })
    //       window.sessionStorage.setItem("ipgathers",JSON.stringify(this.ipgather));
    //       console.log(JSON.parse(window.sessionStorage.getItem("ipgathers")),'---ip集合');
    //     }

      })
    },
     // // //动态获取告警图片IP地址
    getcameraip(){
      listConfig().then(response => {
        console.log(response.rows,'全局匹配的一些参数');
        response.rows.map((v)=>{
          // 图片服务器地址
          if(v.configKey == "server.fdfs.ip"){
            this.alarmimgipurl = v.configValue;
            window.sessionStorage.setItem("alarmimgipurl",this.alarmimgipurl);
          }
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
          // 推流地址：
          if(v.configKey == "config.bifocal.httpads"){
            this.bifocalhttpads = v.configValue;
            window.sessionStorage.setItem("bifocalhttpads",this.bifocalhttpads);
          }
        })
      });
    },

    // getswichdefect(){
    //   console.log(this.areafanId);
    //   getBoosterStationAlarm(this.areafanId).then(response => {
    //     console.log(response,'缺陷数量');
    //     var res = response.data;
    //     var date = []
    //     var data = []
    //     var obj = {};
    //     for (var i = 0; i < res.length; i++) {
    //       const e = res[i];
    //       date[i] = e.defectName
    //       obj = {
    //         name:e.defectName,
    //         value:e.alarmAmount
    //       }
    //       data.push(obj);
    //     }
    //     this.switchpiechart.xAxisDate = date;
    //     this.switchpiechart.expectedData = data;
    //   })
    // },

     // 告警类型下拉列表
    getalarmtypelist() {
      // getDicts("alarm_type").then(response => {
      //   console.log(response,"告警类型下拉列表")
      //   this.gaojintypeoptions = response.data;
      // });
      listDefect().then(response => {
        console.log(response,"缺陷下拉列表")
        this.quexianoptions = response.rows;
      });
    },
    // 点击视频弹框
    showModal(item) {
      console.log(item);
      window.sessionStorage.setItem("sxtcameraid",item.cameraId);
      window.sessionStorage.setItem("sxtcameraName",item.cameraName);
      window.sessionStorage.setItem("sxtcameraip",item.ip);
      window.sessionStorage.setItem("sxtikey",item.ikey);
      window.sessionStorage.setItem("sxthasNvr",item.hasNvr);
      window.sessionStorage.setItem("sxthasInfrared",item.hasInfrared);
      window.sessionStorage.setItem("sxthasTbk",item.hasTbk);
      window.sessionStorage.setItem("sxthasPtz",item.hasPtz);
      this.isshowvideo = true;
      // this.videotitle = "视频详情";
      this.videodiv = true;
    },
    //关闭视频弹框
    handleclose(){
      window.frames['videoiframediv'].userfunc();
      window.frames['videoiframediv'].clickLogout();
      this.isshowvideo = false;
    },

    // 告警类型
    changeType(val){
      console.log(val);
      // this.queryParams.pageNum = 1;
      // this.gettableList()
    },
    gettableList(){  //获取表格
      this.loading = true;
      this.queryParams.areaId = this.$route.path.split('/')[this.$route.path.split('/').length - 1];
       listRealtime(this.queryParams).then(response => {
        console.log(response.rows,'获取实时告警的');
         response.rows.map((v)=>{
          if(v.confirmStatus == "0" || v.confirmStatus == null){
            v.confirmStatus = "未确认"
          }else if(v.confirmStatus == "1"){
            v.confirmStatus = "已确认"
          }
        })
        this.tableData = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // // 选择框
    // handleSelectionChange(val) {
    //   console.log(val);
    //   this.ids = val.map(item => item.alarmDetailId);
    //   this.multipleSelection = val;
    // },
    /** 搜索按钮操作 */
    handleQuery() {
      this.gettableList();
    },
    cancelClick(){
      this.queryParams = {
        orderByColumn: undefined,
        isAsc: undefined,
        defectId: undefined,
        areaId:undefined,
      }
      this.resetForm("queryParams");
      this.alarmTableVisible = false;
      this.gettableList();
    },
    // 确认
    handleSure(row){
      console.log(row)
      const alarmDetailId = row.alarmDetailId;
      getConfirms([alarmDetailId]).then((response) => {
        if (response.code === 200) {
          this.$message({
            type: "success",
            message: "已确认",
          });
          this.open = false;
          this.gettableList();
        }
      });
    },
      /** 详情按钮操作 */
    handleDetails(row) {
      // console.log(row);
      this.row = row;
      this.alarmDetailId = row.alarmDetailId;
      this.open = true;
      this.title = "详情";
    },
     /** 清除提交按钮 */
    submitClear: function() {
      this.$refs['formClear'].validate(valid => {
        if (valid) {
          console.log(this.formClear);
          this.formClear.alarmDetailId = this.clearId;
          dispose(this.formClear).then(response => {
            if (response.code === 200) {
              this.$message({
                type: 'success',
                message: '处理成功'
              })
              this.dialogClearVisible = false;
              this.gettableList();
            }
          })
        }
      })
    },
    /** 清除按钮操作 */
    showClear(row) {
      console.log(row);
      this.dialogClearVisible = true;
      this.clearId = row.alarmDetailId;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.dialogClearVisible = false;
    },
  },
  watch:{

  }
};
</script>
<style lang="scss" scoped>
  a, a:focus, a:hover {
    cursor: pointer;
    text-decoration: none;
  }

  .el-dialog .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }
  /deep/ .el-dialog__body{
    padding: 0 20px 30px 20px;
  }

  .app-container{
    background-color: rgb(240, 242, 245);
    padding: 15px;

    .switchroom{
      min-height: calc(100vh - 150px);
      padding: 5px;

      .header{
        height: 50px;
        line-height: 50px;
        background: #ffffff;
        padding-left: 10px;
        overflow: hidden;

        .title{
          text-align: left;
          float: left;
        }

        .biaoshi{
          font-weight: 500;
          margin-left: 20px;
        }

        .right-alarm {
          float: right;
          position: relative;
          top: 12px;
          right: 25px;
          cursor: pointer;
        }

      }

      .switchroomchart{
        height: 395px;
        background: #ffffff;
        margin-top:10px;
        padding: 10px;
        .dev-select{
          /deep/.el-select{
            width: 320px;
          }
        }
      }

    //   .pictureshow{
    //     height: 400px;
    //     margin-top:10px;
    //     padding: 10px;
    //     background: #ffffff;

    //     // .imgcol{
    //     //   height: 365px;

    //     //   .imgdiv{
    //     //     height: 365px;
    //     //     padding: 10px;
    //     //     text-align: center;
    //     //   }

    //     //   .lunbodiv{
    //     //       /deep/ .el-carousel__container{
    //     //         height: 280px;
    //     //         position: relative;
    //     //         top: 0px;
    //     //         left: 0px;
    //     //       }
    //     //     .card_pre{
    //     //       width: 100%;
    //     //       height: 345px;

    //     //       .bgimg{
    //     //         width: 100%;
    //     //         height: 100%;
    //     //         position: relative;
    //     //         top: 0px;
    //     //         left: 0px;
    //     //       }

    //     //       .bd_ccc{
    //     //         .mg_20{
    //     //           width: 21px;
    //     //           height: 21px;
    //     //           img{
    //     //             width: 21px;
    //     //             height: 21px;
    //     //             position: absolute;
    //     //             top: 10px;
    //     //             left: 10px;
    //     //           }
    //     //         }
    //     //         .mg_20:hover{
    //     //           cursor: pointer;
    //     //         }
    //     //       }
    //     //     }
    //     //   }
    //     // }
    //   }

      // .camerashow{
      //   height: 680px;
      //   background: #ffffff;
      //   margin-top:10px;
      //   padding: 10px;
      //   .cameratitle{
      //     margin-bottom: 10px;
      //   }
      // }
    }
  }
</style>
