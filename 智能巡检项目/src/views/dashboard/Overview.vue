<template>
<div :class="activeClass" :style="{height: height + 60 +'px'}">
  <h3 :class="titleClass">{{title}}</h3>
  <div class="imgcol" :style="{height: height + 30 +'px'}">
    <div class="imgdiv" :style="{height: height + 30 +'px'}">
      <el-carousel class="lunbodiv" indicator-position="none" :loop="false" :autoplay="false" :style="{height: height+5+'px'}">
        <el-carousel-item v-for="item in imglist" :key="item.id" class="el-carousel__container" :style="{height: height +'px'}">
          <div class="card_pre">
            <img :src="item.imgSrc" class="bgimg" :style="{height: height +'px'}">
            <div class="bd_ccc">
              <span class="mg_20" v-for="imgspan in item.ilist" :key="imgspan.ip" @click="showModal(imgspan)">
                <el-tooltip class="item" effect="dark" :content="imgspan.cameraName" placement="bottom">
                  <img :src="imgspan.tubiao" :style="imgspan.stylename">
                </el-tooltip>
              </span>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <el-dialog :title="videotitle" :visible.sync="videodiv" width="1050px" append-to-body @close="handleclose">
      <div class="videoIframe" v-if="isshowvideo">
        <iframe id="videoiframes" name="videoiframediv" :src="videoUrl" frameborder="0" scrolling="no" style="width:1000px; height:650px;z-index:-1;"></iframe>
      </div>
    </el-dialog>
  </div>
</div>

  
</template>

