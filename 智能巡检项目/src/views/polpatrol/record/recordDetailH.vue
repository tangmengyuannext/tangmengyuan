<template>
  <div class="app-container">
    <div class="topBody">
        <h2 style="color:#373737;font-size: 22px;">巡检详情</h2>
        <p>巡检计划名称:&nbsp;&nbsp;{{allRecordDataMsg.patrolName}}</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;完成时间:&nbsp;&nbsp;{{allRecordDataMsg.recordTime}}</p>
    </div>
    <div class="recordListBody" v-for="itemO in recordDetailItemsMsg" :key="itemO.itemId">
        <el-row>
            <el-col><div class="taskName">{{itemO.itemName}}</div></el-col>
        </el-row>
        <el-row>
            <el-col >
                <el-row :gutter="20" style="border-left:10px solid #3c91fe;">
                    <el-col :span="24">
                        <div class="presetList" v-for="itemT in itemO.detectionList" :key="itemT.detectionId">
                            <el-row><el-col><div class="spotName">{{itemT.detectionName}}</div></el-col></el-row>
                            <el-row>
                                <el-col :span="21">
                                    <!-- <div class="meterName"  v-for="item in meterData" :key="item.id">220kv UPS2号交流输出电压 -- 254.3</div> -->
                                    <div class="meterName"  v-for="itemx in itemT.meterdatas" :key="itemx.meterId">
                                        {{itemx.meterName}} : <span style="color:#1890FF">{{itemx.val}}</span>
                                    </div>
                                </el-col>
                                <el-col :span="3" v-if="itemO.calType != 32">
                                    <div class="lookImg" @click="lookImgClick(itemT.detectionUrl)">查看图片</div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                    <!-- <el-col :span="3">
                        <div class="lookImg" @click="dialogVisible = true">查看图片</div> 
                    </el-col> -->
                </el-row>
            </el-col>
        </el-row>
        <!-- <el-row>
            <el-col style="background: green;">
                <el-row :gutter="20" style="border-left:10px solid #3c91fe;">
                    <el-col :span="21" style="background: orange;">
                        <div class="presetList" v-for="itemT in siteDataMsg" :key="itemT">
                            <el-row><el-col><div class="spotName">关口表</div></el-col></el-row>
                            <el-row>
                                <el-col style="background:blue">
                                    <div class="meterName"  v-for="item in meterData" :key="item.id">220kv 1号主变   25</div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                    <el-col :span="3" style="background: red;">
                        <div class="lookImg" @click="dialogVisible = true">查看图片</div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row> -->
    </div>
    <el-dialog title="巡检图片" :visible.sync="dialogVisible" width="1000px" append-to-body>
            <img class="recordImg" :src="recordImgUrl" alt="">
    </el-dialog>
    
  </div>
</template>

<script>
// import a from "../../../assets/image/图片1.png"
import {recordDetailMsg} from "@/api/polpatrol/reportanalysis"
export default {
    data(){
        return{
            meterData:[1,2,2,2,2,2,2,2,2,2,22,],
            dialogVisible:false,
            recordId:undefined,
            recordDetailItemsMsg:[],
            allRecordDataMsg:{},
            // siteDataMsg:[],
            recordImgUrl:"",

        }
    },
    methods:{
        // xunjianrenwu(a){
        //     console.log("~~~~~~~~~~~~~~~",a.sitedatas)
        //     this.siteDataMsg=a.sitedatas;


        // },
        lookImgClick(imgUrl){
            this.dialogVisible = true
            console.log("~~~~~~~~~~~~~~~",imgUrl)
            this.recordImgUrl = imgUrl;

        },
        // 
        getRecordDetailList() {
          console.log("this.$route.query.recordId=====",this.$route.query.recordId)
          this.recordId =this.$route.query.recordId;
          this.loading = true;
          recordDetailMsg(this.recordId).then(response => {
                console.log("response********",response)
                this.allRecordDataMsg = response;
                this.recordDetailItemsMsg = response.datas;
                this.loading = false;
          });
        },

    },
    mounted(){

        this.getRecordDetailList();
        
    }

}
</script>

<style lang="scss" scoped>
.topBody{
    // background: olive;
    width: 100%;
    height: 139px;
    border-bottom:1px solid #E6E6E6;
    p{
        margin-top: 20px;
    }
}
.recordListBody{
    .taskName{
        height: 74px;
        width: 100%;
        // background: coral;
        font-size: 22px;
        color: #373737;
        line-height: 74px;
    }
    .lookImg{
        width: 80px;
        height: 30px;
        background: #1890FF;
        border-radius: 3px;
        font-size: 12px;
        color: #FFFFFF;
        line-height: 30px;
        text-align: center;
        // margin-top: 70px;

    }
    .presetList{
        // background: chartreuse;
        border-bottom: 1px solid #E6E6E6;
        .spotName{
            width: 80%;
            height: 74px;
            // background: cornflowerblue;
            font-size: 16px;
            color: #606266;
            line-height: 74px;
            margin-left: 29px;
        }
        .meterName{
            width: 200px;
            height: 18px;
            // background: crimson;
            font-size: 12px;;
            color: #606266;
            margin-left: 29px;
            margin-right: 40px;
            margin-bottom: 15px;
            display: inline-block;
        }
    }
}
.recordImg{
    width: 968px;
    height: 412px;
    border-radius: 3px;
}

</style>