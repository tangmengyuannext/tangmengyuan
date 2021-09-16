<template>
   <div class="app-container">
      <div class="fandetails">
        <div class="header">
          <h2 class="title">风机详情<span class="biaoshi">名称：{{this.fanpageTitle}}</span></h2>
          <div class="right-alarm" @click="alarmTableVisible = true">
            <el-badge :value="total" :max="999" class="item">
              <img :src="alarmSrc" style="width: 30px; height: 30px;"/>
            </el-badge>
          </div>
        </div>
        <div style="clear:both;height:0px;"></div>
        <!-- <el-row :gutter="15">
          <el-col :span="12"> -->
            <div class="fanchart">
              <h3 class="linetitle">温度曲线</h3>
              <div class="linecont">
                <line-chart :chart-data="fan24templist"></line-chart>
                <!-- <pie-chart :chart-data="fandefectlist"></pie-chart> -->
              </div>
            </div>
          <!-- </el-col>
          <el-col :span="12"> -->
            
        <overview :data="overviewData"/>
            <!-- <div class="pictureshow">
              <h3 class="picturetitle">风机示意图</h3>
              <div class="imgcol">
                <div class="imgdiv">
                  <el-carousel class="lunbodiv" indicator-position="none" :loop="false" :autoplay="false">
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
          <!-- </el-col>
        </el-row> -->

        <!-- <el-dialog :title="videotitle" :visible.sync="videodiv" width="1000px" append-to-body @close="handleclose">
            <div class="videoIframe">
              <iframe id="videoiframes" name="videoiframediv" src="../../../../peidianshivideo/cn/demo.html" frameborder="0" scrolling="no" style="width:930px; height:850px;z-index:-1;"></iframe>
            </div>
        </el-dialog> -->
      </div>
      <el-dialog title="告警情况" :visible.sync="alarmTableVisible" width="900px" append-to-body>
        <div class="tablecol chart-wrapper">
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

  </div>
</template>

<script>
import { getConfirms } from "@/api/survey/fan/fandetails";
import {listDefect} from "@/api/device/defect";
import { listRealtime, dispose } from "@/api/alarm/realtime";
import { listArea } from "@/api/device/area";
import { listCamera } from "@/api/device/camera";
import LineChart from "../../dashboard/LineChart";
import PieChart from "../../dashboard/PieChart";
import { listConfig } from "@/api/system/config"; //全局获取告警图片IP地址和摄像头账户密码
import { getToken } from "@/utils/auth";
import Detail from "../../details/Detail.vue";
import { getFantemp,getFantemp24,getFandefect } from "@/api/survey/fan/fan";
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
// var Array = [1,2,3,4,5,6,7,8,9,10,11,12];;
//  var groupedArray = group(Array, 6);


