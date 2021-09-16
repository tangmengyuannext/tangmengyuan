<template>
  <div class="screen-container">
    <div class="screen-big-title">
      <img :src="titlebgimg">
    </div>
    <button class="screen-choose-btn set-btn" @click="goToSet">
      <!-- <router-link :to="'/largescreensettings'"> -->
      大屏设置
      <!-- </router-link> -->
    </button>
    <el-row>
      <el-col :md="24" :lg="16" style="padding: 0 5px">
        <el-row>
          <!-- 巡检情况 -->
          <el-col :sm="8">
            <div class="border-corner screen-xunjian" style="margin: 10px 5px 10px 10px;">
              <div class="screen-title">巡检情况</div>
              <div class="screen-content-box">
                <el-row>
                  <el-tooltip class="item" effect="dark" content="本周巡检进度" placement="bottom">
                    <el-col :xs="8" :sm="8" class="label-title">本周巡检进度</el-col>
                  </el-tooltip>
                  <el-col :xs="10" :sm="10" class="label-content">
                    <el-progress
                      :percentage="patrolProgress.rate"
                      :show-text="false"
                      :stroke-width="10"
                      :color="['#d239ff', '#f55664']"
                    ></el-progress>
                  </el-col>
                  <el-col :xs="6" :sm="6" class="label-content" style="text-align: center;">
                    {{patrolProgress.complete}}/{{patrolProgress.total}}
                  </el-col>
                </el-row>
                <el-row>
                  <el-tooltip class="item" effect="dark" content="当日巡检情况" placement="bottom">
                    <el-col :xs="8" :sm="8" class="label-title">当日巡检情况</el-col>
                  </el-tooltip>
                  <el-col :xs="16" :sm="16" class="label-content screen-conten-roll-xunjian">
                    <el-row v-for="(item, index) in cunrrentPatrol" :key="index">
                      <el-tooltip class="item" effect="dark" :content="item.patrolName" placement="bottom">
                        <el-col :span="8" class="label-content-left">{{item.patrolName}}</el-col>
                      </el-tooltip>
                      <el-col v-if="item.patrolStatues!==1" :span="4" class="label-content-middle">
                        <img v-if="item.patrolStatues===3" src="../../../assets/image/largescreen-xjcheck.png" />
                        <img v-if="item.patrolStatues===2" src="../../../assets/image/largescreen-xjclerk.png" />
                      </el-col>
                      <el-col v-if="item.patrolStatues!==1" :span="12" class="label-content-right">
                        <img v-if="item.patrolErrors > 0" src="../../../assets/image/largescreen-gaojingicon.png" />
                        {{item.patrolErrors}}
                        <!-- <div class="showMissionText" v-if="item.patrolErrors > 0">查看</div> -->
                      </el-col>
                      <el-col v-if="item.patrolStatues===1" :span="16" class="label-content-left">
                        <div v-if="item.patrolStatues===1">{{item.startDate}}开始</div>
                      </el-col>
                    </el-row>
                    <!-- <el-row>
                      <el-tooltip class="item" effect="dark" content="配电室巡检" placement="bottom">
                        <el-col :span="8" class="label-content-left">配电室巡检</el-col>
                      </el-tooltip>
                      <el-col :span="4" class="label-content-left">
                        <img src="../../../assets/image/largescreen-xjcheck.png" />
                      </el-col>
                      <el-col :span="12" class="label-content-right">
                        0
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-tooltip class="item" effect="dark" content="日常巡检" placement="bottom">
                        <el-col :span="8" class="label-content-left">日常巡检</el-col>
                      </el-tooltip>
                      <el-col :span="4" class="label-content-left">
                        <img src="../../../assets/image/largescreen-xjclerk.png" />
                      </el-col>
                      <el-col :span="12" class="label-content-right">
                        0
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-tooltip class="item" effect="dark" content="晚间巡检" placement="bottom">
                        <el-col :span="8" class="label-content-left">晚间巡检</el-col>
                      </el-tooltip>
                      <el-col :span="16" class="label-content-left">
                        17:00开始
                      </el-col>
                    </el-row> -->
                  </el-col>
                </el-row>
              </div>
              <div class="chart-box">
                <bar-chart style="height: 150px" :chartData="patrolErrorData"></bar-chart>
              </div>
            </div>
          </el-col>
          <!-- 风厂全景图 -->
          <el-col :sm="16" style="padding: 0 0 0 5px">
            <overview :data="overviewData"/>
            <!-- <div class="border-corner screen-quanjing" style="margin: 10px 5px;">
              <div class="screen-title">风电厂全景图</div>
              <div class="imgcol">
                <div class="imgdiv">
                  <el-carousel class="lunbodiv" indicator-position="none" :loop="false" :autoplay="false">
                    <el-carousel-item v-for="item in imglist" :key="item.id">
                      <div class="card_pre">
                        <img :src="item.imgSrc" class="w100p bd_blue bgimg" />
                        <div class="pos_ab top_0 left_0 h100p w100p bd_ccc">
                          <span
                            class="mg_20"
                            v-for="imgspan in item.ilist"
                            :key="imgspan.ip"
                          >
                            <el-tooltip class="item" effect="dark" :content="imgspan.deviceName" placement="bottom">
                              <img
                                :src="imgspan.tubiao"
                                :style="imgspan.stylename"
                              />
                            </el-tooltip>
                          </span>
                        </div>
                      </div>
                    </el-carousel-item>
                  </el-carousel>
                </div>
              </div>
            </div> -->
          </el-col>
        </el-row>
        <el-row>
          <!-- 实时告警 -->
          <el-col :sm="6" style="padding: 0 5px">
            <div class="border-corner screen-ssgaojing" style="margin-left: 5px;">
              <el-row class="screen-title">
                <el-col :span="24" class="screen-title-left">实时告警</el-col>
                <!-- <el-col :span="12" class="screen-title-right">{{todayDate}}</el-col> -->
              </el-row>
              <div class="screen-content-box">
                <div class="screen-conten-roll">
                  <div class="row-up">
                    <el-row v-for="(item, index) in realTimeAlarmList" :key="index">
                      <el-col :span="16" class="gaojing-detail">
                        <div
                          :class="[
                            item.level === '1' ? 'mechine1' : '',
                            item.level === '2' ? 'mechine2' : '',
                            item.level === '3' ? 'mechine3' : '',
                            item.level === '4' ? 'mechine4' : '',
                          ]"
                        ></div>
                        <span>{{ item.name }}{{item.equipmentName ? item.equipmentName : ''}}</span>产生{{item.defectName}}
                        <span v-if="item.level === '1'">紧急告警</span>
                        <span v-if="item.level === '2'">重要告警</span>
                        <span v-if="item.level === '3'">次要告警</span>
                        <span v-if="item.level === '4'">提示告警</span>
                      </el-col>
                      <el-col :span="8" class="gaojing-detail" style="text-align: right">{{ item.time }}</el-col>
                    </el-row>
                  </div>
                </div>
              </div>
              <el-row class="screen-title">
                <el-tooltip class="item" effect="dark" content="告警趋势与分布" placement="bottom">
                  <el-col :span="12" class="screen-title-left">告警趋势与分布</el-col>
                </el-tooltip>
                <el-col :span="12" class="screen-title-right">近30日</el-col>
              </el-row>
              <div class="chart-box">
                <line-chart :chartData="gaojingTrend" :title="''" :color="['#1eeecc']" style="height: 100px"></line-chart>
              </div>
              <div class="chart-box">
                <pie-chart :height="'100px'" :chartData="topFiveAlarm" style="height: 100px"></pie-chart>
              </div>
            </div>
          </el-col>
          <!-- 实时监测 -->
          <el-col :sm="6" style="padding: 0 5px">
            <div class="border-corner screen-ssgaojing" style="margin-left: 5px;">
              <el-row class="screen-title">
                <el-col :span="24" class="screen-title-left">实时监测</el-col>
                <!-- <el-col :span="12" class="screen-title-right">{{todayDate}}</el-col> -->
              </el-row>
              <div class="screen-content-box">
                <div class="screen-conten-roll">
                  <div class="row-up">
                    <el-row v-for="(item, index) in defectList" :key="index">
                      <el-col :span="16" class="gaojing-detail">
                        <div class="jiance-event"></div>
                        {{ item.name }}{{item.equipmentName ? item.equipmentName : ''}}产生{{ item.defectName }}告警
                      </el-col>
                      <el-col
                        :span="8"
                        class="gaojing-detail"
                        style="text-align: right"
                        >{{ item.time }}</el-col
                      >
                    </el-row>
                  </div>
                </div>
              </div>
              <el-row class="screen-title">
                <el-tooltip class="item" effect="dark" content="监测趋势与分布" placement="bottom">
                  <el-col :span="12" class="screen-title-left">监测趋势与分布</el-col>
                </el-tooltip>
                <el-col :span="12" class="screen-title-right">近30日</el-col>
              </el-row>
              <div class="chart-box">
                <line-chart :height="'100px'" :chartData="defectTrend" :title="''" :color="['#059cf8']" style="height: 100px"></line-chart>
              </div>
              <div class="chart-box">
                <pie-chart :chartData="topFiveDefect" style="height: 100px"></pie-chart>
              </div>
            </div>
          </el-col>
          <!-- 实时监控 -->
          <el-col :sm="12" style="padding: 0 0 0 5px">
            <div class="border-corner screen-ssjiankong" style="margin-right: 5px;margin-left: 5px;">
              <div class="screen-title">实时监控</div>
              <div class="screen-content-box">
                <el-row>
                  <iframe ref="iframe" id="videoiframes"
                    src="../../../../preview/cn/demo-iframe.html"
                    frameborder="0"
                    scrolling="no"
                    :style="ssjiankongStyle"
                  ></iframe>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <!-- 温度监控 -->
      <el-col :md="24" :lg="8" style="padding: 0 5px">
        <div class="border-corner screen-temkongzhi" style="margin: 10px 10px 10px 0;">
          <div class="screen-title">温度监控</div>
          <el-row class="screen-temperature-monitor" style="margin-top: 10px">
            <el-col :span="12">{{fengjiTemperatureText}}</el-col>
            <el-col :span="12" style="text-align: right">
              <el-button class="screen-choose-btn" @click="openDialog(1)"
                >选择设备</el-button
              >
            </el-col>
          </el-row>
          <div class="screen-line-chart">
            <div class="chart-box">
              <dynamic-line-chart :height="dynamicLineChartHeight" :chartData="fjLineChart"></dynamic-line-chart>
            </div>
          </div>
          <el-row class="screen-temperature-monitor">
            <el-col :span="12">升压站温度</el-col>
            <el-col :span="12" style="text-align: right">
              <el-button class="screen-choose-btn" @click="openDialog(2)">选择设备</el-button>
            </el-col>
          </el-row>
          <div class="screen-line-chart">
            <div class="chart-box">
              <dynamic-line-chart :height="dynamicLineChartHeight" :chartData="syzLineChart"></dynamic-line-chart>
            </div>
          </div>
          <el-row class="screen-temperature-monitor">
            <el-col :span="12">配电室温度</el-col>
            <el-col :span="12" style="text-align: right">
              <el-button class="screen-choose-btn" @click="openDialog(3)">选择设备</el-button>
            </el-col>
          </el-row>
          <div class="screen-line-chart">
            <div class="chart-box">
              <dynamic-line-chart :height="dynamicLineChartHeight" :chartData="pdsLineChart"></dynamic-line-chart>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="选择设备" :visible.sync="dialogFormVisible" @close="closeDialog" :width="'550px'">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="选择设备" :label-width="formLabelWidth" prop="region">
          <el-select v-model="form.region" multiple :multiple-limit="5" placeholder="请选择" :popper-append-to-body="false" @change="changeCamera">
            <el-option v-for="item in cameraList" :key="item.cameraId" :label="item.areaName + item.cameraName"
              :value="item.cameraId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="drawLineCharts(regionType)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import BarChart from "../screencharts/BarChart";
