<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="智能感知终端" name="first">
        <div>
          <cameraList :isFanOrSheng="'1'"></cameraList>
        </div>
      </el-tab-pane>
      <el-tab-pane label="电场设备" name="second">
        <div class="shebeiBodyDiv">
          <el-form ref="queryForm" :model="queryParams" :inline="true" :rules="queryParamsrules" label-width="110px">
            <el-form-item label="设备名称" prop="equipmentName">
              <el-input v-model="queryParams.equipmentName" placeholder="请输入设备名称" clearable size="small" 
              @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="所属区域" prop="areaId">
              <treeselect v-model="queryParams.areaId" :options="areaOptions" :normalizer="normalizer" placeholder="选择区域" />
            </el-form-item>
            <el-form-item>
              <el-button class="filter-item" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
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
              v-hasPermi="['device:equipmentunit:add']"
              >新增</el-button>
            </el-col>
          </el-row>

          <el-table
            v-loading="loading"
            :data="equipmentList"
            :cell-class-name="textOverflow"
          >
            <!-- <el-table-column prop="equipmentId" label="设备ID"></el-table-column> -->
            <el-table-column prop="equipmentName" label="设备名称" align="center"></el-table-column>
            <el-table-column prop="area.areaName" label="所属区域" align="center"></el-table-column>
            <el-table-column prop="orderNum" label="排序" align="center"></el-table-column>
            <el-table-column prop="status" label="状态" :formatter="statusFormat" align="center"></el-table-column>
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
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['device:equipmentunit:remove']"
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


          <!-- 添加或修改设备对话框 -->
          <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
              <el-row>
                  <el-form-item label="设备名称" prop="equipmentName">
                    <el-input v-model="form.equipmentName" placeholder="请输入设备名称" />
                  </el-form-item>
                  <el-form-item label="所属区域" prop="areaId">
                    <treeselect v-model="form.areaId" :options="areaOptions" :normalizer="normalizer" placeholder="选择区域" />
                  </el-form-item>
                  <el-form-item label="显示排序" prop="orderNum">
                    <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
                  </el-form-item>
                  <el-form-item label="设备状态">
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
      </el-tab-pane>
    </el-tabs>
  </div>
  
</template>

<script>
import { listEquipmentunit, getEquipmentunit, delEquipmentunit, addEquipmentunit, updateEquipmentunit, exportEquipmentunit } from "@/api/device/equipmentunit";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listArea } from "@/api/device/area";
import cameraList from "../equipmentunit/terminalList.vue"


export default {
  name: "equipment",
  components: { Treeselect, cameraList },
  data() {
    return {
      activeName: 'first',
      // 遮罩层
      loading: true,
      // 表格树数据
      equipmentList: [],
      // 区域树选项
      areaOptions:[],
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
        pageNum: 1,
        pageSize: 10,
        equipmentName: undefined,
        systemType:"fan"
      },
      queryParamsrules:{
        equipmentName: [
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { pattern: /^[^\[\]\?\|\\]*$/, message: '不可以输入特殊符号' }
        ]
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        equipmentName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        areaId:[
          { required: true, message: "所属区域不能为空", trigger: "change" }
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" },
        ],
      }
    };
  },
  created() {
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getTreeselect();
    this.getList()
  },
  methods: {
    // tab标签点击事件
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // table里文字溢出省略样式
    textOverflow (row){
      if (row.columnIndex==7) {
        return 'table-textOverflow'
      }
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
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    /** 查询设备列表 */
    getList() {
      this.loading = true;

      // this.queryParams={
      //   systemType : "booster"
      // }
      // this.queryParams.area.systemType = "fan";
      listEquipmentunit(this.queryParams).then(response => {
        this.equipmentList = response.rows
        this.total = response.total
        this.loading = false;
      });
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
        areaId: undefined,
        'area.areaName': undefined,
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
      this.open = true;
      this.title = "添加设备";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getEquipmentunit(row.equipmentId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备";
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
<style lang="scss">
.vue-treeselect__control {
    display: table-cell;
}
.shebeiBodyDiv{
  margin-top: 15px;
}
</style>