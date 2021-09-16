<template>
   <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
       <el-form-item label="缺陷名称" prop="defectName">
        <el-input v-model="queryParams.defectName" placeholder="请输入缺陷名称" clearable size="small"
         @keyup.enter.native="handleQuery" v-input-filter:special/>
      </el-form-item>
       <el-form-item label="缺陷ID" prop="defectId" style="display:none;">
        <el-input v-model="queryParams.defectId" placeholder="请输入缺陷名称" clearable size="small"
        />
      </el-form-item>
      <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['device:defect:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['device:defect:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['device:defect:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['device:defect:export']">导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="tablelistdefect" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="缺陷ID" align="center" prop="defectId" />-->
      <el-table-column label="缺陷名称" align="center" prop="defectName" />
      <el-table-column label="缺陷标签" align="center" prop="defectLabel" />
      <el-table-column label="缺陷大类" align="center" prop="defectTypeMainName" />
      <el-table-column label="缺陷小类" align="center" prop="defectTypeSubName" />
      <el-table-column label="缺陷采集频次" align="center" prop="frequency" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['device:defect:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['device:defect:remove']"
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

  <!-- 添加或修改缺陷
    对话框-->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="缺陷大类ID" prop="defectTypeMain">
          <el-select v-model="form.defectTypeMain" @change="getsmallFun" clearable filterable placeholder="请选择">
            <el-option
              v-for="dict in bigtypeoptions"
              :key="dict.defectTypeId"
              :label="dict.defectTypeName"
              :value="dict.defectTypeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缺陷小类ID" prop="defectTypeSub">
          <el-select v-model="form.defectTypeSub" :disabled="getsamllval" clearable filterable placeholder="请先选择大类">
            <el-option
              v-for="dict in smalltypeoptions"
              :key="dict.defectTypeId"
              :label="dict.defectTypeName"
              :value="dict.defectTypeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缺陷名称" prop="defectName">
          <el-input v-model="form.defectName" placeholder="请输入缺陷名称"></el-input>
        </el-form-item>
        <el-form-item label="缺陷标签" prop="defectLabel">
          <el-input v-model="form.defectLabel" placeholder="请输入缺陷标签"></el-input>
        </el-form-item>
        <el-form-item label="缺陷采集频次" prop="frequency">
          <el-input v-model="form.frequency" placeholder="请输入缺陷采集频次"></el-input>
        </el-form-item>
        <!-- <el-form-item label="备注">
          <el-input v-model="form.remark"></el-input>
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
import {
  listDefect,
  getDefect,
  delDefect,
  addDefect,
  updateDefect,
  exportDefect,
} from "@/api/device/defect"

import { listDefecttype } from "@/api/device/defecttype";


import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";


export default {
  // name: "Line",
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
      // 缺陷表格数据
      tablelistdefect: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        defectName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      // 全部缺陷类型
      alldefecttypelist:[],
      // 缺陷大类下拉列表
      bigtypeoptions: [],
      // quyulist:[],
      //缺陷小类下拉列表
      smalltypeoptions:[],
      getsamllval:true,
    };
  },
  created() {
    this.getalldefecttype();
  },
  mounted(){
    this.getList();
  },
  methods: {
    /** 查询全部缺陷类型 */
    getalldefecttype(){
      listDefecttype().then(response => {
        console.log(response.data,"查询全部缺陷类型数据")
        this.alldefecttypelist = response.data;
        var daleilist = [];
        this.alldefecttypelist.map((v)=>{
          if(v.parentId == 0){
            daleilist.push(v)
          }
        })
        this.bigtypeoptions = daleilist;
      });
    },

    /** 查询缺陷列表 */
    getList() {
      listDefect(this.queryParams).then(response => {
        console.log(response.rows,'获取表格列表数据')
        response.rows.map((v)=>{
          this.alldefecttypelist.map((y)=>{
            if(v.defectTypeMain == y.defectTypeId){
              v.defectTypeMainName = y.defectTypeName
            }
            if(v.defectTypeSub == y.defectTypeId){
              v.defectTypeSubName = y.defectTypeName
            }
          })
        })
        this.tablelistdefect = response.rows;
        this.total = response.total;
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
        defectTypeMain:undefined,//缺陷大类ID
        defectTypeSub: undefined, //缺陷小类ID
        defectName: undefined,  //缺陷名称
        defectLabel: undefined, //通知方式
        remark: undefined,  //备注
        frequency: undefined, //缺陷频次
      };
      this.resetForm("form");
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.defectId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加缺陷";
    },
    getsmallFun(val) {
      console.log(val);
      var xiaoleilist = [];
      this.alldefecttypelist.map((v)=>{
        if(val == v.parentId){
          xiaoleilist.push(v);
        }
      })
      this.smalltypeoptions = xiaoleilist;
      this.getsamllval = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getsamllval = false;
      const defectId = row.defectId || this.ids;
      getDefect(defectId).then(response => {
        console.log(response.data,"获取修改的详细数据")
        if(response.data.defectTypeMain){
          var xiaoleilist = [];
          this.alldefecttypelist.map((v)=>{
            if(response.data.defectTypeMain == v.parentId){
              xiaoleilist.push(v);
            }
          })
          this.smalltypeoptions = xiaoleilist;
        }
        this.form = response.data;
         this.open = true;
        this.title = "修改缺陷";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      console.log(this.form)
      this.$refs["form"].validate(valid => {
        if (valid) {
          // console.log(this.form)
          if (this.form.defectId != undefined) {
            updateDefect(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addDefect(this.form).then(response => {
              console.log(response)
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
      const defectIds = row.defectId || this.ids;
      this.$confirm(
        '是否确认删除缺陷编号为"' + defectIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
      .then(function() {
        return delDefect(defectIds);
      })
      .then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
      .catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有缺陷数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportDefect(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  },
  watch: {

  }
};
</script>
<style lang="scss" scoped>
.xinzeng{
  margin-bottom: 10px;
}
</style>
