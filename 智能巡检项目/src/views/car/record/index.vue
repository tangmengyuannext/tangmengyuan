<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
        <el-form-item label="状态" prop="recordState">
          <el-select v-model="queryParams.recordState" clearable placeholder="请选择" style="width:100px">
            <el-option
              v-for="item in recordStateOptions"
              :key="item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="驶入时间">
          <el-date-picker
            v-model="enterTimeRange"
            size="small"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            ></el-date-picker>
        </el-form-item>
        <el-form-item label="驶出时间">
          <el-date-picker
            v-model="exitTimeRange"
            size="small"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            ></el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery" >搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['car:record:export']"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="carrecordlist" @selection-change="handleSelectionChange">
      <el-table-column label="车牌号" align="center" prop="carNumber" />
      <el-table-column label="类别" align="center" prop="carType" />
      <el-table-column label="驶入时间" align="center" prop="enterTime" />
      <el-table-column label="驶出时间" align="center" prop="exitTime" />
      <el-table-column label="停留时间" align="center" prop="parkTime" />
      <el-table-column label="状态" align="center" prop="recordState" :formatter="processRecordState" />
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetails(scope.row)"
            v-hasPermi="['car:record:query']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['car:record:remove']"
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

    <!-- 车辆记录详情对话框-->
    <el-dialog :title="title" :visible.sync="open" width="750px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="车牌号" prop="carNumber">
          <el-input type="text" v-model="form.carNumber" disabled style="width:500px"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="carType">
          <el-input type="text" v-model="form.carType" disabled style="width:500px"></el-input>
        </el-form-item>
        <el-form-item label="驶入时间" prop="enterTime">
          <el-input type="text" v-model="form.enterTime" disabled style="width:500px"></el-input>
        </el-form-item>
        <el-form-item label="驶出时间" prop="exitTime">
          <el-input type="text" v-model="form.exitTime" disabled style="width:500px"></el-input>
        </el-form-item>
        <el-form-item label="停留时间" prop="parkTime">
          <el-input type="text" v-model="form.parkTime" disabled style="width:500px"></el-input>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="驶入照片" prop="enterImgUrl">
            <el-image style="width:200px;height:150px;" fit="fill" :preview-src-list="srcList"
                    :src="form.enterImgUrl"></el-image>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="驶出照片" prop="exitImgUrl">
            <el-image style="width:200px;height:150px;" fit="fill" :preview-src-list="srcList"
                    :src="form.exitImgUrl"></el-image>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { listCarRecord,getCarRecord,delCarRecord,exportCarRecord } from "@/api/car/record"
import { getConfigKey } from '@/api/system/config' //全局IP地址和摄像头账户密码
import { getToken } from '@/utils/auth';

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
        // 照片识别表格数据
        carrecordlist: [],
        // 日期范围，驶入时间，驶出时间
        enterTimeRange: [],
        exitTimeRange: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
            pageNum: 1,
            pageSize: 10,
            recordState:undefined,
            enterBeginTime: '',
            enterEndTime: '',
            exitBeginTime: '',
            exitEndTime: ''
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {

        },
        imgIp: '',
        srcList: [],
        propaddress:"",
        recordStateOptions:[
          { label: '请选择', value: undefined }, 
          { label: '未驶出', value:'1'},
          { label: '已驶出', value:'2'},
          { label: '异常', value:'3'}
        ]
    };
  },
  created() {
      this.getList();
      this.getIp();
  },
  mounted(){
    this.propaddress = undefined;
    window.addEventListener("message",function(e){
      console.log(e.data.data,'-------data');
    })
  },
  methods: {
    /** 设置表头颜色 */
    headClass () {
      return 'text-align: center;background:#d4eaf5;'
    },
    /** 获取服务器ip */
    getIp() {
      getConfigKey('server.fdfs.ip').then(response => {
        console.log('response',response)
        this.imgIp = response.msg
      })
    },
    /** 处理记录状态 */
    processRecordState(row) {
      if (row.recordState === '1') {
        row.recordStateDescription = '未驶出'
        return '未驶出'
      }
      if (row.recordState === '2') {
        row.recordStateDescription = '已驶出'
        return '已驶出'
      }
      if (row.recordState === '3') {
        row.recordStateDescription = '异常'
        return '异常'
      }
      return '未知'
    },
    /** 处理人员名称 */
    processName(row) {
      if (row.recognizeName === 'none' || row.recognizeName === 'Not Found') {
        return ''
      }
      return row.recognizeName
    },

    /** 查询车辆出入记录列表 */
    getList() {
      this.loading = true;
      console.log(this.queryParams);
      console.log(this.enterTimeRange);
      console.log(this.exitTimeRange);
      if(this.enterTimeRange.length >0) {
        this.queryParams.enterBeginTime = this.enterTimeRange[0];
        this.queryParams.enterEndTime = this.enterTimeRange[1];
      }
      if(this.exitTimeRange.length >0) {
        this.queryParams.exitBeginTime = this.exitTimeRange[0];
        this.queryParams.exitEndTime = this.exitTimeRange[1];
      }
      listCarRecord(this.queryParams).then(response => {
        console.log(response)
        this.carrecordlist = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 表单重置
    reset() {
      this.form = {
        // recordState:"0",
        enterTimeRange: [],
        exitTimeRange: []
      };
      this.resetForm("queryForm");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.recordState = undefined;
      this.queryParams.enterBeginTime = '';
      this.queryParams.enterEndTime = '';
      this.queryParams.exitBeginTime = '';
      this.queryParams.exitEndTime = '';
      this.form.recordState = undefined;
      this.enterTimeRange = [];
      this.exitTimeRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.carRecordId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    changeRecordState(val) {
      this.queryParams.recordState = this.form.recordState;
    },
    /** 详情按钮操作 */
    handleDetails(row) {
      console.log(row);
      // this.reset();
      const carRecordId = row.carRecordId;
      //修改参数值用于页面展示
      getCarRecord(carRecordId).then(response => {
        this.form = response.data;
        this.form.enterImgUrl = 'http://' + this.imgIp + '/' + row.enterImgUrl;
        this.form.exitImgUrl = 'http://' + this.imgIp + '/' + row.exitImgUrl;
        this.srcList = [];
        this.srcList.push(this.form.enterImgUrl);
        this.srcList.push(this.form.exitImgUrl);
        console.log("enterImgUrl:" + this.form.enterImgUrl);
        console.log("exitImgUrl:" + this.form.exitImgUrl);
        this.open = true;
        this.title = "车辆出入记录详情";
      });
    },
    /** 取消按钮操作 */
    cancel() {
      this.open = false;
      // this.reset();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const carRecordId = row.carRecordId || this.ids;
      this.$confirm(
        '是否确认删除选择的车辆出入记录数据?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
      .then(function() {
        return delCarRecord(carRecordId);
      })
      .then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
      .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有车辆出入记录信息', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return exportCarRecord(queryParams)
        })
        .then(response => {
           this.download(response.msg)
        })
        .catch(function() {
        })
    }
  },
  watch: {

  }
};
</script>
