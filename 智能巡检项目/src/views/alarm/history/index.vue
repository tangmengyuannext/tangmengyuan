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
      <el-form-item label="处理方式" prop="disposeStatus">
        <el-select
          v-model="queryParams.disposeStatus"
          clearable
          filterable
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item in disposeStatusOptions"
            :label="item.dictLabel"
            :value="item.dictValue"
            :key="item.dictValue"
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
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['alarm:history:export']"
          >导出
        </el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="historyList"
      @selection-change="handleSelectionChange"
    >
      <!--      <el-table-column type="selection" width="55" align="center"/>-->
      <el-table-column label="告警级别" align="center" prop="alarmLevel" />
      <el-table-column label="告警类别" align="center" prop="defectName" />
      <el-table-column label="告警设备" align="center" prop="equipmentName" />
      <el-table-column label="预置位" align="center" prop="siteName" />
      <el-table-column label="所在场区" align="center" prop="alarmFrom" />
      <el-table-column label="告警时间" align="center" prop="eventTime" />
      <el-table-column label="处理时间" align="center" prop="disposeTime" />
      <el-table-column label="处理人" align="center" prop="disposeBy" />
      <el-table-column
        label="处理方式"
        align="center"
        prop="disposeNoteLimit"
      />
      <el-table-column label="清除方式" align="center" prop="disposeStatus" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetails(scope.row)"
            v-hasPermi="['alarm:history:details']"
            >详情
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

    <!-- 历史告警详情对话框-->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item prop="alarmPictrueUrl" v-if="alarmPictrueShow">
          <el-image
            style="width: 300px; height: 200px"
            fit="fill"
            :preview-src-list="srcList"
            :src="form.alarmPictrueUrl"
          ></el-image>
        </el-form-item>
        <el-form-item label="告警级别" prop="alarmLevel">
          <el-input
            v-model="form.alarmLevel"
            placeholder="告警级别"
            :disabled="formDisabled"
          />
        </el-form-item>
        <el-form-item label="告警设备" prop="equipmentName">
          <el-input
            v-model="form.equipmentName"
            placeholder="告警设备"
            :disabled="formDisabled"
          />
        </el-form-item>
        <el-form-item label="告警类别" prop="defectName">
          <el-input
            v-model="form.defectName"
            placeholder="告警类别"
            :disabled="formDisabled"
          />
        </el-form-item>
        <el-form-item
          label="告警阀值"
          prop="alarmConditionNote"
          v-if="eventVal"
        >
          <el-input
            v-model="form.alarmConditionNote"
            placeholder="告警阀值"
            :disabled="formDisabled"
          />
        </el-form-item>
        <el-form-item label="告警数值" prop="eventVal" v-if="eventVal">
          <el-input
            v-model="form.eventVal"
            placeholder="告警数值"
            :disabled="formDisabled"
          />
        </el-form-item>
        <el-form-item label="处理方式" prop="confirmStatus">
          <el-input
            v-model="form.disposeNote"
            placeholder="处理方式"
            :disabled="formDisabled"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="处理人" prop="confirmBy">
          <el-input
            v-model="form.disposeBy"
            placeholder="处理人"
            :disabled="formDisabled"
          />
        </el-form-item>
        <el-form-item label="处理时间" prop="confirmTime">
          <el-input
            v-model="form.disposeTime"
            placeholder="处理时间"
            :disabled="formDisabled"
          />
        </el-form-item>
        <el-form-item label="重复次数" prop="repeatTimes">
          <el-input
            v-model="form.alarmNum"
            placeholder="重复次数"
            :disabled="formDisabled"
          />
        </el-form-item>
        <el-form-item label="最早发生时间" prop="firstEventTime">
          <ul class="list-group list-group-striped">
            <li>
              {{ form.firstEventTime }}
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="发生时间" prop="eventTime">
          <ul class="list-group list-group-striped">
            <li>
              {{ form.eventTime }}
            </li>
          </ul>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="submitForm">处 理</el-button> -->
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listHistory, exportHistory } from "@/api/alarm/history";
import { getConfigKey } from "@/api/system/config"; //全局获取告警图片IP地址和摄像头账户密码
import { getDicts } from "@/api/system/dict/data";
import { listArea } from "@/api/device/area";
import { listDefect } from "@/api/device/defect";
import { listEquipmentunit } from "@/api/device/equipmentunit";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  // name: "Line",
  components: {
    Treeselect,
  },
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
      // 历史告警表格数据
      historyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderByColumn: "disposeTime desc, eventTime desc",
        isAsc: "",
        areaId: undefined,
        alarmLevel: undefined,
        defectId: undefined,
        disposeStatus: undefined,
      },
      // 表单参数
      form: {},
      formDisabled: true,
      // 表单校验
      rules: {},
      areaOptions: [],
      equipmentOptions: [],
      alarmLevelOptions: [],
      defectOptions: [],
      disposeStatusOptions: [
        { dictValue: "1", dictLabel: "手动清除" },
        { dictValue: "3", dictLabel: "自动恢复" },
      ],
      // 报警重复次数
      repeatTimes: undefined,
      // 报警重复列表
      repeatList: undefined,
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
      disposeStatusKV: {
        // '0': '未处理',
        1: "手工清除",
        3: "自动恢复",
      },
      //控制页面空间显示和隐藏
      alarmPictrueShow: false,
      eventVal: false,
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
    /** 查询历史告警列表 */
    getList() {
      this.loading = true;
      listHistory(this.queryParams).then((response) => {
        console.log("getList", response);
        response.rows.map((v) => {
          v.alarmLevel = this.alarmLevelsKV[v.alarmLevel];
          v.disposeStatus = this.disposeStatusKV[v.disposeStatus];
          if (v.disposeNote != null) {
            v.disposeNoteLimit =
              v.disposeNote.length > 20
                ? v.disposeNote.substr(0, 20) + "..."
                : v.disposeNote;
          }
        });
        this.historyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 所在厂区下拉列表
    getAreaOptions() {
      listArea().then((response) => {
        // console.log(response, '所在厂区下拉列表')
        this.areaOptions = response.data;
      });
    },
    // 告警级别下拉列表
    getAlarmLevelOptions() {
      getDicts("alarm_level").then((response) => {
        // console.log(response, '告警级别下拉列表')
        this.alarmLevelOptions = response.data;
      });
    },
    // 缺陷类型下拉列表
    getDefectOptions() {
      listDefect().then((response) => {
        // console.log(response, '缺陷类型下拉列表')
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
    // 取消按钮
    cancel() {
      this.open = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {
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
      // console.log('row', row)
      this.form.alarmLevel = row.alarmLevel;
      this.form.defectName = row.defectName;
      this.form.disposeBy = row.disposeBy;
      this.form.disposeNote = row.disposeNote;
      this.form.disposeTime = row.disposeTime;
      this.form.eventVal = row.eventVal;
      this.form.alarmConditionNote = row.alarmConditionNote;
      this.setImage(row);
      this.setAlarm(row);
      this.equipmentName(row);
      this.form.alarmPictrueUrl =
        "http://" + this.imgIp + "/" + row.alarmPictrueUrl;
      this.srcList = [];
      this.srcList.push(this.form.alarmPictrueUrl);
      console.log("this.form.alarmPictrueUrl", this.form.alarmPictrueUrl);
      this.form.alarmNum = row.alarmNum;
      this.form.firstEventTime = row.firstEventTime;
      this.form.eventTime = row.eventTime;
      this.open = true;
      this.title = "详情";
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有历史告警数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportHistory(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    setAlarm(formDetail) {
      if (formDetail.eventVal != null) {
        this.eventVal = true;
      } else {
        this.eventVal = false;
      }
    },
    setImage(formDetail) {
      console.log("alarmPictrueUrl:" + formDetail.alarmPictrueUrl);
      if (formDetail.alarmPictrueUrl != null) {
        this.alarmPictrueShow = true;
      } else {
        this.alarmPictrueShow = false;
      }
    },
    /** 处理设备名称 */
    equipmentName(form) {
      if (form.equipmentName === null || form.equipmentName === "") {
        if (form.siteName === null || form.siteName === "") {
          this.form.equipmentName = form.cameraName;
        } else {
          this.form.equipmentName = form.siteName;
        }
      } else {
        this.form.equipmentName = form.equipmentName;
      }
    },
  },
};
</script>
