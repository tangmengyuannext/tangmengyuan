<template>
  <div class="app-container">
    <el-row class="videoContent">
      <div class="videoIframe">
        <iframe ref="videoiframes" name="videoiframes" id="videoiframes" :src="iframesrc" frameborder="0" scrolling="no" style="width:1530px; height:540px;z-index:-1;"></iframe>
      </div>
    </el-row>
    <el-row ref="tableview" class="yuzhiweiTable">
      <div class="yuzhiweimain">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-if="ishasAddtn"
              v-hasPermi="['device:camera:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-if="ishassiteBtn"
              v-hasPermi="['device:camera:edit']" >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-if="ishassiteBtn"
              v-hasPermi="['device:camera:remove']">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="cameraName" label="智能感知终端"></el-table-column>
          <el-table-column prop="areaName" label="所属区域"></el-table-column>
          <el-table-column prop="siteName" label="预置位名称"></el-table-column>
          <el-table-column prop="sort" label="预置位顺序编号" width="150"></el-table-column>
          <el-table-column prop="preSiteX" label="机器人预置位x坐标" v-if="ishasrobotid"></el-table-column>
          <el-table-column prop="preSiteY" label="机器人预置位y坐标" v-if="ishasrobotid"></el-table-column>
          <el-table-column prop="frequency" label="检测频率" width="150" :formatter="pinlvFormat"></el-table-column>
          <el-table-column prop="duration" label="检测时间" width="150" :formatter="durationFormat"></el-table-column>
          <el-table-column prop="remark" label="备注" width="150"></el-table-column>
          <el-table-column fixed="right" label="操作" width="330">
            <template slot-scope="scope">
              <!-- <el-button style="margin-bottom:10px" size="mini" type="text" @click="handleRobotconfig(scope.row)" 
              v-if="ishasrobotid" v-hasPermi="['device:camera:config']">机器人配置</el-button> -->
              <!-- <el-button style="margin-bottom:10px" size="mini" type="text" @click="handleTimeconfig(scope.row)" 
              v-hasPermi="['device:camera:config']" >采集时间配置</el-button> -->
              <el-button style="margin-bottom:10px" size="mini" type="text" @click="handleEquipment(scope.row)" 
              v-hasPermi="['device:camera:config']">配置算法</el-button>
              <el-button style="margin-bottom:10px" size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" 
              v-hasPermi="['device:camera:edit']" v-if="ishasEditBtn">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                v-hasPermi="['device:camera:remove']" v-if="ishasDelBtn">删除</el-button>
              <el-button style="margin-bottom:10px" size="mini" type="text" @click="handlecapture(scope.row)" 
              v-hasPermi="['device:camera:config']">抓图</el-button>
              <el-button style="margin-bottom:10px" size="mini" type="text" @click="handleupimg(scope.row)"
              v-hasPermi="['device:camera:config']">上传底图</el-button>
              <el-button style="margin-bottom:10px" size="mini" type="text" @click="handledetection(scope.row)" 
              v-hasPermi="['device:camera:config']" :disabled="scope.row.siteImgUrl==''?true:false">配置检测点</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </el-row>

    <!-- 机器人配置 -->
    <!-- <el-dialog title="机器人预置位配置" :visible.sync="robotsitedialog" style="top:30%;" append-to-body>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" v-hasPermi="['device:camera:add']" @click="Addrobotsite" v-if="robotsiteData.length==0?true:false">新增</el-button>
        </el-col>
      </el-row>
      <el-table :data="robotsiteData" border style="width: 100%">
        <el-table-column prop="robotId" label="机器人id"></el-table-column>
        <el-table-column prop="cameraName" label="智能感知终端"></el-table-column>
        <el-table-column prop="siteId" label="摄像头预置位id"></el-table-column>
        <el-table-column prop="preSiteX" label="机器人预置位x坐标"></el-table-column>
        <el-table-column prop="preSiteY" label="机器人预置位y坐标"></el-table-column>
        <el-table-column label="操作" width="190">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['device:camera:edit']" @click="Editrobotsite(scope.row)" >修改</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" v-hasPermi="['device:camera:remove']" @click="Deleterobotsite(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="robotsiteinnerVisible" width="40%" style="top: 30%;" :title="robotsiteTitle" append-to-body>
        <el-form ref="robotconfigform" :model="robotconfigform" :rules="robotconfigrules" label-width="150px">
          <el-form-item label="智能感知终端" prop="cameraId">
            <el-select v-model="robotconfigform.cameraId" clearable filterable placeholder="请选择" :disabled="true">
              <el-option v-for="dict in shexiangtouoptions" :key="dict.cameraId" :label="dict.cameraName" :value="dict.cameraId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="摄像头预置位ID" prop="siteId">
            <el-input type="text" v-model="robotconfigform.siteId" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getrobotzuobiao">获取机器人预置位坐标</el-button>
          </el-form-item>
          <el-form-item label="机器人预置位x坐标" prop="preSiteX">
            <el-input type="text" v-model="robotconfigform.preSiteX"></el-input>
          </el-form-item>
          <el-form-item label="机器人预置位y坐标" prop="preSiteY">
            <el-input type="text" v-model="robotconfigform.preSiteY"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="robotconfigSave">确 定</el-button>
          <el-button @click="robotconfigCancel">取 消</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="robotsitedialog = false">关 闭</el-button>
      </div>
    </el-dialog> -->

    <!-- 添加或修改预置位 对话框-->
    <el-dialog :title="title" :visible.sync="open" width="50%" style="top: 30%;" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
         <!-- v-if="ishassiteBtn" -->
        <el-form-item label="预置位名称" prop="siteName">
          <el-input type="text" v-model.trim="form.siteName"></el-input>
        </el-form-item>
        <el-form-item label="预置位顺序编号" prop="sort">
          <el-input type="text" v-model.trim="form.sort" :disabled="form.siteId?true:false"></el-input>
          <!-- <el-select v-model="form.sort" clearable filterable placeholder="请选择" :disabled="title == '修改预置位'?true:false" @change="sortchange"> 
            <el-option v-for="item in siteOptions" :key="item" :label="item" :value="item"></el-option>
          </el-select> -->
        </el-form-item>
        <el-row v-if="ishasrobotid">
          <el-col :span="3">
            <el-form-item label="机器人坐标">
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="X" prop="preSiteX" label-width="45px">
              <el-input type="text" v-model="form.preSiteX"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Y" prop="preSiteY" label-width="45px">
              <el-input type="text" v-model="form.preSiteY"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" style="margin-left:10px;margin-top:5px;" @click="getcoordinate">获取当前机器人坐标</el-button>
          </el-col>
        </el-row>
        <el-form-item label="关联设备" prop="equipmentId">
          <el-select v-model="form.equipmentId" clearable filterable placeholder="请选择">
            <el-option v-for="dict in equipmentOptions" :key="dict.equipmentId" :label="dict.equipmentName" :value="dict.equipmentId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检测时间" prop="duration">
          <el-select v-model="form.duration" placeholder="请选择">
              <el-option
                v-for="dict in durationOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="检测频率" prop="frequency">
          <el-select v-model="form.frequency" placeholder="请选择">
              <el-option
                v-for="dict in timeoptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="所属区域" prop="areaId">
          <el-select v-model="form.areaId" clearable filterable placeholder="请选择" :disabled="true">
            <el-option v-for="dict in areaOptions" :key="dict.areaId" :label="dict.areaName" :value="dict.areaId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="智能感知终端" prop="cameraId">
          <el-select v-model="form.cameraId" clearable filterable placeholder="请选择" :disabled="true">
            <el-option v-for="dict in shexiangtouoptions" :key="dict.cameraId" :label="dict.cameraName" :value="dict.cameraId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :disabled="sitedisable" >确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 配置算法 -->
    <el-dialog :title="guanliantitle" :visible.sync="dialogVisible" width="30%" style="top: 30%;" append-to-body>
      <el-input  placeholder="输入关键字进行过滤"  v-model="filterText"  clearable></el-input>
      <el-tree
        style="height:250px;overflow:auto;"
        class="filter-tree"
        :data="yuzhiweidata"
        :props="yuzhiweiProps"
        show-checkbox
        default-expand-all
        node-key="defectLabel"
        highlight-current
        :filter-node-method="filterNode"
        @check="handleCheckChange"
        ref="yuzhiweitree">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveConfig">确 定</el-button>
        <el-button type="primary" @click="quxiaoconfig">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 配置采集时间 -->
    <el-dialog title="采集时间配置" :visible.sync="TimeouterVisible" width="50%" style="top: 30%;" append-to-body>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" v-hasPermi="['device:camera:add']" @click="AddtimeClick" v-if="isaddtime">新增</el-button>
        </el-col>
      </el-row>
      <el-table :data="TimeconfigData" border max-height="400" style="width: 100%">
        <el-table-column prop="timeId" label="采集时间编号" width="100"></el-table-column>
        <el-table-column prop="start" label="采集开始时间"></el-table-column>
        <el-table-column prop="end" label="采集结束时间"></el-table-column>
        <el-table-column prop="frequency" label="采集频次" :formatter="pinlvFormat"></el-table-column>
        <el-table-column label="操作" width="190">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['device:camera:edit']" @click="EdittimeClick(scope.row)" >修改</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" v-hasPermi="['device:camera:remove']" @click="DeletetimeClick(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="TimeinnerVisible" width="40%" style="top: 30%;" :title="timeTitle" append-to-body>
        <el-form ref="timeconfigform" :model="timeconfigform" :rules="timeconfigrules" label-width="120px">
          <el-form-item label="采集开始时间" prop="start">
            <el-time-select placeholder="起始时间" v-model="timeconfigform.start" :picker-options="{start:'00:00', step: '00:30', end: '24:00' }">
            </el-time-select>
          </el-form-item>
          <el-form-item label="采集结束时间" prop="end">
            <el-time-select placeholder="结束时间" v-model="timeconfigform.end" :picker-options="{start: '00:00', step:'00:30', end:'24:00', minTime:timeconfigform.start }">
            </el-time-select>
          </el-form-item>
          <el-form-item label="采集频次" prop="frequency">
            <el-select v-model="timeconfigform.frequency" @change="pincichange" placeholder="请选择采集频次">
            <el-option
              v-for="dict in timeoptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="timeconfigSave">确 定</el-button>
          <el-button @click="timeconfigCancel">取 消</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="TimeouterVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 上传图片 -->
    <el-dialog title="提示" :visible.sync="upimgdialog" width="40%" style="top: 30%;" append-to-body> 
      <el-form ref="imgform" :model="imgform" class="demo-form-inline">
        <el-form-item label="图片所在地址：">
          <el-input v-model="imgform.imgdizhi" class="imgdizhis" style="width:520px;"></el-input>
        </el-form-item>
      </el-form>
      
        <!-- -->
      <el-upload
        class="upload-demo"
        :headers="discernheader" 
        :action="discernaction"
        :limit="1"
        :on-success="handleimgsuccess"
        :before-upload="beforeAvatarUpload"
        :file-list="fileListimg"
        list-type="picture">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelupimg">取 消</el-button>
        <el-button type="primary" :disabled="issuccess" @click="saveupimg">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 检测点 -->
    <el-dialog title="配置检测点" :visible.sync="detectionopen" style="top: 30%;" width="50%" append-to-body>
      <el-row class="xinzeng">
        <el-button type="primary" icon="el-icon-plus" size="mini" v-hasPermi="['device:camera:add']" @click="Adddetectionclick">新增</el-button>
      </el-row>
      <el-table :data="detectiontabledata" border style="width: 100%;margin-top:10px;">
        <el-table-column label="检测点ID" align="center" prop="detectionId" />
        <el-table-column label="检测点名称" align="center" prop="detectionName" />
        <el-table-column label="左上角坐标" align="center" prop="point1" />
        <el-table-column label="右下角坐标" align="center" prop="point2" />
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button style="margin-bottom:10px"
              size="mini"
              type="text"
              @click="Editdetection(scope.row)"
              v-hasPermi="['device:camera:edit']"
            >修改</el-button>
            <el-button style="margin-bottom:10px"
              size="mini"
              type="text"
              @click="Deletedetection(scope.row)"
              v-hasPermi="['device:camera:remove']"
            >删除</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleMarker(scope.row)"
              v-hasPermi="['device:camera:config']"
            >配置表计</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog width="1000px" style="top: 30%;" :title="detectiontitle" :visible.sync="innerDetection" append-to-body>
        <el-row>
          <el-col :span="11">
            <iframe ref="detectioniframe" id="detectioniframes" :src="detectioncanvasurl" frameborder="0"
            style="width: 430px; height: 340px;z-index:-1;"></iframe>
          </el-col>
          <el-col :span="13">
            <el-form :model="detectionform" :rules="detectionrules" ref="detectionform" label-width="100px" class="demo-form">
              <el-form-item label="检测点名称" prop="detectionName">
                <el-input v-model="detectionform.detectionName"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="getzuobiao">获取检测点标注坐标</el-button>
              </el-form-item>
              <div v-for="(domain, index) in detectionform.domains" :key="domain.key">
                <el-row>
                  <el-col :span="4">
                    <el-form-item :label="'左上角坐标' + index">
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label="x" label-width="30px">
                      <el-input v-model="domain.x"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label="y" label-width="30px">
                      <el-input v-model="domain.y"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="4">
                    <el-form-item :label="'右下角坐标' + index">
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label="ex" label-width="30px">
                      <el-input v-model="domain.ex"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label="ey" label-width="30px">
                      <el-input v-model="domain.ey"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <!-- <el-form-item label-width="5px">
                      <el-button class="el-icon-close" @click.prevent="removeDomain(domain)"></el-button>
                    </el-form-item> -->
                  </el-col>
                </el-row>
              </div>
              <!-- <el-form-item>
                <el-button @click="addDomain">添加检测点</el-button>
              </el-form-item> -->
            </el-form>
          </el-col>
        </el-row>
        <!-- <div style="clear:both;"></div> -->
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="detectionSave">保 存</el-button>
            <el-button @click="detectionCencel">取 消</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detectionDialog">关闭</el-button>
      </div>
    </el-dialog>
    
    <!-- 表计dialog -->
    <el-dialog title="配置表计" :visible.sync="outerMeter" width="50%" style="top: 30%;" append-to-body>
      <el-row class="xinzeng">
        <el-button type="primary" icon="el-icon-plus" size="mini" v-hasPermi="['device:camera:add']" @click="Addmeterclick">新增</el-button>
      </el-row>
      <el-table :data="meterData" border style="width: 100%;margin-top:10px;">
        <el-table-column label="表计ID" align="center" prop="meterId" />
        <el-table-column label="表计名称" align="center" prop="name" />
        <el-table-column label="表计类型" align="center" prop="type" :formatter="metertypeFormat"/>
        <el-table-column label="中心坐标" align="center" prop="point0" />
        <el-table-column label="左上角坐标" align="center" prop="point1" />
        <el-table-column label="右下角坐标" align="center" prop="point2" />
        <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button style="margin-bottom:10px" @click="Editmeterclick(scope.row)" type="text" v-hasPermi="['device:camera:edit']" size="small">修改</el-button>
            <el-button style="margin-bottom:10px" @click="Deletemeterclick(scope.row)" type="text" v-hasPermi="['device:camera:remove']" size="small">删除</el-button>
            <el-button style="margin-bottom:10px" size="small" type="text" @click="Readingclick(scope.row)" 
              v-hasPermi="['device:camera:config']" v-if="scope.row.type=='2'?true:false">读数</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog width="1000px" style="top: 30%;" :title="metertitle" :visible.sync="innerMeter" append-to-body>
        <el-row>
          <el-col :span="11">
            <iframe ref="meteriframe" id="meteriframes" :src="metercanvasurl" frameborder="0"
            style="width: 430px; height: 340px;z-index:-1;"></iframe>
          </el-col>
          <el-col :span="13">
            <el-form ref="meterform" :model="meterform" :rules="meterrules" label-width="90px">
              <el-form-item label="表计名称" prop="name">
                <el-input v-model="meterform.name"></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="18">
                  <el-form-item label="表计类型" prop="type">
                    <el-select v-model="meterform.type" @change="changetype" clearable filterable placeholder="请选择">
                      <el-option
                        v-for="dict in typeoption"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" size="mini" v-hasPermi="['device:camera:add']" @click="Addmeterbtn" v-if="meterform.type == '1'?true:false">新增表计</el-button>
                </el-col>
              </el-row>
              <el-form-item label="关联表" prop="meterBaseId">
                <el-select v-model="meterform.meterBaseId" clearable filterable placeholder="请选择">
                  <el-option
                    v-for="dict in changetypeoption"
                    :key="dict.meterBaseId"
                    :label="dict.meterBaseName"
                    :value="dict.meterBaseId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button @click="getmeterzuobiao">获取表计标注坐标</el-button>
              </el-form-item>
              <div v-for="(domain, index) in meterform.domains" :key="domain.key">
                <el-row>
                  <el-col :span="4">
                    <el-form-item :label="meterform.type==1?'中心点坐标':'左上角坐标' + index">
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label="x" label-width="30px">
                      <el-input v-model="domain.x"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label="y" label-width="30px">
                      <el-input v-model="domain.y"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-if="meterform.type==1?false:true">
                  <el-col :span="4">
                    <el-form-item :label="'右下角坐标' + index">
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label="ex" label-width="30px">
                      <el-input v-model="domain.ex"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label="ey" label-width="30px">
                      <el-input v-model="domain.ey"></el-input>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="2">
                    <el-form-item label-width="5px">
                      <el-button class="el-icon-close" @click.prevent="removezbmeter(domain)"></el-button>
                    </el-form-item>
                  </el-col> -->
                </el-row>
              </div>
              <!-- <el-form-item>
                <el-button @click="addzbmeter">添加表计</el-button>
              </el-form-item> -->
            </el-form>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="savemeter">保 存</el-button>
          <el-button @click="cancelmeter">取 消</el-button>
        </div> 
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">关闭</el-button>
      </div>
    </el-dialog>

    
    <el-dialog :title="addmetertitle" :visible.sync="addmeteropen" width="50%" style="top: 30%;" append-to-body>
      <el-form ref="addmeterform" :model="addmeterform" :rules="addmeterrules" label-width="100px" class="demo-form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="表计类型" prop="meterType">
              <el-select v-model="addmeterform.meterType" :disabled="true" clearable filterable placeholder="请选择">
                <el-option
                  v-for="dict in addmeterTypeoption"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="表计名称" prop="meterBaseName">
              <el-input v-model="addmeterform.meterBaseName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最小刻度" prop="minScale">
              <el-input v-model="addmeterform.minScale"></el-input>
            </el-form-item> 
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大刻度" prop="maxScale">
              <el-input v-model="addmeterform.maxScale"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="中间刻度" prop="middleScale">
              <el-input v-model="addmeterform.middleScale"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中间角度" prop="middleDegree">
              <el-input v-model="addmeterform.middleDegree"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最小角度" prop="minDegree">
              <el-input v-model="addmeterform.minDegree"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大角度" prop="maxDegree">
              <el-input v-model="addmeterform.maxDegree"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="正常值" prop="val">
              <el-input v-model="addmeterform.val"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="unit">
              <el-input v-model="addmeterform.unit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addmeterformSave">保 存</el-button>
        <el-button @click="addmeterformCencel">取 消</el-button>
      </div>
    </el-dialog>

  <!-- 读数项dialog -->
    <el-dialog title="配置读数项" :visible.sync="outerReading" width="50%" style="top: 30%;" append-to-body>
      <el-row class="xinzeng">
        <el-button type="primary" icon="el-icon-plus" size="mini" v-hasPermi="['device:camera:add']" @click="AddReadingclick">新增</el-button>
      </el-row>
      <el-table :data="readingData" border style="width: 100%;margin-top:10px;">
        <el-table-column prop="readingId" label="读数ID">
        </el-table-column>
        <el-table-column prop="readingName" label="读数名称">
        </el-table-column>
        <el-table-column prop="sort" label="顺序">
        </el-table-column>
        <el-table-column prop="point1" label="左上角坐标">
        </el-table-column>
        <el-table-column prop="point2" label="右下角坐标">
        </el-table-column>
        <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button @click="EditReadingclick(scope.row)" type="text" icon="el-icon-edit"  v-hasPermi="['device:camera:edit']" size="small">修改</el-button>
            <el-button @click="DeleteReadingclick(scope.row)" type="text" icon="el-icon-delete"  v-hasPermi="['device:camera:remove']" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog width="1000px" style="top: 30%;" :title="readingtitle" :visible.sync="innerReading" append-to-body>
         <el-row>
          <el-col :span="11">
            <iframe ref="readingiframe" id="readingiframes" :src="readingcanvasurl" frameborder="0"
            style="width: 430px; height: 340px;z-index:-1;"></iframe>
          </el-col>
          <el-col :span="13">
          <el-form ref="readingform" :model="readingform" :rules="readingrules" label-width="100px">
            <el-form-item label="读数名称" prop="readingName">
              <el-input v-model="readingform.readingName"></el-input>
            </el-form-item>
            <el-form-item label="顺序" prop="sort">
              <el-select v-model="readingform.sort" clearable filterable placeholder="请选择">
                <el-option
                  v-for="dict in sortoption"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button @click="getreadingzuobiao">获取读数标注坐标</el-button>
            </el-form-item>
            <div v-for="(domain, index) in readingform.domains" :key="domain.key">
              <el-row>
                <el-col :span="4">
                  <el-form-item :label="'左上角坐标' + index">
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="x" label-width="30px">
                    <el-input v-model="domain.x"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="y" label-width="30px">
                    <el-input v-model="domain.y"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <el-form-item :label="'右下角坐标' + index">
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="ex" label-width="30px">
                    <el-input v-model="domain.ex"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="ey" label-width="30px">
                    <el-input v-model="domain.ey"></el-input>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="2">
                  <el-form-item label-width="5px">
                    <el-button class="el-icon-close" @click.prevent="removezbreading(domain)"></el-button>
                  </el-form-item>
                </el-col>-->
              </el-row> 
            </div>
            <!-- <el-form-item>
              <el-button @click="addzbreading">添加读数项</el-button>
            </el-form-item> -->
          </el-form>
          </el-col>
         </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="savereading">保 存</el-button>
          <el-button @click="cancelreading">取 消</el-button>
        </div> 
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="canceldsxDialog">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>


