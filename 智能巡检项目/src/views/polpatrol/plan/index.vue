<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="巡检计划名称">
        <el-input
          v-model="queryParams.patrolName"
          placeholder="请输入计划名称"
          size="small"
          onkeypress="if(event.keyCode == 13) return false;"
        />
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
        >新增</el-button>
      </el-col>
       <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="patrolList"
      row-key="patrolId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="patrolName" label="巡检计划名称"></el-table-column>
      <el-table-column prop="patrolNo" label="巡检任务总数"></el-table-column>
      <el-table-column prop="execdCycle" label="巡检周期">
            <template slot-scope="scope">
              <span v-if="scope.row.execdCycle == 1">日</span>
              <span v-if="scope.row.execdCycle == 7">周</span>
            </template>
      </el-table-column>
      <el-table-column prop="startDateTime" label="计划开始时间">
             <template slot-scope="scope">
                <span>{{scope.row.startDate}} {{scope.row.startTime}}</span>
             </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
            <span v-if="scope.row.status == 0">启用</span>
            <span v-if="scope.row.status == 1">停用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="300">
        <template slot-scope="scope">
          <el-button 
            size="mini" 
            type="text" 
            icon="el-icon-edit" 
            @click="handledetails(scope.row)"
          >详情</el-button>
           <el-button v-if="scope.row.status ==0"
            size="mini"
            type="text"  
            @click="changeStatus(scope.row)"          
          >停用 </el-button>
           <el-button v-if="scope.row.status ==1"
            size="mini"
            type="text"  
            @click="changeStatus(scope.row)"           
          >启用</el-button>
          <el-button
            :disabled="scope.row.parentId == 0 && scope.row.children.length !== 0"
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
      @pagination="getPatrolList"
    />  
    <el-dialog :title="title" :rowId="rowId" :visible.sync="open" width="760px" append-to-body>
      <el-form ref="form" :rules="rules" :model="form" label-width="120px" :disabled="rowId == undefined?false:true">
        <el-row>
          <el-col :span="18">
            <el-form-item label="巡检计划名称" 
                prop="patrolName">
                <el-input  v-model="form.patrolName"
                 placeholder="请输入计划名称" />
            </el-form-item>
          </el-col>
        </el-row> 
         <el-row>
          <el-col :span="12">
            <el-form-item label="巡检开始日期" prop="startDate"
            >
              <el-date-picker
                  v-model="form.startDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="startDate"
                >
              </el-date-picker>            
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="巡检结束日期" prop="endDate"
            >
              <el-date-picker
                  v-model="form.endDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="endDate"
                >
              </el-date-picker>            
          </el-form-item>
          </el-col>
        </el-row> 
        <el-row>
            <el-col :span="12">
                <el-form-item label="巡检状态" prop="status">
                    <el-switch
                      v-model="form.status"                  
                      active-color="#13ce66"
                      inactive-value="1"
                      active-value="0"
                    >
                    </el-switch>
                </el-form-item>
          </el-col>
        </el-row>  
        <el-row>
          <el-col :span="12">
            <el-form-item label="巡检计划周期"  prop="execdCycle"
                 >
                 <el-select v-model="form.execdCycle" placeholder="请选择" >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                    </el-select>
            </el-form-item>
          </el-col>
        </el-row>    
        <div v-for="(t,index) in dynamicTimes"  :key="index">
          <el-row>
            <el-col :span="12" >
              <el-form-item label="巡检开始时间" 
                  :rules="[{
                    required: true, message: '时间不能为空', trigger: ['change','blur']
                }]"  
              >
                <el-time-select 
                    v-model="t.startTime"
                    placeholder="选择时间"
                    value-format="HH:mm"
                    :picker-options="{
                      start: '00:00',
                      step: '00:01',
                      end: '24:00'
                    }"
                  >
                </el-time-select>
              </el-form-item>
            </el-col>
            <el-button  size="mini"    type="text"   @click="addTimes()">添加</el-button>
            <el-button   v-if="index !== 0" @click="deleteTimes(index)">删除</el-button>
          </el-row>
        </div>
       
        <div v-for="(item,index) in form.dynamicItem" :key="item.itemId" >
          <el-row >
            <el-col :span="10">
                <el-form-item label="巡检任务"
                  :prop="'dynamicItem.' + index + '.itemId'"
                  :rules="[{
                    required: true, message: '巡检任务不能为空', trigger: ['change','blur']
                  }]"
                >
                  <el-select v-model="item.itemId" filterable placeholder="请选择">
                      <el-option
                        v-for="ite in itemList"
                        :key="ite.itemId"
                        :label="ite.itemName"
                        :value="ite.itemId">
                      </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
              <el-col :span="8">
                <el-form-item label="任务顺序"
                :prop="'dynamicItem.' + index + '.seq'"
                :rules="[{
                    required: true, message: '任务顺序不能为空', trigger: ['change','blur']
                }]"
                >
                    <el-input v-model="item.seq"  type= "number"    oninput="value=value.replace(/[^\d]/g,'')"             
                            placeholder="请输入序号"/>
                </el-form-item>
            </el-col>
              <el-button  size="mini"    type="text"   @click="addItems()">添加</el-button>
              <el-button   v-if="index !== 0" @click="deleteItems( index)">删除</el-button>
          </el-row>
        </div>
      </el-form>     
      <div slot="footer" class="dialog-footer" v-if="rowId == undefined">
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
      <div slot="footer" class="dialog-footer" v-if="rowId !=undefined">
        <el-button @click="cancel">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {listPolpatrol,addpatrol,delPatrol,getPatrol,startPotrol,stopPotrol,validPatrol} from "@/api/polpatrol/analysis"
