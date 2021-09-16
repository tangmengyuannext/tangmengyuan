<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
      <el-form-item label="设备部件名称" prop="equipmentName">
        <el-input v-model="queryParams.equipmentName" placeholder="请输入设备部件名称" clearable size="small" 
        @keyup.enter.native="handleQuery" v-input-filter:special/>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
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
        v-hasPermi="['device:equipmentunit:add']"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="equipmentList"
      row-key="equipmentId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      
      <el-table-column prop="areaName" label="区域"></el-table-column>
      <el-table-column prop="equipmentName" label="设备部件名称"></el-table-column>
      <el-table-column prop="equipmentId" label="设备部件ID"></el-table-column>
      <el-table-column prop="orderNum" label="排序"></el-table-column>
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
            v-hasPermi="['device:equipmentunit:edit']"
          >修改</el-button>
          <el-button 
            size="mini" 
            type="text" 
            icon="el-icon-plus" 
            @click="handleAdd(scope.row)"
            v-hasPermi="['device:equipmentunit:add']"
          >新增</el-button>
          <el-button
            :disabled="scope.row.parentId == 0 && scope.row.children.length !== 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['device:equipmentunit:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 添加或修改设备部件对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
            <el-form-item label="区域" prop="areaId">
              <treeselect v-model="form.areaId" :options="areaOptions" :normalizer="normalizerarea" placeholder="选择区域" />
            </el-form-item>
            <el-form-item label="上级设备部件" prop="parentId">
              <treeselect v-model="form.parentId" :options="equipmentOptions" :normalizer="normalizer" placeholder="选择上级设备部件" />
            </el-form-item>
            <el-form-item label="设备部件名称" prop="equipmentName">
              <el-input v-model="form.equipmentName" placeholder="请输入设备部件名称" />
            </el-form-item>
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="设备部件状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
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
import { listEquipmentunit, getEquipmentunit, delEquipmentunit, addEquipmentunit, updateEquipmentunit, exportEquipmentunit } from "@/api/device/equipmentunit";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listArea } from "@/api/device/area";


export default {
  name: "equipment",
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
      equipmentList: [],
      // 区域列表
      areadataList:[],
      // 区域树选项
      areaOptions:[],
      // 设备部件树选项
      equipmentOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        equipmentName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        areaId:[
          { required: true, message: "区域不能为空", trigger: "change" }
        ],
        parentId: [
          { required: true, message: "上级设备部件不能为空", trigger: "blur" }
        ],
        equipmentName: [
          { required: true, message: "设备部件名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" },
          { validator: validateAcquaintance, trigger: 'blur' } // 自定义验证 
        ],
      }
    };
  },
  created() {
    this.getareaList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    setTimeout(()=>{
      this.getList();
    },200)
  },
  methods: {
    /** 查询设备部件列表 */
    getList() {
      this.loading = true;
      listEquipmentunit(this.queryParams).then(response => {
        console.log(response.rows,'查询设备部件列表');
        this.areadataList.map((v)=>{
          response.rows.map((y)=>{
            if(y.areaId == v.areaId){
              y.areaName = v.areaName
            }
          })
        })
        this.equipmentList = this.handleTree(response.rows, "equipmentId");
        this.loading = false;
      });
    },
    getareaList(){
      listArea().then(response => {
        console.log(response,'获取区域列表');
        this.areadataList = response.data;
        this.areaOptions = [];
        const data = { areaId: 0, areaName: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "areaId", "parentId");
        // this.areaOptions.push(data);
        this.areaOptions = data.children;
      });
    },
     /** 转换区域数据结构 */
    normalizerarea(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.areaId,
        label: node.areaName,
        children: node.children
      };
    },
    /** 转换设备部件数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.equipmentId,
        label: node.equipmentName,
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
        equipmentId: undefined,
        parentId: undefined,
        equipmentName: undefined,
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
        this.form.parentId = row.equipmentId;
      }
      this.open = true;
      this.title = "添加设备部件";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getEquipmentunit(row.equipmentId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备部件";
      });
    },
    /** 查询设备部件下拉树结构 */
    getTreeselect() {
      listEquipmentunit().then(response => {
        console.log(response,'上级设备部件---');
        this.equipmentOptions = [];
        const data = { equipmentId: 0, equipmentName: '顶级节点', children: [] };
        data.children = this.handleTree(response.rows, "equipmentId", "parentId");
        this.equipmentOptions.push(data);
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.equipmentId != undefined) {
            updateEquipmentunit(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addEquipmentunit(this.form).then(response => {
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
      this.$confirm('是否确认删除名称为"' + row.equipmentName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delEquipmentunit(row.equipmentId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  }
};
</script>