<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="巡检任务名称">
        <el-input
          v-model="queryParams.itemName"
          placeholder="请输入任务名称"
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
            class="filter-item"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
        >新增</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="itemList"
      row-key="itemId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="itemName" label="巡检任务名称"></el-table-column>
      <el-table-column prop="itemType" label="任务类型" :formatter="getTypeLabel"></el-table-column>
       <el-table-column prop="calType" label="算法类型" >
          <template slot-scope="scope">
            <span v-if="scope.row.calType == 1">表记读数</span>
            <span v-if="scope.row.calType == 32">红外测温</span>
        </template>
       </el-table-column>
      <el-table-column prop="sitesNo" label="预置位数量"></el-table-column>
      <el-table-column prop="metersNo" label="表记数量"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
            <span v-if="scope.row.status == 1">停用</span>
            <span v-if="scope.row.status == 0">启用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"  
            @click="handledetails(scope.row)"          
          >详情</el-button>
          <el-button v-if="scope.row.status ==0"
            size="mini"
            type="text"  
            @click="changeStatus(scope.row)"          
          >停用</el-button>
           <el-button v-if="scope.row.status ==1"
            size="mini"
            type="text"  
            @click="changeStatus(scope.row)"           
          >启用</el-button>
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.status == 1"
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
      @pagination="getItemList"
    />  
     <!-- 添加或修改巡检任务对话框 -->
    <el-dialog :title="detailTitle" :visible.sync="showinfo"  :width="dialogWidth" append-to-body>
      
      <el-form ref="form" :model="form" :rules="rule" >
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务名称" prop="itemName" label-width="100px">
                <el-input v-model="form.itemName" placeholder="请输入任务名称"
                 :disalbled="true" />
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="12">
            <el-form-item label="任务类型" prop="itemType" label-width="100px">
                 <el-select v-model="form.itemType" 
                              placeholder="巡检任务类型" >
                     <el-option
                            v-for="type in itemtypes"
                            :key="type.dictValue"
                            :label="type.dictLabel"
                            :value="type.dictValue">
                          </el-option>
                 </el-select>
            </el-form-item>
          </el-col>
         </el-row>
         <el-row  v-if="form.itemType == 2?true:false">
            <el-col :span="12" >
              <el-form-item label="巡检机器人" prop="robotId" label-width="100px">
                  <el-select v-model="form.robotId" 
                                placeholder="巡检机器人" >
                      <el-option
                              v-for="robot in robots"
                              :key="robot.robotId"
                              :label="robot.robotName"
                              :value="robot.robotId">
                            </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
         </el-row>
         <el-row>
           <el-col :span="12">
            <el-form-item label="算法类型" prop="calType"  label-width="100px">
                 <el-select v-model="form.calType" 
                              placeholder="算法类型" >
                     <el-option
                            v-for="calType in calTypes"
                            :key="calType.id"
                            :label="calType.name"
                            :value="calType.id">
                          </el-option>
                 </el-select>
            </el-form-item>
          </el-col>
         </el-row>
         <el-row >
          <el-col :span="12">
            <el-form-item label="任务状态" prop="status" label-width="100px">
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
        <div v-for="(item,index) in form.dynamicItem" :key=index >
            <el-row  v-if="form.itemType != 2">
              <el-col :span="5">
                    <el-form-item
                      label=区域
                      label-width="60px"
                      :prop="'dynamicItem.' + index + '.pointArea'"
                      :rules="[{
                        required: true, message: '区域不能为空', trigger: ['change','blur']
                      }]"
                      >
                      <treeselect v-model="item.pointArea" :options="arealist" :instanceId=index 
                            noOptionsText="没有区域选项" 
                            :normalizer="normalizer" @select="getAreaCameras" placeholder="选择区域" />
                    </el-form-item>
              </el-col>
              <el-col :span="5">
                    <el-form-item
                      label=智能终端
                      label-width="80px"
                      :prop="'dynamicItem.' + index + '.pointCamera'"
                      :rules="[{
                        required: true, message: '智能终端不能为空', trigger: ['change','blur']
                      }]"
                    > 
                    <el-select v-model="item.pointCamera" 
                              @change="getSites($event,index)"
                              placeholder="请选择" >
                        <el-option
                            v-for="camera in item.cameras"
                            :key="camera.cameraId"
                            :label="camera.cameraName"
                            :value="camera.cameraId">
                          </el-option>
                      </el-select>
                    </el-form-item>
               </el-col>
              <el-col :span="4">
                    <el-form-item
                      label=预置位
                      label-width="70px"
                      :prop="'dynamicItem.' + index + '.pointSite'"
                      :rules="[{
                        required: true, message: '预置位不能为空', trigger: ['change','blur']
                      }]"
                    > 
                    <el-select v-model="item.pointSite" 
                              @change="getDetectionItems($event,index)"
                              placeholder="请选择预置位" >
                        <el-option
                            v-for="site in item.sites"
                            :key="site.siteId"
                            :label="site.siteName"
                            :value="site.siteId">
                          </el-option>
                      </el-select>
                    </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item 
                  label=顺序
                  label-width="60px"
                  :prop="'dynamicItem.' + index + '.pointSiteNo'"
                  :rules="[{
                    required: true, message: '顺序不能为空', trigger:['change','blur']
                  }]"
                > 
                  <el-input type= "number" v-model.number="item.pointSiteNo" 
                  oninput="value=value.replace(/[^\d]/g,'')"
                  placeholder="" />
                </el-form-item>
              </el-col> 
              <el-col :span="4">
                    <el-form-item
                      label=巡检项
                      label-width="70px"
                      :prop="'dynamicItem.' + index + '.pointItem'"
                      :rules="[{
                        required: true, message: '巡检项不能为空', trigger: ['change','blur']
                      }]"
                      >
                      <el-select v-model="item.pointItem" multiple placeholder="请选择"  v-if="form.calType !=32">
                          <el-option
                            v-for="detect in item.detectItems"
                            :key="detect.meterId"
                            :label="detect.name"
                            :value="detect.meterId">
                          </el-option>
                      </el-select>
                        <el-select v-model="item.pointItem" multiple placeholder="请选择"  v-if="form.calType ==32">
                          <el-option
                            v-for="detect in item.detectItems"
                            :key="detect.areaTempId"
                            :label="detect.areaTempName"
                            :value="detect.areaTempId">
                          </el-option>
                      </el-select>
                    </el-form-item>
                </el-col> 
                 <el-col :span="2">
                      <el-button  icon="el-icon-plus" @click="addItemPoints(item, index)" ></el-button>
                      <el-button   icon="el-icon-delete" v-if="index !== 0" @click="deleteItemPoint(item, index)" ></el-button>
                </el-col>
            </el-row>
            <el-row  v-if="form.itemType == 2">
              <el-col :span="8">
                    <el-form-item
                      label=预置位
                      label-width="70px"
                      :prop="'dynamicItem.' + index + '.pointSite'"
                      :rules="[{
                        required: true, message: '预置位不能为空', trigger: ['change','blur']
                      }]"
                    > 
                    <el-select v-model="item.pointSite" 
                              filterable   
                              @change="getDetectionItems($event,index)"
                              placeholder="请选择预置位" >
                        <el-option
                            v-for="site in robotSites"
                            :key="site.siteId"
                            :label="site.siteName"
                            :value="site.siteId">
                          </el-option>
                      </el-select>
                    </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item 
                  label=顺序
                  label-width="60px"
                  :prop="'dynamicItem.' + index + '.pointSiteNo'"
                  :rules="[{
                    required: true, message: '顺序不能为空', trigger:['change','blur']
                  }]"
                > 
                  <el-input type= "number" v-model.number="item.pointSiteNo" 
                  oninput="value=value.replace(/[^\d]/g,'')"
                  placeholder="" />
                </el-form-item>
              </el-col> 
              <el-col :span="8">
                    <el-form-item
                      label=巡检项
                      label-width="70px"
                      :prop="'dynamicItem.' + index + '.pointItem'"
                      :rules="[{
                        required: true, message: '巡检项不能为空', trigger: ['change','blur']
                      }]"
                      >
                      <el-select v-model="item.pointItem" multiple placeholder="请选择">
                          <el-option
                            v-for="detect in item.detectItems"
                            :key="detect.meterId"
                            :label="detect.name"
                            :value="detect.meterId">
                          </el-option>
                      </el-select>
                    </el-form-item>
                </el-col> 
              <el-col :span="3">
                      <el-button icon="el-icon-plus" @click="addItemPoints(item, index)"></el-button>
                      <el-button  icon="el-icon-delete"  v-if="index !== 0" @click="deleteItemPoint(item, index)"></el-button>
              </el-col>
            </el-row>
          
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="submitForm('form')">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 预置位图片 -->
    <el-dialog
      :title="imgTitle"
      :visible.sync="showSiteImg"
      width="30%" append-to-body>
      <el-image
        style="width: 300px; height: 300px"
        :src="imgUrl"
        >
      </el-image>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="hideSiteImg">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 详情弹窗 -->
     <el-dialog :title="detailTitle" v-bind:visible.sync="showdetail" width='60%' append-to-body>
        <el-row style="margin-bottom: 20px;">
          <el-col :span="4">
            <div class="detail-title">巡检任务名称</div>
          </el-col>
          <el-col :span="20">
            <div class="detail-content">{{detailForm.itemName}}</div>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 25px;">
          <el-col :span="4">
            <div class="detail-title">巡检内容</div>
          </el-col>
          <el-col :span="20">
            <el-table v-loading="loading" :data="detailForm.itemDetailList" default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
              <el-table-column prop="areaName" label="区域名称"></el-table-column>
              <el-table-column prop="cameraName" label="智能感知终端"></el-table-column>
              <el-table-column prop="siteName" label="预置位"></el-table-column>
              <el-table-column prop="siteNo" label="顺序"></el-table-column>
              <el-table-column prop="meterNames" label="表记名称"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
     </el-dialog>
     
  </div>
