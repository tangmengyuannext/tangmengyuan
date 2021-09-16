<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" :rules="queryParamsrules" label-width="125px">
      <el-form-item label="终端名称" prop="cameraName">
        <el-input
          v-model="queryParams.cameraName"
          placeholder="请输入智能感知终端名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="终端IP" prop="ip">
        <el-input
          v-model="queryParams.ip"
          placeholder="请输入智能感知终端IP"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="终端类型" prop="smallType">
        <el-select v-model="queryParams.smallType" :clearable="true" placeholder="请选择智能感知终端类型">
          <el-option
            v-for="dict in smallTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属区域" prop="areaId">
        <treeselect v-model="queryParams.areaId" :options="areaOptions" :normalizer="normalizer" placeholder="请选择所属区域" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
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
          v-hasPermi="['device:camera:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['device:camera:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['device:camera:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['device:camera:import']"
        >导入终端</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['device:camera:export']"
        >导出终端</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImportSite"
          v-hasPermi="['device:site:import']"
        >导入预置位</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-download"
          size="mini"
          @click="handleExportSite"
          v-hasPermi="['device:site:export']"
        >导出预置位</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="cameraList" :cell-class-name="textOverflow" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center"/>
      <el-table-column label="ID" align="center" prop="cameraId" width="100"/>
      <el-table-column label="终端名称" align="center" width="120" prop="cameraName"/>
      <el-table-column label="终端IP" align="center" width="120"  prop="ip" />
      <!-- <el-table-column label="终端账号" align="center" width="120"  prop="username" />
      <el-table-column label="终端密码" align="center" width="120"  prop="password" />
      <el-table-column label="终端端口" align="center" width="120"  prop="port" /> -->
      <el-table-column label="所属区域" align="center" width="120"  prop="area.areaName" />
      <!-- <el-table-column label="终端品牌" align="center" width="120"  prop="model.brand" :formatter="brandFormat"/> -->
      <el-table-column label="终端型号" align="center" width="130"  prop="model.modelName" />
      <!-- <el-table-column label="设备大类" align="center" width="120"  prop="model.bigType" :formatter="bigTypeFormat"/> -->
      <el-table-column label="设备小类" align="center" width="120"  prop="model.smallType" :formatter="smallTypeFormat"/>
      <el-table-column label="位置分类" align="center" prop="locationType" :formatter="locationTypeFormat" />
      <el-table-column label="预置位" align="center" prop="hasSite" :formatter="isYesOrNoFormat"/>
      <el-table-column label="红外线" align="center" prop="hasInfrared" :formatter="isYesOrNoFormat"/>
      <el-table-column label="云台" align="center" prop="hasPtz" :formatter="isYesOrNoFormat"/>
      <el-table-column label="语音对讲" align="center" prop="hasTbk" :formatter="isYesOrNoFormat"/>
      <el-table-column label="接入NVR" align="center" prop="hasNvr" :formatter="isYesOrNoFormat"/>
      <el-table-column label="是否有广播" align="center" prop="hasBroad" :formatter="isYesOrNoFormat"/>
      <!-- <el-table-column label="绑定广播IP" align="center" width="120" prop="broadIp" /> -->
      <el-table-column label="所在位置" align="center" width="120" prop="location"/>
      <el-table-column label="备注" align="center" prop="remark" width="100"/>
      <!-- <el-table-column label="系统版本" align="center" prop="sdk" :formatter="sdkFormat" /> -->
      <!-- <el-table-column label="采集设备" align="center" prop="equipmentList" :show-overflow-tooltip="true"/> -->
      <!-- <el-table-column label="出入类型" align="center" prop="carStatus" /> -->
      <!-- hasBroad -->
      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            style="margin-bottom:10px"
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleConfig(scope.row)"
            v-hasPermi="['device:camera:config']"
          >配置</el-button>
          <el-button
            style="margin-bottom:10px"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handledetails(scope.row)"
            v-hasPermi="['device:camera:details']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['device:camera:edit']"
            style="margin-left: 0;"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['device:camera:remove']"
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

    <!-- 添加或修改智能感知终端对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" :modal-append-to-body="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="智能感知终端" prop="cameraName">
          <el-input v-model="form.cameraName" placeholder="请输入智能感知终端" :disabled="title == '智能感知终端详情' ? true : false" />
        </el-form-item>
        <el-form-item label="所属区域" prop="areaId">
          <treeselect v-model="form.areaId" :options="areaOptions" :disabled="title == '智能感知终端详情' ? true : false" :normalizer="normalizer" placeholder="请选择所属区域" />
        </el-form-item>
        <el-form-item label="智能感知终端品牌" prop="brand" >
          <el-select v-model="form.brand" placeholder="请选择智能感知终端品牌" :disabled="true" @change="getModelList()" clearable >
            <el-option
              v-for="dict in brandOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备大类" prop="bigType">
          <el-select v-model="form.bigType" placeholder="请选择设备大类" :disabled="true">
              <el-option
                v-for="dict in bigTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="设备小类" prop="smallType">
          <el-select v-model="form.smallType" placeholder="请选择设备小类" :disabled="true">
              <el-option
                v-for="dict in smallTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="智能感知终端型号" prop="modelId">
          <el-select v-model="form.modelId" placeholder="请选择智能感知终端型号" :disabled="title == '添加智能感知终端' ? false : true" clearable @change="changeModel">
            <el-option
              v-for="dict in modelOptions"
              :key="dict.modelId"
              :label="dict.modelName"
              :value="dict.modelId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="位置分类" prop="locationType">
          <el-select v-model="form.locationType" placeholder="请选择位置分类" :disabled="title == '智能感知终端详情' ? true : false" clearable>
            <el-option
              v-for="dict in locationTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="智能感知终端IP" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入智能感知终端IP" :disabled="title == '智能感知终端详情' ? true : false"/>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" placeholder="请输入账号" :disabled="title == '智能感知终端详情' ? true : false" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" :disabled="title == '智能感知终端详情' ? true : false" />
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input v-model="form.port" placeholder="请输入端口号" :disabled="title == '智能感知终端详情' ? true : false" />
        </el-form-item>
        <el-form-item label="是否有红外线" prop="hasInfrared" >
          <el-radio-group v-model="form.hasInfrared" :disabled="true">
            <el-radio
              v-for="dict in isYesOrNoOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否有预置位" prop="hasSite">
          <el-radio-group v-model="form.hasSite" :disabled="true">
            <el-radio
              v-for="dict in isYesOrNoOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否有云台控制" prop="hasPtz">
          <el-radio-group v-model="form.hasPtz" :disabled="true">
            <el-radio
              v-for="dict in isYesOrNoOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否有对讲功能" prop="hasTbk">
          <el-radio-group v-model="form.hasTbk" :disabled="title == '智能感知终端详情' ? true : false">
            <el-radio
              v-for="dict in isYesOrNoOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
         <el-form-item label="是否接入NVR" prop="hasNvr">
          <el-radio-group v-model="form.hasNvr" :disabled="title == '智能感知终端详情' ? true : false">
            <el-radio
              v-for="dict in isYesOrNoOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否可语音报警" prop="hasBroad">
          <el-radio-group v-model="form.hasBroad" :disabled="title == '智能感知终端详情' ? true : false" @change="ischangebroad">
            <el-radio
              v-for="dict in isYesOrNoOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联语音告警终端IP" prop="broadIp" v-if="isshowbroad">
          <el-input v-model="form.broadIp" placeholder="请输入语音告警终端IP" :disabled="true" />
        </el-form-item>
         <el-form-item label="关联语音告警终端IP" prop="broadIp" v-if="isshowbroads">
          <el-select v-model="form.broadIp" clearable filterable placeholder="请选择" :disabled="title == '智能感知终端详情' ? true : false">
            <el-option
              v-for="dict in yuyinoptions"
              :key="dict.ip"
              :label="dict.ip"
              :value="dict.ip"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所在位置" prop="location">
          <el-input v-model="form.location" placeholder="请输入所在位置" :disabled="title == '智能感知终端详情' ? true : false" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"  :disabled="title == '智能感知终端详情' ? true : false"/>
        </el-form-item>
        <!-- <el-form-item label="系统内部版本" prop="sdk">
          <el-select v-model="form.sdk" placeholder="请选择系统内部版本" :disabled="title == '智能感知终端详情' ? true : false" clearable>
            <el-option
              v-for="dict in sdkOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="出入类型" prop="carStatus">
          <el-select v-model="form.carStatus" placeholder="请选择出入类型" :disabled="title == '智能感知终端详情' ? true : false">
            <el-option
              v-for="dict in carStatusOptions"
              :key="dict.carStatus"
              :label="dict.carStatusName"
              :value="dict.carStatus"
            ></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 基础设置对话框 -->
    <el-dialog :title="basictitle" :visible.sync="basicopen" width="800px" :modal-append-to-body="false">
      <!-- <el-container>
        <el-aside class="elasides">
          <iframe ref="basiciframe" id="basiciframes" src="../../../imgbiaozhu/index.html" frameborder="0"
            style="height:400px;width:480px;z-index:-1;"></iframe>
        </el-aside>
        <el-main>

        </el-main>
      </el-container> -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="basicClick">保 存</el-button>
        <el-button @click="basicopen = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 算法设置对话框 -->
    <el-dialog :title="solvertitle" :visible.sync="solveropen" width="400px" :modal-append-to-body="false">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="solveropen = false">取 消</el-button>
        <el-button type="primary" @click="solveropen = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 智能感知终端导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" :modal-append-to-body="false">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的{{upload.title}}
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
        title="导入结果"
        :visible.sync="dialogVisible"
        width="700px"
        append-to-body>
        <pre v-for="(item, i) in importResult" :key="i">{{ item }}</pre>
      </el-dialog>

  </div>
