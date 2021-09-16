<template>
    <div class="screen-container">
        <!-- <div class="screen-big-title"></div> -->
        <div class="screen-big-title">
          <img :src="titlebgimg">
        </div>
        <el-button class="screen-choose-btn back-btn" @click="goBack()">返回大屏</el-button>
        <div class="setting-content">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <!-- <el-tab-pane label="地图设置" name="first">
                    <button class="screen-choose-btn" @click="addCamera">添加摄像头</button>
                    <button v-show="isChooseLocationVisible" class="screen-choose-btn" @click="openNewCameraDialog">选取当前坐标</button>
                    <button v-show="isChooseLocationVisible" class="screen-choose-btn" @click="cancelChooseLocation">取消</button>
                    <div class="imgcol">
                        <div class="imgdiv">
                            <el-carousel class="lunbodiv" indicator-position="none" :loop="false" :autoplay="false">
                                <el-carousel-item v-for="item in imglist" :key="item.id">
                                    <div class="card_pre">
                                        <img :src="item.imgSrc" class="w100p bd_blue bgimg" id="syzBg" ref="shengyazhanImg" />
                                        <div class="pos_ab top_0 left_0 h100p w100p bd_ccc">
                                            <span class="mg_20" v-show="isAddIconVisible">
                                                <img src="../../../assets/image/largescreen-locationlogo.png" id="addIcon" :style="addIconStyle" />
                                            </span>
                                            <span class="mg_20" v-for="imgspan in item.ilist" :key="imgspan.cameraId" @click="openImgDialog(imgspan)">
                                                  <img :src="imgspan.tubiao" :style="imgspan.stylename"/>
                                            </span>
                                        </div>
                                    </div>
                                </el-carousel-item>
                            </el-carousel>
                        </div>
                    </div>
                </el-tab-pane> -->
                <el-tab-pane label="视频设置" name="second">
                  <div class="video-settings">
                    <el-row class="video-settings-row">
                      <el-col :span="6">视频1</el-col>
                      <el-col :span="6">关联摄像头</el-col>
                      <el-col :span="12">
                        <el-cascader v-model="cameraOne" :options="cameraOptions" :disabled="selectDisabled" clearable></el-cascader>
                      </el-col>
                    </el-row>
                    <el-row class="video-settings-row">
                      <el-col :span="6">视频2</el-col>
                      <el-col :span="6">关联摄像头</el-col>
                      <el-col :span="12">
                        <el-cascader v-model="cameraTwo" :options="cameraOptions" :disabled="selectDisabled" clearable></el-cascader>
                      </el-col>
                    </el-row>
                    <el-row class="video-settings-row">
                      <el-col :span="6">视频3</el-col>
                      <el-col :span="6">关联摄像头</el-col>
                      <el-col :span="12">
                        <el-cascader v-model="cameraThree" :options="cameraOptions" :disabled="selectDisabled" clearable></el-cascader>
                      </el-col>
                    </el-row>
                    <el-row class="video-settings-row">
                      <el-col :span="6">视频4</el-col>
                      <el-col :span="6">关联摄像头</el-col>
                      <el-col :span="12">
                        <el-cascader v-model="cameraFour" :options="cameraOptions" :disabled="selectDisabled" clearable></el-cascader>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24" style="text-align: right;">
                        <button v-if="selectDisabled" class="screen-choose-btn" @click="selectDisabled=false">修改</button>
                        <button v-if="!selectDisabled" class="screen-choose-btn" @click="saveVideoSettings">提交</button>
                        <button v-if="!selectDisabled" class="screen-choose-btn" @click="canceVideoSettings">取消</button>
                      </el-col>
                    </el-row>
                  </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog title="摄像头信息" :visible.sync="showImgDialog" width="30%">
          <span>{{imgSpanData.deviceName}}</span>
          <span>{{imgSpanData.ip}}</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showImgDialog = false">关 闭</el-button>
            <el-button type="primary" @click="deleteCamera">删 除</el-button>
          </span>
        </el-dialog>
        <el-dialog title="添加摄像头" :visible.sync="isAddCameraVisible" width="80%">
            <el-form :model="cameraForm">
                <el-form-item label="摄像头坐标" :label-width="formLabelWidth">
                    <el-input v-model="cameraForm.locations" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="所属厂区" :label-width="formLabelWidth">
                    <el-select v-model="cameraForm.areaId" placeholder="请选择摄像头" disabled>
                        <el-option label="升压站" :value="areaId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="摄像头" :label-width="formLabelWidth">
                    <el-select v-model="cameraForm.cameraId" :multiple="false" placeholder="请选择摄像头" @change="cameraChange">
                        <el-option v-for="item, index in cameraList" :key="index" :label="item.cameraName" :value="item.cameraId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="isDirectionVisible" label="摄像头方向" :label-width="formLabelWidth">
                    <el-select v-model="cameraForm.direction" placeholder="请选择摄像头方向" @change="changeDirection">
                      <el-option label="上" value="shang"></el-option>
                      <el-option label="下" value="xia"></el-option>
                      <el-option label="左" value="zuo"></el-option>
                      <el-option label="右" value="you"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isAddCameraVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitCamera">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>

