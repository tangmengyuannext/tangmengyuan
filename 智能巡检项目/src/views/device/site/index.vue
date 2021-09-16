<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" :rules="queryParamsrules" label-width="68px">
      <el-form-item label="智能感知终端" prop="cameraId">
        <el-input
          v-model="queryParams.cameraId"
          placeholder="请输入智能感知终端"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="区域ID" prop="areaId">
        <el-select v-model="queryParams.areaId" placeholder="请选择区域ID" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="预置位停留时间" prop="duration">
        <el-input
          v-model="queryParams.duration"
          placeholder="请输入预置位停留时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
          v-input-filter:special
        />
      </el-form-item>
      <el-form-item label="预置位顺序编号" prop="sort">
        <el-input
          v-model="queryParams.sort"
          placeholder="请输入预置位顺序编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
          v-input-filter:special
        />
      </el-form-item>
      <!-- <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item> -->
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
          v-hasPermi="['device:site:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['device:site:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['device:site:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['device:site:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="siteList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="预置位ID" align="center" prop="siteId" />-->
      <el-table-column label="智能感知终端" align="center" prop="cameraId" />
      <el-table-column label="区域ID" align="center" prop="areaId" />
      <el-table-column label="预置位停留时间" align="center" prop="duration" />
      <el-table-column label="预置位顺序编号" align="center" prop="sort" />
      <!-- <el-table-column label="状态" align="center" prop="status" /> -->
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['device:site:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['device:site:remove']"
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

    <!-- 添加或修改预置位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="智能感知终端" prop="cameraId">
          <el-input v-model="form.cameraId" placeholder="请输入智能感知终端" />
        </el-form-item>
        <el-form-item label="区域ID">
          <el-select v-model="form.areaId" placeholder="请选择区域ID">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="预置位停留时间" prop="duration">
          <el-input v-model="form.duration" placeholder="请输入预置位停留时间" />
        </el-form-item>
        <el-form-item label="预置位顺序编号" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入预置位顺序编号" />
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSite, getSite, delSite, addSite, updateSite, exportSite } from "@/api/device/site";

export default {
  name: "Site",
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
      // 预置位表格数据
      siteList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cameraId: undefined,
        areaId: undefined,
        duration: undefined,
        sort: undefined,
        // status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      queryParamsrules: {
        cameraId:[
          // { required: true, message: '请输入摄像头ID', trigger: 'blur' },
          { min: 1, max: 19, message: '长度在 1 到 19 个字符', trigger: 'blur' },
          { pattern: '^\\d+$', message: '只可以输入数字' }
        ]
      },
      rules:{
        cameraId:[
          { required: true, message: '请输入摄像头ID', trigger: 'blur' },
          { min: 1, max: 19, message: '长度在 1 到 19 个字符', trigger: 'blur' },
          { pattern: '^\\d+$', message: '只可以输入数字' }
        ],
        duration:[
          // { required: true, message: '请输入区域ID', trigger: 'blur' },
          { min: 1, max: 19, message: '长度在 1 到 19 个字符', trigger: 'blur' },
          { pattern: '^\\d+$', message: '只可以输入数字' }
        ],
        sort:[
          // { required: true, message: '请输入区域ID', trigger: 'blur' },
          { min: 1, max: 19, message: '长度在 1 到 19 个字符', trigger: 'blur' },
          { pattern: '^\\d+$', message: '只可以输入数字' }
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询预置位列表 */
    getList() {
      this.loading = true;
      listSite(this.queryParams).then(response => {
        this.siteList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.form = undefined;
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        siteId: undefined,
        cameraId: undefined,
        areaId: undefined,
        duration: undefined,
        sort: undefined,
        // status: "0",
        // delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined
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
          console.log('error submit!!');
          return false;
        }
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
      this.$refs["queryForm"].resetFields();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.siteId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加预置位";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const siteId = row.siteId;
      getSite(siteId).then(response => {
        response.data.cameraId = response.data.cameraId.toString();
        this.form = response.data;
        console.log(this.form);
        this.open = true;
        this.title = "修改预置位";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.siteId != undefined) {
            updateSite(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addSite(this.form).then(response => {
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
      const siteIds = row.siteId || this.ids;
      this.$confirm('是否确认删除预置位编号为"' + siteIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSite(siteIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有预置位数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSite(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
