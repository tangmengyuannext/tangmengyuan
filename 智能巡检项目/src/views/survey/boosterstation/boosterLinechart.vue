<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  import resize from '../../dashboard/mixins/resize'

  export default {
    mixins: [resize],
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
        default: '350px'
      },
      autoResize: {
        type: Boolean,
        default: true
      },
      chartData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        chart: null,
        colors: ['#1890FF', '#51B6FF', '#FFDC51', '#78CDD1', '#2657FF', '#0babbe', '#34f0e0', '#7575f5', '#0ECEFF', '#6affec']
      }
    },
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          this.chart.dispose();
          this.chart = echarts.init(this.$el, 'macarons')
          this.setOptions(val)
        }
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
        this.setOptions(this.chartData)
      },
      setOptions({ expectedData, xAxisDate, legendData } = {}) {
        this.chart.setOption({
          legend: {
            x: 'center',
            y: 'top',
            type: 'scroll',
            data: legendData
          },
          color: this.colors,
          xAxis: {
            data: xAxisDate,
            boundaryGap: false,
            axisTick: {
              show: true
            },
          },
          grid: {
            left: 10,
            right: 10,
            bottom: 20,
            top: 30,
            containLabel: true
          },
          tooltip: {
            confine: true,
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            padding: [5, 10]
          },
          yAxis: {
            axisTick: {
              show: false
            }
          },
          series: expectedData,
          // series:[{
          //   name: 'Amount', itemStyle: {
          //     normal: {
          //       color: '#FF005A',
          //       lineStyle: {
          //         color: '#FF005A',
          //         width: 2
          //       }
          //     }
          //   },
          //   smooth: false,
          //   type: 'line',
          //   data: expectedData,
          //   animationDuration: 2800,
          //   animationEasing: 'cubicInOut'
          // }]
        })
      }
    }
  }
</script>
