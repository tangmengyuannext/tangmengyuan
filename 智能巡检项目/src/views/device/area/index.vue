<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" :rules="queryParamsrules">
      <el-form-item label="区域名称" prop="areaName">
        <el-input
          v-model="queryParams.areaName"
          placeholder="请输入区域名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
        <!-- v-input-filter:special -->
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" placeholder="区域状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['device:area:add']"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="areaList"
      row-key="areaId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="areaName" label="区域名称" width="200"></el-table-column>
      <el-table-column prop="areaType" label="区域类型" width="100" :formatter="areaTypeFormat"></el-table-column>
      <el-table-column prop="systemType" label="区域分类" width="200" align="center" :formatter="systemTypeFormat"></el-table-column>
      <el-table-column prop="orderNum" label="排序" width="100"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="statusFormat" width="100"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button 
            size="mini" 
            type="text" 
            icon="el-icon-edit" 
            @click="handleUpdate(scope.row)"
            v-hasPermi="['device:area:edit']"
          >修改</el-button>
          <el-button 
            size="mini" 
            type="text" 
            icon="el-icon-plus" 
            @click="handleAdd(scope.row)"
            v-hasPermi="['device:area:add']"
          >新增</el-button>
          <el-button
            :disabled="scope.row.parentId == 0 && scope.row.children.length !== 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['device:area:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改区域对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级区域" prop="parentId">
              <treeselect v-model="form.parentId" :options="areaOptions" :normalizer="normalizer" placeholder="选择上级区域" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="区域名称" prop="areaName">
              <el-input v-model="form.areaName" placeholder="请输入区域名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="区域类型" prop="areaType">
              <el-select v-model="form.areaType" clearable placeholder="请选择区域类型">
                <el-option
                  v-for="dict in areaTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="区域状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备所属系统" prop="systemType">
              <el-select v-model="form.systemType" clearable placeholder="请选择设备所属系统">
                <el-option
                  v-for="dict in systemTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listArea, getArea, delArea, addArea, updateArea, listAreaExcludeChild } from "@/api/device/area";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Area",
  components: { Treeselect },
  data() {
    var validateAcquaintance = (rule, value, callback) => {
    　　if (value > 9999) {
    　　　　callback(new Error('排序最多四位'))
    　　} else {
    　　　　callback()
    　　}
    }
    return {
      // 遮罩层
      loading: true,
      // 表格树数据
      areaList: [],
      // 区域树选项
      areaOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 区域类型数据字典
      areaTypeOptions: [],
      // 查询参数
      queryParams: {
        areaName: undefined,
        status: undefined
      },
      // 设备所属系统数据字典
      systemTypeOptions: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级区域不能为空", trigger: "blur" }
        ],
        areaName: [
          { required: true, message: "区域名称不能为空", trigger: "blur" }
        ],
        areaType: [
          { required: true, message: "区域类型不能为空", trigger: "change" },
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" },
          { validator: validateAcquaintance, trigger: 'blur' } // 自定义验证 
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        systemType:[
          {required: true, message: "所属系统不能为空", trigger: "blur" }
        ]
      },
      queryForm: {
        areaName: ''
      },
      queryParamsrules: {
        areaName: [
          { pattern: /^[^\[\]\?\|\\]*$/, message: '不可以输入特殊符号' }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("dev_area_type").then(response => {
      this.areaTypeOptions = response.data;
    });
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("dev_system_type").then(response => {
      this.systemTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询区域列表 */
    getList() {
      this.loading = true;
      listArea(this.queryParams).then(response => {
        this.areaList = this.handleTree(response.data, "areaId");
        this.loading = false;
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
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 区域类型字典翻译
    areaTypeFormat(row, column) {
      return this.selectDictLabel(this.areaTypeOptions, row.areaType);
    },
    // 设备所属系统字典翻译
    systemTypeFormat(row, column) {
      return this.selectDictLabel(this.systemTypeOptions, row.systemType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        areaId: undefined,
        parentId: undefined,
        areaType: undefined,
        areaName: undefined,
        orderNum: undefined,
        leader: undefined,
        phone: undefined,
        email: undefined,
        status: "0"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.$refs["queryForm"].validate((valid) => {
        if (valid) {
          this.getList();
        } else {
          return false;
        }
      })
    },
        /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.areaName = undefined;
      this.queryParams.status = undefined;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != undefined) {
        this.form.parentId = row.areaId;
      }
      this.open = true;
      this.title = "添加区域";
      // listArea().then(response => {
      //     this.areaOptions = this.handleTree(response.data, "areaId");
      // });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getArea(row.areaId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改区域";
      });
      // listAreaExcludeChild(row.areaId).then(response => {
      //     this.areaOptions = this.handleTree(response.data, "areaId");
      // });
    },
    /** 查询区域下拉树结构 */
    getTreeselect() {
      listArea().then(response => {
        this.areaOptions = [];
        const data = { areaId: 0, areaName: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "areaId", "parentId");
        this.areaOptions.push(data);
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.areaId != undefined) {
            updateArea(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addArea(this.form).then(response => {
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
      this.$confirm('是否确认删除名称为"' + row.areaName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delArea(row.areaId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  }
};
</script>