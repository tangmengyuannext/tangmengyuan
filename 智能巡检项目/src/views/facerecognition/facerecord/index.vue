<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="facerecordlist" @selection-change="handleSelectionChange">
      <el-table-column label="检测智能感知终端名称" align="center" prop="cameraName" />
      <el-table-column label="智能感知终端所在场区" align="center" prop="cameraLocation" />
      <!-- <el-table-column label="是否识别到人员" align="center" prop="recognizeResult" :formatter="processResult" /> -->
      <el-table-column label="人员识别结果" align="center" prop="recognizeResult"/>
      <el-table-column label="人员名称" align="center" prop="recognizeName" :formatter="processName" />
      <el-table-column label="识别时间" align="center" prop="recordTime" />
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetails(scope.row)"
            v-hasPermi="['facerecognizerecord:query']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['facerecognizerecord:remove']"
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

    <!-- 工作人员识别记录详情对话框-->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="检测摄像头名称" prop="cameraName">
          <el-input type="text" v-model="form.cameraName" disabled style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="摄像头所在场区" prop="cameraLocation">
          <el-input type="text" v-model="form.cameraLocation" disabled style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="是否识别到人员" prop="recognizeResult">
          <el-input type="text" v-model="form.recognizeResult" disabled style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="人员名称" prop="recognizeName">
          <el-input type="text" v-model="form.recognizeName" disabled style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="识别时间" prop="recordTime">
          <el-input type="text" v-model="form.recordTime" disabled style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="现场照片" prop="recognizeImgUrl">
          <el-image style="width:400px;height:300px;" fit="fill" :preview-src-list="srcList"
                    :src="form.recognizeImgUrl"></el-image>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { listFaceRecord,getFaceRecord,delFaceRecord } from "@/api/facerecognition/facerecord"
import { getConfigKey } from '@/api/system/config' //全局IP地址和摄像头账户密码
import { getToken } from '@/utils/auth';

export default {
  // name: "Line",
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
        // 照片识别表格数据
        facerecordlist: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
            pageNum: 1,
            pageSize: 10
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {

        },
        // imgIp:process.env.VUE_APP_BASE_API, //本地
        // imgIp:"http://192.168.1.50:8080/", //服务器图片地址
        imgIp: '',
        srcList: [],
        propaddress:"",
    };
  },
  created() {
      this.getList();
      this.getIp();
  },
  mounted(){
    this.propaddress = undefined;
    window.addEventListener("message",function(e){
      console.log(e.data.data,'-------data');
    })
  },
  methods: {
    /** 设置表头颜色 */
    headClass () {
      return 'text-align: center;background:#d4eaf5;'
    },
    /** 获取服务器ip */
    getIp() {
        getConfigKey('server.fdfs.ip').then(response => {
          console.log('response',response)
          this.imgIp = response.msg
        })
      },
    /** 处理识别结果 */
    processResult(row) {
      if (row.recognizeResult === 'Registered') {
        return '注册人员'
      }
      if (row.recognizeResult === 'Unregistered') {
        return '未注册人员'
      }
      if (row.recognizeResult === 'Not Found') {
        return '未识别到人'
      }
      return row.recognizeResult
    },
    /** 处理人员名称 */
    processName(row) {
      if (row.recognizeName === 'none' || row.recognizeName === 'Not Found') {
        return ''
      }
      return row.recognizeName
    },

    /** 查询人员识别列表 */
    getList() {
      this.loading = true;
      console.log(this.queryParams)
      listFaceRecord(this.queryParams).then(response => {
        console.log(response)
        this.facerecordlist = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 表单重置
    reset() {
      this.form = {
        userName:undefined,
        imgName:undefined,
        imgUrl:undefined
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
      this.ids = selection.map(item => item.faceId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 详情按钮操作 */
    handleDetails(row) {
      console.log(row);
      this.reset();
      const recordId = row.recordId || this.ids;
      //修改参数值用于页面展示
      getFaceRecord(recordId).then(response => {
        // if (response.data.recognizeResult === 'Registered') {
        //   response.data.recognizeResult =  '注册人员'
        // }
        // if (response.data.recognizeResult === 'Unregistered') {
        //   response.data.recognizeResult =  '非工作人员'
        // }
        // if (response.data.recognizeResult === 'Not Found') {
        //   response.data.recognizeResult =  '未识别到人'
        // }
        // if (response.data.recognizeName === 'none' || response.data.recognizeName === 'Not Found') {
        //   response.data.recognizeName = ''
        // }
        this.form = response.data;
        this.form.recognizeImgUrl =process.env.VUE_APP_BASE_API+ '/' + row.recognizeImgUrl;
        this.srcList = [];
        this.srcList.push(this.form.recognizeImgUrl);
        console.log("recognizeImgUrl:" + this.form.recognizeImgUrl);
        this.open = true;
        this.title = "人员识别记录详情";
      });
    },
    /** 取消按钮操作 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const recordId = row.recordId || this.ids;
      this.$confirm(
        '是否确认删除选择的人员识别记录数据?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
      .then(function() {
        return delFaceRecord(recordId);
      })
      .then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
      .catch(function() {});
    },
  },
  watch: {

  }
};
</script>
