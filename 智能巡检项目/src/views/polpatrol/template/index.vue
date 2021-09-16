<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px" :rules="queryParamsrules">
        <el-form-item label="机构名称" prop="deptName">
          <el-input type="text" v-model="queryParams.deptName" placeholder="请输入" size="small" maxlength="32"></el-input>
          <el-input id="hiddenText" type="text" style="display:none" />
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
    </el-row>

    <el-table v-loading="loading" :data="templatelist" @selection-change="handleSelectionChange">
      <el-table-column label="机构名称" align="center" prop="deptName" />
      <el-table-column label="数据类型" align="center" prop="dataType" />
      <el-table-column label="结果类型" align="center" prop="resultType" :formatter="processResultType"/>
      <el-table-column label="区域" align="center" prop="areaName" />
      <el-table-column label="预置位" align="center" prop="siteName" />
      <el-table-column label="表计" align="center" prop="meterName" :formatter="processMeterTemp"/>
      <el-table-column label="缺陷标识" align="center" prop="defectLabel" />
      <el-table-column label="模板中的行" align="center" prop="excelRow" />
      <el-table-column label="模板中的列" align="center" prop="excelColumn" />
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetails(scope.row)"
          >详情</el-button>
           <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
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
      @pagination="getList"
    />

    <!-- 巡检模板信息详情和编辑对话框-->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="机构名称" prop="deptName">
          <el-input type="text" v-model="form.deptName" :disabled="detailFlag" maxlength="32" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="数据类型" prop="dataType">
          <el-input type="text" v-model="form.dataType" :disabled="detailFlag" maxlength="32" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="结果类型" prop="resultType">
          <el-select v-model="form.resultType" clearable placeholder="请选择" style="width:400px"  @change="changeResultType" :disabled="detailFlag">
            <el-option
              v-for="item in resultTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 表计结果的配置-->
        <el-form-item label="区域" prop="areaId" v-if="form.resultType == 1 || form.resultType == 2" style="width:400px">
          <treeselect v-model="form.areaId" :options="areaOptions" :normalizer="normalizer" @select="changeArea" :disabled="detailFlag" placeholder="请选择区域" style="width:400px"/>
        </el-form-item>
        <el-form-item label="预置位" prop="rowSiteId" v-if="form.resultType == 1 || form.resultType == 2">
          <el-select v-model="form.rowSiteId" clearable filterable placeholder="请选预置位" style="width:400px" @change="changeSite" :disabled="detailFlag">
            <el-option
              v-for="item in sitelist"
              :key="item.siteId"
              :label="item.siteName"
              :value="item.siteId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表计" prop="columnMeterId" v-if="form.resultType == 1">
          <el-select v-model="form.columnMeterId" clearable filterable placeholder="请选表计" style="width:400px" @change="changeMeter" :disabled="detailFlag">
            <el-option
              v-for="item in meterlist"
              :key="item.meterId"
              :label="item.name"
              :value="item.meterId"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 测温结果的配置-->
        <el-form-item label="测温设备" prop="cameraId" v-if="form.resultType == 2">
          <el-select v-model="form.cameraId" clearable filterable placeholder="请选测温设备" style="width:400px" @change="changeCamera" :disabled="detailFlag">
            <el-option
              v-for="item in devAreaTempList"
              :key="item.id"
              :label="item.areaTempName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 告警结果的配置-->
        <el-form-item label="告警类别" prop="defectLabel" v-if="form.resultType == 3">
          <el-input type="text" v-model="form.defectLabel" :disabled="detailFlag" maxlength="32" style="width:400px"></el-input>
        </el-form-item>

        <!-- 模板中的行和列-->
        <el-form-item label="模板中的行" prop="excelRow">
          <el-input type="number" v-model="form.excelRow" :disabled="detailFlag" maxlength="4" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="模板中的列" prop="excelColumn">
          <el-input type="number" v-model="form.excelColumn" :disabled="detailFlag" maxlength="4" style="width:400px"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确认</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { listTemplate, getTemplate, addTemplate, updateTemplate, delTemplate} from "@/api/polpatrol/template";