</template>

<script>
import { listCamera, getCamera, delCamera, addCamera, updateCamera, exportCamera, importTemplate } from "@/api/device/camera";
import { listSite, getSite, delSite, addSite, updateSite, exportSite, importTemplateSite } from "@/api/device/site";
import { listRobot} from "@/api/device/robot";
import { listEquipmentunit } from "@/api/device/equipmentunit"; //查询采集设备
import { listArea } from "@/api/device/area";
import { listBrand } from "@/api/device/brand";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import VDistpicker from 'v-distpicker';


export default {
  name: "Camera",
  props: {
    isFanOrSheng: String,
  },
  components: { Treeselect, VDistpicker },
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
      // 设备状态字典
      devStatusOptions: [],
      // 智能感知终端品牌字典
      brandOptions: [],
      // 设备大类字典
      bigTypeOptions: [],
      // 设备小类字典
      smallTypeOptions: [],
      // 智能感知终端型号字典
      modelOptions: [],
      // 位置分类
      locationTypeOptions:[],
	  // 系统版本
      sdkOptions: [],
      // 语音告警列表
      yuyinoptions:[],
      // carStatusOptions:[
      //   {carStatus:"1",carStatusName:"出"},
      //   {carStatus:"0",carStatusName:"进"}
      // ],

      isshowbroad:false,
      isshowbroads:false,
      // 智能感知终端表格数据
      cameraList: [],
      // 区域树选项
      areaOptions: [],
      isYesOrNoOptions:[],
      locationTypeOptions: [],
      // 采集设备
      equipmentListOptions:[],
      equipmentdataList:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 基础设置标题
      basictitle:"",
      basicopen:false,
      // // 图像标注获取的xy值
      // basiczuobiao:[],
      // 算法设置标题
      solvertitle:"",
      solveropen:false,
      // 用户导入参数
      upload: {
        // 标识
        key: 'camera',
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/device/camera/importData"
      },
      dialogVisible: false,
      importResult: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        areaId: undefined,
        cameraName: undefined,
        ip: undefined,
        smallType: undefined,
        systemType:undefined
      },
      queryParamsrules:{
        cameraName: [
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { pattern: /^[^\[\]\?\|\\]*$/, message: '不可以输入特殊符号' }
        ]
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        areaId:[
           { required: true, message: '请选择区域', trigger: 'change' }
        ],
        cameraName:[
          { required: true, message: '请输入智能感知终端', trigger: 'blur' },
        ],
        // brand:[
        //   { required: true, message: '请输入品牌', trigger: 'change' },
        // ],
        modelId:[
          { required: true, message: '请输入型号', trigger: 'change' },
        ],
        locationType:[
          { required: true, message: '请输入位置类型', trigger: 'change' },
        ],
        ip:[
          { required: true, message: '请输入智能感知终端IP', trigger: 'blur' },
        ],
        username:[
          { required: true, message: '请输入智能感知终端账号', trigger: 'blur' },
        ],
        password:[
          { required: true, message: '请输入智能感知终端密码', trigger: 'blur' },
        ],
        port:[
          { required: true, message: '请输入智能感知终端端口号', trigger: 'blur' },
        ],
        // sdk:[
        //   { required: true, message: '请输入智能感知终端内部版本', trigger: 'blur' },
        // ],
        // hasSite:[
        //    { required: true, message: '请选择是否有预置位', trigger: 'change' }
        // ],
        // hasInfrared:[
        //    { required: true, message: '请选择是否有红外线', trigger: 'change' }
        // ],
        // hasPtz:[
        //    { required: true, message: '请选择是否云台控制', trigger: 'change' }
        // ],
        hasTbk:[
           { required: true, message: '请选择是否有对讲功能', trigger: 'change' }
        ],
        hasNvr:[
           { required: true, message: '请选择是否接入NVR', trigger: 'change' }
        ],
        hasBroad:[
           { required: true, message: '请选择是否有语音告警', trigger: 'change' }
        ],

      },
    };
  },
  created() {
      if(this.isFanOrSheng=='1')
      {
        // this.systemType ="fan";
        this.queryParams.systemType = "fan";
      }else{
          // this.systemType ="booster";
          this.queryParams.systemType = "booster";
      }
      console.log(this.systemType,"************",this.isFanOrSheng,"$$$$$$$$$$$",this.queryParams)
    this.getDicts("dev_state").then(response => {
      this.devStatusOptions = response.data;
    });
    this.getDicts("dev_brand").then(response => {
      this.brandOptions = response.data;
    });
    this.getDicts("dev_big_type").then(response => {
      this.bigTypeOptions = response.data;
    });
    this.getDicts("dev_small_type").then(response => {
      this.smallTypeOptions = response.data;
    });
    this.getDicts("dev_yes_no").then(response => {
      this.isYesOrNoOptions = response.data;
    });
    this.getDicts("model_type").then(response => {
      this.locationTypeOptions = response.data;
    });
	  this.getDicts("dev_camera_sdk").then(response => {
      this.sdkOptions = response.data;
    });
    this.getTreeselect();
    this.getModelList();
    this.getequipmentList();
    this.getList();
  },
  methods: {
    // table里文字溢出省略样式
    textOverflow (row){
      if (row.columnIndex==7) {
        return 'table-textOverflow'
      }
    },
    /** 转换区域数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.areaId,
        label: node.areaName,
        children: node.children
      };
    },
    /** 查询区域下拉树结构 */
    getTreeselect() {
      listArea().then(response => {
        this.areaOptions = this.handleTree(response.data, "areaId");
      });
    },

    // 设备大类字典翻译
    bigTypeFormat(row, column) {
      return row.model !== null ? this.selectDictLabel(this.bigTypeOptions, row.model.bigType) : null;
    },
    // 设备小类字典翻译
    smallTypeFormat(row, column) {
      return row.model !== null ? this.selectDictLabel(this.smallTypeOptions, row.model.smallType) : null;
    },
    // 品牌字典翻译
    brandFormat(row, column) {
      return row.model !== null ? this.selectDictLabel(this.brandOptions, row.model.brand) : null;
    },
    // 参数系统内置字典翻译
    isYesOrNoFormat(row, column) {
      return this.selectDictLabel(this.isYesOrNoOptions, row[column.property]);
    },
    // 品牌字典翻译
    locationTypeFormat(row, column) {
      return row.model !== null ? this.selectDictLabel(this.locationTypeOptions, row.locationType) : null;
    },
    // 品牌字典翻译
    sdkFormat(row, column) {
      return row.model !== null ? this.selectDictLabel(this.sdkOptions, row.sdk) : null;
    },
    // 品牌型号
    changeModel() {
      console.log(this.form.modelId)
      var o = this.modelOptions.filter(e => {if(e.modelId == this.form.modelId) return e})[0]
      if(o) {
        this.form.brand = o.brand
        this.form.bigType = o.bigType
        this.form.smallType = o.smallType
        this.form.hasSite = o.hasSite
        this.form.hasInfrared = o.hasInfrared
        this.form.hasPtz = o.hasPtz
      }
   },

    /** 查询智能感知终端列表 */
    getList() {
      this.loading = true;
      listCamera(this.queryParams).then(response => {
        this.cameraList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 智能感知终端型号下拉列表
    getModelList() {
      this.form.modelId = null;
      listBrand({brand:this.form.brand}).then(response => {
        this.modelOptions = response.rows;
      });
    },
    // 查询采集设备
    getequipmentList(){
      listEquipmentunit().then(response => {
        console.log(response,'查询采集设备列表');
        this.equipmentdataList = response.rows;
      });
    },
    changeAreaId(val) {
      this.selectequipment(val)
      this.getyuyinoptions()
    },
    selectequipment(val){
      console.log(val);
      var filterparam = {
        "areaId":val
      }
      if(val != undefined){
        listEquipmentunit(filterparam).then(response => {
          console.log(response,'通过areaId查询采集设备列表');
          if(response.rows.length > 0){
            this.equipmentListOptions = response.rows;
          }else if(response.rows == 0){
          //   this.$message({
          //     message: '此区域下无采集设备',
          //     type: 'warning'
          //   });
          }
        });
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        cameraId: undefined,
        areaId: undefined,
        cameraName: undefined,
        deviceType: undefined,
        modelId: undefined,
        hasSite: undefined,
        hasBroad: undefined,
        ip: undefined,
        location: undefined,
        carStatus: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        equipmentList:undefined,
        broadIp:undefined,
        locationType: undefined,
        // 显示字段
        brand: undefined,
        bigType: undefined,
        smallType: undefined,
        hasInfrared: undefined,
        hasPtz: undefined,
      };
      this.isshowbroads = false;
      this.isshowbroad = false;
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.$refs["queryForm"].validate((valid) => {
        if (valid) {
          this.queryParams.pageNum = 1;
          this.getList();
        } else {
          return false;
        }
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
      // this.$refs["queryForm"].resetFields();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.cameraId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 配置按钮操作 */
    handleConfig(row){
      console.log("row======",row,row.model.bigType == "6");
      if(row.model.bigType == "6"){
        listRobot().then(response => {
          console.log(row.robotId,"++++++++v=",response.rows);
          let isRobot=response.rows.filter(v=>row.cameraId === v.cameraId);
          if(!!isRobot.length){
            row.robotId = isRobot[0].robotId;
            console.log(row.robotId,"hkhkkkhkhhkhkhk+++++有值+++=",isRobot);
            this.$router.push({
              path:'/videomonitoring/videos',
              query:{
                data:row.equipmentList,
                cameraip:row.ip,
                cameraport:row.port,
                camerauser:row.username,
                camerapassword:row.password,
                ishassite:row.hasSite,
                ishasInfrared:row.hasInfrared,
                cameraId:row.cameraId,
                areaId:row.areaId,
                cameraName:row.cameraName,
                ishasnvr:row.hasNvr,
                ishasPtz:row.hasPtz,
                robotId:row.robotId
              }
            });
          }else{
            console.log("hkhkkkhkhhkhkhk++++无值++++=else",isRobot);
            this.$message({
              message: '此摄像头未与机器人关联',
              type: 'warning'
            });
          }

          // response.rows.map((v)=>{
          //   if(row.cameraId === v.cameraId){
          //     console.log(v);
          //     row.robotId = v.robotId;
          //     this.$router.push({
          //       path:'/videomonitoring/videos',
          //       query:{
          //         data:row.equipmentList,
          //         cameraip:row.ip,
          //         cameraport:row.port,
          //         camerauser:row.username,
          //         camerapassword:row.password,
          //         ishassite:row.hasSite,
          //         ishasInfrared:row.hasInfrared,
          //         cameraId:row.cameraId,
          //         areaId:row.areaId,
          //         cameraName:row.cameraName,
          //         ishasnvr:row.hasNvr,
          //         ishasPtz:row.hasPtz,
          //         robotId:row.robotId
          //       }
          //     })
          //   // }else{
          //   //   this.$message({
          //   //     message: '此摄像头未与机器人关联',
          //   //     type: 'warning'
          //   //   });
          //   }
          // })
        });
      }else if(row.model.bigType != "6"){
        this.$router.push({
          path:'/videomonitoring/videos',
          query:{
            data:row.equipmentList,
            cameraip:row.ip,
            cameraport:row.port,
            camerauser:row.username,
            camerapassword:row.password,
            ishassite:row.hasSite,
            ishasInfrared:row.hasInfrared,
            cameraId:row.cameraId,
            areaId:row.areaId,
            cameraName:row.cameraName,
            ishasnvr:row.hasNvr,
            ishasPtz:row.hasPtz
          }
        })
      }
    },
    /** 详情按钮操作 */
    handledetails(row) {
      this.reset();
      this.getTreeselect();
      const cameraId = row.cameraId || this.ids
      getCamera(cameraId).then(response => {
        if(response.data.areaId != ""){
          var filterparam = {
            "areaId":response.data.areaId
          }
          listEquipmentunit(filterparam).then(response => {
            console.log(response,'通过areaId查询采集设备列表');
            this.equipmentListOptions = response.rows;
          });
        }
        if(response.data.equipmentList != null){
          var nums = response.data.equipmentList.split(',')
          nums.forEach((item,index) =>{
            nums[index] = parseInt(nums[index])
          })
          response.data.equipmentList = nums;
        }else if(response.data.equipmentList == null){
          response.data.equipmentList = undefined;
        }
        // console.log(response.data.equipmentList,'response.data.equipmentList',this.form.equipmentList);
        // 通过判断是否有语音告警显示隐藏广播IP
        if(response.data.hasBroad == "1"){
          this.isshowbroad = false;
          this.isshowbroads = false;
          if(response.data.broadIp == null){
            response.data.broadIp = response.data.ip;
          }
        }else if(response.data.hasBroad == "0"){
          this.form.broadIp = "";
          this.isshowbroad = false;
          this.isshowbroads = true;
        }
        this.form = response.data;
        // this.form.brand = response.data.model;
        this.form.brand = response.data.model.brand;
        this.form.bigType = response.data.model.bigType;
        this.getyuyinoptions()

        this.open = true;
        this.title = "智能感知终端详情";
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
      this.open = true;
      this.title = "添加智能感知终端";
    },
    ischangebroad(val){
      console.log(val);
      console.log('this.form.hasBroad',this.form.hasBroad);
      val = this.form.hasBroad
      if(val == 1){
        this.isshowbroad = false;
        this.isshowbroads = false;
        this.form.broadIp = this.form.ip;
      }else if(val == 0){
        this.form.broadIp = "";
        this.isshowbroads = true;
        this.isshowbroad = false;
        // this.yuyinoptions = [];
      }
    },
    getyuyinoptions(){
      let param = {
        "areaId":this.form.areaId?this.form.areaId:0,
        "cameraId":this.form.cameraId,
        "hasBroad":"1"
      }
      listCamera(param).then(response => {
        console.log(response,"语音ip下拉列表")
        if(response.rows.length > 0){
          this.yuyinoptions = response.rows;
        }else if(response.rows.length == 0){
          this.yuyinoptions = []
        }
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      const cameraId = row.cameraId || this.ids;
      getCamera(cameraId).then(response => {
        console.log(response.data,'---------0000');
        if(response.data.areaId != ""){
          var filterparam = {
            "areaId":response.data.areaId
          }
          listEquipmentunit(filterparam).then(response => {
            console.log(response,'通过areaId查询采集设备列表');
            this.equipmentListOptions = response.rows;
          });
        }
        // console.log(response.data.equipmentList,'---response.data.equipmentList')
        if(response.data.equipmentList != null){
          var nums = response.data.equipmentList.split(',')
          nums.forEach((item,index) =>{
            nums[index] = parseInt(nums[index])
          })
          response.data.equipmentList = nums;
        }else if(response.data.equipmentList == null){
          response.data.equipmentList = undefined;
        }
        // console.log(response.data.equipmentList,'response.data.equipmentList',this.form.equipmentList);
        // 通过判断是否有语音告警显示隐藏广播IP
        if(response.data.hasBroad == "1"){
          this.isshowbroad = false;
          this.isshowbroads = false;
          if(response.data.broadIp == null){
            response.data.broadIp = response.data.ip;
          }
        }else if(response.data.hasBroad == "0"){
          this.form.broadIp = "";
          this.isshowbroad = false;
          this.isshowbroads = true;
        }
        this.form = response.data;
        // this.form.brand = response.data.model;
        this.form.brand = response.data.model.brand;
        this.form.bigType = response.data.model.bigType;
        this.getyuyinoptions()

        this.open = true;
        this.title = "修改智能感知终端";
      });
    },

    /** 提交按钮 */
    submitForm: function() {
      console.log(this.form.equipmentList);
      this.$refs["form"].validate(valid => {
        console.log(this.form);
        if (valid) {
          if(this.form.equipmentList == undefined || this.form.equipmentList == null){
            this.form.equipmentList = undefined;
          }else if(this.form.equipmentList.length > 0){
            this.form.equipmentList = this.form.equipmentList.join(',');
          }else if(this.form.equipmentList.length == 0){
            this.form.equipmentList = undefined;
          }
          if (this.form.cameraId != undefined) {
            updateCamera(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addCamera(this.form).then(response => {
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
      const cameraIds = row.cameraId || this.ids;
      this.$confirm('是否确认删除智能感知终端ID为"' + cameraIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCamera(cameraIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 基础设置按钮操作 */
    handleBasicsetting(){
      this.basicopen = true
      this.basictitle = "基础设置"
    },
    /** 基础设置保存操作 */
    basicClick(){
      this.basicopen = false;
    },
    /** 算法设置 */
    handleSolveroption(){
      alert('2222')
      this.solveropen = true
      this.solvertitle = "算法设置"
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有智能感知终端数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCamera(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
     /** 导入按钮操作 */
    handleImport() {
      this.upload.key = 'camera'
      this.upload.title = "智能感知终端导入";
      this.upload.open = true;
    },
    /** 导出按钮操作 */
    handleExportSite() {
      // const queryParams = this.queryParams;
      const systemTypeParams = {};
      if(this.isFanOrSheng=='1')
      {
        systemTypeParams.systemType = "fan";

      }else{

        systemTypeParams.systemType = "booster";
      }
      this.$confirm('是否确认导出所有预置位数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSite(systemTypeParams);
          // return exportSite();
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
     /** 导入按钮操作 */
    handleImportSite() {
      this.upload.key = 'site'
      this.upload.title = "预置位导入";
      this.upload.url = process.env.VUE_APP_BASE_API + "/device/site/importData"
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      if(this.upload.key == 'camera') {
        importTemplate().then(response => {
          this.download(response.msg);
        });
      } else if(this.upload.key == 'site') {
        importTemplateSite().then(response => {
          this.download(response.msg);
        });
      }

    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      var res = response.msg;
      this.importResult = res.split("<br/>")
      this.dialogVisible = true
      // this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  },
  watch:{
    "form.areaId":"changeAreaId",
  }
};
</script>
<style lang="scss">
.vue-treeselect__control {
    display: table-cell;
}
</style>


