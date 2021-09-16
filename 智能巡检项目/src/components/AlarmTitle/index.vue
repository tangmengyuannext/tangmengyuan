<template>
    <div class="alarmtitle">
        <el-carousel height="50px" direction="vertical" :autoplay="false">
            <el-carousel-item v-for="item in 3" :key="item">
                <h3 class="medium">{{ item }}</h3>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
import { listAlarm } from "@/api/survey/fan/fan";
export default {
  data() {
    return {
      alarmdatalist:[]
    }
  },
  watch: {
    
  },
  created() {
    this.getAlarmlist();
  },
  methods: {
     /** 查询全部告警列表 */
    getAlarmlist(){
        listAlarm().then(response => {
            console.log(response,'告警列表');
            this.alarmdatalist = response.data;
        })
    },
  }
}
</script>

<style lang="scss" scoped>
.alarmtitle{
    width: 50%;
    display: inline-block;
    line-height: 50px;
    text-align: center;
    margin-left: 8px;
}
</style>
