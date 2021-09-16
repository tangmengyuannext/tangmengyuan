<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px" >
      <!-- <el-form-item label="表计名称" prop="meterBaseName">
        <el-input v-model="queryParams.meterBaseName" placeholder=" clearable size="small"
        @keyup.enter.native="handleQuery"/>
      </el-form-item> -->
      <el-form-item label="表计类型" prop="meterType">
        <el-select v-model="queryParams.meterType" placeholder="请选择表计类型" clearable size="small">
          <el-option
            v-for="dict in meterTypeoption"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" v-hasPermi="['device:meterBase:query']" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" 
          v-hasPermi="['device:meterBase:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" 
          v-hasPermi="['device:meterBase:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['device:meterBase:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5" v-if="false">
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['device:meterBase:export']">导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="meterBasetabledata" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="meterBaseId" />
      <el-table-column label="名称" align="center" prop="meterBaseName" />
      <el-table-column label="表计类型" align="center" prop="meterType" :formatter="metertypeFormat"/>
      <el-table-column label="最小刻度" align="center" prop="minScale" />
      <el-table-column label="最大刻度" align="center" prop="maxScale" />
      <el-table-column label="最大角度" align="center" prop="maxDegree" />
      <el-table-column label="最小角度" align="center" prop="minDegree" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="位数" align="center" prop="digits" />
      <el-table-column label="小数点位置" align="center" prop="vdecimal" />
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['device:meterBase:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['device:meterBase:remove']"
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

    <!-- 表计新增修改表单 -->
    <el-dialog :title="biaojititle" :visible.sync="biaojiopen" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-form">
        <el-form-item label="表计类型" prop="meterType">
           <el-select v-model="form.meterType" @change="metertypechange" :disabled="isedit" clearable filterable placeholder="请选择">
            <el-option
              v-for="dict in meterTypeoption"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表计名称" prop="meterBaseName">
          <el-input v-model="form.meterBaseName"></el-input>
        </el-form-item>
        <!-- 指针表 -->
        <el-form-item label="最小刻度" prop="minScale" v-if="this.typeval == 1 || this.typeval == 7">
          <el-input v-model="form.minScale"></el-input>
        </el-form-item> 
        <el-form-item label="中间刻度" prop="middleScale" v-if="this.typeval == 1">
          <el-input v-model="form.middleScale"></el-input>
        </el-form-item>
        <el-form-item label="最大刻度" prop="maxScale" v-if="this.typeval == 1 || this.typeval == 7">
          <el-input v-model="form.maxScale"></el-input>
        </el-form-item>
        <el-form-item label="最小角度" prop="minDegree" v-if="this.typeval == 1">
          <el-input v-model="form.minDegree"></el-input>
        </el-form-item>
        <el-form-item label="中间角度" prop="middleDegree" v-if="this.typeval == 1">
          <el-input v-model="form.middleDegree"></el-input>
        </el-form-item>
        <el-form-item label="最大角度" prop="maxDegree" v-if="this.typeval == 1">
          <el-input v-model="form.maxDegree"></el-input>
        </el-form-item>
        <!-- 数字表 -->
        <el-form-item label="位数" prop="digits" v-if="this.typeval == 2">
          <el-select v-model="form.digits" clearable filterable placeholder="请选择">
            <el-option
              v-for="dict in digitsoption"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="小数点位置" prop="vdecimal" v-if="this.typeval == 2">
           <el-select v-model="form.vdecimal" clearable filterable placeholder="请选择">
            <el-option
              v-for="dict in vdecimaloption"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位" prop="unit" v-if="this.typeval == 1 || this.typeval == 2">
          <el-input v-model="form.unit"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="biaojiSave">保 存</el-button>
        <el-button @click="biaojiCencel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>


<script>
import { 
  listMeterBase, 
  getMeterBase, 
  addMeterBase, 
  updateMeterBase, 
  delMeterBase, 
  exportMeterBase,
} from "@/api/videomonitoring/configmeter";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";


export default {
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
      // 表计表格数据
      meterBasetabledata: [],
      // 查询参数
      queryParams: {
        meterType:undefined,
        pageNum: 1,
        pageSize: 10,
      },
      // -------------------表计新增修改---meter----------------------------//
      isedit:false,
      biaojititle:"",
      biaojiopen:false,
      form:{
        minScale:'',
        maxScale:'',
        minDegree:'',
        maxDegree:''
      },
      rules:{
        meterType:[
          { required: true, message: '请选择表计类型', trigger: 'change' }
        ],
        meterBaseName:[
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        // minScale:[
        //   { required: true, message: '请输入最小刻度', trigger: 'blur' },
        // ],
        // maxScale:[
        //   { required: true, message: '请输入最大刻度', trigger: 'blur' },
        // ],
        // middleScale:[
        //   { required: true, message: '请输入中间刻度', trigger: 'blur' },
        // ],
        // middleDegree:[
        //   { required: true, message: '请输入中间角度', trigger: 'blur' },
        // ],
        // minDegree:[
        //   { required: true, message: '请输入最小角度', trigger: 'blur' },
        // ],
        // maxDegree:[
        //   { required: true, message: '请输入最大角度', trigger: 'blur' },
        // ],
        // digits:[
        //   { required: true, message: '请选择位数', trigger: 'change' }
        // ],
        // vdecimal:[
        //   { required: true, message: '请选择小数点', trigger: 'change' }
        // ],
        // unit:[
        //   { required: true, message: '请输入单位', trigger: 'blur' },
        //   { min: 0, max: 20, message: '长度在 0 到 20 个字符', trigger: 'blur' }
        // ]
      },
      meterTypeoption:[], //表计类型
      digitsoption:[
        {dictLabel:"1",dictValue:"1"},
        {dictLabel:"2",dictValue:"2"},
        {dictLabel:"3",dictValue:"3"},
        {dictLabel:"4",dictValue:"4"},
        {dictLabel:"5",dictValue:"5"},
      ], //位数
      vdecimaloption:[
        {dictLabel:"0",dictValue:"0"},
        {dictLabel:"1",dictValue:"1"},
        {dictLabel:"2",dictValue:"2"},
        {dictLabel:"3",dictValue:"3"},
        {dictLabel:"4",dictValue:"4"},
        {dictLabel:"5",dictValue:"5"},
      ], //小数点
      meterzbdialog:false, //坐标
      typeval:"", //根据类型显示需要新增修改字段
    };
  },
  created: function () {
    this.getList();
    this.getDicts("meter_type").then(response => {
      this.meterTypeoption = response.data;
    });
  },
  methods: {
     /** 查询缺陷列表 */
    getList() {
      listMeterBase(this.queryParams).then(response => {
        console.log(response,'获取表计列表数据');
        this.meterBasetabledata = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    
    // 告警级别字典翻译
    metertypeFormat(row, column) {
      return row !== null ? this.selectDictLabel(this.meterTypeoption, row.meterType) : null;
    },
    //  // 表计类型下拉列表
    metertypechange(val) {
      console.log(val);
      this.typeval = val;
    }, 
    // 表单重置
    reset() {
      // -----------表计-meter--------------
      this.form = {
        meterBaseName:undefined,
        meterType:undefined,
        maxDegree:undefined,
        minDegree:undefined,
        maxScale:undefined,
        minScale:undefined,
        unit:undefined,
        vdecimal:undefined,
        digits:undefined,
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
    /** 多选框选中数据 */ 
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.meterBaseId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.typeval = 1;
      this.biaojiopen = true;
      this.isedit = false;
      this.biaojititle = "添加表计";
    },
    /** 修改按钮操作 */
    handleUpdate(row){
      console.log(row,'-----修改');
      this.typeval = row.meterType;
      this.isedit = true;
      this.reset();
      const meterBaseId = row.meterBaseId || this.ids;
      getMeterBase(meterBaseId).then((response) => {
        console.log(response);
        this.form = response.data;
        this.biaojiopen = true;
        this.biaojititle = "修改表计";
      });
    },
    /** 表计保存按钮 */
    biaojiSave(){
      console.log(this.form)
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.meterBaseId != undefined) {
            updateMeterBase(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.biaojiopen = false;
                this.getList();
                this.reset();
              }
            });
          } else {
            addMeterBase(this.form).then(response => {
              console.log(response)
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.biaojiopen = false;
                this.getList();
                this.reset();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row){
      const meterBaseIds = row.meterBaseId || this.ids;
      this.$confirm(
        '是否确认删除表记为"' + meterBaseIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
      .then(function() {
        return delMeterBase(meterBaseIds);
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
      this.$confirm("是否确认导出所有表计数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(function() {
        return exportMeterBase(queryParams);
      }) 
      .then(response => {
        this.download(response.msg);
      })
      .catch(function() {});
    },

    /** 表计取消按钮 */
    biaojiCencel(){
      this.reset();
      this.biaojiopen = false;
    },
  },
  watch: {
    
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  min-height: calc(100vh - 0px);
}

</style>

