<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="所在场区" prop="areaId">
        <el-select
          v-model="queryParams.areaId"
          clearable
          filterable
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in areaOptions"
            :label="item.areaName"
            :value="item.areaId"
            :key="item.areaId"
            @keyup.enter.native="handleQuery"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="告警级别" prop="alarmLevel">
        <el-select
          v-model="queryParams.alarmLevel"
          clearable
          filterable
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="dict in alarmLevelOptions"
            :label="dict.dictLabel"
            :value="dict.dictValue"
            :key="dict.dictValue"
            @keyup.enter.native="handleQuery"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="告警设备" prop="equipmentId">
        <treeselect
          v-model="queryParams.equipmentId"
          :options="equipmentOptions"
          :normalizer="normalizer"
          placeholder="请选择"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="告警类别" prop="defectId">
        <el-select
          v-model="queryParams.defectId"
          clearable
          filterable
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in defectOptions"
            :label="item.defectName"
            :value="item.defectId"
            :key="item.defectId"
            @keyup.enter.native="handleQuery"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="确认状态" prop="confirmStatus">
        <el-select
          v-model="queryParams.confirmStatus"
          clearable
          filterable
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="dict in confirmStatusOptions"
            :label="dict.dictLabel"
            :value="dict.dictValue"
            :key="dict.dictValue"
            @keyup.enter.native="handleQuery"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          v-hasPermi="['alarm:real:query']"
          @click="handleQuery"
          >搜索
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['alarm:real:export']"
          >导出
        </el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="realtimeList"
      @selection-change="handleSelectionChange"
    >
      <!--      <el-table-column type="selection" width="55" align="center"/>-->
      <el-table-column label="告警级别" align="center" prop="alarmLevel" />
      <el-table-column label="告警类别" align="center" prop="defectName" />
      <el-table-column label="告警设备" align="center" prop="equipmentName" />
      <el-table-column label="预置位" align="center" prop="siteName" />
      <el-table-column label="所在场区" align="center" prop="alarmFrom" />
      <!-- <el-table-column label="告警内容" align="center" prop="alarmConditionNote" /> -->
      <!-- <el-table-column label="预置位" align="center" prop="siteName" /> -->
      <!-- <el-table-column label="告警内容" align="center" prop="alarmNote" /> -->
      <el-table-column label="告警时间" align="center" prop="eventTime" width="100"/>
      <el-table-column label="确认状态" align="center" prop="confirmStatus" />
      <el-table-column label="确认人" align="center" prop="confirmBy" />
      <el-table-column label="操作" align="center" width="320">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetails(scope.row)"
            v-hasPermi="['alarm:real:details']"
            >详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-success"
            @click="handleSure(scope.row)"
            v-hasPermi="['alarm:real:confirm']"
            :disabled="scope.row.confirmStatus == '已确认' ? true : false"
            >{{ scope.row.confirmStatus == "已确认" ? "已确认" : "确认" }}
          </el-button>
          <!--          v-show="scope.row.confirmStatus == '已确认' ? false : true"-->
          <!--          icon="el-icon-tickets"-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="showClear(scope.row)"
            v-hasPermi="['alarm:real:clear']"
            :disabled="scope.row.confirmStatus == '已确认' ? false : true"
            >清除告警
          </el-button>
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

    <!-- 告警详情组件 -->
    <detail
      :is-open.sync="open"
      dialog-width="500px"
      :dialog-title="title"
      :id="alarmDetailId"
      @update:open="(val) => (open = val)"
    >
      <template v-slot:functionButton>
        <el-button
          type="primary"
          @click="handleSure(row)"
          :disabled="row.confirmStatus == '已确认' ? true : false"
          >{{ row.confirmStatus == "已确认" ? "已确认" : "确认" }}
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </detail>

    <!--清除 对话框-->
    <el-dialog
      :title="title"
      :visible.sync="dialogClearVisible"
      width="500px"
      append-to-body
    >
      <el-form ref="formClear" :model="formClear" :rules="rules">
        <el-form-item label="处理人" prop="disposeBy">
          <el-input
            v-model="formClear.disposeBy"
            placeholder="处理人"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="处理方式" prop="disposeNote">
          <el-input
            type="textarea"
            rows="8"
            maxlength="5000"
            v-model="formClear.disposeNote"
            placeholder="处理方式"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClear">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { dispose, listRealtime, exportRealtime } from "@/api/alarm/realtime";