import {listPolpatrolItem}  from  "@/api/polpatrol/itemsanalysis"

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      rowId:undefined,
      total:0,
      rules:{
          patrolName: [
              { required: true, message: '请输入计划名称', trigger: 'blur' },
              { max: 64, message: '长度在64个字符以内', trigger: 'blur' }
            ],
          execdCycle:[
            { required: true, message: '请输入计划周期', trigger: 'change' }
          ],
          startTime:[
            { required: true, message: '请输入计划时间', trigger: 'change' }
          ],
            startDate:[
            { required: true, message: '请输入计划日期', trigger: 'change' }
          ]
      },
      //用于多选
      ids: [],
      // 非多个禁用
      multiple: true,
      patrolList:[],
      //此项用于遍历获取到的任务表
      itemList:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      dynamicTimes:[
        {
          startTime:undefined
        }
      ],
      options:[
        {
            "label":"日",
            "value":"1"
        },{
            "label":"周",
            "value":"7"
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        patrolName: undefined       
      },
      // 表单参数
      form: {
        patrolName:undefined,
        execdCycle:undefined,
        startDate:undefined,
        endDate:undefined,
        status:undefined,
        dynamicItem:[
          {
           itemId:undefined,
           seq:undefined,
          }
        ]
      },
       startDate: {
        disabledDate: time => {
          if (this.form.endDate) {
            return (
              time.getTime() > new Date(this.form.endDate).getTime()
            )
          }else{
            return time.getTime() < new Date().getTime()  - 24 * 3600 * 1000
          }
        }
      },
      endDate: {
        disabledDate: time => {
          if (this.form.startDate) {
            return (
              time.getTime() < new Date(this.form.startDate).getTime() - 24 * 3600 * 1000
            )
          }else{
            return time.getTime() < new Date().getTime()  - 24 * 3600 * 1000
          }
        }
      },
     // 表单校验
    };
  },
  
  created() {
       this.getPatrolList();
  },
  
  methods: {
    handleQuery(){
      this.getPatrolList();
       
    },
    resetQuery() {
      this.queryParams.patrolName = undefined;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    getPatrolList() {
      this.loading = true;
      listPolpatrol(this.queryParams).then(response => {
         this.patrolList = response.rows;
         this.total = response.total;
         this.loading = false;
      });
    },
     /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增巡检计划";
      var qu={
        status:0,
      };
      listPolpatrolItem(qu).then(response => {
         this.itemList = response.rows;        
      });     
    },
     /** 清除提交按钮 */
      submitForm(formName) {
        this.$refs[formName].validate(valid => {  
          if(valid){
              var submitForm ={};
              submitForm.patrolItems = JSON.stringify(this.form.dynamicItem);
              submitForm.patrolName =this.form.patrolName;
              submitForm.status = this.form.status== undefined?"1":this.form.status;
              submitForm.execdCycle= this.form.execdCycle;
              submitForm.startDate = this.form.startDate;
              submitForm.endDate = this.form.endDate;
              var startTime="";
              for(var i=0;i<this.dynamicTimes.length;i++){
                  startTime = startTime+this.dynamicTimes[i].startTime+",";
              }
              submitForm.startTime = startTime.substr(0,startTime.length-1),
              
              submitForm.patrolNo = this.form.dynamicItem.length;
              submitForm.siteNo=0;
              for (var i=0;i<this.form.dynamicItem.length;i++) {
                  var iId=this.form.dynamicItem[i].itemId;
                  for(var j=0;j<this.itemList.length;j++){
                    if(this.itemList[j].itemId == iId){
                        submitForm.siteNo =  submitForm.siteNo+this.itemList[j].sitesNo;
                    }
                  }
              }
              addpatrol(submitForm).then(response => {
                if (response.code === 200) {
                    this.$message({
                      type: 'success',
                      message: '添加成功'
                    })
                    this.open = false;
                    this.getPatrolList()
                  }
              }) 
          } else{
            return false;
          }       
        }) 
      },
    addTimes(){
      if(this.dynamicTimes.length>5){
           this.$message({
                    type: 'error',
                    message: '起始时间数量不能超过5个'
            })
            return;
      }
      this.dynamicTimes.push({
          startTime:undefined
      });
    },
    deleteTimes(index) {
        this.dynamicTimes.splice(index, 1);
    },
    addItems(){
        this.form.dynamicItem.push({
          itemId:undefined,
          seq:undefined,
        });
    },
    deleteItems(index) {
      this.form.dynamicItem.splice(index, 1);
    },
      /** 详情按钮操作 */
    handledetails(row) {
      this.reset();
      this.open = true;
      this.rowId=row.patrolId;
      this.title = "巡检计划详情"; 
      var qu={
      };
      listPolpatrolItem(qu).then(response => {
         this.itemList = response.rows;        
      });     
      getPatrol(this.rowId).then(response => {
        this.form = response.data; 
        this.form.dynamicItem = JSON.parse(this.form.patrolItems);
        this.open = true;
        this.title = "巡检计划详情";
        this.form.execdCycle  = response.data.execdCycle;
        // this.dynamicTimes=
        var timeArry =response.data.startTime.split(",");
        this.dynamicTimes=[];
        for(var i=0;i<timeArry.length;i++){
           var tt ={
              startTime:timeArry[i]
            };
            this.dynamicTimes.push(tt);
        }
      });
    },
      /** 删除按钮操作 */
    handleDelete(row) {
      const patrolIds = row.patrolId || this.ids;
      validPatrol(patrolIds).then(response => {
          if(response.datas!=null && response.datas.length>0){
                this.$message({
                    type: 'error',
                    message: '有巡检计划在执行不能删除'
                })
                return ;
          }
            this.$confirm('是否确认删除选中数据项?', "警告", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(function() {
              return delPatrol(patrolIds);
            }).then(() => {
              this.getPatrolList();
              this.msgSuccess("删除成功");
            }).catch(function() {});
          
      })
      
    },
    // 表单重置
    reset() {
      this.rowId=undefined;
      this.dynamicTimes=[
        {
          startTime:undefined
        }
      ],
      this.form = {
        patrolName:undefined,
        execdCycle:undefined,
        startDate:undefined,
        endDate:undefined,
        status:undefined,
        dynamicItem:[
          {
           itemId:undefined,
           seq:undefined,
          }
        ]
      }
    },
     // 取消按钮form
    cancel() {
      this.open = false;
      this.reset();
      this.$refs.form.resetFields();

    },
    changeStatus(row){  
        var status = row.status; 
        var str= status == 0?"停用":"启用" ; 
        this.$confirm('是否确认要'+str+'此任务状态？', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
        }).then(function() { 
          if(status == 0){
            row.status =1;
            return stopPotrol(row);
          }else{
            row.status = 0; 
            return startPotrol(row);  
          }       
        }).then(() => {
          this.getItemList();
          this.msgSuccess("状态修改成功");
        }).catch(function() {});  
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.patrolId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
  } 
    
};
</script>