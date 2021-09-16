<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
        <el-form-item label="事件编号" prop="lineName">
            <el-input v-model="queryParams.lineName" placeholder="请输入事件编号" clearable size="small" 
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="设备名称" prop="lineName">
            <el-input v-model="queryParams.lineName" placeholder="请输入设备名称" clearable size="small" 
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="设备类型" prop="alarmType">
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
        <el-form-item label="故障类型" prop="alarmType">
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
          v-hasPermi="['operations:networkdiagnosis:scheduling']"
        >调度</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['operations:networkdiagnosis:remove']"
        >删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleAlgorithm"
        >算法设置</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['operations:networkdiagnosis:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="listHistory" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="告警规则ID" align="center" prop="ruleId" /> -->
      <el-table-column label="事件编号" align="center" prop="ruleNo">
        <template slot-scope="scope">
            <router-link tag="a" to="">
                <span @click="handleDetail(scope.row)">{{scope.row.ruleNo}}</span>
            </router-link>
        </template>

      </el-table-column>
      <el-table-column label="事件名称" align="center" prop="alarmType" />
       <el-table-column label="设备编号" align="center" prop="defectId" />
       <el-table-column label="设备名称" align="center" prop="defectId" />
       <el-table-column label="设备类型" align="center" prop="defectId" />
       <el-table-column label="故障类型" align="center" prop="defectId" />
       <el-table-column label="设备品牌" align="center" prop="defectName" />
      <el-table-column label="设备IP" align="center" prop="endTime" />
      <el-table-column label="创建时间" align="center" prop="isPostpostion" />
      <el-table-column label="处理时间" align="center" prop="conditionA" />
      <el-table-column label="处理人" align="center" prop="conditionB" />
      <el-table-column label="处理状态" align="center" prop="isStartA" />
      <!-- <el-table-column label="操作" align="center" fixed="right" width="130">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['operations:networkdiagnosis:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['operations:networkdiagnosis:remove']"
          >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

  <!-- 添加或修改告警配置
    对话框-->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-form-item prop="alarmPictrueUrl">
                <el-avatar shape="square" style="width:300px;height:200px;" :size="100" fit="fill" :src="form.alarmPictrueUrl"></el-avatar>
            </el-form-item>
            <el-form-item label="告警类型" prop="alarmType">
                <el-input v-model="form.alarmType" placeholder="请输入历史告警名称" :disabled="formDisabled"/>
            </el-form-item>
            <el-form-item label="预置位ID" prop="siteId">
                <el-input v-model="form.siteId" placeholder="请输入预置位ID" :disabled="formDisabled"/>
            </el-form-item>
            <el-form-item label="最早发生时间" prop="earliestTime">
                <el-input v-model="form.earliestTime" placeholder="请输入最早发生时间" :disabled="formDisabled"/>
            </el-form-item>
            <el-form-item label="重复次数" prop="alarmNum">
                <el-input v-model="form.alarmNum" placeholder="请输入重复次数" :disabled="formDisabled"/>
            </el-form-item>
            <el-form-item label="状态" prop="disposeStatus">
                <el-input v-model="form.disposeStatus" placeholder="请输入状态" :disabled="formDisabled"/>
            </el-form-item>
        </el-form> 
        <div slot="footer" class="dialog-footer">
            <!-- <el-button type="primary" @click="submitForm">处 理</el-button> -->
            <el-button @click="cancel">关 闭</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { listConfiguration, getConfiguration, delConfiguration, addConfiguration, updateConfiguration, exportConfiguration } from "@/api/alarm/configuration"

// import { getDicts } from "@/api/system/dict/data"
// import {listDefect} from "@/api/device/defect"


export default {
  // name: "Line",
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
      // 告警配置表格数据
      listHistory: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        alarmType: undefined,
        defectId: undefined,
      },
      // 表单参数
      form: {},
      formDisabled:true,
      // 表单校验
      rules: {
        alarmType: [
          { required: true, message: '请选择告警类型', trigger: 'change' }
        ],
        defectId: [
          { required: true, message: '请选择设备缺陷', trigger: 'change' }
        ],
      },
      // 告警/规则类型 下拉列表
      gaojintypeoptions: [],
      //设备缺陷
      gaojingsuanfaoptions:[],
      //  阀值条件
      conditionlist:[
        {condition:"gt",conditionName:"大于"},
        {condition:"lt",conditionName:"小于"},
        {condition:"eq",conditionName:"等于"}
      ],
      // 阀值单位
      unitlist:[
        {unit:"gt",unitName:"大于"},
        {unit:"lt",unitName:"小于"},
        {unit:"eq",unitName:"等于"}
      ],
      // 告警级别
      gaojingleveloptions:[],
      // 后置动作状态
      isPostpostionlist:[],
      isStartA:false,
      isStartB:false,
      fazhiA:true,
      fazhiB:true
    };
  },
  created() {
    // this.getalarmtypelist();
    // this.getdefectlist();
    // this.getalarmlevellist();
    // this.getisPostpostionlist();
  },
  mounted(){
    this.getList();
  },
  methods: {
    /** 查询告警配置
列表 */
    getList() {
      this.loading = true;
    //   console.log(this.queryParams)
    //   listConfiguration(this.queryParams).then(response => {
    //     console.log(response)
    //     response.rows.map((v)=>{
    //       // 告警类型
    //       if(v.alarmType == "1"){
    //         v.alarmType = "视频识别"
    //       }else if(v.alarmType == "2"){
    //         v.alarmType = "温度"
    //       } 
    //       // 设备缺陷
    //       this.gaojingsuanfaoptions.map((y)=>{
    //         if(v.defectId == y.defectId){
    //           v.defectName = y.defectName
    //         }
    //       })
    //       // 阀值条件
    //       if(v.conditionA == "lt"){
    //         v.conditionA = "小于"
    //       }else if(v.conditionA == "gt"){
    //         v.conditionA = "大于"
    //       }else if(v.conditionA == "eq"){
    //         v.conditionA = "等于"
    //       }
    //       if(v.conditionB == "lt"){
    //         v.conditionB = "小于"
    //       }else if(v.conditionB == "gt"){
    //         v.conditionB = "大于"
    //       }else if(v.conditionB == "eq"){
    //         v.conditionB = "等于"
    //       }
    //       // 阀值单位
    //       if(v.unitA == "lt"){
    //         v.unitA = "小于"
    //       }else if(v.unitA == "gt"){
    //         v.unitA = "大于"
    //       }else if(v.unitA == "eq"){
    //         v.unitA = "等于"
    //       }
    //       if(v.unitB == "lt"){
    //         v.unitB = "小于"
    //       }else if(v.unitB == "gt"){
    //         v.unitB = "大于"
    //       }else if(v.unitB == "eq"){
    //         v.unitB = "等于"
    //       }
    //       // 阀值启用
    //       if(v.isStartA == "1"){
    //         v.isStartA = "是"
    //       }else if(v.isStartA == "0"){
    //         v.isStartA = "否"
    //       } 
    //       if(v.isStartB == "1"){
    //         v.isStartB = "是"
    //       }else if(v.isStartB == "0"){
    //         v.isStartB = "否"
    //       } 
    //       // 后置动作状态
    //       if(v.isPostpostion == "1"){
    //         v.isPostpostion = "已处理"
    //       }else if(v.isPostpostion == "0"){
    //         v.isPostpostion = "未处理"
    //       }else if(v.isPostpostion == "3"){
    //         v.isPostpostion = "自动恢复"
    //       }
    //       // 告警级别
    //       if(v.levelA == "1"){
    //         v.levelA = "严重告警"
    //       }else if(v.levelA == "2"){
    //         v.levelA = "主要告警"
    //       }else if(v.levelA == "3"){
    //         v.levelA = "次要告警"
    //       }else if(v.levelA == "4"){
    //         v.levelA = "警告告警"
    //       }else if(v.levelA == "5"){
    //         v.levelA = "告警消息"
    //       }else if(v.levelA == "6"){
    //         v.levelA = "恢复告警"
    //       }
    //       if(v.levelB == "1"){
    //         v.levelB = "严重告警"
    //       }else if(v.levelB == "2"){
    //         v.levelB = "主要告警"
    //       }else if(v.levelB == "3"){
    //         v.levelB = "次要告警"
    //       }else if(v.levelB == "4"){
    //         v.levelB = "警告告警"
    //       }else if(v.levelB == "5"){
    //         v.levelB = "告警消息"
    //       }else if(v.levelB == "6"){
    //         v.levelB = "恢复告警"
    //       }
    //     })
    //     this.listHistory = response.rows;
    //     this.total = response.total;
        this.loading = false;
    //   });
    },
    // 告警类型下拉列表
    // getalarmtypelist() {
    //   getDicts("alarm_type").then(response => {
    //     console.log(response,"告警类型下拉列表")
    //     this.gaojintypeoptions = response.data;
    //   });
    // },
     // 设备缺陷下拉列表
    // getdefectlist() {
    //   listDefect().then(response => {
    //     console.log(response,"设备缺陷下拉列表")
    //     this.gaojingsuanfaoptions = response.rows;
    //   });
    // },
    //  // 告警级别下拉列表
    // getalarmlevellist() {
    //   getDicts("alarm_level").then(response => {
    //     console.log(response,"告警级别下拉列表")
    //     this.gaojingleveloptions = response.data;
    //   });
    // },
    //  // 后置动作状态下拉列表
    // getisPostpostionlist() {
    //   getDicts("alarm_dispose_status").then(response => {
    //     console.log(response,'后置动作状态下拉列表')
    //     this.isPostpostionlist = response.data;
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
        alarmtype:undefined,//告警类型
        conditionA: undefined, //阀值条件
        conditionB: undefined,
        // createBy: undefined,  //创建者
        // createTime: undefined,
        defectId: undefined,  //缺陷id
        isPostpostion: undefined, // 
        isStartA: false, //阀值启用
        isStartB: false,
        levelA: undefined,  //告警级别
        levelB: undefined,
        numA: 0,  //重复次数
        numB: 0,
        // ruleId: 0,  //告警规则id
        ruleNo: undefined,  //告警规则编号
        searchValue: undefined,  //
        timeA: undefined,  // 阀值时间
        timeB: undefined,
        unitA: undefined,  //阀值单位
        unitB: undefined,
        updateBy: undefined, //
        updateTime: undefined,
        valueA: undefined,  //起始值
        valueB: undefined,
        remark: undefined,  //备注
      };
      this.resetForm("form");
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
      this.ids = selection.map(item => item.ruleId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
    //   this.reset();
    //   this.open = true;
    //   this.form.isStartA = false
    //   this.form.isStartB = false
    //   this.title = "添加告警配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
    //   this.reset();
    //   const ruleId = row.ruleId || this.ids;
    //   getConfiguration(ruleId).then(response => {
    //     if(response.data.isStartA == 1){
    //       this.isStartA = true
    //     }else if(response.data.isStartA == 0){
    //       this.isStartA = false
    //     }
    //     if(response.data.isStartB == 1){
    //       this.isStartB = true
    //     }else if(response.data.isStartB == 0){
    //       this.isStartB = false
    //     }
    //     console.log(response.data)
    //     console.log(response.data.isStartA,response.data.isStartB)
    //     this.form = response.data;
    //     this.open = true;
    //     this.title = "修改告警配置";
    //   });
    },
    /** 提交按钮 */
    submitForm: function() {
    //   this.$refs["form"].validate(valid => {
    //     if (valid) {
    //       if(this.form.isStartA == false){
    //         this.form.isStartA = "0"
    //       }
    //       if(this.form.isStartB == false){
    //         this.form.isStartB = "0"
    //       }
    //       console.log(this.form)
    //       if (this.form.ruleId != undefined) {
    //         updateConfiguration(this.form).then(response => {
    //           if (response.code === 200) {
    //             this.msgSuccess("修改成功");
    //             this.open = false;
    //             this.getList();
    //           }
    //         });
    //       } else {
    //         addConfiguration(this.form).then(response => {
    //           console.log(response)
    //           // debugger
    //           if (response.code === 200) {
    //             this.msgSuccess("新增成功");
    //             this.open = false;
    //             this.getList();
    //           }
    //         });
    //       }
    //     }
    //   });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
    //   const ruleIds = row.ruleId || this.ids;
    //   this.$confirm(
    //     '是否确认删除告警配置编号为"' + ruleIds + '"的数据项?',
    //     "警告",
    //     {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     }
    //   )
    //   .then(function() {
    //     return delConfiguration(ruleIds);
    //   })
    //   .then(() => {
    //     this.getList();
    //     this.msgSuccess("删除成功");
    //   })
    //   .catch(function() {});
    },
    /** 算法设置 */
    handleAlgorithm(){

    },
    /** 导出按钮操作 */
    handleExport() {
    //   const queryParams = this.queryParams;
    //   this.$confirm("是否确认导出所有告警配置数据项?", "警告", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    // .then(function() {
    //     return exportConfiguration(queryParams);
    // }) 
    // .then(response => {
    //     this.download(response.msg);
    // })
    // .catch(function() {});
    }
  },
  watch: {
    isStartA(val){
      if(val == true){
        this.fazhiA = false
        val = "1"
      }else if(val == false){
        this.fazhiA = true
        val = "0"
      }
      this.form.isStartA = val
    },
    isStartB(value){
      if(value == true){
        this.fazhiB = false
        value = "1"
      }else{
        this.fazhiB = true
        value = "0"
      }
      this.form.isStartB = value
    }
  }
};
</script>