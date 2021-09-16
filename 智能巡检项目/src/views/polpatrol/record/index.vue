<template>
  <div class="app-container">
    <el-form :model="queryParams" ref ="queryForm" :inline="true">
      <el-form-item label="巡检计划名称">
        <el-input
          v-model="queryParams.patrolName"
          placeholder="请输入计划名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
          v-input-filter:special
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
      :data="patrolReportList"
      row-key="recordId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @selection-change="handleSelectionChange"
    >
       <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="patrolName" label="巡检计划名称" ></el-table-column>
      <el-table-column prop="startTime" label="计划周期" ></el-table-column> 
      <el-table-column prop="status" label="执行状态" :formatter="processRecordState"></el-table-column>
      <el-table-column prop="startTime" label="执行时间" ></el-table-column>      
      <el-table-column prop="finishTime" label="完成时间" ></el-table-column> 
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width"  width="300">
        <template slot-scope="scope">         
          <el-button
            :disabled="scope.row.parentId == 0 && scope.row.children.length !== 0"
            size="mini"
            type="text"
            @click="handleDownTemplate(scope.row.recordId)"            
          >下载巡检报告</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="recordDetails(scope.row)"
          >详情</el-button>
           <el-button
            size="mini"
            type="text"
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
      @pagination="getPatrolRecordList"
    />  
  </div>
</template>

<script>
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {listPatrolrecord,downloadReport,delPatrolRecord} from "@/api/polpatrol/reportanalysis"

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      total:0,
      // 非多个禁用
      multiple: true,
      patrolReportList:[],
       //用于多选
      ids: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        patrolName: undefined        
      }
    };
  },
  mounted() {
      this.getPatrolRecordList();
      setInterval(this.getPatrolRecordList, 60000);
  },
  methods: {
    handleQuery(){
      this.getPatrolRecordList();
    },
    resetQuery() {
      this.queryParams.patrolName = undefined;      
      this.resetForm("queryForm");
      this.handleQuery();
    },
    getPatrolRecordList() {
      this.loading = true;
      listPatrolrecord(this.queryParams).then(response => {
         this.patrolReportList = response.rows;
         this.total = response.total;
         this.loading = false;
      });
    },    
     handleDownTemplate(id){
    
      downloadReport(id).then(response => {
         var blob = new Blob([response]);
        
         if('download' in document.createElement('a')) {
            var filename= id+".xls";
            var  link = document.createElement("a");
            link.style.display= 'none';
            link.download= filename;
            link.href =URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
         }else{           
           navigator.msSaveBlob ( blob,  id+".xls" );
         }
      });
    },
     /** 删除按钮操作 */
    handleDelete(row) {
      const recordIds = row.recordId || this.ids;
      this.$confirm('是否确认删除選中数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPatrolRecord(recordIds);
        }).then(() => {
          this.getPatrolRecordList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.recordId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    // 跳转巡检记录详情
    recordDetails(row){
      console.log("hk!!",row.recordId)
      this.$router.push({
        path:'/polpatrol/record/recordDetailH',
        query:{
          recordId:row.recordId
        }
      })

    },
    /** 处理记录状态 */
    processRecordState(row) {
      if (row.status === '0') {
        return '未执行'
      }
      if (row.status === '1') {
        return '执行中'
      }
      if (row.status === '2') {
        return '已完成'
      }
       if (row.status === '3') {
        return '执行超时'
      }
      return '未知'
    },
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  } 
};
</script>