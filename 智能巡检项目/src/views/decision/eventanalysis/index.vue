<template>
   <div class="app-container">
      <div class="main">
        <div class="bardiv">
          <el-row>
            <el-col :xs="24" :sm="24" :lg="12" class="card-panel-col">
              <div class="chart-wrapper">
                <line-bar/>
              </div>
            </el-col>
            <!-- <el-col :xs="24" :sm="24" :lg="8" v-if="false" class="card-panel-col">
              <div class="chart-wrapper">
                <pie-bar/>
              </div>
            </el-col> -->
            <el-col :xs="24" :sm="24" :lg="12" class="card-panel-col">
              <div class="chart-wrapper">
                <bars-bar/>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="tablediv">
          <el-table :data="tableData"  style="width: 100%" height="430">
            <el-table-column type="selection" align="center" width="55">
            </el-table-column>
            <el-table-column prop="bianhao" label="规则编号">
            </el-table-column>
            <el-table-column prop="name" label="规则名称">
            </el-table-column>
            <el-table-column prop="laiyuan" label="告警来源">
            </el-table-column>
            <el-table-column prop="zhonglei" label="告警种类">
            </el-table-column>
            <el-table-column prop="suanfa" label="告警算法">
            </el-table-column>
            <el-table-column prop="fazhi" label="升级阀值">
            </el-table-column>
            <el-table-column prop="shezhitime" label="设置时间">
            </el-table-column>
            <el-table-column prop="sheding" label="通知设定">
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </div>
      </div>
  </div>
</template>

<script>
import { } from "@/api/decision/eventanalysis";
import LineBar from './LineBar'
// import PieBar from './PieBar'
import BarsBar from './BarsBar'

export default {
  // name: "eventanalysis",
  components: {
    LineBar,
    // PieBar,
    BarsBar,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      tableData: [{
          bianhao: '10001',
          name: '告警通知',
          laiyuan: '一号摄像头',
          zhonglei: '视频识别',
          suanfa: '安全帽',
          fazhi: 200,
          shezhitime: 2020-12-26,
          sheding: "admin"
        }, {
          bianhao: '10002',
          name: '告警通知',
          laiyuan: '一号摄像头',
          zhonglei: '视频识别',
          suanfa: '安全帽',
          fazhi: 200,
          shezhitime: 2020-12-26,
          sheding: "admin"
        }, {
          bianhao: '10003',
          name: '告警通知',
          laiyuan: '一号摄像头',
          zhonglei: '视频识别',
          suanfa: '安全帽',
          fazhi: 200,
          shezhitime: 2020-12-26,
          sheding: "admin"
        },{
          bianhao: '10004',
          name: '告警通知',
          laiyuan: '一号摄像头',
          zhonglei: '视频识别',
          suanfa: '安全帽',
          fazhi: 200,
          shezhitime: 2020-12-26,
          sheding: "admin"
        }, {
          bianhao: '10005',
          name: '告警通知',
          laiyuan: '一号摄像头',
          zhonglei: '视频识别',
          suanfa: '安全帽',
          fazhi: 200,
          shezhitime: 2020-12-26,
          sheding: "admin"
        },{
          bianhao: '10006',
          name: '告警通知',
          laiyuan: '一号摄像头',
          zhonglei: '视频识别',
          suanfa: '安全帽',
          fazhi: 200,
          shezhitime: 2020-12-26,
          sheding: "admin"
        }, {
          bianhao: '10007',
          name: '告警通知',
          laiyuan: '一号摄像头',
          zhonglei: '视频识别',
          suanfa: '安全帽',
          fazhi: 200,
          shezhitime: 2020-12-26,
          sheding: "admin"
        }, {
          bianhao: '10008',
          name: '告警通知',
          laiyuan: '一号摄像头',
          zhonglei: '视频识别',
          suanfa: '安全帽',
          fazhi: 200,
          shezhitime: 2020-12-26,
          sheding: "admin"
        }, {
          bianhao: '10009',
          name: '告警通知',
          laiyuan: '一号摄像头',
          zhonglei: '视频识别',
          suanfa: '安全帽',
          fazhi: 200,
          shezhitime: 2020-12-26,
          sheding: "admin"
        }, {
          bianhao: '10010',
          name: '告警通知',
          laiyuan: '一号摄像头',
          zhonglei: '视频识别',
          suanfa: '安全帽',
          fazhi: 200,
          shezhitime: 2020-12-26,
          sheding: "admin"
        }],
       // 总条数
      total: 10,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    }
  },
  created() {
      
  },
  methods: {
    getList(){},
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  min-height: calc(100vh - 100px);
  background-color:#f0f2f5;
  .main{

    .bardiv{
      height: 410px;
      width: 100%;

      .card-panel-col {
        width: 49%;
        background: #ffffff;
        margin-right: 12px;
      }
      .card-panel-col:last-child{
        margin-right: 0px;
      }


      // .chart-wrapper{
      //   width: 98%;
      //   margin: 10px;
      // }
    }

    .tablediv{
      margin-top: 15px;
      background: #ffffff;
      height: 480px;
      padding: 5px;

      /deep/ .el-pagination {
        margin-top: -18px;
      }
    }
  }
}
</style>