import PieChart from "../screencharts/PieChart";
import LineChart from "../screencharts/LineChart";
import DynamicLineChart from "../screencharts/DynamicLineChart";
import { listCamera } from "@/api/device/camera";
import { getConfigKey } from "@/api/system/config"; //全局获取告警图片IP地址和摄像头账户密码
import { getToken } from "@/utils/auth";
import {
  getLatestAlarmData,
  getRealTimeAlarmTrend,
  getTopFiveAlarmType,
  getLatestDefectData,
  getDefectTrend,
  getTopFiveDefectType,
  getTempLineByEquipment,
  getTempCameraList,
  getCurrentDayPatrol,
  getPatrolError,
  getPatrolProgress,
  getCameraDefaultSetting,
  getLocationByArea
} from "@/api/largescreen/largescreen";
import { getAreaImage } from "@/api/device/areaImage";
import { listConfig } from "@/api/system/config"; //动态获取大屏的areaId
import Overview from "@/views/dashboard/Overview.vue";
export default {
  components: {
    BarChart,
    PieChart,
    LineChart,
    DynamicLineChart,
    Overview
  },
  data() {
    return {
      imglist: [],
      dituAreaId: "", // 底图标记areaid
      areaId: "", // 厂区id
      todayDate: "", // 当前日期
      realTimeAlarmList: [], // 最新实时告警信息
      gaojingTrend: { // 告警趋势图
        expectedData: [],
        xAxisDate: [],
        legendData:[]
      }, // 实时告警趋势
      topFiveAlarm: [], // 实时告警类型前五
      defectList: [], // 最新缺陷信息
      defectTrend: { // 实时监测趋势图
        expectedData: [],
        xAxisDate: [],
        legendData:[]
      }, // 缺陷趋势
      topFiveDefect: [], // 缺陷类型前五
      region1: [], // 风机温度折线图显示的设备列表
      region2: [], // 升压站温度折线图显示的设备列表
      region3: [], // 配电室温度折线图显示的设备列表
      regionType: Number, // 判断当前哪个折线图选择设备
      temporaryRegion: [], // 打开弹窗时，临时存放当前数据，以待取消或关闭弹窗时使用
      dynamicLineChartHeight: '150px', // 设置折线图高度
      cunrrentPatrol: [], // 每日巡检计划
      patrolErrorData: { // 本周巡检问题情况
        expectedData: [],
        xAxisDate: [],
        legendData: [],
      },
      patrolProgress: {
        complete: 0,
        total: 0,
        rate: 0,
      },
      ssjiankongStyle: { // 实时监控画面大小样式
        height: '300px',
        width: '500px',
        // 'z-index': -1
      },

      dialogFormVisible: false,
      form: {
        region: [],
      },
      rules: {
        region: [
          { required: true, message: '请至少选择一项', trigger: 'change' }
        ]
      },
      formLabelWidth: "120px",
      cameraList: [],
      fjCameraList: [],
      syzCameraList: [],
      pdsCameraList: [],
      fjLineChart: {},
      syzLineChart: {},
      pdsLineChart: {},
      currentVideoSetting: [], // 当前视频设置
      cameraAllList: [], // 所有摄像头
      overviewData: {
        areaId: undefined,
        // title: '风电厂全景图',
        height:0,
        activeClass:'',
        titleClass:'',
        isClick:true,
      },
      titlebgimg:"",

      // 有些局点没有风机温度，所以配置一下风机温度的文案
      fengjiTemperatureText: '',
    };
  },
  created() {
    window.sessionStorage.setItem("brearer", getToken());
    window.sessionStorage.setItem("httpTempUrl", process.env.VUE_APP_BASE_API);
    const screenWidth = document.body.clientWidth;
    if ( screenWidth >= 1600 && screenWidth <= 1920 ) {
      this.dynamicLineChartHeight = '200px';
      this.ssjiankongStyle = { // 实时监控画面大小样式
        height: '300px',
        width: '500px',
        'z-index': -1
      };
    } else if ( screenWidth >= 1200 && screenWidth <= 1599 ) {
      this.dynamicLineChartHeight = '150px';
      this.ssjiankongStyle = { // 实时监控画面大小样式
        height: '260px',
        width: '330px',
        'z-index': -1
      };
    }
    this.areaId = "1";
    const now = new Date();
    this.todayDate = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
    
    this.imglist = [
    //   {
    //     imgSrc: require("../../../assets/image/shengyazhan_bg.jpg"),
    //     id: "1",
    //     ilist: [
    //           // 最上面 摄像头 双目
    //           {
    //             id: "1",
    //             tubiao: require("../../../assets/image/固定式-枪机.png"),
    //             ikey: "stationary",
    //             deviceName: '8#智能感知终端',
    //             ip: "22.18.3.82",
    //             stylename: { left: "3%", top: "5%" },
    //           },
    //           {
    //             id: "2",
    //             tubiao: require("../../../assets/image/固定式-枪机-下.png"),
    //             ikey: "stationary",
    //             deviceName: '7#智能感知终端',
    //             ip: "22.18.3.81",
    //             stylename: { left: "2%", top: "9%" },
    //           },
    //           {
    //             id: "3",
    //             tubiao: require("../../../assets/image/固定式-枪机-下.png"),
    //             ikey: "stationary",
    //             deviceName: '10#智能感知终端',
    //             ip: "22.18.3.84",
    //             stylename: { left: "96%", top: "9%" },
    //           },
    //           {
    //             id: "4",
    //             tubiao: require("../../../assets/image/固定式-枪机-左.png"),
    //             ikey: "stationary",
    //             deviceName: '9#智能感知终端',
    //             ip: "22.18.3.83",
    //             stylename: { left: "95%", top: "5%" },
    //           },
    //           {
    //             id: "5",
    //             tubiao: require("../../../assets/image/固定式-枪机-上.png"),
    //             ikey: "stationary",
    //             deviceName: '11#智能感知终端',
    //             ip: "22.18.3.85",
    //             stylename: { left: "96.5%", top: "87%" },
    //           },
    //           {
    //             id: "6",
    //             tubiao: require("../../../assets/image/固定式-枪机-左.png"),
    //             ikey: "stationary",
    //             deviceName: '12#智能感知终端',
    //             ip: "22.18.3.86",
    //             stylename: { left: "95%", top: "91%" },
    //           },
    //           {
    //             id: "7",
    //             tubiao: require("../../../assets/image/固定式-枪机-下.png"),
    //             ikey: "stationary",
    //             deviceName: '1#智能感知终端',
    //             ip: "22.18.3.75",
    //             stylename: { left: "62%", top: "90%" },
    //           },
    //           {
    //             id: "8",
    //             tubiao: require("../../../assets/image/固定式-枪机.png"),
    //             ikey: "stationary",
    //             deviceName: '2#智能感知终端',
    //             ip: "22.18.3.76",
    //             stylename: { left: "19%", top: "91%" },
    //           },
    //           {
    //             id: "9",
    //             tubiao: require("../../../assets/image/固定式-枪机-上.png"),
    //             ikey: "stationary",
    //             deviceName: '3#智能感知终端',
    //             ip: "22.18.3.77",
    //             stylename: { left: "16.8%", top: "88%" },
    //           },
    //           {
    //             id: "10",
    //             tubiao: require("../../../assets/image/固定式-枪机-下.png"),
    //             ikey: "stationary",
    //             deviceName: '4#智能感知终端',
    //             ip: "22.18.3.78",
    //             stylename: { left: "17%", top: "51%" },
    //           },
    //           {
    //             id: "11",
    //             tubiao: require("../../../assets/image/固定式-枪机.png"),
    //             ikey: "stationary",
    //             deviceName: '5#智能感知终端',
    //             ip: "22.18.3.79",
    //             stylename: { left: "3.5%", top: "46%" },
    //           },
    //           {
    //             id: "12",
    //             tubiao: require("../../../assets/image/固定式-枪机-上.png"),
    //             ikey: "stationary",
    //             deviceName: '6#智能感知终端',
    //             ip: "22.18.3.80",
    //             stylename: { left: "2%", top: "43%" },
    //           },
    //           {
    //             id: "13",
    //             tubiao: require("../../../assets/image/双目-半球.png"),
    //             ikey: "shuangmu",
    //             deviceName: '4#智能感知双目终端',
    //             ip: "22.18.3.108",
    //             stylename: { left: "20.5%", top: "15%" },
    //           },
    //           {
    //             id: "14",
    //             tubiao: require("../../../assets/image/双目-半球.png"),
    //             ikey: "shuangmu",
    //             deviceName: '5#智能感知双目终端',
    //             ip: "22.18.3.109",
    //             stylename: { left: "27%", top: "6%" },
    //           },
    //           {
    //             id: "15",
    //             tubiao: require("../../../assets/image/双目-半球.png"),
    //             ikey: "shuangmu",
    //             deviceName: '6#智能感知双目终端',
    //             ip: "22.18.3.110",
    //             stylename: { left: "28.8%", top: "6%" },
    //           },
    //           {
    //             id: "16",
    //             tubiao: require("../../../assets/image/双目-半球.png"),
    //             ikey: "shuangmu",
    //             deviceName: '7#智能感知双目终端',
    //             ip: "22.18.3.111",
    //             stylename: { left: "38.3%", top: "11%" },
    //           },
    //           {
    //             id: "17",
    //             tubiao: require("../../../assets/image/双目-半球.png"),
    //             ikey: "shuangmu",
    //             deviceName: '8#智能感知双目终端',
    //             ip: "22.18.3.112",
    //             stylename: { left: "40.1%", top: "11%" },
    //           },
    //           {
    //             id: "18",
    //             tubiao: require("../../../assets/image/双目-半球.png"),
    //             ikey: "shuangmu",
    //             deviceName: '9#智能感知双目终端',
    //             ip: "22.18.3.113",
    //             stylename: { left: "51.5%", top: "7%" },
    //           },
    //           {
    //             id: "19",
    //             tubiao: require("../../../assets/image/双目-半球.png"),
    //             ikey: "shuangmu",
    //             deviceName: '10#智能感知双目终端',
    //             ip: "22.18.3.114",
    //             stylename: { left: "70%", top: "12%" },
    //           },
    //           {
    //             id: "20",
    //             tubiao: require("../../../assets/image/双目-半球.png"),
    //             ikey: "shuangmu",
    //             deviceName: '11#智能感知双目终端',
    //             ip: "22.18.3.116",
    //             stylename: { left: "81.5%", top: "6%" },
    //           },
    //           {
    //             id: "21",
    //             tubiao: require("../../../assets/image/双目-半球.png"),
    //             ikey: "shuangmu",
    //             deviceName: '3#智能感知双目终端',
    //             ip: "22.18.3.107",
    //             stylename: { left: "15%", top: "29%" },
    //           },
    //           {
    //             id: "22",
    //             tubiao: require("../../../assets/image/固定式-枪机-下.png"),
    //             ikey: "stationary",
    //             deviceName: '33#智能感知终端',
    //             ip: "22.18.3.92",
    //             stylename: { left: "18%", top: "24.5%" },
    //           },
    //           {
    //             id: "23",
    //             tubiao: require("../../../assets/image/固定式-枪机-上.png"),
    //             ikey: "stationary",
    //             deviceName: '32#智能感知终端',
    //             ip: "22.18.3.91",
    //             stylename: { left: "16%", top: "42%" },
    //           },
    //           {
    //             id: "24",
    //             tubiao: require("../../../assets/image/固定式-枪机.png"),
    //             ikey: "stationary",
    //             deviceName: '31#智能感知终端',
    //             ip: "22.18.3.90",
    //             stylename: { left: "29.5%", top: "33%" },
    //           },
    //           {
    //             id: "25",
    //             tubiao: require("../../../assets/image/固定式-枪机.png"),
    //             ikey: "stationary",
    //             deviceName: '30#智能感知终端',
    //             ip: "22.18.3.89",
    //             stylename: { left: "29.5%", top: "36.5%" },
    //           },
    //           {
    //             id: "26",
    //             tubiao: require("../../../assets/image/固定式-枪机.png"),
    //             ikey: "stationary",
    //             deviceName: '29#智能感知终端',
    //             ip: "22.18.3.88",
    //             stylename: { left: "29.5%", top: "40%" },
    //           },
    //           {
    //             id: "27",
    //             tubiao: require("../../../assets/image/旋转式-球机.png"),
    //             ikey: "yuntai",
    //             deviceName: '28#智能感知终端',
    //             ip: "22.18.3.103",
    //             stylename: { left: "30%", top: "51.5%" },
    //           },
    //           {
    //             id: "28",
    //             tubiao: require("../../../assets/image/远距离双目.png"),
    //             ikey: "shuangmu",
    //             deviceName: '2#远距离智能感知终端',
    //             ip: "22.18.3.41",
    //             stylename: { left: "31.5%", top: "39%" },
    //           },
    //           {
    //             id: "29",
    //             tubiao: require("../../../assets/image/远距离双目.png"),
    //             ikey: "shuangmu",
    //             deviceName: '1#远距离智能感知终端',
    //             ip: "22.18.3.40",
    //             stylename: { left: "42%", top: "37.5%" },
    //           },
    //           {
    //             id: "30",
    //             tubiao: require("../../../assets/image/固定式-枪机-左.png"),
    //             ikey: "stationary",
    //             deviceName: '22#智能感知终端',
    //             ip: "22.18.3.93",
    //             stylename: { left: "43.5%", top: "29%" },
    //           },
    //           {
    //             id: "31",
    //             tubiao: require("../../../assets/image/固定式-枪机-左.png"),
    //             ikey: "stationary",
    //             deviceName: '23#智能感知终端',
    //             ip: "22.18.3.94",
    //             stylename: { left: "43.5%", top: "32%" },
    //           },
    //           {
    //             id: "32",
    //             tubiao: require("../../../assets/image/固定式-枪机-左.png"),
    //             ikey: "stationary",
    //             deviceName: '24#智能感知终端',
    //             ip: "22.18.3.95",
    //             stylename: { left: "43.5%", top: "35%" },
    //           },
    //           {
    //             id: "33",
    //             tubiao: require("../../../assets/image/固定式-枪机-左.png"),
    //             ikey: "stationary",
    //             deviceName: '25#智能感知终端',
    //             ip: "22.18.3.96",
    //             stylename: { left: "43.5%", top: "42%" },
    //           },
    //           {
    //             id: "34",
    //             tubiao: require("../../../assets/image/固定式-枪机-左.png"),
    //             ikey: "stationary",
    //             deviceName: '26#智能感知终端',
    //             ip: "22.18.3.97",
    //             stylename: { left: "43.5%", top: "45%" },
    //           },
    //           {
    //             id: "35",
    //             tubiao: require("../../../assets/image/固定式-枪机-左.png"),
    //             ikey: "stationary",
    //             deviceName: '27#智能感知终端',
    //             ip: "22.18.3.98",
    //             stylename: { left: "43.5%", top: "48%" },
    //           },
    //           {
    //             id: "36",
    //             tubiao: require("../../../assets/image/旋转式-球机.png"),
    //             ikey: "yuntai",
    //             deviceName: '19#智能感知终端',
    //             ip: "22.18.3.104",
    //             stylename: { left: "63.5%", top: "37%" },
    //           },
    //           {
    //             id: "37",
    //             tubiao: require("../../../assets/image/固定式-枪机-上.png"),
    //             ikey: "stationary",
    //             deviceName: '17#智能感知终端',
    //             ip: "22.18.3.99",
    //             stylename: { left: "68.5%", top: "52%" },
    //           },
    //           {
    //             id: "38",
    //             tubiao: require("../../../assets/image/固定式-枪机-下.png"),
    //             ikey: "stationary",
    //             deviceName: '18#智能感知终端',
    //             ip: "22.18.3.100",
    //             stylename: { left: "68.5%", top: "36.5%" },
    //           },
            // ],
    //   },
    ];
    // this.getcameraList();
    this.getTemCameraList(); // 获取温度摄像头信息
    this.getLatestAlarm(this.areaId); // 获取最新10条实时告警信息
    this.getRealTimeTrend(this.areaId); // 获取实时告警趋势折线图(30日)
    this.getTopFiveAlarmType(this.areaId); // 获取告警类型前五扇形图
    this.getLatestDefect(this.areaId); // 获取最新10条缺陷信息
    this.getDefectTrend(this.areaId); // 获取缺陷趋势折线图(30日)
    this.getTopFiveDefectType(this.areaId); // 获取缺陷类型前五扇形图
    this.getCurrentPatrolPlan(); // 获取当天巡检计划
    this.getWeekPatrolErrors(); // 获取本周巡检问题数量统计
    this.getPatrolWeekProgress(); // 获取本周巡检计划和完成情况
    // this.getCameraArea(); // 获取底图标记厂区id
    this.gettitlebgimg();
  },
  destroyed: function () {
    // document.getElementById("videoiframes").contentWindow.location.reload(true);
    // window.clearInterval(window.sessionStorage.getItem("timer"));
    // window.sessionStorage.setItem("timer",null);
    window.sessionStorage.setItem("windowOne",null);
    window.sessionStorage.setItem("windowThree",null);
    window.sessionStorage.setItem("windowTwo",null);
    window.sessionStorage.setItem("windowFour",null);
  },
  methods: {
    // 获取大屏背景图名称及风机温度的文案
    gettitlebgimg(){
      const screenWidth = document.body.clientWidth;
      let boxHeight = 0;
      if (screenWidth >= 1600) {
        boxHeight = 320
      } else {
        boxHeight = 240
      }
      listConfig().then(response => {
        response.rows.map((v)=>{
          if(v.configKey == "sys.index.areaId"){
            this.overviewData= {
              areaId: v.configValue,
              height: boxHeight,
              activeClass:'screen-quanjing',
              titleClass:'screen-title',
              isClick:true,
            }
          }
          if(v.configKey == "sys.index.titlebgimg"){
            // this.titlebgimg = 'url("'+ require('../../../assets/image/' + v.configValue) + '")'
            this.titlebgimg = require('../../../assets/image/' + v.configValue)
          }
          if(v.configKey == "sys.largescreen.tempText"){
            this.fengjiTemperatureText = v.configValue
          }
        })
      })
    },
    // 获取厂区ID
    getCameraArea() {
      const that = this;
      getAreaImage(1).then((response) => { // 默认imageId传1
        that.dituAreaId = response.data.areaId;
        // that.getLocationsByArea(that.dituAreaId);
      });
    },
    // 获取坐标点
    getLocationsByArea(areaId) {
      const param = { areaId: (parseInt(areaId) - 0) };
      const that = this;
      const iList = [];
      getLocationByArea(param).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          iList.push({
            id: response.data[i].locationId,
            tubiao: require("../../../assets/image/" + response.data[i].cameraIconName),
            ip: 1,
            deviceName: response.data[i].cameraName,
            cameraId: response.data[i].cameraId,
            modelId: response.data[i].modelId,
            stylename: { left: response.data[i].styleLeft, top: response.data[i].styleTop }
          });
        }
        that.imglist[0].ilist = iList;
      });
    },
    getcameraList() {
      const that = this;
      listCamera().then((response) => {
        that.cameraAllList = response.rows;
        that.getDefaultVideo(); // 获取默认监控
      });
    },
    // 获取区域下温度摄像头信息
    getTemCameraList() {
      const that = this;
      // 风机
      getTempCameraList({ areaType: 1 }).then((response) => {
        that.fjCameraList = response.data.datas;
        for (let i=0; i<that.fjCameraList.length; i++) { // 默认显示前5条
          if (i<5) {
            that.region1.push(that.fjCameraList[i].cameraId);
          }
        }
        if (that.region1.length > 0) {
          this.getLineChart({cameraIds: that.region1}, 1);
        }
      });
      // 升压站
      getTempCameraList({ areaType: 4 }).then((response) => {
        this.syzCameraList = response.data.datas;
        for (let i=0; i<that.syzCameraList.length; i++) { // 默认显示前5条
          if (i<5) {
            that.region2.push(that.syzCameraList[i].cameraId);
          }
        }
        if (that.region2.length > 0) {
          this.getLineChart({cameraIds: that.region2}, 2);
        }
      });
      // 配电室
      getTempCameraList({ areaType: 3 }).then((response) => {
        this.pdsCameraList = response.data.datas;
        for (let i=0; i<that.pdsCameraList.length; i++) { // 默认显示前5条
          if (i<5) {
            that.region3.push(that.pdsCameraList[i].cameraId);
          }
        }
        if (that.region3.length > 0) {
          this.getLineChart({cameraIds: that.region3}, 3);
        }
      });
    },
    // 获取最新10条实时告警信息
    getLatestAlarm(areaId) {
      const that = this;
      getLatestAlarmData({areaId: areaId}).then((response) => {
        that.realTimeAlarmList = response.data.datas;
        for (const i in that.realTimeAlarmList) {
          if (that.realTimeAlarmList[i].level === "重要告警") {
            that.realTimeAlarmList[i].status = 2;
          } else if (that.realTimeAlarmList[i].level === "紧急告警") {
            that.realTimeAlarmList[i].status = 1;
          } else if (that.realTimeAlarmList[i].level === "次要告警") {
            that.realTimeAlarmList[i].status = 3;
          } else {
            that.realTimeAlarmList[i].status = 4;
          }
          // that.realTimeAlarmList[i].time = that.realTimeAlarmList[i].time.substring(11,16)
        }
      });
    },
    // 获取实时告警趋势折线图(30日)
    getRealTimeTrend(areaId) {
      const that = this;
      getRealTimeAlarmTrend({areaId: areaId}).then((response) => {
        that.gaojingTrend = {
          legendData:[],
          xAxisDate: response.data.xdata,
          expectedData: [
            {
              type: "line",
              data: response.data.ydata,
            },
          ],
        };
      });
    },
    // 获取告警类型前五扇形图
    getTopFiveAlarmType(areaId) {
      const that = this;
      getTopFiveAlarmType({areaId: areaId}).then((response) => {
        that.topFiveAlarm = response.data.datas;
      });
    },
    // 获取最新10条缺陷信息
    getLatestDefect(areaId) {
      const that = this;
      getLatestDefectData({areaId: areaId}).then((response) => {
        that.defectList = response.data.datas;
      });
    },
    // 获取缺陷趋势折线图(30日)
    getDefectTrend(areaId) {
      const that = this;
      getDefectTrend({areaId: areaId}).then((response) => {
        that.defectTrend = {
          legendData:[],
          xAxisDate: response.data.xdata,
          expectedData: [
            {
              type: "line",
              data: response.data.ydata,
            },
          ],
        };
      });
    },
    // 获取缺陷类型前五扇形图
    getTopFiveDefectType(areaId) {
      const that = this;
      getTopFiveDefectType({areaId: areaId}).then((response) => {
        that.topFiveDefect = response.data.datas;
      });
    },
    // 打开选择设备弹窗 1:风机温度; 2:升压站温度; 3:配电室温度
    openDialog(type) {
      this.form.region = [];
      this.cameraList = [];
      this.regionType = type;
      if (this.regionType === 1) {
        this.cameraList = this.fjCameraList;
        this.form.region = this.region1;
        this.temporaryRegion = this.region1;
      } else if (this.regionType === 2) {
        this.cameraList = this.syzCameraList;
        this.form.region = this.region2;
        this.temporaryRegion = this.region2;
      } else {
        this.cameraList = this.pdsCameraList;
        this.form.region = this.region3;
        this.temporaryRegion = this.region3;
      }
      this.dialogFormVisible = true;
    },
    // 关闭选择设备弹窗
    closeDialog() {
      this.dialogFormVisible = false;
      if (this.regionType === 1) {
        this.region1 = this.temporaryRegion;
      } else if (this.regionType === 2) {
        this.region2 = this.temporaryRegion;
      } else {
        this.region3 = this.temporaryRegion;
      }
      // this.$refs.form.resetFields();
    },
    // 切换设备 regionType 1:风机温度; 2:升压站温度; 3:配电室温度
    changeCamera(val) {
      if (this.regionType === 1) {
        this.region1 = val;
      } else if (this.regionType === 2) {
        this.region2 = val;
      } else {
        this.region3 = val;
      }
      this.temporaryRegion = val;
      this.form.region = val;
    },
    // 根据所选设备画折线图 regionType 1:风机温度; 2:升压站温度; 3:配电室温度
    drawLineCharts(type) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const param = {
            cameraIds: this.form.region,
          };
          this.getLineChart(param, type);
        } else {
          return false;
        }
      });
    },
    getLineChart(param, type) {
      const that = this;
      getTempLineByEquipment(param).then((response) => {
        that.getLineChartData(response.data, type);
        that.dialogFormVisible = false;
      });
    },
    // 整理折线图数据 data: 数据源 type: 1:风机温度; 2:升压站温度; 3:配电室温度
    getLineChartData(data, type) {
      let legend = []; // 图例组件
      let series = []; // 折线图数据
      let xAxisDate = [];
      // 整理series数据
      for (let i in data) {
        let seriesData = [];
        for (let s = 0; s < data[i].length; s++) {
          let sData = data[i][s];
          let serData = {
            // 折线图每条线的数据
            name: data[i][s].cameraName, // 设备名
            value: [sData.eventTime.toString().slice(11, 13), sData.eventVal],
          };
          seriesData.push(serData);
        }
        // 折线图的线
        let ser = {
          name: data[i][0].cameraName,
          type: "line",
          showSymbol: false,
          hoverAnimation: false,
          data: seriesData,
        };
        series.push(ser);
        legend.push(data[i][0].cameraName);
      }
      // 横轴
      for (let i = 0; i < 24; i++) {
        xAxisDate.push((i > 9 ? "" : "0") + i);
      }
      const chartData = {
        legendData: legend,
        xAxisDate: xAxisDate,
        expectedData: series
      };
      if (type === 1) {
        this.fjLineChart = chartData;
      } else if (type === 2) {
        this.syzLineChart = chartData;
      } else {
        this.pdsLineChart = chartData;
      }
    },
    // 获取当天巡检计划
    getCurrentPatrolPlan() {
      const that = this;
      getCurrentDayPatrol().then((response) => {
        that.cunrrentPatrol = response.data.patrolDays
      });
    },
    // 获取本周巡检问题数量统计
    getWeekPatrolErrors() {
      const that = this;
      getPatrolError().then((response) => {
        that.patrolErrorData.expectedData = {
            name: "本周巡检问题",
            type: "bar",
            data: response.data.ydata
        };
        that.patrolErrorData.xAxisDate = response.data.xdata;
        that.patrolErrorData.legendData = ["本周巡检问题"];
      });
    },
     // 获取本周巡检计划和完成情况
    getPatrolWeekProgress() {
      const that = this;
      getPatrolProgress().then((response) => {
        that.patrolProgress.complete = response.data.complete;
        that.patrolProgress.total = response.data.total;
        if (that.patrolProgress.total === 0 || that.patrolProgresscomplete === 0) {
          that.patrolProgress.rate = 0;
        } else {
          const rate = (response.data.complete / response.data.total) * 100
          if (rate !== 0) {
            that.patrolProgress.rate = parseFloat(rate).toFixed(2);
          } else {
            that.patrolProgress.rate = 0;
          }
          
        }
      });
    },
    // 获取大屏监控默认设置
    getDefaultVideo() {
      const that = this;
      getCameraDefaultSetting().then((response) => {
        if (response.data.defaultValue) { // 有默认设置
          const ids = response.data.defaultValue.split(',');
          that.currentVideoSetting = ids;
        } else {
          // 如果没有默认设置，则取所有摄像头的前四个显示
          that.currentVideoSetting = [that.cameraAllList[0].cameraId, that.cameraAllList[1].cameraId, that.cameraAllList[2].cameraId, that.cameraAllList[3].cameraId]
        }
        that.cameraAllList.map(item => {
          if (item.cameraId == that.currentVideoSetting[0]) {
            window.sessionStorage.setItem('windowOne', item.ip);
          } else if (item.cameraId == that.currentVideoSetting[1]) {
            window.sessionStorage.setItem('windowTwo', item.ip);
          } else if (item.cameraId == that.currentVideoSetting[2]) {
            window.sessionStorage.setItem('windowThree', item.ip);
          } else if (item.cameraId == that.currentVideoSetting[3]) {
            window.sessionStorage.setItem('windowFour', item.ip);
          }
        });
        let _iframe = document.getElementById("videoiframes");
        _iframe.contentWindow.location.reload(true);
      });
    },
    goToSet() {
      this.$router.push('/largescreensettings');
      if (
        '-ms-scroll-limit' in document.documentElement.style && 
        '-ms-ime-align' in document.documentElement.style
      ) { // 判断是不是ie浏览器
        window.addEventListener("hashchange", function(event) {
          let currentPath = window.location.hash.slice(1);
          if (store.state.route.path !== currentPath) {
            router.push(currentPath)
          }
        }, false)
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.screen-container {
  padding: 16px 0;
  min-height: calc(100vh - 50px);
  background-image: linear-gradient(45deg, #09136c, #030839 50%),
            linear-gradient(-45deg, #09136c, #030839 50%);
  // background-image: linear-gradient(to bottom right, #09136c, #030839, #09136c);
  // background-color: #030839;
}
/**大标题 */
.screen-big-title {
  width: 100%;
  // height: 15vh;
  // background: url("../../../assets/image/largescreen-title.png");
  // background:var(--background);
  // background-size: 100% 100%;
  img {
    width: 100%;
  }
}
/**风电厂全景图样式 */
.imgcol {
  width: 100%;
  .imgdiv {
    padding: 10px;
    text-align: center;
    .lunbodiv {
      /deep/ .el-carousel__container {
        // height: 580px;
        height: 230px;
        position: relative;
        top: 0px;
        left: 0px;
      }
      .card_pre {
        width: 100%;
        .bgimg {
          width: 100%;
          // height: 580px;
          height: 230px;
          position: relative;
          top: 0px;
          left: 0px;
        }
        .bd_ccc {
          // position: relative;
          // top: 0px;
          // display: flex;
          .mg_20 {
            // width: 18px;
            // height: 18px;
            width: 12px;
            height: 12px;
            margin-right: 300px;
            img {
              // width: 18px;
              // height: 18px;
              width: 12px;
              height: 12px;
              // font-size: 30px;
              // color: firebrick;
              position: absolute;
              top: 10px;
              left: 10px;
            }
          }
          // .mg_20:hover {
          //   cursor: pointer;
          // }
        }
      }
    }
  }
}
/*修改滚动条样式*/
.screen-conten-roll-xunjian::-webkit-scrollbar{
  width:10px;
  height:10px;
  /**/
}
.screen-conten-roll-xunjian::-webkit-scrollbar-track{
  background: rgba(239, 239, 239, 0.1);
  border-radius:2px;
}
.screen-conten-roll-xunjian::-webkit-scrollbar-thumb{
  background: #bfbfbf;
  border-radius:10px;
}
.screen-conten-roll-xunjian::-webkit-scrollbar-thumb:hover{
  background: #333;
}
.screen-conten-roll-xunjian::-webkit-scrollbar-corner{
  background: #179a16;
}
.screen-conten-roll-xunjian {
  /*三角箭头的颜色*/
  scrollbar-arrow-color: #fff;
  /*滚动条滑块按钮的颜色*/
  scrollbar-face-color: #bfbfbf;
  /*滚动条整体颜色*/
  scrollbar-highlight-color: rgba(239, 239, 239, 0.1);
  /*滚动条阴影*/
  scrollbar-shadow-color: #bfbfbf;
  /*滚动条轨道颜色*/
  scrollbar-track-color: #bfbfbf;
  /*滚动条3d亮色阴影边框的外观颜色——左边和上边的阴影色*/
  scrollbar-3dlight-color:#bfbfbf;
  /*滚动条3d暗色阴影边框的外观颜色——右边和下边的阴影色*/
  scrollbar-darkshadow-color: #bfbfbf;
  /*滚动条基准颜色*/
  scrollbar-base-color: #bfbfbf;
}
@media (max-width: 992px) {
  .border-corner {
    padding: 25px !important;
  }
  .screen-big-title {
    height: 70px;
  }
  .screen-ssjiankong {
    height: 400px;
  }
  .set-btn {
    color: #ffffff;
    border: none;
    padding: 7px 15px !important;
    font-size: 12px;
    border-radius: 3px;
    position: absolute;
    right: 3%;
    top: 60px;
  }
}
@media screen and (min-width: 993px) and (max-width: 1199px) {
  .border-corner {
    padding: 20px !important;
  }
  .screen-big-title {
    height: 100px;
  }
}
@media  screen and (min-width: 1200px) and (max-width: 1599px) {
  .border-corner {
    // padding: 35px !important;
    padding: 20px !important;
  }
  .screen-xunjian {
    height: 320px;
  }
  .screen-quanjing {
    height: 320px;
  }
  .screen-ssgaojing {
    height: 400px;
  }
  .screen-conten-roll {
    // max-height: 80px;
    height: 80px;
  }
  .screen-conten-roll-xunjian {
    max-height: 80px;
    overflow-y: scroll;
    padding-right: 5px;
  }
  .screen-ssjiankong {
    height: 400px;
  }
  .screen-big-title {
    height: 120px;
  }
  .screen-temkongzhi {
    height: 730px;
  }
  .screen-line-chart {
    height: 150px;
  }
  /**风电厂全景图样式 */
  .imgcol {
    width: 100%;
    .imgdiv {
      padding: 10px;
      text-align: center;
      .lunbodiv {
        /deep/ .el-carousel__container {
          // height: 580px;
          height: 230px;
          position: relative;
          top: 0px;
          left: 0px;
        }
        .card_pre {
          width: 100%;
          .bgimg {
            width: 100%;
            // height: 580px;
            height: 230px;
            position: relative;
            top: 0px;
            left: 0px;
          }
          .bd_ccc {
            // position: relative;
            // top: 0px;
            // display: flex;
            .mg_20 {
              // width: 18px;
              // height: 18px;
              width: 12px;
              height: 12px;
              margin-right: 300px;
              img {
                // width: 18px;
                // height: 18px;
                width: 12px;
                height: 12px;
                // font-size: 30px;
                // color: firebrick;
                position: absolute;
                top: 10px;
                left: 10px;
              }
            }
            // .mg_20:hover {
            //   cursor: pointer;
            // }
          }
        }
      }
    }
  }
  .set-btn {
    color: #ffffff;
    border: none;
    padding: 7px 15px !important;
    font-size: 12px;
    border-radius: 3px;
    position: absolute;
    right: 3%;
    top: 80px;
  }
}
@media screen and (min-width: 1600px) and (max-width: 2300px) {
  .border-corner {
    padding: 35px !important;
  }
  .screen-xunjian {
    height: 400px;
  }
  .screen-quanjing {
    height: 400px;
  }
  .screen-ssgaojing {
    height: 440px;
  }
  .screen-conten-roll {
    // max-height: 100px;
    height: 100px;
  }
  .screen-conten-roll-xunjian {
    max-height: 100px;
    overflow-y: scroll;
  }
  .screen-ssjiankong {
    height: 440px;
  }
  .screen-temkongzhi {
    height: 850px;
  }
  .screen-line-chart {
    height: 200px;
  }
  .screen-big-title {
    height: 140px;
  }
  /**风电厂全景图样式 */
  .imgcol {
    width: 100%;
    .imgdiv {
      padding: 10px;
      text-align: center;
      .lunbodiv {
        /deep/ .el-carousel__container {
          // height: 580px;
          height: 300px;
          position: relative;
          top: 0px;
          left: 0px;
        }
        .card_pre {
          width: 100%;
          .bgimg {
            width: 100%;
            // height: 580px;
            height: 300px;
            position: relative;
            top: 0px;
            left: 0px;
          }
          .bd_ccc {
            // position: relative;
            // top: 0px;
            // display: flex;
            .mg_20 {
              // width: 18px;
              // height: 18px;
              width: 12px;
              height: 12px;
              margin-right: 300px;
              img {
                // width: 18px;
                // height: 18px;
                width: 12px;
                height: 12px;
                // font-size: 30px;
                // color: firebrick;
                position: absolute;
                top: 10px;
                left: 10px;
              }
            }
            // .mg_20:hover {
            //   cursor: pointer;
            // }
          }
        }
      }
    }
  }
  .set-btn {
    color: #ffffff;
    border: none;
    padding: 7px 15px !important;
    font-size: 12px;
    border-radius: 3px;
    position: absolute;
    right: 3%;
    top: 120px;
  }
}
/**各个模块样式 */
.screen-xunjian {
  background: url("../../../assets/image/largescreen-xunjian.png");
  background-size: 100% 100%;
  min-height: 200px;
  padding: 15px;
}
.screen-quanjing {
  background: url("../../../assets/image/largescreen-dcquanjing.png");
  background-size: 100% 100%;
  min-height: 200px;
  padding: 15px;
}
.screen-temkongzhi {
  background: url("../../../assets/image/largescreen-temkongzhi.png");
  background-size: 100% 100%;
  min-height: 400px;
  padding: 15px;
}
.screen-ssgaojing {
  background: url("../../../assets/image/largescreen-ssjiance.png");
  background-size: 100% 100%;
  // min-height: 200px;
  padding: 15px;
}
.screen-ssjiankong {
  background: url("../../../assets/image/largescreen-ssjiankong.png");
  background-size: 100% 100%;
  // min-height: 430px;
  padding: 15px;
}
/**模块标题样式 */
.screen-title {
  color: #fff;
  font-weight: 500;
  border-bottom: 1px solid #f1f1f14d;
}
.screen-line-chart {
  min-height: 100px;
  border-radius: 5px;
  border: 1px solid #9bbaf8;
  margin: 10px 0;
}
/**模块容器样式 */
.screen-content-box {
  padding: 8px;
}
/**巡检模块标题样式 */
.label-title {
  color: #fff;
  font-size: 12px;
  overflow:hidden;
	text-overflow:ellipsis;
	white-space:nowrap;
}
.label-content {
  color: #fff;
  font-size: 12px;
}
/deep/ .el-progress__text {
  color: #fff;
}
/**巡检模块巡检情况文字样式 */
.label-content-left {
  /* width: 100%; */
  text-align: left;
  overflow:hidden;
	text-overflow:ellipsis;
	white-space:nowrap;
}
.label-content-right {
  /* width: 100%; */
  text-align: right;
  padding-right: 5px;
}
.screen-title-left {
  text-align: left;
  overflow:hidden;
	text-overflow:ellipsis;
	white-space:nowrap;
}
.screen-title-right {
  text-align: right;
}
/**告警文字样式 */
.gaojing-detail {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  display: inline;
}
/**告警警示标志 */
.mechine1 {
  width: 8px;
  height: 8px;
  margin-top: 5px;
  float: left;
  background: #e40001;
}
.mechine2 {
  width: 8px;
  height: 8px;
  margin-top: 5px;
  float: left;
  background: #feaa1f;
}
.mechine3 {
  width: 8px;
  height: 8px;
  margin-top: 5px;
  float: left;
  background: #fff83a;
}
.mechine4 {
  width: 8px;
  height: 8px;
  margin-top: 5px;
  float: left;
  background: #0ff6fe;
}
// 实时告警滚动
.screen-conten-roll {
  // max-height: 100px;
  overflow: hidden;
  .row-up {
    -webkit-animation: 10s rowup linear infinite normal;
    animation: 10s rowup linear infinite normal;
    position: relative;
  }
}
@keyframes rowup {
  0% {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
  100% {
    -webkit-transform: translate3d(0, -307px, 0);
    transform: translate3d(0, -307px, 0);
  }
}
/**监测警示标志 */
.jiance-event {
  width: 5px;
  height: 5px;
  border-radius: 5px;
  margin-top: 8px;
  float: left;
  background: #1eeecc;
}
/**温度折线图样式 */
.screen-temperature-monitor {
  color: rgba(255,255,255,0.8) ;
}
.screen-choose-btn {
  background-image: linear-gradient(to right, #d239ff 0%, #f55664 100%);
  border: none;
  a {
    color: #ffffff;
  }
}
.showMissionText {
  cursor: pointer;
}
.showMissionText:hover {
  text-decoration:underline;
}
/deep/ .el-input--medium .el-input__inner {
  width: 300px;
}
/deep/ .el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
  right: 8px;
}
</style>
