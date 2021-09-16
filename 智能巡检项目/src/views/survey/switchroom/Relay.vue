<template>
  <div class="app-container">
    <div class="switchroom">
      <div class="imgrow chart-wrapper">
        <div class="imgdiv">
          <!-- <i class="el-icon-share"></i> -->
          <el-carousel class="lunbodiv" height="300px" indicator-position="none" :loop="false" :autoplay="false">
            <el-carousel-item v-for="item in imglist" :key="item.id">
              <div class="card_pre">
                <img :src="item.imgSrc" class="w100p bd_blue bgimg">
                <div class="pos_ab top_0 left_0 h100p w100p bd_ccc">
                  <span class="mg_20" v-for="imgspan in item.ilist" :key="imgspan.ip" @click="showModal(imgspan)">
                    <!-- <i :class="imgspan.icon"></i> -->
                    <img :src="imgspan.tubiao"  :style="imgspan.stylename">
                  </span>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
<!--      <el-row :gutter="20" class="tablemain">-->
<!--        <el-col :xs="24" :sm="24" :lg="12">-->
<!--          <div class="boosterline">-->
<!--            <h3 class="p_title">{{this.wendutitle}}<span class="biaoshi">{{this.switchpageTitle}}</span></h3>-->
<!--&lt;!&ndash;              <el-form :inline="true" :model="cameraParam" class="demo-form-inline" v-if="true">&ndash;&gt;-->
<!--&lt;!&ndash;                <el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;                  <el-select multiple collapse-tags v-model="cameraParam.cameraIds" filterable placeholder="设备列表"  @change="changeCamera">&ndash;&gt;-->
<!--&lt;!&ndash;                    <el-option&ndash;&gt;-->
<!--&lt;!&ndash;                      v-for="dict in cameraList"&ndash;&gt;-->
<!--&lt;!&ndash;                      :key="dict.cameraId"&ndash;&gt;-->
<!--&lt;!&ndash;                      :label="dict.location"&ndash;&gt;-->
<!--&lt;!&ndash;                      :value="dict.cameraId"&ndash;&gt;-->
<!--&lt;!&ndash;                    ></el-option>&ndash;&gt;-->
<!--&lt;!&ndash;                  </el-select>&ndash;&gt;-->
<!--&lt;!&ndash;                </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;              </el-form>&ndash;&gt;-->
<!--            <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">-->
<!--              <div class="left-col">-->
<!--              <el-form-item label="最高温">-->
<!--                <el-input v-model="formInline.maxTemp" placeholder="0" :disabled="true" style="width: 100px"></el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item label="实时温度">-->
<!--                <el-input v-model="formInline.realTemp" placeholder="0" :disabled="true" style="width: 100px"></el-input>-->
<!--              </el-form-item>-->
<!--              <el-form-item>-->
<!--                <div class="dev-select">-->
<!--                  <el-select multiple collapse-tags v-model="cameraParam.cameraIds" filterable placeholder="设备列表"  @change="changeCamera">-->
<!--                    <el-option-->
<!--                      v-for="dict in cameraList"-->
<!--                      :key="dict.cameraId"-->
<!--                      :label="dict.location"-->
<!--                      :value="dict.cameraId"-->
<!--                    ></el-option>-->
<!--                  </el-select>-->
<!--                </div>-->
<!--              </el-form-item>-->
<!--&lt;!&ndash;              <el-form-item label="检测频率">&ndash;&gt;-->
<!--&lt;!&ndash;                <el-select v-model="formInline.interval" filterable @change="changeInterval">&ndash;&gt;-->
<!--&lt;!&ndash;                  <el-option&ndash;&gt;-->
<!--&lt;!&ndash;                    v-for="dict in intervalList"&ndash;&gt;-->
<!--&lt;!&ndash;                    :key="dict.key"&ndash;&gt;-->
<!--&lt;!&ndash;                    :label="dict.label"&ndash;&gt;-->
<!--&lt;!&ndash;                    :value="dict.value"&ndash;&gt;-->
<!--&lt;!&ndash;                  ></el-option>&ndash;&gt;-->
<!--&lt;!&ndash;                </el-select>&ndash;&gt;-->
<!--&lt;!&ndash;              </el-form-item>&ndash;&gt;-->
<!--              </div>-->
<!--            </el-form>-->
<!--            <div>-->
<!--              <line-chart :chart-data="booster24templist"></line-chart>-->
<!--              &lt;!&ndash;                    <div id="lineChart" style="height: 100%;width: 100%"></div>&ndash;&gt;-->
<!--            </div>-->
<!--          </div>-->
<!--        </el-col>-->
<!--        <el-col :xs="24" :sm="24" :lg="24">-->
<!--          <div class="switchpie chart-wrapper">-->
<!--            <h3 class="p_title">{{this.switchpie}}<span class="biaoshi">{{this.switchpageTitle}}</span></h3>-->
<!--            <div>-->
<!--              &lt;!&ndash; <relay-piechart></relay-piechart> &ndash;&gt;-->
<!--              <pie-chart :chart-data="switchpiechart"></pie-chart>-->
<!--            </div>-->
<!--          </div>-->
<!--        </el-col>-->
<!--      </el-row>-->
      <el-row class="tables">
        <el-col :xs="24" :sm="24" :lg="24" class="bottom-bootcontent">
          <div class="tablecol chart-wrapper">
            <h3 class="p_title">{{this.tableTitle}}<span class="biaoshi">{{this.switchpageTitle}}</span></h3>
            <el-form :inline="true" :model="queryParams" class="demo-form-inline" v-if="true">
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
            <el-table :data="tableData" ref="baojingtable" height="420px" :border="false" :header-cell-style="tableHeaderColor"
                      @selection-change="handleSelectionChange">
              <el-table-column label="配电室名称" align="center" prop="alarmFrom">
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
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="gettableList"
            />
          </div>
        </el-col>
      </el-row>
    </div>

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
import {  } from "@/api/survey/switchroom"
// import relayPiechart from './relayPiechart'
// import PieChart from "../switchroom/relayPiechart";
// import LineChart from "../boosterstation/boosterLinechart";
import LineChart from "../../dashboard/LineChart";
import PieChart from "../../dashboard/PieChart";
import {listDefect} from "@/api/device/defect";
import { listRealtime,getRepeatTimes, dispose } from "@/api/alarm/realtime";
import { getDealwith, getConfirms } from "@/api/survey/fan/fandetails";
import { listConfig } from "@/api/system/config"; //全局获取告警图片IP地址和摄像头账户密码
import { listArea } from "@/api/device/area";
import { getBoosterStationAlarm,getCameraList,getDeviceTemp,getHighestTemp } from "@/api/survey/boosterstation";
import { listCamera } from "@/api/device/camera";

