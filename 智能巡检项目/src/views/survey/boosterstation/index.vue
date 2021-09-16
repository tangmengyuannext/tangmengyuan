<template>
  <div class="app-container">
    <div class="bootcontent">
      <div class="header">
        <h2 class="title">升压站详情<span class="biaoshi">名称：{{this.boosterpageTitle}}</span></h2>
        <div class="right-alarm" @click="alarmTableVisible = true">
          <el-badge :value="total" :max="999" class="item">
            <img :src="alarmSrc" style="width: 30px; height: 30px;"/>
          </el-badge>
        </div>
      </div>
      <div style="clear:both;height:0px;"></div>
      <div class="chartcontent">
        <el-row>
          <el-col :span="6">
            <h3 class="linetitle">温度实时监测</h3>
          </el-col>
          <el-col :span="18">
            <el-form :inline="true" :model="cameraParam" class="demo-form-inline" size="mini">
              <el-form-item label="设备列表" style="margin-bottom: 0px;">
                <div class="dev-select">
                  <el-select multiple collapse-tags v-model="cameraParam.cameraIds" filterable placeholder="设备列表"
                              @change="changeCamera">
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
        <h3 class="picturetitle">升压站平面图</h3>
        <div class="imgcol">
          <div class="imgdiv">
            <el-carousel class="lunbodiv" height="545px" indicator-position="none" :loop="false" :autoplay="false">
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
      </div>-->
      <!-- <div class="camerashow">
        <h3 class="cameratitle">实时监控</h3>
        <div class="videoIframe">
          <iframe id="videoiframes" name="videoiframediv" src="../../../../peidianshivideo/cn/demo.html" frameborder="0" scrolling="no" style="width:930px; height:620px;z-index:-1;"></iframe>
        </div>
      </div> -->
    </div>
    <el-dialog title="告警情况" :visible.sync="alarmTableVisible" width="900px" append-to-body>
      <div class="tablecol">
        <el-form :inline="true" ref="queryParams" :model="queryParams" class="demo-form-inline" v-if="true">
          <el-form-item>
            <span>告警类别:</span>
            <el-select v-model="queryParams.defectId" clearable filterable placeholder="请选择告警类别" >
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
        <el-table v-loading="loading" :data="tableData" ref="baojingtable" max-height="350" :border="false">
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

    <!-- <overview :data="overviewData"/> -->
  </div>
</template>

<script>
import {listDefect} from "@/api/device/defect";
import { getRepeatTimes,dispose } from "@/api/alarm/realtime";
import { listArea } from "@/api/device/area";
import { listCamera } from "@/api/device/camera";
import LineChart from "./boosterLinechart";
// import LineChart from "../../dashboard/LineChart";
import PieChart from "../../dashboard/PieChart";
import { getFantemp24,getFandefect } from "@/api/survey/fan/fan";
import { getBoosterStationAlarm,getCameraList,getDeviceTemp,listRealtime,saveSelectionDefault,getSelectionDefault } from "@/api/survey/boosterstation";

import { getDealwith, getConfirms } from "@/api/survey/fan/fandetails";
import { listConfig } from "@/api/system/config"; //全局获取告警图片IP地址和摄像头账户密码
import { getToken } from "@/utils/auth";
import Detail from "../../details/Detail.vue";
import AlarmSrc from '../../../assets/image/alarm@2x.png';
import Overview from "@/views/dashboard/Overview.vue";

function group(array, subGroupLength) {
  let index = 0;
  let newArray = [];
  while(index < array.length) {
      newArray.push(array.slice(index, index += subGroupLength));
  }
  return newArray;
}

