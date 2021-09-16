<template>
   <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
        <el-form-item label="区域" prop="areaId">
          <treeselect v-model="queryParams.areaId" :options="quyulist" :normalizer="normalizer" placeholder="请选择区域" style="width:200px;" />
        </el-form-item> 
        <el-form-item label="智能感知终端" prop="cameraId">
          <el-select v-model="queryParams.cameraId" clearable filterable placeholder="请选择">
            <el-option
              v-for="dict in shexiangtoulist"
              :key="dict.cameraId"
              :label="dict.cameraName"
              :value="dict.cameraId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" v-hasPermi="['alarm:informdetail:query']" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['alarm:informdetail:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['alarm:informdetail:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['alarm:informdetail:remove']"
        >删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['alarm:informdetail:export']"
        >导出</el-button> 
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="tablelistnotice" :cell-class-name="textOverflow" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="告警通知ID" align="center" prop="informId" />
      <el-table-column label="区域" align="center" prop="areaName" />
      <el-table-column label="智能感知终端" align="center" prop="cameraName" />
      <!-- <el-table-column label="语音告警ip" align="center" prop="broadIp" /> -->
      <el-table-column label="设备缺陷" align="center" prop="defectName" />
      <el-table-column label="通知开始时间" align="center" prop="informBeginTime" />
      <el-table-column label="通知结束时间" align="center" prop="informEndTime" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" fixed="right" width="270">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleConfig(scope.row)"
            v-hasPermi="['alarm:informdetail:config']"
          >配置</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['alarm:informdetail:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['alarm:informdetail:remove']"
          >删除</el-button>
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

  <!-- 添加或修改告警通知
    对话框-->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="区域ID" prop="areaId">
          <treeselect v-model="form.areaId" :options="quyuoptions" :normalizer="normalizer" placeholder="请选择区域" />
        </el-form-item> 
        <el-form-item label="智能感知终端" prop="cameraId">
          <el-select v-model="form.cameraId" clearable filterable placeholder="请选择">
            <el-option
              v-for="dict in shexiangtouoptions"
              :key="dict.cameraId"
              :label="dict.cameraName"
              :value="dict.cameraId"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="语音告警ip" prop="broadIp">
          <el-select v-model="form.broadIp" clearable filterable placeholder="请选择">
            <el-option
              v-for="dict in yuyinoptions"
              :key="dict.broadIp"
              :label="dict.broadIp"
              :value="dict.broadIp"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="设备缺陷ID" prop="defectId">
          <el-select v-model="form.defectId" clearable filterable placeholder="请选择">
            <el-option
              v-for="dict in quexianoptions"
              :key="dict.defectId"
              :label="dict.defectName"
              :value="dict.defectId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通知时间">
          <el-date-picker v-model="timerangeval" type="datetimerange"
            range-separator="至"
            start-placeholder="通知开始时间"
            end-placeholder="通知结束时间"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="通知开始时间" prop="informBeginTime">
          <el-date-picker v-model="form.informBeginTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
         <el-form-item label="通知结束时间" prop="informEndTime">
          <el-date-picker v-model="form.informEndTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item> -->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 配置 -->
    <el-dialog title="配置" :visible.sync="outerVisible" width="60%" append-to-body>
       <el-tabs v-model="activeName" type="border-card" @tab-click="handletabClick">
        <el-tab-pane label="短信" name="duanxin">
          <el-row class="xinzeng">
            <el-button type="primary" icon="el-icon-plus" size="mini" v-hasPermi="['alarm:informdetail:add']" @click="Addduanxin">新增</el-button>
          </el-row>
          <el-table :data="duanxinData" border style="width: 100%">
            <el-table-column prop="informDetailId" label="告警详情ID" width="120">
            </el-table-column>
            <el-table-column prop="informType" label="告警通知方式">
            </el-table-column>
            <el-table-column prop="informNumber" label="接收号码">
            </el-table-column>
            <el-table-column prop="informName" label="接收人">
            </el-table-column>
            <el-table-column prop="informContent" label="接收内容">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="140">
              <template slot-scope="scope">
                <el-button @click="Editduanxin(scope.row)" type="text" icon="el-icon-edit" size="small">修改</el-button>
                <el-button @click="Deleteduanxin(scope.row)" type="text" icon="el-icon-delete" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="邮件" name="youjian">
          <el-row class="xinzeng"><el-button type="primary" icon="el-icon-plus" size="mini" @click="Addyoujian">新增</el-button></el-row>
          <el-table :data="youjianData" border style="width: 100%">
             <el-table-column prop="informDetailId" label="告警详情ID">
            </el-table-column>
            <el-table-column prop="informType" label="告警通知方式">
            </el-table-column>
            <el-table-column prop="informName" label="接收人">
            </el-table-column>
            <el-table-column prop="informNumber" label="接收邮件">
            </el-table-column>
            <el-table-column prop="informTitle" label="接收标题">
            </el-table-column>
            <el-table-column prop="informContent" label="接收内容">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="140">
              <template slot-scope="scope">
                <el-button @click="Edityoujian(scope.row)" type="text" icon="el-icon-edit" size="small">修改</el-button>
                <el-button @click="Deleteyoujian(scope.row)" type="text" icon="el-icon-delete" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="广播" name="guangbo">
          <el-row class="xinzeng">
            <el-button type="primary" icon="el-icon-plus" size="mini" v-hasPermi="['alarm:informVoice:add']" @click="Addguangbo">新增</el-button>
          </el-row>
          <el-table :data="guangboData" border style="width: 100%">
             <el-table-column prop="informDetailId" label="告警详情ID" width="70">
            </el-table-column>
            <el-table-column prop="eventVal" label="告警事件值" width="100">
            </el-table-column>
            <el-table-column prop="informTitle" label="音频名称" width="150">
            </el-table-column>
            <el-table-column prop="informContent" label="音频地址">
              <template slot-scope="scope">
                <audio :src="scope.row.informContent" controls> 你的浏览器不支持 <code>audio</code> 标签.</audio>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="90">
              <template slot-scope="scope">
                <!-- <el-button @click="Editguangbo(scope.row)" type="text" icon="el-icon-edit" size="small">修改</el-button> -->
                <el-button @click="Deleteguangbo(scope.row)" type="text" icon="el-icon-delete" v-hasPermi="['alarm:informVoice:remove']" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-dialog width="900px" :title="configtitle" :visible.sync="innerVisible" append-to-body>
        <el-form ref="configform" :model="configform" :configrules="configrules" label-width="100px">
          <div v-show="isshowduanxin">
            <el-form-item label="接收人">
                <!-- <el-input v-model="configform.informName"></el-input> -->
              <el-select v-model="configform.informName" @change="changeUserPhone" clearable filterable placeholder="请选择">
                <el-option
                  v-for="informs in userList"
                  :key="informs.userId"
                  :label="informs.nickName"
                  :value="informs.userId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接收号码">
                <el-input v-model="configform.informNumber" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="接收内容">
                <el-input v-model="configform.informContent"></el-input>
            </el-form-item>
          </div>
          <div v-show="isshowyoujian">
            <el-form-item label="接收人">
                <!-- <el-input v-model="configform.informName"></el-input> -->
              <el-select v-model="configform.informName" @change="changeUserEmail" clearable filterable placeholder="请选择">
                <el-option
                  v-for="informs in userList"
                  :key="informs.userId"
                  :label="informs.nickName"
                  :value="informs.userId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接收邮件">
                <el-input v-model="configform.informNumber" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="接收标题">
                <el-input v-model="configform.informTitle"></el-input>
            </el-form-item>
            <el-form-item label="接收内容">
                <el-input v-model="configform.informContent"></el-input>
            </el-form-item>
          </div>
          <div v-show="isshowguangbo">
            <el-form-item label="广播:">
               <!-- <el-select v-model="configform.informName" clearable filterable placeholder="请选择">
                <el-option
                  v-for="items in guangbooptions"
                  :key="items.voiceId"
                  :label="items.voiceName"
                  :value="items.voiceId"
                ></el-option>
              </el-select> -->
               <el-upload
                ref="replaceUploader"
                :file-list="fileList"
                v-model="configform.voiceUrl"
                class="avatar-uploader"
                :headers="upload.headers"
                :action="upload.uploadUrl" 
                :limit="1"
                :show-file-list="false"
                :on-success="handleReplaceAvatarSuccess"
                :on-progress="uploadVideoProcess">
                  <el-col :span="6">
                    <el-button size="small" type="primary" class="btnClick">点击上传</el-button>
                  </el-col>
                  <el-col :span="18">
                    <audio v-if="configform.voiceUrl !='' && !audioFlag" :src="configform.voiceUrl" controls preload> 你的浏览器不支持 <code>audio</code> 标签.</audio>
                    <i v-else-if="configform.voiceUrl =='' && !audioFlag" class="el-icon-plus avatar-uploader-icon"></i>
                    <el-progress v-if="audioFlag == true" type="line" v-bind:percentage="audioUploadPercent" style="margin-top:7px;margin-left:40px;"></el-progress>
                  </el-col>
              </el-upload>
            </el-form-item>
            <el-form-item label="告警事件值:">
                <el-input v-model="configform.eventVal" w></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <!--  v-if="this.isshowguangbo === false" -->
          <el-button @click="saveConfig">保 存</el-button>
          <el-button @click="cancelConfig">取 消</el-button>
        </div> 
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="saveTable">保 存</el-button> -->
        <el-button @click="cancelTable">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listWarningnotice,
  getWarningnotice,
  delWarningnotice,
  addWarningnotice,
  updateWarningnotice,
  exportWarningnotice,


  WarningnoticeDetaillist,
  getWarningnoticeDetail,
  delWarningnoticeDetail,
  addWarningnoticeDetail,
  updateWarningnoticeDetail,
  exportWarningnoticeDetail,

  ListinformVoice,
  getinformVoice,
} from "@/api/alarm/warningnotice"

import { listArea } from "@/api/device/area";
import { listCamera } from "@/api/device/camera";
import { listUser } from "@/api/system/user";
// import { getEquipment } from "@/api/device/equipmentDefect"
import {listDefect} from "@/api/device/defect"
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
// import axios from 'axios';

import { getToken } from "@/utils/auth";


export default {
  // name: "Line",
  components: { Treeselect },
  data() { 
    return {
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
      // 告警通知表格数据
      tablelistnotice: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 配置内容切换
      activeName: 'duanxin',
      // 配置外层弹框
      outerVisible:false,
      // 配置详情列表数据
      configdataList:[],
      // 新增修改标题
      configtitle:"",
      // 配置内层弹框
      innerVisible:false,
      // 新增修改form是否展示
      isshowduanxin:false,
      isshowyoujian:false,
      isshowguangbo:false,
      // 接收人下拉数据
      userList:[],
      // 短信表格数据
      duanxinData:[],
      // 邮件表格数据
      youjianData:[],
      // 广播表格数据
      guangboData:[],
      // 广播新增下拉列表
      // guangbooptions:[],
      // 新增短信，邮件表单
      configform:{},
      // 告警ID
      rowinformId:"",
      replaceList:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        areaId: undefined,
        ip:undefined,
      },
      // 表单参数
      form: {},
      // 通知时间
      timerangeval:[],
      // 表单校验
      rules: {
        areaId: [
          { required: true, message: '请选择区域', trigger: 'change' }
        ],
        // cameraId: [
        //   { required: true, message: '请选择智能感知终端', trigger: 'change' }
        // ],
        defectId: [
          { required: true, message: '请选择设备缺陷', trigger: 'change' }
        ],
        remark: [
          { min: 0, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },
        ],
      },
      configrules: {},
      // 区域下拉列表
      quyuoptions: [],
      quyulist:[],
      //智能感知终端下拉列表
      shexiangtoulist:[],
      shexiangtouoptions:[],
      // 语音告警列表
      // yuyinoptions:[],
      // 缺陷下拉别表
      quexianoptions:[],


      
      // // 音频传入的参数
      upload: {
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        uploadUrl: process.env.VUE_APP_BASE_API + "/common/upload"
      },
      audioFlag: false,
      //是否显示进度条
      audioUploadPercent: "",
      //进度条的进度，
      fileList:[],
    };
  },
  created() {
    this.getquyulist();
    this.getshexiangtoulist();
    this.getdefectlist();

    this.getalarmConfigList();
    // this.getguangboList();
    this.getUserdataList();
    setTimeout(()=>{
     this.getList();
    },500)
  },
  // mounted(){
  // },
  methods: {
    /** 查询告警通知
列表 */
    getList() {
      listWarningnotice(this.queryParams).then(response => {
        response.rows.map((v)=>{
          this.quyulist.map((a)=>{
            if(v.areaId == a.areaId){
              v.areaName = a.areaName
            }
          })

          this.shexiangtoulist.map((b)=>{
            if(v.cameraId == b.cameraId){
              v.cameraName = b.cameraName
            }
          })

          this.quexianoptions.map((c)=>{
            if(v.defectId == c.defectId){
              v.defectName = c.defectName
            }
          })
        })
        console.log(response.rows,'获取表格列表数据')
        this.tablelistnotice = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 转换区域数据结构 */
    normalizer(node) {
      // console.log(node)
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.areaId,
        label: node.areaName,
        children: node.children
      };
    },
     // 通过区域ID请求智能感知终端下拉列表
    quyuChange(newval,oldval){
      console.log(newval,'quyuChange',oldval)
      if(newval){
        var selectarea = {
          "areaId":newval
        }
        listCamera(selectarea).then(response => {
          console.log(response,"智能感知终端下拉列表")
          if(response.rows.length > 0){
            this.shexiangtouoptions = response.rows;
          }else if(response.rows.length == 0){
            this.shexiangtouoptions = []
            this.form.cameraId = ""
          }
        });
      }
      if(newval !== oldval && newval != undefined && oldval != undefined){
        this.form.cameraId = undefined
      }
    },
    // cameraChange(newval,oldval){
    //   if(newval){
    //     // this.form.ip = "";
    //     this.yuyinoptions = [];
    //     var queryforms = {
    //       "areaId":this.form.areaId,
    //       "cameraId":newval,
    //       "hasBroad":"1"
    //     }
    //     listCamera(queryforms).then(response => {
    //       console.log(response,"语音ip下拉列表")
    //       if(response.rows.length > 0){
    //         this.yuyinoptions = response.rows;
    //       }else if(response.rows.length == 0){
    //         this.yuyinoptions = []
    //       }
    //     });
    //   }
    // },
    // 区域下拉列表
    getquyulist() {
      listArea().then(response => {
         console.log(response.data,'区域下拉列表')
        this.quyuoptions = this.handleTree(response.data, "areaId");
        this.quyulist = response.data
      });
    },
    // 查询的智能感知终端下拉
    getshexiangtoulist() {
      listCamera().then(response => {
        console.log(response,"智能感知终端下拉列表")
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
    // 告警通知配置里面广播下拉列表
    // getguangboList(){
    //   ListinformVoice().then(response => {
    //     console.log(response,'广播下拉列表')
    //     this.guangbooptions = response.rows;
    //   });
    // },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        areaId:undefined,//区域ID
        cameraId: undefined, //智能感知终端ID
        defectId: undefined,  //设备缺陷id
        informType: undefined, //通知方式
        informBeginTime: undefined, //通知开始时间
        informEndTime: undefined,  //通知结束时间
        remark: undefined,  //备注
      };
      this.resetForm("form");
      this.timerangeval = [];
    },
    resetDetail(){
      this.configform = {
        informType:undefined,
        informNumber:undefined,
        informName:undefined,
        informTitle:undefined,
        informContent:undefined,
        voiceId:undefined,
        voiceName:undefined,
        voiceUrl : undefined,
        eventVal:undefined,
      }
      this.resetForm("configform")
      this.fileList=[];
      this.audioUploadPercent = 0;
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.informId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加告警通知";
      this.timerangeval = [];
    },
    handletabClick(tab, event) {
      console.log(tab, event);
    },
    /** 配置按钮操作 */
    handleConfig(row){
      console.log(row);
      this.rowinformId = row.informId;
      this.title = "配置告警通知";
      this.outerVisible = true;
      this.getalarmConfigList();
    },
    // duanxinData
    /** 告警配置详情列表 */
    getalarmConfigList(){
      this.rowparams = {
        "informId":this.rowinformId
      };
      WarningnoticeDetaillist(this.rowparams).then(response => {
        console.log(response,"告警配置详情列表");
        this.configdataList = response.rows;
        var configdetail = [], duanxinList = [], youjianList = [], guangboList = [];
        this.configdataList.map((v)=>{
          if(v.informType == "1"){
            v.informType = "短信"
            duanxinList.push(v);
          }else if(v.informType == "2"){
            v.informType = "邮件"
            youjianList.push(v);
          }else if(v.informType == "3"){
            v.informType = "广播"
            guangboList.push(v);
          }
        })
        this.duanxinData = duanxinList;
        this.youjianData = youjianList;
        this.guangboData = guangboList;
      });
    },

    /** 获取用户信息 */
    getUserdataList(){
      listUser().then(response => {
        console.log(response.rows,'获取用户信息')
          this.userList = response.rows;
        }
      );
    },
    /** 接收人下拉phone */
    changeUserPhone(val){
      this.userList.map((v)=>{
        if(val == v.userId){
          this.configform.informName = v.nickName
          this.configform.informNumber = v.phonenumber
        }
      })
    },
    /** 接收人下拉Email */
    changeUserEmail(val){
      this.userList.map((v)=>{
        if(val == v.userId){
          this.configform.informName = v.nickName
          this.configform.informNumber = v.email
        }
      })
    },
    /** 新增短信按钮 */
    Addduanxin(){
      this.innerVisible = true
      this.configtitle = "新增短信"
      this.isshowduanxin = true
      this.isshowyoujian = false
      this.isshowguangbo = false
    },
    /** 修改短信按钮 */
    Editduanxin(row){
      console.log(row,'修改短信按钮')
      this.configform = row
      this.innerVisible = true
      this.configtitle = "修改短信"
      this.isshowduanxin = true
      this.isshowyoujian = false
      this.isshowguangbo = false
    },
    /** 删除短信按钮 */
    Deleteduanxin(row){
      const informIds = row.informDetailId;
      this.$confirm(
        '是否确认删除短信编号为"' + informIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
      .then(function() {
        return delWarningnoticeDetail(informIds);
      })
      .then(() => {
        this.getalarmConfigList();
        this.msgSuccess("删除成功");
      })
      .catch(function() {});
    },
    /** 新增邮件按钮 */
    Addyoujian(){
      this.innerVisible = true
      this.configtitle = "新增邮件"
      this.isshowduanxin = false
      this.isshowyoujian = true
      this.isshowguangbo = false
    },
    /** 修改邮件按钮 */
    Edityoujian(row){
      console.log(row,'修改邮件按钮')
      this.configform = row
      this.innerVisible = true
      this.configtitle = "修改邮件"
      this.isshowduanxin = false
      this.isshowyoujian = true
      this.isshowguangbo = false
    },
    /** 删除邮件按钮 */
    Deleteyoujian(row){
      const informIds = row.informDetailId;
      this.$confirm(
        '是否确认删除邮件编号为"' + informIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
      .then(function() {
        return delWarningnoticeDetail(informIds);
      })
      .then(() => {
        this.getalarmConfigList();
        this.msgSuccess("删除成功");
      })
      .catch(function() {});
    },
    /** 新增广播按钮 */
    Addguangbo(){
      this.innerVisible = true
      this.configtitle = "新增广播"
      this.isshowduanxin = false
      this.isshowyoujian = false
      this.isshowguangbo = true
    },
     // 音频上传成功
    handleReplaceAvatarSuccess(res, file, fileList) {
      // this.replaceList = URL.createObjectURL(file.raw);
      console.log(res,'-------------------------====================================',fileList)
      this.audioFlag = false;
      this.audioUploadPercent = 0;
      if(res.code == 200){
        this.configform.voiceUrl = process.env.VUE_APP_BASE_API + res.fileName;
        this.configform.voiceName = fileList[0].name;
        this.getalarmConfigList();
      }else{
        this.$message.error('视频上传失败，请重新上传！');
      }
    },
    //进度条
    uploadVideoProcess(event, file, fileList) {
        this.audioFlag = true;
        this.audioUploadPercent = file.percentage.toFixed(0) * 1;
    },


    /** 删除广播按钮 */
    Deleteguangbo(row){
       const informIds = row.informDetailId;
        this.$confirm(
          '是否确认删除广播编号为"' + informIds + '"的数据项?',
          "警告",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
        .then(function() {
          return delWarningnoticeDetail(informIds);
        })
        .then(() => {
          this.getalarmConfigList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    // 保存配置页面
    // saveTable(){
      // this.outerVisible = false
      // this.$refs["configform"].validate(valid => {
      //   if (valid) {
      //     console.log(this.configform)
      //     if (this.configform.informDetailId != undefined) {
      //       updateWarningnotice(this.configform).then(response => {
      //         if (response.code === 200) {
      //           this.msgSuccess("修改成功");
      //           this.innerVisible = false;
      //           this.getalarmConfigList();
      //         }
      //       });
      //     } else {
      //       addWarningnotice(this.configform).then(response => {
      //         console.log(response)
      //         // debugger
      //         if (response.code === 200) {
      //           this.msgSuccess("新增成功");
      //           this.innerVisible = false;
      //           this.getalarmConfigList();
      //         }
      //       });
      //     }
      //   }
      // });
    // },
    // 关闭配置页面
    cancelTable(){
      this.outerVisible = false
    },
    /** 保存短信，邮件新增修改按钮 */
    saveConfig(){
      if(this.configtitle == "新增短信"){
        this.$refs["configform"].validate(valid => {
        if (valid) {
            this.configform.informId = this.rowinformId
            this.configform.informType = "1"
            console.log(this.configform)
            addWarningnoticeDetail(this.configform).then(response => {
              console.log(response)
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.innerVisible = false;
                this.getalarmConfigList();
                this.resetDetail();
              }
            });
          }
        });
      }else if(this.configtitle == "修改短信"){
        this.$refs["configform"].validate(valid => {
          if (valid) {
            if(this.configform.informType == "短信"){
              this.configform.informType = "1"
            }
            if (this.configform.informDetailId != undefined) {
              updateWarningnoticeDetail(this.configform).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.innerVisible = false;
                  this.getalarmConfigList();
                  this.resetDetail();
                }
              });
            }
          }
        })
      }else if(this.configtitle == "新增邮件"){
        this.$refs["configform"].validate(valid => {
        if (valid) {
            this.configform.informId = this.rowinformId
            this.configform.informType = "2"
            addWarningnoticeDetail(this.configform).then(response => {
              console.log(response)
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.innerVisible = false;
                this.getalarmConfigList();
                  this.resetDetail();
              }
            });
          }
        });
      }else if(this.configtitle == "修改邮件"){
        this.$refs["configform"].validate(valid => {
          if (valid) {
            if(this.configform.informType == "邮件"){
              this.configform.informType = "2"
            }
            if (this.configform.informDetailId != undefined) {
              updateWarningnoticeDetail(this.configform).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.innerVisible = false;
                  this.getalarmConfigList();
                  this.resetDetail();
                }
              });
            }
          }
        })
      }else if(this.configtitle =="新增广播"){
        this.innerVisible = false;
        this.configform.informTitle = this.configform.voiceName;
        this.configform.informContent = this.configform.voiceUrl;
        console.log(this.configform,"广播参数")
        this.$refs["configform"].validate(valid => {
          if (valid) {
            this.configform.informId = this.rowinformId
            this.configform.informType = "3"
            addWarningnoticeDetail(this.configform).then(response => {
              console.log(response.data,'广播查询列表')
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.innerVisible = false;
                this.getalarmConfigList();
                this.resetDetail();
              }
            });
          }
        })
      }
    },

    /** 取消短信，邮件，广播按钮 */
    cancelConfig(){
      this.innerVisible = false
      this.resetDetail()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row,'------row');
      // this.reset();
      const informId = row.informId || this.ids;
      getWarningnotice(informId).then(response => {
        console.log(response.data,'-----修改');
        // var formip = response.data.broadIp;
        // response.data.ip = formip;
        // console.log(formip,'------broadip',response.data.ip);
        if(response.data.informBeginTime != null){
          this.timerangeval = [];
          this.timerangeval.push(response.data.informBeginTime);
          this.timerangeval.push(response.data.informEndTime);
          console.log(this.timerangeval);
        }
        if(response.data.areaId != ""){
          var queryform = {
            "areaId":response.data.areaId
          }
          listCamera(queryform).then(res => {
            // console.log(res,"智能感知终端下拉列表")
            this.shexiangtouoptions = res.rows;
          });
        }
        var queryforms = {
          "areaId":response.data.areaId,
          "cameraId":response.data.cameraId,
          "hasBroad":"1"
        }
        listCamera(queryforms).then(response => {
          // console.log(response,"语音ip下拉列表");
            this.yuyinoptions = response.rows;
          // if(response.rows.length > 0){
          //   this.yuyinoptions = response.rows;
          // }else if(response.rows.length == 0){
          //   this.yuyinoptions = []
          //   // this.form.cameraId = ""
          // }
        });
        this.form = response.data;
        console.log(this.form, '修改详情数据')
        this.open = true;
        this.title = "修改告警通知";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      console.log(this.form)
      // this.form.broadIp = this.form.ip;
      this.$refs["form"].validate(valid => {
        if (valid) {
          // console.log(this.form)
          if (this.form.informId != undefined) {
            updateWarningnotice(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addWarningnotice(this.form).then(response => {
              console.log(response)
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const informIds = row.informId || this.ids;
      this.$confirm(
        '是否确认删除告警通知编号为"' + informIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
      .then(function() {
        return delWarningnotice(informIds);
      })
      .then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
      .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有告警通知数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(function() {
        return exportWarningnotice(queryParams);
      })
      .then(response => {
        this.download(response.msg);
      })
      .catch(function() {});
    },
    // table里文字溢出省略样式
    textOverflow (row){
      if (row.columnIndex==7) {
        return 'table-textOverflow'
      }
    },
  },
  watch:{
    "form.areaId":"quyuChange",
    // "form.cameraId":"cameraChange",
    timerangeval(val){
      this.form.informBeginTime = val[0];
      this.form.informEndTime = val[1];
      console.log(val);
    }
  }
};
</script>
<style lang="scss" scoped>
.xinzeng{
  margin-bottom: 10px;
}
</style>