import { getConfigKey } from "@/api/system/config"; //全局获取告警图片IP地址和摄像头账户密码
import { getConfirms } from "@/api/survey/fan/fandetails";
import { getDicts } from "@/api/system/dict/data";
import { listArea } from "@/api/device/area";
import { listDefect } from "@/api/device/defect";
import { listEquipmentunit } from "@/api/device/equipmentunit";
import Detail from "../../details/Detail.vue";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  // name: "realtime",
  components: {
    Detail,
    Treeselect,
  },
  data() {
    Detail;
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
      // 实时告警表格数据
      realtimeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      dialogClearVisible: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: "eventTime desc",
        isAsc: "",
        areaId: undefined,
        alarmLevel: undefined,
        defectId: undefined,
        confirmStatus: undefined,
        equipmentId: undefined,
      },
      // 表单参数
      form: {},
      formClear: {
        disposeBy: ""
      },
      row: {
        confirmStatus: undefined,
      },
      sureId: undefined,
      clearId: undefined,
      formDisabled: true,
      // 表单校验
      rules: {
        disposeBy: [
          { required: true, message: "请输入处理人", trigger: "change" },
        ],
        disposeNote: [
          { required: true, message: "请输入处理方式", trigger: "change" },
        ],
      },
      areaOptions: [],
      equipmentOptions: [],
      alarmLevelOptions: [],
      defectOptions: [],
      confirmStatusOptions: [
        { dictValue: "0", dictLabel: "未确认" },
        { dictValue: "1", dictLabel: "已确认" },
      ],
      // // 报警重复次数
      // repeatTimes: undefined,
      // // 报警重复列表
      // repeatList: undefined,
      imgIp: "",
      // imgIp:process.env.VUE_APP_BASE_API, //本地
      // imgIp:"http://192.168.1.50:8080/", //服务器图片地址
      srcList: [],
      alarmLevelsKV: {
        1: "紧急",
        2: "重要",
        3: "次要",
        4: "提示",
      },
      alarmDetailId: null, // 存放查询详情数据id
    };
  },
  created() {
    this.getList();
    this.getAreaOptions();
    this.getAlarmLevelOptions();
    this.getEquipmentOptions();
    this.getDefectOptions();
    this.getIp();
  },
  mounted() {},
  methods: {
    getIp() {
      getConfigKey("server.fdfs.ip").then((response) => {
        this.imgIp = response.msg;
      });
    },
    /** 查询实时告警列表 */
    getList() {
      this.loading = true;
      // console.log('this.queryParams',this.queryParams)
      listRealtime(this.queryParams).then((response) => {
        console.log("response", response);
        response.rows.map((v) => {
          v.alarmLevel = this.alarmLevelsKV[v.alarmLevel];
          if (v.confirmStatus == 1) {
            v.confirmStatus = "已确认";
          } else {
            v.confirmStatus = "未确认";
          }
        });
        this.realtimeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 所在厂区下拉列表
    getAreaOptions() {
      listArea().then((response) => {
        console.log(response, "所在厂区下拉列表");
        this.areaOptions = response.data;
      });
    },
    // 告警级别下拉列表
    getAlarmLevelOptions() {
      getDicts("alarm_level").then((response) => {
        console.log(response, "告警级别下拉列表");
        this.alarmLevelOptions = response.data;
      });
    },
    // 缺陷类型下拉列表
    getDefectOptions() {
      listDefect().then((response) => {
        console.log(response, "缺陷类型下拉列表");
        this.defectOptions = response.rows;
      });
    },
    /** 告警设备下拉树结构 */
    getEquipmentOptions() {
      listEquipmentunit().then((response) => {
        this.equipmentOptions = [];
        const data = {
          equipmentId: 0,
          equipmentName: "顶级节点",
          children: [],
        };
        data.children = this.handleTree(
          response.rows,
          "equipmentId",
          "parentId"
        );
        this.equipmentOptions.push(data);
        // this.equipmentOptions = this.handleTree(response.data, "equipmentId", "parentId");
      });
    },
    /** 转换设备部件数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.equipmentId,
        label: node.equipmentName,
        children: node.children,
      };
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // console.log('this.queryParams',this.queryParams)
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = this.$options.data().queryParams;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.alarmDetailId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 详情按钮操作 */
    handleDetails(row) {
      this.alarmDetailId = row.alarmDetailId;
      this.row = row;
      this.open = true;
      this.title = "详情";
    },
    /** 确认按钮操作 */
    handleSure(row) {
      const alarmDetailId = row.alarmDetailId;
      getConfirms([alarmDetailId]).then((response) => {
        if (response.code === 200) {
          this.$message({
            type: "success",
            message: "已确认",
          });
          this.open = false;
          this.getList();
        }
      });
    },
    /** 清除提交按钮 */
    handleClear: function () {
      this.$refs["formClear"].validate((valid) => {
        if (valid) {
          console.log("this.formClear", this.formClear);
          this.formClear.alarmDetailId = this.clearId;
          dispose(this.formClear).then((response) => {
            if (response.code === 200) {
              this.$message({
                type: "success",
                message: "处理成功",
              });
              this.dialogClearVisible = false;
              this.getList();
            }
          });
        }
      });
    },
    /** 清除按钮操作 */
    showClear(row) {
      console.log(row);
      this.formClear = this.$options.data().formClear;
      this.formClear.disposeBy = this.$store.state.user.name;
      if (this.$refs["formClear"]) this.$refs["formClear"].resetFields();
      this.dialogClearVisible = true;
      this.clearId = row.alarmDetailId;
      this.title = "清除告警";
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.dialogClearVisible = false;
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有实时告警数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportRealtime(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    /** 处理设备名称 */
    // equipmentName(row) {
    //   if (row.siteName === null || row.siteName === "") {
    //     return row.cameraName;
    //   }
    //   return row.siteName;
    // },
  },
};
</script>

<style lang="scss" scoped>
.vue-treeselect__control {
  display: table-cell;
}
</style>
