<template>
  <div>

    <el-carousel :interval="3000" direction="vertical" :autoplay="true" style="width: 500px; height: 25px;">
      <el-carousel-item v-for="item, index in carouselList" :key="index">
        <div style="font-size: small;">
          <span v-if="item.alarmLevel == '紧急'" style="color: #db0000; font-weight: bold;">
            <img :src="urgentSrc" class="alarm-img"/>
            {{item.alarmLevel}}
          </span>
          <span v-if="item.alarmLevel == '重要'" style="color: #f5a800; font-weight: bold;">
            <img :src="importantSrc" class="alarm-img"/>
            {{item.alarmLevel}}
          </span>
          <span v-if="item.alarmLevel == '次要'" style="color: #ffdc51; font-weight: bold;">
            <img :src="secondarySrc" class="alarm-img"/>
            {{item.alarmLevel}}
          </span>
          <span v-if="item.alarmLevel == '提示'" style="color: #24dce5; font-weight: bold;">
            <img :src="promptSrc" class="alarm-img"/>
            {{item.alarmLevel}}
          </span>
          <span style="margin-left: 5px">{{item.areaName}}{{item.equipmentName}}{{item.defectName}}告警！</span>
          <span style="margin-left: 5px">{{item.eventTime}}</span>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>

</template>

<script>
  import { getAlarmRealList, getAllAlarmList } from '../../api/overview/overview'
  import UrgentSrc from '../../assets/image/紧急@2x.png'
  import ImportantSrc from '../../assets/image/重要@2x.png'
  import SecondarySrc from '../../assets/image/次要@2x.png'
  import PromptSrc from '../../assets/image/提示@2x.png'

  export default {
    name: 'AlarmCarousel',
    data() {
      return {
        carouselList: [],
        alarmLevelsKV: {
          '1': '紧急',
          '2': '重要',
          '3': '次要',
          '4': '提示'
        },
        queryParams: {
          pageNum: 1,
          pageSize: 10
        },
        urgentSrc: UrgentSrc,
        importantSrc: ImportantSrc,
        secondarySrc: SecondarySrc,
        promptSrc: PromptSrc
      }
    },
    created() {
      setInterval(this.timer, 20000);
      this.getCarouselListData()
    },
    methods: {
      timer: function () {
        this.getCarouselListData();
      },
      getCarouselListData() {
        const param = {confirmStatus: 0}
        getAllAlarmList(param).then((response) => {
          let list = response.data
          for (let item of list) {
            item.alarmLevel = this.alarmLevelsKV[item.alarmLevel]
          }
          if (JSON.stringify(this.carouselList) != JSON.stringify(list)) {
            console.log('getCarouselListData', response)
            this.carouselList = list
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .alarm-img {
    width: 19px;
    height: 19px;
    position: relative;
    top: 3px;
  }
</style>