<script>
import {
  listVideomonitoring, getVideomonitoring, addVideomonitoring, updateVideomonitoring, delVideomonitoring, 
  addconfigEquipment, getconfigEquipment, updateconfigEquipment, 
  listTimeconfig, addTimeconfig, getTimeconfig, updateTimeconfig, delTimeconfig,
  listDetection, getDetection, addDetection, updateDetection, delDetection, //检测点
  listMeterConfig, getMeterConfig, addMeterConfig, updateMeterConfig, delMeterConfig, //表计
  listReading, getReading, addReading, updateReading, delReading,  //读数
  listRobotSite, getRobotSite, addRobotSite, updateRobotSite, delRobotSite, //机器人配置
} from "@/api/videomonitoring/videos";
import { listMeterBase,addMeterBase } from "@/api/videomonitoring/configmeter";
import {listDefecttrees} from "@/api/device/defect" // 缺陷表
import { listCamera } from "@/api/device/camera";
import { listEquipment } from "@/api/device/equipment";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listConfig } from "@/api/system/config"; //全局获取告警图片IP地址和摄像头账户密码
import { getToken } from "@/utils/auth";
import { listArea } from "@/api/device/area";

function remove(arr, item) {
  for(var i = 0; i < arr.length; i++){
      if(arr[i] == item){
          //从i出开始删除1个元素
          arr.splice(i,1);
          i--;
      }
  }
  return arr;
}

