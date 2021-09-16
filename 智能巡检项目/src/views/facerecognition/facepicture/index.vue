<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="100px"
      :rules="queryParamsrules"
    >
      <el-form-item label="姓名" prop="userName">
        <el-input
          type="text"
          v-model="queryParams.userName"
          placeholder="请输入"
          size="small"
          maxlength="10"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="deptName">
        <treeselect
          v-model="queryParams.deptId"
          :options="deptOptions"
          :normalizer="normalizer"
          placeholder="请选择"
          style="width: 150px"
          aria-setsize="small"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          v-hasPermi="['facerecognition:query']"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['facerecognition:add']"
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['facerecognition:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['facerecognition:remove']"
        >删除</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-zoom-in"
          size="mini"
          @click="handleDiscern"
        >人脸对比</el-button> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['facerecognition:export']"
          >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="facepicturelist"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="姓名" align="center" prop="userName" />
      <el-table-column label="部门" align="center" prop="deptName" />
      <el-table-column label="岗位" align="center" prop="postName" />
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetails(scope.row)"
            v-hasPermi="['facerecognition:edit']"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['facerecognition:edit']"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['facerecognition:remove']"
            >删除</el-button
          >
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

    <!-- 工作人员信息添加对话框-->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="姓名" prop="userName">
          <el-input
            type="text"
            v-model="form.userName"
            maxlength="10"
            style="width: 200px"
            :disabled="addFlag == true ? false : true"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <treeselect
            v-model="form.deptId"
            :disabled="detailFlag"
            :options="deptOptions"
            :normalizer="normalizer"
            placeholder="请选择"
            style="width: 200px"
            @input="inputSelect"
          />
        </el-form-item>
        <el-form-item label="岗位" prop="postId">
          <el-select
            v-model="form.postId"
            clearable
            filterable
            placeholder="请选择"
            style="width: 200px"
            :disabled="detailFlag"
          >
            <el-option
              v-for="item in postOptions"
              :key="item.postName"
              :label="item.postName"
              :value="item.postId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="照片" prop="imgUrl" v-if="imgShow">
          <el-image
            style="width: 300px; height: 400px"
            fit="fill"
            :src="form.imgUrl"
          ></el-image>
        </el-form-item>
        <el-form-item label="上传图片" v-if="buttonShow">
          <el-upload
            class="upload-demo"
            ref="upload"
            :headers="uploadheader"
            :action="uploadimage"
            :limit="1"
            :on-success="handlesuccess"
            :before-upload="beforeAvatarUpload"
          >
            <el-button size="small" type="primary" style="width: 200px">{{
              buttonText
            }}</el-button>
            <div slot="tip" style="" class="el-upload__tip">
              *请保证照片中包含清晰的人脸，大小限制在500K以内
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :disabled="issuccess"
          >确定</el-button
        >
        <el-button @click="cancel" v-if="buttonShow">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="discerntitle"
      :visible.sync="discernopen"
      width="600px"
      append-to-body
    >
      <div class="faceIframe">
        <iframe
          id="faceIframes"
          src="../../../../face/cn/demo.html"
          frameborder="0"
          scrolling="no"
          style="width: 550px; height: 430px; z-index: -1"
        ></iframe>
      </div>
      <!-- <div>
          <el-upload
            class="upload-demo"
            :action="discernaction"
            :headers="discernheader"
            :limit="1"
            :on-success="handleimgaddress"
            :on-remove="handleRemove"
            :file-list="fileListimg"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </div> -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="discernClick">确 定</el-button>
        <el-button @click="quxiaoclick">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listFacepicture,
  getFacepicture,
  delFacepicture,
  addFacepicture,
  updateFacepicture,
  exportFacepicture,
  recognitFacepicture,
} from "@/api/facerecognition/facepicture";
import { listDept } from "@/api/system/dept";
import { listPost } from "@/api/system/post";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getToken } from "@/utils/auth";

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
      // 照片识别表格数据
      facepicturelist: [],
      // 部门树选项
      deptOptions: [],
      // 岗位表格数据
      postOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: "",
        deptId: undefined,
        imgUrl: "",
      },
      dynamicValidateForm: {
          alarmLevels: [],
          alarmConditions: [],
          thresholdConditions: [],
          threshold1s: [],
          threshold2s: []
        },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "请输入姓名", trigger: "change" },
        ],
        deptId: [
          { required: true, message: "请选择部门", trigger: "change" },
        ],
        postId: [
          { required: true, message: "请选择岗位", trigger: "change" },
        ]
      },
      fileList: [],
      uploadimage: process.env.VUE_APP_BASE_API + "/faceRecognition/upload",
      uploadheader: { Authorization: "Bearer " + getToken() }, //新增室图片上传
      issuccess: true,
      discerntitle: "", // 识别
      discernopen: false,
      propaddress: "",
      imgShow: false, //图片预览框显示判断
      buttonShow: false, //上传按钮显示判断
      addFlag: false, //新增状态判断
      detailFlag: false, //详情状态判断
      editFlag: false, //编辑状态判断
      buttonText: "上传",
      // discernaction:process.env.VUE_APP_BASE_API + "/faceRecognition/recognits", // 人脸对比
      // discernheader:{},
      fileListimg: [],
      queryParamsrules: {
        userName: [
          { pattern: /^[^\[\]\?\|\\]*$/, message: '不可以输入特殊符号' }
        ]
      },
    };
  },
  created() {
    this.getList();
    this.getPostOptions();
    this.getDeptOptions();
    // var uploadtoken = getToken(), prophttp = process.env.VUE_APP_BASE_API;
    // window.sessionStorage.setItem("imgtoken",uploadtoken);
    // window.sessionStorage.setItem('prophttp',prophttp);
    var uploadtoken = getToken(),
      prophttp = process.env.VUE_APP_BASE_API;
    window.sessionStorage.setItem("imgtokens", uploadtoken);
    window.sessionStorage.setItem("prophttps", prophttp);
    console.log(uploadtoken, prophttp);
    // this.uploadheader = {
    //   "Authorization":"Bearer " + uploadtoken
    // }
    // this.discernheader = {
    //   "Authorization":"Bearer " + uploadtoken
    // }
  },
  mounted() {
    this.propaddress = undefined;
    window.addEventListener("message", function (e) {
      console.log(e.data.data, "-------data");
    });
  },
  methods: {
    /** 设置表头颜色 */
    headClass() {
      return "text-align: center;background:#d4eaf5;";
    },
    /** 查询照片识别列表 */
    getList() {
      this.loading = true;
      console.log(this.queryParams);
      listFacepicture(this.queryParams).then((response) => {
        console.log(response);

        this.facepicturelist = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询岗位列表 */
    getPostOptions() {
      listPost(this.queryParams).then((response) => {
        this.postOptions = response.rows;
      });
    },
    /** 查询部门列表 */
    getDeptOptions() {
      listDept().then((response) => {
        this.deptOptions = this.handleTree(response.data, "deptId");
      });
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children,
      };
    },
    inputSelect(data) {
      this.$refs['form'].validateField("deptName");
    },
    // 表单重置
    reset() {
      this.form = {
        userName: "",
        deptId: undefined,
        postId: undefined,
        imgName: "",
        imgUrl: "",
      };
      this.resetForm("form");
    },
    clearFiles() {
      this.$refs["upload"].clearFiles();
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
      this.queryParams.deptId = undefined;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.faceId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.imgShow = false;
      this.buttonShow = true;
      this.addFlag = true;
      this.detailFlag = false;
      this.editFlag = true;
      this.issuccess = true;
      this.reset();
      this.open = true;
      this.title = "新增工作人员";
      this.fileList = [];
      this.imgUrl = "";
      this.buttonText = "上传";
      listDept().then((response) => {
        this.deptOptions = this.handleTree(response.data, "deptId");
      });
    },
    handlesuccess(res, file, fileList) {
      console.log("handlesuccess:", res, "-----", fileList);
      if (res.code == 200) {
        this.issuccess = false;
        this.form.imgUrl = process.env.VUE_APP_BASE_API +  res.fileName;
        this.form.imgName = file.name;
      }
    },
    handleerror(err, file, fileList) {
      console.log("handleerror:", err, file);
    },
    // beforeRemove(file, fileList) {
    //   return this.$confirm(`确定移除 ${file.name}？`);
    // },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 < 500;
      if (!isLt2M) {
        this.$message({
          message: "上传头像图片大小不能超过 500KB!",
          type: "warning",
          offset: "50%",
        });
      }
      const isFileName = this.imgNmaeLegal(file.name);
      if(!isFileName) {
        this.$message({
          message: "上传头像图片名称不能包含特殊字符",
          type: "warning",
          offset: "50%",
        });
      }
      return isLt2M && isFileName;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row);
      this.reset();
      this.form.postId = row.postId;
      this.imgShow = true;
      this.buttonShow = true;
      this.addFlag = false;
      this.detailFlag = false;
      this.editFlag = true;
      this.buttonText = "重新上传";
      const faceId = row.faceId || this.ids;
      getFacepicture(faceId).then((response) => {
        console.log(response.data.imgUrl);
        this.fileList = [];
        var obj = {};
        obj.url = process.env.VUE_APP_BASE_API + response.data.imgUrl;
        var arr = response.data.imgUrl.split("/");
        var end = arr.slice(-1);
        obj.name = end.join(",");
        this.fileList.push(obj);

        this.form = response.data;
        this.open = true;
        this.title = "编辑工作人员信息";
        this.issuccess = false;
      });
    },

    /** 详情按钮操作 */
    handleDetails(row) {
      console.log(row);
      this.reset();
      const faceId = row.faceId || this.ids;
      this.imgShow = true;
      this.buttonShow = false;
      this.addFlag = false;
      this.detailFlag = true;
      this.editFlag = false;
      getFacepicture(faceId).then((response) => {
        console.log(response.data.imgUrl);
        this.fileList = [];
        var obj = {};
        obj.url = process.env.VUE_APP_BASE_API + response.data.imgUrl;
        var arr = response.data.imgUrl.split("/");
        var end = arr.slice(-1);
        obj.name = end.join(",");
        this.fileList.push(obj);
        console.log("fileList:", this.fileList);
        this.form = response.data;
        this.open = true;
        this.title = "工作人员详情";
        this.issuccess = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.fileListimg = [];
      this.clearFiles();
    },
    /** 确认按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          console.log(this.form);
          if (this.addFlag) {
            if (this.form.imgName === "" || this.form.imgName === undefined) {
              this.msgError("请上传照片");
              return; 
            }
          }
          if (this.detailFlag) {
            this.open = false;
            this.reset();
          } else {
            this.msgWarning("正在处理图片，请稍候");
            this.issuccess = true;
            if (this.form.faceId != undefined) {
              updateFacepicture(this.form).then((response) => {
                this.issuccess = false;
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addFacepicture(this.form).then((response) => {
                this.issuccess = false;
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                }
              });
            }
          }
          this.clearFiles();
        }
      });
    },
    /** 人脸对比按钮操作 */
    handleDiscern() {
      this.discerntitle = "人脸对比";
      this.discernopen = true;
      recognitFacepicture().then((response) => {

      })
    },
    // handleRemove(file, fileList) {
    //   console.log(file, fileList);
    // },
    // handleimgaddress(res, file, fileList) {
    //   console.log(res, file, fileList);
    // },
    // 人脸识别 确定按钮
    discernClick() {
      this.discernopen = false;
    },
    // 人脸识别取消按钮
    quxiaoclick() {
      this.discernopen = false;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const faceId = row.faceId || this.ids;
      this.$confirm("是否删除：" + row.userName + "?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delFacepicture(faceId);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有工作人员信息", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportFacepicture(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    imgNmaeLegal(fileName) {
      var reg = RegExp(/^[^\@\#\$\%\^\&\*\[\]\?\|\\]*$/);
      return reg.test(fileName);
    },
  },
  watch: {},
};
</script>