export default {
  // name: "fandetails",
  components: {
    // FanLinechart,
    Detail,
    LineChart,
    PieChart,
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
      // 动态获取摄像头账户密码
      camerauser:"",
      camerapassword:"",
      // 动态获取NVR地址
      nvrip:"",
      bifocalhttpads:"",
      fanareadatalist:[], //区域下风机的数据
      areafanId:"", //唯一标识
      alarmSrc: AlarmSrc,
      // 遮罩层
      loading: true,
      fanpageTitle:"",
      tablecheckedList:[],
      tableTitle:"",
      fanlist:"",
      fanpie:"",
      alarmTableVisible:false,
      // 查询参数
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
        orderByColumn: "confirmStatus asc, eventTime desc",
        isAsc: "",
        defectId: undefined,
        areaId:undefined,
      },
      // 告警类别 下拉列表
      quexianoptions: [],
      //  // 总条数
      total: 0,
      tableData: [],
      topTitle:"",
      // bottomTitle:"",
      formInline:{
        maxTemp:undefined,
        minTemp:undefined,
        realTemp:undefined
      },
      fan24templist:{
        expectedData: [],
        xAxisDate: [],
        legendData:[]
      },
      // fandefectlist:{
      //   expectedData: [],
      //   xAxisDate: [],
      // },
       // 弹出层标题
      title: "",
      alarmDetailId:null,
      // 是否显示弹出层
      open: false,
      dialogClearVisible: false,
       // 表单参数
      form: {},
      formClear: {},
      clearId: undefined,
      formDisabled:true,
      isconfirmBy:true,
      // 动态获取告警图片IP地址
      alarmimgipurl:"",
      // 图片前的IP地址
      imageheader:"",
      srcList:[],
      // 表单校验
      rules: {
        disposeBy: [
          { required: true, message: '请输入处理人', trigger: 'blur' }
        ],
        disposeNote: [
          { required: true, message: '请输入处理方式', trigger: 'blur' }
        ]
      },
      row: {
        confirmStatus: undefined,
      },
      // imglist:[],
      // ipgather:[],
      // //视频弹框
      // videotitle:"",
      // videodiv:false,
      // isshowvideo:false,

      cameradatalist:[], //摄像头列表,
      //heart
      heartcameraid:"0",
      setIntervalheart:null,

      // 历史报警重复次数
      repeatTimes: undefined,
      // 历史报警重复列表
      repeatList: undefined,
      alarmlevellist:[],
      firstCameraName:"正在获取摄像头名称",
    }
  },
  created(){
    this.areafanId = this.$route.path.split('/')[this.$route.path.split('/').length - 1];
    this.overviewData={
      areaId: this.areafanId,
      height: 400,
      activeClass:'pictureshow',
      titleClass:'picturetitle',
      isClick:false,
    }
    // if(this.areafanId == 899){
    //   this.overviewData={
    //     areaId: 899,
    //     title: '风机示意图',
    //     height: '400px',
    //     activeClass:'pictureshow',
    //     titleClass:'picturetitle',
    //     isClick:false,
    //   }
    // }else if(this.areafanId == 900){
    //   this.overviewData={
    //     areaId: 900,
    //     title: '风机示意图',
    //     height: '400px',
    //     activeClass:'pictureshow',
    //     titleClass:'picturetitle',
    //     isClick:false,
    //   }
    // }
    this.getcameraList();
    this.getcameraip();
    this.getalarmtypelist();
    this.gettableList();
    window.sessionStorage.setItem("brearer",getToken());
    window.sessionStorage.setItem("httpurl",process.env.VUE_APP_BASE_API);
    this.getfantemp();
    this.getfantemplist();
    // this.getfandefect();
    this.getDicts("alarm_level").then(response => {
      this.alarmlevellist = response.data;
    });
  },
  mounted() {
    setTimeout(()=>{
      this.getarealist();
    },500)
    this.fanlist = "风机列表";
    this.topTitle = "温度实时监测";
    this.tableTitle = "告警情况";
    this.fanpie = "30日告警分布";
    this.imageheader = window.sessionStorage.getItem("alarmimgipurl");
  },
  computed:{
    fanpageTitles:function(){
      return this.fanpageTitle;
    }
  },
  destroyed() {
    window.frames['videoiframediv'].userfunc();
    window.frames['videoiframediv'].clickLogout();
    // window.clearInterval(window.sessionStorage.getItem("timer"));
    // window.sessionStorage.setItem("timer",null);
    // window.frames['videoiframediv'].userfunc();
  },
  methods: {
    // 告警级别字典翻译
    alarmlevelFormat(row, column) {
      return row !== null ? this.selectDictLabel(this.alarmlevellist, row.alarmLevel) : null;
    },
    getcameraList(){
      listCamera().then(response => {
        // console.log(response,"摄像头数据");
        this.cameradatalist = response.rows;
        console.log("this.cameradatalist===",this.cameradatalist)
      });
    },
    getarealist(){
      listArea().then(response => {
        var datalist = [];
        response.data.map((v)=>{
            if(v.areaType == "1"){
              datalist.push(v);
            }
        })
        this.fanareadatalist = datalist;
        var query = this.areafanId;
        console.log(query);
        this.fanareadatalist.map((v)=>{
          // console.log(v);
          if(query == v.areaId){
            // console.log(v.areaName,'======areaName');
            this.fanpageTitle = v.areaName;
          }
        })
//         if(query == 899){ //FD09风机
//           this.imglist = [
//             {
//               imgSrc:require('../../../assets/image/风机HG16.jpg'),
//               id:'111',
//               ilist:[
//                 // {id:"1",tubiao:require("../../../assets/image/shexiangtou_07.png"),ikey:"shuangmu",ip:"22.18.3.151",stylename:{left:"45%",top:"33%"}}, //22.18.3.151
//                 // {id:"2",tubiao:require("../../../assets/image/shexiangtou_10.png"),ikey:"yuntai",ip:"22.18.3.155",stylename:{left:"56%",top:"34%"}}, //22.18.3.155
//                 // {id:"3",tubiao:require("../../../assets/image/shexiangtou_10.png"),ikey:"yuntai",ip:"22.18.3.153",stylename:{left:"60%",top:"36%"}},
//                 // {id:"4",tubiao:require("../../../assets/image/shexiangtou_09.png"),ikey:"stationary",ip:"22.18.3.156",stylename:{left:"53%",top:"41%"}},
//                 // {id:"5",tubiao:require("../../../assets/image/shexiangtou_10.png"),ikey:"yuntai",ip:"22.18.3.154",stylename:{left:"56%",top:"41%"}},
//                 // {id:"6",tubiao:require("../../../assets/image/shexiangtou_09.png"),ikey:"stationary",ip:"22.18.3.158",stylename:{left:"47%",top:"68%"}},
//                 // {id:"7",tubiao:require("../../../assets/image/shexiangtou_07.png"),ikey:"shuangmu",ip:"22.18.3.152",stylename:{left:"50%",top:"87%"}},
//                 // {id:"8",tubiao:require("../../../assets/image/shexiangtou_09.png"),ikey:"stationary",ip:"22.18.3.157",stylename:{left:"60%",top:"90%"}}, //22.18.3.157
// // -----------------hk--------------
//                 // {id:"1",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.151",stylename:{left:"45%",top:"16%"}},
//                 // {id:"2",tubiao:require("../../../assets/image/固定式-枪机1.png"),ikey:"stationary",ip:"22.18.3.155",stylename:{left:"54%",top:"9%"}},
//                 // {id:"3",tubiao:require("../../../assets/image/旋转式-球机1.png"),ikey:"yuntai",ip:"22.18.3.153",stylename:{left:"59%",top:"9%"}},
//                 // {id:"4",tubiao:require("../../../assets/image/固定式-枪机1.png"),ikey:"stationary",ip:"22.18.3.156",stylename:{left:"56.5%",top:"12%"}},
//                 // {id:"5",tubiao:require("../../../assets/image/旋转式-球机1.png"),ikey:"yuntai",ip:"22.18.3.154",stylename:{left:"63%",top:"28%"}},
//                 // {id:"6",tubiao:require("../../../assets/image/固定式-枪机1.png"),ikey:"stationary",ip:"22.18.3.158",stylename:{left:"43%",top:"65%"}},
//                 // {id:"7",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.152",stylename:{left:"41%",top:"84%"}},
//                 // {id:"8",tubiao:require("../../../assets/image/固定式-枪机-架.png"),ikey:"stationary",ip:"22.18.3.157",stylename:{left:"26%",top:"78%"}},

//                 // {id:"1",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"192.168.1.21",stylename:{left:"58%",top:"17%"}},
//                 // {id:"2",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"192.168.1.23",stylename:{left:"41%",top:"92%"}}, //22.18.3.155
//                 // {id:"3",tubiao:require("../../../assets/image/旋转式-球机1.png"),ikey:"yuntai",ip:"192.168.1.25",stylename:{left:"49%",top:"30%"}},
//                 // {id:"4",tubiao:require("../../../assets/image/固定式-枪机1.png"),ikey:"stationary",ip:"192.168.1.22",stylename:{left:"56.5%",top:"12%"}},
//                 // {id:"5",tubiao:require("../../../assets/image/固定式-枪机1.png"),ikey:"stationary",ip:"192.168.1.24",stylename:{left:"54%",top:"9%"}},

//                 {id:"1",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.151",stylename:{left:"45%",top:"16%"}},
//                 {id:"2",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.152",stylename:{left:"41%",top:"84%"}},
//                 {id:"3",tubiao:require("../../../assets/image/旋转式-球机1.png"),ikey:"yuntai",ip:"22.18.3.153",stylename:{left:"59%",top:"9%"}},
//                 {id:"4",tubiao:require("../../../assets/image/旋转式-球机1.png"),ikey:"yuntai",ip:"22.18.3.154",stylename:{left:"63%",top:"28%"}},
//                 {id:"5",tubiao:require("../../../assets/image/固定式-枪机1.png"),ikey:"stationary",ip:"22.18.3.155",stylename:{left:"54%",top:"9%"}},
//                 {id:"6",tubiao:require("../../../assets/image/固定式-枪机1.png"),ikey:"stationary",ip:"22.18.3.156",stylename:{left:"56.5%",top:"12%"}},
//                 {id:"7",tubiao:require("../../../assets/image/固定式-枪机-架.png"),ikey:"stationary",ip:"22.18.3.157",stylename:{left:"26%",top:"78%"}},
//                 {id:"8",tubiao:require("../../../assets/image/固定式-枪机1.png"),ikey:"stationary",ip:"22.18.3.158",stylename:{left:"43%",top:"65%"}},
// // -----------------hk--------------
//               ]
//             },
//           ]
//           var cameraipgather = {};
//           this.ipgather = [];
//           this.imglist[0].ilist.map((v)=>{
//             this.cameradatalist.map((y)=>{
//               if(y.ip == v.ip){
//                 v.cameraName = y.cameraName;
//                 v.cameraId = y.cameraId; //摄像头id
//                 v.hasNvr = y.hasNvr; //nvr 回放
//                 v.hasInfrared = y.hasInfrared //红热线
//                 v.hasTbk = y.hasTbk //对讲
//                 v.hasPtz = y.hasPtz //云台
//               }
//             })
//             // console.log(v)
//             cameraipgather={
//               id:v.id,
//               ip:v.ip,
//               ikey:v.ikey,
//               cameraName:v.cameraName,
//               cameraId:v.cameraId,
//               hasNvr:v.hasNvr,
//               hasTbk:v.hasTbk,
//               hasInfrared:v.hasInfrared,
//               hasPtz:v.hasPtz
//             }
//             // cameraipgather.push(v.ip)
//             this.ipgather.push(cameraipgather);
//           })
//           // this.firstCameraName = this.ipgather[0].cameraName;
//           // this.setItemDefFirstMess();
//           console.log("风点击组@@@@@@@@@@@@@@@@@@@",this.ipgather)
//           window.sessionStorage.setItem("ipgathers",JSON.stringify(this.ipgather));
//           // console.log(JSON.parse(window.sessionStorage.getItem("ipgathers")),'---ip集合');
//         }else if(query == 900){ //LJ07风机
//           this.imglist = [
//             {
//               imgSrc:require('../../../assets/image/风机HG16.jpg'),
//               id:'111',
//               ilist:[
//                 // {id:"1",tubiao:require("../../../assets/image/shexiangtou_09.png"),ikey:"stationary",ip:"22.18.3.128",stylename:{left:"45%",top:"36%"}},
//                 // {id:"2",tubiao:require("../../../assets/image/shexiangtou_10.png"),ikey:"yuntai",ip:"22.18.3.126",stylename:{left:"20.5%",top:"27%"}},
//                 // {id:"3",tubiao:require("../../../assets/image/shexiangtou_07.png"),ikey:"shuangmu",ip:"22.18.3.121",stylename:{left:"20.5%",top:"40%"}},
//                 // {id:"4",tubiao:require("../../../assets/image/shexiangtou_10.png"),ikey:"yuntai",ip:"22.18.3.125",stylename:{left:"20.5%",top:"49%"}},
//                 // {id:"5",tubiao:require("../../../assets/image/shexiangtou_10.png"),ikey:"yuntai",ip:"22.18.3.124",stylename:{left:"29%",top:"56%"}},
//                 // {id:"6",tubiao:require("../../../assets/image/shexiangtou_09.png"),ikey:"stationary",ip:"22.18.3.129",stylename:{left:"29%",top:"75%"}},
//                 // {id:"7",tubiao:require("../../../assets/image/shexiangtou_10.png"),ikey:"yuntai",ip:"22.18.3.123",stylename:{left:"45%",top:"89%"}},
//                 // {id:"8",tubiao:require("../../../assets/image/shexiangtou_07.png"),ikey:"shuangmu",ip:"22.18.3.122",stylename:{left:"42%",top:"89%"}},
//                 // {id:"9",tubiao:require("../../../assets/image/shexiangtou_09.png"),ikey:"stationary",ip:"22.18.3.127",stylename:{left:"39%",top:"89%"}},
//           // -----------------hk修改--------------
//                 {id:"1",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.122",stylename:{left:"43%",top:"86%"}},
//                 {id:"2",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"22.18.3.121",stylename:{left:"63%",top:"22%"}},
//                 {id:"3",tubiao:require("../../../assets/image/旋转式-球机1.png"),ikey:"yuntai",ip:"22.18.3.126",stylename:{left:"59%",top:"9%"}},
//                 {id:"4",tubiao:require("../../../assets/image/旋转式-球机1.png"),ikey:"yuntai",ip:"22.18.3.125",stylename:{left:"65%",top:"28%"}},
//                 {id:"5",tubiao:require("../../../assets/image/固定式-枪机1.png"),ikey:"stationary",ip:"22.18.3.128",stylename:{left:"48%",top:"30%"}},
//                 {id:"6",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.124",stylename:{left:"63%",top:"40%"}},
//                 {id:"7",tubiao:require("../../../assets/image/固定式-枪机1.png"),ikey:"stationary",ip:"22.18.3.129",stylename:{left:"42%",top:"62%"}},
//                 {id:"8",tubiao:require("../../../assets/image/旋转式-半球.png"),ikey:"yuntai",ip:"22.18.3.123",stylename:{left:"42%",top:"78%"}},
//                 {id:"9",tubiao:require("../../../assets/image/固定式-枪机-架.png"),ikey:"stationary",ip:"22.18.3.127",stylename:{left:"38%",top:"91%"}},
//           // -----------------hk修改--------------
//               ]
//             },
//           ]
//           var cameraipgather = {};
//           this.ipgathe = [];
//           this.imglist[0].ilist.map((v)=>{
//             this.cameradatalist.map((y)=>{
//               if(y.ip == v.ip){
//                 v.cameraName = y.cameraName;
//                 v.cameraId = y.cameraId; //摄像头id
//                 v.hasNvr = y.hasNvr; //nvr 回放
//                 v.hasInfrared = y.hasInfrared //红热线
//                 v.hasTbk = y.hasTbk //对讲
//                 v.hasPtz = y.hasPtz //云台
//               }
//             })
//             // console.log(v)
//             cameraipgather={
//               id:v.id,
//               ip:v.ip,
//               ikey:v.ikey,
//               cameraId:v.cameraId,
//               cameraName:v.cameraName,
//               hasNvr:v.hasNvr,
//               hasTbk:v.hasTbk,
//               hasInfrared:v.hasInfrared,
//               hasPtz:v.hasPtz
//             }
//             this.ipgather.push(cameraipgather);
//           })

//           window.sessionStorage.setItem("ipgathers",JSON.stringify(this.ipgather));
//           // console.log(JSON.parse(window.sessionStorage.getItem("ipgathers")),'---ip集合');
//         }else if(query == 6){ //安徽风机
//           this.imglist = [
//             {
//               imgSrc:require('../../../assets/image/风机HG16.jpg'),
//               id:'333',
//               ilist:[
//                  //-------------------------------安徽项目组摄像头----------------------------------//
//                 {id:"1",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"192.168.0.101",stylename:{left:"49%",top:"30%"}}, //22.18.3.151
//                 {id:"2",tubiao:require("../../../assets/image/双目-半球.png"),ikey:"shuangmu",ip:"192.168.0.100",stylename:{left:"41%",top:"92%"}}, //22.18.3.155
//                 {id:"3",tubiao:require("../../../assets/image/旋转式-球机1.png"),ikey:"yuntai",ip:"192.168.0.103",stylename:{left:"58%",top:"17%"}},
//                 {id:"4",tubiao:require("../../../assets/image/旋转式-球机1.png"),ikey:"yuntai",ip:"192.168.0.104",stylename:{left:"52%",top:"9%"}},
//                 {id:"5",tubiao:require("../../../assets/image/固定式-枪机1.png"),ikey:"stationary",ip:"192.168.0.105",stylename:{left:"58%",top:"30%"}},
//                 {id:"6",tubiao:require("../../../assets/image/固定式-枪机1.png"),ikey:"stationary",ip:"192.168.0.110",stylename:{left:"45%",top:"53%"}},
//                 {id:"7",tubiao:require("../../../assets/image/固定式-枪机1.png"),ikey:"stationary",ip:"192.168.0.107",stylename:{left:"47%",top:"84%"}},
//                 {id:"8",tubiao:require("../../../assets/image/旋转式-球机1.png"),ikey:"yuntai",ip:"192.168.0.108",stylename:{left:"54%",top:"92%"}}, //22.18.3.157
//                 {id:"9",tubiao:require("../../../assets/image/风机-定.png"),ikey:"yuntai",ip:"192.168.0.109",stylename:{left:"35%",top:"79%",width:"17px"}}, //22.18.3.157
//               ]
//             },
//           ]
//           var cameraipgather = {};
//           this.ipgather = [];
//           this.imglist[0].ilist.map((v)=>{
//             this.cameradatalist.map((y)=>{
//               if(y.ip == v.ip){
//                 v.cameraName = y.cameraName;
//                 v.cameraId = y.cameraId; //摄像头id
//                 v.hasNvr = y.hasNvr; //nvr 回放
//                 v.hasInfrared = y.hasInfrared //红热线
//                 v.hasTbk = y.hasTbk //对讲
//                 v.hasPtz = y.hasPtz //云台
//               }
//             })
//             // console.log(v)
//             cameraipgather={
//               id:v.id,
//               ip:v.ip,
//               ikey:v.ikey,
//               cameraName:v.cameraName,
//               cameraId:v.cameraId,
//               hasNvr:v.hasNvr,
//               hasTbk:v.hasTbk,
//               hasInfrared:v.hasInfrared,
//               hasPtz:v.hasPtz
//             }
//             // cameraipgather.push(v.ip)
//             this.ipgather.push(cameraipgather);
//           })
//           window.sessionStorage.setItem("ipgathers",JSON.stringify(this.ipgather));
//           // console.log(JSON.parse(window.sessionStorage.getItem("ipgathers")),'---ip集合');
//         }
      });
    },
    // 缓存第一条默认显示数据
    setItemDefFirstMess(){
      // alert("1234t5678909-setItemDefFirstMess")
      window.sessionStorage.setItem("sxtcameraid",this.ipgather[0].cameraId);
      window.sessionStorage.setItem("sxtcameraName",this.ipgather[0].cameraName);
      window.sessionStorage.setItem("sxtcameraip",this.ipgather[0].ip);
      window.sessionStorage.setItem("sxtikey",this.ipgather[0].ikey);
      window.sessionStorage.setItem("sxthasNvr",this.ipgather[0].hasNvr);
      window.sessionStorage.setItem("sxthasInfrared",this.ipgather[0].hasInfrared);
      window.sessionStorage.setItem("sxthasTbk",this.ipgather[0].hasTbk);
      window.sessionStorage.setItem("sxthasPtz",this.ipgather[0].hasPtz);
      console.log(JSON.parse(window.sessionStorage.setItem("sxtcameraName",this.ipgather[0].cameraName)),"##############显示第一条缓存数据")
    },
     // // //动态获取告警图片IP地址
    getcameraip(){
      listConfig().then(response => {
        // console.log(response.rows,'全局匹配的一些参数');
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
     /** 查询风机实时温度 */
    getfantemp(){
      getFantemp(this.areafanId).then(response => {
        console.log(response.data,'风机实时温度');
        this.formInline = response.data;
      })
    },
     /** 查询风机24小时温度 */
    getfantemplist(){
      var queryform = {
        areaId : this.areafanId
      }
      getFantemp24(queryform).then(response => {
        console.log(response,'风机24小时温度');
          let series = [];
          let startDate = undefined;
          let endDate=undefined;
          let legendData = [];
          let xAxisDate = [];
          let cameraIds = [];
          let tempData = response.data;
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

          this.fan24templist.legendData = legendData;
          this.fan24templist.xAxisDate = xAxisDate;
          this.fan24templist.expectedData = series;
      })
    },
    // getfandefect(){
    //   getFandefect(this.areafanId).then(response => {
    //     console.log(response,'缺陷数量');
    //     var res = response.rows;
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
    //     this.fandefectlist.xAxisDate = date;
    //     this.fandefectlist.expectedData = data;
    //   })
    // },

//     // 点击视频弹框
//     showModal(item) {
//       // alert("点击了风机图片")
//       // let htmlForBack = document.getElementById("videoiframes").contentWindow;
//       console.log("showModal111",item);
//       localStorage.removeItem("IsSetInterval");//清除heart标识缓存
//       if(item.cameraId !== undefined){
//         window.sessionStorage.setItem("sxtcameraid",item.cameraId);
//         window.sessionStorage.setItem("sxtcameraName",item.cameraName);
//         window.sessionStorage.setItem("sxtcameraip",item.ip);
//         window.sessionStorage.setItem("sxtikey",item.ikey);
//         window.sessionStorage.setItem("sxthasNvr",item.hasNvr);
//         window.sessionStorage.setItem("sxthasInfrared",item.hasInfrared);
//         window.sessionStorage.setItem("sxthasTbk",item.hasTbk);
//         window.sessionStorage.setItem("sxthasPtz",item.hasPtz);
//         // console.log(item.cameraId == undefined,'====cameraId=====');
//         this.isshowvideo = true;
//         // this.videotitle = "视频详情";
//         this.videodiv = true;
//         // htmlForBack?htmlForBack.videoIconClick():null;
//       }else if(item.cameraId == undefined){
//         this.getarealist();
//         this.$message({
//           type: 'warning',
//           message: '请重新点击打开'
//         })
//       }
//     },

//     handleclose(){
//       window.frames['videoiframediv'].userfunc();
//       window.frames['videoiframediv'].clickLogout();
//       this.isshowvideo = false;
//       //hk
//       localStorage.setItem("IsSetInterval", 1);
//       console.log("点击了X",localStorage.getItem("IsSetInterval"));
//     },

     // 告警类别下拉列表
    getalarmtypelist() {
      listDefect().then(response => {
        // console.log(response,"缺陷下拉列表")
        this.quexianoptions = response.rows;
      });
    },
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
      console.log(row);
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
    //获取表格
    gettableList(){
      this.loading = true;
      this.queryParams.areaId = this.areafanId;
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

     /** 详情按钮操作 */
    handleDetails(row) {
      // console.log(row);
      this.row = row;
      this.alarmDetailId = row.alarmDetailId;
      this.open = true;
      this.title = '详情';
    },
     /** 清除提交按钮 */
    submitClear: function() {
      this.$refs['formClear'].validate(valid => {
        if (valid) {
          // console.log(this.formClear);
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
      // console.log(row);
      this.dialogClearVisible = true;
      this.clearId = row.alarmDetailId;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.dialogClearVisible = false;
    },
  },
  // watch:{
  //   fanpageTitle:{
  //     handler(newval,oldval){
        // console.log(newval,oldval);
  //     },
  //     deep:true
  //   }
  // }
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

  .chart-wrapper{
    border-radius: 10px;
  }

  .app-container{
    background-color: rgb(240, 242, 245);
    min-height: calc(100vh - 80px);
    padding: 15px;
  }
  .fandetails{
    min-height: calc(100vh - 90px);
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

    .fanchart{
      height: 400px;
      background: #ffffff;
      margin-top:10px;
      padding: 10px;
    }

    .pictureshow{
      height: 460px;
      margin-top:10px;
      padding: 10px;
      background: #ffffff;

      .imgcol{
        height: 415px;

        .imgdiv{
          height: 415px;
          padding: 10px;
          text-align: center;
        }

        .lunbodiv{
            /deep/ .el-carousel__container{
              height: 400px;
              position: relative;
              top: 0px;
              left: 0px;
            }
          .card_pre{
            width: 100%;
            height: 400px;

            .bgimg{
              width: 100%;
              height: 100%;
              position: relative;
              top: 0px;
              left: 0px;
            }

            .bd_ccc{
              .mg_20{
                width: 21px;
                height: 21px;
                img{
                  width: 21px;
                  height: 21px;
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

    // .camerashow{
    //   height: 850px;
    //   background: #ffffff;
    //   margin-top:10px;
    //   padding: 10px;
    //   .cameratitle{
    //     margin-bottom: 10px;
    //     width: 100px;
    //     display: inline-block;
    //   }
    //   .camertitle_name{
    //     display: inline-block;
    //   }

    // }
  }

  .tablecol{

    .demo-form-inline{
      margin-left: 20px;
      .el-form-item{
        margin-bottom: 10px;
      }
      span{
        font-size: 16px;
      }
    }

    .el-table{
      width: 96%;
      margin-left: 2%;
      margin-right: 2%;
    }
  }

  @media (max-width:1024px) {
    .clear{
      clear: both;
    }

    .dv-charts-container .charts-canvas-container{
      width: 100%;
      height: 100%;
      /deep/canvas{
        width: 1000px;
      }
    }

}
</style>
