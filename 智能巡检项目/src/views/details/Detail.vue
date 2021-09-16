<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="isOpen"
    :width="dialogWidth"
    :before-close="dialogClose"
    :append-to-body="true"
  >
    <el-form ref="formDetail" :model="formDetail" label-width="100px">
      <el-form-item prop="alarmPictrueUrl" v-if="alarmPictrueShow">
        <el-image
          style="width: 300px; height: 200px"
          fit="fill"
          :preview-src-list="srcList"
          :src="formDetail.alarmPictrueUrl"
        ></el-image>
      </el-form-item>
      <el-form-item label="告警级别" prop="alarmType">
        <el-input
          v-model="alarmLevelsKV[formDetail.alarmLevel]"
          placeholder="告警级别"
          :disabled="formDisabled"
        />
      </el-form-item>
      <el-form-item label="告警设备" prop="equipmentName">
        <el-input
          v-model="formDetail.equipmentName"
          placeholder="告警设备"
          :disabled="formDisabled"
        />
      </el-form-item>
      <el-form-item label="告警类别" prop="earliestTime">
        <el-input
          v-model="formDetail.defectName"
          placeholder="告警类别"
          :disabled="formDisabled"
        />
      </el-form-item>
      <el-form-item label="告警阀值" prop="alarmConditionNote" v-if="eventVal">
        <el-input
          v-model="formDetail.alarmConditionNote"
          placeholder="告警阀值"
          :disabled="formDisabled"
        />
      </el-form-item>
      <el-form-item label="告警数值" prop="eventVal" v-if="eventVal">
        <el-input
          v-model="formDetail.eventVal"
          placeholder="告警数值"
          :disabled="formDisabled"
        />
      </el-form-item>
      <el-form-item label="确认状态" prop="alarmNum">
        <el-input
          v-if="formDetail.confirmStatus === '1'"
          v-model="confirmStatusOptions[1].dictLabel"
          placeholder="确认状态"
          :disabled="formDisabled"
        />
        <el-input
          v-else
          v-model="confirmStatusOptions[0].dictLabel"
          placeholder="确认状态"
          :disabled="formDisabled"
        />
      </el-form-item>
      <el-form-item
        label="确认人"
        prop="confirmBy"
        v-if="formDetail.confirmStatus == '1'"
      >
        <el-input
          v-model="formDetail.confirmBy"
          placeholder="确认人"
          :disabled="formDisabled"
        />
      </el-form-item>
      <el-form-item
        label="确认时间"
        prop="confirmTime"
        v-if="formDetail.confirmStatus == '1'"
      >
        <el-input
          v-model="formDetail.confirmTime"
          placeholder="确认时间"
          :disabled="formDisabled"
        />
      </el-form-item>
      <el-form-item v-if="formDetail.alarmNum" label="重复次数" prop="alarmNum">
        <el-input
          v-model="formDetail.alarmNum"
          placeholder="重复次数"
          :disabled="formDisabled"
        />
      </el-form-item>
      <el-form-item label="最早发生时间" prop="firstEventTime">
        <ul class="list-group list-group-striped">
          <li>
            {{ formDetail.firstEventTime }}
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="发生时间" prop="eventTime">
        <ul class="list-group list-group-striped">
          <li>
            {{ formDetail.eventTime }}
          </li>
        </ul>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <slot name="functionButton"></slot>
    </div>
  </el-dialog>
</template>

<script>
import { getRealtime } from "@/api/alarm/realtime";
import { getConfigKey } from "@/api/system/config"; //全局获取告警图片IP地址和摄像头账户密码
export default {
  // name: detailDialog,
  data() {
    return {
      visible: this.isOpen,
      formDisabled: true,
      srcList: [],
      formDetail: {},
      alarmLevelsKV: {
        1: "紧急",
        2: "重要",
        3: "次要",
        4: "提示",
      },
      confirmStatusOptions: [
        { dictValue: "0", dictLabel: "未确认" },
        { dictValue: "1", dictLabel: "已确认" },
      ],
      imgIp: "",
      //控制页面空间显示和隐藏
      alarmPictrueShow: false,
      eventVal: false,
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    dialogWidth: {
      type: String,
      default: "500px",
    },
    dialogTitle: {
      type: String,
      default: "",
    },
    id: {
      type: Number,
      default: null,
    },
  },
  watch: {
    isOpen() {
      this.formDetail = {};
      this.visible = this.isOpen;
      this.getIp();
    },
  },
  methods: {
    getIp() {
      getConfigKey("server.fdfs.ip").then((response) => {
        this.imgIp = response.msg;
        this.initData();
      });
    },
    initData() {
      getRealtime(this.id).then((response) => {
        this.formDetail = response.data;
        this.setImage(this.formDetail);
        this.formDetail.alarmPictrueUrl =
          "http://" + this.imgIp + "/" + this.formDetail.alarmPictrueUrl;
        this.srcList = [];
        this.srcList.push(this.formDetail.alarmPictrueUrl);
        this.setAlarm(this.formDetail);
        this.equipmentName(this.formDetail);
      });
    },
    dialogClose() {
      this.$emit("update:isOpen", false);
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
    equipmentName(formDetail) {
      if (
        formDetail.equipmentName === null ||
        formDetail.equipmentName === ""
      ) {
        if (formDetail.siteName === null || formDetail.siteName === "") {
          formDetail.equipmentName = formDetail.cameraName;
        } else {
          formDetail.equipmentName = formDetail.siteName;
        }
      } else {
        formDetail.equipmentName = formDetail.equipmentName;
      }
    },
  },
};
</script>