<script>
//全局获取告警图片IP地址和摄像头账户密码
import { listConfig } from "@/api/system/config"; 
import { listCamera } from "@/api/device/camera";
import { getAreaInfo } from "@/api/device/areaImage";
import { getToken } from "@/utils/auth";

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    // height: {
    //   type: String,
    //   default: '400px'
    // },
  },
  data() {
    return {
      title: '示意图',
      areaId: this.data.areaId,
      height:this.data.height,
      activeClass:this.data.activeClass,
      titleClass:this.data.titleClass,
      isClick:this.data.isClick,
      // 摄像头跳转页面
      videoUrl: "../../../../peidianshivideo/cn/demo.html",
      // 图片前的IP地址
      imageheader:"",
      srcList:[],
      imglist:[{
        id: '111',
        imgSrc: '',
        ilist: [],
      }],
      ipgather:[],
      //视频弹框 
      videotitle:"",
      videodiv:false,
      isshowvideo:false,
      cameradatalist:[], //摄像头列表,
      //heart
      heartcameraid:"",
      setIntervalheart:null,
    }
  },

  created(){
    // this.getInfo();
    this.getcameraList();
    this.getcameraip();
    window.sessionStorage.setItem("brearer",getToken());
    window.sessionStorage.setItem("httpurl",process.env.VUE_APP_BASE_API);
    clearInterval(window.sessionStorage.getItem("cleartimeinterval"));
  },
  destroyed:function() {
    // window.frames['videoiframediv'].userfunc();
    // window.frames['videoiframediv'].clickLogout();
  },

  methods: {
    getCameraIcon(name) {
        var imgs = {
            "固定式-枪机": require("../../assets/image/固定式-枪机.png"),
            "双目-半球": require("../../assets/image/双目-半球.png"),
            "旋转式-半球": require("../../assets/image/旋转式-半球.png"),
            "旋转式-球机": require("../../assets/image/旋转式-球机.png"),
            "远距离双目-球机": require("../../assets/image/远距离双目-球机.png"),
            "轨道机器人": require("../../assets/image/轨道机器人.png"),
        }

        return imgs[name]
    },

    getCameraIconKey(name) {
        var imgs = {
            "固定式-枪机": 'stationary',
            "双目-半球": 'shuangmu',
            "旋转式-半球": 'yuntai',
            "旋转式-球机":  'yuntai',
            "远距离双目-球机":  'shuangmu',
            "轨道机器人":  'robotyuntai',
        }

        return imgs[name]
    },

    getInfo() {
        //防止没有数据时页面报错
        if(this.areaId === undefined || this.areaId === null){
            return;
        }
      getAreaInfo(this.areaId).then((response) => {
          const res = response.data
          // const src = res.area.markedImageUrl
          // const baseMap = require("../../assets/image/" + src);
          const baseMap = process.env.VUE_APP_BASE_API + res.area.originalImageUrl
          const list = res.cameras.map(t => {
              return {
                'id': t.cameraId,
                'tubiao': this.getCameraIcon(t.camera.dictLabel),
                'ikey': this.getCameraIconKey(t.camera.dictLabel),
                'ip': t.camera.ip,
                'stylename': {
                  'left': t.styleLeft*100+'%',
                  'top': t.styleTop*100+'%',
                },
              }
          })
          this.title = res.area.imageName

          this.imglist[0].imgSrc = baseMap 
          this.imglist[0].ilist = list
          console.log(this.imglist,'-----集合');
          this.getImg()
      });
    },

    getcameraList(){
      listCamera().then(response => {
        console.log(response,"摄像头数据");
        this.cameradatalist = response.rows;
        this.getInfo()
      });
    },

    //动态获取告警图片IP地址
    getcameraip(){
      listConfig().then(response => {
        console.log(response.rows,'全局匹配的一些参数');
        response.rows.map((v)=>{
          // 图片服务器地址
          if(v.configKey == "server.fdfs.ip"){
            this.alarmimgipurl = v.configValue;
            window.sessionStorage.setItem("alarmimgipurl",this.alarmimgipurl);
          }
          // 摄像头账号
          if(v.configKey == "config.camera.username"){
            this.camerauser = v.configValue;
            window.sessionStorage.setItem("camerauser",this.camerauser);
          }
          // 摄像头密码
           if(v.configKey == "config.camera.password"){
            this.camerapassword = v.configValue;
            window.sessionStorage.setItem("camerapassword",this.camerapassword);
          }
          // NVR服务器IP
          if(v.configKey == "server.nvr.ip"){
            this.nvrip = v.configValue;
            window.sessionStorage.setItem("nvrip",this.nvrip);
          }
        })
      });
    },

    getImg() {
      var cameraipgather = {};
          this.ipgather = [];
          console.log("this.imglist[0].ilist",this.imglist[0].ilist,'--this.cameradatalist',this.cameradatalist);
          this.imglist[0].ilist.map((v)=>{
            this.cameradatalist.map((y)=>{
              if(y.ip == v.ip){
                v.cameraName = y.cameraName;
                v.cameraId = y.cameraId; //摄像头id
                v.hasNvr = y.hasNvr; //nvr 回放
                v.hasInfrared = y.hasInfrared //红热线
                v.hasTbk = y.hasTbk //对讲
                v.hasPtz = y.hasPtz //云台
              }
            })
            // console.log(v)
            cameraipgather={
              id:v.id,
              ip:v.ip,
              ikey:v.ikey,
              cameraName:v.cameraName,
              cameraId:v.cameraId,
              hasNvr:v.hasNvr,
              hasTbk:v.hasTbk,
              hasInfrared:v.hasInfrared,
              hasPtz:v.hasPtz
            }
            // cameraipgather.push(v.ip)
            this.ipgather.push(cameraipgather);
          })
          window.sessionStorage.setItem("ipgathers",JSON.stringify(this.ipgather));
          console.log(JSON.parse(window.sessionStorage.getItem("ipgathers")),'---ip集合');
    },


    // 点击视频弹框
    showModal(item) {
      console.log('this.data.activeClass====',this.data.activeClass);
      localStorage.removeItem("IsSetInterval");//清除heart标识缓存
      console.log("点击视频弹框",localStorage.getItem("IsSetInterval"));
      console.log(item.cameraId,"点击视频弹框打印缓存sxtcameraid==",window.sessionStorage.getItem("sxtcameraid"),
      'window.sessionStorage.getItem("cameraid")===',window.sessionStorage.getItem("cameraid"))
      window.sessionStorage.removeItem('sxtcameraid');
      window.sessionStorage.removeItem("cameraid");
      console.log(item,"点击视频弹框清除缓存cameraid====",window.sessionStorage.getItem("cameraid"))
      if(this.data.isClick == true){

      }else if(this.data.isClick == false){
        window.sessionStorage.setItem("sxtcameraid",item.cameraId);
        window.sessionStorage.setItem("sxtcameraName",item.cameraName);
        window.sessionStorage.setItem("sxtcameraip",item.ip);
        window.sessionStorage.setItem("sxtikey",item.ikey);
        window.sessionStorage.setItem("sxthasNvr",item.hasNvr);
        window.sessionStorage.setItem("sxthasInfrared",item.hasInfrared);
        window.sessionStorage.setItem("sxthasTbk",item.hasTbk);
        window.sessionStorage.setItem("sxthasPtz",item.hasPtz);
        this.isshowvideo = true;
        this.videotitle = "视频详情";
        this.videodiv = true;

        console.log("*******item----",item,'sxtcameraid=======',window.sessionStorage.getItem("sxtcameraid",item.cameraId))
        
        
      }
    },

    // 关闭视频
    handleclose(){
      window.frames['videoiframediv'].userfunc();
      window.frames['videoiframediv'].clickLogout();
      this.isshowvideo = false;

      //  hk 添加清除心跳标识
      localStorage.setItem("IsSetInterval", 1);
      console.log("点击了X",localStorage.getItem("IsSetInterval"));
    },
  },
  watch:{
    data(val){
      console.log(val,'------watch');
      this.areaId = val.areaId;
      this.height=val.height,
      this.activeClass=val.activeClass,
      this.titleClass=val.titleClass,
      this.isClick=val.isClick,
      this.getInfo();
    },
  }
}
</script>
<style lang="scss" scoped>
.pictureshow{
    // height: 400px;
    margin-top:10px;
    padding: 10px;
    background: #ffffff;

      .imgcol{
        width: 100%;
        // height: 450px;
        // background: #fff;
        // margin-bottom: 10px;

        .imgdiv{
          // height: 450px;
          padding: 10px;
          text-align: center;
        }

        .lunbodiv{
            // height: var(--height);

            /deep/ .el-carousel__container{
              // height: var(--height);
              position: relative;
              top: 0px;
              left: 0px;
            }
          .card_pre{
            width: 100%;
            // height: 400px;

            .bgimg{
              width: 100%;
              // height: 100%;
              position: relative;
              top: 0px;
              left: 0px;
            }

            .bd_ccc{
              .mg_20{
                width: 25px;
                height: 25px;
                img{
                  width: 25px;
                  height: 25px;
                  position: absolute;
                  top: 10px;
                  left: 10px;
                }
              }
              
              .mg_20:hover{
                cursor: pointer;
              }
            }
          }
        }
      }
}