</template>

<script>
import {listPolpatrolItem}  from  "@/api/polpatrol/itemsanalysis"
import {listSiteMeters,addpatrolitem,delPatrolItem,updateItem,getDetails,validateUseStatus}  from  "@/api/polpatrol/itemsanalysis";
import { listDefecttype } from "@/api/device/defecttype";
import { listArea } from "@/api/device/area";
import { listAreaTemp } from "@/api/device/areaTemp";
import { listCamera} from "@/api/device/camera";
import { getSite,listSite } from "@/api/device/site";
import { getDicts } from "@/api/system/dict/data";
import { listRobot} from "@/api/device/robot";
import { listRobotSiteVoById} from "@/api/videomonitoring/videos";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";


export default {
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      //新增任务弹出框的宽度
      dialogWidth:"85%",
      //巡检类型：普通巡检1，机器人巡检2
      itemtypes:[],
      //巡检机器人列表
      robots:[],
      //校验规则
      rules:{},
      // 表格树数据
      itemList: [],
      total:0,
      //机器人的预置位集合
      robotSites:[],
      //算法类型:
      calTypes:[],
      // 弹出层标题
      detailTitle: "",
      imgTitle:"",
      showRobot:false,
      // 是否显示弹出层
      showinfo: false,
      showdetail:false,
      showSiteImg:false,
      imgUrl:undefined,
      // 状态数据字典
      statusOptions: [],
      areaParams: {
        areaName: undefined,
        status: undefined
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemName: undefined
      },
      //详情信息
      detailForm:{
        itemName:undefined,
        itemDetailList:[]
      },
      // 表单参数
      form: {
        itemName:undefined, 
        itemType:undefined, 
        robotId:0, 
        status:1,
        calType:undefined,
        dynamicItem:[
          {
            pointArea:undefined,
            pointCamera:undefined,
            pointSite:undefined,
            pointSiteNo:undefined,
            pointItem:undefined,
            cameras:[],
            sites:[],
            detectItems:[],
          }
        ]      
      },

      arealist:[],
      defecttypes:[],
      polpatorlPoints:[],
      // 表单校验
      rule: {
        itemName: [
            { required: true, message: '请输入任务名称', trigger: 'blur' },
            { max: 100, message: '长度在100个字符以内', trigger: 'blur' }
          ],
        itemType: [
          { required: true, message: '请输入任务类型', trigger: 'change' },
        ],
        calType: [
          { required: true, message: '请输入算法类型', trigger: 'change' },
        ]
      }    
    };
  },
  watch:{
      'form.itemType':{
          handler(val){
              this.resetDynamicItems();
              if(val ==2){
                  this.dialogWidth = '70%'
                  this.form.robotId= this.robots[0].robotId;
                  this.calTypes=[{
                      id:1,
                      name:"表记读数"
                  }]
              }else{
                 this.calTypes=[{
                      id:1,
                      name:"表记读数"
                  },{
                      id:32,
                      name:"红外测温"
                  }]
                  this.dialogWidth="85%";
                  this.getTreeselect();
              }
          }
      },
      'form.robotId':{
          handler(val){
            this.resetDynamicItems();
            listRobotSiteVoById(val).then(response => {
                this.robotSites = response.rows;
            })
          }
      },
      'form.calType':{
          handler(val){
            this.resetDynamicItems();
          }
      }
  },
  created() {
      this.getRobots();
      this.getItemTypes();
      this.getItemList();
      this.getDefectTypes();
  },
  methods: {
    getRobots(){
         listRobot().then(response => {
              this.robots=response.rows;
        })
    },
    getItemTypes(){
      getDicts("patrol_item_type").then(response => {
          this.itemtypes = response.data;
      })
    },
     // 品牌字典翻译
    getTypeLabel(row, column) {
      return this.selectDictLabel(this.itemtypes, row.itemType);
    },
    handleQuery(){
      this.getItemList();
    },
    resetQuery() {
      this.queryParams.itemName = undefined;
      this.queryParams.itemDesc = undefined;
      this.resetForm("queryForm");
      this.handleQuery();
    },
 
    getItemList() {
      this.loading = true;
      listPolpatrolItem(this.queryParams).then(response => {
         this.itemList = response.rows;
         this.total = response.total;
         this.loading = false;
      });
    },
    
     /** 新增按钮操作 */
    handleAdd() {
      this.showinfo = true;
      this.detailTitle = "新增巡检任务";
      this.reset();
    },
    addItemPoints(){
      this.form.dynamicItem.push({
          pointArea:undefined,
          pointSite:undefined,
          robotId:undefined,
          pointSiteNo:undefined,
          pointItem:undefined,
          cameras:[],
          sites:[],
          detectItems:[],
          key: Date.now()
        });
    },

    deleteItemPoint(item, index) {
      this.form.dynamicItem.splice(index, 1);
    },
     /** 查询区域下拉树结构 */
    getTreeselect() {
      listArea().then(response => {
        this.arealist = [];
        const data = { areaId: 0, areaName: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "areaId", "parentId");
        this.arealist.push(data);
      });
    },
    getDefectTypes(){
        listDefecttype().then(response => {
        this.arealist = [];
        const data = { defectTypeId: 0, areaName: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "defectTypeId", "parentId");
        this.defecttypes.push(data);
        })
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
    resetDynamicItems(){
      this.form.dynamicItem=[{
          pointArea:undefined,
          pointSite:undefined,
          robotId:undefined,
          pointSiteNo:undefined,
          pointItem:undefined,
          cameras:[],
          sites:[],
          detectItems:[],
          key: Date.now()
      }]
    },
     // 取消按钮
    cancel() {
      this.showinfo = false;
      this.reset();
      this.$refs.form.resetFields();
    },
    getAreaCameras(node,instanceId){
      var areaId = node["areaId"];     
      var qu={
        areaId:areaId
      }
      if(this.form.calType == 32){
        qu.hasInfrared=1
      }
      listCamera(qu).then(response => {
        if(response.rows !=null){
          this.form.dynamicItem[instanceId].cameras= response.rows;
        }
      });
    },
    getSites(node,index){
       var areaId = this.form.dynamicItem[index].pointArea;
       var cameraId = this.form.dynamicItem[index].pointCamera;
       var qu={
          areaId:areaId,
          cameraId:cameraId
       }
       listSite(qu).then(response => {
          if(response.rows !=null){
            this.form.dynamicItem[index].sites= response.rows;
          }
      });
    },
    getDetectionItems(event,index){
      if(this.form.calType == 1){
          var siteId = this.form.dynamicItem[index].pointSite;
          var qu={
            siteId:siteId
          }
          listSiteMeters(qu).then(response => {
            if(response.rows !=null){
              this.form.dynamicItem[index].detectItems= response.rows;
            }
          });
      }else{
          var areaId = this.form.dynamicItem[index].pointArea;
          var cameraId = this.form.dynamicItem[index].pointCamera;
          var qu={
              areaId:areaId,
              cameraId:cameraId
          }
         listAreaTemp(qu).then(response => {
            if(response.rows !=null){
              this.form.dynamicItem[index].detectItems= response.rows;
            }
          });
      }
      
    },
     /** 清除提交按钮 */
      submitForm(formName){
        this.$refs[formName].validate(valid => {    
          if(valid){
            var pointsnew =[];
            var metersNo =0;
            for(var i=0;i< this.form.dynamicItem.length;i++){
              var pointCamera=  this.form.dynamicItem[i].pointCamera;
              var pointSite= this.form.dynamicItem[i].pointSite;
              var pointSiteNo= this.form.dynamicItem[i].pointSiteNo;
              var pointItem= this.form.dynamicItem[i].pointItem;
              metersNo = metersNo+pointItem.length;
              var obj = {};
              obj.camera=pointCamera;
              obj.site= pointSite;
              obj.siteNo = pointSiteNo;
              obj.detect=pointItem;
              pointsnew.push(obj);
            }
            var submitForm={};
            submitForm.itemPoints = JSON.stringify(pointsnew);
            submitForm.itemName= this.form.itemName;
            submitForm.itemType = this.form.itemType;
            submitForm.calType=this.form.calType;
            submitForm.robotId = this.form.robotId;
            submitForm.status = this.form.status;
            submitForm.sitesNo=this.form.dynamicItem.length;
            submitForm.metersNo=metersNo;
            addpatrolitem(submitForm).then(response => {
              if (response.code === 200) {
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
                this.showinfo = false;
                this.getItemList();
              }
            }) 
          }else{
            return false;
          }             
        })
      },
         /** 删除按钮操作 */
      handleDelete(row) {
        this.$confirm('是否确认删除名称为"' + row.itemName + '"的数据项?', "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(function() {
            return delPatrolItem(row.itemId);
          }).then(() => {
            this.getItemList();
            this.msgSuccess("删除成功");
          }).catch(function() {});
      },
      changeStatus(row){
        if(row.status == 0){
          validateUseStatus(row.itemId).then(response => {
              this.$confirm('是否确认要停用此任务？', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }).then(function() { 
                row.status = 1;           
                return updateItem(row);             
              }).then(() => {
                this.getItemList();
                this.msgSuccess("状态修改成功");
              }).catch(function() {}); 
              });
        }else{
             row.status = 0;    
             updateItem(row).then(response => {
                this.getItemList();
                this.msgSuccess("状态修改成功");
             }) 
        }
    },
    handledetails(row) {
      this.showdetail = true;
      this.detailTitle= "巡检任务详情";
      getDetails(row.itemId).then(response => {
        this.detailForm.itemDetailList = response.rows;
        this.detailForm.itemName = row.itemName;
      });
    },
    reset() {
         this.form= {
          itemName:undefined,
          // itemDesc:undefined,        
          itemPoints:undefined,
          robotId:0,
          status:1,
          sitesNo:0,
          metersNo:0,
          calType:undefined,
          dynamicItem:[
            {
              pointArea:undefined,
              pointSite:undefined,
              pointMeter:[],
              cameras:[],
              sites:[],
              meters:[],
            }
          ]       
        }
     },
     previewSite(item){
        if(item.pointSite == undefined){
           this.$message({
                type: 'error',
                message: '请选择预置位'
           })
           return;
        }
        getSite(item.pointSite).then(response => {
           this.showSiteImg=true;
           this.imgTitle=response.data.siteName;
           this.imgUrl=process.env.VUE_APP_BASE_API+response.data.siteImgUrl;
        })
     },
     hideSiteImg(){
        this.showSiteImg=false;
        this.imgTitle=undefined;
        this.imgUrl=undefined;
     }
  }
};
</script>
<style lang="scss" scoped>
  /deep/.el-dialog__body {
    padding: 10px 0px;
  }
  .detail-title {
    padding-right: 10px;
    text-align: right;
    font-size: 14px;
    color: #333;
  }
  .detail-content {
    padding-left: 10px;
    text-align: left;
    font-size: 12px;
    color: #666;
  }
  

</style>