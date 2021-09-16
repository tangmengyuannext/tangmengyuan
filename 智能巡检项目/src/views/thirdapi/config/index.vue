<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="参数名称" prop="configName">
        <el-input
          type="text"
          v-model="queryParams.configName"
          placeholder="请输入"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="参数键名" prop="configKey">
        <el-input
          type="text"
          v-model="queryParams.configKey"
          placeholder="请输入"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="启用状态" prop="configStatus">
        <el-select
          v-model="queryParams.configStatus"
          clearable
          filterable
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in configStatusOptions"
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

    <el-table v-loading="loading" :data="configlist" @selection-change="handleSelectionChange">
      <el-table-column label="参数名称" align="center" prop="configName"/>
      <el-table-column label="参数键名" align="center" prop="configKey" />
      <el-table-column label="参数键值" align="center" prop="configValue" />
      <el-table-column label="启用状态" align="center" prop="configStatus" :formatter="processConfigStatus"/>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" width="200">
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

    <!-- 详情和编辑对话框-->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="参数名称" prop="configName">
          <el-input
            type="text"
            v-model="form.configName"
            disabled
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item label="参数键名" prop="configKey">
          <el-input
            type="text"
            v-model="form.configKey"
            disabled
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item label="参数键值" prop="configValue">
          <el-input
            type="text"
            v-model="form.configValue"
            :disabled="detailFlag"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item label="启用状态" prop="configStatus">
          <el-select
            v-model="form.configStatus"
            clearable
            filterable
            :disabled="detailFlag"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in configStatusOptions"
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

import { listConfig, getConfig, updateConfig } from "@/api/thirdapi/record"

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
      configlist: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        configName: undefined,
        configValue: undefined,
        configStatus: undefined
      },
      configStatusOptions: [
        { value: "1", label: "启用" },
        { value: "2", label: "禁用" },
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        configValue: [
          { required: true, message: "请输入系统参数键值", trigger: "blur" },
        ],
        configStatus: [
          { required: true, message: "请选择启用状态", trigger: "change" },
        ],
      },
      detailFlag: false,
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
      listConfig(this.queryParams).then((response) => {
        this.configlist = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 处理启用状态 */
    processConfigStatus(row) {
      if (row.configStatus === '1') {
        return '启用'
      }
      if (row.configStatus === '2') {
        return '禁用'
      }
      return '未知'
    },
    // 表单重置
    reset() {
      this.form = {
        configName: "",
        configValue: "",
        configStatus: undefined,
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
      const configId = row.configId;
      //修改参数值用于页面展示
      getConfig(configId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "系统参数详情";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row);
      this.reset();
      this.detailFlag = false;
      const configId = row.configId;
      getConfig(configId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "编辑系统参数";
        this.issuccess = false;
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.detailFlag = false;
      this.title = "新增系统参数";
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
            if (this.form.configId != undefined) {
              updateConfig(this.form).then((response) => {
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
  },
  watch: {},
};
</script>