/**风电厂全景图样式 */
.screen-quanjing {
  background: url("../../assets/image/largescreen-dcquanjing.png");
  background-size: 100% 100%;
  margin: 10px 5px;
  min-height: 200px;
  padding: 15px;
  .screen-title {
    color: #fff;
    font-weight: 500;
    border-bottom: 1px solid #f1f1f14d;
  }
}
@media  screen and (min-width: 1200px) and (max-width: 1599px) {
  .screen-quanjing {
    height: 320px !important;
    /**风电厂全景图样式 */
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
                width: 12px;
                height: 12px;
                margin-right: 300px;
                img {
                  // width: 18px;
                  // height: 18px;
                  width: 12px;
                  height: 12px;
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
  }
}
@media screen and (min-width: 1600px) and (max-width: 2300px) {
  .screen-quanjing {
    height: 400px !important;
    /**风电厂全景图样式 */
    .imgcol {
      width: 100%;
      .imgdiv {
        padding: 10px;
        text-align: center;
        .lunbodiv {
          /deep/ .el-carousel__container {
            // height: 580px;
            height: 300px;
            position: relative;
            top: 0px;
            left: 0px;
          }
          .card_pre {
            width: 100%;
            .bgimg {
              width: 100%;
              // height: 580px;
              height: 300px;
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
                width: 12px;
                height: 12px;
                margin-right: 300px;
                img {
                  // width: 18px;
                  // height: 18px;
                  width: 12px;
                  height: 12px;
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
  }
}
</style>