import { listArea } from "@/api/device/area";
import { getSite } from "@/api/device/site";
import { listAreaTemp } from "@/api/device/areaTemp";
import {listAreaSites, listSiteMeters}  from  "@/api/polpatrol/itemsanalysis";
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
        // 区域树选项
        areaOptions: [],
        // 模板数据
        templatelist: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
            pageNum: 1,
            pageSize: 10,
            deptName: "",
        },
        siteQueryParams: {
            areaId: ""
        },
        devAreaTempQueryParams: {
            cameraId: ""
        },
        meterQueryParams: {
            siteId:"",
        },
        // 测温设备数据
        devAreaTempList:[],
        // 预置位数据
        sitelist:[],
        // 表计数据
        meterlist:[],
        // 表单参数
        form: {
          dataType: "",
          columnMeterId: undefined,
        },
        resultTypeOptions:[
          { label: '请选择', value: undefined }, 
          { label: '表计', value:'1'},
          // { label: '测温', value:'2'},
          // { label: '告警', value:'3'}
        ],
        // 表单校验
        rules: {
          deptName: [
            { required: true, message: "请输入机构名称", trigger: "change" },
          ],
          resultType: [
            { required: true, message: "请选择结果类型", trigger: "change" },
          ],
          // areaId: [
          //   { required: true, message: "请选择区域", trigger: "change" },
          // ],
          // rowSiteId: [
          //   { required: true, message: "请选择预置位", trigger: "change" },
          // ],
          // columnMeterId: [
          //   { required: true, message: "请选择表计", trigger: "change" },
          // ],
          // cameraId: [
          //   { required: true, message: "请选择测温设备", trigger: "change" },
          // ],
          // defectLabel: [
          //   { required: true, message: "请填写告警类别", trigger: "change" },
          // ],
          excelRow: [
            { required: true, message: "请填写模板中的行", trigger: "change" },
          ],
          excelColumn: [
            { required: true, message: "请填写模板中的列", trigger: "change" },
          ]
      },
        detailFlag:false,
        queryParamsrules: {
          deptName: [
            { pattern: /^[^\[\]\?\|\\]*$/, message: '不可以输入特殊符号' }
          ]
        },
    };
  },
  created() {
      this.getList();
  },
  mounted() {
    window.addEventListener("message",function(e){
    })
  },
  methods: {
    /** 查询巡检模板列表 */
    getList() {
      this.loading = true;
      console.log(this.queryParams)
      listTemplate(this.queryParams).then(response => {
        console.log(response)
        this.templatelist = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询区域测温设备列表 */
    getDevAreaTemp(cameraId) {
      this.devAreaTempQueryParams.cameraId = cameraId;
      listAreaTemp(this.devAreaTempQueryParams).then(response => {
        console.log("listAreaTemp:", response)
        this.devAreaTempList = response.rows;
      });
    },
    /** 查询区域下预置位列表 */
    getSiteList(areaId) {
      this.siteQueryParams.areaId = areaId;
      listAreaSites(this.siteQueryParams).then(response => {
        console.log("getSiteList:" + response.rows)
        this.sitelist = response.rows;
      })
    },
    /** 查询预置位下表计列表 */
    getMeterList(siteId) {
      this.meterQueryParams.siteId = siteId;
      console.log("meterQueryParams:" + this.meterQueryParams.siteId);
      listSiteMeters(this.meterQueryParams).then(response => {
        console.log("getMeterList:" + response.rows);
        this.meterlist = response.rows;
      })
    },
    // 表单重置
    reset() {
      this.form = {
        deptName: ""
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
      this.ids = selection.map(item => item.faceId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
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
    /** 选择结果类型回调 */
    changeResultType(val) {
      console.log("changeResultType:", val);
      this.form.resultType = val
    },
    /** 选择区域变化回调 */
    changeArea(val) {
      console.log("changeArea:", val.areaId);
      this.getSiteList(val.areaId);
      this.form.areaId = val.areaId;
    },
    /** 选择预置位变化回调 */
    changeSite(val) {
      console.log("changeSite:", val)
      if(val != "") {
        if(this.form.resultType == 1) {
          console.log("resultType:1");
          this.getMeterList(val);
          this.form.rowSiteId = val;
        }
        if(this.form.resultType == 2) {
          console.log("resultType:2");
          getSite(val).then(response => {
            console.log("cameraId:", response.data.cameraId);
            var cameraId = response.data.cameraId;
            this.getDevAreaTemp(cameraId);
          })
        }
      }
    },
    /** 选表计变化回调 */
    changeMeter(val) {
      console.log("changeMeter:", val);
      this.form.columnMeterId = val;
    },
    /** 选择测温设备变化回调 */
    changeCamera(val) {
      console.log("changeCamera:", val);
      this.form.cameraId = val;
    },
    /** 详情按钮操作 */
    handleDetails(row) {
      console.log("handleDetails:", row);
      this.reset();
      this.detailFlag = true;
      this.getTreeselect();
      if(row.areaId != null){
        this.getSiteList(row.areaId);
      }
      if(row.rowSiteId != null){
        this.getMeterList(row.rowSiteId);
      }
      this.open = false;
      const templateId = row.templateId;
      getTemplate(templateId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "巡检模板信息详情";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row);
      this.reset();
      this.getTreeselect();
      if(row.areaId != null) {
        this.getSiteList(row.areaId);
      }
      if(row.rowSiteId != null) {
        this.getMeterList(row.rowSiteId);
      }
      if(row.resultType == 2){
        getSite(row.rowSiteId).then(response => {
          console.log("cameraId:", response.data.cameraId);
          var cameraId = response.data.cameraId;
          this.getDevAreaTemp(cameraId);
        })
      }
      this.detailFlag = false;
      const templateId = row.templateId;
      getTemplate(templateId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "编辑巡检模板信息";
        this.issuccess = false;
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.detailFlag = false;
      this.getTreeselect();
      this.title = "新增巡检模板信息";
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          console.log(this.form)
          this.sitelist = [];
          this.meterlist = [];
          if(this.detailFlag) {
            this.open = false;
            this.reset();
          } else {
            if (this.form.templateId != undefined) {
              if(this.form.dataType == null) {
                this.form.dataType = "patrol_result";
              }
              updateTemplate(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              console.log("addTemplate:", this.form);
              if(this.form.dataType == null) {
                this.form.dataType = "patrol_result";
              }
              addTemplate(this.form).then(response => {
                console.log(response)
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                }
              });
            }
          }
        }
      });
    },
    /** 取消按钮操作 */
    cancel() {
      this.sitelist = [];
      this.meterlist = [];
      this.open = false;
      this.reset();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const templateId = row.templateId;
      this.$confirm(
        '是否确认删除选择的巡检模板?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
      .then(function() {
        return delTemplate(templateId);
      })
      .then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
      .catch(function() {});
    },
    /** 处理记录状态 */
    processResultType(row) {
      if (row.resultType === '0') {
        return '默认'
      }
      if (row.resultType === '1') {
        return '表计'
      }
      if (row.resultType === '2') {
        return '温度'
      }
      if (row.resultType === '3') {
        return '告警'
      }
      return ''
    },
    /** 处理表计或者测温设备名称 */
    processMeterTemp(row) {
      if (row.resultType === '1') {
        return row.meterName
      }
      if (row.resultType === '2') {
        return row.cameraName
      }
      return ''
    },
  },
  watch: {

  }
};
</script>
