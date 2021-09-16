<template>
  <div class="app-container">
    <div class="content">
      <el-col :xs="24" :sm="8" :lg="4" v-for="switchs in switchroom" :key="switchs.areaId">
        <router-link tag="dl" :to="linkaddress+switchs.areaId" class="link-details">
           <dt>
            <img src="../../../assets/image/gailan_peidianshi1.png" alt="">
          </dt>
          <dd>
            <span>
              {{switchs.areaName}}
            </span>
          </dd>
          <dd class="inline">
            <p>
              <span :class="switchs.alarmAmount > 0 ? red : nomal">告警：{{switchs.alarmAmount}}</span>
            </p>
          </dd>
          <dd class="inline">
            <p>
              事件：{{switchs.abnormalAmount}}
            </p>
          </dd>
        </router-link>
      </el-col>
    </div>
  </div>
</template>

<script>
  import { listSwitchRoom } from '@/api/survey/switchroom'

  export default {
    // name: "switchroom",
    data() {
      return {
        switchroom: [],
        red:"red",
        nomal:"nomal",
        queryParams: {},
        linkaddress: '/switchroom/details/switchdetails/',
        // linkaddressji: '/switchroom/details/Relay/'  //继电保护室
      }
    },
    created() {
      this.getList()
      // var query = this.$route.path.split('/')[this.$route.path.split('/').length - 1];
    },
    methods: {
      /** 查询区域列表 */
      getList() {
        this.queryParams = {
          areaType: '3'
        }
        listSwitchRoom().then(response => {
          console.log(response.data)
          this.switchroom = response.data
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .app-container {
    background-color: rgb(240, 242, 245);
    min-height: calc(100vh - 100px);
    padding: 16px;
  }

  .chart-wrapper {
    border-radius: 10px;
  }

.red{
    color: red;
    font-weight: normal !important;
}
.nomal{
    color: #515a6e;
    font-weight: normal !important;
}
  .content {
    width: 100%;
    min-height: calc(100vh - 100px);

    dl {
      padding: 20px;
      // width: 250px;
      /*height: 300px;*/
      text-align: center;
      background: #ffffff;
      margin-left: 10px;

      dt img {
        width: 75%;
        border-radius: 50%;
        // background: skyblue;
        padding: 6px;
      }

      dd {
        margin-top: 5px;
        font-size: 14px;
        line-height: 30px;
        span{
          font-weight: 700;
        /*    border-radius: 5px;*/
        /*    border: 1px solid #409eff;*/
        /*    padding: 5px;*/
        /*    background: #ecf5ff;*/
        /*    color: #409eff;*/
        }
        span:hover {
          cursor: pointer;
        }
      }
      .inline{
        width: 48%;
        display: inline-flex;
        flex-direction: column;
      }
    }
  }

  @media (max-width: 1024px) {
    .clear {
      clear: both;
    }
    .content {
      display: float;

      .el-col {
        width: 49%;
        margin-bottom: 10px;
      }
    }
  }
</style>