export default {
  components: {
    // boosterLinechart,
    Detail,
    LineChart,
    PieChart,
    AlarmSrc,
    Overview,
  },
  data() {
    return {
      overviewData: {
        areaId:undefined,
        height:0,
        activeClass:'',
        titleClass:'',
        isClick:false,
      },
      areafanId:"",
      alarmSrc: AlarmSrc,
      // 遮罩层
      loading: true,
      tableTitle:"",
      boosterpageTitle:"",
      wendutitle:"",
      boosterpie:"",
      // 告警类别 下拉列表
      quexianoptions: [],
      // 设备 下拉列表
      cameraList: [],
      intervalList:[{"key":"three","label":"3分钟","value":3},{"key":"fifteen","label":"15分钟","value":15},{"key":"thirty","label":"30分钟","value":30}],
      alarmTableVisible:false,
      // 查询参数
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
        orderByColumn: "confirmStatus asc, eventTime desc",
        isAsc: "",
        defectId: undefined,
        areaId: undefined,
      },
      cameraParam: {
        cameraIds: [],
      },
      alarmareaid:"",
      tableData: [],
      alarmarealist:[],
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
      formDisabled:true,
      isconfirmBy:true,
      clearId: undefined,
      // 表单校验
      rules: {
        disposeBy: [
          { required: true, message: '请输入处理人', trigger: 'blur' }
        ],
        disposeNote: [
          { required: true, message: '请输入处理方式', trigger: 'blur' }
        ]
      },
      // 动态获取告警图片IP地址
      alarmimgipurl:"",
      // 动态获取摄像头账户密码
      camerauser:"",
      camerapassword:"",
      // 动态获取NVR地址
      nvrip:"",
      bifocalhttpads:"",
      // 图片前的IP地址
      imageheader:"",
      // imageheader:"http://192.168.1.50:8080/", //服务器图片地址
      // imageheader:process.env.VUE_APP_BASE_API,
      srcList:[],
       //  // 总条数
      total: 0,

      cameradatalist:[], //摄像头列表

      imglist:[],
      ipgather:[],
      // 历史报警重复次数
      repeatTimes: undefined,
      // 历史报警重复列表
      repeatList: undefined,
      alarmlevellist:[],
      boosterpielist:{
        expectedData: [],
        xAxisDate: [],
        tooltip:{}
      },
      booster24templist:{
        expectedData: [],
        xAxisDate: [],
        legendData:[]
      },
      // //视频弹框
      videotitle:"",
      videodiv:false,
      isshowvideo:false,
    }
  },
  created() {
    this.getarealist();
    this.getcameralists();
    this.getcameraip();
    this.wendutitle = "温度实时监测";
    this.tableTitle = "告警情况";
    this.boosterpie = "30日告警分布";
    this.getalarmtypelist();
    window.sessionStorage.setItem("brearer",getToken());
    window.sessionStorage.setItem("httpurl",process.env.VUE_APP_BASE_API);
    this.getDicts("alarm_level").then(response => {
      this.alarmlevellist = response.data;
    });
  },
  mounted(){
    this.imageheader = window.sessionStorage.getItem("alarmimgipurl");
  },
  // destroyed:function() {
  //   window.frames['videoiframediv'].userfunc();
  //   window.frames['videoiframediv'].clickLogout();
  // },
  methods: {
    drawLine(tempData) {
      let series = [];
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

        if (tempData[cameraId].length > 0) {
          let ser = {
            name: tempData[cameraId][0].areaName,
            type: 'line',
            data: data
          }
          series.push(ser)
          legendData.push(tempData[cameraId][0].areaName)
        }
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
    getarealist(){
      listArea().then(response => {
        var datalist = [];
        response.data.map((v)=>{
            if(v.areaType == "4"){
              datalist.push(v);
              // console.log(v);
              this.areafanId = v.areaId;
              this.alarmareaid = v.areaId;
              this.boosterpageTitle = v.areaName;
            }
        })
        this.getBoosterAreaId(datalist)
        this.alarmarealist = datalist;
        this.gettableList();
        // this.getboosterdefect();
        this.getcameradataList();
      })
    },

    getBoosterAreaId(arr) {
      let a = arr[0]
      let boo = a.areaId
      let t = a.parentId
      for(let e in arr) {
        if(t > e.parentId) {
          boo = e.areaId
          t = e.parentId
        }
      }
      const boosterId = boo
      this.overviewData= {
        areaId: Number(boosterId),
        height: 545,
        activeClass:'pictureshow',
        titleClass:'picturetitle',
        isClick:false,
      }
    },

    getcameradataList(){
      // listCamera().then(response => {
      //   console.log(response.rows,"摄像头数据");
      //   this.cameradatalist = response.rows;
      //   this.imglist = [
      //     {
      //       imgSrc: require("../../../assets/image/shengyazhan_new.jpg"),
      //       id: "1",
      //       ilist: [
      //         // 最上面 摄像头 双目
      //         {
      //           id: "1",
      //           tubiao: require("../../../assets/image/双目-半球.png"),
      //           ikey: "shuangmu",
      //           ip: "22.18.3.105",
      //           // stylename: { left: "73%", top: "53%" },
      //           stylename: { left: "75.5%", top: "49%" },
      //         },
      //         {
      //           id: "2",
      //           tubiao: require("../../../assets/image/双目-半球.png"),
      //           ikey: "shuangmu",
      //           ip: "22.18.3.106",
      //           // stylename: { left: "71%", top: "29%" },
      //           stylename: { left: "75.5%", top: "25%" },
      //         },
      //         {
      //           id: "3",
      //           tubiao: require("../../../assets/image/双目-半球.png"),
      //           ikey: "shuangmu",
      //           ip: "22.18.3.107",
      //           // stylename: { left: "11.5%", top: "27%" },
      //           stylename: { left: "15%", top: "28%" },
      //         },
      //         {
      //           id: "4",
      //           tubiao: require("../../../assets/image/双目-半球.png"),
      //           ikey: "shuangmu",
      //           ip: "22.18.3.108",
      //           // stylename: { left: "20.5%", top: "20%" },
      //           stylename: { left: "25.5%", top: "15%" },
      //         },
      //         {
      //           id: "5",
      //           tubiao: require("../../../assets/image/双目-半球.png"),
      //           ikey: "shuangmu",
      //           ip: "22.18.3.109",
      //           // stylename: { left: "28%", top: "14%" },
      //           stylename: { left: "32.5%", top: "5%" },
      //         },
      //         {
      //           id: "6",
      //           tubiao: require("../../../assets/image/双目-半球.png"),
      //           ikey: "shuangmu",
      //           ip: "22.18.3.110",
      //           // stylename: { left: "29.3%", top: "14%" },
      //           stylename: { left: "34%", top: "5%" },
      //         },
      //         {
      //           id: "7",
      //           tubiao: require("../../../assets/image/双目-半球.png"),
      //           ikey: "shuangmu",
      //           ip: "22.18.3.111",
      //           // stylename: { left: "36.5%", top: "20%" },
      //           stylename: { left: "43.5%", top: "11%" },
      //         },
      //         {
      //           id: "8",
      //           tubiao: require("../../../assets/image/双目-半球.png"),
      //           ikey: "shuangmu",
      //           ip: "22.18.3.112",
      //           // stylename: { left: "37.5%", top: "20%" },
      //           stylename: { left: "45%", top: "11%" },
      //         },
      //         {
      //           id: "9",
      //           tubiao: require("../../../assets/image/双目-半球.png"),
      //           ikey: "shuangmu",
      //           ip: "22.18.3.113",
      //           // stylename: { left: "45%", top: "14%" },
      //           stylename: { left: "57%", top: "7%" },
      //         },
      //         {
      //           id: "10",
      //           tubiao: require("../../../assets/image/双目-半球.png"),
      //           ikey: "shuangmu",
      //           ip: "22.18.3.114",
      //           // stylename: { left: "63.5%", top: "20%" },
      //           stylename: { left: "73.5%", top: "13%" },
      //         },
      //         {
      //           id: "11",
      //           tubiao: require("../../../assets/image/双目-半球.png"),
      //           ikey: "shuangmu",
      //           ip: "22.18.3.116",
      //           // stylename: { left: "69%", top: "13%" },
      //           stylename: { left: "83.5%", top: "6%" },
      //         },
      //         // 墙角 固定式
      //         // 智能感知终端
      //         {
      //           id: "12",
      //           tubiao: require("../../../assets/image/固定式-枪机-下.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.75",
      //           // stylename: { left: "65%", top: "93%" },
      //           stylename: { left: "62.5%", top: "96%" },
      //         },
      //         {
      //           id: "13",
      //           tubiao: require("../../../assets/image/固定式-枪机.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.76",
      //           // stylename: { left: "21%", top: "93%" },
      //           stylename: { left: "18%", top: "92%" },
      //         },
      //         {
      //           id: "14",
      //           tubiao: require("../../../assets/image/固定式-枪机-上.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.77",
      //           // stylename: { left: "20%", top: "91%" },
      //           stylename: { left: "17%", top: "89%" },
      //         },
      //         {
      //           id: "15",
      //           tubiao: require("../../../assets/image/固定式-枪机-下.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.78",
      //           // stylename: { left: "22%", top: "43%" },
      //           stylename: { left: "17%", top: "51%" },
      //         },
      //         {
      //           id: "16",
      //           tubiao: require("../../../assets/image/固定式-枪机.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.79",
      //           // stylename: { left: "2.5%", top: "39%" },
      //           stylename: { left: "3%", top: "47%" },
      //         },
      //         {
      //           id: "17",
      //           tubiao: require("../../../assets/image/固定式-枪机-上.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.80",
      //           // stylename: { left: "1.5%", top: "37%" },
      //           stylename: { left: "2%", top: "45%" },
      //         },
      //         {
      //           id: "18",
      //           tubiao: require("../../../assets/image/固定式-枪机-下.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.81",
      //           // stylename: { left: "6%", top: "13%" },
      //           stylename: { left: "2%", top: "7%" },
      //         },
      //         {
      //           id: "19",
      //           tubiao: require("../../../assets/image/固定式-枪机.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.82",
      //           // stylename: { left: "7%", top: "12%" },
      //           stylename: { left: "3%", top: "5%" },
      //         },
      //         {
      //           id: "20",
      //           tubiao: require("../../../assets/image/固定式-枪机-左.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.83",
      //           // stylename: { left: "84%", top: "9%" },
      //           stylename: { left: "96%", top: "5%" },
      //         },
      //         {
      //           id: "21",
      //           tubiao: require("../../../assets/image/固定式-枪机-下.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.84",
      //           // stylename: { left: "85%", top: "10%" },
      //           stylename: { left: "97%", top: "7%" },
      //         },
      //         {
      //           id: "22",
      //           tubiao: require("../../../assets/image/固定式-枪机-上.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.85",
      //           // stylename: { left: "92%", top: "88%" },
      //           stylename: { left: "97%", top: "89%" },
      //         },
      //         {
      //           id: "23",
      //           tubiao: require("../../../assets/image/固定式-枪机-左.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.86",
      //           // stylename: { left: "91%", top: "90%" },
      //           stylename: { left: "96%", top: "92%" },
      //         },
      //         {
      //           id: "24",
      //           tubiao: require("../../../assets/image/旋转式-球机.png"),
      //           ikey: "yuntai",
      //           ip: "22.18.3.117",
      //           // stylename: { left: "52%", top: "79%" },
      //           stylename: { left: "51%", top: "75%" },
      //         },
      //         {
      //           id: "25",
      //           tubiao: require("../../../assets/image/旋转式-球机.png"),
      //           ikey: "yuntai",
      //           ip: "22.18.3.118",
      //           // stylename: { left: "56%", top: "62%" },
      //           stylename: { left: "53.5%", top: "59%" },
      //         },
      //         {
      //           id: "26",
      //           tubiao: require("../../../assets/image/固定式-枪机-下.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.115",
      //           // stylename: { left: "70%", top: "55%" },
      //           stylename: { left: "74%", top: "55%" },
      //         },
      //         {
      //           id: "27",
      //           tubiao: require("../../../assets/image/固定式-枪机-下.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.87",
      //           // stylename: { left: "38.5%", top: "55%" },
      //           stylename: { left: "41.5%", top: "55%" },
      //         },
      //         {
      //           id: "28",
      //           tubiao: require("../../../assets/image/固定式-枪机-上.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.99",
      //           // stylename: { left: "63%", top: "54%" },
      //           stylename: { left: "69%", top: "53%" },
      //         },
      //         {
      //           id: "29",
      //           tubiao: require("../../../assets/image/固定式-枪机-下.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.100",
      //           // stylename: { left: "63%", top: "41.5%" },
      //           stylename: { left: "69%", top: "37.5%" },
      //         },
      //         {
      //           id: "30",
      //           tubiao: require("../../../assets/image/旋转式-球机.png"),
      //           ikey: "yuntai",
      //           ip: "22.18.3.104",
      //           // stylename: { left: "57%", top: "40%" },
      //           stylename: { left: "63%", top: "39%" },
      //         },
      //         {
      //           id: "31",
      //           tubiao: require("../../../assets/image/固定式-枪机-下.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.102",
      //           // stylename: { left: "62%", top: "27%" },
      //           stylename: { left: "68%", top: "21%" },
      //         },
      //         {
      //           id: "32",
      //           tubiao: require("../../../assets/image/固定式-枪机-下.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.101",
      //           // stylename: { left: "63.2%", top: "27%" },
      //           stylename: { left: "69.2%", top: "21%" },
      //         },
      //         {
      //           id: "33",
      //           tubiao: require("../../../assets/image/固定式-枪机-左.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.93",
      //           // stylename: { left: "47%", top: "29%" },
      //           stylename: { left: "49.5%", top: "25%" },
      //         },
      //         {
      //           id: "34",
      //           tubiao: require("../../../assets/image/固定式-枪机-左.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.94",
      //           // stylename: { left: "47%", top: "32%" },
      //           stylename: { left: "49.5%", top: "29%" },
      //         },
      //         {
      //           id: "35",
      //           tubiao: require("../../../assets/image/固定式-枪机-左.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.95",
      //           // stylename: { left: "47%", top: "35%" },
      //           stylename: { left: "49.5%", top: "33%" },
      //         },
      //         {
      //           id: "36",
      //           tubiao: require("../../../assets/image/固定式-枪机-左.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.96",
      //           // stylename: { left: "47%", top: "42%" },
      //           stylename: { left: "49.5%", top: "42%" },
      //         },
      //         {
      //           id: "37",
      //           tubiao: require("../../../assets/image/固定式-枪机-左.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.97",
      //           // stylename: { left: "47%", top: "45%" },
      //           stylename: { left: "49.5%", top: "45%" },
      //         },
      //         {
      //           id: "38",
      //           tubiao: require("../../../assets/image/固定式-枪机-左.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.98",
      //           // stylename: { left: "47%", top: "48%" },
      //           stylename: { left: "49.5%", top: "48%" },
      //         },
      //         {
      //           id: "39",
      //           tubiao: require("../../../assets/image/旋转式-球机.png"),
      //           ikey: "yuntai",
      //           ip: "22.18.3.103",
      //           // stylename: { left: "30%", top: "51%" },
      //           stylename: { left: "29%", top: "53%" },
      //         },
      //         {
      //           id: "40",
      //           tubiao: require("../../../assets/image/固定式-枪机.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.88",
      //           // stylename: { left: "28%", top: "40%" },
      //           stylename: { left: "30%", top: "36%" },
      //         },
      //         {
      //           id: "41",
      //           tubiao: require("../../../assets/image/固定式-枪机.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.89",
      //           // stylename: { left: "28%", top: "36.5%" },
      //           stylename: { left: "30%", top: "32.5%" },
      //         },
      //         {
      //           id: "42",
      //           tubiao: require("../../../assets/image/固定式-枪机.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.90",
      //           // stylename: { left: "28%", top: "33%" },
      //           stylename: { left: "30%", top: "29%" },
      //         },
      //         {
      //           id: "43",
      //           tubiao: require("../../../assets/image/固定式-枪机-上.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.91",
      //           // stylename: { left: "19%", top: "38%" },
      //           stylename: { left: "18%", top: "41%" },
      //         },
      //         {
      //           id: "44",
      //           tubiao: require("../../../assets/image/固定式-枪机-下.png"),
      //           ikey: "stationary",
      //           ip: "22.18.3.92",
      //           // stylename: { left: "18.5%", top: "26.5%" },
      //           stylename: { left: "18%", top: "25%" },
      //         },
      //         {
      //           id: "45",
      //           tubiao: require("../../../assets/image/固定式-枪机-上.png"),
      //           ikey: "stationary",
      //           // ip: "22.18.3.23",
      //           ip:"",
      //           stylename: { left: "62.5%", top: "92%" },
      //         },
      //         {
      //           id: "46",
      //           tubiao: require("../../../assets/image/远距离双目.png"),
      //           ikey: "shuangmu",
      //           ip: "22.18.3.40",
      //           // stylename: { left: "43%", top: "39%" },
      //           stylename: { left: "45%", top: "38%" },
      //         },
      //         {
      //           id: "47",
      //           tubiao: require("../../../assets/image/远距离双目.png"),
      //           ikey: "shuangmu",
      //           ip: "22.18.3.41",
      //           // stylename: { left: "35%", top: "40%" },
      //           stylename: { left: "34%", top: "38%" },
      //         },

      //       ],
      //     },
      //   ]
      //   var cameraipgather = {};
      //   this.ipgather = [];
      //   this.imglist[0].ilist.map((v)=>{
      //     this.cameradatalist.map((y)=>{
      //       if(v.ip === y.ip){
      //         v.cameraName = y.cameraName;
      //         v.cameraId = y.cameraId; //摄像头id
      //         v.hasNvr = y.hasNvr; //nvr 回放
      //         v.hasInfrared = y.hasInfrared //红热线
      //         v.hasTbk = y.hasTbk //对讲
      //         v.hasPtz = y.hasPtz //云台
      //       }
      //     })
      //     // console.log(v)
      //     cameraipgather={
      //       id:v.id,
      //       ip:v.ip,
      //       ikey:v.ikey,
      //       cameraName:v.cameraName,
      //       cameraId:v.cameraId,
      //       hasNvr:v.hasNvr,
      //       hasTbk:v.hasTbk,
      //       hasInfrared:v.hasInfrared,
      //       hasPtz:v.hasPtz
      //     }
      //     this.ipgather.push(cameraipgather);
      //   })
      //   console.log("#################",this.ipgather)
      //   window.sessionStorage.setItem("ipgathers",JSON.stringify(this.ipgather));
      //   console.log(JSON.parse(window.sessionStorage.getItem("ipgathers")),'---ip集合');
      // });
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
    // 统计缺陷
    // getboosterdefect(){
    //   console.log(this.areafanId,'---',this.alarmareaid);
    //   getBoosterStationAlarm(this.alarmareaid).then(response => {
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
    //     this.boosterpielist.xAxisDate = date;
    //     this.boosterpielist.expectedData = data;
    //   })
    // },

     // 告警类别下拉列表
    getalarmtypelist() {
      listDefect().then(response => {
        console.log(response,"缺陷下拉列表")
        this.quexianoptions = response.rows;
      });
    },
    changeCamera(val){
      console.log(val);
      this.cameraParam.cameraIds=val;
      this.getCameraTempList(this.cameraParam);
      saveSelectionDefault({"defaultValue": val.join(",")});
    },
     // 设备下拉列表
    getcameralists() {
        getCameraList(this.alarmareaid).then(response => {
            this.cameraList = response.data;
            //从后台查询上次设备列表选项
            getSelectionDefault().then(selectionResp => {
                let data = undefined;
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
    // 点击视频弹框
    showModal(item) {
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
    handleclose(){
      window.frames['videoiframediv'].userfunc();
      window.frames['videoiframediv'].clickLogout();
      this.isshowvideo = false;
    },

    // // 告警类型
    // changeType(val){
    //   console.log(val);
    //   // this.queryParams.pageNum = 1;
    //   console.log(this.queryParams);
    //   // this.gettableList()
    // },

    /** 搜索按钮操作 */
    handleQuery() {
      // this.queryParams.pageNum = 1;
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
    gettableList(){  //获取表格
      this.loading = true;
      console.log(this.alarmareaid,'----===');
      this.queryParams.areaId = this.alarmareaid;
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
    getCameraTempList(param){  //获取表格
      this.loading = true;
      getDeviceTemp(param).then(response => {
        this.drawLine(response.data);
        this.loading = false;
      });
    },
      /** 详情按钮操作 */
    handleDetails(row) {
      this.row = row;
      this.alarmDetailId = row.alarmDetailId;
      this.open = true
      this.title = '详情'
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
    color: #2d8cf0 !important;
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
    min-height: calc(100vh - 80px);
    padding: 15px;
  }
  .biaoshi{
    font-weight: 500;
  }
  .bootcontent{
    min-height: calc(100vh - 625px);
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

    .chartcontent{
      height: 390px;
      background: #ffffff;
      margin-top:10px;
      padding: 10px;
        .dev-select{
          /deep/.el-select{
            width: 320px;

            >div>span>span:first-child {
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              max-width: 220px
            }
          }
        }
    }

    .pictureshow{
      height: 600px;
      margin-top:10px;
      padding: 10px;
      background: #ffffff;

      .imgcol{
        height: 565px;

        .imgdiv{
          height: 565px;
          padding: 10px;
          text-align: center;

          .lunbodiv{
            /deep/ .el-carousel__container{
              height: 580px;
              position: relative;
              top: 0px;
              left: 0px;
            }
            .card_pre{
              width: 100%;
              height: 545px;

              .bgimg{
                width: 100%;
                height: 100%;
                position: relative;
                top: 0px;
                left: 0px;
              }

              .bd_ccc{
                .mg_20{
                  width: 22px;
                  height: 22px;
                  margin-right: 300px;
                  img{
                    width: 22px;
                    height: 22px;
                    position: absolute;
                    top: 10px;
                    left: 10px;
                  }
                }
                .mg_20:hover{
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
    }
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
  @media (max-width:1024px) {
    .clear{
        clear: both;
    }

    .bottom-bootcontent{
      width: 100%;
    }
    .top-bootcontent{
      width: 100%;
    }

}
</style>