import Detail from "../../details/Detail.vue";

export default {
  components: {
    PieChart,
    LineChart,
    Detail
  },
  data() {
    return {
      switchareadatalist:[],
      // 标识
      areafanId:"", //唯一标识
      switchpageTitle:"",
      wendutitle:"",
      switchpie:"",
      // 遮罩层
      loading: true,
      tableTitle:"",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: "confirmStatus asc, eventTime desc",
        isAsc: "",
        defectId: undefined,
        areaId: undefined
      },
      cameraParam: {
        cameraIds: [],
        interval:60,
      },
      formInline:{
        maxTemp:undefined,
        realTemp:undefined,
        interval:60,
      },
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
      formDisabled:true,
      isconfirmBy:true,
      // 动态获取告警图片IP地址
      alarmimgipurl:"",
      camerauser:"",
      camerapassword:"",
      nvrip:"",
      // 图片前的IP地址
      imageheader:"",
      srcList:[],
      row: {
        confirmStatus: undefined,
      },
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
      intervalList:[{"key":"three","label":"3分钟","value":3},{"key":"fifteen","label":"15分钟","value":15},{"key":"thirty","label":"30分钟","value":30}],
      imglist:[],
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
      cameradatalist:[], //摄像头列表
    }
  },
  created() {
    this.areafanId = this.$route.path.split('/')[this.$route.path.split('/').length - 1];
    this.wendutitle = "温度实时监测";
    this.tableTitle = "告警情况";
    this.getcameradata();
    // this.getcameralist();
    this.getcameraip();
    this.getalarmtypelist();
    this.gettableList();
    // this.getarealist();
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
  methods: {
    drawLine(tempData){
      // 基于准备好的dom，初始化echarts实例
      // 绘制图表
      // let myChart = eCharts.init(document.getElementById('lineChart'))

      let series=[];
      let realMaxTemp = 0;
      let legendData=[];
      let xAxisDate=[];
      for(let cameraId in tempData){
        let data=[];
        for (let i=0;i<tempData[cameraId].length;i++){
          let d= tempData[cameraId][i];
          let s = {"name":d.location,value:[d.eventTime.toString().slice(11,13),d.eventVal]}
          data.push(s);
          //查询实时最高温度
          if(d.eventVal>realMaxTemp){
            realMaxTemp =d.eventVal;
          }
          // if(xAxisDate.length<tempData[cameraId].length){
          //   xAxisDate.push(d.eventTime.toString().slice(11,13));
          // }
        }
        let ser={
          name: tempData[cameraId][0].location,
          type: 'line',
          data: data};
        series.push(ser);
        legendData.push(tempData[cameraId][0].location);
      }
      for (let i = 0; i < 24; i++) {
        // xAxisDate.push((i > 9 ? '' : '0') + i)
        xAxisDate.push(i+":00")
      }
      if(tempData.length>0){
          this.formInline.realTemp = realMaxTemp + (realMaxTemp > 0 ? ' ℃' : '');
      }
      this.booster24templist.legendData = legendData;
      this.booster24templist.xAxisDate = xAxisDate;
      this.booster24templist.expectedData = series;
    },
    // 获取摄像头数据
    getcameradata(){
      listCamera().then(response => {
        // console.log(response,'获取摄像头列表');
        this.cameradatalist = response.rows;
      })
    },
    //设置表头行的样式
    tableHeaderColor({row,column,rowIndex,columnIndex}){
      return 'font-wight:500;font-size:20px;text-align:center;border-bottom:none;'
    },
    // 告警级别字典翻译
    alarmlevelFormat(row, column) {
      return row !== null ? this.selectDictLabel(this.alarmlevellist, row.alarmLevel) : null;
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
        if(query == 905){ //继电保护室
          this.imglist = [
           {
              imgSrc:require('../../../assets/image/继电保护室.jpg'),
              id:'222',
              ilist:[
                {id:"1",tubiao:require("../../../assets/image/轨道机器人.png"),ikey:"robotyuntai",ip:"22.18.3.131",stylename:{left:"10%",top:"6%"}},
              ]
            },
          ]
          this.imglist[0].ilist.map((v)=>{
            this.cameradatalist.map((y)=>{
              if(y.ip == v.ip){
                console.log(v,y);
                v.cameraName = y.cameraName;
                v.cameraId = y.cameraId; //摄像头id
              }
            })
          })
        }
      })
    },
    // 设备下拉列表
    getcameralist() {
      getCameraList(this.areafanId).then(response => {
        console.log(response,"设备下拉列表")
        this.cameraList = response.data;

        //设置初始选项
        let selectedCameras=[];
        for (let i = 0; i < this.cameraList.length; i++) {
          if(i>=5){
            break;
          }
          selectedCameras.push(this.cameraList[i].cameraId);
        }
        this.changeCamera(selectedCameras);
      });
    },
    changeInterval(val){
      console.log(val,'------是否打开标注dialog');
      this.cameraParam.interval =val;
      if(this.cameraParam.cameraIds.length ===0){
        return;
      }
      this.getCameraTempList(this.cameraParam);
    },
    changeCamera(val){
      if(val.length ===0){
        return;
      }
      this.cameraParam.cameraIds=val;
      this.getCameraTempList(this.cameraParam);
      getHighestTemp(this.cameraParam).then(response => {
        console.log(response.data,'获取最高测温');
        this.formInline.maxTemp = response.data.highestTemp + (response.data.highestTemp > 0 ? ' ℃' : '');
      });
    },
    getCameraTempList(param){  //获取表格
      this.loading = true;
      getDeviceTemp(param).then(response => {
        console.log(response.data,'获取实时测温');
        this.drawLine(response.data);
        this.loading = false;
      });
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
        })
      });
    },

    getswichdefect(){
      console.log(this.areafanId);
      getBoosterStationAlarm(this.areafanId).then(response => {
        console.log(response,'缺陷数量');
        var res = response.data;
        var date = []
        var data = []
        var obj = {};
        for (var i = 0; i < res.length; i++) {
          const e = res[i];
          date[i] = e.defectName
          obj = {
            name:e.defectName,
            value:e.alarmAmount
          }
          data.push(obj);
        }
        this.switchpiechart.xAxisDate = date;
        this.switchpiechart.expectedData = data;
      })
    },

     // 告警类型下拉列表
    getalarmtypelist() {
      listDefect().then(response => {
        console.log(response,"缺陷下拉列表")
        this.quexianoptions = response.rows;
      });
    },
    // 点击视频弹框
    showModal(item) {
      console.log(111,item);
      this.$router.push({
        path:'/videomonitoring/robot',
        query:{querycameraip:item.ip,querycameraid:item.cameraId}
      })
    },

    // 告警类型
    changeType(val){
      console.log(val);
      this.queryParams.pageNum = 1;
      this.gettableList()
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
    // 选择框
    handleSelectionChange(val) {
      console.log(val);
      this.ids = val.map(item => item.alarmDetailId);
      this.multipleSelection = val;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
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
      this.row = row;
      this.alarmDetailId = row.alarmDetailId;
      this.open = true
      this.title = '详情';
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
  .el-dialog .el-carousel{
    position: relative;
    // right: 13%;
    width: 80%;
  }
  .el-dialog .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }

  .el-dialog .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }

  /deep/ .pagination-container .el-pagination{
    right:10px;
  }
  /deep/ .el-pagination.is-background .btn-prev,
  /deep/ .el-pagination.is-background .btn-next,
  /deep/ .el-pagination.is-background .el-pager li{
    margin: 0 2px !important;
  }
  /deep/ .el-pagination__total{
    margin-right: 2px !important;
  }
  /deep/ .el-pagination__jump {
    margin-left: 5px !important;
  }

  /deep/ .el-table .el-table__header-wrapper th{
    font-size: 15px !important;
  }

  /deep/ .el-table td{
    border-bottom:none !important;
  }
  /deep/ .el-table__body-wrapper{
    border-bottom: none !important;
  }
  /deep/ .el-table{
    width: 96%;
    margin-left: 20px;
    border-radius: 10px;
  }
  .biaoshi{
    font-weight: 500;
  }

  .pagination-container {
    background: #fff;
    padding: 32px 16px;
    height: 55px;
  }
  .chart-wrapper{
    border-radius: 10px;
  }

  .app-container{
    background-color: rgb(240, 242, 245);
    padding: 12px;

    .boosterline{
      background: #ffffff;
      /*height: 450px;*/
      border-radius: 10px;
      .left-col{
        margin-left: 20px;
        .dev-select{
          margin-left: 20px;
        }
      }
      .p_title{
        width: 100%;
        height: 45px;
        line-height: 45px;
        padding-left: 7px;
        display: block;
        padding-top: 2px;
        span{
          padding: 0px 10px;
          // color: #1deff3;
          font-size: 14px;
          float: right;
          margin-right: 20px;
        }
      }
    }

    .switchroom{
      // background-color: rgba(53,68,104,0.8);
      min-height: calc(100vh - 80px);
      padding: 15px;

      .imgrow{
        width: 100%;
        height: 480px;
        margin-bottom: 10px;
        text-align: center;
        background: #ffffff;
        // background-color: #26417f;
        // border: 1px solid #26417f;
        .imgdiv{
          // padding: 10px 15px;
          .lunbodiv{
            /deep/ .el-carousel__container{
              height: 480px !important;
              position: relative;
              top: 0px;
              left: 0px;
            }
            .card_pre{
              width: 100%;

              .bgimg{
                width: 100%;
                height: 480px;
                position: relative;
                top: 0px;
                left: 0px;
                margin-bottom: 10px;
                border-radius: 10px;
              }

              .bd_ccc{
                // position: absolute;
                // top: 0px;
                // display: flex;
                .mg_20{
                  width: 30px;
                  height: 30px;
                  margin-right: 300px;
                  img{
                    width: 30px;
                    height: 30px;
                    // font-size: 30px;
                    // color: firebrick;
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

      .tablemain{
        /*height: 500px;*/
        margin-bottom: 10px;

        .tablecol{
          width: 100%;
          height: 460px;
          background: #ffffff;
          // color: #ffffff;

          .p_title{
            width: 100%;
            height: 50px;
            line-height: 50px;
            display: block;
            padding-top: 1px;
            padding-left: 7px;
            span{
              padding: 0px 20px;
              // color: #1deff3;
              font-size: 14px;
              float: right;
              margin-right: 20px;
            }
          }

          .demo-form-inline{
            margin-left: 20px;
            .el-form-item{
              margin-bottom: 10px;
            }
            span{
              // color: #ffffff;
              font-size: 16px;
            }
          }

          .el-table{
            width: 96%;
            margin-left: 20px;
            border-radius: 10px;
          }

          /deep/ .pagination-container{
            height: 55px;
            margin-top: 0px;
            margin-bottom: 0px;
            padding: 0px;
          }
        }

        .switchpie{
          height: 470px;
          background: #ffffff;
          .p_title{
            width: 100%;
            height: 50px;
            line-height: 50px;
            display: block;
            padding-top: 1px;
            padding-left: 7px;
            span{
              padding: 0px 20px;
              // color: #1deff3;
              font-size: 14px;
              float: right;
              margin-right: 20px;
            }
          }
        }
      }

      .tables{
        height: 565px;
      }
      .bottom-bootcontent {
        // background-color: rgba(53,68,104,0.8);
        min-height: calc(100vh - 630px);

        .tablecol {
          width: 100%;
          background: #ffffff;
          /*height: 420px;*/
          border-radius: 10px;

          .p_title {
            width: 100%;
            height: 45px;
            line-height: 45px;
            padding-left: 7px;
            display: block;
            padding-top: 1px;

            span {
              padding: 0px 10px;
              font-size: 14px;
              float: right;
              margin-right: 20px;
            }
          }

          .demo-form-inline {
            margin-left: 20px;

            span {
              // color: #ffffff;
              font-size: 16px;
            }
          }

          /deep/ .demo-form-inline {
            margin-bottom: -10px;
          }

          .el-table {
            width: 96%;
            margin-left: 2%;
            margin-right: 2%;
          }
        }

        /deep/ .pagination-container {
          height: 55px;
          margin-top: 0px;
          margin-bottom: 0px;
          padding: 0px;
        }
      }
    }
  }
</style>
