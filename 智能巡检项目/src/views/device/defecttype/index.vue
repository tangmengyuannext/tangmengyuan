<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
      <el-form-item label="缺陷类型名称" prop="defectTypeName">
        <el-input v-model="queryParams.defectTypeName" placeholder="请输入缺陷类型名称" clearable size="small"
         @keyup.enter.native="handleQuery" v-input-filter:special/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="缺陷类型状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
            @keyup.enter.native="handleQuery"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
         v-hasPermi="['device:defecttype:add']">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="defecttypeList"
      row-key="defectTypeId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="defectTypeName" label="缺陷类型名称"></el-table-column>
      <el-table-column prop="orderNum" label="排序"></el-table-column>
      <el-table-column prop="defectTypeLabel" label="缺陷类型标识"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="statusFormat"></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['device:defecttype:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['device:defecttype:add']"
          >新增</el-button>
          <el-button
            :disabled="scope.row.parentId == 0 && scope.row.children.length !== 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['device:defecttype:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改缺陷类型对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <!-- <el-col :span="24"> -->
            <el-form-item label="上级缺陷类型" prop="parentId">
              <treeselect v-model="form.parentId" :options="defecttypeOptions" :normalizer="normalizer" placeholder="选择上级缺陷类型" />
            </el-form-item>
          <!-- </el-col> -->
          <!-- <el-col :span="12"> -->
            <el-form-item label="缺陷类型名称" prop="defectTypeName">
              <el-input v-model="form.defectTypeName" placeholder="请输入缺陷类型名称" />
            </el-form-item>
          <!-- </el-col> -->
          <!-- <el-col :span="12"> -->
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" />
            </el-form-item>
          <!-- </el-col> -->
            <el-form-item label="缺陷类型标识" prop="defectTypeLabel">
              <el-input v-model="form.defectTypeLabel" placeholder="请输入缺陷类型标识" />
            </el-form-item>

          <!-- <el-col :span="12"> -->
            <el-form-item label="缺陷类型状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          <!-- </el-col> -->
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
import { listDefecttype, getDefecttype, delDefecttype, addDefecttype, updateDefecttype } from "@/api/device/defecttype";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "defecttype",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 表格树数据
      defecttypeList: [],
      // 缺陷类型树选项
      defecttypeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 缺陷类型类型数据字典
      defecttypeTypeOptions: [],
      // 查询参数
      queryParams: {
        defectTypeName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级缺陷类型不能为空", trigger: "blur" }
        ],
        defectTypeName: [
          { required: true, message: "缺陷类型名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" },
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
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询缺陷类型列表 */
    getList() {
      this.loading = true;
      listDefecttype(this.queryParams).then(response => {
        this.defecttypeList = this.handleTree(response.data, "defectTypeId");
        this.loading = false;
      });
    },
    /** 转换缺陷类型数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.defectTypeId,
        label: node.defectTypeName,
        children: node.children
      };
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        defectTypeId: undefined,
        parentId: undefined,
        defectTypeName: undefined,
        defectTypeLabel: undefined,
        orderNum: undefined,
        status: "0"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != undefined) {
        this.form.parentId = row.defectTypeId;
      }
      this.open = true;
      this.title = "添加缺陷类型";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getDefecttype(row.defectTypeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改缺陷类型";
      });
    },
    /** 查询缺陷类型下拉树结构 */
    getTreeselect() {
      listDefecttype().then(response => {
        this.defecttypeOptions = [];
        const data = { defectTypeId: 0, defectTypeName: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "defectTypeId", "parentId");
        this.defecttypeOptions.push(data);
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.defectTypeId != undefined) {
            updateDefecttype(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addDefecttype(this.form).then(response => {
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
      console.log(row);
      this.$confirm('是否确认删除名称为"' + row.defectTypeName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDefecttype(row.defectTypeId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  },
  watch:{
    "form.orderNum":{
      handler(newval,oldval){
        console.log(newval);
        // var zhengze = /^[0-9]\d+$/;
        // console.log(zhengze.test(newval),'----zhengze');
        // if(zhengze.test(newval) == false){
        //   this.$message({
        //     message: '只能输入数字',
        //     type: 'warning'
        //   });
        //   this.form.orderNum = undefined;
        // }
        if(newval > 2147483647){
          this.$message({
            message: '输入有误，请重新输入',
            type: 'warning'
          });
          this.form.orderNum = undefined;
        }
      },
      deep:true
    }
  }
};
</script>
