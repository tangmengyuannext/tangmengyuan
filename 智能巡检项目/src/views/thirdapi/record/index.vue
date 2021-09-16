<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
        <el-form-item label="状态" prop="uploadStatus">
          <el-select v-model="queryParams.uploadStatus" clearable placeholder="请选择" style="width:100px">
            <el-option
              v-for="item in uploadStatusOptions"
              :key="item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="驶入时间">
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
        </el-form-item> -->
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery" >搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
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
    </el-row> -->

    <el-table v-loading="loading" :data="recordlist">
      <el-table-column label="机构名称" align="center" prop="deptName" />
      <el-table-column label="接口名称" align="center" prop="apiName" />
      <el-table-column label="上传内容" align="center" prop="content" />
      <el-table-column label="上传状态" align="center" prop="uploadStatus" :formatter="processRecordState"/>
      <el-table-column label="上传结果" align="center" prop="uploadResult" />
      <el-table-column label="记录时间" align="center" prop="recordTime" />
      <el-table-column label="上传耗时" align="center" prop="usedTime" />
      <el-table-column label="备注" align="center" prop="remark" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

  </div>
</template>

<script>

import { listRecord } from "@/api/thirdapi/record"

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
        // 表格数据
        recordlist: [],
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
            uploadStatus:undefined,
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
        uploadStatusOptions:[
          { label: '请选择', value: undefined }, 
          { label: '成功', value:'1'},
          { label: '失败', value:'2'}
        ]
    };
  },
  created() {
      this.getList();
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
    /** 处理记录状态 */
    processRecordState(row) {
      if (row.uploadStatus === '1') {
        return '成功'
      }
      if (row.uploadStatus === '2') {
        return '失败'
      }
      return '未知'
    },

    /** 查询车辆出入记录列表 */
    getList() {
      this.loading = true;
      console.log(this.queryParams);
      // console.log(this.enterTimeRange);
      // console.log(this.exitTimeRange);
      // if(this.enterTimeRange.length >0) {
      //   this.queryParams.enterBeginTime = this.enterTimeRange[0];
      //   this.queryParams.enterEndTime = this.enterTimeRange[1];
      // }
      // if(this.exitTimeRange.length >0) {
      //   this.queryParams.exitBeginTime = this.exitTimeRange[0];
      //   this.queryParams.exitEndTime = this.exitTimeRange[1];
      // }
      listRecord(this.queryParams).then(response => {
        console.log(response)
        this.recordlist = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 表单重置
    reset() {
      this.form = {
        // recordState:"0",
        // enterTimeRange: [],
        // exitTimeRange: []
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
