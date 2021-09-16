<template>
  <!-- 添加或修改被采设备 - 字典 对话框 -->
  <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
    <!-- 表格展示 -->
    <div class="dashboard-editor-container">
      <!-- 设备信息 -->
      <el-row :gutter="20">
        <el-form ref="form" :model="form" label-width="90px">
          <el-form-item label="设备名称:" prop="equipmentName">{{form.equipmentName}}</el-form-item>
        </el-form>
      </el-row>
      <!-- 缺陷查询条件 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="80px">
            <el-form-item label="缺陷名称" prop="defectName">
              <el-input
                v-model="queryParams.defectName"
                placeholder="请输入缺陷名称"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-button
            type="primary"
            size="mini"
            @click="submitForm"
            style="margin-top: 5px; float: right; margin-right: 25px;"
          >保存</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <!-- 左表 -->
          <el-table
            v-loading="loading"
            row-key="defectId"
            :data="leftlists"
            ref="leftlists"
            @selection-change="selectionChange"
          >
            <el-table-column label="全部缺陷" align="center">
              <el-table-column
                type="selection"
                :reserve-selection="true"
                disabled="true"
                width="90"
              ></el-table-column>
              <el-table-column label="缺陷ID" align="center" prop="defectId" />
              <el-table-column label="缺陷名称" align="center" prop="defectName" />
              <el-table-column
                label="缺陷类型"
                align="center"
                prop="defectType"
                :formatter="defectTypeFormat"
              />
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getLeftList"
          />
        </el-col>
        <el-col :span="12">
          <!-- 右表 -->
          <el-table ref="rightTab" :data="rightlists">
            <el-table-column label="已选缺陷" align="center">
              <el-table-column label="缺陷ID" align="center" prop="defectId" />
              <el-table-column label="缺陷名称" align="center" prop="defectName" />
              <el-table-column label="缺陷描述" align="center" prop="defectNote">
                <template slot-scope="scope">
                  <el-input placeholder="请输入内容" v-model="scope.row.defectNote"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="缺陷描述拼音" align="center" prop="defectPinyin">
                <template slot-scope="scope">
                  <el-input placeholder="请输入内容" v-model="scope.row.defectPinyin"></el-input>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
// import {
//   listDefect,
//   getDefect,
//   delDefect,
//   addDefect,
//   updateDefect,
//   exportDefect
// } from "@/api/device/defect";
import {
  listEquipmentBase,
  getEquipmentBase,
  delEquipmentBase,
  addEquipmentBase,
  updateEquipmentBase,
  exportEquipmentBase,
  importTemplate,
  configEquipmentDefect
} from "@/api/device/equipmentBase";

export default {
  data() {
    return {
      loading: true,
      total: 0,
      title: "配置缺陷",
      open: false,
      row: {},
      form: {},
      leftlists: [],
      rightlists: [],
      hasSelectList: [],
      // 缺陷类型数据字典
      defectTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        defectName: undefined,
        defectType: undefined,
        timeInterval: undefined,
        areaType: undefined,
        status: undefined
      }
    };
  },
  methods: {
    reset() {
      this.row = {},
        this.form = {},
        this.leftlists = [],
        this.rightlists = [],
        this.hasSelectList = [],
        this.$nextTick(() => {
            this.$refs.leftlists.clearSelection();
        });
    },
    init(row) {
      this.reset();
      console.log("row", row);
      this.open = true;
      this.row = row;
      this.form = row;
      this.getRightList();
      this.getLeftList();
      this.getDicts("dev_defect_type").then(response => {
        this.defectTypeOptions = response.data;
      });
    },
    getRightList() {
      console.log("getRightList");
      console.log("hasSelectList", this.hasSelectList);
      if (this.row.defects != null && this.row.defects.size != 0) {
        this.row.defects.forEach(i => {
          if (i.defectId != null) {
            this.hasSelectList.push(i.defectId);
            this.rightlists.push(i);
          }
        });
      }
    },
    // // 获取左边表格
    // getLeftList() {
    //   listDefect(this.queryParams).then(response => {
    //     this.leftlists = response.rows;
    //     this.total = response.total;
    //     this.loading = false;
    //     this.handleSelect();
    //   });
    // },
    handleSelect() {
      console.log("handleSelect");
      console.log("hasSelectList", this.hasSelectList);
      this.$nextTick(() => {
        this.leftlists.forEach(row => {
          if (this.hasSelectList.indexOf(row.defectId) >= 0) {
            console.log("handleselet");
            this.$refs.leftlists.toggleRowSelection(row, true);
          }
        });
      });
    },
    // 缺陷类型字典翻译
    defectTypeFormat(row, column) {
      return this.selectDictLabel(this.defectTypeOptions, row.defectType);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getLeftList();
    },
    //选择值变化
    selectionChange(val, selection) {
      this.rightlists = [];
      for (var i = 0; i < val.length; i++) {
        this.rightlists.push({
          equipmentBaseId: this.form.equipmentBaseId,
          defectId: val[i].defectId,
          defectName: val[i].defectName,
          defectNote: undefined,
          defectPinyin: undefined,
        });
      }

      this.rightlists.forEach(r => {
        this.row.defects.forEach(d => {
          if (r.defectId == d.defectId) {
            r.defectNote = d.defectNote;
            r.defectPinyin = d.defectPinyin;
          }
        });
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (
            this.form.equipmentBaseId != undefined &&
            this.rightlists.size != 0
          ) {
            this.form.defects = this.rightlists;
            configEquipmentDefect(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("配置成功");
                this.open = false;
              }
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
