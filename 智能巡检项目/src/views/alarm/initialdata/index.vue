<template>
   <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
         <el-form-item label="告警类型" prop="alarmType">
          <el-select v-model="queryParams.alarmType" clearable filterable placeholder="请选择" >
             <el-option
              v-for="dict in gaojintypeoptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
              @keyup.enter.native="handleQuery"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件时间" prop="eventTime">
           <el-date-picker
            v-model="queryParams.eventTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" v-hasPermi="['alarm:event:query']" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="initialdataList">
      <el-table-column label="事件ID" align="center" prop="eventId" />
      <el-table-column label="事件编号" align="center" prop="eventNo" />
      <el-table-column label="事件时间" align="center" prop="eventTime" />
      <el-table-column label="告警类型" align="center" prop="alarmType" />
      <el-table-column label="告警内容" align="center" prop="alarmNote" />
      <el-table-column label="告警图片url" align="center" prop="alarmPictrueUrl" width="170" />
      <!-- <el-table-column label="摄像头Id" align="center" prop="cameraId" /> -->
      <el-table-column label="智能感知终端" align="center" prop="cameraName" />
      <!-- <el-table-column label="缺陷ID" align="center" prop="defectId" /> -->
      <el-table-column label="缺陷名称" align="center" prop="defectName" />
      <el-table-column label="缺陷标签" align="center" prop="defectLabel" />
      <el-table-column label="预置位" align="center" prop="siteId" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
     <el-table-column label="操作" align="center" fixed="right" width="100">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click="handleDetails(scope.row)"
            v-hasPermi="['alarm:event:details']"
          >详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

  <!-- 原始数据详情
    对话框-->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item prop="alarmPictrueUrl">
          <el-avatar shape="square" style="width:300px;height:200px;" :size="100" fit="fill" :src="form.alarmPictrueUrl"></el-avatar>
        </el-form-item>
        <el-form-item label="告警类型" prop="alarmType">
          <el-input v-model="form.alarmType" placeholder="请输入告警类型" :disabled="formDisabled"/>
        </el-form-item>
       <el-form-item label="事件时间" prop="eventTime">
          <el-input v-model="form.eventTime" placeholder="请输入告警来源" :disabled="formDisabled"/>
        </el-form-item>
        <el-form-item label="智能感知终端" prop="cameraName">
          <el-input v-model="form.cameraName" placeholder="请输入智能感知终端" :disabled="formDisabled"/>
        </el-form-item>
        <el-form-item label="缺陷ID" prop="defectId">
          <el-input v-model="form.defectId" placeholder="请输入缺陷ID" :disabled="formDisabled"/>
        </el-form-item>
        <el-form-item label="缺陷标签" prop="defectLabel">
          <el-input v-model="form.defectLabel" placeholder="请输入缺陷ID" :disabled="formDisabled"/>
        </el-form-item>
        <el-form-item label="预置位" prop="siteId">
          <el-input v-model="form.siteId" placeholder="请输入预置位ID" :disabled="formDisabled"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input v-model="form.status" placeholder="请输入状态" :disabled="formDisabled"/>
        </el-form-item>
      </el-form> 
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listInitialdata,
  getInitialdata,
} from "@/api/alarm/initialdata";

import {listDefect} from "@/api/device/defect"
import { getDicts } from "@/api/system/dict/data"
import { listCamera } from "@/api/device/camera";
import { listConfig } from "@/api/system/config"; //全局获取告警图片IP地址和摄像头账户密码


export default {
  // name: "Line",
  data() {
    return {
      // 动态获取告警图片IP地址
      alarmimgipurl:"",

      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 原始数据表格数据
      initialdataList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        alarmType: undefined,
        eventTime: undefined
      },
      // 表单参数
      form: {},
      formDisabled:true,
      // 图片前的IP地址
      imageheader:"",
      // imageheader:"http://192.168.1.50:8080/", //服务器图片地址
      // imageheader:process.env.VUE_APP_BASE_API, //本地
      // 表单校验
      rules: {

      },
      // 告警/规则类型 下拉列表
      gaojintypeoptions: [],
      shexiangtoulist:[],
      // 缺陷下拉别表
      quexianoptions:[],
    };
  },
  created() {
    this.getcameraip();
    this.getdefectlist();
    this.getalarmtypelist();
    this.getshexiangtoulist();
    setTimeout(()=>{
      this.getList();
    },300)
  },
  mounted(){
    this.imageheader = window.sessionStorage.getItem("alarmimgipurl")
  },
  methods: {
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
          // // 摄像头账号
          // if(v.configKey == "config.camera.username"){
          //   this.camerauser = v.configValue;
          //   window.sessionStorage.setItem("camerauser",this.camerauser);
          // }
          // // 摄像头密码
          //  if(v.configKey == "config.camera.password"){
          //   this.camerapassword = v.configValue;
          //   window.sessionStorage.setItem("camerapassword",this.camerapassword);
          // }
          // // NVR服务器IP
          // if(v.configKey == "server.nvr.ip"){
          //   this.nvrip = v.configValue;
          //   window.sessionStorage.setItem("nvrip",this.nvrip);
          // }
        })
      });
    },
    /** 查询原始数据列表 */
    getList() {
      this.loading = true;
      listInitialdata(this.queryParams).then(response => {
        console.log(response)
        response.rows.map((v)=>{
          // 告警类型
          if(v.alarmType == "1"){
            v.alarmType = "视频识别"
          }else if(v.alarmType == "2"){
            v.alarmType = "温度"
          } 
          this.shexiangtoulist.map((y)=>{
              if(v.cameraId == y.cameraId){
                  v.cameraName = y.cameraName
              }
          })
          this.quexianoptions.map((c)=>{
            if(v.defectId == c.defectId){
              v.defectName = c.defectName
            }
          })
        })
        this.initialdataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 告警类型下拉列表
    getalarmtypelist() {
      getDicts("alarm_type").then(response => {
        console.log(response,"告警类型下拉列表")
        this.gaojintypeoptions = response.data;
      });
    },
    // 查询的摄像头下拉
    getshexiangtoulist() {
      listCamera().then(response => {
        console.log(response,"摄像头下拉列表")
        this.shexiangtoulist = response.rows;
      });
    },
     // 缺陷下拉列表
    getdefectlist() {
      listDefect().then(response => {
        console.log(response,"缺陷下拉列表")
        this.quexianoptions = response.rows;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
   
    /** 详情按钮操作 */
    handleDetails(row) {
        console.log(row)
        const alarmDetailId = row.eventId;
        getInitialdata(alarmDetailId).then(response => {
            // console.log(response.data)
          if(response.data.alarmType == "1"){
            response.data.alarmType = "视频识别"
          }else if(response.data.alarmType == "2"){
            response.data.alarmType = "温度"
          } 
          this.form = response.data;
          this.form.alarmPictrueUrl = 'http://'+ this.imageheader + '/' + this.form.alarmPictrueUrl;
          this.form.cameraName = row.cameraName;
          this.open = true;
          this.title = "详情";
        });
    }
  }
};
</script>