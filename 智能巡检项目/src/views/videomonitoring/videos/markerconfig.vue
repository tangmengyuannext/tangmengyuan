<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px" >
      <el-form-item label="表计名称" prop="meterName">
        <el-input v-model="queryParams.meterName" placeholder="请输入表计名称" clearable size="small"
        @keyup.enter.native="handleQuery"/>
      </el-form-item>
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
        <el-button type="primary" icon="el-icon-search" size="mini" v-hasPermi="['system:meter:query']" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" 
          v-hasPermi="['system:meter:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" 
          v-hasPermi="['system:meter:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:meter:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['system:meter:export']">导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="metertabledata" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="表计ID" align="center" prop="meterId" />
      <el-table-column label="表计名称" align="center" prop="meterName" />
      <el-table-column label="表计类型" align="center" prop="meterType" :formatter="metertypeFormat"/>
      <el-table-column label="设备" align="center" prop="equipmentId" />
      <el-table-column label="安装位置" align="center" prop="location" />
      <el-table-column label="x1" align="center" prop="x1" />
      <el-table-column label="x2" align="center" prop="x2" />
      <el-table-column label="y1" align="center" prop="y1" />
      <el-table-column label="y2" align="center" prop="y2" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:meter:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:meter:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleReading(scope.row)"
          >读数</el-button>
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

    <!-- 标注dialog -->
    <el-dialog :title="biaozhutitle" :visible.sync="biaozhuDialog" width="50%">
      <iframe ref="basiciframe" id="basiciframes" src="../../../../imgbiaozhu/index.html" frameborder="0"
        style="height:400px;width:480px;z-index:-1;" v-if="isbiaozhuDialog"></iframe>
      <span slot="footer" class="dialog-footer">
        <el-button @click="biaozhucancel">关 闭</el-button>
        <el-button type="primary" @click="biaozhuSave">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 表计新增修改表单 -->
    <el-dialog :title="biaojititle" :visible.sync="biaojiopen" width="50%" append-to-body>
      <!-- <el-container>
          <el-aside class="elasides">
          <iframe ref="basiciframe" id="basiciframes" src="../../../imgbiaozhu/index.html" frameborder="0"
              style="height:400px;width:480px;z-index:-1;"></iframe>
          </el-aside>
          <el-main>
          </el-main>
      </el-container> -->
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-form">
        <el-form-item label="表计名称" prop="meterName">
          <el-input v-model="form.meterName"></el-input>
        </el-form-item>
        <el-form-item label="表计类型" prop="meterType">
           <el-select v-model="form.meterType" clearable filterable placeholder="请选择">
            <el-option
              v-for="dict in meterTypeoption"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
       <el-form-item label="设备" prop="equipmentId">
          <!-- <el-input v-model="form.equipmentId"></el-input> -->
          <el-select v-model="form.equipmentId" clearable filterable :disabled="true" placeholder="请选择">
            <el-option
              v-for="dict in equipmentIdoption"
              :key="dict.equipmentId"
              :label="dict.equipmentName"
              :value="dict.equipmentId"
            ></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="安装位置" prop="location">
           <el-select v-model="form.location" clearable filterable placeholder="请选择">
            <el-option
              v-for="dict in locationoption"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="坐标">
          <el-switch v-model="meterzbdialog" @change="showmeter"></el-switch>
        </el-form-item>
        <el-form-item label="x1" prop="x1">
          <el-input v-model="form.x1" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="x2" prop="x2">
          <el-input v-model="form.x2" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="y1" prop="y1">
          <el-input v-model="form.y1" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="y2" prop="y2">
          <el-input v-model="form.y2" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="biaojiSave">保 存</el-button>
          <el-button @click="biaojiCencel">取 消</el-button>
      </div>
    </el-dialog>

    
    <!-- 读数dialog -->
    <el-dialog title="读数" :visible.sync="outerReading" width="50%" append-to-body>
        <el-row class="xinzeng">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="Addreadingclick">新增</el-button>
        </el-row>
        <el-table :data="readingData" border height="400" style="width: 100%">
          <el-table-column prop="readingId" label="ID" width="40">
          </el-table-column>
          <el-table-column prop="readingName" label="名称">
          </el-table-column>
          <el-table-column prop="type" label="类型" :formatter="metertypeFormat">
          </el-table-column>
          <el-table-column prop="x1" label="x1">
          </el-table-column>
          <el-table-column prop="x2" label="x2">
          </el-table-column>
          <el-table-column prop="y1" label="y1">
          </el-table-column>
          <el-table-column prop="y2" label="y2">
          </el-table-column>
          <el-table-column prop="unit" label="单位">
          </el-table-column>
          <el-table-column prop="range" label="量程">
          </el-table-column>
          <el-table-column prop="digits" label="位数">
          </el-table-column>
          <el-table-column prop="decimal" label="小数">
          </el-table-column>
          <el-table-column prop="negative" label="负数">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="140">
            <template slot-scope="scope">
              <el-button @click="Editreadingclick(scope.row)" type="text" icon="el-icon-edit" v-hasPermi="['system:reading:edit']" size="small">修改</el-button>
              <el-button @click="Deletereadingclick(scope.row)" type="text" icon="el-icon-delete" v-hasPermi="['system:reading:remove']" size="small">删除</el-button>
              <el-button @click="readingItemclick(scope.row)" type="text" icon="el-icon-edit" size="small">读数项</el-button>
            </template>
          </el-table-column>
        </el-table>
      <el-dialog width="30%" :title="readingtitle" :visible.sync="innerReading" append-to-body>
        <el-form ref="readingform" :model="readingform" :readingrules="readingrules" label-width="100px">
          <el-form-item label="名称" prop="readingName">
            <el-input v-model="readingform.readingName"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="readingform.type" clearable filterable placeholder="请选择">
              <el-option
                v-for="dict in metertypeoption"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="坐标">
            <el-switch v-model="readingzbdialog" @change="showreadingzb"></el-switch>
          </el-form-item>
          <el-form-item label="x1" prop="x1">
            <el-input v-model="readingform.x1" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="x2" prop="x2">
            <el-input v-model="readingform.x2" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="y1" prop="y1">
            <el-input v-model="readingform.y1" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="y2" prop="y2">
            <el-input v-model="readingform.y2" :disabled="true"></el-input>
          </el-form-item>
           <el-form-item label="单位" prop="unit">
            <el-input v-model="readingform.unit"></el-input>
          </el-form-item>
          <el-form-item label="量程" prop="range">
            <el-input v-model="readingform.range"></el-input>
          </el-form-item>
          <el-form-item label="位数" prop="digits">
            <el-input v-model="readingform.digits"></el-input>
          </el-form-item>
          <el-form-item label="小数" prop="decimal">
            <el-input v-model="readingform.decimal"></el-input>
          </el-form-item>
          <el-form-item label="负数" prop="negative">
            <el-input v-model="readingform.negative"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="savereading">保 存</el-button>
          <el-button @click="cancelreading">取 消</el-button>
        </div> 
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">关闭</el-button>
      </div>
    </el-dialog>

  <!-- 读数项dialog -->
    <el-dialog title="读数项" :visible.sync="outerReadingItem" width="50%" append-to-body>
        <el-row class="xinzeng">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="AddreadingItemclick">新增</el-button>
        </el-row>
        <el-table :data="readingItemData" border height="400" style="width: 100%">
          <el-table-column prop="readingId" label="读数ID">
          </el-table-column>
          <el-table-column prop="readingItemId" label="读数项ID">
          </el-table-column>
          <el-table-column prop="readingItemName" label="读数项名称">
          </el-table-column>
          <el-table-column prop="type" label="类型" :formatter="metertypeFormat">
          </el-table-column>
          <el-table-column prop="sort" label="顺序">
          </el-table-column>
          <el-table-column prop="x1" label="x1">
          </el-table-column>
          <el-table-column prop="x2" label="x2">
          </el-table-column>
          <el-table-column prop="y1" label="y1">
          </el-table-column>
          <el-table-column prop="y2" label="y2">
          </el-table-column>
          <el-table-column prop="value" label="值">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="140">
            <template slot-scope="scope">
              <el-button @click="EditreadingItemclick(scope.row)" type="text" icon="el-icon-edit"  v-hasPermi="['system:readingitem:edit']" size="small">修改</el-button>
              <el-button @click="DeletereadingItemclick(scope.row)" type="text" icon="el-icon-delete"  v-hasPermi="['system:readingitem:remove']" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      <el-dialog width="30%" :title="readingItemtitle" :visible.sync="innerReadingItem" append-to-body>
        <el-form ref="readingItemform" :model="readingItemform" :readingItemrules="readingItemrules" label-width="100px">
          <el-form-item label="读数项名称" prop="readingItemName">
            <el-input v-model="readingItemform.readingItemName"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="readingItemform.type" clearable filterable placeholder="请选择">
              <el-option
                v-for="dict in metertypeoption"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="顺序" prop="sort">
            <el-input v-model="readingItemform.sort"></el-input>
          </el-form-item>
          <el-form-item label="坐标">
            <el-switch v-model="readingItemzbdialog" @change="showreadingItemzb"></el-switch>
          </el-form-item>
          <el-form-item label="x1" prop="x1">
            <el-input v-model="readingItemform.x1" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="x2" prop="x2">
            <el-input v-model="readingItemform.x2" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="y1" prop="y1">
            <el-input v-model="readingItemform.y1" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="y2" prop="y2">
            <el-input v-model="readingItemform.y2" :disabled="true"></el-input>
          </el-form-item>
           <el-form-item label="值" prop="value">
            <el-input v-model="readingItemform.value"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="savereadingItem">保 存</el-button>
          <el-button @click="cancelreadingItem">取 消</el-button>
        </div> 
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="canceldsxDialog">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>


