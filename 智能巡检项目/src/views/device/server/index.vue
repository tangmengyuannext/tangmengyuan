<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" :rules="queryParamsrules" label-width="90px">
      <el-form-item label="服务器编号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入服务器编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="服务器名称" prop="serverName">
        <el-input
          v-model="queryParams.serverName"
          placeholder="请输入服务器名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
            <el-option
              v-for="dict in devStatusOptions"
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
          v-hasPermi="['device:server:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['device:server:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['device:server:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['device:server:import']"
        >导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['device:server:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="serverList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="服务器ID" align="center" prop="serverId" />
      <!-- <el-table-column label="区域" align="center" prop="area.areaName" /> -->
      <el-table-column label="服务器名称" align="center" prop="serverName" />
      <el-table-column label="设备大类" align="center" prop="model.bigType" :formatter="bigTypeFormat"/>
      <el-table-column label="设备小类" align="center" prop="model.smallType" :formatter="smallTypeFormat"/>
      <el-table-column label="设备品牌" align="center" prop="model.brand" :formatter="brandFormat"/>
      <el-table-column label="设备型号" align="center" prop="model.modelName" />
      <el-table-column label="服务器编号" align="center" prop="code" />
      <el-table-column label="服务器IP" align="center" prop="ip" />
      <el-table-column label="所在位置" align="center" prop="location" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['device:server:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['device:server:remove']"
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

    <!-- 添加或修改服务器对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <!-- <el-form-item label="区域" prop="areaId">
          <treeselect v-model="form.areaId" :options="areaOptions" :normalizer="normalizer" placeholder="请选择区域" />
        </el-form-item>   -->
        <el-form-item label="服务器名称" prop="serverName">
          <el-input v-model="form.serverName" placeholder="请输入服务器名称" v-input-filter:special />
        </el-form-item>
        <el-form-item label="设备品牌">
          <el-select v-model="form.brand" placeholder="请选择设备品牌" @change="getModelList()">
            <el-option
              v-for="dict in brandOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号">
          <el-select v-model="form.modelId" placeholder="请选择设备型号">
            <el-option
              v-for="dict in modelOptions"
              :key="dict.modelId"
              :label="dict.modelName"
              :value="dict.modelId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务器编号" prop="code">
          <el-input v-model="form.code" placeholder="请输入服务器编号" />
        </el-form-item>
        <el-form-item label="所在位置" prop="location">
          <el-input v-model="form.location" placeholder="请输入所在位置" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 服务器导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
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
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的服务器数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listServer, getServer, delServer, addServer, updateServer, exportServer, importTemplate } from "@/api/device/server";
import { listArea } from "@/api/device/area";
import { listBrand } from "@/api/device/brand";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import VDistpicker from 'v-distpicker';

export default {
  name: "Server",
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
      // 设备品牌字典
      brandOptions: [],
      // 设备大类字典
      bigTypeOptions: [],
      // 设备小类字典
      smallTypeOptions: [],
      // 设备型号字典
      modelOptions: [],
      // 服务器表格数据
      serverList: [],
      // 区域树选项
      areaOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 用户导入参数
      upload: {
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
        url: process.env.VUE_APP_BASE_API + "/device/server/importData"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        areaId: undefined,
        serverName: undefined,
        deviceType: undefined,
        modelId: undefined,
        code: undefined,
        ip: undefined,
        location: undefined,
        status: undefined,
      },
      queryParamsrules:{
        code: [
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { pattern: /^[^\[\]\?\|\\]*$/, message: '不可以输入特殊符号' }
        ],
        serverName: [
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { pattern: /^[^\[\]\?\|\\]*$/, message: '不可以输入特殊符号' }
        ],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        serverName: [
          { required: true, message: '请输入服务器名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          // { pattern: /^[^\[\]\?\|\\]*$/, message: '不可以输入特殊符号' }
        ],
      }
    };
  },
  created() {
    this.getList();
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
    this.getModelList();
  },
  methods: {
    /** 查询服务器列表 */
    getList() {
      this.loading = true;
      listServer(this.queryParams).then(response => {
         response.rows.map((v)=>{
          if(v.model == null || v.model == undefined){
            v.model = {};
            v.model.bigType = undefined;
            v.model.brand = undefined;
            v.model.smallType = undefined;
          }
        })
        this.serverList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 设备型号下拉列表
    getModelList() {
      this.form.modelId = null;
      listBrand({brand:this.form.brand}).then(response => {
        this.modelOptions = response.rows;
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        serverId: undefined,
        areaId: undefined,
        serverName: undefined,
        deviceType: undefined,
        modelId: undefined,
        code: undefined,
        ip: undefined,
        location: undefined,
        status: "0",
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
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
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.serverId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
      this.open = true;
      this.title = "添加服务器";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      const serverId = row.serverId || this.ids
      getServer(serverId).then(response => {
        this.form = response.data;
        this.form.brand = response.data.model;
        this.open = true;
        this.title = "修改服务器";
      });
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
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.serverId != undefined) {
            updateServer(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addServer(this.form).then(response => {
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
      const serverIds = row.serverId || this.ids;
      this.$confirm('是否确认删除服务器编号为"' + serverIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delServer(serverIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有服务器数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportServer(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
     /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "服务器导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg);
      });
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
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>