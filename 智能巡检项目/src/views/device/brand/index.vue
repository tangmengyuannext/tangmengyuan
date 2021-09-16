<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" :rules="queryParamsrules" label-width="110px">
      <el-form-item label="设备型号名称" prop="modelName">
        <el-input
          v-model="queryParams.modelName"
          placeholder="请输入设备型号名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备品牌名称" prop="brand">
        <el-select v-model="queryParams.brand" clearable placeholder="请选择">
          <el-option
            v-for="dict in brandOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
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
          v-hasPermi="['device:brand:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['device:brand:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['device:brand:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5" v-if="false">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['device:brand:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="brandList" :cell-class-name="textOverflow" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" />
      <!-- <el-table-column label="设备型号ID" align="center" prop="modelId" /> -->
      <!-- <el-table-column label="设备型号标识" align="center" width='120' prop="modelCode" /> -->
      <el-table-column label="设备型号" align="center" width='120' prop="modelName" />
      <el-table-column label="设备品牌" align="center" prop="brand" :formatter="brandFormat"/>
      <el-table-column label="设备大类" align="center" width='120' prop="bigType" :formatter="bigTypeFormat" />
      <el-table-column label="设备小类" align="center" width='130' prop="smallType"  :formatter="smallTypeFormat"/>
      <el-table-column label="是否有预置位" align="center" prop="hasSite" :formatter="isYesOrNoFormat"/>
      <el-table-column label="是否有红外线" align="center" prop="hasInfrared" :formatter="isYesOrNoFormat"/>
      <el-table-column label="是否有云台" align="center" prop="hasPtz" :formatter="isYesOrNoFormat"/>
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['device:brand:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['device:brand:remove']"
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

    <!-- 添加或修改设备品牌型号对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <!-- <el-form-item label="设备型号" prop="modelCode">
          <el-input v-model="form.modelCode" placeholder="请输入设备型号名称" />
        </el-form-item> -->
        <el-form-item label="设备型号" prop="modelName">
          <el-input v-model="form.modelName" placeholder="请输入设备型号名称" />
        </el-form-item>
        <el-form-item label="设备品牌" prop="brand">
          <el-select v-model="form.brand" placeholder="请选择">
              <el-option
                v-for="dict in brandOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="设备大类" prop="bigType">
          <el-select v-model="form.bigType" placeholder="请选择">
              <el-option
                v-for="dict in bigTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="设备小类" prop="smallType">
          <el-select v-model="form.smallType" placeholder="请选择">
              <el-option
                v-for="dict in smallTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="是否有预置位" prop="hasSite">
          <el-radio-group v-model="form.hasSite">
            <el-radio
              v-for="dict in isYesOrNoOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否有红外线" prop="hasInfrared">
          <el-radio-group v-model="form.hasInfrared" >
            <el-radio
              v-for="dict in isYesOrNoOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否有云台控制" prop="hasPtz">
          <el-radio-group v-model="form.hasPtz" >
            <el-radio
              v-for="dict in isYesOrNoOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBrand, getBrand, delBrand, addBrand, updateBrand, exportBrand } from "@/api/device/brand";

export default {
  name: "Brand",
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
      // 设备品牌型号表格数据
      brandList: [],
      // 品牌字典
      brandOptions: [],
      // 设备大类字典
      bigTypeOptions: [],
      // 设备小类字典
      smallTypeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        modelName: undefined,
        brand: undefined,
      },
      queryParamsrules:{
        modelName: [
          // { required: true, message: '请输入设备型号名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { pattern: /^[^\[\]\?\|\\]*$/, message: '不可以输入特殊符号' }
        ],
        brand: [
          // { required: true, message: '请输入设备品牌名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { pattern: /^[^\[\]\?\|\\]*$/, message: '不可以输入特殊符号' }
        ],
      },
      // 表单参数
      form: {},
      isYesOrNoOptions:[],
      // 表单校验
      rules: {
        modelCode: [
          { required: true, message: '请输入设备型号', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { pattern: /^[^\[\]\?\|\\]*$/, message: '不可以输入特殊符号' }
        ],
        modelName: [
          { required: true, message: '请输入设备型号名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { pattern: /^[^\[\]\?\|\\]*$/, message: '不可以输入特殊符号' }
        ],
        remark: [
          { min: 0, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' },
        ],
        hasSite:[
          { required: true, message: '请选择是否有预置位', trigger: 'change' }
        ],
        hasInfrared:[
          { required: true, message: '请选择是否有红外线', trigger: 'change' }
        ],
        hasPtz:[
          { required: true, message: '请选择是否有云台控制', trigger: 'change' }
        ],
      }
    };
  },
  watch: {
    // 根据名称筛选部门树
    'form.brand': {
        handler (val) {           
          this.brandOptions.find((item)=>{
              if(item.dictValue == val){
                  this.form.brandName =item.dictLabel;
              }
          });
        }  
    }
  },
  created() {
    this.getList();
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
  },
  methods: {
    /** 查询设备品牌型号列表 */
    getList() {
      this.loading = true;
      listBrand(this.queryParams).then(response => {
        this.brandList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 参数系统内置字典翻译
    isYesOrNoFormat(row, column) {
      return this.selectDictLabel(this.isYesOrNoOptions, row[column.property]);
    },
    // 设备大类字典翻译
    bigTypeFormat(row, column) {
      return this.selectDictLabel(this.bigTypeOptions, row.bigType);
    },
    // 设备小类字典翻译
    smallTypeFormat(row, column) {
      return this.selectDictLabel(this.smallTypeOptions, row.smallType);
    },
    // 品牌字典翻译
    brandFormat(row, column) {
      return this.selectDictLabel(this.brandOptions, row.brand);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        modelId: undefined,
        modelName: undefined,
        modelCode: undefined,
        bigType: undefined,
        smallType: undefined,
        brand: undefined,
        hasSite: undefined,
        hasInfrared: undefined,
        hasPtz: undefined,
        status: "0",
        delFlag: undefined,
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
      this.ids = selection.map(item => item.modelId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加设备品牌型号";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const modelId = row.modelId || this.ids
      getBrand(modelId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备品牌型号";
      });
    },
    // table里文字溢出省略样式
    textOverflow (row){
      if (row.columnIndex==7) {
        return 'table-textOverflow'
      }
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.modelId != undefined) {
            updateBrand(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addBrand(this.form).then(response => {
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
      const modelIds = row.modelId || this.ids;
      this.$confirm('是否确认删除设备品牌型号编号为"' + modelIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBrand(modelIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有设备品牌型号数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportBrand(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }

};
</script>