<script>
import { listMeterConfig, getMeterConfig, addMeterConfig, updateMeterConfig, delMeterConfig, exportMeterConfig,
         listReading, getReading, addReading, updateReading, delReading,
         listReadingItem, getReadingItem, addReadingItem, updateReadingItem, delReadingItem,
         delbiaozhuimgurl, //删除标注图片地址
} from "@/api/videomonitoring/videos";
import { getDicts } from "@/api/system/dict/data";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listEquipment } from "@/api/device/equipment";


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
      metertabledata: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      //------------------------标注dialog------------------------------//
      biaozhutitle:"",
      biaozhuDialog:false,
      isbiaozhuDialog:false,
      // 图像标注获取的xy值
      propszuobiao:[],
      bgimgurl:"",

      // -------------------表计新增修改---meter----------------------------//
      biaojititle:"",
      biaojiopen:false,
      form:{},
      rules:{},
      meterTypeoption:[], //表计类型
      locationoption:[], //安装位置
      equipmentIdoption:[],
      meterzbdialog:false, //坐标

      // ------------------------读数-------------------------//

      rowmeterId:"",
      outerReading:false,
      readingData:[],
      readingtitle:"",
      innerReading:false,
      readingform:{},
      readingrules:{},
      // typeoption:[], //类型
      readingzbdialog:false, //坐标

      //------------------------读数项-------------------------------//
      rowreadingId:"",
      outerReadingItem:false,
      readingItemData:[],
      readingItemtitle:"",
      innerReadingItem:false,
      readingItemform:{},
      readingItemrules:{},
      // itemtypeoption:[], //类型
      readingItemzbdialog:false, //坐标

    };
  },
  created: function () {
    this.getReadingdata();
    this.getReadingItemdata();
    // this.getmetertypelist();
    this.getlocationlist();
    setTimeout(()=>{
      this.getList();
    },300)
    
    this.getDicts("meter_type").then(response => {
      this.meterTypeoption = response.data;
    });

    // console.log(window.sessionStorage.getItem("biaozhuimgurl"),'-----');
  },
  beforeMount: function () {},
  mounted: function () {
    console.log(this.$route.query.data,'------传参',this.$route.query.bgimgurl);
    var biaozhuimgurlname = this.$route.query.bgimgurlname;
    var biaozhuimgurl = this.$route.query.bgimgurl;
    var equipmentdata = this.$route.query.equipmentdata;
    window.sessionStorage.setItem("biaozhuimgurlname",biaozhuimgurlname);
    window.sessionStorage.setItem("biaozhuimgurl",biaozhuimgurl);
    window.sessionStorage.setItem("shebei",equipmentdata);
    window.addEventListener("message", function (e) {
      this.propszuobiao = [];
      if(e.data.parentval != undefined){
        this.propszuobiao = e.data.parentval;
        window.sessionStorage.setItem("biaozhuxyval",JSON.stringify(this.propszuobiao));
      }
      // console.log(this.propszuobiao,'------e.data.parentval---');
    })
    listEquipment().then(response => {
      console.log(response.rows,"------设备数据");
      this.equipmentIdoption = response.rows;
    });

  },
  destroyed: function () {
    var imgname = window.sessionStorage.getItem("biaozhuimgurlname");
    var filepaths = {}
    filepaths.filepath = imgname;
    delbiaozhuimgurl(filepaths).then(response => {
      console.log(response)
      if (response.code === 200) {
        this.$message({
          message: '删除成功',
          type: 'success'
        });
      }
    }).catch(error=>{
      this.$message({
        message: '删除失败',
        type: 'error'
      });
    })
  },
  methods: {
     /** 查询缺陷列表 */
    getList() {
      listMeterConfig(this.queryParams).then(response => {
        console.log(response,'获取表计列表数据');
        this.metertabledata = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    
    // 告警级别字典翻译
    metertypeFormat(row, column) {
      return row !== null ? this.selectDictLabel(this.meterTypeoption, row.meterType) : null;
    },
    //  // 表计类型下拉列表
    // getmetertypelist() {
    //   getDicts("meter_type").then(response => {
    //     console.log(response,"类型下拉列表");
    //     this.meterTypeoption = response.data;
    //     this.typeoption = response.data;
    //     this.itemtypeoption = response.data;
    //   });
    // }, 
    // 安装位置下拉列表
    getlocationlist() {
      getDicts("sys_location").then(response => {
        console.log(response,"安装位置下拉列表");
        this.locationoption = response.data;
      });
    },
   
    // 表单重置
    reset() {
      this.meterzbdialog = false;
      this.readingzbdialog = false;
      this.readingItemzbdialog = false;
      // -----------表计-meter--------------
      this.form = {
        meterName:undefined,
        meterType:undefined,
        equipmentId:undefined,
        location:undefined,
        x1:undefined,
        y1:undefined,
        x2:undefined,
        y2:undefined,
        remark:undefined
      };
      this.resetForm("form");

      //-----------读数---------------
      this.readingform = {
        readingName:undefined,
        type:undefined,
        x1:undefined,
        y1:undefined,
        x2:undefined,
        y2:undefined,
        unit:undefined,
        digits:undefined,
        negative:undefined,
        // vdecimal:undefined,
        // vrange:undefined,
      };
      this.resetForm("readingform");

      // ----------读数项-----------
      this.readingItemform = {
        readingItemName:undefined,
        type:undefined,
        sort:undefined,
        x1:undefined,
        y1:undefined,
        x2:undefined,
        y2:undefined,
      };
      this.resetForm("readingItemform");
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
      this.ids = selection.map(item => item.meterId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.equipmentId = window.sessionStorage.getItem("shebei");
      this.biaojiopen = true;
      this.biaojititle = "添加表计";
    },
    /** 是否打开标注dialog */ 
    showmeter(val){
      // console.log(val,'------是否打开标注dialog');
      if(val == true){
        this.biaozhutitle = "表计标注"
        this.biaozhuDialog = true;
        this.isbiaozhuDialog = true;
      }else if(val == false){
        this.biaozhuDialog = false;
        this.isbiaozhuDialog = false;
        this.biaozhutitle = undefined;
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row){
      console.log(row,'-----修改');
      this.reset();
      const meterId = row.meterId || this.ids;
      getMeterConfig(meterId).then((response) => {
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
          if (this.form.meterId != undefined) {
            updateMeterConfig(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.biaojiopen = false;
                this.getList();
                this.reset();
              }
            });
          } else {
            addMeterConfig(this.form).then(response => {
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
      const meterIds = row.meterId || this.ids;
      this.$confirm(
        '是否确认删除表记为"' + meterIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
      .then(function() {
        return delMeterConfig(meterIds);
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
        return exportMeterConfig(queryParams);
      }) 
      .then(response => {
        this.download(response.msg);
      })
      .catch(function() {});
    },

    /** 表计取消按钮 */
    biaojiCencel(){
      console.log(this.biaozhutitle);
      this.biaojiopen = false;
    },
    /** -----------------------------标注------------------------------------------- */
    /** 标注确定按钮 */ 
    biaozhuSave(){
      console.log(this.biaozhutitle);
      this.biaozhuDialog = false;
      var biaozhuval = window.sessionStorage.getItem("biaozhuxyval")
      var biaozhuvals = JSON.parse(biaozhuval);
      console.log(window.sessionStorage.getItem("biaozhuxyval"),'----',biaozhuvals);
      if(this.biaozhutitle == "表计标注"){
        if(biaozhuvals != null){
          if(biaozhuvals.length == 1){
            this.form.x1 = biaozhuvals[0].x;
            this.form.y1 = biaozhuvals[0].y;
            this.form.x2 = biaozhuvals[0].ex;
            this.form.y2 = biaozhuvals[0].ey;
          }
        }
      }else if(this.biaozhutitle == "读数标注"){
        if(biaozhuvals != null){
          if(biaozhuvals.length == 1){
            this.readingform.x1 = biaozhuvals[0].x;
            this.readingform.y1 = biaozhuvals[0].y;
            this.readingform.x2 = biaozhuvals[0].ex;
            this.readingform.y2 = biaozhuvals[0].ey;
          }
        }
      }else if(this.biaozhutitle == "读数项标注"){
        if(biaozhuvals != null){
          if(biaozhuvals.length == 1){
            this.readingItemform.x1 = biaozhuvals[0].x;
            this.readingItemform.y1 = biaozhuvals[0].y;
            this.readingItemform.x2 = biaozhuvals[0].ex;
            this.readingItemform.y2 = biaozhuvals[0].ey;
          }
        }
      }
    },
    /** 标注取消按钮 */
    biaozhucancel(){
      this.biaozhuDialog = false;
      this.biaozhutitle = undefined;
    },
    /**-------------------------------读数-reading----------------------------------------------*/
    /** 读数按钮操作 */
    handleReading(row){
      console.log(row);
      this.rowmeterId = row.meterId;
      this.getReadingdata();
      this.outerReading = true;
    },
    /** 获取读数列表 */
    getReadingdata(){
      var queryform = {
        "meterId":this.rowmeterId
      }
      listReading(queryform).then(response => {
        console.log(response,'获取读数列表数据');
        this.readingData = response.rows;
      });
    },
    /** 读数关闭按钮操作 */
    cancelDialog(){
      this.outerReading = false;
    },
    /** 读数新增按钮操作 */
    Addreadingclick(){
      this.reset();
      this.innerReading = true;
      this.readingtitle = "新增读数";
    },
    /** 读数坐标 */
    showreadingzb(val){
      if(val == true){
        this.biaozhutitle = "读数标注";
        this.biaozhuDialog = true;
      }else if(val == false){
        this.biaozhuDialog = false;
        this.biaozhutitle = undefined;
      }
    },
    /** 读数修改按钮操作 */
    Editreadingclick(row){
       this.reset();
      const readingId = row.readingId;
      getReading(readingId).then((response) => {
        console.log(response);
        this.readingform = response.data;
        this.innerReading = true;
        this.readingtitle = "修改读数";
      });
    },
    /** 读数保存按钮操作 */
    savereading(){
      console.log(this.readingform)
      this.$refs["readingform"].validate(valid => {
        if (valid) {
          if (this.readingform.readingId != undefined) {
            updateReading(this.readingform).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.innerReading = false;
                this.getReadingdata();
              }
            });
          } else {
            this.readingform.meterId = this.rowmeterId;
            addReading(this.readingform).then(response => {
              console.log(response)
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.innerReading = false;
                this.getReadingdata();
              }
            });
          }
        }
      });
    },
    /** 读数取消按钮操作 */
    cancelreading(){
      this.innerReading = false;
    },
    /** 读数删除按钮操作 */
    Deletereadingclick(row){
      const readingIds = row.readingId;
      this.$confirm(
        '是否确认删除读数为"' + readingIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
      .then(function() {
        return delReading(readingIds);
      })
      .then(() => {
        this.getReadingdata();
        this.msgSuccess("删除成功");
      })
      .catch(function() {});
    },

    /**-------------------------------读数项-readingItem----------------------------------------------*/
    /** 读数项按钮操作 */ 
    readingItemclick(row){
      console.log(row);
      this.rowreadingId = row.readingId;
      this.outerReadingItem = true;
      this.getReadingItemdata();
    },
    /** 获取读数项列表 */
    getReadingItemdata(){
      var queryparam = {
        "readingId":this.rowreadingId
      }
      listReadingItem(queryparam).then(response => {
        console.log(response,'获取读数项列表数据');
        this.readingItemData = response.rows;
      });
    },
    /** 读数项关闭按钮操作 */
    canceldsxDialog(){
      this.outerReadingItem = false;
    },
    /** 读数项新增按钮操作 */
    AddreadingItemclick(){
      this.reset();
      this.innerReadingItem = true;
      this.readingItemtitle = "新增读数项"
    },
    
    /** 读数项坐标 */
    showreadingItemzb(val){
      if(val == true){
        this.biaozhutitle = "读数项标注"
        this.biaozhuDialog = true;
      }else if(val == false){
        this.biaozhuDialog = false;
        this.biaozhutitle = undefined;
      }
    },
    /** 读数项修改按钮操作 */
    EditreadingItemclick(row){
       this.reset();
      const readingItemId = row.readingItemId;
      getReadingItem(readingItemId).then((response) => {
        console.log(response);
        this.readingItemform = response.data;
        this.innerReadingItem = true;
        this.readingItemtitle = "修改读数项";
      });
    },
    /** 读数项保存按钮操作 */
    savereadingItem(){
      // this.innerReadingItem = false;
       console.log(this.readingItemform)
      this.$refs["readingItemform"].validate(valid => {
        if (valid) {
          if (this.readingItemform.readingItemId != undefined) {
            updateReadingItem(this.readingItemform).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.innerReadingItem = false;
                this.getReadingItemdata();
              }
            });
          } else {
            this.readingItemform.readingId = this.rowreadingId;
            addReadingItem(this.readingItemform).then(response => {
              console.log(response)
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.innerReadingItemItem = false;
                this.getReadingItemdata();
              }
            });
          }
        }
      });
    },
    /** 读数项取消按钮操作 */
    cancelreadingItem(){
      this.innerReadingItem = false;
    },
    /** 读数项删除按钮操作 */
    DeletereadingItemclick(row){
      const readingItemIds = row.readingItemId;
      this.$confirm(
        '是否确认删除读数项为"' + readingItemIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
      .then(function() {
        return delReadingItem(readingItemIds);
      })
      .then(() => {
        this.getReadingItemdata();
        this.msgSuccess("删除成功");
      })
      .catch(function() {});
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

