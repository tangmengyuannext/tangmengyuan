<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    }, 
  },
  data() {
    return {
      chart: null,
      xaxisList: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title: {
            text: '分布情况'
        },
        tooltip: {

        },
        grid: {
          top: 50,
          left: '5%',
          right: '5%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.xaxisList
        },
        yAxis: {
          type: 'value',
          max:28,
          min:0,
          splitNumber:12
        },
        series: [{
          data: [7, 6, 9, 14, 18, 21, 26, 9, 14, 18, 21, 26],
          type: 'line',
          symbolSize:10
        }]
      })
    }
  },
  watch:{
    
  }
}
</script>
