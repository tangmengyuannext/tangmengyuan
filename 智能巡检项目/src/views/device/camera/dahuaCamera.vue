<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" :rules="queryParamsrules" label-width="125px">
      <el-form-item label="终端名称" prop="cameraName">
        <el-input
          v-model="queryParams.cameraName"
          placeholder="请输入外部终端名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="终端IP" prop="ip">
        <el-input
          v-model="queryParams.ip"
          placeholder="请输入外部终端IP"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="dhList" :cell-class-name="textOverflow" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center"/>
      <el-table-column label="ID" align="center" width="50" prop="cameraId"/>
      <el-table-column label="终端名称" align="center" prop="cameraName"/>
      <el-table-column label="终端IP" align="center" prop="ip" />
      <el-table-column label="终端账号" align="center" prop="username" />
      <el-table-column label="终端密码" align="center" prop="password" />
      <el-table-column label="终端端口" align="center" prop="port" />
      <el-table-column label="所属区域" align="center" prop="area.areaName" />
      <el-table-column label="所在位置" align="center" prop="location"/>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            style="margin-bottom:10px"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handledetails(scope.row)"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            style="margin-left: 0;"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getDHList"
    />

    <!-- 添加或修改智能感知终端对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" :modal-append-to-body="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="智能感知终端" prop="cameraName">
          <el-input v-model="form.cameraName" placeholder="请输入外部终端" :disabled="title == '外部终端详情' ? true : false" />
        </el-form-item>
        <el-form-item label="所属区域" prop="areaId">
          <treeselect v-model="form.areaId" :options="areaOptions" :disabled="title == '外部终端详情' ? true : false" :normalizer="normalizer" placeholder="请选择所属区域" />
        </el-form-item>
        <el-form-item label="智能感知终端IP" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入外部终端IP" :disabled="title == '外部终端详情' ? true : false"/>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" placeholder="请输入账号" :disabled="title == '外部终端详情' ? true : false" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" :disabled="title == '外部终端详情' ? true : false" />
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input v-model="form.port" placeholder="请输入端口号" :disabled="title == '外部终端详情' ? true : false" />
        </el-form-item>
        <el-form-item label="所在位置" prop="location">
          <el-input v-model="form.location" placeholder="请输入所在位置" :disabled="title == '外部终端详情' ? true : false" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"  :disabled="title == '外部终端详情' ? true : false"/>
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
import { listDHCamera, updateDHCamera, addDHCamera, dhCameraDetails, deleteDHCamera } from "@/api/device/dahuaCamera"
import { listArea } from "@/api/device/area";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";


export default {
  name: "Camera",
  components: { Treeselect },
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
      // 位置分类
      locationTypeOptions:[],
      // 智能感知终端表格数据
      cameraList: [],
      // 区域树选项
      areaOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      dialogVisible: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        areaId: undefined,
        cameraName: undefined,
        ip: undefined,
      },
      queryParamsrules:{
        cameraName: [
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { pattern: /^[^\[\]\?\|\\]*$/, message: '不可以输入特殊符号' }
        ]
      },
      // 表单参数
      form: {
        cameraName: '',
        areaId: '',
        ip: '',
        username: '',
        password: '',
        port: '',
        location: '',
        remark: ''
      },
      // 表单校验
      rules: {
        areaId:[
           { required: true, message: '请选择区域', trigger: 'change' }
        ],
        cameraName:[
          { required: true, message: '请输入外部终端', trigger: 'blur' },
        ],
        ip:[
          { required: true, message: '请输入外部终端IP', trigger: 'blur' },
        ],
        username:[
          { required: true, message: '请输入外部终端账号', trigger: 'blur' },
        ],
        password:[
          { required: true, message: '请输入外部终端密码', trigger: 'blur' },
        ],
        port:[
          { required: true, message: '请输入外部终端端口号', trigger: 'blur' },
        ],
      },
      dhList: []
    };
  },
  created() {
    this.getDHList()
    this.getTreeselect() // 获取区域下拉框
  },
  methods: {
    // 获取大华摄像头列表
    getDHList() {
      const self = this
      listDHCamera(this.queryParams).then((response) => {
        self.dhList = response.rows
        self.total = response.total
        self.loading = false;
      })
    },
    // 查看详情
    handledetails(row) {
      // this.form = row
      const cameraId = row.cameraId
      const self = this
      dhCameraDetails(cameraId).then((response) => {
        self.form = response.data
        self.title = '外部终端详情'
        self.open = true
      })
    },
    // 点击修改
    handleUpdate(row) {
      const cameraId = row.cameraId || this.ids;
      const self = this
      dhCameraDetails(cameraId).then((response) => {
        self.form = response.data
      })
      this.title = '修改外部终端'
      this.open = true
    },
    // 提交按钮
    submitForm: function() {
      const self = this
      this.$refs['form'].validate(valid => {
        if (self.form.cameraId) { // 修改
          updateDHCamera(self.form).then((response) => {
            if (response.code === 200) {
              self.msgSuccess("修改成功")
              self.open = false
              self.getDHList()
            }
          })
        } else { // 新增
          addDHCamera(self.form).then((response) => {
            if (response.code === 200) {
              self.msgSuccess("新增成功");
              self.open = false;
              self.getDHList();
            }
          })
        }
      });
    },
    // 新增按钮操作
    handleAdd() {
      this.reset();
      // this.getTreeselect();
      this.open = true;
      this.title = "添加外部终端";
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
      this.resetForm("form");
    },
    // 删除按钮操作
    handleDelete(row) {
      const cameraIds = row.cameraId || this.ids
      const self = this
      this.$confirm('是否确认删除外部终端ID为"' + cameraIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return deleteDHCamera(cameraIds)
        }).then(() => {
          self.getDHList()
          self.msgSuccess("删除成功")
        }).catch(function() {})
    },
    // 搜索按钮操作
    handleQuery() {
      const self = this
      this.$refs['queryForm'].validate((valid) => {
        if (valid) {
          self.queryParams.pageNum = 1;
          self.getDHList();
        } else {
          return false;
        }
      })
    },
    // 查询区域下拉树结构
    getTreeselect() {
      const self = this
      listArea().then(response => {
        self.areaOptions = self.handleTree(response.data, "areaId");
      });
    },
    // 转换区域数据结构
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // table里文字溢出省略样式
    textOverflow (row){
      if (row.columnIndex==7) {
        return 'table-textOverflow'
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
      // this.$refs["queryForm"].resetFields();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.cameraId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
  },
};
</script>
<style lang="scss">
.vue-treeselect__control {
    display: table-cell;
}
</style>
