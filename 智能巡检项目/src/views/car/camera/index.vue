<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="100px"
      :rules="queryParamsrules"
    >
      <el-form-item label="名称" prop="cameraName">
        <el-input
          type="text"
          v-model="queryParams.cameraName"
          placeholder="请输入"
          size="small"
          maxlength="32"
        ></el-input>
      </el-form-item>
      <el-form-item label="IP" prop="ip">
        <el-input
          type="text"
          v-model="queryParams.ip"
          placeholder="请输入"
          size="small"
          maxlength="16"
        ></el-input>
      </el-form-item>
      <el-form-item label="出入类型" prop="carStatus">
        <el-select
          v-model="queryParams.carStatus"
          clearable
          filterable
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in carStatusOptions"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="carCameralist"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        label="车辆识别设备名称"
        align="center"
        prop="cameraName"
      />
      <el-table-column label="IP" align="center" prop="ip" />
      <el-table-column label="出入类型" align="center" prop="carStatus" />
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetails(scope.row)"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleUpdate(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 车辆摄像头信息详情和编辑对话框-->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="名称" prop="cameraName">
          <el-input
            type="text"
            v-model="form.cameraName"
            :disabled="detailFlag"
            maxlength="32"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input
            type="text"
            v-model="form.ip"
            :disabled="detailFlag"
            maxlength="16"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item label="出入类型" prop="carStatus">
          <el-select
            v-model="form.carStatus"
            clearable
            filterable
            :disabled="detailFlag"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in carStatusOptions"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
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
import {
  listCarCamera,
  getCarCamera,
  addCarCamera,
  updateCarCamera,
  delCarCamera,
} from "@/api/car/camera";

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
      carCameralist: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: "updateTime desc",
        isAsc: "",
        cameraName: "",
        ip: "",
      },
      carStatusKV: {
        1: "入",
        2: "出",
      },
      carStatusOptions: [
        { value: "1", label: "入" },
        { value: "2", label: "出" },
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        cameraName: [
          { required: true, message: "请输入设备名称", trigger: "blur" },
        ],
        carStatus: [
          { required: true, message: "请选择出入类型", trigger: "change" },
        ],
      },
      detailFlag: false,
      queryParamsrules: {
        carNumber: [
          { pattern: /^[^\[\]\?\|\\]*$/, message: "不可以输入特殊符号" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    window.addEventListener("message", function (e) {
      console.log(e.data.data, "-------data");
    });
  },
  methods: {
    /** 查询车辆摄像头信息列表 */
    getList() {
      this.loading = true;
      console.log(this.queryParams);
      listCarCamera(this.queryParams).then((response) => {
        response.rows.map((v) => {
          v.carStatus = this.carStatusKV[v.carStatus];
        });
        this.carCameralist = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 表单重置
    reset() {
      this.form = {
        cameraName: "",
        ip: "",
        carStatus: undefined,
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
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.faceId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 详情按钮操作 */
    handleDetails(row) {
      console.log(row);
      this.reset();
      this.detailFlag = true;
      const cameraId = row.cameraId;
      //修改参数值用于页面展示
      getCarCamera(cameraId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "车辆识别设备详情";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row);
      this.reset();
      this.detailFlag = false;
      const cameraId = row.cameraId;
      getCarCamera(cameraId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "编辑车辆识别设备";
        this.issuccess = false;
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.detailFlag = false;
      this.title = "新增车辆识别设备";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          console.log(this.form);
          if (this.detailFlag) {
            this.open = false;
            this.reset();
          } else {
            if (this.form.cameraId != undefined) {
              updateCarCamera(this.form).then((response) => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addCarCamera(this.form).then((response) => {
                console.log(response);
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
      const cameraId = row.cameraId;
      this.$confirm("是否确认删除选择的车辆识别设备数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delCarCamera(cameraId);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
  },
  watch: {},
};
</script>
