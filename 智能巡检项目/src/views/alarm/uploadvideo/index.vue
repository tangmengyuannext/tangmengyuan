<template>
  <div class="app-container">
     <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['alarm:uploadvideo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['alarm:uploadvideo:remove']"
        >删除</el-button>
      </el-col>
    </el-row>
    <el-table :data="audioDataList" v-loading="loading" @selection-change="handleSelectionChange" style="width: 100%">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column prop="voiceName" label="名称">
      </el-table-column>
      <el-table-column prop="voiceUrl" label="地址">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['alarm:uploadvideo:remove']"
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

    <el-dialog :title="title" v-if="isshow" :visible.sync="open" width="800px" append-to-body>
      <el-row :gutter="10">
        <el-form ref="audioForm" :model="audioForm" :rules="rules">
          <el-form-item prop="Audio">
            <el-upload
              ref="replaceUploader"
              :file-list="fileList"
              v-model="audioForm.voiceUrl"
              class="avatar-uploader"
              :headers="upload.headers"
              :action="upload.uploadUrl" 
              :limit="1"
              :show-file-list="false"
              :on-success="handleReplaceAvatarSuccess"
              :on-progress="uploadVideoProcess">
                <el-col :span="6">
                  <el-button size="small" type="primary" class="btnClick">点击上传</el-button>
                </el-col>
                <el-col :span="18">
                  <audio v-if="audioForm.voiceUrl !='' && !audioFlag" :src="audioForm.voiceUrl" controls preload> 你的浏览器不支持 <code>audio</code> 标签.</audio>
                  <i v-else-if="audioForm.voiceUrl =='' && !audioFlag" class="el-icon-plus avatar-uploader-icon"></i>
                  <el-progress v-if="audioFlag == true" type="line" v-bind:percentage="audioUploadPercent" style="margin-top:7px;margin-left:40px;"></el-progress>
                </el-col>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="issuccess" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  ListinformVoice,
  addinformVoice,
  delinformVoice
} from "@/api/alarm/uploadvideo"


import axios from 'axios';

import { getToken } from "@/utils/auth";


export default {
  // name: "Line",
  // components: { Treeselect },
  data() { 
    return {
      // 遮罩层
      loading: true,
      // 是否显示弹出层
      open: false,
      isshow:false,
      // 非多个禁用
      multiple: true,
      // 总页数 
      total:0, // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 弹出层标题
      title: "",
      // 表单参数
      videoForm:{},
      // 表单校验
      rules: {},
      // // 用户传入的参数
      upload: {
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        uploadUrl: process.env.VUE_APP_BASE_API + "/common/upload"
      },
      audioFlag: false,
      //是否显示进度条
      audioUploadPercent: "",
      issuccess:true,
      //进度条的进度，
      fileList:[],
      audioForm:{},
      audioDataList:[],
    };
  },
  created() {
    this.getList();
    // this.getquyulist();
    // // this.quyuChange();
    // this.getdefectlist();

    // this.getalarmConfigList();
  },
  methods: {
    // 获取列表
    getList(){
      ListinformVoice(this.queryParams).then(response => {
        console.log(response)
        this.audioDataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.voiceId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.isshow = false;
      this.reset();
    },
    reset(){
      this.fileList=[];
      this.audioUploadPercent = 0;
      this.audioForm = {
        voiceUrl : undefined,
        voiceName : undefined,
      }
    },
     /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.isshow = true;
      this.title = "添加音频上传";
    },
    handleDelete(row) {
      const voiceIds = row.voiceId || this.ids;
      this.$confirm(
        '是否确认删除告警通知编号为"' + voiceIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
      .then(function() {
        return delinformVoice(voiceIds);
      })
      .then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
      .catch(function() {});
    },
    /** 提交按钮 */
    submitForm: function() {
      console.log(this.audioForm)
      this.$refs["audioForm"].validate(valid => {
        if (valid) {
          addinformVoice(this.audioForm).then(response => {
            console.log(response)
            // debugger
            if (response.code === 200) {
              this.msgSuccess("新增成功"); 
              this.open = false;
              this.isshow = false;
              this.getList();
              // this.reset()
            }
          });
        }
      });
    },

    // 音频上传成功
    handleReplaceAvatarSuccess(res, file, fileList) {
      // this.replaceList = URL.createObjectURL(file.raw);
      console.log(res,'-------------------------====================================',fileList)
      this.audioFlag = false;
      this.audioUploadPercent = 0;
      if(res.code == 200){
        this.issuccess = false;
          // this.audioForm.audioUploadId = res.data.uploadId;
          this.audioForm.voiceUrl = process.env.VUE_APP_BASE_API + res.fileName;
          this.audioForm.voiceName = fileList[0].name
          this.getList()
      }else{
          this.$message.error('视频上传失败，请重新上传！');
      }
    },
    //进度条
    uploadVideoProcess(event, file, fileList) {
        this.audioFlag = true;
        this.audioUploadPercent = file.percentage.toFixed(0) * 1;
    },
    // /**上传文件限制--只能上传mp3格式的文件 */
    // beforeAvatarUpload(file) {
    //   console.log(file,'-----------',['audio/pcm'].indexOf(file.type),'-------=====');
    //     const isLt50M = file.size / 1024 / 1024  < 50;
    //     // if (['audio/mp3','audio/mpeg','audio/pcm'].indexOf(file.type) == -1) {
    //     //     this.$message.error('请上传正确的音频格式');
    //     //     return false;
    //     // }
    //     if (!isLt50M) {
    //         this.$message.error('上传音频大小不能超过50MB哦!');
    //         return false;
    //     }

    // },
  },
  watch: {
    
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-progress{
  width: 300px;
  margin-left: 0px;
  padding-top: 10px;
}
/deep/ .btnClick{
  margin-top: 10px;
  margin-right: 20px;
}
// /deep/ .audio{
//   border: none !important;
// }
</style>