export default {
  inject:['reload'],
  components: { Treeselect },
  data() {
    return {
      Xstr:"",
      Ystr:"",
      iframesrc:"",
      alarmimgipurl:"",
      // 动态获取摄像头账户密码
      cameraport:"",
      camerauser:"",
      camerapassword:"",
      bifocalhttpads:"",
      // 动态获取NVR地址
      nvrip:"",

      ishassiteBtn:true, //判断是否可配置预置位
      ishasAddtn:true,
      ishasEditBtn:true,
      ishasDelBtn:true,
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      total: 0, // 总页数
      queryParams: {
        // 查询参数
        pageNum: 1,
        pageSize: 10,
      },
      tableData: [], //table数据
      title: "", // 设备关联弹出层标题
      open: false, // 是否显示新增修改弹出层
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        sort: [
          { required: true, message: '请选择预置位顺序编号', trigger: 'change' }
        ],
        siteName:[
          { required: true, message: '请输入预置位名称', trigger: 'blur' }
        ],
      },
      areaOptions:[],
      cameraId:"",
      // -------------------机器人配置------------------------------//
      robotId:"",
      robotsiteId:"",
      robotsort:"",
      robotcameraId:"",
      ishasrobotid:false,
      robotsitedialog:false,
      robotsiteData:[],
      robotsiteinnerVisible:false,
      robotsiteTitle:"",
      robotconfigform:{},
      robotconfigrules:{},
      robotxylist:[],

      //----------------------site-配置算法--------------------------//
      robotip:"",
      sitecameraId:"", //拿到摄像头id
      sitedisable: false,
      siteOptions: [], //预置位的排序列表
      persetvalList: [], //存放顺序数据
      // quyuoptions: [], // 区域下拉列表
      quyulist: [], //数据
      shexiangtouoptions: [], //摄像头下拉列表
      shexiangtoulist: [], //数据
      guanliantitle: "", //配置算法标题
      queryform: {}, //获取配置算法详细信息的参数
      sitecheckedId: "", // 拿到预置位id
      dialogVisible: false, // 配置算法弹出框
      filterText: "", // 树搜索关键字
      yuzhiweiProps: {
        children: "children",
        label: "defectName",
        pid: "parentLabel",
        id: "defectLabel",
      },
      yuzhiweidata: [], //配置算法tree的数据
      // checkedList: [], //tree选中的id
      // configId: "", //配置算法修改时必传id
      formInline:{  //配置算法表单
        defectList:[],
        configId:"",
      },


      //--------------采集时间配置------------------------ //
      timecameraId:"", //拿到摄像头id
      timesiteId: "", //拿到预置位id
      TimeouterVisible: false, //外层
      TimeinnerVisible: false, //内层
      timeTitle: "", //采集时间配置新增修改标题
      isaddtime:true,
      TimeconfigData: [], //采集时间配置列表
      queryTimeparams: {}, //获取table时传的参数
      timeconfigform: {}, //新增修改表单
      // timerangeval:[new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      timeconfigrules: {
        start: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        end: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        frequency:[
          { required: true, message: '请选择采集频次', trigger: 'change' }
        ]
      }, //规则
      timeoptions:[],

      // -------------------------------上传---------------------//
      // isshowbiaoji:true, //上传成功之后显示读数，上传隐藏；
      upimgdialog:false,
      discernaction:process.env.VUE_APP_BASE_API + "/common/upload",
      discernheader:{ Authorization: "Bearer " + getToken() },
      fileListimg:[],
      issuccess:true,
      biaozhuimgurl:"",
      imgform:{},
      iframeContent:{},
      uploadrow:{},
      
      //------------------------标注dialog------------------------------//
      biaozhutitle:"",
      biaozhuDialog:false,
      isbiaozhuDialog:false,
      // 图像标注获取的xy值
      propszuobiao:[],
      bgimgurl:"",
      canvasWindth:"",
      canvasHeight:"",
      widthbili:"",
      heightbili:"",

      // -------------------检测点新增修改---detection----------------------------//
      siteImgUrl:"",
      // 检测点表格数据
      rowsiteId:"",
      rowcameraId:"",
      isshowshangchuan:true,
      detectiontabledata: [],
      detectiontitle:"",
      detectionopen:false,
      innerDetection:false,
      detectioncanvasurl:"",
      detectionform:{
        domains: [{
          x: '',
          y: '',
          ex:'',
          ey:''
        }],
      },
      detectionrules:{
        detectionName: [
          { required: true, message: '请输入检测点名称', trigger: 'blur' }
        ]
      },
      meterzbdialog:false, //坐标

      // ------------------------表计 meter-------------------------//
      // rowdetectionId:"",
      outerMeter:false,
      meterrowsiteId:"",
      meterrowcameraId:"",
      meterrowdetectionId:"",
      meterData:[],
      metertitle:"",
      innerMeter:false,
      metercanvasurl:"",
      meterform:{
        domains:[{
          x: '',
          y: '',
          ex:'',
          ey:''
        }]
      },
      meterrules:{
        name: [
          { required: true, message: '请输入表计名称', trigger: 'blur' }
        ],
        type:[
          { required: true, message: '请选择表计类型', trigger: 'change' }
        ],
        meterBaseId:[
          { required: true, message: '请选择关联表', trigger: 'change' }
        ]
      },
      typeoption:[], //类型
      changetypeoption:[], //关联表
      readingzbdialog:false, //坐标

      //------------------------指针表表计配置项--------------------------//
      addmetertitle:"",
      addmeteropen:false,
      addmeterform:{},
      addmeterrules:{
        meterType:[
          { required: true, message: '请选择表计类型', trigger: 'change' }
        ],
        meterBaseName:[
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        minScale:[
          { required: true, message: '请输入最小刻度', trigger: 'blur' },
        ],
        maxScale:[
          { required: true, message: '请输入最大刻度', trigger: 'blur' },
        ],
        middleScale:[
          { required: true, message: '请输入中间刻度', trigger: 'blur' },
        ],
        middleDegree:[
          { required: true, message: '请输入中间角度', trigger: 'blur' },
        ],
        minDegree:[
          { required: true, message: '请输入最小角度', trigger: 'blur' },
        ],
        maxDegree:[
          { required: true, message: '请输入最大角度', trigger: 'blur' },
        ],
        val:[
          { required: true, message: '请输入正常值', trigger: 'blur' },
        ],
        unit:[
          { required: true, message: '请输入单位', trigger: 'blur' },
          { min: 0, max: 20, message: '长度在 0 到 20 个字符', trigger: 'blur' }
        ]
      },
      addmeterTypeoption:[],


      //------------------------读数-------------------------------//
      rowreadingIdmeterId:"",
      outerReading:false,
      readingData:[],
      readingtitle:"",
      innerReading:false,
      readingcanvasurl:"",
      readingform:{
        domains:[{
          x: '',
          y: '',
          ex:'',
          ey:''
        }]
      },
      readingrules:{
        readingName: [
          { required: true, message: '请输入读数名称', trigger: 'blur' }
        ],
        sort:[
          { required: true, message: '请选择顺序', trigger: 'change' }
        ]
      },
      sortoption:[
        {
          dictValue:"1",
          dictLabel:"1"
        },{
          dictValue:"2",
          dictLabel:"2"
        },{
          dictValue:"3",
          dictLabel:"3"
        },{
          dictValue:"4",
          dictLabel:"4"
        },{
          dictValue:"5",
          dictLabel:"5"
        },{
          dictValue:"6",
          dictLabel:"6"
        }
      ], //类型
      Readingzbdialog:false, //坐标
      presetlist:[],
      durationOptions: [],
      equipmentOptions: [],
      
    };
  },
  created: function () {
    this.iframesrc = "../../../../videos/cn/demo.html";
    this.getcameraip();
    console.log(this.$route.query.robotId,'---ishasrobotid');
    if(this.$route.query.robotId != undefined){
      this.robotId = this.$route.query.robotId;
      window.sessionStorage.setItem("getrobotid",this.robotId);
      this.ishasrobotid = true;
      console.log(true,'true');
    }else if(this.$route.query.robotId == undefined){
      this.ishasrobotid = false;
      window.sessionStorage.setItem("getrobotid",undefined);
      console.log(false,'false');
    }
    if(this.$route.query.data != undefined){
      window.sessionStorage.setItem("equipmentlist",this.$route.query.data); 
    }
     // ----------------------------云台控制---------------------------------------//
    if (this.$route.query.ishasPtz != undefined) {
      window.sessionStorage.setItem("hasPtz", this.$route.query.ishasPtz);
    }
     // ----------------------------areaId---------------------------------------//
    if (this.$route.query.areaId != undefined) {
      window.sessionStorage.setItem("areaId", this.$route.query.areaId);
    }
    // ----------------------------摄像头id---------------------------------------//
    if (this.$route.query.cameraId != undefined) {
      window.sessionStorage.setItem("propcameraId", this.$route.query.cameraId);
      window.sessionStorage.setItem("brearer",getToken());
      window.sessionStorage.setItem("httpurl",process.env.VUE_APP_BASE_API);
      this.cameraId = window.sessionStorage.getItem("propcameraId");
      //----------------------通过摄像头id获取预置位列表------------------------------//
      // var queryform = {}
      // queryform.cameraId=this.$route.query.cameraId;
      // // window.sessionStorage.setItem("presetlist",null);
      // listVideomonitoring(queryform).then(res=>{
      //   console.log(res.rows,'----预置位');
      //   this.presetlist=[];
      //   if(window.sessionStorage.getItem("ishassite") != "0"){
      //     if(res.rows.length > 0){
      //       res.rows.map((w)=>{
      //         this.presetlist.push(w.sort);
      //         window.sessionStorage.setItem("presetlist",JSON.stringify(this.presetlist));
      //       })
      //     }
      //   }
      //   console.log(JSON.parse(window.sessionStorage.getItem("presetlist")),'预置位列表');
      // })
    }
    if(this.$route.query.cameraport != undefined){
      window.sessionStorage.setItem("cameraport", this.$route.query.cameraport);
    }
    if(this.$route.query.camerauser != undefined){
      window.sessionStorage.setItem("camerauser", this.$route.query.camerauser);
    }
    if(this.$route.query.camerapassword != undefined){
      window.sessionStorage.setItem("camerapassword", this.$route.query.camerapassword);
    }
    // ---------------------------摄像头IP--------------------------------------//
    console.log(this.$route.query.cameraip,this.$route.query.ishassite);
    if (this.$route.query.cameraip != undefined) {
      window.sessionStorage.setItem("cameraip", this.$route.query.cameraip);
    }
    if (this.$route.query.cameraName != undefined) {
      window.sessionStorage.setItem("cameraName", this.$route.query.cameraName);
    }
    //----------------------判断是否可配置预置位---------------------------//
    if (this.$route.query.ishassite != undefined) {
      console.log("this.$route.query.ishassite==================",this.$route.query.ishassite)
      window.sessionStorage.setItem("ishassite", this.$route.query.ishassite);
    }

    // ----------------------是否接入NVR----------------------------//
    if(this.$route.query.ishasnvr != undefined){
      window.sessionStorage.setItem("ishasnvr",this.$route.query.ishasnvr);
    }
    
    // ----------------------是否有红外线 - 双目----------------------------//
    if(this.$route.query.ishasInfrared != undefined){
      window.sessionStorage.setItem("ishasInfrared",this.$route.query.ishasInfrared);
    }

    // 通过判断是否配置预置位，进行一些操作的隐藏；
    if(window.sessionStorage.getItem("ishassite") == "0"){
      this.ishassiteBtn = false;
    }else if(window.sessionStorage.getItem("ishassite") == "1"){
      this.ishassiteBtn = true;
    }
    
    this.getDicts("dev_collect_frequency").then(response => {
      this.timeoptions = response.data;
    });
    this.getDicts("col_duration").then(response => {
      this.durationOptions = response.data;
    });
    //-----------------------------------------------------------------//
    this.getshexiangtoulist(); //摄像头下拉数据
    this.getarealist();
    this.getconfigsuanfalist(); //设备关联tree数据
    setTimeout(() => {
      this.getList();
    }, 500);

    // -------------上传------------------------------
      var uploadtoken = getToken(), prophttp = process.env.VUE_APP_BASE_API;
      window.sessionStorage.setItem('imgtokens',uploadtoken);
      window.sessionStorage.setItem('prophttps',prophttp);

      
    this.getDicts("meter_type").then(response => {
      console.log(response.data);
      this.meterTypeoption = response.data;
      this.typeoption = response.data;
      this.addmeterTypeoption = response.data;
      this.itemtypeoption = response.data;
    });
    this.getEquipmentList()
  },
  destroyed:function(){
    window.sessionStorage.setItem("presetlist",null);
    window.frames['videoiframes'].userfunc();
    window.frames['videoiframes'].clickLogout();
    // window.clearInterval(window.sessionStorage.getItem("timer"));
    // window.sessionStorage.setItem("timer",null);
    // document.getElementById("videoiframes").contentWindow.location.reload(true);
    this.iframesrc = undefined;
    sessionStorage.removeItem("biaojiname");
    sessionStorage.removeItem("biaojiaddress");
    window.sessionStorage.setItem("getrobotid",null);
  },
  mounted: function () {
    // this.getList();
    // window.addEventListener("message", function (e) {
    //   // console.log(e.data.data,'e-data-data-858');
    //   if(e.data.data != undefined){
    //     this.persetvalList = Array.from(e.data.data);
    //     // console.log( this.persetvalList, "this.persetvalList-------------------this.persetvalList");
    //     window.sessionStorage.setItem("persetvalList",JSON.stringify(this.persetvalList));
    //   }
    //   // console.log(e.data.parentval,'----zuobiao--xy--')
    //   // console.log(this.detectiontitle,this.metertitle,this.readingtitle)
    // });
  },
  methods: {
     // //动态获取告警图片IP地址
    getcameraip(){
      listConfig().then(response => {
        console.log(response.rows,'全局匹配的一些参数');
        response.rows.map((v)=>{
          // 图片服务器地址
          if(v.configKey == "server.fdfs.ip"){
            this.alarmimgipurl = v.configValue;
            // window.sessionStorage.setItem("alarmimgipurl",this.alarmimgipurl);
          }
          // 机器人请求ip
          // if(v.configKey == "location.robot.ip"){
          //   this.robotip = 'http://'+  v.configValue;
          //   console.log(this.robotip,'-----------机器人httpIP');
          //   window.sessionStorage.setItem("getrobotip",this.robotip);
          // }
          // // 摄像头账号
          // if(v.configKey == "config.camera.username"){
          //   this.camerauser = v.configValue;
          //   window.sessionStorage.setItem("camerauser",this.camerauser);
          // }
          // // 摄像头密码
          //  if(v.configKey == "config.camera.password"){
          //   this.camerapassword = v.configValue;
          //   window.sessionStorage.setItem("camerapassword",this.camerapassword);
          // }
          // NVR服务器IP
          if(v.configKey == "server.nvr.ip"){
            this.nvrip = v.configValue;
            window.sessionStorage.setItem("nvrip",this.nvrip);
          }
          // 推流地址：
          if(v.configKey == "config.bifocal.httpads"){
            this.bifocalhttpads = v.configValue;
            window.sessionStorage.setItem("bifocalhttpads",this.bifocalhttpads);
          }
        })
      });
    },
    // 采集频次字典翻译
    pinlvFormat(row, column) {
      return this.selectDictLabel(this.timeoptions, row.frequency);
    },
    // 采集时间段字典翻译
    durationFormat(row, column) {
      return this.selectDictLabel(this.durationOptions, row.duration);
    },
    /** 查询设备品牌型号列表 */
    getEquipmentList() {
      var queryParamsOfEquipment = {
        pageNum: 1,
        pageSize: 9999,
        areaId: this.$route.query.areaId,
      }
      listEquipment(queryParamsOfEquipment).then(response => {
        this.equipmentOptions = response.rows;
      });
    },

    /** 查询预置位列表 */
    getList() {
      console.log("查询预置位列表查询预置位列表查询预置位列表查询预置位列表")
      this.loading = true;
      this.queryParams.cameraId=this.cameraId;
      listVideomonitoring(this.queryParams).then(response => {
        console.log(response.rows, "列表查询成功1219******");
          document.getElementById("videoiframes").contentWindow.yuzhiweichuanzhi(response.rows);
        if(window.sessionStorage.getItem("ishassite") == "0"){
          console.log(response.rows, "列表查询成功");
          if(response.rows.length > 0){
            response.rows.map((v) => {
              this.shexiangtoulist.map((b) => {
                if (v.cameraId == b.cameraId) {
                  v.cameraName = b.cameraName;
                }
              });
              this.areaOptions.map((c)=>{
                if(v.areaId == c.areaId){
                  v.areaName = c.areaName
                }
              })
            })
          }
          this.tableData = response.rows;
          
          if(response.rows.length == 1){
            this.ishasAddtn = false;
            this.ishasDelBtn = false;
          }else if(response.rows.length == 0){
            this.ishasAddtn = true;
            this.ishasDelBtn = true;
          }
        }else{
          response.rows.map((v) => {
            this.shexiangtoulist.map((b) => {
              if (v.cameraId == b.cameraId) {
                v.cameraName = b.cameraName;
              }
            });
            this.areaOptions.map((c)=>{
              if(v.areaId == c.areaId){
                v.areaName = c.areaName
              }
            })
          });
          console.log(response.rows, "列表查询成功");
          this.tableData = response.rows;
          this.total = response.total;
        }
        this.loading = false;
      });
    },

    // 预置位多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.siteId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 预置位新增修改表单重置
    reset() {
      this.form = {
        areaId: undefined, //区域ID
        cameraId: undefined, //摄像头ID
        sort: undefined, //预置位顺序编号
        preSiteX:undefined,
        preSiteY:undefined,
        duration: undefined, //预置位停留时间
        remark: undefined, //备注
      };
      this.resetForm("form");

      this.robotconfigform={
        cameraId:undefined,
        siteId:undefined,
        preSiteX:undefined,
        preSiteY:undefined
      }
      this.resetForm("robotconfigform");

      this.timeconfigform = {
        start:undefined,
        end:undefined,
        pincichange:undefined
      }
      this.resetForm("timeconfigform");

      this.imgform = {
        imgdizhi:undefined
      }
      this.resetForm("imgform");
      this.fileListimg = undefined;

      this.detectionform = {
        detectionName:undefined,
        domains:[]
      }
      this.resetForm("detectionform");

      this.meterform = {
        name:undefined,
        type:undefined,
        meterBaseId:undefined,
        domains:[]
      }
      this.resetForm("meterform");

      this.readingform = {
        readingName:undefined,
        sort:undefined,
        domains:[]
      }
      this.resetForm("readingform");

    },

    addreset(){
      this.addmeterform = {
        meterBaseName:undefined,
        meterType:undefined,
        maxDegree:undefined,
        minDegree:undefined,
        maxScale:undefined,
        minScale:undefined,
        unit:undefined,
        vdecimal:undefined,
        val:undefined,
        digits:undefined,
      };
      this.resetForm("addmeterform");
    },

    /** 预置位 新增按钮操作 */
    handleAdd() {
      document.documentElement.scrollTop = 500
      this.reset();
      this.open = true;
      this.title = "添加预置位";
      this.sitedisable = false;
      this.siteOptions = JSON.parse( window.sessionStorage.getItem("persetvalList"));
      this.form.cameraId = Number(this.cameraId);
      this.form.areaId = Number(window.sessionStorage.getItem("areaId"));
      if(window.sessionStorage.getItem("ishassite") == "0"){
        this.sitedisable = false;
      }
      // console.log( this.siteOptions, "this.siteOptions-------------------this.siteOptions",this.form.cameraId);
    },
    getcoordinate(){
      let that=this;
      window.frames['videoiframes'].getrobotcoordinate();
      window.addEventListener("message", function (e) {
        console.log(e.data.robotxylist,'----jiqirenshuju')
        let list = Array.from(e.data.robotxylist);
        that.robotxylist = list;
        that.form.preSiteX = list[0].robotx;
        that.form.preSiteY = list[0].roboty;
      })
    },
    // sortchange(val) {
    //   console.log(val,this.form.sort);
    //   this.tableData.map((v) => {
    //     if (val == v.sort) {
    //       // alert("预置位已经添加过了，请选择别的预置位");
    //       this.$message({
    //         message: '预置位已经添加过了，请选择别的预置位',
    //         type: 'warning'
    //       });
    //       this.form.sort = undefined;
    //       this.sitedisable = true;
    //     } else {
    //       this.sitedisable = false;
    //     }
    //   });
    //   this.sitedisable = false;
    // },
    // 摄像头下拉列表
    getshexiangtoulist() {
      var propquery = {
        "cameraId":this.cameraId
      }
      listCamera(propquery).then((response) => {
        // console.log(response, "摄像头下拉列表");
        this.shexiangtoulist = response.rows;
        this.shexiangtouoptions = response.rows;
      });
    },
    /** 查询区域 */
    getarealist() {
      var areaid = window.sessionStorage.getItem("areaId");
      listArea().then(response => {
        console.log(response.data,'区域');
        this.areaOptions = response.data;
      });
    },
    // 预置位修改按钮操作
    handleUpdate(row) {
      document.documentElement.scrollTop = 500
      this.reset();
      this.siteOptions = JSON.parse(
        window.sessionStorage.getItem("persetvalList")
      );
      const siteId = row.siteId || this.ids;
      getVideomonitoring(siteId).then((response) => {
        console.log(response.data,'-修改时拿到的参数');
        if(response.code == 200){
          if(response.data.robotSiteId){
            const id = response.data.robotSiteId;
            getRobotSite(id).then((response) => {
              console.log(response.data);
              this.robotconfigform = response.data;
            });
          }
          this.form = response.data;
          console.log(this.form);
          this.open = true;
          this.title = "修改预置位";
        }
        // console.log(response);
      });
    },
    /**预置位 新增修改 提交按钮 */
    submitForm: function () {
      if(window.sessionStorage.getItem("ishassite") == "0"){
        this.form.sort = "-1";
      }else if(window.sessionStorage.getItem("ishassite") == "1"){
        console.log("点击了确定按钮",this.form.sort,this.form)

        if(this.form.siteId != undefined){
          console.log("修改---")
        }else{
          this.tableData.map((v) => {
            if (this.form.sort == v.sort) {
              console.log("v.sort==******=====",v.sort);
              this.$message({
                message: '预置位已经添加过了，请输入别的预置位',
                type: 'warning',
                offset:130
              });
              this.form.sort = undefined;
            }
          });
        }
      }
      this.$refs["form"].validate((valid) => {
        console.log(this.form);
        if (valid) {
          if(this.ishasrobotid == false){
            if (this.form.siteId != undefined) {
                updateVideomonitoring(this.form).then((response) => {
                  if (response.code === 200) {
                    this.msgSuccess("修改成功");
                    this.open = false;
                    this.getList();
                  }
                });
            } else {
              addVideomonitoring(this.form).then((response) => {
                console.log(response);
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                }
              });
            }
          }else if(this.ishasrobotid == true){
            if (this.form.siteId != undefined) {
                updateVideomonitoring(this.form).then((response) => {
                  // console.log(response,this.robotconfigform,'---1470');
                  if(response.code == 200){
                    if(this.robotconfigform.robotSiteId != null || this.robotconfigform.robotSiteId != undefined){
                      this.robotconfigform = {
                        siteId:response.data,
                        cameraId:this.form.cameraId,
                        robotId:Number(this.robotId),
                        preSiteX:this.form.preSiteX,
                        preSiteY:this.form.preSiteY
                      }
                      addRobotSite(this.robotconfigform).then(response => {
                        if (response.code === 200) {
                          this.msgSuccess("新增成功");
                          this.open = false;
                          this.getList();
                        }
                      });
                    }else{
                      this.robotconfigform.preSiteX = this.form.preSiteX;
                      this.robotconfigform.preSiteY = this.form.preSiteY;
                      // console.log(this.robotconfigform,'----1471');
                      updateRobotSite(this.robotconfigform).then(response => {
                        if (response.code === 200) {
                          this.msgSuccess("修改成功");
                          this.open = false;
                          this.getList();
                        }
                      });
                    }
                  }
                });
            } else {
              addVideomonitoring(this.form).then((response) => {
                if(response.code == 200){
                  console.log(response);
                  this.robotconfigform = {
                    siteId:response.data,
                    cameraId:this.form.cameraId,
                    robotId:Number(this.robotId),
                    preSiteX:this.form.preSiteX,
                    preSiteY:this.form.preSiteY
                  }
                  addRobotSite(this.robotconfigform).then(response => {
                    if (response.code === 200) {
                      this.msgSuccess("新增成功");
                      this.open = false;
                      this.getList();
                    }
                  });
                }
              });
            }
          }
        }
      });
    },
    /**预置位 取消按钮*/
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 预置位删除按钮操作 */
    handleDelete(row) {
      document.documentElement.scrollTop = 500
      const siteIds = row.siteId || this.ids;
      this.$confirm(
        '是否确认删除预置位编号为"' + siteIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
      .then(function () {
        return delVideomonitoring(siteIds);
      })
      .then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
      .catch(function () {});
    },
    
    /** -------------------------机器人配置--------------------------------------- */
    // handleRobotconfig(row){
    //   document.documentElement.scrollTop = 500
    //   console.log(row);
    //   this.robotsiteId = row.siteId;
    //   this.robotcameraId = row.cameraId;
    //   this.robotsort = row.sort;
    //   this.robotsitedialog = true;
    //   this.getrobotsitedata();
    // },
    // getrobotsitedata(){
    //   var queryform = {
    //     "siteId":this.robotsiteId
    //   }
    //   listRobotSite(queryform).then(response=>{
    //     console.log(response)
    //     response.rows.map((v) => {
    //       this.shexiangtoulist.map((b) => {
    //         if (v.cameraId == b.cameraId) {
    //           v.cameraName = b.cameraName;
    //         }
    //       });
    //     });
    //     this.robotsiteData = response.rows;
    //   })
    // },
    // Addrobotsite(){
    //   document.documentElement.scrollTop = 500
    //   this.robotconfigform.robotId = this.robotId;
    //   this.robotconfigform.cameraId = this.robotcameraId;
    //   this.robotconfigform.siteId = this.robotsiteId;
    //   this.robotconfigform.sort = this.robotsort;
    //   this.robotsiteTitle="新增机器人预置位";
    //   this.robotsiteinnerVisible = true;
    // },
    // getrobotzuobiao(){
    //   console.log(this.robotconfigform.sort);
    //   window.addEventListener("message", function (e) {
    //     console.log(e.data.robotxylist)
    //     this.robotxylist = Array.from(e.data.robotxylist);
    //     this.robotxylist.map((v)=>{
    //       if(this.robotconfigform.sort == v.sort){
    //         console.log(v);
    //         this.robotconfigform.preSiteX = v.robotx;
    //         this.robotconfigform.preSiteY = v.roboty;
    //       }
    //     })
    //   })
    // },
    // Editrobotsite(row){
    //   console.log(row)
    //   document.documentElement.scrollTop = 500;
    //   const id = row.id;
    //   getRobotSite(id).then((response) => {
    //     console.log(response.data);
    //     this.robotconfigform = response.data;
    //     this.robotsiteTitle="修改机器人预置位";
    //     this.robotsiteinnerVisible = true;
    //   });
    // },
    // robotconfigSave(){
    //   console.log(this.robotconfigform);
    //   this.$refs["robotconfigform"].validate(valid => {
    //     if (valid) {
    //       if (this.robotconfigform.id != undefined) {
    //         updateRobotSite(this.robotconfigform).then(response => {
    //           if (response.code === 200) {
    //             this.msgSuccess("修改成功");
    //             this.robotsiteinnerVisible = false;
    //             this.getrobotsitedata();
    //             this.reset();
    //           }
    //         });
    //       } else {
    //         addRobotSite(this.robotconfigform).then(response => {
    //           console.log(response)
    //           if (response.code === 200) {
    //             this.msgSuccess("新增成功");
    //             this.robotsiteinnerVisible = false;
    //             this.getrobotsitedata();
    //             this.reset();
    //           }
    //         });
    //       }
    //     }
    //   });
    // },
    // robotconfigCancel(){
    //   this.robotsiteinnerVisible = false;
    //   this.reset();
    // },
    // Deleterobotsite(row){
    //   document.documentElement.scrollTop = 500;
    //   const ids = row.id;
    //   this.$confirm(
    //     '是否确认删除机器人预置位id为"' + ids + '"的数据项?',
    //     "警告",
    //     {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning",
    //     }
    //   )
    //     .then(function () {
    //       return delRobotSite(ids);
    //     })
    //     .then(() => {
    //       this.getrobotsitedata();
    //       this.msgSuccess("删除成功");
    //     })
    //     .catch(function () {});
    // },

    /**-----------------------------配置算法----------------------------------------*/ 
    // 配置算法按钮操作
    handleEquipment(row) {
      document.documentElement.scrollTop = 500
      console.log(row,'-----row------');
      this.guanliantitle = "配置算法";
      this.sitecameraId = row.cameraId; //
      this.queryform = { siteId: row.siteId };
      getconfigEquipment(this.queryform).then((response) => {
        console.log(response.rows, "----------------", response.rows.length);
        if (response.rows.length == 0) {
          this.formInline.configId = undefined;
          // this.formInline.cameraId = this.sitecameraId;
        } else if (response.rows.length == 1) {
          this.formInline.configId = response.rows[0].configId;
          console.log(response.rows[0].equipmentList.indexOf(",") == -1,'---------------',response.rows[0].equipmentList);
          if(response.rows[0].equipmentList.indexOf(",") == -1){
            this.formInline.defectList.push(response.rows[0].equipmentList);
          }else{
            this.formInline.defectList = response.rows[0].equipmentList.split(",");
          }
          console.log(this.formInline.defectList,'-------------');
          this.$refs.yuzhiweitree.setCheckedKeys(this.formInline.defectList);
        }
      });
      this.dialogVisible = true;
      this.sitecheckedId = row.siteId;
    },
    // 配置算法中tree的数据
    getconfigsuanfalist() {
      listDefecttrees().then((response) => {
        console.log(response, "配置算法");
        // ----------------树形控件------------------
        this.yuzhiweidata = this.handleTree( response.rows, "defectLabel", "parentLabel","children","0");
      });
    },
    // 配置算法tree搜索关键字
    filterNode(value, data) {
      if (!value) return true;
      return data.defectName.indexOf(value) !== -1;
    },
    // 配置算法中选择节点数据
    handleCheckChange() {
      console.log(this.$refs.yuzhiweitree.getCheckedKeys());
      this.formInline.defectList = [];
      this.formInline.defectList = this.$refs.yuzhiweitree.getCheckedKeys();
      console.log(this.formInline.defectList);
      if(this.formInline.defectList.indexOf("0") == -1){
        remove(this.formInline.defectList,0);
      }
    },
    // 保存配置算法
    saveConfig() {
      console.log(this.formInline.configId,'-----',this.formInline.defectList);
      if(this.formInline.defectList.length > 0){
        this.formInline.defectList = this.formInline.defectList.join(',')
      }else if(this.formInline.defectList.length == 0){
        this.formInline.defectList = "null";
      }
      console.log(this.formInline.defectList);
      if (this.formInline.configId !== undefined) {
        var configform = {
          configId: this.formInline.configId,
          equipmentList: this.formInline.defectList,
        };
        // console.log(configform,'------修改');
        updateconfigEquipment(configform).then((response) => {
          // console.log(response,"修改")
          if (response.code === 200) {
            this.msgSuccess("修改成功");
            this.dialogVisible = false;
            this.getList();
            this.filterText = undefined;
            this.formInline.defectList = [];
            this.$refs.yuzhiweitree.setCheckedKeys([]);
          }
        });
      }else if(this.formInline.configId == undefined){
        var configform = {
          siteId: this.sitecheckedId,
          equipmentList: this.formInline.defectList,
          cameraId : this.sitecameraId
        };
        // console.log(configform,'------新增');
        addconfigEquipment(configform).then((response) => {
          // console.log(response,"新增")
          if (response.code === 200) {
            this.msgSuccess("新增成功");
            this.dialogVisible = false;
            this.getList();
            this.filterText = undefined;
            this.formInline.defectList = [];
            this.$refs.yuzhiweitree.setCheckedKeys([]);
          }
        });
      }
    },
    // 取消配置算法
    quxiaoconfig() {
      console.log(111);
      this.filterText = undefined;
      this.dialogVisible = false;
      this.$refs.yuzhiweitree.setCheckedKeys([]);
      this.formInline = {}
    },
    /**------------------------ 采集时间配置------------------------------------------- */
    gettimeconfigList() {
      this.queryTimeparams = {
        siteId: this.timesiteId,
      };
      listTimeconfig(this.queryTimeparams).then((response) => {
        console.log(response.rows, "采集时间列表查询成功");
        if(response.rows.length == 1){
          this.isaddtime = false;
        }else if(response.rows.length == 0){
          this.isaddtime = true;
        }else if(response.rows.length > 1){
          this.isaddtime = false;
        }
        this.TimeconfigData = response.rows;
      });
    },
    pincichange(val){
      console.log(val);
      if(val == "24hr"){
        this.timeconfigform.start = "9:00";
        this.timeconfigform.end = "16:00";
      }
    },
    /** 采集时间配置按钮操作 */
    handleTimeconfig(row) {
      document.documentElement.scrollTop = 500
      console.log(row, "518-518");
      this.timecameraId = row.cameraId;
      this.timesiteId = row.siteId;
      this.TimeouterVisible = true;
      this.gettimeconfigList();
    },
    /** 采集时间配置新增按钮操作 */
    AddtimeClick() {
      document.documentElement.scrollTop = 500
      this.reset();
      this.timeTitle = "新增采集时间";
      this.TimeinnerVisible = true;
    },
    /** 采集时间配置修改按钮操作 */
    EdittimeClick(row) {
      document.documentElement.scrollTop = 500
      this.reset();
      const timeId = row.timeId;
      getTimeconfig(timeId).then((response) => {
        console.log(response.data);
        this.timeconfigform.start = response.data.start;
        this.timeconfigform.start = response.data.start;
        this.timeconfigform = response.data;
        this.timeTitle = "修改采集时间";
        this.TimeinnerVisible = true;
      });
    },
    /** 采集时间配置删除按钮操作 */
    DeletetimeClick(row) {
      document.documentElement.scrollTop = 500
      const timeIds = row.timeId;
      this.$confirm(
        '是否确认删除采集时间编号为"' + timeIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delTimeconfig(timeIds);
        })
        .then(() => {
          // this.queryTimeparams = {
          //   siteId: this.timesiteId,
          // };
          // listTimeconfig(this.queryTimeparams).then((response) => {
          //   console.log(response.rows, "采集时间列表查询成功");
          //   this.TimeconfigData = response.rows;
          //   if(response.rows.length == 1){
          //     this.isaddtime = false;
          //   }else if(response.rows.length == 0){
          //     this.isaddtime = true;
          //   }
          // });
          this.gettimeconfigList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 采集时间配置保存按钮操作 */
    timeconfigSave() {
      this.timeconfigform.siteId = this.timesiteId;
      console.log(this.timeconfigform);
      this.$refs["timeconfigform"].validate((valid) => {
        if (valid) {
          if (this.timeconfigform.timeId != undefined) {
            updateTimeconfig(this.timeconfigform).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.TimeinnerVisible = false;
                this.gettimeconfigList();
              }
            });
          } else {
            this.timeconfigform.cameraId = this.timecameraId;
            addTimeconfig(this.timeconfigform).then((response) => {
              console.log(response);
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.TimeinnerVisible = false;
                this.gettimeconfigList();
              }
            });
          }
        }
      });
    },
    /** 采集时间配置取消按钮操作 */
    timeconfigCancel() {
      this.TimeinnerVisible = false;
      this.reset();
    },

    /** ----------------------------------上传标记底图----------------------------------------- */
    handlecapture(row){
      console.log(row);
      window.frames['videoiframes'].clickCapturePic();
      window.addEventListener("message", function (e) {
        console.log(e.data.imgobj,'--1469');
        if(e.data.imgobj != undefined){
          var biaojiname = e.data.imgobj.imgname, biaojiaddress = e.data.imgobj.imgaddress;
          window.sessionStorage.setItem("biaojiname",biaojiname);
          window.sessionStorage.setItem("biaojiaddress",biaojiaddress); 
          this.biaojiimg = window.sessionStorage.getItem("biaojiname");
          this.biaojiimgaddress = window.sessionStorage.getItem("biaojiimgaddress");
          console.log(this.biaojiimgaddress,this.biaojiimg,'--this.biaojiimg--');
        }else if(e.data.imgobj == undefined){
          window.sessionStorage.setItem("biaojiname",undefined);
          window.sessionStorage.setItem("biaojiaddress",undefined); 
        }
      })
    },
    handleupimg(row){
      console.log(row);
      this.uploadrow.siteId = row.siteId;
      console.log(window.sessionStorage.getItem("biaojiname"),window.sessionStorage.getItem("biaojiname") != undefined);
      if(window.sessionStorage.getItem("biaojiname") == undefined){
        this.biaojiimg = undefined;
        this.biaojiimgaddress = undefined;
      }else if(window.sessionStorage.getItem("biaojiname") != undefined && window.sessionStorage.getItem("biaojiname") !== null){
        this.biaojiimg = window.sessionStorage.getItem("biaojiname");
        this.biaojiimgaddress = window.sessionStorage.getItem("biaojiaddress");
        console.log(this.biaojiimgaddress,this.biaojiimg,'--this.biaojiimg--');
        if(this.biaojiimgaddress !== undefined && this.biaojiimg !== undefined){
          document.documentElement.scrollTop = 600;
          this.issuccess = true;
          this.upimgdialog = true;
          this.imgform.imgdizhi = this.biaojiimgaddress;
        }else if(this.biaojiimgaddress == undefined && this.biaojiimg == undefined){
          this.$message({
            message: '上传前先抓拍一张图片',
            type: 'warning'
          });
        }
      }else if(window.sessionStorage.getItem("biaojiname") !== null){
        this.biaojiimg = undefined;
        this.biaojiimgaddress = undefined;
      }
    },
    handleimgsuccess(res, file, fileList) {
      console.log(res,process.env.VUE_APP_BASE_API,this.uploadrow,'-1633');
      if(res.code == 200){
        // this.uploadrow.siteImgUrl="http://"+this.alarmimgipurl+res.fileName;
        // this.biaozhuimgurl = "http://"+this.alarmimgipurl+res.fileName;
        this.uploadrow.siteImgUrl=res.fileName;
        this.biaozhuimgurl = process.env.VUE_APP_BASE_API+res.fileName;
        var img = new Image();
        img.src = this.biaozhuimgurl;
        var widthbili = "",heightbili = "";
        img.onload = function(){
          this.canvasWindth = img.width;
          this.canvasHeight = img.height;
          var widths = 400,heights = 300;
          widthbili = (widths/this.canvasWindth);
          heightbili = (heights/this.canvasHeight);
          window.sessionStorage.setItem("widthbili",widthbili);
          window.sessionStorage.setItem("heightbili",heightbili);
          console.log("width:"+img.width,"height:"+img.height,widthbili,heightbili);
        }
        setTimeout(()=>{
          console.log(widthbili,heightbili,window.sessionStorage.getItem("widthbili"),'--',window.sessionStorage.getItem("heightbili"))
          this.uploadrow.widthRate = window.sessionStorage.getItem("widthbili");
          this.uploadrow.heightRate = window.sessionStorage.getItem("heightbili");
          this.issuccess = false;
          this.filename = res.fileName.split("/")[res.fileName.split("/").length-1];
          console.log(this.uploadrow,'---上传所需的图片url');
          updateVideomonitoring(this.uploadrow).then((response) => {
            console.log(response);
            if (response.code === 200) {
              this.msgSuccess("上传成功");
              this.getList();
            }
          });
        },200);
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024  < 2;
      if (!isLt2M) {
        // this.$message.error('上传头像图片大小不能超过 2MB!');
        this.$message({ 
          message: '上传头像图片大小不能超过 2MB!',
          type: 'warning',
          offset:"50%"
        });
      }
      return isLt2M;
    },
    /** 上传取消按钮 */
    cancelupimg(){
      this.upimgdialog = false;
      this.fileListimg = [];
      this.isshowbiaoji = true;
      this.isshowshangchuan = true;
    },
    /** 上传确定按钮 */
    saveupimg(){
      this.upimgdialog = false;
      this.fileListimg = [];
      this.isshowbiaoji = false;
      this.isshowshangchuan = false;
      // this.widthbili = window.sessionStorage.getItem("widthbili");
      // this.heightbili = window.sessionStorage.getItem("heightbili");
      // console.log(this.widthbili,this.heightbili);
    },

    
    /** -----------------------------标注------------------------------------------- */
    // 获取检测点的坐标
    getzuobiao(){
      this.propszuobiao = [];
      if(window.sessionStorage.getItem("biaozhuxy") != undefined){
        this.propszuobiao = JSON.parse(window.sessionStorage.getItem("biaozhuxy"));
      }
      // this.widthbili = window.sessionStorage.getItem("widthbili");
      // this.heightbili = window.sessionStorage.getItem("heightbili");
      console.log(this.widthbili,this.heightbili,this.propszuobiao,'-----1592',this.detectionform.domains,(this.propszuobiao[0].x/this.widthbili));
      if(this.propszuobiao.length == 1){
        if(this.detectionform.domains == undefined || this.detectionform.domains.length == 0){
          // this.detectionform={
          //   domains: [{
          //     x: '',
          //     y: '',
          //     ex:'',
          //     ey:''
          //   }],
          // }
          this.addDomain();
        }
        console.log(this.detectionform.domains,'---1604');
        this.detectionform.domains[0].x = parseInt((this.propszuobiao[0].x/this.widthbili));
        this.detectionform.domains[0].y = parseInt((this.propszuobiao[0].y/this.heightbili));
        this.detectionform.domains[0].ex = parseInt((this.propszuobiao[0].ex/this.widthbili));
        this.detectionform.domains[0].ey = parseInt((this.propszuobiao[0].ey/this.heightbili));
      // }else if(this.propszuobiao.length > 1){
      //   for(var i=1;i<this.propszuobiao.length;i++){
      //     this.addDomain();
      //     this.detectionform.domains = this.propszuobiao;
      //   }
      }
    },
    // 获取表计坐标
    getmeterzuobiao(){
      this.propszuobiao = [];
      if(window.sessionStorage.getItem("biaozhuxy") != undefined){
        this.propszuobiao = JSON.parse(window.sessionStorage.getItem("biaozhuxy"));
      }
      // this.widthbili = window.sessionStorage.getItem("widthbili");
      // this.heightbili = window.sessionStorage.getItem("heightbili");
      console.log(this.widthbili,this.heightbili,this.propszuobiao,'--',this.widthbili,'---',this.heightbili);
      if(this.propszuobiao.length == 1){
        if(this.meterform.type == 1){ 
          if(this.meterform.domains == undefined || this.meterform.domains.length == 0){
            // this.meterform={
            //   domains: [{
            //     x: '',
            //     y: '',
            //     ex:'',
            //     ey:''
            //   }],
            // }
            this.addzbmeter();
          }
          this.meterform.domains[0].x = parseInt((this.propszuobiao[0].ex/this.widthbili));
          this.meterform.domains[0].y = parseInt((this.propszuobiao[0].ey/this.heightbili));
          console.log(this.meterform.domains,'--指针表只有中心坐标--');
        }else{
          if(this.meterform.domains.length == 0){
            // this.meterform={
            //   domains: [{
            //     x: '',
            //     y: '',
            //     ex:'',
            //     ey:''
            //   }],
            // }
            this.addzbmeter();
          }
          this.meterform.domains = this.propszuobiao;
          this.meterform.domains[0].x = parseInt((this.propszuobiao[0].x/this.widthbili));
          this.meterform.domains[0].y = parseInt((this.propszuobiao[0].y/this.heightbili));
          this.meterform.domains[0].ex = parseInt((this.propszuobiao[0].ex/this.widthbili));
          this.meterform.domains[0].ey = parseInt((this.propszuobiao[0].ey/this.heightbili));
        }
      }else if(this.propszuobiao.length > 1){
        for(var i=1;i<this.propszuobiao.length;i++){
          this.addzbmeter();
          this.meterform.domains = this.propszuobiao;
        }
      }
    },
    // 获取读数坐标
    getreadingzuobiao(){
       this.propszuobiao = [];
      if(window.sessionStorage.getItem("biaozhuxy") != undefined){
        this.propszuobiao = JSON.parse(window.sessionStorage.getItem("biaozhuxy"));
      }
      // this.widthbili = window.sessionStorage.getItem("widthbili");
      // this.heightbili = window.sessionStorage.getItem("heightbili");
      console.log(this.propszuobiao,'---',this.widthbili,this.heightbili);
      if(this.propszuobiao.length == 1){
        if(this.readingform.domains == undefined || this.readingform.domains.length == 0){
          // this.readingform={
          //   domains: [{
          //     x: '',
          //     y: '',
          //     ex:'',
          //     ey:''
          //   }],
          // }
          this.addzbreading();
        }
        this.readingform.domains = this.propszuobiao;
        this.readingform.domains[0].x = parseInt((this.propszuobiao[0].x/this.widthbili));
        this.readingform.domains[0].y = parseInt((this.propszuobiao[0].y/this.heightbili));
        this.readingform.domains[0].ex = parseInt((this.propszuobiao[0].ex/this.widthbili));
        this.readingform.domains[0].ey = parseInt((this.propszuobiao[0].ey/this.heightbili));
      }else if(this.propszuobiao.length > 1){
        for(var i=1;i<this.propszuobiao.length;i++){
          this.addzbreading();
          this.readingform.domains = this.propszuobiao;
        }
      }
    },
    
    // 告警级别字典翻译
    metertypeFormat(row, column) {
      return row !== null ? this.selectDictLabel(this.meterTypeoption, row.type) : null;
    },

    /** --------------------------------配置检测点------------------------------------------------------- */ 
    /** 配置检测点操作 */ 
    handledetection(row){
      this.siteImgUrl = process.env.VUE_APP_BASE_API+row.siteImgUrl;
      this.widthbili = parseFloat(row.widthRate);
      this.heightbili = parseFloat(row.heightRate);
      console.log(row,row.siteImgUrl != "",this.siteImgUrl,this.widthbili,this.heightbili);
      this.detectionform.siteId = row.siteId;
      this.rowsiteId = row.siteId;
      this.rowcameraId = row.cameraId;
      document.documentElement.scrollTop = 500;
      this.detectionopen = true;
      this.getdetectiondata();
    },
    getdetectiondata(){
      var queryform = {
        "siteId":this.rowsiteId
      }
      listDetection(queryform).then(response => {
        console.log(response,'获取检测点列表数据');
        this.detectiontabledata = response.rows;
      });
    },
    addDomain() {
      this.detectionform.domains.push({
        x: '',
        y: '',
        ex:'',
        ey:'',
        key: Date.now()
      });
    },
    // removeDomain(item) {
    //   var index = this.detectionform.domains.indexOf(item);
    //   if (index !== -1) {
    //     this.detectionform.domains.splice(index, 1)
    //   }
    // },
    /** 检测点新增按钮操作 */
    Adddetectionclick() {
      console.log(this.siteImgUrl,"--当前预置位的图片");
      window.sessionStorage.setItem("biaozhuimgurl",this.siteImgUrl);
      document.documentElement.scrollTop = 500;
      this.reset();
      this.detectioncanvasurl="../../../../imgbiaozhu/newindex.html";
      this.innerDetection = true;
      this.detectiontitle = "添加检测点";
      this.detectionform.siteId = this.rowsiteId;
      this.detectionform.cameraId = this.rowcameraId;
    },
    /** 检测点修改按钮操作 */
    Editdetection(row){
      console.log(row,'-----修改');
      this.reset();
      window.sessionStorage.setItem("biaozhuimgurl",this.siteImgUrl);
      this.detectioncanvasurl="../../../../imgbiaozhu/newindex.html";
      const detectionId = row.detectionId;
      getDetection(detectionId).then((response) => {
        console.log(response.data);
        if(response.data.point1 !== null){
          var point1 = [];
          point1 = response.data.point1.split(',');
          var point2 = [];
          point2 = response.data.point2.split(',');
          console.log(point1);
          response.data.domains = [{
            x: Number(point1[0]),
            y: Number(point1[1]),
            ex:Number(point2[0]),
            ey:Number(point2[1]),
          }]; 
        }else if(response.data.point1 == null){
          response.data.domains = [{
            x: '',
            y: '',
            ex: '',
            ey: '',
          }]; 
        }
        this.detectionform = response.data;
        console.log(this.detectionform);
        this.innerDetection = true;
        this.detectiontitle = "修改检测点";
      });
    },
    /** 检测点新增修改保存按钮 */
    detectionSave(){
      console.log(this.detectionform.domains.length === 1);
      if(this.detectionform.domains.length > 1){
        // for(var s=0;s<this.detectionform.domains.length;s++){
        //   var index = s+1;
        //   var indexs = index+2;
        //   this.detectionform['point'+index] = this.detectionform.domains[s].x + ","+this.detectionform.domains[s].y
        //   this.detectionform['point'+indexs] = this.detectionform.domains[s].ex + "," + this.detectionform.domains[s].ey;
        // }
      }else if(this.detectionform.domains.length === 1){
        this.detectionform.point1 = this.detectionform.domains[0].x + "," +this.detectionform.domains[0].y;
        this.detectionform.point2 = this.detectionform.domains[0].ex + ","+this.detectionform.domains[0].ey;
      }
      console.log(this.detectionform);
      this.$refs["detectionform"].validate(valid => {
        if (valid) {
          if (this.detectionform.detectionId != undefined) {
            updateDetection(this.detectionform).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.innerDetection = false;
                this.getdetectiondata();
                this.reset();
                this.detectioncanvasurl=undefined;
                window.sessionStorage.clear("biaozhuxy");
              }
            });
          } else {
            addDetection(this.detectionform).then(response => {
              console.log(response)
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.innerDetection = false;
                this.getdetectiondata();
                this.reset();
                this.detectioncanvasurl=undefined;
                window.sessionStorage.clear("biaozhuxy");
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    Deletedetection(row){
      const detectionId = row.detectionId;
      this.$confirm(
        '删除检测点为"' + detectionId + '"的数据项?此项检测点中配置的表计和读数信息会一并删除,是否确认?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
      .then(function() {
        return delDetection(detectionId);
      })
      .then(() => {
        this.getdetectiondata();
        this.msgSuccess("删除成功");
      })
      .catch(function() {});
    }, 
    /** 检测点新增修改取消按钮 */
    detectionCencel(){
      this.reset();
      this.innerDetection = false;
      window.sessionStorage.clear("biaozhuxy");
    },
    /** 检测点关闭操作 */ 
    detectionDialog(){
      this.detectionopen = false;
    },
    /**-------------------------------配置表记------------------------------------------------*/
    /** 配置表计按钮 */
    handleMarker(row){
      document.documentElement.scrollTop = 500;
      console.log(row);
      this.outerMeter = true;
      this.meterform.detectionId = row.detectionId;
      this.meterrowsiteId = row.siteId;
      this.meterrowcameraId = row.cameraId;
      this.meterrowdetectionId = row.detectionId;
      this.getMeterdata();
    },
    /** 获取表计列表 */
    getMeterdata(){
      var queryform = {
        "detectionId":this.meterform.detectionId
      }
      console.log("hk%%%%%%%%%%%%%%%%%%%%S获取表计列表入参",queryform);
      listMeterConfig(queryform).then(response => {
        console.log(response,'获取表计列表数据');
        this.meterData = response.rows;
      });
    },
    /** 表计关闭按钮操作 */
    cancelDialog(){
      this.outerMeter = false;
    },
    /** 表计新增按钮操作 */
    Addmeterclick(){
      document.documentElement.scrollTop = 500;
      window.sessionStorage.setItem("biaozhuimgurl",this.siteImgUrl);
      this.metercanvasurl="../../../../imgbiaozhu/newindex.html";
      this.reset();
      this.innerMeter = true;
      this.metertitle = "新增表计";
      this.meterform.siteId = this.meterrowsiteId;
      this.meterform.cameraId = this.meterrowcameraId;
      this.meterform.detectionId = this.meterrowdetectionId;
    },
    changetype(val){
      console.log(val);
      this.meterform.meterBaseId = undefined;
      var changetype = {
        "meterType":val
      }
      listMeterBase(changetype).then(response => {
        console.log(response,'获取关联表列表数据');
        this.changetypeoption = response.rows;
      });
    },
    addzbmeter(){
      this.meterform.domains.push({
        x: '',
        y: '',
        ex: '',
        ey: '',
        key: Date.now()
      });
    },
    // removezbmeter(item){
    //   var index = this.meterform.domains.indexOf(item);
    //   if (index !== -1) {
    //     this.meterform.domains.splice(index, 1)
    //   }
    // },
    /** 表计修改按钮操作 */
    Editmeterclick(row){
      this.reset();
      this.metercanvasurl="../../../../imgbiaozhu/newindex.html";
      window.sessionStorage.setItem("biaozhuimgurl",this.siteImgUrl);
      const meterId = row.meterId;
      getMeterConfig(meterId).then((response) => {
        console.log(response.data);
        var changetype = {
          "meterType":response.data.type
        }
        listMeterBase(changetype).then(response => {
          console.log(response,'获取关联表列表数据');
          this.changetypeoption = response.rows;
        });
        if(response.data.point0 !== null){
          var point0 = [];
          point0 = response.data.point0.split(','); 
          response.data.domains = [{
            x: Number(point0[0]),
            y: Number(point0[1]),
          }];
        }else if(response.data.point1 !== null){
          var point1 = [];
          point1 = response.data.point1.split(',');
          var point2 = [];
          point2 = response.data.point2.split(','); 
          console.log(point1);
          response.data.domains = [{
            x: Number(point1[0]),
            y: Number(point1[1]),
            ex:Number(point2[0]),
            ey:Number(point2[1]),
          }];
        }else if(response.data.point1 == null){
          response.data.domains = [{
            x: '',
            y: '',
            ex: '',
            ey: '',
          }]; 
        }
        this.meterform = response.data;
        this.innerMeter = true;
        this.metertitle = "修改表计";
      });
    },
    /** 表计保存按钮操作 */
    savemeter(){
      if(this.meterform.domains.length > 1){
        // for(var s=0;s<this.meterform.domains.length;s++){
        //   var index = s+1;
        //   var indexs = index+1;
        //   this.meterform['point'+index] = this.meterform.domains[s].x + ","+this.meterform.domains[s].y
        //   this.meterform['point'+indexs] = this.meterform.domains[s].ex + ","+this.meterform.domains[s].ey;
        // }
      }else if(this.meterform.domains.length === 1){
        if(this.meterform.type == "1"){
          this.meterform.point0 = this.meterform.domains[0].x + "," +this.meterform.domains[0].y;
        }else if(this.meterform.type != "1"){
          this.meterform.point1 = this.meterform.domains[0].x + "," +this.meterform.domains[0].y;
          this.meterform.point2 = this.meterform.domains[0].ex + ","+this.meterform.domains[0].ey;
        }
      }
      console.log(this.meterform);
      this.$refs["meterform"].validate(valid => {
        if (valid) {
          if (this.meterform.meterId != undefined) {
            updateMeterConfig(this.meterform).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.innerMeter = false;
                this.getMeterdata();
                this.reset();
                window.sessionStorage.clear("biaozhuxy");
                this.metercanvasurl=undefined;
              }
            });
          } else {
            addMeterConfig(this.meterform).then(response => {
              console.log(response)
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.innerMeter = false;
                this.getMeterdata();
                this.reset();
                this.metercanvasurl=undefined;
                window.sessionStorage.clear("biaozhuxy");
              }
            });
          }
        }
      });
    },
    /** 表计取消按钮操作 */
    cancelmeter(){
      this.reset();
      this.innerMeter = false;
      window.sessionStorage.clear("biaozhuxy");
    },
    /** 表计删除按钮操作 */
    Deletemeterclick(row){
      this.meterform.detectionId = row.detectionId;
      console.log(this.meterform.detectionId,"点击获取本条数据==",row.detectionId)
      const meterId = row.meterId
      this.$confirm(
        '删除表计为"' + meterId + '"的数据项?此项表计中配置的读数信息会一并删除,是否确认?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
      .then(function() {
        return delMeterConfig(meterId);
      })
      .then(() => {
        this.getMeterdata();
        this.msgSuccess("删除成功");
      })
      .catch(function() {});
    },
    /** --------------------------指针表配置项-------------------------- */
    // 新增指针表配置项
    Addmeterbtn(){
      this.addmetertitle="指针表配置项";
      this.addmeteropen = true;
      this.addmeterform.meterType = "1";
    },
    addmeterformSave(){

      console.log(this.addmeterform)
      this.$refs["addmeterform"].validate(valid => {
        if (valid) {
          addMeterBase(this.addmeterform).then(response => {
            console.log(response)
            if (response.code === 200) {
              this.msgSuccess("新增成功");
              this.addmeteropen = false;
              var changetype = {
                "meterType":1
              }
              listMeterBase(changetype).then(response => {
                console.log(response,'获取全部表计配置项');
                this.changetypeoption = response.rows;
              });
              this.addreset();
            }
          });
        }
      })
    },
    addmeterformCencel(){
      this.addmeteropen = false;
      this.reset();
    },

    /**-------------------------------读数-Reading----------------------------------------------*/
    /** 读数项按钮操作 */ 
    Readingclick(row){
      document.documentElement.scrollTop = 500;
      console.log(row);
      this.outerReading = true;
      this.rowreadingIdmeterId = row.meterId;
      this.readingform.meterId = row.meterId;
      this.getReadingdata();
    },
    /** 获取读数项列表 */
    getReadingdata(){
      var queryparam = {
        "meterId":this.rowreadingIdmeterId
      }
      listReading(queryparam).then(response => {
        console.log(response,'获取读数项列表数据');
        this.readingData = response.rows;
      });
    },
    /** 读数项关闭按钮操作 */
    canceldsxDialog(){
      this.outerReading = false;
    },
    /** 读数项新增按钮操作 */
    AddReadingclick(){
      document.documentElement.scrollTop = 500;
      this.readingcanvasurl="../../../../imgbiaozhu/newindex.html";
      window.sessionStorage.setItem("biaozhuimgurl",this.siteImgUrl);
      this.reset();
      this.innerReading = true;
      this.readingtitle = "新增读数";
      this.readingform.meterId = this.rowreadingIdmeterId;
    },
    addzbreading() {
      this.readingform.domains.push({
        x: '',
        y: '',
        ex:'',
        ey:'',
        key: Date.now()
      });
    },
    // removezbreading(item) {
    //   var index = this.readingform.domains.indexOf(item);
    //   if (index !== -1) {
    //     this.readingform.domains.splice(index, 1)
    //   }
    // },
    // /** 读数项修改按钮操作 */
    EditReadingclick(row){
      this.reset();
      this.readingcanvasurl="../../../../imgbiaozhu/newindex.html";
      window.sessionStorage.setItem("biaozhuimgurl",this.siteImgUrl);
      const readingId = row.readingId;
      getReading(readingId).then((response) => {
        console.log(response);
        if(response.data.point1 !== null){
          var point1 = [];
          point1 = response.data.point1.split(',');
          var point2 = [];
          point2 = response.data.point2.split(',');
          console.log(point1);
          response.data.domains = [{
            x: Number(point1[0]),
            y: Number(point1[1]),
            ex: Number(point2[0]),
            ey: Number(point2[1])
          }];
        }else if(response.data.point1 == null){
          response.data.domains = [{
            x: '',
            y: '',
            ex: '',
            ey: '',
          }]; 
        }
        this.readingform = response.data;
        this.innerReading = true;
        this.readingtitle = "修改读数项";
      });
    },
    /** 读数项保存按钮操作 */
    savereading(){
      console.log(this.readingform.domains);
      if(this.readingform.domains.length > 1){
        // for(var s=0;s<this.readingform.domains.length;s++){
        //   var index = s+1;
        //   var indexs = index+1;
        //   this.readingform['point'+index] = this.readingform.domains[s].x + ","+this.readingform.domains[s].y
        //   this.readingform['point'+indexs] = this.readingform.domains[s].ex + ","+this.readingform.domains[s].ey;
        // }
      }else if(this.readingform.domains.length === 1){
        this.readingform.point1 = this.readingform.domains[0].x + "," +this.readingform.domains[0].y;
        this.readingform.point2 = this.readingform.domains[0].ex + ","+this.readingform.domains[0].ey;
      }
      console.log(this.readingform);
      this.$refs["readingform"].validate(valid => {
        if (valid) {
          if (this.readingform.readingId != undefined) {
            updateReading(this.readingform).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.innerReading = false;
                this.getReadingdata();
                this.reset();
                this.readingcanvasurl=undefined;
                window.sessionStorage.clear("biaozhuxy");
              }
            });
          } else {
            addReading(this.readingform).then(response => {
              console.log(response)
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.innerReading = false;
                this.getReadingdata();
                this.reset();
                this.readingcanvasurl=undefined;
                window.sessionStorage.clear("biaozhuxy");
              }
            });
          }
        }
      });
    },
    /** 读数项取消按钮操作 */
    cancelreading(){
      this.reset();
      this.innerReading = false;
      window.sessionStorage.clear("biaozhuxy");
    },
    /** 读数项删除按钮操作 */
    DeleteReadingclick(row){
      const readingIds = row.readingId;
      this.$confirm(
        '是否确认删除读数项为"' + readingIds + '"的数据项?',
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

  },
  watch: {
    // 配置树的搜索
    filterText(val) {
      this.$refs.yuzhiweitree.filter(val);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-message-box__wrapper{
  margin-top: 600px;
}
.app-container {
  min-height: calc(100vh - 0px);
}
.videoContent {
  width: 100%;
  height: 540px;

  // .videoIframe{
  //   position: absolute;
  // }
}

.yuzhiweiTable {
  width: 100%;
  min-height: calc(100vh - 700px);
  .yuzhiweimain {
    min-height: 700px;
  }
}

/deep/ .el-dialog {
  margin-top: 0px !important;
  // height: 450px;
  overflow: auto;
}
/deep/ .el-dialog:not(.is-fullscreen) {
  margin-top: 0vh !important;
}
/deep/.el-picker-panel {
  z-index: 2027;
  bottom: 136px;
  height: 440px;
  position: fixed;
  top: 511px;
  left: 711px;
}
/deep/.el-dialog__body{
  padding: 20px !important;
}

.imgdizhis{
  width: 520px;

  /deep/ .el-input__inner{
    width: 520px;
  }
}
</style>

