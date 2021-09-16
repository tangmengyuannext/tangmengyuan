<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px" :rules="queryParamsrules">
        <el-form-item label="车牌号" prop="carNumber">
          <el-input type="text" v-model="queryParams.carNumber" placeholder="请输入" size="small" maxlength="8"></el-input>
          <el-input id="hiddenText" type="text" style="display:none" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" v-hasPermi="['car:info:query']" @click="handleQuery">搜索</el-button>
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
          v-hasPermi="['car:info:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['car:info:export']"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="carInfolist" @selection-change="handleSelectionChange">
      <el-table-column label="车牌号" align="center" prop="carNumber" />
      <el-table-column label="所有人" align="center" prop="ownerName" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetails(scope.row)"
            v-hasPermi="['car:info:query']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['car:info:query']"
          >编辑</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['car:info:remove']"
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

    <!-- 车辆信息详情和编辑对话框-->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="车牌号" prop="carNumber">
          <el-input type="text" v-model="form.carNumber" :disabled="detailFlag"  maxlength="8" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="所有人" prop="ownerName">
          <el-input type="text" v-model="form.ownerName" :disabled="detailFlag" maxlength="32" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="text" v-model="form.remark" :disabled="detailFlag" maxlength="127" style="width:400px"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确认</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { listCarInfo, getCarInfo, addCarInfo, updateCarInfo, delCarInfo, exportCarInfo } from "@/api/car/info"
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
        carInfolist: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
            pageNum: 1,
            pageSize: 10,
            orderByColumn: 'updateTime desc',
            isAsc: '',
            carNumber:"",

        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          carNumber :[{required: true, message: '请输入车牌号', trigger: 'blur'}]
        },
        detailFlag:false,
        queryParamsrules: {
          carNumber: [
            { pattern: /^[^\[\]\?\|\\]*$/, message: '不可以输入特殊符号' }
          ]
        },
    };
  },
  created() {
      this.getList();
  },
  mounted(){
    window.addEventListener("message",function(e){
      console.log(e.data.data,'-------data');
    })
  },
  methods: {
    /** 查询车辆信息列表 */
    getList() {
      this.loading = true;
      console.log(this.queryParams)
      listCarInfo(this.queryParams).then(response => {
        console.log(response)
        this.carInfolist = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 表单重置
    reset() {
      this.form = {
        carNumber:""
      };
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
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.faceId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 详情按钮操作 */
    handleDetails(row) {
      console.log(row);
      this.reset();
      this.detailFlag = true;
      const carId = row.carId;
      //修改参数值用于页面展示
      getCarInfo(carId).then(response => {
        this.form = response.data;
        //this.form.recognizeImgUrl = 'http://' + this.imgIp + '/' + row.recognizeImgUrl;
        //this.srcList = [];
        //this.srcList.push(this.form.recognizeImgUrl);
        //console.log("recognizeImgUrl:" + this.form.recognizeImgUrl);
        this.open = true;
        this.title = "车辆信息详情";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row);
      this.reset();
      this.detailFlag = false;
      const carId = row.carId;
      getCarInfo(carId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "编辑车辆";
        this.issuccess = false;
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.detailFlag = false;
      this.title = "新增车辆";
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          console.log(this.form)
          if(this.detailFlag) {
            this.open = false;
            this.reset();
          } else {
            if (this.form.carId != undefined) {
              updateCarInfo(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
                addCarInfo(this.form).then(response => {
                  console.log(response)
                  if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                  }
                });
            }
          }
        }
      });
    },
    /** 取消按钮操作 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const carId = row.carId;
      this.$confirm(
        '是否确认删除选择的车辆信息数据?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
      .then(function() {
        return delCarInfo(carId);
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
      this.$confirm('是否确认导出所有车辆信息', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return exportCarInfo(queryParams)
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