import { listCamera } from "@/api/device/camera";
import { getAreaImage } from "@/api/device/areaImage";
import { saveLocation,
        getLocationCamera,
        getCameraDefaultSetting,
        saveCameraDefaultSetting,
        getLocationByArea,
        deleteCameraLoction,
        cameraNotConfigured
} from "@/api/largescreen/largescreen";
import { listConfig } from "@/api/system/config"; // 动态获取大屏的标题

export default {
  data() {
    return {
        activeName: 'second',
        // 地图设置
        imglist: [],
        showImgDialog: false, // 图标信息对话框显隐控制
        isAddCameraVisible: false, // 添加摄像头弹窗显隐控制
        imgSpanData: {
          deviceName: null,
          id: null,
          ikey: null,
          ip: null,
          stylename: null,
          tubiao: null
        }, // 查看底图图标详情时临时存放坐标数据
        formLabelWidth: '120px',
        cameraForm: {
            areaId: null,
            cameraId: null,
            imageId: 1,
            locations: null,
            styleLeft: null,
            styleTop: null,
            cameraIconName: null,
            direction: null,
            modelId: null,
        },
        smallType: null, // 摄像头小类别
        cameraList: [], // 升压站厂区下的摄像头列表
        areaId: null, // 所属厂区id
        isDirectionVisible: false, // 摄像头方向下拉框显隐
        isAddIconVisible: false, // 选取坐标的图标显隐
        addIconStyle: {left: '50%', top: '50%', width: '20px', height: '20px', 'z-index': 99}, // 选取坐标的图标初始样式
        isChooseLocationVisible: false, // 选取坐标点按钮显隐
        isDrag: false,
        imgWidth: 0, // 底图宽
        imgHeight: 0, // 底图高
        offsetLeft: 0, // 图标距离左边距离
        offsetTop: 0, // 图标距离顶边距离

        // 视频设置
        cameraOptions: [],
        cameraOne: null,
        cameraTwo: null,
        cameraThree: null,
        cameraFour: null,
        cameraAllList: [], // 全部摄像头列表，设置默认监控用
        selectDisabled: true, // 设置下拉框是否禁用
        currentVideoSetting: [], // 当前保存的视频设置
        titlebgimg:"",
    }
  },
  created() {
    this.imglist = [
      {
        imgSrc: require("../../../assets/image/shengyazhan_bg.jpg"),
        id: "1",
        ilist: [
          {
            id: "27",
            tubiao: require("../../../assets/image/旋转式-球机.png"),
            ikey: "yuntai",
            ip: "22.18.3.103",
            deviceName: '28#智能感知终端',
            // stylename: { left: "30%", top: "51%" },
            // stylename: { left: "35%", top: "55%" },
            stylename: { left: "30%", top: "51.5%" },
          },
          {
            id: "36",
            tubiao: require("../../../assets/image/旋转式-球机.png"),
            ikey: "yuntai",
            ip: "22.18.3.104",
            deviceName: '19#智能感知终端',
            // stylename: { left: "57%", top: "40%" },
            // stylename: { left: "62%", top: "41%" },
            stylename: { left: "63.5%", top: "37%" },
          },
          {
            id: "45",
            tubiao: require("../../../assets/image/旋转式-球机.png"),
            ikey: "yuntai",
            ip: "22.18.3.117",
            deviceName: '13#智能感知终端',
            // stylename: { left: "52%", top: "79%" },
            // stylename: { left: "52%", top: "78%" },
            stylename: { left: "50%", top: "76%" },
          },
          {
            id: "46",
            tubiao: require("../../../assets/image/旋转式-球机.png"),
            ikey: "yuntai",
            ip: "22.18.3.118",
            deviceName: '14#智能感知终端',
            // stylename: { left: "56%", top: "62%" },
            // stylename: { left: "56%", top: "63%" },
            stylename: { left: "53%", top: "58%" },
          },
        ],
      },
    ];
    // this.getCameraArea();
    this.getCameraList(); // 获取视频配置所需下拉摄像头列表
    this.gettitlebgimg();
  },
  methods: {
    // 获取大屏背景图名称及风机温度的文案
    gettitlebgimg(){
      listConfig().then(response => {
        response.rows.map((v)=>{
          if(v.configKey == "sys.index.titlebgimg"){
            // this.titlebgimg = 'url("'+ require('../../../assets/image/' + v.configValue) + '")'
            this.titlebgimg = require('../../../assets/image/' + v.configValue)
          }
        })
      })
    },
    // 获取厂区ID
    getCameraArea() {
      const that = this;
      getAreaImage(1).then((response) => { // 默认imageId传1
        that.areaId = response.data.areaId;
        that.cameraForm.areaId = that.areaId;
        that.getLocationsByArea(that.areaId);
        // that.getLocationCameraList(that.areaId);
        that.getNotConfiguredCameraList(that.areaId);
      });
    },
    // 获取坐标点
    getLocationsByArea(areaId) {
      const param = { areaId: (parseInt(areaId) - 0) };
      const that = this;
      const iList = [];
      getLocationByArea(param).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          iList.push({
            id: response.data[i].locationId,
            tubiao: require("../../../assets/image/" + response.data[i].cameraIconName),
            ip: response.data[i].camera.ip,
            deviceName: response.data[i].cameraName,
            cameraId: response.data[i].cameraId,
            modelId: response.data[i].modelId,
            stylename: { left: response.data[i].styleLeft, top: response.data[i].styleTop }
          });
        }
        that.imglist[0].ilist = iList;
      });
    },
    // 获取底图标记升压站厂区摄像头列表（已弃用）
    getLocationCameraList(param) {
        const that = this;
        getLocationCamera(param).then((response) => {
            that.cameraList = response.rows;
        });
    },
    // 获取未配置的摄像头
    getNotConfiguredCameraList(areaId) {
      const that = this;
      cameraNotConfigured(areaId).then((response) => {
        that.cameraList = response.data;
      });
    },
    // 点击添加摄像头按钮
    addCamera() {
        this.isAddIconVisible = true; // 显示添加摄像头图标
        // 对多个元素绑定拖拽事件，要先点击，然后才能拖拽（先点击获取元素对象）
        let obj=document.getElementById("addIcon")
        let obox=document.getElementById("syzBg");
        this.imgWidth = obox.clientWidth;
        this.imgHeight = obox.clientHeight;
        // 为每个元素加入拖拽事件
        this.drag(obj,obox)
    },
    // 拖拽
    drag(box,obox) {
        let disX
        let disY
        const that = this;
        // 鼠标左键按下事件
        box.onmousedown=function(ev){
            that.isChooseLocationVisible = true;
            let oEvent = ev||event;
            // clientX，clientY：鼠标点击位置到浏览器可视区域x，y距离
            // offsetLeft，offsetTop:元素距离父级元素的偏移距离
            disX = oEvent.clientX - box.offsetLeft;
            disY = oEvent.clientY - box.offsetTop;
            that.isDrag = true;
            // 鼠标移动事件
            document.onmousemove = function(ev){
                // 加入该判断拖拽更流畅
                if (that.isDrag) {
                    let oEvent = ev||event
                    // 计算点击元素到父级元素的定位top，left距离
                    let l=oEvent.clientX-disX
                    let t=oEvent.clientY-disY
                    /** 限定拖拽范围，限定拖拽元素在指定的范围内 */
                    // 限定左边界和上边界
                    if(l < 0){
                        l = 0;
                    }
                    if(t < 0){
                        t = 0;
                    }
                    // 限定右边界的距离(当l=父元素宽-子元素宽时，刚好子元素放在父元素最右边)
                    if(l > obox.clientWidth - box.clientWidth){
                        l = obox.clientWidth - box.clientWidth;
                    }
                    // 限定下边界的距离(当t=父元素高-子元素高时，刚好子元素放在父元素最下边)
                    if(t>obox.clientHeight - box.clientHeight){
                        t = obox.clientHeight - box.clientHeight;
                    }
                    box.style.left = l + 'px';
                    box.style.top = t + 'px';
                }
            }
            document.onmouseup=function(){
                // 存入坐标百分比
                that.offsetLeft = ((box.offsetLeft / that.imgWidth) * 100).toFixed(1);
                that.offsetTop = ((box.offsetTop / that.imgHeight) * 100).toFixed(1);
                that.isDrag = false;
                document.onmousemove = null;
                document.onmouseup = null; //鼠标抬起来后，onmouseup事件本身也没意义了，所以最好清理掉
            }
            return false //阻止默认行为，空的div在低版本ff下，第二次拖动手型会变异常
        }
    },
    // 返回大屏页面
    goBack() {
        // this.$router.replace('/largescreen/overview');
        this.$router.back(0);
    },
    // 标签页切换
    handleClick(tab, event) {
        console.log(tab, event);
    },
    // 点击图上点获取坐标百分比（未用到）
    getLocations(e) {
        const imgHeight = this.$refs.shengyazhanImg[0].clientHeight;
        const imgWidth = this.$refs.shengyazhanImg[0].clientWidth;
        const offsetX = e.offsetX;
        const offsetY = e.offsetY;
        const top = ((offsetY / imgHeight) * 100).toFixed(1);
        const left = ((offsetX / imgWidth) * 100).toFixed(1);
    },
    // 打开摄像头图标信息的弹窗
    openImgDialog(data) {
      this.showImgDialog = true;
      this.imgSpanData = data;
      console.log(this.imgSpanData)
    },
    // 打开添加摄像头的弹窗
    openNewCameraDialog() {
        this.isAddCameraVisible = true;
        this.cameraForm.locations = this.offsetLeft + '%, ' + this.offsetTop + '%';
        this.cameraForm.styleLeft = this.offsetLeft + '%';
        this.cameraForm.styleTop = this.offsetTop + '%';
    },
    // 取消选择摄像头
    cancelChooseLocation() {
      this.isChooseLocationVisible = false;
      this.isAddIconVisible = false;
      this.cameraForm = { // 重置添加摄像头表单
        areaId: this.areaId,
        cameraIconName: null,
        cameraId: null,
        direction: null,
        imageId: 1,
        locations: null,
        styleLeft: null,
        styleTop: null,
        modelId: null,
      }
    },
    // 摄像头下拉列表改变事件
    cameraChange(val) {
        const that = this;
        this.cameraList.map(v => {
            if (v.cameraId === val) {
                that.smallType = v.smallType;
                that.cameraForm.modelId = v.modelId;
                return;
            }
        });
        if (this.smallType === "2") {
            this.isDirectionVisible = true;
        } else {
            this.cameraForm.direction = null;
            this.isDirectionVisible = false;
        }
    },
    // 摄像头方向下拉框改变事件
    changeDirection(val) {},
    // 地图添加摄像头
    submitCamera() {
        if (this.smallType === "1") { // 旋转式-球机
            this.cameraForm.cameraIconName = '旋转式-球机.png';
        } else if (this.smallType === "2") { // 固定式-枪机
            if (this.cameraForm.direction === 'shang') { // 方向：上
                this.cameraForm.cameraIconName = '固定式-枪机-上.png';
            } else if (this.cameraForm.direction === 'xia') { // 方向：下
                this.cameraForm.cameraIconName = '固定式-枪机-下.png';
            } else if (this.cameraForm.direction === 'zuo') { // 方向：左
                this.cameraForm.cameraIconName = '固定式-枪机-左.png';
            } else { // 方向：右
                this.cameraForm.cameraIconName = '固定式-机枪-右.png';
            }
        } else if (this.smallType === "3") { // 双目-半球
            this.cameraForm.cameraIconName = '双目-半球.png';
        } else if (this.smallType === "4") { // 远距离双目-球机
            this.cameraForm.cameraIconName = '远距离双目.png';
        } else if (this.smallType === "5") { // 旋转式-半球
            this.cameraForm.cameraIconName = '旋转式-半球.png';
        } else { // 固定式-半球
            this.cameraForm.cameraIconName = '旋转式-球机.png';
        }
        const param = [{
            imageId: this.cameraForm.imageId,
            areaId: this.cameraForm.areaId,
            cameraId: this.cameraForm.cameraId,
            styleLeft: this.cameraForm.styleLeft,
            styleTop: this.cameraForm.styleTop,
            cameraIconName: this.cameraForm.cameraIconName,
            modelId: this.cameraForm.modelId
        }];
        this.isAddCameraVisible = false;
        const that = this;
        saveLocation(param).then((response) => {
            that.isChooseLocationVisible = false; // 关闭弹窗
            that.isAddIconVisible = false; // 隐藏拖动按钮
            that.isDirectionVisible = false; // 隐藏方向下拉框
            that.cameraForm = { // 重置添加摄像头表单
              areaId: this.areaId,
              cameraIconName: null,
              cameraId: null,
              direction: null,
              imageId: 1,
              locations: null,
              styleLeft: null,
              styleTop: null,
              modelId: null,
            }
            that.getNotConfiguredCameraList(that.areaId);
            that.getLocationsByArea(that.areaId);
        });
    },
    // 删除摄像头事件
    deleteCamera() {
      const that = this;
      this.$confirm(
        '是否确认删除"' + this.imgSpanData.deviceName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
      .then(function() {
        const param = parseInt(that.imgSpanData.id) - 0;
        return deleteCameraLoction(param);
      })
      .then(() => {
        that.showImgDialog = false;
        that.getLocationsByArea(that.areaId);
        that.getNotConfiguredCameraList(that.areaId);
      })
      .catch(function() {});
    },

    // 视频设置
    // 获取摄像头列表
    getCameraList() {
      const that = this;
      let cameraTree = [];
      listCamera().then((response) => {
        cameraTree = response.rows;
        that.cameraAllList = response.rows;
        let areaIds = [];
        cameraTree.map(item => {
          if (!areaIds.includes(item.areaId)) {
            that.cameraOptions.push({
              value: item.areaId,
              label: item.area.areaName,
              children: []
            });
            areaIds.push(item.areaId)
          }
        });
        cameraTree.map(item => {
          that.cameraOptions.map(i => {
            if (item.areaId === i.value) {
              i.children.push({
                value: item.cameraId,
                label: item.cameraName
              });
            }
          });
        });
        that.getDefaultVideo(); // 获取默认监控
      });
    },
    // 获取大屏监控默认设置
    getDefaultVideo() {
      const that = this;
      getCameraDefaultSetting().then((response) => {
        if (response.data.defaultValue) { // 有默认设置
          const ids = response.data.defaultValue.split(',');
          this.currentVideoSetting = ids;
          that.setDefaultVideo(ids);
        } else {
          // 如果没有默认设置，则取所有摄像头的前四个显示
          this.currentVideoSetting = [that.cameraAllList[0].cameraId, that.cameraAllList[1].cameraId, that.cameraAllList[2].cameraId, that.cameraAllList[3].cameraId]
          this.setDefaultVideo(this.currentVideoSetting);
        }
      });
    },
    // 保存监控默认设置
    saveVideoSettings() { // 每个摄像头下拉框值为一个数组，[0]代表区域id [1]代表摄像头id
      const that = this;
      if (this.cameraOne.length > 0 && this.cameraTwo.length > 0 && this.cameraThree.length > 0 && this.cameraFour.length > 0) {
        this.currentVideoSetting = [this.cameraOne[1], this.cameraTwo[1], this.cameraThree[1], this.cameraFour[1]]; // 保存当前视频设置
        const param = {defaultValue: this.cameraOne[1] + ',' + this.cameraTwo[1] + ',' + this.cameraThree[1] + ','+ this.cameraFour[1]};
        saveCameraDefaultSetting(param).then((response) => {
          that.selectDisabled = true;
        });
      } else {
        this.$message.warning('请选全四个摄像头');
      }
    },
    // 取消修改
    canceVideoSettings() {
      this.selectDisabled = true;
      this.setDefaultVideo(this.currentVideoSetting);
    },
    // 根据id设置下拉框显示
    setDefaultVideo(ids) {
      const that = this;
      this.cameraOptions.map(v => {
        v.children.map(i => {
          if (i.value == ids[0]) {
            that.cameraOne = [v.value, i.value];
          } else if (i.value == ids[1]) {
            that.cameraTwo = [v.value, i.value];
          } else if (i.value == ids[2]) {
            that.cameraThree = [v.value, i.value];
          } else if (i.value == ids[3]) {
            that.cameraFour = [v.value, i.value];
          }
        });
      });
    },
  }
}
</script>
<style lang="scss" scoped>
.screen-container {
  padding: 16px 0;
  min-height: 100vh;
  background-image: linear-gradient(45deg, #09136c, #030839 50%),
            linear-gradient(-45deg, #09136c, #030839 50%);
  // background-image: linear-gradient(to bottom right, #09136c, #030839, #09136c);
  // background-color: #030839;
}
/**大标题 */
.screen-big-title {
  width: 100%;
  // height: 15vh;
  // background: url("../../../assets/image/largescreen-title.png");
  // background-size: 100% 100%;
  // height: 120px;
  img {
    width: 100%;
  }
}
.setting-content {
    padding: 0 20px;
}
// 地图样式
.imgcol {
    width: 100%;
    .imgdiv {
        padding: 10px;
        text-align: center;
        .lunbodiv {
            /deep/ .el-carousel__container {
                // height: 580px;
                height: 230px;
                position: relative;
                top: 0px;
                left: 0px;
            }
            .card_pre {
                width: 100%;
                .bgimg {
                    width: 100%;
                    // height: 580px;
                    height: 230px;
                    position: relative;
                    top: 0px;
                    left: 0px;
                }
                .bd_ccc {
                    // position: relative;
                    // top: 0px;
                    // display: flex;
                    .mg_20 {
                        // width: 18px;
                        // height: 18px;
                        width: 18px;
                        height: 18px;
                        margin-right: 300px;
                        img {
                            // width: 18px;
                            // height: 18px;
                            width: 18px;
                            height: 18px;
                            // font-size: 30px;
                            // color: firebrick;
                            position: absolute;
                            top: 10px;
                            left: 10px;
                        }
                    }
                    // .mg_20:hover {
                        //   cursor: pointer;
                    // }
                }
            }
        }
    }
}
.back-btn {
    position: absolute;
    left: 3%;
    top: 60px;
}
@media (max-width: 992px) {
    .screen-big-title {
    height: 70px;
  }
}
@media screen and (min-width: 993px) and (max-width: 1199px) {
    .screen-big-title {
        height: 100px;
    }
    .imgcol {
        width: 100%;
        .imgdiv {
            padding: 10px;
            text-align: center;
            .lunbodiv {
                /deep/ .el-carousel__container {
                    // height: 580px;
                    height: 330px;
                    position: relative;
                    top: 0px;
                    left: 0px;
                }
                .card_pre {
                    width: 100%;
                    .bgimg {
                        width: 100%;
                        // height: 580px;
                        height: 330px;
                        position: relative;
                        top: 0px;
                        left: 0px;
                    }
                    .bd_ccc {
                        // position: relative;
                        // top: 0px;
                        // display: flex;
                        .mg_20 {
                            // width: 18px;
                            // height: 18px;
                            width: 18px;
                            height: 18px;
                            margin-right: 300px;
                            img {
                                // width: 18px;
                                // height: 18px;
                                width: 18px;
                                height: 18px;
                                // font-size: 30px;
                                // color: firebrick;
                                position: absolute;
                                top: 10px;
                                left: 10px;
                            }
                        }
                        // .mg_20:hover {
                            //   cursor: pointer;
                        // }
                    }
                }
            }
        }
    }
    .back-btn {
        position: absolute;
        left: 3%;
        top: 60px;
    }
}
@media  screen and (min-width: 1200px) and (max-width: 1599px) {
    .screen-big-title {
        height: 120px;
    }
    .imgcol {
    width: 100%;
    .imgdiv {
      padding: 10px;
      text-align: center;
      .lunbodiv {
        /deep/ .el-carousel__container {
        //   height: 580px;
          height: 400px;
          position: relative;
          top: 0px;
          left: 0px;
        }
        .card_pre {
          width: 100%;
          .bgimg {
            width: 100%;
            // height: 580px;
            height: 400px;
            position: relative;
            top: 0px;
            left: 0px;
          }
          .bd_ccc {
            // position: relative;
            // top: 0px;
            // display: flex;
            .mg_20 {
              // width: 18px;
              // height: 18px;
              width: 18px;
              height: 18px;
              margin-right: 300px;
              img {
                // width: 18px;
                // height: 18px;
                width: 18px;
                height: 18px;
                // font-size: 30px;
                // color: firebrick;
                position: absolute;
                top: 10px;
                left: 10px;
              }
            }
            // .mg_20:hover {
            //   cursor: pointer;
            // }
          }
        }
      }
    }
    }
    .back-btn {
        position: absolute;
        left: 3%;
        top: 80px;
    }
}
@media  screen and (min-width: 1600px) and (max-width: 1920px) {
    .imgcol {
        width: 100%;
        .imgdiv {
            padding: 10px;
            text-align: center;
            .lunbodiv {
                /deep/ .el-carousel__container {
                    height: 580px;
                    position: relative;
                    top: 0px;
                    left: 0px;
                }
                .card_pre {
                    width: 100%;
                    .bgimg {
                        width: 100%;
                        height: 580px;
                        position: relative;
                        top: 0px;
                        left: 0px;
                    }
                    .bd_ccc {
                        // position: relative;
                        // top: 0px;
                        // display: flex;
                        .mg_20 {
                            // width: 18px;
                            // height: 18px;
                            width: 18px;
                            height: 18px;
                            margin-right: 300px;
                            img {
                                // width: 18px;
                                // height: 18px;
                                width: 18px;
                                height: 18px;
                                // font-size: 30px;
                                // color: firebrick;
                                position: absolute;
                                top: 10px;
                                left: 10px;
                            }
                        }
                        // .mg_20:hover {
                            //   cursor: pointer;
                        // }
                    }
                }
            }
        }
    }
    .back-btn {
        position: absolute;
        left: 3%;
        top: 100px;
    }
}
// 标签页标题样式
/deep/ .el-tabs__item.is-active {
    color: #ffffff;
}
/deep/ .el-tabs__item {
    color: rgba(255, 255, 255, 0.5);
}
// 提示文字样式
.tip-text {
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    padding: 0 10px;
}
// 按钮样式
.screen-choose-btn {
    background-image: linear-gradient(to right, #d239ff 0%, #f55664 100%);
    color: #ffffff;
    border: none;
    padding: 7px 15px !important;
    font-size: 12px;
    border-radius: 3px;
}
// 提示文字内容样式
.tooltip-content {
  color: #ffffff;
}
// 视频设置
.video-settings {
  color: #ffffff;
}
.video-settings-row {
  padding: 10px;
}
/deep/ .el-cascader .el-input .el-input__inner {
  background: transparent;
  color: #ffffff;
}
</style>
