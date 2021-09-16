<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="被采设备名称">
        <el-input
          v-model="queryParams.equipmentName"
          placeholder="请输入被采设备名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
          v-input-filter:special
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryParams.status" placeholder="被采设备状态" clearable size="small">
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
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['device:equipment:add']"
        >新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="equipmentList"
      row-key="equipmentId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="equipmentName" label="被采设备名称" width="200"></el-table-column>
      <!-- <el-table-column prop="equipmentType" label="被采设备类型" width="100" :formatter="equipmentTypeFormat"></el-table-column> -->
      <el-table-column prop="orderNum" label="排序" width="100" ></el-table-column>
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
            v-hasPermi="['device:equipment:edit']"
          >修改</el-button>
          <el-button 
            size="mini" 
            type="text" 
            icon="el-icon-plus" 
            @click="handleAdd(scope.row)"
            v-hasPermi="['device:equipment:add']"
          >新增</el-button>
          <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['device:equipment:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改被采设备对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
            <el-form-item label="上级被采设备" prop="parentId">
              <treeselect v-model="form.parentId" :options="equipmentOptions" :normalizer="normalizer" placeholder="选择上级被采设备" />
            </el-form-item>
            <el-form-item label="被采设备名称" prop="equipmentBaseId">
              <el-select v-model="form.equipmentBaseId" placeholder="请选择被采设备名称">
                <el-option
                  v-for="dict in equipmentBaseOptions"
                  :key="dict.equipmentBaseId"
                  :label="dict.equipmentName"
                  :value="dict.equipmentBaseId"
                ></el-option>
              </el-select>
            </el-form-item>
          <!-- <el-col :span="12">
            <el-form-item label="被采设备类型" prop="equipmentType">
              <el-select v-model="form.equipmentType" placeholder="请选择被采设备类型">
                <el-option
                  v-for="dict in equipmentTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
            <el-form-item label="被采设备状态">
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
import { listEquipment, getEquipment, delEquipment, addEquipment, updateEquipment, listEquipmentExcludeChild } from "@/api/device/equipment";
import { listEquipmentBase, getEquipmentBase, delEquipmentBase, addEquipmentBase, updateEquipmentBase, exportEquipmentBase, importTemplate } from "@/api/device/equipmentBase";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Equipment",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 表格树数据
      equipmentList: [],
      // 被采设备树选项
      equipmentOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 设备型号字典
      equipmentBaseOptions: [],
      // 被采设备类型数据字典
      equipmentTypeOptions: [],
      // 查询参数
      queryParams: {
        equipmentName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级被采设备不能为空", trigger: "blur" }
        ],
        equipmentName: [
          { required: true, message: "被采设备名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" }
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
    this.getDicts("dev_equipment_type").then(response => {
      this.equipmentTypeOptions = response.data;
    });
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getEquipmentBaseList();
  },
  methods: {
    /** 查询被采设备列表 */
    getList() {
      this.loading = true;
      listEquipment(this.queryParams).then(response => {
        this.equipmentList = this.handleTree(response.data, "equipmentId");
        this.loading = false;
      });
    },
    // 设备型号下拉列表
    getEquipmentBaseList() {
      listEquipmentBase(this.queryParams).then(response => {
        this.equipmentBaseOptions = response.rows;
      });
    },
    /** 转换被采设备数据结构 */
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
    // 被采设备类型字典翻译
    equipmentTypeFormat(row, column) {
      return this.selectDictLabel(this.equipmentTypeOptions, row.equipmentType);
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
        equipmentType: undefined,
        equipmentName: undefined,
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
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != undefined) {
        this.form.parentId = row.equipmentId;
      }
      this.open = true;
      this.title = "添加被采设备";
      // listEquipment().then(response => {
      //     this.equipmentOptions = this.handleTree(response.data, "equipmentId");
      // });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getEquipment(row.equipmentId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改被采设备";
      });
      // listEquipmentExcludeChild(row.equipmentId).then(response => {
      //     this.equipmentOptions = this.handleTree(response.data, "equipmentId");
      // });
    },
    /** 查询被采设备下拉树结构 */
    getTreeselect() {
      listEquipment().then(response => {
        this.equipmentOptions = [];
        const data = { equipmentId: 0, equipmentName: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "equipmentId", "parentId");
        this.equipmentOptions.push(data);
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.equipmentId != undefined) {
            updateEquipment(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addEquipment(this.form).then(response => {
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
          return delEquipment(row.equipmentId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  }
};
</script>